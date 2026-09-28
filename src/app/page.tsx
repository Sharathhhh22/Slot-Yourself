import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Calendar, Shield, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-24 pb-32 border-b border-slate-200">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
              Modern Clinic Management, <span className="text-primary-600">Simplified.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl">
              SlotUrSelf provides an enterprise-grade appointment platform and clinical dashboard designed to eliminate friction for both patients and staff.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-base h-14 px-8">
                <Link href="/login">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base h-14 px-8 bg-white">
                <Link href="/showcase">View UX Showcase</Link>
              </Button>
            </div>
          </div>

          {/* Hero Image - The 4th image (Dashboard) */}
          <div className="relative mx-auto max-w-5xl rounded-xl border border-slate-200 bg-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden group">
            <div className="aspect-[16/9] w-full relative">
              <Image
                src="/images/showcase/dashboard.jpg"
                alt="SlotUrSelf Clinical Dashboard"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Smart Scheduling</h3>
              <p className="text-slate-600">Prevent double-bookings instantly with real-time slot validation and relational database constraints.</p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-2">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Secure & Protected</h3>
              <p className="text-slate-600">Enterprise-grade Row Level Security ensures patients only see their own records, while staff see it all.</p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Clinical Analytics</h3>
              <p className="text-slate-600">Gain insights into your facility's operational health with built-in data dashboards and metrics.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
