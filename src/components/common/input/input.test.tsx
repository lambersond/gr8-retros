import { render, screen } from '@test-utils'
import { useForm } from 'react-hook-form'
import { Input } from './input'

describe('components/common/input', () => {
  it('should render with required and label', () => {
    render(<Input required label='LABEL' />)

    expect(screen.getByText('LABEL')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('should render with error', () => {
    render(<Input name='item' label='label' error='ERROR' />)

    expect(screen.getByText('ERROR')).toHaveClass('text-danger')
    expect(screen.getByLabelText('label')).toHaveClass('border-error')
  })

  it('should not apply error styling without an error', () => {
    render(<Input name='item' label='label' />)

    expect(screen.getByLabelText('label')).not.toHaveClass('border-error')
  })

  it('should handle register function', () => {
    const Component = () => {
      const { register } = useForm()
      return <Input name='item' label='label' register={register} />
    }

    render(<Component />)

    expect(screen.getByLabelText('label')).toHaveAttribute('name', 'item')
  })

  it('should handle no register fn', () => {
    render(<Input name='item' label='test' register={undefined} />)

    expect(screen.getByLabelText('test')).toHaveAttribute('name', 'item')
  })
})
