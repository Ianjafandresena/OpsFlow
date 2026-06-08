import { withAsyncContext, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderClass, ssrRenderAttr } from "vue/server-renderer";
import { Megaphone, Film, Palette, Users } from "lucide-vue-next";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/hookable/dist/index.mjs";
import { u as useFetch } from "./fetch-BEwQ1c2o.js";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/ohash/dist/index.mjs";
import "@vue/shared";
import "../server.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/unctx/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/h3/dist/index.mjs";
import "vue-router";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/defu/dist/defu.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/ufo/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/perfect-debounce/dist/index.mjs";
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
          quantite: "Quantité",
          format_video: "Format Vidéo",
          duree_cible: "Durée Cible",
          type_technique: "Type Technique",
          type_demarche: "Type Démarche",
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
    const pubsCount = computed(() => taches.value?.filter((t) => t.type_pub || t.type_demarche || t.budget).length || 0);
    const vidsCount = computed(() => taches.value?.filter((t) => t.format_video).length || 0);
    const visuelsCount = computed(() => taches.value?.filter((t) => t.type_visuel).length || 0);
    const employesCount = computed(() => employes.value?.length || 0);
    const alerts = computed(() => {
      if (!taches.value) return [];
      const now = /* @__PURE__ */ new Date();
      return taches.value.filter((t) => new Date(t.date_limite) < now && t.statutTache?.nom !== "Terminé" && t.statutTache?.nom !== "Publié").slice(0, 3).map((t) => ({
        id: t.id,
        label: `${t.edition?.licence?.sigle} - ${t.titre}`,
        detail: `Deadline dépassée (${new Date(t.date_limite).toLocaleDateString()})`,
        type: "Retard",
        badgeClass: "badge-danger"
      }));
    });
    const recentActivity = computed(() => {
      if (!taches.value) return [];
      return [...taches.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5).map((t) => ({
        id: t.id,
        name: t.employe ? `${t.employe.prenom} ${t.employe.nom[0]}.` : "Inconnu",
        dept: t.employe?.poste?.departement?.nom_departement || "N/A",
        task: t.titre,
        date: new Date(t.createdAt).toLocaleDateString(),
        status: t.statutTache?.nom,
        color: t.statutTache?.couleur
      }));
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "animate-fade-in" }, _attrs))}><div class="page-header"><div><h1 class="page-title">Supervision Globale</h1><p class="page-subtitle" style="${ssrRenderStyle({ "margin-bottom": "0" })}">Vue d&#39;ensemble de l&#39;activité de tous les départements.</p></div></div>`);
      if (unref(demandes) && unref(demandes).length > 0) {
        _push(`<div class="card" style="${ssrRenderStyle({ "margin-bottom": "1.5rem", "border-color": "var(--accent-purple)" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "space-between", "margin-bottom": "1rem" })}"><h3 style="${ssrRenderStyle({ "font-size": "0.9375rem", "font-weight": "600", "display": "flex", "align-items": "center", "gap": "0.5rem", "color": "var(--accent-purple)" })}"><span style="${ssrRenderStyle({ "display": "inline-block", "width": "8px", "height": "8px", "background": "var(--accent-purple)", "border-radius": "50%" })}"></span> Demandes de collaborateurs en attente </h3><span class="badge" style="${ssrRenderStyle({ "background": "var(--accent-purple)20", "color": "var(--accent-purple)", "font-weight": "600" })}">${ssrInterpolate(unref(demandes).length)} nouvelles</span></div><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "0.75rem" })}"><!--[-->`);
        ssrRenderList(unref(demandes), (dem) => {
          _push(`<div class="card" style="${ssrRenderStyle({ "padding": "0.75rem 1rem", "border-color": "var(--border-light)", "display": "flex", "justify-content": "space-between", "align-items": "center", "background": "#fafafa", "gap": "1rem", "flex-wrap": "wrap" })}"><div style="${ssrRenderStyle({ "flex": "1", "min-width": "250px" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "0.5rem", "margin-bottom": "0.35rem", "flex-wrap": "wrap" })}"><span class="badge" style="${ssrRenderStyle({
            background: dem.typeDemande === "SUPPRESSION" ? "var(--status-danger-bg)" : "var(--status-info-bg)",
            color: dem.typeDemande === "SUPPRESSION" ? "var(--status-danger)" : "var(--status-info)",
            border: dem.typeDemande === "SUPPRESSION" ? "1px solid rgba(239,68,68,0.15)" : "1px solid rgba(59,130,246,0.15)"
          })}">${ssrInterpolate(dem.typeDemande === "SUPPRESSION" ? "SUPPRESSION" : "MODIFICATION")}</span><strong style="${ssrRenderStyle({ "font-size": "0.8125rem" })}">${ssrInterpolate(dem.tache?.titre)}</strong><span style="${ssrRenderStyle({ "font-size": "0.75rem", "color": "var(--text-secondary)" })}">demandé par <strong>${ssrInterpolate(dem.tache?.employe?.prenom)} ${ssrInterpolate(dem.tache?.employe?.nom)}</strong></span></div><div style="${ssrRenderStyle({ "font-size": "0.8125rem", "color": "var(--text-secondary)", "margin-bottom": "0.25rem", "line-height": "1.4" })}"><strong>Motif :</strong> &quot;${ssrInterpolate(dem.motif)}&quot; </div>`);
          if (dem.typeDemande === "MODIFICATION" && getModifDetails(dem)) {
            _push(`<div style="${ssrRenderStyle({ "font-size": "0.75rem", "background": "white", "border": "1px solid var(--border-light)", "border-radius": "6px", "padding": "0.5rem 0.75rem", "margin-top": "0.5rem", "max-width": "600px", "box-shadow": "inset 0 1px 2px rgba(0,0,0,0.02)" })}"><div style="${ssrRenderStyle({ "font-weight": "600", "color": "var(--text-muted)", "margin-bottom": "0.35rem", "font-size": "0.7rem", "text-transform": "uppercase", "letter-spacing": "0.025em" })}">Changements proposés :</div><ul style="${ssrRenderStyle({ "padding-left": "1rem", "margin": "0", "color": "var(--text-secondary)", "display": "flex", "flex-direction": "column", "gap": "0.25rem" })}"><!--[-->`);
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
      _push(`</div><div><div class="kpi-label">Montages Vidéo</div><div class="kpi-value">${ssrInterpolate(vidsCount.value)}</div></div></div><div class="card kpi-card"><div class="kpi-icon">`);
      _push(ssrRenderComponent(unref(Palette), { size: 18 }, null, _parent));
      _push(`</div><div><div class="kpi-label">Visuels Créés</div><div class="kpi-value">${ssrInterpolate(visuelsCount.value)}</div></div></div><div class="card kpi-card"><div class="kpi-icon">`);
      _push(ssrRenderComponent(unref(Users), { size: 18 }, null, _parent));
      _push(`</div><div><div class="kpi-label">Collaborateurs Actifs</div><div class="kpi-value">${ssrInterpolate(employesCount.value)}</div></div></div></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "2fr 1fr", "gap": "1.5rem", "margin-bottom": "1.5rem" })}"><div class="card"><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "margin-bottom": "1.25rem" })}"><div><div style="${ssrRenderStyle({ "font-size": "0.75rem", "color": "var(--text-secondary)", "font-weight": "500" })}">Score Qualité Moyen</div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "baseline", "gap": "0.5rem" })}"><span style="${ssrRenderStyle({ "font-size": "1.5rem", "font-weight": "700" })}">89/100</span><span class="badge badge-success">↑ 2.4%</span></div></div><select class="form-input" style="${ssrRenderStyle({ "padding": "0.3rem 0.5rem", "font-size": "0.75rem" })}"><option>30 derniers jours</option><option>7 derniers jours</option><option>Tout</option></select></div><div style="${ssrRenderStyle({ "height": "160px", "background": "linear-gradient(180deg, rgba(229,231,235,0.4) 0%, transparent 100%)", "border-radius": "4px", "border-bottom": "2px solid var(--accent-primary)", "display": "flex", "align-items": "flex-end", "padding": "0 1rem" })}"><div style="${ssrRenderStyle({ "width": "100%", "display": "flex", "justify-content": "space-between", "color": "var(--text-muted)", "font-size": "0.6875rem", "padding-bottom": "0.5rem" })}"><span>1 Mai</span><span>15 Mai</span><span>1 Juin</span></div></div></div><div class="card" style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column" })}"><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "margin-bottom": "1rem" })}"><h3 style="${ssrRenderStyle({ "font-size": "0.875rem", "font-weight": "600" })}">Alertes &amp; Retards</h3><span class="badge badge-danger">${ssrInterpolate(alerts.value.length)}</span></div><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "0.75rem", "flex": "1" })}"><!--[-->`);
      ssrRenderList(alerts.value, (alert) => {
        _push(`<div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "padding-bottom": "0.75rem", "border-bottom": "1px dashed var(--border-light)" })}"><div><div style="${ssrRenderStyle({ "font-weight": "500", "font-size": "0.8125rem" })}">${ssrInterpolate(alert.label)}</div><div style="${ssrRenderStyle({ "font-size": "0.6875rem", "color": "var(--text-secondary)" })}">${ssrInterpolate(alert.detail)}</div></div><span class="${ssrRenderClass([alert.badgeClass, "badge"])}">${ssrInterpolate(alert.type)}</span></div>`);
      });
      _push(`<!--]--></div></div></div><div class="card" style="${ssrRenderStyle({ "padding": "0", "overflow": "hidden" })}"><div style="${ssrRenderStyle({ "padding": "1rem 1.25rem", "border-bottom": "1px solid var(--border-light)", "display": "flex", "justify-content": "space-between", "align-items": "center" })}"><h3 style="${ssrRenderStyle({ "font-size": "0.9375rem", "font-weight": "600" })}">Activité Récente (Toutes Équipes)</h3></div><table class="data-table"><thead><tr><th>Collaborateur</th><th>Département</th><th>Tâche</th><th>Date</th><th>Statut</th></tr></thead><tbody><!--[-->`);
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
export {
  _sfc_main as default
};
//# sourceMappingURL=index-DYyeCmOt.js.map
