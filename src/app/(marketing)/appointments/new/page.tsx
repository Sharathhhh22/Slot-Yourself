"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Calendar, CheckCircle2, User, Stethoscope, Clock, FileText, AlertCircle, ShieldCheck, ArrowRight } from "lucide-react"
import Link from "next/link"
import { QRCodeSVG } from "qrcode.react"
import { createClient } from "@/utils/supabase/client"

export default function BookAppointment() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formError, setFormError] = useState("")
  
  const [clinics, setClinics] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)

  const supabase = createClient()

  // Form Data
  const [formData, setFormData] = useState({
    clinic_id: "",
    clinic_name: "",
    department_id: "",
    department_name: "",
    doctor_id: "",
    doctor_name: "",
    date: "",
    time: "",
    patient_name: "",
    patient_phone: "",
    reason: ""
  })

  const [appointmentId, setAppointmentId] = useState<string>("")

  // 1. Initial Load: Get User & Clinics (Simulated / Real)
  useEffect(() => {
    async function loadInitialData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUser(user)
          // Pre-fill user details if available
          setFormData(prev => ({ 
            ...prev, 
            patient_name: user.user_metadata?.full_name || "",
            patient_phone: user.user_metadata?.phone || ""
          }))
        }

        const { data: clinicsData, error } = await supabase.from('clinics').select('*').eq('is_active', true)
        if (error) throw error
        
        if (clinicsData && clinicsData.length > 0) {
          setClinics(clinicsData)
          // Auto-select the first clinic to skip "Clinic" selection for simpler patient flow
          setFormData(prev => ({
            ...prev,
            clinic_id: clinicsData[0].id,
            clinic_name: clinicsData[0].name
          }))
          
          // Load departments for this clinic immediately
          const { data: depts } = await supabase.from('departments').select('*').eq('clinic_id', clinicsData[0].id).eq('is_active', true)
          if (depts) setDepartments(depts)
        }
      } catch (err) {
        console.error("Failed to load initial data", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadInitialData()
  }, [])

  // 2. Load Doctors when Department changes
  useEffect(() => {
    async function loadDoctors() {
      if (!formData.department_id) {
        setDoctors([])
        return
      }
      try {
        const { data } = await supabase.from('doctors').select('*').eq('department_id', formData.department_id).eq('is_active', true)
        if (data) setDoctors(data)
      } catch (err) {
        console.error("Failed to load doctors", err)
      }
    }
    loadDoctors()
  }, [formData.department_id])

  // 3. Load Booked Slots when Doctor and Date changes
  useEffect(() => {
    async function loadBookedSlots() {
      if (!formData.doctor_id || !formData.date) return
      try {
        const { data } = await supabase
          .from('appointments_v2')
          .select('appointment_time')
          .eq('doctor_id', formData.doctor_id)
          .eq('appointment_date', formData.date)
          .in('status', ['upcoming', 'completed'])

        if (data) {
          setBookedSlots(data.map(a => a.appointment_time))
        }
      } catch (err) {
        console.error("Failed to load booked slots", err)
      }
    }
    loadBookedSlots()
  }, [formData.doctor_id, formData.date])

  const validateStep = () => {
    setFormError("")
    if (step === 1) {
      if (!formData.department_id) {
        setFormError("Please select a specialty department.")
        return false
      }
      if (!formData.doctor_id) {
        setFormError("Please select a doctor.")
        return false
      }
    } else if (step === 2) {
      if (!formData.date) {
        setFormError("Please select an appointment date.")
        return false
      }
      if (!formData.time) {
        setFormError("Please select an available time slot.")
        return false
      }
    } else if (step === 3) {
      if (!formData.patient_name.trim()) {
        setFormError("Please enter the patient's full name.")
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep()) return

    if (step < 4) {
      setStep(step + 1)
      window.scrollTo(0, 0)
    } else {
      if (!user) {
        setFormError("You must be logged in to book an appointment.")
        return
      }

      setIsSubmitting(true)
      setFormError("")
      try {
        const { data, error } = await supabase
          .from('appointments_v2')
          .insert([{ 
            patient_id: user.id,
            clinic_id: formData.clinic_id,
            department_id: formData.department_id,
            doctor_id: formData.doctor_id,
            appointment_date: formData.date,
            appointment_time: formData.time,
            reason: formData.reason,
            status: 'upcoming'
          }])
          .select()

        if (error) {
          if (error.code === '23505') {
            throw new Error("This time slot was just booked by someone else. Please go back and choose another.")
          }
          throw error
        }
        
        if (data && data.length > 0) setAppointmentId(data[0].id)
        setStep(5) // Success step
        window.scrollTo(0, 0)
      } catch (error: any) {
        setFormError(error.message)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const getQRData = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/receipt/${appointmentId}`;
  }

  // Generate time slots 09:00:00 to 17:00:00
  const allTimeSlots = [
    "09:00:00", "10:00:00", "11:00:00", 
    "13:00:00", "14:00:00", "15:00:00", "16:00:00"
  ]

  const formatTime = (timeStr: string) => {
    const [hour, min] = timeStr.split(':')
    const h = parseInt(hour)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${min} ${ampm}`
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-slate-500">
        <Calendar className="h-10 w-10 animate-pulse text-primary-600 mb-4" />
        <p className="text-lg font-medium">Loading appointment system...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-3xl p-6 md:py-12">
      
      {/* HEADER */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">Book Appointment</h1>
        {step < 5 && (
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <span className={step >= 1 ? "text-primary-600" : "text-slate-400"}>Specialty</span>
            <span className="text-slate-300">→</span>
            <span className={step >= 2 ? "text-primary-600" : "text-slate-400"}>Time</span>
            <span className="text-slate-300">→</span>
            <span className={step >= 3 ? "text-primary-600" : "text-slate-400"}>Details</span>
            <span className="text-slate-300">→</span>
            <span className={step >= 4 ? "text-primary-600" : "text-slate-400"}>Confirm</span>
          </div>
        )}
      </div>

      {!user && step < 5 && (
        <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">You are browsing as a guest</h4>
            <p className="text-sm text-yellow-700 mt-1">
              You must <Link href="/login" className="font-bold underline">log in or register</Link> before you can finalize your booking.
            </p>
          </div>
        </div>
      )}

      {step === 5 ? (
        <Card className="border-green-200 bg-green-50 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center p-10 md:p-16 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-3">Appointment Confirmed!</h2>
            <p className="text-green-700 max-w-md">
              Your appointment with {formData.doctor_name} has been securely scheduled.
            </p>
            
            <div className="mt-10 flex flex-col items-center rounded-2xl bg-white p-8 shadow-sm border border-green-100 w-full max-w-sm">
              <p className="mb-6 text-sm font-bold tracking-widest uppercase text-slate-500">Digital Pass</p>
              <div className="rounded-xl bg-white p-4 shadow-inner border border-slate-100">
                {appointmentId && <QRCodeSVG value={getQRData()} size={160} level="M" />}
              </div>
              <p className="mt-6 text-sm text-slate-500">
                Show this code at reception to check-in instantly.
              </p>
              
              <div className="mt-6 border-t border-slate-100 pt-6 w-full">
                <Link 
                  href={`/receipt/${appointmentId}`} 
                  className="text-sm font-bold text-primary-600 hover:text-primary-700 hover:underline flex items-center justify-center" 
                  target="_blank"
                >
                  View Pass in Fullscreen <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>

            <div className="mt-10">
              <Button asChild className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 py-6 text-base font-bold shadow-lg shadow-green-600/20">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg border-slate-200 rounded-2xl overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-medium text-slate-700">Data protected under India DPDP Act.</span>
          </div>

          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 md:p-8 space-y-8">
              
              {formError && (
                <div className="rounded-md bg-red-50 p-4 border border-red-200 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-3 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-red-800">{formError}</p>
                </div>
              )}

              {/* STEP 1: SPECIALTY & DOCTOR */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Choose a Specialist</h3>
                      <p className="text-sm text-slate-500">Select the department and doctor you wish to see.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="department" className="text-base font-semibold">Specialty / Department</Label>
                    {departments.length === 0 ? (
                      <div className="text-sm text-slate-500 p-3 bg-slate-50 rounded-md border border-slate-200">No departments available at this time.</div>
                    ) : (
                      <Select 
                        id="department" 
                        value={formData.department_id} 
                        onChange={(e) => {
                          const dept = departments.find(d => d.id === e.target.value)
                          setFormData({ ...formData, department_id: dept?.id || "", department_name: dept?.name || "", doctor_id: "", doctor_name: "" })
                        }} 
                      >
                        <option value="">Select specialty...</option>
                        {departments.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </Select>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="doctor" className="text-base font-semibold">Doctor</Label>
                    <Select 
                      id="doctor" 
                      value={formData.doctor_id} 
                      onChange={(e) => {
                        const doc = doctors.find(d => d.id === e.target.value)
                        setFormData({ ...formData, doctor_id: doc?.id || "", doctor_name: doc?.name || "", date: "", time: "" })
                      }}
                      disabled={!formData.department_id}
                    >
                      <option value="">{!formData.department_id ? "Select specialty first" : "Choose a doctor..."}</option>
                      {doctors.map(doc => (
                        <option key={doc.id} value={doc.id}>{doc.name}</option>
                      ))}
                    </Select>
                  </div>
                </div>
              )}

              {/* STEP 2: DATE & TIME */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Choose Date & Time</h3>
                      <p className="text-sm text-slate-500">Pick an available slot for {formData.doctor_name}.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="date" className="text-base font-semibold">Preferred Date</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      value={formData.date} 
                      onChange={(e) => setFormData({...formData, date: e.target.value, time: ""})} 
                      min={new Date().toISOString().split('T')[0]} 
                      className="h-12 text-base"
                    />
                  </div>

                  {formData.date && (
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Available Time Slots</Label>
                      {allTimeSlots.filter(t => !bookedSlots.includes(t)).length === 0 ? (
                        <div className="text-sm text-red-600 bg-red-50 p-4 rounded-lg border border-red-100">
                          No slots available on this date. Please choose another date.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {allTimeSlots.map(time => {
                            const isBooked = bookedSlots.includes(time)
                            const isSelected = formData.time === time
                            
                            return (
                              <button
                                key={time}
                                type="button"
                                disabled={isBooked}
                                onClick={() => setFormData({...formData, time})}
                                className={`
                                  py-3 px-4 rounded-xl border text-sm font-medium transition-all
                                  ${isBooked ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-50' : 
                                    isSelected ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-600/20' : 
                                    'bg-white border-slate-200 text-slate-700 hover:border-primary-300 hover:bg-primary-50'}
                                `}
                              >
                                {formatTime(time)}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: PATIENT DETAILS */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Patient Details</h3>
                      <p className="text-sm text-slate-500">Who is this appointment for?</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="patient_name" className="text-base font-semibold">Patient Full Name <span className="text-red-500">*</span></Label>
                    <Input 
                      id="patient_name" 
                      value={formData.patient_name} 
                      onChange={(e) => setFormData({...formData, patient_name: e.target.value})} 
                      placeholder="e.g. John Doe"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="patient_phone" className="text-base font-semibold">Contact Number (Optional)</Label>
                    <Input 
                      id="patient_phone" 
                      type="tel"
                      value={formData.patient_phone} 
                      onChange={(e) => setFormData({...formData, patient_phone: e.target.value})} 
                      placeholder="e.g. +91 98765 43210"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="reason" className="text-base font-semibold">Reason for Visit (Optional)</Label>
                    <textarea 
                      id="reason" 
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      placeholder="Briefly describe your symptoms or reason for visit..."
                      className="flex min-h-[120px] w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-600 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Review & Confirm</h3>
                      <p className="text-sm text-slate-500">Please verify the details below.</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
                    <div className="grid grid-cols-3 gap-4 border-b border-slate-200 pb-4">
                      <div className="col-span-1 text-sm font-medium text-slate-500">Doctor</div>
                      <div className="col-span-2 text-base font-bold text-slate-900">
                        {formData.doctor_name}
                        <div className="text-sm font-normal text-slate-500">{formData.department_name}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-b border-slate-200 pb-4">
                      <div className="col-span-1 text-sm font-medium text-slate-500">Date & Time</div>
                      <div className="col-span-2 text-base font-bold text-slate-900">
                        {formData.date}
                        <div className="text-sm font-normal text-slate-500">{formData.time && formatTime(formData.time)}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-b border-slate-200 pb-4">
                      <div className="col-span-1 text-sm font-medium text-slate-500">Patient</div>
                      <div className="col-span-2 text-base font-bold text-slate-900">
                        {formData.patient_name}
                        {formData.patient_phone && <div className="text-sm font-normal text-slate-500">{formData.patient_phone}</div>}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1 text-sm font-medium text-slate-500">Reason</div>
                      <div className="col-span-2 text-sm text-slate-900">
                        {formData.reason || <span className="italic text-slate-400">Not provided</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="booking_terms" 
                      required 
                      className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-primary-600 focus:ring-primary-600" 
                    />
                    <label htmlFor="booking_terms" className="text-sm text-slate-600">
                      I agree to the <Link href="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>, and acknowledge the <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link> for medical data handling.
                    </label>
                  </div>
                </div>
              )}

            </CardContent>
            
            <CardFooter className="flex justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-6 rounded-b-2xl">
              {step > 1 ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(step - 1)} 
                  disabled={isSubmitting}
                  className="rounded-full px-6 h-12"
                >
                  Back
                </Button>
              ) : (
                <div></div> // Empty div for flex layout spacing
              )}
              
              {step < 4 ? (
                <Button 
                  type="submit" 
                  className="ml-auto rounded-full px-8 h-12 bg-primary-600 hover:bg-primary-700 text-white font-bold"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !user} 
                  className="ml-auto rounded-full px-8 h-12 bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-lg shadow-primary-600/20"
                >
                  {isSubmitting ? "Processing..." : "Confirm Booking"}
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  )
}
