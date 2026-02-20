import React, { useState, useCallback } from 'react'
import ChoreDashboard from './components/ChoreDashboard.jsx'
import CalendarView from './components/CalendarView.jsx'
import ChoreForm from './components/ChoreForm.jsx'
import Toast from './components/Toast.jsx'

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'calendar', label: 'Calendar' },
]

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const [formOpen, setFormOpen] = useState(false)
  const [editChore, setEditChore] = useState(null)
  const [preselectedDate, setPreselectedDate] = useState(null)
  const [toastVisible, setToastVisible] = useState(false)

  const openAddForm = useCallback(() => {
    setEditChore(null)
    setPreselectedDate(null)
    setFormOpen(true)
  }, [])

  const openEditForm = useCallback((chore) => {
    setEditChore(chore)
    setPreselectedDate(null)
    setFormOpen(true)
  }, [])

  const openAddFormForDate = useCallback((date) => {
    setEditChore(null)
    setPreselectedDate(date)
    setFormOpen(true)
  }, [])

  const closeForm = useCallback(() => {
    setFormOpen(false)
    setEditChore(null)
    setPreselectedDate(null)
  }, [])

  const showSavedToast = useCallback(() => {
    setToastVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-soft-cream font-sans text-gray-800 antialiased">
      <header className="sticky top-0 z-40 border-b border-soft-sand/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <h1 className="text-xl font-semibold text-gray-800">Chore Manager</h1>
          <nav className="mt-3 flex gap-1">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  tab === id
                    ? 'bg-soft-mist text-gray-800'
                    : 'text-gray-500 hover:bg-soft-stone hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        {tab === 'dashboard' && (
          <ChoreDashboard onOpenAdd={openAddForm} onOpenEdit={openEditForm} />
        )}
        {tab === 'calendar' && (
          <CalendarView onAddChoreForDate={openAddFormForDate} />
        )}
      </main>

      <ChoreForm
        isOpen={formOpen}
        onClose={closeForm}
        editChore={editChore}
        preselectedDate={preselectedDate}
        onSaved={showSavedToast}
      />

      <Toast
        message="Saved"
        visible={toastVisible}
        onDismiss={() => setToastVisible(false)}
      />
    </div>
  )
}
