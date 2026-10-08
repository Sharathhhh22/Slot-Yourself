"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Star, HeartPulse, Clock, ShieldCheck, Stethoscope, Users, Building, CalendarCheck, ChevronDown } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function HealthcareLandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }
  }
  
  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-primary-100 selection:text-primary-900">
      <main id="main-content" className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-16">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white -z-10" />
          
          <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-xl">
              <motion.div variants={fadeUp} className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700 mb-6">
                <HeartPulse className="w-4 h-4 mr-2" /> For Patients
              </motion.div>
              
              <motion.h1 variants={fadeUp} className="hero-title mb-6 text-slate-900">
                Book your doctor in under 60 seconds.
              </motion.h1>
              
              <motion.p variants={fadeUp} className="body-text text-lg md:text-xl text-slate-600 mb-10">
                Verified specialists, real-time slots, and instant confirmations. Skip the phone calls and waiting rooms.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/signup" 
                  className="inline-flex items-center justify-center bg-primary-600 text-white px-8 py-4 rounded-full text-base font-semibold transition-all hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/20"
                >
                  Create Account <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link 
                  href="/login" 
                  className="inline-flex items-center justify-center bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-full text-base font-medium transition-colors hover:bg-slate-50"
                >
                  Log In
                </Link>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 40 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden md:block"
            >
              {/* Mockup Card */}
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl shadow-primary-900/10 border border-slate-100 p-8 max-w-sm ml-auto overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 to-primary-600"></div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                    <Stethoscope className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="card-title">Dr. Sarah Jenkins</h3>
                    <p className="text-sm text-slate-500">Cardiology Specialist</p>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-sm font-medium">Tomorrow, 10:00 AM</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md font-bold">Available</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-sm font-medium">Tomorrow, 11:30 AM</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md font-bold">Available</span>
                  </div>
                </div>
                <div className="w-full bg-primary-600 text-white text-center py-3 rounded-xl font-medium shadow-md">
                  Confirm Time
                </div>
              </div>

              {/* Decorative shapes */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-100 rounded-full blur-3xl -z-10 opacity-70"></div>
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-100 rounded-full blur-3xl -z-10 opacity-60"></div>
            </motion.div>
          </div>
        </section>

        {/* STATS STRIP */}
        <section className="border-y border-slate-100 bg-white py-10">
          <div className="max-w-[1400px] mx-auto px-6 md:px-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
              <div className="flex flex-col items-center justify-center text-center">
                <Users className="w-6 h-6 text-primary-600 mb-3" />
                <h4 className="text-3xl font-bold text-slate-900">50K+</h4>
                <p className="text-sm text-slate-500 mt-1">Patients Treated</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <Stethoscope className="w-6 h-6 text-primary-600 mb-3" />
                <h4 className="text-3xl font-bold text-slate-900">120+</h4>
                <p className="text-sm text-slate-500 mt-1">Verified Doctors</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <Building className="w-6 h-6 text-primary-600 mb-3" />
                <h4 className="text-3xl font-bold text-slate-900">15</h4>
                <p className="text-sm text-slate-500 mt-1">Partner Clinics</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <Star className="w-6 h-6 text-primary-600 mb-3" />
                <h4 className="text-3xl font-bold text-slate-900">4.9/5</h4>
                <p className="text-sm text-slate-500 mt-1">Patient Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* SPECIALTIES / FEATURES */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-[1400px] mx-auto px-6 md:px-16">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="section-title mb-4">Comprehensive Care</h2>
              <p className="text-slate-600 text-lg">We connect you with top-tier medical professionals across all major specialties.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Clock, title: "Real-time Availability", desc: "See exactly when a doctor is free. No more calling clinics to ask for open slots." },
                { icon: ShieldCheck, title: "Verified Professionals", desc: "Every doctor on our platform undergoes rigorous verification of their credentials." },
                { icon: HeartPulse, title: "Specialist Matching", desc: "Find the right doctor for your specific health needs instantly." }
              ].map((item, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-6">
                    <item.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="subheading mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS TIMELINE */}
        <section id="how-it-works" className="py-24 bg-white">
          <div className="max-w-[1400px] mx-auto px-6 md:px-16">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="section-title mb-4">How It Works</h2>
              <p className="text-slate-600 text-lg">Your journey to better health in four simple steps.</p>
            </div>

            <div className="relative">
              {/* Line behind steps */}
              <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-slate-100 -z-10"></div>
              
              <div className="grid md:grid-cols-4 gap-12 md:gap-6">
                {[
                  { title: "Find", desc: "Search for clinics or specialists near you." },
                  { title: "Select", desc: "Review profiles and real-time availability." },
                  { title: "Book", desc: "Confirm your appointment slot securely." },
                  { title: "Attend", desc: "Show up and get the care you deserve." }
                ].map((step, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="relative flex flex-col items-center text-center"
                  >
                    <div className="w-24 h-24 bg-white border-4 border-primary-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                      <span className="text-2xl font-bold text-primary-600">0{idx + 1}</span>
                    </div>
                    <h3 className="subheading mb-2">{step.title}</h3>
                    <p className="text-slate-600">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 bg-slate-900 text-white">
          <div className="max-w-[1400px] mx-auto px-6 md:px-16">
            <div className="text-center mb-16">
              <h2 className="section-title mb-4">Trusted by Patients</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">Don't just take our word for it. Here's what real people have to say.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Rahul S.", review: "Booking a dermatologist used to take me 3 phone calls. I did it on SlotUrSelf in 45 seconds while waiting for my coffee." },
                { name: "Priya M.", review: "I love being able to see exactly which doctors are available today. Saved me a trip to the ER for a minor injury." },
                { name: "Arjun K.", review: "The digital pass feature is great. I walked into the clinic, showed my phone, and bypassed the massive registration line." }
              ].map((testimonial, idx) => (
                <div key={idx} className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                  <div className="flex text-yellow-400 mb-4">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <p className="text-slate-300 italic mb-6">"{testimonial.review}"</p>
                  <p className="font-bold text-white">— {testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-24 bg-white">
          <div className="max-w-[800px] mx-auto px-6 md:px-16">
            <div className="text-center mb-16">
              <h2 className="section-title mb-4">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { q: "Is the booking actually real-time?", a: "Yes. Our platform connects directly to the clinics' calendar systems. The slots you see are guaranteed available." },
                { q: "Do I have to pay to book?", a: "No. SlotUrSelf is completely free for patients. You pay your consultation fees directly at the clinic." },
                { q: "Can I cancel my appointment?", a: "Yes, you can cancel or reschedule up to 2 hours before your slot via your patient dashboard." }
              ].map((faq, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-slate-50 transition-colors"
                  >
                    <span className="card-title">{faq.q}</span>
                    <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform", openFaq === idx && "rotate-180")} />
                  </button>
                  {openFaq === idx && (
                    <div className="p-6 pt-0 bg-white text-slate-600 border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 bg-primary-600 text-white">
          <div className="max-w-[1000px] mx-auto px-6 md:px-16 text-center">
            <h2 className="section-title mb-6">Ready to get started?</h2>
            <p className="text-primary-100 text-xl mb-10 max-w-2xl mx-auto">
              Join thousands of patients who book their appointments instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signup" 
                className="inline-flex items-center justify-center bg-white text-primary-900 px-10 py-5 rounded-full text-lg font-bold transition-transform hover:scale-105 shadow-xl shadow-primary-900/20"
              >
                Create Account
              </Link>
              <Link 
                href="/login" 
                className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-10 py-5 rounded-full text-lg font-bold transition-colors hover:bg-white/10"
              >
                Log In
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
