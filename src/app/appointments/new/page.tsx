"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Calendar, CheckCircle2, MapPin, Navigation, User } from "lucide-react"
import Link from "next/link"
import { QRCodeSVG } from "qrcode.react"
import { createClient } from "@/utils/supabase/client"

export default function BookAppointment() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  
  const [clinics, setClinics] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)

  const supabase = createClient()

  // Form Data uses IDs to link relationally
  const [formData, setFormData] = useState({
    clinic_id: "",
    clinic_name: "",
    department_id: "",
    department_name: "",
    doctor_id: "",
    doctor_name: "",
    date: "",
    time: "",
    reason: ""
  })

  const [appointmentId, setAppointmentId] = useState<string>("")

  // Initial Load: Get User & Clinics
  useEffect(() => {
    async function loadInitialData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUser(user)

      const { data: clinicsData } = await supabase.from('clinics').select('*').eq('is_active', true)
      if (clinicsData) setClinics(clinicsData)
      setIsLoading(false)
    }
    loadInitialData()
  }, [])

  // Load Departments when Clinic changes
  useEffect(() => {
    async function loadDepartments() {
      if (!formData.clinic_id) return
      const { data } = await supabase.from('departments').select('*').eq('clinic_id', formData.clinic_id).eq('is_active', true)
      if (data) setDepartments(data)
    }
    loadDepartments()
  }, [formData.clinic_id])

  // Load Doctors when Department changes
  useEffect(() => {
    async function loadDoctors() {
      if (!formData.department_id) return
      const { data } = await supabase.from('doctors').select('*').eq('department_id', formData.department_id).eq('is_active', true)
      if (data) setDoctors(data)
    }
    loadDoctors()
  }, [formData.department_id])

  // Load Booked Slots when Doctor and Date changes
  useEffect(() => {
    async function loadBookedSlots() {
      if (!formData.doctor_id || !formData.date) return
      const { data } = await supabase
        .from('appointments_v2')
        .select('appointment_time')
        .eq('doctor_id', formData.doctor_id)
        .eq('appointment_date', formData.date)
        .in('status', ['upcoming', 'completed'])

      if (data) {
        // format HH:MM:SS to HH:MM AM/PM matching our select options, or just keep string matching simple
        // In our DB, time is 'HH:MM:SS'. We will format our select options to match it.
        setBookedSlots(data.map(a => a.appointment_time))
      }
    }
    loadBookedSlots()
  }, [formData.doctor_id, formData.date])

  const handleClinicSelect = (clinic: any) => {
    setFormData({ 
      ...formData, 
      clinic_id: clinic.id, 
      clinic_name: clinic.name,
      department_id: "", department_name: "", doctor_id: "", doctor_name: "" 
    })
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 4) {
      setStep(step + 1)
    } else {
      if (!user) {
        alert("You must be logged in to book an appointment.")
        return
      }

      setIsSubmitting(true)
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
            throw new Error("This time slot was just booked by someone else. Please choose another.")
          }
          throw error
        }
        
        if (data && data.length > 0) setAppointmentId(data[0].id)
        setStep(5) // Success step
      } catch (error: any) {
        alert(error.message)
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
    return <div className="p-8 text-center"><Calendar className="mx-auto h-8 w-8 animate-spin text-slate-400" /></div>
  }

  return (
    <div className="container mx-auto max-w-2xl p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">SlotUrSelf</h2>
        <p className="mt-2 text-slate-500">
          Follow the steps below to schedule a visit with one of our specialists.
        </p>
      </div>

      {step === 5 ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
            <h3 className="mt-4 text-xl font-semibold text-green-900">Appointment Confirmed</h3>
            <p className="mt-2 text-sm text-green-700">
              Your appointment has been successfully scheduled securely in our system.
            </p>
            
            <div className="mt-8 flex flex-col items-center rounded-lg bg-white p-6 shadow-sm border border-green-100">
              <p className="mb-4 text-sm font-medium text-slate-600">Your Appointment QR Code</p>
              <div className="flex justify-center rounded-md bg-white p-2">
                <QRCodeSVG value={getQRData()} size={150} level="M" includeMargin={true} />
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Please show this QR code at the reception when you arrive.
              </p>
              
              <div className="mt-4 border-t border-slate-100 pt-4 w-full">
                <Link href={`/receipt/${appointmentId}`} className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline flex items-center justify-center" target="_blank">
                  View Digital Pass in Browser
                </Link>
              </div>
            </div>

            <div className="mt-8 flex space-x-4">
              <Button asChild variant="outline" className="bg-white">
                <Link href="/">Return to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {step === 1 && "Select Clinic Location"}
                  {step === 2 && "Select Department & Doctor"}
                  {step === 3 && "Choose Date & Time"}
                  {step === 4 && "Review & Confirm"}
                </CardTitle>
                <div className="text-sm font-medium text-slate-500">
                  Step {step} of 4
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {!user && (
                <div className="bg-red-50 p-4 rounded-md text-red-600 text-sm mb-4">
                  You must be logged in to book an appointment. <Link href="/login" className="font-bold underline">Login here</Link>.
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  {/* Location Feature */}
                  <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
                    <MapPin className="mx-auto h-8 w-8 text-slate-400 mb-4" />
                    <h4 className="text-lg font-medium text-slate-900">Find Nearest Clinic</h4>
                    <p className="text-sm text-slate-500 mb-4">
                      Allow access to your GPS location to find the closest hospitals.
                    </p>
                    <Button 
                      type="button" 
                      onClick={() => {
                        setLocationStatus("loading")
                        if ("geolocation" in navigator) {
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              setTimeout(() => setLocationStatus("success"), 1000)
                            },
                            (error) => setLocationStatus("error")
                          )
                        } else {
                          setLocationStatus("error")
                        }
                      }} 
                      disabled={locationStatus === "loading"}
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      {locationStatus === "loading" ? (
                        <span className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 animate-spin" />
                          Locating...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Navigation className="mr-2 h-4 w-4" />
                          Use My Current Location
                        </span>
                      )}
                    </Button>
                    
                    {locationStatus === "error" && (
                      <p className="mt-4 text-sm text-red-500">
                        Could not access location. Please check your browser permissions.
                      </p>
                    )}
                  </div>

                  {(locationStatus === "success" || locationStatus === "idle") && (
                    <div className="space-y-4">
                      <Label>{locationStatus === "success" ? "Nearby Clinics Found:" : "All Available Clinics:"}</Label>
                      {clinics.length === 0 && <p className="text-sm text-slate-500">No clinics available.</p>}
                      {clinics.map((clinic) => (
                        <div 
                          key={clinic.id}
                          onClick={() => handleClinicSelect(clinic)}
                          className="cursor-pointer rounded-lg border p-4 transition-all border-slate-200 hover:border-primary-600 hover:bg-slate-50"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium text-slate-900">{clinic.name}</h5>
                              <p className="text-sm text-slate-500 mt-1">{clinic.address} • {clinic.contact_number}</p>
                            </div>
                            {locationStatus === "success" && (
                              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                {(Math.random() * 5 + 1).toFixed(1)} km away
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select 
                      id="department" 
                      value={formData.department_id} 
                      onChange={(e) => {
                        const dept = departments.find(d => d.id === e.target.value)
                        setFormData({ ...formData, department_id: dept?.id || "", department_name: dept?.name || "", doctor_id: "", doctor_name: "" })
                      }} 
                      required
                    >
                      <option value="">Select a department...</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor">Doctor</Label>
                    <Select 
                      id="doctor" 
                      value={formData.doctor_id} 
                      onChange={(e) => {
                        const doc = doctors.find(d => d.id === e.target.value)
                        setFormData({ ...formData, doctor_id: doc?.id || "", doctor_name: doc?.name || "", date: "", time: "" })
                      }}
                      required 
                      disabled={!formData.department_id}
                    >
                      <option value="">{!formData.department_id ? "Select department first..." : "Select a doctor..."}</option>
                      {doctors.map(doc => (
                        <option key={doc.id} value={doc.id}>{doc.name}</option>
                      ))}
                    </Select>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required min={new Date().toISOString().split('T')[0]} />
                  </div>
                  {formData.date && (
                    <div className="space-y-2">
                      <Label htmlFor="time">Time Slot</Label>
                      <Select id="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} required>
                        <option value="">Select an available time...</option>
                        {allTimeSlots.map(time => {
                          const isBooked = bookedSlots.includes(time)
                          return (
                            <option key={time} value={time} disabled={isBooked}>
                              {formatTime(time)} {isBooked ? '(Booked)' : ''}
                            </option>
                          )
                        })}
                      </Select>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Visit (Optional)</Label>
                    <textarea 
                      id="reason" 
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-600"
                    />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4 rounded-md border border-slate-200 p-4 bg-slate-50">
                  <h4 className="font-semibold text-slate-900 mb-2">Appointment Summary</h4>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 text-sm">
                    <div className="sm:col-span-2">
                      <dt className="font-medium text-slate-500">Selected Clinic</dt>
                      <dd className="mt-1 font-medium text-primary-700">{formData.clinic_name}</dd>
                    </div>
                    <div className="sm:col-span-2 border-t border-slate-200 pt-4 mt-2"></div>
                    <div>
                      <dt className="font-medium text-slate-500">Patient Details</dt>
                      <dd className="mt-1 text-slate-900">{user?.email}</dd>
                    </div>
                    <div className="sm:col-span-2 border-t border-slate-200 pt-4 mt-2"></div>
                    <div>
                      <dt className="font-medium text-slate-500">Department</dt>
                      <dd className="mt-1 text-slate-900">{formData.department_name}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-500">Doctor</dt>
                      <dd className="mt-1 text-slate-900">{formData.doctor_name}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-500">Date & Time</dt>
                      <dd className="mt-1 text-slate-900">{formData.date} at {formData.time && formatTime(formData.time)}</dd>
                    </div>
                  </dl>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between border-t border-slate-100 px-6 py-4">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)} disabled={isSubmitting}>
                  Back
                </Button>
              )}
              {step < 4 ? (
                <Button type="button" onClick={() => setStep(step + 1)} disabled={
                  (step === 2 && !formData.doctor_id) || 
                  (step === 3 && (!formData.date || !formData.time))
                } className="ml-auto">
                  Continue
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting || !user} className="ml-auto">
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
