export interface OfficeBranchData {
  id: string
  name: string
  city: string
  province: string
  address: string
  postalCode?: string
  phone: string
  phoneHref: string
  phoneNeedsConfirmation?: boolean
  email: string
  latitude: number
  longitude: number
  mapsUrl: string
  isHeadOffice?: boolean
  order: number
}

export const COMPANY_DATA = {
  name: 'KJPP Henricus Judi Adrianto & Rekan',
  legalName: 'Kantor Jasa Penilai Publik Henricus Judi Adrianto dan Rekan',
  shortName: "KJPP HJA'R",
  foundedYear: 2013,
  foundedDate: '2013-11-28',
  foundedDeed:
    'Akta Notaris Linda Aprianti No. 114 Tanggal 31 Oktober 2013 dan Akta Perubahan Terbaru No. 01 Tanggal 3 Agustus 2019',
  headOffice: {
    id: '6a8db75ed6c1ec3f2fe76d1f',
    name: 'Kantor Pusat Palembang',
    streetAddress: 'Ruko Terminal Sako No. 18, Jl. Sako Raya / Jl. Siaran, Sialang, Kec. Sako',
    fullAddress:
      'Ruko Terminal Sako No. 18, Jl. Sako Raya / Jl. Siaran, Sialang, Kec. Sako, Kota Palembang, Sumatera Selatan 30163',
    locality: 'Palembang',
    region: 'Sumatera Selatan',
    postalCode: '30163',
    country: 'ID',
    phone: '(0711) 5615793',
    phoneE164: '+627115615793',
    whatsapp: '0811-7101-066',
    whatsappDigits: '628117101066',
    email: 'henricusja@yahoo.com',
    latitude: -2.9309659,
    longitude: 104.7906236,
    googleMapsUrl:
      "https://www.google.com/maps/place/2%C2%B055'51.5%22S+104%C2%B047'26.2%22E/@-2.9310068,104.7887215,17.33z/data=!4m4!3m3!8m2!3d-2.9309659!4d104.7906236?entry=ttu",
    googleMapsEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.5997561!2d104.7884349!3d-2.9309659!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMsKwNTUnNTEuNSJTIDEwNMKwNDcnMjYuMiJF!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
  },
  operatingHours: {
    display: 'Senin – Jumat: 08.00 – 17.00 WIB [PERLU KONFIRMASI]',
    weekendDisplay: 'Sabtu, Minggu & Hari Libur Nasional: Tutup [PERLU KONFIRMASI]',
    specification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      },
    ],
  },
  licenses: {
    kjppLicenseNumber: '2.20.0166',
    kjppDecreeNumber: 'Keputusan Menteri Keuangan RI No. 31/KM.1/2020 (20 Januari 2020)',
    kjppInitialDecree: 'KMK No. 698/KM.1/2013',
    managingPartnerValuerLicense: 'P-1.13.0380 (Henricus Judi Adrianto)',
    mappiMembership:
      'Masyarakat Profesi Penilai Indonesia (MAPPI) – Pimpinan Rekan No. MAPPI 96-S-00827',
    ojkRegistration: '[PERLU KONFIRMASI]',
  },
  socialMedia: {
    instagram: 'https://www.instagram.com/kjpphenricusdanrekan/',
  },
  areaServed: {
    primaryCity: 'Palembang',
    primaryProvince: 'Sumatera Selatan',
    sumselRegions: [
      'Kota Palembang',
      'Kota Prabumulih',
      'Kota Lubuklinggau',
      'Kota Pagaralam',
      'Kabupaten Banyuasin',
      'Kabupaten Musi Banyuasin',
      'Kabupaten Ogan Ilir',
      'Kabupaten Ogan Komering Ilir',
      'Kabupaten Ogan Komering Ulu',
      'Kabupaten OKU Timur',
      'Kabupaten OKU Selatan',
      'Kabupaten Muara Enim',
      'Kabupaten Lahat',
      'Kabupaten Empat Lawang',
      'Kabupaten Musi Rawas',
      'Kabupaten Musi Rawas Utara',
      'Kabupaten Penukal Abab Lematang Ilir (PALI)',
    ],
    sumateraProvinces: [
      'Sumatera Selatan',
      'Lampung',
      'Bengkulu',
      'Jambi',
      'Kepulauan Bangka Belitung',
      'Riau',
      'Kepulauan Riau',
      'Sumatera Barat',
      'Sumatera Utara',
      'Aceh',
    ],
  },
  branches: [
    {
      id: '6a8db75ed6c1ec3f2fe76d1f',
      name: 'Kantor Pusat Palembang',
      city: 'Palembang',
      province: 'Sumatera Selatan',
      address:
        'Ruko Terminal Sako No. 18, Jl. Sako Raya / Jl. Siaran, Sialang, Kec. Sako, Kota Palembang, Sumatera Selatan 30163',
      postalCode: '30163',
      phone: '(0711) 5615793',
      phoneHref: 'tel:+627115615793',
      email: 'henricusja@yahoo.com',
      latitude: -2.9309659153861505,
      longitude: 104.79062355342076,
      mapsUrl:
        "https://www.google.com/maps/place/2%C2%B055'51.5%22S+104%C2%B047'26.2%22E/@-2.9310068,104.7887215,17.33z/data=!4m4!3m3!8m2!3d-2.9309659!4d104.7906236?entry=ttu",
      isHeadOffice: true,
      order: 1,
    },
    {
      id: '6a8db75ed6c1ec3f2fe76d20',
      name: 'Cabang Surabaya',
      city: 'Surabaya',
      province: 'Jawa Timur',
      address: 'Jln. Kebonsari LVK VII/51 RT 007 RW-003, Surabaya',
      phone: '0812-3121-8422',
      phoneHref: 'tel:+6281231218422',
      email: 'kjpphjasurabaya@gmail.com',
      latitude: -7.323643419477218,
      longitude: 112.71687287331551,
      mapsUrl:
        "https://www.google.com/maps/place/7%C2%B019'25.1%22S+112%C2%B043'00.7%22E/@-7.3236381,112.714298,17z/data=!3m1!4b1!4m4!3m3!8m2!3d-7.3236434!4d112.7168729?entry=ttu",
      isHeadOffice: false,
      order: 2,
    },
    {
      id: '6a8db75ed6c1ec3f2fe76d21',
      name: 'Cabang Balikpapan',
      city: 'Balikpapan',
      province: 'Kalimantan Timur',
      address: 'Jln. Penggalang No. 19 RT. 033 Damai, Balikpapan',
      phone: '0853-9333-6515',
      phoneHref: 'tel:+6285393336515',
      email: 'kjpphajarkaltim@gmail.com',
      latitude: -1.2621375219397608,
      longitude: 116.85719186501848,
      mapsUrl:
        "https://www.google.com/maps/place/1%C2%B015'43.7%22S+106%C2%B051'25.9%22E/@-1.2621321,116.854617,17z/data=!3m1!4b1!4m4!3m3!8m2!3d-1.2621375!4d116.8571919?entry=ttu",
      isHeadOffice: false,
      order: 3,
    },
    {
      id: '6aed4bf3e00faf7af41faaff',
      name: 'Cabang Tangerang Selatan',
      city: 'Tangerang Selatan',
      province: 'Banten',
      address: 'Jl. H. Kuncin No. 51, Sudimara Pinang, Kec. Pinang, Kota Tangerang',
      phone: '+62 813-9966-4363 [PERLU KONFIRMASI]',
      phoneHref: 'tel:+6281399664363',
      phoneNeedsConfirmation: true,
      email: 'henricusja@yahoo.com',
      latitude: -6.22503,
      longitude: 106.688262,
      mapsUrl:
        "https://www.google.com/maps/place/6%C2%B013'30.1%22S+106%C2%B041'17.7%22E/@-6.2250247,106.6856871,17z/data=!3m1!4b1!4m4!3m3!8m2!3d-6.22503!4d106.688262?entry=ttu",
      isHeadOffice: false,
      order: 4,
    },
  ] satisfies OfficeBranchData[],
} as const

export function formatPhoneHref(phone: string): string {
  const cleaned = String(phone || '').replace(/\[.*?\]/g, '').replace(/[^0-9+]/g, '')
  return cleaned ? `tel:${cleaned}` : 'tel:+627115615793'
}

export function normalizeBranchDisplay(rawBranch: Record<string, any>): OfficeBranchData {
  const canonical = COMPANY_DATA.branches.find(
    (b) =>
      b.id === String(rawBranch._id || rawBranch.id || '') ||
      b.city.toLowerCase() === String(rawBranch.city || '').toLowerCase()
  )

  const rawPhone = String(rawBranch.phone || canonical?.phone || '')
  const normalizedPhone =
    rawPhone.trim() === '+62 13 9966 4363'
      ? '+62 813-9966-4363 [PERLU KONFIRMASI]'
      : rawPhone || canonical?.phone || ''

  return {
    id: String(rawBranch._id || rawBranch.id || canonical?.id || ''),
    name: canonical?.name || rawBranch.name || '',
    city: canonical?.city || rawBranch.city || '',
    province: canonical?.province || '',
    address: canonical?.address || rawBranch.address || '',
    postalCode: canonical?.postalCode,
    phone: normalizedPhone,
    phoneHref: formatPhoneHref(normalizedPhone),
    phoneNeedsConfirmation:
      canonical?.phoneNeedsConfirmation || normalizedPhone.includes('[PERLU KONFIRMASI]'),
    email: rawBranch.email || canonical?.email || COMPANY_DATA.headOffice.email,
    latitude: Number(rawBranch.latitude ?? canonical?.latitude ?? 0),
    longitude: Number(rawBranch.longitude ?? canonical?.longitude ?? 0),
    mapsUrl: rawBranch.mapsUrl || canonical?.mapsUrl || COMPANY_DATA.headOffice.googleMapsUrl,
    isHeadOffice: Boolean(canonical?.isHeadOffice || rawBranch.order === 1),
    order: Number(rawBranch.order ?? canonical?.order ?? 99),
  }
}

export function buildProfessionalServiceJsonLd(baseUrl = 'https://kjpp-hjar.co.id') {
  const cleanBase = baseUrl.replace('://www.', '://').replace(/\/$/, '')
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${cleanBase}/#organization`,
    name: COMPANY_DATA.name,
    alternateName: COMPANY_DATA.shortName,
    url: cleanBase,
    logo: `${cleanBase}/assets/images/h-logo.png`,
    image: `${cleanBase}/assets/images/og-default.jpg`,
    telephone: COMPANY_DATA.headOffice.phone,
    email: COMPANY_DATA.headOffice.email,
    foundingDate: COMPANY_DATA.foundedDate,
    description:
      'Kantor Jasa Penilai Publik (KJPP) Henricus Judi Adrianto & Rekan berkantor pusat di Palembang sejak 2013, melayani penilaian properti, penilaian bisnis, studi kelayakan, dan pengawasan proyek di Sumatera Selatan, Sumatera, dan seluruh Indonesia.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY_DATA.headOffice.streetAddress,
      addressLocality: COMPANY_DATA.headOffice.locality,
      addressRegion: COMPANY_DATA.headOffice.region,
      postalCode: COMPANY_DATA.headOffice.postalCode,
      addressCountry: COMPANY_DATA.headOffice.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: COMPANY_DATA.headOffice.latitude,
      longitude: COMPANY_DATA.headOffice.longitude,
    },
    openingHoursSpecification: COMPANY_DATA.operatingHours.specification,
    areaServed: [
      { '@type': 'City', name: 'Palembang' },
      { '@type': 'AdministrativeArea', name: 'Sumatera Selatan' },
      { '@type': 'Place', name: 'Sumatera' },
      { '@type': 'Country', name: 'Indonesia' },
    ],
    sameAs: [COMPANY_DATA.socialMedia.instagram],
  }
}
