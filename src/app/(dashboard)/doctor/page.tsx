"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Clock, User, FileText, CheckCircle2, Activity, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmergencySettings } from "@/components/telephony/EmergencySettings"

export default function DoctorPortal() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [doctorProfile, setDoctorProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const supabase = createClient()

  useEffect(() => {
    async function fetchDoctorData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setError("Not authenticated")
          setLoading(false)
          return
        }

        // 1. Get the doctor record linked to this user
        const { data: doctorData, error: doctorError } = await supabase
          .from('doctors')
          .select('*')
          .eq('profile_id', user.id)
          .maybeSingle()

        if (doctorError || !doctorData) {
          setError("Doctor profile not found. Please contact administration to link your account.")
          setLoading(false)
          return
        }

        setDoctorProfile(doctorData)

        // 2. Get appointments for this doctor (today and future)
        // For now, let's just get upcoming and today's appointments
        const today = new Date().toISOString().split('T')[0]
        
        const { data: apptData, error: apptError } = await supabase
          .from('appointments')
          .select(`
            *,
            patient:profiles!appointments_patient_id_fkey(full_name, mobile, email)
          `)
          .eq('doctor_id', doctorData.id)
          .gte('appointment_date', today)
          .order('appointment_date', { ascending: true })
          .order('appointment_time', { ascending: true })

        if (apptError) throw apptError

        setAppointments(apptData || [])
      } catch (err: any) {
        console.error("Error fetching doctor data:", err)
        setError("Failed to load appointments.")
      } finally {
        setLoading(false)
      }
    }

    fetchDoctorData()
  }, [])

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      setAppointments(prev => prev.map(appt => 
        appt.id === id ? { ...appt, status: newStatus } : appt
      ))
    } catch (err) {
      console.error("Failed to update status", err)
      alert("Failed to update status")
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Activity className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center text-red-600">
            {error}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Doctor Portal</h1>
        <p className="text-slate-500 mt-2">Welcome back, Dr. {doctorProfile?.name}. Here is your schedule.</p>
      </div>

      <EmergencySettings doctorId={doctorProfile?.id} initialEnabled={doctorProfile?.emergency_calls_enabled ?? true} />

      <div className="grid gap-6">
        {appointments.length === 0 ? (
          <Card className="bg-slate-50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <CalendarDays className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-lg font-medium text-slate-900">No appointments scheduled</p>
              <p className="text-slate-500">You have a clear schedule right now.</p>
            </CardContent>
          </Card>
        ) : (
          appointments.map((appt) => (
            <Card key={appt.id} className={`overflow-hidden ${appt.status === 'completed' ? 'opacity-60' : ''}`}>
              <div className="flex flex-col md:flex-row">
                {/* Time & Date Block */}
                <div className="bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 p-6 flex md:flex-col items-center justify-between md:justify-center min-w-[200px]">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-1">
                      {new Date(appt.appointment_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">{appt.appointment_time.substring(0, 5)}</p>
                  </div>
                  {appt.ticket_number && (
                    <div className="mt-4 px-3 py-1 bg-slate-200 text-slate-700 rounded text-xs font-mono font-bold tracking-wider">
                      TICKET-{appt.ticket_number.toString().padStart(3, '0')}
                    </div>
                  )}
                </div>

                {/* Patient Info Block */}
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <User className="h-5 w-5 text-slate-400" />
                        {appt.patient?.full_name || 'Unknown Patient'}
                      </h3>
                      {appt.patient?.mobile && (
                        <p className="text-slate-500 text-sm mt-1">{appt.patient.mobile}</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      appt.status === 'completed' ? 'bg-green-100 text-green-700' :
                      appt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {appt.status}
                    </span>
                  </div>

                  {appt.reason && (
                    <div className="mb-6 bg-yellow-50/50 border border-yellow-100 rounded-lg p-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <FileText className="h-3 w-3" /> Reason / Symptoms
                      </p>
                      <p className="text-slate-700 text-sm">{appt.reason}</p>
                    </div>
                  )}

                  {/* Actions */}
                  {appt.status === 'upcoming' && (
                    <div className="flex gap-3 mt-4 border-t border-slate-100 pt-4">
                      <Button 
                        onClick={() => handleStatusUpdate(appt.id, 'completed')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Completed
                      </Button>
                      <Button 
                        onClick={() => handleStatusUpdate(appt.id, 'cancelled')}
                        variant="outline"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                        size="sm"
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
