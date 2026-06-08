<template>
  <div class="auth-page">
    <div class="auth-card animate-fade-in">
      <!-- Logo -->
      <div class="auth-logo">
        <div class="logo-icon">OF</div>
        <h1 class="auth-title">OpsFlow</h1>
        <p class="auth-subtitle">Connexion à votre espace</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input v-model="form.email" type="text" class="form-input" placeholder="votre@email.com" required autocomplete="email" />
        </div>
        <div class="form-group">
          <label class="form-label">Mot de passe</label>
          <div style="position:relative;">
            <input v-model="form.password" :type="showPwd ? 'text' : 'password'" class="form-input" placeholder="••••••••" required autocomplete="current-password" style="padding-right:2.5rem;" />
            <button type="button" @click="showPwd = !showPwd" class="pwd-toggle" tabindex="-1">
              <EyeIcon v-if="!showPwd" :size="16" />
              <EyeOffIcon v-else :size="16" />
            </button>
          </div>
        </div>

        <div v-if="error" class="auth-error">
          <AlertCircleIcon :size="14" /> {{ error }}
        </div>

        <button type="submit" class="btn btn-primary auth-btn" :disabled="loading">
          <span v-if="loading">Connexion en cours...</span>
          <span v-else>Se connecter</span>
        </button>

        <p class="auth-link">
          Pas encore de compte ? <NuxtLink to="/register">Créer un compte</NuxtLink>
        </p>
      </form>
    </div>

    <!-- Admin Simulation Modal -->
    <Modal :isOpen="showAdminModal" @close="showAdminModal = false" title="Mode Administrateur">
      <div style="margin-bottom: 1.5rem; color: var(--text-secondary); font-size: 0.875rem; line-height: 1.5;">
        Vous vous connectez en tant qu'administrateur. Que souhaitez-vous faire ?
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <button type="button" @click="proceedAsAdmin" class="btn btn-primary" style="justify-content: center; padding: 0.75rem;">
          <ShieldIcon :size="18" /> Accéder à l'espace Admin
        </button>
        
        <div style="text-align: center; position: relative; margin-top: 0.5rem; margin-bottom: 0.25rem;">
          <hr style="border-top: 1px solid var(--border-light); border-bottom: none; border-left: none; border-right: none;" />
          <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--bg-surface); padding: 0 0.5rem; font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">OU</span>
        </div>
        
        <div class="form-group">
          <label class="form-label" style="margin-bottom: 0.25rem;">Simuler un espace employé</label>
          <select v-model="selectedPosteToSimulate" class="form-input">
            <option value="">Sélectionner un poste...</option>
            <option v-for="p in postes" :key="p.id" :value="p.id">{{ p.titre_poste }} ({{ p.departement?.nom }})</option>
          </select>
        </div>
        
        <button type="button" @click="proceedAsSimulated" class="btn btn-secondary" style="justify-content: center; padding: 0.75rem;" :disabled="!selectedPosteToSimulate || isSimulating">
          <UserIcon :size="18" /> {{ isSimulating ? 'Configuration...' : 'Simuler cet employé' }}
        </button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Eye as EyeIcon, EyeOff as EyeOffIcon, AlertCircle as AlertCircleIcon, Shield as ShieldIcon, User as UserIcon } from 'lucide-vue-next'

definePageMeta({ layout: false })

const { login } = useAuth()
const router = useRouter()

const form = ref({ email: '', password: '' })
const error = ref('')
const loading = ref(false)
const showPwd = ref(false)

// Simulation variables
const showAdminModal = ref(false)
const postes = ref([])
const selectedPosteToSimulate = ref('')
const isSimulating = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    const user = await login(form.value.email, form.value.password, false)
    if (user?.role?.niveau_acces === 'ADMIN') {
      try {
        const res = await $fetch('/api/postes')
        postes.value = res || []
      } catch (e) {
        console.error("Erreur chargement postes", e)
      }
      showAdminModal.value = true
    } else {
      router.push('/employe')
    }
  } catch (err) {
    error.value = err.data?.message || err.statusMessage || 'Erreur de connexion'
  } finally {
    loading.value = false
  }
}

const proceedAsAdmin = () => {
  router.push('/admin')
}

const proceedAsSimulated = async () => {
  if (!selectedPosteToSimulate.value) return
  isSimulating.value = true
  try {
    await $fetch('/api/auth/simulate', {
      method: 'POST',
      body: { posteId: selectedPosteToSimulate.value }
    })
    isSimulating.value = false
    showAdminModal.value = false
    // Force a full reload to make sure the app fetches the new simulated role state
    window.location.href = '/employe'
  } catch (err) {
    error.value = err.data?.message || err.statusMessage || 'Erreur de simulation'
    isSimulating.value = false
    showAdminModal.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-app);
  padding: 1rem;
}

.auth-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 2.5rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
}

.auth-logo {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-icon {
  width: 52px;
  height: 52px;
  background: var(--accent-primary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.125rem;
  margin: 0 auto 1rem;
}

.auth-title {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 0.25rem;
}

.auth-subtitle {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pwd-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  padding: 0;
}

.auth-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.3);
  color: #ef4444;
  padding: 0.625rem 0.875rem;
  border-radius: 8px;
  font-size: 0.875rem;
}

.auth-btn {
  width: 100%;
  justify-content: center;
  padding: 0.75rem;
  font-size: 0.9375rem;
  margin-top: 0.5rem;
}

.auth-link {
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.auth-link a {
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 500;
}

.auth-link a:hover {
  text-decoration: underline;
}
</style>
