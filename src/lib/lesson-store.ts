"use client"

import { useSyncExternalStore } from "react"

const CHANGE = "atrium-lesson-store"
const PROGRESS_KEY = "atrium.lesson.progress"
const draftKey = (lessonId: string) => `atrium.lesson.${lessonId}`

const none: readonly string[] = []

// localStorage can throw (private mode, quota), so each value also lives in
// memory and the UI keeps working for the current page.
const drafts = new Map<string, string>()
let completed: readonly string[] | null = null

function read(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {}
  window.dispatchEvent(new Event(CHANGE))
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    // Another tab wrote progress, so drop the cached list.
    if (event.key === PROGRESS_KEY) completed = null
    if (event.key?.startsWith("atrium.lesson.")) drafts.clear()
    onChange()
  }
  window.addEventListener(CHANGE, onChange)
  window.addEventListener("storage", onStorage)
  return () => {
    window.removeEventListener(CHANGE, onChange)
    window.removeEventListener("storage", onStorage)
  }
}

function loadCompleted(): readonly string[] {
  if (completed) return completed
  try {
    const parsed: unknown = JSON.parse(read(PROGRESS_KEY) ?? "[]")
    const ids = Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : []
    completed = ids.length ? ids : none
  } catch {
    completed = none
  }
  return completed
}

export function useLessonDraft(lessonId: string, fallback: string) {
  const code = useSyncExternalStore(
    subscribe,
    () => drafts.get(lessonId) ?? read(draftKey(lessonId)) ?? fallback,
    () => fallback,
  )

  function save(next: string) {
    drafts.set(lessonId, next)
    write(draftKey(lessonId), next)
  }

  function reset() {
    drafts.delete(lessonId)
    write(draftKey(lessonId), null)
  }

  return [code, save, reset] as const
}

export function useCompletedLessons() {
  const ids = useSyncExternalStore(subscribe, loadCompleted, () => none)

  function complete(lessonId: string) {
    const current = loadCompleted()
    if (current.includes(lessonId)) return
    completed = [...current, lessonId]
    write(PROGRESS_KEY, JSON.stringify(completed))
  }

  return [ids, complete] as const
}
