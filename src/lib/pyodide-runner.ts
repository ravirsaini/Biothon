const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/"

type PyFunction = ((...args: unknown[]) => unknown) & { destroy(): void }

type Pyodide = {
  loadPackage(names: string | string[]): Promise<unknown>
  loadPackagesFromImports(
    code: string,
    options?: { messageCallback?: (message: string) => void },
  ): Promise<unknown>
  runPython(code: string): unknown
  globals: { get(name: string): PyFunction }
}

declare global {
  interface Window {
    loadPyodide?: (options: { indexURL: string }) => Promise<Pyodide>
  }
}

export type PythonRun = {
  stdout: string
  stderr: string
  ok: boolean
  images: string[]
}

// Runs user code with stdout/stderr swapped for buffers, then saves every open
// matplotlib figure as a base64 PNG. The result comes back as one JSON string.
const HARNESS = `
import base64, json, sys, traceback, warnings
from io import BytesIO, StringIO

def _figures():
    if "matplotlib.pyplot" not in sys.modules:
        return []
    import matplotlib.pyplot as plt
    images = []
    for num in plt.get_fignums():
        fig = plt.figure(num)
        buf = BytesIO()
        try:
            with warnings.catch_warnings():
                # Matplotlib 3.10 warns on every Agg text draw even though the coordinates are ints.
                warnings.filterwarnings("ignore", message=r"The [xy] parameter as float was deprecated")
                fig.savefig(buf, format="png", facecolor="white")
            images.append(base64.b64encode(buf.getvalue()).decode("ascii"))
        except Exception as exc:
            print(f"Could not save figure: {exc}", file=sys.stderr)
        finally:
            plt.close(fig)
    return images

def _atrium_run(code):
    out, err = StringIO(), StringIO()
    ok, images = True, []
    saved = sys.stdout, sys.stderr
    sys.stdout, sys.stderr = out, err
    try:
        exec(code, {"__name__": "__main__"})
    except BaseException:
        kind, exc, tb = sys.exc_info()
        # Skip this frame so the traceback starts at the user's code.
        traceback.print_exception(kind, exc, tb.tb_next if tb else None, file=err)
        ok = False
    finally:
        try:
            images = _figures()
        except Exception:
            traceback.print_exc(file=err)
        sys.stdout, sys.stderr = saved
    return json.dumps({"stdout": out.getvalue(), "stderr": err.getvalue(), "ok": ok, "images": images})
`

// No display in the browser: draw off-screen and let the harness collect figures.
const MATPLOTLIB_SETUP = `
import matplotlib
matplotlib.use("Agg", force=True)
import matplotlib.pyplot as plt
plt.show = lambda *args, **kwargs: None
`

let pyodide: Promise<Pyodide> | null = null
let matplotlibReady = false
let queue: Promise<unknown> = Promise.resolve()

function imports(code: string, name: string) {
  return new RegExp(`^\\s*(?:import|from)\\s+${name}\\b`, "m").test(code)
}

function loadScript() {
  if (window.loadPyodide) return Promise.resolve()
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script")
    script.src = `${PYODIDE_URL}pyodide.js`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Could not load Pyodide from the CDN."))
    document.head.appendChild(script)
  })
}

function loadPyodide() {
  pyodide ??= loadScript()
    .then(() => {
      if (!window.loadPyodide) throw new Error("Pyodide did not start.")
      return window.loadPyodide({ indexURL: PYODIDE_URL })
    })
    .then((py) => {
      py.runPython(HARNESS)
      return py
    })
    .catch((error) => {
      pyodide = null
      throw error
    })
  return pyodide
}

async function execute(code: string, onStatus: (message: string) => void): Promise<PythonRun> {
  onStatus("Loading Python from the CDN…")
  const py = await loadPyodide()

  onStatus("Loading packages…")
  await py.loadPackagesFromImports(code, { messageCallback: onStatus })
  if (imports(code, "matplotlib")) {
    onStatus("Loading matplotlib…")
    await py.loadPackage("matplotlib")
    if (!matplotlibReady) {
      onStatus("Preparing matplotlib…")
      py.runPython(MATPLOTLIB_SETUP)
      matplotlibReady = true
    }
  }
  if (imports(code, "sklearn")) {
    onStatus("Loading scikit-learn…")
    await py.loadPackage("scikit-learn")
  }

  onStatus("Running…")
  const run = py.globals.get("_atrium_run")
  try {
    const result = JSON.parse(String(run(code))) as Partial<PythonRun>
    return {
      stdout: result.stdout ?? "",
      stderr: result.stderr ?? "",
      ok: Boolean(result.ok),
      images: (result.images ?? [])
        .slice(0, 6)
        .map((png) => `data:image/png;base64,${png}`),
    }
  } finally {
    run.destroy()
  }
}

// One interpreter per page, so runs are queued rather than interleaved.
export function runPython(code: string, onStatus: (message: string) => void = () => {}) {
  const job = queue.then(() => execute(code, onStatus))
  queue = job.catch(() => {})
  return job
}
