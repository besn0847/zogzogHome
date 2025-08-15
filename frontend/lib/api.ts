const API_BASE_URL = '/api';

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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { error: error.message || 'An error occurred' };
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
