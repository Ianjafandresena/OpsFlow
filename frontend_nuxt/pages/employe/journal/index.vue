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
        <div v-else class="journal-grid-wrapper">
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
                <!-- Partner column (read-only) -->
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
                  <div class="cell-wrapper">
                    <!-- If auto-generated from a completed task -->
                    <div
                      v-if="getEntryRaw(myEmployeId, slot)?.tacheId && !isEditing(myEmployeId, slot)"
                      class="entry-content entry-auto"
                    >
                      <span class="entry-auto-badge"><CheckIcon :size="10" /> Tâche</span>
                      {{ localGrid[myEmployeId]?.[slot] || getEntryRaw(myEmployeId, slot)?.contenu }}
                      <button class="edit-btn" @click="startEditing(myEmployeId, slot)">
                        <EditIcon :size="11" />
                      </button>
                    </div>
                    <!-- Normal cell -->
                    <textarea
                      v-else
                      v-model="localGrid[myEmployeId][slot]"
                      class="entry-textarea"
                      :class="{ 'entry-textarea-filled': localGrid[myEmployeId]?.[slot]?.trim() }"
                      :placeholder="isCurrentSlot(slot) ? 'En cours...' : 'Activité...'"
                      rows="1"
                      @input="autoResize($event)"
                    />
                  </div>
                </td>

                <!-- Partner read-only cell -->
                <td v-if="partnerEmploye" class="entry-cell">
                  <div
                    v-if="getEntryRaw(partnerEmployeId, slot)"
                    class="entry-content"
                    :class="{ 'entry-auto': getEntryRaw(partnerEmployeId, slot)?.tacheId }"
                  >
                    <span v-if="getEntryRaw(partnerEmployeId, slot)?.tacheId" class="entry-auto-badge">
                      <CheckIcon :size="10" /> Tâche
                    </span>
                    {{ getEntryRaw(partnerEmployeId, slot)?.contenu }}
                    <a
                      v-if="getEntryRaw(partnerEmployeId, slot)?.tache?.lien_livrable"
                      :href="getEntryRaw(partnerEmployeId, slot)?.tache?.lien_livrable"
                      target="_blank"
                      class="entry-link"
                      @click.stop
                    >
                      <LinkIcon :size="10" /> Voir
                    </a>
                  </div>
                  <div v-else class="entry-empty">—</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Remarks row -->
        <div v-if="!loadingEntries" class="remarks-row">
          <div class="remarks-card">
            <div class="remarks-label">Remarques — Moi</div>
            <textarea
              v-model="localRemarks"
              class="remarks-textarea"
              placeholder="Ajouter une remarque pour la journée..."
              rows="2"
            />
          </div>
          <div v-if="partnerEmploye" class="remarks-card remarks-card-2">
            <div class="remarks-label">Remarques — {{ partnerEmploye.prenom }}</div>
            <div class="remarks-content">
              <span v-if="partnerRemarks">{{ partnerRemarks }}</span>
              <span v-else class="remarks-empty">Aucune remarque</span>
            </div>
          </div>
        </div>

        <!-- Save success notification -->
        <div v-if="saveSuccess" class="save-toast">
          <CheckCircleIcon :size="14" /> Journal enregistré avec succès !
        </div>
      </div>
    </div>
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
  CheckCircle as CheckCircleIcon
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

// Local editable grid: { [employeId]: { [heure]: contenu } }
const localGrid = ref({})
const localRemarks = ref('')

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

const partnerRemarks = computed(() => {
  if (!partnerEmployeId.value) return ''
  return entries.value
    .filter(e => e.employeId === partnerEmployeId.value && e.heure === 'REMARQUES')
    .map(e => e.contenu)
    .join(' ')
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
const getEntryRaw = (empId, heure) => {
  return entries.value.find(e => e.employeId === empId && e.heure === heure) || null
}
const isEditing = (empId, heure) => editingCells.value.has(`${empId}-${heure}`)
const startEditing = (empId, heure) => {
  editingCells.value.add(`${empId}-${heure}`)
}
const autoResize = (e) => {
  e.target.style.height = 'auto'
  e.target.style.height = e.target.scrollHeight + 'px'
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
    entries.value = await $fetch(`/api/journals/${selectedJournal.value.id}/entrees?date=${selectedDate.value}`)
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
  if (myEmployeId.value) {
    grid[myEmployeId.value] = {}
    timeSlots.forEach(slot => {
      const e = getEntryRaw(myEmployeId.value, slot)
      grid[myEmployeId.value][slot] = e?.contenu || ''
    })
  }
  localGrid.value = grid

  // Remarks
  const myRemarkEntry = entries.value.find(
    e => e.employeId === myEmployeId.value && e.heure === 'REMARQUES'
  )
  localRemarks.value = myRemarkEntry?.contenu || ''
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

    // Build entries from localGrid for my column
    timeSlots.forEach(slot => {
      const contenu = localGrid.value[myEmployeId.value]?.[slot] || ''
      if (contenu.trim()) {
        entrees.push({ employeId: myEmployeId.value, heure: slot, contenu: contenu.trim() })
      }
    })

    // Add remarks
    if (localRemarks.value.trim()) {
      entrees.push({ employeId: myEmployeId.value, heure: 'REMARQUES', contenu: localRemarks.value.trim() })
    }

    await $fetch(`/api/journals/${selectedJournal.value.id}/entrees`, {
      method: 'POST',
      body: { date: selectedDate.value, entrees }
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
  font-size: 0.8125rem; color: var(--text-primary); background: var(--bg-card);
  border: 1px solid var(--border-light); border-radius: 6px;
  padding: 0.3rem 0.5rem; outline: none;
}

/* Table */
.journal-grid-wrapper { overflow-x: auto; max-height: 65vh; overflow-y: auto; }
.journal-table { width: 100%; border-collapse: collapse; font-size: 0.8125rem; }
.journal-table thead { position: sticky; top: 0; z-index: 2; }
.journal-table th {
  background: var(--bg-surface-hover);
  padding: 0.75rem 1rem;
  text-align: left; font-weight: 600;
  border-bottom: 2px solid var(--border-light);
  white-space: nowrap;
}
.time-col { width: 80px; }
.entry-col { min-width: 260px; }

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
  padding: 0.3rem 1rem;
  border-bottom: 1px solid var(--border-light);
  vertical-align: middle;
}
.time-cell { font-size: 0.75rem; font-weight: 600; color: var(--text-muted); white-space: nowrap; }

.current-time-row { background: var(--accent-primary)08 !important; }
.current-time-row .time-cell { color: var(--accent-primary); font-weight: 700; }

/* Editable mine cell */
.entry-cell-mine { background: var(--accent-primary)04; }
.cell-wrapper { width: 100%; }

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
  background: var(--bg-card);
  box-shadow: 0 0 0 2px var(--accent-primary)15;
}
.entry-textarea-filled {
  background: var(--accent-primary)08;
  border-color: var(--accent-primary)30;
}

.entry-content {
  display: flex; flex-wrap: wrap; align-items: center; gap: 0.375rem;
  font-size: 0.8125rem; color: var(--text-primary);
  background: var(--bg-surface-hover);
  border: 1px solid var(--border-light);
  border-radius: 6px; padding: 0.3rem 0.5rem;
  line-height: 1.4;
}
.entry-auto { background: #10b98110; border-color: #10b98130; }
.entry-auto-badge {
  display: inline-flex; align-items: center; gap: 0.2rem;
  background: #10b981; color: white;
  font-size: 0.6rem; font-weight: 700;
  padding: 0.1rem 0.35rem; border-radius: 99px; flex-shrink: 0;
}
.entry-link {
  display: inline-flex; align-items: center; gap: 0.2rem;
  color: var(--accent-primary); font-size: 0.7rem;
  text-decoration: none; margin-left: auto;
  padding: 0.1rem 0.3rem; border-radius: 4px;
  background: var(--accent-primary)10;
}
.edit-btn {
  background: none; border: none; cursor: pointer;
  color: var(--text-muted); padding: 0.1rem; border-radius: 3px;
  margin-left: auto; display: flex; align-items: center;
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
  background: var(--bg-card);
  box-shadow: 0 0 0 2px var(--accent-primary)15;
}
.remarks-content { font-size: 0.8125rem; color: var(--text-primary); line-height: 1.5; }
.remarks-empty { color: var(--text-muted); font-style: italic; font-size: 0.8125rem; }

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
</style>
