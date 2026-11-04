const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** Formats an ISO date (YYYY-MM-DD) as "Jan 2025". Invalid input returns "". */
export function formatMonthYear(iso: string | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : formatter.format(date);
}

/** "Jan 2024 – Present", "Jan 2024 – Mar 2025", or a single date. */
export function formatDateRange(
  start: string | undefined,
  end: string | undefined,
  ongoingLabel = "Present",
): string {
  const from = formatMonthYear(start);
  const to = end ? formatMonthYear(end) : ongoingLabel;
  if (!from) return end ? to : "";
  return from === to ? from : `${from} – ${to}`;
}
