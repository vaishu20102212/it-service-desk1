import { api } from './api'
import type { Category } from '../types'
export const categoryService = {
  list: () => api.get<Category[]>('/categories').then(r => r.data),
  create: (data: Omit<Category,'id'>) => api.post<Category>('/categories', data).then(r => r.data),
  update: (id: string, data: Partial<Category>) => api.put<Category>(`/categories/${id}`, data).then(r => r.data),
  remove: (id: string) => api.delete(`/categories/${id}`)
}
