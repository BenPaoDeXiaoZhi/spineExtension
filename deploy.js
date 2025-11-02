import { chromium } from 'playwright';

// function getVM(vm){
//     console.log(vm)
// }
const pid=process.env.PROJECT_ID
const token=process.env.CCW_TOKEN||"000000000000000063c2807d669fa967f17f0000"
const uid=token.slice(16)
console.log("deploy to Project:",pid);
console.log("using uid:",uid);
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
            httpOnly:true,
            secure:true
        },
        {
            name:"cookie_user_id",
            value:uid,
            domain:".ccw.site",
            path:"/"
        },
    ]);
    await context.exposeFunction('log', (...dat) => {
        console.log(...dat)
    });
    await context.exposeFunction('exit', async() => {
        console.log("exit")
        await page.screenshot({path:"./public/shot.png"});
        await page.close()
        await context.close()
        await browser.close();
    });
    context.addInitScript(()=>{
        let vm;
        setTimeout(window.exit,5000)
        const orig=Function.prototype.bind
        Function.prototype.bind=function(self2,...args){
            if(self2?.runtime){
                window.log("vm trapped")
                vm=self2
                vm.on("PROJECT_LOADED",getAssets)
                Function.prototype.bind=orig
            }
            return orig.call(this,self2,...args)
        }
        async function getAssets(){
            window.log(vm.runtime.gandi.assets)
            await window.exit()
        }
    })
    // Create a new page inside context.
    const page = await context.newPage();
    await page.goto('https://ccw.site/gandi/extension/'+pid);
    await page.screenshot({path:"./public/shot1.png"});
    // Dispose context once it's no longer needed.
})();
