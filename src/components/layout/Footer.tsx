import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 md:py-16">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold text-white mb-4 tracking-tight">SlotUrSelf</h3>
            <p className="text-sm leading-relaxed mb-6">
              Verified specialists, real-time slots, and no phone calls. Your healthcare journey, simplified.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Patients</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/appointments/new" className="hover:text-white transition-colors">Book Appointment</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Patient Portal</Link></li>
              <li><Link href="/departments" className="hover:text-white transition-colors">Find Doctors</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 text-sm flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
          <p className="order-2 md:order-1">© {new Date().getFullYear()} SlotUrSelf. All rights reserved.</p>
          <div className="flex flex-col items-center md:items-end gap-2 order-1 md:order-2">
            <p>
              Developed by <span className="font-semibold text-primary-400">TechSqad</span>
            </p>
            <div className="flex gap-4 text-slate-400 text-xs">
              <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
