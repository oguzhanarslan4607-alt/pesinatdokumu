# Peşinat Takip ve Raporlama

Statik React/Firebase uygulaması. Peşinat kayıtları, makbuz çıktısı, Excel/JSON yedekleme, ofis/personel raporları ve PWA kurulumu içerir.

## Çalıştırma

Bu proje statik dosyalardan oluşur. Yerelde hızlı deneme için klasörde bir statik sunucu açabilirsiniz:

```bash
python -m http.server 8080
```

Ardından `http://localhost:8080` adresini açın.

## Güvenlik

Admin yetkisi yalnızca arayüzde saklanmaz; `firestore.rules` dosyası da aynı admin e-posta listesini sunucu tarafında zorunlu kılar. Kurallar deploy edilmeden istemci tarafındaki kontroller tek başına yeterli değildir.

Kuralları Firebase'e göndermek için:

```bash
firebase deploy --only firestore:rules
```

## Makbuz Numarası

Yeni kayıt sırasında makbuz numarası Firestore transaction ile `_meta/receiptCounter` dokümanından üretilir. Böylece iki kullanıcı aynı anda kayıt girse bile aynı makbuz numarası verilmez. Silinen veya iptal edilen kayıtların numarası tekrar kullanılmaz.

## Yedekleme

JSON restore işlemi artık:

- yönetici yetkisi ister,
- zorunlu alanları ve tutarın pozitif olmasını kontrol eder,
- mevcut veya yedek içindeki tekrar eden makbuz numaralarını reddeder,
- import sonrası makbuz sayacını en yüksek numaraya taşır.
