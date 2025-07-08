import { Project } from "./project.entity";
import { CreateProjectDto, UpdateProjectDto } from "src/types/project.type";

export const IProjectRepository = Symbol("IProjectRepository");

export interface IProjectRepository {
  createProject(data: CreateProjectDto): Promise<Project>;
  updateProject(id: string, data: UpdateProjectDto): Promise<Project>;
  deleteProject(id: string, userId: bigint): Promise<boolean>;
  getProjects(
    userId: bigint,
    page: number,
    pageSize: number,
  ): Promise<{ projects: Project[]; total: number }>;
  findById(id: string): Promise<Project | null>;
  getProjectWithFeedbacks(id: string, userId: bigint): Promise<Project | null>;
}
