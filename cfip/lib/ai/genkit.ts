import { genkit } from 'genkit';
import { googleAI, gemini15Flash } from '@genkit-ai/googleai';

// Initialize Genkit with Google AI
export const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })],
  model: gemini15Flash,
});

// Analyze emissions data and provide insights
export async function analyzeEmissions(emissionsData: {
  totalEmissions: number;
  emissionsByMode: Record<string, number>;
  recentCalculations: any[];
  trend: any[];
}) {
  const prompt = `
You are an AI emissions analyst. Analyze the following emissions data and provide actionable insights:

Total Emissions: ${emissionsData.totalEmissions} kg CO2e
Emissions by Transport Mode:
${Object.entries(emissionsData.emissionsByMode)
  .map(([mode, emissions]) => `- ${mode}: ${emissions} kg CO2e`)
  .join('\n')}

Recent Calculations: ${emissionsData.recentCalculations.length}
Trend Data Points: ${emissionsData.trend.length}

Please provide:
1. Key insights about the emissions pattern
2. Recommendations for reducing emissions
3. Specific actions to take based on transport mode usage
4. Comparison with industry benchmarks
5. Priority areas for improvement

Format your response as a structured analysis with clear sections.
`;

  const { text } = await ai.generate(prompt);
  return text;
}

// Get route optimization suggestions
export async function optimizeRoute(routeData: {
  origin: string;
  destination: string;
  distance: number;
  weight: number;
  currentMode: string;
  currentFuel: string;
  currentEmissions: number;
}) {
  const prompt = `
You are a logistics optimization AI. Analyze this route and suggest alternatives to reduce emissions:

Route: ${routeData.origin} → ${routeData.destination}
Distance: ${routeData.distance} km
Weight: ${routeData.weight} tonnes
Current Mode: ${routeData.currentMode}
Current Fuel: ${routeData.currentFuel}
Current Emissions: ${routeData.currentEmissions} kg CO2e

Consider:
1. Alternative transport modes (truck, rail, ship, air)
2. Alternative fuel types (electric, hybrid, biodiesel)
3. Multi-modal transport options
4. Load optimization strategies
5. Route alternatives

Provide specific, actionable recommendations with estimated emission reductions.
Format your response as a clear list of alternatives with pros, cons, and estimated CO2e savings.
`;

  const { text } = await ai.generate(prompt);
  return text;
}

// Predict future emissions based on historical data
export async function predictEmissions(historicalData: {
  monthlyEmissions: number[];
  transportModes: Record<string, number>;
  averageDistance: number;
  averageWeight: number;
}) {
  const prompt = `
You are a predictive analytics AI for emissions forecasting. Based on this historical data, predict emissions for the next 3 months:

Monthly Emissions (last 6 months): ${historicalData.monthlyEmissions.join(', ')} kg CO2e
Transport Mode Distribution:
${Object.entries(historicalData.transportModes)
  .map(([mode, percentage]) => `- ${mode}: ${percentage}%`)
  .join('\n')}

Average Distance: ${historicalData.averageDistance} km
Average Weight: ${historicalData.averageWeight} tonnes

Provide:
1. Predicted emissions for next 3 months
2. Confidence level for predictions
3. Factors that could influence the predictions
4. Recommendations to stay within limits
5. Early warning indicators to watch

Format as a structured forecast with clear monthly predictions and confidence intervals.
`;

  const { text } = await ai.generate(prompt);
  return text;
}

// Generate sustainability report insights
export async function generateReportInsights(reportData: {
  period: string;
  totalEmissions: number;
  emissionsByMode: Record<string, number>;
  goalsProgress: any[];
  complianceStatus: Record<string, any>;
}) {
  const prompt = `
You are a sustainability reporting AI. Generate executive insights for this emissions report:

Reporting Period: ${reportData.period}
Total Emissions: ${reportData.totalEmissions} kg CO2e
Emissions by Mode:
${Object.entries(reportData.emissionsByMode)
  .map(([mode, emissions]) => `- ${mode}: ${emissions} kg CO2e`)
  .join('\n')}

Goals Progress: ${reportData.goalsProgress.length} goals tracked
Compliance Status: ${JSON.stringify(reportData.complianceStatus)}

Generate:
1. Executive Summary (2-3 key points)
2. Performance Highlights
3. Areas of Concern
4. Strategic Recommendations
5. Next Quarter Priorities

Use clear, professional language suitable for executive reporting.
Format as a structured report with clear sections and bullet points.
`;

  const { text } = await ai.generate(prompt);
  return text;
}

// Get personalized tips based on user's emissions pattern
export async function getPersonalizedTips(userData: {
  totalEmissions: number;
  primaryMode: string;
  emissionsVsTarget: number;
  recentTrend: 'increasing' | 'decreasing' | 'stable';
}) {
  const prompt = `
You are a sustainability coach AI. Provide personalized tips for this user:

Total Emissions: ${userData.totalEmissions} kg CO2e
Primary Transport Mode: ${userData.primaryMode}
Emissions vs Target: ${userData.emissionsVsTarget}% ${userData.emissionsVsTarget > 100 ? 'over' : 'under'} target
Recent Trend: ${userData.recentTrend}

Provide:
1. 3-5 immediate actionable tips specific to their situation
2. Long-term strategy recommendations
3. Technology or process improvements to consider
4. Training or resources that could help
5. Success metrics to track

Make recommendations specific, practical, and achievable.
Format as a friendly, actionable list with clear next steps.
`;

  const { text } = await ai.generate(prompt);
  return text;
}
