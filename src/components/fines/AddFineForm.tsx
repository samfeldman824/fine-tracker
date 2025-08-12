'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select } from '@/components/ui'
import { createFineSchema, CreateFineSchemaType, User } from '@/types'

interface AddFineFormProps {
  users: User[]
  onSubmit: (data: CreateFineSchemaType) => Promise<void>
  loading?: boolean
}

export function AddFineForm({ users, onSubmit, loading = false }: AddFineFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CreateFineSchemaType>({
    resolver: zodResolver(createFineSchema),
    defaultValues: {
      offender_id: '',
      description: '',
      amount: undefined
    }
  })

  const handleFormSubmit = async (data: CreateFineSchemaType) => {
    try {
      await onSubmit(data)
      reset() // Clear form after successful submission
    } catch (error) {
      // Error handling is managed by parent component
      console.error('Form submission error:', error)
    }
  }

  const isFormLoading = loading || isSubmitting

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-amber-900 mb-4">Add New Fine</h3>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Offender Dropdown */}
          <div>
            <Select
              label="Offender"
              error={errors.offender_id?.message}
              disabled={isFormLoading}
              {...register('offender_id')}
            >
              <option value="">Select an offender</option>
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
              placeholder="Enter violation description"
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
            loading={isFormLoading}
            disabled={isFormLoading}
            className="min-w-[120px]"
          >
            {isFormLoading ? 'Adding...' : 'Add Fine'}
          </Button>
        </div>
      </form>
    </div>
  )
}