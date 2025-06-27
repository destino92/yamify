"use client";

import React, { RefObject } from "react";
import Button from "@/components/Button/Button";
interface Props {
  contentRef: RefObject<HTMLDivElement | null>;
  lightMode: boolean;
  onTabChange: (tabId: string) => void;
}

const HomeContent: React.FC<Props> = ({ contentRef, lightMode, onTabChange }) => {
  return (
    <div className=" flex justify-center items-start w-[83%]  relative left-30">
       <h1 className="text-2xl font-bold mb-8 text-white"></h1>
    <div ref={contentRef} className={`   py-12 ${lightMode ? "light-mode" : ""}`}>
     
      
     
      <div className="doc-content-grid ">
        <div className="content-card">
          <h2>FAQs</h2>
          <p>Got questions? We&apos;ve answered the most common ones about using Yamify—from how it works to what you can deploy. Whether you&apos;re just curious or ready to launch, start here.</p>
          <div className="  relative left-10">
          <Button linkBtn={false}  yellow={true} onClick={() => onTabChange("faqs")} text="Read FAQs" />

          </div>
        
        </div>
        
        <div className="content-card">
          <h2>Education</h2>
          <p className=" border-b-1 border-white m-0 pb-10">New to infrastructure or curious about how Yamify works behind the scenes? Our educational content breaks down key concepts in simple terms—so you understand the &quot;why&quot; not just the &quot;how&quot;.</p>
          <div className="  relative left-10">
          <Button linkBtn={false} yellow={true} onClick={() => onTabChange("education")} text="Start Learning" />

          </div>
        </div>
        
        <div className="content-card">
          <h2>Tutorials</h2>
          <p>Follow clear, hands-on guides to deploy apps, connect services, and manage your cloud. No technical background needed—just follow along and launch with ease.</p>
          <div className="  relative left-10">
          <Button linkBtn={false} yellow={true} onClick={() => onTabChange("education")} text="Watch Tutorials" />

          </div>
        </div>
      </div>
        </div>



        
      
    </div>
   
  );
};

export default HomeContent;