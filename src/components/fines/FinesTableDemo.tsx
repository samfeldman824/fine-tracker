import React, { useState } from 'react';
import FinesTable from './FinesTable';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { FineWithUsers } from '@/types';

// Demo component to show how FinesTable would be used
const FinesTableDemo: React.FC = () => {
  const [fines, setFines] = useState<FineWithUsers[]>([
    {
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
        avatar_url: 'https://ui-avatars.com/api/?name=John+Doe&size=150&background=f59e0b&color=fff',
        role: 'user',
        created_at: '2025-01-01T00:00:00Z'
      },
      proposed_by: {
        id: 'user2',
        name: 'Jane Smith',
        username: 'janesmith',
        password_hash: 'hash',
        avatar_url: 'https://ui-avatars.com/api/?name=Jane+Smith&size=150&background=10b981&color=fff',
        role: 'admin',
        created_at: '2025-01-01T00:00:00Z'
      }
    },
    {
      id: '2',
      date: '2025-01-14',
      description: 'Parking violation in handicapped space',
      amount: 250.00,
      replies: 0,
      created_at: '2025-01-14T14:30:00Z',
      updated_at: '2025-01-14T14:30:00Z',
      offender: {
        id: 'user3',
        name: 'Bob Wilson',
        username: 'bobwilson',
        password_hash: 'hash',
        avatar_url: 'https://ui-avatars.com/api/?name=Bob+Wilson&size=150&background=3b82f6&color=fff',
        role: 'user',
        created_at: '2025-01-01T00:00:00Z'
      },
      proposed_by: {
        id: 'user2',
        name: 'Jane Smith',
        username: 'janesmith',
        password_hash: 'hash',
        avatar_url: 'https://ui-avatars.com/api/?name=Jane+Smith&size=150&background=10b981&color=fff',
        role: 'admin',
        created_at: '2025-01-01T00:00:00Z'
      }
    },
    {
      id: '3',
      date: '2025-01-13',
      description: 'Running red light at Main St intersection',
      amount: 300.00,
      replies: 1,
      created_at: '2025-01-13T09:15:00Z',
      updated_at: '2025-01-13T09:15:00Z',
      offender: {
        id: 'user4',
        name: 'Alice Johnson',
        username: 'alicejohnson',
        password_hash: 'hash',
        avatar_url: 'https://ui-avatars.com/api/?name=Alice+Johnson&size=150&background=ec4899&color=fff',
        role: 'user',
        created_at: '2025-01-01T00:00:00Z'
      },
      proposed_by: {
        id: 'user5',
        name: 'Mike Davis',
        username: 'mikedavis',
        password_hash: 'hash',
        avatar_url: 'https://ui-avatars.com/api/?name=Mike+Davis&size=150&background=8b5cf6&color=fff',
        role: 'admin',
        created_at: '2025-01-01T00:00:00Z'
      }
    }
  ]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fineToDelete, setFineToDelete] = useState<FineWithUsers | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (fine: FineWithUsers) => {
    console.log('Edit fine:', fine);
    alert(`Edit fine: ${fine.description}`);
  };

  const handleDelete = (id: string) => {
    const fine = fines.find(f => f.id === id);
    if (fine) {
      setFineToDelete(fine);
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!fineToDelete) return;

    setIsDeleting(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove the fine from the list
      setFines(prevFines => prevFines.filter(f => f.id !== fineToDelete.id));
      
      console.log('Fine deleted successfully:', fineToDelete.id);
      
      // Close modal and reset state
      setDeleteModalOpen(false);
      setFineToDelete(null);
    } catch (error) {
      console.error('Error deleting fine:', error);
      alert('Failed to delete fine. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModalOpen(false);
      setFineToDelete(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <FinesTable
          fines={fines}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <ConfirmDeleteModal
        fine={fineToDelete}
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
    </>
  );
};

export default FinesTableDemo;