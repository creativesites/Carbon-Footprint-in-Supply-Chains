# CFIP - Claude Development Notes

## Project Setup Information

### Database Configuration

**Provider:** Neon PostgreSQL (Serverless)
**Connection String:**
```
postgresql://neondb_owner:npg_qc1vsExIfU7a@ep-weathered-cherry-a-2dney1lh-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Why Neon?**
- Serverless PostgreSQL with autoscaling
- Built-in connection pooling
- Generous free tier (perfect for development)
- Automatic backups
- No server management needed

### Environment Variables

All sensitive configuration is stored in `.env` (not committed to git):
- `DATABASE_URL` - Neon PostgreSQL connection string
- `NEXTAUTH_SECRET` - Authentication secret key
- `NEXTAUTH_URL` - Application URL (http://localhost:3000 for dev)

### Project Status

**Phase:** Initial Setup
**Current Week:** Week 1 - Foundation
**Next Steps:** Initialize Next.js project

---

## Development Commands

### Quick Start

```bash
# 1. Initialize Next.js project
npx create-next-app@latest cfip --typescript --tailwind --app --eslint
cd cfip

# 2. Copy environment file
cp ../.env .env.local

# 3. Install dependencies
pnpm add @prisma/client @next-auth/prisma-adapter next-auth
pnpm add zod react-hook-form @hookform/resolvers
pnpm add recharts @tremor/react
pnpm add @tensorflow/tfjs-node
pnpm add bcrypt
pnpm add -D prisma @types/bcrypt @types/node

# 4. Initialize Prisma
npx prisma init

# 5. Copy Prisma schema from docs/NEXTJS_ARCHITECTURE.md
# Replace contents of prisma/schema.prisma

# 6. Run initial migration
npx prisma migrate dev --name init

# 7. Seed database
npx prisma db seed

# 8. Start development server
pnpm dev
```

### Daily Workflow

```bash
# Start development
pnpm dev                    # http://localhost:3000
npx prisma studio          # http://localhost:5555 (database GUI)

# Database operations
npx prisma migrate dev --name description  # Create migration
npx prisma generate        # Regenerate Prisma client
npx prisma db push         # Push schema without migration (dev only)
npx prisma db seed         # Seed database

# Code quality
pnpm lint                  # Run ESLint
pnpm build                 # Test production build

# Git operations
git status
git add .
git commit -m "feat: description"
git push
```

---

## Architecture Decisions

### Why Next.js over Microservices?

**Original Plan:** Microservices architecture with separate services
**Adapted Plan:** Next.js full-stack monolith

**Reasons:**
1. **Simpler Development** - One codebase, one deployment
2. **Faster Iteration** - No service coordination overhead
3. **Better for MVP** - Get to market faster
4. **Type Safety** - End-to-end TypeScript with tRPC
5. **Lower Infrastructure Costs** - Single deployment
6. **Easier to Debug** - All code in one place
7. **Perfect for Team Size** - Ideal for solo/small team

**We can always split into microservices later if needed.**

### Tech Stack Choices

| Choice | Alternative Considered | Why We Chose This |
|--------|----------------------|-------------------|
| **Next.js 14+** | Express + React | Full-stack, better DX, SSR built-in |
| **Prisma** | TypeORM, Sequelize | Best TypeScript ORM, great DX |
| **PostgreSQL (Neon)** | MongoDB, MySQL | Relational data fits our needs, Neon is serverless |
| **TensorFlow.js** | Python + Flask | Keep everything in one codebase |
| **tRPC** | REST, GraphQL | Type-safe, no code generation needed |
| **NextAuth.js** | Auth0, Clerk | Open source, flexible, free |
| **shadcn/ui** | Material-UI, Chakra | Modern, accessible, copy-paste components |
| **Tailwind CSS** | CSS Modules, Styled Components | Fast, utility-first, great DX |

### Database Design Philosophy

**Approach:** Normalized relational schema

**Key Decisions:**
- **Users ↔ Companies:** Many-to-one (users belong to companies)
- **Shipments ↔ Calculations:** One-to-one (each shipment has one calculation)
- **Shipments ↔ Predictions:** One-to-one (optional prediction per shipment)
- **Goals ↔ Milestones:** One-to-many (goals have multiple milestones)
- **Audit Logs:** Blockchain-style linked list (each log references previous hash)

---

## Implementation Strategy

### Development Approach

**Methodology:** Agile with weekly sprints

**Principles:**
1. **MVP First** - Core features before nice-to-haves
2. **Test as You Go** - Don't wait until the end
3. **Commit Often** - Small, focused commits
4. **Document Everything** - Code comments + external docs
5. **User Feedback Early** - Test with real users by Week 15

### Feature Priorities

**Must Have (MVP):**
- ✅ User authentication
- ✅ Carbon calculator (all modes)
- ✅ Dashboard with charts
- ✅ Goal tracking
- ✅ Basic reporting (PDF, Excel)

**Should Have (Phase 2):**
- ✅ AI predictions
- ✅ Optimization suggestions
- ✅ What-if scenarios
- ✅ Audit trail

**Nice to Have (Post-MVP):**
- Real blockchain integration
- Mobile app
- API marketplace
- Real-time collaboration
- Integration with ERPs

### Code Organization

```
cfip/
├── app/                    # Next.js App Router (pages & API)
├── components/             # React components
├── lib/                    # Business logic (reusable)
├── prisma/                 # Database schema & migrations
├── types/                  # TypeScript type definitions
├── tests/                  # Test files
└── public/                 # Static assets
```

**Key Principles:**
- **Separation of Concerns** - Business logic in `lib/`, UI in `components/`
- **Reusability** - Extract common logic into utilities
- **Type Safety** - TypeScript everywhere
- **Testability** - Write testable functions

---

## Common Issues & Solutions

### Database Connection

**Issue:** "Can't connect to Neon database"

```bash
# Solution 1: Check connection string
echo $DATABASE_URL

# Solution 2: Test connection
npx prisma db pull

# Solution 3: Check Neon dashboard
# Visit: https://console.neon.tech/
```

### Prisma Issues

**Issue:** "Prisma Client not found"

```bash
# Solution: Regenerate client
npx prisma generate
```

**Issue:** "Migration conflicts"

```bash
# Solution: Reset database (CAUTION: deletes all data!)
npx prisma migrate reset
```

### Next.js Issues

**Issue:** "Module not found"

```bash
# Solution: Clear cache and reinstall
rm -rf node_modules .next
pnpm install
```

**Issue:** "Port 3000 in use"

```bash
# Solution 1: Kill process
lsof -ti:3000 | xargs kill -9

# Solution 2: Use different port
PORT=3001 pnpm dev
```

---

## Performance Considerations

### Database Optimization

**Indexes to Add:**
```sql
-- Already in schema:
CREATE INDEX ON shipments(userId);
CREATE INDEX ON calculations(shipmentId);
CREATE INDEX ON audit_logs(currentHash);
CREATE INDEX ON audit_logs(timestamp);
```

**Query Optimization:**
- Use `select` to fetch only needed fields
- Use pagination for large datasets
- Implement caching for frequently accessed data

### Frontend Optimization

**React Best Practices:**
- Use Server Components by default (Next.js 14+)
- Client Components only when needed (interactivity)
- Implement loading states
- Use `next/image` for images
- Code splitting with dynamic imports

### API Optimization

**Strategies:**
- Implement response caching (Redis or Next.js cache)
- Use database connection pooling (Neon handles this)
- Batch similar requests
- Implement rate limiting

---

## Security Checklist

### Before Deployment

- [ ] Change `NEXTAUTH_SECRET` to strong random value
- [ ] Enable CORS with whitelist
- [ ] Implement rate limiting on API routes
- [ ] Validate all user inputs (Zod schemas)
- [ ] Sanitize user-generated content
- [ ] Use parameterized queries (Prisma handles this)
- [ ] Enable HTTPS only in production
- [ ] Set secure cookie flags
- [ ] Implement CSRF protection
- [ ] Add security headers (helmet.js)
- [ ] Audit dependencies for vulnerabilities
- [ ] Implement logging and monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Regular database backups (Neon handles this)
- [ ] Implement proper error handling (no stack traces to users)

---

## Testing Strategy

### Test Pyramid

```
      /\
     /  \   E2E Tests (10%)
    /____\  Integration Tests (30%)
   /______\ Unit Tests (60%)
```

**Unit Tests:**
- Calculation functions
- Validation schemas
- Utility functions
- Business logic

**Integration Tests:**
- API endpoints
- Database queries
- Authentication flow

**E2E Tests:**
- Critical user flows
- Calculator workflow
- Goal creation
- Report generation

### Testing Tools

- **Vitest** - Unit & integration tests
- **Playwright** - E2E tests
- **Testing Library** - React component tests

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] No console.log statements
- [ ] Environment variables configured
- [ ] Database migrated
- [ ] Build succeeds locally
- [ ] Security audit passed

### Deployment Steps

1. Build application: `pnpm build`
2. Test production build: `pnpm start`
3. Deploy to ICU servers
4. Run migrations: `npx prisma migrate deploy`
5. Verify deployment
6. Monitor for errors

### Post-Deployment

- [ ] Verify all features work
- [ ] Check error logs
- [ ] Monitor performance
- [ ] Set up uptime monitoring
- [ ] Schedule regular backups
- [ ] Document deployment process

---

## Useful Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Neon Docs](https://neon.tech/docs)
- [tRPC Docs](https://trpc.io/docs)
- [shadcn/ui](https://ui.shadcn.com/)

### Learning
- [Next.js Learn](https://nextjs.org/learn)
- [Prisma Quickstart](https://www.prisma.io/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook)

### Community
- [Next.js Discord](https://discord.gg/nextjs)
- [Prisma Discord](https://discord.gg/prisma)
- [Stack Overflow](https://stackoverflow.com/)

---

## Project Timeline

### Completed
- [x] Project planning
- [x] Architecture design
- [x] Documentation
- [x] Database configuration (Neon)

### Current Week: Week 1
- [ ] Initialize Next.js project
- [ ] Set up Prisma
- [ ] Create project structure
- [ ] Basic authentication

### Next Milestones
- **Week 4:** Basic calculator working
- **Week 9:** Core features complete
- **Week 14:** AI features complete
- **Week 18:** Testing complete
- **Week 20:** Production deployment

---

## Notes for Claude

### Context
This is a final year university project for Mukuka Zulu at ICU (Information and Communications University). The project is a Carbon Footprint Intelligence Platform (CFIP) that uses AI to predict and optimize supply chain emissions.

### Key Features to Remember
1. **Predictive Analytics** - Forecast emissions before they occur
2. **Real-time Optimization** - AI suggests ways to reduce emissions
3. **Goal Tracking** - Monitor progress toward sustainability targets
4. **Comprehensive Reporting** - CDP-compliant reports

### Development Priorities
1. Get MVP working first
2. Focus on core features (calculator, dashboard, goals)
3. Add AI features after core is stable
4. Test with real users early and often

### When Assisting
- Follow the MVP checklist in docs/MVP_CHECKLIST.md
- Reference architecture in docs/NEXTJS_ARCHITECTURE.md
- Use emission factors from docs/EMISSION_FACTORS.md
- Stick to the planned tech stack
- Encourage best practices (TypeScript, tests, commits)

---

**Last Updated:** December 28, 2025
**Current Status:** Ready to initialize Next.js project
**Next Action:** Run project initialization commands
