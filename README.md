# Atrium

A personal Python studio for a Healthcare Data Science journey. The desk keeps the current lesson in front of you, the modules hold the practice, and the dashboard is a chart bay for medical figures.

The charts use a fixed synthetic cohort (Ward B, 128 encounters). They are layout and teaching figures, not patient records.

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3847](http://localhost:3847).

## Pages

- `/` — welcome, the lesson on the desk, and the path
- `/modules` — a tutorial bench: topic menu, a highlighted example, and a Try it Yourself editor that runs Python in the browser
- `/modules/[slug]` — lessons, a notebook prompt, and what “done” means
- `/dashboard` — stat tiles, sample charts, and an open slot for the next figure

## Stack

Next.js, TypeScript, Tailwind CSS, and shadcn/ui. Sample chart data lives in `src/lib/cohort.ts`. The syllabus lives in `src/lib/curriculum.ts`. The modules page lessons live in `src/lib/tutorial.ts`.

Try it Yourself loads Pyodide from the jsDelivr CDN when you press Run. There is no Python server. The first run downloads the runtime, then any imported package such as pandas or matplotlib. Printed text appears in the terminal. A call to `plt.show()`, or any figure left open, is saved as a PNG and shown in the Plots area under that terminal. The browser needs network access to that CDN.

## Static export

`next.config.ts` sets `output: "export"`. A production build writes plain HTML, CSS, and JavaScript into `out/`, which a basic web server can host.

```bash
npm run build
```

Point the server at the `out` directory. With `trailingSlash` left off, requests such as `/modules` need to resolve to `modules.html`.
