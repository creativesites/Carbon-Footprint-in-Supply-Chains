# 🚀 CFIP Quick Start Guide

## Getting Started

### 1. Start the Development Server
```bash
npm run dev
```

Server will be available at: **http://localhost:3000**

---

## 📱 Available Pages

### 🏠 Landing Page
**URL**: http://localhost:3000

Features CFIP with links to:
- Start Calculating
- View Dashboard

---

### 📊 Dashboard (with AI Assistant)
**URL**: http://localhost:3000/dashboard

**What you can do**:
- View 4 KPI cards (total emissions, calculations, average, monthly change)
- See emissions by transport mode chart
- View recent calculations
- Check 30-day trend chart
- Access quick actions
- **Chat with AI Assistant** (click chat icon in bottom-right)

**AI Assistant Capabilities**:
- Ask about your emissions data
- Get personalized recommendations
- Request optimizations
- Navigate to different pages
- Calculate new shipments

**Example questions**:
- "What are my total emissions?"
- "Show me optimization suggestions"
- "Take me to the calculator"
- "Analyze my emissions patterns"

---

### 🔢 Calculator
**URL**: http://localhost:3000/calculate

**What you can do**:
- Enter shipment details (origin, destination, distance, weight)
- Select transport mode (Truck, Rail, Ship, Air)
- Choose fuel type (varies by mode)
- Adjust weather conditions
- Set capacity utilization
- Get comprehensive emissions results
- View environmental equivalents

**Test Scenario**:
```
Origin: New York
Destination: Los Angeles
Distance: 4500 km
Weight: 10 tonnes
Mode: Truck
Fuel: Diesel
Weather: Normal
Capacity: 85%
```
Expected: ~4,600 kg CO2e

---

### 📜 History
**URL**: http://localhost:3000/history

**What you can do**:
- View all past calculations
- Filter by transport mode
- Filter by date range
- See summary statistics
- Export to CSV
- Paginate through results (20 per page)

**Filters available**:
- Transport Mode: All/Truck/Rail/Ship/Air
- Start Date
- End Date

---

### 🤖 AI Insights
**URL**: http://localhost:3000/insights

**AI Analysis Types**:

1. **Emissions Analysis**
   - Analyzes patterns and trends
   - Provides recommendations
   - Identifies priority areas
   - No input required

2. **Route Optimization**
   - Enter current route details
   - Get alternative suggestions
   - See estimated savings
   - Requires route input

3. **Emissions Forecast**
   - Predicts next 3 months
   - Confidence intervals
   - Early warning indicators
   - No input required

4. **Personalized Tips**
   - Custom recommendations
   - Immediate actionable tips
   - Long-term strategies
   - No input required

**How to use**:
1. Select analysis type
2. Fill in required info (if any)
3. Click "Generate Analysis"
4. Review AI-powered insights

---

### 🎯 Goals
**URL**: http://localhost:3000/goals

**What you can do**:
- View Zambian compliance status
- Check emissions vs annual limits
- See progress bars for each mode
- Read recommended actions
- Create custom goals
- Track goal progress

**Zambian Annual Limits**:
- Truck: 50,000 kg CO2e
- Rail: 30,000 kg CO2e
- Ship: 20,000 kg CO2e
- Air: 100,000 kg CO2e
- Total: 200,000 kg CO2e

**Create a Goal**:
1. Click "+ Create Goal"
2. Enter title and description
3. Set target value (kg CO2e)
4. Choose deadline
5. Select category
6. Click "Create Goal"

---

### 📄 Reports
**URL**: http://localhost:3000/reports

**What you can do**:
- Generate comprehensive reports
- Choose report type (Daily/Weekly/Monthly/Quarterly/Annual/Custom)
- Select date range
- Include AI insights (optional)
- View report data
- Export to PDF
- Access previously generated reports

**Generate a Report**:
1. Click "+ Generate Report"
2. Select report type
3. Choose start and end dates
4. Toggle "Include AI insights"
5. Click "Generate Report"
6. Review comprehensive data
7. Click "Export PDF" to save

**Report includes**:
- Executive summary
- Emissions by mode/scope/fuel
- Greenhouse gas breakdown
- AI-generated insights
- Monthly trends
- Goals progress

---

## 🎮 Testing the Platform

### Quick Test Workflow:

1. **Calculate Emissions**
   - Go to /calculate
   - Enter: NYC → LA, 4500km, 10t, Truck, Diesel
   - Click "Calculate Emissions"
   - View results

2. **Check Dashboard**
   - Go to /dashboard
   - See your calculation appear
   - View updated statistics
   - Try the AI Assistant

3. **View History**
   - Go to /history
   - See your calculation in the table
   - Try filters
   - Export to CSV

4. **Get AI Insights**
   - Go to /insights
   - Click "Emissions Analysis"
   - Click "Generate Analysis"
   - Read AI recommendations

5. **Check Goals**
   - Go to /goals
   - View Zambian compliance
   - Create a custom goal
   - Track progress

6. **Generate Report**
   - Go to /reports
   - Generate a monthly report
   - Include AI insights
   - Export to PDF

---

## 🤖 Using the AI Features

### Dashboard AI Assistant

**Open the assistant**:
- Click the chat icon in bottom-right corner

**Try these prompts**:
```
"What are my total emissions?"
"Show me my recent calculations"
"Analyze my emissions patterns"
"Give me tips to reduce emissions"
"Calculate a new shipment from London to Paris, 340km, 5 tonnes, by truck"
"Show me optimization suggestions"
"Check my goals status"
```

**Available actions**:
- View dashboard data
- Calculate emissions
- Get optimizations
- Receive personalized tips
- Check goals
- Refresh dashboard
- Navigate pages

---

### AI Insights Page

**Emissions Analysis**:
```
1. Go to /insights
2. Select "Emissions Analysis"
3. Click "Generate Emissions Analysis"
4. Wait for AI response
5. Review insights and recommendations
```

**Route Optimization**:
```
1. Go to /insights
2. Select "Route Optimization"
3. Fill in route details:
   - Origin: Lusaka
   - Destination: Dar es Salaam
   - Distance: 1800 km
   - Weight: 20 tonnes
   - Current Mode: Truck
   - Current Fuel: Diesel
   - Current Emissions: 5000 kg CO2e
4. Click "Generate Route Optimization"
5. Review alternative suggestions
```

**Emissions Forecast**:
```
1. Go to /insights
2. Select "Emissions Forecast"
3. Click "Generate Emissions Forecast"
4. Review 3-month predictions
5. Check confidence levels
```

**Personalized Tips**:
```
1. Go to /insights
2. Select "Personalized Tips"
3. Click "Generate Personalized Tips"
4. Read custom recommendations
5. Implement actionable steps
```

---

## 📊 Data Flow

```
User Action → API Endpoint → Database → Response
     ↓            ↓             ↓          ↓
  Calculate   /api/calculate  SQLite   Results
  Dashboard   /api/dashboard  Query    Display
  History     /api/history    Filter   Table
  AI Analyze  /api/ai/analyze Gemini   Insights
  Goals       /api/goals      Check    Status
  Reports     /api/reports    Generate PDF
```

---

## 🔧 Technical Details

### Database
- **Type**: SQLite
- **Location**: `prisma/dev.db`
- **Demo User**: demo@cfip.com
- **Seeded**: 11 emission factors + 1 user

### AI Integration
- **Model**: Google Gemini 1.5 Flash
- **Framework**: Genkit
- **Interface**: CopilotKit
- **API Key**: Configured in .env

### Tech Stack
- Next.js 14+ (App Router)
- TypeScript
- Prisma ORM
- Tailwind CSS
- Google Gemini AI
- CopilotKit

---

## 🐛 Troubleshooting

### Server not starting?
```bash
npm install
npm run dev
```

### Database issues?
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### AI not working?
- Check `.env` has `GEMINI_API_KEY`
- Restart dev server
- Check console for errors

### Pages showing 404?
- Restart dev server
- Clear `.next` cache: `rm -rf .next`
- Run `npm run dev` again

---

## 📞 Help & Support

### Common Questions

**Q: How do I add more calculations?**
A: Go to /calculate and submit the form as many times as needed.

**Q: Can I delete old calculations?**
A: Not yet - this feature will be added with authentication.

**Q: How accurate are the AI insights?**
A: AI insights are based on your actual data and industry best practices, powered by Google Gemini.

**Q: Can I use real-time data?**
A: Currently using demo data. Real-time integration can be added.

**Q: How do I change the Zambian limits?**
A: Edit values in `app/api/goals/route.ts` in the `ZAMBIAN_GUIDELINES` object.

---

## 🎯 Next Steps

After testing, you can:

1. **Add Authentication**
   - Implement NextAuth.js
   - Create login/register pages
   - Add user management

2. **Deploy to Production**
   - Configure Vercel/Netlify
   - Set up production database
   - Add environment variables

3. **Enhance Features**
   - Add more AI capabilities
   - Implement real-time updates
   - Create mobile app

4. **Customize**
   - Adjust Zambian guidelines
   - Add company-specific limits
   - Create custom reports

---

## ✅ Feature Checklist

- [x] Carbon Calculator
- [x] Dashboard with KPIs
- [x] History with filters & export
- [x] AI Insights (4 types)
- [x] Zambian Goals & Compliance
- [x] Reports with PDF export
- [x] CopilotKit AI Assistant
- [ ] Authentication
- [ ] Multi-user support
- [ ] Real-time predictions

---

**Ready to start?** Run `npm run dev` and visit **http://localhost:3000**!

🚀 **CFIP - Making supply chains greener with AI** 🌍
