"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Download,
  Share2,
  Trash2,
  FileText,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertCircle,
  Clock,
  CheckCircle2,
  SortAsc,
  SortDesc,
  Grid,
  List,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import DashboardLayout from "@/components/dashboard-layout"

interface Document {
  id: string
  title: string
  type: string
  size: string
  sizeBytes: number
  lastModified: string
  lastModifiedDate: Date
  status: "transformed" | "processing" | "error"
  collection: string
  tags: string[]
  preview: string
  author: string
}

type SortField = "title" | "lastModified" | "size" | "status"
type SortDirection = "asc" | "desc"
type ViewMode = "table" | "grid"

const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Rapport Financier Q4 2024",
    type: "PDF",
    size: "2.4 MB",
    sizeBytes: 2400000,
    lastModified: "2024-01-15",
    lastModifiedDate: new Date("2024-01-15"),
    status: "transformed",
    collection: "Finance",
    tags: ["rapport", "financier", "Q4"],
    preview: "Analyse détaillée des performances financières du quatrième trimestre...",
    author: "Marie Dubois",
  },
  {
    id: "2",
    title: "Guide Utilisateur v2.1",
    type: "PDF",
    size: "1.8 MB",
    sizeBytes: 1800000,
    lastModified: "2024-01-14",
    lastModifiedDate: new Date("2024-01-14"),
    status: "processing",
    collection: "Documentation",
    tags: ["guide", "utilisateur", "v2.1"],
    preview: "Manuel complet d'utilisation de la plateforme DocPDF Manager...",
    author: "Jean Martin",
  },
  {
    id: "3",
    title: "Contrat Partenariat ABC Corp",
    type: "PDF",
    size: "856 KB",
    sizeBytes: 856000,
    lastModified: "2024-01-13",
    lastModifiedDate: new Date("2024-01-13"),
    status: "transformed",
    collection: "Juridique",
    tags: ["contrat", "partenariat", "ABC"],
    preview: "Accord de partenariat stratégique avec ABC Corporation...",
    author: "Sophie Laurent",
  },
  {
    id: "4",
    title: "Présentation Produit 2024",
    type: "PDF",
    size: "3.2 MB",
    sizeBytes: 3200000,
    lastModified: "2024-01-12",
    lastModifiedDate: new Date("2024-01-12"),
    status: "error",
    collection: "Marketing",
    tags: ["présentation", "produit", "2024"],
    preview: "Présentation des nouvelles fonctionnalités et roadmap produit...",
    author: "Pierre Durand",
  },
  {
    id: "5",
    title: "Analyse Concurrentielle",
    type: "PDF",
    size: "1.2 MB",
    sizeBytes: 1200000,
    lastModified: "2024-01-11",
    lastModifiedDate: new Date("2024-01-11"),
    status: "transformed",
    collection: "Marketing",
    tags: ["analyse", "concurrence", "marché"],
    preview: "Étude comparative des solutions concurrentes sur le marché...",
    author: "Claire Moreau",
  },
  {
    id: "6",
    title: "Procédures RH 2024",
    type: "PDF",
    size: "945 KB",
    sizeBytes: 945000,
    lastModified: "2024-01-10",
    lastModifiedDate: new Date("2024-01-10"),
    status: "transformed",
    collection: "RH",
    tags: ["procédures", "RH", "politique"],
    preview: "Mise à jour des procédures et politiques des ressources humaines...",
    author: "Thomas Bernard",
  },
]

const collections = ["Tous", "Finance", "Documentation", "Juridique", "Marketing", "RH"]
const statuses = ["Tous", "transformed", "processing", "error"]
const tags = ["rapport", "financier", "guide", "contrat", "présentation", "analyse", "procédures"]

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCollection, setSelectedCollection] = useState("Tous")
  const [selectedStatus, setSelectedStatus] = useState("Tous")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortField, setSortField] = useState<SortField>("lastModified")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null)

  const { toast } = useToast()

  const filteredAndSortedDocuments = useMemo(() => {
    const filtered = mockDocuments.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.author.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCollection = selectedCollection === "Tous" || doc.collection === selectedCollection
      const matchesStatus = selectedStatus === "Tous" || doc.status === selectedStatus
      const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => doc.tags.includes(tag))

      return matchesSearch && matchesCollection && matchesStatus && matchesTags
    })

    // Sort documents
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortField) {
        case "title":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case "lastModified":
          aValue = a.lastModifiedDate
          bValue = b.lastModifiedDate
          break
        case "size":
          aValue = a.sizeBytes
          bValue = b.sizeBytes
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [searchQuery, selectedCollection, selectedStatus, selectedTags, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSelectAll = () => {
    if (selectedDocuments.length === filteredAndSortedDocuments.length) {
      setSelectedDocuments([])
    } else {
      setSelectedDocuments(filteredAndSortedDocuments.map((doc) => doc.id))
    }
  }

  const handleSelectDocument = (docId: string) => {
    setSelectedDocuments((prev) => (prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]))
  }

  const handleBulkAction = (action: string) => {
    toast({
      title: `Action ${action}`,
      description: `${selectedDocuments.length} document(s) sélectionné(s)`,
    })
    setSelectedDocuments([])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "transformed":
        return "text-emerald-600 bg-emerald-50"
      case "processing":
        return "text-cyan-600 bg-cyan-50"
      case "error":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "transformed":
        return <CheckCircle2 className="w-4 h-4" />
      case "processing":
        return <RefreshCw className="w-4 h-4 animate-spin" />
      case "error":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "transformed":
        return "Transformé"
      case "processing":
        return "En cours"
      case "error":
        return "Erreur"
      default:
        return "Inconnu"
    }
  }

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-auto p-1 font-medium text-slate-600 hover:text-slate-800"
    >
      <span className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field &&
          (sortDirection === "asc" ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
      </span>
    </Button>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Documents</h1>
            <p className="text-slate-600 mt-1">Gérez et organisez vos documents PDF</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Rechercher par titre, contenu ou auteur..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtres
                {filtersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>

            <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
              <CollapsibleContent className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Collection</label>
                    <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {collections.map((collection) => (
                          <SelectItem key={collection} value={collection}>
                            {collection}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Statut</label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status === "Tous" ? "Tous" : getStatusText(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Button
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setSelectedTags((prev) =>
                              prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
                            )
                          }}
                          className="text-xs"
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {(selectedCollection !== "Tous" || selectedStatus !== "Tous" || selectedTags.length > 0) && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
                    <span className="text-sm text-slate-600">Filtres actifs:</span>
                    {selectedCollection !== "Tous" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {selectedCollection}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCollection("Tous")} />
                      </Badge>
                    )}
                    {selectedStatus !== "Tous" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {getStatusText(selectedStatus)}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedStatus("Tous")} />
                      </Badge>
                    )}
                    {selectedTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => setSelectedTags((prev) => prev.filter((t) => t !== tag))}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedDocuments.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">
                      {selectedDocuments.length} document(s) sélectionné(s)
                    </span>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleBulkAction("télécharger")}>
                        <Download className="w-4 h-4 mr-1" />
                        Télécharger
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkAction("partager")}>
                        <Share2 className="w-4 h-4 mr-1" />
                        Partager
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkAction("supprimer")}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Supprimer
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setSelectedDocuments([])}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Documents Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-slate-800">{filteredAndSortedDocuments.length} document(s)</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Trier par:</span>
                <Select value={sortField} onValueChange={(value) => setSortField(value as SortField)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Titre</SelectItem>
                    <SelectItem value="lastModified">Date</SelectItem>
                    <SelectItem value="size">Taille</SelectItem>
                    <SelectItem value="status">Statut</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left p-4 w-12">
                      <Checkbox
                        checked={
                          selectedDocuments.length === filteredAndSortedDocuments.length &&
                          filteredAndSortedDocuments.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="text-left p-4">
                      <SortButton field="title">Document</SortButton>
                    </th>
                    <th className="text-left p-4">Collection</th>
                    <th className="text-left p-4">
                      <SortButton field="size">Taille</SortButton>
                    </th>
                    <th className="text-left p-4">
                      <SortButton field="status">Statut</SortButton>
                    </th>
                    <th className="text-left p-4">
                      <SortButton field="lastModified">Modifié</SortButton>
                    </th>
                    <th className="text-left p-4 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedDocuments.map((doc, index) => (
                    <motion.tr
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4">
                        <Checkbox
                          checked={selectedDocuments.includes(doc.id)}
                          onCheckedChange={() => handleSelectDocument(doc.id)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-800 truncate">{doc.title}</h4>
                            <p className="text-sm text-slate-500 truncate">{doc.author}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {doc.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {doc.tags.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{doc.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="text-xs">
                          {doc.collection}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-slate-600">{doc.size}</td>
                      <td className="p-4">
                        <div
                          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}
                        >
                          {getStatusIcon(doc.status)}
                          <span>{getStatusText(doc.status)}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-600">{doc.lastModified}</td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setPreviewDocument(doc)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Prévisualiser
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Télécharger
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
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Preview Modal */}
        <Dialog open={!!previewDocument} onOpenChange={() => setPreviewDocument(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{previewDocument?.title}</DialogTitle>
              <DialogDescription>Aperçu du document - {previewDocument?.author}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 text-sm text-slate-600">
                <span>Taille: {previewDocument?.size}</span>
                <span>Collection: {previewDocument?.collection}</span>
                <span>Modifié: {previewDocument?.lastModified}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-700">{previewDocument?.preview}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {previewDocument?.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
