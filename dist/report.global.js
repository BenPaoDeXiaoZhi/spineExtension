(function () {
  'use strict';

  /* deploy by Github CI/CD
   - Deploy time: 2025/12/14 11:39:17
   - Commit id: undefined
   - Repository: undefined
   - Actor: undefined*/

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
  function resolveMaybeFunc(dat) {
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
        replace: clean(() => resolveMaybeFunc(element).innerHTML),
        valueOf: clean(() => resolveMaybeFunc(value)),
        toString: clean(() => resolveMaybeFunc(monitorValue))
      };
      Object.assign(this, report);
      Object.freeze(this);
    }
  };

  // src/dev/htmlReport.ts
  var container = document.createElement("div");
  container.innerText = "report";
  console.log(new HTMLReport(container, { a: "b" }, "monitor"));
  Object.assign(window, {
    HTMLReport
  });

})();
