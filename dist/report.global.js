(function(){'use strict';/* deploy by Github CI/CD
 - Deploy time: 2025/12/14 11:42:47
 - Commit id: undefined
 - Repository: undefined
 - Actor: undefined*/
function o(t){var n;return "prototype"in t&&(t.prototype=Object.create(null)),Object.setPrototypeOf(t,Object.create(null)),(Object.getPrototypeOf(t).constructor||(n=t==null?void 0:t.prototype)!=null&&n.constructor)&&console.warn("clean失败",t),t}function r(t){return t instanceof Function?t():t}var e=class{replace;valueOf;toString;constructor(n,i,s){let a={replace:o(()=>r(n).innerHTML),valueOf:o(()=>r(i)),toString:o(()=>r(s))};Object.assign(this,a),Object.freeze(this);}};var c=document.createElement("div");c.innerText="report";console.log(new e(c,{a:"b"},"monitor"));Object.assign(window,{HTMLReport:e});})();