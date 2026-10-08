import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { StripeProvider } from '@/lib/payments/stripe'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { appointmentId, dob, height, weight, guardianName, shareData, concern, aiSummary } = await req.json()

    if (!appointmentId) {
      return NextResponse.json({ error: 'Missing appointment ID' }, { status: 400 })
    }

    // 1. Extend the hold by 15 minutes as per PRD for payment processing
    const heldUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString()
    
    // We update the appointment with the patient details AND extend the hold.
    // Notice we do NOT change the status to 'confirmed' yet. The webhook will do that.
    const { error: updateError } = await supabase
      .from('appointments')
      .update({
        held_until: heldUntil,
        dob,
        height_cm: height || null,
        weight_kg: weight || null,
        patient_name: guardianName || null,
        consent_given: shareData,
        reason: shareData ? concern : null,
        ...(shareData && aiSummary ? { reason: `Concern: ${concern}\nAI Summary: ${aiSummary}` } : {})
      })
      .eq('id', appointmentId)
      .eq('patient_id', user.id)
      .eq('status', 'held')

    if (updateError) {
      console.error(updateError)
      return NextResponse.json({ error: 'Failed to initiate payment. Hold may have expired.' }, { status: 400 })
    }

    // 2. Fetch doctor name to show in the description
    const { data: appt } = await supabase
      .from('appointments')
      .select('doctors(name)')
      .eq('id', appointmentId)
      .single()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const doctorName = appt?.doctors?.name || "Doctor"

    // 3. Create Stripe Checkout Session
    const provider = new StripeProvider()
    
    // Get the base URL for success/cancel redirects
    const protocol = req.headers.get('x-forwarded-proto') || 'http'
    const host = req.headers.get('host')
    const baseUrl = `${protocol}://${host}`

    const result = await provider.createCheckoutSession({
      appointmentId,
      amount: 500, // INR 500
      currency: 'inr',
      description: `Consultation with Dr. ${doctorName}`,
      successUrl: `${baseUrl}/api/payments/success?session_id={CHECKOUT_SESSION_ID}&appointment_id=${appointmentId}`,
      cancelUrl: `${baseUrl}/appointments/new`, // Redirect back to booking if cancelled
      metadata: {
        appointmentId,
        patientId: user.id
      }
    })

    return NextResponse.json({ success: true, paymentUrl: result.paymentUrl })

  } catch (error: any) {
    console.error("Payment initiation error:", error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
