"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, User, Search, Moon, Sun } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useTheme } from "next-themes"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [user, setUser] = React.useState<any>(null)
  const [mounted, setMounted] = React.useState(false)
  
  const supabase = createClient()

  React.useEffect(() => {
    setMounted(true)
  }, [])

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
      ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-black/5 dark:border-white/5" 
      : "bg-transparent border-b border-transparent"
  }`

  return (
    <>
      <header className={navClasses}>
        <div className="mx-auto flex h-[72px] md:h-[88px] max-w-[1400px] items-center justify-between px-8 md:px-12">
          
          <Link href="/" className="flex items-center group">
            <span className="text-[17px] font-bold tracking-tight text-slate-900 dark:text-white transition-opacity duration-200 group-hover:opacity-70">
              APPOINTly
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`nav-text text-sm tracking-wide transition-colors ${
                    isActive ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="h-8 w-40 bg-slate-100 rounded-md pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>
            
            <button 
              className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors" 
              aria-label="Toggle Dark Mode" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {mounted && theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <Link 
                href="/dashboard"
                className="inline-flex h-8 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 px-4 py-2 nav-text text-sm tracking-wide text-slate-900 dark:text-white transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <User className="w-3.5 h-3.5 mr-2" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="nav-text text-sm tracking-wide text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
                >
                  Log In
                </Link>
                <Link 
                  href="/signup"
                  className="inline-flex h-8 items-center justify-center rounded bg-slate-900 dark:bg-white px-5 nav-text text-sm tracking-wide text-white dark:text-slate-900 transition-opacity hover:opacity-90"
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
            className="md:hidden fixed top-[72px] inset-x-0 z-40 bg-white dark:bg-slate-950 border-t border-black/5 dark:border-white/5 overflow-hidden flex flex-col"
          >
            <div className="flex flex-col px-8 py-8 space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="h-10 w-full bg-slate-100 dark:bg-slate-900 rounded-lg pl-10 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all dark:text-white"
                />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="nav-text text-lg tracking-wide text-slate-900 dark:text-white">Theme</span>
                <button 
                  className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300"
                  aria-label="Toggle Dark Mode" 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {mounted && theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="nav-text text-lg tracking-wide text-slate-900 dark:text-slate-300"
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-8 flex flex-col gap-4 border-t border-black/5">
                {user ? (
                  <Link 
                    href="/dashboard"
                    className="inline-flex items-center justify-center w-full h-12 rounded bg-slate-900 dark:bg-white text-[14px] font-medium tracking-wide text-white dark:text-slate-900"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link 
                      href="/login"
                      className="inline-flex items-center justify-center w-full h-12 rounded bg-slate-50 dark:bg-slate-800 text-[14px] font-medium tracking-wide text-slate-900 dark:text-white"
                    >
                      Log In
                    </Link>
                    <Link 
                      href="/signup"
                      className="inline-flex items-center justify-center w-full h-12 rounded bg-slate-900 dark:bg-white text-[14px] font-medium tracking-wide text-white dark:text-slate-900"
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
