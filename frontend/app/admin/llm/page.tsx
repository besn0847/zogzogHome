"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Brain,
  Settings,
  Zap,
  DollarSign,
  BarChart3,
  TestTube,
  Save,
  RefreshCw,
  Copy,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit,
  Play,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import DashboardLayout from "@/components/dashboard-layout"

interface LLMModel {
  id: string
  name: string
  provider: string
  status: "active" | "inactive" | "testing"
  cost: number
  costUnit: string
  responseTime: number
  accuracy: number
  usage: number
  usageLimit: number
  apiKey: string
  parameters: {
    temperature: number
    maxTokens: number
    topP: number
    frequencyPenalty: number
    presencePenalty: number
  }
}

interface UsageMetric {
  date: string
  requests: number
  cost: number
  avgResponseTime: number
  errorRate: number
}

const mockModels: LLMModel[] = [
  {
    id: "1",
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    status: "active",
    cost: 0.03,
    costUnit: "$/1K tokens",
    responseTime: 1200,
    accuracy: 95.8,
    usage: 15420,
    usageLimit: 50000,
    apiKey: "sk-proj-*********************",
    parameters: {
      temperature: 0.7,
      maxTokens: 4096,
      topP: 0.9,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
    },
  },
  {
    id: "2",
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
    status: "active",
    cost: 0.015,
    costUnit: "$/1K tokens",
    responseTime: 980,
    accuracy: 94.2,
    usage: 8750,
    usageLimit: 30000,
    apiKey: "sk-ant-*********************",
    parameters: {
      temperature: 0.8,
      maxTokens: 4096,
      topP: 0.95,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1,
    },
  },
  {
    id: "3",
    name: "Gemini Pro",
    provider: "Google",
    status: "testing",
    cost: 0.0025,
    costUnit: "$/1K tokens",
    responseTime: 1450,
    accuracy: 92.1,
    usage: 2340,
    usageLimit: 10000,
    apiKey: "AIza*********************",
    parameters: {
      temperature: 0.6,
      maxTokens: 2048,
      topP: 0.8,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
    },
  },
]

const mockUsageData: UsageMetric[] = [
  { date: "2024-01-15", requests: 1250, cost: 45.3, avgResponseTime: 1100, errorRate: 0.2 },
  { date: "2024-01-14", requests: 1180, cost: 42.15, avgResponseTime: 1150, errorRate: 0.1 },
  { date: "2024-01-13", requests: 1320, cost: 48.9, avgResponseTime: 1080, errorRate: 0.3 },
  { date: "2024-01-12", requests: 1090, cost: 39.6, avgResponseTime: 1200, errorRate: 0.1 },
  { date: "2024-01-11", requests: 1410, cost: 52.2, avgResponseTime: 1050, errorRate: 0.2 },
]

export default function LLMConfigPage() {
  const [selectedTab, setSelectedTab] = useState("models")
  const [selectedModel, setSelectedModel] = useState<LLMModel | null>(null)
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false)
  const [testPrompt, setTestPrompt] = useState("")
  const [testResult, setTestResult] = useState("")
  const [isTesting, setIsTesting] = useState(false)
  const [showApiKeys, setShowApiKeys] = useState(false)
  const [models, setModels] = useState<LLMModel[]>(mockModels)

  const handleSaveModel = (model: LLMModel) => {
    setModels(models.map((m) => (m.id === model.id ? model : m)))
    setSelectedModel(null)
  }

  const handleTestModel = async (model: LLMModel) => {
    setIsTesting(true)
    setSelectedModel(model)
    setIsTestDialogOpen(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setTestResult("Test réussi ! Le modèle répond correctement avec une latence de " + model.responseTime + "ms.")
    setIsTesting(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-emerald-700 bg-emerald-100"
      case "inactive":
        return "text-slate-700 bg-slate-100"
      case "testing":
        return "text-blue-700 bg-blue-100"
      default:
        return "text-slate-700 bg-slate-100"
    }
  }

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "OpenAI":
        return "text-green-700 bg-green-100"
      case "Anthropic":
        return "text-orange-700 bg-orange-100"
      case "Google":
        return "text-blue-700 bg-blue-100"
      default:
        return "text-slate-700 bg-slate-100"
    }
  }

  const totalCost = mockUsageData.reduce((sum, day) => sum + day.cost, 0)
  const totalRequests = mockUsageData.reduce((sum, day) => sum + day.requests, 0)
  const avgResponseTime = mockUsageData.reduce((sum, day) => sum + day.avgResponseTime, 0) / mockUsageData.length
  const avgErrorRate = mockUsageData.reduce((sum, day) => sum + day.errorRate, 0) / mockUsageData.length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center">
              <Brain className="w-8 h-8 mr-3 text-blue-600" />
              Configuration LLM
            </h1>
            <p className="text-slate-600 mt-1">Gestion et configuration des modèles d'intelligence artificielle</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exporter Config
            </Button>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Importer Config
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Modèle
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Coût Total (7j)</p>
                    <p className="text-3xl font-bold text-slate-800">${totalCost.toFixed(2)}</p>
                    <p className="text-xs text-emerald-600 flex items-center mt-1">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      -5% vs semaine précédente
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Requêtes (7j)</p>
                    <p className="text-3xl font-bold text-slate-800">{totalRequests.toLocaleString()}</p>
                    <p className="text-xs text-emerald-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12% vs semaine précédente
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Temps Réponse Moy.</p>
                    <p className="text-3xl font-bold text-slate-800">{Math.round(avgResponseTime)}ms</p>
                    <p className="text-xs text-emerald-600 flex items-center mt-1">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      -8% vs semaine précédente
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Taux d'Erreur</p>
                    <p className="text-3xl font-bold text-slate-800">{(avgErrorRate * 100).toFixed(1)}%</p>
                    <p className="text-xs text-emerald-600 flex items-center mt-1">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      -2% vs semaine précédente
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="models">Modèles</TabsTrigger>
            <TabsTrigger value="usage">Utilisation</TabsTrigger>
            <TabsTrigger value="testing">Tests</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          {/* Models Tab */}
          <TabsContent value="models" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-slate-800">Modèles Configurés</h2>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="show-keys" className="text-sm">
                    Afficher les clés API
                  </Label>
                  <Switch id="show-keys" checked={showApiKeys} onCheckedChange={setShowApiKeys} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {models.map((model, index) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{model.name}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getProviderColor(model.provider)}>{model.provider}</Badge>
                            <Badge className={getStatusColor(model.status)}>{model.status}</Badge>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedModel(model)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Configurer
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTestModel(model)}>
                              <TestTube className="w-4 h-4 mr-2" />
                              Tester
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="w-4 h-4 mr-2" />
                              Dupliquer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Performance Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500">Précision</p>
                          <p className="text-lg font-semibold text-slate-800">{model.accuracy}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Temps Réponse</p>
                          <p className="text-lg font-semibold text-slate-800">{model.responseTime}ms</p>
                        </div>
                      </div>

                      {/* Usage Progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Utilisation</span>
                          <span>
                            {model.usage.toLocaleString()} / {model.usageLimit.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={(model.usage / model.usageLimit) * 100} className="h-2" />
                      </div>

                      {/* Cost */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Coût</span>
                        <span className="text-sm font-medium">
                          {model.cost} {model.costUnit}
                        </span>
                      </div>

                      {/* API Key */}
                      <div>
                        <Label className="text-xs text-slate-500">Clé API</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            type={showApiKeys ? "text" : "password"}
                            value={model.apiKey}
                            readOnly
                            className="text-xs"
                          />
                          <Button variant="ghost" size="sm" onClick={() => setShowApiKeys(!showApiKeys)}>
                            {showApiKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => setSelectedModel(model)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Configurer
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleTestModel(model)}>
                          <TestTube className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  Utilisation des Modèles (7 derniers jours)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Requêtes</TableHead>
                      <TableHead>Coût</TableHead>
                      <TableHead>Temps Réponse Moy.</TableHead>
                      <TableHead>Taux d'Erreur</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsageData.map((day, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{day.date}</TableCell>
                        <TableCell>{day.requests.toLocaleString()}</TableCell>
                        <TableCell>${day.cost.toFixed(2)}</TableCell>
                        <TableCell>{day.avgResponseTime}ms</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              day.errorRate > 0.2 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                            }
                          >
                            {(day.errorRate * 100).toFixed(1)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {models
                .filter((m) => m.status === "active")
                .map((model) => (
                  <Card key={model.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Utilisation</span>
                          <span className="text-sm font-medium">{model.usage.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Coût estimé</span>
                          <span className="text-sm font-medium">${((model.usage / 1000) * model.cost).toFixed(2)}</span>
                        </div>
                        <Progress value={(model.usage / model.usageLimit) * 100} className="h-2" />
                        <div className="text-xs text-slate-500 text-center">
                          {((model.usage / model.usageLimit) * 100).toFixed(1)}% du quota utilisé
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Testing Tab */}
          <TabsContent value="testing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TestTube className="w-5 h-5 mr-2 text-emerald-600" />
                  Test des Modèles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="test-prompt">Prompt de test</Label>
                  <Textarea
                    id="test-prompt"
                    placeholder="Entrez votre prompt de test ici..."
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                    className="mt-2"
                    rows={4}
                  />
                </div>
                <div className="flex space-x-2">
                  {models.map((model) => (
                    <Button
                      key={model.id}
                      variant={model.status === "active" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTestModel(model)}
                      disabled={!testPrompt || isTesting}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Tester {model.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Test Results */}
            <Card>
              <CardHeader>
                <CardTitle>Résultats des Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600 mb-2">Dernier test effectué</p>
                    <p className="text-sm">GPT-4 Turbo - Temps de réponse: 1.2s - Précision: 95.8%</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600 mb-2">Comparaison des performances</p>
                    <div className="space-y-2">
                      {models
                        .filter((m) => m.status === "active")
                        .map((model) => (
                          <div key={model.id} className="flex items-center justify-between">
                            <span className="text-sm">{model.name}</span>
                            <div className="flex items-center space-x-4">
                              <span className="text-xs text-slate-500">{model.responseTime}ms</span>
                              <Progress value={model.accuracy} className="w-20 h-2" />
                              <span className="text-xs text-slate-500">{model.accuracy}%</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-slate-600" />
                  Paramètres Globaux
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Modèle par défaut</Label>
                      <Select defaultValue="gpt-4-turbo">
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                          <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                          <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Limite de coût mensuelle ($)</Label>
                      <Input type="number" defaultValue="500" className="mt-2" />
                    </div>
                    <div>
                      <Label>Timeout par défaut (ms)</Label>
                      <Input type="number" defaultValue="30000" className="mt-2" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Basculement automatique</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Logs détaillés</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Alertes de coût</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Cache des réponses</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex space-x-4">
                  <Button>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Réinitialiser
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Model Configuration Dialog */}
        <Dialog open={!!selectedModel} onOpenChange={() => setSelectedModel(null)}>
          <DialogContent className="max-w-2xl">
            {selectedModel && (
              <>
                <DialogHeader>
                  <DialogTitle>Configuration - {selectedModel.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Température</Label>
                      <div className="mt-2">
                        <Slider
                          value={[selectedModel.parameters.temperature]}
                          onValueChange={(value) =>
                            setSelectedModel({
                              ...selectedModel,
                              parameters: { ...selectedModel.parameters, temperature: value[0] },
                            })
                          }
                          max={2}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="text-center text-sm text-slate-500 mt-1">
                          {selectedModel.parameters.temperature}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Max Tokens</Label>
                      <Input
                        type="number"
                        value={selectedModel.parameters.maxTokens}
                        onChange={(e) =>
                          setSelectedModel({
                            ...selectedModel,
                            parameters: { ...selectedModel.parameters, maxTokens: Number.parseInt(e.target.value) },
                          })
                        }
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Top P</Label>
                      <div className="mt-2">
                        <Slider
                          value={[selectedModel.parameters.topP]}
                          onValueChange={(value) =>
                            setSelectedModel({
                              ...selectedModel,
                              parameters: { ...selectedModel.parameters, topP: value[0] },
                            })
                          }
                          max={1}
                          step={0.05}
                          className="w-full"
                        />
                        <div className="text-center text-sm text-slate-500 mt-1">{selectedModel.parameters.topP}</div>
                      </div>
                    </div>
                    <div>
                      <Label>Frequency Penalty</Label>
                      <div className="mt-2">
                        <Slider
                          value={[selectedModel.parameters.frequencyPenalty]}
                          onValueChange={(value) =>
                            setSelectedModel({
                              ...selectedModel,
                              parameters: { ...selectedModel.parameters, frequencyPenalty: value[0] },
                            })
                          }
                          min={-2}
                          max={2}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="text-center text-sm text-slate-500 mt-1">
                          {selectedModel.parameters.frequencyPenalty}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Clé API</Label>
                    <Input
                      type="password"
                      value={selectedModel.apiKey}
                      onChange={(e) => setSelectedModel({ ...selectedModel, apiKey: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedModel(null)}>
                    Annuler
                  </Button>
                  <Button onClick={() => handleSaveModel(selectedModel)}>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Test Dialog */}
        <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Test du Modèle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {isTesting ? (
                <div className="text-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
                  />
                  <p className="text-slate-600">Test en cours...</p>
                </div>
              ) : testResult ? (
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                    <span className="font-medium text-emerald-800">Test réussi</span>
                  </div>
                  <p className="text-sm text-emerald-700">{testResult}</p>
                </div>
              ) : null}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTestDialogOpen(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
