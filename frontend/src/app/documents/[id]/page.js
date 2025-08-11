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
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Retour
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {document.title}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push(`/chat/${document.id}`)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
              Chat avec ce document
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <DownloadIcon className="w-4 h-4 mr-2" />
              Télécharger PDF
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto py-8 px-6">
        {/* Document Info */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informations du document</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Nom du fichier</dt>
                  <dd className="text-sm text-gray-900">{document.filename}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Taille</dt>
                  <dd className="text-sm text-gray-900">
                    {document.size ? `${(document.size / 1024 / 1024).toFixed(1)} MB` : 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date d'upload</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(document.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Statut de traitement</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    document.status === 'processed' 
                      ? 'bg-green-100 text-green-800' 
                      : document.status === 'processing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {document.status === 'processed' ? 'Traité' : 
                     document.status === 'processing' ? 'En cours de traitement' : 'Erreur de traitement'}
                  </span>
                </div>
                {document.collection && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Collection</dt>
                    <dd className="text-sm text-gray-900">{document.collection.name}</dd>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Markdown Content */}
        {markdownContent && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contenu du document</h3>
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
                  Document en cours de traitement
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Votre document est en cours de conversion en Markdown. 
                    Cette page se mettra à jour automatiquement une fois le traitement terminé.
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
                  Erreur de traitement
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Une erreur s'est produite lors du traitement de ce document. 
                    Veuillez réessayer de l'uploader ou contacter le support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
