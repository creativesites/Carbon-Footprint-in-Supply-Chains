import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const mode = searchParams.get('mode');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

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

    // Build where clause
    const where: any = { userId };

    if (mode) {
      where.shipment = { transportMode: mode };
    }

    if (startDate || endDate) {
      where.calculatedAt = {};
      if (startDate) {
        where.calculatedAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.calculatedAt.lte = new Date(endDate);
      }
    }

    // Get total count for pagination
    const total = await prisma.calculation.count({ where });

    // Get paginated calculations
    const calculations = await prisma.calculation.findMany({
      where,
      include: {
        shipment: true,
      },
      orderBy: {
        calculatedAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Format the data
    const formattedCalculations = calculations.map((calc) => ({
      id: calc.id,
      origin: calc.shipment.origin,
      destination: calc.shipment.destination,
      distance: calc.shipment.distance,
      weight: calc.shipment.weight,
      transportMode: calc.shipment.transportMode,
      fuelType: calc.shipment.fuelType,
      co2: calc.co2,
      ch4: calc.ch4,
      n2o: calc.n2o,
      totalCO2e: calc.totalCO2e,
      scope: calc.scope,
      calculatedAt: calc.calculatedAt,
      weatherFactor: calc.weatherFactor,
      loadFactor: calc.loadFactor,
    }));

    return NextResponse.json({
      success: true,
      data: {
        calculations: formattedCalculations,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error('History error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
