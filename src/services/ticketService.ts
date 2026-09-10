import { api } from './api'
import type { Ticket } from '../types'

export const ticketService = {
  list: () => api.get<Ticket[]>('/tickets').then(r => r.data),
  get: (id: string) => api.get<Ticket>(`/tickets/${id}`).then(r => r.data),
  create: (data: Omit<Ticket,'id'>) => api.post<Ticket>('/tickets', data).then(r => r.data),
  update: (id: string, data: Partial<Ticket>) =>
  api.put<Ticket>(`/tickets/${id}`, data).then(r => r.data),
  remove: (id: string) => api.delete(`/tickets/${id}`)
}
