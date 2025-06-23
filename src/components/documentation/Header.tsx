"use client";

import Image from "next/image";
import Link from "next/link";
import React, { RefObject, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/Header.css";
import Button from "../Button/Button";
import FeaturesContainer from "../Home/FeaturesContainer";
import LineRain from "../Animations/LineRain";
import routes from "@/libs/routes";

type Props = {
  setJoinWaitlistModal: (value: boolean) => void;
  heroRef: RefObject<HTMLDivElement | null>;
  featuresRef: RefObject<HTMLDivElement | null>;
  // contactRef: RefObject<HTMLDivElement | null>;
};

const Header = ({ heroRef, featuresRef }: Props) => {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToWork = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpenMenu(false);
    scrollToSection(heroRef);
  };

  // const handleScrollToContact = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   setOpenMenu(false);
  //   scrollToSection(contactRef);
  // };

  const handleScrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpenMenu(false);
    scrollToSection(featuresRef);
  };

  const scrollToSection = (ref: RefObject<HTMLElement | null>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300); // Delay to ensure DOM is ready after navigation
  };

  return (
    <header className={`main-header ${scrolled ? "scrolled" : ""} `}>
      <section>
        <Link href="/" className="logo">
          <div className="menu">
            {openMenu ? (
              <Image
                src="/svgs/close.svg"
                alt=""
                width={20}
                height={20}
                onClick={() => setOpenMenu(false)}
              />
            ) : (
              <Image
                src="/svgs/Menu.svg"
                alt=""
                width={20}
                height={20}
                onClick={() => setOpenMenu(true)}
              />
            )}
          </div>

          <Image
            src={"/svgs/yamify_logo_sm.svg"}
            alt="Yamify Logo"
            className="logo-img"
            width={20}
            height={25.333}
          />
          <h1>Yamify</h1>
        </Link>

        <nav>
          <div className="nav-link" onClick={handleScrollToWork}>
            <span>Home</span>
            <span className="hover-text">Home</span>
          </div>
          <div
            className="feature-link"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="wrap-link">
              <div className="nav-link" onClick={handleScrollToFeatures}>
                <span>Features</span>
                <span className="hover-text">Features</span>
              </div>
              <Image src="/svgs/caret_down.svg" alt="" width={15} height={15} />
            </div>

            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <FeaturesContainer />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="nav-link">
        
            <span className="hover-text">Ressources</span>
          </div>
        </nav>

        <div className="action-btns">
          <Button
            text="Book a Demo"
            href={"https://calendly.com/luc-yamify/30min"}
            yellow={false}
            linkBtn={true}
            target="_blank"
          />

          <Button
            text="Get started"
            href={routes.auth.login}
            yellow={true}
            linkBtn={true}
          />
        </div>

        {openMenu && (
          <div className="menu-mobile-container">
            <div className="nav-link" onClick={handleScrollToWork}>
              Home
            </div>
            <div className="wrap-link">
              <div className="nav-link" onClick={handleScrollToFeatures}>
                Features
              </div>
              <Image src="/svgs/caret_down.svg" alt="" width={15} height={15} />
            </div>
            <div className="nav-link">Contact</div>
            <div className="yamify-container">
              <div style={{ width: 204 }} className="yamify-box">
                <div className="yamify-chip">
                  <div className="bg-blurred"></div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="204"
                    height="203"
                    viewBox="0 0 204 203"
                    fill="none"
                    className="chip"
                  >
                    <path
                      d="M162.994 0.5L203.5 40.8066V162.192L162.994 202.5H41.0059L0.5 162.192V0.5H162.994Z"
                      fill="#111111"
                      stroke="#B8B8B8"
                    />
                  </svg>

                  <div className="contain">
                    <div className="txt">Yamify</div>
                    <LineRain cols={8} total={43} />
                    <Image
                      src="/svgs/yamify_logo_sm.svg"
                      alt=""
                      width={40}
                      height={40}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Image
              className="end"
              src="/svgs/yamify_gd.svg"
              alt=""
              width={797}
              height={306}
            />
          </div>
        )}
      </section>
    </header>
  );
};

export default Header;
