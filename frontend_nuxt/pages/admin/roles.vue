<template>
  <div>
    <!-- Header -->
    <div class="page-header" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem;">
      <div>
        <h1 style="font-size:1.5rem; font-weight:700; margin-bottom:0.25rem;">Gestion des Comptes & Rôles</h1>
        <p style="color:var(--text-secondary); font-size:0.875rem;">Validez les inscriptions, gérez les rôles et les mots de passe.</p>
      </div>
    </div>

    <!-- Alertes inscriptions en attente -->
    <div v-if="pending?.length" class="pending-banner">
      <BellIcon :size="18" style="flex-shrink:0;" />
      <span><strong>{{ pending.length }} inscription{{ pending.length > 1 ? 's' : '' }} en attente</strong> de validation.</span>
    </div>

    <!-- Onglets -->
    <div class="tabs" style="margin-bottom:1.5rem;">
      <button :class="['tab', tab === 'pending' ? 'tab-active' : '']" @click="tab = 'pending'">
        En attente <span v-if="pending?.length" class="badge-count">{{ pending.length }}</span>
      </button>
      <button :class="['tab', tab === 'all' ? 'tab-active' : '']" @click="tab = 'all'">Tous les comptes</button>
    </div>

    <!-- Tab: En attente -->
    <div v-if="tab === 'pending'">
      <div v-if="!pending?.length" class="empty-state">
        <CheckCircleIcon :size="40" style="color:var(--text-muted); margin-bottom:1rem;" />
        <p>Aucune inscription en attente. Tout est à jour !</p>
      </div>
      <div v-else class="card-list">
        <div v-for="emp in pending" :key="emp.id" class="account-card">
          <div class="account-avatar">{{ emp.nom[0] }}{{ emp.prenom[0] }}</div>
          <div class="account-info">
            <div class="account-name">{{ emp.nom }} {{ emp.prenom }}</div>
            <div class="account-email">{{ emp.email }}</div>
            <span class="badge-pending">En attente</span>
          </div>
          <div class="account-actions">
            <!-- Choix du poste avant validation -->
            <select v-model="selectedPoste[emp.id]" class="form-input" style="max-width:200px; padding:0.35rem 0.5rem; font-size:0.8rem;">
              <option value="">Choisir le poste...</option>
              <option v-for="p in postes" :key="p.id" :value="p.id">{{ p.titre_poste }}</option>
            </select>
            <button class="btn btn-success btn-sm" @click="validateAccount(emp, true)" :disabled="!selectedPoste[emp.id]">
              <CheckIcon :size="14" /> Valider
            </button>
            <button class="btn btn-danger btn-sm" @click="validateAccount(emp, false)">
              <XIcon :size="14" /> Rejeter
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab: Tous les comptes -->
    <div v-if="tab === 'all'" class="table-wrapper">
      <div style="display:flex; gap:0.75rem; margin-bottom:1rem;">
        <input v-model="searchAll" type="text" class="form-input" placeholder="Rechercher un employé..." style="max-width:300px;" />
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Employé</th>
            <th>Poste</th>
            <th>Rôle</th>
            <th>Statut</th>
            <th style="text-align:right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="emp in filteredAll" :key="emp.id">
            <td>
              <div style="font-weight:600;">{{ emp.nom }} {{ emp.prenom }}</div>
              <div style="font-size:0.75rem; color:var(--text-secondary);">{{ emp.email }}</div>
            </td>
            <td style="color:var(--text-secondary); font-size:0.875rem;">{{ emp.poste?.titre_poste || '—' }}</td>
            <td>
              <select class="form-input" style="padding:0.25rem 0.5rem; font-size:0.75rem;" @change="(e) => changeRole(emp.id, e.target.value)">
                <option v-for="r in roles?.filter(r => r.niveau_acces !== 'EMPLOYE')" :key="r.id" :value="r.id" :selected="emp.roleId === r.id">{{ r.niveau_acces }}</option>
              </select>
            </td>
            <td>
              <span v-if="emp.is_active" style="color:#22c55e; font-size:0.8rem; font-weight:600;">● Actif</span>
              <span v-else style="color:#f59e0b; font-size:0.8rem; font-weight:600;">● En attente</span>
            </td>
            <td style="text-align:right;">
              <div style="display:flex; gap:0.5rem; justify-content:flex-end; align-items:center;">
                <button class="btn btn-secondary btn-sm" @click="openPwdModal(emp)">
                  <KeyIcon :size="13" /> Changer MDP
                </button>
                <button
                  class="btn btn-sm"
                  :style="emp.is_active ? 'background:rgba(239,68,68,0.1); color:#ef4444; border:1px solid rgba(239,68,68,0.3);' : 'background:rgba(34,197,94,0.1); color:#22c55e; border:1px solid rgba(34,197,94,0.3);'"
                  @click="toggleActive(emp)"
                  :title="emp.is_active ? 'Désactiver le compte' : 'Réactiver le compte'"
                >
                  <PowerIcon :size="13" /> {{ emp.is_active ? 'Désactiver' : 'Réactiver' }}
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredAll.length === 0">
            <td colspan="5" style="text-align:center; color:var(--text-muted); padding:2rem;">Aucun compte trouvé.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal : changer mot de passe -->
    <Modal :isOpen="pwdModal.open" title="Changer le mot de passe" @close="pwdModal.open = false">
      <form @submit.prevent="submitPwd" style="display:flex; flex-direction:column; gap:1rem;">
        <p style="color:var(--text-secondary); font-size:0.875rem;">Définir un nouveau mot de passe pour <strong>{{ pwdModal.emp?.nom }} {{ pwdModal.emp?.prenom }}</strong>.</p>
        <div class="form-group">
          <label class="form-label">Nouveau mot de passe</label>
          <input v-model="pwdModal.password" type="password" class="form-input" placeholder="Minimum 6 caractères" required minlength="6" />
        </div>
        <div v-if="pwdModal.error" class="auth-error" style="display:flex; align-items:center; gap:0.5rem; background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#ef4444; padding:0.625rem 0.875rem; border-radius:8px; font-size:0.875rem;">
          {{ pwdModal.error }}
        </div>
        <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
          <button type="button" class="btn btn-secondary" @click="pwdModal.open = false">Annuler</button>
          <button type="submit" class="btn btn-primary">Enregistrer</button>
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Bell as BellIcon, Check as CheckIcon, CheckCircle as CheckCircleIcon, X as XIcon, Key as KeyIcon, Power as PowerIcon } from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })

const { data: pending, refresh: refreshPending } = await useFetch('/api/auth/pending')
const { data: allEmployes, refresh: refreshAll } = await useFetch('/api/equipe')
const { data: postes } = await useFetch('/api/postes')
const { data: roles } = await useFetch('/api/roles')

const tab = ref('pending')
const searchAll = ref('')
const selectedPoste = ref({})
const toast = ref('')

const filteredAll = computed(() => {
  if (!allEmployes.value) return []
  return allEmployes.value.filter(e =>
    !searchAll.value ||
    `${e.nom} ${e.prenom} ${e.email}`.toLowerCase().includes(searchAll.value.toLowerCase())
  )
})

const confirmModal = ref({ isOpen: false, title: '', message: '', onConfirm: null })
const requireConfirm = (title, message, fn) => { confirmModal.value = { isOpen: true, title, message, onConfirm: fn } }
const onConfirmExecute = async () => {
  if (confirmModal.value.onConfirm) await confirmModal.value.onConfirm()
  confirmModal.value.isOpen = false
}

const validateAccount = (emp, accept) => {
  if (accept) {
    requireConfirm('Valider le compte ?', `Activer le compte de ${emp.nom} ${emp.prenom} avec le poste sélectionné ?`, async () => {
      await $fetch('/api/auth/manage', { method: 'POST', body: { employeId: emp.id, action: 'validate', data: { posteId: selectedPoste.value[emp.id] } } })
      await refreshPending()
      await refreshAll()
    })
  } else {
    requireConfirm('Rejeter l\'inscription ?', `Supprimer définitivement le compte de ${emp.nom} ${emp.prenom} ?`, async () => {
      await $fetch('/api/auth/manage', { method: 'POST', body: { employeId: emp.id, action: 'reject' } })
      await refreshPending()
    })
  }
}

const changeRole = async (employeId, roleId) => {
  await $fetch('/api/auth/manage', { method: 'POST', body: { employeId, action: 'set_role', data: { roleId } } })
  await refreshAll()
}

const pwdModal = ref({ open: false, emp: null, password: '', error: '' })
const openPwdModal = (emp) => { pwdModal.value = { open: true, emp, password: '', error: '' } }
const submitPwd = async () => {
  try {
    await $fetch('/api/auth/manage', { method: 'POST', body: { employeId: pwdModal.value.emp.id, action: 'set_password', data: { password: pwdModal.value.password } } })
    pwdModal.value.open = false
  } catch (err) {
    pwdModal.value.error = err.data?.message || 'Erreur'
  }
}

const toggleActive = async (emp) => {
  const action = emp.is_active ? 'désactiver' : 'réactiver'
  requireConfirm(
    `${emp.is_active ? 'Désactiver' : 'Réactiver'} le compte ?`,
    `Voulez-vous ${action} le compte de ${emp.nom} ${emp.prenom} ?`,
    async () => {
      await $fetch('/api/auth/manage', { method: 'POST', body: { employeId: emp.id, action: 'toggle_active' } })
      await refreshAll()
    }
  )
}
</script>

<style scoped>
.pending-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(245,158,11,0.1);
  border: 1px solid rgba(245,158,11,0.3);
  color: #f59e0b;
  padding: 0.875rem 1.25rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.tabs {
  display: flex;
  gap: 0.25rem;
  border-bottom: 1px solid var(--border-light);
}

.tab {
  background: none;
  border: none;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  color: var(--text-secondary);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  font-weight: 500;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-active {
  color: var(--accent-primary);
  border-bottom-color: var(--accent-primary);
}

.badge-count {
  background: var(--accent-primary);
  color: white;
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.account-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 1rem 1.25rem;
}

.account-avatar {
  width: 42px;
  height: 42px;
  background: var(--accent-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
  text-transform: uppercase;
}

.account-info {
  flex: 1;
}

.account-name {
  font-weight: 600;
  font-size: 0.9rem;
}

.account-email {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.badge-pending {
  background: rgba(245,158,11,0.15);
  color: #f59e0b;
  border: 1px solid rgba(245,158,11,0.3);
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
}

.account-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-success {
  background: rgba(34,197,94,0.15);
  color: #22c55e;
  border: 1px solid rgba(34,197,94,0.3);
}

.btn-success:hover:not(:disabled) {
  background: rgba(34,197,94,0.25);
}

.btn-success:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-danger {
  background: rgba(239,68,68,0.1);
  color: #ef4444;
  border: 1px solid rgba(239,68,68,0.3);
}

.btn-danger:hover {
  background: rgba(239,68,68,0.2);
}

.table-wrapper {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  overflow: hidden;
  padding: 1rem;
}
</style>
