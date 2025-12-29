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
