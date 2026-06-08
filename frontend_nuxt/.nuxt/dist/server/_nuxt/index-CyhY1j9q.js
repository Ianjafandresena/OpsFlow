import { _ as __nuxt_component_0 } from "./Modal-D-MuMCI8.js";
import { _ as __nuxt_component_1 } from "./ConfirmModal-BqcDZ7j8.js";
import { ref, mergeProps, unref, withCtx, createVNode, withModifiers, withDirectives, vModelText, vModelSelect, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { Plus, Info, Edit, Trash2 } from "lucide-vue-next";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/hookable/dist/index.mjs";
import "../server.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/unctx/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/h3/dist/index.mjs";
import "vue-router";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/defu/dist/defu.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/ufo/dist/index.mjs";
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const modal = ref(false);
    const editing = ref(false);
    const confirmModal = ref({ isOpen: false, title: "", message: "", onConfirm: null });
    const onConfirmExecute = async () => {
      if (confirmModal.value.onConfirm) await confirmModal.value.onConfirm();
      confirmModal.value.isOpen = false;
    };
    const defaultForm = () => ({ id: null, nom: "", url: "", actif: true });
    const form = ref(defaultForm());
    const platforms = ref([
      { id: 1, nom: "Facebook", url: "https://facebook.com", actif: true },
      { id: 2, nom: "Instagram", url: "https://instagram.com", actif: true },
      { id: 3, nom: "X (Twitter)", url: "https://x.com", actif: false }
    ]);
    const save = () => {
      if (editing.value) {
        const i = platforms.value.findIndex((p) => p.id === form.value.id);
        if (i !== -1) platforms.value[i] = { ...form.value };
      } else {
        platforms.value.push({ ...form.value, id: Date.now() });
      }
      modal.value = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Modal = __nuxt_component_0;
      const _component_ConfirmModal = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "animate-fade-in" }, _attrs))}><div class="page-header"><div><h1 class="page-title">Gestion des Plateformes</h1><p class="page-subtitle" style="${ssrRenderStyle({ "margin-bottom": "0" })}">Réseaux sociaux gérés par le système. Ajoutez ou retirez des plateformes selon vos besoins.</p></div><button class="btn btn-primary">`);
      _push(ssrRenderComponent(unref(Plus), { size: 15 }, null, _parent));
      _push(` Ajouter une Plateforme </button></div><div class="info-banner info-banner-info" style="${ssrRenderStyle({ "margin-bottom": "1.25rem" })}">`);
      _push(ssrRenderComponent(unref(Info), {
        size: 16,
        style: { "margin-top": "2px", "flex-shrink": "0" }
      }, null, _parent));
      _push(`<div>Les plateformes définies ici apparaissent dans les listes de choix lors de la planification de publications et dans les affectations de pages.</div></div><div class="card" style="${ssrRenderStyle({ "padding": "0", "overflow": "hidden" })}"><table class="data-table"><thead><tr><th>Nom de la Plateforme</th><th>URL de Base</th><th>Statut</th><th style="${ssrRenderStyle({ "text-align": "right" })}">Actions</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(platforms.value, (p) => {
        _push(`<tr><td style="${ssrRenderStyle({ "font-weight": "600" })}">${ssrInterpolate(p.nom)}</td><td style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}">${ssrInterpolate(p.url)}</td><td><span class="${ssrRenderClass([p.actif ? "badge-success" : "badge-neutral", "badge"])}">${ssrInterpolate(p.actif ? "Actif" : "Inactif")}</span></td><td style="${ssrRenderStyle({ "text-align": "right" })}"><div class="actions-cell"><button class="btn btn-secondary btn-icon" title="Modifier">`);
        _push(ssrRenderComponent(unref(Edit), { size: 14 }, null, _parent));
        _push(`</button><button class="btn-danger-ghost" title="Supprimer">`);
        _push(ssrRenderComponent(unref(Trash2), { size: 14 }, null, _parent));
        _push(`</button></div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div>`);
      _push(ssrRenderComponent(_component_Modal, {
        isOpen: modal.value,
        title: editing.value ? "Modifier la Plateforme" : "Ajouter une Plateforme",
        onClose: ($event) => modal.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Nom de la Plateforme</label><input type="text"${ssrRenderAttr("value", form.value.nom)} required class="form-input" placeholder="Ex: TikTok"${_scopeId}></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>URL de Base</label><input type="url"${ssrRenderAttr("value", form.value.url)} class="form-input" placeholder="https://tiktok.com"${_scopeId}></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Statut</label><select class="form-input"${_scopeId}><option${ssrRenderAttr("value", true)}${ssrIncludeBooleanAttr(Array.isArray(form.value.actif) ? ssrLooseContain(form.value.actif, true) : ssrLooseEqual(form.value.actif, true)) ? " selected" : ""}${_scopeId}>Actif</option><option${ssrRenderAttr("value", false)}${ssrIncludeBooleanAttr(Array.isArray(form.value.actif) ? ssrLooseContain(form.value.actif, false) : ssrLooseEqual(form.value.actif, false)) ? " selected" : ""}${_scopeId}>Inactif</option></select></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "flex-end", "gap": "0.5rem", "margin-top": "0.5rem" })}"${_scopeId}><button type="button" class="btn btn-secondary"${_scopeId}>Annuler</button><button type="submit" class="btn btn-primary"${_scopeId}>${ssrInterpolate(editing.value ? "Enregistrer" : "Créer")}</button></div></form>`);
          } else {
            return [
              createVNode("form", {
                onSubmit: withModifiers(save, ["prevent"]),
                style: { "display": "flex", "flex-direction": "column", "gap": "1rem" }
              }, [
                createVNode("div", { class: "form-group" }, [
                  createVNode("label", { class: "form-label" }, "Nom de la Plateforme"),
                  withDirectives(createVNode("input", {
                    type: "text",
                    "onUpdate:modelValue": ($event) => form.value.nom = $event,
                    required: "",
                    class: "form-input",
                    placeholder: "Ex: TikTok"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, form.value.nom]
                  ])
                ]),
                createVNode("div", { class: "form-group" }, [
                  createVNode("label", { class: "form-label" }, "URL de Base"),
                  withDirectives(createVNode("input", {
                    type: "url",
                    "onUpdate:modelValue": ($event) => form.value.url = $event,
                    class: "form-input",
                    placeholder: "https://tiktok.com"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, form.value.url]
                  ])
                ]),
                createVNode("div", { class: "form-group" }, [
                  createVNode("label", { class: "form-label" }, "Statut"),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => form.value.actif = $event,
                    class: "form-input"
                  }, [
                    createVNode("option", { value: true }, "Actif"),
                    createVNode("option", { value: false }, "Inactif")
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, form.value.actif]
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/plateformes/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-CyhY1j9q.js.map
