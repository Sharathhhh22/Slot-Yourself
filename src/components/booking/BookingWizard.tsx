"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Activity, MapPin, Calendar as CalendarIcon, User, CheckCircle2 } from "lucide-react"

import { Step1Concern } from "./Step1Concern"
import { Step2Clinic } from "./Step2Clinic"
// import { Step3DateTime } from "./Step3DateTime"
// import { Step4Details } from "./Step4Details"
// import { Step5Review } from "./Step5Review"
// import { Step6Confirmation } from "./Step6Confirmation"

const steps = [
  { id: 1, title: "Concern", icon: Activity },
  { id: 2, title: "Clinic & Doctor", icon: MapPin },
  { id: 3, title: "Date & Time", icon: CalendarIcon },
  { id: 4, title: "Details", icon: User },
  { id: 5, title: "Review", icon: CheckCircle2 },
]

export function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(1) // 1 for forward, -1 for backward

  // Global booking state
  const [bookingData, setBookingData] = useState({
    concern: "",
    aiAnalysis: null,
    clinicId: null,
    doctorId: null,
    date: null,
    time: null,
    details: {
      dob: "",
      height: "",
      weight: "",
      notes: "",
      consent: false,
    }
  })

  const nextStep = () => {
    if (currentStep < 6) {
      setDirection(1)
      setCurrentStep(s => s + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection(-1)
      setCurrentStep(s => s - 1)
    }
  }

  const updateData = (key: string, value: any) => {
    setBookingData(prev => ({ ...prev, [key]: value }))
  }

  const variants = {
    initial: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeInOut" }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    })
  }

  return (
    <div className="max-w-4xl mx-auto min-h-[600px] flex flex-col">
      {/* Progress Indicator */}
      {currentStep < 6 && (
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full -z-10"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-600 rounded-full -z-10 transition-all duration-500 ease-in-out"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
            
            {steps.map((s) => {
              const isActive = s.id === currentStep
              const isPassed = s.id < currentStep
              return (
                <div key={s.id} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${isActive ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30' : isPassed ? 'bg-primary-600 text-white' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-semibold ${isActive ? 'text-slate-900' : isPassed ? 'text-primary-700' : 'text-slate-400'}`}>
                    {s.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative min-h-[500px] flex flex-col">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex-1 p-6 md:p-10 flex flex-col"
          >
            {currentStep === 1 && (
              <Step1Concern 
                data={bookingData} 
                updateData={updateData} 
                onNext={nextStep} 
              />
            )}
            {currentStep === 2 && (
              <Step2Clinic 
                data={bookingData} 
                updateData={updateData} 
                onNext={nextStep} 
              />
            )}
            {/* 
            {currentStep === 3 && <Step3DateTime />}
            {currentStep === 4 && <Step4Details />}
            {currentStep === 5 && <Step5Review />}
            {currentStep === 6 && <Step6Confirmation />}
            */}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Footer (only show if not step 1 because Step 1 handles its own 'next' after AI finishes, and not step 6) */}
        {currentStep > 1 && currentStep < 6 && (
          <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50 mt-auto">
            <Button variant="outline" onClick={prevStep} className="font-semibold text-slate-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={nextStep} className="bg-slate-900 text-white hover:bg-slate-800 font-semibold px-8">
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
