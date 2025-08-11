'use client'

import { useState, useEffect } from 'react'
import { DocumentIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function DocumentList({ searchQuery, selectedCollection }) {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // TODO: Fetch documents from API
    setDocuments([])
  }, [searchQuery, selectedCollection])

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
        <div key={doc.id} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4">
            <div className="flex items-center">
              <DocumentIcon className="h-8 w-8 text-gray-400" />
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {doc.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(doc.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button className="text-blue-600 hover:text-blue-800">
                <EyeIcon className="h-4 w-4" />
              </button>
              <button className="text-red-600 hover:text-red-800">
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
