<template>
  <div class="animate-fade-in">
    <div class="page-header">
      <div>
        <h1 class="page-title" style="display:flex;align-items:center;gap:0.625rem;">
          <span class="verif-badge-icon"><ClipboardCheckIcon :size="16" /></span>
          Tâches À Vérifier
        </h1>
        <p class="page-subtitle" style="margin-bottom:0;">Tâches soumises par les employés en attente de validation ou correction.</p>
      </div>
      <span v-if="taches.length > 0" class="count-chip">{{ taches.length }} en attente</span>
    </div>

    <div v-if="loading" class="loading-state"><div class="spinner-sm"></div><span>Chargement...</span></div>

    <div v-else-if="taches.length === 0" class="card" style="text-align:center;padding:3rem 2rem;">
      <ClipboardCheckIcon :size="40" style="color:var(--text-muted);margin:0 auto 1rem;" />
      <p style="font-weight:600;margin-bottom:0.5rem;">Aucune tâche en attente</p>
      <p style="color:var(--text-muted);font-size:0.875rem;">Toutes les tâches soumises ont été traitées.</p>
    </div>

    <div v-else class="card" style="padding:0;overflow:hidden;">
      <table class="data-table">
        <thead>
          <tr>
            <th>Employé</th>
            <th>Tâche</th>
            <th>Édition</th>
            <th>Statut actuel</th>
            <th>Soumis le</th>
            <th style="text-align:right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in taches" :key="t.id" class="verif-row">
            <td>
              <div class="emp-cell">
                <div class="emp-avatar-sm">{{ initials(t.employe) }}</div>
                <div>
                  <div style="font-weight:600;font-size:0.875rem;">{{ t.employe?.prenom }} {{ t.employe?.nom }}</div>
                  <div style="font-size:0.7rem;color:var(--text-muted);">{{ t.employe?.poste?.titre_poste }}</div>
                </div>
              </div>
            </td>
            <td>
              <div style="font-weight:600;font-size:0.875rem;max-width:260px;">{{ t.titre }}</div>
              <a v-if="t.lien_livrable" :href="t.lien_livrable" target="_blank" class="livrable-link">
                <ExternalLinkIcon :size="10" /> Livrable
              </a>
            </td>
            <td>
              <span v-if="t.edition" style="font-size:0.8125rem;">{{ t.edition.licence?.sigle }} – {{ t.edition.ville?.nom_ville }}</span>
              <span v-else style="color:var(--text-muted);">—</span>
            </td>
            <td>
              <span class="badge badge-warning">⏳ À vérifier</span>
            </td>
            <td style="font-size:0.8rem;color:var(--text-muted);">{{ formatDate(t.updatedAt) }}</td>
            <td style="text-align:right;">
              <div style="display:flex;gap:0.5rem;justify-content:flex-end;flex-wrap:wrap;">
                <button class="btn btn-sm btn-success" @click="terminer(t.id)">
                  <CheckIcon :size="13" /> Terminer
                </button>
                <button class="btn btn-sm btn-warning" @click="openModifierModal(t)">
                  <EditIcon :size="13" /> À modifier
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal À modifier -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-box">
          <div class="modal-header">
            <h3 class="modal-title"><EditIcon :size="15" /> Demande de modification</h3>
            <button class="modal-close" @click="closeModal"><XIcon :size="16" /></button>
          </div>
          <div class="modal-body">
            <p style="font-size:0.875rem;color:var(--text-secondary);margin-bottom:0.75rem;">
              Tâche : <strong>{{ selectedTache?.titre }}</strong><br>
              Employé : <strong>{{ selectedTache?.employe?.prenom }} {{ selectedTache?.employe?.nom }}</strong>
            </p>
            <div class="form-group">
              <label class="form-label">Motif de la demande de modification <span style="color:#ef4444;">*</span></label>
              <textarea v-model="motif" class="form-input" rows="4" placeholder="Décrivez précisément ce qui doit être corrigé ou complété..." style="resize:vertical;"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">Annuler</button>
            <button class="btn btn-primary" :disabled="!motif.trim() || submitting" @click="envoyerModification">
              <span v-if="submitting" class="spinner-xs"></span>
              <SendIcon v-else :size="13" />
              {{ submitting ? 'Envoi...' : 'Envoyer la demande' }}
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
  ClipboardCheck as ClipboardCheckIcon,
  Check as CheckIcon,
  Edit as EditIcon,
  X as XIcon,
  Send as SendIcon,
  ExternalLink as ExternalLinkIcon
} from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })

const taches = ref([])
const loading = ref(true)
const showModal = ref(false)
const selectedTache = ref(null)
const motif = ref('')
const submitting = ref(false)

onMounted(loadTaches)

async function loadTaches() {
  loading.value = true
  try {
    taches.value = await $fetch('/api/taches/a-verifier')
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

const initials = (emp) => emp ? `${(emp.prenom||'').charAt(0)}${(emp.nom||'').charAt(0)}`.toUpperCase() : '?'

const formatDate = (ts) => {
  if (!ts) return '—'
  return new Date(ts).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const terminer = async (id) => {
  try {
    await $fetch(`/api/taches/${id}/terminer`, { method: 'POST' })
    taches.value = taches.value.filter(t => t.id !== id)
  } catch (e) { console.error(e) }
}

const openModifierModal = (tache) => {
  selectedTache.value = tache
  motif.value = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedTache.value = null
  motif.value = ''
}

const envoyerModification = async () => {
  if (!motif.value.trim() || !selectedTache.value) return
  submitting.value = true
  try {
    await $fetch(`/api/taches/${selectedTache.value.id}/modifier-demande`, {
      method: 'POST',
      body: { motif: motif.value.trim() }
    })
    taches.value = taches.value.filter(t => t.id !== selectedTache.value.id)
    closeModal()
  } catch (e) { console.error(e) }
  finally { submitting.value = false }
}
</script>

<style scoped>
.verif-badge-icon { width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#f59e0b,#d97706);color:white;display:flex;align-items:center;justify-content:center;flex-shrink:0; }

.count-chip { background:#f59e0b20;color:#d97706;border:1px solid #f59e0b40;font-size:0.8125rem;font-weight:700;padding:0.35rem 0.75rem;border-radius:99px; }

.verif-row { background:#f59e0b05; }
.verif-row:hover { background:#f59e0b10; }

.emp-cell { display:flex;align-items:center;gap:0.625rem; }
.emp-avatar-sm { width:32px;height:32px;border-radius:50%;background:var(--accent-primary);color:white;font-size:0.7rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0; }

.livrable-link { display:inline-flex;align-items:center;gap:0.25rem;color:var(--accent-primary);font-size:0.7rem;text-decoration:none;margin-top:0.2rem; }
.livrable-link:hover { text-decoration:underline; }

.btn-success { background:#10b981;color:white;border:none; }
.btn-success:hover { background:#059669; }
.btn-warning { background:#f59e0b;color:white;border:none; }
.btn-warning:hover { background:#d97706; }

.badge-warning { background:#f59e0b20;color:#d97706;border:1px solid #f59e0b40; }

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
