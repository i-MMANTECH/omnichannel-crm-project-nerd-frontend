// Format an integer number of seconds (e.g. the backend's
// `ticket.resolution_time`) as a short human string.
//
//   null / undefined  -> "Not yet resolved"
//   90                -> "1m"
//   3600              -> "1h"
//   3900              -> "1h 5m"
//   86400             -> "1d"
//   90000             -> "1d 1h"
//
// Pulled from the NOCF-219 brief verbatim and exported separately so it can
// be reused by anywhere else that surfaces resolution_time (e.g. a future
// SLA report).

const formatResolutionTime = (seconds) => {
  if (seconds == null) return "Not yet resolved";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days >= 1) return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  if (hours >= 1) return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  return `${minutes}m`;
};

export default formatResolutionTime;
