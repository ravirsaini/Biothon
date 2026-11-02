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
        <Terminal view={view} />
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
    if (!stdout && !stderr) note = "(no output)";
    else note = "";
  }

  return (
    <div className="flex min-h-80 flex-col bg-[#142421]" aria-live="polite">
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
