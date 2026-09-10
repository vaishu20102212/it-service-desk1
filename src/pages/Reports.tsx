import { useEffect, useMemo, useState } from 'react'
import { ticketService } from '../services/ticketService'
import { userService } from '../services/userService'
import type { Ticket, User } from '../types'

const STATUSES = ['Open','Assigned','In Progress','Pending','Resolved','Closed','Cancelled','Reopened']
const PRIORITIES = ['Low','Medium','High','Critical']

export default function Reports() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([ticketService.list(), userService.list()])
      .then(([t, u]) => { setTickets(t); setUsers(u) })
      .finally(() => setLoading(false))
  }, [])

  const byStatus = useMemo(() => STATUSES.map(s => ({ label: s, count: tickets.filter(t => t.status === s).length })), [tickets])
  const byPriority = useMemo(() => PRIORITIES.map(p => ({ label: p, count: tickets.filter(t => t.priority === p).length })), [tickets])
  const byCategory = useMemo(() => {
    const map = new Map<string, number>()
    tickets.forEach(t => map.set(t.category, (map.get(t.category) || 0) + 1))
    return [...map.entries()].map(([label, count]) => ({ label, count }))
  }, [tickets])
  const byAgent = useMemo(() => {
    const agents = users.filter(u => u.role === 'Support Agent')
    return agents.map(a => ({ label: a.name, count: tickets.filter(t => t.assignedAgent === a.id).length }))
  }, [tickets, users])

  if (loading) return <div className="loader">Loading reports...</div>

  const Bar = ({ rows, max }: { rows: { label: string, count: number }[], max: number }) => (
    <div className="report-bars">
      {rows.map((r, i) => (
        <div className="report-row" key={`${r.label}-${i}`}>
          <span className="report-label">{r.label}</span>
          <div className="report-track"><div className="report-fill" style={{ width: max ? `${(r.count / max) * 100}%` : '0%' }} /></div>
          <span className="report-count">{r.count}</span>
        </div>
      ))}
    </div>
  )

  return (
    <>
      <div className="page-title">
        <div>
          <h1>Reports</h1>
          <p>Ticket breakdown across status, priority, category and agents</p>
        </div>
      </div>
      <div className="cards" style={{ marginBottom: 22 }}>
        <div className="card"><span>Total Tickets</span><strong>{tickets.length}</strong></div>
        <div className="card"><span>Unassigned</span><strong>{tickets.filter(t => !t.assignedAgent).length}</strong></div>
        <div className="card"><span>Critical Open</span><strong>{tickets.filter(t => t.priority === 'Critical' && !['Closed','Cancelled'].includes(t.status)).length}</strong></div>
        <div className="card"><span>Resolved + Closed</span><strong>{tickets.filter(t => ['Resolved','Closed'].includes(t.status)).length}</strong></div>
      </div>
      <div className="detail-grid">
        <div className="detail-card">
          <h3>By Status</h3>
          <Bar rows={byStatus} max={Math.max(1, ...byStatus.map(r => r.count))} />
        </div>
        <div className="detail-card">
          <h3>By Priority</h3>
          <Bar rows={byPriority} max={Math.max(1, ...byPriority.map(r => r.count))} />
        </div>
      </div>
      <div className="detail-grid">
        <div className="detail-card">
          <h3>By Category</h3>
          <Bar rows={byCategory} max={Math.max(1, ...byCategory.map(r => r.count))} />
        </div>
        <div className="detail-card">
          <h3>By Support Agent</h3>
          <Bar rows={byAgent} max={Math.max(1, ...byAgent.map(r => r.count))} />
        </div>
      </div>
    </>
  )
}
