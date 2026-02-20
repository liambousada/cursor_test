import React, { useEffect } from 'react'

export default function Toast({ message, visible, onDismiss }) {
  useEffect(() => {
    if (!visible) return
    const t = setTimeout(onDismiss, 2800)
    return () => clearTimeout(t)
  }, [visible, onDismiss])

  if (!visible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-gray-800 text-white px-4 py-2.5 text-sm font-medium shadow-soft-lg animate-[toast-in_0.25s_ease-out]"
    >
      {message}
    </div>
  )
}
