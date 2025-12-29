import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { generateReportInsights } from '@/lib/ai/genkit';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reportType, startDate, endDate, includeAI } = body;

    if (!reportType || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Report type, start date, and end date are required' },
        { status: 400 }
      );
    }

    // Get demo user from database
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@cfip.com' },
    });

    if (!demoUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = demoUser.id;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get calculations within date range
    const calculations = await prisma.calculation.findMany({
      where: {
        userId,
        calculatedAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        shipment: true,
      },
      orderBy: {
        calculatedAt: 'desc',
      },
    });

    // Calculate totals
    const totalEmissions = calculations.reduce((sum, calc) => sum + calc.totalCO2e, 0);
    const totalCO2 = calculations.reduce((sum, calc) => sum + calc.co2, 0);
    const totalCH4 = calculations.reduce((sum, calc) => sum + calc.ch4, 0);
    const totalN2O = calculations.reduce((sum, calc) => sum + calc.n2o, 0);
    const totalDistance = calculations.reduce((sum, calc) => sum + calc.shipment.distance, 0);
    const totalWeight = calculations.reduce((sum, calc) => sum + calc.shipment.weight, 0);

    // Calculate emissions by mode
    const emissionsByMode: Record<string, number> = {};
    const countByMode: Record<string, number> = {};
    calculations.forEach((calc) => {
      const mode = calc.shipment.transportMode;
      emissionsByMode[mode] = (emissionsByMode[mode] || 0) + calc.totalCO2e;
      countByMode[mode] = (countByMode[mode] || 0) + 1;
    });

    // Calculate emissions by scope
    const emissionsByScope: Record<string, number> = {};
    calculations.forEach((calc) => {
      emissionsByScope[calc.scope] = (emissionsByScope[calc.scope] || 0) + calc.totalCO2e;
    });

    // Calculate emissions by fuel type
    const emissionsByFuel: Record<string, number> = {};
    calculations.forEach((calc) => {
      const fuel = calc.shipment.fuelType;
      emissionsByFuel[fuel] = (emissionsByFuel[fuel] || 0) + calc.totalCO2e;
    });

    // Calculate monthly breakdown
    const monthlyData: Record<string, number> = {};
    calculations.forEach((calc) => {
      const month = calc.calculatedAt.toISOString().substring(0, 7); // YYYY-MM
      monthlyData[month] = (monthlyData[month] || 0) + calc.totalCO2e;
    });

    // Get goals progress
    const goals = await prisma.goal.findMany({
      where: { userId },
      include: {
        milestones: true,
      },
    });

    // Generate AI insights if requested
    let aiInsights = null;
    if (includeAI) {
      try {
        const period = `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
        aiInsights = await generateReportInsights({
          period,
          totalEmissions,
          emissionsByMode,
          goalsProgress: goals,
          complianceStatus: {}, // Add compliance data if needed
        });
      } catch (error) {
        console.error('AI insights error:', error);
        // Continue without AI insights if it fails
      }
    }

    // Create report record
    const report = await prisma.report.create({
      data: {
        userId,
        title: `${reportType} Report - ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`,
        reportType,
        startDate: start,
        endDate: end,
        data: JSON.stringify({
          summary: {
            totalEmissions,
            totalCO2,
            totalCH4,
            totalN2O,
            totalCalculations: calculations.length,
            totalDistance,
            totalWeight,
            averageEmissionsPerShipment: calculations.length > 0 ? totalEmissions / calculations.length : 0,
          },
          emissionsByMode,
          countByMode,
          emissionsByScope,
          emissionsByFuel,
          monthlyData,
          calculations: calculations.map((calc) => ({
            id: calc.id,
            date: calc.calculatedAt,
            origin: calc.shipment.origin,
            destination: calc.shipment.destination,
            mode: calc.shipment.transportMode,
            fuel: calc.shipment.fuelType,
            distance: calc.shipment.distance,
            weight: calc.shipment.weight,
            emissions: calc.totalCO2e,
            scope: calc.scope,
          })),
          goals: goals.map((goal) => ({
            title: goal.title,
            target: goal.targetValue,
            current: goal.currentValue,
            status: goal.status,
            deadline: goal.targetDate,
          })),
          aiInsights,
        }),
        generatedBy: 'USER',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        reportId: report.id,
        report: {
          id: report.id,
          title: report.title,
          reportType: report.reportType,
          startDate: report.startDate,
          endDate: report.endDate,
          summary: {
            totalEmissions,
            totalCO2,
            totalCH4,
            totalN2O,
            totalCalculations: calculations.length,
            totalDistance,
            totalWeight,
            averageEmissionsPerShipment: calculations.length > 0 ? totalEmissions / calculations.length : 0,
          },
          emissionsByMode,
          countByMode,
          emissionsByScope,
          emissionsByFuel,
          monthlyData,
          calculations: calculations.slice(0, 100), // Limit to first 100 for response
          goals,
          aiInsights,
          generatedAt: report.generatedAt,
        },
      },
    });
  } catch (error: any) {
    console.error('Report generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate report' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Get demo user from database
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@cfip.com' },
    });

    if (!demoUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = demoUser.id;

    // Get all reports for the user
    const reports = await prisma.report.findMany({
      where: { userId },
      orderBy: { generatedAt: 'desc' },
      take: 20,
    });

    const formattedReports = reports.map((report) => ({
      id: report.id,
      title: report.title,
      reportType: report.reportType,
      startDate: report.startDate,
      endDate: report.endDate,
      generatedAt: report.generatedAt,
      generatedBy: report.generatedBy,
    }));

    return NextResponse.json({
      success: true,
      data: formattedReports,
    });
  } catch (error: any) {
    console.error('Reports fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
