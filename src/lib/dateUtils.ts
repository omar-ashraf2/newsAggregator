import { formatDistanceToNow } from "date-fns";

/**
 * Returns a human-readable time difference (e.g., "5 minutes ago").
 *
 * @param dateString - ISO date string or Date object
 * @returns Formatted time difference
 */
export const getTimeAgo = (dateString: string | Date): string => {
  if (!dateString) return "Unknown time";

  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;
  return formatDistanceToNow(date, { addSuffix: true });
};
