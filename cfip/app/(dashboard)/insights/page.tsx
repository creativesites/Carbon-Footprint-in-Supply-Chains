'use client';

import { useState } from 'react';
import { EmissionsAnalysisDisplay } from '@/components/analysis/EmissionsAnalysisDisplay';
import { RouteOptimizationDisplay } from '@/components/analysis/RouteOptimizationDisplay';
import { exportAnalysisToPDF } from '@/lib/utils/pdf-export';
import { Download, Save, Loader2 } from 'lucide-react';

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
  const [saving, setSaving] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
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
    setAnalysisResult(null);

    try {
      let requestData = null;
      let apiType = '';

      if (selectedType === 'optimize') {
        apiType = 'ROUTE_OPTIMIZATION';
        requestData = {
          origin: routeData.origin,
          destination: routeData.destination,
          distance: parseFloat(routeData.distance),
          weight: parseFloat(routeData.weight),
          currentMode: routeData.currentMode,
          currentFuel: routeData.currentFuel,
          currentEmissions: parseFloat(routeData.currentEmissions),
        };
      } else if (selectedType === 'emissions') {
        apiType = 'EMISSIONS_ANALYSIS';

        // Fetch actual emissions data from the API
        const dashboardRes = await fetch('/api/dashboard');
        const dashboardData = await dashboardRes.json();

        if (dashboardData.success) {
          const data = dashboardData.data;
          requestData = {
            totalEmissions: data.summary.totalEmissions || 0,
            emissionsByMode: data.emissionsByMode || {},
            countByMode: data.countByMode || {},
            recentCalculations: data.recentCalculations || [],
            trend: data.trend || [],
          };
        } else {
          // Fallback to empty data
          requestData = {
            totalEmissions: 0,
            emissionsByMode: {},
            countByMode: {},
            recentCalculations: [],
            trend: [],
          };
        }
      }

      const res = await fetch('/api/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisType: apiType,
          inputData: requestData,
          generateNew: true,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setAnalysisResult(result.data);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAnalysis = async () => {
    if (!analysisResult) return;

    setSaving(true);
    try {
      const res = await fetch('/api/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisType: selectedType === 'optimize' ? 'ROUTE_OPTIMIZATION' : 'EMISSIONS_ANALYSIS',
          inputData: selectedType === 'optimize' ? routeData : {},
          insights: analysisResult.insights,
          structuredData: analysisResult.structuredData,
          generateNew: false,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert('Analysis saved successfully!');
      }
    } catch (error) {
      alert('Failed to save analysis');
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = () => {
    if (!analysisResult) return;

    exportAnalysisToPDF({
      title: selectedType === 'optimize' ? 'Route Optimization Analysis' : 'Emissions Analysis',
      insights: analysisResult.insights,
      structuredData: analysisResult.structuredData,
      analysisType: selectedType === 'optimize' ? 'ROUTE_OPTIMIZATION' : 'EMISSIONS_ANALYSIS',
      generatedAt: analysisResult.generatedAt ? new Date(analysisResult.generatedAt) : new Date(),
    });
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">AI Insights</h1>
          <p className="text-gray-600 dark:text-gray-400">
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
                setAnalysisResult(null);
              }}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                selectedType === item.type
                  ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-300'
              }`}
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
            </button>
          ))}
        </div>

        {/* Route Optimization Input Form */}
        {selectedType === 'optimize' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Route Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Origin
                </label>
                <input
                  type="text"
                  value={routeData.origin}
                  onChange={(e) => setRouteData({ ...routeData, origin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="e.g., Lusaka"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Destination
                </label>
                <input
                  type="text"
                  value={routeData.destination}
                  onChange={(e) =>
                    setRouteData({ ...routeData, destination: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="e.g., Dar es Salaam"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Distance (km)
                </label>
                <input
                  type="number"
                  value={routeData.distance}
                  onChange={(e) => setRouteData({ ...routeData, distance: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="e.g., 1800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Weight (tonnes)
                </label>
                <input
                  type="number"
                  value={routeData.weight}
                  onChange={(e) => setRouteData({ ...routeData, weight: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="e.g., 20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Transport Mode
                </label>
                <select
                  value={routeData.currentMode}
                  onChange={(e) =>
                    setRouteData({ ...routeData, currentMode: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="TRUCK">Truck</option>
                  <option value="RAIL">Rail</option>
                  <option value="SHIP">Ship</option>
                  <option value="AIR">Air</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Fuel Type
                </label>
                <select
                  value={routeData.currentFuel}
                  onChange={(e) =>
                    setRouteData({ ...routeData, currentFuel: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="DIESEL">Diesel</option>
                  <option value="PETROL">Petrol</option>
                  <option value="ELECTRIC">Electric</option>
                  <option value="JET_FUEL">Jet Fuel</option>
                  <option value="HEAVY_FUEL_OIL">Heavy Fuel Oil</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Emissions (kg CO2e)
                </label>
                <input
                  type="number"
                  value={routeData.currentEmissions}
                  onChange={(e) =>
                    setRouteData({ ...routeData, currentEmissions: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="e.g., 5000"
                />
              </div>
            </div>
          </div>
        )}

        {/* Analyze Button */}
        <div className="mb-8 flex justify-center gap-4">
          <button
            onClick={handleAnalyze}
            disabled={loading || (selectedType === 'optimize' && !routeData.origin)}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              `🤖 Generate ${analysisTypes.find((t) => t.type === selectedType)?.title}`
            )}
          </button>
        </div>

        {/* Analysis Results with Action Buttons */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleSaveAnalysis}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Analysis
                  </>
                )}
              </button>
              <button
                onClick={handleExportPDF}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>

            {/* Display Component Based on Type */}
            {selectedType === 'optimize' ? (
              <RouteOptimizationDisplay data={analysisResult} />
            ) : (
              <EmissionsAnalysisDisplay data={analysisResult} />
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Powered by Google Gemini AI - Analysis generated on{' '}
                {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Info Card */}
        {!analysisResult && !loading && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex items-start">
              <span className="text-2xl mr-3">ℹ️</span>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">How AI Insights Work</h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                  <li>
                    <strong>Emissions Analysis:</strong> Analyzes your emissions patterns and
                    provides actionable recommendations with interactive charts
                  </li>
                  <li>
                    <strong>Route Optimization:</strong> Suggests alternative transport modes
                    and routes to reduce emissions with detailed comparisons
                  </li>
                  <li>
                    <strong>Save & Export:</strong> Save your analysis to review later or export
                    as PDF for reporting purposes
                  </li>
                  <li>
                    <strong>Structured Insights:</strong> Get both detailed markdown analysis and
                    visual data representations
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
