<template>
  <div class="animate-fade-in">
    <!-- Header -->
    <div class="page-header" style="margin-bottom:1.5rem;">
      <div>
        <h1 class="page-title" style="display:flex; align-items:center; gap:0.625rem;">
          <span class="meta-logo-badge">f</span>
          Analyse Campagnes Meta Ads
        </h1>
        <p class="page-subtitle" style="margin-bottom:0; display:flex; align-items:center;">
          Analyse en temps réel — Organique + Sponsorisé — Toutes pages
          <span v-if="syncResult?.pageInfo?.fan_count" style="margin-left:0.75rem; font-size:0.7rem; font-weight:700; background:#1877f215; color:#1877f2; padding:0.2rem 0.5rem; border-radius:4px; display:inline-flex; align-items:center; gap:0.25rem;">
            <UsersIcon :size="12" /> {{ formatNum(syncResult.pageInfo.fan_count) }} Abonnés Facebook
          </span>
        </p>
      </div>
      <div style="display:flex; gap:0.625rem; align-items:center;">
        <span v-if="isDemo" class="badge" style="background:#f59e0b20; color:#f59e0b; font-size:0.7rem; border:1px solid #f59e0b;">MODE DÉMO</span>
        <button class="btn btn-secondary" :disabled="syncing" @click="syncData">
          <RefreshCwIcon :size="14" :class="syncing ? 'spin' : ''" /> Synchroniser
        </button>
        <button class="btn btn-primary" :disabled="analyzing || !syncDone" @click="launchAnalysis">
          <SparklesIcon :size="14" :class="analyzing ? 'spin' : ''" />
          {{ analyzing ? 'Analyse en cours...' : 'Analyser avec l\'IA' }}
        </button>
      </div>
    </div>

    <!-- Tabs par page -->
    <div class="meta-tabs-bar">
      <button
        v-for="page in pages" :key="page.id"
        class="meta-tab" :class="{ 'meta-tab-active': activePageId === page.id }"
        @click="switchPage(page.id)"
      >
        <span class="meta-tab-badge" :style="{ background: page.color + '20', color: page.color }">{{ page.sigle }}</span>
        {{ page.nom }}
        <span v-if="pageAnalyses[page.id]" class="meta-tab-score" :style="scoreColor(pageAnalyses[page.id]?.score)">
          {{ pageAnalyses[page.id]?.score }}/100
        </span>
      </button>
    </div>

    <!-- Setup banner (no credentials) -->
    <div v-if="showSetupBanner && !analysisResult" class="setup-banner">
      <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
        <AlertTriangleIcon :size="18" style="color:#f59e0b; flex-shrink:0;" />
        <div>
          <strong>Connexion API non configurée</strong> — Les credentials Meta et/ou Google ne sont pas encore dans le <code>.env</code>.
          L'analyse fonctionnera en <strong>mode démo</strong> avec des données d'exemple jusqu'à leur configuration.
        </div>
        <button class="btn btn-primary btn-sm" style="margin-left:auto;" @click="launchAnalysis">
          <SparklesIcon :size="13" /> Tester en mode démo
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="analyzing" class="analyzing-overlay">
      <div class="analyzing-card">
        <div class="ai-spinner"></div>
        <div style="font-weight:600; font-size:0.9375rem;">L'agent IA analyse vos campagnes...</div>
        <div style="font-size:0.8125rem; color:var(--text-secondary);">{{ analyzingStep }}</div>
      </div>
    </div>

    <!-- Error message if analysis fails -->
    <div v-if="analysisError" class="card" style="margin-top:1.5rem; background:#fee2e2; border-color:#ef4444; color:#991b1b;">
      <h3 style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem; color:#b91c1c;">
        <AlertTriangleIcon :size="18" /> Échec de l'analyse IA
      </h3>
      <p style="font-size:0.875rem;">{{ analysisError }}</p>
      <button class="btn btn-primary btn-sm" style="margin-top:1rem; background:#b91c1c; border-color:#b91c1c;" @click="launchAnalysis">
        Réessayer l'analyse
      </button>
    </div>

    <!-- Main content -->
    <div v-if="analysisResult && !analysisError" style="display:flex; flex-direction:column; gap:1.5rem; margin-top:1.5rem;">

      <!-- MODULE 1: Score + Budget Cards -->
      <div style="display:grid; grid-template-columns:300px 1fr; gap:1.25rem; align-items:start;">
        <!-- Summary Card -->
        <div class="card score-card">
          <div style="font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-secondary); margin-bottom:0.75rem;">
            Résumé Exécutif
          </div>
          <div style="font-size:0.875rem; color:var(--text-primary); line-height:1.6; padding-top:0.25rem;">
            {{ analysisResult.resumeExecutif }}
          </div>
          <div style="margin-top:0.75rem; font-size:0.7rem; color:var(--text-muted);">
            Analysé le {{ formatDate(analysisResult.generatedAt) }}
            <span v-if="isDemo" style="color:#f59e0b;"> · Démo</span>
          </div>
        </div>

        <!-- Budget Cards (4 simple cards) -->
        <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:0.875rem;">
          <div class="card budget-kpi-card">
            <div class="budget-kpi-icon" style="color:#1877f2; background:#1877f215;"><EuroIcon :size="15" /></div>
            <div class="budget-kpi-label">Budget Alloué</div>
            <div class="budget-kpi-val">{{ budgetInfo.total.toLocaleString('fr-FR') }} €</div>
            <div class="budget-kpi-bar-wrap">
              <div class="budget-kpi-bar" :style="{width: Math.min((budgetInfo.depense / budgetInfo.total) * 100, 100) + '%', background: '#1877f2'}"></div>
            </div>
            <div class="budget-kpi-sub">{{ ((budgetInfo.depense / budgetInfo.total) * 100).toFixed(1) }}% utilisé</div>
          </div>

          <div class="card budget-kpi-card">
            <div class="budget-kpi-icon" style="color:var(--status-danger); background:var(--status-danger-bg);"><TrendingDownIcon :size="15" /></div>
            <div class="budget-kpi-label">Budget Dépensé</div>
            <div class="budget-kpi-val" style="color:var(--status-danger);">{{ budgetInfo.depense.toLocaleString('fr-FR') }} €</div>
            <div class="budget-kpi-bar-wrap">
              <div class="budget-kpi-bar" :style="{width: Math.min((budgetInfo.depense / budgetInfo.total) * 100, 100) + '%', background: 'var(--status-danger)'}"></div>
            </div>
            <div class="budget-kpi-sub">sur {{ budgetInfo.total.toLocaleString('fr-FR') }}€ alloués</div>
          </div>

          <div class="card budget-kpi-card">
            <div class="budget-kpi-icon" style="color:var(--status-success); background:var(--status-success-bg);"><WalletIcon :size="15" /></div>
            <div class="budget-kpi-label">Budget Restant</div>
            <div class="budget-kpi-val" style="color:var(--status-success);">{{ (budgetInfo.total - budgetInfo.depense).toLocaleString('fr-FR') }} €</div>
            <div class="budget-kpi-bar-wrap">
              <div class="budget-kpi-bar" :style="{width: Math.min(((budgetInfo.total - budgetInfo.depense) / budgetInfo.total) * 100, 100) + '%', background: 'var(--status-success)'}"></div>
            </div>
            <div class="budget-kpi-sub">{{ (100 - (budgetInfo.depense / budgetInfo.total) * 100).toFixed(1) }}% disponible</div>
          </div>

          <div class="card budget-kpi-card">
            <div class="budget-kpi-icon" style="color:#f59e0b; background:#f59e0b15;"><TrendingUpIcon :size="15" /></div>
            <div class="budget-kpi-label">Revenus Générés</div>
            <div class="budget-kpi-val" style="color:#f59e0b;">{{ (budgetInfo.revenusBilletterie + budgetInfo.revenusExposants).toLocaleString('fr-FR') }} €</div>
            <div class="budget-kpi-bar-wrap">
              <div class="budget-kpi-bar" style="background:#f59e0b; width:100%;"></div>
            </div>
            <div class="budget-kpi-sub" v-if="budgetInfo.depense > 0">ROI : x{{ ((budgetInfo.revenusBilletterie + budgetInfo.revenusExposants) / budgetInfo.depense).toFixed(1) }}</div>
            <div class="budget-kpi-sub" v-else>Billetterie + Exposants</div>
          </div>
        </div>
      </div>

      <!-- MODULE 2: Alertes Diagnostic -->
      <div v-if="analysisResult.alertes?.length" class="card" style="padding:1.25rem;">
        <h3 style="font-size:0.875rem; font-weight:700; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <AlertTriangleIcon :size="15" style="color:var(--status-danger);" />
          Diagnostic Expert — Problèmes Détectés
        </h3>
        <div style="display:flex; flex-direction:column; gap:0.625rem;">
          <div
            v-for="alerte in analysisResult.alertes" :key="alerte.titre"
            class="alerte-card"
            :class="`alerte-${alerte.niveau}`"
          >
            <div style="display:flex; align-items:flex-start; gap:0.75rem;">
              <span class="alerte-dot" :class="`dot-${alerte.niveau}`"></span>
              <div style="flex:1;">
                <div style="font-weight:700; font-size:0.875rem; margin-bottom:0.25rem;">
                  {{ alerte.titre }}
                </div>
                <div style="font-size:0.8125rem; color:var(--text-secondary); margin-bottom:0.375rem;">{{ alerte.message }}</div>
                <div style="font-size:0.75rem; color:var(--text-muted); font-style:italic; display:flex; align-items:center; gap:0.375rem;">
                  <InfoIcon :size="11" /> <span>{{ alerte.justification }}</span>
                </div>
              </div>
              <span class="badge alerte-badge" :class="`badge-${alerte.niveau}`">{{ alerte.niveau.toUpperCase() }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- MODULE 3: Tableau des Posts (OBLIGATOIRE) -->
      <div class="card" style="padding:0; overflow:hidden;">
        <div style="padding:1rem 1.25rem; border-bottom:1px solid var(--border-light); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
          <div>
            <h3 style="font-size:0.9375rem; font-weight:700; margin-bottom:2px;">Performances par Post — Du plus au moins performant</h3>
            <div style="font-size:0.75rem; color:var(--text-secondary);">Organique + Sponsorisé · {{ activePagePosts.length }} post(s) analysé(s)</div>
          </div>
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <select v-model="filterAction" class="form-input" style="padding:0.25rem 0.5rem; font-size:0.75rem; width:auto;">
              <option value="">Tous</option>
              <option value="LAISSER_TOURNER">Laisser tourner</option>
              <option value="BOOSTER">Booster</option>
              <option value="SURVEILLER">Surveiller</option>
              <option value="ARRETER">Arrêter</option>
              <option value="MODIFIER_CIBLAGE">Modifier ciblage</option>
              <option value="OPTIMISER">Optimiser</option>
            </select>
            <button class="btn btn-secondary btn-sm" @click="exportCSV">
              <DownloadIcon :size="13" /> CSV
            </button>
          </div>
        </div>
        <div style="overflow-x:auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Post</th>
                <th>Date</th>
                <th>Vues Total</th>
                <th>Vues Pub</th>
                <th>Vues Org.</th>
                <th>Couverture</th>
                <th>Interactions</th>
                <th>Clics Lien</th>
                <th>Tx Eng.</th>
                <th style="min-width:180px;">Action IA</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredPosts.length === 0">
                <td colspan="11" style="text-align:center; padding:3rem; color:var(--text-muted);">
                  <SparklesIcon :size="28" style="display:block; margin:0 auto 0.75rem;" />
                  Lancez une analyse IA pour voir les performances des posts.
                </td>
              </tr>
              <tr v-for="(post, idx) in filteredPosts" :key="post.postId" class="post-row">
                <td style="font-weight:700; color:var(--text-muted); font-size:0.8rem;">{{ idx + 1 }}</td>
                <td>
                  <div style="font-weight:600; font-size:0.8125rem; max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" :title="post.message">
                    {{ post.message }}
                  </div>
                </td>
                <td style="font-size:0.75rem; color:var(--text-secondary); white-space:nowrap;">—</td>
                <td><strong>{{ formatNum(syncResult?.posts?.find(p=>p.id===post.postId)?.vuesTotal) }}</strong></td>
                <td style="color:var(--accent-primary);">{{ formatNum(syncResult?.posts?.find(p=>p.id===post.postId)?.vuesPub) }}</td>
                <td style="color:var(--status-success);">{{ formatNum(syncResult?.posts?.find(p=>p.id===post.postId)?.vuesOrganique) }}</td>
                <td>{{ formatNum(syncResult?.posts?.find(p=>p.id===post.postId)?.couverture) }}</td>
                <td>{{ formatNum(syncResult?.posts?.find(p=>p.id===post.postId)?.interactions) }}</td>
                <td style="font-weight:600;">{{ formatNum(syncResult?.posts?.find(p=>p.id===post.postId)?.clicsLien) }}</td>
                <td>
                  <span :style="{color: engagementColor(syncResult?.posts?.find(p=>p.id===post.postId)?.tauxEngagement)}">
                    {{ syncResult?.posts?.find(p=>p.id===post.postId)?.tauxEngagement ?? '—' }}%
                  </span>
                </td>
                <td>
                  <div style="display:flex; flex-direction:column; gap:0.25rem;">
                    <span class="action-badge" :class="`action-${post.action}`">{{ post.actionLabel }}</span>
                    <button
                      class="justify-btn"
                      @click="toggleJustif(post.postId)"
                      style="font-size:0.65rem; text-decoration:underline; color:var(--text-muted); cursor:pointer; background:none; border:none; text-align:left;"
                    >
                      {{ openJustifs.includes(post.postId) ? '▲ Masquer' : '▼ Justification' }}
                    </button>
                    <div v-if="openJustifs.includes(post.postId)" class="justif-box">
                      {{ post.justification }}
                      <span v-if="post.budgetSugere" style="display:block; margin-top:4px; font-weight:600; color:var(--accent-primary);">
                        Budget suggéré : {{ post.budgetSugere }}€
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- MODULES 4+5: Budget Réallocation + Audience -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem;">

        <!-- Module 4: Réallocation Budget -->
        <div class="card">
          <h3 style="font-size:0.875rem; font-weight:700; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
            <EuroIcon :size="15" style="color:var(--accent-primary);" /> Réallocation Budgétaire Suggérée
          </h3>
          <div style="display:flex; flex-direction:column; gap:0.625rem;">
            <div v-for="item in analysisResult.budgetReallocation" :key="item.postMessage" class="budget-item">
              <div style="display:flex; align-items:center; justify-content:space-between; gap:0.5rem; margin-bottom:0.25rem;">
                <div style="font-weight:600; font-size:0.8125rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1;" :title="item.postMessage">
                  {{ item.postMessage }}
                </div>
                <div style="display:flex; align-items:center; gap:0.375rem; flex-shrink:0;">
                  <span class="badge" :class="`budget-badge-${item.action}`">{{ item.action }}</span>
                  <span v-if="item.montant" style="font-weight:700; font-size:0.8125rem;">{{ item.montant }}€</span>
                </div>
              </div>
              <div style="font-size:0.7rem; color:var(--text-muted); font-style:italic;">{{ item.justification }}</div>
            </div>
          </div>
          <!-- Total reallocation -->
          <div style="margin-top:1rem; padding-top:0.75rem; border-top:1px solid var(--border-light); display:flex; justify-content:space-between; font-size:0.8125rem;">
            <span style="color:var(--text-secondary);">Budget hebdo recommandé</span>
            <span style="font-weight:700; color:var(--accent-primary);">
              {{ analysisResult.budgetReallocation.reduce((s,i) => s + (i.montant||0), 0) }}€
            </span>
          </div>
        </div>

        <!-- Module 5: Audience + Content Intel -->
        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          <!-- Audience Alerts -->
          <div class="card" v-if="analysisResult.audienceAlerts?.length">
            <h3 style="font-size:0.875rem; font-weight:700; margin-bottom:0.75rem; display:flex; align-items:center; gap:0.5rem;">
              <UsersIcon :size="15" style="color:var(--accent-purple);" /> Intelligence Audience
            </h3>
            <div v-for="alert in analysisResult.audienceAlerts" :key="alert.message" style="margin-bottom:0.625rem; padding:0.625rem; border-radius:6px; background:var(--bg-surface-hover); border-left:3px solid;" :style="{borderLeftColor: alert.niveau === 'critique' ? 'var(--status-danger)' : alert.niveau === 'important' ? '#f59e0b' : 'var(--accent-primary)'}">
              <div style="font-size:0.8125rem; font-weight:600; margin-bottom:0.25rem;">{{ alert.message }}</div>
              <div style="font-size:0.7rem; color:var(--text-muted); font-style:italic;">{{ alert.justification }}</div>
            </div>
          </div>

          <!-- Content Intel (Module 6) -->
          <div class="card content-intel-card">
            <h3 style="font-size:0.875rem; font-weight:700; margin-bottom:0.75rem; display:flex; align-items:center; gap:0.5rem;">
              <TrendingUpIcon :size="15" style="color:var(--status-success);" /> Intelligence Contenu
            </h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin-bottom:0.75rem;">
              <div class="intel-stat">
                <div class="intel-stat-label">Format gagnant</div>
                <div class="intel-stat-val">{{ analysisResult.contentIntel?.formatGagnant }}</div>
              </div>
              <div class="intel-stat">
                <div class="intel-stat-label">Meilleur horaire</div>
                <div class="intel-stat-val">{{ analysisResult.contentIntel?.meilleurHoraire }}</div>
              </div>
              <div class="intel-stat" style="grid-column:1/-1;">
                <div class="intel-stat-label">Thème gagnant</div>
                <div class="intel-stat-val">{{ analysisResult.contentIntel?.themeGagnant }}</div>
              </div>
            </div>
            <div style="font-size:0.8125rem; color:var(--text-secondary); line-height:1.6; background:var(--bg-surface-hover); border-radius:6px; padding:0.625rem; border:1px solid var(--border-light);">
              {{ analysisResult.contentIntel?.recommandation }}
            </div>
          </div>
        </div>
      </div>

      <!-- Module 7: Plan d'action hebdo -->
      <div class="card">
        <h3 style="font-size:0.9375rem; font-weight:700; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <CalendarIcon :size="15" style="color:var(--accent-primary);" />
          Plan d'Action — Cette Semaine
        </h3>
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:1rem;">
          <div>
            <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; color:var(--status-danger); margin-bottom:0.625rem; display:flex; align-items:center; gap:0.375rem;">
              <span style="width:6px; height:6px; border-radius:50%; background:var(--status-danger); display:inline-block;"></span> Urgent
            </div>
            <div v-for="item in urgentActions" :key="item.action" class="action-item action-urgent">
              <CheckSquareIcon :size="13" /> {{ item.action }}
            </div>
            <div v-if="!urgentActions.length" style="font-size:0.8rem; color:var(--text-muted); font-style:italic;">Rien d'urgent</div>
          </div>
          <div>
            <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; color:#f59e0b; margin-bottom:0.625rem; display:flex; align-items:center; gap:0.375rem;">
              <span style="width:6px; height:6px; border-radius:50%; background:#f59e0b; display:inline-block;"></span> Cette semaine
            </div>
            <div v-for="item in weekActions" :key="item.action" class="action-item action-week">
              <CheckSquareIcon :size="13" /> {{ item.action }}
            </div>
          </div>
          <div>
            <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; color:var(--accent-primary); margin-bottom:0.625rem; display:flex; align-items:center; gap:0.375rem;">
              <span style="width:6px; height:6px; border-radius:50%; background:var(--accent-primary); display:inline-block;"></span> À surveiller
            </div>
            <div v-for="item in watchActions" :key="item.action" class="action-item action-watch">
              <EyeIcon :size="13" /> {{ item.action }}
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Empty state initial -->
    <div v-else-if="!analyzing && !analysisError" class="empty-meta-state">
      <div style="display:flex; flex-direction:column; align-items:center; gap:1rem; padding:4rem 2rem; text-align:center;">
        <div class="ai-icon-big">
          <SparklesIcon :size="28" />
        </div>
        <div style="font-size:1.125rem; font-weight:700;">Prêt pour l'analyse</div>
        <div style="font-size:0.875rem; color:var(--text-secondary); max-width:440px; line-height:1.6;">
          Cliquez sur <strong>"Analyser avec l'IA"</strong> pour obtenir une analyse experte de vos campagnes Meta Ads — organique + sponsorisé, du plus au moins performant, avec suggestions justifiées.
        </div>
        <div style="display:flex; gap:0.75rem; margin-top:0.5rem;">
          <button class="btn btn-primary" @click="launchAnalysis">
            <SparklesIcon :size="14" /> Lancer l'analyse
          </button>
        </div>
        <div style="font-size:0.75rem; color:var(--text-muted);">Fonctionne en mode démo si les credentials API ne sont pas configurés.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import {
  Sparkles as SparklesIcon, RefreshCw as RefreshCwIcon, Download as DownloadIcon,
  AlertTriangle as AlertTriangleIcon, Info as InfoIcon, Eye as EyeIcon,
  Euro as EuroIcon, Users as UsersIcon, TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon, Wallet as WalletIcon,
  Calendar as CalendarIcon, CheckSquare as CheckSquareIcon, BarChart2 as BarChart2Icon
} from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })

const { data: editions } = await useFetch('/api/editions')

// Pages from DB editions
const PAGE_COLORS = ['#1877f2','#7c3aed','#0891b2','#059669','#d97706','#e11d48']
const pages = computed(() => {
  if (!editions.value) return []
  return editions.value.map((ed, i) => ({
    id: ed.id,
    metaPageId: ed.metaPageId || '', 
    sigle: ed.licence?.sigle || '?',
    nom: `${ed.licence?.sigle || ''} ${ed.ville?.nom_ville || ''}`.trim(),
    color: PAGE_COLORS[i % PAGE_COLORS.length]
  }))
})

const activePageId = ref(null)
watch(pages, val => { if (val.length && !activePageId.value) activePageId.value = val[0].id }, { immediate: true })
const activePage = computed(() => pages.value.find(p => p.id === activePageId.value))

// State
const syncing = ref(false)
const syncDone = ref(true) // Allow analysis even without sync (demo mode)
const analyzing = ref(false)
const isDemo = ref(false)
const analyzingStep = ref('Connexion à l\'agent IA...')
const syncResult = ref(null)
const analysisResult = ref(null)
const analysisError = ref(null)
const pageAnalyses = ref({})
const filterAction = ref('')
const openJustifs = ref([])
const showSetupBanner = ref(true)

const switchPage = (id) => {
  activePageId.value = id
  analysisResult.value = pageAnalyses.value[id] || null
  isDemo.value = false
}

// Active page posts from analysis
const activePagePosts = computed(() => analysisResult.value?.postsAnalyses || [])
const filteredPosts = computed(() => {
  if (!filterAction.value) return activePagePosts.value
  return activePagePosts.value.filter(p => p.action === filterAction.value)
})

// Plan d'action splits
const urgentActions = computed(() => analysisResult.value?.planAction?.filter(a => a.priorite === 'urgent') || [])
const weekActions = computed(() => analysisResult.value?.planAction?.filter(a => a.priorite === 'cette_semaine') || [])
const watchActions = computed(() => analysisResult.value?.planAction?.filter(a => a.priorite === 'surveiller') || [])

// Budget info reactive (updated per page, will be populated from sheets/API)
const budgetInfo = ref({ total: 5000, depense: 89.05, revenusBilletterie: 244.02, revenusExposants: 431.45 })

// Sync data from Meta API
const syncData = async () => {
  syncing.value = true
  try {
    const pageId = activePage.value?.metaPageId
    if (!pageId) { 
      alert("⚠️ Aucun ID de page Meta n'a été renseigné pour cette édition.\nAllez dans Paramètres > Éditions Planifiées pour ajouter l'ID de la page.")
      syncResult.value = null
      return 
    }
    const data = await $fetch(`/api/meta/sync?pageId=${pageId}`)
    syncResult.value = data
    syncDone.value = true

    // Update budget info from Google Sheets data
    const cityKey = Object.keys(data.sheetData || {}).find(k => activePage.value?.nom?.toLowerCase().includes(k))
    if (cityKey && data.sheetData[cityKey]?.found) {
      const b = data.sheetData[cityKey]
      budgetInfo.value = {
        total: b.budget || 5000,
        depense: b.depense || 0,
        revenusBilletterie: b.revenusBilletterie || 0,
        revenusExposants: b.revenusExposants || 0
      }
    }

    if (data?.meta?.hasMetaToken) {
      showSetupBanner.value = false
    }
  } catch (e) {
    console.error('Sync error:', e)
  } finally {
    syncing.value = false
  }
}

// Launch AI analysis
const launchAnalysis = async () => {
  analyzing.value = true
  analysisError.value = null
  showSetupBanner.value = false
  const steps = [
    'Récupération des données Meta...',
    'Lecture de la feuille de suivi...',
    'Calcul des KPIs...',
    'Analyse expert en cours...',
    'Génération des recommandations...'
  ]
  let stepIdx = 0
  const stepInterval = setInterval(() => {
    analyzingStep.value = steps[Math.min(stepIdx++, steps.length - 1)]
  }, 1200)

  try {
    if (!syncResult.value || syncResult.value.pageId !== activePage.value?.metaPageId) {
      await syncData()
    }

    const cityKey = Object.keys(syncResult.value?.sheetData || {}).find(k => activePage.value?.nom?.toLowerCase().includes(k))
    const rawSummary = cityKey ? (syncResult.value?.sheetData[cityKey]?.rawSummary || '') : ''

    const result = await $fetch('/api/meta/analyse', {
      method: 'POST',
      body: {
        pageNom: activePage.value?.nom || 'Page inconnue',
        pageId: activePage.value?.metaPageId || '',
        followers: { 
          fb: syncResult.value?.pageInfo?.fan_count || 0, 
          ig: 0 
        },
        periode: 'Derniers 30 jours',
        joursAvantEvenement: 90,
        posts: syncResult.value?.posts || [],
        adInsights: syncResult.value?.adInsights || [],
        budgetInfo: budgetInfo.value,
        sheetData: rawSummary
      }
    })
    if (result.success) {
      analysisResult.value = result.analysis
      isDemo.value = result.isDemo
      pageAnalyses.value[activePageId.value] = result.analysis
    } else {
      analysisError.value = result.error || "Une erreur inconnue s'est produite."
    }
  } catch (e) {
    console.error('Analysis error:', e)
    analysisError.value = e.data?.statusMessage || e.message || "Erreur de connexion avec l'IA."
  } finally {
    clearInterval(stepInterval)
    analyzing.value = false
  }
}

// Justification toggle
const toggleJustif = (id) => {
  const idx = openJustifs.value.indexOf(id)
  if (idx === -1) openJustifs.value.push(id)
  else openJustifs.value.splice(idx, 1)
}

// Export CSV
const exportCSV = () => {
  const header = 'Rang,Post,Action IA,Justification,Budget suggéré\n'
  const rows = filteredPosts.value.map((p, i) =>
    `${i+1},"${p.message?.replace(/"/g, '\'') || ''}","${p.actionLabel}","${p.justification?.replace(/"/g, '\'') || ''}",${p.budgetSugere || ''}`
  ).join('\n')
  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `meta_analyse_${activePage.value?.sigle}_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// Helpers
const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }) : '—'
const formatNum = (n) => n != null ? Number(n).toLocaleString('fr-FR') : '—'

const scoreText = (s) => s >= 80 ? 'Excellent' : s >= 65 ? 'Bon' : s >= 50 ? 'Moyen' : 'Faible'
const scoreTextColor = (s) => s >= 80 ? 'var(--status-success)' : s >= 65 ? '#f59e0b' : s >= 50 ? 'var(--text-primary)' : 'var(--status-danger)'
const scoreColor = (s) => ({ color: scoreTextColor(s), fontSize: '0.65rem', fontWeight: 700, marginLeft: 'auto', flexShrink: 0 })
const scoreRingStyle = (s) => {
  const color = s >= 80 ? 'var(--status-success)' : s >= 65 ? '#f59e0b' : s >= 50 ? 'var(--accent-primary)' : 'var(--status-danger)'
  const pct = (s / 100) * 283
  return {
    '--score-color': color,
    '--score-pct': pct + 'px'
  }
}
const engagementColor = (v) => {
  const n = parseFloat(v)
  if (isNaN(n)) return 'var(--text-muted)'
  return n >= 3 ? 'var(--status-success)' : n >= 1 ? '#f59e0b' : 'var(--status-danger)'
}
</script>

<style scoped>
.meta-logo-badge {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 8px;
  background: linear-gradient(135deg, #1877f2, #0055d4);
  color: white; font-size: 0.9rem; font-weight: 800; flex-shrink: 0;
}

.meta-tabs-bar {
  display: flex; gap: 0.25rem;
  border-bottom: 1px solid var(--border-light);
  overflow-x: auto; padding-bottom: 0;
}
.meta-tab {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none; background: transparent;
  color: var(--text-secondary); font-size: 0.8125rem; font-weight: 500;
  cursor: pointer; border-bottom: 2px solid transparent;
  transition: all 0.15s; white-space: nowrap; border-radius: 6px 6px 0 0;
}
.meta-tab:hover { background: var(--bg-surface-hover); color: var(--text-primary); }
.meta-tab-active { color: var(--accent-primary); border-bottom-color: var(--accent-primary); font-weight: 700; }
.meta-tab-badge { font-size: 0.65rem; font-weight: 700; padding: 0.15rem 0.4rem; border-radius: 4px; }
.meta-tab-score { font-size: 0.65rem; font-weight: 700; padding: 0.1rem 0.35rem; border-radius: 10px; background: var(--bg-surface-hover); margin-left: 0.25rem; }

.setup-banner {
  margin-top: 1rem; padding: 0.875rem 1.25rem;
  background: #f59e0b12; border: 1px solid #f59e0b40; border-radius: 10px;
  font-size: 0.8125rem;
}

.analyzing-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
}
.analyzing-card {
  background: var(--bg-card); border-radius: 16px; padding: 2rem 3rem;
  display: flex; flex-direction: column; align-items: center; gap: 1rem;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}
.ai-spinner {
  width: 48px; height: 48px; border-radius: 50%;
  border: 3px solid var(--border-light);
  border-top-color: var(--accent-primary);
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 1s linear infinite; }

/* Score ring */
.score-card { }
.score-ring {
  width: 72px; height: 72px; position: relative; flex-shrink: 0;
  background: conic-gradient(var(--score-color, var(--accent-primary)) calc(var(--score-pct, 0px) * 1%), var(--border-light) 0%);
  border-radius: 50%;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.score-ring::before {
  content: ''; position: absolute; inset: 6px;
  background: var(--bg-card); border-radius: 50%;
}
.score-number { position: relative; font-size: 1.25rem; font-weight: 800; line-height: 1; z-index: 1; }
.score-label { position: relative; font-size: 0.6rem; color: var(--text-muted); z-index: 1; }

/* Budget KPI Cards */
.budget-kpi-card { padding: 1rem 1.125rem; display: flex; flex-direction: column; gap: 0.25rem; }
.budget-kpi-icon { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 0.375rem; flex-shrink: 0; }
.budget-kpi-label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-secondary); }
.budget-kpi-val { font-size: 1.375rem; font-weight: 800; line-height: 1.2; }
.budget-kpi-bar-wrap { height: 3px; background: var(--border-light); border-radius: 99px; overflow: hidden; margin: 0.375rem 0 0.25rem; }
.budget-kpi-bar { height: 100%; border-radius: 99px; transition: width 0.6s ease; }
.budget-kpi-sub { font-size: 0.7rem; color: var(--text-muted); }

/* Alertes */
.alerte-card { padding: 0.875rem 1rem; border-radius: 8px; border: 1px solid; }
.alerte-critique { background: var(--status-danger-bg, #ff000010); border-color: var(--status-danger); }
.alerte-important { background: #f59e0b10; border-color: #f59e0b; }
.alerte-info { background: var(--status-info-bg, #3b82f610); border-color: var(--status-info, #3b82f6); }
.alerte-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
.dot-critique { background: var(--status-danger); }
.dot-important { background: #f59e0b; }
.dot-info { background: var(--status-info, #3b82f6); }
.alerte-badge { font-size: 0.6rem; }
.badge-critique { background: var(--status-danger-bg, #ff000015); color: var(--status-danger); border: 1px solid var(--status-danger); }
.badge-important { background: #f59e0b15; color: #f59e0b; border: 1px solid #f59e0b; }
.badge-info { background: #3b82f615; color: #3b82f6; border: 1px solid #3b82f6; }

/* Action badges */
.action-badge { display: inline-flex; align-items: center; font-size: 0.7rem; font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 4px; }
.action-LAISSER_TOURNER { background: var(--status-success-bg); color: var(--status-success); border: 1px solid var(--status-success); }
.action-BOOSTER { background: #7c3aed15; color: #7c3aed; border: 1px solid #7c3aed; }
.action-SURVEILLER { background: #f59e0b15; color: #f59e0b; border: 1px solid #f59e0b; }
.action-ARRETER { background: var(--status-danger-bg); color: var(--status-danger); border: 1px solid var(--status-danger); }
.action-MODIFIER_CIBLAGE { background: #3b82f615; color: #3b82f6; border: 1px solid #3b82f6; }
.action-OPTIMISER { background: var(--bg-surface-hover); color: var(--text-secondary); border: 1px solid var(--border-light); }

.justif-box {
  font-size: 0.7rem; color: var(--text-secondary); line-height: 1.5;
  background: var(--bg-surface-hover); border: 1px solid var(--border-light);
  border-radius: 4px; padding: 0.375rem 0.5rem; margin-top: 0.25rem;
  max-width: 320px; white-space: normal;
}

/* Budget reallocation */
.budget-item { padding: 0.625rem 0.875rem; border-radius: 6px; background: var(--bg-surface-hover); border: 1px solid var(--border-light); }
.budget-badge-STOP { background: var(--status-danger-bg); color: var(--status-danger); }
.budget-badge-BOOST { background: #7c3aed15; color: #7c3aed; }
.budget-badge-KEEP { background: var(--status-success-bg); color: var(--status-success); }
.budget-badge-RETARGET { background: #3b82f615; color: #3b82f6; }

/* Content intel */
.intel-stat { padding: 0.5rem 0.625rem; background: var(--bg-surface-hover); border-radius: 6px; }
.intel-stat-label { font-size: 0.65rem; color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 2px; }
.intel-stat-val { font-size: 0.875rem; font-weight: 700; color: var(--text-primary); }

/* Plan d'action */
.action-item { display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.8rem; padding: 0.5rem 0.625rem; border-radius: 6px; margin-bottom: 0.375rem; color: var(--text-secondary); }
.action-urgent { background: var(--status-danger-bg); color: var(--status-danger); }
.action-week { background: #f59e0b10; color: #d97706; }
.action-watch { background: var(--bg-surface-hover); color: var(--text-secondary); }

/* Empty state */
.ai-icon-big {
  width: 72px; height: 72px; border-radius: 20px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-purple));
  color: white; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 24px rgba(99,102,241,0.4);
}

.post-row:hover { background: var(--bg-surface-hover); }
</style>
