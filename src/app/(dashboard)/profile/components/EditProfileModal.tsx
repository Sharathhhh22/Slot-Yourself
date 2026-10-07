"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Pencil, Loader2 } from "lucide-react"
import { updateProfile } from "@/app/actions/profile"

export function EditProfileModal({ profile, userEmail }: { profile: any, userEmail: string | undefined }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    const result = await updateProfile(formData)
    
    if (result.error) {
      setError(result.error)
    } else {
      setOpen(false)
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50 h-9 px-4 py-2">
        <Pencil className="w-4 h-4 mr-2" />
        Edit Profile
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input id="full_name" name="full_name" defaultValue={profile.full_name} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address <span className="text-slate-400 font-normal">(Read Only)</span></Label>
            <Input id="email" defaultValue={userEmail} disabled className="bg-slate-50" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mobile">Phone Number</Label>
              <Input id="mobile" name="mobile" defaultValue={profile.mobile} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Physical Address</Label>
            <Input id="address" name="address" defaultValue={profile.address} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea id="bio" name="bio" defaultValue={profile.bio} className="resize-none h-24" placeholder="Briefly describe your role or medical history..." />
          </div>

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
