const fa5ToFa6Map: Record<string, string> = {
  'project-diagram': 'diagram-project',
  'hard-hat': 'helmet-safety',
  'search-dollar': 'magnifying-glass-dollar',
  'home': 'house',
  'money-bill-wave': 'money-bill-1-wave',
  'hand-holding-usd': 'hand-holding-dollar',
  'university': 'landmark',
}

export const getNuxtIconName = (iconClass: string | undefined): string => {
  if (!iconClass) return 'fa6-solid:circle-question'

  let iconName = iconClass.trim()

  // Handle prefix with colon e.g. "fa6-solid:hard-hat"
  if (iconName.includes(':')) {
    const parts = iconName.split(':')
    const prefix = parts[0]
    const name = parts.slice(1).join(':')
    const mapped = fa5ToFa6Map[name] || name
    return `${prefix}:${mapped}`
  }

  // Handle legacy Font Awesome class names (fas fa-..., far fa-..., fab fa-...)
  if (iconName.startsWith('fas fa-')) {
    iconName = iconName.replace('fas fa-', '')
  } else if (iconName.startsWith('far fa-')) {
    const name = iconName.replace('far fa-', '')
    return `fa6-regular:${fa5ToFa6Map[name] || name}`
  } else if (iconName.startsWith('fab fa-')) {
    const name = iconName.replace('fab fa-', '')
    return `fa6-brands:${fa5ToFa6Map[name] || name}`
  } else if (iconName.startsWith('fa-')) {
    iconName = iconName.replace('fa-', '')
  }

  const mappedName = fa5ToFa6Map[iconName] || iconName
  return `fa6-solid:${mappedName}`
}

