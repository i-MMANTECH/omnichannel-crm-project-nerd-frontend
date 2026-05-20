'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronDown, Building2, Users, CreditCard, TrendingUp, ExternalLink, X, Edit2, Trash2, Power, PowerOff, AlertTriangle, RefreshCw, CheckCircle, XCircle, MinusCircle } from 'lucide-react';
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

function ConfirmModal({ open, title, message, confirmLabel, confirmClass, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} disabled={loading} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} className={`px-4 py-2 text-sm text-white rounded-lg transition-colors disabled:opacity-60 ${confirmClass}`}>
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

const INTEGRATION_STATUS = {
  active:         { label: 'Active',          icon: CheckCircle,  cls: 'text-green-600' },
  inactive:       { label: 'Inactive',        icon: XCircle,      cls: 'text-red-500'   },
  not_configured: { label: 'Not configured',  icon: MinusCircle,  cls: 'text-gray-400'  },
};

function IntegrationRow({ integration, onRetry, retrying }) {
  const { label, icon: Icon, cls } = INTEGRATION_STATUS[integration.status] || INTEGRATION_STATUS.not_configured;
  const canRetry = ['cloudpbx', 'ai_service'].includes(integration.key) && integration.status !== 'active';
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-2.5">
        <Icon className={`w-4 h-4 flex-shrink-0 ${cls}`} />
        <span className="text-sm text-gray-700">{integration.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium ${cls}`}>{label}</span>
        {canRetry && (
          <button
            onClick={() => onRetry(integration)}
            disabled={retrying}
            title="Retry setup"
            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-[#3EBF0F] transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${retrying ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>
    </div>
  );
}

function CloudPBXIntegrationRow({ integration, companyId, onRetry, retrying, onRefreshIntegrations }) {
  const { superAdmin } = useSuperAdminAuth();
  const [expanded, setExpanded] = useState(false);
  const [retryingUserId, setRetryingUserId] = useState(null);
  const { label, icon: Icon, cls } = INTEGRATION_STATUS[integration.status] || INTEGRATION_STATUS.not_configured;
  const canRetry = integration.status !== 'active';
  const users = integration.details?.users || [];
  const provisioned = users.filter((u) => u.sip_device_created).length;

  const handleUserSIPRetry = async (user) => {
    setRetryingUserId(user.id);
    try {
      const api = createSuperAdminApi(superAdmin.access);
      await api.post(`/super-admin/companies/${companyId}/integrations/cloudpbx/retry/${user.id}/`);
      toast.success(`SIP device provisioning queued for ${user.full_name}`);
      setTimeout(async () => {
        try { await onRefreshIntegrations(); } catch (_) {}
        setRetryingUserId(null);
      }, 5000);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to queue SIP provisioning';
      toast.error(msg);
      setRetryingUserId(null);
    }
  };

  return (
    <div className="border-b border-gray-50 last:border-0">
      <div className="flex items-center justify-between py-2.5">
        <div className="flex items-center gap-2.5">
          <Icon className={`w-4 h-4 flex-shrink-0 ${cls}`} />
          <span className="text-sm text-gray-700">{integration.name}</span>
          {users.length > 0 && (
            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
              {provisioned}/{users.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-medium ${cls}`}>{label}</span>
          {canRetry && (
            <button
              onClick={() => onRetry(integration)}
              disabled={retrying}
              title="Retry setup"
              className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-[#3EBF0F] transition-colors disabled:opacity-40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${retrying ? 'animate-spin' : ''}`} />
            </button>
          )}
          {users.length > 0 && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="p-1 rounded hover:bg-gray-100 text-gray-400 transition-colors"
              title={expanded ? 'Hide users' : 'Show users'}
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${expanded ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="pb-2 space-y-0.5">
          {users.map((u) => (
            <div key={u.id} className="flex items-center gap-2 px-1 py-1.5 rounded-lg hover:bg-white transition-colors">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${u.sip_device_created ? 'bg-green-500' : 'bg-red-400'}`} />
              <span className="text-xs text-gray-700 flex-1 truncate min-w-0">{u.full_name}</span>
              <span className="text-xs text-gray-400 truncate max-w-[100px] hidden sm:block">{u.email}</span>
              {u.sip_device_created ? (
                <span className="text-xs font-medium text-green-600 flex-shrink-0">Provisioned</span>
              ) : (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-xs font-medium text-red-500">No SIP</span>
                  <button
                    onClick={() => handleUserSIPRetry(u)}
                    disabled={retryingUserId === u.id}
                    title="Provision SIP device"
                    className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-[#3EBF0F] transition-colors disabled:opacity-40"
                  >
                    <RefreshCw className={`w-3 h-3 ${retryingUserId === u.id ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
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

  // Integrations state
  const [integrations, setIntegrations] = useState([]);
  const [integrationsLoading, setIntegrationsLoading] = useState(false);
  const [retrying, setRetrying] = useState(false);

  // Edit name state
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [nameSaving, setNameSaving] = useState(false);

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState(null); // { type, permanent }
  const [actionLoading, setActionLoading] = useState(false);

  // DID assignment state
  const [assigningDID, setAssigningDID] = useState(false);

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
    setEditingName(false);
    setIntegrations([]);
    try {
      const api = createSuperAdminApi(superAdmin.access);
      const [detailRes, intRes] = await Promise.all([
        api.get(`/super-admin/companies/${company.id}`),
        api.get(`/super-admin/companies/${company.id}/integrations/`),
      ]);
      setSelectedCompany(detailRes.data.organization);
      setIntegrations(intRes.data.integrations || []);
    } catch (err) {
      toast.error('Failed to load company details');
      setSelectedCompany(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const refreshIntegrations = useCallback(async (companyId) => {
    const api = createSuperAdminApi(superAdmin.access);
    const r = await api.get(`/super-admin/companies/${companyId}/integrations/`);
    setIntegrations(r.data.integrations || []);
  }, [superAdmin?.access]);

  const RETRY_CONFIG = {
    cloudpbx: {
      url: (id) => `/super-admin/companies/${id}/integrations/cloudpbx/retry/`,
      successMsg: 'PBX setup queued — check status in a few seconds',
      errorMsg: 'Failed to queue PBX setup',
    },
    ai_service: {
      url: (id) => `/super-admin/companies/${id}/integrations/ai-service/retry/`,
      successMsg: 'AI service setup queued — check status in a few seconds',
      errorMsg: 'Failed to queue AI service setup',
    },
  };

  const handleRetryIntegration = async (integration) => {
    const cfg = RETRY_CONFIG[integration.key];
    if (!cfg) return;
    setRetrying(true);
    try {
      const api = createSuperAdminApi(superAdmin.access);
      await api.post(cfg.url(selectedCompany.id));
      toast.success(cfg.successMsg);
      setTimeout(async () => {
        try { await refreshIntegrations(selectedCompany.id); } catch (_) {}
        setRetrying(false);
      }, 5000);
    } catch (err) {
      toast.error(err.response?.data?.error || cfg.errorMsg);
      setRetrying(false);
    }
  };

  const closeDetail = () => {
    setSelectedCompany(null);
    setEditingName(false);
    setConfirmModal(null);
    setActionLoading(false);
    setRetrying(false);
  };

  const handleAssignDID = async () => {
    setAssigningDID(true);
    try {
      const api = createSuperAdminApi(superAdmin.access);
      const res = await api.post(`/super-admin/companies/${selectedCompany.id}/assign-did/`);
      const didNumber = res.data.did_number;
      setSelectedCompany((c) => ({ ...c, did_number: didNumber }));
      toast.success(`DID ${didNumber} assigned successfully`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to assign DID');
    } finally {
      setAssigningDID(false);
    }
  };

  const handleSaveName = async () => {
    if (!nameInput.trim() || nameInput.trim() === selectedCompany.name) {
      setEditingName(false);
      return;
    }
    setNameSaving(true);
    try {
      const api = createSuperAdminApi(superAdmin.access);
      await api.patch(`/super-admin/companies/${selectedCompany.id}/`, { name: nameInput.trim() });
      setSelectedCompany((c) => ({ ...c, name: nameInput.trim() }));
      setCompanies((prev) => prev.map((c) => c.id === selectedCompany.id ? { ...c, name: nameInput.trim() } : c));
      toast.success('Company name updated');
      setEditingName(false);
    } catch (err) {
      toast.error('Failed to update company name');
    } finally {
      setNameSaving(false);
    }
  };

  const handleToggleActive = async () => {
    const newActive = !selectedCompany.is_active;
    setActionLoading(true);
    try {
      const api = createSuperAdminApi(superAdmin.access);
      await api.patch(`/super-admin/companies/${selectedCompany.id}/`, { is_active: newActive });
      const newStatus = newActive ? 'active' : 'inactive';
      setSelectedCompany((c) => ({ ...c, is_active: newActive, status: newStatus }));
      setCompanies((prev) => prev.map((c) => c.id === selectedCompany.id ? { ...c, status: newStatus } : c));
      toast.success(`Company ${newActive ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      toast.error('Failed to update company status');
    } finally {
      setActionLoading(false);
      setConfirmModal(null);
    }
  };

  const handleDelete = async (permanent) => {
    setActionLoading(true);
    try {
      const api = createSuperAdminApi(superAdmin.access);
      const url = permanent
        ? `/super-admin/companies/${selectedCompany.id}/?permanent=true`
        : `/super-admin/companies/${selectedCompany.id}/`;
      await api.delete(url);
      setCompanies((prev) => prev.filter((c) => c.id !== selectedCompany.id));
      setTotalCount((n) => n - 1);
      toast.success(permanent ? 'Company permanently deleted' : 'Company deleted (soft)');
      closeDetail();
    } catch (err) {
      toast.error('Failed to delete company');
      setActionLoading(false);
      setConfirmModal(null);
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
            {['all', 'active', 'trial', 'churned', 'inactive'].map((s) => (
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
          <div className="absolute inset-0 bg-black/40" onClick={closeDetail} />
          <div className="relative w-full max-w-md bg-white h-full shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Company Details</h2>
              <button onClick={closeDetail} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {detailLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-6 h-6 border-2 border-[#3EBF0F] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="p-5 space-y-4">
                {/* Header with name */}
                <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingName ? (
                      <div className="flex items-center gap-2">
                        <input
                          autoFocus
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditingName(false); }}
                          className="flex-1 text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#3EBF0F]"
                        />
                        <button onClick={handleSaveName} disabled={nameSaving} className="px-2 py-1 text-xs bg-[#3EBF0F] text-white rounded-lg disabled:opacity-60">
                          {nameSaving ? '...' : 'Save'}
                        </button>
                        <button onClick={() => setEditingName(false)} className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded-lg">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-gray-800 text-lg truncate">{selectedCompany.name}</h3>
                        <button
                          onClick={() => { setEditingName(true); setNameInput(selectedCompany.name); }}
                          className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex-shrink-0"
                          title="Rename company"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    <StatusBadge status={selectedCompany.status} />
                  </div>
                </div>

                {/* Details grid */}
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

                {/* DID number */}
                <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 mb-1">DID Number</p>
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {selectedCompany.did_number ?? 'Not assigned'}
                    </p>
                  </div>
                  {!selectedCompany.did_number && (
                    <button
                      onClick={handleAssignDID}
                      disabled={assigningDID}
                      className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-white bg-[#3EBF0F] hover:bg-[#35a80d] rounded-lg transition-colors disabled:opacity-60"
                    >
                      {assigningDID ? 'Assigning…' : 'Assign DID'}
                    </button>
                  )}
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

                {/* Integrations health */}
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Integrations</p>
                  {integrationsLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="w-4 h-4 border-2 border-[#3EBF0F] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : integrations.length === 0 ? (
                    <p className="text-xs text-gray-400 py-2">No integration data available</p>
                  ) : (
                    <div className="bg-gray-50 rounded-lg px-3 py-1">
                      {integrations.map((integration) =>
                        integration.key === 'cloudpbx' ? (
                          <CloudPBXIntegrationRow
                            key="cloudpbx"
                            integration={integration}
                            companyId={selectedCompany.id}
                            onRetry={handleRetryIntegration}
                            retrying={retrying}
                            onRefreshIntegrations={() => refreshIntegrations(selectedCompany.id)}
                          />
                        ) : (
                          <IntegrationRow
                            key={integration.key}
                            integration={integration}
                            onRetry={handleRetryIntegration}
                            retrying={retrying}
                          />
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="pt-2 border-t border-gray-100 space-y-2">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Actions</p>

                  {/* Toggle active */}
                  <button
                    onClick={() => setConfirmModal({ type: 'toggle' })}
                    disabled={actionLoading}
                    className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm rounded-lg border transition-colors disabled:opacity-60 ${
                      selectedCompany.is_active
                        ? 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        : 'border-green-200 text-green-700 hover:bg-green-50'
                    }`}
                  >
                    {selectedCompany.is_active ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                    {selectedCompany.is_active ? 'Deactivate Company' : 'Activate Company'}
                  </button>

                  {/* Soft delete */}
                  <button
                    onClick={() => setConfirmModal({ type: 'delete', permanent: false })}
                    disabled={actionLoading}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm rounded-lg border border-orange-200 text-orange-600 hover:bg-orange-50 transition-colors disabled:opacity-60"
                  >
                    <Trash2 className="w-4 h-4" />
                    Soft Delete (hide from platform)
                  </button>

                  {/* Hard delete */}
                  <button
                    onClick={() => setConfirmModal({ type: 'delete', permanent: true })}
                    disabled={actionLoading}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60"
                  >
                    <Trash2 className="w-4 h-4" />
                    Permanently Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirm modals */}
      <ConfirmModal
        open={confirmModal?.type === 'toggle'}
        title={selectedCompany?.is_active ? 'Deactivate Company' : 'Activate Company'}
        message={
          selectedCompany?.is_active
            ? `Deactivating "${selectedCompany?.name}" will mark it as inactive. You can reactivate it at any time.`
            : `This will reactivate "${selectedCompany?.name}" on the platform.`
        }
        confirmLabel={selectedCompany?.is_active ? 'Deactivate' : 'Activate'}
        confirmClass={selectedCompany?.is_active ? 'bg-gray-700 hover:bg-gray-800' : 'bg-[#3EBF0F] hover:bg-[#35a80d]'}
        onConfirm={handleToggleActive}
        onCancel={() => setConfirmModal(null)}
        loading={actionLoading}
      />

      <ConfirmModal
        open={confirmModal?.type === 'delete' && !confirmModal?.permanent}
        title="Soft Delete Company"
        message={`"${selectedCompany?.name}" will be hidden from the platform but data will remain in the database. This can be reversed manually.`}
        confirmLabel="Soft Delete"
        confirmClass="bg-orange-500 hover:bg-orange-600"
        onConfirm={() => handleDelete(false)}
        onCancel={() => setConfirmModal(null)}
        loading={actionLoading}
      />

      <ConfirmModal
        open={confirmModal?.type === 'delete' && confirmModal?.permanent === true}
        title="Permanently Delete Company"
        message={`This will permanently delete "${selectedCompany?.name}" and ALL its data from the database. This cannot be undone.`}
        confirmLabel="Delete Forever"
        confirmClass="bg-red-600 hover:bg-red-700"
        onConfirm={() => handleDelete(true)}
        onCancel={() => setConfirmModal(null)}
        loading={actionLoading}
      />
    </div>
  );
}
