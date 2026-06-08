<template>
  <div class="animate-fade-in">
    <div class="page-header">
      <div>
        <h1 class="page-title">Mon Planning</h1>
        <p class="page-subtitle" style="margin-bottom:0;">Vue calendrier de vos prochaines tâches et deadlines.</p>
      </div>
    </div>

    <!-- Week selector -->
    <div class="card" style="margin-bottom:1.5rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
        <button class="btn btn-secondary btn-sm" @click="weekOffset--">
          <ChevronLeftIcon :size="14" /> Semaine précédente
        </button>
        <h3 style="font-size:0.9375rem; font-weight:600;">Semaine du {{ currentWeekLabel }}</h3>
        <button class="btn btn-secondary btn-sm" @click="weekOffset++">
          Semaine suivante <ChevronRightIcon :size="14" />
        </button>
      </div>

      <!-- Calendar Grid -->
      <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:0.5rem;">
        <div v-for="day in weekDays" :key="day.label" style="text-align:center;">
          <div style="font-size:0.6875rem; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.5rem;">{{ day.label }}</div>
          <div style="font-size:1.125rem; font-weight:600; margin-bottom:0.75rem;" :style="{color: day.isToday ? 'var(--accent-blue)' : 'var(--text-primary)'}">{{ day.date }}</div>
          
          <div style="display:flex; flex-direction:column; gap:0.375rem; min-height:80px;">
            <div v-for="task in day.tasks" :key="task.id" style="background:var(--bg-surface-hover); border:1px solid var(--border-light); border-radius:4px; padding:0.375rem 0.5rem; text-align:left; font-size:0.6875rem;">
              <div style="font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{ task.titre }}</div>
              <div style="color:var(--text-muted);">{{ new Date(task.date_limite).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</div>
            </div>
            <div v-if="day.tasks.length===0" style="font-size:0.6875rem; color:var(--text-muted); font-style:italic; padding-top:0.5rem;">—</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming -->
    <div class="card" style="padding:0; overflow:hidden;">
      <div style="padding:1rem 1.25rem; border-bottom:1px solid var(--border-light);">
        <h3 style="font-size:0.9375rem; font-weight:600;">Prochaines Deadlines</h3>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Tâche</th>
            <th>Projet</th>
            <th>Date</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in upcomingTasks" :key="task.id">
            <td style="font-weight:500;">{{ task.titre }}</td>
            <td>{{ task.edition?.licence?.sigle }} - {{ task.edition?.ville?.nom_ville }}</td>
            <td style="color:var(--text-secondary);">{{ new Date(task.date_limite).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) }}</td>
            <td><span class="badge" :style="{background: task.statutTache?.couleur + '20', color: task.statutTache?.couleur, border: '1px solid ' + task.statutTache?.couleur}">{{ task.statutTache?.nom }}</span></td>
          </tr>
          <tr v-if="upcomingTasks.length === 0">
            <td colspan="4" style="text-align:center; padding:2rem; color:var(--text-secondary);">Aucune échéance à venir.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'lucide-vue-next'

definePageMeta({ layout: 'employe' })

const { user } = useAuth()
const loggedEmployeId = computed(() => user.value?.id)

const weekOffset = ref(0)
const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const { data: taches } = await useFetch('/api/taches', { query: { employeId: loggedEmployeId } })

const currentWeekLabel = computed(() => {
  const now = new Date()
  now.setDate(now.getDate() + weekOffset.value * 7)
  const monday = new Date(now)
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
  monday.setDate(diff)
  
  return `${monday.getDate()} ${monday.toLocaleString('fr-FR', {month:'long'})}`
})

const weekDays = computed(() => {
  if (!taches.value) return []

  const now = new Date()
  now.setDate(now.getDate() + weekOffset.value * 7)
  const monday = new Date(now)
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  monday.setDate(diff)
  monday.setHours(0,0,0,0) // Reset to start of day

  const today = new Date()
  today.setHours(0,0,0,0)

  return dayNames.map((label, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    
    // Find tasks for this specific day
    const dayTasks = taches.value.filter(t => {
      const taskDate = new Date(t.date_limite)
      taskDate.setHours(0,0,0,0)
      return taskDate.getTime() === d.getTime()
    }).sort((a,b) => new Date(a.date_limite) - new Date(b.date_limite))

    return {
      label,
      date: d.getDate(),
      isToday: d.getTime() === today.getTime(),
      tasks: dayTasks
    }
  })
})

const upcomingTasks = computed(() => {
  if (!taches.value) return []
  const now = new Date()
  return [...taches.value]
    .filter(t => new Date(t.date_limite) > now && t.statutTache?.nom !== 'Terminé' && t.statutTache?.nom !== 'Publié')
    .sort((a,b) => new Date(a.date_limite) - new Date(b.date_limite))
    .slice(0, 5)
})
</script>
