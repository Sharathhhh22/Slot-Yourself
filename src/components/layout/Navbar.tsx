'use client'

import Link from "next/link"
import { Building2, Calendar, LayoutDashboard, Settings, Users, Menu, LogOut, LogIn } from "lucide-react"
import { Button } from "../ui/button"
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  
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
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center space-x-2">
          {/* Hamburger Menu Icon (Mobile & Desktop) */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-md p-2 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-600"
          >
            <Menu className="h-6 w-6 text-slate-600" />
          </button>
          
          <Building2 className="h-6 w-6 text-primary-600 ml-2" />
          <span className="font-semibold tracking-tight text-slate-900">
            SlotUrSelf
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <Button variant="ghost" className="text-sm font-medium text-slate-600 hidden md:flex" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          ) : (
            <Button asChild variant="outline" className="text-sm font-medium hidden md:flex">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </Button>
          )}
          <Button asChild className="hidden md:flex">
            <Link href="/appointments/new">Book Appointment</Link>
          </Button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 z-50 w-64 mt-2 ml-4 rounded-md border border-slate-200 bg-white shadow-lg">
          <div className="flex flex-col p-2 space-y-1">
            <Link 
              href="/" 
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard className="mr-3 h-4 w-4" />
              Dashboard
            </Link>
            <Link 
              href="/appointments" 
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              onClick={() => setIsOpen(false)}
            >
              <Calendar className="mr-3 h-4 w-4" />
              Appointments
            </Link>
            <Link 
              href="/patients" 
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              onClick={() => setIsOpen(false)}
            >
              <Users className="mr-3 h-4 w-4" />
              Patients
            </Link>
            <Link 
              href="/settings" 
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="mr-3 h-4 w-4" />
              Settings
            </Link>
            
            <div className="border-t border-slate-100 my-2 pt-2 md:hidden flex flex-col space-y-2">
              <Button asChild className="w-full justify-start">
                <Link href="/appointments/new" onClick={() => setIsOpen(false)}>Book Appointment</Link>
              </Button>
              {user ? (
                <Button variant="ghost" className="w-full justify-start text-slate-600" onClick={() => { setIsOpen(false); handleLogout(); }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              ) : (
                <Button variant="outline" className="w-full justify-start" asChild onClick={() => setIsOpen(false)}>
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
