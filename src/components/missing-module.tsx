import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"

export function MissingModule() {
  return (
    <div className="mx-auto max-w-lg py-16">
      <p className="text-xs font-medium tracking-[0.18em] text-clay uppercase">
        Missing module
      </p>
      <h1 className="mt-3 text-4xl tracking-tight">That lesson is not on the path.</h1>
      <p className="mt-3 leading-7 text-muted-foreground">
        The address does not match a module in this studio. The seven that do
        are listed together.
      </p>
      <Link
        href="/modules"
        className={cn(buttonVariants({ size: "lg" }), "mt-6 h-10 px-4")}
      >
        Back to modules
      </Link>
    </div>
  )
}
