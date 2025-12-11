import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
  const API = BACKEND_URL.endsWith('/api') ? BACKEND_URL : `${BACKEND_URL}/api`;

  useEffect(() => {
    const processAuth = async () => {
      // Get session_id from URL fragment
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1));
      const sessionId = params.get('session_id');

      if (!sessionId) {
        setError('No session ID found');
        setTimeout(() => navigate('/'), 2000);
        return;
      }

      try {
        // Call backend to create session
        await axios.post(
          `${API}/auth/session`,
          {},
          {
            headers: {
              'X-Session-ID': sessionId
            },
            withCredentials: true
          }
        );

        // Clean URL and redirect
        window.location.href = '/dashboard';
      } catch (err) {
        console.error('Auth error:', err);
        setError('Error de autenticación');
        setTimeout(() => navigate('/'), 2000);
      }
    };

    processAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center" data-testid="auth-callback">
      <div className="text-center">
        {error ? (
          <div>
            <p className="text-red-600 text-xl mb-4">{error}</p>
            <p className="text-gray-600">Redirigiendo...</p>
          </div>
        ) : (
          <div>
            <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
            <p className="text-xl text-gray-700">Procesando autenticación...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
