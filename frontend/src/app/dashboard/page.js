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
  ChatBubbleLeftRightIcon,
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon
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
  const [sidebarOpen, setSidebarOpen] = useState(true)
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 flex-shrink-0 bg-white border-r border-gray-200`}>
          <Sidebar 
            selectedCollection={selectedCollection}
            onSelectCollection={setSelectedCollection}
            isCollapsed={!sidebarOpen}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Bars3Icon className="w-5 h-5 text-gray-600" />
                </button>
                
                <div className="flex items-center space-x-3">
                  <h1 className="text-xl font-semibold text-gray-900">
                    {selectedCollection ? selectedCollection.name : 'All Documents'}
                  </h1>
                  {selectedCollection && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      <FolderIcon className="w-3 h-3 mr-1" />
                      Collection
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="hidden md:block">
                  <SearchBar 
                    onSearch={handleSearch}
                    placeholder="Search documents..."
                  />
                </div>
                
                <button
                  onClick={() => setShowUpload(true)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <DocumentPlusIcon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">New Document</span>
                </button>
                
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <BellIcon className="w-5 h-5 text-gray-600" />
                </button>
                
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Cog6ToothIcon className="w-5 h-5 text-gray-600" />
                </button>
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </span>
                    </div>
                    <div className="hidden lg:block text-left">
                      <div className="text-sm font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50">
            {/* Mobile Search */}
            <div className="md:hidden p-4 bg-white border-b border-gray-200">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search documents..."
              />
            </div>

            {/* Welcome Message for New Users */}
            {stats.totalDocuments === 0 && (
              <div className="p-6">
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DocumentPlusIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Welcome to DocPDF Manager
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Start by uploading your first PDF document. It will be automatically converted to Markdown and indexed for intelligent search.
                  </p>
                  <button
                    onClick={() => setShowUpload(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <DocumentPlusIcon className="w-4 h-4 mr-2" />
                    Upload your first document
                  </button>
                </div>
              </div>
            )}

            {/* Stats Cards - Only show when there are documents */}
            {stats.totalDocuments > 0 && (
              <div className="p-6 pb-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Documents</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.totalDocuments}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <FolderIcon className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Collections</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.totalCollections}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <ChartBarIcon className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Recent Uploads</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.recentUploads}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Document List */}
            <div className="p-6 pt-0">
              <DocumentList 
                searchQuery={searchQuery}
                selectedCollection={selectedCollection}
              />
            </div>
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
