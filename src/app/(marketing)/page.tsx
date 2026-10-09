"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, MapPin, Calendar, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main id="main-content" className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-slate-900 pt-32 pb-40 lg:pt-48 lg:pb-56">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-slate-900/90 mix-blend-multiply" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-teal-600/20 blur-[100px] -translate-y-1/4 rounded-full" />
            <div className="absolute bottom-0 left-0 w-1/2 h-full bg-blue-600/20 blur-[100px] translate-y-1/4 rounded-full" />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-16 flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-teal-300 font-medium text-sm mb-8 border border-white/10"
            >
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              Over 500+ clinics active today
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 max-w-5xl"
            >
              Skip the waiting room. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
                Book instantly.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl leading-relaxed"
            >
              The intelligent healthcare platform that connects you directly with verified specialists. Real-time availability, zero hold music.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8"
            >
              <Link 
                href="/signup" 
                className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold px-10 py-4 rounded-2xl flex items-center justify-center transition-colors text-lg whitespace-nowrap shadow-[0_0_40px_-10px_rgba(20,184,166,0.5)]"
              >
                Create Free Account
              </Link>
              <Link 
                href="/how-it-works" 
                className="bg-white/10 hover:bg-white/20 text-white font-medium px-10 py-4 rounded-2xl flex items-center justify-center transition-colors text-lg whitespace-nowrap backdrop-blur-sm border border-white/10"
              >
                See How It Works <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}
