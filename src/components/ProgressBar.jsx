import React from 'react'
import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns'

export default function ProgressBar({ chores }) {
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 })

  const weekChores = chores.filter((c) => {
    if (!c.scheduled) return false
    const d = new Date(c.scheduled)
    return isWithinInterval(d, { start: weekStart, end: weekEnd })
  })
  const completed = weekChores.filter((c) => c.status === 'completed').length
  const total = weekChores.length
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="rounded-xl bg-soft-stone p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">This week&apos;s completion</span>
        <span className="text-sm text-gray-500">{completed} / {total} chores</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-soft-sand overflow-hidden">
        <div
          className="h-full rounded-full bg-priority-low transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-gray-500">{pct}% done</p>
    </div>
  )
}
