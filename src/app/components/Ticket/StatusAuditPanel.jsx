import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Image from 'next/image';
import { selectStyles } from '../selectStyles';
import { useApi } from '@/services/axiosConfig';
import UserAvatar from '../UserAvatar';
import Pagination from '@/app/components/Pagination/Pagination';
import { timeAgo } from '@/utils/timeUtils';

// UI label → API action value. "All" omits the action param entirely.
// Values mirror the activity_logs/services.py Actions constants the backend
// emits when the Epic B CRUD paths fire.
const ACTION_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'create_status', label: 'Created' },
  { value: 'rename_status', label: 'Renamed' },
  { value: 'recategorise_status', label: 'Recategorised' },
  { value: 'delete_status', label: 'Deleted' },
  { value: 'reassign_tickets_bulk', label: 'Reassigned' },
];

const DEFAULT_PAGE_SIZE = 20;

// Resolve the impacted-ticket-count badge for an audit row. Returns null when
// no badge should render. Three audit actions carry a count:
//
//   recategorise_status (ticket_count > 0)  → "{N} tickets impacted"
//   delete_status       (ticket_count > 0)  → "{N} tickets reassigned"
//   reassign_tickets_bulk                   → "{N} tickets → {new_status_name}"
//
// create_status, rename_status, and the simple delete (count = 0) get no
// badge per the brief.
const resolveImpactBadge = (log) => {
  if (!log) return null;
  const count = log?.metadata?.ticket_count;
  const numeric = Number(count);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    if (log.action !== 'reassign_tickets_bulk') return null;
  }
  const pluralise = (n, word) => (n === 1 ? word : `${word}s`);
  if (log.action === 'recategorise_status') {
    return `${numeric} ${pluralise(numeric, 'ticket')} impacted`;
  }
  if (log.action === 'delete_status') {
    return `${numeric} ${pluralise(numeric, 'ticket')} reassigned`;
  }
  if (log.action === 'reassign_tickets_bulk') {
    const target = log?.metadata?.new_status_name || 'replacement';
    return `${numeric} ${pluralise(numeric, 'ticket')} → ${target}`;
  }
  return null;
};

const resolveUserDisplayName = (user) => {
  if (!user) return '--';
  const first = (user.first_name || '').trim();
  const last = (user.last_name || '').trim();
  const full = `${first} ${last}`.trim();
  if (full) return full;
  return user.email || '--';
};

// Renders the Audit History tab content inside EditStatusListModal. Self-
// contained: manages its own filter + page state, hits
// /api/tickets/statuses/audit/, and resets on every modal close via the
// parent unmounting it (Modal returns null when !isOpen, so the panel
// unmounts and any re-mount starts fresh).
const StatusAuditPanel = () => {
  const { axiosInstance } = useApi();

  const [logs, setLogs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [actionFilter, setActionFilter] = useState(ACTION_OPTIONS[0]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const buildParams = () => {
    const params = { page: currentPage, page_size: pageSize };
    if (actionFilter?.value) params.action = actionFilter.value;
    if (fromDate) params.from = fromDate;
    if (toDate) params.to = toDate;
    return params;
  };

  const fetchAudit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get(
        '/tickets/statuses/audit/',
        { params: buildParams() },
      );
      const data = response?.data || {};
      if (data.success === false) {
        const message = data?.error?.message
          || (typeof data?.error === 'string' ? data.error : '')
          || 'Couldn\'t load audit history. Try again.';
        setError(message);
        // Don't blank previous results on error per the brief — leave logs
        // in place so the admin still has context while they retry.
      } else {
        setLogs(Array.isArray(data.audit) ? data.audit : []);
        const totalCount = data?.pagination?.count;
        const totalPagesFromApi = data?.pagination?.total_pages;
        if (Number.isFinite(totalPagesFromApi)) {
          setTotalPages(Math.max(1, totalPagesFromApi));
        } else if (Number.isFinite(totalCount)) {
          setTotalPages(Math.max(1, Math.ceil(totalCount / pageSize)));
        } else {
          setTotalPages(1);
        }
      }
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.error
        || err?.response?.data?.message
        || 'Couldn\'t load audit history. Try again.';
      if (status >= 400 && status < 500 && typeof message === 'string') {
        setError(message);
      } else {
        setError('Couldn\'t load audit history. Try again.');
      }
      // Same rationale as above: preserve previous results.
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch + every page/filter change. currentPage is reset to 1
  // by the filter handlers below, so this effect handles both vectors of
  // refetch.
  useEffect(() => {
    fetchAudit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, actionFilter?.value, fromDate, toDate]);

  const handleActionChange = (option) => {
    setActionFilter(option || ACTION_OPTIONS[0]);
    setCurrentPage(1);
  };

  const handleFromChange = (e) => {
    setFromDate(e.target.value);
    setCurrentPage(1);
  };

  const handleToChange = (e) => {
    setToDate(e.target.value);
    setCurrentPage(1);
  };

  const handleRetry = () => {
    fetchAudit();
  };

  const isEmpty = !loading && logs.length === 0 && !error;

  return (
    <div className="flex flex-col gap-4">
      {/* Filter bar — Date range (From + To) and Action dropdown. Layout
          stacks on narrow widths via flex-wrap; on the 600px-wide modal
          the three controls sit on one row when the viewport permits. */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
            From
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={handleFromChange}
            max={toDate || undefined}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md body-theme focus:outline-none focus:ring-2 focus:ring-[#3EBF0F]"
          />
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
            To
          </label>
          <input
            type="date"
            value={toDate}
            onChange={handleToChange}
            min={fromDate || undefined}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md body-theme focus:outline-none focus:ring-2 focus:ring-[#3EBF0F]"
          />
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
            Action
          </label>
          <Select
            value={actionFilter}
            onChange={handleActionChange}
            options={ACTION_OPTIONS}
            styles={selectStyles}
            isSearchable={false}
          />
        </div>
      </div>

      {/* Body region — preserves previous results behind a spinner overlay
          on subsequent fetches per the brief ("Don't blank the previous
          results — that flickers"). */}
      <div className="relative min-h-[200px]">
        {loading && logs.length === 0 && !error && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#3EBF0F]" />
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center text-center py-6 px-4 border border-red-200 dark:border-red-900/40 rounded-md bg-red-50 dark:bg-red-900/10">
            <p className="text-sm text-red-600 dark:text-red-400 mb-3">
              {error}
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="px-4 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Try again
            </button>
          </div>
        )}

        {isEmpty && (
          <div className="flex flex-col items-center justify-center text-center py-12 px-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              No status changes recorded yet. Create, edit, or delete a
              custom status and the history will appear here.
            </p>
          </div>
        )}

        {logs.length > 0 && (
          <ul className="flex flex-col gap-3">
            {logs.map((log) => {
              const badge = resolveImpactBadge(log);
              const displayName = resolveUserDisplayName(log?.user);
              const userImage = log?.user?.image;
              return (
                <li
                  key={log.id}
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 p-3"
                >
                  <div className="flex items-start gap-3">
                    {userImage ? (
                      <Image
                        alt="profile pic"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full flex-shrink-0"
                        src={userImage}
                      />
                    ) : (
                      <UserAvatar
                        name={displayName === '--' ? '--' : displayName}
                        width="w-8"
                        height="h-8"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {log?.created_at ? timeAgo(log.created_at) : ''}
                        </p>
                      </div>
                      {/* Description is rendered verbatim from the backend
                          per the brief — no client-side templating, no
                          string substitution. */}
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {log?.description}
                      </p>
                      {badge && (
                        <span className="inline-flex items-center mt-2 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300">
                          {badge}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Subtle in-flight indicator when refetching on top of existing
            results. Keeps the rows visible behind it so the admin doesn't
            see a flash to empty between filter changes. */}
        {loading && logs.length > 0 && !error && (
          <div className="absolute top-2 right-2">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-[#3EBF0F]" />
          </div>
        )}
      </div>

      {logs.length > 0 && totalPages > 1 && (
        <div className="mt-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            pageSize={pageSize}
          />
        </div>
      )}
    </div>
  );
};

export default StatusAuditPanel;
