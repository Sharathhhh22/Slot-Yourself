"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { PhoneCall, AlertTriangle, Loader2, PhoneForwarded } from "lucide-react"

interface EmergencyCallModalProps {
  isOpen: boolean
  onClose: () => void
  doctorId: string
  doctorName: string
  appointmentId?: string
}

const REASONS = [
  "Condition is rapidly worsening",
  "Experiencing severe new symptoms",
  "Medication adverse reaction",
  "Running late / Logistics emergency"
]

export function EmergencyCallModal({ isOpen, onClose, doctorId, doctorName, appointmentId }: EmergencyCallModalProps) {
  const [reason, setReason] = useState(REASONS[0])
  const [status, setStatus] = useState<'idle' | 'calling' | 'no_answer' | 'connected' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState("")

  const handleCall = async () => {
    setStatus('calling')
    setErrorMsg("")

    try {
      const res = await fetch('/api/emergency/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId, appointmentId, reason })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate call")
      }

      // In a real scenario with Twilio WebSockets, we would listen for status updates.
      // For now, we simulate waiting for 30s. If we don't get a webhook update (mocked here),
      // we show the fallback after a timeout.
      
      // Simulating connection for UI purposes
      setTimeout(() => {
        if (data.message?.includes('Simulated')) {
          // If twilio isn't set up, mock no answer after 5s to show fallback
          setStatus('no_answer')
        } else {
          // Connected
          setStatus('connected')
        }
      }, 5000)

    } catch (err: any) {
      setStatus('error')
      setErrorMsg(err.message)
    }
  }

  const handleNotifyClinic = () => {
    // Mock notify clinic
    alert("The clinic has been notified. They will reach out to you shortly.")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600 gap-2">
            <AlertTriangle className="w-5 h-5" />
            Emergency Contact
          </DialogTitle>
          <DialogDescription>
            Contact Dr. {doctorName} immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-3 rounded-lg font-medium">
          If this is a life-threatening emergency, call your national emergency number (e.g. 911 or 112) now.
        </div>

        {status === 'idle' || status === 'error' ? (
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="text-slate-700 font-semibold">Select Reason:</Label>
              <RadioGroup value={reason} onValueChange={setReason} className="gap-2">
                {REASONS.map((r) => (
                  <div key={r} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <RadioGroupItem value={r} id={r} />
                    <Label htmlFor={r} className="flex-1 cursor-pointer">{r}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="text-xs text-slate-500 italic">
              Notice: To protect privacy, phone numbers are masked. Calls may be recorded for quality and legal purposes based on doctor settings.
            </div>

            {status === 'error' && (
              <div className="text-sm text-red-600 font-medium">
                {errorMsg}
              </div>
            )}

            <Button 
              onClick={handleCall}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12"
            >
              <PhoneCall className="w-5 h-5 mr-2" />
              Call Doctor {doctorName}
            </Button>
          </div>
        ) : status === 'calling' ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                <PhoneForwarded className="w-8 h-8 text-red-600 animate-bounce" />
              </div>
              <div className="absolute inset-0 border-4 border-red-500 rounded-full animate-ping opacity-20"></div>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Calling...</h3>
            <p className="text-sm text-slate-500 text-center max-w-[250px]">
              You will receive a phone call shortly to connect you. Please answer your phone.
            </p>
          </div>
        ) : status === 'no_answer' ? (
          <div className="flex flex-col py-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneCall className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Doctor is Unavailable</h3>
              <p className="text-sm text-slate-500">
                Dr. {doctorName} did not answer within 30 seconds. 
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <p className="text-sm font-semibold text-slate-700">Fallback Options:</p>
              
              <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white h-11">
                <a href="tel:911">Call National Emergency (911)</a>
              </Button>
              
              <Button onClick={handleNotifyClinic} variant="outline" className="w-full h-11">
                Notify Clinic by Message
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
             <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <PhoneCall className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Connected</h3>
              <p className="text-sm text-slate-500">
                The call has been established.
              </p>
              <Button onClick={onClose} variant="outline" className="mt-4">
                Close
              </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
