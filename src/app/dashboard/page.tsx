import type { Metadata } from "next"

import { CohortCharts } from "@/components/cohort-charts"
import { PageIntro } from "@/components/page-intro"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cohort, readmissionPercent } from "@/lib/cohort"

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "A chart bay for medical figures, filled with a synthetic Ward B cohort so the layout is ready.",
}

const stats = [
  {
    label: "Encounters",
    value: String(cohort.encounters),
    detail: `${cohort.name} sample stays`,
  },
  {
    label: "Median stay",
    value: cohort.medianStay,
    detail: "Middle of the 2–3 day group",
  },
  {
    label: "Readmitted",
    value: `${readmissionPercent()}%`,
    detail: `${cohort.readmitted} of ${cohort.encounters} within 30 days`,
  },
  {
    label: "No lactate",
    value: String(cohort.missingLactate),
    detail: "Blanks left as blanks",
  },
]

export default function DashboardPage() {
  return (
    <div>
      <PageIntro eyebrow="Chart bay" title="A layout for medical data charts.">
        These panels are where a figure will sit. They are filled with a fixed
        synthetic cohort — {cohort.name}, {cohort.encounters} encounters — so
        you can see the grid before any file of your own is connected.
      </PageIntro>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge className="h-6 border-transparent bg-clay-soft px-2.5 text-clay">
          Sample data only
        </Badge>
        <p className="text-sm text-muted-foreground">
          Not patient records, and not for a clinical decision.
        </p>
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} size="sm">
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl tracking-tight">{stat.value}</CardTitle>
              <p className="text-xs leading-5 text-muted-foreground">{stat.detail}</p>
            </CardHeader>
          </Card>
        ))}
      </section>

      <div className="mt-4">
        <CohortCharts />
      </div>

      <section className="mt-4 rounded-xl border border-dashed border-clay/40 bg-clay-soft/50 px-5 py-6 md:px-8">
        <p className="text-xs font-medium tracking-[0.18em] text-clay uppercase">
          Open slot
        </p>
        <h2 className="mt-2 text-2xl tracking-tight">The next figure goes here.</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Readmission by unit, a creatinine trend, a missingness grid. The bay
          has room when the question is ready. Swap the sample rows and the
          cards around them can stay put.
        </p>
      </section>
    </div>
  )
}
