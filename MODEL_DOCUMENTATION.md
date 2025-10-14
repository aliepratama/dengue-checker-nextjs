# Model Machine Learning - Dengue Prediction

## Overview

Sistem prediksi menggunakan **Logistic Regression** dengan 4 model berbeda tergantung data yang tersedia.

## Arsitektur Model

```
Input Form
    ↓
Data Preprocessing
    ↓
Feature Selection (4 scenarios)
    ↓
Normalization
    ↓
Model Selection
    ↓
Logistic Regression
    ↓
Prediction (0 or 1)
```

## 4 Model Scenarios

### 1. All Data Model (14 features)
**Digunakan ketika:** User mengisi demam DAN sudah uji lab

**Features:**
1. dengue.days (normalized)
2. current_temp (Fahrenheit, normalized)
3. dengue.wbc (normalized)
4. dengue.hemoglobin (normalized)
5. dengue._hematocri (normalized)
6. dengue.platelet (normalized)
7. severe_headche (binary)
8. pain_behind_the_eyes (binary)
9. joint_muscle_aches (binary)
10. metallic_taste_in_the_mouth (binary)
11. appetite_loss (binary)
12. addominal_pain (binary)
13. nausea_vomiting (binary)
14. diarrhoea (binary)

### 2. Fever + General Model (10 features)
**Digunakan ketika:** User mengisi demam tapi BELUM uji lab

**Features:**
1. dengue.days (normalized)
2. current_temp (Fahrenheit, normalized)
3-10. General symptoms (8 binary features)

### 3. Lab + General Model (12 features)
**Digunakan ketika:** User TIDAK demam tapi sudah uji lab

**Features:**
1-4. Lab results (4 normalized features)
5-12. General symptoms (8 binary features)

### 4. Only General Model (8 features)
**Digunakan ketika:** User TIDAK demam dan BELUM uji lab

**Features:**
1-8. General symptoms only (8 binary features)

## Normalization

Menggunakan **Standard Scaler** dari sklearn:

```
normalized_value = (value - mean) / std
```

**Temperature Conversion:**
```
Fahrenheit = Celsius × (9/5) + 32
```

### Normalizer Features Order:
1. dengue.days
2. current_temp (Fahrenheit)
3. dengue.wbc
4. dengue.hemoglobin
5. dengue._hematocri
6. dengue.platelet

## Logistic Regression Formula

```
z = intercept + Σ(coef[i] × feature[i])
probability = 1 / (1 + e^(-z))
prediction = 1 if probability >= 0.5 else 0
```

## Mapping Form Fields ke Features

### Form Fields:
```typescript
KDEMA  → Kondisi Demam (Iya/Tidak)
DDEMA  → Durasi Demam (days)
SUHUN  → Suhu Sekarang (Celsius)
ULABO  → Uji Laboratorium (Sudah/Belum)
JWBCS  → Jumlah WBC (×10^3/uL)
HEMOG  → Hemoglobin (g/dL)
HEMAT  → Hematokrit (%)
JPLAT  → Jumlah Platelet (×10^3/uL)
SKPLA  → Sakit Kepala Parah (Iya/Tidak)
NYMAT  → Nyeri Mata (Iya/Tidak)
NYSEN  → Nyeri Sendi (Iya/Tidak)
RSMUL  → Rasa logam di Mulut (Iya/Tidak)
HINFM  → Hilang Nafsu Makan (Iya/Tidak)
NYPER  → Nyeri Perut (Iya/Tidak)
MUMUN  → Mual/Muntah (Iya/Tidak)
MDIAR  → Diare (Iya/Tidak)
```

### General Symptoms Features:
```typescript
1. SKPLA → dengue.servere_headche
2. NYMAT → dengue.pain_behind_the_eyes
3. NYSEN → dengue.joint_muscle_aches
4. RSMUL → dengue.metallic_taste_in_the_mouth
5. HINFM → dengue.appetite_loss
6. NYPER → dengue.addominal_pain
7. MUMUN → dengue.nausea_vomiting
8. MDIAR → dengue.diarrhoea
```

## Decision Tree

```
Start
  │
  ├─ KDEMA = 'Iya'?
  │   │
  │   ├─ Yes → ULABO = 'Sudah'?
  │   │         │
  │   │         ├─ Yes → Use all_data model (14 features)
  │   │         └─ No  → Use fever_general_data model (10 features)
  │   │
  │   └─ No → ULABO = 'Sudah'?
  │             │
  │             ├─ Yes → Use lab_general_data model (12 features)
  │             └─ No  → Use only_general_data model (8 features)
  │
Result: 0 (Tidak DBD) atau 1 (Kemungkinan DBD)
```

## Output

- **0** = Tidak terkena demam berdarah
  - Pesan: "Tetap jaga kesehatan dan kebersihan"
  - Tidak menampilkan rekomendasi
  
- **1** = Kemungkinan terkena demam berdarah
  - Pesan: "Segera periksakan diri ke dokter"
  - Menampilkan 3 rekomendasi:
    1. Konsultasi ke dokter
    2. Melakukan penyemprotan
    3. Memberi bubuk abate

## Implementation Details

### File: `lib/model.ts`

```typescript
// 1. Define normalizer values
export const normalizer = { mean, std }

// 2. Define model weights
export const models = {
  all_data: { coef, intercept },
  fever_general_data: { coef, intercept },
  lab_general_data: { coef, intercept },
  only_general_data: { coef, intercept }
}

// 3. Helper functions
function sigmoid(z): probability
function normalize(value, mean, std): normalized_value

// 4. Main prediction function
export function predictDengue(formData): 0 or 1
```

## Example Calculation

### Scenario: User has fever, no lab test

**Input:**
```
KDEMA = 'Iya'
DDEMA = 3
SUHUN = 39.5
ULABO = 'Belum'
SKPLA = 'Iya'
NYMAT = 'Iya'
NYSEN = 'Tidak'
... (other symptoms)
```

**Step 1: Normalize fever data**
```
dengue.days = (3 - mean[0]) / std[0]
current_temp = ((39.5 × 9/5 + 32) - mean[1]) / std[1]
```

**Step 2: Create binary features**
```
severe_headche = 1
pain_behind_the_eyes = 1
joint_muscle_aches = 0
... (rest)
```

**Step 3: Select model**
```
isDemam = true, isUjiLab = false
→ Use fever_general_data model (10 features)
```

**Step 4: Calculate z**
```
z = intercept + (coef[0] × dengue.days) + (coef[1] × current_temp) + ... + (coef[9] × diarrhoea)
```

**Step 5: Apply sigmoid**
```
probability = 1 / (1 + e^(-z))
```

**Step 6: Threshold**
```
prediction = 1 if probability >= 0.5 else 0
```

## Accuracy Considerations

Model accuracy tergantung pada:
1. **Kualitas data training** - Model asli dari Flask
2. **Fitur selection** - Lebih banyak data = lebih akurat
3. **Normalizer values** - Harus sama dengan training
4. **Threshold** - Default 0.5, bisa disesuaikan

## Recommendations

### Jika Positif (prediction = 1):

1. **Konsultasi Dokter** 🏥
   - Link: Google Maps "rumah sakit terdekat"
   - Prioritas tertinggi

2. **Penyemprotan** 🦟
   - Link: Google Maps "puskesmas terdekat"
   - Mencegah penyebaran

3. **Bubuk Abate** 💊
   - Link: Google Shopping "bubuk abate"
   - Pencegahan jangka panjang

## Differences from Flask Version

### Same:
- ✅ Logistic Regression algorithm
- ✅ 4 model scenarios
- ✅ Feature engineering
- ✅ Normalization formula
- ✅ Sigmoid activation
- ✅ Threshold 0.5

### Different:
- ❌ No sklearn library (manual implementation)
- ❌ No joblib loading (hardcoded weights)
- ❌ No pandas DataFrame (plain JavaScript objects)
- ✅ TypeScript types for safety
- ✅ Client-side execution (faster, no server)

## Performance

- **Execution time:** < 1ms (client-side)
- **Bundle size:** Minimal (no ML libraries)
- **Accuracy:** Same as Flask (using same weights)
- **Scalability:** Unlimited (no server load)

## Future Improvements

1. Add probability score display
2. Add confidence interval
3. Add feature importance visualization
4. Add model comparison
5. Add explainable AI (SHAP values)
6. Add sensitivity/specificity metrics
7. Support multiple languages
8. Add history tracking (localStorage)

## Testing Model

Untuk test model accuracy, bandingkan hasil dengan Flask:

```python
# Flask version
python run.py
# Input same data

# Next.js version
bun dev
# Input same data

# Results should be identical
```
