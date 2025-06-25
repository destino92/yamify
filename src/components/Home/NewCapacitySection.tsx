import "@/styles/NewCapacitySection.css";
import Image from "next/image";
import LineRain from "../Animations/LineRain";
import { RefObject } from "react";

type Props = {
  featuresRef: RefObject<HTMLDivElement | null>;
};

const NewCapacitySection = ({ featuresRef }: Props) => {
  return (
    <div className="new-capacity-section" ref={featuresRef}>
      <section>
        <h1>Features</h1>

        <div className="yamify-details">
          <div className="first row">
            <div className="card">
              <Image src="/svgs/cluster.svg" alt="" width={24} height={24} />
              <h2>Yam</h2>
              <div className="content">
                <p>
                  A Yam is your private Kubernetes space — built for speed,
                  scale, and control. Deploy and manage apps without touching
                  YAML.
                </p>
                <div className="no">01</div>
              </div>
            </div>
            <div className="card">
              <Image src="/svgs/desk.svg" alt="" width={24} height={24} />
              <h2>Workspace</h2>
              <div className="content">
                <p>
                  A Workspace is your dedicated environment with its own
                  resources. It holds one Yam, your apps, usage, and team
                  access.{" "}
                </p>
                <div className="no">02</div>
              </div>
            </div>
          </div>

          <div className="second row">
            <div className="card">
              <div className="head">
                <Image src="/svgs/star.svg" alt="" width={24} height={24} />
                <div className="no">03</div>
              </div>
              <h2>
                AI Assistance <span>(coming soon)</span>
              </h2>
              <div className="content">
                <p>
                  Yamify’s AI helps you set up, configure, and optimize your
                  environment based on your project type.
                </p>
              </div>
            </div>
            <div style={{ flex: 1 }} className="box">
              <div className="yamify-chip">
                <div className="bg-blurred"></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="251"
                  height="251"
                  viewBox="0 0 251 251"
                  fill="none"
                  className="chip"
                >
                  <path
                    d="M200.47 1.47021L249.885 50.8843V200.056L200.47 249.47H51.2986L1.88452 200.056V1.47021H200.47Z"
                    fill="#111111"
                    stroke="#DD9A38"
                    strokeWidth="2"
                  />
                </svg>

                <div className="contain">
                  <div className="txt">Yamify</div>
                  <LineRain />
                  <Image
                    src="/svgs/yamify_logo_sm.svg"
                    alt=""
                    width={40}
                    height={40}
                  />
                </div>
              </div>
            </div>
            <div className="card">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="343"
                height="201"
                viewBox="0 0 343 201"
                fill="none"
              >
                <path
                  d="M43.3623 41.7827L43.0693 41.4907L2.75684 1.16748H341.054V199.167H43.3623V41.7827Z"
                  fill="#111111"
                  stroke="#202020"
                  strokeWidth="2"
                />
              </svg>

              <div className="head">
                <Image src="/svgs/card.svg" alt="" width={24} height={24} />
                <div className="no">04</div>
              </div>
              <h2>
                Wallet <span>(coming soon)</span>
              </h2>
              <div className="content">
                <p>
                  Manage your cloud usage in local currency with full
                  transparency through your Yamify wallet.
                </p>
              </div>
            </div>
          </div>

          <div className="second third row">
            <div className="card">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="434"
                height="201"
                viewBox="0 0 434 201"
                fill="none"
              >
                <path
                  d="M307.65 1.66748L359.382 53.3745L359.675 53.6675H432.013V199.667H1.95874V1.66748H307.65Z"
                  fill="#111111"
                  stroke="#202020"
                  strokeWidth="2"
                />
              </svg>
              <div className="head">
                <Image src="/svgs/list.svg" alt="" width={24} height={24} />
              </div>
              <h2>Marketplace</h2>
              <div className="content">
                <p>
                  Install services like WordPress or deployment helpers in a few
                  clicks to boost your Yam’s power.
                </p>
                <div className="no">05</div>
              </div>
            </div>
            <div className="card">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="433"
                height="201"
                viewBox="0 0 433 201"
                fill="none"
              >
                <path
                  d="M125.21 1.66748L74.134 53.3706L73.8411 53.6675H1.49829V199.667H431.553V1.66748H125.21Z"
                  fill="#111111"
                  stroke="#202020"
                  strokeWidth="2"
                />
              </svg>

              <div className="head">
                <Image
                  src="/svgs/git_branch.svg"
                  alt=""
                  width={24}
                  height={24}
                />
              </div>
              <h2>Groups</h2>
              <div className="content">
                <p>
                  Groups help organize your apps inside a Yam—like staging,
                  production, or AI—so you can manage and monitor with ease.
                </p>
                <div className="no">06</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewCapacitySection;
