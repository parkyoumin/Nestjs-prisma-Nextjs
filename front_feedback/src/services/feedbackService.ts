import { publicPost, del } from "@/api";

export const createFeedback = async (projectId: string, content: string) => {
  const response = await publicPost("/feedback", {
    projectId: projectId,
    message: content,
  });
  return response.data;
};

export const deleteFeedback = async (
  projectId: string,
  id: number,
): Promise<void> => {
  await del(`/feedback/${id}`, {
    params: {
      projectId,
    },
  });
};
