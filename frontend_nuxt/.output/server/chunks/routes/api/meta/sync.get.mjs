import { b as defineEventHandler, m as getQuery, c as createError } from '../../../_/nitro.mjs';
import { f as fetchAllBudgetData } from '../../../_/sheetsApi.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'googleapis';

const META_API_VERSION = "v19.0";
const META_BASE = `https://graph.facebook.com/${META_API_VERSION}`;
function getToken() {
  return process.env.META_SYSTEM_TOKEN || process.env.META_ACCESS_TOKEN || "";
}
async function fetchPagePosts(pageId) {
  const token = getToken();
  if (!token) return [];
  const fields = [
    "id",
    "message",
    "story",
    "created_time",
    "full_picture",
    "permalink_url",
    "insights.metric(post_impressions,post_impressions_paid,post_impressions_organic,post_reach,post_engaged_users,post_clicks_by_type,post_video_views,post_shares)"
  ].join(",");
  const url = `${META_BASE}/${pageId}/posts?fields=${encodeURIComponent(fields)}&access_token=${token}&limit=50`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (json.error) {
      console.error("[MetaAPI] Posts error:", json.error);
      return [];
    }
    return json.data || [];
  } catch (e) {
    console.error("[MetaAPI] Fetch error:", e);
    return [];
  }
}
async function fetchPageInfo(pageId) {
  const token = getToken();
  if (!token) return {};
  const url = `${META_BASE}/${pageId}?fields=name,fan_count,followers_count,category&access_token=${token}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (json.error) {
      console.error("[MetaAPI] Page info error:", json.error);
      return {};
    }
    return json;
  } catch (e) {
    console.error("[MetaAPI] Page info error:", e);
    return {};
  }
}
async function fetchAdInsights(adAccountId, datePreset = "last_30d") {
  const token = getToken();
  if (!token) return [];
  const fields = [
    "campaign_name",
    "adset_name",
    "ad_name",
    "spend",
    "impressions",
    "reach",
    "clicks",
    "ctr",
    "cpm",
    "cpc",
    "frequency",
    "actions",
    "date_start",
    "date_stop"
  ].join(",");
  const url = `${META_BASE}/${adAccountId}/insights?fields=${fields}&date_preset=${datePreset}&level=campaign&access_token=${token}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (json.error) {
      console.error("[MetaAPI] Ad insights error:", json.error);
      return [];
    }
    return json.data || [];
  } catch (e) {
    console.error("[MetaAPI] Ad insights error:", e);
    return [];
  }
}
function normalizePost(post) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  const insights = {};
  for (const metric of ((_a = post.insights) == null ? void 0 : _a.data) || []) {
    insights[metric.name] = (_d = (_c = (_b = metric.values) == null ? void 0 : _b[0]) == null ? void 0 : _c.value) != null ? _d : 0;
  }
  const totalViews = (_e = insights.post_impressions) != null ? _e : 0;
  const paidViews = (_f = insights.post_impressions_paid) != null ? _f : 0;
  const organicViews = (_g = insights.post_impressions_organic) != null ? _g : 0;
  const reach = (_h = insights.post_reach) != null ? _h : 0;
  const engaged = (_i = insights.post_engaged_users) != null ? _i : 0;
  const shares = (_j = insights.post_shares) != null ? _j : 0;
  const videoViews = (_k = insights.post_video_views) != null ? _k : 0;
  const clicksData = insights.post_clicks_by_type || {};
  const linkClicks = (_l = clicksData == null ? void 0 : clicksData.link_clicks) != null ? _l : 0;
  return {
    id: post.id,
    message: post.message || post.story || "(Sans texte)",
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
    tauxEngagement: totalViews > 0 ? (engaged / totalViews * 100).toFixed(2) : "0",
    isSponsored: paidViews > organicViews
  };
}

const sync_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const pageId = query.pageId;
  const adAccountId = query.adAccountId;
  if (!pageId) {
    throw createError({ statusCode: 400, statusMessage: "pageId is required" });
  }
  const hasMetaToken = !!(process.env.META_SYSTEM_TOKEN || process.env.META_ACCESS_TOKEN);
  const hasSheetsAuth = !!(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY);
  let posts = [];
  let pageInfo = {};
  let adInsights = [];
  if (hasMetaToken) {
    const [rawPosts, info, ads] = await Promise.all([
      fetchPagePosts(pageId),
      fetchPageInfo(pageId),
      adAccountId ? fetchAdInsights(adAccountId) : Promise.resolve([])
    ]);
    posts = rawPosts.map(normalizePost).sort((a, b) => b.vuesTotal - a.vuesTotal);
    pageInfo = info;
    adInsights = ads;
  }
  let sheetData = {};
  if (hasSheetsAuth) {
    sheetData = await fetchAllBudgetData();
  }
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
      syncedAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  };
});

export { sync_get as default };
//# sourceMappingURL=sync.get.mjs.map
