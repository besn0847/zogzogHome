"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageSquare,
  Send,
  Bot,
  User,
  ChevronRight,
  ChevronLeft,
  Download,
  Share2,
  Edit3,
  Bookmark,
  X,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import DashboardLayout from "@/components/dashboard-layout"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  sources?: Array<{
    page: number
    text: string
    relevance: number
  }>
}

interface TableOfContentsItem {
  id: string
  title: string
  level: number
  page: number
}

const mockDocument = {
  id: "1",
  title: "Rapport Financier Q4 2024",
  content: `# Rapport Financier Q4 2024

## Résumé Exécutif

Le quatrième trimestre 2024 a été marqué par une croissance exceptionnelle de nos activités, avec un chiffre d'affaires en hausse de 23% par rapport à la même période l'année précédente.

### Indicateurs Clés
- **Chiffre d'affaires**: 2.4M€ (+23%)
- **Marge brute**: 68% (+5 points)
- **EBITDA**: 420K€ (+31%)

## Analyse Détaillée

### Performance par Segment

#### Segment Digital
Le segment digital continue d'être notre moteur de croissance principal avec une progression de 35% sur le trimestre.

#### Segment Traditionnel
Malgré les défis du marché, le segment traditionnel maintient sa stabilité avec une légère croissance de 8%.

### Perspectives 2025

Les perspectives pour 2025 sont très encourageantes avec plusieurs projets stratégiques en cours de finalisation.

## Recommandations

1. Renforcer l'investissement dans le digital
2. Optimiser les coûts du segment traditionnel
3. Développer de nouveaux partenariats stratégiques`,
  author: "Marie Dubois",
  collection: "Finance",
  tags: ["rapport", "financier", "Q4"],
  lastModified: "2024-01-15",
}

const mockTableOfContents: TableOfContentsItem[] = [
  { id: "resume", title: "Résumé Exécutif", level: 2, page: 1 },
  { id: "indicateurs", title: "Indicateurs Clés", level: 3, page: 1 },
  { id: "analyse", title: "Analyse Détaillée", level: 2, page: 2 },
  { id: "digital", title: "Segment Digital", level: 4, page: 2 },
  { id: "traditionnel", title: "Segment Traditionnel", level: 4, page: 3 },
  { id: "perspectives", title: "Perspectives 2025", level: 3, page: 3 },
  { id: "recommandations", title: "Recommandations", level: 2, page: 4 },
]

const suggestedQuestions = [
  "Quels sont les principaux indicateurs de performance ?",
  "Comment le segment digital a-t-il évolué ?",
  "Quelles sont les recommandations pour 2025 ?",
  "Quelle est la marge brute actuelle ?",
]

export default function DocumentViewPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
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
          { page: 1, text: "Chiffre d'affaires: 2.4M€ (+23%)", relevance: 0.95 },
          { page: 2, text: "Le segment digital continue d'être notre moteur de croissance", relevance: 0.87 },
        ],
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (question: string): string => {
    if (question.toLowerCase().includes("indicateur") || question.toLowerCase().includes("performance")) {
      return "D'après le rapport, les indicateurs clés du Q4 2024 sont très positifs :\n\n• **Chiffre d'affaires** : 2.4M€ avec une croissance de 23%\n• **Marge brute** : 68% (+5 points)\n• **EBITDA** : 420K€ (+31%)\n\nCette performance exceptionnelle est principalement portée par le segment digital qui affiche une croissance de 35%."
    }

    if (question.toLowerCase().includes("digital")) {
      return "Le segment digital est le moteur principal de notre croissance avec une progression remarquable de **35% sur le trimestre**. Il continue d'être notre segment le plus performant et les perspectives pour 2025 sont très encourageantes dans ce domaine."
    }

    if (question.toLowerCase().includes("recommandation") || question.toLowerCase().includes("2025")) {
      return "Le rapport présente trois recommandations stratégiques pour 2025 :\n\n1. **Renforcer l'investissement dans le digital** - capitaliser sur notre succès\n2. **Optimiser les coûts du segment traditionnel** - améliorer la rentabilité\n3. **Développer de nouveaux partenariats stratégiques** - accélérer la croissance\n\nCes axes stratégiques visent à maintenir notre dynamique de croissance."
    }

    return "Basé sur l'analyse du document, je peux vous aider à comprendre les performances financières du Q4 2024. Le rapport montre une croissance solide avec des indicateurs très positifs. Souhaitez-vous que je détaille un aspect particulier ?"
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Message copié",
      description: "Le contenu a été copié dans le presse-papiers",
    })
  }

  return (
    <DashboardLayout>
      <div className={`flex h-screen ${fullscreen ? "fixed inset-0 z-50 bg-white" : "relative"}`}>
        {/* Table of Contents Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border-r border-slate-200 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">Sommaire</h3>
                  <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-full">
                <div className="p-4 space-y-2">
                  {mockTableOfContents.map((item) => (
                    <button
                      key={item.id}
                      className={`w-full text-left p-2 rounded-lg hover:bg-slate-100 transition-colors ${
                        item.level === 2
                          ? "font-medium text-slate-800"
                          : item.level === 3
                            ? "text-slate-700 ml-4"
                            : "text-slate-600 ml-8"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{item.title}</span>
                        <span className="text-xs text-slate-400 ml-2">{item.page}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Document Header */}
          <div className="bg-white border-b border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {!sidebarOpen && (
                  <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
                <div>
                  <h1 className="text-xl font-bold text-slate-800">{mockDocument.title}</h1>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600">
                    <span>{mockDocument.author}</span>
                    <span>•</span>
                    <span>{mockDocument.lastModified}</span>
                    <Badge variant="secondary">{mockDocument.collection}</Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Annoter
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Marquer
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Partager
                </Button>
                <Button variant="outline" size="sm" onClick={() => setFullscreen(!fullscreen)}>
                  {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setChatOpen(!chatOpen)}
                  className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat IA
                </Button>
              </div>
            </div>
          </div>

          {/* Document Content and Chat */}
          <div className="flex-1 flex overflow-hidden">
            {/* Document Content */}
            <div className={`${chatOpen ? "flex-1" : "w-full"} overflow-auto`}>
              <div className="max-w-4xl mx-auto p-8">
                <div className="prose prose-slate max-w-none">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: mockDocument.content
                        .replace(/^# /gm, '<h1 class="text-3xl font-bold text-slate-800 mb-6">')
                        .replace(/^## /gm, '<h2 class="text-2xl font-semibold text-slate-800 mt-8 mb-4">')
                        .replace(/^### /gm, '<h3 class="text-xl font-medium text-slate-700 mt-6 mb-3">')
                        .replace(/^#### /gm, '<h4 class="text-lg font-medium text-slate-700 mt-4 mb-2">')
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-800">$1</strong>')
                        .replace(/\n\n/g, '</p><p class="text-slate-700 leading-relaxed mb-4">')
                        .replace(/^([^<])/gm, '<p class="text-slate-700 leading-relaxed mb-4">$1')
                        .replace(/$/g, "</p>"),
                    }}
                  />
                </div>
              </div>
            </div>

            {/* AI Chat Panel */}
            <AnimatePresence>
              {chatOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 400, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border-l border-slate-200 flex flex-col"
                >
                  {/* Chat Header */}
                  <div className="p-4 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">Assistant IA</h3>
                          <p className="text-xs text-slate-500">Posez vos questions sur le document</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setChatOpen(false)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Suggested Questions */}
                  {messages.length === 0 && (
                    <div className="p-4 border-b border-slate-200">
                      <p className="text-sm font-medium text-slate-700 mb-3">Questions suggérées :</p>
                      <div className="space-y-2">
                        {suggestedQuestions.map((question, index) => (
                          <button
                            key={index}
                            onClick={() => handleSendMessage(question)}
                            className="w-full text-left p-2 text-sm bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`flex space-x-2 max-w-[85%] ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                          >
                            <Avatar className="w-8 h-8 flex-shrink-0">
                              {message.type === "user" ? (
                                <AvatarFallback className="bg-blue-500 text-white text-xs">
                                  <User className="w-4 h-4" />
                                </AvatarFallback>
                              ) : (
                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-xs">
                                  <Bot className="w-4 h-4" />
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div
                              className={`rounded-lg p-3 ${
                                message.type === "user" ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-800"
                              }`}
                            >
                              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                              {message.sources && (
                                <div className="mt-3 pt-3 border-t border-slate-200">
                                  <p className="text-xs font-medium text-slate-600 mb-2">Sources :</p>
                                  {message.sources.map((source, index) => (
                                    <div key={index} className="text-xs bg-white p-2 rounded border mb-1">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium">Page {source.page}</span>
                                        <Badge variant="secondary" className="text-xs">
                                          {Math.round(source.relevance * 100)}%
                                        </Badge>
                                      </div>
                                      <p className="text-slate-600">{source.text}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</span>
                                {message.type === "ai" && (
                                  <div className="flex items-center space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleCopyMessage(message.content)}
                                      className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                                    >
                                      <ThumbsUp className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                                    >
                                      <ThumbsDown className="w-3 h-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="flex space-x-2 max-w-[85%]">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white">
                                <Bot className="w-4 h-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="bg-slate-100 rounded-lg p-3">
                              <div className="flex space-x-1">
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
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Chat Input */}
                  <div className="p-4 border-t border-slate-200">
                    <div className="flex space-x-2">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Posez votre question..."
                        onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                        disabled={isLoading}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => handleSendMessage()}
                        disabled={!inputValue.trim() || isLoading}
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
