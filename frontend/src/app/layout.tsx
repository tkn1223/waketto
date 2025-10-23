import type { ReactNode } from "react";
import { SWRConfig } from "swr";
import AmplifyProvider from "@/components/auth/AmplifyProvider.tsx";
import { Footer } from "@/components/layout/Footer.tsx";
import { Header } from "@/components/layout/Header.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { AuthProvider } from "@/contexts/AuthContext.tsx";
import { CategoryProvider } from "@/contexts/CategoryContext.tsx";
import { ViewModeProvider } from "@/contexts/ViewModeContext.tsx";
import { swrConfig } from "@/lib/swr.ts";

import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <AmplifyProvider>
          <SWRConfig value={swrConfig}>
            <AuthProvider>
              <ViewModeProvider>
                <CategoryProvider>
                  <Header />
                  {children}
                  <Toaster position="top-center" richColors />
                  <Footer />
                </CategoryProvider>
              </ViewModeProvider>
            </AuthProvider>
          </SWRConfig>
        </AmplifyProvider>
      </body>
    </html>
  );
}
