<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// Initialize theme from cookie — SSR-safe, no hydration mismatch
const { initTheme } = useTheme()
initTheme()
</script>

<style>
/* Font import for premium typography */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
</style>
