"use server"

import { Resend } from 'resend'

// The API key should be stored in .env.local as RESEND_API_KEY
// Fallback is provided to prevent crashes if not set during dev, but email will fail.
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key')

export async function sendAppointmentConfirmationEmail(
  userEmail: string,
  patientName: string,
  doctorName: string,
  date: string,
  time: string,
  clinicName: string
) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Email will not be sent.")
    return { success: false, error: "API Key missing" }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Appointments <onboarding@resend.dev>', // Resend sandbox domain, change for prod
      to: [userEmail],
      subject: 'Appointment Confirmed - APPOINTLY',
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0f172a; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Appointment Confirmed</h1>
          </div>
          <div style="padding: 32px; background-color: #ffffff;">
            <p style="font-size: 16px; color: #334155; margin-top: 0;">Hi <strong>${patientName}</strong>,</p>
            <p style="font-size: 16px; color: #334155; line-height: 1.5;">Your appointment has been successfully scheduled. Here are the details of your visit:</p>
            
            <div style="background-color: #f8fafc; border-radius: 6px; padding: 20px; margin: 24px 0;">
              <p style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px;"><strong>Doctor:</strong> Dr. ${doctorName}</p>
              <p style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px;"><strong>Date:</strong> ${date}</p>
              <p style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px;"><strong>Time:</strong> ${time}</p>
              <p style="margin: 0; color: #0f172a; font-size: 15px;"><strong>Clinic:</strong> ${clinicName}</p>
            </div>

            <p style="font-size: 14px; color: #64748b; line-height: 1.5; margin-bottom: 0;">
              Please arrive 10 minutes early. If you need to cancel or reschedule, please do so from your dashboard.
            </p>
          </div>
          <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #eaeaea;">
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">&copy; ${new Date().getFullYear()} APPOINTLY. All rights reserved.</p>
          </div>
        </div>
      `
    })

    if (error) {
      console.error("Resend Error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("Failed to send email:", error)
    return { success: false, error: error.message }
  }
}
