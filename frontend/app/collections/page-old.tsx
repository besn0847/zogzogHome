"use client"

import React, { useState, useMemo } from "react"
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
  Eye,
  Folder,
  AlertCircle,
  CheckCircle,
  Clock,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import DashboardLayout from "@/components/dashboard-layout"
import { useCollections } from "@/hooks/useCollections"

// Color options for collections
const COLLECTION_COLORS = [
  { name: 'Bleu', value: '#3B82F6', class: 'bg-blue-500' },
  { name: 'Vert', value: '#10B981', class: 'bg-green-500' },
  { name: 'Violet', value: '#8B5CF6', class: 'bg-purple-500' },
  { name: 'Rose', value: '#EC4899', class: 'bg-pink-500' },
  { name: 'Orange', value: '#F59E0B', class: 'bg-amber-500' },
  { name: 'Rouge', value: '#EF4444', class: 'bg-red-500' },
  { name: 'Indigo', value: '#6366F1', class: 'bg-indigo-500' },
  { name: 'Teal', value: '#14B8A6', class: 'bg-teal-500' },
]

// Icon options for collections
const COLLECTION_ICONS = [
  { name: 'Dossier', value: 'folder', icon: Folder },
  { name: 'Documents', value: 'file-text', icon: FileText },
  { name: 'Utilisateurs', value: 'users', icon: Users },
  { name: 'Paramètres', value: 'settings', icon: Settings },
  { name: 'Globe', value: 'globe', icon: Globe },
  { name: 'Œil', value: 'eye', icon: Eye },
]

interface CreateCollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateCollection: (data: any) => Promise<void>
  isCreating: boolean
}

const CreateCollectionDialog: React.FC<CreateCollectionDialogProps> = ({
  open,
  onOpenChange,
  onCreateCollection,
  isCreating
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    icon: 'folder',
    isPublic: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onCreateCollection(formData)
      setFormData({
        name: '',
        description: '',
        color: '#3B82F6',
        icon: 'folder',
        isPublic: false
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating collection:', error)
    }
  }

  const selectedColor = COLLECTION_COLORS.find(c => c.value === formData.color)
  const selectedIcon = COLLECTION_ICONS.find(i => i.value === formData.icon)
  const IconComponent = selectedIcon?.icon || Folder

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle collection</DialogTitle>
          <DialogDescription>
            Organisez vos documents en créant une nouvelle collection
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la collection *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Rapports mensuels"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description optionnelle de la collection"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Couleur</Label>
              <Select value={formData.color} onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}>
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${selectedColor?.class}`} />
                      {selectedColor?.name}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {COLLECTION_COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${color.class}`} />
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Icône</Label>
              <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      {selectedIcon?.name}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {COLLECTION_ICONS.map((icon) => {
                    const Icon = icon.icon
                    return (
                      <SelectItem key={icon.value} value={icon.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {icon.name}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
            />
            <Label htmlFor="isPublic" className="flex items-center gap-2">
              {formData.isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              Collection publique
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isCreating || !formData.name.trim()}>
              {isCreating ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface CollectionCardProps {
  collection: any
  onEdit: (collection: any) => void
  onDelete: (id: string) => void
  onShare: (collection: any) => void
  viewMode: 'grid' | 'list'
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onEdit,
  onDelete,
  onShare,
  viewMode
}) => {
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'folder': Folder,
      'file-text': FileText,
      'users': Users,
      'settings': Settings,
      'globe': Globe,
      'eye': Eye,
    }
    return iconMap[iconName] || Folder
  }

  const IconComponent = getIconComponent(collection.icon || 'folder')

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: collection.color }}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm truncate">{collection.name}</h3>
                  {collection.isPublic ? (
                    <Globe className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {collection.description || 'Aucune description'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="text-center">
                <div className="font-medium">{collection.count}</div>
                <div className="text-xs">Documents</div>
              </div>
              
              <div className="text-center">
                <div className="font-medium">{collection.members}</div>
                <div className="text-xs">Membres</div>
              </div>
              
              <div className="text-center min-w-[80px]">
                <div className="font-medium">{collection.totalSize}</div>
                <div className="text-xs">Taille</div>
              </div>
              
              <div className="text-center min-w-[100px]">
                <div className="text-xs">{collection.lastActivity}</div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(collection)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare(collection)}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Partager
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(collection.id)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: collection.color }}
            >
              <IconComponent className="w-6 h-6" />
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
                <DropdownMenuItem onClick={() => onEdit(collection)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare(collection)}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Partager
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(collection.id)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg truncate">{collection.name}</h3>
              {collection.isPublic ? (
                <Globe className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Lock className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
              {collection.description || 'Aucune description'}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Documents</span>
              <span className="font-medium">{collection.count}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Membres</span>
              <span className="font-medium">{collection.members}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Taille</span>
              <span className="font-medium">{collection.totalSize}</span>
            </div>
            
            <Separator />
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>Modifié {collection.lastActivity}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const CollectionsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <Card key={i}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <Skeleton className="w-8 h-8 rounded" />
          </div>
          <div className="space-y-2 mb-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-8" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)

export default function CollectionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterStatus, setFilterStatus] = useState<'all' | 'public' | 'private'>('all')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // Use the new Collections hook
  const {
    formattedCollections,
    collectionsLoading,
    collectionsError,
    createCollection,
    updateCollection,
    deleteCollection,
    isCreating,
    isDeleting,
    createError,
    deleteError
  } = useCollections()

  // Filter and search collections
  const filteredCollections = useMemo(() => {
    if (!formattedCollections) return []
    
    return formattedCollections.filter(collection => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (collection.description && collection.description.toLowerCase().includes(searchQuery.toLowerCase()))
      
      // Status filter
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'public' && collection.isPublic) ||
        (filterStatus === 'private' && !collection.isPublic)
      
      return matchesSearch && matchesStatus
    })
  }, [formattedCollections, searchQuery, filterStatus])

  const handleCreateCollection = async (data: any) => {
    try {
      await createCollection.mutateAsync({
        name: data.name,
        description: data.description,
        color: data.color,
        icon: data.icon,
        isPublic: data.isPublic
      })
      toast("Collection créée avec succès!")
    } catch (error) {
      console.error('Error creating collection:', error)
      toast("Erreur lors de la création de la collection")
    }
  }

  const handleEditCollection = (collection: any) => {
    // TODO: Implement edit dialog
    console.log('Edit collection:', collection)
    toast("Fonction d'édition à implémenter")
  }

  const handleDeleteCollection = async (id: string) => {
    try {
      await deleteCollection.mutateAsync(id)
      toast("Collection supprimée avec succès!")
    } catch (error) {
      console.error('Error deleting collection:', error)
      toast("Erreur lors de la suppression de la collection")
    }
  }

  const handleShareCollection = (collection: any) => {
    // TODO: Implement share dialog
    console.log('Share collection:', collection)
    toast("Fonction de partage à implémenter")
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
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
            <p className="text-muted-foreground">
              Organisez et gérez vos documents par collections
            </p>
          </div>
          
          <CreateCollectionDialog
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
            onCreateCollection={handleCreateCollection}
            isCreating={isCreating}
          />
          
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle collection
          </Button>
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
