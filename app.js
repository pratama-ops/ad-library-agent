import { scrapeAds } from "./src/scraper.js";

const keyword = 'COD';
console.log(`Searching ads for: ${keyword}`);

process.on('SIGINT', () => {
    console.log('\nDihentikan! Memproses data yang sudah terkumpul...');
    process.exit(0);
});

const ads = await scrapeAds(keyword);
const filtered = ads.filter(ad => ad.count >= 15);

console.log(`Total ditemukan: ${ads.length} ads`);
console.log(`Yang duplikat >= 15: ${filtered.length} ads`);
console.log(filtered);