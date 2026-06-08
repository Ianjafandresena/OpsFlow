<template>
  <div class="animate-fade-in" style="display:flex; flex-direction:column; gap:3rem;">
    
    <!-- SECTION CALENDRIER DES ÉVÉNEMENTS -->
    <section>
      <div class="page-header">
        <div>
          <h1 class="page-title">Éditions Planifiées (Projets/Pages)</h1>
          <p class="page-subtitle" style="margin-bottom: 0;">Planifiez une édition en associant une Licence et une Ville.</p>
        </div>
        <button class="btn btn-primary" @click="openCreate">
          <PlusIcon :size="15" /> Planifier une édition
        </button>
      </div>

      <div class="card" style="padding:0; overflow:hidden;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Type d'événement</th>
              <th>Ville / Page concernée</th>
              <th>Dates</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ev in editions" :key="ev.id">
              <td style="font-weight: 600;">
                 <span class="badge badge-neutral" style="font-weight:600;">{{ getTypeName(ev.typeId) }}</span>
              </td>
              <td style="font-weight: 500; font-size:0.9375rem;">{{ getPageName(ev) }}</td>
              <td style="color: var(--text-secondary);">
                <div style="display:flex; align-items:center; gap:0.375rem;">
                  <CalendarIcon :size="14" /> {{ formatDate(ev.date_debut) }} au {{ formatDate(ev.date_fin) }}
                </div>
              </td>
              <td style="text-align: right;">
                <div class="actions-cell">
                  <button class="btn btn-secondary btn-icon" @click="openEdit(ev)" title="Modifier"><EditIcon :size="14" /></button>
                  <button class="btn-danger-ghost" @click="remove(ev.id)" title="Supprimer"><TrashIcon :size="14" /></button>
                </div>
              </td>
            </tr>
            <tr v-if="editions.length===0">
               <td colspan="4" style="text-align:center; padding:2rem; color:var(--text-secondary);">Aucun événement planifié.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- SECTION CONFIGURATION DE BASE (LICENCES ET VILLES) -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:2rem;">
      
      <!-- LICENCES -->
      <section>
        <div class="page-header" style="margin-bottom:1rem;">
          <div>
            <h2 class="page-title" style="font-size:1.1rem;">Types d'Événements</h2>
            <p class="page-subtitle" style="margin-bottom:0; font-size:0.8rem;">Gérez les licences (ex: JOF, JMW).</p>
          </div>
          <button class="btn btn-secondary" style="font-size:0.8rem; padding:0.3rem 0.6rem;" @click="openTypeCreate">
            <PlusIcon :size="14" /> Ajouter
          </button>
        </div>
        <div class="card" style="padding:0; overflow:hidden;">
          <table class="data-table">
            <thead><tr><th>Nom & Sigle</th><th style="text-align: right;">Actions</th></tr></thead>
            <tbody>
              <tr v-for="t in typesEv" :key="t.id">
                <td style="font-weight: 600;">{{ t.nom_complet }} <span style="color:var(--text-secondary); font-size:0.8rem;">({{ t.sigle }})</span></td>
                <td style="text-align: right;">
                  <button class="btn-danger-ghost" @click="removeType(t.id)" title="Supprimer" style="padding:0.25rem;"><TrashIcon :size="14" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- VILLES -->
      <section>
        <div class="page-header" style="margin-bottom:1rem;">
          <div>
            <h2 class="page-title" style="font-size:1.1rem;">Villes</h2>
            <p class="page-subtitle" style="margin-bottom:0; font-size:0.8rem;">Gérez la liste des villes.</p>
          </div>
          <button class="btn btn-secondary" style="font-size:0.8rem; padding:0.3rem 0.6rem;" @click="openVilleCreate">
            <PlusIcon :size="14" /> Ajouter
          </button>
        </div>
        <div class="card" style="padding:0; overflow:hidden;">
          <table class="data-table">
            <thead><tr><th>Nom de la ville</th><th style="text-align: right;">Actions</th></tr></thead>
            <tbody>
              <tr v-for="v in villes" :key="v.id">
                <td style="font-weight: 600;">{{ v.nom_ville }}</td>
                <td style="text-align: right;">
                  <button class="btn-danger-ghost" @click="removeVille(v.id)" title="Supprimer" style="padding:0.25rem;"><TrashIcon :size="14" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>

    <!-- SECTION THÈMES DE PUBLICATION -->
    <section>
      <div class="page-header">
        <div>
          <h2 class="page-title">Thèmes de Publication</h2>
          <p class="page-subtitle" style="margin-bottom: 0;">Gérez les sujets par défaut pour les posts et les sponsorisations.</p>
        </div>
        <button class="btn btn-primary" @click="openThemeCreate">
          <PlusIcon :size="15" /> Ajouter un Thème
        </button>
      </div>

      <div class="card" style="padding:0; overflow:hidden; max-width: 600px;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nom du Thème (Sujet)</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in themes" :key="t.id">
              <td style="font-weight: 600;">{{ t.nom_theme }}</td>
              <td style="text-align: right;">
                <div class="actions-cell">
                  <button class="btn btn-secondary btn-icon" @click="openThemeEdit(t)" title="Modifier"><EditIcon :size="14" /></button>
                  <button class="btn-danger-ghost" @click="removeTheme(t.id)" title="Supprimer"><TrashIcon :size="14" /></button>
                </div>
              </td>
            </tr>
            <tr v-if="themes.length===0">
               <td colspan="2" style="text-align:center; padding:2rem; color:var(--text-secondary);">Aucun thème configuré.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Modal CRUD ÉDITION -->
    <Modal :isOpen="modal" :title="editing ? 'Modifier l\'édition' : 'Planifier une édition'" @close="modal = false">
      <form @submit.prevent="save" style="display: flex; flex-direction: column; gap: 1rem;">
        <div class="form-group">
          <label class="form-label">Type d'événement</label>
          <select v-model="form.licenceId" required class="form-input">
            <option v-for="t in typesEv" :key="t.id" :value="t.id">{{ t.nom_complet }} ({{ t.sigle }})</option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">Ville d'accueil</label>
          <select v-model="form.villeId" required class="form-input">
            <option v-for="v in villes" :key="v.id" :value="v.id">{{ v.nom_ville }}</option>
          </select>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
          <div class="form-group">
            <label class="form-label">Date de début</label>
            <input type="date" v-model="form.date_debut" required class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Date de fin</label>
            <input type="date" v-model="form.date_fin" required class="form-input" />
          </div>
        </div>

        <div class="form-group" style="margin-top:1rem; padding:1rem; background:var(--bg-background); border-radius:8px;">
          <label style="font-size:0.75rem; color:var(--text-secondary);">Nom de la Page généré :</label>
          <div style="font-weight:bold; font-size:1.1rem; color:var(--accent-primary);">
            {{ getPreviewPageName() }}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" style="display:flex; align-items:center; gap:0.5rem;">
            ID de la page Meta (Facebook/Instagram) 
            <span class="badge" style="background:#1877f215; color:#1877f2; font-size:0.6rem; padding:0.15rem 0.35rem;">Optionnel</span>
          </label>
          <input type="text" v-model="form.metaPageId" class="form-input" placeholder="Ex: 1040738735799993" />
          <div style="font-size:0.7rem; color:var(--text-muted); margin-top:0.25rem;">Permet à l'agent IA de récupérer les statistiques de cette page.</div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem;">
          <button type="button" class="btn btn-secondary" @click="modal = false">Annuler</button>
          <button type="submit" class="btn btn-primary">{{ editing ? 'Enregistrer' : 'Planifier' }}</button>
        </div>
      </form>
    </Modal>

    <!-- Modal CRUD TYPE EV -->
    <Modal :isOpen="modalType" title="Ajouter une Licence" @close="modalType = false">
      <form @submit.prevent="saveType" style="display: flex; flex-direction: column; gap: 1rem;">
        <div class="form-group">
          <label class="form-label">Nom Complet</label>
          <input type="text" v-model="formType.nom_complet" required class="form-input" placeholder="Ex: Japan Otaku Festival" />
        </div>
        <div class="form-group">
          <label class="form-label">Sigle</label>
          <input type="text" v-model="formType.sigle" required class="form-input" placeholder="Ex: JOF" />
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem;">
          <button type="submit" class="btn btn-primary">Créer</button>
        </div>
      </form>
    </Modal>

    <!-- Modal CRUD VILLE -->
    <Modal :isOpen="modalVille" title="Ajouter une Ville" @close="modalVille = false">
      <form @submit.prevent="saveVille" style="display: flex; flex-direction: column; gap: 1rem;">
        <div class="form-group">
          <label class="form-label">Nom de la Ville</label>
          <input type="text" v-model="formVille.nom_ville" required class="form-input" placeholder="Ex: Paris" />
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem;">
          <button type="submit" class="btn btn-primary">Créer</button>
        </div>
      </form>
    </Modal>

    <!-- Modal CRUD THEME -->
    <Modal :isOpen="modalTheme" :title="editingTheme ? 'Modifier le Thème' : 'Nouveau Thème'" @close="modalTheme = false">
      <form @submit.prevent="saveTheme" style="display: flex; flex-direction: column; gap: 1rem;">
        <div class="form-group">
          <label class="form-label">Nom du Thème</label>
          <input type="text" v-model="formTheme.nom_theme" required class="form-input" placeholder="Ex: Pass VIP, Annonce, Concours..." />
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem;">
          <button type="button" class="btn btn-secondary" @click="modalTheme = false">Annuler</button>
          <button type="submit" class="btn btn-primary">{{ editingTheme ? 'Enregistrer' : 'Créer' }}</button>
        </div>
      </form>
    </Modal>
    <!-- Modal de confirmation globale -->
    <ConfirmModal 
      :isOpen="confirmModal.isOpen"
      :title="confirmModal.title"
      :message="confirmModal.message"
      @confirm="onConfirmExecute"
      @cancel="confirmModal.isOpen = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus as PlusIcon, Edit as EditIcon, Trash2 as TrashIcon, Calendar as CalendarIcon } from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })

// --- DONNÉES DE BASE (API) ---
const { data: typesEv, refresh: refreshTypes } = await useFetch('/api/licences')
const { data: villes, refresh: refreshVilles } = await useFetch('/api/villes')
const { data: editions, refresh: refreshEditions } = await useFetch('/api/editions')
const { data: themes, refresh: refreshThemes } = await useFetch('/api/themes')

// --- Helpers pour l'affichage ---
const getTypeName = (tid) => {
  const t = typesEv.value?.find(x => x.id === tid)
  return t ? `${t.nom_complet} (${t.sigle})` : 'Inconnu'
}
const getPageName = (ev) => {
  const t = typesEv.value?.find(x => x.id === ev.licenceId)
  const v = villes.value?.find(x => x.id === ev.villeId)
  if (t && v) return `${t.sigle} - ${v.nom_ville}`
  return 'Page Inconnue'
}
const getPreviewPageName = () => {
  if (!form.value.licenceId || !form.value.villeId) return '...'
  return getPageName(form.value)
}

const formatDate = (dateStr) => {
  if (!dateStr) return '?'
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

const formatDateForInput = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toISOString().split('T')[0]
}

// --- CONFIRMATION DYNAMICS ---
const confirmModal = ref({ isOpen: false, title: '', message: '', onConfirm: null })

const requireConfirm = (title, message, onConfirm) => {
  confirmModal.value = { isOpen: true, title, message, onConfirm }
}

const onConfirmExecute = async () => {
  if (confirmModal.value.onConfirm) {
    await confirmModal.value.onConfirm()
  }
  confirmModal.value.isOpen = false
}

// --- CRUD ÉDITIONS ---
const modal = ref(false)
const editing = ref(false)
const defaultForm = () => ({ id: null, licenceId: '', villeId: '', date_debut: '', date_fin: '', metaPageId: '' })
const form = ref(defaultForm())

const openCreate = () => { editing.value = false; form.value = defaultForm(); modal.value = true }
const openEdit = (ev) => { 
  editing.value = true; 
  form.value = { 
    ...ev, 
    date_debut: formatDateForInput(ev.date_debut), 
    date_fin: formatDateForInput(ev.date_fin) 
  }
  modal.value = true 
}

const save = async () => {
  await $fetch('/api/editions', { method: 'POST', body: form.value })
  await refreshEditions()
  modal.value = false
}

const remove = (id) => {
  requireConfirm('Supprimer l\'édition', 'Êtes-vous sûr de vouloir supprimer cette édition planifiée ?', async () => {
    await $fetch(`/api/editions/${id}`, { method: 'DELETE' })
    await refreshEditions()
  })
}

// --- CRUD TYPES D'ÉVÉNEMENTS (LICENCES) ---
const modalType = ref(false)
const formType = ref({ nom_complet: '', sigle: '' })

const openTypeCreate = () => { formType.value = { nom_complet: '', sigle: '' }; modalType.value = true }
const saveType = async () => {
  await $fetch('/api/licences', { method: 'POST', body: formType.value })
  await refreshTypes()
  modalType.value = false
}
const removeType = (id) => {
  requireConfirm('Supprimer la Licence', 'Supprimer ce type d\'événement ? Les éditions associées pourraient être affectées.', async () => {
    await $fetch(`/api/licences/${id}`, { method: 'DELETE' })
    await refreshTypes()
  })
}

// --- CRUD VILLES ---
const modalVille = ref(false)
const formVille = ref({ nom_ville: '' })

const openVilleCreate = () => { formVille.value = { nom_ville: '' }; modalVille.value = true }
const saveVille = async () => {
  await $fetch('/api/villes', { method: 'POST', body: formVille.value })
  await refreshVilles()
  modalVille.value = false
}
const removeVille = (id) => {
  requireConfirm('Supprimer la Ville', 'Êtes-vous sûr de vouloir supprimer cette ville ?', async () => {
    await $fetch(`/api/villes/${id}`, { method: 'DELETE' })
    await refreshVilles()
  })
}

// --- CRUD THÈMES DE PUBLICATION ---
const modalTheme = ref(false)
const editingTheme = ref(false)
const defaultFormTheme = () => ({ id: null, nom_theme: '' })
const formTheme = ref(defaultFormTheme())

const openThemeCreate = () => { editingTheme.value = false; formTheme.value = defaultFormTheme(); modalTheme.value = true }
const openThemeEdit = (t) => { editingTheme.value = true; formTheme.value = { ...t }; modalTheme.value = true }

const saveTheme = async () => {
  await $fetch('/api/themes', { method: 'POST', body: formTheme.value })
  await refreshThemes()
  modalTheme.value = false
}

const removeTheme = (id) => {
  requireConfirm('Supprimer le Thème', 'Êtes-vous sûr de vouloir supprimer ce thème ?', async () => {
    await $fetch(`/api/themes/${id}`, { method: 'DELETE' })
    await refreshThemes()
  })
}
</script>

<style scoped>
</style>
