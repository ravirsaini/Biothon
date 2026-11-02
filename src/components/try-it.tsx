"use client"

import { useState, type KeyboardEvent } from "react"

import { Button } from "@/components/ui/button"
import { useLessonDraft } from "@/lib/lesson-store"
import { runPython, type PythonRun } from "@/lib/pyodide-runner"
import { cn } from "cn"

type Status =
  | { phase: "idle" }
  | { phase: "running"; message: string }
  | { phase: "done"; result: PythonRun }
  | { phase: "failed"; message: string }

export function TryIt({
  lessonId,
  code,
  onComplete,
}: {
  lessonId: string
  code: string
  onComplete: () => void
}) {
  const [source, save, reset] = useLessonDraft(lessonId, code)
  const [status, setStatus] = useState<Status>({ phase: "idle" })
  const running = status.phase === "running"

  async function run() {
    setStatus({ phase: "running", message: "Loading Python from the CDN…" })
    try {
      const result = await runPython(source, (message) => setStatus({ phase: "running", message }))
      setStatus({ phase: "done", result })
    } catch (error) {
      setStatus({
        phase: "failed",
        message: error instanceof Error ? error.message : "Python failed to start.",
      })
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Tab") {
      event.preventDefault()
      const el = event.currentTarget
      const { selectionStart: start, selectionEnd: end } = el
      save(`${source.slice(0, start)}    ${source.slice(end)}`)
      requestAnimationFrame(() => el.setSelectionRange(start + 4, start + 4))
    } else if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault()
      if (!running) run()
    }
  }

  return (
    <div className="mt-4 overflow-hidden rounded-md border border-[#0c1614]">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#1f6b45] px-3 py-2 text-white">
        <p className="text-sm font-medium">Try it Yourself</p>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            type="button"
            onClick={reset}
            disabled={running || source === code}
            className="h-8 bg-transparent px-2.5 text-xs text-white hover:bg-white/15"
          >
            Reset to Default
          </Button>
          <Button
            type="button"
            onClick={onComplete}
            disabled={running}
            className="h-8 bg-white/15 px-2.5 text-xs text-white hover:bg-white/25"
          >
            Mark as Completed
          </Button>
          <Button
            type="button"
            onClick={run}
            disabled={running}
            aria-busy={running}
            className="h-8 bg-white px-3 text-[#1f6b45] hover:bg-white/90"
          >
            {running ? "Running…" : "Run"}
          </Button>
        </div>
      </div>
      <div className="grid xl:grid-cols-2">
        <label className="block border-b border-border xl:border-r xl:border-b-0">
          <span className="sr-only">Python code</span>
          <textarea
            value={source}
            onChange={(event) => save(event.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            wrap="off"
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="Python code"
            className="min-h-80 w-full resize-y overflow-auto bg-[#f7f4ec] px-4 py-4 font-mono text-[13px] leading-6 whitespace-pre text-foreground outline-none"
          />
        </label>
        <div className="flex min-h-80 min-w-0 flex-col">
          <Terminal status={status} />
          <Plots status={status} />
        </div>
      </div>
    </div>
  )
}

function terminalNote(status: Status) {
  switch (status.phase) {
    case "idle":
      return "Run the code to see print output here."
    case "running":
    case "failed":
      return status.message
    case "done": {
      const { stdout, stderr, images } = status.result
      if (stdout || stderr) return ""
      return images.length > 0 ? "No printed output." : "(no output)"
    }
  }
}

function Terminal({ status }: { status: Status }) {
  const result = status.phase === "done" ? status.result : null
  const failed = status.phase === "failed" || result?.ok === false
  const note = terminalNote(status)
  const stdout = result?.stdout ?? ""
  const stderr = result?.stderr ?? ""

  return (
    <div className="flex min-h-32 flex-1 flex-col bg-[#142421]" aria-live="polite">
      <p className="px-4 pt-3 font-mono text-[11px] tracking-[0.14em] text-[#8ea199] uppercase">
        Terminal
      </p>
      <pre
        role="log"
        aria-label="Terminal output"
        className={cn(
          "flex-1 overflow-auto px-4 py-3 font-mono text-[13px] leading-6 whitespace-pre",
          failed ? "text-[#e29478]" : "text-[#d7ebe3]",
        )}
      >
        {note && <span className={failed ? undefined : "text-[#8ea199]"}>{note}</span>}
        {stdout && <span className="text-[#d7ebe3]">{stdout}</span>}
        {stdout && stderr && !stdout.endsWith("\n") && "\n"}
        {stderr && <span className="text-[#e29478]">{stderr}</span>}
      </pre>
    </div>
  )
}

function Plots({ status }: { status: Status }) {
  const images = status.phase === "done" ? status.result.images : []

  return (
    <div className="border-t border-[#0c1614] bg-[#f7f4ec]" aria-label="Plots">
      <p className="px-4 pt-3 font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
        Plots
      </p>
      {images.length === 0 ? (
        <p className="px-4 pt-1 pb-3 text-xs leading-5 text-muted-foreground">
          {status.phase === "running"
            ? "Waiting for figures…"
            : "Plots appear here when the code draws a figure."}
        </p>
      ) : (
        <div className="flex flex-col gap-3 px-4 py-3">
          {images.map((src, index) => (
            // next/image can't optimize data URLs.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={index}
              src={src}
              alt={`Plot ${index + 1}`}
              className="h-auto w-full rounded-md border border-border bg-white"
            />
          ))}
        </div>
      )}
    </div>
  )
}
