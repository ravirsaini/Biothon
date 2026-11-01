/** Synthetic teaching cohort for the chart bay. These rows are invented. */

export const cohort = {
  name: "Ward B",
  encounters: 128,
  readmitted: 15,
  missingLactate: 18,
  medianStay: "3 days",
  admissions: [
    { day: "Mon", admissions: 18 },
    { day: "Tue", admissions: 22 },
    { day: "Wed", admissions: 19 },
    { day: "Thu", admissions: 24 },
    { day: "Fri", admissions: 21 },
    { day: "Sat", admissions: 14 },
    { day: "Sun", admissions: 10 },
  ],
  lengthOfStay: [
    { bucket: "0–1", stays: 34 },
    { bucket: "2–3", stays: 41 },
    { bucket: "4–5", stays: 28 },
    { bucket: "6–7", stays: 15 },
    { bucket: "8+", stays: 10 },
  ],
  vitals: [
    { hour: "0h", heartRate: 96, spo2: 96 },
    { hour: "2h", heartRate: 102, spo2: 95 },
    { hour: "4h", heartRate: 108, spo2: 94 },
    { hour: "6h", heartRate: 99, spo2: 96 },
    { hour: "8h", heartRate: 92, spo2: 97 },
    { hour: "10h", heartRate: 88, spo2: 98 },
    { hour: "12h", heartRate: 86, spo2: 98 },
  ],
  labs: [
    { panel: "CBC", present: 98 },
    { panel: "BMP", present: 94 },
    { panel: "Lactate", present: 86 },
    { panel: "Troponin", present: 61 },
    { panel: "ABG", present: 44 },
    { panel: "Culture", present: 29 },
  ],
}

export function readmissionPercent() {
  return ((cohort.readmitted / cohort.encounters) * 100).toFixed(1)
}
