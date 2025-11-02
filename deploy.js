import { chromium } from 'playwright';
import fs from 'fs'
// function getVM(vm){
//     console.log(vm)
// }
const pid=process.env.PROJECT_ID
const token=process.env.CCW_TOKEN||"000000000000000063c2807d669fa967f17f0000"
const uid=token.slice(16)
console.log("deploy to Project:",pid);
console.log("using uid:",uid);
try{
(async () => {
    const browser = await chromium.launch();
    // Create pages, interact with UI elements, assert values
    const context = await browser.newContext();
    await context.addCookies([
        {
            name:"token",
            value:token,
            domain:".ccw.site",
            path:"/",
            httpOnly:true
        },
        {
            name:"cookie-user-id",
            value:uid,
            domain:".ccw.site",
            path:"/"
        },
    ]);
    await context.exposeFunction('log', (...dat) => {
        console.log(...dat)
    });
    await context.exposeFunction('getExt', (...dat) => fs.readFileSync("public/dist/extension.global.js"));
    await context.exposeFunction('exit', async(ext) => {
        console.log("exit")
        fs.writeFileSync("public/tmp.html",ext)
        await page.screenshot({path:"public/shot.png"});
        await page.close()
        await context.close()
        await browser.close();
        console.log("exited")
        throw new Error("exited")
    });
    context.addInitScript(()=>{
        console.log=console.warn=console.error=log
        window.onerror = function(message, source, lineno, colno, error) {
            console.error(`Error: ${message} at ${source}:${lineno}:${colno}`);
            // 进一步的处理逻辑
            return true; // 阻止默认的错误处理
        };
        let vm;
        const tid = setTimeout(()=>window.exit(document.body.innerHTML),20000)
        const orig=Function.prototype.bind
        Function.prototype.bind=function(self2,...args){
            if(self2?.runtime && self2.on){
                vm=self2
                Function.prototype.bind=orig
                window.log("vm trapped")
                vm.on("PROJECT_LOADED",getAssets)
                vm.on("PROJECT_LOAD_FAILED",log)
            }
            return orig.call(this,self2,...args)
        }
        function getAssets(){
            window.log(vm.runtime.gandi.assets)
            vm.updateGandiAssetData("extension.js",getExt())
            document.querySelector(".gandi_save-controller_controller_AGp8k").click()
            clearTimeout(tid)
            setTimeout(()=>window.exit().then(),5000)
        }
    })
    // Create a new page inside context.
    const page = await context.newPage();
    await page.goto('https://ccw.site/gandi/extension/'+pid);
    await page.screenshot({path:"public/shot1.png"});
    // Dispose context once it's no longer needed.
})();
}
catch(e){
}