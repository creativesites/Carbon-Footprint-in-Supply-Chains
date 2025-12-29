'use client';

import { useState } from 'react';
import { formatCO2, formatNumber } from '@/lib/utils';
import type { CalculationFormData, CalculationResult } from '@/types';

export default function CalculatePage() {
  const [formData, setFormData] = useState<CalculationFormData>({
    origin: '',
    destination: '',
    distance: 0,
    weight: 0,
    transportMode: 'TRUCK',
    fuelType: 'DIESEL',
    weatherCondition: 'NORMAL',
    capacityUtilization: 100,
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fuelOptions: Record<string, string[]> = {
    TRUCK: ['DIESEL', 'ELECTRIC', 'HYBRID', 'LNG', 'BIODIESEL'],
    RAIL: ['DIESEL', 'ELECTRIC'],
    SHIP: ['HEAVY_FUEL_OIL', 'DIESEL', 'LNG'],
    AIR: ['JET_FUEL'],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate emissions');
      }

      setResult(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      origin: '',
      destination: '',
      distance: 0,
      weight: 0,
      transportMode: 'TRUCK',
      fuelType: 'DIESEL',
      weatherCondition: 'NORMAL',
      capacityUtilization: 100,
    });
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Carbon Footprint Calculator
          </h1>
          <p className="text-gray-600">
            Calculate emissions for your supply chain transportation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Shipment Details</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Origin & Destination */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Origin
                  </label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., New York"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination
                  </label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Los Angeles"
                    required
                  />
                </div>
              </div>

              {/* Distance & Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Distance (km)
                  </label>
                  <input
                    type="number"
                    value={formData.distance || ''}
                    onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="4500"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (tonnes)
                  </label>
                  <input
                    type="number"
                    value={formData.weight || ''}
                    onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="10"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>
              </div>

              {/* Transport Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transport Mode
                </label>
                <select
                  value={formData.transportMode}
                  onChange={(e) => {
                    const mode = e.target.value as any;
                    setFormData({
                      ...formData,
                      transportMode: mode,
                      fuelType: fuelOptions[mode][0] as any,
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="TRUCK">🚛 Truck</option>
                  <option value="RAIL">🚂 Rail</option>
                  <option value="SHIP">🚢 Ship</option>
                  <option value="AIR">✈️ Air</option>
                </select>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Type
                </label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {fuelOptions[formData.transportMode]?.map((fuel) => (
                    <option key={fuel} value={fuel}>
                      {fuel.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Weather Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weather Condition
                </label>
                <select
                  value={formData.weatherCondition}
                  onChange={(e) => setFormData({ ...formData, weatherCondition: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="NORMAL">☀️ Normal</option>
                  <option value="LIGHT_ADVERSE">🌤️ Light Adverse</option>
                  <option value="HEAVY_ADVERSE">🌧️ Heavy Adverse</option>
                  <option value="SNOW_ICE">❄️ Snow/Ice</option>
                  <option value="EXTREME">⚡ Extreme</option>
                </select>
              </div>

              {/* Capacity Utilization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity Utilization ({formData.capacityUtilization}%)
                </label>
                <input
                  type="range"
                  value={formData.capacityUtilization}
                  onChange={(e) => setFormData({ ...formData, capacityUtilization: parseInt(e.target.value) })}
                  className="w-full"
                  min="50"
                  max="100"
                  step="5"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  {loading ? 'Calculating...' : '🔢 Calculate Emissions'}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 font-medium transition-colors"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Results</h2>

            {!result && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p>Fill in the form and click Calculate to see results</p>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                {/* Total Emissions */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                  <div className="text-sm text-gray-600 mb-1">Total CO2 Equivalent</div>
                  <div className="text-4xl font-bold text-green-700">
                    {formatCO2(result.emissions.totalCO2e)}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    {result.scope}
                  </div>
                </div>

                {/* Emission Breakdown */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-xs text-gray-600 mb-1">CO₂</div>
                    <div className="text-lg font-semibold text-blue-700">
                      {formatNumber(result.emissions.co2)} kg
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="text-xs text-gray-600 mb-1">CH₄</div>
                    <div className="text-lg font-semibold text-purple-700">
                      {formatNumber(result.emissions.ch4)} kg
                    </div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="text-xs text-gray-600 mb-1">N₂O</div>
                    <div className="text-lg font-semibold text-orange-700">
                      {formatNumber(result.emissions.n2o)} kg
                    </div>
                  </div>
                </div>

                {/* Adjustments */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Adjustments Applied</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Base Emissions:</span>
                      <span className="font-medium">{formatNumber(result.breakdown.base)} kg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Weather Factor:</span>
                      <span className="font-medium">+{formatNumber(result.breakdown.weatherAdjustment)} kg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Load Factor:</span>
                      <span className="font-medium">+{formatNumber(result.breakdown.loadAdjustment)} kg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Traffic Factor:</span>
                      <span className="font-medium">+{formatNumber(result.breakdown.trafficAdjustment)} kg</span>
                    </div>
                  </div>
                </div>

                {/* Comparisons */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Equivalents</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>🚗 Driving {formatNumber((result.emissions.totalCO2e / 0.12))} km in an average car</div>
                    <div>🌳 Needs {formatNumber((result.emissions.totalCO2e / 21.77))} trees to offset (1 year)</div>
                    <div>💡 Powers {formatNumber((result.emissions.totalCO2e / 0.92) / 24)} homes for a day</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                    📊 View Details
                  </button>
                  <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium">
                    💾 Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
