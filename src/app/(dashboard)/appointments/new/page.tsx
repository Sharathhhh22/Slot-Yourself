import { BookingWizard } from "@/components/booking/BookingWizard"

export default function NewAppointmentPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-12 pb-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          Book an Appointment
        </h1>
        <p className="mt-4 text-lg text-slate-500">
          Our AI assistant will guide you to the right specialist.
        </p>
      </div>

      <BookingWizard />
    </div>
  )
}
