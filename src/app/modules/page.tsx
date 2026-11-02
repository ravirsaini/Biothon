import type { Metadata } from "next"

import { LessonBench } from "@/components/lesson-bench"

export const metadata: Metadata = {
  title: "Modules",
  description:
    "Python lessons for life-science data: EHR tables, sequences, lab panels, and a practice classifier.",
}

export default function ModulesPage() {
  return <LessonBench />
}
