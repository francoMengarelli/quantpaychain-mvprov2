
/**
 * Hook para funcionalidades Post-Quantum Cryptography
 */

import { useState } from 'react';

export function usePQC() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const generateKeys = async (algorithm = 'kyber768', hybrid = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/qpc/pqc/generate-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm, hybrid }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const encrypt = async (data: string, publicKey: string, algorithm = 'kyber768') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/qpc/pqc/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, publicKey, algorithm }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const decrypt = async (encryptedData: any, privateKey: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/qpc/pqc/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encryptedData, privateKey }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const sign = async (data: string, privateKey: string, algorithm = 'dilithium3') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/qpc/pqc/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, privateKey, algorithm }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const verify = async (data: string, signature: any, publicKey: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/qpc/pqc/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, signature, publicKey }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    error,
    generateKeys,
    encrypt,
    decrypt,
    sign,
    verify,
  };
}
