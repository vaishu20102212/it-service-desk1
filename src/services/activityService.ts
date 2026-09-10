import { api } from './api'
import type { Activity } from '../types'

export const activityService = {
  list: (ticketId?: string) =>
    api.get<Activity[]>('/activities', { params: ticketId ? { ticketId } : {} }).then(r => r.data),
  log: (ticketId: string, action: string) =>
    api.post<Activity>('/activities', {
      ticketId,
      action,
      dateTime: new Date().toISOString(),
    }).then(r => r.data),
}
