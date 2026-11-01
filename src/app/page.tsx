import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

import { PageIntro } from "@/components/page-intro"
import { StatusBadge } from "@/components/status-badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { journeyStats, lessonProgress, modules } from "@/lib/curriculum"
import { cn } from "cn"

export default function HomePage() {
  const stats = journeyStats()
  const current = stats.current
  const progress = current ? lessonProgress(current) : null
  const currentLesson =
    current && progress && progress.currentIndex !== null
      ? current.lessons[progress.currentIndex]
      : null

  return (
    <div>
      <PageIntro eyebrow="Personal studio" title="Welcome to your Healthcare Data Science journey.">
        Atrium is where you practice Python against clinical questions — encounters,
        labs, missing fields, and figures — before any of it is asked to make a
        decision.
      </PageIntro>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {current ? (
          <Link
            href={`/modules/${current.slug}`}
            className={cn(buttonVariants({ size: "lg" }), "h-10 px-4")}
          >
            Continue the lesson
            <ArrowRight />
          </Link>
        ) : null}
        <Link
          href="/modules"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-10 bg-card px-4")}
        >
          Browse the modules
        </Link>
      </div>

      <section className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.8fr)]">
        {current && progress ? (
          <Card>
            <CardHeader>
              <p className="text-xs font-medium tracking-[0.18em] text-clay uppercase">
                On the desk
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <p className="font-mono text-xs text-muted-foreground">
                  Module {current.number}
                </p>
                <StatusBadge status={current.status} />
              </div>
              <CardTitle className="text-3xl">{current.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-7 text-muted-foreground">
                {currentLesson
                  ? `Next up: ${currentLesson.title}. ${currentLesson.detail}`
                  : current.focus}
              </p>
              <div
                className="mt-5 h-1.5 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={progress.done}
                aria-valuemin={0}
                aria-valuemax={progress.total}
                aria-label="Lessons finished in this module"
              >
                <div
                  className="h-full rounded-full bg-sage"
                  style={{
                    width: `${progress.total === 0 ? 0 : (progress.done / progress.total) * 100}%`,
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {progress.done} of {progress.total} lessons in this module ·{" "}
                {stats.lessonsDone} of {stats.lessonsTotal} on the whole path
              </p>
              <ol className="mt-5 space-y-3">
                {current.checks.map((check) => (
                  <li key={check} className="flex gap-3 text-sm leading-6">
                    <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-clay-soft text-clay">
                      <Check className="size-3" />
                    </span>
                    {check}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">The path is finished.</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-7 text-muted-foreground">
                Every module on this journey is marked done. The chart bay is
                still there when the next question needs a figure.
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="bg-sidebar text-sidebar-foreground ring-sidebar-border">
          <CardHeader>
            <p className="text-xs font-medium tracking-[0.18em] text-clay uppercase">
              How this room works
            </p>
            <CardTitle className="text-2xl text-sidebar-foreground">
              Three places, one path.
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-sidebar-foreground/80">
            <p>
              <span className="text-sidebar-foreground">Home</span> is the desk:
              the lesson in front of you, and nothing else competing with it.
            </p>
            <p>
              <span className="text-sidebar-foreground">Modules</span> hold the
              Python practice, from a first function to a model you are not
              allowed to trust.
            </p>
            <p>
              <span className="text-sidebar-foreground">Dashboard</span> is the
              chart bay. Sample figures are drawn so the layout is ready when a
              real question shows up.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl tracking-tight">The path</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              {stats.moduleCount} modules, about {stats.hours} hours, paced as
              short sessions. You have finished the Python warmup. The work now
              is a cohort, not a model.
            </p>
          </div>
        </div>
        <ol className="mt-6">
          {modules.map((mod, index) => (
            <li key={mod.slug} className="relative grid grid-cols-[1.25rem_minmax(0,1fr)] gap-4">
              {index < modules.length - 1 ? (
                <span
                  className="absolute top-5 left-[0.4rem] h-[calc(100%-0.25rem)] w-px bg-border"
                  aria-hidden="true"
                />
              ) : null}
              <span
                className={cn(
                  "relative z-10 mt-5 size-3.5 rounded-full border-2",
                  mod.status === "complete" && "border-sage bg-sage",
                  mod.status === "in-progress" && "border-clay bg-clay",
                  mod.status === "not-started" && "border-border bg-card"
                )}
                aria-hidden="true"
              />
              <Link
                href={`/modules/${mod.slug}`}
                className="group rounded-xl px-2 py-3 outline-none hover:bg-card focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="text-xl group-hover:text-sage">{mod.title}</h3>
                  <StatusBadge status={mod.status} />
                </div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{mod.focus}</p>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-4 flex flex-col gap-4 rounded-xl bg-card px-5 py-5 ring-1 ring-foreground/10 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <div>
          <p className="text-xs font-medium tracking-[0.18em] text-clay uppercase">
            Chart bay
          </p>
          <h2 className="mt-2 text-2xl">A layout is waiting for your charts.</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Ward B is already drawn with sample encounters, so you can see where
            a length-of-stay figure or a lab panel will sit.
          </p>
        </div>
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ size: "lg" }), "h-10 shrink-0 px-4")}
        >
          Open the dashboard
          <ArrowRight />
        </Link>
      </section>
    </div>
  )
}
