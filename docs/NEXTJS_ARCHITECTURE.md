# CFIP - Next.js Architecture & Implementation Plan

## Carbon Footprint Intelligence Platform
**Next.js 14+ Full-Stack Application**

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Database Design](#database-design)
5. [API Architecture](#api-architecture)
6. [Feature Modules](#feature-modules)
7. [Implementation Phases](#implementation-phases)
8. [Development Roadmap](#development-roadmap)

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Application                      │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React Server/Client Components)                  │
│  ├─ Dashboard                                               │
│  ├─ Calculator                                              │
│  ├─ Predictions (AI)                                        │
│  ├─ Goals & Tracking                                        │
│  └─ Reports & Analytics                                     │
├─────────────────────────────────────────────────────────────┤
│  API Layer (Next.js API Routes + tRPC)                      │
│  ├─ /api/auth/*          - Authentication                   │
│  ├─ /api/calculate/*     - Carbon calculations              │
│  ├─ /api/predict/*       - ML predictions                   │
│  ├─ /api/goals/*         - Goal management                  │
│  └─ /api/reports/*       - Report generation                │
├─────────────────────────────────────────────────────────────┤
│  Business Logic Layer                                        │
│  ├─ /lib/calculations    - Emission algorithms              │
│  ├─ /lib/ml              - TensorFlow.js models             │
│  ├─ /lib/optimization    - Route optimization               │
│  └─ /lib/blockchain      - Audit trail simulation           │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                  │
│  ├─ PostgreSQL (Prisma ORM)  - Main database               │
│  ├─ Redis (Upstash)          - Caching & sessions          │
│  └─ File Storage             - Reports & exports            │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Principles

1. **Server-First Architecture**: Use React Server Components by default for better performance
2. **Type Safety**: End-to-end TypeScript with Prisma + tRPC
3. **Progressive Enhancement**: Core features work without JavaScript
4. **API-First Design**: All features accessible via API for future integrations
5. **Modular & Scalable**: Easy to add new features and extend functionality

---

## Technology Stack

### Core Technologies

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js | 14+ | Full-stack React framework with App Router |
| **Language** | TypeScript | 5+ | Type-safe development |
| **Database** | PostgreSQL | 15+ | Primary data storage |
| **ORM** | Prisma | 5+ | Type-safe database access |
| **Caching** | Redis (Upstash) | Latest | Session management & caching |
| **Auth** | NextAuth.js | 5+ | Authentication & authorization |
| **Styling** | Tailwind CSS | 3+ | Utility-first CSS |
| **Components** | shadcn/ui | Latest | Accessible UI components |
| **Forms** | React Hook Form | 7+ | Form handling |
| **Validation** | Zod | 3+ | Schema validation |
| **Charts** | Recharts + Tremor | Latest | Data visualization |
| **API** | tRPC | 10+ | Type-safe APIs |
| **ML** | TensorFlow.js | Latest | Predictive analytics |
| **Testing** | Vitest + Playwright | Latest | Unit & E2E testing |
| **Deployment** | Docker | Latest | Containerization |

### Development Tools

- **Package Manager**: pnpm (faster than npm/yarn)
- **Code Quality**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged
- **Type Checking**: TypeScript strict mode
- **API Testing**: Postman / Bruno
- **Database GUI**: Prisma Studio / TablePlus

---

## Project Structure

```
cfip/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth layout group
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # Dashboard layout group
│   │   ├── layout.tsx            # Shared dashboard layout
│   │   ├── page.tsx              # Main dashboard
│   │   ├── calculate/            # Carbon calculator
│   │   ├── predict/              # AI predictions
│   │   ├── goals/                # Sustainability goals
│   │   ├── reports/              # Reports & analytics
│   │   ├── settings/             # User settings
│   │   └── history/              # Calculation history
│   ├── api/                      # API routes
│   │   ├── auth/[...nextauth]/   # NextAuth handler
│   │   ├── trpc/[trpc]/          # tRPC handler
│   │   ├── calculate/            # Calculation endpoints
│   │   ├── predict/              # Prediction endpoints
│   │   ├── goals/                # Goal management
│   │   └── reports/              # Report generation
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── dashboard/                # Dashboard components
│   ├── calculator/               # Calculator components
│   ├── charts/                   # Chart components
│   ├── forms/                    # Form components
│   └── layout/                   # Layout components
├── lib/                          # Business logic & utilities
│   ├── db/                       # Database utilities
│   │   ├── prisma.ts             # Prisma client
│   │   └── queries/              # Reusable queries
│   ├── calculations/             # Emission calculation logic
│   │   ├── carbon.ts             # Core carbon calculator
│   │   ├── emission-factors.ts   # EPA/IPCC data
│   │   └── adjustments.ts        # Weather/traffic/load factors
│   ├── ml/                       # Machine learning
│   │   ├── model.ts              # TensorFlow.js model
│   │   ├── training.ts           # Model training logic
│   │   └── predictions.ts        # Prediction functions
│   ├── optimization/             # Route optimization
│   │   ├── optimizer.ts          # Optimization algorithm
│   │   └── suggestions.ts        # Suggestion generator
│   ├── blockchain/               # Blockchain simulation
│   │   ├── audit-trail.ts        # Immutable audit log
│   │   └── verification.ts       # Verification functions
│   ├── reports/                  # Report generation
│   │   ├── pdf.ts                # PDF generator
│   │   ├── excel.ts              # Excel export
│   │   └── templates/            # Report templates
│   ├── auth/                     # Authentication utilities
│   ├── validations/              # Zod schemas
│   └── utils/                    # Helper functions
├── prisma/                       # Prisma configuration
│   ├── schema.prisma             # Database schema
│   ├── migrations/               # Database migrations
│   └── seed.ts                   # Seed data
├── public/                       # Static assets
│   ├── data/                     # Emission factor datasets
│   └── images/                   # Images & icons
├── types/                        # TypeScript type definitions
├── tests/                        # Test files
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   └── e2e/                      # End-to-end tests
├── .env.example                  # Environment variables template
├── docker-compose.yml            # Docker configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
└── README.md                     # Project documentation
```

---

## Database Design

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// USER MANAGEMENT
// ============================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String
  role          Role      @default(USER)
  companyId     String?
  company       Company?  @relation(fields: [companyId], references: [id])

  shipments     Shipment[]
  goals         Goal[]
  calculations  Calculation[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Role {
  ADMIN
  MANAGER
  USER
  SUPPLIER
  CARRIER
}

model Company {
  id              String    @id @default(cuid())
  name            String
  industry        String?
  country         String?

  users           User[]
  shipments       Shipment[]
  goals           Goal[]

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

// ============================================
// CARBON CALCULATIONS
// ============================================

model Shipment {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  companyId       String?
  company         Company?  @relation(fields: [companyId], references: [id])

  // Shipment details
  origin          String
  destination     String
  distance        Float     // in kilometers
  transportMode   TransportMode
  fuelType        FuelType
  weight          Float     // in tonnes
  volume          Float?    // in cubic meters

  // Metadata
  shipmentDate    DateTime?
  status          ShipmentStatus @default(PLANNED)

  // Relationships
  calculation     Calculation?
  prediction      Prediction?
  optimizations   Optimization[]
  auditLogs       AuditLog[]

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

enum TransportMode {
  TRUCK
  RAIL
  SHIP
  AIR
  MULTIMODAL
}

enum FuelType {
  DIESEL
  ELECTRIC
  HYBRID
  JET_FUEL
  HEAVY_FUEL_OIL
  LNG
  BIODIESEL
}

enum ShipmentStatus {
  PLANNED
  IN_TRANSIT
  COMPLETED
  CANCELLED
}

model Calculation {
  id              String    @id @default(cuid())
  shipmentId      String    @unique
  shipment        Shipment  @relation(fields: [shipmentId], references: [id])
  userId          String
  user            User      @relation(fields: [userId], references: [id])

  // Emissions (in kg)
  co2             Float
  ch4             Float?
  n2o             Float?
  totalCO2e       Float     // Total CO2 equivalent

  // Calculation details
  emissionFactor  Float
  scope           EmissionScope
  methodology     String    @default("GHG_Protocol")

  // Adjustments applied
  weatherFactor   Float     @default(0)
  loadFactor      Float     @default(0)
  trafficFactor   Float     @default(0)

  // Metadata
  calculatedAt    DateTime  @default(now())
  version         String    @default("1.0")

  auditLogs       AuditLog[]
}

enum EmissionScope {
  SCOPE_1
  SCOPE_2
  SCOPE_3
}

model EmissionFactor {
  id              String    @id @default(cuid())

  transportMode   TransportMode
  fuelType        FuelType
  region          String    @default("GLOBAL")

  // Emission factors (kg CO2 per tonne-km)
  co2Factor       Float
  ch4Factor       Float?
  n2oFactor       Float?

  // Metadata
  source          String    // "EPA", "IPCC", "DEFRA", etc.
  year            Int
  lastUpdated     DateTime  @default(now())

  @@unique([transportMode, fuelType, region])
}

// ============================================
// AI PREDICTIONS & OPTIMIZATION
// ============================================

model Prediction {
  id              String    @id @default(cuid())
  shipmentId      String    @unique
  shipment        Shipment  @relation(fields: [shipmentId], references: [id])

  // Predicted emissions
  predictedCO2    Float
  confidenceLow   Float
  confidenceHigh  Float
  confidence      Float     // 0-100%

  // Model details
  modelVersion    String
  features        Json      // Input features used

  // Accuracy tracking
  actualCO2       Float?
  accuracy        Float?    // Set after actual calculation

  createdAt       DateTime  @default(now())
}

model Optimization {
  id              String    @id @default(cuid())
  shipmentId      String
  shipment        Shipment  @relation(fields: [shipmentId], references: [id])

  // Suggestion details
  type            OptimizationType
  description     String

  // Impact
  currentCO2      Float
  optimizedCO2    Float
  savingsKg       Float
  savingsPercent  Float

  // Implementation
  status          OptimizationStatus @default(SUGGESTED)
  implementedAt   DateTime?

  createdAt       DateTime  @default(now())
}

enum OptimizationType {
  ROUTE_CHANGE
  MODE_SWITCH
  CARRIER_SWITCH
  CONSOLIDATION
  TIMING_ADJUSTMENT
}

enum OptimizationStatus {
  SUGGESTED
  ACCEPTED
  REJECTED
  IMPLEMENTED
}

// ============================================
// SUSTAINABILITY GOALS
// ============================================

model Goal {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  companyId       String?
  company         Company?  @relation(fields: [companyId], references: [id])

  // Goal details
  name            String
  description     String?
  goalType        GoalType

  // Targets
  baselineValue   Float     // Starting emissions
  targetValue     Float     // Goal emissions
  unit            String    @default("kg CO2e")

  // Timeline
  startDate       DateTime
  targetDate      DateTime

  // Progress tracking
  currentValue    Float?
  progressPercent Float?
  status          GoalStatus @default(IN_PROGRESS)

  // Milestones
  milestones      Milestone[]

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

enum GoalType {
  ABSOLUTE_REDUCTION   // Reduce by X kg
  PERCENTAGE_REDUCTION // Reduce by X%
  INTENSITY_TARGET     // kg CO2 per unit
  CARBON_NEUTRAL       // Net zero
}

enum GoalStatus {
  IN_PROGRESS
  ACHIEVED
  AT_RISK
  FAILED
}

model Milestone {
  id              String    @id @default(cuid())
  goalId          String
  goal            Goal      @relation(fields: [goalId], references: [id])

  name            String
  targetValue     Float
  targetDate      DateTime
  achieved        Boolean   @default(false)
  achievedAt      DateTime?

  createdAt       DateTime  @default(now())
}

// ============================================
// BLOCKCHAIN SIMULATION (Audit Trail)
// ============================================

model AuditLog {
  id              String    @id @default(cuid())

  // Reference to original record
  shipmentId      String?
  shipment        Shipment? @relation(fields: [shipmentId], references: [id])
  calculationId   String?
  calculation     Calculation? @relation(fields: [calculationId], references: [id])

  // Blockchain-like fields
  action          String    // "CREATE", "UPDATE", "DELETE"
  entity          String    // "Shipment", "Calculation", etc.
  data            Json      // Snapshot of data

  // Immutability features
  previousHash    String?
  currentHash     String    @unique
  signature       String?

  // Metadata
  timestamp       DateTime  @default(now())
  userId          String?

  @@index([currentHash])
  @@index([timestamp])
}

// ============================================
// REPORTS
// ============================================

model Report {
  id              String    @id @default(cuid())
  userId          String

  name            String
  type            ReportType
  format          ReportFormat

  // Filters & parameters
  dateFrom        DateTime
  dateTo          DateTime
  filters         Json?

  // File info
  fileUrl         String?
  fileSize        Int?

  // Status
  status          ReportStatus @default(PENDING)
  generatedAt     DateTime?

  createdAt       DateTime  @default(now())
}

enum ReportType {
  EMISSIONS_SUMMARY
  GOAL_PROGRESS
  CDP_DISCLOSURE
  CUSTOM
}

enum ReportFormat {
  PDF
  EXCEL
  CSV
  JSON
}

enum ReportStatus {
  PENDING
  GENERATING
  COMPLETED
  FAILED
}
```

### Database Relationships Diagram

```
User ──┬──< Shipment ──┬──< Calculation
       │               ├──< Prediction
       │               ├──< Optimization
       │               └──< AuditLog
       │
       ├──< Goal ──< Milestone
       │
       └──< Company
```

---

## API Architecture

### tRPC Router Structure

```typescript
// lib/trpc/routers/_app.ts

export const appRouter = router({
  auth: authRouter,
  calculate: calculateRouter,
  predict: predictRouter,
  goals: goalsRouter,
  reports: reportsRouter,
  shipments: shipmentsRouter,
  optimizations: optimizationsRouter,
});

export type AppRouter = typeof appRouter;
```

### Key API Endpoints

#### 1. Authentication (`/api/auth`)

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - End session
- `GET /api/auth/session` - Get current session

#### 2. Carbon Calculations (`/api/calculate`)

- `POST /api/calculate` - Calculate emissions for shipment
- `POST /api/calculate/bulk` - Bulk calculation from CSV
- `GET /api/calculate/:id` - Get calculation details
- `GET /api/calculate/history` - Get calculation history

#### 3. Predictions (`/api/predict`)

- `POST /api/predict` - Predict emissions for planned shipment
- `POST /api/predict/compare` - Compare multiple scenarios
- `GET /api/predict/:id` - Get prediction details
- `GET /api/predict/accuracy` - Model accuracy metrics

#### 4. Optimization (`/api/optimize`)

- `POST /api/optimize` - Get optimization suggestions
- `POST /api/optimize/apply` - Apply optimization
- `GET /api/optimize/:shipmentId` - Get suggestions for shipment

#### 5. Goals (`/api/goals`)

- `POST /api/goals` - Create sustainability goal
- `GET /api/goals` - List all goals
- `GET /api/goals/:id` - Get goal details
- `GET /api/goals/:id/progress` - Get goal progress
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

#### 6. Reports (`/api/reports`)

- `POST /api/reports/generate` - Generate report
- `GET /api/reports/:id/download` - Download report
- `GET /api/reports` - List reports
- `POST /api/reports/cdp` - Generate CDP report

---

## Feature Modules

### Module 1: Carbon Calculator

**Purpose**: Calculate carbon emissions for supply chain activities

**Key Components**:
- Input form for shipment details
- Real-time calculation as user types
- Display of emission breakdown (CO2, CH4, N2O)
- Scope classification (1, 2, 3)
- Comparison with benchmarks

**Technical Implementation**:
```typescript
// lib/calculations/carbon.ts
export function calculateEmissions(params: CalculationParams): EmissionResult {
  const emissionFactor = getEmissionFactor(params.transportMode, params.fuelType);
  const baseEmissions = params.distance * params.weight * emissionFactor;

  // Apply adjustment factors
  const adjustments = calculateAdjustments(params);
  const totalEmissions = baseEmissions * (1 + adjustments.total);

  return {
    co2: totalEmissions,
    scope: determineScope(params.transportMode),
    breakdown: calculateBreakdown(totalEmissions),
  };
}
```

### Module 2: Dashboard & Analytics

**Purpose**: Provide real-time insights and visualizations

**Key Components**:
- KPI cards (total emissions, trends, comparisons)
- Interactive charts (time series, breakdowns, comparisons)
- Map visualization of shipment routes
- Alerts and notifications

**Charts**:
1. Emissions over time (line chart)
2. Emissions by transport mode (pie chart)
3. Emissions by route (bar chart)
4. Goal progress (progress bars)
5. Comparison with benchmarks (gauge chart)

### Module 3: AI Predictions

**Purpose**: Predict future emissions using machine learning

**Key Components**:
- Prediction form (similar to calculator but for future shipments)
- Confidence intervals display
- What-if scenario comparison
- Prediction accuracy tracking

**ML Model**:
```typescript
// lib/ml/model.ts
import * as tf from '@tensorflow/tfjs-node';

export class EmissionPredictor {
  private model: tf.LayersModel;

  async predict(features: PredictionFeatures): Promise<PredictionResult> {
    const inputTensor = this.preprocessFeatures(features);
    const prediction = this.model.predict(inputTensor) as tf.Tensor;
    const [predictedValue] = await prediction.data();

    return {
      predictedCO2: predictedValue,
      confidence: this.calculateConfidence(features),
      confidenceInterval: this.calculateInterval(predictedValue, features),
    };
  }
}
```

### Module 4: Sustainability Goals

**Purpose**: Set and track progress toward emission reduction targets

**Key Components**:
- Goal creation wizard
- Progress dashboard
- Milestone tracking
- Notifications for milestones
- Comparison with industry benchmarks

**Goal Types**:
1. Absolute reduction (reduce by X kg)
2. Percentage reduction (reduce by X%)
3. Intensity target (kg CO2 per unit)
4. Carbon neutral (net zero)

### Module 5: Reports & Exports

**Purpose**: Generate comprehensive reports for stakeholders

**Report Types**:
1. **Emissions Summary** - Overview of all emissions
2. **Goal Progress Report** - Progress toward goals
3. **CDP Disclosure** - CDP-compliant reporting
4. **Custom Reports** - User-defined parameters

**Export Formats**:
- PDF (for presentations)
- Excel (for analysis)
- CSV (for data processing)
- JSON (for API integration)

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-4)

**Goals**: Set up project infrastructure and basic functionality

**Tasks**:
- [ ] Initialize Next.js project with TypeScript
- [ ] Set up Prisma with PostgreSQL
- [ ] Configure NextAuth.js for authentication
- [ ] Create basic UI components with shadcn/ui
- [ ] Implement user registration and login
- [ ] Design and implement database schema
- [ ] Import emission factor data
- [ ] Create basic calculator logic
- [ ] Build simple dashboard layout

**Deliverables**:
- Working authentication system
- Basic calculator that can calculate emissions
- Simple dashboard showing recent calculations

### Phase 2: Core Features (Weeks 5-9)

**Goals**: Implement main features and visualizations

**Tasks**:
- [ ] Enhance calculator with all transport modes
- [ ] Add adjustment factors (weather, load, traffic)
- [ ] Implement calculation history
- [ ] Build comprehensive dashboard with charts
- [ ] Create goal creation and tracking system
- [ ] Implement progress monitoring
- [ ] Add basic reporting (PDF export)
- [ ] Create settings page
- [ ] Implement data visualization with Recharts

**Deliverables**:
- Full-featured calculator
- Interactive dashboard with charts
- Goal tracking system
- Basic reporting functionality

### Phase 3: AI & Advanced Features (Weeks 10-14)

**Goals**: Add predictive analytics and optimization

**Tasks**:
- [ ] Set up TensorFlow.js
- [ ] Create training data pipeline
- [ ] Train emission prediction model
- [ ] Implement prediction interface
- [ ] Build optimization algorithm
- [ ] Create optimization suggestions UI
- [ ] Implement what-if scenario comparison
- [ ] Add anomaly detection
- [ ] Build blockchain-style audit trail

**Deliverables**:
- Working ML prediction model
- Optimization suggestion engine
- Scenario comparison tool
- Immutable audit logging

### Phase 4: Polish & Testing (Weeks 15-18)

**Goals**: Refine UX, test thoroughly, and prepare for deployment

**Tasks**:
- [ ] Conduct user testing
- [ ] Refine UI/UX based on feedback
- [ ] Write comprehensive tests (unit, integration, E2E)
- [ ] Optimize performance
- [ ] Add error handling and validation
- [ ] Create user documentation
- [ ] Set up Docker for deployment
- [ ] Configure CI/CD pipeline
- [ ] Security audit
- [ ] Final testing

**Deliverables**:
- Polished, tested application
- User documentation
- Deployment-ready Docker container

### Phase 5: Deployment & Documentation (Weeks 19-20)

**Goals**: Deploy to production and finalize documentation

**Tasks**:
- [ ] Deploy to ICU servers
- [ ] Configure domain and SSL
- [ ] Set up monitoring and logging
- [ ] Create admin panel
- [ ] Write technical documentation
- [ ] Create video tutorials
- [ ] Conduct final user training
- [ ] Launch application

**Deliverables**:
- Live production application
- Complete documentation
- Training materials

---

## Development Roadmap

### Detailed Week-by-Week Plan

#### Week 1: Project Setup
- **Day 1-2**: Initialize Next.js project, configure TypeScript, set up Git
- **Day 3-4**: Install and configure dependencies (Prisma, Tailwind, shadcn/ui)
- **Day 5-6**: Set up database, create initial schema, configure NextAuth
- **Day 7**: Create project structure, set up development environment

#### Week 2: Authentication & Database
- **Day 1-2**: Implement user registration and login
- **Day 3-4**: Create database models for all entities
- **Day 5-6**: Set up Prisma migrations, seed data
- **Day 7**: Test authentication flow, fix bugs

#### Week 3: Basic Calculator
- **Day 1-2**: Import emission factor data (EPA, IPCC)
- **Day 3-4**: Implement core calculation logic
- **Day 5-6**: Create calculator UI form
- **Day 7**: Display calculation results, test accuracy

#### Week 4: Simple Dashboard
- **Day 1-2**: Create dashboard layout with navigation
- **Day 3-4**: Implement KPI cards showing key metrics
- **Day 5-6**: Add simple charts (emissions over time)
- **Day 7**: Test Phase 1 deliverables, prepare for Phase 2

#### Week 5: Enhanced Calculator
- **Day 1-2**: Add support for all transport modes
- **Day 3-4**: Implement adjustment factors
- **Day 5-6**: Create bulk calculation from CSV
- **Day 7**: Add calculation history page

#### Week 6: Advanced Visualizations
- **Day 1-2**: Integrate Recharts library
- **Day 3-4**: Build emissions breakdown charts (pie, bar)
- **Day 5-6**: Create time series trend charts
- **Day 7**: Add interactive filters and tooltips

#### Week 7-8: Goal Tracking System
- **Day 1-2**: Create goal creation form
- **Day 3-4**: Implement goal progress calculation
- **Day 5-6**: Build goal dashboard with progress bars
- **Day 7-8**: Add milestone tracking and notifications
- **Day 9-10**: Test goal tracking with sample data

#### Week 9: Reporting Module
- **Day 1-2**: Set up PDF generation with React-PDF
- **Day 3-4**: Create report templates
- **Day 5-6**: Implement Excel export
- **Day 7**: Add CDP-compliant report template

#### Week 10: ML Infrastructure
- **Day 1-2**: Set up TensorFlow.js
- **Day 3-4**: Create data preprocessing pipeline
- **Day 5-6**: Generate synthetic training data
- **Day 7**: Design neural network architecture

#### Week 11: Prediction Model
- **Day 1-2**: Train emission prediction model
- **Day 3-4**: Validate model accuracy (target: ±10%)
- **Day 5-6**: Implement prediction API
- **Day 7**: Create prediction UI interface

#### Week 12: Optimization Engine
- **Day 1-2**: Design optimization algorithm
- **Day 3-4**: Implement suggestion generator
- **Day 5-6**: Calculate emission savings for alternatives
- **Day 7**: Create optimization dashboard panel

#### Week 13-14: Advanced Features
- **Day 1-2**: Build what-if scenario comparison
- **Day 3-4**: Implement anomaly detection
- **Day 5-6**: Create blockchain-style audit trail
- **Day 7-8**: Add data export capabilities
- **Day 9-10**: Integration testing of all features

#### Week 15-16: User Testing & Refinement
- **Day 1-3**: Recruit beta testers, conduct usability sessions
- **Day 4-6**: Gather and analyze feedback
- **Day 7-10**: Implement improvements based on feedback
- **Day 11-12**: Second round of testing

#### Week 17: Testing & Quality Assurance
- **Day 1-2**: Write unit tests (target: 80% coverage)
- **Day 3-4**: Write integration tests
- **Day 5-6**: E2E tests with Playwright
- **Day 7**: Performance testing and optimization

#### Week 18: Security & Documentation
- **Day 1-2**: Security audit and fixes
- **Day 3-4**: Write API documentation
- **Day 5-6**: Create user guide and help content
- **Day 7**: Code review and cleanup

#### Week 19: Deployment Preparation
- **Day 1-2**: Create Docker container
- **Day 3-4**: Set up CI/CD pipeline
- **Day 5-6**: Configure production environment on ICU servers
- **Day 7**: Deployment dry run

#### Week 20: Launch
- **Day 1-2**: Deploy to production
- **Day 3-4**: Monitor and fix any issues
- **Day 5-6**: User training sessions
- **Day 7**: Official launch celebration!

---

## Next Steps

1. **Review this document** - Make sure you understand the architecture
2. **Set up development environment** - Install Node.js, PostgreSQL, pnpm
3. **Create GitHub repository** - Version control from day one
4. **Initialize Next.js project** - Start with `npx create-next-app@latest`
5. **Schedule regular check-ins** - Weekly progress reviews with supervisor

---

## Resources

### Learning Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [TensorFlow.js Documentation](https://www.tensorflow.org/js)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

### Data Sources
- [EPA Emission Factors](https://www.epa.gov/climateleadership/ghg-emission-factors-hub)
- [IPCC Guidelines](https://www.ipcc-nggip.iges.or.jp/)
- [DEFRA Conversion Factors](https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting)

### Community
- Next.js Discord
- Prisma Discord
- Stack Overflow
- GitHub Discussions

---

**Document Version**: 1.0
**Last Updated**: December 2025
**Author**: Mukuka Zulu
**Supervisor**: Mr. Billy Munyenyembe
