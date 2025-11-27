import '../styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Dravikly - AI-Powered Customer Friction Detector',
    template: '%s | Dravikly'
  },
  description: 'Analyze your conversion funnels and detect friction points with AI-powered insights. Get actionable recommendations to eliminate friction and boost conversions.',
  keywords: ['conversion optimization', 'friction analysis', 'AI analysis', 'CRO', 'landing page optimization'],
  authors: [{ name: 'Dravikly' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Dravikly',
    title: 'Dravikly - AI-Powered Customer Friction Detector',
    description: 'Analyze your conversion funnels and detect friction points with AI-powered insights.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dravikly - AI-Powered Customer Friction Detector',
    description: 'Analyze your conversion funnels and detect friction points with AI-powered insights.',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
