import {
  COMPANY_DATA,
  normalizeBranchDisplay,
  formatPhoneHref,
  buildProfessionalServiceJsonLd,
  type OfficeBranchData,
} from '~/shared/company-data'

export function useCompanyProfile() {
  const { data: settings } = useAppSettings()
  const { data: branchesData } = useFetch<any[]>('/api/branches', {
    key: 'public-branches',
    default: () => [...COMPANY_DATA.branches],
  })

  const branches = computed<OfficeBranchData[]>(() => {
    const raw = branchesData.value || []
    if (!raw.length) return [...COMPANY_DATA.branches]
    return raw
      .map((item) => normalizeBranchDisplay(item))
      .sort((a, b) => a.order - b.order)
  })

  const headOffice = computed(() => ({
    ...COMPANY_DATA.headOffice,
    fullAddress: settings.value?.footerAddress?.headOffice || COMPANY_DATA.headOffice.fullAddress,
    googleMapsUrl:
      settings.value?.footerAddress?.googleMapsUrl || COMPANY_DATA.headOffice.googleMapsUrl,
    googleMapsEmbedUrl:
      settings.value?.footerAddress?.googleMapsEmbedUrl ||
      COMPANY_DATA.headOffice.googleMapsEmbedUrl,
    phone: settings.value?.generalContacts?.phone || COMPANY_DATA.headOffice.phone,
    email: settings.value?.generalContacts?.email || COMPANY_DATA.headOffice.email,
    whatsappDigits:
      settings.value?.generalContacts?.whatsapp || COMPANY_DATA.headOffice.whatsappDigits,
  }))

  const otherBranches = computed(() => branches.value.filter((b) => !b.isHeadOffice))

  return {
    company: COMPANY_DATA,
    settings,
    headOffice,
    branches,
    otherBranches,
    formatPhoneHref,
    buildProfessionalServiceJsonLd,
  }
}
