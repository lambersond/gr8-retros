import clsx from 'classnames'

export function SubsettingsContainer({
  children,
  show = false,
}: Readonly<{
  children: React.ReactNode
  show?: boolean
}>) {
  return (
    <div
      className={clsx(
        'flex flex-col -mt-1',
        'ml-6 space-y-2 overflow-hidden transition-all duration-300 ease-in-out',
        {
          'max-h-96 opacity-100': show,
          'max-h-0 opacity-0': !show,
        },
      )}
    >
      {children}
    </div>
  )
}
