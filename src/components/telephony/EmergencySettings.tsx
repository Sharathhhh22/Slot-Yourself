"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { PhoneCall, PhoneMissed, PhoneOff, Clock } from "lucide-react"
import { format } from "date-fns"

interface EmergencySettingsProps {
  doctorId: string
  initialEnabled: boolean
}

export function EmergencySettings({ doctorId, initialEnabled }: EmergencySettingsProps) {
  const [enabled, setEnabled] = useState(initialEnabled)
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function fetchLogs() {
      const { data } = await supabase
        .from('emergency_calls')
        .select('*')
        .eq('doctor_id', doctorId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (data) setLogs(data)
    }

    fetchLogs()
  }, [doctorId, supabase])

  const handleToggle = async (checked: boolean) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('doctors')
        .update({ emergency_calls_enabled: checked })
        .eq('id', doctorId)

      if (error) throw error
      setEnabled(checked)
    } catch (err) {
      console.error(err)
      alert("Failed to update emergency settings")
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (seconds: number) => {
    if (!seconds) return "0s"
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return m > 0 ? `${m}m ${s}s` : `${s}s`
  }

  return (
    <div className="space-y-6">
      <Card className="border-red-100">
        <CardHeader className="bg-red-50/50 pb-4 border-b border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-red-900 flex items-center gap-2">
                <PhoneCall className="w-5 h-5" />
                Emergency Proxy Calls
              </CardTitle>
              <CardDescription className="text-red-700/80 mt-1">
                Allow patients to initiate masked emergency proxy calls to your registered phone number.
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="emergency-calls" 
                checked={enabled} 
                onCheckedChange={handleToggle}
                disabled={loading}
              />
              <Label htmlFor="emergency-calls">{enabled ? "Enabled" : "Disabled"}</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            Recent Emergency Calls
          </h4>
          
          {logs.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No emergency calls logged.</p>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg border border-slate-100 bg-slate-50 text-sm">
                  <div className="space-y-1">
                    <p className="font-medium text-slate-900">
                      {format(new Date(log.created_at), "MMM d, yyyy h:mm a")}
                    </p>
                    <p className="text-slate-600">Reason: {log.reason}</p>
                  </div>
                  <div className="mt-2 sm:mt-0 flex flex-col items-end">
                    <div className="flex items-center gap-1.5 font-medium">
                      {log.status === 'completed' || log.status === 'connected' ? (
                        <span className="text-green-600 flex items-center gap-1"><PhoneCall className="w-3 h-3"/> {log.status}</span>
                      ) : log.status === 'no_answer' ? (
                        <span className="text-amber-600 flex items-center gap-1"><PhoneMissed className="w-3 h-3"/> no answer</span>
                      ) : (
                        <span className="text-slate-500 flex items-center gap-1"><PhoneOff className="w-3 h-3"/> {log.status}</span>
                      )}
                    </div>
                    {log.duration_seconds > 0 && (
                      <span className="text-xs text-slate-400 mt-0.5">Duration: {formatDuration(log.duration_seconds)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
