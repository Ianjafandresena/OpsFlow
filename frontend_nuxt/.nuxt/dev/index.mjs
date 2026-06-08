import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import { tmpdir } from 'node:os';
import { Server } from 'node:http';
import { resolve, dirname, join } from 'node:path';
import crypto$1 from 'node:crypto';
import { parentPort, threadId } from 'node:worker_threads';
import { defineEventHandler, handleCacheHeaders, splitCookiesString, createEvent, fetchWithEvent, isEvent, eventHandler, setHeaders, createError, sendRedirect, proxyRequest, getRequestHeader, setResponseHeaders, setResponseStatus, send, getRequestHeaders, setResponseHeader, appendResponseHeader, getRequestURL, getResponseHeader, removeResponseHeader, getCookie, getQuery as getQuery$1, readBody, createApp, createRouter as createRouter$1, toNodeListener, lazyEventHandler, getResponseStatus, getRouterParam, setCookie, deleteCookie, getResponseStatusText } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/h3/dist/index.mjs';
import { escapeHtml } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/@vue/shared/dist/shared.cjs.js';
import viteNodeEntry_mjs from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/@nuxt/vite-builder/dist/vite-node-entry.mjs';
import { viteNodeFetch } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/@nuxt/vite-builder/dist/vite-node.mjs';
import https from 'node:https';
import { PrismaClient } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/@prisma/client/default.js';
import { createRenderer, getRequestDependencies, getPreloadLinks, getPrefetchLinks } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, withTrailingSlash, decodePath, withLeadingSlash, withoutTrailingSlash, encodePath, joinRelativeURL } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/ufo/dist/index.mjs';
import { renderToString } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/vue/server-renderer/index.mjs';
import { klona } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/klona/dist/index.mjs';
import defu, { defuFn } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/defu/dist/defu.mjs';
import destr, { destr as destr$1 } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/destr/dist/index.mjs';
import { snakeCase } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/scule/dist/index.mjs';
import { createHead as createHead$1, propsToString, renderSSRHead } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/unhead/dist/server.mjs';
import { stringify, uneval } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/devalue/index.js';
import { isVNode, isRef, toValue } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/vue/index.mjs';
import { DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/unhead/dist/plugins.mjs';
import { createHooks } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/hookable/dist/index.mjs';
import { createFetch, Headers as Headers$1 } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/ofetch/dist/node.mjs';
import { fetchNodeRequestHandler, callNodeRequestHandler } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/node-mock-http/dist/index.mjs';
import { createStorage, prefixStorage } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/unstorage/drivers/fs.mjs';
import file_58_47_47_47D_58_47planning_47systeme_centralise_47frontend_nuxt_47node_modules_47_64nuxt_47nitro_45server_47dist_47runtime_47utils_47cache_45driver_46js from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/@nuxt/nitro-server/dist/runtime/utils/cache-driver.js';
import { digest, hash as hash$1 } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/ohash/dist/index.mjs';
import { toRouteMatcher, createRouter } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/radix3/dist/index.mjs';
import { readFile } from 'node:fs/promises';
import consola, { consola as consola$1 } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/consola/dist/index.mjs';
import { ErrorParser } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/youch-core/build/index.js';
import { Youch } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/youch/build/index.js';
import { SourceMapConsumer } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/source-map/source-map.js';
import { AsyncLocalStorage } from 'node:async_hooks';
import { getContext } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/unctx/dist/index.mjs';
import { captureRawStackTrace, parseRawStackTrace } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/errx/dist/index.js';
import _wH6JrtIxmaSoA8lCPWFnE9z4lQeXW6H5z3l5aymEQw from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/@nuxt/vite-builder/dist/fix-stacktrace.mjs';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname as dirname$1, resolve as resolve$1 } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/pathe/dist/index.mjs';
import { walkResolver } from 'file://D:/planning/systeme_centralise/frontend_nuxt/node_modules/unhead/dist/utils.mjs';

const serverAssets = [{"baseName":"server","dir":"D:/planning/systeme_centralise/frontend_nuxt/server/assets"}];

const assets$1 = createStorage();

for (const asset of serverAssets) {
  assets$1.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir, ignore: (asset?.ignore || []) }));
}

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"D:/planning/systeme_centralise/frontend_nuxt","watchOptions":{"ignored":[null]}}));
storage.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"D:/planning/systeme_centralise/frontend_nuxt/server","watchOptions":{"ignored":[null]}}));
storage.mount('cache:nuxt:payload', file_58_47_47_47D_58_47planning_47systeme_centralise_47frontend_nuxt_47node_modules_47_64nuxt_47nitro_45server_47dist_47runtime_47utils_47cache_45driver_46js({"driver":"file:///D:/planning/systeme_centralise/frontend_nuxt/node_modules/@nuxt/nitro-server/dist/runtime/utils/cache-driver.js","base":"D:/planning/systeme_centralise/frontend_nuxt/.nuxt/cache/nuxt/payload"}));
storage.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"D:/planning/systeme_centralise/frontend_nuxt/.nuxt"}));
storage.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"D:/planning/systeme_centralise/frontend_nuxt/.nuxt/cache"}));
storage.mount('data', unstorage_47drivers_47fs({"driver":"fs","base":"D:/planning/systeme_centralise/frontend_nuxt/.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const inlineAppConfig = {
  "nuxt": {}
};



const appConfig = defuFn(inlineAppConfig);

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "dev",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/**": {
        "headers": {
          "X-Frame-Options": "DENY",
          "X-Content-Type-Options": "nosniff",
          "Referrer-Policy": "strict-origin-when-cross-origin",
          "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
        }
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      }
    }
  },
  "public": {}
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

function isPathInScope(pathname, base) {
  let canonical;
  try {
    const pre = pathname.replace(/%2f/gi, "/").replace(/%5c/gi, "\\");
    canonical = new URL(pre, "http://_").pathname;
  } catch {
    return false;
  }
  return !base || canonical === base || canonical.startsWith(base + "/");
}

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function isJsonRequest(event) {
	
	if (hasReqHeader(event, "accept", "text/html")) {
		return false;
	}
	return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
	const value = getRequestHeader(event, name);
	return !!(value && typeof value === "string" && value.toLowerCase().includes(includes));
}

const iframeStorageBridge = (nonce) => `
(function () {
  const NONCE = ${JSON.stringify(nonce)};
  const memoryStore = Object.create(null);

  const post = (type, payload) => {
    window.parent.postMessage({ type, nonce: NONCE, ...payload }, '*');
  };

  const isValid = (data) => data && data.nonce === NONCE;

  const mockStorage = {
    getItem(key) {
      return Object.hasOwn(memoryStore, key)
        ? memoryStore[key]
        : null;
    },
    setItem(key, value) {
      const v = String(value);
      memoryStore[key] = v;
      post('storage-set', { key, value: v });
    },
    removeItem(key) {
      delete memoryStore[key];
      post('storage-remove', { key });
    },
    clear() {
      for (const key of Object.keys(memoryStore))
        delete memoryStore[key];
      post('storage-clear', {});
    },
    key(index) {
      const keys = Object.keys(memoryStore);
      return keys[index] ?? null;
    },
    get length() {
      return Object.keys(memoryStore).length;
    }
  };

  const defineLocalStorage = () => {
    try {
      Object.defineProperty(window, 'localStorage', {
        value: mockStorage,
        writable: false,
        configurable: true
      });
    } catch {
      window.localStorage = mockStorage;
    }
  };

  defineLocalStorage();

  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!isValid(data) || data.type !== 'storage-sync-data') return;

    const incoming = data.data || {};
    for (const key of Object.keys(incoming))
      memoryStore[key] = incoming[key];

    if (typeof window.initTheme === 'function')
      window.initTheme();
    window.dispatchEvent(new Event('storage-ready'));
  });

  // Clipboard API is unavailable in data: URL iframe, so we use postMessage
  document.addEventListener('DOMContentLoaded', function() {
    window.copyErrorMessage = function(button) {
      post('clipboard-copy', { text: button.dataset.errorText });
      button.classList.add('copied');
      setTimeout(function() { button.classList.remove('copied'); }, 2000);
    };
  });

  post('storage-sync-request', {});
})();
`;
const parentStorageBridge = (nonce) => `
(function () {
  const host = document.querySelector('nuxt-error-overlay');
  if (!host) return;

  const NONCE = ${JSON.stringify(nonce)};
  const isValid = (data) => data && data.nonce === NONCE;

  // Handle clipboard copy from iframe
  window.addEventListener('message', function(e) {
    if (isValid(e) && e.data.type === 'clipboard-copy') {
      navigator.clipboard.writeText(e.data.text).catch(function() {});
    }
  });

  const collectLocalStorage = () => {
    const all = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k != null) all[k] = localStorage.getItem(k);
    }
    return all;
  };

  const attachWhenReady = () => {
    const root = host.shadowRoot;
    if (!root)
      return false;
    const iframe = root.getElementById('frame');
    if (!iframe || !iframe.contentWindow)
      return false;

    const handlers = {
      'storage-set': (d) => localStorage.setItem(d.key, d.value),
      'storage-remove': (d) => localStorage.removeItem(d.key),
      'storage-clear': () => localStorage.clear(),
      'storage-sync-request': () => {
        iframe.contentWindow.postMessage({
          type: 'storage-sync-data',
          data: collectLocalStorage(),
          nonce: NONCE
        }, '*');
      }
    };

    window.addEventListener('message', (event) => {
      const data = event.data;
      if (!isValid(data)) return;
      const fn = handlers[data.type];
      if (fn) fn(data);
    });

    return true;
  };

  if (attachWhenReady())
    return;

  const obs = new MutationObserver(() => {
    if (attachWhenReady())
      obs.disconnect();
  });

  obs.observe(host, { childList: true, subtree: true });
})();
`;
const errorCSS = `
:host {
  --preview-width: 240px;
  --preview-height: 180px;
  --base-width: 1200px;
  --base-height: 900px;
  --z-base: 999999998;
  --error-pip-left: auto;
  --error-pip-top: auto;
  --error-pip-right: 5px;
  --error-pip-bottom: 5px;
  --error-pip-origin: bottom right;
  --app-preview-left: auto;
  --app-preview-top: auto;
  --app-preview-right: 5px;
  --app-preview-bottom: 5px;
  all: initial;
  display: contents;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
#frame {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  border: none;
  z-index: var(--z-base);
}
#frame[inert] {
  left: var(--error-pip-left);
  top: var(--error-pip-top);
  right: var(--error-pip-right);
  bottom: var(--error-pip-bottom);
  width: var(--base-width);
  height: var(--base-height);
  transform: scale(calc(240 / 1200));
  transform-origin: var(--error-pip-origin);
  overflow: hidden;
  border-radius: calc(1200 * 8px / 240);
}
#preview {
  position: fixed;
  left: var(--app-preview-left);
  top: var(--app-preview-top);
  right: var(--app-preview-right);
  bottom: var(--app-preview-bottom);
  width: var(--preview-width);
  height: var(--preview-height);
  overflow: hidden;
  border-radius: 6px;
  pointer-events: none;
  z-index: var(--z-base);
  background: white;
  display: none;
}
#preview iframe {
  transform-origin: var(--error-pip-origin);
}
#frame:not([inert]) + #preview {
  display: block;
}
#toggle {
  position: fixed;
  left: var(--app-preview-left);
  top: var(--app-preview-top);
  right: calc(var(--app-preview-right) - 3px);
  bottom: calc(var(--app-preview-bottom) - 3px);
  width: var(--preview-width);
  height: var(--preview-height);
  background: none;
  border: 3px solid #00DC82;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s, box-shadow 0.2s;
  z-index: calc(var(--z-base) + 1);
  display: flex;
  align-items: center;
  justify-content: center;
}
#toggle:hover,
#toggle:focus {
  opacity: 1;
  box-shadow: 0 0 20px rgba(0, 220, 130, 0.6);
}
#toggle:focus-visible {
  outline: 3px solid #00DC82;
  outline-offset: 0;
  box-shadow: 0 0 24px rgba(0, 220, 130, 0.8);
}
#frame[inert] ~ #toggle {
  left: var(--error-pip-left);
  top: var(--error-pip-top);
  right: calc(var(--error-pip-right) - 3px);
  bottom: calc(var(--error-pip-bottom) - 3px);
  cursor: grab;
}
:host(.dragging) #frame[inert] ~ #toggle {
  cursor: grabbing;
}
#frame:not([inert]) ~ #toggle,
#frame:not([inert]) + #preview {
  cursor: grab;
}
:host(.dragging-preview) #frame:not([inert]) ~ #toggle,
:host(.dragging-preview) #frame:not([inert]) + #preview {
  cursor: grabbing;
}

#pip-close {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 16px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  pointer-events: auto;
}
#pip-close:focus-visible {
  outline: 2px solid #00DC82;
  outline-offset: 2px;
}

#pip-restore {
  position: fixed;
  right: 16px;
  bottom: 16px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 2px solid #00DC82;
  background: #111;
  color: #fff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  z-index: calc(var(--z-base) + 2);
  cursor: grab;
}
#pip-restore:focus-visible {
  outline: 2px solid #00DC82;
  outline-offset: 2px;
}
:host(.dragging-restore) #pip-restore {
  cursor: grabbing;
}

#frame[hidden],
#toggle[hidden],
#preview[hidden],
#pip-restore[hidden],
#pip-close[hidden] {
  display: none !important;
}

@media (prefers-reduced-motion: reduce) {
  #toggle {
    transition: none;
  }
}
`;
function webComponentScript(base64HTML, startMinimized) {
	return `
(function () {
  try {
    // =========================
    // Host + Shadow
    // =========================
    const host = document.querySelector('nuxt-error-overlay');
    if (!host)
      return;
    const shadow = host.attachShadow({ mode: 'open' });

    // =========================
    // DOM helpers
    // =========================
    const el = (tag) => document.createElement(tag);
    const on = (node, type, fn, opts) => node.addEventListener(type, fn, opts);
    const hide = (node, v) => node.toggleAttribute('hidden', !!v);
    const setVar = (name, value) => host.style.setProperty(name, value);
    const unsetVar = (name) => host.style.removeProperty(name);

    // =========================
    // Create DOM
    // =========================
    const style = el('style');
    style.textContent = ${JSON.stringify(errorCSS)};

    const iframe = el('iframe');
    iframe.id = 'frame';
    iframe.src = 'data:text/html;base64,${base64HTML}';
    iframe.title = 'Detailed error stack trace';
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-top-navigation-by-user-activation');

    const preview = el('div');
    preview.id = 'preview';

    const toggle = el('div');
    toggle.id = 'toggle';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('tabindex', '0');
    toggle.innerHTML = '<span class="sr-only">Toggle detailed error view</span>';

    const liveRegion = el('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.className = 'sr-only';

    const pipCloseButton = el('button');
    pipCloseButton.id = 'pip-close';
    pipCloseButton.setAttribute('type', 'button');
    pipCloseButton.setAttribute('aria-label', 'Hide error preview overlay');
    pipCloseButton.innerHTML = '&times;';
    pipCloseButton.hidden = true;
    toggle.appendChild(pipCloseButton);

    const pipRestoreButton = el('button');
    pipRestoreButton.id = 'pip-restore';
    pipRestoreButton.setAttribute('type', 'button');
    pipRestoreButton.setAttribute('aria-label', 'Show error overlay');
    pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error overlay</span>';
    pipRestoreButton.hidden = true;

    // Order matters: #frame + #preview adjacency
    shadow.appendChild(style);
    shadow.appendChild(liveRegion);
    shadow.appendChild(iframe);
    shadow.appendChild(preview);
    shadow.appendChild(toggle);
    shadow.appendChild(pipRestoreButton);

    // =========================
    // Constants / keys
    // =========================
    const POS_KEYS = {
      position: 'nuxt-error-overlay:position',
      hiddenPretty: 'nuxt-error-overlay:error-pip:hidden',
      hiddenPreview: 'nuxt-error-overlay:app-preview:hidden'
    };

    const CSS_VARS = {
      pip: {
        left: '--error-pip-left',
        top: '--error-pip-top',
        right: '--error-pip-right',
        bottom: '--error-pip-bottom'
      },
      preview: {
        left: '--app-preview-left',
        top: '--app-preview-top',
        right: '--app-preview-right',
        bottom: '--app-preview-bottom'
      }
    };

    const MIN_GAP = 5;
    const DRAG_THRESHOLD = 2;

    // =========================
    // Local storage safe access + state
    // =========================
    let storageReady = true;
    let isPrettyHidden = false;
    let isPreviewHidden = false;

    const safeGet = (k) => {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    };

    const safeSet = (k, v) => {
      if (!storageReady) 
        return;
      try {
        localStorage.setItem(k, v);
      } catch {}
    };

    // =========================
    // Sizing helpers
    // =========================
    const vvSize = () => {
      const v = window.visualViewport;
      return v ? { w: v.width, h: v.height } : { w: window.innerWidth, h: window.innerHeight };
    };

    const previewSize = () => {
      const styles = getComputedStyle(host);
      const w = parseFloat(styles.getPropertyValue('--preview-width')) || 240;
      const h = parseFloat(styles.getPropertyValue('--preview-height')) || 180;
      return { w, h };
    };

    const sizeForTarget = (target) => {
      if (!target)
        return previewSize();
      const rect = target.getBoundingClientRect();
      if (rect.width && rect.height)
        return { w: rect.width, h: rect.height };
      return previewSize();
    };

    // =========================
    // Dock model + offset/alignment calculations
    // =========================
    const dock = { edge: null, offset: null, align: null, gap: null };

    const maxOffsetFor = (edge, size) => {
      const vv = vvSize();
      if (edge === 'left' || edge === 'right')
        return Math.max(MIN_GAP, vv.h - size.h - MIN_GAP);
      return Math.max(MIN_GAP, vv.w - size.w - MIN_GAP);
    };

    const clampOffset = (edge, value, size) => {
      const max = maxOffsetFor(edge, size);
      return Math.min(Math.max(value, MIN_GAP), max);
    };

    const updateDockAlignment = (size) => {
      if (!dock.edge || dock.offset == null)
        return;
      const max = maxOffsetFor(dock.edge, size);
      if (dock.offset <= max / 2) {
        dock.align = 'start';
        dock.gap = dock.offset;
      } else {
        dock.align = 'end';
        dock.gap = Math.max(0, max - dock.offset);
      }
    };

    const appliedOffsetFor = (size) => {
      if (!dock.edge || dock.offset == null)
        return null;
      const max = maxOffsetFor(dock.edge, size);

      if (dock.align === 'end' && typeof dock.gap === 'number') {
        return clampOffset(dock.edge, max - dock.gap, size);
      }
      if (dock.align === 'start' && typeof dock.gap === 'number') {
        return clampOffset(dock.edge, dock.gap, size);
      }
      return clampOffset(dock.edge, dock.offset, size);
    };

    const nearestEdgeAt = (x, y) => {
      const { w, h } = vvSize();
      const d = { left: x, right: w - x, top: y, bottom: h - y };
      return Object.keys(d).reduce((a, b) => (d[a] < d[b] ? a : b));
    };

    const cornerDefaultDock = () => {
      const vv = vvSize();
      const size = previewSize();
      const offset = Math.max(MIN_GAP, vv.w - size.w - MIN_GAP);
      return { edge: 'bottom', offset };
    };

    const currentTransformOrigin = () => {
      if (!dock.edge) return null;
      if (dock.edge === 'left' || dock.edge === 'top')
        return 'top left';
      if (dock.edge === 'right')
        return 'top right';
      return 'bottom left';
    };

    // =========================
    // Persist / load dock
    // =========================
    const loadDock = () => {
      const raw = safeGet(POS_KEYS.position);
      if (!raw)
        return;
      try {
        const parsed = JSON.parse(raw);
        const { edge, offset, align, gap } = parsed || {};
        if (!['left', 'right', 'top', 'bottom'].includes(edge))
          return;
        if (typeof offset !== 'number')
          return;

        dock.edge = edge;
        dock.offset = clampOffset(edge, offset, previewSize());
        dock.align = align === 'start' || align === 'end' ? align : null;
        dock.gap = typeof gap === 'number' ? gap : null;

        if (!dock.align || dock.gap == null)
          updateDockAlignment(previewSize());
      } catch {}
    };

    const persistDock = () => {
      if (!dock.edge || dock.offset == null)
        return; 
      safeSet(POS_KEYS.position, JSON.stringify({
        edge: dock.edge,
        offset: dock.offset,
        align: dock.align,
        gap: dock.gap
      }));
    };

    // =========================
    // Apply dock
    // =========================
    const dockToVars = (vars) => ({
      set: (side, v) => host.style.setProperty(vars[side], v),
      clear: (side) => host.style.removeProperty(vars[side])
    });

    const dockToEl = (node) => ({
      set: (side, v) => { node.style[side] = v; },
      clear: (side) => { node.style[side] = ''; }
    });

    const applyDock = (target, size, opts) => {
      if (!dock.edge || dock.offset == null) {
        target.clear('left');
        target.clear('top');
        target.clear('right');
        target.clear('bottom');
        return;
      }

      target.set('left', 'auto');
      target.set('top', 'auto');
      target.set('right', 'auto');
      target.set('bottom', 'auto');

      const applied = appliedOffsetFor(size);

      if (dock.edge === 'left') {
        target.set('left', MIN_GAP + 'px');
        target.set('top', applied + 'px');
      } else if (dock.edge === 'right') {
        target.set('right', MIN_GAP + 'px');
        target.set('top', applied + 'px');
      } else if (dock.edge === 'top') {
        target.set('top', MIN_GAP + 'px');
        target.set('left', applied + 'px');
      } else {
        target.set('bottom', MIN_GAP + 'px');
        target.set('left', applied + 'px');
      }

      if (!opts || opts.persist !== false)
        persistDock();
    };

    const applyDockAll = (opts) => {
      applyDock(dockToVars(CSS_VARS.pip), previewSize(), opts);
      applyDock(dockToVars(CSS_VARS.preview), previewSize(), opts);
      applyDock(dockToEl(pipRestoreButton), sizeForTarget(pipRestoreButton), opts);
    };

    const repaintToDock = () => {
      if (!dock.edge || dock.offset == null)
        return;
      const origin = currentTransformOrigin();
      if (origin)
        setVar('--error-pip-origin', origin);
      else 
        unsetVar('--error-pip-origin');
      applyDockAll({ persist: false });
    };

    // =========================
    // Hidden state + UI
    // =========================
    const loadHidden = () => {
      const rawPretty = safeGet(POS_KEYS.hiddenPretty);
      if (rawPretty != null)
        isPrettyHidden = rawPretty === '1' || rawPretty === 'true';
      const rawPreview = safeGet(POS_KEYS.hiddenPreview);
      if (rawPreview != null)
        isPreviewHidden = rawPreview === '1' || rawPreview === 'true';
    };

    const setPrettyHidden = (v) => {
      isPrettyHidden = !!v;
      safeSet(POS_KEYS.hiddenPretty, isPrettyHidden ? '1' : '0');
      updateUI();
    };

    const setPreviewHidden = (v) => {
      isPreviewHidden = !!v;
      safeSet(POS_KEYS.hiddenPreview, isPreviewHidden ? '1' : '0');
      updateUI();
    };

    const isMinimized = () => iframe.hasAttribute('inert');

    const setMinimized = (v) => {
      if (v) {
        iframe.setAttribute('inert', '');
        toggle.setAttribute('aria-expanded', 'false');
      } else {
        iframe.removeAttribute('inert');
        toggle.setAttribute('aria-expanded', 'true');
      }
    };

    const setRestoreLabel = (kind) => {
      if (kind === 'pretty') {
        pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error overlay</span>';
        pipRestoreButton.setAttribute('aria-label', 'Show error overlay');
      } else {
        pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error page</span>';
        pipRestoreButton.setAttribute('aria-label', 'Show error page');
      }
    };

    const updateUI = () => {
      const minimized = isMinimized();
      const showPiP = minimized && !isPrettyHidden;
      const showPreview = !minimized && !isPreviewHidden;
      const pipHiddenByUser = minimized && isPrettyHidden;
      const previewHiddenByUser = !minimized && isPreviewHidden;
      const showToggle = minimized ? showPiP : showPreview;
      const showRestore = pipHiddenByUser || previewHiddenByUser;

      hide(iframe, pipHiddenByUser);
      hide(preview, !showPreview);
      hide(toggle, !showToggle);
      hide(pipCloseButton, !showToggle);
      hide(pipRestoreButton, !showRestore);

      pipCloseButton.setAttribute('aria-label', minimized ? 'Hide error overlay' : 'Hide error page preview');

      if (pipHiddenByUser)
        setRestoreLabel('pretty');
      else if (previewHiddenByUser)
        setRestoreLabel('preview');

      host.classList.toggle('pip-hidden', isPrettyHidden);
      host.classList.toggle('preview-hidden', isPreviewHidden);
    };

    // =========================
    // Preview snapshot
    // =========================
    const updatePreview = () => {
      try {
        let previewIframe = preview.querySelector('iframe');
        if (!previewIframe) {
          previewIframe = el('iframe');
          previewIframe.style.cssText = 'width: 1200px; height: 900px; transform: scale(0.2); transform-origin: top left; border: none;';
          previewIframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
          preview.appendChild(previewIframe);
        }

        const doctype = document.doctype ? '<!DOCTYPE ' + document.doctype.name + '>' : '';
        const cleanedHTML = document.documentElement.outerHTML
          .replace(/<nuxt-error-overlay[^>]*>.*?<\\/nuxt-error-overlay>/gs, '')
          .replace(/<script[^>]*>.*?<\\/script>/gs, '');

        const iframeDoc = previewIframe.contentDocument || previewIframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(doctype + cleanedHTML);
        iframeDoc.close();
      } catch (err) {
        console.error('Failed to update preview:', err);
      }
    };

    // =========================
    // View toggling
    // =========================
    const toggleView = () => {
      if (isMinimized()) {
        updatePreview();
        setMinimized(false);
        liveRegion.textContent = 'Showing detailed error view';
        setTimeout(() => { 
          try { 
            iframe.contentWindow.focus();
          } catch {}
        }, 100);
      } else {
        setMinimized(true);
        liveRegion.textContent = 'Showing error page';
        repaintToDock();
        void iframe.offsetWidth;
      }
      updateUI();
    };

    // =========================
    // Dragging (unified, rAF throttled)
    // =========================
    let drag = null;
    let rafId = null;
    let suppressToggleClick = false;
    let suppressRestoreClick = false;

    const beginDrag = (e) => {
      if (drag) 
        return;

      if (!dock.edge || dock.offset == null) {
        const def = cornerDefaultDock();
        dock.edge = def.edge;
        dock.offset = def.offset;
        updateDockAlignment(previewSize());
      }

      const isRestoreTarget = e.currentTarget === pipRestoreButton;

      drag = {
        kind: isRestoreTarget ? 'restore' : (isMinimized() ? 'pip' : 'preview'),
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastY: e.clientY,
        moved: false,
        target: e.currentTarget
      };

      drag.target.setPointerCapture(e.pointerId);

      if (drag.kind === 'restore')
        host.classList.add('dragging-restore');
      else 
        host.classList.add(drag.kind === 'pip' ? 'dragging' : 'dragging-preview');

      e.preventDefault();
    };

    const moveDrag = (e) => {
      if (!drag || drag.pointerId !== e.pointerId)
        return;

      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      
      const dx = drag.lastX - drag.startX;
      const dy = drag.lastY - drag.startY;

      if (!drag.moved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
        drag.moved = true;
      }

      if (!drag.moved)
        return;
      if (rafId)
        return;

      rafId = requestAnimationFrame(() => {
        rafId = null;

        const edge = nearestEdgeAt(drag.lastX, drag.lastY);
        const size = sizeForTarget(drag.target);

        let offset;
        if (edge === 'left' || edge === 'right') {
          const top = drag.lastY - (size.h / 2);
          offset = clampOffset(edge, Math.round(top), size);
        } else {
          const left = drag.lastX - (size.w / 2);
          offset = clampOffset(edge, Math.round(left), size);
        }

        dock.edge = edge;
        dock.offset = offset;
        updateDockAlignment(size);

        const origin = currentTransformOrigin();
        setVar('--error-pip-origin', origin || 'bottom right');

        applyDockAll({ persist: false });
      });
    };

    const endDrag = (e) => {
      if (!drag || drag.pointerId !== e.pointerId)
        return;

      const endedKind = drag.kind;
      drag.target.releasePointerCapture(e.pointerId);

      if (endedKind === 'restore')
        host.classList.remove('dragging-restore');
      else 
        host.classList.remove(endedKind === 'pip' ? 'dragging' : 'dragging-preview');

      const didMove = drag.moved;
      drag = null;

      if (didMove) {
        persistDock();
        if (endedKind === 'restore')
          suppressRestoreClick = true;
        else 
          suppressToggleClick = true;
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const bindDragTarget = (node) => {
      on(node, 'pointerdown', beginDrag);
      on(node, 'pointermove', moveDrag);
      on(node, 'pointerup', endDrag);
      on(node, 'pointercancel', endDrag);
    };

    bindDragTarget(toggle);
    bindDragTarget(pipRestoreButton);

    // =========================
    // Events (toggle / close / restore)
    // =========================
    on(toggle, 'click', (e) => {
      if (suppressToggleClick) {
        e.preventDefault();
        suppressToggleClick = false;
        return;
      }
      toggleView();
    });

    on(toggle, 'keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleView();
      }
    });

    on(pipCloseButton, 'click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isMinimized())
        setPrettyHidden(true);
      else
        setPreviewHidden(true);
    });

    on(pipCloseButton, 'pointerdown', (e) => {
      e.stopPropagation();
    });

    on(pipRestoreButton, 'click', (e) => {
      if (suppressRestoreClick) {
        e.preventDefault();
        suppressRestoreClick = false;
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      if (isMinimized()) 
        setPrettyHidden(false);
      else 
        setPreviewHidden(false);
    });

    // =========================
    // Lifecycle: load / sync / repaint
    // =========================
    const loadState = () => {
      loadDock();
      loadHidden();

      if (isPrettyHidden && !isMinimized())
        setMinimized(true);

      updateUI();
      repaintToDock();
    };

    loadState();

    on(window, 'storage-ready', () => {
      storageReady = true;
      loadState();
    });

    const onViewportChange = () => repaintToDock();

    on(window, 'resize', onViewportChange);

    if (window.visualViewport) {
      on(window.visualViewport, 'resize', onViewportChange);
      on(window.visualViewport, 'scroll', onViewportChange);
    }

    // initial preview
    setTimeout(updatePreview, 100);

    // initial minimized option
    if (${startMinimized}) {
      setMinimized(true);
      repaintToDock();
      void iframe.offsetWidth;
      updateUI();
    }
  } catch (err) {
    console.error('Failed to initialize Nuxt error overlay:', err);
  }
})();
`;
}
function generateErrorOverlayHTML(html, options) {
	const nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
	const errorPage = html.replace("<head>", `<head><script>${iframeStorageBridge(nonce)}<\/script>`);
	const base64HTML = Buffer.from(errorPage, "utf8").toString("base64");
	return `
    <script>${parentStorageBridge(nonce)}<\/script>
    <nuxt-error-overlay></nuxt-error-overlay>
    <script>${webComponentScript(base64HTML, options?.startMinimized ?? false)}<\/script>
  `;
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
	if (event.handled || isJsonRequest(event)) {
		
		return;
	}
	
	const defaultRes = await defaultHandler(error, event, { json: true });
	
	const status = error.status || error.statusCode || 500;
	if (status === 404 && defaultRes.status === 302) {
		setResponseHeaders(event, defaultRes.headers);
		setResponseStatus(event, defaultRes.status, defaultRes.statusText);
		return send(event, JSON.stringify(defaultRes.body, null, 2));
	}
	if (typeof defaultRes.body !== "string" && Array.isArray(defaultRes.body.stack)) {
		
		defaultRes.body.stack = defaultRes.body.stack.join("\n");
	}
	const errorObject = defaultRes.body;
	
	const url = new URL(errorObject.url);
	errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
	
	errorObject.message = error.unhandled ? errorObject.message || "Server Error" : error.message || errorObject.message || "Server Error";
	
	errorObject.data ||= error.data;
	errorObject.statusText ||= error.statusText || error.statusMessage;
	delete defaultRes.headers["content-type"];
	delete defaultRes.headers["content-security-policy"];
	setResponseHeaders(event, defaultRes.headers);
	
	const reqHeaders = getRequestHeaders(event);
	
	const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"] || !!event.context.nuxt?.["~rendering-error"];
	if (!isRenderingError) {
		event.context.nuxt ||= {};
		event.context.nuxt["~rendering-error"] = true;
	}
	
	const res = isRenderingError ? null : await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject), {
		headers: {
			...reqHeaders,
			"x-nuxt-error": "true"
		},
		redirect: "manual"
	}).catch(() => null);
	if (event.handled) {
		return;
	}
	
	if (!res) {
		const { template } = await Promise.resolve().then(function () { return error500; });
		{
			
			errorObject.description = errorObject.message;
		}
		setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
		return send(event, template(errorObject));
	}
	const html = await res.text();
	for (const [header, value] of res.headers.entries()) {
		if (header === "set-cookie") {
			appendResponseHeader(event, header, value);
			continue;
		}
		setResponseHeader(event, header, value);
	}
	setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
	if (!globalThis._importMeta_.test && typeof html === "string") {
		const prettyResponse = await defaultHandler(error, event, { json: false });
		if (typeof prettyResponse.body === "string") {
			return send(event, html.replace("</body>", `${generateErrorOverlayHTML(prettyResponse.body, { startMinimized: 300 <= status && status < 500 })}</body>`));
		}
	}
	return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  async function defaultNitroErrorHandler(error, event) {
    const res = await defaultHandler(error, event);
    if (!event.node?.res.headersSent) {
      setResponseHeaders(event, res.headers);
    }
    setResponseStatus(event, res.status, res.statusText);
    return send(
      event,
      typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2)
    );
  }
);
async function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  await loadStackTrace(error).catch(consola.error);
  const youch = new Youch();
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    const ansiError = await (await youch.toANSI(error)).replaceAll(process.cwd(), ".");
    consola.error(
      `[request error] ${tags} [${event.method}] ${url}

`,
      ansiError
    );
  }
  const useJSON = opts?.json ?? !getRequestHeader(event, "accept")?.includes("text/html");
  const headers = {
    "content-type": useJSON ? "application/json" : "text/html",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';"
  };
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = useJSON ? {
    error: true,
    url,
    statusCode,
    statusMessage,
    message: error.message,
    data: error.data,
    stack: error.stack?.split("\n").map((line) => line.trim())
  } : await youch.toHTML(error, {
    request: {
      url: url.href,
      method: event.method,
      headers: getRequestHeaders(event)
    }
  });
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}
async function loadStackTrace(error) {
  if (!(error instanceof Error)) {
    return;
  }
  const parsed = await new ErrorParser().defineSourceLoader(sourceLoader).parse(error);
  const stack = error.message + "\n" + parsed.frames.map((frame) => fmtFrame(frame)).join("\n");
  Object.defineProperty(error, "stack", { value: stack });
  if (error.cause) {
    await loadStackTrace(error.cause).catch(consola.error);
  }
}
async function sourceLoader(frame) {
  if (!frame.fileName || frame.fileType !== "fs" || frame.type === "native") {
    return;
  }
  if (frame.type === "app") {
    const rawSourceMap = await readFile(`${frame.fileName}.map`, "utf8").catch(() => {
    });
    if (rawSourceMap) {
      const consumer = await new SourceMapConsumer(rawSourceMap);
      const originalPosition = consumer.originalPositionFor({ line: frame.lineNumber, column: frame.columnNumber });
      if (originalPosition.source && originalPosition.line) {
        frame.fileName = resolve(dirname(frame.fileName), originalPosition.source);
        frame.lineNumber = originalPosition.line;
        frame.columnNumber = originalPosition.column || 0;
      }
    }
  }
  const contents = await readFile(frame.fileName, "utf8").catch(() => {
  });
  return contents ? { contents } : void 0;
}
function fmtFrame(frame) {
  if (frame.type === "native") {
    return frame.raw;
  }
  const src = `${frame.fileName || ""}:${frame.lineNumber}:${frame.columnNumber})`;
  return frame.functionName ? `at ${frame.functionName} (${src}` : `at ${src}`;
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const script = `
if (!window.__NUXT_DEVTOOLS_TIME_METRIC__) {
  Object.defineProperty(window, '__NUXT_DEVTOOLS_TIME_METRIC__', {
    value: {},
    enumerable: false,
    configurable: true,
  })
}
window.__NUXT_DEVTOOLS_TIME_METRIC__.appInit = Date.now()
`;

const _TddzR9RefYOFuyfd8PnUzQ0sacf95gCczNYzBZbLsQE = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const rootDir = "D:/planning/systeme_centralise/frontend_nuxt";

const appHead = {"meta":[{"name":"viewport","content":"width=device-width, initial-scale=1"},{"charset":"utf-8"},{"name":"description","content":"OpsFlow — Système centralisé de gestion des opérations, planning et suivi des tâches."},{"name":"robots","content":"noindex, nofollow"}],"link":[{"rel":"icon","type":"image/svg+xml","href":"/favicon.svg"}],"style":[],"script":[],"noscript":[],"title":"OpsFlow"};

const appRootTag = "div";

const appRootAttrs = {"id":"__nuxt"};

const appTeleportTag = "div";

const appTeleportAttrs = {"id":"teleports"};

const appId = "nuxt-app";

const devReducers = {
	VNode: (data) => isVNode(data) ? {
		type: data.type,
		props: data.props
	} : undefined,
	URL: (data) => data instanceof URL ? data.toString() : undefined,
	Symbol: (data) => typeof data === "symbol" ? data.description ?? "" : undefined
};
const asyncContext = getContext("nuxt-dev", {
	asyncContext: true,
	AsyncLocalStorage
});
const _4s7PyUB1uoJfuNiXLt8PH7woW3GoRCrmcz6vXBA9V_0 = (nitroApp) => {
	const handler = nitroApp.h3App.handler;
	nitroApp.h3App.handler = (event) => {
		return asyncContext.callAsync({
			logs: [],
			event
		}, () => handler(event));
	};
	onConsoleLog((_log) => {
		const ctx = asyncContext.tryUse();
		if (!ctx) {
			return;
		}
		const rawStack = captureRawStackTrace();
		if (!rawStack || rawStack.includes("runtime/vite-node.mjs")) {
			return;
		}
		const trace = [];
		let filename = "";
		for (const entry of parseRawStackTrace(rawStack)) {
			if (entry.source === globalThis._importMeta_.url) {
				continue;
			}
			if (EXCLUDE_TRACE_RE.test(entry.source)) {
				continue;
			}
			filename ||= entry.source.replace(withTrailingSlash(rootDir), "");
			trace.push({
				...entry,
				source: entry.source.startsWith("file://") ? entry.source.replace("file://", "") : entry.source
			});
		}
		const log = {
			..._log,
			
			filename,
			
			stack: trace
		};
		
		ctx.logs.push(log);
	});
	nitroApp.hooks.hook("afterResponse", () => {
		const ctx = asyncContext.tryUse();
		if (!ctx) {
			return;
		}
		return nitroApp.hooks.callHook("dev:ssr-logs", {
			logs: ctx.logs,
			path: ctx.event.path
		});
	});
	
	nitroApp.hooks.hook("render:html", (htmlContext) => {
		const ctx = asyncContext.tryUse();
		if (!ctx) {
			return;
		}
		try {
			const reducers = Object.assign(Object.create(null), devReducers, ctx.event.context["~payloadReducers"]);
			htmlContext.bodyAppend.unshift(`<script type="application/json" data-nuxt-logs="${appId}">${stringify(ctx.logs, reducers)}<\/script>`);
		} catch (e) {
			const shortError = e instanceof Error && "toString" in e ? ` Received \`${e.toString()}\`.` : "";
			console.warn(`[nuxt] Failed to stringify dev server logs.${shortError} You can define your own reducer/reviver for rich types following the instructions in https://nuxt.com/docs/api/composables/use-nuxt-app#payload.`);
		}
	});
};
const EXCLUDE_TRACE_RE = /\/node_modules\/(?:.*\/)?(?:nuxt|nuxt-nightly|nuxt-edge|nuxt3|consola|@vue)\/|core\/runtime\/nitro/;
function onConsoleLog(callback) {
	consola$1.addReporter({ log(logObj) {
		callback(logObj);
	} });
	consola$1.wrapConsole();
}

const plugins = [
  _TddzR9RefYOFuyfd8PnUzQ0sacf95gCczNYzBZbLsQE,
_4s7PyUB1uoJfuNiXLt8PH7woW3GoRCrmcz6vXBA9V_0,
_wH6JrtIxmaSoA8lCPWFnE9z4lQeXW6H5z3l5aymEQw
];

const assets = {
  "/index.mjs": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2b43a-pCkIZUo7nGAWwy04SV78WUZciHs\"",
    "mtime": "2026-06-08T08:57:34.928Z",
    "size": 177210,
    "path": "index.mjs"
  },
  "/index.mjs.map": {
    "type": "application/json",
    "etag": "\"a2c14-vxEpf0dHieNn/3y53CEy6nqwZQw\"",
    "mtime": "2026-06-08T08:57:34.929Z",
    "size": 666644,
    "path": "index.mjs.map"
  }
};

function readAsset (id) {
  const serverDir = dirname$1(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve$1(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _sdkRVd = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError({ statusCode: 404 });
    }
    return;
  }
  if (asset.encoding !== void 0) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const SALT_LEN = 16;
const KEY_LEN = 64;
const JWT_SECRET_RAW = process.env.JWT_SECRET;
const SECRET = JWT_SECRET_RAW || "opsflow_dev_secret_CHANGE_ME_in_production";
const hashPassword = (password) => {
  const salt = crypto$1.randomBytes(SALT_LEN).toString("hex");
  const derivedKey = crypto$1.scryptSync(password, salt, KEY_LEN).toString("hex");
  return `${salt}:${derivedKey}`;
};
const verifyPassword = (password, hash) => {
  try {
    const [salt, key] = hash.split(":");
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = crypto$1.scryptSync(password, salt, KEY_LEN);
    return crypto$1.timingSafeEqual(keyBuffer, derivedKey);
  } catch (err) {
    return false;
  }
};
const signToken = (payload) => {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payloadB64 = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 1e3 * 60 * 60 * 24 * 7 })).toString("base64url");
  const signature = crypto$1.createHmac("sha256", SECRET).update(`${header}.${payloadB64}`).digest("base64url");
  return `${header}.${payloadB64}.${signature}`;
};
const verifyToken = (token) => {
  try {
    const [header, payloadB64, signature] = token.split(".");
    if (!header || !payloadB64 || !signature) return null;
    const expectedSig = crypto$1.createHmac("sha256", SECRET).update(`${header}.${payloadB64}`).digest("base64url");
    if (expectedSig !== signature) return null;
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    if (payload.exp && payload.exp < Date.now()) return null;
    return payload;
  } catch (err) {
    return null;
  }
};

const PUBLIC_ROUTES = [
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/register",
  "/api/auth/me"
];
const ADMIN_ONLY_PREFIXES = [
  "/api/auth/pending",
  "/api/auth/manage",
  "/api/licences",
  "/api/villes",
  "/api/themes",
  "/api/roles",
  "/api/meta"
];
const _oNdL3v = defineEventHandler((event) => {
  const url = getRequestURL(event);
  const path = url.pathname;
  const method = event.method;
  if (!path.startsWith("/api/")) return;
  if (PUBLIC_ROUTES.some((pub) => path.startsWith(pub))) return;
  const token = getCookie(event, "auth_token");
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: "Authentification requise." });
  }
  const payload = verifyToken(token);
  if (!payload || !payload.id) {
    throw createError({ statusCode: 401, statusMessage: "Session expir\xE9e ou invalide." });
  }
  event.context.user = payload;
  const isAdmin = payload.role === "ADMIN";
  if (ADMIN_ONLY_PREFIXES.some((r) => path.startsWith(r))) {
    if (!isAdmin) {
      throw createError({ statusCode: 403, statusMessage: "Acc\xE8s refus\xE9. R\xE9serv\xE9 aux administrateurs." });
    }
  }
  const writeOps = ["POST", "PUT", "PATCH", "DELETE"];
  const adminWriteRoutes = ["/api/equipe", "/api/affectations", "/api/editions", "/api/postes"];
  if (writeOps.includes(method) && adminWriteRoutes.some((r) => path.startsWith(r))) {
    if (!isAdmin) {
      throw createError({ statusCode: 403, statusMessage: "Action r\xE9serv\xE9e aux administrateurs." });
    }
  }
});

const VueResolver = (_, value) => {
  return isRef(value) ? toValue(value) : value;
};

const headSymbol = "usehead";
// @__NO_SIDE_EFFECTS__
function vueInstall(head) {
  const plugin = {
    install(app) {
      app.config.globalProperties.$unhead = head;
      app.config.globalProperties.$head = head;
      app.provide(headSymbol, head);
    }
  };
  return plugin.install;
}

// @__NO_SIDE_EFFECTS__
function resolveUnrefHeadInput(input) {
  return walkResolver(input, VueResolver);
}

function filterIslandProps(props) {
  if (!props) {
    return {};
  }
  const out = {};
  for (const key in props) {
    if (!key.startsWith("data-v-")) {
      out[key] = props[key];
    }
  }
  return out;
}
function computeIslandHash(name, filteredProps, context, source) {
  return hash$1([name, filteredProps, context, source]).replace(/[-_]/g, "");
}

const NUXT_RUNTIME_PAYLOAD_EXTRACTION = false;

// @__NO_SIDE_EFFECTS__
function createHead(options = {}) {
  const head = createHead$1({
    ...options,
    propResolvers: [VueResolver]
  });
  head.install = vueInstall(head);
  return head;
}

const unheadOptions = {
  disableDefaults: true,
  disableCapoSorting: false,
  plugins: [DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin],
};

function encodeEventPath(path) {
	const queryIndex = path.indexOf("?");
	if (queryIndex === -1) {
		return encodePath(path);
	}
	return encodePath(path.slice(0, queryIndex)) + path.slice(queryIndex);
}
function createSSRContext(event) {
	const url = encodeEventPath(event.path);
	const ssrContext = {
		url,
		event,
		runtimeConfig: useRuntimeConfig(event),
		noSSR: event.context.nuxt?.noSSR || (false),
		head: createHead(unheadOptions),
		error: false,
		nuxt: undefined,
		payload: {},
		["~payloadReducers"]: Object.create(null),
		modules: new Set()
	};
	return ssrContext;
}
function setSSRError(ssrContext, error) {
	ssrContext.error = true;
	ssrContext.payload = { error };
	ssrContext.url = error.url;
}

function buildAssetsDir() {
	
	return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
	return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
	
	const app = useRuntimeConfig().app;
	const publicBase = app.cdnURL || app.baseURL;
	return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__buildAssetsURL = buildAssetsURL;
// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__publicAssetsURL = publicAssetsURL;
const APP_ROOT_OPEN_TAG = `<${appRootTag}${propsToString(appRootAttrs)}>`;
const APP_ROOT_CLOSE_TAG = `</${appRootTag}>`;
// @ts-expect-error file will be produced after app build
const getServerEntry = () => Promise.resolve().then(function () { return server; }).then((r) => r.default || r);
// @ts-expect-error file will be produced after app build
const getClientManifest = () => Promise.resolve().then(function () { return client_manifest$1; }).then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);

const getSSRRenderer = lazyCachedFunction(async () => {
	
	const createSSRApp = await getServerEntry();
	if (!createSSRApp) {
		throw new Error("Server bundle is not available");
	}
	
	const precomputed = undefined ;
	
	const renderer = createRenderer(createSSRApp, {
		precomputed,
		manifest: await getClientManifest() ,
		renderToString: renderToString$1,
		buildAssetsURL
	});
	async function renderToString$1(input, context) {
		const html = await renderToString(input, context);
		
		
		if (process.env.NUXT_VITE_NODE_OPTIONS) {
			renderer.rendererContext.updateManifest(await getClientManifest());
		}
		return APP_ROOT_OPEN_TAG + html + APP_ROOT_CLOSE_TAG;
	}
	return renderer;
});

const getSPARenderer = lazyCachedFunction(async () => {
	const precomputed = undefined ;
	// @ts-expect-error virtual file
	const spaTemplate = await Promise.resolve().then(function () { return _virtual__spaTemplate; }).then((r) => r.template).catch(() => "").then((r) => {
		{
			return APP_ROOT_OPEN_TAG + r + APP_ROOT_CLOSE_TAG;
		}
	});
	
	const renderer = createRenderer(() => () => {}, {
		precomputed,
		manifest: await getClientManifest() ,
		renderToString: () => spaTemplate,
		buildAssetsURL
	});
	const result = await renderer.renderToString({});
	const renderToString = (ssrContext) => {
		const config = useRuntimeConfig(ssrContext.event);
		ssrContext.modules ||= new Set();
		ssrContext.payload.serverRendered = false;
		ssrContext.config = {
			public: config.public,
			app: config.app
		};
		return Promise.resolve(result);
	};
	return {
		rendererContext: renderer.rendererContext,
		renderToString
	};
});
function lazyCachedFunction(fn) {
	let res = null;
	return () => {
		if (res === null) {
			res = fn().catch((err) => {
				res = null;
				throw err;
			});
		}
		return res;
	};
}
function getRenderer(ssrContext) {
	return ssrContext.noSSR ? getSPARenderer() : getSSRRenderer();
}
// @ts-expect-error file will be produced after app build
const getSSRStyles = lazyCachedFunction(() => Promise.resolve().then(function () { return styles$1; }).then((r) => r.default || r));

async function renderInlineStyles(usedModules) {
	const styleMap = await getSSRStyles();
	const inlinedStyles = new Set();
	for (const mod of usedModules) {
		if (mod in styleMap && styleMap[mod]) {
			for (const style of await styleMap[mod]()) {
				inlinedStyles.add(style);
			}
		}
	}
	return Array.from(inlinedStyles).map((style) => ({ innerHTML: style }));
}

// @ts-expect-error virtual file
const ROOT_NODE_REGEX = new RegExp(`^<${appRootTag}[^>]*>([\\s\\S]*)<\\/${appRootTag}>$`);

function getServerComponentHTML(body) {
	const match = body.match(ROOT_NODE_REGEX);
	return match?.[1] || body;
}
const SSR_SLOT_TELEPORT_MARKER = /^uid=([^;]*);slot=(.*)$/;
const SSR_CLIENT_TELEPORT_MARKER = /^uid=([^;]*);client=(.*)$/;
const SSR_CLIENT_SLOT_MARKER = /^island-slot=([^;]*);(.*)$/;
function getSlotIslandResponse(ssrContext) {
	if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.slots).length) {
		return undefined;
	}
	const response = {};
	for (const [name, slot] of Object.entries(ssrContext.islandContext.slots)) {
		response[name] = {
			...slot,
			fallback: ssrContext.teleports?.[`island-fallback=${name}`]
		};
	}
	return response;
}
function getClientIslandResponse(ssrContext) {
	if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.components).length) {
		return undefined;
	}
	const response = {};
	for (const [clientUid, component] of Object.entries(ssrContext.islandContext.components)) {
		
		const html = ssrContext.teleports?.[clientUid]?.replaceAll("<!--teleport start anchor-->", "") || "";
		response[clientUid] = {
			...component,
			html,
			slots: getComponentSlotTeleport(clientUid, ssrContext.teleports ?? {})
		};
	}
	return response;
}
function getComponentSlotTeleport(clientUid, teleports) {
	const entries = Object.entries(teleports);
	const slots = {};
	for (const [key, value] of entries) {
		const match = key.match(SSR_CLIENT_SLOT_MARKER);
		if (match) {
			const [, id, slot] = match;
			if (!slot || clientUid !== id) {
				continue;
			}
			slots[slot] = value;
		}
	}
	return slots;
}
function replaceIslandTeleports(ssrContext, html) {
	const { teleports, islandContext } = ssrContext;
	if (islandContext || !teleports) {
		return html;
	}
	for (const key in teleports) {
		const matchClientComp = key.match(SSR_CLIENT_TELEPORT_MARKER);
		if (matchClientComp) {
			const [, uid, clientId] = matchClientComp;
			if (!uid || !clientId) {
				continue;
			}
			html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-component="${clientId}"[^>]*>`), (full) => {
				return full + teleports[key];
			});
			continue;
		}
		const matchSlot = key.match(SSR_SLOT_TELEPORT_MARKER);
		if (matchSlot) {
			const [, uid, slot] = matchSlot;
			if (!uid || !slot) {
				continue;
			}
			html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-slot="${slot}"[^>]*>`), (full) => {
				return full + teleports[key];
			});
		}
	}
	return html;
}

const ISLAND_SUFFIX_RE = /\.json(?:\?.*)?$/;
const handler$1 = defineEventHandler(async (event) => {
	const nitroApp = useNitroApp();
	setResponseHeaders(event, {
		"content-type": "application/json;charset=utf-8",
		"x-powered-by": "Nuxt"
	});
	const islandContext = await getIslandContext(event);
	const ssrContext = {
		...createSSRContext(event),
		islandContext,
		noSSR: false,
		url: islandContext.url
	};
	
	const renderer = await getSSRRenderer();
	const renderResult = await renderer.renderToString(ssrContext).catch(async (err) => {
		if (ssrContext["~renderResponse"] && err?.message === "skipping render") {
			return {};
		}
		await ssrContext.nuxt?.hooks.callHook("app:error", err);
		throw err;
	});
	
	
	await ssrContext.nuxt?.hooks.callHook("app:rendered", {
		ssrContext,
		renderResult
	});
	if (ssrContext["~renderResponse"]) {
		const response = ssrContext["~renderResponse"];
		if (response.statusCode && response.statusCode >= 400) {
			throw createError({
				statusCode: response.statusCode,
				statusMessage: response.statusMessage
			});
		}
		return returnIslandResponse(event, response);
	}
	
	if (ssrContext.payload?.error) {
		throw ssrContext.payload.error;
	}
	const inlinedStyles = await renderInlineStyles(ssrContext.modules ?? []);
	if (inlinedStyles.length) {
		ssrContext.head.push({ style: inlinedStyles });
	}
	{
		const { styles } = getRequestDependencies(ssrContext, renderer.rendererContext);
		const link = [];
		for (const resource of Object.values(styles)) {
			
			if ("inline" in getQuery(resource.file)) {
				continue;
			}
			
			
			if (resource.file.includes("scoped") && !resource.file.includes("pages/")) {
				link.push({
					rel: "stylesheet",
					href: renderer.rendererContext.buildAssetsURL(resource.file),
					crossorigin: ""
				});
			}
		}
		if (link.length) {
			ssrContext.head.push({ link }, { mode: "server" });
		}
	}
	const islandHead = {};
	for (const entry of ssrContext.head.entries.values()) {
		
		for (const [key, value] of Object.entries(resolveUnrefHeadInput(entry.input))) {
			const currentValue = islandHead[key];
			if (Array.isArray(currentValue)) {
				currentValue.push(...value);
			} else {
				islandHead[key] = value;
			}
		}
	}
	
	islandHead.link ||= [];
	islandHead.style ||= [];
	const islandResponse = {
		id: islandContext.id,
		head: islandHead,
		html: getServerComponentHTML(renderResult.html),
		components: getClientIslandResponse(ssrContext),
		slots: getSlotIslandResponse(ssrContext)
	};
	await nitroApp.hooks.callHook("render:island", islandResponse, {
		event,
		islandContext
	});
	return islandResponse;
});
function returnIslandResponse(event, response) {
	for (const header in response.headers || {}) {
		setResponseHeader(event, header, response.headers[header]);
	}
	if (response.statusCode) {
		setResponseStatus(event, response.statusCode, response.statusMessage);
	}
	return response.body;
}
const ISLAND_PATH_PREFIX = "/__nuxt_island/";
const VALID_COMPONENT_NAME_RE = /^[a-z][\w.-]*$/i;
async function getIslandContext(event) {
	let url = event.path || "";
	url.replace(/\?.*$/, "");
	if (!url.startsWith(ISLAND_PATH_PREFIX)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid island request path"
		});
	}
	const componentParts = url.substring(ISLAND_PATH_PREFIX.length).replace(ISLAND_SUFFIX_RE, "").split("_");
	const hashId = componentParts.length > 1 ? componentParts.pop() : undefined;
	const componentName = componentParts.join("_");
	if (!componentName || !VALID_COMPONENT_NAME_RE.test(componentName)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid island component name"
		});
	}
	const rawContext = event.method === "GET" ? getQuery$1(event) : await readBody(event);
	const rawProps = destr$1(rawContext?.props) || {};
	const filteredProps = filterIslandProps(rawProps);
	
	
	const clientContext = {};
	if (rawContext && typeof rawContext === "object") {
		for (const key in rawContext) {
			if (key !== "props") {
				clientContext[key] = rawContext[key];
			}
		}
	}
	
	
	const expectedHash = computeIslandHash(componentName, filteredProps, clientContext, undefined);
	if (!hashId || hashId !== expectedHash) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid island request hash"
		});
	}
	return {
		url: typeof rawContext?.url === "string" ? rawContext.url : "/",
		id: hashId,
		name: componentName,
		props: rawProps,
		slots: {},
		components: {}
	};
}

const _lazy_O1kHuQ = () => Promise.resolve().then(function () { return index_get$j; });
const _lazy_Ra1uy8 = () => Promise.resolve().then(function () { return index_post$f; });
const _lazy_S9awhZ = () => Promise.resolve().then(function () { return remove_post$1; });
const _lazy_me64Hk = () => Promise.resolve().then(function () { return login_post$1; });
const _lazy_omkGLZ = () => Promise.resolve().then(function () { return logout_post$1; });
const _lazy_98HihI = () => Promise.resolve().then(function () { return manage_post$1; });
const _lazy_7ShbIE = () => Promise.resolve().then(function () { return me_get$1; });
const _lazy_eJ2UjQ = () => Promise.resolve().then(function () { return pending_get$1; });
const _lazy_2fJaom = () => Promise.resolve().then(function () { return register_post$1; });
const _lazy_3Ccc7C = () => Promise.resolve().then(function () { return simulate_post$1; });
const _lazy_aJkAhD = () => Promise.resolve().then(function () { return _id__delete$b; });
const _lazy_l4pUlh = () => Promise.resolve().then(function () { return index_get$h; });
const _lazy_5K8R6O = () => Promise.resolve().then(function () { return index_post$d; });
const _lazy_CuuTgV = () => Promise.resolve().then(function () { return _id__delete$9; });
const _lazy_mSg2sG = () => Promise.resolve().then(function () { return index_get$f; });
const _lazy_ZHWWd5 = () => Promise.resolve().then(function () { return index_post$b; });
const _lazy_NKid78 = () => Promise.resolve().then(function () { return _id__delete$7; });
const _lazy_bdH4Qw = () => Promise.resolve().then(function () { return index_get$d; });
const _lazy_kJS8tx = () => Promise.resolve().then(function () { return index_post$9; });
const _lazy_i2M0tb = () => Promise.resolve().then(function () { return analyse_post$1; });
const _lazy_8mkLnD = () => Promise.resolve().then(function () { return sync_get$1; });
const _lazy_DvTI_e = () => Promise.resolve().then(function () { return index_get$b; });
const _lazy_YMZ2xV = () => Promise.resolve().then(function () { return index_get$9; });
const _lazy_xBSNTg = () => Promise.resolve().then(function () { return _id__delete$5; });
const _lazy_Ubc0OA = () => Promise.resolve().then(function () { return decider_post$1; });
const _lazy_VTnx2h = () => Promise.resolve().then(function () { return index_get$7; });
const _lazy_MzF6VL = () => Promise.resolve().then(function () { return index_post$7; });
const _lazy_UQqEtF = () => Promise.resolve().then(function () { return index_get$5; });
const _lazy_8YhdQ0 = () => Promise.resolve().then(function () { return index_post$5; });
const _lazy_5rh7Pk = () => Promise.resolve().then(function () { return statuts_get$1; });
const _lazy_fwjMlv = () => Promise.resolve().then(function () { return _id__delete$3; });
const _lazy_KbWLhC = () => Promise.resolve().then(function () { return index_get$3; });
const _lazy_3bxBDw = () => Promise.resolve().then(function () { return index_post$3; });
const _lazy_jkYR_C = () => Promise.resolve().then(function () { return _id__delete$1; });
const _lazy_FwnrcG = () => Promise.resolve().then(function () { return index_get$1; });
const _lazy_KJGtRJ = () => Promise.resolve().then(function () { return index_post$1; });
const _lazy_Qp5LbB = () => Promise.resolve().then(function () { return renderer; });

const handlers = [
  { route: '', handler: _sdkRVd, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _oNdL3v, lazy: false, middleware: true, method: undefined },
  { route: '/api/affectations', handler: _lazy_O1kHuQ, lazy: true, middleware: false, method: "get" },
  { route: '/api/affectations', handler: _lazy_Ra1uy8, lazy: true, middleware: false, method: "post" },
  { route: '/api/affectations/remove', handler: _lazy_S9awhZ, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/login', handler: _lazy_me64Hk, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/logout', handler: _lazy_omkGLZ, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/manage', handler: _lazy_98HihI, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/me', handler: _lazy_7ShbIE, lazy: true, middleware: false, method: "get" },
  { route: '/api/auth/pending', handler: _lazy_eJ2UjQ, lazy: true, middleware: false, method: "get" },
  { route: '/api/auth/register', handler: _lazy_2fJaom, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/simulate', handler: _lazy_3Ccc7C, lazy: true, middleware: false, method: "post" },
  { route: '/api/editions/:id', handler: _lazy_aJkAhD, lazy: true, middleware: false, method: "delete" },
  { route: '/api/editions', handler: _lazy_l4pUlh, lazy: true, middleware: false, method: "get" },
  { route: '/api/editions', handler: _lazy_5K8R6O, lazy: true, middleware: false, method: "post" },
  { route: '/api/equipe/:id', handler: _lazy_CuuTgV, lazy: true, middleware: false, method: "delete" },
  { route: '/api/equipe', handler: _lazy_mSg2sG, lazy: true, middleware: false, method: "get" },
  { route: '/api/equipe', handler: _lazy_ZHWWd5, lazy: true, middleware: false, method: "post" },
  { route: '/api/licences/:id', handler: _lazy_NKid78, lazy: true, middleware: false, method: "delete" },
  { route: '/api/licences', handler: _lazy_bdH4Qw, lazy: true, middleware: false, method: "get" },
  { route: '/api/licences', handler: _lazy_kJS8tx, lazy: true, middleware: false, method: "post" },
  { route: '/api/meta/analyse', handler: _lazy_i2M0tb, lazy: true, middleware: false, method: "post" },
  { route: '/api/meta/sync', handler: _lazy_8mkLnD, lazy: true, middleware: false, method: "get" },
  { route: '/api/postes', handler: _lazy_DvTI_e, lazy: true, middleware: false, method: "get" },
  { route: '/api/roles', handler: _lazy_YMZ2xV, lazy: true, middleware: false, method: "get" },
  { route: '/api/taches/:id', handler: _lazy_xBSNTg, lazy: true, middleware: false, method: "delete" },
  { route: '/api/taches/demandes/:id/decider', handler: _lazy_Ubc0OA, lazy: true, middleware: false, method: "post" },
  { route: '/api/taches/demandes', handler: _lazy_VTnx2h, lazy: true, middleware: false, method: "get" },
  { route: '/api/taches/demandes', handler: _lazy_MzF6VL, lazy: true, middleware: false, method: "post" },
  { route: '/api/taches', handler: _lazy_UQqEtF, lazy: true, middleware: false, method: "get" },
  { route: '/api/taches', handler: _lazy_8YhdQ0, lazy: true, middleware: false, method: "post" },
  { route: '/api/taches/statuts', handler: _lazy_5rh7Pk, lazy: true, middleware: false, method: "get" },
  { route: '/api/themes/:id', handler: _lazy_fwjMlv, lazy: true, middleware: false, method: "delete" },
  { route: '/api/themes', handler: _lazy_KbWLhC, lazy: true, middleware: false, method: "get" },
  { route: '/api/themes', handler: _lazy_3bxBDw, lazy: true, middleware: false, method: "post" },
  { route: '/api/villes/:id', handler: _lazy_jkYR_C, lazy: true, middleware: false, method: "delete" },
  { route: '/api/villes', handler: _lazy_FwnrcG, lazy: true, middleware: false, method: "get" },
  { route: '/api/villes', handler: _lazy_KJGtRJ, lazy: true, middleware: false, method: "post" },
  { route: '/__nuxt_error', handler: _lazy_Qp5LbB, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: handler$1, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_Qp5LbB, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(true),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter$1({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => callNodeRequestHandler(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return fetchNodeRequestHandler(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const scheduledTasks = false;

const tasks = {
  
};

const __runningTasks__ = {};
async function runTask(name, {
  payload = {},
  context = {}
} = {}) {
  if (__runningTasks__[name]) {
    return __runningTasks__[name];
  }
  if (!(name in tasks)) {
    throw createError({
      message: `Task \`${name}\` is not available!`,
      statusCode: 404
    });
  }
  if (!tasks[name].resolve) {
    throw createError({
      message: `Task \`${name}\` is not implemented!`,
      statusCode: 501
    });
  }
  const handler = await tasks[name].resolve();
  const taskEvent = { name, payload, context };
  __runningTasks__[name] = handler.run(taskEvent);
  try {
    const res = await __runningTasks__[name];
    return res;
  } finally {
    delete __runningTasks__[name];
  }
}

if (!globalThis.crypto) {
  globalThis.crypto = crypto$1.webcrypto;
}
const { NITRO_NO_UNIX_SOCKET, NITRO_DEV_WORKER_ID } = process.env;
trapUnhandledNodeErrors();
parentPort?.on("message", (msg) => {
  if (msg && msg.event === "shutdown") {
    shutdown();
  }
});
const nitroApp = useNitroApp();
const server$1 = new Server(toNodeListener(nitroApp.h3App));
let listener;
listen().catch(() => listen(
  true
  /* use random port */
)).catch((error) => {
  console.error("Dev worker failed to listen:", error);
  return shutdown();
});
nitroApp.router.get(
  "/_nitro/tasks",
  defineEventHandler(async (event) => {
    const _tasks = await Promise.all(
      Object.entries(tasks).map(async ([name, task]) => {
        const _task = await task.resolve?.();
        return [name, { description: _task?.meta?.description }];
      })
    );
    return {
      tasks: Object.fromEntries(_tasks),
      scheduledTasks
    };
  })
);
nitroApp.router.use(
  "/_nitro/tasks/:name",
  defineEventHandler(async (event) => {
    const name = getRouterParam(event, "name");
    const payload = {
      ...getQuery$1(event),
      ...await readBody(event).then((r) => r?.payload).catch(() => ({}))
    };
    return await runTask(name, { payload });
  })
);
function listen(useRandomPort = Boolean(
  NITRO_NO_UNIX_SOCKET || process.versions.webcontainer || "Bun" in globalThis && process.platform === "win32"
)) {
  return new Promise((resolve, reject) => {
    try {
      listener = server$1.listen(useRandomPort ? 0 : getSocketAddress(), () => {
        const address = server$1.address();
        parentPort?.postMessage({
          event: "listen",
          address: typeof address === "string" ? { socketPath: address } : { host: "localhost", port: address?.port }
        });
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
function getSocketAddress() {
  const socketName = `nitro-worker-${process.pid}-${threadId}-${NITRO_DEV_WORKER_ID}-${Math.round(Math.random() * 1e4)}.sock`;
  if (process.platform === "win32") {
    return join(String.raw`\\.\pipe`, socketName);
  }
  if (process.platform === "linux") {
    const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);
    if (nodeMajor >= 20) {
      return `\0${socketName}`;
    }
  }
  return join(tmpdir(), socketName);
}
async function shutdown() {
  server$1.closeAllConnections?.();
  await Promise.all([
    new Promise((resolve) => listener?.close(resolve)),
    nitroApp.hooks.callHook("close").catch(console.error)
  ]);
  parentPort?.postMessage({ event: "exit" });
}

const _messages = {
	"appName": "Nuxt",
	"version": "",
	"status": 500,
	"statusText": "Server error",
	"description": "This page is temporarily unavailable."
};
const template$1 = (messages) => {
	messages = {
		..._messages,
		...messages
	};
	return "<!DOCTYPE html><html lang=\"en\"><head><title>" + escapeHtml(messages.status) + " - " + escapeHtml(messages.statusText) + " | " + escapeHtml(messages.appName) + "</title><meta charset=\"utf-8\"><meta content=\"width=device-width,initial-scale=1.0,minimum-scale=1.0\" name=\"viewport\"><style>.spotlight{background:linear-gradient(45deg,#00dc82,#36e4da 50%,#0047e1);filter:blur(20vh)}*,:after,:before{border-color:var(--un-default-border-color,#e5e7eb);border-style:solid;border-width:0;box-sizing:border-box}:after,:before{--un-content:\"\"}html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-moz-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}body{line-height:inherit;margin:0}h1{font-size:inherit;font-weight:inherit}h1,p{margin:0}*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.fixed{position:fixed}.-bottom-1\\/2{bottom:-50%}.left-0{left:0}.right-0{right:0}.grid{display:grid}.mb-16{margin-bottom:4rem}.mb-8{margin-bottom:2rem}.h-1\\/2{height:50%}.max-w-520px{max-width:520px}.min-h-screen{min-height:100vh}.place-content-center{place-content:center}.overflow-hidden{overflow:hidden}.bg-white{--un-bg-opacity:1;background-color:rgb(255 255 255/var(--un-bg-opacity))}.px-8{padding-left:2rem;padding-right:2rem}.text-center{text-align:center}.text-8xl{font-size:6rem;line-height:1}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-black{--un-text-opacity:1;color:rgb(0 0 0/var(--un-text-opacity))}.font-light{font-weight:300}.font-medium{font-weight:500}.leading-tight{line-height:1.25}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}@media(prefers-color-scheme:dark){.dark\\:bg-black{--un-bg-opacity:1;background-color:rgb(0 0 0/var(--un-bg-opacity))}.dark\\:text-white{--un-text-opacity:1;color:rgb(255 255 255/var(--un-text-opacity))}}@media(min-width:640px){.sm\\:px-0{padding-left:0;padding-right:0}.sm\\:text-4xl{font-size:2.25rem;line-height:2.5rem}}</style><script>!function(){const e=document.createElement(\"link\").relList;if(!(e&&e.supports&&e.supports(\"modulepreload\"))){for(const e of document.querySelectorAll('link[rel=\"modulepreload\"]'))r(e);new MutationObserver(e=>{for(const o of e)if(\"childList\"===o.type)for(const e of o.addedNodes)\"LINK\"===e.tagName&&\"modulepreload\"===e.rel&&r(e)}).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),\"use-credentials\"===e.crossOrigin?r.credentials=\"include\":\"anonymous\"===e.crossOrigin?r.credentials=\"omit\":r.credentials=\"same-origin\",r}(e);fetch(e.href,r)}}();<\/script></head><body class=\"antialiased bg-white dark:bg-black dark:text-white font-sans grid min-h-screen overflow-hidden place-content-center text-black\"><div class=\"-bottom-1/2 fixed h-1/2 left-0 right-0 spotlight\"></div><div class=\"max-w-520px text-center\"><h1 class=\"font-medium mb-8 sm:text-10xl text-8xl\">" + escapeHtml(messages.status) + "</h1><p class=\"font-light leading-tight mb-16 px-8 sm:px-0 sm:text-4xl text-xl\">" + escapeHtml(messages.description) + "</p></div></body></html>";
};

const error500 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template$1
}, Symbol.toStringTag, { value: 'Module' }));

const server = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: viteNodeEntry_mjs
}, Symbol.toStringTag, { value: 'Module' }));

const client_manifest = () => viteNodeFetch.getManifest();

const client_manifest$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: client_manifest
}, Symbol.toStringTag, { value: 'Module' }));

const template = "";

const _virtual__spaTemplate = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template
}, Symbol.toStringTag, { value: 'Module' }));

const styles = {};

const styles$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: styles
}, Symbol.toStringTag, { value: 'Module' }));

const prisma = new PrismaClient();

const index_get$i = defineEventHandler(async (event) => {
  return await prisma.employe.findMany({
    include: {
      poste: true,
      editionsGerees: {
        include: {
          licence: true,
          ville: true
        }
      }
    },
    orderBy: { nom: "asc" }
  });
});

const index_get$j = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$i
}, Symbol.toStringTag, { value: 'Module' }));

const index_post$e = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.employeId || !body.editionId) {
    throw createError({ statusCode: 400, statusMessage: "Employe et Edition requis" });
  }
  return await prisma.employe.update({
    where: { id: body.employeId },
    data: {
      editionsGerees: {
        connect: { id: body.editionId }
      }
    }
  });
});

const index_post$f = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post$e
}, Symbol.toStringTag, { value: 'Module' }));

const remove_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.employeId || !body.editionId) {
    throw createError({ statusCode: 400, statusMessage: "Employe et Edition requis" });
  }
  return await prisma.employe.update({
    where: { id: body.employeId },
    data: {
      editionsGerees: {
        disconnect: { id: body.editionId }
      }
    }
  });
});

const remove_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: remove_post
}, Symbol.toStringTag, { value: 'Module' }));

const login_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.email || !body.mot_de_passe) {
    throw createError({ statusCode: 400, statusMessage: "Email et mot de passe requis." });
  }
  const employe = await prisma.employe.findUnique({
    where: { email: body.email },
    include: { role: true, poste: { include: { departement: true } } }
  });
  if (!employe || !employe.mot_de_passe) {
    throw createError({ statusCode: 401, statusMessage: "Identifiants invalides." });
  }
  if (!verifyPassword(body.mot_de_passe, employe.mot_de_passe)) {
    throw createError({ statusCode: 401, statusMessage: "Identifiants invalides." });
  }
  if (!employe.is_active) {
    throw createError({ statusCode: 403, statusMessage: "Votre compte est en attente de validation par un administrateur." });
  }
  const isAdminLogin = body.isAdminLogin === true;
  if (isAdminLogin && employe.role.niveau_acces !== "ADMIN") {
    throw createError({ statusCode: 403, statusMessage: "Acc\xE8s refus\xE9. R\xE9serv\xE9 aux administrateurs." });
  }
  const token = signToken({ id: employe.id, email: employe.email, role: employe.role.niveau_acces });
  setCookie(event, "auth_token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    // 7 days
    path: "/"
  });
  const { mot_de_passe, ...safeEmploye } = employe;
  return { success: true, user: safeEmploye };
});

const login_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: login_post
}, Symbol.toStringTag, { value: 'Module' }));

const logout_post = defineEventHandler(async (event) => {
  deleteCookie(event, "auth_token", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/"
  });
  return { success: true, message: "D\xE9connexion r\xE9ussie." };
});

const logout_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: logout_post
}, Symbol.toStringTag, { value: 'Module' }));

const manage_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const token = getCookie(event, "auth_token");
  if (!token) throw createError({ statusCode: 401, statusMessage: "Non authentifi\xE9" });
  const payload = verifyToken(token);
  if (!payload || payload.role !== "ADMIN") throw createError({ statusCode: 403, statusMessage: "R\xE9serv\xE9 aux admins" });
  const body = await readBody(event);
  if (!body.employeId || !body.action) throw createError({ statusCode: 400, statusMessage: "Param\xE8tres manquants" });
  const employe = await prisma.employe.findUnique({ where: { id: body.employeId } });
  if (!employe) throw createError({ statusCode: 404, statusMessage: "Employ\xE9 introuvable" });
  if (body.action === "validate") {
    const updateData = { is_active: true };
    if ((_a = body.data) == null ? void 0 : _a.posteId) updateData.posteId = body.data.posteId;
    if ((_b = body.data) == null ? void 0 : _b.roleId) updateData.roleId = body.data.roleId;
    await prisma.employe.update({ where: { id: body.employeId }, data: updateData });
    return { success: true, message: `Compte de ${employe.nom} ${employe.prenom} activ\xE9.` };
  }
  if (body.action === "reject") {
    await prisma.employe.delete({ where: { id: body.employeId } });
    return { success: true, message: "Compte supprim\xE9." };
  }
  if (body.action === "set_password") {
    if (!((_c = body.data) == null ? void 0 : _c.password)) throw createError({ statusCode: 400, statusMessage: "Mot de passe manquant" });
    await prisma.employe.update({
      where: { id: body.employeId },
      data: { mot_de_passe: hashPassword(body.data.password) }
    });
    return { success: true, message: "Mot de passe mis \xE0 jour." };
  }
  if (body.action === "set_role") {
    if (!((_d = body.data) == null ? void 0 : _d.roleId)) throw createError({ statusCode: 400, statusMessage: "R\xF4le manquant" });
    await prisma.employe.update({
      where: { id: body.employeId },
      data: { roleId: body.data.roleId }
    });
    return { success: true, message: "R\xF4le mis \xE0 jour." };
  }
  if (body.action === "toggle_active") {
    const newStatus = !employe.is_active;
    await prisma.employe.update({
      where: { id: body.employeId },
      data: { is_active: newStatus }
    });
    return { success: true, message: newStatus ? "Compte activ\xE9." : "Compte d\xE9sactiv\xE9." };
  }
  throw createError({ statusCode: 400, statusMessage: "Action inconnue" });
});

const manage_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: manage_post
}, Symbol.toStringTag, { value: 'Module' }));

const me_get = defineEventHandler(async (event) => {
  const token = getCookie(event, "auth_token");
  if (!token) throw createError({ statusCode: 401, statusMessage: "Non authentifi\xE9" });
  const payload = verifyToken(token);
  if (!payload || !payload.id) throw createError({ statusCode: 401, statusMessage: "Session expir\xE9e ou invalide" });
  const employe = await prisma.employe.findUnique({
    where: { id: payload.id },
    include: { role: true, poste: { include: { departement: true } } }
  });
  if (!employe || !employe.is_active) throw createError({ statusCode: 401, statusMessage: "Compte inactif ou introuvable" });
  if (payload.simulatedPosteId) {
    const simulatedPoste = await prisma.poste.findUnique({
      where: { id: payload.simulatedPosteId },
      include: { departement: true }
    });
    if (simulatedPoste) {
      employe.poste = simulatedPoste;
      employe.is_simulated = true;
    }
  }
  const { mot_de_passe, ...safeEmploye } = employe;
  return safeEmploye;
});

const me_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: me_get
}, Symbol.toStringTag, { value: 'Module' }));

const pending_get = defineEventHandler(async (event) => {
  const token = getCookie(event, "auth_token");
  if (!token) throw createError({ statusCode: 401, statusMessage: "Non authentifi\xE9" });
  const payload = verifyToken(token);
  if (!payload || payload.role !== "ADMIN") throw createError({ statusCode: 403, statusMessage: "R\xE9serv\xE9 aux admins" });
  return await prisma.employe.findMany({
    where: { is_active: false },
    include: { role: true, poste: { include: { departement: true } } },
    orderBy: { nom: "asc" }
  });
});

const pending_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: pending_get
}, Symbol.toStringTag, { value: 'Module' }));

const register_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.email || !body.mot_de_passe || !body.nom || !body.prenom) {
    throw createError({ statusCode: 400, statusMessage: "Tous les champs obligatoires (nom, pr\xE9nom, email, mot de passe) doivent \xEAtre remplis." });
  }
  const nom = String(body.nom).trim().slice(0, 100);
  const prenom = String(body.prenom).trim().slice(0, 100);
  const email = String(body.email).trim().toLowerCase().slice(0, 254);
  const motDePasse = String(body.mot_de_passe);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw createError({ statusCode: 400, statusMessage: "Format d'email invalide." });
  }
  if (motDePasse.length < 8) {
    throw createError({ statusCode: 400, statusMessage: "Le mot de passe doit contenir au moins 8 caract\xE8res." });
  }
  if (!nom || !prenom) {
    throw createError({ statusCode: 400, statusMessage: "Le nom et le pr\xE9nom ne peuvent pas \xEAtre vides." });
  }
  const existing = await prisma.employe.findUnique({ where: { email } });
  if (existing) {
    throw createError({ statusCode: 400, statusMessage: "Cet email est d\xE9j\xE0 utilis\xE9." });
  }
  let role = await prisma.role.findUnique({ where: { niveau_acces: "CM" } });
  if (!role) {
    role = await prisma.role.findFirst();
  }
  if (!role) {
    throw createError({ statusCode: 500, statusMessage: "Aucun r\xF4le configur\xE9. Contactez un administrateur." });
  }
  let poste = await prisma.poste.findFirst();
  if (!poste) {
    throw createError({ statusCode: 500, statusMessage: "Aucun poste configur\xE9. Contactez un administrateur." });
  }
  await prisma.employe.create({
    data: {
      nom,
      prenom,
      email,
      mot_de_passe: hashPassword(motDePasse),
      is_active: false,
      roleId: role.id,
      posteId: poste.id
    }
  });
  return { success: true, message: "Compte cr\xE9\xE9 avec succ\xE8s. Il est en attente de validation par un administrateur." };
});

const register_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: register_post
}, Symbol.toStringTag, { value: 'Module' }));

const simulate_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const posteId = body.posteId;
  if (!posteId) throw createError({ statusCode: 400, statusMessage: "Poste ID requis" });
  const token = getCookie(event, "auth_token");
  if (!token) throw createError({ statusCode: 401, statusMessage: "Non authentifi\xE9" });
  const payload = verifyToken(token);
  if (!payload || !payload.id || payload.role !== "ADMIN") {
    throw createError({ statusCode: 403, statusMessage: "Seul un administrateur peut simuler un r\xF4le" });
  }
  const poste = await prisma.poste.findUnique({ where: { id: posteId } });
  if (!poste) throw createError({ statusCode: 404, statusMessage: "Poste introuvable" });
  const newToken = signToken({
    id: payload.id,
    email: payload.email,
    role: payload.role,
    simulatedPosteId: poste.id
  });
  setCookie(event, "auth_token", newToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/"
  });
  return { success: true, message: `Simulation du poste ${poste.titre} activ\xE9e` };
});

const simulate_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: simulate_post
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$a = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "ID manquant" });
  try {
    await prisma.editionPage.delete({
      where: { id }
    });
    return { success: true };
  } catch (e) {
    throw createError({ statusCode: 500, statusMessage: "Impossible de supprimer (d\xE9pendances existantes ?)" });
  }
});

const _id__delete$b = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$a
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$g = defineEventHandler(async (event) => {
  return await prisma.editionPage.findMany({
    include: {
      licence: true,
      ville: true
    },
    orderBy: { date_debut: "asc" }
  });
});

const index_get$h = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$g
}, Symbol.toStringTag, { value: 'Module' }));

const index_post$c = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.licenceId || !body.villeId) {
    throw createError({ statusCode: 400, statusMessage: "Licence et Ville requises" });
  }
  if (body.id) {
    return await prisma.editionPage.update({
      where: { id: body.id },
      data: {
        licenceId: body.licenceId,
        villeId: body.villeId,
        date_debut: body.date_debut ? new Date(body.date_debut) : null,
        date_fin: body.date_fin ? new Date(body.date_fin) : null,
        metaPageId: body.metaPageId || null
      },
      include: { licence: true, ville: true }
    });
  } else {
    return await prisma.editionPage.create({
      data: {
        licenceId: body.licenceId,
        villeId: body.villeId,
        date_debut: body.date_debut ? new Date(body.date_debut) : null,
        date_fin: body.date_fin ? new Date(body.date_fin) : null,
        metaPageId: body.metaPageId || null
      },
      include: { licence: true, ville: true }
    });
  }
});

const index_post$d = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post$c
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$8 = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "ID manquant" });
  try {
    await prisma.employe.delete({
      where: { id }
    });
    return { success: true };
  } catch (e) {
    throw createError({ statusCode: 500, statusMessage: "Impossible de supprimer (d\xE9pendances existantes ?)" });
  }
});

const _id__delete$9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$8
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$e = defineEventHandler(async (event) => {
  const employes = await prisma.employe.findMany({
    include: {
      poste: { include: { departement: true } },
      role: true,
      editionsGerees: {
        include: {
          licence: true,
          ville: true
        }
      }
    },
    orderBy: { nom: "asc" }
  });
  return employes.map((emp) => {
    const { mot_de_passe, ...safeEmp } = emp;
    return safeEmp;
  });
});

const index_get$f = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$e
}, Symbol.toStringTag, { value: 'Module' }));

const index_post$a = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.nom || !body.prenom || !body.email || !body.posteId || !body.roleId) {
    throw createError({ statusCode: 400, statusMessage: "Champs obligatoires manquants" });
  }
  if (body.id) {
    return await prisma.employe.update({
      where: { id: body.id },
      data: {
        nom: body.nom,
        prenom: body.prenom,
        email: body.email,
        posteId: body.posteId,
        roleId: body.roleId
      },
      include: { poste: { include: { departement: true } }, role: true }
    });
  } else {
    return await prisma.employe.create({
      data: {
        nom: body.nom,
        prenom: body.prenom,
        email: body.email,
        posteId: body.posteId,
        roleId: body.roleId
      },
      include: { poste: { include: { departement: true } }, role: true }
    });
  }
});

const index_post$b = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post$a
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$6 = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "ID manquant" });
  try {
    await prisma.licence.delete({
      where: { id }
    });
    return { success: true };
  } catch (e) {
    throw createError({ statusCode: 500, statusMessage: "Impossible de supprimer (d\xE9pendances existantes ?)" });
  }
});

const _id__delete$7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$6
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$c = defineEventHandler(async (event) => {
  return await prisma.licence.findMany({
    orderBy: { nom_complet: "asc" }
  });
});

const index_get$d = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$c
}, Symbol.toStringTag, { value: 'Module' }));

const index_post$8 = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.nom_complet || !body.sigle) {
    throw createError({ statusCode: 400, statusMessage: "Nom et sigle requis" });
  }
  return await prisma.licence.create({
    data: {
      nom_complet: body.nom_complet,
      sigle: body.sigle
    }
  });
});

const index_post$9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post$8
}, Symbol.toStringTag, { value: 'Module' }));

function callGroqAI(prompt) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      reject(new Error("GROQ_API_KEY not configured"));
      return;
    }
    const body = JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 2e3,
      response_format: { type: "json_object" }
    });
    const options = {
      hostname: "api.groq.com",
      path: "/openai/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        "Authorization": `Bearer ${apiKey}`
      }
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        var _a, _b, _c;
        if (res.statusCode !== 200) {
          reject(new Error(`Groq HTTP ${res.statusCode}: ${data}`));
          return;
        }
        try {
          const json = JSON.parse(data);
          const text = ((_c = (_b = (_a = json == null ? void 0 : json.choices) == null ? void 0 : _a[0]) == null ? void 0 : _b.message) == null ? void 0 : _c.content) || "";
          resolve(text);
        } catch (e) {
          reject(new Error("Failed to parse Groq response: " + data));
        }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}
const SYSTEM_PROMPT = `Tu es un expert senior en publicit\xE9 Meta Ads et Community Management, sp\xE9cialis\xE9 dans les \xE9v\xE9nements culturels et festivals en France.

Tu analyses des donn\xE9es r\xE9elles de campagnes Meta Ads pour les pages Facebook/Instagram du Japan Otaku Festival (JOF) \u2014 un festival de culture manga/anime organis\xE9 dans plusieurs villes fran\xE7aises (Bordeaux, Metz, \xC9vreux, Nevers...).

Tes analyses doivent \xEAtre :
- OBJECTIVES : bas\xE9es uniquement sur les chiffres fournis
- EXPERTES : utiliser les vrais KPIs Meta (CTR, CPC, CPM, fr\xE9quence, taux d'engagement)
- JUSTIFI\xC9ES : chaque recommandation doit citer les m\xE9triques qui la supportent
- ACTIONNABLES : des actions concr\xE8tes, pas des g\xE9n\xE9ralit\xE9s
- CONTEXTUALIS\xC9ES : tenir compte du secteur \xE9v\xE9nementiel, de la saisonnalit\xE9 et de la date de l'\xE9v\xE9nement

Benchmarks Meta pour \xE9v\xE9nements culturels en France :
- CTR moyen : 0.5% - 1.5% (bon > 1%, excellent > 2%)
- CPC moyen : 0.50\u20AC - 1.50\u20AC (bon < 0.80\u20AC, excellent < 0.40\u20AC)
- CPM moyen : 5\u20AC - 12\u20AC
- Taux d'engagement : 1% - 3% (bon > 2%, excellent > 5%)
- Fr\xE9quence : garder < 3 (sinon banni\xE8re aveugle)

R\xC8GLES DE COH\xC9RENCE ABSOLUES :
1. Si un post a l'action "ARRETER" dans postsAnalyses, il DOIT avoir l'action "STOP" dans budgetReallocation. Tu ne peux pas transf\xE9rer du budget vers un post que tu as conseill\xE9 d'arr\xEAter.
2. Si tu conseilles "BOOST" dans budgetReallocation, le post correspondant DOIT avoir l'action "BOOSTER" dans postsAnalyses.
3. Les justifications DOIVENT inclure les chiffres exacts du tableau de donn\xE9es (D\xE9penses, Clics, CPC, Vues). Exemple : "D\xE9pense de 150\u20AC pour seulement 11 clics (CPC 13\u20AC), \xE0 arr\xEAter imm\xE9diatement."

Actions possibles pour chaque post :
- LAISSER_TOURNER : performe bien, retour sur investissement correct
- BOOSTER : performe exceptionnellement bien (CPC tr\xE8s bas, fort volume de clics), m\xE9rite TOUT le budget
- SURVEILLER : trop t\xF4t pour juger ou donn\xE9es mitig\xE9es
- ARRETER : mauvais retour sur investissement (ex: beaucoup de vues mais aucun clic, ou CPC tr\xE8s \xE9lev\xE9), pur gaspillage
- MODIFIER_CIBLAGE : clics pr\xE9sents mais pas d'engagement ou inversement
- OPTIMISER : modifier la cr\xE9a

IMPORTANT: R\xE9ponds UNIQUEMENT avec un JSON valide, sans markdown, sans explication.`;
async function analyzeMetaPage(data) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn("[Groq] No API key configured");
    return null;
  }
  const roi = data.budgetInfo.depense > 0 ? ((data.budgetInfo.revenusBilletterie + data.budgetInfo.revenusExposants) / data.budgetInfo.depense).toFixed(1) : "N/A";
  const postsToAnalyze = data.posts.slice(0, 12);
  const postsText = postsToAnalyze.length > 0 ? postsToAnalyze.map(
    (p, i) => {
      var _a;
      return `Post #${i + 1}: "${((_a = p.message) == null ? void 0 : _a.slice(0, 80)) || "Sans texte"}"
    - ID: ${p.id}
    - Date: ${p.createdTime}
    - Vues Total: ${p.vuesTotal} | Vues Pay\xE9es: ${p.vuesPub} | Vues Organiques: ${p.vuesOrganique}
    - Couverture: ${p.couverture} | Interactions: ${p.interactions} | Clics Lien: ${p.clicsLien}
    - Taux d'engagement: ${p.tauxEngagement}%
    - Sponsoris\xE9: ${p.isSponsored ? "Oui" : "Non (organique)"}`;
    }
  ).join("\n\n") : "Aucun post disponible (donn\xE9es en cours de synchronisation).";
  const adsText = data.adInsights.length > 0 ? data.adInsights.map(
    (ad) => `Campagne "${ad.campaign_name}": D\xE9pense=${ad.spend}\u20AC, Impressions=${ad.impressions}, Clics=${ad.clicks}, CTR=${ad.ctr}%, CPC=${ad.cpc}\u20AC, CPM=${ad.cpm}\u20AC`
  ).join("\n") : "Aucune donn\xE9e publicitaire disponible.";
  const prompt = `${SYSTEM_PROMPT}

---

DONN\xC9ES DE LA PAGE : ${data.pageNom}
P\xE9riode d'analyse : ${data.periode}
Jours avant l'\xE9v\xE9nement : J-${data.joursAvantEvenement}
Followers Facebook : ${data.followers.fb}

BUDGET & ROI :
- Budget Total : ${data.budgetInfo.total}\u20AC
- D\xE9pens\xE9 : ${data.budgetInfo.depense}\u20AC (${data.budgetInfo.total > 0 ? (data.budgetInfo.depense / data.budgetInfo.total * 100).toFixed(1) : 0}%)
- Revenus Billetterie : ${data.budgetInfo.revenusBilletterie}\u20AC
- Revenus Exposants : ${data.budgetInfo.revenusExposants}\u20AC
- ROI actuel : x${roi}

POSTS (organiques + sponsoris\xE9s) :
${postsText}

CAMPAGNES PUBLICITAIRES META :
${adsText}

DONN\xC9ES FEUILLE DE SUIVI INTERNE :
${data.sheetData || "Non disponible"}

---

G\xE9n\xE8re un rapport expert complet au format JSON EXACT suivant :
{
  "score": <entier 0-100>,
  "scoreTendance": "<hausse|baisse|stable>",
  "resumeExecutif": "<3-4 phrases synth\xE8se expert>",
  "alertes": [
    {
      "niveau": "<critique|important|info>",
      "titre": "<titre court>",
      "message": "<message clair>",
      "justification": "<chiffres qui justifient>"
    }
  ],
  "postsAnalyses": [
    {
      "postId": "<utiliser l'ID fourni>",
      "message": "<80 premiers chars>",
      "action": "<LAISSER_TOURNER|BOOSTER|SURVEILLER|ARRETER|MODIFIER_CIBLAGE|OPTIMISER>",
      "actionLabel": "<libell\xE9 humain avec emoji>",
      "priorite": "<haute|moyenne|faible>",
      "justification": "<justification avec chiffres>",
      "budgetSugere": <montant en euros si BOOSTER, sinon null>
    }
  ],
  "budgetReallocation": [
    {
      "postMessage": "<nom du post>",
      "action": "<STOP|BOOST|KEEP|RETARGET>",
      "montant": <montant ou null>,
      "justification": "<pourquoi>"
    }
  ],
  "audienceAlerts": [
    {
      "type": "<geo|age|frequence|autre>",
      "niveau": "<critique|important|info>",
      "message": "<alerte>",
      "justification": "<chiffres>"
    }
  ],
  "contentIntel": {
    "formatGagnant": "<Reel|Photo|Vid\xE9o|...>",
    "meilleurHoraire": "<ex: 21h-22h>",
    "themeGagnant": "<type de contenu qui fonctionne>",
    "recommandation": "<conseil cr\xE9atif concret>"
  },
  "planAction": [
    {
      "priorite": "<urgent|cette_semaine|surveiller>",
      "action": "<action concr\xE8te et actionnable>"
    }
  ],
  "kpis": {
    "tauxOrganiqueMoyen": "<x%>",
    "ctrMoyen": "<x%>",
    "cpcMoyen": "<x\u20AC>",
    "cpmMoyen": "<x\u20AC>",
    "roiActuel": "x${roi}",
    "roiRecommande": "<projection si recommandations suivies>"
  }
}`;
  try {
    const text = await callGroqAI(prompt);
    const cleaned = text.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      ...parsed,
      pageNom: data.pageNom,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  } catch (e) {
    console.error("[Groq] Analysis error:", e.message || e);
    throw e;
  }
}
function generateDemoAnalysis(pageNom) {
  return {
    pageNom,
    score: 67,
    scoreTendance: "hausse",
    generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    resumeExecutif: `94% des vues proviennent des publicit\xE9s \u2014 sans budget, la page est quasi invisible. Deux posts concentrent 92% du trafic. Le CPC de 0,04\u20AC sur la campagne Pass Early est excellent. Le budget est tr\xE8s sous-utilis\xE9 \xE0 J-91 : seulement 1,8% d\xE9pens\xE9.`,
    alertes: [
      {
        niveau: "critique",
        titre: "Budget sous-utilis\xE9",
        message: "Seulement 89\u20AC d\xE9pens\xE9s sur 5 000\u20AC \xE0 J-91 de l'\xE9v\xE9nement.",
        justification: "1,8% du budget consomm\xE9. Recommand\xE9 : 350\u20AC/mois minimum d\xE8s maintenant."
      },
      {
        niveau: "important",
        titre: "D\xE9pendance aux publicit\xE9s",
        message: "94% des vues viennent des pubs payantes (seulement 6% organique).",
        justification: "Travailler l'engagement naturel avec du contenu viral (d\xE9fis, Reels)."
      },
      {
        niveau: "info",
        titre: "Excellente campagne Pass Early",
        message: "CPC de 0,04\u20AC \u2014 15x moins cher que la moyenne Meta.",
        justification: "634 clics pour 25\u20AC d\xE9pens\xE9s. \xC0 maintenir absolument."
      }
    ],
    postsAnalyses: [
      {
        postId: "demo1",
        message: "JAPAN OTAKU FESTIVAL (Reel)",
        action: "LAISSER_TOURNER",
        actionLabel: "\u{1F7E2} Laisser tourner",
        priorite: "haute",
        justification: "82 545 vues totales, 531 clics lien. CPC estim\xE9 0,15\u20AC.",
        budgetSugere: null
      },
      {
        postId: "demo2",
        message: "L'\xC9V\xC9NEMENT MANGA \xC0 NE PAS RATER",
        action: "SURVEILLER",
        actionLabel: "\u{1F7E1} Surveiller J+8",
        priorite: "moyenne",
        justification: "45 794 vues, fort engagement mais faible conversion. R\xE9\xE9valuer dans 8 jours.",
        budgetSugere: null
      }
    ],
    budgetReallocation: [
      { postMessage: "Japan Otaku Festival (Reel)", action: "BOOST", montant: 150, justification: "531 clics, CPC excellent." },
      { postMessage: "Pass Early Access", action: "KEEP", montant: 25, justification: "CPC de 0,04\u20AC \u2014 exceptionnel." }
    ],
    audienceAlerts: [
      {
        type: "autre",
        niveau: "info",
        message: "Communaut\xE9 tr\xE8s jeune (74 followers FB)",
        justification: "La page est r\xE9cente. Croissance prioritaire en parall\xE8le des pubs."
      }
    ],
    contentIntel: {
      formatGagnant: "Reel",
      meilleurHoraire: "21h00 - 22h00",
      themeGagnant: "Japan Otaku Festival (branding direct)",
      recommandation: "Cr\xE9er des Reels de 15-30s avec le branding visible d\xE8s les 3 premi\xE8res secondes."
    },
    planAction: [
      { priorite: "urgent", action: "Augmenter le budget Pass Early Access \u2014 CPC de 0,04\u20AC exceptionnel" },
      { priorite: "cette_semaine", action: "Cr\xE9er un nouveau Reel Japan Otaku Festival (budget 80-100\u20AC)" },
      { priorite: "surveiller", action: `R\xE9\xE9valuer le taux de conversion "L'\xC9v\xE9nement Manga" le 15 juin` }
    ],
    kpis: {
      tauxOrganiqueMoyen: "6%",
      ctrMoyen: "0.64%",
      cpcMoyen: "0.15\u20AC",
      cpmMoyen: "8.20\u20AC",
      roiActuel: "x7.6",
      roiRecommande: "x12+ si budget exploit\xE9 correctement"
    }
  };
}

const SHEET_ID = process.env.GOOGLE_SHEET_ID || "1rBsGl0vcDxE7n33Pi_F6RVSymG6pFcYL1re5jrGPmRk";
const CITY_TO_TAB_KEYWORDS = {
  bordeaux: ["bordeaux", "Bordeaux"],
  metz: ["metz", "Metz"],
  evreux: ["evreux", "vreux", "Evreux"],
  nevers: ["nevers", "Nevers"]
};
function fetchSheetCSV(sheetName, range) {
  return new Promise((resolve, reject) => {
    const encodedSheet = encodeURIComponent(sheetName);
    let path = `/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodedSheet}`;
    if (range) path += `&range=${encodeURIComponent(range)}`;
    const options = {
      hostname: "docs.google.com",
      path,
      method: "GET",
      headers: { "Accept": "text/csv" }
    };
    const req = https.request(options, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        reject(new Error(`Redirect \u2014 sheet may not be public. Status: ${res.statusCode}`));
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} \u2014 sheet may not be public`));
        return;
      }
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => resolve(data));
    });
    req.on("error", reject);
    req.end();
  });
}
function parseCSV(csv) {
  const rows = [];
  const lines = csv.split("\n");
  for (const line of lines) {
    if (!line.trim()) continue;
    const cells = [];
    let inQuote = false;
    let cell = "";
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuote && line[i + 1] === '"') {
          cell += '"';
          i++;
        } else inQuote = !inQuote;
      } else if (ch === "," && !inQuote) {
        cells.push(cell.trim());
        cell = "";
      } else {
        cell += ch;
      }
    }
    cells.push(cell.trim());
    rows.push(cells);
  }
  return rows;
}
function parseNum(val) {
  if (!val) return 0;
  const cleaned = val.replace(/[€\s\u00a0]/g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}
function parseCityBudget(rows) {
  var _a, _b;
  const result = {
    budget: 0,
    depense: 0,
    tiktok: 0,
    revenusBilletterie: 0,
    revenusExposants: 0
  };
  for (let i = 0; i < Math.min(rows.length, 100); i++) {
    const row = rows[i];
    if (!row) continue;
    const colB = ((_a = row[1]) == null ? void 0 : _a.toLowerCase().replace(/\s/g, "")) || "";
    const colC = row[2] || "";
    if (colB.includes("budget") && !colB.includes("pass") && !colB.includes("abdel")) {
      const v = parseNum(colC);
      if (v > 0) result.budget = v;
    }
    if (colB.includes("penser") || colB.includes("pens")) {
      const v = parseNum(colC);
      if (v > 0) result.depense = v;
    }
    if (colB.includes("tiktok")) {
      const v = parseNum(colC);
      if (v > 0) result.tiktok = v;
    }
    const colG = ((_b = row[6]) == null ? void 0 : _b.toLowerCase()) || "";
    const colH = row[7] || "";
    if ((colG.includes("billeterie") || colG.includes("billetterie")) && colH) {
      const v = parseNum(colH);
      if (v > 0) result.revenusBilletterie = v;
    }
    if (colG.includes("exposant") && colH) {
      const v = parseNum(colH);
      if (v > 0) result.revenusExposants = v;
    }
    if (i === 1 && result.revenusBilletterie === 0) {
      const v = parseNum(colH);
      if (v > 0) result.revenusBilletterie = v;
    }
    if (i === 2 && result.revenusExposants === 0) {
      const v = parseNum(colH);
      if (v > 0) result.revenusExposants = v;
    }
  }
  return result;
}
async function fetchCityBudgetData(cityName) {
  var _a, _b, _c;
  (_a = CITY_TO_TAB_KEYWORDS[cityName.toLowerCase()]) != null ? _a : [cityName.toLowerCase()];
  const knownTabs = {
    bordeaux: "\u{1F7E5}  Bordeaux - 5 &  6 sept",
    metz: "\u{1F7E5}  Metz- 26 &  27 sept",
    evreux: "\u{1F7E5}  Evreux - 17 &  18 oct",
    nevers: "\u{1F7E5}  Nevers - 03 &  04 oct"
  };
  const tabName = knownTabs[cityName.toLowerCase()];
  if (!tabName) {
    console.warn(`[SheetsAPI] No known tab for city: ${cityName}`);
    return null;
  }
  try {
    console.info(`[SheetsAPI] Fetching tab: "${tabName}"`);
    const csv = await fetchSheetCSV(tabName);
    const rows = parseCSV(csv);
    let revenusBilletterie = 0;
    let revenusExposants = 0;
    try {
      const revenueCsv = await fetchSheetCSV(tabName, "G1:H5");
      const revRows = parseCSV(revenueCsv);
      for (const r of revRows) {
        if (!r || r.length < 2) continue;
        const label = (r[0] || "").toLowerCase();
        const val = parseNum(r[1]);
        if (label.includes("billeterie") || label.includes("billetterie")) revenusBilletterie = val;
        if (label.includes("exposant")) revenusExposants = val;
      }
    } catch (e) {
      console.warn("[SheetsAPI] Failed to fetch revenue range:", e);
    }
    if (rows.length < 3) {
      console.warn(`[SheetsAPI] Tab ${tabName} has too few rows`);
      return { found: false, budget: 0, depense: 0, tiktok: 0, revenusBilletterie: 0, revenusExposants: 0, rawSummary: "" };
    }
    const budget = parseCityBudget(rows);
    if (revenusBilletterie > 0) budget.revenusBilletterie = revenusBilletterie;
    if (revenusExposants > 0) budget.revenusExposants = revenusExposants;
    const rawSummary = `SUIVI BUDGET ${cityName.toUpperCase()} :
- Budget Meta Ads total : ${budget.budget}\u20AC
- D\xE9pens\xE9 \xE0 ce jour : ${budget.depense}\u20AC (${budget.budget > 0 ? (budget.depense / budget.budget * 100).toFixed(1) : 0}%)
- Budget TikTok : ${budget.tiktok}\u20AC
- Revenus Billetterie : ${budget.revenusBilletterie}\u20AC
- Revenus Exposants : ${budget.revenusExposants}\u20AC
- ROI actuel : x${budget.depense > 0 ? ((budget.revenusBilletterie + budget.revenusExposants) / budget.depense).toFixed(1) : "N/A"}`;
    console.info(`[SheetsAPI] ${cityName}: Budget=${budget.budget}\u20AC, D\xE9pens\xE9=${budget.depense}\u20AC`);
    return { found: true, tabName, ...budget, rawSummary };
  } catch (e) {
    console.error(`[SheetsAPI] Error fetching tab "${tabName}":`, e.message);
    if (((_b = e.message) == null ? void 0 : _b.includes("public")) || ((_c = e.message) == null ? void 0 : _c.includes("Redirect"))) {
      console.error('[SheetsAPI] \u26A0\uFE0F  Make sure the sheet is shared as "Anyone with the link can view"');
    }
    return null;
  }
}
async function fetchAllBudgetData() {
  const cities = ["bordeaux", "metz", "evreux"];
  const result = {};
  for (const city of cities) {
    try {
      const data = await fetchCityBudgetData(city);
      if (data) result[city] = data;
    } catch (e) {
      console.error(`[SheetsAPI] Failed to fetch ${city}:`, e);
    }
  }
  return result;
}
function formatSheetForAI(rows) {
  if (!rows || rows.length === 0) return "Aucune donn\xE9e disponible.";
  return rows.slice(0, 20).map((row) => row.filter(Boolean).join(" | ")).join("\n");
}

const analyse_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const {
    pageNom,
    pageId,
    followers = { fb: 0, ig: 0 },
    periode = "Derniers 30 jours",
    joursAvantEvenement = 90,
    posts = [],
    adInsights = [],
    budgetInfo = { total: 5e3, depense: 0, revenusBilletterie: 0, revenusExposants: 0 },
    sheetData = {}
  } = body;
  if (!pageNom) {
    throw createError({ statusCode: 400, statusMessage: "pageNom is required" });
  }
  const hasAIKey = !!process.env.GROQ_API_KEY;
  if (!hasAIKey) {
    console.info("[Meta/Analyse] No Groq key \u2014 returning demo analysis");
    const demo = generateDemoAnalysis(pageNom);
    return { success: true, analysis: demo, isDemo: true };
  }
  const sheetText = typeof sheetData === "string" ? sheetData : formatSheetForAI((sheetData == null ? void 0 : sheetData.rawRows) || []);
  try {
    const analysis = await analyzeMetaPage({
      pageNom,
      pageId: pageId || "",
      followers,
      periode,
      joursAvantEvenement,
      posts,
      adInsights,
      budgetInfo,
      sheetData: sheetText
    });
    if (!analysis) {
      console.error("[Meta/Analyse] Groq API returned null.");
      return { success: false, error: "\xC9chec de l'analyse par l'IA Groq. Le mod\xE8le n'a pas pu g\xE9n\xE9rer une r\xE9ponse valide." };
    }
    return { success: true, analysis, isDemo: false };
  } catch (e) {
    console.error("[Meta/Analyse] Groq API error:", e.message);
    return { success: false, error: `\xC9chec de l'analyse Groq: ${e.message}` };
  }
});

const analyse_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: analyse_post
}, Symbol.toStringTag, { value: 'Module' }));

const META_API_VERSION = "v19.0";
const META_BASE = `https://graph.facebook.com/${META_API_VERSION}`;
function getUserToken() {
  return process.env.META_SYSTEM_TOKEN || process.env.META_ACCESS_TOKEN || "";
}
const pageTokenCache = {};
async function getPageToken(pageId) {
  if (pageTokenCache[pageId]) return pageTokenCache[pageId];
  const userToken = getUserToken();
  if (!userToken) return "";
  try {
    const url = `${META_BASE}/me/accounts?access_token=${userToken}`;
    const res = await fetch(url);
    const json = await res.json();
    if (json.error) {
      console.error("[MetaAPI] Accounts error:", json.error);
      return userToken;
    }
    const page = (json.data || []).find((p) => p.id === pageId);
    if (page == null ? void 0 : page.access_token) {
      pageTokenCache[pageId] = page.access_token;
      console.info(`[MetaAPI] Got page token for ${pageId} (${page.name})`);
      return page.access_token;
    }
    console.warn(`[MetaAPI] Page ${pageId} not found in accounts, using user token`);
    return userToken;
  } catch (e) {
    console.error("[MetaAPI] getPageToken error:", e);
    return userToken;
  }
}
async function fetchPagePosts(pageId) {
  const token = await getPageToken(pageId);
  if (!token) return [];
  const fields = [
    "id",
    "message",
    "story",
    "created_time",
    "full_picture",
    "permalink_url",
    "insights.metric(post_impressions_unique,post_impressions_paid_unique,post_impressions_organic_unique,post_clicks_by_type,post_video_views,post_reactions_by_type_total)"
  ].join(",");
  const url = `${META_BASE}/${pageId}/posts?fields=${encodeURIComponent(fields)}&access_token=${token}&limit=50`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (json.error) {
      console.error("[MetaAPI] Posts error:", json.error);
      return [];
    }
    return json.data || [];
  } catch (e) {
    console.error("[MetaAPI] Fetch error:", e);
    return [];
  }
}
async function fetchPageInfo(pageId) {
  const token = await getPageToken(pageId);
  if (!token) return {};
  const url = `${META_BASE}/${pageId}?fields=name,fan_count,followers_count,category&access_token=${token}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (json.error) {
      console.error("[MetaAPI] Page info error:", json.error);
      return {};
    }
    return json;
  } catch (e) {
    console.error("[MetaAPI] Page info error:", e);
    return {};
  }
}
async function fetchAdInsights(adAccountId, datePreset = "last_30d") {
  const token = getToken();
  if (!token) return [];
  const fields = [
    "campaign_name",
    "adset_name",
    "ad_name",
    "spend",
    "impressions",
    "reach",
    "clicks",
    "ctr",
    "cpm",
    "cpc",
    "frequency",
    "actions",
    "date_start",
    "date_stop"
  ].join(",");
  const url = `${META_BASE}/${adAccountId}/insights?fields=${fields}&date_preset=${datePreset}&level=campaign&access_token=${token}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (json.error) {
      console.error("[MetaAPI] Ad insights error:", json.error);
      return [];
    }
    return json.data || [];
  } catch (e) {
    console.error("[MetaAPI] Ad insights error:", e);
    return [];
  }
}
function normalizePost(post) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const insights = {};
  for (const metric of ((_a = post.insights) == null ? void 0 : _a.data) || []) {
    insights[metric.name] = (_d = (_c = (_b = metric.values) == null ? void 0 : _b[0]) == null ? void 0 : _c.value) != null ? _d : 0;
  }
  const totalViews = (_e = insights.post_impressions_unique) != null ? _e : 0;
  const paidViews = (_f = insights.post_impressions_paid_unique) != null ? _f : 0;
  const organicViews = (_g = insights.post_impressions_organic_unique) != null ? _g : 0;
  const reach = (_h = insights.post_impressions_unique) != null ? _h : 0;
  const videoViews = (_i = insights.post_video_views) != null ? _i : 0;
  const shares = (_j = insights.post_shares) != null ? _j : 0;
  const reactionsObj = insights.post_reactions_by_type_total || {};
  let engaged = 0;
  if (typeof reactionsObj === "object") {
    engaged = Object.values(reactionsObj).reduce((sum, val) => sum + (Number(val) || 0), 0);
  } else if (typeof reactionsObj === "number") {
    engaged = reactionsObj;
  }
  const clicksData = insights.post_clicks_by_type || {};
  let linkClicks = 0;
  if (typeof clicksData === "object") {
    linkClicks = (_k = clicksData == null ? void 0 : clicksData.link_clicks) != null ? _k : 0;
  }
  engaged += linkClicks;
  return {
    id: post.id,
    message: post.message || post.story || "(Sans texte)",
    createdTime: post.created_time,
    picture: post.full_picture,
    permalink: post.permalink_url,
    vuesTotal: totalViews,
    vuesPub: paidViews,
    vuesOrganique: organicViews,
    couverture: reach,
    spectateurs: engaged,
    interactions: engaged,
    partages: shares,
    clicsLien: linkClicks,
    videoViews,
    tauxEngagement: totalViews > 0 ? (engaged / totalViews * 100).toFixed(2) : "0",
    isSponsored: paidViews > organicViews
  };
}

const sync_get = defineEventHandler(async (event) => {
  const query = getQuery$1(event);
  const pageId = query.pageId;
  const adAccountId = query.adAccountId;
  if (!pageId) {
    throw createError({ statusCode: 400, statusMessage: "pageId is required" });
  }
  const hasMetaToken = !!(process.env.META_SYSTEM_TOKEN || process.env.META_ACCESS_TOKEN);
  const hasSheetsAuth = !!(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY);
  let posts = [];
  let pageInfo = {};
  let adInsights = [];
  if (hasMetaToken) {
    const [rawPosts, info, ads] = await Promise.all([
      fetchPagePosts(pageId),
      fetchPageInfo(pageId),
      adAccountId ? fetchAdInsights(adAccountId) : Promise.resolve([])
    ]);
    posts = rawPosts.map(normalizePost).sort((a, b) => b.vuesTotal - a.vuesTotal);
    pageInfo = info;
    adInsights = ads;
  }
  let sheetData = {};
  sheetData = await fetchAllBudgetData();
  return {
    pageId,
    pageInfo,
    posts,
    adInsights,
    sheetData,
    meta: {
      hasMetaToken,
      hasSheetsAuth,
      postsCount: posts.length,
      syncedAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  };
});

const sync_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: sync_get
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$a = defineEventHandler(async (event) => {
  return await prisma.poste.findMany({
    include: { departement: true },
    orderBy: { titre_poste: "asc" }
  });
});

const index_get$b = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$a
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$8 = defineEventHandler(async (event) => {
  return await prisma.role.findMany({
    orderBy: { niveau_acces: "asc" }
  });
});

const index_get$9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$8
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$4 = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "ID manquant" });
  await prisma.tache.delete({
    where: { id }
  });
  return { success: true };
});

const _id__delete$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$4
}, Symbol.toStringTag, { value: 'Module' }));

const decider_post = defineEventHandler(async (event) => {
  var _a;
  const id = (_a = event.context.params) == null ? void 0 : _a.id;
  const body = await readBody(event);
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "ID de demande manquant" });
  }
  if (body.decision !== "APPROVE" && body.decision !== "REJECT") {
    throw createError({ statusCode: 400, statusMessage: "decision doit \xEAtre APPROVE ou REJECT" });
  }
  const demande = await prisma.demandeTache.findUnique({
    where: { id }
  });
  if (!demande) {
    throw createError({ statusCode: 404, statusMessage: "Demande introuvable" });
  }
  if (demande.statut !== "EN_ATTENTE") {
    throw createError({ statusCode: 400, statusMessage: "Cette demande a d\xE9j\xE0 \xE9t\xE9 trait\xE9e" });
  }
  if (body.decision === "APPROVE") {
    if (demande.typeDemande === "SUPPRESSION") {
      await prisma.tache.delete({
        where: { id: demande.tacheId }
      });
      return { success: true, message: "T\xE2che supprim\xE9e avec succ\xE8s" };
    } else if (demande.typeDemande === "MODIFICATION") {
      if (!demande.donneesModif) {
        throw createError({ statusCode: 400, statusMessage: "Aucune donn\xE9e de modification fournie" });
      }
      const parsed = JSON.parse(demande.donneesModif);
      const updateData = {};
      const fields = [
        "titre",
        "description",
        "date_limite",
        "demandeur",
        "type_visuel",
        "quantite",
        "format_video",
        "duree_cible",
        "type_technique",
        "type_demarche",
        "outil_mailing",
        "plateforme",
        "type_pub",
        "themePubId",
        "themeSponsoId",
        "budget",
        "audience",
        "editionId",
        "statutTacheId"
      ];
      for (const f of fields) {
        if (parsed[f] !== void 0) {
          if ((f === "date_limite" || f === "date_demande" || f === "date_resultat") && parsed[f]) {
            updateData[f] = new Date(parsed[f]);
          } else {
            updateData[f] = parsed[f];
          }
        }
      }
      await prisma.tache.update({
        where: { id: demande.tacheId },
        data: updateData
      });
      const updatedDemande = await prisma.demandeTache.update({
        where: { id },
        data: { statut: "ACCEPTEE" }
      });
      return { success: true, message: "Modification appliqu\xE9e avec succ\xE8s", demande: updatedDemande };
    }
  } else {
    const updatedDemande = await prisma.demandeTache.update({
      where: { id },
      data: { statut: "REFUSEE" }
    });
    return { success: true, message: "Demande refus\xE9e", demande: updatedDemande };
  }
});

const decider_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: decider_post
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$6 = defineEventHandler(async (event) => {
  const query = getQuery$1(event);
  const statut = query.statut || "EN_ATTENTE";
  const demandes = await prisma.demandeTache.findMany({
    where: {
      statut
    },
    include: {
      tache: {
        include: {
          employe: {
            include: {
              poste: {
                include: {
                  departement: true
                }
              }
            }
          },
          edition: {
            include: {
              licence: true,
              ville: true
            }
          },
          statutTache: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return demandes;
});

const index_get$7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$6
}, Symbol.toStringTag, { value: 'Module' }));

const index_post$6 = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.tacheId || !body.typeDemande || !body.motif) {
    throw createError({ statusCode: 400, statusMessage: "Champs requis manquants (tacheId, typeDemande, motif)" });
  }
  if (body.typeDemande !== "MODIFICATION" && body.typeDemande !== "SUPPRESSION") {
    throw createError({ statusCode: 400, statusMessage: "typeDemande doit \xEAtre MODIFICATION ou SUPPRESSION" });
  }
  const task = await prisma.tache.findUnique({
    where: { id: body.tacheId }
  });
  if (!task) {
    throw createError({ statusCode: 404, statusMessage: "T\xE2che introuvable" });
  }
  let stringifiedDonneesModif = null;
  if (body.typeDemande === "MODIFICATION" && body.donneesModif) {
    stringifiedDonneesModif = JSON.stringify(body.donneesModif);
  }
  const demande = await prisma.demandeTache.create({
    data: {
      tacheId: body.tacheId,
      typeDemande: body.typeDemande,
      motif: body.motif,
      donneesModif: stringifiedDonneesModif,
      statut: "EN_ATTENTE"
    }
  });
  return demande;
});

const index_post$7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post$6
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$4 = defineEventHandler(async (event) => {
  const query = getQuery$1(event);
  const where = {};
  if (query.employeId) where.employeId = query.employeId;
  if (query.editionId) where.editionId = query.editionId;
  if (query.statutTacheId) where.statutTacheId = query.statutTacheId;
  if (query.typeTache) {
    const types = query.typeTache.split(",");
    if (types.length === 1) {
      where.typeTache = types[0];
    } else {
      where.typeTache = { in: types };
    }
  }
  if (query.departementNom) {
    where.employe = {
      poste: {
        departement: {
          nom_departement: query.departementNom
        }
      }
    };
  }
  return await prisma.tache.findMany({
    where,
    include: {
      employe: true,
      edition: {
        include: { licence: true, ville: true }
      },
      statutTache: true,
      themePub: true,
      themeSponso: true
    },
    orderBy: { date_limite: "asc" }
  });
});

const index_get$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$4
}, Symbol.toStringTag, { value: 'Module' }));

const index_post$4 = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const optionalFields = [
    "plateforme",
    "type_pub",
    "type_demarche",
    "themePubId",
    "themeSponsoId",
    "budget",
    "audience",
    "format_video",
    "duree_cible",
    "type_visuel",
    "quantite",
    "type_technique",
    "date_demande",
    "date_resultat",
    "outil_mailing",
    "demandeur",
    "description",
    "lien_livrable",
    "editionId"
  ];
  for (const key of optionalFields) {
    if (body[key] === "" || body[key] === void 0) body[key] = null;
  }
  if (!body.titre || !body.employeId || !body.statutTacheId || !body.date_limite) {
    throw createError({ statusCode: 400, statusMessage: "Champs obligatoires manquants" });
  }
  const resolveTypeTache = () => {
    const t = body.typeTache || "";
    if (t === "MONTEUR" || body.format_video || body.duree_cible || body.demandeur) return "MONTEUR";
    if (t === "DESIGNER" || body.type_visuel || body.quantite) return "DESIGNER";
    if (t === "DEV" || body.type_technique) return "DEV";
    if (t === "Publication" || body.plateforme && body.type_pub) return "PUBLICATION";
    if (t === "Sponsorisation (Ads)" || body.themeSponsoId || body.budget && !body.outil_mailing) return "SPONSORISATION";
    if (t === "D\xE9marche Administrative" || body.type_demarche) return "ADMINISTRATIVE";
    if (t === "Mailing (Newsletter)" || body.outil_mailing) return "MAILING";
    return "PUBLICATION";
  };
  const data = {
    typeTache: resolveTypeTache(),
    titre: body.titre,
    description: body.description,
    date_limite: new Date(body.date_limite),
    employeId: body.employeId,
    editionId: body.editionId,
    statutTacheId: body.statutTacheId,
    plateforme: body.plateforme,
    type_pub: body.type_pub,
    type_demarche: body.type_demarche,
    themePubId: body.themePubId,
    themeSponsoId: body.themeSponsoId,
    budget: body.budget ? parseFloat(body.budget) : null,
    audience: body.audience,
    format_video: body.format_video,
    duree_cible: body.duree_cible,
    type_visuel: body.type_visuel,
    quantite: body.quantite ? parseInt(body.quantite) : null,
    type_technique: body.type_technique,
    date_demande: body.date_demande ? new Date(body.date_demande) : null,
    date_resultat: body.date_resultat ? new Date(body.date_resultat) : null,
    outil_mailing: body.outil_mailing,
    demandeur: body.demandeur
  };
  if (body.id) {
    return await prisma.tache.update({
      where: { id: body.id },
      data
    });
  } else {
    console.log("--- CREATING TACHE ---");
    console.log(data);
    return await prisma.tache.create({ data });
  }
});

const index_post$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post$4
}, Symbol.toStringTag, { value: 'Module' }));

const statuts_get = defineEventHandler(async (event) => {
  const statuts = await prisma.statutTache.findMany();
  const details = {
    "\xC0 faire": { couleur: "#64748b", niveau_progression: 0 },
    "En cours": { couleur: "#3b82f6", niveau_progression: 1 },
    "En attente": { couleur: "#f59e0b", niveau_progression: 2 },
    "Termin\xE9": { couleur: "#10b981", niveau_progression: 3 },
    "Publi\xE9": { couleur: "#8b5cf6", niveau_progression: 4 }
  };
  return statuts.map((s) => {
    var _a, _b;
    return {
      ...s,
      nom: s.libelle,
      // Alias pour le frontend
      couleur: ((_a = details[s.libelle]) == null ? void 0 : _a.couleur) || "#64748b",
      niveau_progression: ((_b = details[s.libelle]) == null ? void 0 : _b.niveau_progression) || 0
    };
  }).sort((a, b) => a.niveau_progression - b.niveau_progression);
});

const statuts_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: statuts_get
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$2 = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "ID manquant" });
  try {
    await prisma.theme.delete({
      where: { id }
    });
    return { success: true };
  } catch (e) {
    throw createError({ statusCode: 500, statusMessage: "Impossible de supprimer (d\xE9pendances existantes ?)" });
  }
});

const _id__delete$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$2
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$2 = defineEventHandler(async (event) => {
  return await prisma.theme.findMany({
    orderBy: { nom_theme: "asc" }
  });
});

const index_get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$2
}, Symbol.toStringTag, { value: 'Module' }));

const index_post$2 = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.nom_theme) {
    throw createError({ statusCode: 400, statusMessage: "Nom du th\xE8me requis" });
  }
  if (body.id) {
    return await prisma.theme.update({
      where: { id: body.id },
      data: { nom_theme: body.nom_theme }
    });
  } else {
    return await prisma.theme.create({
      data: { nom_theme: body.nom_theme }
    });
  }
});

const index_post$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post$2
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "ID manquant" });
  try {
    await prisma.ville.delete({
      where: { id }
    });
    return { success: true };
  } catch (e) {
    throw createError({ statusCode: 500, statusMessage: "Impossible de supprimer (d\xE9pendances existantes ?)" });
  }
});

const _id__delete$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete
}, Symbol.toStringTag, { value: 'Module' }));

const index_get = defineEventHandler(async (event) => {
  return await prisma.ville.findMany({
    orderBy: { nom_ville: "asc" }
  });
});

const index_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get
}, Symbol.toStringTag, { value: 'Module' }));

const index_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.nom_ville) {
    throw createError({ statusCode: 400, statusMessage: "Nom de ville requis" });
  }
  return await prisma.ville.create({
    data: {
      nom_ville: body.nom_ville
    }
  });
});

const index_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post
}, Symbol.toStringTag, { value: 'Module' }));

function renderPayloadResponse(ssrContext) {
	return {
		body: encodeForwardSlashes(stringify(splitPayload(ssrContext).payload, ssrContext["~payloadReducers"])) ,
		statusCode: getResponseStatus(ssrContext.event),
		statusMessage: getResponseStatusText(ssrContext.event),
		headers: {
			"content-type": "application/json;charset=utf-8" ,
			"x-powered-by": "Nuxt"
		}
	};
}
function renderPayloadJsonScript(opts) {
	const contents = opts.data ? encodeForwardSlashes(stringify(opts.data, opts.ssrContext["~payloadReducers"])) : "";
	const payload = {
		"type": "application/json",
		"innerHTML": contents,
		"data-nuxt-data": appId,
		"data-ssr": !(opts.ssrContext.noSSR)
	};
	{
		payload.id = "__NUXT_DATA__";
	}
	if (opts.src) {
		payload["data-src"] = opts.src;
	}
	const config = uneval(opts.ssrContext.config);
	return [payload, { innerHTML: `window.__NUXT__={};window.__NUXT__.config=${config}` }];
}

function encodeForwardSlashes(str) {
	return str.replaceAll("/", "\\u002F");
}
function splitPayload(ssrContext) {
	const { data, prerenderedAt, ...initial } = ssrContext.payload;
	return {
		initial: {
			...initial,
			prerenderedAt
		},
		payload: {
			data,
			prerenderedAt
		}
	};
}

const renderSSRHeadOptions = {"omitLineBreaks":false};

// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__buildAssetsURL = buildAssetsURL;
// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__publicAssetsURL = publicAssetsURL;
const HAS_APP_TELEPORTS = !!(appTeleportAttrs.id);
const APP_TELEPORT_OPEN_TAG = HAS_APP_TELEPORTS ? `<${appTeleportTag}${propsToString(appTeleportAttrs)}>` : "";
const APP_TELEPORT_CLOSE_TAG = HAS_APP_TELEPORTS ? `</${appTeleportTag}>` : "";
const PAYLOAD_URL_RE = /^[^?]*\/_payload.json(?:\?.*)?$/ ;
const PAYLOAD_FILENAME = "_payload.json" ;
const handler = defineRenderHandler((event) => {
	
	const ssrError = event.path.startsWith("/__nuxt_error") ? getQuery$1(event) : null;
	if (ssrError && !("__unenv__" in event.node.req)) {
		throw createError({
			status: 404,
			statusText: "Page Not Found: /__nuxt_error",
			message: "Page Not Found: /__nuxt_error"
		});
	}
	return renderRoute(event, ssrError);
});
async function renderRoute(event, ssrError) {
	const nitroApp = useNitroApp();
	
	const ssrContext = createSSRContext(event);
	
	const headEntryOptions = { mode: "server" };
	ssrContext.head.push(appHead, headEntryOptions);
	if (ssrError) {
		
		const status = ssrError.status || ssrError.statusCode;
		if (status) {
			
			ssrError.status = ssrError.statusCode = Number.parseInt(status);
		}
		setSSRError(ssrContext, ssrError);
	}
	
	const routeOptions = getRouteRules(event);
	
	const _PAYLOAD_EXTRACTION = !ssrContext.noSSR && (NUXT_RUNTIME_PAYLOAD_EXTRACTION);
	const isRenderingPayload = (_PAYLOAD_EXTRACTION || routeOptions.prerender) && PAYLOAD_URL_RE.test(ssrContext.url);
	if (isRenderingPayload) {
		const url = ssrContext.url.substring(0, ssrContext.url.lastIndexOf("/")) || "/";
		ssrContext.url = url;
		event._path = event.node.req.url = url;
	}
	if (routeOptions.ssr === false) {
		ssrContext.noSSR = true;
	}
	const payloadURL = _PAYLOAD_EXTRACTION ? joinURL(ssrContext.runtimeConfig.app.cdnURL || ssrContext.runtimeConfig.app.baseURL, ssrContext.url.replace(/\?.*$/, ""), PAYLOAD_FILENAME) + "?" + ssrContext.runtimeConfig.app.buildId : undefined;
	
	const renderer = await getRenderer(ssrContext);
	const _rendered = await renderer.renderToString(ssrContext).catch(async (error) => {
		
		
		if ((ssrContext["~renderResponse"] || ssrContext._renderResponse) && error.message === "skipping render") {
			return {};
		}
		
		const _err = !ssrError && ssrContext.payload?.error || error;
		await ssrContext.nuxt?.hooks.callHook("app:error", _err);
		throw _err;
	});
	
	
	const inlinedStyles = [];
	await ssrContext.nuxt?.hooks.callHook("app:rendered", {
		ssrContext,
		renderResult: _rendered
	});
	if (ssrContext["~renderResponse"] || ssrContext._renderResponse) {
		
		return ssrContext["~renderResponse"] || ssrContext._renderResponse;
	}
	
	if (ssrContext.payload?.error && !ssrError) {
		throw ssrContext.payload.error;
	}
	
	if (isRenderingPayload) {
		const response = renderPayloadResponse(ssrContext);
		return response;
	}
	const NO_SCRIPTS = routeOptions.noScripts;
	
	const { styles, scripts } = getRequestDependencies(ssrContext, renderer.rendererContext);
	
	if (_PAYLOAD_EXTRACTION && !NO_SCRIPTS) {
		ssrContext.head.push({ link: [{
			rel: "preload",
			as: "fetch",
			crossorigin: "anonymous",
			href: payloadURL
		} ] }, headEntryOptions);
	}
	if (ssrContext["~preloadManifest"] && !NO_SCRIPTS) {
		ssrContext.head.push({ link: [{
			rel: "preload",
			as: "fetch",
			fetchpriority: "low",
			crossorigin: "anonymous",
			href: buildAssetsURL(`builds/meta/${ssrContext.runtimeConfig.app.buildId}.json`)
		}] }, {
			...headEntryOptions,
			tagPriority: "low"
		});
	}
	
	if (inlinedStyles.length) {
		ssrContext.head.push({ style: inlinedStyles });
	}
	const link = [];
	for (const resource of Object.values(styles)) {
		
		if ("inline" in getQuery(resource.file)) {
			continue;
		}
		
		
		
		link.push({
			rel: "stylesheet",
			href: renderer.rendererContext.buildAssetsURL(resource.file),
			crossorigin: ""
		});
	}
	if (link.length) {
		ssrContext.head.push({ link }, headEntryOptions);
	}
	if (!NO_SCRIPTS) {
		
		
		
		if (ssrContext["~lazyHydratedModules"]) {
			for (const id of ssrContext["~lazyHydratedModules"]) {
				ssrContext.modules?.delete(id);
			}
		}
		
		ssrContext.head.push({ link: getPreloadLinks(ssrContext, renderer.rendererContext) }, headEntryOptions);
		ssrContext.head.push({ link: getPrefetchLinks(ssrContext, renderer.rendererContext) }, headEntryOptions);
		
		ssrContext.head.push({ script: _PAYLOAD_EXTRACTION ? renderPayloadJsonScript({
			ssrContext,
			data: splitPayload(ssrContext).initial,
			src: payloadURL
		})  : renderPayloadJsonScript({
			ssrContext,
			data: ssrContext.payload
		})  }, {
			...headEntryOptions,
			
			tagPosition: "bodyClose",
			tagPriority: "high"
		});
	}
	
	if (!routeOptions.noScripts) {
		const tagPosition = "head";
		ssrContext.head.push({ script: Object.values(scripts).map((resource) => ({
			type: resource.module ? "module" : null,
			src: renderer.rendererContext.buildAssetsURL(resource.file),
			defer: resource.module ? null : true,
			
			
			tagPosition,
			crossorigin: ""
		})) }, headEntryOptions);
	}
	const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = await renderSSRHead(ssrContext.head, renderSSRHeadOptions);
	
	const htmlContext = {
		htmlAttrs: htmlAttrs ? [htmlAttrs] : [],
		head: normalizeChunks([headTags]),
		bodyAttrs: bodyAttrs ? [bodyAttrs] : [],
		bodyPrepend: normalizeChunks([bodyTagsOpen, ssrContext.teleports?.body]),
		body: [replaceIslandTeleports(ssrContext, _rendered.html) , APP_TELEPORT_OPEN_TAG + (HAS_APP_TELEPORTS ? joinTags([ssrContext.teleports?.[`#${appTeleportAttrs.id}`]]) : "") + APP_TELEPORT_CLOSE_TAG],
		bodyAppend: [bodyTags]
	};
	
	await nitroApp.hooks.callHook("render:html", htmlContext, { event });
	
	return {
		body: renderHTMLDocument(htmlContext),
		statusCode: getResponseStatus(event),
		statusMessage: getResponseStatusText(event),
		headers: {
			"content-type": "text/html;charset=utf-8",
			"x-powered-by": "Nuxt"
		}
	};
}
function normalizeChunks(chunks) {
	const result = [];
	for (const _chunk of chunks) {
		const chunk = _chunk?.trim();
		if (chunk) {
			result.push(chunk);
		}
	}
	return result;
}
function joinTags(tags) {
	return tags.join("");
}
function joinAttrs(chunks) {
	if (chunks.length === 0) {
		return "";
	}
	return " " + chunks.join(" ");
}
function renderHTMLDocument(html) {
	return "<!DOCTYPE html>" + `<html${joinAttrs(html.htmlAttrs)}>` + `<head>${joinTags(html.head)}</head>` + `<body${joinAttrs(html.bodyAttrs)}>${joinTags(html.bodyPrepend)}${joinTags(html.body)}${joinTags(html.bodyAppend)}</body>` + "</html>";
}

const renderer = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: handler
}, Symbol.toStringTag, { value: 'Module' }));
//# sourceMappingURL=index.mjs.map
