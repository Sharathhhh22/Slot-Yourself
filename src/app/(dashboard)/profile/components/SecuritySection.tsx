"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Shield, Key, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updatePassword } from "@/app/actions/profile"

export function SecuritySection({ userEmail }: { userEmail: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)
    
    const formData = new FormData(e.currentTarget)
    const result = await updatePassword(formData)
    
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setIsEditing(false)
      ;(e.target as HTMLFormElement).reset()
    }
    setLoading(false)
  }

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="w-5 h-5 text-slate-400" />
          Account Security
        </CardTitle>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Change Password
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        
        {success && (
          <div className="bg-green-50 text-green-800 p-4 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium">Password updated successfully</p>
              <p className="text-sm mt-1 opacity-90">Your account is secure. Please use your new password next time you log in.</p>
            </div>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input id="password" name="password" type="password" required minLength={6} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={6} />
            </div>
            
            {error && <p className="text-sm text-red-600">{error}</p>}
            
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Key className="w-4 h-4 mr-2" />}
                Update Password
              </Button>
              <Button type="button" variant="ghost" onClick={() => { setIsEditing(false); setError(""); }}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium text-slate-900">Email Login</p>
              <p className="text-sm text-slate-500">You log in using the email address: {userEmail}</p>
            </div>
          </div>
        )}
        
      </CardContent>
    </Card>
  )
}
