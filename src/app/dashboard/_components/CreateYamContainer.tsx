import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "@/styles/CreateYamContainer.css";
import LoadingAnimation from "@/components/Home/LoadingAnimation";
import { SelectWorkspace } from "@/types/server";
import { createYamAction } from "../_actions";
import { useRouter } from "next/navigation";

type Props = {
  workspaces: SelectWorkspace[];
};

const CreateYamContainer = ({ workspaces }: Props) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState<SelectWorkspace>();
  const [open, setOpen] = useState(false);
  const [privacy, setPrivacy] = useState<string | null>(null);
  const [successBool, setSuccessBool] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const [yamName, setYamName] = useState("");
  const [displayYamValue, setDisplayYamValue] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update display value in lowercase while typing
    setDisplayYamValue(e.target.value.toLowerCase());
    setYamName(e.target.value.toLowerCase());
  };

  const loadingTxts = [
    "Creating your cluster with optimized defaults…",
    "Auto-scaling and security being configured in the backgrpimd.",
    "We’re applying AI-powered enhancements for smooth performance.",
    "You’ll be ready to build in just a moment.",
  ];

  useEffect(() => {
    if (successBool) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => {
          const next = prev + 1;
          if (next < loadingTxts.length) {
            setBarWidth((next / loadingTxts.length) * 100);
            return next;
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [loadingTxts.length, successBool]);

  const togglePrivacy = (service: string) => {
    setPrivacy((prev) => (prev === service ? null : service));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedWorkspace) return;

    setSuccessBool(true);

    try {
      const res = await createYamAction({
        workspace: selectedWorkspace.name,
        workspaceId: selectedWorkspace.id,
        yam: yamName,
      });

      console.log({ res });
      router.push("/dashboard");
      setSuccessBool(false);
    } catch (e) {
      console.log(e);
      setSuccessBool(true);
    }
  };

  return (
    <form onSubmit={onSubmit} className="create-yam-container">
      <div className="head">
        <Image src="/svgs/cluster.svg" alt="" width={15} height={15} />
        <h1>Create a Yam in 1 Click</h1>
      </div>

      {!successBool ? (
        <>
          <p>
            Names must be in lowercase. They can between 3 and 45 characters
            long and may contain dashes.
          </p>

          <div className="form">
            <div className="label">
              <div className="left">
                <label htmlFor="">Name</label>
              </div>
              <div className="right">
                <input
                  type="text"
                  name="yamName"
                  placeholder="Enter yam’s name"
                  value={displayYamValue}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="label">
              <div className="left">
                <label htmlFor="">Workspace</label>
              </div>
              <div className="right">
                <div className="workspace-select">
                  <div className="selected" onClick={() => setOpen(!open)}>
                    {selectedWorkspace?.name}
                    <span className="arrow">
                      <Image
                        src="/svgs/caret_down.svg"
                        alt=""
                        width={15}
                        height={15}
                      />
                    </span>
                  </div>

                  {open && (
                    <ul className="options">
                      {workspaces.map((workspace) => (
                        <li
                          key={workspace.id}
                          onClick={() => {
                            setSelectedWorkspace(workspace);
                            setOpen(false);
                          }}
                        >
                          {workspace.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <div className="label">
              <div className="left">
                <label htmlFor="">Privacy</label>
              </div>
              <div className="right checkbox-right">
                <div className="checkbox-container">
                  {["Private to me", "Share with team"].map((option, index) => (
                    <div
                      key={index}
                      className={`box  ${privacy === option && "active"}`}
                      onClick={() => togglePrivacy(option)}
                    >
                      <div className="containn">
                        <span> {option}</span>
                        <span className="hover-text"> {option}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="default-container">
            <h3>default specs</h3>

            <div className="default-contain">
              <div className="default-row">
                <h2>k3s version</h2>
                <p>v1.20.0 + k3s1</p>
              </div>
              <div className="default-row">
                <h2>Type</h2>
                <p>K3s</p>
              </div>
              <div className="default-row">
                <h2>Network</h2>
                <p>Network</p>
              </div>
            </div>
          </div>

          <button type="submit">Create</button>
        </>
      ) : (
        <div className="success-container">
          <LoadingAnimation />
          <p>
            Your cloud environment is sprouting—built to scale, secure by
            default, and made just for you.
          </p>

          <div className="loading-details">
            <div className="loading-bar">
              <motion.div
                className="moving-bar"
                animate={{ width: `${barWidth * 2}px` }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
            </div>

            <div className="txt">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {loadingTxts[currentIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default CreateYamContainer;
