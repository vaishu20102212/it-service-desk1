import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ticketService } from '../services/ticketService'
import { commentService } from '../services/commentService'
import { userService } from '../services/userService'
import { activityService } from '../services/activityService'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Modal } from '../components/Modal'
import type { Ticket, Comment, User, Status, Priority, Activity } from '../types'

const ALL_STATUSES: Status[] = ['Open','Assigned','In Progress','Pending','Resolved','Closed','Cancelled','Reopened']
const PRIORITIES: Priority[] = ['Low','Medium','High','Critical']

export default function TicketDetails() {
  const { id } = useParams()
  const nav = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()

  const [t, setT] = useState<Ticket | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [agents, setAgents] = useState<User[]>([])
  const [text, setText] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [assignChoice, setAssignChoice] = useState('')
  const [resolutionDraft, setResolutionDraft] = useState('')
  const [showResolutionBox, setShowResolutionBox] = useState(false)

  const load = () => {
    ticketService.get(id!).then(setT).catch(() => setNotFound(true))
    commentService.list(id).then(setComments)
    activityService.list(id).then(list => setActivities([...list].sort((a, b) => a.dateTime.localeCompare(b.dateTime))))
    userService.list().then(u => {
      setUsers(u)
      setAgents(u.filter(x => x.role === 'Support Agent' && x.status === 'Active'))
    })
  }
  useEffect(load, [id])

  if (notFound) return <div className="empty">Ticket not found. <Link to="/tickets">Go back</Link></div>
  if (!t) return <div className="loader">Loading ticket...</div>

  const isOwner = t.createdBy === user?.id
  const isAssignedAgent = t.assignedAgent === user?.id
  const canView = user?.role === 'Admin' || (user?.role === 'Support Agent' && isAssignedAgent) || (user?.role === 'Employee' && isOwner)
  if (!canView) {
    return (
      <div className="empty">
        You do not have permission to view this ticket.<br />
        <Link to="/tickets">Back to Tickets</Link>
      </div>
    )
  }

  const creator = users.find(u => u.id === t.createdBy)?.name || 'Unknown'
  const agent = users.find(u => u.id === t.assignedAgent)?.name || 'Unassigned'

  const canEdit = user?.role === 'Admin' ||
    (user?.role === 'Support Agent' && isAssignedAgent) ||
    (user?.role === 'Employee' && isOwner && (t.status || '') === 'Open')

  const canAddComment = user?.role === 'Admin' ||
    (user?.role === 'Support Agent' && isAssignedAgent) ||
    (user?.role === 'Employee' && isOwner)

  const canAddResolution = user?.role === 'Admin' || (user?.role === 'Support Agent' && isAssignedAgent)

  const nextStatuses = (): Status[] => {
    if (user?.role === 'Admin') return ALL_STATUSES.filter(s => s !== (t.status || ''))
    if (user?.role === 'Support Agent' && isAssignedAgent) {
      const map: Partial<Record<Status, Status[]>> = {
        'Assigned': ['In Progress'],
        'In Progress': ['Pending', 'Resolved'],
        'Pending': ['In Progress'],
        'Resolved': ['Closed'],
      }
      return map[t.status] || []
    }
    if (user?.role === 'Employee' && isOwner) {
      if ((t.status || '') === 'Open') return ['Cancelled']
      if ((t.status || '') === 'Resolved') return ['Reopened']
      return []
    }
    return []
  }
  const availableNext = nextStatuses()

  const log = (action: string) => activityService.log(t.id, action)

  const changeStatus = async (status: Status) => {
    const today = new Date().toISOString().slice(0, 10)
    await ticketService.update(t.id, { status, updatedAt: today })
    await log(`Status changed to ${status} by ${user?.name}`)
    showToast(`Ticket status updated to "${status}".`, 'success')
    load()
  }

  const changePriority = async (priority: Priority) => {
    const today = new Date().toISOString().slice(0, 10)
    await ticketService.update(t.id, { priority, updatedAt: today })
    await log(`Priority changed to ${priority} by ${user?.name}`)
    showToast('Priority updated.', 'success')
    load()
  }

  const openAssignModal = () => { setAssignChoice(t.assignedAgent); setAssignOpen(true) }

  const applyAssignment = async () => {
    const today = new Date().toISOString().slice(0, 10)
    const wasAssigned = !!t.assignedAgent
    const nowAssigned = !!assignChoice
    const newStatus: Status = nowAssigned ? (t.status === 'Open' ? 'Assigned' : t.status) : 'Open'
    await ticketService.update(t.id, {
      assignedAgent: assignChoice,
      assignedDate: nowAssigned ? today : '',
      status: newStatus,
      updatedAt: today,
    })
    const agentName = users.find(u => u.id === assignChoice)?.name
    if (!wasAssigned && nowAssigned) await log(`Ticket assigned to ${agentName}`)
    else if (wasAssigned && nowAssigned) await log(`Ticket reassigned to ${agentName}`)
    else if (wasAssigned && !nowAssigned) await log('Ticket unassigned')
    showToast('Assignment updated.', 'success')
    setAssignOpen(false)
    load()
  }

  const addComment = async () => {
    if (!text.trim()) return
    await commentService.create({ ticketId: t.id, userId: user!.id, comment: text.trim(), dateTime: new Date().toISOString() })
    await log(`Comment added by ${user?.name}`)
    setText('')
    showToast('Comment added.', 'success')
    load()
  }

  const submitResolution = async () => {
    if (!resolutionDraft.trim()) { showToast('Resolution notes cannot be empty.', 'error'); return }
    const today = new Date().toISOString().slice(0, 10)
    await ticketService.update(t.id, { resolution: resolutionDraft.trim(), resolutionDate: today, status: 'Resolved', updatedAt: today })
    await log('Resolution added')
    await log('Status changed to Resolved by ' + user?.name)
    showToast('Ticket resolved.', 'success')
    setShowResolutionBox(false)
    setResolutionDraft('')
    load()
  }

  return (
    <>
      <div className="page-title">
        <div><h1>Ticket #{t.id}</h1><p>{t.subject}</p></div>
        <div>
          <Link to="/tickets">Back</Link>
          {canEdit && <Link className="primary ml" to={`/tickets/${t.id}/edit`}>Edit</Link>}
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3>{t.subject}</h3>
          <p className="description">{t.description}</p>
          <div className="info-grid">
            <div><b>Created By</b><span>{creator}</span></div>
            <div><b>Assigned Agent</b><span>{agent}</span></div>
            <div><b>Category</b><span>{t.category}</span></div>
            <div><b>Priority</b><span className={'badge ' + (t.priority || '').toLowerCase()}>{t.priority || '-'}</span></div>
            <div><b>Status</b><span className="badge">{t.status || '-'}</span></div>
            <div><b>Preferred Contact</b><span>{t.preferredContact}</span></div>
            <div><b>Created</b><span>{t.createdAt}</span></div>
            <div><b>Updated</b><span>{t.updatedAt}</span></div>
            <div><b>Due Date</b><span>{t.dueDate || '-'}</span></div>
            <div><b>Assigned Date</b><span>{t.assignedDate || '-'}</span></div>
          </div>
        </div>

        <div className="detail-card">
          <h3>Actions</h3>

          {user?.role === 'Admin' && (
            <button className="primary full" style={{ marginBottom: 15 }} onClick={openAssignModal}>
              {t.assignedAgent ? 'Reassign / Unassign Agent' : 'Assign Agent'}
            </button>
          )}

          {availableNext.length > 0 && (
            <label>Update Status
              <select value="" onChange={e => e.target.value && changeStatus(e.target.value as Status)}>
                <option value="">Choose next status...</option>
                {availableNext.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          )}
          {availableNext.length === 0 && (
            <p style={{ fontSize: 13, color: '#6b7280' }}>No further status actions available for you on this ticket.</p>
          )}

          {(user?.role === 'Admin' || (user?.role === 'Support Agent' && isAssignedAgent)) && (
            <label>Priority
              <select value={t.priority || ''} onChange={e => changePriority(e.target.value as Priority)}>
                <option value="">Select Priority</option>
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </label>
          )}

          {canAddResolution && !t.resolution && !['Closed','Cancelled'].includes(t.status || '') && (
            showResolutionBox ? (
              <div style={{ marginTop: 10 }}>
                <textarea placeholder="Enter resolution notes..." value={resolutionDraft} onChange={e => setResolutionDraft(e.target.value)} style={{ minHeight: 90, width: '100%', padding: 10, borderRadius: 7, border: '1px solid #d7dce5' }} />
                <div className="actions">
                  <button type="button" onClick={() => setShowResolutionBox(false)}>Cancel</button>
                  <button className="primary" onClick={submitResolution}>Save Resolution</button>
                </div>
              </div>
            ) : (
              <button className="primary full" onClick={() => setShowResolutionBox(true)}>Add Resolution & Resolve</button>
            )
          )}

          {t.resolution && (
            <div className="resolution">
              <b>Resolution</b>
              <p>{t.resolution}</p>
              <small>Resolved on {t.resolutionDate}</small>
            </div>
          )}
        </div>
      </div>

      <div className="detail-card">
        <h3>Comments</h3>
        <div className="comments">
          {comments.length === 0 && <p style={{ color: '#6b7280', fontSize: 14 }}>No comments yet.</p>}
          {comments.map(c => (
            <div className="comment" key={c.id}>
              <b>{users.find(u => u.id === c.userId)?.name || 'User'}</b>
              <span>{new Date(c.dateTime).toLocaleString()}</span>
              <p>{c.comment}</p>
            </div>
          ))}
        </div>
        {canAddComment ? (
          <div className="comment-box">
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Write a comment..." />
            <button className="primary" onClick={addComment}>Add Comment</button>
          </div>
        ) : (
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 10 }}>You do not have permission to comment on this ticket.</p>
        )}
      </div>

      <div className="detail-card">
        <h3>Activity History</h3>
        <div className="timeline">
          {activities.length === 0 && <p style={{ color: '#6b7280', fontSize: 14 }}>No activity recorded yet.</p>}
          {activities.map(a => (
            <div className="timeline-item" key={a.id}>
              <div className="timeline-dot" />
              <div>
                <div className="timeline-action">{a.action}</div>
                <div className="timeline-time">{new Date(a.dateTime).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {assignOpen && (
        <Modal title="Ticket Assignment" onClose={() => setAssignOpen(false)}>
          <div className="info-grid" style={{ marginBottom: 15 }}>
            <div><b>Ticket</b><span>#{t.id} - {t.subject}</span></div>
            <div><b>Current Agent</b><span>{agent}</span></div>
            <div><b>Assignment Date</b><span>{t.assignedDate || '-'}</span></div>
          </div>
          <label>Available Support Agents
            <select value={assignChoice} onChange={e => setAssignChoice(e.target.value)}>
              <option value="">Unassign (no agent)</option>
              {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </label>
          <div className="actions">
            <button type="button" onClick={() => setAssignOpen(false)}>Cancel</button>
            <button className="primary" onClick={applyAssignment}>Save Assignment</button>
          </div>
        </Modal>
      )}
    </>
  )
}
