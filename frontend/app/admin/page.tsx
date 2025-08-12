"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Shield,
  Users,
  FileText,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Download,
  RefreshCw,
  Settings,
  Search,
  MoreHorizontal,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DashboardLayout from "@/components/dashboard-layout"

interface SystemMetric {
  name: string
  value: number
  unit: string
  status: "healthy" | "warning" | "critical"
  trend: "up" | "down" | "stable"
  change: number
}

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user" | "viewer"
  status: "active" | "inactive" | "suspended"
  lastActive: string
  documentsCount: number
  storageUsed: string
}

interface ActivityLog {
  id: string
  user: string
  action: string
  resource: string
  timestamp: string
  status: "success" | "warning" | "error"
  details: string
}

const systemMetrics: SystemMetric[] = [
  { name: "CPU Usage", value: 68, unit: "%", status: "healthy", trend: "up", change: 5 },
  { name: "Memory", value: 82, unit: "%", status: "warning", trend: "up", change: 12 },
  { name: "Storage", value: 45, unit: "%", status: "healthy", trend: "stable", change: 0 },
  { name: "Network", value: 23, unit: "MB/s", status: "healthy", trend: "down", change: -8 },
]

const mockUsers: User[] = [
  {
    id: "1",
    name: "Jean Dupont",
    email: "jean@example.com",
    role: "admin",
    status: "active",
    lastActive: "Il y a 5 min",
    documentsCount: 45,
    storageUsed: "2.3 GB",
  },
  {
    id: "2",
    name: "Marie Dubois",
    email: "marie@example.com",
    role: "user",
    status: "active",
    lastActive: "Il y a 1h",
    documentsCount: 32,
    storageUsed: "1.8 GB",
  },
  {
    id: "3",
    name: "Pierre Martin",
    email: "pierre@example.com",
    role: "user",
    status: "inactive",
    lastActive: "Il y a 2 jours",
    documentsCount: 18,
    storageUsed: "0.9 GB",
  },
]

const mockActivityLogs: ActivityLog[] = [
  {
    id: "1",
    user: "Jean Dupont",
    action: "Document Upload",
    resource: "Guide_IA.pdf",
    timestamp: "Il y a 5 min",
    status: "success",
    details: "Document traité avec succès",
  },
  {
    id: "2",
    user: "Marie Dubois",
    action: "Collection Created",
    resource: "Marketing Digital",
    timestamp: "Il y a 15 min",
    status: "success",
    details: "Nouvelle collection créée",
  },
  {
    id: "3",
    user: "System",
    action: "Backup Failed",
    resource: "Database",
    timestamp: "Il y a 1h",
    status: "error",
    details: "Échec de la sauvegarde automatique",
  },
]

export default function AdminPage() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUserRole, setSelectedUserRole] = useState("all")
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "active":
      case "success":
        return "text-emerald-700 bg-emerald-100"
      case "warning":
      case "inactive":
        return "text-yellow-700 bg-yellow-100"
      case "critical":
      case "suspended":
      case "error":
        return "text-red-700 bg-red-100"
      default:
        return "text-slate-700 bg-slate-100"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "text-purple-700 bg-purple-100"
      case "user":
        return "text-blue-700 bg-blue-100"
      case "viewer":
        return "text-slate-700 bg-slate-100"
      default:
        return "text-slate-700 bg-slate-100"
    }
  }

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedUserRole === "all" || user.role === selectedUserRole
    return matchesSearch && matchesRole
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center">
              <Shield className="w-8 h-8 mr-3 text-blue-600" />
              Administration
            </h1>
            <p className="text-slate-600 mt-1">Gestion et surveillance du système DocPDF</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Actualiser
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Rapport
            </Button>
            <Button>
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
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
                    <p className="text-sm font-medium text-slate-600">Utilisateurs Actifs</p>
                    <p className="text-3xl font-bold text-slate-800">1,247</p>
                    <p className="text-xs text-emerald-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12% ce mois
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
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
                    <p className="text-sm font-medium text-slate-600">Documents Traités</p>
                    <p className="text-3xl font-bold text-slate-800">8,942</p>
                    <p className="text-xs text-emerald-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +8% ce mois
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-emerald-600" />
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
                    <p className="text-sm font-medium text-slate-600">Stockage Utilisé</p>
                    <p className="text-3xl font-bold text-slate-800">2.4 TB</p>
                    <p className="text-xs text-yellow-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +15% ce mois
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                    <HardDrive className="w-6 h-6 text-purple-600" />
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
                    <p className="text-sm font-medium text-slate-600">Requêtes IA</p>
                    <p className="text-3xl font-bold text-slate-800">15,632</p>
                    <p className="text-xs text-emerald-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +23% ce mois
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-100 to-cyan-200 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-cyan-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="system">Système</TabsTrigger>
            <TabsTrigger value="activity">Activité</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Health */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-emerald-600" />
                    État du Système
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {systemMetrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">{metric.name}</span>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(metric.status)}>{metric.status}</Badge>
                          <span className="text-sm text-slate-600">
                            {metric.value}
                            {metric.unit}
                          </span>
                        </div>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                    Alertes Récentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-800">Échec de sauvegarde</p>
                        <p className="text-xs text-red-600">La sauvegarde automatique a échoué à 02:00</p>
                        <p className="text-xs text-red-500 mt-1">Il y a 1 heure</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Utilisation mémoire élevée</p>
                        <p className="text-xs text-yellow-600">La mémoire dépasse 80% d'utilisation</p>
                        <p className="text-xs text-yellow-500 mt-1">Il y a 2 heures</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-emerald-800">Mise à jour terminée</p>
                        <p className="text-xs text-emerald-600">Système mis à jour vers la version 2.1.4</p>
                        <p className="text-xs text-emerald-500 mt-1">Il y a 6 heures</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Processing Queue */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  File de Traitement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">12</div>
                    <div className="text-sm text-blue-600">En attente</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-700">5</div>
                    <div className="text-sm text-yellow-600">En cours</div>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-700">847</div>
                    <div className="text-sm text-emerald-600">Terminés aujourd'hui</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher des utilisateurs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
                <Select value={selectedUserRole} onValueChange={setSelectedUserRole}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les rôles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">Utilisateur</SelectItem>
                    <SelectItem value="viewer">Lecteur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Nouvel Utilisateur
              </Button>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernière Activité</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Stockage</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-xs">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-slate-800">{user.name}</div>
                            <div className="text-sm text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{user.lastActive}</TableCell>
                      <TableCell className="text-sm text-slate-600">{user.documentsCount}</TableCell>
                      <TableCell className="text-sm text-slate-600">{user.storageUsed}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Voir le profil
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Server className="w-5 h-5 mr-2 text-blue-600" />
                    Ressources Serveur
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Cpu className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium">CPU</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">68%</div>
                      <Progress value={68} className="w-24 h-2 mt-1" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Database className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium">RAM</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">82%</div>
                      <Progress value={82} className="w-24 h-2 mt-1" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <HardDrive className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium">Stockage</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">45%</div>
                      <Progress value={45} className="w-24 h-2 mt-1" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Wifi className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium">Réseau</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">23 MB/s</div>
                      <div className="text-xs text-slate-500">Débit actuel</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-emerald-600" />
                    Configuration Système
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Version</span>
                    <Badge variant="outline">v2.1.4</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Dernière sauvegarde</span>
                    <span className="text-sm text-slate-600">Il y a 6h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Maintenance</span>
                    <Badge className="bg-emerald-100 text-emerald-700">Planifiée</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">SSL</span>
                    <Badge className="bg-emerald-100 text-emerald-700">Actif</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" />
                  Journal d'Activité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockActivityLogs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          log.status === "success"
                            ? "bg-emerald-500"
                            : log.status === "warning"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-800">{log.action}</p>
                            <p className="text-sm text-slate-600">{log.resource}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(log.status)}>{log.status}</Badge>
                            <p className="text-xs text-slate-500 mt-1">{log.timestamp}</p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{log.details}</p>
                        <p className="text-xs text-slate-400 mt-1">Par {log.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                    Utilisation Mensuelle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-slate-800">15,632</div>
                      <div className="text-sm text-slate-600">Requêtes ce mois</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Documents</span>
                        <span>8,942</span>
                      </div>
                      <Progress value={75} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Collections</span>
                        <span>1,247</span>
                      </div>
                      <Progress value={60} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Recherches</span>
                        <span>5,458</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-emerald-600" />
                    Répartition Stockage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-slate-800">2.4 TB</div>
                      <div className="text-sm text-slate-600">Stockage total</div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full" />
                          <span className="text-sm">Documents PDF</span>
                        </div>
                        <span className="text-sm font-medium">1.8 TB</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                          <span className="text-sm">Images</span>
                        </div>
                        <span className="text-sm font-medium">0.4 TB</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full" />
                          <span className="text-sm">Autres</span>
                        </div>
                        <span className="text-sm font-medium">0.2 TB</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="w-5 h-5 mr-2 text-purple-600" />
                    Performance IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-slate-800">98.5%</div>
                      <div className="text-sm text-slate-600">Précision moyenne</div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Temps de réponse</span>
                        <span className="text-sm font-medium">1.2s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Requêtes/min</span>
                        <span className="text-sm font-medium">45</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Disponibilité</span>
                        <span className="text-sm font-medium">99.9%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
