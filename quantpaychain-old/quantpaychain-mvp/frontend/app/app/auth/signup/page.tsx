
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LanguageToggle } from "@/components/language-toggle";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { toast } from "sonner";

export default function SignUpPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    import('@/lib/i18n');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          walletAddress: address || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        toast.success(t('auth.signUpSuccess'));
        setTimeout(() => {
          router.push("/auth/signin");
        }, 2000);
      } else {
        setError(data.error || t('auth.signUpError'));
      }
    } catch (error) {
      setError(t('auth.signUpError'));
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
              {t('auth.signUpTitle')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('auth.signUpSubtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Wallet Connection */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <ConnectButton />
              </div>
              
              {isConnected && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✓ Wallet connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Account Details</span>
              </div>
            </div>

            {success ? (
              <Alert>
                <AlertDescription>
                  {t('auth.signUpSuccess')} Redirecting to sign in...
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t('auth.firstName')}</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t('auth.lastName')}</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>

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
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
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
                  {isLoading ? t('common.loading') : t('auth.signUpButton')}
                </Button>
              </form>
            )}

            <div className="text-center text-sm">
              <span className="text-muted-foreground">{t('auth.hasAccount')} </span>
              <Link 
                href="/auth/signin" 
                className="text-primary hover:underline"
              >
                {t('auth.signIn')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
