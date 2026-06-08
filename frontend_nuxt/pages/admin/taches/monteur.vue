<template>
  <div class="animate-fade-in">
    <div class="page-header">
      <div>
        <h1 class="page-title">Tâches Monteurs Vidéo</h1>
        <p class="page-subtitle" style="margin-bottom:0;">Suivi des montages, teasers, recaps et contenus vidéo pour les événements.</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">
        <PlusIcon :size="15" /> Nouvelle Tâche Vidéo
      </button>
    </div>

    <!-- Filters -->
    <div class="card" style="margin-bottom:1.25rem; display:flex; flex-direction:row; gap:0.75rem; align-items:center; flex-wrap:wrap; padding:0.875rem 1.25rem;">
      <div class="search-wrapper" style="flex:1; min-width:160px;">
        <SearchIcon class="search-icon" :size="14" />
        <input type="text" v-model="filters.search" placeholder="Rechercher un projet vidéo..." class="form-input" />
      </div>
      <select v-model="filters.employeId" class="form-input" style="width:auto; min-width:150px;">
        <option value="">Tous les Monteurs</option>
        <option v-for="emp in monteurEquipe" :key="emp.id" :value="emp.id">{{ emp.nom }} {{ emp.prenom }}</option>
      </select>
      <select v-model="filters.statutTacheId" class="form-input" style="width:auto; min-width:130px;">
        <option value="">Tous Statuts</option>
        <option v-for="st in statuts" :key="st.id" :value="st.id">{{ st.nom }}</option>
      </select>
    </div>

    <!-- Table -->
    <div class="card" style="padding:0; overflow:hidden;">
      <table class="data-table">
        <thead>
          <tr>
            <th>Nom du Projet</th>
            <th>Monteur Assigné</th>
            <th>Deadline</th>
            <th>Statut</th>
            <th style="text-align:right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in filteredTasks" :key="task.id">
            <td style="font-weight:600;">{{ task.titre }}</td>
            <td style="font-weight:500;">{{ task.employe?.prenom }} {{ task.employe?.nom[0] }}.</td>
            <td style="color:var(--text-secondary);">{{ new Date(task.date_limite).toLocaleDateString() }}</td>
            <td><span class="badge" :style="{background: task.statutTache?.couleur + '20', color: task.statutTache?.couleur, border: '1px solid ' + task.statutTache?.couleur}">{{ task.statutTache?.nom }}</span></td>
            <td style="text-align:right;">
              <div class="actions-cell">
                <button class="btn btn-secondary btn-icon" @click="viewDetail(task)" title="Voir détails"><EyeIcon :size="14" /></button>
                <button class="btn btn-secondary btn-icon" @click="openEdit(task)" title="Modifier"><EditIcon :size="14" /></button>
                <button class="btn-danger-ghost" @click="remove(task.id)" title="Supprimer"><TrashIcon :size="14" /></button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredTasks.length===0">
            <td colspan="8" style="text-align:center; padding:2rem; color:var(--text-secondary);">Aucune tâche trouvée.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal CRUD -->
    <Modal :isOpen="modal" :title="editing ? 'Modifier la Tâche Vidéo' : 'Nouvelle Tâche Vidéo'" @close="modal=false">
      <form @submit.prevent="save" style="display:flex; flex-direction:column; gap:1rem;">
        <div class="form-group">
          <label class="form-label">Nom du Projet</label>
          <input type="text" v-model="form.titre" required class="form-input" placeholder="Ex: Teaser JOF Évreux 2026" />
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
          <div class="form-group">
            <label class="form-label">Attribuer à (Monteur)</label>
            <select v-model="form.employeId" required class="form-input">
              <option value="" disabled>Choisir</option>
              <option v-for="emp in monteurEquipe" :key="emp.id" :value="emp.id">{{ emp.nom }} {{ emp.prenom }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Demandeur</label>
            <select v-model="form.demandeur" class="form-input">
              <option value="" disabled>Choisir un demandeur</option>
              <option v-for="emp in employes" :key="emp.id" :value="emp.prenom + ' ' + emp.nom">{{ emp.prenom }} {{ emp.nom }}</option>
            </select>
          </div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
          <div class="form-group">
            <label class="form-label">Statut</label>
            <select v-model="form.statutTacheId" required class="form-input">
              <option v-for="st in statuts" :key="st.id" :value="st.id">{{ st.nom }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Deadline</label>
            <input type="datetime-local" v-model="form.date_limite" required class="form-input" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Notes / Brief</label>
          <textarea v-model="form.description" class="form-input" rows="3" placeholder="Instructions, brief créatif, liens des rushes..."></textarea>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:0.5rem;">
          <button type="button" class="btn btn-secondary" @click="modal=false">Annuler</button>
          <button type="submit" class="btn btn-primary">{{ editing ? 'Enregistrer' : 'Créer' }}</button>
        </div>
      </form>
    </Modal>
    <ConfirmModal 
      :isOpen="confirmModal.isOpen"
      :title="confirmModal.title"
      :message="confirmModal.message"
      @confirm="onConfirmExecute"
      @cancel="confirmModal.isOpen = false"
    />
    <TacheDetailModal :isOpen="detailModal" :tache="detailTache" @close="detailModal=false" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus as PlusIcon, Search as SearchIcon, Edit as EditIcon, Trash2 as TrashIcon, Eye as EyeIcon } from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })

// --- DONNÉES DYNAMIQUES DEPUIS L'API ---
const { data: taches, refresh: refreshTaches } = await useFetch('/api/taches', { query: { typeTache: 'MONTEUR' } })
const { data: editions } = await useFetch('/api/editions')
const { data: employes } = await useFetch('/api/equipe')
const { data: statuts } = await useFetch('/api/taches/statuts')

// Filtre l'équipe pour les monteurs vidéo
const monteurEquipe = computed(() => {
  if (!employes.value) return []
  return employes.value.filter(e => e.poste?.titre_poste?.includes('Monteur Vidéo'))
})

const modal = ref(false)
const editing = ref(false)
const detailModal = ref(false)
const detailTache = ref(null)
const viewDetail = (t) => { detailTache.value = t; detailModal.value = true }

// --- CONFIRMATION DYNAMICS ---
const confirmModal = ref({ isOpen: false, title: '', message: '', onConfirm: null })
const requireConfirm = (title, message, onConfirm) => {
  confirmModal.value = { isOpen: true, title, message, onConfirm }
}
const onConfirmExecute = async () => {
  if (confirmModal.value.onConfirm) await confirmModal.value.onConfirm()
  confirmModal.value.isOpen = false
}

const filters = ref({ search:'', employeId:'', statutTacheId:'' })

const defaultForm = () => {
  const defaultStatut = statuts.value?.find(s => s.niveau_progression === 0)?.id || ''
  return { 
    id:null, titre:'', employeId:'', editionId:null, statutTacheId: defaultStatut, date_limite:'',
    typeTache: 'MONTEUR', demandeur:'', description:'' 
  }
}
const form = ref(defaultForm())

const filteredTasks = computed(() => {
  if (!taches.value) return []
  return taches.value.filter(t => {
    if (filters.value.search && !t.titre.toLowerCase().includes(filters.value.search.toLowerCase()) && !t.description?.toLowerCase().includes(filters.value.search.toLowerCase())) return false
    if (filters.value.employeId && t.employeId !== filters.value.employeId) return false
    if (filters.value.statutTacheId && t.statutTacheId !== filters.value.statutTacheId) return false
    return true
  })
})

const openCreate = () => { editing.value=false; form.value=defaultForm(); modal.value=true }
const openEdit = (t) => { 
  editing.value=true; 
  const d = new Date(t.date_limite)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  const dtLocal = d.toISOString().slice(0, 16)
  
  form.value={...t, date_limite: dtLocal}; 
  modal.value=true 
}

const save = async () => {
  await $fetch('/api/taches', { method: 'POST', body: form.value })
  await refreshTaches()
  modal.value=false
}

const remove = (id) => { 
  requireConfirm('Supprimer cette tâche ?', 'Êtes-vous sûr de vouloir supprimer cette tâche vidéo ?', async () => {
    await $fetch(`/api/taches/${id}`, { method: 'DELETE' })
    await refreshTaches()
  })
}
</script>
