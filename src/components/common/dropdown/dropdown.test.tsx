import { render, useClick, screen } from '@test-utils'
import { Dropdown } from './dropdown'

describe('components/common/dropdown', () => {
  const options = [
    { id: '1', value: '1', label: 'Option 1' },
    { id: '2', value: '2', label: 'Option 2' },
    { id: '3', value: '3', label: 'Option 3' },
  ]

  it('should render correctly', () => {
    expect(
      render(
        <Dropdown options={options} label='test' onSelect={jest.fn()} />,
      ).asFragment(),
    ).toMatchSnapshot()
  })

  it('should render correctly with defaultEmpty', () => {
    expect(
      render(
        <Dropdown
          options={options}
          label='test'
          onSelect={jest.fn()}
          defaultEmpty
        />,
      ).asFragment(),
    ).toMatchSnapshot()
  })

  it('should render options on click', async () => {
    const click = useClick(<Dropdown options={options} onSelect={jest.fn()} />)

    await click(screen.getByText('Option 1'))

    expect(screen.getByTestId('Dropdown__option-1')).toHaveTextContent(
      'Option 1',
    )
    expect(screen.getByTestId('Dropdown__option-2')).toHaveTextContent(
      'Option 2',
    )
    expect(screen.getByTestId('Dropdown__option-3')).toHaveTextContent(
      'Option 3',
    )
  })

  it('should call onSelect on option click', async () => {
    const onSelect = jest.fn()
    const click = useClick(<Dropdown options={options} onSelect={onSelect} />)

    await click(screen.getByText('Option 1'))

    expect(onSelect).toHaveBeenCalledTimes(0)

    await click(screen.getByTestId('Dropdown__option-2'))

    expect(onSelect).toHaveBeenCalledWith(options[1])
  })

  it('should close dropdown on click outside', async () => {
    const click = useClick(<Dropdown options={options} onSelect={jest.fn()} />)

    await click(screen.getByText('Option 1'))

    expect(screen.getByTestId('Dropdown__option-1')).toHaveTextContent(
      'Option 1',
    )

    await click(document.body)

    expect(screen.queryByTestId('Dropdown__option-1')).toBeNull()
  })
})
