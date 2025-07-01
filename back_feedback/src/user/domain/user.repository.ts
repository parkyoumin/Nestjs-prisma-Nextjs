import { CreateUser } from "src/types/user.type";
import { User } from "./user.entity";

export interface IUserRepository {
  createUser(createUser: CreateUser): Promise<User>;
  findUserByProviderAccountId(providerAccountId: string): Promise<User | null>;
  updateRefreshToken(
    providerAccountId: string,
    refreshToken: string,
  ): Promise<User>;
  deleteUser(providerAccountId: string): Promise<any>;
}
