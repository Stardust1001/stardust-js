var StardustJs = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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

  // index.js
  var stardust_js_exports = {};
  __export(stardust_js_exports, {
    dates: () => dates_default,
    default: () => stardust_js_default,
    funcs: () => funcs_default,
    highdict: () => highdict_default,
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
        second: 1e3
      };
      if (unit in ms) {
        return new $Date(this.getTime() + number * ms[unit]);
      }
      let [year, month, day, hour, minute, second] = format(this, "YYYY:MM:DD:HH:mm:ss").split(":").map(Number);
      switch (unit) {
        case "year": {
          year++;
          break;
        }
        case "month": {
          month += number;
          break;
        }
      }
      return new $Date(year, month - 1, day, hour, minute, second);
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
    parse,
    convertIsoDates
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
  var funcs_default = {
    sleep,
    deepCopy
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
      if (branch[leaf]) {
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
    return pako.gzip(JSON.stringify(data), { to: "string" });
  };
  var ungzip = (pako, data) => {
    return JSON.parse(pako.ungzip(new Uint8Array(data), { to: "string" }));
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
  var isBrowser = () => !!globalThis.document;
  var merge = (pako, data) => {
    slices[data.id] = slices[data.id] || [];
    slices[data.id].push(data);
    if (slices[data.id].length === data.total) {
      const numBytes = slices[data.id].reduce((sum, p) => {
        return sum + (isBrowser() ? p.data.byteLength : p.data.length);
      }, 0);
      const all = new Uint8Array(numBytes);
      let index = 0;
      slices[data.id].forEach((p) => {
        const array = isBrowser() ? new Uint8Array(p.data) : p.data;
        all.set(array, index);
        index += isBrowser() ? p.data.byteLength : p.data.length;
      });
      delete slices[data.id];
      return ungzip(pako, all);
    }
  };
  var gzipClient = (pako, client, options) => {
    options = {
      maxBytes: 1e6,
      ...options
    };
    const on = client.on;
    const Buffer2 = isBrowser() ? globalThis.ArrayBuffer : globalThis.Buffer;
    client.on = (command, func) => {
      on.apply(client, [command, async (data) => {
        if (["connect", "disconnect"].includes(command)) {
          func(data);
        } else if (data instanceof Buffer2) {
          func(ungzip(pako, data));
        } else {
          const merged = merge(pako, data);
          merged && func(merged);
        }
      }]);
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
  var stardust_js_default = {
    version: "1.0.10",
    dates: dates_default,
    funcs: funcs_default,
    highdict: highdict_default,
    validates: validates_default,
    websocket: websocket_default
  };
  return __toCommonJS(stardust_js_exports);
})();
