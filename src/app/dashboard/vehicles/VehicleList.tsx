"use client";

import { useState } from "react";
import {
  createVehicleAction,
  updateVehicleAction,
  deleteVehicleAction,
} from "@/lib/actions/vehicles";
interface Vehicle {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  color: string | null;
  licensePlate: string | null;
  vin: string | null;
  createdAt: string;
}
import { Car, Plus, Edit2, Trash2, X, Loader2 } from "lucide-react";

export default function VehicleList({ vehicles }: { vehicles: Vehicle[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async (formData: FormData) => {
    setLoading(true);
    await createVehicleAction(formData);
    setShowForm(false);
    setLoading(false);
  };

  const handleUpdate = async (formData: FormData) => {
    setLoading(true);
    await updateVehicleAction(formData);
    setEditingId(null);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    await deleteVehicleAction(id);
    setDeletingId(null);
    setLoading(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Vehicles</h1>
          <p className="text-slate-500 mt-1">Manage your registered vehicles</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Vehicle</span>
        </button>
      </div>

      {/* Add Vehicle Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Add New Vehicle</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form action={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              name="make"
              placeholder="Make (e.g., Toyota)"
              required
              className="px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
            />
            <input
              name="model"
              placeholder="Model (e.g., Camry)"
              required
              className="px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
            />
            <input
              name="year"
              type="number"
              placeholder="Year"
              required
              min={1950}
              max={2030}
              className="px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
            />
            <input
              name="color"
              placeholder="Color (optional)"
              className="px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
            />
            <input
              name="licensePlate"
              placeholder="License Plate (optional)"
              className="px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add Vehicle
            </button>
          </form>
        </div>
      )}

      {vehicles.length === 0 && !showForm ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <Car className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-1">No vehicles yet</h3>
            <p className="text-sm text-slate-500 mb-6 text-center max-w-sm">
              Add your first vehicle to start booking services.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Vehicle
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:border-slate-300 transition-colors group"
            >
              {editingId === v.id ? (
                <form action={handleUpdate} className="space-y-3">
                  <input type="hidden" name="id" value={v.id} />
                  <input
                    name="make"
                    defaultValue={v.make}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-900"
                  />
                  <input
                    name="model"
                    defaultValue={v.model}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-900"
                  />
                  <input
                    name="year"
                    type="number"
                    defaultValue={v.year}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-900"
                  />
                  <input
                    name="color"
                    defaultValue={v.color || ""}
                    placeholder="Color"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-900"
                  />
                  <input
                    name="licensePlate"
                    defaultValue={v.licensePlate || ""}
                    placeholder="License Plate"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-900"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Car className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingId(v.id)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {deletingId === v.id ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleDelete(v.id)}
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
                          onClick={() => setDeletingId(v.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-800 text-lg">
                    {v.year} {v.make} {v.model}
                  </h3>
                  <div className="mt-2 space-y-1">
                    {v.color && (
                      <p className="text-sm text-slate-500 flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full border border-slate-300"
                          style={{ backgroundColor: v.color.toLowerCase() }}
                        />
                        {v.color}
                      </p>
                    )}
                    {v.licensePlate && (
                      <p className="text-sm text-slate-500">
                        🪪 {v.licensePlate}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
