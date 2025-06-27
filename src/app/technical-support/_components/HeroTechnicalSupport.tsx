import React from "react";
import "@/styles/HeroTechnicalSupport.css";
import Button from "@/components/Button/Button";
import routes from "@/libs/routes";
import Image from "next/image";

const HeroTechnicalSupport = () => {
  return (
    <div className="hero-technical-support">
      <section>
        <div className="content">
          <h1>Yamify Technical Support</h1>
          <p>
            Connect with us via chat, engage with our community and get
            self-service help for Yamify products and services.{" "}
          </p>
        </div>

        <div className="supports">
          <div className="support">
            <Image
              src="/svgs/support_docs.svg"
              alt="docs"
              width={70}
              height={70}
            />

            <div className="contain">
              <h3>Support Docs</h3>
              <p>User guides, FAQs, education, and tutorials.</p>

              <Button
                yellow={true}
                linkBtn={true}
                text="Get started"
                href={routes.docs}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroTechnicalSupport;
