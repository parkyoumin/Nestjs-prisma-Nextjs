"use client";

import { useState } from "react";
import { Search, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import PrimaryButton from "@/components/PrimaryButton";
import Modal from "@/components/Modal";
import { createProject } from "@/services/projectService";

const mockProjects = [
  {
    id: 1,
    name: "Project Alpha",
    feedbackCount: 120,
    imageUrl: "/project-thumb-1.png",
  },
  {
    id: 2,
    name: "Project Beta",
    feedbackCount: 85,
    imageUrl: "/project-thumb-2.png",
  },
  {
    id: 3,
    name: "Project Gamma",
    feedbackCount: 205,
    imageUrl: "/project-thumb-3.png",
  },
  {
    id: 4,
    name: "Project Delta",
    feedbackCount: 50,
    imageUrl: "/project-thumb-4.png",
  },
];

const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const newProject = await createProject(projectTitle);
      setIsModalOpen(false);
      setProjectTitle("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-32 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Projects</h1>
          <p className="mt-2 text-gray-500">Manage your feedback projects</p>
        </div>

        {/* Search and Actions */}
        <div className="mb-8 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <PrimaryButton
            onClick={() => setIsModalOpen(true)}
            className="!w-auto !px-5 !py-2.5"
            variant="primary"
          >
            New Project
          </PrimaryButton>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          {mockProjects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-gray-800">
                  {project.name}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {project.feedbackCount} feedback items
                </p>
                <PrimaryButton
                  onClick={() => {
                    /* Copy link logic here */
                  }}
                  variant="grey"
                  className="mt-4 !w-fit !px-3 !py-1.5 !text-sm"
                >
                  <span className="flex items-center space-x-2">
                    <span>Copy Link</span>
                    <LinkIcon className="h-4 w-4" />
                  </span>
                </PrimaryButton>
              </div>
              <div className="h-28 w-48 overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={project.imageUrl}
                  alt={`Abstract thumbnail for ${project.name}`}
                  width={192}
                  height={112}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">New Project</h2>
          <form onSubmit={handleCreateProject}>
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="text-sm font-medium text-gray-700"
              >
                Project Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="My Awesome Project"
                disabled={isLoading}
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
            <div className="mt-8 flex justify-end space-x-4">
              <PrimaryButton
                type="button"
                onClick={() => setIsModalOpen(false)}
                variant="grey"
                disabled={isLoading}
              >
                Cancel
              </PrimaryButton>
              <PrimaryButton
                type="submit"
                variant="primary"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Project"}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default DashboardPage;
