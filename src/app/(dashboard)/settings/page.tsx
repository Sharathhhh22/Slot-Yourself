import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Save } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { saveMainClinic } from "@/app/actions/admin"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: clinics } = await supabase.from('clinics').select('*').limit(1)
  const clinic = clinics?.[0] || {}

  return (
    <div className="container mx-auto max-w-4xl p-6 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="section-title tracking-tight text-slate-900">Settings</h2>
          <p className="text-slate-500">Configure clinic profile and system preferences.</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <form action={saveMainClinic}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-slate-500" />
                <CardTitle>Clinic Profile</CardTitle>
              </div>
              <CardDescription>
                This information will be displayed on the booking portal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clinicName">Clinic Name</Label>
                <Input id="clinicName" name="clinicName" placeholder="e.g., Downtown Medical Center" defaultValue={clinic.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Physical Address</Label>
                <Input id="address" name="address" placeholder="123 Health Ave, Suite 100" defaultValue={clinic.address} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input id="contactEmail" name="contactEmail" type="email" placeholder="contact@clinic.com" defaultValue={clinic.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input id="contactPhone" name="contactPhone" type="tel" placeholder="(555) 123-4567" defaultValue={clinic.phone} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-100 px-6 py-4">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
