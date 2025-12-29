import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: Request) {
  try {
    // Get demo user from database (TODO: Get from session)
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@cfip.com' },
    });

    if (!demoUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userId = demoUser.id;

    // Get total emissions
    const calculations = await prisma.calculation.findMany({
      where: { userId },
      include: { shipment: true },
    });

    const totalEmissions = calculations.reduce((sum, calc) => sum + calc.totalCO2e, 0);
    const totalCalculations = calculations.length;

    // Get emissions by transport mode
    const emissionsByMode: Record<string, number> = {};
    calculations.forEach((calc) => {
      const mode = calc.shipment.transportMode;
      emissionsByMode[mode] = (emissionsByMode[mode] || 0) + calc.totalCO2e;
    });

    // Get recent calculations
    const recentCalculations = calculations
      .sort((a, b) => b.calculatedAt.getTime() - a.calculatedAt.getTime())
      .slice(0, 5)
      .map((calc) => ({
        id: calc.id,
        origin: calc.shipment.origin,
        destination: calc.shipment.destination,
        emissions: calc.totalCO2e,
        mode: calc.shipment.transportMode,
        date: calc.calculatedAt,
      }));

    // Get emissions trend (last 30 days)
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
    })).sort((a, b) => a.date.localeCompare(b.date));

    // Calculate average emissions
    const averageEmissions = totalCalculations > 0 ? totalEmissions / totalCalculations : 0;

    // Calculate this month vs last month
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const thisMonthEmissions = calculations
      .filter((calc) => calc.calculatedAt >= thisMonthStart)
      .reduce((sum, calc) => sum + calc.totalCO2e, 0);

    const lastMonthEmissions = calculations
      .filter((calc) => calc.calculatedAt >= lastMonthStart && calc.calculatedAt < thisMonthStart)
      .reduce((sum, calc) => sum + calc.totalCO2e, 0);

    const monthlyChange = lastMonthEmissions > 0
      ? ((thisMonthEmissions - lastMonthEmissions) / lastMonthEmissions) * 100
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalEmissions,
          totalCalculations,
          averageEmissions,
          monthlyChange,
        },
        emissionsByMode,
        recentCalculations,
        trend,
      },
    });
  } catch (error: any) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
