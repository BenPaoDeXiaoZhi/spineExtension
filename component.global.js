/* deploy by Github CI/CD
 - Deploy time: 2025/12/6 20:10:42
 - Commit id: a568d79dd72f94e0154321c26851e611f6edfa66
 - Repository: undefined
 - Actor: BenPaoDeXiaoZhi*/
(() => {
  // src/util/storage/style.asset.css
  var style_asset_default = ".bg {\n    width: 100%;\n    height: 100%;\n    position: fixed;\n    left: 0;\n    top: 0;\n    z-index: 540;\n    background-color: #0000004c;\n    user-select: none;\n}\n.modal {\n    margin: 100px auto;\n    width: 580px;\n    background-color: var(--theme-color-300, #2e3644);\n    border: 1px solid var(--theme-color-200, #3e495b);\n    border-radius: 12px;\n    min-height: 100px;\n    user-select: none;\n    position: relative;\n    z-index: 550;\n}\n.header {\n    color: white;\n    display: flex;\n    font-size: 18px;\n    border-bottom: 1px solid var(--theme-color-350, #1d2634);\n    height: 100%;\n    padding: 10px;\n}\n.close {\n    background-color: transparent;\n    border: none;\n    border-radius: 5px;\n    position: absolute;\n    right: 5px;\n    padding: 0;\n    width: 24px;\n    height: 24px;\n    transition: background-color 0.15s ease-out;\n    cursor: pointer;\n}\n.close:hover {\n    background-color: rgba(255, 255, 255, 0.16);\n}\n";

  // src/util/storage/close.svg
  var close_default = '<svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">\n    <path d="M17.657 6.112L6.343 17.426m0-11.314l11.314 11.314" stroke="#566276" stroke-width="2" stroke-linecap="round"\n        stroke-linejoin="round"></path>\n</svg>';

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
