import twilio from 'twilio'
import { TelephonyProvider, CallRequest, CallResult } from './index'

export class TwilioProvider implements TelephonyProvider {
  private client: twilio.Twilio

  constructor() {
    // If credentials are missing, we'll initialize without them and throw on use
    const accountSid = process.env.TWILIO_ACCOUNT_SID || ''
    const authToken = process.env.TWILIO_AUTH_TOKEN || ''
    this.client = twilio(accountSid, authToken)
  }

  async initiateProxiedCall(req: CallRequest): Promise<CallResult> {
    const twilioNumber = process.env.TWILIO_PHONE_NUMBER

    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !twilioNumber) {
      throw new Error("Telephony provider is not configured on the server.")
    }

    // Inline TwiML: 
    // 1. Play consent message to patient.
    // 2. Dial the doctor. Both legs use twilioNumber as Caller ID, so numbers are proxied/masked.
    // 3. 30 second timeout as per PRD: "If the doctor does not answer within 30 seconds..."
    const twiml = `
      <Response>
        <Say voice="Polly.Joanna">
          This is an emergency proxy call from APPOINTly. 
          Your phone numbers are hidden. Connecting you to your doctor now.
        </Say>
        <Dial timeout="30" callerId="${twilioNumber}">
          ${req.doctorPhone}
        </Dial>
      </Response>
    `

    const call = await this.client.calls.create({
      twiml,
      to: req.patientPhone,
      from: twilioNumber,
      // Optional: statusCallback to track completion, but for simplicity we rely on client-side polling or optimistic UI unless webhook is specified
    })

    return {
      providerCallId: call.sid,
      status: call.status
    }
  }
}
