import { computed, unref, useSSRContext } from "vue";
import { ssrRenderTeleport, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { Eye, X } from "lucide-vue-next";
import { a as _export_sfc } from "../server.mjs";
const _sfc_main = {
  __name: "TacheDetailModal",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean, default: false },
    tache: { type: Object, default: null }
  },
  emits: ["close"],
  setup(__props) {
    const props = __props;
    const isLate = computed(() => {
      if (!props.tache?.date_limite) return false;
      const st = props.tache?.statutTache?.nom;
      if (st === "Terminé" || st === "Publié") return false;
      return new Date(props.tache.date_limite) < /* @__PURE__ */ new Date();
    });
    const formatDate = (d) => {
      if (!d) return "—";
      return new Date(d).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
    };
    const formatDateShort = (d) => {
      if (!d) return "—";
      return new Date(d).toLocaleDateString("fr-FR");
    };
    const parsePlateforme = (val) => {
      if (!val) return [];
      try {
        return JSON.parse(val);
      } catch {
        return val.split(",").map((s) => s.trim());
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.isOpen) {
          _push2(`<div class="modal-overlay" data-v-594fd853><div class="detail-modal" data-v-594fd853><div class="detail-modal-header" data-v-594fd853><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "0.75rem", "flex": "1", "min-width": "0" })}" data-v-594fd853><div class="detail-icon-wrap" data-v-594fd853>`);
          _push2(ssrRenderComponent(unref(Eye), { size: 16 }, null, _parent));
          _push2(`</div><div style="${ssrRenderStyle({ "min-width": "0" })}" data-v-594fd853><div style="${ssrRenderStyle({ "font-weight": "700", "font-size": "0.9375rem", "white-space": "nowrap", "overflow": "hidden", "text-overflow": "ellipsis" })}" data-v-594fd853>${ssrInterpolate(__props.tache?.titre)}</div><div style="${ssrRenderStyle({ "font-size": "0.75rem", "color": "var(--text-secondary)", "margin-top": "1px" })}" data-v-594fd853> Détail de la tâche </div></div></div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "0.75rem", "flex-shrink": "0" })}" data-v-594fd853>`);
          if (__props.tache?.statutTache) {
            _push2(`<span class="badge" style="${ssrRenderStyle({ background: __props.tache.statutTache.couleur + "20", color: __props.tache.statutTache.couleur, border: "1px solid " + __props.tache.statutTache.couleur })}" data-v-594fd853>${ssrInterpolate(__props.tache.statutTache.nom)}</span>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="modal-close-btn" data-v-594fd853>`);
          _push2(ssrRenderComponent(unref(X), { size: 16 }, null, _parent));
          _push2(`</button></div></div><div class="detail-modal-body" data-v-594fd853><div class="detail-section" data-v-594fd853><div class="detail-section-title" data-v-594fd853>Informations générales</div><div class="detail-grid" data-v-594fd853>`);
          if (__props.tache?.employe) {
            _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Assigné à</div><div class="detail-value detail-value-bold" data-v-594fd853><div class="detail-avatar" data-v-594fd853>${ssrInterpolate(__props.tache.employe.prenom?.charAt(0))}${ssrInterpolate(__props.tache.employe.nom?.charAt(0))}</div> ${ssrInterpolate(__props.tache.employe.prenom)} ${ssrInterpolate(__props.tache.employe.nom)}</div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (__props.tache?.edition) {
            _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Page / Événement</div><div class="detail-value" data-v-594fd853>${ssrInterpolate(__props.tache.edition.licence?.sigle)} — ${ssrInterpolate(__props.tache.edition.ville?.nom_ville)}</div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (__props.tache?.demandeur) {
            _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Demandeur</div><div class="detail-value" data-v-594fd853>${ssrInterpolate(__props.tache.demandeur)}</div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (__props.tache?.date_limite) {
            _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Deadline</div><div class="detail-value" style="${ssrRenderStyle({ color: isLate.value ? "var(--status-danger)" : "inherit", fontWeight: isLate.value ? "600" : "500" })}" data-v-594fd853>${ssrInterpolate(formatDate(__props.tache.date_limite))} `);
            if (isLate.value) {
              _push2(`<span style="${ssrRenderStyle({ "font-size": "0.7rem", "margin-left": "4px" })}" data-v-594fd853>⚠ Dépassée</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (__props.tache?.createdAt) {
            _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Créée le</div><div class="detail-value" data-v-594fd853>${ssrInterpolate(formatDate(__props.tache.createdAt))}</div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div>`);
          if (__props.tache?.plateforme || __props.tache?.type_pub) {
            _push2(`<div class="detail-section" data-v-594fd853><div class="detail-section-title" data-v-594fd853>Publication</div><div class="detail-grid" data-v-594fd853>`);
            if (__props.tache?.plateforme) {
              _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Plateformes</div><div class="detail-value" style="${ssrRenderStyle({ "display": "flex", "gap": "0.4rem", "flex-wrap": "wrap" })}" data-v-594fd853><!--[-->`);
              ssrRenderList(parsePlateforme(__props.tache.plateforme), (pl) => {
                _push2(`<span class="badge badge-primary" data-v-594fd853>${ssrInterpolate(pl)}</span>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.tache?.type_pub) {
              _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Type de publication</div><div class="detail-value" data-v-594fd853><span class="badge badge-neutral" data-v-594fd853>${ssrInterpolate(__props.tache.type_pub)}</span></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.tache?.themePub) {
              _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Thème du post</div><div class="detail-value" data-v-594fd853>${ssrInterpolate(__props.tache.themePub?.nom_theme)}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (__props.tache?.type_demarche) {
            _push2(`<div class="detail-section" data-v-594fd853><div class="detail-section-title" data-v-594fd853>Démarche Administrative</div><div class="detail-grid" data-v-594fd853><div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Type de démarche</div><div class="detail-value" data-v-594fd853>${ssrInterpolate(__props.tache.type_demarche)}</div></div>`);
            if (__props.tache?.date_demande) {
              _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Date limite Demande</div><div class="detail-value" data-v-594fd853>${ssrInterpolate(formatDateShort(__props.tache.date_demande))}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.tache?.date_resultat) {
              _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Date limite Résultat</div><div class="detail-value" data-v-594fd853>${ssrInterpolate(formatDateShort(__props.tache.date_resultat))}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (__props.tache?.outil_mailing) {
            _push2(`<div class="detail-section" data-v-594fd853><div class="detail-section-title" data-v-594fd853>Mailing / Newsletter</div><div class="detail-grid" data-v-594fd853><div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Outil</div><div class="detail-value" data-v-594fd853><span class="badge badge-info" data-v-594fd853>${ssrInterpolate(__props.tache.outil_mailing)}</span></div></div></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (__props.tache?.budget || __props.tache?.audience) {
            _push2(`<div class="detail-section" data-v-594fd853><div class="detail-section-title" data-v-594fd853>Sponsorisation (Ads)</div><div class="detail-grid" data-v-594fd853>`);
            if (__props.tache?.themeSponso) {
              _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Thème à sponsoriser</div><div class="detail-value" data-v-594fd853>${ssrInterpolate(__props.tache.themeSponso?.nom_theme)}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.tache?.budget) {
              _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Budget alloué</div><div class="detail-value" style="${ssrRenderStyle({ "font-weight": "700", "color": "var(--accent-primary)" })}" data-v-594fd853>${ssrInterpolate(__props.tache.budget)} €</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.tache?.audience) {
              _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Ciblage / Audience</div><div class="detail-value" data-v-594fd853>${ssrInterpolate(__props.tache.audience)}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (__props.tache?.format_video || __props.tache?.duree_cible) {
            _push2(`<div class="detail-section" data-v-594fd853><div class="detail-section-title" data-v-594fd853>Montage Vidéo</div><div class="detail-grid" data-v-594fd853>`);
            if (__props.tache?.format_video) {
              _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Format vidéo</div><div class="detail-value" data-v-594fd853><span class="badge badge-neutral" data-v-594fd853>${ssrInterpolate(__props.tache.format_video)}</span></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.tache?.duree_cible) {
              _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Durée cible</div><div class="detail-value" data-v-594fd853>${ssrInterpolate(__props.tache.duree_cible)}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (__props.tache?.type_visuel || __props.tache?.quantite) {
            _push2(`<div class="detail-section" data-v-594fd853><div class="detail-section-title" data-v-594fd853>Création Graphique</div><div class="detail-grid" data-v-594fd853>`);
            if (__props.tache?.type_visuel) {
              _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Type de visuel</div><div class="detail-value" data-v-594fd853><span class="badge badge-neutral" data-v-594fd853>${ssrInterpolate(__props.tache.type_visuel)}</span></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.tache?.quantite) {
              _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Quantité</div><div class="detail-value" data-v-594fd853>${ssrInterpolate(__props.tache.quantite)}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (__props.tache?.type_technique) {
            _push2(`<div class="detail-section" data-v-594fd853><div class="detail-section-title" data-v-594fd853>Développement</div><div class="detail-grid" data-v-594fd853><div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Type technique</div><div class="detail-value" data-v-594fd853><span class="badge badge-neutral" data-v-594fd853>${ssrInterpolate(__props.tache.type_technique)}</span></div></div></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (__props.tache?.description) {
            _push2(`<div class="detail-section" data-v-594fd853><div class="detail-section-title" data-v-594fd853>Notes &amp; Brief</div><div class="detail-desc" data-v-594fd853>${ssrInterpolate(__props.tache.description)}</div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="detail-modal-footer" data-v-594fd853><button class="btn btn-secondary" data-v-594fd853>Fermer</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TacheDetailModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-594fd853"]]);
export {
  __nuxt_component_2 as _
};
//# sourceMappingURL=TacheDetailModal-DA3ccqFV.js.map
