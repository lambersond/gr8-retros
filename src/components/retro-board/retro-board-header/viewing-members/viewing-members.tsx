import Image from 'next/image'
import { useViewingMembers } from './use-viewing-members'
import { Tooltip } from '@/components/common'

export function ViewingMembers({ id }: Readonly<{ id: string }>) {
  const { viewingMembers } = useViewingMembers(id)

  return (
    <div className='flex items-center z-10'>
      {Object.entries(viewingMembers).map(([clientId, member]) => (
        <div
          key={clientId}
          className='relative flex items-center -ml-3 first:ml-0 transition-all duration-200 hover:z-10 hover:scale-110'
        >
          <Tooltip title={member.name}>
            <Image
              src={member.image}
              alt={member.name}
              width={32}
              height={32}
              className='w-8 h-8 rounded-full border-2 border-white shadow-sm'
            />
          </Tooltip>
        </div>
      ))}
    </div>
  )
}
