"use client";

import Image from "next/image";
import React, { useState } from "react";
import "@/styles/DashboardHeader.css";
import CircularProgress from "./CircularProgress";
import Link from "next/link";
import routes from "@/libs/routes";
import { motion, AnimatePresence } from "framer-motion";
import { useClerk, useUser } from "@clerk/nextjs";

const dropDownVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20,
    },
  },
  exit: { opacity: 0, y: -30, transition: { duration: 0.2 } },
};

type Props = {
  setShowAiModal: (Callback: boolean) => void;
};

const DashboardHeader = ({ setShowAiModal }: Props) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogout = () => {
    signOut({ redirectUrl: "/" });
  };

  return (
    <div className="dashboard-header">
      <div className="wrap-icons">
        <div className="notification div-contain">
          <Image src="/svgs/notification.svg" alt="" width={15} height={15} />
        </div>
        <div className="ai-w div-contain" onClick={() => setShowAiModal(true)}>
          <Image src="/svgs/yamifyai.svg" alt="" width={15} height={15} />
        </div>
        <div className="profile-contain">
          <div
            className="profile-wrap"
            onClick={() => setShowProfileModal(!showProfileModal)}
          >
            <Image
              src={user?.imageUrl ?? "/images/profile.jpg"}
              alt=""
              width={768}
              height={552}
              className="profile-img"
            />
            <p>{user?.fullName}</p>
            <Image src="/svgs/caret_down.svg" alt="" width={15} height={15} />
          </div>

          <AnimatePresence>
            {showProfileModal && (
              <motion.div
                className="profile-modal"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={dropDownVariants}
                style={{ originY: 0 }} // Makes it drop from top edge
              >
                <div className="left">
                  <h2>Your Developer Journey</h2>

                  <p>
                    You&apos;re currently on the <span>Learner</span> track.
                    Yamify grows with you—from first deploy to production-ready
                    apps. As you build, deploy, and explore new tools, your
                    account evolves. <br /> <br /> Every Yamlet launched, every
                    environment created brings you closer to becoming an{" "}
                    <span>Expert</span>.
                  </p>

                  <div className="count">
                    <div className="txt">
                      Keep going—your cloud mastery is loading.
                    </div>

                    <CircularProgress percentage={100} />
                  </div>
                </div>

                <div className="right">
                  <div className="content">
                    <Image
                      src={user?.imageUrl ?? "/images/profile.jpg"}
                      alt=""
                      width={768}
                      height={552}
                    />
                    <h2>{user?.fullName}</h2>
                    <p>{user?.emailAddresses[0].emailAddress}</p>
                  </div>

                  <div className="actions">
                    <Link href={routes.dashboard.overview} className="action">
                      <div className="wrap">
                        <Image
                          src="/svgs/user.svg"
                          alt=""
                          width={15}
                          height={15}
                        />
                        <p>Profile Settings</p>
                      </div>

                      <Image
                        alt=""
                        src="/svgs/caret_right.svg"
                        height={15}
                        width={15}
                      />
                    </Link>
                    <Link
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="action"
                    >
                      <div className="wrap">
                        <Image
                          src="/svgs/moon.svg"
                          alt=""
                          width={15}
                          height={15}
                        />
                        <p>Theme</p>
                      </div>

                      <Image
                        alt=""
                        src="/svgs/caret_right.svg"
                        height={15}
                        width={15}
                      />
                    </Link>

                    <div className="logout-container">
                      <div className="logout-action" onClick={handleLogout}>
                        <p>Log out</p>

                        <Image
                          src="/svgs/logout.svg"
                          alt=""
                          width={15}
                          height={15}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
