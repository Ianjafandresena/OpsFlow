<template>
  <div class="animate-fade-in" v-if="myEmployeInfo">
    <div class="page-header">
      <div>
        <h1 class="page-title">Mon Profil</h1>
        <p class="page-subtitle" style="margin-bottom:0;">Vos informations personnelles.</p>
      </div>
      <button class="btn btn-primary" @click="openEdit"><EditIcon :size="14" /> Modifier le profil</button>
    </div>

    <div style="display:grid; grid-template-columns:1fr 2fr; gap:1.5rem;">
      <!-- Avatar card -->
      <div class="card" style="text-align:center; display:flex; flex-direction:column; align-items:center; gap:1rem; padding:2rem;">
        <div style="width:80px; height:80px; border-radius:50%; background:var(--accent-blue); display:flex; align-items:center; justify-content:center; color:white; font-size:1.75rem; font-weight:700;">
          {{ initials }}
        </div>
        <div>
          <h2 style="font-size:1.125rem;">{{ myEmployeInfo.prenom }} {{ myEmployeInfo.nom }}</h2>
          <p style="color:var(--text-secondary); font-size:0.8125rem;">{{ myEmployeInfo.poste?.titre_poste }}</p>
        </div>
        <span class="badge badge-info">{{ myEmployeInfo.role?.niveau_acces }}</span>
      </div>

      <!-- Info card -->
      <div class="card">
        <h3 style="font-size:0.9375rem; font-weight:600; margin-bottom:1.25rem;">Informations du Compte</h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem;">
          <div>
            <div class="form-label" style="margin-bottom:0.25rem;">Nom</div>
            <div style="font-weight:500;">{{ myEmployeInfo.nom }}</div>
          </div>
          <div>
            <div class="form-label" style="margin-bottom:0.25rem;">Prénom</div>
            <div style="font-weight:500;">{{ myEmployeInfo.prenom }}</div>
          </div>
          <div>
            <div class="form-label" style="margin-bottom:0.25rem;">Email</div>
            <div style="font-weight:500;">{{ myEmployeInfo.email }}</div>
          </div>
          <div>
            <div class="form-label" style="margin-bottom:0.25rem;">Poste</div>
            <div style="font-weight:500;">{{ myEmployeInfo.poste?.titre_poste }}</div>
          </div>
          <div>
            <div class="form-label" style="margin-bottom:0.25rem;">Département</div>
            <div style="font-weight:500;">{{ myEmployeInfo.poste?.departement?.nom_departement || 'Non assigné' }}</div>
          </div>
        </div>

        <div style="border-top:1px solid var(--border-light); margin-top:1.5rem; padding-top:1.25rem;">
          <h3 style="font-size:0.9375rem; font-weight:600; margin-bottom:1rem;">Pages Assignées</h3>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <div v-for="ed in myEmployeInfo.editionsGerees" :key="ed.id" style="border:1px solid var(--border-light); border-radius:6px; padding:0.5rem 0.75rem;">
              <div style="font-weight:600; font-size:0.8125rem;">{{ ed.licence?.sigle }} - {{ ed.ville?.nom_ville }}</div>
              <div style="font-size:0.6875rem; color:var(--text-secondary);">Manager</div>
            </div>
            <div v-if="!myEmployeInfo.editionsGerees || myEmployeInfo.editionsGerees.length === 0" style="font-size:0.8125rem; color:var(--text-secondary); width:100%;">
              Aucune page assignée pour le moment.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit modal -->
    <Teleport to="body">
      <div v-if="showEditModal" class="modal-overlay">
        <div class="modal-box">
          <div class="modal-header">
            <h3 class="modal-title">Modifier mon profil</h3>
            <button class="modal-close" @click="showEditModal=false"><XIcon :size="16" /></button>
          </div>
          <div class="modal-body">
            <div v-if="saveError" class="error-banner">{{ saveError }}</div>
            <div class="form-group">
              <label class="form-label">Prénom *</label>
              <input v-model="editForm.prenom" type="text" class="form-input" placeholder="Prénom" />
            </div>
            <div class="form-group">
              <label class="form-label">Nom *</label>
              <input v-model="editForm.nom" type="text" class="form-input" placeholder="Nom" />
            </div>
            <div class="form-group">
              <label class="form-label">Email *</label>
              <input v-model="editForm.email" type="email" class="form-input" placeholder="email@exemple.com" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showEditModal=false">Annuler</button>
            <button class="btn btn-primary" :disabled="saving || !editForm.prenom || !editForm.nom || !editForm.email" @click="saveProfile">
              <span v-if="saving" class="spinner-xs"></span>
              {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Edit as EditIcon, X as XIcon } from 'lucide-vue-next'

definePageMeta({ layout: 'employe' })

const { user, fetchMe } = useAuth()
const myEmployeInfo = computed(() => user.value)

const initials = computed(() => {
  if (myEmployeInfo.value) {
    return `${myEmployeInfo.value.prenom.charAt(0)}${myEmployeInfo.value.nom.charAt(0)}`.toUpperCase()
  }
  return 'EM'
})

const showEditModal = ref(false)
const saving = ref(false)
const saveError = ref('')
const editForm = ref({ prenom: '', nom: '', email: '' })

const openEdit = () => {
  editForm.value = {
    prenom: myEmployeInfo.value?.prenom || '',
    nom: myEmployeInfo.value?.nom || '',
    email: myEmployeInfo.value?.email || ''
  }
  saveError.value = ''
  showEditModal.value = true
}

const saveProfile = async () => {
  if (!myEmployeInfo.value?.id) return
  saving.value = true
  saveError.value = ''
  try {
    await $fetch(`/api/equipe/${myEmployeInfo.value.id}`, {
      method: 'PUT',
      body: { nom: editForm.value.nom, prenom: editForm.value.prenom, email: editForm.value.email }
    })
    await fetchMe()
    showEditModal.value = false
  } catch (e) {
    saveError.value = e?.data?.statusMessage || 'Erreur lors de la mise à jour.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.modal-overlay { position:fixed; inset:0; z-index:10000; background:rgba(0,0,0,0.6); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; padding:1rem; box-sizing:border-box; }
.modal-box { background:var(--bg-surface); border-radius:16px; width:100%; max-width:440px; box-shadow:0 24px 60px rgba(0,0,0,0.3); overflow:hidden; display:flex; flex-direction:column; max-height:calc(100vh - 2rem); }
.modal-header { display:flex; align-items:center; justify-content:space-between; padding:1.25rem 1.5rem; border-bottom:1px solid var(--border-light); }
.modal-title { font-size:1rem; font-weight:700; }
.modal-close { background:none; border:none; cursor:pointer; color:var(--text-muted); padding:0.25rem; border-radius:4px; }
.modal-close:hover { color:var(--text-primary); background:var(--bg-surface-hover); }
.modal-body { padding:1.5rem; display:flex; flex-direction:column; gap:1rem; overflow-y:auto; }
.modal-footer { padding:1rem 1.5rem; border-top:1px solid var(--border-light); display:flex; justify-content:flex-end; gap:0.5rem; }
.form-group { display:flex; flex-direction:column; gap:0.375rem; }
.form-label { font-size:0.8125rem; font-weight:600; color:var(--text-primary); }
.error-banner { background:#fef2f2; border:1px solid #fecaca; border-radius:8px; padding:0.75rem 1rem; color:#dc2626; font-size:0.8125rem; }
.spinner-xs { width:14px; height:14px; border-radius:50%; border:2px solid rgba(255,255,255,0.3); border-top-color:white; animation:spin 0.8s linear infinite; display:inline-block; }
@keyframes spin { to { transform:rotate(360deg); } }

@media (max-width: 768px) {
  div[style*="grid-template-columns:1fr 2fr"] { grid-template-columns:1fr !important; }
  .modal-overlay { padding:0.5rem; align-items:flex-end; }
  .modal-box { max-width:100%; border-radius:16px 16px 0 0; }
}
</style>
