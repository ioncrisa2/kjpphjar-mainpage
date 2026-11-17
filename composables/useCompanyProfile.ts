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

  const company = computed(() => ({
    ...COMPANY_DATA,
    name: settings.value?.siteName || COMPANY_DATA.name,
    operatingHours: {
      ...COMPANY_DATA.operatingHours,
      display:
        settings.value?.legalInfo?.operatingHours || COMPANY_DATA.operatingHours.display,
    },
    licenses: {
      ...COMPANY_DATA.licenses,
      kjppLicenseNumber:
        settings.value?.legalInfo?.kjppLicenseNumber ||
        COMPANY_DATA.licenses.kjppLicenseNumber,
      kjppDecreeNumber:
        settings.value?.legalInfo?.kjppDecreeNumber ||
        COMPANY_DATA.licenses.kjppDecreeNumber,
      managingPartnerValuerLicense:
        settings.value?.legalInfo?.managingPartnerValuerLicense ||
        COMPANY_DATA.licenses.managingPartnerValuerLicense,
      mappiMembership:
        settings.value?.legalInfo?.mappiMembership ||
        COMPANY_DATA.licenses.mappiMembership,
      ojkRegistration:
        settings.value?.legalInfo?.ojkRegistration ||
        COMPANY_DATA.licenses.ojkRegistration,
    },
  }))

  return {
    company,
    settings,
    headOffice,
    branches,
    otherBranches,
    formatPhoneHref,
    buildProfessionalServiceJsonLd,
  }
}
