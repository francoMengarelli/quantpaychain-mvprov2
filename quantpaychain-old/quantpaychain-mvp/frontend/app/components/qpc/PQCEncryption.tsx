
'use client';

/**
 * Componente para demostrar encriptación post-cuántica
 */

import { useState } from 'react';
import { usePQC } from '@/hooks/qpc/usePQC';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function PQCEncryption() {
  const { loading, error, generateKeys, encrypt, decrypt } = usePQC();
  const [keyPair, setKeyPair] = useState<any>(null);
  const [plaintext, setPlaintext] = useState('');
  const [encryptedData, setEncryptedData] = useState<any>(null);
  const [decryptedText, setDecryptedText] = useState('');
  
  const handleGenerateKeys = async () => {
    try {
      const keys = await generateKeys();
      setKeyPair(keys);
    } catch (err) {
      console.error('Error generating keys:', err);
    }
  };
  
  const handleEncrypt = async () => {
    if (!keyPair) return;
    
    try {
      const encrypted = await encrypt(plaintext, keyPair.publicKey);
      setEncryptedData(encrypted);
    } catch (err) {
      console.error('Error encrypting:', err);
    }
  };
  
  const handleDecrypt = async () => {
    if (!keyPair || !encryptedData) return;
    
    try {
      const decrypted = await decrypt(encryptedData, keyPair.privateKey);
      setDecryptedText(decrypted.decrypted);
    } catch (err) {
      console.error('Error decrypting:', err);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Post-Quantum Cryptography</CardTitle>
        <CardDescription>
          Encrypt and decrypt data using quantum-resistant algorithms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="keys">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="keys">Generate Keys</TabsTrigger>
            <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
            <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
          </TabsList>
          
          <TabsContent value="keys" className="space-y-4">
            <Button onClick={handleGenerateKeys} disabled={loading}>
              {loading ? 'Generating...' : 'Generate PQC Key Pair'}
            </Button>
            
            {keyPair && (
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium">Public Key</label>
                  <div className="bg-slate-950 text-slate-50 p-2 rounded-md text-xs break-all">
                    {keyPair.publicKey.substring(0, 100)}...
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Algorithm</label>
                  <p className="text-sm text-muted-foreground">{keyPair.algorithm}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Created</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(keyPair.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="encrypt" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Data to Encrypt</label>
              <Input
                value={plaintext}
                onChange={(e) => setPlaintext(e.target.value)}
                placeholder="Enter text to encrypt..."
              />
            </div>
            
            <Button onClick={handleEncrypt} disabled={loading || !keyPair || !plaintext}>
              {loading ? 'Encrypting...' : 'Encrypt'}
            </Button>
            
            {encryptedData && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Encrypted Data</label>
                <div className="bg-slate-950 text-slate-50 p-2 rounded-md text-xs break-all">
                  {encryptedData.ciphertext.substring(0, 100)}...
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="decrypt" className="space-y-4">
            <Button onClick={handleDecrypt} disabled={loading || !encryptedData}>
              {loading ? 'Decrypting...' : 'Decrypt'}
            </Button>
            
            {decryptedText && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Decrypted Text</label>
                <div className="bg-green-950 text-green-50 p-4 rounded-md">
                  {decryptedText}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
