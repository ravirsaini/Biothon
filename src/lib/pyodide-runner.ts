const INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/";
const SCRIPT_URL = `${INDEX_URL}pyodide.js`;

type PyProxyLike = {
  toString: () => string;
  destroy?: () => void;
};

type PyodideRuntime = {
  loadPackagesFromImports: (
    code: string,
    options?: {
      messageCallback?: (message: string) => void;
      errorCallback?: (message: string) => void;
    },
  ) => Promise<unknown>;
  runPythonAsync: (code: string) => Promise<unknown>;
  globals: {
    set: (key: string, value: unknown) => void;
  };
};

type LoadPyodide = (options?: { indexURL?: string }) => Promise<PyodideRuntime>;

declare global {
  interface Window {
    loadPyodide?: LoadPyodide;
  }
}

export type PythonRun = {
  stdout: string;
  stderr: string;
  ok: boolean;
};

const RUNNER = `
import json
import sys
from io import StringIO

__atrium_stdout = StringIO()
__atrium_stderr = StringIO()
__atrium_prev_out = sys.stdout
__atrium_prev_err = sys.stderr
sys.stdout = __atrium_stdout
sys.stderr = __atrium_stderr
__atrium_ok = True
try:
    exec(__atrium_code, {"__name__": "__main__"})
except BaseException:
    import traceback
    __atrium_type, __atrium_exc, __atrium_tb = sys.exc_info()
    if __atrium_tb is not None:
        __atrium_tb = __atrium_tb.tb_next
    traceback.print_exception(__atrium_type, __atrium_exc, __atrium_tb, file=__atrium_stderr)
    __atrium_ok = False
finally:
    sys.stdout = __atrium_prev_out
    sys.stderr = __atrium_prev_err

json.dumps({
    "stdout": __atrium_stdout.getvalue(),
    "stderr": __atrium_stderr.getvalue(),
    "ok": __atrium_ok,
})
`;

let runtime: Promise<PyodideRuntime> | null = null;
let queue: Promise<unknown> = Promise.resolve();

function asString(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "toString" in value) {
    const proxy = value as PyProxyLike;
    const text = proxy.toString();
    proxy.destroy?.();
    return text;
  }
  return String(value);
}

function injectScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Python runs in the browser."));
  }
  if (window.loadPyodide) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const fail = () => reject(new Error("Could not load Pyodide from the CDN."));
    const existing = document.querySelector<HTMLScriptElement>(`script[data-pyodide="true"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", fail, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.dataset.pyodide = "true";
    script.onload = () => resolve();
    script.onerror = fail;
    document.head.appendChild(script);
  });
}

export function loadPyodideRuntime(): Promise<PyodideRuntime> {
  if (!runtime) {
    runtime = (async () => {
      await injectScript();
      if (!window.loadPyodide) {
        throw new Error("Pyodide did not start.");
      }
      return window.loadPyodide({ indexURL: INDEX_URL });
    })();
    runtime.catch(() => {
      runtime = null;
    });
  }
  return runtime;
}

async function execute(
  code: string,
  onStatus?: (message: string) => void,
): Promise<PythonRun> {
  onStatus?.("Loading Python from the CDN…");
  const pyodide = await loadPyodideRuntime();
  onStatus?.("Loading packages…");
  await pyodide.loadPackagesFromImports(code, {
    messageCallback: (message) => onStatus?.(message),
  });
  onStatus?.("Running…");
  pyodide.globals.set("__atrium_code", code);
  try {
    const raw = await pyodide.runPythonAsync(RUNNER);
    const parsed = JSON.parse(asString(raw)) as PythonRun;
    return {
      stdout: parsed.stdout ?? "",
      stderr: parsed.stderr ?? "",
      ok: Boolean(parsed.ok),
    };
  } finally {
    pyodide.globals.set("__atrium_code", "");
  }
}

export function runPython(
  code: string,
  onStatus?: (message: string) => void,
): Promise<PythonRun> {
  const job = queue.then(() => execute(code, onStatus));
  queue = job.then(
    () => undefined,
    () => undefined,
  );
  return job;
}
