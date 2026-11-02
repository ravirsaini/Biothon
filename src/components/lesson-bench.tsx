"use client"

import { useState, useSyncExternalStore } from "react"
import { Check } from "lucide-react"

import { PythonCode } from "@/components/python-code"
import { TryIt } from "@/components/try-it"
import { Button } from "@/components/ui/button"
import {
  getCompletedLessonIds,
  markLessonComplete,
  noCompletedLessons,
  subscribeLessonProgress,
} from "@/lib/lesson-progress"
import { tutorialTopics } from "@/lib/tutorial"
import { cn } from "cn"

export function LessonBench() {
  const [topicId, setTopicId] = useState(tutorialTopics[0].id)
  const [tried, setTried] = useState(false)
  const completedIds = useSyncExternalStore(
    subscribeLessonProgress,
    getCompletedLessonIds,
    () => noCompletedLessons,
  )
  const topic = tutorialTopics.find((item) => item.id === topicId) ?? tutorialTopics[0]
  const completedCount = tutorialTopics.filter((item) => completedIds.includes(item.id)).length
  const percent =
    tutorialTopics.length === 0 ? 0 : Math.round((completedCount / tutorialTopics.length) * 100)

  function completeCurrent() {
    markLessonComplete(topic.id)
    const index = tutorialTopics.findIndex((item) => item.id === topic.id)
    const next = tutorialTopics[index + 1]
    if (next) setTopicId(next.id)
  }

  return (
    <div>
      <div className="mb-5">
        <div className="flex items-end justify-between gap-4">
          <p className="text-sm text-foreground">
            {completedCount} of {tutorialTopics.length} lessons completed
          </p>
          <p className="font-heading text-3xl leading-none tabular-nums tracking-tight">{percent}%</p>
        </div>
        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Completed lessons"
          aria-valuetext={`${percent} percent, ${completedCount} of ${tutorialTopics.length} lessons completed`}
        >
          <div
            className="h-full rounded-full bg-[#1f6b45] transition-[width] duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

    <div className="overflow-hidden rounded-md border border-border bg-card shadow-sm lg:grid lg:grid-cols-[15.5rem_minmax(0,1fr)]">
      <nav aria-label="Python topics" className="border-b border-border bg-[#f3f0e8] lg:border-r lg:border-b-0">
        <p className="px-4 py-3 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          Python
        </p>
        <ul>
          {tutorialTopics.map((item) => {
            const active = item.id === topic.id
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setTopicId(item.id)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex w-full items-center gap-3 border-l-4 px-4 py-2.5 text-left text-sm transition-colors",
                    active
                      ? "border-primary bg-card font-medium text-foreground"
                      : "border-transparent text-foreground/80 hover:bg-black/5"
                  )}
                >
                  <span className="min-w-0 flex-1">{item.title}</span>
                  {completedIds.includes(item.id) ? (
                    <>
                      <Check className="size-4 shrink-0 text-[#1f6b45]" aria-hidden="true" />
                      <span className="sr-only">Completed</span>
                    </>
                  ) : (
                    <span className="size-4 shrink-0" aria-hidden="true" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <article className="min-w-0 px-4 py-6 sm:px-6 md:px-8 md:py-8">
        <p className="text-xs font-medium tracking-[0.16em] text-clay uppercase">Lesson</p>
        <h1 className="mt-2 text-3xl tracking-tight md:text-4xl">{topic.title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{topic.summary}</p>

        {topic.note ? (
          <p className="mt-4 max-w-2xl rounded-md border border-clay/30 bg-clay-soft px-3 py-2 text-sm leading-6">
            {topic.note}
          </p>
        ) : null}

        <h2 className="mt-8 text-2xl tracking-tight">Example</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{topic.example}</p>

        <div className="mt-4 overflow-hidden rounded-md border border-[#0c1614]">
          <div className="flex items-center justify-between bg-[#0c1614] px-4 py-2 text-[11px] tracking-[0.14em] text-[#c9d5cf] uppercase">
            <span>Python</span>
            <span className="font-mono normal-case tracking-normal text-[#8ea199]">example.py</span>
          </div>
          <PythonCode code={topic.code} />
        </div>

        <Button
          type="button"
          onClick={() => setTried(true)}
          className="mt-3 h-10 bg-[#1f6b45] px-4 text-white hover:bg-[#1a5a3a]"
        >
          Try it Yourself
        </Button>

        {tried ? (
          <TryIt
            key={topic.id}
            lessonId={topic.id}
            code={topic.code}
            onCompleted={completeCurrent}
          />
        ) : (
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Opens an editor that runs this example in the browser. The first run downloads Python.
          </p>
        )}

        <h2 className="mt-8 text-2xl tracking-tight">Exercise</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6">{topic.exercise}</p>
      </article>
    </div>
    </div>
  )
}
