export function BoardControlItem({
  children,
  className = '',
}: Readonly<{
  children: React.ReactNode
  className?: string
}>) {
  return (
    <span
      className={`border border-x-0 border-t-0 border-b-0.5 border-secondary/30 px-4 py-3 ${className}`}
    >
      {children}
    </span>
  )
}
