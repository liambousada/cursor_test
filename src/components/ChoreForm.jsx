import React, { useState } from 'react'
import { format } from 'date-fns'
import { useChores } from '../context/ChoreContext.jsx'

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const emptyChore = () => ({
  title: '',
  description: '',
  assignee: '',
  scheduled: '',
  priority: 'medium',
  status: 'pending',
})

/** Local date at 9:00 AM as ISO string (stored in UTC, correct for user's zone when parsed) */
function dayToDefaultScheduled(date) {
  const d = new Date(date)
  d.setHours(9, 0, 0, 0)
  return d.toISOString()
}

/** Format ISO string for datetime-local input: use local time so display matches selection */
function scheduledToInputValue(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return format(d, "yyyy-MM-dd'T'HH:mm")
}

/** Parse datetime-local value (local time) to ISO string for storage */
function inputValueToScheduled(value) {
  if (!value) return ''
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '' : d.toISOString()
}

export default function ChoreForm({ isOpen, onClose, editChore = null, preselectedDate = null, onSaved }) {
  const { assignees, addChore, updateChore, addAssignee } = useChores()
  const [customAssignee, setCustomAssignee] = useState('')
  const [form, setForm] = useState(editChore ?? emptyChore())

  React.useEffect(() => {
    if (!isOpen) return
    if (editChore) {
      setForm({ ...editChore })
      return
    }
    const base = emptyChore()
    if (preselectedDate) {
      base.scheduled = dayToDefaultScheduled(preselectedDate)
    } else {
      base.scheduled = dayToDefaultScheduled(new Date())
    }
    setForm(base)
  }, [isOpen, editChore, preselectedDate])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (customAssignee.trim() && !assignees.includes(customAssignee.trim())) addAssignee(customAssignee.trim())
    const assignee = form.assignee || customAssignee.trim() || assignees[0]
    const scheduled = form.scheduled || dayToDefaultScheduled(new Date())
    const payload = {
      ...form,
      assignee,
      scheduled,
    }
    if (editChore) updateChore(editChore.id, payload)
    else addChore(payload)
    onSaved?.()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-soft-lg p-6 max-h-[90vh] overflow-y-auto transition-all duration-250 hover:shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {editChore ? 'Edit Chore' : 'Add Chore'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Vacuum living room"
              className="w-full px-3 py-2 rounded-lg border border-soft-sand bg-soft-cream focus:ring-2 focus:ring-soft-mist focus:border-transparent outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Detailed notes..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-soft-sand bg-soft-cream focus:ring-2 focus:ring-soft-mist focus:border-transparent outline-none transition-all resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Assignee</label>
            <div className="flex gap-2">
              <select
                value={form.assignee}
                onChange={(e) => setForm((f) => ({ ...f, assignee: e.target.value }))}
                className="flex-1 px-3 py-2 rounded-lg border border-soft-sand bg-soft-cream focus:ring-2 focus:ring-soft-mist outline-none"
              >
                <option value="">Select or add below</option>
                {assignees.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <input
                type="text"
                value={customAssignee}
                onChange={(e) => setCustomAssignee(e.target.value)}
                placeholder="New name"
                className="flex-1 px-3 py-2 rounded-lg border border-soft-sand bg-soft-cream focus:ring-2 focus:ring-soft-mist outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Schedule</label>
            <input
              type="datetime-local"
              value={scheduledToInputValue(form.scheduled)}
              onChange={(e) => setForm((f) => ({ ...f, scheduled: inputValueToScheduled(e.target.value) }))}
              className="w-full px-3 py-2 rounded-lg border border-soft-sand bg-soft-cream focus:ring-2 focus:ring-soft-mist outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Priority</label>
            <div className="flex gap-2">
              {PRIORITIES.map(({ value, label }) => {
                const isSelected = form.priority === value
                const bg = value === 'low' ? '#7cb87c' : value === 'medium' ? '#e6c35c' : '#d97b7b'
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, priority: value }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isSelected ? 'text-white shadow-soft' : 'bg-soft-stone text-gray-600 hover:bg-soft-sand'
                    }`}
                    style={isSelected ? { backgroundColor: bg } : {}}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
          {editChore && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-soft-sand bg-soft-cream focus:ring-2 focus:ring-soft-mist outline-none"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-soft-sand text-gray-600 hover:bg-soft-stone transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200 font-medium"
            >
              {editChore ? 'Save' : 'Add Chore'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
