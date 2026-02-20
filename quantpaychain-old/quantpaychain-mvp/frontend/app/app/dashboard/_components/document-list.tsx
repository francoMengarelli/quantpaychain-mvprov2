

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Calendar, 
  Shield, 
  Eye, 
  Download,
  ExternalLink,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DocumentListProps {
  documents: any[];
  compact?: boolean;
}

export function DocumentList({ documents, compact = false }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No documents found</p>
        <p className="text-sm text-gray-400 mt-1">Upload your first document to get started</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FULLY_SIGNED': return 'bg-green-100 text-green-800';
      case 'PENDING_SIGNATURES': return 'bg-yellow-100 text-yellow-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'EXPIRED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'FULLY_SIGNED': return 'Completed';
      case 'PENDING_SIGNATURES': return 'Pending';
      case 'DRAFT': return 'Draft';
      case 'EXPIRED': return 'Expired';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <Card key={document.id} className="hover:shadow-md transition-shadow">
          <CardContent className={`${compact ? 'p-4' : 'p-6'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{document.title}</h3>
                  {document.description && !compact && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{document.description}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDistanceToNow(new Date(document.createdAt))} ago</span>
                    </div>
                    {document.blockchainTxHash && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <Shield className="h-3 w-3" />
                        <span>Verified</span>
                      </div>
                    )}
                    {!document.blockchainTxHash && (
                      <div className="flex items-center space-x-1 text-orange-600">
                        <Clock className="h-3 w-3" />
                        <span>Processing</span>
                      </div>
                    )}
                  </div>
                  {!compact && (
                    <div className="flex items-center space-x-2 mt-3">
                      <Badge className={getStatusColor(document.status)}>
                        {getStatusText(document.status)}
                      </Badge>
                      {document.signatures?.length > 0 && (
                        <Badge variant="outline">
                          {document.signatures.length} signature{document.signatures.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Button size="sm" variant="ghost">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Download className="h-4 w-4" />
                </Button>
                {document.ipfsHash && (
                  <Button size="sm" variant="ghost" asChild>
                    <a 
                      href={`https://gateway.pinata.cloud/ipfs/${document.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
            
            {!compact && document.blockchainTxHash && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-green-800 font-medium">Blockchain Verified</span>
                </div>
                <div className="mt-1 text-xs text-green-700 font-mono break-all">
                  {document.blockchainTxHash}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
