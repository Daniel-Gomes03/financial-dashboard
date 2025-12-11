import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog } from '../index';

jest.mock('react-icons/fa', () => ({
  FaTimes: () => <svg data-testid="close-icon" />,
}));

describe('Dialog', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('should not render when isOpen is false', () => {
    render(
      <Dialog isOpen={false} onClose={mockOnClose} title="Test Dialog">
        <div>Dialog Content</div>
      </Dialog>
    );

    expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Dialog Content')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <Dialog isOpen={true} onClose={mockOnClose} title="Test Dialog">
        <div>Dialog Content</div>
      </Dialog>
    );

    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    expect(screen.getByText('Dialog Content')).toBeInTheDocument();
  });

  it('should render title correctly', () => {
    render(
      <Dialog isOpen={true} onClose={mockOnClose} title="My Custom Title">
        <div>Content</div>
      </Dialog>
    );

    expect(screen.getByText('My Custom Title')).toBeInTheDocument();
  });

  it('should render children correctly', () => {
    render(
      <Dialog isOpen={true} onClose={mockOnClose} title="Test Dialog">
        <div data-testid="custom-content">Custom Content Here</div>
      </Dialog>
    );

    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.getByText('Custom Content Here')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Dialog isOpen={true} onClose={mockOnClose} title="Test Dialog">
        <div>Content</div>
      </Dialog>
    );

    const closeButton = screen.getByLabelText('Fechar dialog');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when clicking outside dialog (on backdrop)', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Dialog isOpen={true} onClose={mockOnClose} title="Test Dialog">
        <div>Content</div>
      </Dialog>
    );

    const backdrop = container.firstChild as HTMLElement;
    expect(backdrop).toBeInTheDocument();
    expect(backdrop.className).toContain('fixed');
    expect(backdrop.className).toContain('inset-0');

    await user.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when clicking inside dialog content', async () => {
    const user = userEvent.setup();
    render(
      <Dialog isOpen={true} onClose={mockOnClose} title="Test Dialog">
        <div data-testid="dialog-content">Content</div>
      </Dialog>
    );

    const content = screen.getByTestId('dialog-content');
    await user.click(content);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should call onClose when Escape key is pressed', async () => {
    const user = userEvent.setup();
    render(
      <Dialog isOpen={true} onClose={mockOnClose} title="Test Dialog">
        <div>Content</div>
      </Dialog>
    );

    await user.keyboard('{Escape}');

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when Escape is pressed and dialog is closed', async () => {
    const user = userEvent.setup();
    render(
      <Dialog isOpen={false} onClose={mockOnClose} title="Test Dialog">
        <div>Content</div>
      </Dialog>
    );

    await user.keyboard('{Escape}');

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should set body overflow to hidden when dialog opens', () => {
    const { rerender } = render(
      <Dialog isOpen={false} onClose={mockOnClose} title="Test Dialog">
        <div>Content</div>
      </Dialog>
    );

    expect(document.body.style.overflow).toBe('unset');

    rerender(
      <Dialog isOpen={true} onClose={mockOnClose} title="Test Dialog">
        <div>Content</div>
      </Dialog>
    );

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should restore body overflow when dialog closes', () => {
    const { rerender } = render(
      <Dialog isOpen={true} onClose={mockOnClose} title="Test Dialog">
        <div>Content</div>
      </Dialog>
    );

    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Dialog isOpen={false} onClose={mockOnClose} title="Test Dialog">
        <div>Content</div>
      </Dialog>
    );

    expect(document.body.style.overflow).toBe('unset');
  });

  it('should restore body overflow on unmount', () => {
    const { unmount } = render(
      <Dialog isOpen={true} onClose={mockOnClose} title="Test Dialog">
        <div>Content</div>
      </Dialog>
    );

    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).toBe('unset');
  });

  it('should apply correct CSS classes to backdrop', () => {
    const { container } = render(
      <Dialog isOpen={true} onClose={mockOnClose} title="Test Dialog">
        <div>Content</div>
      </Dialog>
    );

    const backdrop = container.querySelector('.fixed.inset-0');
    expect(backdrop).toHaveClass(
      'fixed',
      'inset-0',
      'z-50',
      'flex',
      'items-center',
      'justify-center',
      'bg-black/65',
      'p-4'
    );
  });

  it('should apply correct CSS classes to dialog container', () => {
    const { container } = render(
      <Dialog isOpen={true} onClose={mockOnClose} title="Test Dialog">
        <div>Content</div>
      </Dialog>
    );

    const dialogContainer = container.querySelector('.bg-white.rounded-lg.shadow-xl');
    expect(dialogContainer).toHaveClass(
      'bg-white',
      'rounded-lg',
      'shadow-xl',
      'max-w-2xl',
      'w-full',
      'max-h-[90vh]',
      'overflow-y-auto'
    );
  });

  it('should apply correct CSS classes to header', () => {
    const { container } = render(
      <Dialog isOpen={true} onClose={mockOnClose} title="Test Dialog">
        <div>Content</div>
      </Dialog>
    );

    const header = container.querySelector('.sticky.top-0');
    expect(header).toHaveClass(
      'sticky',
      'top-0',
      'bg-white',
      'border-b',
      'border-gray-200',
      'px-6',
      'py-4',
      'flex',
      'items-center',
      'justify-between',
      'z-10'
    );
  });

  it('should render close icon', () => {
    render(
      <Dialog isOpen={true} onClose={mockOnClose} title="Test Dialog">
        <div>Content</div>
      </Dialog>
    );

    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
  });

  it('should handle complex children content', () => {
    render(
      <Dialog isOpen={true} onClose={mockOnClose} title="Test Dialog">
        <div>
          <h3>Subtitle</h3>
          <p>Paragraph content</p>
          <button>Action Button</button>
        </div>
      </Dialog>
    );

    expect(screen.getByText('Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Paragraph content')).toBeInTheDocument();
    expect(screen.getByText('Action Button')).toBeInTheDocument();
  });
});
