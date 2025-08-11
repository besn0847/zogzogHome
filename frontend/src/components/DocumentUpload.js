'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { XMarkIcon, DocumentIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../lib/stores/authStore'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function DocumentUpload({ isOpen, onClose, collectionId }) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { accessToken } = useAuthStore()

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Seuls les fichiers PDF sont acceptés')
      return
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('Le fichier est trop volumineux (max 50MB)')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (collectionId) {
        formData.append('collectionId', collectionId)
      }

      const response = await axios.post('/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${accessToken}`
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          setUploadProgress(progress)
        }
      })

      toast.success('Document uploadé avec succès ! Traitement en cours...')
      onClose()
      
      // Refresh document list
      window.location.reload()

    } catch (error) {
      console.error('Erreur d\'upload:', error)
      const message = error.response?.data?.error || 'Erreur lors de l\'upload'
      toast.error(message)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [accessToken, collectionId, onClose])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    disabled: isUploading
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Nouveau document
          </h3>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isUploading ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                isDragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400'
              }`}
            >
              <input {...getInputProps()} />
              <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              
              {isDragActive ? (
                <p className="text-primary-600 font-medium">
                  Déposez le fichier PDF ici...
                </p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">
                    Glissez-déposez un fichier PDF ici, ou cliquez pour sélectionner
                  </p>
                  <p className="text-sm text-gray-500">
                    Taille maximale : 50MB
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <DocumentIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <p className="text-gray-900 font-medium mb-2">
                Upload en cours...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {uploadProgress}% terminé
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <p className="text-xs text-gray-500">
            Le document sera automatiquement converti en Markdown et indexé pour la recherche.
          </p>
        </div>
      </div>
    </div>
  )
}
