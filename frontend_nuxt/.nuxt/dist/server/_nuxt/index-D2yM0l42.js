import { _ as __nuxt_component_0 } from "./Modal-D-MuMCI8.js";
import { _ as __nuxt_component_1 } from "./ConfirmModal-BqcDZ7j8.js";
import { withAsyncContext, ref, computed, mergeProps, unref, withCtx, createVNode, withModifiers, withDirectives, vModelText, openBlock, createBlock, Fragment, renderList, toDisplayString, vModelSelect, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderClass } from "vue/server-renderer";
import { Plus, Search, Edit, Trash2 } from "lucide-vue-next";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/hookable/dist/index.mjs";
import { u as useFetch } from "./fetch-BEwQ1c2o.js";
import "../server.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/unctx/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/h3/dist/index.mjs";
import "vue-router";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/defu/dist/defu.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/ufo/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/ohash/dist/index.mjs";
import "@vue/shared";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/perfect-debounce/dist/index.mjs";
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: roles } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/roles",
      "$czBDUFMNkP"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: postes } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/postes",
      "$ystphNeTso"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: employes, refresh: refreshEmployes } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/equipe",
      "$Djw43sUSsu"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const confirmModal = ref({ isOpen: false, title: "", message: "", onConfirm: null });
    const onConfirmExecute = async () => {
      if (confirmModal.value.onConfirm) await confirmModal.value.onConfirm();
      confirmModal.value.isOpen = false;
    };
    const modal = ref(false);
    const editing = ref(false);
    const filters = ref({ search: "", poste: "", role: "" });
    const defaultForm = () => ({ id: null, nom: "", prenom: "", email: "", posteId: "", roleId: "" });
    const form = ref(defaultForm());
    const filteredTeam = computed(() => {
      if (!employes.value) return [];
      return employes.value.filter((e) => {
        if (filters.value.search && !(e.nom + " " + e.prenom).toLowerCase().includes(filters.value.search.toLowerCase())) return false;
        if (filters.value.poste && e.posteId !== filters.value.poste) return false;
        if (filters.value.role && e.roleId !== filters.value.role) return false;
        return true;
      });
    });
    const save = async () => {
      await $fetch("/api/equipe", { method: "POST", body: form.value });
      await refreshEmployes();
      modal.value = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Modal = __nuxt_component_0;
      const _component_ConfirmModal = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "animate-fade-in" }, _attrs))}><div class="page-header"><div><h1 class="page-title">Équipe &amp; Rôles</h1><p class="page-subtitle" style="${ssrRenderStyle({ "margin-bottom": "0" })}">Gestion des collaborateurs, postes et niveaux d&#39;accès.</p></div><button class="btn btn-primary">`);
      _push(ssrRenderComponent(unref(Plus), { size: 15 }, null, _parent));
      _push(` Ajouter un Collaborateur </button></div><div class="card toolbar" style="${ssrRenderStyle({ "margin-bottom": "1.25rem" })}"><div class="search-wrapper">`);
      _push(ssrRenderComponent(unref(Search), {
        class: "search-icon",
        size: 14
      }, null, _parent));
      _push(`<input type="text"${ssrRenderAttr("value", filters.value.search)} placeholder="Rechercher un collaborateur..." class="form-input"></div><select class="form-input"><option value=""${ssrIncludeBooleanAttr(Array.isArray(filters.value.poste) ? ssrLooseContain(filters.value.poste, "") : ssrLooseEqual(filters.value.poste, "")) ? " selected" : ""}>Tous les Postes</option><!--[-->`);
      ssrRenderList(unref(postes), (p) => {
        _push(`<option${ssrRenderAttr("value", p.id)}${ssrIncludeBooleanAttr(Array.isArray(filters.value.poste) ? ssrLooseContain(filters.value.poste, p.id) : ssrLooseEqual(filters.value.poste, p.id)) ? " selected" : ""}>${ssrInterpolate(p.titre_poste)}</option>`);
      });
      _push(`<!--]--></select><select class="form-input"><option value=""${ssrIncludeBooleanAttr(Array.isArray(filters.value.role) ? ssrLooseContain(filters.value.role, "") : ssrLooseEqual(filters.value.role, "")) ? " selected" : ""}>Tous Rôles Système</option><!--[-->`);
      ssrRenderList(unref(roles), (r) => {
        _push(`<option${ssrRenderAttr("value", r.id)}${ssrIncludeBooleanAttr(Array.isArray(filters.value.role) ? ssrLooseContain(filters.value.role, r.id) : ssrLooseEqual(filters.value.role, r.id)) ? " selected" : ""}>${ssrInterpolate(r.niveau_acces)}</option>`);
      });
      _push(`<!--]--></select></div><div class="card" style="${ssrRenderStyle({ "padding": "0", "overflow": "hidden" })}"><table class="data-table"><thead><tr><th>Nom Complet</th><th>Email</th><th>Poste</th><th>Département</th><th>Rôle Système</th><th style="${ssrRenderStyle({ "text-align": "right" })}">Actions</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(filteredTeam.value, (emp) => {
        _push(`<tr><td style="${ssrRenderStyle({ "font-weight": "600" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "0.5rem" })}"><div style="${ssrRenderStyle({ "width": "28px", "height": "28px", "border-radius": "50%", "display": "flex", "align-items": "center", "justify-content": "center", "font-size": "0.65rem", "font-weight": "600", "color": "white", "background": "#4f46e5" })}">${ssrInterpolate(emp.prenom[0])}${ssrInterpolate(emp.nom[0])}</div> ${ssrInterpolate(emp.nom)} ${ssrInterpolate(emp.prenom)}</div></td><td style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}">${ssrInterpolate(emp.email)}</td><td style="${ssrRenderStyle({ "font-weight": "500" })}">${ssrInterpolate(emp.poste?.titre_poste)}</td><td><span class="badge badge-neutral">${ssrInterpolate(emp.poste?.departement?.nom_departement)}</span></td><td><span class="${ssrRenderClass([emp.role?.niveau_acces === "ADMIN" ? "badge-danger" : "badge-info", "badge"])}">${ssrInterpolate(emp.role?.niveau_acces)}</span></td><td style="${ssrRenderStyle({ "text-align": "right" })}"><div class="actions-cell"><button class="btn btn-secondary btn-icon" title="Modifier">`);
        _push(ssrRenderComponent(unref(Edit), { size: 14 }, null, _parent));
        _push(`</button><button class="btn-danger-ghost" title="Supprimer">`);
        _push(ssrRenderComponent(unref(Trash2), { size: 14 }, null, _parent));
        _push(`</button></div></td></tr>`);
      });
      _push(`<!--]-->`);
      if (filteredTeam.value.length === 0) {
        _push(`<tr><td colspan="6" style="${ssrRenderStyle({ "text-align": "center", "padding": "2rem", "color": "var(--text-secondary)" })}">Aucun collaborateur trouvé.</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div>`);
      _push(ssrRenderComponent(_component_Modal, {
        isOpen: modal.value,
        title: editing.value ? "Modifier le Collaborateur" : "Ajouter un Collaborateur",
        onClose: ($event) => modal.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "1rem" })}"${_scopeId}><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Nom</label><input type="text"${ssrRenderAttr("value", form.value.nom)} required class="form-input"${_scopeId}></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Prénom</label><input type="text"${ssrRenderAttr("value", form.value.prenom)} required class="form-input"${_scopeId}></div></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Email</label><input type="email"${ssrRenderAttr("value", form.value.email)} required class="form-input"${_scopeId}></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Poste</label><select required class="form-input"${_scopeId}><!--[-->`);
            ssrRenderList(unref(postes), (p) => {
              _push2(`<option${ssrRenderAttr("value", p.id)}${ssrIncludeBooleanAttr(Array.isArray(form.value.posteId) ? ssrLooseContain(form.value.posteId, p.id) : ssrLooseEqual(form.value.posteId, p.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(p.titre_poste)} (${ssrInterpolate(p.departement?.nom_departement)})</option>`);
            });
            _push2(`<!--]--></select></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Rôle Système (Niveau d&#39;accès)</label><select required class="form-input"${_scopeId}><!--[-->`);
            ssrRenderList(unref(roles), (r) => {
              _push2(`<option${ssrRenderAttr("value", r.id)}${ssrIncludeBooleanAttr(Array.isArray(form.value.roleId) ? ssrLooseContain(form.value.roleId, r.id) : ssrLooseEqual(form.value.roleId, r.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(r.niveau_acces)}</option>`);
            });
            _push2(`<!--]--></select></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "flex-end", "gap": "0.5rem", "margin-top": "0.5rem" })}"${_scopeId}><button type="button" class="btn btn-secondary"${_scopeId}>Annuler</button><button type="submit" class="btn btn-primary"${_scopeId}>${ssrInterpolate(editing.value ? "Enregistrer" : "Créer")}</button></div></form>`);
          } else {
            return [
              createVNode("form", {
                onSubmit: withModifiers(save, ["prevent"]),
                style: { "display": "flex", "flex-direction": "column", "gap": "1rem" }
              }, [
                createVNode("div", { style: { "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" } }, [
                  createVNode("div", { class: "form-group" }, [
                    createVNode("label", { class: "form-label" }, "Nom"),
                    withDirectives(createVNode("input", {
                      type: "text",
                      "onUpdate:modelValue": ($event) => form.value.nom = $event,
                      required: "",
                      class: "form-input"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, form.value.nom]
                    ])
                  ]),
                  createVNode("div", { class: "form-group" }, [
                    createVNode("label", { class: "form-label" }, "Prénom"),
                    withDirectives(createVNode("input", {
                      type: "text",
                      "onUpdate:modelValue": ($event) => form.value.prenom = $event,
                      required: "",
                      class: "form-input"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, form.value.prenom]
                    ])
                  ])
                ]),
                createVNode("div", { class: "form-group" }, [
                  createVNode("label", { class: "form-label" }, "Email"),
                  withDirectives(createVNode("input", {
                    type: "email",
                    "onUpdate:modelValue": ($event) => form.value.email = $event,
                    required: "",
                    class: "form-input"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, form.value.email]
                  ])
                ]),
                createVNode("div", { class: "form-group" }, [
                  createVNode("label", { class: "form-label" }, "Poste"),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => form.value.posteId = $event,
                    required: "",
                    class: "form-input"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(postes), (p) => {
                      return openBlock(), createBlock("option", {
                        key: p.id,
                        value: p.id
                      }, toDisplayString(p.titre_poste) + " (" + toDisplayString(p.departement?.nom_departement) + ")", 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, form.value.posteId]
                  ])
                ]),
                createVNode("div", { class: "form-group" }, [
                  createVNode("label", { class: "form-label" }, "Rôle Système (Niveau d'accès)"),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => form.value.roleId = $event,
                    required: "",
                    class: "form-input"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(roles), (r) => {
                      return openBlock(), createBlock("option", {
                        key: r.id,
                        value: r.id
                      }, toDisplayString(r.niveau_acces), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, form.value.roleId]
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
                  }, toDisplayString(editing.value ? "Enregistrer" : "Créer"), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/equipe/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-D2yM0l42.js.map
