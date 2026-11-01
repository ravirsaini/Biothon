"use client"

import Link from "next/link"
import { useState } from "react"

import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  lessonProgress,
  type ModuleStatus,
  type StudyModule,
} from "@/lib/curriculum"
import { cn } from "cn"

const filters: { id: "all" | ModuleStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "in-progress", label: "In progress" },
  { id: "not-started", label: "Not started" },
  { id: "complete", label: "Finished" },
]

export function ModulesBrowser({ modules }: { modules: StudyModule[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all")
  const visible =
    filter === "all" ? modules : modules.filter((mod) => mod.status === filter)

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter modules">
        {filters.map((item) => {
          const count =
            item.id === "all"
              ? modules.length
              : modules.filter((mod) => mod.status === item.id).length
          const selected = filter === item.id
          return (
            <Button
              key={item.id}
              type="button"
              size="sm"
              variant={selected ? "default" : "outline"}
              aria-pressed={selected}
              onClick={() => setFilter(item.id)}
              className={cn("h-8", selected ? "" : "bg-card")}
            >
              {item.label}
              <span className={selected ? "text-primary-foreground/80" : "text-muted-foreground"}>
                {count}
              </span>
            </Button>
          )
        })}
      </div>

      {visible.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-border bg-card/70 px-5 py-10 text-center">
          <h2 className="font-heading text-2xl">Nothing sits in this pile.</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            Every module is in another state. Show the full path to see them.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-5 h-9 bg-card px-3"
            onClick={() => setFilter("all")}
          >
            Show all modules
          </Button>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {visible.map((mod) => {
            const progress = lessonProgress(mod)
            return (
              <li key={mod.slug}>
                <Link
                  href={`/modules/${mod.slug}`}
                  className="group block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <Card className="h-full transition-colors group-hover:bg-sage-soft/50">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-3">
                        <CardDescription className="font-mono text-xs tracking-wide">
                          Module {mod.number}
                        </CardDescription>
                        <StatusBadge status={mod.status} />
                      </div>
                      <CardTitle className="text-xl">{mod.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-4">
                      <p className="leading-6 text-muted-foreground">{mod.summary}</p>
                      <p className="mt-auto text-xs tracking-wide text-muted-foreground uppercase">
                        {progress.done} of {progress.total} lessons · about {mod.hours} hours ·{" "}
                        {mod.libraries.join(", ")}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
