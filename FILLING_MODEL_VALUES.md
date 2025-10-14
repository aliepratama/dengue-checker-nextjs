# Cara Mengisi Nilai Model (Step-by-Step)

## Persiapan

1. Pastikan Anda berada di folder `dengue-checker-nextjs`
2. Pastikan Python sudah terinstall dengan library joblib

## Step 1: Jalankan Script Ekstraksi

```bash
# Di folder dengue-checker-nextjs
python extract_model_weights.py
```

Script akan menampilkan output seperti ini:

```
================================================================================
DENGUE MODEL WEIGHT EXTRACTOR
================================================================================

This script will extract all model weights from .joblib files
Copy the output values into lib/model.ts in your Next.js project

================================================================================
NORMALIZER VALUES
================================================================================

Paste this into lib/model.ts:

export const normalizer = {
  mean: [2.5, 99.8, 5.2, 13.1, 38.5, 180.2],
  std: [1.8, 2.1, 2.3, 1.9, 7.2, 95.3]
};

Feature order:
1. dengue.days
2. current_temp (Fahrenheit)
3. dengue.wbc
4. dengue.hemoglobin
5. dengue._hematocri
6. dengue.platelet

================================================================================
MODEL WEIGHTS
================================================================================

Paste these into the models object in lib/model.ts:

export const models = {
================================================================================
MODEL: all_data
================================================================================

Number of features: 14
Coefficients shape: (1, 14)

Paste this into lib/model.ts:

  all_data: {
    coef: [[0.5, -0.3, 0.8, ...]], // 14 nilai
    intercept: [-1.2]
  },

... (dan seterusnya untuk model lain)
```

## Step 2: Buka File Model

```bash
cd dengue-checker
code lib/model.ts  # atau editor lain
```

## Step 3: Copy Nilai Normalizer

### Temukan bagian ini di `lib/model.ts`:

```typescript
export const normalizer = {
  mean: [0, 0, 0, 0, 0, 0], // [dengue.days, current_temp, wbc, hemoglobin, hematocrit, platelet]
  std: [1, 1, 1, 1, 1, 1]
};
```

### Ganti dengan nilai dari output script:

```typescript
export const normalizer = {
  mean: [2.5, 99.8, 5.2, 13.1, 38.5, 180.2], // Contoh - ganti dengan nilai asli
  std: [1.8, 2.1, 2.3, 1.9, 7.2, 95.3]        // Contoh - ganti dengan nilai asli
};
```

**⚠️ PENTING:** Salin SEMUA 6 angka, jangan ada yang kurang!

## Step 4: Copy Nilai Model all_data

### Temukan bagian ini:

```typescript
all_data: {
  coef: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]], // fever(2) + lab(4) + general(8)
  intercept: [0]
},
```

### Ganti dengan nilai dari output script:

```typescript
all_data: {
  coef: [[0.5, -0.3, 0.8, 0.2, -0.5, 0.7, 0.4, 0.6, -0.2, 0.3, 0.1, -0.4, 0.5, 0.2]], // Contoh
  intercept: [-1.2] // Contoh
},
```

**⚠️ PENTING:** 
- Harus ada 14 angka dalam array coef
- Tetap dalam format `[[...]]` (array of array)
- intercept dalam format `[...]` (single array)

## Step 5: Copy Nilai Model fever_general_data

### Temukan bagian ini:

```typescript
fever_general_data: {
  coef: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]], // fever(2) + general(8)
  intercept: [0]
},
```

### Ganti dengan nilai dari output script:

```typescript
fever_general_data: {
  coef: [[0.6, -0.4, 0.5, 0.3, -0.2, 0.4, 0.2, 0.7, 0.1, 0.3]], // Contoh - 10 angka
  intercept: [-0.8] // Contoh
},
```

**⚠️ PENTING:** Harus ada 10 angka dalam array coef

## Step 6: Copy Nilai Model lab_general_data

### Temukan bagian ini:

```typescript
lab_general_data: {
  coef: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]], // lab(4) + general(8)
  intercept: [0]
},
```

### Ganti dengan nilai dari output script:

```typescript
lab_general_data: {
  coef: [[0.7, 0.3, -0.5, 0.6, 0.4, 0.2, -0.3, 0.5, 0.1, 0.4, 0.3, 0.2]], // Contoh - 12 angka
  intercept: [-1.0] // Contoh
},
```

**⚠️ PENTING:** Harus ada 12 angka dalam array coef

## Step 7: Copy Nilai Model only_general_data

### Temukan bagian ini:

```typescript
only_general_data: {
  coef: [[0, 0, 0, 0, 0, 0, 0, 0]], // general(8)
  intercept: [0]
}
```

### Ganti dengan nilai dari output script:

```typescript
only_general_data: {
  coef: [[0.5, 0.4, -0.2, 0.6, 0.3, 0.1, 0.4, 0.2]], // Contoh - 8 angka
  intercept: [-0.5] // Contoh
}
```

**⚠️ PENTING:** Harus ada 8 angka dalam array coef

## Step 8: Verifikasi

Setelah mengisi semua nilai, file `lib/model.ts` harus terlihat seperti ini:

```typescript
// Model weights dan normalizer
export const normalizer = {
  mean: [2.5, 99.8, 5.2, 13.1, 38.5, 180.2], // ✅ 6 angka
  std: [1.8, 2.1, 2.3, 1.9, 7.2, 95.3]        // ✅ 6 angka
};

export const models = {
  all_data: {
    coef: [[...]], // ✅ 14 angka
    intercept: [-1.2]
  },
  fever_general_data: {
    coef: [[...]], // ✅ 10 angka
    intercept: [-0.8]
  },
  lab_general_data: {
    coef: [[...]], // ✅ 12 angka
    intercept: [-1.0]
  },
  only_general_data: {
    coef: [[...]], // ✅ 8 angka
    intercept: [-0.5]
  }
};

// ... rest of the code
```

## Step 9: Test

```bash
# Jalankan development server
bun dev
```

Buka http://localhost:3000 dan test:
1. Isi form dengan data yang sama seperti di Flask
2. Lihat hasil prediksi
3. Bandingkan dengan hasil Flask - harus sama!

## Checklist Validasi

Sebelum menjalankan, pastikan:

- [ ] Normalizer.mean memiliki 6 angka
- [ ] Normalizer.std memiliki 6 angka
- [ ] all_data.coef memiliki 14 angka dalam `[[...]]`
- [ ] fever_general_data.coef memiliki 10 angka dalam `[[...]]`
- [ ] lab_general_data.coef memiliki 12 angka dalam `[[...]]`
- [ ] only_general_data.coef memiliki 8 angka dalam `[[...]]`
- [ ] Semua intercept dalam format `[...]`
- [ ] Tidak ada typo atau koma yang hilang
- [ ] File tersimpan dengan benar

## Common Errors

### Error: "Cannot read property '0' of undefined"
**Penyebab:** Format array salah
**Solusi:** Pastikan coef dalam format `[[...]]` bukan `[...]`

### Error: Prediksi selalu 0 atau selalu 1
**Penyebab:** Nilai normalizer atau coef salah
**Solusi:** Cek ulang nilai yang di-copy, pastikan tidak ada angka yang tertukar

### Error: NaN in prediction
**Penyebab:** Ada nilai yang bukan number
**Solusi:** Pastikan semua nilai adalah number, tidak ada string atau undefined

### Hasil berbeda dengan Flask
**Penyebab:** 
1. Nilai model tidak sama persis
2. Urutan fitur berbeda
3. Normalization tidak konsisten

**Solusi:**
1. Copy ulang nilai dari script ekstraksi
2. Cek urutan fitur sesuai dokumentasi
3. Pastikan temperature conversion sama (Celsius → Fahrenheit)

## Tips

1. **Copy-paste seluruh array** - Jangan ketik manual untuk menghindari typo
2. **Gunakan prettier/formatter** - Format code setelah paste
3. **Test bertahap** - Test satu model dulu, baru yang lain
4. **Simpan backup** - Backup file asli sebelum edit
5. **Console log** - Tambahkan console.log untuk debug jika perlu

## Contoh Debug

Jika ingin memastikan nilai ter-load dengan benar:

```typescript
// Tambahkan di awal fungsi predictDengue
console.log('Normalizer:', normalizer);
console.log('Model selected:', isDemam && isUjiLab ? 'all_data' : ...);
console.log('Features:', features);
console.log('Z score:', z);
console.log('Probability:', probability);
```

Kemudian cek console browser saat submit form.

## Next Steps

Setelah nilai model terisi:
1. ✅ Test semua 4 skenario form
2. ✅ Bandingkan hasil dengan Flask
3. ✅ Copy assets (images, icons, heatmap)
4. ✅ Deploy ke production

Selamat! Model sudah siap digunakan! 🎉
