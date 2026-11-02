const DRAFT_EVENT = "atrium-lesson-code";
const sessionDrafts = new Map<string, string>();

export function lessonDraftKey(lessonId: string) {
  return `atrium.lesson.${lessonId}`;
}

export function readLessonDraft(lessonId: string, fallback: string): string {
  const session = sessionDrafts.get(lessonId);
  if (session !== undefined) return session;
  try {
    if (typeof localStorage === "undefined") return fallback;
    return localStorage.getItem(lessonDraftKey(lessonId)) ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeLessonDraft(lessonId: string, value: string) {
  sessionDrafts.set(lessonId, value);
  try {
    localStorage.setItem(lessonDraftKey(lessonId), value);
  } catch {
    // Storage can be full or blocked. The draft still lives for this page.
  }
  window.dispatchEvent(new CustomEvent(DRAFT_EVENT, { detail: lessonId }));
}

export function clearLessonDraft(lessonId: string) {
  sessionDrafts.delete(lessonId);
  try {
    localStorage.removeItem(lessonDraftKey(lessonId));
  } catch {
    // Ignore a blocked store. The in-memory draft is already gone.
  }
  window.dispatchEvent(new CustomEvent(DRAFT_EVENT, { detail: lessonId }));
}

export function subscribeLessonDraft(lessonId: string, onChange: () => void) {
  const handler = (event: Event) => {
    if (event instanceof CustomEvent && event.detail !== lessonId) return;
    if (event instanceof StorageEvent && event.key !== lessonDraftKey(lessonId)) return;
    onChange();
  };
  window.addEventListener(DRAFT_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(DRAFT_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
