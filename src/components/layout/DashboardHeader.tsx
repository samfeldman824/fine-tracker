'use client'

import { User } from '@/types'
import { Button } from '@/components/ui'
import { LogOut, User as UserIcon } from 'lucide-react'

interface DashboardHeaderProps {
  user?: User | null
  activeTab?: 'fines' | 'totals'
  onTabChange?: (tab: 'fines' | 'totals') => void
  onLogout?: () => void
}

export function DashboardHeader({ 
  user, 
  activeTab = 'fines', 
  onTabChange, 
  onLogout 
}: DashboardHeaderProps) {
  return (
    <header className="bg-amber-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        {/* Top row with branding and user info */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-amber-100">
            BMT Fines 2025-2026
          </h1>
          
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2 text-amber-100">
                <UserIcon className="w-4 h-4" />
                <span className="text-sm">
                  {user.name}
                  {user.role === 'admin' && (
                    <span className="ml-1 text-amber-300 font-medium">(Admin)</span>
                  )}
                </span>
              </div>
            )}
            
            <Button
              variant="secondary"
              size="sm"
              onClick={onLogout}
              className="bg-amber-800 hover:bg-amber-700 text-amber-100 border-amber-700"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
        
        {/* Navigation tabs */}
        <nav className="flex gap-1">
          <button
            onClick={() => onTabChange?.('fines')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
              activeTab === 'fines'
                ? 'bg-white text-amber-900 shadow-sm'
                : 'bg-amber-800 text-amber-200 hover:bg-amber-700 hover:text-amber-100'
            }`}
          >
            Fines
          </button>
          <button
            onClick={() => onTabChange?.('totals')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
              activeTab === 'totals'
                ? 'bg-white text-amber-900 shadow-sm'
                : 'bg-amber-800 text-amber-200 hover:bg-amber-700 hover:text-amber-100'
            }`}
          >
            Totals
          </button>
        </nav>
      </div>
    </header>
  )
}