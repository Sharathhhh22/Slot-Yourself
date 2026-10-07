import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="h-full min-h-[60vh] w-full flex flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 text-primary-600 animate-spin mb-4" />
      <p className="text-slate-500 font-medium animate-pulse">Loading...</p>
    </div>
  )
}
