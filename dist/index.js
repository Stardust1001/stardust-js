var StardustJs = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // index.js
  var stardust_js_exports = {};
  __export(stardust_js_exports, {
    dates: () => dates_default,
    default: () => stardust_js_default,
    eventemitter: () => eventemitter_default,
    funcs: () => funcs_default,
    highdict: () => highdict_default,
    promises: () => promises_default,
    sleep: () => sleep2,
    validates: () => validates_default,
    websocket: () => websocket_default
  });

  // dates.js
  var $Date = class extends Date {
    static parse(text, fmat) {
      return new $Date(parse(text, fmat));
    }
    add(number, unit) {
      const ms = {
        week: 864e5 * 7,
        day: 864e5,
        hour: 36e5,
        minute: 6e4,
        second: 1e3,
        millisecond: 1
      };
      if (unit in ms) {
        return new $Date(this.getTime() + number * ms[unit]);
      }
      let [year, month, day, hour, minute, second, millisecond] = format(this, "YYYY:MM:DD:HH:mm:ss:SSS").split(":").map(Number);
      switch (unit) {
        case "year": {
          year += number;
          break;
        }
        case "month": {
          month += number;
          break;
        }
      }
      return new $Date(year, month - 1, day, hour, minute, second, millisecond);
    }
    minus(number, unit) {
      return this.add(-number, unit);
    }
    diff(date) {
      return this.getTime() - new Date(date).getTime();
    }
    to(fmat, time = true) {
      return format(this, fmat, time);
    }
    toDateTime() {
      return format(this, "", true);
    }
    toDate() {
      return format(this, "", false);
    }
    toTime() {
      return format(this, "HH:mm:ss");
    }
  };
  var now = () => new $Date();
  var _double = (number) => {
    return number >= 10 ? number : "0" + number;
  };
  var _replacers = {
    YYYY(date) {
      return date.getFullYear();
    },
    MM(date) {
      return _double(date.getMonth() + 1);
    },
    DD(date) {
      return _double(date.getDate());
    },
    HH(date) {
      return _double(date.getHours());
    },
    mm(date) {
      return _double(date.getMinutes());
    },
    ss(date) {
      return _double(date.getSeconds());
    },
    SSS(date) {
      return ("000" + date.getMilliseconds()).slice(-3);
    }
  };
  var format = (date, fmat, time = true) => {
    if (!fmat) {
      fmat = time ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD";
    }
    if (typeof date === "string" && date.indexOf("T") < 0) {
      date = date.replace(/-/g, "/");
    }
    date = new Date(date || "");
    if (isNaN(date)) {
      return "";
    }
    Object.keys(_replacers).forEach((name) => {
      if (fmat.indexOf(name) >= 0) {
        fmat = fmat.replace(name, _replacers[name](date));
      }
    });
    return fmat;
  };
  var formatDate = (date, fmat = "YYYY-MM-DD") => {
    if (typeof fmat !== "string")
      fmat = "YYYY-MM-DD";
    return format(date, fmat);
  };
  var formatTime = (date, fmat = "HH:mm:ss") => {
    if (typeof fmat !== "string")
      fmat = "HH:mm:ss";
    return format(date, fmat);
  };
  var parse = (text, fmat = "YYYY-MM-DD HH:mm:ss") => {
    const items = "YYYY,MM,DD,HH,mm,ss".split(",");
    let dateText = "YYYY-MM-DD HH:mm:ss";
    for (let key of items) {
      const left = fmat.indexOf(key);
      if (left >= 0) {
        const right = left + key.length;
        dateText = dateText.replace(key, text.slice(left, right));
      } else {
        dateText = dateText.replace(key, "00");
      }
    }
    return new Date(dateText);
  };
  var convertIsoDates = (text) => {
    return text.replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/g, (e) => format(e));
  };
  var dates_default = {
    $Date,
    now,
    format,
    formatDate,
    formatTime,
    parse,
    convertIsoDates
  };

  // eventemitter.js
  var has = Object.prototype.hasOwnProperty;
  function Events() {
  }
  Events.prototype = /* @__PURE__ */ Object.create(null);
  function EE(fn, context, once) {
    this.fn = fn;
    this.context = context;
    this.once = once || false;
  }
  function addListener(emitter2, event, fn, context, once) {
    if (typeof fn !== "function") {
      throw new TypeError("The listener must be a function");
    }
    const listener = new EE(fn, context || emitter2, once);
    if (!emitter2._events[event]) {
      emitter2._events[event] = listener;
      emitter2._eventsCount++;
    } else if (!emitter2._events[event].fn) {
      emitter2._events[event].push(listener);
    } else {
      emitter2._events[event] = [emitter2._events[event], listener];
    }
    return emitter2;
  }
  function clearEvent(emitter2, event) {
    if (--emitter2._eventsCount === 0) {
      emitter2._events = new Events();
    } else {
      delete emitter2._events[event];
    }
  }
  function EventEmitter() {
    this._events = new Events();
    this._eventsCount = 0;
  }
  EventEmitter.prototype.eventNames = function() {
    if (this._eventsCount === 0) {
      return [];
    }
    const names = [];
    const events = this._events;
    for (let name in events) {
      if (has.call(events, name)) {
        names.push(name);
      }
    }
    if (Object.getOwnPropertySymbols) {
      return names.concat(Object.getOwnPropertySymbols(events));
    }
    return names;
  };
  EventEmitter.prototype.listeners = function(event) {
    const handlers = this._events[event];
    if (!handlers) {
      return [];
    }
    if (handlers.fn) {
      return [handlers.fn];
    }
    return handlers.map((h) => h.fn);
  };
  EventEmitter.prototype.listenerCount = function(event) {
    const listeners = this._events[event];
    if (!listeners)
      return 0;
    if (listeners.fn)
      return 1;
    return listeners.length;
  };
  EventEmitter.prototype.emit = function(event, ...props) {
    if (!this._events[event])
      return false;
    const listeners = this._events[event];
    if (listeners.fn) {
      if (listeners.once) {
        this.removeListener(event, listeners.fn, void 0, true);
      }
      listeners.fn.apply(listeners.context, props);
    } else {
      const len = listeners.length;
      for (let i = 0; i < len; i++) {
        listeners[i].fn.apply(listeners[i].context, props);
      }
    }
    return true;
  };
  EventEmitter.prototype.asyncEmit = function(event, ...props) {
    return __async(this, null, function* () {
      if (!this._events[event])
        return false;
      const listeners = this._events[event];
      if (listeners.fn) {
        if (listeners.once) {
          this.removeListener(event, listeners.fn, void 0, true);
        }
        yield listeners.fn.apply(listeners.context, props);
      } else {
        const len = listeners.length;
        for (let i = 0; i < len; i++) {
          yield listeners[i].fn.apply(listeners[i].context, props);
        }
      }
      return true;
    });
  };
  EventEmitter.prototype.on = function(event, fn, context) {
    return addListener(this, event, fn, context, false);
  };
  EventEmitter.prototype.once = function(event, fn, context) {
    return addListener(this, event, fn, context, true);
  };
  EventEmitter.prototype.removeListener = function(event, fn, context, once) {
    if (!this._events[event])
      return this;
    if (!fn) {
      clearEvent(this, event);
      return this;
    }
    const listeners = this._events[event];
    if (listeners.fn) {
      if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
        clearEvent(this, event);
      }
    } else {
      const events = listeners.filter((l) => {
        return l.fn !== fn || once && !l.once || context && l.context !== context;
      });
      if (events.length) {
        this._events[event] = events.length === 1 ? events[0] : events;
      } else {
        clearEvent(this, event);
      }
    }
    return this;
  };
  EventEmitter.prototype.removeAllListeners = function(event) {
    if (event) {
      if (this._events[event]) {
        clearEvent(this, event);
      }
    } else {
      this._events = new Events();
      this._eventsCount = 0;
    }
    return this;
  };
  EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
  EventEmitter.prototype.addListener = EventEmitter.prototype.on;
  EventEmitter.EventEmitter = EventEmitter;
  var emitter = new EventEmitter();
  var eventemitter_default = {
    emit: emitter.emit.bind(emitter),
    asyncEmit: emitter.asyncEmit.bind(emitter),
    once: emitter.once.bind(emitter),
    on: emitter.on.bind(emitter),
    EventEmitter
  };

  // funcs.js
  var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  var deepCopy = (obj) => {
    if (obj === null || obj instanceof Date || typeof obj !== "object") {
      return obj;
    }
    const cn = Array.isArray(obj) ? [] : {};
    Object.keys(obj).forEach((key) => {
      cn[key] = deepCopy(obj[key]);
    });
    return cn;
  };
  var encodeQuery = (data) => {
    const arr = Array.isArray(data) ? data : Object.entries(data);
    const query = new URLSearchParams();
    arr.forEach(([k, v]) => {
      query.append(k, v == null ? "" : v);
    });
    return query.toString();
  };
  var decodeQuery = (search) => {
    if (search.startsWith("http")) {
      search = new URL(search).search;
    }
    const query = new URLSearchParams(search);
    return [...query].reduce((dict, [k, v]) => __spreadProps(__spreadValues({}, dict), { [k]: v }), {});
  };
  var funcs_default = {
    sleep,
    deepCopy,
    encodeQuery,
    decodeQuery
  };

  // highdict.js
  var split = (path) => {
    return path.split(/(\.|\[\d+\])/).filter((leaf) => leaf && leaf !== ".").map((leaf) => {
      if (leaf[0] === "[") {
        return Number(leaf.slice(1, -1));
      }
      return leaf;
    });
  };
  var get = (dict, key, defaults) => {
    const path = split(key);
    let branch = dict;
    for (let i = 0, len = path.length; i < len; i++) {
      const leaf = path[i];
      if (branch == null ? void 0 : branch.hasOwnProperty(leaf)) {
        branch = branch[leaf];
      } else {
        return defaults;
      }
    }
    return branch;
  };
  var set = (dict, key, value) => {
    const path = split(key);
    let branch = dict;
    for (let i = 0, len = path.length; i < len; i++) {
      const leaf = path[i];
      if (!branch[leaf]) {
        if (i < len - 1) {
          if (Number.isInteger(path[i + 1])) {
            branch[leaf] = [];
          } else {
            branch[leaf] = {};
          }
          branch = branch[leaf];
        } else {
          branch[leaf] = value;
        }
      } else {
        if (i < len - 1 && typeof branch[leaf] !== "object") {
          throw new Error("\u5C5E\u6027\u5DF2\u5B58\u5728\uFF0C\u4E14\u4E0D\u662F\u5BF9\u8C61\u7C7B\u578B");
        }
        if (i < len - 1) {
          branch = branch[leaf];
        } else {
          branch[leaf] = value;
        }
      }
    }
  };
  var mapField = (arr, key, value) => {
    const dict = {};
    arr.forEach((ele) => {
      dict[ele[key]] = ele[value];
    });
    return dict;
  };
  var highdict_default = {
    split,
    get,
    set,
    mapField
  };

  // promises.js
  var deconcurrent = (fetcher) => {
    let promise = null;
    const func = (...props) => __async(void 0, null, function* () {
      const data = yield fetcher(...props);
      promise = null;
      return data;
    });
    return (...props) => promise || (promise = func(...props));
  };
  var schedule = (psGen, total = 0, limit = 20) => __async(void 0, null, function* () {
    if (!total)
      return [];
    let doing = 0;
    let current = 0;
    const results = {};
    return new Promise((resolve) => {
      const isDone = () => {
        let ok = false;
        if (typeof total === "number") {
          ok = current >= total - 1;
        } else if (typeof total === "function") {
          ok = total(current);
        } else {
          throw "unknown type of total";
        }
        if (ok && !doing) {
          resolve(Object.values(results));
        }
        return ok;
      };
      const fork = () => {
        const ps = psGen(current);
        const id = current;
        ++doing;
        ps.then((result) => {
          results[id] = result;
          doing--;
          if (!isDone()) {
            ++current;
            fork();
          }
        });
      };
      for (let i = 0; i < limit; i++) {
        current = i;
        fork();
        if (isDone())
          break;
      }
    });
  });
  var promises_default = {
    deconcurrent,
    schedule
  };

  // validates.js
  var phone = (text) => {
    return /^1\d{10}$/.test(text);
  };
  var email = (text) => {
    return /^([\w_-]\.)*[\w_-]+@[\w_-]+(.[\w_-]+)+$/.test(text);
  };
  var idCard = (text) => {
    if (!/^\d{17}(\d|X)$/.test(text)) {
      return false;
    }
    const coefficients = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const lasts = "10X98765432";
    const sum = text.split("").slice(0, -1).map(Number).reduce((sum2, ele, index) => sum2 + ele * coefficients[index], 0);
    const last = lasts[sum % 11];
    return text[text.length - 1] === last;
  };
  var validates_default = {
    phone,
    email,
    idCard
  };

  // websocket.js
  var gzip = (pako, data) => {
    if (typeof data === "string" && data.startsWith("[compressed]"))
      return data;
    return pako.gzip(JSON.stringify(data));
  };
  var ungzip = (pako, data) => {
    if (typeof data === "string" && data.startsWith("[compressed]"))
      return data;
    if (!(data instanceof ArrayBuffer)) {
      data = new Uint8Array(data);
    }
    return JSON.parse(pako.ungzip(data, { to: "string" }));
  };
  var split2 = (pako, data, maxBytes) => {
    const gzipped = gzip(pako, data);
    if (gzipped.length < maxBytes) {
      return [gzipped];
    } else {
      const total = Math.ceil(gzipped.length / maxBytes);
      const id = Date.now().toString(16);
      return Array.from({ length: total }).map((_, i) => {
        return {
          id,
          total,
          no: i + 1,
          data: gzipped.slice(i * maxBytes, (i + 1) * maxBytes)
        };
      });
    }
  };
  var slices = {};
  var isBrowser = () => !!globalThis.window;
  var merge = (pako, data) => {
    slices[data.id] = slices[data.id] || [];
    slices[data.id].push(data);
    if (slices[data.id].length === data.total) {
      const isText = typeof data.data === "string";
      const numBytes = slices[data.id].reduce((sum, p) => {
        return sum + (p.data.byteLength || p.data.length);
      }, 0);
      let all = isText ? "" : new Uint8Array(numBytes);
      let index = 0;
      slices[data.id].forEach((p) => {
        if (isText)
          return all += p.data;
        const array = isBrowser() ? new Uint8Array(p.data) : p.data;
        all.set(array, index);
        index += p.data.byteLength || p.data.length;
      });
      delete slices[data.id];
      return ungzip(pako, all);
    }
  };
  var gzipClient = (pako, client, options) => {
    options = __spreadValues({
      maxBytes: 1e6
    }, options);
    const on = client.on;
    const Buffer2 = isBrowser() ? globalThis.ArrayBuffer : globalThis.Buffer;
    client.on = (command, func) => {
      on.apply(client, [command, (data) => __async(void 0, null, function* () {
        if (["connect", "disconnect"].includes(command)) {
          func(data);
        } else if (typeof data === "string" && data.startsWith("[compressed]")) {
          func(data);
        } else if (data instanceof Buffer2) {
          func(ungzip(pako, data));
        } else {
          const merged = merge(pako, data);
          merged && func(merged);
        }
      })]);
    };
    const emit = client.emit;
    client.emit = (command, message) => {
      const slices2 = split2(pako, message, options.maxBytes);
      slices2.forEach((slice) => {
        emit.apply(client, [command, slice]);
      });
    };
    return client;
  };
  var websocket_default = {
    gzip,
    ungzip,
    gzipClient
  };

  // index.js
  var { sleep: sleep2 } = funcs_default;
  var stardust_js_default = {
    version: "1.0.31",
    dates: dates_default,
    eventemitter: eventemitter_default,
    funcs: funcs_default,
    sleep: sleep2,
    highdict: highdict_default,
    promises: promises_default,
    validates: validates_default,
    websocket: websocket_default
  };
  return __toCommonJS(stardust_js_exports);
})();
