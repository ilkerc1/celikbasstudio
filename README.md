# Çelikbaş Studio — Official Website (`celikbasstudio.com`)

Çelikbaş Studio ve amiral gemisi mobil bulmaca oyunu **Mind Nook** için hazırlanan çift dilli (Türkçe & İngilizce) resmi stüdyo web sitesi.

## Dosya Yapısı

- [`index.html`](./index.html) — Ana stüdyo sayfası, **Mind Nook** 7 bulmaca vitrini ve tarayıcıda oynanabilir **3×3 Seramik Kaydırma** mini oyunu
- [`styles.css`](./styles.css) — Sıcak, dokunsal (tactile) tasarım sistemi ve mobil uyumlu stiller
- [`app.js`](./app.js) — Türkçe / İngilizce dil geçişi (`EN` / `TR`), bulmaca filtreleme ve etkileşimli mini oyun motoru
- [`privacy.html`](./privacy.html) — Çift dilli Gizlilik Politikası (App Store & Google Play uyumlu)
- [`terms.html`](./terms.html) — Çift dilli Kullanım Koşulları (Terms of Service)
- [`app-ads.txt`](./app-ads.txt) — Google AdMob yetkili satıcı doğrulama dosyası (`pub-4989376161902568`)
- [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) — GitHub'a her `push` yapıldığında `celikbasstudio.com` FTP sunucusuna otomatik yükleme yapan iş akışı

---

## GitHub'dan `celikbasstudio.com` Sunucusuna Otomatik FTP Kurulumu

Bu depoya yapılan her güncellemenin **FileZilla açmanıza gerek kalmadan** otomatik olarak `celikbasstudio.com` sunucunuza yüklenmesi için GitHub'da bir kez şu 3 bilgiyi tanımlamanız yeterlidir:

1. GitHub'da **`ilkerc1/celikbasstudio`** sayfasına gidin.
2. Üst menüden **Settings** > sol menüden **Secrets and variables** > **Actions** sayfasına tıklayın.
3. **New repository secret** butonuna tıklayarak şu 3 kaydı ekleyin:
   - **`FTP_SERVER`**: `ftp.celikbasstudio.com` (veya `celikbasstudio.com`)
   - **`FTP_USERNAME`**: Hosting FTP kullanıcı adınız
   - **`FTP_PASSWORD`**: Hosting FTP şifreniz
   - *(İsteğe bağlı)* **`FTP_SERVER_DIR`**: Varsayılan olarak `./public_html/` klasörüne yükler. Eğer FTP kullanıcınız doğrudan site ana dizinine bağlanıyorsa `./` veya Plesk kullanıyorsanız `./httpdocs/` yazabilirsiniz.
