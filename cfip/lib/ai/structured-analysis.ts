import { ai } from './genkit';

// Type definitions for structured analysis
export interface EmissionsAnalysisResult {
  insights: string; // Markdown formatted
  structuredData: {
    keyMetrics: {
      totalEmissions: number;
      primaryMode: string;
      primaryModePercentage: number;
      trend: 'increasing' | 'decreasing' | 'stable';
    };
    recommendations: Array<{
      title: string;
      description: string;
      priority: 'high' | 'medium' | 'low';
      estimatedReduction: number;
    }>;
    benchmarks: Array<{
      metric: string;
      current: number;
      industry: number;
      unit: string;
    }>;
    modeBreakdown: Array<{
      mode: string;
      emissions: number;
      percentage: number;
      count: number;
    }>;
  };
}

export interface RouteOptimizationResult {
  insights: string; // Markdown formatted
  structuredData: {
    currentRoute: {
      mode: string;
      fuel: string;
      emissions: number;
    };
    alternatives: Array<{
      name: string;
      mode: string;
      fuel: string;
      estimatedEmissions: number;
      reductionKg: number;
      reductionPercent: number;
      pros: string[];
      cons: string[];
      implementation: string;
    }>;
    comparisonChart: Array<{
      strategy: string;
      emissions: number;
      reduction: number;
    }>;
  };
}

// Analyze emissions with structured output
export async function analyzeEmissionsStructured(emissionsData: {
  totalEmissions: number;
  emissionsByMode: Record<string, number>;
  countByMode: Record<string, number>;
  recentCalculations: any[];
  trend: any[];
}): Promise<EmissionsAnalysisResult> {
  const prompt = `
You are an AI Emissions Analyst. Analyze the following emissions data and provide insights.

Total Emissions: ${emissionsData.totalEmissions} kg CO2e
Emissions by Transport Mode:
${Object.entries(emissionsData.emissionsByMode)
  .map(([mode, emissions]) => `- ${mode}: ${emissions} kg CO2e (${emissionsData.countByMode[mode]} shipments)`)
  .join('\n')}

Recent Calculations: ${emissionsData.recentCalculations.length}
Trend Data Points: ${emissionsData.trend.length}

IMPORTANT: Respond with ONLY a JSON object in this exact format (no markdown, no code blocks):
{
  "insights": "## Emissions Analysis: [Period]\\n\\n### 1. Key Insights About the Emissions Pattern\\n\\n*   [Insight 1]\\n*   [Insight 2]\\n\\n### 2. Recommendations for Reducing Emissions\\n\\n*   [Recommendation 1]\\n*   [Recommendation 2]\\n\\n### 3. Specific Actions to Take Based on Transport Mode Usage\\n\\n*   [Action 1]\\n*   [Action 2]\\n\\n### 4. Comparison with Industry Benchmarks\\n\\n*   [Benchmark 1]\\n*   [Benchmark 2]\\n\\n### 5. Priority Areas for Improvement\\n\\n1.  [Priority 1]\\n2.  [Priority 2]",
  "recommendations": [
    {
      "title": "Optimize Trucking Operations",
      "description": "Implement route optimization and driver training",
      "priority": "high",
      "estimatedReduction": 1200
    }
  ],
  "modeBreakdown": [
    {
      "mode": "TRUCK",
      "emissions": 9250.605,
      "percentage": 100,
      "count": 1
    }
  ]
}

Make sure the insights are in markdown format with proper headers (##, ###) and lists (*, -).
`;

  const { text } = await ai.generate(prompt);

  // Parse the JSON response
  try {
    // Clean up the text - remove markdown code blocks and extra whitespace
    let cleanedText = text.trim();
    cleanedText = cleanedText.replace(/```json\s*/g, '');
    cleanedText = cleanedText.replace(/```\s*/g, '');
    cleanedText = cleanedText.trim();

    const parsed = JSON.parse(cleanedText);

    // Calculate metrics from the data
    const modeBreakdown = Object.entries(emissionsData.emissionsByMode).map(([mode, emissions]) => ({
      mode,
      emissions: emissions as number,
      percentage: emissionsData.totalEmissions > 0
        ? ((emissions as number / emissionsData.totalEmissions) * 100)
        : 0,
      count: emissionsData.countByMode[mode] || 0,
    }));

    const primaryMode = modeBreakdown.length > 0
      ? modeBreakdown.reduce((max, current) =>
          current.emissions > max.emissions ? current : max
        )
      : { mode: 'UNKNOWN', percentage: 0, emissions: 0, count: 0 };

    return {
      insights: parsed.insights || text,
      structuredData: {
        keyMetrics: {
          totalEmissions: emissionsData.totalEmissions,
          primaryMode: primaryMode.mode,
          primaryModePercentage: primaryMode.percentage,
          trend: 'stable',
        },
        recommendations: parsed.recommendations || [],
        benchmarks: [],
        modeBreakdown,
      },
    };
  } catch (error) {
    console.error('Failed to parse structured analysis:', error);
    console.error('Raw text from AI:', text);

    // Try to extract insights if the whole thing is a JSON string
    let fallbackInsights = text;
    try {
      const possibleJson = JSON.parse(text);
      if (possibleJson.insights) {
        fallbackInsights = possibleJson.insights;
      }
    } catch (e) {
      // Keep the original text
    }

    // Fallback: return the text as markdown insights
    return {
      insights: fallbackInsights,
      structuredData: {
        keyMetrics: {
          totalEmissions: emissionsData.totalEmissions,
          primaryMode: Object.keys(emissionsData.emissionsByMode)[0] || 'UNKNOWN',
          primaryModePercentage: 100,
          trend: 'stable',
        },
        recommendations: [],
        benchmarks: [],
        modeBreakdown: Object.entries(emissionsData.emissionsByMode).map(([mode, emissions]) => ({
          mode,
          emissions: emissions as number,
          percentage: emissionsData.totalEmissions > 0
            ? ((emissions as number / emissionsData.totalEmissions) * 100)
            : 0,
          count: emissionsData.countByMode[mode] || 0,
        })),
      },
    };
  }
}

// Helper function to safely parse AI JSON responses
function safeParseAIResponse(text: string): any | null {
  try {
    let cleaned = text.trim();
    // Remove markdown code blocks
    cleaned = cleaned.replace(/^```json\s*/gm, '');
    cleaned = cleaned.replace(/^```\s*/gm, '');
    cleaned = cleaned.trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('Failed to parse AI response:', e);
    return null;
  }
}

// Optimize route with structured output
export async function optimizeRouteStructured(routeData: {
  origin: string;
  destination: string;
  distance: number;
  weight: number;
  currentMode: string;
  currentFuel: string;
  currentEmissions: number;
}): Promise<RouteOptimizationResult> {
  const prompt = `
You are a logistics optimization AI. Analyze this route and suggest alternatives:

Route: ${routeData.origin} → ${routeData.destination}
Distance: ${routeData.distance} km
Weight: ${routeData.weight} tonnes
Current Mode: ${routeData.currentMode}
Current Fuel: ${routeData.currentFuel}
Current Emissions: ${routeData.currentEmissions} kg CO2e

IMPORTANT: Respond with ONLY a JSON object in this exact format (no markdown, no code blocks):
{
  "insights": "## Route Optimization Analysis\\n\\n### 1. [Alternative Name]\\n*Description*\\n\\n*   **Estimated Emissions:** X kg CO2e\\n*   **CO2e Reduction:** ~Y% (Save Z kg)\\n*   **Pros:** ...\\n*   **Cons:** ...\\n\\n### 2. [Alternative Name]\\n...",
  "alternatives": [
    {
      "name": "Rail Transport (TAZARA Railway)",
      "mode": "RAIL",
      "fuel": "ELECTRIC",
      "estimatedEmissions": 1450,
      "reductionKg": 4730,
      "reductionPercent": 76,
      "pros": ["Significantly lower carbon intensity", "Bypasses road congestion"],
      "cons": ["Longer transit times", "Requires last-mile trucking"],
      "implementation": "Direct shift from road to rail"
    }
  ]
}

Provide 4-5 realistic alternatives with accurate emission estimates based on industry data.
Make sure the insights are in markdown format with proper headers and formatting.
`;

  const { text } = await ai.generate(prompt);

  try {
    const cleanedText = text.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const parsed = JSON.parse(cleanedText);

    const alternatives = parsed.alternatives || [];
    const comparisonChart = [
      {
        strategy: `Current (${routeData.currentMode})`,
        emissions: routeData.currentEmissions,
        reduction: 0,
      },
      ...alternatives.map((alt: any) => ({
        strategy: alt.name,
        emissions: alt.estimatedEmissions,
        reduction: alt.reductionPercent,
      })),
    ];

    return {
      insights: parsed.insights || text,
      structuredData: {
        currentRoute: {
          mode: routeData.currentMode,
          fuel: routeData.currentFuel,
          emissions: routeData.currentEmissions,
        },
        alternatives,
        comparisonChart,
      },
    };
  } catch (error) {
    console.error('Failed to parse route optimization:', error);
    return {
      insights: text,
      structuredData: {
        currentRoute: {
          mode: routeData.currentMode,
          fuel: routeData.currentFuel,
          emissions: routeData.currentEmissions,
        },
        alternatives: [],
        comparisonChart: [],
      },
    };
  }
}
