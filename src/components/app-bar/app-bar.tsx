import { Auth } from './auth'

export function AppBar() {
  return (
    <div className='flex items-center justify-between max-w-screen bg-appbar px-3 py-1 min-h-16'>
      <div className='flex items-baseline gap-2'>
        <span className='text-2xl font-extrabold tracking-tight text-slate-900'>
          Gr8 Retros
        </span>
        <span className='text-sm text-slate-600 hidden md:inline'>
          A simple and effective retrospective tool for teams
        </span>
      </div>
      <Auth />
    </div>
  )
}
