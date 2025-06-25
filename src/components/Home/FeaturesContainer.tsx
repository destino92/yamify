import Image from "next/image";
import React from "react";
import LineRain from "../Animations/LineRain";
import "@/styles/FeaturesContainer.css";

const FeaturesContainer = () => {
  return (
    <div className="feature-container">
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
        P
      </svg>
      <div className="feature-content">
        <h2>Features</h2>

        <p>Hover on each button to get descriptions.</p>
      </div>

      <div className="features">
        <div className="nav-link">
          <span>Yam</span>
          <span className="hover-text">Yam</span>
        </div>
        <div className="nav-link">
          <span>Workspace</span>
          <span className="hover-text">Workspace</span>
        </div>
        <div className="nav-link">
          <span>AI Assistant</span>
          <span className="hover-text">AI Assistant</span>
        </div>
        <div className="nav-link">
          <span>Wallet</span>
          <span className="hover-text">Wallet</span>
        </div>
        <div className="nav-link">
          <span>Marketplace</span>
          <span className="hover-text">Marketplace</span>
        </div>
        <div className="nav-link">
          <span>Group</span>
          <span className="hover-text">Group</span>
        </div>
      </div>

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
  );
};

export default FeaturesContainer;
