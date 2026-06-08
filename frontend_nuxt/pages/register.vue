<template>
  <div class="auth-page">
    <div class="auth-card animate-fade-in">
      <div class="auth-logo">
        <div class="logo-icon">OF</div>
        <h1 class="auth-title">Créer un compte</h1>
        <p class="auth-subtitle">Rejoignez l'équipe OpsFlow</p>
      </div>

      <!-- Étape 1 : Formulaire -->
      <form v-if="!success" @submit.prevent="handleRegister" class="auth-form">
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
          <div class="form-group">
            <label class="form-label">Nom</label>
            <input v-model="form.nom" type="text" class="form-input" placeholder="Dupont" required />
          </div>
          <div class="form-group">
            <label class="form-label">Prénom</label>
            <input v-model="form.prenom" type="text" class="form-input" placeholder="Marie" required />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Email professionnel</label>
          <input v-model="form.email" type="email" class="form-input" placeholder="marie.dupont@example.com" required autocomplete="email" />
        </div>
        <div class="form-group">
          <label class="form-label">Mot de passe</label>
          <div style="position:relative;">
            <input v-model="form.mot_de_passe" :type="showPwd ? 'text' : 'password'" class="form-input" placeholder="Minimum 8 caractères" required minlength="8" style="padding-right:2.5rem;" />
            <button type="button" @click="showPwd = !showPwd" class="pwd-toggle" tabindex="-1">
              <EyeIcon v-if="!showPwd" :size="16" />
              <EyeOffIcon v-else :size="16" />
            </button>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Confirmer le mot de passe</label>
          <input v-model="form.confirm" :type="showPwd ? 'text' : 'password'" class="form-input" placeholder="Répétez votre mot de passe" required style="padding-right:2.5rem;" />
        </div>

        <div v-if="error" class="auth-error">
          <AlertCircleIcon :size="14" /> {{ error }}
        </div>

        <button type="submit" class="btn btn-primary auth-btn" :disabled="loading">
          <span v-if="loading">Création en cours...</span>
          <span v-else>Créer mon compte</span>
        </button>

        <p class="auth-link">
          Déjà un compte ? <NuxtLink to="/login">Se connecter</NuxtLink>
        </p>
      </form>

      <!-- Étape 2 : Succès -->
      <div v-else class="success-state">
        <div class="success-icon">✓</div>
        <h2 style="font-size:1.125rem; font-weight:600; margin-bottom:0.5rem;">Inscription envoyée !</h2>
        <p style="color:var(--text-secondary); font-size:0.875rem; line-height:1.6; text-align:center;">
          Votre compte est en attente de validation par un administrateur.<br />
          Vous recevrez accès une fois votre profil approuvé.
        </p>
        <NuxtLink to="/login" class="btn btn-secondary" style="margin-top:1.5rem; text-decoration:none; justify-content:center;">
          Retour à la connexion
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Eye as EyeIcon, EyeOff as EyeOffIcon, AlertCircle as AlertCircleIcon } from 'lucide-vue-next'

definePageMeta({ layout: false })

const { register } = useAuth()

const form = ref({ nom: '', prenom: '', email: '', mot_de_passe: '', confirm: '' })
const error = ref('')
const loading = ref(false)
const success = ref(false)
const showPwd = ref(false)

const handleRegister = async () => {
  if (form.value.mot_de_passe !== form.value.confirm) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await register({ nom: form.value.nom, prenom: form.value.prenom, email: form.value.email, mot_de_passe: form.value.mot_de_passe })
    success.value = true
  } catch (err) {
    error.value = err.data?.message || err.statusMessage || 'Erreur lors de l\'inscription'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--bg-app); padding:1rem; }
.auth-card { background:var(--bg-card); border:1px solid var(--border-light); border-radius:16px; padding:2.5rem; width:100%; max-width:460px; box-shadow:0 8px 32px rgba(0,0,0,0.08); }
.auth-logo { text-align:center; margin-bottom:1.5rem; }
.logo-icon { width:52px; height:52px; background:var(--accent-primary); border-radius:12px; display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:1.125rem; margin:0 auto 1rem; }
.auth-title { font-size:1.5rem; font-weight:700; letter-spacing:-0.02em; margin-bottom:0.25rem; }
.auth-subtitle { color:var(--text-secondary); font-size:0.875rem; }
.auth-form { display:flex; flex-direction:column; gap:0.875rem; }
.pwd-toggle { position:absolute; right:0.75rem; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--text-muted); display:flex; align-items:center; padding:0; }
.auth-error { display:flex; align-items:center; gap:0.5rem; background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#ef4444; padding:0.625rem 0.875rem; border-radius:8px; font-size:0.875rem; }
.auth-btn { width:100%; justify-content:center; padding:0.75rem; font-size:0.9375rem; margin-top:0.25rem; }
.auth-link { text-align:center; font-size:0.875rem; color:var(--text-secondary); }
.auth-link a { color:var(--accent-primary); text-decoration:none; font-weight:500; }
.success-state { display:flex; flex-direction:column; align-items:center; padding:1rem 0; }
.success-icon { width:64px; height:64px; background:rgba(34,197,94,0.1); border:2px solid rgba(34,197,94,0.3); color:#22c55e; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.5rem; font-weight:700; margin-bottom:1.25rem; }
</style>
