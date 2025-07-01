"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import "./globals.css";
import "@/styles/PageTransition.css";
import DatadogRumInitializer from "@/components/DatadogRumInitializer";
import CreateAnimation from "@/components/Home/CreateAnimation";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

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

  const loadingTxts = ["Loading your content..."];

  useEffect(() => {
    if (prevPathname === "") {
      setPrevPathname(pathname);
      return;
    }

    if (pathname !== prevPathname) {
      setIsPageTransitioning(true);

      const timer = setTimeout(() => {
        setIsPageTransitioning(false);
        setPrevPathname(pathname);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [pathname, prevPathname]);

  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.className} ${geistMono.className} antialiased`}
        >
          {/* Google Tag Manager */}
          <Script id="gtm-script" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),
                    dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WL9HFFB7');
            `}
          </Script>

          <noscript
            dangerouslySetInnerHTML={{
              __html: `
                <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WL9HFFB7"
                height="0" width="0" style="display:none;visibility:hidden"></iframe>
              `,
            }}
          />

          <DatadogRumInitializer />
          <Toaster position="top-right" />

          {isPageTransitioning ? (
            <div className="page-transition-overlay">
              <CreateAnimation
                successBool={true}
                barColor="#BDFFFB"
                loadingTxts={loadingTxts}
                title=""
              />
            </div>
          ) : (
            children
          )}

          <Script
            type="text/javascript"
            id="hs-script-loader"
            async
            defer
            src="//js-eu1.hs-scripts.com/146340379.js"
          />
          <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-HFCV4YMZ3D"
          />
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
