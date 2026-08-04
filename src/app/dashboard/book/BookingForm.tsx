"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBookingAction } from "@/lib/actions/bookings";
interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string | null;
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: string;
  durationMinutes: number;
  category: string;
}
import { CalendarCheck, Check, Loader2 } from "lucide-react";

export default function BookingForm({
  vehicles,
  services,
}: {
  vehicles: Vehicle[]
  services: Service[]
}) {
  const router = useRouter()
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const totalPrice = services
    .filter((s) => selectedServices.includes(s.id))
    .reduce((sum, s) => sum + parseFloat(s.price), 0)

  const totalDuration = services
    .filter((s) => selectedServices.includes(s.id))
    .reduce((sum, s) => sum + s.durationMinutes, 0)

  const categories = [...new Set(services.map((s) => s.category))]

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError(null)

    selectedServices.forEach((id) => {
      formData.append("serviceIds", id)
    })

    const result = await createBookingAction(formData)
    if (result && "error" in result) {
      setError(result.error ?? "An error occurred")
      setLoading(false)
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/bookings")
      }, 1500)
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">Booking Confirmed!</h3>
        <p className="text-slate-500">Redirecting to your bookings...</p>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Vehicle Selection */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-semibold text-slate-800 mb-4">1. Select Vehicle</h3>
        <select
          name="vehicleId"
          required
          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
        >
          <option value="">Choose a vehicle...</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.year} {v.make} {v.model}
              {v.licensePlate ? ` (${v.licensePlate})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Service Selection */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-semibold text-slate-800 mb-4">2. Choose Services</h3>
        {categories.map((category) => (
          <div key={category} className="mb-6 last:mb-0">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              {category}
            </h4>
            <div className="space-y-2">
              {services
                .filter((s) => s.category === category)
                .map((service) => {
                  const isSelected = selectedServices.includes(service.id);
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => toggleService(service.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected
                            ? "bg-blue-600 border-blue-600"
                            : "border-slate-300"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 text-sm">{service.name}</p>
                        {service.description && (
                          <p className="text-xs text-slate-500 mt-0.5 truncate">
                            {service.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-slate-800 text-sm">
                          R{parseFloat(service.price).toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-400">{service.durationMinutes} min</p>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Date & Time */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-semibold text-slate-800 mb-4">3. Pick Date & Time</h3>
        <input
          name="scheduledDate"
          type="datetime-local"
          required
          min={new Date().toISOString().slice(0, 16)}
          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
        />
      </div>

      {/* Notes */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-semibold text-slate-800 mb-4">4. Additional Notes</h3>
        <textarea
          name="notes"
          rows={3}
          placeholder="Describe any symptoms or special requests..."
          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white text-slate-900"
        />
      </div>

      {/* Summary & Submit */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-slate-500">
              {selectedServices.length} service{selectedServices.length !== 1 ? "s" : ""} selected
            </p>
            {totalDuration > 0 && (
              <p className="text-xs text-slate-400">
                Est. duration: {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Total</p>
            <p className="text-2xl font-bold text-slate-800">R{totalPrice.toFixed(2)}</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || selectedServices.length === 0}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Booking...
            </>
          ) : (
            <>
              <CalendarCheck className="w-5 h-5" />
              Confirm Booking
            </>
          )}
        </button>
      </div>
    </form>
  )
}