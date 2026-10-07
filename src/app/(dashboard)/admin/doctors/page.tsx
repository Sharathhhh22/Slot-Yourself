import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export const revalidate = 0

export default async function AdminDoctorsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin' && profile?.role !== 'staff') {
    redirect('/dashboard')
  }

  const { data: doctors } = await supabase.from('doctors').select('id, name, specialty, experience_years, is_active').order('name', { ascending: true })

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-[1200px]">
      <div className="mb-4">
        <Link href="/admin" className="text-[13px] font-medium tracking-wide text-slate-500 hover:text-slate-900 flex items-center">
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Admin Panel
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Manage Doctors</h2>
          <p className="text-slate-500 mt-1">View and edit practicing physicians.</p>
        </div>
        <Link
          href="/admin/doctors/new"
          className="inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-6 text-[14px] font-medium tracking-wide text-white hover:bg-slate-800 transition-colors shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Doctor
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Doctors</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor Name</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-slate-500 py-8">No doctors found.</TableCell>
                </TableRow>
              ) : (
                doctors?.map((doc: any) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell className="text-slate-500">{doc.specialty || 'N/A'}</TableCell>
                    <TableCell className="text-slate-500">{doc.experience_years ? `${doc.experience_years} years` : 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${doc.is_active ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10'}`}>
                        {doc.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
