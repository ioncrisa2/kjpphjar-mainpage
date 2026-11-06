<template>
  <div class="flex min-h-screen flex-col bg-white font-mulish dark:bg-black">
    <LayoutAppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutAppFooter />
    <!-- WhatsApp floating button -->
    <UiWhatsAppButton />
  </div>
</template>
