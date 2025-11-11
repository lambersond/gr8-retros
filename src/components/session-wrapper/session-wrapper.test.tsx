import { render } from '@test-utils'
import { SessionWrapper } from './session-wrapper'
import type { ReactNode } from 'react'

jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

jest.mock('../app-bar', () => ({
  AppBar: () => <div>App Bar</div>,
}))

describe('components/session-wrapper', () => {
  it('should render children', () => {
    const { getByText } = render(
      <SessionWrapper>
        <div>Restricted Page</div>
      </SessionWrapper>,
    )
    expect(getByText('App Bar')).toBeInTheDocument()
    expect(getByText('Restricted Page')).toBeInTheDocument()
  })
})
