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
const date = new Date(); // UTC 时间

// 转换为特定时区
const options = { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
const formattedDate = new Intl.DateTimeFormat('zh-CN', options).format(date);
try{
(async () => {
    const browser = await chromium.launch();
    // Create pages, interact with UI elements, assert values
    const context = await browser.newContext();
    let fdat=fs.readFileSync("public/dist/extension.global.js","utf8")
    fdat = `
/*
 - Deploy time: ${formattedDate}
*/
`+fdat
    console.log(fdat)
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
    await context.exposeFunction('exit', async(ext="") => {
        console.log("exit")
        fs.writeFileSync("public/tmp.html",ext)
        await page.screenshot({path:"public/shot.png"});
        await page.close()
        await context.close()
        await browser.close();
        console.log("exited")
        throw new Error("exited")
    });
    context.addInitScript((fdat)=>{
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
        async function getAssets(){
            window.log(vm.runtime.gandi.assets)
            vm.updateGandiAssetData("extension.js",fdat)
            setTimeout(()=>document.querySelector(".gandi_save-controller_controller_AGp8k").click(),500)
            clearTimeout(tid)
            setTimeout(async()=>{await window.exit()},6000)
        }
    },fdat)
    // Create a new page inside context.
    const page = await context.newPage();
    await page.goto('https://ccw.site/gandi/extension/'+pid);
    await page.screenshot({path:"public/shot1.png"});
    // Dispose context once it's no longer needed.
})();
}
catch(e){
}