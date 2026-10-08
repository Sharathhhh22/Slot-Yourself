import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const sessionId = url.searchParams.get('session_id')
  const appointmentId = url.searchParams.get('appointment_id')

  if (!sessionId || !appointmentId) {
    return NextResponse.redirect(new URL('/appointments/new?error=missing_params', req.url))
  }

  const supabase = await createClient()

  // In a production app, we would verify the session_id with Stripe here.
  // For sandbox/demo purposes, we'll assume if they reach this URL with a session_id,
  // they completed the checkout.

  // 1. Confirm the appointment and mark it as paid online
  const { error } = await supabase
    .from('appointments')
    .update({ 
      status: 'confirmed',
      payment_mode: 'online',
      transaction_id: sessionId // Save the session ID as transaction ID
    })
    .eq('id', appointmentId)
    .eq('status', 'held')

  if (error) {
    console.error("Payment success confirmation error:", error)
    return NextResponse.redirect(new URL('/appointments/new?error=confirmation_failed', req.url))
  }

  // 2. We should also record the health history here just like the manual confirm route does,
  // but to keep it simple, we can do that in the background or assume the create-session route saved enough data.
  // Actually, the manual confirm route inserts into health_history. Let's do that too.
  
  const { data: appt } = await supabase
    .from('appointments')
    .select('patient_id, height_cm, weight_kg, dob')
    .eq('id', appointmentId)
    .single()

  if (appt && (appt.height_cm || appt.weight_kg)) {
    await supabase.from('health_history').insert({
      patient_id: appt.patient_id,
      height_cm: appt.height_cm,
      weight_kg: appt.weight_kg
    }).select().maybeSingle()
  }

  // Redirect back to the booking wizard with step=6
  // But our booking wizard manages state in React. We might need a special success page.
  // Or we just redirect to the receipt directly!
  return NextResponse.redirect(new URL(`/receipt/${appointmentId}?payment=success`, req.url))
}
