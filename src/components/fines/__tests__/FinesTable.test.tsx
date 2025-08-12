import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FinesTable from '../FinesTable';
import { FineWithUsers } from '@/types';

const mockFines: FineWithUsers[] = [
  {
    id: '1',
    date: '2025-01-15',
    description: 'Speeding violation',
    amount: 150.00,
    replies: 2,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
    offender: {
      id: 'user1',
      name: 'John Doe',
      username: 'johndoe',
      password_hash: 'hash',
      avatar_url: null,
      role: 'user',
      created_at: '2025-01-01T00:00:00Z'
    },
    proposed_by: {
      id: 'user2',
      name: 'Jane Smith',
      username: 'janesmith',
      password_hash: 'hash',
      avatar_url: 'https://example.com/avatar.jpg',
      role: 'admin',
      created_at: '2025-01-01T00:00:00Z'
    }
  }
];

describe('FinesTable', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();
  });

  it('renders table headers correctly', () => {
    render(
      <FinesTable
        fines={mockFines}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Offender')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Proposed By')).toBeInTheDocument();
    expect(screen.getByText('Replies')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders fine data correctly', () => {
    render(
      <FinesTable
        fines={mockFines}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Speeding violation')).toBeInTheDocument();
    expect(screen.getByText('$150.00')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('formats currency in red text', () => {
    render(
      <FinesTable
        fines={mockFines}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const amountElement = screen.getByText('$150.00');
    expect(amountElement).toHaveClass('text-red-600');
  });

  it('displays user avatar when available', () => {
    render(
      <FinesTable
        fines={mockFines}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const avatar = screen.getByAltText('Jane Smith');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('alt', 'Jane Smith');
    // Next.js Image component transforms the src, so we check that it contains the original URL
    expect(avatar.getAttribute('src')).toContain('https%3A%2F%2Fexample.com%2Favatar.jpg');
  });

  it('displays placeholder avatar when no avatar_url', () => {
    const finesWithNoAvatar: FineWithUsers[] = [
      {
        ...mockFines[0],
        proposed_by: {
          ...mockFines[0].proposed_by,
          avatar_url: null
        }
      }
    ];

    render(
      <FinesTable
        fines={finesWithNoAvatar}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // The proposed_by user has no avatar_url, so should show placeholder
    const placeholderAvatar = screen.getByTestId('user-icon');
    expect(placeholderAvatar).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <FinesTable
        fines={mockFines}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByTitle('Edit fine');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockFines[0]);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <FinesTable
        fines={mockFines}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByTitle('Delete fine');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('shows empty state when no fines', () => {
    render(
      <FinesTable
        fines={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('No fines found. Add your first fine using the form above.')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <FinesTable
        fines={[]}
        loading={true}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const loadingElements = screen.getAllByRole('cell');
    expect(loadingElements.length).toBeGreaterThan(0);
  });
});