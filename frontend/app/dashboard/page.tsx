"use client"

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import DashboardLayout from '@/components/dashboard-layout';
import DocumentUploadModal from '@/components/document-upload-modal';
import { useDashboard, type FormattedDocument, type FormattedCollection } from '@/hooks/useDashboard';

// Re-export types from useDashboard for local use
type Document = FormattedDocument;
type Collection = FormattedCollection;

export default function DashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  
  const {
    documents,
    collections,
    stats,
    isLoading,
    isLoadingDocuments,
    isLoadingCollections,
    isLoadingStats,
    error,
    documentsError,
    collectionsError,
    statsError,
    handleSearch,
    handleCollectionSelect,
    getStatusColor,
    getStatusText,
  } = useDashboard();

  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

  // Handle collection selection
  const handleCollectionClick = (collectionId: string | null) => {
    setSelectedCollection(collectionId);
    handleCollectionSelect(collectionId);
  };

  // Filter documents based on search and collection
  const filteredDocuments = useMemo(() => 
    documents.filter((doc: Document) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.preview && doc.preview.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
    [documents, searchQuery]
  );

  const recentDocuments = useMemo(
    () => [...filteredDocuments].sort(
      (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    ),
    [filteredDocuments]
  );



  return (
    <DashboardLayout>
      <div className="space-y-6">
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
                placeholder="Rechercher des documents..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="max-w-sm"
                disabled={isLoadingDocuments}
              />
            </div>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white"
              onClick={() => router.push('/upload')}
            >
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
                    <p className="text-2xl font-bold text-blue-800">{stats?.totalDocuments || 0}</p>
                    <p className="text-xs text-blue-500 mt-1">{stats?.documentsThisMonth || 0} ce mois</p>
                  </div>
                  <div 
                    className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors"
                    onClick={() => router.push('/documents')}
                  >
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
                    <p className="text-2xl font-bold text-emerald-800">{stats?.totalCollections || 0}</p>
                    <p className="text-xs text-emerald-500 mt-1">{stats?.collectionsThisMonth || 0} nouvelles</p>
                  </div>
                  <div 
                    className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center cursor-pointer hover:bg-emerald-600 transition-colors"
                    onClick={() => router.push('/collections')}
                  >
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
                    <p className="text-2xl font-bold text-cyan-800">{stats?.totalConversations || 0}</p>
                    <p className="text-xs text-cyan-500 mt-1">{stats?.conversationsThisMonth || 0} ce mois</p>
                  </div>
                  <div 
                    className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center cursor-pointer hover:bg-cyan-600 transition-colors"
                    onClick={() => router.push('/chat')}
                  >
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
                    <p className="text-sm font-medium text-blue-600">Stockage utilisé</p>
                    <p className="text-2xl font-bold text-blue-800">{stats?.storageUsed || '0 MB'}</p>
                    <p className="text-xs text-blue-500 mt-1">{stats?.storageLimit || '0 MB'} au total</p>
                  </div>
                  <div 
                    className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
                    onClick={() => router.push('/admin')}
                  >
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
              {isLoadingDocuments ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  <span>Chargement des documents...</span>
                </div>
              ) : documentsError ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="mb-4 h-12 w-12 text-destructive" />
                  <h3 className="mb-1 text-lg font-medium">Erreur de chargement</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Impossible de charger les documents. Veuillez réessayer.
                  </p>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Réessayer
                  </Button>
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-1 text-lg font-medium">Aucun document trouvé</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery || selectedCollection
                      ? "Aucun document ne correspond à vos critères de recherche."
                      : "Commencez par ajouter votre premier document."}
                  </p>
                  <Button className="mt-4" onClick={() => setUploadModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau document
                  </Button>
                </div>
              ) : (
                <CardContent className="space-y-4">
                  {recentDocuments.slice(0, 5).map((doc, index) => (
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
              )}
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
                {collections.map((collection, index) => (
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
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white"
                  onClick={() => router.push('/chat')}
                >
                  Démarrer une conversation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Document Upload Modal */}
      <DocumentUploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        collections={collections}
      />
    </DashboardLayout>
  )
}
