"use client";

import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import JoinWaitlistModal from "@/components/Home/JoinWaitlistModal";

import "@/styles/Home.css";
import { useRef, useState } from "react";
import ReadyToBuild from "@/components/Home/ReadyToBuild";
import AnimatedAiLogo from "@/components/Animations/AnimatedAiLogo";
import AiChatModal from "../dashboard/_components/AiChatModal";
import HeroTechnicalSupport from "./_components/HeroTechnicalSupport";

export default function TechnicalSupportPage() {
  const [joinWaitlistModal, setJoinWaitlistModal] = useState(false);

  const [showAiModal, setShowAiModal] = useState(false);

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
      <HeroTechnicalSupport />
      <ReadyToBuild setJoinWaitlistModal={setJoinWaitlistModal} />

      {!showAiModal && (
        <div className="ai_logo_fixed" onClick={() => setShowAiModal(true)}>
          <AnimatedAiLogo />
        </div>
      )}

      <Footer />

      {showAiModal && <AiChatModal setShowAiModal={setShowAiModal} />}
    </div>
  );
}
