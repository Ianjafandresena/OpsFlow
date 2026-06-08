/**
 * POST /api/meta/analyse
 * Triggers Gemini AI analysis on the synced Meta + Sheets data
 */

import { analyzeMetaPage, generateDemoAnalysis } from '~/server/utils/geminiMeta'
import { formatSheetForAI } from '~/server/utils/sheetsApi'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const {
    pageNom,
    pageId,
    followers = { fb: 0, ig: 0 },
    periode = 'Derniers 30 jours',
    joursAvantEvenement = 90,
    posts = [],
    adInsights = [],
    budgetInfo = { total: 5000, depense: 0, revenusBilletterie: 0, revenusExposants: 0 },
    sheetData = {}
  } = body

  if (!pageNom) {
    throw createError({ statusCode: 400, statusMessage: 'pageNom is required' })
  }

  const hasAIKey = !!(process.env.GROQ_API_KEY)

  if (!hasAIKey) {
    // Return demo analysis for UI testing
    console.info('[Meta/Analyse] No Groq key — returning demo analysis')
    const demo = generateDemoAnalysis(pageNom)
    return { success: true, analysis: demo, isDemo: true }
  }

  // Format sheet data as text for AI
  const sheetText = typeof sheetData === 'string'
    ? sheetData
    : formatSheetForAI(sheetData?.rawRows || [])

  try {
    const analysis = await analyzeMetaPage({
      pageNom,
      pageId: pageId || '',
      followers,
      periode,
      joursAvantEvenement,
      posts,
      adInsights,
      budgetInfo,
      sheetData: sheetText
    })

    if (!analysis) {
      console.error('[Meta/Analyse] Groq API returned null.')
      return { success: false, error: 'Échec de l\'analyse par l\'IA Groq. Le modèle n\'a pas pu générer une réponse valide.' }
    }

    return { success: true, analysis, isDemo: false }
  } catch (e: any) {
    console.error('[Meta/Analyse] Groq API error:', e.message)
    return { success: false, error: `Échec de l\'analyse Groq: ${e.message}` }
  }
})
