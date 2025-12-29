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
} from 'recharts';
import { TrendingDown, Package, Fuel, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

interface RouteOptimizationDisplayProps {
  data: {
    insights: string;
    structuredData: {
      currentRoute: {
        mode: string;
        fuel: string;
        emissions: number;
      };
      alternatives: Array<{
        name: string;
        mode: string;
        fuel: string;
        estimatedEmissions: number;
        reductionKg: number;
        reductionPercent: number;
        pros: string[];
        cons: string[];
        implementation: string;
      }>;
      comparisonChart: Array<{
        strategy: string;
        emissions: number;
        reduction: number;
      }>;
    };
  };
}

export function RouteOptimizationDisplay({ data }: RouteOptimizationDisplayProps) {
  const { insights, structuredData } = data;
  const { currentRoute, alternatives, comparisonChart } = structuredData;

  return (
    <div className="space-y-6">
      {/* Current Route Card */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Current Route Configuration</h3>
          <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Transport Mode</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{currentRoute.mode}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Fuel Type</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{currentRoute.fuel}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Emissions</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {currentRoute.emissions.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">kg CO2e</p>
          </div>
        </div>
      </Card>

      {/* Comparison Chart */}
      {comparisonChart.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Emissions Comparison: Alternative Strategies
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={comparisonChart} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="strategy" type="category" width={150} />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === 'emissions') return [`${value.toFixed(2)} kg CO2e`, 'Emissions'];
                  if (name === 'reduction') return [`${value.toFixed(1)}%`, 'Reduction'];
                  return value;
                }}
              />
              <Legend />
              <Bar dataKey="emissions" fill="#3b82f6" name="Emissions (kg CO2e)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Alternative Strategies */}
      {alternatives.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Alternative Optimization Strategies
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {alternatives.map((alt, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {alt.name}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {alt.mode}
                        </span>
                        <span className="flex items-center gap-1">
                          <Fuel className="w-4 h-4" />
                          {alt.fuel}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <TrendingDown className="w-5 h-5" />
                        <span className="text-2xl font-bold">{alt.reductionPercent}%</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Save {alt.reductionKg.toLocaleString()} kg CO2e
                      </p>
                    </div>
                  </div>

                  {/* Emissions Comparison */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Current Emissions</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {currentRoute.emissions.toLocaleString()} kg CO2e
                        </p>
                      </div>
                      <ArrowRight className="w-6 h-6 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Optimized Emissions</p>
                        <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                          {alt.estimatedEmissions.toLocaleString()} kg CO2e
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pros and Cons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Advantages
                      </h5>
                      <ul className="space-y-1">
                        {alt.pros.map((pro, i) => (
                          <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Considerations
                      </h5>
                      <ul className="space-y-1">
                        {alt.cons.map((con, i) => (
                          <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Implementation */}
                  {alt.implementation && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Implementation: {alt.implementation}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Insights */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Detailed Analysis</h3>
        <MarkdownRenderer content={insights} />
      </div>
    </div>
  );
}
