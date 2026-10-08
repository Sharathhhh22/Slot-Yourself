import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Clock, Activity, AlertCircle } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import EmergencyButton from "@/components/telephony/EmergencyButton"

export const revalidate = 0

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile to check role (using maybeSingle to prevent crashes if trigger failed)
  const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).maybeSingle()
  const isAdminOrStaff = profile?.role === 'admin' || profile?.role === 'staff'

  // Fetch appointments. 
  // If patient: fetch only their appointments.
  // If admin/staff: fetch all appointments.
  // We use Supabase relational queries to get nested data.
  let query = supabase
    .from('appointments')
    .select(`
      id, appointment_date, appointment_time, status, payment_mode, transaction_id, doctor_id,
      doctors(name),
      clinics(name),
      profiles(full_name)
    `)
    .order('appointment_date', { ascending: true })

  // RLS handles the filtering automatically! We don't even need to add .eq('patient_id') because the DB enforces it.
  
  const { data: appointments } = await query

  // Stats calculation
  const totalAppointments = appointments?.length || 0
  const upcomingAppointments = appointments?.filter(a => a.status === 'upcoming') || []
  
  // Calculate unique patients (only relevant for staff, but we can do it safely here)
  const uniquePatients = new Set(appointments?.map(a => (a.profiles as any)?.full_name)).size

  // We fetch doctors count for stats
  const { count: doctorsCount } = await supabase.from('doctors').select('*', { count: 'exact', head: true }).eq('is_active', true)

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-[1200px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="section-title text-slate-900">
            Welcome, {profile?.full_name || 'User'}
          </h2>
          <p className="text-slate-500 mt-1">{isAdminOrStaff ? 'Clinic Management Dashboard' : 'Your Patient Portal'}</p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isAdminOrStaff && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Unique Patients</CardTitle>
              <Users className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="card-title text-2xl text-slate-900">{uniquePatients}</div>
              <p className="text-xs text-slate-500">Registered in system</p>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{isAdminOrStaff ? 'Total Appointments' : 'My Appointments'}</CardTitle>
            <Calendar className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="card-title text-2xl text-slate-900">{totalAppointments}</div>
            <p className="text-xs text-slate-500">All time bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Doctors</CardTitle>
            <Activity className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="card-title text-2xl text-slate-900">{doctorsCount || 0}</div>
            <p className="text-xs text-slate-500">Active specialists</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Visits</CardTitle>
            <Clock className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="card-title text-2xl text-slate-900">{upcomingAppointments.length}</div>
            <p className="text-xs text-slate-500">Scheduled appointments</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>
              {isAdminOrStaff ? "The most recent bookings across all clinics." : "Your upcoming scheduled visits."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50">
                <div className="text-center">
                  <Calendar className="mx-auto h-8 w-8 text-slate-400" />
                  <h3 className="mt-2 text-sm font-semibold text-slate-900">No upcoming appointments</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    You have no scheduled visits at this time.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.slice(0, 5).map((apt: any) => (
                  <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 last:border-0 gap-4">
                    <div>
                      {isAdminOrStaff && <p className="font-semibold text-primary-700">{apt.profiles?.full_name}</p>}
                      <p className="font-medium text-slate-900">Dr. {apt.doctors?.name}</p>
                      <p className="text-sm text-slate-500">{apt.clinics?.name}</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="font-medium text-slate-900">{apt.appointment_date}</p>
                      <p className="text-sm text-slate-500">{apt.appointment_time}</p>
                      <div className="flex gap-2 justify-end mt-1">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          Upcoming
                        </span>
                        {apt.payment_mode === 'online' ? (
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
                            Paid Online
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-700/10">
                            Pay at Clinic
                          </span>
                        )}
                        {!isAdminOrStaff && (
                          <EmergencyButton 
                            doctorId={apt.doctor_id} 
                            doctorName={apt.doctors?.name} 
                            appointmentId={apt.id} 
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
