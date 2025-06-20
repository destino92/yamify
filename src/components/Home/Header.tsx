"use client";

import Image from "next/image";
import Link from "next/link";
import React, { RefObject, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/Header.css";
import Button from "../Button/Button";
import FeaturesContainer from "./FeaturesContainer";
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
  const [isHovered2, setIsHovered2] = useState(false);

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
                  key="features"
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
          <div
            className="feature-link"
            onMouseEnter={() => setIsHovered2(true)}
            onMouseLeave={() => setIsHovered2(false)}
          >
            <div className="wrap-link">
              <div className="nav-link" onClick={handleScrollToFeatures}>
                <span>Resources</span>
                <span className="hover-text">Resources</span>
              </div>
              <Image src="/svgs/caret_down.svg" alt="" width={15} height={15} />
            </div>

            <AnimatePresence>
              {isHovered2 && (
                <motion.div
                  key="resources"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="resources-container">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="6"
                      height="46"
                      viewBox="0 0 6 46"
                      fill="none"
                      className="line-hang"
                    >
                      <path
                        opacity="0.5"
                        d="M3 0.113249L0.113249 3L3 5.88675L5.88675 3L3 0.113249ZM3 40.3333C1.52724 40.3333 0.333332 41.5272 0.333332 43C0.333331 44.4728 1.52724 45.6667 3 45.6667C4.47276 45.6667 5.66666 44.4728 5.66666 43C5.66667 41.5272 4.47276 40.3333 3 40.3333ZM3 3L2.5 3L2.5 5L3 5L3.5 5L3.5 3L3 3ZM3 9L2.5 9L2.5 13L3 13L3.5 13L3.5 9L3 9ZM3 17L2.5 17L2.5 21L3 21L3.5 21L3.5 17L3 17ZM3 25L2.5 25L2.5 29L3 29L3.5 29L3.5 25L3 25ZM3 33L2.5 33L2.5 37L3 37L3.5 37L3.5 33L3 33ZM3 41L2.5 41L2.5 43L3 43L3.5 43L3.5 41L3 41Z"
                        fill="#DD9A38"
                      />
                    </svg>
                    <Link href="#" className="nav-link">
                      <span>Blog</span>
                      <span className="hover-text">Blog</span>
                    </Link>
                    <Link href="#" className="nav-link">
                      <span>Community</span>
                      <span className="hover-text">Community</span>
                    </Link>
                    <Link href="#" className="nav-link">
                      <span>Docs</span>
                      <span className="hover-text">Docs</span>
                    </Link>
                    <Link href="#" className="nav-link">
                      <span>Technical Support</span>
                      <span className="hover-text">Technical Support</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
