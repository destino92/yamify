"use client";

import React, { useState } from "react";
import AuthHeader from "../_components/AuthHeader";
import "@/styles/AuthPage.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CreateAnimation from "@/components/Home/CreateAnimation";
import { completeOnboarding } from "./_actions";
import { useUser } from "@clerk/nextjs";
import Notification from "@/components/Notification/Notification";
import { toast } from "sonner";

// Error code mapping for user-friendly messages
const ERROR_MESSAGES = {
  NAMESPACE_EXISTS: {
    title: "Workspace Name Unavailable",
    description: "This workspace name is already taken. Please choose a different name.",
    suggestion: "Try adding numbers or your initials to make it unique.",
    actionable: true
  },
  WORKSPACE_EXISTS: {
    title: "Duplicate Workspace",
    description: "This workspace name is already taken. Please choose a different name.",
    suggestion: "Choose a different name.",
    actionable: true
  },
  NAMESPACE_FAILED: {
    title: "Infrastructure Setup Failed",
    description: "Failed to create workspace infrastructure. Our system has automatically retried this operation.",
    suggestion: "If this persists, please try again in a few minutes or contact support.",
    actionable: false
  },
  INGRESS_FAILED: {
    title: "Network Setup Failed",
    description: "Failed to set up workspace networking after multiple attempts.",
    suggestion: "Please try again or contact support if the issue persists.",
    actionable: false
  },
  DB_FAILED: {
    title: "Database Error",
    description: "Failed to save workspace information.",
    suggestion: "Please try again. If the problem continues, contact support.",
    actionable: false
  },
  USER_CREATION_FAILED: {
    title: "Account Setup Failed",
    description: "Failed to set up your user account.",
    suggestion: "Please try signing in again or contact support.",
    actionable: false
  },
  WORKSPACE_CREATION_FAILED: {
    title: "Workspace Creation Failed",
    description: "An unexpected error occurred while creating your workspace.",
    suggestion: "Please try again with a different workspace name.",
    actionable: true
  },
  METADATA_UPDATE_FAILED: {
    title: "Setup Almost Complete",
    description: "Workspace created successfully, but onboarding couldn't be fully completed.",
    suggestion: "You can still access your workspace. Contact support if you need assistance.",
    actionable: false
  },
  UNAUTHORIZED: {
    title: "Authentication Required",
    description: "Please sign in to continue.",
    suggestion: "You'll be redirected to the sign-in page.",
    actionable: false
  }
} as const;

type ErrorCode = keyof typeof ERROR_MESSAGES;

export default function OnboardingWorkpace() {
  const [createYam, setCreateYam] = useState(false);
  const [successBool, setSuccessBool] = useState(false);
  
  const { user } = useUser();
  const router = useRouter();

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

  const handleCreateYam = () => {
    setCreateYam(!createYam);
  };

  const showErrorNotification = (code: ErrorCode) => {
    const errorInfo = ERROR_MESSAGES[code];
    
    toast.custom(() => (
      <Notification 
        title={errorInfo.title}
        description={errorInfo.description}
        variant="error"
      />
    ), {
      duration: 6000,
    });

    // Show suggestion as a separate info toast
    if (errorInfo.suggestion && errorInfo.actionable) {
      setTimeout(() => {
        toast.custom(() => (
          <Notification 
            title="💡 Suggestion"
            description={errorInfo.suggestion}
            variant="info"
          />
        ), { duration: 8000 });
      }, 1000);
    } else if (errorInfo.suggestion) {
      // For non-actionable errors, show suggestion immediately
      setTimeout(() => {
        toast.custom(() => (
          <Notification 
            title="ℹ️ Information"
            description={errorInfo.suggestion}
            variant="info"
          />
        ), { duration: 10000 });
      }, 500);
    }
  };

  const handleOnboarding = async (e: React.FormEvent<HTMLFormElement>) => {
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
          const errorCode = (data.code as ErrorCode) || 'WORKSPACE_CREATION_FAILED';
          showErrorNotification(errorCode);
          setSuccessBool(false);
          return;
        }
      }

      // Handle error in direct object response
      if ("error" in res && res.error) {
        console.error("Error creating workspace:", res.error);
        const errorCode = (res.code as ErrorCode) || 'WORKSPACE_CREATION_FAILED';
        
        // Special handling for specific errors
        if (errorCode === 'UNAUTHORIZED') {
          showErrorNotification(errorCode);
          setTimeout(() => {
            router.push('/auth/sign-in');
          }, 2000);
        } else if (errorCode === 'METADATA_UPDATE_FAILED') {
          // Special case: workspace was created but onboarding incomplete
          showErrorNotification(errorCode);
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        } else {
          showErrorNotification(errorCode);
        }
        
        setSuccessBool(false);
        return;
      }

      // Success case
      if ("success" in res && res.success) {
        await user?.reload();
        
        toast.custom(() => (
          <Notification 
            title="🎉 Success!" 
            description="Your workspace has been created successfully. Welcome to Yamify!" 
            variant="success" 
          />
        ));
        
        // Small delay to show success message before redirect
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
        
        return;
      }

      // Fallback for unexpected response format
      console.error("Unexpected response format:", res);
      showErrorNotification('WORKSPACE_CREATION_FAILED');
      setSuccessBool(false);
    } catch (error) {
      console.error("Network or unexpected error:", error);
      
      toast.custom(() => (
        <Notification 
          title="🔌 Connection Error" 
          description="Unable to connect to our servers. Please check your internet connection and try again." 
          variant="error"
        />
      ));
      
      setSuccessBool(false);
    }
  };

  // Loading messages based on current state
  const getLoadingMessages = () => {
    const baseMessages = [
      "Welcome to Yamify—your reliable, affordable cloud.",
      "We're setting up your workspace infrastructure...",
    ];

    if (createYam) {
      baseMessages.push("Creating your Yam cluster...");
    }

    baseMessages.push(
      "Configuring networking and security...",
      "Almost ready! Finalizing your workspace..."
    );

    return baseMessages;
  };

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

              <form onSubmit={handleOnboarding}>
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
              loadingTxts={getLoadingMessages()}
              title="We’re preparing your personalized cloud space—designed to grow with you."
            />
          )}
        </div>
      </section>
    </div>
  );
}
