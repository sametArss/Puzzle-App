# 🧩 Jigsaw Studio

**Jigsaw Studio**, kullanıcıların kendi galerilerinden seçtikleri veya kamerayla çektikleri fotoğrafları **tamamen cihaz üzerinde (offline)** klasik Jigsaw puzzle parçalarına bölen, modern koyu temalı ve yüksek performanslı bir mobil puzzle uygulamasıdır.

Fotoğraflarınız hiçbir sunucuya yüklenmez; tüm görseller, devam eden oyunlar ve tamamlanan koleksiyonunuz yalnızca kendi cihazınızda güvenle saklanır.

---

## ✨ Özellikler

- **🔒 %100 Gizlilik & Çevrimdışı Çalışma:** Seçilen fotoğraflar `expo-file-system` aracılığıyla uygulamanın yerel depolama alanına kopyalanır. İnternet bağlantısı olmadan her yerde oynanabilir.
- **🧩 Gerçekçi Jigsaw Geometrisi:** Kare kesimler yerine, Bézier eğrileriyle üretilen birbirine kenetlenen `TAB` (çıkıntı) ve `SLOT` (girinti) kenarlara sahip klasik puzzle parçaları.
- **⚡ 120 FPS Sürükle & Bırak (Drag & Drop):** `Animated.ValueXY` ve ekran seviyesindeki Global Drag Overlay mimarisi sayesinde 64 parçada bile takılmadan, akıcı sürükleme ve manyetik yerine oturma (Snap) mekaniği.
- **🎯 4 Farklı Zorluk Seviyesi:**
  - **Başlangıç:** `3x3` (9 Parça)
  - **Kolay:** `4x4` (16 Parça)
  - **Orta:** `6x6` (36 Parça)
  - **Usta:** `8x8` (64 Parça)
- **🗂️ Akıllı Parça Havuzu:** Parçalar Fisher-Yates algoritmasıyla karıştırılarak gelir. **Tümü**, **Kenar** ve **İç** filtreleri ile büyük puzzle'larda aradığınız parçayı kolayca bulabilirsiniz.
- **💾 Kaldığın Yerden Devam Et (Auto-Save):** Oyunu yarıda bıraksanız bile ilerlemeniz, süreniz ve yerleşen parçalarınız otomatik olarak kaydedilir.
- **🏆 Koleksiyonum (Vitrin):** Tamamladığınız puzzle'lar; bitirme süresi, hamle sayısı ve tarih bilgisiyle kalıcı koleksiyonunuzda sergilenir.
- **💡 3 Haklı İpucu & Orijinal Resme Bakma:** Her oyunda 3 adet parça yeri parlatma hakkı ve kutu kapağına bakar gibi tam boyutta **Orijinal Resmi Gör** önizleme penceresi.
- **🔊 Ses Efektleri & Titreşim (Haptics) + Ayarlar:** Parça oturduğunda tatmin edici "tık" sesi, tamamlandığında başarı melodisi, yanlış denemede uyarı sesi ve titreşimi. Ayarlar menüsünden ses ve titreşim tercihleri açılıp kapatılabilir.
- **🌌 Modern Koyu Tema & Sinematik Açılış:** Derin gece siyahı (`#070B14`) arayüz ve dönen neon puzzle amblemi.

---

## 🏗️ Katmanlı Proje Mimarisi

Proje, sorumlulukların ayrıldığı modüler ve katmanlı bir yapı (`Layered & Feature-Driven Architecture`) ile geliştirilmiştir:

```text
├── assets/
│   ├── icon.png                            # Uygulama ikonu (1024x1024)
│   ├── splash-icon.png                     # Açılış ekranı ikonu
│   └── sounds/                             # Çevrimdışı WAV ses efektleri (snap, success, error)
│
├── src/
│   ├── core/                               # Temel tip tanımları ve tasarım sistemi
│   │   ├── theme/colors.ts                 # Koyu tema ve neon renk paleti
│   │   └── types/                          # puzzle, collection ve settings tipleri
│   │
│   ├── services/                           # Cihaz ve donanım servis katmanı
│   │   ├── storage/asyncStorageService.ts  # Oyun kayıtları, koleksiyon ve ayarlar
│   │   ├── file/localFileService.ts        # Görsellerin cihazda yerel saklanması
│   │   └── feedback/                       # Ses (soundService) ve titreşim (hapticService)
│   │
│   ├── features/                           # İş mantığı ve oyun motoru modülleri
│   │   ├── puzzle/
│   │   │   ├── utils/                      # Jigsaw SVG path üretimi & Snap algoritması
│   │   │   ├── hooks/usePuzzleGame.ts      # Oyun döngüsü, sayaç, ipucu ve kayıt
│   │   │   └── components/                 # PuzzleBoard, PieceTray, DraggablePiece, Modal'lar
│   │   ├── collection/                     # Koleksiyon hook'u ve CollectionCard
│   │   └── settings/                       # Ayarlar yönetimi (useSettings)
│   │
│   ├── components/common/                  # SpinningPuzzleLogo gibi ortak UI bileşenleri
│   └── screens/                            # SplashScreen, HomeScreen, GameScreen,
│                                           # CollectionScreen, DifficultyModal, SettingsModal
└── App.tsx                                 # Kök yönlendirici ve global modal yönetimi
```

---

## 🛠️ Kullanılan Teknolojiler

- **Expo SDK 58** & **React Native** (`0.88.1`) / **React** (`19.3.0`)
- **TypeScript**
- **react-native-svg** (Jigsaw parçalarının Bézier path ve `ClipPath` ile maskelenmesi)
- **react-native-gesture-handler** & **react-native-reanimated**
- **expo-image-picker** & **expo-file-system** (Galeri/Kamera ve yerel dosya yönetimi)
- **expo-audio** & **expo-haptics** (Ses efektleri ve dokunsal geri bildirim)
- **@react-native-async-storage/async-storage** (Kalıcı yerel depolama)
- **lucide-react-native** (Modern ikon seti)

---

## 🚀 Kurulum ve Çalıştırma

### 1. Bağımlılıkları Yükleyin
```bash
npm install
```

### 2. Geliştirme Sunucusunu Başlatın
```bash
npx expo start
```
Terminalde oluşan QR kodu telefonunuzdaki **Expo Go** uygulamasıyla okutarak anında test edebilirsiniz.

### 3. TypeScript Kontrolü
```bash
npx tsc --noEmit
```

### 4. iOS / Android Build Alma (EAS Build)
Bilgisayarınızda yerel Xcode veya Android Studio kurulu olmasa bile Expo EAS üzerinden bulut build alabilirsiniz:
```bash
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest build --platform ios --profile preview
```

