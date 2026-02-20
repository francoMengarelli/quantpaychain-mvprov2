
/**
 * Hook para funcionalidades KYC/AML
 */

import { useState } from 'react';

export function useKYCAML() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const verifyCustomer = async (customer: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/qpc/kyc-aml/verify-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer }),
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
  
  const verifyDocument = async (documentImage: string, documentType: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/qpc/kyc-aml/verify-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentImage, documentType }),
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
  
  const analyzeTransaction = async (transaction: any, customerHistory?: any[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/qpc/kyc-aml/analyze-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction, customerHistory }),
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
  
  const checkSanctions = async (customer: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/qpc/kyc-aml/check-sanctions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer }),
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
    verifyCustomer,
    verifyDocument,
    analyzeTransaction,
    checkSanctions,
  };
}
