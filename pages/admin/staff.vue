<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth', permission: 'staff.view' })
useHead({ title: "Admin Staff | KJPP HJA'R" })

const { can } = useAdminAuth()
const toast = useToast()
const viewMode = useAdminViewMode('staff', 'table')

interface BranchItem {
  _id: string
  name: string
  city: string
  isActive?: boolean
  order?: number
}

interface StaffItem {
  _id: string
  name: string
  position: string
  branchId: any
  mappiNumber?: string
  order?: number
  isActive?: boolean
  createdAt?: string
}

interface BranchGroup {
  id: string
  name: string
  city: string
  isActive: boolean
  isOrphan?: boolean
  staff: StaffItem[]
  activeCount: number
  totalCount: number
  hasMatches: boolean
}

const { data: staffList, refresh, pending } = await useFetch<StaffItem[]>('/api/staff', { query: { admin: 'true' } })
const { data: branches } = await useFetch<BranchItem[]>('/api/branches')

const modalOpen = ref(false)
const saving = ref(false)
const isEditing = ref(false)
const editId = ref('')
// Kantor staff yang sedang diedit, agar tetap bisa dipilih walau kantornya sudah nonaktif
const editingBranch = ref<any | null>(null)

const form = reactive({
  name: '',
  position: '',
  branchId: '',
  mappiNumber: '',
  order: 0,
  isActive: true
})

const search = ref('')
const branchFilter = ref('')
const expandedBranches = ref<Set<string>>(new Set())

const isSearching = computed(() => Boolean(search.value.trim()))

const branchOptions = computed(() => {
  const list = [...(branches.value || [])]
  if (editingBranch.value && !list.some((branch) => branch._id === editingBranch.value._id)) {
    list.push(editingBranch.value)
  }
  return list
})

const groupedBranches = computed<BranchGroup[]>(() => {
  const staff = staffList.value || []
  const branchData = branches.value || []
  const keyword = search.value.trim().toLowerCase()

  // Map data kantor yang terdaftar
  const groups: BranchGroup[] = branchData.map((branch) => {
    const branchStaff = staff.filter((s) => {
      const bId = s.branchId?._id || s.branchId
      return String(bId) === String(branch._id)
    })

    // Urutkan berdasarkan order ASC, lalu createdAt ASC
    branchStaff.sort((a, b) => {
      const orderA = a.order ?? 0
      const orderB = b.order ?? 0
      if (orderA !== orderB) return orderA - orderB
      return String(a.createdAt || '').localeCompare(String(b.createdAt || ''))
    })

    const activeCount = branchStaff.filter((s) => s.isActive !== false).length
    const totalCount = branchStaff.length

    // Jika sedang mencari, filter staff di dalam cabang
    const matchingStaff = keyword
      ? branchStaff.filter((s) =>
          [s.name, s.position, s.mappiNumber]
            .some((val) => String(val || '').toLowerCase().includes(keyword))
        )
      : branchStaff

    return {
      id: String(branch._id),
      name: branch.name,
      city: branch.city,
      isActive: branch.isActive !== false,
      staff: keyword ? matchingStaff : branchStaff,
      activeCount,
      totalCount,
      hasMatches: keyword ? matchingStaff.length > 0 : true
    }
  })

  // Periksa apakah ada staff dengan kantor yang terhapus atau belum ditentukan
  const knownBranchIds = new Set(branchData.map((b) => String(b._id)))
  const orphanStaff = staff.filter((s) => {
    const bId = s.branchId?._id || s.branchId
    return !bId || !knownBranchIds.has(String(bId))
  })

  if (orphanStaff.length > 0) {
    orphanStaff.sort((a, b) => {
      const orderA = a.order ?? 0
      const orderB = b.order ?? 0
      if (orderA !== orderB) return orderA - orderB
      return String(a.createdAt || '').localeCompare(String(b.createdAt || ''))
    })

    const matchingOrphan = keyword
      ? orphanStaff.filter((s) =>
          [s.name, s.position, s.mappiNumber]
            .some((val) => String(val || '').toLowerCase().includes(keyword))
        )
      : orphanStaff

    groups.push({
      id: 'unassigned',
      name: 'Kantor Terhapus / Tanpa Kantor',
      city: '-',
      isActive: false,
      isOrphan: true,
      staff: keyword ? matchingOrphan : orphanStaff,
      activeCount: orphanStaff.filter((s) => s.isActive !== false).length,
      totalCount: orphanStaff.length,
      hasMatches: keyword ? matchingOrphan.length > 0 : true
    })
  }

  // Filter dropdown cabang
  let filtered = groups
  if (branchFilter.value) {
    filtered = filtered.filter((g) => g.id === branchFilter.value)
  }

  // Jika sedang mencari, hanya tampilkan grup yang memiliki hasil cocok atau nama kantor cocok
  if (keyword) {
    filtered = filtered.filter((g) => g.hasMatches || g.name.toLowerCase().includes(keyword))
  }

  return filtered
})

const totalStaffCount = computed(() => (staffList.value || []).length)
const totalBranchesCount = computed(() => groupedBranches.value.length)

// Otomatis buka grup cabang yang cocok saat admin melakukan pencarian
watch(search, (newVal) => {
  if (newVal.trim()) {
    const matchingIds = groupedBranches.value
      .filter((g) => g.staff.length > 0)
      .map((g) => g.id)
    expandedBranches.value = new Set(matchingIds)
  }
})

function isExpanded(branchId: string) {
  return expandedBranches.value.has(branchId)
}

function toggleBranch(branchId: string) {
  const next = new Set(expandedBranches.value)
  if (next.has(branchId)) {
    next.delete(branchId)
  } else {
    next.add(branchId)
  }
  expandedBranches.value = next
}

function expandAll() {
  expandedBranches.value = new Set(groupedBranches.value.map((g) => g.id))
}

function collapseAll() {
  expandedBranches.value = new Set()
}

// Drag and drop state
const dragContext = reactive<{
  branchId: string | null
  fromIndex: number | null
  overIndex: number | null
  isSaving: boolean
}>({
  branchId: null,
  fromIndex: null,
  overIndex: null,
  isSaving: false
})

function canReorder(branchId: string) {
  return can('staff.update') && !isSearching.value && !dragContext.isSaving
}

function onStaffDragStart(branchId: string, index: number, event: DragEvent) {
  if (!canReorder(branchId)) return
  dragContext.branchId = branchId
  dragContext.fromIndex = index
  dragContext.overIndex = null
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', `${branchId}:${index}`)
  }
}

function onStaffDragOver(branchId: string, index: number, event: DragEvent) {
  if (dragContext.branchId !== branchId || dragContext.fromIndex === null) return
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
  dragContext.overIndex = index
}

function onStaffDragLeave(branchId: string, index: number, event: DragEvent) {
  if (dragContext.branchId === branchId && dragContext.overIndex === index) {
    dragContext.overIndex = null
  }
}

async function onStaffDrop(branchId: string, dropIndex: number, event: DragEvent) {
  event.preventDefault()
  const fromIndex = dragContext.fromIndex
  const srcBranchId = dragContext.branchId

  dragContext.overIndex = null
  dragContext.fromIndex = null
  dragContext.branchId = null

  if (srcBranchId !== branchId || fromIndex === null || fromIndex === dropIndex) {
    return
  }

  const group = groupedBranches.value.find((g) => g.id === branchId)
  if (!group || !group.staff.length) return

  // Reorder lokal
  const updatedStaff = [...group.staff]
  const [draggedItem] = updatedStaff.splice(fromIndex, 1)
  updatedStaff.splice(dropIndex, 0, draggedItem)

  // Update properti order secara berurutan
  updatedStaff.forEach((item, idx) => {
    item.order = idx
  })

  // Optimistic update pada staffList
  if (staffList.value) {
    const others = staffList.value.filter((s) => {
      const bId = s.branchId?._id || s.branchId
      return String(bId) !== String(branchId)
    })
    staffList.value = [...others, ...updatedStaff]
  }

  // Kirim ke backend
  dragContext.isSaving = true
  try {
    const staffIds = updatedStaff.map((s) => s._id)
    await $fetch('/api/staff/reorder', {
      method: 'PUT',
      body: { staffIds }
    })
    toast.success('Urutan staff berhasil diperbarui.')
  } catch (err: any) {
    toast.error(err.data?.statusMessage || 'Gagal menyimpan urutan staff.')
    await refresh()
  } finally {
    dragContext.isSaving = false
  }
}

function resetForm() {
  isEditing.value = false
  editId.value = ''
  editingBranch.value = null
  form.name = ''
  form.position = ''
  form.branchId = ''
  form.mappiNumber = ''
  form.order = 0
  form.isActive = true
}

function openAdd() {
  resetForm()
  modalOpen.value = true
}

function openAddForBranch(branchId: string) {
  resetForm()
  if (branchId !== 'unassigned') {
    form.branchId = branchId
    const group = groupedBranches.value.find((g) => g.id === branchId)
    form.order = group?.staff?.length ?? 0
  }
  modalOpen.value = true
}

function openEdit(item: any) {
  isEditing.value = true
  editId.value = item._id
  editingBranch.value = item.branchId || null
  form.name = item.name
  form.position = item.position
  form.branchId = item.branchId?._id || item.branchId || ''
  form.mappiNumber = item.mappiNumber || ''
  form.order = item.order || 0
  form.isActive = item.isActive !== false
  modalOpen.value = true
}

async function submitForm() {
  saving.value = true
  try {
    const url = isEditing.value ? `/api/staff/${editId.value}` : '/api/staff'
    const method = isEditing.value ? 'PUT' : 'POST'

    await $fetch(url, {
      method,
      body: form
    })

    modalOpen.value = false
    toast.success(isEditing.value ? 'Data staff diperbarui.' : 'Staff berhasil ditambahkan.')
    await refresh()
  } catch (err: any) {
    toast.error(err.data?.statusMessage || 'Gagal menyimpan data.')
  } finally {
    saving.value = false
  }
}

const { ask } = useConfirm()

function staffActions(staff: any) {
  const actions: Array<{ label: string; icon?: string; variant?: 'default' | 'danger'; onClick?: () => void }> = []
  if (can('staff.update')) {
    actions.push({ label: 'Edit Staff', icon: 'ph:pencil-simple-bold', onClick: () => openEdit(staff) })
  }
  if (can('staff.delete')) {
    actions.push({ label: 'Hapus', icon: 'ph:trash-bold', variant: 'danger', onClick: () => deleteItem(staff) })
  }
  return actions
}

async function deleteItem(staff: any) {
  const confirmed = await ask({
    title: 'Hapus Staff',
    message: 'Apakah Anda yakin ingin menghapus data staff ini?',
    itemName: staff.name ? `${staff.name} — ${staff.position}` : undefined,
    confirmText: 'Ya, Hapus',
  })
  if (!confirmed) return
  try {
    await $fetch(`/api/staff/${staff._id}`, { method: 'DELETE' })
    toast.success('Data staff berhasil dihapus.')
    await refresh()
  } catch (err) {
    toast.error('Gagal menghapus data.')
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Staff &amp; Penilai</h1>
        <p class="mt-1 text-sm text-gray">
          Daftar staff dikelompokkan per kantor cabang. Urutkan posisi staff dengan seret (drag &amp; drop) untuk mengatur urutan tampilan di website.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <div class="inline-flex items-center rounded-lg border border-gray/20 bg-white p-1 text-xs font-semibold dark:border-white/10 dark:bg-gray-dark">
          <button
            type="button"
            @click="expandAll"
            class="rounded px-2.5 py-1 text-gray-700 transition hover:bg-gray/10 dark:text-gray-200"
            title="Buka semua detail cabang"
          >
            Buka Semua
          </button>
          <span class="text-gray/30">|</span>
          <button
            type="button"
            @click="collapseAll"
            class="rounded px-2.5 py-1 text-gray-700 transition hover:bg-gray/10 dark:text-gray-200"
            title="Tutup semua detail cabang"
          >
            Tutup Semua
          </button>
        </div>
        <AdminViewSwitcher v-model="viewMode" />
        <button v-if="can('staff.create')" @click="openAdd" class="admin-btn-primary">
          + Tambah Staff
        </button>
      </div>
    </div>

    <!-- Filter -->
    <section class="admin-card" aria-label="Filter staff">
      <div class="grid gap-3 md:grid-cols-[minmax(240px,1fr)_240px]">
        <label class="relative">
          <span class="sr-only">Cari staff</span>
          <Icon name="ph:magnifying-glass-bold" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray" />
          <input v-model="search" type="search" class="admin-input !pl-11" placeholder="Cari nama, jabatan, atau nomor MAPPI...">
        </label>
        <label>
          <span class="sr-only">Filter kantor</span>
          <select v-model="branchFilter" class="admin-input">
            <option value="">Semua kantor ({{ branches?.length || 0 }})</option>
            <option v-for="branch in branches" :key="branch._id" :value="branch._id">{{ branch.name }}</option>
          </select>
        </label>
      </div>
      <div class="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray/10 pt-3 text-xs text-gray">
        <span>Menampilkan {{ totalBranchesCount }} kantor · Total {{ totalStaffCount }} staff terdaftar</span>
        <span v-if="isSearching" class="text-primary font-medium">Pencarian aktif: menampilkan staf yang cocok</span>
      </div>
    </section>

    <!-- Loading & Empty States -->
    <div v-if="pending" class="admin-card p-8 text-center text-gray-500">
      <Icon name="ph:spinner-gap-bold" class="mx-auto h-8 w-8 animate-spin text-primary" />
      <p class="mt-2 text-sm">Memuat data staff dan kantor...</p>
    </div>
    <div v-else-if="!groupedBranches.length" class="admin-card p-8 text-center text-gray-500">
      <Icon name="ph:users-three-bold" class="mx-auto h-10 w-10 text-gray-400" />
      <p class="mt-2 font-semibold text-black dark:text-white">Tidak ada data kantor atau staff</p>
      <p class="mt-1 text-xs text-gray">Periksa filter pencarian Anda atau tambahkan kantor di menu Cabang.</p>
    </div>

    <!-- TABLE VIEW (Master-Detail Collapsible) -->
    <div v-else-if="viewMode === 'table'" class="admin-card !p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray/10">
          <thead class="bg-gray/5">
            <tr>
              <th class="w-12 px-4 py-3 text-center text-xs font-bold text-gray uppercase tracking-wider"></th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Kantor / Cabang</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Kota</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Status Kantor</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Jumlah Staff</th>
              <th class="px-6 py-3 text-right text-xs font-bold text-gray uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray/10 bg-white dark:bg-gray-dark">
            <template v-for="group in groupedBranches" :key="group.id">
              <!-- Main Branch Row (Master) -->
              <tr
                @click="toggleBranch(group.id)"
                class="group cursor-pointer transition-colors duration-150 hover:bg-stone-50/80 dark:hover:bg-white/[0.04]"
                :class="isExpanded(group.id) ? 'bg-primary/5 dark:bg-white/[0.03]' : ''"
              >
                <td class="px-4 py-4 text-center">
                  <button
                    type="button"
                    class="inline-flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 transition-transform duration-200 hover:bg-gray/10"
                    :class="isExpanded(group.id) ? 'rotate-90 text-primary' : ''"
                    :aria-expanded="isExpanded(group.id)"
                    :aria-label="isExpanded(group.id) ? `Tutup detail staff ${group.name}` : `Buka detail staff ${group.name}`"
                    @click.stop="toggleBranch(group.id)"
                  >
                    <Icon name="ph:caret-right-bold" class="h-4 w-4" />
                  </button>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                      <Icon name="ph:buildings-bold" class="h-5 w-5" />
                    </div>
                    <div>
                      <div class="font-bold text-black dark:text-white group-hover:text-primary transition-colors">
                        {{ group.name }}
                      </div>
                      <div v-if="group.isOrphan" class="text-xs text-red-500 font-medium">Kantor penempatan telah dihapus</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {{ group.city }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="group.isActive" class="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-500/20 dark:text-green-300">Aktif</span>
                  <span v-else class="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-500/20 dark:text-red-300">Nonaktif</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <span class="inline-flex items-center rounded-md bg-stone-100 px-2.5 py-1 text-xs font-bold tabular-nums text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                      {{ group.totalCount }} Staff
                    </span>
                    <span v-if="group.activeCount !== group.totalCount" class="text-xs text-gray">
                      ({{ group.activeCount }} aktif)
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" @click.stop>
                  <div class="flex items-center justify-end gap-2">
                    <!-- Detail Action Button -->
                    <button
                      type="button"
                      @click="toggleBranch(group.id)"
                      class="inline-flex items-center gap-1.5 rounded-lg border border-gray/20 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray/10 hover:text-black dark:border-white/10 dark:bg-gray-dark dark:text-gray-200 dark:hover:bg-white/10"
                    >
                      <Icon name="ph:users-three-bold" class="h-4 w-4 text-primary" />
                      <span>Detail Staff</span>
                      <Icon
                        name="ph:caret-down-bold"
                        class="h-3 w-3 transition-transform duration-200"
                        :class="isExpanded(group.id) ? 'rotate-180' : ''"
                      />
                    </button>
                    <!-- Quick Add Button per Branch -->
                    <button
                      v-if="can('staff.create') && !group.isOrphan"
                      type="button"
                      @click="openAddForBranch(group.id)"
                      class="admin-btn-primary !px-2.5 !py-1.5 !text-xs"
                      title="Tambah staff di kantor ini"
                    >
                      <Icon name="ph:plus-bold" class="h-3.5 w-3.5" />
                      <span class="hidden sm:inline">Tambah</span>
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Collapsible Sub-Table Row (Detail) -->
              <tr v-if="isExpanded(group.id)" class="bg-stone-50/70 dark:bg-stone-900/40">
                <td colspan="6" class="p-0 border-b border-gray/10">
                  <div class="p-4 sm:p-6 space-y-4">
                    <!-- Sub-table toolbar -->
                    <div class="flex flex-wrap items-center justify-between gap-3">
                      <div class="flex flex-wrap items-center gap-2">
                        <span class="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                          Daftar Staff {{ group.name }}:
                        </span>
                        <span v-if="canReorder(group.id) && group.staff.length > 1" class="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                          <Icon name="ph:arrows-down-up-bold" class="h-3.5 w-3.5" />
                          Seret ikon baris (drag &amp; drop) untuk mengatur posisi nama di website
                        </span>
                        <span v-else-if="isSearching" class="text-[11px] text-gray italic">
                          (Drag &amp; drop dinonaktifkan saat pencarian aktif)
                        </span>
                      </div>
                      <button
                        v-if="can('staff.create') && !group.isOrphan"
                        type="button"
                        @click="openAddForBranch(group.id)"
                        class="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary hover:bg-primary/20 transition"
                      >
                        <Icon name="ph:plus-bold" class="h-3.5 w-3.5" />
                        <span>Tambah Staff di {{ group.city }}</span>
                      </button>
                    </div>

                    <!-- Empty state jika belum ada staff di kantor ini -->
                    <div v-if="!group.staff.length" class="rounded-xl border border-dashed border-gray/25 p-8 text-center bg-white/60 dark:bg-gray-dark/60">
                      <Icon name="ph:user-plus-bold" class="mx-auto h-8 w-8 text-gray-400" />
                      <p class="mt-2 text-sm font-semibold text-black dark:text-white">Belum ada staff di kantor ini</p>
                      <p class="mt-1 text-xs text-gray">Tambahkan data staff untuk ditampilkan pada profil cabang {{ group.name }}.</p>
                      <button
                        v-if="can('staff.create') && !group.isOrphan"
                        type="button"
                        @click="openAddForBranch(group.id)"
                        class="admin-btn-primary mt-3 !py-1.5 !text-xs"
                      >
                        + Tambah Staff Sekarang
                      </button>
                    </div>

                    <!-- Staff Detail Table with Drag and Drop -->
                    <div v-else class="overflow-hidden rounded-xl border border-gray/15 bg-white shadow-sm dark:border-white/10 dark:bg-gray-dark">
                      <table class="min-w-full divide-y divide-gray/10">
                        <thead class="bg-gray/5">
                          <tr>
                            <th v-if="can('staff.update')" class="w-10 px-3 py-2.5 text-center text-xs font-bold text-gray uppercase tracking-wider"></th>
                            <th class="w-12 px-3 py-2.5 text-center text-xs font-bold text-gray uppercase tracking-wider">#</th>
                            <th class="px-4 py-2.5 text-left text-xs font-bold text-gray uppercase tracking-wider">Nama Staff</th>
                            <th class="px-4 py-2.5 text-left text-xs font-bold text-gray uppercase tracking-wider">Jabatan</th>
                            <th class="px-4 py-2.5 text-left text-xs font-bold text-gray uppercase tracking-wider">No. MAPPI</th>
                            <th class="px-4 py-2.5 text-center text-xs font-bold text-gray uppercase tracking-wider">Urutan</th>
                            <th class="px-4 py-2.5 text-center text-xs font-bold text-gray uppercase tracking-wider">Status</th>
                            <th class="px-4 py-2.5 text-right text-xs font-bold text-gray uppercase tracking-wider">Aksi</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-gray/10">
                          <tr
                            v-for="(staff, sIndex) in group.staff"
                            :key="staff._id"
                            :draggable="canReorder(group.id)"
                            @dragstart="onStaffDragStart(group.id, sIndex, $event)"
                            @dragover="onStaffDragOver(group.id, sIndex, $event)"
                            @dragleave="onStaffDragLeave(group.id, sIndex, $event)"
                            @drop="onStaffDrop(group.id, sIndex, $event)"
                            class="transition-colors duration-150"
                            :class="[
                              canReorder(group.id) ? 'cursor-move' : '',
                              dragContext.branchId === group.id && dragContext.fromIndex === sIndex ? 'opacity-40 bg-primary/10' : 'hover:bg-gray/5',
                              dragContext.branchId === group.id && dragContext.overIndex === sIndex && dragContext.fromIndex !== sIndex ? 'border-t-2 border-t-primary bg-primary/5' : ''
                            ]"
                          >
                            <td v-if="can('staff.update')" class="px-3 py-3 text-center">
                              <Icon
                                name="ph:dots-six-vertical-bold"
                                class="h-5 w-5 text-gray-400 transition hover:text-primary"
                                :class="canReorder(group.id) ? 'cursor-move' : 'opacity-40'"
                                title="Tahan dan geser untuk mengatur urutan"
                              />
                            </td>
                            <td class="px-3 py-3 text-center text-xs font-bold tabular-nums text-gray-500">
                              {{ sIndex + 1 }}
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm font-bold text-black dark:text-white">
                              {{ staff.name }}
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                              {{ staff.position }}
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray">
                              {{ staff.mappiNumber || '-' }}
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap text-center text-sm tabular-nums text-gray">
                              {{ staff.order ?? sIndex }}
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap text-center">
                              <span v-if="staff.isActive !== false" class="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-500/20 dark:text-green-300">Aktif</span>
                              <span v-else class="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-500/20 dark:text-red-300">Nonaktif</span>
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                              <UiActionMenu v-if="staffActions(staff).length" :items="staffActions(staff)" :label="`Aksi untuk ${staff.name}`" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- GRID VIEW (Grouped Cards) -->
    <div v-else class="space-y-4">
      <article
        v-for="group in groupedBranches"
        :key="group.id"
        class="admin-card overflow-hidden !p-0 transition-all"
      >
        <!-- Card Header -->
        <div
          @click="toggleBranch(group.id)"
          class="flex cursor-pointer flex-wrap items-center justify-between gap-4 p-5 hover:bg-stone-50/70 dark:hover:bg-white/[0.02]"
        >
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
              <Icon name="ph:buildings-bold" class="h-6 w-6" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-base font-extrabold text-black dark:text-white">{{ group.name }}</h2>
                <span v-if="group.isActive" class="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-800 dark:bg-green-500/20 dark:text-green-300">Aktif</span>
                <span v-else class="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-800 dark:bg-red-500/20 dark:text-red-300">Nonaktif</span>
              </div>
              <p class="text-xs text-gray">{{ group.city }} · {{ group.totalCount }} staff ({{ group.activeCount }} aktif)</p>
            </div>
          </div>
          <div class="flex items-center gap-2" @click.stop>
            <button
              type="button"
              @click="toggleBranch(group.id)"
              class="inline-flex items-center gap-1.5 rounded-lg border border-gray/20 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray/10 hover:text-black dark:border-white/10 dark:bg-gray-dark dark:text-gray-200 dark:hover:bg-white/10"
            >
              <Icon name="ph:users-three-bold" class="h-4 w-4 text-primary" />
              <span>Detail Staff ({{ group.totalCount }})</span>
              <Icon
                name="ph:caret-down-bold"
                class="h-3 w-3 transition-transform duration-200"
                :class="isExpanded(group.id) ? 'rotate-180' : ''"
              />
            </button>
            <button
              v-if="can('staff.create') && !group.isOrphan"
              type="button"
              @click="openAddForBranch(group.id)"
              class="admin-btn-primary !px-2.5 !py-1.5 !text-xs"
              title="Tambah staff di kantor ini"
            >
              <Icon name="ph:plus-bold" class="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <!-- Expanded Card Content -->
        <div v-if="isExpanded(group.id)" class="border-t border-gray/10 bg-stone-50/60 p-5 dark:bg-stone-900/30">
          <div v-if="!group.staff.length" class="p-6 text-center text-sm text-gray">
            Belum ada staff di kantor ini.
            <button
              v-if="can('staff.create') && !group.isOrphan"
              type="button"
              @click="openAddForBranch(group.id)"
              class="ml-2 font-bold text-primary hover:underline"
            >
              + Tambah Staff
            </button>
          </div>
          <div v-else class="space-y-3">
            <div class="flex items-center justify-between text-xs text-gray">
              <span>Daftar staff di {{ group.name }}</span>
              <span v-if="canReorder(group.id) && group.staff.length > 1" class="text-primary font-medium">
                Seret kartu untuk mengatur urutan
              </span>
            </div>
            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <article
                v-for="(staff, sIndex) in group.staff"
                :key="staff._id"
                :draggable="canReorder(group.id)"
                @dragstart="onStaffDragStart(group.id, sIndex, $event)"
                @dragover="onStaffDragOver(group.id, sIndex, $event)"
                @dragleave="onStaffDragLeave(group.id, sIndex, $event)"
                @drop="onStaffDrop(group.id, sIndex, $event)"
                class="admin-card flex flex-col gap-2 !p-4 transition-all"
                :class="[
                  canReorder(group.id) ? 'cursor-move' : '',
                  dragContext.branchId === group.id && dragContext.fromIndex === sIndex ? 'opacity-40 ring-2 ring-primary ring-offset-2' : '',
                  dragContext.branchId === group.id && dragContext.overIndex === sIndex && dragContext.fromIndex !== sIndex ? 'ring-2 ring-primary/60 bg-primary/5' : ''
                ]"
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-center gap-2 min-w-0">
                    <Icon v-if="canReorder(group.id)" name="ph:dots-six-vertical-bold" class="h-4 w-4 shrink-0 text-gray-400" />
                    <span class="rounded bg-gray/10 px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-gray">#{{ sIndex + 1 }}</span>
                    <h3 class="truncate text-sm font-extrabold text-black dark:text-white" :title="staff.name">{{ staff.name }}</h3>
                  </div>
                  <UiActionMenu v-if="staffActions(staff).length" :items="staffActions(staff)" :label="`Aksi untuk ${staff.name}`" />
                </div>
                <p class="truncate text-xs font-semibold text-gray pl-6" :title="staff.position">{{ staff.position }}</p>
                <div class="mt-auto flex items-center justify-between border-t border-gray/10 pt-2 text-xs">
                  <span v-if="staff.mappiNumber" class="text-gray">MAPPI: {{ staff.mappiNumber }}</span>
                  <span v-else class="text-gray/50">-</span>
                  <span v-if="staff.isActive !== false" class="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-800 dark:bg-green-500/20 dark:text-green-300">Aktif</span>
                  <span v-else class="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-800 dark:bg-red-500/20 dark:text-red-300">Nonaktif</span>
                </div>
              </article>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- Modal Form (Tambah / Edit Staff) -->
    <UiModal v-model="modalOpen" :title="isEditing ? 'Edit Staff' : 'Tambah Staff Baru'" size="md">
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label class="admin-label">Nama Staff</label>
          <input v-model="form.name" type="text" required maxlength="200" class="admin-input" placeholder="Nama lengkap staf">
        </div>
        <div>
          <label class="admin-label">Jabatan</label>
          <input v-model="form.position" type="text" required maxlength="200" class="admin-input" placeholder="Contoh: Operasional / Technical Director">
        </div>
        <div>
          <label class="admin-label">Kantor Penempatan (Pusat / Cabang)</label>
          <select v-model="form.branchId" required class="admin-input">
            <option value="" disabled>Pilih kantor</option>
            <option v-for="branch in branchOptions" :key="branch._id" :value="branch._id">
              {{ branch.name }}{{ branch.city ? ` (${branch.city})` : '' }}
            </option>
          </select>
          <p v-if="isEditing && !form.branchId" class="mt-1 text-xs text-red-600 dark:text-red-400">Kantor sebelumnya sudah dihapus. Pilih kantor yang baru.</p>
          <p v-else class="mt-1 text-xs text-gray">Daftar kantor diambil dari menu Cabang.</p>
        </div>
        <UiAdvancedOptions label="Opsi Lanjutan" hint="Nomor MAPPI, urutan tampil, dan status aktif">
          <div>
            <label class="admin-label">Nomor MAPPI <span class="font-normal text-gray">(opsional)</span></label>
            <input v-model="form.mappiNumber" type="text" maxlength="100" class="admin-input" placeholder="Contoh: 12-P-00123">
            <p class="mt-1 text-xs text-gray">Jika diisi, nomor MAPPI ikut tampil di website.</p>
          </div>
          <div>
            <label class="admin-label">Urutan Tampil Manual</label>
            <input v-model.number="form.order" type="number" min="0" max="9999" step="1" class="admin-input">
            <p class="mt-1 text-xs text-gray">Anda juga dapat mengubah urutan langsung dengan seret (drag &amp; drop) di tabel.</p>
          </div>
          <div class="flex items-center gap-2 pt-1">
            <input id="staff-active" v-model="form.isActive" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary">
            <label for="staff-active" class="text-sm font-semibold text-black dark:text-white">Aktif (ditampilkan di website)</label>
          </div>
        </UiAdvancedOptions>

        <div class="flex flex-col-reverse gap-2 border-t border-gray/10 pt-4 sm:flex-row sm:justify-end">
          <button type="button" @click="modalOpen = false" class="admin-btn-ghost justify-center">
            Batal
          </button>
          <button type="submit" :disabled="saving" class="admin-btn-primary justify-center">
            {{ saving ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </form>
    </UiModal>
  </div>
</template>
