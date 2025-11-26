# RestroMenu - Digital Menu Management System

A comprehensive Digital Menu Management System for restaurants built with the T3 Stack. Restaurant owners can efficiently manage their menus and enable customers to view them digitally through QR codes or shared links.

## 🚀 Live Demo

**Vercel Deployment Link:** https://restaurant-menu-manager-59zhj3lnu-poorva-guptas-projects.vercel.app/


## ✨ Features

### User Management
- Email-based registration and login
- Email verification code system
- User profile with full name and country

### Restaurant Management
- Create and manage multiple restaurants
- Each restaurant includes name and location
- Full CRUD operations for restaurants

### Menu Management
- Create categories (e.g., Starters, Main Course, Desserts)
- Add dishes under categories
- Dishes can belong to multiple categories simultaneously
- Each dish includes:
  - Name
  - Image (optional)
  - Description
  - Spice level (0-5, optional)

### Customer Access
- View restaurant menus via QR code scanning
- Access menus through shared links
- Beautiful, responsive menu interface
- Fixed category header while scrolling
- Floating menu button for quick category navigation

## 🛠 Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix UI)
- **API:** tRPC
- **ORM:** Prisma
- **Database:** PostgreSQL (hosted on Neon.com)
- **Deployment:** Vercel
- **Email:** Nodemailer (for verification codes)

## 🏃 Getting Started

### Prerequisites

- **Node.js 18+** (Check with `node --version`)
- **PostgreSQL database** (Neon.com recommended for free hosting)
- **npm or yarn** package manager

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/poorvagupta352-svg/restaurant-menu-manager.git
cd RestroMenu
```

#### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, Prisma, tRPC, and UI components.

#### 3. Set Up Environment Variables

Create a `.env` file in the root directory of the project:

```env
# Database Connection (Required)
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# Application URL (Required)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Session Secret (Required - Change in production!)
SESSION_SECRET="your-secret-key-change-in-production"

# Email Configuration (Optional - for email verification codes)
# If not configured, verification codes will be logged to console in development
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@restromenu.com
```

**Getting a PostgreSQL Database:**

1. Sign up for a free account at [Neon.com](https://neon.tech)
2. Create a new project
3. Copy the connection string from the dashboard
4. Paste it as `DATABASE_URL` in your `.env` file

#### 4. Set Up the Database

Generate Prisma Client and push the schema to your database:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push
```

**Note:** If you need to view/edit your database, you can use Prisma Studio:
```bash
npx prisma studio
```

#### 5. Run the Development Server

```bash
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000)

#### 6. Access the Application

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. Register a new account with your email, full name, and country
3. Check your email (or console logs if SMTP is not configured) for the verification code
4. Enter the verification code to complete registration
5. Start creating restaurants and managing menus!
