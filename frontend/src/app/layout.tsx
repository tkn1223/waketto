import Image from "next/image";
import Link from "next/link";
import { Github } from "lucide-react";
import AmplifyProvider from "@/components/auth/AmplifyProvider";

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <AmplifyProvider>
          <header className="bg-muted">
            <div className="mx-auto flex h-14 max-w-screen-x1 items-center px-4">
              <Link
                aria-label="Home"
                className="flex items-center gap-2"
                href={"#"}
              >
                <Image
                  className="dark:invert"
                  src="/next.svg"
                  alt="Next.js logo"
                  width={120}
                  height={20}
                  priority
                />
              </Link>
            </div>
          </header>
          {children}
          <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://github.com/tkn1223/waketto"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github aria-hidden width={16} height={16} />
              GitHubリポジトリにアクセス →
            </a>
          </footer>
        </AmplifyProvider>
      </body>
    </html>
  );
}
