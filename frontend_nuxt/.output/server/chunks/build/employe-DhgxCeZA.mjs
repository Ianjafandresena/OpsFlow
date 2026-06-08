import { _ as __nuxt_component_0 } from './Sidebar-DpkFoeuh.mjs';
import { _ as __nuxt_component_1 } from './server.mjs';
import { ref, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { Menu } from 'lucide-vue-next';
import './nuxt-link-D05iz29k.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './cookie-BaSAbARY.mjs';
import './fetch-BEwQ1c2o.mjs';
import '@vue/shared';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main = {
  __name: "employe",
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
        role: "employe",
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/employe.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=employe-DhgxCeZA.mjs.map
