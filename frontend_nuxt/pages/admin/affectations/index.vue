<template>
  <div class="animate-fade-in">
    <div class="page-header">
      <div>
        <h1 class="page-title">Affectations</h1>
        <p class="page-subtitle" style="margin-bottom:0;">Assignez les collaborateurs aux pages d'événements spécifiques.</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">
        <PlusIcon :size="15" /> Nouvelle Affectation
      </button>
    </div>

    <div class="info-banner info-banner-info" style="margin-bottom:1.25rem;">
      <InfoIcon :size="16" style="margin-top:2px; flex-shrink:0;" />
      <div>
        <strong>Principe :</strong> Chaque affectation lie un collaborateur à un événement dans une ville. Un CM affecté à « JOF - Évreux » ne verra que cette page dans son espace personnel. Un collaborateur peut être affecté à plusieurs pages.
      </div>
    </div>

    <!-- Table -->
    <div class="card" style="padding:0; overflow:hidden;">
      <table class="data-table">
        <thead>
          <tr>
            <th>Collaborateur</th>
            <th>Poste</th>
            <th>Événement</th>
            <th>Ville</th>
            <th style="text-align:right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="aff in affectationsList" :key="aff.employeId + '-' + aff.editionId">
            <td style="font-weight:600;">{{ aff.collaborateur }}</td>
            <td><span class="badge badge-neutral">{{ aff.poste }}</span></td>
            <td style="font-weight:500;">{{ aff.evenement }}</td>
            <td>{{ aff.ville }}</td>
            <td style="text-align:right;">
              <div class="actions-cell">
                <button class="btn-danger-ghost" @click="remove(aff.employeId, aff.editionId)" title="Supprimer l'affectation"><TrashIcon :size="14" /></button>
              </div>
            </td>
          </tr>
          <tr v-if="affectationsList.length === 0">
            <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-secondary);">Aucune affectation trouvée.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <Modal :isOpen="modal" title="Nouvelle Affectation" @close="modal=false">
      <form @submit.prevent="save" style="display:flex; flex-direction:column; gap:1rem;">
        <div class="form-group">
          <label class="form-label">Collaborateur</label>
          <select v-model="form.employeId" required class="form-input">
            <option value="" disabled>Choisir un collaborateur</option>
            <option v-for="emp in employes" :key="emp.id" :value="emp.id">{{ emp.nom }} {{ emp.prenom }} ({{ emp.poste?.titre_poste }})</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Édition (Page)</label>
          <select v-model="form.editionId" required class="form-input">
            <option value="" disabled>Choisir une édition</option>
            <option v-for="ed in editions" :key="ed.id" :value="ed.id">{{ ed.licence?.sigle }} - {{ ed.ville?.nom_ville }}</option>
          </select>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:0.5rem;">
          <button type="button" class="btn btn-secondary" @click="modal=false">Annuler</button>
          <button type="submit" class="btn btn-primary">Affecter</button>
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
import { ref, computed } from 'vue'
import { Plus as PlusIcon, Trash2 as TrashIcon, Info as InfoIcon } from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })

// --- DONNÉES DYNAMIQUES DEPUIS L'API ---
const { data: employes, refresh: refreshEmployes } = await useFetch('/api/affectations')
const { data: editions } = await useFetch('/api/editions')

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

const form = ref({ employeId: '', editionId: '' })

// Transformer les données de l'API en une liste plate d'affectations
const affectationsList = computed(() => {
  if (!employes.value) return []
  const list = []
  employes.value.forEach(emp => {
    if (emp.editionsGerees && emp.editionsGerees.length > 0) {
      emp.editionsGerees.forEach(ed => {
        list.push({
          employeId: emp.id,
          editionId: ed.id,
          collaborateur: `${emp.prenom} ${emp.nom}`,
          poste: emp.poste?.titre_poste || 'Inconnu',
          evenement: ed.licence?.nom_complet || 'Inconnu',
          ville: ed.ville?.nom_ville || 'Inconnue'
        })
      })
    }
  })
  return list
})

const openCreate = () => { form.value = { employeId: '', editionId: '' }; modal.value = true }

const save = async () => {
  try {
    await $fetch('/api/affectations', { method: 'POST', body: form.value })
    await refreshEmployes()
    modal.value = false
  } catch (e) {
    alert("Erreur lors de l'affectation. Peut-être que cette affectation existe déjà ?")
  }
}

const remove = (employeId, editionId) => { 
  requireConfirm('Supprimer l\'Affectation', 'Êtes-vous sûr de vouloir retirer ce collaborateur de cette édition ?', async () => {
    await $fetch('/api/affectations/remove', { 
      method: 'POST', 
      body: { employeId, editionId } 
    })
    await refreshEmployes()
  })
}
</script>
