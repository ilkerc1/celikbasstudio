# PROGRESS — celikbasstudio.com

## 2026-11-27 — Daily Orders "App Store’da" + çıkış haberi; Firebase gizlilik metni ayrı dalda (ikisi de CANLI DEĞİL)

İstek: Coffee Stand: Daily Orders oturumu (`local_ba91f4c7…`, sahip onaylı) iki düzeltme gönderdi. Push/merge için sahibe
sorulacak; Firebase metni 1.0.0 (3) onaylanana kadar `main`'e girmez.

### Yapılanlar
- **Dal `feature/daily-orders-live`** (`9e458ca` + bu PROGRESS commit'i), `main`'den: `index.html`
  - Daily Orders kartı "Coming soon" → **"On the App Store / App Store’da"**. Ortak yeni anahtar `appStoreStatus`; Grumpy
    Lift'in `grumpyStatus`'u da buna taşındı. Karar: `dailyStatus` metnini değiştirmek Homedawn/Tiltumi/Mystery/"coming"
    kartlarını da "yayında" yapardı (hepsi bu anahtarı paylaşıyor), o yüzden ayrı anahtar.
  - Karta App Store bağlantısı **eklenmedi**: Grumpy Lift'te üçüncü bağlantı ~1000–1050 px'te alt satırı kaydırıp sırayı
    uzatmıştı (2026-11-22 kararı); yayındaki kartların biçimi = durum hapı + Haberler'de bağlantı.
  - Haberler'e 3. madde: **6 Kasım 2026 — Coffee Stand: Daily Orders App Store’da** (`#news-daily-release`, bağlantı
    `https://apps.apple.com/app/id6830947712`, `news1Link` anahtarını yeniden kullanır; TR `news3*`). Tarih iTunes lookup'tan
    (`releaseDate 2026-11-06T08:00Z`, US + TR mağazada); istekte "7 Kasım" yazıyordu, Apple kaydı esas alındı. Play
    bağlantısı yok (kapalı test). Haberler 3 madde → son kart solda tek (kabul edilmişti).
- **Dal `feature/daily-orders-privacy-firebase`** (`b67e508`, `8029b2f`), `main`'den, **`main`'e birleştirme**:
  `coffee-stand-daily-orders/privacy.html` — EN+TR "Analytics / Analiz (Google Analytics for Firebase)" bölümü (Satın alma'dan
  önce), "analiz hizmeti yok" cümleleri düzeltildi, Android izin cümlesine analiz eklendi, bölüm başlığı "Your progress stays
  on your device / İlerlemeniz cihazınızda kalır", "Updated: 27 November 2026 (analytics)", meta açıklaması (etiket +
  `descriptions` nesnesi). Kaynak: `coffee-stand-daily-orders` deposu `docs/store/site/.../privacy.html`; yalnız Firebase
  kısmı alındı, canlı sayfanın yapısına ve TR "siz" diline uyarlandı.

### Doğrulama
- Yerel (`python3 -m http.server 8780`), yerleşik tarayıcı 1024 px EN/TR: durum hapları Daily Orders + Grumpy "APP STORE’DA",
  diğerleri "YAKINDA"; 8 kart alt satırı 57 px; gizlilik sayfası EN/TR başlık, meta, iki Firebase bölümü, konsol hatası yok.
- Bağımsız kontrol ajanı: kod hatası yok; TR anahtarları tam, `grumpyStatus` kalmadı, bağlantılar doğru oyuna gidiyor,
  EN/TR Firebase içeriği eşit, HTML dengeli. İki metin önerisi (bölüm başlığı, `?hl=tr` tutarlılığı) uygulandı.

### Açık
- **`feature/daily-orders-live`**: sahip onayıyla push → PR → merge (= canlı).
- **`feature/daily-orders-privacy-firebase`**: Daily Orders 1.0.0 (3) yayını onaylanınca `main`'e (gerekirse önce `main`'e
  rebase) ve "Updated" tarihini birleştirme gününe çek. O sürüm mağazaya bu sayfa canlı olmadan çıkmamalı.
- graphify dosyaları (`CLAUDE.md`, `AGENTS.md`, `.claude/`, `.codex/`, `.gitignore`, `.gitattributes`) hâlâ bilerek
  commit'siz (FTP her dosyayı yayınlıyor).

## 2026-11-22 — Ana sayfaya "Haberler" bölümü + Grumpy Lift "App Store’da"; CANLIDA

Kullanıcı: "Yapılan güncelleme diğer haberler için de websitesine bir bölüm aç." Yorum: ana sayfada kalıcı bir haber
bölümü; ilk haberler 20 Kasım güncellemesi (yeni oyunlar) ve doğrulanmış bir çıkış haberi.

### Yapılanlar
- **`index.html` `#news` bölümü** (oyunlar ile stüdyo arasında, "02 / News · Haberler"): `section-head` deseni (#games gibi),
  2 sütunlu `.news-list`, kartlar `.news-item` (tarih `<time datetime>` + etiket hapı + h3 + metin + bağlantı), en yeni üstte.
  1) **20 Kasım 2026 — Grumpy Lift App Store'da** (Çıkış): bağlantı `https://apps.apple.com/app/id6837496098`.
  Doğrulama kaynağı: iTunes lookup API (`releaseDate 2026-11-20T08:00Z`, sürüm 1.0.1, US ve TR mağazasında var) +
  Grumpy Lift `PROGRESS.md` v0.44. Metin: ilk 10 seviye ücretsiz, tek seferlik tam sürüm, reklam/abonelik yok,
  "Android sürümü yolda" (Play'de kapalı test, herkese açık değil). 2) **20 Kasım 2026 — Koleksiyona üç yeni oyun katıldı**
  (Stüdyo): `#grumpy-lift`'e gider; gizli oyun adı verilmeden anılıyor.
  Homedawn haberi bilerek YOK: iOS henüz mağazada değil (lookup boş), Android yalnız kapalı test.
- **Menü**: "News / Haberler" bağlantısı (#news). Bölüm numaraları: stüdyo 02→03, iletişim 03→04 (EN HTML + TR betik).
- **Grumpy Lift kartı**: durum hapı `grumpyStatus` "On the App Store / App Store’da" ("Coming soon" artık yanlıştı).
  Karar: "Out on iOS / iOS’ta çıktı" denendi, TR büyük harfte "İOS" oluyordu → "App Store’da". Karta App Store bağlantısı
  da eklenmişti, ~1000–1050 px'te alt satırı kaydırıp kart sırasını uzattığı için kaldırıldı (bağlantı haberde).
- **`assets/site.css`** "Home: news" bloğu: `.news`, `.news-list`, `.news-item` (`.contact-resource` gibi kart), `.news-meta`
  (`.game-tags` gibi); hap stili `.game-tags span:last-child,.news-meta span` ortak kuralında; metin rengi `--ink-soft`;
  mobil tek sütun + `22px 20px`; forced-colors ve print listelerine `.news-item`. `site.css?v=5` → `v=6` bütün 15 HTML'de.
- `README.md` bölüm listesi: `01 Our games · 02 News · 03 The studio · 04 Contact`.
- **Yeni haber eklemek**: `.news-list`'in en üstüne yeni `<article class="news-item">` kopyala, `data-i18n` anahtarları
  `newsNTitle/Text/Date/Link` ve TR karşılıklarını `translations.tr`'ye ekle; etiket için `newsRelease`/`newsStudio`.
  İki sütun düzeni çift sayıda haberde dengeli; tek kalırsa son kart solda yalnız durur (kabul edilebilir).

### Doğrulama
- Yerel (`python3 -m http.server 8780`), yerleşik tarayıcı: 1280/1024/375 px, EN/TR; yatay kaydırma yok; 8 oyun kartı
  alt satırı 1024 px TR'de hepsi 57 px; TR büyük harfler doğru ("02 / HABERLER", "ÇIKIŞ", "APP STORE’DA").
- Bağımsız kontrol ajanı (ui-consistency:verifying): engelleyici hata yok; 4 tutarlılık bulgusu (kart bağlantısı satır
  kaydırması, kopya hap kuralı, `--text`/`--ink-soft` karışıklığı, yeni `border-top` + işe yaramayan `scroll-margin-top`)
  → hepsi düzeltildi, ölçülerek doğrulandı.
- graphify bu oturumda kuruldu (`graphify-init-project`); ürettiği `.claude/`, `.codex/`, `AGENTS.md`, `CLAUDE.md`,
  `.gitignore`, `.gitattributes` **bilerek commit edilmedi**: `deploy.yml` repodaki her dosyayı FTP ile siteye yüklüyor,
  araç dosyaları celikbasstudio.com'da herkese açık olurdu. Yerelde duruyorlar.

### Açık
- Homedawn iOS'ta yayına çıkınca: Homedawn kartı durumunu güncelle + Haberler'e çıkış haberi ekle (App Store id 6837619790).
- Grumpy Lift Android herkese açık olunca: haberdeki "Android sürümü yolda" cümlesini güncelle ya da yeni haber ekle.
- Repo'da `deploy.yml` her dosyayı yüklüyor (README, PROGRESS dahil). İstenirse FTP adımına hariç tutma listesi eklenebilir.

## 2026-11-21 — Grumpy Lift gizlilik ve destek sayfaları (yerel dal, henüz canlı değil)

Kullanıcı (Grumpy Lift oturumu): gizlilik politikası adresi için "celikbasstudio.com", destek e-postası
`ilker_celikbas@hotmail.com`. Mağaza formları (App Store / Google Play) gizlilik adresini zorunlu istiyor.

### Yapılanlar
- **`grumpy-lift/privacy.html`, `grumpy-lift/support.html`** (yeni): Coffee Stand sayfalarının iskeleti (başlık, sayfa
  menüsü, EN/TR bölümleri, dil betiği, `site.css?v=5`), içerik Grumpy Lift deposundaki `web sitesi/privacy.html` ve
  `support.html`'den (D36 sonrası "veri toplanmıyor" metni; yürürlük 21 Kasım 2026). Destek SSS'leri `<details>` yerine
  sitenin `h3 + p` düzeninde. `theme-color` `#141b19` (kart rengi).
- **`index.html`**: Grumpy Lift kartına Destek / Gizlilik bağlantıları (Coffee Stand kartıyla aynı `game-actions`
  düzeni, `data-localized-href`); "Coming soon" etiketi duruyor.
- `README.md` dosya listesine iki sayfa.

### Doğrulama
- Yerel sunucu (`python3 -m http.server 8781`), yerleşik tarayıcı: iki sayfa EN/TR doğru başlık ve içerik, konsol
  hatası yok; 375 px'te yatay kaydırma yok; ana sayfa kart bağlantıları TR'de `#tr`'ye gidiyor.

### Açık
- Dal `feature/grumpy-lift-pages` yalnız yerelde. Canlıya almak için: push → PR → merge (`deploy.yml` FTP), sahip onayıyla.
- Canlıdan sonra Play Console ve App Store Connect'e `https://celikbasstudio.com/grumpy-lift/privacy.html` girilecek.

## 2026-11-20 — Yeni oyun kartları (Grumpy Lift, Homedawn, Tiltumi); CANLIDA

Kullanıcı: "siteyi güncellemeden yeni oyunları ekle, codex'teki oyunu da gizli oyun olarak tut." Seçilen oyunlar (kullanıcı
seçti): Grumpy Lift, Homedawn, Tiltumi. Codex'te geliştirilen oyun adı verilmeden mevcut **"Mystery game"** kartında kalıyor.
**Repo herkese açık:** o oyunun adını hiçbir dosyaya, commit mesajına ya da PR'a yazma.

### Yapılanlar
- **Repo yerelde**: `ilkerc1/celikbasstudio` → `/Volumes/KIOXIA/Uygulamalar/celikbasstudio` (kullanıcının seçtiği konum).
  Daha önce bu Mac'te hiç klonu yoktu.
- **Yayın akışı**: önce yalnız yerel dal (kullanıcı "siteyi güncellemeden" dedi) → kullanıcı "pushla" → dal push + PR
  [#9](https://github.com/ilkerc1/celikbasstudio/pull/9) → kullanıcı "Merge et, canlıya al" → merge commit `1cb7d2a`
  (`main`). `deploy.yml` FTP koşusu 44666838272 başarılı.
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
- **Canlı** (https://celikbasstudio.com): üç kart, `game-mystery-paired`, "Seven worlds", `site.css?v=5` HTML'de; üç ikon
  200 döndü; `site.css?v=5` yeni kuralları içeriyor; tarayıcıda 7 kart görseli yüklendi, konsol hatası yok.
- Yerel sunucu (`python3 -m http.server 8780`), yerleşik tarayıcı: 1280 px ve 375 px; yatay kaydırma yok (scrollWidth 375);
  EN↔TR geçişi yeni metinleri, alt'ları, başlığı ve meta'yı doğru çeviriyor; konsol hatası yok; Mystery ile Tiltumi görsel
  yükseklikleri eşit (310,8 px), gövde boşlukları eşit.
- Bağımsız kontrol ajanı (ui-consistency:verifying): tek kusur buldu (yukarıdaki seçici özgüllüğü), düzeltildi ve
  ölçülerek doğrulandı. Gizli oyunun adı diff'te yok. "Low contrast" tasarım uyarıları yeni kartlar için yanlış alarm
  (o renkler yalnız lacivert Mystery kartında). Bakılmayanlar: 820–1000 px arası genişlik.

### Açık
- **Tiltumi adı geçici** (Tiltumi README: "pending name clearance"). Ad değişirse kart + dizin + meta + TR metinleri güncellenmeli.
- Grumpy Lift için bu sitede gizlilik/destek sayfaları henüz yok. Hazır taslaklar Grumpy Lift `web sitesi/` klasöründe, ama
  yer tutucular dolu değil ve gizlilik metni Unity IAP veri kararına bağlı (Grumpy Lift PROGRESS v0.27). Mağazaya
  göndermeden önce bu sitede `grumpy-lift/privacy.html` + `support.html` gerekli.
- "New games are on the way" kartının metni ("adları burada görünecek") hâlâ Mystery ve diğer oyunlar için doğru; isterse
  kullanıcı değiştirebilir.
