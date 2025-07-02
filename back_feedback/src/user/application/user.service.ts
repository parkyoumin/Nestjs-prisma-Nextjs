import {
  Injectable,
  NotFoundException,
  Inject,
  ConflictException,
} from "@nestjs/common";
import { CreateUser } from "src/types/user.type";
import { IUserRepository } from "../domain/user.repository";
import { User } from "../domain/user.entity";

@Injectable()
export class UserService {
  constructor(
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async createUser(createUser: CreateUser): Promise<User> {
    const existingUser = await this.userRepository.findFirst(
      createUser.providerAccountId,
    );

    if (existingUser) {
      if (existingUser.deletedAt) {
        // Soft-deleted user exists, hard-delete them before creating a new one.
        await this.userRepository.hardDeleteUser(createUser.providerAccountId);
      } else {
        // Active user already exists.
        throw new ConflictException("User already exists.");
      }
    }

    return this.userRepository.createUser(createUser);
  }

  async isUserByProviderAccountId(providerAccountId: string) {
    const user: User =
      await this.userRepository.findUserByProviderAccountId(providerAccountId);

    if (user) {
      return true;
    } else {
      return false;
    }
  }

  async findUserByProviderAccountId(providerAccountId: string) {
    const user: User =
      await this.userRepository.findUserByProviderAccountId(providerAccountId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async updateRefreshToken(providerAccountId: string, refreshToken: string) {
    const user: User = await this.userRepository.updateRefreshToken(
      providerAccountId,
      refreshToken,
    );

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async deleteUser(providerAccountId: string) {
    return await this.userRepository.deleteUser(providerAccountId);
  }
}
