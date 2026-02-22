import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ConvexProvider } from "@/lib/convex-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BDSMBRAZIL - Portal de Motéis com Suítes Temáticas BDSM",
  description: "O maior portal de motéis com suítes temáticas BDSM do Brasil. Encontre o prazer mais próximo de você.",
  keywords: ["BDSM", "Motel", "Suite Tematica", "Brazil", "Brasil", "Fantasia", "Pleasure"],
  authors: [{ name: "BDSMBRAZIL Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "BDSMBRAZIL - Portal de Motéis BDSM",
    description: "O maior portal de motéis com suítes temáticas BDSM do Brasil.",
    url: "https://bdsmbrazil.com.br",
    siteName: "BDSMBRAZIL",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "BDSMBRAZIL - Portal de Motéis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BDSMBRAZIL - Portal de Motéis BDSM",
    description: "O maior portal de motéis com suítes temáticas BDSM do Brasil.",
    images: ["https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?w=1200&h=630&fit=crop"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ConvexProvider>
          {children}
          <Toaster />
        </ConvexProvider>
      </body>
    </html>
  );
}
