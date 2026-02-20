import React from 'react'
import { useChores } from '../context/ChoreContext.jsx'
import { format } from 'date-fns'

const PRIORITY_STYLES = {
  low: 'bg-priority-low/15 text-priority-low border-priority-low/30',
  medium: 'bg-priority-medium/15 text-amber-700 border-amber-400/30',
  high: 'bg-priority-high/15 text-priority-high border-priority-high/30',
}

const STATUS_STYLES = {
  pending: 'bg-soft-sand text-gray-600',
  in_progress: 'bg-soft-mist text-gray-700',
  completed: 'bg-soft-sage text-gray-700 line-through',
}

export default function ChoreCard({ chore, onEdit }) {
  const { updateChore, deleteChore } = useChores()
  const priorityStyle = PRIORITY_STYLES[chore.priority] || PRIORITY_STYLES.medium
  const statusStyle = STATUS_STYLES[chore.status] || STATUS_STYLES.pending

  const toggleStatus = () => {
    const next = { pending: 'in_progress', in_progress: 'completed', completed: 'pending' }[chore.status]
    updateChore(chore.id, { status: next })
  }

  const scheduledDate = chore.scheduled ? new Date(chore.scheduled) : null

  return (
    <div
      className="group rounded-xl border border-soft-sand bg-white p-4 shadow-soft hover:shadow-soft-lg hover:border-soft-sand/80 transition-all duration-250"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-gray-800 truncate">{chore.title}</h3>
          {chore.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{chore.description}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${priorityStyle}`}>
              {chore.priority}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${statusStyle}`}>
              {chore.status.replace('_', ' ')}
            </span>
            {chore.assignee && (
              <span className="text-xs text-gray-500">→ {chore.assignee}</span>
            )}
            {scheduledDate && (
              <span className="text-xs text-gray-500">
                {format(scheduledDate, 'MMM d, h:mm a')}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={toggleStatus}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-soft-stone hover:text-gray-700 transition-colors"
            title="Toggle status"
          >
            <StatusIcon status={chore.status} />
          </button>
          <button
            type="button"
            onClick={() => onEdit(chore)}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-soft-stone hover:text-gray-700 transition-colors"
            title="Edit"
          >
            <EditIcon />
          </button>
          <button
            type="button"
            onClick={() => deleteChore(chore.id)}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-priority-high/10 hover:text-priority-high transition-colors"
            title="Delete"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

function StatusIcon({ status }) {
  if (status === 'completed') return <span className="text-green-600 text-lg">✓</span>
  if (status === 'in_progress') return <span className="text-amber-500 text-lg">◐</span>
  return <span className="text-gray-400 text-lg">○</span>
}

function EditIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}
