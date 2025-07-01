import { Request } from "express";

export interface GoogleUser {
  providerAccountId: string;
  name: string;
  email: string;
  type: "login" | "signup";
}

export type UserPayload = {
  id: bigint;
  email: string;
};

export type AuthenticatedRequest = Request & {
  user: UserPayload;
};
