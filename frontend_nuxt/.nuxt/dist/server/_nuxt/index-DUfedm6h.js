import { _ as __nuxt_component_0 } from "./nuxt-link-D05iz29k.js";
import { withAsyncContext, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderStyle, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
import { useRouter } from "vue-router";
import { ListTodo, CheckCircle, Clock } from "lucide-vue-next";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/hookable/dist/index.mjs";
import { u as useCookie } from "./cookie-BaSAbARY.js";
import { u as useFetch } from "./fetch-BEwQ1c2o.js";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/ufo/dist/index.mjs";
import "../server.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/unctx/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/h3/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/defu/dist/defu.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/cookie-es/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/destr/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/ohash/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/klona/dist/index.mjs";
import "@vue/shared";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/perfect-debounce/dist/index.mjs";
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
    const myEmployeInfo = computed(() => employes.value?.find((e) => e.id === loggedEmployeId.value));
    const { data: affectations } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/affectations",
      "$gV5R5fr9W9"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const myAffectations = computed(() => {
      if (!affectations.value) return [];
      return affectations.value.find((a) => a.id === loggedEmployeId.value)?.editionsGerees || [];
    });
    const { data: taches } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/taches",
      "$4wZK6JtrHb"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const myTaches = computed(() => taches.value?.filter((t) => t.employeId === loggedEmployeId.value) || []);
    const totalTasks = computed(() => myTaches.value.length);
    const doneTasks = computed(() => myTaches.value.filter((t) => t.statutTache?.nom === "Terminé" || t.statutTache?.nom === "Publié").length);
    const pendingTasks = computed(() => totalTasks.value - doneTasks.value);
    const recent = computed(() => {
      return [...myTaches.value].sort((a, b) => new Date(b.date_limite) - new Date(a.date_limite)).slice(0, 5);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      if (myEmployeInfo.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "animate-fade-in" }, _attrs))}><div class="page-header"><div><h1 class="page-title">Bonjour, ${ssrInterpolate(myEmployeInfo.value.prenom)}</h1><p class="page-subtitle" style="${ssrRenderStyle({ "margin-bottom": "0" })}">Voici un résumé de votre activité.</p></div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "0.5rem", "background": "var(--bg-surface)", "padding": "0.5rem 1rem", "border-radius": "8px", "border": "1px solid var(--border-light)" })}"><span style="${ssrRenderStyle({ "font-size": "0.8125rem", "font-weight": "600", "color": "var(--text-secondary)" })}">Connecté en tant que :</span><span class="badge badge-neutral">${ssrInterpolate(myEmployeInfo.value.poste?.titre_poste || "Employé")}</span></div></div><div class="kpi-grid kpi-grid-3" style="${ssrRenderStyle({ "margin-bottom": "1.5rem" })}"><div class="card kpi-card"><div class="kpi-icon">`);
        _push(ssrRenderComponent(unref(ListTodo), { size: 18 }, null, _parent));
        _push(`</div><div><div class="kpi-label">Total des tâches</div><div class="kpi-value">${ssrInterpolate(totalTasks.value)}</div></div></div><div class="card kpi-card"><div class="kpi-icon">`);
        _push(ssrRenderComponent(unref(CheckCircle), { size: 18 }, null, _parent));
        _push(`</div><div><div class="kpi-label">Tâches terminées</div><div class="kpi-value" style="${ssrRenderStyle({ "color": "var(--status-success)" })}">${ssrInterpolate(doneTasks.value)}</div></div></div><div class="card kpi-card"><div class="kpi-icon">`);
        _push(ssrRenderComponent(unref(Clock), { size: 18 }, null, _parent));
        _push(`</div><div><div class="kpi-label">En attente / En cours</div><div class="kpi-value" style="${ssrRenderStyle({ "color": "var(--status-warning)" })}">${ssrInterpolate(pendingTasks.value)}</div></div></div></div><div class="card" style="${ssrRenderStyle({ "margin-bottom": "1.5rem" })}"><h3 style="${ssrRenderStyle({ "font-size": "0.9375rem", "font-weight": "600", "margin-bottom": "1rem" })}">Mes Projets Assignés</h3><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "repeat(auto-fill, minmax(220px, 1fr))", "gap": "0.75rem" })}"><!--[-->`);
        ssrRenderList(myAffectations.value, (page) => {
          _push(`<div style="${ssrRenderStyle({ "border": "1px solid var(--border-light)", "border-radius": "6px", "padding": "0.75rem 1rem" })}"><div style="${ssrRenderStyle({ "font-weight": "600", "font-size": "0.875rem", "margin-bottom": "0.25rem" })}">${ssrInterpolate(page.licence?.nom_licence)} - ${ssrInterpolate(page.ville?.nom_ville)}</div><div style="${ssrRenderStyle({ "display": "flex", "gap": "0.25rem", "flex-wrap": "wrap", "margin-top": "0.5rem" })}"><span class="badge badge-neutral" style="${ssrRenderStyle({ "font-size": "0.625rem" })}">Édition de base</span></div></div>`);
        });
        _push(`<!--]-->`);
        if (myAffectations.value.length === 0) {
          _push(`<div style="${ssrRenderStyle({ "color": "var(--text-secondary)", "font-size": "0.875rem" })}">Aucune affectation trouvée.</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="card" style="${ssrRenderStyle({ "padding": "0", "overflow": "hidden" })}"><div style="${ssrRenderStyle({ "padding": "1rem 1.25rem", "border-bottom": "1px solid var(--border-light)", "display": "flex", "justify-content": "space-between", "align-items": "center" })}"><h3 style="${ssrRenderStyle({ "font-size": "0.9375rem", "font-weight": "600" })}">Mes Dernières Activités</h3>`);
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
        _push(`</div><table class="data-table"><thead><tr><th>Tâche</th><th>Projet</th><th>Date limite</th><th>Statut</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(recent.value, (act) => {
          _push(`<tr><td style="${ssrRenderStyle({ "font-weight": "500" })}">${ssrInterpolate(act.titre)}</td><td style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}">${ssrInterpolate(act.edition?.licence?.sigle)} - ${ssrInterpolate(act.edition?.ville?.nom_ville)}</td><td style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}">${ssrInterpolate(new Date(act.date_limite).toLocaleDateString())}</td><td><span class="badge" style="${ssrRenderStyle({ background: act.statutTache?.couleur + "20", color: act.statutTache?.couleur, border: "1px solid " + act.statutTache?.couleur })}">${ssrInterpolate(act.statutTache?.nom)}</span></td></tr>`);
        });
        _push(`<!--]-->`);
        if (recent.value.length === 0) {
          _push(`<tr><td colspan="4" style="${ssrRenderStyle({ "text-align": "center", "padding": "2rem", "color": "var(--text-secondary)" })}">Aucune tâche récente.</td></tr>`);
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
export {
  _sfc_main as default
};
//# sourceMappingURL=index-DUfedm6h.js.map
