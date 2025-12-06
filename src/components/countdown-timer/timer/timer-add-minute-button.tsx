export function TimerAddMinuteButton({
  onClick,
}: Readonly<{
  onClick: VoidFunction
}>) {
  return (
    <button
      className='border border-tertiary rounded py-1 px-4 w-fit text-sm hover:bg-info/10 cursor-pointer transition hover:border-info'
      onClick={onClick}
    >
      + 1 min
    </button>
  )
}
