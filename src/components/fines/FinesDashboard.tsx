'use client'

import React, { useState } from 'react'
import { DashboardHeader } from '@/components/layout'
import { 
  FinesTable, 
  AddFineForm, 
  AddCreditForm, 
  EditFineModal, 
  ConfirmDeleteModal 
} from '@/components/fines'
import { 
  useFines, 
  useUsers, 
  useCreateFine, 
  useCreateCredit, 
  useUpdateFine, 
  useDeleteFine 
} from '@/lib/react-query'
import { FineWithUsers, CreateFineSchemaType, CreateCreditSchemaType, UpdateFineSchemaType, User } from '@/types'

// Mock user data for demo - in a real app this would come from authentication
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  username: 'johndoe',
  password_hash: 'hash',
  avatar_url: null,
  role: 'admin',
  created_at: '2024-01-01T00:00:00Z'
}

export function FinesDashboard() {
  const [activeTab, setActiveTab] = useState<'fines' | 'totals'>('fines')
  const [editingFine, setEditingFine] = useState<FineWithUsers | null>(null)
  const [deletingFineId, setDeletingFineId] = useState<string | null>(null)

  // Data queries
  const { 
    data: fines = [], 
    isLoading: finesLoading, 
    error: finesError 
  } = useFines()
  
  const { 
    data: users = [], 
    isLoading: usersLoading, 
    error: usersError 
  } = useUsers()

  // Mutations
  const createFineMutation = useCreateFine()
  const createCreditMutation = useCreateCredit()
  const updateFineMutation = useUpdateFine()
  const deleteFineMutation = useDeleteFine()

  // Event handlers
  const handleLogout = () => {
    console.log('Logout clicked')
    // Placeholder for logout functionality
  }

  const handleCreateFine = async (data: CreateFineSchemaType) => {
    try {
      await createFineMutation.mutateAsync({
        ...data,
        proposed_by_id: mockUser.id // In a real app, this would come from authenticated user
      })
    } catch (error) {
      console.error('Failed to create fine:', error)
      throw error
    }
  }

  const handleCreateCredit = async (data: CreateCreditSchemaType) => {
    try {
      await createCreditMutation.mutateAsync(data)
    } catch (error) {
      console.error('Failed to create credit:', error)
      throw error
    }
  }

  const handleEditFine = (fine: FineWithUsers) => {
    setEditingFine(fine)
  }

  const handleUpdateFine = async (data: UpdateFineSchemaType) => {
    if (!editingFine) return
    
    try {
      await updateFineMutation.mutateAsync({
        id: editingFine.id,
        data: {
          offender_id: data.offender_id,
          description: data.description,
          amount: data.amount
        }
      })
      setEditingFine(null)
    } catch (error) {
      console.error('Failed to update fine:', error)
      throw error
    }
  }

  const handleDeleteFine = (fineId: string) => {
    setDeletingFineId(fineId)
  }

  const handleConfirmDelete = async () => {
    if (!deletingFineId) return
    
    try {
      await deleteFineMutation.mutateAsync(deletingFineId)
      setDeletingFineId(null)
    } catch (error) {
      console.error('Failed to delete fine:', error)
      setDeletingFineId(null)
      throw error
    }
  }

  const handleCancelDelete = () => {
    setDeletingFineId(null)
  }

  const handleCloseEditModal = () => {
    setEditingFine(null)
  }

  // Get the fine being deleted for the confirmation modal
  const deletingFine = deletingFineId 
    ? fines.find(fine => fine.id === deletingFineId) || null
    : null

  // Loading state
  const isLoading = finesLoading || usersLoading

  // Error state
  const hasError = finesError || usersError

  if (hasError) {
    return (
      <div className="min-h-screen bg-amber-50">
        <DashboardHeader 
          user={mockUser}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
        />
        
        <main className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-900 mb-2">
              Error Loading Dashboard
            </h2>
            <p className="text-red-700">
              {finesError?.message || usersError?.message || 'An unexpected error occurred'}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <DashboardHeader 
        user={mockUser}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'fines' ? (
          <div className="space-y-6">
            {/* Add Fine Form */}
            <AddFineForm
              users={users}
              onSubmit={handleCreateFine}
              loading={createFineMutation.isPending}
            />

            {/* Add Credit Form */}
            <AddCreditForm
              users={users}
              onSubmit={handleCreateCredit}
              loading={createCreditMutation.isPending}
            />

            {/* Fines Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-amber-900">
                  Fines Overview
                </h2>
                <p className="text-amber-700 mt-1">
                  Manage and track all traffic fines
                </p>
              </div>
              
              <FinesTable
                fines={fines}
                loading={isLoading}
                onEdit={handleEditFine}
                onDelete={handleDeleteFine}
              />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-amber-900 mb-4">
              Totals Dashboard
            </h2>
            <p className="text-amber-700">
              This is where the totals and summary information will be displayed.
            </p>
          </div>
        )}
      </main>

      {/* Edit Fine Modal */}
      <EditFineModal
        fine={editingFine}
        users={users}
        isOpen={!!editingFine}
        onClose={handleCloseEditModal}
        onSave={handleUpdateFine}
        loading={updateFineMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        fine={deletingFine}
        isOpen={!!deletingFineId}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        loading={deleteFineMutation.isPending}
      />
    </div>
  )
}