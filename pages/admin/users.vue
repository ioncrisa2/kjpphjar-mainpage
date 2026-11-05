<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth', superAdminOnly: true })
useHead({ title: "Pengguna | Admin KJPP HJA'R" })

interface UserRow {
  _id: string
  username: string
  name: string
  role: string
  roleName: string
  isSuperAdmin: boolean
  isActive: boolean
  leaderId: string | null
  leader: { _id: string; name: string; position: string } | null
  lastLoginAt: string | null
  createdAt: string
}

const { session } = useAdminAuth()
const { data: usersData, refresh, pending } = await useFetch<{ items: UserRow[] }>('/api/admin/users')
const { data: rolesData } = await useFetch<{ items: Array<{ key: string; name: string }> }>('/api/admin/roles')
const { data: leaders } = await useFetch<any[]>('/api/leaders')

const users = computed(() => usersData.value?.items || [])
const roles = computed(() => rolesData.value?.items || [])
const MIN_PASSWORD = 12

function formatDate(value: string | null) {
  if (!value) return 'Belum pernah'
  return new Date(value).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
}

// Form tambah / ubah
const modalOpen = ref(false)
const saving = ref(false)
const formError = ref('')
const editing = ref<UserRow | null>(null)
const form = reactive({
  username: '',
  name: '',
  password: '',
  role: '',
  leaderId: '',
  isActive: true,
})
const isSelf = computed(() => editing.value?._id === session.value?.id)

function openAdd() {
  editing.value = null
  formError.value = ''
  Object.assign(form, { username: '', name: '', password: '', role: roles.value.find((r) => r.key !== 'admin')?.key || '', leaderId: '', isActive: true })
  modalOpen.value = true
}

function openEdit(user: UserRow) {
  editing.value = user
  formError.value = ''
  Object.assign(form, { username: user.username, name: user.name, password: '', role: user.role, leaderId: user.leaderId || '', isActive: user.isActive })
  modalOpen.value = true
}

async function submitForm() {
  formError.value = ''
  if (!editing.value && form.password.length < MIN_PASSWORD) {
    formError.value = `Password awal minimal ${MIN_PASSWORD} karakter.`
    return
  }

  saving.value = true
  try {
    if (editing.value) {
      await $fetch(`/api/admin/users/${editing.value._id}`, {
        method: 'PUT',
        body: { name: form.name, role: form.role, leaderId: form.leaderId || null, isActive: form.isActive },
      })
    } else {
      await $fetch('/api/admin/users', {
        method: 'POST',
        body: { username: form.username, name: form.name, password: form.password, role: form.role, leaderId: form.leaderId || null },
      })
    }
    modalOpen.value = false
    await refresh()
  } catch (err: any) {
    formError.value = err?.data?.statusMessage || 'Gagal menyimpan pengguna.'
  } finally {
    saving.value = false
  }
}

// Reset password
const resetOpen = ref(false)
const resetTarget = ref<UserRow | null>(null)
const resetForm = reactive({ password: '', confirm: '' })
const resetError = ref('')
const resetting = ref(false)

function openReset(user: UserRow) {
  resetTarget.value = user
  resetForm.password = ''
  resetForm.confirm = ''
  resetError.value = ''
  resetOpen.value = true
}

async function submitReset() {
  resetError.value = ''
  if (resetForm.password.length < MIN_PASSWORD) {
    resetError.value = `Password baru minimal ${MIN_PASSWORD} karakter.`
    return
  }
  if (resetForm.password !== resetForm.confirm) {
    resetError.value = 'Konfirmasi password tidak cocok.'
    return
  }
  resetting.value = true
  try {
    const res = await $fetch<{ message: string }>(`/api/admin/users/${resetTarget.value!._id}/reset-password`, {
      method: 'POST',
      body: { password: resetForm.password },
    })
    resetOpen.value = false
    alert(res.message)
  } catch (err: any) {
    resetError.value = err?.data?.statusMessage || 'Gagal mereset password.'
  } finally {
    resetting.value = false
  }
}

const { ask } = useConfirm()

async function deleteUser(user: UserRow) {
  const confirmed = await ask({
    title: 'Hapus Pengguna',
    message: 'Akun ini tidak bisa login lagi. Artikel, foto, dan klien buatannya tetap ada dan hanya bisa dikelola oleh editor.',
    itemName: `${user.name} (${user.username})`,
    confirmText: 'Ya, Hapus',
  })
  if (!confirmed) return
  try {
    await $fetch(`/api/admin/users/${user._id}`, { method: 'DELETE' })
    await refresh()
  } catch (err: any) {
    alert(err?.data?.statusMessage || 'Gagal menghapus pengguna.')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Pengguna</h1>
        <p class="mt-1 text-sm text-gray">
          Kelola akun panel admin. Hak akses setiap akun ditentukan oleh rolenya di menu
          <NuxtLink to="/admin/roles" class="font-semibold text-primary hover:underline">Role & Hak Akses</NuxtLink>.
        </p>
      </div>
      <button class="admin-btn-primary" @click="openAdd">+ Tambah Pengguna</button>
    </div>

    <div class="admin-card overflow-hidden !p-0">
      <div v-if="pending" class="p-6 text-center text-gray-500">Memuat data...</div>
      <div v-else-if="!users.length" class="p-6 text-center text-gray-500">Belum ada pengguna.</div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray/10">
          <thead class="bg-gray/5">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray">Pengguna</th>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray">Role</th>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray">Penulis Artikel</th>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray">Status</th>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray">Login Terakhir</th>
              <th class="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray/10 bg-white dark:bg-gray-dark">
            <tr v-for="user in users" :key="user._id">
              <td class="px-6 py-4">
                <p class="text-sm font-bold text-black dark:text-white">
                  {{ user.name }}
                  <span v-if="user._id === session?.id" class="ml-1 text-xs font-semibold text-primary">(Anda)</span>
                </p>
                <p class="text-xs text-gray">{{ user.username }}</p>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex rounded-full px-2.5 py-1 text-xs font-bold"
                  :class="user.isSuperAdmin ? 'bg-violet-100 text-violet-800' : 'bg-stone-100 text-stone-700'"
                >
                  {{ user.roleName }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray">{{ user.leader?.name || '—' }}</td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex rounded-full px-2.5 py-1 text-xs font-bold"
                  :class="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ user.isActive ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray">{{ formatDate(user.lastLoginAt) }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                <button class="mr-4 text-primary hover:text-blue-900" @click="openEdit(user)">Edit</button>
                <template v-if="user._id !== session?.id">
                  <button class="mr-4 text-amber-700 hover:text-amber-900" @click="openReset(user)">Reset Password</button>
                  <button class="text-red-600 hover:text-red-900" @click="deleteUser(user)">Hapus</button>
                </template>
                <NuxtLink v-else to="/admin/profile" class="text-gray hover:text-black dark:hover:text-white">Ganti Password</NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal tambah / ubah -->
    <UiModal v-model="modalOpen" :title="editing ? 'Edit Pengguna' : 'Tambah Pengguna'">
      <form class="space-y-4" @submit.prevent="submitForm">
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label for="user-username" class="admin-label">Username</label>
            <input
              id="user-username"
              v-model="form.username"
              type="text"
              required
              minlength="3"
              maxlength="120"
              autocomplete="off"
              :disabled="!!editing"
              class="admin-input disabled:cursor-not-allowed disabled:opacity-60"
            >
            <p class="mt-1 text-xs text-gray">{{ editing ? 'Username tidak dapat diubah.' : 'Huruf, angka, titik, @, _ atau -.' }}</p>
          </div>
          <div>
            <label for="user-name" class="admin-label">Nama Tampilan</label>
            <input id="user-name" v-model="form.name" type="text" maxlength="120" class="admin-input" placeholder="Nama lengkap">
          </div>
        </div>

        <div v-if="!editing">
          <label for="user-password" class="admin-label">Password Awal</label>
          <input
            id="user-password"
            v-model="form.password"
            type="password"
            required
            :minlength="MIN_PASSWORD"
            autocomplete="new-password"
            class="admin-input"
            placeholder="Minimal 12 karakter"
          >
          <p class="mt-1 text-xs text-gray">Sampaikan secara langsung ke pengguna dan minta diganti lewat halaman Profil.</p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label for="user-role" class="admin-label">Role</label>
            <select id="user-role" v-model="form.role" required :disabled="isSelf" class="admin-input disabled:cursor-not-allowed disabled:opacity-60">
              <option value="" disabled>Pilih role</option>
              <option v-for="role in roles" :key="role.key" :value="role.key">{{ role.name }}</option>
            </select>
            <p v-if="isSelf" class="mt-1 text-xs text-gray">Role akun sendiri tidak dapat diubah.</p>
          </div>
          <div>
            <label for="user-leader" class="admin-label">Penulis Artikel (Pimpinan)</label>
            <select id="user-leader" v-model="form.leaderId" class="admin-input">
              <option value="">Tidak terhubung</option>
              <option v-for="leader in leaders" :key="leader._id" :value="leader._id">
                {{ leader.name }} — {{ leader.position }}
              </option>
            </select>
            <p class="mt-1 text-xs text-gray">Artikel pengguna tanpa akses kelola semua artikel otomatis atas nama Pimpinan ini.</p>
          </div>
        </div>

        <label v-if="editing" class="flex items-start gap-3 rounded-xl bg-stone-50 p-3 text-sm dark:bg-gray-800" :class="isSelf ? 'opacity-60' : 'cursor-pointer'">
          <input v-model="form.isActive" type="checkbox" :disabled="isSelf" class="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary">
          <span>
            <strong class="block text-black dark:text-white">Akun aktif</strong>
            <span class="text-gray">Menonaktifkan akun langsung mengakhiri semua sesi login-nya.</span>
          </span>
        </label>

        <p v-if="formError" role="alert" class="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:bg-red-500/10 dark:text-red-300">
          {{ formError }}
        </p>

        <div class="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <button type="button" class="admin-btn-ghost justify-center" @click="modalOpen = false">Batal</button>
          <button type="submit" :disabled="saving" class="admin-btn-primary justify-center">
            {{ saving ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </form>
    </UiModal>

    <!-- Modal reset password -->
    <UiModal v-model="resetOpen" :title="`Reset Password — ${resetTarget?.name || ''}`">
      <form class="space-y-4" @submit.prevent="submitReset">
        <p class="text-sm text-gray">Semua sesi login pengguna ini akan langsung berakhir.</p>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label for="reset-password" class="admin-label">Password Baru</label>
            <input id="reset-password" v-model="resetForm.password" type="password" required :minlength="MIN_PASSWORD" autocomplete="new-password" class="admin-input" placeholder="Minimal 12 karakter">
          </div>
          <div>
            <label for="reset-confirm" class="admin-label">Konfirmasi Password</label>
            <input id="reset-confirm" v-model="resetForm.confirm" type="password" required autocomplete="new-password" class="admin-input">
          </div>
        </div>
        <p v-if="resetError" role="alert" class="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:bg-red-500/10 dark:text-red-300">
          {{ resetError }}
        </p>
        <div class="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <button type="button" class="admin-btn-ghost justify-center" @click="resetOpen = false">Batal</button>
          <button type="submit" :disabled="resetting" class="admin-btn-primary justify-center">
            {{ resetting ? 'Menyimpan...' : 'Reset Password' }}
          </button>
        </div>
      </form>
    </UiModal>
  </div>
</template>
