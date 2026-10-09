"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, Calendar, MapPin, FileText, CreditCard } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { QRCodeSVG } from 'qrcode.react'

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
    return `${displayHour}:${m} ${ampm}`
  }

  const isOnlinePayment = data.paymentMethod === "ONLINE_PAYMENT"

  const qrUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/receipt/${data.appointmentId}` 
    : `https://APPOINTLY-7afv.vercel.app/receipt/${data.appointmentId}`

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in-95 duration-500">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 15, delay: 0.1 }}
        className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-4"
      >
        <CheckCircle2 className="w-8 h-8" />
      </motion.div>
      
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Appointment Booked</h2>
      <p className="text-slate-500 max-w-md mb-6 text-sm">
        Your appointment with Dr. {data.doctorName} has been successfully scheduled.
      </p>

      {/* QR Code Container */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm mx-auto mb-6 flex flex-col items-center justify-center">
        <p className="text-xs text-slate-500 mb-2 font-medium tracking-wide uppercase">Digital Check-in Pass</p>
        <QRCodeSVG 
          value={qrUrl} 
          size={140}
          level="M"
          includeMargin={true}
          className="mx-auto"
        />
        <p className="text-[10px] text-slate-400 mt-2 font-mono">Scan to view receipt on phone</p>
      </div>

      <div className="w-full max-w-sm bg-slate-50 rounded-2xl border border-slate-200 p-5 text-left mb-8 space-y-4 shadow-sm">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-900">
              {data.date ? new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'N/A'}
            </p>
            <p className="text-slate-500 text-sm mt-0.5">{formatTime(data.time)}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-900">{data.clinicName}</p>
            <p className="text-slate-500 text-sm mt-0.5">Please arrive 10 minutes early.</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <div className="flex flex-col space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-1.5"><CreditCard className="w-4 h-4"/> Payment Method</span>
              <span className="font-medium text-slate-900">{isOnlinePayment ? "Online Payment" : "Pay at Clinic"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Status</span>
              <span className={`font-medium ${isOnlinePayment ? "text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md" : "text-slate-900"}`}>
                {isOnlinePayment ? "Awaiting Verification" : "Pay at clinic"}
              </span>
            </div>
          </div>
        </div>
      </div>

      
      <div className="flex gap-3 w-full max-w-sm">
        <Button variant="outline" className="flex-1 border-teal-200 text-teal-700 hover:bg-teal-50" asChild>
          <Link href="/dashboard">Home</Link>
        </Button>
        <Button className="flex-1 bg-teal-600 text-white hover:bg-teal-700" asChild>
          <Link href={`/receipt/${data.appointmentId}`}>
            <FileText className="w-4 h-4 mr-2" />
            Full Receipt
          </Link>
        </Button>
      </div>

    </div>
  )
}
