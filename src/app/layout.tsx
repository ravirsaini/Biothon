import type { Metadata } from "next"
import { Fraunces, IBM_Plex_Mono, Source_Sans_3 } from "next/font/google"
import { Suspense } from "react"

import { AppShell } from "@/components/app-shell"
import "./globals.css"

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
})

const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "Atrium",
    template: "%s · Atrium",
  },
  description:
    "A personal Python studio for a Healthcare Data Science journey: modules, practice, and a chart bay for medical figures.",
}

function ShellFallback() {
  return (
    <div className="flex flex-1">
      <div className="hidden w-64 shrink-0 bg-sidebar md:block" />
      <div className="flex-1" />
    </div>
  )
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${fraunces.variable} ${plex.variable} h-full antialiased`}
    >
      <body className="flex min-h-dvh flex-col font-sans">
        <Suspense fallback={<ShellFallback />}>
          <AppShell>{children}</AppShell>
        </Suspense>
        <footer className="border-t border-border px-4 py-4">
          <p className="text-center text-xs leading-5 font-normal tracking-wide text-muted-foreground">
            Made by Dr. Ravi Saini, School of Biochemical Engineering, IIT-BHU, Varanasi
          </p>
        </footer>
      </body>
    </html>
  )
}
