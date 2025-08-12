import React from 'react';
import Image from 'next/image';
import { FineWithUsers } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Edit, Trash2, User } from 'lucide-react';

interface FinesTableProps {
  fines: FineWithUsers[];
  loading?: boolean;
  onEdit: (fine: FineWithUsers) => void;
  onDelete: (id: string) => void;
}

const FinesTable: React.FC<FinesTableProps> = ({
  fines,
  loading = false,
  onEdit,
  onDelete
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const UserAvatar: React.FC<{ user: { name: string; avatar_url?: string | null } }> = ({ user }) => {
    if (user.avatar_url) {
      return (
        <Image
          src={user.avatar_url}
          alt={user.name}
          width={32}
          height={32}
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }
    
    return (
      <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center">
        <User className="w-4 h-4 text-amber-700" data-testid="user-icon" />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Offender</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Proposed By</TableHead>
              <TableHead>Replies</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (fines.length === 0) {
    return (
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Offender</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Proposed By</TableHead>
              <TableHead>Replies</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No fines found. Add your first fine using the form above.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Offender</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Proposed By</TableHead>
            <TableHead>Replies</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fines.map((fine) => (
            <TableRow key={fine.id}>
              <TableCell className="font-medium">
                {formatDate(fine.date)}
              </TableCell>
              <TableCell>
                {fine.offender.name}
              </TableCell>
              <TableCell className="max-w-xs">
                <div className="truncate" title={fine.description}>
                  {fine.description}
                </div>
              </TableCell>
              <TableCell className="font-semibold text-red-600">
                {formatCurrency(fine.amount)}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <UserAvatar user={fine.proposed_by} />
                  <span>{fine.proposed_by.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                {fine.replies}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(fine)}
                    className="p-2"
                    title="Edit fine"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(fine.id)}
                    className="p-2"
                    title="Delete fine"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FinesTable;