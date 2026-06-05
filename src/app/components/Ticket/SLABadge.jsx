import React from "react";

// Colour classes match the existing ticket-status pill styling
// (see STATUS_PILL_CLASSES in TicketsTable.jsx) so the badge slots into
// the row without a visual jump.
//
//   on_time  -> green   (open ticket still within its SLA window)
//   met      -> grey    (closed ticket that was resolved in time —
//                        de-emphasised since it's past tense)
//   overdue  -> red
const SLA_BADGE_CLASSES = {
  on_time: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  met: "bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400",
  overdue: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

const buildLabel = (slaStatus) => {
  const state = slaStatus?.state;
  if (state === "on_time") return "On time";
  if (state === "met") return "Met";
  if (state === "overdue") {
    const days = slaStatus.days_overdue;
    // `days_overdue` is only present when state === "overdue", but defend
    // against the field being absent so we still render something rather
    // than crashing.
    if (days == null) return "Overdue";
    return days === 1 ? "Overdue by 1 day" : `Overdue by ${days} days`;
  }
  return null;
};

// Renders nothing when slaStatus is null / missing / has an unknown state.
// The brief calls for the row slot to collapse rather than show a placeholder.
const SLABadge = ({ slaStatus, className = "" }) => {
  if (!slaStatus || !slaStatus.state) return null;
  const label = buildLabel(slaStatus);
  if (!label) return null;
  const colourClasses = SLA_BADGE_CLASSES[slaStatus.state] || SLA_BADGE_CLASSES.met;
  return (
    <span
      className={`px-2 py-1 text-xs rounded font-medium whitespace-nowrap ${colourClasses} ${className}`}
    >
      {label}
    </span>
  );
};

export default SLABadge;
