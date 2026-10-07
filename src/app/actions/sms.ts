"use server"

import twilio from 'twilio'

export async function sendSMSNotification(
  patientPhone: string,
  patientName: string,
  doctorName: string,
  date: string,
  time: string
) {
  // Check if Twilio is configured
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER

  if (!accountSid || !authToken || !twilioNumber) {
    console.warn("Twilio SMS is not configured. Missing environment variables. Skipping SMS.")
    return { success: false, error: "Twilio not configured" }
  }

  // Ensure phone number starts with +
  let formattedPhone = patientPhone.trim()
  if (!formattedPhone.startsWith('+')) {
    // Default to +91 (India) if no country code provided, just as a fallback
    formattedPhone = '+91' + formattedPhone
  }

  try {
    const client = twilio(accountSid, authToken)
    
    const message = await client.messages.create({
      body: `Hi ${patientName}, your appointment with Dr. ${doctorName} is confirmed for ${date} at ${time}. Present your digital pass at the clinic.`,
      from: twilioNumber,
      to: formattedPhone
    })

    console.log("SMS sent successfully! SID:", message.sid)
    return { success: true, sid: message.sid }
  } catch (error: any) {
    console.error("Failed to send SMS:", error)
    return { success: false, error: error.message }
  }
}
