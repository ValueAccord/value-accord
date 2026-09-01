import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://valueaccord.com'),
  title: 'Value Accord — One protocol. Any value.',
  description: 'An open protocol for payment intent, competitive routing, and verifiable settlement receipts.',
  icons: {
    icon: [{ url: '/favicon.svg?v=2', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg?v=2',
  },
  openGraph: {
    title: 'Value Accord — One protocol. Any value.',
    description: 'Open payment intent, competitive routing, and verifiable settlement receipts.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Value Accord — One protocol. Any value.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Value Accord — One protocol. Any value.',
    description: 'Open payment intent, competitive routing, and verifiable settlement receipts.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
