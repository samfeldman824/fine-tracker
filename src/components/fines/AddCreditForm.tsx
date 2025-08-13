'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select } from '@/components/ui'
import { createCreditSchema, CreateCreditSchemaType, User } from '@/types'

interface AddCreditFormProps {
  users: User[]
  onSubmit: (data: CreateCreditSchemaType) => Promise<void>
  loading?: boolean
}

export function AddCreditForm({ users, onSubmit, loading = false }: AddCreditFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CreateCreditSchemaType>({
    resolver: zodResolver(createCreditSchema),
    defaultValues: {
      person_id: '',
      description: '',
      amount: undefined
    }
  })

  const handleFormSubmit = async (data: CreateCreditSchemaType) => {
    try {
      await onSubmit(data)
      reset() // Clear form after successful submission
    } catch (error) {
      // Error handling is managed by parent component through toast notifications
      console.error('Form submission error:', error)
      // Don't re-throw here as the parent handles the error display
    }
  }

  const isFormLoading = loading || isSubmitting

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-green-900 mb-4">Add New Credit</h3>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Person Dropdown */}
          <div>
            <Select
              label="Person"
              error={errors.person_id?.message}
              disabled={isFormLoading}
              {...register('person_id')}
            >
              <option value="">Select a person</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Description Field */}
          <div>
            <Input
              label="Description"
              placeholder="Enter credit description"
              error={errors.description?.message}
              disabled={isFormLoading}
              {...register('description')}
            />
          </div>

          {/* Amount Field */}
          <div>
            <Input
              label="Amount ($)"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.amount?.message}
              disabled={isFormLoading}
              {...register('amount', {
                valueAsNumber: true
              })}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            loading={isFormLoading}
            disabled={isFormLoading}
            className="min-w-[120px] bg-green-600 hover:bg-green-700 focus:ring-green-500"
          >
            {isFormLoading ? 'Adding...' : 'Add Credit'}
          </Button>
        </div>
      </form>
    </div>
  )
}