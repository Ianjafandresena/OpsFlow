<template>
  <div class="animate-fade-in" v-if="myEmployeInfo">
    <div class="page-header">
      <div>
        <h1 class="page-title">Bonjour, {{ myEmployeInfo.prenom }}</h1>
        <p class="page-subtitle" style="margin-bottom:0;">Voici un résumé de votre activité.</p>
      </div>
      <div style="display:flex; align-items:center; gap:0.5rem; background:var(--bg-surface); padding:0.5rem 1rem; border-radius:8px; border:1px solid var(--border-light);">
        <span style="font-size:0.8125rem; font-weight:600; color:var(--text-secondary);">Connecté en tant que :</span>
        <span class="badge badge-neutral">{{ myEmployeInfo.poste?.titre_poste || 'Employé' }}</span>
      </div>
    </div>

    <!-- KPIs -->
    <div class="kpi-grid kpi-grid-3" style="margin-bottom:1.5rem;">
      <div class="card kpi-card">
        <div class="kpi-icon"><ListTodoIcon :size="18" /></div>
        <div>
          <div class="kpi-label">Total des tâches</div>
          <div class="kpi-value">{{ totalTasks }}</div>
        </div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-icon"><CheckCircleIcon :size="18" /></div>
        <div>
          <div class="kpi-label">Tâches terminées</div>
          <div class="kpi-value" style="color:var(--status-success);">{{ doneTasks }}</div>
        </div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-icon"><ClockIcon :size="18" /></div>
        <div>
          <div class="kpi-label">En attente / En cours</div>
          <div class="kpi-value" style="color:var(--status-warning);">{{ pendingTasks }}</div>
        </div>
      </div>
    </div>

    <!-- Pages Gérées -->
    <div class="card" style="margin-bottom:1.5rem;">
      <h3 style="font-size:0.9375rem; font-weight:600; margin-bottom:1rem;">Mes Projets Assignés</h3>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:0.75rem;">
        <div v-for="page in myAffectations" :key="page.id" style="border:1px solid var(--border-light); border-radius:6px; padding:0.75rem 1rem;">
          <div style="font-weight:600; font-size:0.875rem; margin-bottom:0.25rem;">{{ page.licence?.nom_licence }} - {{ page.ville?.nom_ville }}</div>
          <div style="display:flex; gap:0.25rem; flex-wrap:wrap; margin-top:0.5rem;">
            <span class="badge badge-neutral" style="font-size:0.625rem;">Édition de base</span>
          </div>
        </div>
        <div v-if="myAffectations.length === 0" style="color:var(--text-secondary); font-size:0.875rem;">Aucune affectation trouvée.</div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="card" style="padding:0; overflow:hidden;">
      <div style="padding:1rem 1.25rem; border-bottom:1px solid var(--border-light); display:flex; justify-content:space-between; align-items:center;">
        <h3 style="font-size:0.9375rem; font-weight:600;">Mes Dernières Activités</h3>
        <NuxtLink to="/employe/taches" class="btn btn-secondary btn-sm" style="text-decoration:none;">Voir tout</NuxtLink>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Tâche</th>
            <th>Projet</th>
            <th>Date limite</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="act in recent" :key="act.id">
            <td style="font-weight:500;">{{ act.titre }}</td>
            <td style="color:var(--text-secondary);">{{ act.edition?.licence?.sigle }} - {{ act.edition?.ville?.nom_ville }}</td>
            <td style="color:var(--text-secondary);">{{ new Date(act.date_limite).toLocaleDateString() }}</td>
            <td><span class="badge" :style="{background: act.statutTache?.couleur + '20', color: act.statutTache?.couleur, border: '1px solid ' + act.statutTache?.couleur}">{{ act.statutTache?.nom }}</span></td>
          </tr>
          <tr v-if="recent.length === 0">
            <td colspan="4" style="text-align:center; padding:2rem; color:var(--text-secondary);">Aucune tâche récente.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ListTodo as ListTodoIcon, CheckCircle as CheckCircleIcon, Clock as ClockIcon } from 'lucide-vue-next'

definePageMeta({ layout: 'employe' })

const { user } = useAuth()
const loggedEmployeId = computed(() => user.value?.id)
const myEmployeInfo = computed(() => user.value)

const { data: affectations } = await useFetch('/api/affectations')
const myAffectations = computed(() => {
  if (!affectations.value) return []
  return affectations.value.find(a => a.id === loggedEmployeId.value)?.editionsGerees || []
})

const { data: taches } = await useFetch('/api/taches')
const myTaches = computed(() => taches.value?.filter(t => t.employeId === loggedEmployeId.value) || [])

const totalTasks = computed(() => myTaches.value.length)
const doneTasks = computed(() => myTaches.value.filter(t => t.statutTache?.nom === 'Terminé' || t.statutTache?.nom === 'Publié').length)
const pendingTasks = computed(() => totalTasks.value - doneTasks.value)

const recent = computed(() => {
  return [...myTaches.value].sort((a,b) => new Date(b.date_limite) - new Date(a.date_limite)).slice(0, 5)
})
</script>
