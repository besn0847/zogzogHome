"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Send,
  Bot,
  User,
  FileText,
  Clock,
  Trash2,
  Download,
  Share2,
  Plus,
  Search,
  MoreVertical,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import DashboardLayout from "@/components/dashboard-layout"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  sources?: Array<{
    document: string
    page: number
    text: string
    relevance: number
  }>
}

interface Conversation {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  messageCount: number
  documents: string[]
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    title: "Analyse Rapport Financier Q4",
    lastMessage: "Quelles sont les recommandations pour 2025 ?",
    timestamp: new Date("2024-01-15T14:30:00"),
    messageCount: 12,
    documents: ["Rapport Financier Q4 2024"],
  },
  {
    id: "2",
    title: "Questions Guide Utilisateur",
    lastMessage: "Comment configurer les permissions ?",
    timestamp: new Date("2024-01-14T09:15:00"),
    messageCount: 8,
    documents: ["Guide Utilisateur v2.1"],
  },
  {
    id: "3",
    title: "Révision Contrat ABC Corp",
    lastMessage: "Résumé des clauses principales",
    timestamp: new Date("2024-01-13T16:45:00"),
    messageCount: 15,
    documents: ["Contrat Partenariat ABC Corp"],
  },
]

const suggestedQuestions = [
  "Résume les points clés de ce document",
  "Quels sont les risques identifiés ?",
  "Compare avec les documents similaires",
  "Génère un plan d'action basé sur ce contenu",
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputValue.trim()
    if (!messageText) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateAIResponse(messageText),
        timestamp: new Date(),
        sources: [
          {
            document: "Rapport Financier Q4 2024",
            page: 1,
            text: "Chiffre d'affaires: 2.4M€ (+23%)",
            relevance: 0.95,
          },
          {
            document: "Guide Utilisateur v2.1",
            page: 3,
            text: "Configuration des permissions utilisateur",
            relevance: 0.82,
          },
        ],
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (question: string): string => {
    if (question.toLowerCase().includes("résume") || question.toLowerCase().includes("résumé")) {
      return "Voici un résumé des points clés basé sur vos documents :\n\n**Rapport Financier Q4 2024 :**\n• Croissance exceptionnelle de 23% du chiffre d'affaires\n• Marge brute en amélioration à 68%\n• Segment digital en forte progression (+35%)\n\n**Recommandations principales :**\n• Renforcer l'investissement digital\n• Optimiser les coûts traditionnels\n• Développer de nouveaux partenariats\n\nSouhaitez-vous que j'approfondisse un aspect particulier ?"
    }

    if (question.toLowerCase().includes("risque")) {
      return "D'après l'analyse de vos documents, voici les principaux risques identifiés :\n\n**Risques opérationnels :**\n• Dépendance croissante au segment digital\n• Pression sur les marges du segment traditionnel\n\n**Risques stratégiques :**\n• Concurrence accrue sur le marché digital\n• Nécessité d'adaptation rapide aux nouvelles technologies\n\n**Mesures de mitigation suggérées :**\n• Diversification des sources de revenus\n• Renforcement des équipes techniques\n• Veille concurrentielle renforcée"
    }

    return "Je peux vous aider à analyser vos documents et répondre à vos questions. Basé sur le contexte de vos documents, je peux fournir des analyses détaillées, des résumés, et des recommandations personnalisées. Que souhaitez-vous savoir ?"
  }

  const handleNewConversation = () => {
    setMessages([])
    setSelectedConversation(null)
    toast({
      title: "Nouvelle conversation",
      description: "Conversation créée avec succès",
    })
  }

  const handleLoadConversation = (conversationId: string) => {
    setSelectedConversation(conversationId)
    // Simulate loading conversation messages
    const mockMessages: Message[] = [
      {
        id: "1",
        type: "user",
        content: "Peux-tu analyser les performances du Q4 ?",
        timestamp: new Date("2024-01-15T14:25:00"),
      },
      {
        id: "2",
        type: "ai",
        content:
          "Le Q4 2024 montre des performances exceptionnelles avec une croissance de 23% du chiffre d'affaires...",
        timestamp: new Date("2024-01-15T14:25:30"),
        sources: [
          { document: "Rapport Financier Q4 2024", page: 1, text: "Chiffre d'affaires: 2.4M€ (+23%)", relevance: 0.95 },
        ],
      },
    ]
    setMessages(mockMessages)
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Message copié",
      description: "Le contenu a été copié dans le presse-papiers",
    })
  }

  const handleExportConversation = () => {
    toast({
      title: "Export en cours",
      description: "La conversation sera téléchargée sous peu",
    })
  }

  const filteredConversations = mockConversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-slate-50">
        {/* Conversations Sidebar */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Conversations IA</h2>
              <Button
                onClick={handleNewConversation}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600"
              >
                <Plus className="w-4 h-4 mr-1" />
                Nouveau
              </Button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher une conversation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedDocument} onValueChange={setSelectedDocument}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par document" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les documents</SelectItem>
                <SelectItem value="finance">Documents Finance</SelectItem>
                <SelectItem value="juridique">Documents Juridique</SelectItem>
                <SelectItem value="marketing">Documents Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {filteredConversations.map((conversation) => (
                <motion.div key={conversation.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card
                    className={`cursor-pointer transition-colors ${
                      selectedConversation === conversation.id ? "border-blue-200 bg-blue-50" : "hover:bg-slate-50"
                    }`}
                    onClick={() => handleLoadConversation(conversation.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-800 truncate mb-1">{conversation.title}</h4>
                          <p className="text-sm text-slate-600 truncate mb-2">{conversation.lastMessage}</p>
                          <div className="flex items-center space-x-2 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            <span>{conversation.timestamp.toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{conversation.messageCount} messages</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {conversation.documents.slice(0, 2).map((doc, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {doc.length > 15 ? `${doc.substring(0, 15)}...` : doc}
                              </Badge>
                            ))}
                            {conversation.documents.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{conversation.documents.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Bookmark className="w-4 h-4 mr-2" />
                              Épingler
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Exporter
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="w-4 h-4 mr-2" />
                              Partager
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-800">
                    {selectedConversation ? "Analyse Rapport Financier Q4" : "Nouvelle Conversation"}
                  </h1>
                  <p className="text-sm text-slate-600">Assistant IA pour l'analyse de documents</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleExportConversation}>
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Partager
                </Button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Commencez une conversation</h3>
                  <p className="text-slate-600 mb-6">
                    Posez des questions sur vos documents et obtenez des analyses détaillées
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    {suggestedQuestions.map((question, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSendMessage(question)}
                        className="p-4 text-left bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-slate-600" />
                          </div>
                          <span className="text-sm text-slate-700">{question}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex space-x-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      {message.type === "user" ? (
                        <AvatarFallback className="bg-blue-500 text-white">
                          <User className="w-5 h-5" />
                        </AvatarFallback>
                      ) : (
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white">
                          <Bot className="w-5 h-5" />
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div
                      className={`rounded-2xl p-4 ${
                        message.type === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-white border border-slate-200 text-slate-800"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>

                      {message.sources && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <p className="text-sm font-medium text-slate-600 mb-3">Sources référencées :</p>
                          <div className="space-y-2">
                            {message.sources.map((source, index) => (
                              <div key={index} className="bg-slate-50 p-3 rounded-lg border">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-sm text-slate-800">{source.document}</span>
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="secondary" className="text-xs">
                                      Page {source.page}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      {Math.round(source.relevance * 100)}%
                                    </Badge>
                                  </div>
                                </div>
                                <p className="text-sm text-slate-600">{source.text}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">
                        <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</span>
                        {message.type === "ai" && (
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyMessage(message.content)}
                              className="h-8 w-8 p-0 opacity-70 hover:opacity-100"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-70 hover:opacity-100">
                              <ThumbsUp className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-70 hover:opacity-100">
                              <ThumbsDown className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex space-x-3 max-w-[80%]">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white">
                        <Bot className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white border border-slate-200 rounded-2xl p-4">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="bg-white border-t border-slate-200 p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Posez votre question sur vos documents..."
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    disabled={isLoading}
                    className="pr-12 py-3 text-base"
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isLoading}
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">
                L'IA peut faire des erreurs. Vérifiez les informations importantes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
