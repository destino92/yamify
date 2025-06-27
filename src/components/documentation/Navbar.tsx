"use client";

import React, { RefObject } from "react";
import "@/styles/HeroSection.css";
import { Button } from "../ui/button";

type NavItem = {
  id: string;
  label: string;
};

type Props = {
  navRef: RefObject<HTMLDivElement | null>;
  lightMode: boolean;
  activeTab: string;
  onTabChange: (tabId: string) => void;
};

const navItems: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "faqs", label: "FAQs" },
  { id: "education", label: "Education" },
  //{ id: "tutorial", label: "Tutorial" },
];

const Navbar: React.FC<Props> = ({ navRef, lightMode, activeTab, onTabChange }) => {
  return (
    <div className={`${lightMode && "light-mode"} hero-section  relative -top-95`} ref={navRef}>
      <div className="flex justify-center items-center">
        <div className="flex items-center justify-between w-[80%] DocNavbar z-50 py-4">
          {/* Navigation Items */}
          <div className="flex  gap-8 ">
            {navItems.map((item) => (
              <Button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`relative -left-5 text-sm font-medium transition-colors duration-200 py-2  cursor-pointer  rounded-none NavButton    px-20 content-button hover:bg-amber-500 hover:text-orange-200 ${
                  activeTab === item.id
                    ? "text-amber-500"
                    : "text-white" 
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5"></div>
                )}
              </Button>
            ))}
          </div>

          {/* Search   <div className="flex justify-end">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-6 text-sm w-72 bg-[#1a1a1a] border-none text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-0 rounded-none"
              />
            </div>
          </div>     Bar */}
          
        </div>
      </div>
    </div>
  );
};

export default Navbar;