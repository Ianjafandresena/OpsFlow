<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
      <div class="detail-modal" @click.stop>
        <!-- Header -->
        <div class="detail-modal-header">
          <div style="display:flex; align-items:center; gap:0.75rem; flex:1; min-width:0;">
            <div class="detail-icon-wrap">
              <EyeIcon :size="16" />
            </div>
            <div style="min-width:0;">
              <div style="font-weight:700; font-size:0.9375rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{ tache?.titre }}</div>
              <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:1px;">
                Détail de la tâche
              </div>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:0.75rem; flex-shrink:0;">
            <span v-if="tache?.statutTache" class="badge" :style="{background: tache.statutTache.couleur + '20', color: tache.statutTache.couleur, border: '1px solid ' + tache.statutTache.couleur}">
              {{ tache.statutTache.nom }}
            </span>
            <button class="modal-close-btn" @click="$emit('close')">
              <XIcon :size="16" />
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="detail-modal-body">

          <!-- SECTION: Assignation & Dates -->
          <div class="detail-section">
            <div class="detail-section-title">Informations générales</div>
            <div class="detail-grid">
              <div class="detail-field" v-if="tache?.employe">
                <div class="detail-label">Assigné à</div>
                <div class="detail-value detail-value-bold">
                  <div class="detail-avatar">{{ tache.employe.prenom?.charAt(0) }}{{ tache.employe.nom?.charAt(0) }}</div>
                  {{ tache.employe.prenom }} {{ tache.employe.nom }}
                </div>
              </div>
              <div class="detail-field" v-if="tache?.edition">
                <div class="detail-label">Page / Événement</div>
                <div class="detail-value">{{ tache.edition.licence?.sigle }} — {{ tache.edition.ville?.nom_ville }}</div>
              </div>
              <div class="detail-field" v-if="tache?.demandeur">
                <div class="detail-label">Demandeur</div>
                <div class="detail-value">{{ tache.demandeur }}</div>
              </div>
              <div class="detail-field" v-if="tache?.date_limite">
                <div class="detail-label">Deadline</div>
                <div class="detail-value" :style="{color: isLate ? 'var(--status-danger)' : 'inherit', fontWeight: isLate ? '600' : '500'}">
                  {{ formatDate(tache.date_limite) }}
                  <span v-if="isLate" style="font-size:0.7rem; margin-left:4px;">⚠ Dépassée</span>
                </div>
              </div>
              <div class="detail-field" v-if="tache?.createdAt">
                <div class="detail-label">Créée le</div>
                <div class="detail-value">{{ formatDate(tache.createdAt) }}</div>
              </div>
            </div>
          </div>

          <!-- SECTION: CM - Publication -->
          <div class="detail-section" v-if="tache?.plateforme || tache?.type_pub">
            <div class="detail-section-title">Publication</div>
            <div class="detail-grid">
              <div class="detail-field" v-if="tache?.plateforme">
                <div class="detail-label">Plateformes</div>
                <div class="detail-value" style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                  <span v-for="pl in parsePlateforme(tache.plateforme)" :key="pl" class="badge badge-primary">{{ pl }}</span>
                </div>
              </div>
              <div class="detail-field" v-if="tache?.type_pub">
                <div class="detail-label">Type de publication</div>
                <div class="detail-value"><span class="badge badge-neutral">{{ tache.type_pub }}</span></div>
              </div>
              <div class="detail-field" v-if="tache?.themePub">
                <div class="detail-label">Thème du post</div>
                <div class="detail-value">{{ tache.themePub?.nom_theme }}</div>
              </div>
            </div>
          </div>

          <!-- SECTION: CM - Démarche Administrative -->
          <div class="detail-section" v-if="tache?.type_demarche">
            <div class="detail-section-title">Démarche Administrative</div>
            <div class="detail-grid">
              <div class="detail-field">
                <div class="detail-label">Type de démarche</div>
                <div class="detail-value">{{ tache.type_demarche }}</div>
              </div>
              <div class="detail-field" v-if="tache?.date_demande">
                <div class="detail-label">Date limite Demande</div>
                <div class="detail-value">{{ formatDateShort(tache.date_demande) }}</div>
              </div>
              <div class="detail-field" v-if="tache?.date_resultat">
                <div class="detail-label">Date limite Résultat</div>
                <div class="detail-value">{{ formatDateShort(tache.date_resultat) }}</div>
              </div>
            </div>
          </div>

          <!-- SECTION: CM - Mailing -->
          <div class="detail-section" v-if="tache?.outil_mailing">
            <div class="detail-section-title">Mailing / Newsletter</div>
            <div class="detail-grid">
              <div class="detail-field">
                <div class="detail-label">Outil</div>
                <div class="detail-value"><span class="badge badge-info">{{ tache.outil_mailing }}</span></div>
              </div>
            </div>
          </div>

          <!-- SECTION: CM - Sponsorisation -->
          <div class="detail-section" v-if="tache?.budget || tache?.audience">
            <div class="detail-section-title">Sponsorisation (Ads)</div>
            <div class="detail-grid">
              <div class="detail-field" v-if="tache?.themeSponso">
                <div class="detail-label">Thème à sponsoriser</div>
                <div class="detail-value">{{ tache.themeSponso?.nom_theme }}</div>
              </div>
              <div class="detail-field" v-if="tache?.budget">
                <div class="detail-label">Budget alloué</div>
                <div class="detail-value" style="font-weight:700; color:var(--accent-primary);">{{ tache.budget }} €</div>
              </div>
              <div class="detail-field" v-if="tache?.audience">
                <div class="detail-label">Ciblage / Audience</div>
                <div class="detail-value">{{ tache.audience }}</div>
              </div>
            </div>
          </div>

          <!-- SECTION: Monteur Vidéo -->
          <div class="detail-section" v-if="tache?.format_video || tache?.duree_cible">
            <div class="detail-section-title">Montage Vidéo</div>
            <div class="detail-grid">
              <div class="detail-field" v-if="tache?.format_video">
                <div class="detail-label">Format vidéo</div>
                <div class="detail-value"><span class="badge badge-neutral">{{ tache.format_video }}</span></div>
              </div>
              <div class="detail-field" v-if="tache?.duree_cible">
                <div class="detail-label">Durée cible</div>
                <div class="detail-value">{{ tache.duree_cible }}</div>
              </div>
            </div>
          </div>

          <!-- SECTION: Designer -->
          <div class="detail-section" v-if="tache?.type_visuel || tache?.quantite">
            <div class="detail-section-title">Création Graphique</div>
            <div class="detail-grid">
              <div class="detail-field" v-if="tache?.type_visuel">
                <div class="detail-label">Type de visuel</div>
                <div class="detail-value"><span class="badge badge-neutral">{{ tache.type_visuel }}</span></div>
              </div>
              <div class="detail-field" v-if="tache?.quantite">
                <div class="detail-label">Quantité</div>
                <div class="detail-value">{{ tache.quantite }}</div>
              </div>
            </div>
          </div>

          <!-- SECTION: Développeur -->
          <div class="detail-section" v-if="tache?.type_technique">
            <div class="detail-section-title">Développement</div>
            <div class="detail-grid">
              <div class="detail-field">
                <div class="detail-label">Type technique</div>
                <div class="detail-value"><span class="badge badge-neutral">{{ tache.type_technique }}</span></div>
              </div>
            </div>
          </div>

          <!-- SECTION: Description / Notes -->
          <div class="detail-section" v-if="tache?.description">
            <div class="detail-section-title">Notes & Brief</div>
            <div class="detail-desc">{{ tache.description }}</div>
          </div>

        </div>

        <!-- Footer -->
        <div class="detail-modal-footer">
          <button class="btn btn-secondary" @click="$emit('close')">Fermer</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { Eye as EyeIcon, X as XIcon } from 'lucide-vue-next'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  tache: { type: Object, default: null }
})

defineEmits(['close'])

const isLate = computed(() => {
  if (!props.tache?.date_limite) return false
  const st = props.tache?.statutTache?.nom
  if (st === 'Terminé' || st === 'Publié') return false
  return new Date(props.tache.date_limite) < new Date()
})

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
}

const formatDateShort = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR')
}

const parsePlateforme = (val) => {
  if (!val) return []
  try { return JSON.parse(val) } catch { return val.split(',').map(s => s.trim()) }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  animation: fadeIn 0.15s ease;
}

@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }

.detail-modal {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  width: 100%;
  max-width: 640px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  animation: slideUp 0.2s ease;
}

@keyframes slideUp { from { transform: translateY(12px); opacity:0 } to { transform: translateY(0); opacity:1 } }

.detail-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;
}

.detail-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--accent-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.modal-close-btn {
  background: var(--bg-surface-hover);
  border: 1px solid var(--border-light);
  border-radius: 6px;
  padding: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.12s;
}
.modal-close-btn:hover { background: var(--bg-hover); color: var(--text-primary); }

.detail-modal-body {
  overflow-y: auto;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  flex: 1;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-section-title {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-light);
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem 1.5rem;
}

.detail-field {}

.detail-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 0.2rem;
}

.detail-value {
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.detail-value-bold { font-weight: 600; }

.detail-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--accent-blue);
  color: white;
  font-size: 0.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.detail-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  background: var(--bg-surface-hover);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  line-height: 1.6;
  white-space: pre-wrap;
}

.detail-modal-footer {
  padding: 0.875rem 1.25rem;
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}
</style>
