

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
        slowMo: 100,      // Slows down Playwright operations by 100ms to be more human-like
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
                await page.type('textarea[name="q"]', term, { delay: 100 });
                await page.press('textarea[name="q"]', 'Enter');

                // Wait for navigation to complete
                await page.waitForLoadState('domcontentloaded');

                const captchaSelectors = [
                    'div.captcha',
                    '[id^=captcha]',
                    '[class^=captcha]',
                    'iframe[src*="captcha"]',
                    '#b_header > div.captcha',
                ];

                let isCaptcha = false;
                for (const selector of captchaSelectors) {
                    if (await page.$(selector)) {
                        isCaptcha = true;
                        break;
                    }
                }

                if (isCaptcha) {
                    console.log("Captcha encontrado.");
                    console.log("Por favor, resolva o captcha manualmente no navegador.");
                    console.log("Pressione Enter no terminal quando o captcha for resolvido para continuar...");

                    await new Promise(resolve => {
                        process.stdin.resume();
                        process.stdin.once('data', () => {
                            process.stdin.pause();
                            resolve();
                        });
                    });

                    console.log("Verificando se o captcha foi resolvido...");
                    await page.waitForFunction(() => {
                        const captchaSelectors = [
                            'div.captcha',
                            '[id^=captcha]',
                            '[class^=captcha]',
                            'iframe[src*="captcha"]',
                            '#b_header > div.captcha',
                        ];
                        for (const selector of captchaSelectors) {
                            if (document.querySelector(selector)) {
                                return false;
                            }
                        }
                        return true;
                    }, {}, { timeout: 10000 });
                    console.log("Captcha resolvido. Retomando a automação.");
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
