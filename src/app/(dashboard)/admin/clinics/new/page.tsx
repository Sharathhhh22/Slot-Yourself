import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClinic } from "@/app/actions/admin"

export default function NewClinicPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-[800px]">
      <div className="mb-4">
        <Link href="/admin/clinics" className="text-[13px] font-medium tracking-wide text-slate-500 hover:text-slate-900 flex items-center">
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Clinics
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Add New Clinic</h2>
        <p className="text-slate-500 mt-1">Register a new healthcare facility in the system.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clinic Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createClinic} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Clinic Name *</Label>
              <Input id="name" name="name" placeholder="e.g. Downtown Medical Center" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" placeholder="e.g. 123 Main St, New York, NY" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" placeholder="e.g. +1 234 567 8900" />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">
                Save Clinic
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
