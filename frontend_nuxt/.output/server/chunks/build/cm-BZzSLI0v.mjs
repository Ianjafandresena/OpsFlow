import { _ as __nuxt_component_0 } from './Modal-D-MuMCI8.mjs';
import { _ as __nuxt_component_1 } from './ConfirmModal-BqcDZ7j8.mjs';
import { _ as __nuxt_component_2 } from './TacheDetailModal-DA3ccqFV.mjs';
import { withAsyncContext, computed, ref, mergeProps, unref, withCtx, createVNode, withModifiers, withDirectives, vModelSelect, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, vModelCheckbox, createTextVNode, vModelText, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
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
  __name: "cm",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: taches, refresh: refreshTaches } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/taches",
      { query: { typeTache: "PUBLICATION,SPONSORISATION,MAILING,ADMINISTRATIVE" } },
      "$_vHo3C2155"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: editions } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/editions",
      "$csI7JCJlYk"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: employes } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/equipe",
      "$tYQ2rpePhn"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: statuts } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/taches/statuts",
      "$x9Fu_xm4dP"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: themes } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/themes",
      "$TPZf9YXUSK"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const cmEquipe = computed(() => {
      if (!employes.value) return [];
      return employes.value.filter((e) => {
        var _a, _b, _c, _d;
        return ((_b = (_a = e.poste) == null ? void 0 : _a.departement) == null ? void 0 : _b.nom_departement) === "Communication" || ((_d = (_c = e.poste) == null ? void 0 : _c.titre_poste) == null ? void 0 : _d.includes("Community Manager"));
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
    const filters = ref({ search: "", typeTache: "", editionId: "", employeId: "", statutTacheId: "" });
    const getIsoTime = (d) => {
      if (!d) return "";
      const dt = new Date(d);
      dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
      return dt.toISOString().slice(0, 16);
    };
    const defaultForm = () => {
      var _a, _b;
      const defaultStatut = ((_b = (_a = statuts.value) == null ? void 0 : _a.find((s) => s.niveau_progression === 0)) == null ? void 0 : _b.id) || "";
      return {
        id: null,
        typeTache: "Publication",
        employeId: "",
        editionId: "",
        statutTacheId: defaultStatut,
        date_limite: getIsoTime(/* @__PURE__ */ new Date()),
        date_demande: "",
        plateformes: ["Facebook"],
        type_pub: "Poste",
        themePubId: "",
        themeSponsoId: "",
        sponsorisations: [{ themeId: "", budget: "" }],
        type_demarche: "",
        budget: null,
        audience: "",
        description: "",
        outil_mailing: "Brevo (Sendinblue)"
      };
    };
    const form = ref(defaultForm());
    const filteredTasks = computed(() => {
      if (!taches.value) return [];
      return taches.value.filter((t) => {
        var _a;
        let vType = "Publication";
        if (t.type_demarche) vType = "D\xE9marche Administrative";
        if (t.outil_mailing) vType = "Mailing (Newsletter)";
        if (t.budget || t.titre.includes("Sponsorisation")) vType = "Sponsorisation (Ads)";
        if (filters.value.typeTache && vType !== filters.value.typeTache) return false;
        if (filters.value.search && !t.titre.toLowerCase().includes(filters.value.search.toLowerCase()) && !((_a = t.description) == null ? void 0 : _a.toLowerCase().includes(filters.value.search.toLowerCase()))) return false;
        if (filters.value.editionId && t.editionId !== filters.value.editionId) return false;
        if (filters.value.employeId && t.employeId !== filters.value.employeId) return false;
        if (filters.value.statutTacheId && t.statutTacheId !== filters.value.statutTacheId) return false;
        return true;
      });
    });
    const save = async () => {
      if (editing.value || form.value.typeTache !== "Sponsorisation (Ads)") {
        const body = { ...form.value };
        let genTitre = form.value.typeTache;
        if (form.value.typeTache === "Publication") genTitre = `${form.value.plateforme} - ${form.value.type_pub}`;
        if (form.value.typeTache === "D\xE9marche Administrative") genTitre = form.value.type_demarche || "D\xE9marche";
        if (form.value.typeTache === "Sponsorisation (Ads)") genTitre = `Sponsorisation (${form.value.budget || 0}\u20AC)`;
        if (body.typeTache === "Publication") {
          body.type_demarche = null;
          body.budget = null;
          body.audience = null;
          body.outil_mailing = null;
          body.date_demande = null;
          body.themeSponsoId = null;
        } else if (body.typeTache === "D\xE9marche Administrative") {
          body.plateforme = null;
          body.type_pub = null;
          body.themePubId = null;
          body.budget = null;
          body.audience = null;
          body.outil_mailing = null;
          body.themeSponsoId = null;
          if (body.date_demande) body.date_demande = new Date(body.date_demande).toISOString();
          body.date_resultat = new Date(body.date_limite).toISOString();
        } else if (body.typeTache === "Mailing (Newsletter)") {
          body.plateforme = null;
          body.type_pub = null;
          body.themePubId = null;
          body.type_demarche = null;
          body.budget = null;
          body.audience = null;
          body.date_demande = null;
          body.themeSponsoId = null;
        }
        body.date_limite = new Date(body.date_limite).toISOString();
        if (!editing.value && body.typeTache === "Publication") {
          for (const p of form.value.plateformes) {
            const platformBody = { ...body, plateforme: p, titre: `${p} - ${form.value.type_pub}` };
            await $fetch("/api/taches", { method: "POST", body: platformBody });
          }
        } else {
          if (body.typeTache === "Publication") {
            body.plateforme = form.value.plateformes.join(", ");
            body.titre = `${body.plateforme} - ${body.type_pub}`;
          }
          body.titre = genTitre;
          if (body.typeTache === "Publication") body.titre = `${body.plateforme} - ${body.type_pub}`;
          await $fetch("/api/taches", { method: "POST", body });
        }
      } else {
        for (const sp of form.value.sponsorisations) {
          if (!sp.themeId || !sp.budget) continue;
          const body = {
            ...form.value,
            titre: `Sponsorisation (${sp.budget}\u20AC)`,
            themeSponsoId: sp.themeId,
            budget: sp.budget,
            date_limite: new Date(form.value.date_limite).toISOString(),
            plateforme: null,
            type_pub: null,
            themePubId: null,
            type_demarche: null,
            outil_mailing: null,
            date_demande: null
          };
          await $fetch("/api/taches", { method: "POST", body });
        }
      }
      await refreshTaches();
      modal.value = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Modal = __nuxt_component_0;
      const _component_ConfirmModal = __nuxt_component_1;
      const _component_TacheDetailModal = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "animate-fade-in" }, _attrs))}><div class="page-header"><div><h1 class="page-title">T\xE2ches CM &amp; Administratives</h1><p class="page-subtitle" style="${ssrRenderStyle({ "margin-bottom": "0" })}">Planification des publications et suivi des dossiers (s\xE9curit\xE9, ARS, boissons...).</p></div><button class="btn btn-primary">`);
      _push(ssrRenderComponent(unref(Plus), { size: 15 }, null, _parent));
      _push(` Nouvelle T\xE2che </button></div><div class="card toolbar" style="${ssrRenderStyle({ "margin-bottom": "1.25rem" })}"><div class="search-wrapper">`);
      _push(ssrRenderComponent(unref(Search), {
        class: "search-icon",
        size: 14
      }, null, _parent));
      _push(`<input type="text"${ssrRenderAttr("value", filters.value.search)} placeholder="Rechercher..." class="form-input"></div><select class="form-input"><option value=""${ssrIncludeBooleanAttr(Array.isArray(filters.value.typeTache) ? ssrLooseContain(filters.value.typeTache, "") : ssrLooseEqual(filters.value.typeTache, "")) ? " selected" : ""}>Tous les Types</option><option${ssrIncludeBooleanAttr(Array.isArray(filters.value.typeTache) ? ssrLooseContain(filters.value.typeTache, null) : ssrLooseEqual(filters.value.typeTache, null)) ? " selected" : ""}>Publication</option><option${ssrIncludeBooleanAttr(Array.isArray(filters.value.typeTache) ? ssrLooseContain(filters.value.typeTache, null) : ssrLooseEqual(filters.value.typeTache, null)) ? " selected" : ""}>D\xE9marche Administrative</option><option${ssrIncludeBooleanAttr(Array.isArray(filters.value.typeTache) ? ssrLooseContain(filters.value.typeTache, null) : ssrLooseEqual(filters.value.typeTache, null)) ? " selected" : ""}>Mailing (Newsletter)</option><option${ssrIncludeBooleanAttr(Array.isArray(filters.value.typeTache) ? ssrLooseContain(filters.value.typeTache, null) : ssrLooseEqual(filters.value.typeTache, null)) ? " selected" : ""}>Sponsorisation (Ads)</option></select><select class="form-input"><option value=""${ssrIncludeBooleanAttr(Array.isArray(filters.value.editionId) ? ssrLooseContain(filters.value.editionId, "") : ssrLooseEqual(filters.value.editionId, "")) ? " selected" : ""}>Toutes les Pages</option><!--[-->`);
      ssrRenderList(unref(editions), (ed) => {
        var _a, _b;
        _push(`<option${ssrRenderAttr("value", ed.id)}${ssrIncludeBooleanAttr(Array.isArray(filters.value.editionId) ? ssrLooseContain(filters.value.editionId, ed.id) : ssrLooseEqual(filters.value.editionId, ed.id)) ? " selected" : ""}>${ssrInterpolate((_a = ed.licence) == null ? void 0 : _a.sigle)} - ${ssrInterpolate((_b = ed.ville) == null ? void 0 : _b.nom_ville)}</option>`);
      });
      _push(`<!--]--></select><select class="form-input"><option value=""${ssrIncludeBooleanAttr(Array.isArray(filters.value.employeId) ? ssrLooseContain(filters.value.employeId, "") : ssrLooseEqual(filters.value.employeId, "")) ? " selected" : ""}>Toute l&#39;\xE9quipe</option><!--[-->`);
      ssrRenderList(cmEquipe.value, (emp) => {
        _push(`<option${ssrRenderAttr("value", emp.id)}${ssrIncludeBooleanAttr(Array.isArray(filters.value.employeId) ? ssrLooseContain(filters.value.employeId, emp.id) : ssrLooseEqual(filters.value.employeId, emp.id)) ? " selected" : ""}>${ssrInterpolate(emp.nom)} ${ssrInterpolate(emp.prenom)}</option>`);
      });
      _push(`<!--]--></select><select class="form-input"><option value=""${ssrIncludeBooleanAttr(Array.isArray(filters.value.statutTacheId) ? ssrLooseContain(filters.value.statutTacheId, "") : ssrLooseEqual(filters.value.statutTacheId, "")) ? " selected" : ""}>Tous Statuts</option><!--[-->`);
      ssrRenderList(unref(statuts), (st) => {
        _push(`<option${ssrRenderAttr("value", st.id)}${ssrIncludeBooleanAttr(Array.isArray(filters.value.statutTacheId) ? ssrLooseContain(filters.value.statutTacheId, st.id) : ssrLooseEqual(filters.value.statutTacheId, st.id)) ? " selected" : ""}>${ssrInterpolate(st.nom)}</option>`);
      });
      _push(`<!--]--></select></div><div class="card" style="${ssrRenderStyle({ "padding": "0", "overflow": "hidden" })}"><table class="data-table"><thead><tr><th>Page Concern\xE9e</th><th>Type</th><th>Sujet / D\xE9marche</th><th>Assign\xE9 \xE0</th><th>Dates / \xC9ch\xE9ance</th><th>Statut</th><th style="${ssrRenderStyle({ "text-align": "right" })}">Actions</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(filteredTasks.value, (t) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
        _push(`<tr><td style="${ssrRenderStyle({ "font-weight": "600" })}">${ssrInterpolate((_b = (_a = t.edition) == null ? void 0 : _a.licence) == null ? void 0 : _b.sigle)} - ${ssrInterpolate((_d = (_c = t.edition) == null ? void 0 : _c.ville) == null ? void 0 : _d.nom_ville)}</td><td><span class="${ssrRenderClass([t.type_pub ? "badge-primary" : t.type_demarche ? "badge-neutral" : t.budget || t.titre.includes("Sponsorisation") ? "badge-warning" : "badge-info", "badge"])}">`);
        if (t.type_demarche) {
          _push(`<!--[-->D\xE9marche Administrative<!--]-->`);
        } else if (t.outil_mailing) {
          _push(`<!--[-->Mailing (Newsletter)<!--]-->`);
        } else if (t.budget || t.titre.includes("Sponsorisation")) {
          _push(`<!--[-->Sponsorisation (Ads)<!--]-->`);
        } else {
          _push(`<!--[-->Publication<!--]-->`);
        }
        _push(`</span></td><td><div style="${ssrRenderStyle({ "font-weight": "600", "font-size": "0.875rem" })}">${ssrInterpolate(t.titre)}</div><div style="${ssrRenderStyle({ "color": "var(--text-secondary)", "font-size": "0.75rem", "margin-top": "2px", "max-width": "250px", "white-space": "nowrap", "overflow": "hidden", "text-overflow": "ellipsis" })}">${ssrInterpolate(t.description)}</div></td><td style="${ssrRenderStyle({ "font-weight": "500" })}">${ssrInterpolate((_e = t.employe) == null ? void 0 : _e.prenom)} ${ssrInterpolate((_f = t.employe) == null ? void 0 : _f.nom[0])}.</td><td style="${ssrRenderStyle({ "font-size": "0.8125rem" })}">`);
        if (t.type_demarche) {
          _push(`<div> Dem : ${ssrInterpolate(t.date_demande ? new Date(t.date_demande).toLocaleDateString() : "\u2014")}<br> R\xE9s : <strong style="${ssrRenderStyle({ color: t.date_resultat && new Date(t.date_resultat) < /* @__PURE__ */ new Date() && ((_g = t.statutTache) == null ? void 0 : _g.nom) !== "Termin\xE9" ? "var(--danger-color)" : "inherit" })}">${ssrInterpolate(t.date_resultat ? new Date(t.date_resultat).toLocaleDateString() : "En attente")}</strong></div>`);
        } else {
          _push(`<div> Envoi : <strong style="${ssrRenderStyle({ color: new Date(t.date_limite) < /* @__PURE__ */ new Date() && ((_h = t.statutTache) == null ? void 0 : _h.nom) !== "Publi\xE9" && ((_i = t.statutTache) == null ? void 0 : _i.nom) !== "Termin\xE9" ? "var(--danger-color)" : "inherit" })}">${ssrInterpolate(new Date(t.date_limite).toLocaleString([], { dateStyle: "short", timeStyle: "short" }))}</strong></div>`);
        }
        _push(`</td><td><span class="badge" style="${ssrRenderStyle({ background: ((_j = t.statutTache) == null ? void 0 : _j.couleur) + "20", color: (_k = t.statutTache) == null ? void 0 : _k.couleur, border: "1px solid " + ((_l = t.statutTache) == null ? void 0 : _l.couleur) })}">${ssrInterpolate((_m = t.statutTache) == null ? void 0 : _m.nom)}</span></td><td style="${ssrRenderStyle({ "text-align": "right" })}"><div class="actions-cell"><button class="btn btn-secondary btn-icon" title="Voir d\xE9tails">`);
        _push(ssrRenderComponent(unref(Eye), { size: 14 }, null, _parent));
        _push(`</button><button class="btn btn-secondary btn-icon" title="Modifier">`);
        _push(ssrRenderComponent(unref(Edit), { size: 14 }, null, _parent));
        _push(`</button><button class="btn-danger-ghost" title="Supprimer">`);
        _push(ssrRenderComponent(unref(Trash2), { size: 14 }, null, _parent));
        _push(`</button></div></td></tr>`);
      });
      _push(`<!--]-->`);
      if (filteredTasks.value.length === 0) {
        _push(`<tr><td colspan="7" style="${ssrRenderStyle({ "text-align": "center", "padding": "2rem", "color": "var(--text-secondary)" })}">Aucune t\xE2che trouv\xE9e.</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div>`);
      _push(ssrRenderComponent(_component_Modal, {
        isOpen: modal.value,
        title: editing.value ? "Modifier la T\xE2che" : "Nouvelle T\xE2che",
        onClose: ($event) => modal.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "1rem" })}"${_scopeId}><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Type de T\xE2che</label><select required class="form-input"${_scopeId}><option${ssrIncludeBooleanAttr(Array.isArray(form.value.typeTache) ? ssrLooseContain(form.value.typeTache, null) : ssrLooseEqual(form.value.typeTache, null)) ? " selected" : ""}${_scopeId}>Publication</option><option${ssrIncludeBooleanAttr(Array.isArray(form.value.typeTache) ? ssrLooseContain(form.value.typeTache, null) : ssrLooseEqual(form.value.typeTache, null)) ? " selected" : ""}${_scopeId}>D\xE9marche Administrative</option><option${ssrIncludeBooleanAttr(Array.isArray(form.value.typeTache) ? ssrLooseContain(form.value.typeTache, null) : ssrLooseEqual(form.value.typeTache, null)) ? " selected" : ""}${_scopeId}>Mailing (Newsletter)</option><option${ssrIncludeBooleanAttr(Array.isArray(form.value.typeTache) ? ssrLooseContain(form.value.typeTache, null) : ssrLooseEqual(form.value.typeTache, null)) ? " selected" : ""}${_scopeId}>Sponsorisation (Ads)</option></select></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Assigner \xE0</label><select required class="form-input"${_scopeId}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(form.value.employeId) ? ssrLooseContain(form.value.employeId, "") : ssrLooseEqual(form.value.employeId, "")) ? " selected" : ""}${_scopeId}>Choisir</option><!--[-->`);
            ssrRenderList(cmEquipe.value, (emp) => {
              _push2(`<option${ssrRenderAttr("value", emp.id)}${ssrIncludeBooleanAttr(Array.isArray(form.value.employeId) ? ssrLooseContain(form.value.employeId, emp.id) : ssrLooseEqual(form.value.employeId, emp.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(emp.nom)} ${ssrInterpolate(emp.prenom)}</option>`);
            });
            _push2(`<!--]--></select></div></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Page concern\xE9e</label><select required class="form-input"${_scopeId}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(form.value.editionId) ? ssrLooseContain(form.value.editionId, "") : ssrLooseEqual(form.value.editionId, "")) ? " selected" : ""}${_scopeId}>Choisir la page</option><!--[-->`);
            ssrRenderList(unref(editions), (ed) => {
              var _a, _b;
              _push2(`<option${ssrRenderAttr("value", ed.id)}${ssrIncludeBooleanAttr(Array.isArray(form.value.editionId) ? ssrLooseContain(form.value.editionId, ed.id) : ssrLooseEqual(form.value.editionId, ed.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate((_a = ed.licence) == null ? void 0 : _a.sigle)} - ${ssrInterpolate((_b = ed.ville) == null ? void 0 : _b.nom_ville)}</option>`);
            });
            _push2(`<!--]--></select></div>`);
            if (editing.value) {
              _push2(`<div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Statut</label><select required class="form-input"${_scopeId}><!--[-->`);
              ssrRenderList(unref(statuts), (st) => {
                _push2(`<option${ssrRenderAttr("value", st.id)}${ssrIncludeBooleanAttr(Array.isArray(form.value.statutTacheId) ? ssrLooseContain(form.value.statutTacheId, st.id) : ssrLooseEqual(form.value.statutTacheId, st.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(st.nom)}</option>`);
              });
              _push2(`<!--]--></select></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (form.value.typeTache === "Publication") {
              _push2(`<div style="${ssrRenderStyle({ "padding-top": "0.5rem", "border-top": "1px solid var(--border-light)" })}"${_scopeId}><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem", "margin-bottom": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Plateformes</label><div style="${ssrRenderStyle({ "display": "flex", "gap": "1rem", "align-items": "center", "height": "38px" })}"${_scopeId}><label style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "0.25rem", "font-size": "0.875rem" })}"${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(form.value.plateformes) ? ssrLooseContain(form.value.plateformes, "Facebook") : form.value.plateformes) ? " checked" : ""} value="Facebook"${_scopeId}> Facebook </label><label style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "0.25rem", "font-size": "0.875rem" })}"${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(form.value.plateformes) ? ssrLooseContain(form.value.plateformes, "Instagram") : form.value.plateformes) ? " checked" : ""} value="Instagram"${_scopeId}> Instagram </label><label style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "0.25rem", "font-size": "0.875rem" })}"${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(form.value.plateformes) ? ssrLooseContain(form.value.plateformes, "TikTok") : form.value.plateformes) ? " checked" : ""} value="TikTok"${_scopeId}> TikTok </label></div></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Type de publication</label><select class="form-input"${_scopeId}><option${ssrIncludeBooleanAttr(Array.isArray(form.value.type_pub) ? ssrLooseContain(form.value.type_pub, null) : ssrLooseEqual(form.value.type_pub, null)) ? " selected" : ""}${_scopeId}>Poste</option><option${ssrIncludeBooleanAttr(Array.isArray(form.value.type_pub) ? ssrLooseContain(form.value.type_pub, null) : ssrLooseEqual(form.value.type_pub, null)) ? " selected" : ""}${_scopeId}>Story</option><option${ssrIncludeBooleanAttr(Array.isArray(form.value.type_pub) ? ssrLooseContain(form.value.type_pub, null) : ssrLooseEqual(form.value.type_pub, null)) ? " selected" : ""}${_scopeId}>Reels</option></select></div></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Th\xE8me du post</label><select class="form-input"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(form.value.themePubId) ? ssrLooseContain(form.value.themePubId, "") : ssrLooseEqual(form.value.themePubId, "")) ? " selected" : ""}${_scopeId}>Aucun</option><!--[-->`);
              ssrRenderList(unref(themes), (th) => {
                _push2(`<option${ssrRenderAttr("value", th.id)}${ssrIncludeBooleanAttr(Array.isArray(form.value.themePubId) ? ssrLooseContain(form.value.themePubId, th.id) : ssrLooseEqual(form.value.themePubId, th.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(th.nom_theme)}</option>`);
              });
              _push2(`<!--]--></select></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Date et Heure de publication</label><input type="datetime-local"${ssrRenderAttr("value", form.value.date_limite)} class="form-input" required${_scopeId}></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (form.value.typeTache === "D\xE9marche Administrative") {
              _push2(`<div style="${ssrRenderStyle({ "padding-top": "0.5rem", "border-top": "1px solid var(--border-light)" })}"${_scopeId}><div class="form-group" style="${ssrRenderStyle({ "margin-bottom": "1rem" })}"${_scopeId}><label class="form-label"${_scopeId}>Type de d\xE9marche</label><input type="text"${ssrRenderAttr("value", form.value.type_demarche)} class="form-input" placeholder="Ex: D\xE9claration d\xE9bits de boissons, Dossier S\xE9curit\xE9..." required${_scopeId}></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Date limite de Demande</label><input type="date"${ssrRenderAttr("value", form.value.date_demande)} class="form-input"${_scopeId}></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Date limite de R\xE9sultat attendu</label><input type="date"${ssrRenderAttr("value", form.value.date_limite)} class="form-input" required${_scopeId}></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (form.value.typeTache === "Mailing (Newsletter)") {
              _push2(`<div style="${ssrRenderStyle({ "padding-top": "0.5rem", "border-top": "1px solid var(--border-light)" })}"${_scopeId}><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Outil de Mailing</label><select class="form-input"${_scopeId}><option${ssrIncludeBooleanAttr(Array.isArray(form.value.outil_mailing) ? ssrLooseContain(form.value.outil_mailing, null) : ssrLooseEqual(form.value.outil_mailing, null)) ? " selected" : ""}${_scopeId}>Brevo (Sendinblue)</option><option${ssrIncludeBooleanAttr(Array.isArray(form.value.outil_mailing) ? ssrLooseContain(form.value.outil_mailing, null) : ssrLooseEqual(form.value.outil_mailing, null)) ? " selected" : ""}${_scopeId}>Mailchimp</option><option${ssrIncludeBooleanAttr(Array.isArray(form.value.outil_mailing) ? ssrLooseContain(form.value.outil_mailing, null) : ssrLooseEqual(form.value.outil_mailing, null)) ? " selected" : ""}${_scopeId}>Klaviyo</option></select></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Date et Heure d&#39;envoi</label><input type="datetime-local"${ssrRenderAttr("value", form.value.date_limite)} class="form-input" required${_scopeId}></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (form.value.typeTache === "Sponsorisation (Ads)") {
              _push2(`<div style="${ssrRenderStyle({ "padding-top": "0.5rem", "border-top": "1px solid var(--border-light)" })}"${_scopeId}>`);
              if (!editing.value) {
                _push2(`<div style="${ssrRenderStyle({ "margin-bottom": "1rem" })}"${_scopeId}><!--[-->`);
                ssrRenderList(form.value.sponsorisations, (sp, idx) => {
                  _push2(`<div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 100px 30px", "gap": "0.5rem", "margin-bottom": "0.5rem", "align-items": "end" })}"${_scopeId}><div class="form-group"${_scopeId}>`);
                  if (idx === 0) {
                    _push2(`<label class="form-label"${_scopeId}>Th\xE8me du post \xE0 sponsoriser</label>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<select class="form-input" required${_scopeId}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(sp.themeId) ? ssrLooseContain(sp.themeId, "") : ssrLooseEqual(sp.themeId, "")) ? " selected" : ""}${_scopeId}>Choisir un th\xE8me</option><!--[-->`);
                  ssrRenderList(unref(themes), (th) => {
                    _push2(`<option${ssrRenderAttr("value", th.id)}${ssrIncludeBooleanAttr(Array.isArray(sp.themeId) ? ssrLooseContain(sp.themeId, th.id) : ssrLooseEqual(sp.themeId, th.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(th.nom_theme)}</option>`);
                  });
                  _push2(`<!--]--></select></div><div class="form-group"${_scopeId}>`);
                  if (idx === 0) {
                    _push2(`<label class="form-label"${_scopeId}>Budget (\u20AC)</label>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<input type="number"${ssrRenderAttr("value", sp.budget)} class="form-input" placeholder="\u20AC" required${_scopeId}></div>`);
                  if (form.value.sponsorisations.length > 1) {
                    _push2(`<button type="button" class="btn-danger-ghost" style="${ssrRenderStyle({ "height": "38px", "padding": "0", "width": "30px", "display": "flex", "justify-content": "center", "align-items": "center" })}"${_scopeId}>`);
                    _push2(ssrRenderComponent(unref(Trash2), { size: 16 }, null, _parent2, _scopeId));
                    _push2(`</button>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                });
                _push2(`<!--]--><button type="button" class="btn btn-secondary btn-sm" style="${ssrRenderStyle({ "width": "100%", "justify-content": "center" })}"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Plus), { size: 14 }, null, _parent2, _scopeId));
                _push2(` Ajouter un autre th\xE8me \xE0 sponsoriser </button></div>`);
              } else {
                _push2(`<div style="${ssrRenderStyle({ "margin-bottom": "1rem", "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Th\xE8me du post \xE0 sponsoriser</label><select class="form-input" required${_scopeId}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(form.value.themeSponsoId) ? ssrLooseContain(form.value.themeSponsoId, "") : ssrLooseEqual(form.value.themeSponsoId, "")) ? " selected" : ""}${_scopeId}>Choisir un th\xE8me</option><!--[-->`);
                ssrRenderList(unref(themes), (th) => {
                  _push2(`<option${ssrRenderAttr("value", th.id)}${ssrIncludeBooleanAttr(Array.isArray(form.value.themeSponsoId) ? ssrLooseContain(form.value.themeSponsoId, th.id) : ssrLooseEqual(form.value.themeSponsoId, th.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(th.nom_theme)}</option>`);
                });
                _push2(`<!--]--></select></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Budget (\u20AC)</label><input type="number"${ssrRenderAttr("value", form.value.budget)} class="form-input" required${_scopeId}></div></div>`);
              }
              _push2(`<div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Date et Heure de sponsorisation</label><input type="datetime-local"${ssrRenderAttr("value", form.value.date_limite)} class="form-input" required${_scopeId}></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Ciblage / Audience</label><input type="text"${ssrRenderAttr("value", form.value.audience)} class="form-input" placeholder="Ex: 18-35 ans, fans de Manga..."${_scopeId}></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="form-group" style="${ssrRenderStyle({ "margin-top": "0.5rem" })}"${_scopeId}><label class="form-label"${_scopeId}>Description sp\xE9cifique / D\xE9tails de la t\xE2che</label><textarea class="form-input" rows="3" placeholder="D\xE9taillez le contenu du post ou les documents n\xE9cessaires pour la d\xE9marche..."${_scopeId}>${ssrInterpolate(form.value.description)}</textarea></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "flex-end", "gap": "0.5rem", "margin-top": "0.5rem" })}"${_scopeId}><button type="button" class="btn btn-secondary"${_scopeId}>Annuler</button><button type="submit" class="btn btn-primary"${_scopeId}>${ssrInterpolate(editing.value ? "Enregistrer" : "Cr\xE9er")}</button></div></form>`);
          } else {
            return [
              createVNode("form", {
                onSubmit: withModifiers(save, ["prevent"]),
                style: { "display": "flex", "flex-direction": "column", "gap": "1rem" }
              }, [
                createVNode("div", { style: { "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" } }, [
                  createVNode("div", { class: "form-group" }, [
                    createVNode("label", { class: "form-label" }, "Type de T\xE2che"),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => form.value.typeTache = $event,
                      required: "",
                      class: "form-input"
                    }, [
                      createVNode("option", null, "Publication"),
                      createVNode("option", null, "D\xE9marche Administrative"),
                      createVNode("option", null, "Mailing (Newsletter)"),
                      createVNode("option", null, "Sponsorisation (Ads)")
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, form.value.typeTache]
                    ])
                  ]),
                  createVNode("div", { class: "form-group" }, [
                    createVNode("label", { class: "form-label" }, "Assigner \xE0"),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => form.value.employeId = $event,
                      required: "",
                      class: "form-input"
                    }, [
                      createVNode("option", {
                        value: "",
                        disabled: ""
                      }, "Choisir"),
                      (openBlock(true), createBlock(Fragment, null, renderList(cmEquipe.value, (emp) => {
                        return openBlock(), createBlock("option", {
                          key: emp.id,
                          value: emp.id
                        }, toDisplayString(emp.nom) + " " + toDisplayString(emp.prenom), 9, ["value"]);
                      }), 128))
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, form.value.employeId]
                    ])
                  ])
                ]),
                createVNode("div", { style: { "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" } }, [
                  createVNode("div", { class: "form-group" }, [
                    createVNode("label", { class: "form-label" }, "Page concern\xE9e"),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => form.value.editionId = $event,
                      required: "",
                      class: "form-input"
                    }, [
                      createVNode("option", {
                        value: "",
                        disabled: ""
                      }, "Choisir la page"),
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
                  editing.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "form-group"
                  }, [
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
                  ])) : createCommentVNode("", true)
                ]),
                form.value.typeTache === "Publication" ? (openBlock(), createBlock("div", {
                  key: 0,
                  style: { "padding-top": "0.5rem", "border-top": "1px solid var(--border-light)" }
                }, [
                  createVNode("div", { style: { "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem", "margin-bottom": "1rem" } }, [
                    createVNode("div", { class: "form-group" }, [
                      createVNode("label", { class: "form-label" }, "Plateformes"),
                      createVNode("div", { style: { "display": "flex", "gap": "1rem", "align-items": "center", "height": "38px" } }, [
                        createVNode("label", { style: { "display": "flex", "align-items": "center", "gap": "0.25rem", "font-size": "0.875rem" } }, [
                          withDirectives(createVNode("input", {
                            type: "checkbox",
                            "onUpdate:modelValue": ($event) => form.value.plateformes = $event,
                            value: "Facebook"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelCheckbox, form.value.plateformes]
                          ]),
                          createTextVNode(" Facebook ")
                        ]),
                        createVNode("label", { style: { "display": "flex", "align-items": "center", "gap": "0.25rem", "font-size": "0.875rem" } }, [
                          withDirectives(createVNode("input", {
                            type: "checkbox",
                            "onUpdate:modelValue": ($event) => form.value.plateformes = $event,
                            value: "Instagram"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelCheckbox, form.value.plateformes]
                          ]),
                          createTextVNode(" Instagram ")
                        ]),
                        createVNode("label", { style: { "display": "flex", "align-items": "center", "gap": "0.25rem", "font-size": "0.875rem" } }, [
                          withDirectives(createVNode("input", {
                            type: "checkbox",
                            "onUpdate:modelValue": ($event) => form.value.plateformes = $event,
                            value: "TikTok"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelCheckbox, form.value.plateformes]
                          ]),
                          createTextVNode(" TikTok ")
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "form-group" }, [
                      createVNode("label", { class: "form-label" }, "Type de publication"),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => form.value.type_pub = $event,
                        class: "form-input"
                      }, [
                        createVNode("option", null, "Poste"),
                        createVNode("option", null, "Story"),
                        createVNode("option", null, "Reels")
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, form.value.type_pub]
                      ])
                    ])
                  ]),
                  createVNode("div", { style: { "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" } }, [
                    createVNode("div", { class: "form-group" }, [
                      createVNode("label", { class: "form-label" }, "Th\xE8me du post"),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => form.value.themePubId = $event,
                        class: "form-input"
                      }, [
                        createVNode("option", { value: "" }, "Aucun"),
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(themes), (th) => {
                          return openBlock(), createBlock("option", {
                            key: th.id,
                            value: th.id
                          }, toDisplayString(th.nom_theme), 9, ["value"]);
                        }), 128))
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, form.value.themePubId]
                      ])
                    ]),
                    createVNode("div", { class: "form-group" }, [
                      createVNode("label", { class: "form-label" }, "Date et Heure de publication"),
                      withDirectives(createVNode("input", {
                        type: "datetime-local",
                        "onUpdate:modelValue": ($event) => form.value.date_limite = $event,
                        class: "form-input",
                        required: ""
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, form.value.date_limite]
                      ])
                    ])
                  ])
                ])) : createCommentVNode("", true),
                form.value.typeTache === "D\xE9marche Administrative" ? (openBlock(), createBlock("div", {
                  key: 1,
                  style: { "padding-top": "0.5rem", "border-top": "1px solid var(--border-light)" }
                }, [
                  createVNode("div", {
                    class: "form-group",
                    style: { "margin-bottom": "1rem" }
                  }, [
                    createVNode("label", { class: "form-label" }, "Type de d\xE9marche"),
                    withDirectives(createVNode("input", {
                      type: "text",
                      "onUpdate:modelValue": ($event) => form.value.type_demarche = $event,
                      class: "form-input",
                      placeholder: "Ex: D\xE9claration d\xE9bits de boissons, Dossier S\xE9curit\xE9...",
                      required: ""
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, form.value.type_demarche]
                    ])
                  ]),
                  createVNode("div", { style: { "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" } }, [
                    createVNode("div", { class: "form-group" }, [
                      createVNode("label", { class: "form-label" }, "Date limite de Demande"),
                      withDirectives(createVNode("input", {
                        type: "date",
                        "onUpdate:modelValue": ($event) => form.value.date_demande = $event,
                        class: "form-input"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, form.value.date_demande]
                      ])
                    ]),
                    createVNode("div", { class: "form-group" }, [
                      createVNode("label", { class: "form-label" }, "Date limite de R\xE9sultat attendu"),
                      withDirectives(createVNode("input", {
                        type: "date",
                        "onUpdate:modelValue": ($event) => form.value.date_limite = $event,
                        class: "form-input",
                        required: ""
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, form.value.date_limite]
                      ])
                    ])
                  ])
                ])) : createCommentVNode("", true),
                form.value.typeTache === "Mailing (Newsletter)" ? (openBlock(), createBlock("div", {
                  key: 2,
                  style: { "padding-top": "0.5rem", "border-top": "1px solid var(--border-light)" }
                }, [
                  createVNode("div", { style: { "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" } }, [
                    createVNode("div", { class: "form-group" }, [
                      createVNode("label", { class: "form-label" }, "Outil de Mailing"),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => form.value.outil_mailing = $event,
                        class: "form-input"
                      }, [
                        createVNode("option", null, "Brevo (Sendinblue)"),
                        createVNode("option", null, "Mailchimp"),
                        createVNode("option", null, "Klaviyo")
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, form.value.outil_mailing]
                      ])
                    ]),
                    createVNode("div", { class: "form-group" }, [
                      createVNode("label", { class: "form-label" }, "Date et Heure d'envoi"),
                      withDirectives(createVNode("input", {
                        type: "datetime-local",
                        "onUpdate:modelValue": ($event) => form.value.date_limite = $event,
                        class: "form-input",
                        required: ""
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, form.value.date_limite]
                      ])
                    ])
                  ])
                ])) : createCommentVNode("", true),
                form.value.typeTache === "Sponsorisation (Ads)" ? (openBlock(), createBlock("div", {
                  key: 3,
                  style: { "padding-top": "0.5rem", "border-top": "1px solid var(--border-light)" }
                }, [
                  !editing.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    style: { "margin-bottom": "1rem" }
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(form.value.sponsorisations, (sp, idx) => {
                      return openBlock(), createBlock("div", {
                        key: idx,
                        style: { "display": "grid", "grid-template-columns": "1fr 100px 30px", "gap": "0.5rem", "margin-bottom": "0.5rem", "align-items": "end" }
                      }, [
                        createVNode("div", { class: "form-group" }, [
                          idx === 0 ? (openBlock(), createBlock("label", {
                            key: 0,
                            class: "form-label"
                          }, "Th\xE8me du post \xE0 sponsoriser")) : createCommentVNode("", true),
                          withDirectives(createVNode("select", {
                            "onUpdate:modelValue": ($event) => sp.themeId = $event,
                            class: "form-input",
                            required: ""
                          }, [
                            createVNode("option", {
                              value: "",
                              disabled: ""
                            }, "Choisir un th\xE8me"),
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(themes), (th) => {
                              return openBlock(), createBlock("option", {
                                key: th.id,
                                value: th.id
                              }, toDisplayString(th.nom_theme), 9, ["value"]);
                            }), 128))
                          ], 8, ["onUpdate:modelValue"]), [
                            [vModelSelect, sp.themeId]
                          ])
                        ]),
                        createVNode("div", { class: "form-group" }, [
                          idx === 0 ? (openBlock(), createBlock("label", {
                            key: 0,
                            class: "form-label"
                          }, "Budget (\u20AC)")) : createCommentVNode("", true),
                          withDirectives(createVNode("input", {
                            type: "number",
                            "onUpdate:modelValue": ($event) => sp.budget = $event,
                            class: "form-input",
                            placeholder: "\u20AC",
                            required: ""
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, sp.budget]
                          ])
                        ]),
                        form.value.sponsorisations.length > 1 ? (openBlock(), createBlock("button", {
                          key: 0,
                          type: "button",
                          class: "btn-danger-ghost",
                          style: { "height": "38px", "padding": "0", "width": "30px", "display": "flex", "justify-content": "center", "align-items": "center" },
                          onClick: ($event) => form.value.sponsorisations.splice(idx, 1)
                        }, [
                          createVNode(unref(Trash2), { size: 16 })
                        ], 8, ["onClick"])) : createCommentVNode("", true)
                      ]);
                    }), 128)),
                    createVNode("button", {
                      type: "button",
                      class: "btn btn-secondary btn-sm",
                      onClick: ($event) => form.value.sponsorisations.push({ themeId: "", budget: "" }),
                      style: { "width": "100%", "justify-content": "center" }
                    }, [
                      createVNode(unref(Plus), { size: 14 }),
                      createTextVNode(" Ajouter un autre th\xE8me \xE0 sponsoriser ")
                    ], 8, ["onClick"])
                  ])) : (openBlock(), createBlock("div", {
                    key: 1,
                    style: { "margin-bottom": "1rem", "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" }
                  }, [
                    createVNode("div", { class: "form-group" }, [
                      createVNode("label", { class: "form-label" }, "Th\xE8me du post \xE0 sponsoriser"),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => form.value.themeSponsoId = $event,
                        class: "form-input",
                        required: ""
                      }, [
                        createVNode("option", {
                          value: "",
                          disabled: ""
                        }, "Choisir un th\xE8me"),
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(themes), (th) => {
                          return openBlock(), createBlock("option", {
                            key: th.id,
                            value: th.id
                          }, toDisplayString(th.nom_theme), 9, ["value"]);
                        }), 128))
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, form.value.themeSponsoId]
                      ])
                    ]),
                    createVNode("div", { class: "form-group" }, [
                      createVNode("label", { class: "form-label" }, "Budget (\u20AC)"),
                      withDirectives(createVNode("input", {
                        type: "number",
                        "onUpdate:modelValue": ($event) => form.value.budget = $event,
                        class: "form-input",
                        required: ""
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, form.value.budget]
                      ])
                    ])
                  ])),
                  createVNode("div", { style: { "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" } }, [
                    createVNode("div", { class: "form-group" }, [
                      createVNode("label", { class: "form-label" }, "Date et Heure de sponsorisation"),
                      withDirectives(createVNode("input", {
                        type: "datetime-local",
                        "onUpdate:modelValue": ($event) => form.value.date_limite = $event,
                        class: "form-input",
                        required: ""
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, form.value.date_limite]
                      ])
                    ]),
                    createVNode("div", { class: "form-group" }, [
                      createVNode("label", { class: "form-label" }, "Ciblage / Audience"),
                      withDirectives(createVNode("input", {
                        type: "text",
                        "onUpdate:modelValue": ($event) => form.value.audience = $event,
                        class: "form-input",
                        placeholder: "Ex: 18-35 ans, fans de Manga..."
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, form.value.audience]
                      ])
                    ])
                  ])
                ])) : createCommentVNode("", true),
                createVNode("div", {
                  class: "form-group",
                  style: { "margin-top": "0.5rem" }
                }, [
                  createVNode("label", { class: "form-label" }, "Description sp\xE9cifique / D\xE9tails de la t\xE2che"),
                  withDirectives(createVNode("textarea", {
                    "onUpdate:modelValue": ($event) => form.value.description = $event,
                    class: "form-input",
                    rows: "3",
                    placeholder: "D\xE9taillez le contenu du post ou les documents n\xE9cessaires pour la d\xE9marche..."
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/taches/cm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=cm-BZzSLI0v.mjs.map
