"use client";

import React, { useState } from "react";
import AuthHeader from "../_components/AuthHeader";
import "@/styles/AuthPage.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CreateAnimation from "@/components/Home/CreateAnimation";
import { completeOnboarding } from "./_actions";
import { useUser } from "@clerk/nextjs";
import ErrorToast from "@/components/Notification/ErrorToast";

export default function OnboardingWorkpace() {
  const [createYam, setCreateYam] = useState(false);
  const [successBool, setSuccessBool] = useState(false);
  const { user } = useUser();

  const [workspaceName, setWorkspaceName] = useState("");
  const [displayValue, setDisplayValue] = useState(""); // Temporary value for display while focused

  const handleFocus = () => {
    // On focus, remove -workspace for editing
    if (workspaceName.endsWith("-workspace")) {
      setDisplayValue(workspaceName.replace("-workspace", ""));
    } else {
      setDisplayValue(workspaceName);
    }
  };

  const handleBlur = () => {
    // On blur, append -workspace if not already present
    if (displayValue && !displayValue.endsWith("-workspace")) {
      setWorkspaceName(`${displayValue.toLowerCase()}-workspace`);
      setDisplayValue(`${displayValue.toLowerCase()}-workspace`);
    } else {
      setWorkspaceName(displayValue.toLowerCase());
      setDisplayValue(displayValue.toLowerCase());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update display value in lowercase while typing
    setDisplayValue(e.target.value.toLowerCase());
    setWorkspaceName(e.target.value.toLowerCase());
  };
  const router = useRouter();

  const handleCreateYam = () => {
    setCreateYam(true);
  };

  const handleCreateWorkspace = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessBool(true);

    try {
      const res = await completeOnboarding({
        workspaceName,
        createYam,
      });

      // Check if res is a Response object (error case)
      if (res instanceof Response) {
        const data = await res.json();
        if (data.error) {
          console.error("Error creating workspace:", data.error);
          toast(<ErrorToast title="Error !!!" description={data.error} />)
          setSuccessBool(false);
          return;
        }
      }

      // Check for error in direct object response
      if ("error" in res && res.error) {
        console.error("Error creating workspace:", res.error);
        toast(<ErrorToast title="Error !!!" description={res.error} />)
        setSuccessBool(false);
        return;
      }

      // Success case
      if ("message" in res && res.message) {
        await user?.reload();
        router.push("/dashboard");
        return;
      }
      // Fallback error handling
      toast(<ErrorToast title="Error !!!" description="Unexpected response format" />)
      setSuccessBool(false);
    } catch (error) {
      console.error("Error creating workspace:", error);
      toast(<ErrorToast title="Error !!!" description="An unexpected error occurred" />)
      setSuccessBool(false);
    }
  };

  const loadingTxts = [
    "Welcome to Yamify—your reliable, affordable cloud.",
    "We’re setting up your workspace, tools, and credits.",
    "AI is tailoring your experience now and adding your yam...",
    "Your virtual datacenter is getting ready.",
    "In a second now...your workspace and yam will be set.",
  ];

  return (
    <div className="auth-section">
      <section>
        <AuthHeader />
        <div className="container">
          {!successBool ? (
            <>
              <div className="back-icon" onClick={() => router.back()}>
                <Image
                  src="/svgs/arrow-left.svg"
                  alt=""
                  height={15}
                  width={15}
                />
              </div>
              <h1>What would you like to call your workspace?</h1>

              <form action="" onSubmit={handleCreateWorkspace}>
                <div className="label-txt">Names must be in lowercase.</div>

                <div className="label workspace">
                  <div className="left">
                    <label htmlFor="">Workspace&apos;s name</label>
                  </div>
                  <div className="right">
                    <input
                      type="text"
                      name="workspaceName"
                      placeholder="Enter workspace's name"
                      required
                      value={displayValue}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>

                <div className={`one-click-container ${createYam && "active"}`}>
                  <p>
                    Yam will be created automatically with your workspace in
                    just one click. Not clicking means, you will create your yam
                    later in your workspace.
                  </p>

                  <div className="contain">
                    <div className="wrap">
                      <Image
                        src="/svgs/cluster.svg"
                        alt=""
                        height={15}
                        width={15}
                      />
                      Create and add “Yam” in one click!
                    </div>

                    <div className="btn">
                      <div className="icon" onClick={handleCreateYam}>
                        {!createYam ? (
                          <Image
                            src="/svgs/plus.svg"
                            alt=""
                            height={15}
                            width={15}
                          />
                        ) : (
                          <Image
                            src="/svgs/checkmark.svg"
                            alt=""
                            height={15}
                            width={15}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" className={workspaceName && "active"}>
                  <div className="contain">
                    <span>Launch my workspace</span>
                    <span className="hover-text">Launch my workspace</span>
                  </div>
                </button>
              </form>
            </>
          ) : (
            <CreateAnimation
              successBool={successBool}
              barColor="#BDFFFB"
              loadingTxts={loadingTxts}
              title="We’re preparing your personalized cloud space—designed to grow with you."
            />
          )}
        </div>
      </section>
    </div>
  );
}
