import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { clinicId, doctorId, date, time } = await req.json()

    if (!clinicId || !doctorId || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Calculate hold expiration (5 minutes from now)
    const heldUntil = new Date(Date.now() + 5 * 60 * 1000).toISOString()

    // Try to insert the hold. 
    // The database's UNIQUE INDEX (idx_unique_active_slot) will automatically 
    // reject this if another active hold or confirmed booking exists!
    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          patient_id: user.id,
          clinic_id: clinicId,
          doctor_id: doctorId,
          appointment_date: date,
          appointment_time: time,
          status: 'held',
          held_until: heldUntil
        }
      ])
      .select('id, held_until')
      .single()

    if (error) {
      // 23505 is the Postgres error code for unique_violation
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'That slot was just taken by someone else! Please choose another.' }, 
          { status: 409 }
        )
      }
      throw error
    }

    return NextResponse.json({ 
      success: true, 
      appointmentId: data.id,
      heldUntil: data.held_until 
    })

  } catch (error: any) {
    console.error("Slot hold error:", error)
    return NextResponse.json({ error: 'Failed to hold slot. Please try again.' }, { status: 500 })
  }
}
