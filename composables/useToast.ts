export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastItem {
  id: number
  type: ToastVariant
  message: string
}

export function useToast() {
  const toasts = useState<ToastItem[]>('global-toasts', () => [])

  function push(type: ToastVariant, message: string, durationMs = 4500) {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    toasts.value = [...toasts.value, { id, type, message }]

    if (import.meta.client && durationMs > 0) {
      window.setTimeout(() => dismiss(id), durationMs)
    }
    return id
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((item) => item.id !== id)
  }

  return {
    toasts,
    push,
    dismiss,
    success: (message: string, durationMs?: number) => push('success', message, durationMs),
    error: (message: string, durationMs?: number) => push('error', message, durationMs),
    info: (message: string, durationMs?: number) => push('info', message, durationMs),
  }
}
