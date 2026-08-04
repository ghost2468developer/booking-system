"use client";

import { cancelBookingAction } from "@/lib/actions/bookings";
import { useState } from "react";
import { X, Loader2 } from "lucide-react";

export default function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    await cancelBookingAction(bookingId);
    setLoading(false);
    setConfirming(false);
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">Cancel this booking?</span>
        <button
          onClick={handleCancel}
          disabled={loading}
          className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
          Yes, cancel
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200"
        >
          No, keep it
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium"
    >
      <X className="w-4 h-4" />
      Cancel Booking
    </button>
  );
}
