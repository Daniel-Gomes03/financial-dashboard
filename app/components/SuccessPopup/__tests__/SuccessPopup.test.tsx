import { render, screen, waitFor } from '@testing-library/react';
import { SuccessPopup } from '../index';

jest.mock('react-icons/fa', () => ({
  FaCheckCircle: () => <svg data-testid="check-icon" />,
}));

describe('SuccessPopup', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should not render when isVisible is false', () => {
    render(
      <SuccessPopup
        message="Test message"
        isVisible={false}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  it('should render when isVisible is true', () => {
    render(
      <SuccessPopup
        message="Test message"
        isVisible={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should display the message correctly', () => {
    const message = 'Evento cadastrado com sucesso!';
    render(
      <SuccessPopup
        message={message}
        isVisible={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('should render check icon', () => {
    render(
      <SuccessPopup
        message="Test message"
        isVisible={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('should call onClose after default duration (3000ms)', async () => {
    render(
      <SuccessPopup
        message="Test message"
        isVisible={true}
        onClose={mockOnClose}
      />
    );

    expect(mockOnClose).not.toHaveBeenCalled();

    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('should call onClose after custom duration', async () => {
    const customDuration = 5000;
    render(
      <SuccessPopup
        message="Test message"
        isVisible={true}
        onClose={mockOnClose}
        duration={customDuration}
      />
    );

    expect(mockOnClose).not.toHaveBeenCalled();

    jest.advanceTimersByTime(3000);
    expect(mockOnClose).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('should not call onClose before duration expires', () => {
    render(
      <SuccessPopup
        message="Test message"
        isVisible={true}
        onClose={mockOnClose}
        duration={3000}
      />
    );

    jest.advanceTimersByTime(2999);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should cleanup timer when isVisible changes to false', () => {
    const { rerender } = render(
      <SuccessPopup
        message="Test message"
        isVisible={true}
        onClose={mockOnClose}
        duration={3000}
      />
    );

    jest.advanceTimersByTime(1000);

    rerender(
      <SuccessPopup
        message="Test message"
        isVisible={false}
        onClose={mockOnClose}
        duration={3000}
      />
    );

    jest.advanceTimersByTime(3000);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should cleanup timer when component unmounts', () => {
    const { unmount } = render(
      <SuccessPopup
        message="Test message"
        isVisible={true}
        onClose={mockOnClose}
        duration={3000}
      />
    );

    jest.advanceTimersByTime(1000);

    unmount();

    jest.advanceTimersByTime(3000);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should restart timer when isVisible changes from false to true', async () => {
    const { rerender } = render(
      <SuccessPopup
        message="Test message"
        isVisible={false}
        onClose={mockOnClose}
        duration={3000}
      />
    );

    rerender(
      <SuccessPopup
        message="Test message"
        isVisible={true}
        onClose={mockOnClose}
        duration={3000}
      />
    );

    expect(mockOnClose).not.toHaveBeenCalled();

    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('should apply correct CSS classes', () => {
    const { container } = render(
      <SuccessPopup
        message="Test message"
        isVisible={true}
        onClose={mockOnClose}
      />
    );

    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv).toHaveClass('fixed', 'top-4', 'right-4', 'z-50', 'animate-slide-in');

    const innerDiv = outerDiv.firstChild as HTMLElement;
    expect(innerDiv).toHaveClass(
      'bg-primary-600',
      'text-white',
      'rounded-lg',
      'shadow-lg',
      'p-4',
      'flex',
      'items-center',
      'gap-3',
      'min-w-[300px]'
    );
  });

  it('should handle multiple visibility toggles correctly', async () => {
    const { rerender } = render(
      <SuccessPopup
        message="Test message"
        isVisible={true}
        onClose={mockOnClose}
        duration={1000}
      />
    );

    jest.advanceTimersByTime(500);

    rerender(
      <SuccessPopup
        message="Test message"
        isVisible={false}
        onClose={mockOnClose}
        duration={1000}
      />
    );

    rerender(
      <SuccessPopup
        message="Test message"
        isVisible={true}
        onClose={mockOnClose}
        duration={1000}
      />
    );

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
