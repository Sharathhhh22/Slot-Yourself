"use client"

import { useState, useRef } from "react"
import { createClient } from "@/utils/supabase/client"
import { Camera, Loader2, User as UserIcon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function AvatarUpload({ userId, initialUrl }: { userId: string, initialUrl?: string }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialUrl || null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const router = useRouter()

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${userId}/avatar.${fileExt}`

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId)

      if (updateError) {
        throw updateError
      }

      setAvatarUrl(publicUrl)
      router.refresh()
    } catch (error: any) {
      alert(error.message || 'Error uploading avatar')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="relative group">
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white bg-slate-100 shadow-md flex items-center justify-center relative">
        {avatarUrl ? (
          <Image 
            src={avatarUrl} 
            alt="Avatar" 
            fill 
            className="object-cover"
          />
        ) : (
          <UserIcon className="w-12 h-12 text-slate-300" />
        )}
        
        <div 
          onClick={() => !uploading && fileInputRef.current?.click()}
          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Camera className="w-6 h-6 text-white" />
          )}
        </div>
      </div>
      
      <input
        type="file"
        id="single"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
        ref={fileInputRef}
        className="hidden"
      />
    </div>
  )
}
