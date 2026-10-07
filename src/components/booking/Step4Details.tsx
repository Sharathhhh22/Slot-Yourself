"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, ArrowLeft, ClipboardList } from "lucide-react"

interface Step4Props {
  data: any
  updateData: (key: string, value: any) => void
  onNext: () => void
  onPrev: () => void
}

export function Step4Details({ data, updateData, onNext, onPrev }: Step4Props) {
  const [dob, setDob] = useState(data.dob || "")
  const [height, setHeight] = useState(data.height || "")
  const [weight, setWeight] = useState(data.weight || "")
  const [guardianName, setGuardianName] = useState(data.guardianName || "")
  const [error, setError] = useState("")

  const calculateAge = (dobString: string) => {
    const today = new Date()
    const birthDate = new Date(dobString)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const handleNext = () => {
    setError("")

    if (!dob) {
      setError("Date of birth is required.")
      return
    }

    const age = calculateAge(dob)
    if (age < 0 || age > 120) {
      setError("Please enter a valid date of birth.")
      return
    }

    if (age < 18 && !guardianName.trim()) {
      setError("Guardian name is required for patients under 18.")
      return
    }

    if (height && (Number(height) < 50 || Number(height) > 300)) {
      setError("Please enter a valid height in cm (50 - 300).")
      return
    }

    if (weight && (Number(weight) < 2 || Number(weight) > 500)) {
      setError("Please enter a valid weight in kg (2 - 500).")
      return
    }

    updateData("dob", dob)
    updateData("height", height)
    updateData("weight", weight)
    updateData("guardianName", guardianName)
    updateData("age", age)
    
    onNext()
  }

  const age = dob ? calculateAge(dob) : null

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Patient Details</h2>
        <p className="text-slate-500 mb-8">
          Please provide some basic health details to help the doctor prepare for your visit.
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth *</Label>
            <Input 
              id="dob" 
              type="date" 
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="max-w-xs"
            />
          </div>

          {age !== null && age < 18 && (
            <div className="space-y-2 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <Label htmlFor="guardian" className="text-amber-900 font-semibold">Guardian Name *</Label>
              <p className="text-xs text-amber-700 mb-2">Required for patients under 18.</p>
              <Input 
                id="guardian" 
                placeholder="Full Name" 
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                className="max-w-md border-amber-300 focus-visible:ring-amber-500"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm) <span className="text-slate-400 text-xs font-normal ml-1">Optional</span></Label>
              <Input 
                id="height" 
                type="number" 
                placeholder="e.g. 175" 
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg) <span className="text-slate-400 text-xs font-normal ml-1">Optional</span></Label>
              <Input 
                id="weight" 
                type="number" 
                placeholder="e.g. 70" 
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-3 mt-4">
            <ClipboardList className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 leading-relaxed">
              These details will be securely saved to your health history. The AI summary of your concern will be attached to this appointment. You can review exactly what is shared in the next step.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm font-medium">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
        <Button variant="outline" onClick={onPrev} className="font-semibold text-slate-600">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button 
          onClick={handleNext}
          className="bg-slate-900 text-white hover:bg-slate-800 font-semibold px-8 h-11"
        >
          Review & Confirm
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
