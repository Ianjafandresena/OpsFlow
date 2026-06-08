import { _ as __nuxt_component_0 } from "./Sidebar-DpkFoeuh.js";
import { _ as __nuxt_component_1 } from "../server.mjs";
import { ref, watch, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent } from "vue/server-renderer";
import { useRoute } from "vue-router";
import { Menu } from "lucide-vue-next";
import "./nuxt-link-D05iz29k.js";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/ufo/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/defu/dist/defu.mjs";
import "./cookie-BaSAbARY.js";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/cookie-es/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/h3/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/destr/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/ohash/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/klona/dist/index.mjs";
import "./fetch-BEwQ1c2o.js";
import "@vue/shared";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/perfect-debounce/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/hookable/dist/index.mjs";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "D:/planning/systeme_centralise/frontend_nuxt/node_modules/unctx/dist/index.mjs";
const _sfc_main = {
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    const sidebarOpen = ref(false);
    const route = useRoute();
    watch(() => route.path, () => {
      sidebarOpen.value = false;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Sidebar = __nuxt_component_0;
      const _component_NuxtPage = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "layout-app" }, _attrs))}><div class="mobile-header"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "0.5rem" })}"><div style="${ssrRenderStyle({ "width": "26px", "height": "26px", "background": "var(--accent-primary)", "border-radius": "6px", "display": "flex", "align-items": "center", "justify-content": "center", "color": "white", "font-weight": "700", "font-size": "0.7rem" })}">ES</div><span style="${ssrRenderStyle({ "font-size": "1rem", "font-weight": "700", "letter-spacing": "-0.02em" })}">EventSync</span></div><button class="btn btn-secondary btn-icon">`);
      _push(ssrRenderComponent(unref(Menu), { size: 20 }, null, _parent));
      _push(`</button></div>`);
      if (sidebarOpen.value) {
        _push(`<div class="sidebar-backdrop"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_Sidebar, {
        role: "admin",
        class: { "sidebar-open": sidebarOpen.value },
        onClose: ($event) => sidebarOpen.value = false
      }, null, _parent));
      _push(`<main class="layout-main">`);
      _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent));
      _push(`</main></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=admin-ISAo859w.js.map
