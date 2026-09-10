export interface Activity {
  id: string;
  ticketId: string;
  action: string;
  actorId: string;
  actorName: string;
  timestamp: string;
  time: string;
  details?: string;
}
