import Link from "next/link"
import { ArrowRight, Briefcase, MapPin, Clock } from "lucide-react"

export default function CareersPage() {
  const jobs = [
    { title: "Senior Full Stack Engineer", dept: "Engineering", loc: "Remote (US/Canada)", type: "Full-time" },
    { title: "Product Designer", dept: "Design", loc: "San Francisco, CA / Remote", type: "Full-time" },
    { title: "Medical Partnerships Lead", dept: "Sales", loc: "New York, NY", type: "Full-time" },
    { title: "Customer Success Specialist", dept: "Support", loc: "Remote (Global)", type: "Full-time" },
  ]

  return (
    <div className="min-h-screen pt-32 pb-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-block px-4 py-1.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm font-bold tracking-wide uppercase mb-6">
            We are hiring
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            Help us fix healthcare.
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Join a team of engineers, designers, and medical professionals dedicated to making healthcare access seamless.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
            Open Positions
          </h2>
          
          {jobs.map((job, idx) => (
            <div key={idx} className="group bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between hover:border-teal-500 transition-colors">
              <div className="mb-6 md:mb-0">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-teal-500 transition-colors">
                  {job.title}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {job.dept}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.loc}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {job.type}</span>
                </div>
              </div>
              
              <Link href="/contact" className="inline-flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-teal-500 hover:text-white dark:hover:bg-teal-500 dark:hover:text-white text-slate-900 dark:text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                Apply Now <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center p-10 bg-slate-100 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Don't see a fit?</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">We're always looking for talented people. Send us your resume anyway.</p>
          <a href="mailto:careers@appointly.com" className="text-teal-600 dark:text-teal-400 font-bold hover:underline">careers@appointly.com</a>
        </div>
      </div>
    </div>
  )
}
