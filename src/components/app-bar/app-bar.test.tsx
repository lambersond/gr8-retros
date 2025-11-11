import { render } from '@test-utils'
import { AppBar } from './app-bar'

jest.mock('./auth', () => ({
  Auth: () => <div>Auth Component</div>,
}))

describe('components/app-bar', () => {
  it('should should match snapshot', () => {
    expect(render(<AppBar />).asFragment()).toMatchSnapshot()
  })
})
