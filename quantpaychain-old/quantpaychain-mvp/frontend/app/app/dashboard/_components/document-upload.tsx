

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  Check, 
  Loader2,
  Shield,
  Database
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface DocumentUploadProps {
  userId: string;
  currentUsage: number;
  planLimit: number;
}

export function DocumentUpload({ userId, currentUsage, planLimit }: DocumentUploadProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState('');

  const canUpload = currentUsage < planLimit;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title.trim()) {
      toast.error('Please select a file and enter a title');
      return;
    }

    if (!canUpload) {
      toast.error('You have reached your monthly limit. Please upgrade your plan.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Step 1: Upload to server
      setUploadStep('Uploading file...');
      setUploadProgress(20);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('userId', userId);

      const uploadResponse = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await uploadResponse.json();

      // Step 2: IPFS Upload
      setUploadStep('Storing on IPFS...');
      setUploadProgress(50);

      // Step 3: Blockchain Registration  
      setUploadStep('Registering on blockchain...');
      setUploadProgress(80);

      // Complete
      setUploadStep('Complete!');
      setUploadProgress(100);

      toast.success('Document uploaded and registered successfully!');
      
      // Reset form
      setFile(null);
      setTitle('');
      setDescription('');
      
      // Refresh page to show new document
      router.refresh();

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStep('');
    }
  };

  return (
    <div className="space-y-6">
      {!canUpload && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have reached your monthly limit of {planLimit} documents. 
            Please upgrade your plan to upload more documents.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleUpload} className="space-y-6">
        {/* File Upload Area */}
        <div className="space-y-2">
          <Label>Document File</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              disabled={isUploading || !canUpload}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              {file ? (
                <div className="flex items-center justify-center space-x-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Click to select a document</p>
                  <p className="text-sm text-gray-400 mt-1">PDF, DOC, DOCX, TXT (max 10MB)</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Document Details */}
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Document Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
              disabled={isUploading || !canUpload}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter document description"
              disabled={isUploading || !canUpload}
              rows={3}
            />
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <span className="text-sm font-medium">{uploadStep}</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
                <div className="text-xs text-gray-500">
                  This may take a few moments while we upload to IPFS and register on blockchain...
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Web3 Process Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <Upload className="h-3 w-3 text-blue-600" />
                </div>
                <span>1. Upload File</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <Database className="h-3 w-3 text-blue-600" />
                </div>
                <span>2. Store on IPFS</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="h-3 w-3 text-blue-600" />
                </div>
                <span>3. Blockchain Registry</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
          disabled={isUploading || !canUpload || !file || !title.trim()}
          size="lg"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload & Register Document
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
