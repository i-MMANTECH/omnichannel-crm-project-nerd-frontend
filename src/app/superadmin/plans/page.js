'use client';

import React, { useState, useEffect } from 'react';
import { Check, Users, DollarSign, TrendingUp, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useSuperAdminAuth } from '../context/SuperAdminAuthContext';
import { createSuperAdminApi } from '../lib/api';
import { toast } from 'react-toastify';

const PLAN_COLORS = ['blue', 'green', 'purple', 'orange'];
const COLOR_MAP = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', check: 'text-blue-500' },
  green: { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-[#3EBF0F]', check: 'text-[#3EBF0F]' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-600', check: 'text-purple-500' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'text-orange-600', check: 'text-orange-500' },
};

const PAGE_SIZE = 8;

function PlanCard({ plan, colorIndex }) {
  const c = COLOR_MAP[PLAN_COLORS[colorIndex % PLAN_COLORS.length]];
  const isTop = plan.mrr === Math.max(plan.mrr);

  return (
    <div className={`bg-white rounded-xl border-2 ${c.border} shadow-sm p-5`}>
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-gray-800 text-base truncate">{plan.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{plan.duration_in_days}-day billing cycle</p>
        </div>
        <div className="text-right ml-3 flex-shrink-0">
          <p className="text-xl font-bold text-gray-800">₦{Number(plan.price).toLocaleString()}</p>
          <p className="text-xs text-gray-400">/cycle</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-gray-100">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800">{plan.subscriber_count}</p>
          <p className="text-xs text-gray-400">Subscribers</p>
        </div>
        <div className="text-center border-x border-gray-100">
          <p className="text-lg font-bold text-gray-800">₦{(plan.mrr / 1000).toFixed(1)}k</p>
          <p className="text-xs text-gray-400">MRR</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800">
            ₦{(plan.subscriber_count * plan.price).toLocaleString()}
          </p>
          <p className="text-xs text-gray-400">Revenue</p>
        </div>
      </div>

      <ul className="space-y-1.5">
        {(plan.features || []).map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
            <Check className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${c.check}`} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SuperAdminPlans() {
  const { superAdmin } = useSuperAdminAuth();
  const [plans, setPlans] = useState([]);
  const [totalMRR, setTotalMRR] = useState(0);
  const [subscribers, setSubscribers] = useState([]);
  const [subLoading, setSubLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (!superAdmin?.access) return;
    const api = createSuperAdminApi(superAdmin.access);

    // Fetch plans
    const fetchPlans = async () => {
      try {
        const res = await api.get('/super-admin/plans/');
        setPlans(res.data.plans || []);
        setTotalMRR(res.data.total_mrr || 0);
      } catch (err) {
        toast.error('Failed to load plans');
        console.error(err);
      } finally {
        setPlansLoading(false);
      }
    };

    fetchPlans();
  }, [superAdmin?.access]);

  const fetchSubscribers = async (pageNum = 1) => {
    if (!superAdmin?.access) return;
    setSubLoading(true);
    try {
      const api = createSuperAdminApi(superAdmin.access);
      const params = new URLSearchParams({ page: pageNum });
      if (search) params.append('search', search);
      const res = await api.get(`/super-admin/plans/subscribers/?${params.toString()}`);
      setSubscribers(res.data.results || []);
      setTotalPages(res.data.total_pages || 1);
      setTotalCount(res.data.count || 0);
    } catch (err) {
      toast.error('Failed to load subscribers');
      console.error(err);
    } finally {
      setSubLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers(page);
  }, [page]);

  useEffect(() => {
    setPage(1);
    fetchSubscribers(1);
  }, [search, superAdmin?.access]);

  const totalSubs = plans.reduce((s, p) => s + p.subscriber_count, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Plans & Pricing</h1>
        <p className="text-sm text-gray-400 mt-1">Overview of subscription plans and subscriber activity</p>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-[#3EBF0F]" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Total MRR</p>
            <p className="text-xl font-bold text-gray-800">₦{Number(totalMRR).toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Total Subscribers</p>
            <p className="text-xl font-bold text-gray-800">{totalSubs}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Active Plans</p>
            <p className="text-xl font-bold text-gray-800">{plans.length}</p>
          </div>
        </div>
      </div>

      {/* Plan Cards */}
      {plansLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-[#3EBF0F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
          {plans.map((plan, i) => <PlanCard key={plan.id} plan={plan} colorIndex={i} />)}
        </div>
      )}

      {/* Subscribers Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">
            Subscribers
            {totalCount > 0 && <span className="ml-2 text-xs text-gray-400 font-normal">({totalCount} total)</span>}
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3EBF0F] w-48"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">User / Company</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Plan</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Joined</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-10">
                    <div className="flex justify-center">
                      <div className="w-5 h-5 border-2 border-[#3EBF0F] border-t-transparent rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-sm text-gray-400">No subscribers found</td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-800 truncate max-w-[200px]">{sub.company_name}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[200px]">{sub.email}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-600 text-xs">{sub.plan_name}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{sub.joined_date}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || subLoading} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pn = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return <button key={pn} onClick={() => setPage(pn)} className={`w-7 h-7 rounded-lg text-xs font-medium ${page === pn ? 'bg-[#3EBF0F] text-white' : 'text-gray-500 hover:bg-gray-100'}`}>{pn}</button>;
              })}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || subLoading} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
