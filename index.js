

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Path to store browser session data (cookies, local storage, etc.)
// This allows you to log in once and stay logged in.
const userDataDir = path.join(__dirname, 'user_data');

// Function to introduce a random delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to wait for manual captcha solving
function waitForCaptcha() {
    return new Promise(resolve => {
        console.log("Por favor, resolva o captcha manualmente no navegador.");
        console.log("Pressione Enter no terminal quando o captcha for resolvido para continuar...");
        process.stdin.resume();
        process.stdin.once('data', () => {
            process.stdin.pause();
            resolve();
        });
    });
}

(async () => {
    console.log("Iniciando a automação de pesquisa do Bing...");

    // Launch the browser with a persistent context
    const browserContext = await chromium.launchPersistentContext(userDataDir, {
        headless: false, // Set to false to see the browser UI
        slowMo: 50,      // Slows down Playwright operations by 50ms to be more human-like
    });

    const page = await browserContext.newPage();

    // Read search terms from the file
    const searchTerms = fs.readFileSync('search_terms.txt', 'utf-8').split('\n').filter(Boolean);

    console.log(`Encontrados ${searchTerms.length} termos para pesquisar.`);

    for (let i = 0; i < searchTerms.length; i++) {
        const term = searchTerms[i];
        console.log(`Pesquisando por (${i + 1}/${searchTerms.length}): "${term}"`);

        let success = false;
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                await page.goto('https://www.bing.com');
                await page.waitForSelector('textarea[name="q"]');
                await page.fill('textarea[name="q"]', term);
                await page.press('textarea[name="q"]', 'Enter');

                // Wait for search results to load OR for a captcha
                await Promise.race([
                    page.waitForSelector('#b_results', { timeout: 8000 }),
                    page.waitForSelector('#captcha_title', { timeout: 8000 }),
                    page.waitForSelector('iframe[title="Cloudflare"]', { timeout: 8000 }),
                    page.waitForSelector('iframe[title="hCaptcha"]', { timeout: 8000 }),
                ]);

                const pageTitle = await page.title();
                const isCloudflare = pageTitle.includes('Attention Required! | Cloudflare');
                const isCaptcha = await page.$('#captcha_title, iframe[title="Cloudflare"], iframe[title="hCaptcha"]');

                if (isCloudflare || isCaptcha) {
                    await waitForCaptcha();
                }


                // Add a random delay between 5 to 10 seconds before the next search
                const delay = Math.random() * 5000 + 5000;
                console.log(`Pesquisa concluída. Aguardando ${(delay / 1000).toFixed(1)} segundos...`);
                await sleep(delay);

                success = true;
                break; // Exit the retry loop on success

            } catch (error) {
                console.error(`Erro na tentativa ${attempt} ao pesquisar por "${term}":`, error.name);
                if (attempt < 3) {
                    console.log("Tentando novamente...");
                    await sleep(2000); // Wait 2 seconds before retrying
                } else {
                    console.error(`Falha ao pesquisar por "${term}" após 3 tentativas.`);
                }
            }
        }
    }

    console.log("\nAutomação concluída! Todas as pesquisas foram realizadas.");
    await browserContext.close();
})();
