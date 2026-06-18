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
              <span v-if="j.employe2" class="journal-item-icon2">{{ initials(j.employe2) }}</span>
            </div>
            <div style="flex:1; min-width:0;">
              <div class="journal-item-name">{{ j.nom }}</div>
              <div class="journal-item-members">
                {{ j.employe1.prenom }} {{ j.employe1.nom }}
                <template v-if="j.employe2">
                  &amp; {{ j.employe2.prenom }} {{ j.employe2.nom }}
                </template>
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
                  <span class="member-chip">{{ selectedJournal.employe1.prenom }} {{ selectedJournal.employe1.nom }}</span>
                  <span v-if="selectedJournal.employe2" class="member-chip member-chip-2">{{ selectedJournal.employe2.prenom }} {{ selectedJournal.employe2.nom }}</span>
                </div>
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
            </div>
          </div>

          <!-- Journal Grid -->
          <div v-if="loadingEntries" class="loading-state" style="padding:3rem;">
            <div class="spinner-sm"></div>
            <span>Chargement du journal...</span>
          </div>

          <!-- Journal Grid -->
          <div v-else-if="viewMode === 'journalier'" class="journal-grid-wrapper">
            <table class="journal-table">
              <thead>
                <tr>
                  <th class="time-col">Heure</th>
                  <th class="entry-col">
                    <div class="col-header">
                      <div class="emp-avatar">{{ initials(selectedJournal.employe1) }}</div>
                      {{ selectedJournal.employe1.prenom }} {{ selectedJournal.employe1.nom }}
                    </div>
                  </th>
                  <th v-if="selectedJournal.employe2" class="entry-col">
                    <div class="col-header col-header-2">
                      <div class="emp-avatar emp-avatar-2">{{ initials(selectedJournal.employe2) }}</div>
                      {{ selectedJournal.employe2.prenom }} {{ selectedJournal.employe2.nom }}
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
                  <td class="entry-cell">
                    <div
                      v-if="getEntry(selectedJournal.employe1Id, slot)"
                      class="entry-content"
                      :class="{ 'entry-auto': getEntry(selectedJournal.employe1Id, slot)?.tacheId }"
                    >
                      <div style="display:flex; justify-content:space-between; width:100%; align-items: flex-start;">
                        <div>
                          <span v-if="getEntry(selectedJournal.employe1Id, slot)?.tacheId" class="entry-auto-badge">
                            <CheckIcon :size="10" /> Tâche
                          </span>
                          {{ getEntry(selectedJournal.employe1Id, slot)?.contenu }}
                        </div>
                        <button class="icon-btn-view" @click="openEntryModal(selectedJournal.employe1Id, slot)" title="Détails / Commenter">
                          <EyeIcon :size="13" />
                        </button>
                      </div>
                      <div v-if="getEntry(selectedJournal.employe1Id, slot)?.commentaire" class="chat-bubble-view comment-bubble-view">
                        <MessageSquareIcon :size="12" class="bubble-icon-view" />
                        <span class="bubble-text-view">{{ getEntry(selectedJournal.employe1Id, slot)?.commentaire }}</span>
                      </div>
                      <div v-if="getEntry(selectedJournal.employe1Id, slot)?.admin_commentaire" class="chat-bubble-view admin-bubble-view">
                        <MessageSquareIcon :size="12" class="bubble-icon-view" />
                        <span class="bubble-text-view">{{ getEntry(selectedJournal.employe1Id, slot)?.admin_commentaire }}</span>
                      </div>
                      <template v-if="getEntry(selectedJournal.employe1Id, slot)?.lien">
                        <a v-for="(lnk, idx) in getEntry(selectedJournal.employe1Id, slot)?.lien.split(/[\\s\\n]+/).filter(l => l.trim() !== '')" :key="idx"
                           :href="lnk" target="_blank" class="chat-bubble-view link-bubble-view" @click.stop>
                          <LinkIcon :size="12" class="bubble-icon-view" />
                          <span class="bubble-text-view">Lien {{ idx + 1 }}</span>
                        </a>
                      </template>
                      <a
                        v-else-if="getEntry(selectedJournal.employe1Id, slot)?.tache?.lien_livrable"
                        :href="getEntry(selectedJournal.employe1Id, slot)?.tache?.lien_livrable"
                        target="_blank"
                        class="chat-bubble-view link-bubble-view"
                        @click.stop
                      >
                        <LinkIcon :size="12" class="bubble-icon-view" />
                        <span class="bubble-text-view">Voir le livrable</span>
                      </a>
                    </div>
                    <div v-else class="entry-empty">—</div>
                  </td>
                  <td v-if="selectedJournal.employe2" class="entry-cell">
                    <div
                      v-if="getEntry(selectedJournal.employe2Id, slot)"
                      class="entry-content"
                      :class="{ 'entry-auto': getEntry(selectedJournal.employe2Id, slot)?.tacheId }"
                    >
                      <div style="display:flex; justify-content:space-between; width:100%; align-items: flex-start;">
                        <div>
                          <span v-if="getEntry(selectedJournal.employe2Id, slot)?.tacheId" class="entry-auto-badge">
                            <CheckIcon :size="10" /> Tâche
                          </span>
                          {{ getEntry(selectedJournal.employe2Id, slot)?.contenu }}
                        </div>
                        <button class="icon-btn-view" @click="openEntryModal(selectedJournal.employe2Id, slot)" title="Détails / Commenter">
                          <EyeIcon :size="13" />
                        </button>
                      </div>
                      <div v-if="getEntry(selectedJournal.employe2Id, slot)?.commentaire" class="chat-bubble-view comment-bubble-view">
                        <MessageSquareIcon :size="12" class="bubble-icon-view" />
                        <span class="bubble-text-view">{{ getEntry(selectedJournal.employe2Id, slot)?.commentaire }}</span>
                      </div>
                      <div v-if="getEntry(selectedJournal.employe2Id, slot)?.admin_commentaire" class="chat-bubble-view admin-bubble-view">
                        <MessageSquareIcon :size="12" class="bubble-icon-view" />
                        <span class="bubble-text-view">{{ getEntry(selectedJournal.employe2Id, slot)?.admin_commentaire }}</span>
                      </div>
                      <template v-if="getEntry(selectedJournal.employe2Id, slot)?.lien">
                        <a v-for="(lnk, idx) in getEntry(selectedJournal.employe2Id, slot)?.lien.split(/[\\s\\n]+/).filter(l => l.trim() !== '')" :key="idx"
                           :href="lnk" target="_blank" class="chat-bubble-view link-bubble-view" @click.stop>
                          <LinkIcon :size="12" class="bubble-icon-view" />
                          <span class="bubble-text-view">Lien {{ idx + 1 }}</span>
                        </a>
                      </template>
                      <a
                        v-else-if="getEntry(selectedJournal.employe2Id, slot)?.tache?.lien_livrable"
                        :href="getEntry(selectedJournal.employe2Id, slot)?.tache?.lien_livrable"
                        target="_blank"
                        class="chat-bubble-view link-bubble-view"
                        @click.stop
                      >
                        <LinkIcon :size="12" class="bubble-icon-view" />
                        <span class="bubble-text-view">Voir le livrable</span>
                      </a>
                    </div>
                    <div v-else class="entry-empty">—</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Weekly Grid -->
          <div v-else-if="viewMode === 'semaine'" class="journal-grid-wrapper">
            <div style="display:flex; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--bg-surface-hover); border-bottom: 1px solid var(--border-light);">
              <span style="font-size: 0.8125rem; font-weight: 600; color: var(--text-secondary); display:flex; align-items:center;">Voir la semaine de :</span>
              <button class="btn btn-sm" :class="weekEmpId === selectedJournal.employe1Id ? 'btn-primary' : 'btn-secondary'" @click="weekEmpId = selectedJournal.employe1Id; loadEntries()">{{ selectedJournal.employe1.prenom }}</button>
              <button v-if="selectedJournal.employe2Id" class="btn btn-sm" :class="weekEmpId === selectedJournal.employe2Id ? 'btn-primary' : 'btn-secondary'" @click="weekEmpId = selectedJournal.employe2Id; loadEntries()">{{ selectedJournal.employe2.prenom }}</button>
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
                      <div style="display:flex; justify-content:space-between; width:100%; align-items: flex-start;">
                        <div style="font-size: 0.75rem;">
                          <span v-if="getEntry(weekEmpId, slot, day.date)?.tacheId" class="entry-auto-badge">
                            <CheckIcon :size="10" /> Tâche
                          </span>
                          {{ getEntry(weekEmpId, slot, day.date)?.contenu || '—' }}
                        </div>
                        <button class="icon-btn-view" @click="openEntryModal(weekEmpId, slot, day.date)" title="Détails / Commenter">
                          <EyeIcon :size="12" />
                        </button>
                      </div>
                      <div v-if="getEntry(weekEmpId, slot, day.date)?.commentaire" class="chat-bubble-view comment-bubble-view">
                        <MessageSquareIcon :size="10" class="bubble-icon-view" />
                        <span class="bubble-text-view" style="font-size: 0.7rem;">{{ getEntry(weekEmpId, slot, day.date)?.commentaire }}</span>
                      </div>
                      <div v-if="getEntry(weekEmpId, slot, day.date)?.admin_commentaire" class="chat-bubble-view admin-bubble-view">
                        <MessageSquareIcon :size="10" class="bubble-icon-view" />
                        <span class="bubble-text-view" style="font-size: 0.7rem;">{{ getEntry(weekEmpId, slot, day.date)?.admin_commentaire }}</span>
                      </div>
                      <template v-if="getEntry(weekEmpId, slot, day.date)?.lien">
                        <a v-for="(lnk, idx) in getEntry(weekEmpId, slot, day.date)?.lien.split(/[\\s\\n]+/).filter(l => l.trim() !== '')" :key="idx"
                           :href="lnk" target="_blank" class="chat-bubble-view link-bubble-view" style="font-size: 0.7rem;" @click.stop>
                          <LinkIcon :size="10" class="bubble-icon-view" />
                          <span class="bubble-text-view">Lien</span>
                        </a>
                      </template>
                      <a v-else-if="getEntry(weekEmpId, slot, day.date)?.tache?.lien_livrable" :href="getEntry(weekEmpId, slot, day.date)?.tache?.lien_livrable" target="_blank" class="chat-bubble-view link-bubble-view" style="font-size: 0.7rem;" @click.stop>
                        <LinkIcon :size="10" class="bubble-icon-view" />
                        <span class="bubble-text-view">Livrable</span>
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Remarks section -->
          <div v-if="viewMode === 'journalier' && !loadingEntries" class="remarks-row">
            <div class="remarks-card">
              <div class="remarks-label">Remarques — {{ selectedJournal.employe1.prenom }}</div>
              <div class="remarks-content">
                <span v-if="remarks1">{{ remarks1 }}</span>
                <span v-else class="remarks-empty">Aucune remarque</span>
              </div>
            </div>
            <div v-if="selectedJournal.employe2" class="remarks-card remarks-card-2">
              <div class="remarks-label">Remarques — {{ selectedJournal.employe2.prenom }}</div>
              <div class="remarks-content">
                <span v-if="remarks2">{{ remarks2 }}</span>
                <span v-else class="remarks-empty">Aucune remarque</span>
              </div>
            </div>
          </div>
          
          <div v-if="viewMode === 'journalier' && !loadingEntries" class="remarks-row" style="border-top: none;">
            <div class="remarks-card" style="grid-column: span 2; background: var(--accent-primary)04;">
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
              <input
                v-model="form.nom"
                type="text"
                class="form-input"
                placeholder="Ex: Ando et Aly - Rennes"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Employé 1 *</label>
              <select v-model="form.employe1Id" class="form-input">
                <option value="">Sélectionner un employé...</option>
                <option v-for="e in employes" :key="e.id" :value="e.id">
                  {{ e.prenom }} {{ e.nom }} — {{ e.poste?.titre_poste }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Employé 2 <span style="color:var(--text-muted);">(optionnel)</span></label>
              <select v-model="form.employe2Id" class="form-input">
                <option value="">Aucun binôme</option>
                <option
                  v-for="e in employes.filter(e => e.id !== form.employe1Id)"
                  :key="e.id"
                  :value="e.id"
                >
                  {{ e.prenom }} {{ e.nom }} — {{ e.poste?.titre_poste }}
                </option>
              </select>
            </div>

            <!-- Preview -->
            <div v-if="form.employe1Id" class="preview-box">
              <div class="preview-title">Aperçu</div>
              <div class="preview-members">
                <div class="preview-member">
                  <div class="emp-avatar">{{ initialsById(form.employe1Id) }}</div>
                  {{ nameById(form.employe1Id) }}
                </div>
                <div v-if="form.employe2Id" style="color:var(--text-muted); font-size:0.75rem;">& Binôme</div>
                <div v-if="form.employe2Id" class="preview-member">
                  <div class="emp-avatar emp-avatar-2">{{ initialsById(form.employe2Id) }}</div>
                  {{ nameById(form.employe2Id) }}
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeCreateModal">Annuler</button>
            <button class="btn btn-primary" :disabled="!form.nom || !form.employe1Id || creating" @click="createJournal">
              <span v-if="creating" class="spinner-xs"></span>
              {{ creating ? 'Création...' : 'Créer le Journal' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ENTRY DETAIL / COMMENT MODAL -->
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

          <div class="modal-body" v-if="activeEntry">
            <div class="detail-section">
              <div class="detail-label">Contenu ({{ activeSlot }})</div>
              <div class="detail-content">{{ activeEntry.contenu || 'Aucun contenu' }}</div>
            </div>

            <div v-if="activeEntry.commentaire" class="detail-section">
              <div class="detail-label">Remarque de l'employé</div>
              <div class="detail-content comment-bubble-view" style="width:100%; border-radius:8px;">
                {{ activeEntry.commentaire }}
              </div>
            </div>

            <div v-if="activeEntry.lien" class="detail-section">
              <div class="detail-label">Lien(s) attaché(s)</div>
              <a v-for="(lnk, idx) in activeEntry.lien.split(/[\\s\\n]+/).filter(l => l.trim() !== '')" :key="idx"
                 :href="lnk" target="_blank" class="detail-content link-bubble-view" style="display:block; width:100%; border-radius:8px; margin-bottom: 0.25rem;">
                Ouvrir le lien {{ idx + 1 }}
              </a>
            </div>

            <hr style="border: 0; border-top: 1px solid var(--border-light); margin: 0.5rem 0;" />

            <div class="form-group">
              <label class="form-label" style="color:var(--status-danger);">Ajouter/Modifier un commentaire (Admin)</label>
              <textarea
                v-model="modalAdminComment"
                class="form-input"
                placeholder="Votre commentaire apparaîtra en rouge..."
                rows="3"
                style="resize:vertical;"
              ></textarea>
            </div>
          </div>
          <div class="modal-body" v-else>
            <p style="color:var(--text-muted); font-size:0.875rem;">Aucune activité enregistrée à cette heure.</p>
            <div class="form-group" style="margin-top:1rem;">
              <label class="form-label" style="color:var(--status-danger);">Laisser un commentaire (Admin)</label>
              <textarea
                v-model="modalAdminComment"
                class="form-input"
                placeholder="Votre commentaire apparaîtra en rouge..."
                rows="3"
                style="resize:vertical;"
              ></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeEntryModal">Annuler</button>
            <button class="btn btn-primary" :disabled="savingEntry" @click="saveEntryAdminComment" style="background:var(--status-danger); border-color:var(--status-danger);">
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
  Eye as EyeIcon,
  Menu as MenuIcon,
  Edit as EditIcon,
  Save as SaveIcon
} from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })

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

const form = ref({ nom: '', employe1Id: '', employe2Id: '' })

// Admin remarks logic
const adminRemark = ref('')
const savingAdmin = ref(false)

// --- Helpers ---
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

// Remarks = entry at slot "REMARQUES"
const remarks1 = computed(() => {
  if (!selectedJournal.value) return ''
  const r = entries.value.filter(e => e.employeId === selectedJournal.value.employe1Id && e.heure === 'REMARQUES')
  return r.map(e => e.contenu).join(' ')
})
const remarks2 = computed(() => {
  if (!selectedJournal.value?.employe2Id) return ''
  const r = entries.value.filter(e => e.employeId === selectedJournal.value.employe2Id && e.heure === 'REMARQUES')
  return r.map(e => e.contenu).join(' ')
})

// --- Load data ---
onMounted(async () => {
  await Promise.all([loadJournals(), loadEmployes()])
})

const loadJournals = async () => {
  loadingJournals.value = true
  try {
    journals.value = await $fetch('/api/journals')
  } catch (e) {
    console.error(e)
  } finally {
    loadingJournals.value = false
  }
}

const loadEmployes = async () => {
  try {
    employes.value = await $fetch('/api/equipe')
  } catch (e) {
    console.error(e)
  }
}

const loadEntries = async () => {
  if (!selectedJournal.value) return
  loadingEntries.value = true
  try {
    if (viewMode.value === 'journalier') {
      entries.value = await $fetch(`/api/journals/${selectedJournal.value.id}/entrees?date=${selectedDate.value}`)
    } else {
      const days = weekDays.value
      const start = days[0].date
      const end = days[days.length - 1].date
      entries.value = await $fetch(`/api/journals/${selectedJournal.value.id}/entrees?startDate=${start}&endDate=${end}`)
    }
    
    // Load admin remark
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
      entrees.push({ 
        employeId: selectedJournal.value.employe1Id, 
        heure: 'REMARQUE_ADMIN', 
        contenu: adminRemark.value.trim() 
      })
    }
    await $fetch(`/api/journals/${selectedJournal.value.id}/entrees`, {
      method: 'POST',
      body: { date: selectedDate.value, entrees }
    })
    await loadEntries()
  } catch (e) {
    console.error(e)
    alert("Erreur lors de l'enregistrement de la remarque.")
  } finally {
    savingAdmin.value = false
  }
}

// --- Entry Comment Modal ---
const showEntryModal = ref(false)
const activeEntry = ref(null)
const activeSlot = ref(null)
const activeEmployeId = ref(null)
const activeDate = ref(null)
const modalAdminComment = ref('')
const savingEntry = ref(false)

const openEntryModal = (empId, slot, dateStr = null) => {
  activeEmployeId.value = empId
  activeSlot.value = slot
  activeDate.value = dateStr
  activeEntry.value = getEntry(empId, slot, dateStr)
  modalAdminComment.value = activeEntry.value?.admin_commentaire || ''
  showEntryModal.value = true
}

const closeEntryModal = () => {
  showEntryModal.value = false
  activeEntry.value = null
  activeSlot.value = null
  activeEmployeId.value = null
  activeDate.value = null
  modalAdminComment.value = ''
}

const saveEntryAdminComment = async () => {
  if (!activeEmployeId.value || !activeSlot.value) return
  savingEntry.value = true
  try {
    const targetDate = activeDate.value ? activeDate.value : selectedDate.value
    await $fetch(`/api/journals/${selectedJournal.value.id}/entrees`, {
      method: 'POST',
      body: {
        date: targetDate,
        entrees: [{
          employeId: activeEmployeId.value,
          date: targetDate,
          heure: activeSlot.value,
          contenu: activeEntry.value?.contenu || '',
          commentaire: activeEntry.value?.commentaire || '',
          lien: activeEntry.value?.lien || '',
          admin_commentaire: modalAdminComment.value.trim() || undefined
        }]
      }
    })
    await loadEntries()
    closeEntryModal()
  } catch (e) {
    console.error(e)
    alert('Erreur lors de la sauvegarde du commentaire.')
  } finally {
    savingEntry.value = false
  }
}

const selectJournal = async (j) => {
  selectedJournal.value = j
  weekEmpId.value = j.employe1Id
  if (window.innerWidth <= 900) {
    showSidebar.value = false
  }
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

// --- Create Modal ---
const openCreateModal = () => {
  form.value = { nom: '', employe1Id: '', employe2Id: '' }
  showCreateModal.value = true
}
const closeCreateModal = () => { showCreateModal.value = false }

const createJournal = async () => {
  creating.value = true
  try {
    const newJ = await $fetch('/api/journals', {
      method: 'POST',
      body: {
        nom: form.value.nom,
        employe1Id: form.value.employe1Id,
        employe2Id: form.value.employe2Id || null
      }
    })
    await loadJournals()
    closeCreateModal()
    // Auto-select newly created journal
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

// Mobile responsive logic
onMounted(() => {
  if (window.innerWidth <= 900 && selectedJournal.value) {
    showSidebar.value = false
  } else if (window.innerWidth <= 900 && !selectedJournal.value) {
    showSidebar.value = true
  }
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 900 && !selectedJournal.value) {
      showSidebar.value = true
    }
  })
})
</script>

<style scoped>
.journal-badge {
  width: 32px; height: 32px; border-radius: 8px;
  background: linear-gradient(135deg, var(--accent-primary), #7c3aed);
  color: white; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.journal-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 1.25rem;
  align-items: start;
  min-height: 600px;
}
.journal-layout.sidebar-hidden {
  grid-template-columns: 1fr;
}

/* LEFT PANEL */
.journal-list-panel {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  overflow: hidden;
  position: sticky;
  top: 1rem;
}

.panel-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--border-light);
  background: var(--bg-surface-hover);
}
.panel-title {
  font-size: 0.8125rem; font-weight: 700; color: var(--text-primary);
}

.journal-items { display: flex; flex-direction: column; }

.journal-item {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: none; background: transparent; cursor: pointer;
  text-align: left; width: 100%;
  border-bottom: 1px solid var(--border-light);
  transition: background 0.12s;
}
.journal-item:last-child { border-bottom: none; }
.journal-item:hover { background: var(--bg-surface-hover); }
.journal-item-active { background: var(--accent-primary)10 !important; border-left: 3px solid var(--accent-primary); }

.journal-item-icon {
  position: relative; width: 36px; height: 36px; flex-shrink: 0;
}
.journal-item-icon > span {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--accent-primary); color: white;
  font-size: 0.7rem; font-weight: 700;
}
.journal-item-icon2 {
  position: absolute; bottom: -2px; right: -4px;
  width: 22px !important; height: 22px !important;
  font-size: 0.6rem !important;
  background: #7c3aed !important;
  border: 2px solid var(--bg-surface);
  border-radius: 50%;
  display: flex !important; align-items: center; justify-content: center;
  color: white;
}
.journal-item-name {
  font-size: 0.8125rem; font-weight: 600; color: var(--text-primary);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  max-width: 160px;
}
.journal-item-members {
  font-size: 0.7rem; color: var(--text-muted); white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis; max-width: 160px;
}

/* RIGHT VIEWER */
.journal-viewer {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  overflow: hidden;
}

.journal-empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 6rem 2rem; gap: 0.75rem; text-align: center;
}
.journal-empty-icon {
  width: 64px; height: 64px; border-radius: 16px;
  background: var(--bg-surface-hover); border: 2px dashed var(--border-light);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted); margin-bottom: 0.5rem;
}

.viewer-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-light);
  background: var(--bg-surface-hover);
  flex-wrap: wrap; gap: 0.75rem;
}
.viewer-title { font-size: 1rem; font-weight: 700; margin-bottom: 0.25rem; }
.viewer-members { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.member-chip {
  display: inline-flex; align-items: center; gap: 0.25rem;
  background: var(--accent-primary)15; color: var(--accent-primary);
  font-size: 0.7rem; font-weight: 600; padding: 0.2rem 0.5rem;
  border-radius: 99px; border: 1px solid var(--accent-primary)30;
}
.member-chip-2 {
  background: #7c3aed15; color: #7c3aed; border-color: #7c3aed30;
}

/* Date input */
.date-input {
  font-size: 0.8125rem; color: var(--text-primary); background: var(--bg-surface);
  border: 1px solid var(--border-light); border-radius: 6px;
  padding: 0.3rem 0.5rem; outline: none;
}

/* Journal Table */
.journal-grid-wrapper { overflow-x: auto; max-height: 600px; overflow-y: auto; }

.journal-table {
  width: 100%; border-collapse: collapse;
  font-size: 0.8125rem; table-layout: fixed;
}
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

.col-header {
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.8125rem;
}
.col-header-2 { color: #7c3aed; }

.emp-avatar {
  width: 24px; height: 24px; border-radius: 50%;
  background: var(--accent-primary); color: white;
  font-size: 0.6rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.emp-avatar-2 { background: #7c3aed; }

.journal-table td {
  padding: 0.4rem 1rem;
  border-bottom: 1px solid var(--border-light);
  vertical-align: top;
}

.time-cell {
  font-size: 0.75rem; font-weight: 600; color: var(--text-muted);
  white-space: nowrap;
  padding-top: 0.8rem;
}

.current-time-row { background: var(--accent-primary)08 !important; }
.current-time-row .time-cell { color: var(--accent-primary); font-weight: 700; }

.entry-cell { }

.entry-content {
  display: flex; flex-direction: column; gap: 0.25rem;
  font-size: 0.8125rem; color: var(--text-primary);
  background: var(--bg-surface-hover);
  border: 1px solid var(--border-light);
  border-radius: 6px; padding: 0.4rem 0.5rem;
  line-height: 1.4;
}
.icon-btn-view {
  background: none; border: none; cursor: pointer;
  color: var(--text-muted); padding: 0.2rem; border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.icon-btn-view:hover { color: var(--accent-primary); background: var(--accent-primary)10; }

.detail-section { margin-bottom: 0.75rem; }
.detail-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.25rem; }
.detail-content { font-size: 0.8125rem; color: var(--text-primary); background: var(--bg-surface-hover); padding: 0.5rem; border-radius: 6px; border: 1px solid var(--border-light); }

.entry-auto {
  background: var(--status-success-bg, #d1fae515);
  border-color: var(--status-success, #10b981)30;
}
.entry-auto-badge {
  display: inline-flex; align-items: center; gap: 0.2rem;
  background: var(--status-success, #10b981); color: white;
  font-size: 0.6rem; font-weight: 700;
  padding: 0.1rem 0.35rem; border-radius: 99px;
  flex-shrink: 0; margin-right: 0.25rem;
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
.comment-bubble-view {
  background: var(--status-success-bg, #10b98110);
  border: 1px solid var(--status-success, #10b981)30;
  border-bottom-left-radius: 2px;
}
.comment-bubble-view .bubble-icon-view { color: var(--status-success, #10b981); margin-top: 0.1rem; flex-shrink:0; }

.admin-bubble-view {
  background: #ef444410;
  border: 1px solid #ef444430;
  border-bottom-left-radius: 2px;
}
.admin-bubble-view .bubble-icon-view { color: #ef4444; margin-top: 0.1rem; flex-shrink:0; }
.admin-bubble-view .bubble-text-view { color: #b91c1c; font-weight:500; }

.link-bubble-view {
  background: var(--accent-primary)10;
  border: 1px solid var(--accent-primary)30;
  border-bottom-left-radius: 2px;
}
.link-bubble-view .bubble-icon-view { color: var(--accent-primary); margin-top: 0.1rem; flex-shrink:0; }
.link-bubble-view:hover { opacity: 0.8; }

.bubble-text-view {
  font-size: 0.75rem; color: var(--text-primary);
  line-height: 1.3;
}

.entry-empty { color: var(--text-muted); font-size: 0.75rem; padding: 0.25rem 0; }

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
.remarks-content { font-size: 0.8125rem; color: var(--text-primary); line-height: 1.5; }
.remarks-empty { color: var(--text-muted); font-style: italic; font-size: 0.8125rem; }

/* Modal */
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

.form-group { display: flex; flex-direction: column; gap: 0.375rem; }
.form-label { font-size: 0.8125rem; font-weight: 600; color: var(--text-primary); }

.preview-box {
  background: var(--bg-surface-hover);
  border: 1px solid var(--border-light);
  border-radius: 8px; padding: 1rem;
}
.preview-title {
  font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.04em; color: var(--text-muted); margin-bottom: 0.75rem;
}
.preview-members { display: flex; align-items: center; gap: 1rem; }
.preview-member { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; font-weight: 500; }

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

.empty-list {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 3rem 1.5rem; text-align: center; color: var(--text-secondary);
  font-size: 0.8125rem; gap: 0.5rem;
}

/* Mobile responsive */
@media (max-width: 900px) {
  .journal-layout {
    grid-template-columns: 1fr !important;
  }
  .journal-list-panel {
    position: static;
  }
  .viewer-title { font-size: 0.9rem; }
  .sidebar-toggle-btn { display: inline-flex; }
  .journal-table th { padding: 0.5rem; }
  .journal-table td { padding: 0.4rem 0.5rem; }
}
</style>
