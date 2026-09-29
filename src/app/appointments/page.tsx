import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Plus } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export const revalidate = 0 // Always fetch latest data

export default async function AppointmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile to check role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  const isAdminOrStaff = profile?.role === 'admin' || profile?.role === 'staff'

  const { data: appointments } = await supabase
    .from('appointments_v2')
    .select(`
      id, appointment_date, appointment_time, status, reason,
      doctors(name),
      clinics(name),
      departments(name),
      profiles(full_name, mobile)
    `)
    .order('appointment_date', { ascending: false })

  const upcoming = appointments?.filter(a => a.status === 'upcoming') || []
  const past = appointments?.filter(a => a.status !== 'upcoming') || []

  return (
    <div className="container mx-auto p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Appointments History</h2>
          <p className="text-slate-500">
            {isAdminOrStaff ? "Manage all clinic appointments." : "View your past and upcoming appointments."}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/appointments/new">
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="mt-8 space-y-8">
        
        {/* Upcoming Appointments */}
        <Card className="border-blue-100">
          <CardHeader className="bg-blue-50/50 rounded-t-lg pb-4">
            <CardTitle className="text-blue-900">Upcoming Appointments</CardTitle>
            <CardDescription>
              Scheduled visits that have not yet occurred.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  {isAdminOrStaff && <TableHead>Patient</TableHead>}
                  <TableHead>Doctor</TableHead>
                  <TableHead>Clinic</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcoming.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdminOrStaff ? 5 : 4} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-500">
                        <Calendar className="mb-2 h-8 w-8 text-slate-400" />
                        <p>No upcoming appointments found.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  upcoming.map((apt: any) => (
                    <TableRow key={apt.id}>
                      <TableCell className="font-medium">
                        {apt.appointment_date} <br/>
                        <span className="text-xs text-slate-500">{apt.appointment_time}</span>
                      </TableCell>
                      {isAdminOrStaff && (
                        <TableCell>
                          <div className="font-medium">{apt.profiles?.full_name}</div>
                          <div className="text-xs text-slate-500">{apt.profiles?.mobile || 'No mobile'}</div>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="font-medium">Dr. {apt.doctors?.name}</div>
                        <div className="text-xs text-slate-500">{apt.departments?.name}</div>
                      </TableCell>
                      <TableCell>{apt.clinics?.name}</TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          Upcoming
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Past Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Past Appointments</CardTitle>
            <CardDescription>
              History of completed or cancelled visits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  {isAdminOrStaff && <TableHead>Patient</TableHead>}
                  <TableHead>Doctor</TableHead>
                  <TableHead>Clinic</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {past.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdminOrStaff ? 5 : 4} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-500">
                        <Calendar className="mb-2 h-8 w-8 text-slate-300" />
                        <p>No past appointments found.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  past.map((apt: any) => (
                    <TableRow key={apt.id}>
                      <TableCell className="font-medium text-slate-500">
                        {apt.appointment_date} <br/>
                        <span className="text-xs text-slate-400">{apt.appointment_time}</span>
                      </TableCell>
                      {isAdminOrStaff && (
                        <TableCell>
                          <div className="font-medium text-slate-700">{apt.profiles?.full_name}</div>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="font-medium text-slate-700">Dr. {apt.doctors?.name}</div>
                        <div className="text-xs text-slate-400">{apt.departments?.name}</div>
                      </TableCell>
                      <TableCell className="text-slate-500">{apt.clinics?.name}</TableCell>
                      <TableCell className="text-right">
                        {apt.status === 'completed' && (
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            Completed
                          </span>
                        )}
                        {apt.status === 'cancelled' && (
                          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                            Cancelled
                          </span>
                        )}
                        {apt.status === 'no_show' && (
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                            No Show
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
