"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react"

export default function EditorialLandingPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Custom branded preloader logic
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => setIsLoading(false), 200)
          return 100
        }
        return prev + 5
      })
    }, 40)
    return () => clearInterval(timer)
  }, [])

  const ease = [0.22, 1, 0.36, 1] as const

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } }
  }

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#111111] font-sans selection:bg-[#111111] selection:text-[#F7F7F5]">
      
      {/* PRELOADER */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ clipPath: "inset(0 0 0 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.8, ease } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0A0A] text-[#F5F5F5]"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-8"
            >
              SLOTURSELF
            </motion.div>
            <div className="text-sm font-mono text-[#999999] tracking-widest">
              {progress.toString().padStart(3, '0')}%
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pb-32">
        {/* HERO SECTION */}
        <section className="px-6 md:px-16 pt-32 md:pt-48 pb-24 md:pb-40 max-w-[1400px] mx-auto">
          <motion.div 
            initial="hidden" 
            animate={!isLoading ? "visible" : "hidden"} 
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="mb-12">
              <span className="text-[11px] md:text-[13px] font-medium tracking-widest text-[#6B6B6B] uppercase">
                Independent Healthcare Technology
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeUp} 
              className="text-[clamp(48px,8vw,120px)] font-bold leading-[1.05] tracking-[-0.03em] mb-12 max-w-5xl"
            >
              We build clinical software that matters.
            </motion.h1>

            <div className="grid md:grid-cols-12 gap-8 md:gap-4">
              <motion.div variants={fadeUp} className="md:col-span-5 md:col-start-1">
                <p className="text-[17px] md:text-[19px] text-[#6B6B6B] leading-relaxed max-w-md">
                  Building useful healthcare infrastructure, intelligent booking tools, and products designed around real patient problems.
                </p>
              </motion.div>
              
              <motion.div variants={fadeUp} className="md:col-span-4 md:col-start-9 flex flex-col items-start md:items-end">
                <Link 
                  href="/appointments/new" 
                  className="group flex items-center gap-3 bg-[#111111] text-white px-8 py-4 rounded-full text-[15px] font-medium transition-all hover:bg-[#242424]"
                >
                  Book Appointment 
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* BORDER SEPARATOR */}
        <div className="w-full h-[1px] bg-[#E5E5E2]"></div>

        {/* CAPABILITIES SECTION */}
        <section className="px-6 md:px-16 py-24 md:py-32 max-w-[1400px] mx-auto">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }} 
            variants={stagger}
          >
            <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <motion.div variants={fadeUp}>
                <span className="block text-[13px] text-[#6B6B6B] mb-4">01 / 03</span>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Capabilities</h2>
              </motion.div>
              <motion.p variants={fadeUp} className="text-[#6B6B6B] text-[17px] max-w-sm leading-relaxed">
                Practical healthcare systems designed for modern clinical workflows.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  title: "Intelligent Triage", 
                  desc: "AI-driven symptom analysis to direct patients to the correct department instantly." 
                },
                { 
                  title: "Real-time Scheduling", 
                  desc: "Direct integration with specialist calendars. No phone calls, no waiting." 
                },
                { 
                  title: "Unified Records", 
                  desc: "Secure, encrypted access to clinical notes, prescriptions, and test results." 
                }
              ].map((item, idx) => (
                <motion.div 
                  key={idx} 
                  variants={fadeUp}
                  className="group relative border border-[#E5E5E2] rounded-[20px] p-8 bg-white transition-colors hover:bg-[#FDFDFD]"
                >
                  <div className="text-[13px] text-[#8A8A8A] mb-12">0{idx + 1}</div>
                  <h3 className="text-xl font-bold text-[#111111] mb-4">{item.title}</h3>
                  <p className="text-[15px] text-[#6B6B6B] leading-relaxed mb-8">{item.desc}</p>
                  <div className="flex justify-end">
                    <ArrowUpRight className="w-5 h-5 text-[#A3A3A1] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#111111]" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* BORDER SEPARATOR */}
        <div className="w-full h-[1px] bg-[#E5E5E2]"></div>

        {/* PROCESS SECTION */}
        <section className="px-6 md:px-16 py-24 md:py-32 max-w-[1400px] mx-auto">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }} 
            variants={stagger}
          >
            <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <motion.div variants={fadeUp}>
                <span className="block text-[13px] text-[#6B6B6B] mb-4">02 / 03</span>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">The Process</h2>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-4 border-t border-[#E5E5E2]">
              {[
                { title: "FIND", desc: "Locate verified specialists near you." },
                { title: "SELECT", desc: "Review profiles and availability." },
                { title: "BOOK", desc: "Confirm your time slot instantly." },
                { title: "ATTEND", desc: "Check in with your digital QR pass." }
              ].map((step, idx) => (
                <motion.div 
                  key={idx} 
                  variants={fadeUp}
                  className="border-b md:border-b-0 md:border-r border-[#E5E5E2] last:border-r-0 py-12 md:p-12 md:pl-8 first:pl-0"
                >
                  <div className="text-[13px] text-[#8A8A8A] mb-8">0{idx + 1}</div>
                  <h3 className="text-lg font-bold text-[#111111] mb-3">{step.title}</h3>
                  <p className="text-[15px] text-[#6B6B6B] leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA FOOTER */}
        <section className="bg-[#0A0A0A] text-[#F5F5F5] py-32 px-6 md:px-16 mt-20">
          <div className="max-w-[1400px] mx-auto">
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={stagger}
              className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12"
            >
              <motion.div variants={fadeUp}>
                <span className="block text-[13px] text-[#999999] mb-8">03 / 03</span>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-12">
                  Let's build<br />something useful.
                </h2>
                <Link 
                  href="/appointments/new" 
                  className="group inline-flex items-center gap-3 bg-[#F5F5F5] text-[#0A0A0A] px-8 py-4 rounded-full text-[15px] font-medium transition-all hover:bg-white"
                >
                  Start Now 
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col md:flex-row gap-12 md:gap-24 text-[15px] text-[#999999]">
                <div className="flex flex-col gap-4">
                  <span className="text-white font-medium mb-2">Platform</span>
                  <Link href="/appointments/new" className="hover:text-white transition-colors">Book Visit</Link>
                  <Link href="/login" className="hover:text-white transition-colors">Patient Portal</Link>
                </div>
                <div className="flex flex-col gap-4">
                  <span className="text-white font-medium mb-2">Connect</span>
                  <a href="#" className="hover:text-white transition-colors">Twitter</a>
                  <a href="#" className="hover:text-white transition-colors">GitHub</a>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mt-32 pt-8 border-t border-[#242424] text-[13px] text-[#6B6B6B] flex justify-between"
            >
              <span>© 2026 SlotUrSelf Technologies.</span>
              <span>Independent Platform.</span>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}
