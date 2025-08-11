# Application Overview

## Vision
Cette application de gestion de documents PDF offre une solution moderne et intelligente pour transformer, organiser et interagir avec des documents PDF. En utilisant **Docling** pour la conversion PDF vers Markdown et des technologies d'IA avancées, elle permet aux utilisateurs de créer une bibliothèque de documents intelligente et interactive.

## Objectifs Principaux
- **Transformation automatique** : Conversion de documents PDF en format Markdown structuré via Docling
- **Recherche intelligente** : Recherche sémantique avancée grâce aux embeddings vectoriels
- **Interaction IA** : Intégration avec des LLM pour l'analyse et l'interaction avec le contenu
- **Collaboration** : Partage et collaboration sur les documents transformés
- **Organisation** : Système de collections et métadonnées personnalisables

## Architecture Technique

### Stack Technologique
- **Frontend** : NextJS avec serveur Nginx
- **Backend** : NextJS (API Routes)
- **Base de données** : MongoDB pour les métadonnées et configurations
- **Stockage fichiers** : Volume local Docker pour les fichiers PDF originaux
- **Recherche vectorielle** : Qdrant pour les embeddings et recherche sémantique
- **Transformation** : Docling pour la conversion PDF vers Markdown

### Flux de Données
1. **Upload** : L'utilisateur upload un PDF via l'interface NextJS
2. **Stockage** : Le PDF est stocké dans le volume local Docker
3. **Transformation** : Docling convertit le PDF en Markdown structuré
4. **Indexation** : Le contenu est transformé en embeddings et stocké dans Qdrant
5. **Métadonnées** : Les informations du document sont sauvegardées dans MongoDB
6. **Accès** : L'utilisateur peut rechercher, consulter et interagir avec le document

## Fonctionnalités Clés

### Pour les Utilisateurs
- **Upload et transformation** automatique de PDF en Markdown
- **Recherche avancée** par contenu, métadonnées ou similarité sémantique
- **Interaction IA** : questions/réponses, résumés, extraction de points clés
- **Organisation personnelle** : dossiers, collections, annotations
- **Collaboration** : partage, commentaires, collections partagées

### Pour les Administrateurs
- **Gestion des utilisateurs** et permissions
- **Configuration des LLM** et gestion des API keys
- **Administration des collections** et métadonnées
- **Monitoring** du système et de l'utilisation
- **Configuration Docling** pour optimiser les transformations

## Inspiration et Positionnement
L'application s'inspire de **DocMost** pour l'expérience utilisateur et la gestion collaborative, tout en se spécialisant dans :
- La transformation automatique de PDF via Docling
- L'intégration native avec les LLM pour l'analyse de contenu
- La recherche sémantique avancée via Qdrant
- Un focus sur les documents PDF comme source principale

## Valeur Ajoutée
- **Automatisation** : Transformation transparente PDF → Markdown
- **Intelligence** : Recherche sémantique et interaction IA native
- **Flexibilité** : Support de multiples LLM et personnalisation avancée
- **Performance** : Architecture optimisée avec Qdrant pour la recherche vectorielle
- **Collaboration** : Outils de partage et travail en équipe intégrés

# Personas

## 👨‍💼 Administrateur

### Profil
L'**Administrateur** est un utilisateur technique responsable de la gestion globale de l'application. Il possède des compétences en administration système et comprend les enjeux de sécurité, performance et coûts liés aux technologies IA.

### Responsabilités
- **Gestion des utilisateurs** : Création, modification et suppression des comptes
- **Configuration système** : Paramétrage des LLM, API keys, et services externes
- **Administration des données** : Gestion des collections, métadonnées et permissions
- **Monitoring** : Surveillance de l'utilisation, performance et coûts
- **Maintenance** : Configuration Docling, optimisation Qdrant, gestion du stockage

### Objectifs
- Assurer la sécurité et la performance du système
- Contrôler les coûts d'utilisation des LLM
- Maintenir une organisation cohérente des documents
- Optimiser l'expérience utilisateur global

### Compétences Techniques
- Administration de bases de données (MongoDB)
- Compréhension des API et services cloud
- Gestion des conteneurs Docker
- Notions de machine learning et embeddings

### Défis
- Équilibrer performance et coûts des LLM
- Maintenir la sécurité des données sensibles
- Gérer la montée en charge du système
- Former les utilisateurs aux bonnes pratiques

---

## 👤 Utilisateur

### Profil
L'**Utilisateur** est une personne qui utilise l'application pour gérer, analyser et interagir avec des documents PDF dans le cadre de son travail ou de ses projets personnels. Il peut avoir des niveaux de compétences techniques variés.

### Besoins Principaux
- **Transformation de documents** : Convertir facilement des PDF en format exploitable
- **Recherche efficace** : Trouver rapidement l'information dans sa bibliothèque
- **Analyse intelligente** : Utiliser l'IA pour comprendre et extraire des insights
- **Organisation** : Structurer ses documents de manière logique
- **Collaboration** : Partager et travailler en équipe sur les documents

### Objectifs
- Gagner du temps dans la gestion documentaire
- Améliorer la compréhension de contenus complexes
- Faciliter le partage de connaissances
- Créer une base de connaissances personnelle ou d'équipe

### Profils Types

#### 📚 Chercheur/Académique
- Gère de nombreux articles scientifiques et rapports
- Besoin d'analyse approfondie et de citations précises
- Utilise intensivement la recherche sémantique
- Collabore avec des équipes de recherche

#### 💼 Professionnel/Consultant
- Traite des documents clients, contrats, rapports
- Besoin de résumés rapides et d'extraction de points clés
- Partage sélectif avec clients et collègues
- Focus sur l'efficacité et la présentation

#### 🏢 Employé d'entreprise
- Accède à une bibliothèque documentaire partagée
- Utilise principalement la recherche et consultation
- Collabore via commentaires et annotations
- Suit les processus établis par l'organisation

### Compétences Techniques
- **Débutant** : Utilisation basique, interface intuitive nécessaire
- **Intermédiaire** : Comprend les concepts de recherche avancée
- **Avancé** : Peut configurer des métadonnées personnalisées

### Défis
- Adopter de nouveaux outils et workflows
- Comprendre les capacités et limites de l'IA
- Organiser efficacement sa bibliothèque documentaire
- Collaborer avec des utilisateurs de niveaux différents

# User Stories

## Persona : Administrateur

### Gestion des Utilisateurs
- **En tant qu'** administrateur, **je veux** créer, modifier et supprimer des comptes utilisateurs **afin de** contrôler l'accès à l'application
- **En tant qu'** administrateur, **je veux** assigner des rôles et permissions aux utilisateurs **afin de** définir leurs niveaux d'accès
- **En tant qu'** administrateur, **je veux** voir l'activité des utilisateurs **afin de** monitorer l'utilisation de l'application

### Gestion des Collections
- **En tant qu'** administrateur, **je veux** créer et organiser des collections de documents **afin de** structurer le contenu
- **En tant qu'** administrateur, **je veux** définir les permissions d'accès par collection **afin de** contrôler qui peut voir quels documents
- **En tant qu'** administrateur, **je veux** déplacer des documents entre collections **afin de** maintenir une organisation optimale

### Gestion des Métadonnées
- **En tant qu'** administrateur, **je veux** définir des schémas de métadonnées personnalisés **afin d'** adapter l'application aux besoins spécifiques
- **En tant qu'** administrateur, **je veux** modifier en masse les métadonnées des documents **afin de** maintenir la cohérence des données
- **En tant qu'** administrateur, **je veux** exporter les métadonnées **afin de** créer des sauvegardes ou des rapports

### Configuration des LLM
- **En tant qu'** administrateur, **je veux** configurer les connexions aux LLM externes (OpenAI, Anthropic, etc.) **afin de** permettre les fonctionnalités de chat et d'embeddings
- **En tant qu'** administrateur, **je veux** gérer les clés API et les quotas **afin de** contrôler les coûts et l'utilisation
- **En tant qu'** administrateur, **je veux** choisir les modèles disponibles pour les utilisateurs **afin d'** optimiser les performances et les coûts

### Administration Système
- **En tant qu'** administrateur, **je veux** monitorer l'espace de stockage utilisé **afin de** gérer la capacité du système
- **En tant qu'** administrateur, **je veux** configurer les paramètres de transformation Docling **afin d'** optimiser la qualité de conversion PDF vers Markdown
- **En tant qu'** administrateur, **je veux** gérer la base d'embeddings Qdrant **afin d'** optimiser les performances de recherche sémantique

## Persona : Utilisateur

### Gestion des Documents
- **En tant qu'** utilisateur, **je veux** uploader des fichiers PDF **afin de** les ajouter à ma bibliothèque de documents
- **En tant qu'** utilisateur, **je veux** voir la progression de la transformation PDF vers Markdown **afin de** savoir quand mon document sera disponible
- **En tant qu'** utilisateur, **je veux** prévisualiser le document transformé en Markdown **afin de** vérifier la qualité de la conversion
- **En tant qu'** utilisateur, **je veux** télécharger le fichier Markdown généré **afin de** l'utiliser dans d'autres applications
- **En tant qu'** utilisateur, **je veux** organiser mes documents en dossiers personnels **afin de** maintenir une structure claire

### Recherche et Navigation
- **En tant qu'** utilisateur, **je veux** rechercher des documents par titre, contenu ou métadonnées **afin de** trouver rapidement l'information recherchée
- **En tant qu'** utilisateur, **je veux** utiliser la recherche sémantique **afin de** trouver des documents par similarité de sens
- **En tant qu'** utilisateur, **je veux** filtrer les résultats par date, type ou collection **afin d'** affiner ma recherche
- **En tant qu'** utilisateur, **je veux** naviguer dans l'historique de mes recherches **afin de** retrouver des requêtes précédentes

### Interaction avec les Documents
- **En tant qu'** utilisateur, **je veux** annoter les documents **afin d'** ajouter mes notes personnelles
- **En tant qu'** utilisateur, **je veux** surligner des passages importants **afin de** les retrouver facilement
- **En tant qu'** utilisateur, **je veux** créer des liens entre documents **afin de** construire un réseau de connaissances
- **En tant qu'** utilisateur, **je veux** exporter mes annotations **afin de** les utiliser dans d'autres outils

### Fonctionnalités LLM
- **En tant qu'** utilisateur, **je veux** poser des questions sur le contenu d'un document **afin d'** obtenir des réponses contextuelles
- **En tant qu'** utilisateur, **je veux** générer un résumé automatique du document **afin de** comprendre rapidement le contenu principal
- **En tant qu'** utilisateur, **je veux** extraire les points clés d'un document **afin d'** identifier les informations essentielles
- **En tant qu'** utilisateur, **je veux** comparer plusieurs documents **afin d'** identifier les similitudes et différences
- **En tant qu'** utilisateur, **je veux** traduire le contenu du document **afin de** le comprendre dans ma langue préférée

### Collaboration et Partage
- **En tant qu'** utilisateur, **je veux** partager des documents avec d'autres utilisateurs **afin de** collaborer sur des projets
- **En tant qu'** utilisateur, **je veux** commenter les documents partagés **afin de** échanger avec mes collaborateurs
- **En tant qu'** utilisateur, **je veux** recevoir des notifications sur les documents qui m'intéressent **afin de** rester informé des modifications
- **En tant qu'** utilisateur, **je veux** créer des collections partagées **afin de** organiser le travail en équipe

### Personnalisation
- **En tant qu'** utilisateur, **je veux** personnaliser mon tableau de bord **afin d'** accéder rapidement aux fonctionnalités importantes
- **En tant qu'** utilisateur, **je veux** configurer mes préférences de notification **afin de** recevoir les alertes pertinentes
- **En tant qu'** utilisateur, **je veux** sauvegarder mes requêtes fréquentes **afin de** gagner du temps dans mes recherches
- **En tant qu'** utilisateur, **je veux** exporter mes données personnelles **afin de** créer des sauvegardes ou migrer vers d'autres outils

# Functional Overview

## Modules Principaux

### 🔐 Authentification et Gestion des Utilisateurs
- **Inscription/Connexion** : Système d'authentification sécurisé
- **Gestion des profils** : Configuration des préférences utilisateur
- **Rôles et permissions** : Système de droits granulaire (Admin/Utilisateur)
- **Sessions** : Gestion des sessions avec tokens JWT
- **Sécurité** : Protection contre les accès non autorisés

### 📁 Gestion des Documents
- **Upload PDF** : Interface drag & drop pour l'import de fichiers
- **Transformation automatique** : Conversion PDF → Markdown via Docling
- **Prévisualisation** : Affichage du document transformé avec formatage
- **Métadonnées** : Extraction et édition des informations du document
- **Versioning** : Suivi des versions et historique des modifications
- **Organisation** : Système de dossiers et collections hiérarchiques

### 🔍 Recherche et Navigation
- **Recherche textuelle** : Recherche full-text dans le contenu et métadonnées
- **Recherche sémantique** : Recherche par similarité via embeddings Qdrant
- **Filtres avancés** : Par date, type, collection, auteur, tags
- **Historique de recherche** : Sauvegarde et réutilisation des requêtes
- **Navigation** : Arborescence des collections et breadcrumbs
- **Suggestions** : Recommandations de documents similaires

### 🤖 Fonctionnalités IA
- **Chat avec documents** : Questions/réponses contextuelles via LLM
- **Résumés automatiques** : Génération de synthèses personnalisables
- **Extraction d'insights** : Identification des points clés et concepts
- **Comparaison de documents** : Analyse des similitudes et différences
- **Traduction** : Support multilingue pour le contenu
- **Classification** : Catégorisation automatique des documents

### 👥 Collaboration
- **Partage de documents** : Partage sécurisé avec contrôle d'accès
- **Collections partagées** : Espaces de travail collaboratifs
- **Commentaires** : Système de commentaires thread-based
- **Annotations** : Surlignage et notes personnelles/partagées
- **Notifications** : Alertes sur les activités et modifications
- **Historique d'activité** : Journal des actions utilisateurs

### ⚙️ Administration
- **Tableau de bord admin** : Vue d'ensemble du système
- **Gestion des utilisateurs** : CRUD complet des comptes
- **Configuration LLM** : Paramétrage des modèles et API keys
- **Gestion des collections** : Organisation et permissions
- **Monitoring** : Métriques d'utilisation et performance
- **Maintenance** : Outils de sauvegarde et optimisation

## Flux Fonctionnels Principaux

### 📤 Flux d'Upload et Transformation
1. **Sélection** : L'utilisateur sélectionne un fichier PDF
2. **Upload** : Téléchargement sécurisé vers le serveur
3. **Validation** : Vérification du format et de la taille
4. **Stockage** : Sauvegarde dans le volume Docker
5. **Transformation** : Conversion PDF → Markdown via Docling
6. **Indexation** : Génération d'embeddings et stockage Qdrant
7. **Métadonnées** : Extraction et sauvegarde MongoDB
8. **Notification** : Confirmation de traitement terminé

### 🔍 Flux de Recherche
1. **Saisie** : L'utilisateur entre sa requête
2. **Analyse** : Détermination du type de recherche (textuelle/sémantique)
3. **Exécution** : Recherche dans MongoDB et/ou Qdrant
4. **Filtrage** : Application des filtres sélectionnés
5. **Classement** : Tri par pertinence et score
6. **Présentation** : Affichage des résultats avec snippets
7. **Interaction** : Accès aux documents et actions rapides

### 💬 Flux d'Interaction IA
1. **Contexte** : Sélection du document ou collection
2. **Question** : Formulation de la requête utilisateur
3. **Préparation** : Récupération du contexte pertinent
4. **Requête LLM** : Envoi vers le modèle configuré
5. **Traitement** : Analyse de la réponse et formatage
6. **Présentation** : Affichage avec références aux sources
7. **Historique** : Sauvegarde de la conversation

## Intégrations et APIs

### 🔌 APIs Externes
- **LLM Providers** : OpenAI, Anthropic, Azure OpenAI
- **Embedding Services** : Support de multiples fournisseurs
- **Stockage Cloud** : Extension possible vers S3, GCS
- **Authentification** : Support OAuth2, SAML (extensible)

### 📡 APIs Internes
- **REST API** : Endpoints pour toutes les fonctionnalités
- **WebSocket** : Notifications temps réel
- **GraphQL** : Requêtes optimisées pour le frontend
- **Webhooks** : Intégration avec systèmes externes

## Inspiration DocMost

Cette architecture fonctionnelle s'inspire de **DocMost** pour :
- **Interface utilisateur** : Design moderne et intuitif
- **Système de collections** : Organisation hiérarchique flexible
- **Collaboration** : Outils de partage et commentaires
- **Recherche** : Interface de recherche unifiée

Tout en ajoutant des spécificités uniques :
- **Transformation PDF** : Pipeline Docling intégré
- **IA native** : Fonctionnalités LLM au cœur de l'expérience
- **Recherche sémantique** : Qdrant pour la recherche vectorielle
- **Flexibilité LLM** : Support multi-providers

# Wireframes

## 1. Écran de Connexion

### Description
Page d'authentification avec design moderne et sécurisé. Support de l'inscription et connexion avec validation en temps réel.

### Fonctionnalités
- Formulaire de connexion/inscription
- Validation des champs en temps réel
- Messages d'erreur contextuels
- Option "Se souvenir de moi"
- Lien de récupération de mot de passe

### Wireframe ASCII
```
┌─────────────────────────────────────────────────────────────┐
│                        DocPDF Manager                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    📄 Bienvenue                            │
│                                                             │
│    ┌─────────────────────────────────────────────────┐     │
│    │                 CONNEXION                       │     │
│    │                                                 │     │
│    │  Email     [________________________]           │     │
│    │                                                 │     │
│    │  Mot de passe [________________________]        │     │
│    │                                                 │     │
│    │  ☐ Se souvenir de moi                          │     │
│    │                                                 │     │
│    │           [  SE CONNECTER  ]                    │     │
│    │                                                 │     │
│    │  ────────────── ou ──────────────               │     │
│    │                                                 │     │
│    │           [  S'INSCRIRE  ]                      │     │
│    │                                                 │     │
│    │  Mot de passe oublié ?                          │     │
│    └─────────────────────────────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Dashboard Utilisateur

### Description
Page d'accueil personnalisée avec vue d'ensemble des documents, recherche rapide et accès aux fonctionnalités principales.

### Fonctionnalités
- Barre de recherche globale
- Documents récents
- Collections favorites
- Statistiques personnelles
- Accès rapide aux actions

### Wireframe ASCII
```
┌─────────────────────────────────────────────────────────────┐
│ [☰] DocPDF Manager    [🔍 Rechercher...]     [👤] Profil   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📊 Tableau de Bord                                         │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ 📄 Docs     │ │ 📁 Collections│ │ 🤖 IA Chat  │           │
│  │    42       │ │      8        │ │   15 conv.  │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                             │
│  📄 Documents Récents                    [+ Nouveau PDF]    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📄 Rapport_Q4_2024.pdf        Hier 14:30          │   │
│  │ 📄 Manuel_Utilisateur.pdf     2 jours             │   │
│  │ 📄 Contrat_Client_ABC.pdf     3 jours             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  📁 Collections Favorites                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📁 Projets 2024        (12 docs)                   │   │
│  │ 📁 Documentation       (8 docs)                    │   │
│  │ 📁 Contrats           (5 docs)                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Liste des Documents

### Description
Vue d'ensemble de tous les documents avec options de tri, filtrage et actions en lot. Interface inspirée de DocMost.

### Fonctionnalités
- Liste/grille des documents
- Filtres avancés (date, type, collection)
- Tri par différents critères
- Actions en lot (déplacer, supprimer)
- Prévisualisation rapide

### Wireframe ASCII
```
┌─────────────────────────────────────────────────────────────┐
│ [☰] DocPDF Manager    [🔍 Rechercher...]     [👤] Profil   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📄 Mes Documents                                           │
│                                                             │
│  [🔍 Filtres ▼] [📅 Date ▼] [📁 Collection ▼] [⚙️ Actions] │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ☐ 📄 Rapport_Annuel_2024.pdf                       │   │
│  │   📁 Rapports • 2.3 MB • Transformé • Hier 14:30  │ ⋮ │
│  │                                                     │   │
│  │ ☐ 📄 Guide_Installation.pdf                        │   │
│  │   📁 Documentation • 1.8 MB • En cours • 2j       │ ⋮ │
│  │                                                     │   │
│  │ ☐ 📄 Contrat_Service_XYZ.pdf                       │   │
│  │   📁 Contrats • 856 KB • Transformé • 3j          │ ⋮ │
│  │                                                     │   │
│  │ ☐ 📄 Presentation_Produit.pdf                      │   │
│  │   📁 Marketing • 4.2 MB • Transformé • 1 sem      │ ⋮ │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [◀ Précédent]  Page 1 sur 5  [Suivant ▶]                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Visualisation de Document

### Description
Interface de lecture du document transformé avec outils d'annotation, chat IA intégré et navigation intelligente.

### Fonctionnalités
- Affichage Markdown formaté
- Panel de chat IA contextuel
- Outils d'annotation et surlignage
- Navigation par sections
- Métadonnées et informations

### Wireframe ASCII
```
┌─────────────────────────────────────────────────────────────┐
│ [☰] DocPDF Manager    [🔍 Rechercher...]     [👤] Profil   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 📄 Rapport_Annuel_2024.pdf                    [💬 Chat IA] │
│                                                             │
│ ┌─────────────────────┐ ┌─────────────────────────────────┐ │
│ │ 📑 Sommaire         │ │ # Rapport Annuel 2024          │ │
│ │                     │ │                                 │ │
│ │ 1. Introduction     │ │ ## Introduction                 │ │
│ │ 2. Résultats        │ │                                 │ │
│ │ 3. Analyse          │ │ Ce rapport présente les         │ │
│ │ 4. Conclusions      │ │ résultats de l'année 2024...   │ │
│ │                     │ │                                 │ │
│ │ ─────────────────   │ │ [Texte surligné en jaune]      │ │
│ │ 🏷️ Tags             │ │                                 │ │
│ │ • Finance           │ │ ## Résultats Financiers         │ │
│ │ • 2024              │ │                                 │ │
│ │ • Rapport           │ │ Les revenus ont augmenté de...  │ │
│ │                     │ │                                 │ │
│ │ ─────────────────   │ │ 💬 "Excellente performance"    │ │
│ │ 📊 Métadonnées      │ │    - Jean D. (il y a 2h)       │ │
│ │ Taille: 2.3 MB      │ │                                 │ │
│ │ Pages: 45           │ │                                 │ │
│ │ Créé: 15/01/2024    │ │                                 │ │
│ └─────────────────────┘ └─────────────────────────────────┘ │
│                                                             │
│ [💾 Sauvegarder] [📤 Partager] [🖨️ Imprimer] [⬇️ Export]   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Chat IA avec Document

### Description
Interface de conversation avec l'IA pour poser des questions sur le document, obtenir des résumés et extraire des insights.

### Fonctionnalités
- Chat contextuel au document
- Suggestions de questions
- Références aux passages sources
- Historique des conversations
- Export des réponses

### Wireframe ASCII
```
┌─────────────────────────────────────────────────────────────┐
│ 🤖 Chat IA - Rapport_Annuel_2024.pdf          [✕ Fermer]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🤖 Bonjour ! Je peux vous aider à analyser ce          │ │
│ │    document. Que souhaitez-vous savoir ?               │ │
│ │                                              10:30     │ │
│ │                                                         │ │
│ │                     Quels sont les points clés ? 👤    │ │
│ │                                              10:31     │ │
│ │                                                         │ │
│ │ 🤖 Voici les points clés du rapport :                  │ │
│ │    • Croissance de 15% du chiffre d'affaires          │ │
│ │    • Expansion sur 3 nouveaux marchés                  │ │
│ │    • Investissement R&D de 2M€                         │ │
│ │                                                         │ │
│ │    📄 Sources: Page 12, Page 28, Page 35              │ │
│ │                                              10:31     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ 💡 Suggestions:                                             │
│ • Résume ce document                                        │
│ • Quels sont les risques identifiés ?                      │
│ • Compare avec l'année précédente                           │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Tapez votre question...                    [📤 Envoyer] │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ [📋 Copier] [💾 Sauvegarder] [📤 Partager la conversation] │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Upload de Document

### Description
Interface d'upload avec drag & drop, suivi de progression de transformation et configuration des métadonnées.

### Fonctionnalités
- Zone de drag & drop
- Sélection multiple de fichiers
- Barre de progression transformation
- Configuration métadonnées
- Prévisualisation du résultat

### Wireframe ASCII
```
┌─────────────────────────────────────────────────────────────┐
│ [☰] DocPDF Manager    [🔍 Rechercher...]     [👤] Profil   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📤 Nouveau Document                                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │           📄 Glissez vos fichiers PDF ici          │   │
│  │                        ou                          │   │
│  │              [📁 Parcourir les fichiers]           │   │
│  │                                                     │   │
│  │     Formats acceptés: PDF (max 50 MB par fichier)  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  📋 Fichiers sélectionnés:                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📄 rapport_q4.pdf (2.3 MB)                         │   │
│  │    Collection: [Rapports ▼]                        │   │
│  │    Tags: [finance, 2024, rapport]                  │   │
│  │    ████████████████░░░░ 80% Transformation...      │   │
│  │                                                     │   │
│  │ 📄 guide_user.pdf (1.8 MB)                         │   │
│  │    Collection: [Documentation ▼]                   │   │
│  │    Tags: [guide, manuel]                           │   │
│  │    ⏳ En attente...                                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [🚀 Commencer le traitement] [❌ Annuler]                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Recherche Avancée

### Description
Interface de recherche puissante avec filtres multiples, recherche sémantique et prévisualisation des résultats.

### Fonctionnalités
- Recherche textuelle et sémantique
- Filtres avancés multiples
- Prévisualisation des résultats
- Sauvegarde des requêtes
- Export des résultats

### Wireframe ASCII
```
┌─────────────────────────────────────────────────────────────┐
│ [☰] DocPDF Manager    [🔍 Rechercher...]     [👤] Profil   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔍 Recherche Avancée                                       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [🔍] analyse financière 2024                       │   │
│  │                                    [🎯 Rechercher] │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────┐ ┌─────────────────────────────┐   │
│  │ 🎛️ Filtres          │ │ 📊 Résultats (23 trouvés)  │   │
│  │                     │ │                             │   │
│  │ 📁 Collections      │ │ 📄 Rapport_Financier.pdf   │   │
│  │ ☑️ Rapports (12)    │ │ Score: 95% • 2.1 MB        │   │
│  │ ☐ Documentation (8) │ │ "...analyse financière      │   │
│  │ ☐ Contrats (3)      │ │ détaillée pour 2024..."     │   │
│  │                     │ │                             │   │
│  │ 📅 Période          │ │ 📄 Bilan_Annuel_2024.pdf   │   │
│  │ Du: [01/01/2024]    │ │ Score: 87% • 1.8 MB        │   │
│  │ Au: [31/12/2024]    │ │ "...résultats financiers    │   │
│  │                     │ │ exceptionnels en 2024..."   │   │
│  │ 🏷️ Tags             │ │                             │   │
│  │ ☑️ finance          │ │ 📄 Analyse_Marche.pdf       │   │
│  │ ☑️ 2024             │ │ Score: 82% • 3.2 MB        │   │
│  │ ☐ rapport           │ │ "...tendances du marché     │   │
│  │                     │ │ financier en 2024..."       │   │
│  │ [🔄 Réinitialiser]  │ │                             │   │
│  └─────────────────────┘ │ [◀ Préc] Page 1/3 [Suiv ▶] │   │
│                          └─────────────────────────────┘   │
│                                                             │
│  [💾 Sauvegarder la recherche] [📤 Exporter les résultats] │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Gestion des Collections

### Description
Interface d'organisation des documents en collections hiérarchiques avec permissions et partage.

### Fonctionnalités
- Arborescence des collections
- Création/modification de collections
- Gestion des permissions
- Partage et collaboration
- Statistiques par collection

### Wireframe ASCII
```
┌─────────────────────────────────────────────────────────────┐
│ [☰] DocPDF Manager    [🔍 Rechercher...]     [👤] Profil   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📁 Collections                              [+ Nouvelle]   │
│                                                             │
│  ┌─────────────────────┐ ┌─────────────────────────────┐   │
│  │ 📁 Mes Collections  │ │ 📁 Rapports Financiers      │   │
│  │                     │ │                             │   │
│  │ 📁 Rapports (15)    │ │ 📊 12 documents • 28.4 MB  │   │
│  │   📁 Financiers (12)│ │ 👥 Partagé avec 3 personnes │   │
│  │   📁 Techniques (3) │ │ 📅 Modifié il y a 2 heures │   │
│  │                     │ │                             │   │
│  │ 📁 Documentation (8)│ │ 📄 Documents récents:       │   │
│  │   📁 Guides (5)     │ │ • Bilan_Q4_2024.pdf        │   │
│  │   📁 Manuels (3)    │ │ • Rapport_Mensuel.pdf       │   │
│  │                     │ │ • Analyse_Couts.pdf         │   │
│  │ 📁 Contrats (5)     │ │                             │   │
│  │                     │ │ 👥 Collaborateurs:          │   │
│  │ ─────────────────   │ │ • Jean Dupont (Éditeur)     │   │
│  │ 👥 Collections      │ │ • Marie Martin (Lecteur)    │   │
│  │    Partagées        │ │ • Paul Durand (Éditeur)     │   │
│  │                     │ │                             │   │
│  │ 📁 Équipe Dev (23)  │ │ [✏️ Modifier] [👥 Partager] │   │
│  │ 📁 Marketing (18)   │ │ [🗑️ Supprimer] [📊 Stats]   │   │
│  └─────────────────────┘ └─────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Dashboard Administrateur

### Description
Interface d'administration complète avec statistiques système, gestion des utilisateurs et configuration des services.

### Fonctionnalités
- Métriques système en temps réel
- Gestion des utilisateurs
- Configuration des LLM
- Monitoring des coûts
- Logs et activité

### Wireframe ASCII
```
┌─────────────────────────────────────────────────────────────┐
│ [☰] Admin Panel      [🔍 Rechercher...]     [👤] Admin     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ⚙️ Administration                                          │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ 👥 Users    │ │ 📄 Docs     │ │ 💰 Coûts IA │           │
│  │    127      │ │   1,234     │ │   €234.56   │           │
│  │ +5 ce mois  │ │ +89 ce mois │ │ ce mois     │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                             │
│  ┌─────────────────────┐ ┌─────────────────────────────┐   │
│  │ 📊 Activité Système │ │ 🚨 Alertes & Notifications  │   │
│  │                     │ │                             │   │
│  │ CPU: ████░░░░ 60%   │ │ ⚠️ Quota OpenAI à 80%       │   │
│  │ RAM: ██████░░ 75%   │ │ ✅ Sauvegarde OK (2h)       │   │
│  │ Stockage: ███░░ 45% │ │ 🔄 Qdrant sync en cours     │   │
│  │                     │ │                             │   │
│  │ Transformations:    │ │ 📈 Pic d'usage détecté      │   │
│  │ • En cours: 3       │ │ 🔧 Maintenance prévue       │   │
│  │ • File d'attente: 7 │ │    (Dimanche 2h-4h)         │   │
│  └─────────────────────┘ └─────────────────────────────┘   │
│                                                             │
│  🎛️ Actions Rapides:                                       │
│  [👥 Gérer Users] [🤖 Config LLM] [📊 Rapports] [⚙️ Système]│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. Configuration LLM (Admin)

### Description
Interface de configuration des modèles LLM, gestion des API keys et paramétrage des coûts.

### Fonctionnalités
- Configuration multi-providers
- Gestion des API keys
- Paramètres de modèles
- Monitoring des coûts
- Tests de connectivité

### Wireframe ASCII
```
┌─────────────────────────────────────────────────────────────┐
│ [☰] Admin Panel      [🔍 Rechercher...]     [👤] Admin     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🤖 Configuration LLM                                       │
│                                                             │
│  ┌─────────────────────┐ ┌─────────────────────────────┐   │
│  │ 🔌 Providers        │ │ ⚙️ OpenAI Configuration     │   │
│  │                     │ │                             │   │
│  │ ✅ OpenAI           │ │ API Key: sk-***************  │   │
│  │ ✅ Anthropic        │ │ [🔄 Tester] [👁️ Afficher]   │   │
│  │ ❌ Azure OpenAI     │ │                             │   │
│  │ ❌ Google AI        │ │ Modèles disponibles:        │   │
│  │                     │ │ ☑️ gpt-4o (Chat)            │   │
│  │ [+ Ajouter]         │ │ ☑️ gpt-4o-mini (Chat)       │   │
│  └─────────────────────┘ │ ☑️ text-embedding-3-large   │   │
│                          │                             │   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 💰 Gestion des Coûts                               │   │
│  │                                                     │   │
│  │ Budget mensuel: [1000] €                           │   │
│  │ Consommé: 234.56 € (23.5%)                         │   │
│  │                                                     │   │
│  │ Coûts par modèle (ce mois):                        │   │
│  │ • gpt-4o: 156.78 € (1,234 requêtes)               │   │
│  │ • gpt-4o-mini: 45.23 € (5,678 requêtes)           │   │
│  │ • embeddings: 32.55 € (12,345 tokens)             │   │
│  │                                                     │   │
│  │ ⚠️ Alertes:                                         │   │
│  │ • Quota à 80% - [Augmenter] [Alerter]             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [💾 Sauvegarder] [🔄 Tester Connexions] [📊 Rapports]     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

# Prompts

## Thème de Couleurs
**Palette principale** : Dégradé bleu-vert en 5 tons
- **Bleu sombre** : #1e3a8a (navigation, headers)
- **Bleu clair** : #3b82f6 (boutons primaires, liens)
- **Turquoise** : #06b6d4 (accents, notifications)
- **Vert clair** : #10b981 (succès, validations)
- **Vert sombre** : #059669 (confirmations, états actifs)

---

## 1. Prompt - Écran de Connexion

```
Crée une page de connexion moderne pour une application de gestion de documents PDF appelée "DocPDF Manager".

DESIGN:
- Thème: dégradé bleu-vert avec 5 tons (#1e3a8a, #3b82f6, #06b6d4, #10b981, #059669)
- Style: moderne, épuré, professionnel
- Layout: centré avec fond dégradé subtil

FONCTIONNALITÉS:
- Formulaire de connexion avec email/mot de passe
- Option "Se souvenir de moi"
- Bouton de connexion principal
- Lien vers inscription
- Lien "Mot de passe oublié"
- Validation en temps réel des champs
- Messages d'erreur contextuels

TECH STACK:
- NextJS avec TypeScript
- Tailwind CSS pour le styling
- React Hook Form pour la validation
- Animations fluides avec Framer Motion

INSPIRATION:
- Design moderne type DocMost
- UX fluide et intuitive
- Accessibilité WCAG compliant
```

---

## 2. Prompt - Dashboard Utilisateur

```
Crée un dashboard utilisateur moderne pour DocPDF Manager avec vue d'ensemble des documents et fonctionnalités.

DESIGN:
- Thème: palette bleu-vert (#1e3a8a à #059669)
- Layout: sidebar + contenu principal
- Cards avec statistiques et actions rapides
- Barre de recherche globale proéminente

FONCTIONNALITÉS:
- Header avec navigation et profil utilisateur
- Statistiques personnelles (docs, collections, conversations IA)
- Liste des documents récents avec métadonnées
- Collections favorites avec compteurs
- Bouton d'action "Nouveau PDF" mis en évidence
- Recherche globale avec suggestions

COMPOSANTS:
- Sidebar responsive avec icônes
- Cards statistiques avec animations
- Liste de documents avec preview
- Barre de recherche avec autocomplete
- Navigation breadcrumb

TECH STACK:
- NextJS + TypeScript
- Tailwind CSS + Headless UI
- Lucide React pour les icônes
- Chart.js pour les statistiques
```

---

## 3. Prompt - Liste des Documents

```
Crée une interface de liste de documents avec filtres avancés et actions en lot pour DocPDF Manager.

DESIGN:
- Thème: palette bleu-vert avec accents turquoise
- Layout: filtres sidebar + liste principale
- Table responsive avec actions contextuelles
- États visuels pour le statut de transformation

FONCTIONNALITÉS:
- Filtres multiples (collections, dates, tags, statut)
- Tri par colonnes (nom, date, taille, statut)
- Sélection multiple avec actions en lot
- Statuts visuels (transformé, en cours, erreur)
- Prévisualisation rapide au survol
- Pagination intelligente

COMPOSANTS:
- Filtres sidebar avec accordéons
- Table avec tri et sélection
- Badges de statut colorés
- Menu contextuel par document
- Modal de prévisualisation
- Toast notifications

TECH STACK:
- NextJS + TypeScript
- TanStack Table pour la table
- React Select pour les filtres
- Framer Motion pour les animations
```

---

## 4. Prompt - Visualisation de Document

```
Crée une interface de lecture de document avec chat IA intégré et outils d'annotation pour DocPDF Manager.

DESIGN:
- Thème: bleu-vert avec sidebar métadonnées
- Layout: 3 colonnes (navigation, contenu, chat IA)
- Markdown rendu avec highlighting
- Panel IA coulissant

FONCTIONNALITÉS:
- Affichage Markdown formaté et responsive
- Sidebar avec sommaire cliquable
- Outils d'annotation (surlignage, notes)
- Chat IA contextuel intégré
- Métadonnées et tags éditables
- Actions d'export et partage

COMPOSANTS:
- Markdown renderer avec syntax highlighting
- Sidebar navigation avec scroll spy
- Annotation toolbar flottante
- Chat panel avec suggestions
- Modal de partage
- Tooltip pour les métadonnées

TECH STACK:
- NextJS + TypeScript
- React Markdown + Prism.js
- Floating UI pour les tooltips
- WebSocket pour le chat temps réel
```

---

## 5. Prompt - Chat IA avec Document

```
Crée une interface de chat IA dédiée pour l'interaction avec les documents dans DocPDF Manager.

DESIGN:
- Thème: dégradé bleu-vert avec accents turquoise
- Layout: modal ou page pleine avec historique
- Bulles de chat distinctes (utilisateur/IA)
- Références aux sources intégrées

FONCTIONNALITÉS:
- Interface de chat temps réel
- Suggestions de questions contextuelles
- Affichage des sources avec liens
- Historique des conversations
- Export et partage des conversations
- Typing indicators

COMPOSANTS:
- Chat container avec scroll auto
- Message bubbles avec timestamps
- Suggestions chips cliquables
- Source references avec preview
- Input avec auto-resize
- Loading states animés

TECH STACK:
- NextJS + TypeScript
- WebSocket pour temps réel
- React Virtualized pour performance
- Markdown dans les réponses IA
```

---

## 6. Prompt - Upload de Document

```
Crée une interface d'upload de documents avec drag & drop et suivi de progression pour DocPDF Manager.

DESIGN:
- Thème: palette bleu-vert avec progression verte
- Layout: zone de drop centrale + liste des fichiers
- Barres de progression animées
- États visuels clairs

FONCTIONNALITÉS:
- Drag & drop zone responsive
- Sélection multiple de fichiers
- Configuration métadonnées par fichier
- Suivi progression transformation en temps réel
- Gestion d'erreurs avec retry
- Prévisualisation des résultats

COMPOSANTS:
- Drop zone avec animations
- File list avec progress bars
- Metadata forms par fichier
- Status badges animés
- Error handling avec actions
- Success notifications

TECH STACK:
- NextJS + TypeScript
- React Dropzone
- WebSocket pour progression temps réel
- React Hook Form pour métadonnées
```

---

## 7. Prompt - Recherche Avancée

```
Crée une interface de recherche avancée avec filtres multiples et résultats sémantiques pour DocPDF Manager.

DESIGN:
- Thème: bleu-vert avec highlights turquoise
- Layout: filtres sidebar + résultats avec scores
- Search bar proéminente
- Résultats avec snippets et scores

FONCTIONNALITÉS:
- Recherche textuelle et sémantique combinée
- Filtres multiples (collections, dates, tags)
- Scores de pertinence visuels
- Snippets de contenu avec highlighting
- Sauvegarde et historique des recherches
- Export des résultats

COMPOSANTS:
- Search input avec autocomplete
- Filtres sidebar avec checkboxes
- Results cards avec scores
- Highlighting des termes trouvés
- Pagination avec lazy loading
- Save search modal

TECH STACK:
- NextJS + TypeScript
- Fuse.js pour recherche floue
- React Highlight Words
- Intersection Observer pour pagination
```

---

## 8. Prompt - Gestion des Collections

```
Crée une interface de gestion de collections hiérarchiques avec permissions et collaboration pour DocPDF Manager.

DESIGN:
- Thème: palette bleu-vert avec icônes colorées
- Layout: arbre de navigation + détails collection
- Hiérarchie visuelle claire
- Indicateurs de partage

FONCTIONNALITÉS:
- Arborescence des collections drag & drop
- Création/édition de collections
- Gestion des permissions granulaires
- Partage avec utilisateurs/équipes
- Statistiques par collection
- Actions en lot sur documents

COMPOSANTS:
- Tree view avec expand/collapse
- Collection details panel
- Permissions matrix
- Share modal avec user picker
- Stats dashboard mini
- Drag & drop pour organisation

TECH STACK:
- NextJS + TypeScript
- React DnD pour drag & drop
- React Tree View
- Multi-select pour permissions
```

---

## 9. Prompt - Dashboard Administrateur

```
Crée un dashboard d'administration avec métriques système et gestion pour DocPDF Manager.

DESIGN:
- Thème: bleu-vert avec alertes colorées
- Layout: grid de métriques + panels d'action
- Graphiques et indicateurs visuels
- Design type admin moderne

FONCTIONNALITÉS:
- Métriques système temps réel (CPU, RAM, stockage)
- Statistiques utilisateurs et documents
- Monitoring des coûts IA
- Alertes et notifications système
- Actions rapides d'administration
- Logs d'activité

COMPOSANTS:
- Metric cards avec graphiques
- Progress bars pour ressources
- Alert panels avec actions
- Quick action buttons
- Activity feed
- Real-time updates

TECH STACK:
- NextJS + TypeScript
- Chart.js/Recharts pour graphiques
- WebSocket pour temps réel
- Tailwind pour responsive design
```

---

## 10. Prompt - Configuration LLM (Admin)

```
Crée une interface de configuration des modèles LLM avec gestion des coûts pour DocPDF Manager.

DESIGN:
- Thème: bleu-vert avec codes couleur par provider
- Layout: providers sidebar + configuration détaillée
- Tableaux de coûts avec graphiques
- Indicateurs de statut connexion

FONCTIONNALITÉS:
- Configuration multi-providers (OpenAI, Anthropic, etc.)
- Gestion sécurisée des API keys
- Sélection et paramétrage des modèles
- Monitoring des coûts en temps réel
- Tests de connectivité
- Alertes de quota

COMPOSANTS:
- Provider cards avec status
- Secure input pour API keys
- Model selection avec specs
- Cost monitoring dashboard
- Connection test indicators
- Budget alerts system

TECH STACK:
- NextJS + TypeScript
- Secure forms avec validation
- Charts pour coûts
- Real-time cost tracking
- Toast notifications pour tests
```

# Technical Overview

## Architecture Globale

### Vue d'Ensemble
L'application DocPDF Manager est construite sur une architecture microservices containerisée avec Docker Compose, optimisée pour la transformation de documents PDF et l'interaction IA.

```
┌─────────────────────────────────────────────────────────────┐
│                    ARCHITECTURE SYSTÈME                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Client Browser] ──→ [Nginx Reverse Proxy]                │
│                              │                             │
│                              ▼                             │
│                       [NextJS Frontend]                    │
│                              │                             │
│                              ▼                             │
│                       [NextJS Backend API]                 │
│                              │                             │
│                    ┌─────────┼─────────┐                   │
│                    ▼         ▼         ▼                   │
│              [MongoDB]  [Qdrant]  [Volume PDF]             │
│                    │         │         │                   │
│                    ▼         ▼         ▼                   │
│              [Métadonnées] [Embeddings] [Fichiers]         │
│                                                             │
│                              │                             │
│                              ▼                             │
│                       [Docling Service]                    │
│                              │                             │
│                              ▼                             │
│                       [LLM External APIs]                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Stack Technique Détaillé

### Frontend
- **Framework** : NextJS 14+ avec App Router
- **Language** : TypeScript pour la sécurité de type
- **Styling** : Tailwind CSS + Headless UI
- **State Management** : Zustand pour l'état global
- **Forms** : React Hook Form + Zod validation
- **Icons** : Lucide React
- **Animations** : Framer Motion

### Backend
- **Framework** : NextJS API Routes
- **Language** : TypeScript
- **Authentication** : NextAuth.js avec JWT
- **File Upload** : Multer + validation
- **PDF Processing** : Docling Python service
- **Vector Search** : Qdrant client
- **Database ORM** : Mongoose pour MongoDB

### Base de Données
- **Principale** : MongoDB 7.0+
  - Métadonnées des documents
  - Utilisateurs et permissions
  - Collections et organisation
  - Historique des conversations IA
- **Vectorielle** : Qdrant
  - Embeddings des documents
  - Index de recherche sémantique
  - Cache des requêtes fréquentes

### Services Externes
- **Transformation PDF** : Docling (service Python)
- **LLM Providers** : OpenAI, Anthropic, Azure OpenAI
- **Embedding Services** : OpenAI, Cohere, local models
- **Stockage** : Volume Docker local (extensible vers S3)

## Configuration Docker Compose

### Services Définis

#### 1. Nginx (Reverse Proxy)
```yaml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf
    - ./ssl:/etc/nginx/ssl
  depends_on:
    - frontend
```

#### 2. Frontend NextJS
```yaml
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile
  environment:
    - NEXT_PUBLIC_API_URL=http://backend:3001
    - NEXT_PUBLIC_WS_URL=ws://backend:3001
  depends_on:
    - backend
```

#### 3. Backend NextJS API
```yaml
backend:
  build:
    context: ./backend
    dockerfile: Dockerfile
  ports:
    - "3001:3001"
  environment:
    - MONGODB_URI=mongodb://mongo:27017/docpdf
    - QDRANT_URL=http://qdrant:6333
    - DOCLING_SERVICE_URL=http://docling:8000
    - JWT_SECRET=${JWT_SECRET}
    - OPENAI_API_KEY=${OPENAI_API_KEY}
  volumes:
    - pdf_storage:/app/storage/pdfs
  depends_on:
    - mongo
    - qdrant
    - docling
```

#### 4. MongoDB
```yaml
mongo:
  image: mongo:7.0
  ports:
    - "27017:27017"
  environment:
    - MONGO_INITDB_ROOT_USERNAME=${MONGO_USERNAME}
    - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
  volumes:
    - mongo_data:/data/db
    - ./mongo-init:/docker-entrypoint-initdb.d
```

#### 5. Qdrant (Vector Database)
```yaml
qdrant:
  image: qdrant/qdrant:latest
  ports:
    - "6333:6333"
  volumes:
    - qdrant_data:/qdrant/storage
  environment:
    - QDRANT__SERVICE__HTTP_PORT=6333
```

#### 6. Docling Service
```yaml
docling:
  build:
    context: ./docling-service
    dockerfile: Dockerfile
  ports:
    - "8000:8000"
  environment:
    - PYTHONPATH=/app
  volumes:
    - pdf_storage:/app/input
    - markdown_output:/app/output
```

#### 7. Redis (Cache & Sessions)
```yaml
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data
  command: redis-server --appendonly yes
```

### Volumes Persistants
```yaml
volumes:
  mongo_data:
    driver: local
  qdrant_data:
    driver: local
  redis_data:
    driver: local
  pdf_storage:
    driver: local
  markdown_output:
    driver: local
```

## Flux de Données Techniques

### 1. Upload et Transformation
```
Client ──→ Nginx ──→ NextJS Frontend ──→ NextJS Backend API
                                              │
                                              ▼
                                        [Validation PDF]
                                              │
                                              ▼
                                        [Stockage Volume]
                                              │
                                              ▼
                                        [Docling Service] ──→ [Markdown Output]
                                              │
                                              ▼
                                        [Embedding Generation]
                                              │
                                              ▼
                                        [Qdrant Storage]
                                              │
                                              ▼
                                        [MongoDB Metadata]
```

### 2. Recherche Sémantique
```
Query ──→ [Embedding Generation] ──→ [Qdrant Vector Search]
                                              │
                                              ▼
                                        [Résultats + Scores]
                                              │
                                              ▼
                                        [MongoDB Metadata Enrichment]
                                              │
                                              ▼
                                        [Client Response]
```

### 3. Chat IA Contextuel
```
Question ──→ [Context Retrieval] ──→ [Qdrant Similarity Search]
                    │                         │
                    ▼                         ▼
            [Document Chunks] ──→ [LLM API Request]
                                              │
                                              ▼
                                        [Structured Response]
                                              │
                                              ▼
                                        [WebSocket to Client]
```

## Sécurité et Performance

### Sécurité
- **Authentication** : JWT tokens avec refresh
- **Authorization** : RBAC (Role-Based Access Control)
- **API Security** : Rate limiting, CORS, validation
- **Data Encryption** : TLS/SSL, encrypted volumes
- **Secrets Management** : Docker secrets, env variables

### Performance
- **Caching** : Redis pour sessions et cache API
- **CDN** : Nginx pour assets statiques
- **Database** : Index MongoDB optimisés
- **Vector Search** : Qdrant avec index HNSW
- **File Storage** : Volume local avec backup strategy

### Monitoring
- **Logs** : Centralisés via Docker logging
- **Metrics** : Prometheus + Grafana (optionnel)
- **Health Checks** : Endpoints de santé par service
- **Alerting** : Notifications système intégrées

## Déploiement et Scalabilité

### Environnements
- **Development** : Docker Compose local
- **Staging** : Docker Compose + CI/CD
- **Production** : Kubernetes ou Docker Swarm

### Scalabilité
- **Horizontal** : Réplication des services NextJS
- **Vertical** : Augmentation des ressources containers
- **Storage** : Migration vers S3/MinIO pour production
- **Database** : MongoDB replica set pour HA

### Backup et Recovery
- **MongoDB** : Backup automatique quotidien
- **Qdrant** : Snapshot des collections
- **PDF Files** : Synchronisation vers stockage externe
- **Configuration** : Versioning des configs Docker

## Variables d'Environnement

### Fichier .env
```bash
# Database
MONGO_USERNAME=docpdf_user
MONGO_PASSWORD=secure_password
MONGODB_URI=mongodb://mongo:27017/docpdf

# Vector Database
QDRANT_URL=http://qdrant:6333
QDRANT_API_KEY=optional_api_key

# Authentication
JWT_SECRET=your_jwt_secret_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# LLM APIs
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/

# Services
DOCLING_SERVICE_URL=http://docling:8000
REDIS_URL=redis://redis:6379

# Storage
PDF_STORAGE_PATH=/app/storage/pdfs
MARKDOWN_OUTPUT_PATH=/app/output/markdown

# Security
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=15
```

## Structure des Répertoires

```
docpdf-manager/
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
├── nginx/
│   ├── nginx.conf
│   └── ssl/
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── app/
│       ├── components/
│       ├── lib/
│       └── types/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── app/
│       ├── lib/
│       ├── models/
│       └── utils/
├── docling-service/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py
│   └── src/
└── scripts/
    ├── setup.sh
    ├── backup.sh
    └── deploy.sh
```

## Commandes de Déploiement

### Développement
```bash
# Démarrage complet
docker-compose up -d

# Logs en temps réel
docker-compose logs -f

# Rebuild après modifications
docker-compose up -d --build

# Arrêt propre
docker-compose down
```

### Production
```bash
# Déploiement production
docker-compose -f docker-compose.prod.yml up -d

# Backup avant mise à jour
./scripts/backup.sh

# Mise à jour rolling
docker-compose -f docker-compose.prod.yml up -d --no-deps backend
```

Cette architecture technique fournit une base solide, scalable et maintenable pour votre application DocPDF Manager avec Docker Compose.