<template>
  <div class="animate-fade-in">
    <!-- Header -->
    <div class="page-header" style="margin-bottom: 1.5rem;">
      <div>
        <h1 class="page-title" style="display:flex; align-items:center; gap:0.625rem;">
          <span class="journal-badge-emp"><BookOpenIcon :size="16" /></span>
          Mon Journal
        </h1>
        <p class="page-subtitle" style="margin-bottom:0;">Suivez et complétez votre activité quotidienne</p>
      </div>
    </div>

    <!-- No journal -->
    <div v-if="!loadingJournals && myJournals.length === 0" class="card">
      <div style="text-align:center; padding:3rem 2rem;">
        <div class="journal-empty-icon-emp"><BookOpenIcon :size="28" /></div>
        <p style="font-weight:600; margin:1rem 0 0.5rem;">Aucun journal actif</p>
        <p style="color:var(--text-secondary); font-size:0.875rem; max-width:360px; margin:0 auto;">Votre administrateur doit créer un journal et vous y associer.</p>
      </div>
    </div>
    <div v-else-if="loadingJournals" class="loading-state"><div class="spinner-sm"></div><span>Chargement...</span></div>

    <div v-else>
      <!-- Tabs -->
      <div v-if="myJournals.length > 1" class="journal-tabs">
        <button v-for="j in myJournals" :key="j.id" class="journal-tab" :class="{ 'journal-tab-active': selectedJournal?.id === j.id }" @click="selectJournal(j)">
          <BookOpenIcon :size="13" /> {{ j.nom }}
        </button>
      </div>

      <div v-if="selectedJournal" class="card journal-card">
        <!-- Card Header -->
        <div class="journal-card-header">
          <div>
            <h2 class="journal-card-title">{{ selectedJournal.nom }}</h2>
            <div class="viewer-members">
              <span v-for="(emp,idx) in journalMembres" :key="emp.id" class="member-chip" :class="memberChipClass(emp)">{{ emp.prenom }} {{ emp.nom }}</span>
              <span v-for="je in (selectedJournal.editions||[])" :key="je.edition.id" class="member-chip member-chip-edition">{{ je.edition.licence.sigle }} {{ je.edition.ville.nom_ville }}</span>
            </div>
          </div>
          <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
            <div class="view-toggle">
              <button class="btn btn-sm" :class="viewMode==='journalier'?'btn-primary':'btn-secondary'" @click="viewMode='journalier';loadEntries()" style="padding:0.2rem 0.5rem;">Jour</button>
              <button class="btn btn-sm" :class="viewMode==='semaine'?'btn-primary':'btn-secondary'" @click="viewMode='semaine';loadEntries()" style="padding:0.2rem 0.5rem;">Semaine</button>
            </div>
            <button class="btn btn-secondary btn-sm" @click="prevDay"><ChevronLeftIcon :size="14" /></button>
            <input type="date" v-model="selectedDate" class="date-input" @change="loadEntries" />
            <button class="btn btn-secondary btn-sm" @click="nextDay"><ChevronRightIcon :size="14" /></button>
            <button class="btn btn-secondary btn-sm" @click="goToday">Aujourd'hui</button>
            <span v-if="!canEdit" style="font-size:0.75rem;color:var(--text-muted);font-style:italic;">(Lecture seule)</span>
            <button v-else class="btn btn-primary btn-sm" :disabled="saving" @click="saveEntries">
              <span v-if="saving" class="spinner-xs"></span>
              <SaveIcon v-else :size="13" />
              {{ saving?'Enregistrement...':'Enregistrer' }}
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loadingEntries" class="loading-state" style="padding:3rem;"><div class="spinner-sm"></div><span>Chargement...</span></div>

        <!-- Daily Grid -->
        <div v-else-if="viewMode==='journalier'" class="journal-grid-wrapper">
          <table class="journal-table">
            <thead>
              <tr>
                <th class="time-col">Heure</th>
                <th v-for="emp in journalMembres" :key="emp.id" class="entry-col">
                  <div class="col-header" :class="emp.id===myEmployeId?'col-me':''">
                    <div class="emp-avatar" :class="emp.id===myEmployeId?'emp-avatar-me':'emp-avatar-other'">{{ initials(emp) }}</div>
                    {{ emp.prenom }} {{ emp.nom }}
                    <span v-if="emp.id===myEmployeId" class="col-me-badge">Moi</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="slot in timeSlots" :key="slot" :class="{ 'current-time-row': isCurrentSlot(slot) }">
                <td class="time-cell">{{ slot }}</td>
                <td v-for="emp in journalMembres" :key="emp.id" class="entry-cell" :class="emp.id===myEmployeId?'entry-cell-mine':'entry-cell-partner'">
                  <div class="cell-wrapper" v-if="localGrid[emp.id] && localGrid[emp.id][slot]!==undefined">
                    <!-- Auto task entry (read-only display) -->
                    <div v-if="getEntryRaw(emp.id, slot)?.tacheId && !isEditing(emp.id, slot)"
                      class="entry-content entry-auto"
                      :class="{
                        'entry-done': isTacheTerminee(getEntryRaw(emp.id, slot)),
                        'entry-overdue': !isTacheTerminee(getEntryRaw(emp.id, slot)) && getEntryRaw(emp.id, slot)?.reportee
                      }">
                      <div style="display:flex; justify-content:space-between; width:100%; align-items:flex-start;">
                        <div style="flex:1;">
                          <span class="entry-auto-badge"><CheckIcon :size="10" /> Tâche</span>
                          <span v-if="isTacheTerminee(getEntryRaw(emp.id, slot))" class="entry-done-badge">✓ Terminée</span>
                          <span v-else-if="getEntryRaw(emp.id, slot)?.reportee" class="entry-overdue-badge">⚠ Reportée</span>
                          <span v-if="getEntryRaw(emp.id, slot)?.heure_affichage" class="entry-time-chip">{{ getEntryRaw(emp.id, slot)?.heure_affichage }}</span>
                          {{ localGrid[emp.id][slot].contenu || getEntryRaw(emp.id, slot)?.contenu }}
                        </div>
                        <div style="display:flex; gap:0.15rem; flex-shrink:0; align-items:center; flex-direction:column;">
                          <button v-if="hasAdminMsg(emp.id, slot)" class="icon-btn notif-btn" @click="openEntryModal(emp.id, slot)" title="Message de l'admin">
                            <MessageSquareIcon :size="12" /><span class="notif-badge">!</span>
                          </button>
                          <span v-if="getEntryRaw(emp.id, slot)?.evaluation_type && getEntryRaw(emp.id, slot)?.evaluation_type!=='NEUTRE'" :class="evalTagClass(getEntryRaw(emp.id, slot)?.evaluation_type)" class="eval-tag-emp">
                            {{ getEntryRaw(emp.id, slot)?.evaluation_type==='PRIME'?'Prime':'Pénal.' }}
                          </span>
                          <button v-if="!isTacheTerminee(getEntryRaw(emp.id, slot)) && emp.id===myEmployeId" class="btn btn-sm" style="font-size:0.6rem;padding:0.1rem 0.35rem;background:#10b981;color:white;border:none;" @click="terminerTache(getEntryRaw(emp.id, slot).tacheId)">Déclarer terminée</button>
                          <button class="edit-btn" @click="startEditing(emp.id, slot)"><EditIcon :size="11" /></button>
                        </div>
                      </div>
                    </div>
                    <!-- Editable cell -->
                    <div v-else class="edit-stack">
                      <div style="position:relative;">
                        <textarea
                          v-model="localGrid[emp.id][slot].contenu"
                          class="entry-textarea" :class="{ 'entry-textarea-filled': localGrid[emp.id][slot].contenu?.trim() }"
                          :placeholder="isCurrentSlot(slot)?'Activité en cours...':'Activité...'"
                          rows="1" @input="autoResize($event)"
                        />
                        <div class="cell-actions">
                          <button v-if="hasAdminMsg(emp.id, slot)" class="icon-btn notif-btn" @click="openEntryModal(emp.id, slot)" title="Message de l'admin">
                            <MessageSquareIcon :size="13" /><span class="notif-badge">!</span>
                          </button>
                          <button type="button" @click="openEntryModal(emp.id, slot)" class="icon-btn" title="Détails" style="opacity:0.6;"><EyeIcon :size="14" /></button>
                        </div>
                      </div>
                      <!-- Links display -->
                      <template v-if="localGrid[emp.id][slot].lien">
                        <template v-if="splitLines(localGrid[emp.id][slot].lien).length > 1">
                          <button class="entry-link-chip" @click.stop="openLinksModalEmp(emp.id, slot)" type="button"><LinkIcon :size="10" /> {{ splitLines(localGrid[emp.id][slot].lien).length }} liens</button>
                        </template>
                        <a v-else-if="splitLines(localGrid[emp.id][slot].lien).length===1" :href="splitLines(localGrid[emp.id][slot].lien)[0]" target="_blank" class="entry-link-chip" @click.stop><LinkIcon :size="10" /> Lien</a>
                      </template>
                      <!-- Mails display -->
                      <template v-if="localGrid[emp.id][slot].recherches">
                        <template v-if="splitLines(localGrid[emp.id][slot].recherches).length > 1">
                          <button class="entry-link-chip entry-mail-chip" @click.stop="openMailsModalEmp(emp.id, slot)" type="button"><MailIcon :size="10" /> {{ splitLines(localGrid[emp.id][slot].recherches).length }} mails</button>
                        </template>
                        <a v-else-if="splitLines(localGrid[emp.id][slot].recherches).length===1" :href="'mailto:'+splitLines(localGrid[emp.id][slot].recherches)[0]" class="entry-link-chip entry-mail-chip" @click.stop><MailIcon :size="10" /> Mail</a>
                      </template>
                      <!-- Eval badge -->
                      <span v-if="getEntryRaw(emp.id, slot)?.evaluation_type && getEntryRaw(emp.id, slot)?.evaluation_type!=='NEUTRE'" :class="evalTagClass(getEntryRaw(emp.id, slot)?.evaluation_type)" class="eval-tag-emp eval-tag-emp-inline">
                        {{ getEntryRaw(emp.id, slot)?.evaluation_type==='PRIME'?'🟢 Prime':'🔴 Pénalité' }}
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Weekly Grid -->
        <div v-else-if="viewMode==='semaine'" class="journal-grid-wrapper">
          <div style="display:flex; gap:0.5rem; padding:0.5rem 1rem; background:var(--bg-surface-hover); border-bottom:1px solid var(--border-light);">
            <span style="font-size:0.8125rem; font-weight:600; color:var(--text-secondary); display:flex; align-items:center;">Voir :</span>
            <button v-for="emp in journalMembres" :key="emp.id" class="btn btn-sm" :class="weekEmpId===emp.id?'btn-primary':'btn-secondary'" @click="weekEmpId=emp.id;loadEntries()">{{ emp.id===myEmployeId?'Moi':emp.prenom }}</button>
          </div>
          <table class="journal-table">
            <thead>
              <tr>
                <th class="time-col">Heure</th>
                <th v-for="day in weekDays" :key="day.date" style="text-transform:capitalize;">{{ day.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="slot in timeSlots" :key="slot">
                <td class="time-cell">{{ slot }}</td>
                <td v-for="day in weekDays" :key="day.date" class="entry-cell" style="vertical-align:top;padding:0.4rem;">
                  <div v-if="localGrid[day.date] && localGrid[day.date][slot]" class="cell-wrapper">
                    <div class="entry-content" v-if="!isEditing(weekEmpId, day.date+slot)">
                      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <div style="white-space:pre-wrap; font-size:0.75rem; flex:1;">{{ localGrid[day.date][slot].contenu||'—' }}</div>
                        <button class="icon-btn" @click="openEntryModal(weekEmpId, slot, day.date)" style="opacity:0.7;"><EyeIcon :size="12" /></button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Remarks -->
        <div v-if="viewMode==='journalier' && !loadingEntries" class="remarks-row" :style="{ gridTemplateColumns: `repeat(${journalMembres.length}, 1fr)` }">
          <div v-for="emp in journalMembres" :key="emp.id" class="remarks-card" :class="emp.id!==myEmployeId?'remarks-card-2':''">
            <div class="remarks-label">Remarques — {{ emp.id===myEmployeId?'Moi':emp.prenom }}</div>
            <textarea v-model="localRemarks[emp.id]" class="remarks-textarea" placeholder="Remarque globale pour la journée..." rows="4" />
          </div>
        </div>

        <div v-if="viewMode==='journalier' && !loadingEntries" class="remarks-row" style="border-top:none;">
          <div class="remarks-card" style="grid-column:1 / -1; background:var(--accent-primary)04;">
            <div class="remarks-label" style="color:var(--status-danger);">Remarque de l'Administrateur</div>
            <div class="remarks-content" style="color:var(--text-primary); font-style:italic;">
              <span v-if="adminRemark">{{ adminRemark }}</span>
              <span v-else class="remarks-empty">Aucune remarque générale de l'administrateur.</span>
            </div>
          </div>
        </div>

        <div v-if="saveSuccess" class="save-toast"><CheckCircleIcon :size="14" /> Journal enregistré avec succès !</div>

        <!-- ===== SECTION MÉMOS ===== -->
        <div class="memo-section-emp">
          <div class="memo-section-header-emp" @click="showMemoSection = !showMemoSection">
            <div style="display:flex; align-items:center; gap:0.5rem; font-weight:700; font-size:0.875rem;">
              <StickyNoteIcon :size="15" style="color:var(--accent-primary);" />
              Mémos & Liens
              <span v-if="memos.length > 0" style="background:var(--accent-primary); color:white; font-size:0.65rem; font-weight:700; padding:0.1rem 0.4rem; border-radius:99px;">{{ memos.length }}</span>
            </div>
            <ChevronDownIcon v-if="!showMemoSection" :size="16" style="color:var(--text-muted);" />
            <ChevronUpIcon v-else :size="16" style="color:var(--text-muted);" />
          </div>

          <div v-if="showMemoSection" style="padding:1rem; display:flex; flex-direction:column; gap:1rem;">
            <!-- Filtre date -->
            <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; padding:0.6rem 0.75rem; background:var(--bg-surface-hover); border-radius:8px; border:1px solid var(--border-light); font-size:0.8rem;">
              <span style="font-weight:600; color:var(--text-muted);">Période :</span>
              <input type="date" v-model="memoFilterStart" class="date-input" style="font-size:0.78rem;" />
              <span style="color:var(--text-muted);">→</span>
              <input type="date" v-model="memoFilterEnd" class="date-input" style="font-size:0.78rem;" />
              <button class="btn btn-secondary btn-sm" @click="loadMemos">Filtrer</button>
              <button class="btn btn-secondary btn-sm" @click="memoFilterStart='';memoFilterEnd='';loadMemos()">Tout</button>
            </div>

            <!-- Formulaire ajout -->
            <div style="background:var(--bg-surface-hover); border:1px solid var(--border-light); border-radius:8px; padding:0.875rem; display:flex; flex-direction:column; gap:0.6rem;">
              <div style="font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; color:var(--text-muted);">Nouveau mémo</div>
              <textarea v-model="memoForm.contenu" class="form-input" rows="2" placeholder="Note, information..." style="resize:vertical; font-size:0.875rem;"></textarea>
              <textarea v-model="memoForm.liens" class="form-input" rows="1" placeholder="Liens (un par ligne)" style="resize:vertical; font-size:0.8rem;"></textarea>
              <div style="display:flex; justify-content:flex-end;">
                <button class="btn btn-primary btn-sm" @click="addMemo" :disabled="!memoForm.contenu.trim()"><PlusIcon :size="13" /> Ajouter</button>
              </div>
            </div>

            <!-- Liste mémos -->
            <div v-if="loadingMemos" class="loading-state"><div class="spinner-sm"></div><span>Chargement...</span></div>
            <div v-else-if="memos.length === 0" style="text-align:center; padding:1.5rem; color:var(--text-muted); font-size:0.8rem;">Aucun mémo.</div>
            <div v-else style="display:flex; flex-direction:column; gap:0.6rem;">
              <div v-for="memo in memos" :key="memo.id" style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:8px; padding:0.75rem;">
                <div style="display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:0.4rem;">
                  <div>
                    <span style="font-size:0.78rem; font-weight:600;">{{ memo.auteur ? `${memo.auteur.prenom} ${memo.auteur.nom}` : '?' }}</span>
                    <span style="font-size:0.7rem; color:var(--text-muted); margin-left:0.5rem;">{{ formatMemoDate(memo.createdAt) }}</span>
                  </div>
                  <button v-if="memo.auteur?.id === myEmployeId" @click="deleteMemoEmp(memo.id, memo.auteur.id)" style="background:none;border:none;cursor:pointer;color:var(--text-muted);padding:0.1rem;" title="Supprimer mon mémo">
                    <TrashIcon :size="12" />
                  </button>
                </div>
                <div style="font-size:0.8125rem; color:var(--text-primary); white-space:pre-wrap; line-height:1.5;">{{ memo.contenu }}</div>
                <div v-if="memo.liens" style="margin-top:0.4rem; display:flex; flex-direction:column; gap:0.2rem;">
                  <a v-for="(lien, i) in splitMemoLinks(memo.liens)" :key="i" :href="lien" target="_blank" style="color:var(--accent-primary); font-size:0.75rem; text-decoration:none; display:flex; align-items:center; gap:0.3rem;">
                    <LinkIcon :size="10" /> {{ lien }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== ENTRY MODAL (EMPLOYEE) ===== -->
    <Teleport to="body">
      <div v-if="showEntryModal" class="modal-overlay">
        <div class="modal-box">
          <div class="modal-header">
            <h3 class="modal-title">
              Détails de l'Activité
              <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal; margin-left:0.5rem;">({{ activeDate||selectedDate }} — {{ activeSlot }})</span>
            </h3>
            <button class="modal-close" @click="closeEntryModal"><XIcon :size="16" /></button>
          </div>

          <div class="modal-body">
            <!-- Description -->
            <div class="form-group">
              <label class="form-label" style="color:var(--accent-primary);">Description de l'activité</label>
              <textarea v-model="modalGridCell.contenu" class="form-input" rows="3" placeholder="Ex: Rédaction du rapport..." style="resize:vertical;"></textarea>
            </div>

            <!-- Heure affichage (only for Ianja/Ando/Djibril) -->
            <div v-if="canChooseTime" class="form-group">
              <label class="form-label" style="color:var(--accent-primary);">Heure affichée <span style="font-size:0.7rem; color:var(--text-muted);">(personnalisable)</span></label>
              <input v-model="modalGridCell.heure_affichage" type="text" class="form-input" placeholder="Ex: 14:23" style="max-width:120px;" />
            </div>
            <div v-else-if="getEntryRaw(activeEmployeId, activeSlot, activeDate)?.createdAt" class="form-group">
              <div class="form-label" style="color:var(--text-muted);">Heure d'insertion : {{ formatTime(getEntryRaw(activeEmployeId, activeSlot, activeDate)?.createdAt) }}</div>
            </div>

            <!-- Remarque employé -->
            <div class="form-group">
              <label class="form-label" style="color:var(--accent-primary);">Remarque spécifique</label>
              <textarea v-model="modalGridCell.commentaire" class="form-input" rows="2" placeholder="Ex: En attente de validation..." style="resize:vertical;"></textarea>
            </div>

            <!-- Liens -->
            <div class="form-group">
              <label class="form-label" style="color:var(--accent-primary);">Lien(s) — un par ligne</label>
              <textarea v-model="modalGridCell.lien" class="form-input" rows="2" placeholder="https://lien1.com&#10;https://lien2.com" style="resize:vertical; font-size:0.8125rem;"></textarea>
            </div>

            <!-- Résultats / Mails -->
            <div class="form-group">
              <label class="form-label" style="color:var(--accent-primary);">Résultats / Mails — un par ligne</label>
              <textarea v-model="modalGridCell.recherches" class="form-input" rows="2" placeholder="contact@exemple.com&#10;resultat@site.fr" style="resize:vertical; font-size:0.8125rem;"></textarea>
            </div>

            <!-- Chat thread -->
            <div style="border-top:1px solid var(--border-light); padding-top:0.75rem;">
              <div class="modal-section-title">Discussion</div>
              <div class="chat-thread" ref="chatThreadRef">
                <!-- Legacy commentaire -->
                <div v-if="legacyEmployeeMsg" class="chat-msg chat-msg-emp">
                  <div class="chat-msg-avatar emp-av">{{ myInitials }}</div>
                  <div class="chat-msg-bubble emp-bubble">
                    <div class="chat-msg-author">Moi <span class="chat-legacy">(remarque)</span></div>
                    <div>{{ legacyEmployeeMsg }}</div>
                  </div>
                </div>
                <!-- Legacy admin_commentaire -->
                <div v-if="legacyAdminMsg" class="chat-msg chat-msg-admin">
                  <div class="chat-msg-bubble admin-bubble">
                    <div class="chat-msg-author" style="text-align:right;">Admin <span class="chat-legacy">(note)</span></div>
                    <div>{{ legacyAdminMsg }}</div>
                  </div>
                  <div class="chat-msg-avatar admin-av">A</div>
                </div>
                <!-- New messages -->
                <template v-for="msg in chatMessages" :key="msg.id">
                  <div :class="msg.isAdmin?'chat-msg chat-msg-admin':'chat-msg chat-msg-emp'">
                    <div v-if="!msg.isAdmin" class="chat-msg-avatar emp-av">{{ msg.auteur.charAt(0).toUpperCase() }}</div>
                    <div class="chat-msg-bubble" :class="msg.isAdmin?'admin-bubble':'emp-bubble'">
                      <div class="chat-msg-author" :style="msg.isAdmin?'text-align:right;':''">
                        {{ msg.auteur }} <span class="chat-time">{{ formatTime(msg.createdAt) }}</span>
                      </div>
                      <div>{{ msg.contenu }}</div>
                    </div>
                    <div v-if="msg.isAdmin" class="chat-msg-avatar admin-av">A</div>
                  </div>
                </template>
                <div v-if="!legacyEmployeeMsg && !legacyAdminMsg && chatMessages.length===0" class="chat-empty">
                  <MessageSquareIcon :size="18" style="color:var(--text-muted);" /><span>Aucun message</span>
                </div>
              </div>
              <!-- Employee message input -->
              <div class="chat-input-row" style="margin-top:0.75rem;">
                <textarea v-model="newEmpMsg" class="form-input" rows="2" placeholder="Écrire un message..." style="resize:none; border-color:var(--accent-primary)40;" @keydown.enter.ctrl.prevent="sendEmpMsg"></textarea>
                <button class="btn btn-primary btn-sm" style="flex-shrink:0;" @click="sendEmpMsg" :disabled="!newEmpMsg.trim()"><SendIcon :size="13" /></button>
              </div>
              <p style="font-size:0.7rem;color:var(--text-muted);margin-top:0.25rem;">Ctrl+Entrée pour envoyer</p>
            </div>

            <!-- Admin message (read-only if present) -->
            <div v-if="legacyAdminMsg && false" class="admin-msg-box"><!-- hidden, already shown in chat --></div>

            <!-- Evaluation display -->
            <div v-if="getEntryRaw(activeEmployeId, activeSlot, activeDate)?.evaluation_type && getEntryRaw(activeEmployeId, activeSlot, activeDate)?.evaluation_type!=='NEUTRE'" class="eval-display">
              <span class="eval-display-label">Évaluation :</span>
              <span :class="evalTagClass(getEntryRaw(activeEmployeId, activeSlot, activeDate)?.evaluation_type)" class="eval-tag-emp">
                {{ getEntryRaw(activeEmployeId, activeSlot, activeDate)?.evaluation_type==='PRIME'?'🟢 Prime':'🔴 Pénalité' }}
              </span>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeEntryModal">Fermer</button>
            <button class="btn btn-primary" @click="closeEntryModal">Terminer</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ===== LINKS MODAL ===== -->
    <Teleport to="body">
      <div v-if="showLinksModal" class="modal-overlay">
        <div class="modal-box" style="max-width:420px;">
          <div class="modal-header">
            <h3 class="modal-title"><LinkIcon :size="16" /> Liens</h3>
            <button class="modal-close" @click="showLinksModal=false"><XIcon :size="16" /></button>
          </div>
          <div class="modal-body">
            <div v-for="(lnk,i) in modalLinks" :key="i" class="link-item">
              <a :href="lnk" target="_blank" class="link-item-url"><LinkIcon :size="12" /> {{ lnk }}</a>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ===== MAILS MODAL ===== -->
    <Teleport to="body">
      <div v-if="showMailsModal" class="modal-overlay">
        <div class="modal-box" style="max-width:420px;">
          <div class="modal-header">
            <h3 class="modal-title"><MailIcon :size="16" /> Mails / Résultats</h3>
            <button class="modal-close" @click="showMailsModal=false"><XIcon :size="16" /></button>
          </div>
          <div class="modal-body">
            <div v-for="(mail,i) in modalMails" :key="i" class="link-item">
              <a :href="'mailto:'+mail" class="link-item-url"><MailIcon :size="12" /> {{ mail }}</a>
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
  BookOpen as BookOpenIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon,
  Save as SaveIcon, Check as CheckIcon, Edit as EditIcon, Link as LinkIcon,
  CheckCircle as CheckCircleIcon, MessageSquare as MessageSquareIcon,
  Eye as EyeIcon, X as XIcon, Send as SendIcon, Mail as MailIcon,
  Plus as PlusIcon, Trash as TrashIcon,
  StickyNote as StickyNoteIcon, ChevronDown as ChevronDownIcon, ChevronUp as ChevronUpIcon
} from 'lucide-vue-next'

definePageMeta({ layout: 'employe' })

const timeSlots = []
for (let h = 0; h <= 23; h++) {
  timeSlots.push(`${String(h).padStart(2,'0')}:00`)
  timeSlots.push(`${String(h).padStart(2,'0')}:30`)
}

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
const localGrid = ref({})
const localRemarks = ref({})
const adminRemark = ref('')
const viewMode = ref('journalier')
const weekEmpId = ref(null)
const chatThreadRef = ref(null)

// --- Entry modal ---
const showEntryModal = ref(false)
const activeEmployeId = ref(null)
const activeSlot = ref(null)
const activeDate = ref(null)
const chatMessages = ref([])
const newEmpMsg = ref('')
const modalGridCell = ref({ contenu: '', commentaire: '', lien: '', recherches: '', heure_affichage: '' })
const legacyEmployeeMsg = ref('')
const legacyAdminMsg = ref('')

// --- Links / Mails modals ---
const showLinksModal = ref(false)
const showMailsModal = ref(false)
const modalLinks = ref([])
const modalMails = ref([])

// --- Read tracking (clears notification badge after opening) — persists across navigation ---
const viewedEntries = useState('employe-journal-viewed', () => ({}))

// --- Computed ---
const myEmployeId = computed(() => user.value?.id || null)

const canChooseTime = computed(() => {
  if (!user.value) return false
  const prenom = (user.value.prenom || '').toLowerCase()
  return ['ianja', 'ando', 'djibril'].some(n => prenom.includes(n))
})

const myInitials = computed(() => {
  if (!user.value) return 'M'
  return `${(user.value.prenom||'').charAt(0)}`.toUpperCase()
})

const journalMembres = computed(() => {
  if (!selectedJournal.value) return []
  return [selectedJournal.value.employe1, selectedJournal.value.employe2, selectedJournal.value.employe3, selectedJournal.value.employe4].filter(Boolean)
})

const memberChipClass = (emp) => {
  if (!selectedJournal.value) return ''
  if (emp.id === selectedJournal.value.employe1Id) return ''
  if (emp.id === selectedJournal.value.employe2Id) return 'member-chip-2'
  if (emp.id === selectedJournal.value.employe3Id) return 'member-chip-3'
  return 'member-chip-4'
}

const weekDays = computed(() => {
  const date = new Date(selectedDate.value)
  let day = date.getDay()
  const diffToMonday = day===0?-6:1-day
  const monday = new Date(date)
  monday.setDate(date.getDate()+diffToMonday)
  const days = []
  for (let i=0; i<6; i++) {
    const d = new Date(monday); d.setDate(monday.getDate()+i)
    days.push({ date: d.toISOString().split('T')[0], label: d.toLocaleDateString('fr-FR',{weekday:'short',day:'2-digit',month:'2-digit'}) })
  }
  return days
})

// --- Helpers ---
const initials = (emp) => emp ? `${(emp.prenom||'').charAt(0)}${(emp.nom||'').charAt(0)}`.toUpperCase() : '?'
const isCurrentSlot = (slot) => {
  if (selectedDate.value!==today) return false
  const now=new Date()
  return `${String(now.getHours()).padStart(2,'0')}:${now.getMinutes()<30?'00':'30'}` === slot
}
const getEntryRaw = (empId, heure, dateStr=null) => {
  if (dateStr) return entries.value.find(e=>e.employeId===empId && e.heure===heure && e.date.startsWith(dateStr)) || null
  return entries.value.find(e=>e.employeId===empId && e.heure===heure) || null
}
const isEditing = (empId, slotId) => editingCells.value.has(`${empId}-${slotId}`)
const startEditing = (empId, slotId) => editingCells.value.add(`${empId}-${slotId}`)
const autoResize = (e) => { e.target.style.height='auto'; e.target.style.height=e.target.scrollHeight+'px' }
const evalTagClass = (type) => {
  if (type==='PRIME') return 'eval-tag-prime-emp'
  if (type==='PENALITE') return 'eval-tag-penalite-emp'
  return ''
}
const splitLines = (str) => (str||'').split(/[\s\n]+/).map(s=>s.trim()).filter(Boolean)

const hasAdminMsg = (empId, slot, dateStr=null) => {
  const key = `${empId}-${slot}-${dateStr||selectedDate.value}`
  if (viewedEntries.value[key]) return false
  const e = getEntryRaw(empId, slot, dateStr)
  if (!e) return false
  return !!(e.admin_commentaire || (e.commentaires && e.commentaires.some(m=>m.isAdmin)))
}

const formatTime = (ts) => {
  if (!ts) return ''
  const d = new Date(ts)
  const today = new Date()
  const isToday = d.toDateString() === today.toDateString()
  const time = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
  if (isToday) return `aujourd'hui ${time}`
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')} ${time}`
}

// --- Load data ---
onMounted(async () => {
  await loadJournals()
  // Mark COMMENTAIRE notifications as read when visiting the journal page
  if (user.value?.id) {
    try {
      await $fetch('/api/notifications/marquer-lu', {
        method: 'POST',
        body: { employeId: user.value.id, type: 'COMMENTAIRE' }
      })
    } catch {}
  }
})

const loadJournals = async () => {
  loadingJournals.value = true
  try {
    const url = myEmployeId.value ? `/api/journals?employeId=${myEmployeId.value}` : '/api/journals'
    myJournals.value = await $fetch(url)
    if (myJournals.value.length > 0) {
      await selectJournal(myJournals.value[0])
      weekEmpId.value = myEmployeId.value
    }
  } catch (e) { console.error(e) }
  finally { loadingJournals.value = false }
}

const loadEntries = async () => {
  if (!selectedJournal.value) return
  loadingEntries.value = true
  editingCells.value.clear()
  try {
    if (viewMode.value==='journalier') {
      entries.value = await $fetch(`/api/journals/${selectedJournal.value.id}/entrees?date=${selectedDate.value}`)
    } else {
      const days=weekDays.value
      entries.value = await $fetch(`/api/journals/${selectedJournal.value.id}/entrees?startDate=${days[0].date}&endDate=${days[days.length-1].date}`)
    }
    buildLocalGrid()
  } catch (e) {
    console.error(e); entries.value = []; buildLocalGrid()
  } finally {
    loadingEntries.value = false
  }
}

const buildLocalGrid = () => {
  const grid = {}
  const remarks = {}
  if (viewMode.value==='journalier') {
    journalMembres.value.forEach(emp => {
      grid[emp.id] = {}
      timeSlots.forEach(slot => {
        const e = getEntryRaw(emp.id, slot)
        grid[emp.id][slot] = { contenu: e?.contenu||'', commentaire: e?.commentaire||'', lien: e?.lien||'', recherches: e?.recherches||'', heure_affichage: e?.heure_affichage||'' }
      })
      const remarkEntry = entries.value.find(e=>e.employeId===emp.id && e.heure==='REMARQUES')
      remarks[emp.id] = remarkEntry?.contenu||''
    })
  } else {
    weekDays.value.forEach(day => {
      grid[day.date] = {}
      timeSlots.forEach(slot => {
        const e = entries.value.find(x=>x.employeId===weekEmpId.value && x.heure===slot && x.date.startsWith(day.date))
        grid[day.date][slot] = { contenu: e?.contenu||'', commentaire: e?.commentaire||'', lien: e?.lien||'', recherches: e?.recherches||'', heure_affichage: e?.heure_affichage||'' }
      })
    })
  }
  localGrid.value = grid
  localRemarks.value = remarks
  const aR = entries.value.find(e=>e.employeId===selectedJournal.value.employe1Id && e.heure==='REMARQUE_ADMIN')
  adminRemark.value = aR ? aR.contenu : ''
}

// --- Mémos ---
const memos = ref([])
const loadingMemos = ref(false)
const memoForm = ref({ contenu: '', liens: '' })
const memoFilterStart = ref('')
const memoFilterEnd = ref('')
const showMemoSection = ref(false)

const loadMemos = async () => {
  if (!selectedJournal.value) return
  loadingMemos.value = true
  try {
    let url = `/api/journals/${selectedJournal.value.id}/memos`
    const params = []
    if (memoFilterStart.value) params.push(`startDate=${memoFilterStart.value}`)
    if (memoFilterEnd.value) params.push(`endDate=${memoFilterEnd.value}`)
    if (params.length) url += '?' + params.join('&')
    memos.value = await $fetch(url)
  } catch (e) { console.error(e) }
  finally { loadingMemos.value = false }
}

const addMemo = async () => {
  if (!memoForm.value.contenu.trim() || !myEmployeId.value) return
  try {
    const newMemo = await $fetch(`/api/journals/${selectedJournal.value.id}/memos`, {
      method: 'POST',
      body: { contenu: memoForm.value.contenu, liens: memoForm.value.liens, auteurId: myEmployeId.value }
    })
    memos.value.unshift(newMemo)
    memoForm.value = { contenu: '', liens: '' }
  } catch (e) { console.error(e) }
}

const deleteMemoEmp = async (memoId, auteurId) => {
  if (auteurId !== myEmployeId.value) return
  try {
    await $fetch(`/api/journals/${selectedJournal.value.id}/memos/${memoId}`, { method: 'DELETE' })
    memos.value = memos.value.filter(m => m.id !== memoId)
  } catch (e) { console.error(e) }
}

const splitMemoLinks = (liens) => (liens || '').split(/\n+/).map(s => s.trim()).filter(Boolean)
const formatMemoDate = (ts) => {
  if (!ts) return ''
  return new Date(ts).toLocaleString('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })
}

const selectJournal = async (j) => {
  selectedJournal.value = j
  // Déclencher le report automatique des tâches non terminées
  try {
    const today = new Date().toISOString().split('T')[0]
    await $fetch(`/api/journals/${j.id}/carry-over?date=${today}`, { method: 'POST' })
  } catch {}
  await loadEntries()
  showMemoSection.value = false
  await loadMemos()
}
const prevDay = () => { const d=new Date(selectedDate.value); d.setDate(d.getDate()-1); selectedDate.value=d.toISOString().split('T')[0]; loadEntries() }
const nextDay = () => { const d=new Date(selectedDate.value); d.setDate(d.getDate()+1); selectedDate.value=d.toISOString().split('T')[0]; loadEntries() }
const goToday = () => { selectedDate.value=today; loadEntries() }

// --- Entry Modal ---
const openEntryModal = (empId, slot, date=null) => {
  activeEmployeId.value = empId
  activeSlot.value = slot
  activeDate.value = date
  // Mark as read to clear the notification badge
  viewedEntries.value[`${empId}-${slot}-${date||selectedDate.value}`] = true
  const key = viewMode.value==='journalier' ? empId : date
  const cell = localGrid.value[key]?.[slot]
  modalGridCell.value = { contenu: cell?.contenu||'', commentaire: cell?.commentaire||'', lien: cell?.lien||'', recherches: cell?.recherches||'', heure_affichage: cell?.heure_affichage||'' }
  const entryRaw = getEntryRaw(empId, slot, date)
  legacyEmployeeMsg.value = entryRaw?.commentaire||''
  legacyAdminMsg.value = entryRaw?.admin_commentaire||''
  chatMessages.value = entryRaw?.commentaires||[]
  newEmpMsg.value = ''
  showEntryModal.value = true
  nextTick(() => scrollChat())
}

const closeEntryModal = () => {
  // Sync modal cell back to localGrid
  const key = viewMode.value==='journalier' ? activeEmployeId.value : activeDate.value
  if (key && activeSlot.value && localGrid.value[key]) {
    localGrid.value[key][activeSlot.value] = { ...modalGridCell.value }
  }
  showEntryModal.value = false
  activeEmployeId.value = null
  activeSlot.value = null
  activeDate.value = null
  chatMessages.value = []
}

const scrollChat = () => { if (chatThreadRef.value) chatThreadRef.value.scrollTop = chatThreadRef.value.scrollHeight }

const sendEmpMsg = async () => {
  if (!newEmpMsg.value.trim()) return
  const entryRaw = getEntryRaw(activeEmployeId.value, activeSlot.value, activeDate.value)
  if (!entryRaw?.id) {
    // Need to save first to get entry id
    alert('Veuillez d\'abord enregistrer votre activité.')
    return
  }
  try {
    const msg = await $fetch(`/api/journals/${selectedJournal.value.id}/messages`, {
      method: 'POST',
      body: { entreeId: entryRaw.id, contenu: newEmpMsg.value.trim(), isAdmin: false, auteur: `${user.value?.prenom||''} ${user.value?.nom||''}`.trim() }
    })
    chatMessages.value.push(msg)
    if (entryRaw.commentaires) entryRaw.commentaires.push(msg)
    else entryRaw.commentaires = [msg]
    newEmpMsg.value = ''
    nextTick(() => scrollChat())
  } catch (e) { console.error(e) }
}

// --- Lecture seule si pas de droit d'édition ---
const canEdit = computed(() => {
  if (!selectedJournal.value || !myEmployeId.value) return true
  const j = selectedJournal.value
  // Les membres directs du journal (employe1-4) ont toujours les droits d'édition
  if (j.employe1Id === myEmployeId.value || j.employe2Id === myEmployeId.value ||
      j.employe3Id === myEmployeId.value || j.employe4Id === myEmployeId.value) return true
  // Les autres employés doivent avoir peutEditer explicitement à true
  const acces = j.acces?.find(a => a.employeId === myEmployeId.value)
  return acces?.peutEditer === true
})

// --- Task completion ---
const terminerTache = async (tacheId) => {
  try {
    await $fetch(`/api/taches/${tacheId}/terminer`, { method: 'POST' })
    await loadEntries()
  } catch (e) { console.error(e) }
}

const isTacheTerminee = (entry) => {
  if (entry?.tacheTerminee) return true
  const statut = entry?.tache?.statutTache
  return statut?.libelle?.toLowerCase().includes('termin')
}

// --- Links / Mails modals ---
const openLinksModalEmp = (empId, slot) => {
  const cell = localGrid.value[empId]?.[slot]
  modalLinks.value = splitLines(cell?.lien)
  showLinksModal.value = true
}
const openMailsModalEmp = (empId, slot) => {
  const cell = localGrid.value[empId]?.[slot]
  modalMails.value = splitLines(cell?.recherches)
  showMailsModal.value = true
}

// --- Save ---
const saveEntries = async () => {
  if (!selectedJournal.value || !myEmployeId.value) return
  saving.value = true
  try {
    const entrees = []
    if (viewMode.value==='journalier') {
      journalMembres.value.forEach(emp => {
        timeSlots.forEach(slot => {
          const cell = localGrid.value[emp.id]?.[slot]
          if (cell && (cell.contenu.trim()||cell.commentaire.trim()||cell.lien.trim()||cell.recherches.trim())) {
            entrees.push({
              employeId: emp.id, heure: slot,
              contenu: cell.contenu.trim(), commentaire: cell.commentaire.trim(),
              lien: cell.lien.trim(), recherches: cell.recherches.trim(),
              heure_affichage: cell.heure_affichage||null
            })
          }
        })
        if (localRemarks.value[emp.id]?.trim()) {
          entrees.push({ employeId: emp.id, heure: 'REMARQUES', contenu: localRemarks.value[emp.id].trim() })
        }
      })
    } else {
      weekDays.value.forEach(day => {
        timeSlots.forEach(slot => {
          const cell = localGrid.value[day.date]?.[slot]
          if (cell && (cell.contenu.trim()||cell.commentaire.trim()||cell.lien.trim()||cell.recherches.trim())) {
            entrees.push({ employeId: weekEmpId.value, date: day.date, heure: slot, contenu: cell.contenu.trim(), commentaire: cell.commentaire.trim(), lien: cell.lien.trim(), recherches: cell.recherches.trim() })
          }
        })
      })
    }
    await $fetch(`/api/journals/${selectedJournal.value.id}/entrees`, {
      method: 'POST',
      body: { date: viewMode.value==='journalier' ? selectedDate.value : weekDays.value[0].date, entrees }
    })
    saveSuccess.value = true
    setTimeout(() => { saveSuccess.value=false }, 3000)
    await loadEntries()
  } catch (e) {
    console.error(e); alert('Erreur lors de la sauvegarde.')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.journal-badge-emp { width:32px; height:32px; border-radius:8px; background:linear-gradient(135deg,#7c3aed,var(--accent-primary)); color:white; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

.journal-empty-icon-emp { width:64px; height:64px; border-radius:16px; margin:0 auto; background:var(--bg-surface-hover); border:2px dashed var(--border-light); display:flex; align-items:center; justify-content:center; color:var(--text-muted); }

.journal-tabs { display:flex; gap:0.25rem; margin-bottom:1rem; border-bottom:1px solid var(--border-light); overflow-x:auto; }
.journal-tab { display:flex; align-items:center; gap:0.375rem; padding:0.5rem 1rem; border:none; background:transparent; color:var(--text-secondary); font-size:0.8125rem; font-weight:500; cursor:pointer; border-bottom:2px solid transparent; transition:all 0.15s; white-space:nowrap; }
.journal-tab:hover { color:var(--text-primary); background:var(--bg-surface-hover); }
.journal-tab-active { color:var(--accent-primary); border-bottom-color:var(--accent-primary); font-weight:700; }

.journal-card { padding:0; overflow:hidden; }
.journal-card-header { display:flex; align-items:center; justify-content:space-between; padding:1rem 1.25rem; border-bottom:1px solid var(--border-light); background:var(--bg-surface-hover); flex-wrap:wrap; gap:0.75rem; }
.journal-card-title { font-size:1rem; font-weight:700; margin-bottom:0.25rem; }

.viewer-members { display:flex; gap:0.5rem; flex-wrap:wrap; }
.member-chip { display:inline-flex; align-items:center; background:var(--accent-primary)15; color:var(--accent-primary); font-size:0.7rem; font-weight:600; padding:0.2rem 0.5rem; border-radius:99px; border:1px solid var(--accent-primary)30; }
.member-chip-2 { background:#7c3aed15; color:#7c3aed; border-color:#7c3aed30; }
.member-chip-3 { background:#0ea5e915; color:#0ea5e9; border-color:#0ea5e930; }
.member-chip-4 { background:#f59e0b15; color:#d97706; border-color:#f59e0b30; }
.member-chip-edition { background:#10b98115; color:#059669; border-color:#10b98130; font-size:0.65rem; }

.view-toggle { display:flex; gap:0.25rem; background:var(--bg-surface); padding:0.25rem; border-radius:8px; border:1px solid var(--border-light); margin-right:0.5rem; }
.date-input { font-size:0.8125rem; color:var(--text-primary); background:var(--bg-surface); border:1px solid var(--border-light); border-radius:6px; padding:0.3rem 0.5rem; outline:none; }

.journal-grid-wrapper { overflow-x:auto; max-height:65vh; overflow-y:auto; }
.journal-table { width:100%; border-collapse:collapse; font-size:0.8125rem; table-layout:fixed; }
.journal-table thead { position:sticky; top:0; z-index:2; }
.journal-table th { background:var(--bg-surface-hover); padding:0.75rem 1rem; text-align:left; font-weight:600; border-bottom:2px solid var(--border-light); white-space:nowrap; }
.time-col { width:70px; }
.entry-col { min-width:160px; }

.col-header { display:flex; align-items:center; gap:0.5rem; font-size:0.8125rem; }
.col-me { color:var(--accent-primary); }
.col-me-badge { font-size:0.6rem; font-weight:700; padding:0.1rem 0.35rem; background:var(--accent-primary); color:white; border-radius:99px; margin-left:auto; }
.emp-avatar { width:24px; height:24px; border-radius:50%; color:white; font-size:0.6rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.emp-avatar-me { background:var(--accent-primary); }
.emp-avatar-other { background:#7c3aed; }

.journal-table td { padding:0.4rem 0.75rem; border-bottom:1px solid var(--border-light); vertical-align:top; }
.time-cell { font-size:0.75rem; font-weight:600; color:var(--text-muted); white-space:nowrap; padding-top:0.8rem; }
.current-time-row { background:var(--accent-primary)08 !important; }
.current-time-row .time-cell { color:var(--accent-primary); font-weight:700; }

.entry-cell-mine { background:var(--accent-primary)04; }
.entry-cell-partner { background:#7c3aed04; }
.cell-wrapper { width:100%; display:flex; flex-direction:column; gap:0.25rem; }
.edit-stack { display:flex; flex-direction:column; gap:0.25rem; }

.entry-textarea { width:100%; min-height:28px; padding:0.3rem 2.5rem 0.3rem 0.5rem; font-size:0.8125rem; font-family:inherit; color:var(--text-primary); background:transparent; border:1px solid transparent; border-radius:6px; outline:none; resize:none; overflow:hidden; transition:border-color 0.15s, background 0.15s; box-sizing:border-box; }
.entry-textarea::placeholder { color:var(--text-muted); font-style:italic; }
.entry-textarea:focus { border-color:var(--accent-primary)60; background:var(--bg-surface); box-shadow:0 0 0 2px var(--accent-primary)15; }
.entry-textarea-filled { background:var(--bg-surface); border-color:var(--border-light); }

.cell-actions { position:absolute; right:5px; top:50%; transform:translateY(-50%); display:flex; gap:0.15rem; align-items:center; }
.icon-btn { background:none; border:none; cursor:pointer; color:var(--text-muted); padding:0.25rem; border-radius:4px; display:flex; align-items:center; justify-content:center; transition:all 0.15s; position:relative; }
.icon-btn:hover { color:var(--accent-primary); background:var(--accent-primary)10; }

.notif-btn { position:relative; color:#ef4444 !important; }
.notif-badge { position:absolute; top:-4px; right:-4px; background:#ef4444; color:white; font-size:0.5rem; font-weight:700; width:12px; height:12px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:1.5px solid var(--bg-surface); }

.entry-link-chip { display:inline-flex; align-items:center; gap:0.2rem; color:var(--accent-primary); font-size:0.7rem; text-decoration:none; padding:0.1rem 0.35rem; border-radius:4px; background:var(--accent-primary)10; border:1px solid var(--accent-primary)20; margin-top:0.15rem; cursor:pointer; }
.entry-mail-chip { color:#7c3aed; background:#7c3aed10; border-color:#7c3aed20; }

.entry-time-chip { display:inline-flex; align-items:center; gap:0.2rem; background:var(--accent-primary)15; color:var(--accent-primary); font-size:0.6rem; font-weight:700; padding:0.1rem 0.35rem; border-radius:99px; flex-shrink:0; margin-right:0.25rem; }

.eval-tag-emp { font-size:0.7rem; font-weight:600; padding:0.15rem 0.5rem; border-radius:99px; display:inline-flex; align-items:center; gap:0.2rem; }
.eval-tag-emp-inline { margin-top:0.25rem; }
.eval-tag-prime-emp { background:#10b98115; color:#059669; border:1px solid #10b98130; }
.eval-tag-penalite-emp { background:#ef444415; color:#dc2626; border:1px solid #ef444430; }

.entry-content { display:flex; flex-direction:column; gap:0.2rem; font-size:0.8125rem; color:var(--text-primary); background:var(--bg-surface-hover); border:1px solid var(--border-light); border-radius:6px; padding:0.35rem 0.5rem; line-height:1.4; }
.entry-auto { background:#10b98110; border-color:#10b98130; }
.entry-done { background: #10b98115 !important; border-color: #10b98150 !important; }
.entry-overdue { background: #ef444415 !important; border-color: #ef444450 !important; }
.entry-done-badge { display:inline-flex; align-items:center; background: #10b981; color: white; font-size: 0.6rem; font-weight: 700; padding: 0.1rem 0.35rem; border-radius: 99px; margin-right:0.25rem; }
.entry-overdue-badge { display:inline-flex; align-items:center; background: #ef4444; color: white; font-size: 0.6rem; font-weight: 700; padding: 0.1rem 0.35rem; border-radius: 99px; margin-right:0.25rem; }
.entry-auto-badge { display:inline-flex; align-items:center; gap:0.2rem; background:#10b981; color:white; font-size:0.6rem; font-weight:700; padding:0.1rem 0.35rem; border-radius:99px; flex-shrink:0; margin-right:0.25rem; }
.edit-btn { background:none; border:none; cursor:pointer; color:var(--text-muted); padding:0.1rem; border-radius:3px; display:flex; align-items:center; }
.edit-btn:hover { color:var(--accent-primary); background:var(--accent-primary)10; }

.remarks-row { display:grid; gap:0; border-top:2px solid var(--border-light); }
.remarks-card { padding:1rem 1.25rem; border-right:1px solid var(--border-light); }
.remarks-card:last-child { border-right:none; }
.remarks-card-2 { background:#7c3aed05; }
.remarks-label { font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; color:var(--text-muted); margin-bottom:0.5rem; }
.remarks-textarea { width:100%; font-size:0.8125rem; font-family:inherit; color:var(--text-primary); background:var(--bg-surface-hover); border:1px solid var(--border-light); border-radius:6px; padding:0.5rem; outline:none; resize:vertical; box-sizing:border-box; }
.remarks-textarea:focus { border-color:var(--accent-primary)60; background:var(--bg-surface); }
.remarks-content { font-size:0.8125rem; color:var(--text-primary); line-height:1.5; }
.remarks-empty { color:var(--text-muted); font-style:italic; font-size:0.8125rem; }

.save-toast { display:flex; align-items:center; gap:0.5rem; padding:0.75rem 1.25rem; background:#d1fae5; color:#065f46; font-size:0.8125rem; font-weight:600; border-top:1px solid #6ee7b7; }

.loading-state { display:flex; align-items:center; justify-content:center; gap:0.75rem; padding:2rem; color:var(--text-muted); font-size:0.875rem; }
.spinner-sm { width:20px; height:20px; border-radius:50%; border:2px solid var(--border-light); border-top-color:var(--accent-primary); animation:spin 0.8s linear infinite; }
.spinner-xs { width:14px; height:14px; border-radius:50%; border:2px solid rgba(255,255,255,0.3); border-top-color:white; animation:spin 0.8s linear infinite; display:inline-block; }
@keyframes spin { to { transform:rotate(360deg); } }

/* Modal */
.modal-overlay { position:fixed; inset:0; z-index:10000; background:rgba(0,0,0,0.6); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; padding:1rem; box-sizing:border-box; }
.modal-box { background:var(--bg-surface); border-radius:16px; width:100%; max-width:500px; box-shadow:0 24px 60px rgba(0,0,0,0.3); overflow:hidden; display:flex; flex-direction:column; max-height:calc(100vh - 2rem); }
.modal-header { display:flex; align-items:center; justify-content:space-between; padding:1.25rem 1.5rem; border-bottom:1px solid var(--border-light); flex-shrink:0; }
.modal-title { font-size:1rem; font-weight:700; }
.modal-close { background:none; border:none; cursor:pointer; color:var(--text-muted); padding:0.25rem; border-radius:4px; }
.modal-close:hover { color:var(--text-primary); background:var(--bg-surface-hover); }
.modal-body { padding:1.5rem; display:flex; flex-direction:column; gap:1rem; overflow-y:auto; }
.modal-footer { padding:1rem 1.5rem; border-top:1px solid var(--border-light); display:flex; justify-content:flex-end; gap:0.5rem; flex-shrink:0; }
.form-group { display:flex; flex-direction:column; gap:0.375rem; }
.form-label { font-size:0.8125rem; font-weight:600; color:var(--text-primary); }
.modal-section-title { font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted); margin-bottom:0.5rem; }

/* Chat */
.chat-thread { display:flex; flex-direction:column; gap:0.5rem; background:var(--bg-surface-hover); border:1px solid var(--border-light); border-radius:10px; padding:0.75rem; max-height:180px; overflow-y:auto; }
.chat-empty { display:flex; align-items:center; gap:0.5rem; color:var(--text-muted); font-size:0.8125rem; justify-content:center; padding:0.5rem 0; }
.chat-msg { display:flex; align-items:flex-end; gap:0.5rem; }
.chat-msg-emp { justify-content:flex-start; }
.chat-msg-admin { justify-content:flex-end; }
.chat-msg-avatar { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.6rem; font-weight:700; color:white; flex-shrink:0; }
.emp-av { background:var(--accent-primary); }
.admin-av { background:#ef4444; }
.chat-msg-bubble { max-width:75%; padding:0.5rem 0.75rem; border-radius:12px; font-size:0.8125rem; line-height:1.4; }
.emp-bubble { background:#10b98110; border:1px solid #10b98130; border-bottom-left-radius:3px; }
.admin-bubble { background:#ef444410; border:1px solid #ef444430; border-bottom-right-radius:3px; }
.chat-msg-author { font-size:0.65rem; font-weight:700; color:var(--text-muted); margin-bottom:0.2rem; }
.chat-legacy { font-weight:400; font-style:italic; }
.chat-time { font-weight:400; margin-left:0.4rem; font-size:0.68rem; opacity:0.7; }
.chat-input-row { display:flex; gap:0.5rem; align-items:flex-end; }

/* Eval display */
.eval-display { display:flex; align-items:center; gap:0.5rem; font-size:0.8125rem; }
.eval-display-label { font-size:0.75rem; font-weight:600; color:var(--text-muted); }

/* Links / Mails */
.link-item { padding:0.5rem 0; border-bottom:1px solid var(--border-light); }
.link-item:last-child { border-bottom:none; }
.link-item-url { display:flex; align-items:center; gap:0.5rem; color:var(--accent-primary); font-size:0.875rem; text-decoration:none; word-break:break-all; }
.link-item-url:hover { text-decoration:underline; }

.memo-section-emp { border-top:2px solid var(--border-light); margin-top:0; }
.memo-section-header-emp { cursor:pointer; display:flex; align-items:center; justify-content:space-between; padding:0.75rem 1rem; background:var(--bg-surface-hover); transition:background 0.15s; }
.memo-section-header-emp:hover { background:var(--border-light); }

/* Mobile */
@media (max-width: 768px) {
  .journal-card-header { flex-direction:column; align-items:flex-start; }
  .modal-overlay { padding:0.5rem; align-items:flex-end; }
  .modal-box { max-width:100%; max-height:92vh; border-radius:16px 16px 0 0; }
  .journal-table th, .journal-table td { padding:0.3rem 0.25rem; font-size:0.75rem; }
  .entry-col { min-width:130px; }
}
</style>
