import { publicPost, del } from "@/api";

export const createFeedback = async (projectId: string, content: string) => {
  const response = await publicPost("/feedback", {
    projectId: projectId,
    message: content,
  });
  return response.data;
};

export const deleteFeedback = async (id: string): Promise<void> => {
  await del(`/feedback/${id}`);
};
