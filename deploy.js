import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    // Create pages, interact with UI elements, assert values
    const context = await browser.newContext();
    // Create a new page inside context.
    const page = await context.newPage();
    await page.goto('https://ccw.site/gandi');
    // Dispose context once it's no longer needed.
    await context.close();
    await browser.close();
})();
