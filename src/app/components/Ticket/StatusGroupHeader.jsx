import React from "react";
import { CATEGORY_DOT_CLASSES } from "@/hooks/useTicketStatuses";

// react-select hands `formatGroupLabel` the group object verbatim. We carry
// `colour` and `key` through buildGroupedSelectOptions so this component can
// render the coloured dot per category. Category headers are bold + not
// selectable (react-select's default behaviour for groups) — clicks on the
// header don't fire onChange.
//
// Used by the Status dropdowns in CreateTicketModal and UpdateTicketModal
// after NOCF-222. The native <select> in TicketsTable uses <optgroup>
// instead and styles its label via the browser, which can't render a
// coloured dot — that one just gets the label.
const StatusGroupHeader = ({ group }) => {
  const dotClass = CATEGORY_DOT_CLASSES[group?.colour] || "bg-gray-400";
  return (
    <div className="flex items-center gap-2 px-1 py-1">
      <span
        aria-hidden="true"
        className={`inline-block w-2.5 h-2.5 rounded-full ${dotClass}`}
      />
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
        {group?.label}
      </span>
    </div>
  );
};

export default StatusGroupHeader;
