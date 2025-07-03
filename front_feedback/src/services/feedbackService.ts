import { publicPost, del } from "@/api";
import { UnifiedResponse } from "@/types/api";

export const createFeedback = async (
  projectId: string,
  message: string,
): Promise<UnifiedResponse<{ createdId: string }>> => {
  return publicPost<{ createdId: string }>("/feedback", {
    projectId,
    message,
  });
};

export const deleteFeedback = async (
  projectId: string,
  id: number,
): Promise<UnifiedResponse<null>> => {
  return del<null>(`/feedback/${id}`, {
    params: {
      projectId,
    },
  });
};
