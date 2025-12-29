# Getting Started with CFIP Development

**Quick start guide to begin building your Carbon Footprint Intelligence Platform**

---

## 🎯 What You Have Now

You have a **complete, production-ready plan** for building CFIP with Next.js. Here's what's ready:

### 📚 Documentation Created

1. **[README.md](./README.md)** - Project overview and introduction
2. **[NEXTJS_ARCHITECTURE.md](./docs/NEXTJS_ARCHITECTURE.md)** - Complete technical architecture
3. **[MVP_CHECKLIST.md](./docs/MVP_CHECKLIST.md)** - Week-by-week implementation guide
4. **[SYSTEM_FLOW.md](./docs/SYSTEM_FLOW.md)** - Visual diagrams and user flows
5. **[EMISSION_FACTORS.md](./docs/EMISSION_FACTORS.md)** - Calculation formulas and data

### 🎨 Architecture Highlights

- **Next.js 14+ Full-Stack** (instead of microservices)
- **PostgreSQL + Prisma** for type-safe database
- **TensorFlow.js** for AI predictions (no separate Python service needed)
- **Complete Prisma schema** ready to copy and use
- **20-week implementation roadmap** with detailed tasks
- **All calculation formulas** and emission factors documented

---

## 🚀 Your Next Steps (Start Here!)

### Step 1: Set Up Your Development Environment (30 minutes)

#### Install Required Software

1. **Node.js** (v18 or higher)
   ```bash
   # Check if installed
   node --version

   # If not installed, download from:
   # https://nodejs.org/
   ```

2. **pnpm** (faster than npm)
   ```bash
   npm install -g pnpm

   # Verify installation
   pnpm --version
   ```

3. **PostgreSQL** (v15 or higher)
   ```bash
   # macOS
   brew install postgresql@15
   brew services start postgresql@15

   # Windows: Download from
   # https://www.postgresql.org/download/windows/

   # Linux
   sudo apt install postgresql-15
   ```

4. **VS Code** (recommended)
   - Download from https://code.visualstudio.com/
   - Install extensions:
     - ESLint
     - Prettier
     - Prisma
     - Tailwind CSS IntelliSense
     - TypeScript and JavaScript Language Features

### Step 2: Initialize Your Project (15 minutes)

```bash
# 1. Navigate to your project directory
cd /Users/winston/Documents/GitHub/Carbon-Footprint-in-Supply-Chains

# 2. Create Next.js application
npx create-next-app@latest cfip --typescript --tailwind --app --eslint

# This will ask you some questions. Answer:
# ✔ Would you like to use TypeScript? … Yes
# ✔ Would you like to use ESLint? … Yes
# ✔ Would you like to use Tailwind CSS? … Yes
# ✔ Would you like to use `src/` directory? … No
# ✔ Would you like to use App Router? … Yes
# ✔ Would you like to customize the default import alias? … No

# 3. Navigate into the project
cd cfip

# 4. Install additional dependencies
pnpm add @prisma/client @next-auth/prisma-adapter next-auth
pnpm add zod react-hook-form @hookform/resolvers
pnpm add recharts @tremor/react
pnpm add @tensorflow/tfjs-node
pnpm add bcrypt
pnpm add -D prisma @types/bcrypt @types/node

# 5. Initialize Prisma
npx prisma init
```

### Step 3: Set Up Database (10 minutes)

```bash
# 1. Create PostgreSQL database
createdb cfip_dev

# 2. Open prisma/schema.prisma and replace contents with the schema from
#    docs/NEXTJS_ARCHITECTURE.md (starting at line 146)

# 3. Create .env.local file in project root
cat > .env.local << EOF
# Database
DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/cfip_dev"

# NextAuth
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"
EOF

# 4. Run initial migration
npx prisma migrate dev --name init

# 5. Open Prisma Studio to verify
npx prisma studio
# This opens http://localhost:5555
```

### Step 4: Start Development (5 minutes)

```bash
# Start the development server
pnpm dev

# Open your browser to:
# http://localhost:3000

# You should see the default Next.js welcome page
```

🎉 **Congratulations!** Your development environment is ready.

---

## 📋 Week 1 Tasks (Your First Week)

Now follow the [MVP_CHECKLIST.md](./docs/MVP_CHECKLIST.md) starting with Week 1:

### Day 1-2: Project Setup ✅ (You just completed this!)
- [x] Install Node.js, pnpm, PostgreSQL
- [x] Create Next.js project
- [x] Initialize Git repository
- [x] Set up basic project structure

### Day 3-4: Configure Dependencies

```bash
# Install shadcn/ui (beautiful UI components)
npx shadcn-ui@latest init

# Answer the prompts:
# ✔ Would you like to use TypeScript? … yes
# ✔ Which style would you like to use? › Default
# ✔ Which color would you like to use as base color? › Slate
# ✔ Where is your global CSS file? › app/globals.css
# ✔ Would you like to use CSS variables for colors? › yes
# ✔ Where is your tailwind.config.js located? › tailwind.config.ts
# ✔ Configure the import alias for components: › @/components
# ✔ Configure the import alias for utils: › @/lib/utils

# Install first components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add form
npx shadcn-ui@latest add card
npx shadcn-ui@latest add label
```

Now create your `.env.example` file:

```bash
cat > .env.example << EOF
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/cfip_dev"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Redis for caching
REDIS_URL="redis://localhost:6379"
EOF
```

### Day 5-6: Database Setup

1. **Copy Prisma Schema**
   - Open [docs/NEXTJS_ARCHITECTURE.md](./docs/NEXTJS_ARCHITECTURE.md)
   - Find the complete Prisma schema (lines 146-580)
   - Copy and replace contents of `prisma/schema.prisma`

2. **Create Migration**
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Create Seed File**
   - Create `prisma/seed.ts`
   - Copy emission factor seed data from [docs/EMISSION_FACTORS.md](./docs/EMISSION_FACTORS.md)
   - Run: `npx prisma db seed`

4. **Test with Prisma Studio**
   ```bash
   npx prisma studio
   ```
   - Verify all tables exist
   - Check emission factors are seeded

### Day 7: Create Project Structure

Create the folder structure:

```bash
# In your cfip directory
mkdir -p app/\(auth\)/login
mkdir -p app/\(auth\)/register
mkdir -p app/\(dashboard\)/{calculate,predict,goals,reports,history,settings}
mkdir -p components/{ui,dashboard,calculator,charts,forms,layout}
mkdir -p lib/{calculations,ml,optimization,blockchain,reports,auth,validations,utils,db/queries}
mkdir -p types
mkdir -p tests/{unit,integration,e2e}
mkdir -p public/data
```

Create initial files:

```typescript
// lib/db/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

```typescript
// types/index.ts
export type TransportMode = 'TRUCK' | 'RAIL' | 'SHIP' | 'AIR' | 'MULTIMODAL';
export type FuelType = 'DIESEL' | 'ELECTRIC' | 'HYBRID' | 'JET_FUEL' | 'HEAVY_FUEL_OIL' | 'LNG' | 'BIODIESEL';
export type EmissionScope = 'SCOPE_1' | 'SCOPE_2' | 'SCOPE_3';
export type WeatherCondition = 'NORMAL' | 'LIGHT_ADVERSE' | 'HEAVY_ADVERSE' | 'SNOW_ICE' | 'EXTREME';

export interface CalculationParams {
  distance: number;
  weight: number;
  transportMode: TransportMode;
  fuelType: FuelType;
  weatherCondition?: WeatherCondition;
  capacityUtilization?: number;
  departureTime?: Date;
}

export interface EmissionResult {
  co2: number;
  ch4: number;
  n2o: number;
  totalCO2e: number;
  scope: EmissionScope;
  breakdown: {
    base: number;
    weatherAdjustment: number;
    loadAdjustment: number;
    trafficAdjustment: number;
  };
}
```

Update your `README.md` in the `cfip` folder:

```bash
# Copy the main README
cp ../README.md ./README.md
```

---

## 📖 What to Read Next

### Priority 1: Essential Reading (Read These First!)

1. **[MVP_CHECKLIST.md](./docs/MVP_CHECKLIST.md)** (60 mins)
   - Your week-by-week development guide
   - Follow this religiously for the next 20 weeks
   - Check off tasks as you complete them

2. **[NEXTJS_ARCHITECTURE.md](./docs/NEXTJS_ARCHITECTURE.md)** (45 mins)
   - Complete technical architecture
   - Database schema details
   - API design
   - Feature modules breakdown

3. **[EMISSION_FACTORS.md](./docs/EMISSION_FACTORS.md)** (30 mins)
   - How to calculate emissions
   - All emission factors for different modes
   - Example calculations with code

### Priority 2: Helpful References

4. **[SYSTEM_FLOW.md](./docs/SYSTEM_FLOW.md)** (20 mins)
   - Visual diagrams of how everything works
   - User journey maps
   - Data flow diagrams

5. **Original Research Docs** (when needed)
   - [MUKUKA'S FINAL YEAR PROPOSAL.docx](./docs/MUKUKA'S%20FINAL%20YEAR%20PROPOSAL.docx)
   - [CFIP_Software_Design_Proposal.docx](./docs/CFIP_Software_Design_Proposal.docx)
   - [CFIP_Technical_Specifications.docx](./docs/CFIP_Technical_Specifications.docx)

---

## 🎓 Learning Resources

### Next.js
- [Official Next.js Tutorial](https://nextjs.org/learn) (4 hours) - **Start here!**
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router Guide](https://nextjs.org/docs/app)

### Prisma
- [Prisma Quickstart](https://www.prisma.io/docs/getting-started/quickstart) (20 mins)
- [Prisma Schema Guide](https://www.prisma.io/docs/concepts/components/prisma-schema)

### TypeScript
- [TypeScript in 5 Minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### Tailwind CSS
- [Tailwind CSS Installation](https://tailwindcss.com/docs/installation)
- [Tailwind CSS Utility Classes](https://tailwindcss.com/docs/utility-first)

### shadcn/ui
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [All Components](https://ui.shadcn.com/docs/components)

---

## 💡 Development Tips

### Daily Workflow

```bash
# Morning - Start your day
pnpm dev                    # Start dev server
npx prisma studio          # Open database GUI (optional)

# During development
git status                 # Check what changed
git add .                  # Stage changes
git commit -m "feat: add calculator form"  # Commit
git push                   # Push to GitHub

# Database changes
npx prisma migrate dev --name description  # Create migration
npx prisma generate        # Regenerate Prisma client
npx prisma studio          # Verify changes

# End of day
pnpm build                 # Test if build works
pnpm test                  # Run tests (when you have them)
```

### Git Commit Convention

Use conventional commits:

```bash
feat: add calculator form
fix: correct emission factor calculation
docs: update README with setup instructions
style: format code with prettier
refactor: extract calculation logic
test: add unit tests for calculator
chore: update dependencies
```

### Useful Commands

```bash
# Quick reference
pnpm dev                   # Start development server
pnpm build                 # Build for production
pnpm start                 # Start production server
pnpm lint                  # Run ESLint
pnpm format                # Format with Prettier (after setup)

# Prisma commands
npx prisma studio          # Open database GUI
npx prisma migrate dev     # Create and apply migration
npx prisma migrate reset   # Reset database (careful!)
npx prisma generate        # Regenerate Prisma client
npx prisma db seed         # Run seed file

# shadcn/ui commands
npx shadcn-ui@latest add [component]  # Add a component
npx shadcn-ui@latest diff             # Check for updates
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue: "Can't connect to database"**
```bash
# Solution 1: Check if PostgreSQL is running
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Solution 2: Verify DATABASE_URL in .env.local
# Make sure username, password, and database name are correct

# Solution 3: Test connection
psql -U your_username -d cfip_dev
```

**Issue: "Module not found"**
```bash
# Solution: Reinstall dependencies
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

**Issue: "Prisma Client not found"**
```bash
# Solution: Regenerate Prisma client
npx prisma generate
```

**Issue: "Port 3000 already in use"**
```bash
# Solution: Kill the process or use different port
lsof -ti:3000 | xargs kill -9  # macOS/Linux
PORT=3001 pnpm dev             # Use different port
```

---

## 📊 Track Your Progress

### Week 1 Checklist

- [ ] Development environment set up
- [ ] Next.js project initialized
- [ ] Database created and migrated
- [ ] Prisma Studio working
- [ ] shadcn/ui installed
- [ ] Project structure created
- [ ] Git repository initialized
- [ ] First commit pushed

**When you complete Week 1:**
✅ Mark it complete in [MVP_CHECKLIST.md](./docs/MVP_CHECKLIST.md)
✅ Demo to your supervisor
✅ Move on to Week 2!

---

## 🤝 Getting Help

### When You Get Stuck

1. **Check Documentation**
   - Search your CFIP docs
   - Check Next.js docs
   - Check Prisma docs

2. **Search Online**
   - Google the error message
   - Search Stack Overflow
   - Check GitHub Issues

3. **Ask for Help**
   - Next.js Discord: https://discord.gg/nextjs
   - Prisma Discord: https://discord.gg/prisma
   - Stack Overflow
   - Your supervisor

### Best Practices

- ✅ **Commit often** - Small, focused commits
- ✅ **Test as you go** - Don't wait until the end
- ✅ **Read error messages** - They usually tell you what's wrong
- ✅ **Use TypeScript** - Let it catch errors before runtime
- ✅ **Follow the checklist** - Stay on track
- ✅ **Ask questions early** - Don't struggle alone
- ✅ **Document as you code** - Future you will thank you

### Anti-Patterns to Avoid

- ❌ Don't skip Week 1 setup - it's foundational
- ❌ Don't add features not in the plan - avoid scope creep
- ❌ Don't commit broken code - always test first
- ❌ Don't ignore TypeScript errors - fix them
- ❌ Don't skip migrations - always run them
- ❌ Don't hardcode values - use environment variables

---

## 🎯 Your 20-Week Journey

Here's what you'll build:

### Weeks 1-4: Foundation
- Authentication system
- Basic carbon calculator
- Simple dashboard

### Weeks 5-9: Core Features
- Enhanced calculator (all modes)
- Data visualizations (charts)
- Goal tracking system
- Reporting module

### Weeks 10-14: AI Features
- ML prediction model
- Optimization engine
- What-if scenarios
- Audit trail

### Weeks 15-18: Polish
- User testing
- Bug fixes
- Performance optimization
- Security audit

### Weeks 19-20: Launch
- Production deployment
- User training
- Documentation
- Celebration! 🎉

---

## 🚀 Ready to Start?

### Your Action Plan (Right Now!)

1. **Read this entire document** ✅ (you just did!)

2. **Set up your environment** (30 minutes)
   - Install Node.js, pnpm, PostgreSQL, VS Code
   - Follow Step 1 above

3. **Initialize your project** (15 minutes)
   - Create Next.js app
   - Install dependencies
   - Follow Step 2 above

4. **Set up database** (10 minutes)
   - Create database
   - Copy Prisma schema
   - Run migrations
   - Follow Step 3 above

5. **Start coding!** (5 minutes)
   - Run `pnpm dev`
   - See Next.js welcome page
   - Celebrate! 🎉

6. **Open [MVP_CHECKLIST.md](./docs/MVP_CHECKLIST.md)**
   - Start Week 1, Day 3-4
   - Follow the checklist religiously

---

## 📞 Support

**Project Author:** Mukuka Zulu
**Supervisor:** Mr. Billy Munyenyembe
**Institution:** Information and Communications University (ICU)

**Questions?** Review the documentation or reach out to your supervisor.

---

## 🌟 Final Words

You're about to build something amazing!

This isn't just a university project - it's a platform that could help companies reduce their carbon emissions and combat climate change. Take pride in your work, follow the plan, and you'll succeed.

**The journey of a thousand miles begins with a single step.**

Your first step? Run this command:

```bash
npx create-next-app@latest cfip --typescript --tailwind --app --eslint
```

**Let's build the future of sustainable supply chain management! 🌍💚**

---

*Last Updated: December 28, 2025*
