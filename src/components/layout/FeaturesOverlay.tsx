"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"

export function FeaturesOverlay() {
  const [showScroll, setShowScroll] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showCookie, setShowCookie] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Check cookie consent
    if (!localStorage.getItem("cookieConsent")) {
      // Delay showing cookie banner for better UX
      const timer = setTimeout(() => setShowCookie(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress
      const totalScroll = document.documentElement.scrollTop
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scroll = ((totalScroll / windowHeight) * 100).toString()
      setScrollProgress(Number(scroll))

      // Show/hide scroll to top button
      if (totalScroll > 300) {
        setShowScroll(true)
      } else {
        setShowScroll(false)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true")
    setShowCookie(false)
  }

  if (!isClient) return null

  return (
    <>
      {/* 8. Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-transparent">
        <div 
          className="h-full bg-teal-600 transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 4. ^ top button */}
      <AnimatePresence>
        {showScroll && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 md:right-12 z-50 p-3 bg-white border border-slate-200 shadow-lg rounded-full text-slate-700 hover:text-teal-600 hover:border-teal-200 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 2. simple cookie banner */}
      <AnimatePresence>
        {showCookie && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-6 right-24 md:left-auto md:right-32 md:max-w-sm z-40 bg-slate-900 dark:bg-slate-800 text-white p-4 rounded-xl shadow-xl flex flex-col sm:flex-row items-center gap-4 justify-between border border-slate-800 dark:border-slate-700"
          >
            <p className="text-sm text-slate-300 leading-tight">
              We use strictly necessary cookies to keep you logged in. No tracking.
            </p>
            <div className="flex gap-2 shrink-0">
              <button 
                onClick={acceptCookies}
                className="px-4 py-2 text-sm font-medium bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
              >
                Got it
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
