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
- `/modules` — a tutorial bench: topic menu, a highlighted example, and a Try it Yourself placeholder
- `/modules/[slug]` — lessons, a notebook prompt, and what “done” means
- `/dashboard` — stat tiles, sample charts, and an open slot for the next figure

## Stack

Next.js, TypeScript, Tailwind CSS, and shadcn/ui. Sample chart data lives in `src/lib/cohort.ts`. The syllabus lives in `src/lib/curriculum.ts`. The modules page lessons live in `src/lib/tutorial.ts`.

## Static export

`next.config.ts` sets `output: "export"`. A production build writes plain HTML, CSS, and JavaScript into `out/`, which a basic web server can host.

```bash
npm run build
```

Point the server at the `out` directory. With `trailingSlash` left off, requests such as `/modules` need to resolve to `modules.html`.
