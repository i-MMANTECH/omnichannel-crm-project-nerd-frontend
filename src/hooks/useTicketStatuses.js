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
let cachedLegacyMap = null;
let inflight = null;

const fetchAll = async (axiosInstance) => {
  // Effective drives all UI display. Legacy is fetched only for the name → id
  // map used by expandStatusIdsForFilter — we need Closed's id when
  // simplification is on (Closed isn't in the effective list in that mode)
  // so the list-filter query can match both Resolved and Closed tickets.
  // Per NBS-190 the legacy endpoint stays alive; this is filter plumbing,
  // not UI consumption.
  const [effRes, legacyRes] = await Promise.all([
    axiosInstance.get("/tickets/statuses/effective/"),
    axiosInstance.get("/tickets/statuses/"),
  ]);
  const effective = effRes?.data?.success ? (effRes.data.statuses || []) : [];
  const legacy = legacyRes?.data?.success ? (legacyRes.data.statuses || []) : [];
  const legacyMap = legacy.reduce((m, s) => {
    if (s?.name && s?.id !== undefined) m[s.name] = s.id;
    return m;
  }, {});
  return { effective, legacyMap };
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

export const useTicketStatuses = () => {
  const { axiosInstance } = useApi();
  const [statuses, setStatuses] = useState(cachedEffective || []);
  const [loading, setLoading] = useState(!cachedEffective);

  useEffect(() => {
    if (cachedEffective) {
      setStatuses(cachedEffective);
      setLoading(false);
      return;
    }
    if (!inflight) {
      inflight = fetchAll(axiosInstance)
        .then(({ effective, legacyMap }) => {
          cachedEffective = effective;
          cachedLegacyMap = legacyMap;
          return effective;
        })
        .catch((err) => {
          // Don't poison the cache. Let the next mount retry.
          inflight = null;
          throw err;
        });
    }
    let mounted = true;
    inflight
      .then((effective) => {
        if (!mounted) return;
        setStatuses(effective);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
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

  // Allow callers (e.g. an admin toggle UI in a later epic) to invalidate the
  // cache and refetch. Not used in this ticket but exposed for completeness.
  const refetch = async () => {
    cachedEffective = null;
    cachedLegacyMap = null;
    inflight = null;
    setLoading(true);
    try {
      const { effective, legacyMap } = await fetchAll(axiosInstance);
      cachedEffective = effective;
      cachedLegacyMap = legacyMap;
      setStatuses(effective);
    } finally {
      setLoading(false);
    }
  };

  return {
    statuses,
    loading,
    expandStatusIdsForFilter,
    resolveDisplayStatus: (ticketStatus) => resolveDisplayStatus(statuses, ticketStatus),
    refetch,
  };
};
