'use client'

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter, usePathname } from "next/navigation"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()
  
  const supabase = createClient()

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

  // Close mobile menu when path changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <nav className="border-b border-[#E5E5E2] bg-[#F7F7F5]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto flex h-16 items-center justify-between px-6 md:px-16">
        
        {/* LOGO */}
        <Link href="/" className="text-[17px] font-bold tracking-tight text-[#111111]">
          SLOTURSELF
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/dashboard" className="text-[13px] font-medium text-[#6B6B6B] hover:text-[#111111] transition-colors">
            Dashboard
          </Link>
          <Link href="/appointments" className="text-[13px] font-medium text-[#6B6B6B] hover:text-[#111111] transition-colors">
            Appointments
          </Link>
          <Link href="/patients" className="text-[13px] font-medium text-[#6B6B6B] hover:text-[#111111] transition-colors">
            Patients
          </Link>
          <Link href="/admin" className="text-[13px] font-medium text-[#6B6B6B] hover:text-[#111111] transition-colors">
            Admin
          </Link>
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <button onClick={handleLogout} className="text-[13px] font-medium text-[#6B6B6B] hover:text-[#111111] transition-colors">
              Sign Out
            </button>
          ) : (
            <Link href="/login" className="text-[13px] font-medium text-[#6B6B6B] hover:text-[#111111] transition-colors">
              Sign In
            </Link>
          )}
          
          <Link 
            href="/appointments/new" 
            className="inline-flex items-center justify-center bg-[#111111] text-white px-5 py-2 rounded-full text-[13px] font-medium transition-all hover:bg-[#242424] hover:scale-[1.02]"
          >
            Book Appointment
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 -mr-2 text-[#111111]"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {isOpen && (
        <div className="md:hidden border-t border-[#E5E5E2] bg-white absolute w-full px-6 py-6 shadow-xl flex flex-col space-y-4">
          <Link href="/dashboard" className="text-[15px] font-medium text-[#111111]">Dashboard</Link>
          <Link href="/appointments" className="text-[15px] font-medium text-[#111111]">Appointments</Link>
          <Link href="/patients" className="text-[15px] font-medium text-[#111111]">Patients</Link>
          <Link href="/admin" className="text-[15px] font-medium text-[#111111]">Admin Panel</Link>
          
          <div className="w-full h-[1px] bg-[#E5E5E2] my-2"></div>
          
          {user ? (
            <button onClick={handleLogout} className="text-[15px] font-medium text-[#6B6B6B] text-left">Sign Out</button>
          ) : (
            <Link href="/login" className="text-[15px] font-medium text-[#111111]">Sign In</Link>
          )}
          
          <Link 
            href="/appointments/new" 
            className="inline-flex items-center justify-center bg-[#111111] text-white px-6 py-3 rounded-full text-[14px] font-medium mt-4 w-full"
          >
            Book Appointment
          </Link>
        </div>
      )}
    </nav>
  )
}
