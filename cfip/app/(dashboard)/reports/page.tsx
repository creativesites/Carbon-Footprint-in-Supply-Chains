'use client';

import { useEffect, useState } from 'react';
import { formatCO2, formatNumber } from '@/lib/utils';

interface SavedReport {
  id: string;
  title: string;
  reportType: string;
  startDate: string;
  endDate: string;
  generatedAt: string;
  generatedBy: string;
}

interface ReportData {
  reportId: string;
  report: {
    id: string;
    title: string;
    reportType: string;
    startDate: string;
    endDate: string;
    summary: {
      totalEmissions: number;
      totalCO2: number;
      totalCH4: number;
      totalN2O: number;
      totalCalculations: number;
      totalDistance: number;
      totalWeight: number;
      averageEmissionsPerShipment: number;
    };
    emissionsByMode: Record<string, number>;
    countByMode: Record<string, number>;
    emissionsByScope: Record<string, number>;
    emissionsByFuel: Record<string, number>;
    monthlyData: Record<string, number>;
    aiInsights: string | null;
    generatedAt: string;
  };
}

export default function ReportsPage() {
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<ReportData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reportType: 'MONTHLY',
    startDate: '',
    endDate: '',
    includeAI: true,
  });

  useEffect(() => {
    fetchSavedReports();
  }, []);

  const fetchSavedReports = async () => {
    try {
      const res = await fetch('/api/reports');
      const result = await res.json();
      if (result.success) {
        setSavedReports(result.data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        setGeneratedReport(result.data);
        setShowForm(false);
        fetchSavedReports();
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!generatedReport) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${generatedReport.report.title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #059669; }
            h2 { color: #047857; margin-top: 24px; }
            table { width: 100%; border-collapse: collapse; margin: 16px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; }
            .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0; }
            .summary-card { border: 1px solid #ddd; padding: 16px; }
          </style>
        </head>
        <body>
          <h1>${generatedReport.report.title}</h1>
          <p><strong>Period:</strong> ${new Date(generatedReport.report.startDate).toLocaleDateString()} - ${new Date(generatedReport.report.endDate).toLocaleDateString()}</p>
          <p><strong>Generated:</strong> ${new Date(generatedReport.report.generatedAt).toLocaleString()}</p>

          <h2>Executive Summary</h2>
          <div class="summary-grid">
            <div class="summary-card">
              <strong>Total Emissions:</strong> ${formatCO2(generatedReport.report.summary.totalEmissions)}
            </div>
            <div class="summary-card">
              <strong>Total Shipments:</strong> ${generatedReport.report.summary.totalCalculations}
            </div>
            <div class="summary-card">
              <strong>Total Distance:</strong> ${formatNumber(generatedReport.report.summary.totalDistance, 0)} km
            </div>
            <div class="summary-card">
              <strong>Average per Shipment:</strong> ${formatCO2(generatedReport.report.summary.averageEmissionsPerShipment)}
            </div>
          </div>

          <h2>Emissions by Transport Mode</h2>
          <table>
            <thead>
              <tr>
                <th>Transport Mode</th>
                <th>Shipments</th>
                <th>Total Emissions</th>
                <th>% of Total</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(generatedReport.report.emissionsByMode)
                .sort((a, b) => b[1] - a[1])
                .map(
                  ([mode, emissions]) => `
                <tr>
                  <td>${mode}</td>
                  <td>${generatedReport.report.countByMode[mode]}</td>
                  <td>${formatCO2(emissions)}</td>
                  <td>${formatNumber((emissions / generatedReport.report.summary.totalEmissions) * 100, 1)}%</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          ${
            generatedReport.report.aiInsights
              ? `
            <h2>AI-Generated Insights</h2>
            <div style="white-space: pre-wrap; padding: 16px; background: #f9fafb; border-left: 4px solid #059669;">
              ${generatedReport.report.aiInsights}
            </div>
          `
              : ''
          }

          <p style="margin-top: 40px; font-size: 12px; color: #666;">
            Generated by Carbon Footprint Intelligence Platform (CFIP)<br>
            ${new Date().toLocaleString()}
          </p>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Emissions Reports</h1>
              <p className="text-gray-600">Generate and export comprehensive emissions reports</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              {showForm ? 'Cancel' : '+ Generate Report'}
            </button>
          </div>
        </div>

        {/* Generate Report Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Generate New Report</h2>
            <form onSubmit={handleGenerateReport} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Type
                  </label>
                  <select
                    value={formData.reportType}
                    onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="ANNUAL">Annual</option>
                    <option value="CUSTOM">Custom Period</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeAI"
                  checked={formData.includeAI}
                  onChange={(e) => setFormData({ ...formData, includeAI: e.target.checked })}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="includeAI" className="ml-2 block text-sm text-gray-700">
                  Include AI-generated insights (powered by Google Gemini)
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
                >
                  {loading ? 'Generating...' : 'Generate Report'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Generated Report */}
        {generatedReport && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {generatedReport.report.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(generatedReport.report.startDate).toLocaleDateString()} -{' '}
                    {new Date(generatedReport.report.endDate).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  📄 Export PDF
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 mb-1">Total Emissions</p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCO2(generatedReport.report.summary.totalEmissions)}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 mb-1">Total Shipments</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatNumber(generatedReport.report.summary.totalCalculations, 0)}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-600 mb-1">Total Distance</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {formatNumber(generatedReport.report.summary.totalDistance, 0)} km
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-orange-600 mb-1">Average/Shipment</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {formatCO2(generatedReport.report.summary.averageEmissionsPerShipment)}
                  </p>
                </div>
              </div>

              {/* Emissions by Mode */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Emissions by Transport Mode</h3>
                <div className="space-y-3">
                  {Object.entries(generatedReport.report.emissionsByMode)
                    .sort((a, b) => b[1] - a[1])
                    .map(([mode, emissions]) => {
                      const percentage =
                        (emissions / generatedReport.report.summary.totalEmissions) * 100;
                      return (
                        <div key={mode} className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700">{mode}</span>
                              <span className="text-sm text-gray-600">
                                {formatCO2(emissions)} ({formatNumber(percentage, 1)}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* AI Insights */}
              {generatedReport.report.aiInsights && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">🤖 AI-Generated Insights</h3>
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border-l-4 border-green-600">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {generatedReport.report.aiInsights}
                    </div>
                  </div>
                </div>
              )}

              {/* Greenhouse Gas Breakdown */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Greenhouse Gas Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">CO2</p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatNumber(generatedReport.report.summary.totalCO2, 2)} kg
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">CH4 (Methane)</p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatNumber(generatedReport.report.summary.totalCH4, 4)} kg
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">N2O (Nitrous Oxide)</p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatNumber(generatedReport.report.summary.totalN2O, 4)} kg
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Saved Reports */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Previously Generated Reports</h2>

          {savedReports.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No reports yet</h3>
              <p className="text-gray-600 mb-6">Generate your first emissions report</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Generate Report
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Report Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Generated
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {savedReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {report.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {report.reportType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(report.startDate).toLocaleDateString()} -{' '}
                        {new Date(report.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(report.generatedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
