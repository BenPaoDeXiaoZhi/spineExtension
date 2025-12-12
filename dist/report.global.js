/* deploy by Github CI/CD
 - Deploy time: 2025/12/12 21:06:42
 - Commit id: undefined
 - Repository: undefined
 - Actor: undefined*/
(() => {
  // src/util/htmlReport/index.ts
  function clean(obj) {
    var _a;
    if ("prototype" in obj) {
      obj.prototype = /* @__PURE__ */ Object.create(null);
    }
    Object.setPrototypeOf(obj, /* @__PURE__ */ Object.create(null));
    console.log(obj);
    if (Object.getPrototypeOf(obj).constructor || ((_a = obj == null ? void 0 : obj.prototype) == null ? void 0 : _a.constructor)) {
      console.warn("clean失败", obj);
    }
    return obj;
  }
  var HTMLReport = class {
    constructor(element, value, monitorValue) {
      const htmlText = element instanceof HTMLElement ? element.innerHTML : element;
      const report = {
        replace: clean(() => htmlText),
        valueOf: clean(() => value),
        toString: clean(() => monitorValue)
      };
      Object.assign(this, report);
      clean(Object.getPrototypeOf(this));
    }
  };
  clean(HTMLReport);

  // src/dev/htmlReport.ts
  console.log(new HTMLReport("report", { a: "b" }, "monitor"));
  Object.assign(window, {
    HTMLReport
  });
})();
