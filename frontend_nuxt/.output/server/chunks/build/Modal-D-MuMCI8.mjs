import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { a as _export_sfc } from './server.mjs';

const _sfc_main = {
  __name: "Modal",
  __ssrInlineRender: true,
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: "Formulaire"
    }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.isOpen) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "modal-overlay" }, _attrs))} data-v-68656c82><div class="modal-content animate-fade-in" data-v-68656c82><div class="modal-header" data-v-68656c82><h3 class="modal-title" data-v-68656c82>${ssrInterpolate(__props.title)}</h3><button class="modal-close-btn" data-v-68656c82><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-68656c82><line x1="18" y1="6" x2="6" y2="18" data-v-68656c82></line><line x1="6" y1="6" x2="18" y2="18" data-v-68656c82></line></svg></button></div><div class="modal-body" data-v-68656c82>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Modal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-68656c82"]]);

export { __nuxt_component_0 as _ };
//# sourceMappingURL=Modal-D-MuMCI8.mjs.map
