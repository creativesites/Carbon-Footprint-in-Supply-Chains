# Vercel Deployment Guide

## Prerequisites

1. **Neon Database Account** (or any PostgreSQL provider)
   - Sign up at https://neon.tech
   - Create a new project
   - Copy your connection string

2. **Google Gemini API Key**
   - Get from https://aistudio.google.com/app/apikey

3. **Vercel Account**
   - Sign up at https://vercel.com

## Step 1: Prepare Your Database

### Create Neon Database

1. Go to https://console.neon.tech
2. Create a new project
3. Copy the connection string (it looks like):
   ```
   postgresql://username:password@ep-xxxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

### Update Prisma Schema for PostgreSQL

The current `prisma/schema.prisma` uses SQLite. For production, update it:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure environment variables (see below)
4. Click "Deploy"

## Step 3: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | Your Neon connection string | Production, Preview, Development |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` | Production, Preview, Development |
| `NEXTAUTH_URL` | Your Vercel URL (e.g., https://your-app.vercel.app) | Production |
| `GEMINI_API_KEY` | Your Google Gemini API key | Production, Preview, Development |

### Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use this online tool: https://generate-secret.vercel.app/32

## Step 4: Run Database Migrations

After first deployment, run migrations:

```bash
# Using Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy
npx prisma db seed
```

Or set up in your build command in `vercel.json`:

```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build"
}
```

## Step 5: Verify Deployment

1. Visit your Vercel URL
2. Try logging in with:
   - Email: `demo@cfip.com`
   - Password: `demo123`

3. Create a calculation to test the app

## Troubleshooting

### Build Errors

**Error: "Route does not match required types"**
- Fixed: Moved constants to separate files

**Error: "DATABASE_URL not found"**
- Solution: Add DATABASE_URL to environment variables

**Error: "Prisma Client not generated"**
- Solution: Ensure `postinstall` script runs `prisma generate`

### Runtime Errors

**Error: "Can't reach database"**
- Check DATABASE_URL is correct
- Ensure Neon database is running
- Check SSL mode is set to `require`

**Error: "NEXTAUTH_SECRET not defined"**
- Add NEXTAUTH_SECRET to environment variables

### Database Issues

**Error: "Migration failed"**
```bash
# Reset and re-run migrations
npx prisma migrate reset
npx prisma migrate deploy
npx prisma db seed
```

**Error: "Table already exists"**
```bash
# Use db push instead
npx prisma db push --accept-data-loss
```

## Environment-Specific Settings

### Development (Local)
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
```

### Production (Vercel)
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-app.vercel.app"
```

## Post-Deployment Checklist

- [ ] Database migrations run successfully
- [ ] Database seeded with demo data
- [ ] Environment variables set correctly
- [ ] Can login with demo credentials
- [ ] Can create calculations
- [ ] Can generate reports
- [ ] Can generate AI analysis
- [ ] PDF exports work

## Useful Commands

```bash
# Pull environment variables from Vercel
vercel env pull .env.local

# Run migrations in production
npx prisma migrate deploy

# Seed production database
npx prisma db seed

# View production logs
vercel logs

# Open Prisma Studio for production DB
npx prisma studio
```

## Database Schema Update Workflow

When you update the schema:

```bash
# 1. Update prisma/schema.prisma
# 2. Create migration
npx prisma migrate dev --name describe_your_change

# 3. Deploy to production
git add .
git commit -m "Update database schema"
git push

# 4. Vercel will auto-deploy and run migrations
```

## Support

- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- Prisma Docs: https://www.prisma.io/docs
- Next.js Docs: https://nextjs.org/docs

## Security Notes

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Rotate secrets regularly** - Especially NEXTAUTH_SECRET
3. **Use strong passwords** - Change demo password in production
4. **Enable 2FA** on Vercel and database provider
5. **Monitor logs** for suspicious activity

## Performance Optimization

1. **Database Connection Pooling** - Neon handles this automatically
2. **Edge Functions** - Consider for API routes
3. **Image Optimization** - Use Next.js Image component
4. **Caching** - Implement for frequently accessed data

---

For more help, check the project's CLAUDE.md file or open an issue on GitHub.
