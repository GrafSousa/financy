import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

const interSans = Inter({
  variable: '--font-inter-sans-next',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Financy',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang='pt' className={`${interSans.variable}  h-full antialiased`}>
      <body className='min-h-full flex flex-col bg-gray-100'>{children}</body>
    </html>
  );
}
