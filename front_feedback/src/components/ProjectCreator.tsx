"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { createProject } from "@/services/project.client";
import PrimaryButton from "./PrimaryButton";
import { useRouter } from "next/navigation";

export default function ProjectCreator() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!projectTitle.trim()) {
      setError("Project title cannot be empty.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      await createProject(projectTitle);
      setIsModalOpen(false);
      setProjectTitle("");

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PrimaryButton
        onClick={() => setIsModalOpen(true)}
        className="!w-auto !px-5 !py-2.5"
        variant="primary"
      >
        New Project
      </PrimaryButton>

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
