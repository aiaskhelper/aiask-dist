// ==UserScript==
// @name         爱问答 · 网课学习助手
// @namespace    aiask
// @version      3.3.2
// @author       爱问答
// @description  全平台网课答题助手，一键解析当前页面试题并获取答案，支持作业 / 考试 / 章节测验的自动收录与答题，视频与文档等课程学习任务自动推进。已适配【超星学习通、168 网校、湖北自考助学平台、江苏开放大学】，更多平台持续适配中...
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByb2xlPSJpbWciIGFyaWEtbGFiZWw9IueIsemXruetlCI+CiAgPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTAiIGZpbGw9IiNDNzM5MUIiLz4KICA8cmVjdCB4PSIzLjUiIHk9IjMuNSIgd2lkdGg9IjU3IiBoZWlnaHQ9IjU3IiByeD0iNy41IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjU1IiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSIzMiIgeT0iMzMiIGZpbGw9IiNmZmYiIGZvbnQtZmFtaWx5PSJTb25ndGkgU0MsIE5vdG8gU2VyaWYgU0MsIFNpbVN1biwgc2VyaWYiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj7pl648L3RleHQ+Cjwvc3ZnPgo=
// @homepage     https://www.aiask.site/
// @supportURL   https://www.aiask.site/contact.html
// @match        *://*.chaoxing.com/*
// @match        *://xatu.168wangxiao.com/*
// @match        *://ctapp.hubuzkw.com/*
// @match        *://xuexi.jsou.cn/*
// @match        https://www.aiask.site/import.html
// @match        https://www.aiask.site/import
// @match        https://www.aiask.site/feedback.html
// @match        https://www.aiask.site/feedback
// @require      https://registry.npmmirror.com/vue/3.5.39/files/dist/vue.global.prod.js
// @require      https://www.aiask.site/engine/aiask-engine-52539fd9fa208db4.js#sha256=52539fd9fa208db4e6c12fdd868561387f570a52c1593f46e5c5919646e3754c
// @resource     chaoxingFontTable  https://www.aiask.site/assets/chaoxing-font-table.json
// @connect      www.aiask.site
// @connect      cx.icodef.com
// @grant        GM_deleteValue
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @antifeature  payment   部分答案需消耗积分
// @antifeature  tracking  匿名上报故障诊断，可关闭
// ==/UserScript==

(function (protocol, core, vue) {
  'use strict';

  /*! typr.js 1.0.0 (MIT) https://github.com/photopea/Typr.js */
  var __defProp = Object.defineProperty;

  var __typeError = msg => {
    throw TypeError(msg);
  };

  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: value
  }) : obj[key] = value;

  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);

  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), 
  getter ? getter.call(obj) : member.get(obj));

  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);

  var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), 
  member.set(obj, value), value);

  var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), 
  method);

  var _deps, _pending, _dropped, _timer, _sending, _enabled, _EventQueue_instances, arm_fn, cancel_fn, trim_fn, envelope_fn, take_fn, flush_fn, send_fn;

  const REQUIRED_GLOBALS = [ "Vue", "AiaskEngine.core", "AiaskEngine.protocol" ];

  const LABEL = {
    Vue: "Vue",
    "AiaskEngine.core": "\u5f15\u64ce",
    "AiaskEngine.protocol": "\u5f15\u64ce"
  };

  function probe() {
    const engine = typeof AiaskEngine === "undefined" ? void 0 : AiaskEngine;
    return {
      Vue: typeof Vue !== "undefined",
      "AiaskEngine.core": (engine == null ? void 0 : engine.core) != null,
      "AiaskEngine.protocol": (engine == null ? void 0 : engine.protocol) != null
    };
  }

  function missingGlobals(present) {
    return REQUIRED_GLOBALS.filter(key => !present[key]);
  }

  function mountMissingBanner(doc, missing) {
    const labels = [ ...new Set(missing.map(key => LABEL[key])) ].join("\u3001");
    const mount = () => {
      if (doc.querySelector("[data-aiask-engine-guard]")) return;
      const bar = doc.createElement("div");
      bar.setAttribute("data-aiask-engine-guard", "");
      bar.setAttribute("style", "position:fixed;top:0;left:0;right:0;z-index:2147483647;padding:10px 16px;background:#c7391b;color:#fff;font:14px/1.5 system-ui,sans-serif;text-align:center");
      bar.textContent = `\u7231\u95ee\u7b54\uff1a\u811a\u672c\u4f9d\u8d56\u672a\u80fd\u52a0\u8f7d\uff08\u7f3a ${labels}\uff09\uff0c\u8bf7\u68c0\u67e5\u7f51\u7edc\u540e\u91cd\u65b0\u5b89\u88c5\u811a\u672c\u3002`;
      const link = doc.createElement("a");
      link.href = "https://www.aiask.site/";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("style", "color:#fff;text-decoration:underline;margin-left:8px");
      link.textContent = "\u5b98\u7f51";
      bar.append(link);
      (doc.body ?? doc.documentElement).append(bar);
    };
    if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", mount, {
      once: true
    }); else mount();
  }

  function assertEngineGlobals(input) {
    const missing = missingGlobals(input.present);
    if (missing.length === 0) return;
    if (input.doc) mountMissingBanner(input.doc, missing);
    throw new Error(`aiask: missing ${missing.join(", ")}`);
  }

  assertEngineGlobals({
    present: probe(),
    doc: typeof document === "undefined" ? void 0 : document
  });

  var _GM_deleteValue = (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();

  var _GM_getResourceText = (() => typeof GM_getResourceText != "undefined" ? GM_getResourceText : void 0)();

  var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();

  var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();

  var _GM_xmlhttpRequest = (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();

  const DEFAULT_BACKEND_BASE_URL = "https://www.aiask.site";

  const BACKEND_BASE_URL = DEFAULT_BACKEND_BASE_URL;

  const IS_DEFAULT_BACKEND = BACKEND_BASE_URL === DEFAULT_BACKEND_BASE_URL;

  const SCRIPT_VERSION = "3.3.2";

  const ENGINE_ID = "52539fd9fa208db4";

  const DEFAULT_ROOT_PUBLIC_JWK = protocol.PRODUCTION_ROOT_PUBLIC_JWK;

  function resolveRootPublicJwk() {
    return DEFAULT_ROOT_PUBLIC_JWK;
  }

  const SECURITY_ROOT_PUBLIC_JWK = resolveRootPublicJwk();

  const CHA0XING_FONT_TABLE_MD5 = "87594bb90a8153dd8fbe69683c451b1c";

  function parseChaoxingFontTable(raw) {
    if (!raw || core.cxFontMd5(raw) !== CHA0XING_FONT_TABLE_MD5) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") return null;
      const table = Object.fromEntries(Object.entries(parsed).filter(([, value]) => typeof value === "number"));
      return Object.keys(table).length === 20902 ? table : null;
    } catch {
      return null;
    }
  }

  const LOCAL_ANSWER_CACHE_KEY = "aiask_local_answers_v1";

  const CACHE_WARN_ENTRIES = 5e3;

  const HASH_PATTERN$1 = /^[0-9a-f]{64}$/;

  const MAX_VALUES = 64;

  const MAX_OPTIONS = 64;

  const HIT_PERSIST_INTERVAL_MS = 6e4;

  function laterOf(a, b) {
    return Math.max(a ?? 0, b ?? 0) || void 0;
  }

  const TOMBSTONE_TTL_MS = 30 * 24 * 60 * 60 * 1e3;

  function parseOptions(input) {
    if (!Array.isArray(input) || input.length === 0) return void 0;
    if (input.length > MAX_OPTIONS) return void 0;
    const options = [];
    for (const option of input) {
      if (typeof option !== "string" || !option.trim()) return void 0;
      options.push(option);
    }
    return options;
  }

  function parseEntry(input) {
    if (!input || typeof input !== "object") return null;
    const raw = input;
    const values = raw.values;
    if (!Array.isArray(values) || values.length === 0 || values.length > MAX_VALUES) return null;
    const normalized = [];
    for (const value of values) {
      if (typeof value !== "string" || !value.trim()) return null;
      normalized.push(value);
    }
    const text = key => typeof raw[key] === "string" && raw[key] ? String(raw[key]) : void 0;
    const stamp = key => {
      const at = raw[key];
      return typeof at === "number" && at > 0 ? at : void 0;
    };
    return {
      values: normalized,
      stem: text("stem"),
      itemType: text("itemType"),
      platform: text("platform"),
      options: parseOptions(raw.options),
      savedAt: stamp("savedAt"),
      importedAt: stamp("importedAt"),
      lastHitAt: stamp("lastHitAt")
    };
  }

  function parseSnapshot$1(input) {
    const entries = new Map;
    const tombstones = new Map;
    if (!input || typeof input !== "object") return {
      entries: entries,
      tombstones: tombstones,
      clearedAt: 0
    };
    const snapshot = input;
    if (Array.isArray(snapshot.entries)) for (const item of snapshot.entries) {
      if (!Array.isArray(item) || item.length !== 2) continue;
      const [key, value] = item;
      if (typeof key !== "string" || !HASH_PATTERN$1.test(key)) continue;
      const parsed = parseEntry(value);
      if (parsed) entries.set(key, parsed);
    }
    if (Array.isArray(snapshot.tombstones)) for (const item of snapshot.tombstones) {
      if (!Array.isArray(item) || item.length !== 2) continue;
      const [key, at] = item;
      if (typeof key !== "string" || !HASH_PATTERN$1.test(key)) continue;
      if (typeof at !== "number" || !(at > 0)) continue;
      tombstones.set(key, at);
    }
    const clearedAt = snapshot.clearedAt;
    return {
      entries: entries,
      tombstones: tombstones,
      clearedAt: typeof clearedAt === "number" && clearedAt > 0 ? clearedAt : 0
    };
  }

  class LocalAnswerCache {
    constructor(storage) {
      __publicField(this, "entries");
      __publicField(this, "platform", "");
      __publicField(this, "removedAt", new Map);
      __publicField(this, "clearedAt", 0);
      __publicField(this, "persistFailed", false);
      __publicField(this, "lastWrite", null);
      __publicField(this, "lastHitPersistAt", 0);
      __publicField(this, "hitsPendingPersist", false);
      this.storage = storage;
      let loaded;
      try {
        loaded = parseSnapshot$1(this.storage.get(LOCAL_ANSWER_CACHE_KEY));
      } catch {
        loaded = {
          entries: new Map,
          tombstones: new Map,
          clearedAt: 0
        };
      }
      this.entries = loaded.entries;
      this.removedAt = loaded.tombstones;
      this.clearedAt = loaded.clearedAt;
    }
    setPlatform(label) {
      this.platform = label;
    }
    read(unitHash) {
      const stored = this.entries.get(unitHash);
      if (!stored) return null;
      this.entries.delete(unitHash);
      this.entries.set(unitHash, stored);
      const now = Date.now();
      stored.lastHitAt = now;
      if (now - this.lastHitPersistAt > HIT_PERSIST_INTERVAL_MS) {
        this.lastHitPersistAt = now;
        this.persist();
      } else this.hitsPendingPersist = true;
      return {
        values: [ ...stored.values ],
        ...stored.itemType ? {
          itemType: stored.itemType
        } : {}
      };
    }
    write(unitHash, hit, meta) {
      if (!HASH_PATTERN$1.test(unitHash)) return false;
      const prev = this.entries.get(unitHash);
      const parsed = parseEntry({
        ...hit,
        stem: (meta == null ? void 0 : meta.stem) ?? (prev == null ? void 0 : prev.stem),
        itemType: (meta == null ? void 0 : meta.itemType) ?? (prev == null ? void 0 : prev.itemType),
        platform: (meta == null ? void 0 : meta.platform) ?? (this.platform || (prev == null ? void 0 : prev.platform)),
        options: (meta == null ? void 0 : meta.options) ?? (prev == null ? void 0 : prev.options),
        savedAt: Date.now(),
        importedAt: prev == null ? void 0 : prev.importedAt,
        lastHitAt: prev == null ? void 0 : prev.lastHitAt
      });
      if (!parsed) return false;
      this.entries.delete(unitHash);
      this.entries.set(unitHash, parsed);
      this.removedAt.delete(unitHash);
      this.persist();
      return true;
    }
    list() {
      return [ ...this.entries ].map(([unitHash, stored]) => ({
        unitHash: unitHash,
        values: [ ...stored.values ],
        stem: stored.stem ?? "",
        itemType: stored.itemType ?? "",
        platform: stored.platform ?? "",
        options: stored.options ? [ ...stored.options ] : [],
        savedAt: stored.savedAt ?? 0,
        importedAt: stored.importedAt ?? 0,
        lastHitAt: stored.lastHitAt ?? 0
      })).reverse();
    }
    remove(unitHash) {
      if (this.entries.delete(unitHash)) {
        this.removedAt.set(unitHash, Date.now());
        this.persist();
      }
    }
    size() {
      return this.entries.size;
    }
    flush() {
      if (this.hitsPendingPersist) this.persist();
    }
    reload() {
      this.flush();
      let loaded;
      try {
        loaded = parseSnapshot$1(this.storage.get(LOCAL_ANSWER_CACHE_KEY));
      } catch {
        return;
      }
      this.entries.clear();
      for (const [key, value] of loaded.entries) this.entries.set(key, value);
      this.removedAt = loaded.tombstones;
      this.clearedAt = loaded.clearedAt;
    }
    hasPersistFailure() {
      return this.persistFailed;
    }
    clear() {
      this.entries.clear();
      this.removedAt.clear();
      this.clearedAt = Date.now();
      this.persist();
    }
    exportJson() {
      return JSON.stringify(this.snapshot(false), null, 2);
    }
    previewImport(text) {
      const {incoming: incoming, rawCount: rawCount} = this.parseImport(text);
      let added = 0;
      let replaced = 0;
      for (const key of incoming.keys()) {
        if (this.entries.has(key)) replaced += 1; else added += 1;
      }
      return {
        fileCount: incoming.size,
        added: added,
        replaced: replaced,
        skipped: rawCount - incoming.size,
        total: this.entries.size + added
      };
    }
    parseImport(text) {
      var _a;
      const parsedRaw = JSON.parse(text);
      return {
        incoming: parseSnapshot$1(parsedRaw).entries,
        rawCount: ((_a = parsedRaw.entries) == null ? void 0 : _a.length) ?? 0
      };
    }
    importJson(text) {
      const {incoming: incoming, rawCount: rawCount} = this.parseImport(text);
      let added = 0;
      let replaced = 0;
      for (const [key, value] of incoming) {
        const prev = this.entries.get(key);
        if (prev) {
          replaced += 1;
          this.entries.delete(key);
        } else {
          added += 1;
        }
        this.entries.set(key, {
          ...value,
          importedAt: laterOf(value.importedAt, prev == null ? void 0 : prev.importedAt),
          lastHitAt: laterOf(value.lastHitAt, prev == null ? void 0 : prev.lastHitAt)
        });
        this.removedAt.delete(key);
      }
      this.persist();
      this.verifyLastPersist();
      return {
        added: added,
        replaced: replaced,
        skipped: rawCount - incoming.size,
        total: this.entries.size
      };
    }
    verifyLastPersist() {
      if (!this.lastWrite) return;
      try {
        if (this.judgeLastWrite(parseSnapshot$1(this.storage.get(LOCAL_ANSWER_CACHE_KEY))) === "lost") this.persistFailed = true;
      } catch {}
    }
    snapshot(withTombstones) {
      const entries = [ ...this.entries ].map(([key, value]) => [ key, value ]);
      if (!withTombstones) return {
        v: 4,
        entries: entries
      };
      const alive = Date.now() - TOMBSTONE_TTL_MS;
      return {
        v: 4,
        entries: entries,
        tombstones: [ ...this.removedAt ].filter(([, at]) => at > alive),
        clearedAt: this.clearedAt
      };
    }
    mergeFromDisk() {
      let disk;
      try {
        disk = parseSnapshot$1(this.storage.get(LOCAL_ANSWER_CACHE_KEY));
      } catch {
        return "unknown";
      }
      const verdict = this.judgeLastWrite(disk);
      this.clearedAt = Math.max(this.clearedAt, disk.clearedAt);
      for (const [key, at] of disk.tombstones) if (at > (this.removedAt.get(key) ?? 0)) this.removedAt.set(key, at);
      for (const [key, mine] of this.entries) {
        const savedAt = mine.savedAt ?? 0;
        const removedAt = this.removedAt.get(key);
        const shadowed = this.clearedAt > 0 && savedAt <= this.clearedAt || removedAt !== void 0 && savedAt <= removedAt;
        if (shadowed) this.entries.delete(key);
      }
      for (const [key, value] of disk.entries) {
        const savedAt = value.savedAt ?? 0;
        if (savedAt <= this.clearedAt) continue;
        const removedAt = this.removedAt.get(key);
        if (removedAt !== void 0 && savedAt <= removedAt) continue;
        const mine = this.entries.get(key);
        const importedAt = laterOf(value.importedAt, mine == null ? void 0 : mine.importedAt);
        const lastHitAt = laterOf(value.lastHitAt, mine == null ? void 0 : mine.lastHitAt);
        if (mine && (mine.savedAt ?? 0) >= savedAt) {
          mine.importedAt = importedAt;
          mine.lastHitAt = lastHitAt;
          continue;
        }
        this.entries.delete(key);
        this.entries.set(key, {
          ...value,
          importedAt: importedAt,
          lastHitAt: lastHitAt
        });
        this.removedAt.delete(key);
      }
      return verdict;
    }
    judgeLastWrite(disk) {
      const sentinel = this.lastWrite;
      if (!sentinel) return "unknown";
      const onDisk = disk.entries.get(sentinel.key);
      if (onDisk && (onDisk.savedAt ?? 0) >= sentinel.savedAt) return "landed";
      const removedAt = disk.tombstones.get(sentinel.key) ?? 0;
      if (removedAt >= sentinel.savedAt || disk.clearedAt >= sentinel.savedAt) return "landed";
      return "lost";
    }
    newestWrite() {
      let best = null;
      for (const [key, value] of this.entries) {
        const savedAt = value.savedAt ?? 0;
        if (savedAt > 0 && (!best || savedAt > best.savedAt)) best = {
          key: key,
          savedAt: savedAt
        };
      }
      return best;
    }
    persist() {
      this.hitsPendingPersist = false;
      try {
        const verdict = this.mergeFromDisk();
        this.storage.set(LOCAL_ANSWER_CACHE_KEY, this.snapshot(true));
        this.lastWrite = this.newestWrite();
        this.persistFailed = verdict === "lost";
      } catch {
        this.persistFailed = true;
      }
    }
  }

  const PANEL_POSITION_KEY = "aiask_panel_position";

  const PANEL_VIEWPORT_MARGIN = 16;

  function parsePanelPositionSnapshot(input) {
    if (input === null || typeof input !== "object" || Array.isArray(input)) {
      return null;
    }
    const record = input;
    if (record.schemaVersion !== 1) {
      return null;
    }
    const {x: x, y: y} = record;
    if (typeof x !== "number" || typeof y !== "number") {
      return null;
    }
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      return null;
    }
    return {
      x: Math.round(x),
      y: Math.round(y)
    };
  }

  function createPanelPositionSnapshot(position) {
    return {
      schemaVersion: 1,
      x: Math.round(position.x),
      y: Math.round(position.y)
    };
  }

  function loadPanelPosition(storage) {
    const raw = storage.get(PANEL_POSITION_KEY);
    const parsed = parsePanelPositionSnapshot(raw);
    if (parsed === null) {
      storage.delete(PANEL_POSITION_KEY);
      return null;
    }
    return parsed;
  }

  function savePanelPosition(storage, position) {
    storage.set(PANEL_POSITION_KEY, createPanelPositionSnapshot(position));
  }

  function axisRange(free, margin) {
    const max = free >= 2 * margin ? free - margin : free;
    const min = free >= 2 * margin ? margin : 0;
    return {
      min: min,
      max: max
    };
  }

  function clampAxis(value, free, margin) {
    const {min: min, max: max} = axisRange(free, margin);
    const rounded = Math.round(value);
    if (rounded < min) return Math.round(min);
    if (rounded > max) return Math.round(max);
    return rounded;
  }

  function clampPanelPosition(position, panel, viewport, margin = PANEL_VIEWPORT_MARGIN) {
    const freeX = Math.max(0, viewport.width - panel.width);
    const freeY = Math.max(0, viewport.height - panel.height);
    return {
      x: clampAxis(position.x, freeX, margin),
      y: clampAxis(position.y, freeY, margin)
    };
  }

  function remapAxis(value, fromFree, toFree, margin) {
    const from = axisRange(fromFree, margin);
    const to = axisRange(toFree, margin);
    const clamped = clampAxis(value, fromFree, margin);
    const ratio = from.max === from.min ? .5 : (clamped - from.min) / (from.max - from.min);
    return Math.round(to.min + ratio * (to.max - to.min));
  }

  function remapPanelPosition(position, fromPanel, toPanel, viewport, margin = PANEL_VIEWPORT_MARGIN) {
    return {
      x: remapAxis(position.x, Math.max(0, viewport.width - fromPanel.width), Math.max(0, viewport.width - toPanel.width), margin),
      y: remapAxis(position.y, Math.max(0, viewport.height - fromPanel.height), Math.max(0, viewport.height - toPanel.height), margin)
    };
  }

  function createBackendSecurityClient(options) {
    const deviceKeys = new core.DeviceKeyManager(options.storage);
    const sessions = new core.SecureSessionClient({
      transport: options.transport,
      baseUrl: options.baseUrl,
      deviceKeys: deviceKeys,
      stateStorage: options.storage,
      rootPublicJwks: [ options.rootPublicJwk ],
      clientVersion: options.clientVersion,
      requestedScope: options.requestedScope,
      inheritLegacyKeysetWatermark: IS_DEFAULT_BACKEND
    });
    return {
      sessions: sessions,
      transport: new core.SecureTransport({
        transport: options.transport,
        sessions: sessions,
        client: {
          app: "userscript",
          version: options.clientVersion
        },
        ...options.requestedScope === "user" && options.getAccessToken ? {
          getAccessToken: options.getAccessToken
        } : {}
      })
    };
  }

  const CHA0XING_FONT_TABLE_RESOURCE = "chaoxingFontTable";

  let chaoxingFontTable;

  let chaoxingFontTableStatusValue;

  const getChaoxingFontTable = () => {
    if (chaoxingFontTable !== void 0) return chaoxingFontTable ?? {};
    try {
      const raw = _GM_getResourceText(CHA0XING_FONT_TABLE_RESOURCE);
      chaoxingFontTable = parseChaoxingFontTable(raw);
      chaoxingFontTableStatusValue = chaoxingFontTable ? "ok" : raw ? "rejected" : "unavailable";
    } catch {
      chaoxingFontTable = null;
      chaoxingFontTableStatusValue = "unavailable";
    }
    return chaoxingFontTable ?? {};
  };

  const chaoxingFontTableStatus = () => {
    getChaoxingFontTable();
    return chaoxingFontTableStatusValue ?? "unavailable";
  };

  const gmTransport = {
    send(req) {
      return new Promise((resolve, reject) => {
        _GM_xmlhttpRequest({
          method: req.method,
          url: req.url,
          headers: req.headers,
          data: req.body,
          timeout: req.timeoutMs ?? 8e3,
          anonymous: true,
          onload: r => resolve({
            status: r.status,
            body: r.responseText
          }),
          ontimeout: () => reject(new Error("timeout")),
          onerror: e => reject(new Error(`xhr error: ${(e == null ? void 0 : e.error) ?? "unknown"}`))
        });
      });
    }
  };

  const TOKEN_KEY = "aiask_token";

  const getToken = () => _GM_getValue(TOKEN_KEY, "") || "";

  const setToken = t => _GM_setValue(TOKEN_KEY, t);

  const clearToken = () => _GM_setValue(TOKEN_KEY, "");

  const USERNAME_KEY = "aiask_username";

  const getUsername = () => _GM_getValue(USERNAME_KEY, "") || "";

  const setUsername = u => _GM_setValue(USERNAME_KEY, u);

  const CARD_SESSION_KEY = "aiask_card_session";

  const getCardSession = () => _GM_getValue(CARD_SESSION_KEY, false);

  const setCardSession = v => _GM_setValue(CARD_SESSION_KEY, v);

  const COLLAPSED_KEY = "aiask_panel_collapsed";

  const getCollapsed = () => _GM_getValue(COLLAPSED_KEY, true);

  const setCollapsed = v => _GM_setValue(COLLAPSED_KEY, v);

  const usageEventStorage = {
    get: key => _GM_getValue(key, null),
    set: (key, value) => _GM_setValue(key, value)
  };

  const panelPositionStorage = {
    get: key => _GM_getValue(key, null),
    set: (key, value) => _GM_setValue(key, value),
    delete: key => _GM_deleteValue(key)
  };

  const getPanelPosition = () => loadPanelPosition(panelPositionStorage);

  const setPanelPosition = position => savePanelPosition(panelPositionStorage, position);

  const localAnswerCache = new LocalAnswerCache({
    get: key => _GM_getValue(key, null),
    set: (key, value) => _GM_setValue(key, value)
  });

  const CLIENT_ID_KEY = "aiask_client_id";

  const getClientId = () => {
    let id = _GM_getValue(CLIENT_ID_KEY, "") || "";
    if (!id) {
      id = protocol.randomUuid();
      _GM_setValue(CLIENT_ID_KEY, id);
    }
    return id;
  };

  const SETTINGS_KEY = "aiask_settings";

  const DEFAULT_SETTINGS = {
    autoFill: true,
    delayMs: 1500,
    reportHealth: true,
    reportUsage: true,
    freeFirst: true,
    courseAuto: true,
    coursePlaybackRate: 1,
    courseTaskToggles: {
      media: true,
      "chapter-test": true,
      reading: true,
      hyperlink: true
    },
    autoStart: true,
    autoSubmit: true,
    autoSubmitThreshold: .8,
    randomFallback: false
  };

  const getSettings = () => {
    const raw = _GM_getValue(SETTINGS_KEY, null);
    return raw ? {
      ...DEFAULT_SETTINGS,
      ...raw,
      autoFill: true,
      courseTaskToggles: {
        ...DEFAULT_SETTINGS.courseTaskToggles,
        ...raw.courseTaskToggles ?? {}
      },
      reportUsage: raw.reportUsage ?? raw.reportHealth ?? DEFAULT_SETTINGS.reportUsage
    } : {
      ...DEFAULT_SETTINGS
    };
  };

  const setSettings = s => _GM_setValue(SETTINGS_KEY, s);

  const BALANCE_KEY = "aiask_last_balance";

  const getLastBalance = () => {
    const raw = _GM_getValue(BALANCE_KEY, null);
    return typeof raw === "number" && Number.isFinite(raw) ? raw : null;
  };

  const setLastBalance = n => _GM_setValue(BALANCE_KEY, n);

  const clearLastBalance = () => _GM_setValue(BALANCE_KEY, null);

  const ANNOUNCEMENT_READ_SEQ_KEY = "aiask_announcement_read_seq";

  const ANNOUNCEMENT_AUTO_OPENED_SEQ_KEY = "aiask_announcement_auto_opened_seq";

  const readAnnouncementSeq = key => {
    const raw = _GM_getValue(key, 0);
    return typeof raw === "number" && Number.isSafeInteger(raw) && raw >= 0 ? raw : 0;
  };

  const getAnnouncementReadSeq = () => readAnnouncementSeq(ANNOUNCEMENT_READ_SEQ_KEY);

  const setAnnouncementReadSeq = n => _GM_setValue(ANNOUNCEMENT_READ_SEQ_KEY, n);

  const getAnnouncementAutoOpenedSeq = () => readAnnouncementSeq(ANNOUNCEMENT_AUTO_OPENED_SEQ_KEY);

  const setAnnouncementAutoOpenedSeq = n => _GM_setValue(ANNOUNCEMENT_AUTO_OPENED_SEQ_KEY, n);

  const EVIDENCE_DAILY_LIMIT = 5;

  const EVIDENCE_QUOTA_KEY = "aiask_evidence_quota";

  const localDayKey = () => {
    const now = new Date;
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
  };

  const readEvidenceQuotaCount = day => {
    const raw = _GM_getValue(EVIDENCE_QUOTA_KEY, null);
    if (!raw || typeof raw !== "object") return 0;
    const blob = raw;
    if (blob.day !== day) return 0;
    const count = blob.count;
    if (typeof count !== "number" || !Number.isSafeInteger(count) || count < 0) return 0;
    return Math.min(count, EVIDENCE_DAILY_LIMIT);
  };

  const evidenceQuota = {
    today: () => readEvidenceQuotaCount(localDayKey()),
    bump: () => {
      const day = localDayKey();
      const count = Math.min(readEvidenceQuotaCount(day) + 1, EVIDENCE_DAILY_LIMIT);
      _GM_setValue(EVIDENCE_QUOTA_KEY, {
        day: day,
        count: count
      });
    }
  };

  const EVIDENCE_HANDLED_KEY = "aiask_evidence_handled";

  const readHandledEvidenceRequests = () => {
    const raw = _GM_getValue(EVIDENCE_HANDLED_KEY, null);
    if (!Array.isArray(raw)) return [];
    return raw.filter(id => typeof id === "string").slice(-32);
  };

  const handledEvidenceRequests = {
    has: id => readHandledEvidenceRequests().includes(id),
    add: id => {
      const kept = readHandledEvidenceRequests();
      if (kept.includes(id)) return;
      kept.push(id);
      _GM_setValue(EVIDENCE_HANDLED_KEY, kept.slice(-32));
    }
  };

  const gmSecurityStorage = {
    get: key => _GM_getValue(key, void 0),
    set: (key, value) => _GM_setValue(key, value),
    delete: key => _GM_deleteValue(key)
  };

  const gmRuleStorage = {
    get: key => _GM_getValue(key, void 0),
    set: (key, value) => _GM_setValue(key, value),
    delete: key => _GM_deleteValue(key)
  };

  const userSecurityClient = createBackendSecurityClient({
    transport: gmTransport,
    storage: gmSecurityStorage,
    getAccessToken: getToken,
    baseUrl: BACKEND_BASE_URL,
    rootPublicJwk: SECURITY_ROOT_PUBLIC_JWK,
    clientVersion: SCRIPT_VERSION,
    requestedScope: "user"
  });

  const aiaskTransport = userSecurityClient.transport;

  const ruleSecurityClient = createBackendSecurityClient({
    transport: gmTransport,
    storage: gmSecurityStorage,
    baseUrl: BACKEND_BASE_URL,
    rootPublicJwk: SECURITY_ROOT_PUBLIC_JWK,
    clientVersion: SCRIPT_VERSION,
    requestedScope: "report"
  });

  const ruleTransport = ruleSecurityClient.transport;

  const IMPORT_BRIDGE_PATHNAME = "/import.html";

  const VERSION_PROBE_PATHNAME = "/feedback.html";

  function isAllowedOrigin(origin) {
    if (origin === protocol.IMPORT_BRIDGE_ORIGIN) return true;
    return false;
  }

  const withoutHtmlSuffix = pathname => pathname.endsWith(".html") ? pathname.slice(0, -".html".length) : pathname;

  function bridgeModeFor(url) {
    if (!isAllowedOrigin(url.origin)) return null;
    const path = withoutHtmlSuffix(url.pathname);
    if (path === withoutHtmlSuffix(IMPORT_BRIDGE_PATHNAME)) return "full";
    if (path === withoutHtmlSuffix(VERSION_PROBE_PATHNAME)) return "version";
    return null;
  }

  function errorReply(requestId, reason) {
    return {
      channel: protocol.IMPORT_BRIDGE_REPLY_CHANNEL,
      v: protocol.IMPORT_BRIDGE_VERSION,
      requestId: requestId,
      kind: "error",
      reason: reason
    };
  }

  function importBridgeReplyFor(event, cache, selfWindows) {
    if (!isAllowedOrigin(event.origin)) return null;
    if (!selfWindows.includes(event.source)) return null;
    const request = protocol.parseImportBridgeRequest(event.data);
    if (!request) return null;
    if (request.kind === "ping") return {
      channel: protocol.IMPORT_BRIDGE_REPLY_CHANNEL,
      v: protocol.IMPORT_BRIDGE_VERSION,
      requestId: request.requestId,
      kind: "pong",
      scriptVersion: SCRIPT_VERSION
    };
    if (!cache) return null;
    try {
      if (request.kind === "preview") return protocol.importBridgePreviewReply(request.requestId, cache.previewImport(request.snapshot));
      const counts = cache.importJson(request.snapshot);
      if (cache.hasPersistFailure()) return errorReply(request.requestId, "import-failed");
      return protocol.importBridgeCommitReply(request.requestId, counts);
    } catch {
      return errorReply(request.requestId, "invalid-snapshot");
    }
  }

  function looksLikeBridgeMessage(data) {
    return typeof data === "object" && data !== null && data.channel === protocol.IMPORT_BRIDGE_CHANNEL;
  }

  function note(text, warn = false) {
    const line = `[aiask] \u5bfc\u5165\u6865\u63a5 \xb7 ${text}`;
    if (warn) console.warn(line); else console.info(line);
  }

  function installImportBridge(cache) {
    const target = typeof unsafeWindow !== "undefined" && unsafeWindow || window;
    const selfWindows = [ target, window ];
    target.addEventListener("message", event => {
      const reply = importBridgeReplyFor(event, cache, selfWindows);
      if (!reply) {
        if (looksLikeBridgeMessage(event.data)) note(`\u672a\u653e\u884c \xb7 origin=${event.origin} source=${selfWindows.includes(event.source) ? "self" : "other"}`, true);
        return;
      }
      target.postMessage(reply, event.origin);
      note(`${reply.kind} \u2192 ${event.origin}`);
    });
    note(`\u5df2\u5c31\u7eea v${SCRIPT_VERSION} \xb7 ${cache ? "\u5b8c\u6574\u6863" : "\u7248\u672c\u6863"} \xb7 ${location.origin}`);
  }

  const FRAME_READY_EVENT = "aiask:frame-ready";

  function createPageChangeScheduler(view, callback, debounceMs = 100, maxWaitMs = 1e3) {
    let timer = null;
    let maxTimer = null;
    let disposed = false;
    const cancel = () => {
      if (timer != null) view.clearTimeout(timer);
      if (maxTimer != null) view.clearTimeout(maxTimer);
      timer = null;
      maxTimer = null;
    };
    const fire = () => {
      cancel();
      void callback();
    };
    return {
      notify: () => {
        if (disposed) return;
        if (timer != null) view.clearTimeout(timer);
        timer = view.setTimeout(fire, debounceMs);
        if (maxTimer == null) maxTimer = view.setTimeout(fire, Math.max(maxWaitMs, debounceMs));
      },
      cancel: cancel,
      dispose: () => {
        disposed = true;
        cancel();
      }
    };
  }

  function subscribeDomChanges(document2, callback, options = {}) {
    const view = document2.defaultView;
    if (!view) throw new Error("dom-change document has no window");
    const {debounceMs: debounceMs = 300, maxWaitMs: maxWaitMs = 1e3, maxTriggers: maxTriggers = 200} = options;
    let triggers = 0;
    const scheduler = createPageChangeScheduler(view, () => {
      triggers += 1;
      if (triggers >= maxTriggers) observer.disconnect();
      return callback();
    }, debounceMs, maxWaitMs);
    const observer = new view.MutationObserver(records => {
      const host = document2.getElementById("aiask-host");
      if (host && records.every(record => host.contains(record.target))) return;
      scheduler.notify();
    });
    observer.observe(document2.documentElement, {
      attributes: true,
      childList: true,
      subtree: true
    });
    return () => {
      observer.disconnect();
      scheduler.dispose();
    };
  }

  function subscribeUrlChanges(view, callback, debounceMs = 100) {
    const history = view.history;
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    const scheduler = createPageChangeScheduler(view, callback, debounceMs);
    const notify = () => scheduler.notify();
    const wrappedPushState = function pushState(...args) {
      originalPushState.apply(history, args);
      notify();
    };
    const wrappedReplaceState = function replaceState(...args) {
      originalReplaceState.apply(history, args);
      notify();
    };
    history.pushState = wrappedPushState;
    history.replaceState = wrappedReplaceState;
    view.addEventListener("popstate", notify);
    return () => {
      view.removeEventListener("popstate", notify);
      if (history.pushState === wrappedPushState) history.pushState = originalPushState;
      if (history.replaceState === wrappedReplaceState) history.replaceState = originalReplaceState;
      scheduler.dispose();
    };
  }

  function notifyFrameReady(targetWindow) {
    targetWindow.document.dispatchEvent(new targetWindow.Event(FRAME_READY_EVENT));
  }

  function subscribeFrameReady(document2, callback, debounceMs = 100) {
    const view = document2.defaultView;
    if (!view) throw new Error("frame-ready document has no window");
    let timer = null;
    const listener = () => {
      if (timer != null) view.clearTimeout(timer);
      timer = view.setTimeout(() => {
        timer = null;
        void callback();
      }, debounceMs);
    };
    document2.addEventListener(FRAME_READY_EVENT, listener);
    return () => {
      document2.removeEventListener(FRAME_READY_EVENT, listener);
      if (timer != null) view.clearTimeout(timer);
      timer = null;
    };
  }

  function hasSupportedAncestor(ancestorOrigins, supportedHostPattern) {
    for (const origin of ancestorOrigins) {
      try {
        if (supportedHostPattern.test(new URL(origin).hostname)) return true;
      } catch {}
    }
    return false;
  }

  function resolvePanelRole(input) {
    if (input.isTop) return "mount";
    if (!input.isHighestSameOrigin) return "relay-f9";
    if (input.ancestorOrigins.length > 0) {
      return hasSupportedAncestor(input.ancestorOrigins, input.supportedHostPattern) ? "none" : "mount";
    }
    return "none";
  }

  function findHighestSameOriginWindow(start) {
    let host = start;
    try {
      while (host.parent !== host && host.parent.location.href) host = host.parent;
    } catch {}
    return host;
  }

  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }

  var Typr = {};

  Typr.parse = function(buff) {
    var bin = Typr._bin;
    var data = new Uint8Array(buff);
    var offset = 0;
    bin.readFixed(data, offset);
    offset += 4;
    var numTables = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    var tags = [ "cmap", "head", "hhea", "maxp", "hmtx", "name", "OS/2", "post", "loca", "glyf", "kern", "CFF ", "GPOS", "GSUB", "SVG " ];
    var obj = {
      _data: data
    };
    var tabs = {};
    for (var i = 0; i < numTables; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      bin.readUint(data, offset);
      offset += 4;
      var toffset = bin.readUint(data, offset);
      offset += 4;
      var length = bin.readUint(data, offset);
      offset += 4;
      tabs[tag] = {
        offset: toffset,
        length: length
      };
    }
    for (var i = 0; i < tags.length; i++) {
      var t = tags[i];
      if (tabs[t]) obj[t.trim()] = Typr[t.trim()].parse(data, tabs[t].offset, tabs[t].length, obj);
    }
    return obj;
  };

  Typr._tabOffset = function(data, tab) {
    var bin = Typr._bin;
    var numTables = bin.readUshort(data, 4);
    var offset = 12;
    for (var i = 0; i < numTables; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      bin.readUint(data, offset);
      offset += 4;
      var toffset = bin.readUint(data, offset);
      offset += 4;
      bin.readUint(data, offset);
      offset += 4;
      if (tag == tab) return toffset;
    }
    return 0;
  };

  Typr._bin = {
    readFixed: function(data, o) {
      return (data[o] << 8 | data[o + 1]) + (data[o + 2] << 8 | data[o + 3]) / (256 * 256 + 4);
    },
    readF2dot14: function(data, o) {
      var num = Typr._bin.readShort(data, o);
      return num / 16384;
    },
    readInt: function(buff, p) {
      var a = Typr._bin.t.uint8;
      a[0] = buff[p + 3];
      a[1] = buff[p + 2];
      a[2] = buff[p + 1];
      a[3] = buff[p];
      return Typr._bin.t.int32[0];
    },
    readInt8: function(buff, p) {
      var a = Typr._bin.t.uint8;
      a[0] = buff[p];
      return Typr._bin.t.int8[0];
    },
    readShort: function(buff, p) {
      var a = Typr._bin.t.uint8;
      a[1] = buff[p];
      a[0] = buff[p + 1];
      return Typr._bin.t.int16[0];
    },
    readUshort: function(buff, p) {
      return buff[p] << 8 | buff[p + 1];
    },
    readUshorts: function(buff, p, len) {
      var arr = [];
      for (var i = 0; i < len; i++) arr.push(Typr._bin.readUshort(buff, p + i * 2));
      return arr;
    },
    readUint: function(buff, p) {
      var a = Typr._bin.t.uint8;
      a[3] = buff[p];
      a[2] = buff[p + 1];
      a[1] = buff[p + 2];
      a[0] = buff[p + 3];
      return Typr._bin.t.uint32[0];
    },
    readUint64: function(buff, p) {
      return Typr._bin.readUint(buff, p) * (4294967295 + 1) + Typr._bin.readUint(buff, p + 4);
    },
    readASCII: function(buff, p, l) {
      var s = "";
      for (var i = 0; i < l; i++) s += String.fromCharCode(buff[p + i]);
      return s;
    },
    readUnicode: function(buff, p, l) {
      var s = "";
      for (var i = 0; i < l; i++) {
        var c = buff[p++] << 8 | buff[p++];
        s += String.fromCharCode(c);
      }
      return s;
    },
    _tdec: window["TextDecoder"] ? new window["TextDecoder"] : null,
    readUTF8: function(buff, p, l) {
      var tdec = Typr._bin._tdec;
      if (tdec && p == 0 && l == buff.length) return tdec["decode"](buff);
      return Typr._bin.readASCII(buff, p, l);
    },
    readBytes: function(buff, p, l) {
      var arr = [];
      for (var i = 0; i < l; i++) arr.push(buff[p + i]);
      return arr;
    },
    readASCIIArray: function(buff, p, l) {
      var s = [];
      for (var i = 0; i < l; i++) s.push(String.fromCharCode(buff[p + i]));
      return s;
    }
  };

  Typr._bin.t = {
    buff: new ArrayBuffer(8)
  };

  Typr._bin.t.int8 = new Int8Array(Typr._bin.t.buff);

  Typr._bin.t.uint8 = new Uint8Array(Typr._bin.t.buff);

  Typr._bin.t.int16 = new Int16Array(Typr._bin.t.buff);

  Typr._bin.t.uint16 = new Uint16Array(Typr._bin.t.buff);

  Typr._bin.t.int32 = new Int32Array(Typr._bin.t.buff);

  Typr._bin.t.uint32 = new Uint32Array(Typr._bin.t.buff);

  Typr._lctf = {};

  Typr._lctf.parse = function(data, offset, length, font, subt) {
    var bin = Typr._bin;
    var obj = {};
    var offset0 = offset;
    bin.readFixed(data, offset);
    offset += 4;
    var offScriptList = bin.readUshort(data, offset);
    offset += 2;
    var offFeatureList = bin.readUshort(data, offset);
    offset += 2;
    var offLookupList = bin.readUshort(data, offset);
    offset += 2;
    obj.scriptList = Typr._lctf.readScriptList(data, offset0 + offScriptList);
    obj.featureList = Typr._lctf.readFeatureList(data, offset0 + offFeatureList);
    obj.lookupList = Typr._lctf.readLookupList(data, offset0 + offLookupList, subt);
    return obj;
  };

  Typr._lctf.readLookupList = function(data, offset, subt) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = [];
    var count = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < count; i++) {
      var noff = bin.readUshort(data, offset);
      offset += 2;
      var lut = Typr._lctf.readLookupTable(data, offset0 + noff, subt);
      obj.push(lut);
    }
    return obj;
  };

  Typr._lctf.readLookupTable = function(data, offset, subt) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = {
      tabs: []
    };
    obj.ltype = bin.readUshort(data, offset);
    offset += 2;
    obj.flag = bin.readUshort(data, offset);
    offset += 2;
    var cnt = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < cnt; i++) {
      var noff = bin.readUshort(data, offset);
      offset += 2;
      var tab = subt(data, obj.ltype, offset0 + noff);
      obj.tabs.push(tab);
    }
    return obj;
  };

  Typr._lctf.numOfOnes = function(n) {
    var num = 0;
    for (var i = 0; i < 32; i++) if ((n >>> i & 1) != 0) num++;
    return num;
  };

  Typr._lctf.readClassDef = function(data, offset) {
    var bin = Typr._bin;
    var obj = [];
    var format = bin.readUshort(data, offset);
    offset += 2;
    if (format == 1) {
      var startGlyph = bin.readUshort(data, offset);
      offset += 2;
      var glyphCount = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < glyphCount; i++) {
        obj.push(startGlyph + i);
        obj.push(startGlyph + i);
        obj.push(bin.readUshort(data, offset));
        offset += 2;
      }
    }
    if (format == 2) {
      var count = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < count; i++) {
        obj.push(bin.readUshort(data, offset));
        offset += 2;
        obj.push(bin.readUshort(data, offset));
        offset += 2;
        obj.push(bin.readUshort(data, offset));
        offset += 2;
      }
    }
    return obj;
  };

  Typr._lctf.getInterval = function(tab, val) {
    for (var i = 0; i < tab.length; i += 3) {
      var start = tab[i], end = tab[i + 1];
      tab[i + 2];
      if (start <= val && val <= end) return i;
    }
    return -1;
  };

  Typr._lctf.readValueRecord = function(data, offset, valFmt) {
    var bin = Typr._bin;
    var arr = [];
    arr.push(valFmt & 1 ? bin.readShort(data, offset) : 0);
    offset += valFmt & 1 ? 2 : 0;
    arr.push(valFmt & 2 ? bin.readShort(data, offset) : 0);
    offset += valFmt & 2 ? 2 : 0;
    arr.push(valFmt & 4 ? bin.readShort(data, offset) : 0);
    offset += valFmt & 4 ? 2 : 0;
    arr.push(valFmt & 8 ? bin.readShort(data, offset) : 0);
    offset += valFmt & 8 ? 2 : 0;
    return arr;
  };

  Typr._lctf.readCoverage = function(data, offset) {
    var bin = Typr._bin;
    var cvg = {};
    cvg.fmt = bin.readUshort(data, offset);
    offset += 2;
    var count = bin.readUshort(data, offset);
    offset += 2;
    if (cvg.fmt == 1) cvg.tab = bin.readUshorts(data, offset, count);
    if (cvg.fmt == 2) cvg.tab = bin.readUshorts(data, offset, count * 3);
    return cvg;
  };

  Typr._lctf.coverageIndex = function(cvg, val) {
    var tab = cvg.tab;
    if (cvg.fmt == 1) return tab.indexOf(val);
    if (cvg.fmt == 2) {
      var ind = Typr._lctf.getInterval(tab, val);
      if (ind != -1) return tab[ind + 2] + (val - tab[ind]);
    }
    return -1;
  };

  Typr._lctf.readFeatureList = function(data, offset) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = [];
    var count = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < count; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      var noff = bin.readUshort(data, offset);
      offset += 2;
      obj.push({
        tag: tag.trim(),
        tab: Typr._lctf.readFeatureTable(data, offset0 + noff)
      });
    }
    return obj;
  };

  Typr._lctf.readFeatureTable = function(data, offset) {
    var bin = Typr._bin;
    bin.readUshort(data, offset);
    offset += 2;
    var lookupCount = bin.readUshort(data, offset);
    offset += 2;
    var indices = [];
    for (var i = 0; i < lookupCount; i++) indices.push(bin.readUshort(data, offset + 2 * i));
    return indices;
  };

  Typr._lctf.readScriptList = function(data, offset) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = {};
    var count = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < count; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      var noff = bin.readUshort(data, offset);
      offset += 2;
      obj[tag.trim()] = Typr._lctf.readScriptTable(data, offset0 + noff);
    }
    return obj;
  };

  Typr._lctf.readScriptTable = function(data, offset) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = {};
    var defLangSysOff = bin.readUshort(data, offset);
    offset += 2;
    obj.default = Typr._lctf.readLangSysTable(data, offset0 + defLangSysOff);
    var langSysCount = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < langSysCount; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      var langSysOff = bin.readUshort(data, offset);
      offset += 2;
      obj[tag.trim()] = Typr._lctf.readLangSysTable(data, offset0 + langSysOff);
    }
    return obj;
  };

  Typr._lctf.readLangSysTable = function(data, offset) {
    var bin = Typr._bin;
    var obj = {};
    bin.readUshort(data, offset);
    offset += 2;
    obj.reqFeature = bin.readUshort(data, offset);
    offset += 2;
    var featureCount = bin.readUshort(data, offset);
    offset += 2;
    obj.features = bin.readUshorts(data, offset, featureCount);
    return obj;
  };

  Typr.CFF = {};

  Typr.CFF.parse = function(data, offset, length) {
    var bin = Typr._bin;
    data = new Uint8Array(data.buffer, offset, length);
    offset = 0;
    data[offset];
    offset++;
    data[offset];
    offset++;
    data[offset];
    offset++;
    data[offset];
    offset++;
    var ninds = [];
    offset = Typr.CFF.readIndex(data, offset, ninds);
    var names = [];
    for (var i = 0; i < ninds.length - 1; i++) names.push(bin.readASCII(data, offset + ninds[i], ninds[i + 1] - ninds[i]));
    offset += ninds[ninds.length - 1];
    var tdinds = [];
    offset = Typr.CFF.readIndex(data, offset, tdinds);
    var topDicts = [];
    for (var i = 0; i < tdinds.length - 1; i++) topDicts.push(Typr.CFF.readDict(data, offset + tdinds[i], offset + tdinds[i + 1]));
    offset += tdinds[tdinds.length - 1];
    var topdict = topDicts[0];
    var sinds = [];
    offset = Typr.CFF.readIndex(data, offset, sinds);
    var strings = [];
    for (var i = 0; i < sinds.length - 1; i++) strings.push(bin.readASCII(data, offset + sinds[i], sinds[i + 1] - sinds[i]));
    offset += sinds[sinds.length - 1];
    Typr.CFF.readSubrs(data, offset, topdict);
    if (topdict.CharStrings) {
      offset = topdict.CharStrings;
      var sinds = [];
      offset = Typr.CFF.readIndex(data, offset, sinds);
      var cstr = [];
      for (var i = 0; i < sinds.length - 1; i++) cstr.push(bin.readBytes(data, offset + sinds[i], sinds[i + 1] - sinds[i]));
      topdict.CharStrings = cstr;
    }
    if (topdict.Encoding) topdict.Encoding = Typr.CFF.readEncoding(data, topdict.Encoding, topdict.CharStrings.length);
    if (topdict.charset) topdict.charset = Typr.CFF.readCharset(data, topdict.charset, topdict.CharStrings.length);
    if (topdict.Private) {
      offset = topdict.Private[1];
      topdict.Private = Typr.CFF.readDict(data, offset, offset + topdict.Private[0]);
      if (topdict.Private.Subrs) Typr.CFF.readSubrs(data, offset + topdict.Private.Subrs, topdict.Private);
    }
    var obj = {};
    for (var p in topdict) {
      if ([ "FamilyName", "FullName", "Notice", "version", "Copyright" ].indexOf(p) != -1) obj[p] = strings[topdict[p] - 426 + 35]; else obj[p] = topdict[p];
    }
    return obj;
  };

  Typr.CFF.readSubrs = function(data, offset, obj) {
    var bin = Typr._bin;
    var gsubinds = [];
    offset = Typr.CFF.readIndex(data, offset, gsubinds);
    var bias, nSubrs = gsubinds.length;
    if (nSubrs < 1240) bias = 107; else if (nSubrs < 33900) bias = 1131; else bias = 32768;
    obj.Bias = bias;
    obj.Subrs = [];
    for (var i = 0; i < gsubinds.length - 1; i++) obj.Subrs.push(bin.readBytes(data, offset + gsubinds[i], gsubinds[i + 1] - gsubinds[i]));
  };

  Typr.CFF.tableSE = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 0, 111, 112, 113, 114, 0, 115, 116, 117, 118, 119, 120, 121, 122, 0, 123, 0, 124, 125, 126, 127, 128, 129, 130, 131, 0, 132, 133, 0, 134, 135, 136, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 138, 0, 139, 0, 0, 0, 0, 140, 141, 142, 143, 0, 0, 0, 0, 0, 144, 0, 0, 0, 145, 0, 0, 146, 147, 148, 149, 0, 0, 0, 0 ];

  Typr.CFF.glyphByUnicode = function(cff, code) {
    for (var i = 0; i < cff.charset.length; i++) if (cff.charset[i] == code) return i;
    return -1;
  };

  Typr.CFF.glyphBySE = function(cff, charcode) {
    if (charcode < 0 || charcode > 255) return -1;
    return Typr.CFF.glyphByUnicode(cff, Typr.CFF.tableSE[charcode]);
  };

  Typr.CFF.readEncoding = function(data, offset, num) {
    Typr._bin;
    var array = [ ".notdef" ];
    var format = data[offset];
    offset++;
    if (format == 0) {
      var nCodes = data[offset];
      offset++;
      for (var i = 0; i < nCodes; i++) array.push(data[offset + i]);
    } else throw "error: unknown encoding format: " + format;
    return array;
  };

  Typr.CFF.readCharset = function(data, offset, num) {
    var bin = Typr._bin;
    var charset = [ ".notdef" ];
    var format = data[offset];
    offset++;
    if (format == 0) {
      for (var i = 0; i < num; i++) {
        var first = bin.readUshort(data, offset);
        offset += 2;
        charset.push(first);
      }
    } else if (format == 1 || format == 2) {
      while (charset.length < num) {
        var first = bin.readUshort(data, offset);
        offset += 2;
        var nLeft = 0;
        if (format == 1) {
          nLeft = data[offset];
          offset++;
        } else {
          nLeft = bin.readUshort(data, offset);
          offset += 2;
        }
        for (var i = 0; i <= nLeft; i++) {
          charset.push(first);
          first++;
        }
      }
    } else throw "error: format: " + format;
    return charset;
  };

  Typr.CFF.readIndex = function(data, offset, inds) {
    var bin = Typr._bin;
    var count = bin.readUshort(data, offset);
    offset += 2;
    var offsize = data[offset];
    offset++;
    if (offsize == 1) for (var i = 0; i < count + 1; i++) inds.push(data[offset + i]); else if (offsize == 2) for (var i = 0; i < count + 1; i++) inds.push(bin.readUshort(data, offset + i * 2)); else if (offsize == 3) for (var i = 0; i < count + 1; i++) inds.push(bin.readUint(data, offset + i * 3 - 1) & 16777215); else if (count != 0) throw "unsupported offset size: " + offsize + ", count: " + count;
    offset += (count + 1) * offsize;
    return offset - 1;
  };

  Typr.CFF.getCharString = function(data, offset, o) {
    var bin = Typr._bin;
    var b0 = data[offset], b1 = data[offset + 1];
    data[offset + 2];
    data[offset + 3];
    data[offset + 4];
    var vs = 1;
    var op = null, val = null;
    if (b0 <= 20) {
      op = b0;
      vs = 1;
    }
    if (b0 == 12) {
      op = b0 * 100 + b1;
      vs = 2;
    }
    if (21 <= b0 && b0 <= 27) {
      op = b0;
      vs = 1;
    }
    if (b0 == 28) {
      val = bin.readShort(data, offset + 1);
      vs = 3;
    }
    if (29 <= b0 && b0 <= 31) {
      op = b0;
      vs = 1;
    }
    if (32 <= b0 && b0 <= 246) {
      val = b0 - 139;
      vs = 1;
    }
    if (247 <= b0 && b0 <= 250) {
      val = (b0 - 247) * 256 + b1 + 108;
      vs = 2;
    }
    if (251 <= b0 && b0 <= 254) {
      val = -(b0 - 251) * 256 - b1 - 108;
      vs = 2;
    }
    if (b0 == 255) {
      val = bin.readInt(data, offset + 1) / 65535;
      vs = 5;
    }
    o.val = val != null ? val : "o" + op;
    o.size = vs;
  };

  Typr.CFF.readCharString = function(data, offset, length) {
    var end = offset + length;
    var bin = Typr._bin;
    var arr = [];
    while (offset < end) {
      var b0 = data[offset], b1 = data[offset + 1];
      data[offset + 2];
      data[offset + 3];
      data[offset + 4];
      var vs = 1;
      var op = null, val = null;
      if (b0 <= 20) {
        op = b0;
        vs = 1;
      }
      if (b0 == 12) {
        op = b0 * 100 + b1;
        vs = 2;
      }
      if (b0 == 19 || b0 == 20) {
        op = b0;
        vs = 2;
      }
      if (21 <= b0 && b0 <= 27) {
        op = b0;
        vs = 1;
      }
      if (b0 == 28) {
        val = bin.readShort(data, offset + 1);
        vs = 3;
      }
      if (29 <= b0 && b0 <= 31) {
        op = b0;
        vs = 1;
      }
      if (32 <= b0 && b0 <= 246) {
        val = b0 - 139;
        vs = 1;
      }
      if (247 <= b0 && b0 <= 250) {
        val = (b0 - 247) * 256 + b1 + 108;
        vs = 2;
      }
      if (251 <= b0 && b0 <= 254) {
        val = -(b0 - 251) * 256 - b1 - 108;
        vs = 2;
      }
      if (b0 == 255) {
        val = bin.readInt(data, offset + 1) / 65535;
        vs = 5;
      }
      arr.push(val != null ? val : "o" + op);
      offset += vs;
    }
    return arr;
  };

  Typr.CFF.readDict = function(data, offset, end) {
    var bin = Typr._bin;
    var dict = {};
    var carr = [];
    while (offset < end) {
      var b0 = data[offset], b1 = data[offset + 1];
      data[offset + 2];
      data[offset + 3];
      data[offset + 4];
      var vs = 1;
      var key = null, val = null;
      if (b0 == 28) {
        val = bin.readShort(data, offset + 1);
        vs = 3;
      }
      if (b0 == 29) {
        val = bin.readInt(data, offset + 1);
        vs = 5;
      }
      if (32 <= b0 && b0 <= 246) {
        val = b0 - 139;
        vs = 1;
      }
      if (247 <= b0 && b0 <= 250) {
        val = (b0 - 247) * 256 + b1 + 108;
        vs = 2;
      }
      if (251 <= b0 && b0 <= 254) {
        val = -(b0 - 251) * 256 - b1 - 108;
        vs = 2;
      }
      if (b0 == 255) {
        val = bin.readInt(data, offset + 1) / 65535;
        vs = 5;
        throw "unknown number";
      }
      if (b0 == 30) {
        var nibs = [];
        vs = 1;
        while (true) {
          var b = data[offset + vs];
          vs++;
          var nib0 = b >> 4, nib1 = b & 15;
          if (nib0 != 15) nibs.push(nib0);
          if (nib1 != 15) nibs.push(nib1);
          if (nib1 == 15) break;
        }
        var s = "";
        var chars = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ".", "e", "e-", "reserved", "-", "endOfNumber" ];
        for (var i = 0; i < nibs.length; i++) s += chars[nibs[i]];
        val = parseFloat(s);
      }
      if (b0 <= 21) {
        var keys = [ "version", "Notice", "FullName", "FamilyName", "Weight", "FontBBox", "BlueValues", "OtherBlues", "FamilyBlues", "FamilyOtherBlues", "StdHW", "StdVW", "escape", "UniqueID", "XUID", "charset", "Encoding", "CharStrings", "Private", "Subrs", "defaultWidthX", "nominalWidthX" ];
        key = keys[b0];
        vs = 1;
        if (b0 == 12) {
          var keys = [ "Copyright", "isFixedPitch", "ItalicAngle", "UnderlinePosition", "UnderlineThickness", "PaintType", "CharstringType", "FontMatrix", "StrokeWidth", "BlueScale", "BlueShift", "BlueFuzz", "StemSnapH", "StemSnapV", "ForceBold", 0, 0, "LanguageGroup", "ExpansionFactor", "initialRandomSeed", "SyntheticBase", "PostScript", "BaseFontName", "BaseFontBlend", 0, 0, 0, 0, 0, 0, "ROS", "CIDFontVersion", "CIDFontRevision", "CIDFontType", "CIDCount", "UIDBase", "FDArray", "FDSelect", "FontName" ];
          key = keys[b1];
          vs = 2;
        }
      }
      if (key != null) {
        dict[key] = carr.length == 1 ? carr[0] : carr;
        carr = [];
      } else carr.push(val);
      offset += vs;
    }
    return dict;
  };

  Typr.cmap = {};

  Typr.cmap.parse = function(data, offset, length) {
    data = new Uint8Array(data.buffer, offset, length);
    offset = 0;
    var bin = Typr._bin;
    var obj = {};
    bin.readUshort(data, offset);
    offset += 2;
    var numTables = bin.readUshort(data, offset);
    offset += 2;
    var offs = [];
    obj.tables = [];
    for (var i = 0; i < numTables; i++) {
      var platformID = bin.readUshort(data, offset);
      offset += 2;
      var encodingID = bin.readUshort(data, offset);
      offset += 2;
      var noffset = bin.readUint(data, offset);
      offset += 4;
      var id = "p" + platformID + "e" + encodingID;
      var tind = offs.indexOf(noffset);
      if (tind == -1) {
        tind = obj.tables.length;
        var subt;
        offs.push(noffset);
        var format = bin.readUshort(data, noffset);
        if (format == 0) subt = Typr.cmap.parse0(data, noffset); else if (format == 4) subt = Typr.cmap.parse4(data, noffset); else if (format == 6) subt = Typr.cmap.parse6(data, noffset); else if (format == 12) subt = Typr.cmap.parse12(data, noffset); else console.log("unknown format: " + format, platformID, encodingID, noffset);
        obj.tables.push(subt);
      }
      if (obj[id] != null) throw "multiple tables for one platform+encoding";
      obj[id] = tind;
    }
    return obj;
  };

  Typr.cmap.parse0 = function(data, offset) {
    var bin = Typr._bin;
    var obj = {};
    obj.format = bin.readUshort(data, offset);
    offset += 2;
    var len = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    obj.map = [];
    for (var i = 0; i < len - 6; i++) obj.map.push(data[offset + i]);
    return obj;
  };

  Typr.cmap.parse4 = function(data, offset) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = {};
    obj.format = bin.readUshort(data, offset);
    offset += 2;
    var length = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    var segCountX2 = bin.readUshort(data, offset);
    offset += 2;
    var segCount = segCountX2 / 2;
    obj.searchRange = bin.readUshort(data, offset);
    offset += 2;
    obj.entrySelector = bin.readUshort(data, offset);
    offset += 2;
    obj.rangeShift = bin.readUshort(data, offset);
    offset += 2;
    obj.endCount = bin.readUshorts(data, offset, segCount);
    offset += segCount * 2;
    offset += 2;
    obj.startCount = bin.readUshorts(data, offset, segCount);
    offset += segCount * 2;
    obj.idDelta = [];
    for (var i = 0; i < segCount; i++) {
      obj.idDelta.push(bin.readShort(data, offset));
      offset += 2;
    }
    obj.idRangeOffset = bin.readUshorts(data, offset, segCount);
    offset += segCount * 2;
    obj.glyphIdArray = [];
    while (offset < offset0 + length) {
      obj.glyphIdArray.push(bin.readUshort(data, offset));
      offset += 2;
    }
    return obj;
  };

  Typr.cmap.parse6 = function(data, offset) {
    var bin = Typr._bin;
    var obj = {};
    obj.format = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    obj.firstCode = bin.readUshort(data, offset);
    offset += 2;
    var entryCount = bin.readUshort(data, offset);
    offset += 2;
    obj.glyphIdArray = [];
    for (var i = 0; i < entryCount; i++) {
      obj.glyphIdArray.push(bin.readUshort(data, offset));
      offset += 2;
    }
    return obj;
  };

  Typr.cmap.parse12 = function(data, offset) {
    var bin = Typr._bin;
    var obj = {};
    obj.format = bin.readUshort(data, offset);
    offset += 2;
    offset += 2;
    bin.readUint(data, offset);
    offset += 4;
    bin.readUint(data, offset);
    offset += 4;
    var nGroups = bin.readUint(data, offset);
    offset += 4;
    obj.groups = [];
    for (var i = 0; i < nGroups; i++) {
      var off = offset + i * 12;
      var startCharCode = bin.readUint(data, off + 0);
      var endCharCode = bin.readUint(data, off + 4);
      var startGlyphID = bin.readUint(data, off + 8);
      obj.groups.push([ startCharCode, endCharCode, startGlyphID ]);
    }
    return obj;
  };

  Typr.glyf = {};

  Typr.glyf.parse = function(data, offset, length, font) {
    var obj = [];
    for (var g = 0; g < font.maxp.numGlyphs; g++) obj.push(null);
    return obj;
  };

  Typr.glyf._parseGlyf = function(font, g) {
    var bin = Typr._bin;
    var data = font._data;
    var offset = Typr._tabOffset(data, "glyf") + font.loca[g];
    if (font.loca[g] == font.loca[g + 1]) return null;
    var gl = {};
    gl.noc = bin.readShort(data, offset);
    offset += 2;
    gl.xMin = bin.readShort(data, offset);
    offset += 2;
    gl.yMin = bin.readShort(data, offset);
    offset += 2;
    gl.xMax = bin.readShort(data, offset);
    offset += 2;
    gl.yMax = bin.readShort(data, offset);
    offset += 2;
    if (gl.xMin >= gl.xMax || gl.yMin >= gl.yMax) return null;
    if (gl.noc > 0) {
      gl.endPts = [];
      for (var i = 0; i < gl.noc; i++) {
        gl.endPts.push(bin.readUshort(data, offset));
        offset += 2;
      }
      var instructionLength = bin.readUshort(data, offset);
      offset += 2;
      if (data.length - offset < instructionLength) return null;
      gl.instructions = bin.readBytes(data, offset, instructionLength);
      offset += instructionLength;
      var crdnum = gl.endPts[gl.noc - 1] + 1;
      gl.flags = [];
      for (var i = 0; i < crdnum; i++) {
        var flag = data[offset];
        offset++;
        gl.flags.push(flag);
        if ((flag & 8) != 0) {
          var rep = data[offset];
          offset++;
          for (var j = 0; j < rep; j++) {
            gl.flags.push(flag);
            i++;
          }
        }
      }
      gl.xs = [];
      for (var i = 0; i < crdnum; i++) {
        var i8 = (gl.flags[i] & 2) != 0, same = (gl.flags[i] & 16) != 0;
        if (i8) {
          gl.xs.push(same ? data[offset] : -data[offset]);
          offset++;
        } else {
          if (same) gl.xs.push(0); else {
            gl.xs.push(bin.readShort(data, offset));
            offset += 2;
          }
        }
      }
      gl.ys = [];
      for (var i = 0; i < crdnum; i++) {
        var i8 = (gl.flags[i] & 4) != 0, same = (gl.flags[i] & 32) != 0;
        if (i8) {
          gl.ys.push(same ? data[offset] : -data[offset]);
          offset++;
        } else {
          if (same) gl.ys.push(0); else {
            gl.ys.push(bin.readShort(data, offset));
            offset += 2;
          }
        }
      }
      var x = 0, y = 0;
      for (var i = 0; i < crdnum; i++) {
        x += gl.xs[i];
        y += gl.ys[i];
        gl.xs[i] = x;
        gl.ys[i] = y;
      }
    } else {
      var ARG_1_AND_2_ARE_WORDS = 1 << 0;
      var ARGS_ARE_XY_VALUES = 1 << 1;
      var WE_HAVE_A_SCALE = 1 << 3;
      var MORE_COMPONENTS = 1 << 5;
      var WE_HAVE_AN_X_AND_Y_SCALE = 1 << 6;
      var WE_HAVE_A_TWO_BY_TWO = 1 << 7;
      var WE_HAVE_INSTRUCTIONS = 1 << 8;
      gl.parts = [];
      var flags;
      do {
        flags = bin.readUshort(data, offset);
        offset += 2;
        var part = {
          m: {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            tx: 0,
            ty: 0
          },
          p1: -1,
          p2: -1
        };
        gl.parts.push(part);
        part.glyphIndex = bin.readUshort(data, offset);
        offset += 2;
        if (flags & ARG_1_AND_2_ARE_WORDS) {
          var arg1 = bin.readShort(data, offset);
          offset += 2;
          var arg2 = bin.readShort(data, offset);
          offset += 2;
        } else {
          var arg1 = bin.readInt8(data, offset);
          offset++;
          var arg2 = bin.readInt8(data, offset);
          offset++;
        }
        if (flags & ARGS_ARE_XY_VALUES) {
          part.m.tx = arg1;
          part.m.ty = arg2;
        } else {
          part.p1 = arg1;
          part.p2 = arg2;
        }
        if (flags & WE_HAVE_A_SCALE) {
          part.m.a = part.m.d = bin.readF2dot14(data, offset);
          offset += 2;
        } else if (flags & WE_HAVE_AN_X_AND_Y_SCALE) {
          part.m.a = bin.readF2dot14(data, offset);
          offset += 2;
          part.m.d = bin.readF2dot14(data, offset);
          offset += 2;
        } else if (flags & WE_HAVE_A_TWO_BY_TWO) {
          part.m.a = bin.readF2dot14(data, offset);
          offset += 2;
          part.m.b = bin.readF2dot14(data, offset);
          offset += 2;
          part.m.c = bin.readF2dot14(data, offset);
          offset += 2;
          part.m.d = bin.readF2dot14(data, offset);
          offset += 2;
        }
      } while (flags & MORE_COMPONENTS);
      if (flags & WE_HAVE_INSTRUCTIONS) {
        var numInstr = bin.readUshort(data, offset);
        offset += 2;
        gl.instr = [];
        for (var i = 0; i < numInstr; i++) {
          gl.instr.push(data[offset]);
          offset++;
        }
      }
    }
    return gl;
  };

  Typr.GPOS = {};

  Typr.GPOS.parse = function(data, offset, length, font) {
    return Typr._lctf.parse(data, offset, length, font, Typr.GPOS.subt);
  };

  Typr.GPOS.subt = function(data, ltype, offset) {
    if (ltype != 2) return null;
    var bin = Typr._bin, offset0 = offset, tab = {};
    tab.format = bin.readUshort(data, offset);
    offset += 2;
    var covOff = bin.readUshort(data, offset);
    offset += 2;
    tab.coverage = Typr._lctf.readCoverage(data, covOff + offset0);
    tab.valFmt1 = bin.readUshort(data, offset);
    offset += 2;
    tab.valFmt2 = bin.readUshort(data, offset);
    offset += 2;
    var ones1 = Typr._lctf.numOfOnes(tab.valFmt1);
    var ones2 = Typr._lctf.numOfOnes(tab.valFmt2);
    if (tab.format == 1) {
      tab.pairsets = [];
      var count = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < count; i++) {
        var psoff = bin.readUshort(data, offset);
        offset += 2;
        psoff += offset0;
        var pvcount = bin.readUshort(data, psoff);
        psoff += 2;
        var arr = [];
        for (var j = 0; j < pvcount; j++) {
          var gid2 = bin.readUshort(data, psoff);
          psoff += 2;
          var value1, value2;
          if (tab.valFmt1 != 0) {
            value1 = Typr._lctf.readValueRecord(data, psoff, tab.valFmt1);
            psoff += ones1 * 2;
          }
          if (tab.valFmt2 != 0) {
            value2 = Typr._lctf.readValueRecord(data, psoff, tab.valFmt2);
            psoff += ones2 * 2;
          }
          arr.push({
            gid2: gid2,
            val1: value1,
            val2: value2
          });
        }
        tab.pairsets.push(arr);
      }
    }
    if (tab.format == 2) {
      var classDef1 = bin.readUshort(data, offset);
      offset += 2;
      var classDef2 = bin.readUshort(data, offset);
      offset += 2;
      var class1Count = bin.readUshort(data, offset);
      offset += 2;
      var class2Count = bin.readUshort(data, offset);
      offset += 2;
      tab.classDef1 = Typr._lctf.readClassDef(data, offset0 + classDef1);
      tab.classDef2 = Typr._lctf.readClassDef(data, offset0 + classDef2);
      tab.matrix = [];
      for (var i = 0; i < class1Count; i++) {
        var row = [];
        for (var j = 0; j < class2Count; j++) {
          var value1 = null, value2 = null;
          if (tab.valFmt1 != 0) {
            value1 = Typr._lctf.readValueRecord(data, offset, tab.valFmt1);
            offset += ones1 * 2;
          }
          if (tab.valFmt2 != 0) {
            value2 = Typr._lctf.readValueRecord(data, offset, tab.valFmt2);
            offset += ones2 * 2;
          }
          row.push({
            val1: value1,
            val2: value2
          });
        }
        tab.matrix.push(row);
      }
    }
    return tab;
  };

  Typr.GSUB = {};

  Typr.GSUB.parse = function(data, offset, length, font) {
    return Typr._lctf.parse(data, offset, length, font, Typr.GSUB.subt);
  };

  Typr.GSUB.subt = function(data, ltype, offset) {
    var bin = Typr._bin, offset0 = offset, tab = {};
    if (ltype != 1 && ltype != 4 && ltype != 5) return null;
    tab.fmt = bin.readUshort(data, offset);
    offset += 2;
    var covOff = bin.readUshort(data, offset);
    offset += 2;
    tab.coverage = Typr._lctf.readCoverage(data, covOff + offset0);
    if (ltype == 1) {
      if (tab.fmt == 1) {
        tab.delta = bin.readShort(data, offset);
        offset += 2;
      } else if (tab.fmt == 2) {
        var cnt = bin.readUshort(data, offset);
        offset += 2;
        tab.newg = bin.readUshorts(data, offset, cnt);
        offset += tab.newg.length * 2;
      }
    } else if (ltype == 4) {
      tab.vals = [];
      var cnt = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < cnt; i++) {
        var loff = bin.readUshort(data, offset);
        offset += 2;
        tab.vals.push(Typr.GSUB.readLigatureSet(data, offset0 + loff));
      }
    } else if (ltype == 5) {
      if (tab.fmt == 2) {
        var cDefOffset = bin.readUshort(data, offset);
        offset += 2;
        tab.cDef = Typr._lctf.readClassDef(data, offset0 + cDefOffset);
        tab.scset = [];
        var subClassSetCount = bin.readUshort(data, offset);
        offset += 2;
        for (var i = 0; i < subClassSetCount; i++) {
          var scsOff = bin.readUshort(data, offset);
          offset += 2;
          tab.scset.push(scsOff == 0 ? null : Typr.GSUB.readSubClassSet(data, offset0 + scsOff));
        }
      } else console.log("unknown table format", tab.fmt);
    }
    return tab;
  };

  Typr.GSUB.readSubClassSet = function(data, offset) {
    var rUs = Typr._bin.readUshort, offset0 = offset, lset = [];
    var cnt = rUs(data, offset);
    offset += 2;
    for (var i = 0; i < cnt; i++) {
      var loff = rUs(data, offset);
      offset += 2;
      lset.push(Typr.GSUB.readSubClassRule(data, offset0 + loff));
    }
    return lset;
  };

  Typr.GSUB.readSubClassRule = function(data, offset) {
    var rUs = Typr._bin.readUshort, rule = {};
    var gcount = rUs(data, offset);
    offset += 2;
    var scount = rUs(data, offset);
    offset += 2;
    rule.input = [];
    for (var i = 0; i < gcount - 1; i++) {
      rule.input.push(rUs(data, offset));
      offset += 2;
    }
    rule.substLookupRecords = Typr.GSUB.readSubstLookupRecords(data, offset, scount);
    return rule;
  };

  Typr.GSUB.readSubstLookupRecords = function(data, offset, cnt) {
    var rUs = Typr._bin.readUshort;
    var out = [];
    for (var i = 0; i < cnt; i++) {
      out.push(rUs(data, offset), rUs(data, offset + 2));
      offset += 4;
    }
    return out;
  };

  Typr.GSUB.readChainSubClassSet = function(data, offset) {
    var bin = Typr._bin, offset0 = offset, lset = [];
    var cnt = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < cnt; i++) {
      var loff = bin.readUshort(data, offset);
      offset += 2;
      lset.push(Typr.GSUB.readChainSubClassRule(data, offset0 + loff));
    }
    return lset;
  };

  Typr.GSUB.readChainSubClassRule = function(data, offset) {
    var bin = Typr._bin, rule = {};
    var pps = [ "backtrack", "input", "lookahead" ];
    for (var pi = 0; pi < pps.length; pi++) {
      var cnt = bin.readUshort(data, offset);
      offset += 2;
      if (pi == 1) cnt--;
      rule[pps[pi]] = bin.readUshorts(data, offset, cnt);
      offset += rule[pps[pi]].length * 2;
    }
    var cnt = bin.readUshort(data, offset);
    offset += 2;
    rule.subst = bin.readUshorts(data, offset, cnt * 2);
    offset += rule.subst.length * 2;
    return rule;
  };

  Typr.GSUB.readLigatureSet = function(data, offset) {
    var bin = Typr._bin, offset0 = offset, lset = [];
    var lcnt = bin.readUshort(data, offset);
    offset += 2;
    for (var j = 0; j < lcnt; j++) {
      var loff = bin.readUshort(data, offset);
      offset += 2;
      lset.push(Typr.GSUB.readLigature(data, offset0 + loff));
    }
    return lset;
  };

  Typr.GSUB.readLigature = function(data, offset) {
    var bin = Typr._bin, lig = {
      chain: []
    };
    lig.nglyph = bin.readUshort(data, offset);
    offset += 2;
    var ccnt = bin.readUshort(data, offset);
    offset += 2;
    for (var k = 0; k < ccnt - 1; k++) {
      lig.chain.push(bin.readUshort(data, offset));
      offset += 2;
    }
    return lig;
  };

  Typr.head = {};

  Typr.head.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    bin.readFixed(data, offset);
    offset += 4;
    obj.fontRevision = bin.readFixed(data, offset);
    offset += 4;
    bin.readUint(data, offset);
    offset += 4;
    bin.readUint(data, offset);
    offset += 4;
    obj.flags = bin.readUshort(data, offset);
    offset += 2;
    obj.unitsPerEm = bin.readUshort(data, offset);
    offset += 2;
    obj.created = bin.readUint64(data, offset);
    offset += 8;
    obj.modified = bin.readUint64(data, offset);
    offset += 8;
    obj.xMin = bin.readShort(data, offset);
    offset += 2;
    obj.yMin = bin.readShort(data, offset);
    offset += 2;
    obj.xMax = bin.readShort(data, offset);
    offset += 2;
    obj.yMax = bin.readShort(data, offset);
    offset += 2;
    obj.macStyle = bin.readUshort(data, offset);
    offset += 2;
    obj.lowestRecPPEM = bin.readUshort(data, offset);
    offset += 2;
    obj.fontDirectionHint = bin.readShort(data, offset);
    offset += 2;
    obj.indexToLocFormat = bin.readShort(data, offset);
    offset += 2;
    obj.glyphDataFormat = bin.readShort(data, offset);
    offset += 2;
    return obj;
  };

  Typr.hhea = {};

  Typr.hhea.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    bin.readFixed(data, offset);
    offset += 4;
    obj.ascender = bin.readShort(data, offset);
    offset += 2;
    obj.descender = bin.readShort(data, offset);
    offset += 2;
    obj.lineGap = bin.readShort(data, offset);
    offset += 2;
    obj.advanceWidthMax = bin.readUshort(data, offset);
    offset += 2;
    obj.minLeftSideBearing = bin.readShort(data, offset);
    offset += 2;
    obj.minRightSideBearing = bin.readShort(data, offset);
    offset += 2;
    obj.xMaxExtent = bin.readShort(data, offset);
    offset += 2;
    obj.caretSlopeRise = bin.readShort(data, offset);
    offset += 2;
    obj.caretSlopeRun = bin.readShort(data, offset);
    offset += 2;
    obj.caretOffset = bin.readShort(data, offset);
    offset += 2;
    offset += 4 * 2;
    obj.metricDataFormat = bin.readShort(data, offset);
    offset += 2;
    obj.numberOfHMetrics = bin.readUshort(data, offset);
    offset += 2;
    return obj;
  };

  Typr.hmtx = {};

  Typr.hmtx.parse = function(data, offset, length, font) {
    var bin = Typr._bin;
    var obj = {};
    obj.aWidth = [];
    obj.lsBearing = [];
    var aw = 0, lsb = 0;
    for (var i = 0; i < font.maxp.numGlyphs; i++) {
      if (i < font.hhea.numberOfHMetrics) {
        aw = bin.readUshort(data, offset);
        offset += 2;
        lsb = bin.readShort(data, offset);
        offset += 2;
      }
      obj.aWidth.push(aw);
      obj.lsBearing.push(lsb);
    }
    return obj;
  };

  Typr.kern = {};

  Typr.kern.parse = function(data, offset, length, font) {
    var bin = Typr._bin;
    var version = bin.readUshort(data, offset);
    offset += 2;
    if (version == 1) return Typr.kern.parseV1(data, offset - 2, length, font);
    var nTables = bin.readUshort(data, offset);
    offset += 2;
    var map = {
      glyph1: [],
      rval: []
    };
    for (var i = 0; i < nTables; i++) {
      offset += 2;
      var length = bin.readUshort(data, offset);
      offset += 2;
      var coverage = bin.readUshort(data, offset);
      offset += 2;
      var format = coverage >>> 8;
      format &= 15;
      if (format == 0) offset = Typr.kern.readFormat0(data, offset, map); else throw "unknown kern table format: " + format;
    }
    return map;
  };

  Typr.kern.parseV1 = function(data, offset, length, font) {
    var bin = Typr._bin;
    bin.readFixed(data, offset);
    offset += 4;
    var nTables = bin.readUint(data, offset);
    offset += 4;
    var map = {
      glyph1: [],
      rval: []
    };
    for (var i = 0; i < nTables; i++) {
      bin.readUint(data, offset);
      offset += 4;
      var coverage = bin.readUshort(data, offset);
      offset += 2;
      bin.readUshort(data, offset);
      offset += 2;
      var format = coverage >>> 8;
      format &= 15;
      if (format == 0) offset = Typr.kern.readFormat0(data, offset, map); else throw "unknown kern table format: " + format;
    }
    return map;
  };

  Typr.kern.readFormat0 = function(data, offset, map) {
    var bin = Typr._bin;
    var pleft = -1;
    var nPairs = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    for (var j = 0; j < nPairs; j++) {
      var left = bin.readUshort(data, offset);
      offset += 2;
      var right = bin.readUshort(data, offset);
      offset += 2;
      var value = bin.readShort(data, offset);
      offset += 2;
      if (left != pleft) {
        map.glyph1.push(left);
        map.rval.push({
          glyph2: [],
          vals: []
        });
      }
      var rval = map.rval[map.rval.length - 1];
      rval.glyph2.push(right);
      rval.vals.push(value);
      pleft = left;
    }
    return offset;
  };

  Typr.loca = {};

  Typr.loca.parse = function(data, offset, length, font) {
    var bin = Typr._bin;
    var obj = [];
    var ver = font.head.indexToLocFormat;
    var len = font.maxp.numGlyphs + 1;
    if (ver == 0) for (var i = 0; i < len; i++) obj.push(bin.readUshort(data, offset + (i << 1)) << 1);
    if (ver == 1) for (var i = 0; i < len; i++) obj.push(bin.readUint(data, offset + (i << 2)));
    return obj;
  };

  Typr.maxp = {};

  Typr.maxp.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    var ver = bin.readUint(data, offset);
    offset += 4;
    obj.numGlyphs = bin.readUshort(data, offset);
    offset += 2;
    if (ver == 65536) {
      obj.maxPoints = bin.readUshort(data, offset);
      offset += 2;
      obj.maxContours = bin.readUshort(data, offset);
      offset += 2;
      obj.maxCompositePoints = bin.readUshort(data, offset);
      offset += 2;
      obj.maxCompositeContours = bin.readUshort(data, offset);
      offset += 2;
      obj.maxZones = bin.readUshort(data, offset);
      offset += 2;
      obj.maxTwilightPoints = bin.readUshort(data, offset);
      offset += 2;
      obj.maxStorage = bin.readUshort(data, offset);
      offset += 2;
      obj.maxFunctionDefs = bin.readUshort(data, offset);
      offset += 2;
      obj.maxInstructionDefs = bin.readUshort(data, offset);
      offset += 2;
      obj.maxStackElements = bin.readUshort(data, offset);
      offset += 2;
      obj.maxSizeOfInstructions = bin.readUshort(data, offset);
      offset += 2;
      obj.maxComponentElements = bin.readUshort(data, offset);
      offset += 2;
      obj.maxComponentDepth = bin.readUshort(data, offset);
      offset += 2;
    }
    return obj;
  };

  Typr.name = {};

  Typr.name.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    bin.readUshort(data, offset);
    offset += 2;
    var count = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    var offset0 = offset;
    for (var i = 0; i < count; i++) {
      var platformID = bin.readUshort(data, offset);
      offset += 2;
      var encodingID = bin.readUshort(data, offset);
      offset += 2;
      var languageID = bin.readUshort(data, offset);
      offset += 2;
      var nameID = bin.readUshort(data, offset);
      offset += 2;
      var length = bin.readUshort(data, offset);
      offset += 2;
      var noffset = bin.readUshort(data, offset);
      offset += 2;
      var plat = "p" + platformID;
      if (obj[plat] == null) obj[plat] = {};
      var names = [ "copyright", "fontFamily", "fontSubfamily", "ID", "fullName", "version", "postScriptName", "trademark", "manufacturer", "designer", "description", "urlVendor", "urlDesigner", "licence", "licenceURL", "---", "typoFamilyName", "typoSubfamilyName", "compatibleFull", "sampleText", "postScriptCID", "wwsFamilyName", "wwsSubfamilyName", "lightPalette", "darkPalette" ];
      var cname = names[nameID];
      var soff = offset0 + count * 12 + noffset;
      var str;
      if (platformID == 0) str = bin.readUnicode(data, soff, length / 2); else if (platformID == 3 && encodingID == 0) str = bin.readUnicode(data, soff, length / 2); else if (encodingID == 0) str = bin.readASCII(data, soff, length); else if (encodingID == 1) str = bin.readUnicode(data, soff, length / 2); else if (encodingID == 3) str = bin.readUnicode(data, soff, length / 2); else if (platformID == 1) {
        str = bin.readASCII(data, soff, length);
        console.log("reading unknown MAC encoding " + encodingID + " as ASCII");
      } else throw "unknown encoding " + encodingID + ", platformID: " + platformID;
      obj[plat][cname] = str;
      obj[plat]._lang = languageID;
    }
    for (var p in obj) if (obj[p].postScriptName != null && obj[p]._lang == 1033) return obj[p];
    for (var p in obj) if (obj[p].postScriptName != null && obj[p]._lang == 3084) return obj[p];
    for (var p in obj) if (obj[p].postScriptName != null) return obj[p];
    var tname;
    for (var p in obj) {
      tname = p;
      break;
    }
    console.log("returning name table with languageID " + obj[tname]._lang);
    return obj[tname];
  };

  Typr["OS/2"] = {};

  Typr["OS/2"].parse = function(data, offset, length) {
    var bin = Typr._bin;
    var ver = bin.readUshort(data, offset);
    offset += 2;
    var obj = {};
    if (ver == 0) Typr["OS/2"].version0(data, offset, obj); else if (ver == 1) Typr["OS/2"].version1(data, offset, obj); else if (ver == 2 || ver == 3 || ver == 4) Typr["OS/2"].version2(data, offset, obj); else if (ver == 5) Typr["OS/2"].version5(data, offset, obj); else throw "unknown OS/2 table version: " + ver;
    return obj;
  };

  Typr["OS/2"].version0 = function(data, offset, obj) {
    var bin = Typr._bin;
    obj.xAvgCharWidth = bin.readShort(data, offset);
    offset += 2;
    obj.usWeightClass = bin.readUshort(data, offset);
    offset += 2;
    obj.usWidthClass = bin.readUshort(data, offset);
    offset += 2;
    obj.fsType = bin.readUshort(data, offset);
    offset += 2;
    obj.ySubscriptXSize = bin.readShort(data, offset);
    offset += 2;
    obj.ySubscriptYSize = bin.readShort(data, offset);
    offset += 2;
    obj.ySubscriptXOffset = bin.readShort(data, offset);
    offset += 2;
    obj.ySubscriptYOffset = bin.readShort(data, offset);
    offset += 2;
    obj.ySuperscriptXSize = bin.readShort(data, offset);
    offset += 2;
    obj.ySuperscriptYSize = bin.readShort(data, offset);
    offset += 2;
    obj.ySuperscriptXOffset = bin.readShort(data, offset);
    offset += 2;
    obj.ySuperscriptYOffset = bin.readShort(data, offset);
    offset += 2;
    obj.yStrikeoutSize = bin.readShort(data, offset);
    offset += 2;
    obj.yStrikeoutPosition = bin.readShort(data, offset);
    offset += 2;
    obj.sFamilyClass = bin.readShort(data, offset);
    offset += 2;
    obj.panose = bin.readBytes(data, offset, 10);
    offset += 10;
    obj.ulUnicodeRange1 = bin.readUint(data, offset);
    offset += 4;
    obj.ulUnicodeRange2 = bin.readUint(data, offset);
    offset += 4;
    obj.ulUnicodeRange3 = bin.readUint(data, offset);
    offset += 4;
    obj.ulUnicodeRange4 = bin.readUint(data, offset);
    offset += 4;
    obj.achVendID = [ bin.readInt8(data, offset), bin.readInt8(data, offset + 1), bin.readInt8(data, offset + 2), bin.readInt8(data, offset + 3) ];
    offset += 4;
    obj.fsSelection = bin.readUshort(data, offset);
    offset += 2;
    obj.usFirstCharIndex = bin.readUshort(data, offset);
    offset += 2;
    obj.usLastCharIndex = bin.readUshort(data, offset);
    offset += 2;
    obj.sTypoAscender = bin.readShort(data, offset);
    offset += 2;
    obj.sTypoDescender = bin.readShort(data, offset);
    offset += 2;
    obj.sTypoLineGap = bin.readShort(data, offset);
    offset += 2;
    obj.usWinAscent = bin.readUshort(data, offset);
    offset += 2;
    obj.usWinDescent = bin.readUshort(data, offset);
    offset += 2;
    return offset;
  };

  Typr["OS/2"].version1 = function(data, offset, obj) {
    var bin = Typr._bin;
    offset = Typr["OS/2"].version0(data, offset, obj);
    obj.ulCodePageRange1 = bin.readUint(data, offset);
    offset += 4;
    obj.ulCodePageRange2 = bin.readUint(data, offset);
    offset += 4;
    return offset;
  };

  Typr["OS/2"].version2 = function(data, offset, obj) {
    var bin = Typr._bin;
    offset = Typr["OS/2"].version1(data, offset, obj);
    obj.sxHeight = bin.readShort(data, offset);
    offset += 2;
    obj.sCapHeight = bin.readShort(data, offset);
    offset += 2;
    obj.usDefault = bin.readUshort(data, offset);
    offset += 2;
    obj.usBreak = bin.readUshort(data, offset);
    offset += 2;
    obj.usMaxContext = bin.readUshort(data, offset);
    offset += 2;
    return offset;
  };

  Typr["OS/2"].version5 = function(data, offset, obj) {
    var bin = Typr._bin;
    offset = Typr["OS/2"].version2(data, offset, obj);
    obj.usLowerOpticalPointSize = bin.readUshort(data, offset);
    offset += 2;
    obj.usUpperOpticalPointSize = bin.readUshort(data, offset);
    offset += 2;
    return offset;
  };

  Typr.post = {};

  Typr.post.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    obj.version = bin.readFixed(data, offset);
    offset += 4;
    obj.italicAngle = bin.readFixed(data, offset);
    offset += 4;
    obj.underlinePosition = bin.readShort(data, offset);
    offset += 2;
    obj.underlineThickness = bin.readShort(data, offset);
    offset += 2;
    return obj;
  };

  Typr.SVG = {};

  Typr.SVG.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {
      entries: []
    };
    var offset0 = offset;
    bin.readUshort(data, offset);
    offset += 2;
    var svgDocIndexOffset = bin.readUint(data, offset);
    offset += 4;
    bin.readUint(data, offset);
    offset += 4;
    offset = svgDocIndexOffset + offset0;
    var numEntries = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < numEntries; i++) {
      var startGlyphID = bin.readUshort(data, offset);
      offset += 2;
      var endGlyphID = bin.readUshort(data, offset);
      offset += 2;
      var svgDocOffset = bin.readUint(data, offset);
      offset += 4;
      var svgDocLength = bin.readUint(data, offset);
      offset += 4;
      var sbuf = new Uint8Array(data.buffer, offset0 + svgDocOffset + svgDocIndexOffset, svgDocLength);
      var svg = bin.readUTF8(sbuf, 0, sbuf.length);
      for (var f = startGlyphID; f <= endGlyphID; f++) {
        obj.entries[f] = svg;
      }
    }
    return obj;
  };

  Typr.SVG.toPath = function(str) {
    var pth = {
      cmds: [],
      crds: []
    };
    if (str == null) return pth;
    var prsr = new DOMParser;
    var doc = prsr["parseFromString"](str, "image/svg+xml");
    var svg = doc.firstChild;
    while (svg.tagName != "svg") svg = svg.nextSibling;
    var vb = svg.getAttribute("viewBox");
    if (vb) vb = vb.trim().split(" ").map(parseFloat); else vb = [ 0, 0, 1e3, 1e3 ];
    Typr.SVG._toPath(svg.children, pth);
    for (var i = 0; i < pth.crds.length; i += 2) {
      var x = pth.crds[i], y = pth.crds[i + 1];
      x -= vb[0];
      y -= vb[1];
      y = -y;
      pth.crds[i] = x;
      pth.crds[i + 1] = y;
    }
    return pth;
  };

  Typr.SVG._toPath = function(nds, pth, fill) {
    for (var ni = 0; ni < nds.length; ni++) {
      var nd = nds[ni], tn = nd.tagName;
      var cfl = nd.getAttribute("fill");
      if (cfl == null) cfl = fill;
      if (tn == "g") Typr.SVG._toPath(nd.children, pth, cfl); else if (tn == "path") {
        pth.cmds.push(cfl ? cfl : "#000000");
        var d = nd.getAttribute("d");
        var toks = Typr.SVG._tokens(d);
        Typr.SVG._toksToPath(toks, pth);
        pth.cmds.push("X");
      } else if (tn == "defs") ; else console.log(tn, nd);
    }
  };

  Typr.SVG._tokens = function(d) {
    var ts = [], off = 0, rn = false, cn = "";
    while (off < d.length) {
      var cc = d.charCodeAt(off), ch = d.charAt(off);
      off++;
      var isNum = 48 <= cc && cc <= 57 || ch == "." || ch == "-";
      if (rn) {
        if (ch == "-") {
          ts.push(parseFloat(cn));
          cn = ch;
        } else if (isNum) cn += ch; else {
          ts.push(parseFloat(cn));
          if (ch != "," && ch != " ") ts.push(ch);
          rn = false;
        }
      } else {
        if (isNum) {
          cn = ch;
          rn = true;
        } else if (ch != "," && ch != " ") ts.push(ch);
      }
    }
    if (rn) ts.push(parseFloat(cn));
    return ts;
  };

  Typr.SVG._toksToPath = function(ts, pth) {
    var i = 0, x = 0, y = 0, ox = 0, oy = 0;
    var pc = {
      M: 2,
      L: 2,
      H: 1,
      V: 1,
      S: 4,
      C: 6
    };
    var cmds = pth.cmds, crds = pth.crds;
    while (i < ts.length) {
      var cmd = ts[i];
      i++;
      if (cmd == "z") {
        cmds.push("Z");
        x = ox;
        y = oy;
      } else {
        var cmu = cmd.toUpperCase();
        var ps = pc[cmu], reps = Typr.SVG._reps(ts, i, ps);
        for (var j = 0; j < reps; j++) {
          var xi = 0, yi = 0;
          if (cmd != cmu) {
            xi = x;
            yi = y;
          }
          if (cmu == "M") {
            x = xi + ts[i++];
            y = yi + ts[i++];
            cmds.push("M");
            crds.push(x, y);
            ox = x;
            oy = y;
          } else if (cmu == "L") {
            x = xi + ts[i++];
            y = yi + ts[i++];
            cmds.push("L");
            crds.push(x, y);
          } else if (cmu == "H") {
            x = xi + ts[i++];
            cmds.push("L");
            crds.push(x, y);
          } else if (cmu == "V") {
            y = yi + ts[i++];
            cmds.push("L");
            crds.push(x, y);
          } else if (cmu == "C") {
            var x1 = xi + ts[i++], y1 = yi + ts[i++], x2 = xi + ts[i++], y2 = yi + ts[i++], x3 = xi + ts[i++], y3 = yi + ts[i++];
            cmds.push("C");
            crds.push(x1, y1, x2, y2, x3, y3);
            x = x3;
            y = y3;
          } else if (cmu == "S") {
            var co = Math.max(crds.length - 4, 0);
            var x1 = x + x - crds[co], y1 = y + y - crds[co + 1];
            var x2 = xi + ts[i++], y2 = yi + ts[i++], x3 = xi + ts[i++], y3 = yi + ts[i++];
            cmds.push("C");
            crds.push(x1, y1, x2, y2, x3, y3);
            x = x3;
            y = y3;
          } else console.log("Unknown SVG command " + cmd);
        }
      }
    }
  };

  Typr.SVG._reps = function(ts, off, ps) {
    var i = off;
    while (i < ts.length) {
      if (typeof ts[i] == "string") break;
      i += ps;
    }
    return (i - off) / ps;
  };

  if (Typr == null) Typr = {};

  if (Typr.U == null) Typr.U = {};

  Typr.U.codeToGlyph = function(font, code) {
    var cmap = font.cmap;
    var tind = -1;
    if (cmap.p0e4 != null) tind = cmap.p0e4; else if (cmap.p3e1 != null) tind = cmap.p3e1; else if (cmap.p1e0 != null) tind = cmap.p1e0;
    if (tind == -1) throw "no familiar platform and encoding!";
    var tab = cmap.tables[tind];
    if (tab.format == 0) {
      if (code >= tab.map.length) return 0;
      return tab.map[code];
    } else if (tab.format == 4) {
      var sind = -1;
      for (var i = 0; i < tab.endCount.length; i++) if (code <= tab.endCount[i]) {
        sind = i;
        break;
      }
      if (sind == -1) return 0;
      if (tab.startCount[sind] > code) return 0;
      var gli = 0;
      if (tab.idRangeOffset[sind] != 0) gli = tab.glyphIdArray[code - tab.startCount[sind] + (tab.idRangeOffset[sind] >> 1) - (tab.idRangeOffset.length - sind)]; else gli = code + tab.idDelta[sind];
      return gli & 65535;
    } else if (tab.format == 12) {
      if (code > tab.groups[tab.groups.length - 1][1]) return 0;
      for (var i = 0; i < tab.groups.length; i++) {
        var grp = tab.groups[i];
        if (grp[0] <= code && code <= grp[1]) return grp[2] + (code - grp[0]);
      }
      return 0;
    } else throw "unknown cmap table format " + tab.format;
  };

  Typr.U.glyphToPath = function(font, gid) {
    var path = {
      cmds: [],
      crds: []
    };
    if (font.SVG && font.SVG.entries[gid]) {
      var p = font.SVG.entries[gid];
      if (p == null) return path;
      if (typeof p == "string") {
        p = Typr.SVG.toPath(p);
        font.SVG.entries[gid] = p;
      }
      return p;
    } else if (font.CFF) {
      var state = {
        x: 0,
        y: 0,
        stack: [],
        nStems: 0,
        haveWidth: false,
        width: font.CFF.Private ? font.CFF.Private.defaultWidthX : 0,
        open: false
      };
      Typr.U._drawCFF(font.CFF.CharStrings[gid], state, font.CFF, path);
    } else if (font.glyf) {
      Typr.U._drawGlyf(gid, font, path);
    }
    return path;
  };

  Typr.U._drawGlyf = function(gid, font, path) {
    var gl = font.glyf[gid];
    if (gl == null) gl = font.glyf[gid] = Typr.glyf._parseGlyf(font, gid);
    if (gl != null) {
      if (gl.noc > -1) Typr.U._simpleGlyph(gl, path); else Typr.U._compoGlyph(gl, font, path);
    }
  };

  Typr.U._simpleGlyph = function(gl, p) {
    for (var c = 0; c < gl.noc; c++) {
      var i0 = c == 0 ? 0 : gl.endPts[c - 1] + 1;
      var il = gl.endPts[c];
      for (var i = i0; i <= il; i++) {
        var pr = i == i0 ? il : i - 1;
        var nx = i == il ? i0 : i + 1;
        var onCurve = gl.flags[i] & 1;
        var prOnCurve = gl.flags[pr] & 1;
        var nxOnCurve = gl.flags[nx] & 1;
        var x = gl.xs[i], y = gl.ys[i];
        if (i == i0) {
          if (onCurve) {
            if (prOnCurve) Typr.U.P.moveTo(p, gl.xs[pr], gl.ys[pr]); else {
              Typr.U.P.moveTo(p, x, y);
              continue;
            }
          } else {
            if (prOnCurve) Typr.U.P.moveTo(p, gl.xs[pr], gl.ys[pr]); else Typr.U.P.moveTo(p, (gl.xs[pr] + x) / 2, (gl.ys[pr] + y) / 2);
          }
        }
        if (onCurve) {
          if (prOnCurve) Typr.U.P.lineTo(p, x, y);
        } else {
          if (nxOnCurve) Typr.U.P.qcurveTo(p, x, y, gl.xs[nx], gl.ys[nx]); else Typr.U.P.qcurveTo(p, x, y, (x + gl.xs[nx]) / 2, (y + gl.ys[nx]) / 2);
        }
      }
      Typr.U.P.closePath(p);
    }
  };

  Typr.U._compoGlyph = function(gl, font, p) {
    for (var j = 0; j < gl.parts.length; j++) {
      var path = {
        cmds: [],
        crds: []
      };
      var prt = gl.parts[j];
      Typr.U._drawGlyf(prt.glyphIndex, font, path);
      var m = prt.m;
      for (var i = 0; i < path.crds.length; i += 2) {
        var x = path.crds[i], y = path.crds[i + 1];
        p.crds.push(x * m.a + y * m.b + m.tx);
        p.crds.push(x * m.c + y * m.d + m.ty);
      }
      for (var i = 0; i < path.cmds.length; i++) p.cmds.push(path.cmds[i]);
    }
  };

  Typr.U._getGlyphClass = function(g, cd) {
    var intr = Typr._lctf.getInterval(cd, g);
    return intr == -1 ? 0 : cd[intr + 2];
  };

  Typr.U.getPairAdjustment = function(font, g1, g2) {
    if (font.GPOS) {
      var ltab = null;
      for (var i = 0; i < font.GPOS.featureList.length; i++) {
        var fl = font.GPOS.featureList[i];
        if (fl.tag == "kern") {
          for (var j = 0; j < fl.tab.length; j++) if (font.GPOS.lookupList[fl.tab[j]].ltype == 2) ltab = font.GPOS.lookupList[fl.tab[j]];
        }
      }
      if (ltab) {
        for (var i = 0; i < ltab.tabs.length; i++) {
          var tab = ltab.tabs[i];
          var ind = Typr._lctf.coverageIndex(tab.coverage, g1);
          if (ind == -1) continue;
          var adj;
          if (tab.format == 1) {
            var right = tab.pairsets[ind];
            for (var j = 0; j < right.length; j++) if (right[j].gid2 == g2) adj = right[j];
            if (adj == null) continue;
          } else if (tab.format == 2) {
            var c1 = Typr.U._getGlyphClass(g1, tab.classDef1);
            var c2 = Typr.U._getGlyphClass(g2, tab.classDef2);
            var adj = tab.matrix[c1][c2];
          }
          return adj.val1[2];
        }
      }
    }
    if (font.kern) {
      var ind1 = font.kern.glyph1.indexOf(g1);
      if (ind1 != -1) {
        var ind2 = font.kern.rval[ind1].glyph2.indexOf(g2);
        if (ind2 != -1) return font.kern.rval[ind1].vals[ind2];
      }
    }
    return 0;
  };

  Typr.U.stringToGlyphs = function(font, str) {
    var gls = [];
    for (var i = 0; i < str.length; i++) {
      var cc = str.codePointAt(i);
      if (cc > 65535) i++;
      gls.push(Typr.U.codeToGlyph(font, cc));
    }
    var gsub = font["GSUB"];
    if (gsub == null) return gls;
    var llist = gsub.lookupList, flist = gsub.featureList;
    var wsep = '\n\t" ,.:;!?()  \u060c';
    var R = "\u0622\u0623\u0624\u0625\u0627\u0629\u062f\u0630\u0631\u0632\u0648\u0671\u0672\u0673\u0675\u0676\u0677\u0688\u0689\u068a\u068b\u068c\u068d\u068e\u068f\u0690\u0691\u0692\u0693\u0694\u0695\u0696\u0697\u0698\u0699\u06c0\u06c3\u06c4\u06c5\u06c6\u06c7\u06c8\u06c9\u06ca\u06cb\u06cd\u06cf\u06d2\u06d3\u06d5\u06ee\u06ef\u0710\u0715\u0716\u0717\u0718\u0719\u071e\u0728\u072a\u072c\u072f\u074d\u0759\u075a\u075b\u076b\u076c\u0771\u0773\u0774\u0778\u0779\u0840\u0846\u0847\u0849\u0854\u0867\u0869\u086a\u08aa\u08ab\u08ac\u08ae\u08b1\u08b2\u08b9\u0ac5\u0ac7\u0ac9\u0aca\u0ace\u0acf\u0ad0\u0ad1\u0ad2\u0add\u0ae1\u0ae4\u0aef\u0b81\u0b83\u0b84\u0b85\u0b89\u0b8c\u0b8e\u0b8f\u0b91\u0ba9\u0baa\u0bab\u0bac";
    var L = "\ua872\u0acd\u0ad7";
    for (var ci = 0; ci < gls.length; ci++) {
      var gl = gls[ci];
      var slft = ci == 0 || wsep.indexOf(str[ci - 1]) != -1;
      var srgt = ci == gls.length - 1 || wsep.indexOf(str[ci + 1]) != -1;
      if (!slft && R.indexOf(str[ci - 1]) != -1) slft = true;
      if (!srgt && R.indexOf(str[ci]) != -1) srgt = true;
      if (!srgt && L.indexOf(str[ci + 1]) != -1) srgt = true;
      if (!slft && L.indexOf(str[ci]) != -1) slft = true;
      var feat = null;
      if (slft) feat = srgt ? "isol" : "init"; else feat = srgt ? "fina" : "medi";
      for (var fi = 0; fi < flist.length; fi++) {
        if (flist[fi].tag != feat) continue;
        for (var ti = 0; ti < flist[fi].tab.length; ti++) {
          var tab = llist[flist[fi].tab[ti]];
          if (tab.ltype != 1) continue;
          Typr.U._applyType1(gls, ci, tab);
        }
      }
    }
    var cligs = [ "rlig", "liga", "mset" ];
    for (var ci = 0; ci < gls.length; ci++) {
      var gl = gls[ci];
      var rlim = Math.min(3, gls.length - ci - 1);
      for (var fi = 0; fi < flist.length; fi++) {
        var fl = flist[fi];
        if (cligs.indexOf(fl.tag) == -1) continue;
        for (var ti = 0; ti < fl.tab.length; ti++) {
          var tab = llist[fl.tab[ti]];
          for (var j = 0; j < tab.tabs.length; j++) {
            if (tab.tabs[j] == null) continue;
            var ind = Typr._lctf.coverageIndex(tab.tabs[j].coverage, gl);
            if (ind == -1) continue;
            if (tab.ltype == 4) {
              var vals = tab.tabs[j].vals[ind];
              for (var k = 0; k < vals.length; k++) {
                var lig = vals[k], rl = lig.chain.length;
                if (rl > rlim) continue;
                var good = true;
                for (var l = 0; l < rl; l++) if (lig.chain[l] != gls[ci + (1 + l)]) good = false;
                if (!good) continue;
                gls[ci] = lig.nglyph;
                for (var l = 0; l < rl; l++) gls[ci + l + 1] = -1;
              }
            } else if (tab.ltype == 5) {
              var ltab = tab.tabs[j];
              if (ltab.fmt != 2) continue;
              var cind = Typr._lctf.getInterval(ltab.cDef, gl);
              var cls = ltab.cDef[cind + 2], scs = ltab.scset[cls];
              for (var i = 0; i < scs.length; i++) {
                var sc = scs[i], inp = sc.input;
                if (inp.length > rlim) continue;
                var good = true;
                for (var l = 0; l < inp.length; l++) {
                  var cind2 = Typr._lctf.getInterval(ltab.cDef, gls[ci + 1 + l]);
                  if (cind == -1 && ltab.cDef[cind2 + 2] != inp[l]) {
                    good = false;
                    break;
                  }
                }
                if (!good) continue;
                var lrs = sc.substLookupRecords;
                for (var k = 0; k < lrs.length; k += 2) {
                  lrs[k];
                  lrs[k + 1];
                }
              }
            }
          }
        }
      }
    }
    return gls;
  };

  Typr.U._applyType1 = function(gls, ci, tab) {
    var gl = gls[ci];
    for (var j = 0; j < tab.tabs.length; j++) {
      var ttab = tab.tabs[j];
      var ind = Typr._lctf.coverageIndex(ttab.coverage, gl);
      if (ind == -1) continue;
      if (ttab.fmt == 1) gls[ci] = gls[ci] + ttab.delta; else gls[ci] = ttab.newg[ind];
    }
  };

  Typr.U.glyphsToPath = function(font, gls, clr) {
    var tpath = {
      cmds: [],
      crds: []
    };
    var x = 0;
    for (var i = 0; i < gls.length; i++) {
      var gid = gls[i];
      if (gid == -1) continue;
      var gid2 = i < gls.length - 1 && gls[i + 1] != -1 ? gls[i + 1] : 0;
      var path = Typr.U.glyphToPath(font, gid);
      for (var j = 0; j < path.crds.length; j += 2) {
        tpath.crds.push(path.crds[j] + x);
        tpath.crds.push(path.crds[j + 1]);
      }
      if (clr) tpath.cmds.push(clr);
      for (var j = 0; j < path.cmds.length; j++) tpath.cmds.push(path.cmds[j]);
      if (clr) tpath.cmds.push("X");
      x += font.hmtx.aWidth[gid];
      if (i < gls.length - 1) x += Typr.U.getPairAdjustment(font, gid, gid2);
    }
    return tpath;
  };

  Typr.U.pathToSVG = function(path, prec) {
    if (prec == null) prec = 5;
    var out = [], co = 0, lmap = {
      M: 2,
      L: 2,
      Q: 4,
      C: 6
    };
    for (var i = 0; i < path.cmds.length; i++) {
      var cmd = path.cmds[i], cn = co + (lmap[cmd] ? lmap[cmd] : 0);
      out.push(cmd);
      while (co < cn) {
        var c = path.crds[co++];
        out.push(parseFloat(c.toFixed(prec)) + (co == cn ? "" : " "));
      }
    }
    return out.join("");
  };

  Typr.U.pathToContext = function(path, ctx) {
    var c = 0, crds = path.crds;
    for (var j = 0; j < path.cmds.length; j++) {
      var cmd = path.cmds[j];
      if (cmd == "M") {
        ctx.moveTo(crds[c], crds[c + 1]);
        c += 2;
      } else if (cmd == "L") {
        ctx.lineTo(crds[c], crds[c + 1]);
        c += 2;
      } else if (cmd == "C") {
        ctx.bezierCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3], crds[c + 4], crds[c + 5]);
        c += 6;
      } else if (cmd == "Q") {
        ctx.quadraticCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3]);
        c += 4;
      } else if (cmd.charAt(0) == "#") {
        ctx.beginPath();
        ctx.fillStyle = cmd;
      } else if (cmd == "Z") {
        ctx.closePath();
      } else if (cmd == "X") {
        ctx.fill();
      }
    }
  };

  Typr.U.P = {};

  Typr.U.P.moveTo = function(p, x, y) {
    p.cmds.push("M");
    p.crds.push(x, y);
  };

  Typr.U.P.lineTo = function(p, x, y) {
    p.cmds.push("L");
    p.crds.push(x, y);
  };

  Typr.U.P.curveTo = function(p, a, b, c, d, e, f) {
    p.cmds.push("C");
    p.crds.push(a, b, c, d, e, f);
  };

  Typr.U.P.qcurveTo = function(p, a, b, c, d) {
    p.cmds.push("Q");
    p.crds.push(a, b, c, d);
  };

  Typr.U.P.closePath = function(p) {
    p.cmds.push("Z");
  };

  Typr.U._drawCFF = function(cmds, state, font, p) {
    var stack = state.stack;
    var nStems = state.nStems, haveWidth = state.haveWidth, width = state.width, open = state.open;
    var i = 0;
    var x = state.x, y = state.y, c1x = 0, c1y = 0, c2x = 0, c2y = 0, c3x = 0, c3y = 0, c4x = 0, c4y = 0, jpx = 0, jpy = 0;
    var o = {
      val: 0,
      size: 0
    };
    while (i < cmds.length) {
      Typr.CFF.getCharString(cmds, i, o);
      var v = o.val;
      i += o.size;
      if (v == "o1" || v == "o18") {
        var hasWidthArg;
        hasWidthArg = stack.length % 2 !== 0;
        if (hasWidthArg && !haveWidth) {
          width = stack.shift() + font.Private.nominalWidthX;
        }
        nStems += stack.length >> 1;
        stack.length = 0;
        haveWidth = true;
      } else if (v == "o3" || v == "o23") {
        var hasWidthArg;
        hasWidthArg = stack.length % 2 !== 0;
        if (hasWidthArg && !haveWidth) {
          width = stack.shift() + font.Private.nominalWidthX;
        }
        nStems += stack.length >> 1;
        stack.length = 0;
        haveWidth = true;
      } else if (v == "o4") {
        if (stack.length > 1 && !haveWidth) {
          width = stack.shift() + font.Private.nominalWidthX;
          haveWidth = true;
        }
        if (open) Typr.U.P.closePath(p);
        y += stack.pop();
        Typr.U.P.moveTo(p, x, y);
        open = true;
      } else if (v == "o5") {
        while (stack.length > 0) {
          x += stack.shift();
          y += stack.shift();
          Typr.U.P.lineTo(p, x, y);
        }
      } else if (v == "o6" || v == "o7") {
        var count = stack.length;
        var isX = v == "o6";
        for (var j = 0; j < count; j++) {
          var sval = stack.shift();
          if (isX) x += sval; else y += sval;
          isX = !isX;
          Typr.U.P.lineTo(p, x, y);
        }
      } else if (v == "o8" || v == "o24") {
        var count = stack.length;
        var index = 0;
        while (index + 6 <= count) {
          c1x = x + stack.shift();
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          x = c2x + stack.shift();
          y = c2y + stack.shift();
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
          index += 6;
        }
        if (v == "o24") {
          x += stack.shift();
          y += stack.shift();
          Typr.U.P.lineTo(p, x, y);
        }
      } else if (v == "o11") break; else if (v == "o1234" || v == "o1235" || v == "o1236" || v == "o1237") {
        if (v == "o1234") {
          c1x = x + stack.shift();
          c1y = y;
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          jpx = c2x + stack.shift();
          jpy = c2y;
          c3x = jpx + stack.shift();
          c3y = c2y;
          c4x = c3x + stack.shift();
          c4y = y;
          x = c4x + stack.shift();
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
          Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
        }
        if (v == "o1235") {
          c1x = x + stack.shift();
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          jpx = c2x + stack.shift();
          jpy = c2y + stack.shift();
          c3x = jpx + stack.shift();
          c3y = jpy + stack.shift();
          c4x = c3x + stack.shift();
          c4y = c3y + stack.shift();
          x = c4x + stack.shift();
          y = c4y + stack.shift();
          stack.shift();
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
          Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
        }
        if (v == "o1236") {
          c1x = x + stack.shift();
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          jpx = c2x + stack.shift();
          jpy = c2y;
          c3x = jpx + stack.shift();
          c3y = c2y;
          c4x = c3x + stack.shift();
          c4y = c3y + stack.shift();
          x = c4x + stack.shift();
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
          Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
        }
        if (v == "o1237") {
          c1x = x + stack.shift();
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          jpx = c2x + stack.shift();
          jpy = c2y + stack.shift();
          c3x = jpx + stack.shift();
          c3y = jpy + stack.shift();
          c4x = c3x + stack.shift();
          c4y = c3y + stack.shift();
          if (Math.abs(c4x - x) > Math.abs(c4y - y)) {
            x = c4x + stack.shift();
          } else {
            y = c4y + stack.shift();
          }
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
          Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
        }
      } else if (v == "o14") {
        if (stack.length > 0 && !haveWidth) {
          width = stack.shift() + font.nominalWidthX;
          haveWidth = true;
        }
        if (stack.length == 4) {
          var adx = stack.shift();
          var ady = stack.shift();
          var bchar = stack.shift();
          var achar = stack.shift();
          var bind = Typr.CFF.glyphBySE(font, bchar);
          var aind = Typr.CFF.glyphBySE(font, achar);
          Typr.U._drawCFF(font.CharStrings[bind], state, font, p);
          state.x = adx;
          state.y = ady;
          Typr.U._drawCFF(font.CharStrings[aind], state, font, p);
        }
        if (open) {
          Typr.U.P.closePath(p);
          open = false;
        }
      } else if (v == "o19" || v == "o20") {
        var hasWidthArg;
        hasWidthArg = stack.length % 2 !== 0;
        if (hasWidthArg && !haveWidth) {
          width = stack.shift() + font.Private.nominalWidthX;
        }
        nStems += stack.length >> 1;
        stack.length = 0;
        haveWidth = true;
        i += nStems + 7 >> 3;
      } else if (v == "o21") {
        if (stack.length > 2 && !haveWidth) {
          width = stack.shift() + font.Private.nominalWidthX;
          haveWidth = true;
        }
        y += stack.pop();
        x += stack.pop();
        if (open) Typr.U.P.closePath(p);
        Typr.U.P.moveTo(p, x, y);
        open = true;
      } else if (v == "o22") {
        if (stack.length > 1 && !haveWidth) {
          width = stack.shift() + font.Private.nominalWidthX;
          haveWidth = true;
        }
        x += stack.pop();
        if (open) Typr.U.P.closePath(p);
        Typr.U.P.moveTo(p, x, y);
        open = true;
      } else if (v == "o25") {
        while (stack.length > 6) {
          x += stack.shift();
          y += stack.shift();
          Typr.U.P.lineTo(p, x, y);
        }
        c1x = x + stack.shift();
        c1y = y + stack.shift();
        c2x = c1x + stack.shift();
        c2y = c1y + stack.shift();
        x = c2x + stack.shift();
        y = c2y + stack.shift();
        Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
      } else if (v == "o26") {
        if (stack.length % 2) {
          x += stack.shift();
        }
        while (stack.length > 0) {
          c1x = x;
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          x = c2x;
          y = c2y + stack.shift();
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
        }
      } else if (v == "o27") {
        if (stack.length % 2) {
          y += stack.shift();
        }
        while (stack.length > 0) {
          c1x = x + stack.shift();
          c1y = y;
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          x = c2x + stack.shift();
          y = c2y;
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
        }
      } else if (v == "o10" || v == "o29") {
        var obj = v == "o10" ? font.Private : font;
        if (stack.length == 0) {
          console.log("error: empty stack");
        } else {
          var ind = stack.pop();
          var subr = obj.Subrs[ind + obj.Bias];
          state.x = x;
          state.y = y;
          state.nStems = nStems;
          state.haveWidth = haveWidth;
          state.width = width;
          state.open = open;
          Typr.U._drawCFF(subr, state, font, p);
          x = state.x;
          y = state.y;
          nStems = state.nStems;
          haveWidth = state.haveWidth;
          width = state.width;
          open = state.open;
        }
      } else if (v == "o30" || v == "o31") {
        var count, count1 = stack.length;
        var index = 0;
        var alternate = v == "o31";
        count = count1 & -3;
        index += count1 - count;
        while (index < count) {
          if (alternate) {
            c1x = x + stack.shift();
            c1y = y;
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            y = c2y + stack.shift();
            if (count - index == 5) {
              x = c2x + stack.shift();
              index++;
            } else x = c2x;
            alternate = false;
          } else {
            c1x = x;
            c1y = y + stack.shift();
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            x = c2x + stack.shift();
            if (count - index == 5) {
              y = c2y + stack.shift();
              index++;
            } else y = c2y;
            alternate = true;
          }
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
          index += 4;
        }
      } else if ((v + "").charAt(0) == "o") {
        console.log("Unknown operation: " + v, cmds);
        throw v;
      } else stack.push(v);
    }
    state.x = x;
    state.y = y;
    state.nStems = nStems;
    state.haveWidth = haveWidth;
    state.width = width;
    state.open = open;
  };

  var typr_js = Typr;

  const Typr$1 = getDefaultExportFromCjs(typr_js);

  const RETRY_DELAY_MS = 500;

  const FAILED = retry => ({
    result: {
      status: "failed"
    },
    retry: retry
  });

  async function fetchAnnouncement(transport, baseUrl, options = {}) {
    const attempt = async () => {
      let body;
      try {
        const response = await transport.send({
          url: baseUrl + protocol.ANNOUNCEMENT_PATH,
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({}),
          timeoutMs: 8e3
        });
        body = response.body;
      } catch {
        return FAILED(true);
      }
      let parsed;
      try {
        parsed = protocol.AnnouncementResponseSchema.safeParse(JSON.parse(body));
      } catch {
        return FAILED(false);
      }
      if (!parsed.success) return FAILED(false);
      if (parsed.data.code !== protocol.AiAskCode.Ok) return FAILED(parsed.data.code === protocol.AiAskCode.Busy);
      const {seq: seq, updatedAt: updatedAt, announcement: announcement} = parsed.data;
      return {
        result: {
          status: "ok",
          announcement: announcement ? {
            seq: seq,
            updatedAt: updatedAt,
            ...announcement
          } : null
        },
        retry: false
      };
    };
    const first = await attempt();
    if (!first.retry) return first.result;
    await new Promise(resolve => setTimeout(resolve, options.retryDelayMs ?? RETRY_DELAY_MS));
    return (await attempt()).result;
  }

  const MESSAGE$1 = {
    [protocol.AiAskCode.Invalid]: "\u7528\u6237\u540d\u3001\u5bc6\u7801\u6216\u4eba\u673a\u9a8c\u8bc1\u65e0\u6548",
    [protocol.AiAskCode.Unauthorized]: "\u7528\u6237\u540d\u6216\u5bc6\u7801\u9519\u8bef",
    [protocol.AiAskCode.RateLimited]: "\u64cd\u4f5c\u592a\u9891\u7e41\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5",
    [protocol.AiAskCode.Busy]: "\u670d\u52a1\u7e41\u5fd9\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5"
  };

  async function authenticateCard(transport, code, baseUrl) {
    const trimmedCode = code.trim();
    if (!trimmedCode) return {
      message: "\u8bf7\u8f93\u5165\u5361\u5bc6"
    };
    try {
      const res = await transport.send({
        url: baseUrl + protocol.AUTH_CARD_PATH,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": protocol.randomUuid()
        },
        body: JSON.stringify({
          code: trimmedCode
        }),
        timeoutMs: 8e3
      });
      const parsed = protocol.AuthResponseSchema.safeParse(JSON.parse(res.body));
      if (!parsed.success) return {
        message: MESSAGE$1[protocol.AiAskCode.Busy]
      };
      if (parsed.data.code === protocol.AiAskCode.Ok && parsed.data.token) return {
        token: parsed.data.token,
        message: "ok"
      };
      return {
        message: MESSAGE$1[parsed.data.code] ?? MESSAGE$1[protocol.AiAskCode.Busy]
      };
    } catch {
      return {
        message: MESSAGE$1[protocol.AiAskCode.Busy]
      };
    }
  }

  function registerPrecheck(username, password, email) {
    if (username.length < 3 || username.length > 32) return `\u7528\u6237\u540d\u8981 3-32 \u4f4d\uff0c\u73b0\u5728\u662f ${username.length} \u4f4d`;
    if (password.length < 8) return `\u5bc6\u7801\u81f3\u5c11 8 \u4f4d\uff0c\u73b0\u5728\u662f ${password.length} \u4f4d`;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email)) return "\u90ae\u7bb1\u683c\u5f0f\u4e0d\u5bf9\uff1b\u4e0d\u60f3\u586b\u5c31\u7559\u7a7a";
    return null;
  }

  async function authenticate(transport, mode, username, password, baseUrl, captchaToken, email) {
    const trimmedEmail = (email == null ? void 0 : email.trim()) ?? "";
    if (!username) return {
      message: "\u8bf7\u8f93\u5165\u7528\u6237\u540d"
    };
    if (!password) return {
      message: "\u8bf7\u8f93\u5165\u5bc6\u7801"
    };
    if (mode === "register") {
      const problem = registerPrecheck(username, password, trimmedEmail);
      if (problem) return {
        message: problem
      };
    }
    const verifiedCaptchaToken = captchaToken == null ? void 0 : captchaToken.trim();
    if (mode === "register" && !verifiedCaptchaToken) return {
      message: "\u8bf7\u5148\u5b8c\u6210\u4eba\u673a\u9a8c\u8bc1"
    };
    try {
      const res = await transport.send({
        url: baseUrl + (mode === "register" ? protocol.AUTH_REGISTER_PATH : protocol.AUTH_LOGIN_PATH),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": protocol.randomUuid()
        },
        body: JSON.stringify(mode === "register" ? {
          username: username,
          password: password,
          captchaToken: verifiedCaptchaToken,
          ...trimmedEmail ? {
            email: trimmedEmail
          } : {}
        } : {
          username: username,
          password: password
        }),
        timeoutMs: 8e3
      });
      const parsed = protocol.AuthResponseSchema.safeParse(JSON.parse(res.body));
      if (!parsed.success) return {
        message: MESSAGE$1[protocol.AiAskCode.Busy]
      };
      const {code: code, token: token, reason: reason} = parsed.data;
      if (code === protocol.AiAskCode.Ok && token) return {
        token: token,
        message: "ok"
      };
      if (reason === "taken") return {
        message: trimmedEmail ? "\u7528\u6237\u540d\u6216\u90ae\u7bb1\u5df2\u88ab\u5360\u7528\uff0c\u6362\u4e00\u4e2a\u518d\u8bd5" : "\u7528\u6237\u540d\u5df2\u88ab\u5360\u7528\uff0c\u6362\u4e00\u4e2a\u518d\u8bd5"
      };
      if (reason === "disabled") return {
        message: "\u8be5\u8d26\u53f7\u5df2\u88ab\u7981\u7528\uff0c\u5bc6\u7801\u662f\u5bf9\u7684\u3002\u8bf7\u8054\u7cfb\u5ba2\u670d\u5904\u7406"
      };
      return {
        message: MESSAGE$1[code] ?? MESSAGE$1[protocol.AiAskCode.Busy]
      };
    } catch {
      return {
        message: MESSAGE$1[protocol.AiAskCode.Busy]
      };
    }
  }

  const PAGED_PATH = "/exam-ans/exam/test/reVersionTestStartNew";

  const CHA0XING_EXAM_PREVIEW_PATH = "/exam-ans/mooc2/exam/preview";

  const CHA0XING_EXAM_RESUME_KEY = "aiask_chaoxing_exam_resume_v1";

  const RESUME_TTL_MS = 2 * 6e4;

  const OPTION_ID_PATTERN = /^option-(0|[1-9][0-9]*)$/;

  const TYPE_SELECTOR = 'input[name^="type"]:not(#type):not([name^="typeName"])';

  const CHOICE_SELECTOR = ".stem_answer .answerBg";

  const SELECTED_SELECTOR = ".check_answer, .check_answer_dx";

  function isChaoxingHost(hostname) {
    return hostname === "chaoxing.com" || hostname.endsWith(".chaoxing.com");
  }

  function parseResumeMarker(value) {
    if (!value) return null;
    try {
      const marker = JSON.parse(value);
      if (marker.v !== 1 || typeof marker.origin !== "string" || typeof marker.sourceHref !== "string" || typeof marker.createdAt !== "number" || typeof marker.expiresAt !== "number") return null;
      return marker;
    } catch {
      return null;
    }
  }

  function storageValue(storage, key) {
    try {
      return storage.getItem(key);
    } catch {
      return null;
    }
  }

  function shouldAutoResumeChaoxingExam(location2, storage, now = Date.now()) {
    if (!isChaoxingHost(location2.hostname) || location2.pathname !== CHA0XING_EXAM_PREVIEW_PATH) return false;
    const marker = parseResumeMarker(storageValue(storage, CHA0XING_EXAM_RESUME_KEY));
    return marker !== null && marker.origin === location2.origin && marker.createdAt <= now + 3e4 && marker.expiresAt > now;
  }

  function clearChaoxingExamAutoResume(storage) {
    try {
      storage.removeItem(CHA0XING_EXAM_RESUME_KEY);
    } catch {}
  }

  function defaultDelay(ms, signal) {
    if (signal.aborted) return Promise.resolve(false);
    return new Promise(resolve => {
      const timer = setTimeout(() => {
        signal.removeEventListener("abort", abort);
        resolve(true);
      }, ms);
      const abort = () => {
        clearTimeout(timer);
        resolve(false);
      };
      signal.addEventListener("abort", abort, {
        once: true
      });
    });
  }

  function normalizedText$1(element) {
    return (element.textContent ?? "").replace(/\s+/g, "").trim();
  }

  function clickElement(element) {
    const onclick = element.getAttribute("onclick") ?? "";
    if (/finalSubmit\s*\(/i.test(onclick)) return false;
    const clickable = element;
    if (typeof clickable.click !== "function") return false;
    clickable.click();
    return true;
  }

  function selected(target) {
    return target.querySelector(SELECTED_SELECTOR) !== null;
  }

  function choiceTargets(target) {
    return Array.from(target.querySelectorAll(CHOICE_SELECTOR));
  }

  function desiredChoiceIndexes(plan, targetCount) {
    if (plan.operations.length === 0 || plan.operations.some(operation => operation.kind !== "choose")) return null;
    const indexes = plan.operations.map(operation => {
      if (operation.kind !== "choose") return -1;
      const match = OPTION_ID_PATTERN.exec(operation.optionId);
      return match ? Number(match[1]) : -1;
    });
    if (indexes.some(index => index < 0 || index >= targetCount) || new Set(indexes).size !== indexes.length) return null;
    return indexes;
  }

  function questionType(target) {
    const typeTarget = target.querySelector(TYPE_SELECTOR);
    const view = target.ownerDocument.defaultView;
    return view && typeTarget instanceof view.HTMLInputElement ? typeTarget.value : (typeTarget == null ? void 0 : typeTarget.getAttribute("value")) ?? "";
  }

  function isChaoxingExamPreviewReady(document2, resolveUeditorBodies2) {
    const questions = Array.from(document2.querySelectorAll(".questionLi"));
    if (questions.length === 0) return false;
    for (const question of questions) {
      if (!question.querySelector("h3.mark_name")) return false;
      const type = questionType(question);
      if (type === "0" || type === "1" || type === "3") {
        const targets = question.querySelectorAll(CHOICE_SELECTOR);
        const contents = question.querySelectorAll(".stem_answer .answerBg .answer_p");
        if (targets.length === 0 || targets.length !== contents.length) return false;
        continue;
      }
      if (type !== "2" && type !== "4") return false;
      const textareas = Array.from(question.querySelectorAll(type === "2" ? 'textarea[name^="answerEditor"]' : 'textarea[id^="answer"][name^="answer"]:not([id^="answerEditor"])'));
      if (textareas.length === 0) return false;
      let bodies;
      try {
        bodies = resolveUeditorBodies2(textareas);
      } catch {
        return false;
      }
      if (bodies.length !== textareas.length || bodies.some(body => {
        var _a;
        return !(body == null ? void 0 : body.isConnected) || ((_a = body.getAttribute("contenteditable")) == null ? void 0 : _a.toLowerCase()) !== "true";
      })) return false;
    }
    return true;
  }

  function safeSaveButtons(target) {
    const candidates = Array.from(target.querySelectorAll(".saveButtonClass"));
    if (candidates.length === 0) return null;
    for (const button of candidates) {
      if (!button.isConnected) return null;
      const label = `${button.textContent ?? ""} ${button.getAttribute("value") ?? ""}`.replace(/\s+/g, "").trim();
      const onclick = button.getAttribute("onclick") ?? "";
      if (!label.includes("\u4fdd\u5b58") || /\u4ea4\u5377|\u63d0\u4ea4\u8bd5\u5377/.test(label)) return null;
      if (/finalSubmit\s*\(/i.test(onclick)) return null;
    }
    return candidates;
  }

  class ChaoxingExamRuntime {
    constructor(options = {}) {
      __publicField(this, "questions", new Map);
      this.options = options;
    }
    beginCapture() {
      this.questions.clear();
    }
    registerQuestion(registration) {
      this.questions.set(registration.path, registration);
    }
    async prepareStart(ctx) {
      var _a, _b, _c;
      if (ctx.signal.aborted || !isChaoxingHost(ctx.location.hostname) || ctx.location.pathname !== PAGED_PATH) return "ready";
      const previewLinks = Array.from(ctx.document.querySelectorAll("a.completeBtn")).filter(element => element.isConnected && normalizedText$1(element) === "\u6574\u5377\u9884\u89c8" && /^\s*topreview\s*\(\s*\)\s*;?\s*$/.test(element.getAttribute("onclick") ?? ""));
      if (previewLinks.length !== 1) return "ready";
      const storage = (_a = ctx.document.defaultView) == null ? void 0 : _a.sessionStorage;
      if (!storage) return "ready";
      const now = ((_c = (_b = this.options).now) == null ? void 0 : _c.call(_b)) ?? Date.now();
      const marker = {
        v: 1,
        origin: ctx.location.origin,
        sourceHref: ctx.location.href,
        createdAt: now,
        expiresAt: now + RESUME_TTL_MS
      };
      try {
        storage.setItem(CHA0XING_EXAM_RESUME_KEY, JSON.stringify(marker));
        if (!storageValue(storage, CHA0XING_EXAM_RESUME_KEY)) return "ready";
        const previewLink = previewLinks[0];
        if (!previewLink || !clickElement(previewLink)) {
          clearChaoxingExamAutoResume(storage);
          return "ready";
        }
        return "navigating";
      } catch {
        clearChaoxingExamAutoResume(storage);
        return "ready";
      }
    }
    preparePlan(plan, signal) {
      if (signal.aborted) return false;
      const question = this.questions.get(plan.path);
      if (!(question == null ? void 0 : question.target.isConnected)) return false;
      if (question.mode !== "preview") return true;
      if (plan.operations.every(operation => operation.kind === "write")) return plan.operations.length > 0 && (questionType(question.target) === "2" || questionType(question.target) === "4");
      const targets = choiceTargets(question.target);
      const desired = desiredChoiceIndexes(plan, targets.length);
      const type = questionType(question.target);
      if (!desired || type !== "0" && type !== "1" && type !== "3") return false;
      if (type === "0" || type === "3") return desired.length === 1;
      const desiredSet = new Set(desired);
      for (const [index, target] of targets.entries()) {
        if (selected(target) && !desiredSet.has(index) && !clickElement(target)) return false;
      }
      return targets.every((target, index) => !selected(target) || desiredSet.has(index));
    }
    async commitPlan(plan, signal) {
      if (signal.aborted) return false;
      const question = this.questions.get(plan.path);
      if (!(question == null ? void 0 : question.target.isConnected)) return false;
      if (question.mode !== "preview") return true;
      if (plan.operations.every(operation => operation.kind === "write")) {
        const type2 = questionType(question.target);
        if (plan.operations.length === 0 || type2 !== "2" && type2 !== "4") return false;
        const saves = safeSaveButtons(question.target);
        const expectedSaves = type2 === "4" ? 1 : plan.operations.length;
        if (!saves || saves.length !== expectedSaves) return false;
        for (const save of saves) if (!clickElement(save)) return false;
        return (this.options.delay ?? defaultDelay)(250, signal);
      }
      const targets = choiceTargets(question.target);
      const desired = desiredChoiceIndexes(plan, targets.length);
      const type = questionType(question.target);
      if (!desired || type !== "0" && type !== "1" && type !== "3") return false;
      const desiredSet = new Set(desired);
      if (!targets.every((target, index) => selected(target) === desiredSet.has(index))) return false;
      return (this.options.delay ?? defaultDelay)(type === "1" ? 600 : 250, signal);
    }
    dispose() {
      this.questions.clear();
    }
  }

  const CHA0XING_PACKAGE_IDS = Object.freeze({
    studentstudy: "chaoxing-studentstudy",
    examStudent: "chaoxing-exam-student",
    newChapter: "chaoxing-new-chapter",
    oldChapter: "chaoxing-old-chapter",
    oldHomework: "chaoxing-old-homework",
    dowork: "chaoxing-dowork"
  });

  const CHA0XING_ANSWERABLE_PATH = /work\/(doHomeWork|dowork|view)|studentstudy|exam|test\//iu;

  const CHA0XING_UNROUTED_PACKAGE_ID = protocol.SENTINEL_PACKAGE_IDS[0];

  const CHA0XING_STUDENTSTUDY_PATHS = [ "/mycourse/studentstudy", "/mooc-ans/mycourse/studentstudy" ];

  function objectValue(value) {
    return value !== null && typeof value === "object";
  }

  function elementValue(value) {
    if (!objectValue(value) || typeof value.tagName !== "string" || typeof value.getAttribute !== "function") return null;
    return value;
  }

  function ueditorApi(document2) {
    var _a, _b;
    let candidate;
    try {
      candidate = (_a = pageWindowForDocument(document2)) == null ? void 0 : _a.UE;
    } catch {
      candidate = null;
    }
    if (!candidate) {
      try {
        if (typeof unsafeWindow !== "undefined") candidate = unsafeWindow == null ? void 0 : unsafeWindow.UE;
      } catch {
        candidate = null;
      }
    }
    if (!candidate) {
      candidate = (_b = document2.defaultView) == null ? void 0 : _b.UE;
    }
    return objectValue(candidate) ? candidate : null;
  }

  function bodyFromEditor(value) {
    return objectValue(value) ? elementValue(value.body) : null;
  }

  function expectedEditorFrame(textarea) {
    const host = textarea.closest(".subEditor") ?? textarea.parentElement;
    return (host == null ? void 0 : host.querySelector('iframe[id^="ueditor_"]')) ?? null;
  }

  function validEditorBody(body, expectedFrame) {
    var _a, _b;
    if (!body || !body.isConnected || ((_a = body.getAttribute("contenteditable")) == null ? void 0 : _a.toLowerCase()) !== "true") return false;
    try {
      const frame = (_b = body.ownerDocument.defaultView) == null ? void 0 : _b.frameElement;
      return frame === expectedFrame;
    } catch {
      return false;
    }
  }

  function resolveUeditorBody(textarea, api) {
    const editor = resolveUeditorEditor(textarea, api);
    return editor ? bodyFromEditor(editor) : null;
  }

  function resolveUeditorEditor(textarea, api) {
    var _a;
    if (!textarea.id) return null;
    const expectedFrame = expectedEditorFrame(textarea);
    if (!(expectedFrame == null ? void 0 : expectedFrame.isConnected)) return null;
    if (objectValue(api.instants)) {
      for (const editor of Object.values(api.instants)) {
        const body = bodyFromEditor(editor);
        if (!validEditorBody(body, expectedFrame)) continue;
        const candidate = editor;
        const container = elementValue(candidate.container);
        if (candidate.id === textarea.id || (container == null ? void 0 : container.contains(textarea)) || ((_a = body.ownerDocument.defaultView) == null ? void 0 : _a.frameElement) === expectedFrame) return candidate;
      }
    }
    if (typeof api.getEditor !== "function") return null;
    try {
      const editor = api.getEditor.call(api, textarea.id);
      const body = bodyFromEditor(editor);
      return validEditorBody(body, expectedFrame) ? editor : null;
    } catch {
      return null;
    }
  }

  function resolveUeditorBodies(targets, document2) {
    const fallbackApi = ueditorApi(document2);
    const apis = new Map;
    return targets.map(target => {
      const ownerDocument = target.ownerDocument;
      if (!apis.has(ownerDocument)) apis.set(ownerDocument, ueditorApi(ownerDocument) ?? fallbackApi);
      const api = apis.get(ownerDocument);
      return api ? resolveUeditorBody(target, api) : null;
    });
  }

  const DOWORK_SAVE_TEXT = "\u6682\u65f6\u4fdd\u5b58";

  const DOWORK_SAVE_HANDLERS = new Set([ "saveWork()", "saveWork();" ]);

  const NO_SUBMIT_SAVE_TEXT = "\u6682\u65f6\u4fdd\u5b58";

  const NO_SUBMIT_SAVE_HANDLERS = new Set([ "noSubmit()", "noSubmit();" ]);

  const NO_SUBMIT_SAVE_CLASSES = new Set([ "btnSave", "btnGray_1" ]);

  const NO_SUBMIT_BLOCKED_CLASSES = new Set([ "btnSubmit", "Btn_blue_1", "completeBtn" ]);

  const NO_SUBMIT_MAX_FRAME_DEPTH = 6;

  const NO_SUBMIT_MAX_FRAMES = 64;

  const NO_SUBMIT_PENDING_TEXT = "\u6b63\u5728\u6682\u5b58...";

  const NO_SUBMIT_SUCCESS_TEXT = "\u4fdd\u5b58\u6210\u529f";

  const NO_SUBMIT_SUCCESS_BOX_SELECTOR = "#saveSuccessContent";

  const SAVE_TOAST_SELECTOR = "#dialogToast";

  const NO_SUBMIT_CONFIRM_TIMEOUT_MS = 1e4;

  const STUDENTSTUDY_READY_TIMEOUT_MS = 5e3;

  const PAGE_WINDOW_PROBE_ATTRIBUTE = "data-aiask-page-window-probe";

  let pageWindowProbeSequence = 0;

  function normalizedElementText(element) {
    return (element.textContent ?? "").replace(/\s+/g, " ").trim();
  }

  function hasAnyClass(element, classes) {
    return [ ...classes ].some(className => element.classList.contains(className));
  }

  function safeDoworkSaveTarget(document2) {
    var _a;
    const candidates = [ ...document2.querySelectorAll("a") ].filter(element => {
      const onclick = element.getAttribute("onclick") ?? "";
      return normalizedElementText(element) === DOWORK_SAVE_TEXT || onclick.includes("saveWork");
    });
    if (candidates.length !== 1) return null;
    const target = candidates[0];
    if (!target || !target.isConnected || target.tagName.toLowerCase() !== "a" || normalizedElementText(target) !== DOWORK_SAVE_TEXT || !DOWORK_SAVE_HANDLERS.has(((_a = target.getAttribute("onclick")) == null ? void 0 : _a.trim()) ?? "") || target.classList.contains("completeBtn") || target.closest(".completeBtn")) return null;
    return target;
  }

  function sameOriginDocuments(root) {
    const queue = [ {
      document: root,
      depth: 0
    } ];
    const seen = new Set;
    const documents = [];
    let frameCount = 0;
    while (queue.length > 0) {
      const current = queue.shift();
      if (!current || seen.has(current.document)) continue;
      seen.add(current.document);
      documents.push(current.document);
      if (current.depth >= NO_SUBMIT_MAX_FRAME_DEPTH) continue;
      let frames;
      try {
        frames = [ ...current.document.querySelectorAll("iframe") ];
      } catch {
        return null;
      }
      for (const frame of frames) {
        frameCount += 1;
        if (frameCount > NO_SUBMIT_MAX_FRAMES) return null;
        let child = null;
        try {
          child = frame.contentDocument;
        } catch {
          child = null;
        }
        if (child && !seen.has(child)) queue.push({
          document: child,
          depth: current.depth + 1
        });
      }
    }
    return documents;
  }

  function isStudentstudyTextReady(document2) {
    const documents = sameOriginDocuments(document2);
    if (!documents) return false;
    const questions = documents.flatMap(current => [ ...current.querySelectorAll(".TiMu") ]);
    if (questions.length === 0) return false;
    for (const question of questions) {
      const typeTarget = question.querySelector('input[name^="answertype"]');
      const view = typeTarget == null ? void 0 : typeTarget.ownerDocument.defaultView;
      const type = view && typeTarget instanceof view.HTMLInputElement ? typeTarget.value : (typeTarget == null ? void 0 : typeTarget.getAttribute("value")) ?? "";
      if (type !== "2") continue;
      const textareas = [ ...question.querySelectorAll('textarea[name^="answerEditor"]') ];
      if (textareas.length === 0) return false;
      let bodies;
      try {
        bodies = resolveUeditorBodies(textareas, document2);
      } catch {
        return false;
      }
      if (bodies.length !== textareas.length || bodies.some(body => {
        var _a;
        return !(body == null ? void 0 : body.isConnected) || ((_a = body.getAttribute("contenteditable")) == null ? void 0 : _a.toLowerCase()) !== "true";
      })) return false;
    }
    return true;
  }

  function validNoSubmitTarget(target) {
    var _a;
    return !(!target || !target.isConnected || target.tagName.toLowerCase() !== "a" || normalizedElementText(target) !== NO_SUBMIT_SAVE_TEXT || !hasAnyClass(target, NO_SUBMIT_SAVE_CLASSES) || !target.classList.contains("workBtnIndex") || !NO_SUBMIT_SAVE_HANDLERS.has(((_a = target.getAttribute("onclick")) == null ? void 0 : _a.trim()) ?? "") || hasAnyClass(target, NO_SUBMIT_BLOCKED_CLASSES) || target.closest(".btnSubmit, .Btn_blue_1, .completeBtn"));
  }

  const noSubmitCandidatesIn = current => {
    try {
      return [ ...current.querySelectorAll("a") ].filter(element => {
        const onclick = element.getAttribute("onclick") ?? "";
        return normalizedElementText(element) === NO_SUBMIT_SAVE_TEXT || onclick.includes("noSubmit");
      });
    } catch {
      return null;
    }
  };

  function safeNoSubmitSaveTargets(document2) {
    const documents = sameOriginDocuments(document2);
    if (!documents) return null;
    const targets = [];
    for (const current of documents) {
      let answerable = false;
      try {
        answerable = current.querySelector(ANSWERABLE_QUESTION_SELECTOR) !== null;
      } catch {
        return null;
      }
      if (!answerable) continue;
      const candidates = noSubmitCandidatesIn(current);
      if (!candidates) return null;
      if (candidates.length === 0) continue;
      if (candidates.length > 1) return null;
      if (!validNoSubmitTarget(candidates[0])) return null;
      targets.push(candidates[0]);
    }
    return targets.length > 0 ? targets : null;
  }

  const ANSWERABLE_QUESTION_SELECTOR = '.TiMu input[name^="answertype"]';

  function unsafePageWindow() {
    try {
      return typeof unsafeWindow === "undefined" ? null : unsafeWindow ?? null;
    } catch {
      return null;
    }
  }

  function pageWindowForDocument(document2) {
    var _a;
    const root = unsafePageWindow();
    if (!root) return document2.defaultView;
    const documentElement = document2.documentElement;
    if (!documentElement) return null;
    const previousProbe = documentElement.getAttribute(PAGE_WINDOW_PROBE_ATTRIBUTE);
    const probe2 = `aiask-${++pageWindowProbeSequence}`;
    documentElement.setAttribute(PAGE_WINDOW_PROBE_ATTRIBUTE, probe2);
    const queue = [ {
      window: root,
      depth: 0
    } ];
    const seen = new Set;
    let frameCount = 0;
    try {
      while (queue.length > 0) {
        const current = queue.shift();
        if (!current || seen.has(current.window)) continue;
        seen.add(current.window);
        try {
          if (((_a = current.window.document.documentElement) == null ? void 0 : _a.getAttribute(PAGE_WINDOW_PROBE_ATTRIBUTE)) === probe2) return current.window;
        } catch {
          continue;
        }
        if (current.depth >= NO_SUBMIT_MAX_FRAME_DEPTH) continue;
        let length = 0;
        try {
          length = current.window.frames.length;
        } catch {
          continue;
        }
        for (let index = 0; index < length; index += 1) {
          frameCount += 1;
          if (frameCount > NO_SUBMIT_MAX_FRAMES) return null;
          try {
            const child = current.window.frames[index];
            if (!seen.has(child)) queue.push({
              window: child,
              depth: current.depth + 1
            });
          } catch {}
        }
      }
      return null;
    } finally {
      if (previousProbe === null) documentElement.removeAttribute(PAGE_WINDOW_PROBE_ATTRIBUTE); else documentElement.setAttribute(PAGE_WINDOW_PROBE_ATTRIBUTE, previousProbe);
    }
  }

  function pageWindowsInFrameTree() {
    const root = unsafePageWindow();
    if (!root) return [];
    const roots = [ root ];
    try {
      const top = root.top;
      if (top && top !== root) roots.unshift(top);
    } catch {}
    const out = [];
    const seen = new Set;
    const queue = roots.map(window2 => ({
      window: window2,
      depth: 0
    }));
    let frameCount = 0;
    while (queue.length > 0) {
      const current = queue.shift();
      if (!current || seen.has(current.window)) continue;
      seen.add(current.window);
      out.push(current.window);
      if (current.depth >= NO_SUBMIT_MAX_FRAME_DEPTH) continue;
      let length = 0;
      try {
        length = current.window.frames.length;
      } catch {
        continue;
      }
      for (let index = 0; index < length; index += 1) {
        frameCount += 1;
        if (frameCount > NO_SUBMIT_MAX_FRAMES) return out;
        try {
          const child = current.window.frames[index];
          if (!seen.has(child)) queue.push({
            window: child,
            depth: current.depth + 1
          });
        } catch {}
      }
    }
    return out;
  }

  function observeSaveReceipt(pageWindow, document2, signal, timeoutMs) {
    var _a;
    const originalAlert = pageWindow.alert;
    let resolveOutcome = () => void 0;
    const promise = new Promise(resolve => {
      resolveOutcome = resolve;
    });
    let settled = false;
    let started = false;
    let unloadVerdict = false;
    let successSeen = false;
    const finish = value => {
      if (settled) return;
      settled = true;
      globalThis.clearTimeout(timeout);
      boxObserver == null ? void 0 : boxObserver.disconnect();
      toastObserver == null ? void 0 : toastObserver.disconnect();
      signal.removeEventListener("abort", onAbort);
      pageWindow.removeEventListener("pagehide", onPageHide);
      pageWindow.removeEventListener("beforeunload", onPageHide);
      try {
        pageWindow.alert = originalAlert;
      } catch {}
      resolveOutcome(value);
    };
    const onAbort = () => finish(false);
    const onPageHide = () => finish(unloadVerdict);
    const isSuccessText = raw => String(raw ?? "").replace(/\s+/g, "").trim().startsWith(NO_SUBMIT_SUCCESS_TEXT);
    const onSuccessObserved = () => {
      successSeen = true;
      if (started) finish(true);
    };
    const interceptedAlert = message => {
      if (isSuccessText(message)) {
        onSuccessObserved();
        return;
      }
      finish(false);
      originalAlert.call(pageWindow, String(message ?? ""));
    };
    const boxContent = document2.querySelector(NO_SUBMIT_SUCCESS_BOX_SELECTOR);
    const ObserverCtor = (_a = document2.defaultView) == null ? void 0 : _a.MutationObserver;
    const boxObserver = boxContent && ObserverCtor ? new ObserverCtor(() => {
      if (isSuccessText(boxContent.textContent)) onSuccessObserved();
    }) : null;
    boxObserver == null ? void 0 : boxObserver.observe(boxContent, {
      childList: true,
      characterData: true,
      subtree: true
    });
    const toastHost = document2.body ?? document2.documentElement;
    const toastOf = node => {
      if (!node) return null;
      const element = node.nodeType === 1 ? node : node.parentElement ?? null;
      if (!element) return null;
      if (typeof element.closest === "function") {
        const own = element.closest(SAVE_TOAST_SELECTOR);
        if (own) return own;
      }
      return typeof element.querySelector === "function" ? element.querySelector(SAVE_TOAST_SELECTOR) : null;
    };
    const toastObserver = toastHost && ObserverCtor ? new ObserverCtor(records => {
      for (const record of records) {
        for (const added of record.addedNodes) {
          const toast = toastOf(added);
          if (toast && isSuccessText(toast.textContent)) {
            onSuccessObserved();
            return;
          }
        }
        const changed = toastOf(record.target);
        if (changed && isSuccessText(changed.textContent)) {
          onSuccessObserved();
          return;
        }
      }
    }) : null;
    toastObserver == null ? void 0 : toastObserver.observe(toastHost, {
      childList: true,
      characterData: true,
      subtree: true
    });
    const timeout = globalThis.setTimeout(() => finish(false), timeoutMs);
    signal.addEventListener("abort", onAbort, {
      once: true
    });
    pageWindow.addEventListener("pagehide", onPageHide, {
      once: true
    });
    pageWindow.addEventListener("beforeunload", onPageHide, {
      once: true
    });
    try {
      pageWindow.alert = interceptedAlert;
    } catch {
      finish(false);
    }
    return {
      promise: promise,
      armed: !settled,
      markStarted: (value, unloadCounts = value) => {
        started = value;
        unloadVerdict = unloadCounts;
        if (!value) finish(false); else if (successSeen) finish(true);
      }
    };
  }

  function runNoSubmitSave(target, signal, requiresTextSync, timeoutMs = NO_SUBMIT_CONFIRM_TIMEOUT_MS) {
    if (signal.aborted || !target.isConnected) return Promise.resolve(false);
    const pageWindow = pageWindowForDocument(target.ownerDocument);
    const handler = pageWindow == null ? void 0 : pageWindow.noSubmit;
    if (!pageWindow || typeof handler !== "function") return Promise.resolve(false);
    if (requiresTextSync && !syncUeditorAnswers(target.ownerDocument, pageWindow)) return Promise.resolve(false);
    const watch2 = observeSaveReceipt(pageWindow, target.ownerDocument, signal, timeoutMs);
    if (!watch2.armed) return watch2.promise;
    try {
      handler.call(pageWindow);
      watch2.markStarted(normalizedElementText(target) === NO_SUBMIT_PENDING_TEXT);
    } catch {
      watch2.markStarted(false);
    }
    return watch2.promise;
  }

  function runSaveWork(target, signal, timeoutMs = NO_SUBMIT_CONFIRM_TIMEOUT_MS) {
    if (signal.aborted || !target.isConnected) return Promise.resolve(false);
    const pageWindow = pageWindowForDocument(target.ownerDocument);
    if (!pageWindow) return Promise.resolve(false);
    const watch2 = observeSaveReceipt(pageWindow, target.ownerDocument, signal, timeoutMs);
    if (!watch2.armed) return watch2.promise;
    try {
      target.click();
      watch2.markStarted(true, false);
    } catch {
      watch2.markStarted(false);
    }
    return watch2.promise;
  }

  function syncUeditorAnswers(document2, pageWindow) {
    var _a;
    const targets = [ ...document2.querySelectorAll('textarea[name^="answerEditor"], textarea[name^="answer"]:not([name^="answerEditor"])') ];
    if (targets.length === 0) return true;
    const api = objectValue(pageWindow.UE) ? pageWindow.UE : ueditorApi(document2);
    for (const textarea of targets) {
      const editor = api ? resolveUeditorEditor(textarea, api) : null;
      const body = editor ? bodyFromEditor(editor) : null;
      const text = ((_a = body == null ? void 0 : body.textContent) == null ? void 0 : _a.trim()) ?? "";
      if (!text) continue;
      if (!api || !editor || typeof editor.sync !== "function") return false;
      try {
        editor.sync.call(editor);
      } catch {
        return false;
      }
      if (!textarea.value.trim()) return false;
    }
    return true;
  }

  const CHA0XING_PAGE_SAVE_HOOK_IDS = {
    noSubmit: "chaoxing.noSubmit",
    saveWork: "chaoxing.saveWork"
  };

  function registerChaoxingPageSaveHooks(registry, {document: document2, which: which}) {
    core.registerLocalHook(registry, {
      id: CHA0XING_PAGE_SAVE_HOOK_IDS[which],
      phases: [ "fill" ],
      capability: "commit",
      commitOnly: true,
      parseArgs: args => {
        const keys = Object.keys(args);
        if (keys.length !== 1 || typeof args.textWrites !== "boolean") throw new Error("expected { textWrites: boolean }");
        return {
          textWrites: args.textWrites
        };
      },
      validateResult: value => typeof value === "boolean",
      execute: async ({textWrites: textWrites}, {signal: signal}) => {
        if (which === "saveWork") {
          const target = safeDoworkSaveTarget(document2);
          return target ? runSaveWork(target, signal) : false;
        }
        const targets = safeNoSubmitSaveTargets(document2);
        if (!targets) return false;
        const budget = Math.max(1, Math.floor(NO_SUBMIT_CONFIRM_TIMEOUT_MS / targets.length));
        for (const target of targets) if (!(await runNoSubmitSave(target, signal, textWrites, budget))) return false;
        return true;
      }
    });
  }

  const normalizedHost = hostname => hostname.trim().toLowerCase();

  const MAX_DEPTH = 12;

  const MAX_KEYS = 40;

  const MAX_TEXT = 8e3;

  function looksLikeJson(value) {
    const trimmed = value.trim();
    return trimmed.startsWith("{") || trimmed.startsWith("[");
  }

  function describe(value, depth) {
    if (value === null) return "null";
    if (typeof value === "boolean") return "boolean";
    if (typeof value === "number") return "number";
    if (typeof value === "string") {
      if (looksLikeJson(value) && depth < MAX_DEPTH) {
        try {
          return `string(json:${describe(JSON.parse(value), depth + 1)})`;
        } catch {
          return "string";
        }
      }
      return "string";
    }
    if (typeof value !== "object") return typeof value;
    if (depth >= MAX_DEPTH) return "\u2026";
    if (Array.isArray(value)) return value.length === 0 ? "array[0]" : `array[${value.length}] of ${describe(value[0], depth + 1)}`;
    const keys = Object.keys(value);
    const shown = keys.slice(0, MAX_KEYS).map(key => {
      const child = value[key];
      return `${key}:${describe(child, depth + 1)}`;
    });
    if (keys.length > MAX_KEYS) shown.push(`\u2026+${keys.length - MAX_KEYS}`);
    return `{${shown.join(",")}}`;
  }

  function describeJsonShape(value) {
    const text = describe(value, 0);
    return text.length > MAX_TEXT ? `${text.slice(0, MAX_TEXT)}\u2026\uff08\u5df2\u622a\u65ad\uff09` : text;
  }

  const XHR_CAPTURE_TABLE = Object.freeze([ Object.freeze({
    host: "os.open.com.cn",
    pathIncludes: "/StudentViewPaper",
    slot: "exam-view-paper"
  }), Object.freeze({
    host: "os.open.com.cn",
    pathIncludes: "/StudentPullPaper_V2",
    slot: "exam-pull-paper"
  }), Object.freeze({
    host: "ctapp.hubuzkw.com",
    pathIncludes: "/exam.index/get_knows_question_ids",
    slot: "question-bank"
  }) ]);

  function slotsForHosts(hosts) {
    const wanted = new Set(hosts.map(normalizedHost));
    return new Set(XHR_CAPTURE_TABLE.filter(entry => wanted.has(entry.host)).map(entry => entry.slot));
  }

  function captureRulesForHost(host) {
    const target = normalizedHost(host);
    return XHR_CAPTURE_TABLE.filter(entry => entry.host === target).map(entry => Object.freeze({
      slot: entry.slot,
      host: entry.host,
      pathIncludes: entry.pathIncludes
    }));
  }

  const MAX_CAPTURE_CHARS = 2 * 1024 * 1024;

  const HOOKED_SEND_FLAG = "__aiaskHookedXhrSend";

  function isHookedSend(send) {
    return typeof send === "function" && send[HOOKED_SEND_FLAG] === true;
  }

  function readPayload(xhr) {
    if (xhr.responseType === "json") return xhr.response ?? null;
    if (xhr.responseType && xhr.responseType !== "text") return null;
    const raw = typeof xhr.response === "string" ? xhr.response : xhr.responseText ?? "";
    if (!raw || raw.length > MAX_CAPTURE_CHARS) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function createXhrResponseCapture(rules) {
    const store = new Map;
    const listeners2 = new Set;
    const slotFor = responseURL => {
      let url;
      try {
        url = new URL(responseURL);
      } catch {
        return null;
      }
      const host = url.hostname.toLowerCase();
      const match = rules.find(rule => rule.host === host && url.pathname.includes(rule.pathIncludes));
      return (match == null ? void 0 : match.slot) ?? null;
    };
    const consume = xhr => {
      try {
        if (xhr.readyState !== 4 || xhr.status !== 200) return;
        const slot = slotFor(xhr.responseURL || "");
        if (!slot) return;
        const payload = readPayload(xhr);
        if (payload == null) return;
        store.set(slot, payload);
        for (const listener of [ ...listeners2 ]) {
          try {
            listener(slot);
          } catch {}
        }
      } catch {}
    };
    return {
      read: slot => store.get(slot) ?? null,
      clear: () => store.clear(),
      consume: consume,
      subscribe(listener) {
        listeners2.add(listener);
        return () => {
          listeners2.delete(listener);
        };
      },
      install(target) {
        const descriptor = Object.getOwnPropertyDescriptor(target.prototype, "send");
        const currentSend = (descriptor == null ? void 0 : descriptor.value) ?? target.prototype.send;
        if (isHookedSend(currentSend)) return false;
        if (typeof currentSend !== "function") return false;
        const originalSend = currentSend;
        const hookedSend = function(body) {
          try {
            this.addEventListener("readystatechange", () => consume(this));
          } catch {}
          return originalSend.call(this, body);
        };
        Object.defineProperty(hookedSend, HOOKED_SEND_FLAG, {
          value: true
        });
        try {
          target.prototype.send = hookedSend;
        } catch {
          return false;
        }
        return isHookedSend(target.prototype.send);
      }
    };
  }

  const responseListener = createXhrResponseCapture(XHR_CAPTURE_TABLE);

  function readCapturedSlot(slot) {
    return responseListener.read(slot);
  }

  function subscribeCapturedSlots(listener) {
    return responseListener.subscribe(listener);
  }

  let applicable = false;

  let installTarget = "none";

  let installed = false;

  let expected = [];

  function installResponseListener(hostname) {
    const rules = captureRulesForHost(normalizedHost(hostname));
    if (rules.length === 0) return false;
    applicable = true;
    expected = rules.map(rule => rule.slot);
    let target;
    try {
      if (typeof unsafeWindow !== "undefined") target = unsafeWindow == null ? void 0 : unsafeWindow.XMLHttpRequest;
    } catch {
      target = void 0;
    }
    if (target) installTarget = "page"; else if (typeof XMLHttpRequest !== "undefined") {
      target = XMLHttpRequest;
      installTarget = "sandbox";
    }
    if (!target) return false;
    installed = responseListener.install(target);
    return installed;
  }

  function listenerStatus() {
    if (!applicable) return null;
    const filled = expected.filter(slot => responseListener.read(slot) != null);
    const shapes = {};
    for (const slot of filled) shapes[slot] = describeJsonShape(responseListener.read(slot));
    return {
      target: installTarget,
      installed: installed,
      expected: expected,
      filled: filled,
      shapes: shapes
    };
  }

  const CHA0XING_PACKAGE_HOOKS = Object.freeze({
    [CHA0XING_PACKAGE_IDS.examStudent]: Object.freeze([ "registerExamQuestion", "prepareExamPlan", "commitExamPlan" ]),
    [CHA0XING_PACKAGE_IDS.dowork]: Object.freeze([ "saveWork" ]),
    [CHA0XING_PACKAGE_IDS.studentstudy]: Object.freeze([ "noSubmit" ]),
    [CHA0XING_PACKAGE_IDS.oldHomework]: Object.freeze([ "noSubmit" ]),
    [CHA0XING_PACKAGE_IDS.oldChapter]: Object.freeze([ "noSubmit" ]),
    [CHA0XING_PACKAGE_IDS.newChapter]: Object.freeze([ "noSubmit" ])
  });

  const CHA0XING_PRIMITIVE_IDS = Object.freeze([ "chaoxing.normalizeTitle", "chaoxing.decodeFont", "chaoxing.harvestAnswerValues", "chaoxing.ueditorBodies", "chaoxing.examRegisterQuestion", "chaoxing.examPreparePlan", "chaoxing.examCommitPlan", CHA0XING_PAGE_SAVE_HOOK_IDS.noSubmit, CHA0XING_PAGE_SAVE_HOOK_IDS.saveWork ]);

  function registerPageSaveVerificationStub(registry, id) {
    core.registerLocalHook(registry, {
      id: id,
      phases: [ "fill" ],
      capability: "commit",
      commitOnly: true,
      parseArgs: args => {
        const keys = Object.keys(args);
        if (keys.length !== 1 || typeof args.textWrites !== "boolean") throw new Error("expected { textWrites: boolean }");
        return {
          textWrites: args.textWrites
        };
      },
      validateResult: value => typeof value === "boolean",
      execute: () => false
    });
  }

  const PLATFORM_PRIVATE_HOOKS = Object.freeze({
    chaoxing: Object.freeze({
      primitiveIds: CHA0XING_PRIMITIVE_IDS,
      registerForVerification(registry, {refs: refs, typr: typr, fontTable: fontTable, packageId: packageId}) {
        const hooks = CHA0XING_PACKAGE_HOOKS[packageId] ?? [];
        const on = name => hooks.includes(name);
        core.registerChaoxingRuleHooks(registry, {
          typr: typr,
          table: fontTable,
          refs: refs,
          resolveUeditorBodies: targets => targets,
          ...on("registerExamQuestion") ? {
            registerExamQuestion: () => void 0
          } : {},
          ...on("prepareExamPlan") ? {
            prepareExamPlan: () => false
          } : {},
          ...on("commitExamPlan") ? {
            commitExamPlan: () => false
          } : {}
        });
        if (on("noSubmit")) registerPageSaveVerificationStub(registry, CHA0XING_PAGE_SAVE_HOOK_IDS.noSubmit);
        if (on("saveWork")) registerPageSaveVerificationStub(registry, CHA0XING_PAGE_SAVE_HOOK_IDS.saveWork);
      }
    })
  });

  const REGEX_WORKER_SOURCE = [ "'use strict';", "self.addEventListener('message', function (event) {", "  var request = event.data;", "  try {", "    var regex = new RegExp(request.pattern, request.flags || '');", "    var value;", "    if (request.kind === 'test') value = regex.test(request.value);", "    else if (request.kind === 'replace') value = request.value.replace(regex, request.replacement || '');", "    else {", "      var match = regex.exec(request.value);", "      value = match ? Array.from(match, function (part) { return part == null ? null : part; }) : null;", "    }", "    self.postMessage({ ok: true, value: value });", "  } catch (error) {", "    self.postMessage({ ok: false, code: 'regex_error', error: error instanceof Error ? error.message : 'regex failed' });", "  }", "});" ].join("\n");

  function createBrowserRegexWorker() {
    const url = URL.createObjectURL(new Blob([ REGEX_WORKER_SOURCE ], {
      type: "text/javascript"
    }));
    try {
      return new Worker(url);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  function createRuleExpressionServices(createWorker = createBrowserRegexWorker) {
    const regex = new core.IsolatedRegexExecutor(createWorker);
    const services = {
      regex: request => regex.execute(request),
      jsonPath: ({value: value, query: query, signal: signal}) => core.executeJsonPath(value, query, {
        signal: signal
      })
    };
    return Object.freeze(services);
  }

  const RULE_EXPRESSION_SERVICES = createRuleExpressionServices();

  const RULE_ENGINE_VERSION = "1.8.0";

  const RULE_LIMITS = Object.freeze({
    maxSteps: 5e4,
    maxWallMs: 6e3,
    maxAsyncMs: 1e3,
    maxLoopIterations: 256,
    maxCallDepth: 8,
    maxDomRefs: 4e3,
    maxNavClicks: 8
  });

  const CORE_RULE_PRIMITIVES = Object.freeze([ "page.location", "page.queryParam", "dom.queryCss", "dom.queryCssAll", "dom.queryXPath", "dom.queryXPathAll", "dom.text", "dom.content", "dom.attr", "dom.property", "dom.closest", "dom.parent", "dom.children", "dom.index", "wait.selector", "wait.absent", "frame.list", "frame.enter", "frame.findSameOrigin", "frame.findAllSameOrigin", "content.sanitize", "text.includes", "text.stripOptionPrefix", "text.normalizeTruth", "question.normalizeLeafType", "array.append", "capture.registerLeafDom", "capture.registerLeafBindingDom", "capture.registerTree", "capture.harvestLeaf", "capture.finish", "capture.slot", "aopeng.paperData", "hubu.questionBank", "answer.applyPlan", "dom.clickAnswer", "dom.setChecked", "dom.setValue", "dom.setSelected", "matching.pair", "observe.mutation", "observe.urlChange", "schedule.once", "nav.click" ]);

  const CORE_CAPABILITIES = Object.freeze([ "dom-read", "frame-read", "runtime-read", "network-read", "answer-write", "navigate", "commit", "course" ]);

  function platformRulePolicy(platform) {
    var _a;
    return {
      primitives: new Set([ ...CORE_RULE_PRIMITIVES, ...((_a = PLATFORM_PRIVATE_HOOKS[platform]) == null ? void 0 : _a.primitiveIds) ?? [] ]),
      capabilities: new Set(CORE_CAPABILITIES),
      limits: RULE_LIMITS
    };
  }

  const GENERIC_DOM_RULE_POLICY = platformRulePolicy("generic");

  const CHA0XING_RULE_POLICY = platformRulePolicy("chaoxing");

  const TRUSTED_REMOTE_RULE_PLATFORMS = Object.freeze([ Object.freeze({
    platform: "wangxiao",
    packageId: "wangxiao-xatu-chapter-assessment",
    hosts: Object.freeze([ "xatu.168wangxiao.com" ]),
    policy: GENERIC_DOM_RULE_POLICY
  }), Object.freeze({
    platform: "aopeng",
    packageId: "aopeng-os-homework-online",
    hosts: Object.freeze([ "os.open.com.cn" ]),
    policy: GENERIC_DOM_RULE_POLICY
  }), Object.freeze({
    platform: "hubu",
    packageId: "hubu-zkw-question-bank",
    hosts: Object.freeze([ "ctapp.hubuzkw.com" ]),
    policy: GENERIC_DOM_RULE_POLICY
  }), Object.freeze({
    platform: "wenhua",
    packageId: "wenhua-homework-online",
    hosts: Object.freeze([ "xuexi.jsou.cn" ]),
    policy: GENERIC_DOM_RULE_POLICY
  }) ]);

  const SUPPORTED_HOST_PATTERN = /^(?:(?:[^.]+\.)*chaoxing\.com|xatu\.168wangxiao\.com|os\.open\.com\.cn|ctapp\.hubuzkw\.com|xuexi\.jsou\.cn)$/u;

  function trustedRemoteRulePlatformFor(hostname) {
    const host = normalizedHost(hostname);
    return TRUSTED_REMOTE_RULE_PLATFORMS.find(entry => entry.hosts.some(candidate => candidate === host)) ?? null;
  }

  function trustedRemoteRulePlatformByPackageId(packageId) {
    return TRUSTED_REMOTE_RULE_PLATFORMS.find(entry => entry.packageId === packageId) ?? null;
  }

  function validatedRulePackageIdFor(location2) {
    const page = new URL(location2.href);
    if (page.hostname !== "chaoxing.com" && !page.hostname.endsWith(".chaoxing.com")) return null;
    if (CHA0XING_STUDENTSTUDY_PATHS.some(pathname => pathname === page.pathname) && page.searchParams.get("mooc2") === "1") return CHA0XING_PACKAGE_IDS.studentstudy;
    if (page.pathname === "/mooc-ans/work/selectWorkQuestionYiPiYue" || page.pathname === "/work/selectWorkQuestionYiPiYue") return CHA0XING_PACKAGE_IDS.studentstudy;
    if (page.pathname === "/exam-ans/exam/test/reVersionTestStartNew" || page.pathname === CHA0XING_EXAM_PREVIEW_PATH) return CHA0XING_PACKAGE_IDS.examStudent;
    if (page.pathname === "/mooc-ans/work/doHomeWorkNew" && page.searchParams.get("mooc2") === "1") return CHA0XING_PACKAGE_IDS.newChapter;
    if (page.pathname === "/mooc-ans/work/doHomeWorkNew" && page.searchParams.get("mooc2") === "0") return CHA0XING_PACKAGE_IDS.oldChapter;
    if (page.pathname === "/mooc-ans/work/doHomeWorkNew" && page.searchParams.get("mooc") === "1") return CHA0XING_PACKAGE_IDS.oldHomework;
    if (page.pathname === "/mooc-ans/mooc2/work/dowork") return CHA0XING_PACKAGE_IDS.dowork;
    return null;
  }

  function isNewCourseStudyUrl(location2) {
    const page = new URL(location2.href);
    if (page.hostname !== "chaoxing.com" && !page.hostname.endsWith(".chaoxing.com")) return false;
    return CHA0XING_STUDENTSTUDY_PATHS.some(pathname => pathname === page.pathname) && page.searchParams.get("mooc2") === "1";
  }

  function legacyStudentstudyUpgradeUrl(location2) {
    const page = new URL(location2.href);
    if (page.hostname !== "chaoxing.com" && !page.hostname.endsWith(".chaoxing.com")) return null;
    if (!CHA0XING_STUDENTSTUDY_PATHS.some(pathname => pathname === page.pathname)) return null;
    if (page.searchParams.get("mooc2") === "1") return null;
    page.pathname = "/mycourse/studentstudy";
    page.searchParams.set("mooc2", "1");
    return page.toString();
  }

  const ENGINE_RECHECK_BUDGET = new core.EngineRecheckBudget;

  const WALK_SESSIONS = new core.WalkSessionStore;

  function chaoxingRuleOptions(packageId, store, services, configureRegistry, walkGate) {
    return {
      platform: "chaoxing",
      packageId: packageId,
      hosts: [ "chaoxing.com" ],
      store: store,
      policy: CHA0XING_RULE_POLICY,
      services: services,
      configureRegistry: configureRegistry,
      recheckBudget: ENGINE_RECHECK_BUDGET,
      walk: {
        sessions: WALK_SESSIONS,
        gate: walkGate
      }
    };
  }

  const CHA0XING_PAGE_SAVE_HOOK = Object.freeze({
    [CHA0XING_PACKAGE_IDS.dowork]: "saveWork",
    [CHA0XING_PACKAGE_IDS.studentstudy]: "noSubmit",
    [CHA0XING_PACKAGE_IDS.oldHomework]: "noSubmit",
    [CHA0XING_PACKAGE_IDS.oldChapter]: "noSubmit",
    [CHA0XING_PACKAGE_IDS.newChapter]: "noSubmit"
  });

  const CHA0XING_CAPTURE_READY = Object.freeze({
    [CHA0XING_PACKAGE_IDS.studentstudy]: {
      predicate: isStudentstudyTextReady,
      timeoutMs: STUDENTSTUDY_READY_TIMEOUT_MS
    }
  });

  class ChaoxingExamRuleAdapter extends core.JsonRulePlatformAdapter {
    constructor(packageId, store, typr, table, services, walkGate) {
      const examRuntime = new ChaoxingExamRuntime;
      super(chaoxingRuleOptions(packageId, store, services, (registry, environment) => core.registerChaoxingRuleHooks(registry, {
        typr: typr,
        table: table,
        refs: environment.refs,
        resolveUeditorBodies: targets => resolveUeditorBodies(targets, environment.ctx.document),
        registerExamQuestion: registration => examRuntime.registerQuestion(registration),
        prepareExamPlan: (plan, signal) => examRuntime.preparePlan(plan, signal),
        commitExamPlan: (plan, signal) => examRuntime.commitPlan(plan, signal)
      }), walkGate));
      __publicField(this, "examRuntime");
      this.examRuntime = examRuntime;
    }
    async captureTrees(ctx) {
      this.examRuntime.beginCapture();
      if (ctx.location.pathname === CHA0XING_EXAM_PREVIEW_PATH && !(await core.waitUntil(() => isChaoxingExamPreviewReady(ctx.document, targets => resolveUeditorBodies(targets, ctx.document)), {
        timeout: 5e3,
        interval: 50,
        signal: ctx.signal
      }))) return [];
      return super.captureTrees(ctx);
    }
    prepareStart(ctx) {
      return this.examRuntime.prepareStart(ctx);
    }
    async dispose() {
      this.examRuntime.dispose();
      await super.dispose();
    }
  }

  function createChaoxingRuleAdapter(packageId, store, typr, table, services, walkGate) {
    if (packageId === CHA0XING_PACKAGE_IDS.examStudent) return new ChaoxingExamRuleAdapter(packageId, store, typr, table, services, walkGate);
    return new core.JsonRulePlatformAdapter({
      ...chaoxingRuleOptions(packageId, store, services, (registry, environment) => {
        core.registerChaoxingRuleHooks(registry, {
          typr: typr,
          table: table,
          refs: environment.refs,
          resolveUeditorBodies: targets => resolveUeditorBodies(targets, environment.ctx.document)
        });
        const which = CHA0XING_PAGE_SAVE_HOOK[packageId];
        if (which) registerChaoxingPageSaveHooks(registry, {
          document: environment.ctx.document,
          which: which
        });
      }, walkGate),
      captureReady: CHA0XING_CAPTURE_READY[packageId]
    });
  }

  function createDefaultAdapterFactories(location2, typr, store, table = {}, services = RULE_EXPRESSION_SERVICES, walkGate = () => true) {
    const trustedRemote = trustedRemoteRulePlatformFor(location2.hostname || new URL(location2.href).hostname);
    if (trustedRemote) {
      const privateHooks = PLATFORM_PRIVATE_HOOKS[trustedRemote.platform];
      return [ () => new core.JsonRulePlatformAdapter({
        platform: trustedRemote.platform,
        packageId: trustedRemote.packageId,
        hosts: trustedRemote.hosts,
        store: store,
        policy: trustedRemote.policy,
        services: services,
        listener: {
          read: readCapturedSlot,
          allowedSlots: slotsForHosts(trustedRemote.hosts),
          subscribe: subscribeCapturedSlots
        },
        recheckBudget: ENGINE_RECHECK_BUDGET,
        walk: {
          sessions: WALK_SESSIONS,
          gate: walkGate
        },
        ...(privateHooks == null ? void 0 : privateHooks.registerForRuntime) ? {
          configureRegistry: registry => {
            var _a;
            return (_a = privateHooks.registerForRuntime) == null ? void 0 : _a.call(privateHooks, registry);
          }
        } : {}
      }) ];
    }
    const packageId = validatedRulePackageIdFor(location2);
    return packageId ? [ () => createChaoxingRuleAdapter(packageId, store, typr, table, services, walkGate) ] : [];
  }

  const ALL_KINDS = [ "media", "chapter-test", "document", "ppt-audio", "timed-read", "hyperlink", "flash", "unknown" ];

  const isTaskKind = value => ALL_KINDS.includes(value);

  const TASK_TOGGLES = [ "media", "chapter-test", "reading", "hyperlink" ];

  const TOGGLE_LABEL = {
    media: "\u89c6\u9891\u4e0e\u97f3\u9891",
    "chapter-test": "\u7ae0\u8282\u6d4b\u9a8c",
    reading: "PPT / \u6587\u6863 / \u4e66\u7c4d",
    hyperlink: "\u94fe\u63a5"
  };

  const KIND_TOGGLE = {
    media: "media",
    "chapter-test": "chapter-test",
    document: "reading",
    "ppt-audio": "reading",
    "timed-read": "reading",
    flash: "reading",
    hyperlink: "hyperlink",
    unknown: null
  };

  const toggleForKind = kind => KIND_TOGGLE[kind];

  const KIND_LABEL = {
    media: "\u89c6\u9891\u4e0e\u97f3\u9891",
    "chapter-test": "\u7ae0\u8282\u6d4b\u9a8c",
    document: "\u6587\u6863\u4e0e\u4e66\u7c4d",
    "ppt-audio": "\u5e26\u97f3\u9891\u8bfe\u4ef6",
    "timed-read": "\u957f\u65f6\u9605\u8bfb",
    hyperlink: "\u94fe\u63a5",
    flash: "Flash \u52a8\u753b",
    unknown: "\u672a\u77e5\u7c7b\u578b"
  };

  const TASK_SKIP_LABEL = {
    passed: "\u7ad9\u70b9\u6807\u8bb0\u5df2\u64ad\u5b8c",
    "not-a-job": "\u7ad9\u70b9\u672a\u8ba1\u4e3a\u4efb\u52a1\u70b9",
    "test-done": "\u9875\u9762\u6807\u8bb0\u6d4b\u9a8c\u5df2\u5b8c\u6210",
    "section-clear": "\u7ad9\u70b9\u6e05\u5355\u5df2\u65e0\u5f85\u529e",
    "marked-done": "\u4efb\u52a1\u70b9\u5df2\u5b8c\u6210\u6807\u8bb0",
    "kind-off": "\u8be5\u7c7b\u578b\u5df2\u88ab\u4f60\u5173\u95ed",
    handled: "\u672c\u8282\u5185\u5df2\u5904\u7406\u8fc7"
  };

  const isPendingTask = task => task.skip === null;

  const DEFAULT_COURSE_CONFIG = Object.freeze({
    probes: Object.freeze([ Object.freeze([ "media", "#video, #audio" ]), Object.freeze([ "chapter-test", ".TiMu" ]), Object.freeze([ "timed-read", 'iframe[name="bookifame"][src*="timing"]' ]), Object.freeze([ "ppt-audio", ".swiper-container" ]), Object.freeze([ "document", "#img.imglook" ]), Object.freeze([ "hyperlink", "#hyperlink" ]), Object.freeze([ "media", "video, audio" ]) ]),
    moduleKind: Object.freeze({
      insertvideo: "media",
      insertaudio: "media",
      insertdoc: "document",
      insertbook: "document",
      insertflash: "flash",
      work: "chapter-test",
      insertimage: "document"
    }),
    faceLegacy: "#fcqrimg",
    faceMask: ".chapterVideoFaceMaskDiv",
    videoQuiz: "#videoquiz-submit",
    playerError: ".vjs-modal-dialog-content",
    playerErrorTexts: Object.freeze([ "\u89c6\u9891\u6587\u4ef6\u635f\u574f", "\u7f51\u7edc\u9519\u8bef\u5bfc\u81f4\u89c6\u9891\u4e0b\u8f7d\u4e2d\u9014\u5931\u8d25", "\u89c6\u9891\u56e0\u683c\u5f0f\u4e0d\u652f\u6301", "\u7f51\u7edc\u7684\u95ee\u9898\u65e0\u6cd5\u52a0\u8f7d" ]),
    taskDoneText: "\u4efb\u52a1\u70b9\u5df2\u5b8c\u6210",
    chapterTestAnswerable: '.TiMu input[name^="answertype"]',
    chapterTestStatus: ".testTit_status",
    chapterTestDoneClass: "testTit_status_complete",
    chapterTestDoneText: "\u5df2\u5b8c\u6210",
    chapterTestSubmittedTexts: Object.freeze([ "\u5f85\u6279\u9605", "\u5df2\u63d0\u4ea4" ]),
    taskTab: ".prev_ul li",
    chapter: '[onclick^="getTeacherAjax"]',
    jobUnfinishCount: ".jobUnfinishCount",
    chapterName: ".posCatalog_name",
    specialMode: ".catalog_points_sa, .catalog_points_er",
    cursorCourseId: "#curCourseId",
    cursorChapterId: "#curChapterId",
    cursorClazzId: "#curClazzId",
    sectionTabs: "#prev_tab .prev_ul li",
    nextSectionFallback: ".nodeItem.r i",
    bigPlay: ".vjs-big-play-button",
    bigPlayLabel: "\u64ad\u653e\u89c6\u9891",
    readerPager: ".readerPager",
    activePagerZIndex: "101",
    pptSlide: ".swiper-container .swiper-slide",
    timedReadFrame: 'iframe[name="bookifame"][src*="timing"]'
  });

  const SELECTOR_KEYS = Object.freeze({
    "course.gate.faceLegacy": "faceLegacy",
    "course.gate.faceMask": "faceMask",
    "course.gate.videoQuiz": "videoQuiz",
    "course.gate.playerError": "playerError",
    "course.marker.taskDone": "taskDoneText",
    "course.probe.chapterTestAnswerable": "chapterTestAnswerable",
    "course.marker.chapterTestStatus": "chapterTestStatus",
    "course.marker.chapterTestDoneClass": "chapterTestDoneClass",
    "course.marker.chapterTestDoneText": "chapterTestDoneText",
    "course.nav.taskTab": "taskTab",
    "course.nav.chapter": "chapter",
    "course.nav.jobUnfinishCount": "jobUnfinishCount",
    "course.nav.chapterName": "chapterName",
    "course.nav.specialMode": "specialMode",
    "course.nav.cursorCourseId": "cursorCourseId",
    "course.nav.cursorChapterId": "cursorChapterId",
    "course.nav.cursorClazzId": "cursorClazzId",
    "course.nav.sectionTabs": "sectionTabs",
    "course.nav.nextSectionFallback": "nextSectionFallback",
    "course.action.bigPlay": "bigPlay",
    "course.action.bigPlayLabel": "bigPlayLabel",
    "course.reader.pager": "readerPager",
    "course.reader.pagerZIndex": "activePagerZIndex",
    "course.reader.pptSlide": "pptSlide",
    "course.reader.timedReadFrame": "timedReadFrame"
  });

  const PROBE_PREFIX = "course.probe.";

  const MODULE_PREFIX = "course.module.";

  const SUBMITTED_TEXTS_KEY = "course.marker.chapterTestSubmittedTexts";

  const ERROR_TEXTS_KEY = "course.gate.playerErrorTexts";

  const usableSelector = (value, probe2) => {
    try {
      probe2.createDocumentFragment().querySelector(value);
      return true;
    } catch {
      return false;
    }
  };

  const firstString = value => typeof value === "string" && value.trim() ? value : null;

  function resolveCourseConfig(remote, probe2 = globalThis.document) {
    if (!remote || typeof remote !== "object" || !probe2) return DEFAULT_COURSE_CONFIG;
    const table = remote;
    const next = {
      ...DEFAULT_COURSE_CONFIG
    };
    for (const [key, field] of Object.entries(SELECTOR_KEYS)) {
      const value = firstString(table[key]);
      if (value === null) continue;
      const isSelector = field !== "taskDoneText" && field !== "bigPlayLabel" && field !== "activePagerZIndex" && field !== "chapterTestDoneClass" && field !== "chapterTestDoneText";
      if (isSelector && !usableSelector(value, probe2)) continue;
      next[field] = value;
    }
    const errorTexts = table[ERROR_TEXTS_KEY];
    if (Array.isArray(errorTexts)) {
      const texts = errorTexts.filter(item => typeof item === "string" && !!item.trim());
      if (texts.length > 0) next.playerErrorTexts = Object.freeze(texts);
    }
    const submittedTexts = table[SUBMITTED_TEXTS_KEY];
    if (Array.isArray(submittedTexts)) {
      const texts = submittedTexts.filter(item => typeof item === "string" && !!item.trim());
      if (texts.length > 0) next.chapterTestSubmittedTexts = Object.freeze(texts);
    }
    next.probes = Object.freeze(DEFAULT_COURSE_CONFIG.probes.map(([kind, selector], index) => {
      const override = firstString(table[`${PROBE_PREFIX}${kind}.${index}`]);
      return Object.freeze([ kind, override && usableSelector(override, probe2) ? override : selector ]);
    }));
    const moduleKind = {
      ...DEFAULT_COURSE_CONFIG.moduleKind
    };
    for (const [key, value] of Object.entries(table)) {
      if (!key.startsWith(MODULE_PREFIX)) continue;
      const name = key.slice(MODULE_PREFIX.length);
      const kind = firstString(value);
      if (!name || !kind || !isTaskKind(kind)) continue;
      moduleKind[name] = kind;
    }
    next.moduleKind = Object.freeze(moduleKind);
    return Object.freeze(next);
  }

  let active = DEFAULT_COURSE_CONFIG;

  const courseConfig = () => active;

  function applyCourseConfig(remote, probe2) {
    active = resolveCourseConfig(remote, probe2);
    return active;
  }

  function activeMedia(documents) {
    for (const doc of documents) for (const candidate of doc.querySelectorAll("video, audio")) {
      const media = candidate;
      if (!media.paused && media.readyState > 0) return media;
    }
    return null;
  }

  function mediaPosition(media) {
    return {
      currentSeconds: media.currentTime,
      totalSeconds: Number.isFinite(media.duration) ? media.duration : null,
      rate: media.playbackRate
    };
  }

  const WILL_NOT_BE_DONE = new Set([ "kind-off", "not-a-job" ]);

  function sectionLayer(survey, skipped) {
    if (!survey.authoritative) return null;
    const offCount = skipped.filter(item => item.reason === "kind-off").length;
    const total = Math.max(0, survey.declared - offCount);
    const pending = Math.max(0, survey.tasks.filter(isPendingTask).length - offCount);
    return {
      done: Math.max(0, total - pending),
      total: total,
      skipped: skipped.filter(item => WILL_NOT_BE_DONE.has(item.reason)).map(item => ({
        name: item.name,
        kind: item.kind,
        reason: item.reason
      }))
    };
  }

  function courseProgress(documents, survey, skipped, activeTask, course) {
    const media = activeMedia(documents);
    return {
      task: activeTask ? {
        name: activeTask.name,
        kind: activeTask.kind,
        position: media ? mediaPosition(media) : null
      } : null,
      section: sectionLayer(survey, skipped),
      course: course
    };
  }

  const MAX_READ_FRAMES = 64;

  const MAX_READ_DEPTH = 8;

  function readableDocuments(root) {
    const out = [ root ];
    const seen = new Set([ root ]);
    const queue = [ {
      doc: root,
      depth: 0
    } ];
    let frames = 0;
    while (queue.length > 0) {
      const current = queue.shift();
      if (!current || current.depth >= MAX_READ_DEPTH) continue;
      let list = [];
      try {
        list = [ ...current.doc.querySelectorAll("iframe, frame") ];
      } catch {
        continue;
      }
      for (const el of list) {
        if (++frames > MAX_READ_FRAMES) return out;
        let child = null;
        try {
          child = el.contentDocument;
        } catch {
          child = null;
        }
        if (!child || seen.has(child)) continue;
        seen.add(child);
        out.push(child);
        queue.push({
          doc: child,
          depth: current.depth + 1
        });
      }
    }
    return out;
  }

  const playableSource = media => !!(media.currentSrc || media.getAttribute("src") || media.querySelector("source[src]") || media.readyState >= 1);

  const playableMediaList = documents => {
    const found = [];
    for (const doc of documents) for (const candidate of doc.querySelectorAll("video, audio")) {
      const media = candidate;
      if (playableSource(media)) found.push(media);
    }
    return found;
  };

  const allMediaEnded = document2 => {
    const media = playableMediaList([ document2 ]);
    return media.length > 0 && media.every(item => item.ended);
  };

  function skippedTasks(survey, options) {
    const handled = options.isHandled ?? (() => false);
    const kindEnabled = options.isKindEnabled ?? (() => true);
    const out = [];
    for (const task of survey.tasks) {
      const reason = task.skip ? task.skip : !kindEnabled(task.kind) ? "kind-off" : task.kind === "media" ? allMediaEnded(task.document) ? "media-ended" : null : handled(task.key) ? "handled" : null;
      if (reason) out.push({
        name: task.name,
        kind: task.kind,
        reason: reason,
        key: task.key
      });
    }
    return out;
  }

  function pauseAllMedia(documents) {
    let paused = false;
    for (const doc of documents) for (const el of doc.querySelectorAll("video, audio")) {
      const media = el;
      if (media.paused) continue;
      try {
        media.pause();
        paused = true;
      } catch {}
    }
    return paused;
  }

  function pauseCourseMedia(document2) {
    return pauseAllMedia(readableDocuments(document2));
  }

  const STOPPING_BLOCK_REASONS = [ "budget-exhausted", "advance-failed", "locked" ];

  const isStoppingBlockReason = reason => STOPPING_BLOCK_REASONS.includes(reason);

  function courseStopReason(state) {
    switch (state.kind) {
     case "course-done":
     case "section-done":
     case "finished":
     case "section-stalled":
      return state.kind;

     case "blocked":
      return isStoppingBlockReason(state.reason) ? state.reason : null;

     default:
      return null;
    }
  }

  const DEFAULT_INTERVAL_MS = 3e3;

  const IDLE_TICKS_BEFORE_ADVANCE = 2;

  const LOADING_TICKS_BEFORE_ADVANCE = 10;

  const DEFAULT_MAX_DURATION_MS = 3 * 60 * 60 * 1e3;

  const ANSWERING_TICKS_BUDGET = 60;

  function runMediaTask(document2, options) {
    const adapter = options.adapter;
    const view = document2.defaultView;
    if (!view) throw new Error("media task document has no window");
    const intervalMs = options.intervalMs ?? DEFAULT_INTERVAL_MS;
    const maxDurationMs = options.maxDurationMs ?? DEFAULT_MAX_DURATION_MS;
    let elapsed = 0;
    let idleTicks = 0;
    let sectionsDone = 0;
    let pendingAdvanceFrom = null;
    let pendingTabFrom = null;
    let readingTaskKey = null;
    let readingSummary = null;
    let lastSignature = null;
    let lastSurveyKey = null;
    const handled = new Set;
    const pptSteps = new Map;
    const answeringTicks = new Map;
    let dwellUntil = 0;
    let dwellState = null;
    let timer = null;
    const stop = () => {
      if (timer != null) view.clearInterval(timer);
      timer = null;
    };
    const stepOptions = Object.create(options, {
      isHandled: {
        value: key => handled.has(key)
      }
    });
    timer = view.setInterval(() => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v;
      const memoryPressure = (_a = options.memoryGuard) == null ? void 0 : _a.check();
      if (memoryPressure != null) {
        stop();
        (_b = options.onMemoryPressure) == null ? void 0 : _b.call(options, memoryPressure);
        return;
      }
      elapsed += intervalMs;
      if (elapsed > maxDurationMs) {
        stop();
        (_c = options.onState) == null ? void 0 : _c.call(options, {
          kind: "blocked",
          reason: "budget-exhausted"
        });
        return;
      }
      const documents = ((_d = options.documents) == null ? void 0 : _d.call(options)) ?? readableDocuments(document2);
      const readable = documents;
      const signatureNow = adapter.navigate.sectionSignature(documents);
      if (signatureNow !== lastSignature) {
        lastSignature = signatureNow;
        handled.clear();
        pptSteps.clear();
        answeringTicks.clear();
        readingTaskKey = null;
      }
      if (options.onSurvey || options.onProgress) {
        const survey = adapter.survey(documents);
        const skipped = skippedTasks(survey, stepOptions);
        if (options.onSurvey) {
          const kinds = survey.tasks.map(task => task.kind);
          const key = `${kinds.join(",")}#${skipped.map(item => `${item.name}:${item.reason}`).join("|")}`;
          if (key !== lastSurveyKey) {
            lastSurveyKey = key;
            options.onSurvey({
              frames: documents.length,
              authoritative: survey.authoritative,
              declared: survey.declared,
              kinds: kinds,
              pending: survey.tasks.filter(isPendingTask).length,
              skipped: skipped
            });
          }
        }
        if (options.onProgress) {
          const skippedKeys = new Set(skipped.map(item => item.key));
          const actionable = survey.tasks.find(item => isPendingTask(item) && !skippedKeys.has(item.key));
          options.onProgress(courseProgress(documents, survey, skipped, actionable ?? null, adapter.courseCounter(documents)));
        }
      }
      const tryAdvanceTab = tabs2 => {
        const tabKey = `${adapter.navigate.sectionSignature(documents)}#${tabs2.activeIndex}`;
        if (pendingTabFrom === tabKey) {
          pendingTabFrom = null;
          return false;
        }
        if (!adapter.navigate.advanceTab(documents)) return false;
        pendingTabFrom = tabKey;
        return true;
      };
      if (dwellState && dwellUntil > elapsed) {
        (_e = options.onState) == null ? void 0 : _e.call(options, {
          ...dwellState,
          remainingMs: dwellUntil - elapsed
        });
        return;
      }
      dwellState = null;
      const state = adapter.step(documents, stepOptions);
      if (state.kind === "playing" || state.kind === "blocked") {
        idleTicks = 0;
        (_f = options.onState) == null ? void 0 : _f.call(options, state);
        return;
      }
      if (state.kind === "dwelling") {
        idleTicks = 0;
        handled.add(state.taskKey);
        dwellState = state;
        dwellUntil = elapsed + state.remainingMs;
        (_g = options.onState) == null ? void 0 : _g.call(options, state);
        return;
      }
      if (state.kind === "answering") {
        idleTicks = 0;
        const spent = (answeringTicks.get(state.taskKey) ?? 0) + 1;
        answeringTicks.set(state.taskKey, spent);
        if (spent >= ANSWERING_TICKS_BUDGET || ((_h = options.isAnsweringDone) == null ? void 0 : _h.call(options, state.taskKey))) handled.add(state.taskKey);
        if (!state.frameLoaded) {
          const tabs2 = adapter.navigate.tabs(documents);
          if (tabs2 && tryAdvanceTab(tabs2)) {
            (_i = options.onState) == null ? void 0 : _i.call(options, {
              kind: "advancing",
              toIndex: tabs2.activeIndex + 1
            });
            return;
          }
        }
        (_j = options.onState) == null ? void 0 : _j.call(options, {
          ...state,
          ticks: spent
        });
        return;
      }
      if (state.kind === "starting") {
        idleTicks = 0;
        (_k = options.onState) == null ? void 0 : _k.call(options, state);
        return;
      }
      if (state.kind === "hyperlink") {
        idleTicks = 0;
        handled.add(state.taskKey);
        (_l = options.onState) == null ? void 0 : _l.call(options, state);
        return;
      }
      if (state.kind === "ppt-slide") {
        idleTicks = 0;
        const turned = (pptSteps.get(state.taskKey) ?? 0) + 1;
        pptSteps.set(state.taskKey, turned);
        if (turned >= Math.max(state.total, 1)) handled.add(state.taskKey);
        (_m = options.onState) == null ? void 0 : _m.call(options, state);
        return;
      }
      const tabs = adapter.navigate.tabs(documents);
      const taskKey = state.kind === "idle" && state.taskKey ? state.taskKey : `${signatureNow}#${(tabs == null ? void 0 : tabs.activeIndex) ?? -1}`;
      let scrolledNow = false;
      if (state.kind === "idle" && readingTaskKey !== taskKey) {
        const taskContext = state.taskKey != null || tabs !== null || adapter.navigate.sectionCursor(documents) !== null;
        if (taskContext) {
          readingTaskKey = taskKey;
          readingSummary = adapter.simulateReading(readable);
          scrolledNow = true;
          if (state.taskKey) handled.add(state.taskKey);
        }
      }
      if (state.kind === "idle" || state.kind === "loading") {
        idleTicks += 1;
        const grace = state.kind === "loading" ? LOADING_TICKS_BEFORE_ADVANCE : IDLE_TICKS_BEFORE_ADVANCE;
        if (idleTicks < grace) {
          (_n = options.onState) == null ? void 0 : _n.call(options, scrolledNow && readingSummary ? {
            kind: "reading",
            summary: readingSummary
          } : state);
          return;
        }
      }
      if (tabs && tryAdvanceTab(tabs)) {
        idleTicks = 0;
        (_o = options.onState) == null ? void 0 : _o.call(options, {
          kind: "advancing",
          toIndex: tabs.activeIndex + 1
        });
        return;
      }
      {
        if (!tabs && !adapter.navigate.sectionCursor(documents)) {
          if (state.kind !== "idle" && state.kind !== "loading") stop();
          (_p = options.onState) == null ? void 0 : _p.call(options, state);
          return;
        }
        const chapters = adapter.navigate.chapters(documents);
        if (chapters.length > 0 && chapters.every(chapter2 => chapter2.unfinishedCount === 0)) {
          stop();
          (_q = options.onState) == null ? void 0 : _q.call(options, {
            kind: "course-done"
          });
          return;
        }
        if (pendingAdvanceFrom !== null) {
          if (signatureNow === pendingAdvanceFrom) {
            const chapter2 = adapter.navigate.nextUnfinishedChapter(chapters);
            if (chapter2 && adapter.navigate.jumpToChapter(documents, chapter2)) {
              pendingAdvanceFrom = null;
              idleTicks = 0;
              (_r = options.onState) == null ? void 0 : _r.call(options, {
                kind: "advancing-chapter",
                name: adapter.navigate.chapterLabel(chapter2)
              });
              return;
            }
            stop();
            (_s = options.onState) == null ? void 0 : _s.call(options, {
              kind: "blocked",
              reason: adapter.navigate.isSpecialMode(documents) ? "locked" : "advance-failed"
            });
            return;
          }
          pendingAdvanceFrom = null;
        }
        if (adapter.navigate.advanceSection(documents)) {
          sectionsDone += 1;
          idleTicks = 0;
          pendingAdvanceFrom = signatureNow;
          (_t = options.onState) == null ? void 0 : _t.call(options, {
            kind: "advancing-section",
            sectionsDone: sectionsDone
          });
          return;
        }
        const chapter = adapter.navigate.nextUnfinishedChapter(chapters);
        if (chapter && adapter.navigate.jumpToChapter(documents, chapter)) {
          idleTicks = 0;
          (_u = options.onState) == null ? void 0 : _u.call(options, {
            kind: "advancing-chapter",
            name: adapter.navigate.chapterLabel(chapter)
          });
          return;
        }
        stop();
        (_v = options.onState) == null ? void 0 : _v.call(options, {
          kind: "section-done"
        });
        return;
      }
    }, intervalMs);
    return {
      stop: stop
    };
  }

  const TIMED_READ_ROUNDS = 3;

  const TIMED_READ_SLACK_SECONDS = 3;

  const TIMED_READ_FALLBACK_SECONDS = 60;

  const MAX_DATA_HOPS = 3;

  const siteStateOf = attachment => attachment.job ? "job" : attachment.isPassed ? "passed" : "not-job";

  const courseWindow = document2 => {
    try {
      return pageWindowForDocument(document2) ?? null;
    } catch {
      return null;
    }
  };

  function courseAttachments(documents) {
    var _a;
    for (const document2 of documents) {
      const list = (_a = courseWindow(document2)) == null ? void 0 : _a.attachments;
      if (Array.isArray(list)) return list;
    }
    return null;
  }

  const attachmentJobId = attachment => {
    var _a;
    const raw = attachment.jobid || ((_a = attachment.property) == null ? void 0 : _a._jobid);
    return raw === void 0 || raw === null ? "" : String(raw);
  };

  const attachmentName = attachment => {
    const property = attachment == null ? void 0 : attachment.property;
    if (!property) return "";
    const {name: name, title: title, bookname: bookname, author: author} = property;
    if (typeof name === "string" && name) return name;
    if (typeof title === "string" && title) return title;
    if (typeof bookname === "string" && bookname) return typeof author === "string" && author ? `${bookname} ${author}` : bookname;
    return "";
  };

  const frameJobId = document2 => {
    var _a, _b, _c;
    let frame = ((_a = document2.defaultView) == null ? void 0 : _a.frameElement) ?? null;
    for (let hop = 0; frame && hop < MAX_DATA_HOPS; hop += 1) {
      const raw = frame.getAttribute("data");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const id = parsed.jobid || parsed._jobid;
          if (id !== void 0 && id !== null && String(id)) return String(id);
        } catch {}
      }
      try {
        frame = ((_c = (_b = frame.ownerDocument) == null ? void 0 : _b.defaultView) == null ? void 0 : _c.frameElement) ?? null;
      } catch {
        return null;
      }
    }
    return null;
  };

  const MAX_MARKER_HOPS = 12;

  const flattened$1 = value => (value ?? "").replace(/\s+/gu, "");

  const carriesDoneMarker = root => {
    const text = courseConfig().taskDoneText;
    if (flattened$1(root.textContent).includes(text)) return true;
    for (const element of root.querySelectorAll("[aria-label], [title], [alt]")) for (const attr of [ "aria-label", "title", "alt" ]) if (flattened$1(element.getAttribute(attr)).includes(text)) return true;
    return false;
  };

  const frameElementOf = document2 => {
    var _a;
    try {
      return ((_a = document2 == null ? void 0 : document2.defaultView) == null ? void 0 : _a.frameElement) ?? null;
    } catch {
      return null;
    }
  };

  const frameMarkedDone = document2 => {
    let node = frameElementOf(document2);
    for (let hop = 0; node && hop < MAX_MARKER_HOPS; hop += 1) {
      const parent = node.parentElement;
      if (!parent) {
        node = frameElementOf(node.ownerDocument);
        continue;
      }
      if (parent.querySelectorAll("iframe, frame").length > 1) return false;
      if (carriesDoneMarker(parent)) return true;
      node = parent;
    }
    return false;
  };

  function taskKindOf(document2) {
    for (const [kind, selector] of courseConfig().probes) {
      let hit = null;
      try {
        hit = document2.querySelector(selector);
      } catch {
        continue;
      }
      if (hit) return kind;
    }
    return null;
  }

  const dwellSecondsOf = document2 => {
    var _a;
    const frame = document2.querySelector(courseConfig().timedReadFrame);
    const src = (frame == null ? void 0 : frame.getAttribute("src")) ?? "";
    const raw = (_a = /[?&]timing=(\d+)/u.exec(src)) == null ? void 0 : _a[1];
    const timing = raw ? Number.parseInt(raw, 10) : TIMED_READ_FALLBACK_SECONDS;
    const seconds = Number.isFinite(timing) ? timing : TIMED_READ_FALLBACK_SECONDS;
    return (seconds + TIMED_READ_SLACK_SECONDS) * TIMED_READ_ROUNDS;
  };

  const moduleOf = attachment => {
    var _a;
    return typeof ((_a = attachment.property) == null ? void 0 : _a.module) === "string" ? attachment.property.module : "";
  };

  const chapterTestDone = root => {
    const status = root.querySelector(courseConfig().chapterTestStatus);
    if (!status) return null;
    const text = flattened$1(status.textContent);
    return status.classList.contains(courseConfig().chapterTestDoneClass) || text.includes(courseConfig().chapterTestDoneText) || courseConfig().chapterTestSubmittedTexts.some(sample => text.includes(sample));
  };

  const skipForSiteState = (state, kind, frame) => {
    if (kind === "chapter-test" && frame && chapterTestDone(frame) === true) return "test-done";
    if (state === "job") return null;
    if (state === "passed") return "passed";
    if (kind !== "chapter-test") return "not-a-job";
    const done = frame ? chapterTestDone(frame) : null;
    if (done === null) return "not-a-job";
    return done ? "test-done" : null;
  };

  function surveyTasks$1(documents) {
    const attachments = courseAttachments(documents);
    const framesByJobId = new Map;
    for (const document2 of documents) {
      const jobId = frameJobId(document2);
      if (!jobId) continue;
      const bucket = framesByJobId.get(jobId);
      if (bucket) bucket.push(document2); else framesByJobId.set(jobId, [ document2 ]);
    }
    const frameFor = jobId => {
      const bucket = framesByJobId.get(jobId);
      if (!bucket) return void 0;
      return bucket.find(document2 => taskKindOf(document2)) ?? bucket[0];
    };
    const tasks = [];
    const claimed = new Set;
    const root = documents[0];
    for (const attachment of attachments ?? []) {
      const jobId = attachmentJobId(attachment);
      if (!jobId) continue;
      const frame = frameFor(jobId);
      for (const document22 of framesByJobId.get(jobId) ?? []) claimed.add(document22);
      const kind = (frame ? taskKindOf(frame) : null) ?? courseConfig().moduleKind[moduleOf(attachment)] ?? "unknown";
      const document2 = frame ?? root;
      tasks.push({
        document: document2,
        kind: kind,
        jobId: jobId,
        name: attachmentName(attachment) || KIND_LABEL[kind],
        skip: skipForSiteState(siteStateOf(attachment), kind, frame),
        dwellSeconds: kind === "timed-read" ? dwellSecondsOf(document2) : 0,
        key: jobId
      });
    }
    const declaredPending = tasks.some(task => task.jobId !== null && task.skip === null);
    for (const document2 of documents) {
      if (claimed.has(document2)) continue;
      const kind = taskKindOf(document2);
      if (!kind) continue;
      const jobId = frameJobId(document2);
      if (jobId && tasks.some(task => task.jobId === jobId)) continue;
      const key = jobId ?? `${kind}#${tasks.length}`;
      tasks.push({
        document: document2,
        kind: kind,
        jobId: jobId,
        name: KIND_LABEL[kind],
        skip: attachments !== null && !declaredPending ? "section-clear" : frameMarkedDone(document2) ? "marked-done" : null,
        dwellSeconds: kind === "timed-read" ? dwellSecondsOf(document2) : 0,
        key: key
      });
    }
    return {
      authoritative: attachments !== null,
      declared: (attachments == null ? void 0 : attachments.length) ?? 0,
      tasks: tasks
    };
  }

  const inputValue = (document2, selector) => {
    const element = document2.querySelector(selector);
    if (!element) return "";
    const view = element.ownerDocument.defaultView;
    if (view && element instanceof view.HTMLInputElement) return element.value;
    return element.getAttribute("value") ?? "";
  };

  function sectionCursor$1(documents) {
    for (const document2 of documents) {
      const courseId = inputValue(document2, courseConfig().cursorCourseId);
      const chapterId = inputValue(document2, courseConfig().cursorChapterId);
      const clazzId = inputValue(document2, courseConfig().cursorClazzId);
      if (!courseId || !chapterId || !clazzId) continue;
      return {
        courseId: courseId,
        chapterId: chapterId,
        clazzId: clazzId,
        tabCount: document2.querySelectorAll(courseConfig().sectionTabs).length,
        document: document2
      };
    }
    return null;
  }

  function advanceSectionViaSite(documents) {
    const cursor = sectionCursor$1(documents);
    if (!cursor) return false;
    const pageWindow = courseWindow(cursor.document);
    const counter = pageWindow == null ? void 0 : pageWindow.PCount;
    if (typeof (counter == null ? void 0 : counter.next) !== "function") return false;
    try {
      counter.next(String(cursor.tabCount), cursor.chapterId, cursor.courseId, cursor.clazzId, "");
      return true;
    } catch {
      return false;
    }
  }

  const CHAPTER_ID_PATTERN = /\('(.*)','(.*)','(.*)'\)/u;

  function chapterInfos$1(documents) {
    for (const document2 of documents) {
      const elements = [ ...document2.querySelectorAll(courseConfig().chapter) ];
      if (elements.length === 0) continue;
      return elements.map(element => {
        var _a;
        const parent = element.parentElement;
        const counter = parent == null ? void 0 : parent.querySelector(courseConfig().jobUnfinishCount);
        const view = counter == null ? void 0 : counter.ownerDocument.defaultView;
        const raw = view && counter instanceof view.HTMLInputElement ? counter.value : (counter == null ? void 0 : counter.getAttribute("value")) ?? "0";
        return {
          element: element,
          chapterId: ((_a = CHAPTER_ID_PATTERN.exec(element.getAttribute("onclick") ?? "")) == null ? void 0 : _a[3]) ?? null,
          unfinishedCount: Number.parseInt(raw, 10) || 0,
          active: (parent == null ? void 0 : parent.classList.contains("posCatalog_active")) ?? false
        };
      });
    }
    return [];
  }

  function nextUnfinishedChapter$1(chapters) {
    const pending = chapters.filter(chapter => chapter.unfinishedCount > 0 && !chapter.active);
    if (pending.length === 0) return null;
    const activeIndex = chapters.findIndex(chapter => chapter.active);
    return pending.find(chapter => chapters.indexOf(chapter) > activeIndex) ?? pending[0] ?? null;
  }

  function jumpToChapter$1(documents, chapter) {
    var _a;
    const entry = (_a = chapter.element.parentElement) == null ? void 0 : _a.querySelector(courseConfig().chapterName);
    if (entry) {
      try {
        entry.click();
        return true;
      } catch {}
    }
    const cursor = sectionCursor$1(documents);
    if (!cursor || !chapter.chapterId) return false;
    const pageWindow = courseWindow(cursor.document);
    const jump = pageWindow == null ? void 0 : pageWindow.getTeacherAjax;
    if (typeof jump !== "function") return false;
    try {
      jump(cursor.courseId, cursor.clazzId, chapter.chapterId);
      return true;
    } catch {
      return false;
    }
  }

  function isSpecialMode(documents) {
    return documents.some(document2 => document2.querySelector(courseConfig().specialMode));
  }

  function advancePptSlide(document2) {
    for (const audio of document2.querySelectorAll("audio")) audio.muted = true;
    const pageWindow = courseWindow(document2);
    const next = pageWindow == null ? void 0 : pageWindow.swiperNext;
    if (typeof next !== "function") return false;
    try {
      next();
      return true;
    } catch {
      return false;
    }
  }

  const pptSlideCount = document2 => document2.querySelectorAll(courseConfig().pptSlide).length;

  function startPlayer(document2) {
    const direct = document2.querySelector(courseConfig().bigPlay);
    const target = direct ?? [ ...document2.querySelectorAll("button, a, div, span") ].find(element => [ element.getAttribute("aria-label"), element.getAttribute("title"), element.textContent ].some(value => (value ?? "").trim() === courseConfig().bigPlayLabel));
    if (!target) return false;
    try {
      target.click();
      return true;
    } catch {
      return false;
    }
  }

  function openHyperlink(document2) {
    const link = document2.querySelector("#hyperlink");
    if (!link) return false;
    const element = link;
    const previous = element.onclick;
    try {
      element.onclick = () => false;
      element.click();
      return true;
    } catch {
      return false;
    } finally {
      element.onclick = previous;
    }
  }

  const MAX_PLAYBACK_RATE$1 = 2;

  const hasFaceRecognition = doc => {
    for (const img of doc.querySelectorAll(courseConfig().faceLegacy)) if (img.getAttribute("src")) return true;
    for (const mask of doc.querySelectorAll(courseConfig().faceMask)) {
      const view = mask.ownerDocument.defaultView;
      const display = mask instanceof ((view == null ? void 0 : view.HTMLElement) ?? HTMLElement) ? mask.style.display : "";
      if (display !== "none") return true;
    }
    return false;
  };

  const flattened = value => (value ?? "").replace(/\s+/gu, "");

  const taskAlreadyDone = doc => {
    var _a;
    if (flattened((_a = doc.body) == null ? void 0 : _a.textContent).includes(courseConfig().taskDoneText)) return true;
    for (const el of doc.querySelectorAll("[aria-label], [title], [alt]")) {
      for (const attr of [ "aria-label", "title", "alt" ]) if (flattened(el.getAttribute(attr)).includes(courseConfig().taskDoneText)) return true;
    }
    return false;
  };

  const hasPlayerError = doc => {
    for (const dialog of doc.querySelectorAll(courseConfig().playerError)) {
      const text = dialog.textContent ?? "";
      if (courseConfig().playerErrorTexts.some(sample => text.includes(sample))) return true;
    }
    return false;
  };

  const NETWORK_LOADING = 2;

  const isLoadingMedia = media => media.networkState === NETWORK_LOADING;

  const hasLoadingMedia = documents => documents.some(doc => [ ...doc.querySelectorAll("video, audio") ].some(el => isLoadingMedia(el)));

  function playMedia$1(pending, options) {
    var _a;
    const rate = Math.min(Math.max(options.playbackRate ?? 1, 1), MAX_PLAYBACK_RATE$1);
    pending.volume = options.volume ?? 0;
    pending.playbackRate = rate;
    void ((_a = pending.play()) == null ? void 0 : _a.catch(() => {}));
    if (pending.paused) return {
      kind: "blocked",
      reason: "not-playing"
    };
    return {
      kind: "playing",
      rate: rate
    };
  }

  function stepSurveyedTask(survey, documents, options) {
    const handled = options.isHandled ?? (() => false);
    const kindEnabled = options.isKindEnabled ?? (() => true);
    const unfinished = survey.tasks.filter(task2 => isPendingTask(task2) && kindEnabled(task2.kind));
    const actionable = unfinished.filter(task2 => task2.kind === "media" ? !allMediaEnded(task2.document) : !handled(task2.key));
    if (actionable.length === 0) return unfinished.length === 0 ? {
      kind: "all-done",
      declared: survey.declared
    } : {
      kind: "section-stalled",
      unfinished: unfinished.length,
      names: unfinished.map(task2 => task2.name)
    };
    const task = actionable[0];
    switch (task.kind) {
     case "media":
      {
        const media = playableMediaList([ task.document ]);
        const pending = media.find(item => !item.ended) ?? playableMediaList(documents).find(item => !item.ended);
        if (!pending) {
          const live = documents.some(doc => [ ...doc.querySelectorAll("video, audio") ].some(item => !item.paused));
          if (!live && documents.some(doc => startPlayer(doc))) return {
            kind: "starting",
            name: task.name,
            taskKey: task.key
          };
          return {
            kind: "loading",
            taskKey: task.key
          };
        }
        return playMedia$1(pending, options);
      }

     case "chapter-test":
      return {
        kind: "answering",
        name: task.name,
        taskKey: task.key,
        frameLoaded: !!task.document.querySelector(courseConfig().chapterTestAnswerable)
      };

     case "hyperlink":
      return openHyperlink(task.document) ? {
        kind: "hyperlink",
        name: task.name,
        taskKey: task.key
      } : {
        kind: "idle",
        taskKey: task.key
      };

     case "ppt-audio":
      return advancePptSlide(task.document) ? {
        kind: "ppt-slide",
        name: task.name,
        total: pptSlideCount(task.document),
        taskKey: task.key
      } : {
        kind: "idle",
        taskKey: task.key
      };

     case "timed-read":
      return {
        kind: "dwelling",
        name: task.name,
        remainingMs: task.dwellSeconds * 1e3,
        taskKey: task.key
      };

     default:
      return {
        kind: "idle",
        taskKey: task.key
      };
    }
  }

  function stepMediaTask(documents, options) {
    for (const doc of documents) {
      if (hasFaceRecognition(doc)) return {
        kind: "blocked",
        reason: "face-recognition"
      };
      if (hasPlayerError(doc)) return {
        kind: "blocked",
        reason: "media-error"
      };
      if (doc.querySelector(courseConfig().videoQuiz)) return {
        kind: "blocked",
        reason: "video-quiz"
      };
    }
    const survey = surveyTasks$1(documents);
    if (survey.authoritative) return stepSurveyedTask(survey, documents, options);
    const media = playableMediaList(documents);
    const markerDone = documents.slice(1).some(taskAlreadyDone);
    if (markerDone && media.length <= 1) return {
      kind: "finished"
    };
    const pending = media.find(item => !item.ended);
    if (!pending) {
      if (media.length > 0) return {
        kind: "finished"
      };
      return {
        kind: hasLoadingMedia(documents) ? "loading" : "idle"
      };
    }
    return playMedia$1(pending, options);
  }

  function taskTabs(documents) {
    for (const doc of documents) {
      const tabs = [ ...doc.querySelectorAll(courseConfig().taskTab) ];
      if (tabs.length === 0) continue;
      return {
        count: tabs.length,
        activeIndex: tabs.findIndex(tab => tab.classList.contains("active")),
        tabs: tabs
      };
    }
    return null;
  }

  function advanceTaskTab(documents) {
    var _a;
    const found = taskTabs(documents);
    if (!found || found.activeIndex < 0) return false;
    const next = found.activeIndex + 1;
    if (next >= found.count) return false;
    (_a = found.tabs[next]) == null ? void 0 : _a.click();
    return true;
  }

  const NEXT_SECTION_TEXT = "\u4e0b\u4e00\u8282";

  function nextSectionTarget(documents) {
    for (const doc of documents) {
      for (const el of doc.querySelectorAll("a, button, div, span, i")) {
        if ((el.textContent ?? "").trim() === NEXT_SECTION_TEXT) return el;
      }
      const fallback = doc.querySelector(courseConfig().nextSectionFallback);
      if (fallback) return fallback;
    }
    return null;
  }

  function advanceSection$1(documents) {
    const target = nextSectionTarget(documents);
    if (!target) return false;
    target.click();
    return true;
  }

  function sectionSignature$1(documents) {
    var _a, _b;
    const href = ((_b = (_a = documents[0]) == null ? void 0 : _a.location) == null ? void 0 : _b.href) ?? "";
    const tabs = taskTabs(documents);
    const labels = (tabs == null ? void 0 : tabs.tabs.map(tab => tab.textContent ?? "").join(",")) ?? "";
    return `${href}|${labels}`;
  }

  const SCROLLABLE_SLACK_PX = 8;

  const MAX_SCROLL_TARGETS = 2e3;

  function simulateReading$1(documents) {
    var _a, _b, _c;
    const summary = {
      frames: documents.length,
      scrolled: 0,
      pagers: 0
    };
    for (const doc of documents) {
      const pager = [ ...doc.querySelectorAll(courseConfig().readerPager) ].find(el => {
        var _a2;
        return ((_a2 = el.style) == null ? void 0 : _a2.zIndex) === courseConfig().activePagerZIndex;
      });
      if (pager) {
        try {
          pager.click();
          summary.pagers += 1;
        } catch {}
      }
      try {
        (_c = (_a = doc.defaultView) == null ? void 0 : _a.scrollTo) == null ? void 0 : _c.call(_a, 0, ((_b = doc.documentElement) == null ? void 0 : _b.scrollHeight) ?? 0);
      } catch {}
      let touched = 0;
      for (const el of doc.querySelectorAll("div, section, main")) {
        if (++touched > MAX_SCROLL_TARGETS) break;
        if (el.scrollHeight <= el.clientHeight + SCROLLABLE_SLACK_PX) continue;
        try {
          el.scrollTop = el.scrollHeight;
          summary.scrolled += 1;
        } catch {}
      }
    }
    return summary;
  }

  const chapterLabel$1 = chapter => {
    var _a, _b;
    const name = ((_b = (_a = chapter.element.parentElement) == null ? void 0 : _a.querySelector(courseConfig().chapterName)) == null ? void 0 : _b.textContent) ?? chapter.element.textContent;
    return (name ?? "").trim() || "\u4e0b\u4e00\u4e2a\u672a\u5b8c\u6210\u7ae0\u8282";
  };

  function counterElementCount(documents) {
    for (const document2 of documents) {
      if (document2.querySelectorAll(courseConfig().chapter).length === 0) continue;
      return document2.querySelectorAll(courseConfig().jobUnfinishCount).length;
    }
    return 0;
  }

  function courseCounter(documents) {
    const chapters = chapterInfos$1(documents);
    if (chapters.length === 0) return null;
    if (counterElementCount(documents) === 0) return null;
    return {
      unfinished: chapters.reduce((sum, chapter) => sum + chapter.unfinishedCount, 0)
    };
  }

  function createChaoxingCourseAdapter() {
    return {
      step: stepMediaTask,
      survey: surveyTasks$1,
      courseCounter: courseCounter,
      simulateReading: simulateReading$1,
      navigate: {
        tabs: taskTabs,
        advanceTab: advanceTaskTab,
        sectionSignature: sectionSignature$1,
        sectionCursor: sectionCursor$1,
        chapters: chapterInfos$1,
        nextUnfinishedChapter: nextUnfinishedChapter$1,
        jumpToChapter: jumpToChapter$1,
        isSpecialMode: isSpecialMode,
        advanceSection: documents => advanceSectionViaSite(documents) || advanceSection$1(documents),
        chapterLabel: chapterLabel$1
      }
    };
  }

  const COURSE_PATH = "/student/courseuser/courseContent";

  const ACTIVITY_PATH = "/student/activity/display";

  const KIND_BY_NODETYPE = {
    2: "media",
    7: "media",
    3: "document",
    4: "chapter-test",
    5: "chapter-test"
  };

  const isDoneState = state => state.classList.contains("finished");

  const DOCUMENT_DWELL_MS = 7e4;

  const dwelled = new Set;

  const ATTEMPTED_KEY = "aiask.wenhua.attempted";

  const attemptedIds = doc => {
    var _a, _b;
    try {
      const raw = (_b = (_a = doc.defaultView) == null ? void 0 : _a.sessionStorage) == null ? void 0 : _b.getItem(ATTEMPTED_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return new Set(Array.isArray(parsed) ? parsed.map(String) : []);
    } catch {
      return new Set;
    }
  };

  const markAttempted = (doc, id) => {
    var _a, _b;
    if (!id) return;
    try {
      const ids = attemptedIds(doc);
      ids.add(id);
      (_b = (_a = doc.defaultView) == null ? void 0 : _a.sessionStorage) == null ? void 0 : _b.setItem(ATTEMPTED_KEY, JSON.stringify([ ...ids ]));
    } catch {}
  };

  const pageUrl = doc => {
    var _a;
    try {
      return new URL(((_a = doc == null ? void 0 : doc.location) == null ? void 0 : _a.href) ?? "");
    } catch {
      return null;
    }
  };

  const isCoursePage = url => (url == null ? void 0 : url.pathname.endsWith(COURSE_PATH)) ?? false;

  const isActivityPage = url => (url == null ? void 0 : url.pathname.endsWith(ACTIVITY_PATH)) ?? false;

  const courseVersionId = url => (url == null ? void 0 : url.searchParams.get("courseVersionId")) ?? "";

  const activityId = url => (url == null ? void 0 : url.searchParams.get("activityId")) ?? "";

  const firstDocument = documents => documents[0] ?? null;

  const activityElements = doc => Array.from(doc.querySelectorAll(".activity[nodetype]"));

  const isDone = element => {
    const state = element.querySelector(".activity-state");
    return state != null && isDoneState(state);
  };

  const taskName = element => {
    var _a, _b;
    return ((_b = (_a = element.querySelector(".activity-name .name")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim()) ?? "\u4efb\u52a1\u70b9";
  };

  const toTask = (doc, element) => {
    const nodetype = element.getAttribute("nodetype") ?? "";
    const kind = KIND_BY_NODETYPE[nodetype];
    if (!kind) return null;
    const id = element.id || "";
    if (!id) return null;
    const name = taskName(element);
    const skip = isDone(element) ? "passed" : attemptedIds(doc).has(id) ? "handled" : null;
    return {
      document: doc,
      kind: kind,
      jobId: id,
      name: name,
      skip: skip,
      dwellSeconds: 0,
      key: id
    };
  };

  function surveyTasks(documents) {
    const doc = firstDocument(documents);
    const url = pageUrl(doc);
    if (!doc) return {
      authoritative: false,
      declared: 0,
      tasks: []
    };
    if (isCoursePage(url)) {
      const tasks = activityElements(doc).map(element => toTask(doc, element)).filter(task => task !== null);
      return {
        authoritative: true,
        declared: tasks.length,
        tasks: tasks
      };
    }
    if (isActivityPage(url)) {
      const id = activityId(url);
      const kind = doc.querySelector("video,audio") ? "media" : "document";
      return {
        authoritative: false,
        declared: 1,
        tasks: [ {
          document: doc,
          kind: kind,
          jobId: id || null,
          name: doc.title || "\u4efb\u52a1\u70b9",
          skip: dwelled.has(id) ? "handled" : null,
          dwellSeconds: 0,
          key: id
        } ]
      };
    }
    return {
      authoritative: false,
      declared: 0,
      tasks: []
    };
  }

  const MAX_PLAYBACK_RATE = 2;

  function playMedia(media, options) {
    var _a;
    const rate = Math.min(Math.max(options.playbackRate ?? 1, 1), MAX_PLAYBACK_RATE);
    media.volume = options.volume ?? 0;
    media.playbackRate = rate;
    void ((_a = media.play()) == null ? void 0 : _a.catch(() => {}));
    if (media.paused) return {
      kind: "blocked",
      reason: "not-playing"
    };
    return {
      kind: "playing",
      rate: rate
    };
  }

  const mediaEnded = media => {
    if (media.ended) return true;
    const total = media.duration;
    return Number.isFinite(total) && total > 0 && media.currentTime >= total - 1;
  };

  function stepTask(documents, options) {
    var _a;
    const doc = firstDocument(documents);
    const url = pageUrl(doc);
    if (!doc || !isActivityPage(url)) return {
      kind: "idle"
    };
    const id = activityId(url);
    const key = id || (url == null ? void 0 : url.pathname) || "activity";
    if (dwelled.has(key) || ((_a = options.isHandled) == null ? void 0 : _a.call(options, key))) return {
      kind: "idle",
      taskKey: key
    };
    const media = doc.querySelector("video,audio");
    if (media) {
      if (mediaEnded(media)) {
        dwelled.add(key);
        markAttempted(doc, key);
        return {
          kind: "idle",
          taskKey: key
        };
      }
      return playMedia(media, options);
    }
    dwelled.add(key);
    markAttempted(doc, key);
    return {
      kind: "dwelling",
      name: doc.title || "\u4efb\u52a1\u70b9",
      remainingMs: DOCUMENT_DWELL_MS,
      taskKey: key
    };
  }

  const simulateReading = () => ({
    frames: 0,
    scrolled: 0,
    pagers: 0
  });

  function sectionCursor(documents) {
    const doc = firstDocument(documents);
    const url = pageUrl(doc);
    if (!doc || !isCoursePage(url) && !isActivityPage(url)) return null;
    const courseId = courseVersionId(url);
    if (!courseId) return null;
    return {
      courseId: courseId,
      chapterId: activityId(url),
      clazzId: "",
      tabCount: 1,
      document: doc
    };
  }

  function chapterInfos(documents) {
    const doc = firstDocument(documents);
    const url = pageUrl(doc);
    if (!doc || !isCoursePage(url)) return [];
    return activityElements(doc).filter(element => KIND_BY_NODETYPE[element.getAttribute("nodetype") ?? ""]).map(element => ({
      element: element,
      chapterId: element.id || null,
      unfinishedCount: isDone(element) ? 0 : 1,
      active: false
    }));
  }

  const nextUnfinishedChapter = chapters => chapters.find(chapter => {
    if (chapter.unfinishedCount <= 0) return false;
    const doc = chapter.element.ownerDocument;
    return !(chapter.chapterId && attemptedIds(doc).has(chapter.chapterId));
  }) ?? null;

  function activityUrlFrom(url, activityIdValue) {
    const courseId = courseVersionId(url);
    if (!url || !courseId || !activityIdValue) return null;
    const target = new URL(url.href);
    target.pathname = url.pathname.replace(COURSE_PATH, ACTIVITY_PATH);
    target.search = "";
    target.searchParams.set("courseVersionId", courseId);
    target.searchParams.set("activityId", activityIdValue);
    return target.href;
  }

  function jumpToChapter(documents, chapter) {
    const doc = firstDocument(documents);
    const href = activityUrlFrom(pageUrl(doc), chapter.chapterId);
    if (!doc || !href) return false;
    markAttempted(doc, chapter.chapterId ?? "");
    doc.location.href = href;
    return true;
  }

  function courseUrlFrom(url) {
    const courseId = courseVersionId(url);
    if (!url || !courseId) return null;
    const target = new URL(url.href);
    target.pathname = url.pathname.replace(ACTIVITY_PATH, COURSE_PATH);
    target.search = "";
    target.searchParams.set("courseVersionId", courseId);
    return target.href;
  }

  function hasDwelled(url) {
    if (!url) return false;
    return dwelled.has(activityId(url) || url.pathname);
  }

  function advanceSection(documents) {
    const doc = firstDocument(documents);
    const url = pageUrl(doc);
    if (!doc || !url || !isActivityPage(url) || !hasDwelled(url)) return false;
    const href = courseUrlFrom(url);
    if (!href) return false;
    doc.location.href = href;
    return true;
  }

  const sectionSignature = documents => {
    const url = pageUrl(firstDocument(documents));
    return url ? `${url.pathname}?${url.searchParams.toString()}` : "";
  };

  const chapterLabel = chapter => taskName(chapter.element);

  function createWenhuaCourseAdapter() {
    return {
      step: stepTask,
      survey: surveyTasks,
      courseCounter: () => null,
      simulateReading: simulateReading,
      navigate: {
        tabs: () => null,
        advanceTab: () => false,
        sectionSignature: sectionSignature,
        sectionCursor: sectionCursor,
        chapters: chapterInfos,
        nextUnfinishedChapter: nextUnfinishedChapter,
        jumpToChapter: jumpToChapter,
        isSpecialMode: () => false,
        advanceSection: advanceSection,
        chapterLabel: chapterLabel
      }
    };
  }

  function isWenhuaCourseStudyUrl(location2) {
    try {
      const url = new URL(location2.href);
      return isCoursePage(url) || isActivityPage(url);
    } catch {
      return false;
    }
  }

  function courseAdapterFor(platform) {
    if (platform === "chaoxing") return createChaoxingCourseAdapter();
    if (platform === "wenhua") return createWenhuaCourseAdapter();
    return null;
  }

  function isCourseStudyUrl(platform, location2) {
    if (platform === "chaoxing") return isNewCourseStudyUrl(location2);
    if (platform === "wenhua") return isWenhuaCourseStudyUrl(location2);
    return false;
  }

  const SUBMIT_CLASSES = [ "btnBlueSubmit" ];

  const SUBMIT_HANDLERS = [ "btnBlueSubmit" ];

  const SUBMIT_TEXTS = [ "\u63d0\u4ea4", "\u4ea4\u5377", "\u786e\u5b9a\u63d0\u4ea4" ];

  const isExamPage = document2 => {
    var _a;
    return (((_a = document2.location) == null ? void 0 : _a.pathname) ?? "").includes("/exam");
  };

  const normalizedText = element => (element.textContent ?? "").replace(/\s+/gu, "");

  const DEFAULT_SUBMIT_THRESHOLD = .8;

  function trustedRatio(items, answerableCount) {
    if (items.length === 0) return 0;
    const denominator = Math.max(items.length, answerableCount ?? 0);
    const trusted = items.filter(item => item.filled && !item.random).length;
    return trusted / denominator;
  }

  function shouldAutoSubmit(state) {
    if (!state.enabled) return false;
    if (state.items.length === 0) return false;
    const threshold = state.threshold ?? DEFAULT_SUBMIT_THRESHOLD;
    return trustedRatio(state.items, state.answerableCount) >= threshold;
  }

  const hasUnrecognizedQuestions = state => state.answerableCount != null && state.answerableCount > state.items.length;

  function safeSubmitTarget(documents) {
    if (documents.some(isExamPage)) return null;
    const hits = [];
    for (const document2 of documents) {
      let list = [];
      try {
        list = [ ...document2.querySelectorAll("a, button, input") ];
      } catch {
        continue;
      }
      for (const element of list) {
        const text = normalizedText(element);
        const value = element.getAttribute("value") ?? "";
        if (!SUBMIT_TEXTS.some(label => text === label || value === label)) continue;
        const handler = element.getAttribute("onclick") ?? "";
        const classMatch = SUBMIT_CLASSES.some(name => element.classList.contains(name));
        const handlerMatch = SUBMIT_HANDLERS.some(name => handler.startsWith(name));
        if (classMatch || handlerMatch) hits.push(element);
        if (hits.length > 1) return null;
      }
    }
    return hits[0] ?? null;
  }

  const CANDIDATE_TEXT = /^(\u63d0\u4ea4|\u4ea4\u5377|\u786e\u5b9a\u63d0\u4ea4|\u786e\u5b9a|\u53d6\u6d88|\u5173\u95ed|\u6682\u65f6\u4fdd\u5b58|\u4fdd\u5b58\u5e76\u63d0\u4ea4)$/u;

  function submitCandidates(documents) {
    const out = [];
    for (const document2 of documents) {
      let list = [];
      try {
        list = [ ...document2.querySelectorAll("a, button, input, div, span") ];
      } catch {
        continue;
      }
      for (const element of list) {
        const text = normalizedText(element) || element.getAttribute("value") || "";
        if (!CANDIDATE_TEXT.test(text) || text.length > 12) continue;
        const handler = element.getAttribute("onclick") ?? "";
        out.push({
          text: text,
          tag: element.tagName.toLowerCase(),
          className: element.className || "",
          handler: handler.slice(0, 40),
          textLock: SUBMIT_TEXTS.some(label => text === label),
          entryLock: SUBMIT_CLASSES.some(name => element.classList.contains(name)) || SUBMIT_HANDLERS.some(name => handler.startsWith(name))
        });
        if (out.length >= 12) return out;
      }
    }
    return out;
  }

  const DEFAULT_CONFIRM_TIMEOUT_MS = 4e3;

  const DEFAULT_VERIFY_TIMEOUT_MS = 6e3;

  const POLL_MS = 200;

  const CONFIRM_SETTLE_MS = 600;

  const CONFIRM_CLICK_ATTEMPTS = 2;

  const sleep = ms => new Promise(resolve => {
    globalThis.setTimeout(resolve, ms);
  });

  const ENTRY_HANDLER_NAMES = [ "btnBlueSubmit" ];

  function pageSubmitQuotaExhausted(view) {
    try {
      const quota = view == null ? void 0 : view.reqLimit;
      return typeof quota === "number" && quota < 0;
    } catch {
      return false;
    }
  }

  const ENTRY_CHAIN_NAMES = [ "btnBlueSubmit", "validateTimeNew", "toadd", "confirmSubmitWork" ];

  function readFunction(view, name) {
    if (!view) return null;
    try {
      const value = view[name];
      return typeof value === "function" ? value : null;
    } catch {
      return null;
    }
  }

  function entryHandlerSource(view) {
    if (!view) return "";
    const parts = [];
    for (const name of ENTRY_CHAIN_NAMES) {
      const handler = readFunction(view, name);
      if (handler) parts.push(`${name}=${String(handler).replace(/\s+/gu, " ").slice(0, 600)}`);
    }
    return parts.join(" \u23ce ");
  }

  const CONFIRM_FUNCTION_NAMES = [ "submitCheckTimes", "confirmSubmitWork" ];

  function readScalar(view, key) {
    try {
      return String(view[key]);
    } catch {
      return "\u8bfb\u4e0d\u5230";
    }
  }

  function pageSubmitLocked(view) {
    if (!view) return false;
    try {
      const lock = view.submitLock;
      return typeof lock === "number" && lock !== 0;
    } catch {
      return false;
    }
  }

  function captureSiteMessage(view) {
    let message = "";
    const restores = [];
    const patch = (target, key, read) => {
      let original;
      try {
        original = target[key];
      } catch {
        return;
      }
      if (typeof original !== "function") return;
      try {
        target[key] = (...args) => {
          if (!message) message = read(args).slice(0, 160);
          return original.apply(target, args);
        };
        restores.push(() => {
          try {
            target[key] = original;
          } catch {}
        });
      } catch {}
    };
    patch(view, "alert", args => String(args[0] ?? ""));
    try {
      const jquery = view.$;
      if (jquery) patch(jquery, "toast", args => {
        var _a;
        return String(((_a = args[0]) == null ? void 0 : _a.content) ?? "");
      });
    } catch {}
    return {
      message: () => message,
      restore: () => {
        for (const undo of restores) undo();
      }
    };
  }

  function answeredFieldSummary(view) {
    var _a;
    try {
      const doc = view.document;
      const form = (_a = doc == null ? void 0 : doc.forms) == null ? void 0 : _a.namedItem("form1");
      if (!form) return "form=\u8bfb\u4e0d\u5230";
      const answers = [ ...form.querySelectorAll('input[name^="answer"]') ];
      const filled = answers.filter(el => (el.value ?? "").trim() !== "").length;
      const empty = [ ...form.elements ].map(el => el).filter(el => el.name && !String(el.value ?? "").trim()).map(el => el.name).slice(0, 8);
      return `ans=${filled}/${answers.length} \xb7 \u7a7a[${empty.join(",") || "\u65e0"}]`;
    } catch {
      return "form=\u8bfb\u4e0d\u5230";
    }
  }

  function describeViews(views) {
    return views.map((view, index) => {
      if (!view) return `\u5e27${index}:\u8bfb\u4e0d\u5230`;
      const found = [ ...CONFIRM_FUNCTION_NAMES, ...ENTRY_HANDLER_NAMES ].filter(name => readFunction(view, name));
      return `\u5e27${index}:${found.length ? found.join("+") : "\u65e0"}`;
    }).join(" \xb7 ");
  }

  function confirmCandidateViews(documents, ...elements) {
    const views = pageWindowsInFrameTree().map(window2 => window2);
    for (const document2 of [ ...documents, ...elements.map(el => el.ownerDocument) ]) {
      try {
        views.push(pageWindowForDocument(document2));
      } catch {}
    }
    return views;
  }

  async function pollFor(probe2, timeoutMs, stepMs) {
    for (let waited = 0; waited <= timeoutMs; waited += stepMs) {
      const hit = probe2();
      if (hit) return hit;
      if (waited + stepMs > timeoutMs) break;
      await sleep(stepMs);
    }
    return null;
  }

  function findWorkFrame(documents, ...elements) {
    for (const win of confirmCandidateViews(documents, ...elements)) {
      if (!win) continue;
      if (readFunction(win, "btnBlueSubmit")) return {
        win: win
      };
    }
    return null;
  }

  const CONFIRM_OK_ID = "popok";

  function visible(element) {
    var _a;
    const view = (_a = element.ownerDocument) == null ? void 0 : _a.defaultView;
    if (!view) return false;
    try {
      let node = element;
      while (node) {
        const style = view.getComputedStyle(node);
        if (style.display === "none" || style.visibility === "hidden") return false;
        node = node.parentElement;
      }
      return true;
    } catch {
      return false;
    }
  }

  function findConfirmButton(documents) {
    for (const document2 of documents) {
      let element = null;
      try {
        element = document2.getElementById(CONFIRM_OK_ID);
      } catch {
        continue;
      }
      if (element && visible(element)) return element;
    }
    return null;
  }

  async function autoSubmitRound(getDocuments, state) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    if (!state.enabled) return "off";
    if (state.items.length === 0) return "no-items";
    if (!shouldAutoSubmit(state)) return hasUnrecognizedQuestions(state) ? "unrecognized-questions" : "below-threshold";
    if (getDocuments().some(isExamPage)) return "exam-page";
    const target = safeSubmitTarget(getDocuments());
    if (!target) return "no-entry";
    const frame = findWorkFrame(getDocuments(), target);
    if (!frame) return "no-page-window";
    if (pageSubmitQuotaExhausted(frame.win)) return "site-quota";
    if (pageSubmitLocked(frame.win)) return "site-locked";
    (_a = state.onEntry) == null ? void 0 : _a.call(state, "click", entryHandlerSource(frame.win));
    const siteMessage = captureSiteMessage(frame.win);
    try {
      try {
        target.click();
      } catch (error) {
        (_b = state.onConfirmProbe) == null ? void 0 : _b.call(state, `\u70b9\u51fb\u63d0\u4ea4\u5165\u53e3\u629b ${String((error == null ? void 0 : error.message) ?? error).slice(0, 160)}`);
        return "click-failed";
      }
      const confirmButton = await pollFor(() => findConfirmButton(getDocuments()), state.confirmTimeoutMs ?? DEFAULT_CONFIRM_TIMEOUT_MS, state.pollMs ?? POLL_MS);
      if (!confirmButton) {
        (_c = state.onConfirmProbe) == null ? void 0 : _c.call(state, `\u70b9\u4e86\u5165\u53e3\u4f46\u6ca1\u7b49\u5230\u786e\u8ba4\u6846 #${CONFIRM_OK_ID} \xb7 ${describeViews([ frame.win ])}`);
        return "clicked-entry";
      }
      (_d = state.onConfirmProbe) == null ? void 0 : _d.call(state, `\u786e\u8ba4\u6846\u5df2\u51fa\u73b0 \xb7 ${answeredFieldSummary(frame.win)} \xb7 lock=${readScalar(frame.win, "submitLock")}`);
      await sleep(CONFIRM_SETTLE_MS);
      let clicked = false;
      for (let attempt = 0; attempt < CONFIRM_CLICK_ATTEMPTS; attempt += 1) {
        const button = findConfirmButton(getDocuments());
        if (!button) break;
        try {
          button.click();
        } catch (error) {
          (_e = state.onConfirmProbe) == null ? void 0 : _e.call(state, `\u70b9\u786e\u8ba4\u6846\u629b ${String((error == null ? void 0 : error.message) ?? error).slice(0, 160)}`);
          return "confirm-unverified";
        }
        if (!clicked) (_f = state.onConfirmCall) == null ? void 0 : _f.call(state, `#${CONFIRM_OK_ID}`);
        clicked = true;
        await sleep(CONFIRM_SETTLE_MS);
      }
      if (!clicked) (_g = state.onConfirmProbe) == null ? void 0 : _g.call(state, "\u786e\u8ba4\u6846\u5728\u70b9\u5230\u4e4b\u524d\u5c31\u6d88\u5931\u4e86 \xb7 \u6ca1\u70b9\u6210\uff0c\u4e0d\u5f53\u4f5c\u5df2\u786e\u8ba4");
      const confirmStuck = findConfirmButton(getDocuments()) !== null;
      if (confirmStuck) (_h = state.onConfirmProbe) == null ? void 0 : _h.call(state, `\u70b9\u5b8c #${CONFIRM_OK_ID} \u540e\u6846\u4ecd\u5728 \xb7 \u5904\u7406\u5668\u6ca1\u63a5\u4f4f\u8fd9\u4e00\u4e0b`);
      const settled = () => clicked && !confirmStuck && !siteMessage.message() ? "confirm-accepted" : "confirm-unverified";
      if (!state.isSubmitted) return settled();
      const done = await pollFor(() => {
        var _a2;
        return ((_a2 = state.isSubmitted) == null ? void 0 : _a2.call(state)) ? "submitted" : siteMessage.message() ? "refused" : null;
      }, state.verifyTimeoutMs ?? DEFAULT_VERIFY_TIMEOUT_MS, state.pollMs ?? POLL_MS);
      const refusal = siteMessage.message();
      if (refusal) (_i = state.onConfirmProbe) == null ? void 0 : _i.call(state, `\u7ad9\u70b9\u62d2\u7edd\u63d0\u4ea4 \xb7 ${refusal}`);
      return done === "submitted" ? "submitted" : settled();
    } finally {
      siteMessage.restore();
    }
  }

  const MEMORY_GUARD_THRESHOLD_BYTES = 600 * 1024 * 1024;

  const MEMORY_GUARD_CONSECUTIVE = 2;

  function createMemoryGuard(options) {
    const threshold = options.thresholdBytes ?? MEMORY_GUARD_THRESHOLD_BYTES;
    const needed = options.consecutive ?? MEMORY_GUARD_CONSECUTIVE;
    let streak = 0;
    let fired = false;
    return {
      check() {
        if (fired) return null;
        const used = options.sample();
        if (used === null || used < threshold) {
          streak = 0;
          return null;
        }
        streak += 1;
        if (streak < needed) return null;
        fired = true;
        return used;
      }
    };
  }

  const readUsedJsHeap = view => () => {
    var _a;
    const used = (_a = view.performance.memory) == null ? void 0 : _a.usedJSHeapSize;
    return typeof used === "number" ? used : null;
  };

  const HTML_TAG_NAMES = new Set("a abbr address article aside audio b blockquote body br button canvas caption cite code col colgroup data datalist dd del details dialog div dl dt em fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd label legend li link main map mark menu meta meter nav noscript object ol optgroup option output p picture pre progress q rp rt ruby s samp script section select slot small source span strong style sub summary sup table tbody td template textarea tfoot th thead time title tr track u ul var video wbr".split(" "));

  const redactOrdinaryTags = value => value.replace(/<(\/?)([A-Za-z][A-Za-z0-9:-]*)([^<>]*)>/g, (match, closing, tagName, rawAttributeText) => {
    if (!HTML_TAG_NAMES.has(tagName.toLowerCase())) return match;
    const attributeText = rawAttributeText.trim().replace(/\/$/, "").trim();
    if (!attributeText) return "[\u6807\u7b7e]";
    if (!closing && attributeText.includes("=")) return "[\u6807\u7b7e]";
    return match;
  });

  const redactPreviewText = value => redactOrdinaryTags(value.replace(/<!--[\s\S]*?-->/g, "[\u6807\u7b7e]").replace(/<!DOCTYPE(?:\s+[^<>]*)?\s*>/gi, "[\u6807\u7b7e]")).replace(/https?:\/\/[^\s<>"']+/gi, "[\u94fe\u63a5]");

  const previewOf = value => protocol.parseQuestionContent(value, {
    stripUntrustedTags: false
  }).map(part => part.type === "image" ? "[\u56fe\u7247]" : redactPreviewText(part.value)).join("").slice(0, 30);

  const imageCountOf = value => protocol.parseQuestionContent(value).filter(part => part.type === "image").length;

  function itemOf(input) {
    return {
      type: input.type,
      decodeFailed: input.decodeFailed ?? false,
      stemPreview: previewOf(input.stem),
      optionCount: input.options.length,
      imageCount: imageCountOf(input.stem) + input.options.reduce((count, option) => count + imageCountOf(option), 0),
      unsupportedReason: input.unsupportedReason
    };
  }

  async function ruleDiagnosticsFlowOf(adapter, ctx) {
    if (!("runDiagnostics" in adapter) || typeof adapter.runDiagnostics !== "function") return null;
    try {
      return await adapter.runDiagnostics(ctx);
    } catch {
      return {
        status: "failed",
        error: "diagnostics_threw"
      };
    }
  }

  async function runDiagnostic(adapter, ctx) {
    var _a;
    if (!adapter.match(ctx)) return {
      matched: false,
      count: 0,
      imageCount: 0,
      harvestedCount: 0,
      items: [],
      ruleFlow: null
    };
    const items = (await adapter.captureTrees(ctx)).flatMap(tree => protocol.flattenQuestionTree(tree.root).map(unit => itemOf({
      type: core.isTextAnswerType(unit.queryType) ? protocol.QuestionType.Fill : unit.queryType,
      stem: unit.effectiveStem,
      options: unit.options.map(option => option.content)
    })));
    return {
      matched: true,
      count: items.length,
      imageCount: items.reduce((count, item) => count + item.imageCount, 0),
      harvestedCount: ((_a = adapter.takeHarvested) == null ? void 0 : _a.call(adapter).length) ?? 0,
      items: items,
      ruleFlow: await ruleDiagnosticsFlowOf(adapter, ctx)
    };
  }

  function createCourseStopReporter(emit) {
    let reported = false;
    return {
      observe(state) {
        const reason = courseStopReason(state);
        if (!reason) return false;
        if (!reported) {
          reported = true;
          try {
            emit({
              type: "course_stop",
              reason: reason
            });
          } catch {}
        }
        return true;
      },
      reset() {
        reported = false;
      }
    };
  }

  const EVENT_QUEUE_LIMITS = {
    maxBatch: 20,
    flushIntervalMs: 3e4,
    maxBodyBytes: 15 * 1024,
    maxQueue: 200,
    timeoutMs: 5e3
  };

  const EVENT_QUEUE_STORAGE_KEY = "aiask_event_queue";

  const encoder = new TextEncoder;

  class EventQueue {
    constructor(deps) {
      __privateAdd(this, _EventQueue_instances);
      __privateAdd(this, _deps);
      __privateAdd(this, _pending, []);
      __privateAdd(this, _dropped, 0);
      __privateAdd(this, _timer, null);
      __privateAdd(this, _sending, false);
      __privateAdd(this, _enabled, true);
      __privateSet(this, _deps, deps);
    }
    push(event) {
      try {
        if (!__privateGet(this, _enabled)) return;
        if (!event || typeof event !== "object") return;
        __privateGet(this, _pending).push(event);
        __privateMethod(this, _EventQueue_instances, trim_fn).call(this);
        if (__privateGet(this, _pending).length >= EVENT_QUEUE_LIMITS.maxBatch) {
          void __privateMethod(this, _EventQueue_instances, flush_fn).call(this, false);
          return;
        }
        __privateMethod(this, _EventQueue_instances, arm_fn).call(this);
      } catch {}
    }
    stats() {
      return {
        pending: __privateGet(this, _pending).length,
        dropped: __privateGet(this, _dropped)
      };
    }
    persist() {
      try {
        if (!__privateGet(this, _enabled)) return;
        __privateMethod(this, _EventQueue_instances, trim_fn).call(this);
        __privateGet(this, _deps).storage.set(EVENT_QUEUE_STORAGE_KEY, {
          events: __privateGet(this, _pending)
        });
      } catch {}
    }
    restore() {
      try {
        const raw = __privateGet(this, _deps).storage.get(EVENT_QUEUE_STORAGE_KEY);
        const saved = Array.isArray(raw == null ? void 0 : raw.events) ? raw.events : [];
        if (saved.length === 0) return;
        __privateSet(this, _pending, saved.concat(__privateGet(this, _pending)));
        __privateMethod(this, _EventQueue_instances, trim_fn).call(this);
        __privateMethod(this, _EventQueue_instances, arm_fn).call(this);
      } catch {}
    }
    disable() {
      __privateSet(this, _enabled, false);
      __privateSet(this, _pending, []);
      __privateMethod(this, _EventQueue_instances, cancel_fn).call(this);
      try {
        __privateGet(this, _deps).storage.set(EVENT_QUEUE_STORAGE_KEY, null);
      } catch {}
    }
    enable() {
      __privateSet(this, _enabled, true);
    }
    async flush() {
      await __privateMethod(this, _EventQueue_instances, flush_fn).call(this, true);
    }
  }

  _deps = new WeakMap;

  _pending = new WeakMap;

  _dropped = new WeakMap;

  _timer = new WeakMap;

  _sending = new WeakMap;

  _enabled = new WeakMap;

  _EventQueue_instances = new WeakSet;

  arm_fn = function() {
    if (__privateGet(this, _timer) !== null) return;
    __privateSet(this, _timer, setTimeout(() => {
      __privateSet(this, _timer, null);
      void __privateMethod(this, _EventQueue_instances, flush_fn).call(this, true);
    }, EVENT_QUEUE_LIMITS.flushIntervalMs));
  };

  cancel_fn = function() {
    if (__privateGet(this, _timer) === null) return;
    clearTimeout(__privateGet(this, _timer));
    __privateSet(this, _timer, null);
  };

  trim_fn = function() {
    while (__privateGet(this, _pending).length > EVENT_QUEUE_LIMITS.maxQueue) {
      __privateGet(this, _pending).shift();
      __privateSet(this, _dropped, __privateGet(this, _dropped) + 1);
    }
  };

  envelope_fn = function(events) {
    return {
      schemaVersion: 1,
      ...__privateGet(this, _deps).identity(),
      events: events
    };
  };

  take_fn = function() {
    const batch = [];
    while (__privateGet(this, _pending).length > 0 && batch.length < EVENT_QUEUE_LIMITS.maxBatch) {
      const next = __privateGet(this, _pending)[0];
      const bytes = encoder.encode(JSON.stringify(__privateMethod(this, _EventQueue_instances, envelope_fn).call(this, [ ...batch, next ]))).length;
      if (bytes > EVENT_QUEUE_LIMITS.maxBodyBytes) {
        if (batch.length === 0) {
          __privateGet(this, _pending).shift();
          __privateSet(this, _dropped, __privateGet(this, _dropped) + 1);
          continue;
        }
        break;
      }
      __privateGet(this, _pending).shift();
      batch.push(next);
    }
    return batch;
  };

  flush_fn = async function(force) {
    if (!__privateGet(this, _enabled) || __privateGet(this, _sending)) return;
    __privateSet(this, _sending, true);
    try {
      let drain = force;
      while (__privateGet(this, _pending).length > 0 && (drain || __privateGet(this, _pending).length >= EVENT_QUEUE_LIMITS.maxBatch)) {
        const batch = __privateMethod(this, _EventQueue_instances, take_fn).call(this);
        if (batch.length === 0) break;
        const ok = await __privateMethod(this, _EventQueue_instances, send_fn).call(this, batch);
        if (!ok) {
          __privateSet(this, _pending, batch.concat(__privateGet(this, _pending)));
          __privateMethod(this, _EventQueue_instances, trim_fn).call(this);
          break;
        }
        drain = force;
      }
    } catch {} finally {
      __privateSet(this, _sending, false);
      if (__privateGet(this, _pending).length > 0) __privateMethod(this, _EventQueue_instances, arm_fn).call(this); else __privateMethod(this, _EventQueue_instances, cancel_fn).call(this);
    }
  };

  send_fn = async function(events) {
    try {
      const res = await __privateGet(this, _deps).transport.send({
        method: "POST",
        url: __privateGet(this, _deps).baseUrl + protocol.EVENTS_PATH,
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": protocol.randomUuid()
        },
        body: JSON.stringify(__privateMethod(this, _EventQueue_instances, envelope_fn).call(this, events)),
        timeoutMs: EVENT_QUEUE_LIMITS.timeoutMs
      });
      return res.status >= 200 && res.status < 300;
    } catch {
      return false;
    }
  };

  function toSubmitEventOutcome(outcome) {
    switch (outcome) {
     case "submitted":
      return "submitted";

     case "confirm-accepted":
      return "confirm_accepted";

     case "clicked-entry":
     case "confirm-unverified":
      return "confirm_unverified";

     case "below-threshold":
      return "below_threshold";

     case "unrecognized-questions":
      return "unrecognized_questions";

     case "exam-page":
     case "no-entry":
     case "click-failed":
     case "site-quota":
     case "site-locked":
     case "no-page-window":
      return "blocked";

     case "off":
     case "no-items":
      return null;

     default:
      {
        const exhaustive = outcome;
        return exhaustive;
      }
    }
  }

  const SENSITIVE_ATTR_PATTERN = /token|session|cookie|passwd|password|secret|sign|auth|uid|userid|studentid|ticket|jwt|enc$|^key$|^fid$/i;

  const PERSONAL_TEXT_HOST_PATTERN = /realname|truename|stuname|studentname|nickname|username|loginname/i;

  const MASK = "[\u5df2\u906e\u76d6]";

  const NUMBER_MASK = "[\u6570\u5b57]";

  const EVIDENCE_MASK = "***";

  const EVIDENCE_TEXT_PATTERNS = [ [ /[A-Za-z0-9_-]{24,}/gu, EVIDENCE_MASK ], [ /\d{8,}/gu, EVIDENCE_MASK ], [ /((?:token|cookie|session|password|pwd|sid)=)[^"'&<\s>]+/giu, `$1${EVIDENCE_MASK}` ] ];

  const MAX_TEMPLATE_DEPTH = 5;

  function redactEvidenceText(raw) {
    let text = raw;
    let hits = 0;
    for (const [pattern, replacement] of EVIDENCE_TEXT_PATTERNS) {
      const found = text.match(pattern);
      if (!found) continue;
      hits += found.length;
      text = text.replace(pattern, replacement);
    }
    return {
      text: text,
      hits: hits
    };
  }

  const stripUrlQuery = raw => {
    const cut = raw.search(/[?#]/u);
    return cut === -1 ? raw : raw.slice(0, cut);
  };

  function redactSnapshotHtml(html, mode = "fixture") {
    let redactions = 0;
    const doc = (new DOMParser).parseFromString(html, "text/html");
    const stripped = new Map;
    const redactRoot = (root, depth) => {
      var _a;
      const owner = root.ownerDocument ?? doc;
      const commentWalker = owner.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
      const comments = [];
      while (commentWalker.nextNode()) comments.push(commentWalker.currentNode);
      for (const comment of comments) {
        comment.remove();
        redactions += 1;
      }
      for (const own of Array.from(root.querySelectorAll("#aiask-host"))) {
        own.remove();
        redactions += 1;
      }
      const templates = [];
      for (const el of Array.from(root.querySelectorAll("*"))) {
        const tag = el.tagName.toLowerCase();
        const isInlineAsset = tag === "script" || tag === "style" || tag === "noscript";
        if (mode === "evidence" && (isInlineAsset || tag === "link")) {
          stripped.set(tag, (stripped.get(tag) ?? 0) + 1);
          el.remove();
          redactions += 1;
          continue;
        }
        if (isInlineAsset) {
          if (el.textContent) {
            el.textContent = "";
            redactions += 1;
          }
          continue;
        }
        if (tag === "template") templates.push(el);
        const namedSecret = [ "name", "id" ].some(key => {
          const v = el.getAttribute(key);
          return !!v && SENSITIVE_ATTR_PATTERN.test(v);
        });
        const inputType = tag === "input" ? (el.getAttribute("type") ?? "").toLowerCase() : "";
        const typedSecret = inputType === "password" || mode === "evidence" && inputType === "hidden";
        if ([ "id", "name", "class" ].some(key => {
          const v = el.getAttribute(key);
          return !!v && PERSONAL_TEXT_HOST_PATTERN.test(v);
        })) {
          for (const node of Array.from(el.childNodes)) {
            if (node.nodeType === 3 && ((_a = node.nodeValue) == null ? void 0 : _a.trim())) {
              node.nodeValue = MASK;
              redactions += 1;
            }
          }
        }
        for (const attr of Array.from(el.attributes)) {
          if ((namedSecret || typedSecret) && attr.name.toLowerCase() === "value") {
            if (attr.value) {
              el.setAttribute(attr.name, MASK);
              redactions += 1;
            }
            continue;
          }
          if (SENSITIVE_ATTR_PATTERN.test(attr.name)) {
            if (attr.value) {
              el.setAttribute(attr.name, MASK);
              redactions += 1;
            }
            continue;
          }
          if (/^(?:https?:)?\/\//iu.test(attr.value) || attr.value.includes("?")) {
            const stripped2 = stripUrlQuery(attr.value);
            if (stripped2 !== attr.value) {
              el.setAttribute(attr.name, stripped2);
              redactions += 1;
            }
          }
        }
      }
      const textWalker = owner.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const texts = [];
      while (textWalker.nextNode()) texts.push(textWalker.currentNode);
      for (const node of texts) {
        let next = node.data ?? "";
        if (mode === "evidence") {
          const masked = redactEvidenceText(next);
          redactions += masked.hits;
          next = masked.text;
        }
        next = next.replace(/\d{6,}/gu, () => {
          redactions += 1;
          return NUMBER_MASK;
        });
        if (next !== node.data) node.data = next;
      }
      for (const tpl of templates) {
        const frag = tpl.content;
        if (!(frag == null ? void 0 : frag.firstChild)) continue;
        if (mode === "evidence" || depth + 1 > MAX_TEMPLATE_DEPTH) {
          while (frag.firstChild) frag.firstChild.remove();
          tpl.setAttribute("data-aiask-omitted", "template");
          redactions += 1;
          continue;
        }
        redactRoot(frag, depth + 1);
      }
    };
    redactRoot(doc, 0);
    const strippedNote = [ "script", "style", "noscript", "link" ].map(tag => [ tag, stripped.get(tag) ?? 0 ]).filter(([, n]) => n > 0).map(([tag, n]) => `${tag}:${n}`).join(",");
    if (strippedNote) doc.documentElement.setAttribute("data-aiask-stripped", strippedNote);
    return {
      html: doc.documentElement.outerHTML,
      redactions: redactions
    };
  }

  const serialize = doc => {
    var _a;
    return ((_a = doc.documentElement) == null ? void 0 : _a.outerHTML) ?? "";
  };

  function capturePageSnapshot(win, options) {
    const frames = [];
    let unreachableFrames = 0;
    let redactions = 0;
    const push = (doc, href, framePath) => {
      const redacted = redactSnapshotHtml(serialize(doc));
      redactions += redacted.redactions;
      frames.push({
        url: stripUrlQuery(href),
        html: redacted.html,
        framePath: framePath
      });
    };
    const MAX_FRAME_DEPTH2 = 5;
    const walk = (doc, framePath) => {
      var _a;
      if (framePath.length >= MAX_FRAME_DEPTH2) return;
      const iframes = Array.from(doc.querySelectorAll("iframe"));
      for (let i = 0; i < iframes.length; i += 1) {
        const childPath = [ ...framePath, i ];
        try {
          const childDoc = iframes[i].contentDocument;
          if (!childDoc) {
            unreachableFrames += 1;
            continue;
          }
          push(childDoc, ((_a = childDoc.location) == null ? void 0 : _a.href) ?? "", childPath);
          walk(childDoc, childPath);
        } catch {
          unreachableFrames += 1;
        }
      }
    };
    const topDoc = win.document;
    push(topDoc, options.href ?? win.location.href, []);
    walk(topDoc, []);
    return {
      capturedAt: (new Date).toISOString(),
      scriptVersion: options.scriptVersion,
      url: stripUrlQuery(options.href ?? win.location.href),
      frames: frames,
      unreachableFrames: unreachableFrames,
      redactions: redactions
    };
  }

  const NODE_BUDGET = 4e3;

  const TIME_BUDGET_MS = 250;

  const MAX_FRAME_DEPTH = 3;

  const MAX_FRAMES = 16;

  const MAX_UNREACHABLE_MARKERS = 8;

  const MAX_FRAME_URL = 200;

  const MAX_PARSE_HTML = 256e3;

  const MAX_HTML = 64e3;

  const webCrypto = globalThis.crypto;

  const randomValues = typeof (webCrypto == null ? void 0 : webCrypto.getRandomValues) === "function" ? webCrypto.getRandomValues.bind(webCrypto) : void 0;

  const makeNonce = () => {
    const buf = new Uint8Array(4);
    if (randomValues) randomValues(buf); else for (let i = 0; i < buf.length; i += 1) buf[i] = Math.random() * 256 | 0;
    return Array.from(buf, b => b.toString(16).padStart(2, "0")).join("");
  };

  const commentSafe = raw => raw.replace(/[<>\r\n\u2028\u2029]/gu, "");

  const clip = (raw, max) => {
    if (raw.length <= max) return raw;
    const cut = raw.slice(0, max);
    const last = cut.charCodeAt(cut.length - 1);
    return last >= 55296 && last <= 56319 ? cut.slice(0, -1) : cut;
  };

  function collectEvidenceHtml(win, options = {}) {
    var _a;
    const now = options.now ?? Date.now;
    const startedAt = now();
    const outOfTime = () => now() - startedAt >= TIME_BUDGET_MS;
    const nonce = makeNonce();
    const slots = [];
    const frames = [];
    let truncated = false;
    let remainingNodes = NODE_BUDGET;
    let unreachableMarkers = 0;
    let framesCapped = false;
    let unreachableCapped = false;
    const pushText = text => slots.push({
      kind: "text",
      text: text
    });
    const omitLine = reason => `\x3c!-- aiask-omitted#${nonce}: ${reason} --\x3e`;
    const pushOmitted = reason => {
      truncated = true;
      pushText(omitLine(reason));
    };
    const capOnce = reason => {
      if (reason === "frames" && !framesCapped) {
        framesCapped = true;
        pushOmitted("frames");
      }
      if (reason === "unreachable" && !unreachableCapped) {
        unreachableCapped = true;
        pushText(omitLine("unreachable"));
      }
    };
    const markerUrl = raw => clip(commentSafe(redactEvidenceText(stripUrlQuery(raw)).text), MAX_FRAME_URL);
    const collect = (doc, url, depth) => {
      var _a2;
      pushText(`\x3c!-- aiask-frame#${nonce}: ${markerUrl(url)} --\x3e`);
      const slot = {
        kind: "frame",
        doc: doc,
        html: null,
        note: null,
        trailing: null,
        used: 0
      };
      slots.push(slot);
      frames.push(slot);
      if (depth >= MAX_FRAME_DEPTH) {
        if (doc.querySelector("iframe")) pushOmitted("depth");
        return;
      }
      for (const frame of Array.from(doc.querySelectorAll("iframe"))) {
        if (outOfTime()) {
          pushOmitted("deadline");
          return;
        }
        let childDoc = null;
        try {
          childDoc = frame.contentDocument;
        } catch {
          childDoc = null;
        }
        if (!childDoc) {
          if (unreachableMarkers >= MAX_UNREACHABLE_MARKERS) {
            capOnce("unreachable");
            continue;
          }
          unreachableMarkers += 1;
          pushText(`\x3c!-- aiask-frame-unreachable#${nonce}: ${markerUrl(frame.getAttribute("src") ?? "")} --\x3e`);
          continue;
        }
        if (frames.length >= MAX_FRAMES) {
          capOnce("frames");
          return;
        }
        collect(childDoc, ((_a2 = childDoc.location) == null ? void 0 : _a2.href) ?? "", depth + 1);
      }
    };
    collect(win.document, ((_a = win.location) == null ? void 0 : _a.href) ?? "", 0);
    const renderDoc = doc => {
      var _a2, _b, _c;
      const raw = ((_a2 = doc.documentElement) == null ? void 0 : _a2.outerHTML) ?? "";
      const oversize = raw.length > MAX_PARSE_HTML;
      const copy = (new DOMParser).parseFromString(oversize ? clip(raw, MAX_PARSE_HTML) : raw, "text/html");
      const all = copy.querySelectorAll("*");
      if (all.length > remainingNodes) {
        truncated = true;
        for (let i = remainingNodes; i < all.length; i += 1) (_b = all[i]) == null ? void 0 : _b.remove();
        remainingNodes = 0;
      } else {
        remainingNodes -= all.length;
      }
      const html2 = redactSnapshotHtml(((_c = copy.documentElement) == null ? void 0 : _c.outerHTML) ?? "", "evidence").html;
      return {
        html: html2,
        oversize: oversize
      };
    };
    for (let i = 0; i < frames.length; i += 1) {
      const slot = frames[i];
      if (!slot) continue;
      if (i > 0 && outOfTime()) {
        truncated = true;
        slot.note = omitLine("deadline");
        continue;
      }
      if (remainingNodes <= 0) {
        truncated = true;
        slot.note = omitLine("budget");
        continue;
      }
      const rendered = renderDoc(slot.doc);
      slot.html = rendered.html;
      if (rendered.oversize) {
        truncated = true;
        slot.trailing = omitLine("oversize");
      }
    }
    const lines = [];
    for (const slot of slots) {
      if (slot.kind === "text") {
        lines.push(slot.text);
        continue;
      }
      if (slot.html === null) {
        lines.push(slot.note ?? "");
        continue;
      }
      lines.push(slot);
      if (slot.trailing) lines.push(slot.trailing);
    }
    const renderable = [];
    let fixedLength = 0;
    for (const line of lines) {
      if (typeof line === "string") fixedLength += line.length; else renderable.push({
        slot: line,
        html: line.html ?? ""
      });
    }
    const overhead = fixedLength + Math.max(0, lines.length - 1);
    const contentBudget = Math.max(0, MAX_HTML - overhead);
    if (renderable.length > 0) {
      const quota = Math.floor(contentBudget / renderable.length);
      let spent = 0;
      for (const item of renderable) {
        item.slot.used = Math.min(item.html.length, quota);
        spent += item.slot.used;
      }
      let leftover = contentBudget - spent;
      while (leftover > 0) {
        const needy = renderable.filter(item => item.slot.used < item.html.length);
        if (needy.length === 0) break;
        const extra = Math.floor(leftover / needy.length);
        if (extra === 0) break;
        for (const item of needy) {
          const give = Math.min(item.html.length - item.slot.used, extra);
          item.slot.used += give;
          leftover -= give;
        }
      }
      for (const item of renderable) {
        if (item.slot.used < item.html.length) truncated = true;
      }
    }
    const html = lines.map(line => typeof line === "string" ? line : clip(line.html ?? "", line.used)).join("\n");
    if (html.length > MAX_HTML) {
      return {
        html: clip(html, MAX_HTML),
        truncated: true
      };
    }
    return {
      html: html,
      truncated: truncated
    };
  }

  const MAX_HOST = 64;

  const MAX_PATH = 128;

  const MAX_QKEYS = 16;

  const MAX_QKEY = 32;

  const MAX_BODY_BUCKET = 17;

  const DOM_COUNT_CAPS = {
    iframes: 64,
    radios: 2e3,
    checkboxes: 2e3,
    textareas: 500,
    selects: 500,
    forms: 64
  };

  const isOpaqueSegment = seg => /^[A-Za-z0-9]{24,}$/u.test(seg) && /\d/u.test(seg);

  function normalizePath(pathname) {
    const normalized = pathname.split("/").map(seg => /^\d+$/u.test(seg) ? ":num" : isOpaqueSegment(seg) ? ":id" : seg).join("/");
    return normalized.slice(0, MAX_PATH) || "/";
  }

  function collectQkeys(search) {
    const keys = new Set;
    for (const key of new URLSearchParams(search).keys()) if (key) keys.add(key.slice(0, MAX_QKEY));
    return [ ...keys ].sort().slice(0, MAX_QKEYS);
  }

  function bodyNodesBucket(count) {
    if (!(count > 1)) return 0;
    return Math.min(MAX_BODY_BUCKET, Math.floor(Math.log2(count)));
  }

  const countOf = (doc, selector, cap) => Math.min(cap, doc.querySelectorAll(selector).length);

  const READY_STATES = new Set([ "loading", "interactive", "complete" ]);

  const normalizeReadyState = raw => READY_STATES.has(raw) ? raw : "complete";

  function buildPageFingerprint(location2, document2) {
    var _a;
    try {
      const host = normalizedHost(location2.hostname);
      if (!host || !SUPPORTED_HOST_PATTERN.test(host)) return null;
      const dom = {
        iframes: countOf(document2, "iframe", DOM_COUNT_CAPS.iframes),
        radios: countOf(document2, "input[type=radio]", DOM_COUNT_CAPS.radios),
        checkboxes: countOf(document2, "input[type=checkbox]", DOM_COUNT_CAPS.checkboxes),
        textareas: countOf(document2, "textarea", DOM_COUNT_CAPS.textareas),
        selects: countOf(document2, "select", DOM_COUNT_CAPS.selects),
        forms: countOf(document2, "form", DOM_COUNT_CAPS.forms),
        bodyNodes: bodyNodesBucket(((_a = document2.body) == null ? void 0 : _a.getElementsByTagName("*").length) ?? 0),
        readyState: normalizeReadyState(document2.readyState)
      };
      return {
        host: host.slice(-MAX_HOST),
        path: normalizePath(location2.pathname),
        qkeys: collectQkeys(location2.search),
        dom: dom
      };
    } catch {
      return null;
    }
  }

  const MESSAGE_UNAUTHORIZED = protocol.AiAskCode.Unauthorized;

  const ITEM_TYPES = new Set(protocol.HarvestRowSchema.shape.itemType.options);

  const HASH_PATTERN = /^[0-9a-f]{64}$/u;

  let lastContribute = null;

  const MAX_CONSECUTIVE_FAILURES = 3;

  let stoppedThisPage = false;

  let consecutiveFailures = 0;

  const isTerminal = code => code === protocol.AiAskCode.Invalid || code === MESSAGE_UNAUTHORIZED;

  const sentThisPage = new Set;

  function contributableRows(items) {
    const rows = [];
    for (const item of items) {
      const values = item.values.filter(value => value.trim() !== "");
      const stem = item.stem ?? "";
      const itemType = item.itemType;
      if (!HASH_PATTERN.test(item.unitHash) || !ITEM_TYPES.has(itemType) || stem.trim() === "" || values.length === 0 || sentThisPage.has(item.unitHash)) continue;
      const row = {
        unitHash: item.unitHash,
        stem: stem,
        itemType: itemType,
        options: item.options ?? [],
        values: values
      };
      if (!protocol.HarvestRowSchema.safeParse(row).success) continue;
      rows.push(row);
    }
    return rows;
  }

  function chunkRows(platform, rows) {
    const bytes = chunk => (new TextEncoder).encode(JSON.stringify({
      platform: platform,
      rows: chunk
    })).length;
    const chunks = [];
    let current = [];
    for (const row of rows) {
      const next = [ ...current, row ];
      if (current.length > 0 && (next.length > protocol.HARVEST_CONTRIBUTE_MAX_ROWS || bytes(next) > protocol.HARVEST_CONTRIBUTE_MAX_BYTES)) {
        chunks.push(current);
        current = [ row ];
        continue;
      }
      current = next;
    }
    if (current.length > 0) chunks.push(current);
    return chunks;
  }

  const harvestContributeStatus = () => lastContribute;

  async function sendChunk(transport, baseUrl, platform, rows) {
    const res = await transport.send({
      url: baseUrl + protocol.HARVEST_CONTRIBUTE_PATH,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": protocol.randomUuid()
      },
      body: JSON.stringify({
        platform: platform,
        rows: rows
      }),
      timeoutMs: 15e3
    });
    const parsed = protocol.HarvestContributeResponseSchema.safeParse(JSON.parse(res.body));
    if (!parsed.success) return {
      queued: 0,
      code: protocol.AiAskCode.Busy
    };
    return {
      queued: parsed.data.queued ?? 0,
      code: parsed.data.code
    };
  }

  async function contributeHarvest(transport, baseUrl, platform, items) {
    if (stoppedThisPage) return {
      queued: 0,
      stopped: true
    };
    const rows = contributableRows(items);
    if (rows.length === 0) return {
      queued: 0
    };
    let queued = 0;
    for (const chunk of chunkRows(platform, rows)) {
      let outcome;
      try {
        outcome = await sendChunk(transport, baseUrl, platform, chunk);
      } catch {
        outcome = {
          queued: 0,
          code: protocol.AiAskCode.Busy
        };
      }
      if (outcome.code !== protocol.AiAskCode.Ok) {
        consecutiveFailures += 1;
        if (isTerminal(outcome.code) || consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) stoppedThisPage = true;
        lastContribute = {
          at: Date.now(),
          rows: rows.length,
          queued: queued,
          code: outcome.code,
          stopped: stoppedThisPage,
          failures: consecutiveFailures
        };
        return {
          queued: queued,
          ...outcome.code === MESSAGE_UNAUTHORIZED ? {
            unauthorized: true
          } : {},
          ...stoppedThisPage ? {
            stopped: true
          } : {}
        };
      }
      consecutiveFailures = 0;
      for (const row of chunk) sentThisPage.add(row.unitHash);
      queued += outcome.queued;
    }
    lastContribute = {
      at: Date.now(),
      rows: rows.length,
      queued: queued,
      code: protocol.AiAskCode.Ok,
      stopped: false,
      failures: 0
    };
    return {
      queued: queued
    };
  }

  function formatTime(d = new Date) {
    const p = n => String(n).padStart(2, "0");
    return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }

  function createLogBuffer(max = 200) {
    const entries = [];
    return {
      add(content, type = "info") {
        const last = entries.at(-1);
        if (last && last.content === content && last.type === type) {
          last.repeat += 1;
          last.time = formatTime();
          return last;
        }
        const entry = {
          time: formatTime(),
          type: type,
          content: content,
          repeat: 1
        };
        entries.push(entry);
        if (entries.length > max) entries.splice(0, entries.length - max);
        return entry;
      },
      clear() {
        entries.length = 0;
      },
      list() {
        return entries;
      }
    };
  }

  function filterLogs(entries, level) {
    if (level === "all") return [ ...entries ];
    return entries.filter(e => e.type === level);
  }

  async function fetchMe(transport, baseUrl) {
    try {
      const response = await transport.send({
        url: baseUrl + protocol.ME_PATH,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": protocol.randomUuid()
        },
        body: JSON.stringify({}),
        timeoutMs: 8e3
      });
      const parsed = protocol.MeResponseSchema.safeParse(JSON.parse(response.body));
      if (!parsed.success || parsed.data.code !== protocol.AiAskCode.Ok) return null;
      const {username: username, balance: balance, emailBound: emailBound} = parsed.data;
      if (typeof username !== "string" || typeof balance !== "number" || typeof emailBound !== "boolean") return null;
      return {
        username: username,
        balance: balance,
        emailBound: emailBound
      };
    } catch {
      return null;
    }
  }

  const MESSAGE = {
    [protocol.AiAskCode.Invalid]: "\u5361\u5bc6\u65e0\u6548\u3001\u5df2\u7528\u6216\u5df2\u8fc7\u671f",
    [protocol.AiAskCode.Unauthorized]: "\u767b\u5f55\u5df2\u5931\u6548\uff0c\u8bf7\u91cd\u65b0\u767b\u5f55",
    [protocol.AiAskCode.RateLimited]: "\u64cd\u4f5c\u592a\u9891\u7e41\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5",
    [protocol.AiAskCode.Busy]: "\u670d\u52a1\u7e41\u5fd9\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5"
  };

  async function redeemCard(transport, code, baseUrl) {
    try {
      const res = await transport.send({
        url: baseUrl + protocol.REDEEM_PATH,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": protocol.randomUuid()
        },
        body: JSON.stringify({
          code: code
        }),
        timeoutMs: 8e3
      });
      const parsed = protocol.RedeemResponseSchema.safeParse(JSON.parse(res.body));
      if (!parsed.success) return {
        message: MESSAGE[protocol.AiAskCode.Busy]
      };
      const {code: rc, balance: balance} = parsed.data;
      if (rc === protocol.AiAskCode.Ok && typeof balance === "number") return {
        balance: balance,
        message: "ok"
      };
      if (rc === protocol.AiAskCode.Unauthorized) return {
        message: MESSAGE[protocol.AiAskCode.Unauthorized],
        unauthorized: true
      };
      return {
        message: MESSAGE[rc] ?? MESSAGE[protocol.AiAskCode.Busy]
      };
    } catch {
      return {
        message: MESSAGE[protocol.AiAskCode.Busy]
      };
    }
  }

  function buildReportIdentity(platform, clientId, scriptVersion, engineVersion, diagnostic) {
    return {
      platform: platform,
      clientId: clientId,
      scriptVersion: scriptVersion,
      engineVersion: engineVersion,
      rule: {
        packageId: diagnostic.packageId,
        variantId: diagnostic.variantId ?? "unresolved",
        source: diagnostic.source,
        version: diagnostic.version,
        releaseSequence: diagnostic.releaseSequence,
        contentHash: diagnostic.contentHash,
        ...diagnostic.release ? {
          release: {
            releaseId: diagnostic.release.releaseId,
            channel: diagnostic.release.channel,
            rolloutPercent: diagnostic.release.rolloutPercent,
            cohortBucket: diagnostic.release.cohortBucket
          }
        } : {}
      }
    };
  }

  function buildMissingRuleReportIdentity(platform, clientId, scriptVersion, engineVersion, packageId) {
    return {
      platform: platform,
      clientId: clientId,
      scriptVersion: scriptVersion,
      engineVersion: engineVersion,
      rule: {
        packageId: packageId,
        variantId: "missing",
        source: "missing",
        version: "missing",
        releaseSequence: 0,
        contentHash: "missing"
      }
    };
  }

  const failedStage = (stage, reason) => ({
    stage: stage,
    ok: false,
    reason: reason
  });

  const unsafeReason = value => {
    switch (value) {
     case "missing-binding":
      return "missing_binding";

     case "disconnected":
      return "disconnected";

     case "stale":
      return "stale_dom";

     case "ambiguous-binding":
      return "ambiguous_binding";

     case "shape-mismatch":
      return "shape_mismatch";

     case "atomic-tree-blocked":
      return "partial_not_allowed";

     case "adapter-rejected":
      return "adapter_rejected";

     default:
      return "unsafe_answer";
    }
  };

  const CAPTURE_FAILURE_REASONS = {
    timeout: "timeout",
    budget_exceeded: "budget_exceeded",
    call_depth_exceeded: "budget_exceeded",
    unknown_primitive: "unknown_primitive"
  };

  function captureFailureReason(code) {
    if (!code) return void 0;
    return CAPTURE_FAILURE_REASONS[code] ?? "rule_failed";
  }

  function deriveStages(matched, list, autoFill, captureFailure) {
    const stages = [ matched ? {
      stage: "match",
      ok: true
    } : failedStage("match", "no_match") ];
    if (!matched) return stages;
    stages.push(list.length > 0 ? {
      stage: "capture",
      ok: true
    } : failedStage("capture", captureFailure ?? "zero_question"));
    if (list.length === 0) return stages;
    const decodeFailed = list.some(it => it.status === "decodeFail");
    stages.push(decodeFailed ? failedStage("decode", "decode_failed") : {
      stage: "decode",
      ok: true
    });
    const queryable = list.filter(it => it.status !== "decodeFail" && it.status !== "unsupported");
    if (queryable.length > 0) stages.push(queryable.some(it => it.status === "pending") ? failedStage("query", "query_failed") : {
      stage: "query",
      ok: true
    });
    const unsafe = list.find(it => it.status === "unsafe" || it.unsafeReason !== void 0);
    const safetyRelevant = list.some(it => it.status === "hit" || it.status === "unsafe");
    if (unsafe) stages.push(failedStage("safety", unsafeReason(unsafe.unsafeReason))); else if (list.some(it => it.status === "unsupported")) stages.push(failedStage("safety", "unsupported_question")); else if (safetyRelevant) stages.push({
      stage: "safety",
      ok: true
    });
    const hits = list.filter(it => it.status === "hit");
    if (autoFill && hits.length > 0) stages.push(hits.every(it => it.filled) ? {
      stage: "fill",
      ok: true
    } : failedStage("fill", hits.some(it => it.unsafeReason === "adapter-rejected") ? "adapter_rejected" : "fill_failed"));
    return stages;
  }

  function buildHealthReport(identity, matched, list, autoFill, captureFailure, fingerprint) {
    return {
      schemaVersion: 2,
      ...identity,
      mode: "health",
      stages: deriveStages(matched, list, autoFill, captureFailure),
      ...fingerprint ? {
        fingerprint: fingerprint
      } : {}
    };
  }

  function buildDiagnosticReport(identity, result, fingerprint) {
    const stages = [ result.matched ? {
      stage: "match",
      ok: true
    } : failedStage("match", "no_match") ];
    if (result.matched) {
      stages.push(result.count > 0 ? {
        stage: "capture",
        ok: true
      } : failedStage("capture", "zero_question"));
      if (result.count > 0) stages.push(result.items.some(i => i.decodeFailed) ? failedStage("decode", "decode_failed") : {
        stage: "decode",
        ok: true
      });
    }
    return {
      schemaVersion: 2,
      ...identity,
      mode: "diagnostic",
      stages: stages,
      ...fingerprint ? {
        fingerprint: fingerprint
      } : {},
      diagnostic: {
        matched: result.matched,
        count: result.count,
        imageCount: result.imageCount,
        items: result.items.map(item => ({
          type: item.type,
          decodeFailed: item.decodeFailed,
          optionCount: item.optionCount,
          imageCount: item.imageCount,
          unsupportedReason: item.unsupportedReason
        }))
      }
    };
  }

  async function sendReport(transport, baseUrl, req) {
    try {
      const res = await transport.send({
        method: "POST",
        url: baseUrl + protocol.REPORT_PATH,
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": protocol.randomUuid()
        },
        body: JSON.stringify(req),
        timeoutMs: 5e3
      });
      const parsed = protocol.ReportResponseSchema.safeParse(JSON.parse(res.body));
      return parsed.success ? parsed.data : null;
    } catch {
      return null;
    }
  }

  const PLATFORM_LABEL = Object.freeze({
    chaoxing: "\u8d85\u661f",
    wangxiao: "168 \u7f51\u6821",
    aopeng: "\u5965\u9e4f\u6559\u80b2",
    hubu: "\u6e56\u5317\u81ea\u8003",
    wenhua: "\u6c5f\u82cf\u5f00\u653e\u5927\u5b66"
  });

  const platformLabelFor = platform => PLATFORM_LABEL[platform] ?? platform;

  const PLATFORM_CEILING = Object.freeze({
    chaoxing: Object.freeze([ "answer", "harvest", "course-automation" ]),
    wangxiao: Object.freeze([ "answer", "harvest" ]),
    aopeng: Object.freeze([ "harvest" ]),
    hubu: Object.freeze([ "answer", "harvest" ]),
    wenhua: Object.freeze([ "answer", "harvest", "course-automation" ])
  });

  const FALLBACK_FEATURES = Object.freeze([ "answer", "harvest" ]);

  function platformFeatures(platform, declared) {
    const ceiling = PLATFORM_CEILING[platform] ?? FALLBACK_FEATURES;
    return ceiling;
  }

  const MAX_RELEASE_CONTEXTS = protocol.MAX_RULE_PACKAGES * 3;

  function parseSnapshot(input) {
    if (!input || typeof input !== "object") throw new Error("rule release context snapshot must be an object");
    const snapshot = input;
    if (snapshot.schemaVersion !== 1 || !Array.isArray(snapshot.summaries) || snapshot.summaries.length > MAX_RELEASE_CONTEXTS || Object.keys(snapshot).some(key => key !== "schemaVersion" && key !== "summaries")) throw new Error("invalid rule release context snapshot");
    return snapshot.summaries.map(summary => protocol.RulePackageSummarySchema.parse(summary));
  }

  const rulePackageIdentity = value => `${value.packageId}\0${value.releaseSequence}\0${value.contentHash}`;

  function deduplicate(summaries) {
    const byIdentity = new Map;
    for (const summary of summaries) byIdentity.set(rulePackageIdentity(summary), summary);
    return [ ...byIdentity.values() ].sort((left, right) => left.packageId.localeCompare(right.packageId) || left.releaseSequence - right.releaseSequence);
  }

  class GmRuleReleaseContextPersistence {
    constructor(storage) {
      __publicField(this, "key", "aiask_rule_release_context_v1");
      this.storage = storage;
    }
    save(summaries) {
      this.storage.set(this.key, {
        schemaVersion: 1,
        summaries: deduplicate(summaries)
      });
    }
    load() {
      const input = this.storage.get(this.key);
      if (input == null) return [];
      try {
        return deduplicate(parseSnapshot(input));
      } catch {
        this.storage.delete(this.key);
        return [];
      }
    }
    clear() {
      this.storage.delete(this.key);
    }
  }

  const sourceLabels = {
    "remote-active": "\u8fdc\u7a0b\u751f\u6548",
    "remote-lkg": "\u8fdc\u7a0b\u56de\u9000"
  };

  const loadStatusLabels = {
    loaded: "\u5df2\u9a8c\u8bc1\u672c\u5730\u89c4\u5219\u5feb\u7167",
    "no-rules": "\u5c1a\u672a\u540c\u6b65\u4e91\u7aef\u89c4\u5219",
    "discarded-invalid-cache": "\u65e0\u6548\u89c4\u5219\u5feb\u7167\u5df2\u6e05\u9664",
    "verification-deferred": "\u89c4\u5219\u5feb\u7167\u5f85\u9a8c\u8bc1\uff0c\u6682\u65e0\u53ef\u7528\u89c4\u5219"
  };

  function ruleCaptureFailure(adapter) {
    return adapter instanceof core.JsonRulePlatformAdapter ? adapter.ruleDiagnostics().captureFailure : null;
  }

  function zeroQuestionReadout(platformLabel, captureFailure) {
    return captureFailure ? {
      log: `\u547d\u4e2d${platformLabel} \xb7 \u6293\u5230 0 \u9898 \xb7 \u89c4\u5219\u6355\u83b7\u5931\u8d25 ${captureFailure}`,
      level: "warning"
    } : {
      log: `\u547d\u4e2d${platformLabel} \xb7 \u6293\u5230 0 \u9898`,
      level: "info"
    };
  }

  function resolvedRulePackage(adapter) {
    var _a;
    if (!(adapter instanceof core.JsonRulePlatformAdapter)) return null;
    return ((_a = adapter.ruleDiagnostics().resolved) == null ? void 0 : _a.pkg) ?? null;
  }

  function buildRuleSessionDiagnostic(adapter, loadStatus, releaseSummaries = []) {
    var _a, _b;
    if (!(adapter instanceof core.JsonRulePlatformAdapter)) return null;
    const diagnostics = adapter.ruleDiagnostics();
    const resolved = diagnostics.resolved;
    if (!resolved) return null;
    const releaseSummary = releaseSummaries.find(summary => rulePackageIdentity(summary) === rulePackageIdentity(resolved.pkg));
    return {
      loadStatus: loadStatus,
      loadStatusLabel: loadStatusLabels[loadStatus],
      packageId: resolved.pkg.packageId,
      variantId: diagnostics.variantId,
      source: resolved.source,
      sourceLabel: sourceLabels[resolved.source],
      version: resolved.pkg.version,
      releaseSequence: resolved.pkg.releaseSequence,
      contentHash: resolved.pkg.contentHash,
      ...releaseSummary ? {
        release: {
          releaseId: releaseSummary.releaseId,
          channel: releaseSummary.channel,
          rolloutPercent: releaseSummary.rolloutPercent,
          cohortBucket: releaseSummary.cohortBucket
        }
      } : {},
      candidateVersion: (_a = diagnostics.store.candidate) == null ? void 0 : _a.version,
      lastKnownGoodVersion: (_b = diagnostics.store.lastKnownGood) == null ? void 0 : _b.version,
      lifecycle: diagnostics.lifecycle,
      lifecycleFailure: diagnostics.lifecycleFailure,
      eventFailure: diagnostics.eventFailure,
      rechecks: diagnostics.rechecks,
      walker: diagnostics.walker,
      commit: diagnostics.commit,
      json: JSON.stringify(resolved.pkg, null, 2)
    };
  }

  const isDefinitivelyInvalid = error => error instanceof core.RuleVerificationError || error instanceof core.RuleStoreError && error.code === "snapshot_invalid" || error instanceof Error && error.name === "ZodError";

  class GmRuleStorePersistence {
    constructor(storage) {
      __publicField(this, "key", "aiask_rule_store_v1");
      this.storage = storage;
    }
    save(store) {
      this.storage.set(this.key, store.exportSnapshot());
    }
    async restore(store, verifier) {
      const snapshot = this.storage.get(this.key);
      if (snapshot == null) return "no-rules";
      try {
        await store.restoreSnapshot(snapshot, verifier);
        return "loaded";
      } catch (error) {
        if (isDefinitivelyInvalid(error)) {
          this.storage.delete(this.key);
          return "discarded-invalid-cache";
        }
        return "verification-deferred";
      }
    }
    async load(options) {
      const store = new core.RuleStore;
      return {
        store: store,
        status: await this.restore(store, options.verifier)
      };
    }
    clear() {
      this.storage.delete(this.key);
    }
  }

  class GmRuleKeysetPersistence {
    constructor(storage) {
      __publicField(this, "key", "aiask_rule_keyset_v1");
      this.storage = storage;
    }
    save(input) {
      this.storage.set(this.key, protocol.ServerKeysetSchema.parse(input));
    }
    load() {
      const input = this.storage.get(this.key);
      return input == null ? null : protocol.ServerKeysetSchema.parse(input);
    }
    clear() {
      this.storage.delete(this.key);
    }
  }

  async function restoreCachedRuleStore(options) {
    const persistence = new GmRuleKeysetPersistence(options.storage);
    try {
      const keyset = persistence.load();
      if (!keyset) return options.runtime.initialize({
        storage: options.storage
      });
      if (!(await protocol.verifyServerKeysetSignature(await protocol.importEcdsaPublicJwk(options.rootPublicJwk), keyset))) throw new Error("cached keyset root signature rejected");
      const highestAcceptedVersion = await core.readKeysetWatermark(options.storage, options.baseUrl, options.inheritLegacyKeysetWatermark);
      protocol.validateServerKeyset(keyset, (options.now ?? Date.now)(), highestAcceptedVersion);
      return options.runtime.initialize({
        storage: options.storage,
        verifier: options.createVerifier(keyset)
      });
    } catch {
      persistence.clear();
      return options.runtime.initialize({
        storage: options.storage
      });
    }
  }

  const RULE_UPDATE_INTERVAL_MS = 24 * 60 * 60 * 1e3;

  const RULE_UPDATE_RECOVERY_RETRY_MS = 10 * 60 * 1e3;

  const RULE_UPDATE_LAST_CHECK_KEY = "aiask_rule_update_last_check_v1";

  function normalizedBaseUrl(value) {
    return value.replace(/\/+$/u, "");
  }

  function knownPackages(runtime, store) {
    return runtime.packageIds().flatMap(packageId => {
      const diagnostics = store.diagnostics(packageId);
      const candidates = [ diagnostics.candidate, diagnostics.active, diagnostics.lastKnownGood ].filter(pkg => pkg != null);
      const current = candidates.sort((left, right) => right.releaseSequence - left.releaseSequence)[0];
      return current ? [ {
        packageId: current.packageId,
        releaseSequence: current.releaseSequence,
        contentHash: current.contentHash
      } ] : [];
    });
  }

  function mergeKnown(known, rejected) {
    const merged = new Map(known.map(item => [ item.packageId, item ]));
    for (const [packageId, item] of rejected) merged.set(packageId, item);
    return [ ...merged.values() ].slice(0, protocol.MAX_RULE_PACKAGES);
  }

  function errorReason(error) {
    return error instanceof Error ? error.message : "rule update failed";
  }

  class RuleUpdater {
    constructor(options) {
      __publicField(this, "now");
      __publicField(this, "baseUrl");
      __publicField(this, "pending");
      this.options = options;
      this.now = options.now ?? (() => Date.now());
      this.baseUrl = normalizedBaseUrl(options.baseUrl);
    }
    check(options = {}) {
      if (this.pending) return this.pending;
      this.pending = this.perform(options.force === true).finally(() => {
        this.pending = void 0;
      });
      return this.pending;
    }
    async perform(force) {
      const checkedAt = this.now();
      const previous = this.options.storage.get(RULE_UPDATE_LAST_CHECK_KEY);
      const interval = this.options.runtime.usablePackageIds().length > 0 ? RULE_UPDATE_INTERVAL_MS : RULE_UPDATE_RECOVERY_RETRY_MS;
      if (!force && typeof previous === "number" && Number.isFinite(previous) && previous >= 0 && previous <= checkedAt && checkedAt - previous < interval) return {
        status: "skipped",
        checkedAt: checkedAt,
        updatedPackageIds: []
      };
      try {
        const keyset = await this.options.getKeyset();
        let store = this.options.runtime.snapshot().store;
        let verifier = this.options.createVerifier(keyset, store);
        const initialized = await this.options.runtime.initialize({
          storage: this.options.storage,
          verifier: verifier
        });
        store = initialized.store;
        verifier = this.options.createVerifier(keyset, store, initialized.releaseSummaries);
        const persistence = new GmRuleStorePersistence(this.options.storage);
        const updatedPackageIds = [];
        const rejected = new Map;
        let failure;
        for (let index = 0; index < protocol.MAX_RULE_PACKAGES; index += 1) {
          const response = await this.options.transport.send({
            url: `${this.baseUrl}${protocol.RULE_SYNC_PATH}`,
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              engineVersion: this.options.engineVersion,
              known: mergeKnown(knownPackages(this.options.runtime, store), rejected)
            }),
            timeoutMs: 8e3
          });
          if (response.status < 200 || response.status >= 300) throw new Error("rule sync request failed");
          const parsed = protocol.RuleSyncResponseSchema.parse(JSON.parse(response.body));
          if (parsed.code !== protocol.AiAskCode.Ok) throw new Error(`rule sync rejected: ${parsed.code}`);
          if (parsed.update) {
            const update = parsed.update;
            try {
              verifier = this.options.createVerifier(keyset, store, parsed.latest);
              await store.stageRemote(update, verifier);
              const candidate = store.diagnostics(update.packageId).candidate;
              if ((candidate == null ? void 0 : candidate.releaseSequence) === update.releaseSequence && candidate.contentHash === update.contentHash) {
                store.activateCandidate(update.packageId);
                persistence.save(store);
                updatedPackageIds.push(update.packageId);
              }
            } catch (error) {
              failure ?? (failure = errorReason(error));
              rejected.set(update.packageId, {
                packageId: update.packageId,
                releaseSequence: update.releaseSequence,
                contentHash: update.contentHash
              });
            }
          }
          this.options.runtime.reconcileReleaseSummaries(parsed.latest, this.options.storage);
          if (!parsed.update) break;
          if (!parsed.hasMore) break;
        }
        this.options.storage.set(RULE_UPDATE_LAST_CHECK_KEY, checkedAt);
        return {
          status: updatedPackageIds.length > 0 ? "updated" : failure ? "failed" : "up-to-date",
          checkedAt: checkedAt,
          updatedPackageIds: updatedPackageIds,
          ...failure ? {
            reason: failure
          } : {}
        };
      } catch (error) {
        this.options.storage.set(RULE_UPDATE_LAST_CHECK_KEY, checkedAt);
        return {
          status: "failed",
          checkedAt: checkedAt,
          updatedPackageIds: [],
          reason: errorReason(error)
        };
      }
    }
  }

  function ruleStorageKeys(storage) {
    return [ new GmRuleStorePersistence(storage).key, new GmRuleKeysetPersistence(storage).key, new GmRuleReleaseContextPersistence(storage).key, RULE_UPDATE_LAST_CHECK_KEY, core.KEYSET_WATERMARKS_KEY, core.HIGHEST_KEYSET_VERSION_KEY ];
  }

  function resetRuleStorage(storage) {
    for (const key of ruleStorageKeys(storage)) storage.delete(key);
  }

  const deferredVerifier = {
    verify: () => Promise.reject(new Error("rule verifier unavailable"))
  };

  function packageIdsFor(store) {
    return [ ...new Set(store.exportSnapshot().packages.map(entry => entry.packageId)) ].sort();
  }

  function retainedReleaseSummaries(store, packageIds, summaries) {
    const allowed = new Set;
    for (const packageId of packageIds) {
      const diagnostics = store.diagnostics(packageId);
      for (const pkg of [ diagnostics.active, diagnostics.lastKnownGood, diagnostics.candidate ]) if (pkg) allowed.add(rulePackageIdentity(pkg));
    }
    return summaries.filter(summary => allowed.has(rulePackageIdentity(summary)));
  }

  class UserscriptRuleStoreRuntime {
    constructor() {
      __publicField(this, "state");
      __publicField(this, "pending");
      __publicField(this, "initialized", false);
      this.state = {
        store: new core.RuleStore,
        status: "no-rules",
        releaseSummaries: []
      };
    }
    snapshot() {
      return this.state;
    }
    packageIds() {
      return packageIdsFor(this.state.store);
    }
    usablePackageIds() {
      return this.packageIds().filter(packageId => this.state.store.resolve(packageId) !== null);
    }
    releaseSummaryFor(value) {
      const identity = rulePackageIdentity(value);
      return this.state.releaseSummaries.find(summary => rulePackageIdentity(summary) === identity) ?? null;
    }
    reconcileReleaseSummaries(latest, storage) {
      const byIdentity = new Map;
      for (const summary of this.state.releaseSummaries) byIdentity.set(rulePackageIdentity(summary), summary);
      for (const summary of latest) byIdentity.set(rulePackageIdentity(summary), summary);
      const releaseSummaries = retainedReleaseSummaries(this.state.store, this.packageIds(), [ ...byIdentity.values() ]);
      this.state = {
        ...this.state,
        releaseSummaries: releaseSummaries
      };
      new GmRuleReleaseContextPersistence(storage).save(releaseSummaries);
    }
    initialize(options) {
      if (this.initialized) {
        if (options.verifier && this.state.status === "verification-deferred") return this.restore(options.storage, options.verifier);
        return Promise.resolve(this.state);
      }
      if (this.pending) return this.pending;
      this.pending = this.load(options).then(state => {
        this.state = state;
        this.initialized = true;
        this.pending = void 0;
        return state;
      });
      return this.pending;
    }
    restore(storage, verifier) {
      if (this.pending) return this.pending;
      this.pending = new GmRuleStorePersistence(storage).restore(this.state.store, verifier).then(status => {
        const persistence = new GmRuleReleaseContextPersistence(storage);
        const releaseSummaries = retainedReleaseSummaries(this.state.store, this.packageIds(), persistence.load());
        persistence.save(releaseSummaries);
        this.state = {
          store: this.state.store,
          status: status,
          releaseSummaries: releaseSummaries
        };
        this.pending = void 0;
        return this.state;
      });
      return this.pending;
    }
    async load(options) {
      const persistence = new GmRuleReleaseContextPersistence(options.storage);
      const cachedReleaseSummaries = persistence.load();
      try {
        const loaded = await new GmRuleStorePersistence(options.storage).load({
          verifier: options.verifier ?? deferredVerifier
        });
        const releaseSummaries = loaded.status === "verification-deferred" ? cachedReleaseSummaries : retainedReleaseSummaries(loaded.store, packageIdsFor(loaded.store), cachedReleaseSummaries);
        if (loaded.status !== "verification-deferred") persistence.save(releaseSummaries);
        return {
          ...loaded,
          releaseSummaries: releaseSummaries
        };
      } catch {
        return {
          store: new core.RuleStore,
          status: "verification-deferred",
          releaseSummaries: cachedReleaseSummaries
        };
      }
    }
  }

  const ruleStoreRuntime = new UserscriptRuleStoreRuntime;

  const listeners = new Set;

  function subscribeRuleStoreUpdates(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  async function checkRulesAndNotify(check) {
    const result = await check();
    for (const listener of [ ...listeners ]) {
      try {
        listener(result);
      } catch {}
    }
    return result;
  }

  const restoredListeners = new Set;

  let restoreInFlight = false;

  let restoreSettledOnce = false;

  function subscribeRuleStoreRestored(listener) {
    restoredListeners.add(listener);
    if (restoreSettledOnce && !restoreInFlight) {
      try {
        listener();
      } catch {}
    }
    return () => restoredListeners.delete(listener);
  }

  const ruleStoreRestorePending = () => restoreInFlight;

  function markRuleStoreRestoreStarted() {
    restoreInFlight = true;
  }

  function notifyRuleStoreRestored() {
    restoreInFlight = false;
    restoreSettledOnce = true;
    for (const listener of [ ...restoredListeners ]) {
      try {
        listener();
      } catch {}
    }
  }

  function ruleUpdateReadout(result, packageCount) {
    if (result.status === "skipped") return packageCount === 0 ? {
      note: "\u672c\u5730\u6ca1\u6709\u4efb\u4f55\u89c4\u5219\u5305",
      log: "\u672c\u5730\u6ca1\u6709\u4efb\u4f55\u89c4\u5219\u5305 \xb7 \u8ddd\u4e0a\u6b21\u68c0\u67e5\u4e0d\u8db3 24 \u5c0f\u65f6\uff0c\u70b9\u300c\u68c0\u67e5\u66f4\u65b0\u300d\u53ef\u7acb\u5373\u91cd\u8bd5",
      level: "warning"
    } : null;
    if (result.status === "updated") return {
      note: `\u5df2\u66f4\u65b0 ${result.updatedPackageIds.length} \u4e2a\u89c4\u5219\u5305`,
      log: `\u89c4\u5219\u66f4\u65b0\u5b8c\u6210 \xb7 ${result.updatedPackageIds.join("\u3001")}`,
      level: "info"
    };
    if (result.status === "failed") return {
      note: "\u68c0\u67e5\u5931\u8d25 \xb7 \u5f53\u524d\u89c4\u5219\u7ee7\u7eed\u53ef\u7528",
      log: `\u89c4\u5219\u68c0\u67e5\u5931\u8d25 \xb7 ${result.reason ?? "\u5df2\u4fdd\u7559\u5f53\u524d\u89c4\u5219"}`,
      level: "warning"
    };
    if (packageCount === 0) return {
      note: "\u670d\u52a1\u7aef\u6ca1\u6709\u53ef\u7528\u89c4\u5219\u5305",
      log: "\u89c4\u5219\u540c\u6b65\u6210\u529f \xb7 \u670d\u52a1\u7aef\u6ca1\u6709\u4e0b\u53d1\u4efb\u4f55\u89c4\u5219\u5305",
      level: "warning"
    };
    return {
      note: "\u5f53\u524d\u89c4\u5219\u5df2\u662f\u6700\u65b0",
      log: "\u89c4\u5219\u68c0\u67e5\u5b8c\u6210 \xb7 \u5df2\u662f\u6700\u65b0",
      level: "info"
    };
  }

  function authorizesRollback(summaries, authorization, pkg) {
    return summaries.some(summary => {
      var _a;
      return summary.packageId === pkg.packageId && summary.version === pkg.version && summary.releaseSequence === pkg.releaseSequence && summary.contentHash === pkg.contentHash && ((_a = summary.rollbackAuthorization) == null ? void 0 : _a.toVersion) === authorization.toVersion && summary.rollbackAuthorization.authorizationId === authorization.authorizationId;
    });
  }

  function baseRegistry(options, policy, allowedSlots) {
    const refs = new core.RuntimeReferenceRegistry({
      maxDomRefs: policy.limits.maxDomRefs
    });
    const capture = new core.RuleCaptureRegistry({
      maxTrees: 256,
      maxBindings: policy.limits.maxDomRefs
    });
    const registry = new core.PrimitiveRegistry;
    core.registerCoreRulePrimitives(registry, {
      document: options.document,
      location: options.location,
      refs: refs,
      capture: capture,
      writer: new core.BindingRegistryAnswerWriter(capture.bindings),
      resources: new core.RuleResourceScope,
      listener: {
        read: () => null,
        allowedSlots: allowedSlots,
        declaredSlots: () => null
      }
    });
    return {
      registry: registry,
      refs: refs
    };
  }

  function platformContext(pkg, options) {
    const register = (policy, allowedSlots) => {
      var _a;
      const {registry: registry, refs: refs} = baseRegistry(options, policy, allowedSlots);
      (_a = PLATFORM_PRIVATE_HOOKS[pkg.platform]) == null ? void 0 : _a.registerForVerification(registry, {
        refs: refs,
        typr: options.typr,
        fontTable: options.fontTable ?? {},
        packageId: pkg.packageId
      });
      return registry;
    };
    if (pkg.platform === "chaoxing") {
      const policy = platformRulePolicy("chaoxing");
      const allowedSlots = slotsForHosts([ "chaoxing.com" ]);
      return {
        registry: register(policy, allowedSlots),
        policy: policy,
        allowedSlots: allowedSlots
      };
    }
    const trustedRemote = trustedRemoteRulePlatformByPackageId(pkg.packageId);
    if ((trustedRemote == null ? void 0 : trustedRemote.platform) === pkg.platform) {
      const policy = trustedRemote.policy;
      const allowedSlots = slotsForHosts(trustedRemote.hosts);
      return {
        registry: register(policy, allowedSlots),
        policy: policy,
        allowedSlots: allowedSlots
      };
    }
    throw new core.RuleVerificationError("capability_denied", `unsupported rule platform: ${pkg.platform}`);
  }

  function createUserscriptRuleVerifier(options) {
    return {
      verify: async input => {
        var _a;
        const pkg = protocol.RulePackageSchema.parse(input);
        const {registry: registry, policy: policy, allowedSlots: allowedSlots} = platformContext(pkg, options);
        const current = (_a = options.store.resolve(pkg.packageId)) == null ? void 0 : _a.pkg;
        return new core.RuleVerifier({
          engineVersion: RULE_ENGINE_VERSION,
          keyset: options.keyset,
          registry: registry,
          policy: policy,
          allowedSlots: allowedSlots,
          services: options.services ?? RULE_EXPRESSION_SERVICES,
          now: options.now,
          authorizeRollback: (authorization, candidate) => authorizesRollback(options.releaseSummaries ?? [], authorization, candidate),
          ...current ? {
            current: {
              version: current.version,
              releaseSequence: current.releaseSequence,
              contentHash: current.contentHash
            }
          } : {}
        }).verify(pkg);
      }
    };
  }

  const yieldToEventLoop = () => new Promise(resolve => {
    setTimeout(resolve, 0);
  });

  const yieldingVerifier = (inner, yieldFn = yieldToEventLoop) => ({
    async verify(input) {
      await yieldFn();
      return inner.verify(input);
    }
  });

  const keysetPersistence = new GmRuleKeysetPersistence(gmRuleStorage);

  const verifierFor = (keyset, store, releaseSummaries = new GmRuleReleaseContextPersistence(gmRuleStorage).load()) => createUserscriptRuleVerifier({
    keyset: keyset,
    store: store,
    document: document,
    location: location,
    typr: Typr$1,
    fontTable: getChaoxingFontTable(),
    now: () => ruleSecurityClient.sessions.serverNow(),
    releaseSummaries: releaseSummaries
  });

  const updater = new RuleUpdater({
    transport: ruleTransport,
    baseUrl: BACKEND_BASE_URL,
    storage: gmRuleStorage,
    runtime: ruleStoreRuntime,
    engineVersion: RULE_ENGINE_VERSION,
    getKeyset: async () => {
      const keyset = (await ruleSecurityClient.sessions.getSession()).keyset;
      keysetPersistence.save(keyset);
      return keyset;
    },
    createVerifier: verifierFor
  });

  let restorePending = null;

  const initializeRuleStoreRuntime = () => {
    if (restorePending) return restorePending;
    markRuleStoreRestoreStarted();
    restorePending = restoreCachedRuleStore({
      storage: gmRuleStorage,
      runtime: ruleStoreRuntime,
      baseUrl: BACKEND_BASE_URL,
      inheritLegacyKeysetWatermark: IS_DEFAULT_BACKEND,
      rootPublicJwk: SECURITY_ROOT_PUBLIC_JWK,
      createVerifier: keyset => yieldingVerifier(verifierFor(keyset, ruleStoreRuntime.snapshot().store))
    }).finally(notifyRuleStoreRestored);
    return restorePending;
  };

  const checkRuleUpdates = (force = false) => checkRulesAndNotify(() => updater.check({
    force: force
  }));

  const FREE_BANK_URL = "https://cx.icodef.com/wyn-nb?v=4";

  const AD_KEYWORDS = [ "\u53db\u9006", "\u516c\u4f17\u53f7", "\u674e\u6052\u96c5", "\u4e00\u4e4b" ];

  function isAdAnswer(text) {
    return AD_KEYWORDS.some(k => text.includes(k));
  }

  const NON_ANSWER_EXACT = new Set([ "\u6682\u65e0KEY", "\u65e0KEY", "\u6682\u65e0APIKEY", "\u65e0APIKEY", "\u672a\u914d\u7f6eKEY", "\u672a\u914d\u7f6eAPIKEY", "\u672a\u586b\u5199KEY", "\u672a\u586b\u5199APIKEY", "APIKEY\u7f3a\u5931", "\u8bf7\u586b\u5199KEY", "\u8bf7\u586b\u5199APIKEY", "\u8bf7\u914d\u7f6eKEY", "\u8bf7\u914d\u7f6eAPIKEY", "\u6682\u65e0\u7b54\u6848", "\u6682\u65e0\u7b54\u6848\u4fe1\u606f", "\u65e0\u7b54\u6848", "\u6ca1\u6709\u7b54\u6848", "\u672a\u627e\u5230\u7b54\u6848", "\u672a\u67e5\u8be2\u5230\u7b54\u6848", "\u672a\u68c0\u7d22\u5230\u7b54\u6848", "\u67e5\u8be2\u4e0d\u5230\u7b54\u6848", "\u8bf7\u767b\u5f55", "\u8bf7\u5148\u767b\u5f55", "\u672a\u767b\u5f55", "\u9274\u6743\u5931\u8d25", "\u672a\u6388\u6743", "\u65e0\u6743\u9650", "\u8bf7\u6c42\u5931\u8d25", "\u7f51\u7edc\u5f02\u5e38", "\u7f51\u7edc\u8bf7\u6c42\u5931\u8d25", "\u54cd\u5e94\u89e3\u6790\u5931\u8d25", "\u63a5\u53e3\u5f02\u5e38", "\u63a5\u53e3\u8bf7\u6c42\u5931\u8d25", "\u63a5\u53e3\u8bf7\u6c42\u8d85\u65f6", "\u8bf7\u6c42\u8d85\u65f6", "\u6b21\u6570\u4e0d\u8db3", "\u4f59\u989d\u4e0d\u8db3", "\u989d\u5ea6\u4e0d\u8db3" ]);

  const NON_ANSWER_PATTERNS = [ /^\u6682\u672a(\u6536\u5f55|\u627e\u5230|\u67e5\u8be2\u5230|\u68c0\u7d22\u5230)(\u53c2\u8003)?\u7b54\u6848(\u4fe1\u606f)?$/, /^\u672a(\u627e\u5230|\u67e5\u8be2\u5230|\u68c0\u7d22\u5230)(\u53c2\u8003)?\u7b54\u6848(\u4fe1\u606f)?$/, /^\u6ca1\u6709(\u627e\u5230|\u67e5\u8be2\u5230|\u68c0\u7d22\u5230)?(\u53c2\u8003)?\u7b54\u6848(\u4fe1\u606f)?$/, /^\u8bf7(\u5148)?\u767b\u5f55\u540e(\u518d)?(\u67e5\u770b|\u4f7f\u7528|\u641c\u7d22|\u67e5\u8be2).*$/, /^\u767b\u5f55\u540e\u624d\u53ef\u4ee5\u4f7f\u7528.*$/, /^API\s*KEY\s*(\u7f3a\u5931|\u672a\u586b\u5199|\u672a\u914d\u7f6e|\u65e0\u6548).*$/i, /^(\u8bf7\u6c42|\u63a5\u53e3|\u7f51\u7edc).*(\u5931\u8d25|\u5f02\u5e38|\u8d85\u65f6)$/, /^(\u6b21\u6570|\u4f59\u989d|\u989d\u5ea6).*(\u4e0d\u8db3|\u5df2\u7528\u5b8c)$/ ];

  function isNonAnswerText(value) {
    const trimmed = value.trim();
    if (!trimmed) return true;
    if (NON_ANSWER_EXACT.has(trimmed.replace(/\s+/g, "").toUpperCase())) return true;
    return NON_ANSWER_PATTERNS.some(pattern => pattern.test(trimmed));
  }

  function parseIcodefBody(raw) {
    let res;
    try {
      res = JSON.parse(raw);
    } catch {
      return null;
    }
    if (res.code !== 1 || typeof res.data !== "string") return null;
    const data = res.data.replace(/javascript:void\(0\);/g, "").trim().replace(/\n/g, "");
    if (!data || isAdAnswer(data)) return null;
    const values = data.split("#").map(s => s.trim()).filter(Boolean);
    return values.length ? values : null;
  }

  async function freeBankSearch(transport, unit, timeoutMs = 5e3) {
    try {
      const res = await transport.send({
        url: FREE_BANK_URL,
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: protocol.questionTextForSearch(unit.effectiveStem)
        }),
        timeoutMs: timeoutMs
      });
      if (res.status < 200 || res.status >= 300) return null;
      const values = parseIcodefBody(res.body);
      if (!values) return null;
      if (unit.options.length === 0 && values.some(isNonAnswerText)) return null;
      return {
        values: values
      };
    } catch {
      return null;
    }
  }

  function createSession(o) {
    var _a, _b;
    const ctx = {
      document: o.document,
      location: o.location,
      signal: (new AbortController).signal,
      deps: {
        typr: o.typr,
        table: o.fontTable
      }
    };
    const runtimeState = ruleStoreRuntime.snapshot();
    const ruleStore = o.ruleStore ?? runtimeState.store;
    const ruleStoreStatus = o.ruleStoreStatus ?? runtimeState.status;
    const factories = o.adapterFactories ?? createDefaultAdapterFactories(o.location, o.typr, ruleStore, o.fontTable ?? {}, void 0, () => o.settings.autoStart === true);
    const candidates = factories.map(factory => ({
      factory: factory,
      adapter: factory()
    }));
    const adapter = new core.RuleRuntime(candidates.map(candidate => candidate.adapter)).resolve(ctx);
    const selected2 = candidates.find(candidate => candidate.adapter === adapter);
    if (!adapter || !selected2) return {
      session: null,
      reason: "unsupported"
    };
    const client = new core.RelayClient(o.backendTransport, o.baseUrl);
    const freeFirst = o.settings.freeFirst !== false;
    const sessionDeps = {
      ...o.sessionDeps,
      freeSearch: req => freeBankSearch(o.transport, req),
      canPaidSearch: () => !!o.getToken(),
      localStore: ((_a = o.sessionDeps) == null ? void 0 : _a.localStore) ?? o.localStore,
      onHarvested: ((_b = o.sessionDeps) == null ? void 0 : _b.onHarvested) ?? o.onHarvested
    };
    const session = new core.AnswerSession(adapter, client, {
      autoFill: o.settings.autoFill,
      delayMs: o.settings.delayMs,
      freeFirst: freeFirst
    }, sessionDeps, o.emit);
    return {
      session: session,
      ctx: ctx,
      platform: adapter.platform,
      adapter: adapter,
      createAdapter: selected2.factory,
      rule: buildRuleSessionDiagnostic(adapter, ruleStoreStatus, o.ruleReleaseSummaries ?? runtimeState.releaseSummaries)
    };
  }

  const _hoisted_1$1 = {
    class: "question-content"
  };

  const _hoisted_2$1 = {
    key: 0
  };

  const _hoisted_3$1 = {
    key: 1,
    class: "image-failed"
  };

  const _hoisted_4$1 = [ "src", "onError" ];

  const _sfc_main$1 = vue.defineComponent({
    __name: "QuestionContent",
    props: {
      content: {},
      maxHeight: {
        default: "180px"
      }
    },
    setup(__props) {
      const props = __props;
      const generation = vue.ref(0);
      const parts = vue.computed(() => {
        const renderedGeneration = generation.value;
        return protocol.parseQuestionContent(props.content).map(part => ({
          ...part,
          generation: renderedGeneration
        }));
      });
      const failed = vue.ref(new Set);
      vue.watch(() => props.content, () => {
        generation.value++;
        failed.value = new Set;
      });
      const markFailed = (index, renderedGeneration) => {
        if (renderedGeneration !== generation.value) return;
        failed.value = new Set(failed.value).add(index);
      };
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("span", _hoisted_1$1, [ (vue.openBlock(true), 
      vue.createElementBlock(vue.Fragment, null, vue.renderList(parts.value, (part, index) => (vue.openBlock(), 
      vue.createElementBlock(vue.Fragment, {
        key: `${index}:${part.value}`
      }, [ part.type === "text" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2$1, vue.toDisplayString(part.value), 1)) : failed.value.has(index) ? (vue.openBlock(), 
      vue.createElementBlock("span", _hoisted_3$1, "\u56fe\u7247\u52a0\u8f7d\u5931\u8d25")) : (vue.openBlock(), 
      vue.createElementBlock("img", {
        key: 2,
        src: part.value,
        alt: "\u9898\u76ee\u56fe\u7247",
        loading: "lazy",
        referrerpolicy: "no-referrer",
        style: vue.normalizeStyle({
          maxHeight: __props.maxHeight
        }),
        onError: $event => markFailed(index, part.generation)
      }, null, 44, _hoisted_4$1)) ], 64))), 128)) ]));
    }
  });

  function formatClock(seconds) {
    const total = Math.max(0, Math.floor(seconds));
    const secs = String(total % 60).padStart(2, "0");
    const mins = Math.floor(total / 60) % 60;
    const hours = Math.floor(total / 3600);
    if (hours > 0) return `${hours}:${String(mins).padStart(2, "0")}:${secs}`;
    return `${mins}:${secs}`;
  }

  function coursePositionLine(progress) {
    var _a;
    const position = (_a = progress == null ? void 0 : progress.task) == null ? void 0 : _a.position;
    if (!position) return null;
    return position.totalSeconds === null ? formatClock(position.currentSeconds) : `${formatClock(position.currentSeconds)} / ${formatClock(position.totalSeconds)}`;
  }

  function courseCountLine(progress) {
    const parts = [];
    const section = progress == null ? void 0 : progress.section;
    if (section && section.total > 0) parts.push(`\u672c\u8282\u4efb\u52a1\u70b9 ${section.done}/${section.total}`);
    if (progress == null ? void 0 : progress.course) parts.push(`\u5168\u8bfe\u8fd8\u5269 ${progress.course.unfinished} \u4e2a`);
    return parts.length > 0 ? parts.join(" \xb7 ") : null;
  }

  const NOTHING_TO_DO_KINDS = new Set([ "idle", "all-done", "advancing", "advancing-section" ]);

  function courseStatusLine(state, progress) {
    if (!state) return "\u672a\u5f00\u542f";
    if (state.kind === "playing" && (progress == null ? void 0 : progress.task)) return `\u6b63\u5728\u64ad\u653e\u300c${progress.task.name}\u300d`;
    const section = progress == null ? void 0 : progress.section;
    if (section && NOTHING_TO_DO_KINDS.has(state.kind)) {
      const off = section.skipped.filter(item => item.reason === "kind-off").length;
      if (section.total === 0 && off > 0) return `\u672c\u8282 ${off} \u9879\u90fd\u88ab\u4f60\u5173\u6389\u7684\u7c7b\u578b\u8df3\u8fc7\u4e86`;
    }
    if (state.kind !== "idle") return "";
    if (!section) return "\u672c\u9875\u6ca1\u6709\u53ef\u64ad\u653e\u7684\u4efb\u52a1\u70b9";
    if (section.done === section.total) return "\u672c\u8282\u4efb\u52a1\u70b9\u5df2\u5168\u90e8\u5b8c\u6210";
    return `\u672c\u8282\u8fd8\u5269 ${section.total - section.done} \u9879 \xb7 \u672c\u9875\u6ca1\u627e\u5230\u53ef\u505a\u7684\u5185\u5bb9`;
  }

  function createPanelLauncherGestureState() {
    return {
      suppressPointerClick: false
    };
  }

  function beginPanelLauncherGesture(state) {
    state.suppressPointerClick = false;
  }

  function endPanelLauncherGesture(state, result, eventType) {
    state.suppressPointerClick = result.moved;
    return eventType === "pointerup" && !result.moved;
  }

  function consumePanelLauncherActivation(state, clickDetail) {
    const activate = !state.suppressPointerClick || clickDetail === 0;
    state.suppressPointerClick = false;
    return activate;
  }

  function createPanelDragState() {
    return {
      pointerId: null,
      offsetX: 0,
      offsetY: 0,
      panel: {
        width: 0,
        height: 0
      },
      origin: {
        x: 0,
        y: 0
      },
      moved: false
    };
  }

  function isPanelDragInteractiveTarget(target) {
    return target instanceof Element && target.closest('button,a,input,textarea,select,[role="button"]') !== null;
  }

  function beginPanelDrag(state, input) {
    if (state.pointerId !== null) return false;
    if (input.interactive) return false;
    if (!input.isPrimary) return false;
    if (input.pointerType === "mouse" && input.button !== 0) return false;
    state.pointerId = input.pointerId;
    state.offsetX = input.clientX - input.rect.left;
    state.offsetY = input.clientY - input.rect.top;
    state.panel = {
      width: input.rect.width,
      height: input.rect.height
    };
    state.origin = {
      x: Math.round(input.rect.left),
      y: Math.round(input.rect.top)
    };
    state.moved = false;
    return true;
  }

  function movePanelDrag(state, input, viewport) {
    if (state.pointerId === null || input.pointerId !== state.pointerId) {
      return null;
    }
    const position = clampPanelPosition({
      x: input.clientX - state.offsetX,
      y: input.clientY - state.offsetY
    }, state.panel, viewport);
    if (position.x !== state.origin.x || position.y !== state.origin.y) {
      state.moved = true;
    }
    return position;
  }

  function endPanelDrag(state, pointerId) {
    if (state.pointerId === null || state.pointerId !== pointerId) {
      return null;
    }
    const result = {
      moved: state.moved
    };
    const reset = createPanelDragState();
    state.pointerId = reset.pointerId;
    state.offsetX = reset.offsetX;
    state.offsetY = reset.offsetY;
    state.panel = reset.panel;
    state.origin = reset.origin;
    state.moved = reset.moved;
    return result;
  }

  function resolveOptionDisclosure(options, matchedIndexes, expanded) {
    const all = options.map((o, i) => ({
      o: o,
      i: i
    }));
    const visible2 = expanded ? all : all.filter(option => matchedIndexes.has(option.i));
    return {
      visible: visible2,
      collapsible: expanded || visible2.length < all.length
    };
  }

  const TYPE_LABELS = {
    [protocol.QuestionType.Single]: "\u5355\u9009\u9898",
    [protocol.QuestionType.Multiple]: "\u591a\u9009\u9898",
    [protocol.QuestionType.Judge]: "\u5224\u65ad\u9898",
    [protocol.QuestionType.Fill]: "\u586b\u7a7a\u9898"
  };

  const TEXT_TYPE_LABELS = {
    short_answer: "\u7b80\u7b54\u9898",
    definition: "\u540d\u8bcd\u89e3\u91ca",
    essay: "\u8bba\u8ff0\u9898"
  };

  const harvestTypeLabel = itemType => {
    const normalized = core.normalizeLeafQuestionType(itemType);
    if (!normalized) return (itemType == null ? void 0 : itemType.trim()) || "\u9898\u76ee";
    return TEXT_TYPE_LABELS[normalized] ?? TYPE_LABELS[normalized];
  };

  const esc = value => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const contentHtml = content => protocol.parseQuestionContent(content).map(part => part.type === "image" ? `<img src="${esc(part.value)}" alt="\u9898\u76ee\u56fe\u7247" referrerpolicy="no-referrer">` : esc(part.value)).join("");

  const letter = index => String.fromCharCode(65 + index);

  const typeLabel = it => it.unit && core.isTextAnswerType(it.unit.queryType) ? harvestTypeLabel(it.unit.queryType) : TYPE_LABELS[it.q.type];

  function buildPageExportHtml(items, meta) {
    const sections = items.map((it, inx) => {
      if (it.status === "decodeFail" || it.status === "unsupported") {
        const reason = it.status === "decodeFail" ? "\u9898\u9762\u89e3\u6790\u5931\u8d25\uff0c\u5df2\u8df3\u8fc7" : "\u9898\u76ee\u65e0\u5408\u6cd5\u6587\u5b57\u6216\u56fe\u7247\uff0c\u5df2\u8df3\u8fc7";
        return `<section class="q"><h3>\u7b2c ${inx + 1} \u9898</h3><p class="mute">\uff08${reason}\uff09</p></section>`;
      }
      const matched = it.unit ? new Set(core.answeredOptionIndexes(it.unit, it.answerPlan)) : new Set;
      const opts = it.q.options.map((option, i) => `<li${matched.has(i) ? ' class="hit"' : ""}>${letter(i)}. ${contentHtml(option)}</li>`).join("");
      const answer = it.answer.length ? `${it.answer.map(contentHtml).join("\uff1b")}${it.aiGenerated ? ' <span class="mute">\uff08AI \u751f\u6210 \xb7 \u5f85\u6838\u5bf9\uff09</span>' : ""}` : '<span class="mute">\u672a\u547d\u4e2d</span>';
      return `<section class="q">\n<h3>\u7b2c ${inx + 1} \u9898 <small>[${typeLabel(it)}]</small></h3>\n<p class="stem">${contentHtml(it.q.stem)}</p>\n${opts ? `<ol class="opts">${opts}</ol>` : ""}\n<p class="ans">\u53c2\u8003\u7b54\u6848\uff1a${answer}</p>\n</section>`;
    }).join("\n");
    return pageShell("\u672c\u9875\u9898\u76ee\u4e0e\u53c2\u8003\u7b54\u6848", meta, sections);
  }

  const harvestHitIndexes = it => {
    const wanted = it.values.map(core.normalizeForMatch).filter(v => v !== "");
    const wantedTruth = it.values.map(core.normalizeTruth);
    return new Set((it.options ?? []).flatMap((option, i) => {
      const truth = core.normalizeTruth(option);
      return wanted.includes(core.normalizeForMatch(option)) || truth !== null && wantedTruth.includes(truth) ? [ i ] : [];
    }));
  };

  function buildHarvestExportHtml(items, meta) {
    const sections = items.map((it, inx) => {
      const matched = harvestHitIndexes(it);
      const opts = (it.options ?? []).map((option, i) => `<li${matched.has(i) ? ' class="hit"' : ""}>${letter(i)}. ${contentHtml(option)}</li>`).join("");
      return `<section class="q">\n<h3>\u7b2c ${inx + 1} \u9898 <small>[${esc(harvestTypeLabel(it.itemType))}]</small></h3>\n<p class="stem">${it.stem ? contentHtml(it.stem) : '<span class="mute">\uff08\u8fd9\u6761\u6ca1\u6709\u9898\u9762\uff09</span>'}</p>\n${opts ? `<ol class="opts">${opts}</ol>` : ""}\n<p class="ans">\u7b54\u6848\uff1a${it.values.map(contentHtml).join("\uff1b")}</p>\n</section>`;
    }).join("\n");
    return pageShell("\u672c\u9875\u6536\u5f55\u7684\u9898\u76ee\u4e0e\u7b54\u6848", meta, sections);
  }

  const pageShell = (heading, meta, sections) => `<!doctype html>\n<html lang="zh-CN">\n<head>\n<meta charset="utf-8">\n<title>\u7231\u95ee\u7b54 \xb7 ${esc(heading)}</title>\n<style>\nbody { max-width: 760px; margin: 24px auto; padding: 0 16px; font: 15px/1.7 system-ui, sans-serif; color: #222; }\n.meta, .mute { color: #888; font-size: 13px; }\n.q { border-bottom: 1px solid #eee; padding: 12px 0; }\n.q h3 { margin: 0 0 6px; font-size: 15px; }\n.opts { list-style: none; padding-left: 8px; margin: 6px 0; }\n.opts .hit { font-weight: 600; }\n.opts .hit::after { content: " \u2713"; }\n.ans { margin: 6px 0 0; }\nimg { max-height: 180px; vertical-align: middle; }\n</style>\n</head>\n<body>\n<h1>${esc(heading)}</h1>\n<p class="meta">${esc(meta.platformLabel)} \xb7 ${esc(meta.exportedAt)}</p>\n${sections}\n<p class="meta">\u7231\u95ee\u7b54 \xb7 \u7b54\u6848\u4ec5\u4f9b\u53c2\u8003\uff0c\u81ea\u884c\u6838\u5bf9\u3002</p>\n</body>\n</html>`;

  const _hoisted_1 = {
    key: 0,
    class: "tip"
  };

  const _hoisted_2 = {
    key: 0,
    class: "badge"
  };

  const _hoisted_3 = {
    width: "0",
    height: "0",
    style: {
      position: "absolute"
    },
    "aria-hidden": "true"
  };

  const _hoisted_4 = [ "aria-label" ];

  const _hoisted_5 = {
    key: 1,
    class: "ic",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "1.7",
    "aria-hidden": "true"
  };

  const _hoisted_6 = {
    class: "tabbar"
  };

  const _hoisted_7 = [ "onClick" ];

  const _hoisted_8 = {
    key: 0,
    class: "anb warning"
  };

  const _hoisted_9 = [ "title" ];

  const _hoisted_10 = {
    key: 2,
    class: "subbar"
  };

  const _hoisted_11 = [ "onClick" ];

  const _hoisted_12 = {
    class: "body"
  };

  const _hoisted_13 = {
    key: 0,
    class: "card"
  };

  const _hoisted_14 = {
    class: "row"
  };

  const _hoisted_15 = {
    class: "tag neutral mono"
  };

  const _hoisted_16 = {
    class: "gate-h"
  };

  const _hoisted_17 = [ "innerHTML" ];

  const _hoisted_18 = {
    key: 1,
    class: "card"
  };

  const _hoisted_19 = {
    class: "row"
  };

  const _hoisted_20 = {
    class: "toolbar"
  };

  const _hoisted_21 = [ "title" ];

  const _hoisted_22 = {
    key: 0,
    class: "row"
  };

  const _hoisted_23 = {
    class: "mono cap-mute"
  };

  const _hoisted_24 = {
    key: 1,
    class: "mono cap-mute"
  };

  const _hoisted_25 = {
    key: 2,
    class: "skip"
  };

  const _hoisted_26 = {
    class: "cap-mute"
  };

  const _hoisted_27 = {
    key: 2,
    class: "standby"
  };

  const _hoisted_28 = {
    class: "cap-mute"
  };

  const _hoisted_29 = {
    key: 3,
    class: "card"
  };

  const _hoisted_30 = {
    class: "row"
  };

  const _hoisted_31 = {
    class: "tag neutral"
  };

  const _hoisted_32 = {
    class: "gate-h"
  };

  const _hoisted_33 = {
    class: "cap-mute"
  };

  const _hoisted_34 = {
    key: 4,
    class: "grp"
  };

  const _hoisted_35 = {
    class: "cap-mute mono"
  };

  const _hoisted_36 = {
    class: "evi-pre"
  };

  const _hoisted_37 = {
    class: "toolbar"
  };

  const _hoisted_38 = [ "disabled" ];

  const _hoisted_39 = [ "disabled" ];

  const _hoisted_40 = [ "disabled" ];

  const _hoisted_41 = {
    class: "cap-mute"
  };

  const _hoisted_42 = {
    key: 2,
    class: "cap-mute"
  };

  const _hoisted_43 = {
    class: "toolbar"
  };

  const _hoisted_44 = {
    class: "grp"
  };

  const _hoisted_45 = {
    class: "row"
  };

  const _hoisted_46 = {
    class: "locator"
  };

  const _hoisted_47 = {
    class: "toolbar"
  };

  const _hoisted_48 = {
    key: 0,
    class: "tag acc"
  };

  const _hoisted_49 = {
    class: "cap-mute"
  };

  const _hoisted_50 = {
    key: 0,
    class: "banner"
  };

  const _hoisted_51 = {
    class: "spacer"
  };

  const _hoisted_52 = {
    key: 1,
    class: "card done"
  };

  const _hoisted_53 = {
    class: "prow"
  };

  const _hoisted_54 = {
    key: 0,
    class: "cap-mute"
  };

  const _hoisted_55 = {
    class: "prow"
  };

  const _hoisted_56 = {
    class: "prow"
  };

  const _hoisted_57 = {
    key: 0,
    class: "prow"
  };

  const _hoisted_58 = {
    key: 1,
    class: "prow"
  };

  const _hoisted_59 = {
    key: 2,
    class: "prow"
  };

  const _hoisted_60 = {
    key: 3,
    class: "prow"
  };

  const _hoisted_61 = {
    class: "cap-mute"
  };

  const _hoisted_62 = {
    class: "grp"
  };

  const _hoisted_63 = {
    key: 0,
    class: "cap-mute"
  };

  const _hoisted_64 = {
    key: 1,
    class: "row"
  };

  const _hoisted_65 = {
    class: "tag acc"
  };

  const _hoisted_66 = {
    key: 2,
    class: "cap-mute"
  };

  const _hoisted_67 = {
    key: 2,
    class: "grp"
  };

  const _hoisted_68 = {
    class: "grid"
  };

  const _hoisted_69 = [ "onClick" ];

  const _hoisted_70 = {
    key: 3,
    class: "card"
  };

  const _hoisted_71 = {
    class: "row"
  };

  const _hoisted_72 = {
    class: "locator"
  };

  const _hoisted_73 = {
    class: "row"
  };

  const _hoisted_74 = {
    class: "locator"
  };

  const _hoisted_75 = {
    class: "row question-head"
  };

  const _hoisted_76 = {
    class: "locator"
  };

  const _hoisted_77 = {
    class: "toolbar"
  };

  const _hoisted_78 = {
    key: 0,
    class: "tag neutral"
  };

  const _hoisted_79 = [ "disabled" ];

  const _hoisted_80 = {
    class: "stem"
  };

  const _hoisted_81 = {
    class: "stem-type"
  };

  const _hoisted_82 = {
    class: "opts"
  };

  const _hoisted_83 = {
    class: "answer-block"
  };

  const _hoisted_84 = {
    class: "row"
  };

  const _hoisted_85 = {
    class: "toolbar"
  };

  const _hoisted_86 = {
    key: 0,
    class: "tag neutral"
  };

  const _hoisted_87 = {
    key: 1,
    class: "tag neutral"
  };

  const _hoisted_88 = {
    key: 0,
    class: "answer-list"
  };

  const _hoisted_89 = {
    class: "answer-key"
  };

  const _hoisted_90 = {
    class: "answer-value"
  };

  const _hoisted_91 = {
    key: 0
  };

  const _hoisted_92 = {
    key: 1,
    class: "answer-item"
  };

  const _hoisted_93 = {
    class: "answer-value"
  };

  const _hoisted_94 = {
    key: 2,
    class: "answer-value"
  };

  const _hoisted_95 = {
    key: 0
  };

  const _hoisted_96 = {
    key: 3,
    class: "cap-mute"
  };

  const _hoisted_97 = {
    class: "grp"
  };

  const _hoisted_98 = {
    class: "row"
  };

  const _hoisted_99 = {
    class: "toolbar"
  };

  const _hoisted_100 = {
    class: "tag acc"
  };

  const _hoisted_101 = {
    class: "ent-top"
  };

  const _hoisted_102 = {
    class: "ent-ty"
  };

  const _hoisted_103 = {
    class: "ent-tm mono"
  };

  const _hoisted_104 = {
    key: 0,
    class: "cap-mute"
  };

  const _hoisted_105 = {
    class: "ent-a"
  };

  const _hoisted_106 = {
    key: 0,
    class: "ent-ops"
  };

  const _hoisted_107 = {
    class: "cap-mute"
  };

  const _hoisted_108 = {
    class: "standby"
  };

  const _hoisted_109 = {
    class: "cap-mute"
  };

  const _hoisted_110 = {
    key: 0,
    class: "grp"
  };

  const _hoisted_111 = {
    class: "row"
  };

  const _hoisted_112 = {
    class: "mono cap-mute"
  };

  const _hoisted_113 = {
    class: "switch-row"
  };

  const _hoisted_114 = [ "onClick", "aria-label" ];

  const _hoisted_115 = {
    class: "lbl",
    style: {
      flex: "1"
    }
  };

  const _hoisted_116 = {
    class: "cap-mute"
  };

  const _hoisted_117 = {
    class: "row"
  };

  const _hoisted_118 = {
    class: "mono cap-mute"
  };

  const _hoisted_119 = {
    class: "grp"
  };

  const _hoisted_120 = {
    class: "switch-row"
  };

  const _hoisted_121 = {
    class: "grp"
  };

  const _hoisted_122 = {
    class: "row"
  };

  const _hoisted_123 = {
    class: "cap-mute"
  };

  const _hoisted_124 = {
    key: 0,
    class: "alert"
  };

  const _hoisted_125 = {
    key: 1,
    class: "alert"
  };

  const _hoisted_126 = {
    class: "row"
  };

  const _hoisted_127 = [ "disabled" ];

  const _hoisted_128 = {
    key: 2,
    class: "cap-mute"
  };

  const _hoisted_129 = {
    class: "grp"
  };

  const _hoisted_130 = {
    class: "switch-row"
  };

  const _hoisted_131 = {
    class: "row"
  };

  const _hoisted_132 = {
    class: "mono cap-mute"
  };

  const _hoisted_133 = {
    class: "row"
  };

  const _hoisted_134 = {
    class: "cap-mute"
  };

  const _hoisted_135 = {
    class: "grp"
  };

  const _hoisted_136 = [ "onClick", "aria-label" ];

  const _hoisted_137 = {
    class: "lbl",
    style: {
      flex: "1"
    }
  };

  const _hoisted_138 = {
    class: "prev"
  };

  const _hoisted_139 = {
    class: "prow"
  };

  const _hoisted_140 = {
    class: "prow"
  };

  const _hoisted_141 = {
    class: "prow"
  };

  const _hoisted_142 = {
    class: "prow"
  };

  const _hoisted_143 = {
    key: 0,
    class: "alert"
  };

  const _hoisted_144 = {
    class: "prev"
  };

  const _hoisted_145 = {
    class: "prow"
  };

  const _hoisted_146 = {
    class: "toolbar"
  };

  const _hoisted_147 = {
    class: "cap-mute mono"
  };

  const _hoisted_148 = {
    class: "meter"
  };

  const _hoisted_149 = {
    key: 0,
    class: "alert"
  };

  const _hoisted_150 = {
    key: 1,
    class: "alert"
  };

  const _hoisted_151 = {
    key: 2,
    class: "cap-mute"
  };

  const _hoisted_152 = {
    key: 0,
    class: "alert"
  };

  const _hoisted_153 = {
    key: 1,
    class: "cap-mute"
  };

  const _hoisted_154 = {
    key: 4,
    class: "cap-mute"
  };

  const _hoisted_155 = {
    key: 5,
    class: "cap-mute"
  };

  const _hoisted_156 = {
    class: "ent-top"
  };

  const _hoisted_157 = {
    class: "ent-ty"
  };

  const _hoisted_158 = {
    key: 0,
    class: "ent-ty"
  };

  const _hoisted_159 = {
    key: 1,
    class: "ent-ty"
  };

  const _hoisted_160 = {
    class: "ent-tm"
  };

  const _hoisted_161 = [ "aria-label", "onClick" ];

  const _hoisted_162 = {
    class: "ent-a"
  };

  const _hoisted_163 = {
    key: 0,
    class: "ent-ops"
  };

  const _hoisted_164 = {
    class: "cap-mute"
  };

  const _hoisted_165 = {
    key: 6,
    class: "cap-mute"
  };

  const _hoisted_166 = {
    class: "statcard"
  };

  const _hoisted_167 = {
    class: "row"
  };

  const _hoisted_168 = {
    key: 0,
    class: "statgrid"
  };

  const _hoisted_169 = {
    key: 0
  };

  const _hoisted_170 = {
    key: 1
  };

  const _hoisted_171 = {
    key: 1,
    class: "cap-mute"
  };

  const _hoisted_172 = {
    key: 2,
    class: "cap-mute"
  };

  const _hoisted_173 = {
    key: 3,
    class: "cap-mute"
  };

  const _hoisted_174 = {
    key: 4,
    class: "cap-mute"
  };

  const _hoisted_175 = {
    class: "cap-mute"
  };

  const _hoisted_176 = {
    key: 5,
    class: "alert"
  };

  const _hoisted_177 = {
    class: "grp"
  };

  const _hoisted_178 = {
    class: "log-filter"
  };

  const _hoisted_179 = [ "onClick" ];

  const _hoisted_180 = {
    key: 0,
    class: "log-list"
  };

  const _hoisted_181 = {
    class: "log-time mono"
  };

  const _hoisted_182 = {
    class: "log-msg"
  };

  const _hoisted_183 = {
    key: 0,
    class: "log-repeat mono"
  };

  const _hoisted_184 = {
    key: 1,
    class: "cap-mute"
  };

  const _hoisted_185 = {
    class: "grp"
  };

  const _hoisted_186 = [ "disabled" ];

  const _hoisted_187 = {
    key: 0,
    class: "cap-mute"
  };

  const _hoisted_188 = {
    key: 0,
    class: "mono"
  };

  const _hoisted_189 = {
    key: 1,
    class: "mono"
  };

  const _hoisted_190 = {
    key: 1,
    class: "cap-mute"
  };

  const _hoisted_191 = {
    key: 1,
    class: "rule-meta"
  };

  const _hoisted_192 = {
    class: "rule-row"
  };

  const _hoisted_193 = {
    class: "rule-value"
  };

  const _hoisted_194 = {
    key: 0,
    class: "rule-row"
  };

  const _hoisted_195 = {
    class: "rule-value"
  };

  const _hoisted_196 = {
    key: 1,
    class: "rule-row"
  };

  const _hoisted_197 = {
    class: "rule-value"
  };

  const _hoisted_198 = {
    key: 2,
    class: "rule-row"
  };

  const _hoisted_199 = {
    class: "rule-value"
  };

  const _hoisted_200 = {
    key: 2,
    class: "cap-mute"
  };

  const _hoisted_201 = {
    class: "actbar"
  };

  const _hoisted_202 = {
    key: 0,
    class: "prev"
  };

  const _hoisted_203 = {
    class: "prow"
  };

  const _hoisted_204 = {
    class: "prow"
  };

  const _hoisted_205 = [ "disabled" ];

  const _hoisted_206 = [ "disabled" ];

  const _hoisted_207 = {
    key: 0,
    class: "prog"
  };

  const _hoisted_208 = {
    class: "stat"
  };

  const _hoisted_209 = {
    class: "ticks"
  };

  const _hoisted_210 = {
    key: 1,
    class: "toolbar"
  };

  const _hoisted_211 = [ "disabled" ];

  const _hoisted_212 = {
    key: 0,
    class: "toolbar"
  };

  const _hoisted_213 = {
    key: 1,
    class: "toolbar"
  };

  const _hoisted_214 = {
    key: 2,
    class: "toolbar"
  };

  const _hoisted_215 = [ "disabled" ];

  const _hoisted_216 = {
    class: "actbar-foot"
  };

  const _hoisted_217 = {
    class: "cap-mute mono"
  };

  const _hoisted_218 = {
    key: 4,
    class: "pop"
  };

  const _hoisted_219 = {
    class: "toolbar"
  };

  const _hoisted_220 = [ "disabled" ];

  const _hoisted_221 = [ "disabled" ];

  const _hoisted_222 = [ "disabled" ];

  const _hoisted_223 = {
    class: "toolbar"
  };

  const _hoisted_224 = [ "disabled" ];

  const _hoisted_225 = [ "disabled" ];

  const _hoisted_226 = {
    key: 2,
    class: "cap-mute"
  };

  const _hoisted_227 = {
    class: "home-user"
  };

  const _hoisted_228 = {
    class: "ava lg"
  };

  const _hoisted_229 = {
    class: "home-meta"
  };

  const _hoisted_230 = {
    class: "ctitle"
  };

  const _hoisted_231 = {
    key: 0,
    class: "cap-mute"
  };

  const _hoisted_232 = [ "disabled" ];

  const _hoisted_233 = [ "disabled" ];

  const _hoisted_234 = {
    key: 2,
    class: "cap-mute"
  };

  const _hoisted_235 = {
    class: "row"
  };

  const _hoisted_236 = {
    key: 0,
    class: "toolbar"
  };

  const _hoisted_237 = {
    class: "balance"
  };

  const _hoisted_238 = {
    key: 1,
    class: "cap-mute"
  };

  const _hoisted_239 = {
    key: 1,
    class: "cap-mute"
  };

  const _hoisted_240 = {
    key: 2,
    class: "toolbar"
  };

  const _hoisted_241 = [ "disabled" ];

  const _hoisted_242 = {
    key: 3,
    class: "cap-mute"
  };

  const _hoisted_243 = {
    key: 4,
    class: "cap-mute"
  };

  const _hoisted_244 = {
    class: "row sep-top"
  };

  const _hoisted_245 = {
    class: "cap-mute"
  };

  const _hoisted_246 = {
    key: 5,
    class: "captcha-cover",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "\u5b8c\u6210\u6ce8\u518c\u4eba\u673a\u9a8c\u8bc1"
  };

  const _hoisted_247 = {
    class: "captcha-card"
  };

  const AUTH_STALE_NOTE = "\u767b\u5f55\u672a\u901a\u8fc7\u9a8c\u8bc1 \xb7 \u6362\u8fc7\u6d4f\u89c8\u5668\u6216\u91cd\u88c5\u811a\u672c\u9700\u91cd\u767b\u4e00\u6b21";

  const SUBMIT_ACCEPTED_NOTE = "\u5df2\u70b9\u786e\u8ba4 \xb7 \u7ad9\u70b9\u6ca1\u62a5\u9519\u3002\u5377\u9762\u8981\u7b49\u9875\u9762\u5237\u65b0\u624d\u8f6c\u6001\uff0c\u4e0b\u6b21\u7ffb\u5230\u672c\u8282\u4f1a\u81ea\u52a8\u590d\u6838\u3002";

  const ANSWERING_EMPTY_TICKS = 10;

  const CACHE_LIST_LIMIT = 200;

  const HARVEST_RECHECK_MS = 3e4;

  const MAX_REPORTED_MISSING_PAGES = 8;

  const _sfc_main = vue.defineComponent({
    __name: "Panel",
    setup(__props) {
      var _a;
      const IS_DEV = false;
      const collapsed = vue.ref(getCollapsed());
      const expand = () => {
        switchPanel(false);
      };
      const collapse = () => {
        switchPanel(true);
      };
      const panelRef = vue.ref(null);
      const dragHandleRef = vue.ref(null);
      const dragState = vue.reactive(createPanelDragState());
      const launcherGesture = vue.reactive(createPanelLauncherGestureState());
      const pos = vue.ref(getPanelPosition());
      let panelResizeObserver = null;
      let pendingPanelResize = null;
      const panelStyle = vue.computed(() => pos.value ? {
        left: `${pos.value.x}px`,
        top: `${pos.value.y}px`,
        right: "auto",
        bottom: "auto"
      } : {});
      function readViewportSize() {
        const el = document.documentElement;
        const width = el.clientWidth;
        const height = el.clientHeight;
        if (width === 0 || height === 0) {
          return {
            width: window.innerWidth,
            height: window.innerHeight
          };
        }
        return {
          width: width,
          height: height
        };
      }
      function switchPanel(nextCollapsed) {
        var _a2;
        if (collapsed.value === nextCollapsed) return;
        const rect = (_a2 = panelRef.value) == null ? void 0 : _a2.getBoundingClientRect();
        pendingPanelResize = pos.value && rect ? {
          position: {
            x: rect.left,
            y: rect.top
          },
          panel: {
            width: rect.width,
            height: rect.height
          }
        } : null;
        collapsed.value = nextCollapsed;
        setCollapsed(nextCollapsed);
      }
      function reconcilePanelPosition(options = {}) {
        if (pos.value === null) return;
        const panelEl = panelRef.value;
        if (!panelEl) return;
        if (dragState.pointerId !== null) return;
        const rect = panelEl.getBoundingClientRect();
        const viewport = readViewportSize();
        const next = clampPanelPosition(pos.value, {
          width: rect.width,
          height: rect.height
        }, viewport);
        const changed = next.x !== pos.value.x || next.y !== pos.value.y;
        if (changed) pos.value = next;
        if (options.persist || changed) setPanelPosition(pos.value);
      }
      function beginDrag(event, interactive) {
        const panelEl = panelRef.value;
        const handle = event.currentTarget instanceof HTMLElement ? event.currentTarget : dragHandleRef.value;
        if (!panelEl || !handle) return;
        const rect = panelEl.getBoundingClientRect();
        const ok = beginPanelDrag(dragState, {
          pointerId: event.pointerId,
          isPrimary: event.isPrimary,
          pointerType: event.pointerType,
          button: event.button,
          clientX: event.clientX,
          clientY: event.clientY,
          rect: {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
          },
          interactive: interactive
        });
        if (!ok) return;
        event.preventDefault();
        try {
          handle.setPointerCapture(event.pointerId);
        } catch {
          endPanelDrag(dragState, event.pointerId);
        }
      }
      function startDrag(event) {
        beginDrag(event, isPanelDragInteractiveTarget(event.target));
      }
      function startBubbleDrag(event) {
        beginPanelLauncherGesture(launcherGesture);
        beginDrag(event, false);
      }
      function moveDrag(event) {
        const next = movePanelDrag(dragState, {
          pointerId: event.pointerId,
          clientX: event.clientX,
          clientY: event.clientY
        }, readViewportSize());
        if (next) pos.value = next;
      }
      function finishDrag(event) {
        var _a2;
        const result = endPanelDrag(dragState, event.pointerId);
        const handle = event.currentTarget instanceof HTMLElement ? event.currentTarget : dragHandleRef.value;
        if ((_a2 = handle == null ? void 0 : handle.hasPointerCapture) == null ? void 0 : _a2.call(handle, event.pointerId)) {
          try {
            handle.releasePointerCapture(event.pointerId);
          } catch {}
        }
        if (!result) return;
        if (collapsed.value && endPanelLauncherGesture(launcherGesture, result, event.type)) {
          expand();
        }
        reconcilePanelPosition({
          persist: true
        });
      }
      function activateLauncher(event) {
        if (!consumePanelLauncherActivation(launcherGesture, event.detail)) {
          event.preventDefault();
          return;
        }
        expand();
      }
      vue.watch(panelRef, (next, previous) => {
        if (previous && panelResizeObserver) panelResizeObserver.unobserve(previous);
        if (!next) return;
        if (pendingPanelResize) {
          const rect = next.getBoundingClientRect();
          pos.value = remapPanelPosition(pendingPanelResize.position, pendingPanelResize.panel, {
            width: rect.width,
            height: rect.height
          }, readViewportSize());
          pendingPanelResize = null;
          setPanelPosition(pos.value);
        }
        reconcilePanelPosition();
        if (typeof ResizeObserver === "undefined") return;
        if (!panelResizeObserver) {
          panelResizeObserver = new ResizeObserver(() => {
            reconcilePanelPosition();
          });
        }
        panelResizeObserver.observe(next);
      }, {
        flush: "post"
      });
      function onPanelKeydown(e) {
        if (e.key === "F9") {
          switchPanel(!collapsed.value);
        }
      }
      function onWindowResize() {
        reconcilePanelPosition();
      }
      const usageEvents = new EventQueue({
        transport: aiaskTransport,
        baseUrl: BACKEND_BASE_URL,
        storage: usageEventStorage,
        identity: () => ({
          clientId: getClientId(),
          platform: platform.value,
          scriptVersion: SCRIPT_VERSION,
          engineVersion: RULE_ENGINE_VERSION
        })
      });
      function trackUsage(event) {
        usageEvents.push(event);
      }
      const courseStopReporter = createCourseStopReporter(trackUsage);
      function onPageHide() {
        localAnswerCache.flush();
        usageEvents.persist();
      }
      const loggedIn = vue.ref(!!getToken());
      const authStale = vue.ref(false);
      const SUBMIT_SKIP_REASON = {
        "clicked-entry": "\u70b9\u5f00\u4e86\u63d0\u4ea4\uff0c\u4f46\u6ca1\u7b49\u5230\u7ad9\u70b9\u7684\u786e\u8ba4\u6846",
        "confirm-unverified": "\u786e\u8ba4\u6846\u6ca1\u5173\u6216\u7ad9\u70b9\u62a5\u4e86\u9519\uff0c\u5377\u5b50\u591a\u534a\u6ca1\u4ea4\u51fa\u53bb",
        "below-threshold": "\u672a\u8fbe\u9608\u503c\uff0c\u53ea\u6682\u5b58",
        "unrecognized-questions": "\u5377\u9762\u4e0a\u6709\u9898\u6ca1\u88ab\u8bc6\u522b\u51fa\u6765\uff0c\u53ea\u6682\u5b58 \xb7 \u8fd9\u7c7b\u9898\u76ee\u5f53\u524d\u8fd8\u4e0d\u652f\u6301\uff0c\u8c03\u9608\u503c\u4e5f\u6ca1\u7528",
        "exam-page": "\u8003\u8bd5\u9875\u6c38\u4e0d\u81ea\u52a8\u4ea4\u5377",
        "no-entry": "\u672c\u9875\u6ca1\u6709\u53ef\u8bc6\u522b\u7684\u63d0\u4ea4\u5165\u53e3",
        "click-failed": "\u63d0\u4ea4\u5165\u53e3\u70b9\u4e0d\u52a8",
        "site-quota": "\u7ad9\u70b9\u8fd9\u6b21\u52a0\u8f7d\u7684\u63d0\u4ea4\u6b21\u6570\u5df2\u7528\u5b8c \xb7 \u5237\u65b0\u9875\u9762\u540e\u53ef\u518d\u4ea4",
        "site-locked": "\u7ad9\u70b9\u8fd9\u4efd\u5377\u5b50\u5df2\u5728\u63d0\u4ea4\u4e2d\u6216\u5df2\u4ea4\u8fc7 \xb7 \u5237\u65b0\u9875\u9762\u540e\u53ef\u518d\u4ea4",
        "no-page-window": "\u8fd9\u4e00\u523b\u8bfb\u4e0d\u5230\u7b54\u9898\u5e27\uff08\u591a\u534a\u6b63\u5728\u91cd\u8f7d\uff09\xb7 \u4e0b\u4e00\u8f6e\u518d\u8bd5"
      };
      function countAnswerable() {
        const selector = courseConfig().chapterTestAnswerable;
        let total = 0;
        for (const doc of readableDocuments(document)) {
          try {
            total += doc.querySelectorAll(selector).length;
          } catch {}
        }
        return total > 0 ? total : void 0;
      }
      const submitOutcome = vue.ref(null);
      const submitNote = vue.computed(() => {
        const outcome = submitOutcome.value;
        if (outcome === "submitted") return "\u5df2\u63d0\u4ea4 \xb7 \u5377\u9762\u5df2\u8f6c\u4e3a\u5df2\u5b8c\u6210\u3002";
        if (outcome === "confirm-accepted") return SUBMIT_ACCEPTED_NOTE;
        if (!outcome || outcome === "off" || outcome === "no-items") return "\u9875\u9762\u672a\u63d0\u4ea4\uff0c\u53ef\u81ea\u884c\u68c0\u67e5\u540e\u518d\u4ea4\u3002";
        return `\u672a\u63d0\u4ea4 \xb7 ${SUBMIT_SKIP_REASON[outcome]}\u3002\u5df2\u586b\u7684\u90e8\u5206\u5df2\u6682\u5b58\u3002`;
      });
      const tab = vue.ref("home");
      const announcement = vue.ref(null);
      const announcementReadSeq = vue.ref(getAnnouncementReadSeq());
      const announcementAutoOpenedSeq = vue.ref(getAnnouncementAutoOpenedSeq());
      const announcementUnread = vue.computed(() => !!announcement.value && announcement.value.seq > announcementReadSeq.value);
      const announcementTime = vue.computed(() => {
        var _a2;
        const iso = (_a2 = announcement.value) == null ? void 0 : _a2.updatedAt;
        return iso ? new Date(iso).toLocaleString("zh-CN", {
          dateStyle: "short",
          timeStyle: "short"
        }) : "";
      });
      const dismissAnnouncement = () => {
        var _a2;
        const seq = (_a2 = announcement.value) == null ? void 0 : _a2.seq;
        if (seq === void 0) return;
        announcementReadSeq.value = seq;
        setAnnouncementReadSeq(seq);
      };
      const openAnnouncement = () => {
        tab.value = "home";
      };
      async function loadAnnouncement() {
        const result = await fetchAnnouncement(ruleTransport, BACKEND_BASE_URL);
        if (result.status === "failed") {
          pushLog("\u516c\u544a\u83b7\u53d6\u5931\u8d25 \xb7 \u672c\u6b21\u4e0d\u5c55\u793a\u516c\u544a", "warning");
          return;
        }
        announcement.value = result.announcement;
        if (!result.announcement) {
          pushLog("\u516c\u544a \xb7 \u670d\u52a1\u7aef\u6682\u65e0\u516c\u544a", "info");
          return;
        }
        pushLog(`\u6536\u5230\u516c\u544a \xb7 ${result.announcement.title}`, "info");
        if (result.announcement.level === "critical" && result.announcement.seq > announcementReadSeq.value && result.announcement.seq > announcementAutoOpenedSeq.value) {
          announcementAutoOpenedSeq.value = result.announcement.seq;
          setAnnouncementAutoOpenedSeq(result.announcement.seq);
          expand();
        }
      }
      const accountOpen = vue.ref(false);
      const toggleAccount = () => {
        accountOpen.value = !accountOpen.value;
        if (accountOpen.value) void refreshMe();
      };
      const closeAccount = () => {
        accountOpen.value = false;
      };
      const avatarInitial = vue.computed(() => accountName.value ? [ ...accountName.value ][0].toUpperCase() : "");
      const systemSub = vue.ref("general");
      const goCacheManage = () => {
        tab.value = "system";
        systemSub.value = "cache";
      };
      const TABS = [ {
        k: "home",
        l: "\u9996\u9875"
      }, {
        k: "ask",
        l: "\u7b54\u9898"
      }, {
        k: "harvest",
        l: "\u6536\u5f55"
      }, {
        k: "system",
        l: "\u7cfb\u7edf"
      } ];
      const SYSTEM_SEGS = [ {
        k: "general",
        l: "\u901a\u7528"
      }, {
        k: "course",
        l: "\u8bfe\u7a0b",
        feature: "course-automation"
      }, {
        k: "cache",
        l: "\u7f13\u5b58"
      }, {
        k: "diag",
        l: "\u8bca\u65ad"
      } ];
      const QUESTION_TYPE_LABELS = {
        [protocol.QuestionType.Single]: "\u5355\u9009",
        [protocol.QuestionType.Multiple]: "\u591a\u9009",
        [protocol.QuestionType.Judge]: "\u5224\u65ad",
        [protocol.QuestionType.Fill]: "\u586b\u7a7a"
      };
      const accountName = vue.ref(getUsername());
      const cardSession = vue.ref(getCardSession());
      const authMode = vue.ref("account");
      const username = vue.ref("");
      const password = vue.ref("");
      const cardLoginCode = vue.ref("");
      const email = vue.ref("");
      const authMsg = vue.ref("");
      const authing = vue.ref(false);
      const captchaOpen = vue.ref(false);
      const captchaFrame = vue.ref(null);
      const captchaState = vue.ref("");
      const captchaUrl = `${BACKEND_BASE_URL}/captcha`;
      let captchaRequest = null;
      let captchaPending = null;
      function finishCaptcha(error, token) {
        const pending = captchaPending;
        captchaPending = null;
        captchaRequest = null;
        captchaOpen.value = false;
        captchaState.value = "";
        if (!pending) return;
        if (error || !token) pending.reject(error ?? new Error("challenge-failed")); else pending.resolve(token);
      }
      function requestRegistrationCaptcha() {
        if (captchaPending) return Promise.reject(new Error("challenge-busy"));
        captchaState.value = protocol.randomUuid();
        captchaOpen.value = true;
        return new Promise((resolve, reject) => {
          captchaPending = {
            resolve: resolve,
            reject: reject
          };
        });
      }
      function onCaptchaFrameLoad() {
        var _a2;
        if (captchaRequest || !captchaPending || !captchaState.value) return;
        const frameWindow = (_a2 = captchaFrame.value) == null ? void 0 : _a2.contentWindow;
        if (!frameWindow) {
          finishCaptcha(new Error("challenge-unavailable"));
          return;
        }
        captchaRequest = core.createCaptchaFrameRequest({
          frameWindow: frameWindow,
          targetOrigin: new URL(BACKEND_BASE_URL).origin,
          state: captchaState.value,
          timeoutMs: 18e4
        });
        void captchaRequest.result.then(token => finishCaptcha(null, token), error => finishCaptcha(error instanceof Error ? error : new Error("challenge-failed")));
      }
      function cancelCaptcha() {
        if (captchaRequest) captchaRequest.cancel(); else finishCaptcha(new Error("cancelled"));
      }
      async function doAuth(mode) {
        authing.value = true;
        authMsg.value = "";
        let captchaToken;
        if (mode === "register") {
          try {
            captchaToken = await requestRegistrationCaptcha();
          } catch {
            authMsg.value = "\u4eba\u673a\u9a8c\u8bc1\u672a\u5b8c\u6210\uff0c\u53ef\u91cd\u8bd5\u3002";
            authing.value = false;
            return;
          }
        }
        const r = await authenticate(aiaskTransport, mode, username.value.trim(), password.value, BACKEND_BASE_URL, captchaToken, email.value);
        if (r.token) {
          setToken(r.token);
          setUsername(username.value.trim());
          setCardSession(false);
          accountName.value = username.value.trim();
          cardSession.value = false;
          loggedIn.value = true;
          authStale.value = false;
          password.value = "";
          email.value = "";
          tab.value = loaded && list.value.length > 0 ? "ask" : "home";
          pushLog(mode === "register" ? "\u6ce8\u518c\u6210\u529f" : "\u767b\u5f55\u6210\u529f", "info");
          void refreshMe().then(() => {
            if (mode === "register" && balance.value != null) pushLog(`\u5df2\u9001 ${balance.value} \u5206\uff0c\u53ef\u4ee5\u76f4\u63a5\u5f00\u59cb\u7b54\u9898`, "info");
          });
          if (noteAction.value === "login") {
            note2.value = "";
            noteAction.value = "";
          }
        } else authMsg.value = r.message;
        authing.value = false;
      }
      async function doCardAuth() {
        if (authing.value) return;
        authing.value = true;
        authMsg.value = "";
        const r = await authenticateCard(aiaskTransport, cardLoginCode.value, BACKEND_BASE_URL);
        if (r.token) {
          setToken(r.token);
          setUsername("\u5361\u5bc6");
          setCardSession(true);
          accountName.value = "\u5361\u5bc6";
          cardSession.value = true;
          loggedIn.value = true;
          authStale.value = false;
          cardLoginCode.value = "";
          tab.value = loaded && list.value.length > 0 ? "ask" : "home";
          pushLog("\u5361\u5bc6\u767b\u5f55\u6210\u529f", "info");
          void refreshMe();
          if (noteAction.value === "login") {
            note2.value = "";
            noteAction.value = "";
          }
        } else authMsg.value = r.message;
        authing.value = false;
      }
      async function devAutoLogin() {
        return;
      }
      const markAuthStale = () => {
        authStale.value = true;
        if (cardSession.value) authMode.value = "card";
        if (!username.value) username.value = accountName.value;
      };
      const logout = () => {
        clearToken();
        setCardSession(false);
        clearLastBalance();
        balance.value = null;
        loggedIn.value = false;
        authStale.value = false;
        cardSession.value = false;
        authMode.value = "account";
        cardLoginCode.value = "";
        username.value = accountName.value;
        pushLog("\u5df2\u9000\u51fa\u767b\u5f55", "info");
        discard();
      };
      const cardCode = vue.ref("");
      const redeemNote = vue.ref("");
      const redeeming = vue.ref(false);
      const balance = vue.ref(getLastBalance());
      const emailBound = vue.ref(null);
      async function refreshMe() {
        if (!getToken()) return;
        const snapshot = await fetchMe(aiaskTransport, BACKEND_BASE_URL);
        if (!snapshot) return;
        balance.value = snapshot.balance;
        setLastBalance(snapshot.balance);
        accountName.value = snapshot.username;
        emailBound.value = snapshot.emailBound;
        authStale.value = false;
      }
      async function doRedeem() {
        const code = cardCode.value.trim();
        if (!code || redeeming.value) return;
        const token = getToken();
        if (!token) {
          redeemNote.value = "\u9700\u5148\u767b\u5f55\u3002";
          return;
        }
        redeeming.value = true;
        redeemNote.value = "";
        const r = await redeemCard(aiaskTransport, code, BACKEND_BASE_URL);
        if (typeof r.balance === "number") {
          balance.value = r.balance;
          setLastBalance(r.balance);
          authStale.value = false;
          session == null ? void 0 : session.resumePaidAfterCredit();
          cardCode.value = "";
          redeemNote.value = `\u5151\u6362\u6210\u529f \xb7 \u4f59\u989d ${r.balance} \u5206`;
          if (noteAction.value === "account") {
            note2.value = "";
            noteAction.value = "";
          }
          pushLog(`\u5361\u5bc6\u5151\u6362\u6210\u529f \xb7 \u4f59\u989d ${r.balance}`, "info");
        } else {
          redeemNote.value = r.message;
          pushLog(`\u5361\u5bc6\u5151\u6362\u5931\u8d25 \xb7 ${r.message}`, "warning");
          if (r.unauthorized) {
            markAuthStale();
            note2.value = AUTH_STALE_NOTE;
            noteAction.value = "login";
          }
        }
        redeeming.value = false;
      }
      const settings = vue.reactive(getSettings());
      const persist = () => setSettings({
        autoFill: true,
        delayMs: settings.delayMs,
        reportHealth: settings.reportHealth,
        reportUsage: settings.reportUsage,
        freeFirst: settings.freeFirst,
        courseAuto: settings.courseAuto,
        coursePlaybackRate: settings.coursePlaybackRate,
        courseTaskToggles: {
          ...settings.courseTaskToggles
        },
        autoStart: settings.autoStart,
        autoSubmit: settings.autoSubmit,
        autoSubmitThreshold: settings.autoSubmitThreshold,
        randomFallback: settings.randomFallback
      });
      const makeToggle = (key, msg, after) => () => {
        settings[key] = !settings[key];
        persist();
        after == null ? void 0 : after();
        if (msg) pushLog(settings[key] ? msg.on : msg.off, settings[key] && msg.warnOn ? "warning" : "info");
      };
      const toggleReport = () => {
        const next = !settings.reportUsage;
        settings.reportUsage = next;
        settings.reportHealth = next;
        persist();
        if (next) usageEvents.enable(); else usageEvents.disable();
      };
      let mediaRunner = null;
      const mediaState = vue.ref(null);
      const MEDIA_STATE_TEXT = {
        idle: "\u672c\u9875\u6ca1\u6709\u53ef\u64ad\u653e\u7684\u4efb\u52a1\u70b9",
        loading: "\u5185\u5bb9\u52a0\u8f7d\u4e2d \xb7 \u7b49\u5b83\u5c31\u7eea",
        playing: "\u6b63\u5728\u64ad\u653e",
        finished: "\u672c\u4efb\u52a1\u70b9\u5df2\u529e\u5b8c",
        reading: "\u6b63\u5728\u9605\u8bfb\u6587\u6863\u4efb\u52a1\u70b9",
        advancing: "\u5207\u5230\u4e0b\u4e00\u4e2a\u4efb\u52a1\u70b9",
        "advancing-section": "\u672c\u8282\u8fc7\u5b8c \xb7 \u5207\u4e0b\u4e00\u8282",
        "section-done": "\u672c\u8282\u8fc7\u5b8c \xb7 \u6ca1\u6709\u4e0b\u4e00\u8282",
        "all-done": "\u672c\u8282\u4efb\u52a1\u70b9\u5df2\u5168\u90e8\u5b8c\u6210",
        "course-done": "\u5168\u90e8\u7ae0\u8282\u4efb\u52a1\u70b9\u5df2\u5b8c\u6210",
        hyperlink: "\u5df2\u70b9\u5f00\u94fe\u63a5\u4efb\u52a1\u70b9",
        starting: "\u5df2\u70b9\u5f00\u64ad\u653e\u5668 \xb7 \u7b49\u5b83\u8d77\u64ad",
        "advance-failed": "\u5207\u4e0b\u4e00\u8282\u6ca1\u751f\u6548 \xb7 \u624b\u52a8\u7ffb\u9875\u540e\u518d\u6253\u5f00",
        "face-recognition": "\u51fa\u73b0\u4eba\u8138\u8bc6\u522b \xb7 \u4f60\u8bc6\u522b\u5b8c\u81ea\u52a8\u63a5\u7740\u64ad",
        "media-error": "\u64ad\u653e\u5668\u62a5\u9519 \xb7 \u5df2\u505c\u4e0b\u7b49\u4f60\u5904\u7406",
        "video-quiz": "\u89c6\u9891\u91cc\u5f39\u51fa\u9898\u76ee \xb7 \u4f60\u7b54\u5b8c\u81ea\u52a8\u63a5\u7740\u64ad",
        "not-playing": "\u6ca1\u80fd\u81ea\u52a8\u64ad\u8d77\u6765 \xb7 \u624b\u52a8\u70b9\u4e00\u4e0b\u64ad\u653e\u5668",
        locked: "\u95ef\u5173\u6a21\u5f0f\u5361\u4f4f \xb7 \u5148\u624b\u52a8\u5b8c\u6210\u524d\u7f6e\u4efb\u52a1\u70b9",
        "budget-exhausted": "\u5df2\u8fbe\u5355\u8282\u65f6\u957f\u4e0a\u9650 \xb7 \u5df2\u505c\u6b62"
      };
      const mediaStatusText = vue.computed(() => {
        const state = mediaState.value;
        if (!state) return "\u672a\u5f00\u542f";
        if (state.kind === "reading") return `\u6b63\u5728\u9605\u8bfb\u6587\u6863\u4efb\u52a1\u70b9 \xb7 ${state.summary.frames} \u5e27 / \u62c9\u5230\u5e95 ${state.summary.scrolled} \u5904`;
        if (state.kind === "dwelling") return `\u957f\u65f6\u9605\u8bfb\u9a7b\u7559 \xb7 \u8fd8\u5269 ${Math.ceil(state.remainingMs / 1e3)} \u79d2`;
        if (state.kind === "ppt-slide") return `\u8bfe\u4ef6\u7ffb\u9875\u4e2d \xb7 \u5171 ${state.total} \u5f20`;
        if (state.kind === "answering" && !state.frameLoaded) return "\u7ae0\u8282\u6d4b\u9a8c\u5728\u53e6\u4e00\u4e2a\u4efb\u52a1\u70b9\u4e0a \xb7 \u6b63\u5728\u5207\u8fc7\u53bb";
        if (state.kind === "answering") return list.value.length > 0 ? `\u8f6e\u5230\u7ae0\u8282\u6d4b\u9a8c \xb7 \u7b54\u9898\u5f15\u64ce\u5df2\u63a5\u624b ${list.value.length} \u9898` : "\u8f6e\u5230\u7ae0\u8282\u6d4b\u9a8c \xb7 \u7b54\u9898\u5f15\u64ce\u8fd8\u6ca1\u8bc6\u522b\u5230\u9898\u76ee";
        if (state.kind === "advancing-chapter") return `\u5207\u5230\u4e0b\u4e00\u7ae0 \xb7 ${state.name}`;
        if (state.kind === "section-stalled") return `\u672c\u8282\u8fd8\u5269 ${state.unfinished} \u4e2a\u4efb\u52a1\u70b9\u7ad9\u70b9\u6ca1\u8ba4 \xb7 \u80fd\u505a\u7684\u90fd\u505a\u4e86`;
        return MEDIA_STATE_TEXT[state.kind === "blocked" ? state.reason : state.kind] ?? "\u672a\u77e5\u72b6\u6001";
      });
      const courseProgress2 = vue.ref(null);
      const courseStatusText = vue.computed(() => courseStatusLine(mediaState.value, courseProgress2.value) || mediaStatusText.value);
      const coursePositionText = vue.computed(() => coursePositionLine(courseProgress2.value));
      const courseCountText = vue.computed(() => courseCountLine(courseProgress2.value));
      const courseSkipped = vue.computed(() => {
        var _a2, _b;
        return ((_b = (_a2 = courseProgress2.value) == null ? void 0 : _a2.section) == null ? void 0 : _b.skipped) ?? [];
      });
      const legacyCourseUrl = legacyStudentstudyUpgradeUrl(location);
      const onCourseStudyPage = vue.computed(() => isCourseStudyUrl(platform.value, location));
      const switchToNewCoursePage = () => {
        if (legacyCourseUrl) location.href = legacyCourseUrl;
      };
      let answeringTask = "";
      let answeringTicksSeen = 0;
      function onAnsweringTick(state) {
        if (state.taskKey !== answeringTask) {
          answeringTask = state.taskKey;
          answeringTicksSeen = 0;
          roundStarted.value = false;
        }
        answeringTicksSeen = state.ticks ?? 0;
        if (running.value) return;
        if (state.ticks === ANSWERING_TICKS_BUDGET) {
          pushLog(`\u8ba9\u8def\u7a97\u53e3\u5df2\u7528\u5b8c \xb7 ${state.name} \u7b49\u4e0d\u5230\u53ef\u7b54\u7684\u9898\u76ee \xb7 \u5df2\u8df3\u8fc7\uff0c\u7ee7\u7eed\u540e\u7eed\u4efb\u52a1`, "warning");
          return;
        }
        if (!state.frameLoaded || loaded) return;
        if (state.ticks === ANSWERING_EMPTY_TICKS) pushLog(`${state.name} \u6ca1\u6709\u672c\u811a\u672c\u80fd\u7b54\u7684\u9898\uff08\u9898\u578b\u53ef\u80fd\u4e0d\u652f\u6301\uff09\xb7 \u5df2\u8df3\u8fc7\uff0c\u7ee7\u7eed\u540e\u7eed\u4efb\u52a1`, "warning");
        pageChangeScheduler == null ? void 0 : pageChangeScheduler.notify();
      }
      const syncMediaTask = () => {
        if (!settings.courseAuto || !hasFeature("course-automation") || !onCourseStudyPage.value || !courseAdapter) {
          mediaRunner == null ? void 0 : mediaRunner.stop();
          mediaRunner = null;
          mediaState.value = null;
          courseProgress2.value = null;
          pauseCourseMedia(document);
          return;
        }
        if (mediaRunner) return;
        syncCourseConfig();
        courseStopReporter.reset();
        mediaRunner = runMediaTask(document, {
          adapter: courseAdapter,
          memoryGuard: createMemoryGuard({
            sample: readUsedJsHeap(window)
          }),
          onMemoryPressure: usedBytes => {
            const mb = Math.round(usedBytes / 1048576);
            pushLog(`\u5185\u5b58\u5360\u7528 ${mb} MB \xb7 \u6574\u9875\u5237\u65b0\u540e\u81ea\u52a8\u7ee7\u7eed\uff08\u8d85\u661f\u7ae0\u6d4b\u9875\u7684\u5df2\u77e5\u6cc4\u6f0f\uff09`, "warning");
            window.location.reload();
          },
          get playbackRate() {
            return settings.coursePlaybackRate;
          },
          isAnsweringDone: taskKey => taskKey === answeringTask && (runDone.value || !loaded && answeringTicksSeen >= ANSWERING_EMPTY_TICKS),
          isKindEnabled: kind => {
            const key = toggleForKind(kind);
            return key === null || settings.courseTaskToggles[key] !== false;
          },
          onSurvey: report => {
            pushLog(`\u672c\u8282\u76d8\u70b9 \xb7 ${report.frames} \u5e27 \xb7 \u7ad9\u70b9\u6570\u636e${report.authoritative ? `\u5df2\u8bfb\u5230 ${report.declared} \u4e2a\u4efb\u52a1\u70b9` : "\u672a\u8bfb\u5230"} \xb7 \u8ba4\u51fa ${report.kinds.length} \u4e2a\uff08${report.kinds.join("\u3001") || "\u65e0"}\uff09\xb7 \u5f85\u529e ${report.pending}`, report.authoritative ? "info" : "warning");
            for (const item of report.skipped) {
              const label = item.name === KIND_LABEL[item.kind] ? KIND_LABEL[item.kind] : `${KIND_LABEL[item.kind]}\u300c${item.name}\u300d`;
              pushLog(`\u8df3\u8fc7 ${label} \xb7 ${item.reason === "media-ended" ? "\u672c\u9875\u5a92\u4f53\u5df2\u64ad\u5b8c" : TASK_SKIP_LABEL[item.reason]}`, "info");
            }
          },
          onState: state => {
            mediaState.value = state;
            if (state.kind === "answering") onAnsweringTick(state);
            if (courseStopReporter.observe(state)) courseProgress2.value = null;
            if (state.kind === "reading") pushLog(`\u6587\u6863\u4efb\u52a1\u70b9 \xb7 \u626b\u5230 ${state.summary.frames} \u5e27 \xb7 \u62c9\u5230\u5e95 ${state.summary.scrolled} \u5904 \xb7 \u7ffb\u9875 ${state.summary.pagers} \u6b21`, state.summary.scrolled || state.summary.pagers ? "info" : "warning");
            if (state.kind === "section-stalled") pushLog(`\u672c\u8282\u4ecd\u6709 ${state.unfinished} \u4e2a\u4efb\u52a1\u70b9\u672a\u88ab\u7ad9\u70b9\u8ba4\u53ef \xb7 ${state.names.join("\u3001")}`, "warning");
            if (state.kind === "course-done") pushLog("\u4fa7\u680f\u6240\u6709\u7ae0\u8282\u7684\u672a\u5b8c\u6210\u8ba1\u6570\u5df2\u5f52\u96f6", "info");
          },
          onProgress: progress => {
            courseProgress2.value = progress;
          }
        });
      };
      const GENERAL_SWITCHES = [ {
        key: "freeFirst",
        label: "\u514d\u8d39\u9898\u5e93\u4f18\u5148",
        hint: "\u5148\u67e5\u514d\u8d39\u6e90\uff0c\u672a\u547d\u4e2d\u518d\u67e5\u4ed8\u8d39\u6e90",
        toggle: makeToggle("freeFirst")
      }, {
        key: "autoStart",
        label: "\u68c0\u6d4b\u5230\u9898\u76ee\u81ea\u52a8\u5f00\u59cb\u7b54\u9898",
        hint: "\u547d\u4e2d\u4ed8\u8d39\u9898\u5e93\u624d\u6263\u5206\u3002\u5173\u7740\u65f6\u68c0\u6d4b\u5230\u9898\u76ee\u53ea\u5207\u5230\u7b54\u9898\u9875\uff0c\u7b49\u4f60\u6309\u300c\u5f00\u59cb\u7b54\u9898\u300d\u3002",
        toggle: makeToggle("autoStart", {
          on: "\u5df2\u5f00\u542f\u68c0\u6d4b\u5230\u9898\u76ee\u81ea\u52a8\u5f00\u59cb\u7b54\u9898",
          off: "\u5df2\u5173\u95ed\u81ea\u52a8\u5f00\u59cb\u7b54\u9898",
          warnOn: true
        })
      }, {
        key: "randomFallback",
        label: "\u65e0\u7b54\u6848\u65f6\u968f\u673a\u4f5c\u7b54",
        hint: "\u4ec5\u5355\u9009\u4e0e\u5224\u65ad\uff0c\u5176\u4f59\u9898\u578b\u7559\u7a7a\u3002\u968f\u673a\u7b54\u6848\u4e0d\u8fdb\u672c\u5730\u7f13\u5b58\uff0c\u4e5f\u4e0d\u7b97\u63d0\u4ea4\u9608\u503c\u91cc\u7684\u53ef\u4fe1\u547d\u4e2d\u3002",
        toggle: makeToggle("randomFallback", {
          on: "\u5df2\u5f00\u542f\u65e0\u7b54\u6848\u968f\u673a\u4f5c\u7b54 \xb7 \u4ec5\u5355\u9009\u4e0e\u5224\u65ad",
          off: "\u5df2\u5173\u95ed\u968f\u673a\u4f5c\u7b54",
          warnOn: true
        })
      }, {
        key: "autoSubmit",
        label: "\u6574\u5377\u7b54\u5b8c\u81ea\u52a8\u63d0\u4ea4",
        hint: "\u8003\u8bd5\u9875\u6c38\u4e0d\u81ea\u52a8\u4ea4\u5377\u2014\u2014\u4ea4\u5377\u64a4\u4e0d\u56de\u6765\u3002",
        toggle: makeToggle("autoSubmit", {
          on: "\u5df2\u5f00\u542f\u6574\u5377\u7b54\u5b8c\u81ea\u52a8\u63d0\u4ea4 \xb7 \u8003\u8bd5\u9875\u9664\u5916",
          off: "\u5df2\u5173\u95ed\u81ea\u52a8\u63d0\u4ea4",
          warnOn: true
        })
      } ];
      const taskToggles = TASK_TOGGLES;
      const taskToggleLabel = TOGGLE_LABEL;
      const toggleTaskKind = key => {
        settings.courseTaskToggles[key] = !settings.courseTaskToggles[key];
        persist();
        pushLog(`${TOGGLE_LABEL[key]}\u4efb\u52a1\u70b9\u5df2${settings.courseTaskToggles[key] ? "\u5f00\u542f" : "\u5173\u95ed"}`, "info");
      };
      const toggleCourseAuto = makeToggle("courseAuto", {
        on: "\u5df2\u5f00\u542f\u4efb\u52a1\u70b9\u81ea\u52a8\u64ad\u653e",
        off: "\u5df2\u5173\u95ed\u4efb\u52a1\u70b9\u81ea\u52a8\u64ad\u653e"
      }, syncMediaTask);
      function openCourseSettings() {
        tab.value = "system";
        systemSub.value = "course";
      }
      const PLAYBACK_RATES = [ 1, 1.5, 2 ];
      function cyclePlaybackRate() {
        const index = PLAYBACK_RATES.indexOf(settings.coursePlaybackRate);
        settings.coursePlaybackRate = PLAYBACK_RATES[(index + 1) % PLAYBACK_RATES.length] ?? 1;
        persist();
      }
      function skipReasonLabel(reason) {
        if (reason === "media-ended") return "\u672c\u9875\u5a92\u4f53\u5df2\u64ad\u5b8c";
        return TASK_SKIP_LABEL[reason];
      }
      const localCacheCount = vue.ref(localAnswerCache.size());
      const cachePersistFailed = vue.ref(localAnswerCache.hasPersistFailure());
      const syncCacheCount = () => {
        localCacheCount.value = localAnswerCache.size();
        const failed = localAnswerCache.hasPersistFailure();
        if (failed && !cachePersistFailed.value) pushLog("\u672c\u5730\u7f13\u5b58\u5199\u5165\u5931\u8d25 \xb7 \u6700\u8fd1\u7684\u6536\u5f55\u53ef\u80fd\u6ca1\u6709\u843d\u76d8", "warning");
        cachePersistFailed.value = failed;
      };
      const cacheNearWarn = vue.computed(() => localCacheCount.value >= CACHE_WARN_ENTRIES * .8);
      const cacheOverWarn = vue.computed(() => localCacheCount.value > CACHE_WARN_ENTRIES);
      const harvestedCount = vue.ref(0);
      const harvestedList = vue.ref([]);
      const cacheEntries = vue.ref(localAnswerCache.list());
      const cacheQuery = vue.ref("");
      const cacheImportPreview = vue.ref(null);
      const pendingImportText = vue.ref("");
      const cacheNote = vue.ref("");
      const cacheClearPending = vue.ref(false);
      const refreshCache = () => {
        cacheEntries.value = localAnswerCache.list();
        syncCacheCount();
      };
      const importedNeverHit = vue.computed(() => {
        const imported = cacheEntries.value.filter(e => e.importedAt > 0);
        return {
          total: imported.length,
          neverHit: imported.filter(e => !e.lastHitAt).length
        };
      });
      const matchedCache = vue.computed(() => {
        const q = cacheQuery.value.trim().toLowerCase();
        if (!q) return cacheEntries.value;
        return cacheEntries.value.filter(e => e.stem.toLowerCase().includes(q) || e.values.join(" ").toLowerCase().includes(q) || e.options.join(" ").toLowerCase().includes(q));
      });
      const filteredCache = vue.computed(() => matchedCache.value.slice(0, CACHE_LIST_LIMIT));
      const removeCacheEntry = unitHash => {
        localAnswerCache.remove(unitHash);
        refreshCache();
      };
      const exportCache = () => {
        downloadText(`aiask-cache-${Date.now()}.json`, localAnswerCache.exportJson());
      };
      const PARSE_IMPORT_URL = `${protocol.IMPORT_BRIDGE_ORIGIN}${IMPORT_BRIDGE_PATHNAME}`;
      const pickImportFile = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        input.onchange = async () => {
          var _a2;
          const file = (_a2 = input.files) == null ? void 0 : _a2[0];
          if (!file) return;
          try {
            const text = await file.text();
            cacheImportPreview.value = localAnswerCache.previewImport(text);
            pendingImportText.value = text;
            cacheNote.value = "";
          } catch {
            cacheImportPreview.value = null;
            pendingImportText.value = "";
            cacheNote.value = "\u8bfb\u4e0d\u51fa\u8fd9\u4e2a\u6587\u4ef6\uff0c\u5b83\u9700\u8981\u662f\u7231\u95ee\u7b54\u5bfc\u51fa\u7684 JSON\u3002";
          }
        };
        input.click();
      };
      const confirmImport = () => {
        const text = pendingImportText.value;
        if (!text) return;
        let fresh = null;
        try {
          fresh = localAnswerCache.previewImport(text);
        } catch {
          cacheImportPreview.value = null;
          pendingImportText.value = "";
          cacheNote.value = "\u5bfc\u5165\u5931\u8d25\uff0c\u7f13\u5b58\u672a\u6539\u52a8\u3002";
          return;
        }
        const stale = cacheImportPreview.value;
        if (!stale || fresh.added !== stale.added || fresh.replaced !== stale.replaced || fresh.total !== stale.total) {
          cacheImportPreview.value = fresh;
          cacheNote.value = "\u7f13\u5b58\u5728\u8fd9\u671f\u95f4\u6709\u53d8\u5316\uff0c\u6570\u5b57\u5df2\u66f4\u65b0\uff0c\u786e\u8ba4\u540e\u518d\u5bfc\u5165\u3002";
          return;
        }
        try {
          const result = localAnswerCache.importJson(text);
          cacheNote.value = `\u5df2\u5bfc\u5165 ${result.added + result.replaced} \u6761\u3002`;
        } catch {
          cacheNote.value = "\u5bfc\u5165\u5931\u8d25\uff0c\u7f13\u5b58\u672a\u6539\u52a8\u3002";
        }
        cacheImportPreview.value = null;
        pendingImportText.value = "";
        refreshCache();
      };
      const cancelImport = () => {
        cacheImportPreview.value = null;
        pendingImportText.value = "";
      };
      const clearCacheAll = () => {
        localAnswerCache.clear();
        cacheQuery.value = "";
        cacheClearPending.value = false;
        refreshCache();
        cacheNote.value = "\u5df2\u6e05\u7a7a\u672c\u5730\u7f13\u5b58\u3002";
      };
      const cacheDate = savedAt => {
        if (!savedAt) return "";
        const d = new Date(savedAt);
        const pad = n => String(n).padStart(2, "0");
        return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
      };
      const logBuf = createLogBuffer(200);
      const logs = vue.ref([]);
      const logFilter = vue.ref("all");
      const LOG_LEVELS = [ {
        k: "all",
        l: "\u5168\u90e8"
      }, {
        k: "info",
        l: "\u4fe1\u606f"
      }, {
        k: "warning",
        l: "\u8b66\u544a"
      }, {
        k: "error",
        l: "\u9519\u8bef"
      } ];
      const filteredLogs = vue.computed(() => filterLogs(logs.value, logFilter.value));
      function pushLog(content, type = "info") {
        logBuf.add(content, type);
        logs.value = logBuf.list().map(entry => ({
          ...entry
        }));
      }
      const clearLogs = () => {
        logBuf.clear();
        logs.value = [];
      };
      const downloadText = (filename, text, type = "application/json") => {
        const url = URL.createObjectURL(new Blob([ text ], {
          type: type
        }));
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      };
      const exportDiagnostics = () => {
        var _a2;
        const payload = {
          exportedAt: (new Date).toISOString(),
          version: SCRIPT_VERSION,
          engine: ENGINE_ID,
          rule: ruleDiag.value ?? null,
          ruleCaptureFailure: lastCaptureFailure.value,
          fontTable: chaoxingFontTableStatus(),
          listener: listenerStatus(),
          ruleDiagnosticsFlow: ((_a2 = diag.value) == null ? void 0 : _a2.ruleFlow) ?? null,
          harvestContribute: harvestContributeStatus(),
          logs: logs.value
        };
        downloadText(`aiask-diagnostics-${Date.now()}.json`, JSON.stringify(payload, null, 2));
      };
      const exportPageSnapshot = () => downloadText(`aiask-snapshot-${Date.now()}.json`, JSON.stringify(capturePageSnapshot(window, {
        scriptVersion: SCRIPT_VERSION
      }), null, 2));
      const exportPage = () => downloadText(`aiask-page-${Date.now()}.html`, buildPageExportHtml(list.value, {
        platformLabel: platformLabel.value,
        exportedAt: (new Date).toLocaleString("zh-CN")
      }), "text/html");
      const exportHarvest = () => downloadText(`aiask-harvest-${Date.now()}.html`, buildHarvestExportHtml(harvestedList.value, {
        platformLabel: platformLabel.value,
        exportedAt: (new Date).toLocaleString("zh-CN")
      }), "text/html");
      const openLogs = () => {
        tab.value = "system";
        systemSub.value = "diag";
      };
      const list = vue.ref([]);
      const curInx = vue.ref(0);
      const running = vue.ref(false);
      const roundStarted = vue.ref(false);
      const tip = vue.ref("\u7a7a\u95f2");
      const note2 = vue.ref("");
      const noteAction = vue.ref("");
      const diag = vue.shallowRef(null);
      const lastCaptureFailure = vue.ref(null);
      const diagOpen = vue.ref(true);
      const ruleDiag = vue.ref(null);
      const ruleVersionLabel = vue.computed(() => {
        if (ruleDiag.value) return `\u89c4\u5219 ${ruleDiag.value.version}`;
        return ruleStoreVersions.value.length > 0 ? `\u89c4\u5219 ${ruleStoreVersions.value.length} \u5305 \xb7 \u672c\u9875\u672a\u5339\u914d` : "\u89c4\u5219 \u672a\u540c\u6b65";
      });
      const ruleStoreVersions = vue.ref([]);
      const refreshRuleStoreVersions = () => {
        ruleStoreVersions.value = ruleStoreRuntime.usablePackageIds();
      };
      const ruleMetaOpen = vue.ref(false);
      const ruleUpdating = vue.ref(false);
      const ruleUpdateNote = vue.ref("");
      const navOpen = vue.ref(true);
      const optsExpanded = vue.ref(false);
      vue.watch(curInx, () => {
        optsExpanded.value = false;
      });
      let session = null;
      let ctx = null;
      let adapter = null;
      let createAdapter = null;
      const platform = vue.ref(((_a = trustedRemoteRulePlatformFor(location.hostname)) == null ? void 0 : _a.platform) ?? "chaoxing");
      const courseAdapter = courseAdapterFor(platform.value);
      let loaded = false;
      let harvestSettledAt = 0;
      let harvestSignature = "";
      let detecting = false;
      let detectAgain = false;
      let autoResumeStarted = false;
      let stopFrameReady = null;
      let stopRuleStoreUpdates = null;
      let stopRuleStoreRestored = null;
      const rulesRestoring = vue.ref(ruleStoreRestorePending());
      const WALK_STOP_TEXT = {
        "no-card": "\u8fd9\u9875\u6ca1\u6709\u7b54\u9898\u5361\uff0c\u4e0d\u5f80\u4e0b\u8d70",
        "all-done": "\u5f53\u524d\u9898\u4e4b\u540e\u6ca1\u6709\u672a\u505a\u7684\u9898\u4e86",
        budget: "\u5df2\u5230\u672c\u8f6e\u4e0a\u9650\uff0c\u505c\u4e0b",
        "needs-confirm": "\u8fd9\u9898\u7b54\u6848\u5df2\u586b\u597d\uff0c\u4f46\u9700\u8981\u4f60\u70b9\u300c\u786e\u8ba4\u300d\u624d\u7b97\u63d0\u4ea4\u2014\u2014\u811a\u672c\u4e0d\u66ff\u4f60\u63d0\u4ea4\uff1b\u70b9\u5b8c\u8bf7\u518d\u6309\u4e00\u6b21\u300c\u5f00\u59cb\u300d\u7ee7\u7eed",
        stuck: "\u5207\u9898\u6ca1\u751f\u6548\uff0c\u505c\u4e0b",
        "capture-failure": "\u89c4\u5219\u6355\u83b7\u5931\u8d25\uff0c\u4e0d\u518d\u5207\u9898",
        refused: "\u4e0b\u4e00\u683c\u88ab\u5b89\u5168\u5b88\u536b\u62d2\u7edd\uff0c\u505c\u4e0b"
      };
      const COMMIT_OUTCOME_TEXT = {
        committed: "\u5df2\u6536\u5230\u56de\u6267",
        "commit-unverified": "\u70b9\u4e86\u4f46\u6ca1\u7b49\u5230\u56de\u6267",
        "no-entry": "\u6ca1\u627e\u5230\u6682\u5b58\u5165\u53e3",
        "ambiguous-entry": "\u6682\u5b58\u5165\u53e3\u4e0d\u6b62\u4e00\u9897",
        refused: "\u5165\u53e3\u8fc7\u4e0d\u4e86\u5b88\u536b",
        "hook-failed": "\u7ad9\u70b9\u6682\u5b58\u5931\u8d25",
        skipped: "\u672c\u8f6e\u6ca1\u6709\u5199\u5165"
      };
      let stopPageChanges = null;
      let stopWalk = null;
      let stopDomChanges = null;
      let stopUrlChanges = null;
      let pageChangeScheduler = null;
      let completing = false;
      let pendingPageChange = false;
      function currentReportIdentity() {
        const rule = ruleDiag.value;
        if (!rule) return null;
        return buildReportIdentity(platform.value, getClientId(), SCRIPT_VERSION, RULE_ENGINE_VERSION, rule);
      }
      function refreshRuleDiagnostic() {
        var _a2;
        const loadStatus = (_a2 = ruleDiag.value) == null ? void 0 : _a2.loadStatus;
        if (!adapter || !loadStatus) return;
        ruleDiag.value = buildRuleSessionDiagnostic(adapter, loadStatus, ruleStoreRuntime.snapshot().releaseSummaries);
        syncCourseConfig();
      }
      let courseConfigSource = null;
      function syncCourseConfig() {
        var _a2, _b, _c;
        const remote = (_b = (_a2 = resolvedRulePackage(adapter)) == null ? void 0 : _a2.shellConfig) == null ? void 0 : _b.selectors;
        const source = remote ? ((_c = ruleDiag.value) == null ? void 0 : _c.version) ?? "remote" : "built-in";
        if (source === courseConfigSource) return;
        courseConfigSource = source;
        applyCourseConfig(remote);
        pushLog(remote ? `\u8bfe\u7a0b\u5224\u636e\u6765\u81ea\u89c4\u5219\u5305 ${source} \xb7 ${Object.keys(remote).length} \u9879` : ruleStoreRuntime.usablePackageIds().length === 0 ? "\u8bfe\u7a0b\u5224\u636e\u7528\u5185\u7f6e\u9ed8\u8ba4\u503c \xb7 \u672c\u5730\u6ca1\u6709\u53ef\u7528\u89c4\u5219\u5305" : "\u8bfe\u7a0b\u5224\u636e\u7528\u5185\u7f6e\u9ed8\u8ba4\u503c \xb7 \u672c\u9875\u65e0\u5bf9\u5e94\u89c4\u5219", "info");
      }
      function examSessionStorage() {
        var _a2;
        try {
          return ((_a2 = document.defaultView) == null ? void 0 : _a2.sessionStorage) ?? null;
        } catch {
          return null;
        }
      }
      function clearExamAutoResume() {
        const storage = examSessionStorage();
        if (storage) clearChaoxingExamAutoResume(storage);
      }
      const stats = vue.computed(() => {
        let charged = 0;
        for (const it of list.value) if (it.charged) charged++;
        return {
          charged: charged
        };
      });
      const PAID_BLOCKED_STATUSES = new Set([ "insufficient", "unauthorized", "rate_limited" ]);
      const runSummary = vue.computed(() => ({
        filled: list.value.filter(it => it.filled).length,
        charged: stats.value.charged,
        chargedUnfilled: list.value.filter(it => it.charged && !it.filled).length,
        hitUnfilled: list.value.filter(it => it.status === "hit" && !it.filled && !it.charged).length,
        missed: list.value.filter(it => (it.status === "miss" || it.status === "unsafe") && !it.answer.length && !(it.answerNode && PAID_BLOCKED_STATUSES.has(it.answerNode.status))).length,
        unqueried: list.value.filter(it => it.answerNode && PAID_BLOCKED_STATUSES.has(it.answerNode.status)).length,
        skipped: list.value.filter(it => it.status === "decodeFail" || it.status === "unsupported").length
      }));
      const runDone = vue.computed(() => roundStarted.value && list.value.length > 0 && !running.value && list.value.every(it => it.status !== "pending"));
      const detectedCount = vue.computed(() => list.value.length);
      const features = vue.computed(() => platformFeatures(platform.value));
      const visibleSystemSegs = vue.computed(() => SYSTEM_SEGS.filter(seg => !seg.feature || hasFeature(seg.feature)));
      const hasFeature = name => features.value.includes(name);
      const platformLabel = vue.computed(() => platformLabelFor(platform.value));
      const pageStatus = vue.computed(() => {
        if (list.value.length > 0) return `\u68c0\u6d4b\u5230 ${list.value.length} \u9898`;
        if (harvestedCount.value > 0) return `\u672c\u9875\u5df2\u6536\u5f55 ${harvestedCount.value} \u9898`;
        if (tip.value === "\u7a7a\u95f2") return "\u5f85\u547d\u4e2d";
        return tip.value;
      });
      const homeHint = vue.computed(() => {
        if (running.value) return tip.value;
        if (!detectedCount.value) {
          if (harvestedCount.value > 0) return "\u6b63\u786e\u7b54\u6848\u5df2\u5b58\u5165\u672c\u5730\u7f13\u5b58 \xb7 \u4e0b\u6b21\u9047\u5230\u540c\u9898\u76f4\u63a5\u547d\u4e2d\uff0c\u4e0d\u6263\u5206";
          return hasFeature("answer") ? "\u6253\u5f00\u4f5c\u4e1a\u3001\u8003\u8bd5\u6216\u7ae0\u8282\u6d4b\u9a8c\u9875\u5373\u81ea\u52a8\u8bc6\u522b\uff0c\u6ca1\u53cd\u5e94\u53ef\u624b\u52a8\u91cd\u65b0\u68c0\u6d4b" : "\u6253\u5f00\u5df2\u6279\u9605\u7684\u4f5c\u4e1a\u7ed3\u679c\u9875\u5373\u81ea\u52a8\u6536\u5f55\u6b63\u786e\u7b54\u6848";
        }
        const done = list.value.filter(it => it.status !== "pending").length;
        if (!done) return "\u5df2\u5c31\u7eea \xb7 \u70b9\u300c\u5f00\u59cb\u7b54\u9898\u300d\u81ea\u52a8\u67e5\u9898\u5e76\u56de\u586b";
        const hit = list.value.filter(it => it.status === "hit" && it.filled).length;
        return `\u672c\u8f6e ${hit} \u547d\u4e2d / ${detectedCount.value} \u9898`;
      });
      const standbyHint = vue.computed(() => {
        if (rulesRestoring.value) return "\u89c4\u5219\u52a0\u8f7d\u4e2d \xb7 \u6b63\u5728\u6821\u9a8c\u672c\u5730\u89c4\u5219\u5305\uff0c\u7a0d\u5019\u3002";
        const missing = missingRulePackage();
        if (missing) return missing.routed ? "\u672c\u9875\u5e94\u7531\u4e91\u7aef\u89c4\u5219\u63a5\u7ba1\uff0c\u4f46\u89c4\u5219\u5305\u8fd8\u6ca1\u4e0b\u8f7d\u3002\u70b9\u300c\u68c0\u67e5\u66f4\u65b0\u300d\u3002" : "\u672c\u9875\u6682\u672a\u652f\u6301 \xb7 \u5df2\u8bb0\u5f55\u3002\u7ae0\u8282\u6d4b\u9a8c\u4e0e\u4f5c\u4e1a\u9875\u53ef\u6b63\u5e38\u7b54\u9898\u3002";
        return hasFeature("answer") ? "\u5f53\u524d\u9875\u672a\u53d1\u73b0\u9898\u76ee\u3002\u7ffb\u5230\u4f5c\u4e1a\u6216\u6d4b\u9a8c\u9875\u5373\u81ea\u52a8\u8bc6\u522b\u3002" : "\u5f53\u524d\u9875\u672a\u53d1\u73b0\u9898\u76ee\u3002\u6253\u5f00\u5df2\u6279\u9605\u7684\u4f5c\u4e1a\u7ed3\u679c\u9875\u5373\u81ea\u52a8\u6536\u5f55\u6b63\u786e\u7b54\u6848\u3002";
      });
      const cur = vue.computed(() => list.value[curInx.value]);
      const currentTypeLabel = vue.computed(() => {
        var _a2;
        if (!cur.value) return "";
        const label = harvestTypeLabel((_a2 = cur.value.unit) == null ? void 0 : _a2.queryType);
        if (cur.value.unit && core.isTextAnswerType(cur.value.unit.queryType)) return label;
        return QUESTION_TYPE_LABELS[cur.value.q.type];
      });
      const matchedOptionIndexes = vue.computed(() => {
        const current = cur.value;
        if (!(current == null ? void 0 : current.unit)) return new Set;
        return new Set(core.answeredOptionIndexes(current.unit, current.answerPlan));
      });
      const isHit = index => matchedOptionIndexes.value.has(index);
      const optionDisclosure = vue.computed(() => {
        const c = cur.value;
        return resolveOptionDisclosure((c == null ? void 0 : c.q.options) ?? [], matchedOptionIndexes.value, optsExpanded.value);
      });
      const shownOpts = vue.computed(() => optionDisclosure.value.visible);
      const collapsible = vue.computed(() => optionDisclosure.value.collapsible);
      const treeStatusLabel = status => {
        if (status === "complete" || status === "hit") return "\u5b8c\u6574";
        if (status === "partial") return "\u90e8\u5206";
        if (status === "unsafe") return "\u5df2\u62d2\u7b54";
        return "\u672a\u547d\u4e2d";
      };
      const headChip = vue.computed(() => {
        if (!loggedIn.value) return "";
        if (tab.value === "ask" && loaded) return platformLabel.value;
        if (tab.value === "home" && accountName.value) return accountName.value;
        return "";
      });
      function discard() {
        var _a2;
        const discarded = loaded || list.value.length > 0;
        pageChangeScheduler == null ? void 0 : pageChangeScheduler.cancel();
        stopPageChanges == null ? void 0 : stopPageChanges();
        stopPageChanges = null;
        stopWalk == null ? void 0 : stopWalk();
        stopWalk = null;
        void ((_a2 = adapter == null ? void 0 : adapter.dispose) == null ? void 0 : _a2.call(adapter));
        session = null;
        ctx = null;
        adapter = null;
        createAdapter = null;
        list.value = [];
        curInx.value = 0;
        harvestedCount.value = 0;
        harvestedList.value = [];
        diag.value = null;
        lastCaptureFailure.value = null;
        ruleDiag.value = null;
        loaded = false;
        harvestSettledAt = 0;
        harvestSignature = "";
        answeringTask = "";
        answeringTicksSeen = 0;
        running.value = false;
        roundStarted.value = false;
        tip.value = "\u7a7a\u95f2";
        if (discarded && tab.value === "ask") tab.value = "home";
      }
      async function detectQuestions(allowAutoStart = true) {
        if (loaded || running.value) return;
        if (detecting) {
          detectAgain = true;
          return;
        }
        detecting = true;
        try {
          do {
            detectAgain = false;
            if (!build()) return;
            if (!session || !ctx) {
              tip.value = "\u7a7a\u95f2";
              return;
            }
            const active2 = session;
            const activeCtx = ctx;
            try {
              const n = await active2.load(activeCtx);
              if (session !== active2) return;
              refreshRuleDiagnostic();
              lastCaptureFailure.value = ruleCaptureFailure(adapter);
              syncCacheCount();
              const harvest = active2.lastHarvest;
              harvestedCount.value = (harvest == null ? void 0 : harvest.persisted) ?? 0;
              harvestedList.value = (harvest == null ? void 0 : harvest.items) ?? [];
              const signature = harvestedList.value.map(item => item.unitHash).join();
              harvestSettledAt = harvestedList.value.length > 0 ? Date.now() : 0;
              if (harvest && harvest.persisted > 0 && signature !== harvestSignature) pushLog(cachePersistFailed.value ? `\u672c\u9875\u6536\u5f55 ${harvest.persisted} \u9898 \xb7 \u672a\u80fd\u843d\u76d8\uff0c\u5173\u6389\u9875\u9762\u4f1a\u4e22` : `\u672c\u9875\u6536\u5f55 ${harvest.persisted} \u9898 \xb7 \u5df2\u5b58\u5165\u672c\u5730\u7f13\u5b58`, cachePersistFailed.value ? "warning" : "info");
              harvestSignature = signature;
              if (harvest && harvest.persisted < harvest.harvested) pushLog(`${harvest.harvested - harvest.persisted} \u9898\u6536\u5f55\u5199\u5165\u5931\u8d25 \xb7 \u672a\u5b58\u5165\u7f13\u5b58`, "warning");
              if (n > 0) {
                list.value = active2.list;
                loaded = true;
                roundStarted.value = false;
                tip.value = `${platformLabel.value} \xb7 \u68c0\u6d4b\u5230 ${n} \u9898`;
                tab.value = "ask";
                pushLog(`\u547d\u4e2d${platformLabel.value} \xb7 \u6293\u5230 ${n} \u9898`, "info");
                const storage = examSessionStorage();
                if (!autoResumeStarted && storage && shouldAutoResumeChaoxingExam(location, storage)) {
                  autoResumeStarted = true;
                  pushLog("\u5df2\u8fdb\u5165\u6574\u5377\u9884\u89c8 \xb7 \u81ea\u52a8\u7ee7\u7eed\u7b54\u9898", "info");
                  queueMicrotask(() => void start());
                } else if (allowAutoStart && settings.autoStart && !running.value && hasFeature("answer")) {
                  pushLog(`\u81ea\u52a8\u5f00\u59cb\u7b54\u9898 \xb7 ${n} \u9898`, "info");
                  queueMicrotask(() => void start());
                }
              } else {
                const readout = zeroQuestionReadout(platformLabel.value, lastCaptureFailure.value);
                pushLog(readout.log, readout.level);
                if (harvestedList.value.length) tab.value = "harvest";
              }
            } catch (error) {
              const reason = error instanceof Error ? error.message : String(error ?? "");
              pushLog(`\u9898\u76ee\u68c0\u6d4b\u5931\u8d25\uff0c\u53ef\u624b\u52a8\u5f00\u59cb\u7b54\u9898${reason ? ` \xb7 ${reason.slice(0, 80)}` : ""}`, "warning");
            }
          } while (detectAgain && !loaded);
        } finally {
          detecting = false;
        }
      }
      async function onFrameReady() {
        var _a2;
        if (running.value) return;
        (_a2 = adapter == null ? void 0 : adapter.emitLifecycleEvent) == null ? void 0 : _a2.call(adapter, {
          event: "frame-ready",
          payload: null
        });
        if (!loaded) {
          await detectQuestions();
          return;
        }
        if (!(session == null ? void 0 : session.isStale())) return;
        const previous = session.list;
        discard();
        await detectQuestions(false);
        if (session == null ? void 0 : session.adoptResults(previous)) {
          list.value = [ ...session.list ];
          roundStarted.value = true;
          tip.value = `\u5b8c\u6210 \xb7 ${session.stats().hit} \u547d\u4e2d / ${session.list.length} \u9898`;
          pushLog("\u9875\u9762\u5df2\u91cd\u8f7d \xb7 \u4fdd\u7559\u672c\u8f6e\u7ed3\u679c", "info");
        } else {
          pushLog("\u9875\u9762\u5df2\u5207\u6362 \xb7 \u91cd\u65b0\u8bc6\u522b", "info");
          if (settings.autoStart && !running.value && hasFeature("answer") && loaded) {
            pushLog(`\u81ea\u52a8\u5f00\u59cb\u7b54\u9898 \xb7 ${list.value.length} \u9898`, "info");
            queueMicrotask(() => void start());
          }
        }
      }
      vue.onMounted(() => {
        pageChangeScheduler = createPageChangeScheduler(window, () => {
          if (running.value) return;
          if (completing) {
            pendingPageChange = true;
            return;
          }
          discard();
          void detectQuestions();
        });
        const fontStatus = chaoxingFontTableStatus();
        if (fontStatus !== "ok") pushLog(fontStatus === "unavailable" ? "\u5b57\u4f53\u8868\u672a\u4e0b\u8f7d \xb7 \u5e26\u52a0\u5bc6\u5b57\u4f53\u7684\u9898\u76ee\u65e0\u6cd5\u8bc6\u522b \xb7 \u8bf7\u91cd\u88c5\u811a\u672c\u4ee5\u91cd\u65b0\u4e0b\u8f7d\u8d44\u6e90" : "\u5b57\u4f53\u8868\u5185\u5bb9\u6821\u9a8c\u672a\u901a\u8fc7 \xb7 \u5df2\u5b89\u5168\u62d2\u7528 \xb7 \u5e26\u52a0\u5bc6\u5b57\u4f53\u7684\u9898\u76ee\u65e0\u6cd5\u8bc6\u522b", "warning");
        const listener = listenerStatus();
        if (listener && !listener.installed) pushLog("\u63a5\u53e3\u65c1\u542c\u672a\u88c5\u4e0a \xb7 \u672c\u9875\u53ea\u80fd\u9760\u9875\u9762 DOM \u6536\u5f55", "warning");
        stopFrameReady = subscribeFrameReady(document, onFrameReady);
        stopDomChanges = subscribeDomChanges(document, () => {
          if (loaded || running.value) return;
          if (harvestSettledAt && Date.now() - harvestSettledAt < HARVEST_RECHECK_MS) return;
          pageChangeScheduler == null ? void 0 : pageChangeScheduler.notify();
        });
        stopUrlChanges = subscribeUrlChanges(window, () => {
          if (running.value) return;
          pageChangeScheduler == null ? void 0 : pageChangeScheduler.notify();
        });
        stopRuleStoreUpdates = subscribeRuleStoreUpdates(result => {
          const readout = ruleUpdateReadout(result, ruleStoreRuntime.usablePackageIds().length);
          if (readout) pushLog(readout.log, readout.level);
          refreshRuleStoreVersions();
          if (result.status !== "updated") return;
          if (running.value) return;
          discard();
          void detectQuestions();
        });
        stopRuleStoreRestored = subscribeRuleStoreRestored(() => {
          rulesRestoring.value = false;
          refreshRuleStoreVersions();
          if (running.value) return;
          discard();
          void detectQuestions();
        });
        refreshRuleStoreVersions();
        void devAutoLogin().finally(() => {
          void detectQuestions();
        });
        syncMediaTask();
        void loadAnnouncement();
        window.addEventListener("resize", onWindowResize);
        document.addEventListener("keydown", onPanelKeydown);
        if (settings.reportUsage) usageEvents.restore(); else usageEvents.disable();
        window.addEventListener("pagehide", onPageHide);
        document.addEventListener("visibilitychange", onVisibilityChange);
      });
      vue.onBeforeUnmount(() => {
        var _a2;
        if (captchaRequest) captchaRequest.cancel(); else if (captchaPending) finishCaptcha(new Error("cancelled"));
        stopFrameReady == null ? void 0 : stopFrameReady();
        stopFrameReady = null;
        stopRuleStoreUpdates == null ? void 0 : stopRuleStoreUpdates();
        stopRuleStoreUpdates = null;
        stopRuleStoreRestored == null ? void 0 : stopRuleStoreRestored();
        stopRuleStoreRestored = null;
        stopPageChanges == null ? void 0 : stopPageChanges();
        stopPageChanges = null;
        stopWalk == null ? void 0 : stopWalk();
        stopWalk = null;
        stopDomChanges == null ? void 0 : stopDomChanges();
        stopDomChanges = null;
        stopUrlChanges == null ? void 0 : stopUrlChanges();
        stopUrlChanges = null;
        pageChangeScheduler == null ? void 0 : pageChangeScheduler.dispose();
        pageChangeScheduler = null;
        mediaRunner == null ? void 0 : mediaRunner.stop();
        mediaRunner = null;
        void ((_a2 = adapter == null ? void 0 : adapter.dispose) == null ? void 0 : _a2.call(adapter));
        if (dragState.pointerId !== null) endPanelDrag(dragState, dragState.pointerId);
        panelResizeObserver == null ? void 0 : panelResizeObserver.disconnect();
        panelResizeObserver = null;
        window.removeEventListener("resize", onWindowResize);
        document.removeEventListener("keydown", onPanelKeydown);
        window.removeEventListener("pagehide", onPageHide);
        document.removeEventListener("visibilitychange", onVisibilityChange);
      });
      async function finishRound() {
        const active2 = session;
        if (!active2) return;
        if (settings.randomFallback) {
          let picked = 0;
          const skipped = [];
          for (let i = 0; i < active2.list.length; i += 1) {
            if (session !== active2) return;
            const reason = await active2.fillRandomWithReason(i);
            if (reason === "ok") picked += 1; else if (reason !== "already-filled") skipped.push(reason);
          }
          if (picked > 0) {
            list.value = [ ...active2.list ];
            pushLog(`\u968f\u673a\u4f5c\u7b54 ${picked} \u9898 \xb7 \u4ec5\u5355\u9009\u4e0e\u5224\u65ad`, "warning");
          } else {
            if (skipped.length > 0) pushLog(`\u968f\u673a\u4f5c\u7b54\u672a\u89e6\u53d1 \xb7 ${skipped.length} \u9898 \xb7 \u539f\u56e0 ${[ ...new Set(skipped) ].join("/")}`, "warning");
          }
        }
        if (session !== active2) return;
        if (stats.value.charged > 0) authStale.value = false;
        const answerableCount = countAnswerable();
        const ratio = Math.round(trustedRatio(active2.list, answerableCount) * 100);
        const submitDocs = () => readableDocuments(document);
        let outcome;
        try {
          outcome = await autoSubmitRound(submitDocs, {
            enabled: settings.autoSubmit,
            items: active2.list,
            answerableCount: answerableCount,
            threshold: settings.autoSubmitThreshold,
            isSubmitted: () => readableDocuments(document).some(doc => chapterTestDone(doc) === true),
            onEntry: (how, source) => {
              pushLog(how === "call" ? "\u63d0\u4ea4\u5165\u53e3 \xb7 \u76f4\u63a5\u8c03\u7528\u9875\u9762\u51fd\u6570 btnBlueSubmit()" : "\u63d0\u4ea4\u5165\u53e3 \xb7 \u5df2\u70b9\u51fb\uff08\u8d70\u7ad9\u70b9\u81ea\u5df1\u7684\u70b9\u51fb\u94fe\uff0c\u76f4\u8c03\u7b97\u4e0d\u51fa pos\uff09", how === "call" ? "warning" : "info");
              if (source) pushLog(`\u5165\u53e3\u51fd\u6570\u6e90\u7801 \xb7 ${source}`, "info");
            },
            onConfirmCall: name => pushLog(`\u786e\u8ba4\u63d0\u4ea4 \xb7 \u5df2\u70b9 ${name}`, "warning"),
            onConfirmProbe: detail => pushLog(`\u63d0\u4ea4\u51fd\u6570\u63a2\u6d4b \xb7 ${detail}`, "info")
          });
        } catch (error) {
          pushLog(`\u81ea\u52a8\u63d0\u4ea4\u5f02\u5e38 \xb7 ${error instanceof Error ? error.message.slice(0, 80) : String(error ?? "")}`, "error");
          outcome = "click-failed";
        }
        submitOutcome.value = outcome;
        const submitEventOutcome = toSubmitEventOutcome(outcome);
        if (submitEventOutcome) trackUsage({
          type: "submit",
          outcome: submitEventOutcome,
          ...(answerableCount ?? 0) > 0 ? {
            trustedDecile: Math.max(0, Math.min(10, Math.round(ratio / 10)))
          } : {}
        });
        if (outcome === "submitted") pushLog(`\u53ef\u4fe1\u547d\u4e2d ${ratio}% \xb7 \u5df2\u63d0\u4ea4 \xb7 \u5377\u9762\u5df2\u8f6c\u4e3a\u5df2\u5b8c\u6210`, "warning"); else if (outcome === "confirm-accepted") pushLog(`\u53ef\u4fe1\u547d\u4e2d ${ratio}% \xb7 ${SUBMIT_ACCEPTED_NOTE}`, "warning"); else if (outcome !== "off" && outcome !== "no-items") {
          pushLog(`\u53ef\u4fe1\u547d\u4e2d ${ratio}% \xb7 \u672a\u63d0\u4ea4 \xb7 ${SUBMIT_SKIP_REASON[outcome]}`, "info");
          if (outcome === "unrecognized-questions") pushLog(`\u5df2\u8bc6\u522b ${active2.list.length}/${answerableCount} \u9898 \xb7 \u5dee ${(answerableCount ?? 0) - active2.list.length} \u9898\u6ca1\u88ab\u89c4\u5219\u8ba4\u51fa\u6765`, "warning");
          if (outcome === "confirm-unverified") for (const item of submitCandidates(readableDocuments(document))) pushLog(`\u786e\u8ba4\u540e\u4ecd\u5728 \xb7 ${item.text} \xb7 ${item.tag}.${item.className} \xb7 on=${item.handler || "\u65e0"}`, "warning");
          if (outcome === "no-entry") {
            try {
              const docs = submitDocs();
              pushLog(`\u63d0\u4ea4\u53d6\u8bc1 \xb7 \u626b\u5230 ${docs.length} \u5e27 \xb7 ${docs.map(d => {
              var _a2;
              let where = "?";
              try {
                where = ((_a2 = d.location) == null ? void 0 : _a2.pathname) ?? "?";
              } catch {
                where = "\u8de8\u57df";
              }
              return `${where.slice(-20)}:${d.querySelectorAll("a,button,input").length}`;
            }).join(" ")}`, "info");
              for (const item of submitCandidates(docs)) pushLog(`\u63d0\u4ea4\u5019\u9009 \xb7 ${item.text} \xb7 ${item.tag}.${item.className} \xb7 on=${item.handler || "\u65e0"} \xb7 \u6587\u6848\u9501${item.textLock ? "\u8fc7" : "\u5426"} \xb7 \u5165\u53e3\u9501${item.entryLock ? "\u8fc7" : "\u5426"}`, "info");
            } catch (error) {
              pushLog(`\u63d0\u4ea4\u53d6\u8bc1\u5931\u8d25 \xb7 ${error instanceof Error ? error.message : String(error)}`, "warning");
            }
          }
        }
        const reportIdentity = currentReportIdentity();
        if (settings.reportHealth && reportIdentity) void sendReport(aiaskTransport, BACKEND_BASE_URL, buildHealthReport(reportIdentity, true, active2.list, true, captureFailureReason(ruleCaptureFailure(adapter)), buildPageFingerprint(location, document))).then(noteEvidenceRequest);
      }
      function onEvent(e) {
        if (session) list.value = [ ...session.list ];
        if (e.kind === "question") curInx.value = e.inx; else if (e.kind === "progress") tip.value = `\u67e5\u9898\u4e2d ${e.inx + 1}/${e.total}`; else if (e.kind === "done") {
          clearExamAutoResume();
          tip.value = e.total === 0 ? "\u672a\u8bc6\u522b\u5230\u9898\u76ee" : `\u5b8c\u6210 \xb7 ${e.hit} \u547d\u4e2d / ${e.total} \u9898`;
          running.value = false;
          syncCacheCount();
          refreshRuleDiagnostic();
          pushLog(tip.value, e.total === 0 ? "warning" : "info");
          const items = (session == null ? void 0 : session.list) ?? [];
          const completed = {
            event: "session-complete",
            payload: {
              filled: items.filter(item => item.filled).length,
              total: e.total,
              refused: items.filter(item => item.status === "unsafe").length,
              captureFailed: ruleCaptureFailure(adapter) != null
            }
          };
          const completedAdapter = adapter;
          completing = true;
          void finishRound().finally(async () => {
            var _a2;
            try {
              await ((_a2 = completedAdapter == null ? void 0 : completedAdapter.emitLifecycleEvent) == null ? void 0 : _a2.call(completedAdapter, completed));
            } finally {
              completing = false;
              if (pendingPageChange) {
                pendingPageChange = false;
                pageChangeScheduler == null ? void 0 : pageChangeScheduler.notify();
              }
            }
          });
        } else if (e.kind === "paused") {
          clearExamAutoResume();
          tip.value = "\u5df2\u6682\u505c";
          running.value = false;
          pushLog("\u5df2\u6682\u505c", "info");
          void onFrameReady();
        } else if (e.kind === "insufficient") {
          note2.value = "\u4f59\u989d\u4e0d\u8db3 \xb7 \u514d\u8d39\u9898\u5e93\u7ee7\u7eed \xb7 \u53bb\u8d26\u6237\u9875\u5151\u6362\u5361\u5bc6";
          noteAction.value = "account";
          pushLog("\u4f59\u989d\u4e0d\u8db3 \xb7 \u4ed8\u8d39\u8df3\u8fc7\uff0c\u514d\u8d39\u7ee7\u7eed", "warning");
        } else if (e.kind === "ratelimited") {
          note2.value = "\u4ed8\u8d39\u4fa7\u9650\u6d41 \xb7 \u5df2\u8df3\u8fc7\u4ed8\u8d39\uff0c\u514d\u8d39\u9898\u5e93\u7ee7\u7eed";
          noteAction.value = "";
          pushLog("\u4ed8\u8d39\u9650\u6d41 \xb7 \u514d\u8d39\u7ee7\u7eed", "warning");
        } else if (e.kind === "search-failed") {
          pushLog(`\u7b2c ${e.inx + 1} \u9898\u67e5\u8be2\u5931\u8d25 \xb7 ${e.reason.slice(0, 90) || "\u672a\u77e5\u9519\u8bef"}`, "error");
        } else if (e.kind === "unauthorized") {
          markAuthStale();
          note2.value = `${AUTH_STALE_NOTE} \xb7 \u514d\u8d39\u9898\u5e93\u4ecd\u53ef\u7528`;
          noteAction.value = "login";
          pushLog(`${AUTH_STALE_NOTE} \xb7 \u514d\u8d39\u7ee7\u7eed`, "warning");
        }
      }
      function missingRulePackage() {
        var _a2;
        const expected2 = ((_a2 = trustedRemoteRulePlatformFor(location.hostname)) == null ? void 0 : _a2.packageId) ?? validatedRulePackageIdFor(location);
        if (expected2) return ruleStoreRuntime.snapshot().store.resolve(expected2) === null ? {
          packageId: expected2,
          routed: true
        } : null;
        return SUPPORTED_HOST_PATTERN.test(location.hostname) && CHA0XING_ANSWERABLE_PATH.test(location.href) ? {
          packageId: CHA0XING_UNROUTED_PACKAGE_ID,
          routed: false
        } : null;
      }
      const reportedMissingKeys = new Set;
      function reportMissingRulePackage(packageId) {
        if (!settings.reportHealth) return;
        const fingerprint = buildPageFingerprint(location, document);
        const key = `${packageId} ${fingerprint ? fingerprint.path : "-"}`;
        if (reportedMissingKeys.has(key)) return;
        if (reportedMissingKeys.size >= MAX_REPORTED_MISSING_PAGES) return;
        reportedMissingKeys.add(key);
        void sendReport(aiaskTransport, BACKEND_BASE_URL, buildHealthReport(buildMissingRuleReportIdentity(platform.value, getClientId(), SCRIPT_VERSION, RULE_ENGINE_VERSION, packageId), false, [], false, void 0, fingerprint)).then(noteEvidenceRequest);
      }
      const missingRule = vue.ref(null);
      const evidenceOpen = vue.ref(false);
      const evidenceHtml = vue.ref("");
      const evidenceFingerprint = vue.ref(null);
      const evidenceIdentity = vue.ref(null);
      const evidenceTruncated = vue.ref(false);
      const evidenceOmitted = vue.ref(0);
      const evidenceNote = vue.ref("");
      const evidenceDrawerRequest = vue.ref(null);
      function claimsRequest(request, fingerprint) {
        if (!request || !fingerprint) return false;
        return request.host === fingerprint.host && request.path === fingerprint.path;
      }
      const evidenceSending = vue.ref(false);
      const evidenceStatus = vue.ref("");
      const evidenceUsed = vue.ref(evidenceQuota.today());
      function refreshEvidenceQuota() {
        evidenceUsed.value = evidenceQuota.today();
      }
      const evidenceQuotaExhausted = vue.computed(() => evidenceUsed.value >= EVIDENCE_DAILY_LIMIT);
      const evidenceQuotaNote = `\u4eca\u65e5\u4e0a\u4f20\u6b21\u6570\u5df2\u7528\u5b8c \xb7 \u6bcf\u5929 ${EVIDENCE_DAILY_LIMIT} \u6b21\uff0c\u660e\u5929\u518d\u8bd5\u3002`;
      const evidenceEntryHint = vue.computed(() => evidenceQuotaExhausted.value ? evidenceQuotaNote : "\u4f1a\u5148\u628a\u8981\u4e0a\u4f20\u7684\u5185\u5bb9\u539f\u6837\u7ed9\u4f60\u8fc7\u76ee\uff0c\u786e\u8ba4\u540e\u624d\u4e0a\u4f20\u3002");
      const evidenceSummary = vue.computed(() => {
        const parts = [ `\u5171 ${evidenceHtml.value.length} \u5b57\u7b26` ];
        if (evidenceOmitted.value > 0) parts.push(`\u672c\u6b21\u91c7\u96c6\u6709 ${evidenceOmitted.value} \u5904\u7701\u7565`);
        if (evidenceTruncated.value) parts.push("\u5185\u5bb9\u5df2\u622a\u65ad");
        return parts.join(" \xb7 ");
      });
      function evidenceOmittedCount(html) {
        var _a2;
        const first = html.split("\n", 1)[0] ?? "";
        const nonce = (_a2 = /^<!-- aiask-frame#([0-9a-f]{8}): /u.exec(first)) == null ? void 0 : _a2[1];
        if (!nonce) return 0;
        const prefix = `\x3c!-- aiask-omitted#${nonce}: `;
        let count = 0;
        for (const line of html.split("\n")) if (line.startsWith(prefix)) count += 1;
        return count;
      }
      function evidenceReportIdentity() {
        const missing = missingRulePackage();
        if (missing) return buildMissingRuleReportIdentity(platform.value, getClientId(), SCRIPT_VERSION, RULE_ENGINE_VERSION, missing.packageId);
        return currentReportIdentity();
      }
      function openEvidenceDrawer(request = null) {
        tab.value = "home";
        refreshEvidenceQuota();
        if (evidenceQuotaExhausted.value) {
          evidenceStatus.value = evidenceQuotaNote;
          return;
        }
        discardEvidenceDraft();
        evidenceStatus.value = "";
        evidenceNote.value = "";
        let collected;
        try {
          collected = collectEvidenceHtml(window);
        } catch {
          evidenceStatus.value = "\u91c7\u96c6\u5931\u8d25 \xb7 \u8fd9\u4e00\u9875\u8bfb\u4e0d\u51fa\u6765\uff0c\u6ca1\u6709\u53ef\u4e0a\u4f20\u7684\u5185\u5bb9\u3002";
          return;
        }
        const fingerprint = buildPageFingerprint(location, document);
        const identity = evidenceReportIdentity();
        if (!fingerprint || !identity) {
          evidenceStatus.value = "\u8fd9\u4e00\u9875\u53d6\u4e0d\u5230\u53ef\u7528\u7684\u5b9a\u4f4d\u4fe1\u606f\uff0c\u6ca1\u6cd5\u62a5\u969c\u3002";
          return;
        }
        evidenceHtml.value = collected.html;
        evidenceTruncated.value = collected.truncated;
        evidenceOmitted.value = evidenceOmittedCount(collected.html);
        evidenceFingerprint.value = fingerprint;
        evidenceIdentity.value = identity;
        evidenceDrawerRequest.value = request;
        evidenceOpen.value = true;
      }
      function discardEvidenceDraft() {
        evidenceOpen.value = false;
        evidenceHtml.value = "";
        evidenceTruncated.value = false;
        evidenceOmitted.value = 0;
        evidenceFingerprint.value = null;
        evidenceIdentity.value = null;
        evidenceDrawerRequest.value = null;
      }
      function closeEvidenceDrawer(claimedByServer) {
        const request = evidenceDrawerRequest.value;
        const fingerprint = evidenceFingerprint.value;
        discardEvidenceDraft();
        const settled = claimedByServer ?? claimsRequest(request, fingerprint);
        if (request && settled) settleEvidenceRequest(request.requestId);
      }
      function cancelEvidenceDrawer() {
        closeEvidenceDrawer();
      }
      const evidenceRequest = vue.ref(null);
      function noteEvidenceRequest(res) {
        const request = res == null ? void 0 : res.evidenceRequest;
        if (!request) return;
        if (request.expiresAt <= Date.now()) return;
        if (handledEvidenceRequests.has(request.requestId)) return;
        evidenceRequest.value = request;
      }
      function settleEvidenceRequest(requestId) {
        var _a2;
        handledEvidenceRequests.add(requestId);
        if (((_a2 = evidenceRequest.value) == null ? void 0 : _a2.requestId) === requestId) evidenceRequest.value = null;
      }
      function openEvidenceRequest() {
        const request = evidenceRequest.value;
        if (request) openEvidenceDrawer(request);
      }
      function dismissEvidenceRequest() {
        const request = evidenceRequest.value;
        if (request) settleEvidenceRequest(request.requestId);
      }
      function evidenceFailure(code, reason) {
        if (code === protocol.AiAskCode.RateLimited) {
          if (reason === "ticket") return "\u4e0a\u4f20\u5931\u8d25 \xb7 \u5f00\u53d1\u8005\u70b9\u7684\u8fd9\u4e00\u9875\u5df2\u7ecf\u6536\u591f\u4e86\uff0c\u4e0d\u7528\u518d\u4f20\u3002";
          if (reason === "ip") return "\u4e0a\u4f20\u5931\u8d25 \xb7 \u8fd9\u4e2a\u7f51\u7edc\u4eca\u5929\u4f20\u5f97\u592a\u591a\u4e86\uff0c\u660e\u5929\u518d\u8bd5\u3002";
          return "\u4e0a\u4f20\u5931\u8d25 \xb7 \u4eca\u5929\u4f20\u5f97\u592a\u591a\u4e86\uff0c\u660e\u5929\u518d\u8bd5\u3002";
        }
        if (code === protocol.AiAskCode.Invalid) return "\u4e0a\u4f20\u5931\u8d25 \xb7 \u670d\u52a1\u7aef\u6ca1\u6536\u4e0b\u8fd9\u4efd\u8bc1\u636e\u3002";
        return "\u4e0a\u4f20\u5931\u8d25 \xb7 \u7f51\u7edc\u6216\u670d\u52a1\u6682\u65f6\u4e0d\u53ef\u7528\uff0c\u7a0d\u540e\u518d\u8bd5\u3002";
      }
      async function uploadEvidence() {
        if (!evidenceHtml.value || evidenceSending.value) return;
        refreshEvidenceQuota();
        if (evidenceQuotaExhausted.value) {
          evidenceStatus.value = evidenceQuotaNote;
          return;
        }
        const identity = evidenceIdentity.value;
        const fingerprint = evidenceFingerprint.value;
        if (!identity || !fingerprint) {
          evidenceStatus.value = "\u4e0a\u4f20\u5931\u8d25 \xb7 \u8fd9\u4e00\u9875\u53d6\u4e0d\u5230\u53ef\u7528\u7684\u5b9a\u4f4d\u4fe1\u606f\u3002";
          return;
        }
        const note22 = evidenceNote.value.trim().slice(0, 200);
        const request = evidenceDrawerRequest.value;
        const claimable = claimsRequest(request, fingerprint);
        const bundle = {
          requestId: claimable && request ? request.requestId : null,
          ...identity,
          fingerprint: fingerprint,
          ...note22 ? {
            note: note22
          } : {},
          html: evidenceHtml.value,
          truncated: evidenceTruncated.value
        };
        evidenceSending.value = true;
        evidenceStatus.value = "\u4e0a\u4f20\u4e2d\u2026";
        try {
          const res = await ruleTransport.send({
            method: "POST",
            url: BACKEND_BASE_URL + protocol.EVIDENCE_PATH,
            headers: {
              "Content-Type": "application/json",
              "Idempotency-Key": protocol.randomUuid()
            },
            body: JSON.stringify(bundle),
            timeoutMs: 2e4
          });
          const parsed = protocol.EvidenceResponseSchema.safeParse(JSON.parse(res.body));
          const data = parsed.success ? parsed.data : void 0;
          const code = data == null ? void 0 : data.code;
          if (code !== protocol.AiAskCode.Ok) {
            evidenceStatus.value = evidenceFailure(code, data == null ? void 0 : data.reason);
            pushLog(`\u73b0\u573a\u8bc1\u636e\u4e0a\u4f20\u5931\u8d25 \xb7 code ${String(code)}`, "warning");
            return;
          }
          const claimed = (data == null ? void 0 : data.claimed) ?? claimable;
          evidenceQuota.bump();
          refreshEvidenceQuota();
          evidenceStatus.value = request && !claimed ? "\u5df2\u4e0a\u4f20 \xb7 \u8c22\u8c22\u3002\u5f00\u53d1\u8005\u70b9\u7684\u662f\u53e6\u4e00\u9875\uff0c\u8fd9\u4e00\u4efd\u5f53\u666e\u901a\u53cd\u9988\u6536\u4e0b\u4e86\u3002" : "\u5df2\u4e0a\u4f20 \xb7 \u8c22\u8c22\u3002";
          pushLog("\u73b0\u573a\u8bc1\u636e\u5df2\u4e0a\u4f20", "info");
          closeEvidenceDrawer(claimed);
        } catch {
          evidenceStatus.value = evidenceFailure(void 0);
          pushLog("\u73b0\u573a\u8bc1\u636e\u4e0a\u4f20\u5931\u8d25 \xb7 \u7f51\u7edc\u5f02\u5e38", "warning");
        } finally {
          evidenceSending.value = false;
        }
      }
      function build() {
        var _a2, _b;
        if (session && ctx) return true;
        const r = createSession({
          transport: gmTransport,
          backendTransport: aiaskTransport,
          document: document,
          location: location,
          typr: Typr$1,
          fontTable: getChaoxingFontTable(),
          getToken: getToken,
          baseUrl: BACKEND_BASE_URL,
          settings: settings,
          localStore: localAnswerCache,
          onHarvested: items => {
            if (!getToken()) return;
            void contributeHarvest(aiaskTransport, BACKEND_BASE_URL, platform.value || "unknown", items).catch(() => void 0);
          },
          emit: onEvent
        });
        if (!r.session) {
          if (rulesRestoring.value) {
            missingRule.value = null;
            tip.value = "\u89c4\u5219\u52a0\u8f7d\u4e2d\u2026";
            return false;
          }
          const missing = missingRulePackage();
          missingRule.value = missing;
          tip.value = !missing ? "\u5f53\u524d\u9875\u9762\u672a\u8bc6\u522b\u5230\u9898\u76ee" : missing.routed ? "\u89c4\u5219\u5305\u5c1a\u672a\u4e0b\u8f7d \xb7 \u8bf7\u70b9\u300c\u68c0\u67e5\u66f4\u65b0\u300d" : "\u672c\u9875\u6682\u672a\u652f\u6301";
          if (missing) reportMissingRulePackage(missing.packageId);
          return false;
        }
        missingRule.value = null;
        session = r.session;
        ctx = r.ctx;
        adapter = r.adapter;
        stopPageChanges = ((_a2 = adapter.subscribePageChanges) == null ? void 0 : _a2.call(adapter, () => {
          if (running.value) return false;
          pageChangeScheduler == null ? void 0 : pageChangeScheduler.notify();
          return true;
        })) ?? null;
        stopWalk == null ? void 0 : stopWalk();
        stopWalk = ((_b = adapter.subscribeWalk) == null ? void 0 : _b.call(adapter, event => {
          if (event.kind === "stepped") {
            pushLog(`\u5207\u5230\u7b2c ${event.index + 1}/${event.total} \u9898`, "info");
            return;
          }
          const walked = event.steps > 0 ? `\u5df2\u8fde\u7eed\u5207 ${event.steps} \u9898 \xb7 ` : "";
          pushLog(`${walked}${WALK_STOP_TEXT[event.reason]}${event.detail ? ` \xb7 ${event.detail}` : ""}`, event.reason === "needs-confirm" ? "warning" : "info");
        })) ?? null;
        createAdapter = r.createAdapter;
        ruleDiag.value = r.rule;
        platform.value = r.platform;
        localAnswerCache.setPlatform(platformLabel.value);
        syncCourseConfig();
        return true;
      }
      async function runDiag() {
        var _a2, _b;
        if (!build() || !ctx || !createAdapter) return;
        const diagnosticAdapter = createAdapter();
        let reportIdentity = currentReportIdentity();
        try {
          diag.value = await runDiagnostic(diagnosticAdapter, ctx);
          lastCaptureFailure.value = ruleCaptureFailure(diagnosticAdapter);
          const loadStatus = (_a2 = ruleDiag.value) == null ? void 0 : _a2.loadStatus;
          const diagnosticRule = loadStatus ? buildRuleSessionDiagnostic(diagnosticAdapter, loadStatus, ruleStoreRuntime.snapshot().releaseSummaries) : null;
          if (diagnosticRule) {
            reportIdentity = buildReportIdentity(platform.value, getClientId(), SCRIPT_VERSION, RULE_ENGINE_VERSION, diagnosticRule);
          }
        } finally {
          await ((_b = diagnosticAdapter.dispose) == null ? void 0 : _b.call(diagnosticAdapter));
        }
        diagOpen.value = true;
        const failureSuffix = lastCaptureFailure.value ? ` \xb7 \u89c4\u5219\u6355\u83b7\u5931\u8d25 ${lastCaptureFailure.value}` : "";
        const summary = diag.value.matched ? `\u8bca\u65ad \xb7 \u547d\u4e2d${platformLabel.value} \xb7 \u6293\u5230 ${diag.value.count} \u9898 \xb7 \u6536\u5f55 ${diag.value.harvestedCount} \u9898${failureSuffix}` : "\u8bca\u65ad \xb7 \u672a\u547d\u4e2d\u5f53\u524d\u9875";
        pushLog(summary, diag.value.matched && !lastCaptureFailure.value ? "info" : "warning");
        if (settings.reportHealth && reportIdentity) {
          void sendReport(aiaskTransport, BACKEND_BASE_URL, buildDiagnosticReport(reportIdentity, {
            matched: diag.value.matched,
            count: diag.value.count,
            imageCount: diag.value.imageCount,
            items: diag.value.items.map(item => ({
              type: item.type,
              decodeFailed: item.decodeFailed,
              optionCount: item.optionCount,
              imageCount: item.imageCount,
              unsupportedReason: item.unsupportedReason
            }))
          }, buildPageFingerprint(location, document))).then(noteEvidenceRequest);
        }
      }
      function resetRuleStorageAndReload() {
        resetRuleStorage(gmRuleStorage);
        location.reload();
      }
      async function updateRules() {
        var _a2;
        if (running.value || ruleUpdating.value) return;
        ruleUpdating.value = true;
        ruleUpdateNote.value = "\u68c0\u67e5\u4e2d\u2026";
        const result = await checkRuleUpdates(true);
        refreshRuleDiagnostic();
        ruleUpdating.value = false;
        const usable = ruleStoreRuntime.usablePackageIds().length;
        ruleUpdateNote.value = ((_a2 = ruleUpdateReadout(result, usable)) == null ? void 0 : _a2.note) ?? "";
      }
      async function start() {
        var _a2;
        if (running.value) return;
        if (!hasFeature("answer")) {
          pushLog("\u672c\u5e73\u53f0\u4ec5\u6536\u5f55\u7b54\u6848 \xb7 \u4e0d\u652f\u6301\u81ea\u52a8\u7b54\u9898", "info");
          return;
        }
        note2.value = "";
        noteAction.value = "";
        running.value = true;
        tip.value = "\u67e5\u9898\u4e2d\u2026";
        tab.value = "ask";
        if (!build() || !session || !ctx) {
          running.value = false;
          pushLog("\u5f53\u524d\u9875\u672a\u8bc6\u522b\u5230\u9898\u76ee", "warning");
          return;
        }
        if (!loaded) {
          await session.load(ctx);
          refreshRuleDiagnostic();
          syncCacheCount();
          list.value = session.list;
          loaded = true;
        }
        (_a2 = adapter == null ? void 0 : adapter.emitLifecycleEvent) == null ? void 0 : _a2.call(adapter, {
          event: "user-start",
          payload: null
        });
        if (!getToken()) {
          note2.value = "\u672a\u767b\u5f55 \xb7 \u5f53\u524d\u4ec5\u67e5\u514d\u8d39\u9898\u5e93";
          noteAction.value = "login";
          pushLog("\u672a\u767b\u5f55 \xb7 \u4ec5\u514d\u8d39\u9898\u5e93", "info");
        }
        pushLog("\u5f00\u59cb\u7b54\u9898", "info");
        roundStarted.value = true;
        submitOutcome.value = null;
        session.setOptions({
          autoFill: true,
          delayMs: settings.delayMs,
          freeFirst: settings.freeFirst
        });
        await session.start(curInx.value);
      }
      async function reAnswerCurrent() {
        if (running.value || !session || !cur.value) return;
        if (cur.value.status === "unsupported") {
          tip.value = "\u9898\u76ee\u5185\u5bb9\u89e3\u6790\u5931\u8d25\uff0c\u5df2\u8df3\u8fc7";
          pushLog(tip.value, "warning");
          return;
        }
        running.value = true;
        tip.value = `\u91cd\u7b54\u7b2c ${curInx.value + 1} \u9898\u2026`;
        session.setOptions({
          autoFill: true,
          delayMs: settings.delayMs,
          freeFirst: settings.freeFirst
        });
        pushLog(`\u91cd\u7b54\u7b2c ${curInx.value + 1} \u9898`, "info");
        try {
          await session.reAnswer(curInx.value);
          list.value = [ ...session.list ];
          const item = list.value[curInx.value];
          tip.value = (item == null ? void 0 : item.status) === "hit" && item.filled ? "\u672c\u9898\u91cd\u7b54\u5b8c\u6210" : (item == null ? void 0 : item.status) === "hit" ? "\u672c\u9898\u6709\u7b54\u6848\u4f46\u672a\u56de\u586b" : "\u672c\u9898\u6682\u672a\u547d\u4e2d";
          pushLog(tip.value, (item == null ? void 0 : item.status) === "hit" && item.filled ? "info" : "warning");
        } finally {
          running.value = false;
        }
      }
      const pause = () => session == null ? void 0 : session.pause();
      const restart = () => {
        discard();
        start();
      };
      function jump(i) {
        var _a2;
        curInx.value = i;
        const el = (_a2 = list.value[i]) == null ? void 0 : _a2.q.el;
        if (el) {
          el.scrollIntoView({
            block: "center"
          });
          el.style.outline = "2px solid var(--acc)";
          setTimeout(() => {
            el.style.outline = "";
          }, 600);
        }
      }
      const cellClass = (it, i) => {
        if (i === curInx.value) return "cur";
        if (it.status === "hit" && it.filled) return "hit";
        if (it.status === "miss" || it.status === "unsafe" || it.status === "hit" && !it.filled) return "miss";
        return "";
      };
      const letter2 = i => String.fromCharCode(65 + i);
      const reloadCacheView = () => {
        localAnswerCache.reload();
        refreshCache();
      };
      vue.watch(() => systemSub.value, value => {
        if (value === "cache") reloadCacheView();
      });
      const onVisibilityChange = () => {
        if (document.visibilityState !== "visible") return;
        if (tab.value !== "system" || systemSub.value !== "cache") return;
        reloadCacheView();
      };
      vue.watch(visibleSystemSegs, segs => {
        var _a2;
        if (!segs.some(seg => seg.k === systemSub.value)) systemSub.value = ((_a2 = segs[0]) == null ? void 0 : _a2.k) ?? "general";
      });
      return (_ctx, _cache) => {
        var _a2, _b, _c, _d;
        return collapsed.value ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          ref_key: "panelRef",
          ref: panelRef,
          class: "bubble",
          style: vue.normalizeStyle(panelStyle.value),
          onPointerdown: startBubbleDrag,
          onPointermove: moveDrag,
          onPointerup: finishDrag,
          onPointercancel: finishDrag,
          onLostpointercapture: finishDrag
        }, [ tip.value !== "\u7a7a\u95f2" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_1, vue.toDisplayString(tip.value), 1)) : vue.createCommentVNode("", true), vue.createElementVNode("button", {
          class: "launcher",
          onClick: activateLauncher,
          "aria-label": "\u5c55\u5f00\u7231\u95ee\u7b54"
        }, [ _cache[33] || (_cache[33] = vue.createElementVNode("span", {
          class: "seal s44"
        }, "\u95ee", -1)), detectedCount.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2, vue.toDisplayString(detectedCount.value), 1)) : vue.createCommentVNode("", true) ]) ], 36)) : (vue.openBlock(), 
        vue.createElementBlock("div", {
          key: 1,
          ref_key: "panelRef",
          ref: panelRef,
          class: "panel",
          style: vue.normalizeStyle(panelStyle.value)
        }, [ (vue.openBlock(), vue.createElementBlock("svg", _hoisted_3, [ ..._cache[34] || (_cache[34] = [ vue.createStaticVNode('<symbol id="i-chevron" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></symbol><symbol id="i-minus" viewBox="0 0 24 24"><path d="M6 12h12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path></symbol><symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h13M13 7l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></symbol>', 3) ]) ])), vue.createElementVNode("div", {
          ref_key: "dragHandleRef",
          ref: dragHandleRef,
          class: "head",
          onPointerdown: startDrag,
          onPointermove: moveDrag,
          onPointerup: finishDrag,
          onPointercancel: finishDrag,
          onLostpointercapture: finishDrag
        }, [ _cache[37] || (_cache[37] = vue.createElementVNode("span", {
          class: "seal s22"
        }, "\u95ee", -1)), _cache[38] || (_cache[38] = vue.createElementVNode("span", {
          class: "name"
        }, "\u7231\u95ee\u7b54", -1)), _cache[39] || (_cache[39] = vue.createElementVNode("span", {
          class: "spacer"
        }, null, -1)), headChip.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 0,
          class: vue.normalizeClass([ "chip", {
            mono: tab.value === "home"
          } ])
        }, vue.toDisplayString(headChip.value), 3)) : vue.createCommentVNode("", true), vue.createElementVNode("button", {
          class: vue.normalizeClass([ "ava", {
            out: !loggedIn.value
          } ]),
          "aria-label": loggedIn.value ? "\u8d26\u6237" : "\u767b\u5f55",
          onClick: vue.withModifiers(toggleAccount, [ "stop" ])
        }, [ loggedIn.value ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, {
          key: 0
        }, [ vue.createTextVNode(vue.toDisplayString(avatarInitial.value), 1) ], 64)) : (vue.openBlock(), 
        vue.createElementBlock("svg", _hoisted_5, [ ..._cache[35] || (_cache[35] = [ vue.createElementVNode("circle", {
          cx: "12",
          cy: "8",
          r: "3.4"
        }, null, -1), vue.createElementVNode("path", {
          d: "M5.5 20c1.3-3.6 4-5.4 6.5-5.4s5.2 1.8 6.5 5.4",
          "stroke-linecap": "round"
        }, null, -1) ]) ])) ], 10, _hoisted_4), vue.createElementVNode("button", {
          class: "x",
          onClick: collapse,
          "aria-label": "\u6536\u8d77"
        }, [ ..._cache[36] || (_cache[36] = [ vue.createElementVNode("svg", {
          class: "ic"
        }, [ vue.createElementVNode("use", {
          href: "#i-minus"
        }) ], -1) ]) ]) ], 544), vue.createElementVNode("div", _hoisted_6, [ (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(TABS, t => vue.createElementVNode("button", {
          key: t.k,
          class: vue.normalizeClass([ "tab", {
            active: tab.value === t.k
          } ]),
          onClick: $event => tab.value = t.k
        }, vue.toDisplayString(t.l), 11, _hoisted_7)), 64)) ]), evidenceRequest.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_8, [ _cache[40] || (_cache[40] = vue.createElementVNode("span", {
          class: "dot"
        }, null, -1)), _cache[41] || (_cache[41] = vue.createElementVNode("span", {
          class: "t"
        }, "\u5f00\u53d1\u8005\u60f3\u770b\u770b\u8fd9\u4e00\u9875\u51fa\u4e86\u4ec0\u4e48\u95ee\u9898", -1)), vue.createElementVNode("button", {
          class: "btn ghost sm",
          onClick: openEvidenceRequest
        }, "\u53bb\u770b\u770b"), vue.createElementVNode("button", {
          class: "btn ghost sm",
          onClick: dismissEvidenceRequest
        }, "\u4e0d\u7528\u4e86") ])) : announcementUnread.value && announcement.value ? (vue.openBlock(), 
        vue.createElementBlock("div", {
          key: 1,
          class: vue.normalizeClass([ "anb", announcement.value.level ])
        }, [ _cache[42] || (_cache[42] = vue.createElementVNode("span", {
          class: "dot"
        }, null, -1)), vue.createElementVNode("span", {
          class: "t",
          title: announcement.value.title
        }, vue.toDisplayString(announcement.value.title), 9, _hoisted_9), vue.createElementVNode("button", {
          class: "btn ghost sm",
          onClick: openAnnouncement
        }, "\u67e5\u770b"), vue.createElementVNode("button", {
          class: "btn ghost sm",
          onClick: dismissAnnouncement
        }, "\u77e5\u9053\u4e86") ], 2)) : vue.createCommentVNode("", true), tab.value === "system" ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_10, [ (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(visibleSystemSegs.value, s => (vue.openBlock(), 
        vue.createElementBlock("button", {
          key: s.k,
          class: vue.normalizeClass([ "seg", {
            active: systemSub.value === s.k
          } ]),
          onClick: $event => systemSub.value = s.k
        }, vue.toDisplayString(s.l), 11, _hoisted_11))), 128)) ])) : vue.createCommentVNode("", true), vue.createElementVNode("div", _hoisted_12, [ tab.value === "home" ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 0
        }, [ announcement.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_13, [ vue.createElementVNode("div", _hoisted_14, [ _cache[43] || (_cache[43] = vue.createElementVNode("span", {
          class: "locator"
        }, "\u516c\u544a", -1)), vue.createElementVNode("span", _hoisted_15, vue.toDisplayString(announcementTime.value), 1) ]), vue.createElementVNode("div", _hoisted_16, vue.toDisplayString(announcement.value.title), 1), vue.createElementVNode("div", {
          class: "an-body",
          innerHTML: announcement.value.html
        }, null, 8, _hoisted_17) ])) : vue.createCommentVNode("", true), hasFeature("course-automation") ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_18, [ vue.createElementVNode("div", _hoisted_19, [ _cache[44] || (_cache[44] = vue.createElementVNode("span", {
          class: "locator"
        }, "\u8bfe\u7a0b\u5b66\u4e60", -1)), vue.createElementVNode("div", _hoisted_20, [ vue.createElementVNode("button", {
          class: "btn ghost sm",
          onClick: openCourseSettings,
          "aria-label": "\u8bfe\u7a0b\u5b66\u4e60\u8bbe\u7f6e"
        }, "\u8bbe\u7f6e"), onCourseStudyPage.value ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 0,
          class: "btn ghost sm",
          onClick: _cache[0] || (_cache[0] = (...args) => vue.unref(toggleCourseAuto) && vue.unref(toggleCourseAuto)(...args))
        }, vue.toDisplayString(settings.courseAuto ? "\u6682\u505c" : "\u7ee7\u7eed"), 1)) : vue.createCommentVNode("", true) ]) ]), vue.unref(legacyCourseUrl) ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 0
        }, [ _cache[45] || (_cache[45] = vue.createElementVNode("div", {
          class: "gate-h course-status"
        }, "\u65e7\u7248\u8bfe\u7a0b\u9875\u9762 \xb7 \u8bfe\u7a0b\u5b66\u4e60\u53ea\u652f\u6301\u65b0\u7248", -1)), _cache[46] || (_cache[46] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u8d85\u661f\u540c\u4e00\u7ae0\u8282\u6709\u65b0\u65e7\u4e24\u79cd\u9875\u9762\uff0c\u5207\u6362\u540e\u8d26\u53f7\u4e0e\u8fdb\u5ea6\u4e0d\u53d8\u3002", -1)), vue.createElementVNode("button", {
          class: "btn ghost sm",
          onClick: switchToNewCoursePage
        }, "\u5207\u6362\u65b0\u7248") ], 64)) : !onCourseStudyPage.value ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 1
        }, [ _cache[47] || (_cache[47] = vue.createElementVNode("div", {
          class: "gate-h course-status"
        }, "\u8bfe\u7a0b\u5b66\u4e60\u53ea\u5728\u8bfe\u7a0b\u7ae0\u8282\u9875\u8fd0\u884c", -1)), _cache[48] || (_cache[48] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u6253\u5f00\u67d0\u95e8\u8bfe\u7684\u7ae0\u8282\u5b66\u4e60\u9875\u540e\uff0c\u8fd9\u91cc\u4f1a\u663e\u793a\u8fdb\u5ea6\u4e0e\u72b6\u6001\u3002", -1)) ], 64)) : (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 2
        }, [ vue.createElementVNode("div", {
          class: "gate-h course-status",
          style: {
            overflow: "hidden",
            "text-overflow": "ellipsis",
            "white-space": "nowrap"
          },
          title: courseStatusText.value
        }, vue.toDisplayString(courseStatusText.value), 9, _hoisted_21), coursePositionText.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_22, [ vue.createElementVNode("span", _hoisted_23, vue.toDisplayString(coursePositionText.value), 1), vue.createElementVNode("button", {
          class: "btn ghost sm",
          onClick: cyclePlaybackRate
        }, vue.toDisplayString(settings.coursePlaybackRate) + "\xd7", 1) ])) : vue.createCommentVNode("", true), courseCountText.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_24, vue.toDisplayString(courseCountText.value), 1)) : vue.createCommentVNode("", true), courseSkipped.value.length ? (vue.openBlock(), 
        vue.createElementBlock("details", _hoisted_25, [ vue.createElementVNode("summary", _hoisted_26, "\u8df3\u8fc7 " + vue.toDisplayString(courseSkipped.value.length) + " \u9879", 1), (vue.openBlock(true), 
        vue.createElementBlock(vue.Fragment, null, vue.renderList(courseSkipped.value, (item, i) => (vue.openBlock(), 
        vue.createElementBlock("div", {
          key: i,
          class: "cap-mute"
        }, vue.toDisplayString(item.name) + " \xb7 " + vue.toDisplayString(skipReasonLabel(item.reason)), 1))), 128)) ])) : vue.createCommentVNode("", true), _cache[49] || (_cache[49] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u6682\u505c\u4f1a\u540c\u65f6\u505c\u4e0b\u6b63\u5728\u64ad\u653e\u7684\u89c6\u9891\u3002", -1)) ], 64)) ])) : vue.createCommentVNode("", true), !detectedCount.value && !harvestedCount.value && !settings.courseAuto ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_27, [ _cache[50] || (_cache[50] = vue.createElementVNode("div", {
          class: "standby-title"
        }, "\u9759\u5019\u4e00\u95ee", -1)), vue.createElementVNode("div", _hoisted_28, vue.toDisplayString(standbyHint.value), 1) ])) : (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_29, [ vue.createElementVNode("div", _hoisted_30, [ _cache[51] || (_cache[51] = vue.createElementVNode("span", {
          class: "locator"
        }, "\u9875\u9762\u72b6\u6001", -1)), vue.createElementVNode("span", _hoisted_31, vue.toDisplayString(platformLabel.value), 1) ]), vue.createElementVNode("div", _hoisted_32, vue.toDisplayString(pageStatus.value), 1), vue.createElementVNode("div", _hoisted_33, vue.toDisplayString(homeHint.value), 1) ])), evidenceOpen.value || evidenceStatus.value || missingRule.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_34, [ evidenceOpen.value ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, {
          key: 0
        }, [ vue.createElementVNode("button", {
          class: "fold",
          onClick: cancelEvidenceDrawer
        }, [ ..._cache[52] || (_cache[52] = [ vue.createTextVNode("\u62a5\u7ed9\u5f00\u53d1\u8005 \xb7 \u4e0a\u4f20\u524d\u5148\u8fc7\u76ee", -1), vue.createElementVNode("svg", {
          class: "ic sm chev"
        }, [ vue.createElementVNode("use", {
          href: "#i-chevron"
        }) ], -1) ]) ]), _cache[53] || (_cache[53] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u4e0b\u9762\u5c31\u662f\u8981\u4e0a\u4f20\u7684\u9875\u9762\u5185\u5bb9\u3002\u59d3\u540d\u3001\u5b66\u53f7\u3001\u4ee4\u724c\u7b49\u5df2\u81ea\u52a8\u906e\u76d6\uff0c\u4ecd\u8981\u81ea\u5df1\u8fc7\u4e00\u904d\u773c\u3002", -1)), vue.createElementVNode("div", _hoisted_35, vue.toDisplayString(evidenceSummary.value), 1), vue.withDirectives(vue.createElementVNode("input", {
          class: "in evi-note",
          "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => evidenceNote.value = $event),
          maxlength: "200",
          placeholder: "\u8fd9\u4e00\u9875\u51fa\u4e86\u4ec0\u4e48\u95ee\u9898 \u9009\u586b"
        }, null, 512), [ [ vue.vModelText, evidenceNote.value ] ]), vue.createElementVNode("pre", _hoisted_36, vue.toDisplayString(evidenceHtml.value), 1), vue.createElementVNode("div", _hoisted_37, [ vue.createElementVNode("button", {
          class: "btn ghost",
          style: {
            flex: "1"
          },
          disabled: evidenceSending.value,
          onClick: cancelEvidenceDrawer
        }, "\u53d6\u6d88", 8, _hoisted_38), vue.createElementVNode("button", {
          class: "btn",
          style: {
            flex: "1"
          },
          disabled: evidenceSending.value,
          onClick: uploadEvidence
        }, "\u786e\u8ba4\u4e0a\u4f20", 8, _hoisted_39) ]) ], 64)) : missingRule.value ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 1
        }, [ vue.createElementVNode("button", {
          class: "btn ghost sm",
          disabled: evidenceQuotaExhausted.value,
          onClick: _cache[2] || (_cache[2] = $event => openEvidenceDrawer())
        }, "\u62a5\u7ed9\u5f00\u53d1\u8005", 8, _hoisted_40), vue.createElementVNode("div", _hoisted_41, vue.toDisplayString(evidenceEntryHint.value), 1) ], 64)) : vue.createCommentVNode("", true), evidenceStatus.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_42, vue.toDisplayString(evidenceStatus.value), 1)) : vue.createCommentVNode("", true) ])) : vue.createCommentVNode("", true), vue.createElementVNode("div", _hoisted_43, [ vue.createElementVNode("button", {
          class: "btn ghost sm",
          onClick: openLogs
        }, "\u8fd0\u884c\u65e5\u5fd7"), detectedCount.value ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 0,
          class: "btn ghost sm",
          onClick: exportPage
        }, "\u5bfc\u51fa\u672c\u9875\u9898\u76ee")) : vue.createCommentVNode("", true) ]), vue.createElementVNode("div", _hoisted_44, [ _cache[54] || (_cache[54] = vue.createElementVNode("div", {
          class: "sep"
        }, null, -1)), vue.createElementVNode("div", _hoisted_45, [ vue.createElementVNode("span", _hoisted_46, vue.toDisplayString(!loggedIn.value ? "\u672a\u767b\u5f55" : authStale.value ? `${accountName.value || "\u8d26\u53f7"} \xb7 \u9700\u91cd\u65b0\u9a8c\u8bc1` : accountName.value || "\u5df2\u767b\u5f55"), 1), vue.createElementVNode("div", _hoisted_47, [ loggedIn.value && balance.value != null ? (vue.openBlock(), 
        vue.createElementBlock("span", _hoisted_48, "\u4f59\u989d " + vue.toDisplayString(balance.value) + " \u5206", 1)) : vue.createCommentVNode("", true), vue.createElementVNode("button", {
          class: "btn ghost sm",
          onClick: _cache[3] || (_cache[3] = $event => accountOpen.value = true)
        }, vue.toDisplayString(loggedIn.value ? "\u8d26\u6237" : "\u767b\u5f55"), 1) ]) ]), vue.createElementVNode("div", _hoisted_49, vue.toDisplayString(loggedIn.value ? "\u4ed8\u8d39\u9898\u5e93\u627e\u5230\u53ef\u7528\u7b54\u6848\u540e\u6263\u5206\uff1b\u514d\u8d39\u7b54\u6848\u4e0d\u6263\u5206\uff0c\u547d\u4e2d\u672c\u673a\u6536\u5f55\u4e5f\u4e0d\u6263\u5206\u3002" : "\u672a\u767b\u5f55\u65f6\u4ec5\u67e5\u8be2\u514d\u8d39\u9898\u5e93\u3002"), 1) ]) ], 64)) : tab.value === "ask" ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 1
        }, [ note2.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_50, [ vue.createElementVNode("span", _hoisted_51, vue.toDisplayString(note2.value), 1), noteAction.value === "account" ? (vue.openBlock(), 
        vue.createElementBlock("button", {
          key: 0,
          class: "btn ghost sm sub",
          onClick: _cache[4] || (_cache[4] = $event => accountOpen.value = true)
        }, [ ..._cache[55] || (_cache[55] = [ vue.createTextVNode("\u53bb\u8d26\u6237 ", -1), vue.createElementVNode("svg", {
          class: "ic sm"
        }, [ vue.createElementVNode("use", {
          href: "#i-arrow"
        }) ], -1) ]) ])) : noteAction.value === "login" ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 1,
          class: "btn ghost sm sub",
          onClick: _cache[5] || (_cache[5] = $event => accountOpen.value = true)
        }, [ ..._cache[56] || (_cache[56] = [ vue.createTextVNode("\u53bb\u767b\u5f55 ", -1), vue.createElementVNode("svg", {
          class: "ic sm"
        }, [ vue.createElementVNode("use", {
          href: "#i-arrow"
        }) ], -1) ]) ])) : vue.createCommentVNode("", true) ])) : vue.createCommentVNode("", true), runDone.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_52, [ _cache[70] || (_cache[70] = vue.createElementVNode("div", {
          class: "ctitle"
        }, "\u672c\u8f6e\u5b8c\u6210", -1)), vue.createElementVNode("div", _hoisted_53, [ _cache[57] || (_cache[57] = vue.createElementVNode("span", {
          class: "k"
        }, "\u5df2\u56de\u586b", -1)), vue.createElementVNode("b", null, vue.toDisplayString(runSummary.value.filled) + " \u9898", 1), runSummary.value.filled > 0 ? (vue.openBlock(), 
        vue.createElementBlock("span", _hoisted_54, "\u5df2\u6682\u5b58")) : vue.createCommentVNode("", true) ]), vue.createElementVNode("div", _hoisted_55, [ _cache[58] || (_cache[58] = vue.createElementVNode("span", {
          class: "k"
        }, "\u8ba1\u8d39", -1)), vue.createElementVNode("b", null, vue.toDisplayString(runSummary.value.charged) + " \u5206", 1), _cache[59] || (_cache[59] = vue.createElementVNode("span", {
          class: "cap-mute"
        }, "\u547d\u4e2d\u5373\u8ba1\u8d39", -1)) ]), vue.createElementVNode("div", _hoisted_56, [ _cache[60] || (_cache[60] = vue.createElementVNode("span", {
          class: "k"
        }, "\u672a\u547d\u4e2d", -1)), vue.createElementVNode("b", null, vue.toDisplayString(runSummary.value.missed) + " \u9898", 1), _cache[61] || (_cache[61] = vue.createElementVNode("span", {
          class: "cap-mute"
        }, "\u672a\u6263\u5206", -1)) ]), runSummary.value.unqueried ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_57, [ _cache[62] || (_cache[62] = vue.createElementVNode("span", {
          class: "k"
        }, "\u672a\u67e5\u8be2", -1)), vue.createElementVNode("b", null, vue.toDisplayString(runSummary.value.unqueried) + " \u9898", 1), _cache[63] || (_cache[63] = vue.createElementVNode("span", {
          class: "cap-mute"
        }, "\u672a\u53d1\u8d77\u4ed8\u8d39\u67e5\u8be2 \xb7 \u672a\u6263\u5206", -1)) ])) : vue.createCommentVNode("", true), runSummary.value.chargedUnfilled ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_58, [ _cache[64] || (_cache[64] = vue.createElementVNode("span", {
          class: "k"
        }, "\u5df2\u6263\u672a\u586b", -1)), vue.createElementVNode("b", null, vue.toDisplayString(runSummary.value.chargedUnfilled) + " \u9898", 1), _cache[65] || (_cache[65] = vue.createElementVNode("span", {
          class: "cap-mute"
        }, "\u672a\u80fd\u5b89\u5168\u5199\u5165\u9875\u9762 \xb7 \u5df2\u6263\u5206\uff0c\u9700\u624b\u52a8\u6838\u5bf9", -1)) ])) : vue.createCommentVNode("", true), runSummary.value.hitUnfilled ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_59, [ _cache[66] || (_cache[66] = vue.createElementVNode("span", {
          class: "k"
        }, "\u6709\u7b54\u6848\u672a\u5199\u5165", -1)), vue.createElementVNode("b", null, vue.toDisplayString(runSummary.value.hitUnfilled) + " \u9898", 1), _cache[67] || (_cache[67] = vue.createElementVNode("span", {
          class: "cap-mute"
        }, "\u672a\u80fd\u5b89\u5168\u5199\u5165\u9875\u9762 \xb7 \u672a\u6263\u5206\uff0c\u53ef\u5c55\u5f00\u6838\u5bf9", -1)) ])) : vue.createCommentVNode("", true), runSummary.value.skipped ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_60, [ _cache[68] || (_cache[68] = vue.createElementVNode("span", {
          class: "k"
        }, "\u672a\u5904\u7406", -1)), vue.createElementVNode("b", null, vue.toDisplayString(runSummary.value.skipped) + " \u9898", 1), _cache[69] || (_cache[69] = vue.createElementVNode("span", {
          class: "cap-mute"
        }, "\u89e3\u6790\u5931\u8d25\u6216\u9898\u578b\u4e0d\u652f\u6301 \xb7 \u672a\u67e5\u8be2\u3001\u672a\u6263\u5206", -1)) ])) : vue.createCommentVNode("", true), vue.createElementVNode("div", _hoisted_61, vue.toDisplayString(submitNote.value), 1), _cache[71] || (_cache[71] = vue.createElementVNode("span", {
          class: "done-seal",
          "aria-hidden": "true"
        }, "\u7b54", -1)) ])) : vue.createCommentVNode("", true), vue.createElementVNode("div", _hoisted_62, [ !list.value.length ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_63, vue.toDisplayString(tip.value === "\u7a7a\u95f2" ? "\u5f53\u524d\u9875\u672a\u8bc6\u522b\u5230\u9898\u76ee \xb7 \u6253\u5f00\u4f5c\u4e1a\u9875\u540e\u81ea\u52a8\u5207\u5165" : tip.value), 1)) : vue.createCommentVNode("", true), _cache[73] || (_cache[73] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u4ed8\u8d39\u9898\u5e93\u627e\u5230\u53ef\u7528\u7b54\u6848\u540e\u6263\u5206\uff1b\u514d\u8d39\u7b54\u6848\u4e0d\u6263\u5206\uff1b\u65e0\u6cd5\u5b89\u5168\u5339\u914d\u65f6\u4e0d\u4f1a\u56de\u586b\u3002", -1)), stats.value.charged ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_64, [ _cache[72] || (_cache[72] = vue.createElementVNode("span", {
          class: "spacer"
        }, null, -1)), vue.createElementVNode("span", _hoisted_65, "\u4ed8\u8d39\u9898\u5e93\u547d\u4e2d " + vue.toDisplayString(stats.value.charged) + " \u9898", 1) ])) : vue.createCommentVNode("", true), stats.value.charged ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_66, "\u91cd\u590d\u7b54\u9898\u4f1a\u590d\u7528\u5df2\u6263\u5206\u7ed3\u679c\uff0c\u4e0d\u4f1a\u91cd\u590d\u6263\u5206\u3002")) : vue.createCommentVNode("", true) ]), list.value.length ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_67, [ vue.createElementVNode("button", {
          class: "fold",
          onClick: _cache[6] || (_cache[6] = $event => navOpen.value = !navOpen.value)
        }, [ _cache[75] || (_cache[75] = vue.createTextVNode("\u9898\u76ee\u5bfc\u822a", -1)), (vue.openBlock(), 
        vue.createElementBlock("svg", {
          class: vue.normalizeClass([ "ic sm chev", {
            right: !navOpen.value
          } ])
        }, [ ..._cache[74] || (_cache[74] = [ vue.createElementVNode("use", {
          href: "#i-chevron"
        }, null, -1) ]) ], 2)) ]), navOpen.value ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, {
          key: 0
        }, [ _cache[76] || (_cache[76] = vue.createStaticVNode('<div class="legend"><span><i class="sw cur"></i>\u5f53\u524d</span><span><i class="sw hit"></i>\u5df2\u7b54</span><span><i class="sw"></i>\u672a\u7b54</span><span><i class="sw miss"></i>\u65e0\u7b54\u6848</span></div>', 1)), vue.createElementVNode("div", _hoisted_68, [ (vue.openBlock(true), 
        vue.createElementBlock(vue.Fragment, null, vue.renderList(list.value, (it, i) => (vue.openBlock(), 
        vue.createElementBlock("button", {
          key: i,
          class: vue.normalizeClass([ "cell", cellClass(it, i) ]),
          onClick: $event => jump(i)
        }, vue.toDisplayString(i + 1), 11, _hoisted_69))), 128)) ]) ], 64)) : vue.createCommentVNode("", true) ])) : vue.createCommentVNode("", true), cur.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_70, [ cur.value.status === "decodeFail" ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 0
        }, [ vue.createElementVNode("div", _hoisted_71, [ vue.createElementVNode("span", _hoisted_72, "\u7b2c " + vue.toDisplayString(curInx.value + 1) + " \u9898", 1), _cache[77] || (_cache[77] = vue.createElementVNode("span", {
          class: "tag neutral"
        }, "\u89e3\u7801\u5931\u8d25", -1)) ]), _cache[78] || (_cache[78] = vue.createElementVNode("div", {
          class: "stem"
        }, "\uff08\u9898\u9762\u89e3\u6790\u5931\u8d25\uff0c\u5df2\u8df3\u8fc7\uff09", -1)), _cache[79] || (_cache[79] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u89e3\u6790\u5931\u8d25 \xb7 \u672a\u6263\u5206 \xb7 \u9700\u624b\u52a8\u6838\u5bf9", -1)) ], 64)) : cur.value.status === "unsupported" ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 1
        }, [ vue.createElementVNode("div", _hoisted_73, [ vue.createElementVNode("span", _hoisted_74, "\u7b2c " + vue.toDisplayString(curInx.value + 1) + " \u9898", 1), _cache[80] || (_cache[80] = vue.createElementVNode("span", {
          class: "tag neutral"
        }, "\u5185\u5bb9\u89e3\u6790\u5931\u8d25", -1)) ]), _cache[81] || (_cache[81] = vue.createElementVNode("div", {
          class: "stem"
        }, "\uff08\u9898\u76ee\u65e0\u5408\u6cd5\u6587\u5b57\u6216\u56fe\u7247\uff0c\u5df2\u8df3\u8fc7\uff09", -1)), _cache[82] || (_cache[82] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u672a\u641c\u7d22 \xb7 \u672a\u6263\u5206 \xb7 \u672a\u56de\u586b", -1)) ], 64)) : (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 2
        }, [ vue.createElementVNode("div", _hoisted_75, [ vue.createElementVNode("span", _hoisted_76, "\u7b2c " + vue.toDisplayString(curInx.value + 1) + " \u9898", 1), vue.createElementVNode("div", _hoisted_77, [ cur.value.treeProgress && cur.value.treeProgress.total > 1 ? (vue.openBlock(), 
        vue.createElementBlock("span", _hoisted_78, " \u7236\u9898 " + vue.toDisplayString(cur.value.treeProgress.hit) + "/" + vue.toDisplayString(cur.value.treeProgress.total) + " \xb7 " + vue.toDisplayString(treeStatusLabel(cur.value.treeProgress.status)), 1)) : vue.createCommentVNode("", true), vue.createElementVNode("button", {
          class: "btn ghost sm sub",
          disabled: running.value,
          onClick: reAnswerCurrent
        }, "\u91cd\u7b54\u672c\u9898", 8, _hoisted_79) ]) ]), vue.createElementVNode("div", _hoisted_80, [ vue.createElementVNode("span", _hoisted_81, "[" + vue.toDisplayString(currentTypeLabel.value) + "]", 1), vue.createVNode(_sfc_main$1, {
          content: cur.value.q.stem,
          "max-height": "180px"
        }, null, 8, [ "content" ]) ]), vue.createElementVNode("div", _hoisted_82, [ (vue.openBlock(true), 
        vue.createElementBlock(vue.Fragment, null, vue.renderList(shownOpts.value, x => (vue.openBlock(), 
        vue.createElementBlock("div", {
          key: x.i,
          class: "optrow"
        }, [ vue.createElementVNode("span", {
          class: vue.normalizeClass([ "opt", {
            hit: isHit(x.i)
          } ])
        }, [ vue.createTextVNode(vue.toDisplayString(letter2(x.i)) + ". ", 1), vue.createVNode(_sfc_main$1, {
          content: x.o,
          "max-height": "120px"
        }, null, 8, [ "content" ]) ], 2) ]))), 128)) ]), collapsible.value ? (vue.openBlock(), 
        vue.createElementBlock("button", {
          key: 0,
          class: "expand",
          style: {
            "align-self": "flex-start"
          },
          onClick: _cache[7] || (_cache[7] = $event => optsExpanded.value = !optsExpanded.value)
        }, [ vue.createTextVNode(vue.toDisplayString(optsExpanded.value ? "\u6536\u8d77\u9009\u9879" : `\u5c55\u5f00\u9009\u9879\uff08${cur.value.q.options.length}\uff09`) + " ", 1), (vue.openBlock(), 
        vue.createElementBlock("svg", {
          class: vue.normalizeClass([ "ic sm chev", {
            right: !optsExpanded.value
          } ])
        }, [ ..._cache[83] || (_cache[83] = [ vue.createElementVNode("use", {
          href: "#i-chevron"
        }, null, -1) ]) ], 2)) ])) : vue.createCommentVNode("", true), vue.createElementVNode("div", _hoisted_83, [ vue.createElementVNode("div", _hoisted_84, [ _cache[84] || (_cache[84] = vue.createElementVNode("span", {
          class: "answer-label"
        }, "\u53c2\u8003\u7b54\u6848", -1)), vue.createElementVNode("div", _hoisted_85, [ cur.value.aiGenerated ? (vue.openBlock(), 
        vue.createElementBlock("span", _hoisted_86, "AI \u751f\u6210 \xb7 \u5f85\u6838\u5bf9")) : vue.createCommentVNode("", true), cur.value.answer.length ? (vue.openBlock(), 
        vue.createElementBlock("span", _hoisted_87, vue.toDisplayString(cur.value.filled ? "\u5df2\u56de\u586b" : "\u5339\u914d\u5931\u8d25"), 1)) : vue.createCommentVNode("", true) ]) ]), _cache[86] || (_cache[86] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u7b54\u6848\u4ec5\u4f9b\u53c2\u8003\uff0c\u81ea\u884c\u6838\u5bf9\u3002", -1)), ((_a2 = cur.value.answerPlan) == null ? void 0 : _a2.kind) === "slots" ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_88, [ (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(cur.value.answerPlan.slots, (slot, slotIndex) => (vue.openBlock(), 
        vue.createElementBlock("div", {
          key: slot.slotId,
          class: "answer-item"
        }, [ vue.createElementVNode("span", _hoisted_89, "\u7a7a " + vue.toDisplayString(slotIndex + 1), 1), vue.createElementVNode("span", _hoisted_90, [ (vue.openBlock(true), 
        vue.createElementBlock(vue.Fragment, null, vue.renderList(slot.values, (value, valueIndex) => (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: valueIndex
        }, [ valueIndex ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_91, "\u3001")) : vue.createCommentVNode("", true), vue.createVNode(_sfc_main$1, {
          content: value,
          "max-height": "120px"
        }, null, 8, [ "content" ]) ], 64))), 128)) ]) ]))), 128)) ])) : ((_b = cur.value.answerPlan) == null ? void 0 : _b.kind) === "matching-pair" ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_92, [ _cache[85] || (_cache[85] = vue.createElementVNode("span", {
          class: "answer-key"
        }, "\u914d\u5bf9", -1)), vue.createElementVNode("span", _hoisted_93, [ vue.createVNode(_sfc_main$1, {
          content: cur.value.answerPlan.displayValue,
          "max-height": "120px"
        }, null, 8, [ "content" ]) ]) ])) : cur.value.answer.length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_94, [ (vue.openBlock(true), 
        vue.createElementBlock(vue.Fragment, null, vue.renderList(cur.value.answer, (answer, index) => (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: index
        }, [ index ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_95, "\u3001")) : vue.createCommentVNode("", true), vue.createVNode(_sfc_main$1, {
          content: answer,
          "max-height": "120px"
        }, null, 8, [ "content" ]) ], 64))), 128)) ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_96, vue.toDisplayString(cur.value.status === "pending" ? "\u7b49\u5f85\u67e5\u9898" : "\u6682\u672a\u627e\u5230\u7b54\u6848"), 1)) ]) ], 64)) ])) : vue.createCommentVNode("", true) ], 64)) : tab.value === "harvest" ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 2
        }, [ harvestedList.value.length ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, {
          key: 0
        }, [ vue.createElementVNode("div", _hoisted_97, [ vue.createElementVNode("div", _hoisted_98, [ _cache[87] || (_cache[87] = vue.createElementVNode("span", {
          class: "locator"
        }, "\u672c\u9875\u6536\u5f55", -1)), vue.createElementVNode("div", _hoisted_99, [ vue.createElementVNode("span", _hoisted_100, vue.toDisplayString(harvestedList.value.length) + " \u9898", 1), vue.createElementVNode("button", {
          class: "btn ghost sm",
          onClick: exportHarvest
        }, "\u5bfc\u51fa\u672c\u9875\u6536\u5f55") ]) ]), _cache[88] || (_cache[88] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u505a\u8fc7\u5e76\u51fa\u5206\u7684\u9898\u76ee\u5df2\u6536\u5f55\u5230\u672c\u673a\uff0c\u547d\u4e2d\u4e0d\u6263\u5206\u3001\u4e0d\u8054\u7f51\u3002\u5168\u90e8\u8bb0\u5f55\u4e0e\u5907\u4efd\u5728\u300c\u7cfb\u7edf \xb7 \u7f13\u5b58\u300d\u3002", -1)) ]), (vue.openBlock(true), 
        vue.createElementBlock(vue.Fragment, null, vue.renderList(harvestedList.value, (h, i) => (vue.openBlock(), 
        vue.createElementBlock("div", {
          key: h.unitHash,
          class: "ent"
        }, [ vue.createElementVNode("div", _hoisted_101, [ vue.createElementVNode("span", _hoisted_102, vue.toDisplayString(h.stem ? vue.unref(harvestTypeLabel)(h.itemType) : "\u65e0\u9898\u9762"), 1), vue.createElementVNode("span", _hoisted_103, vue.toDisplayString(i + 1), 1), !h.persisted ? (vue.openBlock(), 
        vue.createElementBlock("span", _hoisted_104, "\xb7 \u672a\u4fdd\u5b58")) : vue.createCommentVNode("", true) ]), vue.createElementVNode("div", {
          class: vue.normalizeClass([ "ent-q", {
            "cap-mute": !h.stem
          } ])
        }, vue.toDisplayString(h.stem || "\u8fd9\u6761\u6ca1\u6709\u9898\u9762\uff08\u6765\u6e90\u672a\u63d0\u4f9b\uff09\uff0c\u4ecd\u53ef\u6b63\u5e38\u547d\u4e2d"), 3), vue.createElementVNode("div", _hoisted_105, vue.toDisplayString(h.values.join("\u3001")), 1), h.options && h.options.length ? (vue.openBlock(), 
        vue.createElementBlock("details", _hoisted_106, [ vue.createElementVNode("summary", _hoisted_107, "\u9009\u9879 " + vue.toDisplayString(h.options.length) + " \u9879", 1), (vue.openBlock(true), 
        vue.createElementBlock(vue.Fragment, null, vue.renderList(h.options, (op, oi) => (vue.openBlock(), 
        vue.createElementBlock("div", {
          key: oi,
          class: "cap-mute"
        }, vue.toDisplayString(letter2(oi)) + "\u3001" + vue.toDisplayString(op), 1))), 128)) ])) : vue.createCommentVNode("", true) ]))), 128)) ], 64)) : (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 1
        }, [ vue.createElementVNode("div", _hoisted_108, [ _cache[89] || (_cache[89] = vue.createElementVNode("div", {
          class: "standby-title"
        }, "\u672c\u9875\u6682\u65e0\u6536\u5f55", -1)), vue.createElementVNode("div", _hoisted_109, "\u6253\u5f00\u5df2\u6279\u9605\u7684\u4f5c\u4e1a\u6216\u8003\u8bd5\u7ed3\u679c\u9875\uff0c\u4f1a\u81ea\u52a8\u628a\u4f60\u505a\u5bf9\u7684\u9898\u6536\u5f55\u5230\u672c\u673a\u3002\u7d2f\u8ba1\u5df2\u6536\u5f55 " + vue.toDisplayString(localCacheCount.value) + " \u9898\uff0c\u5168\u90e8\u8bb0\u5f55\u5728\u300c\u7cfb\u7edf \xb7 \u7f13\u5b58\u300d\u3002", 1) ]), vue.createElementVNode("button", {
          class: "btn ghost block",
          onClick: goCacheManage
        }, "\u53bb\u7f13\u5b58\u7ba1\u7406") ], 64)) ], 64)) : tab.value === "system" && systemSub.value === "general" ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 3
        }, [ hasFeature("answer") ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_110, [ _cache[93] || (_cache[93] = vue.createElementVNode("div", {
          class: "gh2"
        }, "\u7b54\u9898\u884c\u4e3a", -1)), vue.createElementVNode("div", _hoisted_111, [ _cache[90] || (_cache[90] = vue.createElementVNode("span", {
          class: "lbl"
        }, "\u7b54\u9898\u95f4\u9694", -1)), vue.createElementVNode("span", _hoisted_112, vue.toDisplayString(settings.delayMs) + " ms", 1) ]), vue.withDirectives(vue.createElementVNode("input", {
          class: "range",
          type: "range",
          min: "500",
          max: "4000",
          step: "500",
          "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => settings.delayMs = $event),
          onChange: persist
        }, null, 544), [ [ vue.vModelText, settings.delayMs, void 0, {
          number: true
        } ] ]), _cache[94] || (_cache[94] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u76f8\u90bb\u4e24\u9898\u4e4b\u95f4\u7684\u5904\u7406\u95f4\u9694", -1)), (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, null, vue.renderList(GENERAL_SWITCHES, s => (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: s.key
        }, [ vue.createElementVNode("div", _hoisted_113, [ vue.createElementVNode("button", {
          class: vue.normalizeClass([ "switch", {
            off: !settings[s.key]
          } ]),
          onClick: s.toggle,
          "aria-label": `${s.label}\u5f00\u5173`
        }, [ ..._cache[91] || (_cache[91] = [ vue.createElementVNode("i", null, null, -1) ]) ], 10, _hoisted_114), vue.createElementVNode("span", _hoisted_115, vue.toDisplayString(s.label), 1) ]), vue.createElementVNode("div", _hoisted_116, vue.toDisplayString(s.hint), 1) ], 64))), 64)), vue.createElementVNode("div", _hoisted_117, [ _cache[92] || (_cache[92] = vue.createElementVNode("span", {
          class: "lbl"
        }, "\u63d0\u4ea4\u9608\u503c", -1)), vue.createElementVNode("span", _hoisted_118, "\u53ef\u4fe1\u547d\u4e2d \u2265 " + vue.toDisplayString(Math.round(settings.autoSubmitThreshold * 100)) + "%", 1) ]), vue.withDirectives(vue.createElementVNode("input", {
          class: "range",
          type: "range",
          min: "0.5",
          max: "1",
          step: "0.05",
          "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => settings.autoSubmitThreshold = $event),
          onChange: persist
        }, null, 544), [ [ vue.vModelText, settings.autoSubmitThreshold, void 0, {
          number: true
        } ] ]), _cache[95] || (_cache[95] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u8fbe\u5230\u9608\u503c\u624d\u63d0\u4ea4\uff0c\u4f4e\u4e8e\u53ea\u6682\u5b58\u3002\u968f\u673a\u4f5c\u7b54\u586b\u7684\u7a7a\u4e0d\u7b97\u53ef\u4fe1\u547d\u4e2d\u3002", -1)) ])) : vue.createCommentVNode("", true), _cache[103] || (_cache[103] = vue.createElementVNode("div", {
          class: "sep"
        }, null, -1)), vue.createElementVNode("div", _hoisted_119, [ _cache[98] || (_cache[98] = vue.createElementVNode("div", {
          class: "gh2"
        }, "\u9690\u79c1", -1)), vue.createElementVNode("div", _hoisted_120, [ vue.createElementVNode("button", {
          class: vue.normalizeClass([ "switch", {
            off: !settings.reportUsage
          } ]),
          onClick: toggleReport,
          "aria-label": "\u4e0a\u62a5\u533f\u540d\u5065\u5eb7\u5f00\u5173"
        }, [ ..._cache[96] || (_cache[96] = [ vue.createElementVNode("i", null, null, -1) ]) ], 2), _cache[97] || (_cache[97] = vue.createElementVNode("span", {
          class: "lbl",
          style: {
            flex: "1"
          }
        }, "\u4e0a\u62a5\u533f\u540d\u5065\u5eb7", -1)) ]), _cache[99] || (_cache[99] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u4ec5\u4e0a\u62a5\u547d\u4e2d\u7387\u4e0e\u9898\u578b\uff0c\u4e0d\u542b\u9898\u9762\u4e0e\u8d26\u53f7", -1)) ]), _cache[104] || (_cache[104] = vue.createElementVNode("div", {
          class: "sep"
        }, null, -1)), vue.createElementVNode("div", _hoisted_121, [ _cache[102] || (_cache[102] = vue.createElementVNode("div", {
          class: "gh2"
        }, "\u6570\u636e\u4e0e\u66f4\u65b0", -1)), vue.createElementVNode("div", _hoisted_122, [ vue.createElementVNode("div", null, [ _cache[100] || (_cache[100] = vue.createElementVNode("div", {
          class: "lbl"
        }, "\u672c\u5730\u7b54\u6848\u7f13\u5b58", -1)), vue.createElementVNode("div", _hoisted_123, "\u5df2\u6536\u5f55 " + vue.toDisplayString(localCacheCount.value) + " \u9898 \xb7 \u53ea\u5b58\u4f60\u505a\u8fc7\u5e76\u51fa\u5206\u7684\u9898\u76ee \xb7 \u547d\u4e2d\u4e0d\u6263\u5206\u3001\u4e0d\u8054\u7f51", 1) ]), vue.createElementVNode("button", {
          class: "btn ghost sm",
          onClick: _cache[10] || (_cache[10] = $event => systemSub.value = "cache")
        }, "\u7ba1\u7406") ]), cachePersistFailed.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_124, "\u5b58\u4e0d\u4e0b\u4e86 \xb7 \u672c\u673a\u5b58\u50a8\u5199\u5165\u88ab\u62d2\uff0c\u6700\u8fd1\u7684\u6536\u5f55\u6ca1\u6709\u843d\u76d8\u3002\u5230\u7f13\u5b58\u9875\u5bfc\u51fa\u5907\u4efd\u5e76\u6e05\u7406\u3002")) : cacheOverWarn.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_125, "\u5df2\u8d85\u51fa\u5efa\u8bae\u5bb9\u91cf " + vue.toDisplayString(vue.unref(CACHE_WARN_ENTRIES)) + " \u9898 \xb7 \u4e0d\u4f1a\u81ea\u52a8\u5220\u9664\u8bb0\u5f55\uff0c\u5efa\u8bae\u5bfc\u51fa\u5907\u4efd\u540e\u6e05\u7406\u3002", 1)) : vue.createCommentVNode("", true), vue.createElementVNode("div", _hoisted_126, [ _cache[101] || (_cache[101] = vue.createElementVNode("div", null, [ vue.createElementVNode("div", {
          class: "lbl"
        }, "\u89c4\u5219\u66f4\u65b0"), vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u6bcf 24 \u5c0f\u65f6\u81ea\u52a8\u68c0\u67e5 \xb7 \u6bcf\u4e2a\u89c4\u5219\u5305\u72ec\u7acb\u9a8c\u7b7e") ], -1)), vue.createElementVNode("button", {
          class: "btn ghost sm",
          disabled: running.value || ruleUpdating.value,
          onClick: updateRules
        }, vue.toDisplayString(ruleUpdating.value ? "\u68c0\u67e5\u4e2d\u2026" : "\u68c0\u67e5\u66f4\u65b0"), 9, _hoisted_127) ]), ruleUpdateNote.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_128, vue.toDisplayString(ruleUpdateNote.value), 1)) : vue.createCommentVNode("", true) ]) ], 64)) : tab.value === "system" && systemSub.value === "course" ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 4
        }, [ vue.createElementVNode("div", _hoisted_129, [ _cache[109] || (_cache[109] = vue.createElementVNode("div", {
          class: "gh2"
        }, "\u5b66\u4e60\u884c\u4e3a", -1)), vue.createElementVNode("div", _hoisted_130, [ vue.createElementVNode("button", {
          class: vue.normalizeClass([ "switch", {
            off: !settings.courseAuto
          } ]),
          onClick: _cache[11] || (_cache[11] = (...args) => vue.unref(toggleCourseAuto) && vue.unref(toggleCourseAuto)(...args)),
          "aria-label": "\u4efb\u52a1\u70b9\u81ea\u52a8\u64ad\u653e\u5f00\u5173"
        }, [ ..._cache[105] || (_cache[105] = [ vue.createElementVNode("i", null, null, -1) ]) ], 2), _cache[106] || (_cache[106] = vue.createElementVNode("span", {
          class: "lbl",
          style: {
            flex: "1"
          }
        }, "\u81ea\u52a8\u64ad\u653e\u89c6\u9891/\u97f3\u9891\uff08\u5b9e\u9a8c\uff09", -1)) ]), vue.createElementVNode("div", _hoisted_131, [ _cache[107] || (_cache[107] = vue.createElementVNode("span", {
          class: "lbl"
        }, "\u64ad\u653e\u500d\u901f", -1)), vue.createElementVNode("span", _hoisted_132, vue.toDisplayString(settings.coursePlaybackRate) + "\xd7", 1) ]), vue.withDirectives(vue.createElementVNode("input", {
          class: "range",
          type: "range",
          min: "1",
          max: "2",
          step: "0.5",
          "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => settings.coursePlaybackRate = $event),
          onChange: persist
        }, null, 544), [ [ vue.vModelText, settings.coursePlaybackRate, void 0, {
          number: true
        } ] ]), vue.createElementVNode("div", _hoisted_133, [ _cache[108] || (_cache[108] = vue.createElementVNode("span", {
          class: "lbl"
        }, "\u5f53\u524d\u72b6\u6001", -1)), vue.createElementVNode("span", _hoisted_134, vue.toDisplayString(mediaStatusText.value), 1) ]) ]), _cache[113] || (_cache[113] = vue.createElementVNode("div", {
          class: "sep"
        }, null, -1)), vue.createElementVNode("div", _hoisted_135, [ _cache[111] || (_cache[111] = vue.createElementVNode("div", {
          class: "gh2"
        }, "\u5904\u7406\u54ea\u4e9b\u4efb\u52a1\u70b9", -1)), (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(taskToggles), k => (vue.openBlock(), 
        vue.createElementBlock("div", {
          class: "switch-row",
          key: k
        }, [ vue.createElementVNode("button", {
          class: vue.normalizeClass([ "switch", {
            off: !settings.courseTaskToggles[k]
          } ]),
          onClick: $event => toggleTaskKind(k),
          "aria-label": `${vue.unref(taskToggleLabel)[k]}\u4efb\u52a1\u70b9\u5f00\u5173`
        }, [ ..._cache[110] || (_cache[110] = [ vue.createElementVNode("i", null, null, -1) ]) ], 10, _hoisted_136), vue.createElementVNode("span", _hoisted_137, vue.toDisplayString(vue.unref(taskToggleLabel)[k]), 1) ]))), 128)), _cache[112] || (_cache[112] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u5173\u6389\u7684\u7c7b\u578b\u76f4\u63a5\u8df3\u8fc7\uff0c\u4e5f\u4e0d\u8ba1\u5165\u672c\u8282\u8fd8\u5269\u591a\u5c11\u6ca1\u505a\u3002", -1)) ]) ], 64)) : tab.value === "system" && systemSub.value === "cache" ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 5
        }, [ cacheImportPreview.value ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, {
          key: 0
        }, [ _cache[119] || (_cache[119] = vue.createElementVNode("div", {
          class: "ctitle"
        }, "\u5bfc\u5165\u7f13\u5b58", -1)), vue.createElementVNode("div", _hoisted_138, [ vue.createElementVNode("div", _hoisted_139, [ _cache[114] || (_cache[114] = vue.createElementVNode("span", {
          class: "k"
        }, "\u6587\u4ef6\u5185", -1)), vue.createElementVNode("b", null, vue.toDisplayString(cacheImportPreview.value.fileCount) + " \u6761", 1) ]), vue.createElementVNode("div", _hoisted_140, [ _cache[115] || (_cache[115] = vue.createElementVNode("span", {
          class: "k"
        }, "\u5c06\u65b0\u589e", -1)), vue.createElementVNode("b", null, vue.toDisplayString(cacheImportPreview.value.added) + " \u6761", 1) ]), vue.createElementVNode("div", _hoisted_141, [ _cache[116] || (_cache[116] = vue.createElementVNode("span", {
          class: "k"
        }, "\u5c06\u8986\u76d6", -1)), vue.createElementVNode("b", null, vue.toDisplayString(cacheImportPreview.value.replaced) + " \u6761", 1), _cache[117] || (_cache[117] = vue.createElementVNode("span", {
          class: "cap-mute"
        }, "\u540c\u9898\u5c06\u88ab\u66ff\u6362", -1)) ]), vue.createElementVNode("div", _hoisted_142, [ _cache[118] || (_cache[118] = vue.createElementVNode("span", {
          class: "k"
        }, "\u5bfc\u5165\u540e", -1)), vue.createElementVNode("b", null, vue.toDisplayString(cacheImportPreview.value.total) + " \u9898", 1) ]) ]), cacheImportPreview.value.replaced ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_143, "\u5c06\u8986\u76d6 " + vue.toDisplayString(cacheImportPreview.value.replaced) + " \u6761\u5df2\u6709\u8bb0\u5f55 \xb7 \u91cc\u9762\u53ef\u80fd\u6709\u4f60\u505a\u8fc7\u5e76\u51fa\u5206\u540e\u6536\u5f55\u7684\u7b54\u6848\uff0c\u5bfc\u5165\u4f1a\u7528\u6587\u4ef6\u91cc\u7684\u7b54\u6848\u9876\u6389\u5b83\u4eec\uff0c\u9876\u6389\u540e\u4e0d\u53ef\u64a4\u9500\u3002\u60f3\u7559\u5e95\u5c31\u5148\u53d6\u6d88\uff0c\u5bfc\u51fa\u4e00\u4efd\u518d\u5bfc\u5165\u3002", 1)) : vue.createCommentVNode("", true), _cache[120] || (_cache[120] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u5bfc\u5165\u7684\u7b54\u6848\u547d\u4e2d\u65f6\u4e0d\u6263\u5206\u3002\u7231\u95ee\u7b54\u4e0d\u6838\u9a8c\u5bfc\u5165\u5185\u5bb9\u662f\u5426\u6b63\u786e\uff0c\u63d0\u4ea4\u4f5c\u4e1a\u524d\u81ea\u884c\u6838\u5bf9\u3002", -1)), _cache[121] || (_cache[121] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u5bfc\u5165\u4e0d\u4f1a\u6dd8\u6c70\u5df2\u6709\u8bb0\u5f55\uff0c\u4e5f\u4e0d\u4f1a\u6539\u52a8\u5df2\u56de\u586b\u7684\u9875\u9762\u6216\u89e6\u53d1\u63d0\u4ea4\u3002", -1)) ], 64)) : cacheClearPending.value ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 1
        }, [ _cache[124] || (_cache[124] = vue.createElementVNode("div", {
          class: "ctitle"
        }, "\u6e05\u7a7a\u7f13\u5b58", -1)), vue.createElementVNode("div", _hoisted_144, [ vue.createElementVNode("div", _hoisted_145, [ _cache[122] || (_cache[122] = vue.createElementVNode("span", {
          class: "k"
        }, "\u5c06\u6e05\u7a7a", -1)), vue.createElementVNode("b", null, vue.toDisplayString(cacheEntries.value.length) + " \u9898", 1) ]), _cache[123] || (_cache[123] = vue.createElementVNode("div", {
          class: "prow"
        }, [ vue.createElementVNode("span", {
          class: "k"
        }, "\u5f71\u54cd"), vue.createElementVNode("span", null, "\u518d\u9047\u5230\u8fd9\u4e9b\u9898\u9700\u91cd\u65b0\u67e5\u8be2\uff0c\u4ed8\u8d39\u547d\u4e2d\u4f1a\u91cd\u65b0\u6263\u5206\u3002") ], -1)) ]), _cache[125] || (_cache[125] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u6e05\u7a7a\u4e0d\u53ef\u64a4\u9500\u3002\u5bfc\u51fa\u53ef\u7559\u4e00\u4efd\u5907\u4efd\u3002", -1)) ], 64)) : !cacheEntries.value.length ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 2
        }, [ _cache[126] || (_cache[126] = vue.createElementVNode("div", {
          class: "standby"
        }, [ vue.createElementVNode("div", {
          class: "standby-title"
        }, "\u5c1a\u65e0\u7f13\u5b58"), vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u505a\u8fc7\u5e76\u51fa\u5206\u7684\u9898\u76ee\u4f1a\u88ab\u6536\u5f55\u5230\u672c\u673a\uff0c\u8fd9\u662f\u7f13\u5b58\u7684\u552f\u4e00\u6765\u6e90\uff1b\u9898\u5e93\u7b54\u6848\u4e0d\u5165\u7f13\u5b58\u3002\u4e0b\u6b21\u9047\u5230\u540c\u9898\u76f4\u63a5\u547d\u4e2d\uff0c\u4e0d\u6263\u5206\u3001\u4e0d\u8054\u7f51\u3002") ], -1)), vue.createElementVNode("button", {
          class: "btn ghost block",
          onClick: pickImportFile
        }, "\u4ece\u6587\u4ef6\u5bfc\u5165"), vue.createElementVNode("a", {
          class: "btn ghost block",
          href: PARSE_IMPORT_URL,
          target: "_blank",
          rel: "noopener noreferrer"
        }, "\u89e3\u6790\u5bfc\u5165") ], 64)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, {
          key: 3
        }, [ vue.createElementVNode("div", _hoisted_146, [ vue.createElementVNode("span", _hoisted_147, [ vue.createElementVNode("b", null, vue.toDisplayString(cacheEntries.value.length), 1), vue.createTextVNode(" / " + vue.toDisplayString(vue.unref(CACHE_WARN_ENTRIES)) + " \u9898", 1) ]), vue.createElementVNode("div", _hoisted_148, [ vue.createElementVNode("i", {
          class: vue.normalizeClass({
            over: cacheOverWarn.value
          }),
          style: vue.normalizeStyle({
            width: `${Math.min(100, cacheEntries.value.length / vue.unref(CACHE_WARN_ENTRIES) * 100)}%`
          })
        }, null, 6) ]) ]), cachePersistFailed.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_149, "\u5b58\u4e0d\u4e0b\u4e86 \xb7 \u672c\u673a\u5b58\u50a8\u5199\u5165\u88ab\u62d2\uff0c\u6700\u8fd1\u7684\u6536\u5f55\u6ca1\u6709\u843d\u76d8\u3002\u5148\u5bfc\u51fa\u5907\u4efd\uff0c\u518d\u5220\u6389\u4e00\u4e9b\u4e0d\u9700\u8981\u7684\u8bb0\u5f55\u3002")) : cacheOverWarn.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_150, "\u5df2\u8d85\u51fa\u5efa\u8bae\u5bb9\u91cf \xb7 \u4e0d\u4f1a\u81ea\u52a8\u5220\u9664\u4efb\u4f55\u8bb0\u5f55\uff0c\u4f46\u8868\u8d8a\u5927\u5199\u5165\u8d8a\u6162\u3002\u5efa\u8bae\u5bfc\u51fa\u5907\u4efd\u540e\u6e05\u7406\u4e0d\u518d\u9700\u8981\u7684\u3002")) : cacheNearWarn.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_151, "\u63a5\u8fd1\u5efa\u8bae\u5bb9\u91cf " + vue.toDisplayString(vue.unref(CACHE_WARN_ENTRIES)) + " \u9898 \xb7 \u53ef\u5148\u5bfc\u51fa\u5907\u4efd\u3002", 1)) : vue.createCommentVNode("", true), _cache[129] || (_cache[129] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u547d\u4e2d\u7f13\u5b58\u4e0d\u6263\u5206\u3001\u4e0d\u8054\u7f51\u3002\u53ea\u6536\u5f55\u4f60\u505a\u8fc7\u5e76\u51fa\u5206\u7684\u9898\u76ee\uff0c\u4e0d\u4f1a\u81ea\u52a8\u5220\u9664\u3002", -1)), importedNeverHit.value.total ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 3
        }, [ importedNeverHit.value.neverHit === importedNeverHit.value.total ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_152, "\u5bfc\u5165\u7684 " + vue.toDisplayString(importedNeverHit.value.total) + " \u6761\u4e00\u6761\u90fd\u8fd8\u6ca1\u547d\u4e2d\u8fc7 \xb7 \u5982\u679c\u5176\u4e2d\u7684\u9898\u4f60\u5df2\u7ecf\u505a\u5230\u8fc7\uff0c\u591a\u534a\u662f\u9898\u9762\u4e0e\u9875\u9762\u5bf9\u4e0d\u4e0a\u3002\u5148\u62ff\u4e00\u9053\u5df2\u77e5\u7684\u9898\u9a8c\u4e00\u6b21\u518d\u8bf4\u3002", 1)) : (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_153, "\u5bfc\u5165 " + vue.toDisplayString(importedNeverHit.value.total) + " \u6761 \xb7 \u5176\u4e2d " + vue.toDisplayString(importedNeverHit.value.neverHit) + " \u6761\u6682\u672a\u547d\u4e2d\u3002", 1)), _cache[127] || (_cache[127] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u300c\u547d\u4e2d\u300d\u53ea\u8868\u793a\u9898\u76ee\u5bf9\u4e0a\u4e86\u53f7\uff0c\u4e0d\u8868\u793a\u7b54\u6848\u771f\u7684\u7528\u4e0a\u4e86\u3002\u8fd9\u4e2a\u6570\u53ea\u4f5c\u53c2\u8003\uff1a\u521a\u547d\u4e2d\u7684\u6700\u591a\u4e00\u5206\u949f\u540e\u624d\u8ba1\u5165\uff0c\u5173\u9875\u9762\u592a\u5feb\u5c31\u6c38\u8fdc\u4e0d\u8ba1\uff1b\u6682\u672a\u547d\u4e2d\u91cc\u65e2\u6709\u4f60\u8fd8\u6ca1\u505a\u5230\u7684\u9898\uff0c\u4e5f\u53ef\u80fd\u6709\u9898\u9762\u5bf9\u4e0d\u4e0a\u7684\u3002", -1)) ], 64)) : vue.createCommentVNode("", true), vue.withDirectives(vue.createElementVNode("input", {
          class: "in",
          "onUpdate:modelValue": _cache[13] || (_cache[13] = $event => cacheQuery.value = $event),
          placeholder: "\u641c\u7d22\u9898\u5e72\u6216\u7b54\u6848"
        }, null, 512), [ [ vue.vModelText, cacheQuery.value ] ]), cacheNote.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_154, vue.toDisplayString(cacheNote.value), 1)) : vue.createCommentVNode("", true), matchedCache.value.length > CACHE_LIST_LIMIT ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_155, "\u5171 " + vue.toDisplayString(matchedCache.value.length) + " \u6761 \xb7 \u53ea\u5217\u51fa\u524d " + vue.toDisplayString(CACHE_LIST_LIMIT) + " \u6761\uff0c\u7528\u641c\u7d22\u7f29\u5c0f\u8303\u56f4\u3002", 1)) : vue.createCommentVNode("", true), (vue.openBlock(true), 
        vue.createElementBlock(vue.Fragment, null, vue.renderList(filteredCache.value, entry => (vue.openBlock(), 
        vue.createElementBlock("div", {
          key: entry.unitHash,
          class: "ent"
        }, [ vue.createElementVNode("div", _hoisted_156, [ vue.createElementVNode("span", _hoisted_157, vue.toDisplayString(entry.stem ? vue.unref(harvestTypeLabel)(entry.itemType) : "\u65e0\u9898\u9762"), 1), entry.importedAt ? (vue.openBlock(), 
        vue.createElementBlock("span", _hoisted_158, "\u5bfc\u5165")) : entry.platform ? (vue.openBlock(), 
        vue.createElementBlock("span", _hoisted_159, vue.toDisplayString(entry.platform), 1)) : vue.createCommentVNode("", true), vue.createElementVNode("span", _hoisted_160, vue.toDisplayString(cacheDate(entry.savedAt)), 1), vue.createElementVNode("button", {
          class: "ent-del",
          "aria-label": `\u5220\u9664\u7f13\u5b58 ${entry.unitHash.slice(0, 8)}`,
          onClick: $event => removeCacheEntry(entry.unitHash)
        }, [ ..._cache[128] || (_cache[128] = [ vue.createElementVNode("svg", {
          class: "ic sm",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "1.7"
        }, [ vue.createElementVNode("path", {
          d: "M6 7h12M9.5 7V5.5h5V7M8 7l.7 12h6.6L16 7",
          "stroke-linecap": "round",
          "stroke-linejoin": "round"
        }) ], -1) ]) ], 8, _hoisted_161) ]), vue.createElementVNode("div", {
          class: vue.normalizeClass([ "ent-q", {
            "cap-mute": !entry.stem
          } ])
        }, vue.toDisplayString(entry.stem || "\u8fd9\u6761\u8bb0\u5f55\u6ca1\u6709\u9898\u9762\uff08\u6765\u6e90\u672a\u63d0\u4f9b\uff09\uff0c\u4ecd\u53ef\u6b63\u5e38\u547d\u4e2d"), 3), vue.createElementVNode("div", _hoisted_162, vue.toDisplayString(entry.values.join("\u3001")), 1), entry.options.length ? (vue.openBlock(), 
        vue.createElementBlock("details", _hoisted_163, [ vue.createElementVNode("summary", _hoisted_164, "\u9009\u9879 " + vue.toDisplayString(entry.options.length) + " \u9879", 1), (vue.openBlock(true), 
        vue.createElementBlock(vue.Fragment, null, vue.renderList(entry.options, (op, oi) => (vue.openBlock(), 
        vue.createElementBlock("div", {
          key: oi,
          class: "cap-mute"
        }, vue.toDisplayString(letter2(oi)) + "\u3001" + vue.toDisplayString(op), 1))), 128)) ])) : vue.createCommentVNode("", true) ]))), 128)), !filteredCache.value.length ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_165, "\u6ca1\u6709\u5339\u914d\u7684\u7f13\u5b58\u3002")) : vue.createCommentVNode("", true) ], 64)) ], 64)) : tab.value === "system" && systemSub.value === "diag" ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 6
        }, [ vue.createElementVNode("div", _hoisted_166, [ vue.createElementVNode("div", _hoisted_167, [ _cache[130] || (_cache[130] = vue.createElementVNode("span", {
          class: "ctitle"
        }, "\u5f53\u524d\u89c4\u5219", -1)), ruleDiag.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 0,
          class: vue.normalizeClass([ "tag", ruleDiag.value.source === "remote-active" ? "acc" : "neutral" ])
        }, vue.toDisplayString(ruleDiag.value.sourceLabel), 3)) : vue.createCommentVNode("", true) ]), ruleDiag.value ? (vue.openBlock(), 
        vue.createElementBlock("dl", _hoisted_168, [ _cache[131] || (_cache[131] = vue.createElementVNode("dt", null, "\u89c4\u5219\u5305", -1)), vue.createElementVNode("dd", null, vue.toDisplayString(ruleDiag.value.packageId), 1), _cache[132] || (_cache[132] = vue.createElementVNode("dt", null, "\u7248\u672c", -1)), vue.createElementVNode("dd", null, vue.toDisplayString(ruleDiag.value.version) + " \xb7 seq " + vue.toDisplayString(ruleDiag.value.releaseSequence), 1), ruleDiag.value.release ? (vue.openBlock(), 
        vue.createElementBlock("dt", _hoisted_169, "\u901a\u9053")) : vue.createCommentVNode("", true), ruleDiag.value.release ? (vue.openBlock(), 
        vue.createElementBlock("dd", _hoisted_170, vue.toDisplayString(ruleDiag.value.release.channel) + " \xb7 " + vue.toDisplayString(ruleDiag.value.release.rolloutPercent) + "%", 1)) : vue.createCommentVNode("", true), _cache[133] || (_cache[133] = vue.createElementVNode("dt", null, "\u6821\u9a8c", -1)), vue.createElementVNode("dd", null, vue.toDisplayString(ruleDiag.value.loadStatusLabel), 1) ])) : (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_171, "\u672c\u6b21\u4f1a\u8bdd\u8fd8\u6ca1\u6709\u5339\u914d\u5230\u89c4\u5219\u3002")), ruleDiag.value && (ruleDiag.value.lifecycle || ruleDiag.value.lifecycleFailure || ruleDiag.value.rechecks.used > 0) ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_172, "\u751f\u547d\u5468\u671f \xb7 " + vue.toDisplayString(ruleDiag.value.lifecycle ? `${ruleDiag.value.lifecycle.state} \xb7 \u8f6c\u79fb ${ruleDiag.value.lifecycle.transitions}` : `\u672a\u542f\u52a8 \xb7 ${ruleDiag.value.lifecycleFailure}`) + vue.toDisplayString(ruleDiag.value.eventFailure ? ` \xb7 \u6700\u8fd1\u5931\u8d25 ${ruleDiag.value.eventFailure.event} ${ruleDiag.value.eventFailure.code}` : "") + " \xb7 \u91cd\u68c0 " + vue.toDisplayString(ruleDiag.value.rechecks.used) + "/" + vue.toDisplayString(ruleDiag.value.rechecks.max), 1)) : vue.createCommentVNode("", true), ((_c = ruleDiag.value) == null ? void 0 : _c.walker.session) ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_173, "\u8d70\u67e5 \xb7 \u5df2\u5207 " + vue.toDisplayString(ruleDiag.value.walker.session.steps) + " \u9898" + vue.toDisplayString(ruleDiag.value.walker.session.lastStop ? ` \xb7 ${WALK_STOP_TEXT[ruleDiag.value.walker.session.lastStop]}` : ""), 1)) : vue.createCommentVNode("", true), ((_d = ruleDiag.value) == null ? void 0 : _d.commit.last) ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_174, "\u6682\u5b58 \xb7 " + vue.toDisplayString(COMMIT_OUTCOME_TEXT[ruleDiag.value.commit.last]) + "\uff08" + vue.toDisplayString(ruleDiag.value.commit.runs) + " \u6b21\uff09", 1)) : vue.createCommentVNode("", true), vue.createElementVNode("div", _hoisted_175, "\u5f15\u64ce " + vue.toDisplayString(vue.unref(ENGINE_ID)) + " \xb7 \u811a\u672c " + vue.toDisplayString(vue.unref(SCRIPT_VERSION)), 1), lastCaptureFailure.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_176, "\u89c4\u5219\u6355\u83b7\u5931\u8d25 \xb7 " + vue.toDisplayString(lastCaptureFailure.value) + " \xb7 \u8fd9\u9875\u4e0d\u662f\u6ca1\u6709\u9898\uff0c\u662f\u89c4\u5219\u6ca1\u8dd1\u5b8c", 1)) : vue.createCommentVNode("", true) ]), vue.createElementVNode("div", _hoisted_177, [ vue.createElementVNode("div", {
          class: "row"
        }, [ _cache[134] || (_cache[134] = vue.createElementVNode("span", {
          class: "ctitle"
        }, "\u8fd0\u884c\u65e5\u5fd7", -1)), vue.createElementVNode("button", {
          class: "btn ghost sm",
          onClick: clearLogs
        }, "\u6e05\u7a7a") ]), vue.createElementVNode("div", _hoisted_178, [ (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(LOG_LEVELS, lvl => vue.createElementVNode("button", {
          key: lvl.k,
          class: vue.normalizeClass([ "seg", {
            active: logFilter.value === lvl.k
          } ]),
          onClick: $event => logFilter.value = lvl.k
        }, vue.toDisplayString(lvl.l), 11, _hoisted_179)), 64)) ]), filteredLogs.value.length ? (vue.openBlock(), 
        vue.createElementBlock("ul", _hoisted_180, [ (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(filteredLogs.value, (item, i) => (vue.openBlock(), 
        vue.createElementBlock("li", {
          key: i,
          class: vue.normalizeClass([ "log-row", `log-${item.type}` ])
        }, [ vue.createElementVNode("span", _hoisted_181, vue.toDisplayString(item.time), 1), vue.createElementVNode("span", _hoisted_182, [ vue.createTextVNode(vue.toDisplayString(item.content), 1), item.repeat > 1 ? (vue.openBlock(), 
        vue.createElementBlock("span", _hoisted_183, " \xd7 " + vue.toDisplayString(item.repeat), 1)) : vue.createCommentVNode("", true) ]) ], 2))), 128)) ])) : (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_184, "\u6682\u65e0\u65e5\u5fd7")) ]), vue.createElementVNode("div", _hoisted_185, [ vue.createElementVNode("button", {
          class: "fold",
          onClick: _cache[14] || (_cache[14] = $event => diagOpen.value = !diagOpen.value)
        }, [ _cache[136] || (_cache[136] = vue.createTextVNode("\u9875\u9762\u8bca\u65ad \xb7 \u53ea\u8bc6\u522b\u4e0d\u6263\u5206", -1)), (vue.openBlock(), 
        vue.createElementBlock("svg", {
          class: vue.normalizeClass([ "ic sm chev", {
            right: !diagOpen.value
          } ])
        }, [ ..._cache[135] || (_cache[135] = [ vue.createElementVNode("use", {
          href: "#i-chevron"
        }, null, -1) ]) ], 2)) ]), diagOpen.value ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, {
          key: 0
        }, [ vue.createElementVNode("button", {
          class: "btn ghost sm",
          disabled: running.value,
          onClick: runDiag
        }, "\u8fd0\u884c\u8bca\u65ad", 8, _hoisted_186), diag.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_187, [ vue.createTextVNode(vue.toDisplayString(diag.value.matched ? `\u547d\u4e2d${platformLabel.value} \xb7 \u6293\u5230 ${diag.value.count} \u9898 \xb7 \u56fe\u7247 ${diag.value.imageCount} \u5f20 \xb7 \u6536\u5f55 ${diag.value.harvestedCount} \u9898` : "\u672a\u547d\u4e2d\u5f53\u524d\u9875") + " ", 1), (vue.openBlock(true), 
        vue.createElementBlock(vue.Fragment, null, vue.renderList(diag.value.items, (it, i) => (vue.openBlock(), 
        vue.createElementBlock("div", {
          key: i
        }, vue.toDisplayString(i + 1) + ". [" + vue.toDisplayString(it.type) + "] " + vue.toDisplayString(it.decodeFailed ? "\u89e3\u7801\u5931\u8d25" : it.stemPreview) + " \xb7 " + vue.toDisplayString(it.optionCount) + " \u9009\u9879", 1))), 128)), diag.value.ruleFlow && diag.value.ruleFlow.status === "ok" ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_188, "\u89c4\u5219\u8bca\u65ad " + vue.toDisplayString(JSON.stringify(diag.value.ruleFlow.value)), 1)) : diag.value.ruleFlow && diag.value.ruleFlow.status === "failed" ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_189, "\u89c4\u5219\u8bca\u65ad\u5931\u8d25 \xb7 " + vue.toDisplayString(diag.value.ruleFlow.error), 1)) : vue.createCommentVNode("", true) ])) : (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_190, "\u70b9\u300c\u8fd0\u884c\u8bca\u65ad\u300d\u8bc6\u522b\u5f53\u524d\u9875")) ], 64)) : vue.createCommentVNode("", true), vue.createElementVNode("button", {
          class: "fold",
          onClick: _cache[15] || (_cache[15] = $event => ruleMetaOpen.value = !ruleMetaOpen.value)
        }, [ _cache[138] || (_cache[138] = vue.createTextVNode("\u89c4\u5219\u660e\u7ec6", -1)), (vue.openBlock(), 
        vue.createElementBlock("svg", {
          class: vue.normalizeClass([ "ic sm chev", {
            right: !ruleMetaOpen.value
          } ])
        }, [ ..._cache[137] || (_cache[137] = [ vue.createElementVNode("use", {
          href: "#i-chevron"
        }, null, -1) ]) ], 2)) ]), ruleMetaOpen.value && ruleDiag.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_191, [ vue.createElementVNode("div", _hoisted_192, [ _cache[139] || (_cache[139] = vue.createElementVNode("span", {
          class: "rule-key"
        }, "hash", -1)), vue.createElementVNode("span", _hoisted_193, vue.toDisplayString(ruleDiag.value.contentHash), 1) ]), ruleDiag.value.release ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_194, [ _cache[140] || (_cache[140] = vue.createElementVNode("span", {
          class: "rule-key"
        }, "release", -1)), vue.createElementVNode("span", _hoisted_195, [ vue.createTextVNode(vue.toDisplayString(ruleDiag.value.release.releaseId) + " \xb7 bucket " + vue.toDisplayString(ruleDiag.value.release.cohortBucket), 1), vue.unref(protocol.isRuleCandidateTestDelivery)(ruleDiag.value.release) ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 0
        }, [ vue.createTextVNode(" \xb7 \u6d4b\u8bd5\u8bbe\u5907\u56fa\u5b9a\u547d\u4e2d") ], 64)) : vue.createCommentVNode("", true) ]) ])) : vue.createCommentVNode("", true), ruleDiag.value.candidateVersion ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_196, [ _cache[141] || (_cache[141] = vue.createElementVNode("span", {
          class: "rule-key"
        }, "candidate", -1)), vue.createElementVNode("span", _hoisted_197, vue.toDisplayString(ruleDiag.value.candidateVersion), 1) ])) : vue.createCommentVNode("", true), ruleDiag.value.lastKnownGoodVersion ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_198, [ _cache[142] || (_cache[142] = vue.createElementVNode("span", {
          class: "rule-key"
        }, "\u4e0a\u6b21\u53ef\u7528", -1)), vue.createElementVNode("span", _hoisted_199, vue.toDisplayString(ruleDiag.value.lastKnownGoodVersion), 1) ])) : vue.createCommentVNode("", true) ])) : ruleMetaOpen.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_200, "\u672c\u6b21\u4f1a\u8bdd\u8fd8\u6ca1\u6709\u5339\u914d\u5230\u89c4\u5219\u3002")) : vue.createCommentVNode("", true) ]) ], 64)) : vue.createCommentVNode("", true) ]), vue.createElementVNode("div", _hoisted_201, [ tab.value === "home" ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 0
        }, [ detectedCount.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_202, [ vue.createElementVNode("div", _hoisted_203, [ _cache[143] || (_cache[143] = vue.createElementVNode("span", {
          class: "k"
        }, "\u5c06\u56de\u586b", -1)), vue.createElementVNode("b", null, "\u6700\u591a " + vue.toDisplayString(detectedCount.value) + " \u9898", 1) ]), vue.createElementVNode("div", _hoisted_204, [ _cache[144] || (_cache[144] = vue.createElementVNode("span", {
          class: "k"
        }, "\u9884\u8ba1\u6263\u5206", -1)), vue.createElementVNode("b", null, "\u2264 " + vue.toDisplayString(detectedCount.value) + " \u5206", 1), _cache[145] || (_cache[145] = vue.createElementVNode("span", {
          class: "cap-mute"
        }, "\u547d\u4e2d\u624d\u6263", -1)) ]), _cache[146] || (_cache[146] = vue.createElementVNode("div", {
          class: "prow"
        }, [ vue.createElementVNode("span", {
          class: "k"
        }, "\u4e0d\u4f1a\u505a"), vue.createElementVNode("span", null, "\u63d0\u4ea4\u8bd5\u5377 \xb7 \u672a\u547d\u4e2d\u4e0d\u5199\u5165") ], -1)) ])) : vue.createCommentVNode("", true), detectedCount.value && hasFeature("answer") ? (vue.openBlock(), 
        vue.createElementBlock("button", {
          key: 1,
          class: "btn block",
          disabled: running.value,
          onClick: start
        }, "\u5f00\u59cb\u7b54\u9898", 8, _hoisted_205)) : (vue.openBlock(), vue.createElementBlock("button", {
          key: 2,
          class: "btn ghost block",
          disabled: running.value,
          onClick: _cache[16] || (_cache[16] = $event => detectQuestions())
        }, "\u91cd\u65b0\u8bc6\u522b\u672c\u9875", 8, _hoisted_206)) ], 64)) : tab.value === "ask" ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 1
        }, [ list.value.length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_207, [ vue.createElementVNode("span", _hoisted_208, vue.toDisplayString(tip.value), 1), vue.createElementVNode("div", _hoisted_209, [ (vue.openBlock(true), 
        vue.createElementBlock(vue.Fragment, null, vue.renderList(list.value, (it, i) => (vue.openBlock(), 
        vue.createElementBlock("i", {
          key: i,
          class: vue.normalizeClass({
            on: it.status !== "pending"
          })
        }, null, 2))), 128)) ]) ])) : vue.createCommentVNode("", true), hasFeature("answer") ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_210, [ vue.createElementVNode("button", {
          class: "btn",
          style: {
            flex: "1"
          },
          disabled: running.value,
          onClick: start
        }, "\u5f00\u59cb\u7b54\u9898", 8, _hoisted_211), running.value ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 0,
          class: "btn ghost",
          style: {
            flex: "1"
          },
          onClick: pause
        }, "\u6682\u505c")) : (vue.openBlock(), vue.createElementBlock("button", {
          key: 1,
          class: "btn ghost",
          style: {
            flex: "1"
          },
          onClick: restart
        }, "\u91cd\u65b0\u7b54\u9898")) ])) : vue.createCommentVNode("", true) ], 64)) : tab.value === "system" && systemSub.value === "cache" ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 2
        }, [ cacheImportPreview.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_212, [ vue.createElementVNode("button", {
          class: "btn ghost",
          style: {
            flex: "1"
          },
          onClick: cancelImport
        }, "\u53d6\u6d88"), vue.createElementVNode("button", {
          class: "btn",
          style: {
            flex: "2"
          },
          onClick: confirmImport
        }, "\u5bfc\u5165 " + vue.toDisplayString(cacheImportPreview.value.fileCount) + " \u6761", 1) ])) : cacheClearPending.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_213, [ vue.createElementVNode("button", {
          class: "btn ghost",
          style: {
            flex: "1"
          },
          onClick: _cache[17] || (_cache[17] = $event => cacheClearPending.value = false)
        }, "\u53d6\u6d88"), vue.createElementVNode("button", {
          class: "btn ghost danger",
          style: {
            flex: "2"
          },
          onClick: clearCacheAll
        }, "\u786e\u8ba4\u6e05\u7a7a") ])) : cacheEntries.value.length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_214, [ vue.createElementVNode("button", {
          class: "btn ghost",
          style: {
            flex: "1"
          },
          onClick: exportCache
        }, "\u5bfc\u51fa"), vue.createElementVNode("button", {
          class: "btn ghost",
          style: {
            flex: "1"
          },
          onClick: pickImportFile
        }, "\u6587\u4ef6\u5bfc\u5165"), vue.createElementVNode("a", {
          class: "btn ghost",
          style: {
            flex: "1"
          },
          href: PARSE_IMPORT_URL,
          target: "_blank",
          rel: "noopener noreferrer"
        }, "\u89e3\u6790\u5bfc\u5165"), vue.createElementVNode("button", {
          class: "btn ghost danger",
          onClick: _cache[18] || (_cache[18] = $event => cacheClearPending.value = true)
        }, "\u6e05\u7a7a") ])) : vue.createCommentVNode("", true) ], 64)) : tab.value === "system" && systemSub.value === "diag" ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 3
        }, [ vue.createElementVNode("button", {
          class: "btn ghost block",
          onClick: exportDiagnostics
        }, "\u5bfc\u51fa\u8bca\u65ad\uff08\u65e5\u5fd7 + \u89c4\u5219\u4fe1\u606f\uff09"), vue.createElementVNode("button", {
          class: "btn ghost block",
          onClick: exportPageSnapshot
        }, "\u5bfc\u51fa\u9875\u9762\u5feb\u7167"), _cache[147] || (_cache[147] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u9875\u9762\u7ed3\u6784\u7684\u5b58\u6863\uff0c\u7528\u4e8e\u590d\u73b0\u95ee\u9898\uff1b\u59d3\u540d\u3001\u5b66\u53f7\u3001\u4ee4\u724c\u7b49\u5df2\u81ea\u52a8\u906e\u76d6\u3002", -1)), vue.unref(IS_DEV) ? (vue.openBlock(), 
        vue.createElementBlock("button", {
          key: 0,
          class: "btn ghost danger block",
          disabled: ruleUpdating.value,
          onClick: resetRuleStorageAndReload
        }, " \u91cd\u7f6e\u89c4\u5219\u6570\u636e\u5e76\u5237\u65b0\uff08dev\uff09 ", 8, _hoisted_215)) : vue.createCommentVNode("", true) ], 64)) : vue.createCommentVNode("", true), vue.createElementVNode("div", _hoisted_216, [ vue.createElementVNode("span", _hoisted_217, "v" + vue.toDisplayString(vue.unref(SCRIPT_VERSION)) + " \xb7 " + vue.toDisplayString(ruleVersionLabel.value), 1), _cache[148] || (_cache[148] = vue.createElementVNode("span", {
          class: "luokuan"
        }, "\u95ee\uff0c\u5fc5\u6709\u7b54\u3002", -1)) ]) ]), accountOpen.value ? (vue.openBlock(), 
        vue.createElementBlock("div", {
          key: 3,
          class: "scrim",
          onClick: closeAccount
        })) : vue.createCommentVNode("", true), accountOpen.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_218, [ !loggedIn.value ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 0
        }, [ _cache[152] || (_cache[152] = vue.createElementVNode("div", {
          class: "ctitle"
        }, "\u767b\u5f55", -1)), vue.createElementVNode("div", _hoisted_219, [ vue.createElementVNode("button", {
          class: vue.normalizeClass([ "btn sm", {
            ghost: authMode.value !== "account"
          } ]),
          disabled: authing.value,
          onClick: _cache[19] || (_cache[19] = $event => {
            authMode.value = "account";
            authMsg.value = "";
          })
        }, " \u8d26\u53f7\u767b\u5f55 ", 10, _hoisted_220), vue.createElementVNode("button", {
          class: vue.normalizeClass([ "btn sm", {
            ghost: authMode.value !== "card"
          } ]),
          disabled: authing.value,
          onClick: _cache[20] || (_cache[20] = $event => {
            authMode.value = "card";
            authMsg.value = "";
          })
        }, " \u5361\u5bc6\u76f4\u8fde ", 10, _hoisted_221) ]), authMode.value === "card" ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 0
        }, [ vue.withDirectives(vue.createElementVNode("input", {
          class: "in",
          "onUpdate:modelValue": _cache[21] || (_cache[21] = $event => cardLoginCode.value = $event),
          placeholder: "\u8f93\u5165\u5361\u5bc6",
          autocomplete: "off",
          onKeyup: vue.withKeys(doCardAuth, [ "enter" ])
        }, null, 544), [ [ vue.vModelText, cardLoginCode.value ] ]), vue.createElementVNode("button", {
          class: "btn",
          disabled: authing.value,
          onClick: doCardAuth
        }, vue.toDisplayString(authing.value ? "\u9a8c\u8bc1\u4e2d\u2026" : "\u8fdb\u5165"), 9, _hoisted_222), _cache[149] || (_cache[149] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u5361\u5bc6\u4f59\u989d\u4f1a\u5728\u65b0\u7ebf\u4e0e\u8001\u7ebf\u5171\u7528\uff0c\u8017\u5c3d\u524d\u65e0\u9700\u5151\u6362\u5230\u8d26\u53f7\u3002", -1)) ], 64)) : (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 1
        }, [ vue.withDirectives(vue.createElementVNode("input", {
          class: "in",
          "onUpdate:modelValue": _cache[22] || (_cache[22] = $event => username.value = $event),
          placeholder: "\u7528\u6237\u540d\u6216\u90ae\u7bb1"
        }, null, 512), [ [ vue.vModelText, username.value ] ]), vue.withDirectives(vue.createElementVNode("input", {
          class: "in",
          "onUpdate:modelValue": _cache[23] || (_cache[23] = $event => password.value = $event),
          type: "password",
          placeholder: "\u5bc6\u7801",
          onKeyup: _cache[24] || (_cache[24] = vue.withKeys($event => doAuth("login"), [ "enter" ]))
        }, null, 544), [ [ vue.vModelText, password.value ] ]), vue.withDirectives(vue.createElementVNode("input", {
          class: "in",
          "onUpdate:modelValue": _cache[25] || (_cache[25] = $event => email.value = $event),
          type: "email",
          placeholder: "\u90ae\u7bb1 \u9009\u586b\uff0c\u53ef\u7528\u4e8e\u767b\u5f55\u4e0e\u627e\u56de\u5bc6\u7801"
        }, null, 512), [ [ vue.vModelText, email.value ] ]), vue.createElementVNode("div", _hoisted_223, [ vue.createElementVNode("button", {
          class: "btn",
          style: {
            flex: "1"
          },
          disabled: authing.value,
          onClick: _cache[26] || (_cache[26] = $event => doAuth("login"))
        }, "\u767b\u5f55", 8, _hoisted_224), vue.createElementVNode("button", {
          class: "btn ghost",
          style: {
            flex: "1"
          },
          disabled: authing.value,
          onClick: _cache[27] || (_cache[27] = $event => doAuth("register"))
        }, "\u6ce8\u518c", 8, _hoisted_225) ]), _cache[150] || (_cache[150] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u6ce8\u518c\u8981\u6c42\u7528\u6237\u540d 3-32 \u4f4d\u3001\u5bc6\u7801\u81f3\u5c11 8 \u4f4d\uff1b\u767b\u5f55\u4e0d\u53d7\u6b64\u9650\uff0c\u8001\u8d26\u53f7\u7167\u539f\u6837\u586b\u3002", -1)), _cache[151] || (_cache[151] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u90ae\u7bb1\u4e0d\u586b\u4e5f\u80fd\u6ce8\u518c\u3002\u586b\u4e86\u53ef\u4ee5\u62ff\u5b83\u767b\u5f55\uff1b\u4e0d\u586b\u5219\u5fd8\u8bb0\u5bc6\u7801\u540e\u65e0\u6cd5\u627e\u56de\u3002", -1)) ], 64)), authMsg.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_226, vue.toDisplayString(authMsg.value), 1)) : vue.createCommentVNode("", true), _cache[153] || (_cache[153] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u672a\u767b\u5f55\u65f6\u4ec5\u67e5\u8be2\u514d\u8d39\u9898\u5e93\u3002", -1)) ], 64)) : (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 1
        }, [ vue.createElementVNode("div", _hoisted_227, [ vue.createElementVNode("span", _hoisted_228, vue.toDisplayString(avatarInitial.value), 1), vue.createElementVNode("div", _hoisted_229, [ vue.createElementVNode("div", _hoisted_230, vue.toDisplayString(accountName.value || "\u5df2\u767b\u5f55"), 1), authStale.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_231, vue.toDisplayString(AUTH_STALE_NOTE))) : vue.createCommentVNode("", true) ]) ]), authStale.value ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 0
        }, [ cardSession.value ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, {
          key: 0
        }, [ vue.withDirectives(vue.createElementVNode("input", {
          class: "in",
          "onUpdate:modelValue": _cache[28] || (_cache[28] = $event => cardLoginCode.value = $event),
          placeholder: "\u91cd\u65b0\u8f93\u5165\u5361\u5bc6",
          autocomplete: "off",
          onKeyup: vue.withKeys(doCardAuth, [ "enter" ])
        }, null, 544), [ [ vue.vModelText, cardLoginCode.value ] ]), vue.createElementVNode("button", {
          class: "btn",
          disabled: authing.value,
          onClick: doCardAuth
        }, "\u91cd\u65b0\u9a8c\u8bc1\u5361\u5bc6", 8, _hoisted_232) ], 64)) : (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 1
        }, [ vue.withDirectives(vue.createElementVNode("input", {
          class: "in",
          "onUpdate:modelValue": _cache[29] || (_cache[29] = $event => password.value = $event),
          type: "password",
          placeholder: "\u5bc6\u7801",
          onKeyup: _cache[30] || (_cache[30] = vue.withKeys($event => doAuth("login"), [ "enter" ]))
        }, null, 544), [ [ vue.vModelText, password.value ] ]), vue.createElementVNode("button", {
          class: "btn",
          disabled: authing.value,
          onClick: _cache[31] || (_cache[31] = $event => doAuth("login"))
        }, "\u91cd\u65b0\u767b\u5f55", 8, _hoisted_233) ], 64)), authMsg.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_234, vue.toDisplayString(authMsg.value), 1)) : vue.createCommentVNode("", true) ], 64)) : vue.createCommentVNode("", true), vue.createElementVNode("div", _hoisted_235, [ _cache[154] || (_cache[154] = vue.createElementVNode("span", {
          class: "lbl"
        }, "\u79ef\u5206\u4f59\u989d", -1)), balance.value != null ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_236, [ vue.createElementVNode("span", _hoisted_237, vue.toDisplayString(balance.value), 1) ])) : (vue.openBlock(), 
        vue.createElementBlock("span", _hoisted_238, "\u8bfb\u53d6\u4e2d\u2026")) ]), !cardSession.value && emailBound.value === false ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_239, " \u8fd9\u4e2a\u8d26\u53f7\u6ca1\u6709\u7ed1\u5b9a\u90ae\u7bb1\uff0c\u5fd8\u8bb0\u5bc6\u7801\u540e\u65e0\u6cd5\u81ea\u52a9\u627e\u56de\u3002 ")) : vue.createCommentVNode("", true), !cardSession.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_240, [ vue.withDirectives(vue.createElementVNode("input", {
          class: "in",
          "onUpdate:modelValue": _cache[32] || (_cache[32] = $event => cardCode.value = $event),
          placeholder: "\u8f93\u5165\u5361\u5bc6",
          onKeyup: vue.withKeys(doRedeem, [ "enter" ])
        }, null, 544), [ [ vue.vModelText, cardCode.value ] ]), vue.createElementVNode("button", {
          class: "btn",
          disabled: !cardCode.value.trim() || redeeming.value,
          onClick: doRedeem
        }, vue.toDisplayString(redeeming.value ? "\u5151\u6362\u4e2d\u2026" : "\u5151\u6362"), 9, _hoisted_241) ])) : (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_242, "\u5361\u5bc6\u76f4\u8fde\u4f59\u989d\u53ef\u5728\u65b0\u7ebf\u4e0e\u8001\u7ebf\u76f4\u63a5\u4f7f\u7528\uff1b\u8981\u5151\u6362\u5230\u8d26\u53f7\uff0c\u5148\u9000\u51fa\u5361\u5bc6\u76f4\u8fde\u3002")), redeemNote.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_243, vue.toDisplayString(redeemNote.value), 1)) : vue.createCommentVNode("", true), _cache[155] || (_cache[155] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u547d\u4e2d\u624d\u8ba1\u5206\uff0c\u672a\u547d\u4e2d\u4e0d\u6263\u5206\uff1b\u540c\u4e00\u9898\u91cd\u8dd1\u4e0d\u91cd\u590d\u6263\u5206\u3002", -1)), vue.createElementVNode("div", _hoisted_244, [ vue.createElementVNode("span", _hoisted_245, vue.toDisplayString(accountName.value), 1), vue.createElementVNode("button", {
          class: "btn danger sm",
          onClick: logout
        }, "\u9000\u51fa\u767b\u5f55") ]) ], 64)) ])) : vue.createCommentVNode("", true), captchaOpen.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_246, [ vue.createElementVNode("div", _hoisted_247, [ vue.createElementVNode("div", {
          class: "row"
        }, [ _cache[157] || (_cache[157] = vue.createElementVNode("span", {
          class: "ctitle"
        }, "\u5b8c\u6210\u4eba\u673a\u9a8c\u8bc1", -1)), vue.createElementVNode("button", {
          class: "x",
          type: "button",
          "aria-label": "\u53d6\u6d88\u4eba\u673a\u9a8c\u8bc1",
          onClick: cancelCaptcha
        }, [ ..._cache[156] || (_cache[156] = [ vue.createElementVNode("svg", {
          class: "ic"
        }, [ vue.createElementVNode("use", {
          href: "#i-minus"
        }) ], -1) ]) ]) ]), vue.createElementVNode("iframe", {
          ref_key: "captchaFrame",
          ref: captchaFrame,
          class: "captcha-frame",
          src: captchaUrl,
          title: "\u7231\u95ee\u7b54\u6ce8\u518c\u4eba\u673a\u9a8c\u8bc1",
          sandbox: "allow-scripts allow-same-origin",
          onLoad: onCaptchaFrameLoad
        }, null, 544), _cache[158] || (_cache[158] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u9a8c\u8bc1\u7ed3\u679c\u53ea\u968f\u52a0\u5bc6\u6ce8\u518c\u8bf7\u6c42\u53d1\u9001\u3002", -1)) ]) ])) : vue.createCommentVNode("", true) ], 4));
      };
    }
  });

  const PANEL_STYLE = `\n:host, .aiask-root {\n  --acc: #1e478f;\n  --acc-tint: color-mix(in srgb, var(--acc) 9%, #fff);\n  --ink: #171a21; --body: #4b5059; --mute: #8b909b;\n  --line: #e6e8ec; --line-strong: #aab0ba;\n  --canvas: #fff; --soft: #f6f7f9;\n  --err: #c8322f;\n  --mono: "JetBrains Mono","IBM Plex Mono","Geist Mono",ui-monospace,SFMono-Regular,Menlo,monospace;\n  --sans: "Inter","Geist",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;\n  --zhu: #c7391b;\n  --serif: "Songti SC","Noto Serif SC","SimSun",serif;\n  font-family: var(--sans);\n  font-feature-settings: "ss01","ss02","cv01","tnum";\n  font-variant-numeric: tabular-nums;\n  color: var(--ink); -webkit-font-smoothing: antialiased;\n  \n  overflow-wrap: anywhere;\n}\n.aiask-root * { box-sizing: border-box; }\n\n\n.bubble { position: fixed; right: 16px; bottom: 16px; z-index: 2147483647; display: flex; align-items: center; gap: 8px; cursor: move; user-select: none; touch-action: none; }\n.tip { background: var(--canvas); border: 1px solid var(--line); border-radius: 6px; padding: 4px 8px; color: var(--body); font: 12px/1.3 var(--mono); box-shadow: 0 1px 2px rgba(23,26,33,.05); }\n.launcher { appearance: none; position: relative; width: 44px; height: 44px; border: 0; background: transparent; cursor: move; padding: 0; display: flex; align-items: center; justify-content: center; box-shadow: none; }\n.badge { position: absolute; top: -5px; right: -5px; min-width: 18px; height: 18px; padding: 0 4px; border-radius: 9px; background: var(--acc); color: #fff; font: 11px/18px var(--mono); text-align: center; border: 2px solid var(--canvas); box-sizing: border-box; }\n\n\n.seal { background: var(--zhu); color: #fff; display: flex; align-items: center; justify-content: center; font-family: var(--serif); font-weight: 700; flex: 0 0 auto; box-shadow: inset 0 0 0 1px rgba(255,255,255,.55); }\n.seal.s44 { width: 44px; height: 44px; border-radius: 8px; font-size: 26px; box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.55), 0 2px 6px rgba(23,26,33,.18); }\n.seal.s28 { width: 28px; height: 28px; border-radius: 5px; font-size: 17px; }\n.seal.s22 { width: 22px; height: 22px; border-radius: 4px; font-size: 14px; }\n\n\n.luokuan { font-family: var(--serif); color: var(--zhu); font-size: 11px; letter-spacing: 1px; }\n\n\n.standby-title { font-family: var(--serif); font-size: 17px; letter-spacing: 6px; color: var(--ink); }\n.standby { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 22px 0 10px; text-align: center; }\n\n\n.done-seal { position: absolute; right: 10px; top: 9px; width: 48px; height: 48px; border-radius: 9px; background: var(--zhu); color: #fff; display: flex; align-items: center; justify-content: center; font-family: var(--serif); font-weight: 700; font-size: 28px; opacity: .92; box-shadow: inset 0 0 0 2px rgba(255,255,255,.5), 0 1px 3px rgba(199,57,27,.3); animation: seal-drop .18s cubic-bezier(.22,1,.36,1) both; }\n@keyframes seal-drop {\n  from { transform: scale(1.15) rotate(0deg); opacity: 0; }\n  to { transform: scale(1) rotate(-4deg); opacity: .92; }\n}\n@media (prefers-reduced-motion: reduce) {\n  .done-seal { animation: none; transform: rotate(-4deg); }\n}\n\n\n.panel { position: fixed; right: 16px; bottom: 16px; z-index: 2147483647; width: min(340px, calc(100vw - 32px)); background: var(--canvas); border: 1px solid var(--line); border-radius: 6px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 1px 1px rgba(23,26,33,.03), 0 6px 14px -4px rgba(23,26,33,.05), 0 20px 30px -12px rgba(23,26,33,.10); }\n\n\n.head { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-bottom: 1px solid var(--line); cursor: move; user-select: none; touch-action: none; }\n.name { font-size: 13.5px; font-weight: 600; letter-spacing: -0.3px; white-space: nowrap; }\n.spacer { flex: 1; }\n.chip { font: 12px/1.3 var(--sans); color: var(--body); background: var(--soft); border: 1px solid var(--line); border-radius: 6px; padding: 2px 8px; white-space: nowrap; max-width: 120px; overflow: hidden; text-overflow: ellipsis; }\n.chip.mono { font-family: var(--mono); }\n.x { border: 1px solid transparent; background: none; cursor: pointer; color: var(--mute); width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex: 0 0 auto; padding: 0; }\n.x:hover { background: var(--soft); color: var(--ink); }\n\n\n.ava { width: 24px; height: 24px; border-radius: 5px; background: var(--ink); color: #fff; font-size: 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; border: none; padding: 0; cursor: pointer; flex: 0 0 auto; font-family: var(--sans); }\n.ava.out { background: var(--canvas); color: var(--mute); border: 1px dashed var(--line-strong); font-weight: 400; }\n.ava.lg { width: 32px; height: 32px; border-radius: 6px; font-size: 15px; }\n\n\n.scrim { position: absolute; inset: 0; z-index: 8; background: rgba(23,26,33,.10); }\n.pop { position: absolute; top: 40px; right: 10px; width: 262px; z-index: 9; background: var(--canvas); border: 1px solid var(--line); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 1px 2px rgba(23,26,33,.04), 0 10px 20px -6px rgba(23,26,33,.14); }\n.sep-top { border-top: 1px solid var(--line); padding-top: 9px; }\n\n\n.tabbar { display: flex; gap: 2px; padding: 0 8px; border-bottom: 1px solid var(--line); flex: 0 0 auto; }\n.tab { appearance: none; border: none; background: none; cursor: pointer; padding: 8px 10px; font-size: 13px; letter-spacing: -0.2px; color: var(--body); border-bottom: 2px solid transparent; margin-bottom: -1px; }\n.tab.active { color: var(--ink); font-weight: 600; border-bottom-color: var(--ink); }\n\n\n.subbar { display: flex; gap: 4px; padding: 8px 12px 0; flex: 0 0 auto; }\n.seg { appearance: none; border: 1px solid var(--line); background: var(--canvas); color: var(--body); cursor: pointer; padding: 4px 10px; font-size: 12px; border-radius: 6px; font-family: var(--sans); line-height: 1.3; }\n.seg.active { background: var(--ink); color: #fff; border-color: var(--ink); }\n.seg:hover:not(.active) { background: var(--soft); }\n\n\n.home-user { display: flex; align-items: center; gap: 8px; }\n.home-meta { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }\n\n\n.log-filter { display: flex; flex-wrap: wrap; gap: 4px; }\n.log-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; max-height: 200px; overflow-y: auto; }\n.log-row { display: flex; gap: 8px; align-items: flex-start; font-size: 12px; line-height: 1.4; padding: 4px 0; border-bottom: 1px solid var(--line); }\n.log-row:last-child { border-bottom: none; }\n.log-time { color: var(--mute); flex: 0 0 auto; }\n.log-repeat { color: var(--muted); }\n.log-msg { color: var(--body); flex: 1; min-width: 0; word-break: break-word; }\n.log-row.log-warning .log-msg { color: var(--body); }\n.log-row.log-error .log-msg { color: var(--err); }\n\n\n.evi-pre { margin: 0; max-height: 200px; overflow: auto; padding: 8px; border: 1px solid var(--line); border-radius: 6px; background: var(--soft); color: var(--body); font: 11px/1.5 var(--mono); white-space: pre-wrap; overflow-wrap: anywhere; }\n\n\n.rule-meta { border: 1px solid var(--line); border-radius: 6px; overflow: hidden; }\n.rule-row { display: grid; grid-template-columns: 70px minmax(0, 1fr); gap: 8px; padding: 6px 8px; border-bottom: 1px solid var(--line); font: 11.5px/1.45 var(--mono); }\n.rule-row:last-child { border-bottom: none; }\n.rule-key { color: var(--mute); }\n.rule-value { color: var(--body); overflow-wrap: anywhere; }\n\n\n.body { padding: 12px; display: flex; flex-direction: column; gap: 12px; flex: 1 1 auto; min-height: 0; max-height: min(520px, calc(100vh - 200px)); overflow-x: hidden; overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--line-strong) transparent; }\n.body::-webkit-scrollbar { width: 6px; }\n.body::-webkit-scrollbar-track { background: transparent; }\n.body::-webkit-scrollbar-thumb { background: var(--line-strong); border-radius: 6px; }\n.grp { display: flex; flex-direction: column; gap: 8px; }\n.sep { border-top: 1px solid var(--line); }\n\n.gh2 { font: 11px/1.4 var(--mono); color: var(--mute); letter-spacing: .3px; }\n\n.statcard { border: 1px solid var(--line); border-radius: 6px; padding: 11px; display: flex; flex-direction: column; gap: 8px; }\n.statgrid { display: grid; grid-template-columns: auto 1fr; gap: 5px 10px; font-size: 12px; align-items: baseline; margin: 0; }\n.statgrid dt { color: var(--mute); }\n.statgrid dd { margin: 0; font-family: var(--mono); }\n\n\n.actbar { flex: 0 0 auto; border-top: 1px solid var(--line); background: var(--canvas); padding: 10px 12px; display: flex; flex-direction: column; gap: 8px; }\n.actbar-foot { display: flex; align-items: center; justify-content: space-between; }\n\n\n.fold { display: flex; align-items: center; gap: 6px; cursor: pointer; font: 12px/1.4 var(--mono); color: var(--mute); padding: 4px 6px; margin: 0 -6px; border-radius: 6px; background: none; border: none; text-align: left; width: calc(100% + 12px); }\n.fold:hover { background: var(--soft); }\n.fold .chev { margin-left: auto; color: var(--mute); transition: transform .15s ease; }\n.fold .chev.right { transform: rotate(-90deg); }\n\n\n.card { min-width: 0; border: 1px solid var(--line); border-radius: 6px; padding: 12px; display: flex; flex-direction: column; gap: 8px; background: var(--canvas); }\n\n\n.gate-h { font-size: 16px; font-weight: 600; letter-spacing: -0.4px; color: var(--ink); }\n.ctitle { font-size: 13.5px; font-weight: 600; letter-spacing: -0.2px; color: var(--ink); }\n.stem { min-width: 0; font-size: 15px; font-weight: 500; letter-spacing: -0.25px; line-height: 1.45; color: var(--ink); word-break: auto-phrase; text-wrap: pretty; }\n.question-content { max-width: 100%; white-space: pre-wrap; overflow-wrap: anywhere; }\n.question-content img { display: inline-block; max-width: 100%; height: auto; object-fit: contain; vertical-align: middle; }\n.image-failed { color: var(--err); font-size: 12px; }\n.lbl { font-size: 13.5px; font-weight: 500; letter-spacing: -0.2px; }\n.locator { font-size: 12px; color: var(--body); letter-spacing: -0.1px; }\n.cap-mute { font-size: 12px; color: var(--mute); line-height: 1.45; }\n.mono { font-family: var(--mono); }\n\n\n.skip summary { cursor: pointer; list-style: none; }\n.skip summary::-webkit-details-marker { display: none; }\n.skip summary::before { content: '\u25b8 '; }\n.skip[open] summary::before { content: '\u25be '; }\n.skip div { padding-left: 12px; }\n\n\n.ic { width: 14px; height: 14px; display: block; color: currentColor; flex: 0 0 auto; }\n.ic.sm { width: 12px; height: 12px; }\n\n\n.btn { appearance: none; border: 1px solid var(--ink); background: var(--ink); color: #fff; border-radius: 6px; height: 32px; padding: 0 12px; font-size: 13.5px; font-weight: 500; letter-spacing: -0.2px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; line-height: 1; font-family: var(--sans); flex-shrink: 0; text-decoration: none; }\n.btn:hover { background: #0f1218; border-color: #0f1218; }\n.btn:disabled { opacity: .5; cursor: not-allowed; }\n.btn.ghost { background: var(--canvas); color: var(--ink); border-color: var(--line); }\n.btn.ghost:hover:not(:disabled) { background: var(--soft); border-color: var(--line-strong); }\n.btn.ghost.sub { color: var(--body); }\n.btn.danger { background: var(--canvas); color: var(--err); border-color: color-mix(in srgb, var(--err) 28%, #fff); }\n.btn.danger:hover { background: color-mix(in srgb, var(--err) 6%, #fff); }\n.btn.sm { height: 28px; padding: 0 8px; font-size: 12px; }\n.btn.block { width: 100%; }\n\n\n.in { width: 100%; height: 36px; padding: 0 12px; font-family: var(--sans); border: 1px solid var(--line); border-radius: 6px; font-size: 13.5px; letter-spacing: -0.2px; color: var(--ink); background: var(--canvas); }\n.in::placeholder { color: var(--mute); }\n.in:focus { outline: 2px solid var(--acc); outline-offset: 0; border-color: var(--acc); }\n\n\n.captcha-cover { position: absolute; inset: 0; z-index: 20; display: grid; place-items: center; padding: 12px; background: color-mix(in srgb, var(--canvas) 94%, transparent); }\n.captcha-card { width: 100%; padding: 12px; display: flex; flex-direction: column; gap: 8px; border: 1px solid var(--line); border-radius: 6px; background: var(--canvas); box-shadow: 0 1px 1px rgba(23,26,33,.03), 0 8px 16px -4px rgba(23,26,33,.08); }\n.captcha-frame { display: block; width: 100%; height: 150px; border: 1px solid var(--line); border-radius: 6px; background: var(--canvas); }\n\n\n.prev { border: 1px solid var(--line-strong); border-radius: 6px; background: var(--soft); padding: 9px 10px; display: flex; flex-direction: column; gap: 5px; }\n.prow { display: flex; align-items: baseline; gap: 6px; font-size: 12px; }\n.prow .k { color: var(--mute); min-width: 56px; flex: 0 0 auto; }\n.prow b { font-family: var(--mono); font-weight: 600; }\n.done { position: relative; display: flex; flex-direction: column; gap: 8px; }\n\n\n.toolbar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }\n\n\n.prog { display: flex; align-items: center; gap: 8px; }\n.prog .stat { font-size: 12px; color: var(--body); white-space: nowrap; }\n.prog .stat b { font-family: var(--mono); font-weight: 400; color: var(--ink); }\n.ticks { flex: 1; display: flex; gap: 2px; height: 6px; }\n.ticks i { flex: 1; border-radius: 1px; background: var(--line); }\n.ticks i.on { background: var(--ink); }\n\n\n.switch-row { display: flex; align-items: center; gap: 8px; }\n.switch { width: 32px; height: 20px; border-radius: 999px; background: var(--ink); position: relative; flex: 0 0 auto; border: none; cursor: pointer; padding: 0; }\n.switch.off { background: var(--line-strong); }\n.switch > i { position: absolute; top: 2px; left: 14px; width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 1px 1px rgba(23,26,33,.2); transition: left .15s ease; }\n.switch.off > i { left: 2px; }\n\n\n.tag { display: inline-flex; align-items: center; font-size: 12px; padding: 2px 8px; border-radius: 6px; line-height: 1.4; white-space: nowrap; }\n.tag.acc { background: var(--acc-tint); color: var(--acc); border: 1px solid color-mix(in srgb, var(--acc) 22%, #fff); font-family: var(--mono); }\n.tag.neutral { background: var(--soft); color: var(--body); border: 1px solid var(--line); }\n\n\n.banner { display: flex; align-items: center; gap: 8px; border-radius: 6px; padding: 8px 12px; font-size: 13px; background: var(--soft); border: 1px solid var(--line); color: var(--body); }\n\n\n.anb { display: flex; align-items: center; gap: 8px; padding: 8px 12px; font-size: 13px; background: var(--soft); border-bottom: 1px solid var(--line); color: var(--body); flex: 0 0 auto; }\n.anb .dot { width: 6px; height: 6px; border-radius: 999px; background: var(--mute); flex: 0 0 auto; }\n.anb .t { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--ink); }\n\n.anb.warning { border-bottom-color: var(--line-strong); }\n.anb.warning .dot { background: var(--ink); }\n.anb.warning .t { font-weight: 600; }\n.anb.critical { background: color-mix(in srgb, var(--err) 8%, #fff); border-bottom-color: color-mix(in srgb, var(--err) 26%, #fff); }\n.anb.critical .dot { background: var(--err); }\n\n.an-body { font-size: 13.5px; line-height: 1.55; color: var(--body); }\n.an-body p { margin: 6px 0; }\n.an-body a { color: var(--acc); }\n.an-body img { max-width: 100%; }\n.an-body :is(h1, h2, h3) { font-size: 14px; margin: 8px 0 4px; color: var(--ink); }\n\n\n.legend { display: flex; gap: 8px 12px; flex-wrap: wrap; }\n.legend span { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--mute); white-space: nowrap; }\n.sw { width: 10px; height: 10px; border-radius: 2px; background: var(--canvas); border: 1px solid var(--line); flex: 0 0 auto; }\n.sw.cur { box-shadow: inset 0 0 0 2px var(--acc); border-color: transparent; }\n.sw.hit { background: var(--acc-tint); border-color: var(--acc); }\n.sw.miss { background: color-mix(in srgb, var(--err) 10%, #fff); border-color: var(--err); }\n.grid { display: flex; flex-wrap: wrap; gap: 4px; }\n.cell { width: 22px; height: 22px; border: 1px solid var(--line); border-radius: 6px; background: var(--canvas); cursor: pointer; font: 12px/1 var(--mono); color: var(--body); padding: 0; display: flex; align-items: center; justify-content: center; }\n.cell.cur { box-shadow: inset 0 0 0 2px var(--acc); border-color: transparent; color: var(--ink); }\n.cell.hit { background: var(--acc-tint); border-color: var(--acc); color: var(--acc); }\n.cell.miss { color: var(--err); border-color: color-mix(in srgb, var(--err) 35%, #fff); background: color-mix(in srgb, var(--err) 6%, #fff); }\n\n\n.opts { min-width: 0; display: flex; flex-direction: column; gap: 2px; }\n.optrow { min-width: 0; display: flex; align-items: center; gap: 8px; }\n.opt { min-width: 0; flex: 1; font-size: 13.5px; color: var(--body); line-height: 1.45; letter-spacing: -0.2px; }\n.opt.hit { color: var(--acc); font-weight: 500; }\n.expand { display: inline-flex; align-items: center; gap: 4px; font: 12px/1 var(--mono); color: var(--mute); cursor: pointer; white-space: nowrap; background: none; border: none; padding: 0; }\n.question-head { min-height: 28px; }\n.stem-type { margin-right: 4px; color: var(--mute); font-weight: 400; }\n.answer-block { display: flex; flex-direction: column; gap: 8px; padding-top: 8px; border-top: 1px solid var(--line); }\n.answer-label { font-size: 12px; color: var(--mute); }\n.answer-value { color: var(--acc); font: 500 13px/1.5 var(--mono); word-break: break-word; }\n.answer-list { display: flex; flex-direction: column; gap: 6px; }\n.answer-item { display: flex; align-items: flex-start; gap: 8px; }\n.answer-key { flex: 0 0 auto; min-width: 36px; color: var(--muted); font: 12px/1.5 var(--mono); }\n\n\n.ent { border: 1px solid var(--line); border-radius: 6px; padding: 9px 10px; display: flex; flex-direction: column; gap: 5px; }\n.ent-top { display: flex; align-items: center; gap: 6px; }\n.ent-ty { font: 10.5px/1.4 var(--mono); color: var(--body); border: 1px solid var(--line); border-radius: 3px; padding: 1px 5px; flex: 0 0 auto; }\n.ent-tm { font: 10.5px/1.4 var(--mono); color: var(--mute); margin-left: auto; }\n.ent-q { font-size: 13px; line-height: 1.45; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; line-clamp: 3; overflow: hidden; }\n.ent-a { font: 12.5px/1.5 var(--mono); color: var(--acc); word-break: break-word; }\n.ent-ops summary { cursor: pointer; list-style: none; }\n.ent-ops summary::-webkit-details-marker { display: none; }\n.ent-ops summary::before { content: '\u25b8 '; }\n.ent-ops[open] summary::before { content: '\u25be '; }\n.ent-ops div { padding-left: 12px; }\n.ent-del { width: 20px; height: 20px; border: none; background: none; color: var(--line-strong); cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 4px; flex: 0 0 auto; }\n.ent-del:hover { background: color-mix(in srgb, var(--err) 6%, #fff); color: var(--err); }\n\n.meter { flex: 1; height: 5px; background: var(--soft); border-radius: 3px; overflow: hidden; }\n.meter i { display: block; height: 100%; background: var(--ink); }\n.meter i.over { background: var(--err); }\n\n.alert { border: 1px solid color-mix(in srgb, var(--err) 35%, #fff); background: color-mix(in srgb, var(--err) 6%, #fff); color: var(--err); border-radius: 6px; padding: 8px 10px; font-size: 12px; line-height: 1.55; }\n\n\n.row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }\n.balance { font-size: 20px; font-weight: 600; letter-spacing: -0.6px; font-family: var(--mono); color: var(--ink); }\n.range { width: 100%; accent-color: var(--ink); }\n`;

  function mountPanel() {
    if (document.getElementById("aiask-host")) return;
    const host = document.createElement("div");
    host.id = "aiask-host";
    document.body.appendChild(host);
    const shadow = host.attachShadow({
      mode: "closed"
    });
    const style = document.createElement("style");
    style.textContent = PANEL_STYLE;
    shadow.appendChild(style);
    const root = document.createElement("div");
    root.className = "aiask-root";
    shadow.appendChild(root);
    vue.createApp(_sfc_main).mount(root);
  }

  installResponseListener(location.hostname);

  const bridgeMode = bridgeModeFor(location);

  if (bridgeMode) installImportBridge(bridgeMode === "full" ? localAnswerCache : null);

  if (SUPPORTED_HOST_PATTERN.test(location.hostname)) {
    const highest = findHighestSameOriginWindow(window);
    const isTop = window === window.top;
    const isHighestSameOrigin = highest === window;
    let ancestorOrigins = [];
    try {
      ancestorOrigins = Array.from(location.ancestorOrigins ?? []);
    } catch {
      ancestorOrigins = [];
    }
    const role = resolvePanelRole({
      isTop: isTop,
      isHighestSameOrigin: isHighestSameOrigin,
      ancestorOrigins: ancestorOrigins,
      supportedHostPattern: SUPPORTED_HOST_PATTERN
    });
    if (role === "mount") {
      const run = () => {
        const restored = initializeRuleStoreRuntime();
        mountPanel();
        void restored.then(() => void checkRuleUpdates()).catch(() => {});
      };
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
    } else if (role === "relay-f9") {
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => notifyFrameReady(highest)); else notifyFrameReady(highest);
      addEventListener("keydown", e => {
        if (e.key === "F9") {
          try {
            highest.document.dispatchEvent(new KeyboardEvent("keydown", {
              key: "F9",
              bubbles: true
            }));
          } catch {}
        }
      });
    }
  }

})((typeof AiaskEngine === "undefined" ? void 0 : AiaskEngine.protocol), (typeof AiaskEngine === "undefined" ? void 0 : AiaskEngine.core), (typeof Vue === "undefined" ? void 0 : Vue));