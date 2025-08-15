'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { api, type Collection } from '@/lib/api';
import { type FormattedCollection } from '@/hooks/useDashboard';

interface DocumentUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collections: FormattedCollection[];
}

export default function DocumentUploadModal({ 
  open, 
  onOpenChange, 
  collections 
}: DocumentUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: ({ file, collectionId }: { file: File; collectionId?: string }) => 
      api.uploadDocument(file, collectionId),
    onSuccess: (result) => {
      if (result.error) {
        console.error('Upload failed:', result.error);
      } else {
        // Invalidate and refetch documents
        queryClient.invalidateQueries({ queryKey: ['documents'] });
        queryClient.invalidateQueries({ queryKey: ['stats'] });
        
        // Reset form and close modal after success
        setTimeout(() => {
          setSelectedFile(null);
          setSelectedCollection('');
          onOpenChange(false);
        }, 1500);
      }
    },
  });

  const handleFileSelect = (file: File) => {
    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      return;
    }
    
    // Check file size (limit to 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return;
    }
    
    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    
    uploadMutation.mutate({
      file: selectedFile,
      collectionId: selectedCollection && selectedCollection !== 'none' ? selectedCollection : undefined,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isUploading = uploadMutation.isPending;
  const uploadError = uploadMutation.data?.error;
  const uploadSuccess = uploadMutation.isSuccess && !uploadMutation.data?.error;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouveau document</DialogTitle>
          <DialogDescription>
            Téléversez un fichier PDF pour l'ajouter à votre collection
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Drop Zone */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300 hover:border-gray-400'
            } ${selectedFile ? 'border-green-300 bg-green-50' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            
            {selectedFile ? (
              <div className="flex items-center justify-center space-x-2">
                <FileText className="h-8 w-8 text-green-600" />
                <div className="text-left">
                  <p className="font-medium text-green-800">{selectedFile.name}</p>
                  <p className="text-sm text-green-600">{formatFileSize(selectedFile.size)}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium">Glissez votre fichier PDF ici</p>
                  <p className="text-sm text-gray-500">ou cliquez pour sélectionner</p>
                </div>
                <p className="text-xs text-gray-400">Maximum 50MB</p>
              </div>
            )}
          </div>

          {/* Collection Selection */}
          <div className="space-y-2">
            <Label htmlFor="collection">Collection (optionnel)</Label>
            <Select value={selectedCollection} onValueChange={setSelectedCollection} disabled={isUploading}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucune collection</SelectItem>
                {collections.map((collection) => (
                  <SelectItem key={collection.id} value={collection.id}>
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Téléversement en cours...</span>
                <span>0%</span>
              </div>
              <Progress value={0} className="w-full" />
            </div>
          )}

          {/* Error Message */}
          {uploadError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {uploadSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Document téléversé avec succès !
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? 'Téléversement...' : 'Téléverser'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
