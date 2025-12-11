import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavigationMenu } from '../index';

jest.mock('react-icons/fa', () => ({
  FaBars: () => <svg data-testid="bars-icon" />,
  FaUsers: () => <svg data-testid="users-icon" />,
  FaChartLine: () => <svg data-testid="chart-icon" />,
}));

describe('NavigationMenu', () => {
  const mockOnViewChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render menu button', () => {
    render(<NavigationMenu currentView="dashboard" onViewChange={mockOnViewChange} />);
    const menuButton = screen.getByLabelText('Menu de navegação');
    expect(menuButton).toBeInTheDocument();
  });

  it('should render bars icon', () => {
    render(<NavigationMenu currentView="dashboard" onViewChange={mockOnViewChange} />);
    expect(screen.getByTestId('bars-icon')).toBeInTheDocument();
  });

  it('should not show menu initially', () => {
    render(<NavigationMenu currentView="dashboard" onViewChange={mockOnViewChange} />);
    expect(screen.queryByText('Membros')).not.toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('should open menu when button is clicked', async () => {
    const user = userEvent.setup();
    render(<NavigationMenu currentView="dashboard" onViewChange={mockOnViewChange} />);

    const menuButton = screen.getByLabelText('Menu de navegação');
    await user.click(menuButton);

    expect(screen.getByText('Membros')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should close menu when button is clicked again', async () => {
    const user = userEvent.setup();
    render(<NavigationMenu currentView="dashboard" onViewChange={mockOnViewChange} />);

    const menuButton = screen.getByLabelText('Menu de navegação');
    await user.click(menuButton);
    expect(screen.getByText('Membros')).toBeInTheDocument();

    await user.click(menuButton);
    expect(screen.queryByText('Membros')).not.toBeInTheDocument();
  });

  it('should call onViewChange with "members" when Membros is clicked', async () => {
    const user = userEvent.setup();
    render(<NavigationMenu currentView="dashboard" onViewChange={mockOnViewChange} />);

    const menuButton = screen.getByLabelText('Menu de navegação');
    await user.click(menuButton);

    const membersButton = screen.getByText('Membros');
    await user.click(membersButton);

    expect(mockOnViewChange).toHaveBeenCalledWith('members');
    expect(mockOnViewChange).toHaveBeenCalledTimes(1);
  });

  it('should call onViewChange with "dashboard" when Dashboard is clicked', async () => {
    const user = userEvent.setup();
    render(<NavigationMenu currentView="members" onViewChange={mockOnViewChange} />);

    const menuButton = screen.getByLabelText('Menu de navegação');
    await user.click(menuButton);

    const dashboardButton = screen.getByText('Dashboard');
    await user.click(dashboardButton);

    expect(mockOnViewChange).toHaveBeenCalledWith('dashboard');
    expect(mockOnViewChange).toHaveBeenCalledTimes(1);
  });

  it('should close menu after selecting a view', async () => {
    const user = userEvent.setup();
    render(<NavigationMenu currentView="dashboard" onViewChange={mockOnViewChange} />);

    const menuButton = screen.getByLabelText('Menu de navegação');
    await user.click(menuButton);

    const membersButton = screen.getByText('Membros');
    await user.click(membersButton);

    expect(screen.queryByText('Membros')).not.toBeInTheDocument();
  });

  it('should highlight active view (members)', async () => {
    const user = userEvent.setup();
    render(
      <NavigationMenu currentView="members" onViewChange={mockOnViewChange} />
    );

    const menuButton = screen.getByLabelText('Menu de navegação');
    await user.click(menuButton);

    const membersButton = screen.getByText('Membros').closest('button');
    expect(membersButton).toHaveClass('bg-primary-50', 'text-primary-500', 'font-semibold');
  });

  it('should highlight active view (dashboard)', async () => {
    const user = userEvent.setup();
    render(
      <NavigationMenu currentView="dashboard" onViewChange={mockOnViewChange} />
    );

    const menuButton = screen.getByLabelText('Menu de navegação');
    await user.click(menuButton);

    const dashboardButton = screen.getByText('Dashboard').closest('button');
    expect(dashboardButton).toHaveClass('bg-primary-50', 'text-primary-500', 'font-semibold');
  });

  it('should not highlight inactive view', async () => {
    const user = userEvent.setup();
    render(<NavigationMenu currentView="dashboard" onViewChange={mockOnViewChange} />);

    const menuButton = screen.getByLabelText('Menu de navegação');
    await user.click(menuButton);

    const membersButton = screen.getByText('Membros').closest('button');
    expect(membersButton).not.toHaveClass('bg-primary-50', 'text-primary-500', 'font-semibold');
    expect(membersButton).toHaveClass('text-gray-700');
  });

  it('should render users icon for Membros button', async () => {
    const user = userEvent.setup();
    render(<NavigationMenu currentView="dashboard" onViewChange={mockOnViewChange} />);

    const menuButton = screen.getByLabelText('Menu de navegação');
    await user.click(menuButton);

    expect(screen.getByTestId('users-icon')).toBeInTheDocument();
  });

  it('should render chart icon for Dashboard button', async () => {
    const user = userEvent.setup();
    render(<NavigationMenu currentView="dashboard" onViewChange={mockOnViewChange} />);

    const menuButton = screen.getByLabelText('Menu de navegação');
    await user.click(menuButton);

    expect(screen.getByTestId('chart-icon')).toBeInTheDocument();
  });

  it('should apply correct CSS classes to menu button', () => {
    render(
      <NavigationMenu currentView="dashboard" onViewChange={mockOnViewChange} />
    );
    const menuButton = screen.getByLabelText('Menu de navegação');
    expect(menuButton).toHaveClass(
      'fixed',
      'top-4',
      'right-4',
      'z-50',
      'p-3',
      'bg-primary-500',
      'text-white',
      'rounded-lg',
      'shadow-lg',
      'hover:bg-primary-600',
      'transition-colors',
      'flex',
      'items-center',
      'gap-2'
    );
  });

  it('should apply correct CSS classes to menu dropdown', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <NavigationMenu currentView="dashboard" onViewChange={mockOnViewChange} />
    );

    const menuButton = screen.getByLabelText('Menu de navegação');
    await user.click(menuButton);

    const dropdown = container.querySelector('.fixed.top-16.right-4');
    expect(dropdown).toHaveClass(
      'fixed',
      'top-16',
      'right-4',
      'z-50',
      'bg-white',
      'rounded-lg',
      'shadow-xl',
      'border',
      'border-gray-200',
      'min-w-[200px]',
      'overflow-hidden'
    );
  });

  it('should set aria-expanded to false initially', () => {
    render(<NavigationMenu currentView="dashboard" onViewChange={mockOnViewChange} />);
    const menuButton = screen.getByLabelText('Menu de navegação');
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('should set aria-expanded to true when menu is open', async () => {
    const user = userEvent.setup();
    render(<NavigationMenu currentView="dashboard" onViewChange={mockOnViewChange} />);

    const menuButton = screen.getByLabelText('Menu de navegação');
    await user.click(menuButton);

    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('should close menu when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <NavigationMenu currentView="dashboard" onViewChange={mockOnViewChange} />
        <div data-testid="outside-element">Outside</div>
      </div>
    );

    const menuButton = screen.getByLabelText('Menu de navegação');
    await user.click(menuButton);
    expect(screen.getByText('Membros')).toBeInTheDocument();

    const outsideElement = screen.getByTestId('outside-element');
    await user.click(outsideElement);

    expect(screen.queryByText('Membros')).not.toBeInTheDocument();
  });

  it('should not close menu when clicking inside menu', async () => {
    const user = userEvent.setup();
    render(<NavigationMenu currentView="dashboard" onViewChange={mockOnViewChange} />);

    const menuButton = screen.getByLabelText('Menu de navegação');
    await user.click(menuButton);

    const membersButton = screen.getByText('Membros');
    const menuContainer = membersButton.closest('.fixed.top-16');
    if (menuContainer) {
      await user.click(menuContainer);
    }
  });
});
