
import type {Metadata, Viewport} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'FlexPay - P2P Task App',
  description: 'Modern P2P Payment and Task App',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-body antialiased bg-black flex items-center justify-center min-h-screen">
        <div className="relative w-full max-w-[430px] h-[100dvh] bg-background overflow-hidden flex flex-col shadow-2xl md:rounded-[3rem] md:border-[8px] md:border-muted overflow-hidden">
          <main className="flex-1 overflow-y-auto no-scrollbar pb-20">
            {children}
          </main>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
