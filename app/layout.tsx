import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Netflix Clone - FireStories',
  description: 'A Netflix clone with social clip sharing features',
  keywords: ['netflix', 'streaming', 'movies', 'tv shows', 'social', 'clips'],
  authors: [{ name: 'FireStories Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/netflix-icon.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <div id="root">
          {children}
        </div>
        
        {/* Portal for modals */}
        <div id="modal-root"></div>
        
        {/* Notification container */}
        <div id="notification-root"></div>
      </body>
    </html>
  );
}