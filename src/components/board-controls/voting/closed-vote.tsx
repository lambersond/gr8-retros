import clsx from 'classnames'

export function ClosedVote({
  voted = 0,
  onReset,
  onResults,
}: Readonly<{ voted?: number; onReset?: () => void; onResults: () => void }>) {
  const canReset = !!onReset
  return (
    <div className='flex justify-between items-center'>
      <div
        className={clsx('flex flex-col items-center', {
          'mx-auto': !canReset,
        })}
      >
        <p className='text-3xl'>{voted}</p>
        <p className='text-sm italic text-text-secondary tracking-tight -mt-1'>
          Voted
        </p>
      </div>
      <div className='flex gap-2 justify-end'>
        {canReset && (
          <button
            onClick={onReset}
            className='px-4 py-2 bg-secondary/10 text-text-secondary rounded-md hover:bg-secondary/20 active:bg-secondary/30 transition tracking-wide text-sm cursor-pointer'
          >
            Reset
          </button>
        )}
        <button
          onClick={onResults}
          className='px-4 py-2 bg-primary-new text-white rounded-md hover:bg-primary-new/90 active:bg-primary-new/80 transition tracking-wide text-sm cursor-pointer'
        >
          Results
        </button>
      </div>
    </div>
  )
}
