'use client';

import { useEffect, useState } from 'react';
import { formatCO2, formatNumber } from '@/lib/utils';
import { useCopilotReadable, useCopilotAction } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';

interface DashboardData {
  summary: {
    totalEmissions: number;
    totalCalculations: number;
    averageEmissions: number;
    monthlyChange: number;
  };
  emissionsByMode: Record<string, number>;
  recentCalculations: Array<{
    id: string;
    origin: string;
    destination: string;
    emissions: number;
    mode: string;
    date: string;
  }>;
  trend: Array<{
    date: string;
    emissions: number;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = () => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setData(result.data);
        }
      })
      .catch((error) => console.error('Error fetching dashboard:', error))
      .finally(() => setLoading(false));
  };

  // Make dashboard data readable to Copilot
  useCopilotReadable({
    description: 'Current dashboard emissions data and statistics',
    value: data || {},
  });

  // Add Copilot action to refresh dashboard
  useCopilotAction({
    name: 'refreshDashboard',
    description: 'Refresh the dashboard data to get the latest emissions statistics',
    handler: async () => {
      setLoading(true);
      fetchDashboard();
      return 'Dashboard refreshed successfully';
    },
  });

  // Add Copilot action to navigate to calculator
  useCopilotAction({
    name: 'goToCalculator',
    description: 'Navigate to the emissions calculator page',
    handler: async () => {
      window.location.href = '/calculate';
      return 'Navigating to calculator...';
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  const modeEmojis: Record<string, string> = {
    TRUCK: '🚛',
    RAIL: '🚂',
    SHIP: '🚢',
    AIR: '✈️',
  };

  const modeColors: Record<string, string> = {
    TRUCK: 'bg-blue-100 text-blue-700',
    RAIL: 'bg-green-100 text-green-700',
    SHIP: 'bg-purple-100 text-purple-700',
    AIR: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Overview of your carbon footprint analytics</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Emissions */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Emissions</h3>
              <span className="text-2xl">🌍</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCO2(data.summary.totalEmissions)}
            </div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>

          {/* Total Calculations */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Calculations</h3>
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(data.summary.totalCalculations, 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total shipments</p>
          </div>

          {/* Average Emissions */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Average per Shipment</h3>
              <span className="text-2xl">📈</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCO2(data.summary.averageEmissions)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Per calculation</p>
          </div>

          {/* Monthly Change */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Monthly Change</h3>
              <span className="text-2xl">📉</span>
            </div>
            <div className={`text-2xl font-bold ${data.summary.monthlyChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {data.summary.monthlyChange > 0 ? '+' : ''}{formatNumber(data.summary.monthlyChange)}%
            </div>
            <p className="text-xs text-gray-500 mt-1">vs last month</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Emissions by Transport Mode */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Emissions by Transport Mode</h2>

            {Object.keys(data.emissionsByMode).length === 0 ? (
              <p className="text-gray-500 text-center py-8">No data available</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(data.emissionsByMode)
                  .sort(([, a], [, b]) => b - a)
                  .map(([mode, emissions]) => {
                    const percentage = (emissions / data.summary.totalEmissions) * 100;
                    return (
                      <div key={mode}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="mr-2">{modeEmojis[mode]}</span>
                            <span className="text-sm font-medium text-gray-700">{mode}</span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {formatCO2(emissions)} ({formatNumber(percentage)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Recent Calculations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Calculations</h2>

            {data.recentCalculations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No calculations yet</p>
                <a
                  href="/calculate"
                  className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Calculate Now
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {data.recentCalculations.map((calc) => (
                  <div
                    key={calc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${modeColors[calc.mode]}`}>
                          {modeEmojis[calc.mode]} {calc.mode}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {calc.origin} → {calc.destination}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(calc.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCO2(calc.emissions)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Emissions Trend */}
        {data.trend.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Emissions Trend (Last 30 Days)</h2>
            <div className="h-64 flex items-end justify-between gap-2">
              {data.trend.map((point, index) => {
                const maxEmissions = Math.max(...data.trend.map(p => p.emissions));
                const height = maxEmissions > 0 ? (point.emissions / maxEmissions) * 100 : 0;

                return (
                  <div key={point.date} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors cursor-pointer"
                      style={{ height: `${height}%`, minHeight: '4px' }}
                      title={`${point.date}: ${formatCO2(point.emissions)}`}
                    ></div>
                    {index % 3 === 0 && (
                      <span className="text-xs text-gray-500 mt-2 rotate-45 origin-left">
                        {new Date(point.date).getDate()}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/calculate"
            className="block p-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
          >
            <div className="text-3xl mb-2">🔢</div>
            <h3 className="font-semibold">New Calculation</h3>
            <p className="text-sm opacity-90 mt-1">Calculate emissions for a shipment</p>
          </a>

          <a
            href="/goals"
            className="block p-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold">Set Goals</h3>
            <p className="text-sm opacity-90 mt-1">Track your sustainability targets</p>
          </a>

          <a
            href="/reports"
            className="block p-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center"
          >
            <div className="text-3xl mb-2">📄</div>
            <h3 className="font-semibold">Generate Report</h3>
            <p className="text-sm opacity-90 mt-1">Create detailed emissions reports</p>
          </a>
        </div>
      </div>

      {/* CopilotKit Sidebar */}
      <CopilotSidebar
        defaultOpen={false}
        labels={{
          title: "Dashboard Assistant",
          initial: "Hi! I'm your AI assistant. I can help you:\n\n• Analyze your emissions data\n• Get optimization suggestions\n• Answer questions about your dashboard\n• Navigate to different pages\n• Generate reports\n\nHow can I help you today?",
        }}
        clickOutsideToClose={false}
      />
    </div>
  );
}
