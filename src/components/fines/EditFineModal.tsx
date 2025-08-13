'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/modal'
import { Button, Input, Select } from '@/components/ui'
import { updateFineSchema, UpdateFineSchemaType, User, FineWithUsers } from '@/types'

interface EditFineModalProps {
    fine: FineWithUsers | null
    isOpen: boolean
    onClose: () => void
    onSave: (data: UpdateFineSchemaType) => Promise<void>
    users: User[]
    loading?: boolean
}

export function EditFineModal({
    fine,
    isOpen,
    onClose,
    onSave,
    users,
    loading = false
}: EditFineModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<UpdateFineSchemaType>({
        resolver: zodResolver(updateFineSchema),
        defaultValues: {
            id: '',
            offender_id: '',
            description: '',
            amount: undefined
        }
    })

    // Pre-populate form when fine changes
    useEffect(() => {
        if (fine && isOpen) {
            reset({
                id: fine.id,
                offender_id: fine.offender.id,
                description: fine.description,
                amount: fine.amount
            })
        }
    }, [fine, isOpen, reset])

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            reset()
        }
    }, [isOpen, reset])

    const handleFormSubmit = async (data: UpdateFineSchemaType) => {
        try {
            await onSave(data)
            onClose()
        } catch (error) {
            // Error handling is managed by parent component
            console.error('Form submission error:', error)
        }
    }

    const handleClose = () => {
        if (!isSubmitting && !loading) {
            onClose()
        }
    }

    const isFormLoading = loading || isSubmitting

    if (!fine) return null

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Edit Fine"
            className="max-w-lg"
        >
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                {/* Hidden ID field */}
                <input type="hidden" {...register('id')} />

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

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={isFormLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        loading={isFormLoading}
                        disabled={isFormLoading}
                        className="min-w-[120px]"
                    >
                        {isFormLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}