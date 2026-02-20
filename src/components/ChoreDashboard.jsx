import React, { useState, useMemo } from 'react'
import { useChores } from '../context/ChoreContext.jsx'
import ChoreCard from './ChoreCard.jsx'
import ProgressBar from './ProgressBar.jsx'

export default function ChoreDashboard({ onOpenAdd, onOpenEdit }) {
  const { chores } = useChores()
  const [filterAssignee, setFilterAssignee] = useState('')
  const [sortBy, setSortBy] = useState('soonest')

  const assignees = useMemo(() => {
    const set = new Set(chores.map((c) => c.assignee).filter(Boolean))
    return ['All', ...Array.from(set).sort()]
  }, [chores])

  const filteredAndSorted = useMemo(() => {
    let list = chores
    if (filterAssignee && filterAssignee !== 'All') {
      list = list.filter((c) => c.assignee === filterAssignee)
    }
    if (sortBy === 'soonest') {
      list = [...list].sort((a, b) => {
        const da = a.scheduled ? new Date(a.scheduled).getTime() : Infinity
        const db = b.scheduled ? new Date(b.scheduled).getTime() : Infinity
        return da - db
      })
    } else if (sortBy === 'priority') {
      const order = { high: 0, medium: 1, low: 2 }
      list = [...list].sort((a, b) => (order[a.priority] ?? 1) - (order[b.priority] ?? 1))
    }
    return list
  }, [chores, filterAssignee, sortBy])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">Upcoming Chores</h1>
        <button
          type="button"
          onClick={onOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 active:scale-[0.98] transition-all duration-200 shadow-soft"
        >
          <PlusIcon />
          Add Chore
        </button>
      </div>

      <ProgressBar chores={chores} />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-500 mb-1">Filter by assignee</label>
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="w-full sm:w-auto min-w-[140px] px-3 py-2 rounded-lg border border-soft-sand bg-white focus:ring-2 focus:ring-soft-mist outline-none text-sm"
          >
            <option value="">All</option>
            {assignees.filter((a) => a !== 'All').map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto min-w-[140px] px-3 py-2 rounded-lg border border-soft-sand bg-white focus:ring-2 focus:ring-soft-mist outline-none text-sm"
          >
            <option value="soonest">Soonest due</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      <ul className="space-y-3">
        {filteredAndSorted.length === 0 ? (
          <li className="rounded-xl border border-dashed border-soft-sand bg-soft-cream/50 py-12 text-center text-gray-500">
            No chores yet. Add one to get started.
          </li>
        ) : (
          filteredAndSorted.map((chore) => (
            <li key={chore.id}>
              <ChoreCard chore={chore} onEdit={onOpenEdit} />
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

function PlusIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
}
