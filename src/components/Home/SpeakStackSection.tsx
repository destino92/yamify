import "@/styles/SpeakStackSection.css";
import Image from "next/image";

const SpeakStackSection = () => {
  return (
    <div className="speak-stack-section">
      <section>
        <div className="head">
          <h1>How Yamify works</h1>
          <p>
            No more juggling tools or dealing with complex setups. Yamify brings
            everything you need into one place—so you can go from idea to
            deployment without breaking focus.
          </p>
        </div>

        {/* <div className="languages">
          <div className="box">
            <Image src="/svgs/java_svg.svg" alt="" width={30} height={30} />
          </div>
          <div className="box">
            <Image
              src="/svgs/javascript-svg.svg"
              alt=""
              width={30}
              height={30}
            />
          </div>
          <div className="box">
            <Image src="/svgs/nextjs-svg.svg" alt="" width={30} height={30} />
          </div>
          <div className="box">
            <Image
              src="/svgs/code-square-svg.svg"
              alt=""
              width={30}
              height={30}
            />
          </div>
          <div className="box">
            <Image src="/svgs/laravel_icon.svg" alt="" width={30} height={30} />
          </div>
          <div className="box">
            <Image src="/svgs/node-16-svg.svg" alt="" width={30} height={30} />
          </div>
          <div className="box">
            <Image src="/svgs/sql-svg.svg" alt="" width={30} height={30} />
          </div>
          <div className="box">
            <Image src="/svgs/ai_bionic.svg" alt="" width={30} height={30} />
          </div>
        </div> */}

        <div className="process-container">
          <div className="row">
            <div className="process">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
              >
                <g clipPath="url(#clip0_2799_30732)">
                  <path
                    d="M13 12.6675V10.6675H19V2.66748C19 1.56448 18.103 0.66748 17 0.66748H7C5.897 0.66748 5 1.56448 5 2.66748V10.6675H11V12.6675H0V14.6675H2V24.6675H4V14.6675H15V24.6675H24V12.6675H13ZM7 2.66748H17V8.66748H7V2.66748ZM22 14.6675V17.6675H17V14.6675H22ZM17 22.6675V19.6675H22V22.6675H17Z"
                    fill="#BDFFFB"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2799_30732">
                    <rect
                      width="24"
                      height="24"
                      fill="white"
                      transform="translate(0 0.66748)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <div className="bg-drop"></div>
              <div className="bg-drop-2"></div>
              <div className="content">
                <h1>
                  Your Private Cloud,
                  <br /> Ready to Build
                </h1>
                <p>
                  Start by creating a workspace — your own isolated environment
                  with its own resources, team, and usage tracking.
                </p>
              </div>

              <div className="end">
                <Image
                  src="/svgs/readytobuild.svg"
                  alt=""
                  width={276}
                  height={331}
                />
              </div>
            </div>
            <div className="process">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
              >
                <path
                  d="M16.5 10.0674L7.5 4.87738M3.27 7.62738L12 12.6774L20.73 7.62738M12 22.7474V12.6674M21 16.6674V8.66738C20.9996 8.31666 20.9071 7.97219 20.7315 7.66855C20.556 7.3649 20.3037 7.11275 20 6.93738L13 2.93738C12.696 2.76185 12.3511 2.66943 12 2.66943C11.6489 2.66943 11.304 2.76185 11 2.93738L4 6.93738C3.69626 7.11275 3.44398 7.3649 3.26846 7.66855C3.09294 7.97219 3.00036 8.31666 3 8.66738V16.6674C3.00036 17.0181 3.09294 17.3626 3.26846 17.6662C3.44398 17.9699 3.69626 18.222 4 18.3974L11 22.3974C11.304 22.5729 11.6489 22.6653 12 22.6653C12.3511 22.6653 12.696 22.5729 13 22.3974L20 18.3974C20.3037 18.222 20.556 17.9699 20.7315 17.6662C20.9071 17.3626 20.9996 17.0181 21 16.6674Z"
                  stroke="#DD9A38"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="bg-drop"></div>
              <div className="content">
                <h1>
                  Launch a Yam and Power <br />
                  Your Infra
                </h1>
                <p>
                  A Yam is your virtual Kubernetes cluster inside the workspace.
                  This is where your apps will live and scale independently.
                </p>
              </div>

              <div className="end">
                <Image
                  src="/svgs/launchayam.svg"
                  alt=""
                  width={469.502}
                  height={174}
                />
              </div>
            </div>
          </div>

          <div className="process-card">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              className="tag-svg"
            >
              <path
                d="M7 7.66748H7.01M20.59 14.0775L13.42 21.2475C13.2343 21.4334 13.0137 21.581 12.7709 21.6816C12.5281 21.7822 12.2678 21.8341 12.005 21.8341C11.7422 21.8341 11.4819 21.7822 11.2391 21.6816C10.9963 21.581 10.7757 21.4334 10.59 21.2475L2 12.6675V2.66748H12L20.59 11.2575C20.9625 11.6322 21.1716 12.1391 21.1716 12.6675C21.1716 13.1959 20.9625 13.7028 20.59 14.0775Z"
                stroke="#DD9A38"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="left">
              <h1>Keep Your Apps Structured</h1>
              <p>
                Groups help you organize your apps by purpose or stage — like
                production, staging, testing, or AI.
                <br />
                <br /> Every app belongs to a group, making it easy to manage
                deployments and track resource usage
              </p>

              <div className="steps-container">
                <h2>Steps</h2>

                <div className="container">
                  <div className="txt">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="16"
                      viewBox="0 0 15 16"
                      fill="none"
                    >
                      <path
                        d="M3.125 8.16748H11.875M11.875 8.16748L7.5 3.79248M11.875 8.16748L7.5 12.5425"
                        stroke="#E6E6E6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Create your first group (e.g. production)</span>
                  </div>
                  <div className="txt">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="16"
                      viewBox="0 0 15 16"
                      fill="none"
                    >
                      <path
                        d="M3.125 8.16748H11.875M11.875 8.16748L7.5 3.79248M11.875 8.16748L7.5 12.5425"
                        stroke="#E6E6E6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Assign colors for quick visual sorting</span>
                  </div>
                  <div className="txt">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="16"
                      viewBox="0 0 15 16"
                      fill="none"
                    >
                      <path
                        d="M3.125 8.16748H11.875M11.875 8.16748L7.5 3.79248M11.875 8.16748L7.5 12.5425"
                        stroke="#E6E6E6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Move or deploy apps into the right group</span>
                  </div>
                </div>
              </div>

              <Image
                className="first-img"
                src="/svgs/createfirstgroup.svg"
                alt=""
                width={360}
                height={360}
              />

              <div className="bg-blurred"></div>
            </div>

            <div className="right">
              <div className="bg-drop"></div>
              <div className="bg-drop-2"></div>
              <Image
                className="first-img"
                src="/svgs/createfirstgroup.svg"
                alt=""
                width={360}
                height={360}
              />
              <Image
                className="second-img"
                src="/svgs/createfirstgroup2.svg"
                alt=""
                width={311.414}
                height={251}
              />
            </div>
          </div>

          <div className="process-card snd-process-card">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              className="tag-svg"
            >
              <path
                d="M17.1086 12.2854C17.1086 11.3499 16.773 10.7025 16.4852 10.1982C16.1015 9.57478 15.7415 9.04715 15.7415 8.42352C15.7415 7.7277 16.2694 7.08025 17.0129 7.08025C17.0462 7.08025 17.0787 7.08443 17.1106 7.08615C15.7644 5.85288 13.9706 5.09961 12.0007 5.09961C9.35667 5.09961 7.03106 6.45589 5.67773 8.51068C5.85525 8.51583 6.0227 8.51976 6.16485 8.51976C6.95642 8.51976 8.18159 8.42352 8.18159 8.42352C8.58941 8.39921 8.63753 8.99878 8.23021 9.0469C8.23021 9.0469 7.82018 9.09503 7.36424 9.11884L10.1195 17.3167L11.7758 12.3499L10.5966 9.11958C10.1892 9.09576 9.80303 9.04764 9.80303 9.04764C9.39546 9.02358 9.4431 8.40019 9.85091 8.42425C9.85091 8.42425 11.1006 8.52025 11.8438 8.52025C12.6354 8.52025 13.8611 8.42425 13.8611 8.42425C14.2694 8.40019 14.3168 8.99927 13.9092 9.04764C13.9092 9.04764 13.4982 9.09576 13.0432 9.11958L15.7781 17.2545L16.5329 14.7325C16.8599 13.6851 17.1086 12.9331 17.1086 12.2854Z"
                fill="#F8F8F8"
              />
              <path
                d="M4.43262 12.6673C4.43262 15.6627 6.17363 18.2512 8.69786 19.4779L5.08768 9.58765C4.66783 10.5285 4.43262 11.5703 4.43262 12.6673Z"
                fill="#F8F8F8"
              />
              <path
                d="M12.1332 13.3291L9.8623 19.9266C10.5404 20.126 11.2574 20.2352 12.0003 20.2352C12.8815 20.2352 13.7266 20.0827 14.5133 19.806C14.4926 19.7736 14.4745 19.7395 14.459 19.7017L12.1332 13.3291Z"
                fill="#F8F8F8"
              />
              <path
                d="M15.8044 19.2084C18.0544 17.8966 19.5676 15.459 19.5676 12.6674C19.5678 11.3517 19.2317 10.1147 18.6405 9.03662C18.6734 9.27748 18.6916 9.53651 18.6916 9.81469C18.6916 10.5827 18.5484 11.446 18.1161 12.5253L15.8044 19.2084Z"
                fill="#F8F8F8"
              />
              <path
                d="M12 0.66748C5.37256 0.66748 0 6.04004 0 12.6675C0 19.2949 5.37256 24.6675 12 24.6675C18.6274 24.6675 24 19.2949 24 12.6675C24 6.04004 18.6274 0.66748 12 0.66748ZM12.0002 21.0843C7.35934 21.0843 3.58343 17.3084 3.58343 12.6672C3.58343 8.02633 7.3591 4.25066 12.0002 4.25066C16.6409 4.25066 20.4163 8.02633 20.4163 12.6672C20.4163 17.3084 16.6409 21.0843 12.0002 21.0843Z"
                fill="#F8F8F8"
              />
            </svg>
            <div className="left">
              <h1>One-Click Launch, Zero Setup Stress</h1>
              <p>
                Select from ready-to-go services like WordPress, databases, or
                AI modules and deploy instantly into your Yam and group.
              </p>

              <div className="steps-container">
                <h2>Steps</h2>

                <div className="container">
                  <div className="txt">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="16"
                      viewBox="0 0 15 16"
                      fill="none"
                    >
                      <path
                        d="M3.125 8.16748H11.875M11.875 8.16748L7.5 3.79248M11.875 8.16748L7.5 12.5425"
                        stroke="#E6E6E6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Open the Marketplace and choose an app</span>
                  </div>
                  <div className="txt">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="16"
                      viewBox="0 0 15 16"
                      fill="none"
                    >
                      <path
                        d="M3.125 8.16748H11.875M11.875 8.16748L7.5 3.79248M11.875 8.16748L7.5 12.5425"
                        stroke="#E6E6E6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Assign it to a group (e.g., staging)</span>
                  </div>
                  <div className="txt">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="16"
                      viewBox="0 0 15 16"
                      fill="none"
                    >
                      <path
                        d="M3.125 8.16748H11.875M11.875 8.16748L7.5 3.79248M11.875 8.16748L7.5 12.5425"
                        stroke="#E6E6E6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Watch it install and go live in seconds</span>
                  </div>
                  <div className="txt">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="16"
                      viewBox="0 0 15 16"
                      fill="none"
                    >
                      <path
                        d="M3.125 8.16748H11.875M11.875 8.16748L7.5 3.79248M11.875 8.16748L7.5 12.5425"
                        stroke="#E6E6E6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Open, manage, or configure with ease</span>
                  </div>
                </div>

                <Image
                  className="third-img"
                  src="/svgs/oneclick.svg"
                  alt=""
                  width={466}
                  height={291}
                />

                <div className="bg-blurred"></div>
              </div>
            </div>

            <div className="right">
              <div className="bg-drop-3"></div>
              {/* <div className="bg-drop-2"></div> */}
              <Image
                className="third-img"
                src="/svgs/oneclick.svg"
                alt=""
                width={466}
                height={291}
              />
              <Image
                className="fourth-img"
                src="/svgs/oneclick2.svg"
                alt=""
                width={251}
                height={201}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SpeakStackSection;
