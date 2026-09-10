import { useEffect, useMemo, useState } from 'react'
import { ticketService } from '../services/ticketService'
import { useAuth } from '../context/AuthContext'
import type { Ticket } from '../types'
import {
  Inbox,
  AlertCircle,
  UserCheck,
  Clock,
  Hourglass,
  CheckCircle2,
  Archive,
  AlertTriangle,
  UserX
} from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ticketService.list().then(setTickets).finally(() => setLoading(false))
  }, [])

  const visible = useMemo(
    () =>
      tickets.filter(
        t =>
          user?.role === 'Admin' ||
          (user?.role === 'Support Agent' ? t.assignedAgent === user.id : t.createdBy === user?.id)
      ),
    [tickets, user]
  )

  const counts = (keys: string[]) => visible.filter(t => keys.includes(t.status)).length

  const cards: [string, number, React.ReactNode, string][] =
    user?.role === 'Admin'
      ? [
          ['Total Tickets', visible.length, <Inbox size={20} />, '#2563eb'],
          ['Open Tickets', counts(['Open']), <AlertCircle size={20} />, '#0284c7'],
          ['Assigned Tickets', counts(['Assigned']), <UserCheck size={20} />, '#7c3aed'],
          ['In Progress Tickets', counts(['In Progress']), <Clock size={20} />, '#d97706'],
          ['Pending Tickets', counts(['Pending']), <Hourglass size={20} />, '#ea580c'],
          ['Resolved Tickets', counts(['Resolved']), <CheckCircle2 size={20} />, '#16a34a'],
          ['Closed Tickets', counts(['Closed']), <Archive size={20} />, '#475569'],
          ['Critical Tickets', visible.filter(t => t.priority === 'Critical').length, <AlertTriangle size={20} />, '#dc2626'],
          ['Unassigned Tickets', visible.filter(t => !t.assignedAgent).length, <UserX size={20} />, '#9333ea'],
        ]
      : user?.role === 'Support Agent'
      ? [
          ['My Assigned Tickets', visible.length, <Inbox size={20} />, '#2563eb'],
          ['New Tickets', counts(['Assigned', 'Open']), <AlertCircle size={20} />, '#0284c7'],
          ['In Progress Tickets', counts(['In Progress']), <Clock size={20} />, '#d97706'],
          ['Pending Tickets', counts(['Pending']), <Hourglass size={20} />, '#ea580c'],
          ['Resolved Tickets', counts(['Resolved']), <CheckCircle2 size={20} />, '#16a34a'],
          ['High Priority Tickets', visible.filter(t => t.priority === 'High').length, <AlertTriangle size={20} />, '#dc2626'],
        ]
      : [
          ['My Total Tickets', visible.length, <Inbox size={20} />, '#2563eb'],
          ['Open Tickets', counts(['Open']), <AlertCircle size={20} />, '#0284c7'],
          ['In Progress Tickets', counts(['In Progress']), <Clock size={20} />, '#d97706'],
          ['Resolved Tickets', counts(['Resolved']), <CheckCircle2 size={20} />, '#16a34a'],
          ['Closed Tickets', counts(['Closed']), <Archive size={20} />, '#475569'],
        ]

  if (loading) return <div className="loader">Loading dashboard...</div>

  return (
    <>
      <div className="page-title">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>
      </div>
      <div className="cards">
        {cards.map(([label, value, icon, color]) => (
          <div className="card" key={label}>
            <div className="card-header">
              <span>{label}</span>
              <div className="card-icon" style={{ color, background: `${color}18` }}>
                {icon}
              </div>
            </div>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </>
  )
}

