import "@/styles/RightPanelDashboard.css";
// import Image from "next/image";
// import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import CreateYamContainer from "./CreateYamContainer";
// import Link from "next/link";
import DashboardHeader from "./DashboardHeader";
import { SelectWorkspace } from "@/types/server";
import { useUser } from "@clerk/nextjs";

type Props = {
  expandRightPanel: boolean;
  setShowAiModal: (Callback: boolean) => void;
  workspaces: SelectWorkspace[];
};

const RightPanel = ({
  expandRightPanel,
  workspaces,
  setShowAiModal,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // const mainInputRef = useRef<HTMLInputElement>(null);
  const today = new Date();
  const formattedToday = new Intl.DateTimeFormat("en-US", {
    weekday: "long", // e.g. "Thursday"
    month: "long", // e.g. "May"
    day: "numeric", // e.g. "6"
  }).format(today);
  const { user } = useUser();

  // const [roleCareer, setRoleCareer] = useState<string | null>(null);
  // const [mainImage, setMainImage] = useState("");

  // const toggleRoleCareer = (service: string) => {
  //   setRoleCareer((prev) => (prev === service ? null : service));
  // };

  // const handleMainImageChange = async (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const imagePath = URL.createObjectURL(file);
  //     setMainImage(imagePath); // this will be a blob URL
  //   }
  // };

  // const scrollToIndex = (index: number) => {
  //   if (!containerRef.current) return;

  //   const container = containerRef.current;
  //   const taskWidth =
  //     container.firstChild instanceof HTMLElement
  //       ? container.firstChild.offsetWidth + 10 // +gap
  //       : 0;

  //   container.scrollTo({
  //     left: index * taskWidth,
  //     behavior: "smooth",
  //   });
  // };

  // const handleProceed = () => {
  //   const container = containerRef.current;
  //   if (!container) return;

  //   const taskWidth =
  //     container.firstChild instanceof HTMLElement
  //       ? container.firstChild.offsetWidth + 10
  //       : 0;

  //   // Recalculate based on current scroll position
  //   const currentIndex = Math.round(container.scrollLeft / taskWidth);
  //   const nextIndex = currentIndex + 1;

  //   if (nextIndex < container.children.length) {
  //     scrollToIndex(nextIndex);
  //   }
  // };

  const syncScrollPosition = () => {
    const container = containerRef.current;
    if (!container) return;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", syncScrollPosition);
    return () => container.removeEventListener("scroll", syncScrollPosition);
  }, []);

  if (!user) return;

  return (
    <div className={`right-panel ${expandRightPanel && "not-expand"}`}>
      <div className="dummy-panel"></div>
      <div className="main-panel">
        <DashboardHeader setShowAiModal={setShowAiModal} />

        <div className="section">
          <div className="intro-welcome">
            <div className="date">{formattedToday}</div>
            <h3>Good afternoon, {user.firstName}.</h3>
          </div>

          <div className="summary-wrap">
            <div className="row">
              <h2>{workspaces.length}</h2>
              <p>Workspace (s)</p>
            </div>
            <div className="row">
              <h2>1</h2>
              <p>Yam Cluster</p>
            </div>
            <div className="row">
              <h2>0</h2>
              <p>Deployed App</p>
            </div>
          </div>

          <div className="onboarding-container">
            {/* <div className="onboarding-head">
              <div className="wrap">
                <Image src="/svgs/user.svg" alt="" width={15} height={15} />
                <p>6 Steps to Onboarding</p>
              </div>

              <div className="contain">
                <div className="boxes">
                  <div className="box"></div>
                  <div className="box"></div>
                  <div className="box"></div>
                  <div className="box"></div>
                  <div className="box"></div>
                  <div className="box"></div>
                </div>
                <p>0 of 6 completed</p>
              </div>
            </div>

            <div
              className="tasks-wrapper"
              style={{ overflow: "hidden", width: "100%" }}
            >
              <div className="blurred"></div>
              <motion.div
                className="tasks-container"
                ref={containerRef}
                style={{ scrollBehavior: "smooth" }}
              >
                <div className="task">
                  <div className="wrap-contain">
                    <div className="edit">
                      <Image
                        src="/svgs/edit.svg"
                        alt=""
                        width={25}
                        height={25}
                      />
                    </div>

                    <div className="content">
                      <h2>What best describes you?</h2>
                      <p>
                        What type of developer are you? This helps us tailor
                        Yamify for you.
                      </p>
                    </div>
                  </div>

                  <div className="bottom">
                    <div className="roles">
                      {[
                        "Frontend Developer",
                        "Backend Developer",
                        "DevOps Engineeer",
                      ].map((role, i) => (
                        <div
                          className={`role ${roleCareer === role && "active"}`}
                          key={i}
                          onClick={() => toggleRoleCareer(role)}
                        >
                          <div className="contain">
                            <span>{role}</span>
                            <span className="hover-text">{role}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="proceed-btn" onClick={handleProceed}>
                    <Image
                      src="/svgs/arrow_right.svg"
                      alt=""
                      width={15}
                      height={15}
                    />
                  </div>
                </div>
                <div className="task">
                  <div className="wrap-contain">
                    <div className="edit">
                      <Image
                        src="/svgs/edit.svg"
                        alt=""
                        width={25}
                        height={25}
                      />
                    </div>

                    <div className="content">
                      <h2>Rename your workspace’s name</h2>
                      <p>What would you like to call your workspace?</p>
                    </div>
                  </div>

                  <div className="bottom">
                    <div className="label-input">
                      <div className="left">
                        <label htmlFor="">Name</label>
                      </div>
                      <div className="right">
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter workspace’s name"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="proceed-btn" onClick={handleProceed}>
                    <Image
                      src="/svgs/arrow_right.svg"
                      alt=""
                      width={15}
                      height={15}
                    />
                  </div>
                </div>
                <div className="task">
                  <div className="wrap-contain">
                    <div className="edit">
                      <Image
                        src="/svgs/camera.svg"
                        alt=""
                        width={25}
                        height={25}
                      />
                    </div>

                    <div className="content">
                      <h2>Add a personal touch</h2>
                      <p>
                        Upload your photo—it helps personalize your profile.
                      </p>
                    </div>
                  </div>

                  <div className="bottom">
                    <div className="change-photo">
                      <input
                        type="file"
                        accept="image/*"
                        ref={mainInputRef}
                        onChange={handleMainImageChange}
                        style={{ display: "none" }}
                      />
                      <div className="img-container">
                        {" "}
                        <Image
                          onClick={() => mainInputRef.current?.click()}
                          src={!mainImage ? "/images/profile.jpg" : mainImage}
                          alt=""
                          height={100}
                          width={100}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="proceed-btn" onClick={handleProceed}>
                    <Image
                      src="/svgs/arrow_right.svg"
                      alt=""
                      width={15}
                      height={15}
                    />
                  </div>
                </div>
                <div className="task">
                  <div className="wrap-contain">
                    <div className="edit">
                      <Image
                        src="/svgs/card.svg"
                        alt=""
                        width={25}
                        height={25}
                      />
                    </div>

                    <div className="content">
                      <h2>You have free credits waiting!</h2>
                      <p>
                        Use up to $1,000 credit to create 3 clusters. Don’t let
                        it sit idle.
                      </p>
                    </div>
                  </div>

                  <div className="bottom">
                    <Link href="#" className="btn-wrapper">
                      Set up wallet
                    </Link>
                  </div>

                  <div className="proceed-btn" onClick={handleProceed}>
                    <Image
                      src="/svgs/arrow_right.svg"
                      alt=""
                      width={15}
                      height={15}
                    />
                  </div>
                </div>
                <div className="task">
                  <div className="wrap-contain">
                    <div className="edit">
                      <Image
                        src="/svgs/list.svg"
                        alt=""
                        width={25}
                        height={25}
                      />
                    </div>

                    <div className="content">
                      <h2>Add 1 tool from the Marketplace</h2>
                      <p>
                        Plugins, domains, AI tools—everything you need in one
                        place.
                      </p>
                    </div>
                  </div>

                  <div className="bottom">
                    <Link href="#" className="btn-wrapper">
                      Go to marketplace
                    </Link>
                  </div>

                  <div className="proceed-btn" onClick={handleProceed}>
                    <Image
                      src="/svgs/arrow_right.svg"
                      alt=""
                      width={15}
                      height={15}
                    />
                  </div>
                </div>
                <div className="task">
                  <div className="wrap-contain">
                    <div className="edit">
                      <Image
                        src="/svgs/cluster.svg"
                        alt=""
                        width={25}
                        height={25}
                      />
                    </div>

                    <div className="content">
                      <h2>Ship your first project live</h2>
                      <p>
                        Deploy your first app from inside your Yam in just less
                        than 1 minute.
                      </p>
                    </div>
                  </div>

                  <div className="bottom">
                    <Link href="#" className="btn-wrapper">
                      Go to default yam
                    </Link>
                  </div>

                  <div className="proceed-btn" onClick={handleProceed}>
                    <Image
                      src="/svgs/arrow_right.svg"
                      alt=""
                      width={15}
                      height={15}
                    />
                  </div>
                </div>
              </motion.div>
            </div> */}

            <CreateYamContainer workspaces={workspaces} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
