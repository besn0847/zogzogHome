"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileText, X, Check, AlertCircle, RefreshCw, Plus, Settings, Eye, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import DashboardLayout from "@/components/dashboard-layout"

interface UploadFile {
  id: string
  file: File
  name: string
  size: string
  sizeBytes: number
  status: "pending" | "uploading" | "processing" | "completed" | "error"
  progress: number
  metadata: {
    collection: string
    tags: string[]
    description: string
    author: string
    category: string
    priority: "low" | "medium" | "high"
  }
  error?: string
  previewUrl?: string
}

const collections = ["Finance", "Documentation", "Juridique", "Marketing", "RH", "Technique"]
const categories = ["Rapport", "Contrat", "Guide", "Présentation", "Analyse", "Procédure"]
const commonTags = ["urgent", "confidentiel", "public", "interne", "archive", "brouillon", "final", "révision"]

export default function UploadPage() {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [globalSettings, setGlobalSettings] = useState({
    collection: "",
    author: "Jean Dupont",
    category: "",
    priority: "medium" as const,
    autoProcess: true,
  })
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const createUploadFile = (file: File): UploadFile => ({
    id: generateId(),
    file,
    name: file.name,
    size: formatFileSize(file.size),
    sizeBytes: file.size,
    status: "pending",
    progress: 0,
    metadata: {
      collection: globalSettings.collection || "Documentation",
      tags: [],
      description: "",
      author: globalSettings.author,
      category: globalSettings.category || "Rapport",
      priority: globalSettings.priority,
    },
  })

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const droppedFiles = Array.from(e.dataTransfer.files)
      const pdfFiles = droppedFiles.filter((file) => file.type === "application/pdf")

      if (pdfFiles.length !== droppedFiles.length) {
        toast({
          title: "Fichiers non supportés",
          description: "Seuls les fichiers PDF sont acceptés",
          variant: "destructive",
        })
      }

      const newFiles = pdfFiles.map(createUploadFile)
      setFiles((prev) => [...prev, ...newFiles])
    },
    [globalSettings, toast],
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const pdfFiles = selectedFiles.filter((file) => file.type === "application/pdf")

    const newFiles = pdfFiles.map(createUploadFile)
    setFiles((prev) => [...prev, ...newFiles])

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const updateFileMetadata = (fileId: string, metadata: Partial<UploadFile["metadata"]>) => {
    setFiles((prev) =>
      prev.map((file) => (file.id === fileId ? { ...file, metadata: { ...file.metadata, ...metadata } } : file)),
    )
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const retryFile = (fileId: string) => {
    setFiles((prev) =>
      prev.map((file) => (file.id === fileId ? { ...file, status: "pending", progress: 0, error: undefined } : file)),
    )
  }

  const startUpload = async (fileId: string) => {
    const file = files.find((f) => f.id === fileId)
    if (!file) return

    setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "uploading", progress: 0 } : f)))

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) => {
          if (f.id === fileId && f.status === "uploading") {
            const newProgress = Math.min(f.progress + Math.random() * 15, 100)
            if (newProgress >= 100) {
              clearInterval(uploadInterval)
              // Start processing phase
              setTimeout(() => startProcessing(fileId), 500)
              return { ...f, progress: 100, status: "processing" }
            }
            return { ...f, progress: newProgress }
          }
          return f
        }),
      )
    }, 200)
  }

  const startProcessing = async (fileId: string) => {
    // Simulate processing with random success/failure
    const processingTime = 2000 + Math.random() * 3000
    const willSucceed = Math.random() > 0.2 // 80% success rate

    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: willSucceed ? "completed" : "error",
                progress: 100,
                error: willSucceed ? undefined : "Erreur lors de la transformation du document",
              }
            : f,
        ),
      )

      if (willSucceed) {
        toast({
          title: "Document transformé",
          description: "Le document a été traité avec succès",
        })
      }
    }, processingTime)
  }

  const startAllUploads = () => {
    const pendingFiles = files.filter((f) => f.status === "pending")
    pendingFiles.forEach((file) => startUpload(file.id))
  }

  const getStatusIcon = (status: UploadFile["status"]) => {
    switch (status) {
      case "pending":
        return <FileText className="w-5 h-5 text-slate-500" />
      case "uploading":
        return <Upload className="w-5 h-5 text-blue-500" />
      case "processing":
        return <RefreshCw className="w-5 h-5 text-cyan-500 animate-spin" />
      case "completed":
        return <Check className="w-5 h-5 text-emerald-500" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />
    }
  }

  const getStatusColor = (status: UploadFile["status"]) => {
    switch (status) {
      case "pending":
        return "bg-slate-100 text-slate-700"
      case "uploading":
        return "bg-blue-100 text-blue-700"
      case "processing":
        return "bg-cyan-100 text-cyan-700"
      case "completed":
        return "bg-emerald-100 text-emerald-700"
      case "error":
        return "bg-red-100 text-red-700"
    }
  }

  const getStatusText = (status: UploadFile["status"]) => {
    switch (status) {
      case "pending":
        return "En attente"
      case "uploading":
        return "Upload en cours"
      case "processing":
        return "Transformation"
      case "completed":
        return "Terminé"
      case "error":
        return "Erreur"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "low":
        return "bg-green-100 text-green-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const completedCount = files.filter((f) => f.status === "completed").length
  const errorCount = files.filter((f) => f.status === "error").length
  const processingCount = files.filter((f) => f.status === "uploading" || f.status === "processing").length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Upload de Documents</h1>
            <p className="text-slate-600 mt-1">Importez vos fichiers PDF et configurez leurs métadonnées</p>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={() => fileInputRef.current?.click()} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Sélectionner des fichiers
            </Button>
            <Button
              onClick={startAllUploads}
              disabled={files.filter((f) => f.status === "pending").length === 0}
              className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600"
            >
              <Upload className="w-4 h-4 mr-2" />
              Démarrer l'upload
            </Button>
          </div>
        </div>

        {/* Statistics */}
        {files.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total</p>
                    <p className="text-2xl font-bold text-slate-800">{files.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-slate-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-600">Terminés</p>
                    <p className="text-2xl font-bold text-emerald-800">{completedCount}</p>
                  </div>
                  <Check className="w-8 h-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-cyan-600">En cours</p>
                    <p className="text-2xl font-bold text-cyan-800">{processingCount}</p>
                  </div>
                  <RefreshCw className="w-8 h-8 text-cyan-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Erreurs</p>
                    <p className="text-2xl font-bold text-red-800">{errorCount}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Zone */}
          <div className="lg:col-span-2 space-y-6">
            {/* Drag & Drop Zone */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    isDragOver ? "border-blue-400 bg-blue-50" : "border-slate-300 hover:border-slate-400"
                  }`}
                >
                  <motion.div animate={{ scale: isDragOver ? 1.05 : 1 }} transition={{ duration: 0.2 }}>
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                      {isDragOver ? "Déposez vos fichiers ici" : "Glissez-déposez vos fichiers PDF"}
                    </h3>
                    <p className="text-slate-600 mb-4">ou cliquez pour sélectionner des fichiers</p>
                    <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="mb-4">
                      Parcourir les fichiers
                    </Button>
                    <p className="text-sm text-slate-500">Formats supportés: PDF • Taille max: 50MB par fichier</p>
                  </motion.div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Files List */}
            {files.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800">Fichiers ({files.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AnimatePresence>
                    {files.map((file, index) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-slate-200 rounded-lg p-4 space-y-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            {getStatusIcon(file.status)}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-slate-800 truncate">{file.name}</h4>
                              <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600">
                                <span>{file.size}</span>
                                <Badge variant="secondary" className={getPriorityColor(file.metadata.priority)}>
                                  {file.metadata.priority}
                                </Badge>
                                <Badge variant="outline">{file.metadata.collection}</Badge>
                              </div>
                              {file.metadata.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {file.metadata.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(file.status)}>{getStatusText(file.status)}</Badge>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Settings className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Configuration - {file.name}</DialogTitle>
                                  <DialogDescription>Configurez les métadonnées de ce document</DialogDescription>
                                </DialogHeader>
                                <FileMetadataForm
                                  file={file}
                                  onUpdate={(metadata) => updateFileMetadata(file.id, metadata)}
                                />
                              </DialogContent>
                            </Dialog>

                            {file.status === "error" && (
                              <Button variant="ghost" size="sm" onClick={() => retryFile(file.id)}>
                                <RotateCcw className="w-4 h-4" />
                              </Button>
                            )}

                            <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {(file.status === "uploading" || file.status === "processing") && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">
                                {file.status === "uploading" ? "Upload" : "Transformation"}: {Math.round(file.progress)}
                                %
                              </span>
                              <span className="text-slate-500">
                                {file.status === "processing" ? "Analyse en cours..." : "Envoi en cours..."}
                              </span>
                            </div>
                            <Progress value={file.progress} className="h-2" />
                          </div>
                        )}

                        {file.error && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <AlertCircle className="w-4 h-4 text-red-500" />
                              <span className="text-sm text-red-700">{file.error}</span>
                            </div>
                          </div>
                        )}

                        {file.status === "completed" && (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Check className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm text-emerald-700">Document transformé avec succès</span>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                Voir
                              </Button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Global Settings */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">Paramètres globaux</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="global-collection">Collection par défaut</Label>
                  <Select
                    value={globalSettings.collection}
                    onValueChange={(value) => setGlobalSettings((prev) => ({ ...prev, collection: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une collection" />
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
                  <Label htmlFor="global-author">Auteur par défaut</Label>
                  <Input
                    id="global-author"
                    value={globalSettings.author}
                    onChange={(e) => setGlobalSettings((prev) => ({ ...prev, author: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="global-category">Catégorie par défaut</Label>
                  <Select
                    value={globalSettings.category}
                    onValueChange={(value) => setGlobalSettings((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="global-priority">Priorité par défaut</Label>
                  <Select
                    value={globalSettings.priority}
                    onValueChange={(value: "low" | "medium" | "high") =>
                      setGlobalSettings((prev) => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Basse</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Haute</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="auto-process"
                    checked={globalSettings.autoProcess}
                    onCheckedChange={(checked) => setGlobalSettings((prev) => ({ ...prev, autoProcess: !!checked }))}
                  />
                  <Label htmlFor="auto-process" className="text-sm">
                    Traitement automatique après upload
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-emerald-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <RefreshCw className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Traitement IA</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Vos documents seront automatiquement analysés et indexés par notre IA
                  </p>
                  <div className="space-y-2 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span>Extraction de texte</span>
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Analyse sémantique</span>
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Génération de résumé</span>
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Indexation recherche</span>
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// File Metadata Form Component
function FileMetadataForm({
  file,
  onUpdate,
}: {
  file: UploadFile
  onUpdate: (metadata: Partial<UploadFile["metadata"]>) => void
}) {
  const [metadata, setMetadata] = useState(file.metadata)
  const [newTag, setNewTag] = useState("")

  const handleUpdate = (field: keyof UploadFile["metadata"], value: any) => {
    const updated = { ...metadata, [field]: value }
    setMetadata(updated)
    onUpdate({ [field]: value })
  }

  const addTag = () => {
    if (newTag.trim() && !metadata.tags.includes(newTag.trim())) {
      const updatedTags = [...metadata.tags, newTag.trim()]
      handleUpdate("tags", updatedTags)
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    const updatedTags = metadata.tags.filter((tag) => tag !== tagToRemove)
    handleUpdate("tags", updatedTags)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="collection">Collection</Label>
          <Select value={metadata.collection} onValueChange={(value) => handleUpdate("collection", value)}>
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
          <Label htmlFor="category">Catégorie</Label>
          <Select value={metadata.category} onValueChange={(value) => handleUpdate("category", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="author">Auteur</Label>
          <Input id="author" value={metadata.author} onChange={(e) => handleUpdate("author", e.target.value)} />
        </div>

        <div>
          <Label htmlFor="priority">Priorité</Label>
          <Select
            value={metadata.priority}
            onValueChange={(value: "low" | "medium" | "high") => handleUpdate("priority", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Basse</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="high">Haute</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={metadata.description}
          onChange={(e) => handleUpdate("description", e.target.value)}
          placeholder="Description du document..."
          rows={3}
        />
      </div>

      <div>
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {metadata.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Ajouter un tag..."
            onKeyPress={(e) => e.key === "Enter" && addTag()}
          />
          <Button onClick={addTag} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {commonTags
            .filter((tag) => !metadata.tags.includes(tag))
            .map((tag) => (
              <Button
                key={tag}
                variant="ghost"
                size="sm"
                onClick={() => handleUpdate("tags", [...metadata.tags, tag])}
                className="text-xs h-6"
              >
                + {tag}
              </Button>
            ))}
        </div>
      </div>
    </div>
  )
}
