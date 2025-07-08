import { get, post, put, del } from "@/api";
import { Project } from "@/types/project";
import { UnifiedResponse } from "@/types/api";

export const getProjects = async (
  page: number,
  pageSize: number,
): Promise<UnifiedResponse<{ projects: Project[]; total: number }>> => {
  return get<{ projects: Project[]; total: number }>("/project", {
    params: { page, pageSize },
  });
};

export const getProject = async (
  id: string,
): Promise<UnifiedResponse<Project>> => {
  return get<Project>(`/project/${id}`);
};

export const createProject = async (
  title: string,
): Promise<UnifiedResponse<{ createdId: string }>> => {
  if (!title.trim()) {
    throw new Error("Project title cannot be empty.");
  }
  return post<{ createdId: string }>("/project", { title });
};

export const updateProject = async (
  id: string,
  title: string,
): Promise<UnifiedResponse<null>> => {
  if (!title.trim()) {
    throw new Error("Project title cannot be empty.");
  }
  return put<null>(`/project/${id}`, { title });
};

export const deleteProject = async (
  id: string,
): Promise<UnifiedResponse<null>> => {
  return del<null>(`/project/${id}`);
};
