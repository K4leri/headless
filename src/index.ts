import { Hono } from 'hono'
import { serve, type HttpBindings  } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import puppeteer from 'puppeteer';


const app = new Hono()
app.use(serveStatic({ 
    root: './static', 
    // path: './static' 
}));

// app.get('*', (c) => c.html(htmlString));

const port = 3000;
serve({
    fetch: app.fetch,
    port: port,
})

console.log(
    `Hono running at http://localhost:${port}`
);



// Launch the browser and open a new blank page
const browser = await puppeteer.launch({
    // headless: false,
    // dumpio: true,
});
const page = await browser.newPage();

// Navigate the page to a URL.
await page.setViewport({width: 1080, height: 1024});
page.on('console', msg => console.log('PAGE LOG:', msg.text()));
await page.goto('http://localhost');
// await page.evaluate(() => console.log(`url is ${location.href}`));
await new Promise(resolve => setTimeout(resolve, 5000));

await browser.close();