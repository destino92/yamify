import React, { useState } from "react";
import "@/styles/CreateYamDialog.css";
import Image from "next/image";
import CreateAnimation from "@/components/Home/CreateAnimation";
import { createWorkspaceAction } from "../_actions";
import { useRouter } from "next/navigation";

type Props = {
  setShowWorkspaceDialog: (Callback: boolean) => void;
  loadingTxts: string[];
};

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
    setCreateYam(true);
  };

  const handleCreateWorkspace = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessBool(true);

    try {
      const res = await createWorkspaceAction({
        namespace: workspaceName,
        createYam: createYam,
      });

      console.log({ res });
      router.push("/dashboard");
      setSuccessBool(false);
      setShowYamDialog(false);
    } catch (e) {
      console.log(e);
      setSuccessBool(true);
    }
  };

  return (
    <div className="create-yam-dialog">
      <div className="background-opacity "></div>
      <div className="dialog-contain">
        <div className="close-btn" onClick={() => setShowYamDialog(false)}>
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
