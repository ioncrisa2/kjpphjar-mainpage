<script setup lang="ts">
definePageMeta({ layout: false })

useHead({ title: "Admin Login | KJPP HJA'R" })

const form = ref({ username: '', password: '' })
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!form.value.username || !form.value.password) {
    error.value = 'Username dan password wajib diisi.'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: form.value,
    })
    await navigateTo('/admin')
  } catch (err: unknown) {
    error.value = 'Username atau password salah.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-black font-mulish">
    <div class="w-full max-w-md px-6">
      <!-- Logo -->
      <div class="mb-8 text-center">
        <img src="/assets/images/h-logo.png" alt="KJPP HJA'R" width="224" height="56" class="mx-auto h-14 w-auto mb-4" />
        <h1 class="text-xl font-bold text-white">Admin Panel</h1>
        <p class="text-sm text-gray mt-1">KJPP Henricus Judi Adrianto dan Rekan</p>
      </div>

      <!-- Card -->
      <div class="rounded-2xl bg-gray-dark p-8 shadow-xl">
        <h2 class="text-lg font-extrabold text-white mb-6">Masuk ke Panel Admin</h2>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="admin-label" for="username">Username</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              autocomplete="username"
              placeholder="Masukkan username"
              class="admin-input"
              :disabled="loading"
            />
          </div>

          <div>
            <label class="admin-label" for="password">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              autocomplete="current-password"
              placeholder="Masukkan password"
              class="admin-input"
              :disabled="loading"
            />
          </div>

          <!-- Error message -->
          <div v-if="error" class="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-500">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-xl bg-primary py-3 font-bold text-black transition hover:bg-secondary hover:text-white disabled:opacity-50"
          >
            <span v-if="loading">Memverifikasi...</span>
            <span v-else>Masuk</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
