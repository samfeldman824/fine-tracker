import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { AddCreditForm } from '../AddCreditForm'
import { User } from '@/types'

// Mock users data
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
  }
]

describe('AddCreditForm', () => {
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('renders all form fields correctly', () => {
    render(<AddCreditForm users={mockUsers} onSubmit={mockOnSubmit} />)

    expect(screen.getByText('Add New Credit')).toBeInTheDocument()
    expect(screen.getByLabelText('Person')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Amount ($)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add Credit' })).toBeInTheDocument()
  })

  it('populates person dropdown with users', () => {
    render(<AddCreditForm users={mockUsers} onSubmit={mockOnSubmit} />)

    const personSelect = screen.getByLabelText('Person')
    expect(personSelect).toBeInTheDocument()

    // Check that all users are in the dropdown
    expect(screen.getByText('Select a person')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('shows validation errors for empty required fields', async () => {
    render(<AddCreditForm users={mockUsers} onSubmit={mockOnSubmit} />)

    const submitButton = screen.getByRole('button', { name: 'Add Credit' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Please select a person')).toBeInTheDocument()
      expect(screen.getByText('Description is required')).toBeInTheDocument()
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('shows validation error for invalid amount', async () => {
    render(<AddCreditForm users={mockUsers} onSubmit={mockOnSubmit} />)

    // Fill required fields first
    const personSelect = screen.getByLabelText('Person')
    fireEvent.change(personSelect, { target: { value: '550e8400-e29b-41d4-a716-446655440000' } })

    const descriptionInput = screen.getByLabelText('Description')
    fireEvent.change(descriptionInput, { target: { value: 'Test credit' } })

    const amountInput = screen.getByLabelText('Amount ($)')
    // Use 0 instead of negative number since HTML5 number input prevents negative values
    fireEvent.change(amountInput, { target: { value: '0' } })

    const submitButton = screen.getByRole('button', { name: 'Add Credit' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Amount must be greater than 0')).toBeInTheDocument()
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('submits form with valid data', async () => {
    mockOnSubmit.mockResolvedValue(undefined)

    render(<AddCreditForm users={mockUsers} onSubmit={mockOnSubmit} />)

    // Fill out the form
    const personSelect = screen.getByLabelText('Person')
    fireEvent.change(personSelect, { target: { value: '550e8400-e29b-41d4-a716-446655440000' } })

    const descriptionInput = screen.getByLabelText('Description')
    fireEvent.change(descriptionInput, { target: { value: 'Payment received' } })

    const amountInput = screen.getByLabelText('Amount ($)')
    fireEvent.change(amountInput, { target: { value: '25.50' } })

    const submitButton = screen.getByRole('button', { name: 'Add Credit' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        person_id: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Payment received',
        amount: 25.5
      })
    })
  })

  it('resets form after successful submission', async () => {
    mockOnSubmit.mockResolvedValue(undefined)

    render(<AddCreditForm users={mockUsers} onSubmit={mockOnSubmit} />)

    // Fill out the form
    const personSelect = screen.getByLabelText('Person') as HTMLSelectElement
    const descriptionInput = screen.getByLabelText('Description') as HTMLInputElement
    const amountInput = screen.getByLabelText('Amount ($)') as HTMLInputElement

    fireEvent.change(personSelect, { target: { value: '550e8400-e29b-41d4-a716-446655440000' } })
    fireEvent.change(descriptionInput, { target: { value: 'Payment received' } })
    fireEvent.change(amountInput, { target: { value: '25.50' } })

    const submitButton = screen.getByRole('button', { name: 'Add Credit' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled()
    })

    // Check that form is reset
    await waitFor(() => {
      expect(personSelect.value).toBe('')
      expect(descriptionInput.value).toBe('')
      expect(amountInput.value).toBe('')
    })
  })

  it('shows loading state during submission', async () => {
    // Mock a delayed submission
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(<AddCreditForm users={mockUsers} onSubmit={mockOnSubmit} />)

    // Fill out the form
    const personSelect = screen.getByLabelText('Person')
    fireEvent.change(personSelect, { target: { value: '550e8400-e29b-41d4-a716-446655440000' } })

    const descriptionInput = screen.getByLabelText('Description')
    fireEvent.change(descriptionInput, { target: { value: 'Payment received' } })

    const amountInput = screen.getByLabelText('Amount ($)')
    fireEvent.change(amountInput, { target: { value: '25.50' } })

    const submitButton = screen.getByRole('button', { name: 'Add Credit' })
    fireEvent.click(submitButton)

    // Check loading state
    expect(screen.getByText('Adding...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled()
    })
  })

  it('disables form when loading prop is true', () => {
    render(<AddCreditForm users={mockUsers} onSubmit={mockOnSubmit} loading={true} />)

    const personSelect = screen.getByLabelText('Person')
    const descriptionInput = screen.getByLabelText('Description')
    const amountInput = screen.getByLabelText('Amount ($)')
    const submitButton = screen.getByRole('button', { name: 'Adding...' })

    expect(personSelect).toBeDisabled()
    expect(descriptionInput).toBeDisabled()
    expect(amountInput).toBeDisabled()
    expect(submitButton).toBeDisabled()
  })

  it('shows validation error for amount too large', async () => {
    render(<AddCreditForm users={mockUsers} onSubmit={mockOnSubmit} />)

    // Fill required fields first
    const personSelect = screen.getByLabelText('Person')
    fireEvent.change(personSelect, { target: { value: '550e8400-e29b-41d4-a716-446655440000' } })

    const descriptionInput = screen.getByLabelText('Description')
    fireEvent.change(descriptionInput, { target: { value: 'Test credit' } })

    const amountInput = screen.getByLabelText('Amount ($)')
    fireEvent.change(amountInput, { target: { value: '15000' } })

    const submitButton = screen.getByRole('button', { name: 'Add Credit' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Amount must be less than $10,000')).toBeInTheDocument()
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('shows validation error for description too long', async () => {
    render(<AddCreditForm users={mockUsers} onSubmit={mockOnSubmit} />)

    const descriptionInput = screen.getByLabelText('Description')
    const longDescription = 'a'.repeat(501) // Exceeds 500 character limit
    fireEvent.change(descriptionInput, { target: { value: longDescription } })

    const submitButton = screen.getByRole('button', { name: 'Add Credit' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Description must be less than 500 characters')).toBeInTheDocument()
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('handles empty users array gracefully', () => {
    render(<AddCreditForm users={[]} onSubmit={mockOnSubmit} />)

    const personSelect = screen.getByLabelText('Person')
    expect(personSelect).toBeInTheDocument()
    expect(screen.getByText('Select a person')).toBeInTheDocument()
  })
})