import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Save } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-4xl p-6 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h2>
          <p className="text-slate-500">Configure clinic profile and system preferences.</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
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
              <Input id="clinicName" placeholder="e.g., Downtown Medical Center" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Physical Address</Label>
              <Input id="address" placeholder="123 Health Ave, Suite 100" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input id="contactEmail" type="email" placeholder="contact@clinic.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input id="contactPhone" type="tel" placeholder="(555) 123-4567" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-100 px-6 py-4">
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Profile
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Departments & Services</CardTitle>
            <CardDescription>
              Manage the clinical departments available for booking.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-slate-200 p-4">
              <p className="text-sm text-slate-500">
                No departments configured yet. Add departments to allow patients to book appointments.
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-100 px-6 py-4">
            <Button variant="outline">Manage Departments</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Staff Management</CardTitle>
            <CardDescription>
              Add doctors and staff members to the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="rounded-md border border-slate-200 p-4">
              <p className="text-sm text-slate-500">
                No staff members configured. You must add doctors before patients can book.
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-100 px-6 py-4">
            <Button variant="outline">Manage Staff</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
