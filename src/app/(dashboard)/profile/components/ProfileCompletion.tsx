"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CheckCircle2, Circle } from "lucide-react"

export function ProfileCompletion({ percentage, missingFields }: { percentage: number, missingFields: string[] }) {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
        <CardTitle className="text-lg">Profile Completion</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-slate-900 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="font-bold text-slate-900">{percentage}%</span>
        </div>

        {missingFields.length > 0 ? (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">To Complete:</h4>
            <ul className="space-y-2">
              {missingFields.map((field, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <Circle className="w-4 h-4 mt-0.5 text-slate-300 shrink-0" />
                  {field}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex items-start gap-3 bg-green-50 text-green-800 p-4 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <p className="text-sm font-medium">Your profile is complete! This helps us provide you with the best experience.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
