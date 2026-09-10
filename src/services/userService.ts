import { api } from './api'
import type { User } from '../types'

export const userService = {
  list: () => api.get<User[]>('/users').then(r => r.data),

  get: (id: string) => api.get<User>(`/users/${id}`).then(r => r.data),

  create: (data: Omit<User, 'id'>) =>
    api.post<User>('/users', data).then(r => r.data),

  update: (id: string, data: Partial<User>) =>
    api.put<User>(`/users/${id}`, data).then(r => r.data),

  remove: (id: string) => api.delete(`/users/${id}`)
}