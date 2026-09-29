import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Stethoscope, Activity, Settings } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export const revalidate = 0

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Verify Admin Access
  const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin' && profile?.role !== 'staff') {
    redirect('/dashboard')
  }

  // Fetch counts
  const { count: clinicsCount } = await supabase.from('clinics').select('*', { count: 'exact', head: true })
  const { count: deptsCount } = await supabase.from('departments').select('*', { count: 'exact', head: true })
  const { count: doctorsCount } = await supabase.from('doctors').select('*', { count: 'exact', head: true })

  return (
    <div className="container mx-auto p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Admin Control Panel</h2>
          <p className="text-slate-500">Manage clinics, departments, and medical staff.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Clinics Management */}
        <Link href="/admin/clinics" className="block group">
          <Card className="transition-all hover:border-primary-500 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors">Clinics</CardTitle>
              <Building2 className="h-5 w-5 text-slate-400 group-hover:text-primary-500 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 mb-1">{clinicsCount || 0}</div>
              <p className="text-sm text-slate-500">Active locations</p>
            </CardContent>
          </Card>
        </Link>

        {/* Departments Management */}
        <Link href="/admin/departments" className="block group">
          <Card className="transition-all hover:border-primary-500 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors">Departments</CardTitle>
              <Activity className="h-5 w-5 text-slate-400 group-hover:text-primary-500 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 mb-1">{deptsCount || 0}</div>
              <p className="text-sm text-slate-500">Medical specialties</p>
            </CardContent>
          </Card>
        </Link>

        {/* Doctors Management */}
        <Link href="/admin/doctors" className="block group">
          <Card className="transition-all hover:border-primary-500 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors">Doctors</CardTitle>
              <Stethoscope className="h-5 w-5 text-slate-400 group-hover:text-primary-500 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 mb-1">{doctorsCount || 0}</div>
              <p className="text-sm text-slate-500">Practicing physicians</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
