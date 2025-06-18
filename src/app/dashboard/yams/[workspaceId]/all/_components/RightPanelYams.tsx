"use client";

import DashboardHeader from "@/app/dashboard/_components/DashboardHeader";
import fetchYams from "@/libs/queries/fetch-yams";
import "@/styles/RightPanelDashboard.css";
import "@/styles/RightPanelDashboardYam.css";
import { SelectYam } from "@/types/server";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  expandRightPanel: boolean;
  setShowYamDialog: (Callback: boolean) => void;
  setShowAiModal: (Callback: boolean) => void;
};

// const yamData = [
//   {
//     name: "default yam",
//     ip: "123.46.789.21",
//     created: "just now",
//     type: "GPU",
//     gpus: "8 GPU / 2 TB",
//     workspace: "marcus' workspace",
//   },
//   {
//     name: "marcus's yam",
//     ip: "987.65.432.10",
//     created: "5 minutes ago",
//     type: "GPU",
//     gpus: "16 GPU / 4 TB",
//     workspace: "marcus' workspace",
//   },
// ];

const RightPanelYams = ({
  expandRightPanel,
  setShowYamDialog,
  setShowAiModal,
}: Props) => {
  const [yams, setYams] = useState<SelectYam[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams<{ workspaceId: string }>();
  const router = useRouter();

  useEffect(() => {
    async function getWorkspaces() {
      setLoading(true);
      try {
        const data = await fetchYams({
          workspaceId: params.workspaceId,
        });
        setYams(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Could not load workspaces. Please try again later.");
        setLoading(false);
      }
    }
    getWorkspaces();
  }, [params.workspaceId]);

  console.error(error);

  const handleRedirect = (name: string) => {
    router.push(`/dashboard/yams/${params.workspaceId}/${name}`);
  };
  return (
    <div
      className={`right-panel right-panel-yams ${
        expandRightPanel && "not-expand"
      }`}
    >
      <div className="dummy-panel"></div>
      <div className="main-panel">
        <DashboardHeader setShowAiModal={setShowAiModal} />

        <div className="section-yam">
          <nav>
            <div className="wrap">
              <Image alt="" src="/svgs/cluster.svg" width={24} height={24} />
              <h1>All Yams</h1>
            </div>

            <button onClick={() => setShowYamDialog(true)}>
              <span>
                <Image alt="" src="/svgs/cluster.svg" width={15} height={15} />
                Create a Yam
              </span>
              <Image alt="" src="/svgs/plus.svg" width={15} height={15} />
            </button>
          </nav>

          {!loading && (
            <div className="yam-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>IP Address</th>
                    <th>Created</th>
                    <th>Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {yams.map((yam, index) => (
                    <tr key={index} onClick={() => handleRedirect(yam.name)}>
                      <td>
                        <div className="yam-name">
                          <span className="title-yam">
                            <Image
                              src="/svgs/cluster.svg"
                              alt="server"
                              width={15}
                              height={15}
                            />
                            <div className="title">{yam.name}</div>
                          </span>
                          <span className="meta">
                            yam.gpus • <span className="status">Active</span>{" "}
                            <span className="workspace">
                              <Image
                                src="/svgs/user.svg"
                                alt=""
                                height={15}
                                width={15}
                              />{" "}
                              {yam.namespace}
                            </span>
                            <span className="workspace">
                              <Image
                                src="/svgs/flag.svg"
                                alt=""
                                height={15}
                                width={15}
                              />
                              Nigeria Local Data Center
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="td">{yam.domain}</td>
                      <td className="td">
                        {new Date(yam.createdAt).toDateString()}
                      </td>
                      <td className="td">GPU</td>
                      <td>
                        <button className="action-btn">⋮</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightPanelYams;
