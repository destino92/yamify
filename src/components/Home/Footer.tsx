import React, { RefObject } from "react";
import "@/styles/Footer.css";
import Image from "next/image";
import Link from "next/link";

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
              <Link href="#" className="nav-link">
                <span>Blog</span>
                <span className="hover-text">Blog</span>
              </Link>
              <Link href="#" className="nav-link">
                <span>Docs</span>
                <span className="hover-text">Docs</span>
              </Link>
              <Link href="#" className="nav-link">
                <span>Community</span>
                <span className="hover-text">Community</span>
              </Link>
              <Link href="#" className="nav-link">
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
                Yamify is Africa’s first sovereign cloud infrastructure
                platform, built to empower developers, startups, and enterprises
                with instant access to secure, scalable resources.
              </p>
            </div>

            <div className="social-container">
              <h4>Social media links</h4>
              <div className="socials">
                <Link href="#" target="_blank">
                  <Image
                    src="/svgs/Facebook.svg"
                    alt=""
                    width={15}
                    height={15}
                  />
                </Link>
                <Link href="#" target="_blank">
                  <Image src="/svgs/Github.svg" alt="" width={15} height={15} />
                </Link>
                <Link href="#" target="_blank">
                  <Image
                    src="/svgs/Linkedin.svg"
                    alt=""
                    width={15}
                    height={15}
                  />
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
