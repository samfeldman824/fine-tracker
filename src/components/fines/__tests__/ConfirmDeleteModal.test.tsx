import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, beforeEach } from 'vitest';
import { ConfirmDeleteModal } from '../ConfirmDeleteModal';
import { FineWithUsers } from '@/types';

// Mock the ConfirmModal component
vi.mock('@/components/ui/modal', () => ({
  ConfirmModal: ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, variant }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    variant: string;
  }) => {
    if (!isOpen) return null;
    
    return (
      <div data-testid="confirm-modal">
        <h2>{title}</h2>
        <div data-testid="modal-message">{message}</div>
        <button onClick={onClose} data-testid="cancel-button">
          {cancelText}
        </button>
        <button 
          onClick={onConfirm} 
          data-testid="confirm-button"
          className={variant}
        >
          {confirmText}
        </button>
      </div>
    );
  }
}));

const mockFine: FineWithUsers = {
  id: '1',
  date: '2025-01-15',
  description: 'Speeding violation on Highway 101',
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
    avatar_url: null,
    role: 'admin',
    created_at: '2025-01-01T00:00:00Z'
  }
};

describe('ConfirmDeleteModal', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when fine is null', () => {
    render(
      <ConfirmDeleteModal
        fine={null}
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
  });

  it('renders nothing when isOpen is false', () => {
    render(
      <ConfirmDeleteModal
        fine={mockFine}
        isOpen={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
  });

  it('renders modal with correct title and fine details when open', () => {
    render(
      <ConfirmDeleteModal
        fine={mockFine}
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Delete Fine' })).toBeInTheDocument();
    
    const message = screen.getByTestId('modal-message');
    expect(message).toHaveTextContent('Are you sure you want to delete this fine?');
    expect(message).toHaveTextContent('John Doe');
    expect(message).toHaveTextContent('$150.00');
    expect(message).toHaveTextContent('Speeding violation on Highway 101');
    expect(message).toHaveTextContent('Jan 1'); // Just check for the month and day part
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <ConfirmDeleteModal
        fine={mockFine}
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    fireEvent.click(screen.getByTestId('cancel-button'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when confirm button is clicked', async () => {
    mockOnConfirm.mockResolvedValue(undefined);

    render(
      <ConfirmDeleteModal
        fine={mockFine}
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    fireEvent.click(screen.getByTestId('confirm-button'));
    
    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });
  });

  it('shows loading state when loading prop is true', () => {
    render(
      <ConfirmDeleteModal
        fine={mockFine}
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        loading={true}
      />
    );

    expect(screen.getByText('Deleting...')).toBeInTheDocument();
  });

  it('shows default confirm text when not loading', () => {
    render(
      <ConfirmDeleteModal
        fine={mockFine}
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        loading={false}
      />
    );

    expect(screen.getByTestId('confirm-button')).toHaveTextContent('Delete Fine');
  });

  it('does not call onClose when loading', () => {
    render(
      <ConfirmDeleteModal
        fine={mockFine}
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        loading={true}
      />
    );

    fireEvent.click(screen.getByTestId('cancel-button'));
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('does not call onConfirm when loading', () => {
    render(
      <ConfirmDeleteModal
        fine={mockFine}
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        loading={true}
      />
    );

    fireEvent.click(screen.getByTestId('confirm-button'));
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('uses danger variant for confirm button', () => {
    render(
      <ConfirmDeleteModal
        fine={mockFine}
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    const confirmButton = screen.getByTestId('confirm-button');
    expect(confirmButton).toHaveClass('danger');
  });
});