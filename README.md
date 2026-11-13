# Celikbas Studio — Official Website (`celikbasstudio.com`)

**Celikbas Studio** resmi çift dilli (İngilizce & Türkçe) web sitesi. Bu repo sitenin kaynağıdır; `main` dalı canlı siteye otomatik yayınlanır.

Oyunlar: **Prizmic**, **Ravel**, **The Coffee Stand**, **Coffee Stand: Daily Orders**.

## Dosya Yapısı

Derleme adımı yoktur; dosyalar olduğu gibi yayınlanır.

- [`index.html`](./index.html) — Ana stüdyo sayfası (`01 Our games` · `02 The studio` · `03 Contact`)
- [`terms.html`](./terms.html) — Kullanım Koşulları
- [`prizmic/privacy.html`](./prizmic/privacy.html) — Prizmic gizlilik ve destek
- [`ravel/index.html`](./ravel/index.html) — Ravel oyun sayfası
- [`ravel/privacy.html`](./ravel/privacy.html) · [`ravel/support.html`](./ravel/support.html) · [`ravel/terms.html`](./ravel/terms.html)
- [`coffee-stand/privacy.html`](./coffee-stand/privacy.html) · [`coffee-stand/support.html`](./coffee-stand/support.html)
- [`coffee-stand-daily-orders/privacy.html`](./coffee-stand-daily-orders/privacy.html) · [`coffee-stand-daily-orders/support.html`](./coffee-stand-daily-orders/support.html)
- [`assets/site.css`](./assets/site.css) — Tüm sayfaların ortak tasarımı. Renkler dosyanın başındaki `:root` bloğundadır.
- [`assets/img/`](./assets/img) — Logo, oyun ikonları ve görseller
- [`assets/fonts/`](./assets/fonts) — Fraunces ve Figtree yazı tipleri (SIL Open Font License)
- [`app-ads.txt`](./app-ads.txt) — Google AdMob yetkili satıcı doğrulama dosyası
- [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) — `main` dalına her `push` yapıldığında dosyaları FTP ile `celikbasstudio.com` sunucusuna yükler

Dil geçişi (EN / TR) ve çeviriler her sayfanın sonundaki `<script>` bloğundadır.

`assets/site.css` değiştiğinde sayfalardaki `site.css?v=1` sürüm numarasını artırın; aksi halde ziyaretçiler eski stili önbellekten görebilir.
