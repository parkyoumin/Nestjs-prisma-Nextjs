import { Project } from "./project.entity";
import { CreateProjectDto, UpdateProjectDto } from "src/types/project.type";

export const IProjectRepository = Symbol("IProjectRepository");

export interface IProjectRepository {
  createProject(data: CreateProjectDto): Promise<Project>;
  updateProject(id: string, data: UpdateProjectDto): Promise<Project | null>;
  findById(id: string): Promise<Project | null>;
  deleteProject(id: string, userId: bigint): Promise<boolean>;
  findProjectsByUserId(userId: bigint): Promise<Project[]>;
}
