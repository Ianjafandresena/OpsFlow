/**
 * Meta Graph API Client
 * Fetches page posts (organic + sponsored) and ad campaign insights
 */

const META_API_VERSION = 'v19.0'
const META_BASE = `https://graph.facebook.com/${META_API_VERSION}`

function getUserToken() {
  return process.env.META_SYSTEM_TOKEN || process.env.META_ACCESS_TOKEN || ''
}

// Cache page tokens to avoid repeated calls
const pageTokenCache: Record<string, string> = {}

/**
 * Get a Page Access Token for a given pageId.
 * Page tokens are required for post insights (impressions, reach, etc.)
 */
async function getPageToken(pageId: string): Promise<string> {
  if (pageTokenCache[pageId]) return pageTokenCache[pageId]

  const userToken = getUserToken()
  if (!userToken) return ''

  try {
    const url = `${META_BASE}/me/accounts?access_token=${userToken}`
    const res = await fetch(url)
    const json = await res.json()

    if (json.error) {
      console.error('[MetaAPI] Accounts error:', json.error)
      return userToken // fallback to user token
    }

    const page = (json.data || []).find((p: any) => p.id === pageId)
    if (page?.access_token) {
      pageTokenCache[pageId] = page.access_token
      console.info(`[MetaAPI] Got page token for ${pageId} (${page.name})`)
      return page.access_token
    }

    console.warn(`[MetaAPI] Page ${pageId} not found in accounts, using user token`)
    return userToken
  } catch (e) {
    console.error('[MetaAPI] getPageToken error:', e)
    return userToken
  }
}

/**
 * Fetch all posts of a page with their organic insights
 */
export async function fetchPagePosts(pageId: string): Promise<any[]> {
  const token = await getPageToken(pageId)
  if (!token) return []

  const fields = [
    'id', 'message', 'story', 'created_time', 'full_picture', 'permalink_url',
    'insights.metric(post_impressions_unique,post_impressions_paid_unique,post_impressions_organic_unique,post_clicks_by_type,post_video_views,post_reactions_by_type_total)'
  ].join(',')

  const url = `${META_BASE}/${pageId}/posts?fields=${encodeURIComponent(fields)}&access_token=${token}&limit=50`

  try {
    const res = await fetch(url)
    const json = await res.json()
    if (json.error) {
      console.error('[MetaAPI] Posts error:', json.error)
      return []
    }
    return json.data || []
  } catch (e) {
    console.error('[MetaAPI] Fetch error:', e)
    return []
  }
}

/**
 * Fetch page insights (global stats: followers, reach, etc.)
 */
export async function fetchPageInsights(pageId: string): Promise<any> {
  const token = await getPageToken(pageId)
  if (!token) return {}

  const metrics = [
    'page_fans', 'page_impressions', 'page_impressions_organic',
    'page_impressions_paid', 'page_reach', 'page_post_engagements'
  ].join(',')

  const url = `${META_BASE}/${pageId}/insights?metric=${metrics}&period=month&access_token=${token}`

  try {
    const res = await fetch(url)
    const json = await res.json()
    if (json.error) {
      console.error('[MetaAPI] Insights error:', json.error)
      return {}
    }
    // Transform to flat object
    const result: Record<string, any> = {}
    for (const item of json.data || []) {
      result[item.name] = item.values?.[item.values.length - 1]?.value ?? 0
    }
    return result
  } catch (e) {
    console.error('[MetaAPI] Insights error:', e)
    return {}
  }
}

/**
 * Fetch page info (name, followers, etc.)
 */
export async function fetchPageInfo(pageId: string): Promise<any> {
  const token = await getPageToken(pageId)
  if (!token) return {}

  const url = `${META_BASE}/${pageId}?fields=name,fan_count,followers_count,category&access_token=${token}`

  try {
    const res = await fetch(url)
    const json = await res.json()
    if (json.error) {
      console.error('[MetaAPI] Page info error:', json.error)
      return {}
    }
    return json
  } catch (e) {
    console.error('[MetaAPI] Page info error:', e)
    return {}
  }
}

/**
 * Fetch ad campaigns for an ad account
 */
export async function fetchAdCampaigns(adAccountId: string): Promise<any[]> {
  const token = getUserToken()
  if (!token) return []

  const fields = 'name,status,daily_budget,lifetime_budget,start_time,stop_time,objective'
  const url = `${META_BASE}/${adAccountId}/campaigns?fields=${fields}&access_token=${token}`

  try {
    const res = await fetch(url)
    const json = await res.json()
    if (json.error) {
      console.error('[MetaAPI] Campaigns error:', json.error)
      return []
    }
    return json.data || []
  } catch (e) {
    console.error('[MetaAPI] Campaigns error:', e)
    return []
  }
}

/**
 * Fetch ad account insights (spend, impressions, reach, CTR, CPC...)
 */
export async function fetchAdInsights(adAccountId: string, datePreset = 'last_30d'): Promise<any[]> {
  const token = getToken()
  if (!token) return []

  const fields = [
    'campaign_name', 'adset_name', 'ad_name', 'spend',
    'impressions', 'reach', 'clicks', 'ctr', 'cpm', 'cpc',
    'frequency', 'actions', 'date_start', 'date_stop'
  ].join(',')

  const url = `${META_BASE}/${adAccountId}/insights?fields=${fields}&date_preset=${datePreset}&level=campaign&access_token=${token}`

  try {
    const res = await fetch(url)
    const json = await res.json()
    if (json.error) {
      console.error('[MetaAPI] Ad insights error:', json.error)
      return []
    }
    return json.data || []
  } catch (e) {
    console.error('[MetaAPI] Ad insights error:', e)
    return []
  }
}

/**
 * Get all pages the token has access to
 */
export async function fetchMyPages(): Promise<any[]> {
  const token = getToken()
  if (!token) return []

  const url = `${META_BASE}/me/accounts?fields=id,name,fan_count,access_token&access_token=${token}`

  try {
    const res = await fetch(url)
    const json = await res.json()
    if (json.error) {
      console.error('[MetaAPI] My pages error:', json.error)
      return []
    }
    return json.data || []
  } catch (e) {
    console.error('[MetaAPI] My pages error:', e)
    return []
  }
}

/**
 * Normalize post data into a standardized format for analysis
 */
export function normalizePost(post: any) {
  const insights: Record<string, number> = {}
  for (const metric of post.insights?.data || []) {
    insights[metric.name] = metric.values?.[0]?.value ?? 0
  }

  const totalViews = insights.post_impressions_unique ?? 0
  const paidViews = insights.post_impressions_paid_unique ?? 0
  const organicViews = insights.post_impressions_organic_unique ?? 0
  const reach = insights.post_impressions_unique ?? 0
  const videoViews = insights.post_video_views ?? 0
  const shares = insights.post_shares ?? 0

  // Calculate engaged users by summing reactions
  const reactionsObj = insights.post_reactions_by_type_total || {}
  let engaged = 0
  if (typeof reactionsObj === 'object') {
    engaged = Object.values(reactionsObj).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0)
  } else if (typeof reactionsObj === 'number') {
    engaged = reactionsObj
  }

  // Clicks by type
  const clicksData = insights.post_clicks_by_type || {}
  let linkClicks = 0
  if (typeof clicksData === 'object') {
    linkClicks = (clicksData as any)?.link_clicks ?? 0
  }

  // Also include clicks in engaged
  engaged += linkClicks

  return {
    id: post.id,
    message: post.message || post.story || '(Sans texte)',
    createdTime: post.created_time,
    picture: post.full_picture,
    permalink: post.permalink_url,
    vuesTotal: totalViews,
    vuesPub: paidViews,
    vuesOrganique: organicViews,
    couverture: reach,
    spectateurs: engaged,
    interactions: engaged,
    partages: shares,
    clicsLien: linkClicks,
    videoViews,
    tauxEngagement: totalViews > 0 ? ((engaged / totalViews) * 100).toFixed(2) : '0',
    isSponsored: paidViews > organicViews
  }
}
