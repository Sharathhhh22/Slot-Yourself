"use client"
import { useState } from "react"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setTimeout(() => setStatus('success'), 1500)
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Have questions about integrating your clinic or using our platform? We are here to help.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1 space-y-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Contact Information</h2>
            <div className="space-y-6 text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-teal-600 shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Email Us</p>
                  <p>support@Appointly.com</p>
                  <p>partnerships@Appointly.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-teal-600 shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Call Us</p>
                  <p>1-800-SLOT-NOW</p>
                  <p>Mon-Fri, 9am - 6pm EST</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-teal-600 shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Headquarters</p>
                  <p>123 Health Tech Blvd, Suite 400</p>
                  <p>San Francisco, CA 94107</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
            {status === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900/30 text-teal-600 rounded-full flex items-center justify-center mb-6">
                  <Mail className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h3>
                <p className="text-slate-600 dark:text-slate-400">Thank you for reaching out. A member of our team will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                    <input required type="text" className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                    <input required type="text" className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                  <input required type="email" className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
                  <textarea required rows={5} className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"></textarea>
                </div>
                <button disabled={status === 'sending'} className="w-full h-14 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-70">
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
