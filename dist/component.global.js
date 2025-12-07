/* deploy by Github CI/CD
 - Deploy time: 2025/12/7 17:31:58
 - Commit id: undefined
 - Repository: undefined
 - Actor: undefined*/
(() => {
  // src/util/storage/style.asset.css
  var style_asset_default = ".bg {\r\n    width: 100%;\r\n    height: 100%;\r\n    position: fixed;\r\n    left: 0;\r\n    top: 0;\r\n    z-index: 540;\r\n    background-color: #0000004c;\r\n    user-select: none;\r\n}\r\n.modal {\r\n    margin: 100px auto;\r\n    width: 580px;\r\n    background-color: var(--theme-color-300, #2e3644);\r\n    border: 1px solid var(--theme-color-200, #3e495b);\r\n    border-radius: 12px;\r\n    min-height: 100px;\r\n    user-select: none;\r\n    position: relative;\r\n    z-index: 550;\r\n}\r\n.header {\r\n    color: white;\r\n    display: flex;\r\n    font-size: 18px;\r\n    border-bottom: 1px solid var(--theme-color-350, #1d2634);\r\n    height: 100%;\r\n    padding: 10px;\r\n}\r\n.close {\r\n    background-color: transparent;\r\n    border: none;\r\n    border-radius: 5px;\r\n    position: absolute;\r\n    right: 5px;\r\n    padding: 0;\r\n    width: 24px;\r\n    height: 24px;\r\n    transition: background-color 0.15s ease-out;\r\n    cursor: pointer;\r\n}\r\n.close:hover {\r\n    background-color: rgba(255, 255, 255, 0.16);\r\n}\r\n";

  // src/util/storage/close.svg
  var close_default = '<svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">\r\n    <path d="M17.657 6.112L6.343 17.426m0-11.314l11.314 11.314" stroke="#566276" stroke-width="2" stroke-linecap="round"\r\n        stroke-linejoin="round"></path>\r\n</svg>';

  // src/util/storage/index.ts
  var Container = class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const shadow = this.attachShadow({ mode: "open" });
      const style = document.createElement("style");
      style.innerHTML = style_asset_default;
      const container = document.createElement("div");
      container.className = "bg";
      const modal = document.createElement("div");
      modal.className = "modal";
      const header = document.createElement("header");
      header.className = "header";
      const headerText = document.createElement("div");
      headerText.style.width = "fit-content";
      headerText.style.margin = "auto";
      headerText.innerText = "上传spine文件";
      const close = document.createElement("button");
      close.className = "close";
      close.innerHTML = close_default;
      close.addEventListener("click", (e) => {
        this.remove();
      });
      header.appendChild(headerText);
      header.appendChild(close);
      modal.appendChild(header);
      container.appendChild(modal);
      shadow.appendChild(container);
      shadow.appendChild(style);
    }
  };

  // src/dev/file.ts
  var NAME = "container-test";
  if (!customElements.get(NAME)) {
    customElements.define(NAME, Container);
  }
  var open = document.createElement("button");
  open.innerText = "open modal";
  open.addEventListener("click", (e) => {
    const container = document.createElement(NAME);
    document.body.appendChild(container);
  });
  document.body.appendChild(open);
  document.body.style.height = "100vh";
  document.body.style.margin = "0";
})();
