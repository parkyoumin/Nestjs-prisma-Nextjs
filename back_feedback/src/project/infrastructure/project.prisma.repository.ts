import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IProjectRepository } from "../domain/project.repository";
import { Project } from "../domain/project.entity";
import { CreateProjectDto, UpdateProjectDto } from "src/types/project.type";

@Injectable()
export class ProjectPrismaRepository implements IProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createProject(data: CreateProjectDto): Promise<Project> {
    return this.prisma.project.create({
      data: {
        title: data.title,
        userId: data.userId,
      },
    });
  }

  async updateProject(id: string, data: UpdateProjectDto): Promise<Project> {
    const { userId, title } = data;
    const result = await this.prisma.project.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        title,
      },
    });

    if (result.count === 0) {
      return null;
    }

    return this.findById(id);
  }

  async deleteProject(id: string, userId: bigint): Promise<boolean> {
    const result = await this.prisma.project.updateMany({
      where: { id, userId, deletedAt: null },
      data: {
        deletedAt: new Date(),
      },
    });

    return result.count > 0;
  }

  async findById(id: string): Promise<Project | null> {
    return this.prisma.project.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async findProjectsByUserId(userId: bigint): Promise<Project[]> {
    const projectsWithCount = await this.prisma.project.findMany({
      where: { userId, deletedAt: null },
      include: {
        _count: {
          select: { feedbacks: { where: { deletedAt: null } } },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return projectsWithCount.map((p) => ({
      ...p,
      feedbackCount: p._count.feedbacks,
    }));
  }
}
