import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Calendar, Shield, Activity, Stethoscope, HeartPulse, Clock, FileText, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-primary-100 selection:text-primary-900">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 pt-24 pb-32 border-b border-slate-200">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container relative mx-auto px-6 md:px-12">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-sm text-primary-600 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary-600 mr-2 animate-pulse"></span>
              Accepting New Patients
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
              Exceptional care, <br className="hidden md:block"/>
              <span className="text-primary-600">without the wait.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
              Book appointments instantly, manage your medical records, and consult with top specialists—all from one beautiful digital platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button asChild size="lg" className="text-base h-14 px-8 w-full sm:w-auto shadow-lg shadow-primary-600/20">
                <Link href="/appointments/new">
                  Book Appointment <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base h-14 px-8 w-full sm:w-auto bg-white hover:bg-slate-50">
                <Link href="/login">Patient Portal Login</Link>
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 p-2 overflow-hidden transform hover:-translate-y-1 transition-transform duration-500">
            <div className="aspect-[16/9] w-full relative rounded-xl overflow-hidden bg-slate-100">
              <Image
                src="/images/showcase/dashboard.jpg"
                alt="SlotUrSelf Clinical Dashboard"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Specialties */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Specialties</h2>
            <p className="text-lg text-slate-600">We offer comprehensive healthcare services across multiple disciplines, combining world-class medical expertise with cutting-edge technology.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: HeartPulse, name: "Cardiology", desc: "Expert care for your heart health and cardiovascular system." },
              { icon: Activity, name: "Neurology", desc: "Advanced diagnostics and treatment for nervous system disorders." },
              { icon: Stethoscope, name: "General Practice", desc: "Comprehensive primary care for you and your family." },
              { icon: Calendar, name: "Pediatrics", desc: "Specialized, compassionate care for infants and children." }
            ].map((Service, idx) => (
              <div key={idx} className="group rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-md hover:border-primary-100">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 group-hover:scale-110 transition-transform">
                  <Service.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">{Service.name}</h3>
                <p className="text-slate-600 leading-relaxed">{Service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Experience Features */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">A frictionless healthcare experience.</h2>
              <p className="text-lg text-slate-400 mb-8">We've redesigned the clinical experience from the ground up to respect your time and give you complete control over your health data.</p>
              
              <div className="space-y-6">
                {[
                  { icon: Clock, title: "Zero Wait Times", desc: "Our intelligent scheduling algorithms ensure you see your doctor exactly when you're supposed to." },
                  { icon: FileText, title: "Digital Health Records", desc: "Access your lab results, prescriptions, and visit history instantly from your secure portal." },
                  { icon: Shield, title: "Enterprise Security", desc: "Your health data is protected by military-grade encryption and strict privacy protocols." }
                ].map((feature, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="mt-1 flex-shrink-0 h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-primary-400">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                      <p className="text-slate-400">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-800 border border-slate-700">
                 <Image
                    src="/images/showcase/patient-record.jpg"
                    alt="Patient Digital Records"
                    fill
                    className="object-cover opacity-90"
                  />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl max-w-xs border border-slate-100 hidden md:block">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Appointment Confirmed</p>
                    <p className="text-sm text-slate-500">Today at 10:30 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary-600">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to prioritize your health?</h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">Join thousands of patients who have already switched to a better, faster, and more modern healthcare experience.</p>
          <Button asChild size="lg" className="bg-white text-primary-900 hover:bg-slate-100 text-base h-14 px-10">
            <Link href="/appointments/new">Book Your First Visit</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
