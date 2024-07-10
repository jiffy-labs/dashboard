import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import '@uploadthing/react/styles.css';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Inter } from 'next/font/google';
import './globals.css';
import { auth } from '@/auth';
import { ClerkProvider } from '@clerk/nextjs'
import { PHProvider } from './providers';
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JiffyScan Dashboard',
  description: 'JiffyScan Dashboard'
};

const PostHogPageView = dynamic(() => import('./PostHogPageView'), {
  ssr: false,
})

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <ClerkProvider
    appearance={{
      elements: {
        footer: "hidden",
      },
    }}
    >
    <html lang="en" suppressHydrationWarning>
    <PHProvider>
      <body className={`${inter.className} overflow-hidden`}>
        <NextTopLoader />
        <Providers session={session}>
          <Toaster />
          {children}
        </Providers>
      </body>
      </PHProvider>
    </html>
    </ClerkProvider>
  );
}
