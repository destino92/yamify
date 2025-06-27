"use client";

import { ReactNode, useRef } from 'react';
import Header from '@/components/documentation/Header';

export default function DocumentationLayout({
  children,
}: {
  children: ReactNode;
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        heroRef={heroRef} 
        featuresRef={featuresRef} 
        setJoinWaitlistModal={() => {}} 
      />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
