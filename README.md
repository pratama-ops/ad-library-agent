# Ad Library Agent

Agent otomatis untuk mendeteksi iklan yang diduplikasi di Meta Ad Library.

## Cara Kerja

1. Puppeteer membuka Meta Ad Library secara otomatis
2. Search berdasarkan keyword yang ditentukan
3. Scroll halaman untuk load lebih banyak iklan
4. Deteksi iklan yang memiliki tulisan "X ads use this creative and text"
5. Filter iklan yang duplikatnya >= 15
6. Output berupa link langsung ke Ad Library

## Tech Stack

- Node.js
- Puppeteer
- Gemini AI (coming soon)

## Instalasi
```bash
npm install
```

## Cara Pakai

Ganti keyword di `app.js`:
```js
const keyword = 'skincare';
```

Lalu jalankan:
```bash
node index.js
```

## Output
Total ditemukan: 36 ads
Yang duplikat >= 15: 1 ads
[
{
count: 25,
link: 'https://www.facebook.com/ads/library/?id=...'
}
]

## Roadmap

- [ ] Input keyword dari terminal tanpa edit kode
- [ ] Integrasi Gemini AI untuk analisis konten iklan
- [ ] Scheduler otomatis tiap X jam
- [ ] Notifikasi hasil ke Telegram
- [ ] Agent generate keyword sendiri (fully autonomous)