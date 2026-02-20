import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface KYCStatus {
  status: 'APPROVED' | 'PENDING_REVIEW' | 'PENDING_DOCUMENTS' | 'PENDING' | 'REJECTED' | null;
  verificationId: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState<KYCStatus>({ status: null, verificationId: null });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Extract KYC status from user metadata
        const metadata = session.user.user_metadata;
        setKycStatus({
          status: metadata?.kyc_status || null,
          verificationId: metadata?.kyc_verification_id || null,
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const metadata = session.user.user_metadata;
        setKycStatus({
          status: metadata?.kyc_status || null,
          verificationId: metadata?.kyc_verification_id || null,
        });
      } else {
        setKycStatus({ status: null, verificationId: null });
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    loading,
    signOut,
    isAuthenticated: !!user,
    kycStatus,
    isKycVerified: kycStatus.status === 'APPROVED',
    isKycPending: kycStatus.status === 'PENDING_REVIEW' || kycStatus.status === 'PENDING',
  };
}
