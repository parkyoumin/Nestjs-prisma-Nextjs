import { publicPost, del, get } from "@/api";
import { UnifiedResponse } from "@/types/api";
import { Feedback } from "@/types/feedback";

export const createFeedback = async (
  projectId: string,
  message: string,
): Promise<UnifiedResponse<{ createdId: string }>> => {
  return publicPost<{ createdId: string }>("/feedback", {
    projectId,
    message,
  });
};

export const getFeedbacksByProject = async (
  projectId: string,
  page: number,
  pageSize: number,
): Promise<UnifiedResponse<{ feedbacks: Feedback[]; total: number }>> => {
  return get<{ feedbacks: Feedback[]; total: number }>(
    `/feedback/project/${projectId}`,
    {
      params: {
        page,
        pageSize,
      },
    },
  );
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
