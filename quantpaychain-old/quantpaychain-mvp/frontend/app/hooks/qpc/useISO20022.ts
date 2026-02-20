
/**
 * Hook para funcionalidades ISO 20022
 */

import { useState } from 'react';

export function useISO20022() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const parseMessage = async (xml: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/qpc/iso20022/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xml }),
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
  
  const transformToBlockchain = async (xml: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/qpc/iso20022/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xml }),
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
  
  const createMessage = async (messageType: string, data: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/qpc/iso20022/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageType, data }),
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
    parseMessage,
    transformToBlockchain,
    createMessage,
  };
}
