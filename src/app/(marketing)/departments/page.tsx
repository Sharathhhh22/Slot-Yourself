import Link from "next/link"
import { Search, Heart, Brain, Bone, Eye, Smile, Activity } from "lucide-react"

export default function DepartmentsPage() {
  const departments = [
    { name: "Cardiology", desc: "Heart and vascular specialists", icon: Heart, count: "120+ doctors" },
    { name: "Neurology", desc: "Brain and nervous system", icon: Brain, count: "85+ doctors" },
    { name: "Orthopedics", desc: "Bone and joint specialists", icon: Bone, count: "200+ doctors" },
    { name: "Ophthalmology", desc: "Eye care and vision", icon: Eye, count: "150+ doctors" },
    { name: "Dentistry", desc: "Oral health and surgery", icon: Smile, count: "300+ doctors" },
    { name: "General Practice", desc: "Primary care and wellness", icon: Activity, count: "500+ doctors" },
  ]

  return (
    <div className="min-h-screen pt-32 pb-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            Find the Right Doctor
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Browse our network of verified specialists across all major medical departments.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-16">
          <div className="flex items-center bg-white dark:bg-slate-900 rounded-full px-6 py-4 shadow-sm border border-slate-200 dark:border-slate-800">
            <Search className="w-6 h-6 text-slate-400 mr-4" />
            <input 
              type="text" 
              placeholder="Search by doctor name, specialty, or condition..." 
              className="bg-transparent border-none w-full outline-none text-slate-900 dark:text-white placeholder-slate-400 text-lg"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept, idx) => (
            <Link key={idx} href="/appointments/new" className="group bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-teal-50 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-500 transition-colors">
                <dept.icon className="w-7 h-7 text-teal-600 dark:text-teal-400 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{dept.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">{dept.desc}</p>
              <div className="text-sm font-medium text-teal-600 dark:text-teal-400">
                {dept.count} &rarr;
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
