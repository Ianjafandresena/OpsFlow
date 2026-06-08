import { _ as __nuxt_component_0 } from './Modal-D-MuMCI8.mjs';
import { _ as __nuxt_component_1 } from './ConfirmModal-BqcDZ7j8.mjs';
import { _ as __nuxt_component_2 } from './TacheDetailModal-DA3ccqFV.mjs';
import { withAsyncContext, computed, ref, mergeProps, unref, withCtx, createVNode, withModifiers, withDirectives, vModelText, openBlock, createBlock, Fragment, renderList, toDisplayString, vModelSelect, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-vue-next';
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
  __name: "dev",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: taches, refresh: refreshTaches } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/taches",
      { query: { typeTache: "DEV" } },
      "$CfLgnJAhD_"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: editions } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/editions",
      "$_PTmZ7nmtL"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: employes } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/equipe",
      "$BPHECDXVW0"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: statuts } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/taches/statuts",
      "$osBeTr7krk"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const devEquipe = computed(() => {
      if (!employes.value) return [];
      return employes.value.filter((e) => {
        var _a, _b, _c, _d;
        return ((_b = (_a = e.poste) == null ? void 0 : _a.titre_poste) == null ? void 0 : _b.includes("D\xE9veloppeur")) || ((_d = (_c = e.poste) == null ? void 0 : _c.departement) == null ? void 0 : _d.nom_departement) === "Technique";
      });
    });
    const modal = ref(false);
    const editing = ref(false);
    const detailModal = ref(false);
    const detailTache = ref(null);
    const confirmModal = ref({ isOpen: false, title: "", message: "", onConfirm: null });
    const onConfirmExecute = async () => {
      if (confirmModal.value.onConfirm) await confirmModal.value.onConfirm();
      confirmModal.value.isOpen = false;
    };
    const filters = ref({ search: "", editionId: "", employeId: "", statutTacheId: "" });
    const defaultForm = () => {
      var _a, _b;
      const defaultStatut = ((_b = (_a = statuts.value) == null ? void 0 : _a.find((s) => s.niveau_progression === 0)) == null ? void 0 : _b.id) || "";
      return {
        id: null,
        titre: "",
        employeId: "",
        editionId: "",
        statutTacheId: defaultStatut,
        date_limite: "",
        type_technique: "Site Vitrine",
        description: ""
      };
    };
    const form = ref(defaultForm());
    const filteredTasks = computed(() => {
      if (!taches.value) return [];
      return taches.value.filter((t) => {
        var _a;
        if (filters.value.search && !t.titre.toLowerCase().includes(filters.value.search.toLowerCase()) && !((_a = t.description) == null ? void 0 : _a.toLowerCase().includes(filters.value.search.toLowerCase()))) return false;
        if (filters.value.editionId && t.editionId !== filters.value.editionId) return false;
        if (filters.value.employeId && t.employeId !== filters.value.employeId) return false;
        if (filters.value.statutTacheId && t.statutTacheId !== filters.value.statutTacheId) return false;
        return true;
      });
    });
    const save = async () => {
      await $fetch("/api/taches", { method: "POST", body: form.value });
      await refreshTaches();
      modal.value = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Modal = __nuxt_component_0;
      const _component_ConfirmModal = __nuxt_component_1;
      const _component_TacheDetailModal = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "animate-fade-in" }, _attrs))}><div class="page-header"><div><h1 class="page-title">T\xE2ches D\xE9veloppeurs Web</h1><p class="page-subtitle" style="${ssrRenderStyle({ "margin-bottom": "0" })}">Gestion des sites vitrines, billetteries, et outils internes (EventSync).</p></div><button class="btn btn-primary">`);
      _push(ssrRenderComponent(unref(Plus), { size: 15 }, null, _parent));
      _push(` Nouvelle T\xE2che Tech </button></div><div class="card toolbar" style="${ssrRenderStyle({ "margin-bottom": "1.25rem" })}"><div class="search-wrapper">`);
      _push(ssrRenderComponent(unref(Search), {
        class: "search-icon",
        size: 14
      }, null, _parent));
      _push(`<input type="text"${ssrRenderAttr("value", filters.value.search)} placeholder="Rechercher une t\xE2che tech..." class="form-input"></div><select class="form-input"><option value=""${ssrIncludeBooleanAttr(Array.isArray(filters.value.editionId) ? ssrLooseContain(filters.value.editionId, "") : ssrLooseEqual(filters.value.editionId, "")) ? " selected" : ""}>Tous les Projets</option><!--[-->`);
      ssrRenderList(unref(editions), (ed) => {
        var _a, _b;
        _push(`<option${ssrRenderAttr("value", ed.id)}${ssrIncludeBooleanAttr(Array.isArray(filters.value.editionId) ? ssrLooseContain(filters.value.editionId, ed.id) : ssrLooseEqual(filters.value.editionId, ed.id)) ? " selected" : ""}>${ssrInterpolate((_a = ed.licence) == null ? void 0 : _a.sigle)} - ${ssrInterpolate((_b = ed.ville) == null ? void 0 : _b.nom_ville)}</option>`);
      });
      _push(`<!--]--></select><select class="form-input"><option value=""${ssrIncludeBooleanAttr(Array.isArray(filters.value.employeId) ? ssrLooseContain(filters.value.employeId, "") : ssrLooseEqual(filters.value.employeId, "")) ? " selected" : ""}>Tous les Devs</option><!--[-->`);
      ssrRenderList(devEquipe.value, (emp) => {
        _push(`<option${ssrRenderAttr("value", emp.id)}${ssrIncludeBooleanAttr(Array.isArray(filters.value.employeId) ? ssrLooseContain(filters.value.employeId, emp.id) : ssrLooseEqual(filters.value.employeId, emp.id)) ? " selected" : ""}>${ssrInterpolate(emp.nom)} ${ssrInterpolate(emp.prenom)}</option>`);
      });
      _push(`<!--]--></select><select class="form-input"><option value=""${ssrIncludeBooleanAttr(Array.isArray(filters.value.statutTacheId) ? ssrLooseContain(filters.value.statutTacheId, "") : ssrLooseEqual(filters.value.statutTacheId, "")) ? " selected" : ""}>Tous Statuts</option><!--[-->`);
      ssrRenderList(unref(statuts), (st) => {
        _push(`<option${ssrRenderAttr("value", st.id)}${ssrIncludeBooleanAttr(Array.isArray(filters.value.statutTacheId) ? ssrLooseContain(filters.value.statutTacheId, st.id) : ssrLooseEqual(filters.value.statutTacheId, st.id)) ? " selected" : ""}>${ssrInterpolate(st.nom)}</option>`);
      });
      _push(`<!--]--></select></div><div class="card" style="${ssrRenderStyle({ "padding": "0", "overflow": "hidden" })}"><table class="data-table"><thead><tr><th>Nom de la T\xE2che</th><th>Projet / \xC9v\xE9nement</th><th>Type</th><th>Assign\xE9 \xE0</th><th>Deadline</th><th>Statut</th><th style="${ssrRenderStyle({ "text-align": "right" })}">Actions</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(filteredTasks.value, (task) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        _push(`<tr><td style="${ssrRenderStyle({ "font-weight": "600" })}">${ssrInterpolate(task.titre)}</td><td style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}">${ssrInterpolate((_b = (_a = task.edition) == null ? void 0 : _a.licence) == null ? void 0 : _b.sigle)} - ${ssrInterpolate((_d = (_c = task.edition) == null ? void 0 : _c.ville) == null ? void 0 : _d.nom_ville)}</td><td><span class="badge badge-neutral">${ssrInterpolate(task.type_technique)}</span></td><td style="${ssrRenderStyle({ "font-weight": "500" })}">${ssrInterpolate((_e = task.employe) == null ? void 0 : _e.prenom)} ${ssrInterpolate((_f = task.employe) == null ? void 0 : _f.nom[0])}.</td><td style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}">${ssrInterpolate(new Date(task.date_limite).toLocaleDateString())}</td><td><span class="badge" style="${ssrRenderStyle({ background: ((_g = task.statutTache) == null ? void 0 : _g.couleur) + "20", color: (_h = task.statutTache) == null ? void 0 : _h.couleur, border: "1px solid " + ((_i = task.statutTache) == null ? void 0 : _i.couleur) })}">${ssrInterpolate((_j = task.statutTache) == null ? void 0 : _j.nom)}</span></td><td style="${ssrRenderStyle({ "text-align": "right" })}"><div class="actions-cell"><button class="btn btn-secondary btn-icon" title="Voir d\xE9tails">`);
        _push(ssrRenderComponent(unref(Eye), { size: 14 }, null, _parent));
        _push(`</button><button class="btn btn-secondary btn-icon" title="Modifier">`);
        _push(ssrRenderComponent(unref(Edit), { size: 14 }, null, _parent));
        _push(`</button><button class="btn-danger-ghost" title="Supprimer">`);
        _push(ssrRenderComponent(unref(Trash2), { size: 14 }, null, _parent));
        _push(`</button></div></td></tr>`);
      });
      _push(`<!--]-->`);
      if (filteredTasks.value.length === 0) {
        _push(`<tr><td colspan="7" style="${ssrRenderStyle({ "text-align": "center", "padding": "2rem", "color": "var(--text-secondary)" })}">Aucune t\xE2che tech trouv\xE9e.</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div>`);
      _push(ssrRenderComponent(_component_Modal, {
        isOpen: modal.value,
        title: editing.value ? "Modifier la T\xE2che Tech" : "Nouvelle T\xE2che Tech",
        onClose: ($event) => modal.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Titre de la T\xE2che</label><input type="text"${ssrRenderAttr("value", form.value.titre)} required class="form-input" placeholder="Ex: Page Billetterie JOF, Bug Fix..."${_scopeId}></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Attribuer \xE0 (D\xE9veloppeur)</label><select required class="form-input"${_scopeId}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(form.value.employeId) ? ssrLooseContain(form.value.employeId, "") : ssrLooseEqual(form.value.employeId, "")) ? " selected" : ""}${_scopeId}>Choisir</option><!--[-->`);
            ssrRenderList(devEquipe.value, (emp) => {
              _push2(`<option${ssrRenderAttr("value", emp.id)}${ssrIncludeBooleanAttr(Array.isArray(form.value.employeId) ? ssrLooseContain(form.value.employeId, emp.id) : ssrLooseEqual(form.value.employeId, emp.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(emp.nom)} ${ssrInterpolate(emp.prenom)}</option>`);
            });
            _push2(`<!--]--></select></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Projet / \xC9v\xE9nement</label><select required class="form-input"${_scopeId}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(form.value.editionId) ? ssrLooseContain(form.value.editionId, "") : ssrLooseEqual(form.value.editionId, "")) ? " selected" : ""}${_scopeId}>Choisir</option><!--[-->`);
            ssrRenderList(unref(editions), (ed) => {
              var _a, _b;
              _push2(`<option${ssrRenderAttr("value", ed.id)}${ssrIncludeBooleanAttr(Array.isArray(form.value.editionId) ? ssrLooseContain(form.value.editionId, ed.id) : ssrLooseEqual(form.value.editionId, ed.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate((_a = ed.licence) == null ? void 0 : _a.sigle)} - ${ssrInterpolate((_b = ed.ville) == null ? void 0 : _b.nom_ville)}</option>`);
            });
            _push2(`<!--]--></select></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Statut</label><select required class="form-input"${_scopeId}><!--[-->`);
            ssrRenderList(unref(statuts), (st) => {
              _push2(`<option${ssrRenderAttr("value", st.id)}${ssrIncludeBooleanAttr(Array.isArray(form.value.statutTacheId) ? ssrLooseContain(form.value.statutTacheId, st.id) : ssrLooseEqual(form.value.statutTacheId, st.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(st.nom)}</option>`);
            });
            _push2(`<!--]--></select></div></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Type Technique</label><select required class="form-input"${_scopeId}><option${ssrIncludeBooleanAttr(Array.isArray(form.value.type_technique) ? ssrLooseContain(form.value.type_technique, null) : ssrLooseEqual(form.value.type_technique, null)) ? " selected" : ""}${_scopeId}>Site Vitrine</option><option${ssrIncludeBooleanAttr(Array.isArray(form.value.type_technique) ? ssrLooseContain(form.value.type_technique, null) : ssrLooseEqual(form.value.type_technique, null)) ? " selected" : ""}${_scopeId}>Billetterie</option><option${ssrIncludeBooleanAttr(Array.isArray(form.value.type_technique) ? ssrLooseContain(form.value.type_technique, null) : ssrLooseEqual(form.value.type_technique, null)) ? " selected" : ""}${_scopeId}>App Interne</option><option${ssrIncludeBooleanAttr(Array.isArray(form.value.type_technique) ? ssrLooseContain(form.value.type_technique, null) : ssrLooseEqual(form.value.type_technique, null)) ? " selected" : ""}${_scopeId}>Maintenance</option><option${ssrIncludeBooleanAttr(Array.isArray(form.value.type_technique) ? ssrLooseContain(form.value.type_technique, null) : ssrLooseEqual(form.value.type_technique, null)) ? " selected" : ""}${_scopeId}>Autre</option></select></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Deadline</label><input type="datetime-local"${ssrRenderAttr("value", form.value.date_limite)} required class="form-input"${_scopeId}></div></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Sp\xE9cifications &amp; D\xE9tails</label><textarea class="form-input" rows="3" placeholder="Description technique, lien du ticket..."${_scopeId}>${ssrInterpolate(form.value.description)}</textarea></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "flex-end", "gap": "0.5rem", "margin-top": "0.5rem" })}"${_scopeId}><button type="button" class="btn btn-secondary"${_scopeId}>Annuler</button><button type="submit" class="btn btn-primary"${_scopeId}>${ssrInterpolate(editing.value ? "Enregistrer" : "Cr\xE9er")}</button></div></form>`);
          } else {
            return [
              createVNode("form", {
                onSubmit: withModifiers(save, ["prevent"]),
                style: { "display": "flex", "flex-direction": "column", "gap": "1rem" }
              }, [
                createVNode("div", { class: "form-group" }, [
                  createVNode("label", { class: "form-label" }, "Titre de la T\xE2che"),
                  withDirectives(createVNode("input", {
                    type: "text",
                    "onUpdate:modelValue": ($event) => form.value.titre = $event,
                    required: "",
                    class: "form-input",
                    placeholder: "Ex: Page Billetterie JOF, Bug Fix..."
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, form.value.titre]
                  ])
                ]),
                createVNode("div", { class: "form-group" }, [
                  createVNode("label", { class: "form-label" }, "Attribuer \xE0 (D\xE9veloppeur)"),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => form.value.employeId = $event,
                    required: "",
                    class: "form-input"
                  }, [
                    createVNode("option", {
                      value: "",
                      disabled: ""
                    }, "Choisir"),
                    (openBlock(true), createBlock(Fragment, null, renderList(devEquipe.value, (emp) => {
                      return openBlock(), createBlock("option", {
                        key: emp.id,
                        value: emp.id
                      }, toDisplayString(emp.nom) + " " + toDisplayString(emp.prenom), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, form.value.employeId]
                  ])
                ]),
                createVNode("div", { style: { "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" } }, [
                  createVNode("div", { class: "form-group" }, [
                    createVNode("label", { class: "form-label" }, "Projet / \xC9v\xE9nement"),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => form.value.editionId = $event,
                      required: "",
                      class: "form-input"
                    }, [
                      createVNode("option", {
                        value: "",
                        disabled: ""
                      }, "Choisir"),
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
                  createVNode("div", { class: "form-group" }, [
                    createVNode("label", { class: "form-label" }, "Statut"),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => form.value.statutTacheId = $event,
                      required: "",
                      class: "form-input"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(statuts), (st) => {
                        return openBlock(), createBlock("option", {
                          key: st.id,
                          value: st.id
                        }, toDisplayString(st.nom), 9, ["value"]);
                      }), 128))
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, form.value.statutTacheId]
                    ])
                  ])
                ]),
                createVNode("div", { style: { "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" } }, [
                  createVNode("div", { class: "form-group" }, [
                    createVNode("label", { class: "form-label" }, "Type Technique"),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => form.value.type_technique = $event,
                      required: "",
                      class: "form-input"
                    }, [
                      createVNode("option", null, "Site Vitrine"),
                      createVNode("option", null, "Billetterie"),
                      createVNode("option", null, "App Interne"),
                      createVNode("option", null, "Maintenance"),
                      createVNode("option", null, "Autre")
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, form.value.type_technique]
                    ])
                  ]),
                  createVNode("div", { class: "form-group" }, [
                    createVNode("label", { class: "form-label" }, "Deadline"),
                    withDirectives(createVNode("input", {
                      type: "datetime-local",
                      "onUpdate:modelValue": ($event) => form.value.date_limite = $event,
                      required: "",
                      class: "form-input"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, form.value.date_limite]
                    ])
                  ])
                ]),
                createVNode("div", { class: "form-group" }, [
                  createVNode("label", { class: "form-label" }, "Sp\xE9cifications & D\xE9tails"),
                  withDirectives(createVNode("textarea", {
                    "onUpdate:modelValue": ($event) => form.value.description = $event,
                    class: "form-input",
                    rows: "3",
                    placeholder: "Description technique, lien du ticket..."
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, form.value.description]
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
                  }, toDisplayString(editing.value ? "Enregistrer" : "Cr\xE9er"), 1)
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
      _push(ssrRenderComponent(_component_TacheDetailModal, {
        isOpen: detailModal.value,
        tache: detailTache.value,
        onClose: ($event) => detailModal.value = false
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/taches/dev.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dev-BGcNNOU5.mjs.map
