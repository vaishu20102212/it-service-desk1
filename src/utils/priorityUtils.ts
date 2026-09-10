import type { TicketPriority } from "../types/ticket";

export const getPriorityLabel = (
  priority: TicketPriority
): string => {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};