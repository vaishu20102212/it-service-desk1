import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ticketService } from '../services/ticketService'
import { userService } from '../services/userService'
import { categoryService } from '../services/categoryService'
import { activityService } from '../services/activityService'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import type { Ticket, User, Category } from '../types'
import { Plus, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { ConfirmModal } from '../components/Modal'

const PAGE_SIZE = 6

export default function Tickets() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [cats, setCats] = useState<Category[]>([])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [category, setCategory] = useState('')
  const [agent, setAgent] = useState('')
  const [createdDate, setCreatedDate] = useState('')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    Promise.all([ticketService.list(), userService.list(), categoryService.list()])
      .then(([t, u, c]) => { setTickets(t); setUsers(u); setCats(c); setError('') })
      .catch(() => setError('Unable to load tickets. Please check the JSON Server connection.'))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])
  useEffect(() => { setPage(1) }, [q, status, priority, category, agent, createdDate, sort])

  const supportAgents = useMemo(() => users.filter(u => u.role === 'Support Agent'), [users])

  const visible = useMemo(() => {
    let data = tickets.filter(t =>
      user?.role === 'Admin' ||
      (user?.role === 'Support Agent' ? t.assignedAgent === user.id : t.createdBy === user?.id)
    )
    data = data.filter(t => !q || [
      t.id, t.subject,
      users.find(u => u.id === t.createdBy)?.name,
      users.find(u => u.id === t.assignedAgent)?.name,
    ].join(' ').toLowerCase().includes(q.toLowerCase()))
    if (status) data = data.filter(t => t.status === status)
    if (priority) data = data.filter(t => t.priority === priority)
    if (category) data = data.filter(t => t.category === category)
    if (agent) {
      if (agent === 'unassigned') data = data.filter(t => !t.assignedAgent)
      else data = data.filter(t => t.assignedAgent === agent)
    }
    if (createdDate) data = data.filter(t => t.createdAt === createdDate)
    return [...data].sort((a, b) => {
      if (sort === 'oldest') return (a.createdAt || '').localeCompare(b.createdAt || '')
      if (sort === 'priority') return ['Low','Medium','High','Critical'].indexOf(b.priority) - ['Low','Medium','High','Critical'].indexOf(a.priority)
      if (sort === 'updated') return (b.updatedAt || '').localeCompare(a.updatedAt || '')
      return (b.createdAt || '').localeCompare(a.createdAt || '')
    })
  }, [tickets, users, q, status, priority, category, agent, createdDate, sort, user])

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))
  const pageItems = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const agentName = (id: string) => users.find(u => u.id === id)?.name || 'Unassigned'

  if (loading) return <div className="loader">Loading tickets...</div>
  if (error) return <div className="empty">{error}</div>

  return (
    <>
      <div className="page-title">
        <div><h1>Tickets</h1><p>Search, filter and manage tickets</p></div>
        <Link className="primary" to="/tickets/new" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} /> Create Ticket
        </Link>
      </div>

      <div className="toolbar" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <input placeholder="Search ID, subject, employee, agent..." value={q} onChange={e => setQ(e.target.value)} />
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All Status</option>
          {['Open','Assigned','In Progress','Pending','Resolved','Closed','Cancelled','Reopened'].map(x => <option key={x}>{x}</option>)}
        </select>
        <select value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="">All Priority</option>
          {['Low','Medium','High','Critical'].map(x => <option key={x}>{x}</option>)}
        </select>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Category</option>
          {cats.map(c => <option key={c.id}>{c.name}</option>)}
        </select>
        {user?.role === 'Admin' && (
          <select value={agent} onChange={e => setAgent(e.target.value)}>
            <option value="">All Assigned Agents</option>
            <option value="unassigned">Unassigned</option>
            {supportAgents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        )}
        <input
          type="date"
          value={createdDate}
          onChange={e => setCreatedDate(e.target.value)}
          title="Filter by Created Date"
        />
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="priority">Highest Priority</option>
          <option value="updated">Recently Updated</option>
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Subject</th><th>Category</th><th>Priority</th><th>Status</th><th>Agent</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {pageItems.map(t => (
              <tr key={t.id}>
                <td>#{t.id}</td>
                <td>{t.subject}</td>
                <td>{t.category}</td>
                <td><span className={'badge ' + (t.priority || '').toLowerCase()}>{t.priority || '-'}</span></td>
                <td><span className="badge">{t.status || '-'}</span></td>
                <td>{agentName(t.assignedAgent)}</td>
                <td>
                  <Link to={`/tickets/${t.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Eye size={14} /> View
                  </Link>
                  {user?.role === 'Admin' && (
                    <button className="link danger-text" onClick={() => setDeleteTarget(t.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Trash2 size={14} /> Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && <div className="empty">No tickets found.</div>}
      </div>

      {visible.length > 0 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ChevronLeft size={16} /> Prev
          </button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Ticket"
          message="Are you sure you want to delete this ticket? This action cannot be undone."
          confirmText="Delete Ticket"
          onClose={() => setDeleteTarget(null)}
          onConfirm={async () => {
            const targetId = deleteTarget
            setDeleteTarget(null)
            try {
              await ticketService.remove(targetId)
              await activityService.log(targetId, `Ticket deleted by ${user?.name}`)
              showToast('Ticket deleted successfully.', 'success')
              load()
            } catch {
              showToast('Unable to delete ticket.', 'error')
            }
          }}
        />
      )}
    </>
  )
}
