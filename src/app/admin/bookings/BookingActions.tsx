"use client"

import { useState } from "react"
import {
  approveBookingAction,
  rejectBookingAction,
  updateBookingStatusAction,
  deleteBookingAction
} from "@/lib/actions/bookings"
import { Loader2, Trash2, Check, X, Play, CheckCircle } from "lucide-react"

export default function BookingActions({
  bookingId,
  currentStatus
}: {
  bookingId: string
  currentStatus: string
}) {
  const [loading, setLoading] = useState<string | null>(null)
  const [showRejectNotes, setShowRejectNotes] = useState(false)
  const [adminNotes, setAdminNotes] = useState("")
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleApprove = async () => {
    setLoading("approve")
    await approveBookingAction(bookingId)
    setLoading(null)
  }

  const handleReject = async () => {
    setLoading("reject")
    await rejectBookingAction(bookingId, adminNotes)
    setLoading(null)
    setShowRejectNotes(false)
  }

  const handleStartWork = async () => {
    setLoading("in_progress")
    await updateBookingStatusAction(bookingId, "in_progress")
    setLoading(null)
  }

  const handleComplete = async () => {
    setLoading("completed")
    await updateBookingStatusAction(bookingId, "completed")
    setLoading(null)
  }

  const handleDelete = async () => {
    setLoading("delete")
    await deleteBookingAction(bookingId)
    setLoading(null)
  }

  // Pending → Admin decides: Approve or Reject
  if (currentStatus === "pending") {
    if (showRejectNotes) {
      return (
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <p className="text-sm font-medium text-slate-700">Reason for rejection (optional):</p>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="e.g., Fully booked that day, try next week..."
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none bg-white text-slate-900 focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          <div className="flex gap-2">
            <button
              onClick={handleReject}
              disabled={loading !== null}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {loading === "reject" ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
              Confirm Rejection
            </button>
            <button
              onClick={() => { setShowRejectNotes(false); setAdminNotes(""); }}
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200"
            >
              Back
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
        <button
          onClick={handleApprove}
          disabled={loading !== null}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 shadow-sm"
        >
          {loading === "approve" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          Approve
        </button>
        <button
          onClick={() => setShowRejectNotes(true)}
          disabled={loading !== null}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 disabled:opacity-50 border border-red-200"
        >
          <X className="w-4 h-4" />
          Reject
        </button>
      </div>
    )
  }

  // Approved → Admin can start work
  if (currentStatus === "approved") {
    return (
      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
        <button
          onClick={handleStartWork}
          disabled={loading !== null}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 shadow-sm"
        >
          {loading === "in_progress" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          Start Work
        </button>
      </div>
    )
  }

  // In Progress → Admin can mark complete
  if (currentStatus === "in_progress") {
    return (
      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
        <button
          onClick={handleComplete}
          disabled={loading !== null}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 shadow-sm"
        >
          {loading === "completed" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
          Mark Complete
        </button>
      </div>
    )
  }

  // Completed / Rejected / Cancelled → Admin can delete
  if (currentStatus === "completed" || currentStatus === "rejected" || currentStatus === "cancelled") {
    return (
      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Delete permanently?</span>
            <button
              onClick={handleDelete}
              disabled={loading !== null}
              className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium disabled:opacity-50"
            >
              {loading === "delete" ? <Loader2 className="w-3 h-3 animate-spin" /> : "Yes, delete"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-3 py-1.5 bg-slate-200 text-slate-600 rounded-lg text-xs font-medium"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </button>
        )}
      </div>
    )
  }
  return null
}