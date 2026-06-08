<template>
  <div class="auth-page admin-login-page">
    <div class="bg-mesh"></div>
    <div class="auth-card animate-fade-in">
      <div class="auth-logo">
        <div class="logo-icon admin-icon">
          <ShieldIcon :size="22" />
        </div>
        <h1 class="auth-title">Espace Administrateur</h1>
        <p class="auth-subtitle">OpsFlow &mdash; Accès réservé au personnel autorisé</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label class="form-label">Identifiant Admin</label>
          <input v-model="form.email" type="text" class="form-input" placeholder="identifiant" required autocomplete="username" />
        </div>
        <div class="form-group">
          <label class="form-label">Mot de passe</label>
          <div style="position:relative;">
            <input v-model="form.password" :type="showPwd ? 'text' : 'password'" class="form-input" placeholder="••••••••" required style="padding-right:2.5rem;" />
            <button type="button" @click="showPwd = !showPwd" class="pwd-toggle" tabindex="-1">
              <EyeIcon v-if="!showPwd" :size="16" />
              <EyeOffIcon v-else :size="16" />
            </button>
          </div>
        </div>

        <div v-if="error" class="auth-error">
          <AlertCircleIcon :size="14" /> {{ error }}
        </div>

        <button type="submit" class="btn auth-btn" :disabled="loading">
          <span v-if="loading">Vérification...</span>
          <span v-else>Accéder au panneau Admin</span>
        </button>

        <p class="auth-link">
          <NuxtLink to="/login">← Espace Employé</NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Eye as EyeIcon, EyeOff as EyeOffIcon, AlertCircle as AlertCircleIcon, Shield as ShieldIcon } from 'lucide-vue-next'

definePageMeta({ layout: false, middleware: [] })

const { login } = useAuth()
const router = useRouter()

const form = ref({ email: '', password: '' })
const error = ref('')
const loading = ref(false)
const showPwd = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    const user = await login(form.value.email, form.value.password, true)
    router.push('/admin')
  } catch (err) {
    error.value = err.data?.message || err.statusMessage || 'Accès refusé'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.admin-login-page {
  font-family: 'Inter', sans-serif;
}

.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #000000;
  background-image: radial-gradient(circle at 50% 0%, #1a1a1a 0%, #000000 60%);
  padding: 1rem;
  overflow: hidden;
}

.auth-card {
  position: relative;
  z-index: 10;
  background: #0a0a0a;
  border: 1px solid #333333;
  border-radius: 12px;
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.8);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.auth-logo { text-align: center; margin-bottom: 2.5rem; }

.logo-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  background: #ffffff;
  color: #000000;
  box-shadow: 0 0 20px rgba(255,255,255,0.1);
}

.auth-title {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
  color: #ffffff;
}

.auth-subtitle {
  color: #888888;
  font-size: 0.875rem;
  font-weight: 400;
}

.auth-form { display: flex; flex-direction: column; gap: 1.25rem; }

.form-group { display: flex; flex-direction: column; gap: 0.5rem; }

.form-label {
  color: #a0a0a0;
  font-size: 0.8125rem;
  font-weight: 500;
}

.form-input {
  display: block;
  width: 100%;
  background: #000000;
  border: 1px solid #333333;
  color: #ffffff;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.875rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

/* Fix browser autofill styling in dark mode */
.form-input:-webkit-autofill,
.form-input:-webkit-autofill:hover, 
.form-input:-webkit-autofill:focus, 
.form-input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px #000000 inset !important;
  -webkit-text-fill-color: white !important;
  transition: background-color 5000s ease-in-out 0s;
  border-color: #333333;
}

.form-input::placeholder { color: #555555; }

.form-input:focus {
  outline: none;
  border-color: #ffffff;
  box-shadow: 0 0 0 1px #ffffff;
}

.pwd-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666666;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.2s ease;
}

.pwd-toggle:hover { color: #ffffff; }

.auth-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.2);
  color: #fca5a5;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.8125rem;
}

.auth-btn {
  width: 100%;
  justify-content: center;
  padding: 0.75rem;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  background: #ffffff;
  color: #000000;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.auth-btn:hover:not(:disabled) {
  background: #e0e0e0;
}

.auth-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.auth-btn:disabled {
  background: #333333;
  color: #888888;
  cursor: not-allowed;
}

.auth-link {
  text-align: center;
  font-size: 0.8125rem;
  margin-top: 1rem;
}

.auth-link a {
  color: #888888;
  text-decoration: none;
  transition: color 0.2s ease;
}

.auth-link a:hover { color: #ffffff; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
