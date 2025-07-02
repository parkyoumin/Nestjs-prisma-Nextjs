interface FeedbackPageProps {
  params: {
    projectId: string;
  };
}

export default async function FeedbackPage({ params }: FeedbackPageProps) {
  const { projectId } = params;

  // Mock project data
  const project = {
    id: projectId,
    title: "Sample Project Title",
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          {project.title}
        </h1>
        <p className="mb-8 text-gray-500">
          We would love to hear your feedback for this project!
        </p>

        <form>
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
              ></textarea>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-black transition-colors hover:bg-primary/80"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
