import Image from "next/image";
import Link from "next/link";
import { tag } from "@/utils/tags";
import { groups } from "@/utils/data";
import { Project } from "@prisma/client";
import { useState, useRef, useEffect } from "react";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import { removeProjectAction } from "@/app/dashboard/_actions";
import "@/styles/ProjectCardMenu.css";
import { toast } from 'sonner';
import Notification from "@/components/Notification/Notification";

type ProjectCardProps = {
  project: Project;
  onProjectDeleted?: () => void;
  lightMode?: boolean;
};

const ProjectCard = ({ project, onProjectDeleted, lightMode = false }: ProjectCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Close menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const handleDelete = async () => {
    try {
      const result = await removeProjectAction({ id: project.id });
      
      if (result.success) {
        toast.custom(() => <Notification title="Success !!!" description="Project deleted successfully" variant="success" />)
       
        if (onProjectDeleted) {
          onProjectDeleted();
        }
      } else {
        toast.custom(() => <Notification title="Error !!!" description={result.error || "Failed to delete project"} variant="error" />)
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      toast.custom(() => <Notification title="Error !!!" description="An unexpected error occurred" variant="error" />)
    }
  };
  
  return (
  <div className="project">
    <div className="contain-head">
      <div className="txt">
        <Image
          src={`/svgs/${project.type}.svg`}
          alt=""
          width={15}
          height={15}
        />
        <p>{project.name}</p>
      </div>
      <div className="menu-container" ref={menuRef}>
        <button 
          className="menu-button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="More options"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="3" r="1.5" fill="currentColor"/>
            <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
            <circle cx="8" cy="13" r="1.5" fill="currentColor"/>
          </svg>
        </button>
        {isMenuOpen && (
          <div className="dropdown-menu">
            <button onClick={() => {
              setIsMenuOpen(false);
              setIsConfirmDialogOpen(true);
            }}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>

    <div className="deploy-details">
      <div className="wrap">
        <div className="ctn">deployments</div>
        <div className="ctn">
          {/* Replace with actual time if available */}
          {project.createdAt ? `${Math.floor((Date.now() - new Date(project.createdAt).getTime()) / 60000)} mins ago` : ""}
        </div>
        <div className="app">
          <Image
            src={`/svgs/${project.type}.svg`}
            alt=""
            width={15}
            height={15}
          />
          <p>{project.type}</p>
        </div>
      </div>
      <div className="status">{project.status}</div>
    </div>

    <div className="group-ctn">
      {tag.icon({
        color: groups[0].color,
        width: 15,
        height: 15,
      })}
      <p>{project.namespace}</p>
    </div>

    <div className="project-links">
      {project.url && (
        <Link href={project.url} target="_blank">
          {project.url}
        </Link>
      )}
    </div>

    <div className="project-links">
      {project.username && (
        <Link href="/#">Default username: {project.username}</Link>
      )}
    </div>
    <div className="project-links">
      {project.password && (
        <Link href="/#">Default password: {project.password}</Link>
      )}
    </div>
    {/* Dialogue de confirmation pour la suppression */}
    <ConfirmDialog
      isOpen={isConfirmDialogOpen}
      onClose={() => setIsConfirmDialogOpen(false)}
      onConfirm={handleDelete}
      title="Delete Project"
      message={`Are you sure you want to delete the project ${project.name}? This action cannot be undone.`}
      confirmLabel="Delete"
      cancelLabel="Cancel"
      lightMode={lightMode}
    />
  </div>
  );
};

export default ProjectCard;