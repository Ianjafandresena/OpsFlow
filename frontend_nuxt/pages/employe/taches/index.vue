<template>
  <div class="animate-fade-in" v-if="myEmployeInfo">
    <div class="page-header">
      <div>
        <h1 class="page-title">Mes Tâches</h1>
        <p class="page-subtitle" style="margin-bottom:0;">Suivi de vos assignations pour {{ myEmployeInfo.poste?.titre_poste }}</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">
        <PlusIcon :size="15" /> Nouvelle Tâche
      </button>
    </div>

    <!-- Filters -->
    <div class="card toolbar" style="margin-bottom:1.25rem;">
      <div class="search-wrapper">
        <SearchIcon class="search-icon" :size="14" />
        <input type="text" v-model="filters.search" placeholder="Rechercher une tâche..." class="form-input" />
      </div>
      <select v-model="filters.editionId" class="form-input" v-if="userDept !== 'Audiovisuel'">
        <option value="">Tous mes Projets</option>
        <option v-for="ed in editions" :key="ed.id" :value="ed.id">{{ ed.licence?.sigle }} - {{ ed.ville?.nom_ville }}</option>
      </select>
      <select v-model="filters.customStatus" class="form-input">
        <option value="">Tous Statuts</option>
        <option value="en_cours">En cours</option>
        <option value="termine">Terminé</option>
        <option value="en_retard">En retard</option>
      </select>
    </div>

    <!-- Table -->
    <div class="card" style="padding:0; overflow:visible;">
      <table class="data-table">
        <thead>
          <tr>
            <th>Tâche</th>
            <th v-if="userDept !== 'Audiovisuel'">Projet / Événement</th>
            <th>Deadline</th>
            <th>Statut</th>
            <th style="text-align:right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in filteredTasks" :key="task.id">
            <td>
              <div style="font-weight:600;">{{ task.titre }}</div>
              <div style="color:var(--text-secondary); font-size:0.75rem; max-width:300px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{ task.description }}</div>
            </td>
            <td v-if="userDept !== 'Audiovisuel'" style="color:var(--text-secondary);">{{ task.edition?.licence?.sigle }} - {{ task.edition?.ville?.nom_ville }}</td>
            <td style="color:var(--text-secondary);">
              <strong :style="{color: new Date(task.date_limite) < new Date() && task.statutTache?.nom !== 'Terminé' && task.statutTache?.libelle !== 'Terminé' && task.statutTache?.nom !== 'Publié' && task.statutTache?.libelle !== 'Publié' ? 'var(--danger-color)' : 'inherit'}">
                {{ new Date(task.date_limite).toLocaleDateString() }}
                <span v-if="new Date(task.date_limite) < new Date() && task.statutTache?.nom !== 'Terminé' && task.statutTache?.libelle !== 'Terminé' && task.statutTache?.nom !== 'Publié' && task.statutTache?.libelle !== 'Publié'" style="font-size:0.75rem; display:block; margin-top:2px;">
                  Retard: {{ calculateLateness(task.date_limite) }}
                </span>
              </strong>
            </td>
            <td>
              <span class="badge" style="padding:0.35rem 0.6rem; font-size:0.75rem; border-radius:12px; font-weight:600; border: 1px solid transparent;" 
                    :style="{background: task.statutTache?.couleur + '20', color: task.statutTache?.couleur, borderColor: task.statutTache?.couleur}">
                {{ task.statutTache?.nom || task.statutTache?.libelle || 'Inconnu' }}
              </span>
            </td>
            <td style="text-align:right; position:relative;">
              <button type="button" class="btn btn-secondary btn-icon" @click.stop="toggleDropdown(task.id)" title="Actions">
                <MoreVerticalIcon :size="14" />
              </button>
              
              <!-- Dropdown Menu -->
              <div v-if="activeDropdownId === task.id" class="dropdown-menu-list" @click.stop>
                <button type="button" class="dropdown-item" @click="viewDetail(task)">
                  <EyeIcon :size="13" /> Voir les détails
                </button>
                <button type="button" class="dropdown-item" @click="actionTerminer(task)">
                  <CheckIcon :size="13" /> Terminer la tâche
                </button>
                <button type="button" class="dropdown-item" @click="actionDemanderModif(task)">
                  <EditIcon :size="13" /> Demander modif.
                </button>
                <button type="button" class="dropdown-item dropdown-item-danger" @click="actionDemanderSuppr(task)">
                  <TrashIcon :size="13" /> Demander suppr.
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredTasks.length===0">
            <td :colspan="userDept === 'Audiovisuel' ? 4 : 5" style="text-align:center; padding:2rem; color:var(--text-secondary);">Aucune tâche trouvée.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal CRUD (Dynamique selon le département) -->
    <Modal :isOpen="modal" :title="isDemandeModif ? 'Demande de Modification' : (editing ? 'Modifier la Tâche' : 'Nouvelle Tâche')" @close="modal=false">
      <form @submit.prevent="save" style="display:flex; flex-direction:column; gap:1rem;">
        
        <!-- ======================= -->
        <!-- FORMULAIRE COMMUNICATION-->
        <!-- ======================= -->
        <template v-if="userDept === 'Communication'">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label class="form-label">Type de Tâche</label>
              <select v-model="form.typeTache" required class="form-input">
                <option>Publication</option>
                <option>Démarche Administrative</option>
                <option>Mailing (Newsletter)</option>
                <option>Sponsorisation (Ads)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Page concernée</label>
              <select v-model="form.editionId" required class="form-input">
                <option value="" disabled>Choisir la page</option>
                <option v-for="ed in editions" :key="ed.id" :value="ed.id">{{ ed.licence?.sigle }} - {{ ed.ville?.nom_ville }}</option>
              </select>
            </div>
          </div>
          
          <!-- Publication -->
          <div v-if="form.typeTache === 'Publication'" style="padding-top:0.5rem; border-top:1px solid var(--border-light);">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
              <div class="form-group">
                <label class="form-label">Plateformes</label>
                <div style="display:flex; gap:1rem; align-items:center; height:38px;">
                  <label style="display:flex; align-items:center; gap:0.25rem; font-size:0.875rem;"><input type="checkbox" v-model="form.plateformes" value="Facebook" /> Facebook</label>
                  <label style="display:flex; align-items:center; gap:0.25rem; font-size:0.875rem;"><input type="checkbox" v-model="form.plateformes" value="Instagram" /> Instagram</label>
                  <label style="display:flex; align-items:center; gap:0.25rem; font-size:0.875rem;"><input type="checkbox" v-model="form.plateformes" value="TikTok" /> TikTok</label>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Type de publication</label>
                <select v-model="form.type_pub" class="form-input">
                  <option>Poste</option><option>Story</option><option>Reels</option>
                </select>
              </div>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
              <div class="form-group">
                <label class="form-label">Thème du post</label>
                <select v-model="form.themePubId" class="form-input">
                  <option value="">Aucun</option>
                  <option v-for="th in themes" :key="th.id" :value="th.id">{{ th.nom_theme }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Action</label>
                <div style="display:flex; gap:1rem; align-items:center; height:38px;">
                  <label style="display:flex; align-items:center; gap:0.25rem;"><input type="radio" v-model="form.action_publication" value="Programmer" /> Programmer</label>
                  <label style="display:flex; align-items:center; gap:0.25rem;"><input type="radio" v-model="form.action_publication" value="Publier" /> Publier</label>
                </div>
              </div>
            </div>
            <div v-if="form.action_publication === 'Programmer'" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-top: 1rem;">
              <div class="form-group">
                <label class="form-label">Poste programmé pour la date et heure :</label>
                <input type="datetime-local" v-model="form.date_limite" class="form-input" required />
              </div>
            </div>
          </div>

          <!-- Démarche -->
          <div v-if="form.typeTache === 'Démarche Administrative'" style="padding-top:0.5rem; border-top:1px solid var(--border-light);">
            <div class="form-group" style="margin-bottom:1rem;">
              <label class="form-label">Type de démarche</label>
              <select v-model="form.type_demarche" class="form-input" required>
                <option value="" disabled>Choisir la démarche...</option>
                <option>Déclaration de débit</option>
                <option>Demande d'autorisation de débit de boisson</option>
                <option>Envoie du dossier de sécurité de la ville</option>
                <option>Déclaration ARS</option>
              </select>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
              <div class="form-group"><label class="form-label">Date limite de Demande</label><input type="date" v-model="form.date_demande" class="form-input" /></div>
              <div class="form-group"><label class="form-label">Date limite Résultat</label><input type="date" v-model="form.date_limite" class="form-input" required /></div>
            </div>
          </div>

          <!-- Mailing -->
          <div v-if="form.typeTache === 'Mailing (Newsletter)'" style="padding-top:0.5rem; border-top:1px solid var(--border-light);">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
              <div class="form-group"><label class="form-label">Outil</label><select v-model="form.outil_mailing" class="form-input"><option>Brevo</option><option>Mailchimp</option></select></div>
              <div class="form-group"><label class="form-label">Date et Heure d'envoi</label><input type="datetime-local" v-model="form.date_limite" class="form-input" required /></div>
            </div>
          </div>

          <!-- Sponsorisation -->
          <div v-if="form.typeTache === 'Sponsorisation (Ads)'" style="padding-top:0.5rem; border-top:1px solid var(--border-light);">
            <div v-if="!editing" style="margin-bottom:1rem;">
              <div v-for="(sp, idx) in form.sponsorisations" :key="idx" style="display:grid; grid-template-columns:1fr 100px 30px; gap:0.5rem; margin-bottom:0.5rem; align-items:end;">
                <div class="form-group"><label class="form-label" v-if="idx===0">Thème à sponsoriser</label><select v-model="sp.themeId" class="form-input" required><option value="" disabled>Choisir</option><option v-for="th in themes" :key="th.id" :value="th.id">{{ th.nom_theme }}</option></select></div>
                <div class="form-group"><label class="form-label" v-if="idx===0">Budget (€)</label><input type="number" v-model="sp.budget" class="form-input" required /></div>
                <button type="button" class="btn-danger-ghost" style="height:38px; padding:0; width:30px; display:flex; justify-content:center; align-items:center;" @click="form.sponsorisations.splice(idx,1)" v-if="form.sponsorisations.length>1"><TrashIcon :size="16" /></button>
              </div>
              <button type="button" class="btn btn-secondary btn-sm" @click="form.sponsorisations.push({themeId:'', budget:''})" style="width:100%; justify-content:center;"><PlusIcon :size="14" /> Ajouter un autre</button>
            </div>
            <div v-else style="margin-bottom:1rem; display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
              <div class="form-group"><label class="form-label">Thème à sponsoriser</label><select v-model="form.themeSponsoId" class="form-input" required><option v-for="th in themes" :key="th.id" :value="th.id">{{ th.nom_theme }}</option></select></div>
              <div class="form-group"><label class="form-label">Budget (€)</label><input type="number" v-model="form.budget" class="form-input" required /></div>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
              <div class="form-group"><label class="form-label">Date et Heure</label><input type="datetime-local" v-model="form.date_limite" class="form-input" required /></div>
              <div class="form-group"><label class="form-label">Ciblage / Audience</label><input type="text" v-model="form.audience" class="form-input" /></div>
            </div>
          </div>
        </template>

        <!-- ======================= -->
        <!-- FORMULAIRE MONTEUR VIDÉO-->
        <!-- ======================= -->
        <template v-else-if="userDept === 'Audiovisuel'">
          <div class="form-group">
            <label class="form-label">Nom du Projet</label>
            <input type="text" v-model="form.titre" required class="form-input" placeholder="Ex: Teaser JOF Évreux 2026" />
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label class="form-label">Demandeur</label>
              <select v-model="form.demandeur" class="form-input">
                <option value="" disabled>Choisir un demandeur</option>
                <option v-for="emp in employes" :key="emp.id" :value="emp.prenom + ' ' + emp.nom">{{ emp.prenom }} {{ emp.nom }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Deadline</label>
              <input type="datetime-local" v-model="form.date_limite" required class="form-input" />
            </div>
          </div>
        </template>

        <!-- ======================= -->
        <!-- FORMULAIRE DESIGNER     -->
        <!-- ======================= -->
        <template v-else-if="userDept === 'Design'">
          <div class="form-group">
            <label class="form-label">Nom du Livrable</label>
            <input type="text" v-model="form.titre" required class="form-input" placeholder="Ex: Affiche A3, Visuel Annonce Invité..." />
          </div>
          <div class="form-group">
            <label class="form-label">Événement</label>
            <select v-model="form.editionId" required class="form-input">
              <option value="" disabled>Choisir</option>
              <option v-for="ed in editions" :key="ed.id" :value="ed.id">{{ ed.licence?.sigle }} - {{ ed.ville?.nom_ville }}</option>
            </select>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label class="form-label">Type de Visuel</label>
              <select v-model="form.type_visuel" required class="form-input">
                <option>Affiche</option><option>Caroussel IG</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Quantité (Déclinaisons)</label>
              <input type="number" v-model="form.quantite" class="form-input" min="1" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Deadline</label>
            <input type="datetime-local" v-model="form.date_limite" required class="form-input" />
          </div>
        </template>

        <!-- ======================= -->
        <!-- FORMULAIRE DEVELOPPEUR  -->
        <!-- ======================= -->
        <template v-else-if="userDept === 'Technique'">
          <div class="form-group">
            <label class="form-label">Titre de la Tâche</label>
            <input type="text" v-model="form.titre" required class="form-input" placeholder="Ex: Page Billetterie JOF, Bug Fix..." />
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label class="form-label">Projet / Événement</label>
              <select v-model="form.editionId" required class="form-input">
                <option value="" disabled>Choisir</option>
                <option v-for="ed in editions" :key="ed.id" :value="ed.id">{{ ed.licence?.sigle }} - {{ ed.ville?.nom_ville }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Type Technique</label>
              <select v-model="form.type_technique" required class="form-input">
                <option>Site Vitrine</option><option>Billetterie</option><option>App Interne</option><option>Maintenance</option><option>Autre</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Deadline</label>
            <input type="datetime-local" v-model="form.date_limite" required class="form-input" />
          </div>
        </template>

        <!-- ======================= -->
        <!-- CHAMPS COMMUNS A TOUS   -->
        <!-- ======================= -->
        <div class="form-group">
          <label class="form-label">Lien / Livrable</label>
          <input type="text" v-model="form.lien_livrable" class="form-input" placeholder="Lien Drive, Lien du Post, Lien externe..." />
        </div>
        <div class="form-group">
          <label class="form-label">Description / Détails / Brief</label>
          <textarea v-model="form.description" class="form-input" rows="3" placeholder="Informations complémentaires, liens, consignes..."></textarea>
        </div>
        
        <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:0.5rem;">
          <button type="button" class="btn btn-secondary" @click="modal=false">Annuler</button>
          <button type="submit" class="btn btn-primary">{{ isDemandeModif ? 'Envoyer la Demande' : (editing ? 'Enregistrer' : 'Créer') }}</button>
        </div>
      </form>
    </Modal>
    
    <ConfirmModal 
      :isOpen="confirmModal.isOpen"
      :title="confirmModal.title"
      :message="confirmModal.message"
      @confirm="onConfirmExecute"
      @cancel="confirmModal.isOpen = false"
    />

    <!-- Modal Motif Demande -->
    <Modal :isOpen="motifModal.isOpen" :title="motifModal.title" @close="motifModal.isOpen = false">
      <form @submit.prevent="submitDemande" style="display:flex; flex-direction:column; gap:1rem;">
        <p style="color:var(--text-secondary); font-size:0.875rem;">{{ motifModal.message }}</p>
        <div class="form-group">
          <label class="form-label">Motif / Justification de la demande</label>
          <textarea v-model="motifModal.motif" required class="form-input" rows="3" placeholder="Pourquoi demandez-vous cela ? (ex: Erreur de saisie, Changement de planning...)"></textarea>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:0.5rem;">
          <button type="button" class="btn btn-secondary" @click="motifModal.isOpen = false">Annuler</button>
          <button type="submit" class="btn btn-primary">Envoyer la demande</button>
        </div>
      </form>
    </Modal>

    <!-- Modal Terminer Tâche -->
    <Modal :isOpen="terminerModal.isOpen" title="Terminer la Tâche" @close="terminerModal.isOpen = false">
      <form @submit.prevent="submitTerminer" style="display:flex; flex-direction:column; gap:1rem;">
        <p style="color:var(--text-secondary); font-size:0.875rem;">
          Veuillez fournir le lien vers le livrable ou le post pour clôturer la tâche : <strong>{{ terminerModal.tache?.titre }}</strong>.
        </p>
        <div class="form-group">
          <label class="form-label">Lien (Livrable / Post)</label>
          <input type="url" v-model="terminerModal.lien_livrable" required class="form-input" placeholder="https://..." />
        </div>
        <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:0.5rem;">
          <button type="button" class="btn btn-secondary" @click="terminerModal.isOpen = false">Annuler</button>
          <button type="submit" class="btn btn-primary">Valider et Terminer</button>
        </div>
      </form>
    </Modal>
    
    <TacheDetailModal :isOpen="detailModal" :tache="detailTache" @close="detailModal=false" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus as PlusIcon, Search as SearchIcon, Edit as EditIcon, Trash2 as TrashIcon, MoreVertical as MoreVerticalIcon, Check as CheckIcon, Eye as EyeIcon } from 'lucide-vue-next'

definePageMeta({ layout: 'employe' })

const { user } = useAuth()
const loggedEmployeId = computed(() => user.value?.id)

const myEmployeInfo = computed(() => user.value)

// Déduire le département pour conditionner le formulaire
const userDept = computed(() => {
  const p = myEmployeInfo.value?.poste?.titre_poste || ''
  if (p.includes('Monteur')) return 'Audiovisuel'
  if (p.includes('Designer') || p.includes('Graphiste')) return 'Design'
  if (p.includes('Développeur') || p.includes('Tech')) return 'Technique'
  return myEmployeInfo.value?.poste?.departement?.nom_departement || 'Communication'
})

// --- DONNÉES DYNAMIQUES DEPUIS L'API ---
// Use computed query so employeId is reactive and always up-to-date
const tachesQuery = computed(() => ({ employeId: loggedEmployeId.value }))
const { data: taches, refresh: refreshTaches } = await useFetch('/api/taches', { query: tachesQuery })
const { data: editions } = await useFetch('/api/editions')
const { data: statuts } = await useFetch('/api/taches/statuts')
const { data: themes } = await useFetch('/api/themes') // Pour CM

// Refresh tasks when the logged-in employeId becomes available (e.g. after hydration)
watch(loggedEmployeId, async (newId) => {
  if (newId) await refreshTaches()
})

const modal = ref(false)
const editing = ref(false)
const activeDropdownId = ref(null)
const isDemandeModif = ref(false)
const detailModal = ref(false)
const detailTache = ref(null)
const viewDetail = (t) => { detailTache.value = t; detailModal.value = true; activeDropdownId.value = null }

const motifModal = ref({
  isOpen: false,
  title: '',
  message: '',
  motif: '',
  type: '',
  tacheId: '',
  payload: null
})

const toggleDropdown = (id) => {
  if (activeDropdownId.value === id) {
    activeDropdownId.value = null
  } else {
    activeDropdownId.value = id
  }
}

const handleOutsideClick = () => {
  activeDropdownId.value = null
}

onMounted(async () => {
  window.addEventListener('click', handleOutsideClick)
  await refreshTaches()
})

onUnmounted(() => {
  window.removeEventListener('click', handleOutsideClick)
})

// --- CONFIRMATION DYNAMICS ---
const confirmModal = ref({ isOpen: false, title: '', message: '', onConfirm: null })
const requireConfirm = (title, message, onConfirm) => {
  confirmModal.value = { isOpen: true, title, message, onConfirm }
}
const onConfirmExecute = async () => {
  if (confirmModal.value.onConfirm) await confirmModal.value.onConfirm()
  confirmModal.value.isOpen = false
}

const filters = ref({ search:'', editionId:'', customStatus:'' })

const calculateLateness = (dateLimite) => {
  const diffMs = new Date() - new Date(dateLimite);
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays > 0) return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours > 0) return `${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  return "Moins d'une heure";
}

const getIsoTime = (d) => {
  if (!d) return ''
  const dt = new Date(d)
  dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset())
  return dt.toISOString().slice(0, 16)
}

const defaultForm = () => {
  const defaultStatut = statuts.value?.find(s => s.nom === 'En cours' || s.libelle === 'En cours')?.id || statuts.value?.[0]?.id || ''
  return { 
    id:null, titre:'', employeId: loggedEmployeId.value, editionId:'', statutTacheId: defaultStatut, 
    date_limite: getIsoTime(new Date()), date_demande: '', description:'',
    
    // Champs spécifiques CM
    typeTache:'Publication', plateformes:['Facebook'], type_pub:'Poste', themePubId: '', themeSponsoId: '', action_publication: 'Programmer',
    sponsorisations: [{ themeId: '', budget: '' }],
    type_demarche:'', budget: null, audience:'', outil_mailing: 'Brevo',
    
    // Champs spécifiques Monteur
    demandeur:'',
    
    // Champs spécifiques Designer
    type_visuel:'Affiche', quantite: 1,
    
    // Champs spécifiques Dev
    type_technique:'Site Vitrine',
    
    // Commun
    lien_livrable: ''
  }
}
const form = ref(defaultForm())

const filteredTasks = computed(() => {
  if (!taches.value) return []
  return taches.value.filter(t => { 
    if (filters.value.search && !t.titre.toLowerCase().includes(filters.value.search.toLowerCase()) && !t.description?.toLowerCase().includes(filters.value.search.toLowerCase())) return false
    if (filters.value.editionId && t.editionId !== filters.value.editionId) return false
    
    const isTermine = t.statutTache?.nom === 'Terminé' || t.statutTache?.libelle === 'Terminé' || t.statutTache?.nom === 'Publié' || t.statutTache?.libelle === 'Publié';
    const isRetard = !isTermine && new Date(t.date_limite) < new Date();
    
    if (filters.value.customStatus === 'en_cours') {
      if (isTermine || isRetard) return false;
    } else if (filters.value.customStatus === 'termine') {
      if (!isTermine) return false;
    } else if (filters.value.customStatus === 'en_retard') {
      if (!isRetard) return false;
    }
    
    return true
  })
})

const openCreate = () => { editing.value=false; isDemandeModif.value=false; form.value=defaultForm(); modal.value=true }
const openEdit = (t) => { 
  editing.value=true; 
  isDemandeModif.value=false;
  
  // Rétrocompatibilité Helper CM
  let helper = 'Publication'
  if (t.type_demarche) helper = 'Démarche Administrative'
  else if (t.outil_mailing) helper = 'Mailing (Newsletter)'
  else if (t.budget || t.titre.includes('Sponsorisation')) helper = 'Sponsorisation (Ads)'
  
  form.value={
    ...defaultForm(),
    ...t, 
    employeId: loggedEmployeId.value,
    typeTache: helper,
    date_limite: getIsoTime(t.date_limite),
    date_demande: t.date_demande ? new Date(t.date_demande).toISOString().split('T')[0] : '',
    plateformes: t.plateforme ? t.plateforme.split(', ') : [],
    action_publication: 'Programmer',
    lien_livrable: t.lien_livrable || ''
  }
  modal.value=true 
}

const save = async () => {
  if (isDemandeModif.value) {
    modal.value = false
    motifModal.value = {
      isOpen: true,
      title: 'Justifier la Modification',
      message: `Veuillez spécifier le motif pour la modification de la tâche : "${form.value.titre}".`,
      motif: '',
      type: 'MODIFICATION',
      tacheId: form.value.id,
      payload: { ...form.value }
    }
    return
  }

  // --- Si l'employé est CM ---
  if (userDept.value === 'Communication') {
    if (editing.value || form.value.typeTache !== 'Sponsorisation (Ads)') {
      const body = { ...form.value }
      let genTitre = form.value.typeTache
      if (body.typeTache === 'Publication') genTitre = `${body.plateforme || body.plateformes.join(', ')} - ${body.type_pub}`
      if (body.typeTache === 'Démarche Administrative') genTitre = body.type_demarche || 'Démarche'
      if (body.typeTache === 'Sponsorisation (Ads)') genTitre = `Sponsorisation (${body.budget || 0}€)`
      
      if (body.typeTache === 'Publication') {
        body.type_demarche = null; body.budget = null; body.audience = null; body.outil_mailing = null; body.date_demande = null; body.themeSponsoId = null;
      } else if (body.typeTache === 'Démarche Administrative') {
        body.plateforme = null; body.type_pub = null; body.themePubId = null; body.budget = null; body.audience = null; body.outil_mailing = null; body.themeSponsoId = null;
        if (body.date_demande) body.date_demande = new Date(body.date_demande).toISOString()
        body.date_resultat = new Date(body.date_limite).toISOString() 
      } else if (body.typeTache === 'Sponsorisation (Ads)') {
        body.plateforme = null; body.type_pub = null; body.themePubId = null; body.type_demarche = null; body.outil_mailing = null; body.date_demande = null;
      } else if (body.typeTache === 'Mailing (Newsletter)') {
        body.plateforme = null; body.type_pub = null; body.themePubId = null; body.type_demarche = null; body.budget = null; body.audience = null; body.date_demande = null; body.themeSponsoId = null;
      }

      body.date_limite = new Date(body.date_limite).toISOString()

      if (!editing.value && body.typeTache === 'Publication') {
        for (const p of form.value.plateformes) {
          const platformBody = { ...body, plateforme: p, titre: `${p} - ${form.value.type_pub}` }
          await $fetch('/api/taches', { method: 'POST', body: platformBody })
        }
      } else {
        if (body.typeTache === 'Publication') {
          body.plateforme = form.value.plateformes.join(', ')
          body.titre = `${body.plateforme} - ${body.type_pub}`
        } else {
          body.titre = genTitre;
        }
        await $fetch('/api/taches', { method: 'POST', body })
      }
    } else {
      for (const sp of form.value.sponsorisations) {
        if (!sp.themeId || !sp.budget) continue;
        const body = {
          ...form.value, titre: `Sponsorisation (${sp.budget}€)`, themeSponsoId: sp.themeId, budget: sp.budget,
          date_limite: new Date(form.value.date_limite).toISOString(),
          plateforme: null, type_pub: null, themePubId: null, type_demarche: null, outil_mailing: null, date_demande: null
        }
        await $fetch('/api/taches', { method: 'POST', body })
      }
    }
  } 
  // --- Pour les autres (Monteur, Designer, Dev) ---
  else {
    const body = { ...form.value }
    body.date_limite = new Date(body.date_limite).toISOString()
    body.employeId = loggedEmployeId.value // On assigne la tâche à l'employé connecté
    
    // Nettoyer les champs inutiles selon le poste pour éviter les conflits
    if (userDept.value === 'Audiovisuel') {
      body.typeTache = 'MONTEUR'
      body.type_visuel = null; body.quantite = null; body.type_technique = null;
    } else if (userDept.value === 'Design') {
      body.typeTache = 'DESIGNER'
      body.format_video = null; body.duree_cible = null; body.demandeur = null; body.type_technique = null;
    } else if (userDept.value === 'Technique') {
      body.typeTache = 'DEV'
      body.format_video = null; body.duree_cible = null; body.demandeur = null; body.type_visuel = null; body.quantite = null;
    }
    
    await $fetch('/api/taches', { method: 'POST', body })
  }

  await refreshTaches()
  modal.value=false
}

const changeStatus = async (id, newStatutId) => {
  const t = taches.value.find(ta => ta.id === id)
  if (t) {
    const d = new Date(t.date_limite)
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    const dtLocal = d.toISOString().slice(0, 16)
    
    await $fetch('/api/taches', { method: 'POST', body: { ...t, statutTacheId: newStatutId, date_limite: dtLocal } })
    await refreshTaches()
  }
}

const remove = (id) => { 
  requireConfirm('Supprimer cette tâche ?', 'Êtes-vous sûr de vouloir supprimer cette tâche ?', async () => {
    await $fetch(`/api/taches/${id}`, { method: 'DELETE' })
    await refreshTaches()
  })
}

const terminerModal = ref({
  isOpen: false,
  tache: null,
  lien_livrable: ''
})

const actionTerminer = (task) => {
  const statusTermine = statuts.value?.find(s => s.nom === 'Terminé' || s.libelle === 'Terminé')
  if (statusTermine) {
    if (userDept.value === 'Communication' || userDept.value === 'Audiovisuel' || userDept.value === 'Design') {
      terminerModal.value = {
        isOpen: true,
        tache: task,
        lien_livrable: task.lien_livrable || ''
      }
    } else {
      requireConfirm('Terminer la tâche ?', `Êtes-vous sûr de vouloir marquer la tâche "${task.titre}" comme terminée ?`, async () => {
        await changeStatus(task.id, statusTermine.id)
      })
    }
  }
}

const submitTerminer = async () => {
  const statusTermine = statuts.value?.find(s => s.nom === 'Terminé' || s.libelle === 'Terminé')
  if (statusTermine && terminerModal.value.tache) {
    const t = terminerModal.value.tache
    const d = new Date(t.date_limite)
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    const dtLocal = d.toISOString().slice(0, 16)
    
    await $fetch('/api/taches', { method: 'POST', body: { ...t, statutTacheId: statusTermine.id, date_limite: dtLocal, lien_livrable: terminerModal.value.lien_livrable } })
    await refreshTaches()
  }
  terminerModal.value.isOpen = false
}

const actionDemanderModif = (task) => {
  openEdit(task)
  isDemandeModif.value = true
}

const actionDemanderSuppr = (task) => {
  motifModal.value = {
    isOpen: true,
    title: 'Demande de Suppression',
    message: `Vous demandez la suppression de la tâche : "${task.titre}".`,
    motif: '',
    type: 'SUPPRESSION',
    tacheId: task.id,
    payload: null
  }
}

const submitDemande = async () => {
  const body = {
    tacheId: motifModal.value.tacheId,
    typeDemande: motifModal.value.type,
    motif: motifModal.value.motif,
    donneesModif: null
  }

  if (motifModal.value.type === 'MODIFICATION' && motifModal.value.payload) {
    const payload = { ...motifModal.value.payload }
    payload.date_limite = new Date(payload.date_limite).toISOString()
    if (payload.date_demande) payload.date_demande = new Date(payload.date_demande).toISOString()
    if (payload.date_resultat) payload.date_resultat = new Date(payload.date_resultat).toISOString()

    // Nettoyer selon le poste
    if (userDept.value === 'Communication') {
      let genTitre = payload.typeTache
      if (payload.typeTache === 'Publication') {
        payload.plateforme = payload.plateformes?.join(', ') || ''
        payload.titre = `${payload.plateforme} - ${payload.type_pub}`
        payload.type_demarche = null; payload.budget = null; payload.audience = null; payload.outil_mailing = null; payload.date_demande = null; payload.themeSponsoId = null;
      } else if (payload.typeTache === 'Démarche Administrative') {
        payload.plateforme = null; payload.type_pub = null; payload.themePubId = null; payload.budget = null; payload.audience = null; payload.outil_mailing = null; payload.themeSponsoId = null;
      } else if (payload.typeTache === 'Sponsorisation (Ads)') {
        payload.plateforme = null; payload.type_pub = null; payload.themePubId = null; payload.type_demarche = null; payload.outil_mailing = null; payload.date_demande = null;
      } else if (payload.typeTache === 'Mailing (Newsletter)') {
        payload.plateforme = null; payload.type_pub = null; payload.themePubId = null; payload.type_demarche = null; payload.budget = null; payload.audience = null; payload.date_demande = null; payload.themeSponsoId = null;
      }
    } else if (userDept.value === 'Audiovisuel') {
      payload.typeTache = 'MONTEUR'
      payload.type_visuel = null; payload.quantite = null; payload.type_technique = null;
    } else if (userDept.value === 'Design') {
      payload.typeTache = 'DESIGNER'
      payload.format_video = null; payload.duree_cible = null; payload.demandeur = null; payload.type_technique = null;
    } else if (userDept.value === 'Technique') {
      payload.typeTache = 'DEV'
      payload.format_video = null; payload.duree_cible = null; payload.demandeur = null; payload.type_visuel = null; payload.quantite = null;
    }

    body.donneesModif = payload
  }

  await $fetch('/api/taches/demandes', {
    method: 'POST',
    body
  })

  motifModal.value.isOpen = false
  isDemandeModif.value = false
  await refreshTaches()
}
</script>
