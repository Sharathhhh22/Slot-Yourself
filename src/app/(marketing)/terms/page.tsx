import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | APPONTly",
}

export default function TermsOfService() {
  return (
    <div className="container mx-auto max-w-3xl py-24 px-6">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <p className="text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using APPONTly, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Medical Disclaimer</h2>
          <p>
            APPONTly is an appointment booking platform. We do not provide medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Appointment Cancellations</h2>
          <p>
            You agree to notify the clinic at least 2 hours in advance if you need to cancel or reschedule your appointment. Repeated no-shows may result in suspension of your account.
          </p>
        </section>
      </div>
    </div>
  )
}
