import { publicPost } from "@/api";

export const createFeedback = async (projectId: string, content: string) => {
  const response = await publicPost("/feedback", {
    projectId: projectId,
    message: content,
  });
  return response.data;
};
