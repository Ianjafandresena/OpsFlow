<template>
  <div class="animate-fade-in">
    <!-- Header -->
    <div class="page-header" style="margin-bottom: 1.5rem;">
      <div>
        <h1 class="page-title" style="display:flex; align-items:center; gap:0.625rem;">
          <span class="journal-badge-emp"><BookOpenIcon :size="16" /></span>
          Mon Journal
        </h1>
        <p class="page-subtitle" style="margin-bottom:0;">
          Suivez et complétez votre activité quotidienne
        </p>
      </div>
    </div>

    <!-- No journal state -->
    <div v-if="!loadingJournals && myJournals.length === 0" class="card empty-journal-state">
      <div style="text-align:center; padding:3rem 2rem;">
        <div class="journal-empty-icon-emp">
          <BookOpenIcon :size="28" />
        </div>
        <p style="font-weight:600; margin:1rem 0 0.5rem;">Aucun journal actif</p>
        <p style="color:var(--text-secondary); font-size:0.875rem; max-width:360px; margin:0 auto;">
          Votre administrateur doit créer un journal et vous y associer pour que vous puissiez compléter votre activité quotidienne.
        </p>
      </div>
    </div>

    <div v-else-if="loadingJournals" class="loading-state">
      <div class="spinner-sm"></div>
      <span>Chargement de vos journaux...</span>
    </div>

    <!-- Journal viewer -->
    <div v-else>
      <!-- Journal tabs (if multiple journals) -->
      <div v-if="myJournals.length > 1" class="journal-tabs">
        <button
          v-for="j in myJournals"
          :key="j.id"
          class="journal-tab"
          :class="{ 'journal-tab-active': selectedJournal?.id === j.id }"
          @click="selectJournal(j)"
        >
          <BookOpenIcon :size="13" />
          {{ j.nom }}
        </button>
      </div>

      <div v-if="selectedJournal" class="card journal-card">
        <!-- Card Header -->
        <div class="journal-card-header">
          <div>
            <h2 class="journal-card-title">{{ selectedJournal.nom }}</h2>
            <div class="viewer-members">
              <span class="member-chip">{{ selectedJournal.employe1.prenom }} {{ selectedJournal.employe1.nom }}</span>
              <span v-if="selectedJournal.employe2" class="member-chip member-chip-2">{{ selectedJournal.employe2.prenom }} {{ selectedJournal.employe2.nom }}</span>
            </div>
          </div>
          <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
            <div class="view-toggle" style="display:flex; gap:0.25rem; background: var(--bg-surface); padding: 0.25rem; border-radius: 8px; border: 1px solid var(--border-light); margin-right: 0.5rem;">
              <button class="btn btn-sm" :class="viewMode === 'journalier' ? 'btn-primary' : 'btn-secondary'" @click="viewMode = 'journalier'; loadEntries()" style="padding: 0.2rem 0.5rem;">Jour</button>
              <button class="btn btn-sm" :class="viewMode === 'semaine' ? 'btn-primary' : 'btn-secondary'" @click="viewMode = 'semaine'; loadEntries()" style="padding: 0.2rem 0.5rem;">Semaine</button>
            </div>
            <button class="btn btn-secondary btn-sm" @click="prevDay"><ChevronLeftIcon :size="14" /></button>
            <input type="date" v-model="selectedDate" class="date-input" @change="loadEntries" />
            <button class="btn btn-secondary btn-sm" @click="nextDay"><ChevronRightIcon :size="14" /></button>
            <button class="btn btn-secondary btn-sm" @click="goToday">Aujourd'hui</button>
            <button
              class="btn btn-primary btn-sm"
              :disabled="saving"
              @click="saveEntries"
            >
              <span v-if="saving" class="spinner-xs"></span>
              <SaveIcon v-else :size="13" />
              {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loadingEntries" class="loading-state" style="padding:3rem;">
          <div class="spinner-sm"></div>
          <span>Chargement du journal...</span>
        </div>

        <!-- Grid -->
        <div v-else-if="viewMode === 'journalier'" class="journal-grid-wrapper">
          <table class="journal-table">
            <thead>
              <tr>
                <th class="time-col">Heure</th>
                <!-- My column (editable) -->
                <th class="entry-col">
                  <div class="col-header">
                    <div class="emp-avatar emp-avatar-me">{{ initials(myEmploye) }}</div>
                    {{ myEmploye ? `${myEmploye.prenom} ${myEmploye.nom}` : 'Moi' }}
                    <span class="col-me-badge">Moi</span>
                  </div>
                </th>
                <!-- Partner column (editable) -->
                <th v-if="partnerEmploye" class="entry-col">
                  <div class="col-header">
                    <div class="emp-avatar emp-avatar-2">{{ initials(partnerEmploye) }}</div>
                    {{ partnerEmploye.prenom }} {{ partnerEmploye.nom }}
                    <span class="col-partner-badge">Binôme</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="slot in timeSlots"
                :key="slot"
                :class="{ 'current-time-row': isCurrentSlot(slot) }"
              >
                <td class="time-cell">{{ slot }}</td>

                <!-- My editable cell -->
                <td class="entry-cell entry-cell-mine">
                  <div class="cell-wrapper" v-if="localGrid[myEmployeId] && localGrid[myEmployeId][slot]">
                    <!-- If auto-generated from a completed task -->
                    <div
                      v-if="getEntryRaw(myEmployeId, slot)?.tacheId && !isEditing(myEmployeId, slot)"
                      class="entry-content entry-auto"
                    >
                      <div style="display:flex; justify-content:space-between; width:100%; align-items:flex-start;">
                        <div>
                          <span class="entry-auto-badge"><CheckIcon :size="10" /> Tâche</span>
                          {{ localGrid[myEmployeId][slot].contenu || getEntryRaw(myEmployeId, slot)?.contenu }}
                        </div>
                        <button class="edit-btn" @click="startEditing(myEmployeId, slot)">
                          <EditIcon :size="11" />
                        </button>
                      </div>
                      <div v-if="localGrid[myEmployeId][slot].commentaire" class="entry-comment">
                        <strong>Remarque:</strong> {{ localGrid[myEmployeId][slot].commentaire }}
                      </div>
                      <a v-if="localGrid[myEmployeId][slot].lien" :href="localGrid[myEmployeId][slot].lien" target="_blank" class="entry-link" @click.stop>
                        <LinkIcon :size="10" /> Lien attaché
                      </a>
                    </div>
                    <!-- Normal cell -->
                    <div v-else class="edit-stack">
                      <div style="position:relative;">
                        <textarea
                          v-model="localGrid[myEmployeId][slot].contenu"
                          class="entry-textarea"
                          :class="{ 'entry-textarea-filled': localGrid[myEmployeId][slot].contenu.trim() }"
                          :placeholder="isCurrentSlot(slot) ? 'Activité en cours...' : 'Activité...'"
                          rows="1"
                          @input="autoResize($event)"
                        />
                        <div class="cell-actions">
                          <button type="button" @click="openEntryModal(myEmployeId, slot)" class="icon-btn" title="Détails / Commenter" style="opacity: 0.7;">
                            <EyeIcon :size="14" />
                          </button>
                        </div>
                      </div>
                      
                      <!-- Chat bubble for Comment (Read-only view) -->
                      <div class="chat-bubble-view comment-bubble" v-if="localGrid[myEmployeId][slot].commentaire">
                        <MessageSquareIcon :size="12" class="bubble-icon" />
                        <span class="bubble-text">{{ localGrid[myEmployeId][slot].commentaire }}</span>
                      </div>

                      <!-- Chat bubble for Link (Read-only view) -->
                      <template v-if="localGrid[myEmployeId][slot].lien">
                        <a v-for="(lnk, idx) in localGrid[myEmployeId][slot].lien.split(/[\\s\\n]+/).filter(l => l.trim() !== '')" :key="idx" 
                           :href="lnk" target="_blank" class="chat-bubble-view link-bubble">
                          <LinkIcon :size="12" class="bubble-icon" />
                          <span class="bubble-text">Lien {{ idx + 1 }}</span>
                        </a>
                      </template>

                      <!-- Admin comment (read only) -->
                      <div class="chat-bubble-input admin-bubble" v-if="getEntryRaw(myEmployeId, slot)?.admin_commentaire">
                        <MessageSquareIcon :size="12" class="bubble-icon" />
                        <div class="bubble-text">{{ getEntryRaw(myEmployeId, slot)?.admin_commentaire }}</div>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Partner editable cell -->
                <td v-if="partnerEmploye" class="entry-cell entry-cell-partner">
                  <div class="cell-wrapper" v-if="localGrid[partnerEmployeId] && localGrid[partnerEmployeId][slot]">
                    <div
                      v-if="getEntryRaw(partnerEmployeId, slot)?.tacheId && !isEditing(partnerEmployeId, slot)"
                      class="entry-content entry-auto"
                    >
                      <div style="display:flex; justify-content:space-between; width:100%; align-items:flex-start;">
                        <div>
                          <span class="entry-auto-badge"><CheckIcon :size="10" /> Tâche</span>
                          {{ localGrid[partnerEmployeId][slot].contenu || getEntryRaw(partnerEmployeId, slot)?.contenu }}
                        </div>
                        <button class="edit-btn" @click="startEditing(partnerEmployeId, slot)">
                          <EditIcon :size="11" />
                        </button>
                      </div>
                      <div v-if="localGrid[partnerEmployeId][slot].commentaire" class="entry-comment">
                        <strong>Remarque:</strong> {{ localGrid[partnerEmployeId][slot].commentaire }}
                      </div>
                      <a v-if="localGrid[partnerEmployeId][slot].lien" :href="localGrid[partnerEmployeId][slot].lien" target="_blank" class="entry-link" @click.stop>
                        <LinkIcon :size="10" /> Lien attaché
                      </a>
                    </div>
                    <!-- Normal cell -->
                    <div v-else class="edit-stack">
                      <div style="position:relative;">
                        <textarea
                          v-model="localGrid[partnerEmployeId][slot].contenu"
                          class="entry-textarea"
                          :class="{ 'entry-textarea-filled': localGrid[partnerEmployeId][slot].contenu.trim() }"
                          :placeholder="isCurrentSlot(slot) ? 'Activité en cours...' : 'Activité...'"
                          rows="1"
                          @input="autoResize($event)"
                        />
                        <div class="cell-actions">
                          <button type="button" @click="openEntryModal(partnerEmployeId, slot)" class="icon-btn" title="Détails / Commenter" style="opacity: 0.7;">
                            <EyeIcon :size="14" />
                          </button>
                        </div>
                      </div>
                      
                      <!-- Chat bubble for Comment (Read-only view) -->
                      <div class="chat-bubble-view comment-bubble" v-if="localGrid[partnerEmployeId][slot].commentaire">
                        <MessageSquareIcon :size="12" class="bubble-icon" />
                        <span class="bubble-text">{{ localGrid[partnerEmployeId][slot].commentaire }}</span>
                      </div>

                      <!-- Chat bubble for Link (Read-only view) -->
                      <template v-if="localGrid[partnerEmployeId][slot].lien">
                        <a v-for="(lnk, idx) in localGrid[partnerEmployeId][slot].lien.split(/[\\s\\n]+/).filter(l => l.trim() !== '')" :key="idx" 
                           :href="lnk" target="_blank" class="chat-bubble-view link-bubble">
                          <LinkIcon :size="12" class="bubble-icon" />
                          <span class="bubble-text">Lien {{ idx + 1 }}</span>
                        </a>
                      </template>

                      <!-- Admin comment (read only) -->
                      <div class="chat-bubble-input admin-bubble" v-if="getEntryRaw(partnerEmployeId, slot)?.admin_commentaire">
                        <MessageSquareIcon :size="12" class="bubble-icon" />
                        <div class="bubble-text">{{ getEntryRaw(partnerEmployeId, slot)?.admin_commentaire }}</div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Weekly Grid -->
        <div v-else-if="viewMode === 'semaine'" class="journal-grid-wrapper">
          <div style="display:flex; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--bg-surface-hover); border-bottom: 1px solid var(--border-light);">
            <span style="font-size: 0.8125rem; font-weight: 600; color: var(--text-secondary); display:flex; align-items:center;">Voir l'employé:</span>
            <button class="btn btn-sm" :class="weekEmpId === myEmployeId ? 'btn-primary' : 'btn-secondary'" @click="weekEmpId = myEmployeId; loadEntries()">Moi ({{ myEmploye?.prenom }})</button>
            <button v-if="partnerEmployeId" class="btn btn-sm" :class="weekEmpId === partnerEmployeId ? 'btn-primary' : 'btn-secondary'" @click="weekEmpId = partnerEmployeId; loadEntries()">{{ partnerEmploye?.prenom }}</button>
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
                  <div v-if="localGrid[day.date] && localGrid[day.date][slot]" class="cell-wrapper">
                    <!-- Content -->
                    <div class="entry-content" v-if="!isEditing(weekEmpId, day.date + slot)">
                      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <div style="white-space: pre-wrap; font-size: 0.75rem;">{{ localGrid[day.date][slot].contenu || '—' }}</div>
                        <button class="icon-btn" @click="openEntryModal(weekEmpId, slot, day.date)" title="Détails" style="opacity:0.7;"><EyeIcon :size="12" /></button>
                      </div>
                      <div v-if="localGrid[day.date][slot].commentaire" class="chat-bubble-view comment-bubble">
                        <MessageSquareIcon :size="10" class="bubble-icon" />
                        <span class="bubble-text" style="font-size:0.7rem;">{{ localGrid[day.date][slot].commentaire }}</span>
                      </div>
                      <template v-if="localGrid[day.date][slot].lien">
                        <a v-for="(lnk, idx) in localGrid[day.date][slot].lien.split(/[\\s\\n]+/).filter(l => l.trim() !== '')" :key="idx" 
                           :href="lnk" target="_blank" class="chat-bubble-view link-bubble" style="font-size:0.7rem; padding:0.15rem 0.4rem;">
                          <LinkIcon :size="10" class="bubble-icon" />
                          <span class="bubble-text">Lien</span>
                        </a>
                      </template>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Remarks section (Only in daily view) -->
        <div v-if="viewMode === 'journalier' && !loadingEntries" class="remarks-row">
          <div class="remarks-card">
            <div class="remarks-label">Remarques Générales — Moi</div>
            <textarea
              v-model="localRemarks"
              class="remarks-textarea"
              placeholder="Ajouter une remarque globale pour la journée..."
              rows="4"
            />
          </div>
          <div v-if="partnerEmploye" class="remarks-card remarks-card-2">
            <div class="remarks-label">Remarques Générales — {{ partnerEmploye.prenom }}</div>
            <textarea
              v-model="partnerLocalRemarks"
              class="remarks-textarea"
              placeholder="Ajouter une remarque globale pour la journée..."
              rows="4"
            />
          </div>
        </div>

        <div v-if="viewMode === 'journalier' && !loadingEntries" class="remarks-row" style="border-top: none;">
          <div class="remarks-card" style="grid-column: span 2; background: var(--accent-primary)04;">
            <div class="remarks-label" style="color: var(--status-danger);">Remarque de l'Administrateur</div>
            <div class="remarks-content" style="color: var(--text-primary); font-style: italic;">
              <span v-if="adminRemark">{{ adminRemark }}</span>
              <span v-else class="remarks-empty">L'administrateur n'a laissé aucune remarque générale pour cette journée.</span>
            </div>
          </div>
        </div>

        <!-- Save success notification -->
        <div v-if="saveSuccess" class="save-toast">
          <CheckCircleIcon :size="14" /> Journal enregistré avec succès !
        </div>
      </div>
    </div>

    <!-- ENTRY MODAL FOR EMPLOYEE -->
    <Teleport to="body">
      <div v-if="showEntryModal" class="modal-overlay" @click.self="closeEntryModal">
        <div class="modal-box">
          <div class="modal-header">
            <h3 class="modal-title">
              Détails de l'Activité
              <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal; margin-left:0.5rem;">
                ({{ activeDate ? activeDate : selectedDate }} - {{ activeSlot }})
              </span>
            </h3>
            <button class="modal-close" @click="closeEntryModal"><XIcon :size="16" /></button>
          </div>

          <div class="modal-body" style="display:flex; flex-direction:column; gap:1rem;">
            <!-- Contenu -->
            <div class="form-group">
              <label class="form-label" style="color:var(--accent-primary);">Description de l'activité</label>
              <textarea
                v-model="localGrid[viewMode === 'journalier' ? activeEmployeId : activeDate][activeSlot].contenu"
                class="form-input"
                rows="3"
                placeholder="Ex: Rédaction du rapport..."
                style="resize:vertical;"
              ></textarea>
            </div>

            <!-- Commentaire -->
            <div class="form-group">
              <label class="form-label" style="color:var(--accent-primary);">Remarque spécifique (Employé)</label>
              <textarea
                v-model="localGrid[viewMode === 'journalier' ? activeEmployeId : activeDate][activeSlot].commentaire"
                class="form-input"
                rows="2"
                placeholder="Ex: En attente de validation par le client"
                style="resize:vertical;"
              ></textarea>
            </div>

            <!-- Lien -->
            <div class="form-group">
              <label class="form-label" style="color:var(--accent-primary);">Lien(s) attaché(s)</label>
              <textarea
                v-model="localGrid[viewMode === 'journalier' ? activeEmployeId : activeDate][activeSlot].lien"
                class="form-input"
                rows="2"
                placeholder="https://lien1.com&#10;https://lien2.com"
                style="resize:vertical; font-size: 0.8125rem;"
              ></textarea>
            </div>

            <!-- Admin Comment -->
            <div class="form-group" v-if="getEntryRaw(activeEmployeId, activeSlot, activeDate)?.admin_commentaire">
              <label class="form-label" style="color:var(--status-danger);">Réponse / Remarque (Admin)</label>
              <div class="chat-bubble-view admin-bubble-view" style="width:100%; border-radius:6px; font-size:0.8125rem;">
                <MessageSquareIcon :size="12" class="bubble-icon-view" />
                <span class="bubble-text-view">{{ getEntryRaw(activeEmployeId, activeSlot, activeDate).admin_commentaire }}</span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeEntryModal">Fermer</button>
            <button class="btn btn-primary" @click="closeEntryModal">Terminer</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  BookOpen as BookOpenIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Save as SaveIcon,
  Check as CheckIcon,
  Edit as EditIcon,
  Link as LinkIcon,
  CheckCircle as CheckCircleIcon,
  MessageSquare as MessageSquareIcon,
  Eye as EyeIcon,
  X as XIcon
} from 'lucide-vue-next'

definePageMeta({ layout: 'employe' })

// --- Time slots ---
const timeSlots = []
for (let h = 8; h <= 19; h++) {
  timeSlots.push(`${String(h).padStart(2, '0')}:00`)
  timeSlots.push(`${String(h).padStart(2, '0')}:30`)
}
timeSlots.push('20:00')

// --- Auth ---
const { user } = useAuth()

// --- State ---
const myJournals = ref([])
const selectedJournal = ref(null)
const entries = ref([])
const loadingJournals = ref(true)
const loadingEntries = ref(false)
const saving = ref(false)
const saveSuccess = ref(false)
const editingCells = ref(new Set())

const today = new Date().toISOString().split('T')[0]
const selectedDate = ref(today)

// Local editable grid: { [employeId]: { [heure]: { contenu, commentaire, lien } } }
const localGrid = ref({})
const localRemarks = ref('')
const partnerLocalRemarks = ref('')
const adminRemark = ref('')

// --- Computed ---
const myEmployeId = computed(() => user.value?.id || null)
const myEmploye = computed(() => {
  if (!selectedJournal.value || !myEmployeId.value) return null
  if (selectedJournal.value.employe1Id === myEmployeId.value) return selectedJournal.value.employe1
  return selectedJournal.value.employe2 || null
})

const partnerEmployeId = computed(() => {
  if (!selectedJournal.value || !myEmployeId.value) return null
  if (selectedJournal.value.employe1Id === myEmployeId.value) return selectedJournal.value.employe2Id
  return selectedJournal.value.employe1Id
})
const partnerEmploye = computed(() => {
  if (!selectedJournal.value || !partnerEmployeId.value) return null
  if (selectedJournal.value.employe1Id === partnerEmployeId.value) return selectedJournal.value.employe1
  return selectedJournal.value.employe2 || null
})

// --- Helpers ---
const initials = (emp) => {
  if (!emp) return '?'
  return `${(emp.prenom || '').charAt(0)}${(emp.nom || '').charAt(0)}`.toUpperCase()
}
const isCurrentSlot = (slot) => {
  if (selectedDate.value !== today) return false
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = now.getMinutes() < 30 ? '00' : '30'
  return `${h}:${m}` === slot
}
const getEntryRaw = (empId, heure, dateStr = null) => {
  if (dateStr) {
    return entries.value.find(e => e.employeId === empId && e.heure === heure && e.date.startsWith(dateStr)) || null
  }
  return entries.value.find(e => e.employeId === empId && e.heure === heure) || null
}
const isEditing = (empId, slotId) => editingCells.value.has(`${empId}-${slotId}`)
const startEditing = (empId, slotId) => {
  editingCells.value.add(`${empId}-${slotId}`)
}
const autoResize = (e) => {
  e.target.style.height = 'auto'
  e.target.style.height = e.target.scrollHeight + 'px'
}

const showEntryModal = ref(false)
const activeEmployeId = ref(null)
const activeSlot = ref(null)
const activeDate = ref(null)

const viewMode = ref('journalier') // 'journalier' or 'semaine'
const weekEmpId = ref(null)

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

const openEntryModal = (empId, slot, date = null) => {
  activeEmployeId.value = empId
  activeSlot.value = slot
  activeDate.value = date
  showEntryModal.value = true
}

const closeEntryModal = () => {
  showEntryModal.value = false
  activeEmployeId.value = null
  activeSlot.value = null
  activeDate.value = null
}

// --- Load data ---
onMounted(async () => {
  await loadJournals()
})

const loadJournals = async () => {
  loadingJournals.value = true
  try {
    const allJournals = await $fetch('/api/journals')
    // Filter journals where current user is involved
    myJournals.value = allJournals.filter(j =>
      j.employe1Id === myEmployeId.value ||
      j.employe2Id === myEmployeId.value
    )
    if (myJournals.value.length > 0) {
      await selectJournal(myJournals.value[0])
      weekEmpId.value = myEmployeId.value
    }
  } catch (e) {
    console.error(e)
  } finally {
    loadingJournals.value = false
  }
}

const loadEntries = async () => {
  if (!selectedJournal.value) return
  loadingEntries.value = true
  editingCells.value.clear()
  try {
    if (viewMode.value === 'journalier') {
      entries.value = await $fetch(`/api/journals/${selectedJournal.value.id}/entrees?date=${selectedDate.value}`)
    } else {
      const days = weekDays.value
      const start = days[0].date
      const end = days[days.length - 1].date
      entries.value = await $fetch(`/api/journals/${selectedJournal.value.id}/entrees?startDate=${start}&endDate=${end}`)
    }
    buildLocalGrid()
  } catch (e) {
    console.error(e)
    entries.value = []
    buildLocalGrid()
  } finally {
    loadingEntries.value = false
  }
}

const buildLocalGrid = () => {
  const grid = {}
  
  if (viewMode.value === 'journalier') {
    if (myEmployeId.value) {
      grid[myEmployeId.value] = {}
      timeSlots.forEach(slot => {
        const e = getEntryRaw(myEmployeId.value, slot)
        grid[myEmployeId.value][slot] = { contenu: e?.contenu || '', commentaire: e?.commentaire || '', lien: e?.lien || '' }
      })
    }
    if (partnerEmployeId.value) {
      grid[partnerEmployeId.value] = {}
      timeSlots.forEach(slot => {
        const e = getEntryRaw(partnerEmployeId.value, slot)
        grid[partnerEmployeId.value][slot] = { contenu: e?.contenu || '', commentaire: e?.commentaire || '', lien: e?.lien || '' }
      })
    }
  } else {
    // Vue Semaine
    weekDays.value.forEach(day => {
      grid[day.date] = {}
      timeSlots.forEach(slot => {
        const e = entries.value.find(x => x.employeId === weekEmpId.value && x.heure === slot && x.date.startsWith(day.date))
        grid[day.date][slot] = { contenu: e?.contenu || '', commentaire: e?.commentaire || '', lien: e?.lien || '' }
      })
    })
  }
  
  localGrid.value = grid

  // Remarks logic remains journalier only for now or reads first entry
  const myRemarkEntry = entries.value.find(e => e.employeId === myEmployeId.value && e.heure === 'REMARQUES')
  localRemarks.value = myRemarkEntry?.contenu || ''

  if (partnerEmployeId.value) {
    const partnerRemarkEntry = entries.value.find(e => e.employeId === partnerEmployeId.value && e.heure === 'REMARQUES')
    partnerLocalRemarks.value = partnerRemarkEntry?.contenu || ''
  }

  const aR = entries.value.find(e => e.employeId === selectedJournal.value.employe1Id && e.heure === 'REMARQUE_ADMIN')
  adminRemark.value = aR ? aR.contenu : ''
}

const selectJournal = async (j) => {
  selectedJournal.value = j
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
const goToday = () => {
  selectedDate.value = today
  loadEntries()
}

// --- Save ---
const saveEntries = async () => {
  if (!selectedJournal.value || !myEmployeId.value) return
  saving.value = true
  try {
    const entrees = []

    // Build entries from localGrid
    if (viewMode.value === 'journalier') {
      timeSlots.forEach(slot => {
        const cell = localGrid.value[myEmployeId.value]?.[slot]
        if (cell && (cell.contenu.trim() || cell.commentaire.trim() || cell.lien.trim())) {
          entrees.push({ employeId: myEmployeId.value, heure: slot, contenu: cell.contenu.trim(), commentaire: cell.commentaire.trim(), lien: cell.lien.trim() })
        }
      })
      if (partnerEmployeId.value) {
        timeSlots.forEach(slot => {
          const cell = localGrid.value[partnerEmployeId.value]?.[slot]
          if (cell && (cell.contenu.trim() || cell.commentaire.trim() || cell.lien.trim())) {
            entrees.push({ employeId: partnerEmployeId.value, heure: slot, contenu: cell.contenu.trim(), commentaire: cell.commentaire.trim(), lien: cell.lien.trim() })
          }
        })
      }
    } else {
      // Vue Semaine
      weekDays.value.forEach(day => {
        timeSlots.forEach(slot => {
          const cell = localGrid.value[day.date]?.[slot]
          if (cell && (cell.contenu.trim() || cell.commentaire.trim() || cell.lien.trim())) {
            entrees.push({ employeId: weekEmpId.value, date: day.date, heure: slot, contenu: cell.contenu.trim(), commentaire: cell.commentaire.trim(), lien: cell.lien.trim() })
          }
        })
      })
    }

    // Add remarks (only save remarks for the first day of the week if in week mode, or disable remarks saving in week mode to avoid confusion)
    if (viewMode.value === 'journalier') {
      if (localRemarks.value.trim()) {
        entrees.push({ employeId: myEmployeId.value, heure: 'REMARQUES', contenu: localRemarks.value.trim() })
      }
      if (partnerEmployeId.value && partnerLocalRemarks.value.trim()) {
        entrees.push({ employeId: partnerEmployeId.value, heure: 'REMARQUES', contenu: partnerLocalRemarks.value.trim() })
      }
    }

    await $fetch(`/api/journals/${selectedJournal.value.id}/entrees`, {
      method: 'POST',
      body: { date: viewMode.value === 'journalier' ? selectedDate.value : weekDays.value[0].date, entrees }
    })

    saveSuccess.value = true
    setTimeout(() => { saveSuccess.value = false }, 3000)
    await loadEntries()
  } catch (e) {
    console.error('Erreur de sauvegarde:', e)
    alert('Erreur lors de la sauvegarde. Veuillez réessayer.')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.journal-badge-emp {
  width: 32px; height: 32px; border-radius: 8px;
  background: linear-gradient(135deg, #7c3aed, var(--accent-primary));
  color: white; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.empty-journal-state { text-align: center; }
.journal-empty-icon-emp {
  width: 64px; height: 64px; border-radius: 16px; margin: 0 auto;
  background: var(--bg-surface-hover); border: 2px dashed var(--border-light);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted);
}

/* Tabs */
.journal-tabs {
  display: flex; gap: 0.25rem; margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-light);
}
.journal-tab {
  display: flex; align-items: center; gap: 0.375rem;
  padding: 0.5rem 1rem; border: none; background: transparent;
  color: var(--text-secondary); font-size: 0.8125rem; font-weight: 500;
  cursor: pointer; border-bottom: 2px solid transparent;
  transition: all 0.15s; white-space: nowrap;
}
.journal-tab:hover { color: var(--text-primary); background: var(--bg-surface-hover); }
.journal-tab-active { color: var(--accent-primary); border-bottom-color: var(--accent-primary); font-weight: 700; }

/* Card */
.journal-card { padding: 0; overflow: hidden; }
.journal-card-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-light);
  background: var(--bg-surface-hover);
  flex-wrap: wrap; gap: 0.75rem;
}
.journal-card-title { font-size: 1rem; font-weight: 700; margin-bottom: 0.25rem; }

.viewer-members { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.member-chip {
  display: inline-flex; align-items: center;
  background: var(--accent-primary)15; color: var(--accent-primary);
  font-size: 0.7rem; font-weight: 600; padding: 0.2rem 0.5rem;
  border-radius: 99px; border: 1px solid var(--accent-primary)30;
}
.member-chip-2 { background: #7c3aed15; color: #7c3aed; border-color: #7c3aed30; }

.date-input {
  font-size: 0.8125rem; color: var(--text-primary); background: var(--bg-surface);
  border: 1px solid var(--border-light); border-radius: 6px;
  padding: 0.3rem 0.5rem; outline: none;
}

/* Table */
.journal-grid-wrapper { overflow-x: auto; max-height: 65vh; overflow-y: auto; }
.journal-table { width: 100%; border-collapse: collapse; font-size: 0.8125rem; table-layout: fixed; }
.journal-table thead { position: sticky; top: 0; z-index: 2; }
.journal-table th {
  background: var(--bg-surface-hover);
  padding: 0.75rem 1rem;
  text-align: left; font-weight: 600;
  border-bottom: 2px solid var(--border-light);
  white-space: nowrap;
}
.time-col { width: 80px; }
.entry-col { width: 50%; }

.col-header { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; }
.col-me-badge {
  font-size: 0.6rem; font-weight: 700; padding: 0.1rem 0.35rem;
  background: var(--accent-primary); color: white; border-radius: 99px;
  margin-left: auto;
}
.col-partner-badge {
  font-size: 0.6rem; font-weight: 700; padding: 0.1rem 0.35rem;
  background: #7c3aed; color: white; border-radius: 99px;
  margin-left: auto;
}

.emp-avatar {
  width: 24px; height: 24px; border-radius: 50%;
  background: var(--accent-primary); color: white;
  font-size: 0.6rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.emp-avatar-me { background: var(--accent-primary); }
.emp-avatar-2 { background: #7c3aed; }

.journal-table td {
  padding: 0.4rem 1rem;
  border-bottom: 1px solid var(--border-light);
  vertical-align: top;
}
.time-cell { font-size: 0.75rem; font-weight: 600; color: var(--text-muted); white-space: nowrap; padding-top: 0.8rem; }

.current-time-row { background: var(--accent-primary)08 !important; }
.current-time-row .time-cell { color: var(--accent-primary); font-weight: 700; }

/* Editable cells */
.entry-cell-mine { background: var(--accent-primary)04; }
.entry-cell-partner { background: #7c3aed04; }

.cell-wrapper { width: 100%; display: flex; flex-direction: column; gap: 0.25rem; }

.edit-stack {
  display: flex; flex-direction: column; gap: 0.25rem;
}

.entry-textarea {
  width: 100%; min-height: 28px;
  padding: 0.3rem 0.5rem;
  font-size: 0.8125rem; font-family: inherit;
  color: var(--text-primary);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px; outline: none;
  resize: none; overflow: hidden;
  transition: border-color 0.15s, background 0.15s;
  box-sizing: border-box;
}
.entry-textarea::placeholder { color: var(--text-muted); font-style: italic; }
.entry-textarea:focus {
  border-color: var(--accent-primary)60;
  background: var(--bg-surface);
  box-shadow: 0 0 0 2px var(--accent-primary)15;
}
.entry-textarea-filled {
  background: var(--bg-surface);
  border-color: var(--border-light);
  padding-right: 45px; /* space for actions */
}

.cell-actions {
  position: absolute; right: 5px; top: 50%; transform: translateY(-50%);
  display: flex; gap: 0.15rem;
}
.icon-btn {
  background: none; border: none; cursor: pointer;
  color: var(--text-muted); padding: 0.25rem; border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.icon-btn:hover, .active-icon {
  color: var(--accent-primary);
  background: var(--accent-primary)10;
}

.chat-bubble-view {
  display: inline-flex; align-items: flex-start; gap: 0.35rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  margin-top: 0.25rem;
  width: fit-content;
  max-width: 90%;
  text-decoration: none;
}
.comment-bubble {
  background: var(--status-success-bg, #10b98110);
  border: 1px solid var(--status-success, #10b981)30;
  border-bottom-left-radius: 2px;
}
.comment-bubble .bubble-icon { color: var(--status-success, #10b981); margin-top: 0.1rem; flex-shrink: 0; }
.comment-bubble .bubble-text { color: var(--text-primary); font-size: 0.75rem; line-height: 1.3; }

.admin-bubble {
  background: #ef444410;
  border: 1px solid #ef444430;
  border-bottom-left-radius: 2px;
}
.admin-bubble .bubble-icon { color: #ef4444; margin-top: 0.1rem; flex-shrink: 0; }
.admin-bubble .bubble-text { flex: 1; font-size: 0.75rem; color: #b91c1c; font-weight: 500; line-height: 1.3; }

.link-bubble {
  background: var(--accent-primary)10;
  border: 1px solid var(--accent-primary)30;
  border-bottom-left-radius: 2px;
}
.link-bubble .bubble-icon { color: var(--accent-primary); margin-top: 0.1rem; flex-shrink: 0; }
.link-bubble .bubble-text { color: var(--text-primary); font-size: 0.75rem; line-height: 1.3; }

.detail-section { margin-bottom: 0.75rem; }
.detail-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.25rem; }
.detail-content { font-size: 0.8125rem; color: var(--text-primary); background: var(--bg-surface-hover); padding: 0.5rem; border-radius: 6px; border: 1px solid var(--border-light); }

.bubble-textarea, .bubble-input {
  flex: 1; background: transparent; border: none; outline: none;
  font-size: 0.75rem; color: var(--text-primary); font-family: inherit;
  resize: none; padding: 0; margin: 0; overflow: hidden;
}
.bubble-textarea::placeholder, .bubble-input::placeholder {
  color: var(--text-secondary); font-style: italic; opacity: 0.7;
}

.entry-content {
  display: flex; flex-direction: column; gap: 0.25rem;
  font-size: 0.8125rem; color: var(--text-primary);
  background: var(--bg-surface-hover);
  border: 1px solid var(--border-light);
  border-radius: 6px; padding: 0.4rem 0.5rem;
  line-height: 1.4;
}
.entry-auto { background: #10b98110; border-color: #10b98130; }
.entry-auto-badge {
  display: inline-flex; align-items: center; gap: 0.2rem;
  background: #10b981; color: white;
  font-size: 0.6rem; font-weight: 700;
  padding: 0.1rem 0.35rem; border-radius: 99px; flex-shrink: 0;
  margin-right: 0.25rem;
}
.entry-comment {
  font-size: 0.75rem; color: var(--text-secondary);
  padding: 0.2rem 0.4rem; background: var(--bg-surface);
  border-radius: 4px; border: 1px dashed var(--border-light);
  margin-top: 0.25rem;
}
.entry-link {
  display: inline-flex; align-items: center; gap: 0.2rem;
  color: var(--accent-primary); font-size: 0.7rem;
  text-decoration: none; align-self: flex-start;
  padding: 0.1rem 0.3rem; border-radius: 4px;
  background: var(--accent-primary)10;
  margin-top: 0.15rem;
}
.edit-btn {
  background: none; border: none; cursor: pointer;
  color: var(--text-muted); padding: 0.1rem; border-radius: 3px;
  display: flex; align-items: center;
}
.edit-btn:hover { color: var(--accent-primary); background: var(--accent-primary)10; }
.entry-empty { color: var(--text-muted); font-size: 0.75rem; padding: 0.3rem 0.5rem; }

/* Remarks */
.remarks-row {
  display: grid; grid-template-columns: 1fr 1fr; gap: 0;
  border-top: 2px solid var(--border-light);
}
.remarks-card {
  padding: 1rem 1.25rem;
  border-right: 1px solid var(--border-light);
}
.remarks-card:last-child { border-right: none; }
.remarks-card-2 { background: #7c3aed05; }
.remarks-label {
  font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.04em; color: var(--text-muted); margin-bottom: 0.5rem;
}
.remarks-textarea {
  width: 100%; font-size: 0.8125rem; font-family: inherit;
  color: var(--text-primary); background: var(--bg-surface-hover);
  border: 1px solid var(--border-light); border-radius: 6px;
  padding: 0.5rem; outline: none; resize: vertical;
  box-sizing: border-box;
}
.remarks-textarea:focus {
  border-color: var(--accent-primary)60;
  background: var(--bg-surface);
  box-shadow: 0 0 0 2px var(--accent-primary)15;
}

/* Save toast */
.save-toast {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: #d1fae5; color: #065f46;
  font-size: 0.8125rem; font-weight: 600;
  border-top: 1px solid #6ee7b7;
}

/* Loading */
.loading-state {
  display: flex; align-items: center; justify-content: center;
  gap: 0.75rem; padding: 2rem;
  color: var(--text-muted); font-size: 0.875rem;
}
.spinner-sm {
  width: 20px; height: 20px; border-radius: 50%;
  border: 2px solid var(--border-light);
  border-top-color: var(--accent-primary);
  animation: spin 0.8s linear infinite;
}
.spinner-xs {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Modal Styles */
.modal-overlay {
  position: fixed; inset: 0; z-index: 10000;
  background: rgba(0,0,0,0.55); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  padding: 2rem; box-sizing: border-box;
}
.modal-box {
  background: var(--bg-surface); border-radius: 16px;
  width: 100%; max-width: 500px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.3);
  overflow: hidden; display: flex; flex-direction: column;
  max-height: calc(100vh - 4rem);
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-light);
}
.modal-title { font-size: 1rem; font-weight: 700; }
.modal-close {
  background: none; border: none; cursor: pointer;
  color: var(--text-muted); padding: 0.25rem; border-radius: 4px;
}
.modal-close:hover { color: var(--text-primary); background: var(--bg-surface-hover); }
.modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; overflow-y: auto; }
.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-light);
  display: flex; justify-content: flex-end; gap: 0.5rem;
}
</style>
