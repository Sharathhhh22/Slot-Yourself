import Link from "next/link"
import { Building2, ShieldCheck, HeartPulse } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-white dark:bg-slate-900">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            About APPONTly
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            We are on a mission to completely eliminate the waiting room.
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
          <p className="mb-6">
            The traditional process of booking a medical appointment is broken. It involves phone calls, waiting on hold, miscommunications, and worst of all: showing up at your scheduled time only to wait another hour in a crowded room.
          </p>
          <p className="mb-12">
            APPONTly was built to bridge the digital gap between patients and healthcare providers. By connecting directly to clinic management systems, we provide absolute transparency into doctor availability and allow patients to secure their spots instantly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl">
            <Building2 className="w-10 h-10 text-teal-600 mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">500+</h3>
            <p className="text-slate-600 dark:text-slate-400">Partner Clinics across the country</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl">
            <ShieldCheck className="w-10 h-10 text-teal-600 mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">10k+</h3>
            <p className="text-slate-600 dark:text-slate-400">Verified Healthcare Professionals</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl">
            <HeartPulse className="w-10 h-10 text-teal-600 mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">1M+</h3>
            <p className="text-slate-600 dark:text-slate-400">Hours saved in waiting rooms</p>
          </div>
        </div>

        <div className="bg-teal-600 text-white rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Join our mission</h2>
          <p className="text-teal-100 text-lg mb-8 max-w-2xl mx-auto">
            Whether you are a patient looking for better care, or a clinic looking to modernize your workflow.
          </p>
          <Link 
            href="/signup" 
            className="inline-flex items-center justify-center bg-white text-teal-900 px-8 py-3 rounded-xl font-bold transition-colors hover:bg-slate-100"
          >
            Get Started Today
          </Link>
        </div>
      </div>
    </div>
  )
}
