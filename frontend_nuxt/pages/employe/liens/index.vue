<template>
  <div class="animate-fade-in">
    <div class="page-header">
      <div>
        <h1 class="page-title" style="display:flex;align-items:center;gap:0.625rem;">
          <span class="liens-badge-icon"><ExternalLinkIcon :size="16" /></span>
          Liens Importants
        </h1>
        <p class="page-subtitle" style="margin-bottom:0;">Ressources et liens utiles partagés avec toute l'équipe.</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">
        <PlusIcon :size="15" /> Ajouter un lien
      </button>
    </div>

    <div v-if="loading" class="loading-state"><div class="spinner-sm"></div><span>Chargement...</span></div>

    <div v-else-if="liens.length === 0" class="card" style="text-align:center;padding:3rem 2rem;">
      <ExternalLinkIcon :size="40" style="color:var(--text-muted);margin:0 auto 1rem;" />
      <p style="font-weight:600;margin-bottom:0.5rem;">Aucun lien enregistré</p>
      <p style="color:var(--text-muted);font-size:0.875rem;">Ajoutez votre premier lien important pour le partager avec l'équipe.</p>
    </div>

    <div v-else class="liens-grid">
      <div v-for="lien in liens" :key="lien.id" class="lien-card card">
        <div class="lien-card-header">
          <div class="lien-favicon">
            <ExternalLinkIcon :size="16" style="color:var(--accent-primary);" />
          </div>
          <div style="flex:1;min-width:0;">
            <a :href="lien.url" target="_blank" class="lien-titre">{{ lien.titre }}</a>
            <div class="lien-url">{{ lien.url }}</div>
          </div>
          <div v-if="canEditLien(lien)" style="display:flex;gap:0.25rem;flex-shrink:0;">
            <button class="icon-btn" @click="openEdit(lien)" title="Modifier"><EditIcon :size="14" /></button>
            <button class="icon-btn icon-btn-danger" @click="deleteLien(lien.id)" title="Supprimer"><TrashIcon :size="14" /></button>
          </div>
        </div>
        <p v-if="lien.description" class="lien-description">{{ lien.description }}</p>
        <div class="lien-meta">
          <span>Ajouté par <strong>{{ lien.auteur?.prenom }} {{ lien.auteur?.nom }}</strong> le {{ formatDate(lien.createdAt) }}</span>
          <span v-if="lien.modifiePar" class="lien-modif">
            · Modifié par <strong>{{ lien.modifiePar?.prenom }} {{ lien.modifiePar?.nom }}</strong> le {{ formatDateHeure(lien.modifieLeAt) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Modal Créer / Modifier -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-box">
          <div class="modal-header">
            <h3 class="modal-title">
              <ExternalLinkIcon :size="15" />
              {{ editMode ? 'Modifier le lien' : 'Ajouter un lien' }}
            </h3>
            <button class="modal-close" @click="closeModal"><XIcon :size="16" /></button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Titre <span style="color:#ef4444;">*</span></label>
              <input v-model="form.titre" type="text" class="form-input" placeholder="Ex: Documentation Nuxt 3" />
            </div>
            <div class="form-group">
              <label class="form-label">URL <span style="color:#ef4444;">*</span></label>
              <input v-model="form.url" type="url" class="form-input" placeholder="https://..." />
            </div>
            <div class="form-group">
              <label class="form-label">Description <span style="color:var(--text-muted);font-weight:400;">(optionnelle)</span></label>
              <textarea v-model="form.description" class="form-input" rows="3" placeholder="Brève description du lien..." style="resize:vertical;"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">Annuler</button>
            <button class="btn btn-primary" :disabled="!form.titre.trim() || !form.url.trim() || submitting" @click="saveLien">
              <span v-if="submitting" class="spinner-xs"></span>
              <CheckIcon v-else :size="13" />
              {{ submitting ? 'Enregistrement...' : (editMode ? 'Modifier' : 'Ajouter') }}
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
  ExternalLink as ExternalLinkIcon,
  Plus as PlusIcon,
  Edit as EditIcon,
  Trash as TrashIcon,
  X as XIcon,
  Check as CheckIcon
} from 'lucide-vue-next'

definePageMeta({ layout: 'employe' })

const { user } = useAuth()

const liens = ref([])
const loading = ref(true)
const showModal = ref(false)
const editMode = ref(false)
const editId = ref(null)
const submitting = ref(false)
const form = ref({ titre: '', url: '', description: '' })

onMounted(loadLiens)

async function loadLiens() {
  loading.value = true
  try {
    liens.value = await $fetch('/api/liens')
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

const canEditLien = (lien) => lien.auteur?.id === user.value?.id

const formatDate = (ts) => {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
const formatDateHeure = (ts) => {
  if (!ts) return '—'
  return new Date(ts).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const openCreate = () => {
  editMode.value = false
  editId.value = null
  form.value = { titre: '', url: '', description: '' }
  showModal.value = true
}

const openEdit = (lien) => {
  editMode.value = true
  editId.value = lien.id
  form.value = { titre: lien.titre, url: lien.url, description: lien.description || '' }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveLien = async () => {
  if (!form.value.titre.trim() || !form.value.url.trim()) return
  submitting.value = true
  try {
    if (editMode.value) {
      const updated = await $fetch(`/api/liens/${editId.value}`, {
        method: 'PUT',
        body: { titre: form.value.titre.trim(), url: form.value.url.trim(), description: form.value.description.trim() || null, modifieParId: user.value?.id }
      })
      const idx = liens.value.findIndex(l => l.id === editId.value)
      if (idx !== -1) liens.value[idx] = updated
    } else {
      const created = await $fetch('/api/liens', {
        method: 'POST',
        body: { titre: form.value.titre.trim(), url: form.value.url.trim(), description: form.value.description.trim() || null, auteurId: user.value?.id }
      })
      liens.value.unshift(created)
    }
    closeModal()
  } catch (e) { console.error(e) }
  finally { submitting.value = false }
}

const deleteLien = async (id) => {
  if (!confirm('Supprimer ce lien ?')) return
  try {
    await $fetch(`/api/liens/${id}`, { method: 'DELETE' })
    liens.value = liens.value.filter(l => l.id !== id)
  } catch (e) { console.error(e) }
}
</script>

<style scoped>
.liens-badge-icon { width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,var(--accent-primary),#7c3aed);color:white;display:flex;align-items:center;justify-content:center;flex-shrink:0; }

.liens-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem; }

.lien-card { padding:1rem 1.25rem;display:flex;flex-direction:column;gap:0.5rem;transition:box-shadow 0.2s; }
.lien-card:hover { box-shadow:0 4px 16px rgba(0,0,0,0.1); }

.lien-card-header { display:flex;align-items:flex-start;gap:0.75rem; }
.lien-favicon { width:32px;height:32px;border-radius:8px;background:var(--accent-primary)15;display:flex;align-items:center;justify-content:center;flex-shrink:0; }

.lien-titre { font-size:0.9375rem;font-weight:700;color:var(--text-primary);text-decoration:none;display:block; }
.lien-titre:hover { color:var(--accent-primary); }
.lien-url { font-size:0.7rem;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:0.1rem; }

.lien-description { font-size:0.8125rem;color:var(--text-secondary);line-height:1.5;margin:0; }

.lien-meta { font-size:0.7rem;color:var(--text-muted);border-top:1px solid var(--border-light);padding-top:0.5rem;margin-top:0.25rem; }
.lien-modif { display:inline; }

.icon-btn { background:none;border:none;cursor:pointer;color:var(--text-muted);padding:0.3rem;border-radius:4px;display:flex;align-items:center;justify-content:center;transition:all 0.15s; }
.icon-btn:hover { color:var(--accent-primary);background:var(--accent-primary)10; }
.icon-btn-danger:hover { color:#ef4444;background:#ef444410; }

.loading-state { display:flex;align-items:center;justify-content:center;gap:0.75rem;padding:2rem;color:var(--text-muted);font-size:0.875rem; }
.spinner-sm { width:20px;height:20px;border-radius:50%;border:2px solid var(--border-light);border-top-color:var(--accent-primary);animation:spin 0.8s linear infinite; }
.spinner-xs { width:14px;height:14px;border-radius:50%;border:2px solid rgba(255,255,255,0.3);border-top-color:white;animation:spin 0.8s linear infinite;display:inline-block; }
@keyframes spin { to { transform:rotate(360deg); } }

.modal-overlay { position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:1rem; }
.modal-box { background:var(--bg-surface);border-radius:16px;width:100%;max-width:480px;box-shadow:0 24px 60px rgba(0,0,0,0.3);overflow:hidden; }
.modal-header { display:flex;align-items:center;justify-content:space-between;padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-light); }
.modal-title { font-size:1rem;font-weight:700;display:flex;align-items:center;gap:0.5rem; }
.modal-close { background:none;border:none;cursor:pointer;color:var(--text-muted);padding:0.25rem;border-radius:4px; }
.modal-close:hover { color:var(--text-primary);background:var(--bg-surface-hover); }
.modal-body { padding:1.5rem;display:flex;flex-direction:column;gap:1rem; }
.modal-footer { padding:1rem 1.5rem;border-top:1px solid var(--border-light);display:flex;justify-content:flex-end;gap:0.5rem; }
.form-group { display:flex;flex-direction:column;gap:0.375rem; }
.form-label { font-size:0.8125rem;font-weight:600;color:var(--text-primary); }
</style>
