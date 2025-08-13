import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi, describe, it, beforeEach, expect } from 'vitest'
import { FinesDashboard } from '../FinesDashboard'
import { ToastProvider } from '@/components/ui'
import * as reactQueryHooks from '@/lib/react-query'

// Mock the react-query hooks
vi.mock('@/lib/react-query', () => ({
    useFines: vi.fn(),
    useUsers: vi.fn(),
    useCreateFine: vi.fn(),
    useCreateCredit: vi.fn(),
    useUpdateFine: vi.fn(),
    useDeleteFine: vi.fn(),
}))

const mockUseFines = reactQueryHooks.useFines as ReturnType<typeof vi.fn>
const mockUseUsers = reactQueryHooks.useUsers as ReturnType<typeof vi.fn>
const mockUseCreateFine = reactQueryHooks.useCreateFine as ReturnType<typeof vi.fn>
const mockUseCreateCredit = reactQueryHooks.useCreateCredit as ReturnType<typeof vi.fn>
const mockUseUpdateFine = reactQueryHooks.useUpdateFine as ReturnType<typeof vi.fn>
const mockUseDeleteFine = reactQueryHooks.useDeleteFine as ReturnType<typeof vi.fn>

const mockUsers = [
    {
        id: '1',
        name: 'John Doe',
        username: 'johndoe',
        password_hash: 'hash',
        avatar_url: null,
        role: 'user' as const,
        created_at: '2024-01-01T00:00:00Z'
    },
    {
        id: '2',
        name: 'Jane Smith',
        username: 'janesmith',
        password_hash: 'hash',
        avatar_url: null,
        role: 'admin' as const,
        created_at: '2024-01-01T00:00:00Z'
    }
]

const mockFines = [
    {
        id: '1',
        date: '2024-01-15',
        description: 'Speeding violation',
        amount: 150.00,
        replies: 2,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
        offender: mockUsers[0],
        proposed_by: mockUsers[1]
    }
]

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    })

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <ToastProvider>
                {children}
            </ToastProvider>
        </QueryClientProvider>
    )

    return Wrapper
}

describe('FinesDashboard', () => {
    beforeEach(() => {
        // Reset all mocks
        vi.clearAllMocks()

        // Default mock implementations
        mockUseFines.mockReturnValue({
            data: mockFines,
            isLoading: false,
            error: null,
        })

        mockUseUsers.mockReturnValue({
            data: mockUsers,
            isLoading: false,
            error: null,
        })

        mockUseCreateFine.mockReturnValue({
            mutateAsync: vi.fn(),
            isPending: false,
        })

        mockUseCreateCredit.mockReturnValue({
            mutateAsync: vi.fn(),
            isPending: false,
        })

        mockUseUpdateFine.mockReturnValue({
            mutateAsync: vi.fn(),
            isPending: false,
        })

        mockUseDeleteFine.mockReturnValue({
            mutateAsync: vi.fn(),
            isPending: false,
        })
    })

    it('renders the dashboard with header and main content', () => {
        render(<FinesDashboard />, { wrapper: createWrapper() })

        expect(screen.getByText('BMT Fines 2025-2026')).toBeInTheDocument()
        expect(screen.getAllByText('John Doe')).toHaveLength(4) // Header, 2 dropdowns, table
        expect(screen.getByText('(Admin)')).toBeInTheDocument()
        expect(screen.getByText('Fines')).toBeInTheDocument()
        expect(screen.getByText('Totals')).toBeInTheDocument()
    })

    it('displays the fines table with data', () => {
        render(<FinesDashboard />, { wrapper: createWrapper() })

        expect(screen.getByText('Fines Overview')).toBeInTheDocument()
        expect(screen.getByText('Speeding violation')).toBeInTheDocument()
        expect(screen.getByText('$150.00')).toBeInTheDocument()
        expect(screen.getAllByText('John Doe')).toHaveLength(4) // Header, 2 dropdowns, table
    })

    it('displays add fine and add credit forms', () => {
        render(<FinesDashboard />, { wrapper: createWrapper() })

        expect(screen.getByText('Add New Fine')).toBeInTheDocument()
        expect(screen.getByText('Add New Credit')).toBeInTheDocument()
    })

    it('shows loading state when data is loading', () => {
        mockUseFines.mockReturnValue({
            data: [],
            isLoading: true,
            error: null,
        })

        mockUseUsers.mockReturnValue({
            data: [],
            isLoading: true,
            error: null,
        })

        const { container } = render(<FinesDashboard />, { wrapper: createWrapper() })

        // Should show loading skeletons instead of table rows
        const skeletonElements = container.querySelectorAll('.animate-pulse')
        expect(skeletonElements.length).toBeGreaterThan(0)
    })

    it('shows error state when there is an error', () => {
        mockUseFines.mockReturnValue({
            data: [],
            isLoading: false,
            error: new Error('Failed to fetch fines'),
        })

        render(<FinesDashboard />, { wrapper: createWrapper() })

        expect(screen.getByText('Error Loading Dashboard')).toBeInTheDocument()
        expect(screen.getByText('Failed to fetch fines')).toBeInTheDocument()
        expect(screen.getByText('Retry')).toBeInTheDocument()
    })

    it('switches to totals tab when clicked', async () => {
        const user = userEvent.setup()
        render(<FinesDashboard />, { wrapper: createWrapper() })

        const totalsTab = screen.getByRole('button', { name: 'Totals' })
        await user.click(totalsTab)

        expect(screen.getByText('Totals Dashboard')).toBeInTheDocument()
        expect(screen.getByText('This is where the totals and summary information will be displayed.')).toBeInTheDocument()
    })

    it('shows empty state when no fines exist', () => {
        mockUseFines.mockReturnValue({
            data: [],
            isLoading: false,
            error: null,
        })

        render(<FinesDashboard />, { wrapper: createWrapper() })

        expect(screen.getByText('No fines found. Add your first fine using the form above.')).toBeInTheDocument()
    })
})