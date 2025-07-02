"use client";

import { useEffect, useState } from "react";
import { Project } from "@/types/project";
import ProjectCard from "@/components/ProjectCard";
import { Search } from "lucide-react";
import Modal from "@/components/Modal";
import PrimaryButton from "@/components/PrimaryButton";
import { createProject, getProjects } from "@/services/projectService";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await getProjects();

        setProjects(fetchedProjects || []);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setProjects([]);
      }
    };
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!projectTitle.trim()) {
      setError("Project title cannot be empty.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const newProject = await createProject(projectTitle);
      setProjects((prevProjects) => [newProject, ...prevProjects]);
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
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-32">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Projects</h1>
          <p className="mt-2 text-gray-500">Manage your feedback projects</p>
        </div>

        {/* Search and Actions */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1" style={{ maxWidth: "24rem" }}>
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

        {/* Project List */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: Project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Create Project Modal */}
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
}
