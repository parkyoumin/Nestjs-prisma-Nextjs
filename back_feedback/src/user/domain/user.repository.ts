import { CreateUser } from "src/types/user.type";
import { User } from "./user.entity";

export interface IUserRepository {
  createUser(createUser: CreateUser): Promise<User>;
  findUserByProviderAccountId(providerAccountId: string): Promise<User | null>;
  updateRefreshToken(
    providerAccountId: string,
    refreshToken: string,
  ): Promise<User>;
  deleteUser(providerAccountId: string): Promise<User>;
  findFirst(providerAccountId: string): Promise<User | null>;
  hardDeleteUser(providerAccountId: string): Promise<void>;
}

export const IUserRepository = Symbol("IUserRepository");
