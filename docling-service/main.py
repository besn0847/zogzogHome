from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import aiofiles
from pathlib import Path
import logging
from datetime import datetime
from pydantic import BaseModel
from typing import Optional
import requests
import json

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="DocPDF Docling Service",
    description="Service de conversion PDF vers Markdown utilisant Docling",
    version="1.0.0"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration des chemins
INPUT_DIR = Path("/app/input")
OUTPUT_DIR = Path("/app/output")
INPUT_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

# Modèles Pydantic
class ConversionRequest(BaseModel):
    document_id: str
    file_path: str
    callback_url: Optional[str] = None

class ConversionResponse(BaseModel):
    document_id: str
    status: str
    markdown_content: Optional[str] = None
    metadata: Optional[dict] = None
    error: Optional[str] = None

@app.get("/health")
async def health_check():
    """Vérification de l'état du service"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "docling-service",
        "version": "1.0.0"
    }

@app.post("/convert", response_model=ConversionResponse)
async def convert_pdf(
    background_tasks: BackgroundTasks,
    document_id: str,
    file: UploadFile = File(...)
):
    """Conversion d'un PDF en Markdown"""
    try:
        # Validation du fichier
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Seuls les fichiers PDF sont acceptés")
        
        # Sauvegarde temporaire du fichier
        temp_file_path = INPUT_DIR / f"{document_id}_{file.filename}"
        
        async with aiofiles.open(temp_file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        logger.info(f"Fichier reçu pour conversion: {document_id}")
        
        # Lancement de la conversion en arrière-plan
        background_tasks.add_task(
            process_document,
            document_id,
            str(temp_file_path)
        )
        
        return ConversionResponse(
            document_id=document_id,
            status="processing"
        )
        
    except Exception as e:
        logger.error(f"Erreur lors de la conversion: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

async def process_document(document_id: str, file_path: str):
    """Traitement du document en arrière-plan"""
    try:
        logger.info(f"Début du traitement du document {document_id}")
        
        # TODO: Intégration réelle avec Docling
        # Pour l'instant, simulation de la conversion
        await simulate_docling_conversion(document_id, file_path)
        
        # Notification au backend que le traitement est terminé
        await notify_backend_completion(document_id)
        
        logger.info(f"Traitement terminé pour le document {document_id}")
        
    except Exception as e:
        logger.error(f"Erreur lors du traitement du document {document_id}: {str(e)}")
        await notify_backend_error(document_id, str(e))

async def simulate_docling_conversion(document_id: str, file_path: str):
    """Simulation de la conversion Docling (à remplacer par l'intégration réelle)"""
    import asyncio
    
    # Simulation d'un traitement qui prend du temps
    await asyncio.sleep(5)
    
    # Génération d'un contenu Markdown simulé
    markdown_content = f"""# Document {document_id}

## Résumé
Ce document a été converti automatiquement depuis un fichier PDF en utilisant Docling.

## Contenu
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Section 1
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

### Section 2
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

## Métadonnées extraites
- **Nombre de pages**: 5
- **Langue**: Français
- **Mots-clés**: document, conversion, markdown

---
*Converti le {datetime.now().strftime('%d/%m/%Y à %H:%M')}*
"""
    
    # Sauvegarde du contenu Markdown
    output_file = OUTPUT_DIR / f"{document_id}.md"
    async with aiofiles.open(output_file, 'w', encoding='utf-8') as f:
        await f.write(markdown_content)
    
    return markdown_content

async def notify_backend_completion(document_id: str):
    """Notification au backend que la conversion est terminée"""
    try:
        backend_url = os.getenv('BACKEND_URL', 'http://backend:3001')
        
        # Lecture du contenu Markdown généré
        output_file = OUTPUT_DIR / f"{document_id}.md"
        async with aiofiles.open(output_file, 'r', encoding='utf-8') as f:
            markdown_content = await f.read()
        
        # Notification au backend
        response = requests.post(
            f"{backend_url}/api/documents/{document_id}/processing-complete",
            json={
                "status": "completed",
                "markdown_content": markdown_content,
                "metadata": {
                    "page_count": 5,
                    "language": "fr",
                    "extracted_at": datetime.now().isoformat()
                }
            },
            timeout=30
        )
        
        if response.status_code != 200:
            logger.error(f"Erreur lors de la notification au backend: {response.status_code}")
            
    except Exception as e:
        logger.error(f"Erreur lors de la notification de completion: {str(e)}")

async def notify_backend_error(document_id: str, error_message: str):
    """Notification au backend d'une erreur de conversion"""
    try:
        backend_url = os.getenv('BACKEND_URL', 'http://backend:3001')
        
        response = requests.post(
            f"{backend_url}/api/documents/{document_id}/processing-complete",
            json={
                "status": "failed",
                "error": error_message
            },
            timeout=30
        )
        
        if response.status_code != 200:
            logger.error(f"Erreur lors de la notification d'erreur au backend: {response.status_code}")
            
    except Exception as e:
        logger.error(f"Erreur lors de la notification d'erreur: {str(e)}")

@app.get("/status/{document_id}")
async def get_conversion_status(document_id: str):
    """Récupération du statut de conversion d'un document"""
    output_file = OUTPUT_DIR / f"{document_id}.md"
    
    if output_file.exists():
        async with aiofiles.open(output_file, 'r', encoding='utf-8') as f:
            content = await f.read()
        
        return ConversionResponse(
            document_id=document_id,
            status="completed",
            markdown_content=content
        )
    else:
        return ConversionResponse(
            document_id=document_id,
            status="processing"
        )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        log_level="info"
    )
