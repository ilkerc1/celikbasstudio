# PROGRESS — celikbasstudio.com

## 2026-11-20 — Yeni oyun kartları (Grumpy Lift, Homedawn, Tiltumi); canlıya ÇIKMADI

Kullanıcı: "siteyi güncellemeden yeni oyunları ekle, codex'teki oyunu da gizli oyun olarak tut." Seçilen oyunlar (kullanıcı
seçti): Grumpy Lift, Homedawn, Tiltumi. Codex'te geliştirilen oyun adı verilmeden mevcut **"Mystery game"** kartında kalıyor.
**Repo herkese açık:** o oyunun adını hiçbir dosyaya, commit mesajına ya da PR'a yazma.

### Yapılanlar
- **Repo yerelde**: `ilkerc1/celikbasstudio` → `/Volumes/KIOXIA/Uygulamalar/celikbasstudio` (kullanıcının seçtiği konum).
  Daha önce bu Mac'te hiç klonu yoktu.
- **Dal `feature/new-games-cards`** (`56c7cf9`), GitHub'a gönderildi, PR #9. `main`'e merge YOK: `.github/workflows/deploy.yml` her `main`
  push'unda FTP ile canlıya yüklüyor; kullanıcı "siteyi güncellemeden" dedi. Dal push'u deploy etmez ama kullanıcı
  onayı olmadan o da yapılmadı (yayınlanmamış oyun adları herkese açık repoya düşer).
- **`index.html`**: 3 yeni kart (`#grumpy-lift`, `#homedawn`, `#tiltumi`), Daily Orders'tan sonra ve Mystery'den önce.
  Mevcut kartlarla aynı yapı: `data-i18n` metinler + TR karşılıkları betikteki `translations.tr` içinde, `data-i18n-alt`,
  durum etiketi "Coming soon" (`dailyStatus` anahtarı yeniden kullanıldı), alt satırda tür + `iOS / Android`.
  Oyun sayfası/gizlilik/destek bağlantısı YOK (henüz bu sitede sayfaları yok). Üstteki oyun dizinine 3 bağlantı eklendi
  (4 sütunlu ızgarada 4+3 diziliyor). Kart numaraları `/ 04` → `/ 07`; "Four/Dört" → "Seven/Yedi" (dizin alt başlığı +
  bölüm başlığı); EN meta açıklaması ve TR açıklama yeni oyunları sayıyor.
- **Mystery kartı** `game-mystery-paired` sınıfıyla tam satır yerine Tiltumi'nin yanında ikinci sütunda (7 kart tek sayı,
  yoksa Tiltumi'nin yanı boş kalıyordu). Mobilde zaten tek sütun.
- **`assets/site.css`**: `.game-grumpy/.game-homedawn/.game-tiltumi` `--visual` renkleri (`#141b19`, `#0b4450`,
  `#f58c38`); `.game-visual-icon` = kare uygulama ikonunu kart görselinde ortalı, yuvarlak köşeli gösterir (diğer kartlarda
  logo ortada nefes alıyor, ikonlar tam boy kaplıyordu); `.game-mystery.game-mystery-paired …` kuralları (iki sınıflı
  seçici şart, yoksa eski `.game-mystery …` kuralları sonra geldiği için kazanıyor — bağımsız kontrol yakaladı).
  `site.css?v=4` → `v=5` bütün 11 HTML'de (README kuralı).
- **Görseller** `assets/img/`: `grumpy-lift-icon.png` (Grumpy Lift `unity/Assets/Branding/icon-1024.png`),
  `homedawn-icon.webp` (Homedawn `Assets/Homedawn/Branding/app_icon.png`), `tiltumi-icon.webp`
  (Tiltumi `UnityProject/Assets/CargoBalance/Content/Brand/AppIcon.png`); 512 px, `sips` + `cwebp -q 86`.
- Metinler oyunların kendi kaynaklarından: Grumpy Lift `web sitesi/index.html` + `docs/store/listing.md`, Homedawn
  `AGENTS.md`, Tiltumi `README.md`.
- `README.md` oyun listesi güncellendi.

### Doğrulama
- Yerel sunucu (`python3 -m http.server 8780`), yerleşik tarayıcı: 1280 px ve 375 px; yatay kaydırma yok (scrollWidth 375);
  EN↔TR geçişi yeni metinleri, alt'ları, başlığı ve meta'yı doğru çeviriyor; konsol hatası yok; Mystery ile Tiltumi görsel
  yükseklikleri eşit (310,8 px), gövde boşlukları eşit.
- Bağımsız kontrol ajanı (ui-consistency:verifying): tek kusur buldu (yukarıdaki seçici özgüllüğü), düzeltildi ve
  ölçülerek doğrulandı. Gizli oyunun adı diff'te yok. "Low contrast" tasarım uyarıları yeni kartlar için yanlış alarm
  (o renkler yalnız lacivert Mystery kartında). Bakılmayanlar: 820–1000 px arası genişlik.

### Açık
- **Dal GitHub'da, PR açık:** https://github.com/ilkerc1/celikbasstudio/pull/9 (kullanıcı "pushla" dedi, 2026-11-20).
  CI kontrolü yok, birleştirilebilir (CLEAN). **Canlıya almak = PR'ı `main`'e merge etmek**; kullanıcı onayı bekleniyor.
- **Tiltumi adı geçici** (Tiltumi README: "pending name clearance"). Ad değişirse kart + dizin + meta + TR metinleri güncellenmeli.
- Grumpy Lift için bu sitede gizlilik/destek sayfaları henüz yok. Hazır taslaklar Grumpy Lift `web sitesi/` klasöründe, ama
  yer tutucular dolu değil ve gizlilik metni Unity IAP veri kararına bağlı (Grumpy Lift PROGRESS v0.27). Mağazaya
  göndermeden önce bu sitede `grumpy-lift/privacy.html` + `support.html` gerekli.
- "New games are on the way" kartının metni ("adları burada görünecek") hâlâ Mystery ve diğer oyunlar için doğru; isterse
  kullanıcı değiştirebilir.
