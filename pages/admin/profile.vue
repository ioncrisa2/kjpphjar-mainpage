<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })
useHead({ title: "Profil Saya | Admin KJPP HJA'R" })

const { session, fetchSession } = useAdminAuth()

const { data: leaders } = await useFetch<any[]>('/api/leaders', {
  immediate: Boolean(session.value?.leaderId),
})
const linkedLeader = computed(() =>
  (leaders.value || []).find((leader) => leader._id === session.value?.leaderId) || null
)

const profileForm = reactive({
  name: session.value?.name || '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const profileSaving = ref(false)
const feedback = reactive<{ type: 'success' | 'error' | ''; message: string }>({
  type: '',
  message: '',
})

function showFeedback(type: 'success' | 'error', message: string) {
  feedback.type = type
  feedback.message = message
  window.setTimeout(() => {
    if (feedback.message === message) {
      feedback.type = ''
      feedback.message = ''
    }
  }, 6000)
}

async function updateProfile() {
  feedback.type = ''

  if (profileForm.newPassword) {
    if (profileForm.newPassword.length < 12) {
      showFeedback('error', 'Password baru minimal harus 12 karakter.')
      return
    }
    if (profileForm.newPassword !== profileForm.confirmPassword) {
      showFeedback('error', 'Konfirmasi password baru tidak cocok.')
      return
    }
    if (!profileForm.currentPassword) {
      showFeedback('error', 'Password saat ini wajib diisi untuk verifikasi.')
      return
    }
  }

  profileSaving.value = true
  try {
    const res = await $fetch<{ success: boolean; message: string }>('/api/auth/profile', {
      method: 'PUT',
      body: {
        name: profileForm.name,
        currentPassword: profileForm.currentPassword || undefined,
        newPassword: profileForm.newPassword || undefined,
      },
    })
    showFeedback('success', res.message || 'Profil berhasil diperbarui.')
    profileForm.currentPassword = ''
    profileForm.newPassword = ''
    profileForm.confirmPassword = ''
    await fetchSession()
  } catch (err: any) {
    showFeedback('error', err?.data?.statusMessage || err?.message || 'Gagal memperbarui profil.')
  } finally {
    profileSaving.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6">
    <header>
      <h1 class="text-2xl font-extrabold text-black dark:text-white">Profil Saya</h1>
      <p class="mt-1 max-w-2xl text-sm leading-6 text-gray">
        Kelola nama tampilan dan password akun Anda.
      </p>
    </header>

    <div
      v-if="feedback.message"
      role="status"
      aria-live="polite"
      class="flex items-start gap-3 rounded-xl px-4 py-3 text-sm font-semibold"
      :class="
        feedback.type === 'success'
          ? 'bg-green-50 text-green-800 dark:bg-green-500/10 dark:text-green-300'
          : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300'
      "
    >
      <span aria-hidden="true">{{ feedback.type === 'success' ? '✓' : '!' }}</span>
      <span>{{ feedback.message }}</span>
    </div>

    <form class="admin-card !p-0 overflow-hidden" @submit.prevent="updateProfile">
      <div class="p-6 sm:p-8 space-y-8">
        <!-- Info Akun -->
        <section aria-labelledby="account-heading">
          <h2 id="account-heading" class="text-base font-extrabold text-black dark:text-white">
            Informasi Akun
          </h2>
          <p class="mt-1 text-sm text-gray">Username dan role diatur oleh super admin.</p>

          <div class="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <label for="admin-username" class="admin-label">Username (Login ID)</label>
              <input
                id="admin-username"
                :value="session?.username || ''"
                disabled
                class="admin-input bg-stone-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label for="admin-name" class="admin-label">Nama Lengkap Tampilan</label>
              <input
                id="admin-name"
                v-model="profileForm.name"
                required
                maxlength="120"
                placeholder="Misal: Budi Santoso"
                class="admin-input"
              />
            </div>
            <div>
              <span class="admin-label">Role</span>
              <p class="mt-1 text-sm font-semibold text-black dark:text-white">{{ session?.roleName || '-' }}</p>
            </div>
            <div>
              <span class="admin-label">Penulis artikel</span>
              <p class="mt-1 text-sm font-semibold text-black dark:text-white">
                {{ linkedLeader ? `${linkedLeader.name} — ${linkedLeader.position}` : 'Tidak terhubung ke data Pimpinan' }}
              </p>
            </div>
          </div>
        </section>

        <!-- Ganti Password -->
        <section class="border-t border-gray/10 pt-8" aria-labelledby="password-heading">
          <div class="flex items-center gap-2">
            <Icon name="ph:shield-check-bold" class="h-5 w-5 text-primary" />
            <h2 id="password-heading" class="text-base font-extrabold text-black dark:text-white">
              Ganti Password
            </h2>
          </div>
          <p class="mt-1 text-sm text-gray">
            Kosongkan bagian password ini jika Anda hanya ingin memperbarui nama tampilan.
            Mengganti password akan mengakhiri sesi Anda di perangkat lain.
          </p>

          <div class="mt-5 space-y-5 max-w-xl">
            <div>
              <label for="current-password" class="admin-label">Password Saat Ini</label>
              <input
                id="current-password"
                v-model="profileForm.currentPassword"
                type="password"
                autocomplete="current-password"
                placeholder="Masukkan password aktif saat ini"
                class="admin-input"
              />
            </div>

            <div class="grid gap-5 md:grid-cols-2">
              <div>
                <label for="new-password" class="admin-label">Password Baru</label>
                <input
                  id="new-password"
                  v-model="profileForm.newPassword"
                  type="password"
                  autocomplete="new-password"
                  placeholder="Minimal 12 karakter"
                  class="admin-input"
                />
              </div>
              <div>
                <label for="confirm-password" class="admin-label">Konfirmasi Password Baru</label>
                <input
                  id="confirm-password"
                  v-model="profileForm.confirmPassword"
                  type="password"
                  autocomplete="new-password"
                  placeholder="Ulangi password baru"
                  class="admin-input"
                />
              </div>
            </div>

            <div class="rounded-xl bg-blue-50/70 p-4 text-xs leading-5 text-blue-900 dark:bg-blue-500/10 dark:text-blue-200">
              <p class="font-bold mb-1">Syarat Keamanan Password:</p>
              <ul class="list-disc list-inside space-y-0.5">
                <li>Panjang minimal 12 karakter</li>
                <li>Disarankan kombinasi huruf besar, huruf kecil, angka, dan simbol</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <div class="flex justify-end border-t border-gray/10 px-6 py-5 sm:px-8">
        <button type="submit" class="admin-btn-primary" :disabled="profileSaving">
          {{ profileSaving ? 'Menyimpan…' : 'Simpan Perubahan Akun' }}
        </button>
      </div>
    </form>
  </div>
</template>
