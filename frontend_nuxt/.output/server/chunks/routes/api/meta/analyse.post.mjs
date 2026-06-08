import { b as defineEventHandler, C as readBody, c as createError } from '../../../_/nitro.mjs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { a as formatSheetForAI } from '../../../_/sheetsApi.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'googleapis';

function getGenAI() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenerativeAI(key);
}
const SYSTEM_PROMPT = `Tu es un expert senior en publicit\xE9 Meta Ads et Community Management, sp\xE9cialis\xE9 dans les \xE9v\xE9nements culturels et festivals en France.

Tu analyses des donn\xE9es r\xE9elles de campagnes Meta Ads pour les pages Facebook/Instagram du Japan Otaku Festival (JOF) \u2014 un festival de culture manga/anime organis\xE9 dans plusieurs villes fran\xE7aises (Bordeaux, Metz, \xC9vreux, Nevers...).

Tes analyses doivent \xEAtre :
- OBJECTIVES : bas\xE9es uniquement sur les chiffres fournis
- EXPERTES : utiliser les vrais KPIs Meta (CTR, CPC, CPM, fr\xE9quence, taux d'engagement)
- JUSTIFI\xC9ES : chaque recommandation doit citer les m\xE9triques qui la supportent
- ACTIONNABLES : des actions concr\xE8tes, pas des g\xE9n\xE9ralit\xE9s
- CONTEXTUALIS\xC9ES : tenir compte du secteur \xE9v\xE9nementiel, de la saisonnalit\xE9 et de la date de l'\xE9v\xE9nement

Benchmarks Meta pour \xE9v\xE9nements culturels en France :
- CTR moyen : 0.5% - 1.5% (bon > 1%, excellent > 2%)
- CPC moyen : 0.50\u20AC - 1.50\u20AC (bon < 0.80\u20AC, excellent < 0.40\u20AC)
- CPM moyen : 5\u20AC - 12\u20AC
- Taux d'engagement : 1% - 3% (bon > 2%, excellent > 5%)
- Fr\xE9quence : garder < 3 (sinon banni\xE8re aveugle)

Actions possibles pour chaque post :
- LAISSER_TOURNER : performe bien, ne pas toucher
- BOOSTER : potentiel organique fort, m\xE9rite du budget
- SURVEILLER : trop t\xF4t pour juger, r\xE9\xE9valuer dans X jours
- ARRETER : mauvais retour sur investissement, gaspillage
- MODIFIER_CIBLAGE : bon contenu mais mauvaise audience cibl\xE9e
- OPTIMISER : modifier l'accroche, le CTA ou le visuel`;
async function analyzeMetaPage(data) {
  const genAI = getGenAI();
  if (!genAI) {
    console.warn("[Gemini] No API key configured");
    return null;
  }
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const roi = data.budgetInfo.depense > 0 ? ((data.budgetInfo.revenusBilletterie + data.budgetInfo.revenusExposants) / data.budgetInfo.depense).toFixed(1) : "N/A";
  const postsText = data.posts.map(
    (p, i) => {
      var _a;
      return `Post #${i + 1}: "${((_a = p.message) == null ? void 0 : _a.slice(0, 80)) || "Sans texte"}"
    - Date: ${p.createdTime}
    - Vues Total: ${p.vuesTotal} | Vues Pay\xE9es: ${p.vuesPub} | Vues Organiques: ${p.vuesOrganique}
    - Couverture: ${p.couverture} | Spectateurs: ${p.spectateurs}
    - Interactions: ${p.interactions} | Partages: ${p.partages} | Clics Lien: ${p.clicsLien}
    - Taux d'engagement: ${p.tauxEngagement}%
    - Sponsoris\xE9: ${p.isSponsored ? "Oui" : "Non (organique)"}`;
    }
  ).join("\n\n");
  const adsText = data.adInsights.length > 0 ? data.adInsights.map(
    (ad) => `Campagne "${ad.campaign_name}": D\xE9pense=${ad.spend}\u20AC, Impressions=${ad.impressions}, Clics=${ad.clicks}, CTR=${ad.ctr}%, CPC=${ad.cpc}\u20AC, CPM=${ad.cpm}\u20AC`
  ).join("\n") : "Aucune donn\xE9e publicitaire disponible.";
  const prompt = `${SYSTEM_PROMPT}

---

DONN\xC9ES DE LA PAGE : ${data.pageNom}
P\xE9riode d'analyse : ${data.periode}
Jours avant l'\xE9v\xE9nement : J-${data.joursAvantEvenement}
Followers : FB ${data.followers.fb} | IG ${data.followers.ig}

BUDGET & ROI :
- Budget Total : ${data.budgetInfo.total}\u20AC
- D\xE9pens\xE9 : ${data.budgetInfo.depense}\u20AC (${data.budgetInfo.total > 0 ? (data.budgetInfo.depense / data.budgetInfo.total * 100).toFixed(1) : 0}%)
- Revenus Billetterie : ${data.budgetInfo.revenusBilletterie}\u20AC
- Revenus Exposants : ${data.budgetInfo.revenusExposants}\u20AC
- ROI actuel : x${roi}

POSTS (organiques + sponsoris\xE9s) :
${postsText}

CAMPAGNES PUBLICITAIRES META :
${adsText}

DONN\xC9ES FEUILLE DE SUIVI INTERNE :
${data.sheetData || "Non disponible"}

---

Analyse ces donn\xE9es et g\xE9n\xE8re un rapport expert complet en JSON avec cette structure EXACTE :
{
  "score": <entier 0-100>,
  "scoreTendance": "<hausse|baisse|stable>",
  "resumeExecutif": "<3-4 phrases synth\xE8se expert>",
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
      "postId": "<id>",
      "message": "<80 premiers chars>",
      "action": "<LAISSER_TOURNER|BOOSTER|SURVEILLER|ARRETER|MODIFIER_CIBLAGE|OPTIMISER>",
      "actionLabel": "<libell\xE9 humain>",
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
    "formatGagnant": "<Reel|Photo|Vid\xE9o|...>",
    "meilleurHoraire": "<ex: 21h-22h>",
    "themeGagnant": "<type de contenu qui fonctionne>",
    "recommandation": "<conseil cr\xE9atif concret>"
  },
  "planAction": [
    {
      "priorite": "<urgent|cette_semaine|surveiller>",
      "action": "<action concr\xE8te et actionnable>"
    }
  ],
  "kpis": {
    "tauxOrganiqueMoyen": "<x%>",
    "ctrMoyen": "<x%>",
    "cpcMoyen": "<x\u20AC>",
    "cpmMoyen": "<x\u20AC>",
    "roiActuel": "x${roi}",
    "roiRecommande": "<projection si recommandations suivies>"
  }
}

R\xE9ponds UNIQUEMENT avec le JSON valide, sans markdown, sans explication.`;
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      ...parsed,
      pageNom: data.pageNom,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  } catch (e) {
    console.error("[Gemini] Analysis error:", e);
    return null;
  }
}
function generateDemoAnalysis(pageNom) {
  return {
    pageNom,
    score: 67,
    scoreTendance: "hausse",
    generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    resumeExecutif: `94% des vues proviennent des publicit\xE9s \u2014 sans budget, la page est quasi invisible. Deux posts concentrent 92% du trafic. Le CPC de 0,04\u20AC sur la campagne Pass Early est excellent. Le budget est tr\xE8s sous-utilis\xE9 \xE0 J-91 : seulement 1,8% d\xE9pens\xE9.`,
    alertes: [
      {
        niveau: "critique",
        titre: "Budget sous-utilis\xE9",
        message: "Seulement 89\u20AC d\xE9pens\xE9s sur 5 000\u20AC \xE0 J-91 de l'\xE9v\xE9nement.",
        justification: "1,8% du budget consomm\xE9. \xC0 ce rythme, vous atteindrez l'\xE9v\xE9nement avec un budget non exploit\xE9. Recommand\xE9 : 350\u20AC/mois minimum d\xE8s maintenant."
      },
      {
        niveau: "important",
        titre: "D\xE9pendance aux publicit\xE9s",
        message: "94% des vues viennent des pubs payantes (seulement 6% organique).",
        justification: "8 271 vues organiques vs 130 948 pay\xE9es. La communaut\xE9 organique est tr\xE8s faible. Travailler l'engagement naturel avec du contenu viral (d\xE9fis, Reels)."
      },
      {
        niveau: "info",
        titre: "Excellente campagne Pass Early",
        message: "CPC de 0,04\u20AC \u2014 15x moins cher que la moyenne Meta.",
        justification: "634 clics pour 25\u20AC d\xE9pens\xE9s. Moyenne Meta \xE9v\xE9nements : 0,50\u20AC-1,50\u20AC par clic. Cette campagne est exceptionnelle, \xE0 maintenir absolument."
      }
    ],
    postsAnalyses: [
      {
        postId: "demo1",
        message: "JAPAN OTAKU FESTIVAL (Reel)",
        action: "LAISSER_TOURNER",
        actionLabel: "\u{1F7E2} Laisser tourner",
        priorite: "haute",
        justification: "82 545 vues totales, 531 clics lien (CTR 0,64%). CPC estim\xE9 0,15\u20AC, bien en dessous de la moyenne. 25 194 spectateurs uniques engag\xE9s. Post le plus performant.",
        budgetSugere: null
      },
      {
        postId: "demo2",
        message: "L'\xC9V\xC9NEMENT MANGA \xC0 NE PAS RATER",
        action: "SURVEILLER",
        actionLabel: "\u{1F7E1} Surveiller J+8",
        priorite: "moyenne",
        justification: "45 794 vues, 39 843 en couverture unique (excellent reach). Seulement 22 clics lien cependant. Fort engagement (98 interactions) mais faible conversion. R\xE9\xE9valuer dans 8 jours.",
        budgetSugere: null
      },
      {
        postId: "demo3",
        message: "INVITATION OFFERTE POUR LES...",
        action: "ARRETER",
        actionLabel: "\u{1F534} Arr\xEAter",
        priorite: "haute",
        justification: "J+7, 0 clic lien pour 341 vues pay\xE9es. 9 interactions sur 941 vues = taux 0,9%. Le message ne convertit pas. Budget gaspill\xE9.",
        budgetSugere: null
      }
    ],
    budgetReallocation: [
      { postMessage: "Invitation Offerte", action: "STOP", montant: 0, justification: "0 clic lien en 7 jours, aucune conversion." },
      { postMessage: "Japan Otaku Festival (Reel)", action: "BOOST", montant: 150, justification: "531 clics, CPC excellent. Augmenter l'audience pour maximiser les ventes de billets." },
      { postMessage: "Pass Early Access", action: "KEEP", montant: 25, justification: "CPC de 0,04\u20AC \u2014 exceptionnel. Maintenir jusqu'\xE0 la fin." }
    ],
    audienceAlerts: [
      {
        type: "autre",
        niveau: "info",
        message: "Communaut\xE9 tr\xE8s jeune (74 followers FB)",
        justification: "La page est r\xE9cente. La croissance doit \xEAtre prioritaire en parall\xE8le des pubs de conversion."
      }
    ],
    contentIntel: {
      formatGagnant: "Reel",
      meilleurHoraire: "21h00 - 22h00",
      themeGagnant: "Japan Otaku Festival (branding direct)",
      recommandation: 'Cr\xE9er des Reels de 15-30s avec le branding "Japan Otaku Festival" visible d\xE8s les 3 premi\xE8res secondes. Publier en soir\xE9e (21h-22h). \xC9viter les posts "d\xE9fi" et "invitation" qui ne convertissent pas.'
    },
    planAction: [
      { priorite: "urgent", action: 'Arr\xEAter le boost "Invitation Offerte" \u2014 0 conversion en 7j, \xE9conomiser le budget' },
      { priorite: "urgent", action: "Augmenter le budget Pass Early Access \u2014 CPC de 0,04\u20AC exceptionnel" },
      { priorite: "cette_semaine", action: 'Cr\xE9er et booster un nouveau Reel "Japan Otaku Festival" pour Bordeaux (budget 80-100\u20AC)' },
      { priorite: "cette_semaine", action: "Viser 350\u20AC d\xE9pens\xE9s ce mois \u2014 budget dangereusement sous-utilis\xE9 \xE0 J-91" },
      { priorite: "surveiller", action: `"L'\xC9v\xE9nement Manga" \u2014 r\xE9\xE9valuer le taux de conversion le 7 juin` }
    ],
    kpis: {
      tauxOrganiqueMoyen: "6%",
      ctrMoyen: "0.64%",
      cpcMoyen: "0.15\u20AC",
      cpmMoyen: "8.20\u20AC",
      roiActuel: "x7.6",
      roiRecommande: "x12+ si budget exploit\xE9 correctement"
    }
  };
}

const analyse_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const {
    pageNom,
    pageId,
    followers = { fb: 0, ig: 0 },
    periode = "Derniers 30 jours",
    joursAvantEvenement = 90,
    posts = [],
    adInsights = [],
    budgetInfo = { total: 5e3, depense: 0, revenusBilletterie: 0, revenusExposants: 0 },
    sheetData = {}
  } = body;
  if (!pageNom) {
    throw createError({ statusCode: 400, statusMessage: "pageNom is required" });
  }
  const hasGeminiKey = !!process.env.GEMINI_API_KEY;
  if (!hasGeminiKey) {
    console.info("[Meta/Analyse] No Gemini key \u2014 returning demo analysis");
    const demo = generateDemoAnalysis(pageNom);
    return { success: true, analysis: demo, isDemo: true };
  }
  const sheetText = typeof sheetData === "string" ? sheetData : formatSheetForAI((sheetData == null ? void 0 : sheetData.rawRows) || []);
  const analysis = await analyzeMetaPage({
    pageNom,
    pageId: pageId || "",
    followers,
    periode,
    joursAvantEvenement,
    posts,
    adInsights,
    budgetInfo,
    sheetData: sheetText
  });
  if (!analysis) {
    throw createError({ statusCode: 500, statusMessage: "Gemini analysis failed. Check your GEMINI_API_KEY." });
  }
  return { success: true, analysis, isDemo: false };
});

export { analyse_post as default };
//# sourceMappingURL=analyse.post.mjs.map
