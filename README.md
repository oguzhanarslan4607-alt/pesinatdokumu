# Peşinat Takip ve Raporlama

Statik React/Firebase uygulaması. Peşinat kayıtları, makbuz çıktısı, Excel/JSON yedekleme, ofis/personel raporları ve PWA kurulumu içerir.

## Çalıştırma

Bu proje statik dosyalardan oluşur. Yerelde hızlı deneme için klasörde bir statik sunucu açabilirsiniz:

```bash
python -m http.server 8080
```

Ardından `http://localhost:8080` adresini açın.

## Güvenlik

Admin yetkisi yalnızca arayüzde saklanmaz; `firestore.rules` dosyası sunucu tarafında da rol kontrolü yapar. Kurallar deploy edilmeden istemci tarafındaki kontroller tek başına yeterli değildir.

Roller `users` koleksiyonunda e-posta dokümanlarıyla yönetilir:

- `admin`: kayıt, silme, iptal, restore, JSON yedek/restore, kullanıcı yönetimi ve audit log görüntüleme.
- `staff`: yeni peşinat kaydı oluşturma.
- `viewer`: sadece görüntüleme.

İlk kurulumda sabit admin e-postaları da geçerlidir. Admin panelinden kullanıcı ekledikten sonra kod değiştirmeden rol yönetebilirsiniz.

Kuralları Firebase'e göndermek için:

```bash
firebase deploy --only firestore:rules
```

## Makbuz Numarası

Yeni kayıt sırasında makbuz numarası Firestore transaction ile `_meta/receiptCounter` dokümanından üretilir. Böylece iki kullanıcı aynı anda kayıt girse bile aynı makbuz numarası verilmez. Silinen veya iptal edilen kayıtların numarası tekrar kullanılmaz.

## Audit Log ve İptal Nedeni

Kayıt oluşturma, düzenleme, silme, geri yükleme, iptal, JSON yedek alma/yükleme ve kullanıcı rol değişiklikleri `auditLogs` koleksiyonuna yazılır. İptal işlemlerinde neden girmek zorunludur; neden kayıt üzerinde `cancelReason`, `cancelledAt`, `cancelledBy` alanlarıyla saklanır.

## Raporlar

Dashboard günlük kasa özetini, ofis/personel kırılımını, iptal nedenlerini ve son audit kayıtlarını gösterir. Liste ekranında tarih, durum, personel, ofis, dekont var/yok, tutar aralığı ve oluşturan kullanıcı filtreleri bulunur.

## Yedekleme

JSON restore işlemi artık:

- yönetici yetkisi ister,
- zorunlu alanları ve tutarın pozitif olmasını kontrol eder,
- mevcut veya yedek içindeki tekrar eden makbuz numaralarını reddeder,
- import sonrası makbuz sayacını en yüksek numaraya taşır.

Admin kullanıcıya son JSON yedeğinin üzerinden 7 gün geçtiyse uygulama içinde yedek hatırlatması gösterilir.
