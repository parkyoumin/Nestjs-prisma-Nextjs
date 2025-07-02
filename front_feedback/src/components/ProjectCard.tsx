"use client";

import { useState, useRef, useEffect } from "react";
import {
  Link as LinkIcon,
  MoreVertical,
  EllipsisVerticalIcon,
} from "lucide-react";
import { Project } from "@/types/project";
import PrimaryButton from "./PrimaryButton";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

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
  }, [menuRef]);

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

  const copyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const encodedProjectName = encodeURIComponent(project.title);
    const url = `${window.location.origin}/feedback/${project.id}?name=${encodedProjectName}`;
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  return (
    <Link
      href={`/project/${project.id}`}
      className="relative block h-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
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
          onClick={copyLink}
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
          <div
            ref={menuRef}
            className="absolute right-0 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
          >
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
