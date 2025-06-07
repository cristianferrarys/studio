
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { RoleProvider } from '@/contexts/RoleContext';
import { BranchProvider } from '@/contexts/BranchContext';

export const metadata: Metadata = {
  title: 'CompVentFacil Mockup',
  description: 'Aplicación de gestión CompVentFacil',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <BranchProvider>
          <RoleProvider>
            {children}
            <Toaster />
          </RoleProvider>
        </BranchProvider>
      </body>
    </html>
  );
}
