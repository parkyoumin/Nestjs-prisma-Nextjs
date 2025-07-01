export class User {
  id: bigint;
  providerAccountId: string;
  email: string;
  name: string;
  refreshToken?: string;
  createdAt: Date;
  deletedAt?: Date;
}
