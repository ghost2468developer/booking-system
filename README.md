# 🚗 AutoCare — Car Service Booking System

A full-stack car service booking platform built with **Next.js, React, TypeScript, PostgreSQL, and Prisma**.

The application allows customers to manage their vehicles, browse available automotive services, and create and track service bookings. Administrators can manage bookings and update their status throughout the service lifecycle.

## ✨ Features

### 👤 Authentication & User Management

* User registration and login
* Secure password hashing with `bcryptjs`
* Role-based access control
* User profiles
* Customer and administrator roles

### 🚘 Vehicle Management

Customers can:

* Add vehicles
* Store vehicle make, model, year, and color
* Store license plate and VIN information
* Manage multiple vehicles
* Associate vehicles with service bookings

### 🔧 Service Management

The system supports configurable automotive services including:

* Oil changes
* Brake services
* Tire services
* Vehicle maintenance
* Other custom automotive services

Each service contains:

* Service name
* Description
* Category
* Price
* Estimated duration
* Active/inactive status

### 📅 Booking System

Customers can:

* Select a vehicle
* Select one or more services
* Schedule a service
* Add booking notes
* View booking details
* Track booking status

Bookings support the following statuses:

* `Pending`
* `Approved`
* `Rejected`
* `In Progress`
* `Completed`
* `Cancelled`

### 🛠️ Admin Management

Administrators can manage the booking workflow and update booking statuses.

The system also supports administrator notes and stores the total booking price.

---

## 🏗️ Tech Stack

### Frontend

* **Next.js 16**
* **React 19**
* **TypeScript**
* **Tailwind CSS**
* **Lucide React**

### Backend

* **Next.js**
* **Node.js**
* **Prisma ORM**
* **PostgreSQL**

### Authentication & Security

* `bcryptjs` for password hashing
* `jose` for authentication/token functionality
* Role-based authorization

### Development Tools

* ESLint
* TypeScript
* Prisma Studio
* npm

The project uses Prisma 7.9.1 and PostgreSQL, with database generation handled automatically during installation/build.

---

## 🗄️ Database Architecture

The application uses PostgreSQL with Prisma ORM.

### Main Entities

```text
User
 │
 ├── Vehicle
 │     │
 │     └── Booking
 │            │
 │            └── BookingService
 │                    │
 │                    └── Service
 │
 └── Booking
```

### User

Stores customer and administrator accounts.

```text
User
├── id
├── name
├── email
├── passwordHash
├── phone
├── role
├── createdAt
└── updatedAt
```

### Vehicle

Stores customer vehicle information.

```text
Vehicle
├── id
├── userId
├── make
├── model
├── year
├── color
├── licensePlate
├── vin
└── createdAt
```

### Service

Stores available automotive services.

```text
Service
├── id
├── name
├── description
├── price
├── durationMinutes
├── category
├── isActive
└── createdAt
```

### Booking

Stores customer service appointments.

```text
Booking
├── id
├── userId
├── vehicleId
├── status
├── scheduledDate
├── notes
├── adminNotes
├── totalPrice
├── createdAt
└── updatedAt
```

### BookingService

Connects bookings with the services selected by the customer while preserving the service price at the time of booking.

This allows service prices to change later without changing historical booking records.

The database schema defines these relationships using Prisma and PostgreSQL.

---

## 📁 Project Structure

```text
booking-system/
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── register/
│   │   └── ...
│   │
│   ├── components/
│   │
│   ├── db/
│   │   └── seed.ts
│   │
│   └── generated/
│       └── prisma/
│
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── prisma.config.ts
├── tsconfig.json
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/ghost2468developer/booking-system.git
```

Navigate into the project:

```bash
cd booking-system
```

## 2. Install dependencies

```bash
npm install
```

The project's `postinstall` script automatically runs Prisma Client generation after installation.

## 3. Configure environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/postgres"
```

The repository includes a `.env.example` file with the expected PostgreSQL connection format.

> ⚠️ Never commit your `.env` file or database credentials to GitHub.

## 4. Set up the database

Make sure PostgreSQL is running, then run:

```bash
npm run db:push
```

This synchronizes the Prisma schema with your PostgreSQL database.

## 5. Seed the database

To populate the database with sample services:

```bash
npm run db:seed
```

You can also use:

```bash
npm run seed
```

## 6. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

# 🧪 Available Scripts

| Command             | Description                                      |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | Start the development server                     |
| `npm run build`     | Generate Prisma Client and build the application |
| `npm start`         | Start the production server                      |
| `npm run lint`      | Run ESLint                                       |
| `npm run typecheck` | Run TypeScript type checking                     |
| `npm run db:push`   | Push Prisma schema to the database               |
| `npm run db:seed`   | Seed the database                                |
| `npm run db:reset`  | Reset the database and reseed                    |
| `npm run studio`    | Open Prisma Studio                               |

These scripts are defined in the project's `package.json`.

---

# 🔐 User Roles

The application currently supports two roles:

### Customer

Customers can:

* Register and log in
* Manage their vehicles
* Browse services
* Create bookings
* View their bookings
* Track booking status

### Administrator

Administrators can:

* View bookings
* Manage booking statuses
* Add administrative notes
* Manage the booking workflow

The Prisma schema defines the available roles as `admin` and `user`.

---

# 📊 Booking Lifecycle

A booking can move through the following lifecycle:

```text
┌─────────┐
│ Pending │
└────┬────┘
     │
     ▼
┌──────────┐
│ Approved │
└────┬─────┘
     │
     ▼
┌─────────────┐
│ In Progress │
└──────┬──────┘
       │
       ▼
┌───────────┐
│ Completed │
└───────────┘
```

A booking can also be:

```text
Pending → Rejected
Pending → Cancelled
Approved → Cancelled
```

---

# 💡 Key Technical Highlights

This project demonstrates practical full-stack development concepts including:

* Full-stack application architecture
* Authentication and authorization
* Role-based access control
* Relational database design
* Prisma ORM
* PostgreSQL
* Database relationships
* Many-to-many relationships through join tables
* CRUD operations
* Booking state management
* Form handling
* Server-side functionality with Next.js
* Type-safe development with TypeScript
* Environment variable management
* Database seeding
* Responsive UI development

---

# 🔮 Future Improvements

Potential improvements for future versions include:

* [ ] Email notifications for booking updates
* [ ] SMS notifications
* [ ] Online payments
* [ ] Customer booking cancellation/rescheduling
* [ ] Admin analytics dashboard
* [ ] Mechanic-specific accounts
* [ ] Mechanic assignment to bookings
* [ ] Service availability management
* [ ] Calendar-based scheduling
* [ ] Booking conflict prevention
* [ ] Customer reviews and ratings
* [ ] Invoice generation
* [ ] Service history per vehicle
* [ ] Automated testing
* [ ] CI/CD pipeline
* [ ] Production deployment

---

# 🖥️ Screenshots

Add screenshots of the application here:

```text
docs/
├── dashboard.png
├── booking.png
├── vehicles.png
├── services.png
└── login.png
```

Example:

```md
![Dashboard](docs/dashboard.png)
```

Screenshots are highly recommended for portfolio projects because they allow recruiters to understand the application without running it locally.

---

# 🌐 Live Demo

**Live Demo:** Coming soon

**GitHub Repository:**
https://github.com/ghost2468developer/booking-system

---

# 👨‍💻 Author

**Kenneth Siyabonga Ncube**

Software Engineer / Tester

* GitHub: https://github.com/ghost2468developer

---