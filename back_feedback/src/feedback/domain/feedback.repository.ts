import { Feedback } from "./feedback.entity";

export interface IFeedbackRepository {
  createFeedback(feedback: {
    message: string;
    projectId: string;
  }): Promise<Feedback>;

  deleteFeedback(id: number): Promise<void>;
}

export const IFeedbackRepository = Symbol("IFeedbackRepository");
