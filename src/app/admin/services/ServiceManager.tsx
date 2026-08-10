"use client"

import { useState } from "react"
import {
  createServiceAction,
  updateServiceAction,
  deleteServiceAction,
  toggleServiceAction
} from "@/lib/actions/services"
interface Service {
  id: string
  name: string
  description: string | null
  price: string
  durationMinutes: number
  category: string
  isActive: boolean
  createdAt: string
}
import { Plus, Edit2, Trash2, X, Loader2, Wrench, ToggleLeft, ToggleRight } from "lucide-react"

export default function ServiceManager({ services }: { services: Service[] }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const categories = [...new Set(services.map((s) => s.category))]

  const handleCreate = async (formData: FormData) => {
    setLoading(true)
    await createServiceAction(formData)
    setShowForm(false)
    setLoading(false)
  }

  const handleUpdate = async (formData: FormData) => {
    setLoading(true)
    await updateServiceAction(formData)
    setEditingId(null)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    setLoading(true)
    await deleteServiceAction(id)
    setDeletingId(null)
    setLoading(false)
  }

  const handleToggle = async (id: string, currentActive: boolean) => {
    await toggleServiceAction(id, !currentActive)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Services</h1>
          <p className="text-slate-500 mt-1">Manage your repair and maintenance services</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Service</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Add New Service</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form action={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input name="name" placeholder="Service Name" required className="px-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 focus:ring-2 focus:ring-blue-500" />
            <input name="price" placeholder="Price (e.g., 49.99)" required type="number" step="0.01" min="0" className="px-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 focus:ring-2 focus:ring-blue-500" />
            <input name="durationMinutes" placeholder="Duration (minutes)" required type="number" min="1" className="px-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 focus:ring-2 focus:ring-blue-500" />
            <input name="category" placeholder="Category" required className="px-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 focus:ring-2 focus:ring-blue-500" />
            <textarea name="description" placeholder="Description (optional)" rows={1} className="px-3 py-2.5 border border-slate-300 rounded-lg text-sm resize-none bg-white text-slate-900 focus:ring-2 focus:ring-blue-500" />
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add Service
            </button>
          </form>
        </div>
      )}

      {services.length === 0 && !showForm ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <Wrench className="w-16 h-16 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No services yet</p>
          <p className="text-sm text-slate-400 mb-4">Add your first service to get started</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                {category}
              </h2>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {services
                    .filter((s) => s.category === category)
                    .map((service) => (
                      <div
                        key={service.id}
                        className={`p-5 hover:bg-slate-50 transition-colors ${
                          !service.isActive ? "opacity-60" : ""
                        }`}
                      >
                        {editingId === service.id ? (
                          <form action={handleUpdate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <input type="hidden" name="id" value={service.id} />
                            <input type="hidden" name="isActive" value={String(service.isActive)} />
                            <input name="name" defaultValue={service.name} required className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-900" />
                            <input name="price" defaultValue={service.price} required type="number" step="0.01" className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-900" />
                            <input name="durationMinutes" defaultValue={service.durationMinutes} required type="number" className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-900" />
                            <input name="category" defaultValue={service.category} required className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-900" />
                            <textarea name="description" defaultValue={service.description || ""} className="px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none sm:col-span-2 bg-white text-slate-900" />
                            <div className="flex gap-2 sm:col-span-2">
                              <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                                Save
                              </button>
                              <button type="button" onClick={() => setEditingId(null)} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200">
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-slate-800">{service.name}</h3>
                                {!service.isActive && (
                                  <span className="text-xs bg-slate-200 text-slate-500 px-2 py-0.5 rounded">
                                    Inactive
                                  </span>
                                )}
                              </div>
                              {service.description && (
                                <p className="text-sm text-slate-500 mt-0.5 truncate">
                                  {service.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right hidden sm:block">
                                <p className="font-semibold text-slate-800">
                                  R{parseFloat(service.price).toFixed(2)}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {service.durationMinutes} min
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleToggle(service.id, service.isActive)}
                                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                                  title={service.isActive ? "Deactivate" : "Activate"}
                                >
                                  {service.isActive ? (
                                    <ToggleRight className="w-5 h-5 text-green-600" />
                                  ) : (
                                    <ToggleLeft className="w-5 h-5" />
                                  )}
                                </button>
                                <button
                                  onClick={() => setEditingId(service.id)}
                                  className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                {deletingId === service.id ? (
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => handleDelete(service.id)}
                                      className="px-2 py-1 bg-red-600 text-white rounded text-xs font-medium"
                                    >
                                      Delete
                                    </button>
                                    <button
                                      onClick={() => setDeletingId(null)}
                                      className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-xs font-medium"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setDeletingId(service.id)}
                                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}