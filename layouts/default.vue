<template>
  <div class="flex min-h-screen flex-col font-mulish">
    <LayoutAppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutAppFooter />
    <!-- WhatsApp floating button -->
    <UiWhatsAppButton />
  </div>
</template>
