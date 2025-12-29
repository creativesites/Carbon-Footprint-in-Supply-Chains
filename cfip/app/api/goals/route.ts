import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// Zambian emissions guidelines (example values - adjust based on actual regulations)
export const ZAMBIAN_GUIDELINES = {
  annualLimits: {
    transport: {
      TRUCK: 50000, // kg CO2e per year
      RAIL: 30000,
      SHIP: 20000,
      AIR: 100000,
    },
    total: 200000, // kg CO2e per year
  },
  recommendations: [
    'Prioritize rail transport over road transport where possible',
    'Use electric or hybrid vehicles for short-distance deliveries',
    'Optimize load factors to minimize trips',
    'Consider carbon offsetting through verified projects',
    'Implement route optimization to reduce distances',
    'Regular vehicle maintenance to improve fuel efficiency',
  ],
  benchmarks: {
    excellent: 0.8, // 80% or below target
    good: 0.9, // 90% of target
    moderate: 1.0, // At target
    poor: 1.2, // 20% above target
  },
};

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

    // Get all goals for the user
    const goals = await prisma.goal.findMany({
      where: { userId },
      include: {
        milestones: {
          orderBy: { targetDate: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get current year emissions by mode
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59);

    const calculations = await prisma.calculation.findMany({
      where: {
        userId,
        calculatedAt: {
          gte: yearStart,
          lte: yearEnd,
        },
      },
      include: { shipment: true },
    });

    const emissionsByMode: Record<string, number> = {
      TRUCK: 0,
      RAIL: 0,
      SHIP: 0,
      AIR: 0,
    };

    let totalEmissions = 0;

    calculations.forEach((calc) => {
      const mode = calc.shipment.transportMode;
      emissionsByMode[mode] = (emissionsByMode[mode] || 0) + calc.totalCO2e;
      totalEmissions += calc.totalCO2e;
    });

    // Calculate compliance status
    const compliance = {
      TRUCK: {
        current: emissionsByMode.TRUCK,
        limit: ZAMBIAN_GUIDELINES.annualLimits.transport.TRUCK,
        percentage: (emissionsByMode.TRUCK / ZAMBIAN_GUIDELINES.annualLimits.transport.TRUCK) * 100,
        status: emissionsByMode.TRUCK <= ZAMBIAN_GUIDELINES.annualLimits.transport.TRUCK ? 'compliant' : 'exceeded',
      },
      RAIL: {
        current: emissionsByMode.RAIL,
        limit: ZAMBIAN_GUIDELINES.annualLimits.transport.RAIL,
        percentage: (emissionsByMode.RAIL / ZAMBIAN_GUIDELINES.annualLimits.transport.RAIL) * 100,
        status: emissionsByMode.RAIL <= ZAMBIAN_GUIDELINES.annualLimits.transport.RAIL ? 'compliant' : 'exceeded',
      },
      SHIP: {
        current: emissionsByMode.SHIP,
        limit: ZAMBIAN_GUIDELINES.annualLimits.transport.SHIP,
        percentage: (emissionsByMode.SHIP / ZAMBIAN_GUIDELINES.annualLimits.transport.SHIP) * 100,
        status: emissionsByMode.SHIP <= ZAMBIAN_GUIDELINES.annualLimits.transport.SHIP ? 'compliant' : 'exceeded',
      },
      AIR: {
        current: emissionsByMode.AIR,
        limit: ZAMBIAN_GUIDELINES.annualLimits.transport.AIR,
        percentage: (emissionsByMode.AIR / ZAMBIAN_GUIDELINES.annualLimits.transport.AIR) * 100,
        status: emissionsByMode.AIR <= ZAMBIAN_GUIDELINES.annualLimits.transport.AIR ? 'compliant' : 'exceeded',
      },
      TOTAL: {
        current: totalEmissions,
        limit: ZAMBIAN_GUIDELINES.annualLimits.total,
        percentage: (totalEmissions / ZAMBIAN_GUIDELINES.annualLimits.total) * 100,
        status: totalEmissions <= ZAMBIAN_GUIDELINES.annualLimits.total ? 'compliant' : 'exceeded',
      },
    };

    return NextResponse.json({
      success: true,
      data: {
        goals,
        compliance,
        guidelines: ZAMBIAN_GUIDELINES,
        currentYear,
      },
    });
  } catch (error: any) {
    console.error('Goals error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch goals' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, targetValue, targetDate, category } = body;

    if (!title || !targetValue || !targetDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Create goal
    const goal = await prisma.goal.create({
      data: {
        userId,
        title,
        description: description || '',
        targetValue: parseFloat(targetValue),
        currentValue: 0,
        targetDate: new Date(targetDate),
        status: 'IN_PROGRESS',
        category: category || 'EMISSIONS',
      },
    });

    return NextResponse.json({
      success: true,
      data: goal,
    });
  } catch (error: any) {
    console.error('Create goal error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create goal' },
      { status: 500 }
    );
  }
}
