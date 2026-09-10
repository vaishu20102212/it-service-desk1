import type { TicketStatus } from "../types/ticket";

export const getStatusLabel = (
  status: TicketStatus
): string => {
  return status
    .replace("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};