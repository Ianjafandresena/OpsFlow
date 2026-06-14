<template>
  <div class="animate-fade-in">
    <div class="page-header">
      <div>
        <h1 class="page-title">Équipe & Rôles</h1>
        <p class="page-subtitle" style="margin-bottom:0;">Gestion des collaborateurs, postes et niveaux d'accès.</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">
        <PlusIcon :size="15" /> Ajouter un Collaborateur
      </button>
    </div>

    <!-- Filters -->
    <div class="card toolbar" style="margin-bottom:1.25rem;">
      <div class="search-wrapper">
        <SearchIcon class="search-icon" :size="14" />
        <input type="text" v-model="filters.search" placeholder="Rechercher un collaborateur..." class="form-input" />
      </div>
      <select v-model="filters.poste" class="form-input">
        <option value="">Tous les Postes</option>
        <option v-for="p in postes" :key="p.id" :value="p.id">{{ p.titre_poste }}</option>
      </select>
      <select v-model="filters.role" class="form-input">
        <option value="">Tous Rôles Système</option>
        <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.niveau_acces }}</option>
      </select>
    </div>

    <!-- Table -->
    <div class="card" style="padding:0; overflow:hidden;">
      <table class="data-table">
        <thead>
          <tr>
            <th>Nom Complet</th>
            <th>Email</th>
            <th>Poste</th>
            <th>Département</th>
            <th>Rôle Système</th>
            <th style="text-align:right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="emp in filteredTeam" :key="emp.id">
            <td style="font-weight:600;">
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <div style="width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.65rem; font-weight:600; color:white; background: #4f46e5;">
                  {{ emp.prenom[0] }}{{ emp.nom[0] }}
                </div>
                {{ emp.nom }} {{ emp.prenom }}
              </div>
            </td>
            <td style="color:var(--text-secondary);">{{ emp.email }}</td>
            <td style="font-weight:500;">{{ emp.poste?.titre_poste }}</td>
            <td><span class="badge badge-neutral">{{ emp.poste?.departement?.nom_departement }}</span></td>
            <td>
              <span class="badge" :class="emp.role?.niveau_acces === 'ADMIN' ? 'badge-danger' : 'badge-info'">{{ emp.role?.niveau_acces }}</span>
            </td>
            <td style="text-align:right;">
              <div class="actions-cell">
                <button class="btn btn-secondary btn-icon" @click="openJournal(emp)" title="Journal du jour">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-clock"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h5"/><path d="M17.5 17.5 16 16.3V14"/><circle cx="16" cy="16" r="6"/></svg>
                </button>
                <button class="btn btn-secondary btn-icon" @click="openEdit(emp)" title="Modifier"><EditIcon :size="14" /></button>
                <button class="btn-danger-ghost" @click="remove(emp.id)" title="Supprimer"><TrashIcon :size="14" /></button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredTeam.length === 0">
            <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">Aucun collaborateur trouvé.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal CRUD -->
    <Modal :isOpen="modal" :title="editing ? 'Modifier le Collaborateur' : 'Ajouter un Collaborateur'" @close="modal=false">
      <form @submit.prevent="save" style="display:flex; flex-direction:column; gap:1rem;">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
          <div class="form-group">
            <label class="form-label">Nom</label>
            <input type="text" v-model="form.nom" required class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Prénom</label>
            <input type="text" v-model="form.prenom" required class="form-input" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" v-model="form.email" required class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Poste</label>
          <select v-model="form.posteId" required class="form-input">
            <option v-for="p in postes" :key="p.id" :value="p.id">{{ p.titre_poste }} ({{ p.departement?.nom_departement }})</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Rôle Système (Niveau d'accès)</label>
          <select v-model="form.roleId" required class="form-input">
            <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.niveau_acces }}</option>
          </select>
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

    <!-- Modal Journal du Jour -->
    <Modal :isOpen="journalModal.isOpen" :title="'Journal du jour : ' + journalModal.employeName" @close="journalModal.isOpen=false" :maxWidth="'700px'">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <button class="btn btn-secondary btn-sm" @click="changeJournalDate(-1)">
            &larr; Jour préc.
          </button>
          <input type="date" v-model="journalModal.dateStr" class="form-input" style="width:140px; padding:0.25rem 0.5rem; font-size:0.875rem;" @change="fetchJournal(journalModal.employeId, journalModal.dateStr)" />
          <button class="btn btn-secondary btn-sm" @click="changeJournalDate(1)">
            Jour suiv. &rarr;
          </button>
        </div>
        <button class="btn btn-secondary btn-sm" @click="fetchJournal(journalModal.employeId, new Date().toISOString().split('T')[0])">
          Aujourd'hui
        </button>
      </div>

      <div v-if="journalModal.loading" style="text-align:center; padding:3rem; color:var(--text-secondary);">
        Chargement du journal...
      </div>
      <div v-else-if="journalModal.tasks.length === 0" style="text-align:center; padding:3rem; color:var(--text-secondary); background:var(--bg-surface-hover); border-radius:8px;">
        Aucune activité enregistrée pour cette journée.
      </div>
      <div v-else style="display:flex; flex-direction:column; gap:0.75rem;">
        <div v-for="task in journalModal.tasks" :key="task.id" class="card" style="padding:1rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; align-items:flex-start;">
            <div>
              <h4 style="margin-bottom:0.25rem;">{{ task.titre }}</h4>
              <div style="font-size:0.75rem; color:var(--text-secondary);">
                {{ task.edition ? task.edition.licence?.sigle + ' - ' + task.edition.ville?.nom_ville : 'Tâche Générale' }}
                &bull; {{ task.typeTache }}
              </div>
            </div>
            <span class="badge" 
                  :class="[
                    'badge',
                    task.statutTache?.libelle === 'À faire' ? 'badge-neutral' :
                    task.statutTache?.libelle === 'En cours' ? 'badge-info' :
                    task.statutTache?.libelle === 'En attente' ? 'badge-warning' :
                    (task.statutTache?.libelle === 'Terminé' || task.statutTache?.libelle === 'Publié') ? 'badge-success' :
                    'badge-neutral'
                  ]">
              {{ task.statutTache?.libelle || 'Inconnu' }}
            </span>
          </div>
          <div style="font-size:0.8125rem; color:var(--text-primary); margin-bottom:0.5rem;">
             {{ task.description || 'Aucune description' }}
          </div>
          <div style="font-size:0.75rem; color:var(--text-muted); display:flex; gap:1rem;">
            <span><strong>Créée :</strong> {{ new Date(task.createdAt).toLocaleString([], { hour: '2-digit', minute:'2-digit' }) }}</span>
            <span><strong>Deadline :</strong> {{ new Date(task.date_limite).toLocaleString([], { hour: '2-digit', minute:'2-digit' }) }}</span>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus as PlusIcon, Search as SearchIcon, Edit as EditIcon, Trash2 as TrashIcon } from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })

// --- DONNÉES DYNAMIQUES DEPUIS L'API ---
const { data: roles } = await useFetch('/api/roles')
const { data: postes } = await useFetch('/api/postes')
const { data: employes, refresh: refreshEmployes } = await useFetch('/api/equipe')

// --- CONFIRMATION DYNAMICS ---
const confirmModal = ref({ isOpen: false, title: '', message: '', onConfirm: null })
const requireConfirm = (title, message, onConfirm) => {
  confirmModal.value = { isOpen: true, title, message, onConfirm }
}
const onConfirmExecute = async () => {
  if (confirmModal.value.onConfirm) await confirmModal.value.onConfirm()
  confirmModal.value.isOpen = false
}

const modal = ref(false)
const editing = ref(false)
const filters = ref({ search: '', poste: '', role: '' })

// Journal modal state
const journalModal = ref({
  isOpen: false,
  loading: false,
  employeId: null,
  employeName: '',
  dateStr: new Date().toISOString().split('T')[0],
  tasks: []
})

const fetchJournal = async (empId, dateStr) => {
  journalModal.value.loading = true
  journalModal.value.employeId = empId
  journalModal.value.dateStr = dateStr
  try {
    const data = await $fetch(`/api/employes/${empId}/journal?date=${dateStr}`)
    journalModal.value.tasks = data.taches || []
  } catch(e) {
    console.error(e)
    journalModal.value.tasks = []
  } finally {
    journalModal.value.loading = false
  }
}

const openJournal = (emp) => {
  journalModal.value.employeName = emp.nom + ' ' + emp.prenom
  journalModal.value.isOpen = true
  const today = new Date().toISOString().split('T')[0]
  fetchJournal(emp.id, today)
}

const changeJournalDate = (daysOffset) => {
  const d = new Date(journalModal.value.dateStr)
  d.setDate(d.getDate() + daysOffset)
  const newDate = d.toISOString().split('T')[0]
  fetchJournal(journalModal.value.employeId, newDate)
}

const defaultForm = () => ({ id: null, nom: '', prenom: '', email: '', posteId: '', roleId: '' })
const form = ref(defaultForm())

const filteredTeam = computed(() => {
  if (!employes.value) return []
  return employes.value.filter(e => {
    if (filters.value.search && !(e.nom+' '+e.prenom).toLowerCase().includes(filters.value.search.toLowerCase())) return false
    if (filters.value.poste && e.posteId !== filters.value.poste) return false
    if (filters.value.role && e.roleId !== filters.value.role) return false
    return true
  })
})

const openCreate = () => { editing.value = false; form.value = defaultForm(); modal.value = true }
const openEdit = (e) => { editing.value = true; form.value = { ...e }; modal.value = true }

const save = async () => {
  await $fetch('/api/equipe', { method: 'POST', body: form.value })
  await refreshEmployes()
  modal.value = false
}

const remove = (id) => { 
  requireConfirm('Supprimer le Collaborateur', 'Êtes-vous sûr de vouloir supprimer ce collaborateur ?', async () => {
    await $fetch(`/api/equipe/${id}`, { method: 'DELETE' })
    await refreshEmployes()
  })
}
</script>
