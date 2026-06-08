import { withAsyncContext, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
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
      "$YJ9hOKSMtM"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const myEmployeInfo = computed(() => {
      var _a;
      return (_a = employes.value) == null ? void 0 : _a.find((e) => e.id === loggedEmployeId.value);
    });
    const initials = computed(() => {
      if (myEmployeInfo.value) {
        return `${myEmployeInfo.value.prenom.charAt(0)}${myEmployeInfo.value.nom.charAt(0)}`.toUpperCase();
      }
      return "EM";
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e;
      if (myEmployeInfo.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "animate-fade-in" }, _attrs))}><div class="page-header"><div><h1 class="page-title">Mon Profil</h1><p class="page-subtitle" style="${ssrRenderStyle({ "margin-bottom": "0" })}">Informations de votre compte (lecture seule).</p></div></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 2fr", "gap": "1.5rem" })}"><div class="card" style="${ssrRenderStyle({ "text-align": "center", "display": "flex", "flex-direction": "column", "align-items": "center", "gap": "1rem", "padding": "2rem" })}"><div style="${ssrRenderStyle({ "width": "80px", "height": "80px", "border-radius": "50%", "background": "var(--accent-blue)", "display": "flex", "align-items": "center", "justify-content": "center", "color": "white", "font-size": "1.75rem", "font-weight": "700" })}">${ssrInterpolate(initials.value)}</div><div><h2 style="${ssrRenderStyle({ "font-size": "1.125rem" })}">${ssrInterpolate(myEmployeInfo.value.prenom)} ${ssrInterpolate(myEmployeInfo.value.nom)}</h2><p style="${ssrRenderStyle({ "color": "var(--text-secondary)", "font-size": "0.8125rem" })}">${ssrInterpolate((_a = myEmployeInfo.value.poste) == null ? void 0 : _a.titre_poste)}</p></div><span class="badge badge-info">${ssrInterpolate((_b = myEmployeInfo.value.role) == null ? void 0 : _b.niveau_acces)}</span></div><div class="card"><h3 style="${ssrRenderStyle({ "font-size": "0.9375rem", "font-weight": "600", "margin-bottom": "1.25rem" })}">Informations du Compte</h3><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1.25rem" })}"><div><div class="form-label" style="${ssrRenderStyle({ "margin-bottom": "0.25rem" })}">Nom</div><div style="${ssrRenderStyle({ "font-weight": "500" })}">${ssrInterpolate(myEmployeInfo.value.nom)}</div></div><div><div class="form-label" style="${ssrRenderStyle({ "margin-bottom": "0.25rem" })}">Pr\xE9nom</div><div style="${ssrRenderStyle({ "font-weight": "500" })}">${ssrInterpolate(myEmployeInfo.value.prenom)}</div></div><div><div class="form-label" style="${ssrRenderStyle({ "margin-bottom": "0.25rem" })}">Email</div><div style="${ssrRenderStyle({ "font-weight": "500" })}">${ssrInterpolate(myEmployeInfo.value.email)}</div></div><div><div class="form-label" style="${ssrRenderStyle({ "margin-bottom": "0.25rem" })}">Poste</div><div style="${ssrRenderStyle({ "font-weight": "500" })}">${ssrInterpolate((_c = myEmployeInfo.value.poste) == null ? void 0 : _c.titre_poste)}</div></div><div><div class="form-label" style="${ssrRenderStyle({ "margin-bottom": "0.25rem" })}">D\xE9partement</div><div style="${ssrRenderStyle({ "font-weight": "500" })}">${ssrInterpolate(((_e = (_d = myEmployeInfo.value.poste) == null ? void 0 : _d.departement) == null ? void 0 : _e.nom_departement) || "Non assign\xE9")}</div></div><div><div class="form-label" style="${ssrRenderStyle({ "margin-bottom": "0.25rem" })}">Date d&#39;ajout</div><div style="${ssrRenderStyle({ "font-weight": "500" })}">Rejoint en 2026</div></div></div><div style="${ssrRenderStyle({ "border-top": "1px solid var(--border-light)", "margin-top": "1.5rem", "padding-top": "1.25rem" })}"><h3 style="${ssrRenderStyle({ "font-size": "0.9375rem", "font-weight": "600", "margin-bottom": "1rem" })}">Pages Assign\xE9es</h3><div style="${ssrRenderStyle({ "display": "flex", "gap": "0.5rem", "flex-wrap": "wrap" })}"><!--[-->`);
        ssrRenderList(myEmployeInfo.value.editionsGerees, (ed) => {
          var _a2, _b2;
          _push(`<div style="${ssrRenderStyle({ "border": "1px solid var(--border-light)", "border-radius": "6px", "padding": "0.5rem 0.75rem" })}"><div style="${ssrRenderStyle({ "font-weight": "600", "font-size": "0.8125rem" })}">${ssrInterpolate((_a2 = ed.licence) == null ? void 0 : _a2.sigle)} - ${ssrInterpolate((_b2 = ed.ville) == null ? void 0 : _b2.nom_ville)}</div><div style="${ssrRenderStyle({ "font-size": "0.6875rem", "color": "var(--text-secondary)" })}">Manager</div></div>`);
        });
        _push(`<!--]-->`);
        if (!myEmployeInfo.value.editionsGerees || myEmployeInfo.value.editionsGerees.length === 0) {
          _push(`<div style="${ssrRenderStyle({ "font-size": "0.8125rem", "color": "var(--text-secondary)", "width": "100%" })}"> Aucune page assign\xE9e pour le moment. </div>`);
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

export { _sfc_main as default };
//# sourceMappingURL=index-bWxgWJcq.mjs.map
