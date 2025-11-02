import { chromium } from 'playwright';

// function getVM(vm){
//     console.log(vm)
// }

(async () => {
    const browser = await chromium.launch();
    // Create pages, interact with UI elements, assert values
    const context = await browser.newContext();
    // Create a new page inside context.
    const page = await context.newPage();
    await page.goto('https://ccw.site/gandi');
    console.log(await page.evaluate(()=>{
        const ul = document.querySelector('.gandi_vertical-bar_bar_Tsvpu').firstChild
        return ul.children[2].innerHTML
    }))
    // Dispose context once it's no longer needed.
    await context.close();
    await browser.close();
})();
