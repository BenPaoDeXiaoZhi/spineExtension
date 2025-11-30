/* deploy by dev
 - Deploy time: 2025/11/30 13:50:23
*/
(() => {
  // src/util/storage/style.asset.css
  var style_asset_default = '.bg::before {\r\n    background-color: #0000004c;\r\n    display: flex;\r\n    width: 100%;\r\n    height: 100%;\r\n    position: absolute;\r\n    left: 0;\r\n    top: 0;\r\n    z-index: 540;\r\n    content: "";\r\n}\r\n.bg{\r\n    display: flex;\r\n    justify-content: center;\r\n}';

  // src/util/storage/index.ts
  var Container = class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const shadow = this.attachShadow({ mode: "open" });
      const style = document.createElement("style");
      style.innerHTML = style_asset_default;
      const container2 = document.createElement("div");
      container2.className = "bg";
      container2.innerText = "hello";
      shadow.appendChild(container2);
      shadow.appendChild(style);
    }
  };

  // src/dev/file.ts
  var NAME = "container-test";
  if (!customElements.get(NAME)) {
    customElements.define(NAME, Container);
  }
  var container = document.createElement(NAME);
  document.body.appendChild(container);
  document.body.style.height = "100vh";
  document.body.style.margin = "0";
})();
