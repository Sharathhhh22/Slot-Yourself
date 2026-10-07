"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Upload, Trash2, ExternalLink, Activity } from "lucide-react"

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState("")

  const supabase = createClient()

  useEffect(() => {
    fetchRecords()
  }, [])

  async function fetchRecords() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)

      const { data, error } = await supabase
        .from('patient_records')
        .select('*')
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRecords(data || [])
    } catch (err: any) {
      console.error(err)
      setError("Failed to load medical records.")
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !title || !user) return

    setUploading(true)
    setError("")

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Math.random()}.${fileExt}`

      // 1. Upload to Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('medical_records')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('medical_records')
        .getPublicUrl(fileName)

      // 3. Save to Database
      const { error: dbError } = await supabase
        .from('patient_records')
        .insert([
          {
            patient_id: user.id,
            title: title,
            file_url: publicUrl
          }
        ])

      if (dbError) throw dbError

      // Reset form and reload
      setTitle("")
      setFile(null)
      fetchRecords()

    } catch (err: any) {
      console.error(err)
      setError("Failed to upload file. Please make sure you created the 'medical_records' bucket in Supabase.")
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id: string, fileUrl: string) {
    if (!confirm("Are you sure you want to delete this record?")) return

    try {
      // 1. Delete from DB
      await supabase.from('patient_records').delete().eq('id', id)
      
      // We skip deleting from storage here for simplicity, but in production you'd extract the path and delete it.
      
      setRecords(records.filter(r => r.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Activity className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title text-slate-900">Medical Records</h1>
        <p className="text-slate-500 mt-2">Securely store and access your past prescriptions, lab reports, and scans.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Upload Record</CardTitle>
              <CardDescription>Add a new document to your secure vault.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Document Title</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="e.g. Blood Test Results - Jan 2024"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">File</Label>
                  <Input 
                    id="file" 
                    type="file" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)} 
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                  <p className="text-xs text-slate-500">PDF, JPG, or PNG up to 5MB</p>
                </div>
                <Button type="submit" disabled={uploading || !file || !title} className="w-full bg-primary-600">
                  {uploading ? (
                    <>Uploading...</>
                  ) : (
                    <><Upload className="w-4 h-4 mr-2" /> Upload Record</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Records List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Files</CardTitle>
            </CardHeader>
            <CardContent>
              {records.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-900">No records found</h3>
                  <p className="text-slate-500 text-sm mt-1">Upload your first document using the form.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {records.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg text-primary-700">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{record.title}</h4>
                          <p className="text-xs text-slate-500">
                            Uploaded on {new Date(record.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a 
                          href={record.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View File"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                        <button 
                          onClick={() => handleDelete(record.id, record.file_url)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete File"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
