# RestroMenu - Digital Menu Management System

A comprehensive Digital Menu Management System for restaurants built with the T3 Stack. Restaurant owners can efficiently manage their menus and enable customers to view them digitally through QR codes or shared links.

## 🚀 Live Demo

**Vercel Deployment Link:** https://restaurant-menu-manager-59zhj3lnu-poorva-guptas-projects.vercel.app/

> **Note:** Make sure the deployment is not behind Vercel Authentication.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Approach](#approach)
- [Development Details](#development-details)
- [Edge Cases Handled](#edge-cases-handled)
- [Future Improvements](#future-improvements)

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

### Troubleshooting

**Database Connection Issues:**
- Ensure your `DATABASE_URL` is correct
- Check if your database allows connections from your IP (Neon.com allows all by default)
- Verify the database exists and is accessible

**Email Not Working:**
- In development, verification codes are logged to the console if SMTP is not configured
- Check your SMTP credentials if emails are not being sent
- Ensure `SMTP_PASS` is an app password, not your regular password (for Gmail)

**Port Already in Use:**
- Change the port: `npm run dev -- -p 3001`
- Or kill the process using port 3000

## 📁 Project Structure

```
RestroMenu/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── api/trpc/          # tRPC API route handler
│   │   ├── dashboard/         # Admin dashboard pages
│   │   ├── menu/              # Customer-facing menu pages
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   └── ui/                # shadcn/ui components
│   ├── lib/                   # Utility functions
│   ├── server/
│   │   ├── api/               # tRPC routers
│   │   ├── auth.ts            # Authentication logic
│   │   └── db.ts              # Prisma client
│   ├── styles/
│   │   └── globals.css        # Global styles
│   └── utils/
│       └── api.ts             # tRPC client setup
└── package.json
```

## 🎯 Approach

### Problem Decomposition

1. **Authentication System**
   - Implemented email-based authentication without NextAuth
   - Created custom session management using cookies
   - Email verification code system with expiration

2. **Database Design**
   - Designed schema to support multiple restaurants per user
   - Many-to-many relationship between dishes and categories
   - Proper indexing for performance

3. **API Architecture**
   - Used tRPC for type-safe APIs
   - Separated routers by domain (auth, restaurant, menu, public)
   - Implemented proper error handling and validation

4. **UI/UX Implementation**
   - Used shadcn/ui for consistent, accessible components
   - Implemented fixed header with current category
   - Created floating menu button for category navigation
   - Responsive design for mobile and desktop

5. **Customer-Facing Menu**
   - Public API endpoint for menu viewing
   - QR code generation using external API
   - Smooth scrolling and category highlighting

### Key Design Decisions

- **No NextAuth:** As per requirements, implemented custom authentication
- **Cookie-based Sessions:** Simple and effective for this use case
- **tRPC:** Provides end-to-end type safety
- **Prisma:** Excellent developer experience and type safety
- **shadcn/ui:** Modern, accessible components built on Radix UI

## 💻 Development Details

### IDE Used
- **Cursor** (VS Code-based editor)

### AI Tools and Models Used
- **Cursor AI (Composer)** - Primary AI assistant
- Used for:
  - Code generation and scaffolding
  - Component creation
  - API route implementation
  - Bug fixes and refactoring

### Prompts Used

1. "Create a T3 Stack project structure with TypeScript, Prisma, and tRPC"
2. "Implement email verification system with nodemailer"
3. "Create authentication system without NextAuth using cookies"
4. "Build restaurant CRUD operations with tRPC"
5. "Implement menu management with multi-category support"
6. "Create customer-facing menu page with fixed header and floating menu button"
7. "Add QR code generation for menu sharing"

### AI Tool Effectiveness

**How helpful was the AI tool:**
- Extremely helpful for scaffolding the project structure
- Great for generating boilerplate code (components, API routes)
- Useful for implementing complex features quickly
- Helped identify and fix type errors

**Mistakes identified and corrected:**
1. **Initial env.js implementation:** Used `@t3-oss/env-nextjs` which wasn't in dependencies - replaced with custom validation
2. **QR Code library:** Initially tried to use `next-qrcode` with require() - switched to external API service
3. **Refetch calls:** Some mutations were calling `restaurant?.refetch()` incorrectly - fixed to use proper refetch from query
4. **Missing imports:** Added useEffect and other React hooks where needed
5. **Type safety:** Fixed several TypeScript errors related to optional types

## 🛡 Edge Cases Handled

### Authentication
- ✅ Email validation before sending verification code
- ✅ Verification code expiration (10 minutes)
- ✅ Handling expired codes gracefully
- ✅ Preventing duplicate verification codes
- ✅ Session expiration handling
- ✅ Logout functionality clears sessions

### Restaurant Management
- ✅ Users can only access their own restaurants
- ✅ Validation of restaurant ownership before operations
- ✅ Handling deletion of restaurants with associated data
- ✅ Empty state when no restaurants exist

### Menu Management
- ✅ Validation that categories belong to restaurant
- ✅ Dishes must have at least one category
- ✅ Handling dishes in multiple categories
- ✅ Image URL validation (optional)
- ✅ Spice level validation (0-5)
- ✅ Empty state for categories without dishes

### Customer Menu View
- ✅ Handling non-existent restaurants gracefully
- ✅ Empty menu state
- ✅ Smooth scrolling to categories
- ✅ Active category highlighting based on scroll position
- ✅ Mobile-responsive design
- ✅ Handling missing images gracefully

### General
- ✅ Loading states for all async operations
- ✅ Error handling with user-friendly messages
- ✅ Form validation
- ✅ Type safety throughout the application

## 🔮 Future Improvements

### Edge Cases Not Handled (Due to Time Constraints)

1. **Image Upload**
   - Currently only supports image URLs
   - Would implement file upload with cloud storage (e.g., Cloudinary, AWS S3)
   - Add image compression and optimization

2. **Email Delivery**
   - Currently uses basic SMTP configuration
   - Would implement email service provider (SendGrid, Resend)
   - Add email templates and better error handling
   - Rate limiting for verification code requests

3. **Advanced Features**
   - Menu item pricing
   - Dietary information (vegetarian, vegan, gluten-free)
   - Allergen information
   - Menu item availability/stock management
   - Multiple languages support
   - Menu versioning/history

4. **Performance Optimizations**
   - Image lazy loading
   - Pagination for large menus
   - Caching strategies
   - Database query optimization

5. **Security Enhancements**
   - Rate limiting on API endpoints
   - CSRF protection
   - Input sanitization
   - SQL injection prevention (already handled by Prisma)

6. **User Experience**
   - Search functionality in menu
   - Filter by dietary preferences
   - Menu favorites/bookmarks
   - Print-friendly menu view
   - Dark mode support

7. **Analytics**
   - Menu view tracking
   - Popular dishes analytics
   - Customer engagement metrics

## 📝 License

This project was created as an assessment project.
