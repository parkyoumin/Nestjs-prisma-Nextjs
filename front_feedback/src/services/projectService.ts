import { post } from "@/api";
import { Project } from "@/types/project";

export const createProject = async (title: string): Promise<Project.Item> => {
  if (!title.trim()) {
    throw new Error("Project title cannot be empty.");
  }

  try {
    const response = await post("/project", { title });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to create project.";
    console.error("API Error in createProject:", errorMessage);
    throw new Error(errorMessage);
  }
};
