"use client";

import { useState } from "react";
import Header from "@/app/components/Header";
import "@/libs/fontawesome";
import { LangProvider } from "@/lang/LangProvider";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from 'next/dynamic';
import VideoBackground from "./VideoBackground";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Toaster } from 'react-hot-toast';

const Chat = dynamic(() => import('../chat'), {
  ssr: false
});

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  useAnalytics();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnMount: false,
          },
        },
      })
  );

  const shouldShowComponents = !pathname?.includes('tos') && !pathname?.includes('privacypolicy');

  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        <ThemeProvider>
          {shouldShowComponents && <Header />}
          <main className="bg-white/80 dark:bg-[#000000a8] overflow-x-hidden flex-1">
            {children}
          </main>
          {isAuthenticated && shouldShowComponents && <Chat />}
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                minWidth: '500px',
                zIndex: 9999,
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
                style: {
                  background: '#10b981',
                  color: '#fff',
                  borderRadius: '8px',
                  
                  zIndex: 9999,
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
                style: {
                  background: '#ef4444',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '4px',
                  zIndex: 9999,
                },
              },
            }}
          />
        </ThemeProvider>
      </LangProvider>
    </QueryClientProvider>
  );
} 