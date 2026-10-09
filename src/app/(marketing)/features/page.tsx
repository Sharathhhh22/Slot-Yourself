"use client"
import { motion } from "framer-motion"
import { CalendarClock, ShieldCheck, HeartPulse, CheckCircle2 } from "lucide-react"

export default function FeaturesPage() {
  const features = [
    { 
      icon: CalendarClock, 
      title: "Real-time Booking Engine", 
      desc: "Our platform connects directly to the clinics' master calendars. When you see a slot, it is actually available. Book it and it is instantly secured.",
      bullets: ["No double bookings", "Instant confirmation", "24/7 access"]
    },
    { 
      icon: ShieldCheck, 
      title: "Verified Medical Professionals", 
      desc: "We don't let just anyone onto the platform. Every doctor undergoes a rigorous background check and credential verification process.",
      bullets: ["License verification", "Peer reviews", "Continuous monitoring"]
    },
    { 
      icon: HeartPulse, 
      title: "Intelligent Specialist Matching", 
      desc: "Not sure who you need to see? Our intelligent routing system helps you find the exact right specialist for your specific symptoms or condition.",
      bullets: ["Symptom analysis", "Proximity search", "Availability filtering"]
    }
  ]

  return (
    <div className="min-h-screen pt-32 pb-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            Powerful Features for Modern Healthcare
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            We built APPOINTly to solve the actual problems with booking medical appointments.
          </p>
        </div>

        <div className="space-y-32">
          {features.map((feature, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              key={idx}
              className={`flex flex-col md:flex-row gap-12 lg:gap-24 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="flex-1 w-full">
                <div className="aspect-square md:aspect-video rounded-3xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-300 dark:border-slate-700">
                  <feature.icon className="w-32 h-32 text-slate-400 dark:text-slate-600" strokeWidth={1} />
                </div>
              </div>
              <div className="flex-1 w-full space-y-6">
                <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mb-8">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{feature.title}</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
                <ul className="space-y-4 pt-4">
                  {feature.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
                      <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
