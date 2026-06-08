<template>
  <div class="animate-fade-in" v-if="myEmployeInfo">
    <div class="page-header">
      <div>
        <h1 class="page-title">Mon Profil</h1>
        <p class="page-subtitle" style="margin-bottom:0;">Informations de votre compte (lecture seule).</p>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:1fr 2fr; gap:1.5rem;">
      <!-- Carte Avatar -->
      <div class="card" style="text-align:center; display:flex; flex-direction:column; align-items:center; gap:1rem; padding:2rem;">
        <div style="width:80px; height:80px; border-radius:50%; background:var(--accent-blue); display:flex; align-items:center; justify-content:center; color:white; font-size:1.75rem; font-weight:700;">
          {{ initials }}
        </div>
        <div>
          <h2 style="font-size:1.125rem;">{{ myEmployeInfo.prenom }} {{ myEmployeInfo.nom }}</h2>
          <p style="color:var(--text-secondary); font-size:0.8125rem;">{{ myEmployeInfo.poste?.titre_poste }}</p>
        </div>
        <span class="badge badge-info">{{ myEmployeInfo.role?.niveau_acces }}</span>
      </div>

      <!-- Détails -->
      <div class="card">
        <h3 style="font-size:0.9375rem; font-weight:600; margin-bottom:1.25rem;">Informations du Compte</h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem;">
          <div>
            <div class="form-label" style="margin-bottom:0.25rem;">Nom</div>
            <div style="font-weight:500;">{{ myEmployeInfo.nom }}</div>
          </div>
          <div>
            <div class="form-label" style="margin-bottom:0.25rem;">Prénom</div>
            <div style="font-weight:500;">{{ myEmployeInfo.prenom }}</div>
          </div>
          <div>
            <div class="form-label" style="margin-bottom:0.25rem;">Email</div>
            <div style="font-weight:500;">{{ myEmployeInfo.email }}</div>
          </div>
          <div>
            <div class="form-label" style="margin-bottom:0.25rem;">Poste</div>
            <div style="font-weight:500;">{{ myEmployeInfo.poste?.titre_poste }}</div>
          </div>
          <div>
            <div class="form-label" style="margin-bottom:0.25rem;">Département</div>
            <div style="font-weight:500;">{{ myEmployeInfo.poste?.departement?.nom_departement || 'Non assigné' }}</div>
          </div>
          <div>
            <div class="form-label" style="margin-bottom:0.25rem;">Date d'ajout</div>
            <div style="font-weight:500;">Rejoint en 2026</div>
          </div>
        </div>

        <div style="border-top:1px solid var(--border-light); margin-top:1.5rem; padding-top:1.25rem;">
          <h3 style="font-size:0.9375rem; font-weight:600; margin-bottom:1rem;">Pages Assignées</h3>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <div v-for="ed in myEmployeInfo.editionsGerees" :key="ed.id" style="border:1px solid var(--border-light); border-radius:6px; padding:0.5rem 0.75rem;">
              <div style="font-weight:600; font-size:0.8125rem;">{{ ed.licence?.sigle }} - {{ ed.ville?.nom_ville }}</div>
              <div style="font-size:0.6875rem; color:var(--text-secondary);">Manager</div>
            </div>
            <div v-if="!myEmployeInfo.editionsGerees || myEmployeInfo.editionsGerees.length === 0" style="font-size:0.8125rem; color:var(--text-secondary); width: 100%;">
              Aucune page assignée pour le moment.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCookie, useFetch } from '#imports'

definePageMeta({ layout: 'employe' })

const { user } = useAuth()
const myEmployeInfo = computed(() => user.value)

const initials = computed(() => {
  if (myEmployeInfo.value) {
    return `${myEmployeInfo.value.prenom.charAt(0)}${myEmployeInfo.value.nom.charAt(0)}`.toUpperCase()
  }
  return 'EM'
})
</script>
