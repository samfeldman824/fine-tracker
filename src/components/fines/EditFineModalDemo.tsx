'use client'

import React, { useState } from 'react'
import { EditFineModal } from './EditFineModal'
import { Button } from '@/components/ui'
import { FineWithUsers, User, UpdateFineSchemaType } from '@/types'

// Mock data for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    username: 'john',
    password_hash: 'hash',
    avatar_url: null,
    role: 'user',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    username: 'jane',
    password_hash: 'hash',
    avatar_url: null,
    role: 'user',
    created_at: '2024-01-01T00:00:00Z'
  }
]

const mockFine: FineWithUsers = {
  id: 'fine-1',
  date: '2024-01-15',
  description: 'Speeding violation - 15 mph over limit',
  amount: 150.00,
  replies: 0,
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z',
  offender: mockUsers[0],
  proposed_by: mockUsers[1]
}

export function EditFineModalDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSave = async (data: UpdateFineSchemaType) => {
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Saving fine:', data)
    alert(`Fine updated successfully!\n\nID: ${data.id}\nOffender: ${mockUsers.find(u => u.id === data.offender_id)?.name}\nDescription: ${data.description}\nAmount: $${data.amount}`)
    
    setLoading(false)
  }

  const handleClose = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold text-amber-900">Edit Fine Modal Demo</h2>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="font-medium text-amber-900 mb-2">Current Fine Details:</h3>
        <div className="text-sm text-amber-800 space-y-1">
          <p><strong>Offender:</strong> {mockFine.offender.name}</p>
          <p><strong>Description:</strong> {mockFine.description}</p>
          <p><strong>Amount:</strong> ${mockFine.amount}</p>
          <p><strong>Proposed by:</strong> {mockFine.proposed_by.name}</p>
        </div>
      </div>

      <Button onClick={() => setIsModalOpen(true)}>
        Edit Fine
      </Button>

      <EditFineModal
        fine={mockFine}
        isOpen={isModalOpen}
        onClose={handleClose}
        onSave={handleSave}
        users={mockUsers}
        loading={loading}
      />
    </div>
  )
}