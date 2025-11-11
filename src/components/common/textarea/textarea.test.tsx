import { render, screen } from '@test-utils'
import { useForm } from 'react-hook-form'
import { TextArea } from './textarea'

describe('components/common/textarea', () => {
  it('should render with required and label', () => {
    render(<TextArea required label='LABEL' />)

    expect(screen.getByText('LABEL')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('should handle register function', () => {
    const Component = () => {
      const { register } = useForm()
      return <TextArea name='item' label='label' register={register} />
    }

    render(<Component />)

    expect(screen.getByLabelText('label')).toHaveAttribute('name', 'item')
  })

  it('should handle no register fn', () => {
    render(<TextArea name='item' label='test' register={undefined} />)

    expect(screen.getByLabelText('test')).toHaveAttribute('name', 'item')
  })
})
