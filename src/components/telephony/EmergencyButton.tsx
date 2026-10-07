"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PhoneCall } from "lucide-react"
import { EmergencyCallModal } from "@/components/telephony/EmergencyCallModal"

interface EmergencyButtonProps {
  doctorId: string
  doctorName: string
  appointmentId?: string
}

export default function EmergencyButton({ doctorId, doctorName, appointmentId }: EmergencyButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
      >
        <PhoneCall className="w-4 h-4 mr-1" />
        Emergency
      </Button>

      {isOpen && (
        <EmergencyCallModal 
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          doctorId={doctorId}
          doctorName={doctorName}
          appointmentId={appointmentId}
        />
      )}
    </>
  )
}
