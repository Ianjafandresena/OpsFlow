import { _ as __nuxt_component_0 } from './nuxt-link-D05iz29k.mjs';
import { withAsyncContext, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderStyle, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import { ListTodo, CheckCircle, Clock } from 'lucide-vue-next';
import { u as useCookie } from './cookie-BaSAbARY.mjs';
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
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import '@vue/shared';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const router = useRouter();
    const loggedEmployeId = useCookie("employe_id");
    if (!loggedEmployeId.value) {
      router.push("/");
    }
    const { data: employes } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/equipe",
      "$XYh78Ga4pe"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const myEmployeInfo = computed(() => {
      var _a;
      return (_a = employes.value) == null ? void 0 : _a.find((e) => e.id === loggedEmployeId.value);
    });
    const { data: affectations } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/affectations",
      "$gV5R5fr9W9"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const myAffectations = computed(() => {
      var _a;
      if (!affectations.value) return [];
      return ((_a = affectations.value.find((a) => a.id === loggedEmployeId.value)) == null ? void 0 : _a.editionsGerees) || [];
    });
    const { data: taches } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/taches",
      "$4wZK6JtrHb"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const myTaches = computed(() => {
      var _a;
      return ((_a = taches.value) == null ? void 0 : _a.filter((t) => t.employeId === loggedEmployeId.value)) || [];
    });
    const totalTasks = computed(() => myTaches.value.length);
    const doneTasks = computed(() => myTaches.value.filter((t) => {
      var _a, _b;
      return ((_a = t.statutTache) == null ? void 0 : _a.nom) === "Termin\xE9" || ((_b = t.statutTache) == null ? void 0 : _b.nom) === "Publi\xE9";
    }).length);
    const pendingTasks = computed(() => totalTasks.value - doneTasks.value);
    const recent = computed(() => {
      return [...myTaches.value].sort((a, b) => new Date(b.date_limite) - new Date(a.date_limite)).slice(0, 5);
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      if (myEmployeInfo.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "animate-fade-in" }, _attrs))}><div class="page-header"><div><h1 class="page-title">Bonjour, ${ssrInterpolate(myEmployeInfo.value.prenom)}</h1><p class="page-subtitle" style="${ssrRenderStyle({ "margin-bottom": "0" })}">Voici un r\xE9sum\xE9 de votre activit\xE9.</p></div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "0.5rem", "background": "var(--bg-surface)", "padding": "0.5rem 1rem", "border-radius": "8px", "border": "1px solid var(--border-light)" })}"><span style="${ssrRenderStyle({ "font-size": "0.8125rem", "font-weight": "600", "color": "var(--text-secondary)" })}">Connect\xE9 en tant que :</span><span class="badge badge-neutral">${ssrInterpolate(((_a = myEmployeInfo.value.poste) == null ? void 0 : _a.titre_poste) || "Employ\xE9")}</span></div></div><div class="kpi-grid kpi-grid-3" style="${ssrRenderStyle({ "margin-bottom": "1.5rem" })}"><div class="card kpi-card"><div class="kpi-icon">`);
        _push(ssrRenderComponent(unref(ListTodo), { size: 18 }, null, _parent));
        _push(`</div><div><div class="kpi-label">Total des t\xE2ches</div><div class="kpi-value">${ssrInterpolate(totalTasks.value)}</div></div></div><div class="card kpi-card"><div class="kpi-icon">`);
        _push(ssrRenderComponent(unref(CheckCircle), { size: 18 }, null, _parent));
        _push(`</div><div><div class="kpi-label">T\xE2ches termin\xE9es</div><div class="kpi-value" style="${ssrRenderStyle({ "color": "var(--status-success)" })}">${ssrInterpolate(doneTasks.value)}</div></div></div><div class="card kpi-card"><div class="kpi-icon">`);
        _push(ssrRenderComponent(unref(Clock), { size: 18 }, null, _parent));
        _push(`</div><div><div class="kpi-label">En attente / En cours</div><div class="kpi-value" style="${ssrRenderStyle({ "color": "var(--status-warning)" })}">${ssrInterpolate(pendingTasks.value)}</div></div></div></div><div class="card" style="${ssrRenderStyle({ "margin-bottom": "1.5rem" })}"><h3 style="${ssrRenderStyle({ "font-size": "0.9375rem", "font-weight": "600", "margin-bottom": "1rem" })}">Mes Projets Assign\xE9s</h3><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "repeat(auto-fill, minmax(220px, 1fr))", "gap": "0.75rem" })}"><!--[-->`);
        ssrRenderList(myAffectations.value, (page) => {
          var _a2, _b;
          _push(`<div style="${ssrRenderStyle({ "border": "1px solid var(--border-light)", "border-radius": "6px", "padding": "0.75rem 1rem" })}"><div style="${ssrRenderStyle({ "font-weight": "600", "font-size": "0.875rem", "margin-bottom": "0.25rem" })}">${ssrInterpolate((_a2 = page.licence) == null ? void 0 : _a2.nom_licence)} - ${ssrInterpolate((_b = page.ville) == null ? void 0 : _b.nom_ville)}</div><div style="${ssrRenderStyle({ "display": "flex", "gap": "0.25rem", "flex-wrap": "wrap", "margin-top": "0.5rem" })}"><span class="badge badge-neutral" style="${ssrRenderStyle({ "font-size": "0.625rem" })}">\xC9dition de base</span></div></div>`);
        });
        _push(`<!--]-->`);
        if (myAffectations.value.length === 0) {
          _push(`<div style="${ssrRenderStyle({ "color": "var(--text-secondary)", "font-size": "0.875rem" })}">Aucune affectation trouv\xE9e.</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="card" style="${ssrRenderStyle({ "padding": "0", "overflow": "hidden" })}"><div style="${ssrRenderStyle({ "padding": "1rem 1.25rem", "border-bottom": "1px solid var(--border-light)", "display": "flex", "justify-content": "space-between", "align-items": "center" })}"><h3 style="${ssrRenderStyle({ "font-size": "0.9375rem", "font-weight": "600" })}">Mes Derni\xE8res Activit\xE9s</h3>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/employe/taches",
          class: "btn btn-secondary btn-sm",
          style: { "text-decoration": "none" }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Voir tout`);
            } else {
              return [
                createTextVNode("Voir tout")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><table class="data-table"><thead><tr><th>T\xE2che</th><th>Projet</th><th>Date limite</th><th>Statut</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(recent.value, (act) => {
          var _a2, _b, _c, _d, _e, _f, _g, _h;
          _push(`<tr><td style="${ssrRenderStyle({ "font-weight": "500" })}">${ssrInterpolate(act.titre)}</td><td style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}">${ssrInterpolate((_b = (_a2 = act.edition) == null ? void 0 : _a2.licence) == null ? void 0 : _b.sigle)} - ${ssrInterpolate((_d = (_c = act.edition) == null ? void 0 : _c.ville) == null ? void 0 : _d.nom_ville)}</td><td style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}">${ssrInterpolate(new Date(act.date_limite).toLocaleDateString())}</td><td><span class="badge" style="${ssrRenderStyle({ background: ((_e = act.statutTache) == null ? void 0 : _e.couleur) + "20", color: (_f = act.statutTache) == null ? void 0 : _f.couleur, border: "1px solid " + ((_g = act.statutTache) == null ? void 0 : _g.couleur) })}">${ssrInterpolate((_h = act.statutTache) == null ? void 0 : _h.nom)}</span></td></tr>`);
        });
        _push(`<!--]-->`);
        if (recent.value.length === 0) {
          _push(`<tr><td colspan="4" style="${ssrRenderStyle({ "text-align": "center", "padding": "2rem", "color": "var(--text-secondary)" })}">Aucune t\xE2che r\xE9cente.</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/employe/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DUfedm6h.mjs.map
