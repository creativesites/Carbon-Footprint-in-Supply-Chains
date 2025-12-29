'use client';

import { useEffect, useState } from 'react';
import { formatCO2, formatNumber } from '@/lib/utils';

interface Goal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  targetDate: string;
  status: string;
  category: string;
}

interface Compliance {
  current: number;
  limit: number;
  percentage: number;
  status: string;
}

interface GoalsData {
  goals: Goal[];
  compliance: Record<string, Compliance>;
  guidelines: any;
  currentYear: number;
}

export default function GoalsPage() {
  const [data, setData] = useState<GoalsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetValue: '',
    targetDate: '',
    category: 'EMISSIONS',
  });

  const fetchGoals = async () => {
    try {
      const res = await fetch('/api/goals');
      const result = await res.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        setShowCreateForm(false);
        setFormData({
          title: '',
          description: '',
          targetValue: '',
          targetDate: '',
          category: 'EMISSIONS',
        });
        fetchGoals();
      }
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const modeEmojis: Record<string, string> = {
    TRUCK: '🚛',
    RAIL: '🚂',
    SHIP: '🚢',
    AIR: '✈️',
    TOTAL: '🌍',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading goals...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Emissions Goals & Compliance
              </h1>
              <p className="text-gray-600">
                Track your progress against Zambian emissions guidelines
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              {showCreateForm ? 'Cancel' : '+ Create Goal'}
            </button>
          </div>
        </div>

        {/* Create Goal Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Create New Goal</h2>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Reduce truck emissions by 20%"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="EMISSIONS">Emissions Reduction</option>
                    <option value="EFFICIENCY">Efficiency Improvement</option>
                    <option value="COMPLIANCE">Compliance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Value (kg CO2e) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.targetValue}
                    onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 40000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.targetDate}
                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Describe your goal and how you plan to achieve it..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Zambian Guidelines - Compliance Status */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg shadow-lg p-6 text-white mb-6">
            <h2 className="text-2xl font-bold mb-2">
              🇿🇲 Zambian Emissions Guidelines {data.currentYear}
            </h2>
            <p className="text-green-100">
              Annual emissions limits for transport operations in Zambia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {Object.entries(data.compliance).map(([mode, comp]) => {
              const isCompliant = comp.status === 'compliant';
              const percentage = comp.percentage;

              return (
                <div key={mode} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-3xl mr-2">{modeEmojis[mode]}</span>
                      <h3 className="text-lg font-semibold text-gray-900">{mode}</h3>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isCompliant
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {isCompliant ? '✓ Compliant' : '⚠ Exceeded'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Current:</span>
                      <span className="font-semibold text-gray-900">
                        {formatCO2(comp.current)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Annual Limit:</span>
                      <span className="font-semibold text-gray-900">
                        {formatCO2(comp.limit)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{formatNumber(percentage, 1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            percentage <= 80
                              ? 'bg-green-500'
                              : percentage <= 100
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      {percentage > 100 && (
                        <p className="text-xs text-red-600 mt-1">
                          {formatNumber(percentage - 100, 1)}% over limit
                        </p>
                      )}
                    </div>

                    <div className="mt-2 text-xs">
                      {comp.limit - comp.current > 0 ? (
                        <p className="text-green-600">
                          {formatCO2(comp.limit - comp.current)} remaining
                        </p>
                      ) : (
                        <p className="text-red-600">
                          {formatCO2(comp.current - comp.limit)} over limit
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">🎯 Recommended Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.guidelines.recommendations.map((rec: string, index: number) => (
              <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
                <span className="text-green-600 mr-2 mt-0.5">✓</span>
                <p className="text-sm text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* User Goals */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Your Custom Goals</h2>

          {data.goals.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No goals yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first emissions reduction goal
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Create Your First Goal
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {data.goals.map((goal) => {
                const progress = (goal.currentValue / goal.targetValue) * 100;
                const daysUntilTarget = Math.ceil(
                  (new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                );

                return (
                  <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                        {goal.description && (
                          <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          goal.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-700'
                            : goal.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {goal.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Current</p>
                        <p className="text-sm font-semibold">
                          {formatCO2(goal.currentValue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Target</p>
                        <p className="text-sm font-semibold">
                          {formatCO2(goal.targetValue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Deadline</p>
                        <p className="text-sm font-semibold">
                          {daysUntilTarget > 0 ? `${daysUntilTarget} days` : 'Overdue'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{formatNumber(progress, 1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
