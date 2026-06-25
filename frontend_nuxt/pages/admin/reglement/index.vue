<template>
  <div class="animate-fade-in">
    <!-- Header -->
    <div class="page-header" style="margin-bottom:1.5rem;">
      <div>
        <h1 class="page-title" style="display:flex; align-items:center; gap:0.625rem;">
          <span class="reg-badge"><ScrollTextIcon :size="16" /></span>
          Règlements
        </h1>
        <p class="page-subtitle" style="margin-bottom:0;">Gérer les règlements internes et les assigner aux employés</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">
        <PlusIcon :size="14" /> Nouveau Règlement
      </button>
    </div>

    <!-- Tabs -->
    <div class="tab-bar">
      <button class="tab-btn" :class="{ 'tab-btn-active': tab === 'reglements' }" @click="tab = 'reglements'">
        <ListIcon :size="14" /> Règlements
      </button>
      <button class="tab-btn" :class="{ 'tab-btn-active': tab === 'par-employe' }" @click="tab = 'par-employe'">
        <UsersIcon :size="14" /> Par Employé
      </button>
    </div>

    <!-- Tab: Règlements -->
    <div v-if="tab === 'reglements'">
      <div v-if="loading" class="loading-state">
        <div class="spinner-sm"></div><span>Chargement...</span>
      </div>
      <div v-else-if="reglements.length === 0" class="empty-state">
        <ScrollTextIcon :size="32" style="color:var(--text-muted); margin-bottom:0.5rem;" />
        <p style="font-weight:600;">Aucun règlement créé</p>
        <p style="color:var(--text-secondary); font-size:0.875rem;">Créez votre premier règlement pour commencer</p>
        <button class="btn btn-primary" @click="openCreate" style="margin-top:0.75rem;"><PlusIcon :size="13" /> Créer un règlement</button>
      </div>
      <div v-else class="reg-grid">
        <div v-for="r in reglements" :key="r.id" class="reg-card">
          <div class="reg-card-header">
            <div class="reg-card-title">{{ r.titre }}</div>
            <div style="display:flex; gap:0.35rem;">
              <button class="icon-btn" @click="openEdit(r)" title="Modifier"><EditIcon :size="14" /></button>
              <button class="icon-btn icon-btn-danger" @click="confirmDelete(r)" title="Supprimer"><TrashIcon :size="14" /></button>
            </div>
          </div>
          <div class="reg-card-content">{{ r.contenu }}</div>
          <div class="reg-card-footer">
            <span style="font-size:0.7rem; color:var(--text-muted); margin-right:0.5rem;">Assigné à :</span>
            <template v-if="r.employes.length === 0">
              <span class="emp-chip emp-chip-none">Personne</span>
            </template>
            <template v-else>
              <span v-for="re in r.employes" :key="re.employe.id" class="emp-chip">
                {{ re.employe.prenom }} {{ re.employe.nom }}
              </span>
            </template>
          </div>
          <div style="font-size:0.65rem; color:var(--text-muted); margin-top:0.5rem;">
            Créé le {{ new Date(r.createdAt).toLocaleDateString('fr-FR') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Tab: Par Employé -->
    <div v-if="tab === 'par-employe'">
      <div class="card" style="padding:1.25rem; margin-bottom:1.25rem;">
        <div class="form-group">
          <label class="form-label">Sélectionner un employé</label>
          <select v-model="selectedEmployeId" class="form-input" style="max-width:320px;">
            <option value="">-- Choisir un employé --</option>
            <option v-for="e in employes" :key="e.id" :value="e.id">{{ e.prenom }} {{ e.nom }} — {{ e.poste?.titre_poste }}</option>
          </select>
        </div>
      </div>

      <div v-if="selectedEmployeId" class="reg-grid">
        <div v-for="r in reglements" :key="r.id" class="reg-card">
          <div class="reg-card-header">
            <div class="reg-card-title">{{ r.titre }}</div>
            <label class="toggle-label" :title="isAssigned(r, selectedEmployeId) ? 'Retirer' : 'Assigner'">
              <input type="checkbox" :checked="isAssigned(r, selectedEmployeId)" @change="toggleAssignment(r, selectedEmployeId)" />
              <span class="toggle-track"></span>
            </label>
          </div>
          <div class="reg-card-content">{{ r.contenu }}</div>
          <div v-if="isAssigned(r, selectedEmployeId)" class="assigned-badge">Assigné</div>
        </div>
      </div>
      <div v-else class="empty-state">
        <UsersIcon :size="32" style="color:var(--text-muted); margin-bottom:0.5rem;" />
        <p style="color:var(--text-secondary);">Sélectionnez un employé pour gérer ses règlements</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-box modal-box-lg">
          <div class="modal-header">
            <h3 class="modal-title">{{ editing ? 'Modifier le Règlement' : 'Nouveau Règlement' }}</h3>
            <button class="modal-close" @click="closeModal"><XIcon :size="16" /></button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Titre *</label>
              <input v-model="form.titre" type="text" class="form-input" placeholder="Ex: Politique de confidentialité..." />
            </div>
            <div class="form-group">
              <label class="form-label">Contenu *</label>
              <textarea v-model="form.contenu" class="form-input" rows="8" placeholder="Rédigez le règlement ici..." style="resize:vertical;"></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Assigner à des employés</label>
              <div class="emp-multiselect">
                <label v-for="e in employes" :key="e.id" class="emp-check-item">
                  <input type="checkbox" :value="e.id" v-model="form.employeIds" />
                  <div class="emp-check-avatar">{{ (e.prenom||'').charAt(0) }}{{ (e.nom||'').charAt(0) }}</div>
                  <div>
                    <div style="font-size:0.8125rem; font-weight:500;">{{ e.prenom }} {{ e.nom }}</div>
                    <div style="font-size:0.7rem; color:var(--text-muted);">{{ e.poste?.titre_poste }}</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">Annuler</button>
            <button class="btn btn-primary" :disabled="!form.titre?.trim() || !form.contenu?.trim() || saving" @click="save">
              <span v-if="saving" class="spinner-xs"></span>
              {{ saving ? 'Enregistrement...' : (editing ? 'Mettre à jour' : 'Créer') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirm Modal -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="modal-overlay">
        <div class="modal-box" style="max-width:400px;">
          <div class="modal-header">
            <h3 class="modal-title" style="color:#ef4444;">Supprimer le règlement</h3>
            <button class="modal-close" @click="showDeleteModal=false"><XIcon :size="16" /></button>
          </div>
          <div class="modal-body">
            <p style="font-size:0.9rem;">Voulez-vous vraiment supprimer <strong>« {{ deletingItem?.titre }} »</strong> ?<br/>Cette action est irréversible.</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showDeleteModal=false">Annuler</button>
            <button class="btn" style="background:#ef4444;color:white;" :disabled="deleting" @click="deleteReglement">
              <span v-if="deleting" class="spinner-xs"></span>
              {{ deleting ? 'Suppression...' : 'Supprimer' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  ScrollText as ScrollTextIcon,
  Plus as PlusIcon,
  Edit as EditIcon,
  Trash as TrashIcon,
  X as XIcon,
  List as ListIcon,
  Users as UsersIcon
} from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })

const tab = ref('reglements')
const reglements = ref([])
const employes = ref([])
const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const editing = ref(false)
const editingId = ref(null)
const deletingItem = ref(null)
const selectedEmployeId = ref('')

const form = ref({ titre: '', contenu: '', employeIds: [] })

onMounted(async () => {
  await Promise.all([loadReglements(), loadEmployes()])
})

const loadReglements = async () => {
  loading.value = true
  try { reglements.value = await $fetch('/api/reglements') }
  catch (e) { console.error(e) }
  finally { loading.value = false }
}

const loadEmployes = async () => {
  try { employes.value = await $fetch('/api/equipe') }
  catch (e) { console.error(e) }
}

const openCreate = () => {
  editing.value = false
  editingId.value = null
  form.value = { titre: '', contenu: '', employeIds: [] }
  showModal.value = true
}

const openEdit = (r) => {
  editing.value = true
  editingId.value = r.id
  form.value = {
    titre: r.titre,
    contenu: r.contenu,
    employeIds: r.employes.map(re => re.employe.id)
  }
  showModal.value = true
}

const closeModal = () => { showModal.value = false }

const save = async () => {
  if (!form.value.titre?.trim() || !form.value.contenu?.trim()) return
  saving.value = true
  try {
    if (editing.value) {
      await $fetch(`/api/reglements/${editingId.value}`, {
        method: 'PUT',
        body: { titre: form.value.titre, contenu: form.value.contenu, employeIds: form.value.employeIds }
      })
    } else {
      await $fetch('/api/reglements', {
        method: 'POST',
        body: { titre: form.value.titre, contenu: form.value.contenu, employeIds: form.value.employeIds }
      })
    }
    await loadReglements()
    closeModal()
  } catch (e) {
    console.error(e)
    alert('Erreur lors de l\'enregistrement')
  } finally {
    saving.value = false
  }
}

const confirmDelete = (r) => {
  deletingItem.value = r
  showDeleteModal.value = true
}

const deleteReglement = async () => {
  deleting.value = true
  try {
    await $fetch(`/api/reglements/${deletingItem.value.id}`, { method: 'DELETE' })
    await loadReglements()
    showDeleteModal.value = false
  } catch (e) {
    console.error(e)
    alert('Erreur lors de la suppression')
  } finally {
    deleting.value = false
  }
}

const isAssigned = (r, employeId) => r.employes.some(re => re.employe.id === employeId)

const toggleAssignment = async (r, employeId) => {
  const currentIds = r.employes.map(re => re.employe.id)
  let newIds
  if (currentIds.includes(employeId)) {
    newIds = currentIds.filter(id => id !== employeId)
  } else {
    newIds = [...currentIds, employeId]
  }
  try {
    const updated = await $fetch(`/api/reglements/${r.id}/assigner`, {
      method: 'POST',
      body: { employeIds: newIds }
    })
    // Update locally
    const idx = reglements.value.findIndex(x => x.id === r.id)
    if (idx !== -1 && updated) reglements.value[idx] = updated
  } catch (e) {
    console.error(e)
    alert('Erreur lors de la mise à jour')
  }
}
</script>

<style scoped>
.reg-badge { width:32px; height:32px; border-radius:8px; background:linear-gradient(135deg,var(--accent-primary),#7c3aed); color:white; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

.tab-bar { display:flex; gap:0.5rem; background:var(--bg-surface); border:1px solid var(--border-light); border-radius:10px; padding:0.35rem; width:fit-content; margin-bottom:1.25rem; }
.tab-btn { display:flex; align-items:center; gap:0.5rem; padding:0.4rem 1rem; border-radius:7px; border:none; background:transparent; font-size:0.8125rem; font-weight:500; color:var(--text-secondary); cursor:pointer; transition:all 0.15s; }
.tab-btn:hover { background:var(--bg-surface-hover); color:var(--text-primary); }
.tab-btn-active { background:var(--accent-primary); color:white; font-weight:600; }

.reg-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(340px, 1fr)); gap:1rem; }
.reg-card { background:var(--bg-surface); border:1px solid var(--border-light); border-radius:12px; padding:1.25rem; display:flex; flex-direction:column; gap:0.75rem; transition:box-shadow 0.15s; }
.reg-card:hover { box-shadow:0 4px 16px rgba(0,0,0,0.08); }
.reg-card-header { display:flex; align-items:flex-start; justify-content:space-between; gap:0.5rem; }
.reg-card-title { font-size:0.9375rem; font-weight:700; color:var(--text-primary); flex:1; }
.reg-card-content { font-size:0.8125rem; color:var(--text-secondary); line-height:1.6; display:-webkit-box; -webkit-line-clamp:4; -webkit-box-orient:vertical; overflow:hidden; white-space:pre-line; }
.reg-card-footer { display:flex; align-items:center; flex-wrap:wrap; gap:0.35rem; }

.emp-chip { display:inline-flex; align-items:center; background:var(--accent-primary)15; color:var(--accent-primary); font-size:0.7rem; font-weight:600; padding:0.2rem 0.5rem; border-radius:99px; border:1px solid var(--accent-primary)30; }
.emp-chip-none { background:var(--bg-surface-hover); color:var(--text-muted); border-color:var(--border-light); }

.assigned-badge { display:inline-flex; align-items:center; background:#10b98115; color:#059669; font-size:0.7rem; font-weight:700; padding:0.2rem 0.6rem; border-radius:99px; border:1px solid #10b98130; width:fit-content; }

.icon-btn { background:none; border:1px solid var(--border-light); color:var(--text-muted); border-radius:6px; padding:0.3rem; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.15s; }
.icon-btn:hover { background:var(--bg-surface-hover); color:var(--text-primary); }
.icon-btn-danger:hover { background:#ef444410; color:#ef4444; border-color:#ef444430; }

/* Toggle switch */
.toggle-label { display:flex; align-items:center; cursor:pointer; flex-shrink:0; }
.toggle-label input { position:absolute; opacity:0; width:0; height:0; }
.toggle-track { width:36px; height:20px; background:var(--border-light); border-radius:99px; position:relative; transition:background 0.2s; }
.toggle-label input:checked + .toggle-track { background:var(--accent-primary); }
.toggle-track::after { content:''; position:absolute; top:2px; left:2px; width:16px; height:16px; background:white; border-radius:50%; transition:transform 0.2s; }
.toggle-label input:checked + .toggle-track::after { transform:translateX(16px); }

/* Multi-select employees */
.emp-multiselect { display:flex; flex-direction:column; gap:0.375rem; max-height:260px; overflow-y:auto; border:1px solid var(--border-light); border-radius:8px; padding:0.5rem; background:var(--bg-surface-hover); }
.emp-check-item { display:flex; align-items:center; gap:0.75rem; padding:0.5rem 0.625rem; border-radius:6px; cursor:pointer; transition:background 0.12s; }
.emp-check-item:hover { background:var(--bg-surface); }
.emp-check-item input { width:15px; height:15px; accent-color:var(--accent-primary); cursor:pointer; flex-shrink:0; }
.emp-check-avatar { width:28px; height:28px; border-radius:50%; background:var(--accent-primary); color:white; font-size:0.65rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; text-transform:uppercase; }

/* Loading / Empty states */
.loading-state { display:flex; align-items:center; justify-content:center; gap:0.75rem; padding:4rem 2rem; color:var(--text-muted); font-size:0.875rem; }
.spinner-sm { width:20px; height:20px; border-radius:50%; border:2px solid var(--border-light); border-top-color:var(--accent-primary); animation:spin 0.8s linear infinite; }
.spinner-xs { width:14px; height:14px; border-radius:50%; border:2px solid rgba(255,255,255,0.3); border-top-color:white; animation:spin 0.8s linear infinite; display:inline-block; }
@keyframes spin { to { transform:rotate(360deg); } }
.empty-state { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:5rem 2rem; text-align:center; gap:0.25rem; }

/* Modal */
.modal-overlay { position:fixed; inset:0; z-index:10000; background:rgba(0,0,0,0.6); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; padding:1rem; box-sizing:border-box; }
.modal-box { background:var(--bg-surface); border-radius:16px; width:100%; max-width:500px; box-shadow:0 24px 60px rgba(0,0,0,0.3); overflow:hidden; display:flex; flex-direction:column; max-height:calc(100vh - 2rem); }
.modal-box-lg { max-width:620px; }
.modal-header { display:flex; align-items:center; justify-content:space-between; padding:1.25rem 1.5rem; border-bottom:1px solid var(--border-light); flex-shrink:0; }
.modal-title { font-size:1rem; font-weight:700; }
.modal-close { background:none; border:none; cursor:pointer; color:var(--text-muted); padding:0.25rem; border-radius:4px; }
.modal-close:hover { color:var(--text-primary); background:var(--bg-surface-hover); }
.modal-body { padding:1.25rem 1.5rem; display:flex; flex-direction:column; gap:1rem; overflow-y:auto; }
.modal-footer { padding:1rem 1.5rem; border-top:1px solid var(--border-light); display:flex; justify-content:flex-end; gap:0.5rem; flex-shrink:0; }

.form-group { display:flex; flex-direction:column; gap:0.375rem; }
.form-label { font-size:0.8125rem; font-weight:600; color:var(--text-primary); }
</style>
