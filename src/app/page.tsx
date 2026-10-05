"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Calendar, Shield, Activity, Stethoscope, HeartPulse, Clock, FileText, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function LandingPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  }

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 font-sans">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-32 px-6 border-b border-slate-200 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-50 pointer-events-none"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-start text-left">
              
              <motion.div variants={fadeUp} className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 mb-6 uppercase tracking-wider">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
                Accepting New Patients
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
                Modern clinical care, <br className="hidden md:block"/>
                <span className="text-blue-600">without the waiting room.</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
                Book appointments directly with verified specialists. Manage your medical records, prescriptions, and follow-ups through a secure patient portal.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button asChild size="lg" className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all hover:scale-[1.02]">
                  <Link href="/appointments/new">
                    Book an Appointment <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8 border-slate-300 text-slate-700 hover:bg-slate-50 font-medium shadow-sm bg-white transition-all hover:scale-[1.02]">
                  <Link href="/login">Patient Portal Login</Link>
                </Button>
              </motion.div>
              
              <motion.div variants={fadeUp} className="mt-10 flex items-center gap-4 text-sm text-slate-500">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden"><img src="https://api.dicebear.com/7.x/notionists/svg?seed=Doc1" alt="Doctor" /></div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden"><img src="https://api.dicebear.com/7.x/notionists/svg?seed=Doc2" alt="Doctor" /></div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden"><img src="https://api.dicebear.com/7.x/notionists/svg?seed=Doc3" alt="Doctor" /></div>
                </div>
                <p>Over 50+ specialists available today.</p>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative rounded-2xl border border-slate-200 bg-white shadow-xl p-2 md:p-3 hover:-translate-y-1 transition-transform duration-500">
                <div className="aspect-[4/3] w-full relative rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                  <Image
                    src="/images/showcase/dashboard.jpg"
                    alt="Clinical Dashboard Interface"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                  
                  {/* Clean UI Overlay */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="absolute bottom-6 right-6 bg-white border border-slate-200 rounded-xl shadow-lg p-4 flex items-center gap-4 hidden sm:flex">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Appointment Confirmed</p>
                      <p className="text-xs text-slate-500">Dr. Sarah Jenkins • 10:30 AM</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Medical Specialties</h2>
            <p className="text-slate-600 max-w-2xl text-lg">Direct access to board-certified specialists. Select a department to view available appointment slots.</p>
          </motion.div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: HeartPulse, name: "Cardiology", desc: "Heart health and cardiovascular system diagnostics." },
              { icon: Activity, name: "Neurology", desc: "Diagnostics and treatment for nervous system conditions." },
              { icon: Stethoscope, name: "General Practice", desc: "Comprehensive primary care and preventative medicine." },
              { icon: Calendar, name: "Pediatrics", desc: "Specialized healthcare for infants, children, and adolescents." }
            ].map((Service, idx) => (
              <motion.div variants={fadeUp} key={idx} className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                  <Service.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{Service.name}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{Service.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-24 bg-white border-b border-slate-200 overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
               <Image
                  src="/images/showcase/patient-record.jpg"
                  alt="Patient Medical Records"
                  fill
                  className="object-cover"
                />
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 tracking-tight">Streamlined healthcare operations.</motion.h2>
              <motion.p variants={fadeUp} className="text-lg text-slate-600 mb-10">We've built a secure, compliant infrastructure that connects patients with providers efficiently, reducing administrative overhead and wait times.</motion.p>
              
              <div className="space-y-8">
                {[
                  { icon: Clock, title: "Real-time Availability", desc: "See accurate, up-to-the-minute doctor schedules and book instantly without phone calls." },
                  { icon: FileText, title: "Unified Medical Records", desc: "Access your clinical notes, test results, and prescriptions from a single secure dashboard." },
                  { icon: Shield, title: "Enterprise-grade Security", desc: "HIPAA-compliant infrastructure with end-to-end encryption for all patient data." }
                ].map((feature, idx) => (
                  <motion.div variants={fadeUp} key={idx} className="flex gap-4">
                    <div className="mt-1 flex-shrink-0 h-10 w-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-1 text-slate-900">{feature.title}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Schedule your consultation today.</h2>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">Create a free patient account to book appointments, message your care team, and access your health records.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-12 px-8 bg-white text-blue-700 hover:bg-slate-50 font-medium transition-all hover:scale-105 shadow-md">
              <Link href="/appointments/new">
                Book an Appointment
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 border-blue-400 text-white hover:bg-blue-700 hover:text-white font-medium bg-transparent transition-all hover:scale-105">
              <Link href="/login">Create Account</Link>
            </Button>
          </div>
        </motion.div>
      </section>

    </div>
  )
}
