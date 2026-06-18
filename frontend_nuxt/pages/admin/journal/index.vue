<template>
  <div class="animate-fade-in">
    <!-- Header -->
    <div class="page-header" style="margin-bottom: 1.5rem;">
      <div>
        <h1 class="page-title" style="display:flex; align-items:center; gap:0.625rem;">
          <span class="journal-badge"><BookOpenIcon :size="16" /></span>
          Journal de Bord
        </h1>
        <p class="page-subtitle" style="margin-bottom:0;">
          Consulter et gérer les journaux d'activité des collaborateurs
        </p>
      </div>
      <button class="btn btn-primary" @click="openCreateModal">
        <PlusIcon :size="14" /> Créer un Journal
      </button>
    </div>

    <!-- Journals list + viewer layout -->
    <div class="journal-layout" :class="{ 'sidebar-hidden': !showSidebar }">
      <!-- LEFT: Journals list -->
      <div v-show="showSidebar" class="journal-list-panel">
        <div class="panel-header">
          <span class="panel-title">Journaux</span>
          <span class="badge">{{ journals.length }}</span>
        </div>

        <div v-if="loadingJournals" class="loading-state">
          <div class="spinner-sm"></div>
          <span>Chargement...</span>
        </div>

        <div v-else-if="journals.length === 0" class="empty-list">
          <BookOpenIcon :size="28" style="color:var(--text-muted); margin-bottom:0.5rem;" />
          <p>Aucun journal créé</p>
          <button class="btn btn-primary btn-sm" @click="openCreateModal">
            <PlusIcon :size="12" /> Créer le premier
          </button>
        </div>

        <div v-else class="journal-items">
          <button
            v-for="j in journals"
            :key="j.id"
            class="journal-item"
            :class="{ 'journal-item-active': selectedJournal?.id === j.id }"
            @click="selectJournal(j)"
          >
            <div class="journal-item-icon">
              <span>{{ initials(j.employe1) }}</span>
              <span v-if="journalEmployes(j).length > 1" class="journal-item-icon2">{{ initials(journalEmployes(j)[1]) }}</span>
            </div>
            <div style="flex:1; min-width:0;">
              <div class="journal-item-name">{{ j.nom }}</div>
              <div class="journal-item-members">
                {{ journalEmployes(j).map(e => `${e.prenom} ${e.nom}`).join(' & ') }}
              </div>
            </div>
            <ChevronRightIcon :size="14" style="color:var(--text-muted); flex-shrink:0;" />
          </button>
        </div>
      </div>

      <!-- RIGHT: Journal viewer -->
      <div class="journal-viewer">
        <div v-if="!selectedJournal" class="journal-empty-state">
          <div class="journal-empty-icon">
            <BookOpenIcon :size="32" />
          </div>
          <p style="font-weight:600; font-size:1rem;">Sélectionner un journal</p>
          <p style="color:var(--text-secondary); font-size:0.875rem;">
            Choisissez un journal dans la liste pour le consulter
          </p>
        </div>

        <div v-else>
          <!-- Viewer Header -->
          <div class="viewer-header">
            <div style="display:flex; align-items:center; gap:0.75rem;">
              <button class="btn btn-secondary btn-sm sidebar-toggle-btn" @click="showSidebar = !showSidebar" title="Journaux">
                <MenuIcon :size="14" />
              </button>
              <div>
                <div v-if="editingTitle" style="display:flex; align-items:center; gap:0.5rem;">
                  <input v-model="editTitleValue" @keyup.enter="saveTitle" class="form-input" style="width: 250px; padding: 0.3rem 0.5rem;" />
                  <button class="btn btn-primary btn-sm" @click="saveTitle" :disabled="savingTitle">OK</button>
                  <button class="btn btn-secondary btn-sm" @click="editingTitle = false">Annuler</button>
                </div>
                <h2 v-else class="viewer-title" style="display:flex; align-items:center; gap:0.5rem;">
                  {{ selectedJournal.nom }}
                  <button class="icon-btn-view" @click="startEditTitle" title="Renommer le journal"><EditIcon :size="14" /></button>
                </h2>
                <div class="viewer-members">
                  <span
                    v-for="(emp, idx) in currentEmployes"
                    :key="emp.id"
                    class="member-chip"
                    :class="memberChipClass(idx)"
                  >{{ emp.prenom }} {{ emp.nom }}</span>
                </div>
              </div>
            </div>
            <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
              <div class="view-toggle">
                <button class="btn btn-sm" :class="viewMode === 'journalier' ? 'btn-primary' : 'btn-secondary'" @click="viewMode = 'journalier'; loadEntries()" style="padding: 0.2rem 0.5rem;">Jour</button>
                <button class="btn btn-sm" :class="viewMode === 'semaine' ? 'btn-primary' : 'btn-secondary'" @click="viewMode = 'semaine'; loadEntries()" style="padding: 0.2rem 0.5rem;">Semaine</button>
              </div>
              <button class="btn btn-secondary btn-sm" @click="prevDay"><ChevronLeftIcon :size="14" /></button>
              <input type="date" v-model="selectedDate" class="date-input" @change="loadEntries" />
              <button class="btn btn-secondary btn-sm" @click="nextDay"><ChevronRightIcon :size="14" /></button>
              <button class="btn btn-secondary btn-sm" @click="goToday">Aujourd'hui</button>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loadingEntries" class="loading-state" style="padding:3rem;">
            <div class="spinner-sm"></div>
            <span>Chargement du journal...</span>
          </div>

          <!-- Daily Grid -->
          <div v-else-if="viewMode === 'journalier'" class="journal-grid-wrapper">
            <table class="journal-table">
              <thead>
                <tr>
                  <th class="time-col">Heure</th>
                  <template v-for="(emp, idx) in currentEmployes" :key="emp.id">
                    <th class="entry-col">
                      <div class="col-header" :class="colHeaderClass(idx)">
                        <div class="emp-avatar" :class="avatarClass(idx)">{{ initials(emp) }}</div>
                        {{ emp.prenom }} {{ emp.nom }}
                      </div>
                    </th>
                    <th class="eval-col" :title="'Évaluation — ' + emp.prenom">Éval.</th>
                  </template>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="slot in timeSlots"
                  :key="slot"
                  :class="{ 'current-time-row': isCurrentSlot(slot) }"
                >
                  <td class="time-cell">{{ slot }}</td>
                  <template v-for="(emp, idx) in currentEmployes" :key="emp.id">
                    <td class="entry-cell">
                      <div v-if="getEntry(emp.id, slot)" class="entry-content" :class="{ 'entry-auto': getEntry(emp.id, slot)?.tacheId }">
                        <div style="display:flex; justify-content:space-between; width:100%; align-items:flex-start; gap:0.25rem;">
                          <div style="flex:1; min-width:0;">
                            <span v-if="getEntry(emp.id, slot)?.tacheId" class="entry-auto-badge">
                              <CheckIcon :size="10" /> Tâche
                            </span>
                            <span class="entry-text">{{ getEntry(emp.id, slot)?.contenu }}</span>
                          </div>
                          <div class="entry-action-row">
                            <button
                              class="icon-btn-view comment-icon-btn"
                              :class="{ 'has-comments': commentCount(emp.id, slot) > 0 }"
                              @click="openEntryModal(emp.id, slot)"
                              :title="commentCount(emp.id, slot) + ' message(s)'"
                            >
                              <MessageSquareIcon :size="13" />
                              <span v-if="commentCount(emp.id, slot) > 0" class="comment-badge">{{ commentCount(emp.id, slot) }}</span>
                            </button>
                            <a v-if="getEntry(emp.id, slot)?.lien || getEntry(emp.id, slot)?.tache?.lien_livrable"
                               :href="getEntry(emp.id, slot)?.lien || getEntry(emp.id, slot)?.tache?.lien_livrable"
                               target="_blank" class="icon-btn-view" @click.stop title="Ouvrir le lien">
                              <LinkIcon :size="11" />
                            </a>
                          </div>
                        </div>
                      </div>
                      <div v-else class="entry-empty">
                        <button class="icon-btn-view comment-icon-btn-empty" @click="openEntryModal(emp.id, slot)" title="Ajouter un commentaire">
                          <MessageSquareIcon :size="12" />
                        </button>
                      </div>
                    </td>
                    <!-- Evaluation column -->
                    <td class="eval-cell">
                      <button class="eval-btn" @click="openEntryModal(emp.id, slot)" :title="evalLabel(emp.id, slot)">
                        <span :class="evalClass(emp.id, slot)">{{ evalLabel(emp.id, slot) }}</span>
                      </button>
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Weekly Grid -->
          <div v-else-if="viewMode === 'semaine'" class="journal-grid-wrapper">
            <div style="display:flex; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--bg-surface-hover); border-bottom: 1px solid var(--border-light);">
              <span style="font-size: 0.8125rem; font-weight: 600; color: var(--text-secondary); display:flex; align-items:center;">Voir la semaine de :</span>
              <button
                v-for="(emp, idx) in currentEmployes"
                :key="emp.id"
                class="btn btn-sm"
                :class="weekEmpId === emp.id ? 'btn-primary' : 'btn-secondary'"
                @click="weekEmpId = emp.id; loadEntries()"
              >{{ emp.prenom }}</button>
            </div>
            <table class="journal-table">
              <thead>
                <tr>
                  <th class="time-col">Heure</th>
                  <th v-for="day in weekDays" :key="day.date" style="text-transform: capitalize;">{{ day.label }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="slot in timeSlots" :key="slot">
                  <td class="time-cell">{{ slot }}</td>
                  <td v-for="day in weekDays" :key="day.date" class="entry-cell" style="vertical-align: top; padding: 0.4rem;">
                    <div v-if="getEntry(weekEmpId, slot, day.date)" class="entry-content" :class="{ 'entry-auto': getEntry(weekEmpId, slot, day.date)?.tacheId }">
                      <div style="display:flex; justify-content:space-between; width:100%; align-items:flex-start;">
                        <div style="font-size: 0.75rem; flex:1;">
                          <span v-if="getEntry(weekEmpId, slot, day.date)?.tacheId" class="entry-auto-badge"><CheckIcon :size="10" /> Tâche</span>
                          {{ getEntry(weekEmpId, slot, day.date)?.contenu || '—' }}
                        </div>
                        <button class="icon-btn-view comment-icon-btn" :class="{ 'has-comments': commentCount(weekEmpId, slot, day.date) > 0 }" @click="openEntryModal(weekEmpId, slot, day.date)" title="Messages">
                          <MessageSquareIcon :size="12" />
                          <span v-if="commentCount(weekEmpId, slot, day.date) > 0" class="comment-badge">{{ commentCount(weekEmpId, slot, day.date) }}</span>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Remarks section -->
          <div v-if="viewMode === 'journalier' && !loadingEntries" class="remarks-row" :style="{ gridTemplateColumns: `repeat(${currentEmployes.length}, 1fr)` }">
            <div v-for="(emp, idx) in currentEmployes" :key="emp.id" class="remarks-card" :class="idx > 0 ? 'remarks-card-alt' : ''">
              <div class="remarks-label">Remarques — {{ emp.prenom }}</div>
              <div class="remarks-content">
                <span v-if="getRemark(emp.id)">{{ getRemark(emp.id) }}</span>
                <span v-else class="remarks-empty">Aucune remarque</span>
              </div>
            </div>
          </div>

          <div v-if="viewMode === 'journalier' && !loadingEntries" class="remarks-row" style="border-top: none;">
            <div class="remarks-card" style="grid-column: 1 / -1; background: var(--accent-primary)04;">
              <div class="remarks-label" style="color: var(--accent-primary);">Remarque de l'Administrateur</div>
              <textarea
                v-model="adminRemark"
                class="remarks-textarea"
                placeholder="Laisser un commentaire général pour cette journée..."
                rows="3"
                style="background: var(--bg-surface); border-color: var(--border-light);"
              />
              <div style="display:flex; justify-content:flex-end; margin-top: 0.5rem;">
                <button class="btn btn-primary btn-sm" :disabled="savingAdmin" @click="saveAdminRemark">
                  <span v-if="savingAdmin" class="spinner-xs"></span>
                  <SaveIcon v-else :size="13" />
                  {{ savingAdmin ? 'Enregistrement...' : 'Enregistrer la remarque' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CREATE JOURNAL MODAL -->
    <Teleport to="body">
      <div v-if="showCreateModal" class="modal-overlay" @click.self="closeCreateModal">
        <div class="modal-box">
          <div class="modal-header">
            <h3 class="modal-title">Créer un Journal</h3>
            <button class="modal-close" @click="closeCreateModal"><XIcon :size="16" /></button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Nom du Journal *</label>
              <input v-model="form.nom" type="text" class="form-input" placeholder="Ex: Ando et Aly - Rennes" />
            </div>

            <!-- Dynamic employee list -->
            <div class="form-group" v-for="(empId, idx) in form.employeIds" :key="idx">
              <label class="form-label">
                Employé {{ idx + 1 }} {{ idx === 0 ? '*' : '' }}
                <span v-if="idx > 0" style="color:var(--text-muted); font-size:0.75rem;">(optionnel)</span>
              </label>
              <div style="display:flex; gap:0.5rem; align-items:center;">
                <select v-model="form.employeIds[idx]" class="form-input" style="flex:1;">
                  <option value="">{{ idx === 0 ? 'Sélectionner un employé...' : 'Aucun' }}</option>
                  <option
                    v-for="e in availableEmployes(idx)"
                    :key="e.id"
                    :value="e.id"
                  >
                    {{ e.prenom }} {{ e.nom }} — {{ e.poste?.titre_poste }}
                  </option>
                </select>
                <button
                  v-if="idx > 0"
                  type="button"
                  class="btn btn-secondary btn-sm"
                  @click="removeEmploye(idx)"
                  style="padding:0.3rem 0.5rem; color:var(--status-danger); flex-shrink:0;"
                >
                  <XIcon :size="13" />
                </button>
              </div>
            </div>

            <!-- Add employee button (max 4) -->
            <button
              v-if="form.employeIds.length < 4"
              type="button"
              class="btn btn-secondary btn-sm"
              @click="addEmploye"
              style="width:100%; border-style:dashed;"
            >
              <PlusIcon :size="13" /> Ajouter un employé
            </button>

            <!-- Preview -->
            <div v-if="form.employeIds[0]" class="preview-box">
              <div class="preview-title">Aperçu du groupe</div>
              <div class="preview-members">
                <div
                  v-for="(empId, idx) in form.employeIds.filter(id => id)"
                  :key="idx"
                  class="preview-member"
                >
                  <div class="emp-avatar" :class="avatarClass(idx)">{{ initialsById(empId) }}</div>
                  {{ nameById(empId) }}
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeCreateModal">Annuler</button>
            <button class="btn btn-primary" :disabled="!form.nom || !form.employeIds[0] || creating" @click="createJournal">
              <span v-if="creating" class="spinner-xs"></span>
              {{ creating ? 'Création...' : 'Créer le Journal' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ENTRY DETAIL / CHAT MODAL -->
    <Teleport to="body">
      <div v-if="showEntryModal" class="modal-overlay" @click.self="closeEntryModal">
        <div class="modal-box modal-box-lg">
          <div class="modal-header">
            <h3 class="modal-title">
              <span v-if="activeEmp">{{ activeEmp.prenom }} {{ activeEmp.nom }}</span>
              <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal; margin-left:0.5rem;">
                {{ activeDate ? activeDate : selectedDate }} — {{ activeSlot }}
              </span>
            </h3>
            <button class="modal-close" @click="closeEntryModal"><XIcon :size="16" /></button>
          </div>

          <div class="modal-body">
            <!-- Section 1: Activité -->
            <div class="modal-section">
              <div class="modal-section-title">Activité</div>
              <div class="form-group">
                <label class="form-label">Description</label>
                <textarea v-model="modalForm.contenu" class="form-input" rows="3" placeholder="Description de l'activité..." style="resize:vertical;"></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Lien(s)</label>
                <textarea v-model="modalForm.lien" class="form-input" rows="2" placeholder="https://lien1.com&#10;https://lien2.com" style="resize:vertical; font-size:0.8rem;"></textarea>
              </div>
            </div>

            <!-- Section 2: Messages (Chat) -->
            <div class="modal-section">
              <div class="modal-section-title">Messages</div>
              <div class="chat-thread">
                <div v-if="!modalForm.commentaire && !modalForm.admin_commentaire" class="chat-empty">
                  <MessageSquareIcon :size="20" style="color:var(--text-muted);" />
                  <span>Aucun message pour cette activité</span>
                </div>
                <!-- Employee message (left) -->
                <div v-if="modalForm.commentaire" class="chat-msg chat-msg-emp">
                  <div class="chat-msg-avatar emp-av">{{ activeEmp ? initials(activeEmp) : '?' }}</div>
                  <div class="chat-msg-bubble emp-bubble">
                    <div class="chat-msg-author">{{ activeEmp?.prenom }}</div>
                    <div>{{ modalForm.commentaire }}</div>
                  </div>
                </div>
                <!-- Admin message (right) -->
                <div v-if="modalForm.admin_commentaire" class="chat-msg chat-msg-admin">
                  <div class="chat-msg-bubble admin-bubble">
                    <div class="chat-msg-author" style="text-align:right;">Administrateur</div>
                    <div>{{ modalForm.admin_commentaire }}</div>
                  </div>
                  <div class="chat-msg-avatar admin-av">A</div>
                </div>
              </div>

              <!-- Employee remark edit (admin can edit) -->
              <div class="form-group" style="margin-top:0.75rem;">
                <label class="form-label" style="color:var(--status-success);">Remarque employé (éditable)</label>
                <textarea v-model="modalForm.commentaire" class="form-input" rows="2" placeholder="Remarque de l'employé..." style="resize:vertical; border-color:#10b98140;"></textarea>
              </div>

              <!-- Admin reply -->
              <div class="form-group" style="margin-top:0.5rem;">
                <label class="form-label" style="color:var(--status-danger);">Votre réponse (Admin)</label>
                <textarea v-model="modalForm.admin_commentaire" class="form-input" rows="2" placeholder="Votre commentaire apparaîtra en rouge pour l'employé..." style="resize:vertical; border-color:#ef444440;"></textarea>
              </div>
            </div>

            <!-- Section 3: Évaluation (Admin only) -->
            <div class="modal-section">
              <div class="modal-section-title">Évaluation</div>
              <div class="eval-group">
                <button
                  v-for="opt in evalOptions"
                  :key="opt.value"
                  type="button"
                  class="eval-option-btn"
                  :class="[opt.cls, modalForm.evaluation_type === opt.value ? 'eval-selected' : '']"
                  @click="modalForm.evaluation_type = opt.value"
                >
                  {{ opt.label }}
                </button>
              </div>
              <div v-if="modalForm.evaluation_type === 'PRIME' || modalForm.evaluation_type === 'PENALITE'" class="form-group" style="margin-top:0.75rem;">
                <label class="form-label">
                  Montant (€)
                  <span v-if="modalForm.evaluation_type === 'PENALITE'" style="color:var(--status-danger);">— Pénalité</span>
                  <span v-else style="color:var(--status-success);">— Prime</span>
                </label>
                <input
                  v-model.number="modalForm.evaluation_montant"
                  type="number"
                  min="0"
                  step="0.01"
                  class="form-input"
                  placeholder="Ex: 50"
                  style="max-width:180px;"
                />
                <p style="font-size:0.7rem; color:var(--text-muted); margin-top:0.25rem;">Le montant n'est pas visible par l'employé.</p>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeEntryModal">Annuler</button>
            <button class="btn btn-primary" :disabled="savingEntry" @click="saveEntryModal">
              <span v-if="savingEntry" class="spinner-xs"></span>
              {{ savingEntry ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  BookOpen as BookOpenIcon,
  Plus as PlusIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  X as XIcon,
  Check as CheckIcon,
  Link as LinkIcon,
  MessageSquare as MessageSquareIcon,
  Menu as MenuIcon,
  Edit as EditIcon,
  Save as SaveIcon
} from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })

const CHIP_COLORS = ['', 'member-chip-2', 'member-chip-3', 'member-chip-4']
const AVATAR_COLORS = ['', 'emp-avatar-2', 'emp-avatar-3', 'emp-avatar-4']
const COL_HEADER_COLORS = ['', 'col-header-2', 'col-header-3', 'col-header-4']

const evalOptions = [
  { value: 'NEUTRE', label: 'Neutre', cls: 'eval-neutre' },
  { value: 'PRIME', label: 'Prime', cls: 'eval-prime' },
  { value: 'PENALITE', label: 'Pénalité', cls: 'eval-penalite' }
]

// --- Time slots (08:00 to 20:00, every 30 min) ---
const timeSlots = []
for (let h = 8; h <= 19; h++) {
  timeSlots.push(`${String(h).padStart(2, '0')}:00`)
  timeSlots.push(`${String(h).padStart(2, '0')}:30`)
}
timeSlots.push('20:00')

// --- State ---
const journals = ref([])
const employes = ref([])
const selectedJournal = ref(null)
const entries = ref([])
const loadingJournals = ref(true)
const loadingEntries = ref(false)
const showCreateModal = ref(false)
const creating = ref(false)
const showSidebar = ref(true)

const editingTitle = ref(false)
const editTitleValue = ref('')
const savingTitle = ref(false)

const viewMode = ref('journalier')
const weekEmpId = ref(null)

const today = new Date().toISOString().split('T')[0]
const selectedDate = ref(today)

const adminRemark = ref('')
const savingAdmin = ref(false)

const form = ref({ nom: '', employeIds: ['', ''] })

// --- Computed ---
const weekDays = computed(() => {
  const date = new Date(selectedDate.value)
  let day = date.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  const monday = new Date(date)
  monday.setDate(date.getDate() + diffToMonday)
  const days = []
  for (let i = 0; i < 6; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    days.push({
      date: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: '2-digit' })
    })
  }
  return days
})

const currentEmployes = computed(() => {
  if (!selectedJournal.value) return []
  return journalEmployes(selectedJournal.value)
})

// --- Helpers ---
const journalEmployes = (j) => {
  return [j.employe1, j.employe2, j.employe3, j.employe4].filter(Boolean)
}

const memberChipClass = (idx) => CHIP_COLORS[idx] || ''
const avatarClass = (idx) => AVATAR_COLORS[idx] || ''
const colHeaderClass = (idx) => COL_HEADER_COLORS[idx] || ''

const initials = (emp) => {
  if (!emp) return '?'
  return `${(emp.prenom || '').charAt(0)}${(emp.nom || '').charAt(0)}`.toUpperCase()
}
const initialsById = (id) => {
  const e = employes.value.find(e => e.id === id)
  return e ? initials(e) : '?'
}
const nameById = (id) => {
  const e = employes.value.find(e => e.id === id)
  return e ? `${e.prenom} ${e.nom}` : '?'
}

const availableEmployes = (currentIdx) => {
  const selectedIds = form.value.employeIds.filter((id, i) => id && i !== currentIdx)
  return employes.value.filter(e => !selectedIds.includes(e.id))
}

const isCurrentSlot = (slot) => {
  if (selectedDate.value !== today) return false
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = now.getMinutes() < 30 ? '00' : '30'
  return `${h}:${m}` === slot
}

const getEntry = (employeId, heure, date = null) => {
  if (date) {
    return entries.value.find(e => e.employeId === employeId && e.heure === heure && e.date.startsWith(date)) || null
  }
  return entries.value.find(e => e.employeId === employeId && e.heure === heure) || null
}

const commentCount = (employeId, heure, date = null) => {
  const entry = getEntry(employeId, heure, date)
  if (!entry) return 0
  return (entry.commentaire ? 1 : 0) + (entry.admin_commentaire ? 1 : 0)
}

const evalLabel = (employeId, heure, date = null) => {
  const entry = getEntry(employeId, heure, date)
  const type = entry?.evaluation_type || 'NEUTRE'
  if (type === 'PRIME') return 'Prime'
  if (type === 'PENALITE') return 'Pénal.'
  return '—'
}

const evalClass = (employeId, heure, date = null) => {
  const entry = getEntry(employeId, heure, date)
  const type = entry?.evaluation_type || 'NEUTRE'
  if (type === 'PRIME') return 'eval-tag eval-tag-prime'
  if (type === 'PENALITE') return 'eval-tag eval-tag-penalite'
  return 'eval-tag eval-tag-neutre'
}

const getRemark = (employeId) => {
  const r = entries.value.filter(e => e.employeId === employeId && e.heure === 'REMARQUES')
  return r.map(e => e.contenu).join(' ')
}

// --- Load data ---
onMounted(async () => {
  await Promise.all([loadJournals(), loadEmployes()])
  if (window.innerWidth <= 900 && !selectedJournal.value) showSidebar.value = true
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 900 && !selectedJournal.value) showSidebar.value = true
  })
})

const loadJournals = async () => {
  loadingJournals.value = true
  try { journals.value = await $fetch('/api/journals') }
  catch (e) { console.error(e) }
  finally { loadingJournals.value = false }
}

const loadEmployes = async () => {
  try { employes.value = await $fetch('/api/equipe') }
  catch (e) { console.error(e) }
}

const loadEntries = async () => {
  if (!selectedJournal.value) return
  loadingEntries.value = true
  try {
    if (viewMode.value === 'journalier') {
      entries.value = await $fetch(`/api/journals/${selectedJournal.value.id}/entrees?date=${selectedDate.value}`)
    } else {
      const days = weekDays.value
      entries.value = await $fetch(`/api/journals/${selectedJournal.value.id}/entrees?startDate=${days[0].date}&endDate=${days[days.length - 1].date}`)
    }
    const aR = entries.value.find(e => e.employeId === selectedJournal.value.employe1Id && e.heure === 'REMARQUE_ADMIN')
    adminRemark.value = aR ? aR.contenu : ''
  } catch (e) {
    console.error(e)
    entries.value = []
  } finally {
    loadingEntries.value = false
  }
}

const saveAdminRemark = async () => {
  if (!selectedJournal.value) return
  savingAdmin.value = true
  try {
    const entrees = []
    if (adminRemark.value.trim()) {
      entrees.push({ employeId: selectedJournal.value.employe1Id, heure: 'REMARQUE_ADMIN', contenu: adminRemark.value.trim() })
    }
    await $fetch(`/api/journals/${selectedJournal.value.id}/entrees`, {
      method: 'POST',
      body: { date: selectedDate.value, entrees }
    })
    await loadEntries()
  } catch (e) {
    console.error(e)
  } finally {
    savingAdmin.value = false
  }
}

// --- Entry Modal ---
const showEntryModal = ref(false)
const activeEmployeId = ref(null)
const activeSlot = ref(null)
const activeDate = ref(null)
const savingEntry = ref(false)
const modalForm = ref({ contenu: '', commentaire: '', admin_commentaire: '', lien: '', evaluation_type: 'NEUTRE', evaluation_montant: null })

const activeEmp = computed(() => {
  if (!activeEmployeId.value) return null
  return currentEmployes.value.find(e => e.id === activeEmployeId.value) || null
})

const openEntryModal = (empId, slot, dateStr = null) => {
  activeEmployeId.value = empId
  activeSlot.value = slot
  activeDate.value = dateStr
  const entry = getEntry(empId, slot, dateStr)
  modalForm.value = {
    contenu: entry?.contenu || '',
    commentaire: entry?.commentaire || '',
    admin_commentaire: entry?.admin_commentaire || '',
    lien: entry?.lien || '',
    evaluation_type: entry?.evaluation_type || 'NEUTRE',
    evaluation_montant: entry?.evaluation_montant ?? null
  }
  showEntryModal.value = true
}

const closeEntryModal = () => {
  showEntryModal.value = false
  activeEmployeId.value = null
  activeSlot.value = null
  activeDate.value = null
}

const saveEntryModal = async () => {
  if (!activeEmployeId.value || !activeSlot.value) return
  savingEntry.value = true
  try {
    const targetDate = activeDate.value || selectedDate.value
    await $fetch(`/api/journals/${selectedJournal.value.id}/entrees`, {
      method: 'POST',
      body: {
        date: targetDate,
        entrees: [{
          employeId: activeEmployeId.value,
          date: targetDate,
          heure: activeSlot.value,
          contenu: modalForm.value.contenu,
          commentaire: modalForm.value.commentaire,
          lien: modalForm.value.lien,
          admin_commentaire: modalForm.value.admin_commentaire,
          evaluation_type: modalForm.value.evaluation_type,
          evaluation_montant: (modalForm.value.evaluation_type === 'PRIME' || modalForm.value.evaluation_type === 'PENALITE')
            ? (modalForm.value.evaluation_montant || null)
            : null
        }]
      }
    })
    await loadEntries()
    closeEntryModal()
  } catch (e) {
    console.error(e)
    alert('Erreur lors de la sauvegarde.')
  } finally {
    savingEntry.value = false
  }
}

const selectJournal = async (j) => {
  selectedJournal.value = j
  weekEmpId.value = j.employe1Id
  if (window.innerWidth <= 900) showSidebar.value = false
  await loadEntries()
}

const prevDay = () => {
  const d = new Date(selectedDate.value)
  d.setDate(d.getDate() - 1)
  selectedDate.value = d.toISOString().split('T')[0]
  loadEntries()
}
const nextDay = () => {
  const d = new Date(selectedDate.value)
  d.setDate(d.getDate() + 1)
  selectedDate.value = d.toISOString().split('T')[0]
  loadEntries()
}
const goToday = () => { selectedDate.value = today; loadEntries() }

// --- Create Modal ---
const openCreateModal = () => {
  form.value = { nom: '', employeIds: ['', ''] }
  showCreateModal.value = true
}
const closeCreateModal = () => { showCreateModal.value = false }

const addEmploye = () => {
  if (form.value.employeIds.length < 4) form.value.employeIds.push('')
}
const removeEmploye = (idx) => {
  form.value.employeIds.splice(idx, 1)
}

const createJournal = async () => {
  creating.value = true
  try {
    const ids = form.value.employeIds.filter(id => id)
    const newJ = await $fetch('/api/journals', {
      method: 'POST',
      body: {
        nom: form.value.nom,
        employe1Id: ids[0],
        employe2Id: ids[1] || null,
        employe3Id: ids[2] || null,
        employe4Id: ids[3] || null
      }
    })
    await loadJournals()
    closeCreateModal()
    const found = journals.value.find(j => j.id === newJ.id)
    if (found) await selectJournal(found)
  } catch (e) {
    console.error(e)
  } finally {
    creating.value = false
  }
}

const startEditTitle = () => {
  editTitleValue.value = selectedJournal.value.nom
  editingTitle.value = true
}

const saveTitle = async () => {
  if (!editTitleValue.value.trim() || editTitleValue.value === selectedJournal.value.nom) {
    editingTitle.value = false
    return
  }
  savingTitle.value = true
  try {
    const updated = await $fetch(`/api/journals/${selectedJournal.value.id}`, {
      method: 'PUT',
      body: { nom: editTitleValue.value }
    })
    selectedJournal.value.nom = updated.nom
    const j = journals.value.find(x => x.id === selectedJournal.value.id)
    if (j) j.nom = updated.nom
    editingTitle.value = false
  } catch (e) {
    console.error(e)
    alert("Erreur lors du renommage")
  } finally {
    savingTitle.value = false
  }
}
</script>

<style scoped>
.journal-badge {
  width: 32px; height: 32px; border-radius: 8px;
  background: linear-gradient(135deg, var(--accent-primary), #7c3aed);
  color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.journal-layout { display: grid; grid-template-columns: 280px 1fr; gap: 1.25rem; align-items: start; min-height: 600px; }
.journal-layout.sidebar-hidden { grid-template-columns: 1fr; }

.journal-list-panel {
  background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: 12px;
  overflow: hidden; position: sticky; top: 1rem;
}
.panel-header { display: flex; align-items: center; justify-content: space-between; padding: 0.875rem 1rem; border-bottom: 1px solid var(--border-light); background: var(--bg-surface-hover); }
.panel-title { font-size: 0.8125rem; font-weight: 700; color: var(--text-primary); }

.journal-items { display: flex; flex-direction: column; }
.journal-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; text-align: left; width: 100%; border-bottom: 1px solid var(--border-light); transition: background 0.12s; }
.journal-item:last-child { border-bottom: none; }
.journal-item:hover { background: var(--bg-surface-hover); }
.journal-item-active { background: var(--accent-primary)10 !important; border-left: 3px solid var(--accent-primary); }

.journal-item-icon { position: relative; width: 36px; height: 36px; flex-shrink: 0; }
.journal-item-icon > span { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: var(--accent-primary); color: white; font-size: 0.7rem; font-weight: 700; }
.journal-item-icon2 { position: absolute; bottom: -2px; right: -4px; width: 22px !important; height: 22px !important; font-size: 0.6rem !important; background: #7c3aed !important; border: 2px solid var(--bg-surface); border-radius: 50%; display: flex !important; align-items: center; justify-content: center; color: white; }
.journal-item-name { font-size: 0.8125rem; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; }
.journal-item-members { font-size: 0.7rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; }

.journal-viewer { background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: 12px; overflow: hidden; }
.journal-empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 6rem 2rem; gap: 0.75rem; text-align: center; }
.journal-empty-icon { width: 64px; height: 64px; border-radius: 16px; background: var(--bg-surface-hover); border: 2px dashed var(--border-light); display: flex; align-items: center; justify-content: center; color: var(--text-muted); margin-bottom: 0.5rem; }

.viewer-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid var(--border-light); background: var(--bg-surface-hover); flex-wrap: wrap; gap: 0.75rem; }
.viewer-title { font-size: 1rem; font-weight: 700; margin-bottom: 0.25rem; }
.viewer-members { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.member-chip { display: inline-flex; align-items: center; background: var(--accent-primary)15; color: var(--accent-primary); font-size: 0.7rem; font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 99px; border: 1px solid var(--accent-primary)30; }
.member-chip-2 { background: #7c3aed15; color: #7c3aed; border-color: #7c3aed30; }
.member-chip-3 { background: #0ea5e915; color: #0ea5e9; border-color: #0ea5e930; }
.member-chip-4 { background: #f59e0b15; color: #d97706; border-color: #f59e0b30; }

.view-toggle { display: flex; gap: 0.25rem; background: var(--bg-surface); padding: 0.25rem; border-radius: 8px; border: 1px solid var(--border-light); margin-right: 0.5rem; }
.date-input { font-size: 0.8125rem; color: var(--text-primary); background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: 6px; padding: 0.3rem 0.5rem; outline: none; }

.journal-grid-wrapper { overflow-x: auto; max-height: 600px; overflow-y: auto; }
.journal-table { width: 100%; border-collapse: collapse; font-size: 0.8125rem; }
.journal-table thead { position: sticky; top: 0; z-index: 2; }
.journal-table th { background: var(--bg-surface-hover); padding: 0.75rem 0.75rem; text-align: left; font-weight: 600; border-bottom: 2px solid var(--border-light); white-space: nowrap; }
.time-col { width: 70px; }
.entry-col { min-width: 180px; }
.eval-col { width: 55px; text-align: center; font-size: 0.7rem; color: var(--text-muted); }

.col-header { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; }
.col-header-2 { color: #7c3aed; }
.col-header-3 { color: #0ea5e9; }
.col-header-4 { color: #d97706; }

.emp-avatar { width: 24px; height: 24px; border-radius: 50%; background: var(--accent-primary); color: white; font-size: 0.6rem; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.emp-avatar-2 { background: #7c3aed; }
.emp-avatar-3 { background: #0ea5e9; }
.emp-avatar-4 { background: #d97706; }

.journal-table td { padding: 0.35rem 0.5rem; border-bottom: 1px solid var(--border-light); vertical-align: top; }
.time-cell { font-size: 0.75rem; font-weight: 600; color: var(--text-muted); white-space: nowrap; padding-top: 0.7rem; }
.current-time-row { background: var(--accent-primary)08 !important; }
.current-time-row .time-cell { color: var(--accent-primary); font-weight: 700; }

.entry-content { display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.8125rem; color: var(--text-primary); background: var(--bg-surface-hover); border: 1px solid var(--border-light); border-radius: 6px; padding: 0.35rem 0.5rem; line-height: 1.4; }
.entry-auto { background: #10b98110; border-color: #10b98130; }
.entry-auto-badge { display: inline-flex; align-items: center; gap: 0.2rem; background: #10b981; color: white; font-size: 0.6rem; font-weight: 700; padding: 0.1rem 0.35rem; border-radius: 99px; flex-shrink: 0; margin-right: 0.25rem; }
.entry-text { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-size: 0.8rem; }
.entry-empty { color: var(--text-muted); font-size: 0.75rem; padding: 0.2rem 0; display: flex; align-items: center; gap: 0.25rem; }

.entry-action-row { display: flex; align-items: center; gap: 0.15rem; flex-shrink: 0; }
.icon-btn-view { background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 0.15rem; border-radius: 4px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; position: relative; }
.icon-btn-view:hover { color: var(--accent-primary); background: var(--accent-primary)10; }

.comment-icon-btn { position: relative; }
.comment-icon-btn.has-comments { color: var(--accent-primary); }
.comment-icon-btn-empty { color: var(--text-muted); opacity: 0.5; }
.comment-icon-btn-empty:hover { opacity: 1; }
.comment-badge { position: absolute; top: -5px; right: -5px; background: var(--accent-primary); color: white; font-size: 0.55rem; font-weight: 700; width: 14px; height: 14px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1.5px solid var(--bg-surface); }

/* Eval column */
.eval-cell { text-align: center; vertical-align: middle; }
.eval-btn { background: none; border: none; cursor: pointer; padding: 0.2rem; width: 100%; display: flex; justify-content: center; }
.eval-tag { font-size: 0.65rem; font-weight: 700; padding: 0.15rem 0.4rem; border-radius: 99px; white-space: nowrap; }
.eval-tag-prime { background: #10b98115; color: #059669; border: 1px solid #10b98130; }
.eval-tag-penalite { background: #ef444415; color: #dc2626; border: 1px solid #ef444430; }
.eval-tag-neutre { color: var(--text-muted); }

/* Remarks */
.remarks-row { display: grid; gap: 0; border-top: 2px solid var(--border-light); }
.remarks-card { padding: 1rem 1.25rem; border-right: 1px solid var(--border-light); }
.remarks-card:last-child { border-right: none; }
.remarks-card-alt { background: #7c3aed05; }
.remarks-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-muted); margin-bottom: 0.5rem; }
.remarks-content { font-size: 0.8125rem; color: var(--text-primary); line-height: 1.5; }
.remarks-empty { color: var(--text-muted); font-style: italic; font-size: 0.8125rem; }
.remarks-textarea { width: 100%; font-size: 0.8125rem; font-family: inherit; color: var(--text-primary); background: var(--bg-surface-hover); border: 1px solid var(--border-light); border-radius: 6px; padding: 0.5rem; outline: none; resize: vertical; box-sizing: border-box; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,0.55); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 2rem; box-sizing: border-box; }
.modal-box { background: var(--bg-surface); border-radius: 16px; width: 100%; max-width: 500px; box-shadow: 0 24px 60px rgba(0,0,0,0.3); overflow: hidden; display: flex; flex-direction: column; max-height: calc(100vh - 4rem); }
.modal-box-lg { max-width: 600px; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-light); }
.modal-title { font-size: 1rem; font-weight: 700; }
.modal-close { background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 0.25rem; border-radius: 4px; }
.modal-close:hover { color: var(--text-primary); background: var(--bg-surface-hover); }
.modal-body { padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; overflow-y: auto; }
.modal-footer { padding: 1rem 1.5rem; border-top: 1px solid var(--border-light); display: flex; justify-content: flex-end; gap: 0.5rem; }

.modal-section { display: flex; flex-direction: column; gap: 0.75rem; }
.modal-section + .modal-section { padding-top: 1rem; border-top: 1px solid var(--border-light); }
.modal-section-title { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }

/* Chat */
.chat-thread { display: flex; flex-direction: column; gap: 0.5rem; background: var(--bg-surface-hover); border: 1px solid var(--border-light); border-radius: 10px; padding: 0.75rem; min-height: 60px; }
.chat-empty { display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); font-size: 0.8125rem; justify-content: center; padding: 0.5rem 0; }
.chat-msg { display: flex; align-items: flex-end; gap: 0.5rem; }
.chat-msg-emp { justify-content: flex-start; }
.chat-msg-admin { justify-content: flex-end; }
.chat-msg-avatar { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 700; color: white; flex-shrink: 0; }
.emp-av { background: var(--accent-primary); }
.admin-av { background: #ef4444; }
.chat-msg-bubble { max-width: 75%; padding: 0.5rem 0.75rem; border-radius: 12px; font-size: 0.8125rem; line-height: 1.4; }
.emp-bubble { background: #10b98110; border: 1px solid #10b98130; border-bottom-left-radius: 3px; }
.admin-bubble { background: #ef444410; border: 1px solid #ef444430; border-bottom-right-radius: 3px; }
.chat-msg-author { font-size: 0.65rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.2rem; }

/* Evaluation */
.eval-group { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.eval-option-btn { padding: 0.4rem 1rem; border-radius: 99px; border: 2px solid var(--border-light); background: var(--bg-surface-hover); font-size: 0.8125rem; font-weight: 600; cursor: pointer; transition: all 0.15s; }
.eval-option-btn:hover { border-color: var(--text-muted); }
.eval-neutre.eval-selected { background: var(--bg-surface-hover); border-color: var(--text-muted); color: var(--text-primary); }
.eval-prime { color: #059669; }
.eval-prime.eval-selected { background: #10b98120; border-color: #10b981; color: #059669; }
.eval-penalite { color: #dc2626; }
.eval-penalite.eval-selected { background: #ef444420; border-color: #ef4444; color: #dc2626; }

/* Form */
.form-group { display: flex; flex-direction: column; gap: 0.375rem; }
.form-label { font-size: 0.8125rem; font-weight: 600; color: var(--text-primary); }
.preview-box { background: var(--bg-surface-hover); border: 1px solid var(--border-light); border-radius: 8px; padding: 1rem; }
.preview-title { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-muted); margin-bottom: 0.75rem; }
.preview-members { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
.preview-member { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; font-weight: 500; }

.loading-state { display: flex; align-items: center; justify-content: center; gap: 0.75rem; padding: 2rem; color: var(--text-muted); font-size: 0.875rem; }
.spinner-sm { width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--border-light); border-top-color: var(--accent-primary); animation: spin 0.8s linear infinite; }
.spinner-xs { width: 14px; height: 14px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; animation: spin 0.8s linear infinite; display: inline-block; }
@keyframes spin { to { transform: rotate(360deg); } }

.empty-list { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem 1.5rem; text-align: center; color: var(--text-secondary); font-size: 0.8125rem; gap: 0.5rem; }

@media (max-width: 900px) {
  .journal-layout { grid-template-columns: 1fr !important; }
  .journal-list-panel { position: static; }
}
</style>
