
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileCheck, AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: 'Server Configuration Error',
    description: 'There is a problem with the server configuration. Please try again later.',
  },
  AccessDenied: {
    title: 'Access Denied',
    description: 'You do not have permission to sign in. Please contact support if you believe this is an error.',
  },
  Verification: {
    title: 'Unable to Verify',
    description: 'The verification link is invalid or has expired. Please request a new verification email.',
  },
  Signin: {
    title: 'Sign In Failed',
    description: 'The sign in attempt failed. Please check your credentials and try again.',
  },
  OAuthSignin: {
    title: 'OAuth Sign In Error',
    description: 'There was an error during the OAuth sign in process. Please try again.',
  },
  OAuthCallback: {
    title: 'OAuth Callback Error',
    description: 'There was an error processing the OAuth callback. Please try again.',
  },
  OAuthCreateAccount: {
    title: 'OAuth Account Creation Failed',
    description: 'Could not create an account with the OAuth provider. Please try again or use a different method.',
  },
  EmailCreateAccount: {
    title: 'Email Account Creation Failed',
    description: 'Could not create an account with this email. The email may already be in use.',
  },
  Callback: {
    title: 'Callback Error',
    description: 'There was an error in the callback process. Please try signing in again.',
  },
  OAuthAccountNotLinked: {
    title: 'Account Not Linked',
    description: 'The OAuth account is not linked to any existing user. Please sign up first or link your accounts.',
  },
  EmailSignin: {
    title: 'Email Sign In Failed',
    description: 'The email sign in failed. Please check your email and try again.',
  },
  CredentialsSignin: {
    title: 'Invalid Credentials',
    description: 'The email or password you entered is incorrect. Please check your credentials and try again.',
  },
  SessionRequired: {
    title: 'Session Required',
    description: 'You must be signed in to view this page.',
  },
  Default: {
    title: 'Authentication Error',
    description: 'An unexpected authentication error occurred. Please try again.',
  },
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error') || 'Default';
  
  const errorInfo = ERROR_MESSAGES[error] || ERROR_MESSAGES.Default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
              <FileCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              QuantPay Chain
            </span>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-900">{errorInfo.title}</CardTitle>
            <CardDescription className="text-red-700">
              {errorInfo.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Error code: {error}
              </AlertDescription>
            </Alert>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3">
            <Button 
              asChild 
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
            >
              <Link href="/auth/signin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Try Again
              </Link>
            </Button>
            
            <div className="flex space-x-3 w-full">
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link href="/">Home</Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          If you continue to experience issues, please contact{' '}
          <a href="mailto:support@quantpaychain.com" className="text-blue-600 hover:underline">
            support@quantpaychain.com
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-red-900">Loading...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
