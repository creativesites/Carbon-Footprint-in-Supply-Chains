import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import {
  analyzeEmissions,
  optimizeRoute,
  predictEmissions,
  getPersonalizedTips,
} from '@/lib/ai/genkit';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type) {
      return NextResponse.json({ error: 'Analysis type required' }, { status: 400 });
    }

    // Get demo user from database
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@cfip.com' },
    });

    if (!demoUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = demoUser.id;

    let analysis: string;

    switch (type) {
      case 'emissions':
        // Fetch user's emissions data if not provided
        if (!data) {
          const calculations = await prisma.calculation.findMany({
            where: { userId },
            include: { shipment: true },
            orderBy: { calculatedAt: 'desc' },
            take: 100,
          });

          const totalEmissions = calculations.reduce((sum, calc) => sum + calc.totalCO2e, 0);

          const emissionsByMode: Record<string, number> = {};
          calculations.forEach((calc) => {
            const mode = calc.shipment.transportMode;
            emissionsByMode[mode] = (emissionsByMode[mode] || 0) + calc.totalCO2e;
          });

          const recentCalculations = calculations.slice(0, 10).map((calc) => ({
            origin: calc.shipment.origin,
            destination: calc.shipment.destination,
            emissions: calc.totalCO2e,
            mode: calc.shipment.transportMode,
          }));

          // Get trend data
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          const trendData = calculations
            .filter((calc) => calc.calculatedAt >= thirtyDaysAgo)
            .reduce((acc: Record<string, number>, calc) => {
              const date = calc.calculatedAt.toISOString().split('T')[0];
              acc[date] = (acc[date] || 0) + calc.totalCO2e;
              return acc;
            }, {});

          const trend = Object.entries(trendData).map(([date, emissions]) => ({
            date,
            emissions,
          }));

          analysis = await analyzeEmissions({
            totalEmissions,
            emissionsByMode,
            recentCalculations,
            trend,
          });
        } else {
          analysis = await analyzeEmissions(data);
        }
        break;

      case 'optimize':
        if (!data) {
          return NextResponse.json(
            { error: 'Route data required for optimization' },
            { status: 400 }
          );
        }
        analysis = await optimizeRoute(data);
        break;

      case 'predict':
        // Fetch historical data for prediction
        const calculations = await prisma.calculation.findMany({
          where: { userId },
          include: { shipment: true },
          orderBy: { calculatedAt: 'desc' },
        });

        // Calculate monthly emissions for last 6 months
        const monthlyEmissions: number[] = [];
        for (let i = 0; i < 6; i++) {
          const monthStart = new Date();
          monthStart.setMonth(monthStart.getMonth() - i);
          monthStart.setDate(1);
          monthStart.setHours(0, 0, 0, 0);

          const monthEnd = new Date(monthStart);
          monthEnd.setMonth(monthEnd.getMonth() + 1);

          const monthCalcs = calculations.filter(
            (calc) => calc.calculatedAt >= monthStart && calc.calculatedAt < monthEnd
          );

          const monthTotal = monthCalcs.reduce((sum, calc) => sum + calc.totalCO2e, 0);
          monthlyEmissions.unshift(monthTotal);
        }

        // Calculate transport mode distribution
        const totalCalcs = calculations.length;
        const modeDistribution: Record<string, number> = {};
        calculations.forEach((calc) => {
          const mode = calc.shipment.transportMode;
          modeDistribution[mode] = (modeDistribution[mode] || 0) + 1;
        });

        const transportModes: Record<string, number> = {};
        Object.entries(modeDistribution).forEach(([mode, count]) => {
          transportModes[mode] = (count / totalCalcs) * 100;
        });

        const averageDistance =
          calculations.reduce((sum, calc) => sum + calc.shipment.distance, 0) /
          calculations.length;
        const averageWeight =
          calculations.reduce((sum, calc) => sum + calc.shipment.weight, 0) /
          calculations.length;

        analysis = await predictEmissions({
          monthlyEmissions,
          transportModes,
          averageDistance,
          averageWeight,
        });
        break;

      case 'tips':
        // Get user's pattern data
        const userCalcs = await prisma.calculation.findMany({
          where: { userId },
          include: { shipment: true },
          orderBy: { calculatedAt: 'desc' },
        });

        const userTotal = userCalcs.reduce((sum, calc) => sum + calc.totalCO2e, 0);

        // Find primary mode
        const modeCounts: Record<string, number> = {};
        userCalcs.forEach((calc) => {
          const mode = calc.shipment.transportMode;
          modeCounts[mode] = (modeCounts[mode] || 0) + 1;
        });
        const primaryMode = Object.entries(modeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'TRUCK';

        // Calculate trend
        const last7Days = userCalcs.slice(0, 7).reduce((sum, calc) => sum + calc.totalCO2e, 0);
        const prev7Days = userCalcs.slice(7, 14).reduce((sum, calc) => sum + calc.totalCO2e, 0);
        const recentTrend = last7Days > prev7Days ? 'increasing' : last7Days < prev7Days ? 'decreasing' : 'stable';

        // Assume target of 50000 kg CO2e for demo
        const emissionsVsTarget = (userTotal / 50000) * 100;

        analysis = await getPersonalizedTips({
          totalEmissions: userTotal,
          primaryMode,
          emissionsVsTarget,
          recentTrend,
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid analysis type' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        analysis,
        type,
      },
    });
  } catch (error: any) {
    console.error('AI Analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to perform AI analysis' },
      { status: 500 }
    );
  }
}
