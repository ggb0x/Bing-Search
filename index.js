

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

async function isSearchSuccessful(page) {
    try {
        await page.waitForSelector('#b_results li.b_algo', { timeout: 5000 });
        return true;
    } catch (error) {
        return false;
    }
}

async function isCaptchaPresent(page) {
    const captchaSelectors = [
        'div.captcha',
        '[id^=captcha]',
        '[class^=captcha]',
        'iframe[src*="captcha"]',
        '#b_header > div.captcha',
        '#recaptcha',
        'iframe[title*="reCAPTCHA"]'
    ];

    for (const selector of captchaSelectors) {
        if (await page.$(selector)) {
            return true;
        }
        // Check inside iframes
        for (const frame of page.frames()) {
            if (await frame.$(selector)) {
                return true;
            }
        }
    }
    return false;
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

                await page.waitForLoadState('domcontentloaded');

                if (await isSearchSuccessful(page)) {
                    console.log("Pesquisa concluída com sucesso.");
                    const delay = Math.random() * 5000 + 5000;
                    console.log(`Aguardando ${(delay / 1000).toFixed(1)} segundos...`);
                    await sleep(delay);
                    success = true;
                    break;
                } else if (await isCaptchaPresent(page)) {
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
                    // After user confirmation, we assume captcha is solved and retry the search
                    console.log("Retentando a pesquisa após resolução do captcha...");
                    continue; // a new attempt will start
                } else {
                    console.log("Não foi possível confirmar o sucesso da pesquisa nem a presença de um captcha. Tentando novamente...");
                    throw new Error("Unknown state");
                }

            } catch (error) {
                console.error(`Erro na tentativa ${attempt} ao pesquisar por "${term}":`, error.message);
                if (attempt < 3) {
                    console.log("Tentando novamente...");
                    await sleep(2000); // Wait 2 seconds before retrying
                } else {
                    console.error(`Falha ao pesquisar por "${term}" após 3 tentativas.`);
                }
            }
        }
        if (!success) {
            console.error(`Não foi possível concluir a pesquisa para o termo "${term}". Passando para o próximo.`);
        }
    }

    console.log("\nAutomação concluída! Todas as pesquisas foram realizadas.");
    await browserContext.close();
})();
