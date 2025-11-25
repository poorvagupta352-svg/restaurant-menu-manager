# RestroMenu - Digital Menu Management System

A comprehensive Digital Menu Management System for restaurants built with the T3 Stack. Restaurant owners can efficiently manage their menus and enable customers to view them digitally through QR codes or shared links.

## 🚀 Live Demo

**Vercel Deployment Link:** [Add your Vercel deployment link here after deployment]

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

- Node.js 18+ 
- PostgreSQL database (Neon.com recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/poorvagupta352-svg/restaurant-menu-manager.git
cd RestroMenu
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SESSION_SECRET="your-secret-key-change-in-production"

# Optional: Email configuration (for production)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@restromenu.com
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

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
