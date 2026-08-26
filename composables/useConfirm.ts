export interface ConfirmOptions {
  title?: string
  message?: string
  itemName?: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

interface ConfirmState extends ConfirmOptions {
  isOpen: boolean
  isLoading: boolean
}

const defaultOptions: ConfirmOptions = {
  title: 'Konfirmasi Hapus',
  message: 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
  confirmText: 'Ya, Hapus',
  cancelText: 'Batal',
  variant: 'danger',
}

export function useConfirm() {
  const state = useState<ConfirmState>('global-confirm-state', () => ({
    isOpen: false,
    isLoading: false,
    ...defaultOptions,
  }))

  const resolver = useState<((value: boolean) => void) | null>('global-confirm-resolver', () => null)

  function ask(opts?: string | ConfirmOptions): Promise<boolean> {
    if (typeof opts === 'string') {
      state.value = {
        isOpen: true,
        isLoading: false,
        ...defaultOptions,
        message: opts,
      }
    } else if (opts) {
      state.value = {
        isOpen: true,
        isLoading: false,
        title: opts.title || defaultOptions.title,
        message: opts.message || defaultOptions.message,
        itemName: opts.itemName,
        confirmText: opts.confirmText || defaultOptions.confirmText,
        cancelText: opts.cancelText || defaultOptions.cancelText,
        variant: opts.variant || defaultOptions.variant,
      }
    } else {
      state.value = {
        isOpen: true,
        isLoading: false,
        ...defaultOptions,
      }
    }

    return new Promise<boolean>((resolve) => {
      resolver.value = resolve
    })
  }

  function handleConfirm() {
    state.value.isOpen = false
    if (resolver.value) {
      resolver.value(true)
      resolver.value = null
    }
  }

  function handleCancel() {
    state.value.isOpen = false
    if (resolver.value) {
      resolver.value(false)
      resolver.value = null
    }
  }

  return {
    state,
    ask,
    handleConfirm,
    handleCancel,
  }
}
