<template>
  <div class="animate-fade-in">
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle" style="margin-bottom:0;">Vue d'ensemble de l'activité.</p>
      </div>
    </div>

    <!-- Demandes en attente -->
    <div v-if="demandes && demandes.length > 0" class="card" style="margin-bottom:1.5rem; border-color:var(--accent-purple);">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
        <h3 style="font-size:0.9375rem; font-weight:600; display:flex; align-items:center; gap:0.5rem; color:var(--accent-purple);">
          <span style="display:inline-block; width:8px; height:8px; background:var(--accent-purple); border-radius:50%;"></span>
          Demandes de collaborateurs en attente
        </h3>
        <span class="badge" style="background:var(--accent-purple)20; color:var(--accent-purple); font-weight:600;">{{ demandes.length }} nouvelles</span>
      </div>
      <div style="display:flex; flex-direction:column; gap:0.75rem;">
        <div v-for="dem in demandes" :key="dem.id" class="card" style="padding:0.75rem 1rem; border-color:var(--border-light); display:flex; justify-content:space-between; align-items:center; background:var(--bg-surface-hover); gap:1rem; flex-wrap:wrap;">
          <div style="flex:1; min-width:250px;">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem; flex-wrap:wrap;">
              <span class="badge" :style="{background: dem.typeDemande==='SUPPRESSION' ? 'var(--status-danger-bg)' : 'var(--status-info-bg)', color: dem.typeDemande==='SUPPRESSION' ? 'var(--status-danger)' : 'var(--status-info)'}">
                {{ dem.typeDemande === 'SUPPRESSION' ? 'SUPPRESSION' : 'MODIFICATION' }}
              </span>
              <strong style="font-size:0.8125rem;">{{ dem.tache?.titre }}</strong>
              <span style="font-size:0.75rem; color:var(--text-secondary);">par <strong>{{ dem.tache?.employe?.prenom }} {{ dem.tache?.employe?.nom }}</strong></span>
            </div>
            <div style="font-size:0.8125rem; color:var(--text-secondary);">
              <strong>Motif :</strong> "{{ dem.motif }}"
            </div>
            <div v-if="dem.typeDemande === 'MODIFICATION' && getModifDetails(dem)" style="font-size:0.75rem; background:var(--bg-surface); border:1px solid var(--border-light); border-radius:6px; padding:0.5rem 0.75rem; margin-top:0.5rem; max-width:600px;">
              <div style="font-weight:600; color:var(--text-muted); margin-bottom:0.35rem; font-size:0.7rem; text-transform:uppercase;">Changements proposés :</div>
              <ul style="padding-left:1rem; margin:0; color:var(--text-secondary); display:flex; flex-direction:column; gap:0.2rem;">
                <li v-for="c in getModifDetails(dem)" :key="c.field">
                  <strong>{{ c.label }} :</strong>
                  <span style="text-decoration:line-through; color:var(--status-danger); margin-right:0.35rem;">{{ c.old }}</span>
                  <span style="color:var(--status-success); font-weight:500;">{{ c.new }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-primary btn-sm" style="background:var(--status-success); color:white;" @click="deciderDemande(dem.id, 'APPROVE')">Accepter</button>
            <button class="btn btn-secondary btn-sm" style="color:var(--status-danger); border-color:var(--status-danger);" @click="deciderDemande(dem.id, 'REJECT')">Refuser</button>
          </div>
        </div>
      </div>
    </div>

    <!-- KPIs -->
    <div class="kpi-grid kpi-grid-4" style="margin-bottom:1.5rem;">
      <div class="card kpi-card">
        <div class="kpi-icon" style="background:#3b82f620; color:#3b82f6;"><ListTodoIcon :size="18" /></div>
        <div>
          <div class="kpi-label">Tâches en cours</div>
          <div class="kpi-value">{{ tachesActives.length }}</div>
        </div>
      </div>
      <div class="card kpi-card" style="border-color:#ef444430;">
        <div class="kpi-icon" style="background:#ef444420; color:#ef4444;"><AlertTriangleIcon :size="18" /></div>
        <div>
          <div class="kpi-label">En retard</div>
          <div class="kpi-value" style="color:#ef4444;">{{ tachesEnRetard.length }}</div>
        </div>
      </div>
      <div class="card kpi-card" style="border-color:#f59e0b30;">
        <div class="kpi-icon" style="background:#f59e0b20; color:#f59e0b;"><ClipboardCheckIcon :size="18" /></div>
        <div>
          <div class="kpi-label">À vérifier</div>
          <div class="kpi-value" style="color:#f59e0b;">{{ tachesAVerifier.length }}</div>
        </div>
      </div>
      <div class="card kpi-card" style="border-color:#10b98130;">
        <div class="kpi-icon" style="background:#10b98120; color:#10b981;"><CheckCircleIcon :size="18" /></div>
        <div>
          <div class="kpi-label">Terminées</div>
          <div class="kpi-value" style="color:#10b981;">{{ tachesTerminees.length }}</div>
        </div>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:2fr 1fr; gap:1.5rem; margin-bottom:1.5rem; align-items:start;">

      <!-- Avancement par Événement -->
      <div class="card">
        <h3 style="font-size:0.9375rem; font-weight:600; margin-bottom:1.25rem; display:flex; align-items:center; gap:0.5rem;">
          <CalendarIcon :size="16" style="color:var(--accent-primary);" /> Avancement par Événement
        </h3>
        <div v-if="editionsProgress.length === 0" style="color:var(--text-muted); font-size:0.875rem; text-align:center; padding:1rem 0;">
          Aucun événement avec des tâches
        </div>
        <div style="display:flex; flex-direction:column; gap:1rem;">
          <div v-for="ed in editionsProgress" :key="ed.id">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
              <span style="font-size:0.8125rem; font-weight:600;">{{ ed.nom }}</span>
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <span v-if="ed.urgent > 0" class="badge" style="background:#dc262615; color:#dc2626; font-size:0.65rem;">⚠ {{ ed.urgent }} urgent</span>
                <span v-if="ed.overdue > 0" class="badge badge-danger" style="font-size:0.65rem;">{{ ed.overdue }} retard</span>
                <span style="font-size:0.75rem; color:var(--text-muted); font-weight:500;">{{ ed.done }}/{{ ed.total }}</span>
              </div>
            </div>
            <div style="height:6px; background:var(--bg-surface-hover); border-radius:99px; overflow:hidden;">
              <div :style="{
                width: ed.total > 0 ? Math.round((ed.done / ed.total) * 100) + '%' : '0%',
                height: '100%',
                background: ed.overdue > 0 ? '#ef4444' : ed.done === ed.total ? '#10b981' : 'var(--accent-primary)',
                borderRadius: '99px',
                transition: 'width 0.4s ease'
              }"></div>
            </div>
            <div style="font-size:0.7rem; color:var(--text-muted); margin-top:0.2rem;">
              {{ ed.total > 0 ? Math.round((ed.done / ed.total) * 100) : 0 }}% terminé
            </div>
          </div>
        </div>
      </div>

      <!-- Urgentes & Retards -->
      <div style="display:flex; flex-direction:column; gap:1rem;">
        <div class="card" v-if="tachesUrgentes.length > 0" style="border-color:#dc262630;">
          <h3 style="font-size:0.875rem; font-weight:600; color:#dc2626; margin-bottom:0.75rem; display:flex; align-items:center; gap:0.4rem;">
            <AlertTriangleIcon :size="14" /> Urgentes ({{ tachesUrgentes.length }})
          </h3>
          <div style="display:flex; flex-direction:column; gap:0.5rem;">
            <div v-for="t in tachesUrgentes.slice(0,4)" :key="t.id" style="font-size:0.8rem; display:flex; justify-content:space-between; align-items:center;">
              <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1;">{{ t.titre }}</span>
              <span style="font-size:0.7rem; color:var(--text-muted); margin-left:0.5rem; flex-shrink:0;">{{ t.employe?.prenom }}</span>
            </div>
          </div>
        </div>

        <div class="card" style="border-color:#ef444430;">
          <h3 style="font-size:0.875rem; font-weight:600; margin-bottom:0.75rem; display:flex; align-items:center; gap:0.4rem;">
            <ClockIcon :size="14" style="color:#ef4444;" /> Retards ({{ tachesEnRetard.length }})
          </h3>
          <div v-if="tachesEnRetard.length === 0" style="font-size:0.8rem; color:var(--text-muted);">Aucun retard ✓</div>
          <div style="display:flex; flex-direction:column; gap:0.5rem;">
            <div v-for="t in tachesEnRetard.slice(0,5)" :key="t.id" style="font-size:0.8rem;">
              <div style="font-weight:500; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">{{ t.titre }}</div>
              <div style="font-size:0.7rem; color:#ef4444;">{{ t.employe?.prenom }} · dépassé le {{ formatDateShort(t.date_limite) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activité récente -->
    <div class="card" style="padding:0; overflow:hidden;">
      <div style="padding:1rem 1.25rem; border-bottom:1px solid var(--border-light); display:flex; justify-content:space-between; align-items:center;">
        <h3 style="font-size:0.9375rem; font-weight:600;">Activité Récente</h3>
        <span style="font-size:0.75rem; color:var(--text-muted);">10 dernières tâches créées</span>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Collaborateur</th>
            <th>Tâche</th>
            <th>Deadline</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in recentActivity" :key="t.id">
            <td style="font-weight:500; white-space:nowrap;">
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <div style="width:22px; height:22px; border-radius:50%; background:var(--accent-blue); color:white; font-size:0.6rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                  {{ (t.employe?.prenom?.charAt(0) || '') + (t.employe?.nom?.charAt(0) || '') }}
                </div>
                {{ t.employe?.prenom }} {{ t.employe?.nom?.charAt(0) }}.
              </div>
            </td>
            <td style="max-width:220px;">
              <div style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" :title="t.titre">
                <span v-if="t.urgent" style="color:#dc2626; font-weight:700; margin-right:0.25rem;">⚠</span>{{ t.titre }}
              </div>
            </td>
            <td style="white-space:nowrap;" :style="{color: isLate(t) ? '#ef4444' : 'var(--text-secondary)'}">
              {{ formatDateShort(t.date_limite) }}
              <span v-if="isLate(t)" style="font-size:0.7rem;">⚠</span>
            </td>
            <td>
              <span class="badge" :style="statutStyle(t.statutTache?.libelle)">{{ t.statutTache?.libelle }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import {
  AlertTriangle as AlertTriangleIcon,
  CheckCircle as CheckCircleIcon,
  ClipboardCheck as ClipboardCheckIcon,
  ListTodo as ListTodoIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon
} from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })

const { data: taches, refresh: refreshTaches } = await useFetch('/api/taches')
const { data: demandes, refresh: refreshDemandes } = await useFetch('/api/taches/demandes')

onMounted(async () => {
  await refreshTaches()
  await refreshDemandes()
})

const deciderDemande = async (id, decision) => {
  await $fetch(`/api/taches/demandes/${id}/decider`, { method: 'POST', body: { decision } })
  await refreshDemandes()
  await refreshTaches()
}

const isTermine = (t) => {
  const lib = (t.statutTache?.libelle || '').toLowerCase()
  return lib.includes('termin') || lib.includes('publi')
}
const isLate = (t) => !isTermine(t) && new Date(t.date_limite) < new Date()

const tachesActives = computed(() => (taches.value || []).filter(t => !isTermine(t)))
const tachesEnRetard = computed(() => tachesActives.value.filter(t => isLate(t)))
const tachesAVerifier = computed(() => (taches.value || []).filter(t => t.aVerifier))
const tachesTerminees = computed(() => (taches.value || []).filter(t => isTermine(t)))
const tachesUrgentes = computed(() => tachesActives.value.filter(t => t.urgent))

const editionsProgress = computed(() => {
  const byEd = {}
  for (const t of (taches.value || [])) {
    if (!t.editionId) continue
    if (!byEd[t.editionId]) {
      byEd[t.editionId] = {
        id: t.editionId,
        nom: `${t.edition?.licence?.sigle || ''} ${t.edition?.ville?.nom_ville || ''}`.trim(),
        total: 0, done: 0, overdue: 0, urgent: 0
      }
    }
    byEd[t.editionId].total++
    if (isTermine(t)) byEd[t.editionId].done++
    else if (isLate(t)) byEd[t.editionId].overdue++
    if (t.urgent && !isTermine(t)) byEd[t.editionId].urgent++
  }
  return Object.values(byEd).sort((a, b) => b.total - a.total)
})

const recentActivity = computed(() =>
  [...(taches.value || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10)
)

const formatDateShort = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

const statutStyle = (libelle) => {
  const lib = (libelle || '').toLowerCase()
  if (lib.includes('termin') || lib.includes('publi')) return 'background:#10b98115; color:#10b981; border:1px solid #10b98130; padding:0.25rem 0.5rem; border-radius:99px; font-size:0.7rem; font-weight:600;'
  if (lib.includes('cours')) return 'background:#3b82f615; color:#3b82f6; border:1px solid #3b82f630; padding:0.25rem 0.5rem; border-radius:99px; font-size:0.7rem; font-weight:600;'
  if (lib.includes('attente') || lib.includes('vérif')) return 'background:#f59e0b15; color:#f59e0b; border:1px solid #f59e0b30; padding:0.25rem 0.5rem; border-radius:99px; font-size:0.7rem; font-weight:600;'
  return 'background:var(--bg-surface-hover); color:var(--text-secondary); border:1px solid var(--border-light); padding:0.25rem 0.5rem; border-radius:99px; font-size:0.7rem; font-weight:600;'
}

const getModifDetails = (dem) => {
  if (!dem.donneesModif || !dem.tache) return null
  try {
    const parsed = JSON.parse(dem.donneesModif)
    const fieldMapping = {
      titre: 'Titre', description: 'Description', date_limite: 'Deadline',
      demandeur: 'Demandeur', type_visuel: 'Type Visuel', quantite: 'Quantité',
      format_video: 'Format Vidéo', duree_cible: 'Durée Cible', type_technique: 'Type Technique',
      type_demarche: 'Type Démarche', outil_mailing: 'Outil Mailing', plateforme: 'Plateforme',
      type_pub: 'Type Publication', budget: 'Budget', audience: 'Audience'
    }
    const changes = []
    for (const key in fieldMapping) {
      if (parsed[key] !== undefined) {
        let oldVal = dem.tache[key]
        let newVal = parsed[key]
        if (key === 'date_limite') { oldVal = oldVal ? new Date(oldVal).toLocaleDateString() : null; newVal = newVal ? new Date(newVal).toLocaleDateString() : null }
        if (String(oldVal) !== String(newVal)) changes.push({ field: key, label: fieldMapping[key], old: oldVal ?? 'Vide', new: newVal ?? 'Vide' })
      }
    }
    return changes.length > 0 ? changes : null
  } catch { return null }
}
</script>
