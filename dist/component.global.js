/* deploy by dev
 - Deploy time: 2025/11/30 17:51:01
*/
(() => {
  // src/util/storage/style.asset.css
  var style_asset_default = ".bg::after {\r\n    background-color: #0000004c;\r\n    content: '';\r\n    position: fixed;\r\n    left: 0;\r\n    top: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n}\r\n.bg {\r\n    width: 100%;\r\n    height: 100%;\r\n    position: fixed;\r\n    left: 0;\r\n    top: 0;\r\n    z-index: 540;\r\n    vertical-align: center;\r\n}\r\n.modal {\r\n    margin: 100px auto;\r\n    width: 580px;\r\n    background-color: var(--theme-color-300, #2e3644);\r\n    border: 1px solid var(--theme-color-200, #3e495b);\r\n    border-radius: 12px;\r\n    user-select: none;\r\n    min-height: 100px;\r\n    position: relative;\r\n    z-index: 550;\r\n}\r\n.header {\r\n    color: white;\r\n    display: flex;\r\n    justify-content: center;\r\n    font-size: 18px;\r\n    border-bottom: 1px solid var(--theme-color-350, #1d2634);\r\n    height: 100%;\r\n    padding: 10px;\r\n}\r\n";

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
      const modal = document.createElement("div");
      modal.className = "modal";
      const header = document.createElement("header");
      header.className = "header";
      header.innerHTML = "upload spine";
      modal.appendChild(header);
      container2.appendChild(modal);
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
