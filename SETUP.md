# Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   SESSION_SECRET="your-secret-key-change-in-production"
   
   # Optional: For email verification (production)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=noreply@restromenu.com
   ```

3. **Set Up Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup (Neon.com)

1. Go to [neon.com](https://neon.com)
2. Create a new project
3. Copy the connection string
4. Add it to your `.env` file as `DATABASE_URL`

## Email Setup (Optional for Development)

In development mode, if SMTP is not configured, verification codes will be logged to the console.

For production:
1. Use Gmail App Password or another SMTP service
2. Configure SMTP variables in `.env`
3. For Gmail: Enable 2FA and create an App Password

## Deployment to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

The project will automatically:
- Run `prisma generate` on build
- Run `prisma db push` (you may need to run migrations manually)

## Troubleshooting

### TypeScript Errors
If you see TypeScript errors about missing modules:
- Run `npm install` to ensure all dependencies are installed
- Restart your IDE/editor

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Check if your database allows connections from your IP
- For Neon.com, ensure SSL is enabled

### Email Not Sending
- Check SMTP configuration
- In development, codes are logged to console if SMTP is not configured
- Check spam folder in production

