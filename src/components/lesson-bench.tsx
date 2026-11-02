"use client"

import { useState } from "react"

import { PythonCode } from "@/components/python-code"
import { Button } from "@/components/ui/button"
import { tutorialTopics } from "@/lib/tutorial"
import { cn } from "cn"

export function LessonBench() {
  const [topicId, setTopicId] = useState(tutorialTopics[0].id)
  const [tried, setTried] = useState(false)
  const topic = tutorialTopics.find((item) => item.id === topicId) ?? tutorialTopics[0]

  function selectTopic(id: string) {
    setTopicId(id)
    setTried(false)
  }

  return (
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
                  onClick={() => selectTopic(item.id)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block w-full border-l-4 px-4 py-2.5 text-left text-sm transition-colors",
                    active
                      ? "border-primary bg-card font-medium text-foreground"
                      : "border-transparent text-foreground/80 hover:bg-black/5"
                  )}
                >
                  {item.title}
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
          <div
            className="mt-4 rounded-md border border-dashed border-border bg-muted/60 px-4 py-4"
            role="status"
          >
            <p className="text-sm font-medium">Editor placeholder</p>
            <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
              Try it Yourself does not run Python in the browser. Copy the example into a notebook when you want to change it.
            </p>
          </div>
        ) : (
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            The button is a placeholder for an exercise editor.
          </p>
        )}

        <h2 className="mt-8 text-2xl tracking-tight">Exercise</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6">{topic.exercise}</p>
      </article>
    </div>
  )
}
