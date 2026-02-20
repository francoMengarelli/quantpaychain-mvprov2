
"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Eye, Calendar, Users, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { getIPFSUrl } from "@/lib/pinata";

interface Document {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  ipfsHash: string;
  fileName: string;
  fileSize: number;
  blockchainId?: string;
  signatures: Array<{
    id: string;
    status: string;
    signedAt?: string;
    signer: {
      name: string;
      email: string;
      walletAddress?: string;
    };
  }>;
}

interface DocumentListProps {
  documents: Document[];
  onRefresh: () => void;
}

export function DocumentList({ documents, onRefresh }: DocumentListProps) {
  const { t } = useTranslation();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="default" className="bg-green-500">{t('common.completed')}</Badge>;
      case 'PENDING':
        return <Badge variant="secondary">{t('common.pending')}</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">{t('common.failed')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewDocument = async (document: Document) => {
    try {
      const url = await getIPFSUrl(document.ipfsHash);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error opening document:', error);
    }
  };

  const handleDownload = async (document: Document) => {
    try {
      const response = await fetch(`/api/documents/${document.id}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = document.fileName;
        window.document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  if (documents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('dashboard.recentDocuments')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">{t('dashboard.noDocuments')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('dashboard.createFirstDocument')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {t('dashboard.recentDocuments')}
        </CardTitle>
        <CardDescription>
          Manage your uploaded documents and track signature status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('dashboard.documentTitle')}</TableHead>
                <TableHead>{t('dashboard.status')}</TableHead>
                <TableHead>{t('dashboard.signers')}</TableHead>
                <TableHead>{t('dashboard.createdAt')}</TableHead>
                <TableHead className="text-right">{t('dashboard.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">{document.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {document.fileName} • {(document.fileSize / 1024).toFixed(1)}KB
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(document.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {document.signatures.filter(s => s.status === 'SIGNED').length}/
                        {document.signatures.length}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDistanceToNow(new Date(document.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDocument(document)}>
                          <Eye className="h-4 w-4 mr-2" />
                          {t('common.view')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(document)}>
                          <Download className="h-4 w-4 mr-2" />
                          {t('common.download')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
