import { chromium } from 'playwright';
import fs from 'fs';
// function getVM(vm){
//     console.log(vm)
// }
const pid = process.env.PROJECT_ID;
const token =
    process.env.CCW_TOKEN || '000000000000000063c2807d669fa967f17f0000';
const uid = token.slice(16);
console.log('deploy to Project:', pid);
console.log('using uid:', uid);
try {
    (async () => {
        const browser = await chromium.launch();
        // Create pages, interact with UI elements, assert values
        const context = await browser.newContext();
        let fdat = fs.readFileSync('./dist/extension.global.js', 'utf8');
        console.log(fdat.slice(0,100)+"...");
        await context.addCookies([
            {
                name: 'token',
                value: token,
                domain: '.ccw.site',
                path: '/',
                httpOnly: true,
            },
            {
                name: 'cookie-user-id',
                value: uid,
                domain: '.ccw.site',
                path: '/',
            },
        ]);
        await context.exposeFunction('log', (...dat) => {
            console.log(...dat);
        });
        await context.exposeFunction('exit', async (ext = '') => {
            console.log('exit');
            await page.close();
            await context.close();
            await browser.close();
            console.log('exited');
            throw new Error('exited');
        });
        context.addInitScript((fdat) => {
            console.log = console.warn = console.error = log;
            window.onerror = function (message, source, lineno, colno, error) {
                console.error(
                    `Error: ${message} at ${source}:${lineno}:${colno}`
                );
                // 进一步的处理逻辑
                return true; // 阻止默认的错误处理
            };
            let vm;
            const tid = setTimeout(
                () => {
                    console.error("timeout!!");
                    window.exit(document.body.innerHTML)};
                }
                20000
            );
            const orig = Function.prototype.bind;
            Function.prototype.bind = function (self2, ...args) {
                if (self2?.runtime && self2.on) {
                    vm = self2;
                    Function.prototype.bind = orig;
                    window.log('vm trapped');
                    vm.on('PROJECT_LOADED', getAssets);
                    vm.on('PROJECT_LOAD_FAILED', (e)=>{
                        log("loadFailed");
                        log(e);
                    });
                }
                return orig.call(this, self2, ...args);
            };
            async function getAssets() {
                window.log(vm.runtime.gandi.assets);
                vm.updateGandiAssetData('extension.js', fdat);
                clearTimeout(tid);
                setTimeout(async () => {
                    console.error("maybe complete")
                    await window.exit();
                }, 10000);
            }
        }, fdat);
        // Create a new page inside context.
        const page = await context.newPage();
        await page.goto('https://ccw.site/gandi/extension/' + pid);
    })();
} catch (e) {}
