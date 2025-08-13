'use client'

import React from 'react'
import { ConfirmModal } from '@/components/ui/modal'
import { FineWithUsers } from '@/types'

interface ConfirmDeleteModalProps {
  fine: FineWithUsers | null
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  loading?: boolean
}

export function ConfirmDeleteModal({
  fine,
  isOpen,
  onClose,
  onConfirm,
  loading = false
}: ConfirmDeleteModalProps) {
  const handleConfirm = async () => {
    if (!loading) {
      await onConfirm()
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  if (!fine) return null

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title="Delete Fine"
      message={`Are you sure you want to delete this fine? This action cannot be undone.

Fine Details:
• Date: ${formatDate(fine.date)}
• Offender: ${fine.offender.name}
• Amount: ${formatCurrency(fine.amount)}
• Description: ${fine.description}`}
      confirmText={loading ? 'Deleting...' : 'Delete Fine'}
      cancelText="Cancel"
      variant="danger"
    />
  )
}