import { get, post } from "@/api";
import { Project } from "@/types/project";

export const getProjects = async (): Promise<Project[]> => {
  const response = await get("/project");
  console.log(response);

  return response.data;
};

export const createProject = async (title: string): Promise<Project> => {
  if (!title.trim()) {
    throw new Error("Project title cannot be empty.");
  }
  const response = await post("/project", { title });
  return response.data;
};
