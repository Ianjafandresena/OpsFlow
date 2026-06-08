<template>
  <div class="animate-fade-in">
    <div class="page-header">
      <div>
        <h1 class="page-title">Gestion des Plateformes</h1>
        <p class="page-subtitle" style="margin-bottom:0;">Réseaux sociaux gérés par le système. Ajoutez ou retirez des plateformes selon vos besoins.</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">
        <PlusIcon :size="15" /> Ajouter une Plateforme
      </button>
    </div>

    <div class="info-banner info-banner-info" style="margin-bottom:1.25rem;">
      <InfoIcon :size="16" style="margin-top:2px; flex-shrink:0;" />
      <div>Les plateformes définies ici apparaissent dans les listes de choix lors de la planification de publications et dans les affectations de pages.</div>
    </div>

    <div class="card" style="padding:0; overflow:hidden;">
      <table class="data-table">
        <thead>
          <tr>
            <th>Nom de la Plateforme</th>
            <th>URL de Base</th>
            <th>Statut</th>
            <th style="text-align:right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in platforms" :key="p.id">
            <td style="font-weight:600;">{{ p.nom }}</td>
            <td style="color:var(--text-secondary);">{{ p.url }}</td>
            <td><span class="badge" :class="p.actif ? 'badge-success' : 'badge-neutral'">{{ p.actif ? 'Actif' : 'Inactif' }}</span></td>
            <td style="text-align:right;">
              <div class="actions-cell">
                <button class="btn btn-secondary btn-icon" @click="openEdit(p)" title="Modifier"><EditIcon :size="14" /></button>
                <button class="btn-danger-ghost" @click="remove(p.id)" title="Supprimer"><TrashIcon :size="14" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal :isOpen="modal" :title="editing ? 'Modifier la Plateforme' : 'Ajouter une Plateforme'" @close="modal=false">
      <form @submit.prevent="save" style="display:flex; flex-direction:column; gap:1rem;">
        <div class="form-group">
          <label class="form-label">Nom de la Plateforme</label>
          <input type="text" v-model="form.nom" required class="form-input" placeholder="Ex: TikTok" />
        </div>
        <div class="form-group">
          <label class="form-label">URL de Base</label>
          <input type="url" v-model="form.url" class="form-input" placeholder="https://tiktok.com" />
        </div>
        <div class="form-group">
          <label class="form-label">Statut</label>
          <select v-model="form.actif" class="form-input">
            <option :value="true">Actif</option>
            <option :value="false">Inactif</option>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus as PlusIcon, Edit as EditIcon, Trash2 as TrashIcon, Info as InfoIcon } from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })

const modal = ref(false)
const editing = ref(false)

// --- CONFIRMATION DYNAMICS ---
const confirmModal = ref({ isOpen: false, title: '', message: '', onConfirm: null })
const requireConfirm = (title, message, onConfirm) => {
  confirmModal.value = { isOpen: true, title, message, onConfirm }
}
const onConfirmExecute = async () => {
  if (confirmModal.value.onConfirm) await confirmModal.value.onConfirm()
  confirmModal.value.isOpen = false
}

const defaultForm = () => ({ id:null, nom:'', url:'', actif:true })
const form = ref(defaultForm())

const platforms = ref([
  { id:1, nom:'Facebook', url:'https://facebook.com', actif:true },
  { id:2, nom:'Instagram', url:'https://instagram.com', actif:true },
  { id:3, nom:'X (Twitter)', url:'https://x.com', actif:false }
])

const openCreate = () => { editing.value=false; form.value=defaultForm(); modal.value=true }
const openEdit = (p) => { editing.value=true; form.value={...p}; modal.value=true }

const save = () => {
  if (editing.value) {
    const i = platforms.value.findIndex(p=>p.id===form.value.id)
    if (i!==-1) platforms.value[i] = {...form.value}
  } else {
    platforms.value.push({...form.value, id:Date.now()})
  }
  modal.value=false
}

const remove = (id) => { 
  requireConfirm('Supprimer cette plateforme ?', 'Êtes-vous sûr de vouloir supprimer cette plateforme ?', () => {
    platforms.value = platforms.value.filter(p => p.id !== id)
  })
}
</script>
