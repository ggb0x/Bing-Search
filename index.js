

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

        try {
            await page.goto('https://www.bing.com');
            await page.waitForSelector('textarea[name="q"]');
            await page.fill('textarea[name="q"]', term);
            await page.press('textarea[name="q"]', 'Enter');
            
            // Wait for search results to load
            await page.waitForSelector('#b_results'); 

            // Add a random delay between 5 to 10 seconds before the next search
            const delay = Math.random() * 5000 + 5000; 
            console.log(`Pesquisa concluída. Aguardando ${(delay / 1000).toFixed(1)} segundos...`);
            await sleep(delay);

        } catch (error) {
            console.error(`Erro ao pesquisar por "${term}":`, error);
            // Optional: decide if you want to stop or continue on error
        }
    }

    console.log("\nAutomação concluída! Todas as pesquisas foram realizadas.");
    await browserContext.close();
})();
