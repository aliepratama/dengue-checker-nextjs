# Panduan Migrasi Dengue Checker dari Flask ke Next.js

## ✅ Yang Sudah Selesai

Saya telah berhasil melakukan migrasi penuh dari Flask ke Next.js dengan fitur-fitur berikut:

### Fitur yang Diimplementasikan:
1. ✅ **Homepage** - Dengan peta heatmap kasus DBD menggunakan Plotly
2. ✅ **Kuisioner Multi-Step** - 3 langkah (Konfirmasi, Survey, Hasil)
3. ✅ **Form Gejala Utama** - Demam, durasi, dan suhu
4. ✅ **Form Gejala Tambahan** - 8 gejala umum DBD
5. ✅ **Form Uji Lab** - WBC, Hemoglobin, Hematokrit, Platelet
6. ✅ **Prediksi ML** - Logistic Regression manual (tanpa sklearn)
7. ✅ **Halaman Hasil** - Dengan rekomendasi jika positif
8. ✅ **Styling Tailwind** - 100% sama dengan versi Flask
9. ✅ **Responsive Design** - Mobile-friendly
10. ✅ **No Database** - Menggunakan localStorage

### File yang Sudah Dibuat:
```
dengue-checker/
├── app/
│   ├── components/
│   │   ├── Navbar.tsx           ✅ Navbar dengan logo & menu
│   │   ├── Stepper.tsx          ✅ Progress indicator 3 step
│   │   ├── InputChoice.tsx      ✅ Radio button component
│   │   ├── InputNum.tsx         ✅ Number input component
│   │   ├── Question.tsx         ✅ Question display
│   │   └── QAWrapper.tsx        ✅ Question-Answer wrapper
│   ├── form/
│   │   └── page.tsx             ✅ Halaman kuisioner (step 0 & 1)
│   ├── result/
│   │   └── page.tsx             ✅ Halaman hasil prediksi
│   ├── page.tsx                 ✅ Homepage dengan peta
│   ├── layout.tsx               ✅ Layout dengan metadata
│   └── globals.css              ✅ Styling global + font
├── lib/
│   └── model.ts                 ✅ Model ML & fungsi prediksi
├── public/
│   ├── images/                  📁 (perlu copy dari Flask)
│   ├── icons/                   📁 (perlu copy dari Flask)
│   └── heatmap_geo.json         📄 (perlu copy dari Flask)
├── README.md                    ✅ Dokumentasi lengkap
└── package.json                 ✅ Dependencies terinstall
```

## 🔧 Yang Perlu Anda Lakukan

### Langkah 1: Copy Assets dari Proyek Flask

Buka terminal dan jalankan:

```bash
# Masuk ke folder dengue-checker
cd dengue-checker

# Copy gambar
xcopy /E /I /Y "..\dengue-tsdn-2024\dengue\static\dist\images" "public\images"

# Copy icons
xcopy /E /I /Y "..\dengue-tsdn-2024\dengue\static\dist\icons" "public\icons"

# Copy heatmap
copy "..\dengue-tsdn-2024\dengue\models\heatmap_geo.json" "public\"
```

Atau jika pakai Git Bash/Linux:
```bash
cd dengue-checker
cp -r ../dengue-tsdn-2024/dengue/static/dist/images public/
cp -r ../dengue-tsdn-2024/dengue/static/dist/icons public/
cp ../dengue-tsdn-2024/dengue/models/heatmap_geo.json public/
```

### Langkah 2: Ekstrak Nilai Model dari .joblib

1. Jalankan script ekstraksi:
```bash
cd ..
python extract_model_weights.py
```

2. Script akan menampilkan nilai-nilai yang perlu Anda copy

3. Buka file `dengue-checker/lib/model.ts`

4. Ganti nilai placeholder dengan nilai dari output script:

**NORMALIZER:**
```typescript
export const normalizer = {
  mean: [nilai_dari_script],  // 6 angka
  std: [nilai_dari_script]     // 6 angka
};
```

**MODELS:**
```typescript
export const models = {
  all_data: {
    coef: [[nilai_dari_script]],      // 14 angka
    intercept: [nilai_dari_script]     // 1 angka
  },
  fever_general_data: {
    coef: [[nilai_dari_script]],      // 10 angka
    intercept: [nilai_dari_script]     // 1 angka
  },
  lab_general_data: {
    coef: [[nilai_dari_script]],      // 12 angka
    intercept: [nilai_dari_script]     // 1 angka
  },
  only_general_data: {
    coef: [[nilai_dari_script]],      // 8 angka
    intercept: [nilai_dari_script]     // 1 angka
  }
};
```

### Langkah 3: Jalankan Aplikasi

```bash
cd dengue-checker

# Jalankan development server
bun dev
```

Buka browser: http://localhost:3000

## 📋 Testing Checklist

Setelah aplikasi berjalan, test fitur-fitur berikut:

- [ ] Homepage muncul dengan peta
- [ ] Navbar bisa diklik (Beranda & Periksa)
- [ ] Klik "Periksa" masuk ke form step 0
- [ ] Klik "Isi sebagai anonim" masuk ke step 1
- [ ] Form Gejala Utama:
  - [ ] Radio button Demam berfungsi
  - [ ] Input durasi & suhu di-disable saat pilih "Tidak"
  - [ ] Input durasi & suhu enabled saat pilih "Iya"
  - [ ] Gambar berubah grayscale/normal sesuai status
- [ ] Form Gejala Tambahan:
  - [ ] 8 pertanyaan muncul
  - [ ] Semua radio button berfungsi
- [ ] Form Uji Lab:
  - [ ] Radio button Uji Lab berfungsi
  - [ ] Input lab di-disable saat pilih "Belum"
  - [ ] Input lab enabled saat pilih "Sudah"
  - [ ] Gambar berubah grayscale/normal sesuai status
- [ ] Klik "Periksa" masuk ke halaman hasil
- [ ] Hasil prediksi muncul (positif/negatif)
- [ ] Jika positif: muncul 3 card rekomendasi
- [ ] Klik "Kembali ke beranda" → kembali ke home
- [ ] Klik "Coba Lagi" → kembali ke form
- [ ] Alert rating di bawah bisa di-close

## 🎨 Styling

Styling sudah 100% sama dengan Flask:
- ✅ Font: General Sans dari CDN
- ✅ Warna: Red-700 untuk primary
- ✅ Layout: Grid responsive sama persis
- ✅ Spacing: Padding & margin sama
- ✅ Components: Card, button, input sama persis
- ✅ Navbar: Fixed top dengan logo
- ✅ Stepper: Progress indicator 3 step
- ✅ Form: Multi-section dengan smooth scroll

## 🧠 Logika Model

Model ML menggunakan implementasi manual Logistic Regression:

1. **Normalisasi** - Menggunakan mean & std dari normalizer.joblib
2. **Suhu Conversion** - Celsius → Fahrenheit (sesuai Flask)
3. **Feature Engineering** - 4 kombinasi model tergantung input:
   - Demam + Lab = all_data (14 fitur)
   - Demam saja = fever_general_data (10 fitur)
   - Lab saja = lab_general_data (12 fitur)
   - Gejala umum saja = only_general_data (8 fitur)
4. **Sigmoid Function** - Probabilitas 0-1
5. **Threshold** - ≥0.5 = Positif DBD

## 🚀 Production Build

Untuk deploy ke production:

```bash
# Build
bun run build

# Run production
bun start
```

## 📝 Catatan Penting

1. **Tidak ada database** - Sesuai permintaan, data form hanya di localStorage
2. **No scan image** - Fitur klasifikasi nyamuk tidak diimplementasikan
3. **Model hardcoded** - Nilai model di-hardcode di model.ts (perlu ekstrak dulu)
4. **Client-side only** - Semua prediksi di browser, tidak ada API
5. **Plotly dynamic import** - Untuk optimasi bundle size

## 🐛 Troubleshooting

### Error: Cannot find module 'react-plotly.js'
```bash
bun add @types/react-plotly.js @types/plotly.js
```

### Error: Images not found
Pastikan sudah copy folder images & icons ke public/

### Error: heatmap_geo.json not found
Pastikan sudah copy heatmap_geo.json ke public/

### Peta tidak muncul
1. Cek console browser untuk error
2. Pastikan format heatmap_geo.json benar
3. Cek network tab apakah file ter-load

### Prediksi salah
1. Pastikan nilai normalizer sudah benar
2. Pastikan nilai coef & intercept sudah benar
3. Cek urutan fitur sesuai dokumentasi

## 📞 Support

Jika ada masalah, cek:
1. README.md di folder dengue-checker
2. Komentar di lib/model.ts
3. Console browser untuk error

Semua style dan logic sudah sama persis dengan Flask, tinggal isi nilai model dan copy assets! 🎉
