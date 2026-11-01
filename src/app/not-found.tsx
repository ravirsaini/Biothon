import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-16">
      <p className="text-xs font-medium tracking-[0.18em] text-clay uppercase">
        Missing page
      </p>
      <h1 className="mt-3 text-4xl tracking-tight">That page is not in the studio.</h1>
      <p className="mt-3 leading-7 text-muted-foreground">
        The path, the modules, and the chart bay are still where you left them.
      </p>
      <Link href="/" className={cn(buttonVariants({ size: "lg" }), "mt-6 h-10 px-4")}>
        Back to the desk
      </Link>
    </div>
  )
}
