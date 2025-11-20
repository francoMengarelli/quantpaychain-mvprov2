"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function ReportsPage() {
  const [loading, setLoading] = useState(false);

  const generateReport = async (type: string) => {
    setLoading(true);
    try {
      // TODO: Integrate with backend when deployed
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`${type} report generation coming soon!`);
    } catch (error) {
      toast.error("Error generating report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            ISO 20022 Reports
          </h1>
          <p className="text-gray-400">Generate compliant financial reports</p>
        </div>

        {/* Report Types */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="glass-effect border-purple-500/20 hover:border-purple-500/40 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <FileText className="mr-2 text-purple-400" size={20} />
                Transaction Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-4">
                Detailed transaction history with ISO 20022 compliance
              </p>
              <Button
                onClick={() => generateReport("Transaction")}
                disabled={loading}
                className="w-full qpc-gradient text-white"
              >
                <Download className="mr-2" size={16} />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-effect border-purple-500/20 hover:border-purple-500/40 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <FileText className="mr-2 text-blue-400" size={20} />
                Asset Valuation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-4">
                Current market valuation of all tokenized assets
              </p>
              <Button
                onClick={() => generateReport("Valuation")}
                disabled={loading}
                className="w-full bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
              >
                <Download className="mr-2" size={16} />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-effect border-purple-500/20 hover:border-purple-500/40 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <FileText className="mr-2 text-emerald-400" size={20} />
                Compliance Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-4">
                Regulatory compliance and audit trail documentation
              </p>
              <Button
                onClick={() => generateReport("Compliance")}
                disabled={loading}
                className="w-full bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
              >
                <Download className="mr-2" size={16} />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-effect border-purple-500/20 hover:border-purple-500/40 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <FileText className="mr-2 text-orange-400" size={20} />
                Payment Settlement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-4">
                Payment processing and settlement records
              </p>
              <Button
                onClick={() => generateReport("Payment")}
                disabled={loading}
                className="w-full bg-orange-500/20 text-orange-300 hover:bg-orange-500/30"
              >
                <Download className="mr-2" size={16} />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-effect border-purple-500/20 hover:border-purple-500/40 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <FileText className="mr-2 text-pink-400" size={20} />
                Portfolio Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-4">
                Comprehensive portfolio overview and performance
              </p>
              <Button
                onClick={() => generateReport("Portfolio")}
                disabled={loading}
                className="w-full bg-pink-500/20 text-pink-300 hover:bg-pink-500/30"
              >
                <Download className="mr-2" size={16} />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-effect border-purple-500/20 hover:border-purple-500/40 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Calendar className="mr-2 text-violet-400" size={20} />
                Custom Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-4">
                Create a custom report with specific parameters
              </p>
              <Button
                onClick={() => generateReport("Custom")}
                disabled={loading}
                className="w-full bg-violet-500/20 text-violet-300 hover:bg-violet-500/30"
              >
                <Download className="mr-2" size={16} />
                Configure & Generate
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card className="glass-effect border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No reports generated yet</p>
              <p className="text-sm">Generate your first report using the options above</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
