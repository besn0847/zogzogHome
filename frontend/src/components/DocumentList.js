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
      <div className="text-center py-8 text-gray-500">
        <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun document</h3>
        <p className="mt-1 text-sm text-gray-500">
          Commencez par télécharger votre premier document PDF.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <div key={doc.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex items-center">
              <DocumentIcon className="h-8 w-8 text-gray-400" />
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-gray-900 truncate" title={doc.title}>
                  {doc.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(doc.createdAt).toLocaleDateString('fr-FR')}
                </p>
                {doc.size && (
                  <p className="text-xs text-gray-400">
                    {(doc.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                )}
              </div>
            </div>
            
            {/* Document metadata */}
            <div className="mt-3">
              {doc.collection && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <FolderIcon className="w-3 h-3 mr-1" />
                  {doc.collection.name}
                </span>
              )}
              {doc.status && (
                <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  doc.status === 'processed' 
                    ? 'bg-green-100 text-green-800' 
                    : doc.status === 'processing'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {doc.status === 'processed' ? 'Traité' : 
                   doc.status === 'processing' ? 'En cours' : 'Erreur'}
                </span>
              )}
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <button 
                onClick={() => handleView(doc.id)}
                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                title="Voir le document"
              >
                <EyeIcon className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleChat(doc.id)}
                className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                title="Chat avec le document"
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleDelete(doc.id)}
                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                title="Supprimer le document"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
