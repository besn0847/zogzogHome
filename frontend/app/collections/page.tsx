"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FolderOpen,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  MoreHorizontal,
  Edit,
  Share2,
  Trash2,
  Users,
  Lock,
  Globe,
  FileText,
  Calendar,
  Settings,
  Download,
  Upload,
  Eye,
  Move,
  Archive,
  Tag,
  Folder,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import DashboardLayout from "@/components/dashboard-layout"

interface Collection {
  id: string
  name: string
  description: string
  documentCount: number
  createdAt: string
  updatedAt: string
  owner: string
  collaborators: string[]
  visibility: "private" | "shared" | "public"
  color: string
  tags: string[]
  size: string
  documents: Document[]
}

interface Document {
  id: string
  name: string
  type: string
  size: string
  addedAt: string
  status: "processed" | "processing" | "error"
}

const mockCollections: Collection[] = [
  {
    id: "1",
    name: "Projets IA",
    description: "Documents et recherches sur l'intelligence artificielle",
    documentCount: 24,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15",
    owner: "Jean Dupont",
    collaborators: ["Marie Dubois", "Pierre Martin"],
    visibility: "shared",
    color: "from-blue-500 to-blue-600",
    tags: ["IA", "Machine Learning", "Recherche"],
    size: "156 MB",
    documents: [
      { id: "d1", name: "Guide IA.pdf", type: "PDF", size: "2.4 MB", addedAt: "2024-01-15", status: "processed" },
      { id: "d2", name: "Modèles ML.pdf", type: "PDF", size: "3.1 MB", addedAt: "2024-01-14", status: "processed" },
    ],
  },
  {
    id: "2",
    name: "Marketing Digital",
    description: "Stratégies et campagnes marketing",
    documentCount: 18,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-12",
    owner: "Marie Dubois",
    collaborators: ["Jean Dupont"],
    visibility: "private",
    color: "from-emerald-500 to-emerald-600",
    tags: ["Marketing", "Digital", "Stratégie"],
    size: "89 MB",
    documents: [
      { id: "d3", name: "Stratégie 2024.pdf", type: "PDF", size: "1.8 MB", addedAt: "2024-01-12", status: "processed" },
    ],
  },
  {
    id: "3",
    name: "Documentation Technique",
    description: "Guides et spécifications techniques",
    documentCount: 32,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-10",
    owner: "Pierre Martin",
    collaborators: ["Sophie Chen", "Jean Dupont", "Marie Dubois"],
    visibility: "public",
    color: "from-purple-500 to-purple-600",
    tags: ["Documentation", "Technique", "API"],
    size: "245 MB",
    documents: [],
  },
]

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>(mockCollections)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [draggedDocument, setDraggedDocument] = useState<Document | null>(null)
  const [dragOverCollection, setDragOverCollection] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [newCollection, setNewCollection] = useState({
    name: "",
    description: "",
    visibility: "private" as "private" | "shared" | "public",
    color: "from-blue-500 to-blue-600",
    tags: [] as string[],
  })

  const filteredCollections = collections.filter(
    (collection) =>
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "private":
        return Lock
      case "shared":
        return Users
      case "public":
        return Globe
      default:
        return Lock
    }
  }

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case "private":
        return "text-red-600 bg-red-100"
      case "shared":
        return "text-blue-600 bg-blue-100"
      case "public":
        return "text-emerald-600 bg-emerald-100"
      default:
        return "text-slate-600 bg-slate-100"
    }
  }

  const handleCreateCollection = () => {
    const collection: Collection = {
      id: Date.now().toString(),
      ...newCollection,
      documentCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      owner: "Jean Dupont",
      collaborators: [],
      size: "0 MB",
      documents: [],
    }
    setCollections([...collections, collection])
    setNewCollection({
      name: "",
      description: "",
      visibility: "private",
      color: "from-blue-500 to-blue-600",
      tags: [],
    })
    setIsCreateDialogOpen(false)
  }

  const handleDragStart = (document: Document) => {
    setDraggedDocument(document)
  }

  const handleDragOver = (e: React.DragEvent, collectionId: string) => {
    e.preventDefault()
    setDragOverCollection(collectionId)
  }

  const handleDragLeave = () => {
    setDragOverCollection(null)
  }

  const handleDrop = (e: React.DragEvent, targetCollectionId: string) => {
    e.preventDefault()
    if (draggedDocument && selectedCollection) {
      // Remove from source collection
      const updatedSourceCollection = {
        ...selectedCollection,
        documents: selectedCollection.documents.filter((doc) => doc.id !== draggedDocument.id),
        documentCount: selectedCollection.documentCount - 1,
      }

      // Add to target collection
      const targetCollection = collections.find((c) => c.id === targetCollectionId)
      if (targetCollection) {
        const updatedTargetCollection = {
          ...targetCollection,
          documents: [...targetCollection.documents, draggedDocument],
          documentCount: targetCollection.documentCount + 1,
        }

        setCollections(
          collections.map((c) =>
            c.id === selectedCollection.id
              ? updatedSourceCollection
              : c.id === targetCollectionId
                ? updatedTargetCollection
                : c,
          ),
        )
        setSelectedCollection(updatedSourceCollection)
      }
    }
    setDraggedDocument(null)
    setDragOverCollection(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Collections</h1>
            <p className="text-slate-600 mt-1">Organisez vos documents en collections thématiques</p>
          </div>
          <div className="flex items-center space-x-3">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Collection
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle collection</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom de la collection</Label>
                    <Input
                      id="name"
                      value={newCollection.name}
                      onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                      placeholder="Ex: Projets IA"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newCollection.description}
                      onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                      placeholder="Décrivez le contenu de cette collection..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="visibility">Visibilité</Label>
                    <Select
                      value={newCollection.visibility}
                      onValueChange={(value: any) => setNewCollection({ ...newCollection, visibility: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">
                          <div className="flex items-center">
                            <Lock className="w-4 h-4 mr-2" />
                            Privée
                          </div>
                        </SelectItem>
                        <SelectItem value="shared">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            Partagée
                          </div>
                        </SelectItem>
                        <SelectItem value="public">
                          <div className="flex items-center">
                            <Globe className="w-4 h-4 mr-2" />
                            Publique
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreateCollection} disabled={!newCollection.name}>
                    Créer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Rechercher dans les collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Collections Grid/List */}
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          <AnimatePresence>
            {filteredCollections.map((collection, index) => {
              const VisibilityIcon = getVisibilityIcon(collection.visibility)
              return (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  onDragOver={(e) => handleDragOver(e, collection.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, collection.id)}
                  className={`${dragOverCollection === collection.id ? "ring-2 ring-blue-500 ring-opacity-50" : ""}`}
                >
                  <Card className="hover:shadow-lg transition-all cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-12 h-12 bg-gradient-to-r ${collection.color} rounded-lg flex items-center justify-center`}
                          >
                            <FolderOpen className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                              {collection.name}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getVisibilityColor(collection.visibility)}>
                                <VisibilityIcon className="w-3 h-3 mr-1" />
                                {collection.visibility}
                              </Badge>
                              <span className="text-xs text-slate-500">{collection.size}</span>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedCollection(collection)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Ouvrir
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="w-4 h-4 mr-2" />
                              Partager
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Télécharger
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="w-4 h-4 mr-2" />
                              Archiver
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <p className="text-slate-600 text-sm mb-4 line-clamp-2">{collection.description}</p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <FileText className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-medium">{collection.documentCount}</span>
                            <span className="text-xs text-slate-500">docs</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-medium">{collection.collaborators.length + 1}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-500">{collection.updatedAt}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {collection.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            <Tag className="w-2 h-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {collection.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{collection.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Collaborators */}
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          <Avatar className="w-6 h-6 border-2 border-white">
                            <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-emerald-500 text-white">
                              {collection.owner
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {collection.collaborators.slice(0, 2).map((collaborator, idx) => (
                            <Avatar key={idx} className="w-6 h-6 border-2 border-white">
                              <AvatarFallback className="text-xs bg-slate-500 text-white">
                                {collaborator
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {collection.collaborators.length > 2 && (
                            <div className="w-6 h-6 bg-slate-200 border-2 border-white rounded-full flex items-center justify-center">
                              <span className="text-xs text-slate-600">+{collection.collaborators.length - 2}</span>
                            </div>
                          )}
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setSelectedCollection(collection)}>
                          Ouvrir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Collection Detail Modal */}
        <Dialog open={!!selectedCollection} onOpenChange={() => setSelectedCollection(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            {selectedCollection && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 bg-gradient-to-r ${selectedCollection.color} rounded-lg flex items-center justify-center`}
                      >
                        <FolderOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <DialogTitle className="text-xl">{selectedCollection.name}</DialogTitle>
                        <p className="text-slate-600 text-sm">{selectedCollection.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Partager
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Paramètres
                      </Button>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Collection Stats */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-bold text-slate-800">{selectedCollection.documentCount}</div>
                      <div className="text-sm text-slate-600">Documents</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-bold text-slate-800">{selectedCollection.size}</div>
                      <div className="text-sm text-slate-600">Taille</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-bold text-slate-800">
                        {selectedCollection.collaborators.length + 1}
                      </div>
                      <div className="text-sm text-slate-600">Collaborateurs</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-bold text-slate-800">{selectedCollection.tags.length}</div>
                      <div className="text-sm text-slate-600">Tags</div>
                    </div>
                  </div>

                  <Separator />

                  {/* Documents */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Documents</h3>
                      <Button size="sm" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="w-4 h-4 mr-2" />
                        Ajouter des documents
                      </Button>
                      <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx" className="hidden" />
                    </div>

                    {selectedCollection.documents.length > 0 ? (
                      <div className="space-y-2">
                        {selectedCollection.documents.map((document) => (
                          <div
                            key={document.id}
                            draggable
                            onDragStart={() => handleDragStart(document)}
                            className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-move"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5 text-slate-400" />
                              <div>
                                <div className="font-medium text-slate-800">{document.name}</div>
                                <div className="text-sm text-slate-500">
                                  {document.type} • {document.size} • Ajouté le {document.addedAt}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                className={
                                  document.status === "processed"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : document.status === "processing"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-red-100 text-red-700"
                                }
                              >
                                {document.status}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Ouvrir
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Download className="w-4 h-4 mr-2" />
                                    Télécharger
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Move className="w-4 h-4 mr-2" />
                                    Déplacer
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Supprimer
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-lg">
                        <Folder className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-600 mb-2">Aucun document</h3>
                        <p className="text-slate-500 mb-4">
                          Cette collection est vide. Ajoutez des documents pour commencer.
                        </p>
                        <Button onClick={() => fileInputRef.current?.click()}>
                          <Upload className="w-4 h-4 mr-2" />
                          Ajouter des documents
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
