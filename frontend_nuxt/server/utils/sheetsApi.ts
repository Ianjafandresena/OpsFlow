/**
 * Google Sheets API Client — Public CSV Export (no auth required)
 * Reads the Meta Ads budget tracking spreadsheet via public CSV export
 *
 * PREREQUISITE: The spreadsheet must be shared as "Anyone with the link can view"
 * Structure per sheet tab (each city):
 *   Row 4: col B = "BUDGET", col C = budget amount
 *   Row 5: col B = "DÉPENSER", col C = total spent
 *   Row 6: col B = "TIKTOK", col C = TikTok budget
 *   Row 2: col I = "Billeterie", col K = billing revenue
 *   Row 3: col I = "Exposant", col K = exhibitor revenue
 */

import https from 'node:https'

const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1rBsGl0vcDxE7n33Pi_F6RVSymG6pFcYL1re5jrGPmRk'

/**
 * Map city names to their sheet tab names (partial match)
 */
const CITY_TO_TAB_KEYWORDS: Record<string, string[]> = {
  bordeaux: ['bordeaux', 'Bordeaux'],
  metz: ['metz', 'Metz'],
  evreux: ['evreux', 'vreux', 'Evreux'],
  nevers: ['nevers', 'Nevers'],
}

/**
 * Fetch a sheet tab as CSV text
 */
function fetchSheetCSV(sheetName: string, range?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const encodedSheet = encodeURIComponent(sheetName)
    let path = `/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodedSheet}`
    if (range) path += `&range=${encodeURIComponent(range)}`

    const options = {
      hostname: 'docs.google.com',
      path,
      method: 'GET',
      headers: { 'Accept': 'text/csv' }
    }

    const req = https.request(options, (res) => {
      // Follow redirect if needed
      if (res.statusCode === 302 || res.statusCode === 301) {
        reject(new Error(`Redirect — sheet may not be public. Status: ${res.statusCode}`))
        return
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} — sheet may not be public`))
        return
      }

      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => resolve(data))
    })

    req.on('error', reject)
    req.end()
  })
}

/**
 * Parse CSV text into rows (handles quoted fields with commas)
 */
function parseCSV(csv: string): string[][] {
  const rows: string[][] = []
  const lines = csv.split('\n')

  for (const line of lines) {
    if (!line.trim()) continue
    const cells: string[] = []
    let inQuote = false
    let cell = ''

    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        if (inQuote && line[i + 1] === '"') { cell += '"'; i++ }
        else inQuote = !inQuote
      } else if (ch === ',' && !inQuote) {
        cells.push(cell.trim())
        cell = ''
      } else {
        cell += ch
      }
    }
    cells.push(cell.trim())
    rows.push(cells)
  }

  return rows
}

/**
 * Parse a numeric value from a cell string (handles €, spaces, commas)
 */
function parseNum(val: string): number {
  if (!val) return 0
  const cleaned = val.replace(/[€\s\u00a0]/g, '').replace(',', '.')
  const n = parseFloat(cleaned)
  return isNaN(n) ? 0 : n
}

/**
 * Parse the budget data from a city tab's rows
 * Returns { budget, depense, tiktok, revenusBilletterie, revenusExposants }
 */
function parseCityBudget(rows: string[][]): Record<string, number> {
  const result = {
    budget: 0,
    depense: 0,
    tiktok: 0,
    revenusBilletterie: 0,
    revenusExposants: 0,
  }

  for (let i = 0; i < Math.min(rows.length, 100); i++) {
    const row = rows[i]
    if (!row) continue

    const colB = row[1]?.toLowerCase().replace(/\s/g, '') || ''
    const colC = row[2] || ''

    // Budget total (col B = "BUDGET", col C = value)
    if (colB.includes('budget') && !colB.includes('pass') && !colB.includes('abdel')) {
      const v = parseNum(colC)
      if (v > 0) result.budget = v
    }

    // Dépensé (col B = "DÉPENSER", col C = value)
    if (colB.includes('penser') || colB.includes('pens')) {
      const v = parseNum(colC)
      if (v > 0) result.depense = v
    }

    // TikTok budget (col B = "TIKTOK")
    if (colB.includes('tiktok')) {
      const v = parseNum(colC)
      if (v > 0) result.tiktok = v
    }

    // Revenue Billetterie (col G = "Billeterie|Billetterie", col H = amount)
    const colG = row[6]?.toLowerCase() || ''
    const colH = row[7] || ''
    if ((colG.includes('billeterie') || colG.includes('billetterie')) && colH) {
      const v = parseNum(colH)
      if (v > 0) result.revenusBilletterie = v
    }

    // Revenue Exposants (col G = "Exposant", col H = amount)
    if (colG.includes('exposant') && colH) {
      const v = parseNum(colH)
      if (v > 0) result.revenusExposants = v
    }

    // Hard fallback for H2 and H3 as explicitly requested
    if (i === 1 && result.revenusBilletterie === 0) { // Row 2 (Excel), Col H
      const v = parseNum(colH)
      if (v > 0) result.revenusBilletterie = v
    }
    if (i === 2 && result.revenusExposants === 0) { // Row 3 (Excel), Col H
      const v = parseNum(colH)
      if (v > 0) result.revenusExposants = v
    }
  }

  return result
}

/**
 * Fetch budget data for a specific city from the tracking sheet
 */
export async function fetchCityBudgetData(cityName: string): Promise<{
  found: boolean
  tabName?: string
  budget: number
  depense: number
  tiktok: number
  revenusBilletterie: number
  revenusExposants: number
  rawSummary: string
} | null> {
  const keywords = CITY_TO_TAB_KEYWORDS[cityName.toLowerCase()]
    ?? [cityName.toLowerCase()]

  // Known tab names for our events
  const knownTabs: Record<string, string> = {
    bordeaux: '🟥  Bordeaux - 5 &  6 sept',
    metz: '🟥  Metz- 26 &  27 sept',
    evreux: '🟥  Evreux - 17 &  18 oct',
    nevers: '🟥  Nevers - 03 &  04 oct',
  }

  const tabName = knownTabs[cityName.toLowerCase()]
  if (!tabName) {
    console.warn(`[SheetsAPI] No known tab for city: ${cityName}`)
    return null
  }

  try {
    console.info(`[SheetsAPI] Fetching tab: "${tabName}"`)
    const csv = await fetchSheetCSV(tabName)
    const rows = parseCSV(csv)

    // Second fetch to get the revenue cells explicitly (Google Sheets CSV export bug workaround)
    let revenusBilletterie = 0
    let revenusExposants = 0
    try {
      const revenueCsv = await fetchSheetCSV(tabName, 'G1:H5')
      const revRows = parseCSV(revenueCsv)
      for (const r of revRows) {
        if (!r || r.length < 2) continue
        const label = (r[0] || '').toLowerCase()
        const val = parseNum(r[1])
        if (label.includes('billeterie') || label.includes('billetterie')) revenusBilletterie = val
        if (label.includes('exposant')) revenusExposants = val
      }
    } catch(e) {
      console.warn('[SheetsAPI] Failed to fetch revenue range:', e)
    }

    if (rows.length < 3) {
      console.warn(`[SheetsAPI] Tab ${tabName} has too few rows`)
      return { found: false, budget: 0, depense: 0, tiktok: 0, revenusBilletterie: 0, revenusExposants: 0, rawSummary: '' }
    }

    const budget = parseCityBudget(rows)
    // Override with the specific range values if found
    if (revenusBilletterie > 0) budget.revenusBilletterie = revenusBilletterie
    if (revenusExposants > 0) budget.revenusExposants = revenusExposants

    const rawSummary = `SUIVI BUDGET ${cityName.toUpperCase()} :
- Budget Meta Ads total : ${budget.budget}€
- Dépensé à ce jour : ${budget.depense}€ (${budget.budget > 0 ? ((budget.depense / budget.budget) * 100).toFixed(1) : 0}%)
- Budget TikTok : ${budget.tiktok}€
- Revenus Billetterie : ${budget.revenusBilletterie}€
- Revenus Exposants : ${budget.revenusExposants}€
- ROI actuel : x${budget.depense > 0 ? (((budget.revenusBilletterie + budget.revenusExposants) / budget.depense).toFixed(1)) : 'N/A'}`

    console.info(`[SheetsAPI] ${cityName}: Budget=${budget.budget}€, Dépensé=${budget.depense}€`)
    return { found: true, tabName, ...budget, rawSummary }

  } catch (e: any) {
    console.error(`[SheetsAPI] Error fetching tab "${tabName}":`, e.message)
    if (e.message?.includes('public') || e.message?.includes('Redirect')) {
      console.error('[SheetsAPI] ⚠️  Make sure the sheet is shared as "Anyone with the link can view"')
    }
    return null
  }
}

/**
 * Fetch all cities budget data
 */
export async function fetchAllBudgetData(): Promise<Record<string, any>> {
  const cities = ['bordeaux', 'metz', 'evreux']
  const result: Record<string, any> = {}

  for (const city of cities) {
    try {
      const data = await fetchCityBudgetData(city)
      if (data) result[city] = data
    } catch (e) {
      console.error(`[SheetsAPI] Failed to fetch ${city}:`, e)
    }
  }

  return result
}

/**
 * Legacy: Format sheet rows as text for AI consumption
 */
export function formatSheetForAI(rows: string[][]): string {
  if (!rows || rows.length === 0) return 'Aucune donnée disponible.'
  return rows.slice(0, 20).map(row => row.filter(Boolean).join(' | ')).join('\n')
}
