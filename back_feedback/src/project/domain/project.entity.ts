export class Project {
  id: string;
  title: string;
  userId: bigint;
  createdAt: Date;
  deletedAt: Date | null;
}
