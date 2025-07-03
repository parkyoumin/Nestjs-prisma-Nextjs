import { Project } from "./project.entity";
import { CreateProjectDto, UpdateProjectDto } from "src/types/project.type";

export const IProjectRepository = Symbol("IProjectRepository");

export interface IProjectRepository {
  createProject(data: CreateProjectDto): Promise<Project>;
  updateProject(id: string, data: UpdateProjectDto): Promise<Project | null>;
  deleteProject(id: string, userId: bigint): Promise<boolean>;
  findById(id: string): Promise<Project | null>;
  findProjectWithFeedbacks(id: string, userId: bigint): Promise<Project | null>;
  getProjects(userId: bigint): Promise<Project[]>;
}
