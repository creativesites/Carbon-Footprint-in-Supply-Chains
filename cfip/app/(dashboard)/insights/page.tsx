'use client';

import { useState } from 'react';

type AnalysisType = 'emissions' | 'optimize' | 'predict' | 'tips';

interface RouteData {
  origin: string;
  destination: string;
  distance: string;
  weight: string;
  currentMode: string;
  currentFuel: string;
  currentEmissions: string;
}

export default function InsightsPage() {
  const [selectedType, setSelectedType] = useState<AnalysisType>('emissions');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [routeData, setRouteData] = useState<RouteData>({
    origin: '',
    destination: '',
    distance: '',
    weight: '',
    currentMode: 'TRUCK',
    currentFuel: 'DIESEL',
    currentEmissions: '',
  });

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysis(null);

    try {
      let requestData = null;

      if (selectedType === 'optimize') {
        requestData = {
          origin: routeData.origin,
          destination: routeData.destination,
          distance: parseFloat(routeData.distance),
          weight: parseFloat(routeData.weight),
          currentMode: routeData.currentMode,
          currentFuel: routeData.currentFuel,
          currentEmissions: parseFloat(routeData.currentEmissions),
        };
      }

      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          data: requestData,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setAnalysis(result.data.analysis);
      } else {
        setAnalysis(`Error: ${result.error}`);
      }
    } catch (error: any) {
      setAnalysis(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const analysisTypes = [
    {
      type: 'emissions' as AnalysisType,
      icon: '📊',
      title: 'Emissions Analysis',
      description: 'Get AI-powered insights on your emissions patterns and trends',
      requiresInput: false,
    },
    {
      type: 'optimize' as AnalysisType,
      icon: '🎯',
      title: 'Route Optimization',
      description: 'Find alternative routes and modes to reduce emissions',
      requiresInput: true,
    },
    {
      type: 'predict' as AnalysisType,
      icon: '🔮',
      title: 'Emissions Forecast',
      description: 'Predict future emissions based on historical patterns',
      requiresInput: false,
    },
    {
      type: 'tips' as AnalysisType,
      icon: '💡',
      title: 'Personalized Tips',
      description: 'Get customized recommendations to reduce your carbon footprint',
      requiresInput: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Insights</h1>
          <p className="text-gray-600">
            Powered by Google Gemini AI - Get intelligent analysis and recommendations
          </p>
        </div>

        {/* Analysis Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {analysisTypes.map((item) => (
            <button
              key={item.type}
              onClick={() => {
                setSelectedType(item.type);
                setAnalysis(null);
              }}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                selectedType === item.type
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-green-300'
              }`}
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </button>
          ))}
        </div>

        {/* Route Optimization Input Form */}
        {selectedType === 'optimize' && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Route Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Origin
                </label>
                <input
                  type="text"
                  value={routeData.origin}
                  onChange={(e) => setRouteData({ ...routeData, origin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Lusaka"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination
                </label>
                <input
                  type="text"
                  value={routeData.destination}
                  onChange={(e) =>
                    setRouteData({ ...routeData, destination: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Dar es Salaam"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance (km)
                </label>
                <input
                  type="number"
                  value={routeData.distance}
                  onChange={(e) => setRouteData({ ...routeData, distance: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 1800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (tonnes)
                </label>
                <input
                  type="number"
                  value={routeData.weight}
                  onChange={(e) => setRouteData({ ...routeData, weight: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Transport Mode
                </label>
                <select
                  value={routeData.currentMode}
                  onChange={(e) =>
                    setRouteData({ ...routeData, currentMode: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="TRUCK">Truck</option>
                  <option value="RAIL">Rail</option>
                  <option value="SHIP">Ship</option>
                  <option value="AIR">Air</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Fuel Type
                </label>
                <select
                  value={routeData.currentFuel}
                  onChange={(e) =>
                    setRouteData({ ...routeData, currentFuel: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="DIESEL">Diesel</option>
                  <option value="PETROL">Petrol</option>
                  <option value="ELECTRIC">Electric</option>
                  <option value="JET_FUEL">Jet Fuel</option>
                  <option value="HEAVY_FUEL_OIL">Heavy Fuel Oil</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Emissions (kg CO2e)
                </label>
                <input
                  type="number"
                  value={routeData.currentEmissions}
                  onChange={(e) =>
                    setRouteData({ ...routeData, currentEmissions: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 5000"
                />
              </div>
            </div>
          </div>
        )}

        {/* Analyze Button */}
        <div className="mb-8 text-center">
          <button
            onClick={handleAnalyze}
            disabled={loading || (selectedType === 'optimize' && !routeData.origin)}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              `🤖 Generate ${analysisTypes.find((t) => t.type === selectedType)?.title}`
            )}
          </button>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">🤖</span>
              <h2 className="text-lg font-semibold">AI Analysis Results</h2>
            </div>

            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {analysis}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Powered by Google Gemini AI - Analysis generated on{' '}
                {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Info Card */}
        {!analysis && !loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <span className="text-2xl mr-3">ℹ️</span>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">How AI Insights Work</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>
                    <strong>Emissions Analysis:</strong> Analyzes your emissions patterns and
                    provides actionable recommendations
                  </li>
                  <li>
                    <strong>Route Optimization:</strong> Suggests alternative transport modes
                    and routes to reduce emissions
                  </li>
                  <li>
                    <strong>Emissions Forecast:</strong> Predicts future emissions based on
                    your historical data
                  </li>
                  <li>
                    <strong>Personalized Tips:</strong> Provides customized advice based on
                    your specific usage patterns
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
