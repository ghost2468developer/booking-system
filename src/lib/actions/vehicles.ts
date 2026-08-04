"use server"

import { prisma } from "@/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createVehicleAction(formData: FormData) {
  const session = await getSession()
  if (!session) return { error: "Not authenticated" }

  const make = formData.get("make") as string
  const model = formData.get("model") as string
  const year = parseInt(formData.get("year") as string)
  const color = (formData.get("color") as string) || null
  const licensePlate = (formData.get("licensePlate") as string) || null

  if (!make || !model || !year) {
    return { error: "Make, model, and year are required" }
  }

  await prisma.vehicle.create({
    data: {
      userId: session.userId,
      make,
      model,
      year,
      color,
      licensePlate
    }
  })

  revalidatePath("/dashboard/vehicles")
  return { success: true }
}

export async function updateVehicleAction(formData: FormData) {
  const session = await getSession()
  if (!session) return { error: "Not authenticated" }

  const id = formData.get("id") as string
  const make = formData.get("make") as string
  const model = formData.get("model") as string
  const year = parseInt(formData.get("year") as string)
  const color = (formData.get("color") as string) || null
  const licensePlate = (formData.get("licensePlate") as string) || null

  if (!id || !make || !model || !year) {
    return { error: "Make, model, and year are required" }
  }

  await prisma.vehicle.updateMany({
    where: { id, userId: session.userId },
    data: { make, model, year, color, licensePlate }
  })

  revalidatePath("/dashboard/vehicles")
  return { success: true }
}

export async function deleteVehicleAction(vehicleId: string) {
  const session = await getSession()
  if (!session) return { error: "Not authenticated" }

  await prisma.vehicle.deleteMany({
    where: { id: vehicleId, userId: session.userId }
  })

  revalidatePath("/dashboard/vehicles")
  return { success: true }
}