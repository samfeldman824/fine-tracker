'use client'

import React, { useState } from 'react'
import { AddCreditForm } from './AddCreditForm'
import { CreateCreditSchemaType, User } from '@/types'

// Demo users data
const demoUsers: User[] = [
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

export function AddCreditFormDemo() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (data: CreateCreditSchemaType) => {
    setLoading(true)
    setMessage(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Credit submitted:', data)
      setMessage(`✅ Credit added successfully: $${data.amount} for ${demoUsers.find(u => u.id === data.person_id)?.name}`)
    } catch (error) {
      console.error('Error submitting credit:', error)
      setMessage('❌ Failed to add credit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Add Credit Form Demo</h1>
        <p className="text-gray-600">
          This is a demonstration of the AddCreditForm component with form validation and submission handling.
        </p>
      </div>

      <AddCreditForm 
        users={demoUsers} 
        onSubmit={handleSubmit}
        loading={loading}
      />

      {message && (
        <div className={`mt-4 p-4 rounded-lg ${
          message.includes('✅') 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Demo Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>Form validation with Zod schema</li>
          <li>Person dropdown with demo users</li>
          <li>Amount validation (positive numbers, max $10,000)</li>
          <li>Description validation (required, max 500 characters)</li>
          <li>Loading states during submission</li>
          <li>Form reset after successful submission</li>
          <li>Green accent styling for credits</li>
        </ul>
      </div>
    </div>
  )
}