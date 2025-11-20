export interface Document {
  id: string;
  name: string;
  type: 'whitepaper' | 'technical' | 'legal' | 'compliance' | 'other';
  size: number;
  url: string;
  downloadUrl?: string;
  uploadedAt: string;
  updatedAt: string;
  userId?: string;
  isPublic: boolean;
  description?: string;
  category?: string;
  tags?: string[];
}

export interface DocumentUploadRequest {
  file: File;
  type: Document['type'];
  description?: string;
  category?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface DocumentListResponse {
  documents: Document[];
  total: number;
  page: number;
  pageSize: number;
}
