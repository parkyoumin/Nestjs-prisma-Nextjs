import { Feedback } from "./feedback";

export interface Project {
  id: string;
  title: string;
  createdAt: string;
  deletedAt: string | null;
  feedbackCount?: number;
  feedbacks?: Feedback[];
}
