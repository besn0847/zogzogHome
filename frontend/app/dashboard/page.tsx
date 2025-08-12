"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Plus,
  FileText,
  MessageSquare,
  FolderOpen,
  TrendingUp,
  Clock,
  Star,
  Filter,
  MoreVertical,
  Eye,
  Download,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import DashboardLayout from "@/components/dashboard-layout"

interface Document {
  id: string
  title: string
  type: string
  size: string
  lastModified: string
  status: "transformed" | "processing" | "error"
  collection: string
  preview: string
}

interface Collection {
  id: string
  name: string
  count: number
  color: string
}

const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Rapport Financier Q4 2024",
    type: "PDF",
    size: "2.4 MB",
    lastModified: "2024-01-15",
    status: "transformed",
    collection: "Finance",
    preview: "Analyse détaillée des performances financières du quatrième trimestre...",
  },
  {
    id: "2",
    title: "Guide Utilisateur v2.1",
    type: "PDF",
    size: "1.8 MB",
    lastModified: "2024-01-14",
    status: "processing",
    collection: "Documentation",
    preview: "Manuel complet d'utilisation de la plateforme DocPDF Manager...",
  },
  {
    id: "3",
    title: "Contrat Partenariat ABC Corp",
    type: "PDF",
    size: "856 KB",
    lastModified: "2024-01-13",
    status: "transformed",
    collection: "Juridique",
    preview: "Accord de partenariat stratégique avec ABC Corporation...",
  },
  {
    id: "4",
    title: "Présentation Produit 2024",
    type: "PDF",
    size: "3.2 MB",
    lastModified: "2024-01-12",
    status: "error",
    collection: "Marketing",
    preview: "Présentation des nouvelles fonctionnalités et roadmap produit...",
  },
]

const mockCollections: Collection[] = [
  { id: "1", name: "Finance", count: 12, color: "bg-blue-500" },
  { id: "2", name: "Documentation", count: 8, color: "bg-emerald-500" },
  { id: "3", name: "Juridique", count: 15, color: "bg-cyan-500" },
  { id: "4", name: "Marketing", count: 6, color: "bg-blue-600" },
]

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)

  const filteredDocuments = mockDocuments.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!selectedCollection || doc.collection === selectedCollection),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "transformed":
        return "bg-emerald-500"
      case "processing":
        return "bg-cyan-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Tableau de bord</h1>
            <p className="text-slate-600 mt-1">Gérez vos documents PDF et explorez avec l'IA</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher dans vos documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-slate-300 focus:border-blue-500"
              />
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau PDF
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Documents</p>
                    <p className="text-2xl font-bold text-blue-800">127</p>
                    <p className="text-xs text-blue-500 mt-1">+12 ce mois</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-600">Collections</p>
                    <p className="text-2xl font-bold text-emerald-800">8</p>
                    <p className="text-xs text-emerald-500 mt-1">2 actives</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <FolderOpen className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-cyan-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-cyan-600">Conversations IA</p>
                    <p className="text-2xl font-bold text-cyan-800">43</p>
                    <p className="text-xs text-cyan-500 mt-1">5 aujourd'hui</p>
                  </div>
                  <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Activité</p>
                    <p className="text-2xl font-bold text-blue-800">89%</p>
                    <p className="text-xs text-blue-500 mt-1">+5% vs hier</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Documents */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-slate-800">Documents récents</CardTitle>
                    <CardDescription>Vos derniers documents transformés</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrer
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredDocuments.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-800 truncate">{doc.title}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-slate-500">{doc.size}</span>
                          <Badge variant="secondary" className="text-xs">
                            {doc.collection}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(doc.status)}`} />
                            <span className="text-xs text-slate-500">{getStatusText(doc.status)}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 truncate">{doc.preview}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {doc.lastModified}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Voir
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
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Collections Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-slate-800">Collections favorites</CardTitle>
                <CardDescription>Accès rapide à vos collections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockCollections.map((collection, index) => (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedCollection === collection.name ? "bg-blue-50 border border-blue-200" : "hover:bg-slate-50"
                    }`}
                    onClick={() =>
                      setSelectedCollection(selectedCollection === collection.name ? null : collection.name)
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${collection.color}`} />
                      <span className="font-medium text-slate-700">{collection.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {collection.count}
                      </Badge>
                      <Star className="w-4 h-4 text-yellow-500" />
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-emerald-50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Chat IA disponible</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Posez des questions sur vos documents et obtenez des réponses instantanées
                </p>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white">
                  Démarrer une conversation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
