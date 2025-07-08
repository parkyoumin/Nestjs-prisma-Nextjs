import { Feedback } from "./feedback.entity";

export interface IFeedbackRepository {
  createFeedback(feedback: {
    message: string;
    projectId: string;
  }): Promise<Feedback>;

  getFeedbacksByProject(data: {
    projectId: string;
    page: number;
    pageSize: number;
  }): Promise<{ feedbacks: Feedback[]; total: number }>;

  deleteFeedback(id: number): Promise<void>;
}

export const IFeedbackRepository = Symbol("IFeedbackRepository");
