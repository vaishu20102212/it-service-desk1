import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { userService } from '../services/userService'
import { Save } from 'lucide-react'

export default function Profile() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [phone, setPhone] = useState(user?.phone || '')
  const [department, setDepartment] = useState(user?.department || '')
  const [saving, setSaving] = useState(false)

  if (!user) return null

  const save = async () => {
    setSaving(true)
    try {
      await userService.update(user.id, { phone, department })
      const updated = { ...user, phone, department }
      localStorage.setItem('userData', JSON.stringify(updated))
      showToast('Profile updated successfully.', 'success')
    } catch {
      showToast('Unable to update profile.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="page-title">
        <div>
          <h1>My Profile</h1>
          <p>View and update your account details</p>
        </div>
      </div>
      <div className="form-card" style={{ maxWidth: 520 }}>
        <label>Full Name
          <input value={user.name} disabled />
        </label>
        <label>Email
          <input value={user.email} disabled />
        </label>
        <label>Role
          <input value={user.role} disabled />
        </label>
        <label>Phone
          <input value={phone} onChange={e => setPhone(e.target.value)} />
        </label>
        <label>Department
          <input value={department} onChange={e => setDepartment(e.target.value)} />
        </label>
        <div className="actions">
          <button className="primary" disabled={saving} onClick={save} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </>
  )
}
