import { PlansGrid, PlansHeader } from '@/components/pages/plans'

export default async function PlansPage() {
  return (
    <div className='bg-page relative max-h-[calc(100vh_-_--spacing(23))] min-h-[calc(100vh_-_--spacing(23))] overflow-y-auto pt-3'>
      <PlansHeader />
      <PlansGrid />
    </div>
  )
}
