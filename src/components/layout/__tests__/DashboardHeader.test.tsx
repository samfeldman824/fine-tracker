import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DashboardHeader } from '../DashboardHeader'
import { User } from '@/types'

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  username: 'johndoe',
  password_hash: 'hash',
  avatar_url: null,
  role: 'admin',
  created_at: '2024-01-01T00:00:00Z'
}

describe('DashboardHeader', () => {
  it('renders BMT Fines branding', () => {
    render(<DashboardHeader />)
    expect(screen.getByText('BMT Fines 2025-2026')).toBeInTheDocument()
  })

  it('displays user information when user is provided', () => {
    render(<DashboardHeader user={mockUser} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('(Admin)')).toBeInTheDocument()
  })

  it('renders navigation tabs', () => {
    render(<DashboardHeader />)
    expect(screen.getByText('Fines')).toBeInTheDocument()
    expect(screen.getByText('Totals')).toBeInTheDocument()
  })

  it('highlights active tab correctly', () => {
    render(<DashboardHeader activeTab="totals" />)
    const totalsTab = screen.getByText('Totals')
    const finesTab = screen.getByText('Fines')
    
    expect(totalsTab).toHaveClass('bg-white', 'text-amber-900')
    expect(finesTab).toHaveClass('bg-amber-800', 'text-amber-200')
  })

  it('calls onTabChange when tab is clicked', () => {
    const mockOnTabChange = vi.fn()
    render(<DashboardHeader onTabChange={mockOnTabChange} />)
    
    fireEvent.click(screen.getByText('Totals'))
    expect(mockOnTabChange).toHaveBeenCalledWith('totals')
  })

  it('calls onLogout when logout button is clicked', () => {
    const mockOnLogout = vi.fn()
    render(<DashboardHeader onLogout={mockOnLogout} />)
    
    fireEvent.click(screen.getByText('Logout'))
    expect(mockOnLogout).toHaveBeenCalled()
  })

  it('shows regular user without admin indicator', () => {
    const regularUser: User = { ...mockUser, role: 'user' }
    render(<DashboardHeader user={regularUser} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.queryByText('(Admin)')).not.toBeInTheDocument()
  })
})