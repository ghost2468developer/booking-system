"use server";

import { prisma } from "@/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// ── User action: create a booking (always starts as "pending") ──
export async function createBookingAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };

  const vehicleId = formData.get("vehicleId") as string;
  const scheduledDate = formData.get("scheduledDate") as string;
  const notes = formData.get("notes") as string;
  const serviceIds = formData.getAll("serviceIds") as string[];

  if (!vehicleId || !scheduledDate || serviceIds.length === 0) {
    return { error: "Vehicle, date, and at least one service are required" };
  }

  const selectedServices = await prisma.service.findMany({
    where: { id: { in: serviceIds } },
  });

  const totalPrice = selectedServices
    .reduce((sum, s) => sum + Number(s.price), 0)
    .toFixed(2);

  const booking = await prisma.booking.create({
    data: {
      userId: session.userId,
      vehicleId,
      scheduledDate: new Date(scheduledDate),
      notes: notes || null,
      totalPrice: parseFloat(totalPrice),
      status: "pending",
      bookingServices: {
        create: selectedServices.map((s) => ({
          serviceId: s.id,
          priceAtBooking: Number(s.price),
        })),
      },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/admin");
  return { success: true, bookingId: booking.id };
}

// ── User action: cancel own booking (only if still pending) ──
export async function cancelBookingAction(bookingId: string) {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) return { error: "Booking not found" };
  if (booking.userId !== session.userId) {
    return { error: "Not authorized" };
  }
  if (booking.status !== "pending") {
    return { error: "Only pending bookings can be cancelled" };
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "cancelled", updatedAt: new Date() },
  });

  revalidatePath("/dashboard");
  revalidatePath("/admin");
  return { success: true };
}

// ── Admin action: approve a pending booking ──
export async function approveBookingAction(bookingId: string, adminNotes?: string) {
  const session = await getSession();
  if (!session || session.role !== "admin") return { error: "Not authorized" };

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "approved",
      adminNotes: adminNotes || null,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/admin");
  return { success: true };
}

// ── Admin action: reject a pending booking ──
export async function rejectBookingAction(bookingId: string, adminNotes?: string) {
  const session = await getSession();
  if (!session || session.role !== "admin") return { error: "Not authorized" };

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "rejected",
      adminNotes: adminNotes || null,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/admin");
  return { success: true };
}

// ── Admin action: move approved → in_progress → completed ──
export async function updateBookingStatusAction(
  bookingId: string,
  status: "in_progress" | "completed"
) {
  const session = await getSession();
  if (!session || session.role !== "admin") return { error: "Not authorized" };

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status, updatedAt: new Date() },
  });

  revalidatePath("/dashboard");
  revalidatePath("/admin");
  return { success: true };
}

// ── Admin action: delete a booking ──
export async function deleteBookingAction(bookingId: string) {
  const session = await getSession();
  if (!session || session.role !== "admin") return { error: "Not authorized" };

  await prisma.booking.delete({ where: { id: bookingId } });

  revalidatePath("/admin");
  return { success: true };
}
