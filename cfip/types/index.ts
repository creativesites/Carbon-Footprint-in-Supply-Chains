export type TransportMode = 'TRUCK' | 'RAIL' | 'SHIP' | 'AIR' | 'MULTIMODAL';
export type FuelType = 'DIESEL' | 'ELECTRIC' | 'HYBRID' | 'JET_FUEL' | 'HEAVY_FUEL_OIL' | 'LNG' | 'BIODIESEL';
export type WeatherCondition = 'NORMAL' | 'LIGHT_ADVERSE' | 'HEAVY_ADVERSE' | 'SNOW_ICE' | 'EXTREME';

export interface CalculationFormData {
  origin: string;
  destination: string;
  distance: number;
  weight: number;
  transportMode: TransportMode;
  fuelType: FuelType;
  weatherCondition?: WeatherCondition;
  capacityUtilization?: number;
}

export interface CalculationResult {
  shipmentId: string;
  calculationId: string;
  emissions: {
    co2: number;
    ch4: number;
    n2o: number;
    totalCO2e: number;
  };
  scope: string;
  breakdown: {
    base: number;
    weatherAdjustment: number;
    loadAdjustment: number;
    trafficAdjustment: number;
  };
}
