export function useAdminSidebar() {
  const isCollapsed = useState<boolean>('admin-sidebar-collapsed', () => false)
  const isManual = useState<boolean>('admin-sidebar-manual', () => false)

  function toggleSidebar() {
    isManual.value = true
    isCollapsed.value = !isCollapsed.value
    if (import.meta.client) {
      localStorage.setItem('admin_sidebar_collapsed', isCollapsed.value ? 'true' : 'false')
    }
  }

  function collapseSidebar() {
    isManual.value = true
    isCollapsed.value = true
    if (import.meta.client) {
      localStorage.setItem('admin_sidebar_collapsed', 'true')
    }
  }

  function expandSidebar() {
    isManual.value = true
    isCollapsed.value = false
    if (import.meta.client) {
      localStorage.setItem('admin_sidebar_collapsed', 'false')
    }
  }

  function handleResize() {
    if (typeof window === 'undefined') return
    // Breakpoint: less than 1024px (lg breakpoint) -> auto minimize sidebar
    if (window.innerWidth < 1024) {
      isCollapsed.value = true
    } else if (!isManual.value) {
      // If user hasn't manually set it in this session, check saved preference or expand
      const saved = localStorage.getItem('admin_sidebar_collapsed')
      if (saved !== null) {
        isCollapsed.value = saved === 'true'
      } else {
        isCollapsed.value = false
      }
    }
  }

  onMounted(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', handleResize)
    }
  })

  return {
    isCollapsed,
    isManual,
    toggleSidebar,
    collapseSidebar,
    expandSidebar,
    handleResize,
  }
}
