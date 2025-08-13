import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { EditFineModal } from '../EditFineModal'
import { FineWithUsers, User } from '@/types'

// Mock data
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
  description: 'Speeding violation',
  amount: 150.00,
  replies: 0,
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z',
  offender: mockUsers[0],
  proposed_by: mockUsers[1]
}

describe('EditFineModal', () => {
  const mockOnClose = vi.fn()
  const mockOnSave = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when fine is null', () => {
    render(
      <EditFineModal
        fine={null}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        users={mockUsers}
      />
    )

    expect(screen.queryByText('Edit Fine')).not.toBeInTheDocument()
  })

  it('renders nothing when modal is closed', () => {
    render(
      <EditFineModal
        fine={mockFine}
        isOpen={false}
        onClose={mockOnClose}
        onSave={mockOnSave}
        users={mockUsers}
      />
    )

    expect(screen.queryByText('Edit Fine')).not.toBeInTheDocument()
  })

  it('renders modal with pre-populated form when open', () => {
    render(
      <EditFineModal
        fine={mockFine}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        users={mockUsers}
      />
    )

    expect(screen.getByText('Edit Fine')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Speeding violation')).toBeInTheDocument()
    expect(screen.getByDisplayValue('150')).toBeInTheDocument()
    
    // Check that the correct offender is selected
    const offenderSelect = screen.getByLabelText('Offender') as HTMLSelectElement
    expect(offenderSelect.value).toBe('1')
  })

  it('displays all users in the offender dropdown', () => {
    render(
      <EditFineModal
        fine={mockFine}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        users={mockUsers}
      />
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('calls onClose when cancel button is clicked', async () => {
    render(
      <EditFineModal
        fine={mockFine}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        users={mockUsers}
      />
    )

    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when close button (X) is clicked', async () => {
    render(
      <EditFineModal
        fine={mockFine}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        users={mockUsers}
      />
    )

    const closeButton = screen.getByLabelText('Close modal')
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when escape key is pressed', () => {
    render(
      <EditFineModal
        fine={mockFine}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        users={mockUsers}
      />
    )

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('renders form with pre-populated values', async () => {
    render(
      <EditFineModal
        fine={mockFine}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        users={mockUsers}
      />
    )

    // Check that the form is rendered with the fine data
    expect(screen.getByDisplayValue('fine-1')).toBeInTheDocument() // hidden ID field
    
    // Check that the form fields are present
    expect(screen.getByLabelText('Offender')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Amount ($)')).toBeInTheDocument()
  })

  it('shows validation errors for invalid input', async () => {
    render(
      <EditFineModal
        fine={mockFine}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        users={mockUsers}
      />
    )

    // Clear required fields
    const descriptionInput = screen.getByLabelText('Description')
    fireEvent.change(descriptionInput, { target: { value: '' } })

    const amountInput = screen.getByLabelText('Amount ($)')
    fireEvent.change(amountInput, { target: { value: '0' } })

    // Try to submit
    const saveButton = screen.getByText('Save Changes')
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText('Description is required')).toBeInTheDocument()
      expect(screen.getByText('Amount must be greater than 0')).toBeInTheDocument()
    })

    expect(mockOnSave).not.toHaveBeenCalled()
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('disables form and buttons when loading', () => {
    render(
      <EditFineModal
        fine={mockFine}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        users={mockUsers}
        loading={true}
      />
    )

    expect(screen.getByLabelText('Offender')).toBeDisabled()
    expect(screen.getByLabelText('Description')).toBeDisabled()
    expect(screen.getByLabelText('Amount ($)')).toBeDisabled()
    expect(screen.getByText('Cancel')).toBeDisabled()
    expect(screen.getByText('Saving...')).toBeInTheDocument()
  })

  it('shows form submission button states', async () => {
    render(
      <EditFineModal
        fine={mockFine}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        users={mockUsers}
        loading={true}
      />
    )

    // Check loading state
    expect(screen.getByText('Saving...')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeDisabled()
  })

  it('has proper form structure and accessibility', () => {
    render(
      <EditFineModal
        fine={mockFine}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        users={mockUsers}
      />
    )

    // Check modal accessibility
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument()
    
    // Check form structure
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument()
  })

  it('resets form when modal closes', async () => {
    const { rerender } = render(
      <EditFineModal
        fine={mockFine}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        users={mockUsers}
      />
    )

    // Verify form is populated
    expect(screen.getByDisplayValue('Speeding violation')).toBeInTheDocument()

    // Close modal
    rerender(
      <EditFineModal
        fine={mockFine}
        isOpen={false}
        onClose={mockOnClose}
        onSave={mockOnSave}
        users={mockUsers}
      />
    )

    // Reopen modal
    rerender(
      <EditFineModal
        fine={mockFine}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        users={mockUsers}
      />
    )

    // Form should be repopulated with original data
    expect(screen.getByDisplayValue('Speeding violation')).toBeInTheDocument()
    expect(screen.getByDisplayValue('150')).toBeInTheDocument()
  })
})