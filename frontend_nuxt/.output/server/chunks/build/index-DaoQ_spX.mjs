import { _ as __nuxt_component_0 } from './nuxt-link-D05iz29k.mjs';
import { _ as __nuxt_component_0$1 } from './Modal-D-MuMCI8.mjs';
import { withAsyncContext, ref, mergeProps, withCtx, createTextVNode, unref, createVNode, withDirectives, openBlock, createBlock, Fragment, renderList, toDisplayString, vModelSelect, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import { u as useFetch } from './fetch-BEwQ1c2o.mjs';
import { u as useCookie } from './cookie-BaSAbARY.mjs';
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
    const { data: employes } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/equipe",
      "$5dVr3RDZW3"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const showLogin = ref(false);
    const selectedEmployeId = ref("");
    const router = useRouter();
    const loggedEmployeId = useCookie("employe_id");
    const login = () => {
      if (selectedEmployeId.value) {
        loggedEmployeId.value = selectedEmployeId.value;
        router.push("/employe");
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Modal = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ style: { "display": "flex", "align-items": "center", "justify-content": "center", "min-height": "100vh", "background": "var(--bg-app)" } }, _attrs))}><div class="animate-fade-in" style="${ssrRenderStyle({ "text-align": "center", "max-width": "480px", "padding": "2rem" })}"><div style="${ssrRenderStyle({ "width": "48px", "height": "48px", "background": "var(--accent-primary)", "border-radius": "10px", "display": "flex", "align-items": "center", "justify-content": "center", "color": "white", "font-weight": "700", "font-size": "1.125rem", "margin": "0 auto 1.5rem" })}">ES</div><h1 style="${ssrRenderStyle({ "font-size": "1.75rem", "font-weight": "700", "margin-bottom": "0.5rem", "letter-spacing": "-0.02em" })}">EventSync</h1><p style="${ssrRenderStyle({ "color": "var(--text-secondary)", "font-size": "0.9375rem", "margin-bottom": "2.5rem", "line-height": "1.6" })}"> Syst\xE8me centralis\xE9 de gestion du planning, suivi des t\xE2ches et \xE9valuation qualit\xE9 pour les \xE9v\xE9nements Japan Otaku Festival &amp; Japan Manga Wave. </p><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "0.75rem" })}">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin",
        class: "btn btn-primary",
        style: { "text-decoration": "none", "padding": "0.75rem 1.5rem", "font-size": "0.9375rem", "justify-content": "center" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Espace Administrateur `);
          } else {
            return [
              createTextVNode(" Espace Administrateur ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="btn btn-secondary" style="${ssrRenderStyle({ "width": "100%", "justify-content": "center", "padding": "0.75rem 1.5rem", "font-size": "0.9375rem" })}"> Espace Employ\xE9 (Connexion) </button></div><p style="${ssrRenderStyle({ "color": "var(--text-muted)", "font-size": "0.75rem", "margin-top": "2rem" })}">v1.0 \u2014 Architecture Modulaire Nuxt 3 + PostgreSQL</p></div>`);
      _push(ssrRenderComponent(_component_Modal, {
        isOpen: showLogin.value,
        title: "Connexion Employ\xE9",
        onClose: ($event) => showLogin.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "1rem" })}"${_scopeId}><p style="${ssrRenderStyle({ "color": "var(--text-secondary)", "font-size": "0.875rem" })}"${_scopeId}>S\xE9lectionnez un profil d&#39;employ\xE9 pour tester l&#39;affichage dynamique :</p><select class="form-input" style="${ssrRenderStyle({ "width": "100%" })}"${_scopeId}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(selectedEmployeId.value) ? ssrLooseContain(selectedEmployeId.value, "") : ssrLooseEqual(selectedEmployeId.value, "")) ? " selected" : ""}${_scopeId}>Choisir un profil...</option><!--[-->`);
            ssrRenderList(unref(employes), (emp) => {
              var _a;
              _push2(`<option${ssrRenderAttr("value", emp.id)}${ssrIncludeBooleanAttr(Array.isArray(selectedEmployeId.value) ? ssrLooseContain(selectedEmployeId.value, emp.id) : ssrLooseEqual(selectedEmployeId.value, emp.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(emp.nom)} ${ssrInterpolate(emp.prenom)} (${ssrInterpolate(((_a = emp.poste) == null ? void 0 : _a.titre_poste) || "Inconnu")}) </option>`);
            });
            _push2(`<!--]--></select><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "flex-end", "gap": "0.5rem", "margin-top": "1rem" })}"${_scopeId}><button class="btn btn-secondary"${_scopeId}>Annuler</button><button class="btn btn-primary"${ssrIncludeBooleanAttr(!selectedEmployeId.value) ? " disabled" : ""}${_scopeId}>Se connecter</button></div></div>`);
          } else {
            return [
              createVNode("div", { style: { "display": "flex", "flex-direction": "column", "gap": "1rem" } }, [
                createVNode("p", { style: { "color": "var(--text-secondary)", "font-size": "0.875rem" } }, "S\xE9lectionnez un profil d'employ\xE9 pour tester l'affichage dynamique :"),
                withDirectives(createVNode("select", {
                  "onUpdate:modelValue": ($event) => selectedEmployeId.value = $event,
                  class: "form-input",
                  style: { "width": "100%" }
                }, [
                  createVNode("option", {
                    value: "",
                    disabled: ""
                  }, "Choisir un profil..."),
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(employes), (emp) => {
                    var _a;
                    return openBlock(), createBlock("option", {
                      key: emp.id,
                      value: emp.id
                    }, toDisplayString(emp.nom) + " " + toDisplayString(emp.prenom) + " (" + toDisplayString(((_a = emp.poste) == null ? void 0 : _a.titre_poste) || "Inconnu") + ") ", 9, ["value"]);
                  }), 128))
                ], 8, ["onUpdate:modelValue"]), [
                  [vModelSelect, selectedEmployeId.value]
                ]),
                createVNode("div", { style: { "display": "flex", "justify-content": "flex-end", "gap": "0.5rem", "margin-top": "1rem" } }, [
                  createVNode("button", {
                    class: "btn btn-secondary",
                    onClick: ($event) => showLogin.value = false
                  }, "Annuler", 8, ["onClick"]),
                  createVNode("button", {
                    class: "btn btn-primary",
                    disabled: !selectedEmployeId.value,
                    onClick: login
                  }, "Se connecter", 8, ["disabled"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DaoQ_spX.mjs.map
