'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import './globals.css';

export default function RootLayout({ children }) {
  const { theme } = useStore();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      }
    }
  }, [theme]);

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <title>Conversor de Moedas - SkyyHd</title>
        <meta name="description" content="Aplicativo de conversão de moedas rápido e preciso" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💱</text></svg>" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}