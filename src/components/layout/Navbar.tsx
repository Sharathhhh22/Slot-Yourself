"use client"

import { useState } from "react"
import Link from "next/link"
import { Building2, CalendarDays, Menu, X } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
        
        <div className="flex items-center space-x-2">
          {/* Hamburger Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="mr-2 inline-flex items-center justify-center rounded-md p-1.5 text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-600"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <X className="block h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="block h-5 w-5" aria-hidden="true" />
            )}
          </button>

          <Building2 className="h-6 w-6 text-primary-600" />
          <span className="font-semibold tracking-tight text-slate-900">
            Slot Yourself
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/appointments/new"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-600"
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            Book Appointment
          </Link>
        </div>
      </div>

      {/* Mobile/Hamburger Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-14 left-0 w-64 rounded-br-lg border-b border-r border-slate-200 bg-white shadow-lg">
          <nav className="flex flex-col space-y-1 p-4 text-sm font-medium">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block rounded-md px-3 py-2 text-slate-700 transition-colors hover:bg-slate-100 hover:text-primary-600"
            >
              Dashboard
            </Link>
            <Link
              href="/appointments"
              onClick={() => setIsOpen(false)}
              className="block rounded-md px-3 py-2 text-slate-700 transition-colors hover:bg-slate-100 hover:text-primary-600"
            >
              Appointments
            </Link>
            <Link
              href="/patients"
              onClick={() => setIsOpen(false)}
              className="block rounded-md px-3 py-2 text-slate-700 transition-colors hover:bg-slate-100 hover:text-primary-600"
            >
              Patients
            </Link>
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="block rounded-md px-3 py-2 text-slate-700 transition-colors hover:bg-slate-100 hover:text-primary-600"
            >
              Settings
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
