import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import '@/styles/global.css';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'Pakistan Air Quality Initiative (PAQI)',
  description: 'Clearing the Air for a Healthier Pakistan',
};
//backup branch
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable}  scroll-smooth`}>
      <body className="bg-brand-text-light text-brand-text-dark antialiased dark:bg-brand-dark dark:text-brand-text-light">
        {children}
      </body>
    </html>
  );
}
