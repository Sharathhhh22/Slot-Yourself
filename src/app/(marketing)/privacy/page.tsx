import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | APPOINTly",
}

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto max-w-3xl py-24 px-6">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Data Protection</h2>
          <p>
            Your privacy is important to us. This policy outlines how we collect, use, and protect your personal and medical data in accordance with the India Digital Personal Data Protection (DPDP) Act.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Information Collection</h2>
          <p>
            We collect information you provide when you register an account, book an appointment, or fill out a health questionnaire on our platform. This includes your name, contact information, and reason for visit.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Data Sharing</h2>
          <p>
            We share your data exclusively with the medical professionals and clinics you choose to book appointments with. We do not sell your data to third parties.
          </p>
        </section>
      </div>
    </div>
  )
}
