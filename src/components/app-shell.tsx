"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ChartColumn, House, Library, Menu, X } from "lucide-react"

import { Mark } from "@/components/mark"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { journeyStats } from "@/lib/curriculum"
import { cn } from "cn"

const nav = [
  { href: "/", label: "Home", icon: House, match: (path: string) => path === "/" },
  {
    href: "/modules",
    label: "Modules",
    icon: Library,
    match: (path: string) => path.startsWith("/modules"),
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: ChartColumn,
    match: (path: string) => path.startsWith("/dashboard"),
  },
]

function Brand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className="flex items-center gap-3 rounded-lg px-2 py-1 outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring"
    >
      <span className="flex size-10 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-foreground">
        <Mark className="size-7" />
      </span>
      <span>
        <span className="block font-heading text-lg leading-none tracking-tight">
          Atrium
        </span>
        <span className="mt-1 block text-xs text-sidebar-foreground/70">
          Healthcare Data Science
        </span>
      </span>
    </Link>
  )
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1" aria-label="Studio">
      {nav.map((item) => {
        const active = item.match(pathname)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-3 focus-visible:ring-sidebar-ring",
              active &&
                "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_2px_0_0_0_var(--color-clay)]"
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

function ProgressNote() {
  const stats = journeyStats()
  const pct =
    stats.lessonsTotal === 0
      ? 0
      : Math.round((stats.lessonsDone / stats.lessonsTotal) * 100)

  return (
    <div className="rounded-xl bg-sidebar-accent/80 p-3">
      <p className="text-xs tracking-wide text-sidebar-foreground/70 uppercase">
        Along the path
      </p>
      <p className="mt-2 font-heading text-lg leading-tight">
        {stats.lessonsDone} of {stats.lessonsTotal} lessons
      </p>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-sidebar"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Lessons finished"
      >
        <div className="h-full rounded-full bg-clay-bright" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-3 text-xs leading-5 text-sidebar-foreground/70">
        {stats.finishedModules} of {stats.moduleCount} modules finished. Practice
        data only — not a clinical system.
      </p>
    </div>
  )
}

function SidebarPanel({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col px-4 py-5">
      <Brand onNavigate={onNavigate} />
      <Separator className="my-5 bg-sidebar-border" />
      <NavLinks onNavigate={onNavigate} />
      <div className="mt-auto pt-6">
        <ProgressNote />
      </div>
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const section = nav.find((item) => item.match(pathname))?.label ?? "Atrium"

  return (
    <div className="flex flex-1">
      <a
        href="#content"
        className="absolute top-3 left-3 z-50 -translate-y-24 rounded-lg bg-card px-3 py-2 text-sm shadow ring-1 ring-foreground/10 focus:translate-y-0"
      >
        Skip to content
      </a>
      <aside className="sticky top-0 hidden h-[calc(100dvh-3.5rem)] w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
        <SidebarPanel />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/90 px-3 backdrop-blur-sm md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Open navigation"
              onClick={() => setOpen(true)}
            >
              <Menu />
            </Button>
            <SheetContent
              side="left"
              showCloseButton={false}
              className="w-72 bg-sidebar p-0 text-sidebar-foreground sm:max-w-none"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>Atrium sections</SheetDescription>
              </SheetHeader>
              <div className="flex justify-end px-3 pt-3">
                <SheetClose
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Close navigation"
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    />
                  }
                >
                  <X />
                </SheetClose>
              </div>
              <SidebarPanel onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2 font-heading text-lg">
            <Mark className="size-6 text-primary" />
            Atrium
          </Link>
          <span className="ml-auto text-xs tracking-wide text-muted-foreground uppercase">
            {section}
          </span>
        </header>
        <main id="content" className="flex-1 px-4 py-6 md:px-8 md:py-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
