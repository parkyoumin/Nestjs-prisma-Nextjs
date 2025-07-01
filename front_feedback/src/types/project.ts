export interface Project {
  id: string;
  title: string;
  userId: bigint;
  createdAt: string;
  deletedAt: string | null;
  feedbackCount?: number;
}
