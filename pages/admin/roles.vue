<script setup lang="ts">
import type { PermissionGroup } from '~/shared/permissions'

definePageMeta({ layout: 'admin', middleware: 'auth', superAdminOnly: true })
useHead({ title: "Role & Hak Akses | Admin KJPP HJA'R" })

interface RoleRow {
  _id: string
  key: string
  name: string
  description: string
  permissions: string[]
  isSystem: boolean
  userCount: number
}

const { data: rolesData, refresh, pending } = await useFetch<{ items: RoleRow[] }>('/api/admin/roles')
const { data: catalog } = await useFetch<{ groups: PermissionGroup[] }>('/api/admin/permissions')

const roles = computed(() => rolesData.value?.items || [])
const groups = computed(() => catalog.value?.groups || [])
const labelByKey = computed(() => new Map(groups.value.flatMap((g) => g.items.map((i) => [i.key as string, `${g.group}: ${i.label}`]))))

const modalOpen = ref(false)
const saving = ref(false)
const formError = ref('')
const editing = ref<RoleRow | null>(null)
const form = reactive({ name: '', key: '', description: '', permissions: [] as string[] })

function openAdd() {
  editing.value = null
  formError.value = ''
  Object.assign(form, { name: '', key: '', description: '', permissions: [] })
  modalOpen.value = true
}

function openEdit(role: RoleRow) {
  editing.value = role
  formError.value = ''
  Object.assign(form, { name: role.name, key: role.key, description: role.description, permissions: [...role.permissions] })
  modalOpen.value = true
}

function viewPermissionOf(key: string) {
  const view = `${key.split('.')[0]}.view`
  return view !== key && labelByKey.value.has(view) ? view : null
}

// Halaman modul selalu butuh izin "lihat", jadi izin lain ikut mencentangnya
// dan izin "lihat" tidak bisa dilepas selama izin lain di modul itu tercentang.
function togglePermission(key: string, checked: boolean) {
  const next = new Set(form.permissions)
  if (checked) {
    next.add(key)
    const view = viewPermissionOf(key)
    if (view) next.add(view)
  } else {
    next.delete(key)
    if (key.endsWith('.view')) {
      const prefix = key.slice(0, -'view'.length)
      for (const item of [...next]) if (item.startsWith(prefix)) next.delete(item)
    }
  }
  form.permissions = [...next]
}

function isGroupChecked(group: PermissionGroup) {
  return group.items.every((item) => form.permissions.includes(item.key))
}

function toggleGroup(group: PermissionGroup, checked: boolean) {
  const keys = group.items.map((item) => item.key as string)
  const next = new Set(form.permissions)
  keys.forEach((key) => (checked ? next.add(key) : next.delete(key)))
  form.permissions = [...next]
}

async function submitForm() {
  formError.value = ''
  saving.value = true
  try {
    const body = { name: form.name, description: form.description, permissions: form.permissions }
    if (editing.value) {
      await $fetch(`/api/admin/roles/${editing.value._id}`, { method: 'PUT', body })
    } else {
      await $fetch('/api/admin/roles', { method: 'POST', body: { ...body, key: form.key || undefined } })
    }
    modalOpen.value = false
    await refresh()
  } catch (err: any) {
    formError.value = err?.data?.statusMessage || 'Gagal menyimpan role.'
  } finally {
    saving.value = false
  }
}

const { ask } = useConfirm()

async function deleteRole(role: RoleRow) {
  const confirmed = await ask({
    title: 'Hapus Role',
    message: 'Role hanya bisa dihapus bila tidak ada pengguna yang memakainya.',
    itemName: role.name,
    confirmText: 'Ya, Hapus',
  })
  if (!confirmed) return
  try {
    await $fetch(`/api/admin/roles/${role._id}`, { method: 'DELETE' })
    await refresh()
  } catch (err: any) {
    alert(err?.data?.statusMessage || 'Gagal menghapus role.')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Role & Hak Akses</h1>
        <p class="mt-1 max-w-2xl text-sm text-gray">
          Role adalah kumpulan izin. Perubahan izin langsung berlaku untuk semua pengguna dengan role tersebut.
          Kelola pengguna dan role selalu khusus Super Admin.
        </p>
      </div>
      <button class="admin-btn-primary" @click="openAdd">+ Tambah Role</button>
    </div>

    <div v-if="pending" class="admin-card text-center text-gray-500">Memuat data...</div>
    <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article v-for="role in roles" :key="role._id" class="admin-card flex flex-col gap-3">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h2 class="text-base font-extrabold text-black dark:text-white">{{ role.name }}</h2>
            <p class="text-xs text-gray">Kode: {{ role.key }}</p>
          </div>
          <span
            class="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold"
            :class="role.isSystem ? 'bg-violet-100 text-violet-800' : 'bg-stone-100 text-stone-700'"
          >
            {{ role.userCount }} pengguna
          </span>
        </div>
        <p v-if="role.description" class="text-sm text-gray">{{ role.description }}</p>

        <div v-if="role.isSystem" class="rounded-xl bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-800 dark:bg-violet-500/10 dark:text-violet-200">
          Role sistem: akses penuh ke seluruh panel. Tidak dapat diubah atau dihapus.
        </div>
        <div v-else class="flex flex-wrap gap-1.5">
          <span
            v-for="permission in role.permissions"
            :key="permission"
            class="rounded-md bg-gray/5 px-2 py-0.5 text-[11px] font-semibold text-gray-700 dark:text-gray-300"
          >
            {{ labelByKey.get(permission) || permission }}
          </span>
          <span v-if="!role.permissions.length" class="text-xs text-gray">Belum ada izin — pengguna hanya bisa membuka Dashboard dan Profil.</span>
        </div>

        <div v-if="!role.isSystem" class="mt-auto flex gap-4 border-t border-gray/10 pt-3 text-sm font-medium">
          <button class="text-primary hover:text-blue-900" @click="openEdit(role)">Edit</button>
          <button
            class="text-red-600 hover:text-red-900 disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="role.userCount > 0"
            :title="role.userCount > 0 ? 'Masih dipakai pengguna' : ''"
            @click="deleteRole(role)"
          >
            Hapus
          </button>
        </div>
      </article>
    </div>

    <UiModal v-model="modalOpen" :title="editing ? `Edit Role — ${editing.name}` : 'Tambah Role'">
      <form class="space-y-5" @submit.prevent="submitForm">
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label for="role-name" class="admin-label">Nama Role</label>
            <input id="role-name" v-model="form.name" type="text" required maxlength="80" class="admin-input" placeholder="Misal: Editor Konten">
          </div>
          <div>
            <label for="role-key" class="admin-label">Kode Role</label>
            <input
              id="role-key"
              v-model="form.key"
              type="text"
              maxlength="40"
              :disabled="!!editing"
              class="admin-input disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="Otomatis dari nama"
            >
            <p class="mt-1 text-xs text-gray">{{ editing ? 'Kode tidak dapat diubah.' : 'Huruf kecil, angka, - atau _.' }}</p>
          </div>
        </div>
        <div>
          <label for="role-description" class="admin-label">Deskripsi</label>
          <textarea id="role-description" v-model="form.description" rows="2" maxlength="300" class="admin-input resize-y" placeholder="Untuk siapa role ini dan apa yang boleh dilakukan" />
        </div>

        <fieldset>
          <legend class="admin-label">Izin Akses ({{ form.permissions.length }} dipilih)</legend>
          <div class="mt-2 max-h-[45vh] space-y-3 overflow-y-auto pr-1">
            <div v-for="group in groups" :key="group.group" class="rounded-xl border border-gray/15 p-3">
              <label class="flex cursor-pointer items-center gap-2 text-sm font-extrabold text-black dark:text-white">
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  :checked="isGroupChecked(group)"
                  @change="toggleGroup(group, ($event.target as HTMLInputElement).checked)"
                >
                {{ group.group }}
              </label>
              <div class="mt-2 grid gap-2 pl-6 sm:grid-cols-2">
                <label v-for="item in group.items" :key="item.key" class="flex cursor-pointer items-start gap-2 text-sm text-gray-800 dark:text-gray-200">
                  <input
                    type="checkbox"
                    class="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    :checked="form.permissions.includes(item.key)"
                    @change="togglePermission(item.key, ($event.target as HTMLInputElement).checked)"
                  >
                  <span>
                    {{ item.label }}
                    <span v-if="item.description" class="block text-xs text-gray">{{ item.description }}</span>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </fieldset>

        <p v-if="formError" role="alert" class="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:bg-red-500/10 dark:text-red-300">
          {{ formError }}
        </p>

        <div class="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <button type="button" class="admin-btn-ghost justify-center" @click="modalOpen = false">Batal</button>
          <button type="submit" :disabled="saving" class="admin-btn-primary justify-center">
            {{ saving ? 'Menyimpan...' : 'Simpan Role' }}
          </button>
        </div>
      </form>
    </UiModal>
  </div>
</template>
