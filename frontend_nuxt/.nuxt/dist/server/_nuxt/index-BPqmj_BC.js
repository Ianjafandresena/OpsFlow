import { _ as __nuxt_component_0 } from "./Modal-D-MuMCI8.js";
import { _ as __nuxt_component_1 } from "./ConfirmModal-BqcDZ7j8.js";
import { _ as __nuxt_component_2 } from "./TacheDetailModal-DA3ccqFV.js";
import { withAsyncContext, computed, ref, mergeProps, unref, withCtx, createVNode, withModifiers, openBlock, createBlock, Fragment, withDirectives, vModelSelect, renderList, toDisplayString, vModelCheckbox, createTextVNode, vModelText, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from "vue/server-renderer";
import { useRouter } from "vue-router";
import { Plus, Search, MoreVertical, Eye, Check, Edit, Trash2 } from "lucide-vue-next";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/hookable/dist/index.mjs";
import { u as useCookie } from "./cookie-BaSAbARY.js";
import { u as useFetch } from "./fetch-BEwQ1c2o.js";
import "../server.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/unctx/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/h3/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/defu/dist/defu.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/ufo/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/cookie-es/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/destr/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/ohash/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/klona/dist/index.mjs";
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
      "$-_Gw3tpdAq"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const myEmployeInfo = computed(() => employes.value?.find((e) => e.id === loggedEmployeId.value));
    const userDept = computed(() => {
      const p = myEmployeInfo.value?.poste?.titre_poste || "";
      if (p.includes("Monteur")) return "Audiovisuel";
      if (p.includes("Designer") || p.includes("Graphiste")) return "Design";
      if (p.includes("Développeur") || p.includes("Tech")) return "Technique";
      return myEmployeInfo.value?.poste?.departement?.nom_departement || "Communication";
    });
    const { data: taches, refresh: refreshTaches } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/taches",
      { query: { employeId: loggedEmployeId.value } },
      "$IVDIqw8AZt"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: editions } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/editions",
      "$0pCLdodF1X"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: statuts } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/taches/statuts",
      "$ldpjUAZRol"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: themes } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/themes",
      "$QmAZxFh0A2"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const modal = ref(false);
    const editing = ref(false);
    const activeDropdownId = ref(null);
    const isDemandeModif = ref(false);
    const detailModal = ref(false);
    const detailTache = ref(null);
    const motifModal = ref({
      isOpen: false,
      title: "",
      message: "",
      motif: "",
      type: "",
      tacheId: "",
      payload: null
    });
    const confirmModal = ref({ isOpen: false, title: "", message: "", onConfirm: null });
    const onConfirmExecute = async () => {
      if (confirmModal.value.onConfirm) await confirmModal.value.onConfirm();
      confirmModal.value.isOpen = false;
    };
    const filters = ref({ search: "", editionId: "", statutTacheId: "" });
    const getIsoTime = (d) => {
      if (!d) return "";
      const dt = new Date(d);
      dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
      return dt.toISOString().slice(0, 16);
    };
    const defaultForm = () => {
      const defaultStatut = statuts.value?.find((s) => s.niveau_progression === 0)?.id || "";
      return {
        id: null,
        titre: "",
        employeId: loggedEmployeId.value,
        editionId: "",
        statutTacheId: defaultStatut,
        date_limite: getIsoTime(/* @__PURE__ */ new Date()),
        date_demande: "",
        description: "",
        // Champs spécifiques CM
        typeTache: "Publication",
        plateformes: ["Facebook"],
        type_pub: "Poste",
        themePubId: "",
        themeSponsoId: "",
        sponsorisations: [{ themeId: "", budget: "" }],
        type_demarche: "",
        budget: null,
        audience: "",
        outil_mailing: "Brevo",
        // Champs spécifiques Monteur
        demandeur: "",
        // Champs spécifiques Designer
        type_visuel: "Affiche",
        quantite: 1,
        // Champs spécifiques Dev
        type_technique: "Site Vitrine"
      };
    };
    const form = ref(defaultForm());
    const filteredTasks = computed(() => {
      if (!taches.value) return [];
      return taches.value.filter((t) => {
        if (filters.value.search && !t.titre.toLowerCase().includes(filters.value.search.toLowerCase()) && !t.description?.toLowerCase().includes(filters.value.search.toLowerCase())) return false;
        if (filters.value.editionId && t.editionId !== filters.value.editionId) return false;
        if (filters.value.statutTacheId && t.statutTacheId !== filters.value.statutTacheId) return false;
        return true;
      });
    });
    const save = async () => {
      if (isDemandeModif.value) {
        modal.value = false;
        motifModal.value = {
          isOpen: true,
          title: "Justifier la Modification",
          message: `Veuillez spécifier le motif pour la modification de la tâche : "${form.value.titre}".`,
          motif: "",
          type: "MODIFICATION",
          tacheId: form.value.id,
          payload: { ...form.value }
        };
        return;
      }
      if (userDept.value === "Communication") {
        if (editing.value || form.value.typeTache !== "Sponsorisation (Ads)") {
          const body = { ...form.value };
          let genTitre = form.value.typeTache;
          if (body.typeTache === "Publication") genTitre = `${body.plateforme || body.plateformes.join(", ")} - ${body.type_pub}`;
          if (body.typeTache === "Démarche Administrative") genTitre = body.type_demarche || "Démarche";
          if (body.typeTache === "Sponsorisation (Ads)") genTitre = `Sponsorisation (${body.budget || 0}€)`;
          if (body.typeTache === "Publication") {
            body.type_demarche = null;
            body.budget = null;
            body.audience = null;
            body.outil_mailing = null;
            body.date_demande = null;
            body.themeSponsoId = null;
          } else if (body.typeTache === "Démarche Administrative") {
            body.plateforme = null;
            body.type_pub = null;
            body.themePubId = null;
            body.budget = null;
            body.audience = null;
            body.outil_mailing = null;
            body.themeSponsoId = null;
            if (body.date_demande) body.date_demande = new Date(body.date_demande).toISOString();
            body.date_resultat = new Date(body.date_limite).toISOString();
          } else if (body.typeTache === "Sponsorisation (Ads)") {
            body.plateforme = null;
            body.type_pub = null;
            body.themePubId = null;
            body.type_demarche = null;
            body.outil_mailing = null;
            body.date_demande = null;
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
            } else {
              body.titre = genTitre;
            }
            await $fetch("/api/taches", { method: "POST", body });
          }
        } else {
          for (const sp of form.value.sponsorisations) {
            if (!sp.themeId || !sp.budget) continue;
            const body = {
              ...form.value,
              titre: `Sponsorisation (${sp.budget}€)`,
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
      } else {
        const body = { ...form.value };
        body.date_limite = new Date(body.date_limite).toISOString();
        body.employeId = loggedEmployeId.value;
        if (userDept.value === "Audiovisuel") {
          body.typeTache = "MONTEUR";
          body.type_visuel = null;
          body.quantite = null;
          body.type_technique = null;
        } else if (userDept.value === "Design") {
          body.typeTache = "DESIGNER";
          body.format_video = null;
          body.duree_cible = null;
          body.demandeur = null;
          body.type_technique = null;
        } else if (userDept.value === "Technique") {
          body.typeTache = "DEV";
          body.format_video = null;
          body.duree_cible = null;
          body.demandeur = null;
          body.type_visuel = null;
          body.quantite = null;
        }
        await $fetch("/api/taches", { method: "POST", body });
      }
      await refreshTaches();
      modal.value = false;
    };
    const submitDemande = async () => {
      const body = {
        tacheId: motifModal.value.tacheId,
        typeDemande: motifModal.value.type,
        motif: motifModal.value.motif,
        donneesModif: null
      };
      if (motifModal.value.type === "MODIFICATION" && motifModal.value.payload) {
        const payload = { ...motifModal.value.payload };
        payload.date_limite = new Date(payload.date_limite).toISOString();
        if (payload.date_demande) payload.date_demande = new Date(payload.date_demande).toISOString();
        if (payload.date_resultat) payload.date_resultat = new Date(payload.date_resultat).toISOString();
        if (userDept.value === "Communication") {
          payload.typeTache;
          if (payload.typeTache === "Publication") {
            payload.plateforme = payload.plateformes?.join(", ") || "";
            payload.titre = `${payload.plateforme} - ${payload.type_pub}`;
            payload.type_demarche = null;
            payload.budget = null;
            payload.audience = null;
            payload.outil_mailing = null;
            payload.date_demande = null;
            payload.themeSponsoId = null;
          } else if (payload.typeTache === "Démarche Administrative") {
            payload.plateforme = null;
            payload.type_pub = null;
            payload.themePubId = null;
            payload.budget = null;
            payload.audience = null;
            payload.outil_mailing = null;
            payload.themeSponsoId = null;
          } else if (payload.typeTache === "Sponsorisation (Ads)") {
            payload.plateforme = null;
            payload.type_pub = null;
            payload.themePubId = null;
            payload.type_demarche = null;
            payload.outil_mailing = null;
            payload.date_demande = null;
          } else if (payload.typeTache === "Mailing (Newsletter)") {
            payload.plateforme = null;
            payload.type_pub = null;
            payload.themePubId = null;
            payload.type_demarche = null;
            payload.budget = null;
            payload.audience = null;
            payload.date_demande = null;
            payload.themeSponsoId = null;
          }
        } else if (userDept.value === "Audiovisuel") {
          payload.typeTache = "MONTEUR";
          payload.type_visuel = null;
          payload.quantite = null;
          payload.type_technique = null;
        } else if (userDept.value === "Design") {
          payload.typeTache = "DESIGNER";
          payload.format_video = null;
          payload.duree_cible = null;
          payload.demandeur = null;
          payload.type_technique = null;
        } else if (userDept.value === "Technique") {
          payload.typeTache = "DEV";
          payload.format_video = null;
          payload.duree_cible = null;
          payload.demandeur = null;
          payload.type_visuel = null;
          payload.quantite = null;
        }
        body.donneesModif = payload;
      }
      await $fetch("/api/taches/demandes", {
        method: "POST",
        body
      });
      motifModal.value.isOpen = false;
      isDemandeModif.value = false;
      await refreshTaches();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Modal = __nuxt_component_0;
      const _component_ConfirmModal = __nuxt_component_1;
      const _component_TacheDetailModal = __nuxt_component_2;
      if (myEmployeInfo.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "animate-fade-in" }, _attrs))}><div class="page-header"><div><h1 class="page-title">Mes Tâches</h1><p class="page-subtitle" style="${ssrRenderStyle({ "margin-bottom": "0" })}">Suivi de vos assignations pour ${ssrInterpolate(myEmployeInfo.value.poste?.titre_poste)}</p></div><button class="btn btn-primary">`);
        _push(ssrRenderComponent(unref(Plus), { size: 15 }, null, _parent));
        _push(` Nouvelle Tâche </button></div><div class="card toolbar" style="${ssrRenderStyle({ "margin-bottom": "1.25rem" })}"><div class="search-wrapper">`);
        _push(ssrRenderComponent(unref(Search), {
          class: "search-icon",
          size: 14
        }, null, _parent));
        _push(`<input type="text"${ssrRenderAttr("value", filters.value.search)} placeholder="Rechercher une tâche..." class="form-input"></div>`);
        if (userDept.value !== "Audiovisuel") {
          _push(`<select class="form-input"><option value=""${ssrIncludeBooleanAttr(Array.isArray(filters.value.editionId) ? ssrLooseContain(filters.value.editionId, "") : ssrLooseEqual(filters.value.editionId, "")) ? " selected" : ""}>Tous mes Projets</option><!--[-->`);
          ssrRenderList(unref(editions), (ed) => {
            _push(`<option${ssrRenderAttr("value", ed.id)}${ssrIncludeBooleanAttr(Array.isArray(filters.value.editionId) ? ssrLooseContain(filters.value.editionId, ed.id) : ssrLooseEqual(filters.value.editionId, ed.id)) ? " selected" : ""}>${ssrInterpolate(ed.licence?.sigle)} - ${ssrInterpolate(ed.ville?.nom_ville)}</option>`);
          });
          _push(`<!--]--></select>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<select class="form-input"><option value=""${ssrIncludeBooleanAttr(Array.isArray(filters.value.statutTacheId) ? ssrLooseContain(filters.value.statutTacheId, "") : ssrLooseEqual(filters.value.statutTacheId, "")) ? " selected" : ""}>Tous Statuts</option><!--[-->`);
        ssrRenderList(unref(statuts), (st) => {
          _push(`<option${ssrRenderAttr("value", st.id)}${ssrIncludeBooleanAttr(Array.isArray(filters.value.statutTacheId) ? ssrLooseContain(filters.value.statutTacheId, st.id) : ssrLooseEqual(filters.value.statutTacheId, st.id)) ? " selected" : ""}>${ssrInterpolate(st.nom)}</option>`);
        });
        _push(`<!--]--></select></div><div class="card" style="${ssrRenderStyle({ "padding": "0", "overflow": "visible" })}"><table class="data-table"><thead><tr><th>Tâche</th>`);
        if (userDept.value !== "Audiovisuel") {
          _push(`<th>Projet / Événement</th>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<th>Deadline</th><th>Statut</th><th style="${ssrRenderStyle({ "text-align": "right" })}">Actions</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(filteredTasks.value, (task) => {
          _push(`<tr><td><div style="${ssrRenderStyle({ "font-weight": "600" })}">${ssrInterpolate(task.titre)}</div><div style="${ssrRenderStyle({ "color": "var(--text-secondary)", "font-size": "0.75rem", "max-width": "300px", "white-space": "nowrap", "overflow": "hidden", "text-overflow": "ellipsis" })}">${ssrInterpolate(task.description)}</div></td>`);
          if (userDept.value !== "Audiovisuel") {
            _push(`<td style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}">${ssrInterpolate(task.edition?.licence?.sigle)} - ${ssrInterpolate(task.edition?.ville?.nom_ville)}</td>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<td style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}"><strong style="${ssrRenderStyle({ color: new Date(task.date_limite) < /* @__PURE__ */ new Date() && task.statutTache?.nom !== "Terminé" && task.statutTache?.nom !== "Publié" ? "var(--danger-color)" : "inherit" })}">${ssrInterpolate(new Date(task.date_limite).toLocaleDateString())}</strong></td><td><select class="form-input" style="${ssrRenderStyle([{ "padding": "0.25rem 0.5rem", "font-size": "0.75rem", "border-radius": "4px" }, { background: task.statutTache?.couleur + "20", color: task.statutTache?.couleur, borderColor: task.statutTache?.couleur }])}"><!--[-->`);
          ssrRenderList(unref(statuts), (st) => {
            _push(`<option${ssrRenderAttr("value", st.id)}${ssrIncludeBooleanAttr(task.statutTacheId === st.id) ? " selected" : ""}>${ssrInterpolate(st.nom)}</option>`);
          });
          _push(`<!--]--></select></td><td style="${ssrRenderStyle({ "text-align": "right", "position": "relative" })}"><button type="button" class="btn btn-secondary btn-icon" title="Actions">`);
          _push(ssrRenderComponent(unref(MoreVertical), { size: 14 }, null, _parent));
          _push(`</button>`);
          if (activeDropdownId.value === task.id) {
            _push(`<div class="dropdown-menu-list"><button type="button" class="dropdown-item">`);
            _push(ssrRenderComponent(unref(Eye), { size: 13 }, null, _parent));
            _push(` Voir les détails </button><button type="button" class="dropdown-item">`);
            _push(ssrRenderComponent(unref(Check), { size: 13 }, null, _parent));
            _push(` Terminer la tâche </button><button type="button" class="dropdown-item">`);
            _push(ssrRenderComponent(unref(Edit), { size: 13 }, null, _parent));
            _push(` Demander modif. </button><button type="button" class="dropdown-item dropdown-item-danger">`);
            _push(ssrRenderComponent(unref(Trash2), { size: 13 }, null, _parent));
            _push(` Demander suppr. </button></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td></tr>`);
        });
        _push(`<!--]-->`);
        if (filteredTasks.value.length === 0) {
          _push(`<tr><td${ssrRenderAttr("colspan", userDept.value === "Audiovisuel" ? 4 : 5)} style="${ssrRenderStyle({ "text-align": "center", "padding": "2rem", "color": "var(--text-secondary)" })}">Aucune tâche trouvée.</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div>`);
        _push(ssrRenderComponent(_component_Modal, {
          isOpen: modal.value,
          title: isDemandeModif.value ? "Demande de Modification" : editing.value ? "Modifier la Tâche" : "Nouvelle Tâche",
          onClose: ($event) => modal.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<form style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "1rem" })}"${_scopeId}>`);
              if (userDept.value === "Communication") {
                _push2(`<!--[--><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Type de Tâche</label><select required class="form-input"${_scopeId}><option${ssrIncludeBooleanAttr(Array.isArray(form.value.typeTache) ? ssrLooseContain(form.value.typeTache, null) : ssrLooseEqual(form.value.typeTache, null)) ? " selected" : ""}${_scopeId}>Publication</option><option${ssrIncludeBooleanAttr(Array.isArray(form.value.typeTache) ? ssrLooseContain(form.value.typeTache, null) : ssrLooseEqual(form.value.typeTache, null)) ? " selected" : ""}${_scopeId}>Démarche Administrative</option><option${ssrIncludeBooleanAttr(Array.isArray(form.value.typeTache) ? ssrLooseContain(form.value.typeTache, null) : ssrLooseEqual(form.value.typeTache, null)) ? " selected" : ""}${_scopeId}>Mailing (Newsletter)</option><option${ssrIncludeBooleanAttr(Array.isArray(form.value.typeTache) ? ssrLooseContain(form.value.typeTache, null) : ssrLooseEqual(form.value.typeTache, null)) ? " selected" : ""}${_scopeId}>Sponsorisation (Ads)</option></select></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Page concernée</label><select required class="form-input"${_scopeId}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(form.value.editionId) ? ssrLooseContain(form.value.editionId, "") : ssrLooseEqual(form.value.editionId, "")) ? " selected" : ""}${_scopeId}>Choisir la page</option><!--[-->`);
                ssrRenderList(unref(editions), (ed) => {
                  _push2(`<option${ssrRenderAttr("value", ed.id)}${ssrIncludeBooleanAttr(Array.isArray(form.value.editionId) ? ssrLooseContain(form.value.editionId, ed.id) : ssrLooseEqual(form.value.editionId, ed.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(ed.licence?.sigle)} - ${ssrInterpolate(ed.ville?.nom_ville)}</option>`);
                });
                _push2(`<!--]--></select></div></div>`);
                if (form.value.typeTache === "Publication") {
                  _push2(`<div style="${ssrRenderStyle({ "padding-top": "0.5rem", "border-top": "1px solid var(--border-light)" })}"${_scopeId}><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem", "margin-bottom": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Plateformes</label><div style="${ssrRenderStyle({ "display": "flex", "gap": "1rem", "align-items": "center", "height": "38px" })}"${_scopeId}><label style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "0.25rem", "font-size": "0.875rem" })}"${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(form.value.plateformes) ? ssrLooseContain(form.value.plateformes, "Facebook") : form.value.plateformes) ? " checked" : ""} value="Facebook"${_scopeId}> Facebook</label><label style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "0.25rem", "font-size": "0.875rem" })}"${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(form.value.plateformes) ? ssrLooseContain(form.value.plateformes, "Instagram") : form.value.plateformes) ? " checked" : ""} value="Instagram"${_scopeId}> Instagram</label><label style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "0.25rem", "font-size": "0.875rem" })}"${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(form.value.plateformes) ? ssrLooseContain(form.value.plateformes, "TikTok") : form.value.plateformes) ? " checked" : ""} value="TikTok"${_scopeId}> TikTok</label></div></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Type de publication</label><select class="form-input"${_scopeId}><option${ssrIncludeBooleanAttr(Array.isArray(form.value.type_pub) ? ssrLooseContain(form.value.type_pub, null) : ssrLooseEqual(form.value.type_pub, null)) ? " selected" : ""}${_scopeId}>Poste</option><option${ssrIncludeBooleanAttr(Array.isArray(form.value.type_pub) ? ssrLooseContain(form.value.type_pub, null) : ssrLooseEqual(form.value.type_pub, null)) ? " selected" : ""}${_scopeId}>Story</option><option${ssrIncludeBooleanAttr(Array.isArray(form.value.type_pub) ? ssrLooseContain(form.value.type_pub, null) : ssrLooseEqual(form.value.type_pub, null)) ? " selected" : ""}${_scopeId}>Reels</option></select></div></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Thème du post</label><select class="form-input"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(form.value.themePubId) ? ssrLooseContain(form.value.themePubId, "") : ssrLooseEqual(form.value.themePubId, "")) ? " selected" : ""}${_scopeId}>Aucun</option><!--[-->`);
                  ssrRenderList(unref(themes), (th) => {
                    _push2(`<option${ssrRenderAttr("value", th.id)}${ssrIncludeBooleanAttr(Array.isArray(form.value.themePubId) ? ssrLooseContain(form.value.themePubId, th.id) : ssrLooseEqual(form.value.themePubId, th.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(th.nom_theme)}</option>`);
                  });
                  _push2(`<!--]--></select></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Date et Heure de publication</label><input type="datetime-local"${ssrRenderAttr("value", form.value.date_limite)} class="form-input" required${_scopeId}></div></div></div>`);
                } else {
                  _push2(`<!---->`);
                }
                if (form.value.typeTache === "Démarche Administrative") {
                  _push2(`<div style="${ssrRenderStyle({ "padding-top": "0.5rem", "border-top": "1px solid var(--border-light)" })}"${_scopeId}><div class="form-group" style="${ssrRenderStyle({ "margin-bottom": "1rem" })}"${_scopeId}><label class="form-label"${_scopeId}>Type de démarche</label><input type="text"${ssrRenderAttr("value", form.value.type_demarche)} class="form-input" placeholder="Ex: Mairie, Boissons..." required${_scopeId}></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Date limite de Demande</label><input type="date"${ssrRenderAttr("value", form.value.date_demande)} class="form-input"${_scopeId}></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Date limite Résultat</label><input type="date"${ssrRenderAttr("value", form.value.date_limite)} class="form-input" required${_scopeId}></div></div></div>`);
                } else {
                  _push2(`<!---->`);
                }
                if (form.value.typeTache === "Mailing (Newsletter)") {
                  _push2(`<div style="${ssrRenderStyle({ "padding-top": "0.5rem", "border-top": "1px solid var(--border-light)" })}"${_scopeId}><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Outil</label><select class="form-input"${_scopeId}><option${ssrIncludeBooleanAttr(Array.isArray(form.value.outil_mailing) ? ssrLooseContain(form.value.outil_mailing, null) : ssrLooseEqual(form.value.outil_mailing, null)) ? " selected" : ""}${_scopeId}>Brevo</option><option${ssrIncludeBooleanAttr(Array.isArray(form.value.outil_mailing) ? ssrLooseContain(form.value.outil_mailing, null) : ssrLooseEqual(form.value.outil_mailing, null)) ? " selected" : ""}${_scopeId}>Mailchimp</option></select></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Date et Heure d&#39;envoi</label><input type="datetime-local"${ssrRenderAttr("value", form.value.date_limite)} class="form-input" required${_scopeId}></div></div></div>`);
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
                        _push2(`<label class="form-label"${_scopeId}>Thème à sponsoriser</label>`);
                      } else {
                        _push2(`<!---->`);
                      }
                      _push2(`<select class="form-input" required${_scopeId}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(sp.themeId) ? ssrLooseContain(sp.themeId, "") : ssrLooseEqual(sp.themeId, "")) ? " selected" : ""}${_scopeId}>Choisir</option><!--[-->`);
                      ssrRenderList(unref(themes), (th) => {
                        _push2(`<option${ssrRenderAttr("value", th.id)}${ssrIncludeBooleanAttr(Array.isArray(sp.themeId) ? ssrLooseContain(sp.themeId, th.id) : ssrLooseEqual(sp.themeId, th.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(th.nom_theme)}</option>`);
                      });
                      _push2(`<!--]--></select></div><div class="form-group"${_scopeId}>`);
                      if (idx === 0) {
                        _push2(`<label class="form-label"${_scopeId}>Budget (€)</label>`);
                      } else {
                        _push2(`<!---->`);
                      }
                      _push2(`<input type="number"${ssrRenderAttr("value", sp.budget)} class="form-input" required${_scopeId}></div>`);
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
                    _push2(` Ajouter un autre</button></div>`);
                  } else {
                    _push2(`<div style="${ssrRenderStyle({ "margin-bottom": "1rem", "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Thème à sponsoriser</label><select class="form-input" required${_scopeId}><!--[-->`);
                    ssrRenderList(unref(themes), (th) => {
                      _push2(`<option${ssrRenderAttr("value", th.id)}${ssrIncludeBooleanAttr(Array.isArray(form.value.themeSponsoId) ? ssrLooseContain(form.value.themeSponsoId, th.id) : ssrLooseEqual(form.value.themeSponsoId, th.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(th.nom_theme)}</option>`);
                    });
                    _push2(`<!--]--></select></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Budget (€)</label><input type="number"${ssrRenderAttr("value", form.value.budget)} class="form-input" required${_scopeId}></div></div>`);
                  }
                  _push2(`<div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Date et Heure</label><input type="datetime-local"${ssrRenderAttr("value", form.value.date_limite)} class="form-input" required${_scopeId}></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Ciblage / Audience</label><input type="text"${ssrRenderAttr("value", form.value.audience)} class="form-input"${_scopeId}></div></div></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              } else if (userDept.value === "Audiovisuel") {
                _push2(`<!--[--><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Nom du Projet</label><input type="text"${ssrRenderAttr("value", form.value.titre)} required class="form-input" placeholder="Ex: Teaser JOF Évreux 2026"${_scopeId}></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Demandeur</label><select class="form-input"${_scopeId}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(form.value.demandeur) ? ssrLooseContain(form.value.demandeur, "") : ssrLooseEqual(form.value.demandeur, "")) ? " selected" : ""}${_scopeId}>Choisir un demandeur</option><!--[-->`);
                ssrRenderList(unref(employes), (emp) => {
                  _push2(`<option${ssrRenderAttr("value", emp.prenom + " " + emp.nom)}${ssrIncludeBooleanAttr(Array.isArray(form.value.demandeur) ? ssrLooseContain(form.value.demandeur, emp.prenom + " " + emp.nom) : ssrLooseEqual(form.value.demandeur, emp.prenom + " " + emp.nom)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(emp.prenom)} ${ssrInterpolate(emp.nom)}</option>`);
                });
                _push2(`<!--]--></select></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Deadline</label><input type="datetime-local"${ssrRenderAttr("value", form.value.date_limite)} required class="form-input"${_scopeId}></div></div><!--]-->`);
              } else if (userDept.value === "Design") {
                _push2(`<!--[--><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Nom du Livrable</label><input type="text"${ssrRenderAttr("value", form.value.titre)} required class="form-input" placeholder="Ex: Affiche A3, Visuel Annonce Invité..."${_scopeId}></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Événement</label><select required class="form-input"${_scopeId}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(form.value.editionId) ? ssrLooseContain(form.value.editionId, "") : ssrLooseEqual(form.value.editionId, "")) ? " selected" : ""}${_scopeId}>Choisir</option><!--[-->`);
                ssrRenderList(unref(editions), (ed) => {
                  _push2(`<option${ssrRenderAttr("value", ed.id)}${ssrIncludeBooleanAttr(Array.isArray(form.value.editionId) ? ssrLooseContain(form.value.editionId, ed.id) : ssrLooseEqual(form.value.editionId, ed.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(ed.licence?.sigle)} - ${ssrInterpolate(ed.ville?.nom_ville)}</option>`);
                });
                _push2(`<!--]--></select></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Type de Visuel</label><select required class="form-input"${_scopeId}><option${ssrIncludeBooleanAttr(Array.isArray(form.value.type_visuel) ? ssrLooseContain(form.value.type_visuel, null) : ssrLooseEqual(form.value.type_visuel, null)) ? " selected" : ""}${_scopeId}>Affiche</option><option${ssrIncludeBooleanAttr(Array.isArray(form.value.type_visuel) ? ssrLooseContain(form.value.type_visuel, null) : ssrLooseEqual(form.value.type_visuel, null)) ? " selected" : ""}${_scopeId}>Caroussel IG</option></select></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Quantité (Déclinaisons)</label><input type="number"${ssrRenderAttr("value", form.value.quantite)} class="form-input" min="1"${_scopeId}></div></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Deadline</label><input type="datetime-local"${ssrRenderAttr("value", form.value.date_limite)} required class="form-input"${_scopeId}></div><!--]-->`);
              } else if (userDept.value === "Technique") {
                _push2(`<!--[--><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Titre de la Tâche</label><input type="text"${ssrRenderAttr("value", form.value.titre)} required class="form-input" placeholder="Ex: Page Billetterie JOF, Bug Fix..."${_scopeId}></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" })}"${_scopeId}><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Projet / Événement</label><select required class="form-input"${_scopeId}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(form.value.editionId) ? ssrLooseContain(form.value.editionId, "") : ssrLooseEqual(form.value.editionId, "")) ? " selected" : ""}${_scopeId}>Choisir</option><!--[-->`);
                ssrRenderList(unref(editions), (ed) => {
                  _push2(`<option${ssrRenderAttr("value", ed.id)}${ssrIncludeBooleanAttr(Array.isArray(form.value.editionId) ? ssrLooseContain(form.value.editionId, ed.id) : ssrLooseEqual(form.value.editionId, ed.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(ed.licence?.sigle)} - ${ssrInterpolate(ed.ville?.nom_ville)}</option>`);
                });
                _push2(`<!--]--></select></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Type Technique</label><select required class="form-input"${_scopeId}><option${ssrIncludeBooleanAttr(Array.isArray(form.value.type_technique) ? ssrLooseContain(form.value.type_technique, null) : ssrLooseEqual(form.value.type_technique, null)) ? " selected" : ""}${_scopeId}>Site Vitrine</option><option${ssrIncludeBooleanAttr(Array.isArray(form.value.type_technique) ? ssrLooseContain(form.value.type_technique, null) : ssrLooseEqual(form.value.type_technique, null)) ? " selected" : ""}${_scopeId}>Billetterie</option><option${ssrIncludeBooleanAttr(Array.isArray(form.value.type_technique) ? ssrLooseContain(form.value.type_technique, null) : ssrLooseEqual(form.value.type_technique, null)) ? " selected" : ""}${_scopeId}>App Interne</option><option${ssrIncludeBooleanAttr(Array.isArray(form.value.type_technique) ? ssrLooseContain(form.value.type_technique, null) : ssrLooseEqual(form.value.type_technique, null)) ? " selected" : ""}${_scopeId}>Maintenance</option><option${ssrIncludeBooleanAttr(Array.isArray(form.value.type_technique) ? ssrLooseContain(form.value.type_technique, null) : ssrLooseEqual(form.value.type_technique, null)) ? " selected" : ""}${_scopeId}>Autre</option></select></div></div><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Deadline</label><input type="datetime-local"${ssrRenderAttr("value", form.value.date_limite)} required class="form-input"${_scopeId}></div><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
              if (editing.value) {
                _push2(`<div class="form-group" style="${ssrRenderStyle({ "margin-top": "0.5rem" })}"${_scopeId}><label class="form-label"${_scopeId}>Statut</label><select required class="form-input"${_scopeId}><!--[-->`);
                ssrRenderList(unref(statuts), (st) => {
                  _push2(`<option${ssrRenderAttr("value", st.id)}${ssrIncludeBooleanAttr(Array.isArray(form.value.statutTacheId) ? ssrLooseContain(form.value.statutTacheId, st.id) : ssrLooseEqual(form.value.statutTacheId, st.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(st.nom)}</option>`);
                });
                _push2(`<!--]--></select></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Description / Détails / Brief</label><textarea class="form-input" rows="3" placeholder="Informations complémentaires, liens, consignes..."${_scopeId}>${ssrInterpolate(form.value.description)}</textarea></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "flex-end", "gap": "0.5rem", "margin-top": "0.5rem" })}"${_scopeId}><button type="button" class="btn btn-secondary"${_scopeId}>Annuler</button><button type="submit" class="btn btn-primary"${_scopeId}>${ssrInterpolate(isDemandeModif.value ? "Envoyer la Demande" : editing.value ? "Enregistrer" : "Créer")}</button></div></form>`);
            } else {
              return [
                createVNode("form", {
                  onSubmit: withModifiers(save, ["prevent"]),
                  style: { "display": "flex", "flex-direction": "column", "gap": "1rem" }
                }, [
                  userDept.value === "Communication" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                    createVNode("div", { style: { "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" } }, [
                      createVNode("div", { class: "form-group" }, [
                        createVNode("label", { class: "form-label" }, "Type de Tâche"),
                        withDirectives(createVNode("select", {
                          "onUpdate:modelValue": ($event) => form.value.typeTache = $event,
                          required: "",
                          class: "form-input"
                        }, [
                          createVNode("option", null, "Publication"),
                          createVNode("option", null, "Démarche Administrative"),
                          createVNode("option", null, "Mailing (Newsletter)"),
                          createVNode("option", null, "Sponsorisation (Ads)")
                        ], 8, ["onUpdate:modelValue"]), [
                          [vModelSelect, form.value.typeTache]
                        ])
                      ]),
                      createVNode("div", { class: "form-group" }, [
                        createVNode("label", { class: "form-label" }, "Page concernée"),
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
                            return openBlock(), createBlock("option", {
                              key: ed.id,
                              value: ed.id
                            }, toDisplayString(ed.licence?.sigle) + " - " + toDisplayString(ed.ville?.nom_ville), 9, ["value"]);
                          }), 128))
                        ], 8, ["onUpdate:modelValue"]), [
                          [vModelSelect, form.value.editionId]
                        ])
                      ])
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
                              createTextVNode(" Facebook")
                            ]),
                            createVNode("label", { style: { "display": "flex", "align-items": "center", "gap": "0.25rem", "font-size": "0.875rem" } }, [
                              withDirectives(createVNode("input", {
                                type: "checkbox",
                                "onUpdate:modelValue": ($event) => form.value.plateformes = $event,
                                value: "Instagram"
                              }, null, 8, ["onUpdate:modelValue"]), [
                                [vModelCheckbox, form.value.plateformes]
                              ]),
                              createTextVNode(" Instagram")
                            ]),
                            createVNode("label", { style: { "display": "flex", "align-items": "center", "gap": "0.25rem", "font-size": "0.875rem" } }, [
                              withDirectives(createVNode("input", {
                                type: "checkbox",
                                "onUpdate:modelValue": ($event) => form.value.plateformes = $event,
                                value: "TikTok"
                              }, null, 8, ["onUpdate:modelValue"]), [
                                [vModelCheckbox, form.value.plateformes]
                              ]),
                              createTextVNode(" TikTok")
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
                          createVNode("label", { class: "form-label" }, "Thème du post"),
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
                    form.value.typeTache === "Démarche Administrative" ? (openBlock(), createBlock("div", {
                      key: 1,
                      style: { "padding-top": "0.5rem", "border-top": "1px solid var(--border-light)" }
                    }, [
                      createVNode("div", {
                        class: "form-group",
                        style: { "margin-bottom": "1rem" }
                      }, [
                        createVNode("label", { class: "form-label" }, "Type de démarche"),
                        withDirectives(createVNode("input", {
                          type: "text",
                          "onUpdate:modelValue": ($event) => form.value.type_demarche = $event,
                          class: "form-input",
                          placeholder: "Ex: Mairie, Boissons...",
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
                          createVNode("label", { class: "form-label" }, "Date limite Résultat"),
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
                          createVNode("label", { class: "form-label" }, "Outil"),
                          withDirectives(createVNode("select", {
                            "onUpdate:modelValue": ($event) => form.value.outil_mailing = $event,
                            class: "form-input"
                          }, [
                            createVNode("option", null, "Brevo"),
                            createVNode("option", null, "Mailchimp")
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
                              }, "Thème à sponsoriser")) : createCommentVNode("", true),
                              withDirectives(createVNode("select", {
                                "onUpdate:modelValue": ($event) => sp.themeId = $event,
                                class: "form-input",
                                required: ""
                              }, [
                                createVNode("option", {
                                  value: "",
                                  disabled: ""
                                }, "Choisir"),
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
                              }, "Budget (€)")) : createCommentVNode("", true),
                              withDirectives(createVNode("input", {
                                type: "number",
                                "onUpdate:modelValue": ($event) => sp.budget = $event,
                                class: "form-input",
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
                          createTextVNode(" Ajouter un autre")
                        ], 8, ["onClick"])
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        style: { "margin-bottom": "1rem", "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" }
                      }, [
                        createVNode("div", { class: "form-group" }, [
                          createVNode("label", { class: "form-label" }, "Thème à sponsoriser"),
                          withDirectives(createVNode("select", {
                            "onUpdate:modelValue": ($event) => form.value.themeSponsoId = $event,
                            class: "form-input",
                            required: ""
                          }, [
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
                          createVNode("label", { class: "form-label" }, "Budget (€)"),
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
                          createVNode("label", { class: "form-label" }, "Date et Heure"),
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
                            class: "form-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, form.value.audience]
                          ])
                        ])
                      ])
                    ])) : createCommentVNode("", true)
                  ], 64)) : userDept.value === "Audiovisuel" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                    createVNode("div", { class: "form-group" }, [
                      createVNode("label", { class: "form-label" }, "Nom du Projet"),
                      withDirectives(createVNode("input", {
                        type: "text",
                        "onUpdate:modelValue": ($event) => form.value.titre = $event,
                        required: "",
                        class: "form-input",
                        placeholder: "Ex: Teaser JOF Évreux 2026"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, form.value.titre]
                      ])
                    ]),
                    createVNode("div", { style: { "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" } }, [
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
                    ])
                  ], 64)) : userDept.value === "Design" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                    createVNode("div", { class: "form-group" }, [
                      createVNode("label", { class: "form-label" }, "Nom du Livrable"),
                      withDirectives(createVNode("input", {
                        type: "text",
                        "onUpdate:modelValue": ($event) => form.value.titre = $event,
                        required: "",
                        class: "form-input",
                        placeholder: "Ex: Affiche A3, Visuel Annonce Invité..."
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, form.value.titre]
                      ])
                    ]),
                    createVNode("div", { class: "form-group" }, [
                      createVNode("label", { class: "form-label" }, "Événement"),
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
                          return openBlock(), createBlock("option", {
                            key: ed.id,
                            value: ed.id
                          }, toDisplayString(ed.licence?.sigle) + " - " + toDisplayString(ed.ville?.nom_ville), 9, ["value"]);
                        }), 128))
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, form.value.editionId]
                      ])
                    ]),
                    createVNode("div", { style: { "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" } }, [
                      createVNode("div", { class: "form-group" }, [
                        createVNode("label", { class: "form-label" }, "Type de Visuel"),
                        withDirectives(createVNode("select", {
                          "onUpdate:modelValue": ($event) => form.value.type_visuel = $event,
                          required: "",
                          class: "form-input"
                        }, [
                          createVNode("option", null, "Affiche"),
                          createVNode("option", null, "Caroussel IG")
                        ], 8, ["onUpdate:modelValue"]), [
                          [vModelSelect, form.value.type_visuel]
                        ])
                      ]),
                      createVNode("div", { class: "form-group" }, [
                        createVNode("label", { class: "form-label" }, "Quantité (Déclinaisons)"),
                        withDirectives(createVNode("input", {
                          type: "number",
                          "onUpdate:modelValue": ($event) => form.value.quantite = $event,
                          class: "form-input",
                          min: "1"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, form.value.quantite]
                        ])
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
                  ], 64)) : userDept.value === "Technique" ? (openBlock(), createBlock(Fragment, { key: 3 }, [
                    createVNode("div", { class: "form-group" }, [
                      createVNode("label", { class: "form-label" }, "Titre de la Tâche"),
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
                    createVNode("div", { style: { "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "1rem" } }, [
                      createVNode("div", { class: "form-group" }, [
                        createVNode("label", { class: "form-label" }, "Projet / Événement"),
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
                            return openBlock(), createBlock("option", {
                              key: ed.id,
                              value: ed.id
                            }, toDisplayString(ed.licence?.sigle) + " - " + toDisplayString(ed.ville?.nom_ville), 9, ["value"]);
                          }), 128))
                        ], 8, ["onUpdate:modelValue"]), [
                          [vModelSelect, form.value.editionId]
                        ])
                      ]),
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
                  ], 64)) : createCommentVNode("", true),
                  editing.value ? (openBlock(), createBlock("div", {
                    key: 4,
                    class: "form-group",
                    style: { "margin-top": "0.5rem" }
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
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "form-group" }, [
                    createVNode("label", { class: "form-label" }, "Description / Détails / Brief"),
                    withDirectives(createVNode("textarea", {
                      "onUpdate:modelValue": ($event) => form.value.description = $event,
                      class: "form-input",
                      rows: "3",
                      placeholder: "Informations complémentaires, liens, consignes..."
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
                    }, toDisplayString(isDemandeModif.value ? "Envoyer la Demande" : editing.value ? "Enregistrer" : "Créer"), 1)
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
        _push(ssrRenderComponent(_component_Modal, {
          isOpen: motifModal.value.isOpen,
          title: motifModal.value.title,
          onClose: ($event) => motifModal.value.isOpen = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<form style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "1rem" })}"${_scopeId}><p style="${ssrRenderStyle({ "color": "var(--text-secondary)", "font-size": "0.875rem" })}"${_scopeId}>${ssrInterpolate(motifModal.value.message)}</p><div class="form-group"${_scopeId}><label class="form-label"${_scopeId}>Motif / Justification de la demande</label><textarea required class="form-input" rows="3" placeholder="Pourquoi demandez-vous cela ? (ex: Erreur de saisie, Changement de planning...)"${_scopeId}>${ssrInterpolate(motifModal.value.motif)}</textarea></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "flex-end", "gap": "0.5rem", "margin-top": "0.5rem" })}"${_scopeId}><button type="button" class="btn btn-secondary"${_scopeId}>Annuler</button><button type="submit" class="btn btn-primary"${_scopeId}>Envoyer la demande</button></div></form>`);
            } else {
              return [
                createVNode("form", {
                  onSubmit: withModifiers(submitDemande, ["prevent"]),
                  style: { "display": "flex", "flex-direction": "column", "gap": "1rem" }
                }, [
                  createVNode("p", { style: { "color": "var(--text-secondary)", "font-size": "0.875rem" } }, toDisplayString(motifModal.value.message), 1),
                  createVNode("div", { class: "form-group" }, [
                    createVNode("label", { class: "form-label" }, "Motif / Justification de la demande"),
                    withDirectives(createVNode("textarea", {
                      "onUpdate:modelValue": ($event) => motifModal.value.motif = $event,
                      required: "",
                      class: "form-input",
                      rows: "3",
                      placeholder: "Pourquoi demandez-vous cela ? (ex: Erreur de saisie, Changement de planning...)"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, motifModal.value.motif]
                    ])
                  ]),
                  createVNode("div", { style: { "display": "flex", "justify-content": "flex-end", "gap": "0.5rem", "margin-top": "0.5rem" } }, [
                    createVNode("button", {
                      type: "button",
                      class: "btn btn-secondary",
                      onClick: ($event) => motifModal.value.isOpen = false
                    }, "Annuler", 8, ["onClick"]),
                    createVNode("button", {
                      type: "submit",
                      class: "btn btn-primary"
                    }, "Envoyer la demande")
                  ])
                ], 32)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_TacheDetailModal, {
          isOpen: detailModal.value,
          tache: detailTache.value,
          onClose: ($event) => detailModal.value = false
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/employe/taches/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-BPqmj_BC.js.map
