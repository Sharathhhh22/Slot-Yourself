"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, MapPin, Calendar, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main id="main-content" className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-white dark:bg-slate-950 pt-32 pb-32 lg:pt-40 lg:pb-48 border-b border-slate-200 dark:border-slate-800">
          {/* Subtle Enterprise Background Pattern */}
          <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]" 
               style={{ backgroundImage: 'radial-gradient(#14b8a6 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          
          <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-semibold text-sm mb-8 border border-teal-100 dark:border-teal-800"
            >
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              Trusted by 500+ clinics nationwide
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 max-w-4xl leading-[1.1]"
            >
              Skip the waiting room. <br />
              <span className="text-teal-600 dark:text-teal-400">
                Book doctors instantly.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl leading-relaxed"
            >
              The enterprise healthcare platform connecting patients directly with verified specialists. Real-time availability, secure booking, and zero hold music.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center"
            >
              <Link 
                href="/signup" 
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3.5 rounded-xl flex items-center justify-center transition-colors text-lg shadow-sm"
              >
                Create Free Account
              </Link>
              <Link 
                href="/how-it-works" 
                className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-8 py-3.5 rounded-xl flex items-center justify-center transition-colors text-lg border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                See How It Works
              </Link>
            </motion.div>
          </div>
        </section>

        {/* SOCIAL PROOF SECTION */}
        <section className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-[1400px] mx-auto px-6 md:px-16 text-center">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-10">Trusted by top healthcare providers</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale">
              {/* Simulated logos using text for now */}
              <div className="text-2xl font-black font-serif text-slate-800 dark:text-slate-300">Mayo Clinic</div>
              <div className="text-2xl font-black font-sans text-slate-800 dark:text-slate-300 tracking-tighter">Cleveland Clinic</div>
              <div className="text-2xl font-black font-sans text-slate-800 dark:text-slate-300">Kaiser Permanente</div>
              <div className="text-2xl font-black font-serif text-slate-800 dark:text-slate-300 italic">Johns Hopkins</div>
            </div>
          </div>
        </section>

        {/* QUICK FEATURES PREVIEW */}
        <section className="py-24 bg-white dark:bg-slate-900">
          <div className="max-w-[1400px] mx-auto px-6 md:px-16">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">Healthcare on your terms.</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">Everything you need to manage your health, seamlessly connected in one intelligent platform.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center mb-6">
                  <Calendar className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Real-time scheduling</h3>
                <p className="text-slate-600 dark:text-slate-400">See exactly when doctors are available and book your slot instantly. No more waiting on hold.</p>
              </div>
              
              <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center mb-6">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Verified specialists</h3>
                <p className="text-slate-600 dark:text-slate-400">Every doctor on our platform is thoroughly vetted. Read real reviews from real patients.</p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center mb-6">
                  <MapPin className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Location-based matching</h3>
                <p className="text-slate-600 dark:text-slate-400">Find the best care near you. Filter by insurance, distance, and specific medical conditions.</p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
