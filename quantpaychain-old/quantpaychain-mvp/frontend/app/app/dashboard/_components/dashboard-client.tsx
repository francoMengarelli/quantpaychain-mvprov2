
"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/language-toggle";
import { DocumentUpload } from "@/components/dashboard/document-upload";
import { DocumentList } from "@/components/dashboard/document-list";
import { UsageStats } from "@/components/dashboard/usage-stats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { LogOut, Settings, Bell, FileText, TrendingUp } from "lucide-react";
import { canCreateDocument, getRemainingDocuments } from "@/lib/freemium";
import { toast } from "sonner";

interface DashboardClientProps {
  user: {
    id: string;
    name?: string;
    email?: string;
    plan: string;
    walletAddress?: string;
    documents: Array<{
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
    }>;
    _count: {
      documents: number;
    };
  };
}

export function DashboardClient({ user }: DashboardClientProps) {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const { address, isConnected } = useAccount();
  const [documents, setDocuments] = useState(user.documents);
  const [documentsThisMonth, setDocumentsThisMonth] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    import('@/lib/i18n');
  }, []);

  useEffect(() => {
    // Calculate documents this month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthDocs = user.documents.filter(
      doc => new Date(doc.createdAt) >= firstDayOfMonth
    ).length;
    setDocumentsThisMonth(thisMonthDocs);
  }, [user.documents]);

  const canUpload = canCreateDocument(user.plan, documentsThisMonth);
  const remainingDocuments = getRemainingDocuments(user.plan, documentsThisMonth);

  const handleUploadComplete = (newDocument: any) => {
    setDocuments(prev => [newDocument, ...prev]);
    setDocumentsThisMonth(prev => prev + 1);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refresh page data
      window.location.reload();
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleUpgrade = () => {
    // Navigate to pricing or upgrade modal
    toast.info("Upgrade feature coming soon!");
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const pendingSignatures = documents.filter(doc => 
    doc.signatures.some(sig => sig.status === 'PENDING')
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold">QuantPay Chain</h1>
            </div>
            <Badge variant="outline" className="text-xs">
              {user.plan.toUpperCase()}
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <LanguageToggle />
            <ConnectButton />
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              {t('dashboard.settings')}
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              {t('common.signOut')}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">
            {t('dashboard.welcome')}, {user.name || user.email}
          </h2>
          <p className="text-muted-foreground">
            Manage your Web3 documents and digital signatures
          </p>
        </div>

        {/* Usage Stats */}
        <UsageStats 
          user={{
            plan: user.plan,
            documentsThisMonth,
            totalDocuments: user._count.documents,
          }}
          onUpgrade={handleUpgrade}
        />

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Upload */}
          <div className="lg:col-span-1">
            <DocumentUpload 
              onUploadComplete={handleUploadComplete}
              remainingDocuments={remainingDocuments}
              canUpload={canUpload}
            />
          </div>

          {/* Right Column - Lists */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Signatures */}
            {pendingSignatures.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-orange-500" />
                    {t('dashboard.pendingSignatures')}
                  </CardTitle>
                  <CardDescription>
                    Documents waiting for your signature
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {pendingSignatures.slice(0, 3).map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{doc.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.signatures.filter(s => s.status === 'PENDING').length} signatures pending
                          </p>
                        </div>
                        <Button size="sm">
                          {t('common.signDocument')}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Document List */}
            <DocumentList 
              documents={documents}
              onRefresh={handleRefresh}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents This Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {documents.filter(doc => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(doc.createdAt) >= weekAgo;
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {documents.length > 0 
                  ? Math.round((documents.filter(d => d.status === 'COMPLETED').length / documents.length) * 100)
                  : 0
                }%
              </div>
              <p className="text-xs text-muted-foreground">
                Average signature completion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">IPFS Storage</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(documents.reduce((acc, doc) => acc + doc.fileSize, 0) / 1024 / 1024).toFixed(1)}MB
              </div>
              <p className="text-xs text-muted-foreground">
                Total decentralized storage
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
