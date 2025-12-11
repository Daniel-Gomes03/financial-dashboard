import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddEventButton } from '../index';
import { DialogType } from '@/app/types';

jest.mock('../../Dialog', () => ({
  Dialog: ({ isOpen, onClose, title, children }: DialogType) => (
    isOpen ? (
      <div data-testid="dialog">
        <div data-testid="dialog-title">{title}</div>
        <button onClick={onClose} data-testid="dialog-close">Close</button>
        {children}
      </div>
    ) : null
  ),
}));

jest.mock('../../EventForm', () => ({
  EventForm: ({ onSuccess }: { onSuccess?: () => void }) => (
    <div data-testid="event-form">
      <button onClick={onSuccess} data-testid="form-success">Submit</button>
    </div>
  ),
}));

jest.mock('react-icons/fa', () => ({
  FaPlus: () => <svg data-testid="plus-icon" />,
}));

describe('AddEventButton', () => {
  it('should render button', () => {
    render(<AddEventButton />);
    expect(screen.getByText('Adicionar Evento')).toBeInTheDocument();
  });

  it('should render plus icon', () => {
    render(<AddEventButton />);
    expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
  });

  it('should not show dialog initially', () => {
    render(<AddEventButton />);
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('should open dialog when button is clicked', async () => {
    const user = userEvent.setup();
    render(<AddEventButton />);

    const button = screen.getByText('Adicionar Evento');
    await user.click(button);

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-title')).toHaveTextContent('Adicionar evento financeiro');
  });

  it('should render EventForm inside dialog when open', async () => {
    const user = userEvent.setup();
    render(<AddEventButton />);

    const button = screen.getByText('Adicionar Evento');
    await user.click(button);

    expect(screen.getByTestId('event-form')).toBeInTheDocument();
  });

  it('should close dialog when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<AddEventButton />);

    const button = screen.getByText('Adicionar Evento');
    await user.click(button);

    expect(screen.getByTestId('dialog')).toBeInTheDocument();

    const closeButton = screen.getByTestId('dialog-close');
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
    });
  });

  it('should close dialog when EventForm calls onSuccess', async () => {
    const user = userEvent.setup();
    render(<AddEventButton />);

    const button = screen.getByText('Adicionar Evento');
    await user.click(button);

    expect(screen.getByTestId('dialog')).toBeInTheDocument();

    const successButton = screen.getByTestId('form-success');
    await user.click(successButton);

    await waitFor(() => {
      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
    });
  });

  it('should handle multiple open/close cycles', async () => {
    const user = userEvent.setup();
    render(<AddEventButton />);

    const button = screen.getByText('Adicionar Evento');

    await user.click(button);
    expect(screen.getByTestId('dialog')).toBeInTheDocument();

    const closeButton = screen.getByTestId('dialog-close');
    await user.click(closeButton);
    await waitFor(() => {
      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
    });

    await user.click(button);
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
  });
});
