/**
 * Groq AI Agent — Expert Meta Ads Analyst
 * Uses Groq's free API (Llama 3.3 70B) to analyze Meta Ads campaigns
 * Compatible with OpenAI chat completions format
 */

import https from 'node:https'

function callGroqAI(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      reject(new Error('GROQ_API_KEY not configured'))
      return
    }

    const body = JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    })

    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Authorization': `Bearer ${apiKey}`
      }
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`Groq HTTP ${res.statusCode}: ${data}`))
          return
        }
        try {
          const json = JSON.parse(data)
          const text = json?.choices?.[0]?.message?.content || ''
          resolve(text)
        } catch (e) {
          reject(new Error('Failed to parse Groq response: ' + data))
        }
      })
    })

    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

export interface PostAnalysis {
  postId: string
  message: string
  action: 'LAISSER_TOURNER' | 'BOOSTER' | 'SURVEILLER' | 'ARRETER' | 'MODIFIER_CIBLAGE' | 'OPTIMISER'
  actionLabel: string
  priorite: 'haute' | 'moyenne' | 'faible'
  justification: string
  budgetSugere?: number
}

export interface BudgetReallocation {
  postMessage: string
  action: 'STOP' | 'BOOST' | 'KEEP' | 'RETARGET'
  montant?: number
  justification: string
}

export interface AudienceAlert {
  type: 'geo' | 'age' | 'frequence' | 'autre'
  niveau: 'critique' | 'important' | 'info'
  message: string
  justification: string
}

export interface ContentIntel {
  formatGagnant: string
  meilleurHoraire: string
  themeGagnant: string
  recommandation: string
}

export interface WeeklyAction {
  priorite: 'urgent' | 'cette_semaine' | 'surveiller'
  action: string
}

export interface MetaAnalysisResult {
  pageNom: string
  score: number
  scoreTendance: string
  resumeExecutif: string
  alertes: Array<{ niveau: 'critique' | 'important' | 'info'; titre: string; message: string; justification: string }>
  postsAnalyses: PostAnalysis[]
  budgetReallocation: BudgetReallocation[]
  audienceAlerts: AudienceAlert[]
  contentIntel: ContentIntel
  planAction: WeeklyAction[]
  kpis: {
    tauxOrganiqueMoyen: string
    ctrMoyen: string
    cpcMoyen: string
    cpmMoyen: string
    roiActuel: string
    roiRecommande: string
  }
  generatedAt: string
}

const SYSTEM_PROMPT = `Tu es un expert senior en publicité Meta Ads et Community Management, spécialisé dans les événements culturels et festivals en France.

Tu analyses des données réelles de campagnes Meta Ads pour les pages Facebook/Instagram du Japan Otaku Festival (JOF) — un festival de culture manga/anime organisé dans plusieurs villes françaises (Bordeaux, Metz, Évreux, Nevers...).

Tes analyses doivent être :
- OBJECTIVES : basées uniquement sur les chiffres fournis
- EXPERTES : utiliser les vrais KPIs Meta (CTR, CPC, CPM, fréquence, taux d'engagement)
- JUSTIFIÉES : chaque recommandation doit citer les métriques qui la supportent
- ACTIONNABLES : des actions concrètes, pas des généralités
- CONTEXTUALISÉES : tenir compte du secteur événementiel, de la saisonnalité et de la date de l'événement

Benchmarks Meta pour événements culturels en France :
- CTR moyen : 0.5% - 1.5% (bon > 1%, excellent > 2%)
- CPC moyen : 0.50€ - 1.50€ (bon < 0.80€, excellent < 0.40€)
- CPM moyen : 5€ - 12€
- Taux d'engagement : 1% - 3% (bon > 2%, excellent > 5%)
- Fréquence : garder < 3 (sinon bannière aveugle)

RÈGLES DE COHÉRENCE ABSOLUES :
1. Si un post a l'action "ARRETER" dans postsAnalyses, il DOIT avoir l'action "STOP" dans budgetReallocation. Tu ne peux pas transférer du budget vers un post que tu as conseillé d'arrêter.
2. Si tu conseilles "BOOST" dans budgetReallocation, le post correspondant DOIT avoir l'action "BOOSTER" dans postsAnalyses.
3. Les justifications DOIVENT inclure les chiffres exacts du tableau de données (Dépenses, Clics, CPC, Vues). Exemple : "Dépense de 150€ pour seulement 11 clics (CPC 13€), à arrêter immédiatement."

Actions possibles pour chaque post :
- LAISSER_TOURNER : performe bien, retour sur investissement correct
- BOOSTER : performe exceptionnellement bien (CPC très bas, fort volume de clics), mérite TOUT le budget
- SURVEILLER : trop tôt pour juger ou données mitigées
- ARRETER : mauvais retour sur investissement (ex: beaucoup de vues mais aucun clic, ou CPC très élevé), pur gaspillage
- MODIFIER_CIBLAGE : clics présents mais pas d'engagement ou inversement
- OPTIMISER : modifier la créa

IMPORTANT: Réponds UNIQUEMENT avec un JSON valide, sans markdown, sans explication.`

export async function analyzeMetaPage(data: {
  pageNom: string
  pageId: string
  followers: { fb: number; ig: number }
  periode: string
  joursAvantEvenement: number
  posts: any[]
  adInsights: any[]
  budgetInfo: {
    total: number
    depense: number
    revenusBilletterie: number
    revenusExposants: number
  }
  sheetData: string
}): Promise<MetaAnalysisResult | null> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    console.warn('[Groq] No API key configured')
    return null
  }

  const roi = data.budgetInfo.depense > 0
    ? ((data.budgetInfo.revenusBilletterie + data.budgetInfo.revenusExposants) / data.budgetInfo.depense).toFixed(1)
    : 'N/A'

  const postsToAnalyze = data.posts.slice(0, 12)
  const postsText = postsToAnalyze.length > 0
    ? postsToAnalyze.map((p, i) =>
        `Post #${i + 1}: "${p.message?.slice(0, 80) || 'Sans texte'}"
    - ID: ${p.id}
    - Date: ${p.createdTime}
    - Vues Total: ${p.vuesTotal} | Vues Payées: ${p.vuesPub} | Vues Organiques: ${p.vuesOrganique}
    - Couverture: ${p.couverture} | Interactions: ${p.interactions} | Clics Lien: ${p.clicsLien}
    - Taux d'engagement: ${p.tauxEngagement}%
    - Sponsorisé: ${p.isSponsored ? 'Oui' : 'Non (organique)'}`
      ).join('\n\n')
    : 'Aucun post disponible (données en cours de synchronisation).'

  const adsText = data.adInsights.length > 0
    ? data.adInsights.map(ad =>
        `Campagne "${ad.campaign_name}": Dépense=${ad.spend}€, Impressions=${ad.impressions}, Clics=${ad.clicks}, CTR=${ad.ctr}%, CPC=${ad.cpc}€, CPM=${ad.cpm}€`
      ).join('\n')
    : 'Aucune donnée publicitaire disponible.'

  const prompt = `${SYSTEM_PROMPT}

---

DONNÉES DE LA PAGE : ${data.pageNom}
Période d'analyse : ${data.periode}
Jours avant l'événement : J-${data.joursAvantEvenement}
Followers Facebook : ${data.followers.fb}

BUDGET & ROI :
- Budget Total : ${data.budgetInfo.total}€
- Dépensé : ${data.budgetInfo.depense}€ (${data.budgetInfo.total > 0 ? ((data.budgetInfo.depense / data.budgetInfo.total) * 100).toFixed(1) : 0}%)
- Revenus Billetterie : ${data.budgetInfo.revenusBilletterie}€
- Revenus Exposants : ${data.budgetInfo.revenusExposants}€
- ROI actuel : x${roi}

POSTS (organiques + sponsorisés) :
${postsText}

CAMPAGNES PUBLICITAIRES META :
${adsText}

DONNÉES FEUILLE DE SUIVI INTERNE :
${data.sheetData || 'Non disponible'}

---

Génère un rapport expert complet au format JSON EXACT suivant :
{
  "score": <entier 0-100>,
  "scoreTendance": "<hausse|baisse|stable>",
  "resumeExecutif": "<3-4 phrases synthèse expert>",
  "alertes": [
    {
      "niveau": "<critique|important|info>",
      "titre": "<titre court>",
      "message": "<message clair>",
      "justification": "<chiffres qui justifient>"
    }
  ],
  "postsAnalyses": [
    {
      "postId": "<utiliser l'ID fourni>",
      "message": "<80 premiers chars>",
      "action": "<LAISSER_TOURNER|BOOSTER|SURVEILLER|ARRETER|MODIFIER_CIBLAGE|OPTIMISER>",
      "actionLabel": "<libellé humain avec emoji>",
      "priorite": "<haute|moyenne|faible>",
      "justification": "<justification avec chiffres>",
      "budgetSugere": <montant en euros si BOOSTER, sinon null>
    }
  ],
  "budgetReallocation": [
    {
      "postMessage": "<nom du post>",
      "action": "<STOP|BOOST|KEEP|RETARGET>",
      "montant": <montant ou null>,
      "justification": "<pourquoi>"
    }
  ],
  "audienceAlerts": [
    {
      "type": "<geo|age|frequence|autre>",
      "niveau": "<critique|important|info>",
      "message": "<alerte>",
      "justification": "<chiffres>"
    }
  ],
  "contentIntel": {
    "formatGagnant": "<Reel|Photo|Vidéo|...>",
    "meilleurHoraire": "<ex: 21h-22h>",
    "themeGagnant": "<type de contenu qui fonctionne>",
    "recommandation": "<conseil créatif concret>"
  },
  "planAction": [
    {
      "priorite": "<urgent|cette_semaine|surveiller>",
      "action": "<action concrète et actionnable>"
    }
  ],
  "kpis": {
    "tauxOrganiqueMoyen": "<x%>",
    "ctrMoyen": "<x%>",
    "cpcMoyen": "<x€>",
    "cpmMoyen": "<x€>",
    "roiActuel": "x${roi}",
    "roiRecommande": "<projection si recommandations suivies>"
  }
}`

  try {
    const text = await callGroqAI(prompt)
    const cleaned = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()
    const parsed: MetaAnalysisResult = JSON.parse(cleaned)

    return {
      ...parsed,
      pageNom: data.pageNom,
      generatedAt: new Date().toISOString()
    }
  } catch (e: any) {
    console.error('[Groq] Analysis error:', e.message || e)
    throw e
  }
}

/**
 * Generate a demo analysis when no API key is configured (for UI testing)
 */
export function generateDemoAnalysis(pageNom: string): MetaAnalysisResult {
  return {
    pageNom,
    score: 67,
    scoreTendance: 'hausse',
    generatedAt: new Date().toISOString(),
    resumeExecutif: `94% des vues proviennent des publicités — sans budget, la page est quasi invisible. Deux posts concentrent 92% du trafic. Le CPC de 0,04€ sur la campagne Pass Early est excellent. Le budget est très sous-utilisé à J-91 : seulement 1,8% dépensé.`,
    alertes: [
      {
        niveau: 'critique',
        titre: 'Budget sous-utilisé',
        message: 'Seulement 89€ dépensés sur 5 000€ à J-91 de l\'événement.',
        justification: '1,8% du budget consommé. Recommandé : 350€/mois minimum dès maintenant.'
      },
      {
        niveau: 'important',
        titre: 'Dépendance aux publicités',
        message: '94% des vues viennent des pubs payantes (seulement 6% organique).',
        justification: 'Travailler l\'engagement naturel avec du contenu viral (défis, Reels).'
      },
      {
        niveau: 'info',
        titre: 'Excellente campagne Pass Early',
        message: 'CPC de 0,04€ — 15x moins cher que la moyenne Meta.',
        justification: '634 clics pour 25€ dépensés. À maintenir absolument.'
      }
    ],
    postsAnalyses: [
      {
        postId: 'demo1',
        message: 'JAPAN OTAKU FESTIVAL (Reel)',
        action: 'LAISSER_TOURNER',
        actionLabel: '🟢 Laisser tourner',
        priorite: 'haute',
        justification: '82 545 vues totales, 531 clics lien. CPC estimé 0,15€.',
        budgetSugere: null
      },
      {
        postId: 'demo2',
        message: 'L\'ÉVÉNEMENT MANGA À NE PAS RATER',
        action: 'SURVEILLER',
        actionLabel: '🟡 Surveiller J+8',
        priorite: 'moyenne',
        justification: '45 794 vues, fort engagement mais faible conversion. Réévaluer dans 8 jours.',
        budgetSugere: null
      }
    ],
    budgetReallocation: [
      { postMessage: 'Japan Otaku Festival (Reel)', action: 'BOOST', montant: 150, justification: '531 clics, CPC excellent.' },
      { postMessage: 'Pass Early Access', action: 'KEEP', montant: 25, justification: 'CPC de 0,04€ — exceptionnel.' }
    ],
    audienceAlerts: [
      {
        type: 'autre',
        niveau: 'info',
        message: 'Communauté très jeune (74 followers FB)',
        justification: 'La page est récente. Croissance prioritaire en parallèle des pubs.'
      }
    ],
    contentIntel: {
      formatGagnant: 'Reel',
      meilleurHoraire: '21h00 - 22h00',
      themeGagnant: 'Japan Otaku Festival (branding direct)',
      recommandation: 'Créer des Reels de 15-30s avec le branding visible dès les 3 premières secondes.'
    },
    planAction: [
      { priorite: 'urgent', action: 'Augmenter le budget Pass Early Access — CPC de 0,04€ exceptionnel' },
      { priorite: 'cette_semaine', action: 'Créer un nouveau Reel Japan Otaku Festival (budget 80-100€)' },
      { priorite: 'surveiller', action: 'Réévaluer le taux de conversion "L\'Événement Manga" le 15 juin' }
    ],
    kpis: {
      tauxOrganiqueMoyen: '6%',
      ctrMoyen: '0.64%',
      cpcMoyen: '0.15€',
      cpmMoyen: '8.20€',
      roiActuel: 'x7.6',
      roiRecommande: 'x12+ si budget exploité correctement'
    }
  }
}
