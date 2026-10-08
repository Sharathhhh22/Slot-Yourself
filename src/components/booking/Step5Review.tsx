"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, CheckCircle2, Loader2, Calendar, Clock, MapPin, UserCheck, ShieldCheck, CreditCard } from "lucide-react"

interface Step5Props {
  data: any
  updateData: (key: string, value: any) => void
  onNext: () => void
  onPrev: () => void
}

export function Step5Review({ data, updateData, onNext, onPrev }: Step5Props) {
  const [shareData, setShareData] = useState(true)
  const [isLoadingOnline, setIsLoadingOnline] = useState(false)
  const [isLoadingClinic, setIsLoadingClinic] = useState(false)
  const [error, setError] = useState("")

  const getPayload = () => ({
    appointmentId: data.appointmentId,
    dob: data.dob,
    height: data.height,
    weight: data.weight,
    guardianName: data.guardianName,
    shareData,
    concern: shareData ? data.concern : null,
    aiSummary: shareData ? data.aiAnalysis?.plain_language_summary : null
  })

  const handlePayAtClinic = async () => {
    setIsLoadingClinic(true)
    setError("")

    try {
      const res = await fetch('/api/appointments/confirm', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getPayload())
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || "Failed to confirm appointment")
      }

      onNext()

    } catch (err: any) {
      setError(err.message)
      setIsLoadingClinic(false)
    }
  }

  const handlePayOnline = async () => {
    setIsLoadingOnline(true)
    setError("")

    try {
      const res = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getPayload())
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || "Failed to initiate payment")
      }

      if (result.paymentUrl) {
        window.location.href = result.paymentUrl
      } else {
        throw new Error("No payment URL received")
      }

    } catch (err: any) {
      setError(err.message)
      setIsLoadingOnline(false)
    }
  }

  const formatTime = (t: string) => {
    if (!t) return ""
    const [h, m] = t.split(':')
    const hour = parseInt(h, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour
    return `${displayHour}:${m} ${ampm}`
  }

  const isLoading = isLoadingClinic || isLoadingOnline

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Review & Confirm</h2>
        
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6 shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-primary-600" />
              Appointment Details
            </h3>
          </div>
          <div className="p-4 sm:p-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Date & Time</p>
              <p className="font-semibold text-slate-900">{new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              <p className="text-slate-600 font-medium flex items-center mt-1">
                <Clock className="w-4 h-4 mr-1 text-slate-400" />
                {formatTime(data.time)}
              </p>
            </div>
            
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Doctor & Clinic</p>
              <p className="font-semibold text-slate-900 flex items-center">
                <UserCheck className="w-4 h-4 mr-1 text-slate-400" />
                Dr. {data.doctorName}
              </p>
              <p className="text-slate-600 font-medium flex items-center mt-1">
                <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                {data.clinicName}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6 shadow-sm">
           <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-2 text-primary-600" />
              Doctor Context Sharing
            </h3>
            <Switch 
              checked={shareData} 
              onCheckedChange={setShareData} 
              aria-label="Share context with doctor"
            />
          </div>
          <div className="p-4 sm:p-6">
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Sharing this context helps Dr. {data.doctorName} prepare for your visit before you arrive. 
              If disabled, the doctor will only see your name and age.
            </p>
            
            <div className={`transition-all duration-300 overflow-hidden ${shareData ? 'opacity-100 max-h-[500px]' : 'opacity-50 max-h-[200px] grayscale pointer-events-none'}`}>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">What will be shared:</p>
                <ul className="space-y-3">
                  <li className="text-sm">
                    <span className="font-medium text-slate-900">Your Concern:</span> "{data.concern}"
                  </li>
                  {data.aiAnalysis?.plain_language_summary && (
                    <li className="text-sm">
                      <span className="font-medium text-slate-900">AI Summary:</span> {data.aiAnalysis.plain_language_summary}
                    </li>
                  )}
                  <li className="text-sm text-slate-600">
                    <span className="font-medium text-slate-900">Vitals:</span> Age: {data.age} 
                    {data.height && ` • Height: ${data.height}cm`}
                    {data.weight && ` • Weight: ${data.weight}kg`}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6 shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900 flex items-center">
              <CreditCard className="w-4 h-4 mr-2 text-primary-600" />
              Payment Options
            </h3>
            <span className="font-bold text-slate-900 bg-slate-200 px-3 py-1 rounded-full text-sm">
              ₹500 flat fee
            </span>
          </div>
          <div className="p-4 sm:p-6">
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Pay online now to secure your slot instantly, or pay when you visit the clinic.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button 
                onClick={handlePayOnline}
                disabled={isLoading}
                className="bg-slate-900 text-white hover:bg-slate-800 font-semibold h-12"
              >
                {isLoadingOnline ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CreditCard className="w-4 h-4 mr-2" />
                )}
                Pay Online (₹500)
              </Button>
              <Button 
                onClick={handlePayAtClinic}
                disabled={isLoading}
                variant="outline"
                className="font-semibold h-12 border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                {isLoadingClinic ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                )}
                Pay at Clinic
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm font-medium mb-6">
            {error}
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
        <Button variant="ghost" onClick={onPrev} disabled={isLoading} className="font-semibold text-slate-600">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
    </div>
  )
}
