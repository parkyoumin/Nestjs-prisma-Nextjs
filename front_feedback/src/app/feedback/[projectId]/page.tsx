"use client";

import { createFeedback } from "@/services/feedbackService";
import { useState } from "react";
import { useToast } from "@/hooks/useToast";
import PrimaryButton from "@/components/PrimaryButton";

interface FeedbackPageProps {
  params: {
    projectId: string;
  };
  searchParams: {
    name?: string;
  };
}

export default function FeedbackPage({
  params,
  searchParams,
}: FeedbackPageProps) {
  const { projectId } = params;
  const projectName = searchParams.name
    ? decodeURIComponent(searchParams.name)
    : "Sample Project Title";

  const { addToast } = useToast();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      addToast({ message: "Feedback content cannot be empty.", type: "error" });
      return;
    }
    setIsSubmitting(true);
    try {
      await createFeedback(projectId, content);
      addToast({
        message: "Feedback submitted successfully!",
        type: "success",
      });
      setContent("");
    } catch (err) {
      addToast({
        message: "Failed to submit feedback. Please try again.",
        type: "error",
      });
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-2 text-3xl font-bold text-gray-800">{projectName}</h1>
        <p className="mb-8 text-gray-500">
          We would love to hear your feedback for this project!
        </p>

        <div>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="feedback-message"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Your Feedback
              </label>
              <textarea
                id="feedback-message"
                name="message"
                rows={6}
                className="w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Tell us what you think, what you like, or what we can improve..."
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSubmitting}
              ></textarea>
            </div>
          </div>

          <div className="mt-8">
            <PrimaryButton
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
