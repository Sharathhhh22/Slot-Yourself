"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [regName, setRegName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regConfirmPassword, setRegConfirmPassword] = useState("")
  const [showRegPassword, setShowRegPassword] = useState(false)
  
  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")
    
    if (regPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.")
      setIsLoading(false)
      return
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg("Passwords do not match.")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: regEmail,
        password: regPassword,
        options: {
          data: {
            full_name: regName,
          }
        }
      })

      if (error) throw error
      
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setErrorMsg(err.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex min-h-[80vh] flex-col items-center justify-center p-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create an Account</h1>
        <p className="mt-2 text-slate-500">Join SlotUrSelf to manage your appointments</p>
      </div>

      <div className="w-full max-w-md">
        <Card className="border-slate-200 shadow-sm rounded-2xl">
          <form onSubmit={handleRegister}>
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl">Sign Up</CardTitle>
              <CardDescription>
                Registering allows you to book appointments, view digital passes, and manage your health records securely.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="reg-name">Full Name</Label>
                <Input 
                  id="reg-name" 
                  placeholder="e.g. John Doe" 
                  required 
                  value={regName} 
                  onChange={e => setRegName(e.target.value)} 
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email Address</Label>
                <Input 
                  id="reg-email" 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  value={regEmail} 
                  onChange={e => setRegEmail(e.target.value)} 
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <div className="relative">
                  <Input 
                    id="reg-password" 
                    type={showRegPassword ? "text" : "password"} 
                    required 
                    value={regPassword} 
                    onChange={e => setRegPassword(e.target.value)} 
                    className="h-11 pr-10"
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reg-confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input 
                    id="reg-confirm-password" 
                    type={showRegPassword ? "text" : "password"} 
                    required 
                    value={regConfirmPassword} 
                    onChange={e => setRegConfirmPassword(e.target.value)} 
                    className="h-11 pr-10"
                  />
                </div>
                <p className="text-xs text-slate-500">Must be at least 6 characters long.</p>
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  required 
                  className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-primary-600 focus:ring-primary-600" 
                />
                <label htmlFor="terms" className="text-sm text-slate-600">
                  I agree to the <Link href="/terms" className="text-primary-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>.
                </label>
              </div>
              
              {errorMsg && (
                <div className="flex items-start bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                  <AlertCircle className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-4 pb-8">
              <Button type="submit" className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-base font-bold shadow-md shadow-primary-600/20" disabled={isLoading}>
                {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Creating Account...</> : "Create Account"}
              </Button>
              
              <p className="text-sm text-slate-500 text-center w-full">
                Already have an account? <Link href="/login" className="text-primary-600 font-semibold hover:underline">Log In</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
