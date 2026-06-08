import { google } from 'googleapis';

function getAuth() {
  var _a;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = (_a = process.env.GOOGLE_PRIVATE_KEY) == null ? void 0 : _a.replace(/\\n/g, "\n");
  if (!email || !key) return null;
  return new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
  });
}
const SHEET_ID = process.env.GOOGLE_SHEET_ID || "1rBsGl0vcDxE7n33Pi_F6RVSymG6pFcYL1re5jrGPmRk";
async function fetchSheetNames() {
  const auth = getAuth();
  if (!auth) return [];
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    return (meta.data.sheets || []).map((s) => {
      var _a;
      return ((_a = s.properties) == null ? void 0 : _a.title) || "";
    });
  } catch (e) {
    console.error("[SheetsAPI] fetchSheetNames error:", e);
    return [];
  }
}
async function fetchSheetTab(tabName, range = "A:Z") {
  const auth = getAuth();
  if (!auth) return [];
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${tabName}!${range}`
    });
    return res.data.values || [];
  } catch (e) {
    console.error(`[SheetsAPI] fetchSheetTab(${tabName}) error:`, e);
    return [];
  }
}
async function fetchAllBudgetData() {
  const sheetNames = await fetchSheetNames();
  const result = {};
  for (const tabName of sheetNames) {
    try {
      const rows = await fetchSheetTab(tabName);
      result[tabName] = { rows, rowCount: rows.length };
    } catch (e) {
      console.error(`[SheetsAPI] Error reading tab ${tabName}:`, e);
    }
  }
  return result;
}
function formatSheetForAI(rows) {
  if (!rows || rows.length === 0) return "Aucune donn\xE9e disponible.";
  return rows.map((row) => row.join(" | ")).join("\n");
}

export { formatSheetForAI as a, fetchAllBudgetData as f };
//# sourceMappingURL=sheetsApi.mjs.map
