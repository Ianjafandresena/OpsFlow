<template>
  <div class="animate-fade-in">
    <div class="page-header">
      <div>
        <h1 class="page-title">Tâches CM & Administratives</h1>
        <p class="page-subtitle" style="margin-bottom:0;">Planification des publications et suivi des dossiers (sécurité, ARS, boissons...).</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">
        <PlusIcon :size="15" /> Nouvelle Tâche
      </button>
    </div>

    <!-- Filters -->
    <div class="card" style="margin-bottom:1.25rem; display:flex; flex-direction:row; gap:0.75rem; align-items:center; flex-wrap:wrap; padding:0.875rem 1.25rem;">
      <div class="search-wrapper" style="flex:1; min-width:160px;">
        <SearchIcon class="search-icon" :size="14" />
        <input type="text" v-model="filters.search" placeholder="Rechercher..." class="form-input" />
      </div>
      <select v-model="filters.typeTache" class="form-input" style="width:auto; min-width:140px;">
        <option value="">Tous les Types</option>
        <option>Publication</option>
        <option>Démarche Administrative</option>
        <option>Mailing (Newsletter)</option>
        <option>Sponsorisation (Ads)</option>
      </select>
      <select v-model="filters.editionId" class="form-input" style="width:auto; min-width:150px;">
        <option value="">Toutes les Pages</option>
        <option v-for="ed in editions" :key="ed.id" :value="ed.id">{{ ed.licence?.sigle }} - {{ ed.ville?.nom_ville }}</option>
      </select>
      <select v-model="filters.employeId" class="form-input" style="width:auto; min-width:140px;">
        <option value="">Toute l'équipe</option>
        <option v-for="emp in cmEquipe" :key="emp.id" :value="emp.id">{{ emp.nom }} {{ emp.prenom }}</option>
      </select>
      <select v-model="filters.customStatus" class="form-input" style="width:auto; min-width:130px;">
        <option value="">Tous Statuts</option>
        <option value="en_cours">En cours</option>
        <option value="termine">Terminé</option>
        <option value="en_retard">En retard</option>
      </select>
    </div>

    <!-- Table -->
    <div class="card" style="padding:0; overflow:hidden;">
      <table class="data-table">
        <thead>
          <tr>
            <th>Page Concernée</th>
            <th>Type</th>
            <th>Sujet / Démarche</th>
            <th>Assigné à</th>
            <th>Dates / Échéance</th>
            <th>Statut</th>
            <th style="text-align:right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in filteredTasks" :key="t.id">
            <td style="font-weight:600;">{{ t.edition?.licence?.sigle }} - {{ t.edition?.ville?.nom_ville }}</td>
            <td>
              <span class="badge" :class="t.type_pub ? 'badge-primary' : (t.type_demarche ? 'badge-neutral' : (t.budget || t.titre.includes('Sponsorisation') ? 'badge-warning' : 'badge-info'))">
                <template v-if="t.type_demarche">Démarche Administrative</template>
                <template v-else-if="t.outil_mailing">Mailing (Newsletter)</template>
                <template v-else-if="t.budget || t.titre.includes('Sponsorisation')">Sponsorisation (Ads)</template>
                <template v-else>Publication</template>
              </span>
            </td>
            <td>
              <div style="font-weight:600; font-size:0.875rem;">
                {{ t.titre }}
              </div>
              <div style="color:var(--text-secondary); font-size:0.75rem; margin-top:2px; max-width:250px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                {{ t.description }}
              </div>
            </td>
            <td style="font-weight:500;">{{ t.employe?.prenom }} {{ t.employe?.nom[0] }}.</td>
            <td style="font-size:0.8125rem;">
              <div v-if="t.type_demarche">
                Dem : {{ t.date_demande ? new Date(t.date_demande).toLocaleDateString() : '—' }}<br/>
                Rés : <strong :style="{color: t.date_resultat && new Date(t.date_resultat) < new Date() && t.statutTache?.nom !== 'Terminé' && t.statutTache?.libelle !== 'Terminé' && t.statutTache?.nom !== 'Publié' && t.statutTache?.libelle !== 'Publié' ? 'var(--danger-color)' : 'inherit'}">
                  {{ t.date_resultat ? new Date(t.date_resultat).toLocaleDateString() : 'En attente' }}
                </strong>
                <span v-if="t.date_resultat && new Date(t.date_resultat) < new Date() && t.statutTache?.nom !== 'Terminé' && t.statutTache?.libelle !== 'Terminé' && t.statutTache?.nom !== 'Publié' && t.statutTache?.libelle !== 'Publié'" style="font-size:0.75rem; display:block; margin-top:2px; color:var(--danger-color);">
                  Retard: {{ calculateLateness(t.date_resultat) }}
                </span>
              </div>
              <div v-else>
                Envoi : <strong :style="{color: new Date(t.date_limite) < new Date() && t.statutTache?.nom !== 'Publié' && t.statutTache?.libelle !== 'Publié' && t.statutTache?.nom !== 'Terminé' && t.statutTache?.libelle !== 'Terminé' ? 'var(--danger-color)' : 'inherit'}">
                  {{ new Date(t.date_limite).toLocaleString([], {dateStyle:'short', timeStyle:'short'}) }}
                </strong>
                <span v-if="new Date(t.date_limite) < new Date() && t.statutTache?.nom !== 'Publié' && t.statutTache?.libelle !== 'Publié' && t.statutTache?.nom !== 'Terminé' && t.statutTache?.libelle !== 'Terminé'" style="font-size:0.75rem; display:block; margin-top:2px; color:var(--danger-color);">
                  Retard: {{ calculateLateness(t.date_limite) }}
                </span>
              </div>
            </td>
            <td>
              <span class="badge" :style="{background: t.statutTache?.couleur + '20', color: t.statutTache?.couleur, border: '1px solid ' + t.statutTache?.couleur}">{{ t.statutTache?.nom }}</span>
            </td>
            <td style="text-align:right;">
              <div class="actions-cell">
                <button class="btn btn-secondary btn-icon" @click="viewDetail(t)" title="Voir détails"><EyeIcon :size="14" /></button>
                <button class="btn btn-secondary btn-icon" @click="openEdit(t)" title="Modifier"><EditIcon :size="14" /></button>
                <button class="btn-danger-ghost" @click="remove(t.id)" title="Supprimer"><TrashIcon :size="14" /></button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredTasks.length === 0">
            <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-secondary);">Aucune tâche trouvée.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal CRUD (Version 1 Parfaite de l'utilisateur) -->
    <Modal :isOpen="modal" :title="editing ? 'Modifier la Tâche' : 'Nouvelle Tâche'" @close="modal=false">
      <form @submit.prevent="save" style="display:flex; flex-direction:column; gap:1rem;">
        
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
            <label class="form-label">Assigner à</label>
            <select v-model="form.employeId" required class="form-input">
              <option value="" disabled>Choisir</option>
              <option v-for="emp in cmEquipe" :key="emp.id" :value="emp.id">{{ emp.nom }} {{ emp.prenom }}</option>
            </select>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
          <div class="form-group">
            <label class="form-label">Page concernée</label>
            <select v-model="form.editionId" required class="form-input">
              <option value="" disabled>Choisir la page</option>
              <option v-for="ed in editions" :key="ed.id" :value="ed.id">{{ ed.licence?.sigle }} - {{ ed.ville?.nom_ville }}</option>
            </select>
          </div>
          <div class="form-group" v-if="editing">
            <label class="form-label">Statut</label>
            <select v-model="form.statutTacheId" required class="form-input">
              <option v-for="st in statuts" :key="st.id" :value="st.id">{{ st.nom }}</option>
            </select>
          </div>
        </div>

        <!-- Section spécifique : Publication -->
        <div v-if="form.typeTache === 'Publication'" style="padding-top:0.5rem; border-top:1px solid var(--border-light);">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
            <div class="form-group">
              <label class="form-label">Plateformes</label>
              <div style="display:flex; gap:1rem; align-items:center; height:38px;">
                <label style="display:flex; align-items:center; gap:0.25rem; font-size:0.875rem;">
                  <input type="checkbox" v-model="form.plateformes" value="Facebook" /> Facebook
                </label>
                <label style="display:flex; align-items:center; gap:0.25rem; font-size:0.875rem;">
                  <input type="checkbox" v-model="form.plateformes" value="Instagram" /> Instagram
                </label>
                <label style="display:flex; align-items:center; gap:0.25rem; font-size:0.875rem;">
                  <input type="checkbox" v-model="form.plateformes" value="TikTok" /> TikTok
                </label>
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
              <div style="display:flex; gap:1rem; align-items:center; height: 38px;">
                <label style="display:flex; align-items:center; gap:0.25rem;">
                  <input type="radio" v-model="form.action_publication" value="Programmer" /> Programmer
                </label>
                <label style="display:flex; align-items:center; gap:0.25rem;">
                  <input type="radio" v-model="form.action_publication" value="Publier" /> Publier
                </label>
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

        <!-- Section spécifique : Démarche Administrative -->
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
            <div class="form-group">
              <label class="form-label">Date limite de Demande</label>
              <input type="date" v-model="form.date_demande" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Date limite de Résultat attendu</label>
              <input type="date" v-model="form.date_limite" class="form-input" required />
            </div>
          </div>
        </div>

        <!-- Section spécifique : Mailing -->
        <div v-if="form.typeTache === 'Mailing (Newsletter)'" style="padding-top:0.5rem; border-top:1px solid var(--border-light);">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label class="form-label">Outil de Mailing</label>
              <select v-model="form.outil_mailing" class="form-input">
                <option>Brevo (Sendinblue)</option><option>Mailchimp</option><option>Klaviyo</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Date et Heure d'envoi</label>
              <input type="datetime-local" v-model="form.date_limite" class="form-input" required />
            </div>
          </div>
        </div>

        <!-- Section spécifique : Sponsorisation -->
        <div v-if="form.typeTache === 'Sponsorisation (Ads)'" style="padding-top:0.5rem; border-top:1px solid var(--border-light);">
          <!-- Support array de sponsorisations si nouvelle tâche, sinon juste 1 budget/thème pour édition -->
          <div v-if="!editing" style="margin-bottom:1rem;">
            <div v-for="(sp, idx) in form.sponsorisations" :key="idx" style="display:grid; grid-template-columns:1fr 100px 30px; gap:0.5rem; margin-bottom:0.5rem; align-items:end;">
              <div class="form-group">
                <label class="form-label" v-if="idx===0">Thème du post à sponsoriser</label>
                <select v-model="sp.themeId" class="form-input" required>
                  <option value="" disabled>Choisir un thème</option>
                  <option v-for="th in themes" :key="th.id" :value="th.id">{{ th.nom_theme }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" v-if="idx===0">Budget (€)</label>
                <input type="number" v-model="sp.budget" class="form-input" placeholder="€" required />
              </div>
              <button type="button" class="btn-danger-ghost" style="height:38px; padding:0; width:30px; display:flex; justify-content:center; align-items:center;" @click="form.sponsorisations.splice(idx,1)" v-if="form.sponsorisations.length>1">
                <TrashIcon :size="16" />
              </button>
            </div>
            <button type="button" class="btn btn-secondary btn-sm" @click="form.sponsorisations.push({themeId:'', budget:''})" style="width:100%; justify-content:center;">
              <PlusIcon :size="14" /> Ajouter un autre thème à sponsoriser
            </button>
          </div>
          <div v-else style="margin-bottom:1rem; display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label class="form-label">Thème du post à sponsoriser</label>
              <select v-model="form.themeSponsoId" class="form-input" required>
                <option value="" disabled>Choisir un thème</option>
                <option v-for="th in themes" :key="th.id" :value="th.id">{{ th.nom_theme }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Budget (€)</label>
              <input type="number" v-model="form.budget" class="form-input" required />
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label class="form-label">Date et Heure de sponsorisation</label>
              <input type="datetime-local" v-model="form.date_limite" class="form-input" required />
            </div>
            <div class="form-group">
              <label class="form-label">Ciblage / Audience</label>
              <input type="text" v-model="form.audience" class="form-input" placeholder="Ex: 18-35 ans, fans de Manga..." />
            </div>
          </div>
        </div>

        <!-- Champs Communs -->
        <div class="form-group" style="margin-top:0.5rem;">
          <label class="form-label">Description spécifique / Détails de la tâche</label>
          <textarea v-model="form.description" class="form-input" rows="3" placeholder="Détaillez le contenu du post ou les documents nécessaires pour la démarche..."></textarea>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:0.5rem;">
          <button type="button" class="btn btn-secondary" @click="modal=false">Annuler</button>
          <button type="submit" class="btn btn-primary">{{ editing ? 'Enregistrer' : 'Créer' }}</button>
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
    <TacheDetailModal :isOpen="detailModal" :tache="detailTache" @close="detailModal=false" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus as PlusIcon, Search as SearchIcon, Edit as EditIcon, Trash2 as TrashIcon, Eye as EyeIcon } from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })

// --- DONNÉES DYNAMIQUES DEPUIS L'API ---
const { data: taches, refresh: refreshTaches } = await useFetch('/api/taches', { query: { typeTache: 'PUBLICATION,SPONSORISATION,MAILING,ADMINISTRATIVE' } })
const { data: editions } = await useFetch('/api/editions')
const { data: employes } = await useFetch('/api/equipe')
const { data: statuts } = await useFetch('/api/taches/statuts')
const { data: themes } = await useFetch('/api/themes')

// Filtre l'équipe
const cmEquipe = computed(() => {
  if (!employes.value) return []
  return employes.value.filter(e => e.poste?.departement?.nom_departement === 'Communication' || e.poste?.titre_poste?.includes('Community Manager'))
})

const modal = ref(false)
const editing = ref(false)
const detailModal = ref(false)
const detailTache = ref(null)
const viewDetail = (t) => { detailTache.value = t; detailModal.value = true }

// --- CONFIRMATION DYNAMICS ---
const confirmModal = ref({ isOpen: false, title: '', message: '', onConfirm: null })
const requireConfirm = (title, message, onConfirm) => {
  confirmModal.value = { isOpen: true, title, message, onConfirm }
}
const onConfirmExecute = async () => {
  if (confirmModal.value.onConfirm) await confirmModal.value.onConfirm()
  confirmModal.value.isOpen = false
}

const filters = ref({ search:'', typeTache:'', editionId:'', employeId:'', customStatus:'' })

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
  const defaultStatut = statuts.value?.find(s => s.niveau_progression === 0)?.id || ''
  
  return { 
    id:null, typeTache:'Publication', employeId:'', editionId:'', statutTacheId: defaultStatut, 
    date_limite: getIsoTime(new Date()), date_demande: '',
    plateformes: ['Facebook'], type_pub:'Poste', themePubId: '', themeSponsoId: '', action_publication: 'Programmer',
    sponsorisations: [{ themeId: '', budget: '' }],
    type_demarche:'', budget: null, audience:'', description:'', outil_mailing: 'Brevo (Sendinblue)'
  }
}
const form = ref(defaultForm())

const filteredTasks = computed(() => {
  if (!taches.value) return []
  return taches.value.filter(t => {
    // Determine the virtual "Type" to allow filtering
    let vType = 'Publication'
    if (t.type_demarche) vType = 'Démarche Administrative'
    if (t.outil_mailing) vType = 'Mailing (Newsletter)'
    if (t.budget || t.titre.includes('Sponsorisation')) vType = 'Sponsorisation (Ads)'

    if (filters.value.typeTache && vType !== filters.value.typeTache) return false
    if (filters.value.search && !t.titre.toLowerCase().includes(filters.value.search.toLowerCase()) && !t.description?.toLowerCase().includes(filters.value.search.toLowerCase())) return false
    if (filters.value.editionId && t.editionId !== filters.value.editionId) return false
    if (filters.value.employeId && t.employeId !== filters.value.employeId) return false
    
    const isTermine = t.statutTache?.nom === 'Terminé' || t.statutTache?.libelle === 'Terminé' || t.statutTache?.nom === 'Publié' || t.statutTache?.libelle === 'Publié';
    let dateObj = t.date_limite;
    if (t.type_demarche && t.date_resultat) dateObj = t.date_resultat;
    const isRetard = !isTermine && new Date(dateObj) < new Date();
    
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

const openCreate = () => { editing.value=false; form.value=defaultForm(); modal.value=true }
const openEdit = (t) => { 
  editing.value=true; 
  
  let helper = 'Publication'
  if (t.type_demarche) helper = 'Démarche Administrative'
  else if (t.outil_mailing) helper = 'Mailing (Newsletter)'
  else if (t.budget || t.titre.includes('Sponsorisation')) helper = 'Sponsorisation (Ads)'
  
  form.value={
    ...t, 
    typeTache: helper,
    date_limite: getIsoTime(t.date_limite),
    date_demande: t.date_demande ? new Date(t.date_demande).toISOString().split('T')[0] : '',
    plateformes: t.plateforme ? t.plateforme.split(', ') : [],
    action_publication: 'Programmer'
  }
  modal.value=true 
}

const save = async () => {
  if (editing.value || form.value.typeTache !== 'Sponsorisation (Ads)') {
    // Single task save
    const body = { ...form.value }
    
    // Auto-generate title
    let genTitre = form.value.typeTache
    if (form.value.typeTache === 'Publication') genTitre = `${form.value.plateforme} - ${form.value.type_pub}`
    if (form.value.typeTache === 'Démarche Administrative') genTitre = form.value.type_demarche || 'Démarche'
    if (form.value.typeTache === 'Sponsorisation (Ads)') genTitre = `Sponsorisation (${form.value.budget || 0}€)`
    
    // Nettoyer selon le typeTache
    if (body.typeTache === 'Publication') {
      body.type_demarche = null; body.budget = null; body.audience = null; body.outil_mailing = null; body.date_demande = null; body.themeSponsoId = null;
    } else if (body.typeTache === 'Démarche Administrative') {
      body.plateforme = null; body.type_pub = null; body.themePubId = null; body.budget = null; body.audience = null; body.outil_mailing = null; body.themeSponsoId = null;
      if (body.date_demande) body.date_demande = new Date(body.date_demande).toISOString()
      body.date_resultat = new Date(body.date_limite).toISOString() 
    } else if (body.typeTache === 'Mailing (Newsletter)') {
      body.plateforme = null; body.type_pub = null; body.themePubId = null; body.type_demarche = null; body.budget = null; body.audience = null; body.date_demande = null; body.themeSponsoId = null;
    }

    body.date_limite = new Date(body.date_limite).toISOString()

    if (!editing.value && body.typeTache === 'Publication') {
      // Create multiple tasks if multiple platforms are checked
      for (const p of form.value.plateformes) {
        const platformBody = { ...body, plateforme: p, titre: `${p} - ${form.value.type_pub}` }
        await $fetch('/api/taches', { method: 'POST', body: platformBody })
      }
    } else {
      // Single task update or creation (for other types)
      if (body.typeTache === 'Publication') {
        body.plateforme = form.value.plateformes.join(', ')
        body.titre = `${body.plateforme} - ${body.type_pub}`
      }
      body.titre = genTitre;
      if (body.typeTache === 'Publication') body.titre = `${body.plateforme} - ${body.type_pub}`;
      
      await $fetch('/api/taches', { method: 'POST', body })
    }
  } else {
    // Multiple tasks for Sponsorisations (Ads)
    for (const sp of form.value.sponsorisations) {
      if (!sp.themeId || !sp.budget) continue;
      const body = {
        ...form.value,
        titre: `Sponsorisation (${sp.budget}€)`,
        themeSponsoId: sp.themeId,
        budget: sp.budget,
        date_limite: new Date(form.value.date_limite).toISOString(),
        plateforme: null, type_pub: null, themePubId: null, type_demarche: null, outil_mailing: null, date_demande: null
      }
      await $fetch('/api/taches', { method: 'POST', body })
    }
  }

  await refreshTaches()
  modal.value=false
}

const remove = (id) => { 
  requireConfirm('Supprimer cette tâche ?', 'Êtes-vous sûr de vouloir supprimer cette tâche ?', async () => {
    await $fetch(`/api/taches/${id}`, { method: 'DELETE' })
    await refreshTaches()
  })
}
</script>
