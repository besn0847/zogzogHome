'use client'

import { useState, useEffect } from 'react'
import { FolderIcon, PlusIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../lib/stores/authStore'
import { toast } from 'react-hot-toast'

export default function Sidebar({ selectedCollection, onSelectCollection, isCollapsed = false }) {
  const [collections, setCollections] = useState([])
  const [expandedCollections, setExpandedCollections] = useState(new Set())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')
  const { accessToken } = useAuthStore()

  useEffect(() => {
    if (accessToken) {
      fetchCollections()
    }
  }, [accessToken])

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCollections(data.collections || [])
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
    }
  }

  const createCollection = async () => {
    if (!newCollectionName.trim()) return

    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newCollectionName.trim(),
          description: ''
        })
      })

      if (response.ok) {
        toast.success('Collection créée avec succès')
        setNewCollectionName('')
        setShowCreateModal(false)
        fetchCollections()
      } else {
        toast.error('Erreur lors de la création de la collection')
      }
    } catch (error) {
      toast.error('Erreur lors de la création de la collection')
    }
  }

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
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">DocPDF Manager</h2>
          </div>
        )}
        
        {isCollapsed && (
          <div className="flex justify-center mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">D</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        {!isCollapsed && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Collections</h3>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
              title="Create new collection"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        )}
        
        <div className="space-y-1">
          <button
            onClick={() => onSelectCollection(null)}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedCollection === null
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title={isCollapsed ? "All Documents" : ""}
          >
            <FolderIcon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed && "All Documents"}
          </button>
          
          {collections.map((collection) => (
            <div key={collection.id}>
              <button
                onClick={() => {
                  onSelectCollection(collection.id)
                  if (!isCollapsed) {
                    toggleCollection(collection.id)
                  }
                }}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  selectedCollection === collection.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title={isCollapsed ? collection.name : ""}
              >
                {!isCollapsed && expandedCollections.has(collection.id) ? (
                  <ChevronDownIcon className="mr-1 h-4 w-4 text-gray-400" />
                ) : !isCollapsed ? (
                  <ChevronRightIcon className="mr-1 h-4 w-4 text-gray-400" />
                ) : null}
                <FolderIcon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-2'}`} />
                {!isCollapsed && (
                  <>
                    <span className="truncate">{collection.name}</span>
                    <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {collection.documentCount}
                    </span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
        
        {!isCollapsed && collections.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FolderIcon className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-2 text-sm">No collections yet</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-2 text-xs text-blue-600 hover:text-blue-700"
            >
              Create your first collection
            </button>
          </div>
        )}
      </div>

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Créer une nouvelle collection
              </h3>
              <div className="mb-4">
                <label htmlFor="collectionName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la collection
                </label>
                <input
                  id="collectionName"
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Entrez le nom de la collection"
                  onKeyPress={(e) => e.key === 'Enter' && createCollection()}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setNewCollectionName('')
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  onClick={createCollection}
                  disabled={!newCollectionName.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
