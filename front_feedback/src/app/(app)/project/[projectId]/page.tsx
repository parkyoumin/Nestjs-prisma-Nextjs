"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getProject } from "@/services/projectService";
import {
  deleteFeedback,
  getFeedbacksByProject,
} from "@/services/feedbackService";
import { Project } from "@/types/project";
import { Feedback } from "@/types/feedback";
import { useAuthStore } from "@/store/auth";
import PrimaryButton from "@/components/PrimaryButton";
import { useModal } from "@/hooks/useModal";

type FeedbackWithStatus = Feedback & { isChecked: boolean };

const ProjectDetailPage = () => {
  const params = useParams();
  const projectId = params.projectId as string;
  const { user } = useAuthStore();
  const { openModal } = useModal();

  const [project, setProject] = useState<Project | null>(null);
  const [feedbacks, setFeedbacks] = useState<FeedbackWithStatus[]>([]);
  const [projectLoading, setProjectLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [feedbacksLoading, setFeedbacksLoading] = useState(false);

  const observer = useRef<IntersectionObserver>();
  const lastFeedbackElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (feedbacksLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [feedbacksLoading, hasMore],
  );

  useEffect(() => {
    if (projectId && user) {
      const fetchProjectData = async () => {
        try {
          setProjectLoading(true);
          const projectData = await getProject(projectId);
          if (projectData.success) {
            setProject(projectData.data);
          }
        } catch (error) {
          console.error("Failed to fetch project data:", error);
          setProject(null);
        } finally {
          setProjectLoading(false);
        }
      };
      fetchProjectData();
      setFeedbacks([]);
      setPage(1);
      setHasMore(true);
    }
  }, [projectId, user]);

  useEffect(() => {
    if (!projectId || !user || !hasMore) return;

    const fetchFeedbacks = async () => {
      setFeedbacksLoading(true);
      try {
        const response = await getFeedbacksByProject(projectId, page, 10);
        if (response.success) {
          const newFeedbacks = response.data.feedbacks.map((f) => ({
            ...f,
            isChecked: false,
          }));
          setFeedbacks((prev) => [...prev, ...newFeedbacks]);
          setHasMore(
            response.data.feedbacks.length > 0 &&
              response.data.total > page * 10,
          );
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Failed to fetch feedbacks:", error);
        setHasMore(false);
      } finally {
        setFeedbacksLoading(false);
      }
    };

    if (page > 0) {
      fetchFeedbacks();
    }
  }, [projectId, user, page, hasMore]);

  const handleToggleCheck = (feedbackId: number) => {
    setFeedbacks(
      feedbacks.map((f) =>
        f.id === feedbackId ? { ...f, isChecked: !f.isChecked } : f,
      ),
    );
  };

  const openDeleteConfirmModal = (feedbackId: number) => {
    openModal(
      <FeedbackDeleteConfirm
        projectId={projectId}
        feedbackId={feedbackId}
        onSuccess={() => {
          setFeedbacks((prev) => prev.filter((f) => f.id !== feedbackId));
        }}
      />,
    );
  };

  if (projectLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-gray-700">
          Project not found or failed to load.
        </p>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-5xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <div>
                <Link
                  href="/dashboard"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Projects
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-2 text-sm font-medium text-gray-800">
                  {project.title}
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="mb-10 border-b border-gray-200 pb-5">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {project.title}
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Collect and manage feedback for {project.title}
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900">Feedback</h2>

        {feedbacks.length === 0 && !feedbacksLoading ? (
          <div className="mt-10 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900">
              No feedback received yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Share the feedback link with your users to start collecting
              insights.
            </p>
          </div>
        ) : (
          <ul className="mt-6 space-y-4">
            {feedbacks.map((feedback, index) => {
              const itemContent = (
                <>
                  <div className="flex min-w-0 flex-1 items-start gap-x-4">
                    <div className="min-w-0 flex-auto">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold leading-6 text-gray-900">
                          {new Date(feedback.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                      <p
                        className={`mt-1 text-base leading-relaxed ${
                          feedback.isChecked
                            ? "text-gray-400 line-through"
                            : "text-gray-700"
                        }`}
                      >
                        {feedback.message}
                      </p>
                      <p className="mt-2 text-sm text-gray-500">Anonymous</p>
                    </div>
                  </div>
                  <button
                    onClick={() => openDeleteConfirmModal(feedback.id)}
                    className="rounded-md bg-white py-1 px-2.5 text-sm font-semibold text-gray-700 opacity-0 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 ease-in-out hover:bg-gray-50 group-hover:opacity-100"
                    aria-label="Delete feedback"
                  >
                    Delete
                  </button>
                </>
              );

              if (feedbacks.length === index + 1) {
                return (
                  <li
                    ref={lastFeedbackElementRef}
                    key={feedback.id}
                    className="group flex items-start justify-between gap-x-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-150 ease-in-out hover:border-gray-300 hover:bg-gray-50"
                  >
                    {itemContent}
                  </li>
                );
              } else {
                return (
                  <li
                    key={feedback.id}
                    className="group flex items-start justify-between gap-x-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-150 ease-in-out hover:border-gray-300 hover:bg-gray-50"
                  >
                    {itemContent}
                  </li>
                );
              }
            })}
          </ul>
        )}
        {feedbacksLoading && (
          <div className="flex justify-center items-center p-4">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-gray-500">Loading more feedbacks...</p>
          </div>
        )}
      </div>
    </main>
  );
};

// Delete Confirmation
const FeedbackDeleteConfirm = ({
  projectId,
  feedbackId,
  onSuccess,
}: {
  projectId: string;
  feedbackId: number;
  onSuccess: () => void;
}) => {
  const { closeModal } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteFeedback(projectId, feedbackId);
      if (response.success) {
        onSuccess();
      } else {
        console.error("Failed to delete feedback:", response.message);
      }
      closeModal();
    } catch (err) {
      console.error("Failed to delete feedback:", err);
      closeModal();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800">Confirm Deletion</h2>
      <p className="text-base text-gray-700">
        Are you sure you want to delete this feedback? This action cannot be
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

export default ProjectDetailPage;
