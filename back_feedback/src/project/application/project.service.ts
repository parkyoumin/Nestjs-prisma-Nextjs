import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new NotFoundException("Project not found.");
    }
    if (project.userId !== updateDto.userId) {
      throw new ForbiddenException("You don't have permission to update.");
    }
    return this.projectRepository.updateProject(id, updateDto);
  }

  async deleteProject(id: string, userId: bigint): Promise<void> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new NotFoundException("Project not found.");
    }
    if (project.userId !== userId) {
      throw new ForbiddenException("You don't have permission to delete.");
    }
    await this.projectRepository.deleteProject(id, userId);
  }

  async getProjectWithFeedbacks(id: string, userId: bigint): Promise<Project> {
    const project = await this.projectRepository.getProjectWithFeedbacks(
      id,
      userId,
    );
    if (!project) {
      throw new ForbiddenException("Project not found or access denied.");
    }
    return project;
  }

  async getProjects(userId: bigint): Promise<Project[]> {
    return this.projectRepository.getProjects(userId);
  }
}
