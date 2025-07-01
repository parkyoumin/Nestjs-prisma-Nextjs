"use client";

import Image from "next/image";
import { Link as LinkIcon } from "lucide-react";
import { Project } from "@/types/project";
import PrimaryButton from "./PrimaryButton";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/project/${project.id}`,
    );
  };

  return (
    <div
      key={project.id}
      className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
    >
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-gray-800">{project.title}</h2>
        <p className="mt-1 text-sm text-gray-500">
          {project.feedbackCount ?? 0} feedback items
        </p>
        <PrimaryButton
          onClick={handleCopyLink}
          variant="grey"
          className="mt-4 !w-fit !px-3 !py-1.5 !text-sm"
        >
          <span className="flex items-center space-x-2">
            <span>Copy Link</span>
            <LinkIcon className="h-4 w-4" />
          </span>
        </PrimaryButton>
      </div>
      <div className="h-28 w-48 overflow-hidden rounded-lg bg-gray-100"></div>
    </div>
  );
}
