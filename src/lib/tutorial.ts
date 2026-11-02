export type TutorialTopic = {
  id: string
  title: string
  summary: string
  example: string
  code: string
  exercise: string
  note?: string
}

export const tutorialTopics: TutorialTopic[] = [
  {
    id: "pandas-for-ehr",
    title: "Pandas for EHR",
    summary:
      "A lab panel is a table of rows. Pandas lets you build that table in the browser and print the results you want to read.",
    example: "Create a small table of patient lab results and print it.",
    code: `import pandas as pd

labs = pd.DataFrame(
    {
        "patient_id": ["P-1042", "P-1048", "P-1103", "P-1117"],
        "assay": ["sodium", "potassium", "lactate", "lactate"],
        "result": [138.0, 4.1, 1.6, 4.8],
        "unit": ["mmol/L", "mmol/L", "mmol/L", "mmol/L"],
    }
)
print(labs)`,
    exercise:
      "Keep only the lactate rows and print those results.",
  },
  {
    id: "biopython-basics",
    title: "Biopython Basics",
    summary:
      "A coding sequence is a string with a biological alphabet. Biopython keeps transcription and translation from becoming hand-rolled slices.",
    example:
      "Translate a short open reading frame and stop at the first stop codon.",
    code: `from Bio.Seq import Seq

coding = Seq("ATGCGATAG")
protein = coding.translate(to_stop=True)
print(protein)
print(coding.transcribe())`,
    exercise:
      "Change the DNA string so it contains a stop codon in the middle, and print both the protein and the length of the original sequence.",
  },
  {
    id: "scikit-learn-for-diagnostics",
    title: "Scikit-learn for Diagnostics",
    summary:
      "A first classifier can be fit on a handful of synthetic rows. The point is to read the score slowly, not to ship a diagnostic.",
    example:
      "Fit a logistic model on made-up readmission bits. The features are a prior admission and length of stay.",
    code: `from sklearn.linear_model import LogisticRegression

# prior_admission, los_days -> readmitted (synthetic)
X = [[0, 2], [1, 3], [1, 10], [0, 4], [1, 8], [0, 1]]
y = [0, 0, 1, 0, 1, 0]
model = LogisticRegression().fit(X, y)
print(round(model.score(X, y), 2))`,
    exercise:
      "Print one coefficient in words: which column it belongs to, and why you would not show this number to a clinician.",
    note: "Practice rows only. This is not a diagnostic score and not a reason to change anyone's care.",
  },
  {
    id: "numpy-for-lab-panels",
    title: "NumPy for Lab Panels",
    summary:
      "A basic panel is a row of numbers. Stack the rows, then say how many values a mean had to skip.",
    example:
      "Take the mean of each assay and count the non-missing values beside it.",
    code: `import numpy as np

# columns: sodium, potassium, chloride
panels = np.array([
    [138, 4.1, 102],
    [141, np.nan, 100],
    [136, 3.6, 104],
])
print(np.nanmean(panels, axis=0))
print(np.sum(~np.isnan(panels), axis=0))`,
    exercise:
      "Drop the potassium column before the mean, and print the two remaining assay names next to the result.",
  },
  {
    id: "missing-labs",
    title: "Missing Labs",
    summary:
      "A blank lactate is not a lactate of zero. Count the blanks and keep a flag so a later fill stays visible.",
    example:
      "Mark missing lactate values without writing anything into the original column.",
    code: `missing = encounters["lactate"].isna()
encounters = encounters.assign(lactate_missing=missing)
print(int(missing.sum()), "blank lactate results")`,
    exercise:
      "Print the missing count for one more column, and write one sentence about why that field might be empty.",
    note: "Do not fill a blank with the column mean until you can say why the cell is empty.",
  },
]
