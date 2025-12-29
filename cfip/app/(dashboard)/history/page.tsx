'use client';

import { useEffect, useState } from 'react';
import { formatCO2, formatNumber } from '@/lib/utils';

interface Calculation {
  id: string;
  origin: string;
  destination: string;
  distance: number;
  weight: number;
  transportMode: string;
  fuelType: string;
  co2: number;
  ch4: number;
  n2o: number;
  totalCO2e: number;
  scope: string;
  calculatedAt: string;
  weatherFactor: number;
  loadFactor: number;
}

interface HistoryData {
  calculations: Calculation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function HistoryPage() {
  const [data, setData] = useState<HistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedMode, setSelectedMode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (selectedMode) params.append('mode', selectedMode);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await fetch(`/api/history?${params}`);
      const result = await res.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, selectedMode, startDate, endDate]);

  const handleExportCSV = () => {
    if (!data || data.calculations.length === 0) return;

    const headers = [
      'Date',
      'Origin',
      'Destination',
      'Distance (km)',
      'Weight (tonnes)',
      'Transport Mode',
      'Fuel Type',
      'CO2 (kg)',
      'CH4 (kg)',
      'N2O (kg)',
      'Total CO2e (kg)',
      'Scope',
    ];

    const rows = data.calculations.map((calc) => [
      new Date(calc.calculatedAt).toLocaleString(),
      calc.origin,
      calc.destination,
      calc.distance.toString(),
      calc.weight.toString(),
      calc.transportMode,
      calc.fuelType,
      calc.co2.toFixed(2),
      calc.ch4.toFixed(4),
      calc.n2o.toFixed(4),
      calc.totalCO2e.toFixed(2),
      calc.scope,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emissions-history-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

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

  const scopeColors: Record<string, string> = {
    'Scope 1': 'bg-orange-100 text-orange-700',
    'Scope 2': 'bg-yellow-100 text-yellow-700',
    'Scope 3': 'bg-indigo-100 text-indigo-700',
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Calculation History</h1>
              <p className="text-gray-600">View and export your emissions calculations</p>
            </div>
            <button
              onClick={handleExportCSV}
              disabled={!data || data.calculations.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              📥 Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Transport Mode Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transport Mode
              </label>
              <select
                value={selectedMode}
                onChange={(e) => {
                  setSelectedMode(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Modes</option>
                <option value="TRUCK">Truck</option>
                <option value="RAIL">Rail</option>
                <option value="SHIP">Ship</option>
                <option value="AIR">Air</option>
              </select>
            </div>

            {/* Start Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* End Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedMode || startDate || endDate) && (
            <button
              onClick={() => {
                setSelectedMode('');
                setStartDate('');
                setEndDate('');
                setPage(1);
              }}
              className="mt-4 text-sm text-green-600 hover:text-green-700"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Results */}
        {!data || data.calculations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No calculations found</h3>
            <p className="text-gray-600 mb-6">
              {selectedMode || startDate || endDate
                ? 'Try adjusting your filters'
                : 'Start by calculating your first shipment'}
            </p>
            <a
              href="/calculate"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Calculate Emissions
            </a>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm text-gray-600 mb-1">Total Results</p>
                <p className="text-2xl font-bold text-gray-900">{data.pagination.total}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm text-gray-600 mb-1">Total Emissions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCO2(data.calculations.reduce((sum, calc) => sum + calc.totalCO2e, 0))}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm text-gray-600 mb-1">Average per Shipment</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCO2(
                    data.calculations.reduce((sum, calc) => sum + calc.totalCO2e, 0) /
                      data.calculations.length
                  )}
                </p>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Route
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mode
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Distance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Weight
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total CO2e
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Scope
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.calculations.map((calc) => (
                      <tr key={calc.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(calc.calculatedAt).toLocaleDateString()}
                          <br />
                          <span className="text-xs text-gray-500">
                            {new Date(calc.calculatedAt).toLocaleTimeString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium">{calc.origin}</div>
                          <div className="text-gray-500">→ {calc.destination}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              modeColors[calc.transportMode]
                            }`}
                          >
                            {modeEmojis[calc.transportMode]} {calc.transportMode}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">{calc.fuelType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatNumber(calc.distance, 0)} km
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatNumber(calc.weight, 1)} t
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatCO2(calc.totalCO2e)}
                          </div>
                          <div className="text-xs text-gray-500">
                            CO2: {formatNumber(calc.co2)} kg
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              scopeColors[calc.scope]
                            }`}
                          >
                            {calc.scope}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data.pagination.totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing page {data.pagination.page} of {data.pagination.totalPages} (
                      {data.pagination.total} total)
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage(page + 1)}
                        disabled={page === data.pagination.totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
