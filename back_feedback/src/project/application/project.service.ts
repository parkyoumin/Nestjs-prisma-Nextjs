import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { IProjectRepository } from "../domain/project.repository";
import { Project } from "../domain/project.entity";
import { CreateProjectDto, UpdateProjectDto } from "src/types/project.type";

@Injectable()
export class ProjectService {
  constructor(
    @Inject(IProjectRepository)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async createProject(createDto: CreateProjectDto): Promise<Project> {
    return this.projectRepository.createProject(createDto);
  }

  async updateProject(
    id: string,
    updateDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.projectRepository.updateProject(id, updateDto);
    if (!project) {
      throw new ForbiddenException("Project not found or access denied.");
    }
    return project;
  }

  async deleteProject(id: string, userId: bigint): Promise<void> {
    const isSuccess = await this.projectRepository.deleteProject(id, userId);
    if (!isSuccess) {
      throw new ForbiddenException("Project not found or access denied.");
    }
  }
}
