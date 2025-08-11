'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  DocumentPlusIcon, 
  MagnifyingGlassIcon, 
  FolderIcon, 
  UserIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../../lib/stores/authStore'
import DocumentUpload from '../../components/DocumentUpload'
import DocumentList from '../../components/DocumentList'
import SearchBar from '../../components/SearchBar'
import Sidebar from '../../components/Sidebar'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, checkAuth, logout } = useAuthStore()
  const [showUpload, setShowUpload] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCollection, setSelectedCollection] = useState(null)
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalCollections: 0,
    recentUploads: 0
  })

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
            onSelectCollection={setSelectedCollection}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Tableau de bord
                </h1>
                {selectedCollection && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <FolderIcon className="w-4 h-4 mr-1" />
                    {selectedCollection.name}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <SearchBar 
                  onSearch={handleSearch}
                  placeholder="Rechercher dans vos documents..."
                />
                <button
                  onClick={() => setShowUpload(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <DocumentPlusIcon className="w-5 h-5 mr-2" />
                  Nouveau document
                </button>
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-sm text-gray-700 hover:text-gray-900"
                  >
                    <UserIcon className="w-5 h-5 mr-1" />
                    {user?.firstName} {user?.lastName}
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Documents totaux
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.totalDocuments}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FolderIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Collections
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.totalCollections}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ChartBarIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Uploads récents
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.recentUploads}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Welcome Message for New Users */}
            {stats.totalDocuments === 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <DocumentPlusIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Bienvenue dans DocPDF Manager !
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Commencez par télécharger votre premier document PDF. 
                        Il sera automatiquement converti en Markdown et indexé pour la recherche intelligente.
                      </p>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => setShowUpload(true)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <DocumentPlusIcon className="w-4 h-4 mr-1" />
                        Télécharger un document
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Document List */}
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
