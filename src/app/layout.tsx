import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ConvexClientProvider } from '@/components/convex-client-provider';
import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server';
import { Modals } from '@/components/modals';
import { Toaster } from '@/components/ui/sonner';
import { JotaiProvider } from '@/components/jotai-provider';

const inter = Inter({ subsets: ['latin'], });

export const metadata: Metadata = {
  title: 'Slack Clone App',
  description: 'A Slack clone built with Next.js, Tailwind CSS, and Convex.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body className={inter.className}>
          <ConvexClientProvider>
            <JotaiProvider>
              <Toaster position="top-center" richColors />
              <Modals />
              {children}
            </JotaiProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
