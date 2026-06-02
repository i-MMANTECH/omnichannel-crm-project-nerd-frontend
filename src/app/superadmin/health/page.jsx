'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, TrendingUp, AlertTriangle, XCircle, Clock, Activity } from 'lucide-react';
import { useSuperAdminAuth } from '../context/SuperAdminAuthContext';
import { createSuperAdminApi } from '../lib/api';
import { toast } from 'react-toastify';

const HEALTH = {
  good:     { label: 'Good',     color: 'green',  dot: 'bg-green-500',  badge: 'bg-green-100 text-green-700 ring-green-200',   row: '',                bar: 'bg-green-500',  accent: 'border-l-green-500'  },
  alert:    { label: 'Alert',    color: 'yellow', dot: 'bg-yellow-400', badge: 'bg-yellow-100 text-yellow-700 ring-yellow-200', row: 'bg-amber-50',     bar: 'bg-yellow-400', accent: 'border-l-yellow-400' },
  risk:     { label: 'Risk',     color: 'red',    dot: 'bg-red-400',    badge: 'bg-red-100 text-red-600 ring-red-200',          row: 'bg-red-50',       bar: 'bg-red-400',    accent: 'border-l-red-400'    },
  critical: { label: 'Critical', color: 'red',    dot: 'bg-red-600',    badge: 'bg-red-100 text-red-700 ring-red-200',          row: 'bg-red-100/70',   bar: 'bg-red-600',    accent: 'border-l-red-600'    },
  dormant:  { label: 'Dormant',  color: 'gray',   dot: 'bg-gray-300',   badge: 'bg-gray-100 text-gray-500 ring-gray-200',       row: 'bg-gray-100',     bar: 'bg-gray-300',   accent: 'border-l-gray-300'   },
};

const SUMMARY_CARDS = [
  { key: 'good',     label: 'Good',     icon: TrendingUp,    bg: 'bg-green-50',  icon_cls: 'text-green-600',  val_cls: 'text-green-700'  },
  { key: 'alert',    label: 'Alert',    icon: Clock,         bg: 'bg-yellow-50', icon_cls: 'text-yellow-600', val_cls: 'text-yellow-700' },
  { key: 'risk',     label: 'At Risk',  icon: AlertTriangle, bg: 'bg-red-50',    icon_cls: 'text-red-500',    val_cls: 'text-red-600'    },
  { key: 'critical', label: 'Critical', icon: XCircle,       bg: 'bg-red-50',    icon_cls: 'text-red-700',    val_cls: 'text-red-700'    },
  { key: 'dormant',  label: 'Dormant',  icon: Activity,      bg: 'bg-gray-100',  icon_cls: 'text-gray-400',   val_cls: 'text-gray-500'   },
];

function lastActiveColor(human) {
  if (!human) return 'text-gray-300';
  const match = human.match(/^(\d+)([mhd])/);
  if (!match) return 'text-gray-400';
  const [, val, unit] = match;
  const n = parseInt(val);
  if (unit === 'm' || unit === 'h') return 'text-green-600 font-medium';
  if (unit === 'd' && n <= 7) return 'text-green-600 font-medium';
  if (unit === 'd' && n <= 14) return 'text-yellow-600 font-medium';
  return 'text-red-500 font-medium';
}

function CompanyAvatar({ name }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');
  const colors = [
    'bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700',
    'bg-indigo-100 text-indigo-700', 'bg-teal-100 text-teal-700',
    'bg-pink-100 text-pink-700', 'bg-orange-100 text-orange-700',
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${colors[idx]}`}>
      {initials || '?'}
    </div>
  );
}

function AdoptionBar({ active, total, pct }) {
  const barColor = pct >= 50 ? 'bg-green-500' : pct >= 25 ? 'bg-yellow-400' : 'bg-red-400';
  return (
    <div className="min-w-0">
      <p className="text-sm text-gray-700 leading-tight">
        <span className="font-medium">{active}</span>
        <span className="text-gray-400">/{total}</span>
        <span className="text-xs text-gray-400 ml-1">({pct}%)</span>
      </p>
      <div className="mt-1 h-1 w-full max-w-[80px] bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
    </div>
  );
}

export default function HealthPage() {
  const { superAdmin } = useSuperAdminAuth();
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('health');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchHealth = useCallback(async (sortParam = sort, dirParam = sortDir, pageParam = 1) => {
    if (!superAdmin?.access) return;
    setLoading(true);
    try {
      const api = createSuperAdminApi(superAdmin.access);
      const res = await api.get(`/super-admin/health/?sort=${sortParam}&dir=${dirParam}&page=${pageParam}`);
      setRows(res.data.results || []);
      setSummary(res.data.summary || {});
      setTotalPages(res.data.total_pages || 1);
      setTotalCount(res.data.count || 0);
    } catch {
      toast.error('Failed to load health data');
    } finally {
      setLoading(false);
    }
  }, [superAdmin?.access, sort, sortDir]);

  useEffect(() => {
    fetchHealth(sort, sortDir, page);
  }, [sort, sortDir, page]);

  const handleSort = (key) => {
    if (key === sort) {
      const next = sortDir === 'desc' ? 'asc' : 'desc';
      setSortDir(next);
    } else {
      setSort(key);
      setSortDir('desc');
      setPage(1);
    }
  };

  const totalOrgs = Object.values(summary).reduce((a, b) => a + b, 0);
  const goodPct = totalOrgs ? Math.round(((summary.good || 0) / totalOrgs) * 100) : 0;

  return (
    <div
      className="-mx-6 -mt-6 lg:-mx-8 lg:-mt-8 px-6 pt-6 lg:px-8 lg:pt-8 pb-12 min-h-screen"
      style={{
        background: `
          linear-gradient(to bottom, transparent 40%, #ffffff 75%),
          linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 12%, #fafafa 28%, #e2eeff 44%, #f5f3ff 58%, #e0f2fe 72%, #f0fdf4 86%, #e8f0fe 100%)
        `,
      }}
    >
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Organisation Health</h1>
          <p className="text-sm text-gray-400 mt-1">Activity and engagement across all {totalCount > 0 ? totalCount : ''} organisations</p>
        </div>
        <button
          onClick={() => fetchHealth(sort, page)}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Summary cards */}
      {!loading && totalCount > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
          {SUMMARY_CARDS.map(({ key, label, icon: Icon, bg, icon_cls, val_cls }) => (
            <div
              key={key}
              onClick={() => { setSort('health'); setPage(1); }}
              className={`${bg} rounded-xl p-4 border border-white shadow-sm cursor-pointer hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 font-medium">{label}</p>
                <Icon className={`w-4 h-4 ${icon_cls}`} />
              </div>
              <p className={`text-2xl font-bold ${val_cls}`}>{summary[key] ?? 0}</p>
              {key === 'good' && totalOrgs > 0 && (
                <p className="text-xs text-gray-400 mt-0.5">{goodPct}% of orgs</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-6 h-6 border-2 border-[#3EBF0F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-20 text-sm text-gray-400">No organisations found</div>
        ) : (
          <>
            {/* Header */}
            <div className="grid grid-cols-[2fr_1.5fr_0.7fr_0.7fr_0.7fr_1fr_0.9fr] gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50/70">
              {[
                ['Organisation', 'name'],
                ['Active Users', 'users'],
                ['Tickets', 'tickets'],
                ['Tasks', 'tasks'],
                ['Features', 'features'],
                ['Last Active', 'last_active'],
                ['Health', 'health'],
              ].map(([label, key]) => {
                const active = sort === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleSort(key)}
                    className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide transition-colors hover:text-gray-600 text-left"
                  >
                    <span className={active ? 'text-[#3EBF0F]' : 'text-gray-400'}>{label}</span>
                    {active && (
                      <span className="text-xs text-[#3EBF0F]">{sortDir === 'desc' ? '↓' : '↑'}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-50">
              {rows.map((row) => {
                const cfg = HEALTH[row.health_status] || HEALTH.dormant;
                return (
                  <div
                    key={row.id}
                    className={`grid grid-cols-[2fr_1.5fr_0.7fr_0.7fr_0.7fr_1fr_0.9fr] gap-4 px-5 py-3.5 items-center border-l-[3px] hover:brightness-95 transition-all ${cfg.accent} ${cfg.row}`}
                  >
                    {/* Organisation */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CompanyAvatar name={row.name} />
                      <p className="text-sm font-medium text-gray-800 truncate">{row.name}</p>
                    </div>

                    {/* Active users + bar */}
                    <AdoptionBar active={row.users_active_month} total={row.total_users} pct={row.adoption_pct} />

                    {/* Tickets */}
                    <p className={`text-sm font-medium ${row.tickets_month > 0 ? 'text-gray-700' : 'text-gray-300'}`}>
                      {row.tickets_month ?? 0}
                    </p>

                    {/* Tasks */}
                    <p className={`text-sm font-medium ${row.tasks_month > 0 ? 'text-gray-700' : 'text-gray-300'}`}>
                      {row.tasks_month ?? 0}
                    </p>

                    {/* Features */}
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm font-medium ${row.features_used_count >= 3 ? 'text-green-600' : row.features_used_count >= 1 ? 'text-yellow-600' : 'text-gray-300'}`}>
                        {row.features_used_count}
                      </span>
                      {row.features_used_count > 0 && (
                        <span className="text-xs text-gray-300">/6</span>
                      )}
                    </div>

                    {/* Last active */}
                    <p className={`text-xs ${lastActiveColor(row.last_active_human)}`}>
                      {row.last_active_human ?? <span className="text-gray-300 font-normal">never</span>}
                    </p>

                    {/* Health badge */}
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 w-fit ${cfg.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/40">
                <p className="text-xs text-gray-400">{totalCount} organisations</p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                    className="px-3 py-1.5 text-xs rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  >
                    Prev
                  </button>
                  <span className="text-xs text-gray-400 px-2">{page} / {totalPages}</span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || loading}
                    className="px-3 py-1.5 text-xs rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
