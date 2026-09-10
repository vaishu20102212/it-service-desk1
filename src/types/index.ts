export type Role = 'Admin' | 'Support Agent' | 'Employee'
export type UserStatus = 'Active' | 'Inactive'
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical'
export type Status = 'Open' | 'Assigned' | 'In Progress' | 'Pending' | 'Resolved' | 'Closed' | 'Cancelled' | 'Reopened'

export interface User {
  id: string
  name: string
  email: string
  password: string
  phone: string
  department: string
  role: Role
  status: UserStatus
  createdAt: string
}

export interface Category {
  id: string
  name: string
  description: string
  status: UserStatus
}

export interface Ticket {
  id: string
  subject: string
  description: string
  createdBy: string
  assignedAgent: string
  category: string
  priority: Priority
  status: Status
  preferredContact: 'Email' | 'Phone' | 'Chat'
  createdAt: string
  updatedAt: string
  dueDate: string
  assignedDate: string
  resolution: string
  resolutionDate: string
}

export interface Comment {
  id: string
  ticketId: string
  userId: string
  comment: string
  dateTime: string
}

export interface Activity {
  id: string
  ticketId: string
  action: string
  dateTime: string
}
