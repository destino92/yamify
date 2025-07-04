import "@/styles/NewHeroSection.css";
// import ActionTexts from "./ActionTexts";
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
        {/* <ActionTexts
          lightMode={false}
          tagContents={["Local.", "Fast.", "Reliable."]}
        /> */}

        <div className="content-container">
          <h2>
            Launch AI Assistant in Africa with 60% Lower Infrastructure Costs.
          </h2>
          <p>
            No dev team? No problem. Yamify lets you launch and run AI tools
            while saving 60% on setup and maintenance costs
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
            src="/images/yam_dashboard.png"
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
