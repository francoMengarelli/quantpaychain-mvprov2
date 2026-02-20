
"use client";

import { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LanguageToggle } from "@/components/language-toggle";
import { Separator } from "@/components/ui/separator";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { toast } from "sonner";

export default function SignInPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    import('@/lib/i18n');
  }, []);

  useEffect(() => {
    // Check if user is already signed in
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push("/dashboard");
      }
    };
    checkSession();
  }, [router]);

  useEffect(() => {
    // Auto-login with wallet if connected
    if (isConnected && address) {
      handleWalletSignIn();
    }
  }, [isConnected, address]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(t('auth.signInError'));
      } else {
        toast.success(t('common.success'));
        router.push("/dashboard");
      }
    } catch (error) {
      setError(t('auth.signInError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletSignIn = async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      const result = await signIn("ethereum", {
        message: `Sign in to QuantPay Chain with your wallet: ${address}`,
        redirect: false,
      });

      if (result?.error) {
        setError("Failed to sign in with wallet");
      } else {
        toast.success("Signed in with wallet");
        router.push("/dashboard");
      }
    } catch (error) {
      setError("Failed to sign in with wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Language Toggle */}
        <div className="flex justify-end">
          <LanguageToggle />
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {t('auth.signInTitle')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('auth.signInSubtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Wallet Connection */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <ConnectButton />
              </div>
              
              {isConnected && (
                <Button
                  onClick={handleWalletSignIn}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? t('common.loading') : t('auth.signInWithWallet')}
                </Button>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('common.loading') : t('auth.signInButton')}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">{t('auth.noAccount')} </span>
              <Link 
                href="/auth/signup" 
                className="text-primary hover:underline"
              >
                {t('auth.signUp')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
