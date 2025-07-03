"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/types/project";
import ProjectCard from "@/components/ProjectCard";
import { Search } from "lucide-react";
import PrimaryButton from "@/components/PrimaryButton";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "@/services/projectService";
import { useModal } from "@/hooks/useModal";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { openModal } = useModal();

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

  const handleOpenCreateModal = () => {
    openModal(
      <CreateProjectForm
        onSuccess={(newProject) => {
          setProjects((prevProjects) => [newProject, ...prevProjects]);
        }}
      />,
    );
  };

  const handleOpenEditModal = (project: Project) => {
    openModal(
      <EditProjectForm
        project={project}
        onSuccess={(updatedProject) => {
          setProjects((prevProjects) =>
            prevProjects.map((p) =>
              p.id === updatedProject.id ? updatedProject : p,
            ),
          );
        }}
      />,
    );
  };

  const handleOpenDeleteModal = (projectId: string) => {
    openModal(
      <DeleteConfirm
        projectId={projectId}
        onSuccess={() => {
          setProjects((prevProjects) =>
            prevProjects.filter((p) => p.id !== projectId),
          );
        }}
      />,
    );
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
            onClick={handleOpenCreateModal}
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
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />
          ))}
        </div>
      </div>
    </>
  );
}

// --- Modal Content Components ---

// 1. Create Project Form
const CreateProjectForm = ({
  onSuccess,
}: {
  onSuccess: (newProject: Project) => void;
}) => {
  const { closeModal } = useModal();
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

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
      onSuccess(newProject);
      closeModal();
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">New Project</h2>
      <form onSubmit={handleCreateProject}>
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-gray-700">
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
            onClick={closeModal}
            variant="grey"
            disabled={isCreating}
          >
            Cancel
          </PrimaryButton>
          <PrimaryButton type="submit" variant="primary" disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Project"}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};

// 2. Edit Project Form
const EditProjectForm = ({
  project,
  onSuccess,
}: {
  project: Project;
  onSuccess: (updatedProject: Project) => void;
}) => {
  const { closeModal } = useModal();
  const [updatedProjectTitle, setUpdatedProjectTitle] = useState(project.title);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const handleUpdateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!updatedProjectTitle.trim()) {
      setUpdateError("Project title cannot be empty.");
      return;
    }
    setIsUpdating(true);
    setUpdateError(null);

    try {
      const updatedProject = await updateProject(
        project.id,
        updatedProjectTitle,
      );
      onSuccess(updatedProject);
      closeModal();
    } catch (err: any) {
      setUpdateError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
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
            onClick={closeModal}
            variant="grey"
            disabled={isUpdating}
          >
            Cancel
          </PrimaryButton>
          <PrimaryButton type="submit" variant="primary" disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save Changes"}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};

// 3. Delete Confirmation
const DeleteConfirm = ({
  projectId,
  onSuccess,
}: {
  projectId: string;
  onSuccess: () => void;
}) => {
  const { closeModal } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProject(projectId);
      onSuccess();
      closeModal();
    } catch (err: any) {
      console.error("Failed to delete project:", err);
      // You could show a toast message here for the error
      closeModal();
    }
  };

  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800">Delete Project</h2>
      <p className="text-gray-600">
        Are you sure you want to delete this project? This action cannot be
        undone.
      </p>
      <div className="flex justify-center space-x-4 pt-4">
        <PrimaryButton
          onClick={closeModal}
          variant="grey"
          disabled={isDeleting}
        >
          Cancel
        </PrimaryButton>
        <PrimaryButton
          onClick={handleConfirmDelete}
          variant="danger"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </PrimaryButton>
      </div>
    </div>
  );
};
