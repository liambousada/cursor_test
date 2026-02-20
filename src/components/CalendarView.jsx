import React, { useState, useMemo } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { format } from 'date-fns'
import { useChores } from '../context/ChoreContext.jsx'

const PRIORITY_COLORS = { low: '#7cb87c', medium: '#e6c35c', high: '#d97b7b' }

export default function CalendarView({ onAddChoreForDate }) {
  const { chores } = useChores()
  const [date, setDate] = useState(new Date())

  const choresByDate = useMemo(() => {
    const map = {}
    chores.forEach((c) => {
      if (!c.scheduled) return
      const key = format(new Date(c.scheduled), 'yyyy-MM-dd')
      if (!map[key]) map[key] = []
      map[key].push(c)
    })
    return map
  }, [chores])

  const tileContent = ({ date: d }) => {
    const key = format(d, 'yyyy-MM-dd')
    const dayChores = choresByDate[key] || []
    if (dayChores.length === 0) return null
    return (
      <div className="flex flex-wrap gap-0.5 justify-center mt-1">
        {dayChores.slice(0, 3).map((c) => (
          <span
            key={c.id}
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: PRIORITY_COLORS[c.priority] || PRIORITY_COLORS.medium }}
            title={c.title}
          />
        ))}
        {dayChores.length > 3 && (
          <span className="text-[10px] text-gray-400">+{dayChores.length - 3}</span>
        )}
      </div>
    )
  }

  const selectedKey = format(date, 'yyyy-MM-dd')
  const dayChores = choresByDate[selectedKey] || []

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-4 md:p-6 shadow-soft border border-soft-sand/50">
        <Calendar
          onChange={setDate}
          value={date}
          tileContent={tileContent}
          onClickDay={onAddChoreForDate ? (clickedDate) => { setDate(clickedDate); onAddChoreForDate(clickedDate) } : undefined}
          className="mx-auto"
        />
      </div>
      <div className="rounded-2xl bg-white p-4 shadow-soft border border-soft-sand/50">
        <h3 className="text-sm font-medium text-gray-500 mb-3">
          Chores on {format(date, 'MMMM d, yyyy')}
        </h3>
        {dayChores.length > 0 ? (
          <ul className="space-y-2">
            {dayChores
              .sort((a, b) => new Date(a.scheduled) - new Date(b.scheduled))
              .map((c) => (
                <li
                  key={c.id}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg bg-soft-cream hover:bg-soft-stone transition-colors"
                >
                  <span
                    className="shrink-0 w-2 h-2 rounded-full"
                    style={{ backgroundColor: PRIORITY_COLORS[c.priority] }}
                  />
                  <span className="flex-1 truncate font-medium text-gray-800">{c.title}</span>
                  <span className="text-xs text-gray-500">{c.assignee}</span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(c.scheduled), 'h:mm a')}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">{c.status.replace('_', ' ')}</span>
                </li>
              ))}
          </ul>
        ) : (
          <>
            <p className="text-sm text-gray-500 py-4" title="No chores for this day yet—click to add one!">
              No chores for this day yet—click to add one!
            </p>
            {onAddChoreForDate && (
              <button
                type="button"
                onClick={() => onAddChoreForDate(date)}
                className="mt-2 px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Add chore for this day
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
