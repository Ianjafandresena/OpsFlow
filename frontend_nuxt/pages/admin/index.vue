<template>
  <div class="animate-fade-in">
    <div class="page-header">
      <div>
        <h1 class="page-title">Supervision Globale</h1>
        <p class="page-subtitle" style="margin-bottom: 0;">Vue d'ensemble de l'activité de tous les départements.</p>
      </div>
    </div>

    <!-- Demandes en attente -->
    <div v-if="demandes && demandes.length > 0" class="card" style="margin-bottom: 1.5rem; border-color: var(--accent-purple);">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
        <h3 style="font-size: 0.9375rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; color: var(--accent-purple);">
          <span style="display: inline-block; width: 8px; height: 8px; background: var(--accent-purple); border-radius: 50%;"></span>
          Demandes de collaborateurs en attente
        </h3>
        <span class="badge" style="background: var(--accent-purple)20; color: var(--accent-purple); font-weight: 600;">{{ demandes.length }} nouvelles</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <div v-for="dem in demandes" :key="dem.id" class="card" style="padding: 0.75rem 1rem; border-color: var(--border-light); display: flex; justify-content: space-between; align-items: center; background: #fafafa; gap: 1rem; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 250px;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem; flex-wrap: wrap;">
              <span class="badge" :style="{
                background: dem.typeDemande === 'SUPPRESSION' ? 'var(--status-danger-bg)' : 'var(--status-info-bg)',
                color: dem.typeDemande === 'SUPPRESSION' ? 'var(--status-danger)' : 'var(--status-info)',
                border: dem.typeDemande === 'SUPPRESSION' ? '1px solid rgba(239,68,68,0.15)' : '1px solid rgba(59,130,246,0.15)'
              }">
                {{ dem.typeDemande === 'SUPPRESSION' ? 'SUPPRESSION' : 'MODIFICATION' }}
              </span>
              <strong style="font-size: 0.8125rem;">{{ dem.tache?.titre }}</strong>
              <span style="font-size: 0.75rem; color: var(--text-secondary);">demandé par <strong>{{ dem.tache?.employe?.prenom }} {{ dem.tache?.employe?.nom }}</strong></span>
            </div>
            <div style="font-size: 0.8125rem; color: var(--text-secondary); margin-bottom: 0.25rem; line-height: 1.4;">
              <strong>Motif :</strong> "{{ dem.motif }}"
            </div>
            
            <!-- Si modification, afficher les changements de manière très propre -->
            <div v-if="dem.typeDemande === 'MODIFICATION' && getModifDetails(dem)" style="font-size: 0.75rem; background: white; border: 1px solid var(--border-light); border-radius: 6px; padding: 0.5rem 0.75rem; margin-top: 0.5rem; max-width: 600px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);">
              <div style="font-weight: 600; color: var(--text-muted); margin-bottom: 0.35rem; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.025em;">Changements proposés :</div>
              <ul style="padding-left: 1rem; margin: 0; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.25rem;">
                <li v-for="change in getModifDetails(dem)" :key="change.field" style="line-height: 1.4;">
                  <strong>{{ change.label }} :</strong> 
                  <span style="text-decoration: line-through; color: var(--status-danger); margin-right: 0.35rem;">{{ change.old }}</span>
                  <span style="color: var(--status-success); font-weight: 500;">{{ change.new }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center; justify-content: flex-end; min-width: 150px;">
            <button class="btn btn-primary btn-sm" style="background-color: var(--status-success); color: white;" @click="deciderDemande(dem.id, 'APPROVE')">Accepter</button>
            <button class="btn btn-secondary btn-sm" style="color: var(--status-danger); border-color: var(--status-danger);" @click="deciderDemande(dem.id, 'REJECT')">Refuser</button>
          </div>
        </div>
      </div>
    </div>

    <!-- KPIs -->
    <div class="kpi-grid kpi-grid-4" style="margin-bottom: 1.5rem;">
      <div class="card kpi-card">
        <div class="kpi-icon"><MegaphoneIcon :size="18" /></div>
        <div>
          <div class="kpi-label">Publications (semaine)</div>
          <div class="kpi-value">{{ pubsCount }}</div>
        </div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-icon"><FilmIcon :size="18" /></div>
        <div>
          <div class="kpi-label">Montages Vidéo</div>
          <div class="kpi-value">{{ vidsCount }}</div>
        </div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-icon"><PaletteIcon :size="18" /></div>
        <div>
          <div class="kpi-label">Visuels Créés</div>
          <div class="kpi-value">{{ visuelsCount }}</div>
        </div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-icon"><UsersIcon :size="18" /></div>
        <div>
          <div class="kpi-label">Collaborateurs Actifs</div>
          <div class="kpi-value">{{ employesCount }}</div>
        </div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
      <!-- Score Qualité chart placeholder -->
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 500;">Score Qualité Moyen</div>
            <div style="display: flex; align-items: baseline; gap: 0.5rem;">
              <span style="font-size: 1.5rem; font-weight: 700;">89/100</span>
              <span class="badge badge-success">↑ 2.4%</span>
            </div>
          </div>
          <select class="form-input" style="padding: 0.3rem 0.5rem; font-size: 0.75rem;">
            <option>30 derniers jours</option>
            <option>7 derniers jours</option>
            <option>Tout</option>
          </select>
        </div>
        <div style="height: 160px; background: linear-gradient(180deg, rgba(229,231,235,0.4) 0%, transparent 100%); border-radius: 4px; border-bottom: 2px solid var(--accent-primary); display: flex; align-items: flex-end; padding: 0 1rem;">
          <div style="width: 100%; display: flex; justify-content: space-between; color: var(--text-muted); font-size: 0.6875rem; padding-bottom: 0.5rem;">
            <span>1 Mai</span><span>15 Mai</span><span>1 Juin</span>
          </div>
        </div>
      </div>

      <!-- Alertes -->
      <div class="card" style="display: flex; flex-direction: column;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3 style="font-size: 0.875rem; font-weight: 600;">Alertes & Retards</h3>
          <span class="badge badge-danger">{{ alerts.length }}</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.75rem; flex: 1;">
          <div v-for="alert in alerts" :key="alert.id" style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.75rem; border-bottom: 1px dashed var(--border-light);">
            <div>
              <div style="font-weight: 500; font-size: 0.8125rem;">{{ alert.label }}</div>
              <div style="font-size: 0.6875rem; color: var(--text-secondary);">{{ alert.detail }}</div>
            </div>
            <span class="badge" :class="alert.badgeClass">{{ alert.type }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Activité récente -->
    <div class="card" style="padding: 0; overflow: hidden;">
      <div style="padding: 1rem 1.25rem; border-bottom: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center;">
        <h3 style="font-size: 0.9375rem; font-weight: 600;">Activité Récente (Toutes Équipes)</h3>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Collaborateur</th>
            <th>Département</th>
            <th>Tâche</th>
            <th>Date</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="act in recentActivity" :key="act.id">
            <td style="font-weight: 500;">{{ act.name }}</td>
            <td><span class="badge badge-neutral">{{ act.dept }}</span></td>
            <td class="truncate" :title="act.task">{{ act.task }}</td>
            <td style="color: var(--text-secondary);">{{ act.date }}</td>
            <td>
              <span class="badge" :style="{background: act.color + '20', color: act.color, border: '1px solid ' + act.color}">{{ act.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Megaphone as MegaphoneIcon, Film as FilmIcon, Palette as PaletteIcon, Users as UsersIcon } from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })

const { data: taches, refresh: refreshTaches } = await useFetch('/api/taches')
const { data: employes } = await useFetch('/api/equipe')
const { data: demandes, refresh: refreshDemandes } = await useFetch('/api/taches/demandes')

const deciderDemande = async (id, decision) => {
  await $fetch(`/api/taches/demandes/${id}/decider`, {
    method: 'POST',
    body: { decision }
  })
  await refreshDemandes()
  await refreshTaches()
}

const getModifDetails = (dem) => {
  if (!dem.donneesModif || !dem.tache) return null
  try {
    const parsed = JSON.parse(dem.donneesModif)
    const changes = []
    
    const fieldMapping = {
      titre: 'Titre/Nom',
      description: 'Description/Brief',
      date_limite: 'Deadline',
      demandeur: 'Demandeur',
      type_visuel: 'Type de Visuel',
      quantite: 'Quantité',
      format_video: 'Format Vidéo',
      duree_cible: 'Durée Cible',
      type_technique: 'Type Technique',
      type_demarche: 'Type Démarche',
      outil_mailing: 'Outil Mailing',
      plateforme: 'Plateforme',
      type_pub: 'Type de Publication',
      budget: 'Budget',
      audience: 'Audience'
    }

    for (const key in fieldMapping) {
      if (parsed[key] !== undefined) {
        let oldVal = dem.tache[key]
        let newVal = parsed[key]
        
        if (key === 'date_limite' || key === 'date_demande' || key === 'date_resultat') {
          if (oldVal) oldVal = new Date(oldVal).toLocaleDateString()
          if (newVal) newVal = new Date(newVal).toLocaleDateString()
        }

        if (oldVal !== newVal) {
          changes.push({
            field: key,
            label: fieldMapping[key],
            old: oldVal === null || oldVal === undefined || oldVal === '' ? 'Vide' : oldVal,
            new: newVal === null || newVal === undefined || newVal === '' ? 'Vide' : newVal
          })
        }
      }
    }
    return changes.length > 0 ? changes : null
  } catch (err) {
    return null
  }
}

const pubsCount = computed(() => taches.value?.filter(t => t.type_pub || t.type_demarche || t.budget).length || 0)
const vidsCount = computed(() => taches.value?.filter(t => t.format_video).length || 0)
const visuelsCount = computed(() => taches.value?.filter(t => t.type_visuel).length || 0)
const employesCount = computed(() => employes.value?.length || 0)

const alerts = computed(() => {
  if (!taches.value) return []
  const now = new Date()
  return taches.value
    .filter(t => new Date(t.date_limite) < now && t.statutTache?.nom !== 'Terminé' && t.statutTache?.nom !== 'Publié')
    .slice(0, 3)
    .map(t => ({
      id: t.id,
      label: `${t.edition?.licence?.sigle} - ${t.titre}`,
      detail: `Deadline dépassée (${new Date(t.date_limite).toLocaleDateString()})`,
      type: 'Retard',
      badgeClass: 'badge-danger'
    }))
})

const recentActivity = computed(() => {
  if (!taches.value) return []
  return [...taches.value].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5).map(t => ({
    id: t.id,
    name: t.employe ? `${t.employe.prenom} ${t.employe.nom[0]}.` : 'Inconnu',
    dept: t.employe?.poste?.departement?.nom_departement || 'N/A',
    task: t.titre,
    date: new Date(t.createdAt).toLocaleDateString(),
    status: t.statutTache?.nom,
    color: t.statutTache?.couleur
  }))
})
</script>
