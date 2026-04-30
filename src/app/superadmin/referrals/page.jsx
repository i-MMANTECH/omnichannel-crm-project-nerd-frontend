'use client';

import React, { useState, useEffect } from 'react';
import { Share2, Users, TrendingUp, Trophy, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useSuperAdminAuth } from '../context/SuperAdminAuthContext';
import { createSuperAdminApi } from '../lib/api';
import { toast } from 'react-toastify';

const PAGE_SIZE = 10;

function StatCard({ label, value, icon: Icon, color, prefix = '' }) {
  const colorMap = {
    green: 'bg-green-50 text-[#3EBF0F]',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500">{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value ?? '—'}
      </p>
    </div>
  );
}

const rankColors = ['text-yellow-500', 'text-gray-400', 'text-orange-500'];

function RankBadge({ rank }) {
  if (rank <= 3) {
    return <Trophy className={`w-4 h-4 ${rankColors[rank - 1]}`} />;
  }
  return <span className="text-sm font-medium text-gray-400">#{rank}</span>;
}

export default function SuperAdminReferrals() {
  const { superAdmin } = useSuperAdminAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!superAdmin?.access) return;
    const fetchReferrals = async () => {
      setLoading(true);
      try {
        const api = createSuperAdminApi(superAdmin.access);
        const res = await api.get('/super-admin/referrals');
        setData(res.data);
      } catch (err) {
        toast.error('Failed to load referrals');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, [superAdmin?.access]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[#3EBF0F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const summary = data?.summary || {};
  const leaderboard = data?.leaderboard || [];
  const allResults = data?.results || [];

  // Client-side filter (API returns all results in one call)
  const filtered = allResults.filter((r) => {
    const matchSearch =
      r.referrer_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.referee_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.referrer_email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.paid_status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Referrals</h1>
        <p className="text-sm text-gray-400 mt-1">Track referral performance and rewards</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Referrals" value={summary.total_referrals} icon={Share2} color="blue" />
        <StatCard label="Paid Conversions" value={summary.converted_to_paid} icon={Users} color="green" />
        <StatCard label="Conversion Rate" value={summary.conversion_rate != null ? `${summary.conversion_rate}%` : '—'} icon={TrendingUp} color="orange" />
      </div>

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Top Referrers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide w-12">Rank</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Referrer</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Referrals</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Paid Conversions</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Conversion %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leaderboard.map((row) => (
                  <tr key={row.rank} className={`hover:bg-gray-50/50 transition-colors ${row.rank === 1 ? 'bg-yellow-50/30' : ''}`}>
                    <td className="px-5 py-3 text-center">
                      <RankBadge rank={row.rank} />
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-800">{row.referrer_name}</p>
                      <p className="text-xs text-gray-400">{row.referrer_email}</p>
                    </td>
                    <td className="px-5 py-3 font-medium text-gray-800">{row.total_referred}</td>
                    <td className="px-5 py-3 text-gray-600">{row.paid_conversions}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5 max-w-[60px]">
                          <div
                            className="bg-[#3EBF0F] h-1.5 rounded-full"
                            style={{ width: `${row.conversion_rate}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{row.conversion_rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All Referrals Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">
            All Referral Records
            {filtered.length > 0 && <span className="ml-2 text-xs text-gray-400 font-normal">({filtered.length})</span>}
          </h2>
          <div className="flex gap-2 flex-wrap">
            {['all', 'active', 'trial', 'churned'].map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                  statusFilter === s ? 'bg-[#3EBF0F] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3EBF0F] w-36"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Referrer</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Referred Company</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Plan</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-sm text-gray-400">No referrals found</td>
                </tr>
              ) : (
                paginated.map((ref) => (
                  <tr key={ref.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-800">{ref.referrer_name}</p>
                      <p className="text-xs text-gray-400">{ref.referrer_email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-gray-700">{ref.referee_name}</p>
                      <p className="text-xs text-gray-400">{ref.referee_email}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-600 text-xs">{ref.plan || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                        ref.paid_status === 'active' ? 'bg-green-100 text-green-700' :
                        ref.paid_status === 'trial' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {ref.paid_status || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{ref.referral_date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pn = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return <button key={pn} onClick={() => setPage(pn)} className={`w-7 h-7 rounded-lg text-xs font-medium ${page === pn ? 'bg-[#3EBF0F] text-white' : 'text-gray-500 hover:bg-gray-100'}`}>{pn}</button>;
              })}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
