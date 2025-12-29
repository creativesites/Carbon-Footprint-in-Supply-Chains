import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { analyzeEmissionsStructured, optimizeRouteStructured } from '@/lib/ai/structured-analysis';

// Save analysis to database
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { analysisType, inputData, generateNew } = body;

    // Get demo user
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@cfip.com' },
    });

    if (!demoUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = demoUser.id;

    let result;

    // Generate new analysis if requested
    if (generateNew) {
      if (analysisType === 'EMISSIONS_ANALYSIS') {
        result = await analyzeEmissionsStructured(inputData);
      } else if (analysisType === 'ROUTE_OPTIMIZATION') {
        result = await optimizeRouteStructured(inputData);
      } else {
        return NextResponse.json({ error: 'Invalid analysis type' }, { status: 400 });
      }

      // Save to database
      const analysis = await prisma.analysis.create({
        data: {
          userId,
          name: `${analysisType} - ${new Date().toLocaleDateString()}`,
          analysisType,
          inputData: JSON.stringify(inputData),
          insights: result.insights,
          structuredData: JSON.stringify(result.structuredData),
          status: 'COMPLETED',
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id: analysis.id,
          insights: result.insights,
          structuredData: result.structuredData,
          generatedAt: analysis.generatedAt,
        },
      });
    } else {
      // Just save without generating (for existing analysis)
      const { insights, structuredData } = body;

      const analysis = await prisma.analysis.create({
        data: {
          userId,
          name: `${analysisType} - ${new Date().toLocaleDateString()}`,
          analysisType,
          inputData: JSON.stringify(inputData),
          insights,
          structuredData: JSON.stringify(structuredData),
          status: 'COMPLETED',
        },
      });

      return NextResponse.json({
        success: true,
        data: { id: analysis.id },
      });
    }
  } catch (error: any) {
    console.error('Analysis save error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save analysis' },
      { status: 500 }
    );
  }
}

// Get saved analyses
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const analysisType = searchParams.get('type');

    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@cfip.com' },
    });

    if (!demoUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = demoUser.id;

    const analyses = await prisma.analysis.findMany({
      where: {
        userId,
        ...(analysisType && { analysisType }),
      },
      orderBy: { generatedAt: 'desc' },
      take: 20,
    });

    const formattedAnalyses = analyses.map((analysis) => ({
      id: analysis.id,
      name: analysis.name,
      analysisType: analysis.analysisType,
      generatedAt: analysis.generatedAt,
      status: analysis.status,
    }));

    return NextResponse.json({
      success: true,
      data: formattedAnalyses,
    });
  } catch (error: any) {
    console.error('Analyses fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analyses' },
      { status: 500 }
    );
  }
}

// Get a specific analysis by ID
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    const analysis = await prisma.analysis.findUnique({
      where: { id },
    });

    if (!analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: analysis.id,
        name: analysis.name,
        analysisType: analysis.analysisType,
        insights: analysis.insights,
        structuredData: JSON.parse(analysis.structuredData || '{}'),
        generatedAt: analysis.generatedAt,
      },
    });
  } catch (error: any) {
    console.error('Analysis fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analysis' },
      { status: 500 }
    );
  }
}
