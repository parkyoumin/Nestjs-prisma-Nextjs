"use client";

import { Link as LinkIcon } from "lucide-react";
import { Project } from "@/types/project";
import PrimaryButton from "./PrimaryButton";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(
      `${window.location.origin}/project/${project.id}`,
    );
    // You might want to show a toast notification here
    alert("Link copied!");
  };

  return (
    <Link
      href={`/project/${project.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex h-full flex-col justify-between">
        <div>
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
            {project.title}
          </h5>
          <p className="font-normal text-gray-500">
            {project.feedbackCount ?? 0} feedback items
          </p>
        </div>
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
    </Link>
  );
}
