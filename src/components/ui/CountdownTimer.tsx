
"use client"

import React, { useState, useEffect } from "react"
import { Clock, BellRing, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface CountdownTimerProps {
  appointmentDate: string // YYYY-MM-DD
  appointmentTime: string // HH:MM AM/PM
  doctorName?: string
}

export function CountdownTimer({ appointmentDate, appointmentTime, doctorName }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null)
  const [isNotified, setIsNotified] = useState(false)
  const [status, setStatus] = useState<"upcoming" | "happening_now" | "past">("upcoming")

  useEffect(() => {
    // Parse the appointment date and time
    // Expected format: Date: YYYY-MM-DD, Time: e.g., "10:30 AM" or "14:30"
    
    // Quick and dirty parser for time
    let timeStr = appointmentTime
    let [time, modifier] = timeStr.split(" ")
    let [hours, minutes] = time.split(":")
    
    let hoursNum = parseInt(hours, 10)
    if (modifier?.toUpperCase() === "PM" && hoursNum < 12) hoursNum += 12
    if (modifier?.toUpperCase() === "AM" && hoursNum === 12) hoursNum = 0
    
    const targetDate = new Date(`${appointmentDate}T${hoursNum.toString().padStart(2, "0")}:${minutes}:00`)

    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference > 0) {
        // If we are within 5 minutes, trigger the notification (if not already triggered)
        if (difference <= 5 * 60 * 1000 && !isNotified) {
          setIsNotified(true)
        }

        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
        setStatus("upcoming")
      } else if (difference > -60 * 60 * 1000) { // Within 1 hour after start
        setTimeLeft(null)
        setStatus("happening_now")
        if (!isNotified) setIsNotified(true)
      } else {
        setTimeLeft(null)
        setStatus("past")
      }
    }

    // Run once immediately
    calculateTimeLeft()
    
    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [appointmentDate, appointmentTime, isNotified])

  // Custom In-App Notification Toast that pops up when time is near
  const renderNotification = () => (
    <AnimatePresence>
      {isNotified && status !== "past" && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-6 right-6 z-50 bg-teal-600 text-white p-4 rounded-xl shadow-2xl shadow-teal-900/20 border border-teal-500 flex gap-4 max-w-sm"
        >
          <div className="bg-white/20 p-2 rounded-full h-fit flex-shrink-0">
            <BellRing className="w-6 h-6 text-white animate-bounce" />
          </div>
          <div>
            <h4 className="font-bold text-lg mb-1">Appointment Starting Soon!</h4>
            <p className="text-teal-50 text-sm">
              Your appointment {doctorName ? `with Dr. ${doctorName}` : ""} is happening {status === "happening_now" ? "right now" : "in less than 5 minutes"}. Please head to the clinic or prepare for your consultation.
            </p>
            <button 
              onClick={() => setIsNotified(false)} 
              className="mt-3 text-xs font-semibold bg-white text-teal-700 px-3 py-1.5 rounded hover:bg-teal-50 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  if (status === "past") return null

  if (status === "happening_now") {
    return (
      <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 p-4 rounded-xl flex items-center gap-3">
        {renderNotification()}
        <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        <span className="font-medium text-teal-800 dark:text-teal-300">Your appointment is happening right now!</span>
      </div>
    )
  }

  if (!timeLeft) return null

  return (
    <div className="bg-surface-raised dark:bg-slate-900 border border-border-default rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {renderNotification()}
      
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-accent-bg" />
        <h3 className="font-semibold text-tx-primary">Time until appointment</h3>
      </div>
      
      <div className="flex gap-2 text-center">
        {timeLeft.days > 0 && (
          <div className="bg-surface dark:bg-slate-800 border border-border-default rounded-lg px-3 py-2 w-16">
            <span className="block text-xl font-bold text-accent-bg">{timeLeft.days}</span>
            <span className="text-[10px] uppercase font-semibold text-tx-muted">Days</span>
          </div>
        )}
        <div className="bg-surface dark:bg-slate-800 border border-border-default rounded-lg px-3 py-2 w-16">
          <span className="block text-xl font-bold text-accent-bg">{timeLeft.hours.toString().padStart(2, "0")}</span>
          <span className="text-[10px] uppercase font-semibold text-tx-muted">Hrs</span>
        </div>
        <div className="bg-surface dark:bg-slate-800 border border-border-default rounded-lg px-3 py-2 w-16">
          <span className="block text-xl font-bold text-accent-bg">{timeLeft.minutes.toString().padStart(2, "0")}</span>
          <span className="text-[10px] uppercase font-semibold text-tx-muted">Min</span>
        </div>
        <div className="bg-surface dark:bg-slate-800 border border-border-default rounded-lg px-3 py-2 w-16">
          <span className="block text-xl font-bold text-accent-bg">{timeLeft.seconds.toString().padStart(2, "0")}</span>
          <span className="text-[10px] uppercase font-semibold text-tx-muted">Sec</span>
        </div>
      </div>
    </div>
  )
}

