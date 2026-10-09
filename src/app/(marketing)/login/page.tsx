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
import { PasswordStrength } from "@/components/ui/password-strength"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  
  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      })

      if (error) {
        if (error.message.includes("Invalid login")) {
          throw new Error("Incorrect email or password. Please try again.")
        }
        throw error
      }
      
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
        <h1 className="section-title text-slate-900">Welcome Back</h1>
        <p className="mt-2 text-slate-500">Log in to your APPONTly account</p>
      </div>

      <div className="w-full max-w-md">
        <Card className="border-slate-200 shadow-sm rounded-2xl">
          <form onSubmit={handleLogin}>
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl">Log In</CardTitle>
              <CardDescription>Enter your email and password to access your dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input 
                  id="login-email" 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  value={loginEmail} 
                  onChange={e => setLoginEmail(e.target.value)} 
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-primary-600 hover:underline font-medium">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Input 
                    id="login-password" 
                    type={showLoginPassword ? "text" : "password"} 
                    required 
                    value={loginPassword} 
                    onChange={e => setLoginPassword(e.target.value)} 
                    className="h-11 pr-10"
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrength value={loginPassword} className="mt-3" />
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
                {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Signing In...</> : "Log In"}
              </Button>
              
              <p className="text-sm text-slate-500 text-center w-full">
                Don't have an account? <Link href="/signup" className="text-primary-600 font-semibold hover:underline">Sign Up</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
