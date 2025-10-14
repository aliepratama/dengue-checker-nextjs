// Model weights dan normalizer
export const normalizer = {
  mean: [5.4414062, 102.583984, 3.0473957, 13.312175, 32.052082, 95.52734], // [dengue.days, current_temp, wbc, hemoglobin, hematocrit, platelet]
  std: [2.2206898, 1.3689892, 1.1779854, 3.1176934, 7.264704, 27.897495]
};

// Logistic Regression coefficients dan intercept
export const models = {
  all_data: {
    coef: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]], // fever(2) + lab(4) + general(8)
    intercept: [0]
  },
  fever_general_data: {
    coef: [[-0.6573720403525993, 0.47243607447663594, 3.678645309662817, 3.2371620158049743, 4.696551901855814, 6.175915051852743, 2.410549576942971, 4.477206796711392, 3.8263365894504826, 2.321341552097079]], // fever(2) + general(8)
    intercept: [-10.92467979624238]
  },
  lab_general_data: {
    coef: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]], // lab(4) + general(8)
    intercept: [0]
  },
  only_general_data: {
    coef: [[0, 0, 0, 0, 0, 0, 0, 0]], // general(8)
    intercept: [0]
  }
};

function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

function normalize(value: number, mean: number, std: number): number {
  return (value - mean) / std;
}

export interface FormData {
  KDEMA: string; // 'Iya' | 'Tidak'
  DDEMA: number; // durasi demam
  SUHUN: number; // suhu (Celsius)
  ULABO: string; // 'Sudah' | 'Belum'
  JWBCS: number; // WBC
  HEMOG: number; // Hemoglobin
  HEMAT: number; // Hematocrit
  JPLAT: number; // Platelet
  SKPLA: string; // sakit kepala parah
  NYMAT: string; // nyeri belakang mata
  NYSEN: string; // nyeri sendi/otot
  RSMUL: string; // rasa logam di mulut
  HINFM: string; // hilang nafsu makan
  NYPER: string; // nyeri perut
  MUMUN: string; // mual/muntah
  MDIAR: string; // diare
}

export function predictDengue(formData: FormData): number {
  const isDemam = formData.KDEMA === 'Iya';
  const isUjiLab = formData.ULABO === 'Sudah';

  // Normalisasi data numerik
  const normalizedData = [
    isDemam ? normalize(formData.DDEMA, normalizer.mean[0], normalizer.std[0]) : 0,
    isDemam ? normalize(formData.SUHUN * 9 / 5 + 32, normalizer.mean[1], normalizer.std[1]) : 0, // Convert to Fahrenheit
    isUjiLab ? normalize(formData.JWBCS, normalizer.mean[2], normalizer.std[2]) : 0,
    isUjiLab ? normalize(formData.HEMOG, normalizer.mean[3], normalizer.std[3]) : 0,
    isUjiLab ? normalize(formData.HEMAT, normalizer.mean[4], normalizer.std[4]) : 0,
    isUjiLab ? normalize(formData.JPLAT, normalizer.mean[5], normalizer.std[5]) : 0,
  ];

  // General symptoms (binary)
  const generalSymptoms = [
    formData.SKPLA === 'Iya' ? 1 : 0,
    formData.NYMAT === 'Iya' ? 1 : 0,
    formData.NYSEN === 'Iya' ? 1 : 0,
    formData.RSMUL === 'Iya' ? 1 : 0,
    formData.HINFM === 'Iya' ? 1 : 0,
    formData.NYPER === 'Iya' ? 1 : 0,
    formData.MUMUN === 'Iya' ? 1 : 0,
    formData.MDIAR === 'Iya' ? 1 : 0,
  ];

  let features: number[];
  let model;

  if (isDemam && isUjiLab) {
    // fever(2) + lab(4) + general(8)
    features = [
      normalizedData[0], // dengue.days
      normalizedData[1], // current_temp
      normalizedData[2], // wbc
      normalizedData[3], // hemoglobin
      normalizedData[4], // hematocrit
      normalizedData[5], // platelet
      ...generalSymptoms
    ];
    model = models.all_data;
  } else if (isDemam && !isUjiLab) {
    // fever(2) + general(8)
    features = [
      normalizedData[0], // dengue.days
      normalizedData[1], // current_temp
      ...generalSymptoms
    ];
    model = models.fever_general_data;
  } else if (!isDemam && isUjiLab) {
    // lab(4) + general(8)
    features = [
      normalizedData[2], // wbc
      normalizedData[3], // hemoglobin
      normalizedData[4], // hematocrit
      normalizedData[5], // platelet
      ...generalSymptoms
    ];
    model = models.lab_general_data;
  } else {
    // only general(8)
    features = generalSymptoms;
    model = models.only_general_data;
  }

  // Logistic regression prediction
  let z = model.intercept[0];
  for (let i = 0; i < features.length; i++) {
    z += model.coef[0][i] * features[i];
  }

  const probability = sigmoid(z);
  return probability >= 0.5 ? 1 : 0; // 1 = dengue, 0 = tidak dengue
}
