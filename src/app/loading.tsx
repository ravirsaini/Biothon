export default function Loading() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="h-3 w-28 rounded-full bg-muted" />
      <div className="mt-4 h-12 w-full max-w-xl rounded-lg bg-muted" />
      <div className="mt-4 h-20 max-w-lg rounded-lg bg-muted" />
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="h-56 rounded-xl bg-muted" />
        <div className="h-56 rounded-xl bg-muted" />
      </div>
    </div>
  )
}
