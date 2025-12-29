# Emission Factors & Calculation Formulas

Reference guide for carbon emission calculations in CFIP

---

## Table of Contents

1. [Calculation Methodology](#calculation-methodology)
2. [Emission Factors by Transport Mode](#emission-factors-by-transport-mode)
3. [Adjustment Factors](#adjustment-factors)
4. [Conversion Factors](#conversion-factors)
5. [Data Sources](#data-sources)
6. [Example Calculations](#example-calculations)

---

## Calculation Methodology

### Base Formula

```
Total Emissions (kg CO2e) = Distance × Weight × Emission Factor × (1 + Adjustment Factor)
```

Where:
- **Distance** = Transport distance in kilometers
- **Weight** = Cargo weight in metric tonnes
- **Emission Factor** = kg CO2e per tonne-kilometer (varies by mode and fuel)
- **Adjustment Factor** = Sum of weather, load, and traffic factors

### Detailed Formula

```
Total CO2e = Base CO2 + CH4 (as CO2e) + N2O (as CO2e)

Where:
  Base CO2 = Distance × Weight × CO2 Factor
  CH4 (as CO2e) = Distance × Weight × CH4 Factor × 28 (GWP of CH4)
  N2O (as CO2e) = Distance × Weight × N2O Factor × 265 (GWP of N2O)
```

**GWP = Global Warming Potential** (100-year timescale)
- CO2 = 1
- CH4 (Methane) = 28
- N2O (Nitrous Oxide) = 265

---

## Emission Factors by Transport Mode

### Road Transport (Trucks)

| Fuel Type | CO2 Factor<br>(kg/tonne-km) | CH4 Factor<br>(g/tonne-km) | N2O Factor<br>(g/tonne-km) | Notes |
|-----------|----------------------------|---------------------------|---------------------------|-------|
| **Diesel** | 0.0970 | 0.0015 | 0.0032 | Most common; heavy-duty trucks |
| **Electric** | 0.0150 | 0.0000 | 0.0000 | Depends on electricity grid mix |
| **Hybrid (Diesel-Electric)** | 0.0580 | 0.0008 | 0.0016 | ~40% reduction vs diesel |
| **LNG (Liquefied Natural Gas)** | 0.0850 | 0.0020 | 0.0010 | Cleaner than diesel |
| **Biodiesel (B20)** | 0.0820 | 0.0012 | 0.0025 | 20% biodiesel blend |

**Vehicle Types:**
- Light-duty truck (< 3.5 tonnes): Use 70% of factors above
- Medium-duty truck (3.5-12 tonnes): Use 100% of factors above
- Heavy-duty truck (> 12 tonnes): Use 130% of factors above

### Rail Transport

| Fuel Type | CO2 Factor<br>(kg/tonne-km) | CH4 Factor<br>(g/tonne-km) | N2O Factor<br>(g/tonne-km) | Notes |
|-----------|----------------------------|---------------------------|---------------------------|-------|
| **Diesel** | 0.0300 | 0.0008 | 0.0015 | Freight rail |
| **Electric** | 0.0080 | 0.0000 | 0.0000 | Most efficient mode |

**Advantages:**
- 70% lower emissions than truck (diesel vs diesel)
- 90% lower emissions than truck (electric vs diesel)

### Maritime Transport (Ships)

| Fuel Type | CO2 Factor<br>(kg/tonne-km) | CH4 Factor<br>(g/tonne-km) | N2O Factor<br>(g/tonne-km) | Notes |
|-----------|----------------------------|---------------------------|---------------------------|-------|
| **Heavy Fuel Oil (HFO)** | 0.0150 | 0.0005 | 0.0008 | Traditional ship fuel |
| **Marine Diesel Oil (MDO)** | 0.0140 | 0.0004 | 0.0007 | Cleaner alternative |
| **LNG** | 0.0120 | 0.0015 | 0.0003 | Growing adoption |

**Ship Types:**
- Container ship (large): Use 80% of factors above
- Bulk carrier: Use 100% of factors above
- Tanker: Use 110% of factors above

### Air Transport

| Fuel Type | CO2 Factor<br>(kg/tonne-km) | CH4 Factor<br>(g/tonne-km) | N2O Factor<br>(g/tonne-km) | Notes |
|-----------|----------------------------|---------------------------|---------------------------|-------|
| **Jet Fuel (Kerosene)** | 0.5000 | 0.0020 | 0.0100 | Most emissions-intensive |
| **Sustainable Aviation Fuel (SAF)** | 0.4000 | 0.0015 | 0.0080 | 20% reduction vs jet fuel |

**Radiative Forcing Multiplier:**
Air transport has additional climate impact beyond CO2. Apply multiplier of **2.0** for high-altitude emissions (non-CO2 effects like contrails, NOx).

**Adjusted formula for air:**
```
Total Emissions (air) = Base Emissions × 2.0
```

---

## Adjustment Factors

### Weather Factor

Adverse weather increases fuel consumption:

| Weather Condition | Adjustment Factor | Notes |
|------------------|------------------|-------|
| Normal/Clear | 0.00 | No adjustment |
| Light rain/wind | +0.03 | +3% fuel consumption |
| Heavy rain/wind | +0.05 | +5% fuel consumption |
| Snow/ice | +0.10 | +10% fuel consumption |
| Extreme conditions | +0.15 | +15% fuel consumption |

**Implementation:**
```typescript
function getWeatherFactor(condition: WeatherCondition): number {
  const factors = {
    NORMAL: 0.00,
    LIGHT_ADVERSE: 0.03,
    HEAVY_ADVERSE: 0.05,
    SNOW_ICE: 0.10,
    EXTREME: 0.15,
  };
  return factors[condition];
}
```

### Load Factor

Partial loads reduce efficiency (empty return trips, under-capacity):

| Capacity Utilization | Adjustment Factor | Notes |
|---------------------|------------------|-------|
| 90-100% | 0.00 | Optimal efficiency |
| 80-89% | +0.05 | Slight inefficiency |
| 70-79% | +0.10 | Moderate inefficiency |
| 60-69% | +0.15 | Significant inefficiency |
| 50-59% | +0.20 | High inefficiency |
| < 50% | +0.30 | Very high inefficiency |

**Formula:**
```typescript
function getLoadFactor(capacityPercent: number): number {
  if (capacityPercent >= 90) return 0.00;
  if (capacityPercent >= 80) return 0.05;
  if (capacityPercent >= 70) return 0.10;
  if (capacityPercent >= 60) return 0.15;
  if (capacityPercent >= 50) return 0.20;
  return 0.30;
}
```

**Calculation:**
```
Capacity Utilization (%) = (Actual Weight / Vehicle Capacity) × 100
```

### Traffic Factor

Traffic congestion increases emissions through idling and stop-and-go:

| Traffic Condition | Adjustment Factor | Time of Day | Notes |
|------------------|------------------|-------------|-------|
| Free flow | 0.00 | 10 PM - 6 AM | Optimal speed |
| Light traffic | +0.05 | 9 AM - 3 PM | Minimal delays |
| Moderate traffic | +0.10 | 6-9 AM, 3-6 PM | Some delays |
| Heavy traffic | +0.15 | Peak hours | Significant delays |
| Severe congestion | +0.25 | Special events | Stop-and-go |

**Implementation:**
```typescript
function getTrafficFactor(hour: number, dayOfWeek: number): number {
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

  if (!isWeekday) return 0.05; // Weekend traffic

  if (hour >= 22 || hour < 6) return 0.00; // Night
  if ((hour >= 6 && hour < 9) || (hour >= 15 && hour < 18)) return 0.15; // Peak
  if (hour >= 9 && hour < 15) return 0.05; // Midday
  return 0.10; // Evening
}
```

### Combined Adjustment Example

```
Total Adjustment = Weather Factor + Load Factor + Traffic Factor

Example:
  Weather: Light rain = +0.03
  Load: 75% capacity = +0.10
  Traffic: Peak hour = +0.15
  Total Adjustment = 0.28 (28% increase)

Final Emissions = Base Emissions × (1 + 0.28) = Base Emissions × 1.28
```

---

## Conversion Factors

### Distance Conversions

```
1 kilometer (km) = 0.621371 miles (mi)
1 mile (mi) = 1.60934 kilometers (km)

1 nautical mile (nmi) = 1.852 kilometers (km)
```

### Weight Conversions

```
1 metric tonne = 1,000 kilograms (kg)
1 metric tonne = 2,204.62 pounds (lbs)
1 metric tonne = 1.10231 short tons (US tons)

1 kilogram (kg) = 2.20462 pounds (lbs)
1 pound (lb) = 0.453592 kilograms (kg)
```

### Volume to Weight Conversions (Freight)

For volumetric weight calculations:

```
Volumetric Weight (kg) = (Length × Width × Height in cm) / 5000

If Volumetric Weight > Actual Weight:
  Chargeable Weight = Volumetric Weight
Else:
  Chargeable Weight = Actual Weight
```

### CO2 Equivalents

```
1 kg CH4 = 28 kg CO2e
1 kg N2O = 265 kg CO2e
1 kg HFC-134a = 1,300 kg CO2e
1 kg SF6 = 23,500 kg CO2e
```

---

## Data Sources

### Primary Sources

1. **EPA (United States Environmental Protection Agency)**
   - [GHG Emission Factors Hub](https://www.epa.gov/climateleadership/ghg-emission-factors-hub)
   - Updated annually
   - Focus: US-based transport emissions

2. **IPCC (Intergovernmental Panel on Climate Change)**
   - [IPCC Guidelines for National GHG Inventories](https://www.ipcc-nggip.iges.or.jp/)
   - Global standard
   - Focus: International emissions methodology

3. **DEFRA (UK Department for Environment, Food & Rural Affairs)**
   - [Government Conversion Factors for Company Reporting](https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting)
   - Updated annually
   - Focus: UK and international transport

4. **GHG Protocol**
   - [Corporate Value Chain (Scope 3) Standard](https://ghgprotocol.org/standards/scope-3-standard)
   - Industry standard
   - Focus: Supply chain emissions

### Regional Factors

Different regions may have different emission factors due to:
- Electricity grid mix (for electric vehicles)
- Fuel quality standards
- Vehicle efficiency regulations
- Infrastructure quality

**Example: Electric Vehicle Emissions by Region**

| Region | Grid CO2 Factor<br>(kg/kWh) | EV Emission Factor<br>(kg/tonne-km) |
|--------|----------------------------|-------------------------------------|
| **Global Average** | 0.475 | 0.0150 |
| **Norway** (hydro) | 0.020 | 0.0006 |
| **France** (nuclear) | 0.060 | 0.0019 |
| **Germany** | 0.400 | 0.0126 |
| **China** | 0.600 | 0.0189 |
| **India** | 0.700 | 0.0221 |
| **USA** | 0.450 | 0.0142 |

---

## Example Calculations

### Example 1: Basic Truck Shipment

**Scenario:**
- Origin: New York
- Destination: Chicago
- Distance: 1,270 km
- Weight: 15 tonnes
- Mode: Truck (diesel)
- Weather: Normal
- Load: 85% capacity
- Traffic: Midday (light)

**Calculation:**

1. **Get emission factor:** 0.0970 kg CO2/tonne-km (truck diesel)

2. **Calculate base emissions:**
   ```
   Base = 1,270 km × 15 tonnes × 0.0970 kg/tonne-km
   Base = 1,847.55 kg CO2
   ```

3. **Calculate adjustments:**
   ```
   Weather: 0.00 (normal)
   Load: 0.05 (85% capacity)
   Traffic: 0.05 (light traffic)
   Total Adjustment: 0.10
   ```

4. **Calculate total emissions:**
   ```
   Total = 1,847.55 × (1 + 0.10)
   Total = 2,032.31 kg CO2e
   ```

**Result:** 2,032 kg CO2e (2.03 tonnes)

---

### Example 2: Air Freight

**Scenario:**
- Origin: London
- Destination: New York
- Distance: 5,585 km
- Weight: 2 tonnes
- Mode: Air (jet fuel)
- Weather: Normal
- Load: 70% capacity
- Traffic: N/A (air)

**Calculation:**

1. **Get emission factor:** 0.5000 kg CO2/tonne-km (jet fuel)

2. **Calculate base emissions:**
   ```
   Base = 5,585 km × 2 tonnes × 0.5000 kg/tonne-km
   Base = 5,585 kg CO2
   ```

3. **Apply radiative forcing multiplier:**
   ```
   Adjusted = 5,585 × 2.0 (high-altitude effects)
   Adjusted = 11,170 kg CO2e
   ```

4. **Calculate adjustments:**
   ```
   Weather: 0.00
   Load: 0.10 (70% capacity)
   Traffic: 0.00 (not applicable for air)
   Total Adjustment: 0.10
   ```

5. **Calculate total emissions:**
   ```
   Total = 11,170 × (1 + 0.10)
   Total = 12,287 kg CO2e
   ```

**Result:** 12,287 kg CO2e (12.3 tonnes)

**Note:** Air freight is 6x more carbon-intensive than truck!

---

### Example 3: Multimodal Shipment

**Scenario:**
- Leg 1: Factory to port (truck, 100 km, 20 tonnes)
- Leg 2: Sea freight (ship, 8,000 km, 20 tonnes)
- Leg 3: Port to warehouse (rail, 300 km, 20 tonnes)

**Calculation:**

**Leg 1 (Truck - Diesel):**
```
Emissions = 100 km × 20 tonnes × 0.0970 kg/tonne-km × 1.0
Emissions = 194 kg CO2e
```

**Leg 2 (Ship - Heavy Fuel Oil):**
```
Emissions = 8,000 km × 20 tonnes × 0.0150 kg/tonne-km × 1.0
Emissions = 2,400 kg CO2e
```

**Leg 3 (Rail - Electric):**
```
Emissions = 300 km × 20 tonnes × 0.0080 kg/tonne-km × 1.0
Emissions = 48 kg CO2e
```

**Total Multimodal Emissions:**
```
Total = 194 + 2,400 + 48
Total = 2,642 kg CO2e
```

**Breakdown:**
- Truck: 7.3%
- Ship: 90.8%
- Rail: 1.8%

---

### Example 4: Optimization Comparison

**Original Plan:**
- Mode: Truck (diesel)
- Distance: 2,000 km
- Weight: 25 tonnes
- Emissions: 2,000 × 25 × 0.0970 = 4,850 kg CO2e

**Alternative 1: Electric Truck**
- Mode: Truck (electric)
- Emissions: 2,000 × 25 × 0.0150 = 750 kg CO2e
- **Savings: 4,100 kg (84.5%)**

**Alternative 2: Rail (Electric)**
- Mode: Rail (electric)
- Emissions: 2,000 × 25 × 0.0080 = 400 kg CO2e
- **Savings: 4,450 kg (91.8%)**

**Alternative 3: Rail (Diesel)**
- Mode: Rail (diesel)
- Emissions: 2,000 × 25 × 0.0300 = 1,500 kg CO2e
- **Savings: 3,350 kg (69.1%)**

**Recommendation:** Switch to electric rail for maximum emissions reduction.

---

## Implementation in Code

### TypeScript Implementation

```typescript
// types/emissions.ts
export interface EmissionFactors {
  transportMode: TransportMode;
  fuelType: FuelType;
  co2Factor: number; // kg CO2 per tonne-km
  ch4Factor: number; // g CH4 per tonne-km
  n2oFactor: number; // g N2O per tonne-km
  region: string;
}

export interface CalculationParams {
  distance: number; // km
  weight: number; // tonnes
  transportMode: TransportMode;
  fuelType: FuelType;
  weatherCondition?: WeatherCondition;
  capacityUtilization?: number; // percentage
  departureTime?: Date;
}

export interface EmissionResult {
  co2: number; // kg
  ch4: number; // kg
  n2o: number; // kg
  totalCO2e: number; // kg
  scope: EmissionScope;
  breakdown: {
    base: number;
    weatherAdjustment: number;
    loadAdjustment: number;
    trafficAdjustment: number;
  };
}

// lib/calculations/carbon.ts
import { prisma } from '@/lib/db/prisma';
import type { EmissionFactors, CalculationParams, EmissionResult } from '@/types/emissions';

const GWP_CH4 = 28;
const GWP_N2O = 265;

export async function calculateEmissions(
  params: CalculationParams
): Promise<EmissionResult> {
  // 1. Get emission factors
  const factors = await getEmissionFactor(
    params.transportMode,
    params.fuelType
  );

  // 2. Calculate base emissions
  const baseCO2 = params.distance * params.weight * factors.co2Factor;
  const baseCH4 = params.distance * params.weight * (factors.ch4Factor / 1000); // Convert g to kg
  const baseN2O = params.distance * params.weight * (factors.n2oFactor / 1000);

  // 3. Calculate adjustment factors
  const weatherFactor = getWeatherFactor(params.weatherCondition || 'NORMAL');
  const loadFactor = getLoadFactor(params.capacityUtilization || 100);
  const trafficFactor = params.departureTime
    ? getTrafficFactor(params.departureTime.getHours(), params.departureTime.getDay())
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
  const finalTotal = params.transportMode === 'AIR'
    ? totalCO2e * 2.0
    : totalCO2e;

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
  };
}

async function getEmissionFactor(
  mode: TransportMode,
  fuel: FuelType,
  region: string = 'GLOBAL'
): Promise<EmissionFactors> {
  const factor = await prisma.emissionFactor.findUnique({
    where: {
      transportMode_fuelType_region: {
        transportMode: mode,
        fuelType: fuel,
        region: region,
      },
    },
  });

  if (!factor) {
    throw new Error(`Emission factor not found for ${mode} - ${fuel} - ${region}`);
  }

  return factor;
}

function getWeatherFactor(condition: WeatherCondition): number {
  const factors: Record<WeatherCondition, number> = {
    NORMAL: 0.00,
    LIGHT_ADVERSE: 0.03,
    HEAVY_ADVERSE: 0.05,
    SNOW_ICE: 0.10,
    EXTREME: 0.15,
  };
  return factors[condition];
}

function getLoadFactor(capacityPercent: number): number {
  if (capacityPercent >= 90) return 0.00;
  if (capacityPercent >= 80) return 0.05;
  if (capacityPercent >= 70) return 0.10;
  if (capacityPercent >= 60) return 0.15;
  if (capacityPercent >= 50) return 0.20;
  return 0.30;
}

function getTrafficFactor(hour: number, dayOfWeek: number): number {
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

  if (!isWeekday) return 0.05;
  if (hour >= 22 || hour < 6) return 0.00;
  if ((hour >= 6 && hour < 9) || (hour >= 15 && hour < 18)) return 0.15;
  if (hour >= 9 && hour < 15) return 0.05;
  return 0.10;
}

function determineScope(mode: TransportMode): EmissionScope {
  // Simplified - in reality, scope depends on organizational boundaries
  return 'SCOPE_3'; // Most supply chain transport is Scope 3
}
```

### Database Seed Data

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedEmissionFactors() {
  const factors = [
    // Road - Diesel
    {
      transportMode: 'TRUCK',
      fuelType: 'DIESEL',
      region: 'GLOBAL',
      co2Factor: 0.0970,
      ch4Factor: 1.5,
      n2oFactor: 3.2,
      source: 'EPA',
      year: 2024,
    },
    // Road - Electric
    {
      transportMode: 'TRUCK',
      fuelType: 'ELECTRIC',
      region: 'GLOBAL',
      co2Factor: 0.0150,
      ch4Factor: 0.0,
      n2oFactor: 0.0,
      source: 'EPA',
      year: 2024,
    },
    // Rail - Diesel
    {
      transportMode: 'RAIL',
      fuelType: 'DIESEL',
      region: 'GLOBAL',
      co2Factor: 0.0300,
      ch4Factor: 0.8,
      n2oFactor: 1.5,
      source: 'IPCC',
      year: 2024,
    },
    // Rail - Electric
    {
      transportMode: 'RAIL',
      fuelType: 'ELECTRIC',
      region: 'GLOBAL',
      co2Factor: 0.0080,
      ch4Factor: 0.0,
      n2oFactor: 0.0,
      source: 'IPCC',
      year: 2024,
    },
    // Ship - Heavy Fuel Oil
    {
      transportMode: 'SHIP',
      fuelType: 'HEAVY_FUEL_OIL',
      region: 'GLOBAL',
      co2Factor: 0.0150,
      ch4Factor: 0.5,
      n2oFactor: 0.8,
      source: 'IMO',
      year: 2024,
    },
    // Air - Jet Fuel
    {
      transportMode: 'AIR',
      fuelType: 'JET_FUEL',
      region: 'GLOBAL',
      co2Factor: 0.5000,
      ch4Factor: 2.0,
      n2oFactor: 10.0,
      source: 'ICAO',
      year: 2024,
    },
  ];

  for (const factor of factors) {
    await prisma.emissionFactor.upsert({
      where: {
        transportMode_fuelType_region: {
          transportMode: factor.transportMode,
          fuelType: factor.fuelType,
          region: factor.region,
        },
      },
      update: factor,
      create: factor,
    });
  }

  console.log('✅ Emission factors seeded successfully');
}

seedEmissionFactors()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## References

1. EPA (2024). *Emission Factors for Greenhouse Gas Inventories*. United States Environmental Protection Agency.

2. IPCC (2006, updated 2019). *IPCC Guidelines for National Greenhouse Gas Inventories*. Intergovernmental Panel on Climate Change.

3. DEFRA (2024). *Government GHG Conversion Factors for Company Reporting*. UK Department for Environment, Food & Rural Affairs.

4. GHG Protocol (2011). *Corporate Value Chain (Scope 3) Accounting and Reporting Standard*. World Resources Institute.

5. IMO (2020). *Fourth IMO GHG Study*. International Maritime Organization.

6. ICAO (2018). *ICAO Carbon Emissions Calculator Methodology*. International Civil Aviation Organization.

---

**Last Updated:** December 2025
**Version:** 1.0
