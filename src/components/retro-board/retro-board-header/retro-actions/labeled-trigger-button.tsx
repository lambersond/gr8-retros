import { Tooltip } from '@/components/common'

type LabeledTriggerButtonProps = {
  label: string
  icon: React.ElementType
  onClick?: () => void
  ref?: React.Ref<HTMLButtonElement>
}

export function LabeledTriggerButton({
  label,
  icon: Icon,
  onClick,
  ref,
  ...rest
}: Readonly<LabeledTriggerButtonProps>) {
  return (
    <Tooltip title={label} placement='bottom' asChild>
      <button
        ref={ref}
        type='button'
        aria-label={label}
        onClick={onClick}
        className='flex items-center justify-center p-1 rounded cursor-pointer text-text-primary hover:bg-text-primary/10'
        {...rest}
      >
        <Icon className='size-5' />
      </button>
    </Tooltip>
  )
}
