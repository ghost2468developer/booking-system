"use server"

import { prisma } from "@/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createServiceAction(formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== "admin") return { error: "Not authorized" }

  const name = formData.get("name") as string
  const description = (formData.get("description") as string) || null
  const price = formData.get("price") as string
  const durationMinutes = parseInt(formData.get("durationMinutes") as string)
  const category = formData.get("category") as string

  if (!name || !price || !durationMinutes || !category) {
    return { error: "Name, price, duration, and category are required" }
  }

  await prisma.service.create({
    data: {
      name,
      description,
      price: parseFloat(price),
      durationMinutes,
      category
    }
  })

  revalidatePath("/admin/services")
  return { success: true }
}

export async function updateServiceAction(formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== "admin") return { error: "Not authorized" }

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const description = (formData.get("description") as string) || null
  const price = formData.get("price") as string
  const durationMinutes = parseInt(formData.get("durationMinutes") as string)
  const category = formData.get("category") as string
  const isActive = formData.get("isActive") === "true"

  if (!id || !name || !price || !durationMinutes || !category) {
    return { error: "Name, price, duration, and category are required" }
  }

  await prisma.service.update({
    where: { id },
    data: { name, description, price: parseFloat(price), durationMinutes, category, isActive }
  })

  revalidatePath("/admin/services")
  return { success: true }
}

export async function deleteServiceAction(serviceId: string) {
  const session = await getSession()
  if (!session || session.role !== "admin") return { error: "Not authorized" }

  await prisma.service.delete({ where: { id: serviceId } })

  revalidatePath("/admin/services")
  return { success: true }
}

export async function toggleServiceAction(serviceId: string, isActive: boolean) {
  const session = await getSession()
  if (!session || session.role !== "admin") return { error: "Not authorized" }

  await prisma.service.update({
    where: { id: serviceId },
    data: { isActive }
  })

  revalidatePath("/admin/services")
  return { success: true }
}