import { api } from './api'
import type { Comment } from '../types'

export const commentService = {
  list: (ticketId?: string) =>
    api.get<Comment[]>('/comments', {
      params: ticketId ? { ticketId } : {}
    }).then(r => r.data),

  create: (data: Omit<Comment, 'id'>) =>
    api.post<Comment>('/comments', data).then(r => r.data),

  update: (id: string, data: Partial<Comment>) =>
    api.put<Comment>(`/comments/${id}`, data).then(r => r.data),

  remove: (id: string) =>
    api.delete(`/comments/${id}`)
}