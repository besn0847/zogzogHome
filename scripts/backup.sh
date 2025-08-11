#!/bin/bash

# Script de sauvegarde pour DocPDF Manager
# Usage: ./scripts/backup.sh [destination]

set -e

BACKUP_DIR="${1:-./backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="docpdf_backup_${TIMESTAMP}"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"

echo "💾 Démarrage de la sauvegarde DocPDF Manager"
echo "📁 Destination: ${BACKUP_PATH}"

# Création du répertoire de sauvegarde
mkdir -p "${BACKUP_PATH}"

# Sauvegarde MongoDB
echo "🗄️ Sauvegarde de MongoDB..."
docker-compose exec -T mongodb mongodump --out /tmp/mongodb_backup
docker cp $(docker-compose ps -q mongodb):/tmp/mongodb_backup "${BACKUP_PATH}/mongodb"
docker-compose exec -T mongodb rm -rf /tmp/mongodb_backup

# Sauvegarde Qdrant
echo "🔍 Sauvegarde de Qdrant..."
docker-compose exec -T qdrant tar -czf /tmp/qdrant_backup.tar.gz /qdrant/storage
docker cp $(docker-compose ps -q qdrant):/tmp/qdrant_backup.tar.gz "${BACKUP_PATH}/qdrant_backup.tar.gz"
docker-compose exec -T qdrant rm -f /tmp/qdrant_backup.tar.gz

# Sauvegarde des fichiers PDF
echo "📄 Sauvegarde des fichiers PDF..."
if [ -d "data/pdfs" ]; then
    cp -r data/pdfs "${BACKUP_PATH}/pdfs"
    echo "✅ Fichiers PDF sauvegardés"
else
    echo "⚠️ Répertoire PDF non trouvé"
fi

# Sauvegarde des fichiers Markdown
echo "📝 Sauvegarde des fichiers Markdown..."
if [ -d "data/markdown" ]; then
    cp -r data/markdown "${BACKUP_PATH}/markdown"
    echo "✅ Fichiers Markdown sauvegardés"
else
    echo "⚠️ Répertoire Markdown non trouvé"
fi

# Sauvegarde de la configuration
echo "⚙️ Sauvegarde de la configuration..."
cp .env "${BACKUP_PATH}/.env" 2>/dev/null || echo "⚠️ Fichier .env non trouvé"
cp docker-compose.yml "${BACKUP_PATH}/docker-compose.yml"

# Création d'un fichier de métadonnées
echo "📋 Création des métadonnées de sauvegarde..."
cat > "${BACKUP_PATH}/backup_info.txt" << EOF
DocPDF Manager Backup
Date: $(date)
Version: 1.0.0
Services inclus:
- MongoDB (base de données)
- Qdrant (recherche vectorielle)
- Fichiers PDF originaux
- Fichiers Markdown convertis
- Configuration système

Pour restaurer cette sauvegarde:
1. Arrêtez les services: docker-compose down
2. Restaurez les données avec le script restore.sh
3. Redémarrez les services: docker-compose up -d
EOF

# Compression de la sauvegarde
echo "🗜️ Compression de la sauvegarde..."
cd "${BACKUP_DIR}"
tar -czf "${BACKUP_NAME}.tar.gz" "${BACKUP_NAME}"
rm -rf "${BACKUP_NAME}"

echo ""
echo "✅ Sauvegarde terminée avec succès !"
echo "📦 Archive créée: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
echo "📊 Taille: $(du -h "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" | cut -f1)"
echo ""
echo "💡 Pour restaurer cette sauvegarde:"
echo "   ./scripts/restore.sh ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
