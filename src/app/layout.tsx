import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Fira_Code } from 'next/font/google';
import { ToastContainer } from '@/components/ui/Toast';
import { PrototypeBehaviour } from '@/components/ui/PrototypeBehaviour';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-fira',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'percelme — Courier & Parcel Delivery',
  description: 'Smart logistics, COD reconciliation and next-generation courier platform.',
  icons: {
    icon: '/favicon.svg',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${firaCode.variable}`}>
      <body>
        {children}
        <ToastContainer />
        <PrototypeBehaviour />
      </body>
    </html>
  );
}
