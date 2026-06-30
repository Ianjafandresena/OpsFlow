<template>
  <div class="animate-fade-in">
    <div class="page-header">
      <div>
        <h1 class="page-title" style="display:flex;align-items:center;gap:0.625rem;">
          <span class="verif-badge-icon"><ClipboardCheckIcon :size="16" /></span>
          À Vérifier
        </h1>
        <p class="page-subtitle" style="margin-bottom:0;">Tâches et notes soumises par les employés en attente de validation.</p>
      </div>
      <span v-if="totalCount > 0" class="count-chip">{{ totalCount }} en attente</span>
    </div>

    <div v-if="loading" class="loading-state"><div class="spinner-sm"></div><span>Chargement...</span></div>

    <div v-else-if="totalCount === 0" class="card" style="text-align:center;padding:3rem 2rem;">
      <ClipboardCheckIcon :size="40" style="color:var(--text-muted);margin:0 auto 1rem;" />
      <p style="font-weight:600;margin-bottom:0.5rem;">Aucun élément en attente</p>
      <p style="color:var(--text-muted);font-size:0.875rem;">Tous les éléments soumis ont été traités.</p>
    </div>

    <div v-else style="display:flex;flex-direction:column;gap:1.25rem;">

      <!-- Tâches assignées -->
      <div v-if="taches.length > 0" class="card" style="padding:0;overflow:hidden;">
        <div style="padding:0.75rem 1.25rem;background:var(--bg-surface-hover);border-bottom:1px solid var(--border-light);font-size:0.8125rem;font-weight:700;display:flex;align-items:center;gap:0.5rem;">
          <ClipboardCheckIcon :size="14" /> Tâches assignées
          <span style="background:#f59e0b20;color:#d97706;border:1px solid #f59e0b40;font-size:0.7rem;font-weight:700;padding:0.1rem 0.4rem;border-radius:99px;">{{ taches.length }}</span>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Employé</th>
              <th>Tâche</th>
              <th>Édition</th>
              <th>Soumis le</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in taches" :key="t.id" class="verif-row clickable-row" @click="openDetail('tache', t)">
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
                <div style="font-weight:600;font-size:0.875rem;max-width:240px;">{{ t.titre }}</div>
                <a v-if="t.lien_livrable" :href="t.lien_livrable" target="_blank" class="livrable-link" @click.stop>
                  <ExternalLinkIcon :size="10" /> Livrable
                </a>
              </td>
              <td>
                <span v-if="t.edition" style="font-size:0.8125rem;">{{ t.edition.licence?.sigle }} – {{ t.edition.ville?.nom_ville }}</span>
                <span v-else style="color:var(--text-muted);">—</span>
              </td>
              <td style="font-size:0.8rem;color:var(--text-muted);">{{ formatDate(t.updatedAt) }}</td>
              <td style="text-align:right;" @click.stop>
                <div style="display:flex;gap:0.5rem;justify-content:flex-end;">
                  <button class="btn btn-sm btn-success" @click="terminerTache(t.id)"><CheckIcon :size="13" /> Terminer</button>
                  <button class="btn btn-sm btn-warning" @click="openDetail('tache', t, true)"><EditIcon :size="13" /> À modifier</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Entrées manuelles de journal -->
      <div v-if="entreesManuelles.length > 0" class="card" style="padding:0;overflow:hidden;">
        <div style="padding:0.75rem 1.25rem;background:var(--bg-surface-hover);border-bottom:1px solid var(--border-light);font-size:0.8125rem;font-weight:700;display:flex;align-items:center;gap:0.5rem;">
          <span style="font-size:0.9rem;">✎</span> Notes de journal
          <span style="background:#f59e0b20;color:#d97706;border:1px solid #f59e0b40;font-size:0.7rem;font-weight:700;padding:0.1rem 0.4rem;border-radius:99px;">{{ entreesManuelles.length }}</span>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Employé</th>
              <th>Contenu</th>
              <th>Journal</th>
              <th>Date / Heure</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in entreesManuelles" :key="e.id" class="verif-row clickable-row" @click="openDetail('entree', e)">
              <td>
                <div class="emp-cell">
                  <div class="emp-avatar-sm">{{ initials(e.employe) }}</div>
                  <div>
                    <div style="font-weight:600;font-size:0.875rem;">{{ e.employe?.prenom }} {{ e.employe?.nom }}</div>
                  </div>
                </div>
              </td>
              <td style="max-width:280px;font-size:0.8125rem;">{{ e.contenu }}</td>
              <td style="font-size:0.8rem;color:var(--text-muted);">{{ e.journal?.nom }}</td>
              <td style="font-size:0.8rem;color:var(--text-muted);">{{ formatEntreeDate(e) }}</td>
              <td style="text-align:right;" @click.stop>
                <div style="display:flex;gap:0.5rem;justify-content:flex-end;">
                  <button class="btn btn-sm btn-success" @click="terminerEntree(e.id)"><CheckIcon :size="13" /> Terminer</button>
                  <button class="btn btn-sm btn-warning" @click="openDetail('entree', e, true)"><EditIcon :size="13" /> À modifier</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <!-- ===== DETAIL MODAL ===== -->
    <Teleport to="body">
      <div v-if="showDetail" class="modal-overlay" @click.self="closeDetail">
        <div class="modal-box modal-box-xl" style="max-width:800px;max-height:90vh;display:flex;flex-direction:column;">
          <div class="modal-header">
            <div style="display:flex;align-items:center;gap:0.75rem;">
              <div class="emp-avatar-sm" style="width:36px;height:36px;font-size:0.75rem;">{{ initials(selectedItem?.employe) }}</div>
              <div>
                <h3 class="modal-title" style="margin:0;">{{ selectedItem?.employe?.prenom }} {{ selectedItem?.employe?.nom }}</h3>
                <div style="font-size:0.75rem;color:var(--text-muted);">
                  <span v-if="detailType==='tache'">{{ selectedItem?.employe?.poste?.titre_poste }}</span>
                  <span v-else>{{ selectedItem?.journal?.nom }} — {{ formatEntreeDate(selectedItem) }}</span>
                </div>
              </div>
            </div>
            <button class="modal-close" @click="closeDetail"><XIcon :size="16" /></button>
          </div>

          <div class="modal-body" style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:1.25rem;">

            <!-- Tâche details -->
            <div v-if="detailType==='tache'" class="modal-section">
              <div class="modal-section-title">Tâche</div>
              <div style="font-size:1rem;font-weight:700;margin-bottom:0.5rem;">{{ selectedItem?.titre }}</div>
              <div v-if="selectedItem?.description" style="font-size:0.875rem;color:var(--text-secondary);white-space:pre-wrap;margin-bottom:0.75rem;">{{ selectedItem.description }}</div>
              <div v-if="selectedItem?.lien_livrable" style="margin-bottom:0.5rem;">
                <div class="form-label" style="margin-bottom:0.25rem;">Lien livrable</div>
                <a :href="selectedItem.lien_livrable" target="_blank" class="detail-link"><ExternalLinkIcon :size="12" /> {{ selectedItem.lien_livrable }}</a>
              </div>
              <div v-if="selectedItem?.edition" style="font-size:0.8125rem;color:var(--text-muted);">Édition : <strong>{{ selectedItem.edition.licence?.sigle }} – {{ selectedItem.edition.ville?.nom_ville }}</strong></div>
            </div>

            <!-- Note de journal details -->
            <div v-if="detailType==='entree'" class="modal-section">
              <div class="modal-section-title">Contenu</div>
              <div style="font-size:0.9rem;white-space:pre-wrap;line-height:1.6;">{{ selectedItem?.contenu || '—' }}</div>
            </div>

            <!-- Liens (entree) -->
            <div v-if="detailType==='entree' && detailLinks.length > 0" class="modal-section">
              <div class="modal-section-title">Liens</div>
              <div style="display:flex;flex-direction:column;gap:0.35rem;">
                <a v-for="(lnk,i) in detailLinks" :key="i" :href="lnk" target="_blank" class="detail-link"><ExternalLinkIcon :size="12" /> {{ lnk }}</a>
              </div>
            </div>

            <!-- Mails (entree) -->
            <div v-if="detailType==='entree' && detailMails.length > 0" class="modal-section">
              <div class="modal-section-title">Mails / Résultats</div>
              <div style="display:flex;flex-direction:column;gap:0.35rem;">
                <a v-for="(mail,i) in detailMails" :key="i" :href="'mailto:'+mail" class="detail-link"><MailIcon :size="12" /> {{ mail }}</a>
              </div>
            </div>

            <!-- Commentaires (entree only) -->
            <div v-if="detailType==='entree'" class="modal-section">
              <div class="modal-section-title">Discussion</div>
              <div class="chat-thread" ref="detailChatRef">
                <template v-for="msg in detailComments" :key="msg.id">
                  <div :class="msg.isAdmin ? 'chat-msg chat-msg-admin' : 'chat-msg chat-msg-emp'">
                    <div v-if="!msg.isAdmin" class="chat-msg-avatar emp-av">{{ (msg.auteur||'?').charAt(0).toUpperCase() }}</div>
                    <div class="chat-msg-bubble" :class="msg.isAdmin ? 'admin-bubble' : 'emp-bubble'">
                      <div class="chat-msg-author" :style="msg.isAdmin?'text-align:right;':''">
                        {{ msg.auteur }}
                        <span class="chat-time">{{ formatTime(msg.createdAt) }}</span>
                      </div>
                      <div>{{ msg.contenu }}</div>
                    </div>
                    <div v-if="msg.isAdmin" class="chat-msg-avatar admin-av">A</div>
                  </div>
                </template>
                <div v-if="detailComments.length === 0" class="chat-empty">
                  <MessageSquareIcon :size="20" style="color:var(--text-muted);" /><span>Aucun message</span>
                </div>
              </div>
              <div class="chat-input-row" style="margin-top:0.75rem;">
                <textarea v-model="newDetailMsg" class="form-input" rows="2" placeholder="Répondre en tant qu'Admin..." style="resize:none;border-color:#ef444440;" @keydown.enter.ctrl.prevent="sendDetailMsg"></textarea>
                <button class="btn btn-sm" style="background:#ef4444;color:white;flex-shrink:0;" @click="sendDetailMsg" :disabled="!newDetailMsg.trim() || sendingMsg">
                  <span v-if="sendingMsg" class="spinner-xs"></span>
                  <SendIcon v-else :size="13" />
                </button>
              </div>
              <p style="font-size:0.7rem;color:var(--text-muted);margin-top:0.25rem;">Ctrl+Entrée pour envoyer</p>
            </div>

            <!-- À modifier section (shown when openDetail called with modif=true or toggled) -->
            <div v-if="showModifInDetail" class="modal-section" style="border:1px solid #f59e0b40;border-radius:8px;padding:1rem;background:#f59e0b05;">
              <div class="modal-section-title" style="color:#d97706;">Demande de modification</div>
              <div class="form-group">
                <label class="form-label">Motif <span style="color:#ef4444;">*</span></label>
                <textarea v-model="detailMotif" class="form-input" rows="3" placeholder="Décrivez précisément ce qui doit être corrigé..." style="resize:vertical;"></textarea>
              </div>
            </div>

          </div>

          <div class="modal-footer" style="display:flex;justify-content:space-between;align-items:center;">
            <div style="display:flex;gap:0.5rem;">
              <button v-if="!showModifInDetail" class="btn btn-sm btn-warning" @click="showModifInDetail=true"><EditIcon :size="13" /> À modifier</button>
              <button v-if="showModifInDetail" class="btn btn-secondary btn-sm" @click="showModifInDetail=false;detailMotif=''">Annuler modif</button>
            </div>
            <div style="display:flex;gap:0.5rem;">
              <button class="btn btn-secondary" @click="closeDetail">Fermer</button>
              <button v-if="showModifInDetail" class="btn btn-primary" :disabled="!detailMotif.trim() || submitting" @click="envoyerModifDetail">
                <span v-if="submitting" class="spinner-xs"></span>
                <SendIcon v-else :size="13" />
                {{ submitting ? 'Envoi...' : 'Envoyer modification' }}
              </button>
              <button v-else class="btn btn-success" :disabled="submitting" @click="terminerDetail">
                <span v-if="submitting" class="spinner-xs"></span>
                <CheckIcon v-else :size="13" />
                {{ submitting ? '...' : 'Terminer' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import {
  ClipboardCheck as ClipboardCheckIcon,
  Check as CheckIcon,
  Edit as EditIcon,
  X as XIcon,
  Send as SendIcon,
  ExternalLink as ExternalLinkIcon,
  MessageSquare as MessageSquareIcon,
  Mail as MailIcon,
  Link as LinkIcon
} from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })

const taches = ref([])
const entreesManuelles = ref([])
const loading = ref(true)
const submitting = ref(false)

// Detail modal
const showDetail = ref(false)
const detailType = ref('tache') // 'tache' | 'entree'
const selectedItem = ref(null)
const detailComments = ref([])
const newDetailMsg = ref('')
const sendingMsg = ref(false)
const detailChatRef = ref(null)
const showModifInDetail = ref(false)
const detailMotif = ref('')

const totalCount = computed(() => taches.value.length + entreesManuelles.value.length)

const detailLinks = computed(() => {
  if (!selectedItem.value?.lien) return []
  return (selectedItem.value.lien || '').split(/[\s\n]+/).map(s => s.trim()).filter(Boolean)
})
const detailMails = computed(() => {
  if (!selectedItem.value?.recherches) return []
  return (selectedItem.value.recherches || '').split(/[\s\n]+/).map(s => s.trim()).filter(Boolean)
})

onMounted(loadAll)

async function loadAll() {
  loading.value = true
  try {
    const res = await $fetch('/api/taches/a-verifier')
    taches.value = res.taches || []
    entreesManuelles.value = res.entreesManuelles || []
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

const initials = (emp) => emp ? `${(emp.prenom||'').charAt(0)}${(emp.nom||'').charAt(0)}`.toUpperCase() : '?'

const formatDate = (ts) => {
  if (!ts) return '—'
  return new Date(ts).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const formatEntreeDate = (e) => {
  if (!e) return '—'
  const d = new Date(e.date)
  return `${d.toLocaleDateString('fr-FR')} ${e.heure}`
}

const formatTime = (ts) => {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

// --- Detail modal ---
const openDetail = (type, item, openModif = false) => {
  detailType.value = type
  selectedItem.value = item
  detailComments.value = type === 'entree' ? (item.commentaires || []) : []
  newDetailMsg.value = ''
  showModifInDetail.value = openModif
  detailMotif.value = ''
  showDetail.value = true
  nextTick(() => {
    if (detailChatRef.value) detailChatRef.value.scrollTop = detailChatRef.value.scrollHeight
  })
}

const closeDetail = () => {
  showDetail.value = false
  selectedItem.value = null
  detailComments.value = []
  showModifInDetail.value = false
  detailMotif.value = ''
}

const sendDetailMsg = async () => {
  if (!newDetailMsg.value.trim() || !selectedItem.value?.id || detailType.value !== 'entree') return
  sendingMsg.value = true
  try {
    const journalId = selectedItem.value.journal?.id
    if (!journalId) return
    const msg = await $fetch(`/api/journals/${journalId}/messages`, {
      method: 'POST',
      body: { entreeId: selectedItem.value.id, contenu: newDetailMsg.value.trim(), isAdmin: true, auteur: 'Administrateur' }
    })
    detailComments.value.push(msg)
    newDetailMsg.value = ''
    nextTick(() => { if (detailChatRef.value) detailChatRef.value.scrollTop = detailChatRef.value.scrollHeight })
  } catch (e) { console.error(e) }
  finally { sendingMsg.value = false }
}

// --- Terminer ---
const terminerTache = async (id) => {
  try {
    await $fetch(`/api/taches/${id}/terminer`, { method: 'POST' })
    taches.value = taches.value.filter(t => t.id !== id)
  } catch (e) { console.error(e) }
}

const terminerEntree = async (id) => {
  try {
    await $fetch(`/api/entrees/${id}/terminer`, { method: 'POST' })
    entreesManuelles.value = entreesManuelles.value.filter(e => e.id !== id)
  } catch (e) { console.error(e) }
}

const terminerDetail = async () => {
  if (!selectedItem.value) return
  submitting.value = true
  try {
    if (detailType.value === 'tache') {
      await $fetch(`/api/taches/${selectedItem.value.id}/terminer`, { method: 'POST' })
      taches.value = taches.value.filter(t => t.id !== selectedItem.value.id)
    } else {
      await $fetch(`/api/entrees/${selectedItem.value.id}/terminer`, { method: 'POST' })
      entreesManuelles.value = entreesManuelles.value.filter(e => e.id !== selectedItem.value.id)
    }
    closeDetail()
  } catch (e) { console.error(e) }
  finally { submitting.value = false }
}

// --- À modifier ---
const envoyerModifDetail = async () => {
  if (!detailMotif.value.trim() || !selectedItem.value) return
  submitting.value = true
  try {
    if (detailType.value === 'tache') {
      await $fetch(`/api/taches/${selectedItem.value.id}/modifier-demande`, { method: 'POST', body: { motif: detailMotif.value.trim() } })
      taches.value = taches.value.filter(t => t.id !== selectedItem.value.id)
    } else {
      await $fetch(`/api/entrees/${selectedItem.value.id}/modifier-demande`, { method: 'POST', body: { motif: detailMotif.value.trim() } })
      entreesManuelles.value = entreesManuelles.value.filter(e => e.id !== selectedItem.value.id)
    }
    closeDetail()
  } catch (e) { console.error(e) }
  finally { submitting.value = false }
}
</script>

<style scoped>
.verif-badge-icon { width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#f59e0b,#d97706);color:white;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
.count-chip { background:#f59e0b20;color:#d97706;border:1px solid #f59e0b40;font-size:0.8125rem;font-weight:700;padding:0.35rem 0.75rem;border-radius:99px; }
.verif-row { background:#f59e0b05; }
.verif-row:hover { background:#f59e0b10; }
.clickable-row { cursor:pointer; }
.emp-cell { display:flex;align-items:center;gap:0.625rem; }
.emp-avatar-sm { width:32px;height:32px;border-radius:50%;background:var(--accent-primary);color:white;font-size:0.7rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
.livrable-link { display:inline-flex;align-items:center;gap:0.25rem;color:var(--accent-primary);font-size:0.7rem;text-decoration:none;margin-top:0.2rem; }
.livrable-link:hover { text-decoration:underline; }
.btn-success { background:#10b981;color:white;border:none; }
.btn-success:hover { background:#059669; }
.btn-warning { background:#f59e0b;color:white;border:none; }
.btn-warning:hover { background:#d97706; }
.loading-state { display:flex;align-items:center;justify-content:center;gap:0.75rem;padding:2rem;color:var(--text-muted);font-size:0.875rem; }
.spinner-sm { width:20px;height:20px;border-radius:50%;border:2px solid var(--border-light);border-top-color:var(--accent-primary);animation:spin 0.8s linear infinite; }
.spinner-xs { width:14px;height:14px;border-radius:50%;border:2px solid rgba(255,255,255,0.3);border-top-color:white;animation:spin 0.8s linear infinite;display:inline-block; }
@keyframes spin { to { transform:rotate(360deg); } }

/* Modal */
.modal-overlay { position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:1rem; }
.modal-box { background:var(--bg-surface);border-radius:16px;width:100%;box-shadow:0 24px 60px rgba(0,0,0,0.3);overflow:hidden; }
.modal-box-xl { max-width:800px; }
.modal-header { display:flex;align-items:center;justify-content:space-between;padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-light); }
.modal-title { font-size:1rem;font-weight:700;display:flex;align-items:center;gap:0.5rem; }
.modal-close { background:none;border:none;cursor:pointer;color:var(--text-muted);padding:0.25rem;border-radius:4px; }
.modal-close:hover { color:var(--text-primary);background:var(--bg-surface-hover); }
.modal-body { padding:1.5rem;display:flex;flex-direction:column;gap:1rem; }
.modal-footer { padding:1rem 1.5rem;border-top:1px solid var(--border-light); }
.modal-section { display:flex;flex-direction:column;gap:0.5rem; }
.modal-section-title { font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-muted); }

/* Chat */
.chat-thread { display:flex;flex-direction:column;gap:0.75rem;max-height:280px;overflow-y:auto;padding:0.75rem;background:var(--bg-surface-hover);border:1px solid var(--border-light);border-radius:8px; }
.chat-msg { display:flex;align-items:flex-end;gap:0.5rem; }
.chat-msg-emp { flex-direction:row; }
.chat-msg-admin { flex-direction:row-reverse; }
.chat-msg-avatar { width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:700;flex-shrink:0; }
.emp-av { background:var(--accent-primary);color:white; }
.admin-av { background:#ef4444;color:white; }
.chat-msg-bubble { max-width:75%;padding:0.5rem 0.75rem;border-radius:12px;font-size:0.8rem;line-height:1.5; }
.emp-bubble { background:white;border:1px solid var(--border-light);border-bottom-left-radius:2px; }
.admin-bubble { background:#ef444415;border:1px solid #ef444430;border-bottom-right-radius:2px; }
.chat-msg-author { font-size:0.65rem;font-weight:600;color:var(--text-muted);margin-bottom:0.2rem; }
.chat-time { font-weight:400;margin-left:0.35rem; }
.chat-empty { display:flex;align-items:center;justify-content:center;gap:0.5rem;padding:1.5rem;color:var(--text-muted);font-size:0.8rem; }
.chat-input-row { display:flex;gap:0.5rem;align-items:flex-end; }

/* Detail links */
.detail-link { display:inline-flex;align-items:center;gap:0.35rem;color:var(--accent-primary);font-size:0.8rem;text-decoration:none;word-break:break-all; }
.detail-link:hover { text-decoration:underline; }

/* Forms */
.form-group { display:flex;flex-direction:column;gap:0.375rem; }
.form-label { font-size:0.8125rem;font-weight:600;color:var(--text-primary); }
</style>
