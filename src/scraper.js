import puppeteer from "puppeteer";
import { writeFileSync, readFileSync, existsSync } from 'fs';

export async function scrapeAds(keyword) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(
        `https://web.facebook.com/ads/library/?active_status=active&ad_type=all&country=ID&is_targeted_country=false&media_type=all&q=${encodeURIComponent(keyword)}&search_type=keyword_unordered&sort_data[direction]=desc&sort_data[mode]=total_impressions`
    );

    //tunggu ads selesai load
    await new Promise(r => setTimeout(r, 8000)); // tunggu 5 detik

    //scroll + scrape sampai gak ada ads baru
    const loadedAds = [];
    if(existsSync('allads.json')) {
        const existing = JSON.parse(readFileSync('allads.json', 'utf-8'));
        loadedAds.push(...existing);
        console.log(`Melanjutkan dari ${loadedAds.length} ads sebelumnya`);
    }

    const allAds = [...loadedAds];
    let noNewAds = 0;
    
    while(noNewAds < 5) {
        //scrape sambil scroll
        const ads = await page.evaluate(() => {
            const result = [];
            const allText = document.querySelectorAll('span');

            allText.forEach(el => {
                const text = el.innerText || '';
                const match = text.match(/^(\d+) ads use this creative and text$/);
                if(match) {
                    const count = parseInt(match[1]);
                    const card = el.parentElement?.parentElement?.parentElement?.parentElement;
                    const cardText = card?.innerText || '';
                    const idMatch = cardText.match(/Library ID:\s*(\d+)/);
                    const link = idMatch
                    ? `https://www.facebook.com/ads/library/?id=${idMatch[1]}`
                    : null;
                    result.push({ count, link })
                }
            });
            return result;
        });

        //cek apakah ada ads baru
        const before = allAds.length;
        ads.forEach(ad => {
            const exist = allAds.find(a => a.link === ad.link);
            if (!exist) allAds.push(ad);
        });
        const after = allAds.length;

        //kalau gak ada ads baru maka tambah counter
        const brandNew = after - before;

if(brandNew === 0 && allAds.length > loadedAds.length) {
    noNewAds++;
} else if(allAds.length <= loadedAds.length) {
    noNewAds = 0;
} else {
    noNewAds = 0;
}

        console.log(`Scroll ke-${noNewAds} | Total: ${allAds.length} | Baru: ${brandNew}`);

        writeFileSync('allads.json', JSON.stringify(allAds, null, 2));
        const filter = allAds.filter(ad => ad.count >= 10);
        writeFileSync('result.json', JSON.stringify(filter, null, 2));

        await page.evaluate(() => window.scrollBy(0, 3000));
        await new Promise(r => setTimeout(r, 3000));
    }

    await browser.close();
    return allAds;
}