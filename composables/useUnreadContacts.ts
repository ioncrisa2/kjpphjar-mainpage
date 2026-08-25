export const useUnreadContacts = () => {
  const unreadCount = useState<number>('unread-contacts-count', () => 0)

  const fetchUnreadCount = async () => {
    try {
      const res = await $fetch<{ unread: number }>('/api/contacts/unread-count')
      unreadCount.value = res.unread || 0
    } catch {
      // silent catch
    }
  }

  const decrementUnread = () => {
    if (unreadCount.value > 0) {
      unreadCount.value--
    }
  }

  const setUnreadCount = (val: number) => {
    unreadCount.value = Math.max(0, val)
  }

  return {
    unreadCount,
    fetchUnreadCount,
    decrementUnread,
    setUnreadCount,
  }
}
