'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, Building2, Users, CreditCard, TrendingUp, ExternalLink, X } from 'lucide-react';
import { useSuperAdminAuth } from '../context/SuperAdminAuthContext';
import { createSuperAdminApi } from '../lib/api';
import { toast } from 'react-toastify';

function StatusBadge({ status }) {
  const map = {
    active: 'bg-green-100 text-green-700',
    trial: 'bg-yellow-100 text-yellow-700',
    inactive: 'bg-gray-100 text-gray-500',
    churned: 'bg-red-100 text-red-600',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${map[status] || map.inactive}`}>
      {status}
    </span>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  const colorMap = {
    green: 'bg-green-50 text-[#3EBF0F]',
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    gray: 'bg-gray-100 text-gray-500',
    red: 'bg-red-50 text-red-500',
  };
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500">{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value ?? '—'}</p>
    </div>
  );
}

export default function SuperAdminCompanies() {
  const { superAdmin } = useSuperAdminAuth();
  const [companies, setCompanies] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const PAGE_SIZE = 20;

  const fetchCompanies = useCallback(async (pageNum = 1) => {
    if (!superAdmin?.access) return;
    setLoading(true);
    try {
      const api = createSuperAdminApi(superAdmin.access);
      const params = new URLSearchParams({ page: pageNum });
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (search) params.append('search', search);
      const res = await api.get(`/super-admin/companies/?${params.toString()}`);
      setCompanies(res.data.results || []);
      setTotalPages(res.data.total_pages || 1);
      setTotalCount(res.data.count || 0);
      if (res.data.summary) setSummary(res.data.summary);
    } catch (err) {
      toast.error('Failed to load companies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [superAdmin?.access, statusFilter, search]);

  useEffect(() => {
    fetchCompanies(page);
  }, [page]);

  useEffect(() => {
    setPage(1);
    fetchCompanies(1);
  }, [statusFilter, search]);

  const openDetail = async (company) => {
    setSelectedCompany({ ...company, _loading: true });
    setDetailLoading(true);
    try {
      const api = createSuperAdminApi(superAdmin.access);
      const res = await api.get(`/super-admin/companies/${company.id}`);
      setSelectedCompany(res.data.organization);
    } catch (err) {
      toast.error('Failed to load company details');
      setSelectedCompany(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const startIndex = (page - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(page * PAGE_SIZE, totalCount);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Organizations</h1>
        <p className="text-sm text-gray-400 mt-1">Manage all companies and organizations on the platform</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Companies" value={summary?.total ?? totalCount} icon={Building2} color="blue" />
        <StatCard label="Active" value={summary?.active} icon={TrendingUp} color="green" />
        <StatCard label="Trial" value={summary?.trial} icon={CreditCard} color="yellow" />
        <StatCard label="Churned" value={summary?.churned} icon={Users} color="red" />
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-4">
        <div className="flex flex-col sm:flex-row gap-3 p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by company name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3EBF0F] focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'active', 'trial', 'churned'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 text-xs font-medium rounded-lg capitalize transition-colors ${
                  statusFilter === s ? 'bg-[#3EBF0F] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Company</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Plan</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Members</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Created</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="flex justify-center">
                      <div className="w-5 h-5 border-2 border-[#3EBF0F] border-t-transparent rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : companies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-sm text-gray-400">No companies found</td>
                </tr>
              ) : (
                companies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-800 truncate max-w-[200px]">{company.name}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-600 text-xs">{company.plan_name}</td>
                    <td className="px-5 py-3 text-gray-600">{company.member_count}</td>
                    <td className="px-5 py-3"><StatusBadge status={company.status} /></td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{company.created_at}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => openDetail(company)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#3EBF0F] transition-colors"
                        title="View details"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
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
              {loading ? 'Loading...' : `Showing ${startIndex}–${endIndex} of ${totalCount} companies`}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || loading} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pn = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return (
                  <button key={pn} onClick={() => setPage(pn)} className={`w-7 h-7 rounded-lg text-xs font-medium ${page === pn ? 'bg-[#3EBF0F] text-white' : 'text-gray-500 hover:bg-gray-100'}`}>{pn}</button>
                );
              })}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || loading} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Company Detail Drawer */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedCompany(null)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Company Details</h2>
              <button onClick={() => setSelectedCompany(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {detailLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-6 h-6 border-2 border-[#3EBF0F] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{selectedCompany.name}</h3>
                    <StatusBadge status={selectedCompany.status} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Plan', value: selectedCompany.plan_name },
                    { label: 'Plan Price', value: selectedCompany.plan_price != null ? `$${selectedCompany.plan_price}/mo` : '—' },
                    { label: 'Members', value: selectedCompany.member_count },
                    { label: 'Member Since', value: selectedCompany.created_at },
                    { label: 'Username', value: selectedCompany.username },
                    { label: 'Referral Code', value: selectedCompany.referral_code },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">{label}</p>
                      <p className="text-sm font-medium text-gray-700 truncate">{value ?? '—'}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Email</p>
                  <p className="text-sm text-gray-700 break-all">{selectedCompany.company_email || selectedCompany.email}</p>
                </div>

                {selectedCompany.subscription_expires_at && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Subscription Expires</p>
                    <p className="text-sm text-gray-700">
                      {new Date(selectedCompany.subscription_expires_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
