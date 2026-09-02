// ==UserScript==
// @name         爱问答 · 网课学习助手
// @namespace    aiask
// @version      3.2.0
// @author       爱问答
// @description  全平台网课答题助手，一键解析当前页面试题并获取答案，支持作业 / 考试 / 章节测验的自动收录与答题，视频与文档等课程学习任务自动推进。已适配【超星学习通、168 网校】，更多平台持续适配中...
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByb2xlPSJpbWciIGFyaWEtbGFiZWw9IueIsemXruetlCI+CiAgPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTAiIGZpbGw9IiNDNzM5MUIiLz4KICA8cmVjdCB4PSIzLjUiIHk9IjMuNSIgd2lkdGg9IjU3IiBoZWlnaHQ9IjU3IiByeD0iNy41IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjU1IiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSIzMiIgeT0iMzMiIGZpbGw9IiNmZmYiIGZvbnQtZmFtaWx5PSJTb25ndGkgU0MsIE5vdG8gU2VyaWYgU0MsIFNpbVN1biwgc2VyaWYiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj7pl648L3RleHQ+Cjwvc3ZnPgo=
// @homepage     https://www.aiask.site/
// @supportURL   https://www.aiask.site/contact.html
// @match        *://*.chaoxing.com/*
// @match        *://xatu.168wangxiao.com/*
// @match        https://www.aiask.site/import.html
// @match        https://www.aiask.site/import
// @match        https://www.aiask.site/feedback.html
// @match        https://www.aiask.site/feedback
// @require      https://registry.npmmirror.com/vue/3.5.39/files/dist/vue.global.prod.js
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

(function (vue) {
  'use strict';

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

  var _a, _deps, _pending, _dropped, _timer, _sending, _enabled, _EventQueue_instances, arm_fn, cancel_fn, trim_fn, envelope_fn, take_fn, flush_fn, send_fn;

  var _GM_deleteValue = (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();

  var _GM_getResourceText = (() => typeof GM_getResourceText != "undefined" ? GM_getResourceText : void 0)();

  var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();

  var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();

  var _GM_xmlhttpRequest = (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();

  const DEFAULT_BACKEND_BASE_URL = "https://www.aiask.site";

  const BACKEND_BASE_URL = DEFAULT_BACKEND_BASE_URL;

  const IS_DEFAULT_BACKEND = BACKEND_BASE_URL === DEFAULT_BACKEND_BASE_URL;

  const SCRIPT_VERSION = "3.2.0";

  const DEFAULT_ROOT_PUBLIC_JWK = {
    kty: "EC",
    crv: "P-256",
    x: "gitEZjf_WTbJYGhpmmUzKE3zUdiMsgchpxfgSdZ3WDE",
    y: "n_cLcQdM4-bPQAGHvxMULiETvAu6kJl8YvIwPFGWasc"
  };

  function resolveRootPublicJwk() {
    return DEFAULT_ROOT_PUBLIC_JWK;
  }

  const SECURITY_ROOT_PUBLIC_JWK = resolveRootPublicJwk();

  const QuestionType = {
    Single: "single",
    Multiple: "multiple",
    Judge: "judge",
    Fill: "fill"
  };

  const AiAskCode = {
    Ok: 0,
    Unauthorized: 1,
    Insufficient: 2,
    Busy: 3,
    Invalid: 4,
    RateLimited: 5
  };

  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};

  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }

  function getAugmentedNamespace(n) {
    if (n.__esModule) return n;
    var f = n.default;
    if (typeof f == "function") {
      var a = function a2() {
        if (this instanceof a2) {
          return Reflect.construct(f, arguments, this.constructor);
        }
        return f.apply(this, arguments);
      };
      a.prototype = f.prototype;
    } else a = {};
    Object.defineProperty(a, "__esModule", {
      value: true
    });
    Object.keys(n).forEach(function(k) {
      var d = Object.getOwnPropertyDescriptor(n, k);
      Object.defineProperty(a, k, d.get ? d : {
        enumerable: true,
        get: function() {
          return n[k];
        }
      });
    });
    return a;
  }

  var md5 = {
    exports: {}
  };

  const __viteBrowserExternal = {};

  const __viteBrowserExternal$1 = Object.freeze(Object.defineProperty({
    __proto__: null,
    default: __viteBrowserExternal
  }, Symbol.toStringTag, {
    value: "Module"
  }));

  const require$$1 = getAugmentedNamespace(__viteBrowserExternal$1);

  (function(module) {
    (function() {
      var INPUT_ERROR = "input is invalid type";
      var FINALIZE_ERROR = "finalize already called";
      var WINDOW = typeof window === "object";
      var root = WINDOW ? window : {};
      if (root.JS_MD5_NO_WINDOW) {
        WINDOW = false;
      }
      var WEB_WORKER = !WINDOW && typeof self === "object";
      var NODE_JS = !root.JS_MD5_NO_NODE_JS && typeof process === "object" && process.versions && process.versions.node;
      if (NODE_JS) {
        root = commonjsGlobal;
      } else if (WEB_WORKER) {
        root = self;
      }
      var COMMON_JS = !root.JS_MD5_NO_COMMON_JS && true && module.exports;
      var ARRAY_BUFFER = !root.JS_MD5_NO_ARRAY_BUFFER && typeof ArrayBuffer !== "undefined";
      var HEX_CHARS = "0123456789abcdef".split("");
      var EXTRA = [ 128, 32768, 8388608, -2147483648 ];
      var SHIFT = [ 0, 8, 16, 24 ];
      var OUTPUT_TYPES = [ "hex", "array", "digest", "buffer", "arrayBuffer", "base64" ];
      var BASE64_ENCODE_CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
      var blocks = [], buffer8;
      if (ARRAY_BUFFER) {
        var buffer = new ArrayBuffer(68);
        buffer8 = new Uint8Array(buffer);
        blocks = new Uint32Array(buffer);
      }
      var isArray = Array.isArray;
      if (root.JS_MD5_NO_NODE_JS || !isArray) {
        isArray = function(obj) {
          return Object.prototype.toString.call(obj) === "[object Array]";
        };
      }
      var isView = ArrayBuffer.isView;
      if (ARRAY_BUFFER && (root.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW || !isView)) {
        isView = function(obj) {
          return typeof obj === "object" && obj.buffer && obj.buffer.constructor === ArrayBuffer;
        };
      }
      var formatMessage = function(message) {
        var type = typeof message;
        if (type === "string") {
          return [ message, true ];
        }
        if (type !== "object" || message === null) {
          throw new Error(INPUT_ERROR);
        }
        if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
          return [ new Uint8Array(message), false ];
        }
        if (!isArray(message) && !isView(message)) {
          throw new Error(INPUT_ERROR);
        }
        return [ message, false ];
      };
      var createOutputMethod = function(outputType) {
        return function(message) {
          return new Md5(true).update(message)[outputType]();
        };
      };
      var createMethod = function() {
        var method = createOutputMethod("hex");
        if (NODE_JS) {
          method = nodeWrap(method);
        }
        method.create = function() {
          return new Md5;
        };
        method.update = function(message) {
          return method.create().update(message);
        };
        for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
          var type = OUTPUT_TYPES[i];
          method[type] = createOutputMethod(type);
        }
        return method;
      };
      var nodeWrap = function(method) {
        var crypto2 = require$$1;
        var Buffer2 = require$$1.Buffer;
        var bufferFrom;
        if (Buffer2.from && !root.JS_MD5_NO_BUFFER_FROM) {
          bufferFrom = Buffer2.from;
        } else {
          bufferFrom = function(message) {
            return new Buffer2(message);
          };
        }
        var nodeMethod = function(message) {
          if (typeof message === "string") {
            return crypto2.createHash("md5").update(message, "utf8").digest("hex");
          } else {
            if (message === null || message === void 0) {
              throw new Error(INPUT_ERROR);
            } else if (message.constructor === ArrayBuffer) {
              message = new Uint8Array(message);
            }
          }
          if (isArray(message) || isView(message) || message.constructor === Buffer2) {
            return crypto2.createHash("md5").update(bufferFrom(message)).digest("hex");
          } else {
            return method(message);
          }
        };
        return nodeMethod;
      };
      var createHmacOutputMethod = function(outputType) {
        return function(key, message) {
          return new HmacMd5(key, true).update(message)[outputType]();
        };
      };
      var createHmacMethod = function() {
        var method = createHmacOutputMethod("hex");
        method.create = function(key) {
          return new HmacMd5(key);
        };
        method.update = function(key, message) {
          return method.create(key).update(message);
        };
        for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
          var type = OUTPUT_TYPES[i];
          method[type] = createHmacOutputMethod(type);
        }
        return method;
      };
      function Md5(sharedMemory) {
        if (sharedMemory) {
          blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
          this.blocks = blocks;
          this.buffer8 = buffer8;
        } else {
          if (ARRAY_BUFFER) {
            var buffer2 = new ArrayBuffer(68);
            this.buffer8 = new Uint8Array(buffer2);
            this.blocks = new Uint32Array(buffer2);
          } else {
            this.blocks = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
          }
        }
        this.h0 = this.h1 = this.h2 = this.h3 = this.start = this.bytes = this.hBytes = 0;
        this.finalized = this.hashed = false;
        this.first = true;
      }
      Md5.prototype.update = function(message) {
        if (this.finalized) {
          throw new Error(FINALIZE_ERROR);
        }
        var result = formatMessage(message);
        message = result[0];
        var isString = result[1];
        var code, index = 0, i, length = message.length, blocks2 = this.blocks;
        var buffer82 = this.buffer8;
        while (index < length) {
          if (this.hashed) {
            this.hashed = false;
            blocks2[0] = blocks2[16];
            blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
          }
          if (isString) {
            if (ARRAY_BUFFER) {
              for (i = this.start; index < length && i < 64; ++index) {
                code = message.charCodeAt(index);
                if (code < 128) {
                  buffer82[i++] = code;
                } else if (code < 2048) {
                  buffer82[i++] = 192 | code >>> 6;
                  buffer82[i++] = 128 | code & 63;
                } else if (code < 55296 || code >= 57344) {
                  buffer82[i++] = 224 | code >>> 12;
                  buffer82[i++] = 128 | code >>> 6 & 63;
                  buffer82[i++] = 128 | code & 63;
                } else {
                  code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index) & 1023);
                  buffer82[i++] = 240 | code >>> 18;
                  buffer82[i++] = 128 | code >>> 12 & 63;
                  buffer82[i++] = 128 | code >>> 6 & 63;
                  buffer82[i++] = 128 | code & 63;
                }
              }
            } else {
              for (i = this.start; index < length && i < 64; ++index) {
                code = message.charCodeAt(index);
                if (code < 128) {
                  blocks2[i >>> 2] |= code << SHIFT[i++ & 3];
                } else if (code < 2048) {
                  blocks2[i >>> 2] |= (192 | code >>> 6) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
                } else if (code < 55296 || code >= 57344) {
                  blocks2[i >>> 2] |= (224 | code >>> 12) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
                } else {
                  code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index) & 1023);
                  blocks2[i >>> 2] |= (240 | code >>> 18) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code >>> 12 & 63) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
                }
              }
            }
          } else {
            if (ARRAY_BUFFER) {
              for (i = this.start; index < length && i < 64; ++index) {
                buffer82[i++] = message[index];
              }
            } else {
              for (i = this.start; index < length && i < 64; ++index) {
                blocks2[i >>> 2] |= message[index] << SHIFT[i++ & 3];
              }
            }
          }
          this.lastByteIndex = i;
          this.bytes += i - this.start;
          if (i >= 64) {
            this.start = i - 64;
            this.hash();
            this.hashed = true;
          } else {
            this.start = i;
          }
        }
        if (this.bytes > 4294967295) {
          this.hBytes += this.bytes / 4294967296 << 0;
          this.bytes = this.bytes % 4294967296;
        }
        return this;
      };
      Md5.prototype.finalize = function() {
        if (this.finalized) {
          return;
        }
        this.finalized = true;
        var blocks2 = this.blocks, i = this.lastByteIndex;
        blocks2[i >>> 2] |= EXTRA[i & 3];
        if (i >= 56) {
          if (!this.hashed) {
            this.hash();
          }
          blocks2[0] = blocks2[16];
          blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
        }
        blocks2[14] = this.bytes << 3;
        blocks2[15] = this.hBytes << 3 | this.bytes >>> 29;
        this.hash();
      };
      Md5.prototype.hash = function() {
        var a, b, c, d, bc, da, blocks2 = this.blocks;
        if (this.first) {
          a = blocks2[0] - 680876937;
          a = (a << 7 | a >>> 25) - 271733879 << 0;
          d = (-1732584194 ^ a & 2004318071) + blocks2[1] - 117830708;
          d = (d << 12 | d >>> 20) + a << 0;
          c = (-271733879 ^ d & (a ^ -271733879)) + blocks2[2] - 1126478375;
          c = (c << 17 | c >>> 15) + d << 0;
          b = (a ^ c & (d ^ a)) + blocks2[3] - 1316259209;
          b = (b << 22 | b >>> 10) + c << 0;
        } else {
          a = this.h0;
          b = this.h1;
          c = this.h2;
          d = this.h3;
          a += (d ^ b & (c ^ d)) + blocks2[0] - 680876936;
          a = (a << 7 | a >>> 25) + b << 0;
          d += (c ^ a & (b ^ c)) + blocks2[1] - 389564586;
          d = (d << 12 | d >>> 20) + a << 0;
          c += (b ^ d & (a ^ b)) + blocks2[2] + 606105819;
          c = (c << 17 | c >>> 15) + d << 0;
          b += (a ^ c & (d ^ a)) + blocks2[3] - 1044525330;
          b = (b << 22 | b >>> 10) + c << 0;
        }
        a += (d ^ b & (c ^ d)) + blocks2[4] - 176418897;
        a = (a << 7 | a >>> 25) + b << 0;
        d += (c ^ a & (b ^ c)) + blocks2[5] + 1200080426;
        d = (d << 12 | d >>> 20) + a << 0;
        c += (b ^ d & (a ^ b)) + blocks2[6] - 1473231341;
        c = (c << 17 | c >>> 15) + d << 0;
        b += (a ^ c & (d ^ a)) + blocks2[7] - 45705983;
        b = (b << 22 | b >>> 10) + c << 0;
        a += (d ^ b & (c ^ d)) + blocks2[8] + 1770035416;
        a = (a << 7 | a >>> 25) + b << 0;
        d += (c ^ a & (b ^ c)) + blocks2[9] - 1958414417;
        d = (d << 12 | d >>> 20) + a << 0;
        c += (b ^ d & (a ^ b)) + blocks2[10] - 42063;
        c = (c << 17 | c >>> 15) + d << 0;
        b += (a ^ c & (d ^ a)) + blocks2[11] - 1990404162;
        b = (b << 22 | b >>> 10) + c << 0;
        a += (d ^ b & (c ^ d)) + blocks2[12] + 1804603682;
        a = (a << 7 | a >>> 25) + b << 0;
        d += (c ^ a & (b ^ c)) + blocks2[13] - 40341101;
        d = (d << 12 | d >>> 20) + a << 0;
        c += (b ^ d & (a ^ b)) + blocks2[14] - 1502002290;
        c = (c << 17 | c >>> 15) + d << 0;
        b += (a ^ c & (d ^ a)) + blocks2[15] + 1236535329;
        b = (b << 22 | b >>> 10) + c << 0;
        a += (c ^ d & (b ^ c)) + blocks2[1] - 165796510;
        a = (a << 5 | a >>> 27) + b << 0;
        d += (b ^ c & (a ^ b)) + blocks2[6] - 1069501632;
        d = (d << 9 | d >>> 23) + a << 0;
        c += (a ^ b & (d ^ a)) + blocks2[11] + 643717713;
        c = (c << 14 | c >>> 18) + d << 0;
        b += (d ^ a & (c ^ d)) + blocks2[0] - 373897302;
        b = (b << 20 | b >>> 12) + c << 0;
        a += (c ^ d & (b ^ c)) + blocks2[5] - 701558691;
        a = (a << 5 | a >>> 27) + b << 0;
        d += (b ^ c & (a ^ b)) + blocks2[10] + 38016083;
        d = (d << 9 | d >>> 23) + a << 0;
        c += (a ^ b & (d ^ a)) + blocks2[15] - 660478335;
        c = (c << 14 | c >>> 18) + d << 0;
        b += (d ^ a & (c ^ d)) + blocks2[4] - 405537848;
        b = (b << 20 | b >>> 12) + c << 0;
        a += (c ^ d & (b ^ c)) + blocks2[9] + 568446438;
        a = (a << 5 | a >>> 27) + b << 0;
        d += (b ^ c & (a ^ b)) + blocks2[14] - 1019803690;
        d = (d << 9 | d >>> 23) + a << 0;
        c += (a ^ b & (d ^ a)) + blocks2[3] - 187363961;
        c = (c << 14 | c >>> 18) + d << 0;
        b += (d ^ a & (c ^ d)) + blocks2[8] + 1163531501;
        b = (b << 20 | b >>> 12) + c << 0;
        a += (c ^ d & (b ^ c)) + blocks2[13] - 1444681467;
        a = (a << 5 | a >>> 27) + b << 0;
        d += (b ^ c & (a ^ b)) + blocks2[2] - 51403784;
        d = (d << 9 | d >>> 23) + a << 0;
        c += (a ^ b & (d ^ a)) + blocks2[7] + 1735328473;
        c = (c << 14 | c >>> 18) + d << 0;
        b += (d ^ a & (c ^ d)) + blocks2[12] - 1926607734;
        b = (b << 20 | b >>> 12) + c << 0;
        bc = b ^ c;
        a += (bc ^ d) + blocks2[5] - 378558;
        a = (a << 4 | a >>> 28) + b << 0;
        d += (bc ^ a) + blocks2[8] - 2022574463;
        d = (d << 11 | d >>> 21) + a << 0;
        da = d ^ a;
        c += (da ^ b) + blocks2[11] + 1839030562;
        c = (c << 16 | c >>> 16) + d << 0;
        b += (da ^ c) + blocks2[14] - 35309556;
        b = (b << 23 | b >>> 9) + c << 0;
        bc = b ^ c;
        a += (bc ^ d) + blocks2[1] - 1530992060;
        a = (a << 4 | a >>> 28) + b << 0;
        d += (bc ^ a) + blocks2[4] + 1272893353;
        d = (d << 11 | d >>> 21) + a << 0;
        da = d ^ a;
        c += (da ^ b) + blocks2[7] - 155497632;
        c = (c << 16 | c >>> 16) + d << 0;
        b += (da ^ c) + blocks2[10] - 1094730640;
        b = (b << 23 | b >>> 9) + c << 0;
        bc = b ^ c;
        a += (bc ^ d) + blocks2[13] + 681279174;
        a = (a << 4 | a >>> 28) + b << 0;
        d += (bc ^ a) + blocks2[0] - 358537222;
        d = (d << 11 | d >>> 21) + a << 0;
        da = d ^ a;
        c += (da ^ b) + blocks2[3] - 722521979;
        c = (c << 16 | c >>> 16) + d << 0;
        b += (da ^ c) + blocks2[6] + 76029189;
        b = (b << 23 | b >>> 9) + c << 0;
        bc = b ^ c;
        a += (bc ^ d) + blocks2[9] - 640364487;
        a = (a << 4 | a >>> 28) + b << 0;
        d += (bc ^ a) + blocks2[12] - 421815835;
        d = (d << 11 | d >>> 21) + a << 0;
        da = d ^ a;
        c += (da ^ b) + blocks2[15] + 530742520;
        c = (c << 16 | c >>> 16) + d << 0;
        b += (da ^ c) + blocks2[2] - 995338651;
        b = (b << 23 | b >>> 9) + c << 0;
        a += (c ^ (b | ~d)) + blocks2[0] - 198630844;
        a = (a << 6 | a >>> 26) + b << 0;
        d += (b ^ (a | ~c)) + blocks2[7] + 1126891415;
        d = (d << 10 | d >>> 22) + a << 0;
        c += (a ^ (d | ~b)) + blocks2[14] - 1416354905;
        c = (c << 15 | c >>> 17) + d << 0;
        b += (d ^ (c | ~a)) + blocks2[5] - 57434055;
        b = (b << 21 | b >>> 11) + c << 0;
        a += (c ^ (b | ~d)) + blocks2[12] + 1700485571;
        a = (a << 6 | a >>> 26) + b << 0;
        d += (b ^ (a | ~c)) + blocks2[3] - 1894986606;
        d = (d << 10 | d >>> 22) + a << 0;
        c += (a ^ (d | ~b)) + blocks2[10] - 1051523;
        c = (c << 15 | c >>> 17) + d << 0;
        b += (d ^ (c | ~a)) + blocks2[1] - 2054922799;
        b = (b << 21 | b >>> 11) + c << 0;
        a += (c ^ (b | ~d)) + blocks2[8] + 1873313359;
        a = (a << 6 | a >>> 26) + b << 0;
        d += (b ^ (a | ~c)) + blocks2[15] - 30611744;
        d = (d << 10 | d >>> 22) + a << 0;
        c += (a ^ (d | ~b)) + blocks2[6] - 1560198380;
        c = (c << 15 | c >>> 17) + d << 0;
        b += (d ^ (c | ~a)) + blocks2[13] + 1309151649;
        b = (b << 21 | b >>> 11) + c << 0;
        a += (c ^ (b | ~d)) + blocks2[4] - 145523070;
        a = (a << 6 | a >>> 26) + b << 0;
        d += (b ^ (a | ~c)) + blocks2[11] - 1120210379;
        d = (d << 10 | d >>> 22) + a << 0;
        c += (a ^ (d | ~b)) + blocks2[2] + 718787259;
        c = (c << 15 | c >>> 17) + d << 0;
        b += (d ^ (c | ~a)) + blocks2[9] - 343485551;
        b = (b << 21 | b >>> 11) + c << 0;
        if (this.first) {
          this.h0 = a + 1732584193 << 0;
          this.h1 = b - 271733879 << 0;
          this.h2 = c - 1732584194 << 0;
          this.h3 = d + 271733878 << 0;
          this.first = false;
        } else {
          this.h0 = this.h0 + a << 0;
          this.h1 = this.h1 + b << 0;
          this.h2 = this.h2 + c << 0;
          this.h3 = this.h3 + d << 0;
        }
      };
      Md5.prototype.hex = function() {
        this.finalize();
        var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
        return HEX_CHARS[h0 >>> 4 & 15] + HEX_CHARS[h0 & 15] + HEX_CHARS[h0 >>> 12 & 15] + HEX_CHARS[h0 >>> 8 & 15] + HEX_CHARS[h0 >>> 20 & 15] + HEX_CHARS[h0 >>> 16 & 15] + HEX_CHARS[h0 >>> 28 & 15] + HEX_CHARS[h0 >>> 24 & 15] + HEX_CHARS[h1 >>> 4 & 15] + HEX_CHARS[h1 & 15] + HEX_CHARS[h1 >>> 12 & 15] + HEX_CHARS[h1 >>> 8 & 15] + HEX_CHARS[h1 >>> 20 & 15] + HEX_CHARS[h1 >>> 16 & 15] + HEX_CHARS[h1 >>> 28 & 15] + HEX_CHARS[h1 >>> 24 & 15] + HEX_CHARS[h2 >>> 4 & 15] + HEX_CHARS[h2 & 15] + HEX_CHARS[h2 >>> 12 & 15] + HEX_CHARS[h2 >>> 8 & 15] + HEX_CHARS[h2 >>> 20 & 15] + HEX_CHARS[h2 >>> 16 & 15] + HEX_CHARS[h2 >>> 28 & 15] + HEX_CHARS[h2 >>> 24 & 15] + HEX_CHARS[h3 >>> 4 & 15] + HEX_CHARS[h3 & 15] + HEX_CHARS[h3 >>> 12 & 15] + HEX_CHARS[h3 >>> 8 & 15] + HEX_CHARS[h3 >>> 20 & 15] + HEX_CHARS[h3 >>> 16 & 15] + HEX_CHARS[h3 >>> 28 & 15] + HEX_CHARS[h3 >>> 24 & 15];
      };
      Md5.prototype.toString = Md5.prototype.hex;
      Md5.prototype.digest = function() {
        this.finalize();
        var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
        return [ h0 & 255, h0 >>> 8 & 255, h0 >>> 16 & 255, h0 >>> 24 & 255, h1 & 255, h1 >>> 8 & 255, h1 >>> 16 & 255, h1 >>> 24 & 255, h2 & 255, h2 >>> 8 & 255, h2 >>> 16 & 255, h2 >>> 24 & 255, h3 & 255, h3 >>> 8 & 255, h3 >>> 16 & 255, h3 >>> 24 & 255 ];
      };
      Md5.prototype.array = Md5.prototype.digest;
      Md5.prototype.arrayBuffer = function() {
        this.finalize();
        var buffer2 = new ArrayBuffer(16);
        var blocks2 = new Uint32Array(buffer2);
        blocks2[0] = this.h0;
        blocks2[1] = this.h1;
        blocks2[2] = this.h2;
        blocks2[3] = this.h3;
        return buffer2;
      };
      Md5.prototype.buffer = Md5.prototype.arrayBuffer;
      Md5.prototype.base64 = function() {
        var v1, v2, v3, base64Str = "", bytes = this.array();
        for (var i = 0; i < 15; ) {
          v1 = bytes[i++];
          v2 = bytes[i++];
          v3 = bytes[i++];
          base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] + BASE64_ENCODE_CHAR[(v1 << 4 | v2 >>> 4) & 63] + BASE64_ENCODE_CHAR[(v2 << 2 | v3 >>> 6) & 63] + BASE64_ENCODE_CHAR[v3 & 63];
        }
        v1 = bytes[i];
        base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] + BASE64_ENCODE_CHAR[v1 << 4 & 63] + "==";
        return base64Str;
      };
      function HmacMd5(key, sharedMemory) {
        var i, result = formatMessage(key);
        key = result[0];
        if (result[1]) {
          var bytes = [], length = key.length, index = 0, code;
          for (i = 0; i < length; ++i) {
            code = key.charCodeAt(i);
            if (code < 128) {
              bytes[index++] = code;
            } else if (code < 2048) {
              bytes[index++] = 192 | code >>> 6;
              bytes[index++] = 128 | code & 63;
            } else if (code < 55296 || code >= 57344) {
              bytes[index++] = 224 | code >>> 12;
              bytes[index++] = 128 | code >>> 6 & 63;
              bytes[index++] = 128 | code & 63;
            } else {
              code = 65536 + ((code & 1023) << 10 | key.charCodeAt(++i) & 1023);
              bytes[index++] = 240 | code >>> 18;
              bytes[index++] = 128 | code >>> 12 & 63;
              bytes[index++] = 128 | code >>> 6 & 63;
              bytes[index++] = 128 | code & 63;
            }
          }
          key = bytes;
        }
        if (key.length > 64) {
          key = new Md5(true).update(key).array();
        }
        var oKeyPad = [], iKeyPad = [];
        for (i = 0; i < 64; ++i) {
          var b = key[i] || 0;
          oKeyPad[i] = 92 ^ b;
          iKeyPad[i] = 54 ^ b;
        }
        Md5.call(this, sharedMemory);
        this.update(iKeyPad);
        this.oKeyPad = oKeyPad;
        this.inner = true;
        this.sharedMemory = sharedMemory;
      }
      HmacMd5.prototype = new Md5;
      HmacMd5.prototype.finalize = function() {
        Md5.prototype.finalize.call(this);
        if (this.inner) {
          this.inner = false;
          var innerHash = this.array();
          Md5.call(this, this.sharedMemory);
          this.update(this.oKeyPad);
          this.update(innerHash);
          Md5.prototype.finalize.call(this);
        }
      };
      var exports = createMethod();
      exports.md5 = exports;
      exports.md5.hmac = createHmacMethod();
      if (COMMON_JS) {
        module.exports = exports;
      } else {
        root.md5 = exports;
      }
    })();
  })(md5);

  var md5Exports = md5.exports;

  const RAW_TEXT_CLOSE_PATTERN = /<\/textarea/gi;

  const TEXT_SENTINEL = "x";

  const preserveCarriageReturns = value => value.replace(/\r/g, "&#13;");

  const decodeOnce = value => {
    var _a2, _b;
    const neutralized = preserveCarriageReturns(value.replace(RAW_TEXT_CLOSE_PATTERN, delimiter => `&lt;${delimiter.slice(1)}`));
    const parsed = (new DOMParser).parseFromString(`<textarea>${TEXT_SENTINEL}${neutralized}</textarea>`, "text/html");
    return ((_b = (_a2 = parsed.querySelector("textarea")) == null ? void 0 : _a2.textContent) == null ? void 0 : _b.slice(TEXT_SENTINEL.length)) ?? "";
  };

  const decodeAttributeOnce = value => {
    var _a2;
    const embedded = preserveCarriageReturns(value).replace(/"/g, "&quot;");
    const parsed = (new DOMParser).parseFromString(`<div data-value="${embedded}"></div>`, "text/html");
    return ((_a2 = parsed.querySelector("div")) == null ? void 0 : _a2.getAttribute("data-value")) ?? "";
  };

  const decodeHTML = value => decodeOnce(value);

  const decodeHTMLAttribute = value => decodeAttributeOnce(value);

  const decodeAttr = value => decodeHTMLAttribute(value);

  const decodeText = value => decodeHTML(value);

  const IMAGE_TAG_NAME = String.raw`img(?=[\s/>])`;

  const IMAGE_TAG_START_PATTERN = new RegExp(`^<${IMAGE_TAG_NAME}`, "i");

  const IMAGE_TAG_PATTERN = new RegExp(`<${IMAGE_TAG_NAME}[^>]*>`, "gi");

  const escapeAttr = value => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function serializeQuestionText(value) {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  const isHttpImageSrc = src => {
    if (!/^https?:\/\//i.test(src)) return false;
    try {
      const url = new URL(src);
      return (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname);
    } catch {
      return false;
    }
  };

  function imageSrcFromTag(tag) {
    if (!IMAGE_TAG_START_PATTERN.test(tag.trim())) return "";
    const match = tag.match(/(?:^|\s)src\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    return decodeAttr((match == null ? void 0 : match[1]) ?? (match == null ? void 0 : match[2]) ?? (match == null ? void 0 : match[3]) ?? "");
  }

  function serializeImageToken(src) {
    return isHttpImageSrc(src) ? `<img src="${escapeAttr(src)}">` : "";
  }

  function stripImageSrcVolatileParts(src) {
    return src.replace(/[?#].*$/, "");
  }

  function splitQuestionContent(value) {
    const source = String(value ?? "");
    const out = [];
    const pushText = text => {
      if (text) out.push({
        type: "text",
        value: text
      });
    };
    let cursor = 0;
    for (const match of source.matchAll(IMAGE_TAG_PATTERN)) {
      const index = match.index ?? 0;
      pushText(source.slice(cursor, index));
      const src = imageSrcFromTag(match[0]);
      if (isHttpImageSrc(src)) out.push({
        type: "image",
        value: src
      });
      cursor = index + match[0].length;
    }
    pushText(source.slice(cursor));
    return out;
  }

  const stripUntrustedTags = value => value.replace(/<\/?[A-Za-z][^>]*>/g, "");

  function normalizeImageTagsForHash(value) {
    return splitQuestionContent(value).map(part => part.type === "image" ? serializeImageToken(stripImageSrcVolatileParts(part.value)) : decodeText(part.value)).join("");
  }

  function normalizeQuestionContentForMatch(value) {
    return splitQuestionContent(value).map(part => part.type === "image" ? stripImageSrcVolatileParts(part.value) : decodeText(stripUntrustedTags(part.value))).join("");
  }

  function questionTextForSearch(value) {
    return parseQuestionContent(value).map(part => part.type === "image" ? serializeImageToken(part.value) : part.value).join("");
  }

  function parseQuestionContent(value, options = {}) {
    const out = [];
    const pushText = text => {
      if (!text) return;
      const last = out.at(-1);
      if ((last == null ? void 0 : last.type) === "text") last.value += text; else out.push({
        type: "text",
        value: text
      });
    };
    for (const part of splitQuestionContent(value)) {
      if (part.type === "image") out.push(part); else {
        const text = options.stripUntrustedTags === false ? part.value : stripUntrustedTags(part.value);
        pushText(decodeText(text));
      }
    }
    return out;
  }

  var sha256$1 = {
    exports: {}
  };

  (function(module) {
    (function() {
      var ERROR = "input is invalid type";
      var WINDOW = typeof window === "object";
      var root = WINDOW ? window : {};
      if (root.JS_SHA256_NO_WINDOW) {
        WINDOW = false;
      }
      var WEB_WORKER = !WINDOW && typeof self === "object";
      var NODE_JS = !root.JS_SHA256_NO_NODE_JS && typeof process === "object" && process.versions && process.versions.node && process.type != "renderer";
      if (NODE_JS) {
        root = commonjsGlobal;
      } else if (WEB_WORKER) {
        root = self;
      }
      var COMMON_JS = !root.JS_SHA256_NO_COMMON_JS && true && module.exports;
      var ARRAY_BUFFER = !root.JS_SHA256_NO_ARRAY_BUFFER && typeof ArrayBuffer !== "undefined";
      var HEX_CHARS = "0123456789abcdef".split("");
      var EXTRA = [ -2147483648, 8388608, 32768, 128 ];
      var SHIFT = [ 24, 16, 8, 0 ];
      var K = [ 1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298 ];
      var OUTPUT_TYPES = [ "hex", "array", "digest", "arrayBuffer" ];
      var blocks = [];
      if (root.JS_SHA256_NO_NODE_JS || !Array.isArray) {
        Array.isArray = function(obj) {
          return Object.prototype.toString.call(obj) === "[object Array]";
        };
      }
      if (ARRAY_BUFFER && (root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
        ArrayBuffer.isView = function(obj) {
          return typeof obj === "object" && obj.buffer && obj.buffer.constructor === ArrayBuffer;
        };
      }
      var createOutputMethod = function(outputType, is224) {
        return function(message) {
          return new Sha256(is224, true).update(message)[outputType]();
        };
      };
      var createMethod = function(is224) {
        var method = createOutputMethod("hex", is224);
        if (NODE_JS) {
          method = nodeWrap(method, is224);
        }
        method.create = function() {
          return new Sha256(is224);
        };
        method.update = function(message) {
          return method.create().update(message);
        };
        for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
          var type = OUTPUT_TYPES[i];
          method[type] = createOutputMethod(type, is224);
        }
        return method;
      };
      var nodeWrap = function(method, is224) {
        var crypto2 = require$$1;
        var Buffer2 = require$$1.Buffer;
        var algorithm = is224 ? "sha224" : "sha256";
        var bufferFrom;
        if (Buffer2.from && !root.JS_SHA256_NO_BUFFER_FROM) {
          bufferFrom = Buffer2.from;
        } else {
          bufferFrom = function(message) {
            return new Buffer2(message);
          };
        }
        var nodeMethod = function(message) {
          if (typeof message === "string") {
            return crypto2.createHash(algorithm).update(message, "utf8").digest("hex");
          } else {
            if (message === null || message === void 0) {
              throw new Error(ERROR);
            } else if (message.constructor === ArrayBuffer) {
              message = new Uint8Array(message);
            }
          }
          if (Array.isArray(message) || ArrayBuffer.isView(message) || message.constructor === Buffer2) {
            return crypto2.createHash(algorithm).update(bufferFrom(message)).digest("hex");
          } else {
            return method(message);
          }
        };
        return nodeMethod;
      };
      var createHmacOutputMethod = function(outputType, is224) {
        return function(key, message) {
          return new HmacSha256(key, is224, true).update(message)[outputType]();
        };
      };
      var createHmacMethod = function(is224) {
        var method = createHmacOutputMethod("hex", is224);
        method.create = function(key) {
          return new HmacSha256(key, is224);
        };
        method.update = function(key, message) {
          return method.create(key).update(message);
        };
        for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
          var type = OUTPUT_TYPES[i];
          method[type] = createHmacOutputMethod(type, is224);
        }
        return method;
      };
      function Sha256(is224, sharedMemory) {
        if (sharedMemory) {
          blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
          this.blocks = blocks;
        } else {
          this.blocks = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        }
        if (is224) {
          this.h0 = 3238371032;
          this.h1 = 914150663;
          this.h2 = 812702999;
          this.h3 = 4144912697;
          this.h4 = 4290775857;
          this.h5 = 1750603025;
          this.h6 = 1694076839;
          this.h7 = 3204075428;
        } else {
          this.h0 = 1779033703;
          this.h1 = 3144134277;
          this.h2 = 1013904242;
          this.h3 = 2773480762;
          this.h4 = 1359893119;
          this.h5 = 2600822924;
          this.h6 = 528734635;
          this.h7 = 1541459225;
        }
        this.block = this.start = this.bytes = this.hBytes = 0;
        this.finalized = this.hashed = false;
        this.first = true;
        this.is224 = is224;
      }
      Sha256.prototype.update = function(message) {
        if (this.finalized) {
          return;
        }
        var notString, type = typeof message;
        if (type !== "string") {
          if (type === "object") {
            if (message === null) {
              throw new Error(ERROR);
            } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
              message = new Uint8Array(message);
            } else if (!Array.isArray(message)) {
              if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
                throw new Error(ERROR);
              }
            }
          } else {
            throw new Error(ERROR);
          }
          notString = true;
        }
        var code, index = 0, i, length = message.length, blocks2 = this.blocks;
        while (index < length) {
          if (this.hashed) {
            this.hashed = false;
            blocks2[0] = this.block;
            this.block = blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
          }
          if (notString) {
            for (i = this.start; index < length && i < 64; ++index) {
              blocks2[i >>> 2] |= message[index] << SHIFT[i++ & 3];
            }
          } else {
            for (i = this.start; index < length && i < 64; ++index) {
              code = message.charCodeAt(index);
              if (code < 128) {
                blocks2[i >>> 2] |= code << SHIFT[i++ & 3];
              } else if (code < 2048) {
                blocks2[i >>> 2] |= (192 | code >>> 6) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
              } else if (code < 55296 || code >= 57344) {
                blocks2[i >>> 2] |= (224 | code >>> 12) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
              } else {
                code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index) & 1023);
                blocks2[i >>> 2] |= (240 | code >>> 18) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code >>> 12 & 63) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
              }
            }
          }
          this.lastByteIndex = i;
          this.bytes += i - this.start;
          if (i >= 64) {
            this.block = blocks2[16];
            this.start = i - 64;
            this.hash();
            this.hashed = true;
          } else {
            this.start = i;
          }
        }
        if (this.bytes > 4294967295) {
          this.hBytes += this.bytes / 4294967296 << 0;
          this.bytes = this.bytes % 4294967296;
        }
        return this;
      };
      Sha256.prototype.finalize = function() {
        if (this.finalized) {
          return;
        }
        this.finalized = true;
        var blocks2 = this.blocks, i = this.lastByteIndex;
        blocks2[16] = this.block;
        blocks2[i >>> 2] |= EXTRA[i & 3];
        this.block = blocks2[16];
        if (i >= 56) {
          if (!this.hashed) {
            this.hash();
          }
          blocks2[0] = this.block;
          blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
        }
        blocks2[14] = this.hBytes << 3 | this.bytes >>> 29;
        blocks2[15] = this.bytes << 3;
        this.hash();
      };
      Sha256.prototype.hash = function() {
        var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4, f = this.h5, g = this.h6, h = this.h7, blocks2 = this.blocks, j, s0, s1, maj, t1, t2, ch, ab, da, cd, bc;
        for (j = 16; j < 64; ++j) {
          t1 = blocks2[j - 15];
          s0 = (t1 >>> 7 | t1 << 25) ^ (t1 >>> 18 | t1 << 14) ^ t1 >>> 3;
          t1 = blocks2[j - 2];
          s1 = (t1 >>> 17 | t1 << 15) ^ (t1 >>> 19 | t1 << 13) ^ t1 >>> 10;
          blocks2[j] = blocks2[j - 16] + s0 + blocks2[j - 7] + s1 << 0;
        }
        bc = b & c;
        for (j = 0; j < 64; j += 4) {
          if (this.first) {
            if (this.is224) {
              ab = 300032;
              t1 = blocks2[0] - 1413257819;
              h = t1 - 150054599 << 0;
              d = t1 + 24177077 << 0;
            } else {
              ab = 704751109;
              t1 = blocks2[0] - 210244248;
              h = t1 - 1521486534 << 0;
              d = t1 + 143694565 << 0;
            }
            this.first = false;
          } else {
            s0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
            s1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
            ab = a & b;
            maj = ab ^ a & c ^ bc;
            ch = e & f ^ ~e & g;
            t1 = h + s1 + ch + K[j] + blocks2[j];
            t2 = s0 + maj;
            h = d + t1 << 0;
            d = t1 + t2 << 0;
          }
          s0 = (d >>> 2 | d << 30) ^ (d >>> 13 | d << 19) ^ (d >>> 22 | d << 10);
          s1 = (h >>> 6 | h << 26) ^ (h >>> 11 | h << 21) ^ (h >>> 25 | h << 7);
          da = d & a;
          maj = da ^ d & b ^ ab;
          ch = h & e ^ ~h & f;
          t1 = g + s1 + ch + K[j + 1] + blocks2[j + 1];
          t2 = s0 + maj;
          g = c + t1 << 0;
          c = t1 + t2 << 0;
          s0 = (c >>> 2 | c << 30) ^ (c >>> 13 | c << 19) ^ (c >>> 22 | c << 10);
          s1 = (g >>> 6 | g << 26) ^ (g >>> 11 | g << 21) ^ (g >>> 25 | g << 7);
          cd = c & d;
          maj = cd ^ c & a ^ da;
          ch = g & h ^ ~g & e;
          t1 = f + s1 + ch + K[j + 2] + blocks2[j + 2];
          t2 = s0 + maj;
          f = b + t1 << 0;
          b = t1 + t2 << 0;
          s0 = (b >>> 2 | b << 30) ^ (b >>> 13 | b << 19) ^ (b >>> 22 | b << 10);
          s1 = (f >>> 6 | f << 26) ^ (f >>> 11 | f << 21) ^ (f >>> 25 | f << 7);
          bc = b & c;
          maj = bc ^ b & d ^ cd;
          ch = f & g ^ ~f & h;
          t1 = e + s1 + ch + K[j + 3] + blocks2[j + 3];
          t2 = s0 + maj;
          e = a + t1 << 0;
          a = t1 + t2 << 0;
          this.chromeBugWorkAround = true;
        }
        this.h0 = this.h0 + a << 0;
        this.h1 = this.h1 + b << 0;
        this.h2 = this.h2 + c << 0;
        this.h3 = this.h3 + d << 0;
        this.h4 = this.h4 + e << 0;
        this.h5 = this.h5 + f << 0;
        this.h6 = this.h6 + g << 0;
        this.h7 = this.h7 + h << 0;
      };
      Sha256.prototype.hex = function() {
        this.finalize();
        var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5, h6 = this.h6, h7 = this.h7;
        var hex = HEX_CHARS[h0 >>> 28 & 15] + HEX_CHARS[h0 >>> 24 & 15] + HEX_CHARS[h0 >>> 20 & 15] + HEX_CHARS[h0 >>> 16 & 15] + HEX_CHARS[h0 >>> 12 & 15] + HEX_CHARS[h0 >>> 8 & 15] + HEX_CHARS[h0 >>> 4 & 15] + HEX_CHARS[h0 & 15] + HEX_CHARS[h1 >>> 28 & 15] + HEX_CHARS[h1 >>> 24 & 15] + HEX_CHARS[h1 >>> 20 & 15] + HEX_CHARS[h1 >>> 16 & 15] + HEX_CHARS[h1 >>> 12 & 15] + HEX_CHARS[h1 >>> 8 & 15] + HEX_CHARS[h1 >>> 4 & 15] + HEX_CHARS[h1 & 15] + HEX_CHARS[h2 >>> 28 & 15] + HEX_CHARS[h2 >>> 24 & 15] + HEX_CHARS[h2 >>> 20 & 15] + HEX_CHARS[h2 >>> 16 & 15] + HEX_CHARS[h2 >>> 12 & 15] + HEX_CHARS[h2 >>> 8 & 15] + HEX_CHARS[h2 >>> 4 & 15] + HEX_CHARS[h2 & 15] + HEX_CHARS[h3 >>> 28 & 15] + HEX_CHARS[h3 >>> 24 & 15] + HEX_CHARS[h3 >>> 20 & 15] + HEX_CHARS[h3 >>> 16 & 15] + HEX_CHARS[h3 >>> 12 & 15] + HEX_CHARS[h3 >>> 8 & 15] + HEX_CHARS[h3 >>> 4 & 15] + HEX_CHARS[h3 & 15] + HEX_CHARS[h4 >>> 28 & 15] + HEX_CHARS[h4 >>> 24 & 15] + HEX_CHARS[h4 >>> 20 & 15] + HEX_CHARS[h4 >>> 16 & 15] + HEX_CHARS[h4 >>> 12 & 15] + HEX_CHARS[h4 >>> 8 & 15] + HEX_CHARS[h4 >>> 4 & 15] + HEX_CHARS[h4 & 15] + HEX_CHARS[h5 >>> 28 & 15] + HEX_CHARS[h5 >>> 24 & 15] + HEX_CHARS[h5 >>> 20 & 15] + HEX_CHARS[h5 >>> 16 & 15] + HEX_CHARS[h5 >>> 12 & 15] + HEX_CHARS[h5 >>> 8 & 15] + HEX_CHARS[h5 >>> 4 & 15] + HEX_CHARS[h5 & 15] + HEX_CHARS[h6 >>> 28 & 15] + HEX_CHARS[h6 >>> 24 & 15] + HEX_CHARS[h6 >>> 20 & 15] + HEX_CHARS[h6 >>> 16 & 15] + HEX_CHARS[h6 >>> 12 & 15] + HEX_CHARS[h6 >>> 8 & 15] + HEX_CHARS[h6 >>> 4 & 15] + HEX_CHARS[h6 & 15];
        if (!this.is224) {
          hex += HEX_CHARS[h7 >>> 28 & 15] + HEX_CHARS[h7 >>> 24 & 15] + HEX_CHARS[h7 >>> 20 & 15] + HEX_CHARS[h7 >>> 16 & 15] + HEX_CHARS[h7 >>> 12 & 15] + HEX_CHARS[h7 >>> 8 & 15] + HEX_CHARS[h7 >>> 4 & 15] + HEX_CHARS[h7 & 15];
        }
        return hex;
      };
      Sha256.prototype.toString = Sha256.prototype.hex;
      Sha256.prototype.digest = function() {
        this.finalize();
        var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5, h6 = this.h6, h7 = this.h7;
        var arr = [ h0 >>> 24 & 255, h0 >>> 16 & 255, h0 >>> 8 & 255, h0 & 255, h1 >>> 24 & 255, h1 >>> 16 & 255, h1 >>> 8 & 255, h1 & 255, h2 >>> 24 & 255, h2 >>> 16 & 255, h2 >>> 8 & 255, h2 & 255, h3 >>> 24 & 255, h3 >>> 16 & 255, h3 >>> 8 & 255, h3 & 255, h4 >>> 24 & 255, h4 >>> 16 & 255, h4 >>> 8 & 255, h4 & 255, h5 >>> 24 & 255, h5 >>> 16 & 255, h5 >>> 8 & 255, h5 & 255, h6 >>> 24 & 255, h6 >>> 16 & 255, h6 >>> 8 & 255, h6 & 255 ];
        if (!this.is224) {
          arr.push(h7 >>> 24 & 255, h7 >>> 16 & 255, h7 >>> 8 & 255, h7 & 255);
        }
        return arr;
      };
      Sha256.prototype.array = Sha256.prototype.digest;
      Sha256.prototype.arrayBuffer = function() {
        this.finalize();
        var buffer = new ArrayBuffer(this.is224 ? 28 : 32);
        var dataView = new DataView(buffer);
        dataView.setUint32(0, this.h0);
        dataView.setUint32(4, this.h1);
        dataView.setUint32(8, this.h2);
        dataView.setUint32(12, this.h3);
        dataView.setUint32(16, this.h4);
        dataView.setUint32(20, this.h5);
        dataView.setUint32(24, this.h6);
        if (!this.is224) {
          dataView.setUint32(28, this.h7);
        }
        return buffer;
      };
      function HmacSha256(key, is224, sharedMemory) {
        var i, type = typeof key;
        if (type === "string") {
          var bytes = [], length = key.length, index = 0, code;
          for (i = 0; i < length; ++i) {
            code = key.charCodeAt(i);
            if (code < 128) {
              bytes[index++] = code;
            } else if (code < 2048) {
              bytes[index++] = 192 | code >>> 6;
              bytes[index++] = 128 | code & 63;
            } else if (code < 55296 || code >= 57344) {
              bytes[index++] = 224 | code >>> 12;
              bytes[index++] = 128 | code >>> 6 & 63;
              bytes[index++] = 128 | code & 63;
            } else {
              code = 65536 + ((code & 1023) << 10 | key.charCodeAt(++i) & 1023);
              bytes[index++] = 240 | code >>> 18;
              bytes[index++] = 128 | code >>> 12 & 63;
              bytes[index++] = 128 | code >>> 6 & 63;
              bytes[index++] = 128 | code & 63;
            }
          }
          key = bytes;
        } else {
          if (type === "object") {
            if (key === null) {
              throw new Error(ERROR);
            } else if (ARRAY_BUFFER && key.constructor === ArrayBuffer) {
              key = new Uint8Array(key);
            } else if (!Array.isArray(key)) {
              if (!ARRAY_BUFFER || !ArrayBuffer.isView(key)) {
                throw new Error(ERROR);
              }
            }
          } else {
            throw new Error(ERROR);
          }
        }
        if (key.length > 64) {
          key = new Sha256(is224, true).update(key).array();
        }
        var oKeyPad = [], iKeyPad = [];
        for (i = 0; i < 64; ++i) {
          var b = key[i] || 0;
          oKeyPad[i] = 92 ^ b;
          iKeyPad[i] = 54 ^ b;
        }
        Sha256.call(this, is224, sharedMemory);
        this.update(iKeyPad);
        this.oKeyPad = oKeyPad;
        this.inner = true;
        this.sharedMemory = sharedMemory;
      }
      HmacSha256.prototype = new Sha256;
      HmacSha256.prototype.finalize = function() {
        Sha256.prototype.finalize.call(this);
        if (this.inner) {
          this.inner = false;
          var innerHash = this.array();
          Sha256.call(this, this.is224, this.sharedMemory);
          this.update(this.oKeyPad);
          this.update(innerHash);
          Sha256.prototype.finalize.call(this);
        }
      };
      var exports = createMethod();
      exports.sha256 = exports;
      exports.sha224 = createMethod(true);
      exports.sha256.hmac = createHmacMethod();
      exports.sha224.hmac = createHmacMethod(true);
      if (COMMON_JS) {
        module.exports = exports;
      } else {
        root.sha256 = exports.sha256;
        root.sha224 = exports.sha224;
      }
    })();
  })(sha256$1);

  var sha256Exports = sha256$1.exports;

  function normalizeQuestionContentForHash(value) {
    return normalizeImageTagsForHash(value).replace(/\s+/g, " ").trim();
  }

  const sortedContent = values => values.map(item => normalizeQuestionContentForHash(item.content)).sort();

  const canonicalSlot = slot => [ normalizeQuestionContentForHash(slot.label ?? ""), sortedContent(slot.options ?? []) ];

  function semanticNode(node) {
    switch (node.kind) {
     case "leaf":
      return [ "leaf", node.type, normalizeQuestionContentForHash(node.stem), sortedContent(node.options), node.slots.map(canonicalSlot) ];

     case "composite":
      return [ "composite", node.type, normalizeQuestionContentForHash(node.stem), node.children.map(questionNodeHash) ];

     case "matching":
      return [ "matching", node.cardinality, normalizeQuestionContentForHash(node.stem), sortedContent(node.left), sortedContent(node.right) ];
    }
  }

  function canonicalQuestionNode(node) {
    return JSON.stringify(semanticNode(node));
  }

  function questionNodeHash(node) {
    return sha256Exports.sha256(canonicalQuestionNode(node));
  }

  function semanticContentHash(value) {
    return sha256Exports.sha256(normalizeQuestionContentForHash(value));
  }

  function searchUnitHash(input) {
    const segments = input.stemSegments.map(normalizeQuestionContentForHash).filter(Boolean).map(value => [ (new TextEncoder).encode(value).length, value ]);
    return sha256Exports.sha256(JSON.stringify([ "search-unit-v2", input.queryType, segments, sortedContent(input.options), input.answerShape, input.sourceNodeHash ]));
  }

  var util;

  (function(util2) {
    util2.assertEqual = _ => {};
    function assertIs(_arg) {}
    util2.assertIs = assertIs;
    function assertNever(_x) {
      throw new Error;
    }
    util2.assertNever = assertNever;
    util2.arrayToEnum = items => {
      const obj = {};
      for (const item of items) {
        obj[item] = item;
      }
      return obj;
    };
    util2.getValidEnumValues = obj => {
      const validKeys = util2.objectKeys(obj).filter(k => typeof obj[obj[k]] !== "number");
      const filtered = {};
      for (const k of validKeys) {
        filtered[k] = obj[k];
      }
      return util2.objectValues(filtered);
    };
    util2.objectValues = obj => util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
    util2.objectKeys = typeof Object.keys === "function" ? obj => Object.keys(obj) : object => {
      const keys = [];
      for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          keys.push(key);
        }
      }
      return keys;
    };
    util2.find = (arr, checker) => {
      for (const item of arr) {
        if (checker(item)) return item;
      }
      return void 0;
    };
    util2.isInteger = typeof Number.isInteger === "function" ? val => Number.isInteger(val) : val => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
    function joinValues(array, separator = " | ") {
      return array.map(val => typeof val === "string" ? `'${val}'` : val).join(separator);
    }
    util2.joinValues = joinValues;
    util2.jsonStringifyReplacer = (_, value) => {
      if (typeof value === "bigint") {
        return value.toString();
      }
      return value;
    };
  })(util || (util = {}));

  var objectUtil;

  (function(objectUtil2) {
    objectUtil2.mergeShapes = (first, second) => ({
      ...first,
      ...second
    });
  })(objectUtil || (objectUtil = {}));

  const ZodParsedType = util.arrayToEnum([ "string", "nan", "number", "integer", "float", "boolean", "date", "bigint", "symbol", "function", "undefined", "null", "array", "object", "unknown", "promise", "void", "never", "map", "set" ]);

  const getParsedType = data => {
    const t = typeof data;
    switch (t) {
     case "undefined":
      return ZodParsedType.undefined;

     case "string":
      return ZodParsedType.string;

     case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;

     case "boolean":
      return ZodParsedType.boolean;

     case "function":
      return ZodParsedType.function;

     case "bigint":
      return ZodParsedType.bigint;

     case "symbol":
      return ZodParsedType.symbol;

     case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;

     default:
      return ZodParsedType.unknown;
    }
  };

  const ZodIssueCode = util.arrayToEnum([ "invalid_type", "invalid_literal", "custom", "invalid_union", "invalid_union_discriminator", "invalid_enum_value", "unrecognized_keys", "invalid_arguments", "invalid_return_type", "invalid_date", "invalid_string", "too_small", "too_big", "invalid_intersection_types", "not_multiple_of", "not_finite" ]);

  class ZodError extends Error {
    get errors() {
      return this.issues;
    }
    constructor(issues) {
      super();
      this.issues = [];
      this.addIssue = sub => {
        this.issues = [ ...this.issues, sub ];
      };
      this.addIssues = (subs = []) => {
        this.issues = [ ...this.issues, ...subs ];
      };
      const actualProto = new.target.prototype;
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(this, actualProto);
      } else {
        this.__proto__ = actualProto;
      }
      this.name = "ZodError";
      this.issues = issues;
    }
    format(_mapper) {
      const mapper = _mapper || function(issue) {
        return issue.message;
      };
      const fieldErrors = {
        _errors: []
      };
      const processError = error => {
        for (const issue of error.issues) {
          if (issue.code === "invalid_union") {
            issue.unionErrors.map(processError);
          } else if (issue.code === "invalid_return_type") {
            processError(issue.returnTypeError);
          } else if (issue.code === "invalid_arguments") {
            processError(issue.argumentsError);
          } else if (issue.path.length === 0) {
            fieldErrors._errors.push(mapper(issue));
          } else {
            let curr = fieldErrors;
            let i = 0;
            while (i < issue.path.length) {
              const el = issue.path[i];
              const terminal = i === issue.path.length - 1;
              if (!terminal) {
                curr[el] = curr[el] || {
                  _errors: []
                };
              } else {
                curr[el] = curr[el] || {
                  _errors: []
                };
                curr[el]._errors.push(mapper(issue));
              }
              curr = curr[el];
              i++;
            }
          }
        }
      };
      processError(this);
      return fieldErrors;
    }
    static assert(value) {
      if (!(value instanceof ZodError)) {
        throw new Error(`Not a ZodError: ${value}`);
      }
    }
    toString() {
      return this.message;
    }
    get message() {
      return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
    }
    get isEmpty() {
      return this.issues.length === 0;
    }
    flatten(mapper = issue => issue.message) {
      const fieldErrors = {};
      const formErrors = [];
      for (const sub of this.issues) {
        if (sub.path.length > 0) {
          const firstEl = sub.path[0];
          fieldErrors[firstEl] = fieldErrors[firstEl] || [];
          fieldErrors[firstEl].push(mapper(sub));
        } else {
          formErrors.push(mapper(sub));
        }
      }
      return {
        formErrors: formErrors,
        fieldErrors: fieldErrors
      };
    }
    get formErrors() {
      return this.flatten();
    }
  }

  ZodError.create = issues => {
    const error = new ZodError(issues);
    return error;
  };

  const errorMap = (issue, _ctx) => {
    let message;
    switch (issue.code) {
     case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;

     case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;

     case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;

     case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;

     case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;

     case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;

     case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;

     case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;

     case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;

     case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;

     case ZodIssueCode.too_small:
      if (issue.type === "array") message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`; else if (issue.type === "string") message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`; else if (issue.type === "number") message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`; else if (issue.type === "bigint") message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`; else if (issue.type === "date") message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`; else message = "Invalid input";
      break;

     case ZodIssueCode.too_big:
      if (issue.type === "array") message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`; else if (issue.type === "string") message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`; else if (issue.type === "number") message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`; else if (issue.type === "bigint") message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`; else if (issue.type === "date") message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`; else message = "Invalid input";
      break;

     case ZodIssueCode.custom:
      message = `Invalid input`;
      break;

     case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;

     case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;

     case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;

     default:
      message = _ctx.defaultError;
      util.assertNever(issue);
    }
    return {
      message: message
    };
  };

  let overrideErrorMap = errorMap;

  function getErrorMap() {
    return overrideErrorMap;
  }

  const makeIssue = params => {
    const {data: data, path: path, errorMaps: errorMaps, issueData: issueData} = params;
    const fullPath = [ ...path, ...issueData.path || [] ];
    const fullIssue = {
      ...issueData,
      path: fullPath
    };
    if (issueData.message !== void 0) {
      return {
        ...issueData,
        path: fullPath,
        message: issueData.message
      };
    }
    let errorMessage = "";
    const maps = errorMaps.filter(m => !!m).slice().reverse();
    for (const map of maps) {
      errorMessage = map(fullIssue, {
        data: data,
        defaultError: errorMessage
      }).message;
    }
    return {
      ...issueData,
      path: fullPath,
      message: errorMessage
    };
  };

  function addIssueToContext(ctx, issueData) {
    const overrideMap = getErrorMap();
    const issue = makeIssue({
      issueData: issueData,
      data: ctx.data,
      path: ctx.path,
      errorMaps: [ ctx.common.contextualErrorMap, ctx.schemaErrorMap, overrideMap, overrideMap === errorMap ? void 0 : errorMap ].filter(x => !!x)
    });
    ctx.common.issues.push(issue);
  }

  class ParseStatus {
    constructor() {
      this.value = "valid";
    }
    dirty() {
      if (this.value === "valid") this.value = "dirty";
    }
    abort() {
      if (this.value !== "aborted") this.value = "aborted";
    }
    static mergeArray(status, results) {
      const arrayValue = [];
      for (const s of results) {
        if (s.status === "aborted") return INVALID;
        if (s.status === "dirty") status.dirty();
        arrayValue.push(s.value);
      }
      return {
        status: status.value,
        value: arrayValue
      };
    }
    static async mergeObjectAsync(status, pairs) {
      const syncPairs = [];
      for (const pair of pairs) {
        const key = await pair.key;
        const value = await pair.value;
        syncPairs.push({
          key: key,
          value: value
        });
      }
      return ParseStatus.mergeObjectSync(status, syncPairs);
    }
    static mergeObjectSync(status, pairs) {
      const finalObject = {};
      for (const pair of pairs) {
        const {key: key, value: value} = pair;
        if (key.status === "aborted") return INVALID;
        if (value.status === "aborted") return INVALID;
        if (key.status === "dirty") status.dirty();
        if (value.status === "dirty") status.dirty();
        if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
          finalObject[key.value] = value.value;
        }
      }
      return {
        status: status.value,
        value: finalObject
      };
    }
  }

  const INVALID = Object.freeze({
    status: "aborted"
  });

  const DIRTY = value => ({
    status: "dirty",
    value: value
  });

  const OK = value => ({
    status: "valid",
    value: value
  });

  const isAborted = x => x.status === "aborted";

  const isDirty = x => x.status === "dirty";

  const isValid = x => x.status === "valid";

  const isAsync = x => typeof Promise !== "undefined" && x instanceof Promise;

  var errorUtil;

  (function(errorUtil2) {
    errorUtil2.errToObj = message => typeof message === "string" ? {
      message: message
    } : message || {};
    errorUtil2.toString = message => typeof message === "string" ? message : message == null ? void 0 : message.message;
  })(errorUtil || (errorUtil = {}));

  class ParseInputLazyPath {
    constructor(parent, value, path, key) {
      this._cachedPath = [];
      this.parent = parent;
      this.data = value;
      this._path = path;
      this._key = key;
    }
    get path() {
      if (!this._cachedPath.length) {
        if (Array.isArray(this._key)) {
          this._cachedPath.push(...this._path, ...this._key);
        } else {
          this._cachedPath.push(...this._path, this._key);
        }
      }
      return this._cachedPath;
    }
  }

  const handleResult = (ctx, result) => {
    if (isValid(result)) {
      return {
        success: true,
        data: result.value
      };
    } else {
      if (!ctx.common.issues.length) {
        throw new Error("Validation failed but no issues detected.");
      }
      return {
        success: false,
        get error() {
          if (this._error) return this._error;
          const error = new ZodError(ctx.common.issues);
          this._error = error;
          return this._error;
        }
      };
    }
  };

  function processCreateParams(params) {
    if (!params) return {};
    const {errorMap: errorMap2, invalid_type_error: invalid_type_error, required_error: required_error, description: description} = params;
    if (errorMap2 && (invalid_type_error || required_error)) {
      throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
    }
    if (errorMap2) return {
      errorMap: errorMap2,
      description: description
    };
    const customMap = (iss, ctx) => {
      const {message: message} = params;
      if (iss.code === "invalid_enum_value") {
        return {
          message: message ?? ctx.defaultError
        };
      }
      if (typeof ctx.data === "undefined") {
        return {
          message: message ?? required_error ?? ctx.defaultError
        };
      }
      if (iss.code !== "invalid_type") return {
        message: ctx.defaultError
      };
      return {
        message: message ?? invalid_type_error ?? ctx.defaultError
      };
    };
    return {
      errorMap: customMap,
      description: description
    };
  }

  class ZodType {
    get description() {
      return this._def.description;
    }
    _getType(input) {
      return getParsedType(input.data);
    }
    _getOrReturnCtx(input, ctx) {
      return ctx || {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      };
    }
    _processInputParams(input) {
      return {
        status: new ParseStatus,
        ctx: {
          common: input.parent.common,
          data: input.data,
          parsedType: getParsedType(input.data),
          schemaErrorMap: this._def.errorMap,
          path: input.path,
          parent: input.parent
        }
      };
    }
    _parseSync(input) {
      const result = this._parse(input);
      if (isAsync(result)) {
        throw new Error("Synchronous parse encountered promise.");
      }
      return result;
    }
    _parseAsync(input) {
      const result = this._parse(input);
      return Promise.resolve(result);
    }
    parse(data, params) {
      const result = this.safeParse(data, params);
      if (result.success) return result.data;
      throw result.error;
    }
    safeParse(data, params) {
      const ctx = {
        common: {
          issues: [],
          async: (params == null ? void 0 : params.async) ?? false,
          contextualErrorMap: params == null ? void 0 : params.errorMap
        },
        path: (params == null ? void 0 : params.path) || [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data: data,
        parsedType: getParsedType(data)
      };
      const result = this._parseSync({
        data: data,
        path: ctx.path,
        parent: ctx
      });
      return handleResult(ctx, result);
    }
    "~validate"(data) {
      var _a2, _b;
      const ctx = {
        common: {
          issues: [],
          async: !!this["~standard"].async
        },
        path: [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data: data,
        parsedType: getParsedType(data)
      };
      if (!this["~standard"].async) {
        try {
          const result = this._parseSync({
            data: data,
            path: [],
            parent: ctx
          });
          return isValid(result) ? {
            value: result.value
          } : {
            issues: ctx.common.issues
          };
        } catch (err) {
          if ((_b = (_a2 = err == null ? void 0 : err.message) == null ? void 0 : _a2.toLowerCase()) == null ? void 0 : _b.includes("encountered")) {
            this["~standard"].async = true;
          }
          ctx.common = {
            issues: [],
            async: true
          };
        }
      }
      return this._parseAsync({
        data: data,
        path: [],
        parent: ctx
      }).then(result => isValid(result) ? {
        value: result.value
      } : {
        issues: ctx.common.issues
      });
    }
    async parseAsync(data, params) {
      const result = await this.safeParseAsync(data, params);
      if (result.success) return result.data;
      throw result.error;
    }
    async safeParseAsync(data, params) {
      const ctx = {
        common: {
          issues: [],
          contextualErrorMap: params == null ? void 0 : params.errorMap,
          async: true
        },
        path: (params == null ? void 0 : params.path) || [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data: data,
        parsedType: getParsedType(data)
      };
      const maybeAsyncResult = this._parse({
        data: data,
        path: ctx.path,
        parent: ctx
      });
      const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
      return handleResult(ctx, result);
    }
    refine(check, message) {
      const getIssueProperties = val => {
        if (typeof message === "string" || typeof message === "undefined") {
          return {
            message: message
          };
        } else if (typeof message === "function") {
          return message(val);
        } else {
          return message;
        }
      };
      return this._refinement((val, ctx) => {
        const result = check(val);
        const setError = () => ctx.addIssue({
          code: ZodIssueCode.custom,
          ...getIssueProperties(val)
        });
        if (typeof Promise !== "undefined" && result instanceof Promise) {
          return result.then(data => {
            if (!data) {
              setError();
              return false;
            } else {
              return true;
            }
          });
        }
        if (!result) {
          setError();
          return false;
        } else {
          return true;
        }
      });
    }
    refinement(check, refinementData) {
      return this._refinement((val, ctx) => {
        if (!check(val)) {
          ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
          return false;
        } else {
          return true;
        }
      });
    }
    _refinement(refinement) {
      return new ZodEffects({
        schema: this,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect: {
          type: "refinement",
          refinement: refinement
        }
      });
    }
    superRefine(refinement) {
      return this._refinement(refinement);
    }
    constructor(def) {
      this.spa = this.safeParseAsync;
      this._def = def;
      this.parse = this.parse.bind(this);
      this.safeParse = this.safeParse.bind(this);
      this.parseAsync = this.parseAsync.bind(this);
      this.safeParseAsync = this.safeParseAsync.bind(this);
      this.spa = this.spa.bind(this);
      this.refine = this.refine.bind(this);
      this.refinement = this.refinement.bind(this);
      this.superRefine = this.superRefine.bind(this);
      this.optional = this.optional.bind(this);
      this.nullable = this.nullable.bind(this);
      this.nullish = this.nullish.bind(this);
      this.array = this.array.bind(this);
      this.promise = this.promise.bind(this);
      this.or = this.or.bind(this);
      this.and = this.and.bind(this);
      this.transform = this.transform.bind(this);
      this.brand = this.brand.bind(this);
      this.default = this.default.bind(this);
      this.catch = this.catch.bind(this);
      this.describe = this.describe.bind(this);
      this.pipe = this.pipe.bind(this);
      this.readonly = this.readonly.bind(this);
      this.isNullable = this.isNullable.bind(this);
      this.isOptional = this.isOptional.bind(this);
      this["~standard"] = {
        version: 1,
        vendor: "zod",
        validate: data => this["~validate"](data)
      };
    }
    optional() {
      return ZodOptional.create(this, this._def);
    }
    nullable() {
      return ZodNullable.create(this, this._def);
    }
    nullish() {
      return this.nullable().optional();
    }
    array() {
      return ZodArray.create(this);
    }
    promise() {
      return ZodPromise.create(this, this._def);
    }
    or(option) {
      return ZodUnion.create([ this, option ], this._def);
    }
    and(incoming) {
      return ZodIntersection.create(this, incoming, this._def);
    }
    transform(transform) {
      return new ZodEffects({
        ...processCreateParams(this._def),
        schema: this,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect: {
          type: "transform",
          transform: transform
        }
      });
    }
    default(def) {
      const defaultValueFunc = typeof def === "function" ? def : () => def;
      return new ZodDefault({
        ...processCreateParams(this._def),
        innerType: this,
        defaultValue: defaultValueFunc,
        typeName: ZodFirstPartyTypeKind.ZodDefault
      });
    }
    brand() {
      return new ZodBranded({
        typeName: ZodFirstPartyTypeKind.ZodBranded,
        type: this,
        ...processCreateParams(this._def)
      });
    }
    catch(def) {
      const catchValueFunc = typeof def === "function" ? def : () => def;
      return new ZodCatch({
        ...processCreateParams(this._def),
        innerType: this,
        catchValue: catchValueFunc,
        typeName: ZodFirstPartyTypeKind.ZodCatch
      });
    }
    describe(description) {
      const This = this.constructor;
      return new This({
        ...this._def,
        description: description
      });
    }
    pipe(target) {
      return ZodPipeline.create(this, target);
    }
    readonly() {
      return ZodReadonly.create(this);
    }
    isOptional() {
      return this.safeParse(void 0).success;
    }
    isNullable() {
      return this.safeParse(null).success;
    }
  }

  const cuidRegex = /^c[^\s-]{8,}$/i;

  const cuid2Regex = /^[0-9a-z]+$/;

  const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;

  const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;

  const nanoidRegex = /^[a-z0-9_-]{21}$/i;

  const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;

  const durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;

  const emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;

  const _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;

  let emojiRegex;

  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;

  const ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;

  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

  const ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;

  const base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

  const base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;

  const dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;

  const dateRegex = new RegExp(`^${dateRegexSource}$`);

  function timeRegexSource(args) {
    let secondsRegexSource = `[0-5]\\d`;
    if (args.precision) {
      secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
    } else if (args.precision == null) {
      secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
    }
    const secondsQuantifier = args.precision ? "+" : "?";
    return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
  }

  function timeRegex(args) {
    return new RegExp(`^${timeRegexSource(args)}$`);
  }

  function datetimeRegex(args) {
    let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
    const opts = [];
    opts.push(args.local ? `Z?` : `Z`);
    if (args.offset) opts.push(`([+-]\\d{2}:?\\d{2})`);
    regex = `${regex}(${opts.join("|")})`;
    return new RegExp(`^${regex}$`);
  }

  function isValidIP(ip, version) {
    if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
      return true;
    }
    if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
      return true;
    }
    return false;
  }

  function isValidJWT(jwt, alg) {
    if (!jwtRegex.test(jwt)) return false;
    try {
      const [header] = jwt.split(".");
      if (!header) return false;
      const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
      const decoded = JSON.parse(atob(base64));
      if (typeof decoded !== "object" || decoded === null) return false;
      if ("typ" in decoded && (decoded == null ? void 0 : decoded.typ) !== "JWT") return false;
      if (!decoded.alg) return false;
      if (alg && decoded.alg !== alg) return false;
      return true;
    } catch {
      return false;
    }
  }

  function isValidCidr(ip, version) {
    if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
      return true;
    }
    if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
      return true;
    }
    return false;
  }

  class ZodString extends ZodType {
    _parse(input) {
      if (this._def.coerce) {
        input.data = String(input.data);
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.string) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.string,
          received: ctx2.parsedType
        });
        return INVALID;
      }
      const status = new ParseStatus;
      let ctx = void 0;
      for (const check of this._def.checks) {
        if (check.kind === "min") {
          if (input.data.length < check.value) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: false,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "max") {
          if (input.data.length > check.value) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: false,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "length") {
          const tooBig = input.data.length > check.value;
          const tooSmall = input.data.length < check.value;
          if (tooBig || tooSmall) {
            ctx = this._getOrReturnCtx(input, ctx);
            if (tooBig) {
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: check.value,
                type: "string",
                inclusive: true,
                exact: true,
                message: check.message
              });
            } else if (tooSmall) {
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: check.value,
                type: "string",
                inclusive: true,
                exact: true,
                message: check.message
              });
            }
            status.dirty();
          }
        } else if (check.kind === "email") {
          if (!emailRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "email",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "emoji") {
          if (!emojiRegex) {
            emojiRegex = new RegExp(_emojiRegex, "u");
          }
          if (!emojiRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "emoji",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "uuid") {
          if (!uuidRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "uuid",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "nanoid") {
          if (!nanoidRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "nanoid",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "cuid") {
          if (!cuidRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "cuid",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "cuid2") {
          if (!cuid2Regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "cuid2",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "ulid") {
          if (!ulidRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "ulid",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "url") {
          try {
            new URL(input.data);
          } catch {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "url",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "regex") {
          check.regex.lastIndex = 0;
          const testResult = check.regex.test(input.data);
          if (!testResult) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "regex",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "trim") {
          input.data = input.data.trim();
        } else if (check.kind === "includes") {
          if (!input.data.includes(check.value, check.position)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: {
                includes: check.value,
                position: check.position
              },
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "toLowerCase") {
          input.data = input.data.toLowerCase();
        } else if (check.kind === "toUpperCase") {
          input.data = input.data.toUpperCase();
        } else if (check.kind === "startsWith") {
          if (!input.data.startsWith(check.value)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: {
                startsWith: check.value
              },
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "endsWith") {
          if (!input.data.endsWith(check.value)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: {
                endsWith: check.value
              },
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "datetime") {
          const regex = datetimeRegex(check);
          if (!regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: "datetime",
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "date") {
          const regex = dateRegex;
          if (!regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: "date",
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "time") {
          const regex = timeRegex(check);
          if (!regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: "time",
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "duration") {
          if (!durationRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "duration",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "ip") {
          if (!isValidIP(input.data, check.version)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "ip",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "jwt") {
          if (!isValidJWT(input.data, check.alg)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "jwt",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "cidr") {
          if (!isValidCidr(input.data, check.version)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "cidr",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "base64") {
          if (!base64Regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "base64",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "base64url") {
          if (!base64urlRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "base64url",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else {
          util.assertNever(check);
        }
      }
      return {
        status: status.value,
        value: input.data
      };
    }
    _regex(regex, validation, message) {
      return this.refinement(data => regex.test(data), {
        validation: validation,
        code: ZodIssueCode.invalid_string,
        ...errorUtil.errToObj(message)
      });
    }
    _addCheck(check) {
      return new ZodString({
        ...this._def,
        checks: [ ...this._def.checks, check ]
      });
    }
    email(message) {
      return this._addCheck({
        kind: "email",
        ...errorUtil.errToObj(message)
      });
    }
    url(message) {
      return this._addCheck({
        kind: "url",
        ...errorUtil.errToObj(message)
      });
    }
    emoji(message) {
      return this._addCheck({
        kind: "emoji",
        ...errorUtil.errToObj(message)
      });
    }
    uuid(message) {
      return this._addCheck({
        kind: "uuid",
        ...errorUtil.errToObj(message)
      });
    }
    nanoid(message) {
      return this._addCheck({
        kind: "nanoid",
        ...errorUtil.errToObj(message)
      });
    }
    cuid(message) {
      return this._addCheck({
        kind: "cuid",
        ...errorUtil.errToObj(message)
      });
    }
    cuid2(message) {
      return this._addCheck({
        kind: "cuid2",
        ...errorUtil.errToObj(message)
      });
    }
    ulid(message) {
      return this._addCheck({
        kind: "ulid",
        ...errorUtil.errToObj(message)
      });
    }
    base64(message) {
      return this._addCheck({
        kind: "base64",
        ...errorUtil.errToObj(message)
      });
    }
    base64url(message) {
      return this._addCheck({
        kind: "base64url",
        ...errorUtil.errToObj(message)
      });
    }
    jwt(options) {
      return this._addCheck({
        kind: "jwt",
        ...errorUtil.errToObj(options)
      });
    }
    ip(options) {
      return this._addCheck({
        kind: "ip",
        ...errorUtil.errToObj(options)
      });
    }
    cidr(options) {
      return this._addCheck({
        kind: "cidr",
        ...errorUtil.errToObj(options)
      });
    }
    datetime(options) {
      if (typeof options === "string") {
        return this._addCheck({
          kind: "datetime",
          precision: null,
          offset: false,
          local: false,
          message: options
        });
      }
      return this._addCheck({
        kind: "datetime",
        precision: typeof (options == null ? void 0 : options.precision) === "undefined" ? null : options == null ? void 0 : options.precision,
        offset: (options == null ? void 0 : options.offset) ?? false,
        local: (options == null ? void 0 : options.local) ?? false,
        ...errorUtil.errToObj(options == null ? void 0 : options.message)
      });
    }
    date(message) {
      return this._addCheck({
        kind: "date",
        message: message
      });
    }
    time(options) {
      if (typeof options === "string") {
        return this._addCheck({
          kind: "time",
          precision: null,
          message: options
        });
      }
      return this._addCheck({
        kind: "time",
        precision: typeof (options == null ? void 0 : options.precision) === "undefined" ? null : options == null ? void 0 : options.precision,
        ...errorUtil.errToObj(options == null ? void 0 : options.message)
      });
    }
    duration(message) {
      return this._addCheck({
        kind: "duration",
        ...errorUtil.errToObj(message)
      });
    }
    regex(regex, message) {
      return this._addCheck({
        kind: "regex",
        regex: regex,
        ...errorUtil.errToObj(message)
      });
    }
    includes(value, options) {
      return this._addCheck({
        kind: "includes",
        value: value,
        position: options == null ? void 0 : options.position,
        ...errorUtil.errToObj(options == null ? void 0 : options.message)
      });
    }
    startsWith(value, message) {
      return this._addCheck({
        kind: "startsWith",
        value: value,
        ...errorUtil.errToObj(message)
      });
    }
    endsWith(value, message) {
      return this._addCheck({
        kind: "endsWith",
        value: value,
        ...errorUtil.errToObj(message)
      });
    }
    min(minLength, message) {
      return this._addCheck({
        kind: "min",
        value: minLength,
        ...errorUtil.errToObj(message)
      });
    }
    max(maxLength, message) {
      return this._addCheck({
        kind: "max",
        value: maxLength,
        ...errorUtil.errToObj(message)
      });
    }
    length(len, message) {
      return this._addCheck({
        kind: "length",
        value: len,
        ...errorUtil.errToObj(message)
      });
    }
    nonempty(message) {
      return this.min(1, errorUtil.errToObj(message));
    }
    trim() {
      return new ZodString({
        ...this._def,
        checks: [ ...this._def.checks, {
          kind: "trim"
        } ]
      });
    }
    toLowerCase() {
      return new ZodString({
        ...this._def,
        checks: [ ...this._def.checks, {
          kind: "toLowerCase"
        } ]
      });
    }
    toUpperCase() {
      return new ZodString({
        ...this._def,
        checks: [ ...this._def.checks, {
          kind: "toUpperCase"
        } ]
      });
    }
    get isDatetime() {
      return !!this._def.checks.find(ch => ch.kind === "datetime");
    }
    get isDate() {
      return !!this._def.checks.find(ch => ch.kind === "date");
    }
    get isTime() {
      return !!this._def.checks.find(ch => ch.kind === "time");
    }
    get isDuration() {
      return !!this._def.checks.find(ch => ch.kind === "duration");
    }
    get isEmail() {
      return !!this._def.checks.find(ch => ch.kind === "email");
    }
    get isURL() {
      return !!this._def.checks.find(ch => ch.kind === "url");
    }
    get isEmoji() {
      return !!this._def.checks.find(ch => ch.kind === "emoji");
    }
    get isUUID() {
      return !!this._def.checks.find(ch => ch.kind === "uuid");
    }
    get isNANOID() {
      return !!this._def.checks.find(ch => ch.kind === "nanoid");
    }
    get isCUID() {
      return !!this._def.checks.find(ch => ch.kind === "cuid");
    }
    get isCUID2() {
      return !!this._def.checks.find(ch => ch.kind === "cuid2");
    }
    get isULID() {
      return !!this._def.checks.find(ch => ch.kind === "ulid");
    }
    get isIP() {
      return !!this._def.checks.find(ch => ch.kind === "ip");
    }
    get isCIDR() {
      return !!this._def.checks.find(ch => ch.kind === "cidr");
    }
    get isBase64() {
      return !!this._def.checks.find(ch => ch.kind === "base64");
    }
    get isBase64url() {
      return !!this._def.checks.find(ch => ch.kind === "base64url");
    }
    get minLength() {
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "min") {
          if (min === null || ch.value > min) min = ch.value;
        }
      }
      return min;
    }
    get maxLength() {
      let max = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "max") {
          if (max === null || ch.value < max) max = ch.value;
        }
      }
      return max;
    }
  }

  ZodString.create = params => new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: (params == null ? void 0 : params.coerce) ?? false,
    ...processCreateParams(params)
  });

  function floatSafeRemainder(val, step) {
    const valDecCount = (val.toString().split(".")[1] || "").length;
    const stepDecCount = (step.toString().split(".")[1] || "").length;
    const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
    const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
    return valInt % stepInt / 10 ** decCount;
  }

  class ZodNumber extends ZodType {
    constructor() {
      super(...arguments);
      this.min = this.gte;
      this.max = this.lte;
      this.step = this.multipleOf;
    }
    _parse(input) {
      if (this._def.coerce) {
        input.data = Number(input.data);
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.number) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.number,
          received: ctx2.parsedType
        });
        return INVALID;
      }
      let ctx = void 0;
      const status = new ParseStatus;
      for (const check of this._def.checks) {
        if (check.kind === "int") {
          if (!util.isInteger(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_type,
              expected: "integer",
              received: "float",
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "min") {
          const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
          if (tooSmall) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "number",
              inclusive: check.inclusive,
              exact: false,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "max") {
          const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
          if (tooBig) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "number",
              inclusive: check.inclusive,
              exact: false,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "multipleOf") {
          if (floatSafeRemainder(input.data, check.value) !== 0) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.not_multiple_of,
              multipleOf: check.value,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "finite") {
          if (!Number.isFinite(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.not_finite,
              message: check.message
            });
            status.dirty();
          }
        } else {
          util.assertNever(check);
        }
      }
      return {
        status: status.value,
        value: input.data
      };
    }
    gte(value, message) {
      return this.setLimit("min", value, true, errorUtil.toString(message));
    }
    gt(value, message) {
      return this.setLimit("min", value, false, errorUtil.toString(message));
    }
    lte(value, message) {
      return this.setLimit("max", value, true, errorUtil.toString(message));
    }
    lt(value, message) {
      return this.setLimit("max", value, false, errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
      return new ZodNumber({
        ...this._def,
        checks: [ ...this._def.checks, {
          kind: kind,
          value: value,
          inclusive: inclusive,
          message: errorUtil.toString(message)
        } ]
      });
    }
    _addCheck(check) {
      return new ZodNumber({
        ...this._def,
        checks: [ ...this._def.checks, check ]
      });
    }
    int(message) {
      return this._addCheck({
        kind: "int",
        message: errorUtil.toString(message)
      });
    }
    positive(message) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
    negative(message) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
    nonpositive(message) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
    nonnegative(message) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
    multipleOf(value, message) {
      return this._addCheck({
        kind: "multipleOf",
        value: value,
        message: errorUtil.toString(message)
      });
    }
    finite(message) {
      return this._addCheck({
        kind: "finite",
        message: errorUtil.toString(message)
      });
    }
    safe(message) {
      return this._addCheck({
        kind: "min",
        inclusive: true,
        value: Number.MIN_SAFE_INTEGER,
        message: errorUtil.toString(message)
      })._addCheck({
        kind: "max",
        inclusive: true,
        value: Number.MAX_SAFE_INTEGER,
        message: errorUtil.toString(message)
      });
    }
    get minValue() {
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "min") {
          if (min === null || ch.value > min) min = ch.value;
        }
      }
      return min;
    }
    get maxValue() {
      let max = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "max") {
          if (max === null || ch.value < max) max = ch.value;
        }
      }
      return max;
    }
    get isInt() {
      return !!this._def.checks.find(ch => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
    }
    get isFinite() {
      let max = null;
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
          return true;
        } else if (ch.kind === "min") {
          if (min === null || ch.value > min) min = ch.value;
        } else if (ch.kind === "max") {
          if (max === null || ch.value < max) max = ch.value;
        }
      }
      return Number.isFinite(min) && Number.isFinite(max);
    }
  }

  ZodNumber.create = params => new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: (params == null ? void 0 : params.coerce) || false,
    ...processCreateParams(params)
  });

  class ZodBigInt extends ZodType {
    constructor() {
      super(...arguments);
      this.min = this.gte;
      this.max = this.lte;
    }
    _parse(input) {
      if (this._def.coerce) {
        try {
          input.data = BigInt(input.data);
        } catch {
          return this._getInvalidInput(input);
        }
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.bigint) {
        return this._getInvalidInput(input);
      }
      let ctx = void 0;
      const status = new ParseStatus;
      for (const check of this._def.checks) {
        if (check.kind === "min") {
          const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
          if (tooSmall) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              type: "bigint",
              minimum: check.value,
              inclusive: check.inclusive,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "max") {
          const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
          if (tooBig) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              type: "bigint",
              maximum: check.value,
              inclusive: check.inclusive,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "multipleOf") {
          if (input.data % check.value !== BigInt(0)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.not_multiple_of,
              multipleOf: check.value,
              message: check.message
            });
            status.dirty();
          }
        } else {
          util.assertNever(check);
        }
      }
      return {
        status: status.value,
        value: input.data
      };
    }
    _getInvalidInput(input) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.bigint,
        received: ctx.parsedType
      });
      return INVALID;
    }
    gte(value, message) {
      return this.setLimit("min", value, true, errorUtil.toString(message));
    }
    gt(value, message) {
      return this.setLimit("min", value, false, errorUtil.toString(message));
    }
    lte(value, message) {
      return this.setLimit("max", value, true, errorUtil.toString(message));
    }
    lt(value, message) {
      return this.setLimit("max", value, false, errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
      return new ZodBigInt({
        ...this._def,
        checks: [ ...this._def.checks, {
          kind: kind,
          value: value,
          inclusive: inclusive,
          message: errorUtil.toString(message)
        } ]
      });
    }
    _addCheck(check) {
      return new ZodBigInt({
        ...this._def,
        checks: [ ...this._def.checks, check ]
      });
    }
    positive(message) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
    negative(message) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
    nonpositive(message) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
    nonnegative(message) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
    multipleOf(value, message) {
      return this._addCheck({
        kind: "multipleOf",
        value: value,
        message: errorUtil.toString(message)
      });
    }
    get minValue() {
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "min") {
          if (min === null || ch.value > min) min = ch.value;
        }
      }
      return min;
    }
    get maxValue() {
      let max = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "max") {
          if (max === null || ch.value < max) max = ch.value;
        }
      }
      return max;
    }
  }

  ZodBigInt.create = params => new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: (params == null ? void 0 : params.coerce) ?? false,
    ...processCreateParams(params)
  });

  class ZodBoolean extends ZodType {
    _parse(input) {
      if (this._def.coerce) {
        input.data = Boolean(input.data);
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.boolean) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.boolean,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }

  ZodBoolean.create = params => new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: (params == null ? void 0 : params.coerce) || false,
    ...processCreateParams(params)
  });

  class ZodDate extends ZodType {
    _parse(input) {
      if (this._def.coerce) {
        input.data = new Date(input.data);
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.date) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.date,
          received: ctx2.parsedType
        });
        return INVALID;
      }
      if (Number.isNaN(input.data.getTime())) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_date
        });
        return INVALID;
      }
      const status = new ParseStatus;
      let ctx = void 0;
      for (const check of this._def.checks) {
        if (check.kind === "min") {
          if (input.data.getTime() < check.value) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              message: check.message,
              inclusive: true,
              exact: false,
              minimum: check.value,
              type: "date"
            });
            status.dirty();
          }
        } else if (check.kind === "max") {
          if (input.data.getTime() > check.value) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              message: check.message,
              inclusive: true,
              exact: false,
              maximum: check.value,
              type: "date"
            });
            status.dirty();
          }
        } else {
          util.assertNever(check);
        }
      }
      return {
        status: status.value,
        value: new Date(input.data.getTime())
      };
    }
    _addCheck(check) {
      return new ZodDate({
        ...this._def,
        checks: [ ...this._def.checks, check ]
      });
    }
    min(minDate, message) {
      return this._addCheck({
        kind: "min",
        value: minDate.getTime(),
        message: errorUtil.toString(message)
      });
    }
    max(maxDate, message) {
      return this._addCheck({
        kind: "max",
        value: maxDate.getTime(),
        message: errorUtil.toString(message)
      });
    }
    get minDate() {
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "min") {
          if (min === null || ch.value > min) min = ch.value;
        }
      }
      return min != null ? new Date(min) : null;
    }
    get maxDate() {
      let max = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "max") {
          if (max === null || ch.value < max) max = ch.value;
        }
      }
      return max != null ? new Date(max) : null;
    }
  }

  ZodDate.create = params => new ZodDate({
    checks: [],
    coerce: (params == null ? void 0 : params.coerce) || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });

  class ZodSymbol extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.symbol) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.symbol,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }

  ZodSymbol.create = params => new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });

  class ZodUndefined extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.undefined) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.undefined,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }

  ZodUndefined.create = params => new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });

  class ZodNull extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.null) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.null,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }

  ZodNull.create = params => new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });

  class ZodAny extends ZodType {
    constructor() {
      super(...arguments);
      this._any = true;
    }
    _parse(input) {
      return OK(input.data);
    }
  }

  ZodAny.create = params => new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });

  class ZodUnknown extends ZodType {
    constructor() {
      super(...arguments);
      this._unknown = true;
    }
    _parse(input) {
      return OK(input.data);
    }
  }

  ZodUnknown.create = params => new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });

  class ZodNever extends ZodType {
    _parse(input) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.never,
        received: ctx.parsedType
      });
      return INVALID;
    }
  }

  ZodNever.create = params => new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });

  class ZodVoid extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.undefined) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.void,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }

  ZodVoid.create = params => new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });

  class ZodArray extends ZodType {
    _parse(input) {
      const {ctx: ctx, status: status} = this._processInputParams(input);
      const def = this._def;
      if (ctx.parsedType !== ZodParsedType.array) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.array,
          received: ctx.parsedType
        });
        return INVALID;
      }
      if (def.exactLength !== null) {
        const tooBig = ctx.data.length > def.exactLength.value;
        const tooSmall = ctx.data.length < def.exactLength.value;
        if (tooBig || tooSmall) {
          addIssueToContext(ctx, {
            code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
            minimum: tooSmall ? def.exactLength.value : void 0,
            maximum: tooBig ? def.exactLength.value : void 0,
            type: "array",
            inclusive: true,
            exact: true,
            message: def.exactLength.message
          });
          status.dirty();
        }
      }
      if (def.minLength !== null) {
        if (ctx.data.length < def.minLength.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: def.minLength.value,
            type: "array",
            inclusive: true,
            exact: false,
            message: def.minLength.message
          });
          status.dirty();
        }
      }
      if (def.maxLength !== null) {
        if (ctx.data.length > def.maxLength.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: def.maxLength.value,
            type: "array",
            inclusive: true,
            exact: false,
            message: def.maxLength.message
          });
          status.dirty();
        }
      }
      if (ctx.common.async) {
        return Promise.all([ ...ctx.data ].map((item, i) => def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i)))).then(result2 => ParseStatus.mergeArray(status, result2));
      }
      const result = [ ...ctx.data ].map((item, i) => def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i)));
      return ParseStatus.mergeArray(status, result);
    }
    get element() {
      return this._def.type;
    }
    min(minLength, message) {
      return new ZodArray({
        ...this._def,
        minLength: {
          value: minLength,
          message: errorUtil.toString(message)
        }
      });
    }
    max(maxLength, message) {
      return new ZodArray({
        ...this._def,
        maxLength: {
          value: maxLength,
          message: errorUtil.toString(message)
        }
      });
    }
    length(len, message) {
      return new ZodArray({
        ...this._def,
        exactLength: {
          value: len,
          message: errorUtil.toString(message)
        }
      });
    }
    nonempty(message) {
      return this.min(1, message);
    }
  }

  ZodArray.create = (schema, params) => new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });

  function deepPartialify(schema) {
    if (schema instanceof ZodObject) {
      const newShape = {};
      for (const key in schema.shape) {
        const fieldSchema = schema.shape[key];
        newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
      }
      return new ZodObject({
        ...schema._def,
        shape: () => newShape
      });
    } else if (schema instanceof ZodArray) {
      return new ZodArray({
        ...schema._def,
        type: deepPartialify(schema.element)
      });
    } else if (schema instanceof ZodOptional) {
      return ZodOptional.create(deepPartialify(schema.unwrap()));
    } else if (schema instanceof ZodNullable) {
      return ZodNullable.create(deepPartialify(schema.unwrap()));
    } else if (schema instanceof ZodTuple) {
      return ZodTuple.create(schema.items.map(item => deepPartialify(item)));
    } else {
      return schema;
    }
  }

  class ZodObject extends ZodType {
    constructor() {
      super(...arguments);
      this._cached = null;
      this.nonstrict = this.passthrough;
      this.augment = this.extend;
    }
    _getCached() {
      if (this._cached !== null) return this._cached;
      const shape = this._def.shape();
      const keys = util.objectKeys(shape);
      this._cached = {
        shape: shape,
        keys: keys
      };
      return this._cached;
    }
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.object) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.object,
          received: ctx2.parsedType
        });
        return INVALID;
      }
      const {status: status, ctx: ctx} = this._processInputParams(input);
      const {shape: shape, keys: shapeKeys} = this._getCached();
      const extraKeys = [];
      if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
        for (const key in ctx.data) {
          if (!shapeKeys.includes(key)) {
            extraKeys.push(key);
          }
        }
      }
      const pairs = [];
      for (const key of shapeKeys) {
        const keyValidator = shape[key];
        const value = ctx.data[key];
        pairs.push({
          key: {
            status: "valid",
            value: key
          },
          value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
          alwaysSet: key in ctx.data
        });
      }
      if (this._def.catchall instanceof ZodNever) {
        const unknownKeys = this._def.unknownKeys;
        if (unknownKeys === "passthrough") {
          for (const key of extraKeys) {
            pairs.push({
              key: {
                status: "valid",
                value: key
              },
              value: {
                status: "valid",
                value: ctx.data[key]
              }
            });
          }
        } else if (unknownKeys === "strict") {
          if (extraKeys.length > 0) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.unrecognized_keys,
              keys: extraKeys
            });
            status.dirty();
          }
        } else if (unknownKeys === "strip") ; else {
          throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
        }
      } else {
        const catchall = this._def.catchall;
        for (const key of extraKeys) {
          const value = ctx.data[key];
          pairs.push({
            key: {
              status: "valid",
              value: key
            },
            value: catchall._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
            alwaysSet: key in ctx.data
          });
        }
      }
      if (ctx.common.async) {
        return Promise.resolve().then(async () => {
          const syncPairs = [];
          for (const pair of pairs) {
            const key = await pair.key;
            const value = await pair.value;
            syncPairs.push({
              key: key,
              value: value,
              alwaysSet: pair.alwaysSet
            });
          }
          return syncPairs;
        }).then(syncPairs => ParseStatus.mergeObjectSync(status, syncPairs));
      } else {
        return ParseStatus.mergeObjectSync(status, pairs);
      }
    }
    get shape() {
      return this._def.shape();
    }
    strict(message) {
      errorUtil.errToObj;
      return new ZodObject({
        ...this._def,
        unknownKeys: "strict",
        ...message !== void 0 ? {
          errorMap: (issue, ctx) => {
            var _a2, _b;
            const defaultError = ((_b = (_a2 = this._def).errorMap) == null ? void 0 : _b.call(_a2, issue, ctx).message) ?? ctx.defaultError;
            if (issue.code === "unrecognized_keys") return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
            return {
              message: defaultError
            };
          }
        } : {}
      });
    }
    strip() {
      return new ZodObject({
        ...this._def,
        unknownKeys: "strip"
      });
    }
    passthrough() {
      return new ZodObject({
        ...this._def,
        unknownKeys: "passthrough"
      });
    }
    extend(augmentation) {
      return new ZodObject({
        ...this._def,
        shape: () => ({
          ...this._def.shape(),
          ...augmentation
        })
      });
    }
    merge(merging) {
      const merged = new ZodObject({
        unknownKeys: merging._def.unknownKeys,
        catchall: merging._def.catchall,
        shape: () => ({
          ...this._def.shape(),
          ...merging._def.shape()
        }),
        typeName: ZodFirstPartyTypeKind.ZodObject
      });
      return merged;
    }
    setKey(key, schema) {
      return this.augment({
        [key]: schema
      });
    }
    catchall(index) {
      return new ZodObject({
        ...this._def,
        catchall: index
      });
    }
    pick(mask) {
      const shape = {};
      for (const key of util.objectKeys(mask)) {
        if (mask[key] && this.shape[key]) {
          shape[key] = this.shape[key];
        }
      }
      return new ZodObject({
        ...this._def,
        shape: () => shape
      });
    }
    omit(mask) {
      const shape = {};
      for (const key of util.objectKeys(this.shape)) {
        if (!mask[key]) {
          shape[key] = this.shape[key];
        }
      }
      return new ZodObject({
        ...this._def,
        shape: () => shape
      });
    }
    deepPartial() {
      return deepPartialify(this);
    }
    partial(mask) {
      const newShape = {};
      for (const key of util.objectKeys(this.shape)) {
        const fieldSchema = this.shape[key];
        if (mask && !mask[key]) {
          newShape[key] = fieldSchema;
        } else {
          newShape[key] = fieldSchema.optional();
        }
      }
      return new ZodObject({
        ...this._def,
        shape: () => newShape
      });
    }
    required(mask) {
      const newShape = {};
      for (const key of util.objectKeys(this.shape)) {
        if (mask && !mask[key]) {
          newShape[key] = this.shape[key];
        } else {
          const fieldSchema = this.shape[key];
          let newField = fieldSchema;
          while (newField instanceof ZodOptional) {
            newField = newField._def.innerType;
          }
          newShape[key] = newField;
        }
      }
      return new ZodObject({
        ...this._def,
        shape: () => newShape
      });
    }
    keyof() {
      return createZodEnum(util.objectKeys(this.shape));
    }
  }

  ZodObject.create = (shape, params) => new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });

  ZodObject.strictCreate = (shape, params) => new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });

  ZodObject.lazycreate = (shape, params) => new ZodObject({
    shape: shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });

  class ZodUnion extends ZodType {
    _parse(input) {
      const {ctx: ctx} = this._processInputParams(input);
      const options = this._def.options;
      function handleResults(results) {
        for (const result of results) {
          if (result.result.status === "valid") {
            return result.result;
          }
        }
        for (const result of results) {
          if (result.result.status === "dirty") {
            ctx.common.issues.push(...result.ctx.common.issues);
            return result.result;
          }
        }
        const unionErrors = results.map(result => new ZodError(result.ctx.common.issues));
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_union,
          unionErrors: unionErrors
        });
        return INVALID;
      }
      if (ctx.common.async) {
        return Promise.all(options.map(async option => {
          const childCtx = {
            ...ctx,
            common: {
              ...ctx.common,
              issues: []
            },
            parent: null
          };
          return {
            result: await option._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: childCtx
            }),
            ctx: childCtx
          };
        })).then(handleResults);
      } else {
        let dirty = void 0;
        const issues = [];
        for (const option of options) {
          const childCtx = {
            ...ctx,
            common: {
              ...ctx.common,
              issues: []
            },
            parent: null
          };
          const result = option._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          });
          if (result.status === "valid") {
            return result;
          } else if (result.status === "dirty" && !dirty) {
            dirty = {
              result: result,
              ctx: childCtx
            };
          }
          if (childCtx.common.issues.length) {
            issues.push(childCtx.common.issues);
          }
        }
        if (dirty) {
          ctx.common.issues.push(...dirty.ctx.common.issues);
          return dirty.result;
        }
        const unionErrors = issues.map(issues2 => new ZodError(issues2));
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_union,
          unionErrors: unionErrors
        });
        return INVALID;
      }
    }
    get options() {
      return this._def.options;
    }
  }

  ZodUnion.create = (types, params) => new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });

  const getDiscriminator = type => {
    if (type instanceof ZodLazy) {
      return getDiscriminator(type.schema);
    } else if (type instanceof ZodEffects) {
      return getDiscriminator(type.innerType());
    } else if (type instanceof ZodLiteral) {
      return [ type.value ];
    } else if (type instanceof ZodEnum) {
      return type.options;
    } else if (type instanceof ZodNativeEnum) {
      return util.objectValues(type.enum);
    } else if (type instanceof ZodDefault) {
      return getDiscriminator(type._def.innerType);
    } else if (type instanceof ZodUndefined) {
      return [ void 0 ];
    } else if (type instanceof ZodNull) {
      return [ null ];
    } else if (type instanceof ZodOptional) {
      return [ void 0, ...getDiscriminator(type.unwrap()) ];
    } else if (type instanceof ZodNullable) {
      return [ null, ...getDiscriminator(type.unwrap()) ];
    } else if (type instanceof ZodBranded) {
      return getDiscriminator(type.unwrap());
    } else if (type instanceof ZodReadonly) {
      return getDiscriminator(type.unwrap());
    } else if (type instanceof ZodCatch) {
      return getDiscriminator(type._def.innerType);
    } else {
      return [];
    }
  };

  class ZodDiscriminatedUnion extends ZodType {
    _parse(input) {
      const {ctx: ctx} = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.object) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.object,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const discriminator = this.discriminator;
      const discriminatorValue = ctx.data[discriminator];
      const option = this.optionsMap.get(discriminatorValue);
      if (!option) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_union_discriminator,
          options: Array.from(this.optionsMap.keys()),
          path: [ discriminator ]
        });
        return INVALID;
      }
      if (ctx.common.async) {
        return option._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
      } else {
        return option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
      }
    }
    get discriminator() {
      return this._def.discriminator;
    }
    get options() {
      return this._def.options;
    }
    get optionsMap() {
      return this._def.optionsMap;
    }
    static create(discriminator, options, params) {
      const optionsMap = new Map;
      for (const type of options) {
        const discriminatorValues = getDiscriminator(type.shape[discriminator]);
        if (!discriminatorValues.length) {
          throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
        }
        for (const value of discriminatorValues) {
          if (optionsMap.has(value)) {
            throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
          }
          optionsMap.set(value, type);
        }
      }
      return new ZodDiscriminatedUnion({
        typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
        discriminator: discriminator,
        options: options,
        optionsMap: optionsMap,
        ...processCreateParams(params)
      });
    }
  }

  function mergeValues(a, b) {
    const aType = getParsedType(a);
    const bType = getParsedType(b);
    if (a === b) {
      return {
        valid: true,
        data: a
      };
    } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
      const bKeys = util.objectKeys(b);
      const sharedKeys = util.objectKeys(a).filter(key => bKeys.indexOf(key) !== -1);
      const newObj = {
        ...a,
        ...b
      };
      for (const key of sharedKeys) {
        const sharedValue = mergeValues(a[key], b[key]);
        if (!sharedValue.valid) {
          return {
            valid: false
          };
        }
        newObj[key] = sharedValue.data;
      }
      return {
        valid: true,
        data: newObj
      };
    } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
      if (a.length !== b.length) {
        return {
          valid: false
        };
      }
      const newArray = [];
      for (let index = 0; index < a.length; index++) {
        const itemA = a[index];
        const itemB = b[index];
        const sharedValue = mergeValues(itemA, itemB);
        if (!sharedValue.valid) {
          return {
            valid: false
          };
        }
        newArray.push(sharedValue.data);
      }
      return {
        valid: true,
        data: newArray
      };
    } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
      return {
        valid: true,
        data: a
      };
    } else {
      return {
        valid: false
      };
    }
  }

  class ZodIntersection extends ZodType {
    _parse(input) {
      const {status: status, ctx: ctx} = this._processInputParams(input);
      const handleParsed = (parsedLeft, parsedRight) => {
        if (isAborted(parsedLeft) || isAborted(parsedRight)) {
          return INVALID;
        }
        const merged = mergeValues(parsedLeft.value, parsedRight.value);
        if (!merged.valid) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_intersection_types
          });
          return INVALID;
        }
        if (isDirty(parsedLeft) || isDirty(parsedRight)) {
          status.dirty();
        }
        return {
          status: status.value,
          value: merged.data
        };
      };
      if (ctx.common.async) {
        return Promise.all([ this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }), this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }) ]).then(([left, right]) => handleParsed(left, right));
      } else {
        return handleParsed(this._def.left._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }), this._def.right._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }));
      }
    }
  }

  ZodIntersection.create = (left, right, params) => new ZodIntersection({
    left: left,
    right: right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });

  class ZodTuple extends ZodType {
    _parse(input) {
      const {status: status, ctx: ctx} = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.array) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.array,
          received: ctx.parsedType
        });
        return INVALID;
      }
      if (ctx.data.length < this._def.items.length) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: this._def.items.length,
          inclusive: true,
          exact: false,
          type: "array"
        });
        return INVALID;
      }
      const rest = this._def.rest;
      if (!rest && ctx.data.length > this._def.items.length) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: this._def.items.length,
          inclusive: true,
          exact: false,
          type: "array"
        });
        status.dirty();
      }
      const items = [ ...ctx.data ].map((item, itemIndex) => {
        const schema = this._def.items[itemIndex] || this._def.rest;
        if (!schema) return null;
        return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
      }).filter(x => !!x);
      if (ctx.common.async) {
        return Promise.all(items).then(results => ParseStatus.mergeArray(status, results));
      } else {
        return ParseStatus.mergeArray(status, items);
      }
    }
    get items() {
      return this._def.items;
    }
    rest(rest) {
      return new ZodTuple({
        ...this._def,
        rest: rest
      });
    }
  }

  ZodTuple.create = (schemas, params) => {
    if (!Array.isArray(schemas)) {
      throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
    }
    return new ZodTuple({
      items: schemas,
      typeName: ZodFirstPartyTypeKind.ZodTuple,
      rest: null,
      ...processCreateParams(params)
    });
  };

  class ZodRecord extends ZodType {
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(input) {
      const {status: status, ctx: ctx} = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.object) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.object,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const pairs = [];
      const keyType = this._def.keyType;
      const valueType = this._def.valueType;
      for (const key in ctx.data) {
        pairs.push({
          key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
          value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
          alwaysSet: key in ctx.data
        });
      }
      if (ctx.common.async) {
        return ParseStatus.mergeObjectAsync(status, pairs);
      } else {
        return ParseStatus.mergeObjectSync(status, pairs);
      }
    }
    get element() {
      return this._def.valueType;
    }
    static create(first, second, third) {
      if (second instanceof ZodType) {
        return new ZodRecord({
          keyType: first,
          valueType: second,
          typeName: ZodFirstPartyTypeKind.ZodRecord,
          ...processCreateParams(third)
        });
      }
      return new ZodRecord({
        keyType: ZodString.create(),
        valueType: first,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(second)
      });
    }
  }

  class ZodMap extends ZodType {
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(input) {
      const {status: status, ctx: ctx} = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.map) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.map,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const keyType = this._def.keyType;
      const valueType = this._def.valueType;
      const pairs = [ ...ctx.data.entries() ].map(([key, value], index) => ({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [ index, "key" ])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [ index, "value" ]))
      }));
      if (ctx.common.async) {
        const finalMap = new Map;
        return Promise.resolve().then(async () => {
          for (const pair of pairs) {
            const key = await pair.key;
            const value = await pair.value;
            if (key.status === "aborted" || value.status === "aborted") {
              return INVALID;
            }
            if (key.status === "dirty" || value.status === "dirty") {
              status.dirty();
            }
            finalMap.set(key.value, value.value);
          }
          return {
            status: status.value,
            value: finalMap
          };
        });
      } else {
        const finalMap = new Map;
        for (const pair of pairs) {
          const key = pair.key;
          const value = pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return {
          status: status.value,
          value: finalMap
        };
      }
    }
  }

  ZodMap.create = (keyType, valueType, params) => new ZodMap({
    valueType: valueType,
    keyType: keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });

  class ZodSet extends ZodType {
    _parse(input) {
      const {status: status, ctx: ctx} = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.set) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.set,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const def = this._def;
      if (def.minSize !== null) {
        if (ctx.data.size < def.minSize.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: def.minSize.value,
            type: "set",
            inclusive: true,
            exact: false,
            message: def.minSize.message
          });
          status.dirty();
        }
      }
      if (def.maxSize !== null) {
        if (ctx.data.size > def.maxSize.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: def.maxSize.value,
            type: "set",
            inclusive: true,
            exact: false,
            message: def.maxSize.message
          });
          status.dirty();
        }
      }
      const valueType = this._def.valueType;
      function finalizeSet(elements2) {
        const parsedSet = new Set;
        for (const element of elements2) {
          if (element.status === "aborted") return INVALID;
          if (element.status === "dirty") status.dirty();
          parsedSet.add(element.value);
        }
        return {
          status: status.value,
          value: parsedSet
        };
      }
      const elements = [ ...ctx.data.values() ].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
      if (ctx.common.async) {
        return Promise.all(elements).then(elements2 => finalizeSet(elements2));
      } else {
        return finalizeSet(elements);
      }
    }
    min(minSize, message) {
      return new ZodSet({
        ...this._def,
        minSize: {
          value: minSize,
          message: errorUtil.toString(message)
        }
      });
    }
    max(maxSize, message) {
      return new ZodSet({
        ...this._def,
        maxSize: {
          value: maxSize,
          message: errorUtil.toString(message)
        }
      });
    }
    size(size, message) {
      return this.min(size, message).max(size, message);
    }
    nonempty(message) {
      return this.min(1, message);
    }
  }

  ZodSet.create = (valueType, params) => new ZodSet({
    valueType: valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });

  class ZodLazy extends ZodType {
    get schema() {
      return this._def.getter();
    }
    _parse(input) {
      const {ctx: ctx} = this._processInputParams(input);
      const lazySchema = this._def.getter();
      return lazySchema._parse({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }

  ZodLazy.create = (getter, params) => new ZodLazy({
    getter: getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });

  class ZodLiteral extends ZodType {
    _parse(input) {
      if (input.data !== this._def.value) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          received: ctx.data,
          code: ZodIssueCode.invalid_literal,
          expected: this._def.value
        });
        return INVALID;
      }
      return {
        status: "valid",
        value: input.data
      };
    }
    get value() {
      return this._def.value;
    }
  }

  ZodLiteral.create = (value, params) => new ZodLiteral({
    value: value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });

  function createZodEnum(values, params) {
    return new ZodEnum({
      values: values,
      typeName: ZodFirstPartyTypeKind.ZodEnum,
      ...processCreateParams(params)
    });
  }

  class ZodEnum extends ZodType {
    _parse(input) {
      if (typeof input.data !== "string") {
        const ctx = this._getOrReturnCtx(input);
        const expectedValues = this._def.values;
        addIssueToContext(ctx, {
          expected: util.joinValues(expectedValues),
          received: ctx.parsedType,
          code: ZodIssueCode.invalid_type
        });
        return INVALID;
      }
      if (!this._cache) {
        this._cache = new Set(this._def.values);
      }
      if (!this._cache.has(input.data)) {
        const ctx = this._getOrReturnCtx(input);
        const expectedValues = this._def.values;
        addIssueToContext(ctx, {
          received: ctx.data,
          code: ZodIssueCode.invalid_enum_value,
          options: expectedValues
        });
        return INVALID;
      }
      return OK(input.data);
    }
    get options() {
      return this._def.values;
    }
    get enum() {
      const enumValues = {};
      for (const val of this._def.values) {
        enumValues[val] = val;
      }
      return enumValues;
    }
    get Values() {
      const enumValues = {};
      for (const val of this._def.values) {
        enumValues[val] = val;
      }
      return enumValues;
    }
    get Enum() {
      const enumValues = {};
      for (const val of this._def.values) {
        enumValues[val] = val;
      }
      return enumValues;
    }
    extract(values, newDef = this._def) {
      return ZodEnum.create(values, {
        ...this._def,
        ...newDef
      });
    }
    exclude(values, newDef = this._def) {
      return ZodEnum.create(this.options.filter(opt => !values.includes(opt)), {
        ...this._def,
        ...newDef
      });
    }
  }

  ZodEnum.create = createZodEnum;

  class ZodNativeEnum extends ZodType {
    _parse(input) {
      const nativeEnumValues = util.getValidEnumValues(this._def.values);
      const ctx = this._getOrReturnCtx(input);
      if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
        const expectedValues = util.objectValues(nativeEnumValues);
        addIssueToContext(ctx, {
          expected: util.joinValues(expectedValues),
          received: ctx.parsedType,
          code: ZodIssueCode.invalid_type
        });
        return INVALID;
      }
      if (!this._cache) {
        this._cache = new Set(util.getValidEnumValues(this._def.values));
      }
      if (!this._cache.has(input.data)) {
        const expectedValues = util.objectValues(nativeEnumValues);
        addIssueToContext(ctx, {
          received: ctx.data,
          code: ZodIssueCode.invalid_enum_value,
          options: expectedValues
        });
        return INVALID;
      }
      return OK(input.data);
    }
    get enum() {
      return this._def.values;
    }
  }

  ZodNativeEnum.create = (values, params) => new ZodNativeEnum({
    values: values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });

  class ZodPromise extends ZodType {
    unwrap() {
      return this._def.type;
    }
    _parse(input) {
      const {ctx: ctx} = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.promise,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
      return OK(promisified.then(data => this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      })));
    }
  }

  ZodPromise.create = (schema, params) => new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });

  class ZodEffects extends ZodType {
    innerType() {
      return this._def.schema;
    }
    sourceType() {
      return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
    }
    _parse(input) {
      const {status: status, ctx: ctx} = this._processInputParams(input);
      const effect = this._def.effect || null;
      const checkCtx = {
        addIssue: arg => {
          addIssueToContext(ctx, arg);
          if (arg.fatal) {
            status.abort();
          } else {
            status.dirty();
          }
        },
        get path() {
          return ctx.path;
        }
      };
      checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
      if (effect.type === "preprocess") {
        const processed = effect.transform(ctx.data, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(processed).then(async processed2 => {
            if (status.value === "aborted") return INVALID;
            const result = await this._def.schema._parseAsync({
              data: processed2,
              path: ctx.path,
              parent: ctx
            });
            if (result.status === "aborted") return INVALID;
            if (result.status === "dirty") return DIRTY(result.value);
            if (status.value === "dirty") return DIRTY(result.value);
            return result;
          });
        } else {
          if (status.value === "aborted") return INVALID;
          const result = this._def.schema._parseSync({
            data: processed,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted") return INVALID;
          if (result.status === "dirty") return DIRTY(result.value);
          if (status.value === "dirty") return DIRTY(result.value);
          return result;
        }
      }
      if (effect.type === "refinement") {
        const executeRefinement = acc => {
          const result = effect.refinement(acc, checkCtx);
          if (ctx.common.async) {
            return Promise.resolve(result);
          }
          if (result instanceof Promise) {
            throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
          }
          return acc;
        };
        if (ctx.common.async === false) {
          const inner = this._def.schema._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (inner.status === "aborted") return INVALID;
          if (inner.status === "dirty") status.dirty();
          executeRefinement(inner.value);
          return {
            status: status.value,
            value: inner.value
          };
        } else {
          return this._def.schema._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }).then(inner => {
            if (inner.status === "aborted") return INVALID;
            if (inner.status === "dirty") status.dirty();
            return executeRefinement(inner.value).then(() => ({
              status: status.value,
              value: inner.value
            }));
          });
        }
      }
      if (effect.type === "transform") {
        if (ctx.common.async === false) {
          const base = this._def.schema._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (!isValid(base)) return INVALID;
          const result = effect.transform(base.value, checkCtx);
          if (result instanceof Promise) {
            throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
          }
          return {
            status: status.value,
            value: result
          };
        } else {
          return this._def.schema._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }).then(base => {
            if (!isValid(base)) return INVALID;
            return Promise.resolve(effect.transform(base.value, checkCtx)).then(result => ({
              status: status.value,
              value: result
            }));
          });
        }
      }
      util.assertNever(effect);
    }
  }

  ZodEffects.create = (schema, effect, params) => new ZodEffects({
    schema: schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect: effect,
    ...processCreateParams(params)
  });

  ZodEffects.createWithPreprocess = (preprocess, schema, params) => new ZodEffects({
    schema: schema,
    effect: {
      type: "preprocess",
      transform: preprocess
    },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });

  class ZodOptional extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType === ZodParsedType.undefined) {
        return OK(void 0);
      }
      return this._def.innerType._parse(input);
    }
    unwrap() {
      return this._def.innerType;
    }
  }

  ZodOptional.create = (type, params) => new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });

  class ZodNullable extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType === ZodParsedType.null) {
        return OK(null);
      }
      return this._def.innerType._parse(input);
    }
    unwrap() {
      return this._def.innerType;
    }
  }

  ZodNullable.create = (type, params) => new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });

  class ZodDefault extends ZodType {
    _parse(input) {
      const {ctx: ctx} = this._processInputParams(input);
      let data = ctx.data;
      if (ctx.parsedType === ZodParsedType.undefined) {
        data = this._def.defaultValue();
      }
      return this._def.innerType._parse({
        data: data,
        path: ctx.path,
        parent: ctx
      });
    }
    removeDefault() {
      return this._def.innerType;
    }
  }

  ZodDefault.create = (type, params) => new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });

  class ZodCatch extends ZodType {
    _parse(input) {
      const {ctx: ctx} = this._processInputParams(input);
      const newCtx = {
        ...ctx,
        common: {
          ...ctx.common,
          issues: []
        }
      };
      const result = this._def.innerType._parse({
        data: newCtx.data,
        path: newCtx.path,
        parent: {
          ...newCtx
        }
      });
      if (isAsync(result)) {
        return result.then(result2 => ({
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        }));
      } else {
        return {
          status: "valid",
          value: result.status === "valid" ? result.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      }
    }
    removeCatch() {
      return this._def.innerType;
    }
  }

  ZodCatch.create = (type, params) => new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });

  class ZodNaN extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.nan) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.nan,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return {
        status: "valid",
        value: input.data
      };
    }
  }

  ZodNaN.create = params => new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });

  class ZodBranded extends ZodType {
    _parse(input) {
      const {ctx: ctx} = this._processInputParams(input);
      const data = ctx.data;
      return this._def.type._parse({
        data: data,
        path: ctx.path,
        parent: ctx
      });
    }
    unwrap() {
      return this._def.type;
    }
  }

  class ZodPipeline extends ZodType {
    _parse(input) {
      const {status: status, ctx: ctx} = this._processInputParams(input);
      if (ctx.common.async) {
        const handleAsync = async () => {
          const inResult = await this._def.in._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (inResult.status === "aborted") return INVALID;
          if (inResult.status === "dirty") {
            status.dirty();
            return DIRTY(inResult.value);
          } else {
            return this._def.out._parseAsync({
              data: inResult.value,
              path: ctx.path,
              parent: ctx
            });
          }
        };
        return handleAsync();
      } else {
        const inResult = this._def.in._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted") return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return {
            status: "dirty",
            value: inResult.value
          };
        } else {
          return this._def.out._parseSync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      }
    }
    static create(a, b) {
      return new ZodPipeline({
        in: a,
        out: b,
        typeName: ZodFirstPartyTypeKind.ZodPipeline
      });
    }
  }

  class ZodReadonly extends ZodType {
    _parse(input) {
      const result = this._def.innerType._parse(input);
      const freeze = data => {
        if (isValid(data)) {
          data.value = Object.freeze(data.value);
        }
        return data;
      };
      return isAsync(result) ? result.then(data => freeze(data)) : freeze(result);
    }
    unwrap() {
      return this._def.innerType;
    }
  }

  ZodReadonly.create = (type, params) => new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });

  var ZodFirstPartyTypeKind;

  (function(ZodFirstPartyTypeKind2) {
    ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
    ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
    ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
    ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
    ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
    ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
    ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
    ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
    ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
    ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
    ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
    ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
    ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
    ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
    ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
    ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
    ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
    ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
    ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
    ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
    ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
    ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
    ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
    ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
    ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
    ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
    ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
    ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
    ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
    ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
    ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
    ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
    ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
    ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
    ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
    ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
  })(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));

  const stringType = ZodString.create;

  const numberType = ZodNumber.create;

  const booleanType = ZodBoolean.create;

  const nullType = ZodNull.create;

  ZodNever.create;

  const arrayType = ZodArray.create;

  const objectType = ZodObject.create;

  const unionType = ZodUnion.create;

  const discriminatedUnionType = ZodDiscriminatedUnion.create;

  ZodIntersection.create;

  ZodTuple.create;

  const recordType = ZodRecord.create;

  const lazyType = ZodLazy.create;

  const literalType = ZodLiteral.create;

  const enumType = ZodEnum.create;

  const nativeEnumType = ZodNativeEnum.create;

  ZodPromise.create;

  ZodOptional.create;

  ZodNullable.create;

  const lazyOnce = getter => {
    let cached;
    return lazyType(() => {
      cached ?? (cached = getter());
      return cached;
    });
  };

  const QUESTION_TREE_LIMITS = {
    maxRootBytes: 512 * 1024,
    maxDepth: 12,
    maxNodes: 512,
    maxCollectionSize: 256,
    maxContentBytes: 64 * 1024
  };

  const utf8Length$4 = value => (new TextEncoder).encode(value).length;

  const ContentSchema = stringType().refine(value => utf8Length$4(value) <= QUESTION_TREE_LIMITS.maxContentBytes, "question content exceeds byte limit");

  const NonEmptyContentSchema = ContentSchema.refine(value => value.trim().length > 0, "question content must not be empty");

  const StableIdSchema$1 = stringType().min(1).max(256).refine(value => [ ...value ].every(character => {
    const code = character.charCodeAt(0);
    return code > 31 && code !== 127;
  }), "invalid id");

  const NodePathSchema = stringType().min(2).max(4096).regex(/^\/(?:[^/~]|~[01])+(?:\/(?:[^/~]|~[01])+)*$/, "invalid path");

  const QuestionOptionSchema = objectType({
    id: StableIdSchema$1,
    content: NonEmptyContentSchema
  }).strict();

  const AnswerSlotSchema = objectType({
    id: StableIdSchema$1,
    label: ContentSchema.optional(),
    options: arrayType(QuestionOptionSchema).max(QUESTION_TREE_LIMITS.maxCollectionSize).optional()
  }).strict().superRefine((slot, ctx) => {
    var _a2;
    if (slot.options && slot.options.length === 0) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: [ "options" ],
        message: "slot options must not be empty"
      });
    }
    addDuplicateIdIssue(slot.options ?? [], ctx, [ "options" ]);
    if (slot.options && !((_a2 = slot.label) == null ? void 0 : _a2.trim())) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: [ "label" ],
        message: "dropdown slot requires a label"
      });
    }
  });

  const QuestionMetadataSchema = objectType({
    platform: stringType().max(128).optional(),
    variant: stringType().max(128).optional(),
    ruleVersion: stringType().max(128).optional(),
    sourceType: stringType().max(128).optional(),
    score: numberType().finite().optional()
  }).strict();

  function addDuplicateIdIssue(values, ctx, path) {
    var _a2;
    const seen = new Set;
    for (let index = 0; index < values.length; index += 1) {
      const id = (_a2 = values[index]) == null ? void 0 : _a2.id;
      if (id == null) continue;
      if (seen.has(id)) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: [ ...path, index, "id" ],
          message: `duplicate id: ${id}`
        });
      }
      seen.add(id);
    }
  }

  const LeafQuestionNodeSchema = objectType({
    kind: literalType("leaf"),
    id: StableIdSchema$1,
    path: NodePathSchema,
    type: enumType([ "single", "multiple", "judge", "fill", "short_answer" ]),
    stem: NonEmptyContentSchema,
    options: arrayType(QuestionOptionSchema).max(QUESTION_TREE_LIMITS.maxCollectionSize),
    slots: arrayType(AnswerSlotSchema).max(QUESTION_TREE_LIMITS.maxCollectionSize),
    fillPolicy: enumType([ "atomic", "per-slot" ]),
    metadata: QuestionMetadataSchema.optional()
  }).strict().superRefine((node, ctx) => {
    addDuplicateIdIssue(node.options, ctx, [ "options" ]);
    addDuplicateIdIssue(node.slots, ctx, [ "slots" ]);
    const isChoice = [ "single", "multiple", "judge" ].includes(node.type);
    if (isChoice && (node.options.length === 0 || node.slots.length !== 0)) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "choice questions require options and forbid slots"
      });
    }
    if (!isChoice && (node.options.length !== 0 || node.slots.length === 0)) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "text questions require slots and forbid root options"
      });
    }
    const dropdownSlots = node.slots.filter(slot => slot.options != null);
    if (dropdownSlots.length > 0 && node.slots.length !== 1) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: [ "slots" ],
        message: "each dropdown must be represented by one leaf slot"
      });
    }
  });

  const MatchingQuestionNodeSchema = objectType({
    kind: literalType("matching"),
    id: StableIdSchema$1,
    path: NodePathSchema,
    type: literalType("matching"),
    stem: NonEmptyContentSchema,
    left: arrayType(QuestionOptionSchema).min(1).max(QUESTION_TREE_LIMITS.maxCollectionSize),
    right: arrayType(QuestionOptionSchema).min(1).max(QUESTION_TREE_LIMITS.maxCollectionSize),
    cardinality: enumType([ "one-to-one", "many-to-one" ]),
    fillPolicy: enumType([ "atomic", "per-pair" ]),
    metadata: QuestionMetadataSchema.optional()
  }).strict().superRefine((node, ctx) => {
    addDuplicateIdIssue(node.left, ctx, [ "left" ]);
    addDuplicateIdIssue(node.right, ctx, [ "right" ]);
  });

  const CompositeQuestionNodeSchema = objectType({
    kind: literalType("composite"),
    id: StableIdSchema$1,
    path: NodePathSchema,
    type: enumType([ "composite", "cloze", "reading", "analysis" ]),
    stem: ContentSchema,
    children: arrayType(lazyType(() => QuestionNodeSchema)).min(1).max(QUESTION_TREE_LIMITS.maxCollectionSize),
    fillPolicy: enumType([ "atomic", "per-child" ]),
    metadata: QuestionMetadataSchema.optional()
  }).strict().superRefine((node, ctx) => {
    addDuplicateIdIssue(node.children, ctx, [ "children" ]);
  });

  const QuestionNodeSchema = lazyOnce(() => unionType([ LeafQuestionNodeSchema, CompositeQuestionNodeSchema, MatchingQuestionNodeSchema ]));

  function preflightTree(root) {
    let nodes = 0;
    const active2 = new WeakSet;
    const visit = (value, depth) => {
      if (depth > QUESTION_TREE_LIMITS.maxDepth) {
        throw new Error("question tree exceeds max depth");
      }
      if (typeof value !== "object" || value === null) return;
      if (active2.has(value)) throw new Error("question tree contains a cycle");
      active2.add(value);
      nodes += 1;
      if (nodes > QUESTION_TREE_LIMITS.maxNodes) {
        throw new Error("question tree exceeds max node count");
      }
      const candidate = value;
      if (candidate.kind === "composite" && Array.isArray(candidate.children)) {
        for (const child of candidate.children) visit(child, depth + 1);
      }
      active2.delete(value);
    };
    visit(root, 1);
    let encoded;
    try {
      encoded = JSON.stringify(root);
    } catch {
      throw new Error("question tree is not serializable");
    }
    if (utf8Length$4(encoded) > QUESTION_TREE_LIMITS.maxRootBytes) {
      throw new Error("question tree exceeds max byte size");
    }
  }

  function escapeNodePathSegment(value) {
    return value.replace(/~/g, "~0").replace(/\//g, "~1");
  }

  function deriveQuestionPaths(root) {
    const visit = (node, path) => {
      if (node.kind !== "composite") return {
        ...node,
        path: path
      };
      return {
        ...node,
        path: path,
        children: node.children.map(child => visit(child, `${path}/children/${escapeNodePathSegment(child.id)}`))
      };
    };
    return visit(root, `/${escapeNodePathSegment(root.id)}`);
  }

  function assertValidQuestionTree(root) {
    preflightTree(root);
    const parsed = QuestionNodeSchema.parse(root);
    const derived = deriveQuestionPaths(parsed);
    const compare = (actual, expected) => {
      if (actual.path !== expected.path) {
        throw new Error(`question path mismatch for ${actual.id}: ${actual.path} !== ${expected.path}`);
      }
      if (actual.kind === "composite" && expected.kind === "composite") {
        for (let index = 0; index < actual.children.length; index += 1) {
          const actualChild = actual.children[index];
          const expectedChild = expected.children[index];
          if (actualChild && expectedChild) compare(actualChild, expectedChild);
        }
      }
    };
    compare(parsed, derived);
  }

  function formatSearchStem(segments) {
    return segments.map(segment => segment.replace(/\s+/g, " ").trim()).filter(Boolean).join("\n");
  }

  function createUnit(input) {
    return {
      rootHash: input.rootHash,
      unitPath: input.unitPath,
      sourceNodeHash: input.sourceNodeHash,
      unitHash: searchUnitHash(input),
      queryType: input.queryType,
      effectiveStem: formatSearchStem(input.stemSegments),
      options: input.options,
      answerShape: input.answerShape
    };
  }

  function flattenLeaf(node, rootHash, contexts) {
    const sourceNodeHash = questionNodeHash(node);
    const slot = node.slots[0];
    const isDropdown = (slot == null ? void 0 : slot.options) != null;
    const queryType = isDropdown ? "single" : node.type;
    const options = isDropdown ? slot.options ?? [] : node.options;
    const answerShape = [ "single", "multiple", "judge" ].includes(node.type) ? {
      kind: "choice",
      min: 1,
      max: node.type === "multiple" ? node.options.length : 1
    } : {
      kind: "slots",
      slotIds: node.slots.map(item => item.id)
    };
    const stemSegments = [ ...contexts, node.stem, ...isDropdown && (slot == null ? void 0 : slot.label) ? [ slot.label ] : [] ];
    return createUnit({
      rootHash: rootHash,
      unitPath: node.path,
      sourceNodeHash: sourceNodeHash,
      queryType: queryType,
      stemSegments: stemSegments,
      options: options,
      answerShape: answerShape
    });
  }

  function flattenMatching(node, rootHash, contexts) {
    const sourceNodeHash = questionNodeHash(node);
    return node.left.map(left => {
      const answerShape = {
        kind: "matching-pair",
        leftId: left.id,
        rightIds: node.right.map(right => right.id)
      };
      return createUnit({
        rootHash: rootHash,
        unitPath: `${node.path}/pairs/${escapeNodePathSegment(left.id)}`,
        sourceNodeHash: sourceNodeHash,
        queryType: "single",
        stemSegments: [ ...contexts, node.stem, left.content ],
        options: node.right,
        answerShape: answerShape
      });
    });
  }

  function flattenQuestionTree(root) {
    assertValidQuestionTree(root);
    const rootHash = questionNodeHash(root);
    const units = [];
    const visit = (node, contexts) => {
      switch (node.kind) {
       case "leaf":
        units.push(flattenLeaf(node, rootHash, contexts));
        break;

       case "matching":
        units.push(...flattenMatching(node, rootHash, contexts));
        break;

       case "composite":
        {
          const nextContexts = node.stem.trim() ? [ ...contexts, node.stem ] : contexts;
          for (const child of node.children) visit(child, nextContexts);
          break;
        }
      }
    };
    visit(root, []);
    return units;
  }

  const successful = answer => answer.kind === "leaf" ? answer.status === "hit" : answer.status === "complete";

  const missed = answer => answer.kind === "leaf" ? answer.status === "miss" : answer.status === "miss";

  function aggregateStatus(children, atomic) {
    if (children.every(successful)) return "complete";
    if (children.every(missed)) return "miss";
    const unsafe = children.some(child => child.status === "unsafe");
    return atomic && unsafe ? "unsafe" : "partial";
  }

  function assembleMatching(node, answerByPath) {
    const pairs = node.left.map(left => {
      var _a2;
      const result = answerByPath.get(`${node.path}/pairs/${left.id.replace(/~/g, "~0").replace(/\//g, "~1")}`);
      const payload = ((_a2 = result == null ? void 0 : result.answer) == null ? void 0 : _a2.kind) === "matching-pair" ? result.answer : null;
      return {
        leftId: left.id,
        ...payload ? {
          rightId: payload.rightId,
          displayValue: payload.displayValue
        } : {},
        status: (result == null ? void 0 : result.status) ?? "miss",
        charged: (result == null ? void 0 : result.charged) ?? false
      };
    });
    const status = pairs.every(pair => pair.status === "hit") ? "complete" : pairs.every(pair => pair.status === "miss") ? "miss" : node.fillPolicy === "atomic" && pairs.some(pair => pair.status === "unsafe") ? "unsafe" : "partial";
    return {
      kind: "matching",
      path: node.path,
      status: status,
      pairs: pairs
    };
  }

  function assembleAnswerTree(root, answers) {
    const answerByPath = new Map(answers.map(answer => [ answer.path, answer ]));
    const unitByPath = new Map(flattenQuestionTree(root).map(unit => [ unit.unitPath, unit ]));
    const visit = node => {
      var _a2;
      if (node.kind === "leaf") {
        return answerByPath.get(node.path) ?? {
          kind: "leaf",
          path: node.path,
          unitHash: ((_a2 = unitByPath.get(node.path)) == null ? void 0 : _a2.unitHash) ?? "",
          status: "miss",
          answer: null,
          charged: false
        };
      }
      if (node.kind === "matching") {
        return assembleMatching(node, answerByPath);
      }
      const children = node.children.map(visit);
      return {
        kind: "composite",
        path: node.path,
        status: aggregateStatus(children, node.fillPolicy === "atomic"),
        children: children
      };
    };
    return visit(root);
  }

  const HashV2Schema$1 = stringType().regex(/^[0-9a-f]{64}$/);

  const LeafAnswerPayloadSchema = unionType([ objectType({
    kind: literalType("choice"),
    optionIds: arrayType(stringType().min(1)).min(1),
    displayValues: arrayType(stringType()).min(1)
  }).strict().refine(value => value.optionIds.length === value.displayValues.length, {
    message: "choice ids and display values must align"
  }), objectType({
    kind: literalType("slots"),
    slots: arrayType(objectType({
      slotId: stringType().min(1),
      values: arrayType(stringType().min(1)).min(1)
    }).strict()).min(1)
  }).strict() ]);

  const MatchingPairPayloadSchema = objectType({
    kind: literalType("matching-pair"),
    leftId: stringType().min(1),
    rightId: stringType().min(1),
    displayValue: stringType().min(1)
  }).strict();

  const LeafAnswerNodeSchema = objectType({
    kind: literalType("leaf"),
    path: NodePathSchema,
    unitHash: HashV2Schema$1,
    status: enumType([ "hit", "miss", "busy", "unauthorized", "insufficient", "rate_limited", "invalid", "unsafe" ]),
    answer: unionType([ LeafAnswerPayloadSchema, MatchingPairPayloadSchema ]).nullable(),
    source: enumType([ "free", "cache", "relay", "local" ]).optional(),
    aiGenerated: booleanType().optional(),
    charged: booleanType()
  }).strict().superRefine((node, ctx) => {
    if (node.status === "hit" && node.answer == null) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: [ "answer" ],
        message: "hit requires a typed answer"
      });
    }
    if (node.status !== "hit" && node.answer != null) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: [ "answer" ],
        message: "non-hit must not expose answer candidates"
      });
    }
    if (node.charged && node.status !== "hit") {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: [ "charged" ],
        message: "only usable hits can be charged"
      });
    }
  });

  const CompositeAnswerNodeSchema = lazyOnce(() => objectType({
    kind: literalType("composite"),
    path: NodePathSchema,
    status: enumType([ "complete", "partial", "miss", "unsafe" ]),
    children: arrayType(AnswerNodeSchema).min(1)
  }).strict());

  const MatchingAnswerNodeSchema = objectType({
    kind: literalType("matching"),
    path: NodePathSchema,
    status: enumType([ "complete", "partial", "miss", "unsafe" ]),
    pairs: arrayType(objectType({
      leftId: stringType().min(1),
      rightId: stringType().min(1).optional(),
      displayValue: stringType().min(1).optional(),
      status: enumType([ "hit", "miss", "busy", "unauthorized", "insufficient", "rate_limited", "invalid", "unsafe" ]),
      charged: booleanType()
    }).strict())
  }).strict();

  const AnswerNodeSchema = lazyOnce(() => unionType([ LeafAnswerNodeSchema, CompositeAnswerNodeSchema, MatchingAnswerNodeSchema ]));

  const SEARCH_PATH = "/api/search";

  const HashV2Schema = stringType().regex(/^[0-9a-f]{64}$/);

  objectType({
    requestSchemaVersion: literalType(2),
    root: QuestionNodeSchema,
    unitPath: NodePathSchema,
    expectedRootHash: HashV2Schema.optional(),
    expectedUnitHash: HashV2Schema.optional()
  }).strict().superRefine((request, ctx) => {
    try {
      assertValidQuestionTree(request.root);
    } catch (error) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: [ "root" ],
        message: error instanceof Error ? error.message : "invalid question tree"
      });
    }
  });

  const SearchUnitResponseSchema = objectType({
    code: nativeEnumType(AiAskCode),
    found: booleanType(),
    result: LeafAnswerNodeSchema.nullable().default(null)
  }).strict().superRefine((response, ctx) => {
    var _a2;
    const isHit = ((_a2 = response.result) == null ? void 0 : _a2.status) === "hit";
    if (response.found !== isHit) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: [ "result" ],
        message: "found must match typed hit status"
      });
    }
    if (response.found && response.code !== AiAskCode.Ok) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: [ "code" ],
        message: "found response requires Ok code"
      });
    }
  });

  const AUTH_REGISTER_PATH = "/api/auth/register";

  const AUTH_LOGIN_PATH = "/api/auth/login";

  const USERNAME_MAX = 32;

  const PASSWORD_MAX = 128;

  const EMAIL_MAX = 128;

  const AuthCredentialsSchema = objectType({
    username: stringType().min(3).max(USERNAME_MAX),
    password: stringType().min(8).max(PASSWORD_MAX)
  });

  objectType({
    username: stringType().min(1).max(EMAIL_MAX),
    password: stringType().min(1).max(PASSWORD_MAX)
  });

  AuthCredentialsSchema.extend({
    captchaToken: stringType().min(1).max(4096),
    email: stringType().email().max(EMAIL_MAX).optional()
  });

  const AuthResponseSchema = objectType({
    code: nativeEnumType(AiAskCode),
    token: stringType().optional(),
    reason: enumType([ "taken", "disabled" ]).optional()
  });

  const PASSWORD_RESET_CODE_LENGTH = 6;

  objectType({
    identifier: stringType().min(1).max(128),
    captchaToken: stringType().min(1).max(4096)
  });

  objectType({
    identifier: stringType().min(1).max(128),
    code: stringType().length(PASSWORD_RESET_CODE_LENGTH),
    newPassword: stringType().min(8).max(128)
  });

  objectType({
    code: nativeEnumType(AiAskCode),
    reason: enumType([ "sent", "disabled", "invalid_code" ]).optional(),
    username: stringType().optional()
  });

  const REDEEM_PATH = "/api/redeem";

  objectType({
    code: stringType().min(1).max(128)
  });

  const RedeemResponseSchema = objectType({
    code: nativeEnumType(AiAskCode),
    balance: numberType().optional()
  });

  const ME_PATH = "/api/me";

  objectType({}).strict();

  const MeResponseSchema = objectType({
    code: nativeEnumType(AiAskCode),
    username: stringType().optional(),
    balance: numberType().int().optional(),
    emailBound: booleanType().optional()
  }).strict();

  objectType({
    limit: numberType().int().min(1).max(50).default(20),
    cursor: stringType().regex(/^\d+$/u).max(20).optional()
  }).strict();

  const MeLedgerItemSchema = objectType({
    id: stringType(),
    at: stringType().datetime(),
    scene: stringType(),
    state: stringType(),
    amount: numberType().int()
  }).strict();

  objectType({
    code: nativeEnumType(AiAskCode),
    present: booleanType().optional()
  }).strict();

  objectType({
    code: nativeEnumType(AiAskCode),
    apiKey: stringType().optional()
  }).strict();

  objectType({
    code: nativeEnumType(AiAskCode),
    items: arrayType(MeLedgerItemSchema).max(50),
    nextCursor: stringType().nullable()
  }).strict();

  objectType({
    email: stringType().email().max(128)
  }).strict();

  objectType({
    code: nativeEnumType(AiAskCode),
    reason: enumType([ "sent", "cooldown", "taken", "already_bound" ]).optional()
  }).strict();

  objectType({
    email: stringType().email().max(128),
    code: stringType().length(PASSWORD_RESET_CODE_LENGTH)
  }).strict();

  objectType({
    code: nativeEnumType(AiAskCode),
    reason: enumType([ "bound", "invalid_code", "taken", "already_bound" ]).optional()
  }).strict();

  objectType({
    currentPassword: stringType().min(1).max(128),
    newPassword: stringType().min(8).max(128)
  }).strict();

  objectType({
    code: nativeEnumType(AiAskCode),
    reason: enumType([ "changed", "wrong_password" ]).optional()
  }).strict();

  const EVIDENCE_PATH = "/api/evidence";

  const PageDomShapeSchema = objectType({
    iframes: numberType().int().nonnegative().max(64),
    radios: numberType().int().nonnegative().max(2e3),
    checkboxes: numberType().int().nonnegative().max(2e3),
    textareas: numberType().int().nonnegative().max(500),
    selects: numberType().int().nonnegative().max(500),
    forms: numberType().int().nonnegative().max(64),
    bodyNodes: numberType().int().min(0).max(17),
    readyState: enumType([ "loading", "interactive", "complete" ])
  }).strict();

  const PageFingerprintSchema = objectType({
    host: stringType().min(1).max(64),
    path: stringType().min(1).max(128),
    qkeys: arrayType(stringType().min(1).max(32)).max(16),
    dom: PageDomShapeSchema
  }).strict();

  const EvidenceRequestSchema = objectType({
    requestId: stringType().min(1).max(64),
    fpHash: stringType().min(1).max(64),
    host: stringType().min(1).max(64),
    path: stringType().min(1).max(128),
    expiresAt: numberType().int().nonnegative().max(41024448e5)
  }).strict();

  const RULE_HARD_LIMITS = {
    maxPackageBytes: 512 * 1024,
    maxSteps: 5e4,
    maxWallMs: 1e4,
    maxAsyncMs: 8e3,
    maxLoopIterations: 1e3,
    maxCallDepth: 32,
    maxDomRefs: 5e3,
    maxRegexPatternBytes: 2 * 1024,
    maxRegexValueBytes: 128 * 1024
  };

  const FORBIDDEN_KEYS$3 = new Set([ "__proto__", "prototype", "constructor" ]);

  const utf8Length$3 = value => (new TextEncoder).encode(value).length;

  const SafeObjectKeySchema = stringType().min(1).max(256).refine(value => !FORBIDDEN_KEYS$3.has(value), "forbidden object key");

  const DeclaredVariableSchema = stringType().min(1).max(128).regex(/^[A-Za-z_][A-Za-z0-9_]*$/u, "invalid variable name").refine(value => !FORBIDDEN_KEYS$3.has(value), "forbidden variable name");

  const ReadVariableSchema = stringType().min(1).max(128).regex(/^\$?[A-Za-z_][A-Za-z0-9_]*$/u, "invalid variable name").refine(value => !FORBIDDEN_KEYS$3.has(value.replace(/^\$/u, "")), "forbidden variable name");

  const StableIdSchema = stringType().min(1).max(128).regex(/^[A-Za-z0-9][A-Za-z0-9._:-]*$/u, "invalid stable id");

  const VersionSchema = stringType().min(1).max(64).regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/u, "invalid version");

  const base64Url$1 = length => stringType().length(length).regex(/^[A-Za-z0-9_-]+$/u, "invalid base64url");

  const RuleContentHashSchema = base64Url$1(43);

  const JsonObjectSchema = lazyOnce(() => recordType(JsonRuleValueSchema).superRefine((value, ctx) => {
    for (const key of Object.keys(value)) {
      if (!SafeObjectKeySchema.safeParse(key).success) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: [ key ],
          message: "forbidden object key"
        });
      }
    }
  }));

  const JsonRuleValueSchema = lazyOnce(() => unionType([ nullType(), booleanType(), numberType().finite(), stringType(), arrayType(JsonRuleValueSchema).max(RULE_HARD_LIMITS.maxSteps), JsonObjectSchema ]));

  const ExprRecordSchema = () => recordType(SafeObjectKeySchema, ExprSchema);

  const RegexFlagsSchema = stringType().max(8).regex(/^[dgimsuvy]*$/u, "invalid regex flags").refine(value => new Set(value).size === value.length, "duplicate regex flag");

  const ExprSchema = lazyOnce(() => discriminatedUnionType("op", [ objectType({
    op: literalType("literal"),
    value: JsonRuleValueSchema
  }).strict(), objectType({
    op: literalType("var"),
    name: ReadVariableSchema
  }).strict(), objectType({
    op: literalType("path"),
    from: ExprSchema,
    path: arrayType(unionType([ SafeObjectKeySchema, numberType().int().nonnegative() ])).max(256)
  }).strict(), objectType({
    op: literalType("coalesce"),
    values: arrayType(ExprSchema).min(1).max(256)
  }).strict(), objectType({
    op: literalType("compare"),
    kind: enumType([ "eq", "ne", "gt", "gte", "lt", "lte" ]),
    left: ExprSchema,
    right: ExprSchema
  }).strict(), objectType({
    op: literalType("logic"),
    kind: enumType([ "and", "or" ]),
    values: arrayType(ExprSchema).min(1).max(256)
  }).strict(), objectType({
    op: literalType("not"),
    value: ExprSchema
  }).strict(), objectType({
    op: literalType("array"),
    items: arrayType(ExprSchema).max(RULE_HARD_LIMITS.maxSteps)
  }).strict(), objectType({
    op: literalType("object"),
    entries: ExprRecordSchema()
  }).strict(), objectType({
    op: literalType("map"),
    items: ExprSchema,
    item: DeclaredVariableSchema,
    index: DeclaredVariableSchema.optional(),
    value: ExprSchema,
    maxIterations: numberType().int().positive().max(RULE_HARD_LIMITS.maxLoopIterations)
  }).strict(), objectType({
    op: literalType("filter"),
    items: ExprSchema,
    item: DeclaredVariableSchema,
    index: DeclaredVariableSchema.optional(),
    when: ExprSchema,
    maxIterations: numberType().int().positive().max(RULE_HARD_LIMITS.maxLoopIterations)
  }).strict(), objectType({
    op: literalType("reduce"),
    items: ExprSchema,
    item: DeclaredVariableSchema,
    index: DeclaredVariableSchema.optional(),
    accumulator: DeclaredVariableSchema,
    initial: ExprSchema,
    value: ExprSchema,
    maxIterations: numberType().int().positive().max(RULE_HARD_LIMITS.maxLoopIterations)
  }).strict(), objectType({
    op: literalType("string"),
    kind: enumType([ "trim", "collapseWs", "lower", "upper" ]),
    value: ExprSchema
  }).strict(), objectType({
    op: literalType("regex"),
    kind: enumType([ "test", "extract", "replace" ]),
    value: ExprSchema,
    pattern: stringType().refine(value => utf8Length$3(value) <= RULE_HARD_LIMITS.maxRegexPatternBytes, "regex pattern exceeds byte limit"),
    flags: RegexFlagsSchema.optional(),
    replacement: stringType().refine(value => utf8Length$3(value) <= RULE_HARD_LIMITS.maxRegexValueBytes, "regex replacement exceeds byte limit").optional()
  }).strict(), objectType({
    op: literalType("jsonPath"),
    from: ExprSchema,
    query: stringType().min(1).max(4096)
  }).strict(), objectType({
    op: literalType("format"),
    template: stringType().max(64 * 1024),
    args: ExprRecordSchema()
  }).strict() ]));

  const StepListSchema = () => arrayType(StepSchema).max(RULE_HARD_LIMITS.maxSteps);

  const StepSchema = lazyOnce(() => unionType([ objectType({
    type: literalType("set"),
    name: DeclaredVariableSchema,
    value: ExprSchema
  }).strict(), objectType({
    type: literalType("if"),
    when: ExprSchema,
    then: StepListSchema(),
    else: StepListSchema().optional()
  }).strict(), objectType({
    type: literalType("switch"),
    value: ExprSchema,
    cases: arrayType(objectType({
      equals: JsonRuleValueSchema,
      steps: StepListSchema()
    }).strict()).min(1).max(256),
    default: StepListSchema().optional()
  }).strict(), objectType({
    type: literalType("forEach"),
    items: ExprSchema,
    item: DeclaredVariableSchema,
    index: DeclaredVariableSchema.optional(),
    steps: StepListSchema(),
    maxIterations: numberType().int().positive().max(RULE_HARD_LIMITS.maxLoopIterations)
  }).strict(), objectType({
    type: literalType("while"),
    when: ExprSchema,
    steps: StepListSchema(),
    maxIterations: numberType().int().positive().max(RULE_HARD_LIMITS.maxLoopIterations)
  }).strict(), objectType({
    type: literalType("callFlow"),
    flowId: StableIdSchema,
    args: ExprRecordSchema().optional(),
    result: DeclaredVariableSchema.optional()
  }).strict(), objectType({
    type: literalType("return"),
    value: ExprSchema.optional()
  }).strict(), objectType({
    type: literalType("try"),
    steps: StepListSchema(),
    catch: StepListSchema().optional(),
    finally: StepListSchema().optional()
  }).strict().refine(step => step.catch != null || step.finally != null, {
    message: "try requires catch or finally"
  }), objectType({
    type: literalType("primitive"),
    id: stringType().min(3).max(128).regex(/^[A-Za-z][A-Za-z0-9]*(?:\.[A-Za-z][A-Za-z0-9]*)+$/u, "invalid primitive id"),
    args: ExprRecordSchema().optional(),
    result: DeclaredVariableSchema.optional(),
    timeoutMs: numberType().int().positive().max(RULE_HARD_LIMITS.maxAsyncMs).optional()
  }).strict() ]));

  const FlowDefinitionSchema = objectType({
    id: StableIdSchema,
    params: arrayType(DeclaredVariableSchema).max(256).refine(values => new Set(values).size === values.length, {
      message: "duplicate flow param"
    }).optional(),
    steps: StepListSchema()
  }).strict();

  const RuleEventSchema = enumType([ "url-change", "dom-change", "frame-ready", "api-captured", "user-start", "session-complete", "timeout" ]);

  const StateMachineDefinitionSchema = objectType({
    initial: StableIdSchema,
    states: recordType(StableIdSchema, objectType({
      enter: StepListSchema().optional(),
      transitions: arrayType(objectType({
        event: RuleEventSchema,
        when: ExprSchema.optional(),
        target: StableIdSchema,
        actions: StepListSchema().optional()
      }).strict()).max(256)
    }).strict())
  }).strict().superRefine((machine, ctx) => {
    if (!(machine.initial in machine.states)) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: [ "initial" ],
        message: "initial state does not exist"
      });
    }
    for (const [stateId, state] of Object.entries(machine.states)) {
      for (let index = 0; index < state.transitions.length; index += 1) {
        const transition = state.transitions[index];
        if (transition && !(transition.target in machine.states)) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: [ "states", stateId, "transitions", index, "target" ],
            message: "transition target does not exist"
          });
        }
      }
    }
  });

  const RuleCapabilitySchema = enumType([ "dom-read", "frame-read", "runtime-read", "network-read", "dom-mutate", "ui-reveal", "answer-write" ]);

  const RuleLimitsSchema = objectType({
    maxSteps: numberType().int().positive().max(RULE_HARD_LIMITS.maxSteps),
    maxWallMs: numberType().int().positive().max(RULE_HARD_LIMITS.maxWallMs),
    maxAsyncMs: numberType().int().positive().max(RULE_HARD_LIMITS.maxAsyncMs),
    maxLoopIterations: numberType().int().positive().max(RULE_HARD_LIMITS.maxLoopIterations),
    maxCallDepth: numberType().int().positive().max(RULE_HARD_LIMITS.maxCallDepth),
    maxDomRefs: numberType().int().positive().max(RULE_HARD_LIMITS.maxDomRefs)
  }).strict();

  const PageVariantRuleSchema = objectType({
    id: StableIdSchema,
    title: stringType().min(1).max(256),
    priority: numberType().int().min(-1e6).max(1e6),
    match: FlowDefinitionSchema,
    lifecycle: StateMachineDefinitionSchema.optional(),
    capture: FlowDefinitionSchema,
    fill: FlowDefinitionSchema,
    diagnostics: FlowDefinitionSchema.optional(),
    limits: RuleLimitsSchema.partial().optional()
  }).strict().superRefine((variant, ctx) => {
    var _a2;
    const ids = [ variant.match.id, variant.capture.id, variant.fill.id, (_a2 = variant.diagnostics) == null ? void 0 : _a2.id ].filter(id => id != null);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "duplicate flow id"
      });
    }
  });

  const RuleRollbackAuthorizationSchema = objectType({
    toVersion: VersionSchema,
    authorizationId: StableIdSchema
  }).strict();

  const ShellSelectorValueSchema = unionType([ stringType().min(1).max(256), arrayType(stringType().min(1).max(256)).min(1).max(32) ]);

  const RuleShellConfigSchema = objectType({
    selectors: recordType(stringType().regex(/^[a-z][a-zA-Z0-9.-]{0,47}$/u), ShellSelectorValueSchema).refine(value => Object.keys(value).length <= 64, {
      message: "shellConfig.selectors accepts at most 64 entries"
    }).optional()
  }).strict();

  const RulePackageSchema = objectType({
    schemaVersion: literalType(1),
    packageId: StableIdSchema,
    platform: StableIdSchema,
    version: VersionSchema,
    releaseSequence: numberType().int().nonnegative(),
    engineRange: objectType({
      min: VersionSchema,
      maxExclusive: VersionSchema.optional()
    }).strict(),
    issuedAt: numberType().int().nonnegative(),
    expiresAt: numberType().int().nonnegative().optional(),
    signingKid: StableIdSchema,
    rollbackAuthorization: RuleRollbackAuthorizationSchema.optional(),
    capabilities: arrayType(RuleCapabilitySchema).max(16),
    shellConfig: RuleShellConfigSchema.optional(),
    variants: arrayType(PageVariantRuleSchema).min(1).max(256),
    changelog: stringType().max(64 * 1024),
    contentHash: RuleContentHashSchema,
    signature: base64Url$1(86)
  }).strict().superRefine((pkg, ctx) => {
    if (pkg.expiresAt != null && pkg.expiresAt <= pkg.issuedAt) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: [ "expiresAt" ],
        message: "package expiry must be after issue time"
      });
    }
    if (new Set(pkg.capabilities).size !== pkg.capabilities.length) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: [ "capabilities" ],
        message: "duplicate capability"
      });
    }
    if (pkg.rollbackAuthorization != null && pkg.rollbackAuthorization.toVersion !== pkg.version) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: [ "rollbackAuthorization", "toVersion" ],
        message: "rollback authorization must target package version"
      });
    }
    const variantIds = pkg.variants.map(variant => variant.id);
    if (new Set(variantIds).size !== variantIds.length) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: [ "variants" ],
        message: "duplicate variant id"
      });
    }
    if (utf8Length$3(JSON.stringify(pkg)) > RULE_HARD_LIMITS.maxPackageBytes) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "rule package exceeds byte limit"
      });
    }
  });

  const RULE_SYNC_PATH = "/api/rules/sync";

  const MAX_RULE_PACKAGES = 256;

  const RuleSyncKnownPackageSchema = objectType({
    packageId: StableIdSchema,
    releaseSequence: numberType().int().nonnegative(),
    contentHash: RuleContentHashSchema
  }).strict();

  const RuleReleaseChannelSchema = enumType([ "stable", "candidate" ]);

  const RuleRolloutPercentSchema = unionType([ literalType(5), literalType(20), literalType(50), literalType(100) ]);

  const RuleReleaseContextSchema = objectType({
    releaseId: StableIdSchema,
    channel: RuleReleaseChannelSchema,
    rolloutPercent: RuleRolloutPercentSchema,
    cohortBucket: numberType().int().min(0).max(9999)
  }).strict();

  function isRuleCandidateTestDelivery(value) {
    return value.channel === "candidate" && value.cohortBucket >= value.rolloutPercent * 100;
  }

  const RulePackageSummarySchema = RuleReleaseContextSchema.extend({
    packageId: StableIdSchema,
    platform: StableIdSchema,
    version: VersionSchema,
    releaseSequence: numberType().int().nonnegative(),
    contentHash: RuleContentHashSchema,
    issuedAt: numberType().int().nonnegative(),
    rollbackAuthorization: RuleRollbackAuthorizationSchema.optional()
  }).strict();

  objectType({
    engineVersion: VersionSchema,
    known: arrayType(RuleSyncKnownPackageSchema).max(MAX_RULE_PACKAGES)
  }).strict().superRefine((request, ctx) => {
    const packageIds = request.known.map(item => item.packageId);
    if (new Set(packageIds).size !== packageIds.length) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: [ "known" ],
        message: "duplicate package id"
      });
    }
  });

  const sameRollbackAuthorization = (left, right) => (left == null ? void 0 : left.toVersion) === (right == null ? void 0 : right.toVersion) && (left == null ? void 0 : left.authorizationId) === (right == null ? void 0 : right.authorizationId);

  const RuleSyncResponseSchema = objectType({
    code: nativeEnumType(AiAskCode),
    checkedAt: numberType().int().nonnegative(),
    latest: arrayType(RulePackageSummarySchema).max(MAX_RULE_PACKAGES),
    update: RulePackageSchema.nullable(),
    hasMore: booleanType()
  }).strict().superRefine((response, ctx) => {
    const packageIds = response.latest.map(item => item.packageId);
    if (new Set(packageIds).size !== packageIds.length) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: [ "latest" ],
        message: "duplicate package id"
      });
    }
    if (response.update == null && response.hasMore) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: [ "hasMore" ],
        message: "hasMore requires an update package"
      });
    }
    if (response.update) {
      const summary = response.latest.find(item => {
        var _a2;
        return item.packageId === ((_a2 = response.update) == null ? void 0 : _a2.packageId) && item.releaseSequence === response.update.releaseSequence && item.contentHash === response.update.contentHash;
      });
      if (!summary) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: [ "update" ],
          message: "update package is missing from latest summaries"
        });
      } else if (!sameRollbackAuthorization(response.update.rollbackAuthorization, summary.rollbackAuthorization)) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: [ "update", "rollbackAuthorization" ],
          message: "rollback authorization summary mismatch"
        });
      }
    }
  });

  const REPORT_PATH = "/api/report";

  const ReportStageSchema = enumType([ "resolve", "match", "lifecycle", "capture", "decode", "query", "safety", "fill", "verify", "update" ]);

  const ReportReasonSchema = enumType([ "no_match", "invalid_match_result", "zero_question", "selector_zero", "selector_many", "decode_failed", "query_failed", "unsafe_answer", "missing_binding", "disconnected", "stale_dom", "ambiguous_binding", "shape_mismatch", "partial_not_allowed", "adapter_rejected", "fill_failed", "verify_failed", "timeout", "budget_exceeded", "unknown_primitive", "rule_failed", "update_failed", "unsupported_question" ]);

  const ReportRuleSourceSchema = enumType([ "bundled", "remote-active", "remote-lkg", "missing" ]);

  const ReportRuleContextSchema = objectType({
    packageId: stringType().min(1).max(128),
    variantId: stringType().min(1).max(128),
    source: ReportRuleSourceSchema,
    version: stringType().min(1).max(64),
    releaseSequence: numberType().int().nonnegative(),
    contentHash: stringType().min(1).max(64),
    release: RuleReleaseContextSchema.optional()
  });

  const ReportStageResultSchema = discriminatedUnionType("ok", [ objectType({
    stage: ReportStageSchema,
    ok: literalType(true)
  }).strict(), objectType({
    stage: ReportStageSchema,
    ok: literalType(false),
    reason: ReportReasonSchema
  }).strict() ]);

  const HealthReportSchema = objectType({
    schemaVersion: literalType(2),
    platform: stringType().min(1).max(32),
    clientId: stringType().min(8).max(64),
    scriptVersion: stringType().max(32),
    engineVersion: stringType().min(1).max(32),
    rule: ReportRuleContextSchema,
    mode: literalType("health"),
    stages: arrayType(ReportStageResultSchema).min(1).max(16),
    fingerprint: PageFingerprintSchema.optional()
  });

  const DiagnosticItemSchema = objectType({
    type: stringType().min(1).max(32),
    decodeFailed: booleanType(),
    optionCount: numberType().int().nonnegative().max(1e3),
    imageCount: numberType().int().nonnegative().max(1e3),
    unsupportedReason: enumType([ "empty-content" ]).optional()
  }).strict();

  const DiagnosticPayloadSchema = objectType({
    matched: booleanType(),
    count: numberType().int().nonnegative().max(1e4),
    imageCount: numberType().int().nonnegative().max(1e4),
    items: arrayType(DiagnosticItemSchema).max(1e4)
  }).strict();

  const DiagnosticReportSchema = HealthReportSchema.extend({
    mode: literalType("diagnostic"),
    diagnostic: DiagnosticPayloadSchema
  });

  discriminatedUnionType("mode", [ HealthReportSchema, DiagnosticReportSchema ]);

  const ReportResponseSchema = objectType({
    code: nativeEnumType(AiAskCode),
    evidenceRequest: EvidenceRequestSchema.optional()
  });

  objectType({
    requestId: stringType().min(1).max(64).nullable(),
    platform: stringType().min(1).max(32),
    clientId: stringType().min(8).max(64),
    scriptVersion: stringType().max(32),
    engineVersion: stringType().min(1).max(32),
    fingerprint: PageFingerprintSchema,
    rule: ReportRuleContextSchema,
    note: stringType().max(200).optional(),
    html: stringType().max(64e3),
    truncated: booleanType()
  }).strict();

  const EvidenceResponseSchema = objectType({
    code: nativeEnumType(AiAskCode),
    claimed: booleanType().optional(),
    reason: enumType([ "ip", "ticket", "client", "global" ]).optional()
  });

  const EVENTS_PATH = "/api/events";

  const DurationBucketSchema = enumType([ "lt1s", "lt5s", "lt30s", "lt2m", "lt10m", "lt1h", "ge1h" ]);

  const UsageFeatureSchema = enumType([ "random_answer", "auto_submit", "cache_import", "cache_export", "diagnostic", "course_automation" ]);

  const UsageFeatureActionSchema = enumType([ "enabled", "disabled", "used" ]);

  const AnswerSourceCountsSchema = objectType({
    total: numberType().int().nonnegative().max(1e4),
    cacheHit: numberType().int().nonnegative().max(1e4),
    relayHit: numberType().int().nonnegative().max(1e4),
    aiHit: numberType().int().nonnegative().max(1e4),
    randomFill: numberType().int().nonnegative().max(1e4)
  }).strict();

  const HeartbeatEventSchema = objectType({
    type: literalType("heartbeat")
  }).strict();

  const AnswerRoundEventSchema = objectType({
    type: literalType("answer_round"),
    rule: ReportRuleContextSchema,
    stages: arrayType(ReportStageResultSchema).min(1).max(16),
    counts: AnswerSourceCountsSchema.optional(),
    durationBucket: DurationBucketSchema.optional(),
    fingerprint: PageFingerprintSchema.optional()
  }).strict();

  const SubmitOutcomeSchema = enumType([ "submitted", "confirm_accepted", "confirm_unverified", "below_threshold", "unrecognized_questions", "blocked" ]);

  const SubmitEventSchema = objectType({
    type: literalType("submit"),
    outcome: SubmitOutcomeSchema,
    trustedDecile: numberType().int().min(0).max(10).optional()
  }).strict();

  const CourseTaskEventSchema = objectType({
    type: literalType("course_task"),
    kind: enumType([ "video", "audio", "document", "read", "chapter" ]),
    outcome: enumType([ "done", "failed", "skipped" ]),
    durationBucket: DurationBucketSchema
  }).strict();

  const FeatureEventSchema = objectType({
    type: literalType("feature"),
    feature: UsageFeatureSchema,
    action: UsageFeatureActionSchema
  }).strict();

  const RuleMissingEventSchema = objectType({
    type: literalType("rule_missing"),
    packageId: stringType().min(1).max(128),
    fingerprint: PageFingerprintSchema.optional()
  }).strict();

  const DiagnosticEventSchema = objectType({
    type: literalType("diagnostic"),
    rule: ReportRuleContextSchema,
    stages: arrayType(ReportStageResultSchema).min(1).max(16),
    diagnostic: DiagnosticPayloadSchema
  }).strict();

  const RegisterStepEventSchema = objectType({
    type: literalType("register_step"),
    step: enumType([ "view", "captcha", "success" ])
  }).strict();

  const UsageEventSchema = discriminatedUnionType("type", [ HeartbeatEventSchema, AnswerRoundEventSchema, SubmitEventSchema, CourseTaskEventSchema, FeatureEventSchema, RuleMissingEventSchema, DiagnosticEventSchema, RegisterStepEventSchema ]);

  objectType({
    schemaVersion: literalType(1),
    clientId: stringType().min(8).max(64),
    platform: stringType().min(1).max(32),
    scriptVersion: stringType().max(32),
    engineVersion: stringType().min(1).max(32),
    events: arrayType(UsageEventSchema).min(1).max(50)
  });

  objectType({
    code: nativeEnumType(AiAskCode)
  });

  const ANNOUNCEMENT_PATH = "/api/announcement";

  const AnnouncementLevelSchema = enumType([ "info", "warning", "critical" ]);

  const ANNOUNCEMENT_TITLE_MAX = 120;

  const ANNOUNCEMENT_HTML_MAX = 4096;

  const AnnouncementBodySchema = objectType({
    level: AnnouncementLevelSchema,
    title: stringType().min(1).max(ANNOUNCEMENT_TITLE_MAX),
    html: stringType().max(ANNOUNCEMENT_HTML_MAX)
  }).strict();

  objectType({}).strict();

  const AnnouncementResponseSchema = objectType({
    code: nativeEnumType(AiAskCode),
    seq: numberType().int().nonnegative(),
    updatedAt: stringType().datetime().nullable(),
    announcement: AnnouncementBodySchema.nullable()
  }).strict().refine(value => value.announcement === null === (value.updatedAt === null), {
    message: "updatedAt \u5fc5\u987b\u4e0e announcement \u540c\u65f6\u4e3a null"
  });

  const ADMIN_ANNOUNCEMENT_CONFIRMATION = "announcement";

  objectType({}).strict();

  objectType({
    code: nativeEnumType(AiAskCode),
    seq: numberType().int().nonnegative(),
    updatedAt: stringType().datetime().nullable(),
    active: booleanType(),
    level: AnnouncementLevelSchema,
    title: stringType().max(ANNOUNCEMENT_TITLE_MAX),
    html: stringType().max(ANNOUNCEMENT_HTML_MAX)
  }).strict();

  objectType({
    level: AnnouncementLevelSchema,
    title: stringType().max(ANNOUNCEMENT_TITLE_MAX),
    html: stringType().max(ANNOUNCEMENT_HTML_MAX),
    active: booleanType(),
    expectedSeq: numberType().int().nonnegative(),
    reason: stringType().trim().min(3).max(500),
    confirmation: literalType(ADMIN_ANNOUNCEMENT_CONFIRMATION)
  }).strict().refine(value => !value.active || value.title.trim().length > 0, {
    path: [ "title" ],
    message: "active announcement requires a title"
  });

  const AnnouncementUpdateOutcomeSchema = enumType([ "written", "unchanged", "stale" ]);

  objectType({
    code: nativeEnumType(AiAskCode),
    outcome: AnnouncementUpdateOutcomeSchema,
    seq: numberType().int().nonnegative()
  }).strict();

  const BASE64URL = /^[A-Za-z0-9_-]*$/;

  function bytesToBase64Url(bytes) {
    let binary = "";
    const chunkSize = 32768;
    for (let offset = 0; offset < bytes.length; offset += chunkSize) binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
    return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
  }

  function base64UrlToBytes(value) {
    if (!BASE64URL.test(value) || value.includes("=")) throw new Error("invalid base64url");
    const padding = "=".repeat((4 - value.length % 4) % 4);
    let binary;
    try {
      binary = atob(value.replaceAll("-", "+").replaceAll("_", "/") + padding);
    } catch {
      throw new Error("invalid base64url");
    }
    const out = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index++) out[index] = binary.charCodeAt(index);
    if (bytesToBase64Url(out) !== value) throw new Error("invalid base64url");
    return out;
  }

  const utf8Bytes = value => (new TextEncoder).encode(value);

  const utf8Text = value => new TextDecoder("utf-8", {
    fatal: true
  }).decode(value);

  const base64Url = (min, max) => stringType().min(min).max(max).regex(/^[A-Za-z0-9_-]+$/u);

  const signature = base64Url(86, 86);

  const timestamp = numberType().int().nonnegative();

  const kid = stringType().min(1).max(64).regex(/^[A-Za-z0-9._-]+$/u);

  const PublicP256JwkSchema = objectType({
    kty: literalType("EC"),
    crv: literalType("P-256"),
    x: base64Url(43, 43),
    y: base64Url(43, 43)
  }).strict();

  const ServerKeyUseSchema = enumType([ "transport-signing", "ecdh", "rule-signing" ]);

  const ServerKeySchema = objectType({
    kid: kid,
    use: ServerKeyUseSchema,
    publicJwk: PublicP256JwkSchema,
    notBefore: timestamp,
    expiresAt: timestamp
  }).strict();

  const UnsignedServerKeysetSchema = objectType({
    keysetVersion: numberType().int().positive(),
    issuedAt: timestamp,
    expiresAt: timestamp,
    keys: arrayType(ServerKeySchema).min(1).max(32)
  }).strict();

  const ServerKeysetSchema = UnsignedServerKeysetSchema.extend({
    rootSignature: signature
  }).strict();

  const UnsignedBootstrapChallengeSchema = objectType({
    protocolVersion: literalType(1),
    minClientVersion: stringType().min(1).max(32),
    serverTime: timestamp,
    challenge: base64Url(22, 128),
    challengeExpiresAt: timestamp,
    keysetVersion: numberType().int().positive(),
    keysetHash: base64Url(43, 43),
    signingKid: kid
  }).strict();

  const BootstrapChallengeSchema = UnsignedBootstrapChallengeSchema.extend({
    signature: signature
  }).strict();

  const BootstrapDocumentSchema = objectType({
    keyset: ServerKeysetSchema,
    challenge: BootstrapChallengeSchema
  }).strict();

  const SecurityScopeSchema = enumType([ "report", "user", "admin" ]);

  const sessionOpenFields = {
    protocolVersion: literalType(1),
    challenge: base64Url(22, 128),
    deviceId: base64Url(43, 43),
    devicePublicJwk: PublicP256JwkSchema,
    ecdhKid: kid,
    clientEcdhPublicJwk: PublicP256JwkSchema,
    timestamp: timestamp,
    nonce: base64Url(22, 128),
    signature: signature
  };

  objectType({
    ...sessionOpenFields,
    requestedScope: enumType([ "report", "user" ])
  }).strict();

  const AdminSessionOpenRequestSchema = objectType(sessionOpenFields).strict();

  objectType({
    username: stringType().min(3).max(64),
    password: stringType().min(1).max(256)
  }).strict();

  const SessionOpenResponseSchema = objectType({
    protocolVersion: literalType(1),
    signingKid: kid,
    ecdhKid: kid,
    serverEcdhPublicJwk: PublicP256JwkSchema,
    serverNonce: base64Url(22, 128),
    iv: base64Url(16, 16),
    ciphertext: base64Url(1, 16384),
    signature: signature
  }).strict();

  const SessionOpenPlaintextSchema = objectType({
    sessionId: base64Url(22, 64),
    deviceId: base64Url(43, 43),
    grantedScope: SecurityScopeSchema,
    issuedAt: timestamp,
    expiresAt: timestamp
  }).strict();

  const secureRequestFields = {
    v: literalType(1),
    sessionId: base64Url(22, 64),
    requestId: stringType().uuid(),
    timestamp: timestamp,
    nonce: base64Url(22, 128),
    iv: base64Url(16, 16),
    ciphertext: base64Url(1, 14e5),
    signature: signature
  };

  objectType(secureRequestFields).strict();

  const SecureResponseEnvelopeSchema = objectType({
    ...secureRequestFields,
    kid: kid
  }).strict();

  const SecureClientAppSchema = enumType([ "userscript", "web" ]);

  objectType({
    app: SecureClientAppSchema,
    version: stringType().min(1).max(32)
  }).strict();

  function validateServerKeyset(input, now, highestAcceptedVersion = 0) {
    const keyset = ServerKeysetSchema.parse(input);
    if (keyset.keysetVersion < highestAcceptedVersion) throw new Error("keyset downgrade");
    if (keyset.issuedAt > now || keyset.expiresAt <= now) throw new Error("keyset expired");
    const seen = new Set;
    let activeEcdh = 0;
    for (const key of keyset.keys) {
      if (seen.has(key.kid)) throw new Error("duplicate kid");
      seen.add(key.kid);
      if (key.notBefore >= key.expiresAt || key.expiresAt <= now || key.expiresAt > keyset.expiresAt) throw new Error("key expired");
      if (key.use === "ecdh" && key.notBefore <= now) activeEcdh += 1;
    }
    if (activeEcdh > 1) throw new Error("ambiguous ECDH key");
  }

  function validateBootstrapChallenge(input, keyset, now) {
    const challenge = BootstrapChallengeSchema.parse(input);
    if (challenge.challengeExpiresAt <= now) throw new Error("challenge expired");
    if (challenge.keysetVersion !== keyset.keysetVersion) throw new Error("keyset mismatch");
    const signingKey = keyset.keys.find(key => key.kid === challenge.signingKid && key.use === "transport-signing" && key.notBefore <= now && key.expiresAt > now);
    if (!signingKey) throw new Error("invalid signing key");
  }

  function canonicalize(value) {
    if (value === null || typeof value === "boolean") return JSON.stringify(value);
    if (typeof value === "string") return JSON.stringify(value);
    if (typeof value === "number") {
      if (!Number.isFinite(value)) throw new Error("non-finite number");
      return JSON.stringify(Object.is(value, -0) ? 0 : value);
    }
    if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
    if (typeof value !== "object") throw new Error("unsupported canonical value");
    const record = value;
    const entries = Object.keys(record).sort().map(key => `${JSON.stringify(key)}:${canonicalize(record[key])}`);
    return `{${entries.join(",")}}`;
  }

  function canonicalPublicJwk(jwk) {
    const parsed = PublicP256JwkSchema.parse(jwk);
    return canonicalize({
      crv: parsed.crv,
      kty: parsed.kty,
      x: parsed.x,
      y: parsed.y
    });
  }

  function requestEnvelopeInput(method, path, envelope) {
    return [ "aiask-v1", method.toUpperCase(), path, envelope.sessionId, envelope.requestId, String(envelope.timestamp), envelope.nonce, envelope.iv, envelope.ciphertext ].join("\n");
  }

  function responseEnvelopeInput(method, path, envelope) {
    return [ "aiask-v1-response", method.toUpperCase(), path, envelope.kid, envelope.sessionId, envelope.requestId, String(envelope.timestamp), envelope.nonce, envelope.iv, envelope.ciphertext ].join("\n");
  }

  function requestEnvelopeAad(method, path, envelope) {
    return [ "aiask-v1-aad", method.toUpperCase(), path, envelope.sessionId, envelope.requestId, String(envelope.timestamp), envelope.nonce, envelope.iv ].join("\n");
  }

  function responseEnvelopeAad(method, path, envelope) {
    return [ "aiask-v1-response-aad", method.toUpperCase(), path, envelope.kid, envelope.sessionId, envelope.requestId, String(envelope.timestamp), envelope.nonce, envelope.iv ].join("\n");
  }

  function unsignedServerKeyset(keyset) {
    const {rootSignature: _rootSignature, ...unsigned} = keyset;
    return unsigned;
  }

  function unsignedBootstrapChallenge(challenge) {
    const {signature: _signature, ...unsigned} = challenge;
    return unsigned;
  }

  const serverKeysetSigningInput = keyset => canonicalize(keyset);

  const bootstrapChallengeSigningInput = challenge => canonicalize(challenge);

  function sessionOpenRequestInput(path, request) {
    return `aiask-v1-session-open\nPOST\n${path}\n${canonicalize(request)}`;
  }

  function sessionOpenResponseInput(path, response) {
    return `aiask-v1-session-open-response\nPOST\n${path}\n${canonicalize(response)}`;
  }

  function sessionOpenResponseAad(path, response) {
    return `aiask-v1-session-open-aad\nPOST\n${path}\n${canonicalize(response)}`;
  }

  const handshakeTranscript = context => canonicalize(context);

  const trafficTranscript = context => canonicalize(context);

  const subtle = () => globalThis.crypto.subtle;

  const arrayBuffer = value => {
    const copy = new Uint8Array(value.length);
    copy.set(value);
    return copy.buffer;
  };

  const publicJwk = jwk => {
    const parsed = JSON.parse(canonicalPublicJwk(jwk));
    return {
      ...parsed,
      ext: true
    };
  };

  const privateJwk = jwk => {
    if (jwk.kty !== "EC" || jwk.crv !== "P-256" || typeof jwk.x !== "string" || typeof jwk.y !== "string" || typeof jwk.d !== "string") throw new Error("invalid private P-256 JWK");
    return {
      kty: "EC",
      crv: "P-256",
      x: jwk.x,
      y: jwk.y,
      d: jwk.d,
      ext: true
    };
  };

  const importEcdsaPublicJwk = jwk => subtle().importKey("jwk", publicJwk(jwk), {
    name: "ECDSA",
    namedCurve: "P-256"
  }, true, [ "verify" ]);

  const importEcdsaPrivateJwk = jwk => subtle().importKey("jwk", privateJwk(jwk), {
    name: "ECDSA",
    namedCurve: "P-256"
  }, false, [ "sign" ]);

  const importEcdhPublicJwk = jwk => subtle().importKey("jwk", publicJwk(jwk), {
    name: "ECDH",
    namedCurve: "P-256"
  }, true, []);

  async function generateEcdsaDeviceKeyPair() {
    return await subtle().generateKey({
      name: "ECDSA",
      namedCurve: "P-256"
    }, true, [ "sign", "verify" ]);
  }

  async function generateEcdhKeyPair() {
    return await subtle().generateKey({
      name: "ECDH",
      namedCurve: "P-256"
    }, true, [ "deriveBits" ]);
  }

  const exportPublicJwk = async key => {
    const exported = await subtle().exportKey("jwk", key);
    return JSON.parse(canonicalPublicJwk({
      kty: exported.kty,
      crv: exported.crv,
      x: exported.x,
      y: exported.y
    }));
  };

  const exportPrivateJwk = key => subtle().exportKey("jwk", key);

  async function signEcdsaP1363(privateKey, data) {
    const signature2 = new Uint8Array(await subtle().sign({
      name: "ECDSA",
      hash: "SHA-256"
    }, privateKey, arrayBuffer(data)));
    if (signature2.length !== 64) throw new Error("invalid ECDSA signature length");
    return bytesToBase64Url(signature2);
  }

  async function verifyEcdsaP1363(publicKey, data, signature2) {
    let bytes;
    try {
      bytes = base64UrlToBytes(signature2);
    } catch {
      return false;
    }
    if (bytes.length !== 64) return false;
    return subtle().verify({
      name: "ECDSA",
      hash: "SHA-256"
    }, publicKey, arrayBuffer(bytes), arrayBuffer(data));
  }

  async function deriveEcdhSecret(privateKey, publicKey) {
    return new Uint8Array(await subtle().deriveBits({
      name: "ECDH",
      public: publicKey
    }, privateKey, 256));
  }

  async function sha256(data) {
    return new Uint8Array(await subtle().digest("SHA-256", arrayBuffer(data)));
  }

  const sha256Base64Url = async data => bytesToBase64Url(await sha256(data));

  const fingerprintPublicJwk = jwk => sha256Base64Url(utf8Bytes(canonicalPublicJwk(jwk)));

  async function hkdf(sharedSecret, saltLabel, infoLabel, transcript) {
    const material = await subtle().importKey("raw", arrayBuffer(sharedSecret), "HKDF", false, [ "deriveBits" ]);
    const salt = await sha256(utf8Bytes(`${saltLabel}\n${transcript}`));
    return new Uint8Array(await subtle().deriveBits({
      name: "HKDF",
      hash: "SHA-256",
      salt: arrayBuffer(salt),
      info: arrayBuffer(utf8Bytes(`${infoLabel}\n${transcript}`))
    }, material, 256));
  }

  const deriveHandshakeKey = (sharedSecret, context) => {
    const transcript = handshakeTranscript(context);
    return hkdf(sharedSecret, "aiask-v1-handshake-salt", "aiask-v1-handshake-key", transcript);
  };

  async function deriveTrafficKeys(sharedSecret, context) {
    const transcript = trafficTranscript(context);
    const [c2sKey, s2cKey] = await Promise.all([ hkdf(sharedSecret, "aiask-v1-traffic-salt", "aiask-v1-c2s-key", transcript), hkdf(sharedSecret, "aiask-v1-traffic-salt", "aiask-v1-s2c-key", transcript) ]);
    return {
      c2sKey: c2sKey,
      s2cKey: s2cKey
    };
  }

  const importAesKey = (raw, usage) => subtle().importKey("raw", arrayBuffer(raw), {
    name: "AES-GCM",
    length: 256
  }, false, usage);

  async function aesGcmEncrypt(rawKey, iv, plaintext, aad) {
    if (rawKey.length !== 32 || iv.length !== 12) throw new Error("invalid AES-GCM key or IV");
    const key = await importAesKey(rawKey, [ "encrypt" ]);
    return new Uint8Array(await subtle().encrypt({
      name: "AES-GCM",
      iv: arrayBuffer(iv),
      additionalData: arrayBuffer(aad),
      tagLength: 128
    }, key, arrayBuffer(plaintext)));
  }

  async function aesGcmDecrypt(rawKey, iv, ciphertext, aad) {
    if (rawKey.length !== 32 || iv.length !== 12) throw new Error("invalid AES-GCM key or IV");
    const key = await importAesKey(rawKey, [ "decrypt" ]);
    return new Uint8Array(await subtle().decrypt({
      name: "AES-GCM",
      iv: arrayBuffer(iv),
      additionalData: arrayBuffer(aad),
      tagLength: 128
    }, key, arrayBuffer(ciphertext)));
  }

  async function verifyServerKeysetSignature(rootPublicKey, keyset) {
    return verifyEcdsaP1363(rootPublicKey, utf8Bytes(serverKeysetSigningInput(unsignedServerKeyset(keyset))), keyset.rootSignature);
  }

  const serverKeysetHash = keyset => sha256Base64Url(utf8Bytes(serverKeysetSigningInput(unsignedServerKeyset(keyset))));

  async function verifyBootstrapChallengeSignature(keyset, challenge) {
    const signingKey = keyset.keys.find(key => key.kid === challenge.signingKid && key.use === "transport-signing");
    if (!signingKey) return false;
    const publicKey = await importEcdsaPublicJwk(signingKey.publicJwk);
    return verifyEcdsaP1363(publicKey, utf8Bytes(bootstrapChallengeSigningInput(unsignedBootstrapChallenge(challenge))), challenge.signature);
  }

  const withoutSignature = pkg => {
    const {signature: _signature, ...unsigned} = pkg;
    return unsigned;
  };

  const withoutContentHashAndSignature = pkg => {
    const {contentHash: _contentHash, signature: _signature, ...hashable} = pkg;
    return hashable;
  };

  const canonicalRulePackageContentHashInput = pkg => canonicalize(withoutContentHashAndSignature(pkg));

  const canonicalRulePackageSignatureInput = pkg => canonicalize(withoutSignature(pkg));

  const computeVerifiedRulePackageContentHash = pkg => sha256Base64Url(utf8Bytes(canonicalRulePackageContentHashInput(pkg)));

  function parseVersion$1(value) {
    const withoutBuild = value.split("+", 1)[0] ?? value;
    const prereleaseIndex = withoutBuild.indexOf("-");
    const coreText = prereleaseIndex === -1 ? withoutBuild : withoutBuild.slice(0, prereleaseIndex);
    const prereleaseText = prereleaseIndex === -1 ? void 0 : withoutBuild.slice(prereleaseIndex + 1);
    const parts = coreText.split(".").map(Number);
    if (parts.length !== 3 || parts.some(part => !Number.isSafeInteger(part) || part < 0)) throw new Error(`invalid version: ${value}`);
    return {
      core: parts,
      prerelease: prereleaseText ? prereleaseText.split(".").map(part => /^\d+$/u.test(part) ? Number(part) : part) : []
    };
  }

  function compareRuleVersions$1(leftValue, rightValue) {
    const left = parseVersion$1(leftValue);
    const right = parseVersion$1(rightValue);
    for (let index = 0; index < 3; index += 1) {
      const difference = left.core[index] - right.core[index];
      if (difference !== 0) return Math.sign(difference);
    }
    if (left.prerelease.length === 0 && right.prerelease.length === 0) return 0;
    if (left.prerelease.length === 0) return 1;
    if (right.prerelease.length === 0) return -1;
    const length = Math.max(left.prerelease.length, right.prerelease.length);
    for (let index = 0; index < length; index += 1) {
      const leftPart = left.prerelease[index];
      const rightPart = right.prerelease[index];
      if (leftPart == null) return -1;
      if (rightPart == null) return 1;
      if (leftPart === rightPart) continue;
      if (typeof leftPart === "number" && typeof rightPart === "string") return -1;
      if (typeof leftPart === "string" && typeof rightPart === "number") return 1;
      return leftPart < rightPart ? -1 : 1;
    }
    return 0;
  }

  const IMPORT_BRIDGE_ORIGIN = "https://www.aiask.site";

  const IMPORT_BRIDGE_VERSION = 1;

  const IMPORT_BRIDGE_CHANNEL = "aiask-import";

  const IMPORT_BRIDGE_REPLY_CHANNEL = "aiask-import-reply";

  const IMPORT_BRIDGE_ERROR_REASONS = [ "invalid-snapshot", "import-failed" ];

  const ImportBridgeErrorReasonSchema = enumType(IMPORT_BRIDGE_ERROR_REASONS);

  const requestId = stringType().uuid();

  const snapshot = stringType().min(1);

  const count = numberType().int().min(0);

  const requestBase = {
    channel: literalType(IMPORT_BRIDGE_CHANNEL),
    v: literalType(IMPORT_BRIDGE_VERSION),
    requestId: requestId
  };

  const ImportBridgeRequestSchema = discriminatedUnionType("kind", [ objectType({
    ...requestBase,
    kind: literalType("ping")
  }).strict(), objectType({
    ...requestBase,
    kind: literalType("preview"),
    snapshot: snapshot
  }).strict(), objectType({
    ...requestBase,
    kind: literalType("commit"),
    snapshot: snapshot
  }).strict() ]);

  const replyBase = {
    channel: literalType(IMPORT_BRIDGE_REPLY_CHANNEL),
    v: literalType(IMPORT_BRIDGE_VERSION),
    requestId: requestId
  };

  discriminatedUnionType("kind", [ objectType({
    ...replyBase,
    kind: literalType("pong"),
    scriptVersion: stringType().min(1)
  }).strict(), objectType({
    ...replyBase,
    kind: literalType("preview"),
    fileCount: count,
    added: count,
    replaced: count,
    skipped: count
  }).strict(), objectType({
    ...replyBase,
    kind: literalType("commit"),
    added: count,
    replaced: count,
    skipped: count
  }).strict(), objectType({
    ...replyBase,
    kind: literalType("error"),
    reason: ImportBridgeErrorReasonSchema
  }).strict() ]);

  function parseImportBridgeRequest(data) {
    const parsed = ImportBridgeRequestSchema.safeParse(data);
    return parsed.success ? parsed.data : null;
  }

  function importBridgePreviewReply(requestId2, counts) {
    return {
      channel: IMPORT_BRIDGE_REPLY_CHANNEL,
      v: IMPORT_BRIDGE_VERSION,
      requestId: requestId2,
      kind: "preview",
      fileCount: counts.fileCount,
      added: counts.added,
      replaced: counts.replaced,
      skipped: counts.skipped
    };
  }

  function importBridgeCommitReply(requestId2, counts) {
    return {
      channel: IMPORT_BRIDGE_REPLY_CHANNEL,
      v: IMPORT_BRIDGE_VERSION,
      requestId: requestId2,
      kind: "commit",
      added: counts.added,
      replaced: counts.replaced,
      skipped: counts.skipped
    };
  }

  const BUSY = Object.freeze({
    code: AiAskCode.Busy,
    found: false,
    result: null
  });

  const DEFAULT_TIMEOUT_MS$3 = 8e3;

  class RelayClient {
    constructor(transport, baseUrl, timeoutMs = DEFAULT_TIMEOUT_MS$3) {
      this.transport = transport;
      this.baseUrl = baseUrl;
      this.timeoutMs = timeoutMs;
    }
    async search(req, idempotencyKey) {
      let timer;
      try {
        const deadline = new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error("deadline")), this.timeoutMs);
        });
        const res = await Promise.race([ this.transport.send({
          url: this.baseUrl + SEARCH_PATH,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Idempotency-Key": idempotencyKey
          },
          body: JSON.stringify(req),
          timeoutMs: this.timeoutMs
        }), deadline ]);
        if (res.status < 200 || res.status >= 300) return BUSY;
        const parsed = SearchUnitResponseSchema.safeParse(JSON.parse(res.body));
        return parsed.success ? parsed.data : BUSY;
      } catch {
        return BUSY;
      } finally {
        clearTimeout(timer);
      }
    }
  }

  class RuleRuntime {
    constructor(adapters) {
      this.adapters = adapters;
    }
    resolve(ctx) {
      return this.adapters.find(a => a.match(ctx)) ?? null;
    }
  }

  function collapseWs(s) {
    return s.replace(/\s+/g, " ").trim();
  }

  function stripOptionPrefix(text) {
    return text.replace(/^\s*(?:[\uff08(][A-Za-z0-9]{1,2}[)\uff09]|[A-Za-z0-9]{1,2}\s*[.\u3001\uff0e,:\uff1a])\s*/, "").trim();
  }

  function normalizeForMatch(text) {
    return normalizeQuestionContentForMatch(text).replace(/\s+/g, "").replace(/^[A-Za-z][.\u3001\uff0e,]/, "");
  }

  const TRUE_TOK = new Set([ "\u5bf9", "\u6b63\u786e", "\u221a", "\u2713", "\u2714", "\u2611", "\u662f", "t", "true", "y", "yes", "1" ]);

  const FALSE_TOK = new Set([ "\u9519", "\u9519\u8bef", "\xd7", "\u2717", "\u2718", "\u2612", "x", "\u5426", "f", "false", "n", "no", "0" ]);

  function normalizeTruth(s) {
    const t = s.replace(/\s/g, "").toLowerCase();
    if (!t) return null;
    if (TRUE_TOK.has(t)) return "\u5bf9";
    if (FALSE_TOK.has(t)) return "\u9519";
    return null;
  }

  const LEAF_TYPE_ALIASES = {
    single: "single",
    single_choice: "single",
    single_selection: "single",
    "\u5355\u9009": "single",
    "\u5355\u9009\u9898": "single",
    multiple: "multiple",
    multiple_choice: "multiple",
    multiple_selection: "multiple",
    "\u591a\u9009": "multiple",
    "\u591a\u9009\u9898": "multiple",
    judge: "judge",
    judgement: "judge",
    judgment: "judge",
    true_false: "judge",
    true_or_false: "judge",
    "\u5224\u65ad": "judge",
    "\u5224\u65ad\u9898": "judge",
    fill: "fill",
    completion: "fill",
    blank: "fill",
    fill_in_blank: "fill",
    "\u586b\u7a7a": "fill",
    "\u586b\u7a7a\u9898": "fill",
    short_answer: "short_answer",
    subjective: "short_answer",
    essay: "short_answer",
    "\u7b80\u7b54": "short_answer",
    "\u7b80\u7b54\u9898": "short_answer"
  };

  function normalizeLeafQuestionType(value) {
    if (!(value == null ? void 0 : value.trim())) return null;
    return LEAF_TYPE_ALIASES[value.trim().toLocaleLowerCase().replace(/[\s-]+/gu, "_")] ?? null;
  }

  class DomContentError extends Error {
    constructor(code, message) {
      super(message);
      this.code = code;
      this.name = "DomContentError";
    }
  }

  function serializeDomQuestionContent(element, options = {}) {
    const stripSelectors = options.stripSelectors ?? [];
    const maxNodes = options.maxNodes ?? 5e3;
    if (!Number.isInteger(maxNodes) || maxNodes <= 0 || maxNodes > 5e4) throw new DomContentError("budget_exceeded", "invalid DOM content node limit");
    for (const selector of stripSelectors) {
      try {
        element.matches(selector);
      } catch (error) {
        throw new DomContentError("invalid_selector", error instanceof Error ? error.message : "invalid strip selector");
      }
    }
    const out = [];
    let visited = 0;
    const walk = node => {
      var _a2, _b;
      if ((_a2 = options.signal) == null ? void 0 : _a2.aborted) throw new DomContentError("cancelled", "DOM content capture cancelled");
      visited += 1;
      if (visited > maxNodes) throw new DomContentError("budget_exceeded", "DOM content node budget exceeded");
      if (node.nodeType === node.TEXT_NODE) {
        out.push(serializeQuestionText(node.textContent ?? ""));
        return;
      }
      const document2 = node.ownerDocument;
      const view = document2 == null ? void 0 : document2.defaultView;
      if (!view || !(node instanceof view.Element)) return;
      if (node !== element && stripSelectors.some(selector => node.matches(selector))) return;
      const tag = node.tagName.toLowerCase();
      if (tag === "script" || tag === "style" || tag === "noscript") return;
      if (tag === "img") {
        const raw = (_b = node.getAttribute("src")) == null ? void 0 : _b.trim();
        if (!raw) return;
        try {
          const url = new URL(raw, document2.baseURI);
          if (url.protocol === "http:" || url.protocol === "https:") out.push(serializeImageToken(url.href));
        } catch {
          return;
        }
        return;
      }
      for (const child of node.childNodes) walk(child);
    };
    walk(element);
    return collapseWs(out.join(""));
  }

  function waitUntil(cond, opts) {
    const interval = opts.interval ?? 100;
    return new Promise(resolve => {
      var _a2, _b;
      if (cond()) return resolve(true);
      if ((_a2 = opts.signal) == null ? void 0 : _a2.aborted) return resolve(false);
      let waited = 0;
      const onAbort = () => {
        cleanup();
        resolve(false);
      };
      const timer = setInterval(() => {
        var _a3;
        if (cond()) {
          cleanup();
          resolve(true);
          return;
        }
        waited += interval;
        if (((_a3 = opts.signal) == null ? void 0 : _a3.aborted) || waited >= opts.timeout) {
          cleanup();
          resolve(false);
        }
      }, interval);
      (_b = opts.signal) == null ? void 0 : _b.addEventListener("abort", onAbort, {
        once: true
      });
      function cleanup() {
        var _a3;
        clearInterval(timer);
        (_a3 = opts.signal) == null ? void 0 : _a3.removeEventListener("abort", onAbort);
      }
    });
  }

  const issuedCapabilities = new WeakMap;

  function createSafetyCapability() {
    const capability = Object.freeze({
      toJSON() {
        throw new Error("safety capability cannot be serialized");
      }
    });
    return capability;
  }

  function operationMatches$1(left, right) {
    if (left.kind !== right.kind) return false;
    if (left.kind === "choose" && right.kind === "choose") return left.optionId === right.optionId;
    if (left.kind === "write" && right.kind === "write") return left.slotId === right.slotId && left.value === right.value;
    return left.kind === "pair" && right.kind === "pair" && left.leftId === right.leftId && left.rightId === right.rightId;
  }

  function assertSafetyCapability(capability) {
    if (typeof capability !== "object" && typeof capability !== "function" || capability === null || !issuedCapabilities.has(capability)) {
      throw new Error("invalid safety capability");
    }
  }

  function safetyPlanForCapability(capability) {
    assertSafetyCapability(capability);
    return issuedCapabilities.get(capability);
  }

  function assertSafetyOperation(capability, operation) {
    const plan = safetyPlanForCapability(capability);
    if (!plan.operations.some(candidate => operationMatches$1(candidate, operation))) throw new Error("operation is not allowed by safety capability");
  }

  function hasDuplicates(values) {
    return new Set(values).size !== values.length;
  }

  function validateBinding(unit, binding) {
    if (binding.path !== unit.unitPath) {
      return {
        kind: "unsafe",
        reason: "missing-binding"
      };
    }
    if (!binding.connected) return {
      kind: "unsafe",
      reason: "disconnected"
    };
    if (binding.capturedFingerprint !== unit.sourceNodeHash || binding.currentFingerprint !== binding.capturedFingerprint) {
      return {
        kind: "unsafe",
        reason: "stale"
      };
    }
    if (hasDuplicates(binding.optionIds) || hasDuplicates(binding.slotIds) || hasDuplicates(binding.leftIds) || hasDuplicates(binding.rightIds)) {
      return {
        kind: "unsafe",
        reason: "ambiguous-binding"
      };
    }
    return null;
  }

  function allPresent(expected, actual) {
    const available = new Set(actual);
    return expected.every(id => available.has(id));
  }

  function buildFillPlan(node, unit, answer, binding) {
    const invalidBinding = validateBinding(unit, binding);
    if (invalidBinding) return invalidBinding;
    let operations;
    let atomic = true;
    if (answer.kind === "choice") {
      if (node.kind !== "leaf" || unit.answerShape.kind !== "choice" || answer.optionIds.length === 0 || hasDuplicates(answer.optionIds) || !allPresent(answer.optionIds, binding.optionIds)) {
        return {
          kind: "unsafe",
          reason: "missing-binding"
        };
      }
      if (answer.optionIds.length < unit.answerShape.min || answer.optionIds.length > unit.answerShape.max) {
        return {
          kind: "unsafe",
          reason: "shape-mismatch"
        };
      }
      operations = answer.optionIds.map(optionId => ({
        kind: "choose",
        optionId: optionId
      }));
    } else if (answer.kind === "slots") {
      if (node.kind !== "leaf" || unit.answerShape.kind !== "slots" || answer.slots.length === 0 || hasDuplicates(answer.slots.map(slot => slot.slotId)) || !allPresent(answer.slots.map(slot => slot.slotId), binding.slotIds)) {
        return {
          kind: "unsafe",
          reason: "missing-binding"
        };
      }
      if (!allPresent(unit.answerShape.slotIds, answer.slots.map(slot => slot.slotId)) && node.fillPolicy === "atomic") {
        return {
          kind: "unsafe",
          reason: "shape-mismatch"
        };
      }
      if (!allPresent(answer.slots.map(slot => slot.slotId), unit.answerShape.slotIds)) {
        return {
          kind: "unsafe",
          reason: "shape-mismatch"
        };
      }
      const writes = answer.slots.map(slot => ({
        kind: "write",
        slotId: slot.slotId,
        value: slot.values.find(value => value.trim()) ?? ""
      }));
      if (writes.some(write => !write.value)) {
        return {
          kind: "unsafe",
          reason: "shape-mismatch"
        };
      }
      operations = writes;
      atomic = node.fillPolicy === "atomic";
    } else {
      if (node.kind !== "matching" || unit.answerShape.kind !== "matching-pair" || unit.answerShape.leftId !== answer.leftId || !binding.leftIds.includes(answer.leftId) || !binding.rightIds.includes(answer.rightId) || !unit.answerShape.rightIds.includes(answer.rightId)) {
        return {
          kind: "unsafe",
          reason: "missing-binding"
        };
      }
      operations = [ {
        kind: "pair",
        leftId: answer.leftId,
        rightId: answer.rightId
      } ];
      atomic = node.fillPolicy === "atomic";
    }
    const safetyCapability = createSafetyCapability();
    const plan = Object.freeze({
      path: unit.unitPath,
      atomic: atomic,
      operations: Object.freeze(operations.map(operation => Object.freeze({
        ...operation
      }))),
      fingerprint: binding.currentFingerprint,
      safetyCapability: safetyCapability
    });
    issuedCapabilities.set(safetyCapability, plan);
    return {
      kind: "safe",
      plan: plan
    };
  }

  const failed = path => ({
    complete: false,
    plans: [],
    unsafePaths: [ path ]
  });

  function buildTreeFillPlans(root, answerTree, bindings) {
    const units = flattenQuestionTree(root);
    const unitByPath = new Map(units.map(unit => [ unit.unitPath, unit ]));
    const visitLeaf = (node, answer) => {
      if (answer.kind !== "leaf" || answer.path !== node.path || answer.status !== "hit" || !answer.answer) {
        return failed(node.path);
      }
      const unit = unitByPath.get(node.path);
      const binding = bindings.get(node.path);
      if (!unit || !binding) return failed(node.path);
      const result2 = buildFillPlan(node, unit, answer.answer, binding);
      return result2.kind === "safe" ? {
        complete: true,
        plans: [ result2.plan ],
        unsafePaths: []
      } : failed(node.path);
    };
    const visitMatching = (node, answer) => {
      if (answer.kind !== "matching" || answer.path !== node.path) {
        return failed(node.path);
      }
      const rightIds = [];
      const plans = [];
      const unsafePaths = [];
      for (const left of node.left) {
        const pair = answer.pairs.find(candidate => candidate.leftId === left.id);
        const unit = units.find(candidate => candidate.answerShape.kind === "matching-pair" && candidate.answerShape.leftId === left.id);
        const pairPath = (unit == null ? void 0 : unit.unitPath) ?? `${node.path}/pairs/${left.id}`;
        const binding = unit ? bindings.get(unit.unitPath) : void 0;
        if (!pair || pair.status !== "hit" || !pair.rightId || !pair.displayValue || !unit || !binding) {
          unsafePaths.push(pairPath);
          continue;
        }
        rightIds.push(pair.rightId);
        const payload = {
          kind: "matching-pair",
          leftId: left.id,
          rightId: pair.rightId,
          displayValue: pair.displayValue
        };
        const result2 = buildFillPlan(node, unit, payload, binding);
        if (result2.kind === "safe") plans.push(result2.plan); else unsafePaths.push(pairPath);
      }
      if (node.cardinality === "one-to-one" && new Set(rightIds).size !== rightIds.length) {
        return failed(node.path);
      }
      const complete = unsafePaths.length === 0 && plans.length === node.left.length;
      if (!complete && node.fillPolicy === "atomic") return failed(node.path);
      return {
        complete: complete,
        plans: plans,
        unsafePaths: unsafePaths
      };
    };
    const visit = (node, answer) => {
      if (node.kind === "leaf") return visitLeaf(node, answer);
      if (node.kind === "matching") return visitMatching(node, answer);
      if (answer.kind !== "composite" || answer.path !== node.path) {
        return failed(node.path);
      }
      const childAnswers = new Map(answer.children.map(child => [ child.path, child ]));
      const childResults = node.children.map(child => {
        const childAnswer = childAnswers.get(child.path);
        return childAnswer ? visit(child, childAnswer) : failed(child.path);
      });
      const complete = childResults.every(result2 => result2.complete);
      if (!complete && node.fillPolicy === "atomic") return failed(node.path);
      return {
        complete: complete,
        plans: childResults.flatMap(result2 => result2.plans),
        unsafePaths: childResults.flatMap(result2 => result2.unsafePaths)
      };
    };
    const result = visit(root, answerTree);
    return {
      blocked: result.plans.length === 0 && result.unsafePaths.length > 0 && (root.kind === "composite" ? root.fillPolicy === "atomic" : root.kind === "matching" ? root.fillPolicy === "atomic" : false),
      plans: result.plans,
      unsafePaths: result.unsafePaths
    };
  }

  const MAX_HARD_BINDINGS$1 = 5e3;

  const FINGERPRINT_PATTERN = /^[a-f0-9]{64}$/u;

  class RuleBindingRegistryError extends Error {
    constructor(code, message) {
      super(message);
      this.code = code;
      this.name = "RuleBindingRegistryError";
    }
  }

  function validId$1(value) {
    return value.length > 0 && value.length <= 256;
  }

  function targetKey(target) {
    if (target.kind === "choose") return `choose:${target.optionId}`;
    if (target.kind === "write") return `write:${target.slotId}`;
    return `pair:${target.leftId}:${target.rightId}`;
  }

  function operationMatches(target, operation) {
    if (target.kind !== operation.kind) return false;
    if (target.kind === "choose" && operation.kind === "choose") return target.optionId === operation.optionId;
    if (target.kind === "write" && operation.kind === "write") return target.slotId === operation.slotId;
    return target.kind === "pair" && operation.kind === "pair" && target.leftId === operation.leftId && target.rightId === operation.rightId;
  }

  function unique(values) {
    return [ ...new Set(values) ];
  }

  class RuleBindingRegistry {
    constructor(options) {
      __publicField(this, _a, "RuleBindingRegistry");
      __publicField(this, "entriesByPath", new Map);
      __publicField(this, "maxBindings");
      __publicField(this, "sealed", false);
      __publicField(this, "disposed", false);
      if (!Number.isInteger(options.maxBindings) || options.maxBindings <= 0 || options.maxBindings > MAX_HARD_BINDINGS$1) throw new RuleBindingRegistryError("invalid_options", "invalid binding registry limit");
      this.maxBindings = options.maxBindings;
    }
    get size() {
      return this.disposed ? 0 : this.entriesByPath.size;
    }
    register(registration) {
      if (this.sealed || this.disposed) throw new RuleBindingRegistryError("sealed", "binding registry is sealed");
      if (this.entriesByPath.has(registration.path)) throw new RuleBindingRegistryError("duplicate_path", `duplicate binding path: ${registration.path}`);
      if (this.entriesByPath.size >= this.maxBindings) throw new RuleBindingRegistryError("binding_limit", "binding registry limit exceeded");
      if (!registration.path.startsWith("/") || registration.path.length > 1024 || !FINGERPRINT_PATTERN.test(registration.capturedFingerprint) || typeof registration.readCurrentFingerprint !== "function" || !Array.isArray(registration.targets) || registration.targets.length === 0) throw new RuleBindingRegistryError("invalid_registration", "invalid binding registration");
      const targetKeys = new Set;
      for (const target of registration.targets) {
        const ids = target.kind === "choose" ? [ target.optionId ] : target.kind === "write" ? [ target.slotId ] : [ target.leftId, target.rightId ];
        if (ids.some(id => !validId$1(id)) || typeof target.isConnected !== "function" || typeof target.apply !== "function" || typeof target.verify !== "function") throw new RuleBindingRegistryError("invalid_registration", "invalid binding target");
        const key = targetKey(target);
        if (targetKeys.has(key)) throw new RuleBindingRegistryError("duplicate_target", `duplicate binding target: ${key}`);
        targetKeys.add(key);
      }
      this.entriesByPath.set(registration.path, {
        path: registration.path,
        capturedFingerprint: registration.capturedFingerprint,
        readCurrentFingerprint: registration.readCurrentFingerprint,
        targets: Object.freeze([ ...registration.targets ])
      });
    }
    seal() {
      this.sealed = true;
    }
    dispose() {
      this.disposed = true;
      this.sealed = true;
      this.entriesByPath.clear();
    }
    get(path) {
      if (this.disposed) return void 0;
      const entry = this.entriesByPath.get(path);
      if (!entry) return void 0;
      let currentFingerprint = "";
      let connected = true;
      try {
        currentFingerprint = entry.readCurrentFingerprint();
        if (!FINGERPRINT_PATTERN.test(currentFingerprint)) {
          currentFingerprint = "";
          connected = false;
        }
      } catch {
        currentFingerprint = "";
        connected = false;
      }
      if (connected) {
        try {
          connected = entry.targets.every(target => target.isConnected());
        } catch {
          connected = false;
        }
      }
      return {
        path: entry.path,
        capturedFingerprint: entry.capturedFingerprint,
        currentFingerprint: currentFingerprint,
        connected: connected,
        optionIds: entry.targets.filter(target => target.kind === "choose").map(target => target.optionId),
        slotIds: entry.targets.filter(target => target.kind === "write").map(target => target.slotId),
        leftIds: unique(entry.targets.filter(target => target.kind === "pair").map(target => target.leftId)),
        rightIds: unique(entry.targets.filter(target => target.kind === "pair").map(target => target.rightId))
      };
    }
    has(path) {
      return !this.disposed && this.entriesByPath.has(path);
    }
    targetForOperation(path, operation) {
      var _a2;
      if (this.disposed) return null;
      return ((_a2 = this.entriesByPath.get(path)) == null ? void 0 : _a2.targets.find(target => operationMatches(target, operation))) ?? null;
    }
    entries() {
      return new Map([ ...this.entriesByPath.keys() ].flatMap(path => {
        const binding = this.get(path);
        return binding ? [ [ path, binding ] ] : [];
      })).entries();
    }
    keys() {
      return new Map(this.entries()).keys();
    }
    values() {
      return new Map(this.entries()).values();
    }
    forEach(callbackfn, thisArg) {
      for (const [key, value] of this.entries()) callbackfn.call(thisArg, value, key, this);
    }
    [(_a = Symbol.toStringTag, Symbol.iterator)]() {
      return this.entries();
    }
  }

  const CJK_START = 19968;

  const CJK_END = 40870;

  const CJK_COUNT = CJK_END - CJK_START;

  const cxFontMd5 = value => md5Exports.md5(value);

  const asRecord = value => value !== null && typeof value === "object" && !Array.isArray(value) ? value : null;

  function cjkCodePointsFromCmap(font) {
    var _a2;
    const cmap = asRecord((_a2 = asRecord(font)) == null ? void 0 : _a2.cmap);
    if (!cmap || !Array.isArray(cmap.tables)) return null;
    const tableIndex = [ cmap.p0e4, cmap.p3e1, cmap.p1e0 ].find(value => typeof value === "number" && Number.isInteger(value) && value >= 0);
    if (typeof tableIndex !== "number") return null;
    const table = asRecord(cmap.tables[tableIndex]);
    if (!table || typeof table.format !== "number") return null;
    const codes = new Set;
    let inspected = 0;
    if (table.format === 0) {
      if (!Array.isArray(table.map)) return null;
      const upper = Math.min(CJK_END, table.map.length);
      for (let code = CJK_START; code < upper; code++) if (table.map[code]) codes.add(code);
    } else if (table.format === 4) {
      if (!Array.isArray(table.startCount) || !Array.isArray(table.endCount) || !Array.isArray(table.idDelta) || !Array.isArray(table.idRangeOffset) || !Array.isArray(table.glyphIdArray)) return null;
      const rangeCount = Math.min(table.startCount.length, table.endCount.length);
      for (let index = 0; index < rangeCount; index++) {
        const start = table.startCount[index];
        const end = table.endCount[index];
        const delta = table.idDelta[index];
        const rangeOffset = table.idRangeOffset[index];
        if (!Number.isInteger(start) || !Number.isInteger(end) || !Number.isInteger(delta) || !Number.isInteger(rangeOffset)) return null;
        const lower = Math.max(CJK_START, start);
        const upper = Math.min(CJK_END - 1, end);
        for (let code = lower; code <= upper; code++) {
          if (++inspected > CJK_COUNT) return [];
          const glyph = rangeOffset === 0 ? code + delta & 65535 : table.glyphIdArray[code - start + (rangeOffset >> 1) - (table.idRangeOffset.length - index)];
          if (glyph) codes.add(code);
        }
      }
    } else if (table.format === 6) {
      if (typeof table.firstCode !== "number" || !Number.isInteger(table.firstCode) || !Array.isArray(table.glyphIdArray)) return null;
      const firstIndex = Math.max(0, CJK_START - table.firstCode);
      const endIndex = Math.min(table.glyphIdArray.length, CJK_END - table.firstCode);
      for (let index = firstIndex; index < endIndex; index++) {
        const code = table.firstCode + index;
        if (table.glyphIdArray[index]) codes.add(code);
      }
    } else if (table.format === 12) {
      if (!Array.isArray(table.groups)) return null;
      for (const group of table.groups) {
        if (!Array.isArray(group) || !Number.isInteger(group[0]) || !Number.isInteger(group[1]) || !Number.isInteger(group[2])) return null;
        const start = group[0];
        const lower = Math.max(CJK_START, start);
        const upper = Math.min(CJK_END - 1, group[1]);
        for (let code = lower; code <= upper; code++) {
          if (++inspected > CJK_COUNT) return [];
          if (group[2] + code - start !== 0) codes.add(code);
        }
      }
    } else {
      return null;
    }
    return [ ...codes ].sort((left, right) => left - right);
  }

  function base64ToUint8Array(base64) {
    const bin = atob(base64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return arr;
  }

  function extractCxFontBase64(styleText) {
    const m = styleText.match(/base64,([\w\W]+?)'/);
    return m ? m[1] : null;
  }

  function buildCharMap(fontData, table, typr) {
    const font = typr.parse(fontData);
    const map = {};
    const subsetCodes = cjkCodePointsFromCmap(font);
    const codes = subsetCodes ?? Array.from({
      length: CJK_COUNT
    }, (_, index) => CJK_START + index);
    for (const i of codes) {
      const g = typr.U.codeToGlyph(font, i);
      if (!g) continue;
      const path = typr.U.glyphToPath(font, g);
      const real = table[cxFontMd5(JSON.stringify(path)).slice(24)];
      if (typeof real === "number") map[i] = real;
    }
    return map;
  }

  function applyCharMap(text, map) {
    return [ ...text ].map(ch => {
      const real = map[ch.charCodeAt(0)];
      return real == null ? ch : String.fromCharCode(real);
    }).join("");
  }

  const LABEL_PATTERN = /^\s*(\u6b63\u786e\u7b54\u6848|\u6211\u7684\u7b54\u6848|\u7b54\u6848)\s*[:\uff1a]?\s*/;

  const LETTER_ANSWER_PATTERN = /^[A-Z]([\s,\uff0c\u3001;\uff1b]*[A-Z])*$/;

  const MAX_LETTERS = 26;

  const SLOT_INDEX_PATTERN = /^\s*[(\uff08]\s*\d+\s*[)\uff09]\s*/;

  function mapChaoxingHarvestedAnswer(text, options, slotValues = []) {
    if (slotValues.length > 0) {
      const slots = slotValues.map(value => value.replace(SLOT_INDEX_PATTERN, "").replace(/\s+/g, " ").trim());
      return slots.every(Boolean) ? slots : [];
    }
    const stripped = text.replace(LABEL_PATTERN, "").replace(/\s+/g, " ").trim();
    if (!stripped) return [];
    if (options.length === 0) return [ stripped ];
    const compact = stripped.replace(/[\s,\uff0c\u3001;\uff1b]/g, "");
    if (!LETTER_ANSWER_PATTERN.test(stripped) || compact.length > MAX_LETTERS) return [ stripped ];
    const values = [];
    for (const letter2 of compact) {
      const index = letter2.charCodeAt(0) - 65;
      const option = options[index];
      if (option === void 0) return [];
      values.push(option);
    }
    return values;
  }

  function stripTitle(title) {
    return collapseWs(title.replace(/^\s*\d+\s*[.\u3001\uff0e,]?\s*/, "").replace(/^[(\uff08][^()\uff08\uff09]*?\u9898[^()\uff08\uff09]*?[)\uff09]\s*/, "").replace(/\u3010.+?\u3011/, ""));
  }

  function compatibleType(unit, itemType) {
    if (!(itemType == null ? void 0 : itemType.trim())) return true;
    const normalized = normalizeLeafQuestionType(itemType);
    if (!normalized) return false;
    if (normalized === unit.queryType) return true;
    return unit.answerShape.kind === "slots" && (normalized === "fill" || normalized === "short_answer");
  }

  function matchUniqueOption(value, options, queryType) {
    var _a2, _b;
    if (queryType === "judge") {
      const wantedTruth = normalizeTruth(value);
      if (wantedTruth) {
        const truthMatches = options.filter(option => normalizeTruth(option.content) === wantedTruth);
        if (truthMatches.length === 1) return {
          kind: "matched",
          option: truthMatches[0]
        };
        if (truthMatches.length > 1) return {
          kind: "ambiguous"
        };
      }
    }
    const wanted = normalizeForMatch(value);
    if (!wanted) return {
      kind: "missing"
    };
    const normalized = options.map(option => ({
      option: option,
      value: normalizeForMatch(option.content)
    }));
    const exact = normalized.filter(option => option.value === wanted);
    if (exact.length === 1) return {
      kind: "matched",
      option: (_a2 = exact[0]) == null ? void 0 : _a2.option
    };
    if (exact.length > 1) return {
      kind: "ambiguous"
    };
    const contains = normalized.filter(option => option.value.includes(wanted));
    if (contains.length === 1) return {
      kind: "matched",
      option: (_b = contains[0]) == null ? void 0 : _b.option
    };
    return contains.length > 1 ? {
      kind: "ambiguous"
    } : {
      kind: "missing"
    };
  }

  function mapOptions(values, unit) {
    const matches = [];
    for (const value of values) {
      const match = matchUniqueOption(value, unit.options, unit.queryType);
      if (match.kind !== "matched") return match;
      matches.push(match.option);
    }
    return {
      kind: "matched",
      options: matches
    };
  }

  function answeredOptionIndexes(unit, answer) {
    if (!answer) return [];
    if (answer.kind === "choice") {
      const wanted = new Set(answer.optionIds);
      return unit.options.flatMap((option, index) => wanted.has(option.id) ? [ index ] : []);
    }
    if (answer.kind === "matching-pair") {
      return unit.options.flatMap((option, index) => option.id === answer.rightId ? [ index ] : []);
    }
    if (unit.answerShape.kind !== "slots" || unit.options.length === 0) return [];
    const values = new Set(answer.slots.flatMap(slot => slot.values));
    return unit.options.flatMap((option, index) => values.has(option.content) ? [ index ] : []);
  }

  function buildAnswerPlan(unit, hit) {
    const values = hit.values.map(value => value.trim());
    if (values.length === 0 || values.some(value => !normalizeForMatch(value))) {
      return {
        kind: "unusable",
        reason: "empty"
      };
    }
    if (!compatibleType(unit, hit.itemType)) {
      return {
        kind: "unusable",
        reason: "type-mismatch"
      };
    }
    if (unit.answerShape.kind === "choice") {
      if (values.length < unit.answerShape.min || values.length > unit.answerShape.max || unit.queryType !== "multiple" && values.length !== 1) {
        return {
          kind: "unusable",
          reason: "shape-mismatch"
        };
      }
      const matched = mapOptions(values, unit);
      if (matched.kind === "ambiguous") {
        return {
          kind: "unusable",
          reason: "ambiguous"
        };
      }
      if (matched.kind === "missing") {
        return {
          kind: "unusable",
          reason: "shape-mismatch"
        };
      }
      const optionIds = matched.options.map(option => option.id);
      if (new Set(optionIds).size !== optionIds.length) {
        return {
          kind: "unusable",
          reason: "shape-mismatch"
        };
      }
      return {
        kind: "usable",
        answer: {
          kind: "choice",
          optionIds: optionIds,
          displayValues: matched.options.map(option => option.content)
        }
      };
    }
    if (unit.answerShape.kind === "matching-pair") {
      if (values.length !== 1) {
        return {
          kind: "unusable",
          reason: "shape-mismatch"
        };
      }
      const matched = mapOptions(values, unit);
      if (matched.kind === "ambiguous") {
        return {
          kind: "unusable",
          reason: "ambiguous"
        };
      }
      const option = matched.kind === "matched" ? matched.options[0] : void 0;
      if (!option || !unit.answerShape.rightIds.includes(option.id)) {
        return {
          kind: "unusable",
          reason: "shape-mismatch"
        };
      }
      return {
        kind: "usable",
        answer: {
          kind: "matching-pair",
          leftId: unit.answerShape.leftId,
          rightId: option.id,
          displayValue: option.content
        }
      };
    }
    const slotIds = unit.answerShape.slotIds;
    if (unit.options.length > 0) {
      if (slotIds.length !== 1 || values.length !== 1) {
        return {
          kind: "unusable",
          reason: "shape-mismatch"
        };
      }
      const matched = mapOptions(values, unit);
      if (matched.kind === "ambiguous") {
        return {
          kind: "unusable",
          reason: "ambiguous"
        };
      }
      const option = matched.kind === "matched" ? matched.options[0] : void 0;
      if (!option) return {
        kind: "unusable",
        reason: "shape-mismatch"
      };
      return {
        kind: "usable",
        answer: {
          kind: "slots",
          slots: [ {
            slotId: slotIds[0],
            values: [ option.content ]
          } ]
        }
      };
    }
    if (slotIds.length === 1) {
      return {
        kind: "usable",
        answer: {
          kind: "slots",
          slots: [ {
            slotId: slotIds[0],
            values: values
          } ]
        }
      };
    }
    if (values.length !== slotIds.length) {
      return {
        kind: "unusable",
        reason: "shape-mismatch"
      };
    }
    return {
      kind: "usable",
      answer: {
        kind: "slots",
        slots: slotIds.map((slotId, index) => ({
          slotId: slotId,
          values: [ values[index] ]
        }))
      }
    };
  }

  const displayValues = answer => {
    switch (answer.kind) {
     case "choice":
      return answer.displayValues;

     case "slots":
      return answer.slots.flatMap(slot => slot.values);

     case "matching-pair":
      return [ answer.displayValue ];
    }
  };

  const transportIdempotencyKey = unit => `v2:${semanticContentHash(`${unit.rootHash}\n${unit.unitPath}\n${unit.unitHash}`)}`;

  class AnswerSession {
    constructor(adapter, client, opts = {}, deps = {}, emit = () => {}) {
      __publicField(this, "list", []);
      __publicField(this, "trees", []);
      __publicField(this, "currentInx", 0);
      __publicField(this, "running", false);
      __publicField(this, "lastHarvest", null);
      __publicField(this, "stopFlag", false);
      __publicField(this, "paidBlockReason", null);
      __publicField(this, "opts");
      __publicField(this, "ctx", null);
      this.adapter = adapter;
      this.client = client;
      this.deps = deps;
      this.emit = emit;
      this.opts = {
        autoFill: true,
        delayMs: 1e3,
        freeFirst: true,
        ...opts
      };
    }
    setOptions(opts) {
      this.opts = {
        ...this.opts,
        ...opts
      };
    }
    async loadTrees(ctx, capturedTrees) {
      this.ctx = ctx;
      this.paidBlockReason = null;
      this.trees = capturedTrees.map(captured => ({
        captured: captured,
        answer: null,
        results: new Map,
        filledPaths: new Set
      }));
      this.list = this.trees.flatMap(treeState => flattenQuestionTree(treeState.captured.root).map(unit => {
        const q = {
          type: unit.queryType === "short_answer" ? "fill" : unit.queryType,
          stem: unit.effectiveStem,
          options: unit.options.map(option => option.content)
        };
        return {
          q: q,
          status: "pending",
          answer: [],
          answerPlan: null,
          filled: false,
          charged: false,
          aiGenerated: false,
          free: false,
          root: treeState.captured.root,
          unit: unit,
          binding: treeState.captured.bindings.get(unit.unitPath),
          capturedTree: treeState.captured
        };
      }));
      this.currentInx = 0;
      this.lastHarvest = this.persistHarvested();
      return this.list.length;
    }
    isStale() {
      var _a2;
      let total = 0;
      let disconnected = 0;
      for (const item of this.list) {
        if (!item.capturedTree || !item.unit) continue;
        total += 1;
        if (!((_a2 = item.capturedTree.bindings.get(item.unit.unitPath)) == null ? void 0 : _a2.connected)) disconnected += 1;
      }
      return total > 0 && disconnected === total;
    }
    adoptResults(previous) {
      if (previous.length === 0 || previous.length !== this.list.length) return false;
      for (const [index, item] of this.list.entries()) {
        const source = previous[index];
        if (!item.unit || !(source == null ? void 0 : source.unit) || source.unit.unitPath !== item.unit.unitPath || source.unit.unitHash !== item.unit.unitHash) return false;
      }
      for (const [index, item] of this.list.entries()) {
        const source = previous[index];
        if (!source || source.status === "pending") continue;
        item.status = source.status;
        item.answer = source.answer;
        item.answerPlan = source.answerPlan;
        item.filled = source.filled;
        item.charged = source.charged;
        item.free = source.free;
        item.aiGenerated = source.aiGenerated;
        item.unsafeReason = source.unsafeReason;
        if (source.answerNode) this.recordResult(item, source.answerNode);
      }
      return true;
    }
    persistHarvested() {
      var _a2;
      const store = this.deps.localStore;
      if (!this.adapter.takeHarvested) return null;
      const harvested = this.adapter.takeHarvested();
      if (!store) return null;
      let persisted = 0;
      const items = [];
      for (const entry of harvested) {
        let accepted = false;
        try {
          const meta = {
            ...entry.stem ? {
              stem: entry.stem
            } : {},
            ...entry.itemType ? {
              itemType: entry.itemType
            } : {},
            ...((_a2 = entry.options) == null ? void 0 : _a2.length) ? {
              options: entry.options
            } : {}
          };
          accepted = store.write(entry.unitHash, {
            values: entry.values
          }, Object.keys(meta).length > 0 ? meta : void 0);
          if (accepted) persisted += 1;
        } catch {}
        items.push({
          ...entry,
          persisted: accepted
        });
      }
      return {
        harvested: harvested.length,
        persisted: persisted,
        items: items
      };
    }
    load(ctx) {
      return this.adapter.captureTrees(ctx).then(trees => this.loadTrees(ctx, trees));
    }
    recordResult(item, result) {
      item.answerNode = result;
      if (item.capturedTree) {
        const treeState = this.trees.find(candidate => candidate.captured === item.capturedTree);
        if (!treeState) return;
        treeState.results.set(result.path, result);
        treeState.answer = assembleAnswerTree(treeState.captured.root, [ ...treeState.results.values() ]);
        for (const candidate of this.list) {
          if (candidate.capturedTree === treeState.captured) {
            candidate.answerTree = treeState.answer;
            candidate.treeProgress = {
              hit: [ ...treeState.results.values() ].filter(answer => answer.status === "hit").length,
              total: flattenQuestionTree(treeState.captured.root).length,
              status: treeState.answer.status
            };
          }
        }
        return;
      }
      if (item.root) item.answerTree = assembleAnswerTree(item.root, [ result ]);
    }
    recordTerminal(item, status) {
      if (!item.unit) return;
      this.recordResult(item, {
        kind: "leaf",
        path: item.unit.unitPath,
        unitHash: item.unit.unitHash,
        status: status,
        answer: null,
        charged: false
      });
    }
    async applyReadyTreePlans(capturedTree) {
      if (!this.opts.autoFill || !this.ctx) return;
      const treeState = this.trees.find(candidate => candidate.captured === capturedTree);
      if (!(treeState == null ? void 0 : treeState.answer)) return;
      const result = buildTreeFillPlans(capturedTree.root, treeState.answer, capturedTree.bindings);
      if (result.blocked) {
        for (const item of this.list) {
          if (item.capturedTree === capturedTree && item.status === "hit" && !item.filled) {
            item.unsafeReason = "atomic-tree-blocked";
          }
        }
        return;
      }
      for (const plan of result.plans) {
        if (treeState.filledPaths.has(plan.path)) continue;
        const item = this.list.find(candidate => {
          var _a2;
          return candidate.capturedTree === capturedTree && ((_a2 = candidate.unit) == null ? void 0 : _a2.unitPath) === plan.path;
        });
        if (!item) continue;
        const filled = await this.adapter.applyTreeFillPlan(capturedTree, plan, this.ctx);
        item.filled = filled;
        if (filled) treeState.filledPaths.add(plan.path); else item.unsafeReason = "adapter-rejected";
      }
    }
    async applyHit(item, answer, options) {
      item.answerPlan = answer;
      item.answer = displayValues(answer);
      item.status = "hit";
      item.free = options.source === "free";
      item.charged = options.charged;
      item.aiGenerated = options.aiGenerated ?? false;
      item.unsafeReason = void 0;
      if (item.unit) {
        this.recordResult(item, {
          kind: "leaf",
          path: item.unit.unitPath,
          unitHash: item.unit.unitHash,
          status: "hit",
          answer: answer,
          source: options.source,
          aiGenerated: options.aiGenerated,
          charged: options.charged
        });
      }
      if (item.capturedTree) await this.applyReadyTreePlans(item.capturedTree);
    }
    async persistFilledAnswers() {
      if (!this.opts.autoFill || !this.ctx || !this.adapter.persistAnswers || !this.list.some(item => item.filled)) return;
      let persisted = false;
      try {
        persisted = await this.adapter.persistAnswers(this.ctx);
      } catch {
        persisted = false;
      }
      if (persisted) return;
      for (const item of this.list) {
        if (!item.filled) continue;
        item.filled = false;
        item.unsafeReason = "adapter-rejected";
      }
      for (const tree of this.trees) tree.filledPaths.clear();
    }
    async answerOne(inx) {
      var _a2, _b, _c;
      const item = this.list[inx];
      if (!item || !this.ctx || !item.root || !item.unit) return;
      if (item.status === "decodeFail" || item.status === "unsupported" || item.status === "hit") return;
      this.currentInx = inx;
      this.emit({
        kind: "question",
        inx: inx
      });
      try {
        const cached = ((_a2 = this.deps.localStore) == null ? void 0 : _a2.read(item.unit.unitHash)) ?? null;
        if (cached) {
          const plan = buildAnswerPlan(item.unit, cached);
          if (plan.kind === "usable") {
            await this.applyHit(item, plan.answer, {
              source: "local",
              charged: false
            });
            return;
          }
        }
        if (this.opts.freeFirst !== false && this.deps.freeSearch) {
          try {
            const freeHit = await this.deps.freeSearch(item.unit);
            if (freeHit) {
              const plan = buildAnswerPlan(item.unit, freeHit);
              if (plan.kind === "usable") {
                await this.applyHit(item, plan.answer, {
                  source: "free",
                  charged: false,
                  aiGenerated: freeHit.aiGenerated
                });
                return;
              }
            }
          } catch {}
        }
        const canPaid = this.paidBlockReason === null && (this.deps.canPaidSearch ? this.deps.canPaidSearch() : true);
        if (!canPaid) {
          item.status = "miss";
          this.recordTerminal(item, this.paidBlockReason === "insufficient" ? "insufficient" : this.paidBlockReason === "ratelimited" ? "rate_limited" : "unauthorized");
          return;
        }
        const request = {
          requestSchemaVersion: 2,
          root: item.root,
          unitPath: item.unit.unitPath,
          expectedRootHash: item.unit.rootHash,
          expectedUnitHash: item.unit.unitHash
        };
        const key = this.deps.genKey ? this.deps.genKey() : transportIdempotencyKey(item.unit);
        const res = await this.client.search(request, key);
        if (res.code === AiAskCode.Ok && ((_b = res.result) == null ? void 0 : _b.status) === "hit") {
          if (!res.result.answer) {
            item.status = "unsafe";
            return;
          }
          await this.applyHit(item, res.result.answer, {
            source: res.result.source ?? "relay",
            charged: res.result.charged,
            aiGenerated: res.result.aiGenerated
          });
        } else if (res.code === AiAskCode.Ok) {
          item.status = ((_c = res.result) == null ? void 0 : _c.status) === "unsafe" ? "unsafe" : "miss";
          if (res.result) this.recordResult(item, res.result); else this.recordTerminal(item, "miss");
        } else if (res.code === AiAskCode.Insufficient) {
          this.paidBlockReason = "insufficient";
          item.status = "miss";
          this.recordTerminal(item, "insufficient");
          this.emit({
            kind: "insufficient"
          });
        } else if (res.code === AiAskCode.Unauthorized) {
          item.status = "miss";
          this.recordTerminal(item, "unauthorized");
          this.emit({
            kind: "unauthorized"
          });
        } else if (res.code === AiAskCode.RateLimited) {
          this.paidBlockReason = "ratelimited";
          item.status = "miss";
          this.recordTerminal(item, "rate_limited");
          this.emit({
            kind: "ratelimited"
          });
        }
      } catch (error) {
        item.status = "miss";
        this.recordTerminal(item, "busy");
        this.emit({
          kind: "search-failed",
          inx: inx,
          reason: error instanceof Error ? error.message : String(error ?? "")
        });
      }
    }
    async start(fromInx = 0) {
      var _a2, _b;
      if (this.running) return;
      this.running = true;
      this.stopFlag = false;
      const sleep2 = this.deps.sleep ?? (ms => new Promise(resolve => setTimeout(resolve, ms)));
      const random = this.deps.random ?? Math.random;
      try {
        if (this.ctx && await ((_b = (_a2 = this.adapter).prepareStart) == null ? void 0 : _b.call(_a2, this.ctx)) === "navigating") return;
        for (let index = fromInx; index < this.list.length; index += 1) {
          if (this.stopFlag) break;
          if (this.isStale()) {
            this.stopFlag = true;
            break;
          }
          await this.answerOne(index);
          if (this.stopFlag) break;
          this.emit({
            kind: "progress",
            inx: index,
            total: this.list.length
          });
          if (index < this.list.length - 1) {
            await sleep2(this.opts.delayMs + random() * 1e3);
          }
        }
        if (this.stopFlag) this.emit({
          kind: "paused"
        }); else {
          await this.persistFilledAnswers();
          this.emit({
            kind: "done",
            ...this.stats(),
            total: this.list.length
          });
        }
      } finally {
        this.running = false;
      }
    }
    async fillRandom(inx, pick = Math.random) {
      return await this.fillRandomWithReason(inx, pick) === "ok";
    }
    async fillRandomWithReason(inx, pick = Math.random) {
      const item = this.list[inx];
      if (!item) return "missing";
      if (item.filled) return "already-filled";
      if (!this.opts.autoFill) return "no-autofill";
      if (!this.ctx) return "no-ctx";
      if (!item.root) return "no-root";
      if (!item.binding) return "no-binding";
      const unit = item.unit;
      if (!unit) return "no-unit";
      if (unit.queryType !== "single" && unit.queryType !== "judge") return "type-not-allowed";
      const options = unit.options.filter(option => option.content.trim());
      if (options.length === 0) return "no-options";
      const chosen = options[Math.floor(pick() * options.length) % options.length];
      if (!chosen) return "no-options";
      const fillPlan = buildFillPlan(item.root, unit, {
        kind: "choice",
        optionIds: [ chosen.id ],
        displayValues: [ chosen.content ]
      }, item.binding);
      if (fillPlan.kind === "unsafe") {
        item.unsafeReason = fillPlan.reason;
        return "gate-unsafe";
      }
      const filled = item.capturedTree ? await this.adapter.applyTreeFillPlan(item.capturedTree, fillPlan.plan, this.ctx) : false;
      if (!filled) {
        item.unsafeReason = "adapter-rejected";
        return "adapter-rejected";
      }
      item.filled = true;
      item.random = true;
      return "ok";
    }
    async reAnswer(inx) {
      var _a2;
      if (this.running) return;
      const item = this.list[inx];
      if (!item || !this.ctx || item.status === "decodeFail" || item.status === "unsupported") return;
      this.running = true;
      this.stopFlag = false;
      try {
        if (item.status === "hit" && item.answerPlan) {
          this.currentInx = inx;
          this.emit({
            kind: "question",
            inx: inx
          });
          if (!item.filled) {
            await this.applyHit(item, item.answerPlan, {
              source: ((_a2 = item.answerNode) == null ? void 0 : _a2.source) ?? (item.free ? "free" : "relay"),
              charged: item.charged,
              aiGenerated: item.aiGenerated
            });
          }
        } else {
          await this.answerOne(inx);
        }
        await this.persistFilledAnswers();
        this.emit({
          kind: "progress",
          inx: inx,
          total: this.list.length
        });
      } finally {
        this.running = false;
      }
    }
    resumePaidAfterCredit() {
      if (this.paidBlockReason === "insufficient") this.paidBlockReason = null;
    }
    pause() {
      this.stopFlag = true;
    }
    stats() {
      let hit = 0;
      let miss = 0;
      let charged = 0;
      for (const item of this.list) {
        if (item.status === "hit") {
          hit += 1;
          if (item.charged) charged += 1;
        } else if (item.status === "miss" || item.status === "unsafe") {
          miss += 1;
        }
      }
      return {
        hit: hit,
        miss: miss,
        charged: charged
      };
    }
  }

  async function withDeadline(operation, timeoutMs, label) {
    if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new Error(`${label} timeout`);
    let timer;
    const deadline = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${label} timeout`)), timeoutMs);
    });
    try {
      return await Promise.race([ Promise.resolve().then(operation), deadline ]);
    } finally {
      if (timer !== void 0) clearTimeout(timer);
    }
  }

  const DEVICE_KEY_STORAGE_KEY = "aiask.security.device-key.v1";

  const DEFAULT_TIMEOUT_MS$2 = 8e3;

  const PRIVATE_FIELDS = [ "crv", "d", "kty", "x", "y" ];

  const STORED_FIELDS = [ "deviceId", "privateJwk", "publicJwk", "v" ];

  const BASE64URL_32_BYTES = /^[A-Za-z0-9_-]{43}$/u;

  const KEY_SELF_TEST = utf8Bytes("aiask-device-key-self-test-v1");

  const hasOnlyFields = (value, fields) => {
    const actual = Object.keys(value).sort();
    const expected = [ ...fields ].sort();
    return actual.length === expected.length && actual.every((field, index) => field === expected[index]);
  };

  function parsePrivateJwk(input) {
    if (typeof input !== "object" || input === null || !hasOnlyFields(input, PRIVATE_FIELDS)) throw new Error("invalid stored device key");
    const value = input;
    const publicJwk2 = PublicP256JwkSchema.parse({
      kty: value.kty,
      crv: value.crv,
      x: value.x,
      y: value.y
    });
    if (typeof value.d !== "string" || !BASE64URL_32_BYTES.test(value.d)) throw new Error("invalid stored device key");
    return {
      ...publicJwk2,
      d: value.d
    };
  }

  async function parseStoredDeviceKey(input) {
    if (typeof input !== "object" || input === null || !hasOnlyFields(input, STORED_FIELDS)) throw new Error("invalid stored device key");
    const value = input;
    if (value.v !== 1 || typeof value.deviceId !== "string") throw new Error("invalid stored device key");
    const publicJwk2 = PublicP256JwkSchema.parse(value.publicJwk);
    const privateJwk2 = parsePrivateJwk(value.privateJwk);
    const deviceId = await fingerprintPublicJwk(publicJwk2);
    if (deviceId !== value.deviceId) throw new Error("invalid stored device key fingerprint");
    const [privateKey, publicKey] = await Promise.all([ importEcdsaPrivateJwk(privateJwk2), importEcdsaPublicJwk(publicJwk2) ]);
    const signature2 = await signEcdsaP1363(privateKey, KEY_SELF_TEST);
    if (!(await verifyEcdsaP1363(publicKey, KEY_SELF_TEST, signature2))) throw new Error("invalid stored device key pair");
    return {
      deviceId: deviceId,
      publicJwk: publicJwk2,
      privateKey: privateKey
    };
  }

  async function generateStoredDeviceKey(generateKeyPair) {
    const pair = await generateKeyPair();
    const [publicJwk2, exportedPrivateJwk] = await Promise.all([ exportPublicJwk(pair.publicKey), exportPrivateJwk(pair.privateKey) ]);
    const parsedPublicJwk = PublicP256JwkSchema.parse(publicJwk2);
    const privateJwk2 = parsePrivateJwk({
      ...parsedPublicJwk,
      d: exportedPrivateJwk.d
    });
    const deviceId = await fingerprintPublicJwk(parsedPublicJwk);
    return {
      identity: {
        deviceId: deviceId,
        publicJwk: parsedPublicJwk,
        privateKey: pair.privateKey
      },
      stored: {
        v: 1,
        deviceId: deviceId,
        publicJwk: parsedPublicJwk,
        privateJwk: privateJwk2
      }
    };
  }

  class DeviceKeyManager {
    constructor(storage, options = {}) {
      __publicField(this, "timeoutMs");
      __publicField(this, "generateKeyPair");
      __publicField(this, "identity");
      __publicField(this, "pending");
      this.storage = storage;
      this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS$2;
      this.generateKeyPair = options.generateKeyPair ?? generateEcdsaDeviceKeyPair;
    }
    getOrCreate() {
      if (this.identity) return Promise.resolve(this.identity);
      if (!this.pending) {
        this.track(withDeadline(async () => {
          const stored = await this.storage.get(DEVICE_KEY_STORAGE_KEY);
          if (stored !== void 0 && stored !== null) return parseStoredDeviceKey(stored);
          const generated = await generateStoredDeviceKey(this.generateKeyPair);
          await this.storage.set(DEVICE_KEY_STORAGE_KEY, generated.stored);
          return generated.identity;
        }, this.timeoutMs, "device key"));
      }
      const pending = this.pending;
      if (!pending) throw new Error("device key operation unavailable");
      return pending;
    }
    async reset() {
      if (this.pending) await this.pending.catch(() => void 0);
      this.identity = void 0;
      return this.track(withDeadline(async () => {
        const generated = await generateStoredDeviceKey(this.generateKeyPair);
        await this.storage.set(DEVICE_KEY_STORAGE_KEY, generated.stored);
        return generated.identity;
      }, this.timeoutMs, "device key reset"));
    }
    async clear() {
      if (this.pending) await this.pending.catch(() => void 0);
      await withDeadline(() => this.storage.delete(DEVICE_KEY_STORAGE_KEY), this.timeoutMs, "device key clear");
      this.identity = void 0;
    }
    track(operation) {
      this.pending = operation.then(identity => {
        this.identity = identity;
        this.pending = void 0;
        return identity;
      }, error => {
        this.pending = void 0;
        throw error;
      });
      const pending = this.pending;
      if (!pending) throw new Error("device key operation unavailable");
      return pending;
    }
  }

  function createCaptchaFrameRequest(options) {
    const channel = (options.channelFactory ?? (() => new MessageChannel))();
    let settled = false;
    let resolveResult = () => void 0;
    let rejectResult = () => void 0;
    const cleanup = () => {
      clearTimeout(timer);
      channel.port1.onmessage = null;
      channel.port1.close();
    };
    const fail = reason => {
      if (settled) return;
      settled = true;
      cleanup();
      rejectResult(new Error(reason));
    };
    const succeed = token => {
      if (settled) return;
      settled = true;
      cleanup();
      resolveResult(token);
    };
    const result = new Promise((resolve, reject) => {
      resolveResult = resolve;
      rejectResult = reject;
    });
    const timer = setTimeout(() => fail("challenge-timeout"), options.timeoutMs);
    channel.port1.onmessage = event => {
      const data = event.data;
      if ((data == null ? void 0 : data.type) !== "aiask:captcha:result" || data.state !== options.state) return;
      if (typeof data.token === "string" && data.token.length > 0 && data.token.length <= 4096) {
        succeed(data.token);
        return;
      }
      fail(typeof data.error === "string" ? data.error : "challenge-failed");
    };
    channel.port1.start();
    try {
      options.frameWindow.postMessage({
        type: "aiask:captcha:init",
        state: options.state
      }, options.targetOrigin, [ channel.port2 ]);
    } catch {
      fail("challenge-unavailable");
    }
    return {
      result: result,
      cancel: () => fail("cancelled")
    };
  }

  const HIGHEST_KEYSET_VERSION_KEY = "aiask.security.highest-keyset-version.v1";

  const KEYSET_WATERMARKS_KEY = "aiask.security.keyset-watermarks.v1";

  const DEFAULT_TIMEOUT_MS$1 = 8e3;

  const SESSION_EXPIRY_MARGIN_MS = 1e3;

  function parseHighestKeysetVersion(value) {
    if (value === void 0 || value === null) return 0;
    if (!Number.isInteger(value) || value < 0) throw new Error("invalid stored keyset version");
    return value;
  }

  function keysetWatermarkOrigin(baseUrl) {
    return new URL(baseUrl).origin;
  }

  function parseKeysetWatermarks(value) {
    if (value === void 0 || value === null) return {};
    if (typeof value !== "object" || Array.isArray(value)) throw new Error("invalid stored keyset watermarks");
    const entries = Object.entries(value);
    for (const [, version] of entries) parseHighestKeysetVersion(version);
    return Object.fromEntries(entries);
  }

  async function readKeysetWatermark(storage, baseUrl, inheritLegacy = true) {
    const origin = keysetWatermarkOrigin(baseUrl);
    const own = parseKeysetWatermarks(await storage.get(KEYSET_WATERMARKS_KEY))[origin] ?? 0;
    if (!inheritLegacy) return own;
    const legacy = parseHighestKeysetVersion(await storage.get(HIGHEST_KEYSET_VERSION_KEY));
    return Math.max(own, legacy);
  }

  async function recordKeysetWatermark(storage, baseUrl, keysetVersion) {
    const origin = keysetWatermarkOrigin(baseUrl);
    const watermarks = parseKeysetWatermarks(await storage.get(KEYSET_WATERMARKS_KEY));
    if ((watermarks[origin] ?? 0) >= keysetVersion) return;
    await storage.set(KEYSET_WATERMARKS_KEY, {
      ...watermarks,
      [origin]: keysetVersion
    });
  }

  const activeKey = (keyset, use, kid2, now) => keyset.keys.find(key => key.kid === kid2 && key.use === use && key.notBefore <= now && key.expiresAt > now);

  const parseVersion = value => {
    const main = value.split("-", 1)[0];
    if (!/^\d+(?:\.\d+)*$/u.test(main)) throw new Error("invalid client version");
    return main.split(".").map(segment => Number(segment));
  };

  function compareVersions(left, right) {
    const a = parseVersion(left);
    const b = parseVersion(right);
    const length = Math.max(a.length, b.length);
    for (let index = 0; index < length; index++) {
      const difference = (a[index] ?? 0) - (b[index] ?? 0);
      if (difference !== 0) return difference;
    }
    return 0;
  }

  const normalizedBaseUrl$1 = value => value.replace(/\/+$/u, "");

  class SecureSessionClient {
    constructor(options) {
      __publicField(this, "timeoutMs");
      __publicField(this, "now");
      __publicField(this, "randomBytes");
      __publicField(this, "generateEcdhKeyPair");
      __publicField(this, "baseUrl");
      __publicField(this, "session");
      __publicField(this, "pending");
      this.options = options;
      if (options.rootPublicJwks.length === 0) throw new Error("missing root verification key");
      this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS$1;
      this.now = options.now ?? (() => Date.now());
      this.randomBytes = options.randomBytes ?? (length => crypto.getRandomValues(new Uint8Array(length)));
      this.generateEcdhKeyPair = options.generateEcdhKeyPair ?? generateEcdhKeyPair;
      this.baseUrl = normalizedBaseUrl$1(options.baseUrl);
    }
    async getSession() {
      return withDeadline(async () => {
        var _a2;
        const device = await this.options.deviceKeys.getOrCreate();
        if (((_a2 = this.session) == null ? void 0 : _a2.deviceId) === device.deviceId && this.serverNow(this.session) + SESSION_EXPIRY_MARGIN_MS < this.session.expiresAt) return this.session;
        if (!this.pending) {
          this.pending = this.openSession(device).then(session2 => {
            this.session = session2;
            this.pending = void 0;
            return session2;
          }, error => {
            this.pending = void 0;
            throw error;
          });
        }
        const session = await this.pending;
        if (session.deviceId !== device.deviceId) {
          this.session = void 0;
          return this.getSession();
        }
        return session;
      }, this.timeoutMs, "secure session");
    }
    invalidate(sessionId) {
      var _a2;
      if (!sessionId || ((_a2 = this.session) == null ? void 0 : _a2.sessionId) === sessionId) this.session = void 0;
    }
    serverNow(session = this.session) {
      return this.now() + ((session == null ? void 0 : session.serverTimeOffsetMs) ?? 0);
    }
    async openSession(device) {
      const openPath = this.options.requestedScope === "admin" ? "/api/admin/session/open" : "/api/session/open";
      const bootstrap = await this.fetchAndVerifyBootstrap();
      const ephemeral = await this.generateEcdhKeyPair();
      const clientEcdhPublicJwk = PublicP256JwkSchema.parse(await exportPublicJwk(ephemeral.publicKey));
      const nonce = this.randomBase64Url(16);
      const baseRequest = {
        protocolVersion: 1,
        challenge: bootstrap.challenge,
        deviceId: device.deviceId,
        devicePublicJwk: device.publicJwk,
        ecdhKid: bootstrap.ecdhKey.kid,
        clientEcdhPublicJwk: clientEcdhPublicJwk,
        timestamp: this.now() + bootstrap.serverTimeOffsetMs,
        nonce: nonce
      };
      const unsignedRequest = this.options.requestedScope === "admin" ? AdminSessionOpenRequestSchema.omit({
        signature: true
      }).parse(baseRequest) : {
        ...baseRequest,
        requestedScope: this.options.requestedScope
      };
      const request = {
        ...unsignedRequest,
        signature: await signEcdsaP1363(device.privateKey, utf8Bytes(sessionOpenRequestInput(openPath, unsignedRequest)))
      };
      const response = await this.send({
        url: `${this.baseUrl}${openPath}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(request),
        timeoutMs: this.timeoutMs
      });
      if (response.status < 200 || response.status >= 300) throw new Error("session open failed");
      const openResponse = SessionOpenResponseSchema.parse(JSON.parse(response.body));
      if (openResponse.ecdhKid !== bootstrap.ecdhKey.kid || canonicalPublicJwk(openResponse.serverEcdhPublicJwk) !== canonicalPublicJwk(bootstrap.ecdhKey.publicJwk)) throw new Error("session ECDH key mismatch");
      const serverNow = this.now() + bootstrap.serverTimeOffsetMs;
      const signingKey = activeKey(bootstrap.keyset, "transport-signing", openResponse.signingKid, serverNow);
      if (!signingKey) throw new Error("invalid session signing key");
      const signingPublicKey = await importEcdsaPublicJwk(signingKey.publicJwk);
      const {signature: _signature, ...unsignedResponse} = openResponse;
      if (!(await verifyEcdsaP1363(signingPublicKey, utf8Bytes(sessionOpenResponseInput(openPath, unsignedResponse)), openResponse.signature))) throw new Error("invalid session response signature");
      const serverEcdhPublicKey = await importEcdhPublicJwk(bootstrap.ecdhKey.publicJwk);
      const sharedSecret = await deriveEcdhSecret(ephemeral.privateKey, serverEcdhPublicKey);
      const handshakeContext = {
        protocolVersion: 1,
        challenge: bootstrap.challenge,
        clientNonce: nonce,
        serverNonce: openResponse.serverNonce,
        deviceId: device.deviceId,
        clientEcdhFingerprint: await fingerprintPublicJwk(clientEcdhPublicJwk),
        serverEcdhFingerprint: await fingerprintPublicJwk(bootstrap.ecdhKey.publicJwk)
      };
      const handshakeKey = await deriveHandshakeKey(sharedSecret, handshakeContext);
      const {ciphertext: _ciphertext, signature: _serverSignature, ...head} = openResponse;
      const plaintext = SessionOpenPlaintextSchema.parse(JSON.parse(utf8Text(await aesGcmDecrypt(handshakeKey, base64UrlToBytes(openResponse.iv), base64UrlToBytes(openResponse.ciphertext), utf8Bytes(sessionOpenResponseAad(openPath, head))))));
      if (plaintext.deviceId !== device.deviceId) throw new Error("session device mismatch");
      if (plaintext.grantedScope !== this.options.requestedScope) throw new Error("session scope mismatch");
      if (plaintext.issuedAt > serverNow + 12e4 || plaintext.expiresAt <= serverNow || plaintext.expiresAt > bootstrap.ecdhKey.expiresAt) throw new Error("invalid session lifetime");
      const trafficKeys = await deriveTrafficKeys(sharedSecret, {
        ...handshakeContext,
        sessionId: plaintext.sessionId
      });
      return {
        ...plaintext,
        devicePublicJwk: device.publicJwk,
        devicePrivateKey: device.privateKey,
        serverTimeOffsetMs: bootstrap.serverTimeOffsetMs,
        c2sKey: trafficKeys.c2sKey,
        s2cKey: trafficKeys.s2cKey,
        keyset: bootstrap.keyset
      };
    }
    async fetchAndVerifyBootstrap() {
      const response = await this.send({
        url: `${this.baseUrl}/api/bootstrap`,
        method: "GET",
        timeoutMs: this.timeoutMs
      });
      if (response.status < 200 || response.status >= 300) throw new Error("bootstrap failed");
      const document2 = BootstrapDocumentSchema.parse(JSON.parse(response.body));
      let rootVerified = false;
      for (const rootJwk of this.options.rootPublicJwks) {
        const rootPublicKey = await importEcdsaPublicJwk(rootJwk);
        if (await verifyServerKeysetSignature(rootPublicKey, document2.keyset)) {
          rootVerified = true;
          break;
        }
      }
      if (!rootVerified) throw new Error("invalid keyset root signature");
      if (await serverKeysetHash(document2.keyset) !== document2.challenge.keysetHash) throw new Error("keyset hash mismatch");
      if (!(await verifyBootstrapChallengeSignature(document2.keyset, document2.challenge))) throw new Error("invalid bootstrap challenge signature");
      const localNow = this.now();
      const serverNow = document2.challenge.serverTime;
      const highestAcceptedVersion = await this.readHighestKeysetVersion();
      validateServerKeyset(document2.keyset, serverNow, highestAcceptedVersion);
      validateBootstrapChallenge(document2.challenge, document2.keyset, serverNow);
      if (compareVersions(this.options.clientVersion, document2.challenge.minClientVersion) < 0) throw new Error("client version too old");
      const ecdhKey = document2.keyset.keys.find(key => key.use === "ecdh" && key.notBefore <= serverNow && key.expiresAt > serverNow);
      if (!ecdhKey) throw new Error("missing active ECDH key");
      await recordKeysetWatermark(this.options.stateStorage, this.baseUrl, document2.keyset.keysetVersion);
      return {
        keyset: document2.keyset,
        challenge: document2.challenge.challenge,
        serverTimeOffsetMs: serverNow - localNow,
        ecdhKey: ecdhKey
      };
    }
    async readHighestKeysetVersion() {
      return readKeysetWatermark(this.options.stateStorage, this.baseUrl, this.options.inheritLegacyKeysetWatermark);
    }
    randomBase64Url(length) {
      const bytes = this.randomBytes(length);
      if (!(bytes instanceof Uint8Array) || bytes.length !== length) throw new Error("invalid random source");
      return bytesToBase64Url(bytes);
    }
    send(request) {
      return withDeadline(() => this.options.transport.send(request), request.timeoutMs ?? this.timeoutMs, "security transport");
    }
  }

  const DEFAULT_TIMEOUT_MS = 8e3;

  const DEFAULT_MAX_ATTEMPTS = 2;

  const RESPONSE_TIME_WINDOW_MS = 12e4;

  class RetryableSecureTransportError extends Error {}

  const headerEntries = (headers, name) => Object.entries(headers ?? {}).filter(([key]) => key.toLowerCase() === name.toLowerCase()).map(([, value]) => value);

  function singleHeader(headers, name) {
    const values = headerEntries(headers, name);
    if (values.length > 1) throw new Error(`duplicate ${name} header`);
    return values[0];
  }

  class SecureTransport {
    constructor(options) {
      __publicField(this, "timeoutMs");
      __publicField(this, "maxAttempts");
      __publicField(this, "randomBytes");
      __publicField(this, "randomUuid");
      this.options = options;
      this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
      this.maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
      if (!Number.isInteger(this.maxAttempts) || this.maxAttempts < 1) throw new Error("invalid secure transport attempts");
      this.randomBytes = options.randomBytes ?? (length => crypto.getRandomValues(new Uint8Array(length)));
      this.randomUuid = options.randomUuid ?? (() => crypto.randomUUID());
    }
    async send(request) {
      if (headerEntries(request.headers, "Authorization").length > 0) throw new Error("Authorization header is forbidden on SecureTransport");
      const idempotencyKey = singleHeader(request.headers, "Idempotency-Key");
      const url = new URL(request.url);
      if (url.username || url.password || url.search) throw new Error("secure request URL must not contain credentials or query");
      const payload = request.body === void 0 ? null : JSON.parse(request.body);
      const accessToken = this.options.getAccessToken ? await withDeadline(() => {
        var _a2, _b;
        return Promise.resolve(((_b = (_a2 = this.options).getAccessToken) == null ? void 0 : _b.call(_a2)) ?? "");
      }, request.timeoutMs ?? this.timeoutMs, "access token") : "";
      const plaintext = {
        ...accessToken ? {
          auth: {
            accessToken: accessToken
          }
        } : {},
        ...idempotencyKey ? {
          idempotencyKey: idempotencyKey
        } : {},
        ...this.options.client ? {
          client: this.options.client
        } : {},
        payload: payload
      };
      const attempts = idempotencyKey ? this.maxAttempts : 1;
      let lastError;
      for (let attempt = 0; attempt < attempts; attempt++) {
        try {
          return await this.sendAttempt(request, url.pathname, plaintext);
        } catch (error) {
          lastError = error;
          if (!(error instanceof RetryableSecureTransportError)) throw error;
        }
      }
      throw lastError;
    }
    async sendAttempt(request, path, plaintext) {
      const timeoutMs = request.timeoutMs ?? this.timeoutMs;
      const session = await this.options.sessions.getSession();
      const iv = this.randomBase64Url(12);
      const requestHead = {
        v: 1,
        sessionId: session.sessionId,
        requestId: this.randomUuid(),
        timestamp: this.options.sessions.serverNow(session),
        nonce: this.randomBase64Url(16),
        iv: iv
      };
      const ciphertext = bytesToBase64Url(await aesGcmEncrypt(session.c2sKey, base64UrlToBytes(iv), utf8Bytes(JSON.stringify(plaintext)), utf8Bytes(requestEnvelopeAad(request.method, path, requestHead))));
      const unsignedEnvelope = {
        ...requestHead,
        ciphertext: ciphertext
      };
      const envelope = {
        ...unsignedEnvelope,
        signature: await signEcdsaP1363(session.devicePrivateKey, utf8Bytes(requestEnvelopeInput(request.method, path, unsignedEnvelope)))
      };
      let response;
      try {
        response = await withDeadline(() => this.options.transport.send({
          url: request.url,
          method: request.method,
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(envelope),
          timeoutMs: timeoutMs
        }), timeoutMs, "secure request");
      } catch (error) {
        throw new RetryableSecureTransportError(error instanceof Error ? error.message : "secure request failed");
      }
      if (!response.body) {
        if (response.status === 401 || response.status === 409) {
          this.options.sessions.invalidate(session.sessionId);
          throw new RetryableSecureTransportError("secure session rejected");
        }
        if (response.status >= 200 && response.status < 300) throw new Error("missing secure response");
        return response;
      }
      const responseEnvelope = SecureResponseEnvelopeSchema.parse(JSON.parse(response.body));
      if (responseEnvelope.sessionId !== session.sessionId || responseEnvelope.requestId !== requestHead.requestId) throw new Error("secure response correlation mismatch");
      const serverNow = this.options.sessions.serverNow(session);
      if (Math.abs(responseEnvelope.timestamp - serverNow) > RESPONSE_TIME_WINDOW_MS) throw new Error("secure response timestamp rejected");
      const signingKey = session.keyset.keys.find(key => key.kid === responseEnvelope.kid && key.use === "transport-signing" && key.notBefore <= serverNow && key.expiresAt > serverNow);
      if (!signingKey) throw new Error("secure response signing key rejected");
      const publicKey = await importEcdsaPublicJwk(signingKey.publicJwk);
      const {signature: _signature, ...unsignedResponse} = responseEnvelope;
      if (!(await verifyEcdsaP1363(publicKey, utf8Bytes(responseEnvelopeInput(request.method, path, unsignedResponse)), responseEnvelope.signature))) throw new Error("secure response signature rejected");
      const {ciphertext: _ciphertext, ...responseHead} = unsignedResponse;
      const body = utf8Text(await aesGcmDecrypt(session.s2cKey, base64UrlToBytes(responseEnvelope.iv), base64UrlToBytes(responseEnvelope.ciphertext), utf8Bytes(responseEnvelopeAad(request.method, path, responseHead))));
      return {
        status: response.status,
        body: body
      };
    }
    randomBase64Url(length) {
      const bytes = this.randomBytes(length);
      if (!(bytes instanceof Uint8Array) || bytes.length !== length) throw new Error("invalid random source");
      return bytesToBase64Url(bytes);
    }
  }

  class RuleExecutionError extends Error {
    constructor(code, message) {
      super(message);
      __publicField(this, "fatal", true);
      this.code = code;
      this.name = "RuleExecutionError";
    }
  }

  class RuleDomainError extends Error {
    constructor(code, message) {
      super(message);
      this.code = code;
      this.name = "RuleDomainError";
    }
    toRuleValue() {
      return {
        code: this.code,
        message: this.message
      };
    }
  }

  class PrimitiveRegistry {
    constructor() {
      __publicField(this, "definitions", new Map);
    }
    register(definition) {
      if (this.definitions.has(definition.id)) {
        throw new Error(`duplicate primitive: ${definition.id}`);
      }
      this.definitions.set(definition.id, definition);
    }
    get(id) {
      return this.definitions.get(id);
    }
    ids() {
      return [ ...this.definitions.keys() ];
    }
  }

  function assertPrimitiveAllowed(registry, policy, invocation) {
    if (!policy.primitives.has(invocation.id)) {
      throw new RuleExecutionError("capability_denied", `primitive is not allowed by runtime policy: ${invocation.id}`);
    }
    const definition = registry.get(invocation.id);
    if (!definition) {
      throw new RuleExecutionError("unknown_primitive", `unknown primitive: ${invocation.id}`);
    }
    if (!definition.phases.includes(invocation.phase)) {
      throw new RuleExecutionError("capability_denied", `primitive is not allowed in ${invocation.phase}: ${invocation.id}`);
    }
    if (definition.capability && (!policy.capabilities.has(definition.capability) || !invocation.requestedCapabilities.has(definition.capability))) {
      throw new RuleExecutionError("capability_denied", `capability is not allowed: ${definition.capability}`);
    }
    if (definition.requiresSafetyCapability) {
      const argument = definition.safetyArgument ?? "safety";
      try {
        assertSafetyCapability(invocation.args[argument]);
      } catch {
        throw new RuleExecutionError("security_violation", `primitive requires a valid safety capability: ${invocation.id}`);
      }
    }
    return definition;
  }

  async function invokePrimitive(definition, invocation) {
    try {
      return await definition.execute({
        args: invocation.args,
        phase: invocation.phase,
        signal: invocation.signal,
        variables: invocation.variables
      });
    } catch (error) {
      if (error instanceof RuleExecutionError || error instanceof RuleDomainError) throw error;
      throw new RuleDomainError("primitive_failed", error instanceof Error ? error.message : "primitive failed");
    }
  }

  function safetyArgument(args) {
    return args.safety;
  }

  function stringArgument$2(args, name) {
    const value = args[name];
    if (typeof value !== "string" || value.length === 0) throw new RuleDomainError("invalid_type", `${name} must be a string`);
    return value;
  }

  function assertAllowedOperation(capability, operation) {
    const plan = safetyPlanForCapability(capability);
    if (plan.atomic && plan.operations.length > 1) throw new RuleDomainError("partial_not_allowed", "atomic fill plan cannot be split into individual writes");
    try {
      assertSafetyOperation(capability, operation);
    } catch {
      throw new RuleExecutionError("security_violation", "answer operation is not allowed by safety capability");
    }
    return plan;
  }

  async function applyAndVerifyOperation(writer, capability, operation, signal) {
    const plan = assertAllowedOperation(capability, operation);
    if (!(await writer.applyOperation(plan, operation, signal))) throw new RuleDomainError("write_refused", "answer writer refused operation");
    if (!(await writer.verifyOperation(plan, operation, signal))) throw new RuleDomainError("write_verify_failed", "answer write read-back verification failed");
    return true;
  }

  function registerAnswerWritePrimitives(registry, writer) {
    registry.register({
      id: "answer.applyPlan",
      phases: [ "fill" ],
      capability: "answer-write",
      requiresSafetyCapability: true,
      execute: async ({args: args, signal: signal}) => {
        const plan = safetyPlanForCapability(safetyArgument(args));
        if (!(await writer.applyPlan(plan, signal))) throw new RuleDomainError("write_refused", "answer writer refused plan");
        if (!(await writer.verifyPlan(plan, signal))) throw new RuleDomainError("write_verify_failed", "answer plan read-back verification failed");
        return true;
      }
    });
    const registerChoice = id => registry.register({
      id: id,
      phases: [ "fill" ],
      capability: "answer-write",
      requiresSafetyCapability: true,
      execute: ({args: args, signal: signal}) => {
        if (id === "dom.setChecked" && args.checked !== true) throw new RuleExecutionError("security_violation", "dom.setChecked only accepts checked=true for planned answers");
        return applyAndVerifyOperation(writer, safetyArgument(args), {
          kind: "choose",
          optionId: stringArgument$2(args, "optionId")
        }, signal);
      }
    });
    registerChoice("dom.clickAnswer");
    registerChoice("dom.setChecked");
    const registerSlot = id => registry.register({
      id: id,
      phases: [ "fill" ],
      capability: "answer-write",
      requiresSafetyCapability: true,
      execute: ({args: args, signal: signal}) => applyAndVerifyOperation(writer, safetyArgument(args), {
        kind: "write",
        slotId: stringArgument$2(args, "slotId"),
        value: stringArgument$2(args, "value")
      }, signal)
    });
    registerSlot("dom.setValue");
    registerSlot("dom.setSelected");
    registry.register({
      id: "matching.pair",
      phases: [ "fill" ],
      capability: "answer-write",
      requiresSafetyCapability: true,
      execute: ({args: args, signal: signal}) => applyAndVerifyOperation(writer, safetyArgument(args), {
        kind: "pair",
        leftId: stringArgument$2(args, "leftId"),
        rightId: stringArgument$2(args, "rightId")
      }, signal)
    });
  }

  const MAX_HARD_TREES = 5e3;

  const MAX_HARD_BINDINGS = 5e3;

  class RuleCaptureRegistryError extends Error {
    constructor(code, message) {
      super(message);
      this.code = code;
      this.name = "RuleCaptureRegistryError";
    }
  }

  function freezeJson$1(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) freezeJson$1(child);
    return Object.freeze(value);
  }

  class RuleCaptureRegistry {
    constructor(options) {
      __publicField(this, "bindings");
      __publicField(this, "trees", []);
      __publicField(this, "pendingBindings", new Map);
      __publicField(this, "harvested", new Map);
      __publicField(this, "finishedResults", new WeakSet);
      __publicField(this, "maxTrees");
      __publicField(this, "maxBindings");
      __publicField(this, "finished", false);
      __publicField(this, "disposed", false);
      const maxBindings = options.maxBindings ?? MAX_HARD_BINDINGS;
      if (!Number.isInteger(options.maxTrees) || options.maxTrees <= 0 || options.maxTrees > MAX_HARD_TREES || !Number.isInteger(maxBindings) || maxBindings <= 0 || maxBindings > MAX_HARD_BINDINGS) throw new RuleCaptureRegistryError("invalid_options", "invalid capture tree limit");
      this.maxTrees = options.maxTrees;
      this.maxBindings = maxBindings;
      this.bindings = new RuleBindingRegistry({
        maxBindings: this.maxBindings
      });
    }
    registerLeafBinding(input, registration) {
      if (this.finished || this.disposed) throw new RuleCaptureRegistryError("finished", "capture registry is finished");
      const parsed = LeafQuestionNodeSchema.safeParse(input);
      if (!parsed.success) throw new RuleCaptureRegistryError("invalid_question_node", "capture node is not a valid leaf question");
      const node = freezeJson$1(parsed.data);
      if (this.pendingBindings.has(node.path) || this.bindings.has(node.path)) throw new RuleCaptureRegistryError("binding_registration", `duplicate binding path: ${node.path}`);
      if (this.bindings.size + this.pendingBindings.size >= this.maxBindings) throw new RuleCaptureRegistryError("binding_registration", "binding registry limit exceeded");
      const pending = {
        path: node.path,
        capturedFingerprint: questionNodeHash(node),
        readCurrentFingerprint: registration.readCurrentFingerprint,
        targets: registration.targets
      };
      const validation = new RuleBindingRegistry({
        maxBindings: 1
      });
      try {
        validation.register(pending);
      } catch (error) {
        if (error instanceof RuleBindingRegistryError) throw new RuleCaptureRegistryError("binding_registration", error.message);
        throw error;
      } finally {
        validation.dispose();
      }
      this.pendingBindings.set(node.path, pending);
      return node.path;
    }
    registerHarvestLeaf(input, values) {
      if (this.finished || this.disposed) throw new RuleCaptureRegistryError("finished", "capture registry is finished");
      const parsed = LeafQuestionNodeSchema.safeParse(input);
      if (!parsed.success) throw new RuleCaptureRegistryError("invalid_question_node", "harvest node is not a valid leaf question");
      const units = flattenQuestionTree(freezeJson$1(parsed.data));
      const unit = units[0];
      if (units.length !== 1 || !unit) throw new RuleCaptureRegistryError("harvest_registration", "harvest node must produce exactly one query unit");
      if (!Array.isArray(values) || values.length === 0) throw new RuleCaptureRegistryError("harvest_registration", "harvest requires a non-empty value array");
      const normalized = values.map(value => {
        if (typeof value !== "string" || !value.trim()) throw new RuleCaptureRegistryError("harvest_registration", "harvest values must be non-blank strings");
        return value.trim();
      });
      if (this.harvested.size >= this.maxBindings && !this.harvested.has(unit.unitHash)) throw new RuleCaptureRegistryError("harvest_registration", "harvest registry limit exceeded");
      this.harvested.set(unit.unitHash, {
        values: normalized,
        stem: unit.effectiveStem,
        itemType: unit.queryType,
        options: unit.options.map(option => option.content)
      });
      return unit.unitHash;
    }
    takeHarvested() {
      const result = [ ...this.harvested ].map(([unitHash, entry]) => ({
        unitHash: unitHash,
        values: [ ...entry.values ],
        stem: entry.stem,
        itemType: entry.itemType,
        options: [ ...entry.options ]
      }));
      this.harvested.clear();
      return result;
    }
    registerTree(input) {
      if (this.finished || this.disposed) throw new RuleCaptureRegistryError("finished", "capture registry is finished");
      if (this.trees.length >= this.maxTrees) throw new RuleCaptureRegistryError("tree_limit", "capture tree limit exceeded");
      const parsed = QuestionNodeSchema.safeParse(input);
      if (!parsed.success) throw new RuleCaptureRegistryError("invalid_question_node", "capture root is not a valid question tree");
      try {
        assertValidQuestionTree(parsed.data);
      } catch (error) {
        throw new RuleCaptureRegistryError("invalid_question_node", error instanceof Error ? error.message : "invalid question tree");
      }
      const root = freezeJson$1(parsed.data);
      const units = flattenQuestionTree(root);
      try {
        const pending = units.map(unit => {
          const binding = this.pendingBindings.get(unit.unitPath);
          if (!binding || binding.capturedFingerprint !== unit.sourceNodeHash) throw new RuleCaptureRegistryError("binding_registration", `missing or stale binding for query unit: ${unit.unitPath}`);
          if (this.bindings.has(unit.unitPath)) throw new RuleCaptureRegistryError("binding_registration", `duplicate binding path: ${unit.unitPath}`);
          return binding;
        });
        if (this.bindings.size + pending.length > this.maxBindings) throw new RuleCaptureRegistryError("binding_registration", "binding registry limit exceeded");
        for (const binding of pending) this.bindings.register(binding);
        for (const binding of pending) this.pendingBindings.delete(binding.path);
      } catch (error) {
        for (const unit of units) this.pendingBindings.delete(unit.unitPath);
        if (error instanceof RuleBindingRegistryError) throw new RuleCaptureRegistryError("binding_registration", error.message);
        throw error;
      }
      const tree = Object.freeze({
        root: root,
        bindings: this.bindings
      });
      this.trees.push(tree);
      return tree;
    }
    registerLeaf(input, registration) {
      if (this.finished || this.disposed) throw new RuleCaptureRegistryError("finished", "capture registry is finished");
      if (this.trees.length >= this.maxTrees) throw new RuleCaptureRegistryError("tree_limit", "capture tree limit exceeded");
      this.registerLeafBinding(input, registration);
      return this.registerTree(input);
    }
    finish() {
      if (this.disposed) return [];
      if (this.pendingBindings.size > 0) throw new RuleCaptureRegistryError("binding_registration", "capture has uncommitted question bindings");
      if (!this.finished) {
        this.bindings.seal();
        this.finished = true;
      }
      const result = [ ...this.trees ];
      this.finishedResults.add(result);
      return result;
    }
    ownsFinishedResult(value) {
      return Array.isArray(value) && this.finished && !this.disposed && this.finishedResults.has(value);
    }
    dispose() {
      this.disposed = true;
      this.finished = true;
      this.trees.length = 0;
      this.pendingBindings.clear();
      this.harvested.clear();
      this.bindings.dispose();
    }
  }

  function writeText(el, value) {
    var _a2;
    if (!el.isConnected) return false;
    const win = el.ownerDocument.defaultView;
    if (!win) return false;
    const Ctor = el.tagName === "TEXTAREA" ? win.HTMLTextAreaElement : win.HTMLInputElement;
    const setter = (_a2 = Object.getOwnPropertyDescriptor(Ctor.prototype, "value")) == null ? void 0 : _a2.set;
    el.focus();
    if (setter) setter.call(el, value); else el.value = value;
    el.dispatchEvent(new win.Event("input", {
      bubbles: true
    }));
    el.dispatchEvent(new win.Event("change", {
      bubbles: true
    }));
    el.blur();
    return true;
  }

  function validId(value) {
    return value.length > 0 && value.length <= 256;
  }

  function assertActive$2(signal) {
    if (signal.aborted) throw new RuleExecutionError("cancelled", "DOM answer target was cancelled");
  }

  function isLiveElement(element) {
    return element.isConnected && element.ownerDocument.defaultView !== null;
  }

  function htmlElement(element, label) {
    const view = element.ownerDocument.defaultView;
    if (!view || !(element instanceof view.HTMLElement)) throw new RuleExecutionError("security_violation", `${label} must be an HTMLElement`);
    return element;
  }

  function assertSafeChoiceTarget(element, location2, depth = 0) {
    const target = htmlElement(element, "choice target");
    const view = target.ownerDocument.defaultView;
    if (!view) throw new RuleExecutionError("security_violation", "choice target has no window");
    if (target instanceof view.HTMLFormElement) throw new RuleExecutionError("security_violation", "choice target cannot be a submit form");
    if (target instanceof view.HTMLButtonElement && target.type !== "button") throw new RuleExecutionError("security_violation", "choice target cannot be a submit button");
    if (target instanceof view.HTMLInputElement && ![ "radio", "checkbox" ].includes(target.type)) throw new RuleExecutionError("security_violation", "choice target input type must be radio or checkbox");
    if (target instanceof view.HTMLAnchorElement) {
      const url = new URL(target.href, location2.href);
      if (url.protocol === "javascript:" || url.origin !== location2.origin) throw new RuleExecutionError("security_violation", "choice target cannot navigate outside the current origin");
      throw new RuleExecutionError("security_violation", "choice target cannot be a navigation link");
    }
    if (/\u63d0\u4ea4|\u4ea4\u5377|\u5b8c\u6210\u8003\u8bd5|\bsubmit\b/iu.test(target.textContent ?? "")) throw new RuleExecutionError("security_violation", "choice target cannot activate submit controls");
    if (target instanceof view.HTMLLabelElement && depth === 0) {
      const control = target.control;
      if (control) assertSafeChoiceTarget(control, location2, depth + 1);
    }
    return target;
  }

  function checkedInput(element) {
    const view = element.ownerDocument.defaultView;
    const candidate = view && element instanceof view.HTMLInputElement ? element : element.querySelector('input[type="radio"], input[type="checkbox"]');
    if (!view || !candidate || !(candidate instanceof view.HTMLInputElement) || ![ "radio", "checkbox" ].includes(candidate.type)) throw new RuleExecutionError("security_violation", "checked strategy requires a radio or checkbox input");
    return candidate;
  }

  function selectedReader(target, strategy) {
    if (strategy.kind === "checked") {
      checkedInput(target);
      return () => {
        try {
          return checkedInput(target).checked;
        } catch {
          return false;
        }
      };
    }
    if (strategy.kind === "class") {
      if (!strategy.name || strategy.name.length > 128 || /\s/u.test(strategy.name)) throw new RuleExecutionError("security_violation", "invalid selected class name");
      return () => target.classList.contains(strategy.name);
    }
    if (strategy.kind === "descendant") {
      if (!strategy.selector || strategy.selector.length > 1024) throw new RuleExecutionError("security_violation", "invalid selected descendant selector");
      try {
        target.querySelector(strategy.selector);
      } catch {
        throw new RuleExecutionError("security_violation", "invalid selected descendant selector");
      }
      return () => target.querySelector(strategy.selector) != null;
    }
    if (!/^[A-Za-z_:][A-Za-z0-9_.:-]*$/u.test(strategy.name) || /^on/iu.test(strategy.name) || strategy.value.length > 1024) throw new RuleExecutionError("security_violation", "invalid selected attribute strategy");
    return () => target.getAttribute(strategy.name) === strategy.value;
  }

  function createDomChoiceBindingTarget(options) {
    if (!validId(options.optionId)) throw new RuleExecutionError("security_violation", "invalid option id");
    const clickTarget = assertSafeChoiceTarget(options.clickTarget, options.location);
    const readTarget = options.readTarget ?? clickTarget;
    const isSelected = selectedReader(readTarget, options.selected);
    let clicked = false;
    return {
      kind: "choose",
      optionId: options.optionId,
      isConnected: () => isLiveElement(clickTarget) && isLiveElement(readTarget),
      apply: async (operation, signal) => {
        assertActive$2(signal);
        if (operation.kind !== "choose" || operation.optionId !== options.optionId || !isLiveElement(clickTarget) || !isLiveElement(readTarget)) return false;
        if (isSelected()) return true;
        clickTarget.click();
        clicked = true;
        return true;
      },
      verify: async (operation, signal) => {
        assertActive$2(signal);
        return operation.kind === "choose" && operation.optionId === options.optionId && isLiveElement(clickTarget) && isLiveElement(readTarget) && isSelected();
      },
      revert: async signal => {
        assertActive$2(signal);
        if (!clicked) return true;
        if (!isLiveElement(clickTarget) || !isLiveElement(readTarget)) return false;
        if (!isCheckboxControl(clickTarget)) return false;
        if (isSelected()) clickTarget.click();
        clicked = false;
        return !isSelected();
      }
    };
  }

  function isCheckboxControl(target) {
    const view = target.ownerDocument.defaultView;
    if (!view) return false;
    const control = target instanceof view.HTMLLabelElement ? target.control : target;
    return control instanceof view.HTMLInputElement && control.type === "checkbox";
  }

  function writeEvents(element) {
    const view = element.ownerDocument.defaultView;
    if (!view) return;
    element.dispatchEvent(new view.Event("input", {
      bubbles: true
    }));
    element.dispatchEvent(new view.Event("change", {
      bubbles: true
    }));
  }

  function writeSelect(element, value) {
    var _a2;
    if (!isLiveElement(element)) return false;
    if (![ ...element.options ].some(option => option.value === value)) return false;
    const view = element.ownerDocument.defaultView;
    if (!view) return false;
    const setter = (_a2 = Object.getOwnPropertyDescriptor(view.HTMLSelectElement.prototype, "value")) == null ? void 0 : _a2.set;
    element.focus();
    if (setter) setter.call(element, value); else element.value = value;
    writeEvents(element);
    element.blur();
    return true;
  }

  function normalizeSelectContent(value) {
    return value.replace(/\s+/gu, " ").trim();
  }

  function selectOptionMaps(select, options) {
    var _a2;
    if (options == null) return null;
    if (options.length === 0) throw new RuleExecutionError("security_violation", "select option mapping cannot be empty");
    const valueByContent = new Map;
    const contentByValue = new Map;
    for (const option of options) {
      if (!validId(option.id) || !option.content.trim() || valueByContent.has(option.content) || contentByValue.has(option.id)) throw new RuleExecutionError("security_violation", "select option mapping is ambiguous");
      const domMatches = [ ...select.options ].filter(candidate => candidate.value === option.id);
      if (domMatches.length !== 1 || normalizeSelectContent(((_a2 = domMatches[0]) == null ? void 0 : _a2.textContent) ?? "") !== normalizeSelectContent(option.content)) throw new RuleExecutionError("security_violation", "select option mapping does not match DOM");
      valueByContent.set(option.content, option.id);
      contentByValue.set(option.id, option.content);
    }
    return {
      valueByContent: valueByContent,
      contentByValue: contentByValue
    };
  }

  function contentEditable(element) {
    var _a2;
    const value = (_a2 = element.getAttribute("contenteditable")) == null ? void 0 : _a2.toLowerCase();
    return value === "" || value === "true" || value === "plaintext-only";
  }

  function createDomWriteBindingTarget(options) {
    if (!validId(options.slotId)) throw new RuleExecutionError("security_violation", "invalid slot id");
    const element = htmlElement(options.element, "write target");
    const view = element.ownerDocument.defaultView;
    if (!view) throw new RuleExecutionError("security_violation", "write target has no window");
    const input = element instanceof view.HTMLInputElement ? element : void 0;
    const textarea = element instanceof view.HTMLTextAreaElement ? element : void 0;
    const select = element instanceof view.HTMLSelectElement ? element : void 0;
    const editor = !input && !textarea && !select && contentEditable(element);
    if (options.selectOptions && !select) throw new RuleExecutionError("security_violation", "select option mapping requires a select target");
    if (input && ![ "text", "search", "tel", "url", "email", "number" ].includes(input.type)) throw new RuleExecutionError("security_violation", `write target input type is not allowed: ${input.type}`);
    if (!input && !textarea && !select && !editor) throw new RuleExecutionError("security_violation", "write target must be a text input, textarea, select, or contenteditable");
    const selectMaps = select ? selectOptionMaps(select, options.selectOptions) : null;
    const write = value => {
      if (input || textarea) return writeText(input ?? textarea, value);
      if (select) {
        const selectValue = (selectMaps == null ? void 0 : selectMaps.valueByContent.get(value)) ?? value;
        if (selectMaps && !selectMaps.valueByContent.has(value)) return false;
        return writeSelect(select, selectValue);
      }
      if (!isLiveElement(element)) return false;
      element.focus();
      element.textContent = value;
      writeEvents(element);
      element.blur();
      return true;
    };
    const read = () => {
      var _a2;
      if (input || textarea) return ((_a2 = input ?? textarea) == null ? void 0 : _a2.value) ?? "";
      if (select) return (selectMaps == null ? void 0 : selectMaps.contentByValue.get(select.value)) ?? select.value;
      return element.textContent ?? "";
    };
    let previous = null;
    return {
      kind: "write",
      slotId: options.slotId,
      isConnected: () => isLiveElement(element),
      apply: async (operation, signal) => {
        assertActive$2(signal);
        if (operation.kind !== "write" || operation.slotId !== options.slotId || !isLiveElement(element)) return false;
        const before = read();
        if (!write(operation.value)) return false;
        previous ?? (previous = before);
        return true;
      },
      revert: async signal => {
        assertActive$2(signal);
        if (previous == null) return true;
        if (!isLiveElement(element)) return false;
        const restored = write(previous);
        if (restored) previous = null;
        return restored;
      },
      verify: async (operation, signal) => {
        assertActive$2(signal);
        return operation.kind === "write" && operation.slotId === options.slotId && isLiveElement(element) && read() === operation.value;
      }
    };
  }

  const MAX_TARGETS = 256;

  function domArgument$1(args, name, refs) {
    return refs.getDom(args[name]);
  }

  function domArrayArgument(args, name, refs) {
    const value = args[name];
    if (value == null) return [];
    if (!Array.isArray(value) || value.length > MAX_TARGETS) throw new RuleDomainError("invalid_type", `${name} must be a bounded DOM reference array`);
    return value.map(item => refs.getDom(item));
  }

  function stringArrayArgument$1(args, name) {
    const value = args[name];
    if (value == null) return [];
    if (!Array.isArray(value) || value.length > 64) throw new RuleDomainError("invalid_type", `${name} must be a bounded string array`);
    return value.map(item => {
      if (typeof item !== "string" || !item || item.length > 1024) throw new RuleDomainError("invalid_type", `${name} contains an invalid selector`);
      return item;
    });
  }

  function optionalString(args, name, maxLength = 1024) {
    const value = args[name];
    if (value == null) return void 0;
    if (typeof value !== "string" || value.length === 0 || value.length > maxLength) throw new RuleDomainError("invalid_type", `${name} must be a bounded string`);
    return value;
  }

  function parseLeafNode(value) {
    const parsed = LeafQuestionNodeSchema.safeParse(value);
    if (!parsed.success) throw new RuleDomainError("invalid_question_node", "capture node is not a valid leaf question");
    return parsed.data;
  }

  function selectedStrategy(args) {
    const kind = args.selectedBy;
    if (kind === "checked") return {
      kind: kind
    };
    if (kind === "class") {
      const name = optionalString(args, "selectedClass", 128);
      if (!name) throw new RuleDomainError("invalid_type", "selectedClass is required for class strategy");
      return {
        kind: kind,
        name: name
      };
    }
    if (kind === "attribute") {
      const name = optionalString(args, "selectedAttribute", 128);
      const value = optionalString(args, "selectedValue");
      if (!name || value == null) throw new RuleDomainError("invalid_type", "selectedAttribute and selectedValue are required");
      return {
        kind: kind,
        name: name,
        value: value
      };
    }
    if (kind === "descendant") {
      const selector = optionalString(args, "selectedDescendantSelector");
      if (!selector) throw new RuleDomainError("invalid_type", "selectedDescendantSelector is required for descendant strategy");
      return {
        kind: kind,
        selector: selector
      };
    }
    throw new RuleDomainError("invalid_type", "selectedBy must be checked, class, descendant, or attribute");
  }

  function queryReadTarget(element, selector) {
    if (!selector) return element;
    try {
      const target = element.querySelector(selector);
      if (!target) throw new RuleDomainError("binding_target_mismatch", `choice read target is missing: ${selector}`);
      return target;
    } catch (error) {
      if (error instanceof RuleDomainError) throw error;
      throw new RuleDomainError("invalid_selector", error instanceof Error ? error.message : "invalid read selector");
    }
  }

  function position(element) {
    return element.parentElement ? Array.from(element.parentElement.children).indexOf(element) : -1;
  }

  function targetDescriptor(element) {
    const view = element.ownerDocument.defaultView;
    const input = view && element instanceof view.HTMLInputElement ? element : void 0;
    const select = view && element instanceof view.HTMLSelectElement ? element : void 0;
    return [ element.tagName.toLowerCase(), (input == null ? void 0 : input.type) ?? "", element.getAttribute("name") ?? "", element.id, position(element), select ? [ ...select.options ].map(option => [ option.value, option.textContent ]) : [] ];
  }

  function domFingerprint(source) {
    const allTargets = [ source.stem, ...source.contentTargets, ...source.answerTargets ];
    if (allTargets.some(target => !target.isConnected)) throw new Error("binding fingerprint target is disconnected");
    return semanticContentHash(JSON.stringify([ serializeDomQuestionContent(source.stem, {
      stripSelectors: source.stemStripSelectors
    }), source.contentTargets.map(target => serializeDomQuestionContent(target, {
      stripSelectors: source.optionStripSelectors
    })), source.answerTargets.map(targetDescriptor) ]));
  }

  function leafDomRegistration(node, args, environment) {
    const stem = domArgument$1(args, "stemTarget", environment.refs);
    const stemStripSelectors = stringArrayArgument$1(args, "stemStripSelectors");
    const optionStripSelectors = stringArrayArgument$1(args, "optionStripSelectors");
    const choiceTargets2 = domArrayArgument(args, "choiceTargets", environment.refs);
    const rawContentTargets = domArrayArgument(args, "choiceContentTargets", environment.refs);
    let slotTargets = domArrayArgument(args, "slotTargets", environment.refs);
    if (args.slotTarget != null) {
      if (slotTargets.length > 0) throw new RuleDomainError("invalid_type", "slotTarget and slotTargets cannot be combined");
      slotTargets = [ domArgument$1(args, "slotTarget", environment.refs) ];
    }
    const targets = [];
    let contentTargets = [];
    let answerTargets = [];
    if ([ "single", "multiple", "judge" ].includes(node.type)) {
      contentTargets = rawContentTargets.length ? rawContentTargets : choiceTargets2;
      if (choiceTargets2.length !== node.options.length || contentTargets.length !== node.options.length || slotTargets.length !== 0) throw new RuleDomainError("binding_target_mismatch", "choice target count does not match question options");
      const selected2 = selectedStrategy(args);
      const readSelector = optionalString(args, "readSelector");
      for (let index = 0; index < node.options.length; index += 1) {
        const option = node.options[index];
        const clickTarget = choiceTargets2[index];
        if (!option || !clickTarget) throw new RuleDomainError("binding_target_mismatch", "choice target is missing");
        targets.push(createDomChoiceBindingTarget({
          optionId: option.id,
          clickTarget: clickTarget,
          readTarget: queryReadTarget(clickTarget, readSelector),
          selected: selected2,
          location: environment.location
        }));
      }
      answerTargets = choiceTargets2;
    } else {
      if (slotTargets.length !== node.slots.length || choiceTargets2.length !== 0 || rawContentTargets.length !== 0) throw new RuleDomainError("binding_target_mismatch", "slot target count does not match question slots");
      for (let index = 0; index < node.slots.length; index += 1) {
        const slot = node.slots[index];
        const element = slotTargets[index];
        if (!slot || !element) throw new RuleDomainError("binding_target_mismatch", "slot target is missing");
        targets.push(createDomWriteBindingTarget({
          slotId: slot.id,
          element: element,
          selectOptions: slot.options
        }));
      }
      answerTargets = slotTargets;
    }
    const fingerprintSource = {
      stem: stem,
      contentTargets: contentTargets,
      answerTargets: answerTargets,
      stemStripSelectors: stemStripSelectors,
      optionStripSelectors: optionStripSelectors
    };
    const capturedDomFingerprint = domFingerprint(fingerprintSource);
    const capturedQuestionFingerprint = questionNodeHash(node);
    return {
      readCurrentFingerprint: () => {
        const current = domFingerprint(fingerprintSource);
        return current === capturedDomFingerprint ? capturedQuestionFingerprint : current;
      },
      targets: targets
    };
  }

  function captureCall(operation) {
    try {
      return operation();
    } catch (error) {
      if (error instanceof RuleCaptureRegistryError) throw new RuleDomainError(error.code, error.message);
      throw error;
    }
  }

  function registerLeafDom(args, environment) {
    const node = parseLeafNode(args.node);
    captureCall(() => environment.capture.registerLeaf(node, leafDomRegistration(node, args, environment)));
    return node.path;
  }

  function registerLeafBindingDom(args, environment) {
    const node = parseLeafNode(args.node);
    captureCall(() => environment.capture.registerLeafBinding(node, leafDomRegistration(node, args, environment)));
    return node.path;
  }

  function registerTree(args, environment) {
    const parsed = QuestionNodeSchema.safeParse(args.root);
    if (!parsed.success) throw new RuleDomainError("invalid_question_node", "capture root is not a valid question tree");
    try {
      assertValidQuestionTree(parsed.data);
    } catch (error) {
      throw new RuleDomainError("invalid_question_node", error instanceof Error ? error.message : "invalid question tree");
    }
    captureCall(() => environment.capture.registerTree(parsed.data));
    return parsed.data.path;
  }

  function registerCapturePrimitives(registry, environment) {
    registry.register({
      id: "capture.registerLeafDom",
      phases: [ "capture" ],
      capability: "dom-read",
      execute: ({args: args}) => registerLeafDom(args, environment)
    });
    registry.register({
      id: "capture.registerLeafBindingDom",
      phases: [ "capture" ],
      capability: "dom-read",
      execute: ({args: args}) => registerLeafBindingDom(args, environment)
    });
    registry.register({
      id: "capture.registerTree",
      phases: [ "capture" ],
      execute: ({args: args}) => registerTree(args, environment)
    });
    registry.register({
      id: "capture.harvestLeaf",
      phases: [ "capture" ],
      capability: "dom-read",
      execute: ({args: args}) => captureCall(() => environment.capture.registerHarvestLeaf(args.node, args.values))
    });
    registry.register({
      id: "capture.finish",
      phases: [ "capture" ],
      execute: () => captureCall(() => environment.capture.finish())
    });
  }

  const READ_PHASES = [ "match", "capture", "diagnostic", "lifecycle", "fill" ];

  const SAFE_PROPERTIES = new Set([ "value", "checked", "selected", "disabled", "tagName", "type", "name", "id", "className" ]);

  function stringArgument$1(args, name) {
    const value = args[name];
    if (typeof value !== "string") throw new RuleDomainError("invalid_type", `${name} must be a string`);
    return value;
  }

  function domArgument(args, name, refs) {
    return refs.getDom(args[name]);
  }

  function stringArrayArgument(args, name) {
    const value = args[name];
    if (value == null) return [];
    if (!Array.isArray(value) || value.length > 64) throw new RuleDomainError("invalid_type", `${name} must be an array with at most 64 strings`);
    return value.map(item => {
      if (typeof item !== "string" || !item || item.length > 1024) throw new RuleDomainError("invalid_type", `${name} must contain non-empty bounded strings`);
      return item;
    });
  }

  function queryRoot(args, refs, fallback) {
    const from = args.from;
    if (from == null) return fallback;
    try {
      return refs.getDom(from);
    } catch (domError) {
      try {
        return refs.getFrame(from);
      } catch {
        throw domError;
      }
    }
  }

  function safeQuery(root, selector) {
    try {
      return root.querySelector(selector);
    } catch (error) {
      throw new RuleDomainError("invalid_selector", error instanceof Error ? error.message : "invalid selector");
    }
  }

  function safeQueryAll(root, selector) {
    try {
      return Array.from(root.querySelectorAll(selector));
    } catch (error) {
      throw new RuleDomainError("invalid_selector", error instanceof Error ? error.message : "invalid selector");
    }
  }

  function safeXPath(root, xpath, all) {
    var _a2;
    const document2 = root.nodeType === 9 ? root : root.ownerDocument;
    if (!document2) throw new RuleDomainError("xpath_unavailable", "XPath document is missing");
    const XPathResult = (_a2 = document2.defaultView) == null ? void 0 : _a2.XPathResult;
    if (!XPathResult) throw new RuleDomainError("xpath_unavailable", "XPath is unavailable");
    try {
      if (!all) {
        const result = document2.evaluate(xpath, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return (result == null ? void 0 : result.nodeType) === 1 ? [ result ] : [];
      }
      const iterator = document2.evaluate(xpath, root, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
      const elements = [];
      let node = iterator.iterateNext();
      while (node) {
        if (node.nodeType === 1) elements.push(node);
        node = iterator.iterateNext();
      }
      return elements;
    } catch (error) {
      throw new RuleDomainError("invalid_xpath", error instanceof Error ? error.message : "invalid XPath");
    }
  }

  function intervalArgument(args) {
    const value = args.intervalMs ?? 25;
    if (!Number.isInteger(value) || value < 10 || value > 1e3) throw new RuleDomainError("invalid_type", "intervalMs must be an integer between 10 and 1000");
    return value;
  }

  function boundedIntegerArgument(args, name, minimum, maximum) {
    const value = args[name];
    if (!Number.isInteger(value) || value < minimum || value > maximum) throw new RuleDomainError("invalid_type", `${name} must be an integer between ${minimum} and ${maximum}`);
    return value;
  }

  function findSameOriginFrameDocument(root, selector, maxDepth, maxFrames) {
    const queue = [ {
      document: root,
      depth: 0
    } ];
    const seen = new Set;
    let frames = 0;
    while (queue.length > 0) {
      const current = queue.shift();
      if (!current || seen.has(current.document)) continue;
      seen.add(current.document);
      if (safeQuery(current.document, selector)) return current.document;
      if (current.depth >= maxDepth) continue;
      for (const element of safeQueryAll(current.document, "iframe")) {
        frames += 1;
        if (frames > maxFrames) return null;
        let frameDocument = null;
        try {
          frameDocument = element.contentDocument;
        } catch {
          frameDocument = null;
        }
        if (frameDocument && !seen.has(frameDocument)) queue.push({
          document: frameDocument,
          depth: current.depth + 1
        });
      }
    }
    return null;
  }

  function collectSameOriginFrameDocuments(root, selector, maxDepth, maxFrames, maxResults) {
    const queue = [ {
      document: root,
      depth: 0
    } ];
    const seen = new Set;
    const found = [];
    let frames = 0;
    while (queue.length > 0) {
      const current = queue.shift();
      if (!current || seen.has(current.document)) continue;
      seen.add(current.document);
      if (safeQuery(current.document, selector)) {
        found.push(current.document);
        if (found.length >= maxResults) return found;
      }
      if (current.depth >= maxDepth) continue;
      for (const element of safeQueryAll(current.document, "iframe")) {
        frames += 1;
        if (frames > maxFrames) return found;
        let frameDocument = null;
        try {
          frameDocument = element.contentDocument;
        } catch {
          frameDocument = null;
        }
        if (frameDocument && !seen.has(frameDocument)) queue.push({
          document: frameDocument,
          depth: current.depth + 1
        });
      }
    }
    return found;
  }

  function waitForSameOriginFrames(args, document2, refs, signal) {
    const selector = stringArgument$1(args, "selector");
    const maxDepth = boundedIntegerArgument(args, "maxDepth", 0, 8);
    const maxFrames = boundedIntegerArgument(args, "maxFrames", 1, 128);
    const maxResults = boundedIntegerArgument(args, "maxResults", 1, 32);
    const waitMs = boundedIntegerArgument(args, "waitMs", 0, 8e3);
    const settleMs = boundedIntegerArgument(args, "settleMs", 0, 2e3);
    const intervalMs = intervalArgument(args);
    const find = () => collectSameOriginFrameDocuments(document2, selector, maxDepth, maxFrames, maxResults);
    const wrap = documents => documents.map(item => refs.createFrameRef(item));
    if (waitMs === 0) return wrap(find());
    return new Promise((resolve, reject) => {
      const startedAt = Date.now();
      let lastCount = -1;
      let changedAt = startedAt;
      const cleanup = () => {
        clearInterval(timer);
        signal.removeEventListener("abort", onAbort);
      };
      const onAbort = () => {
        cleanup();
        reject(new RuleExecutionError("cancelled", "frame.findAllSameOrigin cancelled"));
      };
      const timer = setInterval(() => {
        try {
          const found = find();
          const now = Date.now();
          if (found.length !== lastCount) {
            lastCount = found.length;
            changedAt = now;
          }
          if (found.length > 0 && now - changedAt >= settleMs || now - startedAt >= waitMs) {
            cleanup();
            resolve(wrap(found));
          }
        } catch (error) {
          cleanup();
          reject(error);
        }
      }, intervalMs);
      signal.addEventListener("abort", onAbort, {
        once: true
      });
    });
  }

  function waitForSameOriginFrame(args, document2, refs, signal) {
    const selector = stringArgument$1(args, "selector");
    const maxDepth = boundedIntegerArgument(args, "maxDepth", 0, 8);
    const maxFrames = boundedIntegerArgument(args, "maxFrames", 1, 128);
    const waitMs = boundedIntegerArgument(args, "waitMs", 0, 8e3);
    const intervalMs = intervalArgument(args);
    const find = () => findSameOriginFrameDocument(document2, selector, maxDepth, maxFrames);
    const immediate = find();
    if (immediate) return refs.createFrameRef(immediate);
    if (waitMs === 0) return null;
    return new Promise((resolve, reject) => {
      const startedAt = Date.now();
      const cleanup = () => {
        clearInterval(timer);
        signal.removeEventListener("abort", onAbort);
      };
      const onAbort = () => {
        cleanup();
        reject(new RuleExecutionError("cancelled", "frame.findSameOrigin cancelled"));
      };
      const timer = setInterval(() => {
        try {
          const found = find();
          if (found) {
            cleanup();
            resolve(refs.createFrameRef(found));
          } else if (Date.now() - startedAt >= waitMs) {
            cleanup();
            resolve(null);
          }
        } catch (error) {
          cleanup();
          reject(error);
        }
      }, intervalMs);
      signal.addEventListener("abort", onAbort, {
        once: true
      });
    });
  }

  function assertRevealTarget(element, location2, depth = 0) {
    const view = element.ownerDocument.defaultView;
    if (!view || !(element instanceof view.HTMLElement)) throw new RuleExecutionError("security_violation", "ui.reveal target must be an HTMLElement");
    const htmlElement2 = element;
    const tagName = htmlElement2.tagName.toLowerCase();
    if (tagName === "form") throw new RuleExecutionError("security_violation", "ui.reveal cannot activate forms");
    if (htmlElement2 instanceof view.HTMLButtonElement) {
      if (htmlElement2.type !== "button") throw new RuleExecutionError("security_violation", "ui.reveal cannot activate submit controls");
    }
    if (htmlElement2 instanceof view.HTMLInputElement) {
      if ([ "submit", "reset", "image" ].includes(htmlElement2.type)) throw new RuleExecutionError("security_violation", "ui.reveal cannot activate submit controls");
    }
    const label = htmlElement2 instanceof view.HTMLInputElement ? htmlElement2.value : "";
    if (/\u63d0\u4ea4|\u4ea4\u5377|\u5b8c\u6210\u8003\u8bd5|\bsubmit\b/iu.test(`${htmlElement2.textContent ?? ""}\n${label}`)) throw new RuleExecutionError("security_violation", "ui.reveal cannot activate submit controls");
    if (htmlElement2 instanceof view.HTMLLabelElement && depth === 0) {
      const control = htmlElement2.control;
      if (control) assertRevealTarget(control, location2, depth + 1);
    }
    if (htmlElement2 instanceof view.HTMLAnchorElement) {
      const target = new URL(htmlElement2.href, location2.href);
      if (target.protocol === "javascript:" || target.origin !== location2.origin) throw new RuleExecutionError("security_violation", "ui.reveal cannot navigate outside the current origin");
    }
    return htmlElement2;
  }

  function registerDomPrimitives(registry, environment) {
    const {document: document2, location: location2, refs: refs} = environment;
    registry.register({
      id: "dom.queryCss",
      phases: READ_PHASES,
      capability: "dom-read",
      execute: ({args: args}) => {
        const element = safeQuery(queryRoot(args, refs, document2), stringArgument$1(args, "selector"));
        return element ? refs.createDomRef(element) : null;
      }
    });
    registry.register({
      id: "dom.queryCssAll",
      phases: READ_PHASES,
      capability: "dom-read",
      execute: ({args: args}) => safeQueryAll(queryRoot(args, refs, document2), stringArgument$1(args, "selector")).map(element => refs.createDomRef(element))
    });
    registry.register({
      id: "dom.queryXPath",
      phases: READ_PHASES,
      capability: "dom-read",
      execute: ({args: args}) => {
        const element = safeXPath(queryRoot(args, refs, document2), stringArgument$1(args, "xpath"), false)[0];
        return element ? refs.createDomRef(element) : null;
      }
    });
    registry.register({
      id: "dom.queryXPathAll",
      phases: READ_PHASES,
      capability: "dom-read",
      execute: ({args: args}) => safeXPath(queryRoot(args, refs, document2), stringArgument$1(args, "xpath"), true).map(element => refs.createDomRef(element))
    });
    registry.register({
      id: "dom.text",
      phases: READ_PHASES,
      capability: "dom-read",
      execute: ({args: args}) => domArgument(args, "target", refs).textContent ?? ""
    });
    registry.register({
      id: "dom.content",
      phases: READ_PHASES,
      capability: "dom-read",
      execute: ({args: args, signal: signal}) => {
        try {
          return serializeDomQuestionContent(domArgument(args, "target", refs), {
            stripSelectors: stringArrayArgument(args, "stripSelectors"),
            signal: signal
          });
        } catch (error) {
          if (error instanceof DomContentError) {
            if (error.code === "budget_exceeded" || error.code === "cancelled") throw new RuleExecutionError(error.code, error.message);
            throw new RuleDomainError(error.code, error.message);
          }
          throw error;
        }
      }
    });
    registry.register({
      id: "dom.attr",
      phases: READ_PHASES,
      capability: "dom-read",
      execute: ({args: args}) => domArgument(args, "target", refs).getAttribute(stringArgument$1(args, "name"))
    });
    registry.register({
      id: "dom.property",
      phases: READ_PHASES,
      capability: "dom-read",
      execute: ({args: args}) => {
        const name = stringArgument$1(args, "name");
        if (!SAFE_PROPERTIES.has(name)) throw new RuleExecutionError("security_violation", `DOM property is not exposed: ${name}`);
        return domArgument(args, "target", refs)[name];
      }
    });
    registry.register({
      id: "dom.closest",
      phases: READ_PHASES,
      capability: "dom-read",
      execute: ({args: args}) => {
        let element;
        try {
          element = domArgument(args, "target", refs).closest(stringArgument$1(args, "selector"));
        } catch (error) {
          throw new RuleDomainError("invalid_selector", error instanceof Error ? error.message : "invalid selector");
        }
        return element ? refs.createDomRef(element) : null;
      }
    });
    registry.register({
      id: "dom.parent",
      phases: READ_PHASES,
      capability: "dom-read",
      execute: ({args: args}) => {
        const parent = domArgument(args, "target", refs).parentElement;
        return parent ? refs.createDomRef(parent) : null;
      }
    });
    registry.register({
      id: "dom.children",
      phases: READ_PHASES,
      capability: "dom-read",
      execute: ({args: args}) => Array.from(domArgument(args, "target", refs).children).map(element => refs.createDomRef(element))
    });
    registry.register({
      id: "dom.index",
      phases: READ_PHASES,
      capability: "dom-read",
      execute: ({args: args}) => {
        const element = domArgument(args, "target", refs);
        return element.parentElement ? Array.from(element.parentElement.children).indexOf(element) : -1;
      }
    });
    registry.register({
      id: "frame.list",
      phases: READ_PHASES,
      capability: "frame-read",
      execute: ({args: args}) => safeQueryAll(queryRoot(args, refs, document2), "iframe").map(frame => refs.createDomRef(frame))
    });
    registry.register({
      id: "frame.enter",
      phases: READ_PHASES,
      capability: "frame-read",
      execute: ({args: args}) => {
        const frame = domArgument(args, "target", refs);
        if (frame.tagName.toLowerCase() !== "iframe") throw new RuleDomainError("invalid_type", "target is not an iframe");
        let frameDocument;
        try {
          frameDocument = frame.contentDocument;
        } catch {
          return null;
        }
        return frameDocument ? refs.createFrameRef(frameDocument) : null;
      }
    });
    registry.register({
      id: "frame.findSameOrigin",
      phases: READ_PHASES,
      capability: "frame-read",
      execute: ({args: args, signal: signal}) => waitForSameOriginFrame(args, document2, refs, signal)
    });
    registry.register({
      id: "frame.findAllSameOrigin",
      phases: READ_PHASES,
      capability: "frame-read",
      execute: ({args: args, signal: signal}) => waitForSameOriginFrames(args, document2, refs, signal)
    });
    registry.register({
      id: "page.location",
      phases: READ_PHASES,
      capability: "runtime-read",
      execute: () => ({
        href: location2.href,
        origin: location2.origin,
        protocol: location2.protocol,
        host: location2.host,
        pathname: location2.pathname
      })
    });
    registry.register({
      id: "page.queryParam",
      phases: READ_PHASES,
      capability: "runtime-read",
      execute: ({args: args}) => new URL(location2.href).searchParams.get(stringArgument$1(args, "name"))
    });
    registry.register({
      id: "ui.reveal",
      phases: [ "lifecycle" ],
      capability: "ui-reveal",
      execute: ({args: args}) => {
        const element = assertRevealTarget(domArgument(args, "target", refs), location2);
        element.click();
        return true;
      }
    });
    registry.register({
      id: "wait.selector",
      phases: READ_PHASES,
      capability: "dom-read",
      execute: ({args: args, signal: signal}) => {
        const root = queryRoot(args, refs, document2);
        const selector = stringArgument$1(args, "selector");
        const intervalMs = intervalArgument(args);
        const immediate = safeQuery(root, selector);
        if (immediate) return refs.createDomRef(immediate);
        return new Promise((resolve, reject) => {
          const cleanup = () => {
            clearInterval(timer);
            signal.removeEventListener("abort", onAbort);
          };
          const onAbort = () => {
            cleanup();
            reject(new RuleExecutionError("cancelled", "wait.selector cancelled"));
          };
          const timer = setInterval(() => {
            try {
              const element = safeQuery(root, selector);
              if (!element) return;
              cleanup();
              resolve(refs.createDomRef(element));
            } catch (error) {
              cleanup();
              reject(error);
            }
          }, intervalMs);
          signal.addEventListener("abort", onAbort, {
            once: true
          });
        });
      }
    });
  }

  function maxTriggers(args) {
    const value = args.maxTriggers;
    if (!Number.isInteger(value) || value <= 0 || value > 1e3) throw new RuleDomainError("invalid_type", "maxTriggers must be an integer between 1 and 1000");
    return value;
  }

  function registerObserverPrimitives(registry, environment) {
    const {window: window2, document: document2, MutationObserver: MutationObserver, refs: refs, resources: resources, emit: emit} = environment;
    registry.register({
      id: "observe.mutation",
      phases: [ "lifecycle" ],
      capability: "dom-read",
      execute: ({args: args}) => {
        const limit = maxTriggers(args);
        const target = args.target == null ? document2.documentElement : refs.getDom(args.target);
        if (!target) throw new RuleDomainError("missing_target", "mutation target is missing");
        let active2 = true;
        let trigger = 0;
        const observer = new MutationObserver(mutations => {
          if (!active2) return;
          trigger += 1;
          emit({
            event: "dom-change",
            payload: {
              mutationCount: mutations.length,
              trigger: trigger
            }
          });
          if (trigger >= limit) cleanup();
        });
        const cleanup = () => {
          if (!active2) return;
          active2 = false;
          observer.disconnect();
        };
        resources.add(cleanup);
        observer.observe(target, {
          attributes: true,
          childList: true,
          subtree: true
        });
        return true;
      }
    });
    let urlHookInstalled = false;
    registry.register({
      id: "observe.urlChange",
      phases: [ "lifecycle" ],
      capability: "runtime-read",
      execute: ({args: args}) => {
        if (urlHookInstalled) throw new RuleExecutionError("security_violation", "URL observer is already installed");
        urlHookInstalled = true;
        const limit = maxTriggers(args);
        const history = window2.history;
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        let active2 = true;
        let trigger = 0;
        const cleanup = () => {
          if (!active2) return;
          active2 = false;
          window2.removeEventListener("popstate", notify);
          if (history.pushState === wrappedPushState) history.pushState = originalPushState;
          if (history.replaceState === wrappedReplaceState) history.replaceState = originalReplaceState;
          urlHookInstalled = false;
        };
        const notify = () => {
          if (!active2) return;
          trigger += 1;
          emit({
            event: "url-change",
            payload: {
              origin: window2.location.origin,
              pathname: window2.location.pathname
            }
          });
          if (trigger >= limit) cleanup();
        };
        const wrappedPushState = function pushState(data, unused, url) {
          originalPushState.call(history, data, unused, url);
          notify();
        };
        const wrappedReplaceState = function replaceState(data, unused, url) {
          originalReplaceState.call(history, data, unused, url);
          notify();
        };
        history.pushState = wrappedPushState;
        history.replaceState = wrappedReplaceState;
        window2.addEventListener("popstate", notify);
        resources.add(cleanup);
        return true;
      }
    });
  }

  const TRANSFORM_PHASES = [ "match", "capture", "diagnostic", "lifecycle" ];

  const MAX_TRANSFORM_TEXT_BYTES = 128 * 1024;

  const BLOCKED_HTML_CONTENT = /<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/giu;

  function stringArgument(args, name) {
    const value = args[name];
    if (typeof value !== "string") throw new RuleDomainError("invalid_type", `${name} must be a string`);
    if ((new TextEncoder).encode(value).length > MAX_TRANSFORM_TEXT_BYTES) throw new RuleExecutionError("budget_exceeded", `${name} exceeds transform byte limit`);
    return value;
  }

  function sanitizeQuestionContent(value) {
    const withoutBlockedContent = value.replace(BLOCKED_HTML_CONTENT, "");
    return collapseWs(parseQuestionContent(withoutBlockedContent).map(part => part.type === "image" ? serializeImageToken(part.value) : serializeQuestionText(part.value)).join(""));
  }

  function registerTransformPrimitives(registry) {
    registry.register({
      id: "content.sanitize",
      phases: TRANSFORM_PHASES,
      execute: ({args: args, signal: signal}) => {
        if (signal.aborted) throw new RuleExecutionError("cancelled", "content.sanitize was cancelled");
        return sanitizeQuestionContent(stringArgument(args, "value"));
      }
    });
    registry.register({
      id: "text.stripOptionPrefix",
      phases: TRANSFORM_PHASES,
      execute: ({args: args}) => stripOptionPrefix(stringArgument(args, "value"))
    });
    registry.register({
      id: "text.includes",
      phases: TRANSFORM_PHASES,
      execute: ({args: args}) => stringArgument(args, "value").includes(stringArgument(args, "search"))
    });
    registry.register({
      id: "text.normalizeTruth",
      phases: TRANSFORM_PHASES,
      execute: ({args: args}) => normalizeTruth(stringArgument(args, "value"))
    });
    registry.register({
      id: "question.normalizeLeafType",
      phases: TRANSFORM_PHASES,
      execute: ({args: args}) => normalizeLeafQuestionType(stringArgument(args, "value"))
    });
    registry.register({
      id: "array.append",
      phases: TRANSFORM_PHASES,
      execute: ({args: args}) => {
        const items = JsonRuleValueSchema.safeParse(args.items);
        const value = JsonRuleValueSchema.safeParse(args.value);
        if (!items.success || !Array.isArray(items.data) || !value.success) throw new RuleDomainError("invalid_type", "array.append requires JSON items and value");
        const maxItems = args.maxItems;
        if (!Number.isInteger(maxItems) || maxItems <= 0 || maxItems > RULE_HARD_LIMITS.maxLoopIterations) throw new RuleDomainError("invalid_type", "maxItems must be a bounded positive integer");
        if (items.data.length >= maxItems) throw new RuleExecutionError("budget_exceeded", "array.append item budget exceeded");
        return [ ...items.data, value.data ];
      }
    });
  }

  const RULE_DISPATCHED_EVENTS = new Set([ "dom-change", "url-change" ]);

  function registerCoreRulePrimitives(registry, environment) {
    const {document: document2, location: location2, refs: refs, capture: capture2, writer: writer, resources: resources, emit: emit} = environment;
    registerDomPrimitives(registry, {
      document: document2,
      location: location2,
      refs: refs
    });
    registerTransformPrimitives(registry);
    registerCapturePrimitives(registry, {
      refs: refs,
      capture: capture2,
      location: location2
    });
    registerAnswerWritePrimitives(registry, writer);
    const view = document2.defaultView;
    if (!view) return;
    registerObserverPrimitives(registry, {
      window: view,
      document: document2,
      MutationObserver: view.MutationObserver,
      refs: refs,
      resources: resources,
      emit: emit ?? (() => void 0)
    });
  }

  const FORBIDDEN_KEYS$2 = new Set([ "__proto__", "prototype", "constructor" ]);

  class ReturnSignal {
    constructor(value) {
      this.value = value;
    }
  }

  function validatePositiveLimit(name, value, maximum) {
    if (!Number.isInteger(value) || value <= 0 || value > maximum) {
      throw new RuleExecutionError("security_violation", `invalid runtime limit ${name}: ${value}`);
    }
  }

  function resolveLimits(policy, requested) {
    validatePositiveLimit("maxSteps", policy.limits.maxSteps, RULE_HARD_LIMITS.maxSteps);
    validatePositiveLimit("maxWallMs", policy.limits.maxWallMs, RULE_HARD_LIMITS.maxWallMs);
    validatePositiveLimit("maxAsyncMs", policy.limits.maxAsyncMs, RULE_HARD_LIMITS.maxAsyncMs);
    validatePositiveLimit("maxLoopIterations", policy.limits.maxLoopIterations, RULE_HARD_LIMITS.maxLoopIterations);
    validatePositiveLimit("maxCallDepth", policy.limits.maxCallDepth, RULE_HARD_LIMITS.maxCallDepth);
    validatePositiveLimit("maxDomRefs", policy.limits.maxDomRefs, RULE_HARD_LIMITS.maxDomRefs);
    const limits = {
      ...policy.limits,
      ...requested
    };
    for (const key of Object.keys(limits)) {
      if (limits[key] > policy.limits[key]) {
        throw new RuleExecutionError("security_violation", `rule cannot expand runtime limit: ${key}`);
      }
    }
    return limits;
  }

  function checkExecution(state) {
    var _a2;
    if ((_a2 = state.signal) == null ? void 0 : _a2.aborted) {
      throw new RuleExecutionError("cancelled", "rule execution cancelled");
    }
    if (state.now() - state.startedAt >= state.limits.maxWallMs) {
      throw new RuleExecutionError("timeout", "rule execution timed out");
    }
  }

  function consumeStep(state) {
    checkExecution(state);
    state.steps += 1;
    if (state.steps > state.limits.maxSteps) {
      throw new RuleExecutionError("budget_exceeded", "rule step budget exceeded");
    }
  }

  function requireBoolean(value, label) {
    if (typeof value !== "boolean") {
      throw new RuleDomainError("invalid_type", `${label} must be boolean`);
    }
    return value;
  }

  function requireString(value, label) {
    if (typeof value !== "string") {
      throw new RuleDomainError("invalid_type", `${label} must be string`);
    }
    return value;
  }

  function ownDataProperty$1(value, key) {
    const normalizedKey = String(key);
    if (FORBIDDEN_KEYS$2.has(normalizedKey)) {
      throw new RuleExecutionError("security_violation", `forbidden property path: ${normalizedKey}`);
    }
    if (typeof value !== "object" && typeof value !== "function" || value == null) {
      throw new RuleDomainError("invalid_type", "path source must be an object");
    }
    const descriptor = Object.getOwnPropertyDescriptor(value, normalizedKey);
    if (!descriptor) return null;
    if (!("value" in descriptor)) {
      throw new RuleExecutionError("security_violation", `property getter is not readable: ${normalizedKey}`);
    }
    return descriptor.value;
  }

  function isJsonComparable(value) {
    if (value === null || typeof value === "boolean" || typeof value === "number" || typeof value === "string") {
      return typeof value !== "number" || Number.isFinite(value);
    }
    if (Array.isArray(value)) return value.every(isJsonComparable);
    if (typeof value !== "object") return false;
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) return false;
    const record = value;
    return Object.keys(record).every(key => {
      if (FORBIDDEN_KEYS$2.has(key)) return false;
      const descriptor = Object.getOwnPropertyDescriptor(record, key);
      return Boolean(descriptor && "value" in descriptor && isJsonComparable(descriptor.value));
    });
  }

  function valuesEqual(left, right) {
    if (Object.is(left, right)) return true;
    if (!isJsonComparable(left) || !isJsonComparable(right)) return false;
    return canonicalize(left) === canonicalize(right);
  }

  function compareValues(kind, left, right) {
    if (kind === "eq") return valuesEqual(left, right);
    if (kind === "ne") return !valuesEqual(left, right);
    if (typeof left !== "number" && typeof left !== "string" || typeof left !== typeof right) {
      throw new RuleDomainError("invalid_type", `comparison ${kind} requires matching strings or numbers`);
    }
    if (typeof left === "number") {
      const numericRight = right;
      if (kind === "gt") return left > numericRight;
      if (kind === "gte") return left >= numericRight;
      if (kind === "lt") return left < numericRight;
      return left <= numericRight;
    }
    const stringRight = right;
    if (kind === "gt") return left > stringRight;
    if (kind === "gte") return left >= stringRight;
    if (kind === "lt") return left < stringRight;
    return left <= stringRight;
  }

  function formatValue(value) {
    if (value === null) return "";
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
    if (isJsonComparable(value)) return canonicalize(value);
    throw new RuleDomainError("invalid_type", "format argument is not JSON data");
  }

  function restoreVariable(variables, name, previous) {
    if (previous.present) variables.set(name, previous.value); else variables.delete(name);
  }

  function requireArray(value, label) {
    if (!Array.isArray(value)) {
      throw new RuleDomainError("invalid_type", `${label} must be an array`);
    }
    return value;
  }

  function requireJsonValue(value, label) {
    if (!isJsonComparable(value)) {
      throw new RuleDomainError("invalid_type", `${label} must be JSON data`);
    }
    return value;
  }

  function assertCollectionBudget(length, maxIterations, state) {
    if (!Number.isInteger(maxIterations) || maxIterations <= 0 || maxIterations > state.limits.maxLoopIterations || length > maxIterations) {
      throw new RuleExecutionError("budget_exceeded", "collection iteration budget exceeded");
    }
  }

  function assertDistinctVariables(names) {
    const present = names.filter(name => name != null);
    if (new Set(present).size !== present.length || present.some(name => name.startsWith("$") || FORBIDDEN_KEYS$2.has(name))) {
      throw new RuleExecutionError("security_violation", "collection variables must be distinct non-reserved names");
    }
  }

  async function raceBounded(operation, state, timeoutMs) {
    checkExecution(state);
    const remainingWall = Math.max(1, state.limits.maxWallMs - (state.now() - state.startedAt));
    const boundedTimeout = Math.min(timeoutMs, state.limits.maxAsyncMs, remainingWall);
    const controller = new AbortController;
    let timer;
    let onAbort;
    const boundary = new Promise((_, reject) => {
      timer = setTimeout(() => {
        reject(new RuleExecutionError("timeout", "rule async operation timed out"));
        controller.abort();
      }, boundedTimeout);
      if (state.signal) {
        onAbort = () => {
          reject(new RuleExecutionError("cancelled", "rule execution cancelled"));
          controller.abort();
        };
        state.signal.addEventListener("abort", onAbort, {
          once: true
        });
      }
    });
    try {
      return await Promise.race([ operation(controller.signal), boundary ]);
    } finally {
      if (timer !== void 0) clearTimeout(timer);
      if (state.signal && onAbort) state.signal.removeEventListener("abort", onAbort);
      controller.abort();
    }
  }

  async function evaluateExpr(expr, variables, state) {
    consumeStep(state);
    switch (expr.op) {
     case "literal":
      return expr.value;

     case "var":
      if (!variables.has(expr.name)) {
        throw new RuleDomainError("missing_variable", `missing variable: ${expr.name}`);
      }
      return variables.get(expr.name);

     case "path":
      {
        let value = await evaluateExpr(expr.from, variables, state);
        for (const segment of expr.path) value = ownDataProperty$1(value, segment);
        return value;
      }

     case "coalesce":
      for (const candidate of expr.values) {
        const value = await evaluateExpr(candidate, variables, state);
        if (value !== null && value !== void 0) return value;
      }
      return null;

     case "compare":
      return compareValues(expr.kind, await evaluateExpr(expr.left, variables, state), await evaluateExpr(expr.right, variables, state));

     case "logic":
      {
        if (expr.kind === "and") {
          for (const valueExpr of expr.values) {
            if (!requireBoolean(await evaluateExpr(valueExpr, variables, state), "logic operand")) return false;
          }
          return true;
        }
        for (const valueExpr of expr.values) {
          if (requireBoolean(await evaluateExpr(valueExpr, variables, state), "logic operand")) return true;
        }
        return false;
      }

     case "not":
      return !requireBoolean(await evaluateExpr(expr.value, variables, state), "not operand");

     case "array":
      {
        const result = [];
        for (const item of expr.items) {
          result.push(requireJsonValue(await evaluateExpr(item, variables, state), "array item"));
        }
        return result;
      }

     case "object":
      {
        const result = Object.create(null);
        for (const [key, value] of Object.entries(expr.entries)) {
          if (FORBIDDEN_KEYS$2.has(key)) {
            throw new RuleExecutionError("security_violation", `forbidden object key: ${key}`);
          }
          result[key] = requireJsonValue(await evaluateExpr(value, variables, state), `object entry ${key}`);
        }
        return result;
      }

     case "map":
     case "filter":
      {
        const items = requireArray(await evaluateExpr(expr.items, variables, state), `${expr.op} items`);
        assertCollectionBudget(items.length, expr.maxIterations, state);
        assertDistinctVariables([ expr.item, expr.index ]);
        const itemPrevious = {
          present: variables.has(expr.item),
          value: variables.get(expr.item)
        };
        const indexPrevious = expr.index ? {
          present: variables.has(expr.index),
          value: variables.get(expr.index)
        } : null;
        const result = [];
        try {
          for (let index = 0; index < items.length; index += 1) {
            consumeStep(state);
            variables.set(expr.item, items[index]);
            if (expr.index) variables.set(expr.index, index);
            if (expr.op === "map") {
              result.push(requireJsonValue(await evaluateExpr(expr.value, variables, state), "map result"));
            } else if (requireBoolean(await evaluateExpr(expr.when, variables, state), "filter condition")) {
              result.push(requireJsonValue(items[index], "filter result"));
            }
          }
        } finally {
          restoreVariable(variables, expr.item, itemPrevious);
          if (expr.index && indexPrevious) restoreVariable(variables, expr.index, indexPrevious);
        }
        return result;
      }

     case "reduce":
      {
        const items = requireArray(await evaluateExpr(expr.items, variables, state), "reduce items");
        assertCollectionBudget(items.length, expr.maxIterations, state);
        assertDistinctVariables([ expr.item, expr.index, expr.accumulator ]);
        let accumulator = requireJsonValue(await evaluateExpr(expr.initial, variables, state), "reduce initial value");
        const itemPrevious = {
          present: variables.has(expr.item),
          value: variables.get(expr.item)
        };
        const indexPrevious = expr.index ? {
          present: variables.has(expr.index),
          value: variables.get(expr.index)
        } : null;
        const accumulatorPrevious = {
          present: variables.has(expr.accumulator),
          value: variables.get(expr.accumulator)
        };
        try {
          for (let index = 0; index < items.length; index += 1) {
            consumeStep(state);
            variables.set(expr.item, items[index]);
            if (expr.index) variables.set(expr.index, index);
            variables.set(expr.accumulator, accumulator);
            accumulator = requireJsonValue(await evaluateExpr(expr.value, variables, state), "reduce result");
          }
        } finally {
          restoreVariable(variables, expr.item, itemPrevious);
          if (expr.index && indexPrevious) restoreVariable(variables, expr.index, indexPrevious);
          restoreVariable(variables, expr.accumulator, accumulatorPrevious);
        }
        return accumulator;
      }

     case "string":
      {
        const value = requireString(await evaluateExpr(expr.value, variables, state), "string operand");
        if (expr.kind === "trim") return value.trim();
        if (expr.kind === "collapseWs") return value.replace(/\s+/gu, " ").trim();
        if (expr.kind === "lower") return value.toLocaleLowerCase();
        return value.toLocaleUpperCase();
      }

     case "regex":
      {
        if (!state.services.regex) {
          throw new RuleExecutionError("unsupported_expression", "regex executor is not installed");
        }
        const value = requireString(await evaluateExpr(expr.value, variables, state), "regex operand");
        return raceBounded(signal => {
          var _a2, _b;
          return (_b = (_a2 = state.services).regex) == null ? void 0 : _b.call(_a2, {
            kind: expr.kind,
            value: value,
            pattern: expr.pattern,
            flags: expr.flags,
            replacement: expr.replacement,
            signal: signal,
            timeoutMs: state.limits.maxAsyncMs
          });
        }, state, state.limits.maxAsyncMs);
      }

     case "jsonPath":
      {
        if (!state.services.jsonPath) {
          throw new RuleExecutionError("unsupported_expression", "JSONPath executor is not installed");
        }
        const value = await evaluateExpr(expr.from, variables, state);
        return raceBounded(async signal => {
          var _a2, _b;
          return (_b = (_a2 = state.services).jsonPath) == null ? void 0 : _b.call(_a2, {
            value: value,
            query: expr.query,
            signal: signal
          });
        }, state, state.limits.maxAsyncMs);
      }

     case "format":
      {
        const values = new Map;
        for (const [name, argument] of Object.entries(expr.args)) {
          values.set(name, formatValue(await evaluateExpr(argument, variables, state)));
        }
        return expr.template.replace(/\{([A-Za-z_][A-Za-z0-9_]*)\}/gu, (_, name) => values.has(name) ? values.get(name) ?? "" : `{${name}}`);
      }
    }
  }

  async function executeFlow(flow, variables, state, depth) {
    if (depth > state.limits.maxCallDepth) {
      throw new RuleExecutionError("call_depth_exceeded", "rule call depth exceeded");
    }
    try {
      await executeSteps(flow.steps, variables, state, depth);
      return null;
    } catch (error) {
      if (error instanceof ReturnSignal) return error.value;
      throw error;
    }
  }

  async function executeSteps(steps, variables, state, depth) {
    for (const step of steps) {
      consumeStep(state);
      switch (step.type) {
       case "set":
        if (step.name.startsWith("$") || FORBIDDEN_KEYS$2.has(step.name)) {
          throw new RuleExecutionError("security_violation", `cannot set reserved variable: ${step.name}`);
        }
        variables.set(step.name, await evaluateExpr(step.value, variables, state));
        break;

       case "if":
        if (requireBoolean(await evaluateExpr(step.when, variables, state), "if condition")) await executeSteps(step.then, variables, state, depth); else if (step.else) await executeSteps(step.else, variables, state, depth);
        break;

       case "switch":
        {
          const value = await evaluateExpr(step.value, variables, state);
          const selected2 = step.cases.find(candidate => valuesEqual(value, candidate.equals));
          if (selected2) await executeSteps(selected2.steps, variables, state, depth); else if (step.default) await executeSteps(step.default, variables, state, depth);
          break;
        }

       case "forEach":
        {
          const items = await evaluateExpr(step.items, variables, state);
          if (!Array.isArray(items)) {
            throw new RuleDomainError("invalid_type", "forEach items must be an array");
          }
          if (step.maxIterations > state.limits.maxLoopIterations || items.length > step.maxIterations) {
            throw new RuleExecutionError("budget_exceeded", "forEach iteration budget exceeded");
          }
          const itemPrevious = {
            present: variables.has(step.item),
            value: variables.get(step.item)
          };
          const indexPrevious = step.index ? {
            present: variables.has(step.index),
            value: variables.get(step.index)
          } : null;
          try {
            for (let index = 0; index < items.length; index += 1) {
              consumeStep(state);
              variables.set(step.item, items[index]);
              if (step.index) variables.set(step.index, index);
              await executeSteps(step.steps, variables, state, depth);
            }
          } finally {
            restoreVariable(variables, step.item, itemPrevious);
            if (step.index && indexPrevious) restoreVariable(variables, step.index, indexPrevious);
          }
          break;
        }

       case "while":
        {
          if (step.maxIterations > state.limits.maxLoopIterations) {
            throw new RuleExecutionError("budget_exceeded", "while iteration budget exceeded");
          }
          let iterations = 0;
          while (requireBoolean(await evaluateExpr(step.when, variables, state), "while condition")) {
            if (iterations >= step.maxIterations) {
              throw new RuleExecutionError("budget_exceeded", "while iteration budget exceeded");
            }
            iterations += 1;
            consumeStep(state);
            await executeSteps(step.steps, variables, state, depth);
          }
          break;
        }

       case "callFlow":
        {
          const target = state.flows.get(step.flowId);
          if (!target) {
            throw new RuleDomainError("missing_flow", `missing flow: ${step.flowId}`);
          }
          const childVariables = new Map(variables);
          const evaluatedArgs = new Map;
          for (const [name, argument] of Object.entries(step.args ?? {})) {
            evaluatedArgs.set(name, await evaluateExpr(argument, variables, state));
          }
          for (const param of target.params ?? []) {
            if (evaluatedArgs.has(param)) childVariables.set(param, evaluatedArgs.get(param)); else if (!childVariables.has(param)) throw new RuleDomainError("missing_variable", `missing flow argument: ${param}`);
          }
          const result = await executeFlow(target, childVariables, state, depth + 1);
          if (step.result) variables.set(step.result, result);
          break;
        }

       case "return":
        throw new ReturnSignal(step.value ? await evaluateExpr(step.value, variables, state) : null);

       case "try":
        {
          try {
            await executeSteps(step.steps, variables, state, depth);
          } catch (error) {
            if (!(error instanceof RuleDomainError) || !step.catch) throw error;
            const previous = {
              present: variables.has("$error"),
              value: variables.get("$error")
            };
            variables.set("$error", error.toRuleValue());
            try {
              await executeSteps(step.catch, variables, state, depth);
            } finally {
              restoreVariable(variables, "$error", previous);
            }
          } finally {
            if (step.finally) await executeSteps(step.finally, variables, state, depth);
          }
          break;
        }

       case "primitive":
        {
          const args = Object.create(null);
          for (const [name, argument] of Object.entries(step.args ?? {})) {
            args[name] = await evaluateExpr(argument, variables, state);
          }
          const invocation = {
            id: step.id,
            args: args,
            phase: state.phase,
            signal: (new AbortController).signal,
            variables: variables,
            requestedCapabilities: state.requestedCapabilities
          };
          const definition = assertPrimitiveAllowed(state.registry, state.policy, invocation);
          const result = await raceBounded(signal => invokePrimitive(definition, {
            ...invocation,
            signal: signal
          }), state, step.timeoutMs ?? state.limits.maxAsyncMs);
          if (step.result) variables.set(step.result, result);
          break;
        }
      }
    }
  }

  class RuleInterpreter {
    constructor(options) {
      __publicField(this, "now");
      this.options = options;
      this.now = options.now ?? Date.now;
    }
    async run(flow, options) {
      var _a2, _b;
      const startedAt = this.now();
      (_a2 = options.resources) == null ? void 0 : _a2.bind(options.signal);
      try {
        const requestedCapabilities = options.capabilities ?? this.options.policy.capabilities;
        for (const capability of requestedCapabilities) {
          if (!this.options.policy.capabilities.has(capability)) {
            throw new RuleExecutionError("capability_denied", `rule cannot expand runtime capability: ${capability}`);
          }
        }
        const flows = new Map;
        for (const candidate of [ flow, ...options.flows ?? [] ]) {
          const existing = flows.get(candidate.id);
          if (existing && existing !== candidate) {
            throw new RuleExecutionError("security_violation", `duplicate flow id: ${candidate.id}`);
          }
          flows.set(candidate.id, candidate);
        }
        const variables = new Map;
        for (const [name, value2] of Object.entries(options.variables ?? {})) {
          if (name.startsWith("$") || FORBIDDEN_KEYS$2.has(name)) {
            throw new RuleExecutionError("security_violation", `invalid input variable: ${name}`);
          }
          variables.set(name, value2);
        }
        for (const [name, value2] of Object.entries(options.reserved ?? {})) {
          if (!name.startsWith("$") || FORBIDDEN_KEYS$2.has(name.slice(1))) {
            throw new RuleExecutionError("security_violation", `invalid reserved variable: ${name}`);
          }
          variables.set(name, value2);
        }
        const state = {
          phase: options.phase,
          policy: this.options.policy,
          registry: this.options.registry,
          services: this.options.services ?? {},
          requestedCapabilities: requestedCapabilities,
          signal: options.signal,
          limits: resolveLimits(this.options.policy, options.limits),
          startedAt: startedAt,
          now: this.now,
          flows: flows,
          steps: 0
        };
        checkExecution(state);
        const value = await executeFlow(flow, variables, state, 1);
        return {
          value: value,
          steps: state.steps,
          elapsedMs: this.now() - startedAt,
          variables: new Map(variables)
        };
      } catch (error) {
        await ((_b = options.resources) == null ? void 0 : _b.dispose());
        throw error;
      }
    }
  }

  const utf8Length$2 = value => (new TextEncoder).encode(value).length;

  function validateRequest(input) {
    if (!input || typeof input !== "object") throw new Error("invalid regex request");
    const request = input;
    if (![ "test", "extract", "replace" ].includes(String(request.kind))) throw new Error("invalid regex kind");
    if (typeof request.value !== "string" || typeof request.pattern !== "string" || request.flags != null && typeof request.flags !== "string" || request.replacement != null && typeof request.replacement !== "string") throw new Error("invalid regex request");
    if (utf8Length$2(request.pattern) > RULE_HARD_LIMITS.maxRegexPatternBytes || utf8Length$2(request.value) > RULE_HARD_LIMITS.maxRegexValueBytes || typeof request.replacement === "string" && utf8Length$2(request.replacement) > RULE_HARD_LIMITS.maxRegexValueBytes) throw new Error("regex input exceeds byte limit");
    const flags = request.flags ?? "";
    if (!/^[dgimsuvy]*$/u.test(flags) || new Set(flags).size !== flags.length) throw new Error("invalid regex flags");
    return {
      kind: request.kind,
      value: request.value,
      pattern: request.pattern,
      flags: flags,
      replacement: request.replacement
    };
  }

  function outputWithinLimit(value) {
    try {
      return isJsonRuleValue(value) && utf8Length$2(JSON.stringify(value)) <= RULE_HARD_LIMITS.maxRegexValueBytes;
    } catch {
      return false;
    }
  }

  function isJsonRuleValue(value) {
    if (value === null || typeof value === "boolean" || typeof value === "string") return true;
    if (typeof value === "number") return Number.isFinite(value);
    if (Array.isArray(value)) return value.every(isJsonRuleValue);
    if (!value || typeof value !== "object") return false;
    return Object.keys(value).every(key => ![ "__proto__", "prototype", "constructor" ].includes(key) && isJsonRuleValue(value[key]));
  }

  function parseWorkerResponse(input) {
    if (!input || typeof input !== "object") throw new RuleExecutionError("security_violation", "invalid regex worker response");
    const response = input;
    if (response.ok === true && Object.hasOwn(response, "value")) {
      const value = response.value;
      if (!outputWithinLimit(value)) throw new RuleExecutionError("security_violation", "regex worker output exceeds byte limit");
      return {
        ok: true,
        value: value
      };
    }
    if (response.ok === false && (response.code === "regex_error" || response.code === "security_violation") && typeof response.error === "string") {
      return {
        ok: false,
        code: response.code,
        error: response.error
      };
    }
    throw new RuleExecutionError("security_violation", "invalid regex worker response");
  }

  function validateExecutionRequest(request) {
    if (!Number.isInteger(request.timeoutMs) || request.timeoutMs <= 0 || request.timeoutMs > RULE_HARD_LIMITS.maxAsyncMs) throw new RuleExecutionError("security_violation", "invalid regex timeout");
    const validated = validateRequest(request);
    if (validated.kind !== request.kind) throw new RuleExecutionError("security_violation", "invalid regex request");
  }

  class IsolatedRegexExecutor {
    constructor(createWorker) {
      this.createWorker = createWorker;
    }
    execute(request) {
      try {
        validateExecutionRequest(request);
      } catch (error) {
        return Promise.reject(error instanceof RuleExecutionError ? error : new RuleExecutionError("security_violation", error instanceof Error ? error.message : "invalid regex request"));
      }
      if (request.signal.aborted) {
        return Promise.reject(new RuleExecutionError("cancelled", "regex execution cancelled"));
      }
      let worker;
      try {
        worker = this.createWorker();
      } catch (error) {
        return Promise.reject(new RuleDomainError("regex_worker_failed", error instanceof Error ? error.message : "regex worker failed"));
      }
      return new Promise((resolve, reject) => {
        let settled = false;
        const finish = callback => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          request.signal.removeEventListener("abort", onAbort);
          worker.removeEventListener("message", onMessage);
          worker.removeEventListener("error", onError);
          worker.terminate();
          callback();
        };
        const onMessage = event => {
          try {
            const response = parseWorkerResponse(event == null ? void 0 : event.data);
            if (response.ok) finish(() => resolve(response.value)); else if (response.code === "security_violation") finish(() => reject(new RuleExecutionError("security_violation", response.error))); else finish(() => reject(new RuleDomainError("regex_error", response.error)));
          } catch (error) {
            finish(() => reject(error));
          }
        };
        const onError = event => finish(() => reject(new RuleDomainError("regex_worker_failed", (event == null ? void 0 : event.message) ?? "regex worker failed")));
        const onAbort = () => finish(() => reject(new RuleExecutionError("cancelled", "regex execution cancelled")));
        const timer = setTimeout(() => finish(() => reject(new RuleExecutionError("timeout", "regex execution timed out"))), request.timeoutMs);
        request.signal.addEventListener("abort", onAbort, {
          once: true
        });
        worker.addEventListener("message", onMessage);
        worker.addEventListener("error", onError);
        try {
          worker.postMessage({
            kind: request.kind,
            value: request.value,
            pattern: request.pattern,
            flags: request.flags,
            replacement: request.replacement
          });
        } catch (error) {
          finish(() => reject(new RuleDomainError("regex_worker_failed", error instanceof Error ? error.message : "regex worker failed")));
        }
      });
    }
  }

  const FORBIDDEN_KEYS$1 = new Set([ "__proto__", "prototype", "constructor" ]);

  function readIdentifier(query, start) {
    const match = /^[A-Za-z_][A-Za-z0-9_-]*/u.exec(query.slice(start));
    if (!match) throw new Error(`invalid JSONPath at ${start}`);
    if (FORBIDDEN_KEYS$1.has(match[0])) throw new Error("forbidden JSONPath key");
    return [ match[0], start + match[0].length ];
  }

  function readQuotedKey(query, start) {
    const quote = query[start];
    if (quote !== "'" && quote !== '"') throw new Error(`invalid JSONPath at ${start}`);
    let key = "";
    let index = start + 1;
    while (index < query.length) {
      const character = query[index];
      if (character === quote) {
        if (FORBIDDEN_KEYS$1.has(key)) throw new Error("forbidden JSONPath key");
        return [ key, index + 1 ];
      }
      if (character === "\\") {
        index += 1;
        const escaped = query[index];
        if (escaped !== quote && escaped !== "\\") throw new Error(`invalid JSONPath escape at ${index}`);
        key += escaped;
        index += 1;
        continue;
      }
      if (!character || character.charCodeAt(0) < 32) throw new Error(`invalid JSONPath key at ${index}`);
      key += character;
      index += 1;
    }
    throw new Error("unterminated JSONPath key");
  }

  function parseJsonPath(query) {
    if (query.length === 0 || query.length > 4096 || query[0] !== "$") throw new Error("invalid JSONPath root");
    const tokens = [];
    let index = 1;
    while (index < query.length) {
      if (query.startsWith("..", index)) {
        const [key, next] = readIdentifier(query, index + 2);
        tokens.push({
          type: "recursive-property",
          key: key
        });
        index = next;
        continue;
      }
      if (query[index] === ".") {
        index += 1;
        if (query[index] === "*") {
          tokens.push({
            type: "wildcard"
          });
          index += 1;
          continue;
        }
        const [key, next] = readIdentifier(query, index);
        tokens.push({
          type: "property",
          key: key
        });
        index = next;
        continue;
      }
      if (query[index] === "[") {
        index += 1;
        if (query[index] === "*") {
          if (query[index + 1] !== "]") throw new Error(`invalid JSONPath wildcard at ${index}`);
          tokens.push({
            type: "wildcard"
          });
          index += 2;
          continue;
        }
        if (query[index] === "'" || query[index] === '"') {
          const [key, next2] = readQuotedKey(query, index);
          if (query[next2] !== "]") throw new Error(`invalid JSONPath bracket at ${next2}`);
          tokens.push({
            type: "property",
            key: key
          });
          index = next2 + 1;
          continue;
        }
        const number = /^\d+/u.exec(query.slice(index));
        if (!number) throw new Error(`invalid JSONPath bracket at ${index}`);
        const next = index + number[0].length;
        if (query[next] !== "]") throw new Error(`invalid JSONPath index at ${index}`);
        tokens.push({
          type: "index",
          index: Number(number[0])
        });
        index = next + 1;
        continue;
      }
      throw new Error(`invalid JSONPath at ${index}`);
    }
    return tokens;
  }

  function assertActive$1(signal) {
    if (signal == null ? void 0 : signal.aborted) throw new RuleExecutionError("cancelled", "JSONPath execution cancelled");
  }

  function ownDataProperty(value, key) {
    if (FORBIDDEN_KEYS$1.has(key)) throw new RuleExecutionError("security_violation", `forbidden JSONPath key: ${key}`);
    if (!value || typeof value !== "object") return void 0;
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor) return void 0;
    if (!("value" in descriptor)) throw new RuleExecutionError("security_violation", `JSONPath getter is not readable: ${key}`);
    return descriptor.value;
  }

  function enumerableChildren(value) {
    if (!value || typeof value !== "object") return [];
    const children = [];
    for (const key of Object.keys(value)) {
      if (FORBIDDEN_KEYS$1.has(key)) continue;
      const child = ownDataProperty(value, key);
      if (child !== void 0) children.push(child);
    }
    return children;
  }

  function executeJsonPath(value, query, options = {}) {
    assertActive$1(options.signal);
    const tokens = parseJsonPath(query);
    const maxVisitedNodes = options.maxVisitedNodes ?? 5e4;
    const maxResults = options.maxResults ?? 5e3;
    if (maxVisitedNodes <= 0 || maxResults <= 0) throw new RuleExecutionError("security_violation", "invalid JSONPath limits");
    let visitedNodes = 0;
    const visit = () => {
      assertActive$1(options.signal);
      visitedNodes += 1;
      if (visitedNodes > maxVisitedNodes) throw new RuleExecutionError("budget_exceeded", "JSONPath node budget exceeded");
    };
    const enforceResults = results => {
      if (results.length > maxResults) throw new RuleExecutionError("budget_exceeded", "JSONPath result limit exceeded");
      return results;
    };
    let current = [ value ];
    for (const token of tokens) {
      const next = [];
      for (const candidate of current) {
        visit();
        if (token.type === "property") {
          const property = ownDataProperty(candidate, token.key);
          if (property !== void 0) next.push(property);
        } else if (token.type === "index") {
          if (Array.isArray(candidate) && token.index < candidate.length) next.push(ownDataProperty(candidate, String(token.index)));
        } else if (token.type === "wildcard") {
          next.push(...enumerableChildren(candidate));
        } else {
          const seen = new WeakSet;
          const walk = node => {
            visit();
            if (!node || typeof node !== "object" || seen.has(node)) return;
            seen.add(node);
            const property = ownDataProperty(node, token.key);
            if (property !== void 0) {
              next.push(property);
              enforceResults(next);
            }
            for (const child of enumerableChildren(node)) walk(child);
          };
          walk(candidate);
        }
        enforceResults(next);
      }
      current = next;
    }
    return enforceResults(current);
  }

  const createReference = kind => Object.freeze({
    kind: kind,
    toJSON() {
      throw new Error("runtime reference cannot be serialized");
    }
  });

  class RuntimeReferenceRegistry {
    constructor(options) {
      __publicField(this, "domValues", new WeakMap);
      __publicField(this, "domRefs", new WeakMap);
      __publicField(this, "frameValues", new WeakMap);
      __publicField(this, "frameRefs", new WeakMap);
      __publicField(this, "responseValues", new WeakMap);
      __publicField(this, "domRefCount", 0);
      __publicField(this, "disposed", false);
      __publicField(this, "maxDomRefs");
      this.options = options;
      if (!Number.isInteger(options.maxDomRefs) || options.maxDomRefs <= 0) throw new Error("invalid DOM ref limit");
      this.maxDomRefs = options.maxDomRefs;
    }
    tightenDomRefCap(limit) {
      if (limit == null || !Number.isInteger(limit) || limit <= 0) return;
      if (limit < this.maxDomRefs) this.maxDomRefs = limit;
    }
    createDomRef(element) {
      this.assertActive();
      const existing = this.domRefs.get(element);
      if (existing) return existing;
      if (this.domRefCount >= this.maxDomRefs) throw new RuleExecutionError("budget_exceeded", "DOM reference limit exceeded");
      const reference = createReference("dom-ref");
      this.domValues.set(reference, element);
      this.domRefs.set(element, reference);
      this.domRefCount += 1;
      return reference;
    }
    createFrameRef(document2) {
      this.assertActive();
      const existing = this.frameRefs.get(document2);
      if (existing) return existing;
      const reference = createReference("frame-ref");
      this.frameValues.set(reference, document2);
      this.frameRefs.set(document2, reference);
      return reference;
    }
    createResponseRef(response) {
      this.assertActive();
      const reference = createReference("response-ref");
      this.responseValues.set(reference, response);
      return reference;
    }
    getDom(reference) {
      return this.resolve(reference, this.domValues, "DOM");
    }
    getFrame(reference) {
      return this.resolve(reference, this.frameValues, "frame");
    }
    getResponse(reference) {
      return this.resolve(reference, this.responseValues, "response");
    }
    dispose() {
      this.disposed = true;
    }
    assertActive() {
      if (this.disposed) throw new RuleExecutionError("security_violation", "runtime reference registry is disposed");
    }
    resolve(reference, values, label) {
      this.assertActive();
      if (reference == null) throw new RuleDomainError("missing_reference", `missing ${label} reference`);
      if (typeof reference !== "object" && typeof reference !== "function") throw new RuleExecutionError("security_violation", `invalid ${label} reference`);
      if (!values.has(reference)) throw new RuleExecutionError("security_violation", `invalid ${label} reference`);
      return values.get(reference);
    }
  }

  class RuleResourceScope {
    constructor() {
      __publicField(this, "cleanups", []);
      __publicField(this, "disposePromise", null);
      __publicField(this, "resolveDisposed");
      __publicField(this, "disposed", new Promise(resolve => {
        this.resolveDisposed = resolve;
      }));
    }
    add(cleanup) {
      if (this.disposePromise) throw new Error("rule resource scope is already disposed");
      this.cleanups.push(cleanup);
    }
    bind(signal) {
      if (!signal) return;
      if (signal.aborted) {
        void this.dispose();
        return;
      }
      const onAbort = () => void this.dispose();
      signal.addEventListener("abort", onAbort, {
        once: true
      });
      this.add(() => signal.removeEventListener("abort", onAbort));
    }
    dispose() {
      if (this.disposePromise) return this.disposePromise;
      this.disposePromise = (async () => {
        for (const cleanup of this.cleanups.reverse()) {
          try {
            await cleanup();
          } catch {}
        }
        this.cleanups.length = 0;
        this.resolveDisposed();
      })();
      return this.disposePromise;
    }
  }

  const recordFromMap = values => {
    const record = Object.create(null);
    for (const [name, value] of values) record[name] = value;
    return record;
  };

  const userVariables = result => new Map([ ...result.variables ].filter(([name]) => !name.startsWith("$")));

  class RuleStateMachine {
    constructor(options) {
      __publicField(this, "variables");
      __publicField(this, "started", false);
      __publicField(this, "transitions", 0);
      __publicField(this, "queue", Promise.resolve());
      __publicField(this, "maxTransitions");
      __publicField(this, "state");
      this.options = options;
      this.state = options.definition.initial;
      if (!options.definition.states[this.state]) throw new RuleExecutionError("security_violation", "state machine initial state does not exist");
      this.variables = new Map(Object.entries(options.variables ?? {}));
      this.maxTransitions = options.maxTransitions ?? 1e4;
      if (!Number.isInteger(this.maxTransitions) || this.maxTransitions <= 0 || this.maxTransitions > 1e4) throw new RuleExecutionError("security_violation", "invalid state transition limit");
    }
    getVariable(name) {
      return this.variables.get(name);
    }
    start() {
      return this.enqueue(async () => {
        if (this.started) return {
          state: this.state
        };
        const initial = this.options.definition.states[this.state];
        if (!initial) throw new RuleExecutionError("security_violation", "state machine initial state does not exist");
        const working = await this.runSteps(initial.enter ?? [], this.variables, null, `state:${this.state}:enter`);
        this.variables = working;
        this.started = true;
        return {
          state: this.state
        };
      });
    }
    dispatch(event, payload = null) {
      return this.enqueue(async () => {
        if (!this.started) throw new RuleDomainError("state_machine_not_started", "state machine is not started");
        const source = this.options.definition.states[this.state];
        if (!source) throw new RuleExecutionError("security_violation", `state does not exist: ${this.state}`);
        let selected2;
        for (const transition of source.transitions) {
          if (transition.event !== event) continue;
          if (!transition.when) {
            selected2 = transition;
            break;
          }
          const matches = await this.evaluateCondition(transition.when, this.variables, payload);
          if (matches) {
            selected2 = transition;
            break;
          }
        }
        if (!selected2) return {
          state: this.state,
          transitioned: false
        };
        if (this.transitions >= this.maxTransitions) throw new RuleExecutionError("budget_exceeded", "state transition budget exceeded");
        const target = this.options.definition.states[selected2.target];
        if (!target) throw new RuleExecutionError("security_violation", `state transition target does not exist: ${selected2.target}`);
        let working = new Map(this.variables);
        working = await this.runSteps(selected2.actions ?? [], working, payload, `state:${this.state}:${event}:actions`);
        working = await this.runSteps(target.enter ?? [], working, payload, `state:${selected2.target}:enter`);
        this.variables = working;
        this.state = selected2.target;
        this.transitions += 1;
        return {
          state: this.state,
          transitioned: true
        };
      });
    }
    async evaluateCondition(when, variables, payload) {
      const result = await this.runFlow({
        id: `state:${this.state}:condition`,
        steps: [ {
          type: "return",
          value: when
        } ]
      }, variables, payload);
      if (typeof result.value !== "boolean") throw new RuleDomainError("invalid_type", "state transition condition must be boolean");
      return result.value;
    }
    async runSteps(steps, variables, payload, flowId) {
      if (steps.length === 0) return new Map(variables);
      return userVariables(await this.runFlow({
        id: flowId,
        steps: [ ...steps ]
      }, variables, payload));
    }
    runFlow(flow, variables, payload) {
      return this.options.interpreter.run(flow, {
        phase: "lifecycle",
        variables: recordFromMap(variables),
        reserved: {
          ...this.options.reserved ?? {},
          $event: payload
        },
        flows: this.options.flows,
        capabilities: this.options.capabilities,
        signal: this.options.signal,
        resources: this.options.resources,
        limits: this.options.limits
      });
    }
    enqueue(operation) {
      const task = this.queue.then(operation);
      this.queue = task.catch(() => void 0);
      return task;
    }
  }

  function operationsEqual(left, right) {
    if (left.kind !== right.kind) return false;
    if (left.kind === "choose" && right.kind === "choose") return left.optionId === right.optionId;
    if (left.kind === "write" && right.kind === "write") return left.slotId === right.slotId && left.value === right.value;
    return left.kind === "pair" && right.kind === "pair" && left.leftId === right.leftId && left.rightId === right.rightId;
  }

  function assertActive(signal) {
    if (signal.aborted) throw new RuleExecutionError("cancelled", "answer write was cancelled");
  }

  class BindingRegistryAnswerWriter {
    constructor(registry) {
      this.registry = registry;
    }
    async applyPlan(plan, signal) {
      const resolved = this.resolveTargets(plan, plan.operations, signal);
      if (!resolved) return false;
      const applied = [];
      try {
        for (const {operation: operation, target: target} of resolved) {
          assertActive(signal);
          if (!(await target.apply(operation, signal))) {
            await this.revertApplied(applied, signal);
            return false;
          }
          applied.push(target);
        }
        return true;
      } catch (error) {
        await this.revertApplied(applied, signal);
        throw error;
      }
    }
    async revertApplied(applied, signal) {
      var _a2;
      for (const target of [ ...applied ].reverse()) {
        try {
          await ((_a2 = target.revert) == null ? void 0 : _a2.call(target, signal));
        } catch {}
      }
    }
    async verifyPlan(plan, signal) {
      const resolved = this.resolveTargets(plan, plan.operations, signal);
      if (!resolved) return false;
      for (const {operation: operation, target: target} of resolved) {
        assertActive(signal);
        if (!(await target.verify(operation, signal))) return false;
      }
      return true;
    }
    async applyOperation(plan, operation, signal) {
      if (!plan.operations.some(candidate => operationsEqual(candidate, operation))) return false;
      const resolved = this.resolveTargets(plan, [ operation ], signal);
      if (!resolved) return false;
      return resolved[0] ? resolved[0].target.apply(operation, signal) : false;
    }
    async verifyOperation(plan, operation, signal) {
      if (!plan.operations.some(candidate => operationsEqual(candidate, operation))) return false;
      const resolved = this.resolveTargets(plan, [ operation ], signal);
      if (!resolved) return false;
      return resolved[0] ? resolved[0].target.verify(operation, signal) : false;
    }
    resolveTargets(plan, operations, signal) {
      assertActive(signal);
      const binding = this.registry.get(plan.path);
      if (!binding || !binding.connected || binding.capturedFingerprint !== plan.fingerprint || binding.currentFingerprint !== plan.fingerprint) return null;
      const resolved = [];
      for (const operation of operations) {
        const target = this.registry.targetForOperation(plan.path, operation);
        if (!target) return null;
        try {
          if (!target.isConnected()) return null;
        } catch {
          return null;
        }
        resolved.push({
          operation: operation,
          target: target
        });
      }
      return resolved;
    }
  }

  class RuleVerificationError extends Error {
    constructor(code, message) {
      super(message);
      this.code = code;
      this.name = "RuleVerificationError";
    }
  }

  function compareRuleVersions(leftValue, rightValue) {
    try {
      return compareRuleVersions$1(leftValue, rightValue);
    } catch {
      throw new RuleVerificationError("engine_incompatible", `invalid version: ${leftValue} or ${rightValue}`);
    }
  }

  function nestedSteps(step) {
    switch (step.type) {
     case "if":
      return [ step.then, step.else ?? [] ];

     case "switch":
      return [ ...step.cases.map(item => item.steps), step.default ?? [] ];

     case "forEach":
     case "while":
      return [ step.steps ];

     case "try":
      return [ step.steps, step.catch ?? [], step.finally ?? [] ];

     default:
      return [];
    }
  }

  function visitSteps(steps, visitor) {
    for (const step of steps) {
      visitor(step);
      for (const nested of nestedSteps(step)) visitSteps(nested, visitor);
    }
  }

  function stepExpressions(step) {
    switch (step.type) {
     case "set":
     case "switch":
      return [ step.value ];

     case "if":
     case "while":
      return [ step.when ];

     case "forEach":
      return [ step.items ];

     case "callFlow":
     case "primitive":
      return Object.values(step.args ?? {});

     case "return":
      return step.value ? [ step.value ] : [];

     default:
      return [];
    }
  }

  function childExpressions(expr) {
    switch (expr.op) {
     case "path":
     case "jsonPath":
      return [ expr.from ];

     case "coalesce":
     case "logic":
      return expr.values;

     case "array":
      return expr.items;

     case "object":
     case "format":
      return Object.values(expr.op === "object" ? expr.entries : expr.args);

     case "compare":
      return [ expr.left, expr.right ];

     case "not":
     case "string":
     case "regex":
      return [ expr.value ];

     case "map":
      return [ expr.items, expr.value ];

     case "filter":
      return [ expr.items, expr.when ];

     case "reduce":
      return [ expr.items, expr.initial, expr.value ];

     default:
      return [];
    }
  }

  function visitExpressions(expr, visitor) {
    visitor(expr);
    for (const child of childExpressions(expr)) visitExpressions(child, visitor);
  }

  function lifecycleSteps(lifecycle) {
    const result = [];
    for (const state of Object.values(lifecycle.states)) {
      result.push(state.enter ?? []);
      for (const transition of state.transitions) result.push(transition.actions ?? []);
    }
    return result;
  }

  const LIMIT_KEYS = [ "maxSteps", "maxWallMs", "maxAsyncMs", "maxLoopIterations", "maxCallDepth", "maxDomRefs" ];

  class RuleVerifier {
    constructor(options) {
      __publicField(this, "now");
      __publicField(this, "keyset");
      this.options = options;
      this.now = options.now ?? Date.now;
      this.keyset = ServerKeysetSchema.parse(options.keyset);
    }
    async verify(input) {
      const pkg = RulePackageSchema.parse(input);
      const now = this.now();
      if (pkg.issuedAt > now) throw new RuleVerificationError("package_from_future", "rule package is issued in the future");
      if (pkg.expiresAt != null && pkg.expiresAt <= now) throw new RuleVerificationError("package_expired", "rule package is expired");
      this.verifyEngineRange(pkg);
      this.verifyCapabilitiesAndLimits(pkg);
      this.verifyPrimitives(pkg);
      const contentHash = await computeVerifiedRulePackageContentHash(pkg);
      if (contentHash !== pkg.contentHash) throw new RuleVerificationError("content_hash_mismatch", "rule package content hash mismatch");
      const signingKey = this.keyset.keys.find(key => key.kid === pkg.signingKid && key.use === "rule-signing" && key.notBefore <= now && key.expiresAt > now && this.keyset.issuedAt <= now && this.keyset.expiresAt > now);
      if (!signingKey) throw new RuleVerificationError("invalid_signing_key", "active rule-signing key not found");
      const publicKey = await importEcdsaPublicJwk(signingKey.publicJwk);
      if (!(await verifyEcdsaP1363(publicKey, utf8Bytes(canonicalRulePackageSignatureInput(pkg)), pkg.signature))) throw new RuleVerificationError("invalid_signature", "rule package signature rejected");
      await this.verifySequenceAndRollback(pkg);
      return pkg;
    }
    verifyEngineRange(pkg) {
      if (compareRuleVersions(this.options.engineVersion, pkg.engineRange.min) < 0 || pkg.engineRange.maxExclusive != null && compareRuleVersions(this.options.engineVersion, pkg.engineRange.maxExclusive) >= 0) throw new RuleVerificationError("engine_incompatible", "rule package engine range is incompatible");
    }
    verifyCapabilitiesAndLimits(pkg) {
      var _a2;
      for (const capability of pkg.capabilities) {
        if (!this.options.policy.capabilities.has(capability)) throw new RuleVerificationError("capability_denied", `rule capability is not allowed: ${capability}`);
      }
      for (const variant of pkg.variants) {
        for (const key of LIMIT_KEYS) {
          const value = (_a2 = variant.limits) == null ? void 0 : _a2[key];
          if (value != null && value > this.options.policy.limits[key]) throw new RuleVerificationError("limit_denied", `rule limit exceeds runtime policy: ${key}`);
        }
      }
    }
    verifyPrimitives(pkg) {
      const capabilities = new Set(pkg.capabilities);
      const verifyFlow = (flow, phase) => this.verifyStepList(flow.steps, phase, capabilities);
      for (const variant of pkg.variants) {
        verifyFlow(variant.match, "match");
        verifyFlow(variant.capture, "capture");
        verifyFlow(variant.fill, "fill");
        if (variant.diagnostics) verifyFlow(variant.diagnostics, "diagnostic");
        if (variant.lifecycle) {
          for (const steps of lifecycleSteps(variant.lifecycle)) this.verifyStepList(steps, "lifecycle", capabilities);
          for (const state of Object.values(variant.lifecycle.states)) for (const transition of state.transitions) {
            if (!RULE_DISPATCHED_EVENTS.has(transition.event)) throw new RuleVerificationError("event_denied", `engine never dispatches lifecycle event: ${transition.event}`);
            if (transition.when) this.verifyExpression(transition.when);
          }
        }
      }
    }
    verifyStepList(steps, phase, capabilities) {
      visitSteps(steps, step => {
        for (const expression of stepExpressions(step)) this.verifyExpression(expression);
        if (step.type !== "primitive") return;
        const definition = this.options.registry.get(step.id);
        if (!definition) throw new RuleVerificationError("unknown_primitive", `unknown primitive: ${step.id}`);
        if (!this.options.policy.primitives.has(step.id)) throw new RuleVerificationError("primitive_denied", `primitive is not allowed by runtime policy: ${step.id}`);
        if (!definition.phases.includes(phase)) throw new RuleVerificationError("primitive_phase_denied", `primitive is not allowed in ${phase}: ${step.id}`);
        if (definition.capability && (!this.options.policy.capabilities.has(definition.capability) || !capabilities.has(definition.capability))) throw new RuleVerificationError("capability_denied", `primitive capability is not declared: ${definition.capability}`);
      });
    }
    verifyExpression(expr) {
      visitExpressions(expr, node => {
        var _a2, _b;
        if (node.op === "regex" && !((_a2 = this.options.services) == null ? void 0 : _a2.regex)) throw new RuleVerificationError("expression_denied", "regex executor is not installed");
        if (node.op === "jsonPath" && !((_b = this.options.services) == null ? void 0 : _b.jsonPath)) throw new RuleVerificationError("expression_denied", "JSONPath executor is not installed");
      });
    }
    async verifySequenceAndRollback(pkg) {
      const current = this.options.current;
      if (!current) return;
      if (pkg.releaseSequence < current.releaseSequence) throw new RuleVerificationError("sequence_downgrade", "rule release sequence cannot decrease");
      if (pkg.releaseSequence === current.releaseSequence && pkg.contentHash !== current.contentHash) throw new RuleVerificationError("sequence_reuse", "rule release sequence cannot be reused for different content");
      const isVersionRollback = compareRuleVersions(pkg.version, current.version) < 0;
      if (!isVersionRollback && !pkg.rollbackAuthorization) return;
      const authorization = pkg.rollbackAuthorization;
      if (!authorization || authorization.toVersion !== pkg.version || !this.options.authorizeRollback || !(await this.options.authorizeRollback(authorization, pkg))) throw new RuleVerificationError("rollback_unauthorized", "rule rollback is not authorized");
    }
  }

  class RuleStoreError extends Error {
    constructor(code, message) {
      super(message);
      this.code = code;
      this.name = "RuleStoreError";
    }
  }

  function freezeJson(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) freezeJson(child);
    return Object.freeze(value);
  }

  const emptyState = () => ({
    candidate: null,
    active: null,
    lastKnownGood: null,
    highestSequence: -1,
    highestHash: null,
    disabled: false,
    quarantined: []
  });

  class RuleStore {
    constructor() {
      __publicField(this, "states", new Map);
    }
    install(input) {
      const pkg = freezeJson(RulePackageSchema.parse(input));
      this.state(pkg.packageId).active = pkg;
      return pkg;
    }
    async stageRemote(input, verifier) {
      const pkg = freezeJson(await verifier.verify(input));
      const state = this.state(pkg.packageId);
      if (pkg.releaseSequence < state.highestSequence) throw new RuleStoreError("sequence_downgrade", "rule release sequence cannot decrease");
      if (pkg.releaseSequence === state.highestSequence && state.highestHash !== pkg.contentHash) throw new RuleStoreError("sequence_reuse", "rule release sequence cannot be reused for different content");
      if (pkg.releaseSequence === state.highestSequence && state.highestHash === pkg.contentHash) {
        return state.candidate ?? state.active ?? state.lastKnownGood ?? pkg;
      }
      state.candidate = pkg;
      state.highestSequence = pkg.releaseSequence;
      state.highestHash = pkg.contentHash;
      return pkg;
    }
    activateCandidate(packageId) {
      const state = this.state(packageId);
      if (!state.candidate) throw new RuleStoreError("candidate_missing", `rule candidate is missing: ${packageId}`);
      if (state.active) state.lastKnownGood = state.active;
      state.active = state.candidate;
      state.candidate = null;
      return state.active;
    }
    quarantineActive(packageId, reason) {
      const state = this.state(packageId);
      if (!state.active) return;
      state.quarantined.push({
        pkg: state.active,
        reason: reason
      });
      state.active = null;
    }
    setDisabled(packageId, disabled) {
      this.state(packageId).disabled = disabled;
    }
    resolve(packageId) {
      const state = this.state(packageId);
      if (state.disabled) return null;
      if (state.active) return {
        source: "remote-active",
        pkg: state.active
      };
      if (state.lastKnownGood) return {
        source: "remote-lkg",
        pkg: state.lastKnownGood
      };
      return null;
    }
    diagnostics(packageId) {
      const state = this.state(packageId);
      return {
        packageId: packageId,
        disabled: state.disabled,
        candidate: state.candidate,
        active: state.active,
        lastKnownGood: state.lastKnownGood,
        highestSequence: state.highestSequence,
        quarantined: [ ...state.quarantined ]
      };
    }
    exportSnapshot() {
      return {
        schemaVersion: 1,
        packages: [ ...this.states.entries() ].filter(([, state]) => state.disabled || state.candidate != null || state.active != null || state.lastKnownGood != null || state.quarantined.length > 0 || state.highestSequence >= 0).map(([packageId, state]) => ({
          packageId: packageId,
          disabled: state.disabled,
          candidate: state.candidate,
          active: state.active,
          lastKnownGood: state.lastKnownGood,
          highestSequence: state.highestSequence,
          highestHash: state.highestHash,
          quarantined: [ ...state.quarantined ]
        }))
      };
    }
    async restoreSnapshot(input, verifier) {
      if (!input || typeof input !== "object") throw this.snapshotError("rule snapshot must be an object");
      const snapshot2 = input;
      if (snapshot2.schemaVersion !== 1 || !Array.isArray(snapshot2.packages)) throw this.snapshotError("unsupported rule snapshot");
      if (snapshot2.packages.length > 128) throw this.snapshotError("rule snapshot contains too many packages");
      const restored = new Map;
      for (const rawEntry of snapshot2.packages) {
        if (!rawEntry || typeof rawEntry !== "object") throw this.snapshotError("invalid rule snapshot entry");
        const entry = rawEntry;
        if (typeof entry.packageId !== "string" || entry.packageId.length === 0 || typeof entry.disabled !== "boolean" || !Number.isInteger(entry.highestSequence) || entry.highestHash !== null && typeof entry.highestHash !== "string" || !Array.isArray(entry.quarantined)) throw this.snapshotError("invalid rule snapshot metadata");
        if (restored.has(entry.packageId)) throw this.snapshotError("duplicate rule snapshot package");
        const verifyPackage = async value => {
          if (value == null) return null;
          const pkg = freezeJson(await verifier.verify(value));
          if (pkg.packageId !== entry.packageId) throw this.snapshotError("rule snapshot packageId mismatch");
          return pkg;
        };
        const packageId = entry.packageId;
        const degraded = () => ({
          candidate: null,
          active: null,
          lastKnownGood: null,
          highestSequence: entry.highestSequence,
          highestHash: entry.highestHash,
          disabled: entry.disabled,
          quarantined: []
        });
        let candidate;
        let active2;
        let lastKnownGood;
        try {
          [candidate, active2, lastKnownGood] = await Promise.all([ verifyPackage(entry.candidate), verifyPackage(entry.active), verifyPackage(entry.lastKnownGood) ]);
        } catch (error) {
          if (!(error instanceof RuleVerificationError)) throw error;
          restored.set(packageId, degraded());
          continue;
        }
        const quarantined = [];
        for (const rawQuarantine of entry.quarantined) {
          if (!rawQuarantine || typeof rawQuarantine !== "object") throw this.snapshotError("invalid quarantined rule");
          const quarantine = rawQuarantine;
          if (typeof quarantine.reason !== "string" || quarantine.reason.length > 512) throw this.snapshotError("invalid quarantine reason");
          const quarantinedPackage = await verifyPackage(quarantine.pkg);
          if (!quarantinedPackage) throw this.snapshotError("missing quarantined package");
          quarantined.push({
            pkg: quarantinedPackage,
            reason: quarantine.reason
          });
        }
        const remotePackages = [ candidate, active2, lastKnownGood, ...quarantined.map(item => item.pkg) ].filter(pkg => pkg != null);
        const highestSequence = entry.highestSequence;
        const highestHash = entry.highestHash;
        if (remotePackages.length === 0) {
          if (highestSequence < -1) throw this.snapshotError("empty snapshot has invalid sequence");
        } else if (!remotePackages.some(pkg => pkg.releaseSequence === highestSequence && pkg.contentHash === highestHash) || remotePackages.some(pkg => pkg.releaseSequence > highestSequence)) throw this.snapshotError("rule snapshot highest sequence mismatch");
        restored.set(entry.packageId, {
          candidate: candidate,
          active: active2,
          lastKnownGood: lastKnownGood,
          highestSequence: highestSequence,
          highestHash: highestHash,
          disabled: entry.disabled,
          quarantined: quarantined
        });
      }
      for (const [packageId, state] of restored) this.states.set(packageId, state);
    }
    snapshotError(message) {
      return new RuleStoreError("snapshot_invalid", message);
    }
    state(packageId) {
      let state = this.states.get(packageId);
      if (!state) {
        state = emptyState();
        this.states.set(packageId, state);
      }
      return state;
    }
  }

  class JsonRuleResolver {
    constructor(options) {
      this.options = options;
    }
    async resolve(packageId, options = {}) {
      var _a2, _b, _c, _d, _e, _f;
      const resolved = this.options.store.resolve(packageId);
      if (!resolved) return null;
      const variants = resolved.pkg.variants.map((variant, index) => ({
        variant: variant,
        index: index
      })).sort((left, right) => right.variant.priority - left.variant.priority || left.index - right.index);
      for (const {variant: variant} of variants) {
        try {
          const result = await this.options.interpreter.run(variant.match, {
            phase: "match",
            variables: options.variables,
            reserved: options.reserved,
            signal: options.signal,
            capabilities: new Set(resolved.pkg.capabilities),
            limits: variant.limits,
            flows: [ variant.capture, variant.fill, ...variant.diagnostics ? [ variant.diagnostics ] : [] ]
          });
          if (typeof result.value !== "boolean") {
            (_b = (_a2 = this.options).onAttempt) == null ? void 0 : _b.call(_a2, {
              variantId: variant.id,
              matched: false,
              reason: "invalid_match_result",
              steps: result.steps
            });
            continue;
          }
          (_d = (_c = this.options).onAttempt) == null ? void 0 : _d.call(_c, {
            variantId: variant.id,
            matched: result.value,
            steps: result.steps
          });
          if (result.value) return {
            source: resolved.source,
            pkg: resolved.pkg,
            variant: variant
          };
        } catch (error) {
          if (!(error instanceof RuleDomainError)) throw error;
          (_f = (_e = this.options).onAttempt) == null ? void 0 : _f.call(_e, {
            variantId: variant.id,
            matched: false,
            reason: error.code
          });
        }
      }
      return null;
    }
  }

  function registerLocalHook(registry, hook) {
    registry.register({
      id: hook.id,
      phases: hook.phases,
      capability: hook.capability,
      requiresSafetyCapability: hook.requiresSafetyCapability,
      safetyArgument: hook.safetyArgument,
      execute: async ({args: args, ...context}) => {
        let parsed;
        try {
          parsed = hook.parseArgs(args);
        } catch (error) {
          throw new RuleDomainError("invalid_hook_args", error instanceof Error ? error.message : "invalid hook arguments");
        }
        const result = await hook.execute(parsed, context);
        if (!hook.validateResult(result)) throw new RuleDomainError("invalid_hook_result", `local hook returned an invalid result: ${hook.id}`);
        return result;
      }
    });
  }

  const FORBIDDEN_KEYS = new Set([ "__proto__", "prototype", "constructor" ]);

  const MAX_FIELDS = 64;

  const MAX_PATH_DEPTH = 32;

  const MAX_SNAPSHOT_NODES = 1e4;

  const MAX_SNAPSHOT_BYTES = 512 * 1024;

  const utf8Length$1 = value => (new TextEncoder).encode(value).length;

  function createSnapshotState(signal, label) {
    return {
      signal: signal,
      nodes: 0,
      bytes: 0,
      ancestors: new WeakSet,
      label: label
    };
  }

  function safeKey(value) {
    return typeof value === "string" && value.length > 0 && value.length <= 256 && !FORBIDDEN_KEYS.has(value);
  }

  function parseSnapshotFields(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("fields must be an object");
    const entries = Object.entries(value);
    if (entries.length === 0 || entries.length > MAX_FIELDS) throw new Error("fields must contain between 1 and 64 entries");
    const fields = Object.create(null);
    for (const [name, rawPath] of entries) {
      if (!safeKey(name)) throw new Error(`invalid field name: ${name}`);
      if (!Array.isArray(rawPath) || rawPath.length === 0 || rawPath.length > MAX_PATH_DEPTH) throw new Error(`invalid snapshot path: ${name}`);
      fields[name] = rawPath.map(segment => {
        if (typeof segment === "number") {
          if (!Number.isInteger(segment) || segment < 0) throw new Error(`invalid snapshot path index: ${name}`);
          return segment;
        }
        if (!safeKey(segment)) throw new Error(`invalid snapshot path property: ${name}`);
        return segment;
      });
    }
    return fields;
  }

  function consumeSnapshotValue(state, value) {
    if (state.signal.aborted) throw new RuleExecutionError("cancelled", `${state.label} snapshot cancelled`);
    state.nodes += 1;
    if (value) state.bytes += utf8Length$1(value);
    if (state.nodes > MAX_SNAPSHOT_NODES || state.bytes > MAX_SNAPSHOT_BYTES) throw new RuleExecutionError("budget_exceeded", `${state.label} snapshot budget exceeded`);
  }

  function cloneJsonValue(value, state) {
    if (value === null || typeof value === "boolean") {
      consumeSnapshotValue(state);
      return value;
    }
    if (typeof value === "number") {
      consumeSnapshotValue(state);
      if (!Number.isFinite(value)) throw new RuleDomainError("scope_value_unsafe", `${state.label} contains a non-finite number`);
      return value;
    }
    if (typeof value === "string") {
      consumeSnapshotValue(state, value);
      return value;
    }
    if (!value || typeof value !== "object") throw new RuleDomainError("scope_value_unsafe", `${state.label} field is not JSON data`);
    consumeSnapshotValue(state);
    if (state.ancestors.has(value)) throw new RuleDomainError("scope_value_unsafe", `${state.label} field contains a cycle`);
    state.ancestors.add(value);
    try {
      if (Array.isArray(value)) {
        if (value.length > MAX_SNAPSHOT_NODES) throw new RuleExecutionError("budget_exceeded", `${state.label} array exceeds snapshot budget`);
        return Array.from({
          length: value.length
        }, (_, index) => {
          const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
          if (!descriptor) {
            consumeSnapshotValue(state);
            return null;
          }
          if (!("value" in descriptor)) throw new RuleDomainError("scope_value_unsafe", `${state.label} array contains an accessor`);
          return cloneJsonValue(descriptor.value, state);
        });
      }
      const prototype = Object.getPrototypeOf(value);
      if (prototype !== Object.prototype && prototype !== null) throw new RuleDomainError("scope_value_unsafe", `${state.label} field must be plain JSON data`);
      const result = Object.create(null);
      for (const key of Object.keys(value)) {
        if (!safeKey(key)) throw new RuleDomainError("scope_value_unsafe", `${state.label} contains an unsafe key: ${key}`);
        consumeSnapshotValue(state, key);
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        if (!descriptor || !("value" in descriptor)) throw new RuleDomainError("scope_value_unsafe", `${state.label} contains an accessor: ${key}`);
        result[key] = cloneJsonValue(descriptor.value, state);
      }
      return result;
    } finally {
      state.ancestors.delete(value);
    }
  }

  const MAX_UEDITOR_TARGETS = 64;

  const utf8Length = value => (new TextEncoder).encode(value).length;

  function registerChaoxingRuleHooks(registry, dependencies) {
    registerLocalHook(registry, {
      id: "chaoxing.normalizeTitle",
      phases: [ "capture", "diagnostic" ],
      parseArgs: args => {
        if (typeof args.text !== "string") throw new Error("text is required");
        if (utf8Length(args.text) > 128 * 1024) throw new Error("title hook input exceeds byte limit");
        return {
          text: args.text
        };
      },
      validateResult: value => typeof value === "string",
      execute: ({text: text}) => stripTitle(text)
    });
    registerLocalHook(registry, {
      id: "chaoxing.decodeFont",
      phases: [ "capture", "diagnostic" ],
      capability: "runtime-read",
      parseArgs: args => {
        if (typeof args.text !== "string" || typeof args.styleText !== "string") throw new Error("text and styleText are required");
        if (utf8Length(args.text) > 128 * 1024 || utf8Length(args.styleText) > 2 * 1024 * 1024) throw new Error("font hook input exceeds byte limit");
        return {
          text: args.text,
          styleText: args.styleText
        };
      },
      validateResult: value => typeof value === "string",
      execute: ({text: text, styleText: styleText}) => {
        const base64 = extractCxFontBase64(styleText);
        if (!base64) throw new RuleDomainError("font_data_missing", "Chaoxing font data is missing");
        if (Object.keys(dependencies.table).length === 0) throw new RuleDomainError("font_table_unavailable", "Chaoxing font table is unavailable");
        let fontData;
        try {
          fontData = base64ToUint8Array(base64);
        } catch {
          throw new RuleDomainError("font_data_invalid", "Chaoxing font data is invalid");
        }
        return applyCharMap(text, buildCharMap(fontData, dependencies.table, dependencies.typr));
      }
    });
    registerLocalHook(registry, {
      id: "chaoxing.harvestAnswerValues",
      phases: [ "capture", "diagnostic" ],
      parseArgs: args => {
        if (typeof args.text !== "string") throw new Error("text is required");
        if (utf8Length(args.text) > 64 * 1024) throw new Error("harvest hook input exceeds byte limit");
        const options = args.options ?? [];
        if (!Array.isArray(options) || options.length > 64) throw new Error("options must be a bounded option array");
        const contents = options.map(option => {
          const content = option == null ? void 0 : option.content;
          if (typeof content !== "string") throw new Error("option content must be a string");
          return content;
        });
        const slotValues = args.slotValues ?? [];
        if (!Array.isArray(slotValues) || slotValues.length > 64) throw new Error("slotValues must be a bounded string array");
        return {
          text: args.text,
          options: contents,
          slotValues: slotValues.map(value => String(value))
        };
      },
      validateResult: value => Array.isArray(value),
      execute: ({text: text, options: options, slotValues: slotValues}) => mapChaoxingHarvestedAnswer(text, options, slotValues)
    });
    if (dependencies.refs && dependencies.resolveUeditorBodies) {
      const {refs: refs, resolveUeditorBodies: resolveUeditorBodies2} = dependencies;
      registerLocalHook(registry, {
        id: "chaoxing.ueditorBodies",
        phases: [ "capture", "diagnostic" ],
        capability: "runtime-read",
        parseArgs: args => {
          if (!Array.isArray(args.targets) || args.targets.length === 0 || args.targets.length > MAX_UEDITOR_TARGETS) throw new Error("targets must contain between 1 and 64 DOM references");
          return {
            targets: args.targets
          };
        },
        validateResult: value => Array.isArray(value),
        execute: ({targets: targets}) => {
          const textareas = targets.map(target => {
            const element = refs.getDom(target);
            if (element.tagName.toLowerCase() !== "textarea") throw new RuleDomainError("ueditor_target_invalid", "Chaoxing UEditor source target must be a textarea");
            return element;
          });
          let bodies;
          try {
            bodies = resolveUeditorBodies2(textareas);
          } catch (error) {
            throw new RuleDomainError("ueditor_body_unavailable", error instanceof Error ? error.message : "Chaoxing UEditor body is unavailable");
          }
          if (!Array.isArray(bodies) || bodies.length !== textareas.length) throw new RuleDomainError("ueditor_body_unavailable", "Chaoxing UEditor body count does not match source targets");
          return bodies.map(body => {
            var _a2;
            if (!body || !body.isConnected || ((_a2 = body.getAttribute("contenteditable")) == null ? void 0 : _a2.toLowerCase()) !== "true") throw new RuleDomainError("ueditor_body_unavailable", "Chaoxing UEditor body must be a connected contenteditable target");
            return refs.createDomRef(body);
          });
        }
      });
    }
    if (dependencies.refs && dependencies.registerExamQuestion) {
      const {refs: refs, registerExamQuestion: registerExamQuestion} = dependencies;
      registerLocalHook(registry, {
        id: "chaoxing.examRegisterQuestion",
        phases: [ "capture", "diagnostic" ],
        capability: "runtime-read",
        parseArgs: args => {
          if (typeof args.path !== "string" || !args.path.startsWith("/") || args.path.length > 1024) throw new Error("path must be a valid question path");
          const mode = args.mode;
          if (mode !== "paged" && mode !== "preview") throw new Error("mode must be paged or preview");
          return {
            path: args.path,
            target: args.target,
            mode: mode
          };
        },
        validateResult: value => typeof value === "string",
        execute: ({path: path, target: target, mode: mode}) => {
          const element = refs.getDom(target);
          if (!element.isConnected || !element.classList.contains("questionLi")) throw new RuleDomainError("exam_question_invalid", "Chaoxing exam question target must be a connected questionLi");
          registerExamQuestion({
            path: path,
            target: element,
            mode: mode
          });
          return path;
        }
      });
    }
    const registerPlanHook = (id, execute) => registerLocalHook(registry, {
      id: id,
      phases: [ "fill" ],
      capability: "answer-write",
      requiresSafetyCapability: true,
      parseArgs: args => ({
        safety: args.safety
      }),
      validateResult: value => typeof value === "boolean",
      execute: ({safety: safety}, {signal: signal}) => execute(safetyPlanForCapability(safety), signal)
    });
    if (dependencies.prepareExamPlan) registerPlanHook("chaoxing.examPreparePlan", dependencies.prepareExamPlan);
    if (dependencies.commitExamPlan) registerPlanHook("chaoxing.examCommitPlan", dependencies.commitExamPlan);
    if (dependencies.commitDoworkPlan) registerPlanHook("chaoxing.doworkCommitPlan", dependencies.commitDoworkPlan);
    if (dependencies.commitStudentstudyPlan) registerPlanHook("chaoxing.studentstudyCommitPlan", dependencies.commitStudentstudyPlan);
    if (dependencies.commitOldHomeworkPlan) registerPlanHook("chaoxing.oldHomeworkCommitPlan", dependencies.commitOldHomeworkPlan);
    if (dependencies.commitOldChapterPlan) registerPlanHook("chaoxing.oldChapterCommitPlan", dependencies.commitOldChapterPlan);
    if (dependencies.commitNewChapterPlan) registerPlanHook("chaoxing.newChapterCommitPlan", dependencies.commitNewChapterPlan);
  }

  const LABEL = "aopeng paper data";

  const AOPENG_PAPER_SLOTS = Object.freeze([ "exam-view-paper", "exam-pull-paper" ]);

  const SLOT_SET = new Set(AOPENG_PAPER_SLOTS);

  const MAX_EMBEDDED_JSON_DEPTH = 3;

  function decodeEmbeddedJson(value) {
    let current = value;
    for (let depth = 0; depth < MAX_EMBEDDED_JSON_DEPTH; depth += 1) {
      if (typeof current !== "string") return current;
      const trimmed = current.trim();
      if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return current;
      try {
        current = JSON.parse(trimmed);
      } catch {
        return current;
      }
    }
    return current;
  }

  function pathValueThroughEmbeddedJson(source, path) {
    let current = decodeEmbeddedJson(source);
    for (const segment of path) {
      if (!current || typeof current !== "object") return null;
      const descriptor = Object.getOwnPropertyDescriptor(current, String(segment));
      if (!descriptor) return null;
      if (!("value" in descriptor)) throw new RuleDomainError("scope_value_unsafe", `${LABEL} path contains an accessor: ${String(segment)}`);
      current = decodeEmbeddedJson(descriptor.value);
    }
    return current;
  }

  function registerAopengRuleHooks(registry, environment) {
    registerLocalHook(registry, {
      id: "aopeng.paperData",
      phases: [ "capture", "diagnostic" ],
      capability: "network-read",
      parseArgs: args => {
        if (typeof args.slot !== "string" || !SLOT_SET.has(args.slot)) throw new Error(`unknown aopeng paper slot: ${String(args.slot)}`);
        return {
          slot: args.slot,
          fields: parseSnapshotFields(args.fields)
        };
      },
      validateResult: value => value === null || JsonRuleValueSchema.safeParse(value).success,
      execute: ({slot: slot, fields: fields}, {signal: signal}) => {
        let payload;
        try {
          payload = environment.readCapturedResponse(slot);
        } catch (error) {
          throw new RuleDomainError("aopeng_paper_unavailable", error instanceof Error ? error.message : "paper data is unavailable");
        }
        if (payload == null || typeof payload !== "object") return null;
        const state = createSnapshotState(signal, LABEL);
        const result = Object.create(null);
        for (const [name, path] of Object.entries(fields)) {
          const selected2 = pathValueThroughEmbeddedJson(payload, path);
          result[name] = selected2 == null ? null : cloneJsonValue(selected2, state);
        }
        return result;
      }
    });
  }

  const DEFAULT_MAX_TREES = 1e3;

  function normalizeHosts(hosts) {
    const normalized = new Set(hosts.map(host => host.trim().toLowerCase()).filter(Boolean));
    if (normalized.size === 0) throw new Error("JsonRulePlatformAdapter requires at least one host");
    for (const host of normalized) {
      if (host.includes("/") || host.includes(":") || host.startsWith(".") || host.endsWith(".") || host.includes("..")) throw new Error(`invalid JsonRulePlatformAdapter host: ${host}`);
    }
    return normalized;
  }

  function matchesHost(hostname, hosts) {
    const current = hostname.toLowerCase();
    for (const host of hosts) {
      if (current === host || current.endsWith(`.${host}`)) return true;
    }
    return false;
  }

  function variantFlows(resolved) {
    const {variant: variant} = resolved;
    return [ variant.match, variant.capture, variant.fill, ...variant.diagnostics ? [ variant.diagnostics ] : [] ];
  }

  function publicFillPlan(plan) {
    return Object.freeze({
      path: plan.path,
      atomic: plan.atomic,
      fingerprint: plan.fingerprint,
      operations: plan.operations
    });
  }

  function isRuleFailure(error) {
    return error instanceof RuleDomainError || error instanceof RuleExecutionError;
  }

  class JsonRulePlatformAdapter {
    constructor(options) {
      __publicField(this, "platform");
      __publicField(this, "packageId");
      __publicField(this, "hosts");
      __publicField(this, "maxTrees");
      __publicField(this, "treeRuntimes", new WeakMap);
      __publicField(this, "activeRuntime", null);
      __publicField(this, "lastResolved", null);
      __publicField(this, "captureFailure", null);
      __publicField(this, "lastAttempts", []);
      __publicField(this, "captureGeneration", 0);
      __publicField(this, "lastHarvested", []);
      __publicField(this, "pageChangeListeners", new Set);
      this.options = options;
      if (!options.platform.trim() || !options.packageId.trim()) throw new Error("JsonRulePlatformAdapter identifiers cannot be empty");
      this.platform = options.platform;
      this.packageId = options.packageId;
      this.hosts = normalizeHosts(options.hosts);
      this.maxTrees = options.maxTrees ?? DEFAULT_MAX_TREES;
      new RuleCaptureRegistry({
        maxTrees: this.maxTrees
      }).dispose();
    }
    match(ctx) {
      return !ctx.signal.aborted && matchesHost(ctx.location.hostname, this.hosts) && this.options.store.resolve(this.packageId) !== null;
    }
    takeHarvested() {
      return this.lastHarvested.splice(0);
    }
    subscribePageChanges(listener) {
      this.pageChangeListeners.add(listener);
      let active2 = true;
      return () => {
        if (!active2) return;
        active2 = false;
        this.pageChangeListeners.delete(listener);
      };
    }
    ruleDiagnostics() {
      var _a2, _b, _c;
      return {
        resolved: this.options.store.resolve(this.packageId),
        variantId: ((_b = (_a2 = this.activeRuntime) == null ? void 0 : _a2.resolved) == null ? void 0 : _b.variant.id) ?? ((_c = this.lastResolved) == null ? void 0 : _c.variant.id) ?? null,
        attempts: this.lastAttempts,
        captureFailure: this.captureFailure,
        store: this.options.store.diagnostics(this.packageId)
      };
    }
    async captureTrees(ctx) {
      var _a2;
      const generation = ++this.captureGeneration;
      const previous = this.activeRuntime;
      this.activeRuntime = null;
      this.lastResolved = null;
      this.captureFailure = null;
      if (previous) await this.disposeRuntime(previous);
      if (!this.match(ctx) || generation !== this.captureGeneration) return [];
      const runtime = this.createRuntime(ctx);
      try {
        const resolved = await runtime.resolver.resolve(this.packageId, {
          signal: ctx.signal
        });
        if (!resolved || resolved.pkg.platform !== this.platform) {
          await this.disposeRuntime(runtime);
          return [];
        }
        this.lastResolved = resolved;
        runtime.resolved = resolved;
        runtime.refs.tightenDomRefCap((_a2 = resolved.variant.limits) == null ? void 0 : _a2.maxDomRefs);
        const result = await runtime.interpreter.run(resolved.variant.capture, {
          phase: "capture",
          signal: ctx.signal,
          capabilities: new Set(resolved.pkg.capabilities),
          limits: resolved.variant.limits,
          flows: variantFlows(resolved),
          resources: runtime.resources
        });
        this.lastHarvested.push(...runtime.capture.takeHarvested());
        if (!runtime.capture.ownsFinishedResult(result.value)) throw new RuleDomainError("invalid_capture_result", "capture flow must return capture.finish from its current registry");
        if (generation !== this.captureGeneration) {
          await this.disposeRuntime(runtime);
          return [];
        }
        const trees = result.value;
        if (trees.length === 0) {
          if (!resolved.variant.lifecycle) {
            await this.disposeRuntime(runtime);
            return [];
          }
          this.activeRuntime = runtime;
          await this.startLifecycle(runtime, resolved);
          if (generation !== this.captureGeneration) {
            if (this.activeRuntime === runtime) this.activeRuntime = null;
            await this.disposeRuntime(runtime);
          }
          return [];
        }
        this.activeRuntime = runtime;
        for (const tree of trees) this.treeRuntimes.set(tree, runtime);
        return trees;
      } catch (error) {
        if (this.activeRuntime === runtime) this.activeRuntime = null;
        await this.disposeRuntime(runtime);
        if (isRuleFailure(error)) {
          this.captureFailure = error.code;
          return [];
        }
        throw error;
      }
    }
    async applyTreeFillPlan(captured, plan, ctx) {
      const runtime = this.treeRuntimes.get(captured);
      if (!runtime || runtime.disposed || runtime !== this.activeRuntime || runtime.ctx.document !== ctx.document || runtime.ctx.location !== ctx.location || !this.match(ctx) || !runtime.resolved) return false;
      try {
        assertSafetyCapability(plan.safetyCapability);
      } catch {
        return false;
      }
      if (safetyPlanForCapability(plan.safetyCapability) !== plan) return false;
      try {
        const result = await runtime.interpreter.run(runtime.resolved.variant.fill, {
          phase: "fill",
          signal: ctx.signal,
          reserved: {
            $safety: plan.safetyCapability,
            $plan: publicFillPlan(plan)
          },
          capabilities: new Set(runtime.resolved.pkg.capabilities),
          limits: runtime.resolved.variant.limits,
          flows: variantFlows(runtime.resolved)
        });
        if (result.value !== true) return false;
        return runtime.writer.verifyPlan(plan, ctx.signal);
      } catch (error) {
        if (isRuleFailure(error)) return false;
        throw error;
      }
    }
    async dispose() {
      this.captureGeneration += 1;
      const runtime = this.activeRuntime;
      this.activeRuntime = null;
      this.lastResolved = null;
      this.pageChangeListeners.clear();
      if (runtime) await this.disposeRuntime(runtime);
    }
    createRuntime(ctx) {
      var _a2, _b;
      const refs = new RuntimeReferenceRegistry({
        maxDomRefs: this.options.policy.limits.maxDomRefs
      });
      const capture2 = new RuleCaptureRegistry({
        maxTrees: this.maxTrees
      });
      const resources = new RuleResourceScope;
      resources.add(() => capture2.dispose());
      resources.bind(ctx.signal);
      const registry = new PrimitiveRegistry;
      const writer = new BindingRegistryAnswerWriter(capture2.bindings);
      const environment = {
        ctx: ctx,
        refs: refs,
        capture: capture2,
        resources: resources,
        writer: writer
      };
      const interpreter = new RuleInterpreter({
        registry: registry,
        policy: this.options.policy,
        services: this.options.services
      });
      this.lastAttempts = [];
      const runtime = {
        ...environment,
        interpreter: interpreter,
        resolver: new JsonRuleResolver({
          store: this.options.store,
          interpreter: interpreter,
          onAttempt: attempt => {
            this.lastAttempts = [ ...this.lastAttempts, attempt ];
          }
        }),
        resolved: null,
        lifecycle: null,
        disposed: false
      };
      registerCoreRulePrimitives(registry, {
        document: ctx.document,
        location: ctx.location,
        refs: refs,
        capture: capture2,
        writer: writer,
        resources: resources,
        emit: event => {
          void this.dispatchLifecycleEvent(runtime, event);
        }
      });
      (_b = (_a2 = this.options).configureRegistry) == null ? void 0 : _b.call(_a2, registry, environment);
      return runtime;
    }
    async startLifecycle(runtime, resolved) {
      const definition = resolved.variant.lifecycle;
      if (!definition) return;
      const machine = new RuleStateMachine({
        interpreter: runtime.interpreter,
        definition: definition,
        flows: variantFlows(resolved),
        capabilities: new Set(resolved.pkg.capabilities),
        signal: runtime.ctx.signal,
        resources: runtime.resources,
        limits: resolved.variant.limits
      });
      runtime.lifecycle = machine;
      await machine.start();
    }
    async dispatchLifecycleEvent(runtime, event) {
      const lifecycle = runtime.lifecycle;
      if (!lifecycle || runtime.disposed || runtime !== this.activeRuntime) return;
      try {
        const result = await lifecycle.dispatch(event.event, event.payload);
        if (!result.transitioned || runtime.disposed || runtime !== this.activeRuntime) return;
        for (const listener of [ ...this.pageChangeListeners ]) listener();
      } catch {}
    }
    async disposeRuntime(runtime) {
      if (runtime.disposed) return;
      runtime.disposed = true;
      runtime.capture.dispose();
      await runtime.resources.dispose();
    }
  }

  const CHA0XING_FONT_TABLE_MD5 = "87594bb90a8153dd8fbe69683c451b1c";

  function parseChaoxingFontTable(raw) {
    if (!raw || cxFontMd5(raw) !== CHA0XING_FONT_TABLE_MD5) return null;
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

  const HASH_PATTERN = /^[0-9a-f]{64}$/;

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
    const snapshot2 = input;
    if (Array.isArray(snapshot2.entries)) for (const item of snapshot2.entries) {
      if (!Array.isArray(item) || item.length !== 2) continue;
      const [key, value] = item;
      if (typeof key !== "string" || !HASH_PATTERN.test(key)) continue;
      const parsed = parseEntry(value);
      if (parsed) entries.set(key, parsed);
    }
    if (Array.isArray(snapshot2.tombstones)) for (const item of snapshot2.tombstones) {
      if (!Array.isArray(item) || item.length !== 2) continue;
      const [key, at] = item;
      if (typeof key !== "string" || !HASH_PATTERN.test(key)) continue;
      if (typeof at !== "number" || !(at > 0)) continue;
      tombstones.set(key, at);
    }
    const clearedAt = snapshot2.clearedAt;
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
      if (!HASH_PATTERN.test(unitHash)) return false;
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
      var _a2;
      const parsedRaw = JSON.parse(text);
      return {
        incoming: parseSnapshot$1(parsedRaw).entries,
        rawCount: ((_a2 = parsedRaw.entries) == null ? void 0 : _a2.length) ?? 0
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

  function createPanelPositionSnapshot(position2) {
    return {
      schemaVersion: 1,
      x: Math.round(position2.x),
      y: Math.round(position2.y)
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

  function savePanelPosition(storage, position2) {
    storage.set(PANEL_POSITION_KEY, createPanelPositionSnapshot(position2));
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

  function clampPanelPosition(position2, panel, viewport, margin = PANEL_VIEWPORT_MARGIN) {
    const freeX = Math.max(0, viewport.width - panel.width);
    const freeY = Math.max(0, viewport.height - panel.height);
    return {
      x: clampAxis(position2.x, freeX, margin),
      y: clampAxis(position2.y, freeY, margin)
    };
  }

  function remapAxis(value, fromFree, toFree, margin) {
    const from = axisRange(fromFree, margin);
    const to = axisRange(toFree, margin);
    const clamped = clampAxis(value, fromFree, margin);
    const ratio = from.max === from.min ? .5 : (clamped - from.min) / (from.max - from.min);
    return Math.round(to.min + ratio * (to.max - to.min));
  }

  function remapPanelPosition(position2, fromPanel, toPanel, viewport, margin = PANEL_VIEWPORT_MARGIN) {
    return {
      x: remapAxis(position2.x, Math.max(0, viewport.width - fromPanel.width), Math.max(0, viewport.width - toPanel.width), margin),
      y: remapAxis(position2.y, Math.max(0, viewport.height - fromPanel.height), Math.max(0, viewport.height - toPanel.height), margin)
    };
  }

  function createBackendSecurityClient(options) {
    const deviceKeys = new DeviceKeyManager(options.storage);
    const sessions = new SecureSessionClient({
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
      transport: new SecureTransport({
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

  const setPanelPosition = position2 => savePanelPosition(panelPositionStorage, position2);

  const localAnswerCache = new LocalAnswerCache({
    get: key => _GM_getValue(key, null),
    set: (key, value) => _GM_setValue(key, value)
  });

  const CLIENT_ID_KEY = "aiask_client_id";

  const getClientId = () => {
    let id = _GM_getValue(CLIENT_ID_KEY, "") || "";
    if (!id) {
      id = crypto.randomUUID();
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
    const count2 = blob.count;
    if (typeof count2 !== "number" || !Number.isSafeInteger(count2) || count2 < 0) return 0;
    return Math.min(count2, EVIDENCE_DAILY_LIMIT);
  };

  const evidenceQuota = {
    today: () => readEvidenceQuotaCount(localDayKey()),
    bump: () => {
      const day = localDayKey();
      const count2 = Math.min(readEvidenceQuotaCount(day) + 1, EVIDENCE_DAILY_LIMIT);
      _GM_setValue(EVIDENCE_QUOTA_KEY, {
        day: day,
        count: count2
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
    if (origin === IMPORT_BRIDGE_ORIGIN) return true;
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

  function errorReply(requestId2, reason) {
    return {
      channel: IMPORT_BRIDGE_REPLY_CHANNEL,
      v: IMPORT_BRIDGE_VERSION,
      requestId: requestId2,
      kind: "error",
      reason: reason
    };
  }

  function importBridgeReplyFor(event, cache, selfWindows) {
    if (!isAllowedOrigin(event.origin)) return null;
    if (!selfWindows.includes(event.source)) return null;
    const request = parseImportBridgeRequest(event.data);
    if (!request) return null;
    if (request.kind === "ping") return {
      channel: IMPORT_BRIDGE_REPLY_CHANNEL,
      v: IMPORT_BRIDGE_VERSION,
      requestId: request.requestId,
      kind: "pong",
      scriptVersion: SCRIPT_VERSION
    };
    if (!cache) return null;
    try {
      if (request.kind === "preview") return importBridgePreviewReply(request.requestId, cache.previewImport(request.snapshot));
      const counts = cache.importJson(request.snapshot);
      if (cache.hasPersistFailure()) return errorReply(request.requestId, "import-failed");
      return importBridgeCommitReply(request.requestId, counts);
    } catch {
      return errorReply(request.requestId, "invalid-snapshot");
    }
  }

  function looksLikeBridgeMessage(data) {
    return typeof data === "object" && data !== null && data.channel === IMPORT_BRIDGE_CHANNEL;
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
    const {debounceMs: debounceMs = 300, maxWaitMs: maxWaitMs = 1e3, maxTriggers: maxTriggers2 = 200} = options;
    let triggers = 0;
    const scheduler = createPageChangeScheduler(view, () => {
      triggers += 1;
      if (triggers >= maxTriggers2) observer.disconnect();
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
    var count2 = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < count2; i++) {
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
      var count2 = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < count2; i++) {
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
    var count2 = bin.readUshort(data, offset);
    offset += 2;
    if (cvg.fmt == 1) cvg.tab = bin.readUshorts(data, offset, count2);
    if (cvg.fmt == 2) cvg.tab = bin.readUshorts(data, offset, count2 * 3);
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
    var count2 = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < count2; i++) {
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
    var count2 = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < count2; i++) {
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
    var count2 = bin.readUshort(data, offset);
    offset += 2;
    var offsize = data[offset];
    offset++;
    if (offsize == 1) for (var i = 0; i < count2 + 1; i++) inds.push(data[offset + i]); else if (offsize == 2) for (var i = 0; i < count2 + 1; i++) inds.push(bin.readUshort(data, offset + i * 2)); else if (offsize == 3) for (var i = 0; i < count2 + 1; i++) inds.push(bin.readUint(data, offset + i * 3 - 1) & 16777215); else if (count2 != 0) throw "unsupported offset size: " + offsize + ", count: " + count2;
    offset += (count2 + 1) * offsize;
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
      var count2 = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < count2; i++) {
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
    var count2 = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    var offset0 = offset;
    for (var i = 0; i < count2; i++) {
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
      var soff = offset0 + count2 * 12 + noffset;
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
        var count2 = stack.length;
        var isX = v == "o6";
        for (var j = 0; j < count2; j++) {
          var sval = stack.shift();
          if (isX) x += sval; else y += sval;
          isX = !isX;
          Typr.U.P.lineTo(p, x, y);
        }
      } else if (v == "o8" || v == "o24") {
        var count2 = stack.length;
        var index = 0;
        while (index + 6 <= count2) {
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
        var count2, count1 = stack.length;
        var index = 0;
        var alternate = v == "o31";
        count2 = count1 & -3;
        index += count1 - count2;
        while (index < count2) {
          if (alternate) {
            c1x = x + stack.shift();
            c1y = y;
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            y = c2y + stack.shift();
            if (count2 - index == 5) {
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
            if (count2 - index == 5) {
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
          url: baseUrl + ANNOUNCEMENT_PATH,
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
        parsed = AnnouncementResponseSchema.safeParse(JSON.parse(body));
      } catch {
        return FAILED(false);
      }
      if (!parsed.success) return FAILED(false);
      if (parsed.data.code !== AiAskCode.Ok) return FAILED(parsed.data.code === AiAskCode.Busy);
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
    [AiAskCode.Invalid]: "\u7528\u6237\u540d\u3001\u5bc6\u7801\u6216\u4eba\u673a\u9a8c\u8bc1\u65e0\u6548",
    [AiAskCode.Unauthorized]: "\u7528\u6237\u540d\u6216\u5bc6\u7801\u9519\u8bef",
    [AiAskCode.RateLimited]: "\u64cd\u4f5c\u592a\u9891\u7e41\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5",
    [AiAskCode.Busy]: "\u670d\u52a1\u7e41\u5fd9\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5"
  };

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
        url: baseUrl + (mode === "register" ? AUTH_REGISTER_PATH : AUTH_LOGIN_PATH),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": crypto.randomUUID()
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
      const parsed = AuthResponseSchema.safeParse(JSON.parse(res.body));
      if (!parsed.success) return {
        message: MESSAGE$1[AiAskCode.Busy]
      };
      const {code: code, token: token, reason: reason} = parsed.data;
      if (code === AiAskCode.Ok && token) return {
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
        message: MESSAGE$1[code] ?? MESSAGE$1[AiAskCode.Busy]
      };
    } catch {
      return {
        message: MESSAGE$1[AiAskCode.Busy]
      };
    }
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

  const usableSelector = (value, probe) => {
    try {
      probe.createDocumentFragment().querySelector(value);
      return true;
    } catch {
      return false;
    }
  };

  const firstString = value => typeof value === "string" && value.trim() ? value : null;

  function resolveCourseConfig(remote, probe = globalThis.document) {
    if (!remote || typeof remote !== "object" || !probe) return DEFAULT_COURSE_CONFIG;
    const table = remote;
    const next = {
      ...DEFAULT_COURSE_CONFIG
    };
    for (const [key, field] of Object.entries(SELECTOR_KEYS)) {
      const value = firstString(table[key]);
      if (value === null) continue;
      const isSelector = field !== "taskDoneText" && field !== "bigPlayLabel" && field !== "activePagerZIndex" && field !== "chapterTestDoneClass" && field !== "chapterTestDoneText";
      if (isSelector && !usableSelector(value, probe)) continue;
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
      return Object.freeze([ kind, override && usableSelector(override, probe) ? override : selector ]);
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

  function applyCourseConfig(remote, probe) {
    active = resolveCourseConfig(remote, probe);
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

  const STOPPING_BLOCK_REASONS = new Set([ "budget-exhausted", "advance-failed", "locked" ]);

  function isRunnerStopped(state) {
    if (state.kind === "course-done" || state.kind === "section-done") return true;
    if (state.kind === "finished" || state.kind === "section-stalled") return true;
    return state.kind === "blocked" && STOPPING_BLOCK_REASONS.has(state.reason);
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
      var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v;
      const memoryPressure = (_a2 = options.memoryGuard) == null ? void 0 : _a2.check();
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
        if (!tabs || idleTicks < grace) {
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
      } catch {}
    };
    return {
      read: slot => store.get(slot) ?? null,
      clear: () => store.clear(),
      consume: consume,
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

  const AOPENG_CAPTURE_HOST = "os.open.com.cn";

  const [EXAM_VIEW_PAPER, EXAM_PULL_PAPER] = AOPENG_PAPER_SLOTS;

  const AOPENG_CAPTURE_RULES = Object.freeze([ Object.freeze({
    slot: EXAM_VIEW_PAPER,
    host: AOPENG_CAPTURE_HOST,
    pathIncludes: "/StudentViewPaper"
  }), Object.freeze({
    slot: EXAM_PULL_PAPER,
    host: AOPENG_CAPTURE_HOST,
    pathIncludes: "/StudentPullPaper_V2"
  }) ]);

  const aopengResponseCapture = createXhrResponseCapture(AOPENG_CAPTURE_RULES);

  const capture = aopengResponseCapture;

  function readAopengCapturedResponse(slot) {
    return capture.read(slot);
  }

  let applicable = false;

  let installTarget = "none";

  let installed = false;

  function dig(value, path) {
    let current = value;
    for (const key of path) {
      if (typeof current === "string") {
        try {
          current = JSON.parse(current);
        } catch {
          return null;
        }
      }
      if (!current || typeof current !== "object") return null;
      current = current[key];
    }
    return current;
  }

  function firstId(value) {
    if (!Array.isArray(value) || value.length === 0) return null;
    const head = value[0];
    return head && typeof head.I1 === "string" ? head.I1 : null;
  }

  function firstDomQuestionId(doc) {
    const el = doc == null ? void 0 : doc.querySelector("#paperPreview .topic-cont[identifier]");
    return (el == null ? void 0 : el.getAttribute("identifier")) ?? null;
  }

  function domQuestionCount(doc) {
    if (!doc) return null;
    return doc.querySelectorAll("#paperPreview .question-item").length;
  }

  const HOOK_FIELD_PATHS = {
    items: [ "Data", "Answer", "TestPaperData", "Data", "Items" ],
    itemsNested: [ "Data", "Answer", "TestPaperData", "Data", "Data", "Items" ],
    sheet: [ "Data", "Answer", "AnswerSheet", "ResultList" ],
    result: [ "Data", "Answer", "AnswerResult", "Data", "Items" ]
  };

  function hookFieldLengths(payload) {
    const out = {};
    for (const [name, path] of Object.entries(HOOK_FIELD_PATHS)) {
      try {
        const value = pathValueThroughEmbeddedJson(payload, [ ...path ]);
        out[name] = Array.isArray(value) ? value.length : value === null || value === void 0 ? "null" : typeof value;
      } catch (error) {
        out[name] = `throw:${error.code ?? "unknown"}`;
      }
    }
    return out;
  }

  function domShape(doc) {
    const first = {};
    if (!doc) return {
      types: [],
      first: first
    };
    const types = [ ...new Set([ ...doc.querySelectorAll("#paperPreview .topic-cont[itemtype]") ].map(el => el.getAttribute("itemtype") ?? "").filter(Boolean)) ].slice(0, 8);
    const q = doc.querySelector("#paperPreview .question-item");
    if (q) {
      first.hasTopicCont = q.querySelector(".topic-cont") !== null;
      first.hasIdentifier = q.querySelector(".topic-cont[identifier]") !== null;
      first.hasStem = q.querySelector(".topic-cont > p.text") !== null;
      first.optionCount = q.querySelectorAll("ul.options > li").length;
      first.hasTopicAnswer = q.querySelector(".topic-answer") !== null;
    }
    return {
      types: types,
      first: first
    };
  }

  function probeJoin(payload, doc) {
    const items = dig(payload, [ "Data", "Answer", "TestPaperData", "Data", "Items" ]);
    const sheet = dig(payload, [ "Data", "Answer", "AnswerSheet", "ResultList" ]);
    const result = dig(payload, [ "Data", "Answer", "AnswerResult", "Data", "Items" ]);
    const itemId = firstId(items);
    const sheetId = firstId(sheet);
    const domId = firstDomQuestionId(doc);
    const dom = domShape(doc);
    const sheetIds = new Set((Array.isArray(sheet) ? sheet : []).map(row => row == null ? void 0 : row.I1).filter(id => typeof id === "string"));
    const count2 = v => Array.isArray(v) ? v.length : 0;
    return {
      items: count2(items),
      sheet: count2(sheet),
      result: count2(result),
      sheetIdMatchesItem: itemId !== null && firstId(sheet) === itemId,
      resultIdMatchesItem: itemId !== null && firstId(result) === itemId,
      sheetIdMatchesResult: sheetId !== null && firstId(result) === sheetId,
      domIdFoundInSheet: domId === null ? null : sheetIds.has(domId),
      markStatusValues: [ ...new Set((Array.isArray(result) ? result : []).map(row => row == null ? void 0 : row.MarkStatus).filter(v => typeof v === "number")) ].sort((a, b) => a - b).slice(0, 8),
      domQuestionCount: domQuestionCount(doc),
      hookFieldLengths: hookFieldLengths(payload),
      domItemTypes: dom.types,
      domFirstQuestion: dom.first
    };
  }

  function aopengCaptureStatus(doc) {
    if (!applicable) return null;
    const filledSlots = AOPENG_PAPER_SLOTS.filter(slot => capture.read(slot) != null);
    const slotShapes = {};
    const slotJoinProbe = {};
    for (const slot of filledSlots) {
      const payload = capture.read(slot);
      slotShapes[slot] = describeJsonShape(payload);
      slotJoinProbe[slot] = probeJoin(payload, doc);
    }
    return {
      target: installTarget,
      installed: installed,
      filledSlots: filledSlots,
      slotShapes: slotShapes,
      slotJoinProbe: slotJoinProbe
    };
  }

  function installAopengResponseCapture(hostname) {
    if (hostname.trim().toLowerCase() !== AOPENG_CAPTURE_HOST) return false;
    applicable = true;
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
    installed = capture.install(target);
    return installed;
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
        var _a2;
        return !(body == null ? void 0 : body.isConnected) || ((_a2 = body.getAttribute("contenteditable")) == null ? void 0 : _a2.toLowerCase()) !== "true";
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
      var _a2, _b, _c;
      if (ctx.signal.aborted || !isChaoxingHost(ctx.location.hostname) || ctx.location.pathname !== PAGED_PATH) return "ready";
      const previewLinks = Array.from(ctx.document.querySelectorAll("a.completeBtn")).filter(element => element.isConnected && normalizedText$1(element) === "\u6574\u5377\u9884\u89c8" && /^\s*topreview\s*\(\s*\)\s*;?\s*$/.test(element.getAttribute("onclick") ?? ""));
      if (previewLinks.length !== 1) return "ready";
      const storage = (_a2 = ctx.document.defaultView) == null ? void 0 : _a2.sessionStorage;
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

  const CHA0XING_UNROUTED_PACKAGE_ID = "chaoxing-unrouted";

  const CHA0XING_STUDENTSTUDY_PATHS = [ "/mycourse/studentstudy", "/mooc-ans/mycourse/studentstudy" ];

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
    const regex = new IsolatedRegexExecutor(createWorker);
    const services = {
      regex: request => regex.execute(request),
      jsonPath: ({value: value, query: query, signal: signal}) => executeJsonPath(value, query, {
        signal: signal
      })
    };
    return Object.freeze(services);
  }

  const RULE_EXPRESSION_SERVICES = createRuleExpressionServices();

  const RULE_ENGINE_VERSION = "1.6.0";

  const RULE_LIMITS = Object.freeze({
    maxSteps: 5e4,
    maxWallMs: 6e3,
    maxAsyncMs: 1e3,
    maxLoopIterations: 256,
    maxCallDepth: 8,
    maxDomRefs: 4e3
  });

  const CORE_RULE_PRIMITIVES = Object.freeze([ "page.location", "page.queryParam", "dom.queryCss", "dom.queryCssAll", "dom.queryXPath", "dom.queryXPathAll", "dom.text", "dom.content", "dom.attr", "dom.property", "dom.closest", "dom.parent", "dom.children", "dom.index", "wait.selector", "frame.list", "frame.enter", "frame.findSameOrigin", "frame.findAllSameOrigin", "content.sanitize", "text.includes", "text.stripOptionPrefix", "text.normalizeTruth", "question.normalizeLeafType", "array.append", "capture.registerLeafDom", "capture.registerLeafBindingDom", "capture.registerTree", "capture.harvestLeaf", "capture.finish", "answer.applyPlan", "dom.clickAnswer", "dom.setChecked", "dom.setValue", "dom.setSelected", "matching.pair", "observe.mutation", "observe.urlChange" ]);

  const CORE_CAPABILITIES = Object.freeze([ "dom-read", "frame-read", "runtime-read", "answer-write" ]);

  const GENERIC_DOM_RULE_POLICY = {
    primitives: new Set(CORE_RULE_PRIMITIVES),
    capabilities: new Set(CORE_CAPABILITIES),
    limits: RULE_LIMITS
  };

  const AOPENG_RULE_POLICY = {
    primitives: new Set([ ...CORE_RULE_PRIMITIVES, "aopeng.paperData" ]),
    capabilities: new Set([ ...CORE_CAPABILITIES, "network-read" ]),
    limits: RULE_LIMITS
  };

  const CHA0XING_RULE_POLICY = {
    primitives: new Set([ ...CORE_RULE_PRIMITIVES, "chaoxing.normalizeTitle", "chaoxing.decodeFont", "chaoxing.harvestAnswerValues", "chaoxing.ueditorBodies", "chaoxing.examRegisterQuestion", "chaoxing.examPreparePlan", "chaoxing.examCommitPlan", "chaoxing.doworkCommitPlan", "chaoxing.studentstudyCommitPlan", "chaoxing.oldHomeworkCommitPlan", "chaoxing.oldChapterCommitPlan", "chaoxing.newChapterCommitPlan" ]),
    capabilities: new Set(CORE_CAPABILITIES),
    limits: RULE_LIMITS
  };

  const TRUSTED_REMOTE_RULE_PLATFORMS = Object.freeze([ Object.freeze({
    platform: "wangxiao",
    packageId: "wangxiao-xatu-chapter-assessment",
    hosts: Object.freeze([ "xatu.168wangxiao.com" ]),
    policy: GENERIC_DOM_RULE_POLICY
  }), Object.freeze({
    platform: "aopeng",
    packageId: "aopeng-os-homework-online",
    hosts: Object.freeze([ "os.open.com.cn" ]),
    policy: AOPENG_RULE_POLICY
  }) ]);

  const SUPPORTED_HOST_PATTERN = /^(?:(?:[^.]+\.)*chaoxing\.com|xatu\.168wangxiao\.com|os\.open\.com\.cn)$/u;

  const normalizedHost = hostname => hostname.trim().toLowerCase();

  function trustedRemoteRulePlatformFor(hostname) {
    const host = normalizedHost(hostname);
    return TRUSTED_REMOTE_RULE_PLATFORMS.find(entry => entry.hosts.some(candidate => candidate === host)) ?? null;
  }

  function trustedRemoteRulePlatformByPackageId(packageId) {
    return TRUSTED_REMOTE_RULE_PLATFORMS.find(entry => entry.packageId === packageId) ?? null;
  }

  function objectValue(value) {
    return value !== null && typeof value === "object";
  }

  function elementValue(value) {
    if (!objectValue(value) || typeof value.tagName !== "string" || typeof value.getAttribute !== "function") return null;
    return value;
  }

  function ueditorApi(document2) {
    var _a2, _b;
    let candidate;
    try {
      candidate = (_a2 = pageWindowForDocument(document2)) == null ? void 0 : _a2.UE;
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
    var _a2, _b;
    if (!body || !body.isConnected || ((_a2 = body.getAttribute("contenteditable")) == null ? void 0 : _a2.toLowerCase()) !== "true") return false;
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
    var _a2;
    if (!textarea.id) return null;
    const expectedFrame = expectedEditorFrame(textarea);
    if (!(expectedFrame == null ? void 0 : expectedFrame.isConnected)) return null;
    if (objectValue(api.instants)) {
      for (const editor of Object.values(api.instants)) {
        const body = bodyFromEditor(editor);
        if (!validEditorBody(body, expectedFrame)) continue;
        const candidate = editor;
        const container = elementValue(candidate.container);
        if (candidate.id === textarea.id || (container == null ? void 0 : container.contains(textarea)) || ((_a2 = body.ownerDocument.defaultView) == null ? void 0 : _a2.frameElement) === expectedFrame) return candidate;
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
    var _a2;
    const candidates = [ ...document2.querySelectorAll("a") ].filter(element => {
      const onclick = element.getAttribute("onclick") ?? "";
      return normalizedElementText(element) === DOWORK_SAVE_TEXT || onclick.includes("saveWork");
    });
    if (candidates.length !== 1) return null;
    const target = candidates[0];
    if (!target || !target.isConnected || target.tagName.toLowerCase() !== "a" || normalizedElementText(target) !== DOWORK_SAVE_TEXT || !DOWORK_SAVE_HANDLERS.has(((_a2 = target.getAttribute("onclick")) == null ? void 0 : _a2.trim()) ?? "") || target.classList.contains("completeBtn") || target.closest(".completeBtn")) return null;
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
        var _a2;
        return !(body == null ? void 0 : body.isConnected) || ((_a2 = body.getAttribute("contenteditable")) == null ? void 0 : _a2.toLowerCase()) !== "true";
      })) return false;
    }
    return true;
  }

  function validNoSubmitTarget(target) {
    var _a2;
    return !(!target || !target.isConnected || target.tagName.toLowerCase() !== "a" || normalizedElementText(target) !== NO_SUBMIT_SAVE_TEXT || !hasAnyClass(target, NO_SUBMIT_SAVE_CLASSES) || !target.classList.contains("workBtnIndex") || !NO_SUBMIT_SAVE_HANDLERS.has(((_a2 = target.getAttribute("onclick")) == null ? void 0 : _a2.trim()) ?? "") || hasAnyClass(target, NO_SUBMIT_BLOCKED_CLASSES) || target.closest(".btnSubmit, .Btn_blue_1, .completeBtn"));
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

  const doworkSaveTargets = document2 => {
    const target = safeDoworkSaveTarget(document2);
    return target ? [ target ] : null;
  };

  function unsafePageWindow() {
    try {
      return typeof unsafeWindow === "undefined" ? null : unsafeWindow ?? null;
    } catch {
      return null;
    }
  }

  function pageWindowForDocument(document2) {
    var _a2;
    const root = unsafePageWindow();
    if (!root) return document2.defaultView;
    const documentElement = document2.documentElement;
    if (!documentElement) return null;
    const previousProbe = documentElement.getAttribute(PAGE_WINDOW_PROBE_ATTRIBUTE);
    const probe = `aiask-${++pageWindowProbeSequence}`;
    documentElement.setAttribute(PAGE_WINDOW_PROBE_ATTRIBUTE, probe);
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
          if (((_a2 = current.window.document.documentElement) == null ? void 0 : _a2.getAttribute(PAGE_WINDOW_PROBE_ATTRIBUTE)) === probe) return current.window;
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

  function runNoSubmitSave(target, signal, requiresTextSync) {
    if (signal.aborted || !target.isConnected) return Promise.resolve(false);
    const pageWindow = pageWindowForDocument(target.ownerDocument);
    const handler = pageWindow == null ? void 0 : pageWindow.noSubmit;
    if (!pageWindow || typeof handler !== "function") return Promise.resolve(false);
    if (requiresTextSync && !syncUeditorAnswers(target.ownerDocument, pageWindow)) return Promise.resolve(false);
    return new Promise(resolve => {
      const originalAlert = pageWindow.alert;
      let settled = false;
      let started = false;
      let successSeen = false;
      const finish = value => {
        if (settled) return;
        settled = true;
        globalThis.clearTimeout(timeout);
        signal.removeEventListener("abort", onAbort);
        pageWindow.removeEventListener("pagehide", onPageHide);
        pageWindow.removeEventListener("beforeunload", onPageHide);
        try {
          pageWindow.alert = originalAlert;
        } catch {}
        resolve(value);
      };
      const onAbort = () => finish(false);
      const onPageHide = () => finish(started);
      const interceptedAlert = message => {
        const text = String(message ?? "").replace(/\s+/g, "").trim();
        if (text === NO_SUBMIT_SUCCESS_TEXT) {
          successSeen = true;
          if (started) finish(true);
          return;
        }
        finish(false);
        originalAlert.call(pageWindow, String(message ?? ""));
      };
      const timeout = globalThis.setTimeout(() => finish(false), NO_SUBMIT_CONFIRM_TIMEOUT_MS);
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
        handler.call(pageWindow);
        started = normalizedElementText(target) === NO_SUBMIT_PENDING_TEXT;
        if (!started) finish(false); else if (successSeen) finish(true);
      } catch {
        finish(false);
      }
    });
  }

  function syncUeditorAnswers(document2, pageWindow) {
    var _a2;
    const targets = [ ...document2.querySelectorAll('textarea[name^="answerEditor"], textarea[name^="answer"]:not([name^="answerEditor"])') ];
    if (targets.length === 0) return true;
    const api = objectValue(pageWindow.UE) ? pageWindow.UE : ueditorApi(document2);
    for (const textarea of targets) {
      const editor = api ? resolveUeditorEditor(textarea, api) : null;
      const body = editor ? bodyFromEditor(editor) : null;
      const text = ((_a2 = body == null ? void 0 : body.textContent) == null ? void 0 : _a2.trim()) ?? "";
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

  class ChaoxingDeferredSaveRuntime {
    constructor(safeTargets, execute = target => {
      target.click();
      return true;
    }) {
      __publicField(this, "document", null);
      __publicField(this, "pending", false);
      __publicField(this, "requiresTextSync", false);
      this.safeTargets = safeTargets;
      this.execute = execute;
    }
    stagePlan(plan, document2, signal) {
      if (signal.aborted || plan.operations.length === 0 || !this.safeTargets(document2)) return false;
      this.document = document2;
      this.pending = true;
      if (plan.operations.some(operation => operation.kind === "write")) this.requiresTextSync = true;
      return true;
    }
    async persist(ctx) {
      if (!this.pending) return true;
      if (ctx.signal.aborted || ctx.document !== this.document) return false;
      const targets = this.safeTargets(ctx.document);
      if (!targets) return false;
      try {
        for (const target of targets) if (!(await this.execute(target, ctx.signal, this.requiresTextSync))) return false;
        this.pending = false;
        this.document = null;
        this.requiresTextSync = false;
        return true;
      } catch {
        return false;
      }
    }
    dispose() {
      this.document = null;
      this.pending = false;
      this.requiresTextSync = false;
    }
  }

  function chaoxingRuleOptions(packageId, store, services, configureRegistry) {
    return {
      platform: "chaoxing",
      packageId: packageId,
      hosts: [ "chaoxing.com" ],
      store: store,
      policy: CHA0XING_RULE_POLICY,
      services: services,
      configureRegistry: configureRegistry
    };
  }

  const CHA0XING_SAVE_VARIANTS = Object.freeze({
    [CHA0XING_PACKAGE_IDS.dowork]: {
      commitKey: "commitDoworkPlan",
      safeTargets: doworkSaveTargets
    },
    [CHA0XING_PACKAGE_IDS.studentstudy]: {
      commitKey: "commitStudentstudyPlan",
      safeTargets: safeNoSubmitSaveTargets,
      execute: runNoSubmitSave,
      ready: isStudentstudyTextReady
    },
    [CHA0XING_PACKAGE_IDS.oldHomework]: {
      commitKey: "commitOldHomeworkPlan",
      safeTargets: safeNoSubmitSaveTargets,
      execute: runNoSubmitSave
    },
    [CHA0XING_PACKAGE_IDS.newChapter]: {
      commitKey: "commitNewChapterPlan",
      safeTargets: safeNoSubmitSaveTargets,
      execute: runNoSubmitSave
    },
    [CHA0XING_PACKAGE_IDS.oldChapter]: {
      commitKey: "commitOldChapterPlan",
      safeTargets: safeNoSubmitSaveTargets,
      execute: runNoSubmitSave
    }
  });

  class ChaoxingSaveRuleAdapter extends JsonRulePlatformAdapter {
    constructor(variant, packageId, store, typr, table, services) {
      const saveRuntime = new ChaoxingDeferredSaveRuntime(variant.safeTargets, variant.execute);
      super(chaoxingRuleOptions(packageId, store, services, (registry, environment) => registerChaoxingRuleHooks(registry, {
        typr: typr,
        table: table,
        refs: environment.refs,
        resolveUeditorBodies: targets => resolveUeditorBodies(targets, environment.ctx.document),
        [variant.commitKey]: (plan, signal) => saveRuntime.stagePlan(plan, environment.ctx.document, signal)
      })));
      __publicField(this, "saveRuntime");
      __publicField(this, "ready");
      this.saveRuntime = saveRuntime;
      this.ready = variant.ready;
    }
    async captureTrees(ctx) {
      const ready = this.ready;
      if (ready) {
        await waitUntil(() => ready(ctx.document), {
          timeout: STUDENTSTUDY_READY_TIMEOUT_MS,
          interval: 50,
          signal: ctx.signal
        });
        if (ctx.signal.aborted) return [];
      }
      return super.captureTrees(ctx);
    }
    persistAnswers(ctx) {
      return this.saveRuntime.persist(ctx);
    }
    async dispose() {
      this.saveRuntime.dispose();
      await super.dispose();
    }
  }

  class ChaoxingExamRuleAdapter extends JsonRulePlatformAdapter {
    constructor(packageId, store, typr, table, services) {
      const examRuntime = new ChaoxingExamRuntime;
      super(chaoxingRuleOptions(packageId, store, services, (registry, environment) => registerChaoxingRuleHooks(registry, {
        typr: typr,
        table: table,
        refs: environment.refs,
        resolveUeditorBodies: targets => resolveUeditorBodies(targets, environment.ctx.document),
        registerExamQuestion: registration => examRuntime.registerQuestion(registration),
        prepareExamPlan: (plan, signal) => examRuntime.preparePlan(plan, signal),
        commitExamPlan: (plan, signal) => examRuntime.commitPlan(plan, signal)
      })));
      __publicField(this, "examRuntime");
      this.examRuntime = examRuntime;
    }
    async captureTrees(ctx) {
      this.examRuntime.beginCapture();
      if (ctx.location.pathname === CHA0XING_EXAM_PREVIEW_PATH && !(await waitUntil(() => isChaoxingExamPreviewReady(ctx.document, targets => resolveUeditorBodies(targets, ctx.document)), {
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

  function createChaoxingRuleAdapter(packageId, store, typr, table, services) {
    const args = [ packageId, store, typr, table, services ];
    if (packageId === CHA0XING_PACKAGE_IDS.examStudent) return new ChaoxingExamRuleAdapter(...args);
    const saveVariant = CHA0XING_SAVE_VARIANTS[packageId];
    if (saveVariant) return new ChaoxingSaveRuleAdapter(saveVariant, ...args);
    return new JsonRulePlatformAdapter(chaoxingRuleOptions(packageId, store, services, (registry, environment) => registerChaoxingRuleHooks(registry, {
      typr: typr,
      table: table,
      refs: environment.refs,
      resolveUeditorBodies: targets => resolveUeditorBodies(targets, environment.ctx.document)
    })));
  }

  function createDefaultAdapterFactories(location2, typr, store, table = {}, services = RULE_EXPRESSION_SERVICES) {
    const trustedRemote = trustedRemoteRulePlatformFor(location2.hostname || new URL(location2.href).hostname);
    if (trustedRemote) return [ () => new JsonRulePlatformAdapter({
      platform: trustedRemote.platform,
      packageId: trustedRemote.packageId,
      hosts: trustedRemote.hosts,
      store: store,
      policy: trustedRemote.policy,
      services: services,
      ...trustedRemote.platform === "aopeng" ? {
        configureRegistry: registry => registerAopengRuleHooks(registry, {
          readCapturedResponse: readAopengCapturedResponse
        })
      } : {}
    }) ];
    const packageId = validatedRulePackageIdFor(location2);
    return packageId ? [ () => createChaoxingRuleAdapter(packageId, store, typr, table, services) ] : [];
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
    var _a2;
    for (const document2 of documents) {
      const list = (_a2 = courseWindow(document2)) == null ? void 0 : _a2.attachments;
      if (Array.isArray(list)) return list;
    }
    return null;
  }

  const attachmentJobId = attachment => {
    var _a2;
    const raw = attachment.jobid || ((_a2 = attachment.property) == null ? void 0 : _a2._jobid);
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
    var _a2, _b, _c;
    let frame = ((_a2 = document2.defaultView) == null ? void 0 : _a2.frameElement) ?? null;
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
    var _a2;
    try {
      return ((_a2 = document2 == null ? void 0 : document2.defaultView) == null ? void 0 : _a2.frameElement) ?? null;
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
    var _a2;
    const frame = document2.querySelector(courseConfig().timedReadFrame);
    const src = (frame == null ? void 0 : frame.getAttribute("src")) ?? "";
    const raw = (_a2 = /[?&]timing=(\d+)/u.exec(src)) == null ? void 0 : _a2[1];
    const timing = raw ? Number.parseInt(raw, 10) : TIMED_READ_FALLBACK_SECONDS;
    const seconds = Number.isFinite(timing) ? timing : TIMED_READ_FALLBACK_SECONDS;
    return (seconds + TIMED_READ_SLACK_SECONDS) * TIMED_READ_ROUNDS;
  };

  const moduleOf = attachment => {
    var _a2;
    return typeof ((_a2 = attachment.property) == null ? void 0 : _a2.module) === "string" ? attachment.property.module : "";
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

  function surveyTasks(documents) {
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

  function sectionCursor(documents) {
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
    const cursor = sectionCursor(documents);
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

  function chapterInfos(documents) {
    for (const document2 of documents) {
      const elements = [ ...document2.querySelectorAll(courseConfig().chapter) ];
      if (elements.length === 0) continue;
      return elements.map(element => {
        var _a2;
        const parent = element.parentElement;
        const counter = parent == null ? void 0 : parent.querySelector(courseConfig().jobUnfinishCount);
        const view = counter == null ? void 0 : counter.ownerDocument.defaultView;
        const raw = view && counter instanceof view.HTMLInputElement ? counter.value : (counter == null ? void 0 : counter.getAttribute("value")) ?? "0";
        return {
          element: element,
          chapterId: ((_a2 = CHAPTER_ID_PATTERN.exec(element.getAttribute("onclick") ?? "")) == null ? void 0 : _a2[3]) ?? null,
          unfinishedCount: Number.parseInt(raw, 10) || 0,
          active: (parent == null ? void 0 : parent.classList.contains("posCatalog_active")) ?? false
        };
      });
    }
    return [];
  }

  function nextUnfinishedChapter(chapters) {
    const pending = chapters.filter(chapter => chapter.unfinishedCount > 0 && !chapter.active);
    if (pending.length === 0) return null;
    const activeIndex = chapters.findIndex(chapter => chapter.active);
    return pending.find(chapter => chapters.indexOf(chapter) > activeIndex) ?? pending[0] ?? null;
  }

  function jumpToChapter(documents, chapter) {
    var _a2;
    const entry = (_a2 = chapter.element.parentElement) == null ? void 0 : _a2.querySelector(courseConfig().chapterName);
    if (entry) {
      try {
        entry.click();
        return true;
      } catch {}
    }
    const cursor = sectionCursor(documents);
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

  const MAX_PLAYBACK_RATE = 2;

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
    var _a2;
    if (flattened((_a2 = doc.body) == null ? void 0 : _a2.textContent).includes(courseConfig().taskDoneText)) return true;
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

  function playMedia(pending, options) {
    var _a2;
    const rate = Math.min(Math.max(options.playbackRate ?? 1, 1), MAX_PLAYBACK_RATE);
    pending.volume = options.volume ?? 0;
    pending.playbackRate = rate;
    void ((_a2 = pending.play()) == null ? void 0 : _a2.catch(() => {}));
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
        return playMedia(pending, options);
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
    const survey = surveyTasks(documents);
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
    return playMedia(pending, options);
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
    var _a2;
    const found = taskTabs(documents);
    if (!found || found.activeIndex < 0) return false;
    const next = found.activeIndex + 1;
    if (next >= found.count) return false;
    (_a2 = found.tabs[next]) == null ? void 0 : _a2.click();
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

  function advanceSection(documents) {
    const target = nextSectionTarget(documents);
    if (!target) return false;
    target.click();
    return true;
  }

  function sectionSignature(documents) {
    var _a2, _b;
    const href = ((_b = (_a2 = documents[0]) == null ? void 0 : _a2.location) == null ? void 0 : _b.href) ?? "";
    const tabs = taskTabs(documents);
    const labels = (tabs == null ? void 0 : tabs.tabs.map(tab => tab.textContent ?? "").join(",")) ?? "";
    return `${href}|${labels}`;
  }

  const SCROLLABLE_SLACK_PX = 8;

  const MAX_SCROLL_TARGETS = 2e3;

  function simulateReading(documents) {
    var _a2, _b, _c;
    const summary = {
      frames: documents.length,
      scrolled: 0,
      pagers: 0
    };
    for (const doc of documents) {
      const pager = [ ...doc.querySelectorAll(courseConfig().readerPager) ].find(el => {
        var _a3;
        return ((_a3 = el.style) == null ? void 0 : _a3.zIndex) === courseConfig().activePagerZIndex;
      });
      if (pager) {
        try {
          pager.click();
          summary.pagers += 1;
        } catch {}
      }
      try {
        (_c = (_a2 = doc.defaultView) == null ? void 0 : _a2.scrollTo) == null ? void 0 : _c.call(_a2, 0, ((_b = doc.documentElement) == null ? void 0 : _b.scrollHeight) ?? 0);
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

  const chapterLabel = chapter => {
    var _a2, _b;
    const name = ((_b = (_a2 = chapter.element.parentElement) == null ? void 0 : _a2.querySelector(courseConfig().chapterName)) == null ? void 0 : _b.textContent) ?? chapter.element.textContent;
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
    const chapters = chapterInfos(documents);
    if (chapters.length === 0) return null;
    if (counterElementCount(documents) === 0) return null;
    return {
      unfinished: chapters.reduce((sum, chapter) => sum + chapter.unfinishedCount, 0)
    };
  }

  function createChaoxingCourseAdapter() {
    return {
      step: stepMediaTask,
      survey: surveyTasks,
      courseCounter: courseCounter,
      simulateReading: simulateReading,
      navigate: {
        tabs: taskTabs,
        advanceTab: advanceTaskTab,
        sectionSignature: sectionSignature,
        sectionCursor: sectionCursor,
        chapters: chapterInfos,
        nextUnfinishedChapter: nextUnfinishedChapter,
        jumpToChapter: jumpToChapter,
        isSpecialMode: isSpecialMode,
        advanceSection: documents => advanceSectionViaSite(documents) || advanceSection(documents),
        chapterLabel: chapterLabel
      }
    };
  }

  function courseAdapterFor(platform) {
    if (platform === "chaoxing") return createChaoxingCourseAdapter();
    return null;
  }

  const SUBMIT_CLASSES = [ "btnBlueSubmit" ];

  const SUBMIT_HANDLERS = [ "btnBlueSubmit" ];

  const SUBMIT_TEXTS = [ "\u63d0\u4ea4", "\u4ea4\u5377", "\u786e\u5b9a\u63d0\u4ea4" ];

  const isExamPage = document2 => {
    var _a2;
    return (((_a2 = document2.location) == null ? void 0 : _a2.pathname) ?? "").includes("/exam");
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
        var _a2;
        return String(((_a2 = args[0]) == null ? void 0 : _a2.content) ?? "");
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
    var _a2;
    try {
      const doc = view.document;
      const form = (_a2 = doc == null ? void 0 : doc.forms) == null ? void 0 : _a2.namedItem("form1");
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

  async function pollFor(probe, timeoutMs, stepMs) {
    for (let waited = 0; waited <= timeoutMs; waited += stepMs) {
      const hit = probe();
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
    var _a2;
    const view = (_a2 = element.ownerDocument) == null ? void 0 : _a2.defaultView;
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
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
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
    (_a2 = state.onEntry) == null ? void 0 : _a2.call(state, "click", entryHandlerSource(frame.win));
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
        var _a3;
        return ((_a3 = state.isSubmitted) == null ? void 0 : _a3.call(state)) ? "submitted" : siteMessage.message() ? "refused" : null;
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
    var _a2;
    const used = (_a2 = view.performance.memory) == null ? void 0 : _a2.usedJSHeapSize;
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

  const previewOf = value => parseQuestionContent(value, {
    stripUntrustedTags: false
  }).map(part => part.type === "image" ? "[\u56fe\u7247]" : redactPreviewText(part.value)).join("").slice(0, 30);

  const imageCountOf = value => parseQuestionContent(value).filter(part => part.type === "image").length;

  function itemOf(input) {
    return {
      type: input.type,
      decodeFailed: input.decodeFailed ?? false,
      stemPreview: previewOf(input.stem),
      optionCount: input.options.length,
      imageCount: imageCountOf(input.stem) + input.options.reduce((count2, option) => count2 + imageCountOf(option), 0),
      unsupportedReason: input.unsupportedReason
    };
  }

  async function runDiagnostic(adapter, ctx) {
    var _a2;
    if (!adapter.match(ctx)) return {
      matched: false,
      count: 0,
      imageCount: 0,
      harvestedCount: 0,
      items: []
    };
    const items = (await adapter.captureTrees(ctx)).flatMap(tree => flattenQuestionTree(tree.root).map(unit => itemOf({
      type: unit.queryType === "short_answer" ? QuestionType.Fill : unit.queryType,
      stem: unit.effectiveStem,
      options: unit.options.map(option => option.content)
    })));
    return {
      matched: true,
      count: items.length,
      imageCount: items.reduce((count2, item) => count2 + item.imageCount, 0),
      harvestedCount: ((_a2 = adapter.takeHarvested) == null ? void 0 : _a2.call(adapter).length) ?? 0,
      items: items
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
        url: __privateGet(this, _deps).baseUrl + EVENTS_PATH,
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": crypto.randomUUID()
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
    const redactRoot = (root, depth) => {
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
        if (tag === "script" || tag === "style" || tag === "noscript") {
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
            const stripped = stripUrlQuery(attr.value);
            if (stripped !== attr.value) {
              el.setAttribute(attr.name, stripped);
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
    return {
      html: doc.documentElement.outerHTML,
      redactions: redactions
    };
  }

  const serialize = doc => {
    var _a2;
    return ((_a2 = doc.documentElement) == null ? void 0 : _a2.outerHTML) ?? "";
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
      var _a2;
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
          push(childDoc, ((_a2 = childDoc.location) == null ? void 0 : _a2.href) ?? "", childPath);
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
    var _a2;
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
      var _a3;
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
        collect(childDoc, ((_a3 = childDoc.location) == null ? void 0 : _a3.href) ?? "", depth + 1);
      }
    };
    collect(win.document, ((_a2 = win.location) == null ? void 0 : _a2.href) ?? "", 0);
    const renderDoc = doc => {
      var _a3, _b, _c;
      const raw = ((_a3 = doc.documentElement) == null ? void 0 : _a3.outerHTML) ?? "";
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
      const needy = renderable.filter(item => item.slot.used < item.html.length);
      const leftover = contentBudget - spent;
      if (leftover > 0 && needy.length > 0) {
        const extra = Math.floor(leftover / needy.length);
        for (const item of needy) {
          item.slot.used = Math.min(item.html.length, item.slot.used + extra);
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

  function bodyNodesBucket(count2) {
    if (!(count2 > 1)) return 0;
    return Math.min(MAX_BODY_BUCKET, Math.floor(Math.log2(count2)));
  }

  const countOf = (doc, selector, cap) => Math.min(cap, doc.querySelectorAll(selector).length);

  const READY_STATES = new Set([ "loading", "interactive", "complete" ]);

  const normalizeReadyState = raw => READY_STATES.has(raw) ? raw : "complete";

  function buildPageFingerprint(location2, document2) {
    var _a2;
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
        bodyNodes: bodyNodesBucket(((_a2 = document2.body) == null ? void 0 : _a2.getElementsByTagName("*").length) ?? 0),
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
        url: baseUrl + ME_PATH,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": crypto.randomUUID()
        },
        body: JSON.stringify({}),
        timeoutMs: 8e3
      });
      const parsed = MeResponseSchema.safeParse(JSON.parse(response.body));
      if (!parsed.success || parsed.data.code !== AiAskCode.Ok) return null;
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
    [AiAskCode.Invalid]: "\u5361\u5bc6\u65e0\u6548\u3001\u5df2\u7528\u6216\u5df2\u8fc7\u671f",
    [AiAskCode.Unauthorized]: "\u767b\u5f55\u5df2\u5931\u6548\uff0c\u8bf7\u91cd\u65b0\u767b\u5f55",
    [AiAskCode.RateLimited]: "\u64cd\u4f5c\u592a\u9891\u7e41\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5",
    [AiAskCode.Busy]: "\u670d\u52a1\u7e41\u5fd9\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5"
  };

  async function redeemCard(transport, code, baseUrl) {
    try {
      const res = await transport.send({
        url: baseUrl + REDEEM_PATH,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": crypto.randomUUID()
        },
        body: JSON.stringify({
          code: code
        }),
        timeoutMs: 8e3
      });
      const parsed = RedeemResponseSchema.safeParse(JSON.parse(res.body));
      if (!parsed.success) return {
        message: MESSAGE[AiAskCode.Busy]
      };
      const {code: rc, balance: balance} = parsed.data;
      if (rc === AiAskCode.Ok && typeof balance === "number") return {
        balance: balance,
        message: "ok"
      };
      if (rc === AiAskCode.Unauthorized) return {
        message: MESSAGE[AiAskCode.Unauthorized],
        unauthorized: true
      };
      return {
        message: MESSAGE[rc] ?? MESSAGE[AiAskCode.Busy]
      };
    } catch {
      return {
        message: MESSAGE[AiAskCode.Busy]
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
        url: baseUrl + REPORT_PATH,
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": crypto.randomUUID()
        },
        body: JSON.stringify(req),
        timeoutMs: 5e3
      });
      const parsed = ReportResponseSchema.safeParse(JSON.parse(res.body));
      return parsed.success ? parsed.data : null;
    } catch {
      return null;
    }
  }

  const PLATFORM_LABEL = Object.freeze({
    chaoxing: "\u8d85\u661f",
    wangxiao: "168 \u7f51\u6821",
    aopeng: "\u5965\u9e4f\u6559\u80b2"
  });

  const platformLabelFor = platform => PLATFORM_LABEL[platform] ?? platform;

  const PLATFORM_CEILING = Object.freeze({
    chaoxing: Object.freeze([ "answer", "harvest", "course-automation" ]),
    wangxiao: Object.freeze([ "answer", "harvest" ]),
    aopeng: Object.freeze([ "harvest" ])
  });

  const FALLBACK_FEATURES = Object.freeze([ "answer", "harvest" ]);

  function platformFeatures(platform, declared) {
    const ceiling = PLATFORM_CEILING[platform] ?? FALLBACK_FEATURES;
    return ceiling;
  }

  const MAX_RELEASE_CONTEXTS = MAX_RULE_PACKAGES * 3;

  function parseSnapshot(input) {
    if (!input || typeof input !== "object") throw new Error("rule release context snapshot must be an object");
    const snapshot2 = input;
    if (snapshot2.schemaVersion !== 1 || !Array.isArray(snapshot2.summaries) || snapshot2.summaries.length > MAX_RELEASE_CONTEXTS || Object.keys(snapshot2).some(key => key !== "schemaVersion" && key !== "summaries")) throw new Error("invalid rule release context snapshot");
    return snapshot2.summaries.map(summary => RulePackageSummarySchema.parse(summary));
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
    return adapter instanceof JsonRulePlatformAdapter ? adapter.ruleDiagnostics().captureFailure : null;
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
    var _a2;
    if (!(adapter instanceof JsonRulePlatformAdapter)) return null;
    return ((_a2 = adapter.ruleDiagnostics().resolved) == null ? void 0 : _a2.pkg) ?? null;
  }

  function buildRuleSessionDiagnostic(adapter, loadStatus, releaseSummaries = []) {
    var _a2, _b;
    if (!(adapter instanceof JsonRulePlatformAdapter)) return null;
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
      candidateVersion: (_a2 = diagnostics.store.candidate) == null ? void 0 : _a2.version,
      lastKnownGoodVersion: (_b = diagnostics.store.lastKnownGood) == null ? void 0 : _b.version,
      json: JSON.stringify(resolved.pkg, null, 2)
    };
  }

  const isDefinitivelyInvalid = error => error instanceof RuleVerificationError || error instanceof RuleStoreError && error.code === "snapshot_invalid" || error instanceof Error && error.name === "ZodError";

  class GmRuleStorePersistence {
    constructor(storage) {
      __publicField(this, "key", "aiask_rule_store_v1");
      this.storage = storage;
    }
    save(store) {
      this.storage.set(this.key, store.exportSnapshot());
    }
    async restore(store, verifier) {
      const snapshot2 = this.storage.get(this.key);
      if (snapshot2 == null) return "no-rules";
      try {
        await store.restoreSnapshot(snapshot2, verifier);
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
      const store = new RuleStore;
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
      this.storage.set(this.key, ServerKeysetSchema.parse(input));
    }
    load() {
      const input = this.storage.get(this.key);
      return input == null ? null : ServerKeysetSchema.parse(input);
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
      if (!(await verifyServerKeysetSignature(await importEcdsaPublicJwk(options.rootPublicJwk), keyset))) throw new Error("cached keyset root signature rejected");
      const highestAcceptedVersion = await readKeysetWatermark(options.storage, options.baseUrl, options.inheritLegacyKeysetWatermark);
      validateServerKeyset(keyset, (options.now ?? Date.now)(), highestAcceptedVersion);
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
    return [ ...merged.values() ].slice(0, MAX_RULE_PACKAGES);
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
        for (let index = 0; index < MAX_RULE_PACKAGES; index += 1) {
          const response = await this.options.transport.send({
            url: `${this.baseUrl}${RULE_SYNC_PATH}`,
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
          const parsed = RuleSyncResponseSchema.parse(JSON.parse(response.body));
          if (parsed.code !== AiAskCode.Ok) throw new Error(`rule sync rejected: ${parsed.code}`);
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
    return [ new GmRuleStorePersistence(storage).key, new GmRuleKeysetPersistence(storage).key, new GmRuleReleaseContextPersistence(storage).key, RULE_UPDATE_LAST_CHECK_KEY, KEYSET_WATERMARKS_KEY, HIGHEST_KEYSET_VERSION_KEY ];
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
        store: new RuleStore,
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
          store: new RuleStore,
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

  const CHA0XING_PACKAGE_HOOKS = Object.freeze({
    [CHA0XING_PACKAGE_IDS.examStudent]: Object.freeze([ "registerExamQuestion", "prepareExamPlan", "commitExamPlan" ]),
    [CHA0XING_PACKAGE_IDS.dowork]: Object.freeze([ "commitDoworkPlan" ]),
    [CHA0XING_PACKAGE_IDS.studentstudy]: Object.freeze([ "commitStudentstudyPlan" ]),
    [CHA0XING_PACKAGE_IDS.oldHomework]: Object.freeze([ "commitOldHomeworkPlan" ]),
    [CHA0XING_PACKAGE_IDS.oldChapter]: Object.freeze([ "commitOldChapterPlan" ]),
    [CHA0XING_PACKAGE_IDS.newChapter]: Object.freeze([ "commitNewChapterPlan" ])
  });

  function authorizesRollback(summaries, authorization, pkg) {
    return summaries.some(summary => {
      var _a2;
      return summary.packageId === pkg.packageId && summary.version === pkg.version && summary.releaseSequence === pkg.releaseSequence && summary.contentHash === pkg.contentHash && ((_a2 = summary.rollbackAuthorization) == null ? void 0 : _a2.toVersion) === authorization.toVersion && summary.rollbackAuthorization.authorizationId === authorization.authorizationId;
    });
  }

  function baseRegistry(options, policy) {
    const refs = new RuntimeReferenceRegistry({
      maxDomRefs: policy.limits.maxDomRefs
    });
    const capture2 = new RuleCaptureRegistry({
      maxTrees: 256,
      maxBindings: policy.limits.maxDomRefs
    });
    const registry = new PrimitiveRegistry;
    registerCoreRulePrimitives(registry, {
      document: options.document,
      location: options.location,
      refs: refs,
      capture: capture2,
      writer: new BindingRegistryAnswerWriter(capture2.bindings),
      resources: new RuleResourceScope
    });
    return {
      registry: registry,
      refs: refs
    };
  }

  function platformContext(pkg, options) {
    if (pkg.platform === "chaoxing") {
      const {registry: registry, refs: refs} = baseRegistry(options, CHA0XING_RULE_POLICY);
      const hooks = CHA0XING_PACKAGE_HOOKS[pkg.packageId] ?? [];
      const on = name => hooks.includes(name);
      registerChaoxingRuleHooks(registry, {
        typr: options.typr,
        table: options.fontTable ?? {},
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
        } : {},
        ...on("commitDoworkPlan") ? {
          commitDoworkPlan: () => false
        } : {},
        ...on("commitStudentstudyPlan") ? {
          commitStudentstudyPlan: () => false
        } : {},
        ...on("commitOldHomeworkPlan") ? {
          commitOldHomeworkPlan: () => false
        } : {},
        ...on("commitOldChapterPlan") ? {
          commitOldChapterPlan: () => false
        } : {},
        ...on("commitNewChapterPlan") ? {
          commitNewChapterPlan: () => false
        } : {}
      });
      return {
        registry: registry,
        policy: CHA0XING_RULE_POLICY
      };
    }
    const trustedRemote = trustedRemoteRulePlatformByPackageId(pkg.packageId);
    if ((trustedRemote == null ? void 0 : trustedRemote.platform) === pkg.platform) {
      const {registry: registry} = baseRegistry(options, trustedRemote.policy);
      if (pkg.platform === "aopeng") registerAopengRuleHooks(registry, {
        readCapturedResponse: () => null
      });
      return {
        registry: registry,
        policy: trustedRemote.policy
      };
    }
    throw new RuleVerificationError("capability_denied", `unsupported rule platform: ${pkg.platform}`);
  }

  function createUserscriptRuleVerifier(options) {
    return {
      verify: async input => {
        var _a2;
        const pkg = RulePackageSchema.parse(input);
        const {registry: registry, policy: policy} = platformContext(pkg, options);
        const current = (_a2 = options.store.resolve(pkg.packageId)) == null ? void 0 : _a2.pkg;
        return new RuleVerifier({
          engineVersion: RULE_ENGINE_VERSION,
          keyset: options.keyset,
          registry: registry,
          policy: policy,
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
          question: questionTextForSearch(unit.effectiveStem)
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
    var _a2;
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
    const factories = o.adapterFactories ?? createDefaultAdapterFactories(o.location, o.typr, ruleStore, o.fontTable ?? {});
    const candidates = factories.map(factory => ({
      factory: factory,
      adapter: factory()
    }));
    const adapter = new RuleRuntime(candidates.map(candidate => candidate.adapter)).resolve(ctx);
    const selected2 = candidates.find(candidate => candidate.adapter === adapter);
    if (!adapter || !selected2) return {
      session: null,
      reason: "unsupported"
    };
    const client = new RelayClient(o.backendTransport, o.baseUrl);
    const freeFirst = o.settings.freeFirst !== false;
    const sessionDeps = {
      ...o.sessionDeps,
      freeSearch: req => freeBankSearch(o.transport, req),
      canPaidSearch: () => !!o.getToken(),
      localStore: ((_a2 = o.sessionDeps) == null ? void 0 : _a2.localStore) ?? o.localStore
    };
    const session = new AnswerSession(adapter, client, {
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
        return parseQuestionContent(props.content).map(part => ({
          ...part,
          generation: renderedGeneration
        }));
      });
      const failed2 = vue.ref(new Set);
      vue.watch(() => props.content, () => {
        generation.value++;
        failed2.value = new Set;
      });
      const markFailed = (index, renderedGeneration) => {
        if (renderedGeneration !== generation.value) return;
        failed2.value = new Set(failed2.value).add(index);
      };
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("span", _hoisted_1$1, [ (vue.openBlock(true), 
      vue.createElementBlock(vue.Fragment, null, vue.renderList(parts.value, (part, index) => (vue.openBlock(), 
      vue.createElementBlock(vue.Fragment, {
        key: `${index}:${part.value}`
      }, [ part.type === "text" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2$1, vue.toDisplayString(part.value), 1)) : failed2.value.has(index) ? (vue.openBlock(), 
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
    var _a2;
    const position2 = (_a2 = progress == null ? void 0 : progress.task) == null ? void 0 : _a2.position;
    if (!position2) return null;
    return position2.totalSeconds === null ? formatClock(position2.currentSeconds) : `${formatClock(position2.currentSeconds)} / ${formatClock(position2.totalSeconds)}`;
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
    const position2 = clampPanelPosition({
      x: input.clientX - state.offsetX,
      y: input.clientY - state.offsetY
    }, state.panel, viewport);
    if (position2.x !== state.origin.x || position2.y !== state.origin.y) {
      state.moved = true;
    }
    return position2;
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
    [QuestionType.Single]: "\u5355\u9009\u9898",
    [QuestionType.Multiple]: "\u591a\u9009\u9898",
    [QuestionType.Judge]: "\u5224\u65ad\u9898",
    [QuestionType.Fill]: "\u586b\u7a7a\u9898"
  };

  const harvestTypeLabel = itemType => {
    const normalized = normalizeLeafQuestionType(itemType);
    if (!normalized) return (itemType == null ? void 0 : itemType.trim()) || "\u9898\u76ee";
    return normalized === "short_answer" ? "\u7b80\u7b54\u9898" : TYPE_LABELS[normalized];
  };

  const esc = value => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const contentHtml = content => parseQuestionContent(content).map(part => part.type === "image" ? `<img src="${esc(part.value)}" alt="\u9898\u76ee\u56fe\u7247" referrerpolicy="no-referrer">` : esc(part.value)).join("");

  const letter = index => String.fromCharCode(65 + index);

  const typeLabel = it => {
    var _a2;
    return ((_a2 = it.unit) == null ? void 0 : _a2.queryType) === "short_answer" ? "\u7b80\u7b54\u9898" : TYPE_LABELS[it.q.type];
  };

  function buildPageExportHtml(items, meta) {
    const sections = items.map((it, inx) => {
      if (it.status === "decodeFail" || it.status === "unsupported") {
        const reason = it.status === "decodeFail" ? "\u9898\u9762\u89e3\u6790\u5931\u8d25\uff0c\u5df2\u8df3\u8fc7" : "\u9898\u76ee\u65e0\u5408\u6cd5\u6587\u5b57\u6216\u56fe\u7247\uff0c\u5df2\u8df3\u8fc7";
        return `<section class="q"><h3>\u7b2c ${inx + 1} \u9898</h3><p class="mute">\uff08${reason}\uff09</p></section>`;
      }
      const matched = it.unit ? new Set(answeredOptionIndexes(it.unit, it.answerPlan)) : new Set;
      const opts = it.q.options.map((option, i) => `<li${matched.has(i) ? ' class="hit"' : ""}>${letter(i)}. ${contentHtml(option)}</li>`).join("");
      const answer = it.answer.length ? `${it.answer.map(contentHtml).join("\uff1b")}${it.aiGenerated ? ' <span class="mute">\uff08AI \u751f\u6210 \xb7 \u5f85\u6838\u5bf9\uff09</span>' : ""}` : '<span class="mute">\u672a\u547d\u4e2d</span>';
      return `<section class="q">\n<h3>\u7b2c ${inx + 1} \u9898 <small>[${typeLabel(it)}]</small></h3>\n<p class="stem">${contentHtml(it.q.stem)}</p>\n${opts ? `<ol class="opts">${opts}</ol>` : ""}\n<p class="ans">\u53c2\u8003\u7b54\u6848\uff1a${answer}</p>\n</section>`;
    }).join("\n");
    return pageShell("\u672c\u9875\u9898\u76ee\u4e0e\u53c2\u8003\u7b54\u6848", meta, sections);
  }

  const harvestHitIndexes = it => {
    const wanted = it.values.map(normalizeForMatch).filter(v => v !== "");
    const wantedTruth = it.values.map(normalizeTruth);
    return new Set((it.options ?? []).flatMap((option, i) => {
      const truth = normalizeTruth(option);
      return wanted.includes(normalizeForMatch(option)) || truth !== null && wantedTruth.includes(truth) ? [ i ] : [];
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
    class: "prow"
  };

  const _hoisted_55 = {
    class: "prow"
  };

  const _hoisted_56 = {
    key: 0,
    class: "prow"
  };

  const _hoisted_57 = {
    key: 1,
    class: "prow"
  };

  const _hoisted_58 = {
    key: 2,
    class: "prow"
  };

  const _hoisted_59 = {
    key: 3,
    class: "prow"
  };

  const _hoisted_60 = {
    class: "cap-mute"
  };

  const _hoisted_61 = {
    class: "grp"
  };

  const _hoisted_62 = {
    key: 0,
    class: "cap-mute"
  };

  const _hoisted_63 = {
    key: 1,
    class: "row"
  };

  const _hoisted_64 = {
    class: "tag acc"
  };

  const _hoisted_65 = {
    key: 2,
    class: "cap-mute"
  };

  const _hoisted_66 = {
    key: 2,
    class: "grp"
  };

  const _hoisted_67 = {
    class: "grid"
  };

  const _hoisted_68 = [ "onClick" ];

  const _hoisted_69 = {
    key: 3,
    class: "card"
  };

  const _hoisted_70 = {
    class: "row"
  };

  const _hoisted_71 = {
    class: "locator"
  };

  const _hoisted_72 = {
    class: "row"
  };

  const _hoisted_73 = {
    class: "locator"
  };

  const _hoisted_74 = {
    class: "row question-head"
  };

  const _hoisted_75 = {
    class: "locator"
  };

  const _hoisted_76 = {
    class: "toolbar"
  };

  const _hoisted_77 = {
    key: 0,
    class: "tag neutral"
  };

  const _hoisted_78 = [ "disabled" ];

  const _hoisted_79 = {
    class: "stem"
  };

  const _hoisted_80 = {
    class: "stem-type"
  };

  const _hoisted_81 = {
    class: "opts"
  };

  const _hoisted_82 = {
    class: "answer-block"
  };

  const _hoisted_83 = {
    class: "row"
  };

  const _hoisted_84 = {
    class: "toolbar"
  };

  const _hoisted_85 = {
    key: 0,
    class: "tag neutral"
  };

  const _hoisted_86 = {
    key: 1,
    class: "tag neutral"
  };

  const _hoisted_87 = {
    key: 0,
    class: "answer-list"
  };

  const _hoisted_88 = {
    class: "answer-key"
  };

  const _hoisted_89 = {
    class: "answer-value"
  };

  const _hoisted_90 = {
    key: 0
  };

  const _hoisted_91 = {
    key: 1,
    class: "answer-item"
  };

  const _hoisted_92 = {
    class: "answer-value"
  };

  const _hoisted_93 = {
    key: 2,
    class: "answer-value"
  };

  const _hoisted_94 = {
    key: 0
  };

  const _hoisted_95 = {
    key: 3,
    class: "cap-mute"
  };

  const _hoisted_96 = {
    class: "grp"
  };

  const _hoisted_97 = {
    class: "row"
  };

  const _hoisted_98 = {
    class: "toolbar"
  };

  const _hoisted_99 = {
    class: "tag acc"
  };

  const _hoisted_100 = {
    class: "ent-top"
  };

  const _hoisted_101 = {
    class: "ent-ty"
  };

  const _hoisted_102 = {
    class: "ent-tm mono"
  };

  const _hoisted_103 = {
    key: 0,
    class: "cap-mute"
  };

  const _hoisted_104 = {
    class: "ent-a"
  };

  const _hoisted_105 = {
    key: 0,
    class: "ent-ops"
  };

  const _hoisted_106 = {
    class: "cap-mute"
  };

  const _hoisted_107 = {
    class: "standby"
  };

  const _hoisted_108 = {
    class: "cap-mute"
  };

  const _hoisted_109 = {
    key: 0,
    class: "grp"
  };

  const _hoisted_110 = {
    class: "row"
  };

  const _hoisted_111 = {
    class: "mono cap-mute"
  };

  const _hoisted_112 = {
    class: "switch-row"
  };

  const _hoisted_113 = [ "onClick", "aria-label" ];

  const _hoisted_114 = {
    class: "lbl",
    style: {
      flex: "1"
    }
  };

  const _hoisted_115 = {
    class: "cap-mute"
  };

  const _hoisted_116 = {
    class: "row"
  };

  const _hoisted_117 = {
    class: "mono cap-mute"
  };

  const _hoisted_118 = {
    class: "grp"
  };

  const _hoisted_119 = {
    class: "switch-row"
  };

  const _hoisted_120 = {
    class: "grp"
  };

  const _hoisted_121 = {
    class: "row"
  };

  const _hoisted_122 = {
    class: "cap-mute"
  };

  const _hoisted_123 = {
    key: 0,
    class: "alert"
  };

  const _hoisted_124 = {
    key: 1,
    class: "alert"
  };

  const _hoisted_125 = {
    class: "row"
  };

  const _hoisted_126 = [ "disabled" ];

  const _hoisted_127 = {
    key: 2,
    class: "cap-mute"
  };

  const _hoisted_128 = {
    class: "grp"
  };

  const _hoisted_129 = {
    class: "switch-row"
  };

  const _hoisted_130 = {
    class: "row"
  };

  const _hoisted_131 = {
    class: "mono cap-mute"
  };

  const _hoisted_132 = {
    class: "row"
  };

  const _hoisted_133 = {
    class: "cap-mute"
  };

  const _hoisted_134 = {
    class: "grp"
  };

  const _hoisted_135 = [ "onClick", "aria-label" ];

  const _hoisted_136 = {
    class: "lbl",
    style: {
      flex: "1"
    }
  };

  const _hoisted_137 = {
    class: "prev"
  };

  const _hoisted_138 = {
    class: "prow"
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
    key: 0,
    class: "alert"
  };

  const _hoisted_143 = {
    class: "prev"
  };

  const _hoisted_144 = {
    class: "prow"
  };

  const _hoisted_145 = {
    class: "toolbar"
  };

  const _hoisted_146 = {
    class: "cap-mute mono"
  };

  const _hoisted_147 = {
    class: "meter"
  };

  const _hoisted_148 = {
    key: 0,
    class: "alert"
  };

  const _hoisted_149 = {
    key: 1,
    class: "alert"
  };

  const _hoisted_150 = {
    key: 2,
    class: "cap-mute"
  };

  const _hoisted_151 = {
    key: 0,
    class: "alert"
  };

  const _hoisted_152 = {
    key: 1,
    class: "cap-mute"
  };

  const _hoisted_153 = {
    key: 4,
    class: "cap-mute"
  };

  const _hoisted_154 = {
    key: 5,
    class: "cap-mute"
  };

  const _hoisted_155 = {
    class: "ent-top"
  };

  const _hoisted_156 = {
    class: "ent-ty"
  };

  const _hoisted_157 = {
    key: 0,
    class: "ent-ty"
  };

  const _hoisted_158 = {
    key: 1,
    class: "ent-ty"
  };

  const _hoisted_159 = {
    class: "ent-tm"
  };

  const _hoisted_160 = [ "aria-label", "onClick" ];

  const _hoisted_161 = {
    class: "ent-a"
  };

  const _hoisted_162 = {
    key: 0,
    class: "ent-ops"
  };

  const _hoisted_163 = {
    class: "cap-mute"
  };

  const _hoisted_164 = {
    key: 6,
    class: "cap-mute"
  };

  const _hoisted_165 = {
    class: "statcard"
  };

  const _hoisted_166 = {
    class: "row"
  };

  const _hoisted_167 = {
    key: 0,
    class: "statgrid"
  };

  const _hoisted_168 = {
    key: 0
  };

  const _hoisted_169 = {
    key: 1
  };

  const _hoisted_170 = {
    key: 1,
    class: "cap-mute"
  };

  const _hoisted_171 = {
    key: 2,
    class: "alert"
  };

  const _hoisted_172 = {
    class: "grp"
  };

  const _hoisted_173 = {
    class: "log-filter"
  };

  const _hoisted_174 = [ "onClick" ];

  const _hoisted_175 = {
    key: 0,
    class: "log-list"
  };

  const _hoisted_176 = {
    class: "log-time mono"
  };

  const _hoisted_177 = {
    class: "log-msg"
  };

  const _hoisted_178 = {
    key: 0,
    class: "log-repeat mono"
  };

  const _hoisted_179 = {
    key: 1,
    class: "cap-mute"
  };

  const _hoisted_180 = {
    class: "grp"
  };

  const _hoisted_181 = [ "disabled" ];

  const _hoisted_182 = {
    key: 0,
    class: "cap-mute"
  };

  const _hoisted_183 = {
    key: 1,
    class: "cap-mute"
  };

  const _hoisted_184 = {
    key: 1,
    class: "rule-meta"
  };

  const _hoisted_185 = {
    class: "rule-row"
  };

  const _hoisted_186 = {
    class: "rule-value"
  };

  const _hoisted_187 = {
    key: 0,
    class: "rule-row"
  };

  const _hoisted_188 = {
    class: "rule-value"
  };

  const _hoisted_189 = {
    key: 1,
    class: "rule-row"
  };

  const _hoisted_190 = {
    class: "rule-value"
  };

  const _hoisted_191 = {
    key: 2,
    class: "rule-row"
  };

  const _hoisted_192 = {
    class: "rule-value"
  };

  const _hoisted_193 = {
    key: 2,
    class: "cap-mute"
  };

  const _hoisted_194 = {
    class: "actbar"
  };

  const _hoisted_195 = {
    key: 0,
    class: "prev"
  };

  const _hoisted_196 = {
    class: "prow"
  };

  const _hoisted_197 = {
    class: "prow"
  };

  const _hoisted_198 = [ "disabled" ];

  const _hoisted_199 = [ "disabled" ];

  const _hoisted_200 = {
    key: 0,
    class: "prog"
  };

  const _hoisted_201 = {
    class: "stat"
  };

  const _hoisted_202 = {
    class: "ticks"
  };

  const _hoisted_203 = {
    key: 1,
    class: "toolbar"
  };

  const _hoisted_204 = [ "disabled" ];

  const _hoisted_205 = {
    key: 0,
    class: "toolbar"
  };

  const _hoisted_206 = {
    key: 1,
    class: "toolbar"
  };

  const _hoisted_207 = {
    key: 2,
    class: "toolbar"
  };

  const _hoisted_208 = [ "disabled" ];

  const _hoisted_209 = {
    class: "actbar-foot"
  };

  const _hoisted_210 = {
    class: "cap-mute mono"
  };

  const _hoisted_211 = {
    key: 4,
    class: "pop"
  };

  const _hoisted_212 = {
    class: "toolbar"
  };

  const _hoisted_213 = [ "disabled" ];

  const _hoisted_214 = [ "disabled" ];

  const _hoisted_215 = {
    key: 0,
    class: "cap-mute"
  };

  const _hoisted_216 = {
    class: "home-user"
  };

  const _hoisted_217 = {
    class: "ava lg"
  };

  const _hoisted_218 = {
    class: "home-meta"
  };

  const _hoisted_219 = {
    class: "ctitle"
  };

  const _hoisted_220 = {
    key: 0,
    class: "cap-mute"
  };

  const _hoisted_221 = [ "disabled" ];

  const _hoisted_222 = {
    key: 0,
    class: "cap-mute"
  };

  const _hoisted_223 = {
    class: "row"
  };

  const _hoisted_224 = {
    key: 0,
    class: "toolbar"
  };

  const _hoisted_225 = {
    class: "balance"
  };

  const _hoisted_226 = {
    key: 1,
    class: "cap-mute"
  };

  const _hoisted_227 = {
    key: 1,
    class: "cap-mute"
  };

  const _hoisted_228 = {
    class: "toolbar"
  };

  const _hoisted_229 = [ "disabled" ];

  const _hoisted_230 = {
    key: 2,
    class: "cap-mute"
  };

  const _hoisted_231 = {
    class: "row sep-top"
  };

  const _hoisted_232 = {
    class: "cap-mute"
  };

  const _hoisted_233 = {
    key: 5,
    class: "captcha-cover",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "\u5b8c\u6210\u6ce8\u518c\u4eba\u673a\u9a8c\u8bc1"
  };

  const _hoisted_234 = {
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
      var _a2;
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
        var _a3;
        if (collapsed.value === nextCollapsed) return;
        const rect = (_a3 = panelRef.value) == null ? void 0 : _a3.getBoundingClientRect();
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
        var _a3;
        const result = endPanelDrag(dragState, event.pointerId);
        const handle = event.currentTarget instanceof HTMLElement ? event.currentTarget : dragHandleRef.value;
        if ((_a3 = handle == null ? void 0 : handle.hasPointerCapture) == null ? void 0 : _a3.call(handle, event.pointerId)) {
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
        var _a3;
        const iso = (_a3 = announcement.value) == null ? void 0 : _a3.updatedAt;
        return iso ? new Date(iso).toLocaleString("zh-CN", {
          dateStyle: "short",
          timeStyle: "short"
        }) : "";
      });
      const dismissAnnouncement = () => {
        var _a3;
        const seq = (_a3 = announcement.value) == null ? void 0 : _a3.seq;
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
        [QuestionType.Single]: "\u5355\u9009",
        [QuestionType.Multiple]: "\u591a\u9009",
        [QuestionType.Judge]: "\u5224\u65ad",
        [QuestionType.Fill]: "\u586b\u7a7a"
      };
      const accountName = vue.ref(getUsername());
      const username = vue.ref("");
      const password = vue.ref("");
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
        captchaState.value = crypto.randomUUID();
        captchaOpen.value = true;
        return new Promise((resolve, reject) => {
          captchaPending = {
            resolve: resolve,
            reject: reject
          };
        });
      }
      function onCaptchaFrameLoad() {
        var _a3;
        if (captchaRequest || !captchaPending || !captchaState.value) return;
        const frameWindow = (_a3 = captchaFrame.value) == null ? void 0 : _a3.contentWindow;
        if (!frameWindow) {
          finishCaptcha(new Error("challenge-unavailable"));
          return;
        }
        captchaRequest = createCaptchaFrameRequest({
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
          accountName.value = username.value.trim();
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
      async function devAutoLogin() {
        return;
      }
      const markAuthStale = () => {
        authStale.value = true;
        if (!username.value) username.value = accountName.value;
      };
      const logout = () => {
        clearToken();
        clearLastBalance();
        balance.value = null;
        loggedIn.value = false;
        authStale.value = false;
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
        const snapshot2 = await fetchMe(aiaskTransport, BACKEND_BASE_URL);
        if (!snapshot2) return;
        balance.value = snapshot2.balance;
        setLastBalance(snapshot2.balance);
        accountName.value = snapshot2.username;
        emailBound.value = snapshot2.emailBound;
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
        var _a3, _b;
        return ((_b = (_a3 = courseProgress2.value) == null ? void 0 : _a3.section) == null ? void 0 : _b.skipped) ?? [];
      });
      const legacyCourseUrl = legacyStudentstudyUpgradeUrl(location);
      const onCourseStudyPage = isNewCourseStudyUrl(location);
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
        if (!settings.courseAuto || !hasFeature("course-automation") || !onCourseStudyPage || !courseAdapter) {
          mediaRunner == null ? void 0 : mediaRunner.stop();
          mediaRunner = null;
          mediaState.value = null;
          courseProgress2.value = null;
          pauseCourseMedia(document);
          return;
        }
        if (mediaRunner) return;
        syncCourseConfig();
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
            if (isRunnerStopped(state)) courseProgress2.value = null;
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
        const failed2 = localAnswerCache.hasPersistFailure();
        if (failed2 && !cachePersistFailed.value) pushLog("\u672c\u5730\u7f13\u5b58\u5199\u5165\u5931\u8d25 \xb7 \u6700\u8fd1\u7684\u6536\u5f55\u53ef\u80fd\u6ca1\u6709\u843d\u76d8", "warning");
        cachePersistFailed.value = failed2;
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
      const PARSE_IMPORT_URL = `${IMPORT_BRIDGE_ORIGIN}${IMPORT_BRIDGE_PATHNAME}`;
      const pickImportFile = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        input.onchange = async () => {
          var _a3;
          const file = (_a3 = input.files) == null ? void 0 : _a3[0];
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
        const payload = {
          exportedAt: (new Date).toISOString(),
          version: SCRIPT_VERSION,
          rule: ruleDiag.value ?? null,
          ruleCaptureFailure: lastCaptureFailure.value,
          fontTable: chaoxingFontTableStatus(),
          aopengCapture: aopengCaptureStatus(document),
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
      const diag = vue.ref(null);
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
      const platform = vue.ref(((_a2 = trustedRemoteRulePlatformFor(location.hostname)) == null ? void 0 : _a2.platform) ?? "chaoxing");
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
      let stopPageChanges = null;
      let stopDomChanges = null;
      let stopUrlChanges = null;
      let pageChangeScheduler = null;
      function currentReportIdentity() {
        const rule = ruleDiag.value;
        if (!rule) return null;
        return buildReportIdentity(platform.value, getClientId(), SCRIPT_VERSION, RULE_ENGINE_VERSION, rule);
      }
      function refreshRuleDiagnostic() {
        var _a3;
        const loadStatus = (_a3 = ruleDiag.value) == null ? void 0 : _a3.loadStatus;
        if (!adapter || !loadStatus) return;
        ruleDiag.value = buildRuleSessionDiagnostic(adapter, loadStatus, ruleStoreRuntime.snapshot().releaseSummaries);
        syncCourseConfig();
      }
      let courseConfigSource = null;
      function syncCourseConfig() {
        var _a3, _b, _c;
        const remote = (_b = (_a3 = resolvedRulePackage(adapter)) == null ? void 0 : _a3.shellConfig) == null ? void 0 : _b.selectors;
        const source = remote ? ((_c = ruleDiag.value) == null ? void 0 : _c.version) ?? "remote" : "built-in";
        if (source === courseConfigSource) return;
        courseConfigSource = source;
        applyCourseConfig(remote);
        pushLog(remote ? `\u8bfe\u7a0b\u5224\u636e\u6765\u81ea\u89c4\u5219\u5305 ${source} \xb7 ${Object.keys(remote).length} \u9879` : ruleStoreRuntime.usablePackageIds().length === 0 ? "\u8bfe\u7a0b\u5224\u636e\u7528\u5185\u7f6e\u9ed8\u8ba4\u503c \xb7 \u672c\u5730\u6ca1\u6709\u53ef\u7528\u89c4\u5219\u5305" : "\u8bfe\u7a0b\u5224\u636e\u7528\u5185\u7f6e\u9ed8\u8ba4\u503c \xb7 \u672c\u9875\u65e0\u5bf9\u5e94\u89c4\u5219", "info");
      }
      function examSessionStorage() {
        var _a3;
        try {
          return ((_a3 = document.defaultView) == null ? void 0 : _a3.sessionStorage) ?? null;
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
        var _a3;
        if (!cur.value) return "";
        if (((_a3 = cur.value.unit) == null ? void 0 : _a3.queryType) === "short_answer") return "\u7b80\u7b54";
        return QUESTION_TYPE_LABELS[cur.value.q.type];
      });
      const matchedOptionIndexes = vue.computed(() => {
        const current = cur.value;
        if (!(current == null ? void 0 : current.unit)) return new Set;
        return new Set(answeredOptionIndexes(current.unit, current.answerPlan));
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
        var _a3;
        const discarded = loaded || list.value.length > 0;
        pageChangeScheduler == null ? void 0 : pageChangeScheduler.cancel();
        stopPageChanges == null ? void 0 : stopPageChanges();
        stopPageChanges = null;
        void ((_a3 = adapter == null ? void 0 : adapter.dispose) == null ? void 0 : _a3.call(adapter));
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
              const signature2 = harvestedList.value.map(item => item.unitHash).join();
              harvestSettledAt = harvestedList.value.length > 0 ? Date.now() : 0;
              if (harvest && harvest.persisted > 0 && signature2 !== harvestSignature) pushLog(cachePersistFailed.value ? `\u672c\u9875\u6536\u5f55 ${harvest.persisted} \u9898 \xb7 \u672a\u80fd\u843d\u76d8\uff0c\u5173\u6389\u9875\u9762\u4f1a\u4e22` : `\u672c\u9875\u6536\u5f55 ${harvest.persisted} \u9898 \xb7 \u5df2\u5b58\u5165\u672c\u5730\u7f13\u5b58`, cachePersistFailed.value ? "warning" : "info");
              harvestSignature = signature2;
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
        if (running.value) return;
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
          discard();
          void detectQuestions();
        });
        const fontStatus = chaoxingFontTableStatus();
        if (fontStatus !== "ok") pushLog(fontStatus === "unavailable" ? "\u5b57\u4f53\u8868\u672a\u4e0b\u8f7d \xb7 \u5e26\u52a0\u5bc6\u5b57\u4f53\u7684\u9898\u76ee\u65e0\u6cd5\u8bc6\u522b \xb7 \u8bf7\u91cd\u88c5\u811a\u672c\u4ee5\u91cd\u65b0\u4e0b\u8f7d\u8d44\u6e90" : "\u5b57\u4f53\u8868\u5185\u5bb9\u6821\u9a8c\u672a\u901a\u8fc7 \xb7 \u5df2\u5b89\u5168\u62d2\u7528 \xb7 \u5e26\u52a0\u5bc6\u5b57\u4f53\u7684\u9898\u76ee\u65e0\u6cd5\u8bc6\u522b", "warning");
        const capture2 = aopengCaptureStatus(document);
        if (capture2 && !capture2.installed) pushLog("\u63a5\u53e3\u65c1\u542c\u672a\u88c5\u4e0a \xb7 \u672c\u9875\u53ea\u80fd\u9760\u9875\u9762 DOM \u6536\u5f55", "warning");
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
        var _a3;
        if (captchaRequest) captchaRequest.cancel(); else if (captchaPending) finishCaptcha(new Error("cancelled"));
        stopFrameReady == null ? void 0 : stopFrameReady();
        stopFrameReady = null;
        stopRuleStoreUpdates == null ? void 0 : stopRuleStoreUpdates();
        stopRuleStoreUpdates = null;
        stopRuleStoreRestored == null ? void 0 : stopRuleStoreRestored();
        stopRuleStoreRestored = null;
        stopPageChanges == null ? void 0 : stopPageChanges();
        stopPageChanges = null;
        stopDomChanges == null ? void 0 : stopDomChanges();
        stopDomChanges = null;
        stopUrlChanges == null ? void 0 : stopUrlChanges();
        stopUrlChanges = null;
        pageChangeScheduler == null ? void 0 : pageChangeScheduler.dispose();
        pageChangeScheduler = null;
        mediaRunner == null ? void 0 : mediaRunner.stop();
        mediaRunner = null;
        void ((_a3 = adapter == null ? void 0 : adapter.dispose) == null ? void 0 : _a3.call(adapter));
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
              var _a3;
              let where = "?";
              try {
                where = ((_a3 = d.location) == null ? void 0 : _a3.pathname) ?? "?";
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
          pushLog(tip.value, e.total === 0 ? "warning" : "info");
          void finishRound();
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
        var _a3;
        const expected = ((_a3 = trustedRemoteRulePlatformFor(location.hostname)) == null ? void 0 : _a3.packageId) ?? validatedRulePackageIdFor(location);
        if (expected) return ruleStoreRuntime.snapshot().store.resolve(expected) === null ? {
          packageId: expected,
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
        var _a3;
        const first = html.split("\n", 1)[0] ?? "";
        const nonce = (_a3 = /^<!-- aiask-frame#([0-9a-f]{8}): /u.exec(first)) == null ? void 0 : _a3[1];
        if (!nonce) return 0;
        const prefix = `\x3c!-- aiask-omitted#${nonce}: `;
        let count2 = 0;
        for (const line of html.split("\n")) if (line.startsWith(prefix)) count2 += 1;
        return count2;
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
      function settleEvidenceRequest(requestId2) {
        var _a3;
        handledEvidenceRequests.add(requestId2);
        if (((_a3 = evidenceRequest.value) == null ? void 0 : _a3.requestId) === requestId2) evidenceRequest.value = null;
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
        if (code === AiAskCode.RateLimited) {
          if (reason === "ticket") return "\u4e0a\u4f20\u5931\u8d25 \xb7 \u5f00\u53d1\u8005\u70b9\u7684\u8fd9\u4e00\u9875\u5df2\u7ecf\u6536\u591f\u4e86\uff0c\u4e0d\u7528\u518d\u4f20\u3002";
          if (reason === "ip") return "\u4e0a\u4f20\u5931\u8d25 \xb7 \u8fd9\u4e2a\u7f51\u7edc\u4eca\u5929\u4f20\u5f97\u592a\u591a\u4e86\uff0c\u660e\u5929\u518d\u8bd5\u3002";
          return "\u4e0a\u4f20\u5931\u8d25 \xb7 \u4eca\u5929\u4f20\u5f97\u592a\u591a\u4e86\uff0c\u660e\u5929\u518d\u8bd5\u3002";
        }
        if (code === AiAskCode.Invalid) return "\u4e0a\u4f20\u5931\u8d25 \xb7 \u670d\u52a1\u7aef\u6ca1\u6536\u4e0b\u8fd9\u4efd\u8bc1\u636e\u3002";
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
            url: BACKEND_BASE_URL + EVIDENCE_PATH,
            headers: {
              "Content-Type": "application/json",
              "Idempotency-Key": crypto.randomUUID()
            },
            body: JSON.stringify(bundle),
            timeoutMs: 2e4
          });
          const parsed = EvidenceResponseSchema.safeParse(JSON.parse(res.body));
          const data = parsed.success ? parsed.data : void 0;
          const code = data == null ? void 0 : data.code;
          if (code !== AiAskCode.Ok) {
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
        var _a3;
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
        stopPageChanges = ((_a3 = adapter.subscribePageChanges) == null ? void 0 : _a3.call(adapter, () => {
          pageChangeScheduler == null ? void 0 : pageChangeScheduler.notify();
        })) ?? null;
        createAdapter = r.createAdapter;
        ruleDiag.value = r.rule;
        platform.value = r.platform;
        localAnswerCache.setPlatform(platformLabel.value);
        syncCourseConfig();
        return true;
      }
      async function runDiag() {
        var _a3, _b;
        if (!build() || !ctx || !createAdapter) return;
        const diagnosticAdapter = createAdapter();
        let reportIdentity = currentReportIdentity();
        try {
          diag.value = await runDiagnostic(diagnosticAdapter, ctx);
          lastCaptureFailure.value = ruleCaptureFailure(diagnosticAdapter);
          const loadStatus = (_a3 = ruleDiag.value) == null ? void 0 : _a3.loadStatus;
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
        var _a3;
        if (running.value || ruleUpdating.value) return;
        ruleUpdating.value = true;
        ruleUpdateNote.value = "\u68c0\u67e5\u4e2d\u2026";
        const result = await checkRuleUpdates(true);
        refreshRuleDiagnostic();
        ruleUpdating.value = false;
        const usable = ruleStoreRuntime.usablePackageIds().length;
        ruleUpdateNote.value = ((_a3 = ruleUpdateReadout(result, usable)) == null ? void 0 : _a3.note) ?? "";
      }
      async function start() {
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
        var _a3;
        curInx.value = i;
        const el = (_a3 = list.value[i]) == null ? void 0 : _a3.q.el;
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
        var _a3;
        if (!segs.some(seg => seg.k === systemSub.value)) systemSub.value = ((_a3 = segs[0]) == null ? void 0 : _a3.k) ?? "general";
      });
      return (_ctx, _cache) => {
        var _a3, _b;
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
        }, [ _cache[29] || (_cache[29] = vue.createElementVNode("span", {
          class: "seal s44"
        }, "\u95ee", -1)), detectedCount.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2, vue.toDisplayString(detectedCount.value), 1)) : vue.createCommentVNode("", true) ]) ], 36)) : (vue.openBlock(), 
        vue.createElementBlock("div", {
          key: 1,
          ref_key: "panelRef",
          ref: panelRef,
          class: "panel",
          style: vue.normalizeStyle(panelStyle.value)
        }, [ (vue.openBlock(), vue.createElementBlock("svg", _hoisted_3, [ ..._cache[30] || (_cache[30] = [ vue.createStaticVNode('<symbol id="i-chevron" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></symbol><symbol id="i-minus" viewBox="0 0 24 24"><path d="M6 12h12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path></symbol><symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h13M13 7l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></symbol>', 3) ]) ])), vue.createElementVNode("div", {
          ref_key: "dragHandleRef",
          ref: dragHandleRef,
          class: "head",
          onPointerdown: startDrag,
          onPointermove: moveDrag,
          onPointerup: finishDrag,
          onPointercancel: finishDrag,
          onLostpointercapture: finishDrag
        }, [ _cache[33] || (_cache[33] = vue.createElementVNode("span", {
          class: "seal s22"
        }, "\u95ee", -1)), _cache[34] || (_cache[34] = vue.createElementVNode("span", {
          class: "name"
        }, "\u7231\u95ee\u7b54", -1)), _cache[35] || (_cache[35] = vue.createElementVNode("span", {
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
        vue.createElementBlock("svg", _hoisted_5, [ ..._cache[31] || (_cache[31] = [ vue.createElementVNode("circle", {
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
        }, [ ..._cache[32] || (_cache[32] = [ vue.createElementVNode("svg", {
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
        vue.createElementBlock("div", _hoisted_8, [ _cache[36] || (_cache[36] = vue.createElementVNode("span", {
          class: "dot"
        }, null, -1)), _cache[37] || (_cache[37] = vue.createElementVNode("span", {
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
        }, [ _cache[38] || (_cache[38] = vue.createElementVNode("span", {
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
        }, [ announcement.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_13, [ vue.createElementVNode("div", _hoisted_14, [ _cache[39] || (_cache[39] = vue.createElementVNode("span", {
          class: "locator"
        }, "\u516c\u544a", -1)), vue.createElementVNode("span", _hoisted_15, vue.toDisplayString(announcementTime.value), 1) ]), vue.createElementVNode("div", _hoisted_16, vue.toDisplayString(announcement.value.title), 1), vue.createElementVNode("div", {
          class: "an-body",
          innerHTML: announcement.value.html
        }, null, 8, _hoisted_17) ])) : vue.createCommentVNode("", true), hasFeature("course-automation") ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_18, [ vue.createElementVNode("div", _hoisted_19, [ _cache[40] || (_cache[40] = vue.createElementVNode("span", {
          class: "locator"
        }, "\u8bfe\u7a0b\u5b66\u4e60", -1)), vue.createElementVNode("div", _hoisted_20, [ vue.createElementVNode("button", {
          class: "btn ghost sm",
          onClick: openCourseSettings,
          "aria-label": "\u8bfe\u7a0b\u5b66\u4e60\u8bbe\u7f6e"
        }, "\u8bbe\u7f6e"), vue.unref(onCourseStudyPage) ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 0,
          class: "btn ghost sm",
          onClick: _cache[0] || (_cache[0] = (...args) => vue.unref(toggleCourseAuto) && vue.unref(toggleCourseAuto)(...args))
        }, vue.toDisplayString(settings.courseAuto ? "\u6682\u505c" : "\u7ee7\u7eed"), 1)) : vue.createCommentVNode("", true) ]) ]), vue.unref(legacyCourseUrl) ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 0
        }, [ _cache[41] || (_cache[41] = vue.createElementVNode("div", {
          class: "gate-h course-status"
        }, "\u65e7\u7248\u8bfe\u7a0b\u9875\u9762 \xb7 \u8bfe\u7a0b\u5b66\u4e60\u53ea\u652f\u6301\u65b0\u7248", -1)), _cache[42] || (_cache[42] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u8d85\u661f\u540c\u4e00\u7ae0\u8282\u6709\u65b0\u65e7\u4e24\u79cd\u9875\u9762\uff0c\u5207\u6362\u540e\u8d26\u53f7\u4e0e\u8fdb\u5ea6\u4e0d\u53d8\u3002", -1)), vue.createElementVNode("button", {
          class: "btn ghost sm",
          onClick: switchToNewCoursePage
        }, "\u5207\u6362\u65b0\u7248") ], 64)) : !vue.unref(onCourseStudyPage) ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 1
        }, [ _cache[43] || (_cache[43] = vue.createElementVNode("div", {
          class: "gate-h course-status"
        }, "\u8bfe\u7a0b\u5b66\u4e60\u53ea\u5728\u8bfe\u7a0b\u7ae0\u8282\u9875\u8fd0\u884c", -1)), _cache[44] || (_cache[44] = vue.createElementVNode("div", {
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
        }, vue.toDisplayString(item.name) + " \xb7 " + vue.toDisplayString(skipReasonLabel(item.reason)), 1))), 128)) ])) : vue.createCommentVNode("", true), _cache[45] || (_cache[45] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u6682\u505c\u4f1a\u540c\u65f6\u505c\u4e0b\u6b63\u5728\u64ad\u653e\u7684\u89c6\u9891\u3002", -1)) ], 64)) ])) : vue.createCommentVNode("", true), !detectedCount.value && !harvestedCount.value && !settings.courseAuto ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_27, [ _cache[46] || (_cache[46] = vue.createElementVNode("div", {
          class: "standby-title"
        }, "\u9759\u5019\u4e00\u95ee", -1)), vue.createElementVNode("div", _hoisted_28, vue.toDisplayString(standbyHint.value), 1) ])) : (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_29, [ vue.createElementVNode("div", _hoisted_30, [ _cache[47] || (_cache[47] = vue.createElementVNode("span", {
          class: "locator"
        }, "\u9875\u9762\u72b6\u6001", -1)), vue.createElementVNode("span", _hoisted_31, vue.toDisplayString(platformLabel.value), 1) ]), vue.createElementVNode("div", _hoisted_32, vue.toDisplayString(pageStatus.value), 1), vue.createElementVNode("div", _hoisted_33, vue.toDisplayString(homeHint.value), 1) ])), evidenceOpen.value || evidenceStatus.value || missingRule.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_34, [ evidenceOpen.value ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, {
          key: 0
        }, [ vue.createElementVNode("button", {
          class: "fold",
          onClick: cancelEvidenceDrawer
        }, [ ..._cache[48] || (_cache[48] = [ vue.createTextVNode("\u62a5\u7ed9\u5f00\u53d1\u8005 \xb7 \u4e0a\u4f20\u524d\u5148\u8fc7\u76ee", -1), vue.createElementVNode("svg", {
          class: "ic sm chev"
        }, [ vue.createElementVNode("use", {
          href: "#i-chevron"
        }) ], -1) ]) ]), _cache[49] || (_cache[49] = vue.createElementVNode("div", {
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
        }, "\u5bfc\u51fa\u672c\u9875\u9898\u76ee")) : vue.createCommentVNode("", true) ]), vue.createElementVNode("div", _hoisted_44, [ _cache[50] || (_cache[50] = vue.createElementVNode("div", {
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
        }, [ ..._cache[51] || (_cache[51] = [ vue.createTextVNode("\u53bb\u8d26\u6237 ", -1), vue.createElementVNode("svg", {
          class: "ic sm"
        }, [ vue.createElementVNode("use", {
          href: "#i-arrow"
        }) ], -1) ]) ])) : noteAction.value === "login" ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 1,
          class: "btn ghost sm sub",
          onClick: _cache[5] || (_cache[5] = $event => accountOpen.value = true)
        }, [ ..._cache[52] || (_cache[52] = [ vue.createTextVNode("\u53bb\u767b\u5f55 ", -1), vue.createElementVNode("svg", {
          class: "ic sm"
        }, [ vue.createElementVNode("use", {
          href: "#i-arrow"
        }) ], -1) ]) ])) : vue.createCommentVNode("", true) ])) : vue.createCommentVNode("", true), runDone.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_52, [ _cache[67] || (_cache[67] = vue.createElementVNode("div", {
          class: "ctitle"
        }, "\u672c\u8f6e\u5b8c\u6210", -1)), vue.createElementVNode("div", _hoisted_53, [ _cache[53] || (_cache[53] = vue.createElementVNode("span", {
          class: "k"
        }, "\u5df2\u56de\u586b", -1)), vue.createElementVNode("b", null, vue.toDisplayString(runSummary.value.filled) + " \u9898", 1), _cache[54] || (_cache[54] = vue.createElementVNode("span", {
          class: "cap-mute"
        }, "\u5df2\u6682\u5b58", -1)) ]), vue.createElementVNode("div", _hoisted_54, [ _cache[55] || (_cache[55] = vue.createElementVNode("span", {
          class: "k"
        }, "\u8ba1\u8d39", -1)), vue.createElementVNode("b", null, vue.toDisplayString(runSummary.value.charged) + " \u5206", 1), _cache[56] || (_cache[56] = vue.createElementVNode("span", {
          class: "cap-mute"
        }, "\u547d\u4e2d\u5373\u8ba1\u8d39", -1)) ]), vue.createElementVNode("div", _hoisted_55, [ _cache[57] || (_cache[57] = vue.createElementVNode("span", {
          class: "k"
        }, "\u672a\u547d\u4e2d", -1)), vue.createElementVNode("b", null, vue.toDisplayString(runSummary.value.missed) + " \u9898", 1), _cache[58] || (_cache[58] = vue.createElementVNode("span", {
          class: "cap-mute"
        }, "\u672a\u6263\u5206", -1)) ]), runSummary.value.unqueried ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_56, [ _cache[59] || (_cache[59] = vue.createElementVNode("span", {
          class: "k"
        }, "\u672a\u67e5\u8be2", -1)), vue.createElementVNode("b", null, vue.toDisplayString(runSummary.value.unqueried) + " \u9898", 1), _cache[60] || (_cache[60] = vue.createElementVNode("span", {
          class: "cap-mute"
        }, "\u672a\u53d1\u8d77\u4ed8\u8d39\u67e5\u8be2 \xb7 \u672a\u6263\u5206", -1)) ])) : vue.createCommentVNode("", true), runSummary.value.chargedUnfilled ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_57, [ _cache[61] || (_cache[61] = vue.createElementVNode("span", {
          class: "k"
        }, "\u5df2\u6263\u672a\u586b", -1)), vue.createElementVNode("b", null, vue.toDisplayString(runSummary.value.chargedUnfilled) + " \u9898", 1), _cache[62] || (_cache[62] = vue.createElementVNode("span", {
          class: "cap-mute"
        }, "\u672a\u80fd\u5b89\u5168\u5199\u5165\u9875\u9762 \xb7 \u5df2\u6263\u5206\uff0c\u9700\u624b\u52a8\u6838\u5bf9", -1)) ])) : vue.createCommentVNode("", true), runSummary.value.hitUnfilled ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_58, [ _cache[63] || (_cache[63] = vue.createElementVNode("span", {
          class: "k"
        }, "\u6709\u7b54\u6848\u672a\u5199\u5165", -1)), vue.createElementVNode("b", null, vue.toDisplayString(runSummary.value.hitUnfilled) + " \u9898", 1), _cache[64] || (_cache[64] = vue.createElementVNode("span", {
          class: "cap-mute"
        }, "\u672a\u80fd\u5b89\u5168\u5199\u5165\u9875\u9762 \xb7 \u672a\u6263\u5206\uff0c\u53ef\u5c55\u5f00\u6838\u5bf9", -1)) ])) : vue.createCommentVNode("", true), runSummary.value.skipped ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_59, [ _cache[65] || (_cache[65] = vue.createElementVNode("span", {
          class: "k"
        }, "\u672a\u5904\u7406", -1)), vue.createElementVNode("b", null, vue.toDisplayString(runSummary.value.skipped) + " \u9898", 1), _cache[66] || (_cache[66] = vue.createElementVNode("span", {
          class: "cap-mute"
        }, "\u89e3\u6790\u5931\u8d25\u6216\u9898\u578b\u4e0d\u652f\u6301 \xb7 \u672a\u67e5\u8be2\u3001\u672a\u6263\u5206", -1)) ])) : vue.createCommentVNode("", true), vue.createElementVNode("div", _hoisted_60, vue.toDisplayString(submitNote.value), 1), _cache[68] || (_cache[68] = vue.createElementVNode("span", {
          class: "done-seal",
          "aria-hidden": "true"
        }, "\u7b54", -1)) ])) : vue.createCommentVNode("", true), vue.createElementVNode("div", _hoisted_61, [ !list.value.length ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_62, vue.toDisplayString(tip.value === "\u7a7a\u95f2" ? "\u5f53\u524d\u9875\u672a\u8bc6\u522b\u5230\u9898\u76ee \xb7 \u6253\u5f00\u4f5c\u4e1a\u9875\u540e\u81ea\u52a8\u5207\u5165" : tip.value), 1)) : vue.createCommentVNode("", true), _cache[70] || (_cache[70] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u4ed8\u8d39\u9898\u5e93\u627e\u5230\u53ef\u7528\u7b54\u6848\u540e\u6263\u5206\uff1b\u514d\u8d39\u7b54\u6848\u4e0d\u6263\u5206\uff1b\u65e0\u6cd5\u5b89\u5168\u5339\u914d\u65f6\u4e0d\u4f1a\u56de\u586b\u3002", -1)), stats.value.charged ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_63, [ _cache[69] || (_cache[69] = vue.createElementVNode("span", {
          class: "spacer"
        }, null, -1)), vue.createElementVNode("span", _hoisted_64, "\u4ed8\u8d39\u9898\u5e93\u547d\u4e2d " + vue.toDisplayString(stats.value.charged) + " \u9898", 1) ])) : vue.createCommentVNode("", true), stats.value.charged ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_65, "\u91cd\u590d\u7b54\u9898\u4f1a\u590d\u7528\u5df2\u6263\u5206\u7ed3\u679c\uff0c\u4e0d\u4f1a\u91cd\u590d\u6263\u5206\u3002")) : vue.createCommentVNode("", true) ]), list.value.length ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_66, [ vue.createElementVNode("button", {
          class: "fold",
          onClick: _cache[6] || (_cache[6] = $event => navOpen.value = !navOpen.value)
        }, [ _cache[72] || (_cache[72] = vue.createTextVNode("\u9898\u76ee\u5bfc\u822a", -1)), (vue.openBlock(), 
        vue.createElementBlock("svg", {
          class: vue.normalizeClass([ "ic sm chev", {
            right: !navOpen.value
          } ])
        }, [ ..._cache[71] || (_cache[71] = [ vue.createElementVNode("use", {
          href: "#i-chevron"
        }, null, -1) ]) ], 2)) ]), navOpen.value ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, {
          key: 0
        }, [ _cache[73] || (_cache[73] = vue.createStaticVNode('<div class="legend"><span><i class="sw cur"></i>\u5f53\u524d</span><span><i class="sw hit"></i>\u5df2\u7b54</span><span><i class="sw"></i>\u672a\u7b54</span><span><i class="sw miss"></i>\u65e0\u7b54\u6848</span></div>', 1)), vue.createElementVNode("div", _hoisted_67, [ (vue.openBlock(true), 
        vue.createElementBlock(vue.Fragment, null, vue.renderList(list.value, (it, i) => (vue.openBlock(), 
        vue.createElementBlock("button", {
          key: i,
          class: vue.normalizeClass([ "cell", cellClass(it, i) ]),
          onClick: $event => jump(i)
        }, vue.toDisplayString(i + 1), 11, _hoisted_68))), 128)) ]) ], 64)) : vue.createCommentVNode("", true) ])) : vue.createCommentVNode("", true), cur.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_69, [ cur.value.status === "decodeFail" ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 0
        }, [ vue.createElementVNode("div", _hoisted_70, [ vue.createElementVNode("span", _hoisted_71, "\u7b2c " + vue.toDisplayString(curInx.value + 1) + " \u9898", 1), _cache[74] || (_cache[74] = vue.createElementVNode("span", {
          class: "tag neutral"
        }, "\u89e3\u7801\u5931\u8d25", -1)) ]), _cache[75] || (_cache[75] = vue.createElementVNode("div", {
          class: "stem"
        }, "\uff08\u9898\u9762\u89e3\u6790\u5931\u8d25\uff0c\u5df2\u8df3\u8fc7\uff09", -1)), _cache[76] || (_cache[76] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u89e3\u6790\u5931\u8d25 \xb7 \u672a\u6263\u5206 \xb7 \u9700\u624b\u52a8\u6838\u5bf9", -1)) ], 64)) : cur.value.status === "unsupported" ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 1
        }, [ vue.createElementVNode("div", _hoisted_72, [ vue.createElementVNode("span", _hoisted_73, "\u7b2c " + vue.toDisplayString(curInx.value + 1) + " \u9898", 1), _cache[77] || (_cache[77] = vue.createElementVNode("span", {
          class: "tag neutral"
        }, "\u5185\u5bb9\u89e3\u6790\u5931\u8d25", -1)) ]), _cache[78] || (_cache[78] = vue.createElementVNode("div", {
          class: "stem"
        }, "\uff08\u9898\u76ee\u65e0\u5408\u6cd5\u6587\u5b57\u6216\u56fe\u7247\uff0c\u5df2\u8df3\u8fc7\uff09", -1)), _cache[79] || (_cache[79] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u672a\u641c\u7d22 \xb7 \u672a\u6263\u5206 \xb7 \u672a\u56de\u586b", -1)) ], 64)) : (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 2
        }, [ vue.createElementVNode("div", _hoisted_74, [ vue.createElementVNode("span", _hoisted_75, "\u7b2c " + vue.toDisplayString(curInx.value + 1) + " \u9898", 1), vue.createElementVNode("div", _hoisted_76, [ cur.value.treeProgress && cur.value.treeProgress.total > 1 ? (vue.openBlock(), 
        vue.createElementBlock("span", _hoisted_77, " \u7236\u9898 " + vue.toDisplayString(cur.value.treeProgress.hit) + "/" + vue.toDisplayString(cur.value.treeProgress.total) + " \xb7 " + vue.toDisplayString(treeStatusLabel(cur.value.treeProgress.status)), 1)) : vue.createCommentVNode("", true), vue.createElementVNode("button", {
          class: "btn ghost sm sub",
          disabled: running.value,
          onClick: reAnswerCurrent
        }, "\u91cd\u7b54\u672c\u9898", 8, _hoisted_78) ]) ]), vue.createElementVNode("div", _hoisted_79, [ vue.createElementVNode("span", _hoisted_80, "[" + vue.toDisplayString(currentTypeLabel.value) + "]", 1), vue.createVNode(_sfc_main$1, {
          content: cur.value.q.stem,
          "max-height": "180px"
        }, null, 8, [ "content" ]) ]), vue.createElementVNode("div", _hoisted_81, [ (vue.openBlock(true), 
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
        }, [ ..._cache[80] || (_cache[80] = [ vue.createElementVNode("use", {
          href: "#i-chevron"
        }, null, -1) ]) ], 2)) ])) : vue.createCommentVNode("", true), vue.createElementVNode("div", _hoisted_82, [ vue.createElementVNode("div", _hoisted_83, [ _cache[81] || (_cache[81] = vue.createElementVNode("span", {
          class: "answer-label"
        }, "\u53c2\u8003\u7b54\u6848", -1)), vue.createElementVNode("div", _hoisted_84, [ cur.value.aiGenerated ? (vue.openBlock(), 
        vue.createElementBlock("span", _hoisted_85, "AI \u751f\u6210 \xb7 \u5f85\u6838\u5bf9")) : vue.createCommentVNode("", true), cur.value.answer.length ? (vue.openBlock(), 
        vue.createElementBlock("span", _hoisted_86, vue.toDisplayString(cur.value.filled ? "\u5df2\u56de\u586b" : "\u5339\u914d\u5931\u8d25"), 1)) : vue.createCommentVNode("", true) ]) ]), _cache[83] || (_cache[83] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u7b54\u6848\u4ec5\u4f9b\u53c2\u8003\uff0c\u81ea\u884c\u6838\u5bf9\u3002", -1)), ((_a3 = cur.value.answerPlan) == null ? void 0 : _a3.kind) === "slots" ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_87, [ (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(cur.value.answerPlan.slots, (slot, slotIndex) => (vue.openBlock(), 
        vue.createElementBlock("div", {
          key: slot.slotId,
          class: "answer-item"
        }, [ vue.createElementVNode("span", _hoisted_88, "\u7a7a " + vue.toDisplayString(slotIndex + 1), 1), vue.createElementVNode("span", _hoisted_89, [ (vue.openBlock(true), 
        vue.createElementBlock(vue.Fragment, null, vue.renderList(slot.values, (value, valueIndex) => (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: valueIndex
        }, [ valueIndex ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_90, "\u3001")) : vue.createCommentVNode("", true), vue.createVNode(_sfc_main$1, {
          content: value,
          "max-height": "120px"
        }, null, 8, [ "content" ]) ], 64))), 128)) ]) ]))), 128)) ])) : ((_b = cur.value.answerPlan) == null ? void 0 : _b.kind) === "matching-pair" ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_91, [ _cache[82] || (_cache[82] = vue.createElementVNode("span", {
          class: "answer-key"
        }, "\u914d\u5bf9", -1)), vue.createElementVNode("span", _hoisted_92, [ vue.createVNode(_sfc_main$1, {
          content: cur.value.answerPlan.displayValue,
          "max-height": "120px"
        }, null, 8, [ "content" ]) ]) ])) : cur.value.answer.length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_93, [ (vue.openBlock(true), 
        vue.createElementBlock(vue.Fragment, null, vue.renderList(cur.value.answer, (answer, index) => (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: index
        }, [ index ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_94, "\u3001")) : vue.createCommentVNode("", true), vue.createVNode(_sfc_main$1, {
          content: answer,
          "max-height": "120px"
        }, null, 8, [ "content" ]) ], 64))), 128)) ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_95, vue.toDisplayString(cur.value.status === "pending" ? "\u7b49\u5f85\u67e5\u9898" : "\u6682\u672a\u627e\u5230\u7b54\u6848"), 1)) ]) ], 64)) ])) : vue.createCommentVNode("", true) ], 64)) : tab.value === "harvest" ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 2
        }, [ harvestedList.value.length ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, {
          key: 0
        }, [ vue.createElementVNode("div", _hoisted_96, [ vue.createElementVNode("div", _hoisted_97, [ _cache[84] || (_cache[84] = vue.createElementVNode("span", {
          class: "locator"
        }, "\u672c\u9875\u6536\u5f55", -1)), vue.createElementVNode("div", _hoisted_98, [ vue.createElementVNode("span", _hoisted_99, vue.toDisplayString(harvestedList.value.length) + " \u9898", 1), vue.createElementVNode("button", {
          class: "btn ghost sm",
          onClick: exportHarvest
        }, "\u5bfc\u51fa\u672c\u9875\u6536\u5f55") ]) ]), _cache[85] || (_cache[85] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u505a\u8fc7\u5e76\u51fa\u5206\u7684\u9898\u76ee\u5df2\u6536\u5f55\u5230\u672c\u673a\uff0c\u547d\u4e2d\u4e0d\u6263\u5206\u3001\u4e0d\u8054\u7f51\u3002\u5168\u90e8\u8bb0\u5f55\u4e0e\u5907\u4efd\u5728\u300c\u7cfb\u7edf \xb7 \u7f13\u5b58\u300d\u3002", -1)) ]), (vue.openBlock(true), 
        vue.createElementBlock(vue.Fragment, null, vue.renderList(harvestedList.value, (h, i) => (vue.openBlock(), 
        vue.createElementBlock("div", {
          key: h.unitHash,
          class: "ent"
        }, [ vue.createElementVNode("div", _hoisted_100, [ vue.createElementVNode("span", _hoisted_101, vue.toDisplayString(h.stem ? vue.unref(harvestTypeLabel)(h.itemType) : "\u65e0\u9898\u9762"), 1), vue.createElementVNode("span", _hoisted_102, vue.toDisplayString(i + 1), 1), !h.persisted ? (vue.openBlock(), 
        vue.createElementBlock("span", _hoisted_103, "\xb7 \u672a\u4fdd\u5b58")) : vue.createCommentVNode("", true) ]), vue.createElementVNode("div", {
          class: vue.normalizeClass([ "ent-q", {
            "cap-mute": !h.stem
          } ])
        }, vue.toDisplayString(h.stem || "\u8fd9\u6761\u6ca1\u6709\u9898\u9762\uff08\u6765\u6e90\u672a\u63d0\u4f9b\uff09\uff0c\u4ecd\u53ef\u6b63\u5e38\u547d\u4e2d"), 3), vue.createElementVNode("div", _hoisted_104, vue.toDisplayString(h.values.join("\u3001")), 1), h.options && h.options.length ? (vue.openBlock(), 
        vue.createElementBlock("details", _hoisted_105, [ vue.createElementVNode("summary", _hoisted_106, "\u9009\u9879 " + vue.toDisplayString(h.options.length) + " \u9879", 1), (vue.openBlock(true), 
        vue.createElementBlock(vue.Fragment, null, vue.renderList(h.options, (op, oi) => (vue.openBlock(), 
        vue.createElementBlock("div", {
          key: oi,
          class: "cap-mute"
        }, vue.toDisplayString(letter2(oi)) + "\u3001" + vue.toDisplayString(op), 1))), 128)) ])) : vue.createCommentVNode("", true) ]))), 128)) ], 64)) : (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 1
        }, [ vue.createElementVNode("div", _hoisted_107, [ _cache[86] || (_cache[86] = vue.createElementVNode("div", {
          class: "standby-title"
        }, "\u672c\u9875\u6682\u65e0\u6536\u5f55", -1)), vue.createElementVNode("div", _hoisted_108, "\u6253\u5f00\u5df2\u6279\u9605\u7684\u4f5c\u4e1a\u6216\u8003\u8bd5\u7ed3\u679c\u9875\uff0c\u4f1a\u81ea\u52a8\u628a\u4f60\u505a\u5bf9\u7684\u9898\u6536\u5f55\u5230\u672c\u673a\u3002\u7d2f\u8ba1\u5df2\u6536\u5f55 " + vue.toDisplayString(localCacheCount.value) + " \u9898\uff0c\u5168\u90e8\u8bb0\u5f55\u5728\u300c\u7cfb\u7edf \xb7 \u7f13\u5b58\u300d\u3002", 1) ]), vue.createElementVNode("button", {
          class: "btn ghost block",
          onClick: goCacheManage
        }, "\u53bb\u7f13\u5b58\u7ba1\u7406") ], 64)) ], 64)) : tab.value === "system" && systemSub.value === "general" ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 3
        }, [ hasFeature("answer") ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_109, [ _cache[90] || (_cache[90] = vue.createElementVNode("div", {
          class: "gh2"
        }, "\u7b54\u9898\u884c\u4e3a", -1)), vue.createElementVNode("div", _hoisted_110, [ _cache[87] || (_cache[87] = vue.createElementVNode("span", {
          class: "lbl"
        }, "\u7b54\u9898\u95f4\u9694", -1)), vue.createElementVNode("span", _hoisted_111, vue.toDisplayString(settings.delayMs) + " ms", 1) ]), vue.withDirectives(vue.createElementVNode("input", {
          class: "range",
          type: "range",
          min: "500",
          max: "4000",
          step: "500",
          "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => settings.delayMs = $event),
          onChange: persist
        }, null, 544), [ [ vue.vModelText, settings.delayMs, void 0, {
          number: true
        } ] ]), _cache[91] || (_cache[91] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u76f8\u90bb\u4e24\u9898\u4e4b\u95f4\u7684\u5904\u7406\u95f4\u9694", -1)), (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, null, vue.renderList(GENERAL_SWITCHES, s => (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: s.key
        }, [ vue.createElementVNode("div", _hoisted_112, [ vue.createElementVNode("button", {
          class: vue.normalizeClass([ "switch", {
            off: !settings[s.key]
          } ]),
          onClick: s.toggle,
          "aria-label": `${s.label}\u5f00\u5173`
        }, [ ..._cache[88] || (_cache[88] = [ vue.createElementVNode("i", null, null, -1) ]) ], 10, _hoisted_113), vue.createElementVNode("span", _hoisted_114, vue.toDisplayString(s.label), 1) ]), vue.createElementVNode("div", _hoisted_115, vue.toDisplayString(s.hint), 1) ], 64))), 64)), vue.createElementVNode("div", _hoisted_116, [ _cache[89] || (_cache[89] = vue.createElementVNode("span", {
          class: "lbl"
        }, "\u63d0\u4ea4\u9608\u503c", -1)), vue.createElementVNode("span", _hoisted_117, "\u53ef\u4fe1\u547d\u4e2d \u2265 " + vue.toDisplayString(Math.round(settings.autoSubmitThreshold * 100)) + "%", 1) ]), vue.withDirectives(vue.createElementVNode("input", {
          class: "range",
          type: "range",
          min: "0.5",
          max: "1",
          step: "0.05",
          "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => settings.autoSubmitThreshold = $event),
          onChange: persist
        }, null, 544), [ [ vue.vModelText, settings.autoSubmitThreshold, void 0, {
          number: true
        } ] ]), _cache[92] || (_cache[92] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u8fbe\u5230\u9608\u503c\u624d\u63d0\u4ea4\uff0c\u4f4e\u4e8e\u53ea\u6682\u5b58\u3002\u968f\u673a\u4f5c\u7b54\u586b\u7684\u7a7a\u4e0d\u7b97\u53ef\u4fe1\u547d\u4e2d\u3002", -1)) ])) : vue.createCommentVNode("", true), _cache[100] || (_cache[100] = vue.createElementVNode("div", {
          class: "sep"
        }, null, -1)), vue.createElementVNode("div", _hoisted_118, [ _cache[95] || (_cache[95] = vue.createElementVNode("div", {
          class: "gh2"
        }, "\u9690\u79c1", -1)), vue.createElementVNode("div", _hoisted_119, [ vue.createElementVNode("button", {
          class: vue.normalizeClass([ "switch", {
            off: !settings.reportUsage
          } ]),
          onClick: toggleReport,
          "aria-label": "\u4e0a\u62a5\u533f\u540d\u5065\u5eb7\u5f00\u5173"
        }, [ ..._cache[93] || (_cache[93] = [ vue.createElementVNode("i", null, null, -1) ]) ], 2), _cache[94] || (_cache[94] = vue.createElementVNode("span", {
          class: "lbl",
          style: {
            flex: "1"
          }
        }, "\u4e0a\u62a5\u533f\u540d\u5065\u5eb7", -1)) ]), _cache[96] || (_cache[96] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u4ec5\u4e0a\u62a5\u547d\u4e2d\u7387\u4e0e\u9898\u578b\uff0c\u4e0d\u542b\u9898\u9762\u4e0e\u8d26\u53f7", -1)) ]), _cache[101] || (_cache[101] = vue.createElementVNode("div", {
          class: "sep"
        }, null, -1)), vue.createElementVNode("div", _hoisted_120, [ _cache[99] || (_cache[99] = vue.createElementVNode("div", {
          class: "gh2"
        }, "\u6570\u636e\u4e0e\u66f4\u65b0", -1)), vue.createElementVNode("div", _hoisted_121, [ vue.createElementVNode("div", null, [ _cache[97] || (_cache[97] = vue.createElementVNode("div", {
          class: "lbl"
        }, "\u672c\u5730\u7b54\u6848\u7f13\u5b58", -1)), vue.createElementVNode("div", _hoisted_122, "\u5df2\u6536\u5f55 " + vue.toDisplayString(localCacheCount.value) + " \u9898 \xb7 \u53ea\u5b58\u4f60\u505a\u8fc7\u5e76\u51fa\u5206\u7684\u9898\u76ee \xb7 \u547d\u4e2d\u4e0d\u6263\u5206\u3001\u4e0d\u8054\u7f51", 1) ]), vue.createElementVNode("button", {
          class: "btn ghost sm",
          onClick: _cache[10] || (_cache[10] = $event => systemSub.value = "cache")
        }, "\u7ba1\u7406") ]), cachePersistFailed.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_123, "\u5b58\u4e0d\u4e0b\u4e86 \xb7 \u672c\u673a\u5b58\u50a8\u5199\u5165\u88ab\u62d2\uff0c\u6700\u8fd1\u7684\u6536\u5f55\u6ca1\u6709\u843d\u76d8\u3002\u5230\u7f13\u5b58\u9875\u5bfc\u51fa\u5907\u4efd\u5e76\u6e05\u7406\u3002")) : cacheOverWarn.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_124, "\u5df2\u8d85\u51fa\u5efa\u8bae\u5bb9\u91cf " + vue.toDisplayString(vue.unref(CACHE_WARN_ENTRIES)) + " \u9898 \xb7 \u4e0d\u4f1a\u81ea\u52a8\u5220\u9664\u8bb0\u5f55\uff0c\u5efa\u8bae\u5bfc\u51fa\u5907\u4efd\u540e\u6e05\u7406\u3002", 1)) : vue.createCommentVNode("", true), vue.createElementVNode("div", _hoisted_125, [ _cache[98] || (_cache[98] = vue.createElementVNode("div", null, [ vue.createElementVNode("div", {
          class: "lbl"
        }, "\u89c4\u5219\u66f4\u65b0"), vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u6bcf 24 \u5c0f\u65f6\u81ea\u52a8\u68c0\u67e5 \xb7 \u6bcf\u4e2a\u89c4\u5219\u5305\u72ec\u7acb\u9a8c\u7b7e") ], -1)), vue.createElementVNode("button", {
          class: "btn ghost sm",
          disabled: running.value || ruleUpdating.value,
          onClick: updateRules
        }, vue.toDisplayString(ruleUpdating.value ? "\u68c0\u67e5\u4e2d\u2026" : "\u68c0\u67e5\u66f4\u65b0"), 9, _hoisted_126) ]), ruleUpdateNote.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_127, vue.toDisplayString(ruleUpdateNote.value), 1)) : vue.createCommentVNode("", true) ]) ], 64)) : tab.value === "system" && systemSub.value === "course" ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 4
        }, [ vue.createElementVNode("div", _hoisted_128, [ _cache[106] || (_cache[106] = vue.createElementVNode("div", {
          class: "gh2"
        }, "\u5b66\u4e60\u884c\u4e3a", -1)), vue.createElementVNode("div", _hoisted_129, [ vue.createElementVNode("button", {
          class: vue.normalizeClass([ "switch", {
            off: !settings.courseAuto
          } ]),
          onClick: _cache[11] || (_cache[11] = (...args) => vue.unref(toggleCourseAuto) && vue.unref(toggleCourseAuto)(...args)),
          "aria-label": "\u4efb\u52a1\u70b9\u81ea\u52a8\u64ad\u653e\u5f00\u5173"
        }, [ ..._cache[102] || (_cache[102] = [ vue.createElementVNode("i", null, null, -1) ]) ], 2), _cache[103] || (_cache[103] = vue.createElementVNode("span", {
          class: "lbl",
          style: {
            flex: "1"
          }
        }, "\u81ea\u52a8\u64ad\u653e\u89c6\u9891/\u97f3\u9891\uff08\u5b9e\u9a8c\uff09", -1)) ]), vue.createElementVNode("div", _hoisted_130, [ _cache[104] || (_cache[104] = vue.createElementVNode("span", {
          class: "lbl"
        }, "\u64ad\u653e\u500d\u901f", -1)), vue.createElementVNode("span", _hoisted_131, vue.toDisplayString(settings.coursePlaybackRate) + "\xd7", 1) ]), vue.withDirectives(vue.createElementVNode("input", {
          class: "range",
          type: "range",
          min: "1",
          max: "2",
          step: "0.5",
          "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => settings.coursePlaybackRate = $event),
          onChange: persist
        }, null, 544), [ [ vue.vModelText, settings.coursePlaybackRate, void 0, {
          number: true
        } ] ]), vue.createElementVNode("div", _hoisted_132, [ _cache[105] || (_cache[105] = vue.createElementVNode("span", {
          class: "lbl"
        }, "\u5f53\u524d\u72b6\u6001", -1)), vue.createElementVNode("span", _hoisted_133, vue.toDisplayString(mediaStatusText.value), 1) ]) ]), _cache[110] || (_cache[110] = vue.createElementVNode("div", {
          class: "sep"
        }, null, -1)), vue.createElementVNode("div", _hoisted_134, [ _cache[108] || (_cache[108] = vue.createElementVNode("div", {
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
        }, [ ..._cache[107] || (_cache[107] = [ vue.createElementVNode("i", null, null, -1) ]) ], 10, _hoisted_135), vue.createElementVNode("span", _hoisted_136, vue.toDisplayString(vue.unref(taskToggleLabel)[k]), 1) ]))), 128)), _cache[109] || (_cache[109] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u5173\u6389\u7684\u7c7b\u578b\u76f4\u63a5\u8df3\u8fc7\uff0c\u4e5f\u4e0d\u8ba1\u5165\u672c\u8282\u8fd8\u5269\u591a\u5c11\u6ca1\u505a\u3002", -1)) ]) ], 64)) : tab.value === "system" && systemSub.value === "cache" ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 5
        }, [ cacheImportPreview.value ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, {
          key: 0
        }, [ _cache[116] || (_cache[116] = vue.createElementVNode("div", {
          class: "ctitle"
        }, "\u5bfc\u5165\u7f13\u5b58", -1)), vue.createElementVNode("div", _hoisted_137, [ vue.createElementVNode("div", _hoisted_138, [ _cache[111] || (_cache[111] = vue.createElementVNode("span", {
          class: "k"
        }, "\u6587\u4ef6\u5185", -1)), vue.createElementVNode("b", null, vue.toDisplayString(cacheImportPreview.value.fileCount) + " \u6761", 1) ]), vue.createElementVNode("div", _hoisted_139, [ _cache[112] || (_cache[112] = vue.createElementVNode("span", {
          class: "k"
        }, "\u5c06\u65b0\u589e", -1)), vue.createElementVNode("b", null, vue.toDisplayString(cacheImportPreview.value.added) + " \u6761", 1) ]), vue.createElementVNode("div", _hoisted_140, [ _cache[113] || (_cache[113] = vue.createElementVNode("span", {
          class: "k"
        }, "\u5c06\u8986\u76d6", -1)), vue.createElementVNode("b", null, vue.toDisplayString(cacheImportPreview.value.replaced) + " \u6761", 1), _cache[114] || (_cache[114] = vue.createElementVNode("span", {
          class: "cap-mute"
        }, "\u540c\u9898\u5c06\u88ab\u66ff\u6362", -1)) ]), vue.createElementVNode("div", _hoisted_141, [ _cache[115] || (_cache[115] = vue.createElementVNode("span", {
          class: "k"
        }, "\u5bfc\u5165\u540e", -1)), vue.createElementVNode("b", null, vue.toDisplayString(cacheImportPreview.value.total) + " \u9898", 1) ]) ]), cacheImportPreview.value.replaced ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_142, "\u5c06\u8986\u76d6 " + vue.toDisplayString(cacheImportPreview.value.replaced) + " \u6761\u5df2\u6709\u8bb0\u5f55 \xb7 \u91cc\u9762\u53ef\u80fd\u6709\u4f60\u505a\u8fc7\u5e76\u51fa\u5206\u540e\u6536\u5f55\u7684\u7b54\u6848\uff0c\u5bfc\u5165\u4f1a\u7528\u6587\u4ef6\u91cc\u7684\u7b54\u6848\u9876\u6389\u5b83\u4eec\uff0c\u9876\u6389\u540e\u4e0d\u53ef\u64a4\u9500\u3002\u60f3\u7559\u5e95\u5c31\u5148\u53d6\u6d88\uff0c\u5bfc\u51fa\u4e00\u4efd\u518d\u5bfc\u5165\u3002", 1)) : vue.createCommentVNode("", true), _cache[117] || (_cache[117] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u5bfc\u5165\u7684\u7b54\u6848\u547d\u4e2d\u65f6\u4e0d\u6263\u5206\u3002\u7231\u95ee\u7b54\u4e0d\u6838\u9a8c\u5bfc\u5165\u5185\u5bb9\u662f\u5426\u6b63\u786e\uff0c\u63d0\u4ea4\u4f5c\u4e1a\u524d\u81ea\u884c\u6838\u5bf9\u3002", -1)), _cache[118] || (_cache[118] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u5bfc\u5165\u4e0d\u4f1a\u6dd8\u6c70\u5df2\u6709\u8bb0\u5f55\uff0c\u4e5f\u4e0d\u4f1a\u6539\u52a8\u5df2\u56de\u586b\u7684\u9875\u9762\u6216\u89e6\u53d1\u63d0\u4ea4\u3002", -1)) ], 64)) : cacheClearPending.value ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 1
        }, [ _cache[121] || (_cache[121] = vue.createElementVNode("div", {
          class: "ctitle"
        }, "\u6e05\u7a7a\u7f13\u5b58", -1)), vue.createElementVNode("div", _hoisted_143, [ vue.createElementVNode("div", _hoisted_144, [ _cache[119] || (_cache[119] = vue.createElementVNode("span", {
          class: "k"
        }, "\u5c06\u6e05\u7a7a", -1)), vue.createElementVNode("b", null, vue.toDisplayString(cacheEntries.value.length) + " \u9898", 1) ]), _cache[120] || (_cache[120] = vue.createElementVNode("div", {
          class: "prow"
        }, [ vue.createElementVNode("span", {
          class: "k"
        }, "\u5f71\u54cd"), vue.createElementVNode("span", null, "\u518d\u9047\u5230\u8fd9\u4e9b\u9898\u9700\u91cd\u65b0\u67e5\u8be2\uff0c\u4ed8\u8d39\u547d\u4e2d\u4f1a\u91cd\u65b0\u6263\u5206\u3002") ], -1)) ]), _cache[122] || (_cache[122] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u6e05\u7a7a\u4e0d\u53ef\u64a4\u9500\u3002\u5bfc\u51fa\u53ef\u7559\u4e00\u4efd\u5907\u4efd\u3002", -1)) ], 64)) : !cacheEntries.value.length ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 2
        }, [ _cache[123] || (_cache[123] = vue.createElementVNode("div", {
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
        }, [ vue.createElementVNode("div", _hoisted_145, [ vue.createElementVNode("span", _hoisted_146, [ vue.createElementVNode("b", null, vue.toDisplayString(cacheEntries.value.length), 1), vue.createTextVNode(" / " + vue.toDisplayString(vue.unref(CACHE_WARN_ENTRIES)) + " \u9898", 1) ]), vue.createElementVNode("div", _hoisted_147, [ vue.createElementVNode("i", {
          class: vue.normalizeClass({
            over: cacheOverWarn.value
          }),
          style: vue.normalizeStyle({
            width: `${Math.min(100, cacheEntries.value.length / vue.unref(CACHE_WARN_ENTRIES) * 100)}%`
          })
        }, null, 6) ]) ]), cachePersistFailed.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_148, "\u5b58\u4e0d\u4e0b\u4e86 \xb7 \u672c\u673a\u5b58\u50a8\u5199\u5165\u88ab\u62d2\uff0c\u6700\u8fd1\u7684\u6536\u5f55\u6ca1\u6709\u843d\u76d8\u3002\u5148\u5bfc\u51fa\u5907\u4efd\uff0c\u518d\u5220\u6389\u4e00\u4e9b\u4e0d\u9700\u8981\u7684\u8bb0\u5f55\u3002")) : cacheOverWarn.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_149, "\u5df2\u8d85\u51fa\u5efa\u8bae\u5bb9\u91cf \xb7 \u4e0d\u4f1a\u81ea\u52a8\u5220\u9664\u4efb\u4f55\u8bb0\u5f55\uff0c\u4f46\u8868\u8d8a\u5927\u5199\u5165\u8d8a\u6162\u3002\u5efa\u8bae\u5bfc\u51fa\u5907\u4efd\u540e\u6e05\u7406\u4e0d\u518d\u9700\u8981\u7684\u3002")) : cacheNearWarn.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_150, "\u63a5\u8fd1\u5efa\u8bae\u5bb9\u91cf " + vue.toDisplayString(vue.unref(CACHE_WARN_ENTRIES)) + " \u9898 \xb7 \u53ef\u5148\u5bfc\u51fa\u5907\u4efd\u3002", 1)) : vue.createCommentVNode("", true), _cache[126] || (_cache[126] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u547d\u4e2d\u7f13\u5b58\u4e0d\u6263\u5206\u3001\u4e0d\u8054\u7f51\u3002\u53ea\u6536\u5f55\u4f60\u505a\u8fc7\u5e76\u51fa\u5206\u7684\u9898\u76ee\uff0c\u4e0d\u4f1a\u81ea\u52a8\u5220\u9664\u3002", -1)), importedNeverHit.value.total ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 3
        }, [ importedNeverHit.value.neverHit === importedNeverHit.value.total ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_151, "\u5bfc\u5165\u7684 " + vue.toDisplayString(importedNeverHit.value.total) + " \u6761\u4e00\u6761\u90fd\u8fd8\u6ca1\u547d\u4e2d\u8fc7 \xb7 \u5982\u679c\u5176\u4e2d\u7684\u9898\u4f60\u5df2\u7ecf\u505a\u5230\u8fc7\uff0c\u591a\u534a\u662f\u9898\u9762\u4e0e\u9875\u9762\u5bf9\u4e0d\u4e0a\u3002\u5148\u62ff\u4e00\u9053\u5df2\u77e5\u7684\u9898\u9a8c\u4e00\u6b21\u518d\u8bf4\u3002", 1)) : (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_152, "\u5bfc\u5165 " + vue.toDisplayString(importedNeverHit.value.total) + " \u6761 \xb7 \u5176\u4e2d " + vue.toDisplayString(importedNeverHit.value.neverHit) + " \u6761\u6682\u672a\u547d\u4e2d\u3002", 1)), _cache[124] || (_cache[124] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u300c\u547d\u4e2d\u300d\u53ea\u8868\u793a\u9898\u76ee\u5bf9\u4e0a\u4e86\u53f7\uff0c\u4e0d\u8868\u793a\u7b54\u6848\u771f\u7684\u7528\u4e0a\u4e86\u3002\u8fd9\u4e2a\u6570\u53ea\u4f5c\u53c2\u8003\uff1a\u521a\u547d\u4e2d\u7684\u6700\u591a\u4e00\u5206\u949f\u540e\u624d\u8ba1\u5165\uff0c\u5173\u9875\u9762\u592a\u5feb\u5c31\u6c38\u8fdc\u4e0d\u8ba1\uff1b\u6682\u672a\u547d\u4e2d\u91cc\u65e2\u6709\u4f60\u8fd8\u6ca1\u505a\u5230\u7684\u9898\uff0c\u4e5f\u53ef\u80fd\u6709\u9898\u9762\u5bf9\u4e0d\u4e0a\u7684\u3002", -1)) ], 64)) : vue.createCommentVNode("", true), vue.withDirectives(vue.createElementVNode("input", {
          class: "in",
          "onUpdate:modelValue": _cache[13] || (_cache[13] = $event => cacheQuery.value = $event),
          placeholder: "\u641c\u7d22\u9898\u5e72\u6216\u7b54\u6848"
        }, null, 512), [ [ vue.vModelText, cacheQuery.value ] ]), cacheNote.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_153, vue.toDisplayString(cacheNote.value), 1)) : vue.createCommentVNode("", true), matchedCache.value.length > CACHE_LIST_LIMIT ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_154, "\u5171 " + vue.toDisplayString(matchedCache.value.length) + " \u6761 \xb7 \u53ea\u5217\u51fa\u524d " + vue.toDisplayString(CACHE_LIST_LIMIT) + " \u6761\uff0c\u7528\u641c\u7d22\u7f29\u5c0f\u8303\u56f4\u3002", 1)) : vue.createCommentVNode("", true), (vue.openBlock(true), 
        vue.createElementBlock(vue.Fragment, null, vue.renderList(filteredCache.value, entry => (vue.openBlock(), 
        vue.createElementBlock("div", {
          key: entry.unitHash,
          class: "ent"
        }, [ vue.createElementVNode("div", _hoisted_155, [ vue.createElementVNode("span", _hoisted_156, vue.toDisplayString(entry.stem ? vue.unref(harvestTypeLabel)(entry.itemType) : "\u65e0\u9898\u9762"), 1), entry.importedAt ? (vue.openBlock(), 
        vue.createElementBlock("span", _hoisted_157, "\u5bfc\u5165")) : entry.platform ? (vue.openBlock(), 
        vue.createElementBlock("span", _hoisted_158, vue.toDisplayString(entry.platform), 1)) : vue.createCommentVNode("", true), vue.createElementVNode("span", _hoisted_159, vue.toDisplayString(cacheDate(entry.savedAt)), 1), vue.createElementVNode("button", {
          class: "ent-del",
          "aria-label": `\u5220\u9664\u7f13\u5b58 ${entry.unitHash.slice(0, 8)}`,
          onClick: $event => removeCacheEntry(entry.unitHash)
        }, [ ..._cache[125] || (_cache[125] = [ vue.createElementVNode("svg", {
          class: "ic sm",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "1.7"
        }, [ vue.createElementVNode("path", {
          d: "M6 7h12M9.5 7V5.5h5V7M8 7l.7 12h6.6L16 7",
          "stroke-linecap": "round",
          "stroke-linejoin": "round"
        }) ], -1) ]) ], 8, _hoisted_160) ]), vue.createElementVNode("div", {
          class: vue.normalizeClass([ "ent-q", {
            "cap-mute": !entry.stem
          } ])
        }, vue.toDisplayString(entry.stem || "\u8fd9\u6761\u8bb0\u5f55\u6ca1\u6709\u9898\u9762\uff08\u6765\u6e90\u672a\u63d0\u4f9b\uff09\uff0c\u4ecd\u53ef\u6b63\u5e38\u547d\u4e2d"), 3), vue.createElementVNode("div", _hoisted_161, vue.toDisplayString(entry.values.join("\u3001")), 1), entry.options.length ? (vue.openBlock(), 
        vue.createElementBlock("details", _hoisted_162, [ vue.createElementVNode("summary", _hoisted_163, "\u9009\u9879 " + vue.toDisplayString(entry.options.length) + " \u9879", 1), (vue.openBlock(true), 
        vue.createElementBlock(vue.Fragment, null, vue.renderList(entry.options, (op, oi) => (vue.openBlock(), 
        vue.createElementBlock("div", {
          key: oi,
          class: "cap-mute"
        }, vue.toDisplayString(letter2(oi)) + "\u3001" + vue.toDisplayString(op), 1))), 128)) ])) : vue.createCommentVNode("", true) ]))), 128)), !filteredCache.value.length ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_164, "\u6ca1\u6709\u5339\u914d\u7684\u7f13\u5b58\u3002")) : vue.createCommentVNode("", true) ], 64)) ], 64)) : tab.value === "system" && systemSub.value === "diag" ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 6
        }, [ vue.createElementVNode("div", _hoisted_165, [ vue.createElementVNode("div", _hoisted_166, [ _cache[127] || (_cache[127] = vue.createElementVNode("span", {
          class: "ctitle"
        }, "\u5f53\u524d\u89c4\u5219", -1)), ruleDiag.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 0,
          class: vue.normalizeClass([ "tag", ruleDiag.value.source === "remote-active" ? "acc" : "neutral" ])
        }, vue.toDisplayString(ruleDiag.value.sourceLabel), 3)) : vue.createCommentVNode("", true) ]), ruleDiag.value ? (vue.openBlock(), 
        vue.createElementBlock("dl", _hoisted_167, [ _cache[128] || (_cache[128] = vue.createElementVNode("dt", null, "\u89c4\u5219\u5305", -1)), vue.createElementVNode("dd", null, vue.toDisplayString(ruleDiag.value.packageId), 1), _cache[129] || (_cache[129] = vue.createElementVNode("dt", null, "\u7248\u672c", -1)), vue.createElementVNode("dd", null, vue.toDisplayString(ruleDiag.value.version) + " \xb7 seq " + vue.toDisplayString(ruleDiag.value.releaseSequence), 1), ruleDiag.value.release ? (vue.openBlock(), 
        vue.createElementBlock("dt", _hoisted_168, "\u901a\u9053")) : vue.createCommentVNode("", true), ruleDiag.value.release ? (vue.openBlock(), 
        vue.createElementBlock("dd", _hoisted_169, vue.toDisplayString(ruleDiag.value.release.channel) + " \xb7 " + vue.toDisplayString(ruleDiag.value.release.rolloutPercent) + "%", 1)) : vue.createCommentVNode("", true), _cache[130] || (_cache[130] = vue.createElementVNode("dt", null, "\u6821\u9a8c", -1)), vue.createElementVNode("dd", null, vue.toDisplayString(ruleDiag.value.loadStatusLabel), 1) ])) : (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_170, "\u672c\u6b21\u4f1a\u8bdd\u8fd8\u6ca1\u6709\u5339\u914d\u5230\u89c4\u5219\u3002")), lastCaptureFailure.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_171, "\u89c4\u5219\u6355\u83b7\u5931\u8d25 \xb7 " + vue.toDisplayString(lastCaptureFailure.value) + " \xb7 \u8fd9\u9875\u4e0d\u662f\u6ca1\u6709\u9898\uff0c\u662f\u89c4\u5219\u6ca1\u8dd1\u5b8c", 1)) : vue.createCommentVNode("", true) ]), vue.createElementVNode("div", _hoisted_172, [ vue.createElementVNode("div", {
          class: "row"
        }, [ _cache[131] || (_cache[131] = vue.createElementVNode("span", {
          class: "ctitle"
        }, "\u8fd0\u884c\u65e5\u5fd7", -1)), vue.createElementVNode("button", {
          class: "btn ghost sm",
          onClick: clearLogs
        }, "\u6e05\u7a7a") ]), vue.createElementVNode("div", _hoisted_173, [ (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(LOG_LEVELS, lvl => vue.createElementVNode("button", {
          key: lvl.k,
          class: vue.normalizeClass([ "seg", {
            active: logFilter.value === lvl.k
          } ]),
          onClick: $event => logFilter.value = lvl.k
        }, vue.toDisplayString(lvl.l), 11, _hoisted_174)), 64)) ]), filteredLogs.value.length ? (vue.openBlock(), 
        vue.createElementBlock("ul", _hoisted_175, [ (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(filteredLogs.value, (item, i) => (vue.openBlock(), 
        vue.createElementBlock("li", {
          key: i,
          class: vue.normalizeClass([ "log-row", `log-${item.type}` ])
        }, [ vue.createElementVNode("span", _hoisted_176, vue.toDisplayString(item.time), 1), vue.createElementVNode("span", _hoisted_177, [ vue.createTextVNode(vue.toDisplayString(item.content), 1), item.repeat > 1 ? (vue.openBlock(), 
        vue.createElementBlock("span", _hoisted_178, " \xd7 " + vue.toDisplayString(item.repeat), 1)) : vue.createCommentVNode("", true) ]) ], 2))), 128)) ])) : (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_179, "\u6682\u65e0\u65e5\u5fd7")) ]), vue.createElementVNode("div", _hoisted_180, [ vue.createElementVNode("button", {
          class: "fold",
          onClick: _cache[14] || (_cache[14] = $event => diagOpen.value = !diagOpen.value)
        }, [ _cache[133] || (_cache[133] = vue.createTextVNode("\u9875\u9762\u8bca\u65ad \xb7 \u53ea\u8bc6\u522b\u4e0d\u6263\u5206", -1)), (vue.openBlock(), 
        vue.createElementBlock("svg", {
          class: vue.normalizeClass([ "ic sm chev", {
            right: !diagOpen.value
          } ])
        }, [ ..._cache[132] || (_cache[132] = [ vue.createElementVNode("use", {
          href: "#i-chevron"
        }, null, -1) ]) ], 2)) ]), diagOpen.value ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, {
          key: 0
        }, [ vue.createElementVNode("button", {
          class: "btn ghost sm",
          disabled: running.value,
          onClick: runDiag
        }, "\u8fd0\u884c\u8bca\u65ad", 8, _hoisted_181), diag.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_182, [ vue.createTextVNode(vue.toDisplayString(diag.value.matched ? `\u547d\u4e2d${platformLabel.value} \xb7 \u6293\u5230 ${diag.value.count} \u9898 \xb7 \u56fe\u7247 ${diag.value.imageCount} \u5f20 \xb7 \u6536\u5f55 ${diag.value.harvestedCount} \u9898` : "\u672a\u547d\u4e2d\u5f53\u524d\u9875") + " ", 1), (vue.openBlock(true), 
        vue.createElementBlock(vue.Fragment, null, vue.renderList(diag.value.items, (it, i) => (vue.openBlock(), 
        vue.createElementBlock("div", {
          key: i
        }, vue.toDisplayString(i + 1) + ". [" + vue.toDisplayString(it.type) + "] " + vue.toDisplayString(it.decodeFailed ? "\u89e3\u7801\u5931\u8d25" : it.stemPreview) + " \xb7 " + vue.toDisplayString(it.optionCount) + " \u9009\u9879", 1))), 128)) ])) : (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_183, "\u70b9\u300c\u8fd0\u884c\u8bca\u65ad\u300d\u8bc6\u522b\u5f53\u524d\u9875")) ], 64)) : vue.createCommentVNode("", true), vue.createElementVNode("button", {
          class: "fold",
          onClick: _cache[15] || (_cache[15] = $event => ruleMetaOpen.value = !ruleMetaOpen.value)
        }, [ _cache[135] || (_cache[135] = vue.createTextVNode("\u89c4\u5219\u660e\u7ec6", -1)), (vue.openBlock(), 
        vue.createElementBlock("svg", {
          class: vue.normalizeClass([ "ic sm chev", {
            right: !ruleMetaOpen.value
          } ])
        }, [ ..._cache[134] || (_cache[134] = [ vue.createElementVNode("use", {
          href: "#i-chevron"
        }, null, -1) ]) ], 2)) ]), ruleMetaOpen.value && ruleDiag.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_184, [ vue.createElementVNode("div", _hoisted_185, [ _cache[136] || (_cache[136] = vue.createElementVNode("span", {
          class: "rule-key"
        }, "hash", -1)), vue.createElementVNode("span", _hoisted_186, vue.toDisplayString(ruleDiag.value.contentHash), 1) ]), ruleDiag.value.release ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_187, [ _cache[137] || (_cache[137] = vue.createElementVNode("span", {
          class: "rule-key"
        }, "release", -1)), vue.createElementVNode("span", _hoisted_188, [ vue.createTextVNode(vue.toDisplayString(ruleDiag.value.release.releaseId) + " \xb7 bucket " + vue.toDisplayString(ruleDiag.value.release.cohortBucket), 1), vue.unref(isRuleCandidateTestDelivery)(ruleDiag.value.release) ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 0
        }, [ vue.createTextVNode(" \xb7 \u6d4b\u8bd5\u8bbe\u5907\u56fa\u5b9a\u547d\u4e2d") ], 64)) : vue.createCommentVNode("", true) ]) ])) : vue.createCommentVNode("", true), ruleDiag.value.candidateVersion ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_189, [ _cache[138] || (_cache[138] = vue.createElementVNode("span", {
          class: "rule-key"
        }, "candidate", -1)), vue.createElementVNode("span", _hoisted_190, vue.toDisplayString(ruleDiag.value.candidateVersion), 1) ])) : vue.createCommentVNode("", true), ruleDiag.value.lastKnownGoodVersion ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_191, [ _cache[139] || (_cache[139] = vue.createElementVNode("span", {
          class: "rule-key"
        }, "\u4e0a\u6b21\u53ef\u7528", -1)), vue.createElementVNode("span", _hoisted_192, vue.toDisplayString(ruleDiag.value.lastKnownGoodVersion), 1) ])) : vue.createCommentVNode("", true) ])) : ruleMetaOpen.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_193, "\u672c\u6b21\u4f1a\u8bdd\u8fd8\u6ca1\u6709\u5339\u914d\u5230\u89c4\u5219\u3002")) : vue.createCommentVNode("", true) ]) ], 64)) : vue.createCommentVNode("", true) ]), vue.createElementVNode("div", _hoisted_194, [ tab.value === "home" ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 0
        }, [ detectedCount.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_195, [ vue.createElementVNode("div", _hoisted_196, [ _cache[140] || (_cache[140] = vue.createElementVNode("span", {
          class: "k"
        }, "\u5c06\u56de\u586b", -1)), vue.createElementVNode("b", null, "\u6700\u591a " + vue.toDisplayString(detectedCount.value) + " \u9898", 1) ]), vue.createElementVNode("div", _hoisted_197, [ _cache[141] || (_cache[141] = vue.createElementVNode("span", {
          class: "k"
        }, "\u9884\u8ba1\u6263\u5206", -1)), vue.createElementVNode("b", null, "\u2264 " + vue.toDisplayString(detectedCount.value) + " \u5206", 1), _cache[142] || (_cache[142] = vue.createElementVNode("span", {
          class: "cap-mute"
        }, "\u547d\u4e2d\u624d\u6263", -1)) ]), _cache[143] || (_cache[143] = vue.createElementVNode("div", {
          class: "prow"
        }, [ vue.createElementVNode("span", {
          class: "k"
        }, "\u4e0d\u4f1a\u505a"), vue.createElementVNode("span", null, "\u63d0\u4ea4\u8bd5\u5377 \xb7 \u672a\u547d\u4e2d\u4e0d\u5199\u5165") ], -1)) ])) : vue.createCommentVNode("", true), detectedCount.value && hasFeature("answer") ? (vue.openBlock(), 
        vue.createElementBlock("button", {
          key: 1,
          class: "btn block",
          disabled: running.value,
          onClick: start
        }, "\u5f00\u59cb\u7b54\u9898", 8, _hoisted_198)) : (vue.openBlock(), vue.createElementBlock("button", {
          key: 2,
          class: "btn ghost block",
          disabled: running.value,
          onClick: _cache[16] || (_cache[16] = $event => detectQuestions())
        }, "\u91cd\u65b0\u8bc6\u522b\u672c\u9875", 8, _hoisted_199)) ], 64)) : tab.value === "ask" ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 1
        }, [ list.value.length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_200, [ vue.createElementVNode("span", _hoisted_201, vue.toDisplayString(tip.value), 1), vue.createElementVNode("div", _hoisted_202, [ (vue.openBlock(true), 
        vue.createElementBlock(vue.Fragment, null, vue.renderList(list.value, (it, i) => (vue.openBlock(), 
        vue.createElementBlock("i", {
          key: i,
          class: vue.normalizeClass({
            on: it.status !== "pending"
          })
        }, null, 2))), 128)) ]) ])) : vue.createCommentVNode("", true), hasFeature("answer") ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_203, [ vue.createElementVNode("button", {
          class: "btn",
          style: {
            flex: "1"
          },
          disabled: running.value,
          onClick: start
        }, "\u5f00\u59cb\u7b54\u9898", 8, _hoisted_204), running.value ? (vue.openBlock(), vue.createElementBlock("button", {
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
        }, [ cacheImportPreview.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_205, [ vue.createElementVNode("button", {
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
        vue.createElementBlock("div", _hoisted_206, [ vue.createElementVNode("button", {
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
        }, "\u786e\u8ba4\u6e05\u7a7a") ])) : cacheEntries.value.length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_207, [ vue.createElementVNode("button", {
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
        }, "\u5bfc\u51fa\u9875\u9762\u5feb\u7167"), _cache[144] || (_cache[144] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u9875\u9762\u7ed3\u6784\u7684\u5b58\u6863\uff0c\u7528\u4e8e\u590d\u73b0\u95ee\u9898\uff1b\u59d3\u540d\u3001\u5b66\u53f7\u3001\u4ee4\u724c\u7b49\u5df2\u81ea\u52a8\u906e\u76d6\u3002", -1)), vue.unref(IS_DEV) ? (vue.openBlock(), 
        vue.createElementBlock("button", {
          key: 0,
          class: "btn ghost danger block",
          disabled: ruleUpdating.value,
          onClick: resetRuleStorageAndReload
        }, " \u91cd\u7f6e\u89c4\u5219\u6570\u636e\u5e76\u5237\u65b0\uff08dev\uff09 ", 8, _hoisted_208)) : vue.createCommentVNode("", true) ], 64)) : vue.createCommentVNode("", true), vue.createElementVNode("div", _hoisted_209, [ vue.createElementVNode("span", _hoisted_210, "v" + vue.toDisplayString(vue.unref(SCRIPT_VERSION)) + " \xb7 " + vue.toDisplayString(ruleVersionLabel.value), 1), _cache[145] || (_cache[145] = vue.createElementVNode("span", {
          class: "luokuan"
        }, "\u95ee\uff0c\u5fc5\u6709\u7b54\u3002", -1)) ]) ]), accountOpen.value ? (vue.openBlock(), 
        vue.createElementBlock("div", {
          key: 3,
          class: "scrim",
          onClick: closeAccount
        })) : vue.createCommentVNode("", true), accountOpen.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_211, [ !loggedIn.value ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 0
        }, [ _cache[146] || (_cache[146] = vue.createElementVNode("div", {
          class: "ctitle"
        }, "\u767b\u5f55", -1)), vue.withDirectives(vue.createElementVNode("input", {
          class: "in",
          "onUpdate:modelValue": _cache[19] || (_cache[19] = $event => username.value = $event),
          placeholder: "\u7528\u6237\u540d\u6216\u90ae\u7bb1"
        }, null, 512), [ [ vue.vModelText, username.value ] ]), vue.withDirectives(vue.createElementVNode("input", {
          class: "in",
          "onUpdate:modelValue": _cache[20] || (_cache[20] = $event => password.value = $event),
          type: "password",
          placeholder: "\u5bc6\u7801",
          onKeyup: _cache[21] || (_cache[21] = vue.withKeys($event => doAuth("login"), [ "enter" ]))
        }, null, 544), [ [ vue.vModelText, password.value ] ]), vue.withDirectives(vue.createElementVNode("input", {
          class: "in",
          "onUpdate:modelValue": _cache[22] || (_cache[22] = $event => email.value = $event),
          type: "email",
          placeholder: "\u90ae\u7bb1 \u9009\u586b\uff0c\u53ef\u7528\u4e8e\u767b\u5f55\u4e0e\u627e\u56de\u5bc6\u7801"
        }, null, 512), [ [ vue.vModelText, email.value ] ]), vue.createElementVNode("div", _hoisted_212, [ vue.createElementVNode("button", {
          class: "btn",
          style: {
            flex: "1"
          },
          disabled: authing.value,
          onClick: _cache[23] || (_cache[23] = $event => doAuth("login"))
        }, "\u767b\u5f55", 8, _hoisted_213), vue.createElementVNode("button", {
          class: "btn ghost",
          style: {
            flex: "1"
          },
          disabled: authing.value,
          onClick: _cache[24] || (_cache[24] = $event => doAuth("register"))
        }, "\u6ce8\u518c", 8, _hoisted_214) ]), authMsg.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_215, vue.toDisplayString(authMsg.value), 1)) : vue.createCommentVNode("", true), _cache[147] || (_cache[147] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u6ce8\u518c\u8981\u6c42\u7528\u6237\u540d 3-32 \u4f4d\u3001\u5bc6\u7801\u81f3\u5c11 8 \u4f4d\uff1b\u767b\u5f55\u4e0d\u53d7\u6b64\u9650\uff0c\u8001\u8d26\u53f7\u7167\u539f\u6837\u586b\u3002", -1)), _cache[148] || (_cache[148] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u90ae\u7bb1\u4e0d\u586b\u4e5f\u80fd\u6ce8\u518c\u3002\u586b\u4e86\u53ef\u4ee5\u62ff\u5b83\u767b\u5f55\uff1b\u4e0d\u586b\u5219\u5fd8\u8bb0\u5bc6\u7801\u540e\u65e0\u6cd5\u627e\u56de\u3002", -1)), _cache[149] || (_cache[149] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u672a\u767b\u5f55\u65f6\u4ec5\u67e5\u8be2\u514d\u8d39\u9898\u5e93\u3002", -1)) ], 64)) : (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 1
        }, [ vue.createElementVNode("div", _hoisted_216, [ vue.createElementVNode("span", _hoisted_217, vue.toDisplayString(avatarInitial.value), 1), vue.createElementVNode("div", _hoisted_218, [ vue.createElementVNode("div", _hoisted_219, vue.toDisplayString(accountName.value || "\u5df2\u767b\u5f55"), 1), authStale.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_220, vue.toDisplayString(AUTH_STALE_NOTE))) : vue.createCommentVNode("", true) ]) ]), authStale.value ? (vue.openBlock(), 
        vue.createElementBlock(vue.Fragment, {
          key: 0
        }, [ vue.withDirectives(vue.createElementVNode("input", {
          class: "in",
          "onUpdate:modelValue": _cache[25] || (_cache[25] = $event => password.value = $event),
          type: "password",
          placeholder: "\u5bc6\u7801",
          onKeyup: _cache[26] || (_cache[26] = vue.withKeys($event => doAuth("login"), [ "enter" ]))
        }, null, 544), [ [ vue.vModelText, password.value ] ]), vue.createElementVNode("button", {
          class: "btn",
          disabled: authing.value,
          onClick: _cache[27] || (_cache[27] = $event => doAuth("login"))
        }, "\u91cd\u65b0\u767b\u5f55", 8, _hoisted_221), authMsg.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_222, vue.toDisplayString(authMsg.value), 1)) : vue.createCommentVNode("", true) ], 64)) : vue.createCommentVNode("", true), vue.createElementVNode("div", _hoisted_223, [ _cache[150] || (_cache[150] = vue.createElementVNode("span", {
          class: "lbl"
        }, "\u79ef\u5206\u4f59\u989d", -1)), balance.value != null ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_224, [ vue.createElementVNode("span", _hoisted_225, vue.toDisplayString(balance.value), 1) ])) : (vue.openBlock(), 
        vue.createElementBlock("span", _hoisted_226, "\u8bfb\u53d6\u4e2d\u2026")) ]), emailBound.value === false ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_227, " \u8fd9\u4e2a\u8d26\u53f7\u6ca1\u6709\u7ed1\u5b9a\u90ae\u7bb1\uff0c\u5fd8\u8bb0\u5bc6\u7801\u540e\u65e0\u6cd5\u81ea\u52a9\u627e\u56de\u3002 ")) : vue.createCommentVNode("", true), vue.createElementVNode("div", _hoisted_228, [ vue.withDirectives(vue.createElementVNode("input", {
          class: "in",
          "onUpdate:modelValue": _cache[28] || (_cache[28] = $event => cardCode.value = $event),
          placeholder: "\u8f93\u5165\u5361\u5bc6",
          onKeyup: vue.withKeys(doRedeem, [ "enter" ])
        }, null, 544), [ [ vue.vModelText, cardCode.value ] ]), vue.createElementVNode("button", {
          class: "btn",
          disabled: !cardCode.value.trim() || redeeming.value,
          onClick: doRedeem
        }, vue.toDisplayString(redeeming.value ? "\u5151\u6362\u4e2d\u2026" : "\u5151\u6362"), 9, _hoisted_229) ]), redeemNote.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_230, vue.toDisplayString(redeemNote.value), 1)) : vue.createCommentVNode("", true), _cache[151] || (_cache[151] = vue.createElementVNode("div", {
          class: "cap-mute"
        }, "\u547d\u4e2d\u624d\u8ba1\u5206\uff0c\u672a\u547d\u4e2d\u4e0d\u6263\u5206\uff1b\u540c\u4e00\u9898\u91cd\u8dd1\u4e0d\u91cd\u590d\u6263\u5206\u3002", -1)), vue.createElementVNode("div", _hoisted_231, [ vue.createElementVNode("span", _hoisted_232, vue.toDisplayString(accountName.value), 1), vue.createElementVNode("button", {
          class: "btn danger sm",
          onClick: logout
        }, "\u9000\u51fa\u767b\u5f55") ]) ], 64)) ])) : vue.createCommentVNode("", true), captchaOpen.value ? (vue.openBlock(), 
        vue.createElementBlock("div", _hoisted_233, [ vue.createElementVNode("div", _hoisted_234, [ vue.createElementVNode("div", {
          class: "row"
        }, [ _cache[153] || (_cache[153] = vue.createElementVNode("span", {
          class: "ctitle"
        }, "\u5b8c\u6210\u4eba\u673a\u9a8c\u8bc1", -1)), vue.createElementVNode("button", {
          class: "x",
          type: "button",
          "aria-label": "\u53d6\u6d88\u4eba\u673a\u9a8c\u8bc1",
          onClick: cancelCaptcha
        }, [ ..._cache[152] || (_cache[152] = [ vue.createElementVNode("svg", {
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
        }, null, 544), _cache[154] || (_cache[154] = vue.createElementVNode("div", {
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

  installAopengResponseCapture(location.hostname);

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

})(Vue);