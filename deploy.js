import { firefox } from 'playwright';
import fs from 'fs'
// function getVM(vm){
//     console.log(vm)
// }
const pid=process.env.PROJECT_ID
const token=process.env.CCW_TOKEN||"000000000000000063c2807d669fa967f17f0000"
const uid=token.slice(16)
console.log("deploy to Project:",pid);
console.log("using uid:",uid);
(async () => {
    const browser = await firefox.launch();
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
    await context.exposeFunction('exit', async(ext) => {
        console.log("exit")
        fs.writeFileSync("public/tmp.html",ext)
        await page.screenshot({path:"public/shot.png"});
        await page.close()
        await context.close()
        await browser.close();
    });
    context.addInitScript(()=>{
        console.log=console.warn=console.error=log
        let vm;
        setTimeout(()=>window.exit(document.body.innerHTML),20000)
        const orig=Function.prototype.bind
        Function.prototype.bind=function(self2,...args){
            if(self2?.runtime){
                window.log("vm trapped")
                vm=self2
                log(vm.runtime)
                Function.prototype.bind=orig
            }
            return orig.call(this,self2,...args)
        }
        function getAssets(){
            window.log(vm.runtime.gandi.assets)
            window.exit()
        }
    })
    // Create a new page inside context.
    const page = await context.newPage();
    await page.goto('https://ccw.site/gandi/extension/'+pid);
    await page.screenshot({path:"public/shot1.png"});
    // Dispose context once it's no longer needed.
})();
