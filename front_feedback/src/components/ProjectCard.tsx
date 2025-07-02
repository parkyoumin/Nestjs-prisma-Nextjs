"use client";

import { useState } from "react";
import { Link as LinkIcon, MoreVertical } from "lucide-react";
import { Project } from "@/types/project";
import PrimaryButton from "./PrimaryButton";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(
      `${window.location.origin}/feedback/${project.id}`,
    );
    // You might want to show a toast notification here
    alert("Link copied!");
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(project);
    setIsMenuOpen(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(project.id);
    setIsMenuOpen(false);
  };

  return (
    <Link
      href={`/project/${project.id}`}
      className="relative block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
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

      {/* Dropdown Menu */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleMenuToggle}
          className="rounded-full p-2 hover:bg-gray-100"
        >
          <MoreVertical className="h-5 w-5 text-gray-500" />
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <button
                onClick={handleEditClick}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Edit
              </button>
              <button
                onClick={handleDeleteClick}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                role="menuitem"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
