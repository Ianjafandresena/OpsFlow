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
  __name: "monteur",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: taches, refresh: refreshTaches } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/taches",
      { query: { typeTache: "MONTEUR" } },
      "$RBymTs50gp"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: editions } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/editions",
      "$_dqDzXZW4_"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: employes } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/equipe",
      "$f7uaYMIMM1"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: statuts } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/taches/statuts",
      "$pJPoNVJRWi"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const monteurEquipe = computed(() => {
      if (!employes.value) return [];
      return employes.value.filter((e) => {
        var _a, _b;
        return (_b = (_a = e.poste) == null ? void 0 : _a.titre_poste) == null ? void 0 : _b.includes("Monteur Vid\xE9o");
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
    const filters = ref({ search: "", employeId: "", statutTacheId: "" });
    const defaultForm = () => {
      var _a, _b;
      const defaultStatut = ((_b = (_a = statuts.value) == null ? void 0 : _a.find((s) => s.niveau_progression === 0)) == null ? void 0 : _b.id) || "";
      return {
        id: null,
        titre: "",
        employeId: "",
        editionId: null,
        statutTacheId: defaultStatut,
        date_limite: "",
        typeTache: "MONTEUR",
        demandeur: "",
        description: ""
      };
    };
    const form = ref(defaultForm());
    const filteredTasks = computed(() => {
      if (!taches.value) return [];
      return taches.value.filter((t) => {
        var _a;
        if (filters.value.search && !t.titre.toLowerCase().includes(filters.value.search.toLowerCase()) && !((_a = t.description) == null ? void 0 : _a.toLowerCase().includes(filters.value.search.toLowerCase()))) return false;
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "animate-fade-in" }, _attrs))}><div class="page-header"><div><h1 class="page-title">T\xE2ches Monteurs Vid\xE9o</h1><p class="page-subtitle" style="${ssrRenderStyle({ "margin-bottom": "0" })}">Suivi des montages, teasers, recaps et contenus vid\xE9o pour les \xE9v\xE9nements.</p></div><button class="btn btn-primary">`);
      _push(ssrRenderComponent(unref(Plus), { size: 15 }, null, _parent));
      _push(` Nouvelle T\xE2che Vid\xE9o </button></div><div class="card toolbar" style="${ssrRenderStyle({ "margin-bottom": "1.25rem" })}"><div class="search-wrapper">`);
      _push(ssrRenderComponent(unref(Search), {
        class: "search-icon",
        size: 14
      }, null, _parent));
      _push(`<input type="text"${ssrRenderAttr("value", filters.value.search)} placeholder="Rechercher un projet vid\xE9o..." class="form-input"></div><select class="form-input"><option value=""${ssrIncludeBooleanAttr(Array.isArray(filters.value.employeId) ? ssrLooseContain(filters.value.employeId, "") : ssrLooseEqual(filters.value.employeId, "")) ? " selected" : ""}>Tous les Monteurs</option><!--[-->`);
      ssrRenderList(monteurEquipe.value, (emp) => {
        _push(`<option${ssrRenderAttr("value", emp.id)}${ssrIncludeBooleanAttr(Array.isArray(filters.value.employeId) ? ssrLooseContain(filters.value.employeId, emp.id) : ssrLooseEqual(filters.value.employeId, emp.id)) ? " selected" : ""}>${ssrInterpolate(emp.nom)} ${ssrInterpolate(emp.prenom)}</option>`);
      });
      _push(`<!--]--></select><select class="form-input"><option value=""${ssrIncludeBooleanAttr(Array.isArray(filters.value.statutTacheId) ? ssrLooseContain(filters.value.statutTacheId, "") : ssrLooseEqual(filters.value.statutTacheId, "")) ? " selected" : ""}>Tous Statuts</option><!--[-->`);
      ssrRenderList(unref(statuts), (st) => {
        _push(`<option${ssrRenderAttr("value", st.id)}${ssrIncludeBooleanAttr(Array.isArray(filters.value.statutTacheId) ? ssrLooseContain(filters.value.statutTacheId, st.id) : ssrLooseEqual(filters.value.statutTacheId, st.id)) ? " selected" : ""}>${ssrInterpolate(st.nom)}</option>`);
      });
      _push(`<!--]--></select></div><div class="card" style="${ssrRenderStyle({ "padding": "0", "overflow": "hidden" })}"><table class="data-table"><thead><tr><th>Nom du Projet</th><th>Monteur Assign\xE9</th><th>Deadline</th><th>Statut</th><th style="${ssrRenderStyle({ "text-align": "right" })}">Actions</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(filteredTasks.value, (task) => {
        var _a, _b, _c, _d, _e, _f;
        _push(`<tr><td style="${ssrRenderStyle({ "font-weight": "600" })}">${ssrInterpolate(task.titre)}</td><td style="${ssrRenderStyle({ "font-weight": "500" })}">${ssrInterpolate((_a = task.employe) == null ? void 0 : _a.prenom)} ${ssrInterpolate((_b = task.employe) == null ? void 0 : _b.nom[0])}.</td><td style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}">${ssrInterpolate(new Date(task.date_limite).toLocaleDateString())}</td><td><span class="badge" style="${ssrRenderStyle({ background: ((_c = task.statutTache) == null ? void 0 : _c.couleur) + "20", color: (_d = task.statutTache) == null ? void 0 : _d.couleur, border: "1px solid " + ((_e = task.statutTache) == null ? void 0 : _e.couleur) })}">${ssrInterpolate((_f = task.statutTache) == null ? void 0 : _f.nom)}</span></td><td style="${ssrRenderStyle({ "text-align": "right" })}"><div class="actions-cell"><button class="btn btn-secondary btn-icon" title="Voir d\xE9tails">`);
        _push(ssrRenderComponent(unref(Eye), { size: 14 }, null, _parent));
        _push(`</button><button class="btn btn-secondary btn-icon" title="Modifier">`);
        _push(ssrRenderComponent(unref(Edit), { size: 14 }, null, _parent));
        _push(`</button><button class="btn-danger-ghost" title="Supprimer">`);
        _push(ssrRenderComponent(unref(Trash2), { size: 14 }, null, _parent));
        _push(`</button></div></td></tr>`);
      });
      _push(`<!--]-->`);
      if (filteredTasks.value.length === 0) {
        _push(`<tr><td colspan="8" style="${ssrRenderStyle({ "text-align": "center", "padding": "2rem", "color": "var(--text-secondary)" })}">Aucune t\xE2che trouv\xE9e.</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div>`);
      _push(ssrRenderComponent(_component_Modal, {
        isOpen: modal.value,
        title: editing.value ? "Modifier la T\xE2che Vid\xE9o" : "Nouvelle T\xE2che Vid\xE9o",
        onClose: ($event) => modal.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Nom du Projet</label><input type="text"${ssrRenderAttr("value", form.value.titre)} required class="form-input" placeholder="Ex: Teaser JOF \xC9vreux 2026"${_scopeId}></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Attribuer \xE0 (Monteur)</label><select required class="form-input"${_scopeId}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(form.value.employeId) ? ssrLooseContain(form.value.employeId, "") : ssrLooseEqual(form.value.employeId, "")) ? " selected" : ""}${_scopeId}>Choisir</option><!--[-->`);
            ssrRenderList(monteurEquipe.value, (emp) => {
              _push2(`<option${ssrRenderAttr("value", emp.id)}${ssrIncludeBooleanAttr(Array.isArray(form.value.employeId) ? ssrLooseContain(form.value.employeId, emp.id) : ssrLooseEqual(form.value.employeId, emp.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(emp.nom)} ${ssrInterpolate(emp.prenom)}</option>`);
            });
            _push2(`<!--]--></select></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Demandeur</label><select class="form-input"${_scopeId}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(form.value.demandeur) ? ssrLooseContain(form.value.demandeur, "") : ssrLooseEqual(form.value.demandeur, "")) ? " selected" : ""}${_scopeId}>Choisir un demandeur</option><!--[-->`);
            ssrRenderList(unref(employes), (emp) => {
              _push2(`<option${ssrRenderAttr("value", emp.prenom + " " + emp.nom)}${ssrIncludeBooleanAttr(Array.isArray(form.value.demandeur) ? ssrLooseContain(form.value.demandeur, emp.prenom + " " + emp.nom) : ssrLooseEqual(form.value.demandeur, emp.prenom + " " + emp.nom)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(emp.prenom)} ${ssrInterpolate(emp.nom)}</option>`);
            });
            _push2(`<!--]--></select></div></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Statut</label><select required class="form-input"${_scopeId}><!--[-->`);
            ssrRenderList(unref(statuts), (st) => {
              _push2(`<option${ssrRenderAttr("value", st.id)}${ssrIncludeBooleanAttr(Array.isArray(form.value.statutTacheId) ? ssrLooseContain(form.value.statutTacheId, st.id) : ssrLooseEqual(form.value.statutTacheId, st.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(st.nom)}</option>`);
            });
            _push2(`<!--]--></select></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Deadline</label><input type="datetime-local"${ssrRenderAttr("value", form.value.date_limite)} required class="form-input"${_scopeId}></div></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Notes / Brief</label><textarea class="form-input" rows="3" placeholder="Instructions, brief cr\xE9atif, liens des rushes..."${_scopeId}>${ssrInterpolate(form.value.description)}</textarea></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "flex-end", "gap": "0.5rem", "margin-top": "0.5rem" })}"${_scopeId}><button type="button" class="btn btn-secondary"${_scopeId}>Annuler</button><button type="submit" class="btn btn-primary"${_scopeId}>${ssrInterpolate(editing.value ? "Enregistrer" : "Cr\xE9er")}</button></div></form>`);
          } else {
            return [
              createVNode("form", {
                onSubmit: withModifiers(save, ["prevent"]),
                style: { "display": "flex", "flex-direction": "column", "gap": "1rem" }
              }, [
                createVNode("div", { class: "form-group" }, [
                  createVNode("label", { class: "form-label" }, "Nom du Projet"),
                  withDirectives(createVNode("input", {
                    type: "text",
                    "onUpdate:modelValue": ($event) => form.value.titre = $event,
                    required: "",
                    class: "form-input",
                    placeholder: "Ex: Teaser JOF \xC9vreux 2026"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, form.value.titre]
                  ])
                ]),
                createVNode("div", { style: { "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" } }, [
                  createVNode("div", { class: "form-group" }, [
                    createVNode("label", { class: "form-label" }, "Attribuer \xE0 (Monteur)"),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => form.value.employeId = $event,
                      required: "",
                      class: "form-input"
                    }, [
                      createVNode("option", {
                        value: "",
                        disabled: ""
                      }, "Choisir"),
                      (openBlock(true), createBlock(Fragment, null, renderList(monteurEquipe.value, (emp) => {
                        return openBlock(), createBlock("option", {
                          key: emp.id,
                          value: emp.id
                        }, toDisplayString(emp.nom) + " " + toDisplayString(emp.prenom), 9, ["value"]);
                      }), 128))
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, form.value.employeId]
                    ])
                  ]),
                  createVNode("div", { class: "form-group" }, [
                    createVNode("label", { class: "form-label" }, "Demandeur"),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => form.value.demandeur = $event,
                      class: "form-input"
                    }, [
                      createVNode("option", {
                        value: "",
                        disabled: ""
                      }, "Choisir un demandeur"),
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(employes), (emp) => {
                        return openBlock(), createBlock("option", {
                          key: emp.id,
                          value: emp.prenom + " " + emp.nom
                        }, toDisplayString(emp.prenom) + " " + toDisplayString(emp.nom), 9, ["value"]);
                      }), 128))
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, form.value.demandeur]
                    ])
                  ])
                ]),
                createVNode("div", { style: { "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" } }, [
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
                  createVNode("label", { class: "form-label" }, "Notes / Brief"),
                  withDirectives(createVNode("textarea", {
                    "onUpdate:modelValue": ($event) => form.value.description = $event,
                    class: "form-input",
                    rows: "3",
                    placeholder: "Instructions, brief cr\xE9atif, liens des rushes..."
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/taches/monteur.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=monteur-DCfeS2a9.mjs.map
