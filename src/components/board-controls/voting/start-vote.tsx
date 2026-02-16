import { Checkbox, NumberIncrementor } from '@/components/common'

export function StartVote() {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleVotesPerUserChange = (value: number) => {
    console.error('Votes per user changed:', value)
  }

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleMultiModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.error('Multi-mode changed:', e.target.checked)
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-start justify-between'>
        <div className='flex flex-col'>
          <p className='text-sm text-text-secondary tracking-tight italic'>
            Votes Per User
          </p>
          <NumberIncrementor
            defaultValue={0}
            onChange={handleVotesPerUserChange}
          />
        </div>
        <Checkbox
          label='Multi-mode'
          size='lg'
          direction='vertical'
          textDirection='start'
          labelClassName='italic text-sm text-text-secondary'
          onChange={handleMultiModeChange}
        />
      </div>
      <button className='px-4 py-2 bg-primary-new text-white rounded-md hover:bg-primary-new/90 active:bg-primary-new/80 transition tracking-wide text-sm cursor-pointer'>
        Start Voting
      </button>
    </div>
  )
}
