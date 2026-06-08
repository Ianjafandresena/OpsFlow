import { ref, withAsyncContext, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { u as useCookie } from './cookie-BaSAbARY.mjs';
import { u as useFetch } from './fetch-BEwQ1c2o.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import '@vue/shared';

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
    const weekOffset = ref(0);
    const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const { data: taches } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/taches",
      { query: { employeId: loggedEmployeId.value } },
      "$-h-k4CwGh0"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const currentWeekLabel = computed(() => {
      const now = /* @__PURE__ */ new Date();
      now.setDate(now.getDate() + weekOffset.value * 7);
      const monday = new Date(now);
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      monday.setDate(diff);
      return `${monday.getDate()} ${monday.toLocaleString("fr-FR", { month: "long" })}`;
    });
    const weekDays = computed(() => {
      if (!taches.value) return [];
      const now = /* @__PURE__ */ new Date();
      now.setDate(now.getDate() + weekOffset.value * 7);
      const monday = new Date(now);
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      monday.setDate(diff);
      monday.setHours(0, 0, 0, 0);
      const today = /* @__PURE__ */ new Date();
      today.setHours(0, 0, 0, 0);
      return dayNames.map((label, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const dayTasks = taches.value.filter((t) => {
          const taskDate = new Date(t.date_limite);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate.getTime() === d.getTime();
        }).sort((a, b) => new Date(a.date_limite) - new Date(b.date_limite));
        return {
          label,
          date: d.getDate(),
          isToday: d.getTime() === today.getTime(),
          tasks: dayTasks
        };
      });
    });
    const upcomingTasks = computed(() => {
      if (!taches.value) return [];
      const now = /* @__PURE__ */ new Date();
      return [...taches.value].filter((t) => {
        var _a, _b;
        return new Date(t.date_limite) > now && ((_a = t.statutTache) == null ? void 0 : _a.nom) !== "Termin\xE9" && ((_b = t.statutTache) == null ? void 0 : _b.nom) !== "Publi\xE9";
      }).sort((a, b) => new Date(a.date_limite) - new Date(b.date_limite)).slice(0, 5);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "animate-fade-in" }, _attrs))}><div class="page-header"><div><h1 class="page-title">Mon Planning</h1><p class="page-subtitle" style="${ssrRenderStyle({ "margin-bottom": "0" })}">Vue calendrier de vos prochaines t\xE2ches et deadlines.</p></div></div><div class="card" style="${ssrRenderStyle({ "margin-bottom": "1.5rem" })}"><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "margin-bottom": "1.25rem" })}"><button class="btn btn-secondary btn-sm">`);
      _push(ssrRenderComponent(unref(ChevronLeft), { size: 14 }, null, _parent));
      _push(` Semaine pr\xE9c\xE9dente </button><h3 style="${ssrRenderStyle({ "font-size": "0.9375rem", "font-weight": "600" })}">Semaine du ${ssrInterpolate(currentWeekLabel.value)}</h3><button class="btn btn-secondary btn-sm"> Semaine suivante `);
      _push(ssrRenderComponent(unref(ChevronRight), { size: 14 }, null, _parent));
      _push(`</button></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "repeat(7, 1fr)", "gap": "0.5rem" })}"><!--[-->`);
      ssrRenderList(weekDays.value, (day) => {
        _push(`<div style="${ssrRenderStyle({ "text-align": "center" })}"><div style="${ssrRenderStyle({ "font-size": "0.6875rem", "font-weight": "600", "color": "var(--text-muted)", "text-transform": "uppercase", "margin-bottom": "0.5rem" })}">${ssrInterpolate(day.label)}</div><div style="${ssrRenderStyle([{ "font-size": "1.125rem", "font-weight": "600", "margin-bottom": "0.75rem" }, { color: day.isToday ? "var(--accent-blue)" : "var(--text-primary)" }])}">${ssrInterpolate(day.date)}</div><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "0.375rem", "min-height": "80px" })}"><!--[-->`);
        ssrRenderList(day.tasks, (task) => {
          _push(`<div style="${ssrRenderStyle({ "background": "var(--bg-surface-hover)", "border": "1px solid var(--border-light)", "border-radius": "4px", "padding": "0.375rem 0.5rem", "text-align": "left", "font-size": "0.6875rem" })}"><div style="${ssrRenderStyle({ "font-weight": "600", "white-space": "nowrap", "overflow": "hidden", "text-overflow": "ellipsis" })}">${ssrInterpolate(task.titre)}</div><div style="${ssrRenderStyle({ "color": "var(--text-muted)" })}">${ssrInterpolate(new Date(task.date_limite).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))}</div></div>`);
        });
        _push(`<!--]-->`);
        if (day.tasks.length === 0) {
          _push(`<div style="${ssrRenderStyle({ "font-size": "0.6875rem", "color": "var(--text-muted)", "font-style": "italic", "padding-top": "0.5rem" })}">\u2014</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      });
      _push(`<!--]--></div></div><div class="card" style="${ssrRenderStyle({ "padding": "0", "overflow": "hidden" })}"><div style="${ssrRenderStyle({ "padding": "1rem 1.25rem", "border-bottom": "1px solid var(--border-light)" })}"><h3 style="${ssrRenderStyle({ "font-size": "0.9375rem", "font-weight": "600" })}">Prochaines Deadlines</h3></div><table class="data-table"><thead><tr><th>T\xE2che</th><th>Projet</th><th>Date</th><th>Statut</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(upcomingTasks.value, (task) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        _push(`<tr><td style="${ssrRenderStyle({ "font-weight": "500" })}">${ssrInterpolate(task.titre)}</td><td>${ssrInterpolate((_b = (_a = task.edition) == null ? void 0 : _a.licence) == null ? void 0 : _b.sigle)} - ${ssrInterpolate((_d = (_c = task.edition) == null ? void 0 : _c.ville) == null ? void 0 : _d.nom_ville)}</td><td style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}">${ssrInterpolate(new Date(task.date_limite).toLocaleString([], { dateStyle: "short", timeStyle: "short" }))}</td><td><span class="badge" style="${ssrRenderStyle({ background: ((_e = task.statutTache) == null ? void 0 : _e.couleur) + "20", color: (_f = task.statutTache) == null ? void 0 : _f.couleur, border: "1px solid " + ((_g = task.statutTache) == null ? void 0 : _g.couleur) })}">${ssrInterpolate((_h = task.statutTache) == null ? void 0 : _h.nom)}</span></td></tr>`);
      });
      _push(`<!--]-->`);
      if (upcomingTasks.value.length === 0) {
        _push(`<tr><td colspan="4" style="${ssrRenderStyle({ "text-align": "center", "padding": "2rem", "color": "var(--text-secondary)" })}">Aucune \xE9ch\xE9ance \xE0 venir.</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/employe/planning/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BqQCzPh9.mjs.map
