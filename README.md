# DocPDF Manager 📄

Une solution moderne et intelligente pour transformer, organiser et interagir avec des documents PDF en utilisant l'IA et la recherche sémantique.

## 🎯 Vision

DocPDF Manager offre une plateforme complète pour la gestion intelligente de documents PDF. En utilisant **Docling** pour la conversion PDF vers Markdown et des technologies d'IA avancées, l'application permet aux utilisateurs de créer une bibliothèque de documents intelligente et interactive.

## ✨ Fonctionnalités principales

### 🔄 Transformation automatique
- Conversion de documents PDF en format Markdown structuré via Docling
- Extraction automatique des métadonnées (auteur, sujet, mots-clés)
- Préservation de la structure et du formatage original

### 🔍 Recherche intelligente
- Recherche sémantique avancée grâce aux embeddings vectoriels (Qdrant)
- Recherche par contenu, métadonnées ou similarité de sens
- Filtrage par collections, tags et statut de traitement

### 🤖 Interaction IA
- Chat contextuel avec vos documents via LLM
- Génération de résumés automatiques personnalisables
- Extraction d'insights et points clés
- Support de multiples LLM (OpenAI, Anthropic, Azure)

### 👥 Collaboration
- Système de collections partagées
- Permissions granulaires (propriétaire, éditeur, lecteur)
- Commentaires et annotations collaboratives
- Partage sécurisé de documents

### 🎨 Interface moderne
- Interface utilisateur intuitive avec Tailwind CSS
- Design responsive adapté à tous les écrans
- Thème clair/sombre
- Drag & drop pour l'upload de fichiers

## 🏗️ Architecture technique

### Stack technologique
- **Frontend** : NextJS 14 avec Tailwind CSS
- **Backend** : NextJS API Routes
- **Base de données** : MongoDB pour les métadonnées
- **Recherche vectorielle** : Qdrant pour les embeddings
- **Cache** : Redis pour les sessions et cache
- **Transformation** : Service Docling (Python/FastAPI)
- **Conteneurisation** : Docker & Docker Compose

### Structure du projet
```
docpdf-manager/
├── frontend/          # Interface utilisateur NextJS
├── backend/           # API NextJS avec routes
├── docling-service/   # Service de conversion Python
├── scripts/           # Scripts de déploiement et backup
├── nginx/            # Configuration reverse proxy
├── docker-compose.yml # Orchestration des services
└── .env.example      # Variables d'environnement
```

## 🚀 Installation et démarrage

### Prérequis
- Docker et Docker Compose
- Node.js 18+ (pour le développement local)
- Python 3.11+ (pour le service Docling)

### Installation rapide

1. **Cloner le repository**
```bash
git clone <repository-url>
cd docpdf-manager
```

2. **Configuration de l'environnement**
```bash
cp .env.example .env
# Éditer .env avec vos configurations
```

3. **Installation et démarrage**
```bash
# Configuration initiale
./scripts/setup.sh

# Démarrage complet
docker-compose up -d
```

4. **Accès à l'application**
- Frontend : http://localhost:3000
- Backend API : http://localhost:3001
- Service Docling : http://localhost:8000

### Développement local

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Service Docling
```bash
cd docling-service
pip install -r requirements.txt
python main.py
```

## 🧪 Tests

### Tests du backend
```bash
cd backend
npm test                # Tests unitaires
npm run test:coverage   # Tests avec couverture
```

### Tests du frontend
```bash
cd frontend
npm test                # Tests unitaires
npm run test:e2e        # Tests end-to-end
```

## 📋 Utilisation

### 1. Création d'un compte
- Accédez à l'interface web
- Créez un compte utilisateur ou administrateur
- Configurez vos préférences (langue, thème, LLM par défaut)

### 2. Upload de documents
- Glissez-déposez vos fichiers PDF
- Organisez-les en collections
- Ajoutez des tags pour faciliter la recherche

### 3. Recherche et navigation
- Utilisez la barre de recherche pour trouver vos documents
- Explorez par collections ou tags
- Utilisez la recherche sémantique pour des requêtes complexes

### 4. Interaction IA
- Chattez avec vos documents pour poser des questions
- Générez des résumés automatiques
- Extrayez des insights et points clés

## 🔧 Configuration

### Variables d'environnement principales
```bash
# Base de données
MONGODB_URI=mongodb://user:pass@mongodb:27017/docpdf
QDRANT_URL=http://qdrant:6333
REDIS_URL=redis://redis:6379

# Authentification
JWT_SECRET=your-secret-key

# LLM APIs
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key

# Services
DOCLING_SERVICE_URL=http://docling-service:8000
```

### Personnalisation
- Modifiez les thèmes dans `frontend/src/app/globals.css`
- Ajoutez de nouveaux LLM dans `backend/src/lib/llm/`
- Configurez Nginx dans `nginx/nginx.conf`

## 🛠️ Scripts utiles

```bash
# Configuration initiale
./scripts/setup.sh

# Déploiement
./scripts/deploy.sh [development|production]

# Sauvegarde
./scripts/backup.sh [destination]

# Logs en temps réel
docker-compose logs -f

# Arrêt des services
docker-compose down
```

## 🔒 Sécurité

- Authentification JWT avec tokens de refresh
- Système de permissions granulaire (RBAC)
- Rate limiting sur les API
- Validation et sanitisation des entrées
- Chiffrement des données sensibles
- Isolation des services via Docker

## 📊 Monitoring

### Health checks
- `/api/health` - Santé du backend
- `http://localhost:8000/health` - Santé du service Docling
- Vérification automatique des bases de données

### Métriques
- Utilisation des ressources Docker
- Performance des requêtes MongoDB
- Temps de traitement Docling
- Utilisation des LLM et coûts

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

### Standards de code
- ESLint pour JavaScript/TypeScript
- Black pour Python
- Tests unitaires obligatoires
- Documentation des API

## 📝 Roadmap

### Version 1.1
- [ ] Intégration avec plus de LLM (Claude, Gemini)
- [ ] Export vers différents formats (Word, HTML)
- [ ] API webhooks pour intégrations externes
- [ ] Interface mobile dédiée

### Version 1.2
- [ ] Reconnaissance optique de caractères (OCR)
- [ ] Traduction automatique de documents
- [ ] Workflow d'approbation de documents
- [ ] Analytics avancées et rapports

## 🐛 Signaler un bug

Utilisez les [GitHub Issues](https://github.com/your-repo/issues) pour signaler des bugs ou demander des fonctionnalités.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Équipe

- **Architecture** : Inspirée de [DocMost](https://github.com/docmost/docmost)
- **Conversion PDF** : Powered by [Docling](https://github.com/DS4SD/docling)
- **Recherche vectorielle** : [Qdrant](https://qdrant.tech/)

---

⭐ **N'hésitez pas à donner une étoile si ce projet vous plaît !**
