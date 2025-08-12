import React from 'react';
import FinesTable from './FinesTable';
import { FineWithUsers } from '@/types';

// Demo component to show how FinesTable would be used
const FinesTableDemo: React.FC = () => {
  const mockFines: FineWithUsers[] = [
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
        avatar_url: null,
        role: 'user',
        created_at: '2025-01-01T00:00:00Z'
      },
      proposed_by: {
        id: 'user2',
        name: 'Jane Smith',
        username: 'janesmith',
        password_hash: 'hash',
        avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
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
        avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        role: 'user',
        created_at: '2025-01-01T00:00:00Z'
      },
      proposed_by: {
        id: 'user5',
        name: 'Mike Davis',
        username: 'mikedavis',
        password_hash: 'hash',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        role: 'admin',
        created_at: '2025-01-01T00:00:00Z'
      }
    }
  ];

  const handleEdit = (fine: FineWithUsers) => {
    console.log('Edit fine:', fine);
    alert(`Edit fine: ${fine.description}`);
  };

  const handleDelete = (id: string) => {
    console.log('Delete fine:', id);
    alert(`Delete fine with ID: ${id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <FinesTable
        fines={mockFines}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default FinesTableDemo;