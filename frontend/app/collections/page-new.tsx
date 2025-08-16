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
import { useToast } from "@/hooks/use-toast"
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
  const { toast } = useToast()

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
      const matchesSearch = collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           collection.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesFilter = filterStatus === 'all' || 
                           (filterStatus === 'public' && collection.isPublic) ||
                           (filterStatus === 'private' && !collection.isPublic)
      
      return matchesSearch && matchesFilter
    })
  }, [formattedCollections, searchQuery, filterStatus])

  const handleCreateCollection = async (data: any) => {
    try {
      await createCollection(data)
      toast({
        title: "Collection créée",
        description: `La collection "${data.name}" a été créée avec succès.`,
      })
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer la collection.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCollection = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette collection ?")) return
    
    try {
      await deleteCollection(id)
      toast({
        title: "Collection supprimée",
        description: "La collection a été supprimée avec succès.",
      })
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer la collection.",
        variant: "destructive",
      })
    }
  }

  const handleEditCollection = (collection: any) => {
    // TODO: Implement edit dialog
    console.log('Edit collection:', collection)
  }

  const handleShareCollection = (collection: any) => {
    // TODO: Implement share dialog
    console.log('Share collection:', collection)
  }

  if (collectionsError) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-6 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Erreur lors du chargement des collections. Veuillez réessayer.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    )
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
        </div>

        {/* Stats */}
        {!collectionsLoading && formattedCollections && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{formattedCollections.length}</div>
                    <div className="text-sm text-muted-foreground">Collections</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {formattedCollections.reduce((acc, col) => acc + col.count, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Documents</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {formattedCollections.filter(col => col.isPublic).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Publiques</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {formattedCollections.reduce((acc, col) => acc + col.members, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Membres</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher des collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-[140px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="public">Publiques</SelectItem>
                <SelectItem value="private">Privées</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Collections Grid/List */}
        {collectionsLoading ? (
          <CollectionsSkeleton />
        ) : filteredCollections.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery || filterStatus !== 'all' ? 'Aucune collection trouvée' : 'Aucune collection'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterStatus !== 'all' 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Commencez par créer votre première collection'
              }
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Créer une collection
              </Button>
            )}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className={
                viewMode === 'grid'
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {filteredCollections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  onEdit={handleEditCollection}
                  onDelete={handleDeleteCollection}
                  onShare={handleShareCollection}
                  viewMode={viewMode}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </DashboardLayout>
  )
}
