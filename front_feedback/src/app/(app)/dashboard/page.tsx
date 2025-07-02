"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/types/project";
import ProjectCard from "@/components/ProjectCard";
import { Search } from "lucide-react";
import Modal from "@/components/Modal";
import PrimaryButton from "@/components/PrimaryButton";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "@/services/projectService";

export default function DashboardPage() {
  // --- States for Project List ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // --- States for Project Creation ---
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // --- States for Project Editing ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [updatedProjectTitle, setUpdatedProjectTitle] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // --- States for Project Deletion ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(
    null,
  );

  const router = useRouter();

  // --- Fetch Projects ---
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

  // --- Handle Project Creation ---
  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) {
      setCreateError("Project title cannot be empty.");
      return;
    }
    setIsCreating(true);
    setCreateError(null);

    try {
      const newProject = await createProject(newProjectTitle);
      setProjects((prevProjects) => [newProject, ...prevProjects]);
      setIsCreateModalOpen(false);
      setNewProjectTitle("");
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  // --- Handle Project Editing ---
  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setUpdatedProjectTitle(project.title);
    setIsEditModalOpen(true);
    setUpdateError(null);
  };

  const handleUpdateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProject || !updatedProjectTitle.trim()) {
      setUpdateError("Project title cannot be empty.");
      return;
    }
    setIsUpdating(true);
    setUpdateError(null);

    try {
      const updatedProject = await updateProject(
        editingProject.id,
        updatedProjectTitle,
      );
      setProjects((prevProjects) =>
        prevProjects.map((p) =>
          p.id === editingProject.id ? updatedProject : p,
        ),
      );
      setIsEditModalOpen(false);
      setEditingProject(null);
    } catch (err: any) {
      setUpdateError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // --- Handle Project Deletion ---
  const handleDeleteClick = (projectId: string) => {
    setDeletingProjectId(projectId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProjectId) return;

    try {
      await deleteProject(deletingProjectId);
      setProjects((prevProjects) =>
        prevProjects.filter((p) => p.id !== deletingProjectId),
      );
    } catch (err: any) {
      console.error("Failed to delete project:", err);
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingProjectId(null);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <PrimaryButton
            onClick={() => setIsCreateModalOpen(true)}
            className="!w-auto !px-5 !py-2.5"
            variant="primary"
          >
            New Project
          </PrimaryButton>
        </div>

        {/* Project List */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project: Project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
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
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="My Awesome Project"
                disabled={isCreating}
              />
              {createError && (
                <p className="mt-2 text-sm text-red-600">{createError}</p>
              )}
            </div>
            <div className="mt-8 flex justify-end space-x-4">
              <PrimaryButton
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                variant="grey"
                disabled={isCreating}
              >
                Cancel
              </PrimaryButton>
              <PrimaryButton
                type="submit"
                variant="primary"
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create Project"}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </Modal>

      {/* Edit Project Modal */}
      {editingProject && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        >
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Project</h2>
            <form onSubmit={handleUpdateProject}>
              <div className="space-y-2">
                <label
                  htmlFor="edit-title"
                  className="text-sm font-medium text-gray-700"
                >
                  Project Title
                </label>
                <input
                  id="edit-title"
                  name="title"
                  type="text"
                  required
                  value={updatedProjectTitle}
                  onChange={(e) => setUpdatedProjectTitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="My Awesome Project"
                  disabled={isUpdating}
                />
                {updateError && (
                  <p className="mt-2 text-sm text-red-600">{updateError}</p>
                )}
              </div>
              <div className="mt-8 flex justify-end space-x-4">
                <PrimaryButton
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  variant="grey"
                  disabled={isUpdating}
                >
                  Cancel
                </PrimaryButton>
                <PrimaryButton
                  type="submit"
                  variant="primary"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Project"}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className="space-y-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Delete Project</h2>
          <p className="text-gray-600">
            Are you sure you want to delete this project? This action cannot be
            undone.
          </p>
          <div className="flex justify-center space-x-4">
            <PrimaryButton
              onClick={() => setIsDeleteModalOpen(false)}
              variant="grey"
            >
              Cancel
            </PrimaryButton>
            <PrimaryButton
              onClick={handleConfirmDelete}
              className="!bg-red-600 hover:!bg-red-700"
            >
              Delete
            </PrimaryButton>
          </div>
        </div>
      </Modal>
    </>
  );
}
