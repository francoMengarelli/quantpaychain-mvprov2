
'use client';

/**
 * Componente para verificación KYC
 */

import { useState } from 'react';
import { useKYCAML } from '@/hooks/qpc/useKYCAML';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export function KYCVerification() {
  const { loading, error, verifyCustomer, checkSanctions } = useKYCAML();
  const [customer, setCustomer] = useState({
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    email: '',
  });
  const [result, setResult] = useState<any>(null);
  
  const handleVerify = async () => {
    try {
      const data = await verifyCustomer({
        ...customer,
        dateOfBirth: new Date(customer.dateOfBirth),
      });
      setResult(data);
    } catch (err) {
      console.error('Error verifying customer:', err);
    }
  };
  
  const handleCheckSanctions = async () => {
    try {
      const data = await checkSanctions({
        ...customer,
        dateOfBirth: new Date(customer.dateOfBirth),
      });
      setResult(data);
    } catch (err) {
      console.error('Error checking sanctions:', err);
    }
  };
  
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>KYC/AML Verification</CardTitle>
        <CardDescription>
          Verify customer identity and check against sanctions lists
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Customer ID</label>
            <Input
              value={customer.id}
              onChange={(e) => setCustomer({ ...customer, id: e.target.value })}
              placeholder="CUS-001"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">First Name</label>
            <Input
              value={customer.firstName}
              onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
              placeholder="John"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Last Name</label>
            <Input
              value={customer.lastName}
              onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
              placeholder="Doe"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Date of Birth</label>
            <Input
              type="date"
              value={customer.dateOfBirth}
              onChange={(e) => setCustomer({ ...customer, dateOfBirth: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Nationality</label>
            <Input
              value={customer.nationality}
              onChange={(e) => setCustomer({ ...customer, nationality: e.target.value })}
              placeholder="US"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={customer.email}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleVerify} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Customer'}
          </Button>
          <Button onClick={handleCheckSanctions} disabled={loading} variant="outline">
            Check Sanctions
          </Button>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {result && result.customerId && (
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Verification Result</h3>
              <Badge className={getRiskLevelColor(result.riskLevel)}>
                {result.riskLevel.toUpperCase()}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <p className="text-sm capitalize">{result.status}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Risk Score</label>
                <p className="text-sm">{result.riskScore}/100</p>
              </div>
            </div>
            
            {result.checks && result.checks.length > 0 && (
              <div>
                <label className="text-sm font-medium">Checks</label>
                <div className="space-y-2 mt-2">
                  {result.checks.map((check: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded">
                      <span className="text-sm capitalize">{check.type.replace('_', ' ')}</span>
                      <Badge variant={check.status === 'passed' ? 'default' : 'secondary'}>
                        {check.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {result.sanctions && (
              <div>
                <label className="text-sm font-medium">Sanctions Check</label>
                <p className="text-sm capitalize mt-1">
                  Status: {result.sanctions.status}
                </p>
                {result.sanctions.matches && result.sanctions.matches.length > 0 && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>
                      Found {result.sanctions.matches.length} potential match(es) in sanctions lists
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        )}
        
        {result && result.sanctions && !result.customerId && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-semibold">Sanctions Check Result</h3>
            <div>
              <label className="text-sm font-medium">Status</label>
              <p className="text-sm capitalize">{result.sanctions.status}</p>
            </div>
            {result.pep && (
              <div>
                <label className="text-sm font-medium">PEP Status</label>
                <p className="text-sm">{result.pep.isPEP ? 'Yes' : 'No'}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
