<template>
  <div class="animate-fade-in">
    <!-- Header -->
    <div class="page-header" style="margin-bottom:1.5rem;">
      <div>
        <h1 class="page-title" style="display:flex; align-items:center; gap:0.625rem;">
          <span class="reg-badge"><ScrollTextIcon :size="16" /></span>
          Règlements
        </h1>
        <p class="page-subtitle" style="margin-bottom:0;">Règlements internes qui vous sont applicables</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="spinner-sm"></div><span>Chargement...</span>
    </div>

    <!-- Empty state -->
    <div v-else-if="reglements.length === 0" class="empty-state">
      <ScrollTextIcon :size="40" style="color:var(--text-muted); margin-bottom:0.75rem;" />
      <p style="font-size:1rem; font-weight:600;">Aucun règlement disponible</p>
      <p style="color:var(--text-secondary); font-size:0.875rem;">Aucun règlement ne vous a encore été assigné.</p>
    </div>

    <!-- Règlements List -->
    <div v-else class="reg-list">
      <div v-for="r in reglements" :key="r.id" class="reg-card">
        <div class="reg-card-header">
          <div class="reg-icon"><ScrollTextIcon :size="18" /></div>
          <div style="flex:1;">
            <div class="reg-card-title">{{ r.titre }}</div>
            <div class="reg-card-date">Publié le {{ new Date(r.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) }}</div>
          </div>
        </div>
        <div class="reg-card-body">
          <div v-if="expanded[r.id]" class="reg-content-full">{{ r.contenu }}</div>
          <div v-else class="reg-content-preview">{{ r.contenu }}</div>
          <button class="expand-btn" @click="expanded[r.id] = !expanded[r.id]">
            {{ expanded[r.id] ? 'Voir moins' : 'Lire la suite' }}
            <ChevronDownIcon v-if="!expanded[r.id]" :size="13" />
            <ChevronUpIcon v-else :size="13" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  ScrollText as ScrollTextIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon
} from 'lucide-vue-next'

definePageMeta({ layout: 'employe' })

const { user } = useAuth()
const reglements = ref([])
const loading = ref(true)
const expanded = ref({})

onMounted(async () => {
  if (!user.value?.id) return
  try {
    reglements.value = await $fetch('/api/reglements/mes', { query: { employeId: user.value.id } })
    // Initialize expanded state
    for (const r of reglements.value) expanded.value[r.id] = false

    // Mark REGLEMENT notifications as read
    try {
      await $fetch('/api/notifications/marquer-lu', {
        method: 'POST',
        body: { employeId: user.value.id, type: 'REGLEMENT' }
      })
    } catch {}
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.reg-badge { width:32px; height:32px; border-radius:8px; background:linear-gradient(135deg,var(--accent-primary),#7c3aed); color:white; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

.loading-state { display:flex; align-items:center; justify-content:center; gap:0.75rem; padding:4rem 2rem; color:var(--text-muted); font-size:0.875rem; }
.spinner-sm { width:20px; height:20px; border-radius:50%; border:2px solid var(--border-light); border-top-color:var(--accent-primary); animation:spin 0.8s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
.empty-state { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:5rem 2rem; text-align:center; gap:0.25rem; }

.reg-list { display:flex; flex-direction:column; gap:1rem; max-width:780px; }

.reg-card { background:var(--bg-surface); border:1px solid var(--border-light); border-radius:14px; overflow:hidden; transition:box-shadow 0.15s; }
.reg-card:hover { box-shadow:0 4px 20px rgba(0,0,0,0.08); }

.reg-card-header { display:flex; align-items:flex-start; gap:0.875rem; padding:1.25rem 1.5rem; border-bottom:1px solid var(--border-light); background:var(--bg-surface-hover); }
.reg-icon { width:36px; height:36px; border-radius:8px; background:var(--accent-primary)15; color:var(--accent-primary); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.reg-card-title { font-size:1rem; font-weight:700; color:var(--text-primary); margin-bottom:0.2rem; }
.reg-card-date { font-size:0.75rem; color:var(--text-muted); }

.reg-card-body { padding:1.25rem 1.5rem; display:flex; flex-direction:column; gap:0.75rem; }
.reg-content-preview { font-size:0.875rem; color:var(--text-secondary); line-height:1.7; display:-webkit-box; -webkit-line-clamp:4; -webkit-box-orient:vertical; overflow:hidden; white-space:pre-line; }
.reg-content-full { font-size:0.875rem; color:var(--text-secondary); line-height:1.7; white-space:pre-line; }

.expand-btn { display:inline-flex; align-items:center; gap:0.35rem; background:none; border:none; color:var(--accent-primary); font-size:0.8125rem; font-weight:600; cursor:pointer; padding:0; transition:opacity 0.15s; }
.expand-btn:hover { opacity:0.75; }
</style>
