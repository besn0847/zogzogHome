"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ChevronLeft,
  MessageSquare,
  Share2,
  Download,
  Bookmark,
  Eye,
  Clock,
  Tag,
  FileText,
  Highlighter,
  StickyNote,
  X,
  Send,
  Sparkles,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import DashboardLayout from "@/components/dashboard-layout"

interface DocumentData {
  id: string
  title: string
  content: string
  metadata: {
    size: string
    pages: number
    created: string
    modified: string
    author: string
    tags: string[]
    collection: string
  }
  tableOfContents: Array<{
    id: string
    title: string
    level: number
  }>
}

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: string
  sources?: Array<{
    page: number
    text: string
  }>
}

const mockDocument: DocumentData = {
  id: "1",
  title: "Rapport Financier Q4 2024",
  content: `# Rapport Financier Q4 2024

## Résumé Exécutif

Ce rapport présente une analyse détaillée des performances financières de notre entreprise pour le quatrième trimestre 2024. Les résultats montrent une **croissance significative** de 15% par rapport au trimestre précédent.

### Points Clés

- Chiffre d'affaires: **€2.4M** (+15%)
- Bénéfice net: **€480K** (+22%)
- Marge opérationnelle: **20%** (+3 points)

## Analyse Détaillée

### Revenus par Segment

\`\`\`
Segment A: €1.2M (50%)
Segment B: €720K (30%)
Segment C: €480K (20%)
\`\`\`

Les revenus du **Segment A** ont connu une croissance exceptionnelle grâce au lancement de notre nouveau produit phare.

### Dépenses Opérationnelles

Les dépenses ont été maîtrisées avec une réduction de 5% par rapport au Q3:

- Personnel: €960K
- Marketing: €240K
- R&D: €180K
- Autres: €120K

## Perspectives 2025

L'année 2025 s'annonce prometteuse avec plusieurs initiatives stratégiques:

1. **Expansion internationale** - Ouverture de 3 nouveaux marchés
2. **Innovation produit** - Lancement de 2 nouvelles gammes
3. **Optimisation opérationnelle** - Automatisation des processus clés

### Objectifs Financiers

- Croissance du CA: **25%**
- Amélioration de la marge: **+2 points**
- ROI: **>15%**

## Conclusion

Le Q4 2024 confirme la solidité de notre modèle économique et notre capacité à générer une croissance profitable et durable.`,
  metadata: {
    size: "2.4 MB",
    pages: 12,
    created: "2024-01-10",
    modified: "2024-01-15",
    author: "Équipe Finance",
    tags: ["Finance", "Q4", "2024", "Rapport"],
    collection: "Rapports Financiers",
  },
  tableOfContents: [
    { id: "resume-executif", title: "Résumé Exécutif", level: 2 },
    { id: "points-cles", title: "Points Clés", level: 3 },
    { id: "analyse-detaillee", title: "Analyse Détaillée", level: 2 },
    { id: "revenus-segment", title: "Revenus par Segment", level: 3 },
    { id: "depenses", title: "Dépenses Opérationnelles", level: 3 },
    { id: "perspectives", title: "Perspectives 2025", level: 2 },
    { id: "objectifs", title: "Objectifs Financiers", level: 3 },
    { id: "conclusion", title: "Conclusion", level: 2 },
  ],
}

const mockChatMessages: ChatMessage[] = [
  {
    id: "1",
    type: "ai",
    content: "Bonjour ! Je suis là pour vous aider à analyser ce rapport financier. Que souhaitez-vous savoir ?",
    timestamp: "10:30",
  },
  {
    id: "2",
    type: "user",
    content: "Quels sont les principaux facteurs de croissance mentionnés ?",
    timestamp: "10:31",
  },
  {
    id: "3",
    type: "ai",
    content:
      "D'après le rapport, les principaux facteurs de croissance sont :\n\n1. **Lancement du nouveau produit phare** - qui a boosté le Segment A\n2. **Maîtrise des coûts** - réduction de 5% des dépenses opérationnelles\n3. **Amélioration de la marge opérationnelle** - +3 points\n\nCes éléments ont contribué à une croissance de 15% du chiffre d'affaires.",
    timestamp: "10:31",
    sources: [
      { page: 1, text: "croissance significative de 15%" },
      { page: 2, text: "Segment A: €1.2M (50%)" },
    ],
  },
]

const suggestedQuestions = [
  "Quelles sont les perspectives pour 2025 ?",
  "Comment se répartissent les dépenses ?",
  "Quel est le ROI attendu ?",
  "Quels sont les risques identifiés ?",
]

export default function DocumentViewerPage({ params }: { params: { id: string } }) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages)
  const [newMessage, setNewMessage] = useState("")
  const [activeSection, setActiveSection] = useState("")
  const [isAnnotating, setIsAnnotating] = useState(false)
  const [selectedText, setSelectedText] = useState("")
  const [annotationNote, setAnnotationNote] = useState("")

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    }

    setChatMessages([...chatMessages, userMessage])
    setNewMessage("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "Je traite votre question et analyse le document pour vous fournir une réponse précise...",
        timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      }
      setChatMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) {
      setSelectedText(selection.toString())
      setIsAnnotating(true)
    }
  }

  const addAnnotation = () => {
    // Logic to save annotation would go here
    console.log("Adding annotation:", { text: selectedText, note: annotationNote })
    setIsAnnotating(false)
    setSelectedText("")
    setAnnotationNote("")
  }

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-8rem)] bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Navigation Sidebar */}
        <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <Link href="/documents">
              <Button variant="ghost" size="sm" className="mb-4">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Retour aux documents
              </Button>
            </Link>
            <h2 className="font-semibold text-slate-800 text-sm">Table des matières</h2>
          </div>
          <ScrollArea className="flex-1 p-4">
            <nav className="space-y-2">
              {mockDocument.tableOfContents.map((item) => (
                <button
                  key={item.id}
                  className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    activeSection === item.id
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                  style={{ paddingLeft: `${item.level * 8 + 12}px` }}
                  onClick={() => setActiveSection(item.id)}
                >
                  {item.title}
                </button>
              ))}
            </nav>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Document Header */}
          <div className="p-6 border-b border-slate-200 bg-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">{mockDocument.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-slate-500">
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {mockDocument.metadata.pages} pages
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Modifié le {mockDocument.metadata.modified}
                  </span>
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {mockDocument.metadata.size}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-3">
                  {mockDocument.metadata.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsAnnotating(!isAnnotating)}
                        className={isAnnotating ? "bg-yellow-50 border-yellow-200" : ""}
                      >
                        <Highlighter className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Outil d'annotation</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button variant="outline" size="sm">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Favoris
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Partager
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Partager le document</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Lien de partage</label>
                        <div className="flex mt-1">
                          <Input value="https://docpdf.app/doc/1" readOnly className="flex-1" />
                          <Button variant="outline" size="sm" className="ml-2 bg-transparent">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Inviter par email</label>
                        <Input placeholder="email@example.com" className="mt-1" />
                      </div>
                      <Button className="w-full">Envoyer l'invitation</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>

                <Button
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className="bg-gradient-to-r from-[#3b82f6] to-[#10b981] hover:from-[#1e3a8a] hover:to-[#059669] text-white"
                  size="sm"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat IA
                </Button>
              </div>
            </div>
          </div>

          {/* Document Content */}
          <div className="flex-1 flex">
            <ScrollArea className="flex-1 p-6" onMouseUp={handleTextSelection}>
              <div className="max-w-4xl mx-auto prose prose-slate prose-lg">
                <div
                  className="markdown-content"
                  dangerouslySetInnerHTML={{
                    __html: mockDocument.content
                      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-slate-800 mb-6">$1</h1>')
                      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold text-slate-700 mt-8 mb-4">$1</h2>')
                      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium text-slate-600 mt-6 mb-3">$1</h3>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-800">$1</strong>')
                      .replace(
                        /```([\s\S]*?)```/g,
                        '<pre class="bg-slate-100 p-4 rounded-lg text-sm"><code>$1</code></pre>',
                      )
                      .replace(/^\d+\. (.*$)/gim, '<li class="mb-2">$1</li>')
                      .replace(/^- (.*$)/gim, '<li class="mb-1">$1</li>')
                      .replace(/\n\n/g, '</p><p class="mb-4">')
                      .replace(/^(?!<[h|l|p|d])(.*$)/gim, '<p class="mb-4">$1</p>'),
                  }}
                />
              </div>
            </ScrollArea>

            {/* AI Chat Panel */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: isChatOpen ? 400 : 0 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-50 border-l border-slate-200 overflow-hidden"
            >
              {isChatOpen && (
                <div className="w-96 h-full flex flex-col">
                  <div className="p-4 border-b border-slate-200 bg-white">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-800 flex items-center">
                        <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
                        Assistant IA
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setIsChatOpen(false)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">Posez des questions sur ce document</p>
                  </div>

                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.type === "user"
                                ? "bg-blue-500 text-white"
                                : "bg-white border border-slate-200 text-slate-800"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            {message.sources && (
                              <div className="mt-2 pt-2 border-t border-slate-200">
                                <p className="text-xs text-slate-500 mb-1">Sources:</p>
                                {message.sources.map((source, idx) => (
                                  <div key={idx} className="text-xs bg-slate-50 p-2 rounded mb-1">
                                    <span className="font-medium">Page {source.page}:</span> {source.text}
                                  </div>
                                ))}
                              </div>
                            )}
                            <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="p-4 border-t border-slate-200 bg-white">
                    <div className="mb-3">
                      <p className="text-xs text-slate-500 mb-2">Questions suggérées:</p>
                      <div className="flex flex-wrap gap-1">
                        {suggestedQuestions.slice(0, 2).map((question, idx) => (
                          <button
                            key={idx}
                            onClick={() => setNewMessage(question)}
                            className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded transition-colors"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Posez votre question..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} size="sm">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Annotation Modal */}
      {isAnnotating && selectedText && (
        <Dialog open={isAnnotating} onOpenChange={setIsAnnotating}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une annotation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Texte sélectionné</label>
                <div className="mt-1 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">"{selectedText}"</div>
              </div>
              <div>
                <label className="text-sm font-medium">Note</label>
                <Textarea
                  placeholder="Ajoutez votre note..."
                  value={annotationNote}
                  onChange={(e) => setAnnotationNote(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAnnotating(false)}>
                  Annuler
                </Button>
                <Button onClick={addAnnotation}>
                  <StickyNote className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  )
}
