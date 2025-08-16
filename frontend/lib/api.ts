const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3001/api';

export interface Document {
  _id: string;
  title: string;
  fileType: string;
  size: number;
  processingStatus: 'uploaded' | 'processing' | 'processed' | 'failed';
  collection?: string;
  preview?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    author?: string;
    subject?: string;
    pages?: number;
  };
}

export interface Collection {
  _id: string;
  name: string;
  color: string;
  isPublic: boolean;
  documentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    // Get JWT token from localStorage
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
        ...options.headers,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { error: error.error || error.message || 'An error occurred' };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('API Error:', error);
    return { error: 'Network error occurred' };
  }
}

export const api = {
  // Documents
  getDocuments: async (params?: {
    page?: number;
    limit?: number;
    collection?: string;
    status?: string;
    search?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.collection) query.append('collection', params.collection);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);

    return fetchApi<PaginatedResponse<Document>>(
      `/documents?${query.toString()}`
    );
  },

  getDocument: async (id: string) => {
    return fetchApi<Document>(`/documents/${id}`);
  },

  uploadDocument: async (file: File, collectionId?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (collectionId) {
      formData.append('collectionId', collectionId);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/documents/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return { error: error.message || 'Upload failed' };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Upload Error:', error);
      return { error: 'Network error occurred during upload' };
    }
  },

  // Collections
  getCollections: async () => {
    return fetchApi<{ collections: Collection[] }>('/collections');
  },

  createCollection: async (data: {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    isPublic?: boolean;
  }) => {
    return fetchApi<{ collection: Collection }>('/collections', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateCollection: async (id: string, data: Partial<Collection>) => {
    return fetchApi<{ collection: Collection }>(`/collections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteCollection: async (id: string) => {
    return fetchApi<{ message: string }>(`/collections/${id}`, {
      method: 'DELETE',
    });
  },

  getCollection: async (id: string) => {
    return fetchApi<{ collection: Collection }>(`/collections/${id}`);
  },

  getCollectionMembers: async (id: string) => {
    return fetchApi<{ members: any[] }>(`/collections/${id}/members`);
  },

  addCollectionMember: async (id: string, data: { email: string; role: string }) => {
    return fetchApi<{ member: any }>(`/collections/${id}/members`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateCollectionMember: async (id: string, userId: string, data: { role: string }) => {
    return fetchApi<{ member: any }>(`/collections/${id}/members/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  removeCollectionMember: async (id: string, userId: string) => {
    return fetchApi<{ message: string }>(`/collections/${id}/members/${userId}`, {
      method: 'DELETE',
    });
  },

  getCollectionStats: async (id: string) => {
    return fetchApi<{ stats: any }>(`/collections/${id}/stats`);
  },

  getCollectionSharing: async (id: string) => {
    return fetchApi<{ shareInfo: any }>(`/collections/${id}/share`);
  },

  updateCollectionSharing: async (id: string, data: any) => {
    return fetchApi<{ shareInfo: any }>(`/collections/${id}/share`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateCollectionSharingSettings: async (id: string, data: any) => {
    return fetchApi<{ shareInfo: any }>(`/collections/${id}/share`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Statistics
  getStats: async () => {
    return fetchApi<{
      totalDocuments: number;
      totalCollections: number;
      processingDocuments: number;
      recentActivity: number;
    }>('/documents/stats');
  },
};
