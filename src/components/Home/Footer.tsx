import React, { RefObject } from "react";
import "@/styles/Footer.css";
import Image from "next/image";
import Link from "next/link";
import routes from "@/libs/routes";

// Define props interface for the Footer component
interface FooterProps {
  featuresRef?: RefObject<HTMLDivElement | null>;
  contactRef?: RefObject<HTMLDivElement | null>;
  heroRef?: RefObject<HTMLDivElement | null>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Footer = ({ featuresRef, contactRef, heroRef }: FooterProps) => {
  return (
    <footer>
      <section>
        <div className="container-footer">
          <div className="left">
            <h2>Navigations</h2>

            <div className="links">
              {/* <Link href="#" className="nav-link">
                <span>Blog</span>
                <span className="hover-text">Blog</span>
              </Link> */}
              <Link
                href="https://doc.yamify.co"
                target="_blank"
                className="nav-link"
              >
                <span>Docs</span>
                <span className="hover-text">Docs</span>
              </Link>
              {/* <Link href="#" className="nav-link">
                <span>Community</span>
                <span className="hover-text">Community</span>
              </Link> */}
              <Link href={routes.techSupport} className="nav-link">
                <span>Technical Support</span>
                <span className="hover-text">Technical Support</span>
              </Link>
            </div>
          </div>
          <div className="right">
            {/* <Image
              src="/svgs/top_right_corner_pin.svg"
              className="pin top-right"
              alt=""
              width={21}
              height={21}
            /> */}

            <div className="content">
              <Image
                src={"/svgs/yamify_logo_lg.svg"}
                alt="yamify logo"
                className="logo"
                width={30}
                height={38}
              />
              <p>
                No dev team? No problem. Yamify lets you launch and run AI tools
                while saving 60% on setup and maintenance costs.
              </p>
            </div>

            <div className="social-container">
              <h4>Social media links</h4>
              <div className="socials">
                <Link href="https://x.com/YamifyAI" target="_blank">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <g clip-path="url(#clip0_4118_33713)">
                      <path
                        d="M14.875 2.37494C14.2765 2.79711 13.6138 3.12001 12.9125 3.33119C12.5361 2.89838 12.0358 2.59162 11.4794 2.45239C10.923 2.31316 10.3372 2.34818 9.8013 2.55272C9.26542 2.75726 8.80528 3.12144 8.48311 3.59601C8.16095 4.07058 7.99231 4.63265 8 5.20619V5.83119C6.90165 5.85967 5.8133 5.61607 4.83188 5.12209C3.85046 4.62811 3.00645 3.89908 2.375 2.99994C2.375 2.99994 -0.125 8.62494 5.5 11.1249C4.21283 11.9987 2.67947 12.4368 1.125 12.3749C6.75 15.4999 13.625 12.3749 13.625 5.18744C13.6244 5.01335 13.6077 4.83968 13.575 4.66869C14.2129 4.03962 14.663 3.24538 14.875 2.37494Z"
                        stroke="#F8F8F8"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_4118_33713">
                        <rect
                          width="15"
                          height="15"
                          fill="white"
                          transform="translate(0.5 0.5)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </Link>
                <Link href="https://yamify.substack.com" target="_blank">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M13 14.7025L8 11.845L3 14.7025V6.75H13V14.7025ZM8 10.4056L11.75 12.5481V8H4.25V12.5475L8 10.4056ZM3 4.25H13V5.5H3V4.25ZM3 1.75H13V3H3V1.75Z"
                      fill="#F8F8F8"
                    />
                  </svg>
                </Link>
                <Link
                  href="https://www.linkedin.com/company/yamify"
                  target="_blank"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M10.5 5.5C11.4946 5.5 12.4484 5.89509 13.1517 6.59835C13.8549 7.30161 14.25 8.25544 14.25 9.25V13.625H11.75V9.25C11.75 8.91848 11.6183 8.60054 11.3839 8.36612C11.1495 8.1317 10.8315 8 10.5 8C10.1685 8 9.85054 8.1317 9.61612 8.36612C9.3817 8.60054 9.25 8.91848 9.25 9.25V13.625H6.75V9.25C6.75 8.25544 7.14509 7.30161 7.84835 6.59835C8.55161 5.89509 9.50544 5.5 10.5 5.5Z"
                      stroke="#F8F8F8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.25 6.125H1.75V13.625H4.25V6.125Z"
                      stroke="#F8F8F8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 4.25C3.69036 4.25 4.25 3.69036 4.25 3C4.25 2.30964 3.69036 1.75 3 1.75C2.30964 1.75 1.75 2.30964 1.75 3C1.75 3.69036 2.30964 4.25 3 4.25Z"
                      stroke="#F8F8F8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bottom">
          {/* <Image
            src="/svgs/plus_pin.svg"
            className="pin top-right"
            alt=""
            width={21}
            height={21}
          />

          <Image
            src="/svgs/plus_pin.svg"
            className="pin bottom-left"
            alt=""
            width={21}
            height={21}
          /> */}

          {/* <Image
            src={
              !lightMode
                ? "/svgs/yamify_logo_lg.svg"
                : "/svgs/yamify_logo_lg_lm.svg"
            }
            alt="yamify logo"
            className="logo"
            width={30}
            height={38}
          />

          <p>
            Yamify is Africa’s first sovereign cloud infrastructure platform,
            built to empower developers, startups, and enterprises with instant
            access to secure, scalable resources.{" "}
          </p> */}

          <Image
            className="end"
            src="/svgs/yamify_gd.svg"
            alt=""
            width={797}
            height={306}
          />
        </div>
      </section>
    </footer>
  );
};

export default Footer;
