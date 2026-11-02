import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"

import { MissingModule } from "@/components/missing-module"
import { PageIntro } from "@/components/page-intro"
import { StatusBadge } from "@/components/status-badge"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getModule, lessonProgress, modules } from "@/lib/curriculum"
import { cn } from "cn"

export function generateStaticParams() {
  return modules.map((mod) => ({ slug: mod.slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const mod = getModule(slug)
  if (!mod) return { title: "Missing module" }
  return { title: mod.title, description: mod.summary }
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const mod = getModule(slug)
  if (!mod) return <MissingModule />

  const progress = lessonProgress(mod)
  const index = modules.findIndex((item) => item.slug === mod.slug)
  const previous = index > 0 ? modules[index - 1] : null
  const next = index < modules.length - 1 ? modules[index + 1] : null

  return (
    <div>
      <Link
        href="/modules"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ArrowLeft className="size-4" />
        All modules
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <p className="font-mono text-xs tracking-wide text-muted-foreground">
          Module {mod.number}
        </p>
        <StatusBadge status={mod.status} />
        {mod.libraries.map((library) => (
          <Badge key={library} variant="outline" className="h-6 px-2.5">
            {library}
          </Badge>
        ))}
      </div>

      <div className="mt-4">
        <PageIntro eyebrow={`${progress.done} of ${progress.total} lessons · about ${mod.hours} hours`} title={mod.title}>
          {mod.summary}
        </PageIntro>
      </div>

      {mod.caution ? (
        <p className="mt-6 max-w-2xl rounded-xl border border-clay/30 bg-clay-soft px-4 py-3 text-sm leading-6">
          {mod.caution}
        </p>
      ) : null}

      <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Lessons</CardTitle>
            <CardDescription>{mod.focus}</CardDescription>
          </CardHeader>
          <CardContent>
            <ol>
              {mod.lessons.map((lesson, lessonIndex) => {
                const isCurrent = progress.currentIndex === lessonIndex
                return (
                  <li
                    key={lesson.title}
                    className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 border-b border-border py-4 last:border-b-0"
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-8 items-center justify-center rounded-full text-xs font-medium",
                        lesson.done && "bg-sage-soft text-sage",
                        isCurrent && "bg-clay text-primary-foreground",
                        !lesson.done && !isCurrent && "bg-muted text-muted-foreground"
                      )}
                    >
                      {lesson.done ? (
                        <Check className="size-3.5" aria-hidden="true" />
                      ) : (
                        lessonIndex + 1
                      )}
                      {lesson.done ? <span className="sr-only">Finished</span> : null}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-medium text-foreground">
                          {lesson.title}
                        </h2>
                        {isCurrent ? (
                          <Badge className="h-6 border-transparent bg-clay-soft px-2.5 text-clay">
                            Up next
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {lesson.detail}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="bg-sidebar text-sidebar-foreground ring-sidebar-border">
            <CardHeader>
              <CardDescription className="text-sidebar-foreground/70">
                Notebook prompt
              </CardDescription>
              <CardTitle className="text-2xl text-sidebar-foreground">
                {mod.prompt.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-6 text-sidebar-foreground/85">{mod.prompt.body}</p>
              <pre className="mt-4 overflow-x-auto rounded-lg bg-black/25 p-4 font-mono text-[13px] leading-6 text-sidebar-foreground">
                <code>{mod.prompt.sketch}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Before you leave</CardTitle>
              <CardDescription>The module is done when these are true.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {mod.checks.map((check) => (
                  <li key={check} className="flex gap-3 text-sm leading-6">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-clay" />
                    {check}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <nav className="mt-8 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
        {previous ? (
          <Link
            href={`/modules/${previous.slug}`}
            className="rounded-xl bg-card px-4 py-4 ring-1 ring-foreground/10 outline-none hover:bg-sage-soft/40 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span className="flex items-center gap-1 text-xs tracking-wide text-muted-foreground uppercase">
              <ArrowLeft className="size-3.5" />
              Previous
            </span>
            <span className="mt-1 block font-heading text-lg">{previous.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/modules/${next.slug}`}
            className={cn(
              "rounded-xl bg-card px-4 py-4 text-right ring-1 ring-foreground/10 outline-none hover:bg-sage-soft/40 focus-visible:ring-3 focus-visible:ring-ring/50",
              !previous && "sm:col-start-2"
            )}
          >
            <span className="flex items-center justify-end gap-1 text-xs tracking-wide text-muted-foreground uppercase">
              Next
              <ArrowRight className="size-3.5" />
            </span>
            <span className="mt-1 block font-heading text-lg">{next.title}</span>
          </Link>
        ) : null}
      </nav>

    </div>
  )
}
