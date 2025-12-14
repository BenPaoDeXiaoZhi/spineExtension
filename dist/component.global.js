(function(){'use strict';/* deploy by Github CI/CD
 - Deploy time: 2025/12/14 11:42:47
 - Commit id: undefined
 - Repository: undefined
 - Actor: undefined*/
var l=`.bg {\r
    width: 100%;\r
    height: 100%;\r
    position: fixed;\r
    left: 0;\r
    top: 0;\r
    z-index: 540;\r
    background-color: #0000004c;\r
    user-select: none;\r
}\r
.modal {\r
    margin: 100px auto;\r
    width: 580px;\r
    background-color: var(--theme-color-300, #2e3644);\r
    border: 1px solid var(--theme-color-200, #3e495b);\r
    border-radius: 12px;\r
    min-height: 100px;\r
    user-select: none;\r
    position: relative;\r
    z-index: 550;\r
}\r
.header {\r
    color: white;\r
    display: flex;\r
    font-size: 18px;\r
    border-bottom: 1px solid var(--theme-color-350, #1d2634);\r
    height: 100%;\r
    padding: 10px;\r
}\r
.close {\r
    background-color: transparent;\r
    border: none;\r
    border-radius: 5px;\r
    position: absolute;\r
    right: 5px;\r
    padding: 0;\r
    width: 24px;\r
    height: 24px;\r
    transition: background-color 0.15s ease-out;\r
    cursor: pointer;\r
}\r
.close:hover {\r
    background-color: rgba(255, 255, 255, 0.16);\r
}\r
`;var m=`<svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">\r
    <path d="M17.657 6.112L6.343 17.426m0-11.314l11.314 11.314" stroke="#566276" stroke-width="2" stroke-linecap="round"\r
        stroke-linejoin="round"></path>\r
</svg>`;var n=class extends HTMLElement{constructor(){super();}connectedCallback(){let e=this.attachShadow({mode:"open"}),d=document.createElement("style");d.innerHTML=l;let s=document.createElement("div");s.className="bg";let c=document.createElement("div");c.className="modal";let t=document.createElement("header");t.className="header";let o=document.createElement("div");o.style.width="fit-content",o.style.margin="auto",o.innerText="上传spine文件";let r=document.createElement("button");r.className="close",r.innerHTML=m,r.addEventListener("click",g=>{this.remove();}),t.appendChild(o),t.appendChild(r),c.appendChild(t),s.appendChild(c),e.appendChild(s),e.appendChild(d);}};var a="container-test";customElements.get(a)||customElements.define(a,n);var i=document.createElement("button");i.innerText="open modal";i.addEventListener("click",h=>{let e=document.createElement(a);document.body.appendChild(e);});document.body.appendChild(i);document.body.style.height="100vh";document.body.style.margin="0";})();