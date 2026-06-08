import { _ as __nuxt_component_0 } from './Modal-D-MuMCI8.mjs';
import { _ as __nuxt_component_1 } from './ConfirmModal-BqcDZ7j8.mjs';
import { withAsyncContext, ref, computed, mergeProps, unref, withCtx, createVNode, withModifiers, withDirectives, openBlock, createBlock, Fragment, renderList, toDisplayString, vModelSelect, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr } from 'vue/server-renderer';
import { Plus, Info, Trash2 } from 'lucide-vue-next';
import { u as useFetch } from './fetch-BEwQ1c2o.mjs';
import './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import '@vue/shared';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: employes, refresh: refreshEmployes } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/affectations",
      "$Rzi1P_lj4D"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: editions } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/editions",
      "$4CLAU4L8Qv"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const confirmModal = ref({ isOpen: false, title: "", message: "", onConfirm: null });
    const onConfirmExecute = async () => {
      if (confirmModal.value.onConfirm) await confirmModal.value.onConfirm();
      confirmModal.value.isOpen = false;
    };
    const modal = ref(false);
    const form = ref({ employeId: "", editionId: "" });
    const affectationsList = computed(() => {
      if (!employes.value) return [];
      const list = [];
      employes.value.forEach((emp) => {
        if (emp.editionsGerees && emp.editionsGerees.length > 0) {
          emp.editionsGerees.forEach((ed) => {
            var _a, _b, _c;
            list.push({
              employeId: emp.id,
              editionId: ed.id,
              collaborateur: `${emp.prenom} ${emp.nom}`,
              poste: ((_a = emp.poste) == null ? void 0 : _a.titre_poste) || "Inconnu",
              evenement: ((_b = ed.licence) == null ? void 0 : _b.nom_complet) || "Inconnu",
              ville: ((_c = ed.ville) == null ? void 0 : _c.nom_ville) || "Inconnue"
            });
          });
        }
      });
      return list;
    });
    const save = async () => {
      try {
        await $fetch("/api/affectations", { method: "POST", body: form.value });
        await refreshEmployes();
        modal.value = false;
      } catch (e) {
        alert("Erreur lors de l'affectation. Peut-\xEAtre que cette affectation existe d\xE9j\xE0 ?");
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Modal = __nuxt_component_0;
      const _component_ConfirmModal = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "animate-fade-in" }, _attrs))}><div class="page-header"><div><h1 class="page-title">Affectations</h1><p class="page-subtitle" style="${ssrRenderStyle({ "margin-bottom": "0" })}">Assignez les collaborateurs aux pages d&#39;\xE9v\xE9nements sp\xE9cifiques.</p></div><button class="btn btn-primary">`);
      _push(ssrRenderComponent(unref(Plus), { size: 15 }, null, _parent));
      _push(` Nouvelle Affectation </button></div><div class="info-banner info-banner-info" style="${ssrRenderStyle({ "margin-bottom": "1.25rem" })}">`);
      _push(ssrRenderComponent(unref(Info), {
        size: 16,
        style: { "margin-top": "2px", "flex-shrink": "0" }
      }, null, _parent));
      _push(`<div><strong>Principe :</strong> Chaque affectation lie un collaborateur \xE0 un \xE9v\xE9nement dans une ville. Un CM affect\xE9 \xE0 \xAB JOF - \xC9vreux \xBB ne verra que cette page dans son espace personnel. Un collaborateur peut \xEAtre affect\xE9 \xE0 plusieurs pages. </div></div><div class="card" style="${ssrRenderStyle({ "padding": "0", "overflow": "hidden" })}"><table class="data-table"><thead><tr><th>Collaborateur</th><th>Poste</th><th>\xC9v\xE9nement</th><th>Ville</th><th style="${ssrRenderStyle({ "text-align": "right" })}">Actions</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(affectationsList.value, (aff) => {
        _push(`<tr><td style="${ssrRenderStyle({ "font-weight": "600" })}">${ssrInterpolate(aff.collaborateur)}</td><td><span class="badge badge-neutral">${ssrInterpolate(aff.poste)}</span></td><td style="${ssrRenderStyle({ "font-weight": "500" })}">${ssrInterpolate(aff.evenement)}</td><td>${ssrInterpolate(aff.ville)}</td><td style="${ssrRenderStyle({ "text-align": "right" })}"><div class="actions-cell"><button class="btn-danger-ghost" title="Supprimer l&#39;affectation">`);
        _push(ssrRenderComponent(unref(Trash2), { size: 14 }, null, _parent));
        _push(`</button></div></td></tr>`);
      });
      _push(`<!--]-->`);
      if (affectationsList.value.length === 0) {
        _push(`<tr><td colspan="5" style="${ssrRenderStyle({ "text-align": "center", "padding": "2rem", "color": "var(--text-secondary)" })}">Aucune affectation trouv\xE9e.</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div>`);
      _push(ssrRenderComponent(_component_Modal, {
        isOpen: modal.value,
        title: "Nouvelle Affectation",
        onClose: ($event) => modal.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Collaborateur</label><select required class="form-input"${_scopeId}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(form.value.employeId) ? ssrLooseContain(form.value.employeId, "") : ssrLooseEqual(form.value.employeId, "")) ? " selected" : ""}${_scopeId}>Choisir un collaborateur</option><!--[-->`);
            ssrRenderList(unref(employes), (emp) => {
              var _a;
              _push2(`<option${ssrRenderAttr("value", emp.id)}${ssrIncludeBooleanAttr(Array.isArray(form.value.employeId) ? ssrLooseContain(form.value.employeId, emp.id) : ssrLooseEqual(form.value.employeId, emp.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(emp.nom)} ${ssrInterpolate(emp.prenom)} (${ssrInterpolate((_a = emp.poste) == null ? void 0 : _a.titre_poste)})</option>`);
            });
            _push2(`<!--]--></select></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>\xC9dition (Page)</label><select required class="form-input"${_scopeId}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(form.value.editionId) ? ssrLooseContain(form.value.editionId, "") : ssrLooseEqual(form.value.editionId, "")) ? " selected" : ""}${_scopeId}>Choisir une \xE9dition</option><!--[-->`);
            ssrRenderList(unref(editions), (ed) => {
              var _a, _b;
              _push2(`<option${ssrRenderAttr("value", ed.id)}${ssrIncludeBooleanAttr(Array.isArray(form.value.editionId) ? ssrLooseContain(form.value.editionId, ed.id) : ssrLooseEqual(form.value.editionId, ed.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate((_a = ed.licence) == null ? void 0 : _a.sigle)} - ${ssrInterpolate((_b = ed.ville) == null ? void 0 : _b.nom_ville)}</option>`);
            });
            _push2(`<!--]--></select></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "flex-end", "gap": "0.5rem", "margin-top": "0.5rem" })}"${_scopeId}><button type="button" class="btn btn-secondary"${_scopeId}>Annuler</button><button type="submit" class="btn btn-primary"${_scopeId}>Affecter</button></div></form>`);
          } else {
            return [
              createVNode("form", {
                onSubmit: withModifiers(save, ["prevent"]),
                style: { "display": "flex", "flex-direction": "column", "gap": "1rem" }
              }, [
                createVNode("div", { class: "form-group" }, [
                  createVNode("label", { class: "form-label" }, "Collaborateur"),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => form.value.employeId = $event,
                    required: "",
                    class: "form-input"
                  }, [
                    createVNode("option", {
                      value: "",
                      disabled: ""
                    }, "Choisir un collaborateur"),
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(employes), (emp) => {
                      var _a;
                      return openBlock(), createBlock("option", {
                        key: emp.id,
                        value: emp.id
                      }, toDisplayString(emp.nom) + " " + toDisplayString(emp.prenom) + " (" + toDisplayString((_a = emp.poste) == null ? void 0 : _a.titre_poste) + ")", 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, form.value.employeId]
                  ])
                ]),
                createVNode("div", { class: "form-group" }, [
                  createVNode("label", { class: "form-label" }, "\xC9dition (Page)"),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => form.value.editionId = $event,
                    required: "",
                    class: "form-input"
                  }, [
                    createVNode("option", {
                      value: "",
                      disabled: ""
                    }, "Choisir une \xE9dition"),
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(editions), (ed) => {
                      var _a, _b;
                      return openBlock(), createBlock("option", {
                        key: ed.id,
                        value: ed.id
                      }, toDisplayString((_a = ed.licence) == null ? void 0 : _a.sigle) + " - " + toDisplayString((_b = ed.ville) == null ? void 0 : _b.nom_ville), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, form.value.editionId]
                  ])
                ]),
                createVNode("div", { style: { "display": "flex", "justify-content": "flex-end", "gap": "0.5rem", "margin-top": "0.5rem" } }, [
                  createVNode("button", {
                    type: "button",
                    class: "btn btn-secondary",
                    onClick: ($event) => modal.value = false
                  }, "Annuler", 8, ["onClick"]),
                  createVNode("button", {
                    type: "submit",
                    class: "btn btn-primary"
                  }, "Affecter")
                ])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_ConfirmModal, {
        isOpen: confirmModal.value.isOpen,
        title: confirmModal.value.title,
        message: confirmModal.value.message,
        onConfirm: onConfirmExecute,
        onCancel: ($event) => confirmModal.value.isOpen = false
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/affectations/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DL6ss0iS.mjs.map
