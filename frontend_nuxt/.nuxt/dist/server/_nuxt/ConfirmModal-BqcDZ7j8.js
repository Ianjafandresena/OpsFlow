import { mergeProps, withCtx, unref, createVNode, openBlock, createBlock, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderClass } from "vue/server-renderer";
import { AlertTriangle, Info } from "lucide-vue-next";
import { _ as __nuxt_component_0 } from "./Modal-D-MuMCI8.js";
import { a as _export_sfc } from "../server.mjs";
const _sfc_main = {
  __name: "ConfirmModal",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean, required: true },
    title: { type: String, default: "Confirmation" },
    message: { type: String, required: true },
    confirmText: { type: String, default: "Confirmer" },
    cancelText: { type: String, default: "Annuler" },
    isDanger: { type: Boolean, default: true }
  },
  emits: ["confirm", "cancel"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const confirm = () => emit("confirm");
    const cancel = () => emit("cancel");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(__nuxt_component_0, mergeProps({
        isOpen: __props.isOpen,
        title: __props.title,
        onClose: cancel
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "1.5rem" })}" data-v-d653f8de${_scopeId}><div style="${ssrRenderStyle({ "color": "var(--text-secondary)", "line-height": "1.5", "display": "flex", "align-items": "flex-start", "gap": "0.75rem" })}" data-v-d653f8de${_scopeId}>`);
            if (__props.isDanger) {
              _push2(ssrRenderComponent(unref(AlertTriangle), {
                size: 24,
                style: { "color": "var(--danger-color)", "flex-shrink": "0" }
              }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(Info), {
                size: 24,
                style: { "color": "var(--primary-color)", "flex-shrink": "0" }
              }, null, _parent2, _scopeId));
            }
            _push2(`<div style="${ssrRenderStyle({ "font-size": "1rem" })}" data-v-d653f8de${_scopeId}>${ssrInterpolate(__props.message)}</div></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "flex-end", "gap": "0.75rem" })}" data-v-d653f8de${_scopeId}><button type="button" class="btn btn-secondary" data-v-d653f8de${_scopeId}>${ssrInterpolate(__props.cancelText)}</button><button type="button" class="${ssrRenderClass([__props.isDanger ? "btn-danger" : "btn-primary", "btn"])}" data-v-d653f8de${_scopeId}>${ssrInterpolate(__props.confirmText)}</button></div></div>`);
          } else {
            return [
              createVNode("div", { style: { "display": "flex", "flex-direction": "column", "gap": "1.5rem" } }, [
                createVNode("div", { style: { "color": "var(--text-secondary)", "line-height": "1.5", "display": "flex", "align-items": "flex-start", "gap": "0.75rem" } }, [
                  __props.isDanger ? (openBlock(), createBlock(unref(AlertTriangle), {
                    key: 0,
                    size: 24,
                    style: { "color": "var(--danger-color)", "flex-shrink": "0" }
                  })) : (openBlock(), createBlock(unref(Info), {
                    key: 1,
                    size: 24,
                    style: { "color": "var(--primary-color)", "flex-shrink": "0" }
                  })),
                  createVNode("div", { style: { "font-size": "1rem" } }, toDisplayString(__props.message), 1)
                ]),
                createVNode("div", { style: { "display": "flex", "justify-content": "flex-end", "gap": "0.75rem" } }, [
                  createVNode("button", {
                    type: "button",
                    class: "btn btn-secondary",
                    onClick: cancel
                  }, toDisplayString(__props.cancelText), 1),
                  createVNode("button", {
                    type: "button",
                    class: ["btn", __props.isDanger ? "btn-danger" : "btn-primary"],
                    onClick: confirm
                  }, toDisplayString(__props.confirmText), 3)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ConfirmModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d653f8de"]]);
export {
  __nuxt_component_1 as _
};
//# sourceMappingURL=ConfirmModal-BqcDZ7j8.js.map
