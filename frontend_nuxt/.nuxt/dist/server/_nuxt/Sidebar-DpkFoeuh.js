import { _ as __nuxt_component_0$1 } from "./nuxt-link-D05iz29k.js";
import { withAsyncContext, computed, mergeProps, withCtx, unref, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { LayoutDashboard, Megaphone, Film, Palette, Code, BarChart2, Users, Link, Settings, Globe, ListTodo, Calendar, User, LogOut } from "lucide-vue-next";
import { a as _export_sfc } from "../server.mjs";
import { u as useCookie } from "./cookie-BaSAbARY.js";
import { u as useFetch } from "./fetch-BEwQ1c2o.js";
const _sfc_main = {
  __name: "Sidebar",
  __ssrInlineRender: true,
  props: {
    role: { type: String, required: true }
  },
  async setup(__props) {
    let __temp, __restore;
    const props = __props;
    const loggedEmployeId = useCookie("employe_id");
    const { data: employes } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/equipe",
      "$0GMnxujRvk"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const myEmployeInfo = computed(() => employes.value?.find((e) => e.id === loggedEmployeId.value));
    const initials = computed(() => {
      if (props.role === "admin") return "AD";
      if (myEmployeInfo.value) return `${myEmployeInfo.value.prenom.charAt(0)}${myEmployeInfo.value.nom.charAt(0)}`.toUpperCase();
      return "EM";
    });
    const fullName = computed(() => {
      if (props.role === "admin") return "Administrateur";
      if (myEmployeInfo.value) return `${myEmployeInfo.value.prenom} ${myEmployeInfo.value.nom}`;
      return "Employé";
    });
    const email = computed(() => {
      if (props.role === "admin") return "admin@eventsync.local";
      if (myEmployeInfo.value) return myEmployeInfo.value.email;
      return "employe@eventsync.local";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<aside${ssrRenderAttrs(mergeProps({ class: "layout-sidebar" }, _attrs))} data-v-c367499b><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "0.5rem", "padding": "0 0.5rem", "margin-bottom": "1.5rem" })}" data-v-c367499b><div style="${ssrRenderStyle({ "width": "26px", "height": "26px", "background": "var(--accent-primary)", "border-radius": "6px", "display": "flex", "align-items": "center", "justify-content": "center", "color": "white", "font-weight": "700", "font-size": "0.7rem" })}" data-v-c367499b>ES</div><span style="${ssrRenderStyle({ "font-size": "1rem", "font-weight": "700", "letter-spacing": "-0.02em" })}" data-v-c367499b>EventSync</span></div><nav style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "1.25rem", "flex": "1", "overflow-y": "auto" })}" data-v-c367499b>`);
      if (__props.role === "admin") {
        _push(`<!--[--><div data-v-c367499b><div class="nav-section-title" data-v-c367499b>Overview</div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin",
          class: "nav-link",
          "exact-active-class": "nav-link-active"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(LayoutDashboard), { size: 15 }, null, _parent2, _scopeId));
              _push2(` Dashboard `);
            } else {
              return [
                createVNode(unref(LayoutDashboard), { size: 15 }),
                createTextVNode(" Dashboard ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div data-v-c367499b><div class="nav-section-title" data-v-c367499b>Tâches par Département</div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/taches/cm",
          class: "nav-link",
          "active-class": "nav-link-active"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Megaphone), { size: 15 }, null, _parent2, _scopeId));
              _push2(` Community Managers `);
            } else {
              return [
                createVNode(unref(Megaphone), { size: 15 }),
                createTextVNode(" Community Managers ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/taches/monteur",
          class: "nav-link",
          "active-class": "nav-link-active"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Film), { size: 15 }, null, _parent2, _scopeId));
              _push2(` Monteurs Vidéo `);
            } else {
              return [
                createVNode(unref(Film), { size: 15 }),
                createTextVNode(" Monteurs Vidéo ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/taches/designer",
          class: "nav-link",
          "active-class": "nav-link-active"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Palette), { size: 15 }, null, _parent2, _scopeId));
              _push2(` Designers `);
            } else {
              return [
                createVNode(unref(Palette), { size: 15 }),
                createTextVNode(" Designers ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/taches/dev",
          class: "nav-link",
          "active-class": "nav-link-active"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Code), { size: 15 }, null, _parent2, _scopeId));
              _push2(` Développeurs Web `);
            } else {
              return [
                createVNode(unref(Code), { size: 15 }),
                createTextVNode(" Développeurs Web ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div data-v-c367499b><div class="nav-section-title" data-v-c367499b>Analyse</div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/meta",
          class: "nav-link",
          "active-class": "nav-link-active"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(BarChart2), { size: 15 }, null, _parent2, _scopeId));
              _push2(` Meta Ads `);
            } else {
              return [
                createVNode(unref(BarChart2), { size: 15 }),
                createTextVNode(" Meta Ads ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div data-v-c367499b><div class="nav-section-title" data-v-c367499b>Gestion</div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/equipe",
          class: "nav-link",
          "active-class": "nav-link-active"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Users), { size: 15 }, null, _parent2, _scopeId));
              _push2(` Équipe &amp; Rôles `);
            } else {
              return [
                createVNode(unref(Users), { size: 15 }),
                createTextVNode(" Équipe & Rôles ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/affectations",
          class: "nav-link",
          "active-class": "nav-link-active"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Link), { size: 15 }, null, _parent2, _scopeId));
              _push2(` Affectations `);
            } else {
              return [
                createVNode(unref(Link), { size: 15 }),
                createTextVNode(" Affectations ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div data-v-c367499b><div class="nav-section-title" data-v-c367499b>Configuration</div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/parametres",
          class: "nav-link",
          "active-class": "nav-link-active"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Settings), { size: 15 }, null, _parent2, _scopeId));
              _push2(` Événements &amp; Villes `);
            } else {
              return [
                createVNode(unref(Settings), { size: 15 }),
                createTextVNode(" Événements & Villes ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/plateformes",
          class: "nav-link",
          "active-class": "nav-link-active"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Globe), { size: 15 }, null, _parent2, _scopeId));
              _push2(` Plateformes `);
            } else {
              return [
                createVNode(unref(Globe), { size: 15 }),
                createTextVNode(" Plateformes ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      if (__props.role === "employe") {
        _push(`<!--[--><div data-v-c367499b><div class="nav-section-title" data-v-c367499b>Overview</div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/employe",
          class: "nav-link",
          "exact-active-class": "nav-link-active"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(LayoutDashboard), { size: 15 }, null, _parent2, _scopeId));
              _push2(` Dashboard `);
            } else {
              return [
                createVNode(unref(LayoutDashboard), { size: 15 }),
                createTextVNode(" Dashboard ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div data-v-c367499b><div class="nav-section-title" data-v-c367499b>Mon Activité</div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/employe/taches",
          class: "nav-link",
          "active-class": "nav-link-active"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ListTodo), { size: 15 }, null, _parent2, _scopeId));
              _push2(` Mes Tâches `);
            } else {
              return [
                createVNode(unref(ListTodo), { size: 15 }),
                createTextVNode(" Mes Tâches ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/employe/planning",
          class: "nav-link",
          "active-class": "nav-link-active"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Calendar), { size: 15 }, null, _parent2, _scopeId));
              _push2(` Mon Planning `);
            } else {
              return [
                createVNode(unref(Calendar), { size: 15 }),
                createTextVNode(" Mon Planning ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div data-v-c367499b><div class="nav-section-title" data-v-c367499b>Compte</div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/employe/profil",
          class: "nav-link",
          "active-class": "nav-link-active"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(User), { size: 15 }, null, _parent2, _scopeId));
              _push2(` Mon Profil `);
            } else {
              return [
                createVNode(unref(User), { size: 15 }),
                createTextVNode(" Mon Profil ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</nav><div style="${ssrRenderStyle({ "border-top": "1px solid var(--border-light)", "padding-top": "0.75rem", "margin-top": "0.75rem" })}" data-v-c367499b><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "0.5rem", "padding": "0.5rem", "border-radius": "6px", "background": "var(--bg-surface-hover)", "margin-bottom": "0.5rem" })}" data-v-c367499b><div style="${ssrRenderStyle({ "width": "28px", "height": "28px", "border-radius": "50%", "background": "var(--accent-blue)", "display": "flex", "align-items": "center", "justify-content": "center", "color": "white", "font-size": "0.7rem", "font-weight": "600" })}" data-v-c367499b>${ssrInterpolate(initials.value)}</div><div style="${ssrRenderStyle({ "flex": "1", "min-width": "0" })}" data-v-c367499b><div style="${ssrRenderStyle({ "font-size": "0.8125rem", "font-weight": "600", "white-space": "nowrap", "overflow": "hidden", "text-overflow": "ellipsis" })}" data-v-c367499b>${ssrInterpolate(fullName.value)}</div><div style="${ssrRenderStyle({ "font-size": "0.6875rem", "color": "var(--text-muted)" })}" data-v-c367499b>${ssrInterpolate(email.value)}</div></div></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "nav-link",
        style: { "color": "var(--text-muted)" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(LogOut), { size: 15 }, null, _parent2, _scopeId));
            _push2(` Déconnexion `);
          } else {
            return [
              createVNode(unref(LogOut), { size: 15 }),
              createTextVNode(" Déconnexion ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></aside>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Sidebar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c367499b"]]);
export {
  __nuxt_component_0 as _
};
//# sourceMappingURL=Sidebar-DpkFoeuh.js.map
