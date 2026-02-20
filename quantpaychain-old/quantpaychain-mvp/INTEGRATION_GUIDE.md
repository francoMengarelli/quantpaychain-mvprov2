# QuantPay Chain - Guía de Integración Frontend-Backend

**Guía Práctica para Desarrolladores Frontend**

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Configuración Inicial](#configuración-inicial)
3. [Cliente API](#cliente-api)
4. [Manejo de Autenticación](#manejo-de-autenticación)
5. [Hooks Personalizados](#hooks-personalizados)
6. [Flujos Principales](#flujos-principales)
7. [Componentes de Ejemplo](#componentes-de-ejemplo)
8. [Manejo de Estados](#manejo-de-estados)
9. [Manejo de Errores](#manejo-de-errores)
10. [Mejores Prácticas](#mejores-prácticas)
11. [Testing](#testing)
12. [Próximos Pasos](#próximos-pasos)

---

## Introducción

Esta guía te ayudará a integrar el frontend de QuantPay Chain con el backend REST API desarrollado. Incluye:

- ✅ Configuración de cliente API
- ✅ Hooks personalizados reutilizables
- ✅ Ejemplos completos de cada flujo
- ✅ Manejo de autenticación con NextAuth
- ✅ Patrones de manejo de estados y errores
- ✅ Componentes de ejemplo listos para usar

### Stack Frontend

- **Framework:** Next.js 14 (App Router)
- **UI Library:** React 18
- **State Management:** React Hooks + Context API
- **Data Fetching:** fetch API (nativo)
- **Auth:** NextAuth.js
- **UI Components:** shadcn/ui + Radix UI
- **Forms:** react-hook-form + Zod
- **Payments:** Stripe Elements
- **Styling:** TailwindCSS

---

## Configuración Inicial

### 1. Instalar Dependencias (ya instaladas)

```bash
# Ya instaladas en el proyecto
npm install next-auth @stripe/stripe-js @stripe/react-stripe-js
```

### 2. Variables de Entorno Frontend

Asegúrate de tener estas variables en `.env`:

```env
# API Base URL (automático en Next.js)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-key"

# Stripe (lado cliente)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Web3 (opcional para MVP)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="..."
```

### 3. Estructura de Directorios Recomendada

```
frontend/app/
├── app/
│   ├── api/                  # Backend API routes (ya existentes)
│   ├── (routes)/             # Páginas de la app
│   │   ├── dashboard/
│   │   ├── properties/
│   │   ├── investments/
│   │   └── auth/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── properties/           # Componentes de propiedades
│   ├── investments/          # Componentes de inversiones
│   ├── payments/             # Componentes de pagos
│   ├── contracts/            # Componentes de contratos
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── api/                  # Funciones de API
│   │   ├── client.ts         # Cliente HTTP base
│   │   ├── properties.ts     # API de propiedades
│   │   ├── investments.ts    # API de inversiones
│   │   ├── payments.ts       # API de pagos
│   │   └── contracts.ts      # API de contratos
│   ├── hooks/                # Custom hooks
│   │   ├── useProperties.ts
│   │   ├── useInvestments.ts
│   │   └── useAuth.ts
│   └── utils.ts              # Utilidades
└── types/
    └── index.ts              # TypeScript types
```

---

## Cliente API

### Cliente HTTP Base

Crea `lib/api/client.ts`:

```typescript
// lib/api/client.ts

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, any>;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Importante para cookies de sesión
    };

    try {
      const response = await fetch(url, config);
      const data: ApiResponse<T> = await response.json();

      if (!response.ok || !data.success) {
        throw {
          message: data.error || 'Request failed',
          status: response.status,
          code: (data as any).code,
        } as ApiError;
      }

      return data.data as T;
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: error.message,
          status: 500,
        } as ApiError;
      }
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Método especial para multipart/form-data (upload de archivos)
  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      const data: ApiResponse<T> = await response.json();
      
      if (!response.ok || !data.success) {
        throw {
          message: data.error || 'Upload failed',
          status: response.status,
        } as ApiError;
      }
      
      return data.data as T;
    } catch (error) {
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
```

---

## Manejo de Autenticación

### Hook useAuth

Crea `lib/hooks/useAuth.ts`:

```typescript
// lib/hooks/useAuth.ts

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiClient } from '@/lib/api/client';

interface SignUpData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  country?: string;
}

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading' || loading;

  // Registro de usuario
  const signUp = async (data: SignUpData) => {
    setLoading(true);
    setError(null);

    try {
      await apiClient.post('/api/auth/signup', data);
      
      // Auto-login después de registro
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push('/dashboard');
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push('/dashboard');
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'Login failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      await signOut({ redirect: false });
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  return {
    user: session?.user,
    session,
    isAuthenticated,
    isLoading,
    error,
    signUp,
    login,
    logout,
  };
}
```

### Ejemplo: Componente de Login

```typescript
// components/auth/LoginForm.tsx

'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="investor@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}
```

---

## Hooks Personalizados

### Hook useProperties

Crea `lib/hooks/useProperties.ts`:

```typescript
// lib/hooks/useProperties.ts

import { useState, useEffect } from 'react';
import { apiClient, ApiError } from '@/lib/api/client';

export interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  status: string;
  city: string;
  country: string;
  totalPrice: string;
  tokenPrice: string;
  totalTokens: number;
  tokensSold: number;
  tokensAvailable: number;
  minimumInvestment: string;
  annualReturn: string;
  images: string[];
  fundingProgress: number;
  createdAt: string;
}

interface PropertiesFilters {
  propertyType?: string[];
  minPrice?: number;
  maxPrice?: number;
  minReturn?: number;
  city?: string[];
  country?: string[];
  status?: string[];
  search?: string;
}

interface PropertiesPagination {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface PropertiesResult {
  data: Property[];
  total: number;
  page: number;
  totalPages: number;
}

export function useProperties(
  filters?: PropertiesFilters,
  pagination?: PropertiesPagination
) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, [JSON.stringify(filters), JSON.stringify(pagination)]);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (filters?.propertyType) params.set('propertyType', filters.propertyType.join(','));
      if (filters?.minPrice) params.set('minPrice', filters.minPrice.toString());
      if (filters?.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
      if (filters?.minReturn) params.set('minReturn', filters.minReturn.toString());
      if (filters?.city) params.set('city', filters.city.join(','));
      if (filters?.country) params.set('country', filters.country.join(','));
      if (filters?.status) params.set('status', filters.status.join(','));
      if (filters?.search) params.set('search', filters.search);
      
      if (pagination?.page) params.set('page', pagination.page.toString());
      if (pagination?.limit) params.set('limit', pagination.limit.toString());
      if (pagination?.sortBy) params.set('sortBy', pagination.sortBy);
      if (pagination?.sortOrder) params.set('sortOrder', pagination.sortOrder);

      const result = await apiClient.get<PropertiesResult>(
        `/api/properties?${params.toString()}`
      );

      setProperties(result.data);
      setTotal(result.total);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => fetchProperties();

  return { properties, total, loading, error, refetch };
}

// Hook para propiedad individual
export function useProperty(id: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await apiClient.get<Property>(`/api/properties/${id}`);
        setProperty(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch property');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  return { property, loading, error };
}

// Hook para propiedades destacadas
export function useFeaturedProperties(limit: number = 6) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await apiClient.get<Property[]>(
          `/api/properties/featured?limit=${limit}`
        );
        setProperties(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch featured properties');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, [limit]);

  return { properties, loading, error };
}
```

### Hook useInvestments

Crea `lib/hooks/useInvestments.ts`:

```typescript
// lib/hooks/useInvestments.ts

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api/client';

export interface Investment {
  id: string;
  propertyId: string;
  amount: string;
  tokens: number;
  ownershipPercent: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED';
  paymentMethod?: string;
  createdAt: string;
  confirmedAt?: string;
  property: {
    id: string;
    title: string;
    city: string;
    annualReturn: string;
    images: string[];
  };
}

interface CreateInvestmentData {
  propertyId: string;
  amount: number;
  paymentMethod: 'STRIPE' | 'ETH' | 'USDC' | 'DAI' | 'BTC';
}

export function useInvestments(status?: string) {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvestments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = status ? `?status=${status}` : '';
      const data = await apiClient.get<Investment[]>(`/api/investments${params}`);
      setInvestments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch investments');
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  const createInvestment = async (data: CreateInvestmentData) => {
    try {
      const investment = await apiClient.post<Investment>('/api/investments', data);
      return { success: true, data: investment };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return { investments, loading, error, refetch: fetchInvestments, createInvestment };
}

// Hook para estadísticas de inversiones
export function useInvestmentStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await apiClient.get('/api/investments/stats');
        setStats(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}
```

---

## Flujos Principales

### Flujo 1: Marketplace de Propiedades

**Componente: PropertyMarketplace**

```typescript
// components/properties/PropertyMarketplace.tsx

'use client';

import { useState } from 'react';
import { useProperties } from '@/lib/hooks/useProperties';
import { PropertyCard } from './PropertyCard';
import { PropertyFilters } from './PropertyFilters';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function PropertyMarketplace() {
  const [filters, setFilters] = useState({
    status: ['FUNDING'],
    propertyType: [],
    minPrice: undefined,
    maxPrice: undefined,
  });
  const [page, setPage] = useState(1);

  const { properties, total, loading, error } = useProperties(filters, {
    page,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <PropertyFilters filters={filters} onChange={setFilters} />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {properties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No properties found matching your filters.
              </p>
            </div>
          )}

          {/* Paginación */}
          {total > 12 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {Math.ceil(total / 12)}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(total / 12)}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

### Flujo 2: Detalle de Propiedad con Calculadora

**Componente: PropertyDetail**

```typescript
// app/properties/[id]/page.tsx

'use client';

import { useState } from 'react';
import { useProperty } from '@/lib/hooks/useProperties';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const { property, loading, error } = useProperty(params.id);
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [projection, setProjection] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);

  const calculateInvestment = async () => {
    setCalculating(true);
    try {
      const result = await apiClient.post(
        `/api/properties/${params.id}/calculate`,
        { amount: investmentAmount }
      );
      setProjection(result);
    } catch (err) {
      console.error('Calculation failed:', err);
    } finally {
      setCalculating(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!property) return <div>Property not found</div>;

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Property Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {property.images.map((image, i) => (
          <img
            key={i}
            src={image}
            alt={`${property.title} - ${i + 1}`}
            className="w-full h-96 object-cover rounded-lg"
          />
        ))}
      </div>

      {/* Property Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-4xl font-bold">{property.title}</h1>
          <p className="text-xl text-muted-foreground">
            {property.city}, {property.country}
          </p>
          <p className="text-lg">{property.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoCard label="Total Price" value={`$${property.totalPrice}`} />
            <InfoCard label="Token Price" value={`$${property.tokenPrice}`} />
            <InfoCard label="Annual Return" value={`${property.annualReturn}%`} />
            <InfoCard label="Funded" value={`${property.fundingProgress}%`} />
          </div>
        </div>

        {/* Investment Calculator */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Investment Amount</label>
              <Input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                min={Number(property.minimumInvestment)}
                step={1000}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum: ${property.minimumInvestment}
              </p>
            </div>

            <Button onClick={calculateInvestment} disabled={calculating} className="w-full">
              {calculating ? 'Calculating...' : 'Calculate Returns'}
            </Button>

            {projection && (
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-sm">Tokens:</span>
                  <span className="font-medium">{projection.tokens}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Ownership:</span>
                  <span className="font-medium">{projection.ownershipPercent.toFixed(4)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Annual Return:</span>
                  <span className="font-medium text-green-600">
                    ${projection.annualReturn.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Monthly Return:</span>
                  <span className="font-medium">${projection.monthlyReturn.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>5-Year Projection:</span>
                  <span className="text-green-600">
                    ${projection.projections['5years'].toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <Button className="w-full" size="lg">
              Invest Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </CardContent>
    </Card>
  );
}
```

### Flujo 3: Inversión Completa (Selección → Pago → Contrato)

**Componente: InvestmentFlow**

```typescript
// components/investments/InvestmentFlow.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useInvestments } from '@/lib/hooks/useInvestments';
import { apiClient } from '@/lib/api/client';
import { PaymentForm } from './PaymentForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stepper } from '@/components/ui/stepper';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface InvestmentFlowProps {
  propertyId: string;
  amount: number;
}

export function InvestmentFlow({ propertyId, amount }: InvestmentFlowProps) {
  const router = useRouter();
  const { createInvestment } = useInvestments();
  const [step, setStep] = useState(1);
  const [investment, setInvestment] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Step 1: Crear inversión
  const handleCreateInvestment = async () => {
    setLoading(true);
    try {
      const result = await createInvestment({
        propertyId,
        amount,
        paymentMethod: 'STRIPE',
      });

      if (result.success) {
        setInvestment(result.data);
        setStep(2);
        await createPaymentIntent(result.data.id);
      } else {
        alert(result.error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Crear payment intent
  const createPaymentIntent = async (investmentId: string) => {
    setLoading(true);
    try {
      const result = await apiClient.post('/api/payments/stripe/create-intent', {
        investmentId,
        amount,
        currency: 'USD',
      });
      setClientSecret(result.clientSecret);
    } catch (err) {
      console.error('Failed to create payment intent:', err);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Después de pago exitoso
  const handlePaymentSuccess = async () => {
    setStep(3);
    
    // Generar contrato
    try {
      await apiClient.post('/api/contracts/generate', {
        investmentId: investment.id,
        propertyId,
      });
    } catch (err) {
      console.error('Failed to generate contract:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Stepper
        steps={['Create Investment', 'Payment', 'Contract']}
        currentStep={step}
      />

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Confirm Investment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Investment Amount:</span>
              <span className="font-bold">${amount.toLocaleString()}</span>
            </div>
            <Button onClick={handleCreateInvestment} disabled={loading} className="w-full">
              {loading ? 'Creating...' : 'Continue to Payment'}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && clientSecret && (
        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: { theme: 'stripe' },
              }}
            >
              <PaymentForm
                clientSecret={clientSecret}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Investment Successful! 🎉</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Your investment of ${amount.toLocaleString()} has been confirmed.
              Your contract has been generated and is ready for review.
            </p>
            <div className="flex gap-4">
              <Button onClick={() => router.push('/dashboard/investments')} className="flex-1">
                View Investments
              </Button>
              <Button
                onClick={() => router.push(`/contracts/${investment.id}`)}
                variant="outline"
                className="flex-1"
              >
                View Contract
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

**Componente: PaymentForm (Stripe)**

```typescript
// components/investments/PaymentForm.tsx

'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PaymentFormProps {
  clientSecret: string;
  onSuccess: () => void;
}

export function PaymentForm({ clientSecret, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message);
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/investments`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <PaymentElement />

      <Button type="submit" disabled={!stripe || processing} className="w-full">
        {processing ? 'Processing...' : 'Pay Now'}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Powered by Stripe. Your payment is secure.
      </p>
    </form>
  );
}
```

### Flujo 4: Dashboard de Usuario

**Componente: InvestmentsDashboard**

```typescript
// app/dashboard/investments/page.tsx

'use client';

import { useInvestments, useInvestmentStats } from '@/lib/hooks/useInvestments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function InvestmentsDashboardPage() {
  const { investments, loading: investmentsLoading } = useInvestments('CONFIRMED');
  const { stats, loading: statsLoading } = useInvestmentStats();

  if (investmentsLoading || statsLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">My Investments</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Invested"
          value={`$${Number(stats.totalInvested).toLocaleString()}`}
          icon="💰"
        />
        <StatCard
          title="Properties"
          value={stats.totalProperties}
          icon="🏢"
        />
        <StatCard
          title="Annual Return"
          value={`$${Number(stats.projectedAnnualReturn).toLocaleString()}`}
          icon="📈"
        />
        <StatCard
          title="Avg. Return"
          value={`${stats.averageReturn}%`}
          icon="⚡"
        />
      </div>

      {/* Portfolio Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.portfolioDistribution.map((dist: any) => (
              <div key={dist.propertyType}>
                <div className="flex justify-between mb-2">
                  <span>{dist.propertyType}</span>
                  <span className="font-medium">{dist.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${dist.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Investments List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Active Investments</h2>
        {investments.map((investment) => (
          <InvestmentCard key={investment.id} investment={investment} />
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: any; icon: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <span className="text-3xl">{icon}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function InvestmentCard({ investment }: { investment: any }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <img
            src={investment.property.images[0]}
            alt={investment.property.title}
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h3 className="font-bold text-lg">{investment.property.title}</h3>
            <p className="text-muted-foreground">{investment.property.city}</p>
            <div className="flex gap-4 mt-2 text-sm">
              <span>Amount: ${Number(investment.amount).toLocaleString()}</span>
              <span>Tokens: {investment.tokens}</span>
              <span>Return: {investment.property.annualReturn}%</span>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {investment.status}
            </span>
            <p className="text-sm text-muted-foreground mt-2">
              Since {new Date(investment.confirmedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-64" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  );
}
```

---

## Manejo de Estados

### Context para Estado Global (Opcional)

Si necesitas compartir estado entre muchos componentes, considera usar Context API:

```typescript
// lib/context/AppContext.tsx

'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AppState {
  currency: 'USD' | 'EUR';
  darkMode: boolean;
  // ... más estado global
}

interface AppContextType {
  state: AppState;
  setCurrency: (currency: 'USD' | 'EUR') => void;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    currency: 'USD',
    darkMode: false,
  });

  const setCurrency = (currency: 'USD' | 'EUR') => {
    setState((s) => ({ ...s, currency }));
  };

  const toggleDarkMode = () => {
    setState((s) => ({ ...s, darkMode: !s.darkMode }));
  };

  return (
    <AppContext.Provider value={{ state, setCurrency, toggleDarkMode }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
```

---

## Manejo de Errores

### Error Boundary

```typescript
// components/ErrorBoundary.tsx

'use client';

import { Component, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto py-12">
          <Alert variant="destructive">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              {this.state.error?.message || 'An unexpected error occurred'}
            </AlertDescription>
            <Button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4"
            >
              Try Again
            </Button>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## Mejores Prácticas

### 1. Optimización de Rendimiento

```typescript
// Usar React.memo para evitar re-renders innecesarios
import { memo } from 'react';

export const PropertyCard = memo(function PropertyCard({ property }) {
  // ...
});

// Usar useCallback para funciones que se pasan como props
const handleInvest = useCallback(() => {
  // ...
}, [dependencies]);

// Usar useMemo para cálculos costosos
const expensiveCalculation = useMemo(() => {
  return complexCalculation(data);
}, [data]);
```

### 2. Loading States Progresivos

```typescript
// Mostrar skeleton mientras carga
{loading && <Skeleton className="h-64" />}

// Mostrar contenido cuando está listo
{!loading && data && <Content data={data} />}

// Mostrar error si falla
{error && <ErrorMessage error={error} />}
```

### 3. Infinite Scroll / Pagination

```typescript
function useInfiniteProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const result = await apiClient.get<PropertiesResult>(
        `/api/properties?page=${page}&limit=12`
      );
      
      setProperties((prev) => [...prev, ...result.data]);
      setHasMore(result.page < result.totalPages);
      setPage((p) => p + 1);
    } finally {
      setLoading(false);
    }
  };

  return { properties, loadMore, loading, hasMore };
}
```

### 4. Debounce para Search

```typescript
import { useEffect, useState } from 'react';

function useDebounce(value: string, delay: number = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Uso en search
function PropertySearch() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  const { properties } = useProperties({ search: debouncedSearch });

  return (
    <Input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search properties..."
    />
  );
}
```

---

## Testing

### Setup de Testing

```bash
# Instalar dependencias de testing
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
```

### Ejemplo de Test

```typescript
// __tests__/hooks/useProperties.test.tsx

import { renderHook, waitFor } from '@testing-library/react';
import { useProperties } from '@/lib/hooks/useProperties';

// Mock fetch
global.fetch = jest.fn();

describe('useProperties', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch properties successfully', async () => {
    const mockProperties = {
      success: true,
      data: {
        data: [{ id: '1', title: 'Test Property' }],
        total: 1,
        page: 1,
        totalPages: 1,
      },
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProperties,
    });

    const { result } = renderHook(() => useProperties());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.properties).toHaveLength(1);
    expect(result.current.properties[0].title).toBe('Test Property');
  });

  it('should handle errors', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useProperties());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
  });
});
```

---

## Próximos Pasos

### Frontend Pendiente de Implementar

1. **Completar páginas principales:**
   - ✅ Homepage (ya existe)
   - ⚠️ Marketplace (integrar con hooks)
   - ⚠️ Property Detail (integrar calculadora)
   - ⚠️ Dashboard (integrar con API)
   - ❌ Contracts view
   - ❌ AI Auditor results view

2. **Flujos completos:**
   - ⚠️ Investment flow (parcial)
   - ❌ Payment processing (Stripe Elements)
   - ❌ Contract generation and view
   - ❌ AI analysis results

3. **Componentes adicionales:**
   - ❌ Investment calculator widget
   - ❌ Property comparison tool
   - ❌ Portfolio analytics charts
   - ❌ Notification center

4. **Optimizaciones:**
   - ❌ Image optimization (Next.js Image)
   - ❌ Route prefetching
   - ❌ Service Worker (PWA)
   - ❌ Analytics integration

5. **Testing:**
   - ❌ Unit tests para hooks
   - ❌ Integration tests para flujos
   - ❌ E2E tests con Playwright

---

## Conclusión

Esta guía proporciona una **base sólida** para integrar el frontend con el backend de QuantPay Chain:

✅ **Cliente API** configurado y reutilizable
✅ **Hooks personalizados** para cada módulo
✅ **Ejemplos completos** de flujos principales
✅ **Manejo robusto** de autenticación y errores
✅ **Mejores prácticas** de React y Next.js

**Siguiente paso:** Implementar los componentes faltantes usando los patrones establecidos en esta guía.

**Estado de integración:** 40% completo
- Backend API: ✅ 100%
- Hooks y utilidades: ✅ 70%
- Componentes UI: ⚠️ 30%
- Flujos completos: ⚠️ 40%

---

**Documentación generada:** Octubre 24, 2025  
**Versión:** 1.0.0

---

*Para referencia de API completa, ver [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)*
