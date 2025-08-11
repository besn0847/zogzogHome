'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeftIcon, 
  PaperAirplaneIcon,
  DocumentTextIcon,
  UserIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../../../lib/stores/authStore'
import { toast } from 'react-hot-toast'

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const { accessToken, isAuthenticated, user } = useAuthStore()
  const [document, setDocument] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [documentLoading, setDocumentLoading] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }
    fetchDocument()
    fetchChatHistory()
  }, [params.id, isAuthenticated])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

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
      } else {
        toast.error('Document non trouvé')
        router.push('/')
      }
    } catch (error) {
      console.error('Error fetching document:', error)
      toast.error('Erreur lors du chargement du document')
      router.push('/')
    } finally {
      setDocumentLoading(false)
    }
  }

  const fetchChatHistory = async () => {
    if (!accessToken) return
    
    try {
      const response = await fetch(`/api/chat/${params.id}/history`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Error fetching chat history:', error)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch(`/api/chat/${params.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: inputMessage,
          documentId: params.id
        })
      })

      if (response.ok) {
        const data = await response.json()
        const aiMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: data.response,
          timestamp: new Date().toISOString(),
          sources: data.sources || []
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        toast.error('Erreur lors de l\'envoi du message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Erreur lors de l\'envoi du message')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (documentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Retour
            </button>
            <div className="flex items-center space-x-2">
              <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Chat: {document?.title}
                </h1>
                <p className="text-sm text-gray-500">
                  Posez des questions sur ce document
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => router.push(`/documents/${params.id}`)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <DocumentTextIcon className="w-4 h-4 mr-1" />
            Voir le document
          </button>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CpuChipIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Commencez une conversation</h3>
              <p className="mt-1 text-sm text-gray-500">
                Posez une question sur le contenu de ce document.
              </p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}>
                <div className="flex items-start space-x-2">
                  {message.type === 'assistant' && (
                    <CpuChipIcon className="w-4 h-4 mt-1 text-gray-400" />
                  )}
                  {message.type === 'user' && (
                    <UserIcon className="w-4 h-4 mt-1 text-blue-200" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500">Sources:</p>
                        <ul className="text-xs text-gray-600 mt-1">
                          {message.sources.map((source, idx) => (
                            <li key={idx}>• Page {source.page || 'N/A'}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-white border border-gray-200">
                <div className="flex items-center space-x-2">
                  <CpuChipIcon className="w-4 h-4 text-gray-400" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex space-x-4">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez une question sur ce document..."
                className="block w-full resize-none border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
