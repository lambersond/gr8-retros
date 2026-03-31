export function TimerAddMinuteButton({
  onClick,
}: Readonly<{
  onClick: VoidFunction
}>) {
  return (
    <button
      className='border border-border-light rounded py-1 px-4 w-fit text-sm hover:bg-primary/10 cursor-pointer transition hover:border-info'
      onClick={onClick}
    >
      + 1 min
    </button>
  )
}
