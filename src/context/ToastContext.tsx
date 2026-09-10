import { createContext, useCallback, useContext, useState } from 'react'

type ToastType = 'success' | 'error' | 'info'
interface Toast { id: number; message: string; type: ToastType }
interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | null>(null)
let counter = 0

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++counter
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>{t.message}</div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const c = useContext(ToastContext)
  if (!c) throw new Error('useToast must be inside ToastProvider')
  return c
}
