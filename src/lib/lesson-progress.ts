const PROGRESS_KEY = "atrium.lesson.progress";
const PROGRESS_EVENT = "atrium-lesson-progress";

export const noCompletedLessons: readonly string[] = [];

let snapshot: readonly string[] = noCompletedLessons;
let snapshotReady = false;

function readStored(): readonly string[] {
  try {
    if (typeof localStorage === "undefined") return noCompletedLessons;
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return noCompletedLessons;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return noCompletedLessons;
    const ids = parsed.filter((id): id is string => typeof id === "string");
    return ids.length === 0 ? noCompletedLessons : ids;
  } catch {
    return noCompletedLessons;
  }
}

export function getCompletedLessonIds(): readonly string[] {
  if (typeof window === "undefined") return noCompletedLessons;
  if (!snapshotReady) {
    snapshot = readStored();
    snapshotReady = true;
  }
  return snapshot;
}

export function markLessonComplete(lessonId: string) {
  const current = getCompletedLessonIds();
  if (!current.includes(lessonId)) {
    snapshot = [...current, lessonId];
    snapshotReady = true;
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(snapshot));
    } catch {
      // Storage can be blocked. The checkmark still updates for this page.
    }
  }
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

export function subscribeLessonProgress(onChange: () => void) {
  const onCustom = () => onChange();
  const onStorage = (event: StorageEvent) => {
    if (event.key !== PROGRESS_KEY) return;
    snapshotReady = false;
    onChange();
  };
  window.addEventListener(PROGRESS_EVENT, onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(PROGRESS_EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}
