// https://nuxt.com/docs/api/configuration/nuxt-config
const isProduction = process.env.NODE_ENV === 'production'
const configuredJwtSecret = process.env.JWT_SECRET?.trim()
const jwtSecret = configuredJwtSecret || 'dev-secret-change-in-production-min-32-chars'

export default defineNuxtConfig({
  devtools: { enabled: !isProduction },

  // Modules
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/sitemap',
    'nuxt-icon',
  ],

  // CSS — Only core stylesheet globally
  css: [
    '~/assets/css/main.css',
  ],

  // Nitro server optimizations
  nitro: {
    compressPublicAssets: true,
    minify: true,
  },

  // Vite build & code splitting optimizations
  vite: {
    build: {
      cssCodeSplit: true,
    },
  },

  // PostCSS / Tailwind
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // Runtime config — server-side (private) & public
  runtimeConfig: {
    // Private — only available server-side
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/kjpphjar_dev',
    jwtSecret,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    analyticsHashSecret:
      process.env.ANALYTICS_HASH_SECRET ||
      jwtSecret,
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: process.env.SMTP_PORT || '465',
    smtpSecure: process.env.SMTP_SECURE || 'true',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    mailTo: process.env.MAIL_TO || '',
    // Public — exposed to client
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      whatsappNumber: process.env.WHATSAPP_NUMBER || '628117101066',
    },
  },

  // Sitemap config
  sitemap: {
    strictNuxtContentPaths: false,
    sources: [
      '/api/_sitemap-urls'
    ]
  },

  // Caching & static headers
  routeRules: {
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/assets/**': { headers: { 'cache-control': 'public, max-age=2592000, stale-while-revalidate=86400' } },
    '/favicon.png': { headers: { 'cache-control': 'public, max-age=2592000' } },
  },

  // App head — default SEO & non-render-blocking font performance
  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: "KJPP HJA'R | Penilai Publik & Konsultan Independen",
      meta: [
        {
          name: 'description',
          content:
            'KJPP Henricus Judi Adrianto dan Rekan — perusahaan jasa penilai publik dan konsultan independen dengan pengalaman lebih dari 10 tahun.',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: "KJPP HJA'R" },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'preload',
          as: 'style',
          href: 'https://fonts.googleapis.com/css2?family=Mulish:wght@400;500;600;700;800;900&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Mulish:wght@400;500;600;700;800;900&display=swap',
          media: 'print',
          onload: "this.media='all'",
        },
      ],
    },
  },
})
