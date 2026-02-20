
'use client';

/**
 * Componente para parsear y visualizar mensajes ISO 20022
 */

import { useState } from 'react';
import { useISO20022 } from '@/hooks/qpc/useISO20022';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ISO20022Parser() {
  const { loading, error, parseMessage, transformToBlockchain } = useISO20022();
  const [xml, setXml] = useState('');
  const [result, setResult] = useState<any>(null);
  
  const handleParse = async () => {
    try {
      const data = await parseMessage(xml);
      setResult(data);
    } catch (err) {
      console.error('Error parsing message:', err);
    }
  };
  
  const handleTransform = async () => {
    try {
      const data = await transformToBlockchain(xml);
      setResult(data);
    } catch (err) {
      console.error('Error transforming message:', err);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>ISO 20022 Message Parser</CardTitle>
        <CardDescription>
          Parse and transform ISO 20022 messages to blockchain format
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">ISO 20022 XML Message</label>
          <Textarea
            value={xml}
            onChange={(e) => setXml(e.target.value)}
            placeholder="Paste your ISO 20022 XML message here..."
            rows={10}
            className="font-mono text-sm"
          />
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleParse} disabled={loading || !xml}>
            {loading ? 'Processing...' : 'Parse Message'}
          </Button>
          <Button onClick={handleTransform} disabled={loading || !xml} variant="outline">
            Transform to Blockchain
          </Button>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {result && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Result</label>
            <div className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-auto">
              <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
