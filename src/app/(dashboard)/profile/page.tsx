import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Calendar, Briefcase, User as UserIcon } from "lucide-react"
import { EditProfileModal } from "./components/EditProfileModal"
import { ProfileCompletion } from "./components/ProfileCompletion"
import { SecuritySection } from "./components/SecuritySection"
import { AvatarUpload } from "./components/AvatarUpload"

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch full profile from the database
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const joinDate = new Date(profile?.created_at || user.created_at).toLocaleDateString('en-US', {
    month: 'long', year: 'numeric'
  })

  // Calculate completion percentage
  const fields = [
    { name: 'full_name', value: profile?.full_name, label: 'Add full name' },
    { name: 'mobile', value: profile?.mobile, label: 'Add phone number' },
    { name: 'address', value: profile?.address, label: 'Add physical address' },
    { name: 'bio', value: profile?.bio, label: 'Add professional bio' },
    { name: 'avatar_url', value: profile?.avatar_url, label: 'Upload profile photo' }
  ]
  
  const completedFields = fields.filter(f => !!f.value).length
  const completionPercentage = Math.round((completedFields / fields.length) * 100)
  const missingFields = fields.filter(f => !f.value).map(f => f.label)

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* HEADER SECTION */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="h-32 bg-slate-900 absolute top-0 left-0 w-full" />
        
        <div className="relative pt-16 px-6 pb-8 md:px-10 md:pb-10 flex flex-col md:flex-row gap-6 md:items-end">
          <div className="shrink-0 -mt-2">
            <AvatarUpload userId={user.id} initialUrl={profile?.avatar_url} />
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  {profile?.full_name || "Anonymous User"}
                </h1>
                <p className="text-slate-500 font-medium">{profile?.role === 'admin' ? 'System Administrator' : 'Patient'}</p>
              </div>
              <div className="shrink-0">
                <EditProfileModal profile={profile || {}} userEmail={user.email} />
              </div>
            </div>
            
            {profile?.bio && (
              <p className="mt-4 text-slate-600 max-w-2xl leading-relaxed">
                {profile.bio}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-6 text-sm text-slate-500 font-medium">
              {profile?.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {profile.address}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                Member since {joinDate}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="md:col-span-1 space-y-8">
          <ProfileCompletion percentage={completionPercentage} missingFields={missingFields} />
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:col-span-2 space-y-8">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-slate-400" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid sm:grid-cols-2 gap-y-8 gap-x-6">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <UserIcon className="w-4 h-4" /> Full Name
                  </span>
                  <p className="font-semibold text-slate-900">{profile?.full_name || "—"}</p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email Address
                  </span>
                  <p className="font-semibold text-slate-900">{user.email || "—"}</p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Phone Number
                  </span>
                  <p className="font-semibold text-slate-900">{profile?.mobile || "—"}</p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Location
                  </span>
                  <p className="font-semibold text-slate-900">{profile?.address || "—"}</p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Account Type
                  </span>
                  <p className="font-semibold text-slate-900 capitalize">{profile?.role || "Patient"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <SecuritySection userEmail={user.email || ''} />
        </div>

      </div>
    </div>
  )
}
