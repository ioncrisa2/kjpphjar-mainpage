export const getNuxtIconName = (iconClass: string | undefined): string => {
  if (!iconClass) return 'fa6-solid:circle-question'

  // If it's already in the Iconify format (contains a colon), return as is
  if (iconClass.includes(':')) return iconClass

  // Convert font-awesome solid classes
  if (iconClass.includes('fas fa-')) {
    return 'fa6-solid:' + iconClass.replace('fas fa-', '').trim()
  }

  // Convert font-awesome regular classes
  if (iconClass.includes('far fa-')) {
    return 'fa6-regular:' + iconClass.replace('far fa-', '').trim()
  }

  // Convert font-awesome brands
  if (iconClass.includes('fab fa-')) {
    return 'fa6-brands:' + iconClass.replace('fab fa-', '').trim()
  }

  // Fallback: assume it's fa6-solid if just a simple string
  return 'fa6-solid:' + iconClass.replace('fa-', '').trim()
}
