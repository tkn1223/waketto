import type { ReactNode } from "react";
import AmplifyProvider from "@/components/auth/AmplifyProvider.tsx";
import { Footer } from "@/components/layout/Footer.tsx";
import { Header } from "@/components/layout/Header.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { AuthProvider } from "@/contexts/AuthContext.tsx";
import { ViewModeProvider } from "@/contexts/ViewModeContext";
import { CategoryProvider } from "@/contexts/CategoryContext.tsx";
import { SWRConfig } from "swr";
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
