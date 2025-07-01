import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUser } from "src/types/user.type";
import { IUserRepository } from "../domain/user.repository";
import { User } from "../domain/user.entity";
import { User as PrismaUser } from "@prisma/client";

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUser: CreateUser): Promise<User> {
    const { providerAccountId, email, name } = createUser;

    const prismaUser = await this.prisma.user.create({
      data: {
        providerAccountId,
        email,
        name,
      },
    });
    return this.toDomain(prismaUser);
  }

  async findUserByProviderAccountId(
    providerAccountId: string,
  ): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: {
        providerAccountId,
      },
    });
    if (!prismaUser) return null;
    return this.toDomain(prismaUser);
  }

  async updateRefreshToken(
    providerAccountId: string,
    refreshToken: string,
  ): Promise<User> {
    const prismaUser = await this.prisma.user.update({
      data: {
        refreshToken,
      },
      where: {
        providerAccountId,
      },
    });
    return this.toDomain(prismaUser);
  }

  async deleteUser(providerAccountId: string) {
    return await this.prisma.user.delete({
      where: {
        providerAccountId,
      },
    });
  }

  private toDomain(prismaUser: PrismaUser): User {
    const user = new User();
    user.id = prismaUser.id;
    user.providerAccountId = prismaUser.providerAccountId;
    user.email = prismaUser.email;
    user.name = prismaUser.name;
    user.refreshToken = prismaUser.refreshToken;
    user.createdAt = prismaUser.createdAt;
    user.deletedAt = prismaUser.deletedAt;
    return user;
  }
}
