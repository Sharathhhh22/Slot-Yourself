import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Clock, Activity } from "lucide-react"
import { supabase } from "@/lib/supabase"

export const revalidate = 0

export default async function Dashboard() {
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false })

  const totalAppointments = appointments?.length || 0
  
  // Extract unique patients based on name
  const uniquePatients = new Set(appointments?.map(a => a.patient_name)).size

  return (
    <div className="container mx-auto p-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Unique Patients</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{uniquePatients}</div>
            <p className="text-xs text-slate-500">Registered in system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalAppointments}</div>
            <p className="text-xs text-slate-500">All time bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Doctors</CardTitle>
            <Activity className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">7</div>
            <p className="text-xs text-slate-500">Across 4 departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
            <Clock className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">12 min</div>
            <p className="text-xs text-slate-500">Based on recent visits</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Recent Appointment History</CardTitle>
            <CardDescription>
              The most recent bookings across all clinics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!appointments || appointments.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed border-slate-300">
                <div className="text-center">
                  <Calendar className="mx-auto h-8 w-8 text-slate-400" />
                  <h3 className="mt-2 text-sm font-semibold text-slate-900">No appointments</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    There are no appointments booked yet.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.slice(0, 5).map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <p className="font-medium text-slate-900">{apt.patient_name}</p>
                      <p className="text-sm text-slate-500">With {apt.doctor} • {apt.clinic}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">{apt.appointment_date}</p>
                      <p className="text-sm text-slate-500">{apt.appointment_time}</p>
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
