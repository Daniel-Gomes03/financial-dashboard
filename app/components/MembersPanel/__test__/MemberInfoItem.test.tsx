import { render, screen } from '@testing-library/react';
import { FaUser } from 'react-icons/fa';
import MemberInfoItem from '../MemberInfoItem';

describe('MemberInfoItem', () => {
  it('should render label and value correctly', () => {
    render(
      <MemberInfoItem
        icon={<FaUser className="w-5 h-5 text-blue-500" />}
        label="Nome"
        value="João Silva"
      />
    );

    expect(screen.getByText('Nome')).toBeInTheDocument();
    expect(screen.getByText('João Silva')).toBeInTheDocument();
  });

  it('should render icon', () => {
    const { container } = render(
      <MemberInfoItem
        icon={<FaUser className="w-5 h-5 text-blue-500" />}
        label="Nome"
        value="João Silva"
      />
    );

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should apply correct CSS classes', () => {
    const { container } = render(
      <MemberInfoItem
        icon={<FaUser className="w-5 h-5 text-blue-500" />}
        label="Idade"
        value="30 anos"
      />
    );

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('flex', 'items-center', 'gap-2');
  });
});
