export type ModuleStatus = "complete" | "in-progress" | "not-started"

export type Lesson = {
  title: string
  detail: string
  done: boolean
}

export type StudyModule = {
  slug: string
  number: string
  title: string
  focus: string
  summary: string
  libraries: string[]
  hours: number
  status: ModuleStatus
  lessons: Lesson[]
  checks: string[]
  prompt: {
    title: string
    body: string
    sketch: string
  }
  caution?: string
}

export const statusLabel: Record<ModuleStatus, string> = {
  complete: "Finished",
  "in-progress": "In progress",
  "not-started": "Not started",
}

export const modules: StudyModule[] = [
  {
    slug: "python-for-the-chart",
    number: "01",
    title: "Python for the chart",
    focus: "Names, functions, and a file you actually inspect.",
    summary:
      "The small set of Python you need before a table of encounters is worth opening. Types, functions, and the habit of printing what a file really contains.",
    libraries: ["Python"],
    hours: 4,
    status: "complete",
    lessons: [
      {
        title: "A name for every value",
        detail:
          "Keep numbers and strings apart. A length of stay of 7 and a length of stay of \"7\" will not behave the same later.",
        done: true,
      },
      {
        title: "Functions that decide",
        detail:
          "Write a function that takes one stay and returns a yes or a no, instead of burying the rule in a loop.",
        done: true,
      },
      {
        title: "Read a file, then look",
        detail:
          "Open a tiny CSV and print the first rows and the column names before you calculate anything.",
        done: true,
      },
      {
        title: "Refuse a stay that cannot exist",
        detail:
          "A negative length of stay is a data error, not a short admission. Stop and say so.",
        done: true,
      },
    ],
    checks: [
      "Tell a number from a string without guessing",
      "Wrap one clinical rule in a function",
      "Print the header of a file before you trust it",
    ],
    prompt: {
      title: "A stay that cannot be real",
      body: "Write a function that rejects a length of stay below zero. Return the reason as text so a later reader can see why the row was dropped.",
      sketch: `def check_stay(los_days: float) -> str | None:
    if los_days < 0:
        return "length of stay cannot be negative"
    return None

print(check_stay(-1))
print(check_stay(3))`,
    },
  },
  {
    slug: "tables-from-the-record",
    number: "02",
    title: "Tables from the record",
    focus: "Rows are encounters. Keep only the columns the question needs.",
    summary:
      "Encounters are rows. Units, timestamps, and length of stay are columns. Pandas is how you ask a cohort question without rewriting the file.",
    libraries: ["pandas"],
    hours: 6,
    status: "in-progress",
    lessons: [
      {
        title: "Load the encounters",
        detail:
          "Read a CSV of stays and confirm the row count and the column names match what you expected.",
        done: true,
      },
      {
        title: "Keep the columns the question needs",
        detail:
          "A length-of-stay question does not need every field in the extract. Select the few you will actually use.",
        done: true,
      },
      {
        title: "Filter a cohort",
        detail:
          "Keep stays longer than a week. Leave the other rows out of the way, and do not overwrite the original table.",
        done: false,
      },
      {
        title: "Group by admitting unit",
        detail:
          "Count the long stays in each unit, then check the total against the filtered table by hand.",
        done: false,
      },
    ],
    checks: [
      "Count encounters by admitting unit",
      "Keep only stays longer than 7 days",
      "Leave a blank lactate as blank — do not fill it with zero",
    ],
    prompt: {
      title: "Long stays, few columns",
      body: "Build a small encounters table with encounter_id, unit, los_days, and lactate. Filter to stays longer than 7 days and count them by unit. If lactate is empty, leave it empty. Do not point this practice at a real extract.",
      sketch: `import pandas as pd

encounters = pd.read_csv("encounters.csv")
long_stays = encounters.loc[
    encounters["los_days"] > 7,
    ["encounter_id", "unit", "los_days", "lactate"],
]
print(long_stays.groupby("unit").size())`,
    },
  },
  {
    slug: "arrays-behind-a-lab-panel",
    number: "03",
    title: "Arrays behind a lab panel",
    focus: "A basic panel is a vector. Find the column that is not a lab.",
    summary:
      "A basic metabolic panel is a row of numbers with units attached. NumPy is how you line those rows up and notice when a column is an identifier pretending to be a result.",
    libraries: ["NumPy"],
    hours: 5,
    status: "not-started",
    lessons: [
      {
        title: "A panel is a vector",
        detail:
          "Hold one patient's sodium, potassium, chloride, and bicarbonate in a single array, and keep the names beside it.",
        done: false,
      },
      {
        title: "Stack panels into a matrix",
        detail:
          "Several panels become a matrix. Rows are draws. Columns are assays. Say that out loud before you take a mean.",
        done: false,
      },
      {
        title: "Find the column that is not a lab",
        detail:
          "An encounter id will happily average if you let it. Drop identifiers before any summary.",
        done: false,
      },
      {
        title: "Summarize a column without a silent skip",
        detail:
          "A NaN in potassium should change your count. Print how many values were ignored.",
        done: false,
      },
    ],
    checks: [
      "Name each column of the panel before you compute",
      "Drop identifiers from the numeric block",
      "Report how many values a mean skipped",
    ],
    prompt: {
      title: "Means that skip a hole",
      body: "Stack three tiny panels and take the mean of each assay. Print the count of non-missing values next to the mean so a blank is visible.",
      sketch: `import numpy as np

# columns: sodium, potassium, chloride
panels = np.array([
    [138, 4.1, 102],
    [141, np.nan, 100],
    [136, 3.6, 104],
])
means = np.nanmean(panels, axis=0)
counted = np.sum(~np.isnan(panels), axis=0)
print(means)
print(counted)`,
    },
  },
  {
    slug: "missing-values-on-purpose",
    number: "04",
    title: "Missing values, on purpose",
    focus: "A blank lactate is not a lactate of zero.",
    summary:
      "Empty cells are part of the record. This module is about counting them, guessing why they are empty, and refusing fills that invent a result.",
    libraries: ["pandas"],
    hours: 5,
    status: "not-started",
    lessons: [
      {
        title: "Blank is not zero",
        detail:
          "Replace nothing yet. First mark which cells are empty, including strings like \"NA\" and \"not done\".",
        done: false,
      },
      {
        title: "Count what is missing, by column",
        detail:
          "A column missing half its values is a different problem from a column missing two.",
        done: false,
      },
      {
        title: "Ask why lactate is empty",
        detail:
          "Write one sentence of mechanism: not ordered, not resulted, or lost in the export. The sentence comes before the fill.",
        done: false,
      },
      {
        title: "Choose a fill only after you can defend it",
        detail:
          "If you still impute, keep a column that records the fill so the invented value stays visible.",
        done: false,
      },
    ],
    checks: [
      "Count missing values per column",
      "Write why one important lab is blank",
      "Keep a flag wherever you invent a value",
    ],
    prompt: {
      title: "Do not quietly fill lactate",
      body: "Count missing lactate values. Add a boolean column for the blanks. Only if you can say why they are blank may you add a filled column — and leave the original column untouched.",
      sketch: `missing = encounters["lactate"].isna()
encounters = encounters.assign(lactate_missing=missing)
print(int(missing.sum()), "blank lactate results")
# filled values, if you defend them, go in a new column
# encounters["lactate_filled"] = ...`,
    },
    caution:
      "Filling a blank with the column mean invents a lab result. Leave the blank until you can say why it is blank.",
  },
  {
    slug: "figures-a-clinician-can-read",
    number: "05",
    title: "Figures a clinician can read",
    focus: "One question, one figure, units on the axis.",
    summary:
      "A chart in this studio has to survive being read by someone who was not in the notebook. Units, a title that states the finding, and no second question sneaking in.",
    libraries: ["matplotlib"],
    hours: 5,
    status: "not-started",
    lessons: [
      {
        title: "One question, one figure",
        detail:
          "If the title needs the word \"and\", you probably drew two questions. Split them.",
        done: false,
      },
      {
        title: "Put the unit on the axis",
        detail:
          "Heart rate in beats per minute, length of stay in days. A naked number is not a clinical figure.",
        done: false,
      },
      {
        title: "Title the finding, not the chart type",
        detail:
          "\"Weekday admissions are higher than weekend admissions\" beats \"Bar chart of admissions\".",
        done: false,
      },
      {
        title: "A small multiple for two wards",
        detail:
          "Same scale, same order, two panels. Let the eye compare without a legend doing all the work.",
        done: false,
      },
    ],
    checks: [
      "State the question in one sentence before you plot",
      "Label every axis with a unit",
      "Read the title aloud and see if it claims the finding",
    ],
    prompt: {
      title: "A bar chart with a unit",
      body: "Plot admission counts by weekday from a small table you type yourself. Title it with the pattern you see, and put \"admissions\" on the value axis.",
      sketch: `import matplotlib.pyplot as plt

days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
counts = [18, 22, 19, 24, 21, 14, 10]
plt.bar(days, counts)
plt.ylabel("Admissions")
plt.title("Weekday admissions outnumber the weekend")
plt.show()`,
    },
  },
  {
    slug: "compare-two-groups",
    number: "06",
    title: "Compare two groups carefully",
    focus: "A picture, a spread, and a sentence you are allowed to write.",
    summary:
      "Two wards, one outcome. Look at the distributions before any test, then say only what the comparison can support.",
    libraries: ["pandas", "statistics"],
    hours: 6,
    status: "not-started",
    lessons: [
      {
        title: "Mean, median, and the spread",
        detail:
          "A mean length of stay can hide a handful of very long stays. Report the median and a spread beside it.",
        done: false,
      },
      {
        title: "A picture before a test",
        detail:
          "Draw both groups on a shared scale. If the picture is ambiguous, the test will not rescue it.",
        done: false,
      },
      {
        title: "What the interval is saying",
        detail:
          "A confidence interval is a range for a summary, not a promise about the next patient.",
        done: false,
      },
      {
        title: "The sentence you are allowed to write",
        detail:
          "Practice writing one cautious sentence and one sentence you will not write.",
        done: false,
      },
    ],
    checks: [
      "Report median and spread, not only the mean",
      "Plot both groups before you run a test",
      "Write the sentence you are refusing to claim",
    ],
    prompt: {
      title: "Two wards, one outcome",
      body: "Compare length of stay for two made-up wards. Print the median of each. Then write one sentence you would stand behind and one you would not.",
      sketch: `import statistics as stats

ward_a = [1, 2, 2, 3, 3, 4, 14]
ward_b = [2, 2, 3, 3, 3, 4, 5]
print("A median", stats.median(ward_a), "B median", stats.median(ward_b))
# Stand behind: the middle stay is similar.
# Do not write: ward A is worse for patients.`,
    },
  },
  {
    slug: "a-practice-risk-score",
    number: "07",
    title: "A practice risk score",
    focus: "Fit a small model, then list how it could mislead you.",
    summary:
      "A first logistic model on a synthetic readmission table. The point is to read a coefficient slowly and to write down how the score could be wrong.",
    libraries: ["scikit-learn"],
    hours: 6,
    status: "not-started",
    lessons: [
      {
        title: "A yes or no outcome on synthetic rows",
        detail:
          "Build a tiny table: age band, prior admission, length of stay, and a made-up readmission flag.",
        done: false,
      },
      {
        title: "Fit a small logistic model",
        detail:
          "Use a few rows you can still inspect. If you cannot explain a row, do not train on it.",
        done: false,
      },
      {
        title: "Read a coefficient without performing certainty",
        detail:
          "Say what a coefficient points at in this table. Do not promote it to a clinical effect.",
        done: false,
      },
      {
        title: "Three ways this score could mislead you",
        detail:
          "Leakage, a tiny sample, and a label that is not the event you think it is. Write them down next to the accuracy.",
        done: false,
      },
    ],
    checks: [
      "Train only on rows you typed or fully understand",
      "Read one coefficient in plain language",
      "List three ways the score could mislead you",
    ],
    prompt: {
      title: "Accuracy is not the assignment",
      body: "Fit a logistic model on a toy readmission table. Beside the accuracy, write three specific ways the number could still be a bad guide.",
      sketch: `from sklearn.linear_model import LogisticRegression

# prior_admission, los_days  ->  readmitted (made-up bits)
X = [[0, 2], [1, 3], [1, 10], [0, 4], [1, 8], [0, 1]]
y = [0, 0, 1, 0, 1, 0]
model = LogisticRegression().fit(X, y)
print(round(model.score(X, y), 2))
print("coefficients", model.coef_)`,
    },
    caution:
      "This model is practice on synthetic rows. It is not a score to show a clinician, and it is not a reason to change anyone's care.",
  },
]

export function getModule(slug: string) {
  return modules.find((mod) => mod.slug === slug)
}

export function lessonProgress(mod: StudyModule) {
  const done = mod.lessons.filter((lesson) => lesson.done).length
  const currentIndex = mod.lessons.findIndex((lesson) => !lesson.done)
  return {
    done,
    total: mod.lessons.length,
    currentIndex: currentIndex === -1 ? null : currentIndex,
  }
}

export function journeyStats() {
  const lessons = modules.flatMap((mod) => mod.lessons)
  const current = modules.find((mod) => mod.status === "in-progress") ?? null
  return {
    lessonsDone: lessons.filter((lesson) => lesson.done).length,
    lessonsTotal: lessons.length,
    finishedModules: modules.filter((mod) => mod.status === "complete").length,
    moduleCount: modules.length,
    hours: modules.reduce((sum, mod) => sum + mod.hours, 0),
    current,
  }
}
