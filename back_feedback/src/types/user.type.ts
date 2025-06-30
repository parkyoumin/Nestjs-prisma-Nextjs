export interface CreateUser {
  providerAccountId: string;
  name: string;
  email: string;
}

export interface User {
  id: bigint;
  providerAccountId: string;
  name: string;
  email: string;
  refreshToken?: string;
  createdAt: Date;
}
