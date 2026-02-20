
"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export function LanguageToggle() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Import i18n configuration
    import('@/lib/i18n');
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLang = i18n.language || 'en';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          {currentLang === 'es' ? 'ES' : 'EN'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage('en')}>
          🇺🇸 English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('es')}>
          🇪🇸 Español
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
