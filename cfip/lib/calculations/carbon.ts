import { prisma } from '@/lib/db/prisma';

// Global Warming Potentials (100-year timescale)
const GWP_CH4 = 28;
const GWP_N2O = 265;

export interface CalculationParams {
  distance: number; // km
  weight: number; // tonnes
  transportMode: string;
  fuelType: string;
  weatherCondition?: string;
  capacityUtilization?: number; // percentage
  departureHour?: number;
  dayOfWeek?: number;
}

export interface EmissionResult {
  co2: number;
  ch4: number;
  n2o: number;
  totalCO2e: number;
  scope: string;
  breakdown: {
    base: number;
    weatherAdjustment: number;
    loadAdjustment: number;
    trafficAdjustment: number;
  };
  emissionFactor: number;
}

export async function calculateEmissions(
  params: CalculationParams
): Promise<EmissionResult> {
  // 1. Get emission factors from database
  const emissionFactor = await prisma.emissionFactor.findUnique({
    where: {
      transportMode_fuelType_region: {
        transportMode: params.transportMode,
        fuelType: params.fuelType,
        region: 'GLOBAL',
      },
    },
  });

  if (!emissionFactor) {
    throw new Error(
      `Emission factor not found for ${params.transportMode} - ${params.fuelType}`
    );
  }

  // 2. Calculate base emissions
  const baseCO2 = params.distance * params.weight * emissionFactor.co2Factor;
  const baseCH4 =
    params.distance * params.weight * ((emissionFactor.ch4Factor || 0) / 1000); // Convert g to kg
  const baseN2O =
    params.distance * params.weight * ((emissionFactor.n2oFactor || 0) / 1000);

  // 3. Calculate adjustment factors
  const weatherFactor = getWeatherFactor(params.weatherCondition || 'NORMAL');
  const loadFactor = getLoadFactor(params.capacityUtilization || 100);
  const trafficFactor =
    params.departureHour !== undefined && params.dayOfWeek !== undefined
      ? getTrafficFactor(params.departureHour, params.dayOfWeek)
      : 0;

  const totalAdjustment = weatherFactor + loadFactor + trafficFactor;

  // 4. Apply adjustments
  const adjustedCO2 = baseCO2 * (1 + totalAdjustment);
  const adjustedCH4 = baseCH4 * (1 + totalAdjustment);
  const adjustedN2O = baseN2O * (1 + totalAdjustment);

  // 5. Convert to CO2 equivalents
  const ch4CO2e = adjustedCH4 * GWP_CH4;
  const n2oCO2e = adjustedN2O * GWP_N2O;
  const totalCO2e = adjustedCO2 + ch4CO2e + n2oCO2e;

  // 6. Apply radiative forcing for air transport
  const finalTotal =
    params.transportMode === 'AIR' ? totalCO2e * 2.0 : totalCO2e;

  return {
    co2: adjustedCO2,
    ch4: adjustedCH4,
    n2o: adjustedN2O,
    totalCO2e: finalTotal,
    scope: determineScope(params.transportMode),
    breakdown: {
      base: baseCO2,
      weatherAdjustment: baseCO2 * weatherFactor,
      loadAdjustment: baseCO2 * loadFactor,
      trafficAdjustment: baseCO2 * trafficFactor,
    },
    emissionFactor: emissionFactor.co2Factor,
  };
}

function getWeatherFactor(condition: string): number {
  const factors: Record<string, number> = {
    NORMAL: 0.0,
    LIGHT_ADVERSE: 0.03,
    HEAVY_ADVERSE: 0.05,
    SNOW_ICE: 0.1,
    EXTREME: 0.15,
  };
  return factors[condition] || 0.0;
}

function getLoadFactor(capacityPercent: number): number {
  if (capacityPercent >= 90) return 0.0;
  if (capacityPercent >= 80) return 0.05;
  if (capacityPercent >= 70) return 0.1;
  if (capacityPercent >= 60) return 0.15;
  if (capacityPercent >= 50) return 0.2;
  return 0.3;
}

function getTrafficFactor(hour: number, dayOfWeek: number): number {
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

  if (!isWeekday) return 0.05; // Weekend
  if (hour >= 22 || hour < 6) return 0.0; // Night
  if ((hour >= 6 && hour < 9) || (hour >= 15 && hour < 18)) return 0.15; // Peak
  if (hour >= 9 && hour < 15) return 0.05; // Midday
  return 0.1; // Evening
}

function determineScope(transportMode: string): string {
  // Simplified - in reality, scope depends on organizational boundaries
  return 'SCOPE_3'; // Most supply chain transport is Scope 3
}
