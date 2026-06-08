import { computed, unref, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { Eye, X } from 'lucide-vue-next';
import { a as _export_sfc } from './server.mjs';

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
      var _a, _b, _c;
      if (!((_a = props.tache) == null ? void 0 : _a.date_limite)) return false;
      const st = (_c = (_b = props.tache) == null ? void 0 : _b.statutTache) == null ? void 0 : _c.nom;
      if (st === "Termin\xE9" || st === "Publi\xE9") return false;
      return new Date(props.tache.date_limite) < /* @__PURE__ */ new Date();
    });
    const formatDate = (d) => {
      if (!d) return "\u2014";
      return new Date(d).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
    };
    const formatDateShort = (d) => {
      if (!d) return "\u2014";
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K;
        if (__props.isOpen) {
          _push2(`<div class="modal-overlay" data-v-594fd853><div class="detail-modal" data-v-594fd853><div class="detail-modal-header" data-v-594fd853><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "0.75rem", "flex": "1", "min-width": "0" })}" data-v-594fd853><div class="detail-icon-wrap" data-v-594fd853>`);
          _push2(ssrRenderComponent(unref(Eye), { size: 16 }, null, _parent));
          _push2(`</div><div style="${ssrRenderStyle({ "min-width": "0" })}" data-v-594fd853><div style="${ssrRenderStyle({ "font-weight": "700", "font-size": "0.9375rem", "white-space": "nowrap", "overflow": "hidden", "text-overflow": "ellipsis" })}" data-v-594fd853>${ssrInterpolate((_a = __props.tache) == null ? void 0 : _a.titre)}</div><div style="${ssrRenderStyle({ "font-size": "0.75rem", "color": "var(--text-secondary)", "margin-top": "1px" })}" data-v-594fd853> D\xE9tail de la t\xE2che </div></div></div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "0.75rem", "flex-shrink": "0" })}" data-v-594fd853>`);
          if ((_b = __props.tache) == null ? void 0 : _b.statutTache) {
            _push2(`<span class="badge" style="${ssrRenderStyle({ background: __props.tache.statutTache.couleur + "20", color: __props.tache.statutTache.couleur, border: "1px solid " + __props.tache.statutTache.couleur })}" data-v-594fd853>${ssrInterpolate(__props.tache.statutTache.nom)}</span>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="modal-close-btn" data-v-594fd853>`);
          _push2(ssrRenderComponent(unref(X), { size: 16 }, null, _parent));
          _push2(`</button></div></div><div class="detail-modal-body" data-v-594fd853><div class="detail-section" data-v-594fd853><div class="detail-section-title" data-v-594fd853>Informations g\xE9n\xE9rales</div><div class="detail-grid" data-v-594fd853>`);
          if ((_c = __props.tache) == null ? void 0 : _c.employe) {
            _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Assign\xE9 \xE0</div><div class="detail-value detail-value-bold" data-v-594fd853><div class="detail-avatar" data-v-594fd853>${ssrInterpolate((_d = __props.tache.employe.prenom) == null ? void 0 : _d.charAt(0))}${ssrInterpolate((_e = __props.tache.employe.nom) == null ? void 0 : _e.charAt(0))}</div> ${ssrInterpolate(__props.tache.employe.prenom)} ${ssrInterpolate(__props.tache.employe.nom)}</div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if ((_f = __props.tache) == null ? void 0 : _f.edition) {
            _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Page / \xC9v\xE9nement</div><div class="detail-value" data-v-594fd853>${ssrInterpolate((_g = __props.tache.edition.licence) == null ? void 0 : _g.sigle)} \u2014 ${ssrInterpolate((_h = __props.tache.edition.ville) == null ? void 0 : _h.nom_ville)}</div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if ((_i = __props.tache) == null ? void 0 : _i.demandeur) {
            _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Demandeur</div><div class="detail-value" data-v-594fd853>${ssrInterpolate(__props.tache.demandeur)}</div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if ((_j = __props.tache) == null ? void 0 : _j.date_limite) {
            _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Deadline</div><div class="detail-value" style="${ssrRenderStyle({ color: isLate.value ? "var(--status-danger)" : "inherit", fontWeight: isLate.value ? "600" : "500" })}" data-v-594fd853>${ssrInterpolate(formatDate(__props.tache.date_limite))} `);
            if (isLate.value) {
              _push2(`<span style="${ssrRenderStyle({ "font-size": "0.7rem", "margin-left": "4px" })}" data-v-594fd853>\u26A0 D\xE9pass\xE9e</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if ((_k = __props.tache) == null ? void 0 : _k.createdAt) {
            _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Cr\xE9\xE9e le</div><div class="detail-value" data-v-594fd853>${ssrInterpolate(formatDate(__props.tache.createdAt))}</div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div>`);
          if (((_l = __props.tache) == null ? void 0 : _l.plateforme) || ((_m = __props.tache) == null ? void 0 : _m.type_pub)) {
            _push2(`<div class="detail-section" data-v-594fd853><div class="detail-section-title" data-v-594fd853>Publication</div><div class="detail-grid" data-v-594fd853>`);
            if ((_n = __props.tache) == null ? void 0 : _n.plateforme) {
              _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Plateformes</div><div class="detail-value" style="${ssrRenderStyle({ "display": "flex", "gap": "0.4rem", "flex-wrap": "wrap" })}" data-v-594fd853><!--[-->`);
              ssrRenderList(parsePlateforme(__props.tache.plateforme), (pl) => {
                _push2(`<span class="badge badge-primary" data-v-594fd853>${ssrInterpolate(pl)}</span>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if ((_o = __props.tache) == null ? void 0 : _o.type_pub) {
              _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Type de publication</div><div class="detail-value" data-v-594fd853><span class="badge badge-neutral" data-v-594fd853>${ssrInterpolate(__props.tache.type_pub)}</span></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if ((_p = __props.tache) == null ? void 0 : _p.themePub) {
              _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Th\xE8me du post</div><div class="detail-value" data-v-594fd853>${ssrInterpolate((_q = __props.tache.themePub) == null ? void 0 : _q.nom_theme)}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if ((_r = __props.tache) == null ? void 0 : _r.type_demarche) {
            _push2(`<div class="detail-section" data-v-594fd853><div class="detail-section-title" data-v-594fd853>D\xE9marche Administrative</div><div class="detail-grid" data-v-594fd853><div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Type de d\xE9marche</div><div class="detail-value" data-v-594fd853>${ssrInterpolate(__props.tache.type_demarche)}</div></div>`);
            if ((_s = __props.tache) == null ? void 0 : _s.date_demande) {
              _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Date limite Demande</div><div class="detail-value" data-v-594fd853>${ssrInterpolate(formatDateShort(__props.tache.date_demande))}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if ((_t = __props.tache) == null ? void 0 : _t.date_resultat) {
              _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Date limite R\xE9sultat</div><div class="detail-value" data-v-594fd853>${ssrInterpolate(formatDateShort(__props.tache.date_resultat))}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if ((_u = __props.tache) == null ? void 0 : _u.outil_mailing) {
            _push2(`<div class="detail-section" data-v-594fd853><div class="detail-section-title" data-v-594fd853>Mailing / Newsletter</div><div class="detail-grid" data-v-594fd853><div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Outil</div><div class="detail-value" data-v-594fd853><span class="badge badge-info" data-v-594fd853>${ssrInterpolate(__props.tache.outil_mailing)}</span></div></div></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (((_v = __props.tache) == null ? void 0 : _v.budget) || ((_w = __props.tache) == null ? void 0 : _w.audience)) {
            _push2(`<div class="detail-section" data-v-594fd853><div class="detail-section-title" data-v-594fd853>Sponsorisation (Ads)</div><div class="detail-grid" data-v-594fd853>`);
            if ((_x = __props.tache) == null ? void 0 : _x.themeSponso) {
              _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Th\xE8me \xE0 sponsoriser</div><div class="detail-value" data-v-594fd853>${ssrInterpolate((_y = __props.tache.themeSponso) == null ? void 0 : _y.nom_theme)}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if ((_z = __props.tache) == null ? void 0 : _z.budget) {
              _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Budget allou\xE9</div><div class="detail-value" style="${ssrRenderStyle({ "font-weight": "700", "color": "var(--accent-primary)" })}" data-v-594fd853>${ssrInterpolate(__props.tache.budget)} \u20AC</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if ((_A = __props.tache) == null ? void 0 : _A.audience) {
              _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Ciblage / Audience</div><div class="detail-value" data-v-594fd853>${ssrInterpolate(__props.tache.audience)}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (((_B = __props.tache) == null ? void 0 : _B.format_video) || ((_C = __props.tache) == null ? void 0 : _C.duree_cible)) {
            _push2(`<div class="detail-section" data-v-594fd853><div class="detail-section-title" data-v-594fd853>Montage Vid\xE9o</div><div class="detail-grid" data-v-594fd853>`);
            if ((_D = __props.tache) == null ? void 0 : _D.format_video) {
              _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Format vid\xE9o</div><div class="detail-value" data-v-594fd853><span class="badge badge-neutral" data-v-594fd853>${ssrInterpolate(__props.tache.format_video)}</span></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if ((_E = __props.tache) == null ? void 0 : _E.duree_cible) {
              _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Dur\xE9e cible</div><div class="detail-value" data-v-594fd853>${ssrInterpolate(__props.tache.duree_cible)}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (((_F = __props.tache) == null ? void 0 : _F.type_visuel) || ((_G = __props.tache) == null ? void 0 : _G.quantite)) {
            _push2(`<div class="detail-section" data-v-594fd853><div class="detail-section-title" data-v-594fd853>Cr\xE9ation Graphique</div><div class="detail-grid" data-v-594fd853>`);
            if ((_H = __props.tache) == null ? void 0 : _H.type_visuel) {
              _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Type de visuel</div><div class="detail-value" data-v-594fd853><span class="badge badge-neutral" data-v-594fd853>${ssrInterpolate(__props.tache.type_visuel)}</span></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if ((_I = __props.tache) == null ? void 0 : _I.quantite) {
              _push2(`<div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Quantit\xE9</div><div class="detail-value" data-v-594fd853>${ssrInterpolate(__props.tache.quantite)}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if ((_J = __props.tache) == null ? void 0 : _J.type_technique) {
            _push2(`<div class="detail-section" data-v-594fd853><div class="detail-section-title" data-v-594fd853>D\xE9veloppement</div><div class="detail-grid" data-v-594fd853><div class="detail-field" data-v-594fd853><div class="detail-label" data-v-594fd853>Type technique</div><div class="detail-value" data-v-594fd853><span class="badge badge-neutral" data-v-594fd853>${ssrInterpolate(__props.tache.type_technique)}</span></div></div></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if ((_K = __props.tache) == null ? void 0 : _K.description) {
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

export { __nuxt_component_2 as _ };
//# sourceMappingURL=TacheDetailModal-DA3ccqFV.mjs.map
