/* deploy by Github CI/CD
 - Deploy time: 2025/12/13 15:28:41
 - Commit id: undefined
 - Repository: undefined
 - Actor: undefined*/
(() => {
  // src/util/htmlReport.ts
  function clean(obj) {
    var _a;
    if ("prototype" in obj) {
      obj.prototype = /* @__PURE__ */ Object.create(null);
    }
    Object.setPrototypeOf(obj, /* @__PURE__ */ Object.create(null));
    if (Object.getPrototypeOf(obj).constructor || ((_a = obj == null ? void 0 : obj.prototype) == null ? void 0 : _a.constructor)) {
      console.warn("clean失败", obj);
    }
    return obj;
  }
  function resoveMaybeFunc(dat) {
    if (dat instanceof Function) {
      return dat();
    } else {
      return dat;
    }
  }
  var HTMLReport = class {
    /**
     * used by blockly report
     * @returns a html string
     */
    replace;
    /**
     * used by extensions
     * @returns origin value
     */
    valueOf;
    /**
     * used by monitor
     * @returns a raw text used in monitor
     */
    toString;
    constructor(element, value, monitorValue) {
      const report = {
        //使用闭包防修改
        replace: clean(() => resoveMaybeFunc(element).innerHTML),
        valueOf: clean(() => resoveMaybeFunc(value)),
        toString: clean(() => resoveMaybeFunc(monitorValue))
      };
      Object.assign(this, report);
      Object.freeze(this);
    }
  };

  // src/dev/htmlReport.ts
  console.log(new HTMLReport("report", { a: "b" }, "monitor"));
  Object.assign(window, {
    HTMLReport
  });
})();
