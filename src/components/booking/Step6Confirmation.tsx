"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, Calendar, MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface Step6Props {
  data: any
}

export function Step6Confirmation({ data }: Step6Props) {
  const formatTime = (t: string) => {
    if (!t) return ""
    const [h, m] = t.split(':')
    const hour = parseInt(h, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour
    return `\${displayHour}:\${m} \${ampm}`
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95 duration-500">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 15, delay: 0.1 }}
        className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6"
      >
        <CheckCircle2 className="w-10 h-10" />
      </motion.div>
      
      <h2 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
      <p className="text-slate-500 max-w-md mb-8">
        Your appointment with Dr. {data.doctorName} has been successfully scheduled. We've sent a confirmation to your email.
      </p>

      <div className="w-full max-w-sm bg-slate-50 rounded-2xl border border-slate-200 p-6 text-left mb-8">
        <div className="flex items-start gap-3 mb-4">
          <Calendar className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-900">
              {new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-slate-500 text-sm mt-0.5">{formatTime(data.time)}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-900">{data.clinicName}</p>
            <p className="text-slate-500 text-sm mt-0.5">Please arrive 10 minutes early.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 w-full max-w-sm">
        <Button variant="outline" className="flex-1" asChild>
          <Link href="/dashboard">Home</Link>
        </Button>
        <Button className="flex-1 bg-slate-900 text-white hover:bg-slate-800" asChild>
          <Link href="/appointments">
            View My Appointments
          </Link>
        </Button>
      </div>
    </div>
  )
}
