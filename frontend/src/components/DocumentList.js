'use client'

import { useState, useEffect } from 'react'
import { DocumentIcon, EyeIcon, TrashIcon, ChatBubbleLeftRightIcon, FolderIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../lib/stores/authStore'
import { toast } from 'react-hot-toast'

export default function DocumentList({ searchQuery, selectedCollection }) {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const { accessToken } = useAuthStore()

  const fetchDocuments = async () => {
    if (!accessToken) return
    
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (selectedCollection?.id) params.append('collectionId', selectedCollection.id)
      
      const response = await fetch(`/api/documents?${params}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setDocuments(data.documents || [])
      } else {
        console.error('Failed to fetch documents')
        setDocuments([])
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [searchQuery, selectedCollection, accessToken])

  const handleDelete = async (documentId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return
    
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        toast.success('Document supprimé avec succès')
        fetchDocuments() // Refresh the list
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const handleView = (documentId) => {
    // Navigate to document view page
    window.open(`/documents/${documentId}`, '_blank')
  }

  const handleChat = (documentId) => {
    // Navigate to chat with document
    window.open(`/chat/${documentId}`, '_blank')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <DocumentIcon className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-4 text-sm font-medium text-gray-900">No documents found</h3>
        <p className="mt-2 text-sm text-gray-500">
          {searchQuery ? 'Try adjusting your search terms.' : 'Upload your first PDF document to get started.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <div key={doc.id} className="bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-200 hover:border-gray-300">
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <DocumentIcon className="h-5 w-5 text-red-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-medium text-gray-900 truncate" title={doc.title}>
                      {doc.title}
                    </h3>
                    {doc.status && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        doc.status === 'processed' 
                          ? 'bg-green-100 text-green-700' 
                          : doc.status === 'processing'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {doc.status === 'processed' ? 'Processed' : 
                         doc.status === 'processing' ? 'Processing' : 'Error'}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                    <span>{new Date(doc.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                    {doc.size && (
                      <span>{(doc.size / 1024 / 1024).toFixed(1)} MB</span>
                    )}
                    {doc.collection && (
                      <span className="inline-flex items-center">
                        <FolderIcon className="w-3 h-3 mr-1" />
                        {doc.collection.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 ml-4">
                <button 
                  onClick={() => handleView(doc.id)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View document"
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleChat(doc.id)}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Chat with document"
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete document"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
