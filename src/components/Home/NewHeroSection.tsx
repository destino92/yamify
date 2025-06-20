import "@/styles/NewHeroSection.css";
import ActionTexts from "./ActionTexts";
import Button from "../Button/Button";
import routes from "@/libs/routes";
import Image from "next/image";
import { RefObject } from "react";
import SlideStacks from "./SlideStacks";

type Props = {
  setJoinWaitlistModal: (value: boolean) => void;
  heroRef: RefObject<HTMLDivElement | null>;
};

const NewHeroSection = ({ setJoinWaitlistModal, heroRef }: Props) => {
  return (
    <div className="new-hero-section" ref={heroRef}>
      <section>
        <ActionTexts
          lightMode={false}
          tagContents={["Local.", "Fast.", "Reliable."]}
        />

        <div className="content-container">
          <h2>Where Your Data Lives and Stays</h2>
          <p>
            Yamify is a local cloud platform made for developers who want speed,
            reliability, and control. Your apps run on secure, local
            infrastructure—so your data stays nearby, your costs stay low, and
            your setup is always in your hands.
          </p>
          <div className="btns-wrap">
            <Button
              text="Join Waitlist Now"
              href={routes.auth.signup}
              yellow={true}
              linkBtn={false}
              onClick={() => setJoinWaitlistModal(true)}
            />
          </div>
        </div>

        <div className="drop-img">
          <SlideStacks />
          <Image
            className="backdrop"
            src="/svgs/yam_dashboard.svg"
            alt=""
            width={880}
            height={578.947}
          />
          <div className="blurred-backdrop">
            <div className="row flex">
              <div className="first drop"></div>
              <div className="second drop"></div>
            </div>
            <div className="row flex">
              <div className="third drop"></div>
              <div className="fourth drop"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewHeroSection;
