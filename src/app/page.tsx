'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/layout'
import { User } from '@/types'

// Mock user data for demo
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  username: 'johndoe',
  password_hash: 'hash',
  avatar_url: null,
  role: 'admin',
  created_at: '2024-01-01T00:00:00Z'
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'fines' | 'totals'>('fines')

  const handleLogout = () => {
    console.log('Logout clicked')
    // Placeholder for logout functionality
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
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-amber-900 mb-4">
            {activeTab === 'fines' ? 'Fines Dashboard' : 'Totals Dashboard'}
          </h2>
          <p className="text-amber-700">
            {activeTab === 'fines' 
              ? 'This is where the fines table and forms will be displayed.' 
              : 'This is where the totals and summary information will be displayed.'
            }
          </p>
        </div>
      </main>
    </div>
  )
}
