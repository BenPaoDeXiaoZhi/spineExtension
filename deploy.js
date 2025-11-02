import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    // Create pages, interact with UI elements, assert values
    const context = await browser.newContext();
    // Create a new page inside context.
    const page = await context.newPage();
    await page.goto('https://ccw.site/gandi');
    const log=console.log
    const vm = await page.evaluate(() => {
        log(document.body)
        return new Promise((resolve,reject)=>{
            setTimeout(()=>reject,20000)
            const orig = Function.prototype.bind
            window.vm=null
            Function.prototype.bind = function(self2,...args){
                if(
                    typeof self2=="object" && 
                    self2 !== null && 
                    self2.hasOwnProperty("runtime")
                    ){
                        Function.prototype.bind=orig
                        resolve(self2)
                    }
                    return orig.call(this,self2,...args)
            }
        })
    }).then((vm)=>vm);
    console.log(vm)
    // Dispose context once it's no longer needed.
    await context.close();
    await browser.close();
})();
