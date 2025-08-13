import React, { useState } from 'react';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { Button } from '@/components/ui/button';
import { FineWithUsers } from '@/types';

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

export function ConfirmDeleteModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsDeleting(false);
    setIsOpen(false);
    alert('Fine deleted successfully!');
  };

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-xl font-semibold">ConfirmDeleteModal Demo</h2>
      <Button onClick={() => setIsOpen(true)}>
        Delete Fine
      </Button>
      
      <ConfirmDeleteModal
        fine={mockFine}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
    </div>
  );
}