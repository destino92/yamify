// Fichier : app/layout.tsx
"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Script from 'next/script';
import "./globals.css";
import "@/styles/PageTransition.css";
// 1. Importez le composant DatadogRumInitializer
import DatadogRumInitializer from '@/components/DatadogRumInitializer';
import CreateAnimation from "@/components/Home/CreateAnimation";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [prevPathname, setPrevPathname] = useState("");
  
  // Messages à afficher pendant les transitions de page
  const loadingTxts = [
  "Loading your content...",
   ];

  useEffect(() => {
    // Si c'est la première fois que le composant est monté, ne pas afficher l'animation
    if (prevPathname === "") {
      setPrevPathname(pathname);
      return;
    }
    
    // Si le chemin a changé, déclencher l'animation
    if (pathname !== prevPathname) {
      setIsPageTransitioning(true);
      
      // Simuler un temps de chargement (vous pouvez ajuster ce délai)
      const timer = setTimeout(() => {
        setIsPageTransitioning(false);
        setPrevPathname(pathname);
      }, 5000); // 2 secondes d'animation
      
      return () => clearTimeout(timer);
    }
  }, [pathname, prevPathname]);

  return (
    <ClerkProvider>
      <html lang="en">
        <body
          // 2. Correction ici : utilisez .className au lieu de .variable
          // pour appliquer les classes CSS générées par Next.js Font.
          className={`${geistSans.className} ${geistMono.className} antialiased`}
        >
          {/* 3. Placez le composant DatadogRumInitializer ici, à l'intérieur du <body> */}
          <DatadogRumInitializer />
          <Toaster position="top-center" />
          {/* Animation de transition entre les pages */}
          {isPageTransitioning ? (
            <div className="page-transition-overlay ">
              <CreateAnimation
                successBool={true}
                barColor="#BDFFFB"
                loadingTxts={loadingTxts}
                title=""
              />
            </div>
          ) : children}
          <Script type="text/javascript" id="hs-script-loader" async defer src="//js-eu1.hs-scripts.com/146340379.js" />
          <Script async src="https://www.googletagmanager.com/gtag/js?id=G-HFCV4YMZ3D"></Script>
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-HFCV4YMZ3D');
            `}
          </Script>
        </body>
      </html>
    </ClerkProvider>
  );
}
