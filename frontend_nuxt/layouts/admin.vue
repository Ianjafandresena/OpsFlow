<template>
  <div class="layout-app">
    <!-- Mobile Header -->
    <div class="mobile-header">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div style="width: 26px; height: 26px; background: var(--accent-primary); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.7rem;">OF</div>
        <span style="font-size: 1rem; font-weight: 700; letter-spacing: -0.02em;">OpsFlow</span>
      </div>
      <button class="btn btn-secondary btn-icon" @click="sidebarOpen = true">
        <MenuIcon :size="20" />
      </button>
    </div>

    <!-- Backdrop for mobile -->
    <div v-if="sidebarOpen" class="sidebar-backdrop" @click="sidebarOpen = false"></div>

    <Sidebar role="admin" :class="{ 'sidebar-open': sidebarOpen }" @close="sidebarOpen = false" />
    
    <main class="layout-main">
      <NuxtPage />
      <footer class="app-footer">
        <span>© 2026 <strong>Ianja</strong> &mdash; OpsFlow v1.2</span>
        <span style="color:var(--border-light);">|</span>
        <span>Licence Propriétaire &mdash; Usage interne exclusif</span>
        <span style="color:var(--border-light);">|</span>
        <span>Tous droits réservés</span>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Menu as MenuIcon } from 'lucide-vue-next'

const sidebarOpen = ref(false)
const route = useRoute()

// Close sidebar on route change on mobile
watch(() => route.path, () => {
  sidebarOpen.value = false
})
</script>
