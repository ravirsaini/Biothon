import type { Metadata } from "next"

import { ModulesBrowser } from "@/components/modules-browser"
import { PageIntro } from "@/components/page-intro"
import { journeyStats, modules } from "@/lib/curriculum"

export const metadata: Metadata = {
  title: "Modules",
  description:
    "Python modules for a Healthcare Data Science journey, from tables and missing values to a practice model.",
}

export default function ModulesPage() {
  const stats = journeyStats()

  return (
    <div>
      <PageIntro eyebrow="Learning modules" title="Python, close to the chart.">
        {stats.moduleCount} modules and about {stats.hours} hours. Each one ends
        with a notebook prompt you can type yourself. Nothing here points at a
        real patient extract.
      </PageIntro>
      <ModulesBrowser modules={modules} />
    </div>
  )
}
