"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, CalendarDays, CheckCircle2, User, Phone, Mail, MapPin, Activity, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QRCodeSVG } from 'qrcode.react'

export default function ReceiptPage() {
  const params = useParams()
  const [appointment, setAppointment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    async function fetchAppointment() {
      try {
        if (!params.id) return
        
        // Use the secure RPC function to fetch the receipt without needing to be logged in
        const { data, error } = await supabase.rpc('get_receipt', { 
          receipt_id: params.id 
        })

        if (error) throw error
        if (!data) throw new Error("Not found")
        
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
          <CalendarDays className="h-8 w-8 animate-spin text-teal-600 mb-4" />
          <p className="text-slate-500 font-medium">Loading appointment details...</p>
        </div>
      </div>
    )
  }

  if (error || !appointment) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-slate-50">
        <Card className="w-full max-w-md text-center p-6 shadow-sm border-gray-100">
          <p className="text-red-500 font-medium">{error || "Appointment not found."}</p>
        </Card>
      </div>
    )
  }

  const handleDownloadPdf = () => { window.print() }

  return (
    <div className="container mx-auto max-w-2xl p-6 md:p-8 bg-slate-50 min-h-[calc(100vh-3.5rem)]">
      <Card className="border-t-4 border-t-teal-600 shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 mb-4 border border-teal-100">
            <CheckCircle2 className="h-8 w-8 text-teal-600" />
          </div>
          <CardTitle className="text-2xl text-slate-900 font-bold">Digital Pass</CardTitle>
          <p className="text-slate-500 text-sm mb-4">Please present this pass or QR code at the reception desk.</p>
          
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm inline-block mx-auto mb-6">
            <QRCodeSVG 
              value={appointment.id} 
              size={120}
              level="M"
              includeMargin={true}
            />
          </div>

          {appointment.ticket_number && (
            <div className="mx-auto mt-2 max-w-[250px] bg-teal-900 text-white rounded-xl py-3 text-2xl font-mono font-bold tracking-widest shadow-md">
              TICKET - {appointment.ticket_number.toString().padStart(3, '0')}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6 mt-4">
          
          <div className="rounded-xl bg-slate-100/80 p-5 border border-slate-200/60">
            <h3 className="font-semibold text-slate-800 mb-3 border-b border-slate-200 pb-2 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-teal-600" /> Visit Information
            </h3>
            <div className="grid grid-cols-1 gap-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Clinic</p>
                  <p className="font-medium text-slate-900">{appointment.clinic_name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Activity className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Department & Doctor</p>
                  <p className="font-medium text-slate-900">{appointment.department_name || 'N/A'}</p>
                  <p className="text-sm text-slate-600">Dr. {appointment.doctor_name || 'N/A'}</p>
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

          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 mb-3 border-b border-slate-200 pb-2 flex items-center gap-2">
              <User className="h-4 w-4 text-teal-600" /> Patient Details
            </h3>
            <div className="grid grid-cols-1 gap-y-3">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-slate-400" />
                <p className="font-medium text-slate-900">{appointment.patient_name || 'N/A'}</p>
              </div>
              {appointment.patient_mobile && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-slate-400" />
                  <p className="text-slate-600">{appointment.patient_mobile}</p>
                </div>
              )}
              {appointment.patient_email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-slate-400" />
                  <p className="text-slate-600">{appointment.patient_email}</p>
                </div>
              )}
              {appointment.patient_address && (
                <div className="flex items-start gap-3 mt-1">
                  <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                  <p className="text-slate-600 text-sm">{appointment.patient_address}</p>
                </div>
              )}
            </div>
          </div>
          
          {appointment.reason && (
            <div className="rounded-xl border border-amber-200 p-5 bg-amber-50">
              <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-2">Stated Reason / Symptoms</p>
              <p className="text-amber-900 text-sm whitespace-pre-line">{appointment.reason}</p>
            </div>
          )}

          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 mb-3 border-b border-slate-200 pb-2">Payment Details</h3>
            <div className="grid grid-cols-1 gap-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 font-medium">Method</span>
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                  appointment.payment_mode === 'ONLINE_PAYMENT' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {appointment.payment_mode === 'ONLINE_PAYMENT' ? 'ONLINE' : 'PAY AT CLINIC'}
                </span>
              </div>
              
              {appointment.payment_mode === 'ONLINE_PAYMENT' && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-sm text-slate-500 font-medium">Status</span>
                  <span className="text-sm font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                    Awaiting Verification
                  </span>
                </div>
              )}
            </div>
          </div>

          
          <div className="pt-6 text-center flex flex-col items-center gap-4">
            <p className="text-xs text-slate-400 font-mono">ID: {appointment.id}</p>
            <Button onClick={handleDownloadPdf} className="w-full max-w-xs bg-teal-600 hover:bg-teal-700 text-white h-12 text-base print:hidden rounded-xl">
              <Download className="w-4 h-4 mr-2" />
              Download Digital Pass
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
