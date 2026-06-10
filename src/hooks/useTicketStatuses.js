"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/services/axiosConfig";

// Module-level cache shared across every consumer of the hook in this
// page-session. The brief asked for "one fetch per page mount" rather than
// per modal open. First component to mount triggers the fetch, the rest read
// the cache. Cache lives until refetch() is called explicitly or the page
// reloads (e.g. when an admin flips the simplification toggle and wants the
// UI to reflect it without manually refreshing).
let cachedEffective = null;
let cachedGrouped = null;
let cachedLegacyMap = null;
let inflight = null;

// Subscriber list of mounted-hook state setters. When refetch() succeeds —
// after an admin CRUDs a custom status from the Epic B modals — we
// broadcast the new payload to every live consumer so the row dropdown,
// the create/edit modals, the stat cards, and the filter chips all rerender
// in sync. Without this broadcast, only the component that called refetch()
// would see the new data; everything else would stay stale until the next
// page mount.
const subscribers = new Set();
const broadcast = ({ effective, grouped }) => {
  subscribers.forEach((handler) => handler({ effective, grouped }));
};

// Pill colour classes keyed on category (to_do / in_progress / done). Per the
// new PRD (Ticket Status Overhaul v2), pill colour derives from category, not
// from status name. Status names are just labels; category drives every
// system-level visual cue.
export const CATEGORY_PILL_CLASSES = {
  to_do: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  in_progress: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  done: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
};

// Background tint for the coloured dot rendered in category-group headers.
// Keyed on the colour string the backend ships ("red" / "yellow" / "green").
// We avoid hardcoded hex so theme tokens stay consistent across the app.
export const CATEGORY_DOT_CLASSES = {
  red: "bg-red-500",
  yellow: "bg-yellow-500",
  green: "bg-green-500",
};

export const getCategoryPillClasses = (category) =>
  CATEGORY_PILL_CLASSES[category] || "bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400";

const fetchAll = async (axiosInstance) => {
  // Three endpoints fetched in parallel on first mount:
  //
  //   /tickets/statuses/grouped/   (NBS-195, Epic A) — drives every status
  //     dropdown. Returns the three fixed categories with nested statuses.
  //   /tickets/statuses/effective/ (NBS-190)         — drives the flat list
  //     consumed by the stat cards, filter chips, and resolveDisplayStatus
  //     for the merged-Resolved fallback under simplification-on.
  //   /tickets/statuses/           (legacy)          — name → id map used
  //     by expandStatusIdsForFilter to expand a merged-Resolved selection
  //     into both Resolved and Closed ids on the list-filter query.
  //
  // Per NBS-195 the legacy endpoint stays alive for non-FE consumers; we
  // keep it on the FE side strictly as filter plumbing, never for UI.
  const [groupedRes, effRes, legacyRes] = await Promise.all([
    axiosInstance.get("/tickets/statuses/grouped/"),
    axiosInstance.get("/tickets/statuses/effective/"),
    axiosInstance.get("/tickets/statuses/"),
  ]);
  const grouped = groupedRes?.data?.success ? (groupedRes.data.categories || []) : [];
  const effective = effRes?.data?.success ? (effRes.data.statuses || []) : [];
  const legacy = legacyRes?.data?.success ? (legacyRes.data.statuses || []) : [];
  const legacyMap = legacy.reduce((m, s) => {
    if (s?.name && s?.id !== undefined) m[s.name] = s.id;
    return m;
  }, {});
  return { grouped, effective, legacyMap };
};

// Given a ticket's backing status, return the effective list entry that
// stands in for it. When simplification is on and the backing status is
// Closed, this returns the merged-Resolved entry. When simplification is
// off, no entry has `represents`, so this returns the backing status as-is.
export const resolveDisplayStatus = (statuses, ticketStatus) => {
  if (!ticketStatus) return null;
  if (!Array.isArray(statuses) || statuses.length === 0) return ticketStatus;
  const merged = statuses.find(
    (s) => Array.isArray(s.represents) && s.represents.includes(ticketStatus.name)
  );
  return merged || ticketStatus;
};

// Convert the raw grouped categories into react-select's grouped options
// shape. Each top-level entry becomes a group with its own options array.
// The group object carries `colour` and `key` so a custom formatGroupLabel
// can render the coloured dot per NBS-195's contract. Empty categories
// still produce a group (with options: []) so the FE doesn't have to
// special-case ordering.
export const buildGroupedSelectOptions = (groupedStatuses) =>
  (groupedStatuses || []).map((category) => ({
    label: category.label,
    colour: category.colour,
    key: category.key,
    options: (category.statuses || []).map((s) => ({
      value: s.id,
      label: s.label,
      name: s.name,
      category: s.category,
    })),
  }));

export const useTicketStatuses = () => {
  const { axiosInstance } = useApi();
  const [statuses, setStatuses] = useState(cachedEffective || []);
  const [groupedStatuses, setGroupedStatuses] = useState(cachedGrouped || []);
  const [loading, setLoading] = useState(!cachedEffective || !cachedGrouped);

  useEffect(() => {
    let mounted = true;
    // Subscribe to broadcasts so a refetch() from any modal in any
    // consumer reaches this instance's state too.
    const handler = ({ effective, grouped }) => {
      if (!mounted) return;
      setStatuses(effective);
      setGroupedStatuses(grouped);
      setLoading(false);
    };
    subscribers.add(handler);

    if (cachedEffective && cachedGrouped) {
      setStatuses(cachedEffective);
      setGroupedStatuses(cachedGrouped);
      setLoading(false);
      return () => {
        mounted = false;
        subscribers.delete(handler);
      };
    }
    if (!inflight) {
      inflight = fetchAll(axiosInstance)
        .then(({ grouped, effective, legacyMap }) => {
          cachedGrouped = grouped;
          cachedEffective = effective;
          cachedLegacyMap = legacyMap;
          return { grouped, effective };
        })
        .catch((err) => {
          // Don't poison the cache. Let the next mount retry.
          inflight = null;
          throw err;
        });
    }
    inflight
      .then(({ grouped, effective }) => {
        if (!mounted) return;
        setStatuses(effective);
        setGroupedStatuses(grouped);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
      subscribers.delete(handler);
    };
  }, [axiosInstance]);

  // Expand an array of selected status ids for the list-filter query. Any id
  // that matches a merged entry expands into the underlying ids resolved via
  // the legacy name → id map. Other ids pass through unchanged. Returns a
  // de-duplicated array of numeric ids.
  const expandStatusIdsForFilter = (ids) => {
    const out = new Set();
    const list = Array.isArray(ids) ? ids : [];
    for (const raw of list) {
      const id = typeof raw === "number" ? raw : Number(raw);
      const entry = statuses.find((s) => s.id === id);
      if (entry?.represents?.length && cachedLegacyMap) {
        for (const name of entry.represents) {
          const mappedId = cachedLegacyMap[name];
          if (mappedId !== undefined) out.add(mappedId);
        }
      } else if (!Number.isNaN(id)) {
        out.add(id);
      }
    }
    return Array.from(out);
  };

  // Bust the module-level cache, refetch, broadcast the new payload to
  // every subscribed instance. Called by the Epic B CRUD modals on every
  // success — the row dropdown, the create/edit dropdowns, and the stat
  // cards all rerender in sync without anyone re-mounting.
  const refetch = async () => {
    cachedEffective = null;
    cachedGrouped = null;
    cachedLegacyMap = null;
    inflight = null;
    setLoading(true);
    try {
      const { grouped, effective, legacyMap } = await fetchAll(axiosInstance);
      cachedGrouped = grouped;
      cachedEffective = effective;
      cachedLegacyMap = legacyMap;
      broadcast({ effective, grouped });
    } finally {
      setLoading(false);
    }
  };

  return {
    statuses,
    groupedStatuses,
    loading,
    expandStatusIdsForFilter,
    resolveDisplayStatus: (ticketStatus) => resolveDisplayStatus(statuses, ticketStatus),
    refetch,
  };
};
