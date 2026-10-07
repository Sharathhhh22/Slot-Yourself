"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// ==============================
// CLINICS
// ==============================
export async function createClinic(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get("name") as string
  const address = formData.get("address") as string
  const phone = formData.get("phone") as string

  if (!name) throw new Error("Name is required")

  const { error } = await supabase.from('clinics').insert([{ name, address, phone }])
  
  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/clinics')
  redirect('/admin/clinics')
}

export async function toggleClinicStatus(id: string, currentStatus: boolean) {
  const supabase = await createClient()
  await supabase.from('clinics').update({ is_active: !currentStatus }).eq('id', id)
  revalidatePath('/admin/clinics')
}

// ==============================
// DEPARTMENTS
// ==============================
export async function createDepartment(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get("name") as string
  const description = formData.get("description") as string

  if (!name) throw new Error("Name is required")

  const { error } = await supabase.from('departments').insert([{ name, description }])
  
  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/departments')
  redirect('/admin/departments')
}

export async function toggleDepartmentStatus(id: string, currentStatus: boolean) {
  const supabase = await createClient()
  await supabase.from('departments').update({ is_active: !currentStatus }).eq('id', id)
  revalidatePath('/admin/departments')
}

// ==============================
// DOCTORS
// ==============================
export async function createDoctor(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get("name") as string
  const specialty = formData.get("specialty") as string
  const experience_years = parseInt(formData.get("experience_years") as string) || 0

  if (!name) throw new Error("Name is required")

  const { error } = await supabase.from('doctors').insert([{ name, specialty, experience_years }])
  
  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/doctors')
  redirect('/admin/doctors')
}

export async function toggleDoctorStatus(id: string, currentStatus: boolean) {
  const supabase = await createClient()
  await supabase.from('doctors').update({ is_active: !currentStatus }).eq('id', id)
  revalidatePath('/admin/doctors')
}
