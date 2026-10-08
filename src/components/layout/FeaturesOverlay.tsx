"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp, MessageCircle, X } from "lucide-react"

export function FeaturesOverlay() {
  const [showScroll, setShowScroll] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showCookie, setShowCookie] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [isClient, setIsClient] = useState(false)

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactStatus('sending')
    // Simulate API call
    setTimeout(() => {
      setContactStatus('success')
      setTimeout(() => {
        setShowContact(false)
        setTimeout(() => setContactStatus('idle'), 300)
      }, 3000)
    }, 1000)
  }

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
      const scroll = `${(totalScroll / windowHeight) * 100}`
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
            className="fixed bottom-24 right-6 z-50 p-3 bg-white border border-slate-200 shadow-lg rounded-full text-slate-700 hover:text-teal-600 hover:border-teal-200 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 20. floating contact */}
      <button
        className="fixed bottom-6 right-6 z-50 p-4 bg-teal-600 text-white shadow-lg rounded-full hover:bg-teal-700 transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        aria-label={showContact ? "Close contact support" : "Contact support"}
        onClick={() => setShowContact(!showContact)}
      >
        {showContact ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Floating Contact Modal */}
      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden flex flex-col"
          >
            <div className="bg-teal-600 p-4 text-white">
              <h3 className="font-bold text-lg">Contact Support</h3>
              <p className="text-teal-100 text-sm">We typically reply within a few minutes.</p>
            </div>
            
            {contactStatus === 'success' ? (
              <div className="p-8 text-center flex flex-col items-center justify-center min-h-[250px]">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Thank you for reaching out. We will get back to you shortly.</p>
                <button 
                  onClick={() => setShowContact(false)}
                  className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="p-4 flex flex-col gap-4">
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
                  <input 
                    id="contact-email"
                    type="email" 
                    required
                    className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">How can we help?</label>
                  <textarea 
                    id="contact-message"
                    required
                    rows={4}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    placeholder="Type your message here..."
                  />
                </div>
                {contactStatus === 'error' && (
                  <p className="text-xs text-red-500">Failed to send message. Please try again.</p>
                )}
                <button 
                  type="submit"
                  disabled={contactStatus === 'sending'}
                  className="w-full py-2.5 bg-slate-900 dark:bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-slate-800 dark:hover:bg-teal-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {contactStatus === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. simple 🍪 banner */}
      <AnimatePresence>
        {showCookie && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-6 right-24 md:left-auto md:right-24 md:max-w-sm z-40 bg-slate-900 dark:bg-slate-800 text-white p-4 rounded-xl shadow-xl flex flex-col sm:flex-row items-center gap-4 justify-between border border-slate-800 dark:border-slate-700"
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
