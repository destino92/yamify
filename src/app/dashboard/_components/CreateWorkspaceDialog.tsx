import React, { useState } from "react";
import "@/styles/CreateYamDialog.css";
import Image from "next/image";
import CreateAnimation from "@/components/Home/CreateAnimation";
import { createWorkspaceAction } from "../_actions";
import { useRouter } from "next/navigation";
import Notification from "@/components/Notification/Notification";
import { toast } from "sonner";

type Props = {
  setShowWorkspaceDialog: (Callback: boolean) => void;
  loadingTxts: string[];
};

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

const CreateWorkspaceDialog = ({ setShowWorkspaceDialog, loadingTxts }: Props) => {
  const [successBool, setSuccessBool] = useState(false);
  const [createYam, setCreateYam] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [displayValue, setDisplayValue] = useState(""); // Temporary value for display while focused
  const router = useRouter();

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

  const handleCreateWorkspace = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessBool(true);

    try {
      const res = await createWorkspaceAction({
        namespace: workspaceName,
        createYam,
      });

      // if (!res) {
      //   showErrorNotification('WORKSPACE_CREATION_FAILED');
      //   setSuccessBool(false);
      //   return;
      // }

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
            router.push('/auth/sign-in');
        } else if (errorCode === 'METADATA_UPDATE_FAILED') {
          // Special case: workspace was created but onboarding incomplete
          showErrorNotification(errorCode);
          router.push('/dashboard');
        } else {
          showErrorNotification(errorCode);
        }
        
        setSuccessBool(false);
        return;
      }

      // Success case
      if ("success" in res && res.success) {
        
        toast.custom(() => (
          <Notification 
            title="🎉 Success!" 
            description="Your workspace has been created successfully!" 
            variant="success" 
          />
        ));
        
        // Small delay to show success message before redirect
        router.push("/dashboard");
        setShowWorkspaceDialog(false);

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
  return (
    <div className="create-yam-dialog">
      <div className="background-opacity "></div>
      <div className="dialog-contain">
        <div className="close-btn" onClick={() => setShowWorkspaceDialog(false)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="15"
            viewBox="0 0 16 15"
            fill="none"
          >
            <path
              d="M11.75 3.75L4.25 11.25M4.25 3.75L11.75 11.25"
              stroke="#E6E6E6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

          {!successBool ? ( 
            <div className="yam-dialog-container justify-center items-center ">
              <form onSubmit={handleCreateWorkspace} className="workspace-dialog  ">
                <div className="flex flex-col  gap-5 w-full h-full items-center translate-x-[75%]">
                  <div className="head">
                    <h1>What would you like to call your workspace?</h1>
                  </div>
                  <div className="label-txt">Names must be in lowercase.</div>
                  <div className="label workspace">
                    <div className="">
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
                  </button>{" "}
                </div>
              </form>
            </div>
          ) : (
            <div className="flex items-center">
              <CreateAnimation
                successBool={successBool}
                loadingTxts={loadingTxts}
                barColor="#BDFFFB"
                title="We’re preparing your personalized cloud space—designed to grow with you."
              />
            </div>
          )}
      </div>
    </div>
  );
};

export default CreateWorkspaceDialog;
