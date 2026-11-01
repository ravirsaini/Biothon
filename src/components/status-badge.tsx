import { Badge } from "@/components/ui/badge"
import { statusLabel, type ModuleStatus } from "@/lib/curriculum"
import { cn } from "cn"

const tones: Record<ModuleStatus, string> = {
  complete: "border-transparent bg-sage-soft text-sage",
  "in-progress": "border-transparent bg-clay-soft text-clay",
  "not-started": "",
}

export function StatusBadge({
  status,
  className,
}: {
  status: ModuleStatus
  className?: string
}) {
  return (
    <Badge
      variant={status === "not-started" ? "outline" : "secondary"}
      className={cn("h-6 px-2.5", tones[status], className)}
    >
      {statusLabel[status]}
    </Badge>
  )
}
