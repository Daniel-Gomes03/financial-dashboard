import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextInput } from '../index';
import { createRef } from 'react';

describe('TextInput', () => {
  it('should render input element', () => {
    render(<TextInput label="Test Label" />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('should render label when provided', () => {
    render(<TextInput label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('should render label even when undefined', () => {
    const { container } = render(<TextInput />);
    const label = container.querySelector('label');
    expect(label).toBeInTheDocument();
  });

  it('should render prefix when provided', () => {
    render(<TextInput label="Test Label" prefix="R$" />);
    expect(screen.getByText('R$')).toBeInTheDocument();
  });

  it('should not render prefix when not provided', () => {
    const { container } = render(<TextInput label="Test Label" />);
    const prefix = container.querySelector('span.text-gray-500');
    expect(prefix).not.toBeInTheDocument();
  });

  it('should display error message when error is true', () => {
    render(
      <TextInput
        label="Test Label"
        error={true}
        helperText="This field is required"
      />
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('should not display error message when error is false', () => {
    render(
      <TextInput
        label="Test Label"
        error={false}
        helperText="This field is required"
      />
    );
    expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
  });

  it('should not display error message when error is undefined', () => {
    render(
      <TextInput
        label="Test Label"
        helperText="This field is required"
      />
    );
    expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
  });

  it('should apply correct CSS classes to input', () => {
    const { container } = render(<TextInput label="Test Label" />);
    const input = container.querySelector('input');
    expect(input).toHaveClass(
      'w-full',
      'h-9',
      'mt-1',
      'pl-10',
      'rounded',
      'border',
      'border-gray-300',
      'focus:border-blue-500',
      'focus:ring',
      'focus:ring-blue-200',
      'focus:outline-none',
      'transition-colors'
    );
  });

  it('should apply correct CSS classes to label', () => {
    const { container } = render(<TextInput label="Test Label" />);
    const label = container.querySelector('label');
    expect(label).toHaveClass('block', 'text-sm', 'font-medium');
  });

  it('should apply correct CSS classes to prefix', () => {
    const { container } = render(<TextInput label="Test Label" prefix="R$" />);
    const prefix = container.querySelector('span.text-gray-500');
    expect(prefix).toHaveClass(
      'absolute',
      'left-3',
      'top-[22px]',
      '-translate-y-1/2',
      'text-gray-500'
    );
  });

  it('should apply correct CSS classes to error message', () => {
    const { container } = render(
      <TextInput
        label="Test Label"
        error={true}
        helperText="Error message"
      />
    );
    const errorSpan = container.querySelector('span.text-red-500');
    expect(errorSpan).toBeInTheDocument();
    expect(errorSpan).toHaveClass('text-red-500', 'text-xs');
  });

  it('should forward ref to input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextInput ref={ref} label="Test Label" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.tagName).toBe('INPUT');
  });

  it('should pass name prop to input', () => {
    render(<TextInput name="test-input" label="Test Label" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toHaveAttribute('name', 'test-input');
  });

  it('should pass value prop to input', () => {
    const handleChange = jest.fn();
    render(<TextInput value="test value" onChange={handleChange} label="Test Label" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('test value');
  });

  it('should handle onChange event', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    render(<TextInput onChange={handleChange} label="Test Label" />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    await user.type(input, 'test');

    expect(handleChange).toHaveBeenCalled();
  });

  it('should handle disabled prop', () => {
    render(<TextInput disabled label="Test Label" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  it('should handle required prop', () => {
    render(<TextInput required label="Test Label" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toBeRequired();
  });

  it('should handle placeholder prop', () => {
    render(<TextInput placeholder="Enter text" label="Test Label" />);
    const input = screen.getByPlaceholderText('Enter text') as HTMLInputElement;
    expect(input).toBeInTheDocument();
  });

  it('should handle id prop', () => {
    render(<TextInput id="test-id" label="Test Label" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toHaveAttribute('id', 'test-id');
  });

  it('should always have input type text (type prop is overridden)', () => {
    const { container } = render(<TextInput type="email" label="Test Label" />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toBeInTheDocument();
  });

  it('should have input type text by default', () => {
    const { container } = render(<TextInput label="Test Label" />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toBeInTheDocument();
  });

  it('should handle className prop', () => {
    render(<TextInput className="custom-class" label="Test Label" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toHaveClass('w-full', 'h-9');
  });

  it('should handle readOnly prop', () => {
    render(<TextInput readOnly label="Test Label" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toHaveAttribute('readOnly');
  });

  it('should handle maxLength prop', () => {
    render(<TextInput maxLength={10} label="Test Label" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toHaveAttribute('maxLength', '10');
  });

  it('should apply pl-10 class when prefix is present', () => {
    const { container } = render(<TextInput label="Test Label" prefix="R$" />);
    const input = container.querySelector('input');
    expect(input).toHaveClass('pl-10');
  });

  it('should have displayName set correctly', () => {
    expect(TextInput.displayName).toBe('TextInput');
  });

  it('should handle onBlur event', async () => {
    const handleBlur = jest.fn();
    const user = userEvent.setup();
    render(<TextInput onBlur={handleBlur} label="Test Label" />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    await user.click(input);
    await user.tab();

    expect(handleBlur).toHaveBeenCalled();
  });

  it('should handle onFocus event', async () => {
    const handleFocus = jest.fn();
    const user = userEvent.setup();
    render(<TextInput onFocus={handleFocus} label="Test Label" />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    await user.click(input);

    expect(handleFocus).toHaveBeenCalled();
  });
});
