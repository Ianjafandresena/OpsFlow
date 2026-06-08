/**
 * GET /api/meta/sync
 * Aggregates real-time data from Meta API + Google Sheets for a given page
 */

import { fetchPagePosts, fetchPageInsights, fetchPageInfo, fetchAdInsights, normalizePost } from '~/server/utils/metaApi'
import { fetchAllBudgetData, formatSheetForAI } from '~/server/utils/sheetsApi'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const pageId = query.pageId as string
  const adAccountId = query.adAccountId as string | undefined

  if (!pageId) {
    throw createError({ statusCode: 400, statusMessage: 'pageId is required' })
  }

  // Check if Meta API is configured
  const hasMetaToken = !!(process.env.META_SYSTEM_TOKEN || process.env.META_ACCESS_TOKEN)
  const hasSheetsAuth = !!(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY)

  // Fetch Meta data (if token available)
  let posts: any[] = []
  let pageInfo: any = {}
  let adInsights: any[] = []

  if (hasMetaToken) {
    const [rawPosts, info, ads] = await Promise.all([
      fetchPagePosts(pageId),
      fetchPageInfo(pageId),
      adAccountId ? fetchAdInsights(adAccountId) : Promise.resolve([])
    ])

    posts = rawPosts.map(normalizePost).sort((a, b) => b.vuesTotal - a.vuesTotal)
    pageInfo = info
    adInsights = ads
  }

  // Fetch Google Sheets data (no auth required for public sheet)
  let sheetData: Record<string, any> = {}
  sheetData = await fetchAllBudgetData()

  return {
    pageId,
    pageInfo,
    posts,
    adInsights,
    sheetData,
    meta: {
      hasMetaToken,
      hasSheetsAuth,
      postsCount: posts.length,
      syncedAt: new Date().toISOString()
    }
  }
})
