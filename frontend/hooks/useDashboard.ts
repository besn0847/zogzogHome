import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, type Document, type Collection } from '@/lib/api';

export interface FormattedDocument {
  id: string;
  title: string;
  type: string;
  size: string;
  lastModified: string;
  status: {
    text: string;
    color: string;
  };
  collection: string;
  preview: string;
}

export interface FormattedCollection {
  id: string;
  name: string;
  count: number;
  color: string;
}

// Helper functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getStatusInfo = (status: string) => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case 'processing':
      return { text: 'En cours', color: 'bg-yellow-100 text-yellow-800' };
    case 'completed':
    case 'processed':
      return { text: 'Terminé', color: 'bg-green-100 text-green-800' };
    case 'failed':
    case 'error':
      return { text: 'Échec', color: 'bg-red-100 text-red-800' };
    case 'uploaded':
      return { text: 'Téléversé', color: 'bg-blue-100 text-blue-800' };
    default:
      return { text: 'Inconnu', color: 'bg-gray-100 text-gray-800' };
  }
};

// Default stats object
const defaultStats = {
  totalDocuments: 0,
  documentsThisMonth: 0,
  totalConversations: 0,
  conversationsThisMonth: 0,
  totalCollections: 0,
  collectionsThisMonth: 0,
  storageUsed: '0 MB',
  storageLimit: '0 MB',
};

// Main hook
export const useDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  // Fetch documents
  const {
    data: documentsData,
    isLoading: isLoadingDocuments,
    error: documentsError,
    refetch: refetchDocuments,
  } = useQuery({
    queryKey: ['documents', { search: searchQuery, collection: selectedCollection }],
    queryFn: () =>
      api.getDocuments({
        search: searchQuery,
        collection: selectedCollection || undefined,
        limit: 10,
        page: 1,
      }),
    select: (response: { data?: { data?: Document[] } }) => response.data?.data || [],
  });

  // Fetch collections
  const {
    data: collectionsData,
    isLoading: isLoadingCollections,
    error: collectionsError,
  } = useQuery({
    queryKey: ['collections'],
    queryFn: () => api.getCollections(),
    select: (response: { data?: { collections?: Collection[] } }) => response.data?.collections || [],
  });

  // Fetch statistics
  const {
    data: statsData,
    isLoading: isLoadingStats,
    error: statsError,
  } = useQuery({
    queryKey: ['stats'],
    queryFn: () => api.getStats(),
    select: (response: { data?: any }) => response.data || defaultStats,
  });

  // Format document data for display
  const formatDocument = useCallback((doc: Document): FormattedDocument => ({
    id: doc._id,
    title: doc.title || 'Sans titre',
    type: doc.fileType ? doc.fileType.toUpperCase() : 'PDF',
    size: formatFileSize(doc.size || 0),
    lastModified: formatDate(doc.updatedAt || new Date().toISOString()),
    status: getStatusInfo((doc as any).status || ''),
    collection: (doc as any).collection?.name || 'Sans collection',
    preview: (doc as any).description || 'Aucune description disponible',
  }), []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'transformed':
      case 'processed':
        return 'bg-emerald-500';
      case 'processing':
      case 'uploaded':
        return 'bg-cyan-500';
      case 'error':
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  }, []);

  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case 'transformed':
      case 'processed':
        return 'Transformé';
      case 'processing':
        return 'En cours';
      case 'uploaded':
        return 'Téléversé';
      case 'error':
      case 'failed':
        return 'Erreur';
      default:
        return 'Inconnu';
    }
  }, []);

  // Handle search with debounce
  const handleSearch = useCallback((query: string) => {
    // Simple debounce could be implemented here
    setSearchQuery(query);
  }, []);

  // Handle collection selection
  const handleCollectionSelect = useCallback((collectionId: string | null) => {
    setSelectedCollection(collectionId);
  }, []);

  // Format collections data for the UI
  const formattedCollections = useMemo(() => 
    (collectionsData || []).map((collection: Collection) => ({
      id: collection._id,
      name: collection.name,
      count: collection.documentCount || 0,
      color: `bg-${collection.color || 'blue'}-500`
    })),
    [collectionsData]
  );

  // Format documents data for the UI
  const formattedDocuments = useMemo(
    () => (documentsData || []).map(formatDocument),
    [documentsData, formatDocument]
  );

  // Calculate loading and error states
  const isLoading = isLoadingDocuments || isLoadingCollections || isLoadingStats;
  const error = documentsError || collectionsError || statsError;

  return {
    // State
    searchQuery,
    setSearchQuery,
    selectedCollection,
    setSelectedCollection,
    
    // Data
    documents: formattedDocuments,
    collections: formattedCollections,
    stats: statsData || {
      totalDocuments: 0,
      documentsThisMonth: 0,
      totalConversations: 0,
      conversationsThisMonth: 0,
      totalCollections: 0,
      collectionsThisMonth: 0,
      storageUsed: '0 MB',
      storageLimit: '0 MB',
    },
    
    // Loading states
    isLoading,
    isLoadingDocuments,
    isLoadingCollections,
    isLoadingStats,
    
    // Errors
    error,
    documentsError,
    collectionsError,
    statsError,
    
    // Handlers
    handleSearch,
    handleCollectionSelect,
    
    // Formatters
    formatDocument,
    getStatusColor,
    getStatusText,
  };
};
