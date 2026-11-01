export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <header className="max-w-2xl">
      <p className="text-xs font-medium tracking-[0.18em] text-clay uppercase">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-4xl leading-[1.12] tracking-tight text-balance md:text-5xl">
        {title}
      </h1>
      <div className="mt-4 max-w-xl text-base leading-7 text-muted-foreground md:text-[1.0625rem]">
        {children}
      </div>
    </header>
  )
}
