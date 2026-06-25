<template>
  <aside class="layout-sidebar">
    <!-- Logo -->
    <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0 0.5rem; margin-bottom: 1.5rem;">
      <div style="width: 26px; height: 26px; background: var(--accent-primary); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.7rem;">OF</div>
      <span style="font-size: 1rem; font-weight: 700; letter-spacing: -0.02em;">OpsFlow</span>
    </div>

    <nav style="display: flex; flex-direction: column; gap: 1.25rem; flex: 1; overflow-y: auto;">

      <!-- ADMIN NAV -->
      <template v-if="role === 'admin'">
        <!-- Overview -->
        <div>
          <div class="nav-section-title">Overview</div>
          <NuxtLink to="/admin" class="nav-link" exact-active-class="nav-link-active">
            <LayoutDashboardIcon :size="15" /> Dashboard
          </NuxtLink>
        </div>

        <!-- Tâches par Département -->
        <div>
          <div class="nav-section-title">Tâches par Département</div>
          <NuxtLink to="/admin/taches/cm" class="nav-link" active-class="nav-link-active">
            <MegaphoneIcon :size="15" /> Community Managers
          </NuxtLink>
          <NuxtLink to="/admin/taches/monteur" class="nav-link" active-class="nav-link-active">
            <FilmIcon :size="15" /> Monteurs Vidéo
          </NuxtLink>
          <NuxtLink to="/admin/taches/designer" class="nav-link" active-class="nav-link-active">
            <PaletteIcon :size="15" /> Designers
          </NuxtLink>
          <NuxtLink to="/admin/taches/dev" class="nav-link" active-class="nav-link-active">
            <CodeIcon :size="15" /> Développeurs Web
          </NuxtLink>
        </div>

        <!-- Analyse -->
        <div>
          <div class="nav-section-title">Analyse</div>
          <NuxtLink to="/admin/meta" class="nav-link" active-class="nav-link-active">
            <BarChart2Icon :size="15" /> Meta Ads
          </NuxtLink>
        </div>

        <!-- Suivi d'Activité -->
        <div>
          <div class="nav-section-title">Suivi d'Activité</div>
          <NuxtLink to="/admin/journal" class="nav-link" active-class="nav-link-active">
            <BookOpenIcon :size="15" /> Journal de Bord
          </NuxtLink>
        </div>

        <!-- Gestion -->
        <div>
          <div class="nav-section-title">Gestion</div>
          <NuxtLink to="/admin/equipe" class="nav-link" active-class="nav-link-active">
            <UsersIcon :size="15" /> Équipe
          </NuxtLink>
          <NuxtLink to="/admin/affectations" class="nav-link" active-class="nav-link-active">
            <LinkIcon :size="15" /> Affectations
          </NuxtLink>
          <NuxtLink to="/admin/reglement" class="nav-link" active-class="nav-link-active">
            <ScrollTextIcon :size="15" /> Règlements
          </NuxtLink>
          <NuxtLink to="/admin/roles" class="nav-link" active-class="nav-link-active">
            <ShieldIcon :size="15" /> Comptes & Rôles
            <span v-if="pendingCount > 0" class="nav-notif-badge">{{ pendingCount }}</span>
          </NuxtLink>
        </div>

        <!-- Configuration -->
        <div>
          <div class="nav-section-title">Configuration</div>
          <NuxtLink to="/admin/parametres" class="nav-link" active-class="nav-link-active">
            <SettingsIcon :size="15" /> Événements & Villes
          </NuxtLink>
          <NuxtLink to="/admin/plateformes" class="nav-link" active-class="nav-link-active">
            <GlobeIcon :size="15" /> Plateformes
          </NuxtLink>
        </div>
      </template>

      <!-- EMPLOYEE NAV -->
      <template v-if="role === 'employe'">
        <div>
          <div class="nav-section-title">Overview</div>
          <NuxtLink to="/employe" class="nav-link" exact-active-class="nav-link-active">
            <LayoutDashboardIcon :size="15" /> Dashboard
          </NuxtLink>
        </div>

        <div>
          <div class="nav-section-title">Mon Activité</div>
          <NuxtLink to="/employe/taches" class="nav-link" active-class="nav-link-active" @click="clearNotifType('NOUVELLE_TACHE')">
            <ListTodoIcon :size="15" /> Mes Tâches
            <span v-if="notifTaches > 0" class="nav-notif-badge">{{ notifTaches }}</span>
          </NuxtLink>
          <NuxtLink to="/employe/planning" class="nav-link" active-class="nav-link-active">
            <CalendarIcon :size="15" /> Mon Planning
          </NuxtLink>
          <NuxtLink to="/employe/journal" class="nav-link" active-class="nav-link-active" @click="clearNotifType('COMMENTAIRE')">
            <BookOpenIcon :size="15" /> Mon Journal
            <span v-if="notifJournal > 0" class="nav-notif-badge">{{ notifJournal }}</span>
          </NuxtLink>
        </div>

        <div>
          <div class="nav-section-title">Informations</div>
          <NuxtLink to="/employe/reglement" class="nav-link" active-class="nav-link-active" @click="clearNotifType('REGLEMENT')">
            <ScrollTextIcon :size="15" /> Règlements
            <span v-if="notifReglement > 0" class="nav-notif-badge">{{ notifReglement }}</span>
          </NuxtLink>
        </div>

        <div>
          <div class="nav-section-title">Compte</div>
          <NuxtLink to="/employe/profil" class="nav-link" active-class="nav-link-active">
            <UserIcon :size="15" /> Mon Profil
          </NuxtLink>
        </div>
      </template>
    </nav>

    <!-- Bottom -->
    <div style="border-top: 1px solid var(--border-light); padding-top: 0.75rem; margin-top: 0.75rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; padding: 0 0.5rem;">
        <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;">Apparence</span>
        <button type="button" @click="toggleTheme" class="theme-toggle-btn" :title="isDark ? 'Mode Clair' : 'Mode Sombre'">
          <MoonIcon v-if="!isDark" :size="14" />
          <SunIcon v-else :size="14" />
        </button>
      </div>

      <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; border-radius: 6px; background: var(--bg-surface-hover); margin-bottom: 0.5rem;">
        <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--accent-blue); display: flex; align-items: center; justify-content: center; color: white; font-size: 0.7rem; font-weight: 600;">
          {{ initials }}
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 0.8125rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            {{ fullName }}
          </div>
          <div style="font-size: 0.6875rem; color: var(--text-muted);">{{ email }}</div>
        </div>
      </div>
      <button type="button" @click="handleLogout" class="nav-link" style="color: var(--text-muted); background:none; border:none; width:100%; cursor:pointer;">
        <LogOutIcon :size="15" /> Déconnexion
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  LayoutDashboard as LayoutDashboardIcon,
  Megaphone as MegaphoneIcon,
  Film as FilmIcon,
  Palette as PaletteIcon,
  Code as CodeIcon,
  Users as UsersIcon,
  Link as LinkIcon,
  Settings as SettingsIcon,
  Globe as GlobeIcon,
  ListTodo as ListTodoIcon,
  Calendar as CalendarIcon,
  User as UserIcon,
  LogOut as LogOutIcon,
  BarChart2 as BarChart2Icon,
  Shield as ShieldIcon,
  Moon as MoonIcon,
  Sun as SunIcon,
  BookOpen as BookOpenIcon,
  ScrollText as ScrollTextIcon
} from 'lucide-vue-next'

const props = defineProps({
  role: { type: String, required: true }
})

const { user, logout } = useAuth()
const { isDark, toggleTheme } = useTheme()

// Pending account count for admin badge
const pendingCount = ref(0)

// Employee notification counts by type
const notifications = ref([])
const notifTaches = computed(() => notifications.value.filter(n => n.type === 'NOUVELLE_TACHE').length)
const notifJournal = computed(() => notifications.value.filter(n => n.type === 'COMMENTAIRE').length)
const notifReglement = computed(() => notifications.value.filter(n => n.type === 'REGLEMENT').length)

onMounted(async () => {
  if (props.role === 'admin') {
    try {
      const res = await $fetch('/api/auth/pending')
      pendingCount.value = res?.length || 0
    } catch {}
  }

  if (props.role === 'employe' && user.value?.id) {
    try {
      const res = await $fetch('/api/notifications', { query: { employeId: user.value.id } })
      notifications.value = res || []
    } catch {}
  }
})

const clearNotifType = async (type) => {
  if (!user.value?.id) return
  const before = notifications.value.filter(n => n.type === type).length
  if (before === 0) return
  notifications.value = notifications.value.filter(n => n.type !== type)
  try {
    await $fetch('/api/notifications/marquer-lu', {
      method: 'POST',
      body: { employeId: user.value.id, type }
    })
  } catch {}
}

const initials = computed(() => {
  const u = user.value
  if (!u) return props.role === 'admin' ? 'AD' : 'EM'
  return `${(u.prenom || u.nom || '?').charAt(0)}${(u.nom || '').charAt(0)}`.toUpperCase()
})

const fullName = computed(() => {
  const u = user.value
  if (!u) return props.role === 'admin' ? 'Administrateur' : 'Employé'
  return `${u.prenom || ''} ${u.nom || ''}`.trim()
})

const email = computed(() => user.value?.email || '')

const handleLogout = async () => {
  await logout()
}
</script>

<style scoped>
.nav-section-title {
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0 0.5rem;
  margin-bottom: 0.375rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.4rem 0.5rem;
  border-radius: 6px;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.8125rem;
  transition: all 0.12s ease;
}

.nav-link:hover {
  background: var(--bg-surface-hover);
  color: var(--text-primary);
}

.nav-link-active {
  background: #f3f4f6;
  color: var(--text-primary);
  font-weight: 600;
}

[data-theme="dark"] .nav-link-active {
  background: #27272a;
}

.theme-toggle-btn {
  background: var(--bg-surface-hover);
  border: 1px solid var(--border-light);
  color: var(--text-secondary);
  border-radius: 6px;
  padding: 0.35rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.theme-toggle-btn:hover {
  background: var(--border-light);
  color: var(--text-primary);
}

.nav-notif-badge {
  background: #ef4444;
  color: white;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 0.1rem 0.38rem;
  border-radius: 999px;
  margin-left: auto;
  line-height: 1.4;
}
</style>
