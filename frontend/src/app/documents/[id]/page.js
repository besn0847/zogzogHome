'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeftIcon, 
  ChatBubbleLeftRightIcon, 
  DocumentTextIcon,
  EyeIcon,
  DownloadIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../../../lib/stores/authStore'
import { toast } from 'react-hot-toast'

export default function DocumentViewPage() {
  const params = useParams()
  const router = useRouter()
  const { accessToken, isAuthenticated } = useAuthStore()
  const [document, setDocument] = useState(null)
  const [markdownContent, setMarkdownContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }
    fetchDocument()
  }, [params.id, isAuthenticated])

  const fetchDocument = async () => {
    if (!accessToken) return
    
    try {
      const response = await fetch(`/api/documents/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setDocument(data.document)
        setMarkdownContent(data.markdownContent || '')
      } else {
        toast.error('Document non trouvé')
        router.push('/')
      }
    } catch (error) {
      console.error('Error fetching document:', error)
      toast.error('Erreur lors du chargement du document')
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/documents/${params.id}/download`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = document.filename || 'document.pdf'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        toast.success('Téléchargement démarré')
      } else {
        toast.error('Erreur lors du téléchargement')
      }
    } catch (error) {
      toast.error('Erreur lors du téléchargement')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Document non trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Le document demandé n'existe pas ou vous n'avez pas les permissions pour le voir.
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 truncate max-w-md">
                    {document.title}
                  </h1>
                  <p className="text-xs text-gray-500">
                    {new Date(document.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                Download
              </button>
              <button
                onClick={() => router.push(`/chat/${document.id}`)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                Chat
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Document Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
              <h2 className="text-sm font-medium text-gray-900 mb-4">Document Info</h2>
              
              <div className="space-y-4">
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      document.status === 'processed' 
                        ? 'bg-green-100 text-green-700' 
                        : document.status === 'processing'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {document.status === 'processed' ? 'Processed' : 
                       document.status === 'processing' ? 'Processing' : 'Error'}
                    </span>
                  </dd>
                </div>
                
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">File Size</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {document.size ? `${(document.size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(document.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </dd>
                </div>
                
                {document.collection && (
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Collection</dt>
                    <dd className="mt-1 text-sm text-gray-900">{document.collection.name}</dd>
                  </div>
                )}
                
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Filename</dt>
                  <dd className="mt-1 text-sm text-gray-900 break-all">{document.filename}</dd>
                </div>
              </div>
            </div>
          </div>

          {/* Document Content */}
          <div className="lg:col-span-3">
            {/* Markdown Content */}
            {markdownContent && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Document Content</h3>
                <div className="prose max-w-none">
                  <div 
                    className="markdown-content"
                    dangerouslySetInnerHTML={{ __html: markdownContent }}
                  />
                </div>
              </div>
            )}

            {/* Processing Status */}
            {document.status === 'processing' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Document Processing
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Your document is being converted to Markdown. 
                        This page will update automatically once processing is complete.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Status */}
            {document.status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <DocumentTextIcon className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Processing Error
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        An error occurred while processing this document. 
                        Please try uploading it again or contact support.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
