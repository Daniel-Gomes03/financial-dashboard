import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectInput } from '../index';
import { SelectOptionType } from '@/app/types';
import { createRef } from 'react';

const mockOptions: SelectOptionType[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('SelectInput', () => {
  it('should render select element', () => {
    render(<SelectInput options={mockOptions} />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('should render label when provided', () => {
    render(<SelectInput label="Test Label" options={mockOptions} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('should not render label when not provided', () => {
    const { container } = render(<SelectInput options={mockOptions} />);
    const label = container.querySelector('label');
    expect(label).not.toBeInTheDocument();
  });

  it('should render placeholder option when provided', () => {
    render(<SelectInput placeholder="Select an option" options={mockOptions} />);
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('should not render placeholder option when not provided', () => {
    render(<SelectInput options={mockOptions} />);
    const placeholderOption = screen.queryByRole('option', { name: '' });
    expect(placeholderOption).not.toBeInTheDocument();
    const options = screen.getAllByRole('option');
    expect(options.length).toBe(mockOptions.length);
  });

  it('should render all options correctly', () => {
    render(<SelectInput options={mockOptions} />);
    expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option 3' })).toBeInTheDocument();
  });

  it('should render options with correct values', () => {
    render(<SelectInput options={mockOptions} />);
    const option1 = screen.getByRole('option', { name: 'Option 1' }) as HTMLOptionElement;
    const option2 = screen.getByRole('option', { name: 'Option 2' }) as HTMLOptionElement;
    const option3 = screen.getByRole('option', { name: 'Option 3' }) as HTMLOptionElement;

    expect(option1.value).toBe('option1');
    expect(option2.value).toBe('option2');
    expect(option3.value).toBe('option3');
  });

  it('should handle numeric option values', () => {
    const numericOptions: SelectOptionType[] = [
      { value: 1, label: 'One' },
      { value: 2, label: 'Two' },
    ];
    render(<SelectInput options={numericOptions} />);
    const option1 = screen.getByRole('option', { name: 'One' }) as HTMLOptionElement;
    const option2 = screen.getByRole('option', { name: 'Two' }) as HTMLOptionElement;

    expect(option1.value).toBe('1');
    expect(option2.value).toBe('2');
  });

  it('should display error message when error is true', () => {
    render(
      <SelectInput
        options={mockOptions}
        error={true}
        helperText="This field is required"
      />
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('should not display error message when error is false', () => {
    render(
      <SelectInput
        options={mockOptions}
        error={false}
        helperText="This field is required"
      />
    );
    expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
  });

  it('should not display error message when error is undefined', () => {
    render(
      <SelectInput
        options={mockOptions}
        helperText="This field is required"
      />
    );
    expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
  });

  it('should apply correct CSS classes to select', () => {
    const { container } = render(<SelectInput options={mockOptions} />);
    const select = container.querySelector('select');
    expect(select).toHaveClass(
      'w-full',
      'h-9',
      'mt-1',
      'rounded',
      'border',
      'border-gray-300',
      'focus:border-primary-600',
      'focus:ring',
      'focus:ring-primary-200',
      'focus:outline-none',
      'transition-colors',
      'text-navy-100'
    );
  });

  it('should apply correct CSS classes to label', () => {
    const { container } = render(<SelectInput label="Test Label" options={mockOptions} />);
    const label = container.querySelector('label');
    expect(label).toHaveClass('block', 'text-sm', 'font-medium');
  });

  it('should apply correct CSS classes to error message', () => {
    const { container } = render(
      <SelectInput
        options={mockOptions}
        error={true}
        helperText="Error message"
      />
    );
    const errorSpan = container.querySelector('span.text-red-500');
    expect(errorSpan).toBeInTheDocument();
    expect(errorSpan).toHaveClass('text-red-500', 'text-xs');
  });

  it('should forward ref to select element', () => {
    const ref = createRef<HTMLSelectElement>();
    render(<SelectInput ref={ref} options={mockOptions} />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    expect(ref.current?.tagName).toBe('SELECT');
  });

  it('should pass name prop to select', () => {
    render(<SelectInput name="test-select" options={mockOptions} />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select).toHaveAttribute('name', 'test-select');
  });

  it('should pass value prop to select', () => {
    const handleChange = jest.fn();
    render(<SelectInput value="option1" onChange={handleChange} options={mockOptions} />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('option1');
  });

  it('should handle onChange event', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    render(<SelectInput onChange={handleChange} options={mockOptions} />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    await user.selectOptions(select, 'option2');

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should handle disabled prop', () => {
    render(<SelectInput disabled options={mockOptions} />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select).toBeDisabled();
  });

  it('should handle required prop', () => {
    render(<SelectInput required options={mockOptions} />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select).toBeRequired();
  });

  it('should handle id prop', () => {
    render(<SelectInput id="test-id" options={mockOptions} />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select).toHaveAttribute('id', 'test-id');
  });

  it('should handle className prop', () => {
    render(<SelectInput className="custom-class" options={mockOptions} />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;

    expect(select).toHaveClass('w-full', 'h-9');
  });

  it('should handle empty options array', () => {
    render(<SelectInput options={[]} placeholder="No options" />);
    const options = screen.getAllByRole('option');

    expect(options.length).toBe(1);
    expect(screen.getByText('No options')).toBeInTheDocument();
  });

  it('should handle options with same values but different labels', () => {
    const duplicateValueOptions: SelectOptionType[] = [
      { value: 'same', label: 'Label 1' },
      { value: 'same', label: 'Label 2' },
    ];
    render(<SelectInput options={duplicateValueOptions} />);
    expect(screen.getByRole('option', { name: 'Label 1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Label 2' })).toBeInTheDocument();
  });

  it('should have displayName set correctly', () => {
    expect(SelectInput.displayName).toBe('SelectInput');
  });
});
