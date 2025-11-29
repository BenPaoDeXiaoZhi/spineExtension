// ==UserScript==
// @name         ccw扩展刷新
// @namespace    http://tampermonkey.net/
// @version      2025-11-20
// @description  try to take over the world!
// @author       You
// @match        https://www.ccw.site/gandi/extension/68df6b2a263358252c84da0d
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ccw.site
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const ws = new WebSocket('ws://127.0.0.1:8888');
    console.log(ws);
    window.extData = '';
    ws.onopen = (e) => {
        console.log(e);
        setInterval(() => {
            if (window.vm) {
                try {
                    window.vm.updateGandiAssetData(
                        'extension.js',
                        window.extData
                    );
                } catch (e) {
                    console.error(e);
                }
            }
        }, 5000);
    };
    ws.onmessage = function (m) {
        console.log(m);
        extData = m.data;
    };
    // Your code here...
})();
