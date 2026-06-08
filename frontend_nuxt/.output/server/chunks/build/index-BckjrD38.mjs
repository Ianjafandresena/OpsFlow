import { withAsyncContext, computed, ref, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrIncludeBooleanAttr, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrLooseContain, ssrLooseEqual, ssrRenderAttr } from 'vue/server-renderer';
import { RefreshCw, Sparkles, AlertTriangle, Euro, TrendingDown, Wallet, TrendingUp, Info, Download, Users, Calendar, CheckSquare, Eye } from 'lucide-vue-next';
import { u as useFetch } from './fetch-BEwQ1c2o.mjs';
import { a as _export_sfc } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@vue/shared';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: editions } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/editions",
      "$bkDqPBfdOx"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const PAGE_COLORS = ["#1877f2", "#7c3aed", "#0891b2", "#059669", "#d97706", "#e11d48"];
    const pages = computed(() => {
      if (!editions.value) return [];
      return editions.value.map((ed, i) => {
        var _a, _b, _c;
        return {
          id: ed.id,
          metaPageId: ed.metaPageId || "",
          sigle: ((_a = ed.licence) == null ? void 0 : _a.sigle) || "?",
          nom: `${((_b = ed.licence) == null ? void 0 : _b.sigle) || ""} ${((_c = ed.ville) == null ? void 0 : _c.nom_ville) || ""}`.trim(),
          color: PAGE_COLORS[i % PAGE_COLORS.length]
        };
      });
    });
    const activePageId = ref(null);
    watch(pages, (val) => {
      if (val.length && !activePageId.value) activePageId.value = val[0].id;
    }, { immediate: true });
    computed(() => pages.value.find((p) => p.id === activePageId.value));
    const syncing = ref(false);
    const syncDone = ref(true);
    const analyzing = ref(false);
    const isDemo = ref(false);
    const analyzingStep = ref("Connexion \xE0 l'agent IA...");
    const syncResult = ref(null);
    const analysisResult = ref(null);
    const pageAnalyses = ref({});
    const filterAction = ref("");
    const openJustifs = ref([]);
    const showSetupBanner = ref(true);
    const activePagePosts = computed(() => {
      var _a;
      return ((_a = analysisResult.value) == null ? void 0 : _a.postsAnalyses) || [];
    });
    const filteredPosts = computed(() => {
      if (!filterAction.value) return activePagePosts.value;
      return activePagePosts.value.filter((p) => p.action === filterAction.value);
    });
    const urgentActions = computed(() => {
      var _a, _b;
      return ((_b = (_a = analysisResult.value) == null ? void 0 : _a.planAction) == null ? void 0 : _b.filter((a) => a.priorite === "urgent")) || [];
    });
    const weekActions = computed(() => {
      var _a, _b;
      return ((_b = (_a = analysisResult.value) == null ? void 0 : _a.planAction) == null ? void 0 : _b.filter((a) => a.priorite === "cette_semaine")) || [];
    });
    const watchActions = computed(() => {
      var _a, _b;
      return ((_b = (_a = analysisResult.value) == null ? void 0 : _a.planAction) == null ? void 0 : _b.filter((a) => a.priorite === "surveiller")) || [];
    });
    const budgetInfo = ref({ total: 5e3, depense: 89.05, revenusBilletterie: 244.02, revenusExposants: 431.45 });
    const formatDate = (d) => d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "\u2014";
    const formatNum = (n) => n != null ? Number(n).toLocaleString("fr-FR") : "\u2014";
    const alerteEmoji = (n) => n === "critique" ? "\u{1F534}" : n === "important" ? "\u{1F7E1}" : "\u{1F7E2}";
    const scoreText = (s) => s >= 80 ? "Excellent" : s >= 65 ? "Bon" : s >= 50 ? "Moyen" : "Faible";
    const scoreTextColor = (s) => s >= 80 ? "var(--status-success)" : s >= 65 ? "#f59e0b" : s >= 50 ? "var(--text-primary)" : "var(--status-danger)";
    const scoreColor = (s) => ({ color: scoreTextColor(s), fontSize: "0.65rem", fontWeight: 700, marginLeft: "auto", flexShrink: 0 });
    const scoreRingStyle = (s) => {
      const color = s >= 80 ? "var(--status-success)" : s >= 65 ? "#f59e0b" : s >= 50 ? "var(--accent-primary)" : "var(--status-danger)";
      const pct = s / 100 * 283;
      return {
        "--score-color": color,
        "--score-pct": pct + "px"
      };
    };
    const engagementColor = (v) => {
      const n = parseFloat(v);
      if (isNaN(n)) return "var(--text-muted)";
      return n >= 3 ? "var(--status-success)" : n >= 1 ? "#f59e0b" : "var(--status-danger)";
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "animate-fade-in" }, _attrs))} data-v-44022172><div class="page-header" style="${ssrRenderStyle({ "margin-bottom": "1.5rem" })}" data-v-44022172><div data-v-44022172><h1 class="page-title" style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "0.625rem" })}" data-v-44022172><span class="meta-logo-badge" data-v-44022172>f</span> Analyse Campagnes Meta Ads </h1><p class="page-subtitle" style="${ssrRenderStyle({ "margin-bottom": "0" })}" data-v-44022172>Analyse en temps r\xE9el \u2014 Organique + Sponsoris\xE9 \u2014 Toutes pages</p></div><div style="${ssrRenderStyle({ "display": "flex", "gap": "0.625rem", "align-items": "center" })}" data-v-44022172>`);
      if (isDemo.value) {
        _push(`<span class="badge" style="${ssrRenderStyle({ "background": "#f59e0b20", "color": "#f59e0b", "font-size": "0.7rem", "border": "1px solid #f59e0b" })}" data-v-44022172>MODE D\xC9MO</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="btn btn-secondary"${ssrIncludeBooleanAttr(syncing.value) ? " disabled" : ""} data-v-44022172>`);
      _push(ssrRenderComponent(unref(RefreshCw), {
        size: 14,
        class: syncing.value ? "spin" : ""
      }, null, _parent));
      _push(` Synchroniser </button><button class="btn btn-primary"${ssrIncludeBooleanAttr(analyzing.value || !syncDone.value) ? " disabled" : ""} data-v-44022172>`);
      _push(ssrRenderComponent(unref(Sparkles), {
        size: 14,
        class: analyzing.value ? "spin" : ""
      }, null, _parent));
      _push(` ${ssrInterpolate(analyzing.value ? "Analyse en cours..." : "Analyser avec l'IA")}</button></div></div><div class="meta-tabs-bar" data-v-44022172><!--[-->`);
      ssrRenderList(pages.value, (page) => {
        var _a2, _b2;
        _push(`<button class="${ssrRenderClass([{ "meta-tab-active": activePageId.value === page.id }, "meta-tab"])}" data-v-44022172><span class="meta-tab-badge" style="${ssrRenderStyle({ background: page.color + "20", color: page.color })}" data-v-44022172>${ssrInterpolate(page.sigle)}</span> ${ssrInterpolate(page.nom)} `);
        if (pageAnalyses.value[page.id]) {
          _push(`<span class="meta-tab-score" style="${ssrRenderStyle(scoreColor((_a2 = pageAnalyses.value[page.id]) == null ? void 0 : _a2.score))}" data-v-44022172>${ssrInterpolate((_b2 = pageAnalyses.value[page.id]) == null ? void 0 : _b2.score)}/100 </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></div>`);
      if (showSetupBanner.value && !analysisResult.value) {
        _push(`<div class="setup-banner" data-v-44022172><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "0.75rem", "flex-wrap": "wrap" })}" data-v-44022172>`);
        _push(ssrRenderComponent(unref(AlertTriangle), {
          size: 18,
          style: { "color": "#f59e0b", "flex-shrink": "0" }
        }, null, _parent));
        _push(`<div data-v-44022172><strong data-v-44022172>Connexion API non configur\xE9e</strong> \u2014 Les credentials Meta et/ou Google ne sont pas encore dans le <code data-v-44022172>.env</code>. L&#39;analyse fonctionnera en <strong data-v-44022172>mode d\xE9mo</strong> avec des donn\xE9es d&#39;exemple jusqu&#39;\xE0 leur configuration. </div><button class="btn btn-primary btn-sm" style="${ssrRenderStyle({ "margin-left": "auto" })}" data-v-44022172>`);
        _push(ssrRenderComponent(unref(Sparkles), { size: 13 }, null, _parent));
        _push(` Tester en mode d\xE9mo </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (analyzing.value) {
        _push(`<div class="analyzing-overlay" data-v-44022172><div class="analyzing-card" data-v-44022172><div class="ai-spinner" data-v-44022172></div><div style="${ssrRenderStyle({ "font-weight": "600", "font-size": "0.9375rem" })}" data-v-44022172>L&#39;agent IA analyse vos campagnes...</div><div style="${ssrRenderStyle({ "font-size": "0.8125rem", "color": "var(--text-secondary)" })}" data-v-44022172>${ssrInterpolate(analyzingStep.value)}</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (analysisResult.value) {
        _push(`<div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "1.5rem", "margin-top": "1.5rem" })}" data-v-44022172><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "300px 1fr", "gap": "1.25rem", "align-items": "start" })}" data-v-44022172><div class="card score-card" data-v-44022172><div style="${ssrRenderStyle({ "font-size": "0.75rem", "font-weight": "600", "text-transform": "uppercase", "letter-spacing": "0.05em", "color": "var(--text-secondary)", "margin-bottom": "0.75rem" })}" data-v-44022172> Score Sant\xE9 Campagne </div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "1rem", "margin-bottom": "1rem" })}" data-v-44022172><div class="score-ring" style="${ssrRenderStyle(scoreRingStyle(analysisResult.value.score))}" data-v-44022172><span class="score-number" data-v-44022172>${ssrInterpolate(analysisResult.value.score)}</span><span class="score-label" data-v-44022172>/100</span></div><div data-v-44022172><div style="${ssrRenderStyle([{ "font-size": "1.25rem", "font-weight": "800" }, { color: scoreTextColor(analysisResult.value.score) }])}" data-v-44022172>${ssrInterpolate(scoreText(analysisResult.value.score))}</div><div style="${ssrRenderStyle({ "font-size": "0.75rem", "color": "var(--text-secondary)", "margin-top": "2px" })}" data-v-44022172><span style="${ssrRenderStyle({ color: analysisResult.value.scoreTendance === "hausse" ? "var(--status-success)" : analysisResult.value.scoreTendance === "baisse" ? "var(--status-danger)" : "var(--text-secondary)" })}" data-v-44022172>${ssrInterpolate(analysisResult.value.scoreTendance === "hausse" ? "\u2191 En progression" : analysisResult.value.scoreTendance === "baisse" ? "\u2193 En d\xE9clin" : "\u2192 Stable")}</span></div></div></div><div style="${ssrRenderStyle({ "font-size": "0.75rem", "color": "var(--text-secondary)", "line-height": "1.6", "border-top": "1px solid var(--border-light)", "padding-top": "0.75rem" })}" data-v-44022172>${ssrInterpolate(analysisResult.value.resumeExecutif)}</div><div style="${ssrRenderStyle({ "margin-top": "0.75rem", "font-size": "0.7rem", "color": "var(--text-muted)" })}" data-v-44022172> Analys\xE9 le ${ssrInterpolate(formatDate(analysisResult.value.generatedAt))} `);
        if (isDemo.value) {
          _push(`<span style="${ssrRenderStyle({ "color": "#f59e0b" })}" data-v-44022172> \xB7 D\xE9mo</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "repeat(2,1fr)", "gap": "0.875rem" })}" data-v-44022172><div class="card budget-kpi-card" data-v-44022172><div class="budget-kpi-icon" style="${ssrRenderStyle({ "color": "#1877f2", "background": "#1877f215" })}" data-v-44022172>`);
        _push(ssrRenderComponent(unref(Euro), { size: 15 }, null, _parent));
        _push(`</div><div class="budget-kpi-label" data-v-44022172>Budget Allou\xE9</div><div class="budget-kpi-val" data-v-44022172>${ssrInterpolate(budgetInfo.value.total.toLocaleString("fr-FR"))} \u20AC</div><div class="budget-kpi-bar-wrap" data-v-44022172><div class="budget-kpi-bar" style="${ssrRenderStyle({ width: Math.min(budgetInfo.value.depense / budgetInfo.value.total * 100, 100) + "%", background: "#1877f2" })}" data-v-44022172></div></div><div class="budget-kpi-sub" data-v-44022172>${ssrInterpolate((budgetInfo.value.depense / budgetInfo.value.total * 100).toFixed(1))}% utilis\xE9</div></div><div class="card budget-kpi-card" data-v-44022172><div class="budget-kpi-icon" style="${ssrRenderStyle({ "color": "var(--status-danger)", "background": "var(--status-danger-bg)" })}" data-v-44022172>`);
        _push(ssrRenderComponent(unref(TrendingDown), { size: 15 }, null, _parent));
        _push(`</div><div class="budget-kpi-label" data-v-44022172>Budget D\xE9pens\xE9</div><div class="budget-kpi-val" style="${ssrRenderStyle({ "color": "var(--status-danger)" })}" data-v-44022172>${ssrInterpolate(budgetInfo.value.depense.toLocaleString("fr-FR"))} \u20AC</div><div class="budget-kpi-bar-wrap" data-v-44022172><div class="budget-kpi-bar" style="${ssrRenderStyle({ width: Math.min(budgetInfo.value.depense / budgetInfo.value.total * 100, 100) + "%", background: "var(--status-danger)" })}" data-v-44022172></div></div><div class="budget-kpi-sub" data-v-44022172>sur ${ssrInterpolate(budgetInfo.value.total.toLocaleString("fr-FR"))}\u20AC allou\xE9s</div></div><div class="card budget-kpi-card" data-v-44022172><div class="budget-kpi-icon" style="${ssrRenderStyle({ "color": "var(--status-success)", "background": "var(--status-success-bg)" })}" data-v-44022172>`);
        _push(ssrRenderComponent(unref(Wallet), { size: 15 }, null, _parent));
        _push(`</div><div class="budget-kpi-label" data-v-44022172>Budget Restant</div><div class="budget-kpi-val" style="${ssrRenderStyle({ "color": "var(--status-success)" })}" data-v-44022172>${ssrInterpolate((budgetInfo.value.total - budgetInfo.value.depense).toLocaleString("fr-FR"))} \u20AC</div><div class="budget-kpi-bar-wrap" data-v-44022172><div class="budget-kpi-bar" style="${ssrRenderStyle({ width: Math.min((budgetInfo.value.total - budgetInfo.value.depense) / budgetInfo.value.total * 100, 100) + "%", background: "var(--status-success)" })}" data-v-44022172></div></div><div class="budget-kpi-sub" data-v-44022172>${ssrInterpolate((100 - budgetInfo.value.depense / budgetInfo.value.total * 100).toFixed(1))}% disponible</div></div><div class="card budget-kpi-card" data-v-44022172><div class="budget-kpi-icon" style="${ssrRenderStyle({ "color": "#f59e0b", "background": "#f59e0b15" })}" data-v-44022172>`);
        _push(ssrRenderComponent(unref(TrendingUp), { size: 15 }, null, _parent));
        _push(`</div><div class="budget-kpi-label" data-v-44022172>Revenus G\xE9n\xE9r\xE9s</div><div class="budget-kpi-val" style="${ssrRenderStyle({ "color": "#f59e0b" })}" data-v-44022172>${ssrInterpolate((budgetInfo.value.revenusBilletterie + budgetInfo.value.revenusExposants).toLocaleString("fr-FR"))} \u20AC</div><div class="budget-kpi-bar-wrap" data-v-44022172><div class="budget-kpi-bar" style="${ssrRenderStyle({ "background": "#f59e0b", "width": "100%" })}" data-v-44022172></div></div>`);
        if (budgetInfo.value.depense > 0) {
          _push(`<div class="budget-kpi-sub" data-v-44022172>ROI : x${ssrInterpolate(((budgetInfo.value.revenusBilletterie + budgetInfo.value.revenusExposants) / budgetInfo.value.depense).toFixed(1))}</div>`);
        } else {
          _push(`<div class="budget-kpi-sub" data-v-44022172>Billetterie + Exposants</div>`);
        }
        _push(`</div></div></div>`);
        if ((_a = analysisResult.value.alertes) == null ? void 0 : _a.length) {
          _push(`<div class="card" style="${ssrRenderStyle({ "padding": "1.25rem" })}" data-v-44022172><h3 style="${ssrRenderStyle({ "font-size": "0.875rem", "font-weight": "700", "margin-bottom": "1rem", "display": "flex", "align-items": "center", "gap": "0.5rem" })}" data-v-44022172>`);
          _push(ssrRenderComponent(unref(AlertTriangle), {
            size: 15,
            style: { "color": "var(--status-danger)" }
          }, null, _parent));
          _push(` Diagnostic Expert \u2014 Probl\xE8mes D\xE9tect\xE9s </h3><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "0.625rem" })}" data-v-44022172><!--[-->`);
          ssrRenderList(analysisResult.value.alertes, (alerte) => {
            _push(`<div class="${ssrRenderClass([`alerte-${alerte.niveau}`, "alerte-card"])}" data-v-44022172><div style="${ssrRenderStyle({ "display": "flex", "align-items": "flex-start", "gap": "0.75rem" })}" data-v-44022172><span class="${ssrRenderClass([`dot-${alerte.niveau}`, "alerte-dot"])}" data-v-44022172></span><div style="${ssrRenderStyle({ "flex": "1" })}" data-v-44022172><div style="${ssrRenderStyle({ "font-weight": "700", "font-size": "0.875rem", "margin-bottom": "0.25rem" })}" data-v-44022172>${ssrInterpolate(alerteEmoji(alerte.niveau))} ${ssrInterpolate(alerte.titre)}</div><div style="${ssrRenderStyle({ "font-size": "0.8125rem", "color": "var(--text-secondary)", "margin-bottom": "0.375rem" })}" data-v-44022172>${ssrInterpolate(alerte.message)}</div><div style="${ssrRenderStyle({ "font-size": "0.75rem", "color": "var(--text-muted)", "font-style": "italic", "display": "flex", "align-items": "center", "gap": "0.375rem" })}" data-v-44022172>`);
            _push(ssrRenderComponent(unref(Info), { size: 11 }, null, _parent));
            _push(` <span data-v-44022172>${ssrInterpolate(alerte.justification)}</span></div></div><span class="${ssrRenderClass([`badge-${alerte.niveau}`, "badge alerte-badge"])}" data-v-44022172>${ssrInterpolate(alerte.niveau.toUpperCase())}</span></div></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="card" style="${ssrRenderStyle({ "padding": "0", "overflow": "hidden" })}" data-v-44022172><div style="${ssrRenderStyle({ "padding": "1rem 1.25rem", "border-bottom": "1px solid var(--border-light)", "display": "flex", "justify-content": "space-between", "align-items": "center", "flex-wrap": "wrap", "gap": "0.5rem" })}" data-v-44022172><div data-v-44022172><h3 style="${ssrRenderStyle({ "font-size": "0.9375rem", "font-weight": "700", "margin-bottom": "2px" })}" data-v-44022172>Performances par Post \u2014 Du plus au moins performant</h3><div style="${ssrRenderStyle({ "font-size": "0.75rem", "color": "var(--text-secondary)" })}" data-v-44022172>Organique + Sponsoris\xE9 \xB7 ${ssrInterpolate(activePagePosts.value.length)} post(s) analys\xE9(s)</div></div><div style="${ssrRenderStyle({ "display": "flex", "gap": "0.5rem", "align-items": "center" })}" data-v-44022172><select class="form-input" style="${ssrRenderStyle({ "padding": "0.25rem 0.5rem", "font-size": "0.75rem", "width": "auto" })}" data-v-44022172><option value="" data-v-44022172${ssrIncludeBooleanAttr(Array.isArray(filterAction.value) ? ssrLooseContain(filterAction.value, "") : ssrLooseEqual(filterAction.value, "")) ? " selected" : ""}>Tous</option><option value="LAISSER_TOURNER" data-v-44022172${ssrIncludeBooleanAttr(Array.isArray(filterAction.value) ? ssrLooseContain(filterAction.value, "LAISSER_TOURNER") : ssrLooseEqual(filterAction.value, "LAISSER_TOURNER")) ? " selected" : ""}>\u{1F7E2} Laisser tourner</option><option value="BOOSTER" data-v-44022172${ssrIncludeBooleanAttr(Array.isArray(filterAction.value) ? ssrLooseContain(filterAction.value, "BOOSTER") : ssrLooseEqual(filterAction.value, "BOOSTER")) ? " selected" : ""}>\u{1F680} Booster</option><option value="SURVEILLER" data-v-44022172${ssrIncludeBooleanAttr(Array.isArray(filterAction.value) ? ssrLooseContain(filterAction.value, "SURVEILLER") : ssrLooseEqual(filterAction.value, "SURVEILLER")) ? " selected" : ""}>\u{1F7E1} Surveiller</option><option value="ARRETER" data-v-44022172${ssrIncludeBooleanAttr(Array.isArray(filterAction.value) ? ssrLooseContain(filterAction.value, "ARRETER") : ssrLooseEqual(filterAction.value, "ARRETER")) ? " selected" : ""}>\u{1F534} Arr\xEAter</option><option value="MODIFIER_CIBLAGE" data-v-44022172${ssrIncludeBooleanAttr(Array.isArray(filterAction.value) ? ssrLooseContain(filterAction.value, "MODIFIER_CIBLAGE") : ssrLooseEqual(filterAction.value, "MODIFIER_CIBLAGE")) ? " selected" : ""}>\u{1F535} Modifier ciblage</option><option value="OPTIMISER" data-v-44022172${ssrIncludeBooleanAttr(Array.isArray(filterAction.value) ? ssrLooseContain(filterAction.value, "OPTIMISER") : ssrLooseEqual(filterAction.value, "OPTIMISER")) ? " selected" : ""}>\u2699\uFE0F Optimiser</option></select><button class="btn btn-secondary btn-sm" data-v-44022172>`);
        _push(ssrRenderComponent(unref(Download), { size: 13 }, null, _parent));
        _push(` CSV </button></div></div><div style="${ssrRenderStyle({ "overflow-x": "auto" })}" data-v-44022172><table class="data-table" data-v-44022172><thead data-v-44022172><tr data-v-44022172><th data-v-44022172>#</th><th data-v-44022172>Post</th><th data-v-44022172>Date</th><th data-v-44022172>Vues Total</th><th data-v-44022172>Vues Pub</th><th data-v-44022172>Vues Org.</th><th data-v-44022172>Couverture</th><th data-v-44022172>Interactions</th><th data-v-44022172>Clics Lien</th><th data-v-44022172>Tx Eng.</th><th style="${ssrRenderStyle({ "min-width": "180px" })}" data-v-44022172>Action IA</th></tr></thead><tbody data-v-44022172>`);
        if (filteredPosts.value.length === 0) {
          _push(`<tr data-v-44022172><td colspan="11" style="${ssrRenderStyle({ "text-align": "center", "padding": "3rem", "color": "var(--text-muted)" })}" data-v-44022172>`);
          _push(ssrRenderComponent(unref(Sparkles), {
            size: 28,
            style: { "display": "block", "margin": "0 auto 0.75rem" }
          }, null, _parent));
          _push(` Lancez une analyse IA pour voir les performances des posts. </td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(filteredPosts.value, (post, idx) => {
          var _a2, _b2, _c2, _d2, _e2, _f2, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
          _push(`<tr class="post-row" data-v-44022172><td style="${ssrRenderStyle({ "font-weight": "700", "color": "var(--text-muted)", "font-size": "0.8rem" })}" data-v-44022172>${ssrInterpolate(idx + 1)}</td><td data-v-44022172><div style="${ssrRenderStyle({ "font-weight": "600", "font-size": "0.8125rem", "max-width": "220px", "overflow": "hidden", "text-overflow": "ellipsis", "white-space": "nowrap" })}"${ssrRenderAttr("title", post.message)} data-v-44022172>${ssrInterpolate(post.message)}</div></td><td style="${ssrRenderStyle({ "font-size": "0.75rem", "color": "var(--text-secondary)", "white-space": "nowrap" })}" data-v-44022172>\u2014</td><td data-v-44022172><strong data-v-44022172>${ssrInterpolate(formatNum((_c2 = (_b2 = (_a2 = syncResult.value) == null ? void 0 : _a2.posts) == null ? void 0 : _b2.find((p) => p.id === post.postId)) == null ? void 0 : _c2.vuesTotal))}</strong></td><td style="${ssrRenderStyle({ "color": "var(--accent-primary)" })}" data-v-44022172>${ssrInterpolate(formatNum((_f2 = (_e2 = (_d2 = syncResult.value) == null ? void 0 : _d2.posts) == null ? void 0 : _e2.find((p) => p.id === post.postId)) == null ? void 0 : _f2.vuesPub))}</td><td style="${ssrRenderStyle({ "color": "var(--status-success)" })}" data-v-44022172>${ssrInterpolate(formatNum((_i = (_h = (_g = syncResult.value) == null ? void 0 : _g.posts) == null ? void 0 : _h.find((p) => p.id === post.postId)) == null ? void 0 : _i.vuesOrganique))}</td><td data-v-44022172>${ssrInterpolate(formatNum((_l = (_k = (_j = syncResult.value) == null ? void 0 : _j.posts) == null ? void 0 : _k.find((p) => p.id === post.postId)) == null ? void 0 : _l.couverture))}</td><td data-v-44022172>${ssrInterpolate(formatNum((_o = (_n = (_m = syncResult.value) == null ? void 0 : _m.posts) == null ? void 0 : _n.find((p) => p.id === post.postId)) == null ? void 0 : _o.interactions))}</td><td style="${ssrRenderStyle({ "font-weight": "600" })}" data-v-44022172>${ssrInterpolate(formatNum((_r = (_q = (_p = syncResult.value) == null ? void 0 : _p.posts) == null ? void 0 : _q.find((p) => p.id === post.postId)) == null ? void 0 : _r.clicsLien))}</td><td data-v-44022172><span style="${ssrRenderStyle({ color: engagementColor((_u = (_t = (_s = syncResult.value) == null ? void 0 : _s.posts) == null ? void 0 : _t.find((p) => p.id === post.postId)) == null ? void 0 : _u.tauxEngagement) })}" data-v-44022172>${ssrInterpolate((_y = (_x = (_w = (_v = syncResult.value) == null ? void 0 : _v.posts) == null ? void 0 : _w.find((p) => p.id === post.postId)) == null ? void 0 : _x.tauxEngagement) != null ? _y : "\u2014")}% </span></td><td data-v-44022172><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "0.25rem" })}" data-v-44022172><span class="${ssrRenderClass([`action-${post.action}`, "action-badge"])}" data-v-44022172>${ssrInterpolate(post.actionLabel)}</span><button class="justify-btn" style="${ssrRenderStyle({ "font-size": "0.65rem", "text-decoration": "underline", "color": "var(--text-muted)", "cursor": "pointer", "background": "none", "border": "none", "text-align": "left" })}" data-v-44022172>${ssrInterpolate(openJustifs.value.includes(post.postId) ? "\u25B2 Masquer" : "\u25BC Justification")}</button>`);
          if (openJustifs.value.includes(post.postId)) {
            _push(`<div class="justif-box" data-v-44022172>${ssrInterpolate(post.justification)} `);
            if (post.budgetSugere) {
              _push(`<span style="${ssrRenderStyle({ "display": "block", "margin-top": "4px", "font-weight": "600", "color": "var(--accent-primary)" })}" data-v-44022172> \u{1F4B0} Budget sugg\xE9r\xE9 : ${ssrInterpolate(post.budgetSugere)}\u20AC </span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1.25rem" })}" data-v-44022172><div class="card" data-v-44022172><h3 style="${ssrRenderStyle({ "font-size": "0.875rem", "font-weight": "700", "margin-bottom": "1rem", "display": "flex", "align-items": "center", "gap": "0.5rem" })}" data-v-44022172>`);
        _push(ssrRenderComponent(unref(Euro), {
          size: 15,
          style: { "color": "var(--accent-primary)" }
        }, null, _parent));
        _push(` R\xE9allocation Budg\xE9taire Sugg\xE9r\xE9e </h3><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "0.625rem" })}" data-v-44022172><!--[-->`);
        ssrRenderList(analysisResult.value.budgetReallocation, (item) => {
          _push(`<div class="budget-item" data-v-44022172><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "space-between", "gap": "0.5rem", "margin-bottom": "0.25rem" })}" data-v-44022172><div style="${ssrRenderStyle({ "font-weight": "600", "font-size": "0.8125rem", "overflow": "hidden", "text-overflow": "ellipsis", "white-space": "nowrap", "flex": "1" })}"${ssrRenderAttr("title", item.postMessage)} data-v-44022172>${ssrInterpolate(item.postMessage)}</div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "0.375rem", "flex-shrink": "0" })}" data-v-44022172><span class="${ssrRenderClass([`budget-badge-${item.action}`, "badge"])}" data-v-44022172>${ssrInterpolate(item.action)}</span>`);
          if (item.montant) {
            _push(`<span style="${ssrRenderStyle({ "font-weight": "700", "font-size": "0.8125rem" })}" data-v-44022172>${ssrInterpolate(item.montant)}\u20AC</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><div style="${ssrRenderStyle({ "font-size": "0.7rem", "color": "var(--text-muted)", "font-style": "italic" })}" data-v-44022172>${ssrInterpolate(item.justification)}</div></div>`);
        });
        _push(`<!--]--></div><div style="${ssrRenderStyle({ "margin-top": "1rem", "padding-top": "0.75rem", "border-top": "1px solid var(--border-light)", "display": "flex", "justify-content": "space-between", "font-size": "0.8125rem" })}" data-v-44022172><span style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}" data-v-44022172>Budget hebdo recommand\xE9</span><span style="${ssrRenderStyle({ "font-weight": "700", "color": "var(--accent-primary)" })}" data-v-44022172>${ssrInterpolate(analysisResult.value.budgetReallocation.reduce((s, i) => s + (i.montant || 0), 0))}\u20AC </span></div></div><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "0.75rem" })}" data-v-44022172>`);
        if ((_b = analysisResult.value.audienceAlerts) == null ? void 0 : _b.length) {
          _push(`<div class="card" data-v-44022172><h3 style="${ssrRenderStyle({ "font-size": "0.875rem", "font-weight": "700", "margin-bottom": "0.75rem", "display": "flex", "align-items": "center", "gap": "0.5rem" })}" data-v-44022172>`);
          _push(ssrRenderComponent(unref(Users), {
            size: 15,
            style: { "color": "var(--accent-purple)" }
          }, null, _parent));
          _push(` Intelligence Audience </h3><!--[-->`);
          ssrRenderList(analysisResult.value.audienceAlerts, (alert) => {
            _push(`<div style="${ssrRenderStyle([{ "margin-bottom": "0.625rem", "padding": "0.625rem", "border-radius": "6px", "background": "var(--bg-surface-hover)", "border-left": "3px solid" }, { borderLeftColor: alert.niveau === "critique" ? "var(--status-danger)" : alert.niveau === "important" ? "#f59e0b" : "var(--accent-primary)" }])}" data-v-44022172><div style="${ssrRenderStyle({ "font-size": "0.8125rem", "font-weight": "600", "margin-bottom": "0.25rem" })}" data-v-44022172>${ssrInterpolate(alert.message)}</div><div style="${ssrRenderStyle({ "font-size": "0.7rem", "color": "var(--text-muted)", "font-style": "italic" })}" data-v-44022172>${ssrInterpolate(alert.justification)}</div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="card content-intel-card" data-v-44022172><h3 style="${ssrRenderStyle({ "font-size": "0.875rem", "font-weight": "700", "margin-bottom": "0.75rem", "display": "flex", "align-items": "center", "gap": "0.5rem" })}" data-v-44022172>`);
        _push(ssrRenderComponent(unref(TrendingUp), {
          size: 15,
          style: { "color": "var(--status-success)" }
        }, null, _parent));
        _push(` Intelligence Contenu </h3><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "0.5rem", "margin-bottom": "0.75rem" })}" data-v-44022172><div class="intel-stat" data-v-44022172><div class="intel-stat-label" data-v-44022172>Format gagnant</div><div class="intel-stat-val" data-v-44022172>${ssrInterpolate((_c = analysisResult.value.contentIntel) == null ? void 0 : _c.formatGagnant)}</div></div><div class="intel-stat" data-v-44022172><div class="intel-stat-label" data-v-44022172>Meilleur horaire</div><div class="intel-stat-val" data-v-44022172>${ssrInterpolate((_d = analysisResult.value.contentIntel) == null ? void 0 : _d.meilleurHoraire)}</div></div><div class="intel-stat" style="${ssrRenderStyle({ "grid-column": "1/-1" })}" data-v-44022172><div class="intel-stat-label" data-v-44022172>Th\xE8me gagnant</div><div class="intel-stat-val" data-v-44022172>${ssrInterpolate((_e = analysisResult.value.contentIntel) == null ? void 0 : _e.themeGagnant)}</div></div></div><div style="${ssrRenderStyle({ "font-size": "0.8125rem", "color": "var(--text-secondary)", "line-height": "1.6", "background": "var(--bg-surface-hover)", "border-radius": "6px", "padding": "0.625rem", "border": "1px solid var(--border-light)" })}" data-v-44022172> \u{1F4A1} ${ssrInterpolate((_f = analysisResult.value.contentIntel) == null ? void 0 : _f.recommandation)}</div></div></div></div><div class="card" data-v-44022172><h3 style="${ssrRenderStyle({ "font-size": "0.9375rem", "font-weight": "700", "margin-bottom": "1rem", "display": "flex", "align-items": "center", "gap": "0.5rem" })}" data-v-44022172>`);
        _push(ssrRenderComponent(unref(Calendar), {
          size: 15,
          style: { "color": "var(--accent-primary)" }
        }, null, _parent));
        _push(` Plan d&#39;Action \u2014 Cette Semaine </h3><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr 1fr", "gap": "1rem" })}" data-v-44022172><div data-v-44022172><div style="${ssrRenderStyle({ "font-size": "0.75rem", "font-weight": "700", "text-transform": "uppercase", "letter-spacing": "0.04em", "color": "var(--status-danger)", "margin-bottom": "0.625rem", "display": "flex", "align-items": "center", "gap": "0.375rem" })}" data-v-44022172><span style="${ssrRenderStyle({ "width": "6px", "height": "6px", "border-radius": "50%", "background": "var(--status-danger)", "display": "inline-block" })}" data-v-44022172></span> Urgent </div><!--[-->`);
        ssrRenderList(urgentActions.value, (item) => {
          _push(`<div class="action-item action-urgent" data-v-44022172>`);
          _push(ssrRenderComponent(unref(CheckSquare), { size: 13 }, null, _parent));
          _push(` ${ssrInterpolate(item.action)}</div>`);
        });
        _push(`<!--]-->`);
        if (!urgentActions.value.length) {
          _push(`<div style="${ssrRenderStyle({ "font-size": "0.8rem", "color": "var(--text-muted)", "font-style": "italic" })}" data-v-44022172>Rien d&#39;urgent \u2705</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div data-v-44022172><div style="${ssrRenderStyle({ "font-size": "0.75rem", "font-weight": "700", "text-transform": "uppercase", "letter-spacing": "0.04em", "color": "#f59e0b", "margin-bottom": "0.625rem", "display": "flex", "align-items": "center", "gap": "0.375rem" })}" data-v-44022172><span style="${ssrRenderStyle({ "width": "6px", "height": "6px", "border-radius": "50%", "background": "#f59e0b", "display": "inline-block" })}" data-v-44022172></span> Cette semaine </div><!--[-->`);
        ssrRenderList(weekActions.value, (item) => {
          _push(`<div class="action-item action-week" data-v-44022172>`);
          _push(ssrRenderComponent(unref(CheckSquare), { size: 13 }, null, _parent));
          _push(` ${ssrInterpolate(item.action)}</div>`);
        });
        _push(`<!--]--></div><div data-v-44022172><div style="${ssrRenderStyle({ "font-size": "0.75rem", "font-weight": "700", "text-transform": "uppercase", "letter-spacing": "0.04em", "color": "var(--accent-primary)", "margin-bottom": "0.625rem", "display": "flex", "align-items": "center", "gap": "0.375rem" })}" data-v-44022172><span style="${ssrRenderStyle({ "width": "6px", "height": "6px", "border-radius": "50%", "background": "var(--accent-primary)", "display": "inline-block" })}" data-v-44022172></span> \xC0 surveiller </div><!--[-->`);
        ssrRenderList(watchActions.value, (item) => {
          _push(`<div class="action-item action-watch" data-v-44022172>`);
          _push(ssrRenderComponent(unref(Eye), { size: 13 }, null, _parent));
          _push(` ${ssrInterpolate(item.action)}</div>`);
        });
        _push(`<!--]--></div></div></div></div>`);
      } else if (!analyzing.value) {
        _push(`<div class="empty-meta-state" data-v-44022172><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "center", "gap": "1rem", "padding": "4rem 2rem", "text-align": "center" })}" data-v-44022172><div class="ai-icon-big" data-v-44022172>`);
        _push(ssrRenderComponent(unref(Sparkles), { size: 28 }, null, _parent));
        _push(`</div><div style="${ssrRenderStyle({ "font-size": "1.125rem", "font-weight": "700" })}" data-v-44022172>Pr\xEAt pour l&#39;analyse</div><div style="${ssrRenderStyle({ "font-size": "0.875rem", "color": "var(--text-secondary)", "max-width": "440px", "line-height": "1.6" })}" data-v-44022172> Cliquez sur <strong data-v-44022172>&quot;Analyser avec l&#39;IA&quot;</strong> pour obtenir une analyse experte de vos campagnes Meta Ads \u2014 organique + sponsoris\xE9, du plus au moins performant, avec suggestions justifi\xE9es. </div><div style="${ssrRenderStyle({ "display": "flex", "gap": "0.75rem", "margin-top": "0.5rem" })}" data-v-44022172><button class="btn btn-primary" data-v-44022172>`);
        _push(ssrRenderComponent(unref(Sparkles), { size: 14 }, null, _parent));
        _push(` Lancer l&#39;analyse </button></div><div style="${ssrRenderStyle({ "font-size": "0.75rem", "color": "var(--text-muted)" })}" data-v-44022172>Fonctionne en mode d\xE9mo si les credentials API ne sont pas configur\xE9s.</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/meta/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-44022172"]]);

export { index as default };
//# sourceMappingURL=index-BckjrD38.mjs.map
