"use client";

import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import JoinWaitlistModal from "@/components/Home/JoinWaitlistModal";
// import { useNotification } from "@/hooks/useNotification";
import { NotificationContainer } from "@/components/Notification";

import "@/styles/Home.css";
import { useRef, useState } from "react";
import NewHeroSection from "@/components/Home/NewHeroSection";
import NewCapacitySection from "@/components/Home/NewCapacitySection";
import SpeakStackSection from "@/components/Home/SpeakStackSection";
import ReadyToBuild from "@/components/Home/ReadyToBuild";
import AnimatedAiLogo from "@/components/Animations/AnimatedAiLogo";
import AiChatModal from "./dashboard/_components/AiChatModal";

export default function Home() {
  const [joinWaitlistModal, setJoinWaitlistModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  // const { success, error, warning, info } = useNotification();

  const heroRef = useRef<HTMLDivElement | null>(null);
  const featuresRef = useRef<HTMLDivElement | null>(null);

  // const handleClick = () => {
  //   error("Opération failed !", "Error", 5000);
  // };

  return (
    <div className={`home ${joinWaitlistModal && "overflow"} x`}>
      {joinWaitlistModal && (
        <JoinWaitlistModal
          joinWaitlistModal={joinWaitlistModal}
          setJoinWaitlistModal={setJoinWaitlistModal}
        />
      )}

      <Header
        setJoinWaitlistModal={setJoinWaitlistModal}
        heroRef={heroRef}
        featuresRef={featuresRef}
        // contactRef={contactRef}
      />
      <NewHeroSection
        heroRef={heroRef}
        setJoinWaitlistModal={setJoinWaitlistModal}
      />
      {/* <WhatIsYamifySection /> */}
      <NewCapacitySection featuresRef={featuresRef} />
      <SpeakStackSection />
      <ReadyToBuild setJoinWaitlistModal={setJoinWaitlistModal} />

      {!showAiModal && (
        <div className="ai_logo_fixed" onClick={() => setShowAiModal(true)}>
          <AnimatedAiLogo />
        </div>
      )}

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
      <Footer />

      {showAiModal && <AiChatModal setShowAiModal={setShowAiModal} />}

      <NotificationContainer />
    </div>
  );
}
