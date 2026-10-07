"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const full_name = formData.get("full_name") as string
  const mobile = formData.get("mobile") as string
  const address = formData.get("address") as string
  const bio = formData.get("bio") as string
  
  // Update profiles table
  const { error } = await supabase
    .from('profiles')
    .update({ 
      full_name, 
      mobile, 
      address, 
      bio 
    })
    .eq('id', user.id)
    
  if (error) {
    console.error("Profile update error:", error)
    return { error: error.message }
  }

  revalidatePath('/profile')
  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." }
  }
  
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." }
  }

  const { error } = await supabase.auth.updateUser({ password })
  
  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
