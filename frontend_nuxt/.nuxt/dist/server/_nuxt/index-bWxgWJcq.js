import { withAsyncContext, computed, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { useRouter } from "vue-router";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/hookable/dist/index.mjs";
import { u as useCookie } from "./cookie-BaSAbARY.js";
import { u as useFetch } from "./fetch-BEwQ1c2o.js";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/cookie-es/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/h3/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/destr/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/ohash/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/klona/dist/index.mjs";
import "../server.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/unctx/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/defu/dist/defu.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/ufo/dist/index.mjs";
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
      "$YJ9hOKSMtM"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const myEmployeInfo = computed(() => employes.value?.find((e) => e.id === loggedEmployeId.value));
    const initials = computed(() => {
      if (myEmployeInfo.value) {
        return `${myEmployeInfo.value.prenom.charAt(0)}${myEmployeInfo.value.nom.charAt(0)}`.toUpperCase();
      }
      return "EM";
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (myEmployeInfo.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "animate-fade-in" }, _attrs))}><div class="page-header"><div><h1 class="page-title">Mon Profil</h1><p class="page-subtitle" style="${ssrRenderStyle({ "margin-bottom": "0" })}">Informations de votre compte (lecture seule).</p></div></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 2fr", "gap": "1.5rem" })}"><div class="card" style="${ssrRenderStyle({ "text-align": "center", "display": "flex", "flex-direction": "column", "align-items": "center", "gap": "1rem", "padding": "2rem" })}"><div style="${ssrRenderStyle({ "width": "80px", "height": "80px", "border-radius": "50%", "background": "var(--accent-blue)", "display": "flex", "align-items": "center", "justify-content": "center", "color": "white", "font-size": "1.75rem", "font-weight": "700" })}">${ssrInterpolate(initials.value)}</div><div><h2 style="${ssrRenderStyle({ "font-size": "1.125rem" })}">${ssrInterpolate(myEmployeInfo.value.prenom)} ${ssrInterpolate(myEmployeInfo.value.nom)}</h2><p style="${ssrRenderStyle({ "color": "var(--text-secondary)", "font-size": "0.8125rem" })}">${ssrInterpolate(myEmployeInfo.value.poste?.titre_poste)}</p></div><span class="badge badge-info">${ssrInterpolate(myEmployeInfo.value.role?.niveau_acces)}</span></div><div class="card"><h3 style="${ssrRenderStyle({ "font-size": "0.9375rem", "font-weight": "600", "margin-bottom": "1.25rem" })}">Informations du Compte</h3><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1.25rem" })}"><div><div class="form-label" style="${ssrRenderStyle({ "margin-bottom": "0.25rem" })}">Nom</div><div style="${ssrRenderStyle({ "font-weight": "500" })}">${ssrInterpolate(myEmployeInfo.value.nom)}</div></div><div><div class="form-label" style="${ssrRenderStyle({ "margin-bottom": "0.25rem" })}">Prénom</div><div style="${ssrRenderStyle({ "font-weight": "500" })}">${ssrInterpolate(myEmployeInfo.value.prenom)}</div></div><div><div class="form-label" style="${ssrRenderStyle({ "margin-bottom": "0.25rem" })}">Email</div><div style="${ssrRenderStyle({ "font-weight": "500" })}">${ssrInterpolate(myEmployeInfo.value.email)}</div></div><div><div class="form-label" style="${ssrRenderStyle({ "margin-bottom": "0.25rem" })}">Poste</div><div style="${ssrRenderStyle({ "font-weight": "500" })}">${ssrInterpolate(myEmployeInfo.value.poste?.titre_poste)}</div></div><div><div class="form-label" style="${ssrRenderStyle({ "margin-bottom": "0.25rem" })}">Département</div><div style="${ssrRenderStyle({ "font-weight": "500" })}">${ssrInterpolate(myEmployeInfo.value.poste?.departement?.nom_departement || "Non assigné")}</div></div><div><div class="form-label" style="${ssrRenderStyle({ "margin-bottom": "0.25rem" })}">Date d&#39;ajout</div><div style="${ssrRenderStyle({ "font-weight": "500" })}">Rejoint en 2026</div></div></div><div style="${ssrRenderStyle({ "border-top": "1px solid var(--border-light)", "margin-top": "1.5rem", "padding-top": "1.25rem" })}"><h3 style="${ssrRenderStyle({ "font-size": "0.9375rem", "font-weight": "600", "margin-bottom": "1rem" })}">Pages Assignées</h3><div style="${ssrRenderStyle({ "display": "flex", "gap": "0.5rem", "flex-wrap": "wrap" })}"><!--[-->`);
        ssrRenderList(myEmployeInfo.value.editionsGerees, (ed) => {
          _push(`<div style="${ssrRenderStyle({ "border": "1px solid var(--border-light)", "border-radius": "6px", "padding": "0.5rem 0.75rem" })}"><div style="${ssrRenderStyle({ "font-weight": "600", "font-size": "0.8125rem" })}">${ssrInterpolate(ed.licence?.sigle)} - ${ssrInterpolate(ed.ville?.nom_ville)}</div><div style="${ssrRenderStyle({ "font-size": "0.6875rem", "color": "var(--text-secondary)" })}">Manager</div></div>`);
        });
        _push(`<!--]-->`);
        if (!myEmployeInfo.value.editionsGerees || myEmployeInfo.value.editionsGerees.length === 0) {
          _push(`<div style="${ssrRenderStyle({ "font-size": "0.8125rem", "color": "var(--text-secondary)", "width": "100%" })}"> Aucune page assignée pour le moment. </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/employe/profil/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-bWxgWJcq.js.map
