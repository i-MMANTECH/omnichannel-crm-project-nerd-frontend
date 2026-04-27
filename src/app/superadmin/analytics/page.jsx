'use client';

import React, { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, ArrowUpRight } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useSuperAdminAuth } from '../context/SuperAdminAuthContext';
import { createSuperAdminApi } from '../lib/api';
import { toast } from 'react-toastify';

const PLAN_COLORS = ['#3EBF0F', '#60a5fa', '#a78bfa', '#fb923c', '#f472b6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
      <p className="font-medium text-gray-700 mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {entry.name.toLowerCase().includes('revenue') ? `₦${Number(entry.value).toLocaleString()}` : entry.value}
        </p>
      ))}
    </div>
  );
};

const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 text-xs">
      <p className="font-medium text-gray-700">{payload[0].name}</p>
      <p className="text-gray-500">{payload[0].value} subscribers ({payload[0].payload.percentage}%)</p>
    </div>
  );
};

export default function SuperAdminAnalytics() {
  const { superAdmin } = useSuperAdminAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!superAdmin?.access) return;
    const fetchAnalytics = async () => {
      try {
        const api = createSuperAdminApi(superAdmin.access);
        const res = await api.get('/super-admin/analytics');
        setData(res.data);
      } catch (err) {
        toast.error('Failed to load analytics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [superAdmin?.access]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[#3EBF0F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const userGrowth = data.user_growth || [];
  const revenueByMonth = data.revenue_by_month || [];
  const usersByPlan = data.users_by_plan || [];
  const totalPlanUsers = usersByPlan.reduce((s, p) => s + p.count, 0);

  const latestUserCount = userGrowth.reduce((sum, m) => sum + m.count, 0);
  const recentMonthRevenue = revenueByMonth[revenueByMonth.length - 1]?.revenue || 0;
  const prevMonthRevenue = revenueByMonth[revenueByMonth.length - 2]?.revenue || 0;
  const revenueChange = prevMonthRevenue > 0
    ? (((recentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100).toFixed(1)
    : null;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Analytics</h1>
        <p className="text-sm text-gray-400 mt-1">Platform performance metrics and trends</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total New Users (Period)</p>
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <Users className="w-4 h-4 text-[#3EBF0F]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{latestUserCount.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Latest Month Revenue</p>
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">₦{recentMonthRevenue.toLocaleString()}</p>
          {revenueChange !== null && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${parseFloat(revenueChange) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              <ArrowUpRight className="w-3 h-3" />
              {Math.abs(revenueChange)}% vs prev month
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Plans Tracked</p>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{usersByPlan.length}</p>
          <p className="text-xs text-gray-400 mt-1">{totalPlanUsers} total subscribers</p>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm mb-4">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-700">New Users Per Month</h2>
          <p className="text-xs text-gray-400 mt-0.5">Monthly new user registrations</p>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={userGrowth}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3EBF0F"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#3EBF0F' }}
              activeDot={{ r: 5 }}
              name="New Users"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Chart + Plan Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-700">Revenue by Month</h2>
            <p className="text-xs text-gray-400 mt-0.5">Monthly platform revenue</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueByMonth} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="#3EBF0F" radius={[4, 4, 0, 0]} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Plan Distribution */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-700">Users by Plan</h2>
            <p className="text-xs text-gray-400 mt-0.5">Subscriber distribution</p>
          </div>
          {usersByPlan.length > 0 ? (
            <>
              <div className="flex justify-center">
                <PieChart width={180} height={180}>
                  <Pie
                    data={usersByPlan}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="plan"
                  >
                    {usersByPlan.map((_, index) => (
                      <Cell key={index} fill={PLAN_COLORS[index % PLAN_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </div>
              <div className="space-y-2 mt-2">
                {usersByPlan.map((plan, index) => (
                  <div key={plan.plan} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: PLAN_COLORS[index % PLAN_COLORS.length] }}
                      />
                      <span className="text-xs text-gray-600 truncate">{plan.plan}</span>
                    </div>
                    <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                      <div className="w-12 bg-gray-100 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${plan.percentage}%`,
                            backgroundColor: PLAN_COLORS[index % PLAN_COLORS.length],
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-700 w-5 text-right">{plan.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-32 text-sm text-gray-400">No plan data</div>
          )}
        </div>
      </div>
    </div>
  );
}
