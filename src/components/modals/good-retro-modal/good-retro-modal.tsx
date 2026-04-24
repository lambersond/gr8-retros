import Cookies from 'js-cookie'
import { Modal } from '@/components/common'
import { COOKIE_KEY_RETRO_TIPS_ACK } from '@/constants/cookies'
import { useModals } from '@/hooks/use-modals'
import type { GoodRetroModalProps } from './types'

export function GoodRetroModal({
  open = true,
  isAuthenticated,
}: Readonly<GoodRetroModalProps>) {
  const { closeModal } = useModals()

  const onClose = () => {
    if (isAuthenticated) {
      Cookies.set(COOKIE_KEY_RETRO_TIPS_ACK, 'true', { expires: 28 })
    }
    closeModal('GoodRetroModal')
  }

  return (
    <Modal title='What Makes a Good Retro?' isOpen={open} onClose={onClose}>
      <p className='text-text-secondary text-sm mb-4'>
        The best retrospectives are focused and constructive. Here are a few
        tips to keep yours productive:
      </p>
      <ul className='flex flex-col gap-3 text-sm text-text-primary'>
        <li>
          <b>Pick a specific topic.</b> Instead of a general &ldquo;how did the
          sprint go?&rdquo;, zoom in on something concrete like code quality,
          deployment process, or cross-team communication.
        </li>
        <li>
          <b>Review metrics beforehand.</b> Look at cycle time, bug counts, or
          incident reports before the meeting so discussions are grounded in
          data, not gut feelings.
        </li>
        <li>
          <b>Balance the conversation.</b> Celebrate wins alongside areas for
          improvement. A retro that only surfaces complaints burns people out
          quickly.
        </li>
        <li>
          <b>Timebox discussions.</b> Give each topic a fixed window so no
          single issue dominates the entire session.
        </li>
        <li>
          <b>Leave with action items.</b> Every retro should end with clear,
          assigned next steps. If nothing changes after the meeting, the meeting
          was wasted.
        </li>
      </ul>
      <div className='flex justify-end mt-6'>
        <button
          onClick={onClose}
          className='bg-primary/85 py-2 px-4 hover:bg-primary rounded-xl text-lg text-text-primary uppercase text-center font-bold cursor-pointer'
        >
          Got it
        </button>
      </div>
    </Modal>
  )
}
