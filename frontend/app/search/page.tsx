"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  Download,
  Share2,
  Clock,
  Star,
  FileText,
  Tag,
  Calendar,
  Zap,
  BookOpen,
  Eye,
  MoreHorizontal,
  History,
  Bookmark,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import DashboardLayout from "@/components/dashboard-layout"

interface SearchResult {
  id: string
  title: string
  content: string
  author: string
  date: string
  collection: string
  tags: string[]
  relevanceScore: number
  type: "document" | "note" | "conversation"
  status: "processed" | "processing" | "error"
  size: string
  highlights: string[]
}

const mockResults: SearchResult[] = [
  {
    id: "1",
    title: "Guide d'implémentation IA",
    content:
      "Ce document détaille les meilleures pratiques pour l'implémentation de solutions d'intelligence artificielle...",
    author: "Marie Dubois",
    date: "2024-01-15",
    collection: "Projets IA",
    tags: ["IA", "Machine Learning", "Guide"],
    relevanceScore: 95,
    type: "document",
    status: "processed",
    size: "2.4 MB",
    highlights: ["intelligence artificielle", "meilleures pratiques", "implémentation"],
  },
  {
    id: "2",
    title: "Stratégie Marketing 2024",
    content: "Plan stratégique pour le développement marketing avec focus sur les canaux digitaux...",
    author: "Pierre Martin",
    date: "2024-01-12",
    collection: "Marketing",
    tags: ["Marketing", "Stratégie", "Digital"],
    relevanceScore: 87,
    type: "document",
    status: "processed",
    size: "1.8 MB",
    highlights: ["stratégie", "marketing", "canaux digitaux"],
  },
  {
    id: "3",
    title: "Notes de réunion - Équipe Produit",
    content: "Discussion sur les nouvelles fonctionnalités et roadmap produit pour Q2...",
    author: "Sophie Chen",
    date: "2024-01-10",
    collection: "Réunions",
    tags: ["Réunion", "Produit", "Roadmap"],
    relevanceScore: 78,
    type: "note",
    status: "processed",
    size: "0.5 MB",
    highlights: ["fonctionnalités", "roadmap", "produit"],
  },
]

const searchHistory = [
  "intelligence artificielle",
  "stratégie marketing",
  "roadmap produit",
  "machine learning",
  "analyse données",
]

const savedSearches = [
  { name: "Documents IA récents", query: "IA type:document date:last-month", count: 12 },
  { name: "Notes d'équipe", query: "réunion type:note author:me", count: 8 },
  { name: "Projets en cours", query: "status:processing", count: 5 },
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"textual" | "semantic">("semantic")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [sortBy, setSortBy] = useState("relevance")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedFilters, setSelectedFilters] = useState({
    collections: [] as string[],
    authors: [] as string[],
    types: [] as string[],
    dateRange: [0, 365] as [number, number],
    relevanceMin: 0,
  })
  const [results, setResults] = useState<SearchResult[]>(mockResults)
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(true)

  const handleSearch = async () => {
    setIsSearching(true)
    // Simulate search delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setResults(
      mockResults.filter(
        (result) =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.content.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    )
    setIsSearching(false)
  }

  const handleSaveSearch = () => {
    // Implementation for saving search
    console.log("Saving search:", searchQuery)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processed":
        return "bg-emerald-100 text-emerald-700"
      case "processing":
        return "bg-blue-100 text-blue-700"
      case "error":
        return "bg-red-100 text-red-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document":
        return FileText
      case "note":
        return BookOpen
      case "conversation":
        return MessageSquare
      default:
        return FileText
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Recherche Avancée</h1>
            <p className="text-slate-600 mt-1">Trouvez vos documents avec la recherche sémantique et textuelle</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSaveSearch}>
                  <Bookmark className="w-4 h-4 mr-2" />
                  Sauvegarder la recherche
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Exporter les résultats
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="w-4 h-4 mr-2" />
                  Partager
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="lg:col-span-1"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Filter className="w-5 h-5 mr-2 text-blue-600" />
                      Filtres
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Search Type */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Type de recherche</Label>
                      <Tabs
                        value={searchType}
                        onValueChange={(value) => setSearchType(value as "textual" | "semantic")}
                      >
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="semantic" className="text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            Sémantique
                          </TabsTrigger>
                          <TabsTrigger value="textual" className="text-xs">
                            <Search className="w-3 h-3 mr-1" />
                            Textuelle
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    <Separator />

                    {/* Collections */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Collections</Label>
                      <div className="space-y-2">
                        {["Projets IA", "Marketing", "Réunions", "Documentation"].map((collection) => (
                          <div key={collection} className="flex items-center space-x-2">
                            <Checkbox id={collection} />
                            <Label htmlFor={collection} className="text-sm">
                              {collection}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Authors */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Auteurs</Label>
                      <div className="space-y-2">
                        {["Marie Dubois", "Pierre Martin", "Sophie Chen"].map((author) => (
                          <div key={author} className="flex items-center space-x-2">
                            <Checkbox id={author} />
                            <Label htmlFor={author} className="text-sm">
                              {author}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Date Range */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Période (jours)</Label>
                      <Slider
                        value={selectedFilters.dateRange}
                        onValueChange={(value) =>
                          setSelectedFilters((prev) => ({ ...prev, dateRange: value as [number, number] }))
                        }
                        max={365}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>Aujourd'hui</span>
                        <span>1 an</span>
                      </div>
                    </div>

                    <Separator />

                    {/* Relevance */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Score de pertinence min.</Label>
                      <Slider
                        value={[selectedFilters.relevanceMin]}
                        onValueChange={(value) => setSelectedFilters((prev) => ({ ...prev, relevanceMin: value[0] }))}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                      <div className="text-center text-xs text-slate-500 mt-1">{selectedFilters.relevanceMin}%</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Search History */}
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <History className="w-5 h-5 mr-2 text-emerald-600" />
                      Historique
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {searchHistory.map((query, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-left h-auto p-2"
                          onClick={() => setSearchQuery(query)}
                        >
                          <Clock className="w-3 h-3 mr-2 text-slate-400" />
                          <span className="text-sm truncate">{query}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Saved Searches */}
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Bookmark className="w-5 h-5 mr-2 text-blue-600" />
                      Recherches sauvées
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {savedSearches.map((saved, index) => (
                        <div
                          key={index}
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{saved.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {saved.count}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 truncate">{saved.query}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            {/* Search Bar */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      placeholder="Rechercher dans vos documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 text-lg"
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="h-12 px-8 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                  >
                    {isSearching ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Rechercher
                      </>
                    )}
                  </Button>
                </div>

                {/* Search Type Indicator */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={searchType === "semantic" ? "default" : "secondary"}
                      className="bg-blue-100 text-blue-700"
                    >
                      {searchType === "semantic" ? (
                        <>
                          <Zap className="w-3 h-3 mr-1" />
                          Recherche sémantique
                        </>
                      ) : (
                        <>
                          <Search className="w-3 h-3 mr-1" />
                          Recherche textuelle
                        </>
                      )}
                    </Badge>
                    {searchQuery && (
                      <span className="text-sm text-slate-600">
                        {results.length} résultat{results.length > 1 ? "s" : ""} pour "{searchQuery}"
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Pertinence</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="title">Titre</SelectItem>
                    <SelectItem value="author">Auteur</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                  {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Results */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
              <AnimatePresence>
                {results.map((result, index) => {
                  const TypeIcon = getTypeIcon(result.type)
                  return (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-lg flex items-center justify-center">
                                <TypeIcon className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-800 hover:text-blue-600 transition-colors">
                                  {result.title}
                                </h3>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge className={getStatusColor(result.status)}>{result.status}</Badge>
                                  <span className="text-xs text-slate-500">•</span>
                                  <span className="text-xs text-slate-500">{result.size}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="text-right">
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-yellow-500" />
                                  <span className="text-sm font-medium">{result.relevanceScore}%</span>
                                </div>
                                <span className="text-xs text-slate-500">pertinence</span>
                              </div>
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
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Partager
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          <p className="text-slate-600 text-sm mb-3 line-clamp-2">{result.content}</p>

                          {/* Highlights */}
                          {result.highlights.length > 0 && (
                            <div className="mb-3">
                              <span className="text-xs font-medium text-slate-500 mb-2 block">
                                Extraits pertinents:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {result.highlights.map((highlight, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200"
                                  >
                                    {highlight}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-emerald-500 text-white">
                                    {result.author
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-slate-600">{result.author}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-slate-500">
                                <Calendar className="w-3 h-3" />
                                <span className="text-xs">{result.date}</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {result.collection}
                              </Badge>
                              {result.tags.map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  <Tag className="w-2 h-2 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* No Results */}
            {results.length === 0 && searchQuery && !isSearching && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">Aucun résultat trouvé</h3>
                <p className="text-slate-500">Essayez de modifier vos critères de recherche ou vos filtres.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
