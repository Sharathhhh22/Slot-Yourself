"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { Search, CalendarCheck, CreditCard, Stethoscope } from "lucide-react"

export default function HowItWorksPage() {
  const steps = [
    { 
      title: "Find Your Specialist", 
      desc: "Use our intelligent search to find clinics, doctors, or specific specialties near your location. Filter by availability, rating, or gender.",
      icon: Search
    },
    { 
      title: "Select a Time Slot", 
      desc: "View the doctor's actual calendar in real-time. Pick a slot that works for your schedule. No guessing, no waiting on hold.",
      icon: CalendarCheck
    },
    { 
      title: "Secure Your Booking", 
      desc: "Confirm your appointment instantly. Choose whether you want to pay securely online right now, or pay later when you arrive at the clinic.",
      icon: CreditCard
    },
    { 
      title: "Get Better", 
      desc: "Show up at your scheduled time, show your digital pass to skip the registration line, and get the care you need.",
      icon: Stethoscope
    }
  ]

  return (
    <div className="min-h-screen pt-32 pb-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[800px] mx-auto px-6 md:px-12">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            How It Works
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Booking a doctor should be as easy as booking a table at a restaurant.
          </p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-slate-200 dark:bg-slate-800 -translate-x-1/2"></div>
          
          <div className="space-y-16">
            {steps.map((step, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                key={idx} 
                className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Content Side */}
                <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${idx % 2 === 0 ? 'md:text-right md:pr-16' : 'md:pl-16'}`}>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{step.desc}</p>
                </div>

                {/* Center Icon */}
                <div className="absolute left-8 md:left-1/2 top-0 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 w-16 h-16 bg-teal-600 rounded-full border-4 border-slate-50 dark:border-slate-950 flex items-center justify-center z-10">
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                
                {/* Empty Side for balancing */}
                <div className="hidden md:block w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-32 text-center bg-slate-900 dark:bg-slate-800 p-12 rounded-3xl">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to skip the waiting room?</h2>
          <Link 
            href="/signup" 
            className="inline-flex items-center justify-center bg-teal-600 text-white px-10 py-4 rounded-xl text-lg font-bold transition-transform hover:bg-teal-500"
          >
            Create Your Account
          </Link>
        </div>
      </div>
    </div>
  )
}
