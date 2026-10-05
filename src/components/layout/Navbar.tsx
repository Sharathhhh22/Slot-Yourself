'use client'

import Link from "next/link"
import { Menu, X, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()
  
  const supabase = createClient()

  // Handle Auth State
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // Handle Scroll State
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle Mobile Menu Close on route change or ESC key
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const links = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Appointments", href: "/appointments" },
    { label: "Patients", href: "/patients" },
    { label: "Admin", href: "/admin" },
  ]

  return (
    <>
      <motion.nav 
        initial={false}
        animate={{
          height: isScrolled ? "68px" : "84px",
          backgroundColor: isScrolled ? "rgba(247, 247, 245, 0.85)" : "rgba(247, 247, 245, 0)",
          borderBottom: isScrolled ? "1px solid rgba(229, 229, 226, 1)" : "1px solid rgba(229, 229, 226, 0)",
          backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)"
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center"
      >
        <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between px-6 md:px-16">
          
          {/* LOGO */}
          <Link href="/" className="group flex items-center">
            <motion.span 
              whileHover={{ opacity: 0.7 }}
              className="text-[15px] font-bold tracking-tight text-[#111111]"
            >
              SLOTURSELF
            </motion.span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center space-x-10">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="group relative text-[14px] font-medium transition-colors"
                >
                  <span className={isActive ? "text-[#111111]" : "text-[#6B6B6B] group-hover:text-[#111111]"}>
                    {link.label}
                  </span>
                  
                  {/* Hover Underline */}
                  <span className={`absolute left-0 bottom-[-4px] h-[1px] bg-[#111111] transition-all duration-300 ease-out origin-left ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
              )
            })}
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <button onClick={handleLogout} className="group relative text-[14px] font-medium text-[#6B6B6B] hover:text-[#111111] transition-colors">
                Sign Out
                <span className="absolute left-0 bottom-[-4px] h-[1px] bg-[#111111] transition-all duration-300 ease-out origin-left w-0 group-hover:w-full" />
              </button>
            ) : (
              <Link href="/login" className="group relative text-[14px] font-medium text-[#6B6B6B] hover:text-[#111111] transition-colors">
                Sign In
                <span className="absolute left-0 bottom-[-4px] h-[1px] bg-[#111111] transition-all duration-300 ease-out origin-left w-0 group-hover:w-full" />
              </Link>
            )}
            
            <Link 
              href="/appointments/new" 
              className="group flex items-center justify-center bg-[#111111] text-white px-5 py-[10px] rounded-[10px] text-[14px] font-medium transition-colors hover:bg-[#242424]"
            >
              Book Appointment
              <motion.span
                className="ml-2 inline-block"
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
              </motion.span>
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button 
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2 -mr-2 text-[#111111] focus:outline-none"
            aria-label="Open Menu"
            aria-expanded={isOpen}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </motion.nav>

      {/* MOBILE FULL-SCREEN OVERLAY MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.2 } }}
            className="fixed inset-0 z-[60] bg-[#F7F7F5] flex flex-col"
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between px-6 h-20">
              <span className="text-[15px] font-bold tracking-tight text-[#111111]">
                SLOTURSELF
              </span>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 text-[#111111] focus:outline-none"
                aria-label="Close Menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Menu Links */}
            <div className="flex flex-col px-6 pt-12 gap-8">
              {links.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
                  transition={{ delay: 0.1 + idx * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href={link.href} className="text-3xl font-medium text-[#111111] block">
                    <span className="text-sm text-[#8A8A8A] font-normal mr-4">0{idx + 1}</span>
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div 
                className="w-full h-[1px] bg-[#E5E5E2] my-4"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.5, originX: 0 }}
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
                transition={{ delay: 0.35, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-6"
              >
                {user ? (
                  <button onClick={handleLogout} className="text-xl font-medium text-[#6B6B6B] text-left">Sign Out</button>
                ) : (
                  <Link href="/login" className="text-xl font-medium text-[#111111]">Sign In</Link>
                )}
                
                <Link 
                  href="/appointments/new" 
                  className="group inline-flex items-center justify-between bg-[#111111] text-white px-6 py-4 rounded-[12px] text-[16px] font-medium w-full"
                >
                  Book Appointment
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
