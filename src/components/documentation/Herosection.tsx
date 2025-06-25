"use client";

import React ,{RefObject}from "react";
import Image from "next/image";
import "@/styles/HeroSection.css";




type Props = {
  heroRef: RefObject<HTMLDivElement | null>;
  lightMode: boolean;
};

const Herosection: React.FC<Props> = ({heroRef,lightMode}) => {
  return (
    <div className={`hero-section ${lightMode && "light-mode"} absolute top-22`} ref={heroRef}>
        
      <div className="   flex justify-center items-center ">
      
        <div className="flex items-center  w-[80%] DocHero">
            <div className="flex  items-center  gap-6 textDoc  ">
                
                <div className="mr-4 flex items-center gap-6">
                <Image 
                src="/svgs/yamify_logo_sm.svg"
                alt="Yamify Logo"
                width={20} 
                height={20}
                className="inline-block mr-2"
              />
              <span className="text-amber-500 font-bold text-xs">Yamify</span>
                </div>
             <div className="h-8 w-px bg-gray-700 mx-3"></div>
             <span className="text-white text-xs">Documentations</span>
          </div>
          
          {/* Logo de droite (pages compilées) */}
          <div className="flex justify-end  Compile">
            <Image 
              src="/svgs/pageCompile.svg"
              alt="Pages compilées"
              width={220} 
              height={200}
              className="object-contain "
            />
          </div>
        </div>
        
        
      </div>
    </div>
  );
};

export default Herosection;