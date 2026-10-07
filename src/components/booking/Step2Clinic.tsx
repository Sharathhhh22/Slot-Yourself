"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Search, Loader2, Navigation, UserCheck, Stethoscope } from "lucide-react"

interface Step2Props {
  data: any
  updateData: (key: string, value: any) => void
  onNext: () => void
}

export function Step2Clinic({ data, updateData, onNext }: Step2Props) {
  const [clinics, setClinics] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [locationStatus, setLocationStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle")
  const [searchQuery, setSearchQuery] = useState("")

  const recommendedSpecialty = data.aiAnalysis?.recommended_specialization || ""

  // Initial load: try to get location
  useEffect(() => {
    if (locationStatus === "idle") {
      requestLocation()
    }
  }, [locationStatus])

  const requestLocation = () => {
    setLocationStatus("requesting")
    if (!navigator.geolocation) {
      setLocationStatus("denied")
      fetchClinicsBySearch("")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationStatus("granted")
        fetchClinicsByCoords(position.coords.latitude, position.coords.longitude)
      },
      (error) => {
        console.warn("Geolocation error:", error)
        setLocationStatus("denied")
        fetchClinicsBySearch("")
      }
    )
  }

  const fetchClinicsByCoords = async (lat: number, lon: number) => {
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/clinics/nearby?lat=${lat}&lon=${lon}&specialty=${encodeURIComponent(recommendedSpecialty)}`)
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)
      setClinics(result.clinics)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchClinicsBySearch = async (query: string) => {
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/clinics/nearby?search=${encodeURIComponent(query)}&specialty=${encodeURIComponent(recommendedSpecialty)}`)
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)
      setClinics(result.clinics)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchClinicsBySearch(searchQuery)
  }

  const selectDoctor = (clinicId: string, clinicName: string, doctorId: string, doctorName: string) => {
    updateData("clinicId", clinicId)
    updateData("clinicName", clinicName)
    updateData("doctorId", doctorId)
    updateData("doctorName", doctorName)
    onNext()
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Select a Doctor & Clinic</h2>
        
        {recommendedSpecialty ? (
          <p className="text-slate-500 mb-6">
            Showing available <strong className="text-slate-700">{recommendedSpecialty}s</strong> near you.
          </p>
        ) : (
          <p className="text-slate-500 mb-6">Select a doctor to book your appointment.</p>
        )}

        {/* Location / Search Bar */}
        <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
          {locationStatus === "requesting" && (
            <div className="flex items-center text-sm text-slate-600">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Requesting location access...
            </div>
          )}
          
          {locationStatus === "granted" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm font-medium text-emerald-700">
                <Navigation className="w-4 h-4 mr-2" /> Using your current location
              </div>
              <Button variant="ghost" size="sm" onClick={() => setLocationStatus("denied")} className="text-xs h-8">
                Search manually
              </Button>
            </div>
          )}

          {locationStatus === "denied" && (
            <form onSubmit={handleManualSearch} className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Enter city or zip code..." 
                  className="pl-9 bg-white"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isLoading} variant="outline">
                <Search className="w-4 h-4 mr-2" /> Search
              </Button>
            </form>
          )}
        </div>

        {error && (
          <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Clinic List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary-500" />
              <p>Finding the best clinics nearby...</p>
            </div>
          ) : clinics.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
              <p className="text-slate-500">No clinics found matching this specialty nearby.</p>
              <Button variant="outline" className="mt-4" onClick={() => fetchClinicsBySearch("")}>
                Show all doctors
              </Button>
            </div>
          ) : (
            clinics.map(clinic => (
              <div key={clinic.clinic_id} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-slate-900">{clinic.clinic_name}</h3>
                    <p className="text-sm text-slate-500 flex items-center mt-1">
                      <MapPin className="w-3.5 h-3.5 mr-1" /> {clinic.clinic_address}
                      {clinic.distance_meters !== undefined && (
                        <span className="ml-2 px-2 py-0.5 bg-slate-200/50 rounded-full text-xs font-medium">
                          {(clinic.distance_meters / 1000).toFixed(1)} km away
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="divide-y divide-slate-100">
                  {clinic.doctors?.length > 0 ? (
                    clinic.doctors.map((doctor: any) => (
                      <div key={doctor.id} className="p-4 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                            <UserCheck className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">Dr. {doctor.name}</h4>
                            <p className="text-sm text-slate-500 flex items-center mt-0.5">
                              <Stethoscope className="w-3.5 h-3.5 mr-1" /> 
                              {doctor.specialty} • {doctor.experience_years}y exp
                            </p>
                          </div>
                        </div>
                        <Button 
                          onClick={() => selectDoctor(clinic.clinic_id, clinic.clinic_name, doctor.id, doctor.name)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary-600 hover:bg-primary-700 text-white"
                        >
                          Select Doctor
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-sm text-slate-500 italic text-center">
                      No matching doctors at this location.
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
