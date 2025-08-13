'use client'

import { useFines, useUsers, useCreateFine } from '../hooks'
import { useState } from 'react'

/**
 * Example component demonstrating React Query hooks usage
 * This shows how to fetch data, handle loading states, and perform mutations
 */
export function FinesExample() {
  const [showForm, setShowForm] = useState(false)
  
  // Fetch data using React Query hooks
  const { data: fines, isLoading: finesLoading, error: finesError } = useFines()
  const { data: users, isLoading: usersLoading } = useUsers()
  
  // Mutation hook for creating fines
  const createFineMutation = useCreateFine()

  const handleCreateFine = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    
    const fineData = {
      offender_id: formData.get('offender_id') as string,
      proposed_by_id: formData.get('proposed_by_id') as string,
      description: formData.get('description') as string,
      amount: parseFloat(formData.get('amount') as string),
    }

    createFineMutation.mutate(fineData, {
      onSuccess: () => {
        setShowForm(false)
        // Form will be reset automatically
        event.currentTarget.reset()
      },
    })
  }

  if (finesLoading || usersLoading) {
    return <div className="p-4">Loading...</div>
  }

  if (finesError) {
    return <div className="p-4 text-red-600">Error: {finesError.message}</div>
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fines Dashboard</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Fine'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateFine} className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">Add New Fine</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="offender_id" className="block text-sm font-medium mb-1">
                Offender
              </label>
              <select
                name="offender_id"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select offender...</option>
                {users?.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="proposed_by_id" className="block text-sm font-medium mb-1">
                Proposed By
              </label>
              <select
                name="proposed_by_id"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select proposer...</option>
                {users?.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <input
                type="text"
                name="description"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Enter violation description..."
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium mb-1">
                Amount ($)
              </label>
              <input
                type="number"
                name="amount"
                step="0.01"
                min="0"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={createFineMutation.isPending}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {createFineMutation.isPending ? 'Creating...' : 'Create Fine'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>

          {createFineMutation.error && (
            <div className="mt-2 text-red-600 text-sm">
              Error: {createFineMutation.error.message}
            </div>
          )}
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Offender</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Proposed By</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Replies</th>
            </tr>
          </thead>
          <tbody>
            {fines?.length === 0 ? (
              <tr>
                <td colSpan={6} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                  No fines found. Add your first fine above.
                </td>
              </tr>
            ) : (
              fines?.map(fine => (
                <tr key={fine.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(fine.date).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {fine.offender.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {fine.description}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-red-600 font-semibold">
                    ${fine.amount.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {fine.proposed_by.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {fine.replies}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Show React Query DevTools info */}
      <div className="mt-6 text-sm text-gray-600">
        <p>
          React Query is managing data fetching, caching, and synchronization.
          Open the React Query DevTools (bottom-right) to inspect cache state.
        </p>
      </div>
    </div>
  )
}