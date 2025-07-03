import { Feedback } from "./feedback";

export interface Project {
  id: string;
  title: string;
  userId: bigint;
  createdAt: string;
  deletedAt: string | null;
  feedbackCount?: number;
  feedbacks?: Feedback[];
}
