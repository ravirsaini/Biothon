const INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/";
const SCRIPT_URL = `${INDEX_URL}pyodide.js`;

type PyProxyLike = {
  toString: () => string;
  destroy?: () => void;
};

type PyodideRuntime = {
  loadPackage: (name: string | string[]) => Promise<unknown>;
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
  images: string[];
};

const MATPLOTLIB_SETUP = `
import matplotlib
matplotlib.use("Agg", force=True)
import matplotlib.pyplot as plt

def __atrium_show(*args, **kwargs):
    return None

plt.show = __atrium_show
`;

const RUNNER = `
import json
import sys
from io import StringIO

def __atrium_collect_figures():
    if "matplotlib.pyplot" not in sys.modules:
        return []
    import base64
    from io import BytesIO
    import matplotlib.pyplot as plt

    images = []
    for num in list(plt.get_fignums()):
        fig = plt.figure(num)
        buf = BytesIO()
        try:
            import warnings
            with warnings.catch_warnings():
                # Matplotlib 3.10 warns on every Agg text draw. The coordinates are already integers.
                warnings.filterwarnings(
                    "ignore",
                    message=r"The [xy] parameter as float was deprecated",
                )
                fig.savefig(buf, format="png", facecolor="white")
            images.append(base64.b64encode(buf.getvalue()).decode("ascii"))
        except Exception as exc:
            print(f"Could not save figure: {exc}", file=sys.stderr)
        finally:
            plt.close(fig)
    return images

__atrium_stdout = StringIO()
__atrium_stderr = StringIO()
__atrium_prev_out = sys.stdout
__atrium_prev_err = sys.stderr
sys.stdout = __atrium_stdout
sys.stderr = __atrium_stderr
__atrium_ok = True
__atrium_images = []
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
    try:
        __atrium_images = __atrium_collect_figures()
    except Exception:
        import traceback
        traceback.print_exc(file=__atrium_stderr)
    sys.stdout = __atrium_prev_out
    sys.stderr = __atrium_prev_err

json.dumps({
    "stdout": __atrium_stdout.getvalue(),
    "stderr": __atrium_stderr.getvalue(),
    "ok": __atrium_ok,
    "images": __atrium_images,
})
`;

let runtime: Promise<PyodideRuntime> | null = null;
let queue: Promise<unknown> = Promise.resolve();

function usesMatplotlib(code: string): boolean {
  return /^\s*(?:import\s+matplotlib\b|from\s+matplotlib\b)/m.test(code);
}

function usesSklearn(code: string): boolean {
  return /^\s*(?:import\s+sklearn\b|from\s+sklearn\b)/m.test(code);
}

function pngSources(images: unknown): string[] {
  if (!Array.isArray(images)) return [];
  return images
    .filter((item): item is string => typeof item === "string" && /^[A-Za-z0-9+/=]+$/.test(item))
    .slice(0, 6)
    .map((item) => `data:image/png;base64,${item}`);
}

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
  if (usesMatplotlib(code)) {
    onStatus?.("Loading matplotlib…");
    await pyodide.loadPackage("matplotlib");
    onStatus?.("Preparing matplotlib…");
    await pyodide.runPythonAsync(MATPLOTLIB_SETUP);
  }
  if (usesSklearn(code)) {
    onStatus?.("Loading scikit-learn…");
    await pyodide.loadPackage("scikit-learn");
  }
  onStatus?.("Running…");
  pyodide.globals.set("__atrium_code", code);
  try {
    const raw = await pyodide.runPythonAsync(RUNNER);
    const parsed = JSON.parse(asString(raw)) as PythonRun;
    return {
      stdout: parsed.stdout ?? "",
      stderr: parsed.stderr ?? "",
      ok: Boolean(parsed.ok),
      images: pngSources(parsed.images),
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
