import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export const revalidate = 0

export default async function AdminClinicsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin' && profile?.role !== 'staff') {
    redirect('/dashboard')
  }

  const { data: clinics } = await supabase.from('clinics').select('*').order('name', { ascending: true })

  return (
    <div className="container mx-auto p-6 md:p-8">
      <div className="mb-4">
        <Link href="/admin" className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Admin Panel
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Manage Clinics</h2>
          <p className="text-slate-500">View and edit your healthcare facilities.</p>
        </div>
        <Link
          href="/admin/clinics/new" 
          className="inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-6 text-[14px] font-medium tracking-wide text-white hover:bg-slate-800 transition-colors shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Clinic
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Clinics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Clinic Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clinics?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-slate-500 py-8">No clinics found.</TableCell>
                </TableRow>
              ) : (
                clinics?.map((clinic: any) => (
                  <TableRow key={clinic.id}>
                    <TableCell className="font-medium">{clinic.name}</TableCell>
                    <TableCell className="text-slate-500">{clinic.address || 'N/A'}</TableCell>
                    <TableCell className="text-slate-500">{clinic.phone || 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${clinic.is_active ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10'}`}>
                        {clinic.is_active ? 'Active' : 'Inactive'}
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
