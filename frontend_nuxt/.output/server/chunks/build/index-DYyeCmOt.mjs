import { withAsyncContext, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { Megaphone, Film, Palette, Users } from 'lucide-vue-next';
import { u as useFetch } from './fetch-BEwQ1c2o.mjs';
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
import './server.mjs';
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
    const { data: taches, refresh: refreshTaches } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/taches",
      "$fyCTw8pvHA"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: employes } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/equipe",
      "$ieIpMSweVe"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: demandes, refresh: refreshDemandes } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/taches/demandes",
      "$IoJnJtsXc9"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const getModifDetails = (dem) => {
      if (!dem.donneesModif || !dem.tache) return null;
      try {
        const parsed = JSON.parse(dem.donneesModif);
        const changes = [];
        const fieldMapping = {
          titre: "Titre/Nom",
          description: "Description/Brief",
          date_limite: "Deadline",
          demandeur: "Demandeur",
          type_visuel: "Type de Visuel",
          quantite: "Quantit\xE9",
          format_video: "Format Vid\xE9o",
          duree_cible: "Dur\xE9e Cible",
          type_technique: "Type Technique",
          type_demarche: "Type D\xE9marche",
          outil_mailing: "Outil Mailing",
          plateforme: "Plateforme",
          type_pub: "Type de Publication",
          budget: "Budget",
          audience: "Audience"
        };
        for (const key in fieldMapping) {
          if (parsed[key] !== void 0) {
            let oldVal = dem.tache[key];
            let newVal = parsed[key];
            if (key === "date_limite" || key === "date_demande" || key === "date_resultat") {
              if (oldVal) oldVal = new Date(oldVal).toLocaleDateString();
              if (newVal) newVal = new Date(newVal).toLocaleDateString();
            }
            if (oldVal !== newVal) {
              changes.push({
                field: key,
                label: fieldMapping[key],
                old: oldVal === null || oldVal === void 0 || oldVal === "" ? "Vide" : oldVal,
                new: newVal === null || newVal === void 0 || newVal === "" ? "Vide" : newVal
              });
            }
          }
        }
        return changes.length > 0 ? changes : null;
      } catch (err) {
        return null;
      }
    };
    const pubsCount = computed(() => {
      var _a;
      return ((_a = taches.value) == null ? void 0 : _a.filter((t) => t.type_pub || t.type_demarche || t.budget).length) || 0;
    });
    const vidsCount = computed(() => {
      var _a;
      return ((_a = taches.value) == null ? void 0 : _a.filter((t) => t.format_video).length) || 0;
    });
    const visuelsCount = computed(() => {
      var _a;
      return ((_a = taches.value) == null ? void 0 : _a.filter((t) => t.type_visuel).length) || 0;
    });
    const employesCount = computed(() => {
      var _a;
      return ((_a = employes.value) == null ? void 0 : _a.length) || 0;
    });
    const alerts = computed(() => {
      if (!taches.value) return [];
      const now = /* @__PURE__ */ new Date();
      return taches.value.filter((t) => {
        var _a, _b;
        return new Date(t.date_limite) < now && ((_a = t.statutTache) == null ? void 0 : _a.nom) !== "Termin\xE9" && ((_b = t.statutTache) == null ? void 0 : _b.nom) !== "Publi\xE9";
      }).slice(0, 3).map((t) => {
        var _a, _b;
        return {
          id: t.id,
          label: `${(_b = (_a = t.edition) == null ? void 0 : _a.licence) == null ? void 0 : _b.sigle} - ${t.titre}`,
          detail: `Deadline d\xE9pass\xE9e (${new Date(t.date_limite).toLocaleDateString()})`,
          type: "Retard",
          badgeClass: "badge-danger"
        };
      });
    });
    const recentActivity = computed(() => {
      if (!taches.value) return [];
      return [...taches.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5).map((t) => {
        var _a, _b, _c, _d, _e;
        return {
          id: t.id,
          name: t.employe ? `${t.employe.prenom} ${t.employe.nom[0]}.` : "Inconnu",
          dept: ((_c = (_b = (_a = t.employe) == null ? void 0 : _a.poste) == null ? void 0 : _b.departement) == null ? void 0 : _c.nom_departement) || "N/A",
          task: t.titre,
          date: new Date(t.createdAt).toLocaleDateString(),
          status: (_d = t.statutTache) == null ? void 0 : _d.nom,
          color: (_e = t.statutTache) == null ? void 0 : _e.couleur
        };
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "animate-fade-in" }, _attrs))}><div class="page-header"><div><h1 class="page-title">Supervision Globale</h1><p class="page-subtitle" style="${ssrRenderStyle({ "margin-bottom": "0" })}">Vue d&#39;ensemble de l&#39;activit\xE9 de tous les d\xE9partements.</p></div></div>`);
      if (unref(demandes) && unref(demandes).length > 0) {
        _push(`<div class="card" style="${ssrRenderStyle({ "margin-bottom": "1.5rem", "border-color": "var(--accent-purple)" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "space-between", "margin-bottom": "1rem" })}"><h3 style="${ssrRenderStyle({ "font-size": "0.9375rem", "font-weight": "600", "display": "flex", "align-items": "center", "gap": "0.5rem", "color": "var(--accent-purple)" })}"><span style="${ssrRenderStyle({ "display": "inline-block", "width": "8px", "height": "8px", "background": "var(--accent-purple)", "border-radius": "50%" })}"></span> Demandes de collaborateurs en attente </h3><span class="badge" style="${ssrRenderStyle({ "background": "var(--accent-purple)20", "color": "var(--accent-purple)", "font-weight": "600" })}">${ssrInterpolate(unref(demandes).length)} nouvelles</span></div><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "0.75rem" })}"><!--[-->`);
        ssrRenderList(unref(demandes), (dem) => {
          var _a, _b, _c, _d, _e;
          _push(`<div class="card" style="${ssrRenderStyle({ "padding": "0.75rem 1rem", "border-color": "var(--border-light)", "display": "flex", "justify-content": "space-between", "align-items": "center", "background": "#fafafa", "gap": "1rem", "flex-wrap": "wrap" })}"><div style="${ssrRenderStyle({ "flex": "1", "min-width": "250px" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "0.5rem", "margin-bottom": "0.35rem", "flex-wrap": "wrap" })}"><span class="badge" style="${ssrRenderStyle({
            background: dem.typeDemande === "SUPPRESSION" ? "var(--status-danger-bg)" : "var(--status-info-bg)",
            color: dem.typeDemande === "SUPPRESSION" ? "var(--status-danger)" : "var(--status-info)",
            border: dem.typeDemande === "SUPPRESSION" ? "1px solid rgba(239,68,68,0.15)" : "1px solid rgba(59,130,246,0.15)"
          })}">${ssrInterpolate(dem.typeDemande === "SUPPRESSION" ? "SUPPRESSION" : "MODIFICATION")}</span><strong style="${ssrRenderStyle({ "font-size": "0.8125rem" })}">${ssrInterpolate((_a = dem.tache) == null ? void 0 : _a.titre)}</strong><span style="${ssrRenderStyle({ "font-size": "0.75rem", "color": "var(--text-secondary)" })}">demand\xE9 par <strong>${ssrInterpolate((_c = (_b = dem.tache) == null ? void 0 : _b.employe) == null ? void 0 : _c.prenom)} ${ssrInterpolate((_e = (_d = dem.tache) == null ? void 0 : _d.employe) == null ? void 0 : _e.nom)}</strong></span></div><div style="${ssrRenderStyle({ "font-size": "0.8125rem", "color": "var(--text-secondary)", "margin-bottom": "0.25rem", "line-height": "1.4" })}"><strong>Motif :</strong> &quot;${ssrInterpolate(dem.motif)}&quot; </div>`);
          if (dem.typeDemande === "MODIFICATION" && getModifDetails(dem)) {
            _push(`<div style="${ssrRenderStyle({ "font-size": "0.75rem", "background": "white", "border": "1px solid var(--border-light)", "border-radius": "6px", "padding": "0.5rem 0.75rem", "margin-top": "0.5rem", "max-width": "600px", "box-shadow": "inset 0 1px 2px rgba(0,0,0,0.02)" })}"><div style="${ssrRenderStyle({ "font-weight": "600", "color": "var(--text-muted)", "margin-bottom": "0.35rem", "font-size": "0.7rem", "text-transform": "uppercase", "letter-spacing": "0.025em" })}">Changements propos\xE9s :</div><ul style="${ssrRenderStyle({ "padding-left": "1rem", "margin": "0", "color": "var(--text-secondary)", "display": "flex", "flex-direction": "column", "gap": "0.25rem" })}"><!--[-->`);
            ssrRenderList(getModifDetails(dem), (change) => {
              _push(`<li style="${ssrRenderStyle({ "line-height": "1.4" })}"><strong>${ssrInterpolate(change.label)} :</strong><span style="${ssrRenderStyle({ "text-decoration": "line-through", "color": "var(--status-danger)", "margin-right": "0.35rem" })}">${ssrInterpolate(change.old)}</span><span style="${ssrRenderStyle({ "color": "var(--status-success)", "font-weight": "500" })}">${ssrInterpolate(change.new)}</span></li>`);
            });
            _push(`<!--]--></ul></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div style="${ssrRenderStyle({ "display": "flex", "gap": "0.5rem", "align-items": "center", "justify-content": "flex-end", "min-width": "150px" })}"><button class="btn btn-primary btn-sm" style="${ssrRenderStyle({ "background-color": "var(--status-success)", "color": "white" })}">Accepter</button><button class="btn btn-secondary btn-sm" style="${ssrRenderStyle({ "color": "var(--status-danger)", "border-color": "var(--status-danger)" })}">Refuser</button></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="kpi-grid kpi-grid-4" style="${ssrRenderStyle({ "margin-bottom": "1.5rem" })}"><div class="card kpi-card"><div class="kpi-icon">`);
      _push(ssrRenderComponent(unref(Megaphone), { size: 18 }, null, _parent));
      _push(`</div><div><div class="kpi-label">Publications (semaine)</div><div class="kpi-value">${ssrInterpolate(pubsCount.value)}</div></div></div><div class="card kpi-card"><div class="kpi-icon">`);
      _push(ssrRenderComponent(unref(Film), { size: 18 }, null, _parent));
      _push(`</div><div><div class="kpi-label">Montages Vid\xE9o</div><div class="kpi-value">${ssrInterpolate(vidsCount.value)}</div></div></div><div class="card kpi-card"><div class="kpi-icon">`);
      _push(ssrRenderComponent(unref(Palette), { size: 18 }, null, _parent));
      _push(`</div><div><div class="kpi-label">Visuels Cr\xE9\xE9s</div><div class="kpi-value">${ssrInterpolate(visuelsCount.value)}</div></div></div><div class="card kpi-card"><div class="kpi-icon">`);
      _push(ssrRenderComponent(unref(Users), { size: 18 }, null, _parent));
      _push(`</div><div><div class="kpi-label">Collaborateurs Actifs</div><div class="kpi-value">${ssrInterpolate(employesCount.value)}</div></div></div></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "2fr 1fr", "gap": "1.5rem", "margin-bottom": "1.5rem" })}"><div class="card"><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "margin-bottom": "1.25rem" })}"><div><div style="${ssrRenderStyle({ "font-size": "0.75rem", "color": "var(--text-secondary)", "font-weight": "500" })}">Score Qualit\xE9 Moyen</div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "baseline", "gap": "0.5rem" })}"><span style="${ssrRenderStyle({ "font-size": "1.5rem", "font-weight": "700" })}">89/100</span><span class="badge badge-success">\u2191 2.4%</span></div></div><select class="form-input" style="${ssrRenderStyle({ "padding": "0.3rem 0.5rem", "font-size": "0.75rem" })}"><option>30 derniers jours</option><option>7 derniers jours</option><option>Tout</option></select></div><div style="${ssrRenderStyle({ "height": "160px", "background": "linear-gradient(180deg, rgba(229,231,235,0.4) 0%, transparent 100%)", "border-radius": "4px", "border-bottom": "2px solid var(--accent-primary)", "display": "flex", "align-items": "flex-end", "padding": "0 1rem" })}"><div style="${ssrRenderStyle({ "width": "100%", "display": "flex", "justify-content": "space-between", "color": "var(--text-muted)", "font-size": "0.6875rem", "padding-bottom": "0.5rem" })}"><span>1 Mai</span><span>15 Mai</span><span>1 Juin</span></div></div></div><div class="card" style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column" })}"><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "margin-bottom": "1rem" })}"><h3 style="${ssrRenderStyle({ "font-size": "0.875rem", "font-weight": "600" })}">Alertes &amp; Retards</h3><span class="badge badge-danger">${ssrInterpolate(alerts.value.length)}</span></div><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "0.75rem", "flex": "1" })}"><!--[-->`);
      ssrRenderList(alerts.value, (alert) => {
        _push(`<div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "padding-bottom": "0.75rem", "border-bottom": "1px dashed var(--border-light)" })}"><div><div style="${ssrRenderStyle({ "font-weight": "500", "font-size": "0.8125rem" })}">${ssrInterpolate(alert.label)}</div><div style="${ssrRenderStyle({ "font-size": "0.6875rem", "color": "var(--text-secondary)" })}">${ssrInterpolate(alert.detail)}</div></div><span class="${ssrRenderClass([alert.badgeClass, "badge"])}">${ssrInterpolate(alert.type)}</span></div>`);
      });
      _push(`<!--]--></div></div></div><div class="card" style="${ssrRenderStyle({ "padding": "0", "overflow": "hidden" })}"><div style="${ssrRenderStyle({ "padding": "1rem 1.25rem", "border-bottom": "1px solid var(--border-light)", "display": "flex", "justify-content": "space-between", "align-items": "center" })}"><h3 style="${ssrRenderStyle({ "font-size": "0.9375rem", "font-weight": "600" })}">Activit\xE9 R\xE9cente (Toutes \xC9quipes)</h3></div><table class="data-table"><thead><tr><th>Collaborateur</th><th>D\xE9partement</th><th>T\xE2che</th><th>Date</th><th>Statut</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(recentActivity.value, (act) => {
        _push(`<tr><td style="${ssrRenderStyle({ "font-weight": "500" })}">${ssrInterpolate(act.name)}</td><td><span class="badge badge-neutral">${ssrInterpolate(act.dept)}</span></td><td class="truncate"${ssrRenderAttr("title", act.task)}>${ssrInterpolate(act.task)}</td><td style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}">${ssrInterpolate(act.date)}</td><td><span class="badge" style="${ssrRenderStyle({ background: act.color + "20", color: act.color, border: "1px solid " + act.color })}">${ssrInterpolate(act.status)}</span></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DYyeCmOt.mjs.map
