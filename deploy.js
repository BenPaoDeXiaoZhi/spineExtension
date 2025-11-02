import { chromium } from 'playwright';

// function getVM(vm){
//     console.log(vm)
// }

(async () => {
    const browser = await chromium.launch();
    // Create pages, interact with UI elements, assert values
    const context = await browser.newContext();
    await context.exposeFunction('emitVM', async(vm) => {
        console.log(vm.runtime.gandi)
        await context.close();
        await browser.close();
    });
    context.addInitScript(()=>{
        const orig=Function.prototype.bind
        Function.prototype.bind=function(self2,...args){
            if(self2?.runtime) window.emitVM(self2)
            return orig.call(this,self2,...args)
        }
    })
    // Create a new page inside context.
    const page = await context.newPage();
    await page.goto('https://ccw.site/gandi');
    // Dispose context once it's no longer needed.
})();
