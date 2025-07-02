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
        deletedAt: null,
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
    const prismaUser = await this.prisma.user.update({
      where: {
        providerAccountId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    return this.toDomain(prismaUser);
  }

  async findFirst(providerAccountId: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findFirst({
      where: {
        providerAccountId,
      },
    });
    if (!prismaUser) return null;
    return this.toDomain(prismaUser);
  }

  async hardDeleteUser(providerAccountId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { providerAccountId },
    });
    if (!user) return;

    const projectIds = (
      await this.prisma.project.findMany({
        where: { userId: user.id },
        select: { id: true },
      })
    ).map((p) => p.id);

    await this.prisma.$transaction([
      this.prisma.feedback.deleteMany({
        where: { projectId: { in: projectIds } },
      }),
      this.prisma.project.deleteMany({ where: { userId: user.id } }),
      this.prisma.user.delete({ where: { providerAccountId } }),
    ]);
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
