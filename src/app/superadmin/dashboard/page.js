'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  Ticket,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useSuperAdminAuth } from '../context/SuperAdminAuthContext';
import { createSuperAdminApi } from '../lib/api';

function StatCard({ label, value, growth, icon: Icon, prefix = '', color = 'green' }) {
  const isPositive = growth >= 0;
  const colorMap = {
    green: 'bg-green-50 text-[#3EBF0F]',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value ?? '—'}
      </p>
      {growth !== undefined && growth !== null && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(growth)}% from last month
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    active: 'bg-green-100 text-green-700',
    trial: 'bg-yellow-100 text-yellow-700',
    inactive: 'bg-gray-100 text-gray-500',
    suspended: 'bg-red-100 text-red-600',
    churned: 'bg-red-100 text-red-600',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${map[status] || map.inactive}`}>
      {status}
    </span>
  );
}

function ActivityDot({ action }) {
  const map = {
    convert_lead: 'bg-green-500',
    new_signup: 'bg-blue-500',
    plan_upgrade: 'bg-purple-500',
    payment: 'bg-orange-500',
    suspend: 'bg-red-500',
  };
  return <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${map[action] || 'bg-gray-400'}`} />;
}

function formatTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function SuperAdminDashboard() {
  const { superAdmin } = useSuperAdminAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!superAdmin?.access) return;
    const api = createSuperAdminApi(superAdmin.access);

    const fetchDashboard = async () => {
      try {
        const res = await api.get('/super-admin/dashboard');
        setData(res.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [superAdmin?.access]);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[#3EBF0F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-red-500">{error}</div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Dashboard Overview</h1>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            {today}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total Users" value={data.total_users} growth={data.total_users_change_pct} icon={Users} color="green" />
        <StatCard label="Active Companies" value={data.active_companies} growth={data.active_companies_change_pct} icon={Building2} color="blue" />
        <StatCard label="Monthly Revenue" value={data.monthly_revenue} growth={data.monthly_revenue_change_pct} icon={DollarSign} prefix="₦" color="purple" />
        <StatCard label="Conversion Rate" value={`${data.conversion_rate}%`} growth={data.conversion_rate_change_pct} icon={TrendingUp} color="orange" />
        <StatCard label="Open Tickets" value={data.open_tickets} icon={Ticket} color="green" />
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700">Monthly Revenue</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.revenue_by_month} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
              />
              <Bar dataKey="revenue" fill="#3EBF0F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {(data.recent_activity || []).slice(0, 5).map((item) => (
              <div key={item.id} className="flex gap-3">
                <ActivityDot action={item.action} />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-700 truncate">{item.user_name} · {item.company_name}</p>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{item.description}</p>
                  <p className="text-xs text-gray-300 mt-1">{formatTimeAgo(item.created_at)}</p>
                </div>
              </div>
            ))}
            {(!data.recent_activity || data.recent_activity.length === 0) && (
              <p className="text-xs text-gray-400 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Signups */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Recent Signups</h2>
          <a href="/superadmin/companies" className="text-xs text-[#3EBF0F] hover:underline font-medium">View all</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Company</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Plan</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(data.recent_signups || []).map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800 text-sm truncate max-w-[200px]">{row.full_name || row.email}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[200px]">{row.email}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-600 truncate max-w-[180px]">{row.company_name}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{row.plan_name}</td>
                  <td className="px-5 py-3"><StatusBadge status={row.status} /></td>
                </tr>
              ))}
              {(!data.recent_signups || data.recent_signups.length === 0) && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-sm text-gray-400">No recent signups</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
