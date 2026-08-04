import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcryptjs from "bcryptjs";

async function seed() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  console.log("🌱 Seeding database...\n");

  // ─── 1. Always ensure default accounts exist ───────────────────────
  const adminHash = await bcryptjs.hash("admin123", 10);
  const userHash = await bcryptjs.hash("user123", 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@autofix.com" },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: "admin@autofix.com",
        passwordHash: adminHash,
        name: "Mike Johnson",
        phone: "(555) 100-0001",
        role: "admin",
      },
    });
    console.log("✅ Admin created  →  admin@autofix.com / admin123");
  } else {
    console.log("⏭️  Admin already exists  →  admin@autofix.com");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: "user@example.com" },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        email: "user@example.com",
        passwordHash: userHash,
        name: "Demo User",
        phone: "(555) 200-0005",
        role: "user",
      },
    });
    console.log("✅ User created   →  user@example.com / user123");
  } else {
    console.log("⏭️  User already exists   →  user@example.com");
  }

  // ─── 2. Only seed demo data if the database is empty ───────────────
  const bookingCount = await prisma.booking.count();
  const serviceCount = await prisma.service.count();

  if (serviceCount > 0 || bookingCount > 0) {
    console.log("\n⏭️  Database already has data — skipping demo seed.");
    console.log("   Run `npm run db:reset` to wipe everything and re-seed.\n");
    await prisma.$disconnect();
    return;
  }

  console.log("\n📦 Empty database — loading demo data...\n");

  // Create extra demo users
  const demoUsers = [
    { email: "sarah@example.com", name: "Sarah Williams", phone: "(555) 200-0001" },
    { email: "james@example.com", name: "James Rodriguez", phone: "(555) 200-0002" },
    { email: "emily@example.com", name: "Emily Chen", phone: "(555) 200-0003" },
    { email: "david@example.com", name: "David Kim", phone: "(555) 200-0004" },
  ];

  const createdUsers = [];
  for (const u of demoUsers) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (!existing) {
      const created = await prisma.user.create({
        data: { ...u, passwordHash: userHash, role: "user" },
      });
      createdUsers.push(created);
    } else {
      createdUsers.push(existing);
    }
  }

  // Add demo user to the list too
  const demoUser = await prisma.user.findUnique({ where: { email: "user@example.com" } });
  if (demoUser) createdUsers.push(demoUser);

  console.log("✅ Demo users ready");

  // Create services
  const serviceData = [
    { name: "Oil Change", description: "Full synthetic oil change with filter replacement", price: 49.99, durationMinutes: 30, category: "Maintenance" },
    { name: "Brake Pad Replacement", description: "Front or rear brake pad replacement with inspection", price: 189.99, durationMinutes: 90, category: "Brakes" },
    { name: "Tire Rotation", description: "Rotate all four tires and check pressure", price: 29.99, durationMinutes: 30, category: "Tires" },
    { name: "Engine Diagnostic", description: "Full computer diagnostic scan with report", price: 89.99, durationMinutes: 60, category: "Diagnostics" },
    { name: "AC Recharge", description: "Recharge AC system with refrigerant and leak check", price: 129.99, durationMinutes: 45, category: "Climate" },
    { name: "Battery Replacement", description: "Replace car battery with load test", price: 149.99, durationMinutes: 30, category: "Electrical" },
    { name: "Transmission Fluid Change", description: "Drain and refill transmission fluid", price: 179.99, durationMinutes: 60, category: "Maintenance" },
    { name: "Wheel Alignment", description: "Four-wheel alignment with printout", price: 99.99, durationMinutes: 60, category: "Tires" },
    { name: "Full Detail Wash", description: "Interior and exterior detail with wax", price: 199.99, durationMinutes: 180, category: "Detailing" },
    { name: "Spark Plug Replacement", description: "Replace all spark plugs and inspect ignition system", price: 119.99, durationMinutes: 60, category: "Engine" },
    { name: "Coolant Flush", description: "Drain and refill engine coolant system", price: 79.99, durationMinutes: 45, category: "Maintenance" },
    { name: "Headlight Restoration", description: "Polish and restore cloudy headlight lenses", price: 59.99, durationMinutes: 30, category: "Detailing" },
  ];

  const createdServices: Array<{ id: string; price: unknown }> = [];
  for (const s of serviceData) {
    const created = await prisma.service.create({ data: s });
    createdServices.push(created);
  }

  console.log("✅ 12 services created");

  // Create vehicles
  const vehicleData = [
    { userId: createdUsers[0].id, make: "Toyota", model: "Camry", year: 2022, color: "Silver", licensePlate: "ABC-1234" },
    { userId: createdUsers[0].id, make: "Honda", model: "CR-V", year: 2021, color: "White", licensePlate: "DEF-5678" },
    { userId: createdUsers[1].id, make: "Ford", model: "F-150", year: 2023, color: "Blue", licensePlate: "GHI-9012" },
    { userId: createdUsers[1].id, make: "Chevrolet", model: "Malibu", year: 2020, color: "Black", licensePlate: "JKL-3456" },
    { userId: createdUsers[2].id, make: "BMW", model: "3 Series", year: 2022, color: "Gray", licensePlate: "MNO-7890" },
    { userId: createdUsers[3].id, make: "Tesla", model: "Model 3", year: 2023, color: "Red", licensePlate: "PQR-1234" },
    { userId: createdUsers[4].id, make: "Nissan", model: "Altima", year: 2021, color: "Green", licensePlate: "STU-5678" },
    { userId: createdUsers[4].id, make: "Hyundai", model: "Sonata", year: 2022, color: "White", licensePlate: "VWX-9012" },
  ];

  const createdVehicles = [];
  for (const v of vehicleData) {
    const created = await prisma.vehicle.create({ data: v });
    createdVehicles.push(created);
  }

  console.log("✅ 8 vehicles created");

  // Create bookings
  const now = new Date();
  type Status = "pending" | "approved" | "rejected" | "in_progress" | "completed" | "cancelled";
  const bookingData: Array<{
    userId: string;
    vehicleId: string;
    status: Status;
    scheduledDate: Date;
    notes: string;
    adminNotes?: string;
    serviceIndices: number[];
  }> = [
    { userId: createdUsers[0].id, vehicleId: createdVehicles[0].id, status: "pending", scheduledDate: new Date(now.getTime() + 2 * 86400000), notes: "Oil change and tire rotation before road trip", serviceIndices: [0, 2] },
    { userId: createdUsers[1].id, vehicleId: createdVehicles[3].id, status: "pending", scheduledDate: new Date(now.getTime() + 5 * 86400000), notes: "AC not cooling properly", serviceIndices: [4] },
    { userId: createdUsers[3].id, vehicleId: createdVehicles[5].id, status: "pending", scheduledDate: new Date(now.getTime() + 3 * 86400000), notes: "Tire rotation before road trip", serviceIndices: [2, 7] },
    { userId: createdUsers[1].id, vehicleId: createdVehicles[2].id, status: "approved", scheduledDate: new Date(now.getTime() + 1 * 86400000), notes: "Annual checkup", adminNotes: "Confirmed — see you tomorrow!", serviceIndices: [0, 6, 10] },
    { userId: createdUsers[4].id, vehicleId: createdVehicles[7].id, status: "approved", scheduledDate: new Date(now.getTime() + 4 * 86400000), notes: "Battery keeps dying", adminNotes: "We have the battery in stock, you're good.", serviceIndices: [3, 5] },
    { userId: createdUsers[0].id, vehicleId: createdVehicles[1].id, status: "in_progress", scheduledDate: new Date(now.getTime() - 1 * 86400000), notes: "Brake squeaking noise", adminNotes: "Started work, should be done by end of day.", serviceIndices: [1, 3] },
    { userId: createdUsers[2].id, vehicleId: createdVehicles[4].id, status: "completed", scheduledDate: new Date(now.getTime() - 14 * 86400000), notes: "Full detail for weekend event", serviceIndices: [8] },
    { userId: createdUsers[0].id, vehicleId: createdVehicles[0].id, status: "completed", scheduledDate: new Date(now.getTime() - 30 * 86400000), notes: "Regular maintenance", serviceIndices: [0, 2] },
    { userId: createdUsers[2].id, vehicleId: createdVehicles[4].id, status: "rejected", scheduledDate: new Date(now.getTime() + 1 * 86400000), notes: "Engine light is on", adminNotes: "Sorry, we're fully booked that day. Please try next week.", serviceIndices: [3, 9] },
    { userId: createdUsers[4].id, vehicleId: createdVehicles[6].id, status: "cancelled", scheduledDate: new Date(now.getTime() - 3 * 86400000), notes: "Had to reschedule", serviceIndices: [0] },
  ];

  for (const b of bookingData) {
    const selectedServices = b.serviceIndices.map((i) => createdServices[i]);
    const totalPrice = selectedServices.reduce((sum, s) => sum + Number(s.price), 0);

    await prisma.booking.create({
      data: {
        userId: b.userId,
        vehicleId: b.vehicleId,
        status: b.status,
        scheduledDate: b.scheduledDate,
        notes: b.notes,
        adminNotes: b.adminNotes || null,
        totalPrice,
        bookingServices: {
          create: selectedServices.map((s) => ({
            serviceId: s.id,
            priceAtBooking: Number(s.price),
          })),
        },
      },
    });
  }

  console.log("✅ 10 bookings created");

  console.log("\n🎉 Seed complete!");
  console.log("\n📋 Login credentials:");
  console.log("  Admin:  admin@autofix.com  /  admin123");
  console.log("  User:   user@example.com   /  user123\n");

  await prisma.$disconnect();
}

seed().catch(console.error);
