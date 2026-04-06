import puppeteer from "puppeteer";

export async function scrapeAds(keyword) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(
        `https://web.facebook.com/ads/library/?active_status=active&ad_type=all&country=ID&is_targeted_country=false&media_type=all&q=${encodeURIComponent(keyword)}&search_type=keyword_unordered&sort_data[direction]=desc&sort_data[mode]=total_impressions`
    );

    //tunggu ads selesai load
    await new Promise(r => setTimeout(r, 8000)); // tunggu 5 detik

    //scroll beberapa kali agar lebih banyak ads yg di load
    for (let i = 0; i < 15; i++) {
        await page.evaluate(() => window.scrollBy(0, 3000));
        await new Promise(r => setTimeout(r, 2500));
    }

    //ambil data ads 
    const ads = await page.evaluate(() => {
        const result = [];
        //cari semua elemen yang ada tulisan "ads use this creative"
        const allText = document.querySelectorAll('span');

        allText.forEach(el => {
            const text = el.innerText || '';
            const match = text.match(/^(\d+) ads use this creative and text$/);
            if (match) {
                const count = parseInt(match[1]);
    const card = el.parentElement?.parentElement?.parentElement?.parentElement;
    const cardText = card?.innerText || '';
    const idMatch = cardText.match(/Library ID:\s*(\d+)/);
    const link = idMatch 
        ? `https://www.facebook.com/ads/library/?id=${idMatch[1]}` 
        : null;
    result.push({ count, link });
            }
        });

        return result;
    });

    await browser.close();
    return ads;
}