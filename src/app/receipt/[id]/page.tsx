"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, CalendarDays, CheckCircle2, User, Phone, Mail, MapPin, Activity } from "lucide-react"

export default function ReceiptPage() {
  const params = useParams()
  const [appointment, setAppointment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAppointment() {
      try {
        if (!params.id) return
        
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('id', params.id as string)
          .single()

        if (error) throw error
        
        setAppointment(data)
      } catch (err: any) {
        console.error(err)
        setError("Could not find this appointment. It may have been deleted.")
      } finally {
        setLoading(false)
      }
    }

    fetchAppointment()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-slate-50">
        <div className="flex flex-col items-center">
          <CalendarDays className="h-8 w-8 animate-spin text-primary-600 mb-4" />
          <p className="text-slate-500 font-medium">Loading appointment details...</p>
        </div>
      </div>
    )
  }

  if (error || !appointment) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-slate-50">
        <Card className="w-full max-w-md text-center p-6">
          <p className="text-red-500 font-medium">{error || "Appointment not found."}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl p-6 md:p-8 bg-slate-50 min-h-[calc(100vh-3.5rem)]">
      <Card className="border-t-4 border-t-primary-600 shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-slate-900">Digital Pass</CardTitle>
          <p className="text-slate-500 text-sm">Please present this pass at the reception desk.</p>
        </CardHeader>
        <CardContent className="space-y-6 mt-4">
          
          <div className="rounded-lg bg-slate-100 p-4">
            <h3 className="font-semibold text-slate-800 mb-3 border-b border-slate-200 pb-2">Visit Information</h3>
            <div className="grid grid-cols-1 gap-y-3">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Clinic</p>
                  <p className="font-medium text-slate-900">{appointment.clinic}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Activity className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Department & Doctor</p>
                  <p className="font-medium text-slate-900">{appointment.department}</p>
                  <p className="text-sm text-slate-600">{appointment.doctor}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Date & Time</p>
                  <p className="font-medium text-slate-900">{appointment.appointment_date}</p>
                  <p className="text-sm text-slate-600">{appointment.appointment_time}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800 mb-3 border-b border-slate-200 pb-2">Patient Details</h3>
            <div className="grid grid-cols-1 gap-y-3">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-slate-400" />
                <p className="font-medium text-slate-900">{appointment.patient_name}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-slate-400" />
                <p className="text-slate-600">{appointment.mobile}</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-slate-400" />
                <p className="text-slate-600">{appointment.email}</p>
              </div>
              <div className="flex items-start gap-3 mt-1">
                <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                <p className="text-slate-600 text-sm">{appointment.address}</p>
              </div>
            </div>
          </div>
          
          {appointment.reason && (
            <div className="rounded-lg border border-slate-200 p-4 bg-yellow-50/50">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Stated Reason / Symptoms</p>
              <p className="text-slate-700 text-sm">{appointment.reason}</p>
            </div>
          )}

          <div className="pt-4 text-center">
            <p className="text-xs text-slate-400 font-mono">ID: {appointment.id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
