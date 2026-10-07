import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createDoctor } from "@/app/actions/admin"

export default function NewDoctorPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-[800px]">
      <div className="mb-4">
        <Link href="/admin/doctors" className="text-[13px] font-medium tracking-wide text-slate-500 hover:text-slate-900 flex items-center">
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Doctors
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Add New Doctor</h2>
        <p className="text-slate-500 mt-1">Register a new practicing physician.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Doctor Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createDoctor} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Doctor Name *</Label>
              <Input id="name" name="name" placeholder="e.g. John Doe" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Input id="specialty" name="specialty" placeholder="e.g. Cardiologist" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience_years">Experience (Years)</Label>
              <Input id="experience_years" name="experience_years" type="number" min="0" placeholder="e.g. 10" />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">
                Save Doctor
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
