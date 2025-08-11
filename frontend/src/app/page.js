'use client'

import { useState } from 'react'
import { DocumentPlusIcon, MagnifyingGlassIcon, FolderIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <DocumentPlusIcon className="mx-auto h-24 w-24 text-blue-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            DocPDF Manager
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Gestionnaire intelligent de documents PDF avec IA
          </p>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                🎉 Application déployée avec succès !
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">✅ Services actifs</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Frontend (NextJS)</li>
                    <li>• Backend API</li>
                    <li>• Service Docling</li>
                    <li>• MongoDB</li>
                    <li>• Qdrant</li>
                    <li>• Redis</li>
                    <li>• Nginx</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">🔧 Fonctionnalités</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Upload de PDF</li>
                    <li>• Conversion Markdown</li>
                    <li>• Recherche vectorielle</li>
                    <li>• Chat avec IA</li>
                    <li>• Gestion collections</li>
                    <li>• Authentification</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">🚀 Prêt pour</h3>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Tests complets</li>
                    <li>• Développement</li>
                    <li>• Intégration LLM</li>
                    <li>• Production</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-gray-600">
                <strong>Architecture:</strong> Microservices avec Docker • 
                <strong>Frontend:</strong> NextJS + Tailwind • 
                <strong>Backend:</strong> NextJS API Routes • 
                <strong>Base de données:</strong> MongoDB + Qdrant + Redis
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
