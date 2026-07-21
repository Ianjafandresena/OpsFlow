<template>
  <div class="nb-wrap" ref="wrapRef">
    <button class="nb-btn" @click.stop="isOpen = !isOpen" title="Notifications">
      <BellIcon :size="16" />
      <span v-if="count > 0" class="nb-count">{{ count > 9 ? '9+' : count }}</span>
    </button>

    <div v-if="isOpen" class="nb-panel">
      <div class="nb-head">
        <span>Notifications</span>
        <button v-if="notifications.length" @click="markAll" class="nb-mark-all">Tout marquer lu</button>
      </div>
      <div class="nb-body">
        <p v-if="!notifications.length" class="nb-empty">Aucune notification</p>
        <div v-for="n in notifications" :key="n.id" class="nb-row" @click="go(n)">
          <div class="nb-dot" :class="`nb-type-${n.type}`"></div>
          <div class="nb-info">
            <div class="nb-msg">{{ n.message }}</div>
            <div class="nb-time">{{ timeAgo(n.createdAt) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Bell as BellIcon } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const { user } = useAuth()
const router = useRouter()

const notifications = ref([])
const isOpen = ref(false)
const wrapRef = ref(null)

const count = computed(() => notifications.value.length)

const load = async () => {
  if (!user.value?.id) return
  try {
    const res = await $fetch('/api/notifications', { query: { employeId: user.value.id } })
    notifications.value = res || []
  } catch {}
}

const markAll = async () => {
  if (!user.value?.id) return
  notifications.value = []
  isOpen.value = false
  try {
    await $fetch('/api/notifications/marquer-lu', { method: 'POST', body: { employeId: user.value.id } })
  } catch {}
}

const go = async (n) => {
  const isAdminUser = user.value?.role?.niveau_acces === 'ADMIN'
  try {
    await $fetch('/api/notifications/marquer-lu', { method: 'POST', body: { employeId: user.value?.id, type: n.type } })
    notifications.value = notifications.value.filter(x => x.type !== n.type)
  } catch {}
  isOpen.value = false

  if (n.type === 'A_VERIFIER') return router.push('/admin/taches/a-verifier')
  if (n.type === 'NOUVELLE_TACHE' || n.type === 'A_MODIFIER') return router.push(isAdminUser ? '/admin' : '/employe/taches')
  if (n.type === 'COMMENTAIRE') return router.push(isAdminUser ? '/admin/journal' : '/employe/journal')
  if (n.type === 'REGLEMENT') return router.push(isAdminUser ? '/admin' : '/employe/reglement')
}

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return "À l'instant"
  if (m < 60) return `il y a ${m} min`
  const h = Math.floor(m / 60)
  if (h < 24) return `il y a ${h}h`
  return `il y a ${Math.floor(h / 24)}j`
}

const handleOutside = (e) => {
  if (wrapRef.value && !wrapRef.value.contains(e.target)) isOpen.value = false
}

let interval = null
onMounted(() => {
  load()
  interval = setInterval(load, 30000)
  document.addEventListener('click', handleOutside)
})
onUnmounted(() => {
  clearInterval(interval)
  document.removeEventListener('click', handleOutside)
})
</script>

<style scoped>
.nb-wrap { position: relative; }

.nb-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 7px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 0.12s;
  flex-shrink: 0;
}
.nb-btn:hover { background: var(--bg-surface-hover); color: var(--text-primary); }

.nb-count {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #dc2626;
  color: white;
  font-size: 0.55rem;
  font-weight: 700;
  min-width: 14px;
  height: 14px;
  border-radius: 99px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  line-height: 1;
}

.nb-panel {
  position: absolute;
  left: 0;
  top: calc(100% + 8px);
  width: 280px;
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  z-index: 9999;
  overflow: hidden;
}

.nb-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem 0.75rem;
  border-bottom: 1px solid var(--border-light);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.nb-mark-all {
  font-size: 0.7rem;
  color: var(--accent-primary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-weight: 500;
}
.nb-mark-all:hover { text-decoration: underline; }

.nb-body { max-height: 300px; overflow-y: auto; }

.nb-empty { padding: 1.25rem 0.75rem; font-size: 0.8rem; color: var(--text-muted); text-align: center; margin: 0; }

.nb-row {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.625rem 0.75rem;
  cursor: pointer;
  transition: background 0.1s;
  border-bottom: 1px solid var(--border-light);
}
.nb-row:last-child { border-bottom: none; }
.nb-row:hover { background: var(--bg-surface-hover); }

.nb-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
  background: var(--accent-primary);
}
.nb-type-NOUVELLE_TACHE { background: #3b82f6; }
.nb-type-A_MODIFIER { background: #dc2626; }
.nb-type-A_VERIFIER { background: #f59e0b; }
.nb-type-COMMENTAIRE { background: #10b981; }
.nb-type-REGLEMENT { background: #8b5cf6; }

.nb-info { flex: 1; min-width: 0; }
.nb-msg { font-size: 0.8rem; color: var(--text-primary); line-height: 1.35; }
.nb-time { font-size: 0.7rem; color: var(--text-muted); margin-top: 0.2rem; }
</style>
