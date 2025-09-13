import Image from "next/image";
import Link from "next/link";
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
          <header className="max-w-screen-x1 bg-emerald-100">
            <div className="flex items-center h-14 px-5">
              <Link aria-label="Home" href={"/dashboard"}>
                <Image
                  className="dark:invert"
                  src="/waketto.svg"
                  alt="支出わけっとlogo"
                  width={120}
                  height={20}
                  priority
                />
              </Link>
            </div>
          </header>
          {children}
          <footer className="py-2 flex flex-wrap items-center justify-center bg-emerald-100">
            <p>© 2025 支出わけっと</p>
          </footer>
        </AmplifyProvider>
      </body>
    </html>
  );
}
