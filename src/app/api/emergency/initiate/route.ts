import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { TwilioProvider } from '@/lib/telephony/twilio'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { doctorId, appointmentId, reason } = await req.json()

    if (!doctorId || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Rate-limit and authorize: Verify patient has an appointment with this doctor.
    // For simplicity, we just check if they have ANY confirmed appointment with this doctor.
    // A stricter check could enforce an active/upcoming appointment today.
    let appointmentQuery = supabase
      .from('appointments')
      .select('id, status')
      .eq('patient_id', user.id)
      .eq('doctor_id', doctorId)
      .in('status', ['confirmed', 'completed']) // Assuming completed means they are an existing patient
      .limit(1)
      .single()

    const { data: appt, error: apptError } = await appointmentQuery

    if (apptError || !appt) {
      return NextResponse.json({ error: 'Unauthorized: No appointment found with this doctor.' }, { status: 403 })
    }

    // 2. Fetch Doctor's phone number and toggle status
    const { data: docData, error: docError } = await supabase
      .from('doctors')
      .select('profile_id, emergency_calls_enabled, profiles(phone)')
      .eq('id', doctorId)
      .single()

    if (docError || !docData) {
      return NextResponse.json({ error: 'Doctor not found.' }, { status: 404 })
    }

    if (!docData.emergency_calls_enabled) {
      return NextResponse.json({ error: 'This doctor has disabled emergency proxy calls.' }, { status: 403 })
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const doctorPhone = docData.profiles?.phone

    if (!doctorPhone) {
      return NextResponse.json({ error: 'Doctor phone number not configured.' }, { status: 400 })
    }

    // 3. Fetch Patient's phone number
    const { data: patData, error: patError } = await supabase
      .from('profiles')
      .select('phone')
      .eq('id', user.id)
      .single()

    if (patError || !patData?.phone) {
      return NextResponse.json({ error: 'Your phone number is not configured in your profile.' }, { status: 400 })
    }

    // 4. Create record in emergency_calls
    const { data: callRecord, error: insertError } = await supabase
      .from('emergency_calls')
      .insert({
        patient_id: user.id,
        doctor_id: doctorId,
        appointment_id: appointmentId || appt.id,
        reason,
        status: 'initiated'
      })
      .select('id')
      .single()

    if (insertError) {
      console.error(insertError)
      return NextResponse.json({ error: 'Failed to create call record' }, { status: 500 })
    }

    // 5. Initiate Proxy Call via Twilio
    const provider = new TwilioProvider()
    
    // Test mode / Mock if Twilio is not configured, so UI works without Twilio account
    if (!process.env.TWILIO_ACCOUNT_SID) {
      console.log("Mocking emergency call as TWILIO_ACCOUNT_SID is missing")
      return NextResponse.json({ 
        success: true, 
        callId: callRecord.id, 
        message: "Simulated emergency call initiated (Twilio keys missing)" 
      })
    }

    const result = await provider.initiateProxiedCall({
      patientPhone: patData.phone,
      doctorPhone: doctorPhone,
      callId: callRecord.id
    })

    return NextResponse.json({ success: true, callId: callRecord.id, providerStatus: result.status })

  } catch (error: any) {
    console.error("Emergency Call error:", error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
