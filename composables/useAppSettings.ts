import {
  createDefaultPublicSettings,
  type PublicAppSettings,
} from '~/types/settings'

export function useAppSettings() {
  return useFetch<PublicAppSettings>('/api/settings', {
    key: 'app-settings',
    default: createDefaultPublicSettings,
  })
}
