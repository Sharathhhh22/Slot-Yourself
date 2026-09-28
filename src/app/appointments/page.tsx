import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Plus } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export const revalidate = 0 // Always fetch latest data

export default async function AppointmentsPage() {
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto p-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Appointments History</h2>
          <p className="text-slate-500">View and manage all booked clinic appointments.</p>
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
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
            <CardDescription>
              A complete list of all patient appointments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Clinic</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead className="text-right">Mobile</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!appointments || appointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-500">
                        <Calendar className="mb-2 h-8 w-8 text-slate-400" />
                        <p>No appointments found.</p>
                        <p className="text-sm">Click 'New Appointment' to schedule one.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  appointments.map((apt) => (
                    <TableRow key={apt.id}>
                      <TableCell className="font-medium">
                        {apt.appointment_date} <br/>
                        <span className="text-xs text-slate-500">{apt.appointment_time}</span>
                      </TableCell>
                      <TableCell>{apt.patient_name}</TableCell>
                      <TableCell>{apt.clinic}</TableCell>
                      <TableCell>{apt.department}</TableCell>
                      <TableCell>{apt.doctor}</TableCell>
                      <TableCell className="text-right text-slate-500">{apt.mobile}</TableCell>
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
