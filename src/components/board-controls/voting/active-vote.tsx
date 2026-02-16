export function ActiveVote({
  voting = 0,
  voted = 0,
}: Readonly<{ voting?: number; voted?: number }>) {
  return (
    <div className='flex flex-col gap-2'>
      <button className='text-sm italic hover:after:text-white tracking-tight text-center px-4 py-2 bg-secondary/10 rounded-md after:content-["Voting_in_progress..."] after:text-text-secondary after:italic after:block hover:after:content-["End_Vote"] hover:bg-danger/90 active:bg-danger/80 transition cursor-pointer' />
      <div className='flex items-start justify-around mt-1'>
        <div className='flex flex-col items-center'>
          <p className='text-3xl'>{voting}</p>
          <p className='text-sm italic text-text-secondary tracking-tight -mt-1'>
            Voting
          </p>
        </div>
        <div className='flex flex-col items-center'>
          <p className='text-3xl'>{voted}</p>
          <p className='text-sm italic text-text-secondary tracking-tight -mt-1'>
            Voted
          </p>
        </div>
      </div>
    </div>
  )
}
