'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, MoreVertical, UserCheck, UserX, Trash2, AlertTriangle } from 'lucide-react';
import { useSuperAdminAuth } from '../context/SuperAdminAuthContext';
import { createSuperAdminApi } from '../lib/api';
import { toast } from 'react-toastify';

function StatusBadge({ status }) {
  const map = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-500',
    suspended: 'bg-red-100 text-red-600',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${map[status] || map.inactive}`}>
      {status}
    </span>
  );
}

function UserInitials({ name }) {
  const parts = (name || '').trim().split(' ');
  const initials = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : (name || '?')[0];
  const colors = [
    'bg-purple-100 text-purple-700',
    'bg-blue-100 text-blue-700',
    'bg-green-100 text-green-700',
    'bg-orange-100 text-orange-700',
    'bg-pink-100 text-pink-700',
  ];
  const color = colors[(name?.charCodeAt(0) || 0) % colors.length];
  return (
    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${color}`}>
      {initials.toUpperCase()}
    </span>
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

export default function SuperAdminUsers() {
  const { superAdmin } = useSuperAdminAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // { user, permanent }
  const [deleteLoading, setDeleteLoading] = useState(false);

  const PAGE_SIZE = 20;

  const fetchUsers = useCallback(async (pageNum = 1) => {
    if (!superAdmin?.access) return;
    setLoading(true);
    try {
      const api = createSuperAdminApi(superAdmin.access);
      const params = new URLSearchParams({ page: pageNum });
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (search) params.append('search', search);
      const res = await api.get(`/super-admin/users/?${params.toString()}`);
      setUsers(res.data.results || []);
      setTotalPages(res.data.total_pages || 1);
      setTotalCount(res.data.count || 0);
    } catch (err) {
      toast.error('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [superAdmin?.access, statusFilter, search]);

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  // Reset to page 1 and refetch when filters change
  useEffect(() => {
    setPage(1);
    fetchUsers(1);
  }, [statusFilter, search]);

  const toggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    setTogglingId(user.id);
    setMenuOpen(null);
    try {
      const api = createSuperAdminApi(superAdmin.access);
      await api.patch(`/super-admin/users/${user.id}/status/`, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      );
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`);
    } catch (err) {
      toast.error('Failed to update user status');
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!confirmDelete) return;
    const { user, permanent } = confirmDelete;
    setDeleteLoading(true);
    try {
      const api = createSuperAdminApi(superAdmin.access);
      const url = permanent
        ? `/super-admin/users/${user.id}/?permanent=true`
        : `/super-admin/users/${user.id}/`;
      await api.delete(url);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast.success(permanent ? 'User permanently deleted' : 'User soft deleted');
      setConfirmDelete(null);
    } catch (err) {
      toast.error('Failed to delete user');
    } finally {
      setDeleteLoading(false);
    }
  };

  const startIndex = (page - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(page * PAGE_SIZE, totalCount);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Users Management</h1>
        <p className="text-sm text-gray-400 mt-1">Manage all users across all organizations</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-4">
        <div className="flex flex-col sm:flex-row gap-3 p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3EBF0F] focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'active', 'inactive', 'suspended'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 text-xs font-medium rounded-lg capitalize transition-colors ${
                  statusFilter === s
                    ? 'bg-[#3EBF0F] text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
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
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Company</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Plan</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Role</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Joined</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="flex justify-center">
                      <div className="w-5 h-5 border-2 border-[#3EBF0F] border-t-transparent rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-sm text-gray-400">No users found</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <UserInitials name={user.full_name || user.email} />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 text-sm truncate max-w-[160px]">
                            {user.full_name || '—'}
                          </p>
                          <p className="text-xs text-gray-400 truncate max-w-[160px]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600 text-xs truncate max-w-[140px]">{user.company_name}</td>
                    <td className="px-5 py-3 text-gray-600 text-xs">{user.plan_name}</td>
                    <td className="px-5 py-3 text-gray-600 text-xs">{user.role}</td>
                    <td className="px-5 py-3"><StatusBadge status={user.status} /></td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{user.joined_date}</td>
                    <td className="px-5 py-3">
                      <div className="relative">
                        <button
                          onClick={() => setMenuOpen(menuOpen === user.id ? null : user.id)}
                          disabled={togglingId === user.id}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40"
                        >
                          {togglingId === user.id ? (
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <MoreVertical className="w-4 h-4" />
                          )}
                        </button>
                        {menuOpen === user.id && (
                          <div className="absolute right-0 top-8 bg-white rounded-lg border border-gray-200 shadow-lg z-10 min-w-[160px] py-1">
                            <button
                              onClick={() => toggleStatus(user)}
                              className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50 ${
                                user.status === 'active' ? 'text-red-500' : 'text-green-600'
                              }`}
                            >
                              {user.status === 'active' ? (
                                <><UserX className="w-3.5 h-3.5" /> Suspend User</>
                              ) : (
                                <><UserCheck className="w-3.5 h-3.5" /> Activate User</>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              {loading ? 'Loading...' : `Showing ${startIndex}–${endIndex} of ${totalCount} users`}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pn = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return (
                  <button
                    key={pn}
                    onClick={() => setPage(pn)}
                    className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                      page === pn ? 'bg-[#3EBF0F] text-white' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {pn}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {menuOpen && <div className="fixed inset-0 z-[5]" onClick={() => setMenuOpen(null)} />}
    </div>
  );
}
