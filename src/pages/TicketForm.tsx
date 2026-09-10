import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ticketService } from '../services/ticketService'
import { categoryService } from '../services/categoryService'
import { activityService } from '../services/activityService'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import type { Category, Priority } from '../types'
import { Plus, Check, X } from 'lucide-react'

export default function TicketForm() {
  const { id } = useParams()
  const edit = !!id
  const nav = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()

  const [cats, setCats] = useState<Category[]>([])
  const [form, setForm] = useState({
    subject: '',
    description: '',
    category: '',
    priority: 'Medium' as Priority,
    preferredContact: 'Email' as 'Email' | 'Phone' | 'Chat',
    dueDate: '',
  })
  const [error, setError] = useState('')
  const [loadingCategories, setLoadingCategories] = useState(true)

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true)

        const data = await categoryService.list()

        console.log('CATEGORIES:', data)

        setCats(data)
      } catch (err) {
        console.error('CATEGORY ERROR:', err)
        setError('Unable to load categories.')
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategories()

    // Load ticket when editing
    if (id) {
      ticketService
        .get(id)
        .then((ticket) => {
          const canEdit =
            user?.role === 'Admin' ||
            (user?.role === 'Support Agent' && ticket.assignedAgent === user.id) ||
            (user?.role === 'Employee' && ticket.createdBy === user.id && ticket.status === 'Open')
          if (!canEdit) {
            showToast('You do not have permission to edit this ticket.', 'error')
            nav('/tickets')
            return
          }
          setForm({
            subject: ticket.subject,
            description: ticket.description,
            category: ticket.category,
            priority: ticket.priority,
            preferredContact: ticket.preferredContact,
            dueDate: ticket.dueDate || '',
          })
        })
        .catch((err) => {
          console.error('TICKET ERROR:', err)
          setError('Unable to load ticket.')
        })
    }
  }, [id])

  const handleChange = (
    field:
      | 'subject'
      | 'description'
      | 'category'
      | 'priority'
      | 'preferredContact'
      | 'dueDate',
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    // Subject validation
    if (!form.subject.trim()) {
      setError('Subject is required.')
      return
    }

    // Description validation
    if (!form.description.trim()) {
      setError('Description is required.')
      return
    }

    if (form.description.trim().length < 10) {
      setError('Description must be at least 10 characters.')
      return
    }

    // Category validation
    if (!form.category) {
      setError('Please select a category.')
      return
    }

    try {
      const today = new Date().toISOString().slice(0, 10)

      if (edit) {
        await ticketService.update(id!, {
          ...form,
          updatedAt: today,
        })
        await activityService.log(id!, `Ticket details updated by ${user?.name}`)
        showToast('Ticket updated successfully.', 'success')
      } else {
        const created = await ticketService.create({
          ...form,
          createdBy: user!.id,
          assignedAgent: '',
          status: 'Open',
          createdAt: today,
          updatedAt: today,
          assignedDate: '',
          resolution: '',
          resolutionDate: '',
        })
        await activityService.log(created.id, `Ticket created by ${user?.name}`)
        showToast('Ticket created successfully.', 'success')
      }

      nav('/tickets')
    } catch (err) {
      console.error('SAVE TICKET ERROR:', err)
      setError('Unable to save ticket.')
      showToast('Unable to save ticket.', 'error')
    }
  }

  return (
    <>
      <div className="page-title">
        <div>
          <h1>{edit ? 'Edit Ticket' : 'Create Ticket'}</h1>
        </div>
      </div>

      <form className="form-card" onSubmit={submit}>
        {/* Subject */}
        <label>
          Subject

          <input
            type="text"
            required
            value={form.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            placeholder="Enter ticket subject"
          />
        </label>

        {/* Description */}
        <label>
          Description

          <textarea
            required
            value={form.description}
            onChange={(e) =>
              handleChange('description', e.target.value)
            }
            placeholder="Describe the issue"
            rows={5}
          />
        </label>

        <div className="grid2">
          {/* Category */}
          <label>
            Category

            <select
              required
              value={form.category}
              onChange={(e) =>
                handleChange('category', e.target.value)
              }
            >
              <option value="">
                {loadingCategories
                  ? 'Loading categories...'
                  : 'Select category'}
              </option>

              {!loadingCategories &&
                cats
                  .filter((category) => category.status === 'Active')
                  .map((category) => (
                    <option
                      key={category.id}
                      value={category.name}
                    >
                      {category.name}
                    </option>
                  ))}
            </select>
          </label>

          {/* Priority */}
          <label>
            Priority

            <select
              value={form.priority}
              onChange={(e) =>
                handleChange('priority', e.target.value)
              }
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </label>

          {/* Preferred Contact */}
          <label>
            Preferred Contact

            <select
              value={form.preferredContact}
              onChange={(e) =>
                handleChange('preferredContact', e.target.value)
              }
            >
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
              <option value="Chat">Chat</option>
            </select>
          </label>

          {/* Due Date */}
          <label>
            Due Date

            <input
              type="date"
              value={form.dueDate}
              onChange={(e) =>
                handleChange('dueDate', e.target.value)
              }
            />
          </label>
        </div>

        {/* Error */}
        {error && <div className="error">{error}</div>}

        {/* Buttons */}
        <div className="actions">
          <button
            type="button"
            onClick={() => nav('/tickets')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <X size={15} /> Cancel
          </button>

          <button
            type="submit"
            className="primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            {edit ? <Check size={16} /> : <Plus size={16} />}
            <span>{edit ? 'Update Ticket' : 'Save Ticket'}</span>
          </button>
        </div>
      </form>
    </>
  )
}