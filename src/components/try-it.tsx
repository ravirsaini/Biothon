"use client"

import { useState, type KeyboardEvent } from "react"

import { Button } from "@/components/ui/button"
import { runPython, type PythonRun } from "@/lib/pyodide-runner"
import { cn } from "cn"

type RunView =
  | { phase: "idle" }
  | { phase: "working"; message: string }
  | { phase: "done"; result: PythonRun }
  | { phase: "failed"; message: string };

export function TryIt({ code }: { code: string }) {
  const [source, setSource] = useState(code);
  const [view, setView] = useState<RunView>({ phase: "idle" });
  const busy = view.phase === "working";

  async function run() {
    setView({ phase: "working", message: "Loading Python from the CDN…" });
    try {
      const result = await runPython(source, (message) => {
        setView({ phase: "working", message });
      });
      setView({ phase: "done", result });
    } catch (error) {
      setView({
        phase: "failed",
        message: error instanceof Error ? error.message : "Python failed to start.",
      });
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Tab") {
      event.preventDefault();
      const el = event.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = `${source.slice(0, start)}    ${source.slice(end)}`;
      setSource(next);
      requestAnimationFrame(() => {
        el.selectionStart = start + 4;
        el.selectionEnd = start + 4;
      });
      return;
    }
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      if (!busy) void run();
    }
  }

  return (
    <div className="mt-4 overflow-hidden rounded-md border border-[#0c1614]">
      <div className="flex items-center justify-between gap-3 bg-[#1f6b45] px-3 py-2 text-white">
        <p className="text-sm font-medium">Try it Yourself</p>
        <Button
          type="button"
          onClick={() => void run()}
          disabled={busy}
          aria-busy={busy}
          className="h-8 bg-white px-3 text-[#1f6b45] hover:bg-white/90"
        >
          {busy ? "Running…" : "Run"}
        </Button>
      </div>
      <div className="grid xl:grid-cols-2">
        <label className="block border-b border-border xl:border-r xl:border-b-0">
          <span className="sr-only">Python code</span>
          <textarea
            value={source}
            onChange={(event) => setSource(event.target.value)}
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
          <Terminal view={view} />
          <Plots view={view} />
        </div>
      </div>
    </div>
  );
}

function Terminal({ view }: { view: RunView }) {
  const failed = view.phase === "failed" || (view.phase === "done" && !view.result.ok);
  let stdout = "";
  let stderr = "";
  let note = "Run the code to see print output here.";

  if (view.phase === "working") note = view.message;
  if (view.phase === "failed") note = view.message;
  if (view.phase === "done") {
    stdout = view.result.stdout;
    stderr = view.result.stderr;
    if (!stdout && !stderr) {
      note = view.result.images.length > 0 ? "No printed output." : "(no output)";
    } else note = "";
  }

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
        {note ? <span className={failed ? undefined : "text-[#8ea199]"}>{note}</span> : null}
        {stdout ? <span className="text-[#d7ebe3]">{stdout}</span> : null}
        {stdout && stderr && !stdout.endsWith("\n") ? "\n" : null}
        {stderr ? <span className="text-[#e29478]">{stderr}</span> : null}
      </pre>
    </div>
  );
}

function Plots({ view }: { view: RunView }) {
  const images = view.phase === "done" ? view.result.images : [];
  const waiting = view.phase === "working";

  return (
    <div className="border-t border-[#0c1614] bg-[#f7f4ec]" aria-label="Plots">
      <p className="px-4 pt-3 font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
        Plots
      </p>
      {images.length === 0 ? (
        <p className="px-4 pt-1 pb-3 text-xs leading-5 text-muted-foreground">
          {waiting ? "Waiting for figures…" : "Plots appear here when the code draws a figure."}
        </p>
      ) : (
        <div className="flex flex-col gap-3 px-4 py-3">
          {images.map((src, index) => (
            // Data-URL PNGs from the in-browser runtime. next/image cannot optimize them.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${index}-${src.slice(-24)}`}
              src={src}
              alt={`Plot ${index + 1}`}
              className="h-auto w-full rounded-md border border-border bg-white"
            />
          ))}
        </div>
      )}
    </div>
  );
}
