# Dengue Checker - Next.js

Aplikasi deteksi Demam Berdarah Dengue (DBD) menggunakan Next.js dan TypeScript dengan autentikasi Supabase.

## Instalasi

```bash
bun install
```

## Konfigurasi Supabase

### 1. Setup Supabase Project

1. Buat project baru di [Supabase](https://app.supabase.com)
2. Aktifkan Google OAuth Provider:
   - Buka **Authentication** > **Providers**
   - Enable **Google** provider
   - Masukkan Google OAuth credentials (Client ID & Secret)
   - Tambahkan redirect URL: `http://localhost:3000/auth/callback` (untuk development)

### 2. Konfigurasi Environment Variables

Salin file `.env.local.example` menjadi `.env.local`:

```bash
cp .env.local.example .env.local
```

Isi dengan kredensial dari Supabase project Anda:
- Buka project di [Supabase Dashboard](https://app.supabase.com)
- Pergi ke **Settings** > **API**
- Salin **Project URL** dan **anon public key**

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Konfigurasi Model

**PENTING:** Sebelum menjalankan aplikasi, Anda perlu mengisi nilai bobot model dan normalizer di file `lib/model.ts`.

### 1. Normalizer

Buka file `lib/model.ts` dan isi nilai `mean` dan `std` untuk normalizer:

```typescript
export const normalizer = {
  mean: [0, 0, 0, 0, 0, 0], // Ganti dengan nilai mean dari normalizer.joblib
  std: [1, 1, 1, 1, 1, 1]    // Ganti dengan nilai std dari normalizer.joblib
};
```

Urutan fitur:
1. dengue.days
2. current_temp (dalam Fahrenheit)
3. dengue.wbc
4. dengue.hemoglobin
5. dengue._hematocri
6. dengue.platelet

### 2. Model Weights

Isi nilai `coef` dan `intercept` untuk masing-masing model:

#### Model all_data (14 fitur)
- fever(2) + lab(4) + general(8)
```typescript
all_data: {
  coef: [[...]], // Array dengan 14 nilai
  intercept: [0]
}
```

#### Model fever_general_data (10 fitur)
- fever(2) + general(8)
```typescript
fever_general_data: {
  coef: [[...]], // Array dengan 10 nilai
  intercept: [0]
}
```

#### Model lab_general_data (12 fitur)
- lab(4) + general(8)
```typescript
lab_general_data: {
  coef: [[...]], // Array dengan 12 nilai
  intercept: [0]
}
```

#### Model only_general_data (8 fitur)
- general(8) saja
```typescript
only_general_data: {
  coef: [[...]], // Array dengan 8 nilai
  intercept: [0]
}
```

Urutan fitur general symptoms:
1. SKPLA - Sakit kepala parah
2. NYMAT - Nyeri belakang mata
3. NYSEN - Nyeri sendi/otot
4. RSMUL - Rasa logam di mulut
5. HINFM - Hilang nafsu makan
6. NYPER - Nyeri perut
7. MUMUN - Mual/muntah
8. MDIAR - Diare

### 3. Copy Assets

Copy file heatmap_geo.json dan folder images/icons dari proyek Flask lama:

```bash
# Copy heatmap
cp ../dengue-tsdn-2024/dengue/models/heatmap_geo.json public/

# Copy images
cp -r ../dengue-tsdn-2024/dengue/static/dist/images public/
cp -r ../dengue-tsdn-2024/dengue/static/dist/icons public/
```

## Menjalankan Aplikasi

Development mode:
```bash
bun dev
```

Build untuk production:
```bash
bun run build
```

Jalankan production:
```bash
bun start
```

## Fitur

- ✅ Homepage dengan peta heatmap kasus DBD
- ✅ Kuisioner multi-step (Gejala Utama, Gejala Tambahan, Uji Laboratorium)
- ✅ Prediksi menggunakan Logistic Regression
- ✅ Hasil prediksi dengan rekomendasi
- ✅ Styling sama persis dengan versi Flask (Tailwind CSS)
- ✅ Responsive design

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Charts:** Plotly.js
- **Package Manager:** Bun
- **ML:** Custom Logistic Regression implementation

## Struktur Folder

```
app/
├── components/         # React components
│   ├── Navbar.tsx
│   ├── Stepper.tsx
│   ├── InputChoice.tsx
│   ├── InputNum.tsx
│   ├── Question.tsx
│   └── QAWrapper.tsx
├── form/              # Halaman kuisioner
│   └── page.tsx
├── result/            # Halaman hasil
│   └── page.tsx
├── page.tsx           # Homepage
├── layout.tsx
└── globals.css
lib/
└── model.ts           # Model ML & prediksi
public/
├── images/            # Gambar-gambar
├── icons/             # Icon SVG
└── heatmap_geo.json   # Data peta
```

## Catatan

- Aplikasi ini **TIDAK** menggunakan database sesuai permintaan
- Form data disimpan sementara di localStorage
- Style Tailwind 100% sama dengan versi Flask
- Model ML diimplementasikan manual tanpa library sklearn

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
