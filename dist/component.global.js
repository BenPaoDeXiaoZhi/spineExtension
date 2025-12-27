(function(){'use strict';/* deploy by Github CI/CD
 - Deploy time: 2025/12/27 15:18:34
 - Commit id: 549a6a4ae646235da9678239d328c9c7331617cd
 - Repository: BenPaoDeXiaoZhi/spineExtension
 - Actor: BenPaoDeXiaoZhi*/
var l=`.bg {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 540;
    background-color: #0000004c;
    user-select: none;
}
.modal {
    margin: 100px auto;
    width: 580px;
    background-color: var(--theme-color-300, #2e3644);
    border: 1px solid var(--theme-color-200, #3e495b);
    border-radius: 12px;
    min-height: 100px;
    user-select: none;
    position: relative;
    z-index: 550;
}
.header {
    color: white;
    display: flex;
    font-size: 18px;
    border-bottom: 1px solid var(--theme-color-350, #1d2634);
    height: 100%;
    padding: 10px;
}
.close {
    background-color: transparent;
    border: none;
    border-radius: 5px;
    position: absolute;
    right: 5px;
    padding: 0;
    width: 24px;
    height: 24px;
    transition: background-color 0.15s ease-out;
    cursor: pointer;
}
.close:hover {
    background-color: rgba(255, 255, 255, 0.16);
}
`;var m=`<svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.657 6.112L6.343 17.426m0-11.314l11.314 11.314" stroke="#566276" stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round"></path>
</svg>`;var n=class extends HTMLElement{constructor(){super();}connectedCallback(){let e=this.attachShadow({mode:"open"}),d=document.createElement("style");d.innerHTML=l;let s=document.createElement("div");s.className="bg";let c=document.createElement("div");c.className="modal";let t=document.createElement("header");t.className="header";let o=document.createElement("div");o.style.width="fit-content",o.style.margin="auto",o.innerText="上传spine文件";let r=document.createElement("button");r.className="close",r.innerHTML=m,r.addEventListener("click",g=>{this.remove();}),t.appendChild(o),t.appendChild(r),c.appendChild(t),s.appendChild(c),e.appendChild(s),e.appendChild(d);}};var a="container-test";customElements.get(a)||customElements.define(a,n);var i=document.createElement("button");i.innerText="open modal";i.addEventListener("click",h=>{let e=document.createElement(a);document.body.appendChild(e);});document.body.appendChild(i);document.body.style.height="100vh";document.body.style.margin="0";})();