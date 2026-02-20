import React, { createContext, useContext, useReducer, useEffect } from 'react'

const STORAGE_KEY = 'chore-calendar-data'
const DEFAULT_ASSIGNEES = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan']

function isValidChore(c) {
  return c && typeof c === 'object' && typeof c.title === 'string' && (c.scheduled == null || typeof c.scheduled === 'string')
}

function sanitizeChore(c) {
  return {
    id: typeof c.id === 'string' ? c.id : crypto.randomUUID(),
    title: String(c.title ?? ''),
    description: String(c.description ?? ''),
    assignee: String(c.assignee ?? ''),
    scheduled: c.scheduled && typeof c.scheduled === 'string' ? c.scheduled : '',
    priority: ['low', 'medium', 'high'].includes(c.priority) ? c.priority : 'medium',
    status: ['pending', 'in_progress', 'completed'].includes(c.status) ? c.status : 'pending',
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw == null || raw === '') return null
    const data = JSON.parse(raw)
    if (!data || typeof data !== 'object') return null
    const chores = Array.isArray(data.chores)
      ? data.chores.filter(isValidChore).map(sanitizeChore)
      : []
    const assignees = Array.isArray(data.assignees)
      ? data.assignees.filter((a) => typeof a === 'string' && a.trim() !== '')
      : DEFAULT_ASSIGNEES
    return { chores, assignees: assignees.length ? assignees : DEFAULT_ASSIGNEES }
  } catch {
    return null
  }
}

const choreReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD':
      return { ...state, chores: action.payload.chores ?? [], assignees: action.payload.assignees ?? DEFAULT_ASSIGNEES }
    case 'ADD_CHORE':
      return { ...state, chores: [...state.chores, { ...action.payload, id: crypto.randomUUID() }] }
    case 'UPDATE_CHORE':
      return {
        ...state,
        chores: state.chores.map((c) => (c.id === action.payload.id ? { ...c, ...action.payload } : c)),
      }
    case 'DELETE_CHORE':
      return { ...state, chores: state.chores.filter((c) => c.id !== action.payload) }
    case 'ADD_ASSIGNEE':
      if (state.assignees.includes(action.payload)) return state
      return { ...state, assignees: [...state.assignees, action.payload] }
    default:
      return state
  }
}

const initialState = {
  chores: [],
  assignees: DEFAULT_ASSIGNEES,
}

const ChoreContext = createContext(null)

export function ChoreProvider({ children }) {
  const [state, dispatch] = useReducer(choreReducer, initialState)

  useEffect(() => {
    const data = loadFromStorage()
    if (data) dispatch({ type: 'LOAD', payload: data })
  }, [])

  useEffect(() => {
    try {
      const payload = { chores: state.chores, assignees: state.assignees }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // e.g. quota exceeded or private mode
    }
  }, [state.chores, state.assignees])

  const addChore = (chore) => dispatch({ type: 'ADD_CHORE', payload: chore })
  const updateChore = (id, updates) => dispatch({ type: 'UPDATE_CHORE', payload: { id, ...updates } })
  const deleteChore = (id) => dispatch({ type: 'DELETE_CHORE', payload: id })
  const addAssignee = (name) => dispatch({ type: 'ADD_ASSIGNEE', payload: name })

  return (
    <ChoreContext.Provider
      value={{
        chores: state.chores,
        assignees: state.assignees,
        addChore,
        updateChore,
        deleteChore,
        addAssignee,
      }}
    >
      {children}
    </ChoreContext.Provider>
  )
}

export function useChores() {
  const ctx = useContext(ChoreContext)
  if (!ctx) throw new Error('useChores must be used within ChoreProvider')
  return ctx
}
