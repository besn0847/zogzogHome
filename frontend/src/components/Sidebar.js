'use client'

import { useState } from 'react'
import { FolderIcon, PlusIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

export default function Sidebar({ selectedCollection, onSelectCollection }) {
  const [collections, setCollections] = useState([])
  const [expandedCollections, setExpandedCollections] = useState(new Set())

  const toggleCollection = (collectionId) => {
    const newExpanded = new Set(expandedCollections)
    if (newExpanded.has(collectionId)) {
      newExpanded.delete(collectionId)
    } else {
      newExpanded.add(collectionId)
    }
    setExpandedCollections(newExpanded)
  }

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-full">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Collections</h2>
          <button className="text-gray-400 hover:text-gray-600">
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-1">
          <button
            onClick={() => onSelectCollection(null)}
            className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              selectedCollection === null
                ? 'bg-blue-100 text-blue-900'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <FolderIcon className="mr-3 h-5 w-5" />
            Tous les documents
          </button>
          
          {collections.map((collection) => (
            <div key={collection.id}>
              <button
                onClick={() => {
                  onSelectCollection(collection.id)
                  toggleCollection(collection.id)
                }}
                className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  selectedCollection === collection.id
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {expandedCollections.has(collection.id) ? (
                  <ChevronDownIcon className="mr-1 h-4 w-4" />
                ) : (
                  <ChevronRightIcon className="mr-1 h-4 w-4" />
                )}
                <FolderIcon className="mr-2 h-5 w-5" />
                {collection.name}
                <span className="ml-auto text-xs text-gray-500">
                  {collection.documentCount}
                </span>
              </button>
            </div>
          ))}
        </div>
        
        {collections.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <FolderIcon className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm">Aucune collection</p>
          </div>
        )}
      </div>
    </div>
  )
}
