'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DocumentPlusIcon, MagnifyingGlassIcon, FolderIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../lib/stores/authStore'
import DocumentUpload from '../components/DocumentUpload'
import DocumentList from '../components/DocumentList'
import SearchBar from '../components/SearchBar'
import Sidebar from '../components/Sidebar'

export default function HomePage() {
  const router = useRouter()
  const { user, isAuthenticated, checkAuth } = useAuthStore()
  const [showUpload, setShowUpload] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCollection, setSelectedCollection] = useState(null)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <Sidebar 
            selectedCollection={selectedCollection}
            onCollectionSelect={setSelectedCollection}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Mes Documents
                </h1>
                {selectedCollection && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                    <FolderIcon className="w-4 h-4 mr-1" />
                    {selectedCollection.name}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <SearchBar 
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Rechercher dans vos documents..."
                />
                <button
                  onClick={() => setShowUpload(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <DocumentPlusIcon className="w-5 h-5" />
                  <span>Nouveau document</span>
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <DocumentList 
              searchQuery={searchQuery}
              selectedCollection={selectedCollection}
            />
          </main>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <DocumentUpload 
          isOpen={showUpload}
          onClose={() => setShowUpload(false)}
          collectionId={selectedCollection?.id}
        />
      )}
    </div>
  )
}
