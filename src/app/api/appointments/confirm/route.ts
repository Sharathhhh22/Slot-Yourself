import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function PUT(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { appointmentId, dob, height, weight, guardianName, shareData, concern, aiSummary, paymentMethod } = await req.json()

    if (!appointmentId || !dob) {
      return NextResponse.json({ error: 'Missing required fields: appointmentId=' + !!appointmentId + ', dob=' + !!dob }, { status: 400 })
    }

    // 1. Update the appointment status to confirmed and attach the details
    const { error: updateError } = await supabase
      .from('appointments')
      .update({
        status: 'confirmed',
        dob,
        height_cm: height || null,
        weight_kg: weight || null,
        patient_name: guardianName || null,
        consent_given: shareData,
        payment_mode: paymentMethod || 'PAY_AT_CLINIC',
        reason: shareData ? concern : null,
        ...(shareData && aiSummary ? { reason: `Concern: ${concern}\nAI Summary: ${aiSummary}` } : {})
      })
      .eq('id', appointmentId)
      .eq('patient_id', user.id)
      .eq('status', 'held')

    if (updateError) {
      console.error(updateError)
      return NextResponse.json({ error: 'Failed to confirm appointment. Hold may have expired.' }, { status: 400 })
    }

    const { error: historyError } = await supabase
      .from('health_history')
      .insert([
        {
          patient_id: user.id,
          dob,
          height_cm: height || null,
          weight_kg: weight || null,
          recorded_at: new Date().toISOString()
        }
      ])
    
    if (historyError) {
      console.warn("Could not save to health history:", historyError)
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error("Confirmation error:", error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
