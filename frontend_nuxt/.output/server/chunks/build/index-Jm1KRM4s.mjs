import { _ as __nuxt_component_0 } from './Modal-D-MuMCI8.mjs';
import { _ as __nuxt_component_1 } from './ConfirmModal-BqcDZ7j8.mjs';
import { withAsyncContext, ref, mergeProps, unref, withCtx, createVNode, withModifiers, withDirectives, openBlock, createBlock, Fragment, renderList, toDisplayString, vModelSelect, vModelText, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { Plus, Calendar, Edit, Trash2 } from 'lucide-vue-next';
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
    const { data: typesEv, refresh: refreshTypes } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/licences",
      "$MHAEFsUKxK"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: villes, refresh: refreshVilles } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/villes",
      "$AEhUvW9beq"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: editions, refresh: refreshEditions } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/editions",
      "$3jkTiOL9yx"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: themes, refresh: refreshThemes } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/themes",
      "$JELUuhzloN"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const getTypeName = (tid) => {
      var _a;
      const t = (_a = typesEv.value) == null ? void 0 : _a.find((x) => x.id === tid);
      return t ? `${t.nom_complet} (${t.sigle})` : "Inconnu";
    };
    const getPageName = (ev) => {
      var _a, _b;
      const t = (_a = typesEv.value) == null ? void 0 : _a.find((x) => x.id === ev.licenceId);
      const v = (_b = villes.value) == null ? void 0 : _b.find((x) => x.id === ev.villeId);
      if (t && v) return `${t.sigle} - ${v.nom_ville}`;
      return "Page Inconnue";
    };
    const getPreviewPageName = () => {
      if (!form.value.licenceId || !form.value.villeId) return "...";
      return getPageName(form.value);
    };
    const formatDate = (dateStr) => {
      if (!dateStr) return "?";
      const d = new Date(dateStr);
      return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
    };
    const confirmModal = ref({ isOpen: false, title: "", message: "", onConfirm: null });
    const onConfirmExecute = async () => {
      if (confirmModal.value.onConfirm) {
        await confirmModal.value.onConfirm();
      }
      confirmModal.value.isOpen = false;
    };
    const modal = ref(false);
    const editing = ref(false);
    const defaultForm = () => ({ id: null, licenceId: "", villeId: "", date_debut: "", date_fin: "", metaPageId: "" });
    const form = ref(defaultForm());
    const save = async () => {
      await $fetch("/api/editions", { method: "POST", body: form.value });
      await refreshEditions();
      modal.value = false;
    };
    const modalType = ref(false);
    const formType = ref({ nom_complet: "", sigle: "" });
    const saveType = async () => {
      await $fetch("/api/licences", { method: "POST", body: formType.value });
      await refreshTypes();
      modalType.value = false;
    };
    const modalVille = ref(false);
    const formVille = ref({ nom_ville: "" });
    const saveVille = async () => {
      await $fetch("/api/villes", { method: "POST", body: formVille.value });
      await refreshVilles();
      modalVille.value = false;
    };
    const modalTheme = ref(false);
    const editingTheme = ref(false);
    const defaultFormTheme = () => ({ id: null, nom_theme: "" });
    const formTheme = ref(defaultFormTheme());
    const saveTheme = async () => {
      await $fetch("/api/themes", { method: "POST", body: formTheme.value });
      await refreshThemes();
      modalTheme.value = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Modal = __nuxt_component_0;
      const _component_ConfirmModal = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "animate-fade-in",
        style: { "display": "flex", "flex-direction": "column", "gap": "3rem" }
      }, _attrs))}><section><div class="page-header"><div><h1 class="page-title">\xC9ditions Planifi\xE9es (Projets/Pages)</h1><p class="page-subtitle" style="${ssrRenderStyle({ "margin-bottom": "0" })}">Planifiez une \xE9dition en associant une Licence et une Ville.</p></div><button class="btn btn-primary">`);
      _push(ssrRenderComponent(unref(Plus), { size: 15 }, null, _parent));
      _push(` Planifier une \xE9dition </button></div><div class="card" style="${ssrRenderStyle({ "padding": "0", "overflow": "hidden" })}"><table class="data-table"><thead><tr><th>Type d&#39;\xE9v\xE9nement</th><th>Ville / Page concern\xE9e</th><th>Dates</th><th style="${ssrRenderStyle({ "text-align": "right" })}">Actions</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(unref(editions), (ev) => {
        _push(`<tr><td style="${ssrRenderStyle({ "font-weight": "600" })}"><span class="badge badge-neutral" style="${ssrRenderStyle({ "font-weight": "600" })}">${ssrInterpolate(getTypeName(ev.typeId))}</span></td><td style="${ssrRenderStyle({ "font-weight": "500", "font-size": "0.9375rem" })}">${ssrInterpolate(getPageName(ev))}</td><td style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "0.375rem" })}">`);
        _push(ssrRenderComponent(unref(Calendar), { size: 14 }, null, _parent));
        _push(` ${ssrInterpolate(formatDate(ev.date_debut))} au ${ssrInterpolate(formatDate(ev.date_fin))}</div></td><td style="${ssrRenderStyle({ "text-align": "right" })}"><div class="actions-cell"><button class="btn btn-secondary btn-icon" title="Modifier">`);
        _push(ssrRenderComponent(unref(Edit), { size: 14 }, null, _parent));
        _push(`</button><button class="btn-danger-ghost" title="Supprimer">`);
        _push(ssrRenderComponent(unref(Trash2), { size: 14 }, null, _parent));
        _push(`</button></div></td></tr>`);
      });
      _push(`<!--]-->`);
      if (unref(editions).length === 0) {
        _push(`<tr><td colspan="4" style="${ssrRenderStyle({ "text-align": "center", "padding": "2rem", "color": "var(--text-secondary)" })}">Aucun \xE9v\xE9nement planifi\xE9.</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div></section><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "2rem" })}"><section><div class="page-header" style="${ssrRenderStyle({ "margin-bottom": "1rem" })}"><div><h2 class="page-title" style="${ssrRenderStyle({ "font-size": "1.1rem" })}">Types d&#39;\xC9v\xE9nements</h2><p class="page-subtitle" style="${ssrRenderStyle({ "margin-bottom": "0", "font-size": "0.8rem" })}">G\xE9rez les licences (ex: JOF, JMW).</p></div><button class="btn btn-secondary" style="${ssrRenderStyle({ "font-size": "0.8rem", "padding": "0.3rem 0.6rem" })}">`);
      _push(ssrRenderComponent(unref(Plus), { size: 14 }, null, _parent));
      _push(` Ajouter </button></div><div class="card" style="${ssrRenderStyle({ "padding": "0", "overflow": "hidden" })}"><table class="data-table"><thead><tr><th>Nom &amp; Sigle</th><th style="${ssrRenderStyle({ "text-align": "right" })}">Actions</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(unref(typesEv), (t) => {
        _push(`<tr><td style="${ssrRenderStyle({ "font-weight": "600" })}">${ssrInterpolate(t.nom_complet)} <span style="${ssrRenderStyle({ "color": "var(--text-secondary)", "font-size": "0.8rem" })}">(${ssrInterpolate(t.sigle)})</span></td><td style="${ssrRenderStyle({ "text-align": "right" })}"><button class="btn-danger-ghost" title="Supprimer" style="${ssrRenderStyle({ "padding": "0.25rem" })}">`);
        _push(ssrRenderComponent(unref(Trash2), { size: 14 }, null, _parent));
        _push(`</button></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></section><section><div class="page-header" style="${ssrRenderStyle({ "margin-bottom": "1rem" })}"><div><h2 class="page-title" style="${ssrRenderStyle({ "font-size": "1.1rem" })}">Villes</h2><p class="page-subtitle" style="${ssrRenderStyle({ "margin-bottom": "0", "font-size": "0.8rem" })}">G\xE9rez la liste des villes.</p></div><button class="btn btn-secondary" style="${ssrRenderStyle({ "font-size": "0.8rem", "padding": "0.3rem 0.6rem" })}">`);
      _push(ssrRenderComponent(unref(Plus), { size: 14 }, null, _parent));
      _push(` Ajouter </button></div><div class="card" style="${ssrRenderStyle({ "padding": "0", "overflow": "hidden" })}"><table class="data-table"><thead><tr><th>Nom de la ville</th><th style="${ssrRenderStyle({ "text-align": "right" })}">Actions</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(unref(villes), (v) => {
        _push(`<tr><td style="${ssrRenderStyle({ "font-weight": "600" })}">${ssrInterpolate(v.nom_ville)}</td><td style="${ssrRenderStyle({ "text-align": "right" })}"><button class="btn-danger-ghost" title="Supprimer" style="${ssrRenderStyle({ "padding": "0.25rem" })}">`);
        _push(ssrRenderComponent(unref(Trash2), { size: 14 }, null, _parent));
        _push(`</button></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></section></div><section><div class="page-header"><div><h2 class="page-title">Th\xE8mes de Publication</h2><p class="page-subtitle" style="${ssrRenderStyle({ "margin-bottom": "0" })}">G\xE9rez les sujets par d\xE9faut pour les posts et les sponsorisations.</p></div><button class="btn btn-primary">`);
      _push(ssrRenderComponent(unref(Plus), { size: 15 }, null, _parent));
      _push(` Ajouter un Th\xE8me </button></div><div class="card" style="${ssrRenderStyle({ "padding": "0", "overflow": "hidden", "max-width": "600px" })}"><table class="data-table"><thead><tr><th>Nom du Th\xE8me (Sujet)</th><th style="${ssrRenderStyle({ "text-align": "right" })}">Actions</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(unref(themes), (t) => {
        _push(`<tr><td style="${ssrRenderStyle({ "font-weight": "600" })}">${ssrInterpolate(t.nom_theme)}</td><td style="${ssrRenderStyle({ "text-align": "right" })}"><div class="actions-cell"><button class="btn btn-secondary btn-icon" title="Modifier">`);
        _push(ssrRenderComponent(unref(Edit), { size: 14 }, null, _parent));
        _push(`</button><button class="btn-danger-ghost" title="Supprimer">`);
        _push(ssrRenderComponent(unref(Trash2), { size: 14 }, null, _parent));
        _push(`</button></div></td></tr>`);
      });
      _push(`<!--]-->`);
      if (unref(themes).length === 0) {
        _push(`<tr><td colspan="2" style="${ssrRenderStyle({ "text-align": "center", "padding": "2rem", "color": "var(--text-secondary)" })}">Aucun th\xE8me configur\xE9.</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div></section>`);
      _push(ssrRenderComponent(_component_Modal, {
        isOpen: modal.value,
        title: editing.value ? "Modifier l'\xE9dition" : "Planifier une \xE9dition",
        onClose: ($event) => modal.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Type d&#39;\xE9v\xE9nement</label><select required class="form-input"${_scopeId}><!--[-->`);
            ssrRenderList(unref(typesEv), (t) => {
              _push2(`<option${ssrRenderAttr("value", t.id)}${ssrIncludeBooleanAttr(Array.isArray(form.value.licenceId) ? ssrLooseContain(form.value.licenceId, t.id) : ssrLooseEqual(form.value.licenceId, t.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(t.nom_complet)} (${ssrInterpolate(t.sigle)})</option>`);
            });
            _push2(`<!--]--></select></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Ville d&#39;accueil</label><select required class="form-input"${_scopeId}><!--[-->`);
            ssrRenderList(unref(villes), (v) => {
              _push2(`<option${ssrRenderAttr("value", v.id)}${ssrIncludeBooleanAttr(Array.isArray(form.value.villeId) ? ssrLooseContain(form.value.villeId, v.id) : ssrLooseEqual(form.value.villeId, v.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(v.nom_ville)}</option>`);
            });
            _push2(`<!--]--></select></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Date de d\xE9but</label><input type="date"${ssrRenderAttr("value", form.value.date_debut)} required class="form-input"${_scopeId}></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Date de fin</label><input type="date"${ssrRenderAttr("value", form.value.date_fin)} required class="form-input"${_scopeId}></div></div><div class="form-group" style="${ssrRenderStyle({ "margin-top": "1rem", "padding": "1rem", "background": "var(--bg-background)", "border-radius": "8px" })}"${_scopeId}><label style="${ssrRenderStyle({ "font-size": "0.75rem", "color": "var(--text-secondary)" })}"${_scopeId}>Nom de la Page g\xE9n\xE9r\xE9 :</label><div style="${ssrRenderStyle({ "font-weight": "bold", "font-size": "1.1rem", "color": "var(--accent-primary)" })}"${_scopeId}>${ssrInterpolate(getPreviewPageName())}</div></div><div class="form-group"${_scopeId}><label class="form-label" style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "0.5rem" })}"${_scopeId}> ID de la page Meta (Facebook/Instagram) <span class="badge" style="${ssrRenderStyle({ "background": "#1877f215", "color": "#1877f2", "font-size": "0.6rem", "padding": "0.15rem 0.35rem" })}"${_scopeId}>Optionnel</span></label><input type="text"${ssrRenderAttr("value", form.value.metaPageId)} class="form-input" placeholder="Ex: 1040738735799993"${_scopeId}><div style="${ssrRenderStyle({ "font-size": "0.7rem", "color": "var(--text-muted)", "margin-top": "0.25rem" })}"${_scopeId}>Permet \xE0 l&#39;agent IA de r\xE9cup\xE9rer les statistiques de cette page.</div></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "flex-end", "gap": "0.5rem", "margin-top": "1rem" })}"${_scopeId}><button type="button" class="btn btn-secondary"${_scopeId}>Annuler</button><button type="submit" class="btn btn-primary"${_scopeId}>${ssrInterpolate(editing.value ? "Enregistrer" : "Planifier")}</button></div></form>`);
          } else {
            return [
              createVNode("form", {
                onSubmit: withModifiers(save, ["prevent"]),
                style: { "display": "flex", "flex-direction": "column", "gap": "1rem" }
              }, [
                createVNode("div", { class: "form-group" }, [
                  createVNode("label", { class: "form-label" }, "Type d'\xE9v\xE9nement"),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => form.value.licenceId = $event,
                    required: "",
                    class: "form-input"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(typesEv), (t) => {
                      return openBlock(), createBlock("option", {
                        key: t.id,
                        value: t.id
                      }, toDisplayString(t.nom_complet) + " (" + toDisplayString(t.sigle) + ")", 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, form.value.licenceId]
                  ])
                ]),
                createVNode("div", { class: "form-group" }, [
                  createVNode("label", { class: "form-label" }, "Ville d'accueil"),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => form.value.villeId = $event,
                    required: "",
                    class: "form-input"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(villes), (v) => {
                      return openBlock(), createBlock("option", {
                        key: v.id,
                        value: v.id
                      }, toDisplayString(v.nom_ville), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, form.value.villeId]
                  ])
                ]),
                createVNode("div", { style: { "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" } }, [
                  createVNode("div", { class: "form-group" }, [
                    createVNode("label", { class: "form-label" }, "Date de d\xE9but"),
                    withDirectives(createVNode("input", {
                      type: "date",
                      "onUpdate:modelValue": ($event) => form.value.date_debut = $event,
                      required: "",
                      class: "form-input"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, form.value.date_debut]
                    ])
                  ]),
                  createVNode("div", { class: "form-group" }, [
                    createVNode("label", { class: "form-label" }, "Date de fin"),
                    withDirectives(createVNode("input", {
                      type: "date",
                      "onUpdate:modelValue": ($event) => form.value.date_fin = $event,
                      required: "",
                      class: "form-input"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, form.value.date_fin]
                    ])
                  ])
                ]),
                createVNode("div", {
                  class: "form-group",
                  style: { "margin-top": "1rem", "padding": "1rem", "background": "var(--bg-background)", "border-radius": "8px" }
                }, [
                  createVNode("label", { style: { "font-size": "0.75rem", "color": "var(--text-secondary)" } }, "Nom de la Page g\xE9n\xE9r\xE9 :"),
                  createVNode("div", { style: { "font-weight": "bold", "font-size": "1.1rem", "color": "var(--accent-primary)" } }, toDisplayString(getPreviewPageName()), 1)
                ]),
                createVNode("div", { class: "form-group" }, [
                  createVNode("label", {
                    class: "form-label",
                    style: { "display": "flex", "align-items": "center", "gap": "0.5rem" }
                  }, [
                    createTextVNode(" ID de la page Meta (Facebook/Instagram) "),
                    createVNode("span", {
                      class: "badge",
                      style: { "background": "#1877f215", "color": "#1877f2", "font-size": "0.6rem", "padding": "0.15rem 0.35rem" }
                    }, "Optionnel")
                  ]),
                  withDirectives(createVNode("input", {
                    type: "text",
                    "onUpdate:modelValue": ($event) => form.value.metaPageId = $event,
                    class: "form-input",
                    placeholder: "Ex: 1040738735799993"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, form.value.metaPageId]
                  ]),
                  createVNode("div", { style: { "font-size": "0.7rem", "color": "var(--text-muted)", "margin-top": "0.25rem" } }, "Permet \xE0 l'agent IA de r\xE9cup\xE9rer les statistiques de cette page.")
                ]),
                createVNode("div", { style: { "display": "flex", "justify-content": "flex-end", "gap": "0.5rem", "margin-top": "1rem" } }, [
                  createVNode("button", {
                    type: "button",
                    class: "btn btn-secondary",
                    onClick: ($event) => modal.value = false
                  }, "Annuler", 8, ["onClick"]),
                  createVNode("button", {
                    type: "submit",
                    class: "btn btn-primary"
                  }, toDisplayString(editing.value ? "Enregistrer" : "Planifier"), 1)
                ])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Modal, {
        isOpen: modalType.value,
        title: "Ajouter une Licence",
        onClose: ($event) => modalType.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Nom Complet</label><input type="text"${ssrRenderAttr("value", formType.value.nom_complet)} required class="form-input" placeholder="Ex: Japan Otaku Festival"${_scopeId}></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Sigle</label><input type="text"${ssrRenderAttr("value", formType.value.sigle)} required class="form-input" placeholder="Ex: JOF"${_scopeId}></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "flex-end", "gap": "0.5rem", "margin-top": "1rem" })}"${_scopeId}><button type="submit" class="btn btn-primary"${_scopeId}>Cr\xE9er</button></div></form>`);
          } else {
            return [
              createVNode("form", {
                onSubmit: withModifiers(saveType, ["prevent"]),
                style: { "display": "flex", "flex-direction": "column", "gap": "1rem" }
              }, [
                createVNode("div", { class: "form-group" }, [
                  createVNode("label", { class: "form-label" }, "Nom Complet"),
                  withDirectives(createVNode("input", {
                    type: "text",
                    "onUpdate:modelValue": ($event) => formType.value.nom_complet = $event,
                    required: "",
                    class: "form-input",
                    placeholder: "Ex: Japan Otaku Festival"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, formType.value.nom_complet]
                  ])
                ]),
                createVNode("div", { class: "form-group" }, [
                  createVNode("label", { class: "form-label" }, "Sigle"),
                  withDirectives(createVNode("input", {
                    type: "text",
                    "onUpdate:modelValue": ($event) => formType.value.sigle = $event,
                    required: "",
                    class: "form-input",
                    placeholder: "Ex: JOF"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, formType.value.sigle]
                  ])
                ]),
                createVNode("div", { style: { "display": "flex", "justify-content": "flex-end", "gap": "0.5rem", "margin-top": "1rem" } }, [
                  createVNode("button", {
                    type: "submit",
                    class: "btn btn-primary"
                  }, "Cr\xE9er")
                ])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Modal, {
        isOpen: modalVille.value,
        title: "Ajouter une Ville",
        onClose: ($event) => modalVille.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Nom de la Ville</label><input type="text"${ssrRenderAttr("value", formVille.value.nom_ville)} required class="form-input" placeholder="Ex: Paris"${_scopeId}></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "flex-end", "gap": "0.5rem", "margin-top": "1rem" })}"${_scopeId}><button type="submit" class="btn btn-primary"${_scopeId}>Cr\xE9er</button></div></form>`);
          } else {
            return [
              createVNode("form", {
                onSubmit: withModifiers(saveVille, ["prevent"]),
                style: { "display": "flex", "flex-direction": "column", "gap": "1rem" }
              }, [
                createVNode("div", { class: "form-group" }, [
                  createVNode("label", { class: "form-label" }, "Nom de la Ville"),
                  withDirectives(createVNode("input", {
                    type: "text",
                    "onUpdate:modelValue": ($event) => formVille.value.nom_ville = $event,
                    required: "",
                    class: "form-input",
                    placeholder: "Ex: Paris"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, formVille.value.nom_ville]
                  ])
                ]),
                createVNode("div", { style: { "display": "flex", "justify-content": "flex-end", "gap": "0.5rem", "margin-top": "1rem" } }, [
                  createVNode("button", {
                    type: "submit",
                    class: "btn btn-primary"
                  }, "Cr\xE9er")
                ])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Modal, {
        isOpen: modalTheme.value,
        title: editingTheme.value ? "Modifier le Th\xE8me" : "Nouveau Th\xE8me",
        onClose: ($event) => modalTheme.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Nom du Th\xE8me</label><input type="text"${ssrRenderAttr("value", formTheme.value.nom_theme)} required class="form-input" placeholder="Ex: Pass VIP, Annonce, Concours..."${_scopeId}></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "flex-end", "gap": "0.5rem", "margin-top": "1rem" })}"${_scopeId}><button type="button" class="btn btn-secondary"${_scopeId}>Annuler</button><button type="submit" class="btn btn-primary"${_scopeId}>${ssrInterpolate(editingTheme.value ? "Enregistrer" : "Cr\xE9er")}</button></div></form>`);
          } else {
            return [
              createVNode("form", {
                onSubmit: withModifiers(saveTheme, ["prevent"]),
                style: { "display": "flex", "flex-direction": "column", "gap": "1rem" }
              }, [
                createVNode("div", { class: "form-group" }, [
                  createVNode("label", { class: "form-label" }, "Nom du Th\xE8me"),
                  withDirectives(createVNode("input", {
                    type: "text",
                    "onUpdate:modelValue": ($event) => formTheme.value.nom_theme = $event,
                    required: "",
                    class: "form-input",
                    placeholder: "Ex: Pass VIP, Annonce, Concours..."
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, formTheme.value.nom_theme]
                  ])
                ]),
                createVNode("div", { style: { "display": "flex", "justify-content": "flex-end", "gap": "0.5rem", "margin-top": "1rem" } }, [
                  createVNode("button", {
                    type: "button",
                    class: "btn btn-secondary",
                    onClick: ($event) => modalTheme.value = false
                  }, "Annuler", 8, ["onClick"]),
                  createVNode("button", {
                    type: "submit",
                    class: "btn btn-primary"
                  }, toDisplayString(editingTheme.value ? "Enregistrer" : "Cr\xE9er"), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/parametres/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Jm1KRM4s.mjs.map
