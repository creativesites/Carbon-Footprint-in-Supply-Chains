import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { calculateEmissions } from '@/lib/calculations/carbon';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      origin,
      destination,
      distance,
      weight,
      transportMode,
      fuelType,
      weatherCondition,
      capacityUtilization,
    } = body;

    // Validate required fields
    if (!origin || !destination || !distance || !weight || !transportMode || !fuelType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

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

    // Calculate emissions
    const emissionResult = await calculateEmissions({
      distance: parseFloat(distance),
      weight: parseFloat(weight),
      transportMode,
      fuelType,
      weatherCondition,
      capacityUtilization: capacityUtilization ? parseFloat(capacityUtilization) : 100,
    });

    // Save to database
    const shipment = await prisma.shipment.create({
      data: {
        origin,
        destination,
        distance: parseFloat(distance),
        weight: parseFloat(weight),
        transportMode,
        fuelType,
        status: 'COMPLETED',
        userId,
      },
    });

    const calculation = await prisma.calculation.create({
      data: {
        shipmentId: shipment.id,
        userId,
        co2: emissionResult.co2,
        ch4: emissionResult.ch4,
        n2o: emissionResult.n2o,
        totalCO2e: emissionResult.totalCO2e,
        emissionFactor: emissionResult.emissionFactor,
        scope: emissionResult.scope,
        weatherFactor: emissionResult.breakdown.weatherAdjustment / emissionResult.breakdown.base || 0,
        loadFactor: emissionResult.breakdown.loadAdjustment / emissionResult.breakdown.base || 0,
        trafficFactor: emissionResult.breakdown.trafficAdjustment / emissionResult.breakdown.base || 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        shipmentId: shipment.id,
        calculationId: calculation.id,
        emissions: {
          co2: emissionResult.co2,
          ch4: emissionResult.ch4,
          n2o: emissionResult.n2o,
          totalCO2e: emissionResult.totalCO2e,
        },
        scope: emissionResult.scope,
        breakdown: emissionResult.breakdown,
      },
    });
  } catch (error: any) {
    console.error('Calculation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate emissions' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch calculations
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user'; // TODO: Get from session

    const calculations = await prisma.calculation.findMany({
      where: { userId },
      include: {
        shipment: true,
      },
      orderBy: {
        calculatedAt: 'desc',
      },
      take: 10,
    });

    return NextResponse.json({
      success: true,
      data: calculations,
    });
  } catch (error: any) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch calculations' },
      { status: 500 }
    );
  }
}
