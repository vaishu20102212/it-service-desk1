import { useEffect, useState } from 'react'
import { categoryService } from '../services/categoryService'
import { useToast } from '../context/ToastContext'
import type { Category } from '../types'
import { Plus, Check, Pencil, Trash2, Power, X, Eye } from 'lucide-react'
import { Modal, ConfirmModal } from '../components/Modal'

export default function Categories() {
  const { showToast } = useToast()
  const [items, setItems] = useState<Category[]>([])
  const [form, setForm] = useState({ name: '', description: '' })
  const [editing, setEditing] = useState<string | null>(null)
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  const load = () => categoryService.list().then(setItems).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.name.trim()) { showToast('Category name is required.', 'error'); return }
    try {
      if (editing) {
        await categoryService.update(editing, form)
        showToast('Category updated.', 'success')
      } else {
        await categoryService.create({ ...form, status: 'Active' })
        showToast('Category added.', 'success')
      }
      setEditing(null)
      setForm({ name: '', description: '' })
      load()
    } catch {
      showToast('Unable to save category.', 'error')
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    const id = deleteTarget.id
    setDeleteTarget(null)
    try {
      await categoryService.remove(id)
      showToast('Category deleted.', 'success')
      load()
    } catch {
      showToast('Unable to delete category.', 'error')
    }
  }

  const toggle = async (c: Category) => {
    await categoryService.update(c.id, { status: c.status === 'Active' ? 'Inactive' : 'Active' })
    showToast(`Category ${c.status === 'Active' ? 'deactivated' : 'activated'}.`, 'success')
    load()
  }

  if (loading) return <div className="loader">Loading categories...</div>

  return (
    <>
      <div className="page-title">
        <div><h1>Category Management</h1><p>Admin-only category CRUD</p></div>
      </div>
      <div className="form-card inline-form">
        <input placeholder="Category name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <button className="primary" onClick={save} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          {editing ? <Check size={16} /> : <Plus size={16} />}
          <span>{editing ? 'Update' : 'Add Category'}</span>
        </button>
        {editing && (
          <button type="button" onClick={() => { setEditing(null); setForm({ name: '', description: '' }) }} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <X size={15} /> Cancel
          </button>
        )}
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Category Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(c => (
              <tr key={c.id}>
                <td>#{c.id}</td>
                <td><b>{c.name}</b></td>
                <td>{c.description}</td>
                <td><span className={'badge ' + (c.status === 'Active' ? 'low' : 'critical')}>{c.status}</span></td>
                <td>
                  <button className="link" onClick={() => setViewingCategory(c)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Eye size={13} /> View
                  </button>
                  <button className="link" onClick={() => { setEditing(c.id); setForm({ name: c.name, description: c.description }) }} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Pencil size={13} /> Edit
                  </button>
                  <button className="link danger-text" onClick={() => setDeleteTarget(c)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Trash2 size={13} /> Delete
                  </button>
                  <button className="link" onClick={() => toggle(c)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Power size={13} /> {c.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <div className="empty">No categories found.</div>}
      </div>

      {viewingCategory && (
        <Modal title={`Category Details - ${viewingCategory.name}`} onClose={() => setViewingCategory(null)}>
          <div className="info-grid" style={{ gap: '18px', padding: '10px 0' }}>
            <div><b>Category ID</b><span>#{viewingCategory.id}</span></div>
            <div><b>Category Name</b><span>{viewingCategory.name}</span></div>
            <div><b>Status</b><span className={'badge ' + (viewingCategory.status === 'Active' ? 'low' : 'critical')}>{viewingCategory.status}</span></div>
            <div style={{ gridColumn: 'span 2' }}><b>Description</b><p style={{ margin: '6px 0 0', color: '#4b5563', lineHeight: 1.6 }}>{viewingCategory.description || 'No description provided.'}</p></div>
          </div>
          <div className="actions" style={{ marginTop: 20 }}>
            <button type="button" className="primary" onClick={() => setViewingCategory(null)}>Close</button>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Category"
          message={`Are you sure you want to delete category "${deleteTarget.name}"? This action cannot be undone.`}
          confirmText="Delete Category"
          onClose={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  )
}
