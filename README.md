# Carbon Footprint Intelligence Platform (CFIP)

> **A smart, AI-powered system that predicts emissions before they occur**

🌍 **Sustainable Supply Chain Management** | 🤖 **AI-Powered Predictions** | 📊 **Real-time Analytics**

---

## Project Overview

The **Carbon Footprint Intelligence Platform (CFIP)** is an innovative web-based application designed to help organizations track, predict, and optimize carbon emissions across their supply chain operations. Unlike traditional carbon calculators that only measure emissions retrospectively, CFIP uses machine learning to **predict future emissions** and provides **AI-driven optimization suggestions** before shipments occur.

### Key Features

- ✅ **Carbon Calculator** - Calculate emissions for transportation, fuel consumption, and energy usage
- 🔮 **AI Predictions** - Forecast emissions 24-72 hours before they occur
- 🎯 **Goal Tracking** - Set and monitor progress toward sustainability targets
- 📈 **Real-time Dashboard** - Interactive visualizations and analytics
- 🚀 **Optimization Engine** - AI suggests routes, modes, and carriers to reduce emissions
- 📄 **Comprehensive Reports** - CDP-compliant reports, PDF exports, Excel analysis
- 🔐 **Audit Trail** - Blockchain-style immutable logging for verification
- 🤝 **Multi-stakeholder Portal** - Collaborate with suppliers, carriers, and customers

### What Makes CFIP Unique

| Traditional Carbon Trackers | CFIP |
|----------------------------|------|
| Calculate emissions **after** activities | **Predict** emissions **before** activities |
| Manual data entry | Automated data import from ERP/SCM systems |
| Static reports | Real-time AI-driven optimization suggestions |
| Generic calculations | Sector-specific emission models |
| Single user focus | Multi-stakeholder collaboration |

---

## Technology Stack

### Core Technologies

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **UI**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts + Tremor
- **AI/ML**: TensorFlow.js
- **Auth**: NextAuth.js
- **Forms**: React Hook Form + Zod validation
- **API**: tRPC for type-safe APIs

### Why Next.js?

We chose Next.js over the originally proposed microservices architecture because:

1. **Simpler Development** - Full-stack in one framework
2. **Better Performance** - React Server Components, automatic code splitting
3. **Easier Deployment** - Single application to deploy and maintain
4. **Type Safety** - End-to-end TypeScript with tRPC
5. **Perfect for MVP** - Faster to iterate and add features

---

## Project Structure

```
cfip/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication pages
│   ├── (dashboard)/         # Dashboard pages
│   │   ├── calculate/       # Carbon calculator
│   │   ├── predict/         # AI predictions
│   │   ├── goals/           # Sustainability goals
│   │   ├── reports/         # Reports & analytics
│   │   └── history/         # Calculation history
│   └── api/                 # API routes
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── dashboard/           # Dashboard-specific
│   ├── charts/              # Chart components
│   └── forms/               # Form components
├── lib/                     # Business logic
│   ├── calculations/        # Carbon calculation algorithms
│   ├── ml/                  # Machine learning models
│   ├── optimization/        # Optimization engine
│   ├── blockchain/          # Audit trail
│   └── db/                  # Database utilities
├── prisma/                  # Database schema & migrations
├── docs/                    # Documentation
│   ├── NEXTJS_ARCHITECTURE.md
│   ├── MVP_CHECKLIST.md
│   └── [original research docs]
└── tests/                   # Test files
```

---

## Getting Started

### Prerequisites

Before you begin, make sure you have:

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **pnpm** package manager (`npm install -g pnpm`)
- **PostgreSQL** v15 or higher ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))
- **VS Code** (recommended) with extensions:
  - ESLint
  - Prettier
  - Prisma
  - Tailwind CSS IntelliSense

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Carbon-Footprint-in-Supply-Chains
   ```

2. **Initialize Next.js project**

   ```bash
   npx create-next-app@latest cfip --typescript --tailwind --app --eslint
   cd cfip
   pnpm install
   ```

3. **Install dependencies**

   ```bash
   # Core dependencies
   pnpm add @prisma/client @next-auth/prisma-adapter next-auth
   pnpm add zod react-hook-form @hookform/resolvers
   pnpm add recharts @tremor/react
   pnpm add @tensorflow/tfjs-node

   # Development dependencies
   pnpm add -D prisma
   pnpm add -D @types/node @types/react
   ```

4. **Set up database**

   ```bash
   # Create PostgreSQL database
   createdb cfip_dev

   # Initialize Prisma
   npx prisma init

   # Copy schema from docs/NEXTJS_ARCHITECTURE.md to prisma/schema.prisma
   # Then run migrations
   npx prisma migrate dev --name init
   ```

5. **Configure environment variables**

   Create `.env.local` file:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/cfip_dev"

   # NextAuth
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"

   # Optional: Redis for caching
   REDIS_URL="redis://localhost:6379"
   ```

6. **Run development server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Quick Start Commands

```bash
# Start development server
pnpm dev

# Open Prisma Studio (database GUI)
npx prisma studio

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Build for production
pnpm build

# Start production server
pnpm start

# Run tests
pnpm test

# Lint code
pnpm lint
```

---

## Documentation

### For Developers

- 📐 **[Next.js Architecture Guide](./docs/NEXTJS_ARCHITECTURE.md)** - Complete technical architecture, database schema, API design, and implementation guide
- ✅ **[MVP Implementation Checklist](./docs/MVP_CHECKLIST.md)** - Week-by-week development roadmap with actionable tasks

### Research Documentation

- 📄 **[Final Year Proposal](./docs/MUKUKA'S%20FINAL%20YEAR%20PROPOSAL.docx)** - Original research proposal with literature review
- 📋 **[Software Design Proposal](./docs/CFIP_Software_Design_Proposal.docx)** - High-level system design and innovations
- 🛠️ **[Technical Specifications](./docs/CFIP_Technical_Specifications.docx)** - Detailed technical specs (microservices version)
- 🗓️ **[Implementation Roadmap](./docs/CFIP_Implementation_Roadmap.docx)** - Original 20-week implementation plan

---

## Development Roadmap

### Phase 1: Foundation (Weeks 1-4) ✅
- [x] Project setup and configuration
- [x] Database schema design
- [x] User authentication
- [x] Basic carbon calculator
- [x] Simple dashboard

### Phase 2: Core Features (Weeks 5-9) 🚧
- [ ] Enhanced calculator with all transport modes
- [ ] Advanced data visualizations
- [ ] Goal tracking system
- [ ] Reporting module

### Phase 3: AI & Optimization (Weeks 10-14) 📅
- [ ] ML infrastructure setup
- [ ] Emission prediction model
- [ ] Optimization engine
- [ ] What-if scenarios

### Phase 4: Polish & Testing (Weeks 15-18) 📅
- [ ] User testing
- [ ] Quality assurance
- [ ] Security audit
- [ ] Documentation

### Phase 5: Deployment (Weeks 19-20) 📅
- [ ] Production deployment
- [ ] User training
- [ ] Launch

---

## Key Innovations

This research introduces several novel contributions to the field of sustainable supply chain management:

1. **Predictive Carbon Analytics** - First platform to forecast emissions before activities occur
2. **AI-Driven Optimization** - Automated suggestions to reduce emissions in real-time
3. **Blockchain Verification** - Immutable audit trail for regulatory compliance
4. **Collaborative Ecosystem** - Multi-stakeholder platform for supply chain transparency
5. **Sector-Specific Models** - Customized calculations for different industries
6. **Goal-Oriented Design** - Built around achieving sustainability targets, not just tracking

---

## Research Objectives

### General Objective
To develop a web-based carbon footprint tracking system for supply chain management.

### Specific Objectives
1. Design a dashboard that provides real-time carbon footprint analytics
2. Implement a carbon footprint calculator that estimates emissions based on fuel consumption and distance
3. Integrate data visualization tools for tracking emissions trends
4. Ensure the system's usability and accessibility for supply chain managers

---

## Expected Outcomes

### Technical Outcomes
- Fully functional web application deployed on ICU servers
- Calculation accuracy: ±5% compared to manual calculations
- Prediction accuracy: ±10% for emission forecasts
- System performance: <2 second page loads, 99.5% uptime

### Research Contributions
- Novel predictive model for supply chain emissions forecasting
- Framework for blockchain-based carbon verification
- Methodology for real-time emission optimization
- Case studies demonstrating effectiveness of AI-driven sustainability tools

### Business Impact
- Enable 15-30% emission reductions through optimization
- Help companies achieve carbon neutrality goals
- Facilitate regulatory compliance
- Set industry standard for sustainable supply chain management

---

## Testing

### Running Tests

```bash
# Unit tests
pnpm test

# Integration tests
pnpm test:integration

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:coverage
```

### Test Strategy

- **Unit Tests**: Test individual functions (calculations, validations)
- **Integration Tests**: Test API endpoints and database operations
- **E2E Tests**: Test complete user workflows
- **Target Coverage**: 80%+ code coverage

---

## Deployment

### Development Environment

```bash
# Run locally
pnpm dev
```

### Production Deployment

```bash
# Build application
pnpm build

# Start production server
pnpm start

# Or use Docker
docker build -t cfip .
docker run -p 3000:3000 cfip
```

### Environment Variables

Required environment variables for production:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret key for authentication
- `NEXTAUTH_URL` - Production URL

---

## Contributing

This is a research project for academic purposes. For questions or collaboration opportunities, please contact:

**Author**: Mukuka Zulu
**Supervisor**: Mr. Billy Munyenyembe
**Institution**: Information and Communications University (ICU)
**Department**: ICT, School of Engineering
**Year**: 2025

---

## License

This project is submitted in partial fulfillment of the requirements for the award of the degree of Bachelor of Science in Information and Communication Technology at the Information and Communications University.

---

## Acknowledgments

- **EPA** - Emission factor data
- **IPCC** - Climate change guidelines and emission factors
- **DEFRA** - UK government conversion factors
- **Next.js Team** - Amazing full-stack framework
- **Prisma Team** - Excellent ORM
- **TensorFlow Team** - Powerful ML library
- **Supervisor and ICU** - Guidance and support

---

## Resources

### Data Sources
- [EPA GHG Emission Factors](https://www.epa.gov/climateleadership/ghg-emission-factors-hub)
- [IPCC Guidelines](https://www.ipcc-nggip.iges.or.jp/)
- [DEFRA Conversion Factors](https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting)

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TensorFlow.js Documentation](https://www.tensorflow.org/js)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [tRPC Documentation](https://trpc.io/docs)

### Community
- [Next.js Discord](https://discord.gg/nextjs)
- [Prisma Discord](https://discord.gg/prisma)
- [Stack Overflow](https://stackoverflow.com/)

---

## Status

🚧 **Project Status**: In Development (Phase 1 - Planning Complete)

**Last Updated**: December 28, 2025

---

## Next Steps

1. ✅ Review architecture documentation
2. ✅ Review MVP checklist
3. 🔲 Set up development environment
4. 🔲 Initialize Next.js project
5. 🔲 Begin Week 1 implementation

**Ready to start?** Head over to [MVP_CHECKLIST.md](./docs/MVP_CHECKLIST.md) and begin with Week 1, Day 1-2!

---

Made with ❤️ for a sustainable future 🌱
