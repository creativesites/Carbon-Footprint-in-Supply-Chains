'use client';

import { Card } from '@/components/ui/card';
import { MarkdownRenderer } from './MarkdownRenderer';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ArrowDown, ArrowUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface EmissionsAnalysisDisplayProps {
  data: {
    insights: string;
    structuredData: {
      keyMetrics: {
        totalEmissions: number;
        primaryMode: string;
        primaryModePercentage: number;
        trend: 'increasing' | 'decreasing' | 'stable';
      };
      recommendations: Array<{
        title: string;
        description: string;
        priority: 'high' | 'medium' | 'low';
        estimatedReduction: number;
      }>;
      benchmarks: Array<{
        metric: string;
        current: number;
        industry: number;
        unit: string;
      }>;
      modeBreakdown: Array<{
        mode: string;
        emissions: number;
        percentage: number;
        count: number;
      }>;
    };
  };
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const priorityConfig = {
  high: { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle },
  medium: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
  low: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
};

export function EmissionsAnalysisDisplay({ data }: EmissionsAnalysisDisplayProps) {
  const { insights, structuredData } = data;
  const { keyMetrics, recommendations, modeBreakdown } = structuredData;

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Emissions</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {keyMetrics.totalEmissions.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">kg CO2e</p>
            </div>
            <div className={`p-3 rounded-full ${
              keyMetrics.trend === 'increasing' ? 'bg-red-100' :
              keyMetrics.trend === 'decreasing' ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              {keyMetrics.trend === 'increasing' ? (
                <ArrowUp className="w-6 h-6 text-red-600" />
              ) : keyMetrics.trend === 'decreasing' ? (
                <ArrowDown className="w-6 h-6 text-green-600" />
              ) : (
                <div className="w-6 h-6 bg-gray-400 rounded-full" />
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Primary Transport Mode</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {keyMetrics.primaryMode}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {keyMetrics.primaryModePercentage.toFixed(1)}% of emissions
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Recommendations</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {recommendations.length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {recommendations.filter(r => r.priority === 'high').length} high priority
            </p>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mode Breakdown Bar Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Emissions by Transport Mode</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={modeBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mode" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(2)} kg CO2e`, 'Emissions']}
              />
              <Legend />
              <Bar dataKey="emissions" fill="#3b82f6" name="Emissions (kg CO2e)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Mode Breakdown Pie Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Mode Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={modeBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ mode, percentage }) => `${mode}: ${percentage.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="emissions"
              >
                {modeBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toFixed(2)} kg CO2e`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">AI Recommendations</h3>
          <div className="space-y-4">
            {recommendations.map((rec, index) => {
              const Icon = priorityConfig[rec.priority].icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${priorityConfig[rec.priority].color}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{rec.title}</h4>
                        <span className="text-xs uppercase font-medium">{rec.priority} Priority</span>
                      </div>
                      <p className="text-sm opacity-90 mb-2">{rec.description}</p>
                      {rec.estimatedReduction > 0 && (
                        <p className="text-sm font-medium">
                          Potential Reduction: ~{rec.estimatedReduction.toLocaleString()} kg CO2e
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Detailed Insights */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Detailed Analysis</h3>
        <MarkdownRenderer content={insights} />
      </div>
    </div>
  );
}
