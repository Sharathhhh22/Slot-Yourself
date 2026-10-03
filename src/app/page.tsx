"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Calendar, Shield, Activity, Stethoscope, HeartPulse, Clock, FileText, CheckCircle2, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export default function LandingPage() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  // Fade up animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#030712] text-white selection:bg-[#3b82f6]/30 overflow-x-hidden font-sans">
      
      {/* Background Radial Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          style={{ y: yBackground }}
          className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full mix-blend-screen filter blur-[120px] opacity-30"
          animate={{
            background: [
              "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
              "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
              "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          style={{ y: yBackground }}
          className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] rounded-full mix-blend-screen filter blur-[120px] opacity-20"
          animate={{
            background: [
              "radial-gradient(circle, #ec4899 0%, transparent 70%)",
              "radial-gradient(circle, #4f46e5 0%, transparent 70%)",
              "radial-gradient(circle, #ec4899 0%, transparent 70%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 2 }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 md:pt-40 md:pb-32 px-6">
        <motion.div 
          style={{ opacity: opacityHero }}
          className="container mx-auto max-w-6xl"
        >
          <div className="flex flex-col items-center text-center">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 py-1.5 text-sm text-gray-300 mb-8 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
            >
              <Sparkles className="h-4 w-4 text-[#3b82f6] mr-2" />
              <span className="bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent font-medium">Next-Gen Healthcare</span>
              <span className="mx-2 text-white/20">|</span>
              Accepting New Patients
            </motion.div>

            <motion.h1 
              initial="hidden" animate="visible" variants={fadeUp}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[1.1]"
            >
              Healthcare, <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
                Redefined.
              </span>
            </motion.h1>

            <motion.p 
              initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl font-light leading-relaxed"
            >
              Experience the future of medicine. AI-driven triage, instant bookings, and a beautifully designed patient portal right in your pocket.
            </motion.p>

            <motion.div 
              initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full"
            >
              <Button asChild size="lg" className="h-14 px-8 rounded-full bg-white text-black hover:bg-gray-100 hover:scale-105 transition-all duration-300 font-semibold text-base shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center">
                <Link href="/appointments/new">
                  Book Appointment <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-full border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white transition-all duration-300 font-medium text-base flex items-center justify-center">
                <Link href="/login">Access Portal</Link>
              </Button>
            </motion.div>
          </div>

          {/* 3D Glassmorphic Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 50 }}
            className="mt-24 relative mx-auto max-w-5xl perspective-1000"
          >
            <div className="relative rounded-2xl md:rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(59,130,246,0.1)] p-2 md:p-4 rotate-x-12 hover:rotate-x-0 transition-transform duration-700 ease-out transform-gpu">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl md:rounded-[2rem] pointer-events-none"></div>
              <div className="aspect-[16/9] w-full relative rounded-xl md:rounded-2xl overflow-hidden bg-[#0a0a0a]">
                <Image
                  src="/images/showcase/dashboard.jpg"
                  alt="SlotUrSelf Clinical Dashboard"
                  fill
                  className="object-cover opacity-80"
                  priority
                />
                {/* Simulated Glass UI overlays */}
                <div className="absolute top-4 left-4 md:top-8 md:left-8 w-48 h-24 bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl hidden md:flex items-center p-4 shadow-2xl">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mr-4">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Status</div>
                    <div className="text-sm text-white font-medium">All Systems Nominal</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Bento Grid Specialties Section */}
      <section className="relative z-10 py-32 border-t border-white/5 bg-[#030712]/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="mb-16 md:mb-24"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Specialized Care.<br/><span className="text-gray-500">Intelligent routing.</span></h2>
            <p className="text-gray-400 text-lg max-w-xl">Our AI Triage system automatically connects you with the right specialist based on your symptoms.</p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.div variants={fadeUp} className="md:col-span-2 row-span-2 group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                <HeartPulse className="h-32 w-32 text-[#ec4899] blur-xl" />
              </div>
              <HeartPulse className="h-10 w-10 text-[#ec4899] mb-6 relative z-10" />
              <h3 className="text-2xl font-bold mb-3 relative z-10">Advanced Cardiology</h3>
              <p className="text-gray-400 relative z-10 max-w-sm">State-of-the-art cardiovascular diagnostics and preventative care, monitored directly through your patient app.</p>
            </motion.div>

            <motion.div variants={fadeUp} className="group rounded-3xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 transition-colors">
               <Activity className="h-8 w-8 text-[#3b82f6] mb-6" />
               <h3 className="text-xl font-bold mb-2">Neurology</h3>
               <p className="text-sm text-gray-400">Expert care for complex nervous system conditions.</p>
            </motion.div>

            <motion.div variants={fadeUp} className="group rounded-3xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 transition-colors">
               <Stethoscope className="h-8 w-8 text-[#8b5cf6] mb-6" />
               <h3 className="text-xl font-bold mb-2">General Practice</h3>
               <p className="text-sm text-gray-400">Your first stop for holistic, everyday health management.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32 border-t border-white/5 overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            >
              <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Frictionless Experience.</motion.h2>
              <motion.p variants={fadeUp} className="text-lg text-gray-400 mb-12 font-light">We've eliminated the waiting room. Everything from booking to prescriptions happens in real-time.</motion.p>
              
              <div className="space-y-8">
                {[
                  { icon: Clock, title: "Zero Wait Times", desc: "Intelligent scheduling ensures you see your doctor exactly when booked." },
                  { icon: FileText, title: "Digital Records", desc: "Instant access to lab results and visit history via secure portal." },
                  { icon: Shield, title: "Military-Grade Security", desc: "Your health data is encrypted and protected by strict privacy protocols." }
                ].map((feature, idx) => (
                  <motion.div key={idx} variants={fadeUp} className="flex gap-5 group">
                    <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 group-hover:text-white group-hover:bg-white/10 transition-all">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2 text-gray-200 group-hover:text-white transition-colors">{feature.title}</h4>
                      <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative lg:ml-auto w-full max-w-md"
            >
              {/* Decorative background glow for the image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6] to-[#8b5cf6] rounded-3xl blur-3xl opacity-20"></div>
              
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl">
                 <Image
                    src="/images/showcase/patient-record.jpg"
                    alt="Patient Digital Records"
                    fill
                    className="object-cover opacity-60 hover:opacity-80 transition-opacity duration-500 mix-blend-luminosity hover:mix-blend-normal"
                  />
                  
                  {/* Floating UI Elements */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-8 right-8 bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-3"
                  >
                    <Activity className="h-5 w-5 text-green-400" />
                    <span className="text-sm font-medium">Vitals Stable</span>
                  </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5 }}
             className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/40 p-12 md:p-20 backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#3b82f6]/10 to-transparent"></div>
            <h2 className="relative z-10 text-4xl md:text-6xl font-bold mb-6 tracking-tight">The Future of Health is Here.</h2>
            <p className="relative z-10 text-xl text-gray-400 mb-10 font-light">Join the revolution. Fast, secure, and intelligent care.</p>
            <Button asChild size="lg" className="relative z-10 h-14 px-10 rounded-full bg-white text-black hover:bg-gray-200 transition-colors font-semibold shadow-[0_0_30px_rgba(255,255,255,0.2)] inline-flex items-center justify-center">
              <Link href="/appointments/new">
                Start Your Journey <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
