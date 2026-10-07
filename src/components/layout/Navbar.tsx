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

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const navClasses = `sticky top-0 z-50 w-full border-b transition-all duration-200 ${
    isScrolled || isMobileMenuOpen 
      ? "bg-white/80 backdrop-blur-md border-slate-200 shadow-sm" 
      : "bg-white border-transparent"
  }`

  return (
    <>
      <header className={navClasses}>
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:px-16">
          
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-slate-900">
              SlotUrSelf
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[14px] font-medium transition-colors ${
                    isActive ? "text-primary-600" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link 
                href="/dashboard"
                className="inline-flex h-9 items-center justify-center rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200"
              >
                <User className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="text-[14px] font-medium text-slate-600 transition-colors hover:text-slate-900"
                >
                  Log In
                </Link>
                <Link 
                  href="/signup"
                  className="inline-flex h-9 items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden flex items-center justify-center p-2 -mr-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden fixed top-16 inset-x-0 z-40 bg-white border-b border-slate-200 shadow-lg overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-lg font-medium text-slate-800 py-2 border-b border-slate-50"
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-4 flex flex-col gap-3">
                {user ? (
                  <Link 
                    href="/dashboard"
                    className="inline-flex items-center justify-center w-full h-12 rounded-full bg-primary-600 text-white font-bold"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link 
                      href="/login"
                      className="inline-flex items-center justify-center w-full h-12 rounded-full bg-slate-100 text-slate-900 font-bold"
                    >
                      Log In
                    </Link>
                    <Link 
                      href="/signup"
                      className="inline-flex items-center justify-center w-full h-12 rounded-full bg-primary-600 text-white font-bold shadow-md shadow-primary-600/20"
                    >
                      Sign Up
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
