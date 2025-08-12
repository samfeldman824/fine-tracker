'use client'

import React, { useState } from 'react'
import { AddFineForm } from './AddFineForm'
import { User, CreateFineSchemaType } from '@/types'

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'John Doe',
    username: 'john.doe',
    password_hash: 'hash',
    avatar_url: null,
    role: 'user',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Jane Smith',
    username: 'jane.smith',
    password_hash: 'hash',
    avatar_url: null,
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Bob Johnson',
    username: 'bob.johnson',
    password_hash: 'hash',
    avatar_url: null,
    role: 'user',
    created_at: '2024-01-01T00:00:00Z'
  }
]

export function AddFineFormDemo() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (data: CreateFineSchemaType) => {
    setLoading(true)
    setMessage(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Log the submitted data (in real app, this would call the database)
      console.log('Fine submitted:', data)
      
      setMessage(`Fine added successfully! Offender: ${mockUsers.find(u => u.id === data.offender_id)?.name}, Amount: $${data.amount.toFixed(2)}`)
    } catch (error) {
      setMessage('Error adding fine. Please try again.')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-amber-900 mb-6">Add Fine Form Demo</h2>
      
      <AddFineForm
        users={mockUsers}
        onSubmit={handleSubmit}
        loading={loading}
      />

      {message && (
        <div className={`mt-4 p-4 rounded-md ${
          message.includes('Error') 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Available Users:</h3>
        <ul className="space-y-1">
          {mockUsers.map(user => (
            <li key={user.id} className="text-sm text-gray-600">
              {user.name} ({user.role})
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}