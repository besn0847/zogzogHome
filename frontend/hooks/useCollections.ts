import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Types for Collections
export interface Collection {
  _id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  isPublic: boolean;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  members: CollectionMember[];
  settings: {
    allowPublicDocuments: boolean;
    requireApproval: boolean;
    autoTagging: boolean;
  };
  stats: {
    documentCount: number;
    totalSize: number;
    lastActivity: string;
  };
  shareToken?: string;
  shareTokenExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
  documentCount?: number;
  recentDocuments?: any[];
}

export interface CollectionMember {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  role: 'owner' | 'editor' | 'viewer';
  addedAt: string;
  isOwner?: boolean;
}

export interface CollectionStats {
  overview: {
    totalDocuments: number;
    totalSize: number;
    avgSize: number;
    totalMembers: number;
    chatSessions: number;
    storageUsagePercent: number;
  };
  statusDistribution: {
    pending: number;
    processing: number;
    completed: number;
    error: number;
  };
  documentsOverTime: Array<{
    _id: string;
    count: number;
  }>;
  topContributors: Array<{
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    documentCount: number;
    totalSize: number;
  }>;
  recentActivity: any[];
  collectionInfo: {
    createdAt: string;
    isPublic: boolean;
    settings: any;
  };
}

export interface ShareInfo {
  isPublic: boolean;
  shareToken: string | null;
  shareUrl: string | null;
  totalMembers: number;
  settings: any;
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
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const useCollections = () => {
  const queryClient = useQueryClient();

  // Fetch all collections
  const {
    data: collections,
    isLoading: collectionsLoading,
    error: collectionsError,
    refetch: refetchCollections
  } = useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      const response = await api.getCollections();
      // Handle case where collections might be empty or in different format
      const collectionsData = response.data?.collections || [];
      return Array.isArray(collectionsData) ? collectionsData as Collection[] : [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create collection mutation
  const createCollectionMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      description?: string;
      color?: string;
      icon?: string;
      isPublic?: boolean;
    }) => {
      const response = await api.createCollection(data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data?.collection;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });

  // Update collection mutation
  const updateCollectionMutation = useMutation({
    mutationFn: async ({ id, data }: {
      id: string;
      data: Partial<Collection>;
    }) => {
      const response = await api.updateCollection(id, data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data?.collection;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['collection', id] });
    },
  });

  // Delete collection mutation
  const deleteCollectionMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.deleteCollection(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });

  // Formatted collections for UI
  const formattedCollections = collections?.map(collection => ({
    id: collection._id,
    name: collection.name,
    description: collection.description || '',
    count: collection.documentCount || collection.stats?.documentCount || 0,
    color: collection.color,
    icon: collection.icon,
    isPublic: collection.isPublic,
    owner: `${collection.createdBy.firstName} ${collection.createdBy.lastName}`,
    members: collection.members?.length || 0,
    lastActivity: collection.stats?.lastActivity ? formatDate(collection.stats.lastActivity) : formatDate(collection.updatedAt),
    totalSize: collection.stats?.totalSize ? formatFileSize(collection.stats.totalSize) : '0 Bytes',
    createdAt: formatDate(collection.createdAt)
  })) || [];

  return {
    // Data
    collections,
    formattedCollections,
    
    // Loading states
    collectionsLoading,
    
    // Errors
    collectionsError,
    
    // Actions
    createCollection: createCollectionMutation.mutateAsync,
    updateCollection: updateCollectionMutation.mutateAsync,
    deleteCollection: deleteCollectionMutation.mutateAsync,
    refetchCollections,
    
    // Mutation states
    isCreating: createCollectionMutation.isPending,
    isUpdating: updateCollectionMutation.isPending,
    isDeleting: deleteCollectionMutation.isPending,
    
    // Mutation errors
    createError: createCollectionMutation.error,
    updateError: updateCollectionMutation.error,
    deleteError: deleteCollectionMutation.error,
  };
};

// Hook for individual collection details
export const useCollection = (id: string) => {
  const {
    data: collection,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['collection', id],
    queryFn: async () => {
      const response = await api.getCollection(id);
      return response.data?.collection as Collection;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    collection,
    isLoading,
    error,
    refetch
  };
};

// Hook for collection members
export const useCollectionMembers = (id: string) => {
  const queryClient = useQueryClient();

  const {
    data: members,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['collection-members', id],
    queryFn: async () => {
      const response = await api.getCollectionMembers(id);
      return response.data?.members as CollectionMember[];
    },
    enabled: !!id,
  });

  // Add member mutation
  const addMemberMutation = useMutation({
    mutationFn: async (data: { email: string; role: 'editor' | 'viewer' }) => {
      const response = await api.addCollectionMember(id, data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data?.member;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-members', id] });
      queryClient.invalidateQueries({ queryKey: ['collection', id] });
    },
  });

  // Update member role mutation
  const updateMemberMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'editor' | 'viewer' }) => {
      const response = await api.updateCollectionMember(id, userId, { role });
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data?.member;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-members', id] });
    },
  });

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.removeCollectionMember(id, userId);
      if (response.error) {
        throw new Error(response.error);
      }
      return userId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-members', id] });
      queryClient.invalidateQueries({ queryKey: ['collection', id] });
    },
  });

  return {
    members,
    isLoading,
    error,
    refetch,
    addMember: addMemberMutation.mutateAsync,
    updateMember: updateMemberMutation.mutateAsync,
    removeMember: removeMemberMutation.mutateAsync,
    isAddingMember: addMemberMutation.isPending,
    isUpdatingMember: updateMemberMutation.isPending,
    isRemovingMember: removeMemberMutation.isPending,
  };
};

// Hook for collection statistics
export const useCollectionStats = (id: string) => {
  const {
    data: stats,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['collection-stats', id],
    queryFn: async () => {
      const response = await api.getCollectionStats(id);
      return response.data?.stats as CollectionStats;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    stats,
    isLoading,
    error,
    refetch
  };
};

// Hook for collection sharing
export const useCollectionSharing = (id: string) => {
  const queryClient = useQueryClient();

  const {
    data: shareInfo,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['collection-share', id],
    queryFn: async () => {
      const response = await api.getCollectionSharing(id);
      return response.data?.shareInfo as ShareInfo;
    },
    enabled: !!id,
  });

  // Generate share link mutation
  const generateShareLinkMutation = useMutation({
    mutationFn: async (data: { action: 'generate' | 'regenerate' | 'revoke'; expiresIn?: string }) => {
      const response = await api.updateCollectionSharing(id, data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-share', id] });
    },
  });

  // Update sharing settings mutation
  const updateSharingMutation = useMutation({
    mutationFn: async (data: { isPublic?: boolean; settings?: any }) => {
      const response = await api.updateCollectionSharingSettings(id, data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data?.shareInfo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-share', id] });
      queryClient.invalidateQueries({ queryKey: ['collection', id] });
    },
  });

  return {
    shareInfo,
    isLoading,
    error,
    refetch,
    generateShareLink: generateShareLinkMutation.mutateAsync,
    updateSharing: updateSharingMutation.mutateAsync,
    isGeneratingLink: generateShareLinkMutation.isPending,
    isUpdatingSharing: updateSharingMutation.isPending,
  };
};
