// yamify/src/app/documentation/page.tsx
"use client";

import React, { useRef, useState } from "react";
import Herosection from "@/components/documentation/Herosection";
import Navbar from "@/components/documentation/Navbar";
import HomeContent from "@/components/documentation/content/HomeContent";
import FAQsContent from "@/components/documentation/content/FAQsContent";
import EducationContent from "@/components/documentation/content/EducationContent";
import TutorialContent from "@/components/documentation/content/TutorialContent";
import ReadyToBuild from "@/components/Home/ReadyToBuild";
import Footer from "@/components/Home/Footer";


const DocumentationPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const featuresRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);
  
  // État pour gérer l'onglet actif et le mode clair/sombre
  const [activeTab, setActiveTab] = useState<string>("home");
  const [lightMode, setLightMode] = useState<boolean>(false);
  const [joinWaitlistModal, setJoinWaitlistModal] = useState(false);

  // Fonction pour changer d'onglet
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  // Fonction pour rendre le contenu en fonction de l'onglet actif
  const renderContent = () => {
    switch (activeTab) {
      case "faqs":
        return <div className="relative   "> <FAQsContent contentRef={contentRef} lightMode={lightMode} /></div>;
      case "education":
        return <div className="relative top-60  flex   "> <h1 className="text-2xl font-bold mb-8 text-white relative left-30">Education</h1><EducationContent contentRef={contentRef} lightMode={lightMode} /></div>;
      case "tutorial":
        return <div className="relative top-40   "><TutorialContent contentRef={contentRef} lightMode={lightMode} /></div>;
      default:
        return (
            <div className=" w-[80%]  flex justify-center items-center ">
          <HomeContent 
            contentRef={contentRef} 
            lightMode={lightMode} 
            onTabChange={handleTabChange}
          />
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen `}>
      {/* Hero Section */}
      <Herosection heroRef={heroRef} lightMode={lightMode} />
      
      {/* Navigation Bar */}
      <Navbar 
        navRef={navRef} 
        lightMode={lightMode} 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      <div className="content-wrapper">
  {renderContent()}
</div>
      {/* Content dynamique */}
      
      {/* Bouton pour basculer le mode (optionnel pour les tests) */}

      <div className=" relative top-50  pt-32">
        <div className="h-56"> </div>
      <ReadyToBuild setJoinWaitlistModal={setJoinWaitlistModal} />

      <Footer
  featuresRef={featuresRef}
  contactRef={contactRef}
  heroRef={heroRef}
  // capabilityRef={capabilityRef}
/>
      </div>

{/* <HeroSection heroRef={heroRef} lightMode={lightMode} /> */}

{/* <button onClick={handleClick}>Afficher une notification</button> */}
{/* <div className="section-containers">
  <WhatIfSection workIfRef={workIfRef} lightMode={lightMode} />
  <CapabilitySection
    capabilityRef={capabilityRef}
    lightMode={lightMode}
  />
  <YamLayersSection yamLayerRef={yamLayerRef} lightMode={lightMode} />
  <JoinWaitlistSection
    setJoinWaitlistModal={setJoinWaitlistModal}
    joinWaitlistRef={joinWaitlistRef}
    lightMode={lightMode}
  />
</div> */}


    </div>
  );
};

export default DocumentationPage;