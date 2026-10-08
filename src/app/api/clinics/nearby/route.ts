import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const lat = url.searchParams.get('lat')
  const lon = url.searchParams.get('lon')
  const search = url.searchParams.get('search')
  const specialty = url.searchParams.get('specialty') // Optional filter

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    let clinicsData: any[] = []

    if (lat && lon) {
      // 1. PostGIS distance-based search
      const { data, error } = await supabase.rpc('get_nearby_clinics', {
        user_lat: parseFloat(lat),
        user_lon: parseFloat(lon),
        search_radius_meters: 50000 // 50km
      })

      if (error) throw error
      clinicsData = data || []
    } else if (search) {
      // 2. Text-based fallback search (city/zip)
      const { data, error } = await supabase
        .from('clinics')
        .select('clinic_id:id, clinic_name:name, clinic_address:address')
        .eq('is_active', true)
        .ilike('address', `%${search}%`)
        .limit(20)

      if (error) throw error
      clinicsData = data || []
    } else {
      // 3. Fallback: just return all active clinics
      const { data, error } = await supabase
        .from('clinics')
        .select('clinic_id:id, clinic_name:name, clinic_address:address')
        .eq('is_active', true)
        .limit(20)
        
      if (error) throw error
      clinicsData = data || []
    }

    // Now, for each clinic, fetch doctors matching the specialty (if provided)
    // In a real app, this should be done via a JOIN in SQL/RPC, but doing it here for simplicity
    
    // Fetch all doctors for these clinics
    const clinicIds = clinicsData.map(c => c.clinic_id)
    
    let doctorsQuery = supabase
      .from('doctors')
      .select('id, name, specialty, experience_years, clinic_id')
      .eq('is_active', true)
      .in('clinic_id', clinicIds)

    if (specialty) {
      // Fuzzy match the specialty
      doctorsQuery = doctorsQuery.ilike('specialty', `%${specialty}%`)
    }

    const { data: doctorsData, error: docsError } = await doctorsQuery
    if (docsError) throw docsError

    // Group doctors by clinic
    const clinicsWithDoctors = clinicsData.map(clinic => {
      const clinicDoctors = (doctorsData || []).filter(d => d.clinic_id === clinic.clinic_id)
      return {
        ...clinic,
        doctors: clinicDoctors
      }
    })

    // Filter out clinics that have no matching doctors if specialty was provided
    const finalClinics = specialty 
      ? clinicsWithDoctors.filter(c => c.doctors.length > 0)
      : clinicsWithDoctors

    return NextResponse.json({ clinics: finalClinics })

  } catch (error: any) {
    console.error("Clinic search error:", error)
    return NextResponse.json({ error: error.message || 'Failed to fetch clinics' }, { status: 500 })
  }
}
