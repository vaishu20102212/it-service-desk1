import { useEffect, useState } from 'react'
import { userService } from '../services/userService'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import type { Role, User } from '../types'
import { Plus, Check, Pencil, Trash2, Power, X, Eye } from 'lucide-react'
import { Modal, ConfirmModal } from '../components/Modal'

const emptyForm = { name: '', email: '', phone: '', department: '', role: 'Employee' as Role, password: 'password123' }

export default function Users() {
  const { showToast } = useToast()
  const { user: me } = useAuth()
  const [items, setItems] = useState<User[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<string | null>(null)
  const [viewingUser, setViewingUser] = useState<User | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const load = () => userService.list().then(setItems).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const resetForm = () => { setEditing(null); setForm(emptyForm) }

  const save = async () => {
    if (!form.name.trim() || !form.email.trim()) { showToast('Name and email are required.', 'error'); return }
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    if (!emailValid) { showToast('Please enter a valid email address.', 'error'); return }
    try {
      if (editing) {
        await userService.update(editing, form)
        showToast('User updated successfully.', 'success')
      } else {
        await userService.create({ ...form, status: 'Active', createdAt: new Date().toISOString().slice(0, 10) })
        showToast('User added successfully.', 'success')
      }
      resetForm()
      load()
    } catch {
      showToast('Unable to save user.', 'error')
    }
  }

  const edit = (u: User) => {
    setEditing(u.id)
    setForm({ name: u.name, email: u.email, phone: u.phone, department: u.department, role: u.role, password: u.password })
  }

  const handleDelete = (u: User) => {
    if (u.id === me?.id) { showToast('You cannot delete your own account.', 'error'); return }
    setDeleteTarget(u)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    const id = deleteTarget.id
    setDeleteTarget(null)
    try {
      await userService.remove(id)
      showToast('User deleted.', 'success')
      load()
    } catch {
      showToast('Unable to delete user.', 'error')
    }
  }

  const toggleStatus = async (u: User) => {
    await userService.update(u.id, { status: u.status === 'Active' ? 'Inactive' : 'Active' })
    showToast(`User ${u.status === 'Active' ? 'deactivated' : 'activated'}.`, 'success')
    load()
  }

  if (loading) return <div className="loader">Loading users...</div>

  return (
    <>
      <div className="page-title">
        <div><h1>User Management</h1><p>Admin-only user CRUD</p></div>
      </div>
      <div className="form-card inline-form">
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="Department" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as Role })}>
          {['Admin', 'Support Agent', 'Employee'].map(r => <option key={r}>{r}</option>)}
        </select>
        <button className="primary" onClick={save} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          {editing ? <Check size={16} /> : <Plus size={16} />}
          <span>{editing ? 'Update' : 'Add User'}</span>
        </button>
        {editing && (
          <button type="button" onClick={resetForm} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <X size={15} /> Cancel
          </button>
        )}
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(u => (
              <tr key={u.id}>
                <td>#{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone || '-'}</td>
                <td>{u.department || '-'}</td>
                <td><span className={'badge ' + (u.role === 'Admin' ? 'critical' : u.role === 'Support Agent' ? 'high' : 'low')}>{u.role}</span></td>
                <td><span className={'badge ' + (u.status === 'Active' ? 'low' : 'critical')}>{u.status}</span></td>
                <td>{u.createdAt || '-'}</td>
                <td>
                  <button className="link" onClick={() => setViewingUser(u)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Eye size={13} /> View
                  </button>
                  <button className="link" onClick={() => edit(u)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Pencil size={13} /> Edit
                  </button>
                  <button className="link danger-text" onClick={() => handleDelete(u)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Trash2 size={13} /> Delete
                  </button>
                  <button className="link" onClick={() => toggleStatus(u)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Power size={13} /> {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <div className="empty">No users found.</div>}
      </div>

      {viewingUser && (
        <Modal title={`User Details - ${viewingUser.name}`} onClose={() => setViewingUser(null)}>
          <div className="info-grid" style={{ gap: '18px', padding: '10px 0' }}>
            <div><b>User ID</b><span>#{viewingUser.id}</span></div>
            <div><b>Full Name</b><span>{viewingUser.name}</span></div>
            <div><b>Email</b><span>{viewingUser.email}</span></div>
            <div><b>Phone</b><span>{viewingUser.phone || 'Not provided'}</span></div>
            <div><b>Department</b><span>{viewingUser.department || 'Not assigned'}</span></div>
            <div><b>Role</b><span className="badge">{viewingUser.role}</span></div>
            <div><b>Status</b><span className={'badge ' + (viewingUser.status === 'Active' ? 'low' : 'critical')}>{viewingUser.status}</span></div>
            <div><b>Created Date</b><span>{viewingUser.createdAt || '-'}</span></div>
          </div>
          <div className="actions" style={{ marginTop: 20 }}>
            <button type="button" className="primary" onClick={() => setViewingUser(null)}>Close</button>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete User"
          message={`Are you sure you want to delete user "${deleteTarget.name}" (${deleteTarget.email})? This action cannot be undone.`}
          confirmText="Delete User"
          onClose={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  )
}
