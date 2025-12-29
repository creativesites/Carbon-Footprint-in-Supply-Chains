import { NextRequest } from 'next/server';
import {
  CopilotRuntime,
  GoogleGenerativeAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const copilotKit = new CopilotRuntime({
  actions: [
    {
      name: 'getEmissionsSummary',
      description: 'Get a summary of total emissions and statistics',
      parameters: [],
      handler: async () => {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/dashboard`);
        const data = await response.json();
        return data.data;
      },
    },
    {
      name: 'calculateEmissions',
      description: 'Calculate emissions for a new shipment',
      parameters: [
        { name: 'origin', type: 'string', description: 'Origin location', required: true },
        {
          name: 'destination',
          type: 'string',
          description: 'Destination location',
          required: true,
        },
        { name: 'distance', type: 'number', description: 'Distance in km', required: true },
        { name: 'weight', type: 'number', description: 'Weight in tonnes', required: true },
        {
          name: 'transportMode',
          type: 'string',
          description: 'Transport mode (TRUCK, RAIL, SHIP, AIR)',
          required: true,
        },
        {
          name: 'fuelType',
          type: 'string',
          description: 'Fuel type (DIESEL, PETROL, ELECTRIC, etc.)',
          required: true,
        },
      ],
      handler: async ({ origin, destination, distance, weight, transportMode, fuelType }) => {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/calculate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            origin,
            destination,
            distance,
            weight,
            transportMode,
            fuelType,
          }),
        });
        const data = await response.json();
        return data;
      },
    },
    {
      name: 'getOptimizationSuggestions',
      description: 'Get AI-powered route optimization suggestions',
      parameters: [
        { name: 'origin', type: 'string', description: 'Origin location', required: true },
        {
          name: 'destination',
          type: 'string',
          description: 'Destination location',
          required: true,
        },
        { name: 'distance', type: 'number', description: 'Distance in km', required: true },
        { name: 'weight', type: 'number', description: 'Weight in tonnes', required: true },
        {
          name: 'currentMode',
          type: 'string',
          description: 'Current transport mode',
          required: true,
        },
        {
          name: 'currentFuel',
          type: 'string',
          description: 'Current fuel type',
          required: true,
        },
        {
          name: 'currentEmissions',
          type: 'number',
          description: 'Current emissions in kg CO2e',
          required: true,
        },
      ],
      handler: async ({
        origin,
        destination,
        distance,
        weight,
        currentMode,
        currentFuel,
        currentEmissions,
      }) => {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/ai/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'optimize',
            data: {
              origin,
              destination,
              distance,
              weight,
              currentMode,
              currentFuel,
              currentEmissions,
            },
          }),
        });
        const data = await response.json();
        return data.data.analysis;
      },
    },
    {
      name: 'getPersonalizedTips',
      description: 'Get personalized emissions reduction tips',
      parameters: [],
      handler: async () => {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/ai/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'tips',
          }),
        });
        const data = await response.json();
        return data.data.analysis;
      },
    },
    {
      name: 'getGoalsStatus',
      description: 'Get current emissions goals and compliance status',
      parameters: [],
      handler: async () => {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/goals`);
        const data = await response.json();
        return data.data;
      },
    },
  ],
});

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime: copilotKit,
    serviceAdapter: new GoogleGenerativeAIAdapter({
      model: genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }),
    }),
    endpoint: '/api/copilotkit',
  });

  return handleRequest(req);
};
