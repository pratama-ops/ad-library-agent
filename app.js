import { scrapeAds } from "./src/scraper.js";

const keyword = 'cod';
console.log(`Searching ads for: ${keyword}`);

const ads = await scrapeAds(keyword);
const filtered = ads.filter(ad => ad.count >= 15);

console.log(`Total ditemukan: ${ads.length} ads`);
console.log(`Yang duplikat >= 15: ${filtered.length} ads`);
console.log(filtered);