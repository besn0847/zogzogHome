#!/bin/bash

# Script de déploiement pour DocPDF Manager
# Usage: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT="${1:-development}"
COMPOSE_FILE="docker-compose.yml"

if [ "$ENVIRONMENT" = "production" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
fi

echo "🚀 Déploiement DocPDF Manager (${ENVIRONMENT})"

# Vérification des prérequis
echo "📋 Vérification des prérequis..."

if [ ! -f .env ]; then
    echo "❌ Fichier .env manquant. Copiez .env.example vers .env et configurez-le."
    exit 1
fi

if [ ! -f "$COMPOSE_FILE" ]; then
    echo "❌ Fichier $COMPOSE_FILE manquant."
    exit 1
fi

# Sauvegarde avant déploiement (en production)
if [ "$ENVIRONMENT" = "production" ]; then
    echo "💾 Sauvegarde avant déploiement..."
    ./scripts/backup.sh ./backups/pre-deploy
fi

# Arrêt des services existants
echo "🛑 Arrêt des services existants..."
docker-compose -f "$COMPOSE_FILE" down

# Construction des images
echo "🔨 Construction des images Docker..."
docker-compose -f "$COMPOSE_FILE" build --no-cache

# Démarrage des services de base de données
echo "🗄️ Démarrage des services de base de données..."
docker-compose -f "$COMPOSE_FILE" up -d mongodb qdrant redis

# Attente de la disponibilité des services
echo "⏳ Attente de la disponibilité des services de base..."
sleep 30

# Démarrage du service Docling
echo "🐍 Démarrage du service Docling..."
docker-compose -f "$COMPOSE_FILE" up -d docling-service

# Attente du service Docling
sleep 10

# Démarrage du backend
echo "⚙️ Démarrage du backend..."
docker-compose -f "$COMPOSE_FILE" up -d backend

# Attente du backend
sleep 15

# Démarrage du frontend
echo "🎨 Démarrage du frontend..."
docker-compose -f "$COMPOSE_FILE" up -d frontend

# Démarrage de Nginx (si en production)
if [ "$ENVIRONMENT" = "production" ]; then
    echo "🌐 Démarrage de Nginx..."
    docker-compose -f "$COMPOSE_FILE" up -d nginx
fi

# Vérification de la santé des services
echo "🏥 Vérification de la santé des services..."
sleep 20

# Test des endpoints de santé
services=("backend:3001" "docling-service:8000")

for service in "${services[@]}"; do
    service_name=$(echo $service | cut -d: -f1)
    port=$(echo $service | cut -d: -f2)
    
    if curl -s -f "http://localhost:${port}/health" > /dev/null; then
        echo "✅ ${service_name} est opérationnel"
    else
        echo "❌ ${service_name} n'est pas accessible"
    fi
done

# Test du frontend
if curl -s -f "http://localhost:3000" > /dev/null; then
    echo "✅ Frontend est accessible"
else
    echo "❌ Frontend n'est pas accessible"
fi

echo ""
echo "🎉 Déploiement terminé !"
echo ""
echo "📋 Services déployés :"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:3001"
echo "- Service Docling: http://localhost:8000"
echo "- MongoDB: localhost:27017"
echo "- Qdrant: http://localhost:6333"
echo "- Redis: localhost:6379"
echo ""
echo "🔧 Commandes utiles :"
echo "- Logs: docker-compose -f $COMPOSE_FILE logs -f"
echo "- Status: docker-compose -f $COMPOSE_FILE ps"
echo "- Arrêt: docker-compose -f $COMPOSE_FILE down"
echo ""

if [ "$ENVIRONMENT" = "production" ]; then
    echo "🔒 Configuration de production :"
    echo "- Configurez SSL/TLS pour Nginx"
    echo "- Vérifiez les sauvegardes automatiques"
    echo "- Configurez le monitoring"
fi
