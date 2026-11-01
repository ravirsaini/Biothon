export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path
        d="M6.5 26.5V14.5a9.5 9.5 0 0 1 19 0v12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M8.5 19.5h4.2l2.1-4.2 3.1 8.2 2.2-4h4.4"
        fill="none"
        stroke="var(--color-clay-bright)"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
