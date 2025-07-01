import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { CreateUser } from "src/types/user.type";
import { IUserRepository } from "../domain/user.repository";
import { User } from "../domain/user.entity";

@Injectable()
export class UserService {
  constructor(
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async createUser(createUser: CreateUser) {
    const user: User = await this.userRepository.createUser(createUser);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
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
