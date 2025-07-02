import { Feedback } from "./feedback.entity";

export interface IFeedbackRepository {
  createFeedback(feedback: {
    message: string;
    projectId: string;
  }): Promise<Feedback>;

  findFeedbacksByProjectId(projectId: string): Promise<Feedback[]>;

  findFeedbackById(id: number): Promise<Feedback | null>;

  deleteFeedback(id: number): Promise<void>;
}

export const IFeedbackRepository = Symbol("IFeedbackRepository");
