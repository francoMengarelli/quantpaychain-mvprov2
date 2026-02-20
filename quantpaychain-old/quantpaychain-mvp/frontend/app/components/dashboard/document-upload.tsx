
"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { uploadToIPFS } from "@/lib/pinata";
import { blockchainService } from "@/lib/blockchain";

interface DocumentUploadProps {
  onUploadComplete: (document: any) => void;
  remainingDocuments: number;
  canUpload: boolean;
}

export function DocumentUpload({ onUploadComplete, remainingDocuments, canUpload }: DocumentUploadProps) {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [requiresMultiSig, setRequiresMultiSig] = useState(false);
  const [signers, setSigners] = useState("");
  const [error, setError] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setDocumentTitle(file.name.replace(/\.[^/.]+$/, ""));
      setError("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleUpload = async () => {
    if (!selectedFile || !documentTitle.trim()) {
      setError("Please select a file and enter a title");
      return;
    }

    if (!canUpload) {
      setError("You've reached your plan limit. Please upgrade to continue.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError("");

    try {
      // Step 1: Upload to IPFS
      setUploadProgress(25);
      toast.loading("Uploading to IPFS...");
      
      const ipfsResult = await uploadToIPFS(selectedFile);
      
      setUploadProgress(50);
      toast.dismiss();
      toast.loading("Registering on blockchain...");

      // Step 2: Parse signers
      const signerAddresses = signers
        .split(',')
        .map(addr => addr.trim())
        .filter(addr => addr.length > 0);

      // Step 3: Register on blockchain
      const documentId = await blockchainService.registerDocument(
        ipfsResult.IpfsHash,
        documentTitle.trim(),
        signerAddresses,
        0, // No expiry
        requiresMultiSig,
        requiresMultiSig ? Math.min(signerAddresses.length, 2) : signerAddresses.length
      );

      setUploadProgress(75);

      // Step 4: Save to database
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: documentTitle.trim(),
          description: documentDescription.trim(),
          ipfsHash: ipfsResult.IpfsHash,
          blockchainId: documentId,
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: selectedFile.type,
          signers: signerAddresses,
          requiresMultiSig,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save document to database');
      }

      const savedDocument = await response.json();
      setUploadProgress(100);

      toast.dismiss();
      toast.success(t('dashboard.uploadSuccess'));
      
      onUploadComplete(savedDocument);
      
      // Reset form
      setSelectedFile(null);
      setDocumentTitle("");
      setDocumentDescription("");
      setSigners("");
      setRequiresMultiSig(false);
      
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
      toast.dismiss();
      toast.error(t('dashboard.uploadError'));
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          {t('dashboard.uploadTitle')}
        </CardTitle>
        <CardDescription>
          {t('dashboard.uploadSubtitle')}
        </CardDescription>
        {!canUpload && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t('dashboard.planLimitReached')} {t('dashboard.upgradePrompt')}
            </AlertDescription>
          </Alert>
        )}
        {canUpload && remainingDocuments <= 3 && (
          <Alert>
            <AlertDescription>
              {t('dashboard.freeDocumentsRemaining', { count: remainingDocuments })}
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : selectedFile 
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                : 'border-gray-300 hover:border-gray-400'
          } ${!canUpload ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <input {...getInputProps()} disabled={!canUpload || isUploading} />
          {selectedFile ? (
            <div className="space-y-2">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <FileText className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <p className="font-medium">
                  {isDragActive ? "Drop the file here" : "Drag & drop a document"}
                </p>
                <p className="text-sm text-muted-foreground">
                  PDF, DOC, DOCX, TXT, or images up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Document Details */}
        {selectedFile && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t('dashboard.documentTitle')}</Label>
              <Input
                id="title"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                placeholder="Enter document title"
                disabled={isUploading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={documentDescription}
                onChange={(e) => setDocumentDescription(e.target.value)}
                placeholder="Enter document description"
                disabled={isUploading}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signers">Signers (Wallet Addresses)</Label>
              <Textarea
                id="signers"
                value={signers}
                onChange={(e) => setSigners(e.target.value)}
                placeholder="Enter wallet addresses separated by commas (leave empty to sign yourself)"
                disabled={isUploading}
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to sign the document yourself, or enter wallet addresses of required signers
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="multiSig"
                checked={requiresMultiSig}
                onChange={(e) => setRequiresMultiSig(e.target.checked)}
                disabled={isUploading}
                className="rounded border-gray-300"
              />
              <Label htmlFor="multiSig" className="text-sm">
                Require multiple signatures (allows partial signing)
              </Label>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} />
            <p className="text-sm text-center text-muted-foreground">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !documentTitle.trim() || isUploading || !canUpload}
          className="w-full"
        >
          {isUploading ? t('common.loading') : t('dashboard.uploadButton')}
        </Button>
      </CardContent>
    </Card>
  );
}
