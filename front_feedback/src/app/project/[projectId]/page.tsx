"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getProject } from "@/services/projectService";
import { deleteFeedback } from "@/services/feedbackService";
import { Project } from "@/types/project";
import { Feedback } from "@/types/feedback";
import { useAuthStore } from "@/store/auth";

type FeedbackWithStatus = Feedback & { isChecked: boolean };

const ProjectDetailPage = () => {
  const params = useParams();
  const projectId = params.projectId as string;
  const { user } = useAuthStore();

  const [project, setProject] = useState<Project | null>(null);
  const [feedbacks, setFeedbacks] = useState<FeedbackWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId && user) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const projectData = await getProject(projectId);
          setProject(projectData);
          if (projectData.feedbacks) {
            setFeedbacks(
              projectData.feedbacks
                .map((f) => ({ ...f, isChecked: false }))
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
                ),
            );
          }
        } catch (error) {
          console.error("Failed to fetch project data:", error);
          setProject(null);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [projectId, user]);

  const handleToggleCheck = (feedbackId: string) => {
    setFeedbacks(
      feedbacks.map((f) =>
        f.id === feedbackId ? { ...f, isChecked: !f.isChecked } : f,
      ),
    );
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await deleteFeedback(feedbackId);
        setFeedbacks(feedbacks.filter((f) => f.id !== feedbackId));
      } catch (error) {
        console.error("Failed to delete feedback", error);
      }
    }
  };

  if (loading) {
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

        {feedbacks.length === 0 ? (
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
            {feedbacks.map((feedback) => (
              <li
                key={feedback.id}
                className="group flex items-start justify-between gap-x-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-150 ease-in-out hover:border-gray-300 hover:bg-gray-50"
              >
                <div className="flex min-w-0 flex-1 items-start gap-x-4">
                  <input
                    type="checkbox"
                    checked={feedback.isChecked}
                    onChange={() => handleToggleCheck(feedback.id)}
                    className="mt-1 h-5 w-5 flex-shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  />
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
                      {feedback.content}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">Anonymous</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteFeedback(feedback.id)}
                  className="rounded-md bg-white py-1 px-2.5 text-sm font-semibold text-gray-700 opacity-0 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 ease-in-out hover:bg-gray-50 group-hover:opacity-100"
                  aria-label="Delete feedback"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default ProjectDetailPage;
