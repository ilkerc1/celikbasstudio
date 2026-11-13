# Celikbas Studio — Official Website (`celikbasstudio.com`)

**Celikbas Studio** resmi çift dilli (İngilizce & Türkçe) web sitesi. Bu repo, canlı sitenin birebir kopyasıdır (13 Kasım 2026 itibarıyla).

Oyunlar: **Prizmic**, **Ravel**, **The Coffee Stand**, **Coffee Stand: Daily Orders**.

## Dosya Yapısı

Her sayfa tek dosyadır: CSS, JS ve görseller HTML içine gömülüdür.

- [`index.html`](./index.html) — Ana stüdyo sayfası (`01 Our games` · `02 The studio` · `03 Contact`)
- [`terms.html`](./terms.html) — Kullanım Koşulları
- [`prizmic/privacy.html`](./prizmic/privacy.html) — Prizmic gizlilik ve destek
- [`ravel/index.html`](./ravel/index.html) — Ravel oyun sayfası
- [`ravel/privacy.html`](./ravel/privacy.html) · [`ravel/support.html`](./ravel/support.html) · [`ravel/terms.html`](./ravel/terms.html)
- [`coffee-stand/privacy.html`](./coffee-stand/privacy.html) · [`coffee-stand/support.html`](./coffee-stand/support.html)
- [`coffee-stand-daily-orders/privacy.html`](./coffee-stand-daily-orders/privacy.html) · [`coffee-stand-daily-orders/support.html`](./coffee-stand-daily-orders/support.html)
- [`app-ads.txt`](./app-ads.txt) — Google AdMob yetkili satıcı doğrulama dosyası
- [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) — `main` dalına her `push` yapıldığında dosyaları FTP ile `celikbasstudio.com` sunucusuna yükler
