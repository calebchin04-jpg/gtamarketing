import type { Metadata } from 'next';
import './globals.css';
import DifferenceCursor from '@/components/DifferenceCursor';

export const metadata: Metadata = {
  title: 'GTA Marketing Hub — The Circular Constellation',
  description: 'Discover the Greater Toronto Area local economy. Explore 30 industries, vote for your favourite businesses, and unlock exclusive deals through the GTA Marketing Hub.',
  keywords: 'GTA, Toronto, local business, directory, marketing hub, Greater Toronto Area',
  openGraph: {
    title: 'GTA Marketing Hub',
    description: 'The GTA\'s premium local business constellation.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <DifferenceCursor />
        {children}
      </body>
    </html>
  );
}
