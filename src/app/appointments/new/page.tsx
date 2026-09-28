"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Calendar, CheckCircle2, MapPin, Navigation } from "lucide-react"
import Link from "next/link"
import { QRCodeSVG } from "qrcode.react"
import { supabase } from "@/lib/supabase"

export default function BookAppointment() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [nearbyClinics, setNearbyClinics] = useState<any[]>([])

  // State for form data
  const [formData, setFormData] = useState({
    clinic: "",
    name: "",
    mobile: "",
    email: "",
    address: "",
    department: "",
    doctor: "",
    date: "",
    time: "",
    reason: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleGetLocation = () => {
    setLocationStatus("loading")
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simulate fetching nearby clinics based on lat/lng
          setTimeout(() => {
            setLocationStatus("success")
            setNearbyClinics([
              { id: "c1", name: "Downtown Medical Center", distance: "2.1 km away", doctors: 12 },
              { id: "c2", name: "Westside Family Clinic", distance: "5.5 km away", doctors: 8 },
              { id: "c3", name: "North Health Hub", distance: "8.2 km away", doctors: 15 }
            ])
          }, 1000)
        },
        (error) => {
          setLocationStatus("error")
        }
      )
    } else {
      setLocationStatus("error")
    }
  }

  const [appointmentId, setAppointmentId] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 5) {
      setStep(step + 1)
    } else {
      setIsSubmitting(true)
      
      try {
        const { data, error } = await supabase
          .from('appointments')
          .insert([
            { 
              clinic: formData.clinic,
              patient_name: formData.name,
              mobile: formData.mobile,
              email: formData.email,
              address: formData.address,
              department: formData.department,
              doctor: formData.doctor,
              appointment_date: formData.date,
              appointment_time: formData.time,
              reason: formData.reason
            }
          ])
          .select()

        if (error) throw error
        
        if (data && data.length > 0) {
          setAppointmentId(data[0].id)
        }
        
        setStep(6) // Success step
      } catch (error: any) {
        console.error('Error booking appointment:', error.message)
        alert('Failed to book appointment: ' + error.message)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const getQRData = () => {
    // This creates a link to the receipt page. 
    // e.g. http://localhost:3000/receipt/123e4567-e89b-12d3-a456-426614174000
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/receipt/${appointmentId}`;
  }

  return (
    <div className="container mx-auto max-w-2xl p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">SlotUrSelf</h2>
        <p className="mt-2 text-slate-500">
          Follow the steps below to schedule a visit with one of our specialists.
        </p>
      </div>

      {step === 6 ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
            <h3 className="mt-4 text-xl font-semibold text-green-900">Appointment Confirmed</h3>
            <p className="mt-2 text-sm text-green-700">
              Your appointment has been successfully scheduled. We have sent the details to your email.
            </p>
            
            <div className="mt-8 flex flex-col items-center rounded-lg bg-white p-6 shadow-sm border border-green-100">
              <p className="mb-4 text-sm font-medium text-slate-600">Your Appointment QR Code</p>
              <div className="flex justify-center rounded-md bg-white p-2">
                <QRCodeSVG 
                  value={getQRData()} 
                  size={150}
                  level="M"
                  includeMargin={true}
                />
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Please show this QR code at the reception when you arrive.
              </p>
              
              {/* Clickable link so they can test it on desktop */}
              <div className="mt-4 border-t border-slate-100 pt-4 w-full">
                <Link 
                  href={`/receipt/${appointmentId}`}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline flex items-center justify-center"
                  target="_blank"
                >
                  View Digital Pass in Browser
                </Link>
              </div>
            </div>

            <div className="mt-8 flex space-x-4">
              <Button asChild variant="outline" className="bg-white">
                <Link href="/">Return to Dashboard</Link>
              </Button>
              <Button onClick={() => {
                setStep(1);
                setLocationStatus("idle");
                setNearbyClinics([]);
                setFormData({
                  clinic: "", name: "", mobile: "", email: "", address: "", department: "", doctor: "", date: "", time: "", reason: ""
                });
              }} className="bg-green-600 hover:bg-green-700">
                Book Another
              </Button>
            </div>

            <div className="mt-8 text-center text-sm font-medium text-slate-600">
              Hi there, {formData.name || "Patient"}
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
                  {step === 2 && "Patient Details"}
                  {step === 3 && "Select Department & Doctor"}
                  {step === 4 && "Choose Date & Time"}
                  {step === 5 && "Review & Confirm"}
                </CardTitle>
                <div className="text-sm font-medium text-slate-500">
                  Step {step} of 5
                </div>
              </div>
              <CardDescription>
                {step === 1 && "Find a nearby clinic to book your appointment."}
                {step === 2 && "Please provide the patient's personal information."}
                {step === 3 && "Choose the appropriate specialty and doctor for your visit."}
                {step === 4 && "Select an available time slot."}
                {step === 5 && "Review your appointment details before confirming."}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-slate-200 p-6 text-center bg-slate-50">
                    <MapPin className="mx-auto h-8 w-8 text-slate-400 mb-4" />
                    <h4 className="text-lg font-medium text-slate-900">Find Nearest Clinic</h4>
                    <p className="text-sm text-slate-500 mb-4">
                      Allow access to your GPS location to find the closest hospitals and available doctors.
                    </p>
                    <Button 
                      type="button" 
                      onClick={handleGetLocation} 
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

                  {locationStatus === "success" && (
                    <div className="mt-6 space-y-3">
                      <Label>Nearby Clinics Found:</Label>
                      {nearbyClinics.map((clinic) => (
                        <div 
                          key={clinic.id}
                          onClick={() => setFormData({...formData, clinic: clinic.name})}
                          className={`cursor-pointer rounded-lg border p-4 transition-all ${formData.clinic === clinic.name ? "border-primary-600 bg-primary-50 ring-1 ring-primary-600" : "border-slate-200 hover:bg-slate-50"}`}
                        >
                          <div className="flex justify-between items-center">
                            <h5 className="font-medium text-slate-900">{clinic.name}</h5>
                            <span className="text-sm font-semibold text-primary-600">{clinic.distance}</span>
                          </div>
                          <p className="text-sm text-slate-500 mt-1">{clinic.doctors} Doctors Available Today</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={formData.name} onChange={handleChange} placeholder="Enter full name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input id="mobile" type="tel" value={formData.mobile} onChange={handleChange} placeholder="e.g. (555) 000-0000" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="patient@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address</Label>
                    <textarea 
                      id="address" 
                      value={formData.address}
                      onChange={handleChange}
                      className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter your complete address"
                      required
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select 
                      id="department" 
                      value={formData.department} 
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          department: e.target.value,
                          doctor: "" // Reset doctor when department changes
                        })
                      }} 
                      required
                    >
                      <option value="">Select a department...</option>
                      <option value="General Practice">General Practice</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Orthopedics">Orthopedics</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor">Doctor</Label>
                    <Select 
                      id="doctor" 
                      value={formData.doctor} 
                      onChange={handleChange}
                      required 
                      disabled={!formData.department}
                    >
                      <option value="">
                        {!formData.department ? "Select department first..." : "Select a doctor..."}
                      </option>
                      {formData.department === "General Practice" && (
                        <>
                          <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins</option>
                          <option value="Dr. Michael Chen">Dr. Michael Chen</option>
                        </>
                      )}
                      {formData.department === "Cardiology" && (
                        <>
                          <option value="Dr. Robert Patel">Dr. Robert Patel</option>
                          <option value="Dr. Emily Smith">Dr. Emily Smith</option>
                        </>
                      )}
                      {formData.department === "Pediatrics" && (
                        <>
                          <option value="Dr. Amanda Lewis">Dr. Amanda Lewis</option>
                        </>
                      )}
                      {formData.department === "Orthopedics" && (
                        <>
                          <option value="Dr. James Wilson">Dr. James Wilson</option>
                          <option value="Dr. David Kim">Dr. David Kim</option>
                        </>
                      )}
                    </Select>
                    {!formData.department && (
                      <p className="text-xs text-slate-500">
                        Please choose a department to see available specialists.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input id="date" type="date" value={formData.date} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time Slot</Label>
                    <Select id="time" value={formData.time} onChange={handleChange} required>
                      <option value="">Select a time...</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Visit (Optional)</Label>
                    <textarea 
                      id="reason" 
                      value={formData.reason}
                      onChange={handleChange}
                      className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Briefly describe your symptoms or reason for visit"
                    />
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4 rounded-md border border-slate-200 p-4 bg-slate-50">
                  <h4 className="font-semibold text-slate-900 mb-2">Appointment Summary</h4>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 text-sm">
                    <div className="sm:col-span-2">
                      <dt className="font-medium text-slate-500">Selected Clinic</dt>
                      <dd className="mt-1 font-medium text-primary-700">{formData.clinic}</dd>
                    </div>
                    <div className="sm:col-span-2 border-t border-slate-200 pt-4 mt-2"></div>
                    <div>
                      <dt className="font-medium text-slate-500">Patient Name</dt>
                      <dd className="mt-1 text-slate-900">{formData.name}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-500">Mobile</dt>
                      <dd className="mt-1 text-slate-900">{formData.mobile}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-500">Email</dt>
                      <dd className="mt-1 text-slate-900">{formData.email}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="font-medium text-slate-500">Address</dt>
                      <dd className="mt-1 text-slate-900">{formData.address}</dd>
                    </div>
                    <div className="sm:col-span-2 border-t border-slate-200 pt-4 mt-2"></div>
                    <div>
                      <dt className="font-medium text-slate-500">Department</dt>
                      <dd className="mt-1 text-slate-900">{formData.department}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-500">Doctor</dt>
                      <dd className="mt-1 text-slate-900">{formData.doctor}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-500">Date & Time</dt>
                      <dd className="mt-1 text-slate-900">{formData.date} at {formData.time}</dd>
                    </div>
                    {formData.reason && (
                      <div className="sm:col-span-2">
                        <dt className="font-medium text-slate-500">Reason</dt>
                        <dd className="mt-1 text-slate-900">{formData.reason}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between border-t border-slate-100 px-6 py-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep(step - 1)}
                disabled={step === 1 || isSubmitting}
              >
                Back
              </Button>
              <Button type="submit" disabled={isSubmitting || (step === 1 && !formData.clinic)}>
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </span>
                ) : step === 5 ? (
                  "Confirm Booking"
                ) : (
                  "Continue"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  )
}
