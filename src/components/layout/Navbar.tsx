"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, User } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [user, setUser] = React.useState<any>(null)
  
  const supabase = createClient()

  React.useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  React.useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const navClasses = `sticky top-0 z-50 w-full transition-all duration-300 ${
    isScrolled || isMobileMenuOpen 
      ? "bg-white/90 backdrop-blur-md border-b border-black/5" 
      : "bg-transparent border-b border-transparent"
  }`

  return (
    <>
      <header className={navClasses}>
        <div className="mx-auto flex h-[72px] md:h-[88px] max-w-[1400px] items-center justify-between px-8 md:px-12">
          
          <Link href="/" className="flex items-center group">
            <span className="text-[17px] font-bold tracking-tight text-slate-900 transition-opacity duration-200 group-hover:opacity-70">
              SlotUrSelf
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[13px] font-medium tracking-wide transition-colors ${
                    isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <Link 
                href="/dashboard"
                className="inline-flex h-8 items-center justify-center rounded-md bg-slate-100 px-4 py-2 text-[13px] font-medium tracking-wide text-slate-900 transition-colors hover:bg-slate-200"
              >
                <User className="w-3.5 h-3.5 mr-2" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="text-[13px] font-medium tracking-wide text-slate-500 transition-colors hover:text-slate-900"
                >
                  Log In
                </Link>
                <Link 
                  href="/signup"
                  className="inline-flex h-8 items-center justify-center rounded bg-slate-900 px-5 text-[13px] font-medium tracking-wide text-white transition-opacity hover:opacity-90"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden flex items-center justify-center p-2 -mr-2 text-slate-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden fixed top-[72px] inset-x-0 z-40 bg-white border-t border-black/5 overflow-hidden flex flex-col"
          >
            <div className="flex flex-col px-8 py-8 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-lg font-medium tracking-wide text-slate-900"
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-8 flex flex-col gap-4 border-t border-black/5">
                {user ? (
                  <Link 
                    href="/dashboard"
                    className="inline-flex items-center justify-center w-full h-12 rounded bg-slate-900 text-[14px] font-medium tracking-wide text-white"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link 
                      href="/login"
                      className="inline-flex items-center justify-center w-full h-12 rounded bg-slate-50 text-[14px] font-medium tracking-wide text-slate-900"
                    >
                      Log In
                    </Link>
                    <Link 
                      href="/signup"
                      className="inline-flex items-center justify-center w-full h-12 rounded bg-slate-900 text-[14px] font-medium tracking-wide text-white"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
