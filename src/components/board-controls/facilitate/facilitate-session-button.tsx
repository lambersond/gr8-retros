import { Presentation } from 'lucide-react'
import { usePopover } from '@/components/common'

export function FacilitateSessionButton({
  isFacilitatorMode,
  onToggle,
}: Readonly<{
  isFacilitatorMode: boolean
  onToggle: () => void
}>) {
  const popover = usePopover()
  const handleClick = () => {
    onToggle()
    popover.setOpen(false)
  }

  return (
    <button
      onClick={handleClick}
      className='flex items-center gap-2 w-full text-sm font-semibold cursor-pointer rounded-md px-2 py-1.5 transition-colors hover:bg-primary/10'
    >
      <Presentation className='size-4' />
      {isFacilitatorMode ? 'End Session' : 'Facilitate Session'}
    </button>
  )
}
