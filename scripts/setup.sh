#!/bin/bash

# Script de configuration initiale pour DocPDF Manager
# Usage: ./scripts/setup.sh

set -e

echo "🚀 Configuration initiale de DocPDF Manager"

# Vérification des prérequis
echo "📋 Vérification des prérequis..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez installer Docker Compose."
    exit 1
fi

echo "✅ Docker et Docker Compose sont installés"

# Création du fichier .env s'il n'existe pas
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Configurez vos variables d'environnement dans le fichier .env"
    echo "   Notamment les mots de passe et clés API"
else
    echo "✅ Fichier .env existe déjà"
fi

# Création des répertoires de données
echo "📁 Création des répertoires de données..."
mkdir -p data/{mongodb,qdrant,redis,pdfs,markdown,nginx-logs}
chmod 755 data/*

# Configuration des permissions
echo "🔐 Configuration des permissions..."
sudo chown -R $USER:$USER data/

# Initialisation des services de base de données
echo "🗄️ Démarrage des services de base de données..."
docker-compose up -d mongodb qdrant redis

# Attente que les services soient prêts
echo "⏳ Attente de la disponibilité des services..."
sleep 30

# Vérification de la santé des services
echo "🏥 Vérification de la santé des services..."

# Test MongoDB
if docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "✅ MongoDB est opérationnel"
else
    echo "❌ MongoDB n'est pas accessible"
fi

# Test Qdrant
if curl -s http://localhost:6333/collections > /dev/null; then
    echo "✅ Qdrant est opérationnel"
else
    echo "❌ Qdrant n'est pas accessible"
fi

# Test Redis
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis est opérationnel"
else
    echo "❌ Redis n'est pas accessible"
fi

# Installation des dépendances du backend
echo "📦 Installation des dépendances du backend..."
cd backend && npm install && cd ..

# Installation des dépendances du frontend
echo "📦 Installation des dépendances du frontend..."
cd frontend && npm install && cd ..

# Installation des dépendances du service Docling
echo "🐍 Installation des dépendances du service Docling..."
cd docling-service && pip install -r requirements.txt && cd ..

echo ""
echo "🎉 Configuration initiale terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurez vos variables d'environnement dans .env"
echo "2. Lancez l'application complète avec: docker-compose up -d"
echo "3. Accédez à l'application sur http://localhost:3000"
echo ""
echo "🔧 Commandes utiles :"
echo "- Logs en temps réel: docker-compose logs -f"
echo "- Arrêt des services: docker-compose down"
echo "- Rebuild après modifications: docker-compose up -d --build"
